# 08｜CellViT：从 WSI 分类下沉到可定位的细胞实例

**论文**：CellViT: Vision Transformers for Precise Cell Segmentation and Classification，Medical Image Analysis 2024  
**定位**：细胞核实例分割、细胞分类、WSI 推理  
**建议投入**：先用修复后的 checkpoint 对小型 WSI/patch 推理，再训练 PanNuke。

**精读核验**：Medical Image Analysis 94 (2024), Article 103143；论文在 PanNuke 报告 mean panoptic quality 0.50、F1-detection 0.83。官方 WSI 流程要求1024像素 patch、64像素重叠（6.25%）（2026-09-01）。

## 原文摘要

> Nuclei detection and segmentation in hematoxylin and eosin-stained (H&E) tissue images are important clinical tasks and crucial for a wide range of applications. However, it is a challenging task due to nuclei variances in staining and size, overlapping boundaries, and nuclei clustering. While convolutional neural networks have been extensively used for this task, we explore the potential of Transformer-based networks in this domain. Therefore, we introduce a new method for automated instance segmentation of cell nuclei in digitized tissue samples using a deep learning architecture based on Vision Transformer called CellViT. CellViT is trained and evaluated on the PanNuke dataset, which is one of the most challenging nuclei instance segmentation datasets, consisting of nearly 200,000 annotated Nuclei into 5 clinically important classes in 19 tissue types. We demonstrate the superiority of large-scale in-domain and out-of-domain pre-trained Vision Transformers by leveraging the recently published Segment Anything Model and a ViT-encoder pre-trained on 104 million histological image patches - achieving state-of-the-art nuclei detection and instance segmentation performance on the PanNuke dataset with a mean panoptic quality of 0.50 and an F1-detection score of 0.83. The code is publicly available at https://github.com/TIO-IKIM/CellViT

*来源：arXiv:2306.15350（https://arxiv.org/abs/2306.15350）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![CellViT 论文框架图](/papers/pathology/08-cellvit-pipeline.png)

> **原文图注**：Figure 2: Network structure of our proposed CellViT-network consisting of a ViT encoder connected to multiple decoders via skip connections. Postprocessing is used to separate overlapping nuclei and perform nuclei type classification. For visualization purposes, the tissue classification branch is not illustrated. As encoder networks, we used the pre-trained ViT 256 \text{ViT}_{256} and SAM models.

*图源：https://arxiv.org/html/2306.15350v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

不是只说“这片森林有问题”，而是把每棵树圈出来并标明树种。CellViT 会找出每个细胞核的边界，并判断它属于哪类细胞。

### 0.2 它为什么出现？

WSI 分类热图只能指出大概关注区域，不能直接回答“这里有多少肿瘤细胞、免疫细胞在哪里”。

### 0.3 它到底怎么做？

1. 把局部病理图像送进 ViT encoder。
2. 解码器同时预测细胞核区域、边界/距离信息和细胞类型。
3. 后处理把粘在一起的细胞核分开。
4. 输出每个细胞的位置、轮廓和类别，供空间分析使用。

### 0.4 先认清这些词

- **实例分割**：不仅分前景，还把相邻的每个对象分别编号。
- **细胞分类**：给分割出的细胞核判断类型。
- **decoder**：把压缩特征恢复成像素级预测的模块。
- **GeoJSON**：可保存细胞位置、轮廓和属性的地理式数据格式。

### 0.5 输入和输出

输入是病理 patch 或 WSI 区域；输出是每个细胞实例的轮廓、坐标和类别。

### 0.6 最容易误解的地方

细胞核形状不总能唯一决定细胞类型；跨染色、跨中心时必须重新验证。

**现在只记住一句话：CellViT = 把每个细胞核圈出来、分开来、再命名。**

## 1. 三分钟摘要与推荐理由

CellViT 将 ViT/SAM 类 encoder 放入 U-Net 风格的分割框架，同时预测细胞核实例和类别。它把“整张切片最终标签”下沉到可定位的细胞级表示，为细胞组成、空间图和可解释性研究提供基础。

## 2. 问题及研究位置

MIL 的 attention 只能告诉你模型关注哪里，不能直接给出细胞身份。CellViT 解决的是细胞实例边界与类型，为后续构建细胞图、肿瘤微环境表征和区域级 token 提供输入。

## 3. 核心方法和数据流

```text
patch / WSI → ViT encoder + U-Net-like decoder
核概率/距离图/类型预测 → 后处理 → cell instances + classes
可选 WSI pipeline → GeoJSON / downstream features
```

## 4. 实验、数据集与指标

主评估包含 PanNuke，并提供 MoNuSeg 等流程。关注 F1-detection、Panoptic Quality 和类别指标。仓库特别说明论文后修复过严重训练 bug，并重新上传 checkpoint；复现必须使用修复后的版本。

## 5. 代码仓库审计

- 评级：**A-**。环境、配置、训练、评价、WSI 预处理、checkpoint 与文档齐全。
- 根仓库声明 **Apache-2.0 with Commons Clause**；外部 SAM 权重、数据集和衍生组件仍应分别遵守各自条款。
- README 指定 Python 3.9.7、PyTorch 2.0，并说明 OpenSlide、cuCIM、pydantic 等兼容问题。
- 关键文件：`models/segmentation/cell_segmentation/cellvit.py`、`cell_segmentation/experiments/experiment_cellvit_pannuke.py`、`cell_segmentation/inference/`。

## 6. 环境、显存与数据

支持 mixed precision 和 batch size 调整；cuCIM 可加速 WSI 预处理。WSI 推理的 RAM、临时 patch 和输出 GeoJSON 可能很大，应先在少量切片估算存储。

## 7. 建议复现路径

1. **最小测试**：下载修复后 checkpoint，在示例/少量 patch 上运行推理并可视化实例边界。
2. **标准实验**：按 `docs/readmes/pannuke.md` 准备数据，用官方配置评价最新 checkpoint。
3. **扩展实验**：将细胞实例聚合为空间图，与纯 patch MIL 在相同患者任务上比较。

## 8. 代码阅读顺序

`README.md` → `docs/readmes/cell_segmentation.md` → `models/.../cellvit.py` → `experiment_cellvit_pannuke.py` → `cell_segmentation/trainer/` → `cell_segmentation/inference/` → `preprocessing/patch_extraction/`。

## 9. 可借鉴思想

- 细胞级结构可成为 WSI 的中间语义层。
- 发布后修复、checkpoint 版本和评价脚本属于科学可复现性的一部分。
- 输出应保留空间坐标，便于与 QuPath 和病理标注联动。

## 10. 局限、风险与课题切入点

核分割误差会传播到细胞图和患者预测；不同染色、倍率和组织的类别定义不一致。可研究不确定性感知的细胞 token、跨中心细胞分类校准，以及细胞级错误对 WSI 结论的影响。

**指标警告：**PQ 同时惩罚检测与分割质量，F1-detection 只反映实例匹配；复现必须固定实例匹配规则、类别映射和后处理阈值。只看 Dice 或一张可视化图不足以证明细胞级性能。

## 11. 前后关联

可把 CellViT 输出用于 [PANTHER](09-panther.md) 的原型思想或 [IIHGC](02-iihgc.md) 的图/超图结构。

## 12. 链接

- [期刊 DOI](https://doi.org/10.1016/j.media.2024.103143)
- [官方代码](https://github.com/TIO-IKIM/CellViT)
- [轻量推理仓库](https://github.com/TIO-IKIM/CellViT-Inference)
