# 12｜WSI-FiVE：用细粒度视觉—语义交互提升切片分类泛化

**论文**：Generalizable Whole Slide Image Classification with Fine-Grained Visual-Semantic Interaction，CVPR 2024  
**定位**：视觉—语义交互、WSI 分类、泛化  
**建议投入**：先用预提取特征和固定配置复现；端到端训练前先审计数据读取路径。

**精读核验**：CVPR 2024；论文报告在 TCGA-Lung few-shot 设置中相对对比方法至少提高9.19个百分点 accuracy。该数字属于特定 few-shot 协议，不代表所有任务的普遍增益（2026-09-01）。

## 原文摘要

> Whole Slide Image (WSI) classification is often formulated as a Multiple Instance Learning (MIL) problem. Recently, Vision-Language Models (VLMs) have demonstrated remarkable performance in WSI classification. However, existing methods leverage coarse-grained pathogenetic descriptions for visual representation supervision, which are insufficient to capture the complex visual appearance of pathogenetic images, hindering the generalizability of models on diverse downstream tasks. Additionally, processing high-resolution WSIs can be computationally expensive. In this paper, we propose a novel "Fine-grained Visual-Semantic Interaction" (FiVE) framework for WSI classification. It is designed to enhance the model's generalizability by leveraging the interaction between localized visual patterns and fine-grained pathological semantics. Specifically, with meticulously designed queries, we start by utilizing a large language model to extract fine-grained pathological descriptions from various non-standardized raw reports. The output descriptions are then reconstructed into fine-grained labels used for training. By introducing a Task-specific Fine-grained Semantics (TFS) module, we enable prompts to capture crucial visual information in WSIs, which enhances representation learning and augments generalization capabilities significantly. Furthermore, given that pathological visual patterns are redundantly distributed across tissue slices, we sample a subset of visual instances during training. Our method demonstrates robust generalizability and strong transferability, dominantly outperforming the counterparts on the TCGA Lung Cancer dataset with at least 9.19% higher accuracy in few-shot experiments. The code is available at: https://github.com/ls1rius/WSI_FiVE.

*来源：arXiv:2402.19326（https://arxiv.org/abs/2402.19326）。逐字原文，未改写、未压缩。*

## 中文摘要

> 全切片图像（WSI）分类通常被表述为一个多实例学习（MIL）问题。近来，视觉—语言模型（VLMs）在 WSI 分类中展现出显著的表现。然而，现有方法利用粗粒度的病理描述来监督视觉表示，这些描述不足以捕捉病理图像复杂的视觉外观，从而阻碍了模型在多样下游任务上的泛化能力。此外，处理高分辨率 WSIs 的计算开销可能很高。在本文中，我们提出了一种新颖的“细粒度视觉—语义交互”（FiVE）框架，用于 WSI 分类。它旨在通过利用局部化视觉模式与细粒度病理语义之间的交互，来增强模型的泛化能力。具体而言，借助精心设计的查询，我们首先利用一个大型语言模型，从各种非标准化的原始报告中提取细粒度的病理描述。随后，输出的描述被重构为用于训练的细粒度标签。通过引入任务特定细粒度语义（TFS）模块，我们使 prompt 能够捕捉 WSIs 中关键的视觉信息，这增强了表示学习，并显著提升了泛化能力。此外，鉴于病理视觉模式在组织切片中冗余地分布，我们在训练期间只采样视觉实例的一个子集。我们的方法展现出稳健的泛化能力与强大的迁移能力，在 TCGA Lung Cancer 数据集上，于少样本实验中以至少高出 9.19% 的 accuracy 显著优于对比方法。代码可在以下地址获取：https://github.com/ls1rius/WSI_FiVE。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![WSI-FiVE 论文框架图](/papers/pathology/12-wsi-five-pipeline.png)

> **原文图注**：Figure 2 : Left: The structure of the FiVE framework. The model consists of a frozen image encoder, a text encoder, and the TFS module. Whole slide images are divided into instances for embedding extraction by the image encoder. Raw pathological reports are standardized by GPT-4 into fine-grained descriptions. The fine-grained descriptions and manual prompts are sampled, shuffled, and reconstructed in pairs. These prompts aggregate instances into bag-level features, subsequently aligned with the descriptions utilizing contrastive loss. Top Right: Fine-grained pathological descriptions. The fine-grained pathological descriptions are generated from multiple answers based on specific queries. These descriptions undergo a process of random sampling, shuffling, and reconstruction to form a unified sentence. Bottom Right: The Instance Aggregator module. The instance aggregator consists of a self-attention module and a cross-attention module, fusing image instance embeddings and prompt embeddings to create bag-level features.

*图源：https://arxiv.org/html/2402.19326v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

只看图片像做没有题目的看图考试；WSI-FiVE 把疾病文字提示也带进来，让每个图像小块知道应该寻找什么线索。

### 0.2 它为什么出现？

只用切片标签训练，模型可能记住染色或医院差异；只在最后拼接一段文字，又无法指导具体 patch 的选择。

### 0.3 它到底怎么做？

1. 把 WSI 转成一组视觉 token。
2. 从报告或类别描述中提取细粒度病理语义。
3. 让文字 token 与局部视觉 token 多次交互。
4. 融合得到切片表示并完成分类。

### 0.4 先认清这些词

- **细粒度**：不是只说“癌症”，而是描述核形态、结构、分化等具体线索。
- **视觉—语义交互**：让图像特征和文字特征相互查询。
- **泛化**：换数据集、医院或任务后仍能工作。
- **prompt**：提供给模型的文字任务或类别说明。

### 0.5 输入和输出

输入是 WSI patch 特征与病理语义文字；输出是切片类别。

### 0.6 最容易误解的地方

文字可以提供知识，也可能带来标签捷径；必须确认测试信息没有泄漏到提示生成流程。

**现在只记住一句话：WSI-FiVE = 用细致的病理文字指导每个 patch 找证据。**

## 1. 三分钟摘要与推荐理由

WSI-FiVE 将病理报告/类别语义与 patch 视觉特征进行细粒度交互，而不是只在最后拼接一个文本向量。它希望通过文本提供的疾病语义，提高模型在不同数据和任务上的泛化能力。

这篇论文适合与 MI-Zero 对照：MI-Zero 强调无需目标标签的零样本迁移，WSI-FiVE 更强调有训练过程的细粒度视觉—语义建模。

## 2. 问题及研究位置

只用 slide label 训练的 MIL 容易记住中心/染色偏差；通用视觉语言模型又缺乏 WSI 级聚合。WSI-FiVE 尝试让每个 patch 与病理语义发生交互，再形成切片决策。

## 3. 核心方法和数据流

```text
WSI / precomputed patches → visual tokens
病理报告或类别描述 → text tokens
FiVE fine-grained interaction + patch fusion → slide representation → classification
```

语义并非直接使用原始报告：作者先用设计好的 queries 让大语言模型从非标准报告中抽取细粒度病理描述，再重构为训练标签；Task-specific Fine-grained Semantics（TFS）模块再让 prompt 与局部视觉模式交互。这使 prompt 生成流程成为方法的一部分，而不是无关预处理。

## 4. 实验、数据集与指标

仓库提供 TCGA 肺癌与 CAMELYON16 数据表，并可下载 DSMIL 体系的预提取特征。评价应同时看同域性能和跨域/泛化设置，明确文本是否在测试时可获得。

## 5. 代码仓库审计

- 评级：**B-**。核心模型、配置、数据表、预处理 notebook 和训练入口存在。
- 根目录未发现许可证文件，不能默认代码可自由再发布或商用。
- 仓库含提交进来的 `__pycache__`，工程清洁度一般；README 指出不同 WSI 存储方式可能需要修改 `datasets/pipeline.py`。
- 关键文件：`models/FiVE.py`、`models/patch_fusion.py`、`datasets/pipeline.py`、`main.py`。

## 6. 环境、显存与数据

README 建议 Python 3.8.16，并给出双 GPU 分布式训练命令。端到端训练显存更高，README 建议按资源减少 `NUM_FRAMES`（例如约 2048）。预提取特征约需 30GB。

## 7. 建议复现路径

1. **最小测试**：检查 `configs/wsi/fix_pth*.yaml`、TCGA/CAMELYON16 CSV 和一个 batch 的视觉/文本形状。
2. **标准实验**：使用固定 patch 特征执行两卡训练，记录文本输入、patch 数和随机种子。
3. **扩展实验**：删除/打乱文本、使用不同报告生成方式，并做跨中心外部验证。

## 8. 代码阅读顺序

`README.md` → `configs/wsi/fix_pth.yaml` → `datasets/build.py` → `datasets/pipeline.py` → `models/FiVE.py` → `models/patch_fusion.py` → `main.py` → `gpt_preprocess/`。

## 9. 可借鉴思想

- 文本可以为 patch 聚合提供语义条件，而非只做最终融合。
- 泛化研究要明确训练/测试时文本可用性和生成来源。
- 对 GPT 生成的报告处理必须保存提示词、版本和人工审计规则。

## 10. 局限、风险与课题切入点

报告可能泄露标签，生成文本可能放大先验偏差；细粒度交互也增加计算成本。可研究无标签泄漏的语义构造、文本质量不确定性，以及语言先验与真实形态证据冲突时的拒绝机制。

**关键审计：**必须保存原始报告字段、LLM 提示词、模型版本和生成结果；检查语义标签中是否直接出现目标类别名称、分期或结论。删除/打乱细粒度语义应作为强制消融，否则泛化提升可能来自标签捷径。

## 11. 前后关联

先读 [MI-Zero](06-mi-zero.md)，再进入 [HistoSelect](15-histoselect.md) 的问题驱动 patch 选择。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Li_Generalizable_Whole_Slide_Image_Classification_with_Fine-Grained_Visual-Semantic_Interaction_CVPR_2024_paper.html)
- [官方代码](https://github.com/ls1rius/WSI_FiVE)
