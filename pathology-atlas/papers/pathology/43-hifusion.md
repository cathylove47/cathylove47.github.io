# 43｜HiFusion：spot 内多尺度对齐，再谨慎吸收邻域

**论文**：HiFusion: Hierarchical Intra-Spot Alignment and Regional Context Fusion for Spatial Gene Expression Prediction from Histopathology，AAAI 2026  
**定位**：从 H&E 预测空间基因表达、spot 内异质性、邻域融合  
**建议投入**：先跑 HER2 的 2D 交叉验证；处理后数据入口尚未稳定开放。

**精读核验**：AAAI 2026，Vol. 40, No. 13，pp. 10630–10637；官方双数据集代码与论文表格已核验（2026-09-17）。

## 原文摘要

> Spatial transcriptomics bridges gene expression and tissue morphology but faces clinical adoption barriers due to technical complexity and prohibitive costs. Existing approaches often fail to capture biological heterogeneity within spots and are susceptible to morphological noise from surrounding tissue. HiFusion integrates Hierarchical Intra-Spot Modeling, which uses multi-resolution sub-patch decomposition and feature alignment, with Context-aware Cross-scale Fusion, which selectively incorporates regional context through cross-attention.

**摘要因果链**：误差来自 spot 内部被当成均匀块，以及 spot 外部邻域被无选择灌入。HISM 先形成可信的多尺度 spot 表示，CCF 再让邻域有选择地读取它。

## 论文 Pipeline 原图

![HiFusion 官方框架图](https://raw.githubusercontent.com/Advanced-AI-in-Medicine-and-Physics-Lab/HiFusion/main/assets/framework.jpg)

*图源：作者官方仓库 `assets/framework.jpg`。*

### 沿着图从左到右读

1. 同一 spot 有三条尺度支路：Level-0 看完整 224×224 spot，Level-1/2 看更细的非重叠子块；共享 ResNet-18。
2. 子块特征按原位置重排，\(L_{align}=\sum_{s=1}^{2}\|\tilde F_s^S-F_0^S\|_1\) 迫使细尺度保留完整 spot 语义。
3. 三层特征经可学习 softmax 权重融合，不是简单 concat。
4. 448×448 邻域由 ResNet-10 压成 Query，spot 多尺度 token 作 K/V；因此模型学的是“邻域需要从 spot 读取什么”。
5. 输出保留 Query 残差后回归 250 个基因，注意力不可靠时仍有区域表示保底。

### 证据与边界

- HER2 2D 结果 0.5459 MSE / 0.5699 MAE / 0.4961 PCC，三个指标同时改善。
- 3D 协议是同一患者首层训练、其余层测试，测患者内跨切片泛化，不能与 2D 跨患者结果混读。
- 邻域约 2× spot 最佳，继续增大反而下降，直接支持“更多上下文不等于更多有效信息”。


## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

一个空间转录组 spot 像一小块街区，里面住着不同细胞。HiFusion 先把街区拆成更小的格子看清楚，再向四周看一眼，但只吸收和自己有关的邻居。

### 0.2 它为什么出现？

只看整个 spot 会把内部细胞类型混在一起；把邻域裁到 1000 像素以上，又容易把无关组织当上下文。

### 0.3 它到底怎么做？

1. 以 spot 为中心裁 224×224。
2. 再拆成 2×2 与 7×7 子块，用共享编码器提多尺度特征。
3. 用对齐损失让细尺度仍记住 spot 全局语义。
4. 邻域 448×448 作为 query，对融合后的 spot 特征做残差交叉注意力，回归基因表达。

### 0.4 先认清这些词

- **spot**：空间转录组的一个测量点，常混合多个细胞。
- **HISM**：spot 内分层建模。
- **CCF**：用邻域选择性地融合 spot 多尺度特征。
- **3D sample-specific**：同一患者第一层训练、其余层测试。

### 0.5 输入和输出

输入是 H&E 上的 spot 图和邻域图；输出是该 spot 的基因表达向量（论文取表达量最高的 250 个基因）。

### 0.6 最容易误解的地方

这是“只看 H&E 预测表达”，推理期不需要空间转录组。但它仍用 ST 标签训练，不是无监督发现新基因。

**现在只记住一句话：HiFusion = 先看清 spot 内部，再有选择地看邻居。**

## 1. 三分钟摘要与推荐理由

HiFusion 把空间基因表达预测拆成两件事：spot 并不是均匀的；更大邻域也不总是更好。HISM 用 1×1 / 2×2 / 7×7 分解加特征对齐；CCF 让邻域 token 查询融合后的 spot token。HER2 的 2D 交叉验证达到 MSE / MAE / PCC = 0.5459 / 0.5699 / 0.4961，优于 TRIPLEX 与 ASIGN。邻域消融表明 2 倍 spot 尺寸最好，继续放大反而变差。

它直接接在 [HE2RNA](33-he2rna.md) 和 [Path2Space](19-path2space.md) 的“形态预测分子”线上，并明确反对“邻域越大越好”。

## 2. 问题及研究位置

ST-Net 把每个 spot 当独立回归；HisToGene / Hist2ST 加入长程依赖；TRIPLEX / ASIGN 引入大邻域或 3D 对齐。HiFusion 认为缺的是 spot 内层级，以及邻域必须被当成可选择的 query，而不是硬拼接。

## 3. 核心方法和数据流

```text
spot 224×224 → ResNet-18 → F0
     → 2×2 / 7×7 子块 → 同编码器 → 对齐到 F0
邻域 448×448 → ResNet-10 → 区域 query
     → 多尺度加权融合 → 2×2 token
     → 残差交叉注意力 → 250 维表达
```

总损失 = 主回归 + 多尺度辅助回归 + 对齐项，\(\lambda=1\)。

## 4. 实验、数据集与指标

HER2：36 张 WSI、13,620 spots；ST-Data：16 例三层切片、41,544 spots。基因为表达量最高的 250 个。两种协议：患者隔离的 4 折 2D，以及患者内第一层训练、其余层测试的 3D。单卡 RTX 4090，Adam，50 epoch，batch 32。3D 上相对 ST-Net 约 22–25% 改善；作者还指出 ASIGN-3D 的全局配准可能损害结构。

## 5. 代码仓库审计

- 评级：**B**。`HER2-code/` 与 `STData-code/` 各有 `hifusion.py`、`losses.py`、`2d_main.py`、`3d_main.py`。
- README 写明处理后数据 “coming soon”，目前不能从仓库一键复现表格。
- 代码基于 ASIGN；关键实现是多尺度分解、对齐损失和残差交叉注意力。

## 6. 环境、显存与数据

单卡 4090 足够。数据需按 README 放到 `data/`。基因列表在补充材料；表达先做 spot 内归一化再 log。

## 7. 建议复现路径

1. **最小测试**：用 HER2 代码构造假 batch，检查多尺度对齐与回归头。
2. **标准实验**：患者隔离 4 折，复现 HER2 的 MSE/MAE/PCC。
3. **扩展实验**：固定 HISM，只改邻域尺寸，画出噪声—上下文曲线。

## 8. 代码阅读顺序

`README.md` → `HER2-code/models/hifusion.py` → `HER2-code/models/losses.py` → `HER2-code/dataloader.py` → `HER2-code/2d_main.py` → `3d_main.py`。

## 9. 可借鉴思想

- spot 内分解能补细胞级异质性，不必先上超分辨率 ST。
- 邻域应当查询 spot，而不是把大图直接拼进去。
- 患者内 3D 协议比跨患者硬配准更接近临床连续切片。

## 10. 局限、风险与课题切入点

只预测 250 个高表达基因；处理后数据未稳定公开；H&E 预测不能替代真实 ST。可研究 Visium HD 更细 spot、跨平台迁移，以及与 [SpaCRD](25-spacrd.md) 检测任务的组合。

## 11. 前后关联

它把 [HE2RNA](33-he2rna.md) 的整张切片转录组预测落到空间 spot，并与 [HESCAPE](17-hescape.md)、[Path2Space](19-path2space.md) 构成 2025–2026 空间组学主线。

## 12. 链接

- [AAAI 论文页](https://ojs.aaai.org/index.php/AAAI/article/view/38036)
- [官方代码](https://github.com/Advanced-AI-in-Medicine-and-Physics-Lab/HiFusion)
- [arXiv](https://arxiv.org/abs/2511.12969)
