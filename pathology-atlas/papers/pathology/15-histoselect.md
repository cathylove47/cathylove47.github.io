# 15｜HistoSelect：像病理医生一样按问题粗到细选择 WSI 证据

**论文**：Act Like a Pathologist: Tissue-Aware Whole Slide Image Reasoning，CVPR 2026  
**定位**：WSI 视觉问答、问题引导检索、视觉 token 效率  
**建议投入**：先使用公开 warm-start 与 HistoSelect 权重做测试；完整训练需要四卡与大模型环境。

**精读核验**：CVPR 2026 正式论文，pp. 6972–6981；总评估规模为356,000个问答对。论文报告平均减少70%视觉 token，并在三个病理 QA 任务上提升 accuracy（2026-09-01）。

## 原文摘要

> Computational pathology has advanced rapidly in recent years, driven by domain-specific image encoders and growing interest in using vision-language models to answer natural-language questions about diseases. Yet, the core problem behind pathology question-answering remains unsolved, considering that a gigapixel slide contains far more information than necessary for a given question. Pathologists naturally navigate tissue and morphology complexity by scanning broadly, and zooming in selectively according to the clinical questions. Current models, in contrast, rely on uniform patch sampling or broad attention maps, often attending equally to irrelevant regions while overlooking key visual evidence. In this work, we try to bring models closer to how humans actually examine slides. We propose a question-guided, tissue-aware, and coarse-to-fine retrieval framework, HistoSelect, that consists of two key components: a group sampler that identifies question-relevant tissue regions, followed by a patch selector that retrieves the most informative patches within those regions. By selecting only the most informative patches, our method becomes significantly more efficient: reducing visual token usage by 70% on average, while improving accuracy across three pathology QA tasks. Evaluated on 356,000 question-answer pairs, our approach outperforms existing methods and produces answers grounded in interpretable, pathologist-consistent regions. Our results suggest that bringing human-like search and attention patterns into WSI reasoning is a promising direction for building practical and reliable pathology VLMs. Code is available at https://github.com/winston52/HistoSelect.

*来源：arXiv:2603.00667（https://arxiv.org/abs/2603.00667）。逐字原文，未改写、未压缩。*

## 中文摘要

> 近年来，计算病理学发展迅速，其驱动力来自领域专用的图像编码器，以及人们对于使用视觉—语言模型来回答关于疾病的自然语言问题的日益增长的兴趣。然而，考虑到一张千兆像素切片所包含的信息远超某个给定问题所需，病理问答背后的核心问题仍未得到解决。病理医生天然地通过广泛扫视、并根据临床问题有选择地放大，来应对组织与形态学的复杂性。相比之下，当前模型依赖均匀的 patch 采样或宽泛的注意力图，往往同等地关注无关区域，却忽略了关键的视觉证据。在本工作中，我们试图让模型更接近人类实际查看切片的方式。我们提出一个由问题引导、组织感知且由粗到细的检索框架 HistoSelect，它由两个关键组件构成：一个识别出与问题相关组织区域的 group sampler，其后接一个在这些区域内检索出最具信息量 patch 的 patch selector。通过只选择最具信息量的 patch，我们的方法变得显著更高效：平均减少 70% 的视觉 token 使用量，同时在三个病理 QA 任务上提升 accuracy。在 356,000 个问答对上评估，我们的方法优于现有方法，并产生以可解释、与病理医生一致的区域为依据的答案。我们的结果表明，将类人的搜索与注意力模式引入 WSI 推理，是构建实用且可靠的病理 VLMs 的一个有前景的方向。代码可在 https://github.com/winston52/HistoSelect 获取。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![HistoSelect 论文框架图](/papers/pathology/15-histoselect-pipeline.png)

> **原文图注**：Figure 1 : Illustration of our HistoSelect framework. (a) The baseline method feeds a large number of patches indiscriminately into the VLM, leading to high redundancy and question-irrelevance. (b) Our question-guided tissue-aware selection method. The question guides the model to select a relevant and sparse subset of informative patches, which are then fed to the VLM for reasoning.

*图源：https://arxiv.org/html/2603.00667v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

病理医生不会把地图上每个像素都看一遍，而是先扫全图，再根据问题放大可疑区域。HistoSelect 把这种“先找地方、再细看”的过程做成模型。

### 0.2 它为什么出现？

把所有 patch 都送进大语言模型既昂贵又混入大量无关组织；固定采样又可能错过与当前问题有关的区域。

### 0.3 它到底怎么做？

1. 先识别并分组不同组织区域。
2. 把用户问题编码成查询。
3. 根据问题给各组织组分配查看预算。
4. 从重点组选择相关 patch，交给视觉语言模型回答。

### 0.4 先认清这些词

- **粗到细**：先看全局方向，再放大局部证据。
- **问题引导**：不同问题会选择不同区域。
- **视觉 token**：传给语言模型的图像信息单元。
- **grounding**：把回答尽量连接到可定位的图像证据。

### 0.5 输入和输出

输入是 WSI 和一个问题；输出是选择出的关键 patch 以及模型答案。

### 0.6 最容易误解的地方

少看 70% token 不等于少丢 70% 信息；选区器漏掉证据后，语言模型无法补救。

**现在只记住一句话：HistoSelect = 先根据问题决定看哪里，再让语言模型回答。**

## 1. 三分钟摘要与推荐理由

HistoSelect 观察到病理医生不会把整张切片所有区域同等看待，而会根据临床问题先扫视组织类型，再放大相关区域。模型先进行 tissue-aware grouping，再由问题引导的 group sampler 分配预算，最后由 patch selector 选择最相关 patch，送入视觉语言模型回答问题。

论文报告平均减少约 70% 视觉 token，同时在三个病理问答任务上提高准确率。它把效率、可解释区域和问题条件化统一到同一检索框架中。

## 2. 问题及研究位置

WSI VLM 的主要瓶颈不是语言模型能否生成答案，而是海量 patch 中哪些证据与当前问题有关。均匀采样会浪费 token，普通 attention 也可能把不相关组织带入推理。

## 3. 核心方法和数据流

```text
WSI → tissue segmentation / patch features
question embedding + tissue-aware groups → group sampler
组内 question-guided patch selector → sparse visual tokens
SlideChat-style MLLM → grounded answer
```

## 4. 实验、数据集与指标

论文在 SlideBench-VQA、WSI-Bench 与院内卵巢任务等设置上评估，共涉及大规模问答对。除准确率外，重点关注 token 数、选择区域与病理医生判断的一致性。院内数据不能从公开仓库完全复现，应与公开任务分开报告。

消融显示完整模型在 Morphology/Diagnosis/Treatment 三类问题上达到94.57/85.79/97.92 accuracy；随机采样为88.84/78.02/91.67。token budget 在5k附近最佳，继续增加到10k没有稳定增益；这支持“问题相关的充分子集”而不是“token 越多越好”。

## 5. 代码仓库审计

- 评级：**B+**；MIT 许可证。
- 完整预处理、组织分割、问题 embedding、四卡训练、测试脚本、SlideChat warm-start 和 HistoSelect 权重入口均存在。
- 仓库内嵌/改造 XTuner，依赖链较长；复现成本高于普通 MIL。
- 关键文件：`data_preprocessing/tissue_segmentation.py`、`data_preprocessing/generate_question_embeddings.py`、`xtuner/model/llava_selector.py`、`xtuner/tools/test_histoselect.py`。

## 6. 环境、显存与数据

仓库提供 `environment.yaml`、`requirements.txt` 和 Deepspeed 配置。README 的训练入口使用 4 GPU；还需 CONCH checkpoint、SlideChat stage-2 warm-start、WSI-LLaVA/SlideChat 数据和大量预计算特征。

## 7. 建议复现路径

1. **最小测试**：下载公开 HistoSelect 与 stage-2 权重，先在少量已预处理样本运行 `scripts/histoselect_testing.sh`。
2. **标准实验**：按 README 完成切块、CONCH 特征、组织分组和问题 embedding，再复现一个公开 benchmark。
3. **扩展实验**：改变 token budget、组织分组和问题类型，绘制准确率—token—延迟曲线，并检查选择区域稳定性。

## 8. 代码阅读顺序

`README.md` → `data_preprocessing/tissue_segmentation.py` → `generate_question_embeddings.py` → `xtuner/configs/histoselect/stage_2_selector.py` → `xtuner/model/llava_selector.py` → `scripts/histoselect_training.sh` → `xtuner/tools/test_histoselect.py`。

## 9. 可借鉴思想

- patch 选择应由问题条件化，而非全任务共享一张静态 attention map。
- 计算效率可以通过证据检索改进，而不只靠更小模型。
- 将“选了哪里”作为独立可验证输出。

## 10. 局限、风险与课题切入点

问题或组织 prompt 有偏差时，早期筛选可能不可逆地丢失证据；公开 benchmark 也可能偏向短答案。可研究带回溯的自适应检索、不确定性触发的二次扫描、开放问题下的证据充分性，以及病理医生真实工作流中的时间收益。

**关键复现实验：**固定同一 MLLM 和视觉 encoder，仅替换选择器；同时报告答案正确率、selected-region recall、token 数、端到端延迟和“证据不足”率。选择区域与医生一致是相关性证据，不等于诊断因果解释。

## 11. 前后关联

它综合了 [MI-Zero](06-mi-zero.md) 的图文对齐、[WSI-FiVE](12-wsi-five.md) 的语义交互和 [PathDino](13-pathdino.md) 一类 patch encoder 的表征基础，是本路线的终点而不是起点。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2026/html/Huang_Act_Like_a_Pathologist_Tissue-Aware_Whole_Slide_Image_Reasoning_CVPR_2026_paper.html)
- [官方代码](https://github.com/winston52/HistoSelect)
- [arXiv](https://arxiv.org/abs/2603.00667)
