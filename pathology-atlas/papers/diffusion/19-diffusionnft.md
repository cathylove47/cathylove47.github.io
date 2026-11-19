# 19｜DiffusionNFT：把强化学习搬到扩散的前向过程

**论文**：DiffusionNFT: Online Diffusion Reinforcement with Forward Process
**作者**：Kaiwen Zheng、Huayu Chen（共同一作）、Haotian Ye、Haoxiang Wang、Qinsheng Zhang、Kai Jiang、Hang Su、Stefano Ermon、Jun Zhu†、Ming-Yu Liu†（清华大学、NVIDIA、Stanford；†通讯）
**发表**：ICLR 2026（Oral，proceedings.iclr.cc 已见刊，Paper 7069）；arXiv:2509.16117v1（2025-09-19）/ v2（2026-02-16）
**定位**：扩散/流模型的在线 RL 后训练；把「正样本 vs 负样本」的对比写成隐式策略改进方向，直接优化 flow matching 的前向损失，因此采样器无关、不需要 CFG、不需要存采样轨迹
**核验**：2026-11-18 依 arXiv HTML v2 全文（§1–6、附录 A–D、Theorem 3.1/3.2 及附录 A 的完整证明、Eq. 1–26、Table 1 与附录 Table 2、Fig. 1–13、Algorithm 1）与 ICLR 2026 会议版 PDF（22 页，首页摘要与附录 D 的 Table 2 逐项对照，与 v2 一致）整理；代码对照 `NVlabs/DiffusionNFT` main@cbb14f84（最后推送 2026-02-10）的 README、`config/base.py`、`config/nft.py`、`scripts/train_nft_sd3.py`、`flow_grpo/{ema,stat_tracking,prompts}.py`、`flow_grpo/diffusers_patch/solver.py`；HF LoRA 仓库只读了 API 元数据。**未运行训练、采样与评测，未下载权重**；本页所有数字为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | SD3.5-Medium（2.5B）文生图后训练，512×512，LoRA，全程 CFG-free |
| 输入 / 输出 | 输入 prompt $c$；输出图 $x_0$。训练只吃「干净图 + 标量奖励」，不吃轨迹 |
| 奖励 | 规则：GenEval、OCR；模型：PickScore、ClipScore、HPSv2.1、Aesthetic、ImageReward、UnifiedReward |
| 关键对象 | 速度场 $v_\theta(x_t,c,t)$；隐式正/负策略 $v_\theta^+$、$v_\theta^-$；reinforcement guidance $\Delta$；引导强度 $\beta$ |
| 训练目标 | 一个带奖励权重的 flow matching 监督损失（Eq. 5），不含似然、不含策略梯度 |
| 采样 | 数据收集可用任意黑盒求解器（代码支持 flow / ddim / dance / dpm1 / dpm2，默认 dpm2 二阶） |
| 规模 | 每轮 48 组 × 每组 24 张；LoRA $\alpha=64$、$r=32$、lr $3\times10^{-4}$ |
| 代码 / 权重 | Apache-2.0；HF 上有官方多奖励 LoRA（`worstcoder/SD3.5M-DiffusionNFT-MultiReward`） |

## 原文摘要

> Online reinforcement learning (RL) has been central to post-training language models, but its extension to diffusion models remains challenging due to intractable likelihoods. Recent works discretize the reverse sampling process to enable GRPO-style training, yet they inherit fundamental drawbacks, including solver restrictions, forward-reverse inconsistency, and complicated integration with classifier-free guidance (CFG). We introduce Diffusion Negative-aware FineTuning (DiffusionNFT), a new online RL paradigm that optimizes diffusion models directly on the forward process via flow matching. DiffusionNFT contrasts positive and negative generations to define an implicit policy improvement direction, naturally incorporating reinforcement signals into the supervised learning objective. This formulation enables training with arbitrary black-box solvers, eliminates the need for likelihood estimation, and requires only clean images rather than sampling trajectories for policy optimization. DiffusionNFT is up to $25\times$ more efficient than FlowGRPO in head-to-head comparisons, while being CFG-free. For instance, DiffusionNFT improves the GenEval score from 0.24 to 0.98 within 1k steps, while FlowGRPO achieves 0.95 with over 5k steps and additional CFG employment. By leveraging multiple reward models, DiffusionNFT significantly boosts the performance of SD3.5-Medium in every benchmark tested.

*来源：arXiv:2509.16117 摘要页（v2）。逐字复制；HTML/PDF 里 "forward–reverse" 用的是 en dash，摘要页写作连字符，此处从摘要页。*

## 中文摘要

> 在线强化学习（RL）一直是语言模型后训练的核心，但由于似然不可解，把它扩展到扩散模型仍然困难。近期工作离散化反向采样过程以支持 GRPO 式训练，却继承了若干根本缺陷：求解器受限、前向–反向不一致、以及与无分类器引导（CFG）的集成方式复杂。我们提出 Diffusion Negative-aware FineTuning（DiffusionNFT），一种新的在线 RL 范式，通过 flow matching 直接在前向过程上优化扩散模型。DiffusionNFT 将正样本与负样本生成做对比，定义一个隐式的策略改进方向，从而把强化信号自然地并入监督学习目标。该形式允许使用任意黑盒求解器、免去似然估计，且策略优化只需要干净图像而不需要采样轨迹。在正面比较中，DiffusionNFT 的效率最高达到 FlowGRPO 的 $25\times$，同时完全不用 CFG。例如，DiffusionNFT 在 1k 步内把 GenEval 从 0.24 提升到 0.98，而 FlowGRPO 需要超过 5k 步并额外使用 CFG 才达到 0.95。借助多个奖励模型，DiffusionNFT 在被测的每一个基准上都显著提升了 SD3.5-Medium 的表现。

*译文：逐句对译上方原文，未增删内容；专有名词与数字以英文原文为准。*

## 0. 三分钟摘要

**一句话**：扩散模型只有一条前向加噪过程，却有无穷多条反向采样过程；既然 RL 的麻烦全来自「反向过程要离散成 MDP」，那就干脆在前向过程上做策略改进——把奖励变成 flow matching 损失里的权重。

**GRPO 式扩散 RL 的三个痛点**：
1. **前向不一致**：只在反向采样链上做策略梯度，模型学到的转移只满足反向核，与真正的前向加噪过程（Fokker-Planck 意义下的联合分布）脱钩，作者担心模型退化成「一串高斯级联」。
2. **求解器受限**：要算出可解的高斯转移核，只能用一阶 SDE 采样器；流模型默认用 ODE 或高阶求解器，这条约束等于放弃它们。
3. **CFG 集成复杂**：CFG 需要条件 + 无条件两个模型，在线 RL 里就变成两套模型的联合优化。

**它做了什么**：把奖励 $r$ 归一化成「最优性概率」$r\in[0,1]$，用 $r$ 和 $1-r$ 分别加权两个**镜像参数化**的速度场 $v_\theta^+$、$v_\theta^-$，最小化普通的 flow matching 平方误差。负样本那一支的构造方式是「外推」而不是「插值」，于是最小化它的误差等价于把 $v_\theta$ 推离负样本。

**关键数字**（都是论文值）：
- 多奖励联合训练 1.7k 步后，CFG-free 模型在 GenEval 0.94 / OCR 0.91 / PickScore 23.80 / HPSv2.1 0.331 / ImageReward 1.49，全面超过 CFG 版 SD3.5-M，也超过 SD3.5-L 与 FLUX.1-Dev（Table 1）。
- 单奖励对打 FlowGRPO：GenEval 0.98@1k vs 0.97@4k（都从 CFG-free 初始化，Table 2）；OCR 0.97@150 vs 0.96@1k；PickScore 24.03@2k vs 23.62@4k。
- 把负样本那一支的损失删掉，奖励「几乎立刻塌掉」（§4.4）。

### 实验先看什么

Table 1（多奖励，全指标表）→ 附录 Table 2（单奖励对打，唯一同初始化、同 CFG 设置的口径）→ Fig. 1/6（效率曲线）→ Fig. 7–10（采样器、软更新、权重、β 消融）。

## 1. 问题与核心判断

**一般 RL 的做法**：策略梯度要求可算（或可估）的 $\log p_\theta$。自回归模型天然有；扩散模型只有概率流 ODE 或 SDE 变分下界给的近似，误差不可控。绕开它的主流办法是把反向采样离散成 $T$ 步 MDP，让相邻步的转移成为已知高斯，于是 GRPO/PPO 可以套用。

**作者的核心判断**：策略改进不需要似然，只需要「改进方向」。设 $\pi^{\text{old}}$ 是当前策略，$r(x_0,c)=p(o=1\mid x_0,c)$ 是奖励给出的最优性概率，把采样按 $r$ 划成 $D^+$ 与 $D^-$ 两个假想子集，则

$$\pi^+(x_0\mid c)\propto r(x_0,c)\,\pi^{\text{old}}(x_0\mid c),\qquad \pi^-(x_0\mid c)\propto [1-r(x_0,c)]\,\pi^{\text{old}}(x_0\mid c),$$

且排序恒成立：$\pi^+\succ\pi^{\text{old}}\succ\pi^-$（$\succ$ 指期望奖励更大）。只用 $D^+$ 训练就是 Rejection FineTuning（RFT），它扔掉了一半信息；作者要的是同时用正负两边。

**所以改进被写成速度场的一个加性偏移**：

$$v^*(x_t,c,t):=v^{\text{old}}(x_t,c,t)+\frac{1}{\beta}\Delta(x_t,c,t).$$

形式上这就是 CFG：$v^{\text{cfg}}=v^{\text{uncond}}+s\,(v^{\text{cond}}-v^{\text{uncond}})$。$\Delta$ 被称作 **reinforcement guidance**，$1/\beta$ 是引导强度。全文的赌注就是：只要能造出合法的 $\Delta$ 并能把它学进单个模型，就等于在不碰采样器的前提下做了策略改进；CFG 则是「离线版的 reinforcement guidance」，可以被 RL 吸收掉。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| 前向一致性（forward consistency） | 训练出的模型必须对应一个合法的前向加噪过程，即 $(x_t,x_0)$ 的联合分布确实由 $x_t=\alpha_tx_0+\sigma_t\epsilon$ 生成。反向 MDP 式训练不管这条 |
| 最优性概率 $r$ | 把任意标量奖励压到 $[0,1]$，解释成「这张图算成功」的概率；它是连续奖励与「正 / 负二分」之间的桥 |
| 隐式正策略 $v_\theta^+$ | $(1-\beta)v^{\text{old}}+\beta v_\theta$。不是第二个模型，是同一个 $v_\theta$ 与冻结旧策略的线性组合 |
| 隐式负策略 $v_\theta^-$ | $(1+\beta)v^{\text{old}}-\beta v_\theta$。注意是**外推**（$-\beta$），所以拉低它的误差就是推远 $v_\theta$ |
| reinforcement guidance $\Delta$ | 正负两支速度场差的公共方向，Theorem 3.1 说两个方向的差彼此平行 |
| 软更新 $\eta_i$ | 采样策略 $\theta^{\text{old}}\leftarrow\eta_i\theta^{\text{old}}+(1-\eta_i)\theta$，用 EMA 代替硬拷贝，天然 off-policy |
| RFT | 只在正样本上做监督微调；本文的消融显示它在扩散上会崩，与 LLM 的经验相反 |

## 3. 核心方法与数据流

```text
每轮 outer epoch i:
  用采样策略 v_old（第二个 LoRA adapter "old"）+ 任意求解器（默认 dpm2 二阶 ODE，10 步）
    对每个 prompt c 生成 K=24 张干净图 x_0 → 评奖励 r_raw → 组内标准化成 advantage → 映射到 r∈[0,1]
    只保留 x_0 与该 prompt 的采样时刻表，轨迹丢弃
  训练（遍历这批数据 × 时刻表）:
    x_t = (1-t)x_0 + t·ε,  v = ε - x_0            ← rectified flow 前向过程，唯一"数据增强"就是加噪
    v_θ⁺ = (1-β)v_old + β v_θ      （正支，插值）
    v_θ⁻ = (1+β)v_old - β v_θ      （负支，外推）
    L = r·‖v_θ⁺-v‖²_w + (1-r)·‖v_θ⁻-v‖²_w        ← w 为自适应权重（x0 回归误差自归一化）
    反传更新 v_θ（代码里另加一项对 reference 的 KL，权重 1e-4，论文未写）
  收尾: θ_old ← η_i·θ_old + (1-η_i)·θ,  清空 buffer
```

### 3.1 混合拆分：为什么 $\Delta$ 一定存在（Lemma A.1、A.2）

$\pi^{\text{old}}$ 是 $\pi^+$ 与 $\pi^-$ 按 $p(o=1\mid c)=\mathbb E_{\pi^{\text{old}}}r$ 的凸组合（Lemma A.1，Eq. 9）。加噪之后，由于三者的前向核相同，**同样的线性拆分传递到后验**：

$$\pi^{\text{old}}(x_0\mid x_t,c)=\alpha(x_t)\,\pi^+(x_0\mid x_t,c)+[1-\alpha(x_t)]\,\pi^-(x_0\mid x_t,c),$$

$$\alpha(x_t)=\frac{\pi^+_t(x_t\mid c)}{\pi^{\text{old}}_t(x_t\mid c)}\,\mathbb E_{\pi^{\text{old}}}r(x_0,c).$$

这一步是整篇文章的技术支点：它把「分布层面的混合」变成「同一 $x_t$ 上的后验混合」，因此可以逐点比较。

### 3.2 Theorem 3.1：两个方向的差平行

速度场是后验均值的仿射函数（$v=a_tx_t+b_t\mathbb E[x_0\mid x_t]$，$a_t=\dot\sigma_t/\sigma_t$，$b_t=\dot\alpha_t-\dot\sigma_t\alpha_t/\sigma_t$），所以后验的线性拆分直接搬到速度场：$v^{\text{old}}=\alpha v^++(1-\alpha)v^-$。移项即得

$$\Delta:=[1-\alpha(x_t)]\,[v^{\text{old}}-v^-]=\alpha(x_t)\,[v^+-v^{\text{old}}].$$

也就是说「离负策略有多远」与「离正策略有多远」是同一个方向的两种标度。$\Delta$ 因此是一个合法的引导方向，不需要额外假设。

### 3.3 Theorem 3.2：把 $\Delta$ 学进一个模型

$$\mathcal L(\theta)=\mathbb E_{c,\,\pi^{\text{old}}(x_0\mid c),\,t}\;r\,\Vert v_\theta^+-v\Vert_2^2+(1-r)\,\Vert v_\theta^--v\Vert_2^2$$

代入 $v_\theta^\pm=(1\mp\beta)v^{\text{old}}\pm\beta v_\theta$（上符号对应正支）并配方，可写成两个带权平方误差之和，其最优解为

$$v_{\theta^*}(x_t,c,t)=v^{\text{old}}+\frac{2}{\beta}\Delta.$$

直觉很清楚：$r\to1$ 时只有正支生效，$v_\theta$ 被拉向「更像正样本」；$r\to0$ 时只有负支生效，最小化 $\Vert v_\theta^--v\Vert^2$ 等价于把 $v_\theta$ **推离** $v$。两支在最优处共线，系数相加得到 $2/\beta$。$\beta$ 越小引导越强，与 CFG 的 guidance scale 完全同构。

**要留意的逻辑链**：算法从不真正估计 $\Delta$（那需要 $\alpha(x_t)$ 里不可解的 $\pi^+_t/\pi^{\text{old}}_t$）。它只保证「若优化到位，等效于施加了 $2\Delta/\beta$ 的引导」。实际训练是有限步 SGD，走多远由 $\beta$、学习率、内层 epoch 数共同决定——论文没有给「走多少才安全」的判据。

### 3.4 三个实现细节（§3.3）

1. **奖励 → 最优性概率**：$r=\frac12+\frac12\texttt{clip}[(r^{\text{raw}}-\mathbb E_{\pi^{\text{old}}}r^{\text{raw}})/Z_c,-1,1]$，$Z_c$ 可取全局奖励标准差。这一步让连续的图像质量分数变成「一半概率算成功」。
2. **软更新采样策略**：$\eta_i=0$ 是严格 on-policy（前期快、极易崩），$\eta\to1$ 是近离线（稳但慢），实践用 $\eta_i=\min(0.001i,0.5)$ 这类爬升调度。
3. **自适应时间权重**：把 $w(t)\Vert v_\theta-v\Vert^2$ 换成自归一化的 $x_0$ 回归，$\Vert x_\theta-x_0\Vert^2/\texttt{sg}(\overline{|x_\theta-x_0|})$。动机来自 DMD；实测比 $w(t)=1-t$ 稳定（后者直接崩）。

### 3.5 与 FlowGRPO 的解析关系（附录 B.3，值得单独读）

作者把任意一阶 SDE 采样步写成 $x_s=l x_t-m v_\theta(x_t,t)+n\epsilon$，代进 GRPO 的负 advantage 加权对数似然后求梯度，得到

$$\nabla_\theta\mathcal L_{\text{GRPO}}=\frac{m}{n}\nabla_\theta\Big[\frac1N\sum_i (A^{(i)}\epsilon^{(i)})^\top v_\theta(x_t,t)\Big],$$

再用 Stein 恒等式把它化成 $-\frac1\sigma\nabla_\theta\mathbb E[r_s(\cdot)]$。结论有两句：**FlowGRPO 本质上是在把速度场对齐到「advantage 加权的噪声」**；它等价于 reward backprop 的一个零阶（REINFORCE 式）梯度估计，方差更大，但不用对 $s\to0$ 的采样链反传。这段分析对理解「为什么 GRPO 的采样器选择只影响权重 $m/n$」很有用。

## 4. 实验与证据

**设置**：SD3.5-Medium，512×512，LoRA。每轮 48 组 × 24 张，10 步采样做对打 / 消融，40 步做最佳视觉质量；评估统一 40 步一阶 ODE。对打时固定 10 步以保证与 FlowGRPO 同样的采样预算。

**Table 1（多奖励联合训练，§4.2）**——摘录，加粗为最优、下划线为次优（原表）：

| 模型 | #Iter | GenEval | OCR | PickScore | ClipScore | HPSv2.1 | Aesthetic | ImgRwd | UniRwd |
|---|---|---|---|---|---|---|---|---|---|
| SD-XL‡ | — | 0.55 | 0.14 | 22.42 | 0.287 | 0.280 | 5.60 | 0.76 | 2.93 |
| SD3.5-L‡（8B） | — | 0.71 | 0.68 | 22.91 | 0.289 | 0.288 | 5.50 | 0.96 | 3.25 |
| FLUX.1-Dev（12B） | — | 0.66 | 0.59 | 22.84 | 0.295 | 0.274 | 5.71 | 0.96 | 3.27 |
| SD3.5-M（w/o CFG） | — | 0.24 | 0.12 | 20.51 | 0.237 | 0.204 | 5.13 | −0.58 | 2.02 |
| + CFG | — | 0.63 | 0.59 | 22.34 | 0.285 | 0.279 | 5.36 | 0.85 | 3.03 |
| + FlowGRPO† | >5k | 0.95 | 0.66 | 22.51 | 0.293 | 0.274 | 5.32 | 1.06 | 3.18 |
| + Ours | 1.7k | 0.94 | 0.91 | 23.80 | 0.293 | 0.331 | 6.01 | 1.49 | 3.49 |

† 官方 checkpoint。三点值得注意：① 起点 CFG-free 的 SD3.5-M 极弱（GenEval 0.24），RL 之后不仅补回 CFG 的差距，还反超；② 三个「out-of-domain」指标（Aesthetic / ImageReward / UnifiedReward）也全面上升，说明不是把奖励刷爆；③ 模型仍只有 2.5B，却压过 8B/12B 的 CFG 模型。

**附录 Table 2（单奖励对打，唯一同初始化、同 CFG 设置的口径）**——两边都从 CFG-free 基座出发：

| 训练奖励 | 模型 | #Iter | GenEval | OCR | PickScore | HPSv2.1 | Aesthetic | ImgRwd |
|---|---|---|---|---|---|---|---|---|
| GenEval | FlowGRPO | 4k | **0.97** | 0.30 | 21.78 | 0.248 | 5.15 | 0.74 |
| GenEval | Ours | 1k | **0.98** | 0.36 | 21.92 | 0.251 | 5.33 | 0.68 |
| OCR | FlowGRPO | 1k | 0.66 | **0.96** | 21.94 | 0.257 | 5.18 | 0.31 |
| OCR | Ours | 150 | 0.54 | **0.97** | 21.63 | 0.246 | 5.19 | 0.37 |
| PickScore | FlowGRPO | 4k | 0.54 | 0.60 | 23.62 | 0.295 | 6.42 | 1.17 |
| PickScore | Ours | 2k | 0.53 | 0.64 | **24.03** | 0.315 | 6.17 | 1.29 |

**这张表是本页最该认真读的地方，因为它和摘要的口径不同。**摘要写的是「1k 步到 0.98，FlowGRPO 需要 >5k 步外加 CFG 才到 0.95」。但 Table 2 里从同一 CFG-free 基座重训的 FlowGRPO 在 4k 步就达到 **0.97**。所以：
- 摘要那个 0.95 对应的是 Table 1 里打 † 的**官方 CFG checkpoint**，不是同条件的重训结果；
- 同条件比较下，GenEval 的效率差约为 **4×**（1k vs 4k，0.98 vs 0.97），不是摘要暗示的 5× 以上；OCR 约 **6.7×**（150 vs 1k，0.97 vs 0.96）；PickScore 约 **2×**（2k vs 4k，24.03 vs 23.62）；
- 正文的说法是「wall-clock 上 3× 到 25×」（§4.3），25× 来自 Fig. 6 的曲线端点，论文没给逐点分解，谁在哪个任务上吃到 25× 只能从图上读，**未确认**具体归属。

**消融（§4.4，图为证）**：
- **负样本损失**：删掉 $v_\theta^-$ 那一支，在线训练里奖励「几乎立刻塌」。作者明确说这与 LLM 的经验相反（LLM 上 RFT 仍是强基线）。
- **采样器**（Fig. 7）：ODE 优于 SDE，PickScore 上尤其明显（对噪声敏感）；二阶 ODE 在 GenEval 上略好于一阶——这也是本文能自由换求解器的直接收益。
- **自适应权重**（Fig. 9）：$t$ 大时给更大权重更稳，$w(t)=1-t$ 反向加权直接崩。
- **软更新**（Fig. 8）：$\eta=0$ 前期快但抖，$\eta=0.9$ 收敛太慢，小 $\eta$ 起步、逐步升高的调度最好。
- **$\beta$**（Fig. 10）：$\beta$ 接近 1 稳定，实践中取 1（GenEval/PickScore）或 0.1（OCR、多奖励，为了奖励上升更快）。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库：[NVlabs/DiffusionNFT](https://github.com/NVlabs/DiffusionNFT)，main@cbb14f84，Apache-2.0，README 首行标 **ICLR 2026 (Oral)**。
- 完整：训练脚本 `scripts/train_nft_sd3.py`（46 kB）、配置 `config/{base,nft}.py`、数据（`dataset/{geneval,ocr,pickscore,drawbench}`）、奖励实现 `flow_grpo/rewards.py` 与 8 个 scorer、求解器 `flow_grpo/diffusers_patch/solver.py`（flow/ddim/dance/dpm1/dpm2）、评估 `scripts/evaluation.py`。
- 权重：HF `worstcoder/SD3.5M-DiffusionNFT-MultiReward`（仅 LoRA adapter，`adapter_model.safetensors`，2025-10-09 更新）。
- 环境：基于 Flow-GRPO 代码库；奖励环境需要自行装 mmcv/mmdet（GenEval）、PaddleOCR、hpsv2x、image-reward，UnifiedReward 还要起 sglang 服务。README 给的模型是 `stabilityai/stable-diffusion-3.5-medium`，没有提供训练日志或复现说明。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| Eq. 5 损失 $r\Vert v_\theta^+-v\Vert^2+(1-r)\Vert v_\theta^--v\Vert^2$ | `scripts/train_nft_sd3.py:934–960`（`positive_prediction`、`implicit_negative_prediction`、`ori_policy_loss`） |
| Eq. 5 的 $v_\theta^\pm$ 参数化 | 同上 934–937，`config.beta` 即论文 $\beta$（geneval/pickscore 为 1.0，ocr/multi_reward 为 0.1） |
| 最优性概率 $r$ 的映射 | 928–929：`r = clamp((clip(adv,-5,5)/5)/2 + 0.5, 0, 1)`；advantage 来自 `stat_tracking.PerPromptStatTracker`（750 行） |
| 自适应时间权重 | 940–955：`x0_pred = xt - t·v`，分母是误差绝对值的均值（stop-grad），与 §3.3 的公式一致 |
| 软更新 $\eta_i$ | `return_decay` 169–187（type 1 → `min(0.001·step, 0.5)`；type 2 → 前 75 步 0，之后 0.0075·step 截到 0.999）+ 1035–1039 的 EMA 拷贝 |
| 采样求解器 | `flow_grpo/diffusers_patch/solver.py:14` `run_sampling`，`assert solver in ["flow","dance","ddim","dpm1","dpm2"]` |
| 二阶 ODE（附录 B.2 的 Eq. 17） | 同文件 `dpm_step` → `multistep_dpm_solver_second_order_update`（317 行起） |
| “只存干净图” | 663–669：`"latents_clean": latents[:, -1]`，轨迹不参与训练 |

**代码与论文不一致 / 读代码时要留意的地方**

1. **多了一项 KL**：`loss += config.train.beta * mean(kl_div)`（970 行），`config.train.beta=1e-4`（`config/base.py`），KL 项 $=\Vert v_\theta-v^{\text{ref}}\Vert^2$。论文 Eq. (5) 与 Algorithm 1 都没有这一项。复现时这一项会影响「能走多远」，不能忽略。
2. **$r$ 的实际定义**：论文写 $Z_c$ 是「某个归一化因子，可以取全局奖励 std」；代码里 advantage 先按 `adv_clip_max=5` 截断，再 `/5/2+0.5`，等价于 $Z_c=5\sigma$ 且 clip 发生在标准差单位上；且 `global_std=True`（`config/base.py`）意味着 $\sigma$ 取**全 batch** 的标准差而非单 prompt 组内。
3. **采样策略是第二个 LoRA adapter**：`add_adapter("old")`（438 行），EMA 拷贝到该 adapter，训练时 `set_adapter("old")` 拿 $v^{\text{old}}$。所以「$v^{\text{old}}$ 冻结」在实现上是「同一权重上多一套 LoRA」。全参数训练分支是 `assert False`，未实现。
4. **轨迹仍被物化**：`latents = torch.stack(latents, dim=1)`（660 行）先把整条采样链 stack 起来再取 `[:, -1]`。论文宣称「不需要存轨迹」，训练确实不用，但显存上并没有真的省掉这一份。
5. **多奖励只放了第一阶段**：`config/nft.py` 的 `sd3_multi_reward` 只配了 PickScore/HPSv2/ClipScore 三个奖励、25 步采样，对应论文 §4.2 多阶段方案的第 (1) 阶段；换数据集接 GenEval/OCR 奖励的后续阶段（800/300/200/200/100 步的排程）没有对应配置，要自己拼。
6. **默认采样是纯 ODE**：`sample.deterministic=True`，`solver="dpm2"`，`run_sampling` 里 `eta if not determistic else 0`，且 dpm 分支 `assert determistic`。配置里的 `noise_level=0.7` 因此不生效——论文 Fig. 7 关于 SDE 噪声的结论要靠改配置（`flow`/`ddim` + `deterministic=False`）才能复现。
7. **Table 1 与附录 Table 2 的 FlowGRPO 单奖励行对不上**：OCR 行 Table 1 是 2k 步 / 0.92，Table 2 是 1k 步 / 0.96；PickScore 行 Table 1 是 4k / 23.50，Table 2 是 4k / 23.62。复现与引用时以附录 Table 2 为准（它有完整列）。

### 5.2 第一个该做的验证（不用大模型，也不用复现 SD3.5）

**目标**：确认「负分支」在你的场景里是否同样不可省。这是本文最强的实证主张，也是最容易在小规模上推翻的。

**做法**：拿一个已有的 512×512 病理流模型（细胞的 flow matching 生成器即可，不必是 SD3.5），定义一个**逐样本**可算的奖励，例如「生成 patch 的核面积比与条件 mask 的偏差」或「UNI 特征与目标 patch 的余弦相似度」。用同一个 prompt 采 24 张、ODE 10 步收集，按 $r$ 分正负，跑两组：完整 NFT（Eq. 5）与只保留正支（等价 RFT）。对比奖励曲线与崩溃点。

**同时要看的诊断量**：`calculate_zero_std_ratio` 已经写在代码里（192 行）——统计「组内奖励标准差为 0」的比例。如果病理奖励是确定性的形态学指标，同 prompt 的 24 张图很可能给出高度同质的奖励，$r$ 全挤在 0.5 附近或全 1，负分支立刻失效。这个比例一高，说明当前奖励设计撑不起 NFT，要先换奖励而不是调超参。

**迁移到病理要回答的问题**：
1. 病理没有「GenEval 式」的可判定奖励。形态学奖励（核密度、腺体面积、染色强度）容易被生成器直接刷爆；UNI/CONCH 特征奖励则可能被「对抗性骗过编码器」——本文所有奖励都是自然图像预训练的偏好/对齐模型，没有面对过「奖励本身是病理基础模型」的情况。
2. CFG-free 起点在本文是 0.24 GenEval（很弱），靠 RL 补回来。病理领域的流模型往往本来就没有训 CFG（也没有 dropout 条件），起点质量更差，256–512 的样本空间更小，负分支推离的幅度是否需要更保守的 $\beta$？**未确认**。
3. 奖励是「集合级」指标（FID、KID）时无法做逐样本 RL；这是病理生成论文最常见的评测方式，也是 NFT 落地的第一道坎。

## 6. 前后关联

- **前向过程与速度参数化**：[Flow Matching](08-flow-matching.md) 给出 $v=\dot\alpha_t x_0+\dot\sigma_t\epsilon$ 的回归目标；[Rectified Flow](09-rectified-flow.md) 是 $\alpha_t=1-t,\sigma_t=t$ 的特例，本文所有公式与代码都在这条特例上。
- **反向过程 RL 的代表**：[Flow-GRPO](18-flow-grpo.md) 把采样离散成 MDP 做 GRPO，是本文的正面对手；附录 B.3 的推导值得和 Flow-GRPO 原文一起读——它说明 GRPO 的目标等价于「对齐 advantage 加权的噪声」。
- **上游算法**：NFT 这一族源自语言模型侧的工作（Chen et al., *Bridging Supervised Learning and Reinforcement Learning in Math Reasoning*, arXiv:2505.18116），本文是第一篇把它搬到扩散的。
- **同一族的其他路线**：DDO（Zheng et al. 2025，用高质量数据当正样本、自采样当负样本，仍需似然近似）、Diffusion-DPO（需要成对偏好数据）、ReFL / Reward Backprop（需要可微奖励、只能反传低噪声段）。
- **采样器与 SDE**：[DDPM](02-ddpm.md) / [Score-SDE](04-score-sde.md) 提供反向 SDE 的框架，附录 B.1 用它把 Flow-GRPO 的 $g_t=a\sqrt{t/(1-t)}$ 解释成 $\lambda_t$ 的缩放（$a=\sqrt2\lambda_t$），这段推导比原文更干净。
- **病理里的落点**：[BigCell](../pathology/64-bigcell.md)、[PathLDM](../pathology/71-pathldm.md) 这类条件生成器如果要「按下游指标偏好」微调，NFT 的「只要干净图 + 标量奖励」是最省事的形式；[SuperDiff](../pathology/78-histo-diffusion.md) 的超分也可以用「下游分割一致性」当奖励试一次。

## 7. 局限与可检验问题

**作者承认的**：
- 理论只在「无限数据 + 无限容量」下成立（Theorem 3.2 的前提），没有有限步收敛分析；
- 实验只做 SD3.5-Medium + LoRA，未验证全参数训练（代码里那条分支直接 `assert False`）；
- 多奖励训练需要人工设计的分阶段课程（先质量后规则），阶段与步数是手调的；
- 奖励都是「代理指标」：PickScore/HPSv2 这类分数涨了不等于图像真的更好。

**我的看法（作者没写的）**：
1. **理论给的是方向，不是步长**。$v_{\theta^*}=v^{\text{old}}+2\Delta/\beta$ 是无穷步优化的不动点；实际每轮只走几步 SGD，真正的偏移量由一个没人控制的比例决定。$\beta$ 和 $\eta$ 的网格本质上是在替这个比例擦屁股——所以我们看到「$\beta$ 接近 1 稳定、0.1 奖赏升得快但容易崩」这种纯经验结论。这是它比 GRPO 更简单也更脆的根源。
2. **没有 trust region**。GRPO 至少有 ratio clip 与组内归一化；NFT 的权重直接是 $r$ 与 $1-r$，奖励噪声原封不动进梯度，等于把噪声当监督标签。$r$ 的组内方差消失（奖励饱和）时算法静默退化成 RFT，而 RFT 在扩散上会崩——这是一个**可检验的机制预测**：崩溃前应该先看到 `zero_std_ratio` 上升。论文有这条日志却没有把它和崩溃联系起来分析。
3. **25× 的说法混了基线**。见 §4 的核算：同条件下 GenEval 约 4×、OCR 约 6.7×、PickScore 约 2×。25× 是 wall-clock 曲线端点，没有逐任务分解；摘要的 0.95 又取自 CFG 官方 checkpoint。这两个「口径抬升」叠起来会让读者高估效率优势。方法本身的价值不依赖这个数字。
4. **「不需要 CFG」值得再确认一下它的代价**。Table 1 的 OCR 列里，GenEval 单奖励训练的模型掉到 0.30，附录说明「为补偿，评估非 OCR 指标时对 OCR 模型重新开启 CFG」——也就是说 CFG 并没有被彻底淘汰，只是在主指标上不必要。多奖励联合训练确实把它替代掉了，但那是 5 个奖励 + 分阶段课程换来的。

**可检验问题**：
- 把 $r$ 换成二值（`adv_mode="binary"`，代码里现成）与连续 $r$ 对比，性能差多少？如果二值不掉点，说明「最优性概率」的精细分级没那么重要，Theorem 3.1 的 $\alpha$ 也就是个权重而已。
- 训练中 $\alpha(x_t)$ 的真实行为无法测（含不可解比值），但可以间接测：固定 $\beta$、扫 $\eta$，看 $v_\theta-v^{\text{old}}$ 的范数随训练的变化。如果偏移量先增后减，说明存在一个「有效引导饱和」，那 $\beta$ 就有了可调的物理含义。
- 采样器换成 dpm2 后，收集数据的分布与训练时刻表错位（训练用采样时刻表 $t$，但 dpm2 的中间状态并不严格满足 $x_t=\alpha_tx_0+\sigma_t\epsilon$ 的边际）。论文没讨论这种错位，但它可能是「二阶略微更好」的原因之一。

## 8. 来源与版本

- arXiv 摘要：<https://arxiv.org/abs/2509.16117>（v1 2025-09-19；v2 2026-02-16，comments 标 "ICLR 2026 Oral"）
- arXiv 全文（本页主要依据）：<https://arxiv.org/html/2509.16117v2>
- ICLR 2026 会议版（22 页，与 v2 一致）：<https://proceedings.iclr.cc/paper_files/paper/2026/hash/d8e68ddfe22520b45b8fb8d5cbde5a21-Abstract-Conference.html>
- PDF：<https://proceedings.iclr.cc/paper_files/paper/2026/file/d8e68ddfe22520b45b8fb8d5cbde5a21-Paper-Conference.pdf>
- 代码：<https://github.com/NVlabs/DiffusionNFT>（main@cbb14f84，2026-02-10）
- 权重：<https://huggingface.co/worstcoder/SD3.5M-DiffusionNFT-MultiReward>（LoRA adapter）
- 项目页：<https://research.nvidia.com/labs/dir/DiffusionNFT>
- NFT 的 LLM 源头：Chen et al., arXiv:2505.18116（*Bridging Supervised Learning and Reinforcement Learning in Math Reasoning*）
- 主要对照：Flow-GRPO，Liu et al., arXiv:2505.05470

> **关于 Oral 的核验**：proceedings.iclr.cc 的 2026 论文列表里本篇以 "Conference" 轨道收录（Paper 7069），arXiv comments 与官方仓库 README 均标 "ICLR 2026 (Oral)"。OpenReview forum 页因站点 challenge 校验无法直接读取，**oral 的正式标注未从 OpenReview 侧确认**，但两处作者自述一致，按 Oral 记。
