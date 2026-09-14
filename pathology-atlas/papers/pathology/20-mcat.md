# 20｜MCAT：让基因通路主动查询病理区域

**论文**：Multimodal Co-Attention Transformer for Survival Prediction in Gigapixel Whole Slide Images，ICCV 2021  
**定位**：病理—组学早期融合、生存预测、基因引导共注意力  
**老师推荐线**：多模态生存预测经典方法

**精读核验**：ICCV 2021 正式论文与 Mahmood Lab 官方仓库已核验（2026-09-02）。

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

把六组基因当成六位提问者，每位都去问切片：“哪些区域和我有关？”得到六份图像摘要后，再共同判断患者风险。

### 0.2 它为什么出现？

直接拼接整张切片和基因向量太粗，无法表示某组基因与哪些组织区域共同关联生存。

### 0.3 它到底怎么做？

1. 把患者 WSI 变成大量 patch 特征。
2. 把基因按功能整理成若干组并编码。
3. 让每组基因作为 query，从 patch 中提取一个视觉概念。
4. 融合视觉概念和基因表示，预测离散时间生存风险。

### 0.4 先认清这些词

- **共注意力**：一个模态主动查询另一个模态。
- **query**：带着问题去寻找相关信息的向量。
- **离散时间风险**：把时间分段，估计每段发生事件的概率。
- **患者级划分**：同一患者的全部切片只能在一个数据集合中。

### 0.5 输入和输出

输入是患者 WSI、组学数据和生存结局；输出是患者风险和生存概率。

### 0.6 最容易误解的地方

基因 query 关注某区域只表示统计关联；报告性能前必须排除患者泄漏。

**现在只记住一句话：MCAT = 基因组主动从切片中提取与生存相关的视觉证据。**

## 1. 三分钟摘要与推荐理由

MCAT 把 6 组功能相关基因表示当作 query，对数万 WSI patch 特征做共注意力。这样既实现早期跨模态交互，又把超长 patch 序列压缩成少量“基因引导的视觉概念”，随后再用 Transformer 建模并预测离散时间生存风险。

论文覆盖 5 个 TCGA 癌种、4,730 张 WSI、约 6,700 万个 patch；相对当时的单模态和晚期融合方法报告 3.0%–6.87% 的提升。

## 2. 问题及研究位置

监督单位必须是患者：每位患者可有多张 WSI、一份组学向量和删失生存结局。任何 slide 级随机划分都会把同一患者泄漏到不同集合。

## 3. 核心方法和数据流

```text
WSI patches → patch features ┐
                             ├→ genomic-guided co-attention
6 类基因组 embedding ────────┘→ 6 个视觉概念
→ 两模态 Transformer → 融合 → 离散时间风险与生存函数
```

共注意力热图展示“某类基因 query 关注了哪些区域”，但它是模型内部权重，不自动构成基因—形态因果证据。

## 4. 实验、数据集与指标

五个 TCGA 队列为 BLCA、BRCA、GBMLGG、LUAD、UCEC；主要指标是 C-index，使用五折交叉验证。消融比较图像、组学、简单拼接和共注意力。

## 5. 官方代码仓库审计

- 评级：**A−**。MIT 许可证；数据表、折分、训练命令、模型、评估 notebook 与部分 checkpoint/结果齐全。
- 关键路径：`main.py`、`models/model_coattn.py`、`datasets/dataset_survival.py`、`utils/core_utils.py`、`docs/Commands.md`。
- Windows 检出仓库时会遇到超长结果路径，建议 Linux 或启用 long paths。

## 6. 环境、显存与数据

论文使用 4×GTX 2080 Ti。仓库依赖较旧，完整复现需 TCGA WSI、组学、临床结局与预提取 patch 特征；优先使用作者提供的 split 保持可比性。

## 7. 建议复现路径

1. **最小测试**：读取一个仓库 split 和预提取特征，完成单折前向与 C-index 计算。
2. **标准实验**：复现 BRCA 五折，保留每折患者列表、最佳 epoch 和风险分数。
3. **扩展实验**：用通路级而非重叠基因集合做 query，并验证跨癌种与缺失组学。

## 8. 建议代码阅读顺序

`docs/README.md` → `docs/Commands.md` → `datasets/dataset_survival.py` → `models/model_coattn.py` → `utils/core_utils.py` → `main.py` → `Evaluation.ipynb`。

## 9. 可借鉴思想

用低维生物先验查询高维视觉 bag；在融合同时压缩序列；把跨模态注意力组织成可视化假设。

## 10. 局限、风险与课题切入点

基因功能组存在重叠；TCGA 是回顾性队列；注意力解释缺少扰动与病理医生定位验证。可研究通路去冗余、外部生存校准和缺失模态鲁棒性。

## 11. 前后关联

MCAT 是 [SurvPath](11-survpath.md)、[PS3](26-ps3.md) 和 [DisPro](27-dispro.md) 的关键前置阅读。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/ICCV2021/html/Chen_Multimodal_Co-Attention_Transformer_for_Survival_Prediction_in_Gigapixel_Whole_Slide_ICCV_2021_paper.html)
- [官方代码](https://github.com/mahmoodlab/MCAT)
