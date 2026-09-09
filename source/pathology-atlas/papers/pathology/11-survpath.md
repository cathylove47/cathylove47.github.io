# 11｜SurvPath：用生物通路 token 对齐形态与组学以预测生存

**论文**：Modeling Dense Multimodal Interactions Between Biological Pathways and Histology for Survival Prediction，CVPR 2024  
**定位**：病理—组学融合、生存预测、通路解释  
**建议投入**：先用仓库内 TCGA RNA 表和官方划分跑一个癌种，不要一开始复现全部五队列。

**精读核验**：CVPR 2024；论文示意配置含4,999个基因、331个 pathway tokens、256维 token，以及每例约7,000–100,000个 histology patch tokens（2026-09-01）。

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
