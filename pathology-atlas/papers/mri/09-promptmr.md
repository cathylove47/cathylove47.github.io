# PromptMR

## 原文摘要

> The key to dynamic or multi-contrast magnetic resonance imaging (MRI) reconstruction lies in exploring inter-frame or inter-contrast information. Currently, the unrolled model, an approach combining iterative MRI reconstruction steps with learnable neural network layers, stands as the best-performing method for MRI reconstruction. However, there are two main limitations to overcome: firstly, the unrolled model structure and GPU memory constraints restrict the capacity of each denoising block in the network, impeding the effective extraction of detailed features for reconstruction; secondly, the existing model lacks the flexibility to adapt to variations in the input, such as different contrasts, resolutions or views, necessitating the training of separate models for each input type, which is inefficient and may lead to insufficient reconstruction. In this paper, we propose a two-stage MRI reconstruction pipeline to address these limitations. The first stage involves filling the missing k-space data, which we approach as a physics-based reconstruction problem. We first propose a simple yet efficient baseline model, which utilizes adjacent frames/contrasts and channel attention to capture the inherent inter-frame/-contrast correlation. Then, we extend the baseline model to a prompt-based learning approach, PromptMR, for all-in-one MRI reconstruction from different views, contrasts, adjacent types, and acceleration factors. The second stage is to refine the reconstruction from the first stage, which we treat as a general video restoration problem to further fuse features from neighboring frames/contrasts in the image domain. Extensive experiments show that our proposed method significantly outperforms previous state-of-the-art accelerated MRI reconstruction methods.

*来源：arXiv:2309.13839（https://arxiv.org/abs/2309.13839）。逐字原文，未改写、未压缩。*

## 中文摘要

> 动态或多对比磁共振成像（MRI）重建的关键在于挖掘帧间或对比间的信息。目前，展开模型（unrolled model）——一种将迭代 MRI 重建步骤与可学习神经网络层相结合的方法——是 MRI 重建中表现最好的方法。然而，有两个主要局限有待克服：第一，展开模型的结构与 GPU 显存约束限制了网络中每个去噪模块的容量，阻碍了有效提取重建所需的细节特征；第二，现有模型缺乏适应输入变化的灵活性，例如不同的对比度、分辨率或视角，因而需要为每种输入类型分别训练模型，这既低效，也可能导致重建不充分。本文提出一个两阶段的 MRI 重建流程来应对这些局限。第一阶段是填补缺失的 k-space 数据，我们把它当作一个基于物理的重建问题来处理。我们首先提出一个简单但高效的基线模型，它利用相邻帧/对比与通道注意力来捕捉固有的帧间/对比间相关性。随后，我们把该基线模型扩展为基于提示的学习方法 PromptMR，用于从不同视角、对比、相邻类型和加速倍数进行一体化（all-in-one）MRI 重建。第二阶段是对第一阶段的重建进行精修，我们把它视为一个通用的视频复原问题，以在图像域中进一步融合来自相邻帧/对比的特征。大量实验表明，我们提出的方法显著优于此前最先进的加速 MRI 重建方法。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![PromptMR 论文框架图](/papers/mri/09-promptmr-pipeline.png)

> **原文图注**：Figure 2: Overview of PromptMR in Stage I: an all-in-one unrolled model for MRI reconstruction. Adjacent inputs, depicted in image domain for visual clarity, provide neighboring k-space information for reconstruction. To accommodate different input varieties, the input-type adaptive visual prompt is integrated into each cascade of the unrolled architecture to guide the reconstruction process.

*图源：https://arxiv.org/html/2309.13839v1。原图直接取自论文，未重绘、未描摹。*

## 三分钟摘要与推荐理由

PromptMR 用输入类型自适应视觉提示（prompt）调节深展开模型，使同一框架处理动态 MRI 和多对比 MRI。它的意义是把“任务/输入条件”显式注入每个 cascade，而不是为每种输入重做架构。

## 问题与研究位置

相邻时间帧、切片或对比都能提供信息，但其统计关系不同。固定融合网络难以适应多种输入组合；prompt block 根据输入生成分层条件特征。

## 核心方法和数据流

相邻 k-space 输入 → 多 cascade 展开 → 每个 PromptUnet 在不同尺度生成自适应 prompt 并与解码特征融合 → 数据一致性 → 输出重建。

## 关键实验、数据集与指标

仓库覆盖 CMRxRecon 与 fastMRI 多线圈膝关节，并提供训练、推理和预训练模型。结果解读要区分挑战数据、公开验证集以及动态/多对比两种输入结构。

## 官方代码仓库审计

`hellopipu/PromptMR` 是官方 PyTorch 实现，MIT 许可证，有 `INSTALL.md`、环境文件、模型、Lightning 模块和预训练权重入口。仓库明确标注部分 Calgary/fastMRI brain 代码与权重后续发布状态，使用前仍应按当前 README 核验。

## 资源与数据准备

完整模型较重。先使用已发布的 fastMRI knee 权重；处理动态心脏数据时，需要理解相邻帧组织方式与 CMRxRecon 预处理。

## 建议复现路径

1. 跑通预训练 fastMRI knee 推理。
2. 可视化 prompt 在不同尺度的响应。
3. 对比无 prompt、固定 prompt 和自适应 prompt。
4. 测试邻帧/邻对比缺失和数量变化。

## 建议代码阅读顺序

`promptmr_examples` → `pl_modules` → `models` 中 cascade 与 PromptUnet → `data` → `INSTALL.md` 的数据准备。

## 可迁移思想与博士切入点

条件提示可用于采样轨迹、场强、厂商和加速率适配。应重点研究 prompt 是否真的编码条件，以及跨域时是否比简单条件归一化更稳定。

## 局限与复现风险

大模型和复杂输入使消融成本高；“统一模型”不代表对未见协议零样本泛化。数据组织错误很容易造成邻近信息泄漏。

## 与前后论文的关联

把 MC-VarNet 的多对比专用建模推向统一条件模型；PromptMR+ 保留思路并优化深展开训练效率。

## 官方链接

- [论文](https://doi.org/10.1007/978-3-031-52448-6_25)
- [代码与权重](https://github.com/hellopipu/PromptMR)
