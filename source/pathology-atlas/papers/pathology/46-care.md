# 46｜CARE：用分子监督塑造自适应病理区域

**论文**：CARE: A Molecular-Guided Foundation Model with Adaptive Region Modeling for Whole Slide Image Analysis，CVPR 2026（arXiv:2602.21637）  
**定位**：病理基础模型、自适应 ROI、RNA/蛋白引导的 WSI 表征  
**精读核验**：依据 arXiv v3 的摘要、方法与版本记录整理（2026-09-22）；尚未进行复现实验。

## 原文摘要

> Foundation models have recently achieved impressive success in computational pathology, demonstrating strong generalization across diverse histopathology tasks. However, existing models overlook the heterogeneous and non-uniform organization of pathological regions of interest (ROIs) because they rely on natural image backbones not tailored for tissue morphology. Consequently, they often fail to capture the coherent tissue architecture beyond isolated patches, limiting interpretability and clinical relevance. To address these challenges, we present Cross-modal Adaptive Region Encoder (CARE), a foundation model for pathology that automatically partitions WSIs into several morphologically relevant regions. Specifically, CARE employs a two-stage pretraining strategy: (1) a self-supervised unimodal pretraining stage that learns morphological representations from 34,277 whole-slide images (WSIs) without segmentation annotations, and (2) a cross-modal alignment stage that leverages RNA and protein profiles to refine the construction and representation of adaptive regions. This molecular guidance enables CARE to identify biologically relevant patterns and generate irregular yet coherent tissue regions, selecting the most representative area as ROI. CARE supports a broad range of pathology-related tasks, using either the ROI feature or the slide-level feature obtained by aggregating adaptive regions. Based on only one-tenth of the pretraining data typically used by mainstream foundation models, CARE achieves superior average performance across 33 downstream benchmarks, including morphological classification, molecular prediction, and survival analysis, and outperforms other foundation model baselines overall.

*来源：arXiv:2602.21637；逐字原文，未改写、未压缩。*

## 中文摘要

> 基础模型近来在计算病理学中取得了令人瞩目的成功，在多样的组织病理学任务上展现出强大的泛化能力。然而，现有模型忽视了病理感兴趣区域（ROIs）的异质且非均匀的组织结构，因为它们依赖并非为组织形态量身定制的自然图像骨干网络。因此，它们往往无法捕捉孤立 patch 之外连贯的组织结构，限制了可解释性与临床相关性。为应对这些挑战，我们提出跨模态自适应区域编码器（Cross-modal Adaptive Region Encoder，CARE），一个用于病理学的基础模型，它能自动将 WSIs 划分为若干形态学上相关的区域。具体而言，CARE 采用两阶段预训练策略：（1）一个自监督单模态预训练阶段，从 34,277 张全切片图像（WSIs）中学习形态学表征，无需分割标注；（2）一个跨模态对齐阶段，利用 RNA 与蛋白谱来精炼自适应区域的构建与表征。这种分子引导使 CARE 能够识别具有生物学相关性的模式，并生成不规则但连贯的组织区域，从中选取最具代表性的区域作为 ROI。CARE 支持广泛的病理学相关任务，既可使用 ROI 特征，也可使用通过聚合自适应区域得到的切片级特征。仅基于主流基础模型通常所用预训练数据的十分之一，CARE 在 33 个下游基准上取得更优的平均性能，涵盖形态学分类、分子预测与生存分析，并且总体上优于其他基础模型基线。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

CARE 不把 WSI 固定切成规则网格后直接聚合，而是先把 patch 重组为形态连贯、边界不规则的自适应区域，再从区域层面得到 ROI 与整张切片表征。它先以无标注 WSI 做自监督预训练，再用配对 RNA 与蛋白表达做跨模态对齐，使区域划分同时受形态和分子信号约束。

它直接连接 HIPT、TANGLE、SurvPath 与 CPath-Omni：重点从“怎样聚合更多 patch”转向“怎样把 patch 组织成有临床语义的中间 token”。

## 2. 问题及研究位置

固定大小 patch 或规则 region 容易切断连续组织结构，也让 slide 聚合器必须在长序列上学习远距离关系。CARE 把建模粒度改为 patch → adaptive region → WSI，并把分子组学作为区域构建的训练信号，而非只在最终预测头做 late fusion。

## 3. 核心方法和数据流

```text
WSI → 组织分割与 20× patching → CONCH v1.5 patch features
    → 初始子区域内自注意力 / 查询聚合
    → Adaptive Region Generator：按空间邻近度与形态特征相似度重新分配 patch
    → Adaptive Region Self-Attention → adaptive-region tokens
    → 加权聚合（Semantic and Prior Fusion）→ WSI embedding

预训练阶段 1：iBOT 式 teacher–student 自监督，学习形态表征
预训练阶段 2：WSI embedding 先与 RNA、再与蛋白 embedding 做 InfoNCE 对齐
下游：ROI feature 或聚合后的 slide feature → 形态分类 / 分子预测 / 生存分析
```

ARG 只在每个 patch 的候选子区域中比较空间与特征关系；区域是可学习的中间表示，而不是人工分割标签。区域内 self-attention 与跨区域加权聚合分开，避免在全 WSI patch 序列上直接做全局注意力。

## 4. 论文证据与实验范围

- 摘要报告第一阶段使用 34,277 张无分割标注 WSI；下游覆盖 33 个 benchmark。
- arXiv 页面标注为 **Accepted to CVPR 2026**；优于其他基础模型的比较属于作者报告，复现时应按任务与数据划分逐项核验。
- 本次核验的 arXiv 页面没有列出可直接定位的官方代码仓库。

## 5. 复现与审计重点

- 固定 CONCH 特征、组织分割、patch 尺寸和患者级划分，再单独验证 adaptive-region 聚合。
- RNA/蛋白对齐只能在有配对组学时训练；纯 WSI 推理应报告组学缺失与跨中心泛化。
- 区域是否真对应可解释的组织单位，需要病理标注、病理报告或空间组学做独立验证。

## 6. 建议阅读顺序

`Abstract` → `Fig. 2` → `3.1 Preliminaries` → `3.2 Model Design` → `3.3 Model Pretraining Pipeline` → 33 个下游任务的 protocol 与 ablation。

## 7. 前后关联

- 与 [HIPT](04-hipt.md) 比较固定层级 region 与 CARE 的可学习不规则区域。
- 与 [TANGLE](10-tangle.md)、[SurvPath](11-survpath.md) 比较“组学指导预训练”和“组学参与下游跨模态预测”。
- 与 [MOOZY](47-moozy.md) 比较 region-first 与 patient-first 两种中间结构。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2602.21637)
- [arXiv HTML 正文](https://arxiv.org/html/2602.21637v3)
