# 19｜Path2Space：从常规 H&E 推断空间基因表达

**论文**：AI-predicted Spatial Transcriptomics Unlocks Breast Cancer Biomarkers from Pathology，Cell 2026  
**定位**：虚拟空间转录组、乳腺癌微环境、疗效与生存标志物  
**老师推荐线**：空间组学临床转化

**精读核验**：Cell 189, 4225–4240，2026-07-09；正文与扩展方法共 42 页，DOI、数据和官方 companion 仓库已核验。

## 原文摘要

> SUMMARY Spatial transcriptomics (ST) assays are transforming our understanding of tumor heterogeneity, but their high cost limits their application in large-scale biomarker discovery. Here we present Path2Space , a deep-learning model that predicts spatial gene expression directly from histopathology slides. Trained on extensive breast cancer ST data, Path2Space robustly predicts the spatial expression of thousands of genes, outperforming 21 established methods. Charting the tumor microenvironment (TME) of 976 breast cancer TCGA tumors, it accurately infers cell-type abundances and identifies three spatially defined breast cancer subgroups with distinct survival outcomes. Notably, the derived low-cost spatial TME landscapes enable more accurate predictions of patient response to chemotherapy and trastuzumab compared to costly conventional bulk sequencing–based biomarkers. Path2Space thus offers a scalable, fast and cost-effective alternative to molecular assays. It opens avenues for large cohort treatment biomarker discovery and translationally relevant insights into tumor biology, with potential applicability across many cancer indications.

*来源：PMC:PMC13317733。逐字原文，未改写、未压缩。*

## 中文摘要

> 摘要 空间转录组（ST）检测正在改变我们对肿瘤异质性的理解，但其高昂成本限制了它们在大规模生物标志物发现中的应用。在此，我们提出 Path2Space，一个直接从组织病理切片预测空间基因表达的深度学习模型。Path2Space 在大量乳腺癌 ST 数据上训练，能够稳健地预测数千个基因的空间表达，优于 21 种已有方法。在绘制 976 例乳腺癌 TCGA 肿瘤的肿瘤微环境（TME）图谱时，它能够准确推断细胞类型丰度，并识别出三个具有不同生存结局的空间定义乳腺癌亚组。值得注意的是，相较于昂贵的、基于常规 bulk 测序的生物标志物，由此得到的低成本空间 TME 图谱能够更准确地预测患者对化疗与 trastuzumab 的反应。因此，Path2Space 为分子检测提供了一种可扩展、快速且具成本效益的替代方案。它为大队列治疗生物标志物发现，以及具有转化相关性的肿瘤生物学洞见开辟了道路，并有可能适用于多种癌症适应证。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图说明

> Cell 论文为订阅出版，作者未提供开放获取的框架图或 arXiv 版本；正文框架图需在机构订阅下查看。

*说明：本篇未插入框架图，原因是缺少可核验的公开原图；不使用任何替代图片或重绘示意。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

像根据城市照片猜哪里更热闹，Path2Space 根据 H&E 外观预测每个位置可能有哪些基因活跃，再把预测地图用于队列研究。

### 0.2 它为什么出现？

空间转录组能测“哪里表达什么基因”，但昂贵且样本少；普通 H&E 便宜且常见，却没有直接基因读数。

### 0.3 它到底怎么做？

1. 用配对 H&E 与空间转录组学习图像—表达关系。
2. 从 spot 周围图像提取 CTransPath 特征。
3. 用模型预测每个 spot 的多基因表达。
4. 把模型应用到更大的 H&E 队列，研究空间亚型、预后和疗效。

### 0.4 先认清这些词

- **空间转录组**：同时保留位置的基因表达测量。
- **bulk RNA-seq**：整块组织混合后的平均基因表达。
- **spot**：空间测序中的一个测量区域。
- **空间亚型**：根据预测或实测的空间模式对病例分组。

### 0.5 输入和输出

训练输入是配对 H&E 和 spot 表达；部署输入是 H&E；输出是预测的 spot×gene 空间表达矩阵。

### 0.6 最容易误解的地方

预测表达是模型估计，不是测量值，不能直接替代真实空间测序或用于未经验证的个体临床决策。

**现在只记住一句话：Path2Space = 从常规 H&E 估计空间基因地图，但“预测”绝不是“实测”。**

## 1. 三分钟摘要与推荐理由

Path2Space 用配对的 H&E—空间转录组训练模型，从常规病理图像预测数千个基因的 spot 级空间表达。作者随后将它应用到 976 例 TCGA 乳腺癌 WSI，构建空间亚型（SpatioTypes），并用推断出的空间标志物研究生存和治疗反应。

论文事实：模型在乳腺癌空间表达预测中比较 21 种既有方法；空间标志物在若干疗效任务上优于 bulk 测序指标。最强结论是“图像可恢复具有队列级研究价值的空间信号”，不是“预测表达可以替代真实空间测序”。

## 2. 问题及研究位置

分析单位是 Visium spot 对应的 H&E 局部区域，监督来自同一位置的基因表达。部署时输入变为只有 H&E 的大队列。空间平滑、组织保存方式和训练队列构成都会影响泛化。

## 3. 核心方法和数据流

```text
配对 H&E-ST → spot 周围 tile → 染色归一化 → CTransPath 特征
→ MLP ensemble → spot×gene 预测矩阵 → 空间平滑
→ 空间聚类 / SpatioType / 生存与疗效分析
```

论文在 4 个配对 H&E-ST 数据源上训练或评价，并分析 FF 与 FFPE 等保存条件。模型主体并不复杂，价值主要来自规模、严谨的下游生物学分析和独立队列。

## 4. 实验、数据集与指标

表达预测主要看基因级 Pearson 相关；多队列训练的中位 PCC 从单一 Bassiouni 队列的 0.42 小幅变为加入 HTAN 的 0.45。作者还验证主要细胞类型比例、空间亚型的预后差异，以及 TransNEO/IMPRESS 等队列中的治疗反应。

## 5. 官方代码仓库审计

- 评级：**A−（推理复现）/ B（完整研究复现）**。代码按非商业学术研究发布；完整资源同时存于 Zenodo。
- companion 仓库提供可独立运行的基因表达推理：`scripts/run_spots.py`、`run_grid.py`、`path2space/pipeline.py`、`model_mlp.py`、`smoothing.py` 与 smoke test。
- 当前 companion 明确是精简的 inference-only 版本；完整训练与全部细胞类型模型不能从该仓库单独重建。

## 6. 环境、显存与数据

论文事实：PyTorch 2.4.1，单张 RTX A5000，最多 200 epoch。原始 ST 与大队列 WSI 仍需要高 I/O、数百 GB 级空间和严格 spot 坐标配准。

## 7. 建议复现路径

1. **最小测试**：用 companion 的 spot 图像、CTransPath 权重和 MLP ensemble 跑一张预测矩阵。
2. **标准实验**：在一个公开 Visium 乳腺癌切片上复现基因相关与空间平滑消融。
3. **扩展实验**：跨平台、跨医院测试表达校准，并把预测不确定性带入下游 biomarker 分析。

## 8. 建议代码阅读顺序

`ge_model/README.md` → `path2space/tiler.py` → `features.py` → `model_mlp.py` → `ensemble.py` → `smoothing.py` → `pipeline.py` → `scripts/run_spots.py`。

## 9. 可借鉴思想

用昂贵的 ST 小队列训练、用常规 H&E 大队列发现空间标志物；把模型输出转化为可检验的空间亚型，而不止报告相关系数。

## 10. 局限、风险与课题切入点

Visium spot 混合多个细胞；预测表达受组织形态可见性上限限制；细粒度细胞类型与不同癌种尚未充分验证。空间平滑可能抬高邻域相关，必须单独报告无平滑结果。

## 11. 前后关联

先读 [HESCAPE](17-hescape.md) 理解 batch effect，再比较 [SpaCRD](25-spacrd.md) 的“图像+真实 ST 检测”与 Path2Space 的“从图像生成 ST”。

## 12. 链接

- [Cell 正式论文](https://doi.org/10.1016/j.cell.2026.04.023)
- [官方推理仓库](https://github.com/eldadshulman/path2space-companion)
- [Zenodo 代码](https://doi.org/10.5281/zenodo.14729336)
