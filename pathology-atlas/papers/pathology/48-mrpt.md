# 48｜MRPT：在 10×/20×/40× 下从细胞到整张切片联合预训练

**论文**：From Multi-Resolution Cells to Gigapixel Whole Slide Images Foundation Model for Computational Pathology，arXiv:2608.03508v2  
**定位**：多倍率 WSI 基础模型、层级自监督、跨倍率注意力、WSI VQA  
**精读核验**：依据 arXiv v2 的摘要、方法和版本记录整理（2026-09-22）；尚未进行复现实验。

## 原文摘要

> Vision Transformers (ViTs) and their hierarchical variants have achieved strong performance in Computational Pathology (CPath). However, most are pre-trained on single-resolution Whole Slide Images (WSIs), limiting their generalization across arbitrary resolutions. Gigapixel WSIs inherently contain diagnostic patterns at multiple scales, including cellular morphologies, tissue architectures, and global context, mirroring how expert pathologists examine WSIs. We introduce Multi-Resolution Pyramid Transformer (MRPT), a model that hierarchically aggregates multi-resolution information from cellular to tissue and WSI levels. MRPT employs a biologically meaningful Consecutive Cross-Resolution Attention (CCRA) mechanism to capture scale-independent interactions and enforces multi-resolution semantic consistency by aligning embeddings across resolutions, yielding robust and generalizable WSI representations. Pre-trained in a multi-resolution self-supervised manner on 624M patches, 2.4M regions, and 36K WSIs, MRPT learns rich coarse-to-fine histopathology features. Extensive experiments on 34 diverse datasets show that MRPT surpasses recent foundation models and Multimodal Large Language Models (MLLMs) in cancer subtype classification, tissue phenotyping, and Visual Question Answering (VQA) for WSI understanding.

*来源：arXiv:2608.03508；逐字原文，未改写、未压缩。*

## 1. 三分钟摘要与推荐理由

MRPT 同时解决层级结构与多倍率结构：它不只把 cell、patch、region、WSI 自下而上聚合，也让同一解剖位置的 10×、20×、40× 视图通过 Consecutive Cross-Resolution Attention（CCRA）逐级交互。目标是保留细胞细节、组织结构与全局上下文之间的对应关系。

这比单倍率 HIPT 更接近病理医生的连续缩放流程，也与 SlideChat、HistoSelect 的 WSI 问答路线直接相连。

## 2. 问题及研究位置

单倍率基础模型会丢掉同一空间位置在不同倍率上的互补信息；只做 slide-level 聚合又容易忽略 cell-to-tissue 的自然层级。MRPT 把对齐的多倍率视图组织成嵌套 token，并限制 cross-attention 只发生在相邻倍率，控制全跨尺度注意力的开销与语义跳跃。

## 3. 核心方法和数据流

```text
同一 WSI 的对齐 10× / 20× / 40× 视图
    → 对齐 region（2048 / 4096 / 8192 px）
    → 对齐 patch（128 / 256 / 512 px）
    → 对齐 cell-level token（8 / 16 / 32 px）
    → CCRA：仅在连续倍率间融合 cell token
    → 多倍率 SSL：cell → patch → region → WSI 的逐级聚合
    → 统一 multi-resolution WSI embedding → 分类 / 表型 / WSI VQA

MRPT-LLaVA（可选扩展）：MRPT embedding
    → cross-modal alignment → feature-space alignment → visual instruction tuning
    → WSI-Bench 问答输出
```

核心预训练采用 teacher–student 多倍率自监督；cell-level 的 CCRA 输出再逐层聚合为 patch、region 和 WSI 表征。论文将各倍率的同一物理区域保持对齐，而不是把不同倍率当作独立数据增强。

## 4. 论文证据与实验范围

- 摘要报告预训练规模为 6.24 亿 patch、240 万 region、3.6 万张 WSI。
- 作者在 34 个数据集上评估癌种分类、组织表型和 WSI VQA；性能结论属于作者报告。
- 论文 HTML 正文称代码与模型在作者 GitHub 页面提供，但该链接指向作者主页，当前未确认项目级仓库。

## 5. 复现与审计重点

- 核对不同倍率是否同一空间坐标、扫描倍率是否真实可用；不能用未对齐的多倍率 patch 冒充跨倍率输入。
- 逐层验证 cell→patch→region→WSI 训练是否各自带来增益，再比较仅相邻倍率交互与全跨倍率交互。
- 预训练规模极大；可先固定已有病理 encoder，在小型多倍率病例集上复现 CCRA 与跨倍率语义一致性目标。
- 需要单独报告染色、扫描仪与倍率缺失时的稳健性；多倍率一致性不等于跨中心泛化。

## 6. 建议阅读顺序

`Abstract` → `Fig. 2` → `3.1 Proposed MRPT Model` → `3.2 MRPT Architecture` → multi-resolution SSL 细节 → MRPT-LLaVA → 34 个数据集的协议。

## 7. 前后关联

- 与 [HIPT](04-hipt.md) 比较单倍率层级预训练与跨倍率层级预训练。
- 与 [Prov-GigaPath](32-prov-gigapath.md) 比较长序列 slide 表征和多倍率 token 组织。
- 与 [HistoSelect](15-histoselect.md)、[SlideChat](16-slidechat.md) 比较 WSI 问答中视觉 token 的来源与粒度。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2608.03508)
- [arXiv HTML 正文](https://arxiv.org/html/2608.03508v2)
- [论文指向的作者 GitHub 页面](https://github.com/BasitAlawode)
