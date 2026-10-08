# PAMA：带相对位置的 WSI 掩码自编码器

## 原文摘要

> Transformer-based multiple instance learning (MIL) framework has been proven advanced for whole slide image (WSI) analysis. However, existing spatial embedding strategies in Transformer can only represent fixed structural information, which are hard to tackle the scale-varying and isotropic characteristics of WSIs. Moreover, the current MIL cannot take advantage of a large number of unlabeled WSIs for training. In this paper, we propose a novel self-supervised whole slide image representation learning framework named position-aware masked autoencoder (PAMA), which can make full use of abundant unlabeled WSIs to improve the discrimination of slide features. Moreover, we propose a position-aware cross-attention (PACA) module with a kernel reorientation (KRO) strategy, which makes PAMA able to maintain spatial integrity and semantic enrichment during the training. We evaluated the proposed method on a public TCGA-Lung dataset with 3,064 WSIs and an in-house Endometrial dataset with 3,654 WSIs, and compared it with 6 state-of-the-art methods. The results of experiments show our PAMA is superior to SOTA MIL methods and SSL methods. The code will be available at https://github.com/WkEEn/PAMA.

*来源：Springer 章节页（https://doi.org/10.1007/978-3-031-43987-2_69）。逐字原文，未改写、未压缩。*

## 中文摘要

> 基于 Transformer 的多实例学习（MIL）框架已被证明在全切片图像（WSI）分析上具有先进性。然而，Transformer 中现有的空间嵌入策略只能表示固定的结构信息，难以应对 WSI 尺度多变且各向同性的特性。此外，当前的 MIL 无法利用大量无标注 WSI 来训练。本文提出一种新的自监督全切片图像表征学习框架，命名为位置感知掩码自编码器（position-aware masked autoencoder，PAMA），它能够充分利用大量无标注 WSI 来提升切片特征的判别性。此外，我们提出带有卷积核重定向（kernel reorientation，KRO）策略的位置感知交叉注意力（position-aware cross-attention，PACA）模块，使 PAMA 在训练过程中能够保持空间完整性与语义丰富性。我们在一个包含 3,064 张 WSI 的公开 TCGA-Lung 数据集和一个包含 3,654 张 WSI 的内部 Endometrial 数据集上评估了所提方法，并与 6 种最先进方法进行了比较。实验结果表明，我们的 PAMA 优于 SOTA 的 MIL 方法与 SSL 方法。代码将发布于 https://github.com/WkEEn/PAMA。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![PAMA 论文框架图](/papers/pathology/36-pama-pipeline.png)

> **原文图注**：PAMA 框架图（作者官方仓库 images/PAMA_FRAMEWORK.png）

*图源：https://github.com/WkEEn/PAMA。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

先在一座城市放置若干地标，每个街区只需描述自己离哪些地标多远、位于哪个方向；模型遮住大部分街区，再根据地标和剩余区域恢复它们。

### 0.2 它为什么出现？

patch-level 自监督只学局部纹理；直接对整张 WSI 使用绝对坐标和全局 attention，又会遇到旋转、尺度变化与二次复杂度。

### 0.3 它到底怎么做？

1. 冻结 DINO 或 PLIP patch encoder，取得 patch features 与坐标。
2. 聚类坐标形成 anchors，计算 patch–anchor 相对距离和极角。
3. 用 position-aware cross-attention 在 anchors 与 patches 之间传播信息。
4. 遮挡 75% patch token，通过 MAE 目标重建其特征。

### 0.4 先认清这些词

- **WSI-level SSL**：预训练目标作用于整张切片的 token 集合，而非单个 patch。
- **anchor bottleneck**：让少量 anchor 作为信息中介，降低全局交互成本。
- **相对位置**：描述 patch 与 anchor 的距离和方向，而不是绝对像素坐标。
- **KRO**：根据注意力分布重定向极角参考轴，减少旋转带来的不一致。

### 0.5 输入和输出

输入是 WSI patch features、坐标与 anchors；输出是可迁移的 slide embedding，供线性探测或下游微调。

### 0.6 最容易误解的地方

MICCAI 2023 原版与 2024 扩展作者版不是同一实验规模。下面的细粒度定量结果来自扩展版，不能当作原会议版 camera-ready 表格。

**现在只记住一句话：PAMA = 用 anchor、相对距离和动态角度，把掩码自编码从 patch 推到整张 WSI。**

## 1. 三分钟摘要与推荐理由

PAMA 代表 WSI 研究从“冻结 patch encoder + 为每个任务训练聚合器”转向“直接预训练 slide representation”。它通过 PACA 将复杂度由全局 self-attention 的 $O(n_p^2)$ 降为 $O(n_kn_p)$，并让位置编码适应病理切片的旋转和尺度特点。真正值得精读的是相对位置设计及其消融，而不是只看下游 SOTA 数字。

## 2. 论文解决的问题及其研究位置

HIPT 用固定网格形成层级；Prov-GigaPath 用长序列 slide encoder；PAMA 则以坐标 anchors 建立自适应中介。它试图同时解决全局上下文、旋转鲁棒性和超长序列成本，位于 WSI-level foundation representation 路线的早期阶段。

## 3. 核心方法和数据流

```text
WSI patches → frozen DINO/PLIP features
            → coordinate clustering → anchors
            → distance bins + polar-angle bins
            → 75% token masking
            → PACA encoder + KRO + anchor dropout
            → masked feature reconstruction
            → slide embedding → linear probe / fine-tune
```

PACA 让 anchor 与 patch 双向 cross-attention；KRO 为每个 anchor 选择主极轴后重新定义角度；Anchor Dropout 防止少数 anchor 成为固定捷径。

## 4. 关键实验、数据集与指标

原 MICCAI 摘要核验到 TCGA-Lung 3,064 WSI 和院内 Endometrial 3,654 WSI。扩展版覆盖七个多器官数据集、13,685 WSI，并加入亚型、EGFR、HER2 等任务。

扩展版结果：

- Endometrium-3k：AUC 0.855、ACC 47.47%。
- TCGA-NSCLC：AUC 0.989、ACC 93.51%。
- 去掉 KRO：Endometrium-3k AUC 下降 0.029、ACC 下降 6.87 个百分点。
- 去掉 distance embedding：AUC 下降 0.022、ACC 下降 6.75 个百分点。
- 去掉 polar embedding：AUC 下降 0.016、ACC 下降 6.39 个百分点。
- 推荐设置包括 75% mask、20% anchor dropout、约 144 patches/anchor、8 个 angle bins。

## 5. 官方代码仓库审计

复现评级 **B+**。仓库包含 patch 提取、预训练、线性探测、微调、slide embedding 导出、数据配置和许可证，关键文件包括 `models_pretrain_posemb.py`、`models_posemb.py` 与三个训练入口。权重与私有院内数据的可得性仍决定完整复现上限。

## 6. 环境、显存、存储和数据准备要求

完整多器官预训练需要大量 WSI、patch feature 存储与多卡计算；普通实验应复用作者 checkpoint 或先在单一公开队列上验证线性探测。坐标、倍率、patch encoder 版本和每张 WSI 的采样策略必须固化，否则位置消融不可比较。

## 7. 建议复现路径

1. **最小测试**：加载一张 WSI feature，检查 anchor 数、distance/angle bins 和 mask 后张量形状。
2. **标准实验**：复用 checkpoint，在 TCGA-NSCLC 做冻结 embedding 线性探测。
3. **关键消融**：固定 encoder 与 token 数，依次移除 distance、angle、KRO、anchor dropout。
4. **泛化实验**：在不同扫描仪或机构数据上比较绝对坐标、相对坐标与无位置模型。

## 8. 建议代码阅读顺序

`README.md` → `loader.py` → `models_pretrain_posemb.py` → `main_pretrain.py` → `models_posemb.py` → `main_linprobe.py` → `main_finetune.py` → `extract_slide_embedding.py`。

## 9. 值得借鉴的思想与可迁移组件

- WSI 位置编码应显式考虑旋转、尺度和不规则组织轮廓。
- anchor 既是复杂度控制，也决定模型看到的空间语义粒度。
- 会议版与扩展版必须在引用中分开，尤其不能混用数据规模和结果表。

## 10. 局限、复现风险和博士课题切入点

部分院内数据不公开；多器官预训练的数据去重、扫描仪分布和患者映射需要额外审计；极少见癌种和跨染色泛化证据有限。可研究组织结构感知 anchor、倍率自适应相对位置、anchor 不确定性，以及与 LongNet/Mamba/retention 的统一效率比较。

## 11. 与前后论文的关联

先读 HIPT 理解层级 WSI SSL，再读 PAMA 的相对位置，最后与 Prov-GigaPath 的大规模 slide encoder 对照。RetMIL 和 MambaMIL解决下游长序列聚合，PAMA 则把效率问题放进预训练阶段。

## 12. 官方链接

- [MICCAI 2023 Springer DOI](https://doi.org/10.1007/978-3-031-43987-2_69)
- [扩展作者版](https://arxiv.org/abs/2407.07504)
- [官方代码与 checkpoint](https://github.com/WkEEn/PAMA)
