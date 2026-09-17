# RetMIL：用 retention 处理超长 WSI 序列

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

把一本极长的书分成若干章节：先在章节内提炼摘要，再让章节摘要按顺序传递记忆，最后形成整本书的判断。

### 0.2 它为什么出现？

Transformer 对数万 patch 做全局 self-attention 需要二次复杂度，容易带来显存、吞吐和时延问题。

### 0.3 它到底怎么做？

1. 将 patch features 排成序列，并切成长度 512 的子序列。
2. 在每个子序列内使用并行 linear retention 更新 token。
3. 用 local attention pooling 得到一个局部 token。
4. 对局部 token 序列使用串行 retention，再做全局 pooling 和分类。

### 0.4 先认清这些词

- **retention**：结合衰减、位置和内容相关交互的序列算子。
- **local/global hierarchy**：先建模局部子序列，再融合为全局表示。
- **serial retention**：按顺序更新记忆，适合全局压缩后的较短序列。
- **B-Acc**：各类别召回率的平均，适合类别不平衡。

### 0.5 输入和输出

输入是冻结 DINO ViT-S/16 提取的 patch feature sequence；输出是 slide-level 类别与可回投的局部/全局 attention 热图。

### 0.6 最容易误解的地方

RetMIL 降低的是聚合器成本，不包括 WSI 切块和 encoder；论文中的 token 顺序也不等于真实二维组织拓扑。

**现在只记住一句话：RetMIL = 局部并行 retention 加全局串行 retention，用分层结构替代全局二次 attention。**

## 1. 三分钟摘要与推荐理由

RetMIL 是理解“长序列算子如何进入 WSI MIL”的清晰样本。相比直接删 token，它尽量保留实例，只在局部和全局之间做结构化压缩。阅读时应同时看性能、长 bag 分桶、显存和吞吐，而不是只看总体 F1。

## 2. 论文解决的问题及其研究位置

DTFD-MIL/ReMix 通过压缩 bag 降低计算，MambaMIL通过状态空间模型处理序列，RetMIL 则采用 Retentive Network 风格的 retention。三者的关键差别是丢弃多少实例、如何定义顺序，以及是否显式保留二维位置。

## 3. 核心方法和数据流

```text
20× WSI → Otsu foreground → 224×224 patches
        → frozen DINO ViT-S/16 features
        → split into length-512 subsequences
        → parallel local retention
        → local attention pooling
        → serial global retention
        → global attention pooling → classifier
```

retention 使用旋转位置编码后的 Q/K、V 与距离衰减矩阵。最后不足 512 的序列通过重复/截断补齐，这一细节可能改变少量尾部实例的权重。

## 4. 关键实验、数据集与指标

- CAMELYON：F1 87.24±2.26，B-Acc 87.53±1.70；TransMIL 为 84.06、84.10。
- BRACS：F1 68.51±1.85，B-Acc 67.01±1.58；CLAM-MB 为 66.99、66.15。
- LUNG 外院测试：F1 91.51、B-Acc 91.56；TransMIL F1 91.75，说明并非所有指标全面领先。
- 按 patch 数分桶后，论文报告 RetMIL 在 0–5k 到 >15k 四段均取得最高 F1/B-Acc。
- 超长 bag 上吞吐约为 Transformer 系方法的 1.5×，显存趋势接近常数；图示数字应在复现时重新测量。

## 5. 官方代码仓库审计

复现评级 **C**。公开仓库目前主要包含 `retmil_model.py` 与极简 README，足以查看核心模型，不足以独立重建数据处理、训练协议、划分和论文表格。论文可读性高于代码可复现性；复现实验必须自行补齐 pipeline 并明确哪些实现来自推断。

## 6. 环境、显存、存储和数据准备要求

论文使用单张 RTX 4090、batch size 1、100 epochs、early stopping 15。需要自行实现 Otsu、20× 切块、DINO ViT-S/16 特征提取和三个数据集协议。最稳妥做法是接入已有 CLAM/MambaMIL 数据层，只替换 aggregator。

## 7. 建议复现路径

1. **最小测试**：对不同序列长度跑 `retmil_model.py` 前向，记录输出、峰值显存和吞吐。
2. **标准实验**：固定 MambaMIL 或 TransMIL 使用的同一 features/split，只替换聚合器。
3. **边界测试**：专门比较 511、512、513 patch，检查尾部重复补齐的影响。
4. **空间测试**：比较随机顺序、扫描顺序和二维空间曲线排序，判断 retention 学到的是组织还是任意序列先验。

## 8. 建议代码阅读顺序

论文方法第 2 节 → `retmil_model.py` → local retention → local pooling → global serial retention → global pooling。由于仓库缺少完整训练层，数据和 loss 需参考论文逐项重建。

## 9. 值得借鉴的思想与可迁移组件

- 长序列效率评估必须按 token 数分桶，而不只报告均值。
- 局部并行、全局串行是适用于超长实例集合的通用结构。
- 任何序列化 WSI 方法都必须回答 patch 顺序的来源和不确定性。

## 10. 局限、复现风险和博士课题切入点

公开代码不完整；与 Mamba、LongNet 等高效算子比较不足；顺序不等于二维拓扑；尾部补齐可能污染 attention。可研究二维 retention、无序集合兼容的 retention、空间曲线扫描集成，以及统一硬件上的真实吞吐基准。

## 11. 与前后论文的关联

与 MambaMIL 都追求线性长序列建模：MambaMIL 强调 sequence reordering，RetMIL 强调 local/global retention。与 ReMix 对照时，RetMIL保留更多 token，ReMix 以 prototype 换取更极端的效率。

## 12. 官方链接

- [MICCAI 官方 PDF](https://papers.miccai.org/miccai-2024/paper/1723_paper.pdf)
- [Springer DOI](https://doi.org/10.1007/978-3-031-72083-3_41)
- [官方代码](https://github.com/Hongbo-Chu/RetMIL)
