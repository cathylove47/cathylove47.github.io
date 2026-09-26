# GMMamba：分组建模超大病理切片

## 原文摘要

> Recent advances in selective state space models (Mamba) have shown great promise in whole slide image (WSI) classification. Despite this, WSIs contain explicit local redundancy (similar patches) and irrelevant regions (uninformative instances), posing significant challenges for Mamba-based multi-instance learning (MIL) methods in capturing global representations. Furthermore, bag-level approaches struggle to extract critical features from all instances, while group-level methods fail to adequately account for tumor dispersion and intrinsic correlations across groups, leading to suboptimal global representations. To address these issues, we propose group masking Mamba (GMMamba), a novel framework that combines two elaborate modules: (1) intra-group masking Mamba (IMM) for selective instance exploration within groups, and (2) cross-group super-feature sampling (CSS) to ameliorate long-range relation learning. Specifically, IMM adaptively predicts sparse masks to filter out features with low attention scores (i.e., uninformative patterns) during bidirectional Mamba modeling, facilitating the removal of instance redundancies for compact local representation. For improved bag prediction, the CSS module further aggregates sparse group representations into discriminative features, effectively grasping comprehensive dependencies among dispersed and sparse tumor regions inherent in large-scale WSIs. Extensive experiments on four datasets demonstrate that GMMamba outperforms the state-of-the-art ACMIL by 2.2% and 6.4% in accuracy on the TCGA-BRCA and TCGA-ESCA datasets, respectively.

*来源：论文页摘要。逐字原文，未改写、未压缩。*

## 中文摘要

> 选择性状态空间模型（Mamba）的近期进展在全切片图像（WSI）分类中展现出巨大前景。尽管如此，WSI 包含显式的局部冗余（相似 patch）与无关区域（无信息实例），这给基于 Mamba 的多实例学习（MIL）方法捕捉全局表征带来了重大挑战。此外，包级方法难以从所有实例中提取关键特征，而组级方法未能充分考虑肿瘤的分散性以及组间固有的相关性，导致全局表征次优。为解决这些问题，我们提出分组掩码 Mamba（GMMamba），一个新颖的框架，它结合两个精心设计的模块：(1) 组内掩码 Mamba（IMM），用于在组内进行选择性的实例探索；(2) 跨组超级特征采样（CSS），用以改善长程关系学习。具体而言，IMM 在双向 Mamba 建模过程中自适应地预测稀疏掩码，以过滤掉注意力分数低的特征（即无信息模式），从而有助于移除实例冗余以获得紧凑的局部表征。为改进包级预测，CSS 模块进一步将稀疏的组表征聚合为具有判别性的特征，有效把握大规模 WSI 中固有的、分散且稀疏的肿瘤区域之间的全面依赖关系。在四个数据集上的大量实验表明，GMMamba 在 TCGA-BRCA 与 TCGA-ESCA 数据集上的准确率分别比当前最先进的 ACMIL 高出 2.2% 与 6.4%。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![GMMamba 论文框架图](/papers/pathology/28-gmmamba-pipeline.png)

> **原文图注**：Figure 3 原图（论文框架图，从 ICCV 2025 官方 PDF 渲染提取）。

*图源：CVF 官方 PDF（ICCV 2025）。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

把一个超大班级分组，每组先交流并选出代表，再让组代表完成全班判断；同时暂时遮住一些低分发言，迫使模型利用更稳健的线索。

### 0.2 它为什么出现？

数万 patch 的全局 Transformer 太贵，普通池化又忽略组内和跨组关系。

### 0.3 它到底怎么做？

1. 把 WSI patch 特征划分成多个组。
2. 用双向 Mamba 建模每组内部的长序列关系。
3. 通过分组遮蔽减少对少数容易线索的依赖。
4. 抽取组级超级特征并汇总为切片分类。

### 0.4 先认清这些词

- **group masking**：按策略遮住部分实例或组，让模型学习替代证据。
- **Mamba**：线性复杂度的选择性状态空间序列模型。
- **超级特征**：一组 patch 压缩后的代表表示。
- **双向**：同时按正向和反向读取序列。

### 0.5 输入和输出

输入是 WSI 的 patch embedding；输出是切片类别。

### 0.6 最容易误解的地方

低注意力不等于无用，尤其是罕见病灶；遮蔽策略必须检查是否误删关键证据。

**现在只记住一句话：GMMamba = patch 分组、组内用 Mamba、组间用代表特征。**

## 1. 一句话结论

GMMamba 先把 WSI 实例分组，再用双向 Mamba 建模组内关系，并跨组抽取代表性“超级特征”；它以近线性序列建模降低长序列成本，但固定遮蔽低注意力实例可能同时删掉稀有而关键的病灶。

## 2. 研究问题

一张 WSI 可包含数千到数万 patch。Transformer 的全局注意力成本高，而单纯池化又容易忽视空间分布和跨区域关联。论文希望在可承受的显存与计算量下，同时捕捉局部组织群和远距离肿瘤证据。

## 3. 为什么难

- patch 序列极长，且阳性区域可能只占很小比例。
- 同一病灶可能分散在多个不相邻区域。
- 分组会提高效率，也可能切断组间联系。
- 注意力低不一定代表无用，尤其在训练早期或罕见亚型中。

## 4. 核心方法

方法先把实例划分为多个组。组内使用 IMM：按注意力遮蔽部分低权重实例，再交给双向 Mamba/状态空间模块提取上下文；组间使用 CSS，从不同组抽取代表性超级特征，以连接空间上分散的肿瘤区域。最后聚合为切片级分类结果。

## 5. 数据与实验设置

论文在 TCGA-BRCA（952 张切片）、TCGA-ESCA（156 张）、BRACS（547 张）和 TCGA-Lung（1053 张切片、956 名患者）上评估。不同数据集使用 10× 或 20× patch 特征与各自的训练/验证/测试划分。论文实验写明使用单张 RTX 4090；当前仓库说明给出 Ubuntu 18.04 与 RTX 3090 测试环境，两者应在复现记录中区分。

## 6. 主要结果

【论文事实】相对 ACMIL，论文报告在 BRCA 与 ESCA 上分别约有 2.2 和 6.4 个百分点提升；在 BRACS 与肺癌任务上的提升约为 3.9 和 1.0 个百分点。消融用于验证实例遮蔽与跨组采样的贡献。

【AI 解读】提升在小型 ESCA 队列上更明显，应同时关注划分波动；若没有患者级重复实验和置信区间，单次百分点差异不宜过度解读。

## 7. 关键术语

- **Mamba / 状态空间模型**：以近线性复杂度处理长序列的一类网络。
- **实例遮蔽**：训练时暂时去掉部分 patch 特征，促使模型利用更多上下文。
- **超级特征**：从一组实例汇总得到的代表性特征。
- **MIL**：只有切片标签、没有每个 patch 标签的学习范式。

## 8. 代码对应关系

官方仓库包含 `datasets/`、`models/`、`utils/` 以及 `main.py`、`train.py`，能定位数据读取、GMMamba 模型和训练入口。仓库提交较少、说明仍在完善，代码成熟度评为 **B−**：核心代码已公开，但环境、特征提取、完整命令与论文全部划分尚需进一步核对。

## 9. 可信度与风险

- TCGA 同一患者可能有多张切片，必须患者级去重与切分。
- 固定比例遮蔽低注意力实例可能过滤微小病灶或稀有亚型。
- 分组和 patch 顺序会影响状态空间模型，应报告随机种子稳定性。
- 论文与仓库的 GPU 环境描述不同，属于复现元数据差异，不直接影响科学结论。

## 10. 最小复现路径

先用公开预提取特征复现一个二分类队列，固定患者级划分并记录每张切片实例数。对比平均池化、注意力 MIL、单纯 Mamba 与完整 GMMamba；分别扫描分组数、遮蔽率和 CSS 采样数，报告准确率/AUC、显存、吞吐和多随机种子方差。

## 11. 延伸思考

可把固定遮蔽率替换为不确定性感知策略：对模型不确定但形态稀有的 patch 保留更高概率，并检查这些区域是否对应微小病灶、边界或少见组织结构。

## 12. 资料入口

- [CVF 论文页](https://openaccess.thecvf.com/content/ICCV2025/html/Zheng_GMMamba_Group_Masking_Mamba_for_Whole_Slide_Image_Classification_ICCV_2025_paper.html)
- [官方代码](https://github.com/titizheng/GMMamba)
