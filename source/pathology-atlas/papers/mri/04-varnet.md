# End-to-End VarNet

## 原文摘要

> The slow acquisition speed of magnetic resonance imaging (MRI) has led to the development of two complementary methods: acquiring multiple views of the anatomy simultaneously (parallel imaging) and acquiring fewer samples than necessary for traditional signal processing methods (compressed sensing). While the combination of these methods has the potential to allow much faster scan times, reconstruction from such undersampled multi-coil data has remained an open problem. In this paper, we present a new approach to this problem that extends previously proposed variational methods by learning fully end-to-end. Our method obtains new state-of-the-art results on the fastMRI dataset for both brain and knee MRIs.

*来源：arXiv:2004.06688（https://arxiv.org/abs/2004.06688）。逐字原文，未改写、未压缩。*

## 中文摘要

> 磁共振成像（MRI）缓慢的采集速度促成了两类互补方法的发展：同时采集解剖结构的多个视图（并行成像），以及采集比传统信号处理方法所需的更少的样本（压缩感知）。尽管这些方法的结合有潜力实现快得多的扫描时间，但从这种欠采样的多线圈数据中进行重建始终是一个未解决的难题。在本文中，我们针对这一问题提出一种新方法，它通过完全端到端的学习来扩展先前提出的变分方法。我们的方法在 fastMRI 数据集上的脑部与膝关节 MRI 上均取得了新的最先进结果。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![E2E-VarNet 论文框架图](/papers/mri/04-varnet-pipeline.png)

> **原文图注**：Figure 1 : Top : Block diagram of our model which takes under-sampled k-space as input and applies several cascades, followed by an inverse Fourier transform (IFT) and an RSS transform. The Data Consistency (DC) module computes a correction map that brings the intermediate k-space closer to the measured k-space values. The Refinement (R) module maps multi-coil k-space data into one image, applies a U-Net, and then back to multi-coil k-space data. The Sensitivity Map Estimation (SME) module estimates the sensitivity maps used in the Refinement module.

*图源：https://arxiv.org/html/2004.06688v1。原图直接取自论文，未重绘、未描摹。*

## 三分钟摘要与推荐理由

E2E-VarNet 将经典变分网络扩展到多线圈 MRI，并把灵敏度图估计纳入端到端学习。它兼具清晰物理结构、成熟 fastMRI 实现和预训练权重，是这个分支最值得完整复现的基线。

## 问题与研究位置

多线圈重建不仅要恢复图像，还要处理每个接收线圈的空间敏感度。依赖外部校准会割裂流程，VarNet 用中心 k-space 学习灵敏度并联合优化。

## 核心方法和数据流

中心 k-space → sensitivity model → 多线圈图像合成；随后多个 cascade 在 k-space 中执行软数据一致性，并由图像域 U-Net 学习正则化更新。

## 关键实验、数据集与指标

重点看 fastMRI 多线圈膝关节任务、不同加速率以及挑战评测。复现时固定官方数据切分、mask 参数与归一化，否则指标不可直接比较。

## 官方代码仓库审计

实现位于 `facebookresearch/fastMRI/fastmri_examples/varnet`，有 Lightning 训练模块、测试和官方权重。仓库 README 明确提示当前代码与论文模型/超参数存在少量差异，引用结果时需区分。

## 资源与数据准备

推理可使用预训练权重；全量训练较重。建议从 2–4 个 cascade、小分辨率或数据子集起步，再扩大至官方配置。

## 建议复现路径

1. 运行预训练模型并保存 zero-filled、重建、误差图。
2. 跟踪一个 batch 的 k-space/coil/image shape。
3. 训练小型 VarNet。
4. 消融 sensitivity model 与数据一致性权重。

## 建议代码阅读顺序

`fastmri/models/varnet.py` → `fastmri/models/unet.py` → `fastmri_examples/varnet/varnet_module.py` → `train_varnet_demo.py` → data transforms。

## 可迁移思想与博士切入点

值得研究灵敏度估计失效、校准区不足、跨线圈数迁移和噪声感知数据一致性。它也是测试新正则器最可靠的工程母体。

## 局限与复现风险

训练显存与时间成本高；SSIM 优化不保证病灶细节。公开数据多为回顾性规则采样，真实部署差距仍大。

## 与前后论文的关联

承接 MoDL 的优化展开；HUMUS-Net 更换多尺度正则器，PromptMR+ 则重点改进深展开的梯度与显存效率。

## 官方链接

- [论文](https://arxiv.org/abs/2004.06688)
- [代码与权重](https://github.com/facebookresearch/fastMRI/tree/main/fastmri_examples/varnet)
