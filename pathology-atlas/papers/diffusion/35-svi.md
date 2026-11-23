# 35｜SVI：把视频的时间轴当图像扩散模型的 batch，用「同步噪声 + 多步 CG」换时间一致

**论文**：Solving Video Inverse Problems Using Image Diffusion Models，Taesung Kwon、Jong Chul Ye；ICLR 2025；arXiv:2409.02574
**定位**：视频逆问题求解器；不训练视频扩散模型，直接把预训练 2D 图像扩散模型沿时间轴堆成 batch，用「batch 一致的初始化与重加噪」保证帧间同步，再用视频空间的 l 步共轭梯度施加时空数据一致性，从而同时反解时间退化（PSF 拖影）与空间退化（模糊/超分/缺失）
**精读核验**：2026-11-22 依 arXiv HTML 全文（Abstract、§1–5、Algorithm 1、Table 1–8、Figure 1–5，附录 A 的数据预处理与 B 的盲逆问题只读标题级）逐节读过；会议信息按 arXiv 注释「ICLR 2025」与仓库 README 一致。官方代码 `svi-diffusion/codes` @`301e023` 同日核对：`guided_diffusion/`（openai guided-diffusion 改造）、`scripts/TimeDeconv.py`（唯一采样脚本，`time_deconv_sample_loop`）、`datasets/DAVIS.py`、`sample.sh` 是真实实现；权重是 ADM 256×256 无条件模型 `256x256_diffusion_uncond.pt`。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：仓库自带 3 段 16 帧样例视频，按官方 `sample.sh` 默认超参跑完，未下载 DAVIS；见 [SVI 推理走查记录](/pathology-atlas/learning/infer-svi.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Recently, diffusion model-based inverse problem solvers (DIS) have emerged as state-of-the-art approaches for addressing inverse problems, including image super-resolution, deblurring, inpainting, etc. However, their application to video inverse problems arising from spatio-temporal degradation remains largely unexplored due to the challenges in training video diffusion models. To address this issue, here we introduce an innovative video inverse solver that leverages only image diffusion models. Specifically, by drawing inspiration from the success of the recent decomposed diffusion sampler (DDS), our method treats the time dimension of a video as the batch dimension of image diffusion models and solves spatio-temporal optimization problems within denoised spatio-temporal batches derived from each image diffusion model. Moreover, we introduce a batch-consistent diffusion sampling strategy that encourages consistency across batches by synchronizing the stochastic noise components in image diffusion models. Our approach synergistically combines batch-consistent sampling with simultaneous optimization of denoised spatio-temporal batches at each reverse diffusion step, resulting in a novel and efficient diffusion sampling strategy for video inverse problems. Experimental results demonstrate that our method effectively addresses various spatio-temporal degradations in video inverse problems, achieving state-of-the-art reconstructions. Project page: this https URL

*来源：arXiv:2409.02574 摘要页原文（HTML 版）；末句 `this https URL` 为 arXiv 排版占位，原文即如此。*

## 中文摘要

> 近来，基于扩散模型的逆问题求解器（DIS）已成为处理超分、去模糊、inpainting 等逆问题的先进方法。然而由于训练视频扩散模型困难，它们在被时空退化支配的视频逆问题上仍基本未被探索。为此我们提出一种只借助图像扩散模型的视频逆问题求解器。具体而言，受近期分解式扩散采样器（DDS）成功的启发，我们把视频的时间维当作图像扩散模型的 batch 维，并在每个图像扩散模型给出的去噪时空 batch 上求解时空优化问题。此外，我们提出一种 batch 一致的扩散采样策略：通过同步图像扩散模型中的随机噪声分量来增强各 batch 之间的一致性。我们的方法把 batch 一致采样与每个反向扩散步上对去噪时空 batch 的同时优化结合起来，得到一种新颖高效的视频逆问题扩散采样策略。实验表明，该方法能有效处理视频逆问题中各种时空退化，取得最先进的重建结果。

*译文：对应上方英文摘要逐句对译，未增删内容。*

## 1. 三分钟摘要与推荐理由

一句话：**视频逆问题的难点不是「没有视频先验」，而是「独立用 2D 先验逐帧重建会导致帧间内容漂移」；SVI 的答案是让同一 batch 内所有帧共享同一个初始噪声和同一份重加噪噪声（batch-consistent），再让退化的耦合（时间 PSF）通过视频空间的共轭梯度把各帧「分开」，于是既同步又各不相同。**

三件值得读的事：

1. **它把两难讲得很清楚**（Fig. 2）：每帧独立初始化/独立加噪 → 帧间内容不一致（闪烁、抖）；每帧完全同一噪声 → 生成完全相同的帧（退化成静态图）。作者指出，条件采样打破了这一僵局：同一个噪声初始化 + 同一个噪声重注入保证时间一致，而「按测量约束做帧相关扰动」（多步 CG）提供必要的帧间差异。
2. **完全复用 2D 先验**：不需要视频扩散模型、不需要微调，直接用 ADM 256² 无条件模型；显存只随 batch（帧数）线性增长，16 帧 256² 在 4090 上约 12.4 GB。对资源有限的实验室非常实用。
3. **效率优势巨大**：Table 1 里 20 NFE 只要 12 s，而 DPS 1000 NFE 要 1244 s、DiffusionMBIR 611 s；并且 PSNR/FVD 还全面更好。这说明「不训练视频先验」不只是省事，也是当前性价比最高的路线之一。

**关于「和我们关心的跨域/医学场景」的关系（本页判断）**：SVI 的思路（时间轴=batch、共享噪声、测量耦合用 CG）可以直接搬到动态 MRI/4D-CT 这类「时间维退化」的逆问题——**只要前向算子 A 能写成对整个时空体积可微、且能解线性子问题**。限制是它假设退化算子是线性的（时间 PSF、模糊、平均池化、掩码），非线性前向（如 MRI 的非笛卡尔采样与线圈敏感度耦合）需要改 CG 子问题；论文自己在附录 B 里只做了盲去模糊的线性扩展。

## 2. 问题及研究位置

视频逆问题：X ∈ R^{N×C×H×W}，退化 Y = A(X) + n，A 含时间方向 PSF 卷积（采集系统的运动/积分效应）与/或空间退化。目标是在视频流形 M 上解 min_X ℓ(X) = ‖Y − A(X)‖²。

已有路线：

- **训练视频扩散模型**（式 15 的 3D score matching）：效果好但要大规模视频数据与算力，作者明确说超出可承受范围；
- **逐帧 2D DIS**：DPS/DDRM 一类直接套到每帧，帧间没有约束，时间退化下会抖；
- **传统优化**：CG 解 ℓ、ADMM-TV 解 ℓ_TV（时间方向 TV），不依赖先验，动态场景下细节差；
- **DDS（分解式扩散采样）**：在每个反向步用 Tweedie 去噪 + 数据一致性投影 + 重加噪。SVI 直接沿用这一骨架，把「图像 batch」换成「视频卷」。

SVI 的位置：**用 batch 一致性把 2D 先验「粘」成视频先验**，再用 CG 在视频空间解数据一致性。与 [34 号 N-HMC](34-nhmc.md)、[33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md) 的「把反向过程当函数再优化」不同，SVI 仍是逐步投影式（与 [25 号 ReSample](25-resample.md) 同族），只是投影算子作用在整个时空卷上。

## 3. 核心方法和数据流

```text
输入：测量 Y、时空退化 A、图像扩散模型 ε_θ、步数 T（20 或 100）、η、CG 步数 l=5
X_T ← E^b ~ N(0, I)               # 同一个噪声复制到 N 帧（batch-consistent）
for t = T … 2:
    X̂_t^b = (X_t − √(1−ᾱ_t)·ε̃_θ(X_t)) / √ᾱ_t        # 逐帧 Tweedie（2D 模型）
    X̄_t = argmin_{X ∈ X̂_t^b + K_l} ‖Y − A(X)‖²        # 视频空间 l 步 CG，按测量扰动各帧
    Ê_t^b = (√(1−ᾱ_{t−1}−η²β̃²)·ε̃_θ(X_t) + ηβ̃·E^b) / √(1−ᾱ_{t−1})
                                                       # 同一份 E^b 复制到每帧
    X_{t−1} = √ᾱ_{t−1}·X̄_t + √(1−ᾱ_{t−1})·Ê_t^b
输出：X_0 = Tweedie(X_1)
```

要点：

1. **三个「批一致」**：初始噪声一致、重加噪噪声一致、去噪网络是同一个（逐帧同权重）。这是时间一致性的来源；论文的 Fig. 2(c) 用几何图示说明「同一路径出发，被 CG 按测量推开」。
2. **CG 是帧间差异的唯一来源**：式 18 在 Krylov 子空间 K_l 内最小化 ‖Y − A(X)‖²，l=5 步。因为 A 在时间方向耦合（PSF 卷积），各帧的最优扰动不同，视频才不是静态复制。
3. **超参**：时间退化任务 l=5、η=0.15、20 NFE；时空复合退化 l=5、η=0.8、100 NFE（Table 5 显示 η 的影响很大：η=0 时 PSNR 18.04，η=0.8 时 25.71，η=1.0 时 PSNR 最高 26.04 但 LPIPS/FVD 明显变差）。
4. **可选 TV 变体**：ℓ_TV = ‖Y−A(X)‖² + λ·TV(X)，与 DiffusionMBIR 对应；作者用它做基线对照，说明「时间 TV」在动态场景下不够。

## 4. 论文证据与实验范围

**设置**：DAVIS 2017，全部视频归一化到 [0,1]、切成 16 帧 256×256，共 338 个样本；ADM 256² 无条件模型不微调；指标 PSNR/SSIM/LPIPS/FVD（FVD ×10⁻³）；时间退化 = 时间维 PSF（均匀核宽 7/13、高斯 σ=1），时空退化 = 时间 PSF(k=7) + 高斯模糊 σ=2 / 4× 平均池化 / 50% 随机掩码。

**时间退化（Table 1，20 NFE）**：

| 退化 | SVI PSNR/SSIM/LPIPS/FVD | DPS（1000 NFE） | DiffusionMBIR（1000 NFE） |
|---|---|---|---|
| 均匀 PSF k=7 | **43.16 / 0.992 / 0.004 / 0.008** | 33.42 / 0.914 / 0.071 / 0.325 | 29.13 / 0.865 / 0.096 / 0.430 |
| 均匀 PSF k=13 | **39.69 / 0.984 / 0.008 / 0.035** | 20.61 / 0.666 / 0.303 / 2.055 | 26.15 / 0.794 / 0.157 / 0.836 |
| 高斯 PSF σ=1 | **34.25 / 0.959 / 0.029 / 0.068** | 12.21 / 0.610 / 0.272 / 2.210 | 29.29 / 0.875 / 0.086 / 0.322 |

**时空退化（Table 2，100 NFE，60 s）**：去模糊 27.77/0.810/0.270/0.275、4× SR 25.71/0.724/0.279/0.352、inpainting 29.45/0.877/0.047/0.136，均优于 DiffusionMBIR/DPS/ADMM-TV；DPS 在复合退化下 PSNR 只有 18–21 dB。

**其他**：Table 3 在 GoPro 上做视频去模糊；Table 5 的 η 消融（见上）；Table 6 与 DiffIR2VR 比 4× SR（PSNR 32.88 vs 30.51，但 LPIPS 0.089 vs 0.061，**感知指标反而更差**）；Table 7 高频 Pexels 数据集；Table 8 人工感知研究。

**范围限制（本页判断）**：16 帧、256²、DAVIS 这类自然视频；退化为线性算子；FVD 依赖 3D 特征网络，对低频模糊很敏感（k=7 时 SVI 的 FVD 0.008 好得不像真实分布差距，应视为该退化下几乎完美重建）；没有长视频（>100 帧）的漂移评估，也没有医学/动态场景（如心脏 cine MRI）实验。

## 5. 复现与审计重点

**本站走查做了什么（小样本，非论文指标复现）**：clone 官方仓库 @`301e023`，下载 ADM 权重 `256x256_diffusion_uncond.pt`（2.1 GB，openaipublic，经代理 wget），用仓库自带 3 段样例 `sample/sample_data/video_00{1,2,3}/split_001.npy`（每段 16 帧 256² float32），按官方 `sample.sh` 跑默认参数（`T_sampling=20`、η=0.15、CG `n_inner=5`、时间盒式核 13、随机 50% 掩码）。**唯一的代码改动**是 `guided_diffusion/dist_util.py`：非交互环境没有 mpi4py，且原 `setup_dist()` 会把 `CUDA_VISIBLE_DEVICES` 覆盖成 `rank % GPUS_PER_NODE`，改为 try/except + 单进程 dummy comm、无 MPI 时直接返回；未改 `TimeDeconv.py` 与任何算法超参。

| 视频（16 帧） | 重建 PSNR / SSIM | 退化输入 PSNR / SSIM | 相邻帧差（重建 vs GT） |
|---|---|---|---|
| video_001 | 35.46 / 0.9863 | 16.06 / 0.5123 | 0.1935 vs 0.1991 |
| video_002 | 32.31 / 0.9777 | 16.46 / 0.5888 | 0.2325 vs 0.2380 |
| video_003 | 33.74 / 0.9699 | 18.20 / 0.5258 | 0.1505 vs 0.1578 |

- 读法：相对退化输入提升 14–19 dB；相邻帧差幅度与 GT 几乎相同，说明不是靠「冻结帧」换取时间一致，而是真的把时间拖影反解开了。这三段是作者随仓库给的演示片段，PSNR 偏高属正常，**不能外推到 DAVIS 全量**；本次也没跑 LPIPS/FVD，指标从 8-bit GIF 反算（比 float 输出略低）。
- 耗时：3 段共 98.6 s（约 13 s/段，1.5 it/s）；显存峰值 12,437 MiB（fp16 权重 + 16 帧 batch）。

**审计要点**：

1. **指标来源**：脚本只存 GIF（8 bit），论文的数值应该是 float 输出算的；走查数字系统性偏低约 0.2–0.5 dB，不能直接对表。
2. **FVD 的尺度**：Table 1 里 k=7 的 FVD 0.008 与 DPS 0.325 差距近 40 倍，更像是「该任务对 FVD 特征几乎无差异」，引用时要看绝对意义而不是相对倍数。
3. **η 与 NFE 的耦合**：20 NFE 的 η=0.15 与 100 NFE 的 η=0.8 是两套设定，Table 5 表明 η=1.0 的 PSNR 更高但感知更差；「时间一致性」与「感知质量」在这里不是单调关系。
4. **线性算子假设**：CG 子问题要求 A 线性且能快速作用；医学前向（非笛卡尔 MRI、CT 投影 + 重建链）需要重写子问题与伴随，论文没有覆盖。

## 6. 建议阅读顺序

摘要 → §3.1 式 12–14（DDS 骨架）→ §3.2 的「两难」与 Fig. 2 → 式 17–20 与 Algorithm 1 → §4 的实验设置（DAVIS、PSF 类型、NFE/η）→ Table 1/2 与 Fig. 4/5 → 附录 C.2 的 η 消融 → 附录 B 的盲逆问题扩展。

## 7. 前后关联

- 与 [25 号 ReSample](25-resample.md)：都属「去噪 + 硬一致性投影 + 重加噪」的分解式采样；ReSample 面向单图与潜空间，SVI 面向时空卷与 2D 先验的 batch 复用。
- 与 [36 号 InstantViR](36-instantvir.md)：同一问题的两条路——SVI 是迭代式、零训练、慢（0.29 FPS）；InstantViR 把视频扩散先验蒸馏成一步因果学生、快 100 倍。两篇一起读能看清「质量–延迟」的权衡。
- 与 [34 号 N-HMC](34-nhmc.md)、[33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md)：那两篇都在减少「逐步修改中间状态」的近似误差；SVI 反其道而行，直接用测量投影并且靠 batch 同步抑制伪影。
- 与 [03 DDIM](03-ddim.md)：确定性骨架与 η 参数同源；[20 号 DDS](../mri/20-dds.md) 是 SVI 的直接前身（分解式采样），SVI 可视为「DDS 的视频版」。
- 与 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md)：医学逆问题里「时间维」同样存在（cine MRI、4D-CT），SVI 的 batch 一致性技巧可以迁移，但需要把退化算子换成医学前向模型。

## 8. 链接

- [arXiv:2409.02574（abs）](https://arxiv.org/abs/2409.02574)
- [arXiv HTML 全文](https://arxiv.org/html/2409.02574)
- [官方代码 svi-diffusion/codes](https://github.com/svi-diffusion/codes)
- [ADM 256×256 无条件权重（openaipublic）](https://openaipublic.blob.core.windows.net/diffusion/jul-2021/256x256_diffusion_uncond.pt)
- [推理走查记录](/pathology-atlas/learning/infer-svi.html)
