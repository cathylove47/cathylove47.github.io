# 24｜FDB：让扩散重建从真实欠采样数据出发的傅里叶约束扩散桥

**论文**：Learning Fourier-Constrained Diffusion Bridges for MRI Reconstruction，IEEE TMI 2026, 45(6):3229–3245（DOI 10.1109/TMI.2026.3673956，PMID 41824351）
**定位**：扩散桥、k-space 频段二值退化、有限起点、逐步 k-space 修正采样、单/多线圈重建
**精读核验**：期刊摘要取自 PubMed 逐字原文；方法、实验与表格取自同一工作的全文预印本 arXiv:2308.01096v3（题名与作者与期刊版一致）；官方实现 `icon-lab/FDB` 已打开核对 README 引用与文件树（2026-11-04）。尚未进行复现实验。

## 原文摘要

> Although MRI reconstruction requires a dealiasing transformation from undersampled to fully-sampled data, task-agnostic diffusion priors sample images via a denoising-based generative trajectory from an asymptotic start-point of Gaussian noise onto fully-sampled data. Since aliasing artifacts in MR images carry spatial structure deviating from Gaussian noise, this noise-governed trajectory can cause suboptimal artifact suppression. To address this limitation, we introduce the first Fourier-constrained diffusion bridge (FDB) for MRI reconstruction in the literature. Unlike task-agnostic diffusion priors, FDB does not rely on noise in its forward process and instead learns a dealiasing transformation between a start-point of undersampled data and the end-point of fully-sampled data. The start-point is derived via a stochastic Fourier-constrained degradation operator that removes a progressively growing set of spatial frequencies. Unlike cold/soft diffusion priors that use an asymptotic start-point of severely degraded measurements, FDB uses a realistically undersampled start-point to ensure closer alignment of model input between training and test distributions. Unlike existing diffusion bridges that use degradations based on weighted linear averages and noise addition, FDB implements degradations based on binary removal of compact k-space sets to conform to the physics of accelerated MRI. To further improve image quality, FDB leverages a novel sampling algorithm based on progressive dealiasing by continually correcting recovered k-space data across reverse diffusion steps. Demonstrations on brain MRI show that FDB outperforms competing methods by 4.5dB PSNR and 8.3% SSIM in within-domain and by 4.7dB PSNR and 16.4% SSIM in cross-domain reconstructions.

*来源：PubMed PMID 41824351（IEEE TMI 2026, 45(6):3229–3245）；逐字原文，未改写、未压缩。*

## 中文摘要

> MRI 重建需要的是一次从欠采样数据到全采样数据的去伪影（dealiasing）变换，而与任务无关的扩散先验却采用一条基于去噪的生成轨迹，从高斯噪声这一渐近起点走向全采样数据。由于 MR 图像中的伪影带有偏离高斯噪声的空间结构，这条由噪声支配的轨迹可能导致次优的伪影抑制。为处理这一局限，我们提出文献中首个用于 MRI 重建的傅里叶约束扩散桥（FDB）。与任务无关的扩散先验不同，FDB 的前向过程不依赖噪声，而是学习一次介于“欠采样数据起点”与“全采样数据终点”之间的去伪影变换。该起点由一个随机的傅里叶约束退化算子导出，该算子移除一组逐步增大的空间频率。与使用严重退化测量的渐近起点的冷/软扩散先验不同，FDB 使用一个贴合实际的欠采样起点，以确保模型输入在训练分布与测试分布之间更接近。与采用加权线性平均加噪声的退化方式的既有扩散桥不同，FDB 的退化基于对紧凑 k-space 集合的二值移除，以符合加速 MRI 的物理。为进一步提升图像质量，FDB 采用一种新的采样算法，通过在反向扩散各步之间持续修正已恢复的 k-space 数据来实现渐进式去伪影。在脑 MRI 上的实验表明，FDB 在同域重建中以 4.5dB PSNR 与 8.3% SSIM 领先对比方法，在跨域重建中以 4.7dB PSNR 与 16.4% SSIM 领先。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

常规扩散先验做的是"噪声 → 全采样图像"的任务无关映射；重建时把数据一致性投影插在反向步之间，靠折中解把两者勉强接上。FDB 的出发点是：**伪影不是噪声**——欠采样伪影在 k-space 里是一组没测到的频率，它有结构，硬把生成轨迹的起点设成各向同性高斯，相当于让先验去"猜"一段本来已知的信息。

它把这条链路换成三件事：

1. **前向过程换成频域删除**：随机的傅里叶约束退化算子，每步删掉一批 k-space 频率，覆盖顺序按外围到中心推进；删除是二值的（要么有、要么没有），不是加权平均加噪。
2. **起点换成真实欠采数据**：训练时桥的起点是 R′ 倍欠采的图像，终点是全采样图像；推理时直接从 A^H y（最小二乘解）出发，而不是随机噪声。
3. **反向过程带修正项**：每一步补回 n 个频率后，再用一个由训练集能量比估出的系数 w_t 做软去伪影，把"每个频率只被估一次"的硬补洞改成可修正的估计。

值得读的理由：这是"把 diffusion 的起点从噪声换成测量"这条线上最早也最系统的一篇之一，而且它给出了可复现的官方实现，前向退化、w_t 的学习与推理里的逐步掩码都能在代码里逐行对上。风险也清楚：方法依赖"训练与测试的欠采样程度要接近"（论文自己强调 R′ 与 R 的对齐），并且是 2D 切片、单一解剖。

## 2. 问题及研究位置

前向模型是 y = Ax + ε，A = M·F·S（采样模式、傅里叶编码、线圈敏感度）。重建要在这个算子下求 x。

论文把已有方案排成三条线：任务特定先验（D5C5 展开网络、rGAN）直接学欠采到全采的映射，但绑定固定加速倍率与采样密度；任务无关扩散先验（DDPM）学全采样数据分布，重建时靠数据一致性投影折中，起点是渐近高斯；冷扩散（CDiffMR）用 k-space 欠采样作为确定性退化，但起点仍然取很高退化程度的渐近点，训练与测试输入分布拉得很开；扩散桥（I²SB、DB-blur）假设退化是已知确定算子，起点是狄拉克分布，缺少随机性。

FDB 的位置：保留"桥"的有限起点，但把起点定在**中等欠采样**而不是极度退化，并让退化**随机**（每次训练样本删掉的频率集合不同），同时用二值频域删除替代加权平均加噪，以贴合加速 MRI 的成像算子。

## 3. 核心方法和数据流

```text
前向（训练期构造）：X_0（全采样 k-space） --随机删频--> X_t --...--> X_{T_f}（R′ 倍欠采）
  · 每步删掉的频率集合 S_t 随机，覆盖顺序为外围→中心
  · 累计删除量按加速倍率 R′ 与步数 T_f 分配：每步约 n ≈ N_K(R′−1)/(R′T_f) 个
训练：把 x_t 送入恢复算子 G_θ(x_t, t)，回归完全去伪影的图像 x̃_0
反向（推理）：x_{T_r} = A^H y（最小二乘解，不是噪声）
  for t = T_r … 1:
      x̃_0 = G_θ(x_t, t)                     # 预测干净图像
      x_{t−1} = C_{t−1}·x̃_0 + (1 − w_t)·(x_t − x̃_0) 中未被 C 选中的频段   # 硬补洞 + 软修正
      数据一致性投影（多线圈下用线圈敏感度回投）
  T_r = ⌊T_f·(R−1)R′ / ((R′−1)R)⌋             # 由训练加速倍率 R′ 换算到测试加速倍率 R
```

三个设计要点：

1. **退化算子是"删频率"而不是"加噪"**：实现里（`utils/fdb.py` 的 `q_sample`）每次随机取一个 k-space 位置删掉，且该位置必须落在半径 r 之外的环带里，r 随 t 从 `image_size/2` 递减到 3（单线圈）或 4（多线圈）——这就是论文说的"外围→中心"顺序，保证高频先走、低频最后走。
2. **w_t 是从数据里估出来的，不是超参**：`w.npy` 存的就是每个时间步的修正权重，用训练集上"平均幅值差之比"的滑动平均在线更新；论文把它的行为解释为 k-space 能量近似服从 1/r^ν 律时指数上升。
3. **加速倍率要换算**：先验是按 R′ 训练的，重建 R 倍欠采数据时要跑 T_r 步，公式里显式含有 R′ 与 R；这也是论文强调"起点要真实欠采样"的直接后果——训练与测试的输入退化程度必须接近。

## 4. 论文证据与实验范围

**数据**：IXI（单线圈，T1/T2/PD，受试者划分 21/15/30）与 fastMRI（多线圈，几何线圈压缩到 5 个虚拟线圈，T1/T2/FLAIR，划分 240/60/120）。回顾式欠采样为正态密度二维掩码，R = 4–8；全部为 2D 横断面。

**对照**：LORAKS（传统）、D5C5（任务特定展开）、rGAN（任务特定对抗）、DDPM（任务无关扩散先验）、CDiffMR（基于欠采样的冷扩散）、I²SB（无约束扩散桥）、DB-blur（模糊约束扩散桥）。

**结果（预印本 arXiv:2308.01096v3 正文）**：同域任务上 FDB 在所有数据集与任务中排名第一（p<0.05）。跨任务平均，领先 LORAKS 7.5dB PSNR / 24.4% SSIM、领先任务特定先验 4.3dB / 12.0%、领先扩散先验 4.8dB / 7.6%、领先扩散桥 6.5dB / 9.8%；相对每个任务的第二名平均提升 2.8dB PSNR 与 1.1% SSIM。

**期刊摘要给出的口径不同**：同域 4.5dB PSNR / 8.3% SSIM，跨域 4.7dB / 16.4%。两组数字的参照系不一样（摘要比的是"竞争方法"，正文另有分类别平均与第二名平均），引用时要写清是哪一种口径，不能混用。

**范围限制**：只有脑部与 2D 切片；对比中未做跨解剖（如膝）的桥迁移；R′ 与 R 需要对齐这一点在论文里是方法前提而非实验结论。

## 5. 复现与审计重点

- **官方实现已核实**：`https://github.com/icon-lab/FDB`（MIT，Python/PyTorch），README 明确引用本文 TMI 2026 与完整作者名单，入口为 `train.py`、`sample.py`、`utils/fdb.py`、`utils/unet.py`；训练/推理命令区分开关 `--data_type singlecoil|multicoil`，加速倍率由 `--undersampling_rate` 给出，训练 `--diffusion_steps 1000`，推理示例用 1500–1750 步。核查日期 2026-11-04。
- **`w.npy` 是运行态产物**：仓库里带了一份 `w.npy`，代码在 `q_sample` 里在线更新并覆写它，多进程训练时会互相踩；复现前先确认是不是要固定这份权重。
- **掩码生成是随机的且在线进行**：`create_mask` 每次推理重新随机分配"哪一步补哪些频率"，所以同一份测量跑两次结果不会完全相同；论文正文明说测试期与训练期用相互独立的随机实例来维持随机性。
- **多线圈路径的坑**：`data_consistency` 对多线圈先按线圈敏感度回投再求和，图像与 k-space 的尺寸差用 `padx/pady` 居中裁剪；`image_size`（256 单线圈 / 384 多线圈）必须与数据矩阵匹配，否则裁剪位置会偏。
- **可对照量的边界**：预印本与期刊版的增益口径不一致（见上一节），复现时以自己跑出来的表对表比，不要拿摘要数字当基准。

## 6. 建议阅读顺序

期刊摘要 → 预印本 §1（三条先验路线的问题陈述）→ Fig. 1（常规扩散 vs FDB 的起点与退化对比）→ §2 前向退化与训练目标 → §3 修正采样（含 w_t 的推导）→ Algorithm 1 → `utils/fdb.py` 的 `q_sample` / `p_sample` / `create_mask` → 实验表（IXI、fastMRI）→ 跨域部分。

## 7. 前后关联

- 与 [Score-MRI](06-score-mri.md) 对照：Score-MRI 是"噪声起点 + 后验采样"的经典形态，FDB 正是针对它"起点与伪影结构不匹配"这一点的改法；两篇连读可以把"扩散先验做 MRI 重建"的两次范式变化看清楚。
- 与 [DDS](20-dds.md)、[MSC](13-msc.md) 对照：后两者都在推理期加强测量一致性（干净估计上做 CG、把已测子空间锁回观测），FDB 改的是**生成过程本身的轨迹**，三者可以组合——一致性问题在采样器层面和在先验层面是两件事。
- 与 [UPMRI](22-upmri.md) 对照：都放弃了"从不含信息的高斯起步"，但 UPMRI 用流匹配 + 无真值训练，FDB 用桥 + 有真值训练；对比"起点"与"是否需要真值"两个维度很清楚。
- 与 [CM-RED](14-cm-red.md)、[SSDM-MRI](27-ssdm-mri.md) 对照：后两者解决的是"步数太多"，FDB 解决的是"起点不对"，属于互补的两类改动。

## 8. 链接

- [PubMed 摘要（TMI 2026）](https://pubmed.ncbi.nlm.nih.gov/41824351)
- [DOI（IEEE TMI）](https://doi.org/10.1109/TMI.2026.3673956)
- [全文预印本 arXiv:2308.01096](https://arxiv.org/abs/2308.01096)（v3，题名与期刊版一致）
- 官方实现：[icon-lab/FDB](https://github.com/icon-lab/FDB)（MIT；已核实 README 引用本文，核查日期 2026-11-04）
