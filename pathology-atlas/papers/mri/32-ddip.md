# 32｜DDIP：把 SCD 读成 PF-ODE 上的多尺度 DIP，再把逐切片适配压成整卷一次

**论文**：Deep Diffusion Image Prior for Efficient OOD Adaptation in 3D Inverse Problems，Hyungjin Chung、Jong Chul Ye（KAIST），ECCV 2024（Springer LNCS，DOI 10.1007/978-3-031-73226-3_25）；arXiv:2407.10641（v1 2024-07-15）
**定位**：分布外扩散先验的测试时适配；把 SCD 解释并推广为「沿概率流 ODE 的多尺度深度图像先验」；D3IP 用切片蒙特卡洛把 3D 适配的算力/显存从 $\mathcal{O}(N)$ 降到 $\mathcal{O}(1)$，并可与 3D 求解器、元学习拼接
**精读核验**：2026-11-22 读 arXiv HTML v1 全文（§1–5、附录 0.A–0.F，Table 1–5、Fig. 1–6，摘要逐字取自 arXiv abs）；录用版本经 ECVA ECCV 2024 论文页（编号 9637）与 DOI 10.1007/978-3-031-73226-3_25 核对。官方代码 `hyungjin-chung/DDIP3D`（论文与 README 中的链接为 `HJ-harry/DDIP3D`，同一维护者别名）经 GitHub API 核对目录结构，并读过 `README.md`、`main.py`、`solver_mri_2d.py` 与全部 5 个 `scripts/*.sh`；**代码未运行，权重与样例数据未下载**。

## 原文摘要

> Recent inverse problem solvers that leverage generative diffusion priors have garnered significant attention due to their exceptional quality. However, adaptation of the prior is necessary when there exists a discrepancy between the training and testing distributions. In this work, we propose deep diffusion image prior (DDIP), which generalizes the recent adaptation method of SCD by introducing a formal connection to the deep image prior. Under this framework, we propose an efficient adaptation method dubbed D3IP, specified for 3D measurements, which accelerates DDIP by orders of magnitude while achieving superior performance. D3IP enables seamless integration of 3D inverse solvers and thus leads to coherent 3D reconstruction. Moreover, we show that meta-learning techniques can also be applied to yield even better performance. We show that our method is capable of solving diverse 3D reconstructive tasks from the generative prior trained only with phantom images that are vastly different from the training set, opening up new opportunities of applying diffusion inverse solvers even when training with gold standard data is impossible. Code: https://github.com/HJ-harry/DDIP3D

*来源：arXiv:2407.10641 摘要，与 arXiv HTML v1 首页一致。*

## 中文摘要

> 近年来，借助生成式扩散先验的逆问题求解器因重建质量出众而备受关注。但当训练分布与测试分布之间存在差异时，先验必须做适配。本文提出深度扩散图像先验（DDIP）：通过与深度图像先验（DIP）建立形式化联系，把近期 SCD 这一适配方法推广开来。在这一框架下，我们提出面向 3D 测量的高效适配方法 D3IP，它把 DDIP 加速数个数量级，同时取得更好的性能。D3IP 使 3D 逆问题求解器可以被无缝接入，从而得到在三维空间上连贯的重建。此外，我们表明元学习技术同样可以叠加进来，取得更好的结果。我们证明，仅用与训练集差异极大的模体（phantom）图像训练出的生成先验，也能完成多种 3D 重建任务，这为「无法获得金标准数据来训练」时仍能使用扩散逆问题求解器开辟了新机会。代码：https://github.com/HJ-harry/DDIP3D

*译文：对上方英文摘要逐句对译，未增删、未压缩；专有名词与链接保持原文。*

## 1. 三分钟摘要与推荐理由

> [!IMPORTANT] 一句话直觉
> 发现 [31 号 SCD](31-scd.md) 的关键 bug（适配时用 1 步 CG、采样时却用 5 步 CG，导致前后均值估计打架），把适配与采样统一成沿概率流 ODE 的多尺度 DIP（**DDIP**），再用「整卷共享一套 LoRA + 切片蒙特卡洛期望」推出 **D3IP**，把 $256^3$ 体积适配时间从 6.2 小时压到 40 分钟。

三个值得读的点：

1. **对 SCD 的重新解释具有可操作性**，不是事后附会：把适配损失从 $\operatorname{CG}(\hat{x}_{0\mid t}, 1)$ 改成 $\operatorname{CG}(\hat{x}_{0\mid t}, K)$，CT 上的 SCD 从 35.43 升到 36.31 dB（Table 1），而换成 DDNM/DPS 作后验均值近似时也同样涨（Table 1 中 DDNM `34.92→36.07`、DPS `23.49→31.32`），说明改进来自框架同源性而非某个求解器的巧合。
2. **D3IP 把「每张切片一套 LoRA」换成「整卷共享一套 LoRA」**：对切片做蒙特卡洛采样求期望梯度，显存与算力从 $\mathcal{O}(N)$ 收到 $\mathcal{O}(1)$，$256^3$ 体数据在单张 3090 上从约 6.2 小时降到 **40 分钟**，LoRA 参数量从 2.9 Gb 降到 14.5 Mb。
3. **代价被清楚地写在表里**：`D3IP (base)` 在 3D SV-CT 上只有 31.73 dB，低于 SCD 的 32.91 和 DDIP 的 33.13——「加速」不等于「处处更好」，只有接上 3D 求解器（`D3IP (mbir)` 33.69）或元学习（33.96）才把 CT 拉回来。对幻觉/分布偏移而言，作者指出 SCD 虽压住了模体假椭圆结构但把细节糊掉（Fig. 3 青色箭头、§4.3），适配在「少造假」和「不擦除真实结构」之间存在明确取舍。

> [!WARNING] 本页判断
> 这篇给出了分布外 LoRA 适配的漂亮机制解释和 3D 工程压缩，但只报 PSNR/SSIM/LPIPS，没有给出分类型的幻觉指标；且 `D3IP (base)` 在 CT 上的负迁移也说明「整卷共享参数」并非在所有模态上都稳赚。

## 2. 问题及研究位置

问题：扩散逆问题求解器（DIS）只在「先验分布 $\approx$ 真实分布」时成立。医学成像里金标准数据往往拿不到（CT 只能拿到模体、黑洞成像、cryo-EM 同理），先验与测试分布错配导致伪影与幻觉；已有工作（Renaud 等）证明固定参数的 DIS 在错配下有性能上界，所以需要在测试时微调参数。

SCD 的位置与它的三条限制（作者自述）：

- **逐切片独立适配**：一个体积 $N$ 张切片就要 $N$ 套 LoRA 参数，算力/显存 $\mathcal{O}(N)$，$256^3$ 体积单卡超过 6 小时；
- **相邻切片参数互不相干**，既反直觉也没利用切片间的共同统计；
- **多切片渐进适配并不涨点**——作者观察到 SCD 就算把参数一路带到下一张切片也不改善，这是 D3IP 设计动机的直接来源。

本文位置：不发明新的后验采样器，而是给「测试时改先验参数」提供统一的理论视角（DDIP），再针对 3D 场景做工程化压缩（D3IP）与 3D 增强（`mbir` / `meta`）。

## 3. 核心方法和数据流

DDIP 首先修补了 SCD 的前后端不一致，然后 D3IP 把逐切片独立优化升级为整卷蒙特卡洛期望优化，并能叠加 3D ADMM 或 Reptile 元学习初始化。

```pipeline
1. 测量引导热初始化 | 用伪逆填低频、用两端噪声的球面插值 $\operatorname{slerp}$ 填高频，构造起点 $x_{T'} = \sqrt{\bar{\alpha}_{T'}}\,A^\dagger y + \sqrt{1-\bar{\alpha}_{T'}}\,\epsilon$（$T'=980$）
2. 截断区间内的同源适配 | 仅在 $t \in [\zeta, T-\zeta]$（$\zeta=40$）内更新注入残差块与注意力块的 rank-4 LoRA：最小化 $\|y - A\cdot \operatorname{CG}(D_\theta(x_t), K)\|^2$（与采样保持同一套 $K$ 步近似）
3. 3D 整卷共享升级（D3IP） | 在体积中随机抽取 $K$ 张切片（或 `mbir` 模式下抽连续 $K$ 张算沿切片有限差分 TV）计算平均适配梯度，整卷共用一套 LoRA 参数
4. 后验均值采样推进 | 用适配后的去噪器经 $M=5$ 步 CG（或 3D DiffusionMBIR ADMM）校正后，按 DDIM（$\eta=0.85$，50 步）推进至 $x_{t-1}$
```

### 3.1 四条路径对照（如何逐级升级）

| 变体 | 适配损失 / 后验近似 | 参数范围与复杂度 | 关键特点 |
|---|---|---|---|
| **DDIP（2D 修正版 SCD）** | $\arg\min_\theta \|y - A\cdot\operatorname{CG}(D_\theta(x_t), K)\|^2$（$K=5$） | 逐切片一套 LoRA，$\mathcal{O}(KNT)$ / $\mathcal{O}(N)$ 显存 | 修掉了 SCD「适配 $K=1$ vs 采样 $M=5$」不一致 |
| **D3IP (base)** | $\arg\min_\theta \frac{1}{K}\sum_i \|y^i - A\cdot D_\theta(x_t^i)\|^2$（随机抽 $K$ 切片） | 整卷共享一套 LoRA，$\mathcal{O}(KT)$ / $\mathcal{O}(1)$ 显存 | 速度提升一个数量级，但 CT 上有轻微负迁移 |
| **D3IP (mbir)** | $\arg\min_{X_0}\frac{1}{2}\|y - AX_0\|^2 + \frac{\gamma}{2}\|TX_0\|_1$（沿切片 TV） | 需抽**连续** $K$ 张切片，5 步 ADMM / 5 步 CG | 补上三维空间连贯性，把 CT 与 3D MRI 拉到最佳 |
| **D3IP (meta)** | 将 D3IP 视作 Reptile（$\alpha$ 从 $1.0\to 0.5$）得体初始 $\theta_{\text{vol}}$，再逐切片 DDIP | $\mathcal{O}(KNT)$ / $\mathcal{O}(N)$ 显存 | 跨切片共享先验初始化后再精修，CT 达 33.96 dB |

> [!TIP] 最便宜却最管用的改动：适配与采样「同源」
> SCD 原作之所以在表里掉分，很多时候只是因为适配那一步用了 $1$ 步 CG 估计 $\hat{x}_0$、采样那一步却用了 $5$ 步 CG（相当于优化目标和采样轨迹各算各的）。DDIP 把两边对齐到同一套 $K$ 步后验均值近似后，哪怕换成 DDNM 或 DPS 也一样涨点——这提示所有测试时适配方法都要检查「适配目标的算子近似是否与推理步一致」。

### 3.2 四个值得记的工程设计

1. **截断优化区间**：末端极低噪或极高噪区间得分估计不稳定（借鉴 score distillation 实践），$t \notin [40, T-40]$ 不做适配；Table 3 显示这一条贡献 `35.62 → 35.98` dB。
2. **伪逆 + `slerp` 初始化**：用 $A^\dagger y$ 填低频、用两端噪声的球面插值填高频，既避开非零终端 SNR 问题，又保证相邻切片初始噪声平滑相关；再贡献 `35.98 → 36.31` dB。
3. **轻量 LoRA 注入**：只注入卷积残差块与注意力块（rank 4，约占总参数 $0.61\%$），AdamW 优化。

## 4. 论文证据与实验范围

**任务**：3D 稀疏视角 CT（Ellipses→AAPM，60 视角，$\sigma_y=0.01$ 以论文表为准）、3D MRI（Ellipses→BRATS 2018，5 例 T1 + 5 例 T2，VD Poisson $\times 8$ 单线圈）、多线圈 CS-MRI（fastMRI BRAIN 训练的先验→KNEE 测试，10 个体积 294 切片，uniform-1D $\times 4$、ACS 8%，ESPiRiT 估灵敏度）。CT 与 3D MRI 的先验只用现场生成的 Ellipses 模体，目标分布完全不同。

**主表（Table 2，PSNR / SSIM / LPIPS）节选**：

| 方法 | 3D SV-CT | 3D MRI | CS-MRI | 复杂度 | 显存 |
|---|---|---|---|---|---|
| DDS | 27.65 / 0.805 / 0.188 | 24.59 / 0.532 / 0.339 | 28.36 / 0.741 / 0.278 | $\mathcal{O}(T)$ | $\mathcal{O}(1)$ |
| SCD | 32.91 / 0.904 / 0.184 | 26.00 / 0.561 / 0.338 | 29.01 / 0.752 / 0.269 | $\mathcal{O}(KNT)$ | $\mathcal{O}(N)$ |
| DDIP | 33.13 / 0.903 / 0.164 | 27.46 / 0.647 / 0.289 | 29.11 / 0.775 / 0.246 | $\mathcal{O}(KNT)$ | $\mathcal{O}(N)$ |
| D3IP (base) | 31.73 / 0.908 / 0.141 | 30.59 / 0.859 / 0.152 | 29.00 / 0.789 / 0.233 | $\mathcal{O}(KT)$ | $\mathcal{O}(1)$ |
| D3IP (mbir) | 33.69 / 0.919 / 0.133 | **33.89 / 0.907 / 0.103** | – | $\mathcal{O}(KT)$ | $\mathcal{O}(1)$ |
| D3IP (meta) | **33.96 / 0.917 / 0.136** | 32.60 / 0.877 / 0.126 | **29.52 / 0.779 / 0.216** | $\mathcal{O}(KNT)$ | $\mathcal{O}(N)$ |

可以直接读出的比较：SCD→DDIP 在 CT 只涨 0.22 dB、CS-MRI 只涨 0.10 dB（28.36→29.11 相对 DDS 是 +0.75 dB），**3D MRI 涨 1.46 dB**；D3IP (base) 相对 DDIP 在 3D MRI +3.13 dB，但 CT −1.40 dB、CS-MRI −0.11 dB，作者自己承认「D3IP 并不总优于 DDIP」。接 3D 求解器后 CT 回到 33.69，元学习再把 CT 推到 33.96（但 3D MRI 从 33.89 掉到 32.60）。速度上，$256^3$ 体积、单张 RTX 3090，D3IP (base) 40 分钟 vs SCD 约 6.2 小时；LoRA 参数 14.5 Mb vs 2.9 Gb。

**消融**：Table 1 逐一替换后验均值近似（DDS/DDNM/DPS）与 CG 迭代数 $K$，DDIP 全部优于对应 SCD 行与不适配行；Table 4 提高 $K$ 收益在 $K=6$ 附近饱和（CT 34.82→35.60，$K=12/24$ 反而略降）；Fig. 6 显示 $\text{lr}=10^{-3}$、$L=10$ 时 DDIP 27.63、D3IP 30.76，$\text{lr}=10^{-4}$ 时 DDIP 30.21、D3IP 30.66（3D MRI），即 D3IP 对超参更稳。LoRA rank 越大 D3IP 越占优，作者称最优 rank 高于 DDIP。**范围限制**：全部实验只用两个 2D 扩散骨干（Ellipses VP-ADM、fastMRI brain 320 complex），3D 处理沿切片；没有病理/显微数据；指标是 PSNR/SSIM/LPIPS，无分类型幻觉或下游任务评估；bf16/多卡等工程扩展未讨论。

## 5. 复现与审计重点

**仓库实际内容**（GitHub API 逐目录核对）：`guided_diffusion/`（ADM/VP 骨干与采样）、`lora/`（LoRA 注入与适配损失）、`physics/`（CT 用 odl 的 Radon、MRI 的 multicoil/singlecoil 前向算子）、`models/`、`datasets.py`、`utils.py`（CG、mask、PSNR/SSIM）、五个求解器 `solver_{ct,mri}_{2d,3d}.py` 与 `solver_ct_3d_diffmbir.py`，以及 5 个评测脚本 `eval_CT_2d.sh`、`eval_CT_3d.sh`、`eval_CT_3d_mbir.sh`、`eval_MRI_2d.sh`、`eval_MRI_3d.sh`；全部经 `main.py` 转发。**有权重、有样例数据**：README 给 Dropbox 直链，`ellipses_ema.pt` 与 `fastmri_brain_320_complex_1m.pt` 落在 `exp/vp/`，另有一个 sample `data.zip`；**没有训练代码**——Ellipses 扩散先验怎么训、模体怎么生成都没有脚本，只能直接用发布的权重。

- **脚本与论文超参不一致（本页核对）**：论文 Table 5 给 3D SV-CT / 3D MRI 的 D3IP $K=6$，而 `eval_CT_3d.sh`、`eval_MRI_3d.sh` 都传 `--num_mc 3`；3D MRI 论文给 $\text{lr}=10^{-4}$，脚本传 `lr='1e-3'`。`eval_MRI_2d.sh` 不传 `--num_mc`，落回默认 1，与 Table 5 的 CS-MRI $K=1$ 一致；`--start_t 980 --end_t 20` 对应截断区间。想严格对齐 Table 2 要改这几个参数。
- **数据可得性**：CS-MRI 需要 fastMRI BRAIN/KNEE 原始 h5 与 ESPiRiT 灵敏度图；CT 用 AAPM 低剂量挑战数据；BRATS 2018 需注册。仓库只给样例切片，没有完整的切片清单与划分脚本，Table 2 的 294 切片/10 个体积口径需自己重建。
- **本站自跑观察（非本页复现）**：按官方 `solver_mri_2d.py` 在同一批样例体积上跑 CS-MRI 适配，相对不适配只有约 +0.06 dB，而论文 Table 2 的 DDS→DDIP 是 +0.75 dB；同一脚本在写 `summary.json` 时因 `psnr_avg` 为 numpy float32 触发序列化错误（`solver_mri_2d.py` 第 317–322 行 `json.dump` 未做类型转换，本页读码确认位置，报错为本站运行时遇到）。这条只说明官方 2D 适配脚本在样例数据上的复现度有限，不能直接推翻论文数字——论文的 CS-MRI 是 294 切片全量评测。
- **最该追的一点**：`D3IP (base)` 在 CT 上打不过 SCD，说明「整卷共享 LoRA」的负迁移真实存在；作者用 Reptile 与 DiffusionMBIR 补救，但没有给出「什么数据条件下该选 base 而非 mbir/meta」的判据。

## 6. 建议阅读顺序

摘要 → §2.2 式 (8)–(9)（先看清 SCD 在做什么）→ §3.1 式 (11)–(12) 与「1 步 vs $K$ 步 CG」那段 → Table 1（勘误带来的收益）→ §3.2 式 (13) + Alg. 1/2 + Fig. 2（DDIP→D3IP 的全部差别）→ §3.2 末尾式 (14)–(15)（mbir）与附录 0.B（Reptile）→ §3.3 两条技术改动 + Table 3 → §4.3 + Table 2/4 → 附录 0.C Table 5（超参）+ 0.E 局限。

## 7. 前后关联

- **直接前作**：[31｜SCD](31-scd.md) 是本文的被推广对象，必须成对读；那篇的 LoRA 逐切片适配、1 步 CG 近似、TV 正则都在这里被重新解释。SCD 笔记里的 CT 复现结论（lr/TV/步数极敏感的 Ellipses→AAPM 主打例未复现）也提醒我们本文 Table 1 里 SCD 的 35.43（2D 切片级、$K$ 与求解器扫描的设定）与 SCD 原文 39.73（AAPM→AAPM 同分布）不是同一协议，不能混比。
- **采样器基础**：[20｜DDS](20-dds.md) 是本文所有适配器的后验均值近似（$\operatorname{CG}(\hat{x}_{0\mid t}, M)$），DDIP 的「勘误」就是让适配那一步也用同样的 $M$。
- **同类问题**：[15｜BiasRecon](15-biasrecon.md) 同样用扩散先验处理先验错配，但走的是贝叶斯偏差校正而非在线改参数；[06｜Score-MRI](06-score-mri.md) 是这一支的早期端到端生成式重建。
- **幻觉评估**：[11｜HalluGen](../diffusion/11-hallugen.md) 提供的是伪造/擦除的合成与评测框架，可与本文 Fig. 3 的定性观察对接——本文没有做这种分类型量化，**本页判断**：把 HalluGen 式标注套到 DDIP/D3IP 上，是本文最直接的空缺。
- **同批入库的邻居**：[33｜AdaDiff](33-adadiff.md)、[35｜CDPIR](35-cdpir.md) 是同一问题谱系上的其他测试时适配思路，[34｜PET DDIP](34-pet-ddip.md) 把 DDIP 迁到另一模态；监测一侧可对照 [21｜KLIP](../diffusion/21-klip.md)、[22｜测量域 KL 漂移检测](../diffusion/22-meas-kl.md)、[23｜分布偏移下的不确定性](../diffusion/23-lpn-shift-uq.md)、[24｜弱先验](../diffusion/24-weak-priors.md)。

## 8. 链接

- [arXiv:2407.10641（abs）](https://arxiv.org/abs/2407.10641)
- [arXiv HTML v1 全文（本页阅读版本）](https://arxiv.org/html/2407.10641v1)
- [ECVA ECCV 2024 论文页（录用版本）](https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/9637_ECCV_2024_paper.php)
- [Springer DOI 10.1007/978-3-031-73226-3_25](https://doi.org/10.1007/978-3-031-73226-3_25)
- [官方代码 hyungjin-chung/DDIP3D](https://github.com/hyungjin-chung/DDIP3D)
- [论文中给出的代码别名 HJ-harry/DDIP3D](https://github.com/HJ-harry/DDIP3D)
