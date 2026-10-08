# AEM：用注意力熵缓解 WSI MIL 过拟合

## 原文摘要

> Multiple Instance Learning (MIL) effectively analyzes whole slide images but faces overfitting due to attention over-concentration. While existing solutions rely on complex architectural modifications or additional processing steps, we introduce Attention Entropy Maximization (AEM), a simple yet effective regularization technique. Our investigation reveals the positive correlation between attention entropy and model performance. Building on this insight, we integrate AEM regularization into the MIL framework to penalize excessive attention concentration. To address sensitivity to the AEM weight parameter, we implement Cosine Weight Annealing, reducing parameter dependency. Extensive evaluations demonstrate AEM's superior performance across diverse feature extractors, MIL frameworks, attention mechanisms, and augmentation techniques. Here is our anonymous code: https://github.com/dazhangyu123/AEM.

*来源：arXiv:2406.15303（https://arxiv.org/abs/2406.15303）。逐字原文，未改写、未压缩。*

## 中文摘要

> 多实例学习（MIL）能有效地分析全切片图像，但由于 attention 过度集中而面临过拟合。现有解决方案依赖于复杂的架构改动或额外的处理步骤，而我们引入注意力熵最大化（Attention Entropy Maximization，AEM），一种简单却有效的正则化技术。我们的研究揭示了 attention entropy 与模型性能之间的正相关。基于这一洞见，我们将 AEM 正则整合进 MIL 框架，以惩罚过度的 attention 集中。为解决对 AEM 权重参数的敏感性，我们实现了余弦权重退火（Cosine Weight Annealing），以降低对该参数的依赖。大量评估表明，AEM 在不同的特征提取器、MIL 框架、attention 机制和数据增强技术上都具有更优的性能。这是我们匿名公开的代码：https://github.com/dazhangyu123/AEM。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![AEM 论文框架图](/papers/pathology/39-aem-pipeline.png)

> **原文图注**：Figure 3 : Overview of plugging ADR into MIL framework. ADR adds only a negative entropy regularization for attention values to the regular MIL framework.

*图源：https://arxiv.org/html/2406.15303v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

一个学生刚开始学习时只盯住一道题，容易记答案；AEM 先鼓励他多看一些证据，训练后期再允许注意力集中到真正关键区域。

### 0.2 它为什么出现？

小数据、类别不平衡和染色偏差下，ABMIL attention 可能过早集中在少数 patch，训练集继续变好而测试集变差。

### 0.3 它到底怎么做？

1. 维持原有 patch encoder、MIL aggregator 和分类损失。
2. 对归一化 attention weights 计算熵。
3. 加入负熵正则，惩罚过度集中的分布。
4. 用 cosine weight annealing 逐步减小正则权重，让后期可以聚焦病灶。

### 0.4 先认清这些词

- **attention entropy**：attention 分布的不确定度；越高表示权重更分散。
- **负熵正则**：训练时鼓励更高熵，而不是在推理时强制均匀。
- **cosine annealing**：让正则权重按余弦曲线逐渐减小。
- **OOD**：训练分布之外的医院、扫描仪或人群数据。

### 0.5 输入和输出

输入和输出与原 MIL 完全相同；AEM 只改变训练 loss，不增加推理模块。

### 0.6 最容易误解的地方

高 attention entropy 与高性能在论文协议中相关，不代表熵越高越好，也不能证明 attention 本身具有因果解释性。

**现在只记住一句话：AEM = 在训练早期阻止 attention 过快塌缩，成本低、易插入现有 MIL。**

## 1. 三分钟摘要与推荐理由

AEM 是近期 MICCAI WSI 工作里最容易落地的一个：不增加 teacher、masking branch、聚类或额外 encoder，只添加一个正则项。它在 CAMELYON16/17 和院内 LBC、多个病理基础 encoder 与 MIL 框架上显示稳定收益，适合作为任何新 MIL 聚合器必须比较的 training-dynamics baseline。

## 2. 论文解决的问题及其研究位置

许多方法通过复杂架构缓解 MIL 过拟合；AEM 反过来问，问题是否来自 attention 优化过程本身。它不解决 patch 表征或长序列建模，而是约束 aggregator 在有限 slide 标签下如何分配证据。

## 3. 核心方法和数据流

对 softmax attention $A=\{a_n\}$，训练目标为：

$$
\mathcal{L}_{total}=\mathcal{L}_{CE}+\lambda\sum_n a_n\log a_n
$$

第二项是负熵；最小化它会提高 attention entropy。Cosine Weight Annealing 让 $\lambda$ 前期较大、后期衰减，避免模型始终保持近似 MeanMIL。

## 4. 关键实验、数据集与指标

- CAMELYON16：医院 1 的 270 WSI 训练/验证，医院 2 的 130 张测试。
- CAMELYON17：3 家医院 300 张训练/验证，另 2 家医院 200 张 OOD 测试。
- LBC：1,989 张院内宫颈细胞学 WSI，四分类。
- Lunit ViT-S + CAMELYON16：AEM F1 0.947±0.003、AUC 0.974±0.007；ABMIL 为 0.914±0.031、0.945±0.027。
- CAMELYON17 OOD：AEM F1 0.647±0.007、AUC 0.887±0.013；ABMIL 为 0.522±0.050、0.853±0.016。
- LBC：AEM F1 0.664±0.021、AUC 0.879±0.013；ABMIL 为 0.595±0.036、0.831±0.022。
- 200 个初始化中，attention entropy 与 LBC test AUROC 的 Pearson/Spearman 相关为 0.46/0.44；这是相关性证据。

## 5. 官方代码仓库审计

复现评级 **A−**。仓库包含完整切块、特征提取、配置、数据表、多个 MIL/attention 架构和主训练入口，并在 Hugging Face 发布预提取 features。代码基于 ACMIL，适合直接验证 plug-and-play 主张；院内 LBC 原始数据仍不可完全公开复现。

## 6. 环境、显存、存储和数据准备要求

使用作者预提取 features 时，AEM 几乎不增加推理显存，训练额外成本也很小。完整 pipeline 仍需 WSI 切块和 Lunit/PathGen-CLIP/UNI/CONCH/GigaPath 等 encoder 权重。公平实验必须固定 encoder、split、随机种子和 early stopping。

## 7. 建议复现路径

1. **最小测试**：在 ABMIL attention 上打印原 loss、entropy 与 AEM loss，验证符号方向。
2. **标准实验**：使用 Hugging Face features 复现 CAMELYON16 的五随机种子结果。
3. **超参数测试**：扫描 $\lambda$ 并同时报告平均性能、方差和 attention entropy。
4. **失败边界**：按病灶面积分层，检查微小阳性区域是否被过强熵正则淹没。

## 8. 建议代码阅读顺序

`README.md` → `config/` → `models.py` → `architecture/` → `main.py` 中 AEM loss 与 top-k 逻辑 → `datasets/` → `utils/`。

## 9. 值得借鉴的思想与可迁移组件

- 在换模型前，先检查 attention 分布、梯度和训练曲线。
- 简单正则应跨 encoder、aggregator、数据集和随机种子验证，而非只在单配置中取最好值。
- OOD 医院划分比随机 slide split 更能检验正则是否抑制中心捷径。

## 10. 局限、复现风险和博士课题切入点

熵与性能关系不是因果证明；稀疏病灶可能真正需要尖锐 attention；LBC 为院内数据；尚缺 survival、biomarker 与跨扫描仪验证。可研究 lesion-size adaptive entropy、类别条件化正则、与 calibration/拒答结合，以及 attention 因果扰动实验。

## 11. 与前后论文的关联

先读 CLAM/DSMIL 理解 attention MIL，再读 AEM；与 DTFD-MIL、ACMIL 等结构化抗过拟合方案做同特征比较。强 encoder 如 CONCH/GigaPath 并未消灭 aggregation 过拟合，AEM正好检验这一点。

## 12. 官方链接

- [MICCAI 官方 PDF](https://papers.miccai.org/miccai-2025/paper/5183_paper.pdf)
- [Springer DOI](https://doi.org/10.1007/978-3-032-04981-0_5)
- [官方代码与预提取特征](https://github.com/dazhangyu123/AEM)
