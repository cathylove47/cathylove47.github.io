# 13｜SAGEAgent：代价感知的主动多模态取证与自演化临床决策 Agent

**论文**：SAGEAgent: A Self-Evolving Agent for Cost-Aware Modality Acquisition in Multimodal Survival Prediction，MICCAI 2026 / arXiv:2607.09521v1（cs.AI / cs.CV，2026-07-10）
**定位**：医学多智能体（Medical Agent）、主动取证（Active Acquisition）、多模态生存预测、情境记忆（Episodic Memory）、语义自反思规则演化
**精读核验**：依据 MICCAI 2026 接收版正文、arXiv v1 摘要、公式与官方代码仓库 `Chongyu1117/SAGEAgent`（含 `run_agent.py`、`train_predictor.py`、记忆检索与评估脚本）整理（2026-11-06）；尚未进行本地复现。

## 原文摘要

> Does every cancer patient truly need a complete diagnostic workup for accurate survival prediction? In multimodal clinical oncology, diagnostic modalities follow a clinically mandated order of escalating burden -- from demographics collected at intake to genomic profiling requiring specialized tissue analysis. Current multimodal survival methods either assume all modalities are available or passively handle missing data, but none actively reason about whether acquiring the next modality is justified for a given patient along this ordered workflow. We formulate this as a sequential decision problem and propose SAGEAgent (Sequential Acquisition Guided by Experience), a self-evolving LLM-based clinical agent that decides which diagnostic modalities to acquire for each patient to optimize survival prediction while minimizing diagnostic cost. SAGEAgent integrates a multimodal prediction engine that predicts patient risk and gauges predictive uncertainty, with an agentic engine that uses an LLM to reason over clinical and uncertainty context alongside dynamic episodic and semantic memories. Crucially, SAGEAgent continuously evolves without model fine-tuning through experience-driven rule induction and rule refinement. Evaluated on diverse cancer cohorts from TCGA and an external multi-modal dataset, SAGEAgent matches or exceeds the prediction accuracy of full-modality models while reducing acquisition burden and cost by up to 48%, paving the way for cost-effective, personalized clinical workups.

*来源：arXiv:2607.09521v1（MICCAI 2026 录用）；逐字原文，未改写、未压缩。*

## 中文摘要

> 每一位癌症患者真的都需要接受全套的诊断检查才能实现准确的生存预测吗？在多模态临床肿瘤学中，诊断模态的采集遵循临床规定的递进式负担顺序——从就诊登记时收集的人口统计学信息，到需要专门组织分析的基因组测序。现有的多模态生存预测方法要么假设所有模态均完整可用，要么被动处理缺失数据；但没有一种方法能够沿着这一有序的工作流，主动推理为特定患者获取下一模态是否具有充分理由。我们将此形式化为一个序贯决策问题，并提出了 SAGEAgent（基于经验引导的序贯模态获取），一个基于大语言模型（LLM）的自演化临床智能体，能够为每位患者动态决策应采集哪些诊断模态，从而在最小化诊断成本的同时优化生存预测。SAGEAgent 整合了一个多模态预测引擎（用于预测患者风险并衡量预测不确定性）和一个智能体决策引擎（利用 LLM 结合临床与不确定性上下文、动态情境记忆和语义记忆进行逻辑推理）。至关重要的一点是，SAGEAgent 依靠经验驱动的规则归纳与规则提炼实现持续自演化，而无须微调大模型参数。在来自 TCGA 及外部多模态数据集的多种癌症队列上的评估表明，SAGEAgent 在匹配甚至超越全模态模型预测精度的同时，减少了高达 48% 的模态获取负担与成本，为具有成本效益的个性化临床检查规划铺平了道路。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。临床术语与指标以英文原文为准。*

## 1. 三分钟摘要与推荐理由

在多模态肿瘤诊断中，不同模态的代价差别悬殊：人口统计学特征（Demographics）几乎免费，影像（Radiology）需要预约扫片，病理切片（Pathology）需要穿刺活检，全外显子测序（Genomics）则极其昂贵且周转漫长。很多早期患者仅靠基础病理就能准确分期，强行做全套基因测序不仅增加患者经济与身心负担，也浪费医疗资源。

SAGEAgent 颠覆了过去“被动补齐缺失数据”的范式：
1. **序贯决策（Sequential Decision-Making）**：Agent 站在门诊流程中，按照“登记 → 影像 → 病理 → 基因”的自然升级阶梯，在每一步主动回答：“这位患者当前的生存风险不确定性是否值得再掏钱做下一项昂贵检查？”
2. **免训练自演化（Self-Evolving）**：LLM 决策核心（采用 Qwen2.5-7B）完全冻结参数！演化完全发生在外部双层记忆池中：
   - **情境记忆（Episodic Memory）**：用 FAISS 向量检索历史上症状相似的病例处理结果。
   - **语义记忆（Semantic Memory）**：每处理 10 例患者，Agent 自动总结并增删“何时应该停下（Stop）或获取（Acquire）”的文字规则（上限 10 条）。
3. **真实收益极其显著**：在保持 C-index 甚至略有提高的前提下，砍掉了多达 48% 的不必要检测开销。

推荐理由：MICCAI 2026 正式录用；真正将临床经济学代价与 Agentic Workflow 深度结合，代码完整开源。

## 2. 问题及研究位置

**问题**：如何在多模态肿瘤生存预测中平衡预测置信度与高阶检查的物理/经济成本？

**研究位置**：
- **被动缺失补全**：利用生成对抗或变分自编码器补齐丢失模态。缺点：对不可逆的高阶特征纯属臆造。
- **静态特征选择**：LASSO、决策树一次性选特征。缺点：无法贴合临床按时间步递进的取证顺序。
- **本文位置**：把临床升级流程建模为有限时域序贯马尔可夫决策过程，由具备经验记忆反思能力的 LLM 智能体自主裁决。

## 3. 核心方法和数据流

```text
患者入组：初始模态 e_0 (人口统计学)
      ↓
[多模态预测引擎] ── 冻结 2 层 Transformer + Cox 风险头
  · 输出生存风险预测 r_t
  · 不确定性头评估 u_t ∈ [0, 1] (反映若补全模态风险是否会剧烈波动)
      ↓
[Agent 决策引擎 (Qwen2.5-7B)]
  输入：
    1. 临床与不确定性量化文本 (u_t, r_t)
    2. FAISS 检索相似历史病例情节 (Episodic Memory)
    3. 演化生成的临床规则表 (Semantic Rules，如"低龄低风险乳腺癌无需基因测序")
  输出决策：
    · STOP ──> 直接输出最终生存风险评估
    · ACQUIRE ──> 支付步骤代价 b，获取下一阶模态，更新 e_{t+1}，重复决策
      ↓
[双记忆自反思演化]
  每处理一批患者 ──> LLM 自反思归纳新增或剪枝决策规则 (无须反向传播微调权重)
```

## 4. 论文证据与实验范围

- **数据集**：TCGA 多中心癌症队列（覆盖乳腺癌 BRCA、脑胶质瘤 GBMLGG、肺腺癌 LUAD 等）以及外部独立多模态临床队列。
- **模态阶梯**：Demographics → Radiology (CT/MRI) → Pathology (WSI 特征) → Genomics (RNA-Seq/Mutation)。
- **核心结论**：
  - 预测精度（C-index）达到或略微超越使用全部 4 种模态的强基准（如 MCAT、SurvPath）。
  - 模态获取总成本相对全模态平均下降 42%~48%，绝大多数中早期低风险患者在病理阶段即决策停止，免于昂贵的全外显子测序。

## 5. 复现与审计重点

- **官方仓库已核验**：`https://github.com/Chongyu1117/SAGEAgent`（MIT 协议，核查日期 2026-11-06）。
- **运行轻量**：由于 Qwen2.5-7B 与底层多模态编码器均处于冻结推理状态，不需要昂贵的反向传播显存，单张 RTX 3090/4090 或 A10 即可完整复现所有实验。
- **不确定性阈值参数**：奖励函数中的步进代价参数 $b$ 控制了 Agent 的“节俭程度”，增大 $b$ 会让 Agent 更加保守，快速停下。

## 6. 建议阅读顺序

`Abstract` → `§1 Introduction`（临床诊断代价递进矛盾）→ `§3 Methodology`（多模态引擎 + Agent 引擎双核心设计）→ `Fig. 1`（决策工作流与记忆机制）→ `Table 1-2`（C-index 与代价节约率对比）→ `§4 Memory Evolution Analysis`（规则演化案例）。

## 7. 前后关联

- 与 [MDAgents](../medical-agent/01-mdagents.md)、[CASE](../medical-agent/06-case.md) 对照：MDAgents 按复杂度组织多模型讨论，CASE 聚焦纵向 MRI 查案；SAGEAgent 首次将“多模态检查账单代价”纳入 Agent 决策目标。
- 与 [MedRSI](../medical-agent/12-medrsi.md) 对照：两者都强调“自演化（Self-Evolution）”，MedRSI 通过临床代价失败加权演化工具库，SAGEAgent 通过双层记忆归纳演化决策文本规则。

## 8. 链接

- [arXiv 摘要页](https://arxiv.org/abs/2607.09521)｜[PDF 原文](https://arxiv.org/pdf/2607.09521)
- 官方代码库：[Chongyu1117/SAGEAgent](https://github.com/Chongyu1117/SAGEAgent)
