# 18｜CPath-Omni：一个模型同时处理 patch 与整张 WSI

**论文**：CPath-Omni: A Unified Multimodal Foundation Model for Patch and Whole Slide Image Analysis in Computational Pathology，CVPR 2025  
**定位**：15B 病理多模态基础模型、patch/WSI 统一、CPath-CLIP  
**老师推荐线**：通用病理视觉语言模型

**精读核验**：CVPR 2025 正式论文、补充材料、官方模型仓库已核验（2026-09-02）。

## 1. 三分钟摘要与推荐理由

CPath-Omni 想消除“patch 模型一套、WSI 模型另一套”的割裂。它用同一 15B 大模型处理分类、VQA、caption 和视觉指代，同时提出 CPath-CLIP 作为视觉处理器。论文报告在 7 类任务、42 个数据集中的 39 个达到或匹配当时最佳。

真正值得读的是三阶段训练：先做大规模图文对齐，再用 351,871 条 patch 指令覆盖 21 个数据集，最后用规模较小但经病理医生修订的 WSI 指令把能力迁移到切片级。

## 2. 问题及研究位置

训练单位混合了 patch—文本和 WSI—文本。统一模型减少重复参数，但也带来数据源、任务权重和评测污染更难追踪的问题。

## 3. 核心方法和数据流

```text
多种视觉 encoder + LLM 文本 encoder → CPath-CLIP
patch / WSI 视觉 token → projector → 15B LMM
图文对齐 → patch 多任务指令微调 → WSI 指令微调
```

## 4. 实验、数据集与指标

视觉处理器在 9 个零样本与 4 个 few-shot 数据集上评价；统一模型覆盖 32 个 patch 子集及 10 个 WSI 数据集。论文比较专用模型、病理基础模型与 GPT-4o，但不同模型能访问的训练数据并不完全对等。

## 5. 官方代码仓库审计

- 评级：**B**。仓库已提供 CPath-CLIP 重建与多个零样本评测脚本，但 CPath-Omni 完整训练流水线不如论文描述完整。
- 可核验文件：`cpath_clip/reconstruct_cpath_clip.py`、`clip_acc_camelyon.py`、`clip_acc_BACH.py`、`src/open_clip/model.py`。
- 模型文件体积大；仓库内包含 Qwen 文本 encoder 配置与分片索引。

## 6. 环境、显存与数据

15B 模型的完整训练显然不是普通单卡任务。分析判断：优先复现 CPath-CLIP 的一个零样本数据集，再用公开 checkpoint 做推理；完整三阶段训练需多卡高显存和严格数据许可审查。

## 7. 建议复现路径

1. **最小测试**：重建 CPath-CLIP，在一个小型分类集输出类别相似度。
2. **标准实验**：复现 Camelyon 或 BACH 零样本准确率，并冻结 prompt 模板。
3. **扩展实验**：做 patch/WSI 联合训练的任务冲突分析，判断统一是否带来负迁移。

## 8. 建议代码阅读顺序

`README.md` → `cpath_clip/reconstruct_cpath_clip.py` → `cpath_clip/src/open_clip/factory.py` → `model.py` → 一个 `clip_acc_*.py` 评测脚本。

## 9. 可借鉴思想

共享 patch 与 WSI 知识；把语言模型用于文本 encoder；把多任务能力放在同一模型中进行系统评价。

## 10. 局限、风险与课题切入点

39/42 的胜出数量掩盖了任务难度差异；训练集来源多，需排查与测试集重叠；生成式答案缺少临床错误分级。可做数据谱系审计、负迁移分析和外部医院盲测。

## 11. 前后关联

与 [SlideChat](16-slidechat.md) 同属 WSI 助手；SlideChat 的结构更清楚，CPath-Omni 的重点是 patch—WSI 统一。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2025/html/Sun_CPath-Omni_A_Unified_Multimodal_Foundation_Model_for_Patch_and_Whole_CVPR_2025_paper.html)
- [官方代码与模型](https://github.com/PathFoundation/CPath-Omni)

