# 05｜DTFD-MIL：小队列下用伪包和双层蒸馏稳定训练

**论文**：DTFD-MIL: Double-Tier Feature Distillation Multiple Instance Learning for Histopathology Whole Slide Image Classification，CVPR 2022  
**定位**：MIL、伪包、特征蒸馏  
**建议投入**：在 DSMIL 后立即复现；适合成为统一 MIL benchmark 的第二个模型。

**精读核验**：CVPR 2022，pp. 18802–18812；官方仓库提供 CAMELYON16 train/test 特征、48个测试 mask 的下载说明和 TCGA-Lung 特征入口（2026-09-01）。

## 原文摘要

> Multiple instance learning (MIL) has been increasingly used in the classification of histopathology whole slide images (WSIs). However, MIL approaches for this specific classification problem still face unique challenges, particularly those related to small sample cohorts. In these, there are limited number of WSI slides (bags), while the resolution of a single WSI is huge, which leads to a large number of patches (instances) cropped from this slide. To address this issue, we propose to virtually enlarge the number of bags by introducing the concept of pseudo-bags, on which a double-tier MIL framework is built to effectively use the intrinsic features. Besides, we also contribute to deriving the instance probability under the framework of attention-based MIL, and utilize the derivation to help construct and analyze the proposed framework. The proposed method outperforms other latest methods on the CAMELYON-16 by substantially large margins, and is also better in performance on the TCGA lung cancer dataset. The proposed framework is ready to be extended for wider MIL applications. The code is available at: https://github.com/hrzhang1123/DTFD-MIL

*来源：arXiv:2203.12081（https://arxiv.org/abs/2203.12081）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![DTFD-MIL 论文框架图](/papers/pathology/05-dtfd-mil-pipeline.png)

> **原文图注**：Figure 1 : Illustration of the difference between conventional MIL models and the proposed double-tier MIL model.

*图源：https://arxiv.org/html/2203.12081v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

一个班有几千名学生，老师没法一次听完所有人发言。DTFD-MIL 先把学生分成小组，每组交一份摘要，再根据各组摘要给全班下结论。

### 0.2 它为什么出现？

WSI 数量可能不多，但每张 WSI 有海量 patch。直接用少量巨大 bag 训练容易不稳定，随机丢 patch 又可能漏掉小病灶。

### 0.3 它到底怎么做？

1. 把一张切片的 patch 分成多个伪包（pseudo-bag）。
2. 第一层 MIL 分别处理每个伪包。
3. 从每个伪包提炼一个代表特征，而不是保留所有 patch。
4. 第二层 MIL 汇总这些伪包代表，输出原切片预测。

### 0.4 先认清这些词

- **pseudo-bag**：从一个大 bag 中分出的临时小袋子。
- **蒸馏特征**：从一组 patch 中压缩出的代表信息。
- **双层**：先在小组内汇总，再在小组之间汇总。
- **弱监督**：只有整张切片标签，没有每个 patch 的精确标签。

### 0.5 输入和输出

输入是一个超大的 patch 特征集合；输出是切片类别。中间产物是若干伪包摘要。

### 0.6 最容易误解的地方

伪包能增加训练单元，但如果分组恰好漏掉稀少病灶，摘要仍可能失真。

**现在只记住一句话：DTFD-MIL = 大袋拆小袋，小袋先总结，再做总总结。**

## 1. 三分钟摘要与推荐理由

WSI 数据经常出现“患者/切片少，但每张切片 patch 极多”的不平衡。DTFD-MIL 将一个大 bag 拆成多个 pseudo-bag，在第一层 MIL 中提炼伪包表征，再在第二层完成原切片预测。它相当于虚拟增加 bag 数量，同时把超长实例集合压缩成更稳定的中间表示。

## 2. 问题及研究位置

直接用少量大 bag 训练复杂聚合器容易过拟合，随机采样又可能漏掉少量病灶。DTFD-MIL 的核心问题是如何在小样本队列中提高有效训练单元数量，而不是单纯增加模型深度。

## 3. 核心方法和数据流

```text
WSI feature bag → 随机/规则分成 pseudo-bags
第一层 MIL → 伪包预测与蒸馏特征
所有伪包特征 → 第二层 MIL → slide prediction
```

第一层不是简单平均：作者从 attention-based MIL 推导实例概率，并提出不同蒸馏策略，包括取最大注意实例、最大/最小实例组合和 attention-weighted feature。第二层再把每个 pseudo-bag 的蒸馏向量视作新实例。于是原本“少量超大 bag”的问题被转换为“更多较小 bag + 一个上层 bag”。

## 4. 实验、数据集与指标

论文在 CAMELYON16 与 TCGA 肺癌任务上验证，关注小队列条件下的性能。阅读时重点看 pseudo-bag 数量、蒸馏策略和 attention-derived instance probability 的消融。

## 5. 代码仓库审计

- 评级：**B+**；MIT 许可证。
- 核心训练、patch 生成、特征提取代码和 `save_model/model.pth` 均存在。
- README 指定 Python 3.6、PyTorch 1.4，属于旧环境；建议先做兼容性测试。
- 关键文件：`Main_DTFD_MIL.py`、`Model/Attention.py`、`Model/network.py`、`main_Extract_PerSlide.py`。
- README 仍标注 `On Updating`，没有完整环境锁文件或一键复现实验表；公开 `model.pth` 的精确 split/seed 需单独核验。

## 6. 环境、显存与数据

使用预提取特征时单卡足够；完整流程还需要 patch 生成和 ResNet 特征。仓库没有统一环境文件，需根据 README 的旧版本建立隔离环境。

## 7. 建议复现路径

1. **最小测试**：加载仓库提供的 `model.pth`，确认网络结构和一个 batch 的输出形状。
2. **标准实验**：在 CAMELYON16 固定 DSMIL 特征与患者划分，只替换 DTFD 聚合器。
3. **扩展实验**：系统改变 pseudo-bag 数量、实例采样和不同 encoder，报告均值、方差与训练耗时。

## 8. 代码阅读顺序

`README.md` → `Main_DTFD_MIL.py` → `Model/Attention.py` → `Model/network.py` → `utils.py` → `main_Extract_PerSlide.py` → `Patch_Generation/`。

## 9. 可借鉴思想

- 大 bag 可以通过中间语义单元分层处理。
- 伪包既是数据增广，也是计算图和监督粒度设计。
- 小队列方法应报告对分包随机性的敏感性。

## 10. 局限、风险与课题切入点

随机分包可能破坏空间邻域，也可能让稀有病灶只落入少数伪包。可研究病理结构感知的伪包构造、分包不确定性，以及在不同阳性面积比例下的鲁棒性。

**标准协议建议：**每个 epoch 的分包随机种子、pseudo-bag 数量、蒸馏策略必须入日志；在相同患者 folds 和相同 encoder 特征上与 DSMIL 比较，并报告多次分包的方差，而不是只保留最佳一次。

## 11. 前后关联

与 [DSMIL](03-dsmil.md) 比较关键实例机制，再读 [MambaMIL](14-mambamil.md) 理解线性复杂度长序列建模。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2022/html/Zhang_DTFD-MIL_Double-Tier_Feature_Distillation_Multiple_Instance_Learning_for_Histopathology_Whole_CVPR_2022_paper.html)
- [官方代码](https://github.com/hrzhang1123/DTFD-MIL)
