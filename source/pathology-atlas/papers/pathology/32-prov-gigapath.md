# Prov-GigaPath：整张切片基础模型

## 原文摘要

> Digital pathology poses unique computational challenges, as a standard gigapixel slide may comprise tens of thousands of image tiles 1 – 3 . Prior models have often resorted to subsampling a small portion of tiles for each slide, thus missing the important slide-level context 4 . Here we present Prov-GigaPath, a whole-slide pathology foundation model pretrained on 1.3 billion 256 × 256 pathology image tiles in 171,189 whole slides from Providence, a large US health network comprising 28 cancer centres. The slides originated from more than 30,000 patients covering 31 major tissue types. To pretrain Prov-GigaPath, we propose GigaPath, a novel vision transformer architecture for pretraining gigapixel pathology slides. To scale GigaPath for slide-level learning with tens of thousands of image tiles, GigaPath adapts the newly developed LongNet 5 method to digital pathology. To evaluate Prov-GigaPath, we construct a digital pathology benchmark comprising 9 cancer subtyping tasks and 17 pathomics tasks, using both Providence and TCGA data 6 . With large-scale pretraining and ultra-large-context modelling, Prov-GigaPath attains state-of-the-art performance on 25 out of 26 tasks, with significant improvement over the second-best method on 18 tasks. We further demonstrate the potential of Prov-GigaPath on vision–language pretraining for pathology 7 , 8 by incorporating the pathology reports. In sum, Prov-GigaPath is an open-weight foundation model that achieves state-of-the-art performance on various digital pathology tasks, demonstrating the importance of real-world data and whole-slide modelling.

*来源：PMC:PMC11153137。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![Prov-GigaPath 论文框架图](/papers/pathology/32-prov-gigapath-pipeline.jpg)

> **原文图注**：a , Flow chart showing the model architecture of Prov-GigaPath. Prov-GigaPath first serializes each input WSI into a sequence of 256 × 256 image tiles in row-major order and uses an image tile-level encoder to convert each image tile into a visual embedding. Then Prov-GigaPath applies a slide-level encoder based on the LongNet architecture to generate contextualized embeddings, which can serve as the basis for various downstream applications. b , Image tile-level pretraining using DINOv2. c , Slide-level pretraining with LongNet using masked autoencoder. [CLS] is the classification token.

*图源：https://pmc.ncbi.nlm.nih.gov/articles/PMC11153137/。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

先教模型认识每块街景，再教它理解整座城市如何由这些街景组成。Prov-GigaPath 同时学习 tile 级和整张 WSI 级表示。

### 0.2 它为什么出现？

只训练 patch encoder 会缺少全局上下文；直接处理十亿像素切片又不现实。

### 0.3 它到底怎么做？

1. 从真实世界 WSI 中切出海量 tile。
2. 用 DINOv2 学习 tile encoder。
3. 把 tile 组成超长序列，用 LongNet 建模整张切片。
4. 通过遮挡式 slide 预训练学习全局上下文，再迁移到下游任务。

### 0.4 先认清这些词

- **tile**：与 patch 类似，指从 WSI 裁下的图像块。
- **slide foundation model**：在大量整张切片上预训练、可迁移的模型。
- **LongNet**：用稀疏扩张注意力处理超长序列。
- **遮挡预训练**：藏住一部分输入，让模型根据上下文恢复或预测。

### 0.5 输入和输出

输入是 WSI 的 tile 序列；输出是 tile embedding、slide embedding 或下游预测。

### 0.6 最容易误解的地方

规模大不自动等于跨医院可靠；真实世界数据的机构分布和标签流程仍会形成偏差。

**现在只记住一句话：Prov-GigaPath = 先学小图块，再学整张切片的超大规模基础模型。**

## 1. 三分钟摘要与推荐理由
Prov-GigaPath 在 17 万余张真实世界 WSI、约 13 亿图块上进行 tile 级与 slide 级预训练，用 LongNet 处理超长序列，是理解 E2E-ViT、SlideChat 和 CPath-Omni“大规模 WSI 表征”假设的关键参照。

## 2. 论文解决的问题及其研究位置
许多基础模型只预训练 patch 编码器，下游仍需临时聚合。Prov-GigaPath同时学习局部 tile 与整张切片上下文。

## 3. 核心方法和数据流
WSI 切块 → DINOv2 tile encoder → tile token 序列 → LongNet 稀疏扩张注意力 slide encoder → MAE 式整图预训练 → 下游微调或图文对齐。

## 4. 关键实验、数据集与指标
论文事实：预训练使用 171,189 张切片、30,000 余名患者、31 种组织；在 26 个亚型与 pathomics 任务中 25 项达到当时最佳，并在 18 项显著领先第二名。

## 5. 官方代码仓库审计
仓库事实：提供 `environment.yaml`、模型实现、tiling 指南、demo、权重及 PCam/PANDA 示例；Apache-2.0，但模型用途说明限研究。复现评级 **A−**。

## 6. 环境、显存、存储和数据准备要求
仓库建议 A100；PANDA 预提取特征示例约 32GB。完整预训练规模不可作为普通实验目标，应优先复用权重。

## 7. 建议复现路径
最小测试：官方 demo 对示例切片生成 embedding。标准实验：用公开 PANDA 特征复现 slide-level 微调。扩展实验：与 E2E-ViT在相同患者划分比较冻结、局部微调和端到端训练。

## 8. 建议代码阅读顺序
预处理指南 → tile encoder → slide encoder/LongNet → 下游训练脚本 → demo 与模型卡。

## 9. 值得借鉴的思想与可迁移组件
基础模型评估应拆分“局部编码器质量”与“整图聚合能力”；公开权重能显著降低复现实验门槛。

## 10. 局限、复现风险和博士课题切入点
真实世界预训练数据仍来自单一医疗网络；完整训练难复现；模型规模、输入实例数与收益之间需要成本曲线。

## 11. 与前后论文的关联
HIPT先做层级自监督，Prov-GigaPath扩展到超大真实队列；E2E-ViT进一步挑战“必须预提取冻结特征”的两阶段范式。

## 12. 官方链接
[Nature 论文](https://www.nature.com/articles/s41586-024-07441-w) · [代码与权重](https://github.com/prov-gigapath/prov-gigapath)
