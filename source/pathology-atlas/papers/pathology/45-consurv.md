# 45｜ConSurv：顺序学习新癌种时保住旧的多模态预后知识

**论文**：ConSurv: Multimodal Continual Learning for Survival Analysis，AAAI 2026  
**定位**：WSI—基因组生存预测、多模态持续学习、灾难性遗忘  
**建议投入**：先用作者提供的四癌种顺序与预提取特征复现单折；完整五折需要 A100 级环境。

**精读核验**：AAAI 2026，Vol. 40, No. 33，pp. 27899–27907；MIT 代码、MSAIL 配置与预处理数据入口已核验（2026-09-17）。

## 原文摘要

> Survival prediction of cancers is crucial for clinical practice, as it informs mortality risks and influences treatment plans. However, a static model trained on a single dataset fails to adapt to the dynamically evolving clinical environment and continuous data streams, limiting its practical utility. While continual learning (CL) offers a solution to learn dynamically from new datasets, existing CL methods primarily focus on unimodal inputs and suffer from severe catastrophic forgetting in survival prediction. In real-world scenarios, multimodal inputs often provide comprehensive and complementary information, such as whole slide images and genomics; and neglecting inter-modal correlations negatively impacts the performance. To address the two challenges of catastrophic forgetting and complex inter-modal interactions between gigapixel whole slide images and genomics, we propose ConSurv, the first multimodal continual learning (MMCL) method for survival analysis. ConSurv incorporates two key components: Multi-staged Mixture of Experts (MS-MoE) and Feature Constrained Replay (FCR). MS-MoE captures both task-shared and task-specific knowledge at different learning stages of the network, including two modality encoders and the modality fusion component, learning inter-modal relationships. FCR further enhances learned knowledge and mitigates forgetting by restricting feature deviation of previous data at different levels, including encoder-level features of two modalities and the fusion-level representations. Additionally, we introduce a new benchmark integrating four datasets, Multimodal Survival Analysis Incremental Learning (MSAIL), for comprehensive evaluation in the CL setting. Extensive experiments demonstrate that ConSurv outperforms competing methods across multiple metrics.

*来源：arXiv:2511.09853（https://arxiv.org/abs/2511.09853）。逐字原文，未改写、未压缩。*

## 中文摘要

> 癌症的生存预测对临床实践至关重要，因为它能提示死亡风险并影响治疗方案。然而，在单一数据集上训练的静态模型无法适应动态演变的临床环境与持续的数据流，限制了其实用性。虽然持续学习（CL）为从新数据集中动态学习提供了解决方案，但现有的 CL 方法主要关注单模态输入，并在生存预测中遭受严重的灾难性遗忘。在现实场景中，多模态输入往往提供全面且互补的信息，例如全切片图像与基因组学；而忽视模态间的相关性会对性能产生负面影响。为应对灾难性遗忘与千兆像素级全切片图像和基因组学之间复杂的模态间交互这两大挑战，我们提出 ConSurv，首个用于生存分析的多模态持续学习（MMCL）方法。ConSurv 包含两个关键组件：多阶段专家混合（Multi-staged Mixture of Experts，MS-MoE）与特征约束回放（Feature Constrained Replay，FCR）。MS-MoE 在网络的不同学习阶段捕捉任务共享与任务特定的知识，涵盖两个模态编码器与模态融合组件，学习模态间的关系。FCR 则通过在不同层级上限制既往数据的特征偏移来进一步增强已学知识并缓解遗忘，这些层级包括两个模态的编码器级特征与融合级表征。此外，我们引入一个新的基准，整合四个数据集，即多模态生存分析增量学习（Multimodal Survival Analysis Incremental Learning，MSAIL），用于在 CL 设定下进行全面评估。大量实验表明，ConSurv 在多个指标上优于竞争方法。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![ConSurv 论文框架图](/papers/pathology/45-consurv-pipeline.png)

> **原文图注**：Figure 2: Overall architecture of ConSurv. (a) The MMCL workflow for continual survival prediction across different cancer datasets. We employ a recent SOTA model, MoME ( Xiong et al. 2024a ) , in survival prediction as our backbone model. We train the model sequentially on the multimodal datasets. (b) MS-MoE learns both shared and task-specific knowledge at different learning stages of the network, including WSI and genomic encoders and the modality fusion component. (c) FCR preserves previously learned knowledge through additional loss terms on the replay buffer.

*图源：https://arxiv.org/html/2511.09853v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

医院依次接入膀胱癌、子宫癌、肺癌和乳腺癌数据。普通模型学新科室后会忘掉旧科室；ConSurv 给每个癌种一个路由，同时保存少量旧病例的中间表示来校准记忆。

### 0.2 它为什么出现？

静态模型无法持续适应新数据；直接顺序微调会灾难性遗忘。WSI 与基因组之间的关系还会随癌种改变，普通单模态持续学习方法不够。

### 0.3 它到底怎么做？

1. 顺序学习 BLCA、UCEC、LUAD、BRCA。
2. 在 WSI 编码器、基因组编码器和融合层加入稀疏共享专家。
3. 新癌种只新增路由器，专家既共享又保留任务偏好。
4. 回放少量旧样本，并约束三层旧特征不要漂移。

### 0.4 先认清这些词

- **持续学习**：数据分阶段到达，旧训练集不能完整重训。
- **灾难性遗忘**：学新任务后旧任务性能明显下降。
- **MS-MoE**：多阶段稀疏专家混合，每个任务有独立路由。
- **FCR**：回放旧样本并约束 patch、基因组、融合特征。

### 0.5 输入和输出

输入是 WSI patch 特征、基因组特征和癌种身份；输出是离散时间生存风险。推理时需要知道属于哪个癌种任务。

### 0.6 最容易误解的地方

这是 task-incremental 设置，不是未知癌种自动识别。推理时任务身份已知，不应把结果解释成完全开放环境中的持续学习。

**现在只记住一句话：ConSurv = 用任务路由学新癌种，再用多层特征回放防止忘掉旧癌种。**

## 1. 三分钟摘要与推荐理由

ConSurv 在 MoME 多模态生存模型的 WSI 编码器、基因组编码器和融合组件中插入 MS-MoE：固定专家池、一个始终启用的共享专家、每个癌种新增轻量路由。FCR 以 reservoir sampling 保存小型回放缓冲区，同时约束旧样本在 patch、基因组和融合三个层级的特征，并继续计算生存损失。

MSAIL 基准按 BLCA→UCEC→LUAD→BRCA 顺序训练。ConSurv 的平均 C-index 为 0.601、IPCW C-index 为 0.597；顺序微调分别为 0.572 和 0.528。它不是当前绝对最强的泛癌静态模型，而是首次系统测试多模态生存模型在连续数据流中的遗忘。

## 2. 问题及研究位置

联合重训成本高且旧数据未必可用；EWC、LwF、经验回放等方法通常忽略 WSI—基因组关系本身也会变化。ConSurv 把稳定—可塑性矛盾放到两个模态编码器和融合层同时处理。

## 3. 核心方法和数据流

```text
WSI patches + genomics → MoME 多模态骨干
patch encoder / genomic encoder / fusion 各插入 MS-MoE
当前癌种 ID → 专属 router → shared expert + Top-k experts
旧样本缓冲区 → 生存回放损失
旧/新模型的三层表示 → L2 特征约束
→ 当前与既往癌种风险预测
```

总损失为当前任务生存损失、三层特征约束与缓冲区回放损失之和。

## 4. 实验、数据集与指标

MSAIL 含 TCGA-BLCA 373、UCEC 480、LUAD 453、BRCA 955 例。指标为平均 C-index、IPCW C-index、forgetting、BWT 和 FWT。直接顺序微调后 BLCA C-index 从 0.607 降至 0.531。ConSurv 的平均 C-index 0.601，低于联合训练 0.611，但在可持续学习方法中最佳；四癌种 Kaplan–Meier 分组均有显著 log-rank p 值。

## 5. 代码仓库审计

- 评级：**B+**。MIT 许可，包含 ConSurv、主要基线、五折入口、配置和压缩后的基因组 CSV。
- 关键文件：`models/consurv.py`、`models/ms_moe.py`、`backbone/model_mome.py`、`datasets/seq_survival.py`、`main_wsi.py`。
- 仍需从 MoME/MCAT 获取 WSI 特征、基因组目录和 split；仓库保留较多通用持续学习框架与 deprecated 文件，阅读成本偏高。

## 6. 环境、显存与数据

官方测试为 Ubuntu 22.04、Python 3.12、A100 80 GB。默认 buffer size 32、每任务 20 epoch、五折。WSI 特征提取参考 MoME，数据根目录在 `datasets/configs/seq-survival/*.yaml` 配置。

## 7. 建议复现路径

1. **最小测试**：用 `test_short.yaml` 跑通一个短序列，检查路由扩展和缓冲区更新。
2. **标准实验**：单折复现 finetune、ER 与 ConSurv，再扩到五折。
3. **扩展实验**：交换癌种顺序、缩小 buffer，并报告每个历史任务的性能轨迹而非只报最终平均。

## 8. 代码阅读顺序

`models/config/consurv.yaml` → `models/ms_moe.py` → `models/consurv.py` → `backbone/model_mome.py` → `datasets/seq_survival.py` → `main_wsi.py`。

## 9. 可借鉴思想

- 多模态持续学习应约束各模态和融合层，而非只蒸馏最终 logits。
- 固定专家、按任务新增路由可控制参数增长。
- 必须同时报告最终性能和遗忘，单看一个指标会掩盖稳定—可塑性取舍。

## 10. 局限、风险与课题切入点

只验证四个 TCGA 癌种且要求任务身份；缓冲区保存处理后旧特征，仍有隐私与存储问题。可研究未知任务边界、模态缺失、医院而非癌种增量，以及不保存旧样本的隐私持续学习。

## 11. 前后关联

它以 [MCAT](20-mcat.md) 一类 WSI—组学融合为任务基础，与 [STEPH](44-steph.md) 同样利用跨癌种知识，但解决“数据顺序到达时如何不遗忘”，而不是离线合并已训练模型。

## 12. 链接

- [AAAI 论文页](https://ojs.aaai.org/index.php/AAAI/article/view/40013)
- [官方代码](https://github.com/LucyDYu/ConSurv)
- [arXiv](https://arxiv.org/abs/2511.09853)
