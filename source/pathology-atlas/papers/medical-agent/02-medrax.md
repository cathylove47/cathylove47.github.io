# 02｜MedRAX：让胸片 Agent 调用工具，而不是只看图回答

**论文**：MedRAX: Medical Reasoning Agent for Chest X-ray  
**正式发表**：ICML 2025 主会，PMLR 267，pp. 15661–15676；不是 workshop  
**类型**：方法 + benchmark；医学影像工具调用 Agent  
**阅读范围**：正式论文页与 arXiv v2 的方法、评估和局限；中文导读，不是全文逐字翻译。  
**代码状态**：作者仓库公开；本站没有执行模型、工具或实验，复现评级为未审计。

## 0. 先看它与普通 VLM 的区别

普通 VLM 接收胸片和问题，然后生成答案。MedRAX 在问题与答案之间加入了**选工具、执行工具、读取结果、继续推理**的循环。

例如，需要定位异常时，Agent 可以选择 grounding 或分割工具；需要评估疾病时可以调用分类模型。能不能调用工具、是否该信工具输出、何时已经有足够证据，是 Agent 层需要解决的问题。这个例子用于理解机制，不是本站实际运行的病例。

## 1. 三分钟摘要（中文导读）

胸部 X 光对疾病管理和患者照护十分重要。已有专用模型能完成不同胸片任务，但通常孤立运行。MedRAX 将胸片分析工具与多模态大语言模型整合为统一 Agent 框架，根据复杂医学问题动态调用模型，不要求额外训练。

作者还提出 ChestAgentBench，包含七类、2,500 道复杂医学问题，用于评估该框架。实验比较了开源与商业模型，作者报告 MedRAX 获得更好的表现。这里的“更好”指论文所设定的 benchmark，不等于已证明能在真实医院安全替代医生。

**来源**：[ICML/PMLR 正式摘要](https://proceedings.mlr.press/v267/fallahpour25a.html)。本节为中文概述。

## 2. 核心方法：想、调用、观察，再继续

论文以 ReAct 思路组织推理，核心是多模态 LLM、短期记忆与专用工具。

### 2.1 它到底怎么做？

1. 读取用户问题、图像和当前记忆。
2. 判断还需要什么信息，选择工具与参数。
3. 执行工具，取得结构化结果。
4. 将观测结果写入上下文，决定继续调用还是给出最终答案。

工具由模块化接口接入，而不是每个模块都称为一位“医生”。**一个推理 Agent 也可以是 Agent 系统**；多智能体数量不是分类的必要条件。

## 3. 医学工具提供什么证据

| 工具类别 | 论文中的例子 | 返回的证据 |
|---|---|---|
| 视觉问答 | CheXagent、LLaVA-Med | 对当前图像问题的回答 |
| 分割 | MedSAM、ChestX-Det 分割模型 | 区域或像素级掩码 |
| 定位 | Maira-2 | 文本描述对应的位置 |
| 报告生成 | 专用报告生成模型 | 胸片描述文本 |
| 疾病分类 | TorchXRayVision | 预定义类别预测 |
| 图像生成与处理 | RoentGen、DICOM 处理工具 | 生成图像或处理后的数据 |

**不能混淆证据等级**：分割掩码、分类分数、另一个模型生成的报告、合成图像，不是同一种证据。生成出来的胸片不能充当患者实际病变的观测；流畅的工具报告也可能出错。

## 4. ChestAgentBench 怎么读

正文描述该 benchmark 由 675 个 Eurorad 病例构建，包含 2,500 道六选一问题，覆盖 detection、classification、localization、comparison、relationship、diagnosis 和 characterization 七类。

在论文报告的整体 accuracy 中：

| 方法 | ChestAgentBench accuracy（%） |
|---|---:|
| MedRAX | 63.1 |
| Llama-3.2-90B | 57.9 |
| GPT-4o | 56.4 |
| CheXagent | 39.5 |
| LLaVA-Med | 28.7 |

**数字来源**：[arXiv v2 实验结果](https://arxiv.org/html/2502.02673v2)；是作者报告值，本站未复算。不同模型的工具可用性和推理资源不同，不能将这张表当作等成本的模型能力排名。

论文还评估了胸片相关 benchmark、报告生成和 VQA。先分清每个任务的指标与输入信息，再比较结果；不要把多项任务指标混成一个“临床准确率”。

## 5. 最值得检查的失败路径

论文指出工具结果冲突、多工具计算开销，以及缺乏不确定性量化等限制。

阅读时按一条链检查：**选错工具 → 工具输出有误 → Agent 没有识别冲突 → 错误结果进入最终答案**。即使单个工具的性能较好，组合系统也不自动可靠。

值得记录的是工具选择、参数、返回证据、调用次数和最终答案引用了哪一条证据。缺少这些轨迹，只能看到答案，无法分析 Agent 层到底带来了什么。

## 6. 代码与复现边界

[作者仓库](https://github.com/bowang-lab/MedRAX)提供框架与数据入口。完整工作流会涉及多种工具模型、权重、依赖和外部推理服务；“无需额外训练”不等于“无需 GPU、模型权重或 API 成本”。

本站没有核验当前 API 兼容性、显存需求和环境安装成功率。开始运行前，先按仓库当前 README 确认服务与权重，再选择一个明确任务；不要直接使用真实可识别患者数据。

## 7. 与病理 Agent 的连接

- [MDAgents](?domain=medical-agent&paper=01-mdagents)：重点是协作结构；MedRAX 重点是工具选择与执行。
- [MedAgent-Pro](?domain=medical-agent&paper=04-medagent-pro)：进一步区分疾病级计划与患者级证据步骤。
- [WSI-Agents](?domain=pathology&paper=40-wsi-agents)：病理场景同时使用多个模型与核验模块。
- [HistoSelect](?domain=pathology&paper=15-histoselect)：可学习问题条件化选区，但它本身不是工具调用闭环。

**阅读产出**：选一个论文案例，列出问题、被调用工具、观测结果和停止条件；分别标注原始图像证据与工具生成文本。

## 8. 原文与代码

- [ICML 2025 正式论文页](https://proceedings.mlr.press/v267/fallahpour25a.html)
- [正式论文 PDF](https://raw.githubusercontent.com/mlresearch/v267/main/assets/fallahpour25a/fallahpour25a.pdf)
- [方法与实验正文：arXiv v2](https://arxiv.org/html/2502.02673v2)
- [作者代码：bowang-lab/MedRAX](https://github.com/bowang-lab/MedRAX)

**证据说明**：会议归属由 PMLR 确认，机制与表格来自论文正文。本文是研究阅读材料，不是临床使用说明。
