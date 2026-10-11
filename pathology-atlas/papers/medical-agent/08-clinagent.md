# 08｜ClinAgent：临床试验检索与多轮工具分析

**论文**：ClinAgent: A ReAct-Based Agent for Conversational Access to Clinical Trial Information  
**首发**：2026-09-12，arXiv 2609.13860 v1  
**发表状态**：CIBB 2026（作者声明接收）  
**类型**：system/tool  
**作者**：Antonino Vaccarella、Riccardo Cantini、Domenico Talia、Paolo Trunfio、Marianna Talia、Rosamaria Lappano、Marcello Maggiolini  
**论文来源**：[arXiv:2609.13860v1](https://arxiv.org/abs/2609.13860v1)（作者提交的预印本）  
**核验日期**：2026-10-11  
**阅读范围**：作者摘要与 HTML 方法／评测说明；以下为中文导读和精读问题。  
**代码状态**：本次未确认官方代码仓库；不填推测链接。

## 1. 为什么读这篇

适合希望先做一个工具型医学 Agent 的读者：目标是临床试验信息检索与汇总，工具接口和输出来源较清楚。

## 2. 三分钟摘要

ClinAgent 使用 ReAct 循环连接 ClinicalTrials.gov、PubMed 与本地试验数据的 Python 分析器。模型根据检索结果调整后续动作，支持多轮提问和跨来源信息综合。

## 3. 它到底怎么做

1. 理解试验信息问题与对话上下文。
2. 选择注册库、文献或 Python 分析工具。
3. 观察结果并调整检索与分析计划。
4. 生成基于检索证据的回答。

## 4. 实验与阅读检查

三阶段评价操作有效性、计划与工具效率、专家质量判断，比较 Gemini 3.0 Flash 与 DeepSeek V3.2 两种模式。

以下是本站建议的精读检查项：

- 对照工具输入、输出与缓存时间，判断回答的信息新鲜度。
- 将检索命中、分析执行成功与回答正确分别记录。
- 核对专家评价样本、评分规则，以及多轮问题是否与单轮分开。

## 5. 与现有路线的联系

与 EHRAgent 对读：同样使用 Python，但本篇分析的是临床试验数据与检索证据。

## 6. 本篇阅读产出

做一页对照：写出任务输入、可见信息、可用动作、评分单位和关键基线；选一条原文轨迹，逐步标注动作、返回证据与最终结论的对应关系。这是本站的阅读练习。

## 7. 来源

- **使用版本**：arXiv:2609.13860v1；发表状态依据 arXiv 元数据，会议接收声明与正式出版记录分别标注。
- **内容归属**：论文事实及结果来自作者原文；中文摘要为本站概述，阅读建议与检查问题为本站整理。
- [原始 PDF（v1）](https://arxiv.org/pdf/2609.13860v1)
- [作者原文与版本记录](https://arxiv.org/abs/2609.13860)
- [HTML 全文](https://arxiv.org/html/2609.13860v1)

