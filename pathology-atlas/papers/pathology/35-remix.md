# ReMix：先压缩 WSI bag，再做隐空间增强

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

面对几万张相似街景，不逐张搬进教室，而是先聚成几个典型街区，再在这些典型样本之间做可控混合。

### 0.2 它为什么出现？

WSI 的 bag 太长，MIL 训练常被特征读取、显存和变长 batch 拖慢；同时普通图像增强很难直接定义在整张 WSI 上。

### 0.3 它到底怎么做？

1. 提取每张 WSI 的 patch features。
2. 在每个 bag 内做 K-means，以 K 个 centroid 代替原始实例。
3. 保存 cluster covariance，构成可采样的 bag dictionary。
4. 通过 append、replace、interpolate、covary 四种方式增强同类 prototype bag。

### 0.4 先认清这些词

- **prototype**：一组相似 patch 特征的代表向量。
- **latent augmentation**：不改原图，而在特征空间制造训练样本。
- **spatial-agnostic**：不使用 patch 的真实二维位置。
- **bag reduction**：用少量代表实例替代完整长 bag。

### 0.5 输入和输出

输入是预提取的 WSI patch feature bag；输出是压缩、增强后的 bag，再交给 ABMIL 或 DSMIL 分类。

### 0.6 最容易误解的地方

ReMix 节省的是 MIL 聚合器阶段，不包括 patch encoder 预训练和整张 WSI 特征提取；prototype 也不保留空间拓扑。

**现在只记住一句话：ReMix = 用 prototype 压缩长 bag，并在特征空间扩增，而不是设计新的 MIL 分类器。**

## 1. 三分钟摘要与推荐理由

ReMix 的价值是工程而非堆叠复杂网络。它把“几万实例的变长 bag”转换为少量 centroid，使 ABMIL/DSMIL 更容易 batch，并用四种同类 latent augmentation 正则化训练。它应被视为任何高效 MIL 工作的强基线：如果复杂长序列模型不能稳定超过 ReMix，就必须解释额外计算换来了什么。

## 2. 论文解决的问题及其研究位置

传统 WSI MIL 每轮都读取数千至数万实例，训练成本高；但随机采样可能漏掉病灶。ReMix 用聚类做有结构的压缩，位于随机采样与显式长序列模型之间。它只适合不依赖二维拓扑的任务，不应直接迁移到区域比例或边界定位。

## 3. 核心方法和数据流

```text
patch features → per-slide K-means
              → K centroids + covariance dictionary
              → append / replace / interpolate / covary
              → ABMIL or DSMIL
              → slide classification
```

Reduce 阶段生成固定长度 prototype；Mix-the-bag 从同类 key bag 取得相近 prototype，再进行追加、替换、插值或协方差扰动。训练仍使用原 MIL 的 slide-level 分类损失。

## 4. 关键实验、数据集与指标

- UniToPatho：292 张 WSI，六分类，平均约 1.6k instances，最大超过 20k。
- CAMELYON16：官方 271/129 train/test，平均约 8k、最大超过 50k instances。
- UniToPatho 上 ReMix-DSMIL append 平均指标 79.83%，DSMIL 为 76.23%。
- CAMELYON16 上 ReMix-DSMIL append 为 95.31%，DSMIL 为 93.96%。
- 报告的 CAMELYON16 ABMIL 训练成本由 235.72 s/epoch、332.12 MB 降到 1.10 s/epoch、8.76 MB；该比较仅覆盖 MIL classifier 阶段。
- K 对任务敏感：UniToPatho 最优 K=1，CAMELYON16 最优 K=8，说明压缩率不能脱离病灶比例讨论。

## 5. 官方代码仓库审计

复现评级 **B−**。仓库包含 `reduce.py`、`train_remix.py`、模型和数据处理脚本，并基于 DSMIL/mmselfsup；README 指向更新仓库。优点是核心操作直接，缺点是环境较旧、仓库提交和自动化验证有限，完整复现依赖外部 DSMIL 特征。

## 6. 环境、显存、存储和数据准备要求

使用预提取特征时单卡即可；主要准备工作是下载 DSMIL 的 CAMELYON16 features 或自行提取 UniToPatho 特征。应把 encoder 成本、K-means 一次性成本、MIL 训练成本和推理成本分开计时，避免只报告最有利的一段。

## 7. 建议复现路径

1. **最小测试**：对一张 WSI 运行 `reduce.py`，确认 centroid 与 covariance 形状。
2. **标准实验**：使用官方 CAMELYON16 split，比较 full bag、随机 K 个 patch、reduce-only 和 reduce+mix。
3. **边界实验**：按肿瘤面积分层，测微转移切片上的召回率，检查 prototype 是否抹去少量阳性区域。
4. **公平成本**：同时报告 feature extraction、压缩、训练和推理的时间与显存。

## 8. 建议代码阅读顺序

`README.md` → `tools/process_dataset.py` → `reduce.py` → `train_remix.py` → `model/` → `OpenSelfSup-MIL/`。

## 9. 值得借鉴的思想与可迁移组件

- 在设计更大聚合器前，先问长 bag 是否可以被可靠压缩。
- 数据增强可以定义在 bag representation，而不必回到原始 gigapixel 图像。
- 效率方法必须报告病灶稀疏度分层结果，不能只给平均准确率。

## 10. 局限、复现风险和博士课题切入点

K-means centroid 丢失空间结构和稀有实例；同类 mixing 假设类内特征变化连续；只比较 ABMIL/DSMIL，无法证明对空间 Transformer 普遍有效。可研究 lesion-aware prototype、带坐标的局部 prototype、压缩不确定性和可逆 token selection。

## 11. 与前后论文的关联

与 PANTHER 都使用 prototype，但 ReMix 为监督分类提供压缩与增强，PANTHER 学通用无监督 slide embedding。与 RetMIL/MambaMIL 比较时，ReMix 通过减少 token 获取效率，后两者通过更换序列算子保留更多 token。

## 12. 官方链接

- [MICCAI 官方论文与评审页](https://conferences.miccai.org/2022/papers/418-Paper0235.html)
- [arXiv 作者版](https://arxiv.org/abs/2207.01805)
- [官方代码](https://github.com/TencentAILabHealthcare/ReMix)
