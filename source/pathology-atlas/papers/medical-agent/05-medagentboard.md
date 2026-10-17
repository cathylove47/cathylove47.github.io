# 05｜MedAgentBoard：医学任务里，多 Agent 是否真的比单模型更好？

**论文**：MedAgentBoard: Benchmarking Multi-Agent Collaboration with Conventional Methods for Diverse Medical Tasks  
**正式发表**：NeurIPS 2025，Datasets and Benchmarks Track，卷 38  
**类型**：benchmark；Agent 评测，不是新的多 Agent 诊断方法  
**阅读范围**：NeurIPS 正式摘要与项目入口；本导读不声称已经精读全文实验表或审计代码。  
**代码状态**：作者提供代码、数据与提示；本站未执行，复现评级为未审计。

## 0. 为什么 Agent 阅读路线需要一篇评测论文

如果只读提出新 Agent 的论文，很容易把“多角色、更长推理、更复杂流程”直接当成贡献。MedAgentBoard 追问的是：**与强单 LLM、常规专用方法相比，多智能体协作在哪些任务上真的有收益？**

这篇单独放在“Agent 评测”，不混入“Agent 方法”。标题含 Agent 也不代表它提出了新的 Agent 架构。

## 1. 中文摘要

大语言模型的发展推动了多智能体协作在复杂医学任务中的应用，但实际收益尚未充分理解。已有评估常缺乏多任务覆盖，也容易遗漏与单 LLM 及成熟常规方法的严格比较。

MedAgentBoard 提供统一 benchmark，覆盖医学视觉问答、通俗摘要、结构化 EHR 预测和临床工作流自动化。作者报告，多智能体协作在某些场景有优势，例如工作流任务完整性，但并不稳定超过强单 LLM；在医学 VQA 和 EHR 预测上，专用常规方法通常仍更强。因此，方法选择应依据具体任务和证据，并权衡额外复杂度与实际性能收益。

**来源**：[NeurIPS 2025 正式摘要](https://proceedings.neurips.cc/paper_files/paper/2025/hash/d59aa09699530c00d4b875a883876641-Abstract-Datasets_and_Benchmarks_Track.html)。本节为中文概述。

## 2. 四种任务不能共用一个“医学 Agent 分数”

| 任务类别 | 输入与输出的特点 | 阅读时要核对的边界 |
|---|---|---|
| 医学／视觉问答 | 文本或图像问题到答案 | 是否只是给定信息后作答 |
| 通俗摘要生成 | 医学内容到面向非专业读者的摘要 | 事实准确与易懂是否分别评价 |
| 结构化 EHR 预测 | 表格记录到预测结果 | 是否与专用统计／机器学习模型比较 |
| 临床工作流自动化 | 多步骤任务到完整执行结果 | 完成了步骤是否等于每一步都正确 |

第三列是本站的阅读问题，不是对论文尚未阅读的指标实现作保证。具体评分程序、样本划分和结果应查正式 PDF 与项目材料。

## 3. 对比较基线的提醒

这篇的主要价值是同时比较三类方法：

1. 多智能体协作。
2. 单 LLM。
3. 成熟的常规或专用方法。

如果 Agent 使用更强模型、更多调用或更多输入信息，而基线没有同等资源，仅看最高分不足以判断 Agent 机制的贡献。这个原则适用于阅读 [MDAgents](?domain=medical-agent&paper=01-mdagents)、[MedRAX](?domain=medical-agent&paper=02-medrax) 和 [WSI-Agents](?domain=pathology&paper=40-wsi-agents)，但不是断言这些论文都做了不公平比较。

## 4. “完整性提高”不等于“正确率提高”

正式摘要对临床工作流自动化强调的是 task completeness 的特定收益，同时明确多智能体不是在所有任务都更好。

需要分开记录：

- 是否完成所有要求的步骤。
- 每一步的结果是否正确。
- 最终输出是否满足任务要求。
- 增加了多少模型调用、执行时间与系统成本。

这四项不能合并为“Agent 已经可靠”。当前导读没有读取足够结果表来给出全任务数值结论，因此不罗列未经核验的分数或提升比例。

## 5. 这篇不能证明什么

**它不证明 Agent 无用。** 摘要本身承认部分任务存在收益。

**它也不证明所有医学任务都该用多 Agent。** 作者强调 task-specific、evidence-based 的选择。

**它不是临床安全认证。** Benchmark、公开提示与实验结果帮助检验方法，不能替代真实医疗环境中的验证。

## 6. 代码入口与阅读顺序

先读[正式摘要和 PDF](https://proceedings.neurips.cc/paper_files/paper/2025/hash/d59aa09699530c00d4b875a883876641-Abstract-Datasets_and_Benchmarks_Track.html)，再到[项目页](https://medagentboard.netlify.app/)查任务、数据与结果材料，最后阅读[代码仓库](https://github.com/yhzhu99/MedAgentBoard)中的评估流程。

本站只确认了公开入口与摘要级结论，尚未执行代码、逐表复核结果或确认所有数据下载条件。因此，不给硬件估算、不提供已跑通声明、不生成复现评分。

## 7. 本周阅读产出

为你最感兴趣的一篇 Agent 论文填一张对照表：

| 要记录的内容 | 应回到哪类证据 |
|---|---|
| 医学任务与可获得的信息 | 数据和任务定义 |
| Agent 实际采取的行动 | 方法、工具接口、轨迹 |
| 强单模型与专用方法基线 | 实验设定与比较表 |
| 收益、成本与失败类型 | 对应指标、资源记录和失败案例 |

这是阅读产出，不是新实验计划，也不把本导读当作完整 benchmark 审计。

## 8. 原文与代码

- [NeurIPS 2025 正式论文页：Datasets and Benchmarks Track](https://proceedings.neurips.cc/paper_files/paper/2025/hash/d59aa09699530c00d4b875a883876641-Abstract-Datasets_and_Benchmarks_Track.html)
- [正式论文 PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/d59aa09699530c00d4b875a883876641-Paper-Datasets_and_Benchmarks_Track.pdf)
- [作者项目页](https://medagentboard.netlify.app/)
- [作者代码](https://github.com/yhzhu99/MedAgentBoard)
