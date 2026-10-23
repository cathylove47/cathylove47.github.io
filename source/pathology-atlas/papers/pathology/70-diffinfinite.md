# 70｜DiffInfinite：随机 patch 并行扩散，把“掩码—图像”成对合成推到 WSI 尺度

**论文**：DiffInfinite: Large Mask-Image Synthesis via Parallel Random Patch Diffusion in Histopathology；NeurIPS 2023 Datasets and Benchmarks Track（官方 proceedings 页面与论文首页均标注该 track）；arXiv:2306.13384；DOI 10.52202/075280-3413。  
**定位**：主任务是条件式大图生成，不是伪影修复评测。先合成组织分割掩码，再从噪声生成与掩码配对的 H&E；附录另展示了基于真实图像的局部 inpainting 概念实验，不能据此说模型完全不支持图像输入，也不能当作已经验证了真实伪影修复。
**精读核验**：2026-10-22 核对 NeurIPS 官方 proceedings 摘要页、官方 PDF 正文 §1–6、补充材料 A（数据）与 F（采样细节）、官方仓库的采样实现与 README；未下载权重、未运行采样、未复算指标。

## 原文摘要

> We present DiffInfinite, a hierarchical diffusion model that generates arbitrarily large histological images while preserving long-range correlation structural information. Our approach first generates synthetic segmentation masks, subsequently used as conditions for the high-fidelity generative diffusion process. The proposed sampling method can be scaled up to any desired image size while only requiring small patches for fast training. Moreover, it can be parallelized more efficiently than previous large-content generation methods while avoiding tiling artifacts. The training leverages classifier-free guidance to augment a small, sparsely annotated dataset with unlabelled data. Our method alleviates unique challenges in histopathological imaging practice: large-scale information, costly manual annotation, and protective data handling. The biological plausibility of DiffInfinite data is evaluated in a survey by ten experienced pathologists as well as a downstream classification and segmentation task. Samples from the model score strongly on anti-copying metrics which is relevant for the protection of patient data.

*来源：[NeurIPS 2023 官方摘要页](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f64927f5de00c47899e6e58c731966b6-Abstract-Datasets_and_Benchmarks.html)，与 [官方 PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/f64927f5de00c47899e6e58c731966b6-Paper-Datasets_and_Benchmarks.pdf) 首页摘要一致。*

**摘要中文解释**：作者要生成“任意大”的病理图，同时保住远距离结构关系。做法是两级：先生成分割掩码（相当于先画组织布局草图），再让掩码作为条件去生成高清图像。采样方法可以扩到任意尺寸，但训练只需要小 patch；并行度比此前的大图生成方法更高，且避免拼贴接缝。训练上用 classifier-free guidance 把“少量稀疏标注 + 大量无标注”结合起来。作者用 10 位病理医生的问卷、下游分类/分割任务，以及反复制（anti-copying）指标来评价。

## 1. 三分钟摘要与推荐理由

**具体问题**：训练一个组织分割模型需要“图 + 像素级掩码”成对数据；但一张 WSI 是十万乘十万像素级，病理医生标注极慢，而且数据受隐私法规限制不能随便共享。已有生成模型只能出 224×224、384×384、256×128 这类小图（§1 引用三例 GAN 工作），不足以提供 WSI 级的上下文。

**输入/输出**：在主实验中，输入是“高层上下文提示”（例如腺癌亚型）；模型先生成低分辨率分割掩码，插值到目标尺寸，再以掩码为条件在 latent 空间随机 patch 去噪，输出大幅 H&E 与其配对掩码。主实验从噪声生成整幅图，不要求输入一张受损患者图；附录的局部 inpainting 演示是另一个使用场景。

**核心机制（一句话）**：给大画布上的每个 latent 位置记录去噪进度，每轮优先从落后位置选取随机窗口，只把本轮尚未更新的位置写回；邻域改变、窗口反复重叠，使采样不被固定拼贴边界限制。论文按从 T 到 0 的时间标记描述，代码按从 0 递增的进度索引实现，下面分别说明。

**和“修复”的区别（读这篇最容易混淆的点）**：

| 维度 | DiffInfinite | 修复/Inpainting（如 [RestorePath](49-restorepath.md)） |
|---|---|---|
| 是否有真实输入图 | 主实验整幅图从高斯噪声生成；另有局部 inpainting 演示 | 有，未受损区域提供真实观测 |
| 掩码来源 | 先由模型合成，或使用真实组织分割掩码 | 通常标出待修复区域，而非组织类别 |
| “已写回像素”的含义 | 同一去噪轮次已经更新的位置，不重复覆盖；下一轮仍会更新 | 目标是保留真实观测，是否严格逐像素不变取决于实现 |
| 评价口径 | 分布相似度（IP/IR/FID）+ 病理医生辨别 + 下游任务 | 与真值的像素/结构误差（PSNR/SSIM/LPIPS） |

**为什么值得读**：逐位置进度与随机窗口提供了可借鉴的大画布调度方式；迁移到修复时仍需另加观测区域约束。它也是 [LRDM](56-lrdm.md)、[ZoomLDM](58-zoomldm.md)、[BigCell](64-bigcell.md) 这条“小 patch 训练、大图采样”路线的早期相关工作。评价还包含医生辨别、下游任务和数据复制检查，比单看 FID 更完整。

**别误解**：它是**单队列**模型（41 张肺 WSI，腺癌 + 鳞癌），不是病理基础模型；"Infinite" 指采样可扩展，不是训练数据无限。

## 2. 问题及研究位置

三个瓶颈（§1）：标注成本、隐私法规、WSI 级尺度。论文把“大图生成”还原成 outpainting/inpainting 问题，然后指出既有路线的具体缺陷：

- **GAN 系**（§2）：能做 image-to-image，但大区域补全易失真，且分辨率远小于 WSI。
- **Palette / RePaint / ControlNet**（§2）：把扩散用于补全，但依赖预训练模型与掩码重采样，不是为“任意尺寸 + 长程相关”设计。
- **DiffCollage**（§2 与 §4.1 讨论）：用重叠 patch 并行，但**假设条件独立**——即某区域密度只依赖一个邻域。作者明确不接受这个假设：病理大图的密度是长程相关的。代价是 DiffInfinite 只能“间接”近似整幅图的逆向过程（多个 patch 级逆向过程拼起来）。
- **8-Diff**（同期工作）：随机坐标训练可出无限分辨率，但**不在 latent 空间**，没有压缩，采样代价高。

研究位置可以这样记：DiffInfinite = latent 扩散（省算力）+ 随机 patch 并行（省步数、去接缝）+ 两级条件（掩码定结构，文本/类别定亚型）+ 半监督 CFG（把无标注数据变成多样性来源）。

## 3. 核心方法和数据流

### 3.1 两级生成（论文 Fig. 2）

```text
[第一级：掩码]
上下文提示（如 Adenocarcinoma 亚型）
  → 掩码扩散模型（128×128 掩码，2 类，latent 4×16×16）
  → 线性插值放大到目标尺寸（如 2048×2048）
  → 掩码清洗：取整、边界伪影置 0（unknown）、min-pooling 抹掉过小区域（补充材料 F）

[第二级：图像]
初始化：图像 latent 从高斯噪声开始；代码进度张量 k 全为 0
重复直到所有位置达到源码的终止进度 sampling_steps - 1：
  1. 在进度最小的位置随机选中心，裁出窗口及其组织类别掩码
  2. 用 time_pairs[k_min] 取得真正的扩散时间 t 和下一时刻 t_next
  3. 对窗口内各类别分别做 DDIM + CFG：
        ε̃ = (1+ω)·ε_θ(z_t, t, c_n) − ω·ε_θ(z_t, t, ∅)
  4. 按掩码类别组合结果，只写回 k == k_min 的位置
  5. 这些位置的代码进度 k 加 1；全图追平后更新参考缓冲区
解码：latent 分块 + Hann 窗重叠加权 → 像素图（补充材料 F）
```

**训练与推理是两件事**：训练就是普通的 512×512 patch 级扩散（一张 U-Net），没有任何“大图”逻辑；"无限尺寸"只存在于采样阶段。这一点决定了复现成本：训练像常规 LDM，采样才是新东西。

### 3.2 数学骨架（§4.1）

记大图 latent 为 $Y\in\mathbb{R}^D$，模型只在小 patch $Z\in\mathbb{R}^d$ 上训练。定义投影集合 $\mathcal{C}=\{\mathrm{proj}_I: \mathbb{R}^D\to\mathbb{R}^d\}$，每个投影取 $d$ 个连通像素。关键假设（Assumption 1）：任何投影后的分布都等于 patch 分布，$\mathrm{proj}(Y)\sim Z$。

采样时每步随机取 $m$ 个不重复投影覆盖全部 latent 像素，各自走一步逆向过程，得到 $m$ 个重叠估计，然后**逐像素取“第一个算出的值”**：

$$[y_{t-1}]_i = [z^j_{t-1}]_l,\quad j=\min\{j'\mid i\in I_{j'}\}$$

这个“先到先得”是同一去噪轮次中的硬写回，不是速度或像素平均；已经写过的位置不会在该轮重复更新，但下一轮仍会继续去噪。它减少了重复覆盖，并不保证任何相邻窗口估计都完全一致。

**两种时间记法不能混用**：正式版 §4.3 用 $L_T\equiv T$ 初始化时间状态；在从 $t+1$ 走到 $t$ 的一轮，只更新仍为 $t+1$ 的位置，随后把它们标为 $t$。源码 `times` 则从 0 起，记录已完成的进度，更新时加 1，并通过 `time_pairs` 映射到下降的扩散时间。源码停止条件是 `sampling_steps-1`；复现时应核对终止条件与实际执行的时间对，而不能把进度索引直接当成论文的扩散时间。

**CFG 的半监督改造（§4.2）**：标准 CFG 在同一数据集上同时训条件与无条件两支。这里拆成两个数据集：有标注稀疏集 $q_1$ 用于条件支，无标注集 $q_0$ 用于无条件支：

$$(z_0,c)=\begin{cases}(z_0,\varnothing)\sim q_0(z_0) & u\ge p_{\text{unc}}\\ (z_0,c)\sim q_1(z_0,c) & \text{otherwise}\end{cases}$$

$p_{\text{unc}}=0.5$（补充材料）。直觉：无条件支见过 25 万张无标注 patch，学到“病理纹理长什么样”；条件支只见过 4,781 张有标注 patch，学到“掩码类别 → 纹理”。采样时 $\omega$ 越大越听条件、越不随机。

**采样加速的论证（§4.3、Fig. 3）**：滑动窗口法（DiffCollage）每扩一块都要以已生成为条件，且只能 2 或 4 路并行；随机 patch 法最终会让任意两块都有机会重叠，并行度只受算力限制，因此达到同一覆盖所需的总步数显著更少。

### 3.3 代码层面对应（`random_diffusion.py`，已读源码）

- 选取窗口：`get_value_coordinates(times)` 取时间戳张量最小值的所有坐标，再随机打乱取一个 → 严格实现“落后优先”。
- 步长表：`torch.linspace(-1, 999, steps+1)` 取整后反转，所以相邻步的 $t$ 间隔不均匀（不是每步 −1）。
- 双缓冲：`img_stack[:,0]` 保存上一个完整状态，`img_stack[:,1]` 保存当前状态；某轮所有像素都追平时把 `[:,0]` 同步过去。这是实现“同一时刻所有窗口看到同一张图”的工程手段。
- 条件尺度：类默认 `cond_scale=3.0`，内部再 `+1` 传给 `ddim_multimask`；notebook 里同样写法。
- latent 尺度：源码取 `vae.encode(x).latent_dist.sample()/50`，分块解码前把 latent 乘回 50。这是该仓库的自定义尺度，不能写成所有 Stable Diffusion VAE 都通用的缩放因子。
- 解码：`hann_tile_overlap` 用四种裁切配置（整图、竖切、横切、交叉切）做加权融合，专门压掉分块解码接缝。

## 4. 论文证据与实验范围

**数据（补充材料 A，Table 3）**：41 张 H&E 肺 WSI（腺癌与鳞癌各半），Aperio 扫描；40 个标注类别（Carcinoma 37%、Stroma 36%、Necrosis 3.5%、Other 23.5%）；图像训练集 **4,781 张有标注 512² patch + 255,643 张无标注 patch**，90/10 分层切分；掩码生成训练集 1,183 张 2048² patch。注意：正文说 0.25 µm/px，Table 3 写 0.5 µm/px，二者不一致，引用分辨率时需按表并注明存疑。

**训练配置（补充材料 E）**：图像模型 1000 扩散步、250,000 训练步、batch 128、L2 损失、SD-2-base VAE（latent 4×64×64，即 f=8）、4×RTX 3090 24GB、约 1 周；掩码模型 100,000 步、batch 64、2×A100 40GB、约 4 小时；采样 250 步，单张 3090 推理。这是作者配置，不是最低显存要求。

**质量指标（Table 1 左，512²；作者报告，未复算）**：

| 方法 | IP↑ | IR↑ | IS↑ | FID↓ |
|---|---:|---:|---:|---:|
| Morph-Diffusion | 0.26 | 0.85 | 2.1 | **20.1** |
| NASDM | — | — | **2.7** | **15.7** |
| DiffInfinite (a) | **0.94** | 0.70 | 2.7 | 26.7 |

**必须照实读的负结果**：DiffInfinite 的 FID 比 Morph-Diffusion 差（26.7 vs 20.1），IR 也低（0.70 vs 0.85）；作者自己说这几个指标“only somewhat comparable”，因为两类方法生成的图像类型不同，而且 FID/IS 本就不适合病理（§5.1 引 [68,69]）。IP 0.94 只说明“样本看起来在真实流形上”，不说明覆盖全。

这里按 **NeurIPS 正式版**的 Table 1 表头记 IP/IR：IP 表示样本质量、IR 表示覆盖。arXiv v1 HTML 的相关段落和表头把二者对调，不能混合抄录两个版本的列名。

**大图指标（Table 1 右，2048² 缩到 512² 再算，仅 200 张，故不报 FID）**：

| 变体 | IP↑ | IR↑ |
|---|---:|---:|
| DiffCollage | 0.94 | 0.22 |
| DiffInfinite (b) 用真实掩码 | 0.95 | 0.48 |
| DiffInfinite (c) 用生成掩码 | **0.98** | 0.44 |
| (b)+(c) 混合 | **0.98** | 0.33 |

IR 从 0.22 提到 0.44–0.48 是这篇最硬的一条：说明滑动窗口法的低覆盖问题（作者归因于 Fig. 11 可见的拼贴伪影）确实被随机 patch 缓解。

**病理医生问卷（§5.2）**：10 位病理医生，平均 8.7 年经验；60 张图（合成/真实各半，512²/2048² 各半）；整体辨别准确率 **63%**，自评置信度均值 **2.22/7**；经验与准确率（r(8)=.069, p=.850）、置信度与准确率（r(8)=.446, p=.197）、答题时间与正确数（r(8)=−.08, p=.826）均无显著相关。医生指出的具体缺陷：部分核染色质过度均匀、细胞/细胞间结构怪异、肿瘤区结构夸张、肿瘤—间质过渡过突兀、部分细胞缺核仁或胞质。

**下游任务（Table 2，balanced accuracy / F1）**：

| 训练数据 | IH1 | IH2 | IH3 | NCT-100K | CRC-7K | PCam-327K |
|---|---:|---:|---:|---:|---:|---:|
| 真实（IH1，3,726 patch） | **0.846** | 0.733 | 0.598 | **0.857** | **0.822** | 0.628 |
| 纯合成（9,974 patch，ω=0） | 0.747 | **0.753** | **0.699** | 0.796 | 0.753 | 0.628 |
| 真实+合成 | **0.852** | 0.732 | 0.637 | 0.847 | 0.811 | **0.641** |

分割（IH2，F1）：真实 0.614±0.009、纯合成 0.471±0.039、真实+合成 **0.710±0.021**。解读要点：纯合成**不能**替代真实数据（IH1 掉 10 点），但在 IH2/IH3 这类“患者变化”漂移集上反而更好；增广在分割上增益最大（+9.6 点），说明合成数据提供的是“新的结构信息”而不只是噪声。跨器官/低分辨率（NCT、CRC、PCam）基本无增益甚至微降。

**反复制指标（Table 5，补充材料）**：真实性分数 $A\in[0.86,0.98]$（tiled / resized 两种切法），$C_T\in[3.29,11.56]$（>0，作者解释为不处于复制甚至略欠拟合）。这些指标只能说明“近邻不重合”，不等于通过隐私审计。

**作者自报的另一个负结果（补充材料 D）**：512² 掩码能较好复现真实掩码的类别频率；但 **2048² 大掩码会系统性失真**——最高频类别被低估，其余类别被高估。这直接影响“用生成掩码训练大图分割”的可信度。

## 5. 复现与审计重点

1. **代码结构已核**：`config/`、`dm.py`、`dm_masks.py`、`random_diffusion.py`、`random_diffusion_masks.py`、`sample_random.py`、`sample_patches.py`、`train.py`、`train_masks.py`、`download.py`、`main.ipynb`、`results/`（含 512² 与 2048² 样例，按 ω 分组）。README 给出一行权重下载：`python download.py --n_classes=5`（也支持 10），以及 Colab 入口。
2. **权重脚本不可静态审计**：`download.py` 用 PyArmor（trial）混淆，无法直接读到下载地址与校验值；要用就得执行它。本次未下载、未运行。
3. **数据不可直接复现**：训练用的是机构内部 41 张肺 WSI，未公开；公开集（NCT-CRC、CRC-7K、PCam）只用于下游评价。复现“同分布生成”需要自有配对数据，不能拿公开集冒充。
4. **代码与论文的超参差异**：论文采样 250 步，`RandomDiffusion` 默认 `sampling_steps=50`、`cond_scale=3.0`（内部 +1）。比较结果时必须统一步数与 ω，否则差异来自配置而非方法。
5. **首个可检验实验（建议）**：固定掩码、随机种子和总步数，做三组对照——滑动窗口 / 随机 patch / 随机 patch + 重叠区加权平均（替代“先到先得”）；指标除 IP/IR 外，加“接缝处的局部梯度能量”和“跨窗口预测方差”。这能直接检验“接缝消失”到底来自随机化还是来自写回规则。此为本站设想，未做。
6. **改进切口（未验证）**：把“已写回像素”换成“真实观测像素钉住”，掩码只覆盖损坏区，就得到与 [RestorePath](49-restorepath.md) 同构的修复调度器；区别在于 DiffInfinite 的时钟是全局统一推进的，修复任务需要“观测区时钟永远为 0”。这条是否比逐层 inpainting 更好，需要实验回答。
7. **不要声称**：3090×4 是作者配置而非最低要求；IP 0.98 不等于病理正确；$A$、$C_T$ 不等于隐私合规。

## 6. 建议阅读顺序

Fig. 2（三级示意：掩码生成 / 随机 patch / 时间戳）→ §4.1 投影与“先到先得”式写回 → §4.2 半监督 CFG → §4.3 随机 patch 与并行 → Fig. 3 步数对比 → Table 1（先看 FID 的负结果，再看 IR 的提升）→ §5.2 医生问卷 → Table 2 下游 → 补充材料 A（数据规模）→ 补充材料 E/F（超参与 Hann 解码）→ `random_diffusion.py` 的 `__call__`。

## 7. 前后关联

- [RestorePath](49-restorepath.md)：同一套“冻结已确定像素 + 逐像素推进”的骨架，但 RestorePath 冻结的是真实观测，目标是还原而非合成；这篇正好补上该笔记里点名的“DiffInfinite 缺口”。
- [LRDM](56-lrdm.md)、[ZoomLDM](58-zoomldm.md)：同属“小 patch 训练、大图采样”，但条件换成基础模型特征/倍率；对比三者如何各自解决“大图一致性”。
- [BigCell](64-bigcell.md)：把“小 patch 生成器 + 全局画布融合”推到 32768²，可看作随机 patch 思路的另一条收敛路径。
- [ArtiDiffuser](57-artidiffuser.md)、[CPathOGen](52-cpathogen.md)：都在做“合成数据增广”，但评价口径与条件控制不同，适合横向比较证据结构。
- [PathLDM](71-pathldm.md)：同样用条件提升生成质量，但条件来自文本报告而非掩码布局；两篇可以对照“条件选什么”这一决策。
- [CytoSyn](66-cytosyn.md)：从单队列模型到生成基础模型的尺度差别，读它能看清 DiffInfinite 的适用边界。

## 8. 链接

- [NeurIPS 2023 官方摘要页（track、DOI、页码）](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f64927f5de00c47899e6e58c731966b6-Abstract-Datasets_and_Benchmarks.html)
- [官方 PDF（正文 + 参考文献）](https://proceedings.neurips.cc/paper_files/paper/2023/file/f64927f5de00c47899e6e58c731966b6-Paper-Datasets_and_Benchmarks.pdf)
- [官方补充材料（数据表、超参、指标定义、Hann 解码）](https://proceedings.neurips.cc/paper_files/paper/2023/file/f64927f5de00c47899e6e58c731966b6-Supplemental-Datasets_and_Benchmarks.pdf)
- [arXiv 题录](https://arxiv.org/abs/2306.13384)
- [官方代码](https://github.com/marcoaversa/diffinfinite)
- [项目页（样例图）](https://marcoaversa.github.io/diffinfinite/)
