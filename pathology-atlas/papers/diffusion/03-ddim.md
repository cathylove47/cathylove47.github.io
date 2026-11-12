# 03｜DDIM：不改训练目标，只改采样过程

**论文**：Denoising Diffusion Implicit Models
**作者**：Jiaming Song、Chenlin Meng、Stefano Ermon（Stanford University）
**会刊**：ICLR 2021（arXiv:2010.02502v2，2021-11-04；PDF 页眉为 "Published as a conference paper at ICLR 2021"）
**定位**：非马尔可夫前向过程族；同一训练目标下的确定性采样；ODE 视角；潜空间插值与重建
**精读状态**：已核对 arXiv v2 全文（正文第 2–7 节、附录 A–D、表 1–3、图 1–10）与官方仓库 `ermongroup/ddim`（commit `e8df66c`，2024-07-26）的相关源码
**实验声明**：本篇笔记没有训练或采样任何模型，没有复现表中 FID 与重建误差；数字全部来自论文表格，代码结论来自阅读源码。

## 原文摘要

> Denoising diffusion probabilistic models (DDPMs) have achieved high quality image generation without adversarial training, yet they require simulating a Markov chain for many steps in order to produce a sample. To accelerate sampling, we present denoising diffusion implicit models (DDIMs), a more efficient class of iterative implicit probabilistic models with the same training procedure as DDPMs. In DDPMs, the generative process is defined as the reverse of a particular Markovian diffusion process. We generalize DDPMs via a class of non-Markovian diffusion processes that lead to the same training objective. These non-Markovian processes can correspond to generative processes that are deterministic, giving rise to implicit models that produce high quality samples much faster. We empirically demonstrate that DDIMs can produce high quality samples 10× to 50× faster in terms of wall-clock time compared to DDPMs, allow us to trade off computation for sample quality, perform semantically meaningful image interpolation directly in the latent space, and reconstruct observations with very low error.

*来源：arXiv:2010.02502v2 第 1 页摘要（ICLR 2021 相机版）。逐字复制，仅去掉 PDF 换行与断词连字符；未改写、未压缩。*

**版本提醒**：arXiv 最新版（v4，2022-10）的摘要把 "the reverse of a particular Markovian diffusion process" 改成了 "the reverse of a Markovian diffusion process"，并把 "We generalize DDPMs via..." 改成了 "We construct a class of non-Markovian diffusion processes that lead to the same training objective, but whose reverse process can be much faster to sample from."。本页引用的是 ICLR 2021 相机版（v2），所以逐字内容与 arXiv 摘要页看到的字面不同。这不是抄错。

## 中文摘要

> 去噪扩散概率模型（DDPM）在没有对抗训练的情况下实现了高质量图像生成，但它需要模拟一条很多步的马尔可夫链才能产出一个样本。为了加速采样，我们提出去噪扩散隐式模型（DDIM）：一类更高效的迭代式隐式概率模型，训练过程与 DDPM 完全相同。在 DDPM 中，生成过程被定义为某个马尔可夫扩散过程的逆过程。我们通过一族非马尔可夫扩散过程来推广 DDPM，这些过程导向同一个训练目标。这些非马尔可夫过程可以对应确定性的生成过程，从而得到能以快得多的速度产出高质量样本的隐式模型。我们实验表明，DDIM 在墙钟时间上比 DDPM 快 10 到 50 倍就能产出高质量样本；它允许我们在计算量与样本质量之间做权衡；可以直接在潜空间做语义上有意义的图像插值；并能以很低的误差重建观测。

*译文：与上方英文摘要逐句对应，未增删内容。数字、专有名词保持原样。*

## 论文框架原图

![DDIM 论文图 1：扩散与非马尔可夫推断模型的有向图](/papers/diffusion/03-ddim-pipeline.png)

> **原文图注**：Figure 1: Graphical models for diffusion (left) and non-Markovian (right) inference models.

*图源：arXiv:2010.02502v2 第 2 页 Figure 1，用 PyMuPDF 从官方 PDF 页面区域裁出（未重绘、未描摹）。左图是 DDPM 的马尔可夫链：$q(x_t|x_{t-1})$ 只看前一时刻；右图是 DDIM 的非马尔可夫族：虚线表示 $q(x_t|x_{t-1},x_0)$ 同时依赖 $x_{t-1}$ 与 $x_0$，所以同一条“前向”不再是马尔可夫链，但每个边缘 $q(x_t|x_0)$ 保持与左图一致。*

## 0. 三分钟摘要

DDIM 针对的是生成太慢，而不是重新设计训练任务。它复用已有的 DDPM 网络，换一套可跳过中间时刻的采样规则，用较少网络调用生成图像。

## 它到底怎么做

1. 读取已经训练好的 DDPM 噪声预测网络，不重新训练。
2. 选择较稀疏的采样时间点，只在这些时刻调用网络。
3. 每一步先估计干净图像，再按噪声方向更新到下一个时刻。
4. 用 eta 控制随机性；eta 为零时，给定初始噪声后整个采样过程确定。

### 实验先看什么

- 同时报告时间点选法、网络调用次数与 eta，少步质量取决于这些设置。
- 确定性指固定起始噪声后可复现，不代表换一个起始噪声还会生成相同图像。

## 1. 问题与核心判断

**问题**：DDPM 的样本质量可以，但采样太慢。输入是一张训练好的 DDPM 模型（网络 $\epsilon_\theta$、$\beta$ 表、$T=1000$），输出是同一模型在更少步数下生成的样本。**不重新训练**，只换采样规则。

**此前的瓶颈**：DDPM 的生成过程被定义为前向扩散的逆过程，前向有 $T$ 步，反向就必须走 $T$ 步。论文给的量级是：在单张 Nvidia 2080 Ti 上采 5 万张 32×32 图约 20 小时，而 GAN 不到 1 分钟；256×256 的 5 万张接近 1000 小时。这个差距不是模型质量的问题，是“必须串行走 1000 次网络”的问题。

**核心观察**：DDPM 的训练目标 $L_\gamma$ 只依赖边缘分布 $q(x_t|x_0)$，**不直接依赖联合分布 $q(x_{1:T}|x_0)$**。而满足同一组边缘的联合分布有无穷多个。于是可以换一个非马尔可夫联合，训练目标不变，但对应的反向过程可以更短、甚至确定。

**一句话记住**：DDIM 不是新模型，是“同一族边缘下的另一种反向过程”；$\eta=0$ 时它变成从 $x_T$ 到 $x_0$ 的确定映射。

## 2. 术语（白话）

- **非马尔可夫前向**：每一步不仅看 $x_{t-1}$，还看 $x_0$（式 (7)）。它不再是“链”，但因为边缘 $q_\sigma(x_t|x_0)=\mathcal{N}(\sqrt{\alpha_t}x_0,(1-\alpha_t)I)$ 没变，训练时用到的东西一模一样。
- **$\sigma$（论文里的 $\sigma_t$）**：控制这个族有多随机的参数。$\sigma\to0$ 时，给定 $x_0$ 和 $x_t$，$x_{t-1}$ 就完全确定。
- **$\eta$**：实验里把 $\sigma$ 参数化成 $\sigma_{\tau_i}(\eta)=\eta\sqrt{(1-\alpha_{\tau_i-1})/(1-\alpha_{\tau_i})}\sqrt{1-\alpha_{\tau_i}/\alpha_{\tau_i-1}}$（式 (16)）。$\eta=1$ 是 DDPM，$\eta=0$ 是 DDIM。注意 $\eta$ 是**采样时**的超参，训练完全不变。
- **$\tau$（采样轨迹）**：从 $\{1,\dots,T\}$ 里挑出的递增子序列，长度 $S$。只在这 $S$ 个时刻做更新，NFE 就是 $S$。
- **隐式模型（implicit model）**：样本由潜变量经固定过程唯一决定，不像 DDPM 那样每步再抽噪声。所以同一个 $x_T$ 配不同 $\tau$ 会给出相似的高层特征。
- **一致性（consistency）**：论文用这个词指“同一 $x_T$、不同步数生成的图，高层语义相似”。这不是后面 Consistency Models 那个“一致性模型”，两者只是用词相同。
- **概率流 ODE**：把式 (12) 的随机项去掉后，可以写成关于 $t$ 的常微分方程（式 (14)）。DDIM 的更新等价于对这个 ODE 做 Euler 步。

## 3. 核心方法与数据流

### 3.1 为什么可以不重训：目标只认边缘

DDPM 的（加权）目标（论文式 (5)）：

$$
L_\gamma(\epsilon_\theta):=\sum_{t=1}^{T}\gamma_t\,\mathbb{E}_{x_0\sim q(x_0),\,\epsilon_t\sim\mathcal{N}(0,I)}
\left[\left\|\epsilon_\theta^{(t)}\!\left(\sqrt{\alpha_t}x_0+\sqrt{1-\alpha_t}\epsilon_t\right)-\epsilon_t\right\|_2^2\right]
$$

它只出现 $x_t=\sqrt{\alpha_t}x_0+\sqrt{1-\alpha_t}\epsilon_t$，也就是边缘 $q(x_t|x_0)$。这就是全文的支点：只要新构造的联合分布保持同样的边缘，$L_\gamma$ 一个字都不用改。

### 3.2 非马尔可夫族与生成过程

推断族（论文式 (6)(7)）：

$$
q_\sigma(x_{1:T}\mid x_0):=q_\sigma(x_T\mid x_0)\prod_{t=2}^{T}q_\sigma(x_{t-1}\mid x_t,x_0)
$$

$$
q_\sigma(x_{t-1}\mid x_t,x_0)=\mathcal{N}\!\left(
\sqrt{\alpha_{t-1}}\,x_0+\sqrt{1-\alpha_{t-1}-\sigma_t^2}\cdot\frac{x_t-\sqrt{\alpha_t}x_0}{\sqrt{1-\alpha_t}},\ \sigma_t^2 I
\right)
$$

均值那一项是专门选的，使得 $q_\sigma(x_t|x_0)=\mathcal{N}(\sqrt{\alpha_t}x_0,(1-\alpha_t)I)$ 对每个 $t$ 都成立（附录 B 引理 1 用归纳法证明）。$\sigma$ 越大越随机；$\sigma\to0$ 时“看到 $x_0$ 和 $x_t$ 就知道 $x_{t-1}$”。

生成过程把 $x_0$ 换成网络预测（论文式 (9)(10)）：

$$
f_\theta^{(t)}(x_t):=\left(x_t-\sqrt{1-\alpha_t}\,\epsilon_\theta^{(t)}(x_t)\right)/\sqrt{\alpha_t}
$$

$$
p_\theta^{(t)}(x_{t-1}\mid x_t)=
\begin{cases}
\mathcal{N}\!\left(f_\theta^{(1)}(x_1),\ \sigma_1^2 I\right) & t=1\\
q_\sigma\!\left(x_{t-1}\mid x_t,\ f_\theta^{(t)}(x_t)\right) & \text{otherwise}
\end{cases}
$$

$t=1$ 时额外加一点噪声，是为了让生成分布处处有支撑。

### 3.3 定理 1：新目标等于旧目标加常数

论文的定理 1 是：对任意 $\sigma>0$，存在 $\gamma\in\mathbb{R}^T_{>0}$ 与常数 $C$，使 $J_\sigma=L_\gamma+C$。附录 B 的证明直接给出 $\gamma_t=1/(2d\sigma_t^2\alpha_t)$（$d$ 是数据维度），并且指出：如果各 $t$ 的 $\epsilon_\theta^{(t)}$ 参数不共享，最优解与 $\gamma$ 无关。所以 DDPM 用 $L_1$ 当代理目标是合法的，DDIM 也能用同一个 $L_1$。

### 3.4 采样式：三项，各管一件事

从 $p_\theta$ 采样一步（论文式 (12)）：

$$
x_{t-1}=
\sqrt{\alpha_{t-1}}\left(\frac{x_t-\sqrt{1-\alpha_t}\,\epsilon_\theta^{(t)}(x_t)}{\sqrt{\alpha_t}}\right)
+\sqrt{1-\alpha_{t-1}-\sigma_t^2}\ \epsilon_\theta^{(t)}(x_t)
+\sigma_t\epsilon_t
$$

三项的读法：

1. $\sqrt{\alpha_{t-1}}\left(x_t-\sqrt{1-\alpha_t}\,\epsilon_\theta\right)/\sqrt{\alpha_t}$：先把 $x_t$ 换算成 $\hat x_0$，再按 $\sqrt{\alpha_{t-1}}$ 缩回去。
2. $\sqrt{1-\alpha_{t-1}-\sigma_t^2}\,\epsilon_\theta$：用同一个 $\epsilon_\theta$ 把结果往 $x_t$ 的方向拉。
3. $\sigma_t\epsilon_t$：唯一的随机项。**$\sigma_t=0$ 时第三项消失，整个更新成为 $x_t$ 的确定函数**。这就是“$\eta=0$ 时给定初始噪声就确定”的确切含义：不是“没有随机性所以更好”，而是“样本完全由 $x_T$ 决定”。

$\sigma_t=\sqrt{(1-\alpha_{t-1})/(1-\alpha_t)}\sqrt{1-\alpha_t/\alpha_{t-1}}$ 时前向恢复马尔可夫，生成过程就是 DDPM。

### 3.5 少步采样：只在子序列上更新

取递增子序列 $\tau$（长度 $S<T$），只在 $x_{\tau_S},\dots,x_{\tau_1}$ 上更新，训练不变。论文附录 D.2 给了两种取法：线性 $\tau_i=\lfloor ci\rfloor$ 与二次 $\tau_i=\lfloor ci^2\rfloor$；CIFAR10 用二次，其余数据集用线性。附录 D.3 给出加速版的闭式：

$$
x_{\tau_{i-1}}(\eta)=\sqrt{\alpha_{\tau_{i-1}}}\left(\frac{x_{\tau_i}-\sqrt{1-\alpha_{\tau_i}}\,\epsilon_\theta^{(\tau_i)}(x_{\tau_i})}{\sqrt{\alpha_{\tau_i}}}\right)
+\sqrt{1-\alpha_{\tau_{i-1}}-\sigma_{\tau_i}(\eta)^2}\ \epsilon_\theta^{(\tau_i)}(x_{\tau_i})
+\sigma_{\tau_i}(\eta)\epsilon
$$

### 3.6 ODE 视角

把式 (12) 重排（论文式 (13)）：

$$
\frac{x_{t-\Delta t}}{\sqrt{\alpha_{t-\Delta t}}}
=\frac{x_t}{\sqrt{\alpha_t}}
+\left(\sqrt{\frac{1-\alpha_{t-\Delta t}}{\alpha_{t-\Delta t}}}-\sqrt{\frac{1-\alpha_t}{\alpha_t}}\right)\epsilon_\theta^{(t)}(x_t)
$$

用 $\sigma:=\sqrt{(1-\alpha)/\alpha}$、$\bar x:=x/\sqrt{\alpha}$ 重参数化后，这就是下面这个 ODE 的 Euler 步（论文式 (14)）：

$$
d\bar x(t)=\epsilon_\theta^{(t)}\!\left(\frac{\bar x(t)}{\sqrt{\sigma^2+1}}\right)d\sigma(t)
$$

命题 1 说它与 Score-SDE 里 VE-SDE 的概率流 ODE 等价；但两者的 Euler 步不同：DDIM 对 $d\sigma(t)$ 取步，Score-SDE 对 $dt$ 取步（式 (15)），步数少时结果会有差别。这解释了为什么同一族模型在不同实现里少步采样质量不同。

**时间方向与符号**：采样时 $t$ 从 $T$ 递减到 $0$，累计信号系数 $\alpha_t$ 递增、$\sigma(t)=\sqrt{(1-\alpha_t)/\alpha_t}$ 递减。式 (14) 是从 $t=T$ 往 $t=0$ 积分；反过来从 $0$ 积到 $T$ 就是编码（$x_0\mapsto x_T$），这也是 5.4 节能做重建的原因。

### 3.7 数据流（一次采样）

1. 取训练好的 DDPM 网络 $\epsilon_\theta$ 与 $\beta_{1:T}$，算 $\alpha_t$。
2. 选 $S$ 与 $\tau$（线性或二次），令 NFE $=S$。
3. 抽 $x_T\sim\mathcal{N}(0,I)$。
4. 对 $\tau$ 逆序的每个时刻，用式 (12)（或附录 D.3 的加速式）算 $x_{\tau_{i-1}}$；$\eta=0$ 时不抽噪声。
5. 得到 $x_0$。若要做插值，就在两个 $x_T$ 之间线性插值后再走同一条确定链。

## 4. 实验与证据

**设置**：所有数据集都用 $T=1000$、$\gamma=1$ 训练的模型，**训练过程零改动**；只改 $\tau$ 与 $\sigma$。CIFAR10、LSUN Bedroom/Church 直接用 DDPM 作者的预训练模型，CelebA 64×64 是作者自己训的（因为 DDPM 没放这个检查点），CelebA 用原始 CelebA（不是 CelebA-HQ），预处理沿用 StyleGAN 仓库。

**表 1（FID，CIFAR10 32×32 / CelebA 64×64，按步数 $S$ 与 $\eta$）**：

| $\eta$ | CIFAR10 $S$=10 | 20 | 50 | 100 | 1000 | CelebA $S$=10 | 20 | 50 | 100 | 1000 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.0（DDIM） | 13.36 | 6.84 | 4.67 | 4.16 | **4.04** | 17.33 | 13.73 | 9.17 | 6.53 | **3.51** |
| 0.2 | 14.04 | 7.11 | 4.77 | 4.25 | 4.09 | 17.66 | 14.11 | 9.51 | 6.79 | 3.64 |
| 0.5 | 16.66 | 8.35 | 5.25 | 4.46 | 4.29 | 19.86 | 16.06 | 11.01 | 8.09 | 4.28 |
| 1.0（DDPM） | 41.07 | 18.36 | 8.01 | 5.78 | 4.73 | 33.12 | 26.03 | 18.48 | 13.93 | 5.98 |
| $\hat\sigma$（更大方差的 DDPM） | 367.43 | 133.37 | 32.72 | 9.99 | 3.17 | 299.71 | 183.83 | 71.71 | 45.20 | 3.26 |

读法要点：

- 步数少时 $\eta=0$ 明显最好（CIFAR10 10 步：13.36 对 41.07 对 367.43）。
- 步数补到 1000 时，$\hat\sigma$ 反而最好（3.17，就是 DDPM 论文报的数），DDIM 是 4.04，略差。所以“DDIM 全面更好”是错的，正确说法是“少步时更好，满步时略差”。
- $\hat\sigma$ 在少步时崩掉，论文的解释是它更随机，短轨迹下扰动更大，而 FID 对这类扰动敏感。

**表 3（LSUN 256×256，FID）**：Bedroom 上 DDIM（$\eta=0$）在 10/20/50/100 步是 16.95/8.89/6.75/6.62，DDPM（$\eta=1$）是 42.78/22.77/10.81/6.81；Church 上 DDIM 19.45/12.47/10.84/10.58，DDPM 51.56/23.37/11.16/8.27。1000 步 DDPM 的参考值是 Bedroom 6.36、Church 7.89（DDPM 论文表 3）。注意 Church 100 步时 DDPM 的 8.27 已经接近 DDIM 的 10.58，说明“少步优势”依数据集而变。

**表 2（CIFAR10 测试集重建误差，逐维 MSE，缩放到 [0,1]）**：$S$=10/20/50/100/200/500/1000 对应 0.014/0.0065/0.0023/0.0009/0.0004/0.0001/0.0001。这是“编码到 $x_T$ 再解码回来”的误差，DDPM 因为随机性做不到这件事。

**速度**：摘要说墙钟时间快 10× 到 50×；第 5 节开头写的是“10× 到 100× 的加速”；5.1 节的具体说法是“20 到 100 步就能达到 1000 步模型的质量，即 10× 到 50× 加速”。这三处口径不完全一致，引用时建议用摘要的 10×–50×（墙钟），并注明 100× 对应的是步数降到 10 的极端设置。

**NFE 与检查点**：表 1/3 的每一列就是一个 NFE（$S$），没有额外引导或分类器。论文正文没有写 FID 用了多少张生成样本；仓库的 `runners/diffusion.py` 里 `sample_fid` 固定 `total_n_samples = 50000`，所以“5 万样本”是代码事实，不是论文声明。CIFAR10/LSUN 的权重来自 DDPM 作者，CelebA 是本文作者新训的，所以“同一模型”这句话对 CIFAR10/LSUN 成立，对 CelebA 不成立。

## 5. 复现入口与首个验证

**官方仓库**：`https://github.com/ermongroup/ddim`（README 注明在 PyTorch 1.6 上测过）。实际读到的文件与结论：

- `functions/denoising.py` 的 `generalized_steps` 就是式 (12) 的实现：
  `c1 = eta * sqrt((1 - at/at_next) * (1 - at_next) / (1 - at))`、`c2 = sqrt((1 - at_next) - c1**2)`、`xt_next = sqrt(at_next) * x0_t + c1 * randn_like(x) + c2 * et`。这里 `at_next` 就是 $\alpha_{t-1}$，`c1` 就是 $\sigma$，`c2` 就是 $\sqrt{1-\alpha_{t-1}-\sigma^2}$。**$\eta=0$ 时 `c1=0`，随机项直接消失**，这就是确定性的代码级证据。
- 同一文件里 `ddpm_steps` 是另一条路径：方差取 `logvar = beta_t.log()`，并且对 `x0_from_e` 做了 `clamp(-1,1)`；`generalized_steps` 不做这个 clamp。两条路径的数值差异有一部分来自这里，不只是 $\eta$。
- `runners/diffusion.py` 的 `sample_image`：`--skip_type uniform` 用 `range(0, T, T//timesteps)`，`--skip_type quad` 用 `(linspace(0, sqrt(T*0.8), timesteps))**2`。这就是附录 D.2 的两种 $\tau$。
- `main.py` 默认值：`--sample_type generalized`、`--skip_type uniform`、`--timesteps 1000`、`--eta 0.0`。也就是说**默认就跑 DDIM**，想跑 DDPM 要显式 `--eta 1` 或 `--sample_type ddpm_noisy`。
- `configs/cifar10.yml`：`var_type: fixedlarge`、`beta_schedule: linear`、`beta_start: 0.0001`、`beta_end: 0.02`、`num_diffusion_timesteps: 1000`、`ch: 128`、`ch_mult: [1,2,2,2]`、`attn_resolutions: [16]`、`dropout: 0.1`、`ema_rate: 0.9999`。与 DDPM 论文设置一致。

**权重与数据**：`--use_pretrained` 会按数据集名从 `functions/ckpt_util.py` 里的固定 URL 下载（heibox 链接，CIFAR10/LSUN 各有权重与 EMA 两版）；CelebA 64×64 的权重在 README 里给的是 Google Drive 链接。CIFAR10 通过 `torchvision` 的 `CIFAR10` 加载（`datasets/` 下），LSUN 需要自己准备。仓库没有校验和，也没有版本锁定。

**依赖**：`torch`、`torchvision`、`numpy`、`PyYAML`、`scipy`、`tqdm`、`tensorboard`（`requirements.txt` 与 import 一致）。没有 `setup.py`，直接 `python main.py`。

**首个机制验证（不需要训练，约 15 分钟）**：验证“$\eta=0$ 是确定映射，且与式 (12) 一致”。

1. 用 `--use_pretrained` 拿 CIFAR10 权重（或随便一个小 U-Net 占位），固定 `torch.manual_seed`，抽一个 $x_T$。
2. 用 `--timesteps 50 --eta 0` 跑两次同一个 $x_T$。两次输出应逐元素完全相同（`torch.equal` 为真）。若不等，说明代码里还有别的随机源。
3. 用 `--eta 1` 跑两次，输出应不同。这检验“$\eta$ 控制随机性”这件事本身。
4. 手写式 (12) 与 `generalized_steps` 对同一 $(x_t,t)$ 的单步结果比较，差应 $\lesssim10^{-6}$。这一步检验系数推导，不依赖模型质量。
5. 再用 `--timesteps 1000 --eta 0` 与 `--timesteps 20 --eta 0` 从同一 $x_T$ 生成，肉眼比较高层特征是否一致（论文 5.2 节的现象）。这是定性检查，不要当成定量复现。

## 6. 前后关联

- **直接前驱**：[DDPM](02-ddpm.md)。本篇不改它的训练目标，只改采样；读的时候要盯住“$L_\gamma$ 只依赖边缘”这一句，否则会觉得“换联合分布还能不重训”很可疑。
- **同一时期的连续化**：[Score-SDE](04-score-sde.md)。命题 1 说 DDIM 的 ODE 是 VE-SDE 概率流 ODE 的特例；两篇的 Euler 步分别对 $d\sigma$ 与 $dt$ 取，这是少步差异的来源。
- **设计空间重排**：[EDM](05-edm.md) 把“预条件 + 采样器 + 噪声 schedule”拆开，其中 deterministic sampler 的讨论直接继承本篇的 ODE 视角。
- **一步/少步路线的分叉**：[Consistency Models](10-consistency-models.md) 追求一步生成；本篇是“少步但仍迭代”，两者目标不同，不要混为“蒸馏”。
- **潜空间使用**：DDIM 的编码/插值能力被 [LDM](06-ldm.md) 一类工作用作潜空间操作的接口。
- **回到像素的对照**：[JiT](01-jit.md) 讨论输出空间（预测干净数据 vs 预测噪声），与本篇式 (9) 的 $\hat x_0$ 换算相关。

## 7. 局限与可检验问题

**论文自己承认的局限**：加速仍然以质量换速度，且“$\eta=0$ 严格不在定理 1 的覆盖范围内，只能用很小的 $\sigma_t$ 逼近”（脚注 5）；少步时 FID 仍明显高于满步；没有给出 $S$ 的最优选择规则，只给了线性/二次两种经验取法；插值与重建的“压缩质量”不是本文关注点（脚注 7）。

**这份笔记额外指出的一点**：论文第 5 节开头写“10× 到 100×”，摘要与 5.1 节写“10× 到 50×”。这不是笔误可以忽略的差别：前者对应“步数从 1000 降到 10”，后者对应“质量相当的 20–100 步”。引用加速比时必须带上“在什么质量口径下”。

**两个小问题（均为未验证设想）**：

1. **$\tau$ 的取法能否按信噪比而不是按索引均匀？** 论文只在索引上做线性/二次划分，而不同 $t$ 的 $\bar\alpha_t$ 变化率差别很大。可检验做法：固定 $S=20$、$\eta=0$、同一 CIFAR10 权重，比较三种 $\tau$（线性、二次、按 $\bar\alpha_t$ 等间隔）的 FID。这是纯采样实验，不需要训练。
2. **$\eta$ 是否应该随 $t$ 变化？** 表 1 显示 $\eta=0$ 在少步时最好、$\hat\sigma$ 在满步时最好，提示“随机性需求随时间不同”。可检验做法：令 $\eta_t=\eta_{\max}\cdot t/T$（前期确定、后期加噪）或反向，扫两三个 $\eta_{\max}$，看少步 FID 是否低于固定 $\eta$。同样不需要重训。

## 来源与版本

- 论文：[arXiv:2010.02502v2](https://arxiv.org/abs/2010.02502v2)（2021-11-04；PDF 页眉为 ICLR 2021）。本页核对的是这一版的摘要、第 2–7 节、附录 B–D、表 1–3、图 1–10。arXiv 当前最新为 v4（2022-10-05），摘要措辞与 v2 不同，见上文“版本提醒”。
- 官方代码：[ermongroup/ddim](https://github.com/ermongroup/ddim)，commit `e8df66cf02e457719930748b5c26e37e3126dfdd`（2024-07-26）。读过的文件：`README.md`、`main.py`、`configs/cifar10.yml`、`functions/denoising.py`、`functions/ckpt_util.py`、`runners/diffusion.py`。
- 图：`/papers/diffusion/03-ddim-pipeline.png`，从上述 v2 PDF 第 2 页 Figure 1 区域渲染裁出（PyMuPDF 1.28.2，6× 缩放），未重绘。
- 未做的事：没有下载任何检查点，没有运行采样或 FID 评估，没有复现表 1–3 的任何数字；没有验证 heibox / Google Drive 链接当前是否可下载。
