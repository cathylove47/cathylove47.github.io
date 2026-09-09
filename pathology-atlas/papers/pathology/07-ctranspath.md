# 07｜CTransPath：病理 patch encoder 的经典开源基线

**论文**：Transformer-based Unsupervised Contrastive Learning for Histopathological Image Classification，Medical Image Analysis 2022  
**定位**：病理自监督预训练、Swin Transformer、patch 表征  
**建议投入**：优先学会正确加载公开权重并批量提特征；从头预训练只适合有明确研究问题时做。

**精读核验**：Medical Image Analysis 81 (2022), Article 102559；CTransPath 将 CNN 的局部归纳偏置与多尺度 Swin Transformer 结合，并采用语义相关对比学习（Semantically-Relevant Contrastive Learning, SRCL）（2026-09-01）。

## 1. 三分钟摘要与推荐理由

CTransPath 在大规模 TCGA 和 PAIP 病理 patch 上进行无监督对比学习，并使用改造后的 Swin Transformer 获得通用病理表征。它长期被 CLAM、SurvPath、MI-Zero 等项目作为特征编码器，是理解“encoder 选择如何左右 WSI 结果”的关键基线。

## 2. 问题及研究位置

ImageNet 特征未必编码染色、细胞和组织结构。CTransPath 通过病理域数据与对比学习建立专用 encoder，位于原始 WSI 预处理和任意 MIL/多模态聚合器之间。

## 3. 核心方法和数据流

```text
TCGA + PAIP WSIs → patch sampling/augmentation
改造 Swin Transformer + 对比学习 → CTransPath encoder
冻结提特征 / 线性分类 / 下游微调
```

## 4. 实验、数据集与指标

论文在多类病理分类任务上评估迁移能力。真正值得复现的是统一下游协议下的 encoder 对比：ImageNet、CTransPath、PathDino 或更新基础模型使用完全相同的 patch、划分和聚合器。

论文覆盖 patch retrieval、patch classification、弱监督 WSI classification、mitosis detection 和 gland segmentation 五类任务、九个公开数据集。仓库 README 当前描述的新预训练规模约1500万 patch；旧流程为每张 WSI 随机100张、约270万 patch，必须注明所用权重对应哪一代数据。

## 5. 代码仓库审计

- 评级：**B**；GPL-3.0 许可证。
- 公开 CTransPath 权重和特征提取脚本存在。
- README 明确要求安装仓库中的 `timm-0.5.4.tar`，普通新版 `timm` 可能导致结构/权重不匹配。
- 论文级预训练配置为 **32 张 V100 32GB**；不要把“可加载权重”误写成“容易从头复现”。

## 6. 环境、显存与数据

单卡可批量提取 patch 特征；全量预训练需要大规模多卡、TCGA 与 PAIP WSI、切块存储和稳定的数据吞吐。最好为 CTransPath 单独建立环境，避免修改版 `timm` 与现代模型冲突。

## 7. 建议复现路径

1. **最小测试**：按 README 安装仓库内 `timm`，下载权重，用 `get_features_CTransPath.py` 提取一个小数据集特征。
2. **标准实验**：运行 `ctrans_lincls.py` 做冻结特征线性分类。
3. **扩展实验**：在 DSMIL/DTFD/PANTHER 中统一替换 encoder，检查跨中心与染色扰动。

## 8. 代码阅读顺序

`README.md` → `ctran.py` → `get_features_CTransPath.py` → `ctrans_lincls.py` → `moco/builder.py` → `datasets/dataset.py` → `convert_to_deit.py`。

## 9. 可借鉴思想

- 把 encoder 作为独立研究变量，而不是默认预处理。
- 域内预训练收益必须和数据规模、模型结构及下游协议分开分析。
- 公开权重与特征提取接口对领域采用影响巨大。

## 10. 局限、风险与课题切入点

旧 `timm` 依赖降低工程可维护性；预训练数据与下游 TCGA 队列可能重叠。可研究可审计的预训练数据去重、跨扫描仪表征，以及轻量 encoder 何时胜过超大模型。

**关键复现实验：**固定 patch 坐标和 aggregator，只替换 encoder；同时做 frozen linear probe、MIL 和外部队列测试。若下游 TCGA cohort 与预训练 TCGA 重叠，应单独标记为“潜在预训练重叠”，不能作为严格外部泛化。

## 11. 前后关联

与 [PathDino](13-pathdino.md) 做轻量对比；在 [SurvPath](11-survpath.md) 中观察它如何成为多模态模型的视觉底座。

## 12. 链接

- [期刊 DOI](https://doi.org/10.1016/j.media.2022.102559)
- [官方代码与权重入口](https://github.com/Xiyue-Wang/TransPath)
