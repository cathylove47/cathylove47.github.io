# 13｜MSC：把扩散后验样本的已测 k-space 锁回观测值

**论文**：Measured-Subspace Consistency: A Plug-and-Play Operator for Diffusion Posterior Sampling in Accelerated MRI Reconstruction，arXiv:2606.28448  
**定位**：扩散后验采样、物理一致性、不确定性审计、多线圈 k-space 投影  
**精读核验**：依据 arXiv v1 的摘要、方法和版本记录整理（2026-09-22）；尚未进行复现实验。

## 原文摘要

> Diffusion posterior samplers for accelerated MRI can reconstruct accurately yet still disagree on the acquired k-space across samples, placing posterior variability on coefficients the scanner has already measured. We identify this measured-subspace leakage as a physical-admissibility failure. Under a hard-constraint model it violates the measurement constraint and inflates the reported uncertainty with disagreement about coefficients the scanner has already determined. To quantify this leakage, we introduce complementary measured- and unmeasured-subspace k-space dispersion metrics (MSD/USD). We then present Measured-Subspace Consistency (MSC), a training-free terminal correction that wraps any compatible image-space posterior sampler with a standard multi-coil consistency lock. The ideal lock follows classical range/null-space data consistency. Our contribution is to repurpose it as a black-box posterior audit and correction rather than a new reconstructor or learned sampler. Theoretically, we prove that the ideal transform confines pairwise sample differences to the MRI null space and bound the residual cross-subspace coupling left by practical sensitivity-weighted implementations. Across six base samplers and two MRI anatomies, including out-of-distribution transfer where a knee prior reconstructs brain, MSC substantially reduces measured-subspace dispersion for Soft samplers (a median 16.5x reduction for DPS across five brain contrasts, up to ~29x), while preserving unmeasured-subspace diversity and acting as a near-identity map for Consistent ones. Furthermore, MSC maintains or modestly improves PSNR/SSIM, with no retraining, retuning, or significant computational overhead.

*来源：arXiv:2606.28448；逐字原文，未改写、未压缩。*

## 中文摘要

> 用于加速 MRI 的扩散后验采样器能够准确重建，但不同样本在已采集的 k-space 上仍会彼此不一致，把后验变异性放在扫描仪已经测量过的系数上。我们把这种已测子空间泄漏认定为一种物理可容许性失效。在硬约束模型下，它违反测量约束，并以对扫描仪已经确定的系数的不一致，虚增所报告的不确定性。为量化这种泄漏，我们引入互补的已测子空间与未测子空间 k-space 离散度指标（MSD/USD）。随后我们提出 Measured-Subspace Consistency（MSC），一个免训练的终端校正，它用标准的多线圈一致性锁包裹任何兼容的图像域后验采样器。理想的一致性锁遵循经典的值域/零空间数据一致性。我们的贡献在于把它重新用作黑盒的后验审计与校正，而不是一个新的重建器或学习式采样器。在理论上，我们证明该理想变换把成对样本差异限制在 MRI 零空间内，并界定了实际灵敏度加权实现所留下的残余跨子空间耦合。在六个基础采样器和两种 MRI 解剖部位上，包括用膝部先验重建脑部的分布外迁移，MSC 显著降低 Soft 采样器的已测子空间离散度（DPS 在五个脑部对比上中位数降低 16.5 倍，最高约 29 倍），同时保留未测子空间的多样性，并对 Consistent 采样器表现为近似恒等映射。此外，MSC 维持或略微提升 PSNR/SSIM，且无需重新训练、重新调参，也没有显著的计算开销。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

扩散采样器能给出多张合理 MRI 重建，但这些样本可能在扫描仪已经测得的 k-space 系数上彼此不同。MSC 把这种“已测子空间泄漏”视为物理不可接受的不确定性：不重训扩散模型，只在每条采样链最终输出后做一次多线圈 data-consistency paste-back，把已采样系数替换回观测值，同时保留未采样系数的多样性。

它不是又一个 learned reconstructor，而是一个可附加于 Score-MRI、DPS 等后验采样器的审计与修正步骤。

## 2. 问题及研究位置

PSNR/SSIM 高不代表后验不确定性物理正确。对硬约束、近似无噪声的采集，样本差异应只存在于未采样的 null space；若在 acquired lines 上也波动，模型是在对已观察数据“不确定”。MSC 用 measured-subspace dispersion（MSD）和 unmeasured-subspace dispersion（USD）把两类波动拆开。

## 3. 核心方法和数据流

```text
观测多线圈 k-space y + mask M + sensitivity maps S
    → 任意兼容的 image-space diffusion posterior sampler
    → 得到 L 个最终图像样本 z^(1)...z^(L)
    → 对每个样本：S → FFT → 预测多线圈 k-space
    → 终端 MSC：已采样位置替换为 y；未采样位置保留预测值
    → IFFT + S^H 线圈合成 → 物理一致的样本
    → 计算 MSD（已测）/ USD（未测）与 chain-mean PSNR、SSIM
```

理想范围/零空间形式为 `z + A⁺(y − Az)`：测量分量被观测值覆盖，样本间差异被限制到 `N(A)`。实际多线圈实现是 sensitivity-weighted POCS paste-back，论文同时讨论其残余 cross-subspace coupling。

## 4. 论文证据与实验范围

- 论文比较六个 base sampler、两种解剖部位，并测试 knee prior 迁移到 brain 的 OOD 情况。
- 作者报告 MSC 对 Soft samplers 的 MSD 有显著降低，同时保持 USD，并维持或略改善 PSNR/SSIM。
- MSD/USD 针对最终返回样本、在多线圈 k-space 中计算；它们补充而不替代图像域不确定性校准。

## 5. 复现与审计重点

- 本次核验的 arXiv 页面未列出官方代码链接。
- 先复现不加 MSC 的多链后验样本，再同时报告 MSD、USD、PSNR、SSIM；只报告 MSD 下降无法证明未测空间多样性被保留。
- 硬约束结论假设测量噪声可忽略；真实有噪声的采集允许一定测量子空间方差，不能机械地把 MSD 压到零。
- 包装器要求 sampler 暴露 image-space 最终输出和可用的前向算子；latent-only 或 k-space-native sampler 不一定能直接接入。

## 6. 建议阅读顺序

`Abstract` → `Fig. 2` → `3.1 Measured-Subspace Leakage Problem` → `3.2 Ideal Consistency Operator` → `3.3 Practical Multi-Coil Operator` → MSD/USD 实验。

## 7. 前后关联

- 与 [Score-MRI](06-score-mri.md) 比较扩散采样过程内的数据一致性和采样结束后的终端一致性锁。
- 与 [CM-RED](14-cm-red.md) 比较生成先验如何嵌入重建迭代，以及 MSC 如何作为黑盒后处理审计。
- 与 [VarNet](04-varnet.md) 比较端到端级联中的 data consistency 与后验多样性约束。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2606.28448)
- [arXiv HTML 正文](https://arxiv.org/html/2606.28448v1)
