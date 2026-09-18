# 11｜SurvPath：用生物通路 token 对齐形态与组学以预测生存

**论文**：Modeling Dense Multimodal Interactions Between Biological Pathways and Histology for Survival Prediction，CVPR 2024  
**定位**：病理—组学融合、生存预测、通路解释  
**建议投入**：先用仓库内 TCGA RNA 表和官方划分跑一个癌种，不要一开始复现全部五队列。

**精读核验**：CVPR 2024；论文示意配置含4,999个基因、331个 pathway tokens、256维 token，以及每例约7,000–100,000个 histology patch tokens（2026-09-01）。

## 原文摘要

> Integrating whole-slide images (WSIs) and bulk transcriptomics for predicting patient survival can improve our understanding of patient prognosis. However, this multimodal task is particularly challenging due to the different nature of these data: WSIs represent a very high-dimensional spatial description of a tumor, while bulk transcriptomics represent a global description of gene expression levels within that tumor. In this context, our work aims to address two key challenges: (1) how can we tokenize transcriptomics in a semantically meaningful and interpretable way?, and (2) how can we capture dense multimodal interactions between these two modalities? Specifically, we propose to learn biological pathway tokens from transcriptomics that can encode specific cellular functions. Together with histology patch tokens that encode the different morphological patterns in the WSI, we argue that they form appropriate reasoning units for downstream interpretability analyses. We propose fusing both modalities using a memory-efficient multimodal Transformer that can model interactions between pathway and histology patch tokens. Our proposed model, SURVPATH, achieves state-of-the-art performance when evaluated against both unimodal and multimodal baselines on five datasets from The Cancer Genome Atlas. Our interpretability framework identifies key multimodal prognostic factors, and, as such, can provide valuable insights into the interaction between genotype and phenotype, enabling a deeper understanding of the underlying biological mechanisms at play. We make our code public at: https://github.com/ajv012/SurvPath.

*来源：arXiv:2304.06819（https://arxiv.org/abs/2304.06819）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![SurvPath 论文框架图](/papers/pathology/11-survpath-pipeline.png)

> **原文图注**：Fig. 2 : Block diagram of SurvPath . (1) We tokenize transcriptomics into biological pathway tokens that are semantically meaningful, interpretable, and end-to-end learnable. (2) We further tokenize the corresponding histology whole-slide image into patch tokens using an SSL pre-trained feature extractor. (3) We combine pathway and patch tokens using a memory-efficient multimodal Transformer used for survival outcome prediction.

*图源：https://arxiv.org/html/2304.06819v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

把成千上万个基因按功能分成几个“工作小组”，再让每个小组去询问切片里的组织区域，最后共同估计病人的风险。

### 0.2 它为什么出现？

直接把所有基因压成一个向量会丢掉通路结构，直接拼接图像与组学又很难看出两者如何交互。

### 0.3 它到底怎么做？

1. 把 WSI 变成许多组织 patch token。
2. 按生物通路把基因表达整理成 pathway token。
3. 让通路 token 与组织 token 通过注意力交换信息。
4. 融合这些交互结果，预测患者生存风险。

### 0.4 先认清这些词

- **生物通路**：一组共同完成某种生物功能的基因。
- **token**：模型处理的一个信息单元。
- **生存预测**：估计不同时间段发生事件的风险，需处理删失。
- **删失**：随访结束时尚未观察到事件，并不等于永远不会发生。

### 0.5 输入和输出

输入是患者的 WSI 特征、RNA 表达和生存记录；输出是患者风险分数或时间段风险。

### 0.6 最容易误解的地方

某通路对某区域的注意力高，只表示模型利用了这种关联，不证明该通路导致了该形态。

**现在只记住一句话：SurvPath = 让“基因通路小组”和“组织区域”对话后预测生存。**

## 1. 三分钟摘要与推荐理由

SurvPath 不把数千个基因粗暴压成一个向量，而是按生物通路构造 pathway tokens，再与 WSI patch tokens 通过内存友好的多模态 Transformer 进行密集交互。输出用于患者生存风险预测，并可追踪哪些形态区域与哪些通路共同关联预后。

它适合学习“怎样给组学找到合适的 token 粒度”，以及多模态解释不能只停留在模态权重。

## 2. 问题及研究位置

WSI 与 bulk transcriptomics 维度、粒度和噪声结构差异很大。简单拼接或单向注意力难以表达基因型—表型关系。SurvPath 通过通路化 token 与 cross-attention 建模病例内部的多模态交互。

## 3. 核心方法和数据流

```text
WSI → 256×256 patches → CTransPath features → histology tokens
RNA-seq → Reactome / Hallmark pathway grouping → pathway tokens
memory-efficient multimodal Transformer → patient representation → survival risk
```

## 4. 实验、数据集与指标

论文在 TCGA-BLCA、BRCA、COADREAD、HNSC、STAD 五个队列上比较单模态和多模态生存模型，采用患者级五折交叉验证与 C-index。解释分析连接通路与形态区域，但应视为关联证据而非因果结论。

仓库的 folds 以 TCGA Case ID 保存，明确保证同一 case 的 slides 不跨训练/验证，并按切片采集站点分层。这个协议比许多按 slide 随机切分的 MIL 仓库更可靠，应原样保留后再做方法比较。

## 5. 代码仓库审计

- 评级：**B**。模型、五折划分、RNA 表、通路组成、训练脚本和多个基线齐全。
- 根目录没有独立许可证文件；README 声明 GPLv3 且限非商业学术用途，使用时以仓库最新条款为准。
- 未见统一公开 checkpoint；重现依赖 TCGA WSI 特征和临床/组学匹配。
- 关键文件：`models/model_SurvPath.py`、`models/layers/cross_attention.py`、`datasets/dataset_survival.py`、`main.py`。

## 6. 环境、显存与数据

README 报告测试环境为 16 张 RTX 2080 Ti、CUDA 11.0，并给出旧版 Python/PyTorch 组合。这不表示每个单队列实验都必须 16 卡，但说明完整复现的工程成本较高。TCGA WSI 用 CLAM 流程预处理并以 CTransPath 编成 768 维特征。

## 7. 建议复现路径

1. **最小测试**：检查 `splits/5foldcv/tcga_brca/` 与 `datasets_csv/` 的病例交集和删失字段。
2. **标准实验**：运行 `scripts/survpath.sh` 对一个队列做五折交叉验证，同时运行 WSI-only 与 omics-only 基线。
3. **扩展实验**：模拟组学缺失、批次偏移与外部中心，比较 late fusion、cross-attention 和通路 token。

## 8. 代码阅读顺序

`README.md` → `scripts/survpath.sh` → `datasets/dataset_survival.py` → `models/model_SurvPath.py` → `models/layers/cross_attention.py` → `utils/loss_func.py` → `main.py` → 其他基线模型。

## 9. 可借鉴思想

- 先用领域知识把高维组学变成有意义的 token。
- 多模态模型必须与每个单模态基线比较。
- 预先固化患者级划分，避免 WSI、组学和临床表错位。

## 10. 局限、风险与课题切入点

通路数据库并非完备真值，bulk RNA 也不提供空间定位；解释结果可能受队列偏差影响。可研究空间组学对齐、缺失模态鲁棒性、跨数据库通路一致性和因果干预验证。

**关键复现实验：**除 SurvPath 外必须同时运行 histology-only、omics-only 和简单 late-fusion；再做 pathway label permutation 与缺失模态测试。只有当密集交互稳定优于这些基线，才能把收益归因于跨模态关系建模。

## 11. 前后关联

与 [TANGLE](10-tangle.md) 比较“训练时组学监督、部署时图像单模态”和“预测时保留双模态”；与 [IIHGC](02-iihgc.md) 比较患者内与患者间关系。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Jaume_Modeling_Dense_Multimodal_Interactions_Between_Biological_Pathways_and_Histology_for_CVPR_2024_paper.html)
- [官方代码](https://github.com/mahmoodlab/SurvPath)
- [GDC](https://portal.gdc.cancer.gov/)
