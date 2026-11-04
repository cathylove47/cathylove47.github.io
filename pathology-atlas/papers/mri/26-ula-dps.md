# 26｜Preconditioned ULA-DPS：把精确似然乘进每个噪声尺度、用预条件换免调参

**论文**：Fast and Robust Diffusion Posterior Sampling for MR Image Reconstruction Using the Preconditioned Unadjusted Langevin Algorithm，arXiv:2512.05791v2（physics.med-ph，2026-04-21 修订），已投 Magnetic Resonance in Medicine（DOI 10.1002/mrm.70416），稿件类型标为 Technical Note
**定位**：扩散后验采样、精确似然、预条件 ULA、共轭梯度、非笛卡尔重建、不确定性图
**精读核验**：依据 arXiv v2 全文的摘要、§6 理论、§7 方法与 §8 结果整理（2026-11-04）；论文正文给出的复现代码与 BART 依赖已分别核对定位。PSNR/SSIM 数值以图呈现，正文未给独立数值表，本页不转录图内数字。尚未进行复现实验。

## 原文摘要

> 1 Purpose
> The Unadjusted Langevin Algorithm (ULA) in combination with diffusion models can generate high quality MRI reconstructions with uncertainty estimation from highly undersampled k-space data. However, sampling methods such as diffusion posterior sampling (DPS) or likelihood annealing suffer from long reconstruction times and the need for parameter tuning. The purpose of this work is to develop a robust sampling algorithm with fast convergence.
>
> 2 Theory and Methods
> In the reverse diffusion process used for sampling the posterior, the exact likelihood is multiplied with the diffused prior at all noise scales. To overcome the issue of slow convergence, preconditioning is used. The method is trained on fastMRI data and tested on retrospectively undersampled brain data of a healthy volunteer.
>
> 3 Results
> For posterior sampling in Cartesian and non-Cartesian accelerated MRI the new approach outperforms annealed sampling and DPS in terms of reconstruction speed and sample quality.
>
> 4 Conclusion
> The proposed exact likelihood with preconditioning enables rapid and reliable posterior sampling across various MRI reconstruction tasks without the need for parameter tuning.

*来源：arXiv:2512.05791v2（同日版本亦见 PubMed/MRM 预发表）；逐字原文，未改写、未压缩。小标题沿用原文的编号结构。*

## 中文摘要

> 1 目的
> 无调整朗之万算法（ULA）与扩散模型结合，可以从高度欠采样的 k-space 数据生成高质量的 MRI 重建，并给出不确定性估计。然而，扩散后验采样（DPS）或似然退火这类采样方法受制于重建时间长与需要参数调优。本工作的目的是发展一种收敛快且稳健的采样算法。
>
> 2 理论与方法
> 在用于采样后验的反向扩散过程中，精确似然在每个噪声尺度上都与扩散后的先验相乘。为克服收敛缓慢的问题，采用了预条件。该方法在 fastMRI 数据上训练，并在一名健康志愿者的回顾式欠采样脑数据上测试。
>
> 3 结果
> 对于笛卡尔与非笛卡尔加速 MRI 的后验采样，新方法在重建速度与样本质量上都优于退火采样与 DPS。
>
> 4 结论
> 所提出的"精确似然 + 预条件"方案可以在无需参数调优的情况下，跨多种 MRI 重建任务实现快速可靠的后验采样。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词以英文原文为准。*

## 1. 三分钟摘要与推荐理由

贝叶斯重建的好处写在作者引言里：测量模型与先验解耦，换采样轨迹不用重训；噪声水平唯一决定先验与似然的相对权重，不用调正则参数；全后验能给出不确定性图。但这三条好处的代价，在扩散先验上体现为采样效率。

主流做法有两类：DPS 用近似似然（对网络输出求梯度，要反传），退火似然在反向过程里逐步引入似然、需要挑退火系数。两者的共同问题是**慢**，且都有超参要扫。

这篇的改法是一步到位：**在每个噪声尺度上都用精确似然**，但那会让问题在最开始就"数据把某些方向钉死"，条件数极差、步长只能很小。于是补上第二件东西：**针对线性逆问题设计的预条件矩阵**，它近似负对数后验的 Hessian 逆，让"数据几乎没约束的方向"也能迈大步。预条件矩阵不求显式逆，用共轭梯度作用一次即可。

值得读的理由：它把"免调参"讲清楚了来源——噪声水平唯一的加权与精确似然的组合，让同一套步长在笛卡尔、非笛卡尔、不同线圈数、不同噪声水平下都能用；而且实现落在 BART 上，工程上比"论文附属脚本"更可信。局限同样明显：单解剖（脑）、单志愿者、以图为主的结果呈现，没有多中心量化表。

## 2. 问题及研究位置

问题设定是标准的贝叶斯 MRI 重建：y = Ax + ε，ε ∼ N(0, Σ)，要在给定测量下从后验 p(x|y) 采样。反向扩散过程里，先验从平滑版逐步收紧到真实分布，而似然项在每一步都要乘上去。

已有方案的位置：

- **退火似然 / 噪声似然**：一开始给似然很小的权重逐步加，避免高噪声尺度下后验太尖；代价是要挑退火参数，且作者在结果里指出退火在高噪声尺度会先"生成一张类似 T1 的图"再被数据拉回来。
- **DPS**：用 Tweedie 近似的似然梯度，需要对网络输出反传；要按噪声水平调似然权重，作者的结果里明确指出"用另一个噪声水平调出来的权重会显著掉点"。
- **直接学习后验**：绑定了测量模型，失去"换轨迹不重训"的好处。

本文的位置：保留精确似然（不近似、不调权重），把"慢"归因到条件数，用预条件解决，而不是用近似解决。

## 3. 核心方法和数据流

```text
反向扩散：从 t = 1（最高噪声）降到 0，每个噪声水平 t 上做 K 步朗之万更新
  · 初始化：从"平坦高斯先验（方差 σ_1²）"对应的后验采样
  · 每个噪声水平的第一个样本由上一噪声水平的最后一个样本热启动
条件分数 ∝ 先验分数 + 精确似然分数：∇log p(x|y) = ∇log p_t(x) + A^H Σ^{-1}(y − A x)
预条件更新（pULA）：
  x ← x + τ · P( ∇log p_t(x) + A^H Σ^{-1}(y − A x) ) + 噪声项
  P ≈ ( A^H Σ^{-1} A + σ_t^{−2} I )^{-1}     # 负对数后验 Hessian 的逆的近似
  · P 不显式构造，用 CG 作用一次即可；每步只需一次 P 的应用
  · 采样 N(0, σ_t²(I − P A^H Σ^{-1} A)) 用与伪复本（pseudo replica）同构的方式完成
```

三个要点：

1. **"精确似然"省掉了两样东西**：不需要在反向过程里逐步调整似然权重（退火），也不需要反传（DPS）。作者给出的直接后果是网络评估次数更少、单步更便宜。
2. **预条件的作用是"补齐被数据钉死之外的方向"**：Hessian 里 A^H Σ^{-1}A 与先验的近似 σ_t^{−2}I 相加，前者约束强的方向步长自然小，约束弱的方向步长接近先验方差给出的尺度。作者说这与"在先验采样里用与噪声方差成比例的步长"的经验相符。
3. **噪声只出现在未采的 k-space 位置**：结果里 Fig. 3 的对比是全文最有说服力的一处——用精确似然时，高噪声尺度下噪声只分布在没测的 k(=k-space) 位置；退火与 DPS 则整幅 k-space 都起噪，退火还会先出现一张"看起来像 T1"的错误图像。

## 4. 论文证据与实验范围

**训练（§7.1）**：用 fastMRI brain 多线圈训练集的全采样 k-space 重建图像（矩阵 320），预白化（用全采样线圈图像背景块估计噪声协方差）、压缩到 12 个虚拟线圈、用低分辨率 NLINV 估计敏感度、按 99 百分位像素幅值归一化；用 ESPIRiT 估计前景掩膜，掩膜延伸到相位编码边界的数据被当作运动污染剔除，最终约 32,000 / 36,000 样本；目标图像用带小 λ 小波正则的 FISTA 重建；条件去噪 U-Net（条件残差块）在 BART 中实现，σ 从高到低指数衰减，用 Tweedie 公式从去噪网络得到分数。

**采集（§7.2）**：3T Magnetom Vida、20 通道头线圈；笛卡尔 T2/T1 加权 TSE 全采样脑数据；另有一组径向 T1 加权 stack-of-stars FLASH（RAGA 采样，两次重复各 987 条辐条），FoV 220mm、矩阵 320。

**实验（§7.3）**：
- 二维高斯混合先验的玩具模型（1000 个样本）验证收敛速度：精确似然下的 ULA 需要更小步长与更多迭代，pULA 收敛速度与退火相当。
- T2 数据回顾式欠采：等距与随机掩码，加速 4 与 12，16 行自校准；10 个后验样本平均。
- 鲁棒性三项：虚拟线圈数从 12 降到 4 与 1；噪声水平提高到 3 倍；径向辐条从 987 减到 98/49/24。
- 对照：λ-小波正则并行成像、DPS、退火似然 ULA（aULA）。
- 硬件：AMD EPYC 9334 + NVIDIA H100（80GB）。

**结论（正文表述）**：pULA 在 PSNR/SSIM 上一致优于退火与 DPS，误差图可见差异更小；总计算时间更少（网络评估更少、DPS 还要反传）；收敛快使它可以**从更小的噪声尺度起步**（4 倍与 12 倍加速各自的起点不同），进一步省时间。非笛卡尔上，退火似然即使使用全部辐条也偏模糊，DPS 只有在逐欠采样率调权重的条件下才与 pULA 相当。不确定性图在细小血管区域给出较高的方差，可作为"哪里不可信"的提示。

**范围限制**：单一志愿者、单一站点、脑部；定量结果以图呈现，没有跨数据集数值表；训练用的"真值"本身是小波正则重建而非全采样参考。

## 5. 复现与审计重点

- **代码归属要分清两层**：论文正文写"为可复现，复现本文结果的代码在 `https://gitlab.tugraz.at/ibi/mrirecon/papers/dps-pula`（Version v0.2）"，并注明"所有重建都用 BART v1.0.00 完成（`https://github.com/mrirecon/bart`）"。**BART 是通用 MR 重建框架，不是本文代码**；本文的贡献代码在那个 GitLab 仓库里。核查日期 2026-11-04（链接由正文给出；本次未抓取 GitLab 页面内容，登录态可能影响访问）。
- **依赖性很强**：BART、NLINV（敏感度）、ESPIRiT（掩膜）、RING（梯度延迟校正，径向用）都是外部工具；复现径向部分要把这几件串起来，任何一环版本不同都会改数值。
- **关键超参少但都很硬**：每个噪声水平的朗之万步数 K（论文给了 aULA 与 pULA 各自的取值）、CG 迭代次数（含热启动策略）、噪声尺度起点（4 倍与 12 倍加速不同）；这些在 supporting information 的 S2/S4 里，需要一并读。
- **比较的公平性**：与 DPS 的比较里，作者把 DPS 的似然权重按每个噪声尺度调过（并在噪声 ×3 的情形下重新网格搜索），同时保证网络评估次数相同；复现时如果照抄单一权重，会低估 DPS 从而高估本方法的相对优势。
- **"免调参"的准确边界**：指不需要调似然权重/正则参数，步长 τ 与 K 仍然是设定的；论文对 pULA 用同一个步长 τ 贯穿所有噪声水平，这一点是可以直接验证的强主张。

## 6. 建议阅读顺序

摘要（四段结构本身就是路线图）→ §5 引言的后验采样难点 → §6.1 贝叶斯重建 → §6.2 后验采样（精确 vs 退火 vs DPS 的差别）→ §6.3 预条件（Eq. 9–12，重点看为什么要 CG 而不是显式逆）→ §7.1–7.3（训练管线与实验设置）→ Fig. 3（噪声只在未采位置出现）→ Fig. 2（笛卡尔 PSNR/SSIM 与误差图）→ Fig. 4（噪声 ×3 时的权重失配）→ Fig. 5（径向）→ §9 讨论。

## 7. 前后关联

- 与 [Score-MRI](06-score-mri.md) 对照：同一族（后验采样 + 测量一致性），但 Score-MRI 走的是近似似然 + 数据一致性投影，这一篇走精确似然 + 预条件朗之万；对照两者可以看清"近似在哪一步引入"。
- 与 [DDS](20-dds.md) 对照：DDS 的分解采样在干净估计上做 CG 一致性校正，也是在解决"测量约束怎么进采样"，但它改的是采样分解，这里改的是条件数与步长。
- 与 [MSC](13-msc.md) 对照：MSC 指出后验样本会在**已测** k-space 上出现分歧（测量子空间泄漏），本文的"噪声只出现在未采位置"正好是同一现象的正面对照——一个描述失败模式，一个给出满足约束的采样器。
- 与 [FLEX-MRI](21-flex-mri.md) 对照：两者都在压缩采样步数与收敛速度，但 FLEX-MRI 走的是有限过渡学习，这里走的是数值优化层面的预条件。

## 8. 链接

- [arXiv 摘要](https://arxiv.org/abs/2512.05791)｜[HTML 正文](https://arxiv.org/html/2512.05791v2)｜[PDF](https://arxiv.org/pdf/2512.05791v2)
- 期刊版 DOI（MRM）：[10.1002/mrm.70416](https://doi.org/10.1002/mrm.70416)
- 复现代码（论文正文给出）：`https://gitlab.tugraz.at/ibi/mrirecon/papers/dps-pula`（Version v0.2）
- 重建框架：[mrirecon/bart](https://github.com/mrirecon/bart)（v1.0.00；通用框架，非本文专属实现）
