# 64｜BigCell：用流匹配与共享滑窗，从 2048² 图块走向 32768² WSI 生成

**论文**：BigCell: Generating Gigapixel Whole-Slide Images；arXiv:2610.14261v1，首发 2026-10-09；NeurIPS 2026 正式接收（decision: Accept (poster)，Atlanta Poster Session 1，2026-12-10；官方收录页 poster/152972，OpenReview forum `OyI7kjl92B`）。**track 未核实**：NeurIPS 公开数据只写 eventtype=Poster、track 字段为空，主会与 Evaluations & Datasets 轨在官方站点上不可区分；要确认需登录 OpenReview 查看 venueid（该站有验证码，未绕过）。
**定位**：flow matching 条件生成、UNI-2 嵌入网格、全局潜画布速度融合、自适应窗口调度与 8k 文生图。不是伪影修复。
**精读核验**：2026-10-22 核对完整摘要、主文 §3–6、Table 1–4、Fig. 3 与作者代码/资源说明；2026-10-26 补跑官方权重的推理实测（见 §5），并重写为可自学的版本。数据计数差异（正文 15,996,332 vs README 15,966,332）仍未消解。

## 30 秒看懂

**一句话**：BigCell 用一个只会画 2048² 的流匹配模型 + 一张全局蓝图，在推理期把重叠窗口每一步的"速度"融合到同一张 canvas 上，一直画到 32768²。

**问题**：生成模型停在 patch 级（原生最多 1024²），而切片级监督——诊断报告、癌种、分级——在临床天天产出，却挂不到某个 256² 小块上。监督粒度与生成粒度对不上。

**瓶颈**：训练成本。1600 万张 2048² tile，单卡乐观 10 tile/s，一个 epoch 约 18.5 天；而且分布指标与配对相似度会打架——它的 Virchow-2 FD 907 差于 LRDM 的 731，但配对相似度更高。

**insight**：重叠窗口平均的是**速度**而不是像素。每一步所有窗口各自给意见、按位置平均成全局速度场，整张画布一起走一步：没有哪个窗口能单方面决定某个位置，接缝因此消失；共享画布又让下一步所有窗口都看得见变化——不是"各画一块再拼"，是每步都在重新协商。

## 3 分钟讲清

**方法（按顺序）**：
1. 条件：每 256² 提一个 UNI-2 特征，拼成 8×8×1536 蓝图网格；只有纯文本场景才经过 CGM（报告 → TITAN → 327M 流匹配）生成网格。
2. 画师：2048² 经 FLUX.2 VAE 压成 256×256×32 latent，SiT（DiT 变体）学速度 $\varepsilon-x$，20 步 Euler 就够。
3. 大图：维护全局 latent 画布与全局蓝图，取重叠 2048² 窗口（步长 1024），每步按位置平均各窗口速度。
4. 加速：用 CFG 有条件/无条件速度差的 L1 范数当重要性，第一步全算，之后只重算前 $r$ 比例窗口、其余复用缓存。
5. 解码：分块 VAE 解码成大图或金字塔 TIFF。
6. 可选增广：真实图加噪到 $t'=0.5$（布局在、形态糊），再用本类别文本条件往 $t=0$ 去噪。

**作者证据在哪**：Table 1（8k 相似度 TITAN 0.956 / MOOZY 0.973，尾部 tile V2-5th 0.737 对 PixCell 0.632；Virchow-2 FD 907 对 LRDM 731）、Fig. 3（32k 调度 $r=0.25$：4.97 h / TITAN 0.951 对全量 15.6 h / 0.957）、Table 2（MedGemma 报告一致率 46%）、Table 3–4（文生图与 PANDA 4-shot）、§4 的病理医生实验（总体检测准确率 55.3%，95% CI 50–61%，医生间 κ=0.020）。本机实测见第 5 节。

**和上一代的区别**：同组 LRDM → ZoomLDM → PixCell 的尺度扩展；与 RestorePath 共享"全局画布"思想，但一个生成新图、一个修复已有受损图——BigCell 没有"保留原纹理"这一约束；与 STREAM 相反，它仍把基础模型特征当条件而非生成对象。

**讲 PPT 用这张**：Fig. 3 的调度表（15.6 h / 0.957 → 4.97 h / 0.951），配 Table 1 里"相似度高但 FD 差"的背离——一张说加速是真的，一张说指标测的不是同一件事。

## 0. 零基础导读：先看懂三个词

| 词 | 一句话 |
|---|---|
| **WSI（全切片图像）** | 一块组织切片被扫描成的整张超高清照片，动辄几万×几万像素。病理医生看的就是它 |
| **吉像素（gigapixel）** | 10 亿像素。32768×32768 ≈ 10.7 亿 |
| **patch（图块）** | 把大图切出来的小方块，常见 256×256。以前的生成模型只会画一块 256² 或 1024² |

**为什么以前的模型不够用**：一张 32k 切片能切出一万多块小方块。模型一块块画，每块单看都像组织，拼起来却不成立——染色对不上，肿瘤细胞长进正常组织里。病理医生靠整张图的结构做诊断，所以"每块都好"不等于"整张对"。

**摘要只需要记住一句话**：怎么让只会画小块的模型，画出一整张 32k 的图。

## 1. 问题及研究位置

**核心矛盾不是图不够大，是监督粒度对不上。**

- 生成模型停在 patch 级（最大原生 1024²），病理医生看的是整张切片。
- 切片级标签（诊断报告、癌种、分级）在临床里天天产出，等于是免费的；图块级标注极贵——论文引用自己的前作：标注**一张**切片的图块要 40 小时病理医生时间。
- 一条"前列腺癌 Gleason 4+3"的标签挂不到某个 256² 小块上，它是整张切片的属性。

所以作者的论证是：**生成器必须提到切片级，否则大规模可得的监督永远用不上。**

**为什么自然图像的滑窗方法搬不过来**：自然场景可以靠局部自相似拼大图；WSI 有全局约束——染色必须全局一致，细胞形态必须和周围组织类型相容。这些约束跨越几千像素，局部独立生成会破坏它们。

**同组前作谱系**（重要，影响怎么读实验）：LRDM → ZoomLDM → PixCell → BigCell，全部出自 Stony Brook 的 Samaras 组。Table 1 里五个基线中三个是自家前作，用的都是公开权重、同一评测流程，合规；但真正独立的对手只有 CytoSyn 和 MuPaD。

## 2. 核心方法和数据流

```text
真实 WSI → 每 256² 提 UNI-2 → 密集条件网格（蓝图）
或：病理报告 → TITAN 文本编码 → CGM 流匹配 → 32×32×1536 网格
  → BigCell-tile：FLUX.2 VAE 空间里的流匹配 Transformer
  → 在全局 latent 画布上逐步运行重叠 2048² 窗口
  → 每步把各窗口的速度按位置平均 → 整张画布一起更新
  → 用条件/无条件速度差判重要性，只重算前 r 比例窗口
  → 分块 VAE 解码 → 大图 / 金字塔 TIFF
```

### 3.1 画师本体

2048² 图经 VAE 压成 256×256×32 的 latent（空间缩 8 倍）。模型是 SiT（SiT-XL/2，845M 参数），输出**速度**不是图像：

$$v_\theta(z_t,\,t,\,y)\;\approx\;\varepsilon - x$$

流匹配只有三行：训练时在干净 latent $x$ 和噪声 $\varepsilon$ 之间拉直线 $z_t=(1-t)x+t\varepsilon$；这条直线的方向恒为 $\varepsilon-x$，模型学的就是它；采样时从 $t=1$ 倒走到 $t=0$，每步 $z\leftarrow z-\Delta t\,v$，20 步 Euler 就够。

**SiT 不是新架构**：它就是 DiT 的一个变体（2024 ECCV，Ma et al.），BigCell 只是引用它当积木，没改结构。任何 DiT 类骨干都能替。

条件注入：2048² 切成 8×8 个 256² patch → 各提一个 1536 维 UNI-2 特征 → 8×8×1536 网格，经 cross-attention 注入。注意规模对比：条件只有 **64 个 token**，图像 token 是 $(256/2)^2=$ **16384 个**。一张 64 格的缩略地图指挥 16384 个 token 落笔。

### 3.2 滑窗：平均的是"速度"，不是"像素"

要画 $H\times W$，先准备全局 latent 画布（32k 图是 4096×4096×32）和全局蓝图网格（128×128×1536）。每一步：

1. 在画布上取重叠窗口（2048 像素 = 256 latent，步长 1024 = 128 latent）
2. 每个窗口各自跑一次 tile 模型，得到自己那块的**速度**
3. 按位置把所有窗口的速度**平均**成全局速度场，整张画布一起走一步

$$\bar v(x)=\frac{\sum_i v_i(x)\,\mathbf 1[x\in W_i]}{\sum_i \mathbf 1[x\in W_i]}$$

**为什么平均能保证一致**：重叠区的两个窗口看到同一片组织但上下文不同，必然给出略有差异的意见；平均之后没人能单方面决定这个位置，接缝就消失。而且画布是共享的，这一步改了什么，下一步所有窗口都看得见。

**最容易误解的一点**：不是"各自画完再拼图"，是每一步都投票、都改同一张画布，20 步全程如此。平均速度比平均像素更好，因为每一轮都在重新协商。

**窗口数**：32k 图、窗口 2048、步长 1024 → 31×31 = **961 个窗口**（不重叠只要 256 个）。多出来的约 3.75 倍计算就是重叠的代价。

滑窗这层**不碰任何参数**，所以能直接套在别人的生成器上——作者就是这么把 PixCell、CytoSyn、MuPaD 塞进同一流程当基线的。

### 3.3 加速：用 CFG 的副产品判重要性

CFG（classifier-free guidance）是通用技巧：训练时随机丢条件，推理时同时算"有条件"和"无条件"两路，再放大条件那侧：

$$\tilde v = v_\text{无} + w\,(v_\text{有} - v_\text{无}),\quad w=2.0$$

代价是每步要算两遍。BigCell 把这个"额外算出来的东西"直接用上：

$$I_{ij}(t)=\big\|\,v_\theta(z_{ij},t,y_{ij}) \;-\; v_\theta(z_{ij},t,\varnothing)\,\big\|_1$$

拆开看：两个**形状相同**的速度张量（256×256×32）逐元素相减，取 L1 范数（所有元素取绝对值再求和）→ 得到一个标量。差小说明"给不给蓝图，模型画得差不多"（背景、均匀间质），可以跳过；差大说明完全靠蓝图（肿瘤边界），必须算。

策略：第 1 步全算，之后每步只重算重要性最高的前 $r$ 比例，其余复用缓存速度。计算量约降到 $1/r$。$r=0.25$ 时：4.97 小时（全量 15.6 小时），TITAN 相似度 0.951 vs 0.957。

### 3.4 文本条件与增广

CGM 是 UNI 特征空间里的生成器，把 TITAN 文本嵌入映射成蓝图网格。所以两步：文字 → CGM → 网格 → BigCell → 8k 图。

增广则**不从零生成**，而是"推到中间再拉回来"：取真实图 $y_0$，加噪到 $t'=0.5$（布局还在、形态糊掉），再用 CGM 在本类别文本条件下往 $t=0$ 去噪。条件是本类别，所以只会变成"同一类别的另一个样本"，不会跨类。全局结构保住，局部形态被换掉——这是"同类别的多样性"，专治每类只有 1 张图的情况。

**为什么是 0.5**：$t'\approx0$ 时去噪基本回到原图，多样性为零；$t'\approx1$ 时布局全丢，标签不一定还对。0.5 是折中。**主文没给 $t'$ 的消融**，所以这是默认选择，不是调出来的最优值。

## 3. 论文证据与实验范围

以下为主文原表及 Fig. 3 的作者报告，未复算。8k 条件生成比较用 100 个 held-out ROI；32k 调度比较用 256 张 held-out 切片；文生图评价用 150 份未参与训练的患者报告。

| 证据 | BigCell | 对照或边界 |
|---|---|---|
| Table 1，8k 切片级相似度 TITAN/MOOZY | 0.956 / 0.973 | PixCell 0.941 / 0.900 |
| Table 1，尾部 tile 相似度 V2-5th | 0.737 | PixCell 0.632、CytoSyn 0.502；**尾部差距大于均值差距** |
| Table 1，Virchow-2 Fréchet distance（越低越好） | 907 | LRDM 731、ZoomLDM 815；BigCell 不是所有分布指标最优 |
| Table 2，MedGemma 报告诊断一致率 | 46% | PixCell 42%；这是生成图与参考图所产报告之间的一致，不是临床准确率 |
| Fig. 3，32k 调度 r=0.25 | 4.97 h，TITAN 0.951 | 全量 15.6 h、0.957；单张 Intel Max 1550 上的墙钟，不是其他显卡的保证 |
| Table 3，8k 文生图 TITAN Recall@5 | 0.655 | 与真实配对持平；但 Recall@1 0.169 < 真实 0.211 |
| Table 4，PANDA 4-shot κ | 0.583 | 真实基线 0.493；相对增益约 18%，不是 18 个百分点 |

### 为什么 FD 和相似度会打架

这是全文最值得注意的一处。相似度是**配对**的（生成图 vs 它自己的参考图），FD 是**不配对**的（生成裁块的分布 vs 真实裁块的分布）。所以：

- **相似度 = 听话程度**（有没有照蓝图长）
- **FD = 像不像真组织**（统计分布）

LRDM、ZoomLDM 拿到最好的 FD 和最差的相似度（TITAN 0.531 / 0.708），等于"生成的组织看着真，但跟参考图对不上"——在画好看的组织，不是画这张切片。BigCell 反过来。作者自己的解释只有一句：FD 用未配对裁块算，不衡量与条件的一致性。

另注意一处**循环风险**：CGM 用 TITAN 编码报告，Table 3 又用 TITAN 算图文相似度，等于用自家编码器评自家生成。好在并列报了 PRISM（0.454 vs 真实 0.499）。

### 病理医生实验（全文最诚实的一段）

3 位执业病理医生各做 100 次试验，每次看一张 8k 图，从 4 份候选报告（1 真 3 假）里选，同时判真伪。50 真 50 假。

| 项目 | 数字 |
|---|---|
| 报告匹配准确率 | 合成 0.57 / 真实 0.57（等同） |
| 合成图被当成真的比例 | 55% |
| 真实图被正确认出的比例 | 66% |
| 总体检测准确率 | 55.3%（95% CI **50–61%**） |
| 三位医生之间一致性 | **κ = 0.020**（等于随机） |

诚实之处在于主动报了三件不利事实：CI 包含 50（与随机猜统计上不可区分）、医生之间互相都不一致（说明任务本身没分辨力）、0.57 有任务设计的天花板。**反过来也不能过度解读**：55.3% 只说明人眼在这个任务上分辨不出，不能反推"合成图可用于诊断"。

## 4. 复现与审计重点

### 我实测到的（2026-10-26，gpu04 RTX 4090D 24G，共享卡）

| 任务 | model_evals | 耗时 | 备注 |
|---|---|---|---|
| 2048 单窗口 | 40 | 33 s | 峰值显存 **11.2 GB** |
| 8192 全量（49 窗口） | 1960 | 28.7 min | — |
| 8192 调度 r=0.25 | 592 | 8.6 min | **3.33× 快**，与全量 PSNR 29.66 dB |

同 seed 重跑两次 PNG sha256 完全一致。所以论文的 3× 加速在这张卡上是真的。接缝数值检查有 1.3–1.4 倍的边界梯度痕迹（真实参考图同算法 0.988），肉眼不可见。

**注意**：这组数字不是论文 Table 1 的指标（没装 Virchow-2 / H-Optimus-1 / TITAN / MOOZY），只是跑通性和加速比的验证。完整记录见 `~/code/bigcell-repro-artifacts/REPRO.md`。

### 训练成本（判断值不值得投入的关键）

1600 万张 2048² tile。单卡乐观 10 tile/s → **1 个 epoch 约 18.5 天**；论文用的是 Argonne Leadership Computing Facility 超算（几百张 A100），1 epoch 几小时。**所以对单卡/共享集群，从零训到 2048 不可行；但 256 阶段（token 少 64 倍）和基于已发布权重的微调都可行。**

### 复现依赖

- 官方代码提供 `bigcell/`、`cgm/`、`scripts/generate_from_grid.py`、`generate_from_text.py`、`augment.py`，不是只有样例图。
- 8k 图像条件生成只需两样外部件：**FLUX.2-dev VAE + UNI2-h**。不需要 TITAN、不需要 CGM——起步门槛比想象低。
- 文本条件那条才需要 TITAN，且 README 要求 transformers 4.56.2。TITAN、UNI2-h 都有访问门槛，"有下载链接"不等于"无授权"。

## 5. 建议阅读顺序

零基础：§0 三个词 → Fig. 2 总览 → §3.1 画师 → §3.2 滑窗（只看平均公式）→ §3.3 调度（只看重要性公式）。
有基础：Fig. 2 → §3.1–3.3 → §4 指标口径 → Table 1–2（相似度与 FD 的背离）→ Fig. 3 → Table 3–4 → §6。

## 6. 前后关联

- [LRDM](56-lrdm.md)：条件网格 + 每步重叠窗口共识的前序，同组。
- [ZoomLDM](58-zoomldm.md)：跨尺度联合生成 vs 更大 native tile 的路线差别。
- [PixCell](89-pixcell.md)：同组，原生 1024²，BigCell 的直接前身。
- [RestorePath](49-restorepath.md)：共享画布思想相通，但一个生成新图、一个修复已有受损图；BigCell 没有"保留原纹理"的约束。
- [STREAM](65-stream.md)：BigCell 仍把基础模型特征当条件；STREAM 改成直接生成特征。
- [CytoSyn](66-cytosyn.md)：原生分辨率低（224²）导致大图全局结构崩坏的对照。

## 原文摘要

> Whole-slide images (WSIs) are gigapixel-scale digital scans of histopathology tissue and serve as the primary basis for cancer diagnosis. Existing histopathology generative models operate at the patch scale, producing fixed-size tiles of at most 1024$\times$1024 pixels which encompass only a small fraction of the WSI. In contrast, text reports for clinical diagnoses and slide-level diagnostic labels -- the supervision that exists at scale -- operate at the whole-slide level. We present BigCell, the first approach to generate coherent whole-slide histopathology images at native gigapixel resolution. BigCell trains a flow-matching transformer at 2048$\times$2048 pixels on over 120,000 publicly available WSIs spanning multiple organ types. Conditioning on embeddings from pathology foundation models and using an inference-time sliding-window pipeline, BigCell generates coherent images of up to 32,768$\times$32,768 pixels, outperforming prior tile generators on both tile-level and slide-level fidelity metrics. To make gigapixel synthesis practical, we introduce an adaptive scheduling strategy that prioritizes important slide regions, speeding up image generation by over 3\ttimes with minimal quality degradation. Furthermore, we propose the first text-to-image synthesis at 8k resolution by training a separate model that produces dense conditioning grids directly from pathology text reports. We demonstrate that augmenting with synthetic samples improves slide-level few-shot classification performance by up to $18 \%$ over baselines trained on real data.

*来源：[arXiv v1 摘要页](https://arxiv.org/abs/2610.14261v1)，完整原文；保留源摘要中的 TeX 写法，包括 `3\ttimes`，不自行改写原文。*

## 7. 链接

- [摘要与首发日期](https://arxiv.org/abs/2610.14261)
- [完整论文](https://arxiv.org/html/2610.14261v1)
- [作者方法、结果与样例](https://histodiffusion.github.io/docs/projects/bigcell/)
- [官方代码](https://github.com/cvlab-stonybrook/BigCell)
- [模型](https://huggingface.co/StonyBrook-CVLab/BigCell) · [样本数据](https://huggingface.co/datasets/StonyBrook-CVLab/BigCell-sample-data)
- [NeurIPS 2026 官方收录页](https://neurips.cc/virtual/2026/poster/152972)
