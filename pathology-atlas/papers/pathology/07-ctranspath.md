# 07｜CTransPath：病理 patch encoder 的经典开源基线

**论文**：Transformer-based Unsupervised Contrastive Learning for Histopathological Image Classification，Medical Image Analysis 2022  
**定位**：病理自监督预训练、Swin Transformer、patch 表征  
**建议投入**：优先学会正确加载公开权重并批量提特征；从头预训练只适合有明确研究问题时做。

**精读核验**：Medical Image Analysis 81 (2022), Article 102559；CTransPath 将 CNN 的局部归纳偏置与多尺度 Swin Transformer 结合，并采用语义相关对比学习（Semantically-Relevant Contrastive Learning, SRCL）（2026-09-01）。

## 原文摘要

> A large-scale and well-annotated dataset is a key factor for the success of deep learning in medical image analysis. However, assembling such large annotations is very challenging, especially for histopathological images with unique characteristics (e.g., gigapixel image size, multiple cancer types, and wide staining variations). To alleviate this issue, self-supervised learning (SSL) could be a promising solution that relies only on unlabeled data to generate informative representations and generalizes well to various downstream tasks even with limited annotations. In this work, we propose a novel SSL strategy called semantically-relevant contrastive learning (SRCL), which compares relevance between instances to mine more positive pairs. Compared to the two views from an instance in traditional contrastive learning, our SRCL aligns multiple positive instances with similar visual concepts, which increases the diversity of positives and then results in more informative representations. We employ a hybrid model (CTransPath) as the backbone, which is designed by integrating a convolutional neural network (CNN) and a multi-scale Swin Transformer architecture. The CTransPath is pretrained on massively unlabeled histopathological images that could serve as a collaborative local-global feature extractor to learn universal feature representations more suitable for tasks in the histopathology image domain. The effectiveness of our SRCL-pretrained CTransPath is investigated on five types of downstream tasks (patch retrieval, patch classification, weakly-supervised whole-slide image classification, mitosis detection, and colorectal adenocarcinoma gland segmentation), covering nine public datasets. The results show that our SRCL-based visual representations not only achieve state-of-the-art performance in each dataset, but are also more robust and transferable than other SSL methods and ImageNet pretraining (both supervised and self-supervised methods). Our code and pretrained model are available at https://github.com/Xiyue-Wang/TransPath.

*来源：PubMed PMID 35952419（https://pubmed.ncbi.nlm.nih.gov/35952419/）。逐字原文，未改写、未压缩。*

## 中文摘要

> 大规模且标注良好的数据集是深度学习在医学图像分析中取得成功的关键因素。然而，组装如此大规模的标注非常困难，尤其是对于具有独特特性的组织病理学图像（例如千兆像素级的图像尺寸、多种癌症类型以及广泛的染色差异）。为缓解这一问题，自监督学习（self-supervised learning，SSL）可能是一个有前景的解决方案，它仅依赖无标注数据来生成有信息量的表征，并且即使在标注有限的情况下也能很好地泛化到各种下游任务。在本工作中，我们提出一种新的 SSL 策略，称为语义相关对比学习（semantically-relevant contrastive learning，SRCL），它通过比较实例之间的相关性来挖掘更多正样本对。与传统对比学习中来自同一实例的两个视图相比，我们的 SRCL 将具有相似视觉概念的多个正实例对齐，这增加了正样本的多样性，从而产生更有信息量的表征。我们采用一个混合模型（CTransPath）作为骨干，它通过整合卷积神经网络（CNN）与多尺度 Swin Transformer 架构而设计。CTransPath 在大量无标注组织病理学图像上进行预训练，可作为协同的局部—全局特征提取器，学习更适合组织病理学图像领域任务的通用特征表征。我们在五类下游任务（patch 检索、patch 分类、弱监督全切片图像分类、有丝分裂检测以及结肠直肠腺癌腺体分割）上考察了 SRCL 预训练的 CTransPath 的有效性，覆盖九个公开数据集。结果表明，我们基于 SRCL 的视觉表征不仅在各个数据集上取得了最先进的性能，而且比其他 SSL 方法与 ImageNet 预训练（包括监督与自监督方法）更鲁棒、更具可迁移性。我们的代码与预训练模型见 https://github.com/Xiyue-Wang/TransPath。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图说明

> 论文正文无框架总图，且未在 arXiv 或 PMC 提供开放全文。

*说明：本篇未插入框架图，原因是缺少可核验的公开原图；不使用任何替代图片或重绘示意。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

通用图像模型像只学过日常照片的翻译员；CTransPath 是专门学习病理图像语言的翻译员，把每个 patch 翻译成更有用的数字特征。

### 0.2 它为什么出现？

ImageNet 模型擅长猫狗和物体，不一定理解染色、细胞核、腺体和组织结构。下游 MIL 的上限常被 patch 编码器限制。

### 0.3 它到底怎么做？

1. 从 TCGA、PAIP 等病理切片中采样大量 patch。
2. 对同一 patch 制作不同增强视图。
3. 用对比学习让同一图像的不同视图靠近、不同图像分开。
4. 把训练好的 Swin Transformer 当作通用病理特征提取器。

### 0.4 先认清这些词

- **encoder**：把图像变成数字特征的模型。
- **对比学习**：通过比较“同一个”和“不同的”样本来学习表示。
- **Swin Transformer**：在局部窗口内计算注意力的视觉 Transformer。
- **冻结特征**：训练下游模型时不再修改 encoder。

### 0.5 输入和输出

输入是病理 patch；输出是可供 CLAM、SurvPath 等模型使用的 patch embedding。

### 0.6 最容易误解的地方

换 encoder 就可能明显改变结果，所以比较聚合器时必须固定同一套 patch、encoder 和数据划分。

**现在只记住一句话：CTransPath = 先训练一个懂病理 patch 的“翻译器”，再让其他模型使用它。**

## 1. 三分钟摘要与推荐理由

CTransPath 在大规模 TCGA 和 PAIP 病理 patch 上进行无监督对比学习，并使用改造后的 Swin Transformer 获得通用病理表征。它长期被 CLAM、SurvPath、MI-Zero 等项目作为特征编码器，是理解“encoder 选择如何左右 WSI 结果”的关键基线。

## 2. 问题及研究位置

ImageNet 特征未必编码染色、细胞和组织结构。CTransPath 通过病理域数据与对比学习建立专用 encoder，位于原始 WSI 预处理和任意 MIL/多模态聚合器之间。

## 3. 核心方法和数据流

```text
TCGA + PAIP WSIs → patch sampling/augmentation
改造 Swin Transformer + 对比学习 → CTransPath encoder
冻结提特征 / 线性分类 / 下游微调
```

## 4. 实验、数据集与指标

论文在多类病理分类任务上评估迁移能力。真正值得复现的是统一下游协议下的 encoder 对比：ImageNet、CTransPath、PathDino 或更新基础模型使用完全相同的 patch、划分和聚合器。

论文覆盖 patch retrieval、patch classification、弱监督 WSI classification、mitosis detection 和 gland segmentation 五类任务、九个公开数据集。仓库 README 当前描述的新预训练规模约1500万 patch；旧流程为每张 WSI 随机100张、约270万 patch，必须注明所用权重对应哪一代数据。

## 5. 代码仓库审计

- 评级：**B**；GPL-3.0 许可证。
- 公开 CTransPath 权重和特征提取脚本存在。
- README 明确要求安装仓库中的 `timm-0.5.4.tar`，普通新版 `timm` 可能导致结构/权重不匹配。
- 论文级预训练配置为 **32 张 V100 32GB**；不要把“可加载权重”误写成“容易从头复现”。

## 6. 环境、显存与数据

单卡可批量提取 patch 特征；全量预训练需要大规模多卡、TCGA 与 PAIP WSI、切块存储和稳定的数据吞吐。最好为 CTransPath 单独建立环境，避免修改版 `timm` 与现代模型冲突。

## 7. 建议复现路径

1. **最小测试**：按 README 安装仓库内 `timm`，下载权重，用 `get_features_CTransPath.py` 提取一个小数据集特征。
2. **标准实验**：运行 `ctrans_lincls.py` 做冻结特征线性分类。
3. **扩展实验**：在 DSMIL/DTFD/PANTHER 中统一替换 encoder，检查跨中心与染色扰动。

## 8. 代码阅读顺序

`README.md` → `ctran.py` → `get_features_CTransPath.py` → `ctrans_lincls.py` → `moco/builder.py` → `datasets/dataset.py` → `convert_to_deit.py`。

## 9. 可借鉴思想

- 把 encoder 作为独立研究变量，而不是默认预处理。
- 域内预训练收益必须和数据规模、模型结构及下游协议分开分析。
- 公开权重与特征提取接口对领域采用影响巨大。

## 10. 局限、风险与课题切入点

旧 `timm` 依赖降低工程可维护性；预训练数据与下游 TCGA 队列可能重叠。可研究可审计的预训练数据去重、跨扫描仪表征，以及轻量 encoder 何时胜过超大模型。

**关键复现实验：**固定 patch 坐标和 aggregator，只替换 encoder；同时做 frozen linear probe、MIL 和外部队列测试。若下游 TCGA cohort 与预训练 TCGA 重叠，应单独标记为“潜在预训练重叠”，不能作为严格外部泛化。

## 11. 前后关联

与 [PathDino](13-pathdino.md) 做轻量对比；在 [SurvPath](11-survpath.md) 中观察它如何成为多模态模型的视觉底座。

## 12. 链接

- [期刊 DOI](https://doi.org/10.1016/j.media.2022.102559)
- [官方代码与权重入口](https://github.com/Xiyue-Wang/TransPath)
