# 10｜TANGLE：让转录组成为 slide 表征学习的监督信号

**论文**：Transcriptomics-Guided Slide Representation Learning in Computational Pathology，CVPR 2024  
**定位**：WSI—转录组对比学习、slide embedding、少样本迁移  
**建议投入**：使用仓库提供的 TCGA-BRCA 处理后特征和 checkpoint 跑通闭环。

**精读核验**：CVPR 2024；论文的三个独立测试集合分别包含1,265张乳腺 WSI、1,946张肺 WSI 和4,584张肝脏 WSI，重点证据来自 few-shot transfer 而非只看预训练损失（2026-09-01）。

## 原文摘要

> Self-supervised learning (SSL) has been successful in building patch embeddings of small histology images (e.g., 224x224 pixels), but scaling these models to learn slide embeddings from the entirety of giga-pixel whole-slide images (WSIs) remains challenging. Here, we leverage complementary information from gene expression profiles to guide slide representation learning using multimodal pre-training. Expression profiles constitute highly detailed molecular descriptions of a tissue that we hypothesize offer a strong task-agnostic training signal for learning slide embeddings. Our slide and expression (S+E) pre-training strategy, called Tangle, employs modality-specific encoders, the outputs of which are aligned via contrastive learning. Tangle was pre-trained on samples from three different organs: liver (n=6,597 S+E pairs), breast (n=1,020), and lung (n=1,012) from two different species (Homo sapiens and Rattus norvegicus). Across three independent test datasets consisting of 1,265 breast WSIs, 1,946 lung WSIs, and 4,584 liver WSIs, Tangle shows significantly better few-shot performance compared to supervised and SSL baselines. When assessed using prototype-based classification and slide retrieval, Tangle also shows a substantial performance improvement over all baselines. Code available at https://github.com/mahmoodlab/TANGLE.

*来源：arXiv:2405.11618（https://arxiv.org/abs/2405.11618）。逐字原文，未改写、未压缩。*

## 中文摘要

> 自监督学习（SSL）在构建小型组织学图像（例如 224x224 像素）的 patch 嵌入方面已取得成功，但将这些模型扩展到从千兆像素全切片图像（WSIs）的整体中学习切片嵌入，仍然充满挑战。在此，我们利用基因表达谱提供的互补信息，通过多模态预训练来引导切片表示学习。表达谱构成了对组织的极为详细的分子描述，我们假设它们为学习切片嵌入提供了强大的任务无关训练信号。我们称之为 Tangle 的切片与表达（S+E）预训练策略，采用模态专属的编码器，其输出通过对比学习进行对齐。Tangle 在来自三种不同器官的样本上进行了预训练：肝脏（n=6,597 个 S+E 配对）、乳腺（n=1,020）和肺（n=1,012），来自两个不同物种（Homo sapiens 与 Rattus norvegicus）。在由 1,265 张乳腺 WSI、1,946 张肺 WSI 和 4,584 张肝脏 WSI 组成的三个独立测试数据集上，与监督和 SSL 基线相比，Tangle 展现出显著更好的少样本性能。在使用基于原型的分类和切片检索进行评估时，Tangle 相较所有基线也表现出大幅的性能提升。代码可在 https://github.com/mahmoodlab/TANGLE 获取。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![TANGLE 论文框架图](/papers/pathology/10-tangle-pipeline.png)

> **原文图注**：Figure 2 : Overview of Tangle for (S+E) pre-training . An input histology slide is tessellated into patches and encoded using a pre-trained vision encoder. The resulting patch embeddings are passed to an ABMIL module to derive a slide embedding. The corresponding gene expression data are encoded using an MLP. A symmetric contrastive objective ℒ s ​ y ​ m ​ C ​ L \mathcal{L}_{symCL} learns to align embeddings from both modalities. During inference, a query slide is encoded into a slide embedding by the trained pooling module to be used for downstream tasks.

*图源：https://arxiv.org/html/2405.11618v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

同一个病人有两份作业：一张病理图和一份基因表达表。TANGLE 让两个翻译器学会把这两份作业翻译成相近的意思。

### 0.2 它为什么出现？

只靠裁剪、旋转等图像增强做自监督，未必抓住与疾病真正相关的生物学信息；转录组提供了另一种病例级监督。

### 0.3 它到底怎么做？

1. 把 WSI patch 汇总成一个切片向量。
2. 把同一病例的 RNA 表达编码成另一个向量。
3. 让配对病例的图像向量和 RNA 向量靠近，让不配对病例分开。
4. 训练结束后只保留图像分支，用于新切片任务。

### 0.4 先认清这些词

- **转录组**：一个样本中大量基因表达水平的集合。
- **跨模态**：同时处理图像、文字、组学等不同类型信息。
- **对齐**：让同一病例的不同模态在数字空间中靠近。
- **线性探针**：冻结 encoder，只训练一个简单分类头来测表示质量。

### 0.5 输入和输出

训练输入是配对的 WSI 与 bulk RNA-seq；部署输入可以只有 WSI；输出是 slide embedding 或下游预测。

### 0.6 最容易误解的地方

RNA 是整块组织的平均测量，不告诉模型某个具体 patch 的基因表达；对齐也不证明因果关系。

**现在只记住一句话：TANGLE = 用同一病人的基因表达教切片表示学到生物学语义。**

## 1. 三分钟摘要与推荐理由

TANGLE 把同一病例的 WSI 和基因表达视为两种互补视图：图像保留空间形态，转录组描述分子状态。两个模态分别编码后，通过对称对比目标对齐。训练完成后，只保留 slide encoder，即可做少样本分类、原型分类或检索。

## 2. 问题及研究位置

WSI 自监督中的“正样本视图”通常来自裁剪或遮挡，但整张切片异质性很大，增强未必保留同一语义。TANGLE 用真实分子测量提供更强的病例级对齐信号。

## 3. 核心方法和数据流

```text
WSI patch features → slide encoder → slide embedding
RNA-seq profile → expression encoder → expression embedding
成对样本对比学习 → 对齐空间
冻结 slide encoder → linear probe / prototype / retrieval
```

## 4. 实验、数据集与指标

论文覆盖 TCGA 的乳腺/肺癌以及 TG-GATES 大鼠肝脏数据，检查少样本分类、原型分类和检索。仓库提供 TCGA-BRCA 到 BCNB 下游评价的简化闭环，并新增 pan-cancer TANGLEv2 资源。

## 5. 代码仓库审计

- 评级：**A-**。训练、checkpoint 提取、线性探测、处理后特征和脚本齐全。
- 许可证为 CC BY-NC-ND 4.0，修改与再分发受限。
- README 明确区分论文原始的 CTransPath/ResNet50 特征和示例中更新的 UNI 特征。
- 关键文件：`train_tangle.py`、`core/models/mmssl.py`、`core/loss/tangle_loss.py`、`run_linear_probing.py`。

## 6. 环境、显存与数据

仓库提供 `requirements.txt`。使用公开预提取 UNI 特征和表达 `.pt` 文件可单卡训练；从原始 WSI 与 RNA-seq 全流程重建需要较大存储、多卡和严格患者映射。

## 7. 建议复现路径

1. **最小测试**：下载仓库 Drive 中的 TCGA-BRCA patch embeddings 与 expression features，核对病例 ID 交集。
2. **标准实验**：运行 `train_tangle.py`，提取 slide embedding，再运行 `run_linear_probing.py`。
3. **扩展实验**：加入缺失组学、批次效应和跨癌种留一验证；不要只随机划分。

## 8. 代码阅读顺序

`README.md` → `core/dataset/dataset.py` → `core/models/abmil.py` → `core/models/mmssl.py` → `core/loss/tangle_loss.py` → `train_tangle.py` → `extract_slide_embeddings_from_checkpoint.py` → `run_linear_probing.py`。

## 9. 可借鉴思想

- 用临床相关的互补模态定义自监督信号。
- 训练时使用组学，部署时可以只保留图像 encoder。
- slide embedding 应通过少样本、检索和跨任务评价，而非单一分类。

## 10. 局限、风险与课题切入点

bulk RNA-seq 混合了不同细胞群，且与切片空间区域未精确对应；缺失组学和批次效应也会影响对齐。可研究空间转录组引导的局部对齐、缺失模态蒸馏和生物通路级对比目标。

**配对警告：**同一患者可能有多张 WSI，但只有一份 bulk expression；这并不自动产生多个独立图文对。训练和划分必须按患者完成，并明确多张 slide 如何聚合或采样，否则会重复计算同一分子标签并造成病例权重失衡。

## 11. 前后关联

下一步读 [SurvPath](11-survpath.md)：TANGLE 用组学训练通用图像表示，SurvPath 在预测时同时使用两种模态。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Jaume_Transcriptomics-Guided_Slide_Representation_Learning_in_Computational_Pathology_CVPR_2024_paper.html)
- [官方代码](https://github.com/mahmoodlab/TANGLE)
