# 17｜HESCAPE：空间转录组跨模态学习该怎样公平比较

**论文**：A Large-Scale Benchmark of Cross-Modal Learning for Histology and Gene Expression in Spatial Transcriptomics，ICCVW 2025  
**定位**：空间转录组、图像—基因对齐、批次效应、benchmark  
**老师推荐线**：空间组学方法学基准

**精读核验**：论文为 ICCV 2025 workshop 论文并有 arXiv 版本；官方仓库、数据入口和训练配置已核验（2026-09-02）。

## 1. 三分钟摘要与推荐理由

HESCAPE 的价值不在提出又一个融合模型，而在系统回答：图像 encoder、基因 encoder、冻结/微调策略和 CLIP/SigLIP 目标，究竟谁决定跨模态对齐效果？基准覆盖 6 种基因 panel、54 名供体，并比较跨模态检索、突变分类与基因表达预测。

最重要的负结果是：跨模态预训练改善突变分类，却常让直接基因表达预测变差。作者把矛头指向批次效应，提醒我们“embedding 对齐得好”不等于“所有下游任务都更好”。

## 2. 问题及研究位置

分析单位是空间转录组 spot；每个 spot 配对局部 H&E patch 和基因表达向量。核心风险是同一供体或同一组织切片中的 spot 高度相关，若随机按 spot 划分会产生严重泄漏。

## 3. 核心方法和数据流

```text
H&E spot patch → 图像 encoder ┐
                              ├→ CLIP / SigLIP 对齐 → 检索
基因表达向量 → 基因 encoder ┘                     → 突变分类 / 表达预测
```

图像分支比较 H0-mini、GigaPath、CTransPath、UNI、CONCH；基因分支比较 MLP、scFoundation、Nicheformer、DRVI。论文发现基因 encoder 对对齐质量的影响更大。

## 4. 实验、数据集与指标

数据跨 10x Xenium 的多种 panel；表达预测使用 224×224、约 112 µm×112 µm 的 20× patch，预测 50 个高变基因。主要指标包括 image-to-gene / gene-to-image Recall@5、突变分类和表达预测相关性。

## 5. 官方代码仓库审计

- 评级：**A−**。MIT 许可证；`pyproject.toml`、测试、文档、Hydra 配置与结果汇总齐全。
- 关键文件：`src/hescape/models/clip.py`、`image_encoder.py`、`gexp_encoder.py`、`modules/pretrain_module.py`、`experiments/hescape_pretrain/train.py`。
- 仓库提供约 60 秒的单 GPU smoke test；完整数据通过 Hugging Face 数据集获取。

## 6. 环境、显存与数据

仓库推荐 Python 3.11 与 `uv`，同时支持 conda/pip。完整微调组合较多，论文也出现 OOM；最小复现应先限制步数和 batch，再复现单一 panel。

## 7. 建议复现路径

1. **最小测试**：加载一个 human-lung-healthy panel，跑 200 step 单卡训练。
2. **标准实验**：固定供体级划分，复现一个 panel 的双向 Recall@5 与表达预测。
3. **扩展实验**：把批次标签显式加入域不变或分层采样，检验检索提升是否还能保留表达预测能力。

## 8. 建议代码阅读顺序

`README.md` → `data/` → `src/hescape/data_modules/` → `models/gexp_models/` → `models/image_models/` → `models/clip.py` → `experiments/hescape_pretrain/train.py`。

## 9. 可借鉴思想

把“表示对齐”和“任务效用”分开评价；报告负结果；把基因 encoder 与 batch robustness 当作主要变量。

## 10. 局限、风险与课题切入点

54 名供体对大模型仍有限；panel 间基因集合不同；目标基因与突变之间的关系不总能直接观测。可研究供体外泛化、跨 panel 缺失基因映射和 batch-aware 对比学习。

## 11. 前后关联

与 [TANGLE](10-tangle.md) 都做图像—表达对齐；HESCAPE 更适合用来检验 TANGLE 类方法在 spot 级任务上是否真的泛化。

## 12. 链接

- [arXiv](https://arxiv.org/abs/2508.01490)
- [官方代码与数据说明](https://github.com/peng-lab/hescape)

