# HE2RNA：从 H&E 预测转录组的起点

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

