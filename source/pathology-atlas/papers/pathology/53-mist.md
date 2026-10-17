# 53｜MIST：让基因组 token 先去提问，再读切片

**论文**：MIST: Multimodal Survival Prediction with Genomic-Guided Histology Attention，arXiv:2609.21811v1（cs.AI / cs.CV，2026-09-18 提交；MICCAI 2026 COMPAYL Workshop 录用，11 页、2 图、4 表）  
**定位**：病理—基因组多模态生存预测、基因组引导的交叉注意力、外部队列泛化  
**精读核验**：依据 arXiv v1 的摘要与 §1–5、Table 1–4，以及官方仓库 `samiyavuuz/MIST` 的 README、`main.py`、`eval.py`、`example_single_run.sh`、`mist_ablations.sh`、`env.yml`、`LICENSE`（2026-10-13 核查）；**尚未进行复现实验**，本站未执行官方代码、未训练任何模型、未复现任何 C-index。

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/mist-story.html)** — 含四处交互（注意力流向流程图、Table 2 的 C-index/tAUC 条形图、VRM 精确-k 掩码演示、Table 4 消融相对降幅重算）、七张公式卡与官方仓库的真实命令。

## 原文摘要

> Multimodal survival models can combine complementary prognostic information from whole-slide images and genomic profiles, but effective fusion remains challenging amid external cohort shift and computational complexity. To address these challenges, we propose MIST, multimodal survival prediction with genomic-guided histology attention. MIST represents genomic features as tokens and allows them to query compact foundation-model-derived histology context tokens before survival prediction. This design enriches molecular information with histology context rather than merging separately encoded modalities only at the final stage. Training combines discrete-time survival prediction with genomic feature masking, WSI dropout, and paired WSI-genomics contrastive alignment. Across four external evaluations in colon, renal, lung, and glioblastoma cohorts, MIST improves external C-index over standard fusion baselines in the primary comparisons. These results support genomic-guided histology attention as a compact and effective strategy for multimodal oncology outcome prediction. Our code is available at https://github.com/samiyavuuz/MIST .

*来源：arXiv:2609.21811v1（https://arxiv.org/abs/2609.21811）。逐字原文，未改写、未压缩；原文末句的 "at" 前后空格与用词保持原样。*

## 中文摘要

> 多模态生存模型能够把来自全切片图像与基因组图谱的互补预后信息结合起来，但在外部队列偏移与计算复杂度的双重压力下，有效的融合仍然困难。为应对这些挑战，我们提出 MIST，即带基因组引导组织学注意力的多模态生存预测。MIST 把基因组特征表示为 token，并让它们在生存预测之前去查询由基础模型导出的紧凑组织学上下文 token。这一设计用组织学上下文来丰富分子信息，而不是只在最后阶段合并两个分别编码的模态。训练把离散时间生存预测与基因组特征掩码、WSI dropout，以及成对的 WSI–基因组对比对齐结合起来。在结肠、肾、肺与胶质母细胞瘤队列的四项外部评估中，MIST 在主要比较里相对标准融合基线提升了外部 C-index。这些结果支持把基因组引导的组织学注意力作为一种紧凑而有效的策略，用于多模态肿瘤结局预测。我们的代码可在 https://github.com/samiyavuuz/MIST 获取。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![MIST 论文框架图](/papers/pathology/53-mist-pipeline.png)

> **原文图注**：Figure 1: Overview of MIST. (1 - Top) Genomic features and WSI are separately embedded, and genomic tokens are cross-attention-enriched into E^hist. (3 - Bottom) From a multimodal input sequence, a CLS token is generated through a Transformer encoder, and used for survival prediction. (2 - Middle) Training-only: contrastive alignment of the CLS token and histology embedding. Solid arrows: training/inference forward path. Dashed modules: training-only operations.

*图源：https://arxiv.org/html/2609.21811v1（Figure 1 原图，直接取自论文页面，未重绘、未描摹；官方仓库 `assets/mist-fig-miccai.jpg` 为同一张图的高分辨率版本）。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。看完本节和第 1 节就可以先停，需要动手时再往下读。

### 0.1 把它想成什么？

大多数多模态模型的做法是：基因读一遍、切片读一遍，各自得到一个向量，最后才把两个向量拼起来。MIST 换了个顺序——先给每条基因组特征发一个“提问权”，让它自己去切片里挑一段最相关的组织学描述，拿回来再写进自己的笔记里。等所有特征都补充完，模型才用这叠笔记预测生存。

### 0.2 它为什么出现？

两个动机。一是**信息位置**：如果形态的预后含义本来就取决于分子背景（同样的细胞排列，对一个突变型患者是好消息、对另一个是坏消息），那么“各自编码、最后拼接”会把这种交互丢在门外。二是**队列现实**：训练集和外部医院的数据在染色、扫描仪、患者构成、尤其是**分子检测 panel** 上都不一样；外部队列常常少了训练时用到的基因，模型必须有办法在“证据不全”时仍然工作。

### 0.3 它到底怎么做？

1. 把每位患者的基因组向量拆开：每个特征独立编码成一个 128 维 token。
2. 用 TITAN（切片级基础模型）把每张 WSI 编码成 768 维向量，多张切片取平均，再用**一个线性层**同时压出 4 个“组织学上下文 token”和 1 个“切片摘要 token”。
3. 让基因组 token 当 query，4 个上下文 token 当 key/value，做一次多头交叉注意力——每个基因特征因此拿到属于自己的组织学补充。
4. 把 `[CLS]`、切片摘要 token、补充后的基因组 token 拼成一个序列送进两层 Transformer；取 `[CLS]` 输出过一个线性头，得到 4 个时间区间的风险。
5. 训练时额外做三件事：随机遮掉一部分基因组特征（VRM）、随机丢掉整张切片的表示（WSI dropout）、以及让 `[CLS]` 表示与配对切片表示做对比对齐（InfoNCE）。

### 0.4 先认清这些词

- **token**：序列模型里的一个“格子”，这里指一条基因组特征或一段组织学上下文。
- **query / key / value**：交叉注意力里“谁提问、拿什么去匹配、取回什么内容”；这里基因提问，切片内容回应。
- **交叉注意力（cross-attention）**：一个模态的序列去读另一个模态的序列；与“各自编码再拼接”的区别在于特征级的、样本级的交互发生在编码阶段之前。
- **context token**：不是原始 patch，也不是整张切片的单一向量，而是从切片向量投影出的 4 个可学习的“组织学总结”，供不同基因特征分别取用。
- **VRM（variable-rate masking）**：训练时按可变比例遮住已观测的基因组特征，逼模型不要只依赖少数几个主导特征。
- **WSI dropout**：以一定概率整张切片的表示不参与训练，模拟“这位患者没有切片”。
- **InfoNCE**：一种对比损失，拉近同一患者的分子表示与切片表示、推开其他患者的。
- **离散时间生存预测**：把时间切成若干区间，模型对每个区间输出一个“该区间内发生事件”的条件概率（hazard），再连乘得到生存曲线。
- **C-index**：一致性指数，衡量预测风险排序与真实生存顺序的一致程度，0.5 等于随机。
- **tAUC**：时间相关的 AUC，衡量随时间变化的判别能力。
- **删失（censoring）**：患者到随访结束时仍未发生事件，只能确定生存时间“至少”有多长。

### 0.5 输入和输出

输入：每位患者的基因组特征（突变 / 拷贝数，不同癌种的特征数目不同）、由 TITAN 预提取的切片级 768 维嵌入（可缺）、生存时间与删失标记。  
输出：4 个时间区间的风险 logit → hazard → 生存曲线；用于 C-index 的标量风险分数是各区间生存概率之和取负（Eq.2 下方）。

### 0.6 最容易误解的地方

被“丰富”的是**基因组 token**，不是切片表示——切片始终是一个学好的整体表示，MIST 没有反过来让切片 patch 去读基因。这意味着它不做 patch 级的空间定位，也不产出“某个基因对应某块组织”的热图。另外，交叉注意力权重只是统计关联，不能当作基因—形态的因果证据。

**现在只记住一句话：MIST = 基因组 token 当 query，去查 4 个切片上下文 token，再把补充后的笔记送进 Transformer 预测生存。**

## 1. 三分钟摘要与推荐理由

已有病理—基因组生存模型大多在**模态级嵌入**、**粗粒度组学分组**或**预定义通路**上定义交互：PathOmic 用 Kronecker 积融合组织学图与基因组特征，MCAT 让基因组类别与 WSI patch token 做共注意力，PORPOISE 把泛癌融合规模化，SurvPath 建模通路—组织学的稠密交互。论文的判断是：这些设计限制了“**单条被观测到的基因组特征**如何调制切片信息的整合”，而临床上同一形态在不同分子背景下含义不同，且各队列可用的基因组证据本就不一致。MIST 把交叉注意力下沉到特征级：基因组 token 作 query，切片上下文作 key/value。

值得学的不是某个新算子，而是三个工程选择：把切片表示**压成 4 个 token 的窄瓶颈**（让不同特征能分开取用，同时参数量与计算量都很小）；训练时**同时模拟两种缺失**（特征级 VRM + 模态级 WSI dropout）；以及用 InfoNCE 把生存表示**钉在配对切片表示上**，防止模型靠模态特有的捷径过拟合。四个癌种、两个公开外部队列 + 两个私有队列的外部评估，加上 KIRC-CPTAC 上显著的 KM 分层（log-rank p=0.0098），让它比多数只有单队列结果的多模态生存论文更接近“可以落地验证”。

## 2. 问题及研究位置

论文把问题写成两句话：外部结局预测难，是因为在 TCGA 类队列上训练的模型要迁移到患者构成、组织制备、切片可得性与分子检测设计都不同的独立机构；现有方法则通常只在模态级嵌入上定义交互。作者列出的三条贡献是：（1）基因组引导的组织学注意力模块，通过特征级交叉注意力把切片上下文整合进基因组 token 序列；（2）把离散时间生存预测与成对 WSI–基因组 InfoNCE 对齐组合起来的训练框架；（3）覆盖多个肿瘤队列、证明优于标准融合基线的外部评估。

与相邻工作的差别，以及本篇的位置：

- 与 **MCAT（站内 [20-mcat](20-mcat.md)）**：MCAT 的 query 是**功能相关的基因分组**（6 组），key/value 是**数万个 patch 特征**，目的是在压缩超长序列的同时得到可可视化的共注意力热图；MIST 的 query 是**逐条基因组特征 token**，key/value 是**TITAN 压出的 4 个切片级上下文 token**，没有 patch 级空间分辨率。前者把注意力当解释工具，后者把它当融合算子并在外部队列上比性能。
- 与 **PORPOISE / PathOmic**：它们分别用门控外积与 Kronecker 积在模态表示层面融合，属于“先各自编码、再融合算子”的范式；MIST 把交互前移到编码阶段之前。
- 与 **SurvPath**：SurvPath 在通路与组织学之间建稠密交互，仍然要求先有通路分组；MIST 直接在原始特征粒度上交互，因而对特征集合本身的变化（如外部 panel 变窄）更直接。
- 与 **SHIFT**（同组前作，arXiv:2607.07725）：MIST 的基因组分支、缺失处理、离散时间生存目标与 `exact_k` 遮码策略都继承自 SHIFT 的“缺失感知基因组 Transformer”；MIST 的新增部分是切片侧、交叉注意力、WSI dropout 与 InfoNCE。

## 3. 核心方法和数据流

```text
输入（每位患者，患者级划分）
  基因组向量 x ∈ R^d（逐癌种不同：COAD 643、GBM 36、KIRC 920、LUSC 197）
    → 逐特征独立编码：线性 + SELU + AlphaDropout（SNN），D=128 → E ∈ R^{d×D}
  WSI 集合 S = {s_ℓ}
    → TITAN 编码：h_ℓ = φ_WSI(s_ℓ) ∈ R^768；多切片取平均 h = (1/L)Σ h_ℓ
    → 单个线性层同时投影出 N_ctx = 4 个上下文 token C ∈ R^{4×D} 与切片摘要 w ∈ R^D

融合（编码阶段之前，特征级）
  E^hist = MultiHeadAttn(E, C, C)          # Eq.1：基因 token 作 query，C 作 key/value
  Z_i = [CLS, w_i, E^hist_i]               # 序列长度 = 2 + d

预测
  → 2 层 Transformer 编码器（4 个注意力头）→ 取 [CLS] 输出 g_i
  → SELU + dropout 的线性投影 D→256 → 生存头 ŷ = W_o g̃ + b_o
  → K=4 个区间的 hazard ĥ_j = σ(ŷ_j)，生存概率 S_j = Π_{m=0..j}(1 − ĥ_m)（Eq.2）
  → C-index 用标量风险分数 r = −Σ_{j=0..K-1} S_j

训练（L = L_NLL + L_InfoNCE，τ = 0.07；Eq.3–4）
  ① 离散时间 NLL：K=4 个区间按“每个训练折内未删失事件时间的四分位数”划分；
     损失由 1 个删失项 + 2 个事件项组成
  ② VRM：每患者每 epoch 抽 k_i ~ Uniform{0,…,⌊f·d⌋}（f=0.5），额外遮住 k_i 个已观测特征
  ③ WSI dropout：以 p_wsi = 0.3 丢掉整张 TITAN 嵌入
  ④ InfoNCE：两个 Linear–GELU–Linear 头 q_g、q_w 把 g_i 与 h_i 投到共享 D 维空间并归一化，
     温度 τ=0.07，对角为正样本、批内其余为负样本；仅当 minibatch 中 ≥2 个样本同时有基因组与切片时计算

缺失处理（贯穿全架构）
  自然缺失（NaN）与 VRM 遮住的位点：用二值可用性掩码排除出自注意力（图 1 左下角的 positional mask）
  没有切片 / 被 WSI dropout 丢掉：跳过交叉注意力，并在 Transformer 输入里遮蔽 w token
```

三条最该记住的设计：

1. **交互放在编码之前、粒度放在特征级。** 单条基因特征拿到的是“它自己的”组织学上下文，而不是整患者的平均切片向量；这是与晚期融合、双线性融合、对称共注意力最本质的区别。
2. **4 个上下文 token 是刻意的窄瓶颈。** 论文的理由是：多 token 提供一个小的“可学习字典”，允许不同基因组特征给出不同的注意力权重；同时保持融合参数量与计算量很小，并与 SHIFT 骨干的注意力头数（4）对齐，而不引入额外调参的超参数。
3. **两种缺失被分开建模。** VRM 针对特征级基因组缺失，WSI dropout 针对切片级缺失；论文用“训练时制造缺失”来换取外部队列的稳健性，这也是它在 panel 结构最不匹配的 LUSC-US 上仍有提升的解释。

## 4. 论文证据与实验范围

- **数据（Table 1）**：四个癌种 COAD / KIRC / LUSC / GBM，TCGA 作开发、外部作测试。训练患者数分别为 423 / 488 / 465 / 532（GBM 配对控制子集 276）；外部为 COAD→CPTAC（101 例，删失率 93.1%，约 7 个事件）、KIRC→CPTAC（94 例）、LUSC→US 私有队列（102 例）、GBM→German 私有队列（132 例）。特征空间按癌种独立保留（来自 LinkedOmics，不用泛癌交集）：COAD 143 个复发突变基因 + 500 个 CNV 高方差基因、KIRC 920 个基因级 CNV log2 比值、GBM 1 个突变（IDH1）+ 35 个 CNV（含 1p/19q 共缺失）、LUSC 内 197 个突变基因而外部只有 22 个。未测值保持 NaN，不做插补。
- **主结果（Table 2，外部 C-index | tAUC，五折均值±标准差）**：MIST 分别是 COAD-CPTAC 0.669±0.07 | 0.779±0.09、GBM-German 0.584±0.05 | 0.607±0.06、KIRC-CPTAC 0.646±0.02 | 0.651±0.02、LUSC-US 0.571±0.03 | 0.606±0.05；四个主要外部评估中 MIST 都是最高。论文报告的相对提升：COAD-CPTAC 相对最优非 MIST 比较对象 C-index +9.3% / tAUC +9.6%；LUSC-US 相对最优基线 C-index +7.1% / tAUC +8.6%。
- **单模态对照**：Genomics-only 在四个外部队列上都在 0.50 附近徘徊（0.510 / 0.502 / 0.500 / 0.489 的 C-index），论文据此认为“把组织学上下文融进基因组 token”才是拿到可迁移风险表示的关键；WSI-only 在 KIRC-CPTAC 0.627、LUSC-US 0.545，是两个队列上最强的单模态对照。
- **风险分层（Table 3）**：折平均风险做中位数切分后，KIRC-CPTAC 的 KM 分层显著（C-index 0.651，95% CI 0.524–0.784，log-rank p=0.0098）；LUSC-US 只有趋势（0.595，p=0.0636）；COAD-CPTAC（0.699，p=0.4478）与 GBM-German（0.586，p=0.1594）未达显著。论文自己指出：事件数少、删失多的队列里，分层检验比折内排序指标更敏感。
- **配对 GBM 控制**：把所有患者限制为“同时有切片与基因组”后（训练 532→276），MIST 只有 0.491±0.08 | 0.493±0.11，低于 Co-Attn 的 0.555（表内以粗体标为该列最优基线）。论文的解释是：该子集消掉了 MIST 的 VRM / WSI dropout / 基因组引导注意力本来要利用的模态异质性，因此这是**设计取向**而非根本缺陷——但这也是全文唯一一个 MIST 输给基线的列，值得单独记住。
- **消融（Table 4，KIRC-CPTAC / LUSC-US）**：完整 MIST 0.646±0.02 / 0.571±0.03；去掉组织学注意力 0.546±0.04 / 0.530±0.06；去掉 InfoNCE 0.578±0.04 / 0.494±0.02；去掉 VRM 0.642±0.01 / 0.577±0.05；去掉 WSI dropout 0.610±0.07 / 0.569±0.05。论文的读法是：组织学注意力与 InfoNCE 是主要贡献者（相对降幅 15.3% / 7.2% 与 10.5% / 13.5%），WSI dropout 影响较小，VRM 因队列而异（在 LUSC-US 上去掉 VRM 反而更高）。
- **范围限制（作者自陈 + 本站补充）**：外部队列规模不大；**未纳入任何标准临床协变量**（年龄、分期等），作者把“融入患者元数据”与“加插补基线”列为未来工作；LUSC 与 GBM 的外部队列为私有数据，代码仓库只提供 COAD/KIRC→CPTAC 的驱动脚本；C-index/tAUC 都是五折均值±标准差，未报告逐折显著性检验。

## 5. 复现与审计重点

- **没有任何患者级数据与 checkpoint 随仓库发布。** README 明确写：仓库不含基因组/临床 CSV，也不含切片嵌入；三类输入都要自己重建——基因组与临床 CSV（LinkedOmics + CPTAC Data Portal）、5 折划分目录（`splits/<cancer_type>/<which_splits>/`）、以及**用 TITAN 自己预提取**的 768 维切片级嵌入（`data.npy`/`filenames.npy`，MIST 不做特征提取）。TCGA 切片走 GDC，CPTAC 切片走 TCIA（`CPTAC-CCRCC`、`CPTAC-COAD`）。
- **两个外部队列拿不到。** LUSC-US 与 GBM-German 是私有队列，作者无权重分发；因此**站内能完整跑到的只有 COAD→CPTAC 与 KIRC→CPTAC 两列**，Table 2 的另外两列与 Table 3 的两行都需要向作者申请。
- **`--wsi_dropout_p` 的默认值与论文不一致。** 论文写 p_wsi = 0.3，而 `main.py` 里该参数的默认值是 **0.5**；官方脚本（`example_single_run.sh`、`mist_ablations.sh`、`mist_main.sh`）都显式传 `--wsi_dropout_p 0.3`。自己改脚本时若漏传，就会在论文未报告的超参下训练。
- **消融脚本只覆盖 KIRC-CPTAC。** `mist_ablations.sh` 的注释与目录都写明是 `kirc_cptac`，而论文 Table 4 同时报告了 LUSC-US；README 还把消融称作 “Table 3”（论文里 Table 3 是风险分层、Table 4 才是消融），两者编号不对齐，按论文引用时要自己对上。
- **消融变体的实现细节**（`mist_ablations.sh`）：`no_infonce` 用 `--infonce_lambda 0`（损失仍算但权重为零）；`no_wsi_dropout` 用 `--wsi_dropout_p 0`；`no_vrm` **不加 `--apply_miss`**；`no_hist_attn` 保留 `--use_wsi --wsi_dropout_p 0.3` 但**不加 `--wsi_cross_attn`**，即“只留切片摘要 token、不做交叉注意力富集”。复现某一行时必须对得上这四处的差别。
- **相对降幅可以按表内数值重算。** 用 Table 4 的四位小数重算：KIRC 去组织学注意力 = 1 − 0.546/0.646 = **15.5%**，论文正文写 15.3%；LUSC 去组织学注意力 = 1 − 0.530/0.571 = 7.2%，去 InfoNCE = 1 − 0.494/0.571 = 13.5%，KIRC 去 InfoNCE = 1 − 0.578/0.646 = 10.5%，都与正文一致。第一处差异（0.2 个百分点）大概率来自论文用的是未舍入的原始值，属于本站按表重算的观察，不是对结论的挑战。
- **“最优基线”的定义在正文里并不统一。** COAD-CPTAC 的 +9.3% 是以 Co-Attn-M（0.612）为分母；LUSC-US 的 +7.1% 只能以**融合基线** Bilinear-M（0.533）为分母得到（0.571/0.533 = 1.071），若把单模态 WSI-only（0.545）也算作基线，则只有 +4.8%（0.571/0.545）。KIRC-CPTAC 上 WSI-only（0.627）本身高于全部融合基线，MIST（0.646）只是小幅超过它。
- **CSV 与脚本是硬编码的。** 驱动脚本把解释器写死为 `PYTHON="$HOME/miniconda3/envs/mist/bin/python"`，任务名与划分目录名（如 `updated_kirc_mist_survival`、`5foldcv4KIRC_CPTAC_b_mist`）也写死在脚本里；换机器需要改脚本本体，而不能只改参数。
- **成本分层**：这套方法的算力需求很轻（两层 Transformer + 一个交叉注意力，基因组维度 36–920，训练批大小 16、最多 200 epoch），**真正的成本在数据准备**：TCGA/CPTAC 全切片下载、以及用 TITAN 逐张切片推理出 768 维嵌入。论文未报告训练硬件与耗时，此处无法给出可比数字。
- **仓库状态**：`main` 分支只有 1 个提交、0 个 fork、3 个 star，MIT 许可证（Copyright (c) 2026 Muhammet Sami Yavuz）；`models/`、`datasets/`、`utils/`、`splits/`、`assets/` 五个目录均在，但无 `requirements` 之外的锁定版本细节（环境由 `env.yml` 提供）。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（三块：上方嵌入与交叉注意力、中间对齐、下方序列与生存头）→ `§2`（Eq.1 交叉注意力与 Z 的构造）→ `§2.1`（VRM 的 exact-k 采样与 WSI dropout 的缺失语义）→ `§2.2`（Eq.2–4：离散时间生存与 InfoNCE）→ `§3.1`（四个癌种的特征整理与删失率）→ `§3.2`（融合基线与单模态基线的实现差异）→ `Table 1`（队列规模与模态可用性）→ `§4.1` + `Table 2`（主结果与单模态对照）→ `§4.2` + `Table 3`（风险分层）→ `§4.3` + `Table 4`（消融）→ `§5`（局限与未来工作）。

## 7. 前后关联

- 与 [20-mcat](20-mcat.md)（MCAT，ICCV 2021）**最直接的对照**：两者都是“基因组引导的 WSI 生存预测”，但 query 与 key/value 的层级完全不同。MCAT 用**6 组功能基因**去查询**数万个 patch 特征**，目的是在共注意力的同时把超长序列压成 6 个视觉概念，产出可可视化的基因—区域关注图；MIST 用**逐条基因组特征**去查询**TITAN 压出的 4 个切片级上下文 token**，没有空间分辨率，也不产出热图，换来的力是外部队列泛化（四个癌种、五个外部评估列）。另一个差别在缺失：MCAT 假设每位患者都有组学与切片，MIST 把缺失写进架构（NaN 掩码 + VRM + WSI dropout）。要理解“基因引导”这条线怎么从 2021 年走到 2026 年，两篇连着读最有效。
- 与 [11-survpath](11-survpath.md)、[26-ps3](26-ps3.md)、[27-dispro](27-dispro.md) 对照：这三篇都在**生物学分组**（通路、基因集、先验网络）这一层做交互，MIST 反过来证明在**原始特征粒度**上直接交互、配合训练时的缺失模拟，也能在外部队列上拿到稳定提升；读完可以判断“分组”到底带来了什么。
- 与 [32-prov-gigapath](32-prov-gigapath.md)、[13-pathdino](13-pathdino.md)、[10-tangle](10-tangle.md) 对照：MIST 的切片侧完全建立在基础模型之上（论文使用 TITAN，并把 GIGAPATH、TANGLE 列为“让融合变得可行”的前提）；换句话说，它不训练切片编码器，替换切片 backbone 是一个现成的实验轴。
- 与 [19-path2space](19-path2space.md)、[33-he2rna](33-he2rna.md) 对照：这两篇研究“从形态推断分子”，MIST 相反——**用分子去引导形态的读取**；放在一起看能区分“预测分子”与“用分子调制形态表示”这两类目标。
- 论文的基因组骨干来自同组前作 SHIFT（arXiv:2607.07725，不在本站）；论文引用的 LOSO / 插补类基线也未在本仓库，若要补齐“缺失基因组”支线，可优先补 SHIFT。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2609.21811)
- [arXiv HTML 正文](https://arxiv.org/html/2609.21811v1)
- [官方代码仓库 samiyavuuz/MIST](https://github.com/samiyavuuz/MIST)
- [OpenReview 投稿页（README 指明含完整方法与消融）](https://openreview.net/forum?id=0WoZYerMW2)
- [TITAN（切片级基础模型，切片嵌入来源）](https://github.com/mahmoodlab/TITAN)
- [故事式 HTML 精读页](/pathology-atlas/learning/mist-story.html)
