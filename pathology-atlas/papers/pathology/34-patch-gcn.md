# Patch-GCN：把整张病理切片看成二维点云

## 原文摘要

> Cancer prognostication is a challenging task in computational pathology that requires context-aware representations of histology features to adequately infer patient survival. Despite the advancements made in weakly-supervised deep learning, many approaches are not context-aware and are unable to model important morphological feature interactions between cell identities and tissue types that are prognostic for patient survival. In this work, we present Patch-GCN, a context-aware, spatially-resolved patch-based graph convolutional network that hierarchically aggregates instance-level histology features to model local- and global-level topological structures in the tumor microenvironment. We validate Patch-GCN with 4,370 gigapixel WSIs across five different cancer types from the Cancer Genome Atlas (TCGA), and demonstrate that Patch-GCN outperforms all prior weakly-supervised approaches by 3.58-9.46%. Our code and corresponding models are publicly available at https://github.com/mahmoodlab/Patch-GCN.

*来源：arXiv:2107.13048（https://arxiv.org/abs/2107.13048）。逐字原文，未改写、未压缩。*

## 中文摘要

> 癌症预后判断是计算病理学中一项具有挑战性的任务，它需要具备上下文感知的组织学特征表征，才能充分推断患者生存。尽管弱监督深度学习取得了进展，但许多方法并不具备上下文感知，无法建模细胞身份与组织类型之间对患者生存具有预后意义的重要形态学特征交互。在本工作中，我们提出 Patch-GCN，一个具备上下文感知、空间分辨的基于 patch 的图卷积网络，它以层级方式聚合实例级组织学特征，以建模肿瘤微环境中的局部与全局拓扑结构。我们用来自癌症基因组图谱（TCGA）的五个不同癌种、共 4,370 张千兆像素 WSI 验证 Patch-GCN，并证明 Patch-GCN 以 3.58-9.46% 的优势优于此前所有弱监督方法。我们的代码与相应模型公开于 https://github.com/mahmoodlab/Patch-GCN。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![Patch-GCN 论文框架图](/papers/pathology/34-patch-gcn-pipeline.jpg)

> **原文图注**：Fig 1: Patch-GCN framework for context-aware survival outcome prediction in WSIs. Non-overlapping 256 × 256 256\times 256 patches are patched as used as input into a ResNet-50 CNN to construct the node feature matrix, with edges drawn between adjacent image patches in the WSI. A ReLU + Softmax Message Passing scheme is used to aggregate instance-level embeddings in local neighborhoods, with residual mappings and skip connections used to construct context-aware embeddings, followed by global attention-based pooling.

*图源：https://arxiv.org/html/2107.13048v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

普通 MIL 像只统计一座城市有哪些建筑；Patch-GCN 还保留哪些建筑彼此相邻，观察肿瘤、间质和免疫区域如何共同组成局部生态。

### 0.2 它为什么出现？

患者预后往往不只取决于某个 patch 是否像肿瘤，还取决于肿瘤与淋巴细胞、坏死和间质的空间关系。无序 bag 会丢失这些邻接信息。

### 0.3 它到底怎么做？

1. 在 20× 倍率将 WSI 切成 256×256 patch。
2. 用预训练 ResNet-50 把每个 patch 编成 1,024 维节点特征。
3. 按真实二维坐标连接近邻 patch，构造空间图。
4. 用多层 GCN 和全局 attention pooling 输出患者生存风险。

### 0.4 先认清这些词

- **空间图**：节点是 patch，边表示真实坐标中的邻接关系。
- **message passing**：节点与邻居交换特征，逐层扩大感受野。
- **C-index**：生存预测排序是否正确，0.5 接近随机，越高越好。
- **删失**：随访结束时尚未观察到事件，不能简单当作阴性。

### 0.5 输入和输出

输入是一个患者的一张或多张 WSI patch 特征及坐标；输出是患者级风险分数和 patch attention 热图。

### 0.6 最容易误解的地方

空间 attention 热图是模型证据分配，不是因果病理标注；使用更多 patch 也可能贡献性能，不能把全部提升都归因于 GCN。

**现在只记住一句话：Patch-GCN = 在患者级弱监督下，用真实空间邻接把 WSI patch 从无序 bag 变成图。**

## 1. 三分钟摘要与推荐理由

Patch-GCN 是 WSI 空间建模的重要早期基线。论文在 TCGA 的 BLCA、BRCA、GBMLGG、LUAD、UCEC 五个癌种、4,370 张诊断 WSI 上做患者级生存预测，总体 C-index 为 0.636，高于 Attention MIL 的 0.614、DeepGraphConv 的 0.620。它最值得学习的不是一个特定 GCN 层，而是“预测目标需要空间关系时，不应默认 patch 可交换”的研究判断。

## 2. 论文解决的问题及其研究位置

标准 attention MIL 将 patch 当作集合，适合寻找少量高证据实例，却难表达肿瘤—间质—免疫细胞的共定位。Patch-GCN 位于无序 MIL 与后续层级 Transformer、空间图网络之间，专门回答局部组织拓扑是否能改善预后建模。

## 3. 核心方法和数据流

```text
WSI → 组织分割 → 20× 非重叠 patch
    → ResNet-50 patch features + (x, y) coordinates
    → spatial k-NN graph（k=8）
    → residual GCN × 4 + dense skip connections
    → global attention pooling
    → patient risk / survival loss
```

图边由真实欧氏坐标构造，而不是按特征相似度连接。四层 GCN 逐步融合不同范围的组织上下文，最后在患者级训练生存目标。

## 4. 关键实验、数据集与指标

- 数据：TCGA 五癌种，共 4,370 张 FFPE 诊断 WSI；患者平均约 13,487 个 patch，最大约 100k。
- 协议：患者级五折交叉验证，避免同一患者切片跨折。
- 总体 C-index：Patch-GCN 0.636；Attention MIL 0.614；DeepAttnMISL 0.581；DeepGraphConv 0.620。
- 分癌种结果：BLCA 0.560、BRCA 0.580、GBMLGG 0.824、LUAD 0.585、UCEC 0.629。
- 关键反证：UCEC 上 DeepGraphConv 更好，说明局部细胞交互不是所有癌种预后的充分归纳偏置。

审稿阶段指出 Patch-GCN 使用全量 patch，而部分图基线只采样约 1k 节点；因此“空间图优于其他方法”与“看到了更多组织”没有完全解耦。

## 5. 官方代码仓库审计

复现评级 **B+**。仓库提供图构建 notebook、模型、患者级五折划分、数据表、训练入口、结果目录和推理 benchmark。代码基于较旧的 PyTorch Geometric 1.6.3；作者特别提示新版依赖可能使损失不稳定，迁移环境时必须记录改动。

## 6. 环境、显存、存储和数据准备要求

完整流程需下载 TCGA WSI、运行组织分割和 patch 特征提取，再为每个患者建立可达 100k 节点的图。聚合器单卡可运行，但原始 WSI、patch 与图特征的存储和 I/O 是主要成本。优先复用 CLAM 风格预提取特征，并在少量患者上验证坐标与节点对齐。

## 7. 建议复现路径

1. **最小测试**：运行仓库图构建 notebook，检查 patch 坐标、边数和 connected components。
2. **标准实验**：固定 BRCA 患者划分和同一特征，比较 Attention MIL、随机图、特征图与空间图。
3. **关键消融**：让各方法使用完全相同的 patch 数，分离空间拓扑与全量采样收益。
4. **外部验证**：增加独立医院队列并报告 calibration，而不仅是内部交叉验证 C-index。

## 8. 建议代码阅读顺序

`README.md` → `WSI-Graph Construction.ipynb` → `models/model_graph_mil.py` → `datasets/` → `utils/` → `main.py` → `splits/5foldcv/` → `Inference Benchmark.ipynb`。

## 9. 值得借鉴的思想与可迁移组件

- 建图规则必须由病理问题决定，不能默认 feature-space 最近邻等于组织邻接。
- 患者级任务必须在患者层面划分，不能让同一患者不同切片跨训练与测试。
- 对“空间结构有效”的主张，应固定 patch 数、encoder 和损失，只替换拓扑。

## 10. 局限、复现风险和博士课题切入点

仅使用 TCGA，缺少跨中心生存队列；ImageNet encoder 存在域偏移；多个癌种 C-index 仍在 0.56–0.63，离临床使用较远。可研究动态组织图、多尺度细胞—区域异构图、图采样的置信区间，以及空间关系在不同癌种中的适用条件。

## 11. 与前后论文的关联

先用 CLAM 理解无序 attention MIL，再读 Patch-GCN；随后比较 HIPT 的层级网格、PAMA 的相对位置和 RetMIL/MambaMIL 的长序列建模。它们分别选择图、层级、anchor 和序列作为 WSI 的结构单位。

## 12. 官方链接

- [MICCAI 官方论文与评审页](https://miccai2021.org/openaccess/paperlinks/2021/09/01/530-Paper2410.html)
- [arXiv 作者版](https://arxiv.org/abs/2107.13048)
- [官方代码](https://github.com/mahmoodlab/Patch-GCN)
