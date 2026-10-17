# 52｜CPathOGen：把病理模型的“看”拆成三个可控旋钮

**论文**：CPathOGen: Spatially and Morphologically Controlled H&E Counterfactuals for Probing Pathology Models，arXiv:2610.00602v1（eess.IV / q-bio.QM，2026-09-30 提交）  
**定位**：可控反事实生成、细胞空间与核形态条件、病理编码器敏感度审计  
**精读核验**：依据 arXiv v1 的摘要与 §1–5、Table 1–4，以及官方仓库固定提交 `c5e0c5c` 与 Hugging Face 模型卡整理（2026-10-13）；**尚未进行复现实验**，本站未执行官方代码。

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/cpathogen-story.html)** — 含三处交互（细胞地图构造、Table 1–3 原表条形图、BNR 计算器）、七张公式卡与官方仓库的真实命令。

## 原文摘要

> Computational pathology models infer biologically and clinically meaningful outcomes from histology, but their predictions are shaped by complex, intertwined tissue signals whose roles are important to understand. Common pixel- and feature-space perturbations can produce implausible tissue, making model responses difficult to interpret. We introduce CPathOGen, a conditional latent-diffusion framework for generating paired H&E counterfactuals with explicit controls over cellular spatial organization, nuclear morphology, and stain appearance. Cellular maps condition spatial structure through a spatial encoder, while a morphology/appearance vector modulates denoising through blockwise feature-wise linear modulation (FiLM). On held-out H&E tiles, CPathOGen generates visually plausible tissue with improved distributional agreement after spatially guided selection, as reflected by lower Fréchet Inception Distance (FID) and Kernel Inception Distance (KID); generated cells track requested abundance and position, and measured morphology and color vary monotonically with their controls. We use these verified interventions to probe pathology encoders with endpoint heads, task-specific classifiers, and survival models. Responses are quantified using total variation distance and prediction-flip rate. We further introduce the Biology-Nuisance Sensitivity Ratio, a metric that contrasts model sensitivity to biologically motivated morphology and spatial factors with sensitivity to non-biological, stain-related nuisance variation. CPathOGen provides a practical, fidelity-audited framework for evaluating robustness and controlled feature sensitivity in computational pathology model.

*来源：arXiv:2610.00602v1（https://arxiv.org/abs/2610.00602）。逐字原文，未改写、未压缩；原文末句的语法与用词保持原样。*

## 中文摘要

> 计算病理模型能从组织学图像推断具有生物学与临床意义的结果，但它们的预测由复杂且相互交织的组织信号塑造，理解这些信号的作用很重要。常见的像素空间与特征空间扰动会产生不真实的组织，使模型响应难以解释。我们提出 CPathOGen，一个条件潜空间扩散框架，用于生成配对的 H&E 反事实图像，并对细胞空间组织、核形态与染色外观提供显式控制。细胞地图通过空间编码器为空间结构提供条件，而一个形态/外观向量通过逐块的 FiLM（feature-wise linear modulation）调制去噪过程。在留出的 H&E 图块上，CPathOGen 生成视觉上合理的组织，并在空间引导筛选之后取得更好的分布一致性，表现为更低的 Fréchet Inception Distance（FID）与 Kernel Inception Distance（KID）；生成的细胞跟踪了请求的数量与位置，测得的形态与颜色随其控制量单调变化。我们用这些经过验证的干预去探测带有终点头的病理编码器、任务特定分类器与生存模型，响应用总变差距离（TVD）与预测翻转率量化。我们进一步提出 Biology-Nuisance Sensitivity Ratio（BNR），该指标对比模型对生物学动机的形态与空间因素的敏感度，与其对非生物学染色相关干扰变化的敏感度。CPathOGen 提供了一个实用的、经过保真度审计的框架，用于评估计算病理模型的稳健性与可控特征敏感度。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![CPathOGen 论文框架图](/papers/pathology/52-cpathogen-pipeline.png)

> **原文图注**：Figure 2: Overview of CPathOGen condition construction and synthesis. CellViT++-derived weak labels provide a cellular spatial map and a morphology/appearance embedding. The spatial encoder conditions the latent diffusion model on cellular organization, while FiLM modulates denoising with global morphology and stain attributes. These complementary controls enable realistic H&E synthesis with separately specified spatial and morphological properties.

*图源：https://arxiv.org/html/2610.00602v1（Figure 2 原图，直接取自论文，未重绘、未描摹）。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。看完本节和第 1 节就可以先停，需要动手时再往下读。

### 0.1 把它想成什么？

给同一个病人拍两张照片，只有一处不同：一张里免疫细胞挤在肿瘤中间，另一张里免疫细胞退到外围。两张都像真的组织，唯一的差别就是“排布”。CPathOGen 就是一台能按你的要求造出这种配对图的机器，然后拿两张图去问病理模型：“你的答案变了吗？”

### 0.2 它为什么出现？

想弄清模型靠什么做判断，最直接的办法是改图再看预测（反事实）。但直接给像素加噪声、或者让优化器“把预测推向某一类”，都会一次改动很多东西：核变大往往同时染色变深、细胞变密。改动纠缠在一起，你就没法回答“到底是哪一项影响了预测”。所以作者把顺序倒过来：先声明改哪一项，其余全部锁死。

### 0.3 它到底怎么做？

1. 用一个细胞识别模型（CellViT++）把每张 H&E 图块读成两样东西：一张“哪些细胞在哪、属于哪一类”的地图，和一组概括核形状与颜色的数字。
2. 用这两样东西当条件，训练一个扩散模型生成 H&E 图块。
3. 同一个条件生成若干张，用细胞识别再检查一遍“请求的变化是否真的出现了”，只留下最听话的那张。
4. 把配对的两张图（只差一个旋钮）分别送进冻结的病理模型，测它的输出变了多少。

### 0.4 先认清这些词

- **H&E**：医学上最常见的染色，细胞核偏紫、细胞质偏粉红。
- **扩散模型**：从纯噪声出发，一步步去噪生成图像的模型；这里生成的是病理图块。
- **潜空间（latent）**：先把大图压成小得多的表示（512×512 变成 64×64×4），在小空间里做扩散，省算力。
- **条件（condition）**：你要求模型遵守的输入，这里是“细胞地图 + 一组形态/颜色数字”。
- **弱标签**：由另一个模型自动生成、而非人工标注的标签，可能有错，但便宜。
- **反事实**：假设“如果只把这一项改成那样”，图像会变成什么。
- **TVD（总变差距离）**：两个概率分布之间移动了多少概率质量，用来度量预测变了多少。
- **BNR**：把“对生物因素的敏感度”除以“对拍摄条件（染色、旋转）的敏感度”，大于 1 表示前者更大。
- **FID / KID**：比较两组图像分布有多接近的指标，数值越低表示越接近。

### 0.5 输入和输出

输入是细胞地图与形态/外观数字（可以来自真实图块，也可以手工构造）；输出是 512×512 的合成 H&E 图块，以及它在冻结病理模型上的预测变化记录。

### 0.6 最容易误解的地方

这里的“配对”不是“同一张图的两次编辑结果一定像素级可比”，而是“同一初始噪声、只改一个条件”。未建模的属性仍可能一起变化；合成干预下的预测变化只说明模型在这类图像上的行为，不构成生物学或治疗因果。

**现在只记住一句话：CPathOGen = 先请求一个干预，造出只差这一项的配对图，再拿它去问模型。**

## 1. 三分钟摘要与推荐理由

已有的病理反事实方法（文献里的 DVCE、DiME、DiG-IN，以及病理方向的 MoPaDi）都朝目标预测优化，多属性同时改变导致归因不清；而像素/特征空间的加噪扰动会产生不真实组织，使“预测变了”失去意义。CPathOGen 把反事实重新定义为**请求驱动的干预**：细胞空间组织、核形态、染色外观是三个可分别调节的旋钮，动其中一个、其余保持不变，同一种子生成配对图。

技术上它并不追求新架构，而是把两个条件通道分得很干净：空间图走“潜空间拼接 + 零初始化扩展通道”，形态/外观走“逐块 FiLM 调制”。方法之外，这篇论文有两个值得学的做法：**候选筛选是免预测的**（打分只用细胞分析器，绝不看被审计模型的预测、表征或梯度，且候选数与打分函数在评估前固定），以及**先验证干预、再拿去探测**。

读它的理由：这是目前少见的、把“可解释性”做成一条可执行审计流程的病理工作，而且权重与推理代码公开、L4 级别 GPU 就能跑；它同时给出了一个负面发现（当前 patch 级编码器对“只换排布”的干预几乎不敏感），这比正面结果更有信息量。

## 2. 问题及研究位置

问题的核心是**归因**。热图类解释只回答“模型看向哪里”，回答不了“那一片里哪条属性起了作用”；Adebayo 等人的 sanity check 还说明热图在参数或标签被随机化后可能几乎不变。病理场景另有混杂：染色、医院与扫描仪差异会留在图像里（Howard 等人），模型可能部分依赖这些线索。作者因此把目标定在“扰动可控 + 图像可信”两个条件同时成立的反事实。

与相邻工作的差别写得很明确：

- **Goyal 等人的反事实**检索判别性变化；**DVCE / DiME / DiG-IN** 用扩散先验做分类器引导的编辑；**MoPaDi** 把扩散自编码器接到分类器或多实例模型上，把形态朝目标预测编辑。它们的目标是“朝目标类”，本文的目标是“按请求改一个因子”。
- **可控病理生成**一线（PathologyGAN、PathLDM、PixCell、gigapixel 扩散、Spatial Diffusion、TopoCellGen）分别推进真实感、规模、条件或合成数据增强；论文认为它们都没有提供“对细胞组织、实测核形态与外观的可分离控制”，因而无法做匹配的单因子干预。

本文的位置：不追求生成更逼真的图，而是把生成器当**输入仪器**，用可控、可验证的干预去测外部模型。

## 3. 核心方法和数据流

```text
训练（TCGA-BRCA，1114 张 WSI，20×，512×512 图块，>2 个肿瘤细胞，约 140 万块）
真实 H&E 图块 x → CellViT++ 弱标签 𝒜(x) = {(q_n, y_n, ω_n)}（质心 / 类别 / 轮廓）
    → 空间条件 S：5 通道（肿瘤/炎症/结缔/死亡/上皮），把各类质心用核 κ 光栅化并归一化（Eq.2）
    → 形态/外观条件 m：核大小·周长·偏心率·紧致度·核内梯度·RGB 的均值与离散度，标准化成 16 维（Eq.3）
    → 基座：Stable Diffusion 2.1 潜空间扩散（VAE 冻结，512×512 → 64×64×4）
        · 空间：可训练卷积编码器 E_s 把 S 压到 4×64×64，与带噪潜变量 z_t 拼接成 8 通道；
          U-Net 首层卷积 4→8 扩展，原通道保留预训练权重、新增通道零初始化（Eq.7–8）
        · 形态/外观：每个残差块 f_ℓ 把 m 映射成 (γ_ℓ, β_ℓ)，h′_ℓ = (1+γ_ℓ)⊙h_ℓ + β_ℓ（Eq.9–10）
        · 文本条件固定，不使用提示词
    → 损失：常规 ε-预测 MSE（Eq.6）

推理（单条件 → 配对干预）
同一条件 → 8 个候选种子 x_r = G_θ(S, m, ε_r)
    → 免预测筛选：用细胞分析器重算 Q(x_r, S)，取 r* = argmax Q（Eq.11；不看下游模型的预测/表征/梯度）
    → 配对：固定 ε 与非目标条件，x^(0) = G_θ(S, m, ε) 与 x^(j,δ) = G_θ(ℐ_{j,δ}(S, m), ε)
      剂量 δ ∈ {−2,−1,0,+1,+2}（训练集标准差）；形态、空间、外观三类干预各自只改一类条件（Eq.12–14）
    → 冻结模型 F 的响应：TVD d = ½‖p_f(x^{(j,δ)}) − p_f(x^{(0)})‖₁（Eq.15）与预测翻转率
    → BNR = 生物干预组平均 TVD ÷ 干扰组（染色亮度、旋转）平均 TVD（Eq.17）
```

三条最该记住的设计：

1. **两个条件走两条通路，才能做到“只动一个旋钮”**：空间走潜空间拼接（决定细胞“在哪、是什么”），形态与外观走 FiLM（决定整体的几何与颜色）。首层卷积新增权重零初始化，保证训练从预训练先验平滑接入新条件。
2. **筛选不看被审计模型**：候选数量与打分函数 Q 都在下游评估前固定，否则解释会退化成“挑出模型爱看的样本”。
3. **干预后先验证再使用**：论文用 CellViT++、HoVer-Net、StarDist 三个分析器与“随机真实图块”对照，确认请求的变化确实出现在生成图里，之后才做探测。

## 4. 论文证据与实验范围

- **分布真实性（Table 1，N_R=10,000，与等量独立真实图块比较）**：不筛种子 FID 42.923 / KID 0.02466；八候选空间引导筛选后 FID 36.717 / KID 0.01964；真实对真实 16.369 / 0.00647（用于说明有限样本的残留差异）。
- **空间保真（Table 2，N=1,000）**：总计数 ρ 为 CellViT++ 0.952 / HoVer-Net 0.908 / StarDist 0.928，随机真实图块对照 −0.031；分类型 ρ 依次 0.612 / 0.525 / N/A（StarDist 无类型）；质心 F1@25px 为 0.726 / 0.625 / 0.798（StarDist 只看位置），F1@50px 为 0.773 / 0.668 / 0.831，对照 0.134 / 0.255。
- **形态与外观保真（Table 3）**：跨图 macro ρ 为 0.876 / 0.843 / 0.855；剂量内（同一来源、固定 seed）macro ρ 为 0.986 / 0.986 / 0.929，其中 size、eccentricity、gradient 三项几乎都是 1.000，solidity 为 0.900 / 0.900 / 0.500。
- **模型探测（Table 4，PAM50 四分类与总体生存）**：PAM50 的 AUC 为 ResNet-50 0.7577 / CTransPath 0.8323 / UNI2-h 0.8687，对应 BNR 1.0736 / 1.1434 / 1.2787（患者聚类 95% bootstrap 区间均高于 1）。生存任务每名患者固定 16 个图块、一次干预只替换 1 块，因此 TVD 量级小一个数量级（0.003–0.02），但仍以免疫负荷响应最大；PathLUPI + CONCH 的 C-index 最低（0.5977）而 BNR 最高（1.7572）。
- **论文自己报告的两个非正面结果**：其一，主导的生物干预因编码器而异（形状不规则 / 免疫负荷 / 核增大），没有统一答案；其二，**肿瘤–免疫混合（只重排、不改数量）在三个编码器上响应都是生物组最低**（0.1126 / 0.1194 / 0.1582），说明这些 patch 级编码器对空间排布本身不敏感。
- **范围限制**：单队列（TCGA-BRCA）、单癌种，无外部验证；Table 1 只与自身设置和 real-vs-real 比较，未与其他病理生成方法同表对照；真实性无病理医生读者研究；训练硬件为 8×Tesla V100。

## 5. 复现与审计重点

- **标准化器缺失是第一道墙**：官方 README 与模型卡都写明，历史预处理脚本拟合过 `StandardScaler` 却没有保存，因此本次发布**不提供**可信的“原始特征 → 16 维条件”的转换，并警告不要在一张图或新队列上重拟合后假定与训练一致。任何“换队列做同样干预”的计划都要先解决这一条。
- **条件语义要按发布说明读**：论文图 4 的 eccentricity 列使用的是绝对标准化坐标（20 步、spatial strength 1），与其余列的相对剂量不同；`--set g_mean=-1` 设置的是绝对标准化值，不是相对基线的减一。剂量扫描必须自己算 baseline + dose。
- **筛选与验证同源**：CellViT++ 既是八候选的打分器，又是 Table 2 的三个分析器之一，它那一行（总计数 ρ=0.952）按构造占优；真正独立的证据是 HoVer-Net、StarDist 两行与随机真实图块对照。复现时应把“筛选器换成 HoVer-Net 或三者集成”作为第一批消融。
- **输入不是图片**：空间条件是 `(512,512,5)` 或 `(5,512,512)` 的稀疏质心峰（通道顺序 neoplastic / inflammatory / connective / dead / epithelial），强度为 uint8 或 [0,1] 浮点；不能拿一张渲染好的 RGB 地图当输入。
- **BNR 对分母选择敏感**：用 Table 4 的 PAM50 行 TVD 重算，默认构造与论文报告值最多相差 0.0002（CTransPath、UNI2-h 完全一致到四位小数；ResNet-50 为 1.0734 vs 1.0736，属表内舍入）；但把干扰组从 {染色亮度, 旋转} 缩成 {染色亮度}，ResNet-50 与 CTransPath 的 BNR 会掉到 1 以下（0.9194 与 0.7934）。生存行的 TVD 在表中只有四位小数，同样方式重算与论文值相差约 0.4%–0.6%，属表内舍入。
- **成本分层**：推理级复现（单图、自定义条件、配对编辑，权重约 4.16 GB、L4 级可用）今天就能做；训练级复现需要 TCGA-BRCA 全量 WSI、CellViT++ 对约 140 万图块的推理，以及 8×V100 量级训练。筛选实验还必须具备 CellViT++ 权重与打分协议。
- **仓库状态**：仓库名为 `PathOGen`（README 明确它就是论文的 CPathOGen）；官方提示活跃实验分支存在更晚的协议，复现某张表要用当时记录的分支与配置。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（干预 → 配对图 → 预测变化的总体用法）→ `Fig. 2`（条件构造与合成总览）→ `§3.2`（Eq.1–3：弱标签、空间图、形态向量）→ `§3.3–3.5`（Eq.4–10：潜空间条件、拼接与 FiLM）→ `§3.6`（Eq.11：免预测筛选）→ `§3.7`（Eq.12–14：配对干预）→ `§4.1`（数据与探针设置）→ `Table 1`（真实性）→ `Table 2–3`（保真度与对照）→ `§4.5` 与 `Table 4`（Eq.15–17：TVD、翻转率、BNR）→ `§5`（作者自陈的边界与未来工作）。

## 7. 前后关联

- 与 [TopoCellGen](21-topocellgen.md) 对照：同属病理生成式建模，但目标相反——一个用拓扑约束生成新的细胞布局做数据增强，一个把细胞布局当成**审计模型的输入仪器**，并要求可分离的单因子控制。
- 与 [CellViT](08-cellvit.md) 和 [CTransPath](07-ctranspath.md) 对照：CellViT++ 在这篇里是条件来源（弱标签）兼筛选器，CTransPath 是被审计的三个编码器之一；读完可以理解“分析器的偏差如何进入条件的定义”。
- 与 [CLAM](29-clam.md)、[TransMIL](30-transmil.md) 对照：注意力热图回答“看哪里”，本文回答“哪条属性有影响”，两者的解释层级不同；把它当作注意力解释的补充验证手段来读。
- 与 [RestorePath](49-restorepath.md) 对照：同属病理扩散生成，但一个改写伪影区、保持与周围组织对齐，一个只改被请求的那一项属性、其余锁死；两者都需要警惕“生成出来的结构被当作原始证据使用”。
- 论文引用的 MoPaDi（Žigutytė 等，Cancer Research 2026）不在本仓库，若要补齐“病理反事实”支线，可优先补这一篇作为直接对照。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2610.00602)
- [arXiv HTML 正文](https://arxiv.org/html/2610.00602v1)
- [官方代码仓库 PathOGen（固定核查提交 c5e0c5c）](https://github.com/a12dongithub/PathOGen/tree/c5e0c5c3d9dd13b1c4a0d7f5bc83381adbde2bc7)
- [Hugging Face 权重与模型卡](https://huggingface.co/a12donhf/CPathOGen)
- [故事式 HTML 精读页](/pathology-atlas/learning/cpathogen-story.html)
