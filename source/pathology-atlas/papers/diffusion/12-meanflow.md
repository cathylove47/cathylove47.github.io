# 12｜MeanFlow：一步生成不靠「一致性约束」，靠一个定义出来的平均速度场

**论文**：Mean Flows for One-step Generative Modeling  
**作者**：Zhengyang Geng（CMU；部分工作于 MIT 访学期间完成）、Mingyang Deng（MIT）、Xingjian Bai（MIT）、J. Zico Kolter（CMU）、Kaiming He（MIT）  
**发表**：NeurIPS 2025 主会（Advances in NeurIPS 38，Main Conference Track，DOI 10.52202/085713-2534；OpenReview 记录 venue 为 "NeurIPS 2025 oral"）；arXiv:2505.13447v1（2025-05-19，唯一版本）  
**定位**：一步/少步生成；把「平均速度」$u(z_t,r,t)$ 当作可学习的目标场，用 JVP 算出恒等式右端当回归目标；ImageNet 256 上 1-NFE FID 3.43，从头训  
**核验**：2026-11-18 依 arXiv:2505.13447v1 的 HTML 全文（正文 §1–5、Appendix A、B.1–B.4，Table 1–5，Algorithm 1–2，Fig. 1–5）与 NeurIPS 2025 proceedings 摘要页整理；代码对照官方仓库 `Gsunshine/meanflow` main 分支（最后推送 2026-03-13，HEAD `d70cb55`，MIT）的 `meanflow.py`、`models/models_dit.py`、`configs/default.py`、`configs/run_b4.yml`、README，以及官方 PyTorch 复现 `Gsunshine/py-meanflow`（main，最后推送 2025-07-30）。本页只读论文与代码，**未运行训练、采样或 FID 评测**；所有数字为论文报告值或 README 自报值。

| 项 | 内容 |
|---|---|
| 任务 | 类条件 ImageNet 256×256（主实验）、无条件 CIFAR-10（32×32，像素空间） |
| 输入 / 输出 | 输入 $z_1=\epsilon\sim\mathcal{N}(0,I)$，一次前向输出 $z_0=\epsilon-u_\theta(\epsilon,0,1)$ |
| 学的对象 | 平均速度 $u(z_t,r,t)$，双时间 $(r,t)$ 场；不是瞬时速度 $v(z_t,t)$ |
| 训练信号 | 只有条件速度 $v_t=\epsilon-x$（标准 Flow Matching 目标），**不需要**预训练模型、蒸馏、课程学习 |
| 关键代价 | 每步多一次 JVP 的 backward；实测 0.045 → 0.052 s/iter（+16%，v4-8 TPU） |
| 代码 | 官方 JAX/TPU 实现；另有官方 PyTorch 复现（仅 CIFAR-10）；官方 B/4 checkpoint 与 FID stats 可下载 |

## 原文摘要

> We propose a principled and effective framework for one-step generative modeling. We introduce the notion of average velocity to characterize flow fields, in contrast to instantaneous velocity modeled by Flow Matching methods. A well-defined identity between average and instantaneous velocities is derived and used to guide neural network training. Our method, termed the MeanFlow model, is self-contained and requires no pre-training, distillation, or curriculum learning. MeanFlow demonstrates strong empirical performance: it achieves an FID of 3.43 with a single function evaluation (1-NFE) on ImageNet 256×256 trained from scratch, significantly outperforming previous state-of-the-art one-step diffusion/flow models. Our study substantially narrows the gap between one-step diffusion/flow models and their multi-step predecessors, and we hope it will motivate future research to revisit the foundations of these powerful models.

*来源：arXiv:2505.13447v1（NeurIPS proceedings 摘要页文字一致），逐字保留；原文 "256$\times$256" 的乘号按字符写作 256×256。*

## 中文摘要

> 我们提出一个面向一步生成建模的、有原理依据且有效的框架。我们引入「平均速度」这一概念来刻画流场，以区别于 Flow Matching 方法所建模的「瞬时速度」。我们推导出平均速度与瞬时速度之间一个良定义的恒等式，并用它来指导神经网络训练。我们的方法称为 MeanFlow，它是自足的，不需要预训练、蒸馏或课程学习。MeanFlow 展示了很强的经验表现：从头训练，在 ImageNet 256×256 上以单次函数评估（1-NFE）取得 3.43 的 FID，显著优于此前最先进的一步扩散/流模型。我们的研究大幅缩小了一步扩散/流模型与它们多步前身之间的差距，并希望它能促使未来研究重新审视这些强大模型的基础。

*译文：逐句对译上方原文，未增删内容。*

## 0. 三分钟摘要

**一句话**：不要去学「此刻往哪走」（瞬时速度 $v$），去学「从现在到 $r$ 这段路平均往哪走」（平均速度 $u$）；两者由一个可微恒等式 $u=v-(t-r)\frac{d}{dt}u$ 相连，于是训练时只要用 JVP 把 $\frac{d}{dt}u$ 算出来，右边就是现成的回归目标——不需要一致性约束这套启发式，也不需要课程学习。

**问题**：Flow Matching / 扩散模型的边缘速度场是弯的，采样必须数值积分。想一步走完，就得知道「整段位移」，而网络只被训练来回答「局部切线」。Consistency Models 的做法是「把同一轨迹上的点压到同一个答案」，但作者认为这个约束是**强加在网络行为上**的，底层真值场应该满足什么性质并不清楚，所以训练不稳、要靠逐步收紧时间域的离散化课程。

**insight**：既然 $u=\frac{1}{t-r}\int_r^t v\,d\tau$ 是 $v$ 的泛函，那它本身就构成一个**真值场**（与网络无关）。对 $(t-r)u=\int_r^t v$ 两边求 $t$ 的导数，就得到恒等式。于是「一步生成」等价于「把 $u$ 在 $(r,t)=(0,1)$ 处估准」，而 $u$ 的可学性由定义保证，不靠任何额外假设。$r=t$ 时第二项消失，方法退化成标准 FM——FM 是它的一个特例。

**它到底做到了什么**（ImageNet 256，全部从头训、全部 1-NFE 除注明）：
- **3.43** FID（MF-XL/2，676M，240 epoch）；此前 1-NFE 最好 10.60（Shortcut-XL/2），一步但需 2-NFE 引导的 IMM 是 7.77。
- 2-NFE 到 **2.93**，加长训练配置的 XL+ 到 **2.20**，与 250×2 NFE 的 DiT-XL/2（2.27）/ SiT-XL/2（2.06，正文写 2.15，见 §4 注）同档。
- CIFAR-10 无条件 1-NFE **2.92**，与 iCT（2.83）/ sCT（2.97）/ IMM（3.20）竞争，且**不用** EDM 预条件器。

### 实验先看什么

Table 1(a)（$r\neq t$ 比例：0% 就崩到 328.91）→ Table 1(b)（JVP 切线必须是 $(v,0,1)$，写错就崩）→ Table 1(f)（CFG 把 61.06 → 15.53）→ Table 2（3.43 的位置）→ Table 5（$\kappa$ 混合再降到 18.63）。

## 1. 问题与核心判断

- **为什么 FM 一步不行**：即便条件流被设计成直线（rectified），**边缘**速度场 $\mathbb{E}[v_t\mid z_t]$ 仍然是弯的（论文 Fig. 2，明确说这弯不是网络近似误差，而是真值场本身的性质）。粗离散化积分弯轨迹，误差就出来了。所以「一步」在 FM 里是原理性缺陷，不是调参问题。
- **Consistency 路线的软肋**（作者的原话式判断）：一致性约束是对**网络输出**提的要求，底层真值场该满足什么并没被刻画；因此需要离散化课程去逐步约束时间域（iCT/ECT/sCT 都有）。作者要的是「真值场自带的性质」。
- **本文的判断**：真值场里真正适合「一步」的量是平均速度 $u$，因为一步采样就是一次位移：$z_0=z_1-u(z_1,0,1)$。把 $u$ 学准，一步就对；学不准是估计误差，不是框架缺陷。
- **代价的结构**：目标里出现 $\frac{d}{dt}u$，训练要多一次 JVP；但 stop-gradient 让它只值一次额外 backward（且只回传到输入、不回传到参数），实测 +16%。这是「训练贵一点，推理便宜到底」的交换。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| 瞬时速度 $v(z_t,t)$ | 此刻的切线方向；FM 学的就是这个 |
| 平均速度 $u(z_t,r,t)$ | 从 $t$ 走回 $r$ 这段的位移除以时长；与位移同向，一般**不**与 $v$ 同向 |
| 位移 $S$ | $S=(t-r)u=\int_r^t v\,d\tau$；论文特意选择参数化 $u$ 而不是 $S$（见 §3.6） |
| 边缘速度 / 条件速度 | 边缘：对同一 $z_t$ 所有来源取期望（真值场）；条件：给定 $(x,\epsilon)$ 的那一条（可采样、可算） |
| MeanFlow 恒等式 | $u=v-(t-r)\frac{d}{dt}u$。它是 $u$ 的**定义**的等价改写，不是新假设 |
| JVP（Jacobian-vector product） | 雅可比矩阵乘一个切向量，一次前向+一次反向的代价；这里切向量是 $[v,0,1]$ |
| stop-gradient（sg） | 目标侧的导数项不回传，避免二阶优化 |
| logit-normal 采样 | 先抽正态再 sigmoid 映射到 $(0,1)$，让 $t$ 集中在中间；FM/SD3 常用 |
| CFG 作为场 | 把 $\omega v(\cdot\mid c)+(1-\omega)v(\cdot)$ 本身当成真值场去学，采样时不再组合，所以仍是 1-NFE |
| $\kappa$（Eq. 20–21） | 在目标里混入**类条件**的 $u_\theta(z_t,t,t\mid c)$，等价于 CFG 的「随机丢条件」，有效引导尺度 $\omega'=\omega/(1-\kappa)$ |
| NFE | 网络前向次数；本文的 1-NFE 指一次前向出图，CFG 不额外翻倍 |

## 3. 核心方法与数据流

```text
训练（每次迭代）
x ~ 数据, ε ~ N(0,I)
(t, r) ~ 采样器（logit-normal −0.4/1.0），强制 t ≥ r；按比例把一部分样本置 r = t（论文 25% 保持 r≠t）
z_t = (1−t)x + tε;  v = ε − x
（可选）v_g = CFG 组合：ω·v(·|c) + κ·u_θ(z_t,t,t|c) + (1−ω−κ)·u_θ(z_t,t,t)
u, du/dt = jvp(u_θ, (z_t, t, r), (v_g, 1, 0))     # 沿 z 的切向用 v_g，∂t 系数 1，∂r 系数 0
u_tgt = sg( v_g − (t−r)·du/dt )
loss  = ‖u − u_tgt‖² / sg((‖Δ‖² + c)^p)           # 自适应权重，p=1
反向传播（du/dt 视为常数，无二阶导）

采样（1-NFE）
z_1 = ε;  z_0 = z_1 − (1−0)·u_θ(z_1, t=1, h=0)     # 代码里网络吃 (t, h=t−r)
```

### 3.1 平均速度的定义（Eq. 3）

$$u(z_t,r,t)\triangleq\frac{1}{t-r}\int_{r}^{t}v(z_\tau,\tau)\,d\tau$$

它是 $v$ 的泛函 $u=\mathcal{F}[v]$：**由 $v$ 诱导，不依赖任何网络**。这一点是全文的支点——「真值场存在」使得最优解与网络结构无关，训练更稳。

### 3.2 恒等式（Eq. 4–6）

由 $(t-r)u=\int_r^t v\,d\tau$ 对 $t$ 求导（$r$ 与 $t$ 无关）：

$$u(z_t,r,t)+(t-r)\frac{d}{dt}u(z_t,r,t)=v(z_t,t)\quad\Longrightarrow\quad \boxed{u=v-(t-r)\frac{d}{dt}u}$$

两条边界性质：$r\to t$ 时 $u\to v$；以及**可加性**（一步大跨 = 两步小跨之和）：

$$(t-r)u(z_t,r,t)=(s-r)u(z_s,r,s)+(t-s)u(z_t,s,t)$$

Consistency Models 想要的「一致性」在这里是**定义的推论**，所以不需要显式约束，也就不需要课程。

### 3.3 目标里的时间导数（Eq. 7–8）

全导数展开 $\frac{d}{dt}u=\frac{dz_t}{dt}\partial_z u+\frac{dr}{dt}\partial_r u+\frac{dt}{dt}\partial_t u$，代入 $\dot z_t=v$、$\dot r=0$：

$$\frac{d}{dt}u(z_t,r,t)=v(z_t,t)\,\partial_z u+\partial_t u$$

即雅可比 $[\partial_z u,\partial_r u,\partial_t u]$ 与切向量 $[v,0,1]$ 的 JVP。

### 3.4 训练目标（Eq. 9–11）

$$\mathcal{L}(\theta)=\mathbb{E}\big\|u_\theta(z_t,r,t)-\mathrm{sg}(u_{\text{tgt}})\big\|_2^2,\qquad u_{\text{tgt}}=v_t-(t-r)\big(v_t\partial_z u_\theta+\partial_t u_\theta\big)$$

两个工程要点：(1) 目标里的导数用**参数化副本** $\partial u_\theta$ 顶替；(2) 整体 stop-gradient，于是 JVP 只是一次额外的反向、不进二阶图。$r\equiv t$ 时第二项消失，算法精确退化为 conditional Flow Matching——所以 Table 1(a) 里 0% 的 $r\neq t$ 就是 FM，1-NFE FID 328.91。

### 3.5 采样（Eq. 12，Alg. 2）

$$z_r=z_t-(t-r)u(z_t,r,t);\qquad \text{1-step: } z_0=z_1-u(z_1,0,1)$$

少步采样同一式子按时间表串起来即可（论文说「straightforward」，但**没有系统实验**，只报了 2-NFE）。

### 3.6 为什么参数化 $u$ 而不是位移 $S$（B.3）

若直接参数化 $S$，由 $\frac{d}{dt}S=v$ 只能推出 $S=\int_r^t v\,d\tau+C$，还差一个边界条件 $S|_{t=r}=0$；而 $u$ 的定义 $(t-r)u$ **自动**满足 $S|_{t=r}=0$。所以「建模平均速度」不是记法偏好，是把边界条件写进了参数化。附录 B.3 用这一点证明了恒等式是 Eq. 4 的充要条件。

### 3.7 CFG 作为场（§4.2、B.1）

不想采样时算两次网络，就把 CFG 定义在场层面：

$$v^{\text{cfg}}(z_t,t\mid c)\triangleq\omega\,v(z_t,t\mid c)+(1-\omega)\,v(z_t,t)$$

关键一步：$v(z_t,t)=v^{\text{cfg}}(z_t,t)=u^{\text{cfg}}(z_t,t,t)$，于是目标里的无网络项可以换成网络自己的 $h{=}0$ 输出：

$$\tilde v_t=\omega\,\underbrace{(\epsilon-x)}_{v_t}+\kappa\,\underbrace{u^{\text{cfg}}_\theta(z_t,t,t\mid c)}_{\text{类条件}}+(1-\omega-\kappa)\,\underbrace{u^{\text{cfg}}_\theta(z_t,t,t)}_{\text{类无关}}$$

$\kappa=0$ 退回 Eq. 19；$\kappa>0$ 相当于对目标也做「随机丢条件」，有效引导尺度 $\omega'=\omega/(1-\kappa)$。采样时**不做任何线性组合**，直接一次前向——这是它比「采样期 CFG」省一半算力的地方，但代价是**引导尺度被焊进权重**（见 §7）。

### 3.8 设计选择（Table 1）

| 维度 | 结论（1-NFE FID） |
|---|---|
| $r\neq t$ 比例 | 0%（=FM）328.91 / 25% **61.06** / 50% 63.14 / 100% 67.32 |
| JVP 切线 | $(v,0,1)$ **61.06** / $(v,0,0)$ 268.06 / $(v,1,0)$ 329.22 / $(v,1,1)$ 137.96 |
| $(r,t)$ 条件化 | $(t,t{-}r)$ **61.06** / $(t,r)$ 61.75 / $(t,r,t{-}r)$ 63.98 / 仅 $t{-}r$ 63.13 |
| 采样器 | lognorm(−0.4,1.0) **61.06** / lognorm(−0.2,1.0) 63.83 / uniform 65.90 |
| 自适应权重 $p$ | 0（纯 L2）79.75 / 0.5 63.98 / **1.0 61.06** / 1.5 66.57 / 2.0 69.19 |
| 引导 $\omega$ | 1.0（无 CFG）61.06 / 1.5 33.33 / 2.0 20.15 / **3.0 15.53** / 5.0 20.75 |

两个值得记住的负面结果：JVP 的切线**必须**是对的（写错就回到 FM 甚至更差），说明这个恒等式不是装饰；「仅用 $t-r$ 条件化」几乎不掉点（63.13 vs 61.06），说明网络几乎不需要 $r$ 的绝对位置——理论上的双时间场在实践里接近只依赖间隔，这一点论文没有讨论（见 §7）。

### 3.9 实现超参（Table 4 / Appendix A）

- **ImageNet 256**：SD VAE（`sd-vae-ft-mse-flax`），latent 32×32×4；DiT 骨干（adaLN-Zero），两个时间变量各自 positional embedding + 2 层 MLP 后**相加**；batch 256、lr 1e-4 常数、Adam (0.9, 0.95)、wd 0、EMA 0.9999、240 epoch（消融用 B/4、80 epoch / 400K iter）；lognorm(−0.4, 1.0)；25% $r\neq t$；$p=1.0$；$\omega'=2.0$；CFG 只在 $t\in[0,1]$ 内触发（不同模型尺寸的区间略有差异）。
- **CIFAR-10**：像素 32×32×3，U-Net（~55M），**无 EDM 预条件器**；Adam lr 6e-4、batch 1024、dropout 0.2、EMA 0.99995、800K iter；lognorm(−2.0, 2.0)；**75%** $r\neq t$；$p=0.75$。

## 4. 实验与证据

**Table 2（ImageNet 256，全部从头训，带 CFG）**

| 方法 | 参数 | NFE | FID |
|---|---|---|---|
| iCT-XL/2† | 675M | 1 | 34.24 |
| Shortcut-XL/2 | 675M | 1 | 10.60 |
| MeanFlow-B/2 | 131M | 1 | 6.17 |
| MeanFlow-M/2 | 308M | 1 | 5.01 |
| MeanFlow-L/2 | 459M | 1 | 3.84 |
| **MeanFlow-XL/2** | 676M | 1 | **3.43** |
| iMM-XL/2 | 675M | 1×2 | 7.77 |
| MeanFlow-XL/2 | 676M | 2 | 2.93 |
| MeanFlow-XL/2+ | 676M | 2 | 2.20 |

参照系（多步）：DiT-XL/2 2.27（250×2）、SiT-XL/2 2.06、SiT-XL/2+REPA 1.42；GAN 侧 StyleGAN-XL 2.30、GigaGAN 3.45。† iCT 数字由 [52] 转报。

**Table 3（CIFAR-10 无条件，1-NFE，同一 U-Net ~55M）**

| 方法 | 预条件 | NFE | FID |
|---|---|---|---|
| iCT | EDM | 1 | 2.83 |
| ECT | EDM | 1 | 3.60 |
| sCT | EDM | 1 | 2.97 |
| IMM | EDM | 1 | 3.20 |
| MeanFlow | **none** | 1 | **2.92** |

CIFAR 上只算「竞争得过」，不是碾压——论文自己也只写 "competitive"。真正的卖点在 ImageNet 上的相对幅度：相对 IMM 的 7.77 降 56%，相对 1-NFE 的 10.60 降 68%。

**Table 5（改进 CFG，固定 $\omega'=2.0$，B/4、80 epoch）**

| $\kappa$ | 0.0 | 0.5 | 0.8 | 0.9 | 0.95 |
|---|---|---|---|---|---|
| FID, 1-NFE | 20.15 | 19.15 | 19.10 | **18.63** | 19.17 |

注意 Table 1(f) 的 $\omega$ 消融是 $\kappa=0$ 的版本；正文的 ablation 与附录的改进版是两套设置，不要混着引用。

**训练开销（B.4）**：B/4 在 v4-8 TPU 上，FM 0.045 s/iter → MeanFlow 0.052 s/iter（+16%）。作者强调 JVP 的反向只回传到输入、不回传到 $\theta$，所以**不**进二阶图。

**论文内部数字不一致（引用时注意）**：§5.2 正文写「SiT-XL/2 (FID 2.15)」，Table 2 右表写 2.06。两处不能同时引用；本页正文采 Table 2 的 2.06，并标注正文写 2.15。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- **`Gsunshine/meanflow`**（JAX，MIT，main，HEAD `d70cb55`，最后推送 2026-03-13，622 stars）：README 明确 "official JAX implementation… written and tested on TPUs"。文件结构小而干净：`meanflow.py`（模型+损失+采样）、`models/models_dit.py`、`train.py`、`configs/{default.py,run_b4.yml}`、`utils/jax_fid/`。
- **可下载**：MF-B/4 checkpoint（Google Drive）与 FID stats，README 给出**期望 FID 11.4**（B/4，240 epoch，improved CFG 配置下的复现值，对应 README 表格里 240ep / $\omega{=}1,\kappa{=}0.5$ 的 11.35——不是论文里的 61.06，那个是 80 epoch 无 CFG 的消融数）。
- **官方 PyTorch**：`Gsunshine/py-meanflow`（README 自称 "PyTorch+GPU re-implementation for the CIFAR-10 experiments"，最后推送 2025-07-30）。`demo.ipynb` 带 checkpoint（~2.80 FID），脚本 `cifar10_v1.sh` 8 卡 H200 约 0.21 s/iter、16000 epoch 接近 2.9 FID。**ImageNet 没有官方 PyTorch 实现**。
- **官方后续**：README 列出 iMF（`Lyy-iiis/imeanflow`，JAX+PyTorch）与 pMF（`Lyy-iiis/pMF`，JAX+PyTorch），即本批笔记里的 [13-imf](13-imf.md) 与 [14-pmf](14-pmf.md)。
- **第三方**：README 收录 5 个 PyTorch 复现；其中 `zhuyu-cs/MeanFlow` 自报 ImageNet 复现（SiT-B/4 80ep 15.43 vs 论文 15.53；XL/2 200/240ep 3.39 vs 3.43）并**公开了 ImageNet 权重**，是目前最省事的 ImageNet 复现入口（数字为其自报，未独立核验）。

**论文公式 ↔ 代码位置**

| 论文 | 代码（`Gsunshine/meanflow` main） |
|---|---|
| Eq. 3 平均速度定义 / Eq. 12 采样 | `meanflow.py` `solver_step`（`z_t - (t-r)·u`）与 `_default_schedule` 返回 `[1.0, 0.0]` |
| Eq. 8 JVP（切线 $[v,0,1]$） | `meanflow.py` `jax.jvp(u_fn, (z_t, t, r), (v_g, ones, zeros))`（代码变量顺序是 $(z,t,r)$，故切线写作 $(v_g,1,0)$） |
| Eq. 9–11 目标与 stop-gradient | `meanflow.py` `u_tgt = v_g - clip(t-r,0,1)·du_dt`，随后 `lax.stop_gradient` |
| Eq. 22 自适应权重 | `meanflow.py` `adp_wt = (loss + norm_eps)**norm_p; loss = loss / sg(adp_wt)`；`norm_p=1.0`、`norm_eps=0.01` |
| Eq. 19 / 21 引导目标 | `meanflow.py` `guidance_fn`（两支：`cfg, κ=0` 用 $v_{\text{uncond}}+\omega(v-v_{\text{uncond}})$；`cfg, κ>0` 用 Eq. 21） |
| $(r,t)$ 采样与 $r{=}t$ 比例 | `meanflow.py` `sample_tr`；`data_proportion=0.75` 表示 **75% 的样本 $r=t$**，即论文的「25% $r\neq t$」 |
| $(t,t-r)$ 条件化 | `models/models_dit.py` `DiT.__call__`：`c = t_embed(t) + h_embed(h) + y_embed(y)`，`h=t-r` |
| Alg. 2 一步采样 | `generate()` + `sample_one_step()`，`sampling.num_steps=1` |

**代码与论文的差异 / 读代码时的坑**

1. `data_proportion` 的命名与直觉相反：它数的是 $r=t$ 的比例（0.75），对应论文「25% $r\neq t$」。
2. 目标里的 $\partial_z u$ 切向用的是**引导后**速度 `v_g`，不是原始 $v_t$；无 CFG 时两者相同，有 CFG 时与 Eq. 18 的 $\tilde v_t\partial_z u$ 一致——但若你要复现「只对 $v$ 求导」的版本，这里会不一样。
3. `norm_eps` 默认 0.01，论文只写「$c>0$，例如 $10^{-3}$」，未给死值；换数据集时这一项要重扫。
4. `configs/default.py` 默认 `omega=1.0, kappa=0.5`，即**默认就是附录 B.1 的改进 CFG**，不是 Table 1(f) 的设置；同时 `default.py` 写 `num_epochs=1000`，`run_b4.yml` 覆盖为 240。
5. `sampling_timesteps` 为 None 时时间表只有 `[1.0, 0.0]`；`num_steps>1` 需要自己给表，否则 `t_steps[i+1]` 越界（我按代码推的，**未运行验证**）。
6. JVP 在 PyTorch + DDP 下有静默错误风险（官方 py-meanflow README 专门讲：`torch.func.jvp` 不接受 DDP 包装，绕过 `.module` 会**不报错地**丢掉梯度同步，需要 `synchronize_gradients` 加 sanity check）。这是复现时最容易踩、也最难发现的坑。

### 5.2 第一个该做的验证（不训大模型）

1. **先验机制**：跑 `py-meanflow` 的 `demo.ipynb`（自带 checkpoint，README 说 <2.9 FID）。这不是为了刷分，而是确认你环境里的 JVP 与 stop-gradient 语义和论文一致——把 `u_tgt` 里的 $(t-r)$ 强制为 0，看 FID 是否退化到 FM 量级；退化得不够，说明你的 JVP 实现有问题。
2. **再验前提**：在一个你自己有的场（哪怕是小 MLP 拟合的 2D 分布）上测「边缘轨迹弯曲度」与「1-NFE 误差」的相关性。MeanFlow 的收益完全来自 $u$ 与 $v$ 的差异，弯曲度小的地方它没理由赢——这一步能把「换个数据集还灵不灵」变成可测的。
3. **病理迁移的第一问**：在 H&E 瓦片（256×256，或某个 pathology VAE 的 latent）上按同样预算训 FM 与 MeanFlow。**先测**：条件流是直线、边缘场是否明显弯（用 $\|z_0-(z_1-u_\text{1step})\|$ 与多步积分结果之差衡量）。如果病理 latent 的边缘场比 ImageNet 更弯（组织形态多峰、染色域偏移），MeanFlow 的相对收益应该更大；如果更直，说明病理上「一步」本来就不难，该去做别的。

## 6. 前后关联

- **被它改写的基线**：[Flow Matching](08-flow-matching.md) 学 $v$；本文指出「边缘 $v$ 弯」是本质而非近似误差，从而把「一步」变成「学 $u$」。[Rectified Flow](09-rectified-flow.md) 用 reflow 把**条件**流拉直，本文的论点正好补上它没解决的部分：条件直 ≠ 边缘直。
- **正面对手**：[Consistency Models](10-consistency-models.md)（$r\equiv0$，单时间变量，需要课程）；Shortcut（离散时间间隔上的自一致）；IMM（随机插值的两时间自一致）。本文的定位差异写得很清楚：那些是**加在网络上**的约束，这里是**真值场自带**的恒等式。
- **骨干**：[DiT](07-dit.md)（adaLN-Zero，两时间变量 embedding 相加）；采样/加噪记号沿 [EDM](05-edm.md) 与 [DDPM](02-ddpm.md) 那条线，但 CIFAR 上刻意不用 EDM 预条件器。
- **后续（同批笔记）**：[13-imf](13-imf.md)（改进 MeanFlow，官方 JAX+PyTorch 代码已放出）、[14-pmf](14-pmf.md)（像素空间 MeanFlow）。二者都在 README 的 Update 里被点名，属于作者团队的连续工作。
- **正交改进**：论文明确说 REPA 这类表示对齐"applicable, left for future work"（[15-repa-e](15-repa-e.md) 是该方向的效率改进，未在本文实验中）。
- **病理侧可对接的问题**：一步生成的价值在病理里主要是**便宜的条件生成**——染色归一化、虚拟染色、稀有形态增广。相关笔记：[BigCell](../pathology/64-bigcell.md)（潜空间扩散做表达生成）、[Cytosyn](../pathology/66-cytosyn.md)（合成细胞）、[SuperDiff](../pathology/78-histo-diffusion.md)（超分，迭代采样成本敏感）、[CAFlow](../pathology/99-caflow.md)（流匹配路线）。

## 7. 局限与可检验问题

**论文没有「局限」章节**（结论只谈物理/多尺度模拟的类比），以下分为作者承认的与我的判断。

**作者承认/可推出的**：
- **多步采样没系统做**：只有 2-NFE 两个数（2.93 / 2.20），时间表怎么选、$N$ 步怎么退化都没有实验。「few-step is straightforward」只是式子成立。
- **只做类条件 ImageNet 与无条件 CIFAR**：没有文本条件、没有 512/1024、没有视频。
- **引导尺度焊死**：CFG 被吸收进场后，采样时无法再调 $\omega$（第三方复现明确要求 `--cfg-scale 1.0`）。想换多样性/保真度权衡只能重训。
- **从零训的成本**：XL/2 240 epoch；相对「直接蒸馏一个已有模型」，这是完全不同的预算档位。

**我的看法（作者没写的）**：
1. **「3.43 缩小了差距」这句话要看跟谁比**。1-NFE 3.43 vs 250×2 NFE 的 2.06，FID 仍高出约 66%；真正打平的是 **2-NFE 2.20 vs 2.06/2.27**。也就是说，这篇的真正结论是「2 步 ≈ 250 步」，不是「1 步 ≈ 250 步」。
2. **双时间场在实践中退化成单间隔场**。Table 1(c) 显示「只用 $t-r$」63.13、「$(t,t-r)$」61.06，差 2 分；这说明网络几乎不利用 $r$ 的绝对位置。理论给的 $(r,t)$ 二维结构，实际有效维度接近一维——那么「平均速度场」与「学一个以间隔为条件的位移场」在表示能力上有多大区别？论文没有做这个对照（我怀疑差别很小，但那会让「原理性」的叙事弱一些）。
3. **目标是自举的**。$u_{\text{tgt}}$ 用 $\partial u_\theta$ 顶替 $\partial u$，只有在零损失时才严格等价于定义。这和 consistency 的自蒸馏共享同一种风险（目标随参数漂移），只是本文的漂移被恒等式约束得更紧。收敛性没有分析。
4. **1-NFE 的质量上限没有讨论**。一步映射必然是「多对一」的：先验里不同的 $\epsilon$ 会映到同一张图，覆盖度损失是结构性的。FID 看不出这个（它奖励「像」，不奖励「全」），对小类别/稀有形态的覆盖更看不出——这对把一步模型当**增广器**用的场景是致命的（见下）。
5. **JVP 的隐性成本被「+16%」盖住了**：那是 TPU + JAX 的数字。PyTorch 侧要靠 `torch.compile` 才拿到相近的内存/速度（官方 py-meanflow README 明说），而 DDP 下还有静默错误风险。工程可复现性比论文呈现的差。

**迁移到病理时要回答的问题**：
- 病理没有类别标签 → **CFG-as-field 那半篇文章直接用不上**。速度优势保留，质量红利（61 → 15.5）没有对应物。若要做条件生成（染色、器官、放大倍数），需要重新推导「条件作为场」的版本，而不是照搬 Eq. 13。
- 一步模型的**覆盖度**在病理增广里比 FID 重要得多：如果 1-NFE 把罕见形态压掉，增广反而加剧长尾问题。可检验的做法：固定类别/形态标签，比较 1-NFE 与 50-NFE 采样在形态分类器上的预测分布（KL 或覆盖率），而不是只看 FID。
- 病理 latent 的**边缘场弯曲度**到底多大？这决定 MeanFlow 值不值得用；测法见 §5.2 第 3 条。

## 8. 来源与版本

- arXiv：<https://arxiv.org/abs/2505.13447>（v1，2025-05-19，唯一版本；arXiv 评论栏标 "Tech report"，CC BY 4.0）；HTML 全文 <https://arxiv.org/html/2505.13447>（仅 v1 有 HTML，v2/v3 路径 404）
- NeurIPS 2025 proceedings：<https://proceedings.neurips.cc/paper_files/paper/2025/hash/6d13e085b79d454da5910e4ca82a3d9d-Abstract-Conference.html>（Advances in NeurIPS 38，Main Conference Track，DOI 10.52202/085713-2534）
- OpenReview（venue 记录为 "NeurIPS 2025 oral"）：<https://openreview.net/forum?id=uWj4s7rMnR>
- 官方 JAX 代码：<https://github.com/Gsunshine/meanflow>（main，`d70cb55`，2026-03-13）
- 官方 PyTorch（CIFAR-10）：<https://github.com/Gsunshine/py-meanflow>（main，2025-07-30）
- 第三方 ImageNet 复现（含权重，自报数字）：<https://github.com/zhuyu-cs/MeanFlow>
- 相关工作：Consistency Models（arXiv:2303.01469）、Shortcut Models（ICLR 2025）、Inductive Moment Matching（arXiv:2503.07565）、REPA（ICLR 2025）

本页未运行任何训练、采样或 FID 评测。第 5 节的检查是建议，不是已执行结果。文中所有数字均来自上述 v1 HTML 的指定表/节、NeurIPS 摘要页，或明确标注为 README/第三方自报值。
