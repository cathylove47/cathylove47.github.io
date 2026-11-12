# 04｜Score-SDE：把离散噪声层级写成一条随机微分方程

**论文**：Score-Based Generative Modeling through Stochastic Differential Equations
**作者**：Yang Song、Jascha Sohl-Dickstein、Diederik P. Kingma、Abhishek Kumar、Stefano Ermon、Ben Poole
**会刊**：ICLR 2021（Oral；arXiv:2011.13456v2，2021-02-10）
**定位**：连续时间扩散的统一框架；反向 SDE、概率流 ODE、predictor-corrector 采样、精确似然、条件生成
**精读状态**：已核对 arXiv v2 全文（正文第 1–6 节、附录 A–I、表 1–5、图 1–12）与官方仓库 `yang-song/score_sde_pytorch`（commit `cb1f359`，2022-11-10）的相关源码
**实验声明**：本篇笔记没有训练或采样任何模型，没有复现 FID/IS/NLL；数字全部来自论文表格与图注，代码结论来自阅读源码。

## 原文摘要

> Creating noise from data is easy; creating data from noise is generative modeling. We present a stochastic differential equation (SDE) that smoothly transforms a complex data distribution to a known prior distribution by slowly injecting noise, and a corresponding reverse-time SDE that transforms the prior distribution back into the data distribution by slowly removing the noise. Crucially, the reverse-time SDE depends only on the time-dependent gradient field (a.k.a., score) of the perturbed data distribution. By leveraging advances in score-based generative modeling, we can accurately estimate these scores with neural networks, and use numerical SDE solvers to generate samples. We show that this framework encapsulates previous approaches in score-based generative modeling and diffusion probabilistic modeling, allowing for new sampling procedures and new modeling capabilities. In particular, we introduce a predictor-corrector framework to correct errors in the evolution of the discretized reverse-time SDE. We also derive an equivalent neural ODE that samples from the same distribution as the SDE, but additionally enables exact likelihood computation, and improved sampling efficiency. In addition, we provide a new way to solve inverse problems with score-based models, as demonstrated with experiments on class-conditional generation, image inpainting, and colorization. Combined with multiple architectural improvements, we achieve record-breaking performance for unconditional image generation on CIFAR-10 with an Inception score of 9.89 and FID of 2.20, a competitive likelihood of 2.99 bits/dim, and demonstrate high fidelity generation of 1024 × 1024 images for the first time from a score-based generative model.

*来源：arXiv:2011.13456v2 第 1 页摘要（ICLR 2021 相机版）。逐字复制，仅去掉 PDF 换行与断词连字符；未改写、未压缩。arXiv 摘要页把 "a.k.a." 显示为 LaTeX 宏 `\aka`，PDF 原文是 "a.k.a."，本页按 PDF。*

## 中文摘要

> 从数据造噪声很容易；从噪声造数据就是生成建模。我们给出一个随机微分方程（SDE），它通过缓慢注入噪声，把复杂的数据分布平滑地变换成一个已知的先验分布；并给出一个对应的反向时间 SDE，它通过缓慢去除噪声，把先验分布变回数据分布。关键在于，反向时间 SDE 只依赖扰动后数据分布的、随时间变化的梯度场（也就是分数）。借助基于分数的生成建模的进展，我们可以用神经网络准确估计这些分数，并用数值 SDE 求解器生成样本。我们表明这一框架把此前基于分数的生成建模与扩散概率建模中的各种方法都包含进来，从而允许新的采样流程与新的建模能力。特别地，我们引入 predictor-corrector 框架，用来修正离散化反向时间 SDE 演化中的误差。我们还推导出一个等价的神经 ODE，它从与 SDE 相同的分布采样，但额外支持精确似然计算与更高的采样效率。此外，我们提供一种用基于分数的模型求解逆问题的新方式，并在类条件生成、图像修补与上色实验上做了演示。结合多项结构改进，我们在 CIFAR-10 的无条件图像生成上取得破纪录的表现：Inception 分数 9.89、FID 2.20，以及 2.99 bits/dim 的有竞争力似然；并首次展示了来自基于分数的生成模型的 1024×1024 高保真图像生成。

*译文：与上方英文摘要逐句对应，未增删内容。数字、数据集名与术语保持原样。*

## 论文框架原图

![Score-SDE 论文图 2：通过 SDE 的基于分数的生成建模总览](/papers/diffusion/04-score-sde-pipeline.webp)

> **原文图注**：Figure 2: Overview of score-based generative modeling through SDEs. We can map data to a noise distribution (the prior) with an SDE (Section 3.1), and reverse this SDE for generative modeling (Section 3.2). We can also reverse the associated probability flow ODE (Section 4.3), which yields a deterministic process that samples from the same distribution as the SDE. Both the reverse-time SDE and probability flow ODE can be obtained by estimating the score $\nabla_x \log p_t(x)$ (Section 3.3).

*图源：arXiv:2011.13456v2 第 4 页 Figure 2，用 PyMuPDF 直接抽取该页内嵌的原始图像（2355×596 PNG），未重绘、未描摹。图中左侧是数据到先验、右侧是先验回到数据；彩色背景是各时刻的边缘密度 $p_t$，折线是样本轨迹，红色标注 SDE、白色标注概率流 ODE——同一组边缘下，ODE 轨迹光滑、SDE 轨迹抖动。*

## 0. 三分钟摘要

Score-SDE 把离散的加噪步骤写成连续时间过程。网络学习各个噪声时刻的分布梯度，再通过反向随机方程或概率流常微分方程，把先验噪声变成数据样本。

## 它到底怎么做

1. 选择一个把真实数据连续加噪到高斯先验附近的过程。
2. 在不同噪声时刻训练网络，估计对数密度的梯度，也就是 score。
3. 从对应尺度的先验噪声出发，数值求解反向 SDE 或概率流 ODE。
4. 需要时在预测步后增加 corrector 修正，并单独统计网络调用次数。

### 实验先看什么

- 区分随机 SDE 与确定性 ODE，不能把相同边缘分布理解为逐条轨迹相同。
- 对齐噪声先验、predictor、corrector 次数及检查点，再比较 FID 和似然。

## 1. 问题与核心判断

**问题**：此前的两类方法——SMLD/NCSN（多个噪声尺度上的分数匹配 + Langevin 采样）与 DDPM（离散马尔可夫链 + 变分下界）——各自定义在**有限个**噪声层级上，记号不同、采样器不同、能力也不同。输入是数据分布 $p_0$ 的样本与一个预设的噪声过程，输出是一个能从先验 $p_T$ 采样出 $p_0$ 样本的生成模型，并且要能算似然、能做条件生成。

**此前的瓶颈**：(i) 噪声层级是离散的 $N$ 个，$N$ 与步长耦合，采样必须走完 $N$ 步；(ii) DDPM 只能给 ELBO，拿不到精确似然；(iii) 条件生成需要重训或额外分类器；(iv) 两类方法的采样器无法互换，也无法统一分析误差。

**核心答案**：把噪声层级取连续极限，得到一条前向 SDE $dx=f(x,t)dt+g(t)dw$。它的反向过程仍是扩散过程（Anderson 1982），且**反向 SDE 只依赖分数** $\nabla_x\log p_t(x)$。于是训练一个时间相关的分数网络，就能用任意 SDE 求解器采样；再把反向 SDE 的扩散项按 $\frac12$ 缩放并置零，得到**概率流 ODE**，它与 SDE 共享全部边缘分布，因此可以算精确似然、可以做确定性编码。

**一句话记住**：SDE 决定“怎么加噪”，分数决定“怎么往回走”，ODE 决定“怎么确定地往回走”。

## 2. 术语（白话）

- **分数（score）**：$\nabla_x\log p_t(x)$，即对数密度对数据的梯度。它不告诉你概率多大，只告诉你“往哪个方向走能让概率变大”。
- **前向 SDE**：$dx=f(x,t)dt+g(t)dw$。$f$ 是确定性漂移（VP 中把数据往 0 拉，VE 中为 0），$g$ 是扩散系数（控制注入噪声的强度），$w$ 是标准 Wiener 过程。本文使用的前向过程没有可训练参数。
- **反向时间 SDE**：从 $t=T$ 往 $t=0$ 走的 SDE。注意这里的 $dt$ 是**负的无穷小时间步**，$\bar w$ 是时间倒流时的 Wiener 过程。方向搞反会让采样完全失效。
- **VE / VP / sub-VP**：三种具体 SDE。VE（Variance Exploding）方差随时间爆炸，对应 SMLD；VP（Variance Preserving）方差有界，对应 DDPM；sub-VP 是本文新提的，方差始终不超过 VP，似然更好。
- **概率流 ODE**：一个确定性 ODE，它的解在每一时刻的边缘分布与 SDE 相同。因为确定，才能用瞬时变量变换公式算精确似然。
- **predictor-corrector（PC）**：先用数值 SDE 求解器走一步（predictor），再用 Langevin/HMC 在当前时刻按分数修正分布（corrector）。corrector 不改时间，只改样本。
- **NFE**：分数网络被调用多少次。若每个时刻的 predictor 调用一次网络、corrector 做 $n_{\text{steps}}$ 次 Langevin 更新，则 $N$ 个时刻共调用 $N(1+n_{\text{steps}})$ 次。论文 PC1000 配置每个 predictor 后做一次 corrector，因此是 2000 次调用；不能把所有“1000 步 PC”都当成这个配置。
- **ancestral sampling**：DDPM 那种“每步按高斯条件分布抽一个”的采样。本文证明它是反向 VP-SDE 的一种特定离散化。
- **exact likelihood**：概率流 ODE 定义的密度可以精确算（数值积分误差之外没有下界松弛），与 DDPM 的 ELBO 不同。

## 3. 核心方法与数据流

### 3.1 前向 SDE 与反向 SDE（符号与时间方向）

前向（论文式 (5)）：

$$
dx=f(x,t)\,dt+g(t)\,dw
$$

反向（论文式 (6)，来自 Anderson 1982）：

$$
dx=\left[f(x,t)-g(t)^2\,\nabla_x\log p_t(x)\right]dt+g(t)\,d\bar w
$$

逐项读：

- $f(x,t)$ 原样保留，**不变号**。这一点常被记错：反向过程不是“把漂移取反”。
- $-g(t)^2\nabla_x\log p_t(x)$ 是新增的修正项，系数是 $g^2$，不是 $g$。
- $dt$ 是负的无穷小步，$\bar w$ 是反向时间的 Wiener 过程；积分从 $T$ 到 $0$。
- 反向 SDE 里没有 $p_0$，只有分数；这就是“只需估分数”的全部含义。

### 3.2 用去噪分数匹配估分数

$$
\theta^\star=\arg\min_\theta\ \mathbb{E}_t\Big\{\lambda(t)\,\mathbb{E}_{x(0)}\,\mathbb{E}_{x(t)|x(0)}
\left[\left\|s_\theta(x(t),t)-\nabla_{x(t)}\log p_{0t}(x(t)\mid x(0))\right\|_2^2\right]\Big\}
$$

（论文式 (7)）$\lambda(t)$ 是正权重，常取 $\lambda(t)\propto1/\mathbb{E}\|\nabla\log p_{0t}\|^2$。因为 $f$ 是仿射的，转移核 $p_{0t}(x(t)|x(0))$ 是高斯，有闭式，所以这个目标可以直接算。

### 3.3 三种 SDE 与它们的转移核

VE（论文式 (9)）：

$$
dx=\sqrt{\frac{d[\sigma^2(t)]}{dt}}\,dw
$$

VP（论文式 (11)）：

$$
dx=-\frac12\beta(t)x\,dt+\sqrt{\beta(t)}\,dw
$$

sub-VP（论文式 (12)）：

$$
dx=-\frac12\beta(t)x\,dt+\sqrt{\beta(t)\left(1-e^{-2\int_0^t\beta(s)ds}\right)}\,dw
$$

转移核（论文式 (29)）：

$$
p_{0t}(x(t)\mid x(0))=
\begin{cases}
\mathcal{N}\!\left(x(t);x(0),\ [\sigma^2(t)-\sigma^2(0)]I\right) & \text{VE}\\[2pt]
\mathcal{N}\!\left(x(t);x(0)e^{-\frac12\int_0^t\beta(s)ds},\ I-Ie^{-\int_0^t\beta(s)ds}\right) & \text{VP}\\[2pt]
\mathcal{N}\!\left(x(t);x(0)e^{-\frac12\int_0^t\beta(s)ds},\ \left[1-e^{-\int_0^t\beta(s)ds}\right]^2 I\right) & \text{sub-VP}
\end{cases}
$$

注意 sub-VP 的标准差是 $1-e^{-\int\beta}$（平方在方差上），这是它“方差始终不超过 VP”的原因，也是读代码时最容易看错的一行。

### 3.4 概率流 ODE：唯一的差别是 $\frac12$

论文式 (13)：

$$
dx=\left[f(x,t)-\frac12 g(t)^2\,\nabla_x\log p_t(x)\right]dt
$$

与反向 SDE（式 (6)）并排看：

| | 分数项系数 | 噪声项 | 结果 |
|---|---|---|---|
| 反向 SDE | $g(t)^2$ | $g(t)d\bar w$ | 随机，边缘正确 |
| 概率流 ODE | $\frac12 g(t)^2$ | 无 | 确定，边缘相同 |

**这是本篇最容易记错的地方**：ODE 的分数项是 SDE 的一半，且没有噪声项。代码里就是同一个 `0.5 if probability_flow else 1.` 分支。

### 3.5 采样：predictor + corrector

1. 从代码采用的高斯先验采样：VP 为 $\mathcal{N}(0,I)$；VE 为 $\mathcal{N}(0,\sigma_{\max}^2 I)$，默认 $\sigma_{\max}=50$。这是对有限噪声终点分布的近似，两者的起始噪声尺度不同。
2. 把 $[0,T]$ 离散成 $N$ 段（代码里是 `linspace(T, eps, N)`，**从大到小**）。
3. 每一步：predictor 用反向 SDE 或概率流 ODE 走一步；corrector 在该时刻跑若干步 Langevin，步长按信噪比 $r$ 定。
4. 走完后可选做一次“单步去噪”把 $\epsilon$ 残差去掉。
5. 输出 $x(0)$。

PC 的两种极端：SMLD 原来用“恒等 predictor + 退火 Langevin corrector”；DDPM 原来用“ancestral predictor + 恒等 corrector”。本文把两者都收进同一个接口。

### 3.6 条件生成与精确似然

条件反向 SDE（论文式 (14)）：

$$
dx=\left\{f(x,t)-g(t)^2\left[\nabla_x\log p_t(x)+\nabla_x\log p_t(y\mid x)\right]\right\}dt+g(t)\,d\bar w
$$

因为 $p_t(x|y)\propto p_t(x)p(y|x)$，条件分数就是“无条件分数 + 似然梯度”。所以一个无条件模型加一个时间相关分类器就能做类条件生成；修补与上色则用 $\nabla_x\log p_t(y|x)$ 的启发式估计（附录 I）。精确似然来自 ODE 的瞬时变量变换（附录 D.2），与变分下界无关。

## 4. 实验与证据

**设置**：CIFAR-10 32×32 无条件；LSUN 256×256（bedroom/church）；CelebA-HQ 1024×1024。训练用 1000 个噪声尺度（离散目标）或连续目标（式 (7)）；batch 128（CIFAR-10）/ 64（LSUN）。FID/IS 用 5 万样本。

**表 1（CIFAR-10，不同反向 SDE 求解器，FID↓，5 次采样均值±标准差）**。列的含义：P1000/P2000 = 只用 predictor 走 1000/2000 步；C2000 = 只用 corrector 走 2000 步；PC1000 = 1000 步 predictor + 1000 步 corrector（NFE 翻倍）。

| predictor | VE P1000 | VE P2000 | VE C2000 | VE PC1000 | VP P1000 | VP P2000 | VP C2000 | VP PC1000 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ancestral sampling | 4.98 | 4.88 | — | 3.62 | 3.24 | 3.24 | — | 3.21 |
| reverse diffusion | 4.79 | 4.74 | 20.43 | 3.60 | 3.21 | 3.19 | 19.06 | 3.18 |
| probability flow | 15.41 | 10.54 | — | 3.51 | 3.59 | 3.23 | — | **3.06** |

这张表有三个可引用的结论：

1. **reverse diffusion 略好于 ancestral**（VE 4.79 对 4.98；VP 3.21 对 3.24），对应正文“reverse diffusion sampler always outperform ancestral sampling”。
2. **corrector 单独用很差**（20.43 / 19.06），因为每个噪声尺度上需要很多步 Langevin 才够。
3. **概率流 ODE 单独用很差、配上 corrector 最好**（VP：3.59 → 3.06）。这说明“确定性采样器 + 少量修正”是有效组合，而不是“ODE 一定更好”。

**表 2（CIFAR-10，均匀去量化数据上的 NLL 与 ODE 采样 FID）**：`DDPM++ cont. (deep, sub-VP)` 得 NLL **2.99** bits/dim、FID(ODE) 2.92；`DDPM++ cont. (deep, VP)` 得 3.13 / 3.08。同一架构下 sub-VP 的似然总是优于 VP（正文明确写 "With sub-VP SDEs, we always get higher likelihoods compared to VP SDEs"）。注意表 2 的 FID 是**黑盒 ODE 求解器**采样、**最后一个**检查点；表 3 的 FID 是 **PC 采样**、**FID 最小的**检查点。两张表的 FID 不能直接对比。

**表 3（CIFAR-10 样本质量）**：`NCSN++ cont. (deep, VE)` 得 FID **2.20**、IS **9.89**（无条件，破当时的无条件记录，且优于表里的条件 BigGAN 14.73/9.22）；`DDPM++ cont. (deep, VP)` 与 `(deep, sub-VP)` 都是 FID 2.41。正文的总结是：VE 的样本质量更好，VP/sub-VP 的似然更好。

**1024×1024（附录 H.3）**：CelebA-HQ，batch 8，EMA 0.9999，连续目标训练约 2.4M 迭代；采样用 PC、2000 步离散化、reverse diffusion predictor、每个 predictor 步 1 步 Langevin、信噪比 0.15、随机 Fourier 特征尺度 16。论文自己说样本“不完美（例如面部对称性有可见瑕疵）”。这是“首次”的来源，不是“已经好用”。

**NFE 与效率（图 3）**：概率流 ODE 配黑盒自适应求解器时，精度 1e-1/1e-3/1e-5 对应 NFE 14/86/548；正文说“放宽容差可以把函数评估次数减少 90% 以上而不影响视觉质量”。这里的 NFE 是 ODE 求解器的实际调用次数，不是“步数”，两者不能混。

## 5. 复现入口与首个验证

**官方仓库**：`https://github.com/yang-song/score_sde_pytorch`（PyTorch；另有 JAX 版 `yang-song/score_sde`，支持用预训练分类器做类条件生成）。实际读到的文件与结论：

- `sde_lib.py`：抽象类 `SDE` 的 `reverse(score_fn, probability_flow=False)` 就是式 (6)/(13) 的实现。关键两行是
  `drift = drift - diffusion**2 * score * (0.5 if self.probability_flow else 1.)` 与
  `diffusion = 0. if self.probability_flow else diffusion`。
  这直接印证了“ODE 的分数项是 SDE 的一半、且扩散系数置零”。
- 同类里 `VPSDE.sde` 返回 `drift = -0.5*beta_t*x`、`diffusion = sqrt(beta_t)`；`subVPSDE.marginal_prob` 返回 `std = 1 - exp(2*log_mean_coeff)`，即 $1-e^{-\int\beta}$，与式 (29) 的平方形式一致。
- **一个容易踩的坑**：`VPSDE(beta_min=0.1, beta_max=20)` 是**连续时间**参数化（$t\in[0,1]$），而 `discrete_betas = linspace(beta_min/N, beta_max/N, N)` 才是 DDPM 的每步 $\beta$（$10^{-4}$ 到 $0.02$）。把 `beta_min/beta_max` 当成 DDPM 的 $\beta_1/\beta_T$ 会差三个数量级。
- `sampling.py`：`ReverseDiffusionPredictor.update_fn` 里 `x_mean = x - f`（因为 `f` 已经是离散化的负向增量），`x = x_mean + G*z`；`get_pc_sampler` 里 `timesteps = torch.linspace(sde.T, eps, sde.N)`，**从 $T$ 递减到 `eps`**（默认 `eps=1e-3`），这就是“反向积分”的代码证据。
- `losses.py`：`get_sde_loss_fn` 里 `t = torch.rand(B)*(sde.T - eps) + eps`（`eps=1e-5`），`losses = torch.square(score*std + z)` 是论文推荐的 $\lambda\propto1/\sigma^2$ 加权；`likelihood_weighting=True` 时改成 `torch.square(score + z/std) * g2`。
- `configs/ve/cifar10_ncsnpp_deep_continuous.py`：`training.sde='vesde'`、`training.continuous=True`、`n_iters=950001`、`sampling.method='pc'`、`predictor='reverse_diffusion'`、`corrector='langevin'`、`model.nf=128`、`ch_mult=(1,2,2,2)`、`num_res_blocks=8`、`fourier_scale=16`。`configs/default_cifar10_configs.py` 里 `snr=0.16`、`n_steps_each=1`、`num_samples=50000`。

**权重与数据**：README 给了一个 Google Drive 文件夹，按 `ve/`、`vp/`、`subvp/` 分目录；并明确说明“某些模型有两个检查点：编号小的对应表 3 的 FID，编号大的对应表 2 的 NLL/ODE FID”。CIFAR-10 的 FID 统计量需要单独下载 `cifar10_stats.npz` 放到 `assets/stats/`。**CelebA/CelebA-HQ 的原始检查点按 Google 政策不能发布**，作者用 FFHQ 1024/256 与 CelebA-HQ 256 重训了替代模型——所以 1024×1024 那条结果无法用官方权重直接复现。

**依赖**：`requirements.txt` 同时列了 TF 2.4（`tensorflow`、`tensorflow-gan`、`tensorflow_datasets` 等，用于数据集与 FID 统计）与 `torch>=1.7`；`ninja` 用于 `op/` 下的自定义 CUDA 算子。没有 `setup.py`，直接 `python main.py`。

**首个机制验证（不需要训练，约 20 分钟）**：用一维高斯验证“反向 SDE 与概率流 ODE 边缘相同，且 $\frac12$ 不能少”。

1. 取 $p_0=\mathcal{N}(0,\sigma_0^2)$，用 VP SDE（$\beta$ 常数）。此时 $p_t$ 仍是高斯，均值 0、方差可闭式写出，分数 $\nabla_x\log p_t(x)=-x/\mathrm{Var}_t$ 是已知的——不需要网络。
2. 用 `sde_lib.VPSDE.reverse(score_fn, probability_flow=False)` 跑 Euler-Maruyama，多条轨迹；用 `probability_flow=True` 跑另一个。
3. 比较 $t=0$ 处样本的方差与闭式解。两者都应收敛到 $\sigma_0^2$（在积分步长足够小时）。
4. 故意把 `0.5` 去掉（用 SDE 的系数跑 ODE），方差会明显偏离。这一步是决定性的：它证明 $\frac12$ 不是实现细节。

如果第 3 步就对不上，先查时间网格方向（`linspace(T, eps, N)` 是递减）与 `x_mean = x - f` 的符号，这两处是最常见的错。

## 6. 前后关联

- **离散前驱**：[DDPM](02-ddpm.md)。本文附录 E 证明 DDPM 的 ancestral sampling 是反向 VP-SDE 的一种离散化；把 $\beta_t$ 换成 $\beta(t)$、把 $\bar\alpha_t$ 换成 $e^{-\int\beta}$ 就能对上。
- **采样加速的另一种路线**：[DDIM](03-ddim.md)。DDIM 的 ODE 是 VE-SDE 概率流 ODE 的特例（DDIM 命题 1），但两者对 $d\sigma$ 与 $dt$ 取 Euler 步，少步时结果不同。
- **设计空间重排**：[EDM](05-edm.md) 把预条件、噪声 schedule、求解器分开；读 EDM 时要记得本文的 $f,g$ 与 EDM 的 $\sigma(t)$ 不是同一套记号。
- **潜空间**：[LDM](06-ldm.md) 在自编码器潜空间里用本文这类连续时间目标训练。
- **架构侧**：[DiT](07-dit.md) 把 U-Net 换成 Transformer，训练目标仍是本文/DDPM 的分数或噪声回归。
- **流与直线化**：[Flow Matching](08-flow-matching.md) 与 [Rectified Flow](09-rectified-flow.md) 把“概率流 ODE”这一支继续推进：既然 ODE 决定轨迹，就可以直接学一个更好的速度场。
- **一步化**：[Consistency Models](10-consistency-models.md) 以概率流 ODE 的轨迹为对象做自蒸馏，是本文 ODE 视角的直接下游。

## 7. 局限与可检验问题

**论文自己承认的局限**：采样仍比 GAN 慢（结论第一段明确写 "they remain slower at sampling than GANs"）；可用的求解器与超参太多（predictor 类型、corrector 类型、步数、信噪比 $r$、ODE 容差），论文说需要更好的自动选择方法；1024×1024 的样本“不完美”；CelebA-HQ 的检查点不能发布。

**这份笔记额外指出的一点**：表 1 里“概率流 ODE 单独用”在 VE 上 P1000 是 15.41，配上 corrector 变 3.51；在 VP 上 3.59 → 3.06。同一张表里 ancestral 在 VP 上 P1000 已经是 3.24。所以“ODE 更高效”这句话必须带条件：**单独用 ODE 时它明显更差，是 corrector 把它救回来的**。引用时不要只说“ODE 提升效率”。

**两个小问题（均为未验证设想）**：

1. **corrector 的信噪比 $r$ 能否按 $t$ 自适应？** 论文表 5 只报了每个采样器的单一最优 $r$（LSUN 固定 0.075，1024 CelebA-HQ 用 0.15，CIFAR-10 配置里是 0.16）。可检验做法：固定同一个 CIFAR-10 检查点与 PC1000，令 $r_t=r_0\cdot(1-t/T)$ 或反向，扫两三个 $r_0$，看 FID 是否低于固定 $r$。不需要重训。
2. **sub-VP 的似然优势来自方差上界还是来自训练稳定性？** 论文只给了“方差始终不超过 VP”的证明与似然更好的经验结果，没有分离这两个解释。可检验做法：在同一 sub-VP 模型上，把训练目标的权重从 $g^2$ 改成常数（即换回 $L_{\text{simple}}$ 式加权），比较 NLL；如果似然优势消失，说明它主要来自似然加权而不是 SDE 本身。

## 来源与版本

- 论文：[arXiv:2011.13456v2](https://arxiv.org/abs/2011.13456v2)（2021-02-10；PDF 页眉为 ICLR 2021，arXiv 注释为 "ICLR 2021 (Oral)"）。本页核对的是这一版的摘要、第 1–6 节、附录 B/D/E/G/H/I、表 1–5、图 1–12。
- 官方代码：[yang-song/score_sde_pytorch](https://github.com/yang-song/score_sde_pytorch)，commit `cb1f359f4aadf0ff9a5e122fe8fffc9451fd6e44`（2022-11-10）。读过的文件：`README.md`、`requirements.txt`、`sde_lib.py`、`sampling.py`、`losses.py`、`configs/default_cifar10_configs.py`、`configs/ve/cifar10_ncsnpp_deep_continuous.py`。
- 图：`/papers/diffusion/04-score-sde-pipeline.webp`，从上述 v2 PDF 第 4 页 Figure 2 抽取内嵌原图（2355×596 PNG），缩放为 1800 宽并转 WebP（q88），未重绘。
- 未做的事：没有下载任何检查点或 FID 统计量，没有运行训练/采样/似然计算，没有复现表 1–3 的任何数字；没有验证 Google Drive 链接当前是否可下载；没有核对 JAX 版与 PyTorch 版的数值一致性。
