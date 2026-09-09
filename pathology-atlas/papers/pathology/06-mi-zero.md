# 06｜MI-Zero：把视觉语言零样本分类扩展到整张 WSI

**论文**：Visual Language Pretrained Multiple Instance Zero-Shot Transfer for Histopathology Images，CVPR 2023  
**定位**：视觉语言预训练（VLP）、零样本 WSI 分类、MIL  
**建议投入**：先使用公开 checkpoint 和 TCGA-RCC 示例，不必从头训练视觉语言模型。

**精读核验**：CVPR 2023；论文使用超过55万份病理报告等域内文本预训练文本编码器，最佳模型再用超过3.3万对病理图文训练，在三个真实癌症亚型任务上的平均中位零样本准确率为70.2%（2026-09-01）。

## 1. 三分钟摘要与推荐理由

MI-Zero 将 CLIP 式图文对齐模型用于千兆像素 WSI。它先为 patch 提取视觉嵌入，把类别描述编码成文本嵌入，再将 patch—文本相似度通过 MIL 方式汇总成切片级零样本预测。这样可以在没有目标任务训练标签的情况下做癌症亚型分类。

它是从传统 MIL 进入病理视觉语言模型的最佳桥梁：模型并不复杂，但提示词、文本语料、patch 选择和聚合方式都会影响结果。

## 2. 问题及研究位置

自然图像 CLIP 面向中小图像和大规模公开图文对；病理 WSI 极大、公开配对数据有限。MI-Zero 的贡献是把零样本识别重新表述为 multiple-instance zero-shot transfer。

## 3. 核心方法和数据流

```text
WSI patches → 病理视觉编码器 → patch embeddings
类别/病理描述 → 文本编码器 → text embeddings
patch-text similarities → top-j / MIL aggregation → slide label
```

## 4. 实验、数据集与指标

论文使用多项真实癌症亚型任务；公开仓库提供 TCGA-RCC 零样本示例。论文还使用大量病理报告和公开图文对训练文本/图文编码器。复现时应单独报告提示词模板、top-j 和随机采样敏感性。

70.2% 是跨任务汇总后的平均中位数，不应写成任一具体队列的单次 accuracy。零样本比较还必须区分公开数据训练权重与包含院内数据的论文模型；二者可用数据范围不同。

## 5. 代码仓库审计

- 评级：**A-**。`env.yml`、修改版 `timm`、两组公开数据训练 checkpoint 说明、RCC 示例 CSV 和提示词文件齐全。
- 许可证为 **CC BY-NC-ND 4.0**，仅适合遵守条款的非商业学术使用；修改和再分发需格外谨慎。
- 部分论文模型使用院内数据，仓库只公开完全由公开数据训练的 encoder 权重。
- 关键文件：`src/extract_embeddings.py`、`src/slidelevel_zeroshot_multiprompt.py`、`src/prompts/*.json`。

## 6. 环境、显存与数据

零样本推理可单卡完成，成本主要是 WSI patch embedding。仓库要求安装 `assets/timm_ctp.tar`；权重需按 README 放入 `src/logs/` 对应目录。

## 7. 建议复现路径

1. **最小测试**：下载公开 checkpoint，运行 TCGA-RCC 示例的 embedding 与 slide-level 零样本脚本。
2. **标准实验**：固定 patch embedding，比较 BioclinicalBERT 与 PubMedBERT checkpoint、不同 prompt 组合和 top-j。
3. **扩展实验**：用自己的中文/英文病理术语本体构造 prompt，并做跨中心零样本校准。

## 8. 代码阅读顺序

`README.md` → `src/prompts/rcc_prompts.json` → `src/extract_embeddings.py` → `src/models/model.py` → `src/zeroshot_utils/zeroshot_path.py` → `src/slidelevel_zeroshot_multiprompt.py`。

## 9. 可借鉴思想

- 将类别名称升级为可组合的病理描述。
- 用 MIL 将 patch-level 图文相似度提升到 WSI-level 决策。
- 零样本并不等于“无设计”：prompt 与聚合规则就是任务先验。

## 10. 局限、风险与课题切入点

零样本结果可能依赖提示词和预训练数据重叠；相似度高不等于证据充分。可研究 prompt 不确定性、概念冲突、跨语言病理术语，以及带拒绝机制的零样本 WSI 分类。

**关键复现实验：**对每个类别构造多个同义 prompt，分别改变 top-j、patch 数和模板；同时报告 prompt 间方差、类别排序稳定性和“未知/拒绝”性能。否则一次 prompt 的高分不足以证明零样本能力稳定。

## 11. 前后关联

先理解 [CTransPath](07-ctranspath.md) 的视觉编码，再读 [WSI-FiVE](12-wsi-five.md) 和 [HistoSelect](15-histoselect.md)。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2023/html/Lu_Visual_Language_Pretrained_Multiple_Instance_Zero-Shot_Transfer_for_Histopathology_Images_CVPR_2023_paper.html)
- [官方代码](https://github.com/mahmoodlab/MI-Zero)
