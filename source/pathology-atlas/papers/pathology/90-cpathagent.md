# 90｜CPathAgent：把 WSI 诊断拆成"全局筛查 → 导航规划 → 多尺度顺序推理"的病理 Agent

**论文**：CPathAgent: An Agent-based Foundation Model for Interpretable High-Resolution Pathology Image Analysis Mimicking Pathologists' Diagnostic Logic；arXiv:2505.20510（v1 2025-05-26，v2 2025-10-28）；NeurIPS 2025 主会，proceedings 第 38 卷 pp. 101673–101731，DOI `10.52202/085713-3404`。
**定位**：不是新的病理编码器，而是把 LLaVA-OneVision 架构（Qwen3-14B + CPath-CLIP）训成"会挑区域、会规划视场、会跨尺度讲理由"的 WSI 诊断 Agent；附带发布大区域 VQA 基准 PathMMU-HR²。
**精读核验**：2026-10-25 核对 NeurIPS 官方 PDF 全文（主文 §1–6 与附录 A–E）、Table 1–3、Fig. 4、Appendix C.3（算力）与 C.4（超参）；未下载权重、未运行模型；论文与 arXiv 页均未给出代码或权重链接。

## 原文摘要

> Recent advances in computational pathology have led to the emergence of numerous foundation models. These models typically rely on general-purpose encoders with multi-instance learning for whole slide image (WSI) classification or apply multimodal approaches to generate reports directly from images. However, these models cannot emulate the diagnostic approach of pathologists, who systematically examine slides at low magnification to obtain an overview before progressively zooming in on suspicious regions to formulate comprehensive diagnoses. Instead, existing models directly output final diagnoses without revealing the underlying reasoning process. To address this gap, we introduce CPathAgent, an innovative agent-based approach that mimics pathologists' diagnostic workflow by autonomously navigating across WSI through zoom-in/out and move operations based on observed visual features, thereby generating substantially more transparent and interpretable diagnostic summaries. To achieve this, we develop a multi-stage training strategy that unifies patch-level, region-level, and WSI-level capabilities within a single model, which is essential for replicating how pathologists understand and reason across diverse image scales. Additionally, we construct PathMMU-HR², the first expert-validated benchmark for large region analysis. This represents a critical intermediate scale between patches and whole slides, reflecting a key clinical reality where pathologists typically examine several key large regions rather than entire slides at once. Extensive experiments demonstrate that CPathAgent consistently outperforms existing approaches across benchmarks at three different image scales, validating the effectiveness of our agent-based diagnostic approach and highlighting a promising direction for computational pathology.

*来源：[NeurIPS 2025 官方 proceedings 摘要页](https://papers.nips.cc/paper_files/paper/2025/hash/933b5d002cf251b3e854d586e55ac58c-Abstract-Conference.html)，与 PDF 正文摘要逐字一致。*

## 1. 三分钟摘要与推荐理由

病理医生的真实动作序列是：先用 2–4× 全片扫一遍拿整体结构 → 定位可疑区域 → 一路 10×/20×/40× 放大看核细节 → 边看边把跨尺度证据拼成诊断。现有的两类模型都不这么做：

- **MIL 路线**（ABMIL/DSMIL + 病理编码器）：把整片切成几百上千个 patch，各自编码后注意力聚合，一次输出标签。切片级弱监督 → 容易学捷径（染色伪影、背景纹理）。
- **LMM 路线**（GPT-4o / Gemini-2.5-Pro / PathGen-LLaVA / CPath-Omni）：图进、文本出，一次前向。中间看了什么、为什么看那里，全在黑箱里。

CPathAgent 的做法是把诊断重写成**可执行的动作序列**：先把 32× 降采样的缩略图切成 16000×16000 的大区域网格，让模型输出「区域聚类 + 严重度 0–5 + 是否需要高倍复核」的结构化筛选结果；再为保留下来的每个大区域自回归生成一条导航路径 `(x, y, m, o)`——坐标、相对放大倍率、这一步要看什么；最后把这串视场图连同焦点描述一起喂回去，第一人称地逐步讲理由，收尾成一段病理报告。

一句话区别，避免混淆：**这是"计划→执行"的两段式流程，不是逐步闭环的交互式 Agent。** 导航路径先一次性生成完，推理阶段是把整条路径的视场一次性喂进模型（§3.1 第 3 段原文 "receives the complete sequence of cropped images ... as input at once"），中间不根据新观察回头改路线。第 3 节 (d) 会把这点讲清楚，它直接影响"可解释性"能信到什么程度。

## 2. 问题及研究位置

- **两类现有范式的共同错配**：MIL 与 LMM 都把诊断当成"一次性聚合/一次前向"，与临床的多尺度序贯检查不符（§1）。作者据此归因两个缺陷：弱监督导致 shortcut learning；只给结论不给中间推理，病理医生无法核验。
- **Agent 范式在病理里几乎是空白**：PathFinder 是唯一较完整的先例，但它只在固定 512×512 patch、固定倍率上做重要性图迭代，没有真正的倍率切换与视场移动（§2.2）。CPathAgent 的差异就落在这里：**动态倍率 + 空间移动 + 语言化推理**。
- **基准缺口在"大区域"这一级**：patch 级有 PathVQA / QuiltVQA / PathMMU，WSI 级有 Camelyon16 / TCGA / WSICaption / WSI-VQA，中间的"16000×16000 大区域"没有专家验证过的基准（§2.3）。PathMMU-HR² 填的就是这一格。

| 相邻工作 | 做什么 | CPathAgent 的差别 |
|---|---|---|
| ABMIL / DSMIL | patch 特征 + 注意力聚合出切片标签 | 显式选择区域与倍率，输出过程性证据而非单一聚合向量 |
| CPath-Omni | 统一的 patch/WSI 多模态基础模型 | 共享 stage 1–2 训练数据，stage 3 换成 agent 导航数据（§3.4），是本文最直接的对照 |
| PathFinder | 多 agent 迭代重要性图选区域（固定 512 patch） | 有倍率维度与视场移动；但仍是"先规划后一次性推理"，不是每步重规划（见 §3(d)） |
| Gemini-2.5-Pro + 本文 prompt | 用同等三阶段 prompt 驱动闭源模型 | 表 2/表 4 中作为"agent 化能带来多少增益"的对照，本身也是本文的合成数据生成器 |

## 3. 核心方法和数据流

```text
WSI (TCGA, 40×)
  → 32× 降采样得缩略图，切成 16000×16000 大区域网格（5% 重叠），N 个格子
  ── stage A：全局筛查 ──
  → CPathAgent 读缩略图，输出 {区域聚类 C_k, 语义标签 ℓ_k, 严重度 s_k∈0..5, 复核标志 d_k∈{0,1}}
  → 丢弃 s_k=0，保留需高倍复核的区域 R
  ── stage B：导航规划 ──
  → 对每个保留区域，自回归生成 (x, y, m, o)×T：归一化坐标、相对倍率、该看什么
  ── stage C：多尺度顺序推理 ──
  → 按路径裁出全部视场图，与 (x,y,m,o) 一起"一次性"喂进 LMM
  → 第一人称逐步陈述 → 汇总成病理报告
```

**（a）模型骨架（§3.4）**：LLaVA-OneVision 架构，Qwen3-14B 做语言骨干，CPath-CLIP 做视觉编码器，两层 MLP 投影。单视场分辨率 1008×1008，低于 Gemini-2.5-Pro 的 3072×3072——这一点作者在 §4.2 主动拿来当"多视场补偿单视场分辨率"的论据。

**（b）三阶段训练**：stage 1 只用 CPath-PatchCaption 对齐视觉—语言（仅 MLP 可训）；stage 2 在 CPath-PathInstruct 上全参微调，建立 patch 级 VQA/分类/描述能力；stage 3 才是在 CPathAgent-Instruct（278K 指令样本）+ 20% CPath-Instruct 上全参微调，得到 agent 能力。训练配方照抄 CPath-Omni（stage 1–2），所以**它和 CPath-Omni 的差别几乎全部落在 stage 3**，这是读消融时的关键前提。

**（c）训练数据从哪来（§3.2、附录 A）**：源数据是 HistGen 的 WSI 报告 + TCGA 的 WSI，80%（5,254 张 WSI）训练、20% 留作测试与 PathMMU-HR²；患者级切分避免泄漏。四个子集全部由 **Gemini-2.5-Pro 合成**，靠 WSI 报告做参考信息提质量：
- 全局筛查：扩到 24,429 张 TCGA 缩略图（有报告就带报告，没有就只给图），温度 0.8、每张生成两份以增加多样性；
- 导航规划：三步流水线——从报告里抽取区域描述 D_region → 在 1×/2×/4× 三尺度共 21 个 patch 上生成描述 → 带着坐标标注（0.1 间隔）生成路径；
- 多尺度推理：沿路径裁图 + D_region，生成第一人称推理链；
- VQA 子集：先由 21 条 patch 描述出题，再走"纯文本也能答对就删"的捷径过滤（Gemini-2.5-Pro 与 DeepSeek-V3 双模型投票）。
数据规模：78,658 个区域、26 种组织类型；「视场路径规划」与「多图理解推理」各占 32.8%（一 对一）。

**（d）"Agent"到什么程度——必须看清的一处**：三步流程里，stage C 的输入是**已经确定好的整条路径**对应的视场序列，模型一次读完再写推理。也就是说它不根据第 3 步看到的东西去改第 4 步该看哪里；归因、回头检查、补看，这些医生真正在做的事没有被建模。所以论文主张的"autonomously navigating"应理解为**自主生成导航方案并沿方案执行**，而非闭环视觉导航。这一点决定了下面两类结论的强度：说"更可解释"成立（有路径与逐视场理由可查）；说"更像病理医生"要打折（没有动态决策）。

**（e）推理与训练成本（附录 C.3、C.4）**：8×H800-80G，stage 1 / 2 / 3 分别 9 / 25 / 39 小时，合计 73 小时墙钟 ≈ 584 GPU·小时。stage 3 只跑 1 epoch，per-device batch 1 + 梯度累积 8，cosine、lr 1e-5、warmup 0.03，视觉塔用 2e-6。

**（f）WSI 分类怎么评测（§4.3、附录 C.1.3）**：CPathAgent 出的是描述不是标签，于是走两段式——先由它给出诊断摘要，再让 **Gemini-2.5-Pro 把摘要映射成数据集标签**。MIL 基线用 CPath-CLIP 提多尺度特征（2048² + 4×1024² + 16×512² 取平均），20 epoch、lr 1e-5、batch 1、5 个随机种子取平均，是**在本协议下重训的数字，不是原论文数字**。

## 4. 论文证据与实验范围

评测铺在三个尺度上：patch（PathMMU）、大区域（PathMMU-HR²）、WSI（6 个 TCGA 任务），外加 OOD。

**Table 1：PathMMU patch 级（准确率 %，Tiny=1156 题 / ALL=9677 题）**

| 模型 | Tiny | ALL |
|---|---|---|
| 专家表现（参考线） | 71.8 | — |
| GPT-4.1-2025-04-14 | 67.7 | 64.4 |
| Gemini-2.5-Pro-Preview-03-25 | 68.7 | 67.5 |
| PathGen-LLaVA | 60.1 | 58.4 |
| CPath-Omni | 72.4 | 72.2 |
| CPathAgent | **80.5** | **78.6** |

比最强通用模型高约 11–12 点，比同门 CPath-Omni 高 6–8 点。作者自己也提示：超过专家注基线（71.8）不代表超过专家，可能是题目来源专家各有所长、难覆盖全集。**注意 PathMMU 是训练/评测共用生态**——阶段 1–2 用的是 CPath 系列数据，是否有题目重叠论文未展开，读数字时保留一分折扣。

**Table 2：PathMMU-HR² 大区域（1,668 题，10 种癌型，% accuracy）**

| 方法 | Overall | BRCA | LUAD | LUSC | KIRP | KIRC | KICH | ESCA | THCA | BLCA | TGCT |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Gemini-2.5-Pro（直接问） | 73.2 | 64.4 | 70.8 | 78.3 | 74.5 | 80.8 | 56.5 | 77.1 | 76.7 | 80.1 | 75.0 |
| Gemini-2.5-Pro + agent prompt | 76.4 | 68.8 | 68.8 | 80.0 | 77.8 | 83.4 | 69.3 | 82.8 | 78.7 | 85.1 | 76.9 |
| GPT-4.1-mini（直接问 / + agent prompt） | 60.1 / 62.3 | — | — | — | — | — | 35.5 / 41.9 | — | — | — | — |
| PathGen-LLaVA | 67.2 | 62.0 | 77.6 | 67.4 | 58.2 | 74.2 | 48.4 | 67.1 | **84.4** | 48.1 | 67.2 |
| CPath-Omni | 71.7 | 72.6 | 77.6 | 71.3 | 64.1 | 67.5 | 59.7 | 74.3 | 71.5 | 76.6 | 78.8 |
| **CPathAgent** | **88.6** | **87.0** | **88.5** | **87.8** | **87.9** | **92.9** | **78.9** | **90.7** | 89.0 | **90.7** | **93.0** |

两个读法。(1) **同一 prompt 就能让闭源模型涨分**：Gemini-2.5-Pro 73.2→76.4，GPT-4.1-mini 60.1→62.3，KICH 上 +12.8。这说明"三阶段工作流"这个协议本身有效，不完全依赖训出的模型——这一点对想复现的组是好消息。(2) 即便如此，训练过的 CPathAgent 仍高出 12 点以上，说明 stage 3 的数据与训练确实在起作用，不只是 prompt engineering。

**Table 3：WSI 分类（balanced accuracy %，6 个 TCGA 子任务）**

| 方法 | BRCA | NSCLC | RCC | ESCA | BLCA | THCA | Avg |
|---|---|---|---|---|---|---|---|
| ABMIL | 80.5 | 92.8 | 96.4 | 91.2 | 50.1 | 68.4 | 79.9 |
| DSMIL | 84.7 | 87.2 | 88.9 | 89.9 | 52.2 | 57.8 | 76.8 |
| Gemini-2.5-Pro | 72.4 | 89.2 | 69.2 | 97.1 | 59.8 | 44.9 | 72.1 |
| CPath-Omni*（同切分重训） | 78.6 | 86.7 | 91.3 | 89.9 | 65.5 | 52.6 | 77.4 |
| **CPathAgent** | 88.5 | 90.8 | 94.6 | 97.1 | 62.7 | 63.2 | **82.8** |
| 数据上限（直接用合成训练数据） | 97.0 | 97.9 | 96.5 | 100.0 | 77.8 | 81.0 | 91.7 |

**上限那一行是本文最有信息量的一格**：拿合成出来的"导航轨迹 + 推理链"直接当标签训练，多数任务接近满分（ESCA 100、NSCLC 97.9、RCC 96.5、BRCA 97.0），说明合成数据本身自洽且诊断信息完整；CPathAgent 只到 82.8，离上限 9 点。也就是说**瓶颈不在数据质量，而在"模型能否从过程推理里稳定抽出结论"**——这是可用改进方向。反过来说，上限行同时暴露一个评测风险：合成链与标签高度自洽，用它当训练信号可能放大 Gemini-2.5-Pro 的偏好。

**Fig. 4：OOD**

| 任务 | CPathAgent | 对照 |
|---|---|---|
| CPTAC-Lung（LUAD vs LSCC，WSI） | 88.1 | TITAN 91.9（335,645 WSI）、PRISM 83.2（587,196 WSI）、CPath-Omni 82.3（11,728 WSI） |
| BRACS（良性/非典型/恶性，大区域） | 64.3 | Gemini-2.5-Pro 49.0、GPT-4.1 44.2、CPath-Omni 57.9 |

只有 5,254 张训练 WSI 却接近 TITAN（64× 数据量差距），这是"数据效率"论点最硬的地方。作者也自陈还不到临床部署水平。

**范围外的事**：只做分类/诊断，不做预后与生物标志物预测（附录 D 明确列为限制）；不做免疫组化或分子分型；没有真实病理医生的眼动或操作日志数据。

## 5. 复现与审计重点

1. **无公开代码与权重（截至 2026-10-25）**：NeurIPS 官方 PDF 与 arXiv 2505.20510 页面都没有代码/权重链接；GitHub 搜索 `CPathAgent` 无官方仓库。想复现只能按论文重实现，或等作者放码。这不影响读它的方法论，但意味着本文所有数字目前都不可独立核验。
2. **合成数据是整条链路的地基**：CPathAgent-Instruct 四个子集全部由 Gemini-2.5-Pro 生成，而 Gemini-2.5-Pro 又是表 2/表 4 的对照模型之一。虽然它有"报告引导 + 坐标标注 + 文本捷径过滤"三重质量控制，但**生成器与被评测模型同源**这件事要自己权衡——尤其表 3 的"上限 91.7"本质上是合成数据的自洽度。
3. **WSI 分类指标多了一层代理**：标签由 Gemini-2.5-Pro 从描述映射得到，不是端到端分类器。这既让 CPathAgent 与 MIL 的数字不同质（MIL 是判别式输出，CPathAgent 是生成式描述→再映射），也把一部分误差记在了 Gemini 头上。读表 3 时把它当"描述质量 + 映射器质量"的合成指标。
4. **"Agent" 的边界要写清**：路径一次性规划、视场一次性读入，没有逐步反馈与重规划（§3.1）。若你要做真正的闭环导航，这是最明显的改进口子——例如让第 t 步的观察影响第 t+1 步的坐标/倍率，或引入"证据不足则补看"的终止准则。
5. **缺失的复现信息**：全局筛查里聚类数 K 的取值、导航步数 T 的分布与上限、各子集精确样本数（只给 278K 总量与 32.8% 占比这类百分比）、PathMMU 与训练数据是否重叠，正文与附录均未给出。stage 1–2 的超参直接引用 CPath-Omni，不在本文。
6. **算力门槛可估算**：8×H800 共 73 小时 ≈ 584 GPU·小时。stage 3 只 1 epoch、278K 样本，主要成本在 stage 2 的病理任务训练（25 h）。若只想验证"三阶段协议有效"，可先做 Table 2 里那条零训练对照（给 Gemini-2.5-Pro 套同样的 prompt），成本是一个 API key。
7. **首个可做的实验**：在公开 TCGA 子集上复现"全局筛查 → 规划 → 顺序推理"的 prompt 协议，用任意强 LMM，只复现表 2 的 73.2→76.4 这个增益。它不依赖训练，一周内可跑，能不能站住决定这篇的方法价值是否值得跟。

## 6. 建议阅读顺序

Fig. 1（三种范式对比）→ Fig. 2（三阶段流程）→ §3.1 三阶段定义 → §3.2 数据构造（尤其 21 patch 三尺度与坐标标注）→ §3.4 三阶段训练 → Table 2（含 agent prompt 对照）→ Table 3 的上限行 → 附录 C.3/C.4（算力与超参）→ 附录 D（限制）→ 附录 A.2（基准构造与 1,668/2,200 的过滤比）→ 附录 E（prompt 模板，最实用的复现材料）。

## 7. 前后关联

- [PathFinder](22-pathfinder.md)：本文最直接的先例，固定 patch + 重要性图迭代；对照着看能明确"倍率维度"带来了什么。
- [WSI-Agents](40-wsi-agents.md)：多模型协作的 WSI 工作流，另一条"用 agent 组织现成模型"的路线，与 CPathAgent"训一个 agent 模型"路线相反。
- [CPath-Omni](18-cpath-omni.md)：本文的直系前身，stage 1–2 与其完全同源，读它能判断增量到底在 stage 3 拿到的什么。
- [SlideChat](16-slidechat.md)：WSI 级视觉语言助手，是"LMM 路线"的代表对照。
- [PFM 综述](50-pfm-survey.md)：把 CPathAgent 放回病理基础模型的谱系，看它落在"生成式 LMM"这一支的什么位置。

## 8. 链接

- [NeurIPS 2025 官方论文页（摘要、DOI、BibTeX）](https://papers.nips.cc/paper_files/paper/2025/hash/933b5d002cf251b3e854d586e55ac58c-Abstract-Conference.html)
- [官方 PDF（NeurIPS proceedings）](https://proceedings.neurips.cc/paper_files/paper/2025/file/933b5d002cf251b3e854d586e55ac58c-Paper-Conference.pdf)
- [arXiv abs（v2，2025-10-28）](https://arxiv.org/abs/2505.20510)
- [arXiv HTML 全文](https://arxiv.org/html/2505.20510v2)
- [NeurIPS 2025 poster 页](https://neurips.cc/virtual/2025/poster/117525)
- 代码：未见公开仓库（论文与 arXiv 页均无链接）




