# WSI-Agents：面向整张切片的多模型核验工作流

## 原文摘要

> Whole slide images (WSIs) are vital in digital pathology, enabling gigapixel tissue analysis across various pathological tasks. While recent advancements in multi-modal large language models (MLLMs) allow multi-task WSI analysis through natural language, they often underperform compared to task-specific models. Collaborative multi-agent systems have emerged as a promising solution to balance versatility and accuracy in healthcare, yet their potential remains underexplored in pathology-specific domains. To address these issues, we propose WSI-Agents, a novel collaborative multi-agent system for multi-modal WSI analysis. WSI-Agents integrates specialized functional agents with robust task allocation and verification mechanisms to enhance both task-specific accuracy and multi-task versatility through three components: (1) a task allocation module assigning tasks to expert agents using a model zoo of patch and WSI level MLLMs, (2) a verification mechanism ensuring accuracy through internal consistency checks and external validation using pathology knowledge bases and domain-specific models, and (3) a summary module synthesizing the final summary with visual interpretation maps. Extensive experiments on multi-modal WSI benchmarks show WSI-Agents's superiority to current WSI MLLMs and medical agent frameworks across diverse tasks.

*来源：arXiv:2507.14680（https://arxiv.org/abs/2507.14680）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![WSI-Agents 论文框架图](/papers/pathology/40-wsi-agents-pipeline.png)

> **原文图注**：Figure 1 : The workflow of WSI-Agents with three main modules.

*图源：https://arxiv.org/html/2507.14680v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

不是让一个全科医生独自回答所有问题，而是由分诊员选择形态、诊断、治疗或报告专家，再让逻辑审查、知识库和专科模型共同核验答案。

### 0.2 它为什么出现？

单个 WSI 多模态大模型能处理多任务，但在专门分类任务上常落后 foundation classifiers；通用医疗 agents 又缺少 gigapixel WSI 处理能力和病理知识。

### 0.3 它到底怎么做？

1. Task agent 识别任务并路由到专门 expert。
2. Expert 从 WSI MLLM zoo 生成多个候选回答。
3. Logic agent 检查内部矛盾和证据有效性。
4. Fact/consensus agents 用知识库和 TITAN、CONCH、PRISM 等模型核验。
5. Summarizing/reasoning agents 汇总并迭代最终回答。

### 0.4 先认清这些词

- **MLLM zoo**：多个 WSI 多模态语言模型组成的候选池。
- **knowledge verification**：检索外部病理资料核对生成 claim。
- **classifier consensus**：比较语言回答与病理基础模型分类结果。
- **agent orchestration**：把路由、调用、核验和汇总拆成明确角色。

### 0.5 输入和输出

输入是 WSI 与自然语言问题；输出可以是形态描述、诊断、治疗规划、报告或 VQA 答案，并附融合后的解释图。

### 0.6 最容易误解的地方

多个 agent 或模型一致并不等于临床真值；知识库只能验证文本知识，不能证明视觉证据确实存在于当前 WSI。

**现在只记住一句话：WSI-Agents = 用专门模型作答，再以逻辑、知识和视觉分类器做多层核验。**

## 1. 三分钟摘要与推荐理由

WSI-Agents 把研究重点从“训练一个更大的 WSI MLLM”转为“如何组织可替换的专家模型并审计回答”。它适合学习系统设计和失败模式，而不是作为单一视觉 backbone 阅读。其最有价值的结构是将内部一致性、外部知识和视觉分类共识拆开计分。

## 2. 论文解决的问题及其研究位置

SlideChat/CPath-Omni 追求单模型多任务能力；PathFinder/WSI-Agents 追求工具和专家协作。WSI-Agents 进一步强调生成后核验，但系统性能依赖底层 MLLM、foundation model、知识库与 prompt 的共同质量。

## 3. 核心方法和数据流

```text
WSI + question
  → task allocation
  → morphology / diagnosis / treatment / report expert
  → multiple MLLM responses
  → logic consistency score
  → pathology knowledge score
  → foundation-classifier consensus score
  → weighted verification + reasoning discussion
  → final answer + interpretation map
```

总分将逻辑一致性、知识核验和分类器共识加权。summary agent 选择高分回答，再吸收其他一致内容；reasoning agents 多轮讨论直到多数同意。

## 4. 关键实验、数据集与指标

- WSI-Bench 总体平均分：WSI-Agents 0.637；WSI-LLaVA 0.541；Quilt-LLaVA 0.436；Med-Agents 0.315。
- 分任务：形态 0.568、诊断 0.714、治疗 0.827、报告 0.440。
- WSI-VQA accuracy：60.0%；WSI-LLaVA 55.0%、原 WSI-VQA 47.0%。
- 报告生成 WSI-Precision：0.440；WSI-LLaVA 为 0.300。
- 消融：完整系统 0.637；去 task allocation 0.531，去 logic/fact/consensus/reasoning 分别为 0.607/0.603/0.601/0.561。

对输入受限模型，论文将 WSI thumbnail resize 到 1024×1024；因此部分语言路径并没有直接读取所有高分辨率 patch。

## 5. 官方代码仓库审计

复现评级 **B−**。仓库公开 task/integration、内部验证、外部验证、知识库 demo、评分器和 tests，能看到系统拆分；但完整模型 zoo、foundation classifiers、API、知识库版本和全部运行配置仍需外部资源，难以一键复现论文总表。

## 6. 环境、显存、存储和数据准备要求

成本来自多个层面：WSI 预处理与基础模型推理、多个 MLLM 调用、知识库 embedding/RAG、agent 多轮讨论。复现时必须记录每个问题的模型调用次数、token、GPU 时间、API 版本与缓存策略，否则无法比较“更准确”所需的真实成本。

## 7. 建议复现路径

1. **最小测试**：使用仓库 demo 和固定文本输入，只验证 logic/fact/consensus 的数据流。
2. **标准实验**：固定一个公开 WSI-VQA 子集和底层模型版本，复现完整与去 verification 的差异。
3. **错误审计**：区分视觉漏检、知识错误、路由错误、模型共识错误和 summary 篡改。
4. **成本曲线**：逐步增加 expert 和 verification 数量，报告性能、时延、token 与 GPU 成本。

## 8. 建议代码阅读顺序

`SYSTEM_OVERVIEW.md` → `MedicalAnalysisSystem.py` → `agent.py` / `MLLM_agent.py` → `InternalValidation.py` → `ExternalValidation.py` → `ClassifierResponseReader.py` → `ScoreCalculator.py` → `IntegrationAgent.py` → `tests/`。

## 9. 值得借鉴的思想与可迁移组件

- 把“生成答案”和“核验答案”分成不同模块，便于审计和替换。
- 内部逻辑、文本知识与视觉证据是三类不同问题，不能用一个总置信度掩盖。
- 多代理系统必须报告路由准确率、级联失败率和成本，而不只报告最终分数。

## 10. 局限、复现风险和博士课题切入点

thumbnail 可能漏失微小病灶；多个 foundation model 可能共享训练数据偏差；知识检索不保证当前切片中存在对应证据；关键 prompt、模型版本、成本和时延披露不足。可研究证据充分性、失败追踪图、成本约束路由、病理医师仲裁和带拒答的 agent consensus。

## 11. 与前后论文的关联

先读 SlideChat/CPath-Omni 理解底层 WSI MLLM，再读 PathFinder 与 WSI-Agents 的系统编排。WsiCaption 提供报告生成前史，CONCH/Prov-GigaPath 等基础模型则构成其视觉核验底座。

## 12. 官方链接

- [MICCAI 官方 PDF](https://papers.miccai.org/miccai-2025/paper/0994_paper.pdf)
- [Springer DOI](https://doi.org/10.1007/978-3-032-04971-1_64)
- [官方代码](https://github.com/XinhengLyu/WSI-Agents)
