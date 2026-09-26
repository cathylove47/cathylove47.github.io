# HE2RNA：从 H&E 预测转录组的起点

## 原文摘要

> Deep learning methods for digital pathology analysis are an effective way to address multiple clinical questions, from diagnosis to prediction of treatment outcomes. These methods have also been used to predict gene mutations from pathology images, but no comprehensive evaluation of their potential for extracting molecular features from histology slides has yet been performed. We show that HE2RNA, a model based on the integration of multiple data modes, can be trained to systematically predict RNA-Seq profiles from whole-slide images alone, without expert annotation. Through its interpretable design, HE2RNA provides virtual spatialization of gene expression, as validated by CD3- and CD20-staining on an independent dataset. The transcriptomic representation learned by HE2RNA can also be transferred on other datasets, even of small size, to increase prediction performance for specific molecular phenotypes. We illustrate the use of this approach in clinical diagnosis purposes such as the identification of tumors with microsatellite instability.

*来源：PMC PMC7400514（https://europepmc.org/articles/PMC7400514）。逐字原文，未改写、未压缩。*

## 中文摘要

> 用于数字病理学分析的深度学习方法是应对多种临床问题的有效途径，从诊断到治疗结局预测。这些方法也已被用于从病理图像预测基因突变，但迄今尚未对其从组织学切片中提取分子特征的潜力开展全面评估。我们表明，HE2RNA 这一基于多种数据模态整合的模型，可以被训练为仅凭整张切片图像、无需专家标注即可系统地预测 RNA-Seq 表达谱。凭借其可解释的设计，HE2RNA 提供了基因表达的虚拟空间化，这点已由独立数据集上的 CD3 与 CD20 染色验证。HE2RNA 学到的转录组表征还可以迁移到其他数据集上，即便是小规模数据集，以提升特定分子表型的预测性能。我们展示了该方法在临床诊断用途上的应用，例如识别具有微卫星不稳定性的肿瘤。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图说明

> 论文没有单张 pipeline 总图：方法分散在正文与 Extended Data 中，PMC/arXiv 均无对应整体框架图。

*说明：本篇未插入框架图，原因是缺少可核验的公开原图；不使用任何替代图片或重绘示意。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

像根据农田照片猜土壤里哪些营养成分较多。HE2RNA 根据 H&E 外观预测整块肿瘤样本的基因表达。

### 0.2 它为什么出现？

RNA 测序昂贵且会消耗样本；研究者想知道组织形态中是否藏有可预测的分子信号。

### 0.3 它到底怎么做？

1. 把 WSI 切成 tile，并用预训练 CNN 提取特征。
2. 让共享网络为各 tile 预测基因表达信号。
3. 挑选和聚合最有证据的 tile。
4. 得到患者级 bulk RNA-seq 表达预测，并分析相关区域。

### 0.4 先认清这些词

- **RNA-seq**：测量大量基因表达水平的实验技术。
- **bulk**：把许多细胞混在一起得到的平均值。
- **top-k 聚合**：只汇总分数最高的若干实例。
- **表达预测**：根据图像估计基因读数，不是直接测量。

### 0.5 输入和输出

输入是 WSI；输出是患者级多个基因的预测表达。

### 0.6 最容易误解的地方

它预测的是 bulk 表达，不是真正的空间转录组地图；相关热图只能提示可能区域。

**现在只记住一句话：HE2RNA = 从 H&E 估计整块样本的基因表达，是“形态推分子”路线的起点。**

## 1. 三分钟摘要与推荐理由
HE2RNA 用配对的 TCGA WSI 与 bulk RNA-seq 学习从组织形态预测基因表达，是 Path2Space、HESCAPE、MEATRD 和 SpaCRD 所在“形态—表达”主线的早期锚点。

## 2. 论文解决的问题及其研究位置
RNA 测序昂贵且破坏样本。论文询问：整张 H&E 中是否存在足以预测部分转录组与局部生物信号的形态证据？

## 3. 核心方法和数据流
WSI 切块 → 预训练 CNN 特征 → 随机采样 tile/supertile → 共享网络预测 tile 级表达 → top-k 聚合为患者级基因表达。

## 4. 关键实验、数据集与指标
论文事实：使用 TCGA 28 个癌种、8,725 名患者的 H&E 与 RNA-seq，报告基因表达相关性，并用免疫/上皮标记验证部分空间化信号。

## 5. 官方代码仓库审计
仓库事实：`extract_tile_features*.py`、`supertile_preprocessing.py`、`model.py`、`main.py`、`spatialization.py` 和患者划分均公开，GPL-3.0；仓库已归档。复现评级 **B**。

## 6. 环境、显存、存储和数据准备要求
需要下载 TCGA WSI 与转录组并在患者层面对齐；大量切块和特征占主要存储。旧依赖可能需容器化或版本修补。

## 7. 建议复现路径
最小测试：一个配置完成数据加载与前向。标准实验：选择一个癌种和少量标记基因做五折患者级验证。扩展实验：与 Path2Space 在 bulk 与空间监督下比较异质性恢复能力。

## 8. 建议代码阅读顺序
`transcriptome_data.py` → `wsi_data.py` → `extract_tile_features_from_slides.py` → `supertile_preprocessing.py` → `model.py` → `main.py` → `spatialization.py`。

## 9. 值得借鉴的思想与可迁移组件
top-k 聚合允许少量局部区域解释患者级表达；先验证可预测基因，再讨论生物机制，比全转录组平均指标更可靠。

## 10. 局限、复现风险和博士课题切入点
bulk RNA 是患者级标签，不能给每个 tile 提供真实空间表达；TCGA 预处理与中心差异可能形成捷径；相关不等于可替代测序。

## 11. 与前后论文的关联
HE2RNA提供 bulk 弱监督起点；HESCAPE与 SpaCRD转向真实空间转录组配对，Path2Space进一步做空间表达与生物标志物推断。

## 12. 官方链接
[论文](https://www.nature.com/articles/s41467-020-17678-4) · [代码](https://github.com/owkin/HE2RNA_code)
