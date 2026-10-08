# 17｜HESCAPE：空间转录组跨模态学习该怎样公平比较

**论文**：A Large-Scale Benchmark of Cross-Modal Learning for Histology and Gene Expression in Spatial Transcriptomics，ICCVW 2025  
**定位**：空间转录组、图像—基因对齐、批次效应、benchmark  
**老师推荐线**：空间组学方法学基准

**精读核验**：论文为 ICCV 2025 workshop 论文并有 arXiv 版本；官方仓库、数据入口和训练配置已核验（2026-09-02）。

## 原文摘要

> Spatial transcriptomics enables simultaneous measurement of gene expression and tissue morphology, offering unprecedented insights into cellular organization and disease mechanisms. However, the field lacks comprehensive benchmarks for evaluating multimodal learning methods that leverage both histology images and gene expression data. Here, we present HESCAPE, a large-scale benchmark for cross-modal contrastive pretraining in spatial transcriptomics, built on a curated pan-organ dataset spanning 6 different gene panels and 54 donors. We systematically evaluated state-of-the-art image and gene expression encoders across multiple pretraining strategies and assessed their effectiveness on two downstream tasks: gene mutation classification and gene expression prediction. Our benchmark demonstrates that gene expression encoders are the primary determinant of strong representational alignment, and that gene models pretrained on spatial transcriptomics data outperform both those trained without spatial data and simple baseline approaches. However, downstream task evaluation reveals a striking contradiction: while contrastive pretraining consistently improves gene mutation classification performance, it degrades direct gene expression prediction compared to baseline encoders trained without cross-modal objectives. We identify batch effects as a key factor that interferes with effective cross-modal alignment. Our findings highlight the critical need for batch-robust multimodal learning approaches in spatial transcriptomics. To accelerate progress in this direction, we release HESCAPE, providing standardized datasets, evaluation protocols, and benchmarking tools for the community

*来源：arXiv:2508.01490（https://arxiv.org/abs/2508.01490）。逐字原文，未改写、未压缩。*

## 中文摘要

> 空间转录组能够同时测量基因表达与组织形态，为细胞组织结构和疾病机制提供了前所未有的洞见。然而，该领域缺乏全面的基准，用于评估同时利用组织学图像与基因表达数据的多模态学习方法。在此，我们提出 HESCAPE，一个面向空间转录组跨模态对比预训练的大规模基准，它构建在一个经过整理的跨器官数据集之上，涵盖 6 种不同的基因 panel 与 54 名供体。我们系统地评估了当前最佳的图像与基因表达 encoder 在多种预训练策略下的表现，并考察了它们在两个下游任务上的有效性：基因突变分类与基因表达预测。我们的基准表明，基因表达 encoder 是强表示对齐的首要决定因素，并且，在空间转录组数据上预训练的基因模型优于未使用空间数据训练的模型以及简单的基线方法。然而，下游任务评估揭示出一个显著矛盾：尽管对比预训练持续改善基因突变分类性能，但相较于未使用跨模态目标训练的基线 encoder，它会降低直接基因表达预测的表现。我们将批次效应认定为干扰有效跨模态对齐的关键因素。我们的发现凸显了空间转录组中对批次鲁棒的多模态学习方法的迫切需求。为推动这一方向的进展，我们发布 HESCAPE，为社区提供标准化的数据集、评估协议与基准测试工具。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![HESCAPE 论文框架图](/papers/pathology/17-hescape-pipeline.jpg)

> **原文图注**：Figure 1 : HESCAPE Benchmark: 4 gene expression encoders and 5 image encoders for digital pathology have been fine-tuned with contrastive pretraining, and evaluated in downstream tasks.

*图源：https://arxiv.org/html/2508.01490v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

HESCAPE 更像一套统一考试规则，而不是一个新学生。它把不同图像模型、基因模型和训练方法放到同一张试卷上比较。

### 0.2 它为什么出现？

空间转录组论文使用的数据、划分和 encoder 各不相同，结果难以公平比较；随机按 spot 划分还可能让同一供体信息泄漏。

### 0.3 它到底怎么做？

1. 为每个空间 spot 配对局部 H&E 图像和基因表达。
2. 更换不同图像 encoder 和基因 encoder。
3. 用 CLIP 或 SigLIP 目标对齐两种模态。
4. 统一评价检索、突变分类和基因表达预测。

### 0.4 先认清这些词

- **spot**：空间转录组测量的一个小区域，不一定是单细胞。
- **benchmark**：固定数据与规则的公平比较平台。
- **跨模态检索**：用图找匹配基因，或用基因找匹配图。
- **批次效应**：由医院、实验流程或设备带来的非生物差异。

### 0.5 输入和输出

输入是成对的 spot 图像与基因表达；输出是对齐表示和多个统一下游指标。

### 0.6 最容易误解的地方

检索变好不保证基因预测也变好；不同目标可能需要不同表示。

**现在只记住一句话：HESCAPE = 给“图像—基因对齐”建立公平考场，并揭示对齐好不等于所有任务都好。**

## 1. 三分钟摘要与推荐理由

HESCAPE 的价值不在提出又一个融合模型，而在系统回答：图像 encoder、基因 encoder、冻结/微调策略和 CLIP/SigLIP 目标，究竟谁决定跨模态对齐效果？基准覆盖 6 种基因 panel、54 名供体，并比较跨模态检索、突变分类与基因表达预测。

最重要的负结果是：跨模态预训练改善突变分类，却常让直接基因表达预测变差。作者把矛头指向批次效应，提醒我们“embedding 对齐得好”不等于“所有下游任务都更好”。

## 2. 问题及研究位置

分析单位是空间转录组 spot；每个 spot 配对局部 H&E patch 和基因表达向量。核心风险是同一供体或同一组织切片中的 spot 高度相关，若随机按 spot 划分会产生严重泄漏。

## 3. 核心方法和数据流

```text
H&E spot patch → 图像 encoder ┐
                              ├→ CLIP / SigLIP 对齐 → 检索
基因表达向量 → 基因 encoder ┘                     → 突变分类 / 表达预测
```

图像分支比较 H0-mini、GigaPath、CTransPath、UNI、CONCH；基因分支比较 MLP、scFoundation、Nicheformer、DRVI。论文发现基因 encoder 对对齐质量的影响更大。

## 4. 实验、数据集与指标

数据跨 10x Xenium 的多种 panel；表达预测使用 224×224、约 112 µm×112 µm 的 20× patch，预测 50 个高变基因。主要指标包括 image-to-gene / gene-to-image Recall@5、突变分类和表达预测相关性。

## 5. 官方代码仓库审计

- 评级：**A−**。MIT 许可证；`pyproject.toml`、测试、文档、Hydra 配置与结果汇总齐全。
- 关键文件：`src/hescape/models/clip.py`、`image_encoder.py`、`gexp_encoder.py`、`modules/pretrain_module.py`、`experiments/hescape_pretrain/train.py`。
- 仓库提供约 60 秒的单 GPU smoke test；完整数据通过 Hugging Face 数据集获取。

## 6. 环境、显存与数据

仓库推荐 Python 3.11 与 `uv`，同时支持 conda/pip。完整微调组合较多，论文也出现 OOM；最小复现应先限制步数和 batch，再复现单一 panel。

## 7. 建议复现路径

1. **最小测试**：加载一个 human-lung-healthy panel，跑 200 step 单卡训练。
2. **标准实验**：固定供体级划分，复现一个 panel 的双向 Recall@5 与表达预测。
3. **扩展实验**：把批次标签显式加入域不变或分层采样，检验检索提升是否还能保留表达预测能力。

## 8. 建议代码阅读顺序

`README.md` → `data/` → `src/hescape/data_modules/` → `models/gexp_models/` → `models/image_models/` → `models/clip.py` → `experiments/hescape_pretrain/train.py`。

## 9. 可借鉴思想

把“表示对齐”和“任务效用”分开评价；报告负结果；把基因 encoder 与 batch robustness 当作主要变量。

## 10. 局限、风险与课题切入点

54 名供体对大模型仍有限；panel 间基因集合不同；目标基因与突变之间的关系不总能直接观测。可研究供体外泛化、跨 panel 缺失基因映射和 batch-aware 对比学习。

## 11. 前后关联

与 [TANGLE](10-tangle.md) 都做图像—表达对齐；HESCAPE 更适合用来检验 TANGLE 类方法在 spot 级任务上是否真的泛化。

## 12. 链接

- [arXiv](https://arxiv.org/abs/2508.01490)
- [官方代码与数据说明](https://github.com/peng-lab/hescape)
