# 18｜Flow-GRPO：把确定性 ODE 采样换成同边缘的 SDE，flow 模型才谈得上在线 RL

**论文**：Flow-GRPO: Training Flow Matching Models via Online RL  
**作者**：Jie Liu、Gongye Liu、Jiajun Liang、Yangguang Li、Jiaheng Liu、Xintao Wang、Pengfei Wan、Di Zhang、Wanli Ouyang（CUHK MMLab；清华大学；快手可灵；南京大学；上海 AI Lab）  
**发表**：NeurIPS 2025（proceedings.neurips.cc，第 38 卷，pp. 40783–40818，DOI 10.52202/085713-1362）；arXiv:2505.05470v3（2025-06-04）  
**定位**：给 rectified flow / flow matching 模型做在线策略梯度 RL；核心是把确定性 Flow-ODE 换成**逐时刻边缘分布相同**的 SDE，从而得到可采样的随机策略和可算的 $\log p$，再用 GRPO 的组内相对优势 + KL 约束优化  
**核验**：2026-11-18 依 arXiv HTML v3 全文（正文 §1–6、附录 A–D、Table 1–4、Fig. 1–15）整理；代码对照 `yifan123/flow_grpo` main 分支 commit `879042cf`（最后推送 2026-05-07）。本页只读论文与代码，**未运行训练、推理或评测**；所有数字为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | 文生图的三种奖励：GenEval 组合生成（规则奖励）、视觉文字渲染（编辑距离奖励）、人类偏好（PickScore） |
| 基座 | Stable Diffusion 3.5 Medium（MMDiT + rectified flow），512×512，只训 LoRA（$r=32$、$\alpha=64$，全部 attention 投影） |
| 训练采样 | SDE 采样 **10 步**、推理仍用 **40 步**；组大小 $G=24$；噪声系数 $a=0.7$ |
| 奖励 | 规则奖励（目标检测计数/位置/颜色、OCR 编辑距离）与模型奖励（PickScore）各一套 |
| 质量监控 | DrawBench 上 Aesthetic / DeQA / ImageReward / UnifiedReward |
| 计算 | 24×A800 |
| 代码 | 公开（MIT），只发布 **LoRA adapter**，无全量权重；奖励模型需另起服务 |

## 原文摘要

> We propose Flow-GRPO, the first method to integrate online policy gradient reinforcement learning (RL) into flow matching models. Our approach uses two key strategies: (1) an ODE-to-SDE conversion that transforms a deterministic Ordinary Differential Equation (ODE) into an equivalent Stochastic Differential Equation (SDE) that matches the original model's marginal distribution at all timesteps, enabling statistical sampling for RL exploration; and (2) a Denoising Reduction strategy that reduces training denoising steps while retaining the original number of inference steps, significantly improving sampling efficiency without sacrificing performance. Empirically, Flow-GRPO is effective across multiple text-to-image tasks. For compositional generation, RL-tuned SD3.5-M generates nearly perfect object counts, spatial relations, and fine-grained attributes, increasing GenEval accuracy from 63% to 95%. In visual text rendering, accuracy improves from 59% to 92%, greatly enhancing text generation. Flow-GRPO also achieves substantial gains in human preference alignment. Notably, very little reward hacking occurred, meaning rewards did not increase at the cost of appreciable image quality or diversity degradation.

*来源：arXiv:2505.05470v3 摘要页，逐字保留。*

## 中文摘要

> 我们提出 Flow-GRPO，首个把在线策略梯度强化学习（RL）接入 flow matching 模型的方法。它有两个关键设计：（1）ODE-to-SDE 转换，把确定性的常微分方程（ODE）转成在所有时刻都与原模型边缘分布一致的等价随机微分方程（SDE），从而可以做统计采样、支撑 RL 的探索；（2）Denoising Reduction，即在训练时减少去噪步数、推理时保留原有步数，显著提升采样效率而不牺牲性能。实验上，Flow-GRPO 在多个文生图任务上都有效。组合生成方面，经 RL 调优的 SD3.5-M 几乎完美地生成了正确的物体数量、空间关系和细粒度属性，GenEval 准确率从 63% 提到 95%。视觉文字渲染准确率从 59% 提到 92%，文字生成能力大幅增强。在人类偏好对齐上 Flow-GRPO 也有可观增益。值得注意的是，奖励作弊（reward hacking）很少发生——奖励的提升并没有以图像质量或多样性的明显下降为代价。

*译文：逐句对译上方原文摘要，未增删内容。*

## 0. 三分钟摘要

**一句话**：flow 模型本身是确定性的，采样就是解一个 ODE，没有随机性就没有探索、也没有 $\log p$ 可算；Flow-GRPO 先证明存在一个与原 ODE **每个时刻边缘分布都相同**的 SDE，把这个 SDE 的每步转移当成各向同性高斯策略，于是 GRPO 那套"组内比好坏 + 重要性比率裁剪 + KL 拽住参考模型"可以直接搬过来。

**问题**：把 RL 用在 rectified flow 上有两道硬墙。
- **没有随机性**。DDPM 式的扩散模型每一步本来就在加噪，天然是马尔可夫链、天然有转移概率；flow 模型是 $dx_t=v_t\,dt$ 的确定性映射，同一个种子永远给同一张图。RL 要探索、要算 $\log \pi(a\mid s)$，这里两样都没有。若硬用确定性动力学的概率，就要估散度（divergence），代价高得离谱。
- **采样太贵**。在线 RL 每一轮都要重新采样一批图，大模型 40 步采样 × 每 prompt 24 张，成本直接把训练卡死。

**insight**：不需要改模型、不需要重训、不需要额外网络。**加噪项可以和"改一点漂移项"配平**，使得 Fokker–Planck 方程不变——边缘分布不变，但轨迹随机了。这一步之后，每一小步的转移就是均值由 $v_\theta$ 决定、方差由 $\sigma_t$ 决定的高斯，策略、$\log p$、KL 全都有了闭式。

**它到底做到了什么**（SD3.5-M，只训 LoRA）：
- GenEval 从 **0.63 → 0.95**，超过 GPT-4o 的 0.84；其中 Position 从 0.24 → 0.99、Attribute Binding 0.52 → 0.86。
- 文字渲染 OCR 准确率 **0.59 → 0.92**。
- PickScore **21.72 → 23.31**（带 KL）。
- 训练只用 10 步去噪、推理仍 40 步，比 40 步训练快 4 倍以上，最终奖励不掉。
- 去掉 KL 就会出现作弊：组合任务上 Aesthetic 5.39 → 4.93、DeQA 4.07 → 2.77、ImageReward 0.87 → 0.44；偏好任务上质量指标不掉，但**多样性塌缩**（不同种子出几乎一样的图）。

### 实验先看什么

Table 1（GenEval 分项，看 Position 与 Counting 的跨度）→ Table 2（同一张表把"任务指标"和"质量指标"并排放，这是全文最关键的证据结构）→ Fig. 5(a)（10 步 vs 40 步训练曲线几乎重合）→ Fig. 8 / 附录 C.3（有 KL / 无 KL 的学习曲线，KL 不是早停）→ Fig. 15（10 步、5 步 SDE 样本确实有伪影，但仍能训）。

## 1. 问题与核心判断

- **为什么要 RL 而不是 SFT/DPO**：GenEval 这类任务是"可验证"的（用检测器数物体、比颜色），奖励可以在线算，不需要偏好对；而 SFT 只能用正样本模仿，DPO 是离线比较，二者都不做在线探索。论文附录 C.1 的对照实验里，在线方法整体优于离线，GRPO 又明显优于 SFT / Flow-RWR / Flow-DPO（作者给了学习曲线 Fig. 6，**没有给数字表**）。
- **为什么是 GRPO 不是 PPO**：GRPO 不用 critic（value network）。图像生成里 value 网络既难训又占显存，去掉它换"同一 prompt 采一组图、组内标准化"来估优势，是这类工作的标准选择。
- **核心判断一（可算性）**：策略必须是**显式的高斯**才能算 $\log p$ 与 KL。SDE 化之后每步转移恰好是各向同性高斯，KL 退化成"两个速度场的 L2 差 × 一个只依赖 $t$ 的系数"——这是全文最漂亮的一步，因为它把 KL 变成了**对速度场的 $\ell_2$ 正则**，不需要比较两个分布。
- **核心判断二（成本）**：训练时用几步去噪得到的图**不需要好看**。RL 只看组内相对好坏，一张 10 步 SDE 的糊图仍然携带"这个 prompt 有没有数对物体"的信号；而 40 步的高质量图信息量并不更高。这个判断和"扩散模型必须用满步数"的直觉相反，是本文最实用的经验结论。
- **它明确不解决的问题**：奖励模型本身的偏好偏差、多奖励加权、视频任务（都在 Limitations 里）。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| Rectified flow | 用直线插值 $x_t=(1-t)x_0+t x_1$ 定义一条从数据到噪声的直线路径，网络只学这条线的速度 $v=x_1-x_0$ |
| Flow-ODE | 推理时解 $dx_t=v_\theta(x_t,t)dt$，从纯噪声积回图像；给定初值结果唯一 |
| 边缘分布 $p_t$ | 只看"第 $t$ 时刻所有轨迹的分布"，不管具体哪条轨迹走到哪 |
| ODE→SDE | 在 ODE 上加一项随机噪声、同时改一项漂移，使 $p_t$ 在所有 $t$ 上都不变 |
| Fokker–Planck 方程 | 描述"概率密度随时间的流动"的方程；两个动力学若给出同一个 FP 方程，边缘分布就相同 |
| 分数函数 $\nabla\log p_t$ | 对数密度的梯度，指向"概率更高的方向"，在 rectified flow 里可由 $v_\theta$ 反解 |
| $\log p$（每步） | 在本方法里就是"高斯转移的密度"，均值和方差都有解析式，可直接算 |
| GRPO | 同一个 prompt 采 $G$ 张图，用组内均值/标准差把最终奖励标准化成优势，不要 critic |
| 重要性比率 $r_t$ | 新策略与采样时旧策略在同一状态-动作上的概率比；PPO 式裁剪 $[1-\varepsilon,1+\varepsilon]$ |
| KL 到参考策略 | 惩罚新策略偏离原模型；这里因为两者方差相同，只剩速度场的差 |
| Denoising Reduction | 训练时只跑 10 步、推理时跑 40 步 |
| LoRA | 只训低秩旁路（$r=32$），基座冻结；参考模型 = 关掉旁路 |

## 3. 核心方法与数据流

```text
prompt 集合 c
→ 用「转换后的 SDE」采样 10 步（噪声系数 a=0.7），每个 prompt 采 G=24 张
  每一步都记录 (x_t, x_{t-1}, log p_old)
→ 对最终图像算奖励 R(x_0, c)（GenEval 检测器 / OCR 编辑距离 / PickScore）
→ 组内标准化：Â = (R - mean_group) / std_group，同一 Â 广播到该轨迹的每一步
→ 对每一步 t 重算 log p_θ（以及参考模型的 log p_ref，靠关掉 LoRA 得到）
→ 比率 r_t = exp(log p_θ - log p_old)；PPO 裁剪；KL = ||v_θ - v_ref||² × 系数
→ 反向传播更新 LoRA；下一轮重新用新策略采样（on-policy）
→ 推理：换回 40 步采样，其余不变
```

### 3.1 去噪过程当 MDP

- 状态 $s_t\triangleq(c,\,t,\,x_t)$，动作 $a_t\triangleq x_{t-1}$，策略 $\pi(a_t\mid s_t)\triangleq p_\theta(x_{t-1}\mid x_t,c)$。
- 转移是确定的：$P(s_{t+1}\mid s_t,a_t)=(\delta_c,\delta_{t-1},\delta_{x_{t-1}})$；初值 $\rho_0=(p(c),\delta_T,\mathcal{N}(0,I))$。
- 奖励只在最后一步给：$R(s_t,a_t)\triangleq r(x_0,c)$ 若 $t=0$，否则 0。

注意这个 MDP 的"动作"是**整张图**（把 $x_{t-1}$ 当动作），不是某个标量；这在扩散 RL 里是常规操作，但也意味着动作空间是整个 $\mathbb{R}^{C\times H\times W}$。

### 3.2 带 KL 的策略优化目标（Eq. 3）

$$\max_\theta\ \mathbb{E}\Bigg[\sum_{t=0}^{T}\Big(R(s_t,a_t)-\beta\,D_{\mathrm{KL}}\big(\pi_\theta(\cdot\mid s_t)\,\|\,\pi_{\mathrm{ref}}(\cdot\mid s_t)\big)\Big)\Bigg]$$

### 3.3 组内相对优势（Eq. 4）与 GRPO 损失（Eq. 5）

$$\hat A^{i}_t=\frac{R(x^i_0,c)-\mathrm{mean}(\{R(x^i_0,c)\}_{i=1}^{G})}{\mathrm{std}(\{R(x^i_0,c)\}_{i=1}^{G})}$$

$$\mathcal{J}(\theta)=\mathbb{E}\Big[\frac{1}{G}\sum_{i=1}^{G}\frac{1}{T}\sum_{t=0}^{T-1}\Big(\min\big(r^i_t(\theta)\hat A^i_t,\ \mathrm{clip}(r^i_t,1-\varepsilon,1+\varepsilon)\hat A^i_t\big)-\beta D_{\mathrm{KL}}(\pi_\theta\|\pi_{\mathrm{ref}})\Big)\Big]$$

$$r^i_t(\theta)=\frac{p_\theta(x^i_{t-1}\mid x^i_t,c)}{p_{\theta_{\mathrm{old}}}(x^i_{t-1}\mid x^i_t,c)}$$

关键细节：**同一个 $\hat A^i$ 被该轨迹的每一步共用**（Eq. 4 的下标其实写了 $t$，但由于最终奖励只有一个，所有 $t$ 上的值相同）。所以信用分配是"整条轨迹给一个分数"，不是逐步的；步与步之间的差异只来自比率和 KL。

### 3.4 ODE → SDE：为什么边缘分布不变（Eq. 6–8）

从确定性 Flow-ODE（Eq. 6）出发：

$$\mathrm{d}x_t=v_t(x_t)\,\mathrm{d}t$$

加噪必须同时改漂移。设 SDE 形式为 $\mathrm{d}x_t=f_{\mathrm{SDE}}\,\mathrm{d}t+\sigma_t\,\mathrm{d}w$，其 Fokker–Planck 方程为

$$\partial_t p_t=-\nabla\!\cdot\!\big[f_{\mathrm{SDE}}p_t\big]+\tfrac12\nabla^2\big[\sigma_t^2p_t\big].$$

要求它等于 ODE 的 $\partial_tp_t=-\nabla\!\cdot\![v_t\,p_t]$，把扩散项写成 $\sigma_t^2\nabla\!\cdot\!(p_t\nabla\log p_t)$ 后对比即可解出

$$f_{\mathrm{SDE}}=v_t+\frac{\sigma_t^2}{2}\nabla\log p_t .$$

再用反向时间 SDE（与原 SDE 边缘相同）得到论文 Eq. 7 的写法：

$$\mathrm{d}x_t=\Big(v_t(x_t)-\frac{\sigma_t^2}{2}\nabla\log p_t(x_t)\Big)\mathrm{d}t+\sigma_t\,\mathrm{d}w .$$

最后把 rectified flow 的分数消掉。因为 $x_t=(1-t)x_0+t x_1$，有 $\nabla\log p_{t\mid0}(x_t\mid x_0)=-x_1/t$，取期望后 $\nabla\log p_t(x)=-x/t-(1-t)v_t(x)/t$。代回得到可以直接用网络算的形式（Eq. 8）：

$$\mathrm{d}x_t=\Big[v_t(x_t)+\frac{\sigma_t^2}{2t}\big(x_t+(1-t)v_t(x_t)\big)\Big]\mathrm{d}t+\sigma_t\,\mathrm{d}w .$$

Euler–Maruyama 离散后就是实际用的更新式（Eq. 9）：

$$x_{t+\Delta t}=x_t+\Big[v_\theta(x_t,t)+\frac{\sigma_t^2}{2t}\big(x_t+(1-t)v_\theta(x_t,t)\big)\Big]\Delta t+\sigma_t\sqrt{\Delta t}\,\epsilon,\qquad \epsilon\sim\mathcal{N}(0,I)$$

噪声强度取 $\sigma_t=a\sqrt{t/(1-t)}$，$a$ 是唯一控制"探索多少"的标量（论文取 0.7）。$a=0$ 就退回确定性 ODE。

**读这一步时要抓住的三点**：
1. 这是**在已有训练好的模型上**改采样器，不改权重、不重训，所以"边缘相同"才有意义——否则 RL 优化的对象就换了。
2. 噪声系数在 $t\to1$（纯噪声端）时 $\sigma_t\to\infty$，离散化时会数值爆炸；实现里必然要截断（见 §5 代码对照）。论文正文没有讨论这一点。
3. 每步转移是**各向同性高斯**，均值 $\bar x_{t+\Delta t}$ 由上式计算，方差 $\sigma_t^2\Delta t$。这是后面所有解析式的基础。

### 3.5 KL 的闭式（这是能落地 GRPO 的关键）

两个同方差各向同性高斯之间的 KL 只剩均值差：

$$D_{\mathrm{KL}}(\pi_\theta\|\pi_{\mathrm{ref}})=\frac{\|\bar x_{t+\Delta t,\theta}-\bar x_{t+\Delta t,\mathrm{ref}}\|^2}{2\sigma_t^2\Delta t}=\frac{\Delta t}{2}\Big(\frac{\sigma_t(1-t)}{2t}+\frac{1}{\sigma_t}\Big)^{2}\big\|v_\theta(x_t,t)-v_{\mathrm{ref}}(x_t,t)\big\|^{2}$$

也就是说：**KL 正则 = 对速度场差做加权 $\ell_2$ 惩罚**，权重随 $t$ 变化。参考模型 $\pi_{\mathrm{ref}}$ 就是加 RL 之前的那个模型（代码里靠关掉 LoRA 实现，见 §5）。

### 3.6 Denoising Reduction（省算力的那一条）

- 训练采样 $T_{\text{train}}=10$，评测/推理 $T_{\text{eval}}=40$（SD3.5-M 的默认）。
- 训练轨迹只回传这 10 步；因此每次迭代要算的 $\log p$ 数量也少 4 倍。
- 依据是经验观察：10 步 SDE 的样本有明显伪影（色偏、细节糊，见 Fig. 15），但**组内相对排序仍然可靠**，10 步与 40 步训练得到的最终奖励曲线几乎重合（Fig. 5a）。再降到 5 步不再稳定加速，有时反而更慢。

### 3.7 论文给出的超参（附录 B.3）

| 项 | 值 |
|---|---|
| 训练 / 评测步数 | 10 / 40 |
| 组大小 $G$ | 24 |
| 噪声系数 $a$ | 0.7 |
| 分辨率 | 512 |
| KL 系数 $\beta$ | 0.004（GenEval、文字渲染）；0.001（PickScore） |
| LoRA | $r=32$，$\alpha=64$ |
| 计算 | 24×A800 |

论文没写学习率、裁剪范围 $\varepsilon$、优化器、训练轮数；这些只在代码里能找到（见 §5）。

## 4. 实验与证据

**Table 1：GenEval（SD3.5-M + LoRA）**

| 模型 | Overall | Single | Two | Counting | Colors | Position | Attr.Bind |
|---|---|---|---|---|---|---|---|
| GPT-4o | 0.84 | 0.99 | 0.92 | 0.85 | 0.92 | 0.75 | 0.61 |
| FLUX.1 Dev | 0.66 | 0.98 | 0.81 | 0.74 | 0.79 | 0.22 | 0.45 |
| SD3.5-L | 0.71 | 0.98 | 0.89 | 0.73 | 0.83 | 0.34 | 0.47 |
| SD3.5-M | 0.63 | 0.98 | 0.78 | 0.50 | 0.81 | 0.24 | 0.52 |
| **SD3.5-M + Flow-GRPO** | **0.95** | 1.00 | 0.99 | 0.95 | 0.92 | 0.99 | 0.86 |

涨幅最猛的是 Position（0.24→0.99）和 Counting（0.50→0.95）——恰好是"规则奖励最容易给准信号"的两项：位置可以用检测框中心判定，计数是整数误差。

**Table 2：任务指标与质量指标并排（全文最重要的表）**

| 设置 | 任务指标 | Aesthetic | DeQA | ImageReward | PickScore | UnifiedReward |
|---|---|---|---|---|---|---|
| SD3.5-M（基线） | GenEval 0.63 / OCR 0.59 / PS 21.72 | 5.39 | 4.07 | 0.87 | 22.34 | 3.33 |
| 组合 · 无 KL | 0.95 | **4.93** | **2.77** | **0.44** | 21.16 | 2.94 |
| 组合 · 有 KL | 0.95 | 5.25 | 4.01 | 1.03 | 22.37 | 3.51 |
| 文字 · 无 KL | 0.93 | 5.13 | 3.66 | 0.58 | 21.79 | 3.15 |
| 文字 · 有 KL | 0.92 | 5.32 | 4.06 | 0.95 | 22.44 | 3.42 |
| 偏好 · 无 KL | 23.41 | 6.15 | 4.16 | 1.24 | — | 3.57 |
| 偏好 · 有 KL | 23.31 | 5.92 | 4.22 | 1.28 | — | 3.66 |

三件事值得记：
1. 规则任务（组合、文字）**无 KL 时任务指标并不掉**（文字甚至 0.93 > 0.92），但质量指标全面下滑——这正是"奖励作弊"的定义：检测器/OCR 认了，人看不行。
2. 偏好任务（PickScore 当奖励）无 KL 时质量指标反而更高（Aesthetic 6.15），因为奖励模型与评测指标同源。掉的是**多样性**，而多样性没有量化指标，只有定性图（Fig. 4）。
3. 带 KL 的 GenEval 结果在 ImageReward 上甚至超过基线（1.03 vs 0.87），说明 RL 不是单纯"消耗"质量。

**T2I-CompBench++（Table 3，用 GenEval 训出的同一个模型直接测）**

| 指标 | Color | Shape | Texture | 2D-Spatial | 3D-Spatial | Numeracy | Non-Spatial |
|---|---|---|---|---|---|---|---|
| SD3.5-M | 0.7994 | 0.5669 | 0.7338 | 0.2850 | 0.3739 | 0.5927 | 0.3146 |
| + Flow-GRPO | 0.8379 | 0.6130 | **0.7236** | 0.5447 | 0.4471 | 0.6752 | 0.3195 |

空间关系涨得最多（2D 0.285→0.545），纹理略降（0.734→0.724），非空间关系基本不动（0.315→0.320）。泛化是**局部**的：训练分布覆盖的能力迁移得好，不覆盖的能力几乎不动。

**未见场景（Table 4）**：训 60 类物体、测 20 类未见物体，Overall 0.64→0.90；训 2/3/4 个物体、测 5/6 个，Counting 0.13→0.48（涨了但仍最弱）。

**消融**
- **Denoising Reduction**：40→10 步，三个任务都拿到 4 倍以上加速，最终奖励不掉；5 步不稳定（Fig. 5a、Fig. 7）。
- **噪声系数 $a$**：0.1 探索不足、奖励上升慢；0.7 最好；0.7→1.0 无进一步收益；再大则图像崩坏 → 奖励恒为 0、训练失败（Fig. 5b，OCR 任务）。
- **KL ≠ 早停**：Fig. 8 显示带 KL 的曲线前期更慢，但最终能到与无 KL 相同的高奖励，同时保持质量；这需要更长的训练。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18，commit `879042cf`）

- 仓库：[yifan123/flow_grpo](https://github.com/yifan123/flow_grpo)，MIT，2.5k+ stars。
- **论文对应的入口**：`scripts/train_sd3.py` + `config/grpo.py` 里的 `geneval_sd3` / `general_ocr_sd3` / `pickscore_sd3`；采样器补丁在 `flow_grpo/diffusers_patch/sd3_sde_with_logprob.py`。
- **权重**：HuggingFace 上是 **LoRA adapter**（`adapter_config.json` + `adapter_model.safetensors`），三个任务各一个（`jieliu/SD3.5M-FlowGRPO-GenEval` 等），上传时间 2025-05-12，无全量权重。
- **环境**：`pip install -e .`；奖励模型各自独立环境——GenEval 与 DeQA 需要另一个 [reward-server](https://github.com/yifan123/reward-server) 仓库；OCR 用 paddleocr 2.9.1；UnifiedReward 用 sglang 起服务；PickScore/CLIP/Aesthetic 在仓库内（`flow_grpo/*_scorer.py`）。
- **数据集**：`dataset/geneval`、`dataset/ocr`、`dataset/pickscore(_sfw)` 已随仓库提供 prompt 列表。
- **仓库已远超论文**：新增 FLUX.1-dev/Kontext、Qwen-Image(Edit)、Wan2.1、Bagel-7B，以及 Flow-GRPO-Fast、GRPO-Guard、CPS 采样、no-CFG 训练。README 现在推荐"不训 CFG + 只训 1–2 步 + CPS（`noise_level=0.8`）"，**这不是论文的设置**（论文设置是 cfg=4.5、10 步、$a=0.7$），复现论文数字请用 `geneval_sd3` / `pickscore_sd3` 这类配置。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| Eq. 8 / Eq. 9 SDE 更新与 $\sigma_t=a\sqrt{t/(1-t)}$ | `flow_grpo/diffusers_patch/sd3_sde_with_logprob.py` → `sde_step_with_logprob`：`std_dev_t = sqrt(sigma/(1-sigma))*noise_level`（此处的 `sigma` 是 diffusers 调度器的 $1-t$ 记号） |
| 每步 $\log p$（高斯密度） | 同函数：`log_prob = -((prev-mean)^2)/(2*(std_dev_t*sqrt(-dt))^2) - log(std_dev_t*sqrt(-dt)) - log(sqrt(2π))` |
| Eq. 9 的均值项 | 同函数：`prev_sample_mean = sample*(1+std_dev_t²/(2σ)dt) + model_output*(1+std_dev_t²(1-σ)/(2σ))dt` |
| Eq. 5 KL 闭式 | `scripts/train_sd3.py`：`kl_loss = ((prev_sample_mean - prev_sample_mean_ref)**2).mean(dim=(1,2,3)) / (2*std_dev_t**2)` |
| 参考策略 $\pi_{\mathrm{ref}}$ | 同文件：`with transformer.module.disable_adapter()` → 关掉 LoRA 即得基座 |
| Eq. 4 组内优势 | `flow_grpo/stat_tracking.py` → `PerPromptStatTracker.update(type='grpo')` |
| Eq. 5 裁剪目标 | `scripts/train_sd3.py`：`ratio=exp(log_prob-log_probs)`、`torch.maximum(unclipped_loss, clipped_loss)` |
| 10 步训练 / 40 步评测 | `config/grpo.py:geneval_sd3`（`num_steps=10`、`eval_num_steps=40`） |
| LoRA $r=32,\alpha=64$ | `scripts/train_sd3.py` 的 `LoraConfig`，target 是 8 个 attention 投影 |
| CPS 变体（论文没有） | 同函数 `sde_type == 'cps'` 分支 |

**代码与论文不一致的地方（读代码时要注意）**

1. **KL 系数差 10 倍**：论文写 $\beta=0.004$（GenEval/文字）、$0.001$（PickScore）；代码里是 **0.04 / 0.04 / 0.01**。我的推断（作者没写）：代码的 KL 没有乘 $\Delta t$，而 $T=10$ 时 $\Delta t\approx0.1$，两者恰好互补。要复现请直接用代码值。
2. **优势的分母不是组内 std**：`geneval_sd3` 打开 `per_prompt_stat_tracking=True` 且 `global_std=True`，于是均值取"该 prompt 在本 epoch 内所有样本"的均值，分母用**全体奖励的 std**；论文 Eq. 4 是组内 mean/std。二者不等价（代码更接近 DDPO 的 running-stat 版本）。
3. **裁剪范围**：论文只写 $\varepsilon$ 符号，代码取 `clip_range=1e-4`（比 LLM 里的 0.2 小三个数量级），这是图像 RL 的常见改法（每步分布变化极小）。
4. **策略里含 CFG**：代码默认 `train.cfg=True`、`guidance_scale=4.5`，即策略是"CFG 合成后的速度场"，$\log p$ 也是在引导后的转移上算的。论文正文没有说明这一点。
5. **$\sigma_t$ 的数值保护**：`torch.where(sigma==1, sigma_max, sigma)`，否则 $t=1$ 时分母为 0。论文未提。
6. **KL 的求范数方式**：代码用 `mean(dim=(1,2,3))`（对通道与空间取均值）而非平方和，常数差被 $\beta$ 吸收。

### 5.2 第一个该做的验证（不需要 24 卡）

**先验"边缘不变"这一条**，因为后面所有推导都建立在它上面，而且它可以用单卡验证：

1. 取 SD3.5-M（或任何 rectified-flow 模型）+ 已发布的 GenEval LoRA，固定 20 个 prompt、固定种子。
2. 分别用 40 步 ODE 与 40 步 SDE（$a=0.7$）采样，比 FID / 图像对视觉差异 / CLIP 分数分布。论文附录 D 声称 40 步 ODE 与 40 步 SDE"视觉上无法区分"。
3. 再把 $a$ 从 0 扫到 1.0，看 GenEval 分数与 FID 如何随 $a$ 变化——这一步直接告诉你"探索强度"的可用区间，也是迁移到任何新任务时唯一必须重扫的超参。

顺带验证工程链路：跑 1 轮 8 prompt × $G=4$ 的采样 + 奖励 + 反向，确认 `zero_std_ratio`（全组同分 → 优势全 0 → 该样本被丢弃）不是 1.0，否则奖励设计有问题。

## 6. 前后关联

- **被改的那个对象**：[08 Flow Matching](08-flow-matching.md)、[09 Rectified Flow](09-rectified-flow.md)。本文的 $x_t=(1-t)x_0+tx_1$、$v=x_1-x_0$、以及"分数可由速度反解"$\nabla\log p_t=-x/t-(1-t)v_t/t$，全部来自这两条线。
- **SDE 化的理论出处**：[04 Score-SDE](04-score-sde.md) 的反向时间 SDE 与 Fokker–Planck 论证；本文只是把 $\sigma_t$ 做成一个可调旋钮，并证明加噪后边缘不变。
- **扩散 RL 的前作**：DDPO（Black et al. 2023）建立了"去噪 = MDP、奖励 = 终端奖励、PPO 裁剪 + 每 prompt 统计"的框架，本文的 `stat_tracking.py` 基本沿用 ddpo-pytorch，`sd3_sde_with_logprob.py` 顶部注释也写明改编自它。区别在于 DDPO 针对 DDPM 的离散马尔可夫链，本文必须先把 ODE 变成 SDE。
- **GRPO 的出处**：DeepSeekMath（Shao et al. 2024），去掉 critic、组内标准化；本文把它搬到图像。
- **同一问题的另一条路**：[19 DiffusionNFT](19-diffusionnft.md)（并行撰写）不构造 SDE、不算 $\log p$，而是直接在**前向加噪过程**上做"正/负样本的速度场对比"，用隐式 KL 上界避免策略梯度。两者是同一目标（把 flow/diffusion 模型往奖励高的方向推）的两种实现：Flow-GRPO 走"逆向轨迹 + 显式似然"，NFT 走"前向噪声 + 隐式目标"。前者的优势是目标严格、KL 可算；后者省掉 SDE 转换与 $\log p$ 的数值问题。
- **本文的后续（同一仓库）**：Flow-GRPO-Fast（只在 1–2 步注入噪声）、GRPO-Guard（重要性比率有偏 → 过优化，用 RatioNorm + 梯度重加权修）、CPS 采样。这些都说明"重要性比率的数值行为"是这条线最脆的地方。

## 7. 局限与可检验问题

**作者承认的**：
- 只做 T2I，不做视频（虽然反复提到视频是动机）；
- 一次只优化一个奖励，"多奖励加权"没解决；
- KL 能压住作弊但训练更久，且**某些 prompt 仍会出现作弊**；
- 奖励设计靠人工启发式（检测器/编辑距离），更复杂的奖励模型没验证。

**我的看法（作者没写的）**：
1. **信用分配过粗**。整条轨迹共用一个 $\hat A$，等于假设"每一步的贡献相同"。而实际上"数错物体"可能只由前几步的布局决定。这解释了为什么 $T_{\text{train}}$ 可以砍到 10——反正也不做逐步归因。真要提升样本效率，应该做逐步优势（需要 critic 或树搜索），本文没碰。
2. **"奖励作弊很少"这个结论和奖励类型强相关**。GenEval 的奖励是检测器，OCR 的奖励是 PaddleOCR 的编辑距离——这些奖励本身是**判决式**的，作弊空间被检测器的鲁棒性限制；一旦换成可微的、可被纹理骗过的模型奖励（PickScore 就是），作弊立刻表现为多样性塌缩，而论文对多样性只有定性图，**没有量化指标**（没有 FID、没有同 prompt 的 LPIPS 方差、没有 recall）。
3. **单一基座、单一分辨率、单一 LoRA 容量**。全部实验是 SD3.5-M + 512 + $r=32$，没有全参微调、没有更大模型、没有 1024。GenEval 0.95 是否依赖 LoRA 的容量上限，无法判断。
4. **对照实验只有曲线没有表**。SFT / RWR / DPO 的比较（附录 C.1）只有 Fig. 6，没有最终数字、没有多种子方差。这在"首个方法"类论文里是薄弱环节。
5. **KL 的语义被简化了**。逐步高斯的 KL 只在"两个策略方差相同"时成立，而这个方差完全由 $\sigma_t$（即 $a$）决定、与参数无关——所以它衡量的是"均值轨迹的偏离"，不是真正的分布距离。作为正则够用，但如果有人把它当"策略的信任域"来推理收敛性，会得出错误结论。
6. **$a$ 与步数的耦合没有理论**。$a=0.7$ 是在 10 步、40 步、512 分辨率下调出来的；换步数时 $\sigma_t\sqrt{\Delta t}$ 的累积噪声会变，需要重扫。这是迁移到任何新模型时必须重做的第一件事。

**迁移到病理时要回答的问题**：

- **奖励从哪来？** 病理没有"数物体"这种干净的可验证奖励。可行的候选：
  (a) 冻结的病理基础模型（UNI / CONCH / Prov-GigaPath）给出的**语义置信度**，例如"这块 patch 被判为肿瘤的概率"；
  (b) 细胞核检测器（HoVer-Net / StarDist）给出的**密度、面积分布、核质比**，与目标组织的统计量比对；
  (c) 结构奖励：腺体/管腔的连通域数量与形状（用分割模型算）。
  这些都在"可微性差、可用性尚可"的区间，适合规则奖励那一档。
- **作弊会长什么样？** 这是最该先想的。用一个检测器当奖励，模型最省力的作弊方式是**把目标结构画得更"标准"而不是更真实**：核画得更圆更密（检测器置信度更高）、染色更均匀（分类器更确信）、甚至生成"高置信度肿瘤纹理"但空间结构完全不合理的图。KL 到参考模型能压住一部分（因为参考模型携带真实组织的形态先验），但压不住"检测器偏好与病理学家偏好不一致"的那部分。
- **参考模型选谁？** Flow-GRPO 的 KL 参考是"RL 之前的自己"，所以基座必须已经是一个像样的病理生成器。目前多数病理扩散模型是 DDPM/LDM（[56 LRDM](../pathology/56-lrdm.md)、[64 BigCell](../pathology/64-bigcell.md)、[62 HistoDiffusion](../pathology/62-histdit.md)），**不是 rectified flow**，不能直接套本文的 SDE 推导（连续时间 $\sigma_t$ 与 $x_t=(1-t)x_0+tx_1$ 的插值形式要重推）。要复现这条线，得先有一个 rectified-flow 的病理生成器，或者用 SD3.5 在病理 patch 上做 flow 微调。
- **评测怎么防自欺？** 奖励里用的检测器/分类器，在评测时必须**换掉**：训练用 UNI 的肿瘤概率，评测就必须用另一套（例如 CONCH 或病理学家盲评 + FD-DINO + 核形态分布），否则衡量的只是"骗过同一个模型"。

**一个具体可做的第一实验（作者没做，成本可控）**：
取一个 256×256 的病理 patch flow 生成器（或 SD3.5-M 在 TCGA/自建 patch 上做 LoRA flow 微调），奖励设为"冻结 UNI 的肿瘤概率"，$G=8$、训练 5 步、$\beta$ 扫 $\{0,0.01,0.04\}$、$a$ 扫 $\{0.3,0.7\}$。然后**用没参与奖励的指标**评：FD-DINO、核面积分布与真实分布的 Wasserstein 距离、以及 20 张图的病理学家/资深同学盲评"这是真组织还是生成"。预期能看到本文同样的现象：$\beta=0$ 时 UNI 概率飙升但核形态分布跑偏；$\beta$ 大一点时概率涨得慢但形态守住。这个实验能直接回答"病理生成器能不能用基础模型当奖励，以及在什么强度下开始作弊"。

## 8. 来源与版本

- arXiv：<https://arxiv.org/abs/2505.05470>（v1 2025-05-08；v3 2025-06-04，本页以此为准）；HTML 全文 <https://arxiv.org/html/2505.05470v3>
- NeurIPS 2025 正式版：<https://proceedings.neurips.cc/paper_files/paper/2025/hash/3a10c46572628d58cb44fb705f25cbbf-Abstract-Conference.html>（Advances in Neural Information Processing Systems 38，pp. 40783–40818，DOI 10.52202/085713-1362）
- 代码：<https://github.com/yifan123/flow_grpo>（main，`879042cf`，2026-05-07）
- LoRA 权重：<https://huggingface.co/jieliu/SD3.5M-FlowGRPO-GenEval>、<https://huggingface.co/jieliu/SD3.5M-FlowGRPO-Text>、<https://huggingface.co/jieliu/SD3.5M-FlowGRPO-PickScore>；Demo <https://huggingface.co/spaces/jieliu/SD3.5-M-Flow-GRPO>；可视化页 <https://gongyeliu.github.io/Flow-GRPO/>
- 奖励服务依赖：<https://github.com/yifan123/reward-server>（GenEval 检测与 DeQA）
- 前作：DDPO（Black et al., arXiv:2305.13301）；GRPO（Shao et al., arXiv:2402.03300）；反向时间 SDE（Song et al., arXiv:2011.13456）
