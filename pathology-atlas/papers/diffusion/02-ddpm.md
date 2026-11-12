# 02｜DDPM：把“逐步加噪再逐步去噪”写成一个可训练的下界

**论文**：Denoising Diffusion Probabilistic Models
**作者**：Jonathan Ho、Ajay Jain、Pieter Abbeel（UC Berkeley）
**会刊**：NeurIPS 2020（arXiv:2006.11239v2，2020-12-16）
**定位**：扩散模型的现代基线；固定前向马尔可夫链 + 学习反向高斯转移；ε 参数化与简化损失
**精读状态**：已核对 arXiv v2 全文（正文、附录 A–D、表 1–4、算法 1–2）与官方仓库 `hojonathanho/diffusion`（commit `1e0dceb`，2020-06-21）的相关源码
**实验声明**：本篇笔记没有训练、微调或采样任何模型，也没有复现表中的 FID/IS/NLL；所有数字均来自论文表格，代码结论来自阅读源码。

## 原文摘要

> We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by considerations from nonequilibrium thermodynamics. Our best results are obtained by training on a weighted variational bound designed according to a novel connection between diffusion probabilistic models and denoising score matching with Langevin dynamics, and our models naturally admit a progressive lossy decompression scheme that can be interpreted as a generalization of autoregressive decoding. On the unconditional CIFAR10 dataset, we obtain an Inception score of 9.46 and a state-of-the-art FID score of 3.17. On 256x256 LSUN, we obtain sample quality similar to ProgressiveGAN. Our implementation is available at https://github.com/hojonathanho/diffusion.

*来源：arXiv:2006.11239v2 第 1 页摘要（NeurIPS 2020 相机版）。逐字复制，仅去掉 PDF 换行与断词连字符；未改写、未压缩。*

## 中文摘要

> 我们给出使用扩散概率模型的高质量图像合成结果。扩散概率模型是一类受非平衡热力学启发的潜变量模型。我们的最佳结果来自训练一个加权变分下界；这个下界依据扩散概率模型与带 Langevin 动力学的去噪分数匹配之间的一个新联系而设计。同时，我们的模型天然允许一种渐进的、有损的解压方案，它可以被解释为自回归解码的推广。在无条件 CIFAR10 数据集上，我们得到 9.46 的 Inception 分数与 3.17 的当前最优 FID 分数。在 256×256 的 LSUN 上，我们得到的样本质量与 ProgressiveGAN 相近。实现见 https://github.com/hojonathanho/diffusion 。

*译文：与上方英文摘要逐句对应，未增删内容。数字、数据集名与链接保持原样。*

## 论文框架原图

![DDPM 论文图 2：有向图模型](/papers/diffusion/02-ddpm-pipeline.png)

> **原文图注**：Figure 2: The directed graphical model considered in this work.

*图源：arXiv:2006.11239v2 第 2 页 Figure 2，用 PyMuPDF 从官方 PDF 页面区域裁出（未重绘、未描摹）。读图时注意两条箭头方向相反：**实线箭头**是从 $\mathbf{x}_t$ 指向 $\mathbf{x}_{t-1}$ 的学习出来的反向转移 $p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t)$；**虚线箭头**是从 $\mathbf{x}_{t-1}$ 指回 $\mathbf{x}_t$ 的固定前向加噪 $q(\mathbf{x}_t|\mathbf{x}_{t-1})$。整条链在图上从右往左读是 $t$ 递增（加噪），从左往右读是 $t$ 递减（去噪）。$\mathbf{x}_T$ 旁的噪点图与 $\mathbf{x}_0$ 旁的人脸图表示两端分别是纯噪声与数据。*

## 0. 三分钟摘要

DDPM 把图像生成拆成许多小去噪步骤。训练时给真实图像加上已知噪声，让网络猜这份噪声；生成时从纯噪声出发，反复使用同一个网络得到图像。

## 它到底怎么做

1. 随机选一张真实图像和一个噪声级别，直接构造带噪图像。
2. 把带噪图像和噪声级别送给 U-Net，训练它预测加入的噪声。
3. 生成时从高斯噪声开始，用预测噪声计算下一步的去噪更新。
4. 重复反向更新，直到得到图像；训练抽一个级别，采样则走完整条反向链。

### 实验先看什么

- 对照同一架构下不同训练目标的 FID 与似然，不把两个指标的改善混为一谈。
- 分清 CIFAR-10 与高分辨率 LSUN 的模型、批量大小和采样时间。

## 1. 问题与核心判断

**问题**：无条件图像生成。输入是一批图像 $x_0 \in [-1,1]^D$（论文把 0–255 的整数线性缩放到 $[-1,1]$），输出是一个可以从纯高斯噪声采样的生成分布 $p_\theta(x_0)$。训练不需要标签，也不需要判别器。

**此前的瓶颈**：论文的原话是，扩散模型“定义简单、训练高效”，但“据我们所知，此前没有任何工作证明它们能生成高质量样本”。引言同时承认 GAN、自回归模型、流模型与 VAE 都已经能合成很出色的图像和音频样本，所以这里的缺口不是“别的模型质量差”，而是“扩散这条路线还没被证明能打”。另一个被论文反复点明的张力是：扩散模型的似然打不过其他基于似然的模型，但样本质量可以更好——也就是说，它要赢的是样本质量这一项，不是似然。

**核心答案**：把反向过程写成高斯转移，均值不直接回归后验均值 $\tilde\mu_t$，而是让网络预测噪声 $\epsilon$；再把变分下界各项前面的时间权重丢掉，得到无权重的 $\|\epsilon-\epsilon_\theta\|^2$。这一步既让训练目标变成多噪声尺度的去噪分数匹配，又让样本质量从 FID 13.51 降到 3.17（表 1、表 2）。

**一句话记住**：前向是“固定配方加噪”，反向是“学一个网络把每一步的噪声猜出来”，训练目标就是猜噪声的均方误差。

## 2. 术语（白话）

- **前向过程 / 扩散过程 $q$**：一个固定的马尔可夫链，每一步按 $\mathcal{N}(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_t I)$ 加一点高斯噪声。它没有可训练参数，作用是把数据逐步毁成噪声。
- **反向过程 $p_\theta$**：从 $x_T\sim\mathcal{N}(0,I)$ 出发，每一步用网络预测的均值与固定方差往回走一步，最终得到 $x_0$。这是被训练的部分。
- **$\beta_t$ 与 $\alpha_t,\bar\alpha_t$**：$\beta_t$ 是第 $t$ 步加的噪声方差；$\alpha_t:=1-\beta_t$，$\bar\alpha_t:=\prod_{s=1}^{t}\alpha_s$ 是“信号还剩多少”的累计系数。$\bar\alpha_t$ 越小，$x_t$ 越接近纯噪声。
- **变分下界（ELBO）**：$\log p_\theta(x_0)$ 的**下界**；取负号后才是负对数似然（NLL）的**上界**。这里它被拆成 $L_T$、$L_{t-1}$（$t>1$）与 $L_0$：前两者是高斯之间的 KL，$L_0=-\log p_\theta(x_0|x_1)$ 是重建项（离散解码器下的负对数似然），不是 KL。
- **后验 $q(x_{t-1}|x_t,x_0)$**：如果偷看真实 $x_0$，那么“上一步大概是什么”有闭式高斯解。它是训练时的监督信号，不是采样时能用的东西（采样时没有 $x_0$）。
- **$\epsilon$ 参数化**：不让网络直接输出均值，而让它输出“这一步混进去的噪声 $\epsilon$”，再用代数关系换回均值。论文的消融说明这是关键选择。
- **$L_{\text{simple}}$**：把变分下界每一项前面的 $\beta_t^2/(2\sigma_t^2\alpha_t(1-\bar\alpha_t))$ 权重全部设成 1 之后的目标。它不是严格的下界，但样本质量最好。
- **NFE（函数评估次数）**：采样时网络被调用多少次。DDPM 的 NFE 等于扩散步数 $T$，论文里是 1000。

## 3. 核心方法与数据流

### 3.1 前向：固定配方，且能一步跳到任意 $t$

前向链定义为（论文式 (2)）：

$$
q(x_{1:T}\mid x_0):=\prod_{t=1}^{T}q(x_t\mid x_{t-1}),\qquad
q(x_t\mid x_{t-1}):=\mathcal{N}\!\left(x_t;\sqrt{1-\beta_t}\,x_{t-1},\ \beta_t I\right)
$$

关键性质是它可以闭式跳步（论文式 (4)）：

$$
q(x_t\mid x_0)=\mathcal{N}\!\left(x_t;\sqrt{\bar\alpha_t}\,x_0,\ (1-\bar\alpha_t)I\right)
\quad\Longleftrightarrow\quad
x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\epsilon,\ \ \epsilon\sim\mathcal{N}(0,I)
$$

这条式子决定了训练可以随机抽一个 $t$ 就立刻造出 $x_t$，不必真的跑 $t$ 步。它是整个方法“训练高效”的来源。

### 3.2 反向：高斯转移 + 固定方差

反向联合分布（论文式 (1)）：

$$
p_\theta(x_{0:T}):=p(x_T)\prod_{t=1}^{T}p_\theta(x_{t-1}\mid x_t),\qquad
p_\theta(x_{t-1}\mid x_t):=\mathcal{N}\!\left(x_{t-1};\mu_\theta(x_t,t),\ \Sigma_\theta(x_t,t)\right)
$$

论文把 $\Sigma_\theta$ 固定成不训练的时间常数 $\sigma_t^2 I$，并说明 $\sigma_t^2=\beta_t$ 与 $\sigma_t^2=\tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t$ 效果相近：前者对应 $x_0\sim\mathcal{N}(0,I)$ 时的最优，后者对应 $x_0$ 退化为一个确定点时最优，两者是反向过程熵的上界与下界。

### 3.3 变分下界拆成可算的项

把 ELBO 按时间拆开（论文式 (5)）。注意左边是 NLL 的期望，右边三层都在同一个 $\mathbb{E}_{q}$ 里面：

$$
\mathbb{E}_{q}\left[-\log p_\theta(x_0)\right]
\le
\mathbb{E}_{q}\Big[
\underbrace{D_{\mathrm{KL}}\!\left(q(x_T|x_0)\,\|\,p(x_T)\right)}_{L_T}
+\sum_{t>1}\underbrace{D_{\mathrm{KL}}\!\left(q(x_{t-1}|x_t,x_0)\,\|\,p_\theta(x_{t-1}|x_t)\right)}_{L_{t-1}}
+\underbrace{\left(-\log p_\theta(x_0|x_1)\right)}_{L_0}
\Big]
$$

因为 $q(x_{t-1}|x_t,x_0)$ 有闭式（论文式 (6)(7)）：

$$
q(x_{t-1}\mid x_t,x_0)=\mathcal{N}\!\left(x_{t-1};\tilde\mu_t(x_t,x_0),\tilde\beta_t I\right),\qquad
\tilde\mu_t(x_t,x_0):=\frac{\sqrt{\bar\alpha_{t-1}}\beta_t}{1-\bar\alpha_t}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}x_t
$$

所以每个 $L_{t-1}$ 都是两个高斯之间的 KL，可以解析算，不需要高方差蒙特卡洛。$L_T$ 因为前向方差固定而成为常数，训练时直接丢掉。

### 3.4 反向均值：从“回归 $\tilde\mu$”改成“预测 $\epsilon$”

把 $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon$ 代进式 (8)，论文得到式 (10)，并读出“$\mu_\theta$ 必须预测 $\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\epsilon\right)$”。于是取（论文式 (11)）：

$$
\mu_\theta(x_t,t)=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\epsilon_\theta(x_t,t)\right)
$$

代回后 $L_{t-1}$ 变成（论文式 (12)）：

$$
L_{t-1}=\mathbb{E}_{x_0,\epsilon}\left[\frac{\beta_t^2}{2\sigma_t^2\alpha_t(1-\bar\alpha_t)}
\left\|\epsilon-\epsilon_\theta\!\left(\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon,\ t\right)\right\|^2\right]
$$

这一步是全文的技术核心：它同时说明 (i) 训练目标形如多噪声尺度的去噪分数匹配；(ii) 采样式 $\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\epsilon_\theta\right)+\sigma_t z$ 形如以 $\epsilon_\theta$ 为学习到的密度的 Langevin 动力学。

### 3.5 简化损失与两个算法

丢掉式 (12) 的权重，得到（论文式 (14)）：

$$
L_{\text{simple}}(\theta):=\mathbb{E}_{t,x_0,\epsilon}\left[\left\|\epsilon-\epsilon_\theta\!\left(\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon,\ t\right)\right\|^2\right],\qquad t\sim\mathrm{Uniform}\{1,\dots,T\}
$$

论文的解释是：这套 $\beta_t$ 设置让 $L_{\text{simple}}$ 相对真实下界**压低小 $t$ 的权重**，而小 $t$ 对应“几乎没噪声”的容易任务，把权重让给大 $t$ 的困难去噪反而提升样本质量。注意这不是“更好的下界”，而是“更有用的训练信号”。

训练与采样（论文算法 1、2）按顺序是：

1. 取一批 $x_0$，均匀抽 $t\in\{1,\dots,T\}$，抽 $\epsilon\sim\mathcal{N}(0,I)$。
2. 造 $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon$，让网络输出 $\epsilon_\theta(x_t,t)$。
3. 对 $\|\epsilon-\epsilon_\theta\|^2$ 做一步梯度下降。
4. 采样时从 $x_T\sim\mathcal{N}(0,I)$ 开始，对 $t=T,\dots,1$ 依次算
   $x_{t-1}=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{1-\alpha_t}{\sqrt{1-\bar\alpha_t}}\epsilon_\theta(x_t,t)\right)+\sigma_t z$，其中 $t>1$ 时 $z\sim\mathcal{N}(0,I)$，$t=1$ 时 $z=0$。
5. 输出 $x_0$。整条链的 NFE 等于 $T$，没有引导、没有额外分类器。

**时间方向与符号**：$t$ 从 $T$（噪声）走向 $0$（数据）；加噪用 $\sqrt{1-\beta_t}$ 缩小信号、$\sqrt{\beta_t}$ 加噪声；去噪式子里的系数 $1/\sqrt{\alpha_t}>1$ 是放大，减号后面才是减掉预测噪声。$t=1$ 时不加噪声，是因为最后一步要落到干净样本而不是再抖一次。

## 4. 实验与证据

设置（正文第 4 节 + 附录 B）：$T=1000$，$\beta_1=10^{-4}$ 线性增到 $\beta_T=0.02$；U-Net 主干（PixelCNN++ 风格、GroupNorm、每个分辨率 2 个残差块、16×16 处自注意力、时间用 Transformer 正弦位置嵌入）；CIFAR10 模型 35.7M 参数，LSUN/CelebA-HQ 模型 114M；TPU v3-8。速度按附录 B 原文：CIFAR 以 batch 128 训练、21 步/秒，跑到 800k 步约 10.6 小时，**采样一个 batch 256 张 32×32 图用 17 秒**；CelebA-HQ/LSUN 的 256² 模型以 batch 64 训练、2.2 步/秒，**采样一个 batch 128 张用 300 秒**。

**表 1（CIFAR10，无条件）**：`Ours (L_simple)` 得 IS $9.46\pm0.11$、FID $3.17$、NLL $\le3.75$（train 3.72）bits/dim；同一架构、改用真实下界训练的 `Ours (L, fixed isotropic Σ)` 是 IS $7.67\pm0.13$、FID $13.51$、NLL $\le3.70$（train 3.69）。两者是不同训练目标得到的两个模型，不是同一个检查点换评估。也就是说，简化损失牺牲了似然（3.70→3.75），换来 FID 从 13.51 到 3.17。论文还说明 FID 按惯例对训练集算，对测试集算是 5.24。

**表 2（CIFAR10 消融，同一数据/分辨率/无条件）**：

| 目标函数 | 反向参数化 | IS | FID |
|---|---|---:|---:|
| $L$，学习对角 $\Sigma$ | $\tilde\mu$ 预测 | $7.28\pm0.10$ | 23.69 |
| $L$，固定各向同性 $\Sigma$ | $\tilde\mu$ 预测 | $8.06\pm0.09$ | 13.22 |
| $L$，固定各向同性 $\Sigma$ | $\epsilon$ 预测 | $7.67\pm0.13$ | 13.51 |
| $\|\tilde\epsilon-\epsilon_\theta\|^2$（$L_{\text{simple}}$） | $\epsilon$ 预测 | $9.46\pm0.11$ | **3.17** |

空白项在论文里是“训练不稳定、样本分数越界”，不是没跑。**关于最后一行标签**：表 2 在 PDF 里印的是 $\|\tilde\epsilon-\epsilon_\theta\|^2$（$\epsilon$ 上有一个波浪号），而正文式 (14) 印的是 $\|\epsilon-\epsilon_\theta\|^2$。两处指同一个 $L_{\text{simple}}$，本页按表 2 原样保留标签、不代为改写；引用该行时建议直接写“$L_{\text{simple}}$（式 (14)）”，避免波浪号引起歧义。结论是：$\tilde\mu$ 预测只在真实下界下能用；一旦换成无权重的均方误差，$\epsilon$ 预测明显更好；学习方差反而不稳。

**表 3（LSUN 256×256，FID，$L_{\text{simple}}$）**：Bedroom 6.36（大模型 4.90）、Church 7.89、Cat 19.75。同表的 ProgressiveGAN 是 8.34/6.42/37.52，StyleGAN 是 2.65/4.21/8.53，StyleGAN2 只报了 Church 3.86 与 Cat 6.93（Bedroom 为 “-”）。所以准确说法是：对 ProgressiveGAN 在三个数据集上都不差（Cat 明显更好），但离 StyleGAN/StyleGAN2 仍有距离。摘要的“与 ProgressiveGAN 相近”就是这个口径，不是“超过 GAN”。

**表 4（CIFAR10 测试集，率失真）**：反向步数 1000 时 rate 1.77581 bits/dim、distortion 0.95136（RMSE，0–255 尺度）；900 步时 rate 降到 0.11994、distortion 升到 12.02277。论文据此说“超过一半的无损码长在描述不可察觉的细节”。

**NFE 与检查点**：表 1/2/3 的样本都用 $T=1000$ 的完整反向链（NFE=1000）生成；没有引导尺度、没有分类器自由引导，因为这里是无条件模型。表 1 的 FID 取训练过程中最好的那个检查点，不是最后一个。

## 5. 复现入口与首个验证

**官方仓库**：`https://github.com/hojonathanho/diffusion`（TensorFlow 1.15 + Python 3.5，按 README）。实际读到的文件与结论：

- `scripts/run_cifar.py`：默认超参就写在 `get_default_configs` 里——`num_diffusion_timesteps=1000`、`beta_start=0.0001`、`beta_end=0.02`、`beta_schedule='linear'`、`model_mean_type='eps'`、`model_var_type='fixedlarge'`、`loss_type='mse'`。这正好对应论文的 $\epsilon$ 参数化 + $L_{\text{simple}}$。
- `diffusion_tf/diffusion_utils_2.py`：`p_losses` 里就是 `tf.squared_difference(noise, x_recon)` 的 `meanflat`；`p_mean_variance` 用 `_predict_xstart_from_eps` 先反推 $\hat x_0$，再调 `q_posterior_mean_variance` 得均值；`p_sample` 里 `nonzero_mask` 保证 $t=0$ 不加噪声。这与算法 2 逐行对应。
- **一个容易读错的细节**：论文正文说 $\sigma_t^2=\beta_t$ 与 $\tilde\beta_t$ 效果相近，但代码默认 `model_var_type='fixedlarge'`，取的是 `self.betas`（即 $\beta_t$），而 `fixedsmall` 才取 `posterior_variance`（即 $\tilde\beta_t$）。复现时看到的是前者。
- `diffusion_tf/diffusion_utils.py` 是较早的一版（只有 `noisepred`，`p_sample` 直接算），`scripts/*` 实际 import 的是 `diffusion_utils_2`。读代码时不要拿错文件。

**数据与权重**：CIFAR10/CelebA-HQ 通过 TensorFlow Datasets 加载，LSUN 用 StyleGAN 仓库的预处理；脚本默认把数据与实验写进 GCS bucket（`--bucket_name_prefix`），不是本地路径。预训练模型与样本只给了 Dropbox 文件夹链接（README），没有脚本化下载，也没有校验和。所以“跑通论文数字”不是一条命令能完成的事。

**依赖与算力**：README 要求 TF 1.15；`requirements.txt` 是 2020 年的完整固定版本清单（含 `tensorflow-probability==0.8`、`tensorflow-gan==0.0.0.dev0`、`tensorflow-datasets==2.1.0`）。论文用 TPU v3-8，并注明“类似 8 张 V100”。用现代 GPU 直接跑这份 TF1 代码需要容器化旧环境。

**首个机制验证（不需要训练，约 10 分钟）**：验证式 (4) 与式 (7) 的代数一致性，这是整篇论文所有推导的地基。

1. 取 $T=1000$、线性 $\beta$，算出 $\alpha_t,\bar\alpha_t$。
2. 检验式 (4) 与逐步加噪链**在分布上**等价，有两种做法，任选其一：
   - **耦合实现（推荐，逐元素精确）**：从 $x_0$ 逐步走 $t$ 步，把每步抽到的 $z_s\sim\mathcal{N}(0,I)$ 都存下来；按
     $\epsilon_{\text{cpl}}:=\dfrac{1}{\sqrt{1-\bar\alpha_t}}\sum_{s=1}^{t}\sqrt{\bar\alpha_t/\bar\alpha_s}\sqrt{1-\alpha_s}\,z_s$
     合成一个 $\epsilon_{\text{cpl}}$（它恰好服从 $\mathcal{N}(0,I)$，因为 $\sum_{s=1}^{t}(\bar\alpha_t/\bar\alpha_s)(1-\alpha_s)=1-\bar\alpha_t$），再算 $\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon_{\text{cpl}}$。它应与链末端的 $x_t$ 在浮点误差内相同（$\lesssim10^{-5}$）。
   - **统计检验**：分别用 `q_sample` 与逐步链各抽 $N=10^4$ 个 $x_t$，比较样本均值与协方差。两者都应收敛到 $(\sqrt{\bar\alpha_t}x_0,\ (1-\bar\alpha_t)I)$，容差按 $O(1/\sqrt{N})$ 取（例如均值差 $\lesssim3\sqrt{(1-\bar\alpha_t)/N}$）。**不能**把两次独立抽样直接逐元素比较——它们只是同分布，不是同一个样本。
3. 取同一组 $(x_0,x_t,t)$，用 `q_posterior` 算 $\tilde\mu_t$，与式 (7) 的闭式手算比较。
4. 把网络换成“oracle”：$\epsilon_\theta(x_t,t):=(x_t-\sqrt{\bar\alpha_t}x_0)/\sqrt{1-\bar\alpha_t}$，跑算法 2（$\sigma_t=0$ 版本）。$x_0$ 应被精确还原到浮点误差。这一步检验的是采样式与参数化的互逆关系，不是模型质量。

如果第 2 步就对不上，先查 $\bar\alpha$ 是累积乘积还是单步 $\alpha_t$——这是复现这份代码最常见的错；如果耦合版对得上而统计版对不上，先查是不是把两次独立抽样当成同一个样本比了。

## 6. 前后关联

- **直接后继**：[DDIM](03-ddim.md) 保留同一个训练目标，只改采样过程，把 1000 步压到 20–100 步，并让 $\eta=0$ 时采样变成确定映射。读完本篇再读 DDIM，重点是“为什么不用重训”。
- **连续时间化**：[Score-SDE](04-score-sde.md) 把这里的离散 $\beta_t$ 链取 $N\to\infty$ 的极限，得到 VP-SDE，并证明 DDPM 的 ancestral sampling 是该 SDE 反向过程的一种离散化。
- **设计空间重排**：[EDM](05-edm.md) 把噪声 schedule、预条件、采样器分开讨论；读它之前要先分清本篇的 $\beta_t$、$\bar\alpha_t$ 与 EDM 的 $\sigma(t)$ 不是同一套记号。
- **回到像素的极简版**：[JiT](01-jit.md) 讨论“预测干净数据 vs 预测噪声”，正好是本篇 3.4 节那个选择的现代回响。
- **潜空间版本**：[LDM](06-ldm.md) 把这里的像素空间扩散搬到自编码器潜空间，训练目标仍是本篇的 $\epsilon$ 回归。

## 7. 局限与可检验问题

**论文自己承认的局限**：无损码长打不过自回归/流模型（CIFAR10 $\le3.75$ bits/dim 对 PixelCNN 的 3.03）；采样必须走完 $T$ 步，NFE=1000；渐进压缩只是“解释”，依赖最小随机编码，对高维数据不可行（附录“Progressive compression”明确说这只是概念验证）。

**这份笔记额外指出的一点**：表 1 里 `Ours (L)` 与 `Ours (L_simple)` 的 NLL 只差 0.05 bits/dim，但 FID 差 4 倍多。这说明“似然更好”与“样本更好”在这个模型族里不是同一个轴，引用时不要把 FID 3.17 说成“更好的似然”。

**两个小问题（均为未验证设想，不是论文结论）**：

1. **$\sigma_t$ 的选择能否按 $t$ 分段而不是全局二选一？** 论文只在 $\beta_t$ 与 $\tilde\beta_t$ 两个端点比较，并说“similar results”。可检验做法：固定同一个训练好的 CIFAR10 检查点，只改采样方差为 $\sigma_t^2=\lambda\beta_t+(1-\lambda)\tilde\beta_t$，扫 $\lambda\in\{0,0.25,0.5,0.75,1\}$，看 FID 是否在中间取值更好。这不需要重训，成本是 5 次采样。
2. **$L_{\text{simple}}$ 丢掉权重后，小 $t$ 的梯度是否真的“没用”？** 论文的解释是“小 $t$ 任务容易，压低权重有益”。可检验做法：记录每个 $t$ 分桶的损失与梯度范数，比较 $t\in[1,100]$ 与 $t\in[900,1000]$ 两桶在训练前后的下降幅度；如果小 $t$ 桶早已饱和，论文的解释成立，否则需要另找原因。

## 来源与版本

- 论文：[arXiv:2006.11239v2](https://arxiv.org/abs/2006.11239v2)（2020-12-16；PDF 页眉为 NeurIPS 2020）。本页核对的是这一版的正文第 2–4 节、附录 A–D、表 1–4、算法 1–4。
- 官方代码：[hojonathanho/diffusion](https://github.com/hojonathanho/diffusion)，commit `1e0dceb3b3495bbe19116a5e1b3596cd0706c543`（2020-06-21）。读过的文件：`README.md`、`requirements.txt`、`scripts/run_cifar.py`、`diffusion_tf/diffusion_utils.py`、`diffusion_tf/diffusion_utils_2.py`。
- 图：`/papers/diffusion/02-ddpm-pipeline.png`，从上述 v2 PDF 第 2 页 Figure 2 区域渲染裁出（PyMuPDF 1.28.2，6× 缩放），未重绘。
- 未做的事：没有下载 Dropbox 上的预训练权重，没有运行训练或采样，没有复现任何 FID/IS/NLL 数字，也没有把论文的 TPU 结果换算成其他硬件的等价时间。
