# 04｜HIPT：用层级 Transformer 对齐病理图像的多尺度结构

**论文**：Scaling Vision Transformers to Gigapixel Images via Hierarchical Self-Supervised Learning，CVPR 2022  
**定位**：层级自监督、patch—region—slide 表征  
**建议投入**：先用预训练表征做下游任务，再考虑完整预训练。

**精读核验**：CVPR 2022 Oral；预训练覆盖33癌种、10,678张 WSI、408,218个4096×4096区域和约1.04亿个256×256 patch（2026-09-01）。

## 原文摘要

> Vision Transformers (ViTs) and their multi-scale and hierarchical variations have been successful at capturing image representations but their use has been generally studied for low-resolution images (e.g. - 256x256, 384384). For gigapixel whole-slide imaging (WSI) in computational pathology, WSIs can be as large as 150000x150000 pixels at 20X magnification and exhibit a hierarchical structure of visual tokens across varying resolutions: from 16x16 images capture spatial patterns among cells, to 4096x4096 images characterizing interactions within the tissue microenvironment. We introduce a new ViT architecture called the Hierarchical Image Pyramid Transformer (HIPT), which leverages the natural hierarchical structure inherent in WSIs using two levels of self-supervised learning to learn high-resolution image representations. HIPT is pretrained across 33 cancer types using 10,678 gigapixel WSIs, 408,218 4096x4096 images, and 104M 256x256 images. We benchmark HIPT representations on 9 slide-level tasks, and demonstrate that: 1) HIPT with hierarchical pretraining outperforms current state-of-the-art methods for cancer subtyping and survival prediction, 2) self-supervised ViTs are able to model important inductive biases about the hierarchical structure of phenotypes in the tumor microenvironment.

*来源：arXiv:2206.02647（https://arxiv.org/abs/2206.02647）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![HIPT 论文框架图](/papers/pathology/04-hipt-pipeline.jpg)

> **原文图注**：Figure 2 : HIPT Architecture. Motivated by the use of hierarchical representations in natural language processing, where embeddings can be aggregated at the character-, word-, sentence- and paragraph-level to form document representations, we aggregate visual tokens at the x 16 \textbf{x}_{16} cell-, x 256 \textbf{x}_{256} patch-, x 4096 \textbf{x}_{4096} region-level to form slide representations. To also model important dependencies between visual concepts at each stage, we adapt Transformer self-attention as a permutation-equivariant aggregation layer. Note that since the complexity of patching x 4096 \textbf{x}_{4096} regions with x 256 \textbf{x}_{256} tokens is the same as patching x 256 \textbf{x}_{256} images with x 16 \textbf{x}_{16} tokens, we can pretrain aggregation layers for high-resolution images using similar self-supervised ViT techniques for low-resolution images.

*图源：https://arxiv.org/html/2206.02647v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

看城市地图时，你会先看街道，再看街区，最后看整座城市。HIPT 也分层看切片：小 patch 看细胞，较大 region 看组织结构，再用于整张切片判断。

### 0.2 它为什么出现？

只把所有小块混在一起，会丢掉“谁和谁挨着”的局部结构；让一个 Transformer 一次看完数万个小块，又太贵。

### 0.3 它到底怎么做？

1. 先把 WSI 切成 256×256 的小 patch。
2. 第一个 ViT 学会描述每个小 patch。
3. 把相邻 patch 组成 4096×4096 的大区域，再由第二个 ViT 描述区域。
4. 用这些区域表示完成切片分类或生存预测。

### 0.4 先认清这些词

- **层级**：先处理小单位，再把小单位组合成大单位。
- **自监督**：不用人工类别标签，从图像自身构造学习任务。
- **ViT**：把图像分块后用 Transformer 处理的视觉模型。
- **region**：由许多相邻 patch 组成的较大组织区域。

### 0.5 输入和输出

输入是多尺度切片图像块；输出是 patch、region 或 slide 的数字表示，供下游任务使用。

### 0.6 最容易误解的地方

层级结构像医生的缩放阅读方式，但固定方格不等于真实的细胞群或组织边界。

**现在只记住一句话：HIPT = 用“街道—街区—城市”三级视角理解超大切片。**

## 1. 三分钟摘要与推荐理由

HIPT 不把 WSI 当成一条平坦 patch 序列，而是先在小 patch 上学习局部表征，再把一组 patch 组成更大区域并学习区域级表征，最后用于切片级分类和生存预测。这种层级结构更接近病理医生从细胞形态到组织结构再到整张切片的阅读方式。

## 2. 问题及研究位置

平坦 MIL 容易忽略 patch 的空间邻域；直接对数万 token 做全局 Transformer 又过于昂贵。HIPT 用分层自监督学习在计算量和多尺度上下文之间折中，是后来多尺度 WSI 模型的重要参照。

## 3. 核心方法和数据流

```text
256×256 patch → ViT_256 局部 token
4096×4096 region 内的 patch tokens → ViT_4096 区域表征
多个区域表征 → 弱监督分类 / 生存模型
```

## 4. 实验、数据集与指标

论文在多种 TCGA 癌种上进行亚型分类和生存预测，并用 attention 检查不同层级捕获的形态模式。重点看层级表征相对 patch 平均和常见 MIL/GCN 聚合的贡献。

论文共评价9个 slide-level 任务。层级结构固定为16×16视觉 token → 256×256 patch → 4096×4096 region → slide；因此 HIPT 的创新不仅是更大 ViT，而是把注意力计算限制在嵌套窗口中。

## 5. 代码仓库审计

- 评级：**B**。预训练、分类、生存三个阶段的代码与结果文件存在。
- 许可证为 **Apache-2.0 with Commons Clause**，不授予出售软件或以其核心功能收费提供服务的权利。
- 仓库结构较重，且混合脚本与 notebook；它更像研究快照而非现代软件包。
- 关键文件：`1-Hierarchical-Pretraining/vision_transformer.py`、`vision_transformer4k.py`、`main_dino.py`、`main_dino4k.py`。
- 仓库通过 Git LFS 管理 checkpoint、patch/slide embedding 与演示图像，README 标注整体约4.08 GiB；普通浅克隆不一定拿到这些资产。

## 6. 环境、显存与数据

完整层级 DINO 预训练需要多卡和大量 TCGA patch；下游 notebook 和预计算结果更容易启动。存储通常比聚合器显存更早成为瓶颈。

## 7. 建议复现路径

1. **最小测试**：先阅读并运行 `2-Weakly-Supervised-Subtyping/Model Walkthrough.ipynb`。
2. **标准实验**：在一个 TCGA 亚型任务上复用现有层级特征和患者划分。
3. **扩展实验**：保持下游头相同，比较仅 patch 特征、区域特征和完整层级特征。

## 8. 代码阅读顺序

`vision_transformer.py` → `vision_transformer4k.py` → `main_dino.py` → `main_dino4k.py` → `Model Walkthrough.ipynb` → `utils/core_utils.py` → 生存 notebook。

## 9. 可借鉴思想

- 尺度不是简单的数据增强，而是表征层级。
- 预训练目标应与病理中的局部—区域结构对应。
- 下游实验必须分清 encoder、区域聚合和任务头各自贡献。

## 10. 局限、风险与课题切入点

固定网格可能切断真实组织单元；层级越多，预处理误差越会传递。可研究以细胞群落或组织分区为边界的自适应层级 token，以及在不同扫描倍率下保持一致的表示。

**复现警告：**HIPT 的预训练数据来自 TCGA，而多数下游任务也来自 TCGA。使用公开权重时必须声明 cohort overlap，最好增加不含预训练重叠的外部队列；否则不能把收益全部归因于层级归纳偏置。

## 11. 前后关联

读完后比较 [PANTHER](09-panther.md) 的“无序形态原型”和 [PathDino](13-pathdino.md) 的轻量 patch encoder。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2022/html/Chen_Scaling_Vision_Transformers_to_Gigapixel_Images_via_Hierarchical_Self-Supervised_Learning_CVPR_2022_paper.html)
- [官方代码](https://github.com/mahmoodlab/HIPT)
