# 22｜UPMRI：只用欠采样 k 空间学全采样先验的无监督并行 MRI 重建

**论文**：UPMRI: Unsupervised Parallel MRI Reconstruction via Projected Conditional Flow Matching，arXiv:2512.17493v1（eess.IV，2025-12-19 提交）  
**定位**：无监督（训练不要全采样真值）并行 MRI 重建、投影条件流匹配（PCFM）、测量空间概率流与双空间循环采样、GSURE 无监督化  
**精读核验**：依据 arXiv v1 的摘要与 §I–VI、Table I–II、Fig. 1–9 与附录 A–B（Proposition 1–4、Lemma 1–4、Algorithm 1–2）整理（核查日期 2026-10-13）；**未核实到可用官方实现**，本站未执行论文代码、未复现任何指标。

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/upmri-story.html)** — 含四处交互（有监督 / PCFM / GSURE 目标对照、Table I 与 Table II 原表条形图、Algorithm 1 双空间循环步骤、插值路径 t 滑杆）、十张公式卡与两张论文原图。

## 原文摘要

> Reconstructing high-quality images from substantially undersampled k-space data for accelerated MRI presents a challenging ill-posed inverse problem. While supervised deep learning has revolutionized this field, it relies heavily on large datasets of fully sampled ground-truth images, which are often impractical or impossible to acquire in clinical settings due to long scan times. Despite advances in self-supervised/unsupervised MRI reconstruction, their performance remains inadequate at high acceleration rates. To bridge this gap, we introduce UPMRI, an unsupervised reconstruction framework based on Projected Conditional Flow Matching (PCFM) and its unsupervised transformation. Unlike standard generative models, PCFM learns the prior distribution of fully sampled parallel MRI data by utilizing only undersampled k-space measurements. To reconstruct the image, we establish a novel theoretical link between the marginal vector field in the measurement space, governed by the continuity equation, and the optimal solution to the PCFM objective. This connection results in a cyclic dual-space sampling algorithm for high-quality reconstruction. Extensive evaluations on the fastMRI brain and CMRxRecon cardiac datasets demonstrate that UPMRI significantly outperforms state-of-the-art self-supervised and unsupervised baselines. Notably, it also achieves reconstruction fidelity comparable to or better than leading supervised methods at high acceleration factors, while requiring no fully sampled training data.

*来源：arXiv:2512.17493v1（https://arxiv.org/abs/2512.17493）。逐字原文，未改写、未压缩；原文的用词与句读保持原样。*

## 中文摘要

> 从被大幅欠采样的 k 空间数据重建高质量图像以加速 MRI，构成一个困难的病态逆问题。有监督深度学习虽然革新了这一领域，却严重依赖大规模的全采样真值图像数据集；由于扫描时间长，这类数据集在临床环境中往往不现实或根本无法获取。尽管自监督/无监督 MRI 重建已有进展，它们在高加速倍率下性能仍然不足。为弥合这一差距，我们提出 UPMRI，一个基于投影条件流匹配（PCFM）及其无监督变换的无监督重建框架。与标准生成模型不同，PCFM 仅利用欠采样的 k 空间测量来学习全采样并行 MRI 数据的先验分布。为重建图像，我们建立了一个新的理论联系：测量空间中由连续性方程支配的边缘向量场，与 PCFM 目标函数最优解之间的联系。这一联系导出一个用于高质量重建的循环双空间采样算法。在 fastMRI 脑与 CMRxRecon 心脏数据集上的大量评估表明，UPMRI 显著优于当前最优的自监督与无监督基线。值得注意的是，它还在高加速倍率下取得与领先的有监督方法相当或更好的重建保真度，同时不需要任何全采样训练数据。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![UPMRI 论文的 PCFM 框架图](/papers/mri/22-upmri-pipeline.png)

> **原文图注**：Figure 2: Schematic illustration of the proposed projected conditional flow matching framework. The top row depicts the theoretical continuous normalizing flow (diffeomorphism) that transforms samples from a Gaussian base distribution p₁ˣ (noise x₁) into the target data distribution p₀ˣ (fully sampled MRI x₀) via the probability flow ODE governed by the vector field uₜˣ(x). The bottom row illustrates the proposed unsupervised training strategy: in the absence of ground-truth fully sampled data, the neural network v_θˣ(·,t) approximates the vector field by utilizing a linear interpolation between the zero-filled reconstruction A*y₀ and the projected noise A*Ax₁.

*图源：https://arxiv.org/html/2512.17493v1（Figure 2 原图，直接取自论文，未重绘、未描摹）。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。看完本节和第 1 节就可以先停，需要动手时再往下读。

### 0.1 把它想成什么？

把 MRI 扫描想成“抄一份很长的表格”。为了快，机器只抄了其中一部分格子（欠采样的 k 空间）。你要补出整张表，但手上一张“填好的样表”（全采样真值）都没有。UPMRI 做的事是：只凭这些抄下来的格子，学出“正常人体的图像长什么样”，再反过来把整张表补全——而且它吃掉的是多线圈（并行成像）数据，不是单线圈。

### 0.2 它为什么出现？

用生成模型做 MRI 重建已经很强，但训练要先有一大堆“全采样 MRI”。临床上没人愿意为了攒训练集去多扫几倍时间。已有的省真值方案分两类：一类（SSDU 家族）把已经很少的测量再切一刀，用一半监督另一半——本来数据就少，再切一刀更心疼；另一类（ENSURE / 作者自己的 GTF²M）用 Stein 无偏风险估计（SURE）把真值从目标函数里消掉，但只在单线圈、投影算子有闭式解时才是无偏的。

UPMRI 要填的正是这个缺口：**多线圈并行 MRI 下没有闭式投影，也要做到无真值训练**。

### 0.3 它到底怎么做？

1. 把 MRI 的前向模型 y₀=Aₛx₀+e 写清楚：Aₛ 由“掩码 × 傅里叶 × 每个线圈的敏感度”堆叠而成，欠采样使它秩亏、有零空间。
2. 目标函数里加一个投影 Pₛ=Aₛ⁺Aₛ：要求网络只在自己“看得见”的子空间上对齐速度场——看不见的方向不监督。这就是 PCFM。
3. 并行 MRI 下 Pₛ 没有闭式解，于是用共轭梯度（CG）数值近似，训练时只跑 10 步。
4. 目标函数里还残留着未知的全采样图像 x₀，再用广义 SURE（GSURE）把它换掉：把 x₀ 代换成测量下的极大似然解，并补一项散度修正（用 Hutchinson 迹估计采样）。这一步之后训练数据里就只剩欠采样 k 空间了。
5. 重建时做“双空间循环”：先在测量空间把噪声往回退到 t=1，在那里按后验采样得到一个噪声图像，再在图像空间反向积分回 x₀，每一步都用测量做一次数据一致性校正。

### 0.4 先认清这些词

- **k 空间**：MRI 的原始频域数据；欠采样就是只测其中一部分（本文用随机笛卡尔 1D 掩码，低频全测）。
- **并行 MRI / 多线圈**：多个接收线圈各自看到一份带自身敏感度权重的视图，用它们补回丢掉的空间信息。
- **零填充（zero-filled）**：把没测的 k 空间位置填 0 再逆变换，是最朴素的基线，也是本文网络的输入形态 A*y。
- **流匹配（flow matching）**：学一个随时间变化的速度场，把噪声分布沿 ODE 搬运成数据分布；比扩散少一些采样步数。
- **条件流匹配（CFM）**：给每条样本对 (x₀,x₁) 指定一条可写出的条件路径，再对其速度场做回归。
- **向量场 / 概率流 ODE**：dx/dt=uₜ(x)；连续性方程 ∂ₜ pₜ+∇·(pₜuₜ)=0 说明这个场搬运的就是概率密度。
- **GSURE**：广义 Stein 无偏风险估计。它把“预测与真值的均方误差”改写成只含观测与预测的表达式，代价是加一项散度修正。
- **值域 / 零空间投影**：Pₛ=Aₛ⁺Aₛ 是到 Aₛ 行空间的正交投影；投影掉的部分正是掩码看不见的方向。
- **CG（共轭梯度）**：解对称正定大线性系统的迭代法，几行代码实现；本文用它近似投影和伪逆。
- **NFE**：网络函数评估次数，衡量推理成本；本文 T=10 步、前向+反向共 20 NFE。
- **ESPIRiT**：估计线圈敏感度图的经典方法；本文的真值图像与数据一致性都依赖它。

### 0.5 输入和输出

训练输入：只有欠采样的多线圈 k 空间测量 y₀（以及由它算出的伴随图像 A*y）、掩码 Mₛ、以及 ESPIRiT 估计出来的敏感度图。训练输出：一个预测 X 空间速度场 v_θˣ 的 U-Net。推理输入：一份新的欠采样测量；推理输出：重建的复值图像 x₀（取幅度后算 PSNR/SSIM）。

### 0.6 最容易误解的地方

- 这里的“无监督”指**训练不需要全采样真值**，不是“整篇论文没有真值”：评估用的 PSNR/SSIM 仍然要和 SENSE 重建出来的全采样参考比。
- 网络不是直接吐图像，而是每一步被问“当前沿插值路径处在 y(t)，X 空间的速度该指向哪”，最后由 ODE 积分把 x₁ 搬到 x₀。数据一致性也不是收尾补一次，而是每个反向步之后都做。
- 投影 Pₛ 不是“丢弃没测到的信息”这么简单：它让损失只在可见子空间里计算，这正是无真值训练能成立的关键；但也意味着未被任何掩码覆盖的 k 空间位置从未被监督——论文的 Lemma 1 正是为此要求“每个 k 空间位置在数据集里至少被采到一次”。

**现在只记住一句话：UPMRI = 把 CFM 的回归误差投影到“测量看得见”的子空间，再用 GSURE 把真值从目标里消掉，最后在测量空间与图像空间之间来回积分做重建。**

## 1. 三分钟摘要与推荐理由

UPMRI 处理的是 MRI 重建里最贵的一环：生成式先验需要全采样真值，而真值难得。它给出的答案分三层：

1. **目标层**：PCFM——把 CFM 的误差向量先投影到前向算子行空间 Pₛ=Aₛ⁺Aₛ，只在掩码可见的方向上回归；
2. **数据层**：GSURE 无监督化——把目标里未知的 x₀ 换成测量驱动的极大似然估计 û_MLˣ，并加上 2aₜaₜ'σ₀²∇·Pₛv_θˣ 这一散度修正项（Hutchinson 迹估计），整个训练目标不再出现全采样数据；
3. **采样层**：Proposition 3 把测量空间的边缘向量场写成最优 PCFM 解的函数，于是可以用它做前向积分，再在 x₁ 处按 CN(A⁺y₁,2(I-A⁺A)) 采样、逐点做数据一致性反向积分——这就是 Algorithm 1 的循环双空间采样，T=10 步、20 NFE。

值得读的理由：一是它把“无真值”从单线圈推进到并行 MRI，并诚实说明关键在于投影的数值近似；二是理论链条完整（Lemma 1–4、Proposition 1–4 都有证明附录），把“先验采样”和“测量一致性”用一条 Lemma 2/3 的对消关系接在一起；三是数字很硬：脑 4× 42.19 dB / 0.983、心脏 4× 52.39 dB / 0.994，8× 下 SSIM 超过有监督的 DDNM+，而 NFE 只有 20。反面也清楚——它依赖 ESPIRiT 敏感度，训练多了一层 CG 开销，而且**没有公开实现**。

## 2. 问题及研究位置

**问题**：y₀=Aₛx₀+e，其中 Aₛ≜[MₛFS₁;…;MₛFS_C]∈ℂ^(Cd×D)（Eq.3）。加速倍率 α=D/d>1 时 Aₛ 秩亏、零空间非空，重建是病态逆问题。想用生成模型提供先验 p(x)，标准做法（DPS、DDNM 等）都要求先在大规模全采样数据上训练。

**已有位置**：

- **有监督一条线**：展开网络（MoDL）、扩散后验采样（DDNM+，A⁺ 由 CG 近似）、流匹配后验（OT-ODE 用 ΠGDM 近似似然分数，PnP-Flow 交替梯度步与流重投影）。共同前提是训练集里有全采样真值。
- **自监督一条线**：SSDU 家族把已有的欠采样 k 空间再切两半互相监督（含加权与鲁棒变体）。代价是训练期进一步丢数据，高加速下尤其吃亏。
- **无监督一条线**：REI（SURE 损失 + 等变成像）、MOI（利用算子随机性）、ENSURE（前向算子随机性下的无偏 MSE 近似，但多线圈下只能优化近似目标）、以及作者自己的会议工作 GTF²M（单线圈无真值流匹配，多线圈时按线圈分别重建再 SENSE 合并）。

**本文的相对位置**：把 ENSURE/GSURE 思路从“闭式投影可用的单线圈”推广到“投影必须数值近似的多线圈”，并把无监督目标与测量空间概率流接起来，换来一个可用的推理算法。与 GTF²M 的差别被作者自己点明：线圈级先验学的是单线圈 k 空间，而 PCFM 直接对并行 MRI 的合并前向算子下手。

## 3. 核心方法和数据流

```text
前向模型（Eq.2–3）：y_0 = A_s x_0 + e，A_s = [M_s F S_1; …; M_s F S_C] ∈ ℂ^{Cd×D}
掩码 M_s 随机（s 索引随机性）；假设：每个 k 空间位置在数据集里至少被采一次（Lemma 1）

训练（只用欠采样 k 空间，无 x_0）
  x_1 ~ p_1^X = CN(0, 2I_D)（高斯基底）
  X 空间条件路径：x_t = a_t x_0 + b_t x_1，条件速度场 u_t^X(x|z^X) = a_t' x_0 + b_t' x_1（Eq.6 的路径假设）
  Y 空间条件路径：p_t^Y(y|z^Y) = δ_{a_t y_0 + b_t y_1}(y)，其中 y_1 ≜ A_s x_1（Eq.7）
  ⇒ p_t^Y(y|z^X) = CN(y | A_s(a_t x_0 + b_t x_1), a_t²σ_0² I_Cd)
  PCFM 目标（Eq.8）：E‖ P_s [ v_θ^X(y,t) − u_t^X(x|z^X) ] ‖²，P_s = A_s⁺A_s
      · 闭式投影不可得 ⇒ CG 求 (A_s*A_s) r = A_s*A_s[ v_θ^X − u_t^X ]（k=10 步）
      · 网络输入取 A_s* y_t（伴随形式），输出 X 空间速度场
  Proposition 1（Eq.9–10）：最优解 v*^X(y,t) = E[u_t^X(x|z^X) | y]（即真速度场的 MMSE 估计）
  Proposition 2 / GSURE 无监督化（Eq.13–15）：
      E[ ‖P_s[v_θ^X(A_s*y,t) − û^X_{s,t,ML}]‖² + 2a_t a_t' σ_0² ∇_{A_s*y}·P_s v_θ^X(A_s*y,t) ]
      û^X_{s,t,ML} = (A_s* C_t⁻¹ A_s)⁺ A_s* C_t⁻¹ u_t^Y(y|z^Y)，C_t = (a_t'σ_0)² I_d
      散度项用 Hutchinson 迹估计：b ~ CN(0, P_s)
  ⇒ 目标里不再出现 x_0（“up to a constant”）

推理（Algorithm 1，T 步）
  1) 测量空间前向积分（Lemma 2–3 ⇒ Proposition 3，Eq.21–22）：
       y ← y + (1/T) u_t^Y(y)，t = 0, …, (T−1)/T
       u_t^Y(y) = A v*^X(y,t) − c_t/(1−t) [c_t I + 2AA*]⁻¹ [ (1−t) A v*^X(y,t) + y ]，c_t = (1−t)²σ_0²/t
       （Cd > D 时用左乘 A* 的版本 Eq.22，矩阵逆同样可用 CG 近似）
  2) t=1 后验采样（Lemma 4，Eq.25）：x_1 = A⁺y_1 + (I_D − A⁺A) z_1，z_1 ~ CN(0, 2I_D)
  3) 图像空间反向积分（Eq.26）：x ← x − (1/T) v*^X(y, t+1/T)，y(t) ≜ a_t y_0 + b_t y_1
  4) 每步数据一致性（Eq.28）：x ← x − A⁺(A x − y(t))，A⁺ 用 CG 近似
  ⇒ Proposition 4（Eq.27）：σ_0→0 时 A x(t) = y(t) 对所有 t 成立，即反向过程与正向过程一致
```

三条最该记住的设计：

1. **投影决定“监督谁”**：PCFM 的投影 Pₛ 让损失只在测量可见子空间里生效；这正是无真值训练的理由，也是它依赖 Lemma 1（数据集中每个 k 空间位置至少被采一次）的原因。
2. **真值是“换掉”的，不是“估掉”的**：GSURE 把 x₀ 换成测量下的极大似然解并补一项散度修正；修正项是目标无偏性的来源，也是训练时最贵的一步（需要 Hutchinson 采样 + 对输入的梯度）。
3. **一致性写进了动力学**：Proposition 3 把测量空间速度场与最优 PCFM 解绑定，Proposition 4 说明理想情况下反向积分自动满足 A x(t)=y(t)；离散化误差则用 Eq.28 每步补一次。

![UPMRI 论文的推理流程图](/papers/mri/22-upmri-inference.png)

> **原文图注**：Figure 3: Inference via Dual-Space Cyclic Integration. The algorithm first samples latent noise y₁ via forward integration in the measurement space (blue). It then reconstructs the target image x₀ via backward integration (red), enforcing data consistency (green) at each step using the interpolated measurement path.

*图源：https://arxiv.org/html/2512.17493v1（Figure 3 原图，直接取自论文，未重绘、未描摹）。*

## 4. 论文证据与实验范围

**数据划分（§V-A）**：NYU fastMRI 脑 T2 加权，11094 / 1584 / 3172 张切片随机划分为训练 / 验证 / 测试；CMRxRecon 2023 心脏 T1/T2 定量 mapping，5451 / 779 / 1557 张。真值图像由全采样 k 空间做 SENSE 合并得到（x₀≜(Σ_cS_c*S_c)⁻¹Σ_cS_c*F*ŷ₀,c），敏感度图用 ESPIRiT 估计，自校准行数（ACL）沿用 [20] 与 [31] 的实现；欠采样为随机笛卡尔 1D 掩码，低频行全采、其余按加速倍率均匀随机采样；重建前的输入是零填充伴随 A*y₀。

**训练配置（§V-B）**：ADM U-Net 预测速度场（自适应组归一化 + 最低两级分辨率上的多头注意力与 dropout）；从零训练，AdamW，100K 步，学习率 10⁻⁴，权重衰减 0.1，每 100 步做一次 rate 0.99 的 EMA；原 k 空间噪声水平取 σ₀=10⁻²；推理积分步数 T=10，投影/伪逆的 CG 步数训练用 k=10、推理用 k=30。

**主结果（Table I，PSNR/SSIM）**：

| 方法 | 脑 4× PSNR | 脑 4× SSIM | 脑 8× PSNR | 脑 8× SSIM | 心脏 4× PSNR | 心脏 4× SSIM | 心脏 8× PSNR | 心脏 8× SSIM | NFE |
|---|---|---|---|---|---|---|---|---|---|
| Zero-Filled | 28.28 | 0.815 | 24.44 | 0.730 | 27.01 | 0.769 | 26.11 | 0.747 | N/A |
| MoDL（有监督） | 39.71 | 0.970 | 32.32 | 0.916 | 41.79 | 0.979 | 36.36 | 0.943 | 1 |
| DDNM+（有监督） | 40.00 | 0.938 | 35.24 | 0.920 | 44.93 | 0.977 | 39.60 | 0.953 | 100 |
| OT-ODE（有监督） | 33.95 | 0.907 | 28.86 | 0.852 | 35.65 | 0.922 | 32.08 | 0.870 | 100 |
| PnP-Flow（有监督） | 37.92 | 0.951 | 32.85 | 0.913 | 39.77 | 0.963 | 35.13 | 0.924 | 100 |
| SSDU | 28.13 | 0.831 | 26.61 | 0.792 | 32.64 | 0.888 | 29.23 | 0.811 | 1 |
| W-SSDU | 36.09 | 0.939 | 29.72 | 0.870 | 32.11 | 0.872 | 29.82 | 0.831 | 1 |
| R-SSDU | 36.23 | 0.941 | 29.27 | 0.856 | 33.93 | 0.912 | 31.10 | 0.861 | 1 |
| REI（无监督） | 21.59 | 0.683 | 21.62 | 0.715 | 23.65 | 0.736 | 26.62 | 0.716 | 1 |
| MOI（无监督） | 30.97 | 0.869 | 25.16 | 0.747 | 40.13 | 0.971 | 31.47 | 0.874 | 1 |
| ENSURE（无监督） | 32.75 | 0.899 | 27.12 | 0.800 | 34.57 | 0.918 | 30.27 | 0.849 | 1 |
| GTF²M（无监督） | 33.99 | 0.916 | 28.40 | 0.852 | 33.67 | 0.918 | 31.33 | 0.881 | 20 |
| **UPMRI（无监督）** | **42.19** | **0.983** | **35.08** | **0.948** | **52.39** | **0.994** | **40.50** | **0.974** | **20** |

（上表为 Table I 的数值转录（原文的粗体/下划线标注意义是各监督类别内的最优与次优，这里不再保留样式）；标准差见原表，例如 UPMRI 脑 4× 为 42.19 ± 3.71、心脏 4× 为 52.39 ± 9.81。作者报告 UPMRI 与其他方法的差异经双侧配对 t 检验 p<0.05 显著。）

- 脑 4×：UPMRI 42.19 dB / 0.983，比最好的有监督 MoDL（39.71 / 0.970）高 2.48 dB，比最好的自监督 R-SSDU（36.23 / 0.941）高 5.96 dB，比最接近的无监督 GTF²M（33.99）高 8.2 dB。
- 脑 8×：UPMRI 35.08 dB / 0.948；有监督扩散 DDNM+ 的 PSNR 稍高（35.24 dB），但 SSIM 明显更低（0.920 vs 0.948）——论文正是这样表述这一行的。
- 心脏：4× 为 52.39 dB / 0.994，比 DDNM+（44.93）高 7.46 dB、比最好的无监督 MOI（40.13）高 12.26 dB；8× 为 40.50 dB / 0.974，超过所有有监督候选（DDNM+ 39.60、MoDL 36.36）。

**推理耗时（Table II，单张 CMRxRecon 图像，NVIDIA A5000）**：UPMRI 500 ms / 20 NFE，GTF²M 1563 ms / 20 NFE，PnP-Flow 938 ms / 100 NFE，DDNM+ 1000 ms / 100 NFE，OT-ODE 1750 ms / 100 NFE，MoDL 58 ms / 1 NFE，SSDU 家族与 REI 19 ms / 1 NFE，MOI 与 ENSURE 58 ms / 1 NFE。论文据此声称在生成式方法里推理最快。

**参数研究（Fig. 6，心脏数据）**：积分步数 T 从 2 扫到 50，T=2→10 提升很快，之后 SSIM 趋于平台而 PSNR 仍有轻微线性增益，T=50 数值最高但代价线性增长，故默认 T=10；测试期 CG 步数 k 从 10 扫到 50，SSIM 与 PSNR 单调改善，约在 k=30 开始饱和，故默认 k=30（训练期仍用 10）。

**泛化（Fig. 7–9）**：4× 与 8× 各自训练的模型交叉评测，性能分布相近；在未见过的极端加速下 8× 训练的模型更稳：10× 时 8× 模型 SSIM 0.964 / PSNR 38.70 dB，4× 模型 0.950 / 36.94 dB；12× 时 8× 模型 0.956 / 37.42 dB，4× 模型 0.938 / 35.58 dB。作者的解释是在更稀疏的测量上训练迫使 PCFM 学到更稳健的先验。

**范围限制**：只有两个数据集、单中心公开数据；对照表里没有把 UPMRI 与“换骨干网络”的组合做消融；与 GTF²M 的公平对照（例如把后者换成相同的并行前向算子）只有文字说明；论文自己也提示“无监督”指训练数据，评估仍依赖 SENSE/ESPIRiT 构造的参考与敏感度图。

## 5. 复现与审计重点

- **没有官方实现（已核查）**：论文正文、arXiv 摘要页与附录都没有代码链接；第一作者 Xinzhe Luo 的 GitHub（`xzluo97`）与其导师 Chen Qin 的公开页面均未列出 UPMRI 仓库，GitHub 仓库搜索也查不到 UPMRI/GTF²M 的实现。**结论：未核实到可用实现，需要按论文自实现**（`codeUrl` 上报为 null）。上一版会议工作 GTF²M 也没有公开代码，因此连“改编自前作”这条路也不成立。
- **投影的数值近似是第一道墙**：Pₛ=Aₛ⁺Aₛ 在并行 MRI 下无闭式解，论文用 CG 解 Aₛ*Aₛr=Aₛ*Aₛ[v_θˣ-uₜˣ]，训练 10 步、推理 30 步。要复现必须自己写复数 CG、明确用 A*A 而非 AA*、并核对伴随算子与掩码的一致性；CG 步数直接决定“投影得多准”。
- **时间系数在正文与实现细节里不一致**：§III-B 与 Proposition 3 使用 aₜ=1-t, bₜ=t，而 §V-B 写“aₜ=t, bₜ=1-t，t 从 logit-normal 采样”。两者是同一条路径的两种时间取向（p₀ 为数据、p₁ 为噪声），但**方向不同**；复现时必须先确定时间索引方向再写插值和 ODE 步进，否则投影与积分会整体反向。原文没有解释这处差异。
- **Hutchinson 散度项是最容易写错的一环**：Eq.15 的期望在 b~CN(0,Pₛ) 下取得，即噪声也要投影；实现上需要一次对输入的 Jacobian-向量积（对复数场通常是双实通道），并把它乘上 2aₜaₜ'σ₀²。σ₀ 取 10⁻²，但它是“原 k 空间噪声水平”的假设值，不是从数据估出来的。
- **“无监督”的边界**：训练不需要全采样图像，但真值参考、ESPIRiT 敏感度图、以及掩码协议仍然是外部输入。Lemma 1 要求每个 k 空间位置在数据集里至少被采一次——随机掩码下这是概率性满足，实现时要注意不要用过稀的固定掩码。
- **成本分层**：推理级（用作者的 T=10,k=30）需要 ADM U-Net 权重与训练好的速度场；训练级需要 ADM U-Net、复数 CG、Hutchinson 迹估计与 11094 张脑切片。论文只给了推理硬件（A5000）与训练步数（100K），**没有交代训练 GPU 型号、批量大小与总时长**，训练成本需要自己评估。
- **评测对齐**：PSNR/SSIM 基于 SENSE 合并的幅度图；掩码、ACL 数、敏感度估计版本都会改变数值，跨表比较前要固定这些设置。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（双空间条件概率路径的图模型）→ `§III-A`（Eq.2–3 前向模型与 Lemma 1）→ `§III-B`（Eq.4–6 连续性方程与 CFM 目标）→ `§IV-A`（Eq.7–8 投影目标，Prop. 1 最优解，Eq.11–15 GSURE 无监督化）→ `Fig. 2`（PCFM 训练总览）→ `§IV-B`（Lemma 2–4、Prop. 3–4、Eq.25–28）→ `Algorithm 1` → `Fig. 3`（双空间循环推理）→ `§V-A–V-B`（数据与训练细节）→ `Table I`（主结果）→ `Table II`（耗时与 NFE）→ `Fig. 6`（T 与 k 的参数研究）→ `Fig. 7–9`（泛化）→ `§VI`（作者自陈的限制）→ 附录 `A-B`（Prop. 1 的证明：为什么最优解是条件的期望速度场）。

## 7. 前后关联

- 与 [DDS](20-dds.md) 对照：两者都把“昂贵的生成先验”和“便宜的物理求解”分工，但分工位置不同——DDS 在干净估计上用 CG 做一致性校正，UPMRI 用 CG 去近似投影算子、并把一致性写进每步反向积分（Eq.28）。两篇都要面对同一类权衡：CG 步数增加会变准，也会变贵。
- 与 [Score-MRI](06-score-mri.md) 对照：后者代表“真值训练 + 后验采样”的主流路线（p(x|y)∝p(y|x)p(x)，Eq.1），UPMRI 放弃了 p(x) 需真值这一前提，代价是要推导新的无监督目标与采样算法。
- 与 [MSC](13-msc.md) 对照：都在“测量子空间”上做文章，但 MSC 是插拔式的一致性算子（推理期使用），UPMRI 把子空间投影搬进了训练目标，用来替代真值。
- 与 [MC-SSDU](12-mc-ssdu.md) 对照：同属“不要全采样真值”的多线圈重建，SSDU 路线靠切分测量做留出监督（训练期丢数据），UPMRI 用全部测量 + GSURE，因此在 8× 这类高加速下优势更明显；Table I 里 SSDU / W-SSDU / R-SSDU 三行正是这条路的量级。
- 与 [MPFlow](18-mpflow.md) 对照：都是流匹配 + 逆问题，但 MPFlow 是零样本、靠多模态辅助后验引导，UPMRI 是有训练的、从欠采样测量里学先验；读的时候可以问同一个问题：测量约束是在生成过程的哪一步被注入的。
- 与 [CM-RED](14-cm-red.md) 对照：一致性模型 + 去噪正则同样想在少步数下做重建，可以对比“步数少”是靠蒸馏得来还是靠流匹配的路径性质得来。
- 直接对照的前作 GTF²M（Luo、Li、Qin，IPMI 2025，arXiv:2502.17174）不在本仓库；它是本文的单线圈版本，也是 Table I 中最近的无监督竞争者（脑 4× 33.99 dB），若要补齐“无真值流匹配”支线，可优先补这一篇。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2512.17493)
- [arXiv HTML 正文](https://arxiv.org/html/2512.17493v1)
- [arXiv PDF](https://arxiv.org/pdf/2512.17493v1)
- [故事式 HTML 精读页](/pathology-atlas/learning/upmri-story.html)
- 官方实现：**未核实到可用实现**（正文、摘要页与附录均无代码链接；作者 GitHub 与仓库搜索均无 UPMRI/GTF²M 仓库，核查日期 2026-10-13），需要按论文自实现。
