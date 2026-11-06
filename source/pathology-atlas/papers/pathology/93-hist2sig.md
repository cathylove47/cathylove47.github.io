# 93｜Hist2Sig：从 H&E 切片注意力回归全癌种突变签名暴露量

**论文**：Predicting Mutational Signature Exposures from H&E Whole Slide Images: A Pan-Cancer Feasibility Study，arXiv:2609.30985v1（q-bio.QM / cs.CV，2026-09-25）
**定位**：突变特征分析、全切片图像（WSI）、弱监督注意力 MIL、零膨胀负二项分布（ZINB）、可解释性归因
**精读核验**：依据 arXiv v1 摘要、正文方法与官方复现仓库 `flavio141/Hist2Sig-paper`（含 `Paper_reproducibility/`、`models/` 与 `checkpoints/`）整理（2026-11-06）；尚未进行本地训练复现。

## 原文摘要

> Mutational signatures reveal cancer-driving processes with clinical relevance: MMR-deficient tumors respond better to immunotherapy, HRD tumors are sensitive to PARP inhibitors, and POLE-mutant tumors often have high mutation burdens influencing treatment response. Yet signature profiling remains limited by the cost, complexity, and turnaround time of whole-genome sequencing (WGS) or whole-exome sequencing. Histopathology is widely available and cost-effective, and H&E morphology has been linked to MSI, HRD, POLE-related processes, and driver mutations. Whether histology can recover the broader landscape of mutational signature exposures in a pan-cancer setting remains unknown. Here we introduce Hist2Sig, a deep learning framework predicting mutational signature exposures directly from H&E whole slide images (WSIs). Evaluated on 7,063 patients across 29 TCGA cancer types and externally on 193 CPTAC cases, Hist2Sig accurately predicts single base substitution (SBS) signature exposures, showing high agreement with genomic truth. Feature attribution reveals morphological correlates of signature-associated genomic instability. Hist2Sig demonstrates that routine histology can capture the downstream phenotypic manifestations of mutational processes, paving the way for cost-effective signature profiling to inform personalized oncology.

*来源：arXiv:2609.30985v1；逐字原文，未改写、未压缩。*

## 中文摘要

> 突变签名（mutational signatures）揭示了具有临床意义的癌症驱动过程：错配修复缺陷（MMR-deficient）肿瘤对免疫治疗响应更佳，同源重组缺陷（HRD）肿瘤对 PARP 抑制剂敏感，而 POLE 突变肿瘤通常具有影响治疗响应的高突变负荷。然而，突变签名的图谱分析仍受限于全基因组测序（WGS）或全外显子测序的高成本、复杂性与周转时间。常规组织病理学普及且具成本效益，H&E 形态学此前已被证实与 MSI、HRD、POLE 相关生物过程以及驱动基因突变存在关联。但在全癌种背景下，病理切片能否还原更广泛的突变签名暴露景观仍然未知。本文提出 Hist2Sig，一个直接从 H&E 全切片图像（WSI）预测突变签名暴露量的深度学习框架。Hist2Sig 在横跨 29 种 TCGA 癌症类型的 7,063 名患者以及 193 例外部 CPTAC 病例上进行了评估，能够准确预测单碱基置换（SBS）签名暴露量，与基因组真值高度一致。特征归因揭示了与签名相关基因组不稳定性相对应的形态学特征。Hist2Sig 证实了常规组织学能够捕获突变过程的下游表型体现，为基于低成本病理图像指导个性化肿瘤学分析铺平了道路。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

传统的数字病理做基因组预测，大多停留在二分类（预测某个特定基因突变是否有、或者是否为 MSI-H）。但这忽略了肿瘤发生机制的连续性与异质性：在真实的基因组学中，COSMIC SBS 突变签名刻画的是烟草暴露、紫外线、APOBEC 酶活性或 DNA 错配修复等几十种不同致突变机理各自贡献了多少突变。

Hist2Sig 的核心贡献分三层：
1. **任务升维**：不是二分类，而是直接从一张 H&E 切片回归 30 维连续的 COSMIC SBS 突变签名暴露计数向量。
2. **适应过离散与零膨胀的统计损失**：突变签名的暴露量在多数切片上是高度稀疏的（很多 signature 为 0），而在激活时数值极大。框架采用零膨胀负二项分布（ZINB）对数似然损失，配合重构项与 Top-3 SoftRank 排序损失，解决了回归模型过平滑的问题。
3. **特征归因**：结合注意力权重与梯度敏感度，把高暴露量的预测反向映射回具体切片图块，直观展示哪些细胞异型性与该突变过程相关。

推荐理由：全癌种（29 种癌症）的大规模可行性验证，公开了完整的推理与重现脚本。局限在于各 signature 的可预测度差距较大（外源性暴露如吸烟容易预测，内源性随机过程难度很高）。

## 2. 问题及研究位置

**问题**：输入一张 40×/20× H&E WSI，输出该患者 30 维单碱基替换（SBS）突变签名的绝对或相对暴露量。

**研究位置**：
- **经典分类**：预测 MSI-H、HRD、BRAF 等二元状态（已有多篇成熟工作，如 MCAT、nnMIL）。
- **空间与表达回归**：从组织形态预测空转基因表达（如 STNet、MEATRD）。
- **本文位置**：把病理图像与癌症体细胞突变签名的多维连续全景连接起来，是首个针对 30 维 SBS 全癌种范围的可行性基准。

## 3. 核心方法和数据流

```text
WSI 输入 (40×/20× 切块)
  ↓
H-optimus-v1 基础模型特征提取 (每个图块得到 1536 维特征向量)
  ↓
Bag of Embeddings {h_1, ..., h_N}
  ↓
门控注意力池化 (Gated Attention Pooling)
  ↓
患者级表征 z_slide
  ↓
预测头输出：30 维 SBS 签名参数 (均值 μ_k, 分散度 θ_k, 零膨胀概率 π_k)
  ↓
复合损失：
  L = L_ZINB(y, μ, θ, π) + λ_rec · L_recon + λ_rank · L_SoftRank(Top-3)
```

关键设计：
- **切块编码器**：使用顶尖病理基础模型 H-optimus-v1，特征对微观核异型性与染色质粗细有极高敏感度。
- **ZINB 建模**：把突变计数建模为泊松—伽马混合（负二项），并叠加一个点质量在零处的逻辑分布，贴合突变签名的物理分布。
- **SoftRank 排序约束**：保证预测出的最主要优势突变机制（Top-3）与基因组真值顺序一致。

## 4. 论文证据与实验范围

- **数据集**：
  - 训练与内测：TCGA 29 种实体瘤，共 7,063 名患者。
  - 外测验证：CPTAC 多中心独立队列，共 193 例。
- **真值来源**：WGS / WES 体细胞变异经 SigProfilerExtractor 提取的 COSMIC SBS 暴露量。
- **关键表现**：
  - 在常见驱动签名（如 SBS1 衰老、SBS4 吸烟、SBS2/13 APOBEC）上取得显著的余弦相似度与 Spearman 相关性。
  - 在外测 CPTAC 队列上维持了跨中心一致性，但部分罕见 signature 的召回率有所衰减。

## 5. 复现与审计重点

- **官方仓库已核验**：`https://github.com/flavio141/Hist2Sig-paper`（MIT 协议），仓库结构包含 `Paper_reproducibility/`、`models/`、`checkpoints/`，公开了各癌种预训练权重与评估入口（核查日期 2026-11-06）。
- **数据准备开销**：TCGA/CPTAC 原始 WSI 体积庞大，若从头复现需先跑 H-optimus-v1 特征提取；作者在仓库提供了降采样/预提取特征的转换脚本。
- **损失超参敏感度**：ZINB 与 SoftRank 之间的权重比对收敛影响显著，复现时应严格遵循配置中的学习率与权重衰减。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（全景流程图）→ `§2 Results`（各癌种 SBS 相关性热图）→ `§4 Methods`（ZINB 目标与 SoftRank 定义）→ `Fig. 4`（图块级形态特征归因）→ 官方仓库中的 `evaluate.py` 示例。

## 7. 前后关联

- 与 [MCAT](../pathology/20-mcat.md) 对照：MCAT 是基因指导切片做生存预测（前向多模态输入），Hist2Sig 是从切片反推突变指纹（图像到基因组的反向映射）。
- 与 [MEATRD](../pathology/24-meatrd.md) 对照：两者都从 H&E 寻找分子层面的微观表型映射，但 MEATRD 关联空间转录组局部点位，Hist2Sig 关联全切片全基因组突变机制。

## 8. 链接

- [arXiv 摘要页](https://arxiv.org/abs/2609.30985)｜[PDF 原文](https://arxiv.org/pdf/2609.30985)
- 官方代码：[flavio141/Hist2Sig-paper](https://github.com/flavio141/Hist2Sig-paper)
