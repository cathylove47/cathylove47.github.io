# DisPro：模态缺失条件下的病理—组学生存预测

## 原文摘要

> The integration of multimodal data including pathology images and gene profiles is widely applied in precise survival prediction. Despite recent advances in multimodal survival models, collecting complete modalities for multimodal fusion still poses a significant challenge, hindering their application in clinical settings. Current approaches tackling incomplete modalities often fall short, as they typically compensate for only a limited part of the knowledge of missing modalities. To address this issue, we propose a Distilled Prompt Learning framework (DisPro) to utilize the strong robustness of Large Language Models (LLMs) to missing modalities, which employs two-stage prompting for compensation of comprehensive information for missing modalities. In the first stage, Unimodal Prompting (UniPro) distills the knowledge distribution of each modality, preparing for supplementing modality-specific knowledge of the missing modality in the subsequent stage. In the second stage, Multimodal Prompting (MultiPro) leverages available modalities as prompts for LLMs to infer the missing modality, which provides modality-common information. Simultaneously, the unimodal knowledge acquired in the first stage is injected into multimodal inference to compensate for the modality-specific knowledge of the missing modality. Extensive experiments covering various missing scenarios demonstrated the superiority of the proposed method. The code is available at https://github.com/Innse/DisPro.

*来源：arXiv:2503.01653（https://arxiv.org/abs/2503.01653）。逐字原文，未改写、未压缩。*

## 中文摘要

> 包括病理图像与基因谱在内的多模态数据的整合，被广泛应用于精准生存预测。尽管多模态生存模型近来取得了进展，为多模态融合收集完整模态仍是一项重大挑战，阻碍了它们在临床场景中的应用。当前应对不完整模态的方法往往力有未逮，因为它们通常只补偿缺失模态知识中的有限一部分。为解决这一问题，我们提出蒸馏提示学习框架（DisPro），以利用大语言模型（LLMs）对模态缺失的强鲁棒性，它采用两阶段提示来为缺失模态补偿全面信息。在第一阶段，单模态提示（UniPro）蒸馏每个模态的知识分布，为在后续阶段补充缺失模态的模态特定知识做准备。在第二阶段，多模态提示（MultiPro）利用可用模态作为 LLMs 的提示来推断缺失模态，这提供了模态共性信息。同时，第一阶段获得的单模态知识被注入多模态推断中，以补偿缺失模态的模态特定知识。覆盖各种缺失场景的大量实验证明了所提方法的优越性。代码见 https://github.com/Innse/DisPro。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![DisPro 论文框架图](/papers/pathology/27-dispro-pipeline.png)

> **原文图注**：Figure 1 : Insights for existing incomplete multimodal learning and comparison to the proposed method. (a) Generation-based Imputation and Imputation-free approaches, (b) Retrieved-based Imputation and (c) Ours.

*图源：https://arxiv.org/html/2503.01653v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

考试时有的学生缺课，拿不到图像或基因其中一份资料。DisPro 让资料完整的“老师模型”教缺资料的模型，尽量在少一份证据时继续判断。

### 0.2 它为什么出现？

现实患者经常缺 WSI 或组学，而许多多模态模型要求两者同时存在。

### 0.3 它到底怎么做？

1. 先用模态完整的病例学习联合表示。
2. 为不同缺失情况准备可学习 prompt。
3. 把完整模型的知识蒸馏给只有单模态的分支。
4. 根据实际可用模态预测生存风险。

### 0.4 先认清这些词

- **模态缺失**：某位患者缺少图像、组学或其他输入。
- **prompt learning**：学习少量提示向量来调整模型行为。
- **知识蒸馏**：让较完整或较强模型指导较弱模型。
- **非随机缺失**：资料缺失与病情、医院流程等因素相关。

### 0.5 输入和输出

输入可以是完整或缺失的 WSI/组学；输出是患者生存风险。

### 0.6 最容易误解的地方

训练时随机遮掉模态，比真实临床缺失简单；真实缺失可能本身携带偏倚信息。

**现在只记住一句话：DisPro = 用完整病例教会模型在缺一份模态时继续预测。**

## 1. 一句话结论

DisPro 用提示学习把单模态患者投射到共享的多模态语义空间，目标是在 WSI 或组学缺失时仍能预测生存；它对“现实数据不齐全”这一问题切中要害，但随机模拟缺失并不等价于临床中的非随机缺失。

## 2. 研究问题

许多病理—组学生存模型默认每名患者都有完整 WSI 和分子数据，现实中却常有某一模态缺失。论文研究如何利用完整病例学到的跨模态知识，为只有单一模态的患者提供稳健风险预测。

## 3. 为什么难

- 缺失模态中可能含有无法从现有模态推断的患者特异信息。
- 临床缺失常与医院流程、病情和支付条件相关，并非随机。
- 用完整病例训练、随机遮掉模态测试，可能高估实际泛化。
- 生存结局还有删失和队列差异。

## 4. 核心方法

DisPro 分为两阶段：UniPro 先为单一模态学习提示和风险表征，MultiPro 再利用完整多模态病例进行知识交互与对齐。方法借助语言模型/生物医学文本表征承载语义提示，让“仅病理”或“仅组学”的输入靠近完整病例的判别空间。

## 5. 数据与实验设置

实验覆盖五个 TCGA 队列：BLCA 372 例、BRCA 1007 例、COADREAD 533 例、LUAD 443 例、UCEC 478 例。论文采用五折交叉验证，以 C-index 为主要指标，并设置不同比例的模态缺失。

## 6. 主要结果

【论文事实】在 60% 模态缺失设置下，论文表格给出的跨队列平均 C-index 约为 0.6796（病理缺失）和 0.6802（组学缺失），完整模态约为 0.7021；DisPro 在多种缺失比例下优于对比方法。

【AI 解读】性能下降相对受控，说明共享提示有迁移价值；但模型是在“补足预测能力”，并没有恢复缺失患者真实、独有的组学或形态信息。

## 7. 关键术语

- **模态缺失**：患者缺少 WSI、组学等某类输入。
- **提示学习**：训练少量提示向量，引导预训练模型适配新任务。
- **C-index**：衡量预测风险排序与实际生存先后的一致程度。
- **非随机缺失**：缺失概率本身与患者或临床流程有关。

## 8. 代码对应关系

官方仓库以 `main.py` 和 `dispro.yaml` 组织实验；`scripts/run_unipro/`、`run_omics/`、`run_multipro/` 对应分阶段训练，`datasets/`、`splits/` 和 `models/` 分别承载数据、患者划分与模型。代码成熟度评为 **B**：核心结构和划分可见，但特征准备、数据授权及阶段间产物衔接仍需仔细核对。

## 9. 可信度与风险

- 所有折必须按患者固定，完整病例与缺失病例不能通过切片或特征缓存交叉。
- 应分别报告随机缺失、按中心缺失和与临床变量相关的非随机缺失。
- TCGA 的缺失机制与真实医院工作流可能不同。
- 提示向量的语义解释需要实证，不能因使用语言模型就自动视为可解释。

## 10. 最小复现路径

从一个队列和预提取特征开始，固定官方患者划分，先跑完整模态和单模态基线，再按 20%/40%/60% 随机遮蔽复现 UniPro 与 MultiPro。随后设计按医院或临床变量驱动的缺失实验，并为五折结果给出均值、方差和患者级 bootstrap 区间。

## 11. 延伸思考

真正有临床价值的比较不是“能否猜回缺失模态”，而是：在已知哪些患者更可能缺数据时，模型能否保持校准、识别不确定性，并提示何时必须补做检测。

## 12. 资料入口

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2025/html/Du_DisPro_Survival_Prediction_for_Missing_Modalities_with_Multi-Modal_Prototypes_CVPR_2025_paper.html)
- [官方代码](https://github.com/Innse/DisPro)
