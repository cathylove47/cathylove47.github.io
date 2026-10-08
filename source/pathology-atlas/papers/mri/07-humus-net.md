# HUMUS-Net

## 原文摘要

> In accelerated MRI reconstruction, the anatomy of a patient is recovered from a set of under-sampled and noisy measurements. Deep learning approaches have been proven to be successful in solving this ill-posed inverse problem and are capable of producing very high quality reconstructions. However, current architectures heavily rely on convolutions, that are content-independent and have difficulties modeling long-range dependencies in images. Recently, Transformers, the workhorse of contemporary natural language processing, have emerged as powerful building blocks for a multitude of vision tasks. These models split input images into non-overlapping patches, embed the patches into lower-dimensional tokens and utilize a self-attention mechanism that does not suffer from the aforementioned weaknesses of convolutional architectures. However, Transformers incur extremely high compute and memory cost when 1) the input image resolution is high and 2) when the image needs to be split into a large number of patches to preserve fine detail information, both of which are typical in low-level vision problems such as MRI reconstruction, having a compounding effect. To tackle these challenges, we propose HUMUS-Net, a hybrid architecture that combines the beneficial implicit bias and efficiency of convolutions with the power of Transformer blocks in an unrolled and multi-scale network. HUMUS-Net extracts high-resolution features via convolutional blocks and refines low-resolution features via a novel Transformer-based multi-scale feature extractor. Features from both levels are then synthesized into a high-resolution output reconstruction. Our network establishes new state of the art on the largest publicly available MRI dataset, the fastMRI dataset. We further demonstrate the performance of HUMUS-Net on two other popular MRI datasets and perform fine-grained ablation studies to validate our design.

*来源：arXiv:2203.08213（https://arxiv.org/abs/2203.08213）。逐字原文，未改写、未压缩。*

## 中文摘要

> 在加速 MRI 重建中，患者的解剖结构由一组欠采样且有噪声的测量数据恢复得到。深度学习方法已被证明能够成功求解这一不适定逆问题，并能够产生非常高质量的重建结果。然而，当前的架构严重依赖卷积，而卷积是与内容无关的，并且难以对图像中的长程依赖关系建模。近来，作为当代自然语言处理中坚力量的 Transformer，已成为众多视觉任务的强大构建模块。这类模型将输入图像切分成互不重叠的 patch，将 patch 嵌入为更低维的 token，并利用一种自注意力机制，该机制不受前述卷积架构弱点的影响。然而，当 1）输入图像分辨率很高，以及 2）为保留精细细节信息而需要把图像切分成大量 patch 时，Transformer 会产生极高的计算与内存开销，而这两种情形在诸如 MRI 重建这样的低层视觉问题中都很典型，从而产生叠加效应。为应对这些挑战，我们提出 HUMUS-Net，一种混合架构，在展开的多尺度网络中将卷积有益的隐式偏置与效率同 Transformer 模块的强大能力结合起来。HUMUS-Net 通过卷积模块提取高分辨率特征，并通过一种新颖的基于 Transformer 的多尺度特征提取器精炼低分辨率特征。随后，来自这两个层级的特征被合成为高分辨率的输出重建结果。我们的网络在最大的公开可用 MRI 数据集——fastMRI 数据集上确立了新的最先进水平。我们进一步在两个其他常用 MRI 数据集上展示了 HUMUS-Net 的性能，并进行了细粒度的消融研究以验证我们的设计。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![HUMUS-Net 论文框架图](/papers/mri/07-humus-net-pipeline.png)

> **原文图注**：Figure 1: Overview of the HUMUS-Block architecture. First, we extract high-resolution features 𝑭 𝑯 \bm{F_{H}} from the input noisy image through a convolution layer f H f_{H} . Then, we apply a convolutional feature extractor f L f_{L} to obtain low-resolution features and process them using a Transformer-convolutional hybrid multi-scale feature extractor. The shallow, high-resolution and deep, low-resolution features are then synthesized into the final high-resolution denoised image.

*图源：https://arxiv.org/html/2203.08213v1。原图直接取自论文，未重绘、未描摹。*

## 三分钟摘要与推荐理由

HUMUS-Net 在展开网络中结合高分辨率卷积与低分辨率 Transformer，使模型既保留局部细节，又以较低代价建模长程依赖。它适合学习“架构创新如何服从 MRI 物理框架”。

## 问题与研究位置

纯 CNN 的感受野受限，而直接在高分辨率图像上使用 Transformer 成本过高。论文把全局建模放到多尺度低分辨率特征上，再回到高分辨率重建。

## 核心方法和数据流

VarNet 式多 cascade 展开 → 每个正则器内部由卷积提取高分辨率特征 → Transformer 处理低分辨率多尺度特征 → 融合并执行数据一致性。

## 关键实验、数据集与指标

仓库给出 fastMRI 多线圈膝关节 8× 的可复现实验，并覆盖 Stanford 2D/3D FSE 数据。读消融时区分多尺度、Transformer 和展开深度的贡献。

## 官方代码仓库审计

`z-fabian/HUMUS-Net` 为官方 PyTorch 实现，含 `models`、`pl_modules`、数据代码、requirements 和预训练 leaderboard 权重。目录沿用 fastMRI 风格，可维护性优于早期代码。

## 资源与数据准备

预训练推理可先做；全量训练计算和存储成本较高。Transformer 窗口、patch 大小与输入分辨率相互约束，修改尺寸时需检查 padding。

## 建议复现路径

1. 预训练模型验证 fastMRI 单 volume。
2. 对比同一输入下 E2E-VarNet 与 HUMUS-Net。
3. 训练缩小版网络并记录显存/速度。
4. 消融 Transformer、多尺度层级和 cascade 数。

## 建议代码阅读顺序

`humus_examples` → `pl_modules` → `models/humus_net.py` → 多尺度 Transformer 模块 → `data`。

## 可迁移思想与博士切入点

可以进一步研究状态空间模型、稀疏注意力或频域 token；评价时应把重建质量、显存、吞吐和跨尺寸稳定性放在同一张表。

## 局限与复现风险

架构复杂度高，收益可能依赖精细训练配置；多尺度 attention 的提升不等于临床细节必然改善。

## 与前后论文的关联

以 E2E-VarNet 为母体更换正则器；PromptMR+ 进一步从训练梯度和灵敏度估计讨论展开网络效率。

## 官方链接

- [论文](https://arxiv.org/abs/2203.08213)
- [代码与权重](https://github.com/z-fabian/HUMUS-Net)
