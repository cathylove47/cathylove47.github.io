# 14｜MambaMIL：用线性复杂度状态空间模型处理超长 patch 序列

**论文**：MambaMIL: Enhancing Long Sequence Modeling with Sequence Reordering in Computational Pathology，MICCAI 2024  
**定位**：Mamba、长序列 MIL、分类与生存  
**建议投入**：使用 BRACS 或 LUAD/LUSC 脚本，在固定特征上与 TransMIL/DSMIL 比较。

**精读核验**：MICCAI 2024，LNCS 15004，pp. 296–306；作者为 Shu Yang、Yihui Wang、Hao Chen，论文和补充材料均有 MICCAI 官方开放页面（2026-09-01）。

## 原文摘要

> Multiple Instance Learning (MIL) has emerged as a dominant paradigm to extract discriminative feature representations within Whole Slide Images (WSIs) in computational pathology. Despite driving notable progress, existing MIL approaches suffer from limitations in facilitating comprehensive and efficient interactions among instances, as well as challenges related to time-consuming computations and overfitting. In this paper, we incorporate the Selective Scan Space State Sequential Model (Mamba) in Multiple Instance Learning (MIL) for long sequence modeling with linear complexity, termed as MambaMIL. By inheriting the capability of vanilla Mamba, MambaMIL demonstrates the ability to comprehensively understand and perceive long sequences of instances. Furthermore, we propose the Sequence Reordering Mamba (SR-Mamba) aware of the order and distribution of instances, which exploits the inherent valuable information embedded within the long sequences. With the SR-Mamba as the core component, MambaMIL can effectively capture more discriminative features and mitigate the challenges associated with overfitting and high computational overhead. Extensive experiments on two public challenging tasks across nine diverse datasets demonstrate that our proposed framework performs favorably against state-of-the-art MIL methods. The code is released at https://github.com/isyangshu/MambaMIL.

*来源：arXiv:2403.06800（https://arxiv.org/abs/2403.06800）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![MambaMIL 论文框架图](/papers/pathology/14-mambamil-pipeline.png)

> **原文图注**：Figure 1: Overview of MambaMIL. Given a set of patches cropped from a slide, we sequentially utilize Feature Extractor, Linear Projection, stacked SR-Mamba modules and Aggregation for WSI analysis.

*图源：https://arxiv.org/html/2403.06800v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

Transformer 像让班里每个人同时和所有人聊天，人数一多就很贵；Mamba 像沿队伍传递一张不断更新的便签，成本更接近线性。

### 0.2 它为什么出现？

WSI 有数万 patch，完整自注意力成本随长度平方增长；但 Mamba 按顺序读取，而 WSI patch 原本没有天然的一维顺序。

### 0.3 它到底怎么做？

1. 把预提取 patch 特征排成序列。
2. 用重排序规则给 patch 安排更有意义的阅读顺序。
3. 用双向或重排序 Mamba 传递长距离信息。
4. 汇总序列并输出分类或生存预测。

### 0.4 先认清这些词

- **状态空间模型**：用不断更新的内部状态读取长序列。
- **线性复杂度**：序列加倍时，计算量大致也只加倍。
- **序列重排序**：决定模型先看哪个 patch、后看哪个 patch。
- **MIL**：从一组 patch 推断整张切片标签。

### 0.5 输入和输出

输入是 patch 特征序列；输出是切片分类或患者风险。

### 0.6 最容易误解的地方

Mamba 的效率优势不自动解决空间问题；错误的排序可能把相邻组织拆开或制造虚假邻接。

**现在只记住一句话：MambaMIL = 用更省计算的长序列模型读 patch，但必须认真安排阅读顺序。**

## 1. 三分钟摘要与推荐理由

MambaMIL 将选择性状态空间模型引入 WSI MIL，以线性复杂度处理长实例序列。由于 Mamba 对顺序敏感，而传统 WSI bag 常被视作无序集合，论文进一步提出 Sequence Reordering Mamba（SR-Mamba），利用实例顺序/分布构建更有效的扫描序列。

## 2. 问题及研究位置

Transformer 对数万 patch 的全局注意力成本高；简单 pooling 又缺乏长程交互。MambaMIL 探索线性复杂度序列建模，但也迫使研究者正面回答“WSI patch 的顺序从哪里来”。

## 3. 核心方法和数据流

```text
precomputed patch features → sequence reordering
Mamba / BiMamba / SR-Mamba layers → bag representation
classification head 或 survival head → patient/slide outcome
```

## 4. 实验、数据集与指标

论文在癌症亚型分类和生存预测两类任务、九个数据集上评价。仓库提供 BRACS、LUAD/LUSC 和多个 TCGA 生存队列的 CSV、划分与训练脚本。

Mamba 的线性复杂度解决的是长序列计算，不会自动解决 bag 的置换不变性。SR-Mamba 的重排规则实际上定义了模型看到的“邻近关系”，因此顺序消融与空间坐标审计比单纯比较 AUC 更关键。

## 5. 代码仓库审计

- 评级：**B**。训练入口、模型、Mamba 子模块、数据表、交叉验证划分和 shell 脚本齐全。
- README 显示 MIT 徽章，但根目录未发现独立 LICENSE 文件；许可状态应再次向作者确认。
- 未见统一公开 checkpoint；需要从预提取特征训练。
- 关键文件：`models/MambaMIL.py`（实际大小写以仓库为准）、`main.py`、`main_survival.py`、`train_scripts/`。

## 6. 环境、显存与数据

README 指定 CUDA 11.8、Python 3.10、PyTorch 2.0.1、`causal-conv1d==1.1.1` 和本地 Mamba 安装。MIL 训练可单卡起步，长序列长度与特征维度决定显存。

## 7. 建议复现路径

1. **最小测试**：按照 README 建立 CUDA 11.8 环境，运行一个模型前向并验证 sequence length。
2. **标准实验**：执行 `train_scripts/LUAD_LUSC_512_subtyping.sh` 或 BRACS 脚本，固定同一 encoder 特征。
3. **扩展实验**：比较随机顺序、空间扫描、聚类顺序和 SR-Mamba，并报告速度、峰值显存与方差。

## 8. 代码阅读顺序

`README.md` → `train_scripts/LUAD_LUSC_512_subtyping.sh` → `main.py` → `dataset/dataset_generic.py` → `models/` 中 MambaMIL 实现 → `mamba/` → `main_survival.py` → `utils/survival_core_utils.py`。

## 9. 可借鉴思想

- 线性复杂度模型能扩大 WSI 上下文，但顺序定义是方法核心。
- 同时报告准确率、吞吐、显存和序列长度。
- 分类与生存任务可共享聚合器，但损失与划分协议不能混用。

## 10. 局限、风险与课题切入点

重排可能引入任意先验，并对 patch 抽样敏感；Mamba 的隐状态难直接对应病理结构。可研究二维空间感知扫描、多尺度双向扫描和顺序不确定性集成。

**关键复现实验：**至少比较随机排列、原始文件顺序、坐标 raster scan、空间曲线/聚类顺序与 SR-Mamba；对每种顺序报告多种子结果、峰值显存和吞吐。若未记录坐标与排列生成过程，MambaMIL 数字不可审计。

## 11. 前后关联

与 [DTFD-MIL](05-dtfd-mil.md) 比较分层压缩，与 [HIPT](04-hipt.md) 比较显式层级空间结构。

## 12. 链接

- [MICCAI 论文 PDF](https://papers.miccai.org/miccai-2024/paper/3255_paper.pdf)
- [官方代码](https://github.com/isyangshu/MambaMIL)
- [arXiv](https://arxiv.org/abs/2403.06800)
