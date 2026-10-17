# 21｜FLEX-MRI：把恢复轨迹切成几段，直接学“跨段怎么变”

**论文**：Stochastic Finite-Transition Learning and Exploration for Accelerated MRI Reconstruction，arXiv:2610.13095v1（eess.IV，2026-10-09 提交，共 7 节 + 6 张表 + 5 张图）  
**定位**：少步生成式 MRI 重建、有限过渡（finite-transition）建模、k 空间支撑的随机探索、免辅助采样器的随机性  
**精读核验**：依据 arXiv v1 全文（§I–VII、Table I–VI、Fig. 1–5）与官方仓库 `icon-lab/FLEX-MRI`（MIT，核查提交 `95f1771`，2026-10-12）整理（2026-10-13）；**本站未复现任何实验**，也未运行官方代码。

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/flex-mri-story.html)** — 含四处交互（轨迹扰动示意、过渡步数取舍条形图、消融网格切换、原表对照）、七张公式卡与官方仓库的真实命令。

## 原文摘要

> Generative MRI reconstruction maps an initial source distribution to the target image distribution along a learned recovery trajectory. Common generative methods, such as diffusion and flow, typically learn fine-grained local dynamics whose integration defines this global mapping, hence requiring many network evaluations at inference. Existing few-step sampling approaches can lower computational burden by approximating large transformations from local dynamics, albeit at the expense of reconstruction fidelity. FLEX-MRI instead partitions recovery into a small number of finite intervals between retained states defined by progressive changes in k-space support, and directly learns the reconstruction change across each interval. Because such finite transitions can admit multiple plausible outcomes, FLEX-MRI combines support-relaxed finite-transition learning with stochastic exploration. During training, randomized k-space sampling masks define finite-transition targets with varying support, while the prediction loss remains unrestricted by each individual mask. At inference, FLEX-MRI perturbs a random subset of currently estimated k-space coefficients, allowing the learned predictor to stochastically explore alternative transition paths. Each predicted state is then reconciled with the acquired measurements through data consistency. We theoretically show that this stochastic exploration induces nonzero transition-level variation through the learned recovery map and data consistency without requiring an auxiliary generative sampler. Experiments on multi-coil MRI datasets show that FLEX-MRI outperforms competing methods while maintaining computational efficiency comparable to few-step baselines.

*来源：arXiv:2610.13095v1（https://arxiv.org/abs/2610.13095）。逐字原文，未改写、未压缩；原文的拼写与标点保持原样。*

## 中文摘要

> 生成式 MRI 重建沿一条学习到的恢复轨迹，把初始源分布映射到目标图像分布。常见的生成式方法，例如扩散与 flow，通常学习精细的局部动力学，这些动力学的积分定义了上述全局映射，因此在推理时需要大量网络评估。已有的少步采样方法可以降低计算负担，其做法是从局部动力学近似出大的变换，代价是重建保真度下降。FLEX-MRI 则把恢复过程切分成少量有限区间，区间之间是若干“保留状态”，这些状态由 k 空间支撑的渐进变化定义，并且直接学习每个区间上的重建变化。由于这样的有限过渡可能对应多个都合理的结局，FLEX-MRI 把支撑松弛的有限过渡学习与随机探索结合起来。训练时，随机化的 k 空间采样掩码定义了支撑各不相同的有限过渡目标，而预测损失不受每个单独掩码的限制。推理时，FLEX-MRI 扰动当前已估计的 k 空间系数中的一个随机子集，使学习到的预测器能够随机地探索不同的过渡路径。随后，每个预测出来的状态都通过数据一致性约束与已采集的测量达成一致。我们从理论上说明：这种随机探索会通过学习到的恢复映射与数据一致性，产生非零的过渡级变化，而无需任何辅助生成采样器。在多线圈 MRI 数据集上的实验表明，FLEX-MRI 优于竞争方法，同时保持了与少步基线相当的计算效率。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词、缩写与数字以英文原文为准。*

## 论文 Pipeline 原图

![FLEX-MRI 论文框架图](/papers/mri/21-flex-mri-pipeline.png)

> **原文图注**：Figure 1: Comparison of few-step recovery in (a) flow-based modeling, (b) transition matching, and (c) FLEX-MRI. Flow maps a fixed current state to a single next state through a learned velocity field, whereas transition matching models alternative outcomes using an auxiliary generative sampler with multiple inner steps per retained transition. FLEX-MRI instead perturbs the current state through random k-space undersampling and maps the resulting perturbed states with the same finite-transition predictor, enabling stochastic transition-level exploration without an auxiliary sampler or inner sampling loop.
>
> **图注中译**：图 1：三种少步恢复方式的对比。(a) 基于 flow 的建模；(b) 过渡匹配（transition matching）；(c) FLEX-MRI。flow 通过学习到的速度场，把一个固定的当前状态映射到唯一的下一状态；过渡匹配则用一个辅助生成采样器、在每个保留过渡内跑多次内部步骤来建模不同结局。FLEX-MRI 改为对当前状态做随机 k 空间欠采样扰动，再用同一个有限过渡预测器映射这些扰动后的状态，从而在不需要辅助采样器、也不需要内部采样循环的前提下实现过渡级的随机探索。

*图源：https://arxiv.org/html/2610.13095v1（Figure 1 原图，直接取自论文，未重绘、未描摹；论文页面这一文件与官方仓库 `figures/flex_mri_overview.png` 逐字节一致，本站保存的是其等比缩小副本，6625×6131 → 1400×1296）。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。看完本节和第 1 节就可以先停，需要动手时再往下读。

### 0.1 把它想成什么？

想象把一张欠采样的 MRI 图“洗”成清晰图。常见做法分两种极端：一种是把这张图慢慢洗一千遍，每一遍只动一点点，稳但慢；另一种是只洗十遍，每遍都要一次跳很远，快但容易跳错。FLEX-MRI 走第三条路：**先决定只洗十遍，然后专门训练“一次洗一大步”这件事本身**，而不是让模型自己想办法把大步拆成小步去凑。更关键的是，它在每一步前先把图片的 k 空间数据随机抠掉一点，让同一个模型每次都能走到略有不同的下一步——于是最终结果不是一个固定的答案，而是一族都符合已测数据的合理答案。

### 0.2 它为什么出现？

两个现实矛盾叠在一起。

第一，**步数与保真度的矛盾**。扩散类方法（DDPM、DiffRecon、FDB 等）在 1000 个状态上学习局部恢复，推理时也确实要跑上千次网络，单张切片重建要 34–59 秒（Table V）。少步方法（flow matching、过渡匹配）把步数压到 10–50 步，但它们是“用细尺度上学到的动力学去近似大跨度的变换”，步子越大近似越不准，画质掉。

第二，**随机性的代价**。少步恢复的每一个保留区间其实对应很多种中间可能，这些可能性原本被分摊在若干小步里。把中间状态省掉之后，这些变化必须由“保留过渡”的残差项来承担。已有做法（过渡匹配 DTM）是在每个保留过渡里塞一个辅助生成采样器来产生这种变化——这又把省下来的计算吃回去了，而且它用源/目标端点之间的线性插值定义中间状态，与 MRI 的 k 空间采集（本质上是“采/不采”的二值掩码）并不匹配。

FLEX-MRI 的答案是：**保留状态和过渡级随机性都从 MRI 采集过程本身推导**，不需要辅助采样器。

### 0.3 它到底怎么做？

1. **定义保留状态**：从头到尾有一条“渐进抠掉 k 空间系数”的前向过程（掩码越来越稀）。原本每抠一点点就是一个状态；现在只留 J 个（论文取 J=10）。
2. **直接学跨段的变化**：网络不学“小步怎么走”，而是直接预测“从这一段到下一段，图变了多少”。
3. **训练时用随机掩码**：每个样本、每个过渡用的掩码都是现随机抽的（加速倍数在 [2, 8] 内随机），所以模型不能把“第 j 段”和“固定的那批系数”绑定起来；而且预测误差**不限制在掩码选中的那些系数上**（这就是“支撑松弛”）。
4. **推理时扰动**：在每次预测前，对当前估计的 k 空间系数做一次随机欠采样（每个位置以概率 γ 被剔除；论文 γ=0.1）。同一个当前状态被扰动成不同版本，同一个预测器就能走出不同的下一步。
5. **跑完再校正**：每预测一步，立刻用数据一致性把已采集的测量重新压回去，保证结果不偏离实测数据。
6. **不需要额外的生成采样器**：随机性来自掩码扰动本身，论文还从协方差上证明了这一点不会退化成零。

### 0.4 先认清这些词

- **k 空间（k-space）**：MRI 原始采集域，是图像经过傅里叶变换后的二维数据；只采一部分点就能重建图像，代价是缺失信息带来的歧义。
- **加速倍数 R**：实际采集的系数比例约等于 1/R。R=4 表示只采约四分之一，R=8 采得更少。
- **数据一致性（data consistency, DC）**：把预测图像变换到 k 空间后，把“本来已经采到的那些系数”替换成真实测量值，再变换回来。代码里对应 `FlexMRI.data_consistency`。
- **保留状态 / 保留过渡（retained states / finite transition）**：只保留 J+1 个轨迹点，相邻两点之间的那一次大变化就是一次“有限过渡”。
- **前向过程（forward process）**：从全采样图像出发，按掩码逐步丢掉 k 空间系数的过程；丢掉的顺序由每个位置的随机优先级 ρ_i 决定。
- **过渡掩码 η_j**：第 j 次过渡里“刚刚新丢掉”的那批系数。
- **支撑松弛（support-relaxed）**：预测误差不再限制在 η_j 选中的系数上，而是在整幅图像/整个 k 空间上评估。
- **扰动率 γ_j**：推理时每个 k 空间位置被随机剔除的概率；论文全轨迹固定取 0.1。
- **残差项 r / 平均位移 d**：一次有限过渡的增量可以写成“平均位移 + 残差”，残差就是那些必须被保留下来的随机变化。
- **PSNR / SSIM**：峰值信噪比（dB，越高越好）与结构相似度（%，越高越好）。
- **网络评估次数（network evaluations）**：推理时前向跑网络的次数；FLEX-MRI 约为 J 次。

### 0.5 输入和输出

输入是欠采样多线圈 k 空间数据、对应的采样掩码与 ESPIRiT 估计的线圈灵敏度图；输出是每个切片的 SENSE 复图像与 RSS 幅值图像（供与 `reconstruction_rss` 真值比较）。单张切片在 RTX 4090 上耗时 0.349 秒、峰值显存 1.05 GB。

### 0.6 最容易误解的地方

- **J=10 不是“一个超参数随便调”。** 论文的消融显示画质在 J=10 达到峰值，两端都变差：J=2 时每步要跨太远，J 变大到 1000 时扰动事件变多而每步更新变小，误差还会累积（Fig. 5）。
- **“支撑松弛”不等于“不看掩码”。** 掩码仍然定义训练目标本身（哪批系数刚刚被丢掉），只是不再限制**评估预测误差的范围**。这两件事在 Eq. 12 与 Eq. 13 之间被明确分开。
- **随机性只在推理时开。** 消融里“在训练输入上也加扰动”并没有额外收益（Table VI），论文的结论是：扰动应当 confine 在推理阶段。
- **这不是扩散模型的加速版。** 它换掉了学习尺度：有限过渡本身是训练目标，而不是从更细尺度动力学近似出来的。

**现在只记住一句话：FLEX-MRI = 把恢复切成十段、直接学“每段怎么变”，再用随机抠 k 空间的方式让同一段能走出不同结果。**

## 1. 三分钟摘要与推荐理由

常见的生成式 MRI 重建有两条路线：扩散/flow 学习“一小步一小步”的局部动力学（DDPM、DiffRecon、CDiffMR、FDB 都是 T=1000；FLOWER、UPMRI 是 T=10；DTM 是 T=50），少步采样方法则用细尺度上学到的动力学去近似大步。论文指出两件事：**步子越大，近似越不成立**（高斯反向核近似在大步长下误差变大），以及**确定性的单条轨迹会把早先一步的错误一路带下去**。

FLEX-MRI 的做法可以概括成三句话：保留状态由 k 空间支撑的渐进变化定义；每个保留区间上的有限过渡**被直接监督**（训练用的随机掩码给出支撑各不相同的过渡目标，且预测误差不为掩码所限）；推理时对当前估计做随机 k 空间扰动，把随机性“造”进过渡里，再由数据一致性把测量压回去。论文用协方差传播（Eq. 27–30）说明这个残差不会退化为零，并且始终落在测量未约束的零空间里——这正是 Eq. 3 里那个被省略中间状态所携带的残差。

读它的理由有三条：**（1）尺度选择的思路可迁移**：不是把模型做深，而是把“学习尺度”换掉，让推理时的步长就是训练时的目标；**（2）随机性零成本**：不引入第二个生成器、不加内部采样循环，只靠掩码扰动；**（3）证据相对完整**：两个公开多线圈数据集、九个基线、跨数据集泛化、时间/显存对比，外加两个消融（Table VI 与 Fig. 5），并且第一次把 J 的取舍画成了曲线。

同时要把它的边界读清楚：全部结论建立在**二维笛卡尔采集 + 监督训练 + 有全采样参考**的设定上；加速范围 R=4–8，训练掩码的加速范围是 [2, 8]；M4Raw 上的绝对 PSNR 只有 23 dB 量级（低场 0.3 T 数据本身噪声大），此时增益的相对意义比绝对值更重要。

## 2. 问题及研究位置

论文把自己放在三条线索的交叉处。

- **多步生成式恢复（II-A）**：扩散先验（DDPM、Score-MRI 系列、DiffRecon）沿很多中间状态定义细粒度局部动力学，在整个轨迹上可以通过数据一致性投影或采集感知的条件反复修正估计，代价是推理时的顺序网络评估数量巨大。任务对齐的变体（DiracDiffusion、FDB）让源/目标分布与重建问题挂钩（例如从欠采样到全采样状态的渐进变化），轨迹更贴近采集过程，**但仍然是细粒度动力学**，因此步数不会自动变少。
- **少步生成式恢复（II-B）**：隐式采样器（DDIM）、蒸馏（渐进蒸馏）、一致性模型、flow matching 的少步数值积分都属于“从更细尺度学到的动力学里近似出大步”。flow 模型还有一个结构性限制：给定当前状态只给一个传输方向，积分通常沿一条确定性路径走，早期误差会延续。
- **有限过渡建模（II-C）**：过渡匹配（Transition Matching, Shaul 等, NeurIPS 2025）换掉了学习尺度，直接建模每个保留区间上的条件映射；但它为了表达过渡级变化，**在每个有限过渡内部引入辅助生成采样器**（多步内部采样），抵消了少状态本应带来的效率收益；而且它用源/目标端点之间的**线性插值**定义中间状态，这与 MRI 的 k 空间采集（二值掩码）不匹配——中间欠采样模式无法由“欠采样数据与全采样数据的连续加权平均”表示。

FLEX-MRI 的位置：**采用有限过渡建模，但保留状态与过渡级变化都从 MRI 采集过程推导**——渐进 k 空间支撑变化定义状态，随机掩码给出过渡目标，推理时随机 k 空间扰动产生过渡级随机性，再由数据一致性回到测量上。与 II-C 的关键差别是：不需要辅助生成采样器，也不需要内部采样循环。

## 3. 核心方法和数据流

```text
前向过程（定义保留状态，Eq.7–11）
全采样 k 空间 F(x_0)
  → 对每个未采集位置 i ∈ Ω̄ 抽独立优先级 ρ_i ~ U(0,1)
  → 掩码 m_t[i] = 1 (i ∈ Ω) 或 1(ρ_i ≥ ν_t)（ν_t 沿轨迹增大，ν_0=0、ν_T=1）
  → 图像状态 x_t(ρ) = F^{-1}[ m_t(ρ) ⊙ F(x_0) ]（Eq.8）
  → 保留 J+1 个状态 t_J > … > t_1 > t_0 = 0；过渡掩码 η_j = m_{t_{j-1}} − m_{t_j}（Eq.9）
  → 每个未采集系数按 η_j[i] ~ Bernoulli(a_j) 被选中（a_j = ν_{t_j} − ν_{t_{j-1}}；阈值等距，故每步丢掉的系数个数固定）
  → 过渡目标 Δ⁰_j(ρ) = x_{t_{j-1}}(ρ) − x_{t_j}(ρ) = F^{-1}[ η_j(ρ) ⊙ F(x_0) ]（Eq.11）

训练（支撑松弛有限过渡学习，Eq.12→13）
受限目标 L_FT  = E‖ η_j ⊙ ( F[μ_θ(x_{t_j}, t_{j-1})] − F[Δ⁰_j] )‖²      ← 掩码既定义目标也限制误差范围
松弛目标 L_FLEX = E‖ F[μ_θ(x_{t_j}, t_{j-1})] − F[Δ⁰_j] ‖² = E‖ μ_θ(·) − Δ⁰_j ‖²   ← 去掉掩码对误差的限制（Parseval）
  因为每个 realization 用的掩码都不同，预测器无法把“过渡序号 j”钉在某一批固定系数上（Eq.14–15）

推理（随机有限过渡恢复，Eq.16–19）
当前状态 x̂_{t_j}
  → 随机扰动：x̃_{t_j}^{(z)} = F^{-1}[ z_j ⊙ F(x̂_{t_j}) ]，z_j[i] ~ Bernoulli(1−γ_j)（覆盖整个 k 空间，含已采集的 Ω）（Eq.16–17）
  → 预测：x̂_{t_{j-1}}^{(z),pred} = x̃_{t_j}^{(z)} + μ_θ(x̃_{t_j}^{(z)}, t_{j-1})（Eq.18）
  → 数据一致性：x̂_{t_{j-1}}^{(z)} = Π_y(x̂^{pred}) = x̂^{pred} + A†(y − A x̂^{pred})（Eq.19）
  → 重复 J 次：J=10 次网络评估，γ_j 固定 0.1

为什么随机性不会消失（Eq.20–30）
过渡增量 Δ̂^{(z)}_j 与残差 r̂^{(z)}_j 满足与 Eq.3 相同的“均值 + 残差”分解，且 A r̂ = 0（落在测量零空间）
协方差 Cov ≈ P_N M_j Cov[x̃] M_j^H P_N^H，M_j = I + ∂μ_θ/∂x
拆成 Ω 与 Ω̄ 两部分后（Eq.30）：第一项只有在 P_N J_j ≡ −I 时才可能为零，这对几乎所有的预测器 Jacobian 都不成立；
第二项在预测器把已采集系数的扰动映射到未采集系数上时额外贡献正值 → 对任何 0<γ_j<1 的扰动率，残差都非退化
```

三条最该记住的设计：

1. **掩码只定义目标，不限制监督范围。** 这是 Eq.12 到 Eq.13 的全部差别，也是 Table VI 里 “Restricted” 一行比 “Relaxed” 低 0.8 dB PSNR 的原因（35.0 vs 35.8）。论文的解释是：受限目标要求预测器只为“当前掩码选中的那批系数”负责，而松弛后它必须在整幅图上都给出正确的过渡。
2. **推理扰动的形式与训练目标的来源同构。** 训练时的随机性来自 k 空间支撑的随机变化（η_j），推理时的随机性来自另一组随机 k 空间掩码（z_j），两者都落在未采集的自由度上；区别是推理时扰动还会波及已采集系数，而这些随后由数据一致性恢复（Eq.19 之后）。
3. **同一份预测器既承担平均位移、也承担残差。** 没有第二个网络，也没有内部采样循环——这是与过渡匹配 DTM 的核心工程差别，也直接反映在 Table V 的时间上（FLEX-MRI 0.349 s，比 DTM 的 0.437 s 还快一点；而在 Table II 上 FLEX-MRI 的 PSNR 在 R=4/6/8 分别高出 8.0 / 7.5 / 7.1 dB）。

## 4. 论文证据与实验范围

**数据与设置（§IV-A）**

- **fastMRI（高场）**：多线圈复数 k 空间，T1 / T2 / FLAIR 三种对比；受试者划分 (240, 60, 120)，共 12,600 个横断面；只分析层数 ≥10 且线圈数 >5 的体数据；几何线圈压缩到 **5 个虚拟线圈**（保留 >90% 数据方差）。
- **M4Raw（低场 0.3 T）**：受试者划分 (128, 30, 25)，共 9,000 个横断面；直接使用原生 **4 通道**采集。
- 两者都用**二维回顾式欠采样**，加速倍数 **R = 4–8**，normal density 分布；线圈灵敏度用 **ESPIRiT** 在中心标定区估计；体数据沿读出维切开，**逐横断面重建**。
- 训练：实部/虚部分通道，M4Raw 训 50 个 epoch、fastMRI 训 100 个 epoch，Adam，学习率 1e-4，(β1, β2) = (0.5, 0.9)；各方法的专属超参数由交叉验证选取，数据划分与欠采样模式完全一致；差异显著性用 **Wilcoxon signed-rank 检验**。
- FLEX-MRI 配置：有限过渡预测器 μ_θ 用 **U-Net** 骨干；端点状态 x_T 定义在 **R=6**；恢复用 **J=10** 个保留过渡；每次过渡前以恒定 **γ_j = 0.1** 的比率扰动当前状态。

**九个基线**：LORAKS（低秩）、rGAN（对抗）、DDPM（T=1000）、DiffRecon（T=1000）、CDiffMR（T=1000）、FDB（T=1000）、FLOWER（T=10）、UPMRI（T=10）、DTM（T=50）。

**主结果（PSNR dB / SSIM %，均值 ± 标准差）**

| R | fastMRI（Table II） | 最佳基线 | M4Raw（Table III） | 最佳基线 | 跨数据集泛化（Table IV，M4Raw 训 → fastMRI 测） |
|---|---|---|---|---|---|
| 4 | **38.2 ± 2.5 / 94.5 ± 4.3** | FDB 37.4 / 94.3 | **23.9 ± 1.6 / 76.9 ± 2.5** | UPMRI 23.3 / 67.1 | **37.6 ± 2.3 / 94.2 ± 3.3** |
| 6 | **36.7 ± 2.3 / 93.5 ± 4.7** | FDB 35.9 / 92.7 | **23.5 ± 1.5 / 75.1 ± 2.8** | FLOWER 22.7 / 54.2 | **35.9 ± 2.1 / 93.1 ± 3.7** |
| 8 | **35.8 ± 2.2 / 92.7 ± 5.0** | FDB 35.0 / 91.5 | **23.2 ± 1.5 / 74.3 ± 3.0** | LORAKS 22.0 / 72.9 | **34.8 ± 1.9 / 92.2 ± 3.9** |

论文报告的聚合说法：fastMRI 上，跨 R 与各家族平均，FLEX-MRI 比扩散类高 **2.7 dB / 4.4%**、比少步 flow 与过渡匹配类高 **4.6 dB / 11.3%**；M4Raw 上分别高 **4.1 dB / 35.1%** 与 **2.1 dB / 23.3%**；跨数据集场景分别高 **7.0 dB / 12.9%** 与 **3.2 dB / 5.3%**。所有 “最高” 均标注 p < 0.05。跨数据集只损失 **0.8 dB / 0.4%**（对比同数据集的 Table II）。

**效率（Table V，单张横断面，Nvidia RTX 4090）**

| 方法 | 时间 (s) | 显存 (GB) |
|---|---|---|
| LORAKS | 0.180 | 0.05 |
| rGAN | 0.0056 | 0.13 |
| DDPM | 37.12 | 1.72 |
| DiffRecon | 36.26 | 1.71 |
| CDiffMR | 34.03 | 2.23 |
| FDB | 59.09 | 3.19 |
| DTM | 0.437 | 1.05 |
| FLOWER | 0.477 | 1.05 |
| UPMRI | 0.318 | 1.05 |
| **FLEX-MRI** | **0.349** | **1.05** |

论文的表述是：比 1000 步扩散基线快约**两个数量级**，与 DTM / FLOWER / UPMRI 处于同一量级；显存与少步基线一致（1.05 GB），低于扩散类的 1.71–3.19 GB。

**消融一：推理模式 × 过渡支撑 × 训练输入（Table VI，fastMRI，R=8）**

| 推理模式 | 过渡支撑 | 训练输入 | PSNR | SSIM |
|---|---|---|---|---|
| Stochastic | Relaxed | Nominal | **35.8 ± 2.2** | **92.7 ± 5.0** |
| Stochastic | Relaxed | Perturbed | 35.4 ± 2.2 | 92.2 ± 4.9 |
| Stochastic | Restricted | Nominal | 35.0 ± 2.1 | 91.5 ± 5.1 |
| Stochastic | Restricted | Perturbed | 34.9 ± 2.1 | 91.6 ± 5.1 |
| Deterministic | Relaxed | Nominal | 34.9 ± 2.3 | 91.1 ± 5.2 |
| Deterministic | Relaxed | Perturbed | 34.5 ± 2.2 | 91.0 ± 5.0 |
| Deterministic | Restricted | Nominal | 34.2 ± 2.3 | 89.9 ± 5.1 |
| Deterministic | Restricted | Perturbed | 34.0 ± 2.3 | 90.0 ± 5.3 |

读法：换成确定性推理普降（35.8 → 34.9，即 −0.9 dB）；把松弛目标换成受限目标也降（35.8 → 35.0，即 −0.8 dB）；**在训练输入上加扰动没有额外收益**（35.8 → 35.4，反而更低），论文据此认为随机性应当只加在推理阶段。

**消融二：保留过渡数 J（Fig. 5，fastMRI，R=8）**

画质在 J=10 处达到峰值，两侧都下降；J=2 时 PSNR 与 SSIM 分别比 J=10 低 **1.7 dB 与 1.1%**；J>10 后单调下降，到 J=1000 时分别低 **2.3 dB 与 7.8%**。论文给出的机制解释是：过渡更少时单次预测要承担更大的平均位移与更强的残差变化；过渡更多时扰动事件变多、每次过渡的恢复更新变小，同时预测误差在更长的序列上累积——而推理成本又大致随 J 线性增长，因此 J=10 是画质与成本之间的折中。

**范围限制（论文自陈 + 本站标注）**：全部实验是**二维笛卡尔采集 + 监督训练**；论文在 §VI 明确把非笛卡尔采样、体数据重建、更广的扫描仪/协议差异、自适应扰动率与自适应状态间距、超越局部线性化的协方差分析、以及自监督/多机构设置列为**未来工作**；同时提醒：仅靠参考图像失真指标无法判断随机重建是否保留诊断相关结构，最终需要放射科评估（并引用了 tomographic reconstruction 幻觉的文献）。另外，消融只在 fastMRI R=8 一个设定上做；Fig. 5 也只给曲线与两端差值，未给中间点的数值表。

## 5. 复现与审计重点

本节把“论文说了什么”和“官方仓库实际放了什么”分开陈述，两者不完全等同。

- **`--transition_steps` 训练与重建必须一致（官方明确警告）。** README 用加粗句子写明它不是“可按加速倍数调”的参数；`train.sh` 与 `test.sh` 里也各有一段注释：*t 索引的是训练轨迹上的一个点，时间嵌入只在这些取值上被训练过；采样时用不同的数量会改变每个 t 的含义*。两侧默认值都是 10。这是最容易踩且后果最直接的一个坑。
- **仓库只实现了 M4Raw 这一条数据通路。** `read_data.py` 的文件头就是 “M4Raw data loading for FLEX-MRI”，掩码生成、`reconstruction_rss` 读取都按 M4Raw 组织；论文里的 fastMRI 分支（几何线圈压缩到 5 个虚拟线圈、按层数/线圈数筛选受试者、12,600 个横断面）**在发布代码里没有对应实现**。所以本仓库能直接复现的是 Table III 那一列与 Fig. 4/M4Raw 相关结论，Table II/IV 需要自己补数据管线。
- **ESPIRiT 线圈图缓存是训练的前置条件，且有独立脚本。** `precompute_coil_maps.py`（配 `coil_map_cache.py`、`espirit.py`）按 phase/contrast 预计算并落盘；**训练会跳过没有缓存的体数据**，所以必须先 `--phase train` 建缓存再训练。缓存可断点续跑（已存在的条目会被跳过，除非 `--overwrite`）；设备由 `FLEX_MRI_ESPIRIT_DEVICE` 控制（`auto` / `cpu` / `cuda:N`，GPU 需要 `cupy`），缓存根目录由 `FLEX_MRI_COIL_MAP_CACHE` 或 `<data_dir>/coil_maps_cache` 决定。
- **支持断点续训。** `train.py` 暴露 `--resume_checkpoint`，`train_util.py` 会从中恢复权重、EMA、优化器状态与步数（并从文件名解析 `resume_step`）；`train.sh` 直接透传额外参数，例如 `bash train.sh /path/to/M4Raw/ --resume_checkpoint exp/model025000.pt`。检查点每 25,000 次迭代写一次到 `exp/`。
- **评测流程是三段式。** `train.py`（训练）→ `sample.py`（重建，`test.sh` 默认扫 R ∈ {2,4,6,8} × {T1,T2,FLAIR}，逐切片输出 `rss<i>.npy`、`sense<i>.npy` 与 PNG）→ `evaluate.py`（对 `reconstruction_rss` 算 PSNR/SSIM，并以零填充为基线）。官方还提醒两点：RSS 才与 `reconstruction_rss` 真值同口径（SENSE 是另一个量，保留相位，全量扫描约 15 GB）；**要用原始权重 `model<step>.pt` 而不是 EMA**，因为在 `ema_rate=0.9999` 下 EMA 大约落后 7,000 次迭代。
- **与论文的差异一：随机探索在发布代码里没有开。** `FlexMRI._stochastic_frequency_dropout` 的文档字符串写明它是“训练期增强”，默认 `drop_rate=0.0`；`recovery_trajectory`（推理主循环）里**完全没有调用它**，而 `create_finite_transition()` 也**没有把 `drop_rate` 透传出去**，命令行里没有对应开关。也就是说：论文 Eq.16–19 的“推理时先扰动 k 空间再预测”这条路径，在发布的 `sample.py` 里是关闭的——复现表格需要自己把它接上（并自行确定 γ 与放置位置），论文里的 γ_j=0.1 在代码中也没有体现。
- **与论文的差异二：训练目标的形式不同。** 论文 Eq.11–13 的目标是“某个掩码刚刚新丢掉的那批系数所对应的图像变化” Δ⁰_j，损失是傅里叶域（等价于图像域，Parseval）的 MSE；发布代码 `training_losses` 回归的是**到全采样图像的整段剩余跳跃** `x_target − x_t`，用**图像域 L1** 且乘了 10 倍缩放。代码注释解释了为什么这样选目标（“回归两个随机掩码版本之差是不可学的：丢掉哪些系数是输入无法决定的随机性，L1 最优预测就是零”），但这也意味着：**代码实现的是“松弛”后的目标形式，而掩码定义过渡目标这一步在实现中被换成了另一种表述**。任何要逐条对齐 Eq. 12/13 的复现，都必须先把这一点写清楚。
- **与论文的差异三：前向状态的构造。** 代码里中间状态是 `x_zf` 与 `x_0` 的线性插值再逐状态做数据一致性（`alpha=(t+1)/T`），而论文的前向过程是由随机优先级 ρ_i 与阈值 ν_t 决定的渐进 k 空间抠除（Eq.7–8）。两者都“任务对齐”，但不是同一个构造；论文自己正是以此批评过渡匹配的线性插值。复现时若要检验“k 空间支撑渐进变化”这一说法，应改用 Eq.7–8 的构造。
- **其他可复现细节**：训练配置为 125,000 次迭代、batch size 2、累计 8 次迭代一个优化步、学习率 1e-4（5k 步 warmup 后余弦衰减到 1e-6）、dropout 0.3、EMA 0.9999、每个样本一张新掩码且加速在 [2, 8] 内随机；所有设置可用环境变量覆盖（`GPU`/`PYTHON`/`SAVE_DIR`/`CONTRAST`/`NUM_WORKERS`/`BATCH_SIZE`/`STEPS`/`LR`/`TRANSITION_STEPS`/`R_MIN`/`R_MAX` 等），快速冒烟可用 `--max_volumes 4 --slices_per_volume 2`。读者要注意：论文表格的协议是“50/100 个 epoch”，与代码的“125k 次迭代”不是同一套记账方式。
- **数据可得性**：M4Raw 从 Zenodo 下载（`M4RawV1.5_multicoil_train/val`、`M4Raw_multicoil_test`），CC-BY-4.0；fastMRI 需自行申请。依赖为 torch ≥ 2.0、numpy、h5py、sigpy（ESPIRiT）、scikit-image（评测）、matplotlib、tqdm；GPU ESPIRiT 需额外装 cupy。
- **许可与来源**：仓库为 **MIT License**（`LICENSE` 顶部即 “MIT License / Copyright (c) 2026 ICON Lab”），作者明确表示鼓励修改与分发但要求引用论文；代码改编自 OpenAI 的 improved-diffusion 仓库，线圈图来自 SigPy。
- **本站未做的事**：没有运行官方代码、没有训练或重建、没有复现任何表格数值；上面所有指标都是论文原文的转录。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（三种少步恢复的对比：flow / 过渡匹配 / FLEX-MRI）→ `§I` 的三段式动机（多步踩坑 → 少步踩坑 → 有限过渡）→ `§II-C`（过渡匹配的两个短板：辅助采样器、线性插值）→ `§III-A`（Eq.1–6：保留状态、增量分解 Δ = d + r、残差落在测量零空间、省略中间状态如何把变化压进保留区间）→ `Fig. 2`（a–d 四种视角）→ `§III-B1`（Eq.7–15：前向掩码、过渡掩码、受限目标 → 松弛目标）→ `§III-B2`（Eq.16–19：扰动、预测、数据一致性）→ `§III-B3`（Eq.20–30：协方差传播与“残差非退化”的论证，第一遍可只读结论段）→ `§IV-A`（数据与 R 范围）→ `§IV-B`（九个基线与各自超参）→ `Table II/III`（主结果）→ `Table V`（时间与显存）→ `Table VI`（消融一）→ `Fig. 5`（消融二：J 的取舍）→ `§VI`（作者自陈的边界与未来工作）。

## 7. 前后关联

- 与 [20-dds](20-dds.md)（分解式扩散采样）对照：DDS 在**干净估计**上用共轭梯度做一致性校正、靠拒绝采样挑出可用的后验样本，仍然是多步扩散；FLEX-MRI 换掉的是**学习尺度**——推理时执行的有限过渡本身就是训练目标。两篇都在回答“怎么在少步下不牺牲保真度”，但一个改的是采样器内部，一个改的是被学习对象的粒度。
- 与 [13-msc](13-msc.md)（测量子空间一致性）对照：MSC 把已测 k 空间硬锁回观测值，作为后验采样的即插即用算子；FLEX-MRI 的 `Π_y` 是同一类数据一致性投影，区别在于它是**有限过渡循环的一部分**，而不是外挂在采样器上。
- 与 [14-cm-red](14-cm-red.md)（一致性模型 + RED）对照：一致性模型是“从细尺度动力学学出一步到位”的代表路线，也是 FLEX-MRI 在 §II-B 中归类的“用近似换步数”一族；把两者并读，可以看清“学大步”的两种实现方式（蒸馏/一致性 vs 直接监督过渡）。
- 与 [18-mpflow](18-mpflow.md)（多模态后验引导 flow matching）与 [11-gaussm2asr](11-gaussm2asr.md) 对照：同为少步/流式生成重建，可以横向比较“随机性从哪里来”——MPFlow 来自后验引导，FLEX-MRI 来自 k 空间掩码扰动。
- 与 [06-score-mri](06-score-mri.md) 对照：Score-MRI 用多步分数模型加数据一致性；它是 FLEX-MRI 所说的“多步细粒度”一端的代表，读它可以理解 FLEX-MRI 想省掉的到底是什么。
- 论文引用的两条最直接的前置线索不在本仓库，若要补：**Transition Matching**（Shaul 等, NeurIPS 2025，本文的有限过渡框架来源）与 **FDB / Fourier-constrained diffusion bridges**（Mirza 等, IEEE TMI 2026，同一作者组的前作，也是本文的强基线）。DTM 与 FDB 在 Table II–IV 中都是主要对照。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2610.13095)
- [arXiv HTML 正文](https://arxiv.org/html/2610.13095v1)
- [Official 代码仓库 icon-lab/FLEX-MRI（MIT，核查提交 95f1771）](https://github.com/icon-lab/FLEX-MRI/tree/95f1771988d5c6ed9da0165a4f50cca8d4e010b4)
- [M4Raw 数据集（Zenodo，CC-BY-4.0）](https://doi.org/10.5281/zenodo.8056074)
- [故事式 HTML 精读页](/pathology-atlas/learning/flex-mri-story.html)
