# 14｜CM-RED：用一致性模型做快速 RED 迭代的 MRI 生成先验

**论文**：Consistency Models for Fast MRI Reconstruction Using Regularization by Denoising，arXiv:2608.20561  
**定位**：一致性模型、RED、生成式 MRI 重建、少步推理  
**精读核验**：依据 arXiv v1 的摘要、方法、公开代码链接与版本记录整理（2026-09-22）；尚未进行复现实验。

## 原文摘要

> Diffusion models (DMs) have emerged as powerful generative priors for MRI reconstruction with promising results. Yet DM-based methods require extensive iterative refinement, limiting their practical deployment. Consistency models (CMs) provide a compelling alternative, aiming to map out the diffusion trajectory in a single pass, enabling faster generation. In this work, we propose CM-RED, a novel MRI reconstruction method that integrates a pretrained CM into the regularization by denoising (RED) scheme. Our method builds on accelerated proximal gradient RED (RED-APG), and further incorporates controlled noise injection during the update steps to enhance generative diversity and accelerate convergence. Extensive experiments on the fastMRI knee and brain datasets demonstrate that CM-RED achieves high-quality reconstructions across multiple anatomies, contrast weights, acceleration factors, and undersampling patterns, using only 4 network function evaluations (NFEs). The proposed method consistently outperforms existing DM- and CM-based approaches in both quantitative metrics and visual fidelity, and exhibits strong robustness to hyperparameter variations, highlighting CM-RED as an efficient and effective generative framework for accelerated MRI reconstruction. The source code and pretrained models are publicly available at https://github.com/MerveGulle/CM-RED.

*来源：arXiv:2608.20561；逐字原文，未改写、未压缩。*

## 中文摘要

> 扩散模型（DMs）已成为 MRI 重建中强大的生成先验，并取得了有前景的结果。然而，基于 DM 的方法需要大量迭代精修，限制了它们的实际部署。一致性模型（CMs）提供了一种有吸引力的替代方案，其目标是在单次前向中走完扩散轨迹，从而实现更快的生成。在本工作中，我们提出 CM-RED，一种新颖的 MRI 重建方法，它把预训练的 CM 集成到正则化去噪（regularization by denoising，RED）方案中。我们的方法建立在加速近端梯度 RED（RED-APG）之上，并进一步在更新步骤中引入受控噪声注入，以增强生成多样性并加速收敛。在 fastMRI knee 与 brain 数据集上的大量实验表明，CM-RED 仅使用 4 次网络函数评估（NFEs）即可在多种解剖部位、对比权重、加速倍数和欠采样模式上实现高质量重建。所提方法在定量指标与视觉保真度上均持续优于现有的基于 DM 与 CM 的方法，并对超参数变化表现出很强的鲁棒性，凸显出 CM-RED 是一个高效且有效的加速 MRI 重建生成框架。源代码与预训练模型公开于 https://github.com/MerveGulle/CM-RED。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

扩散 MRI 重建的强先验通常要数十到数百次网络调用。CM-RED 用 consistency model 把噪声状态直接映射到干净估计，再把它嵌入 regularization by denoising（RED）的 accelerated proximal-gradient 迭代。这样保留物理数据保真项，同时把生成先验的调用压到很少步数。

它是从 Score-MRI 到更快生成式重建的一条清晰路线：不是把数据一致性丢给纯生成模型，而是在 RED-APG 框架内让一致性模型充当可复用 prior。

## 2. 问题及研究位置

unrolled network 常绑定训练时的解剖、对比、采样模式和加速率；扩散后验采样更灵活但迭代昂贵。Consistency model 的目标是在扩散轨迹任意噪声层级给出一致的干净估计，CM-RED 则把这种快速去噪能力接入有测量约束的优化循环。

## 3. 核心方法和数据流

```text
欠采样多线圈 k-space y + encoding operator E
    → 初始重建 / 当前迭代 x_t
    → RED-APG 数据保真梯度更新
    → 受控噪声注入 + 与迭代相关的噪声强度
    → 预训练 consistency model：少次 NFE 预测干净图像 / RED prior
    → 下一次 RED-APG 更新
    → 重复少量迭代 → 最终 MRI 重建
```

论文在 fastMRI knee 与 brain 上用 4 次 network function evaluations（NFE）报告跨 anatomy、contrast、acceleration 和欠采样 pattern 的重建结果。方法不是直接从噪声无条件生成图像；每次更新都保留 encoding operator 的测量保真约束。

## 4. 论文证据与实验范围

- 作者使用 RED-APG，并加入 controlled noise injection 和 iteration-adaptive denoising strength。
- 论文报告在 knee/brain、多个对比、加速率和采样模式上优于比较的 diffusion- 与 consistency-model 方法；这些性能结论应在完全匹配的 protocol 下复核。
- 正文还报告统一超参数在不同解剖、对比和 mask 间的鲁棒性分析；加速率仍使用不同设置。

## 5. 复现与审计重点

- 官方代码与预训练模型：[MerveGulle/CM-RED](https://github.com/MerveGulle/CM-RED)。
- 先验证预训练 CM 的去噪轨迹和 NFE，再接入 RED-APG；不要只把 CM 当作普通 U-Net 去噪器。
- 记录 NFE、总 wall-clock 时间、数据一致性残差及 PSNR/SSIM，避免只以单一图像质量指标比较速度。
- 分别测试训练分布内和 sampling-pattern / acceleration / anatomy 迁移；少 NFE 不自动意味着 OOD 保真。

## 6. 建议阅读顺序

`Abstract` → `2.1 MRI Reconstruction Inverse Problem` → `2.3 Consistency Models` → `CM-RED method` → hyperparameter robustness 与 fastMRI 实验 → 官方仓库配置。

## 7. 前后关联

- 与 [Score-MRI](06-score-mri.md) 比较多步 score posterior sampling 和少步 consistency prior。
- 与 [HUMUS-Net](07-humus-net.md) 及 [PromptMR+](10-promptmr-plus.md) 比较重建质量、模型规模与系统效率的不同优化点。
- 与 [MSC](13-msc.md) 比较生成重建迭代与采样输出的测量子空间一致性审计。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2608.20561)
- [arXiv HTML 正文](https://arxiv.org/html/2608.20561v1)
- [官方代码与预训练模型](https://github.com/MerveGulle/CM-RED)
