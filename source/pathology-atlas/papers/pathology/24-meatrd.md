# 24｜MEATRD：用图像与空间转录组共同发现异常组织

**论文**：MEATRD: Multimodal Anomalous Tissue Region Detection Enhanced with Spatial Transcriptomics，AAAI 2025  
**定位**：异常区域检测、空间转录组、图双注意力、单类学习  
**老师推荐线**：空间组学区域发现

**精读核验**：AAAI 2025 论文、扩展 arXiv 与作者官方仓库已核验（2026-09-02）。

## 1. 三分钟摘要与推荐理由

MEATRD 面向“异常区域和正常区域形态很像”的情形，把每个 ST spot 当作图节点，同时使用该位置的 H&E patch 与基因表达。MGDAT 在节点之间、模态之间交换信息；模型只学习重建正常 spot，再结合重建偏差和 one-class 分类识别异常。

论文在 8 个乳腺癌 ST 数据集上 AUC 均排名第一、F1 有 6 次第一，并扩展到 4 个原发性硬化性胆管炎数据集。

## 2. 问题及研究位置

分析单位是 spot/图节点；训练参考集是正常组织，目标集包含未知异常。若正常参考和目标来自不同批次，模型可能把批次差异当异常。

## 3. 核心方法和数据流

```text
spot 中心 H&E patch → MobileUNet 视觉特征 ┐
spot 基因表达 + 邻接图 ────────────────────┤→ MGDAT 融合
→ 重建图像与表达 → 重建误差 + one-class 目标 → 异常分数
```

Masked Graph Dual-Attention Transformer 同时做 cross-node 与 cross-modality attention，并用遮挡减少重建模型对异常的过度泛化。

## 4. 实验、数据集与指标

对比图像异常检测、ST-only 与多模态方法，指标为 AUC、F1，并报告 5 次独立运行。消融检查单模态、MGDAT、遮挡、重建误差与单类目标。

## 5. 官方代码仓库审计

- 评级：**B**。训练和模型代码已开放，但 README 的数据准备说明较简，许可证文件缺失，使用边界待核验。
- 关键文件：`build_datasets.py`、`pretrain.py`、`finetune.py`、`main.py`、`model/fusion.py`、`model/meatrd.py`、`model/loss.py`。
- 仓库包含 `MobileUNet.pth`，可降低最小测试门槛。

## 6. 环境、显存与数据

仓库给出 `requirements.txt`；完整数据涉及 H&E、spot 坐标、表达矩阵与区域标签的严格配准。首要检查不是 GPU，而是坐标、基因过滤和参考/目标批次。

## 7. 建议复现路径

1. **最小测试**：运行数据构建，检查同一 spot 的 patch、表达行和图节点 ID 一致。
2. **标准实验**：复现一个乳腺癌数据集的 5 次 AUC/F1，并保留阈值选择规则。
3. **扩展实验**：做 leave-batch-out，区分真实异常与平台/批次异常。

## 8. 建议代码阅读顺序

`README.md` → `build_datasets.py` → `model/fusion.py` → `model/meatrd.py` → `model/loss.py` → `pretrain.py` → `finetune.py` → `main.py`。

## 9. 可借鉴思想

把重建与 one-class 判别结合；用空间图保留 spot 邻域；对“形态不明显的异常”引入分子证据。

## 10. 局限、风险与课题切入点

需要真实 ST 才能推理，成本较高；异常标签与阈值可能依赖数据集；跨平台批次效应未被彻底排除。可研究缺失模态、虚拟 ST 与真实 ST 不确定性传播。

## 11. 前后关联

下一篇读 [SpaCRD](25-spacrd.md)：两者都做区域检测，但 SpaCRD 更直接针对跨样本、跨平台迁移。

## 12. 链接

- [扩展论文](https://arxiv.org/abs/2412.10659)
- [官方代码](https://github.com/wqlzuel/MEATRD)
