# Prov-GigaPath：整张切片基础模型

## 1. 三分钟摘要与推荐理由
Prov-GigaPath 在 17 万余张真实世界 WSI、约 13 亿图块上进行 tile 级与 slide 级预训练，用 LongNet 处理超长序列，是理解 E2E-ViT、SlideChat 和 CPath-Omni“大规模 WSI 表征”假设的关键参照。

## 2. 论文解决的问题及其研究位置
许多基础模型只预训练 patch 编码器，下游仍需临时聚合。Prov-GigaPath同时学习局部 tile 与整张切片上下文。

## 3. 核心方法和数据流
WSI 切块 → DINOv2 tile encoder → tile token 序列 → LongNet 稀疏扩张注意力 slide encoder → MAE 式整图预训练 → 下游微调或图文对齐。

## 4. 关键实验、数据集与指标
论文事实：预训练使用 171,189 张切片、30,000 余名患者、31 种组织；在 26 个亚型与 pathomics 任务中 25 项达到当时最佳，并在 18 项显著领先第二名。

## 5. 官方代码仓库审计
仓库事实：提供 `environment.yaml`、模型实现、tiling 指南、demo、权重及 PCam/PANDA 示例；Apache-2.0，但模型用途说明限研究。复现评级 **A−**。

## 6. 环境、显存、存储和数据准备要求
仓库建议 A100；PANDA 预提取特征示例约 32GB。完整预训练规模不可作为普通实验目标，应优先复用权重。

## 7. 建议复现路径
最小测试：官方 demo 对示例切片生成 embedding。标准实验：用公开 PANDA 特征复现 slide-level 微调。扩展实验：与 E2E-ViT在相同患者划分比较冻结、局部微调和端到端训练。

## 8. 建议代码阅读顺序
预处理指南 → tile encoder → slide encoder/LongNet → 下游训练脚本 → demo 与模型卡。

## 9. 值得借鉴的思想与可迁移组件
基础模型评估应拆分“局部编码器质量”与“整图聚合能力”；公开权重能显著降低复现实验门槛。

## 10. 局限、复现风险和博士课题切入点
真实世界预训练数据仍来自单一医疗网络；完整训练难复现；模型规模、输入实例数与收益之间需要成本曲线。

## 11. 与前后论文的关联
HIPT先做层级自监督，Prov-GigaPath扩展到超大真实队列；E2E-ViT进一步挑战“必须预提取冻结特征”的两阶段范式。

## 12. 官方链接
[Nature 论文](https://www.nature.com/articles/s41586-024-07441-w) · [代码与权重](https://github.com/prov-gigapath/prov-gigapath)

