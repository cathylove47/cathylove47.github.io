# TransMIL：从独立 patch 到相关实例建模

## 原文摘要

> Multiple instance learning (MIL) is a powerful tool to solve the weakly supervised classification in whole slide image (WSI) based pathology diagnosis. However, the current MIL methods are usually based on independent and identical distribution hypothesis, thus neglect the correlation among different instances. To address this problem, we proposed a new framework, called correlated MIL, and provided a proof for convergence. Based on this framework, we devised a Transformer based MIL (TransMIL), which explored both morphological and spatial information. The proposed TransMIL can effectively deal with unbalanced/balanced and binary/multiple classification with great visualization and interpretability. We conducted various experiments for three different computational pathology problems and achieved better performance and faster convergence compared with state-of-the-art methods. The test AUC for the binary tumor classification can be up to 93.09% over CAMELYON16 dataset. And the AUC over the cancer subtypes classification can be up to 96.03% and 98.82% over TCGA-NSCLC dataset and TCGA-RCC dataset, respectively. Implementation is available at: https://github.com/szc19990412/TransMIL.

*来源：arXiv:2106.00908（https://arxiv.org/abs/2106.00908）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![TransMIL 论文框架图](/papers/pathology/30-transmil-pipeline.png)

> **原文图注**：Figure 3: Overview of our TransMIL. Each WSI is cropped into patches (background is discraded), and embedded in feature vectors by ResNet50. Then the sequence is processed with the TPT module: 1) Squaring of sequence; 2) Correlation modelling of the sequence; 3) Conditional position encoding and local information fusion; 4) Deep feature aggregation; 5) Mapping of 𝕋 → 𝒴 \mathbb{T}\rightarrow\mathcal{Y} .

*图源：https://arxiv.org/html/2106.00908v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

传统 MIL 像把每个学生当作互不认识；TransMIL 让学生彼此交流，并告诉模型他们在教室里的座位位置。

### 0.2 它为什么出现？

肿瘤、间质和免疫区域会成片出现，patch 不是独立的；普通注意力池化可能忽略共现和空间结构。

### 0.3 它到底怎么做？

1. 输入预提取的 patch 特征。
2. 补齐并排列成近似二维网格。
3. 用 Transformer 让 patch 交换信息。
4. 通过金字塔位置编码加入多尺度空间关系，再用 class token 分类。

### 0.4 先认清这些词

- **相关实例**：patch 之间存在共现或空间关系。
- **class token**：专门汇总整组信息并用于分类的 token。
- **PPEG**：用不同尺度卷积注入位置关系的模块。
- **Transformer**：用注意力让信息单元彼此交互。

### 0.5 输入和输出

输入是 patch 特征及其排列；输出是 WSI 类别。

### 0.6 最容易误解的地方

把 patch 补成方形网格只是计算安排，不一定完全还原原始组织几何。

**现在只记住一句话：TransMIL = 让 patch 相互交流，同时补回它们的空间位置。**

## 1. 三分钟摘要与推荐理由
TransMIL 用 Transformer 显式建模 WSI 中 patch 之间的相关性，并通过金字塔位置编码恢复二维空间结构，是理解后续长序列 MIL 与 Mamba 方法的重要桥梁。

## 2. 论文解决的问题及其研究位置
传统 MIL 常近似把实例视为独立样本，忽略腺体、间质和肿瘤区域的共现关系。TransMIL 将 bag 视作相关序列。

## 3. 核心方法和数据流
预提取 patch 特征 → 补齐为近似方形网格 → Transformer 层 → PPEG 金字塔位置编码 → 再一层 Transformer → class token 分类。

## 4. 关键实验、数据集与指标
论文在 TCGA 与 CAMELYON16 等 WSI 分类设置比较多种 MIL。论文事实：实验支持相关实例和位置编码的贡献，但不同基线需确保使用相同特征与划分。

## 5. 官方代码仓库审计
仓库事实：核心模型位于 `models/TransMIL.py`，数据与训练入口集中在仓库主脚本；代码公开但环境与数据准备说明较精简。复现评级 **B+**。

## 6. 环境、显存、存储和数据准备要求
训练依赖预提取特征。自注意力随实例数近似二次增长，超长 WSI 往往需要采样或控制 bag 长度。

## 7. 建议复现路径
最小测试：随机 bag 通过模型并核对输出尺寸。标准实验：固定 CLAM 特征复现一个二分类任务。扩展实验：与 MambaMIL、GMMamba比较性能—显存—实例数曲线。

## 8. 建议代码阅读顺序
数据读取 → `models/TransMIL.py` 中 PPEG 与 Transformer 模块 → 训练循环 → 指标汇总。

## 9. 值得借鉴的思想与可迁移组件
位置编码不是装饰：打乱 patch 后，模型必须重新获得空间关系；将二维组织布局映射到 bag 表征是核心设计。

## 10. 局限、复现风险和博士课题切入点
补方形网格可能引入虚拟实例；长序列成本高；患者级切分、坐标顺序和特征编码器必须统一。

## 11. 与前后论文的关联
TransMIL 连接 CLAM 类注意力 MIL 与 MambaMIL/GMMamba 的高效长序列建模。

## 12. 官方链接
[NeurIPS 论文](https://papers.nips.cc/paper/2021/hash/10c272d06794d3e5785d5e7c5356e9ff-Abstract.html) · [代码](https://github.com/szc19990412/TransMIL)
