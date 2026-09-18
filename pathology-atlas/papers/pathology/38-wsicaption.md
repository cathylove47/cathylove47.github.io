# WsiCaption：从整张切片生成病理报告

## 原文摘要

> Whole slide images are the foundation of digital pathology for the diagnosis and treatment of carcinomas. Writing pathology reports is laborious and error-prone for inexperienced pathologists. To reduce the workload and improve clinical automation, we investigate how to generate pathology reports given whole slide images. On the data end, we curated the largest WSI-text dataset (PathText). In specific, we collected nearly 10000 high-quality WSI-text pairs for visual-language models by recognizing and cleaning pathology reports which narrate diagnostic slides in TCGA. On the model end, we propose the multiple instance generative model (MI-Gen) which can produce pathology reports for gigapixel WSIs. We benchmark our model on the largest subset of TCGA-PathoText. Experimental results show our model can generate pathology reports which contain multiple clinical clues and achieve competitive performance on certain slide-level tasks. We observe that simple semantic extraction from the pathology reports can achieve the best performance (0.838 of F1 score) on BRCA subtyping surpassing previous state-of-the-art approaches. Our collected dataset and related code are available.

*来源：arXiv:2311.16480（https://arxiv.org/abs/2311.16480）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![WsiCaption 论文框架图](/papers/pathology/38-wsicaption-pipeline.png)

> **原文图注**：Figure 1 : The pipeline of extracting WSI-text pairs from TCGA. We first get raw PDF files and then OCR is used to transform the characters into text. Finally, we resort to LLMs to summarize the text.

*图源：https://arxiv.org/html/2311.16480v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

传统 WSI 分类像只填写一个诊断选项；WsiCaption 希望根据整张切片写出包含多个临床线索的短报告。

### 0.2 它为什么出现？

病理报告比单个类别包含更多信息，但公开病理图文数据多是 patch—短描述，缺少诊断级 WSI—报告配对。

### 0.3 它到底怎么做？

1. 将 TCGA 诊断 WSI 与 PDF 病理报告配对。
2. 经 OCR、LLM 摘要和质量分类器构造 PathText。
3. 冻结 visual extractor，将 WSI 转成超长 patch token 序列。
4. 用带二维多尺度位置模块的 Transformer encoder–decoder 生成报告。

### 0.4 先认清这些词

- **PathText**：由 TCGA WSI 与清洗后病理报告组成的数据集。
- **MI-Gen**：把 WSI 作为多实例输入、文本作为序列输出的生成模型。
- **NLL**：自回归文本生成常用的负对数似然损失。
- **FactEnt**：关注生成文本临床实体事实性的指标之一。

### 0.5 输入和输出

输入是 WSI patch features；输出是自然语言病理报告，也可从报告中抽取乳腺癌亚型或 HER2 语义。

### 0.6 最容易误解的地方

报告语言流畅不等于事实正确；BLEU/ROUGE 衡量词序重叠，不能替代病理医师核验或严重错误率。

**现在只记住一句话：WsiCaption = 用 PathText 和 MI-Gen 将 WSI 弱监督从单标签分类扩展到报告生成。**

## 1. 三分钟摘要与推荐理由

WsiCaption 的核心贡献一半是模型，一半是数据工程。PathText 收集 9,009 个 WSI—文本对；MI-Gen 用位置感知的多实例 encoder–decoder 生成报告。它为后续 SlideChat、CPath-Omni 和病理 VLM 提供重要前史，也暴露了 OCR、LLM 清洗和文本标签泄漏的系统风险。

## 2. 论文解决的问题及其研究位置

分类 MIL 只能输出有限标签，而真实病理报告同时描述形态、亚型、大小、比例和分子检测。WsiCaption 位于 patch caption 与 WSI 助手之间：它尚不是通用对话模型，但首次系统构建诊断 WSI 与长文本的配对和生成流程。

## 3. 核心方法和数据流

```text
TCGA PDF reports → OCR → LLM summary → quality classifier → PathText
TCGA WSI → non-overlap 256 patches → frozen ResNet/ViT/HIPT
         → Transformer encoder + hierarchical 2D PAM
         → autoregressive decoder → pathology report
```

PAM 将 padding 后的一维 token reshape 为二维，用 3、7、13 大小的卷积核捕获多尺度空间关系，并汇合各 encoder 层的隐藏状态。

## 4. 关键实验、数据集与指标

- PathText：9,009 个 WSI—text pairs。
- BRCA generation split：845 train / 98 val / 98 test。
- HIPT-ViT + MI-Gen：BLEU-1/2/3/4 为 0.446/0.286/0.183/0.120，METEOR 0.171，ROUGE 0.271，FactEnt 0.532。
- 从生成报告抽取语义：BRCA subtype F1 0.838，高于 CLAM-SB 0.823、TransMIL 0.806。
- HER2 F1 0.678，略高于 TransMIL 0.670。

这些结果证明文本能承载下游信号，但不能据此断言模型可自动签发临床报告。

## 5. 官方代码仓库审计

复现评级 **B+**。仓库提供 OCR、数据说明、PathText 下载、TCGA-BRCA 预提取 features、模型、baselines、训练/测试入口和 checkpoint。优点是数据链较完整；风险是部分资源依赖网盘，OCR/LLM 清洗版本和原始报告 provenance 需要自行记录。

## 6. 环境、显存、存储和数据准备要求

论文的生成模型使用 4×A100 80GB；冻结 visual extractor 后仍需处理每张 WSI 超过 10k token 的长序列。最低成本路径是使用公开 BRCA features 与 caption JSON，只复现生成器。完整 PathText 重建还需 TCGA WSI、PDF、OCR、LLM 和质量过滤。

## 7. 建议复现路径

1. **最小测试**：下载公开 ResNet50 features、caption 和 checkpoint，对单个病例生成文本。
2. **标准实验**：复现 BRCA split 的 BLEU、ROUGE、METEOR、FactEnt。
3. **事实性审计**：随机抽取病例，对照原 PDF 标注错误实体、遗漏和幻觉，而非只看 n-gram 指标。
4. **外部验证**：在非 TCGA 报告模板和不同医院 WSI 上测试，观察文本 shortcut 是否失效。

## 8. 建议代码阅读顺序

`README.md` → `ocr/` → PathText 数据格式 → `models/` → `modules/` 中位置模块 → `main.py` → `baselines/`。

## 9. 值得借鉴的思想与可迁移组件

- 数据构建链本身应作为模型的一部分审计。
- 文本可作为丰富监督，但必须保留原报告、OCR、摘要和过滤结果的数据谱系。
- 临床生成任务应报告实体级事实性和危害性错误，而不只报告语言相似度。

## 10. 局限、复现风险和博士课题切入点

OCR 与 LLM 摘要会产生级联错误；人工质量集只有 88 对；主要生成评估限于 TCGA-BRCA；单张二维 WSI 无法可靠推断真实三维病灶尺寸。可研究可追溯报告生成、证据 patch 对齐、拒答机制、病理医师盲评和多中心报告风格迁移。

## 11. 与前后论文的关联

先读 MI-Zero 理解图文对齐，再读 WsiCaption 的 WSI-to-text，最后进入 SlideChat/CPath-Omni 的指令学习和 WSI-Agents 的多模型核验。它们的共同难点不是语言流畅度，而是视觉证据是否足够。

## 12. 官方链接

- [MICCAI 官方 PDF](https://papers.miccai.org/miccai-2024/paper/0761_paper.pdf)
- [Springer DOI](https://doi.org/10.1007/978-3-031-72083-3_51)
- [官方代码与数据](https://github.com/cpystan/Wsi-Caption)
