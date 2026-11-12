# 10｜Consistency Models：把「同一条轨迹上的点」压到同一个答案

**论文**：Consistency Models  
**作者**：Yang Song、Prafulla Dhariwal、Mark Chen、Ilya Sutskever（OpenAI）  
**发表**：ICML 2023，PMLR 202:32211–32252  
**定位**：一步/少步生成；一致性蒸馏（CD）与独立一致性训练（CT）；零样本编辑  
**核验**：arXiv:2303.01469v2（2023-05-31，42 页，含 ICML 版权页）；PMLR 卷页取自 proceedings.mlr.press。本页只做文本与代码阅读，**未运行任何训练、采样或 FID 评测**。

| 项 | 内容 |
|---|---|
| 任务 | 无条件/类条件图像生成（CIFAR-10、ImageNet 64×64、LSUN 256×256）；零样本修复、上色、超分、插值 |
| 输入 / 输出 | 输入噪声 $x_T\sim\mathcal{N}(0,T^2I)$，输出数据估计 $x_\epsilon$；一次前向即可 |
| 关键对象 | 一致性函数 $f(x_t,t)=x_\epsilon$；自一致性 $f(x_t,t)=f(x_{t'},t')$ |
| 训练方式 | 蒸馏（有预训练扩散模型）或独立训练（不需要） |
| 代码 | `openai/consistency_models`（PyTorch，MIT）；CIFAR-10 另有 JAX 仓库 |

## 原文摘要

> Diffusion models have significantly advanced the fields of image, audio, and video generation, but they depend on an iterative sampling process that causes slow generation. To overcome this limitation, we propose consistency models, a new family of models that generate high quality samples by directly mapping noise to data. They support fast one-step generation by design, while still allowing multistep sampling to trade compute for sample quality. They also support zero-shot data editing, such as image inpainting, colorization, and super-resolution, without requiring explicit training on these tasks. Consistency models can be trained either by distilling pre-trained diffusion models, or as standalone generative models altogether. Through extensive experiments, we demonstrate that they outperform existing distillation techniques for diffusion models in one- and few-step sampling, achieving the new state-of-the-art FID of 3.55 on CIFAR-10 and 6.20 on ImageNet 64×64 for one-step generation. When trained in isolation, consistency models become a new family of generative models that can outperform existing one-step, non-adversarial generative models on standard benchmarks such as CIFAR-10, ImageNet 64×64 and LSUN 256×256.

*来源：arXiv:2303.01469v2 第 1 页。逐字复制，仅合并 PDF 换行；原文 PDF 中 "64 ˆ 64" 为乘号字形渲染问题，此处按实际字符写为 64×64。*

## 中文摘要

> 扩散模型显著推进了图像、音频与视频生成领域，但它们依赖迭代采样过程，导致生成缓慢。为克服这一限制，我们提出一致性模型（consistency models）：一类通过直接把噪声映射到数据来生成高质量样本的新模型族。它们在设计上支持快速的一步生成，同时仍允许多步采样以用算力换样本质量。它们还支持零样本数据编辑，例如图像修复、上色与超分辨率，而无需在这些任务上做显式训练。一致性模型既可以通过蒸馏预训练扩散模型来训练，也可以完全作为独立的生成模型来训练。通过大量实验，我们证明它们在一步与少步采样上优于现有的扩散模型蒸馏技术，在一步生成上取得新的最优 FID：CIFAR-10 上 3.55，ImageNet 64×64 上 6.20。当被独立训练时，一致性模型成为一类新的生成模型，在 CIFAR-10、ImageNet 64×64 与 LSUN 256×256 等标准基准上可以超过现有的一步、非对抗生成模型。

*译文：对应上方原文逐句对译，未增删内容。专有名词与数字以英文原文为准。*

## 论文框架图（原文 Figure 2）

![Consistency Models 的轨迹与映射](/papers/diffusion/10-consistency-models-pipeline.png)

> **Figure 2**：Consistency models are trained to map points on any trajectory of the PF ODE to the trajectory’s origin.

*图源：arXiv:2303.01469v2 第 3 页，用 PyMuPDF 从官方 PDF 按原区域渲染（4× 缩放），未重绘。*

**这张图在说什么。** 左边是数据（Data），右边是噪声（Noise），中间几条浅绿曲线是同一个概率流 ODE（PF ODE）的不同轨迹，每条从不同的数据点出发、在 $t=T$ 汇入噪声。红色箭头是模型 $f_\theta$ 在做的事：不管输入是轨迹上的哪个点——$(\mathbf{x}_t,t)$、$(\mathbf{x}_{t'},t')$ 还是终点 $(\mathbf{x}_T,T)$——都要求输出同一个起点 $\mathbf{x}_0$。图中三条红箭头都指向同一个 $(\mathbf{x}_0,0)$，这就是「自一致性」的字面含义。

注意图里画的是**映射到轨迹的数据端**，不是“去噪一步”。区别不在输出空间：EDM 的去噪器 $D(x;\sigma)$ 本来就输出干净数据估计，JiT 也直接预测 $x$。区别在映射的范围：去噪器在给定噪声水平估计干净数据，采样时逐步调用；$f_\theta$ 要把**同一条 PF 轨迹**上任意 $t$ 的点都映到同一个 $x_\epsilon$。这个跨 $t$ 的一致性要求才是参数化（边界条件）与训练目标的来源。

## 0. 三分钟摘要

一致性模型让同一概率流轨迹上的不同状态，都直接映射到同一个数据端结果。它可以蒸馏已有扩散模型，也可以独立训练；生成时用一次或少数几次映射替代长采样链。

## 它到底怎么做

1. 构造同一生成轨迹上两个相邻噪声状态。
2. 蒸馏时由教师模型提供相邻状态，独立训练时用真实数据和共享噪声构造。
3. 让两个状态的模型输出一致，并在数据端保留输入不变的边界条件。
4. 生成时直接映射到数据端；需要多步时，重新加噪再映射。

### 实验先看什么

- 一致性蒸馏与独立一致性训练是两套实验，不能混用其一步生成结果。
- 核对教师、距离度量、训练网格及采样时间点，网络调用次数按实际前向统计。

## 1. 问题与核心判断

**问题。** 扩散模型采样慢：要反复调用得分网络解 ODE/SDE，竞赛级质量通常要几十到上千次评估。已有的加速办法分两类：更快的数值求解器（仍然需要 >10 步才能有竞争力），以及蒸馏（把多步模型压成少步）。蒸馏里最接近本文的是渐进蒸馏（PD），它不需要预先造合成数据集，但要把步数反复折半、多轮训练；知识蒸馏与 DFNO 则要先从扩散模型采样出一个大合成数据集，成本高。

**这篇的答案。** 不学「一步去噪」，学「轨迹到原点的映射」。定义一致性函数 $f:(x_t,t)\mapsto x_\epsilon$，要求同一条 PF ODE 轨迹上的任意两点给出相同输出。训练时只需要构造轨迹上相邻的两点 $(x_{t_{n+1}},\hat x_{t_n})$，让模型在这两点上的输出一致。因为 $t=\epsilon$ 时输出必须等于输入（边界条件），平凡解 $f\equiv0$ 被排除。

**两种训练方式必须分开看。**

- **一致性蒸馏（CD）**：$\hat x_{t_n}$ 由**预训练扩散模型**的得分函数走一步 ODE 求解器得到。学生从教师初始化，教师固定。
- **一致性训练（CT）**：没有教师。用无偏得分估计 $\nabla\log p_t(x_t)=-\mathbb{E}[(x_t-x)/t^2\mid x_t]$ 替掉教师，$\hat x_{t_n}$ 直接用「加噪样本 + Euler 一步」构造。模型随机初始化，是独立的生成模型。

**成绩与边界。** 一步生成：CIFAR-10 FID 3.55、ImageNet 64×64 6.20（CD）；独立训练的 CT 在同设置下是 8.70 与 13.0。也就是说，「一步」这个卖点在 CD 上成立得很好，在 CT 上只是「可用」。这些数字都绑定具体配置（EDM 教师、LPIPS、Heun、$N=18$ 等），不能当成方法无关的常数。

## 2. 术语（先用白话）

- **PF ODE（概率流 ODE）**：与扩散 SDE 边缘分布相同的确定性 ODE。给定同一个起点，它给出唯一轨迹。
- **一致性函数**：把轨迹上任意时刻的点映到该轨迹的起点（$t=\epsilon$ 处的数据估计）。
- **自一致性**：同一条轨迹上的点必须映到同一个答案。这是训练唯一要强制的性质。
- **边界条件**：$f(x_\epsilon,\epsilon)=x_\epsilon$。没有它，网络可以输出恒零而「一致」。
- **CD / CT**：一致性蒸馏 / 一致性训练。前者依赖教师模型，后者不依赖。
- **多步采样**：交替「用模型跳到起点」与「按时间表重新加噪」，用更多算力换质量，同时支持修复类编辑。
- **NFE**：网络前向次数。一步生成 NFE=1；多步采样按时间点表走，NFE 等于实际调用次数（官方 `--ts 0,22,39` 是 2 次，见第 5 节）。
- **EDM 框架**：本文的教师与噪声调度沿用 Karras et al. (2022)。这里有两个不同的量，不要混：SDE 的扩散系数 $g(t)=\sqrt{2t}$（论文记作 $\sigma(t)$），以及边缘噪声标准差 $t$（即 EDM 的 $\sigma=t$）。$T=80$，$\epsilon=0.002$。

## 3. 核心方法与数据流

### 3.1 起点：把扩散写成 ODE

扩散的 SDE 与前向（数据→噪声）PF ODE 为（式 (1)(2)，第 2 节）：

$$
dx_t=\mu(x_t,t)\,dt+\sigma(t)\,dw_t,\qquad
dx_t=\Big[\mu(x_t,t)-\tfrac12\sigma(t)^2\nabla\log p_t(x_t)\Big]dt .
$$

本文采用 EDM 设置 $\mu=0$、扩散系数 $g(t)=\sqrt{2t}$（论文符号写作 $\sigma(t)$，与边缘噪声标准差不是一回事）。给定初始数据 $x_0$，噪声的条件协方差是 $\mathrm{Cov}(x_t\mid x_0)=\big(\int_0^t g(s)^2ds\big)I=t^2I$，所以边缘分布 $p_t=p_{\text{data}}\otimes\mathcal{N}(0,t^2I)$，即加噪标准差为 $t$（EDM 的 $\sigma=t$）；采样时采用近似先验 $\pi=\mathcal{N}(0,T^2I)$。把训练好的得分模型 $s_\phi$ 代入，得到**经验 PF ODE**（式 (3)）：

$$
\frac{dx_t}{dt}=-t\,s_\phi(x_t,t).
$$

采样就是从 $x_T\sim\mathcal{N}(0,T^2I)$ 反向积分到 $\epsilon$。慢就慢在这里：每一步都要调用 $s_\phi$。

### 3.2 一致性函数与参数化

定义 $f(x_t,t)=x_\epsilon$，并要求 $f(x_t,t)=f(x_{t'},t')$ 对同一轨迹上任意 $t,t'$ 成立。边界条件 $f(x_\epsilon,\epsilon)=x_\epsilon$ 通过参数化硬编码（式 (5)，第 3 页）：

$$
f_\theta(x,t)=c_{\text{skip}}(t)\,x+c_{\text{out}}(t)\,F_\theta(x,t),\qquad c_{\text{skip}}(\epsilon)=1,\ c_{\text{out}}(\epsilon)=0 .
$$

$F_\theta$ 是任意自由形式的网络（本文直接用 EDM 的 U-Net 结构）。这个形式与 EDM 的预条件写法同源，所以能直接复用扩散模型架构与权重。另一种（式 (4)）是分段写法：$t=\epsilon$ 时直接返回 $x$，否则返回 $F_\theta$；作者在全部实验中用式 (5)，因为它在 $t=\epsilon$ 处可微，连续时间版本需要这个性质。

### 3.3 蒸馏：CD

时间轴按 EDM 的公式离散成 $N-1$ 段：

$$
t_i=\Big(\epsilon^{1/\rho}+\frac{i-1}{N-1}\big(T^{1/\rho}-\epsilon^{1/\rho}\big)\Big)^{\rho},\qquad \rho=7 .
$$

给定 $x\sim p_{\text{data}}$，采 $x_{t_{n+1}}\sim\mathcal{N}(x,t_{n+1}^2I)$，用教师走一步 ODE 得到 $\hat x^\phi_{t_n}$（式 (6)），然后最小化（式 (7)）：

$$
\mathcal{L}^N_{\mathrm{CD}}(\theta,\theta^-;\phi)=\mathbb{E}\Big[\lambda(t_n)\,d\big(f_\theta(x_{t_{n+1}},t_{n+1}),\ f_{\theta^-}(\hat x^\phi_{t_n},t_n)\big)\Big].
$$

三个实现要点：

1. $\theta^-$ 是 $\theta$ 的滑动平均（EMA，式 (8)），前向时 stop-gradient。作者说这比直接令 $\theta^-=\theta$ 稳定得多。
2. $d$ 可取 $\ell_2$、$\ell_1$ 或 LPIPS；$\lambda\equiv1$ 在所有任务上都够用。
3. **Theorem 1**：若 $\mathcal{L}^N_{\mathrm{CD}}=0$ 且 $f_\theta$ 满足 Lipschitz 条件、求解器局部误差为 $O(\Delta t^{p+1})$，则 $\sup_{n,x}\|f_\theta(x,t_n)-f(x,t_n;\phi)\|_2=O(\Delta t^p)$。这是标准的 ODE 全局误差归纳，说明「一致性损失为零」确实逼近教师轨迹。

### 3.4 独立训练：CT

CT 把教师换成一个无偏估计。关键恒等式是

$$
\nabla\log p_t(x_t)=-\mathbb{E}\Big[\frac{x_t-x}{t^2}\ \Big|\ x_t\Big],\qquad x\sim p_{\text{data}},\ x_t\sim\mathcal{N}(x,t^2I).
$$

于是不需要 $s_\phi$，直接用 $x$ 与 $x_{t_n}=x+t_n z$（$z\sim\mathcal{N}(0,I)$）构造相邻点（式 (10)）：

$$
\mathcal{L}^N_{\mathrm{CT}}(\theta,\theta^-)=\mathbb{E}\Big[\lambda(t_n)\,d\big(f_\theta(x+t_{n+1}z,\,t_{n+1}),\ f_{\theta^-}(x+t_n z,\,t_n)\big)\Big].
$$

**Theorem 2** 给出两者的关系（式 (9)）：在 Euler 求解器、教师等于真值得分、$d$ 与 $f_{\theta^-}$ 二阶可微等条件下，

$$
\mathcal{L}^N_{\mathrm{CD}}(\theta,\theta^-;\phi)=\mathcal{L}^N_{\mathrm{CT}}(\theta,\theta^-)+o(\Delta t).
$$

也就是说，CT 是 CD 在 $\Delta t\to0$ 时的一阶近似，但 CT 的损失本身是 $\ge O(\Delta t)$ 的，所以 $N\to\infty$ 时它主导。实践上 $N$ 不能取太大（收敛慢），也不能太小（偏差大），于是作者用随训练进程增长的 $N(\cdot)$ 与 $\mu(\cdot)$ 调度：早期小 $N$ 快速收敛，后期大 $N$ 降偏差。

### 3.5 采样与编辑

一步：$x_\epsilon=f_\theta(x_T,T)$。多步（Algorithm 1）：先跳一次，然后对每个 $\tau_n$ 采样 $z\sim\mathcal{N}(0,I)$，令 $\hat x_{\tau_n}=x+\sqrt{\tau_n^2-\epsilon^2}\,z$，再 $x\leftarrow f_\theta(\hat x_{\tau_n},\tau_n)$。时间点 $\{\tau_n\}$ 用贪心 + 三分搜索按 FID 选，作者假设「给定前面的点，FID 是下一个点的单峰函数」，并说明这是经验假设。

零样本编辑复用同一套多步过程：修复/上色/超分用「已知区域替换 + 重新加噪」，插值走潜空间球面线性插值，SDEdit 类编辑用加噪强度控制。这些在正文里以图呈现（图 6、8、9、10、13），没有单独的定量表格。

## 4. 实验与证据

设置：CIFAR-10、ImageNet 64×64、LSUN Bedroom/Cat 256×256；指标 FID、IS、Precision、Recall；CD 的教师是作者自己预训练的 EDM；CIFAR-10 上 CD 的最优配置是 **LPIPS + Heun + N=18**（图 3），CT 用自适应 $N,\mu$ 调度。超参（Table 3）：CIFAR-10 lr 4e-4、batch 512；ImageNet-64 与 LSUN 均 lr 8e-6 / 1e-5、batch 2048。ImageNet-64 是**类条件**模型（`launch.sh` 中 `--class_cond True`），但表中没有使用分类器引导或无分类器引导；LSUN 与 CIFAR-10 为无条件。NFE 即网络前向次数，一步生成 NFE=1。

**Table 1（第 8 页，CIFAR-10，节选）：**

| 方法 | NFE | FID↓ | IS↑ |
|---|---|---|---|
| DDIM | 50 | 4.67 | – |
| DPM-solver-fast | 10 | 4.70 | – |
| 3-DEIS | 10 | 4.17 | – |
| Knowledge Distillation\* | 1 | 9.36 | – |
| DFNO\* | 1 | 4.12 | – |
| 2-Rectified Flow (+distill)\* | 1 | 4.85 | 9.01 |
| PD | 1 | 8.34 | 8.69 |
| **CD** | **1** | **3.55** | **9.48** |
| PD | 2 | 5.58 | 9.05 |
| **CD** | **2** | **2.93** | **9.75** |
| StyleGAN2-ADA | 1 | 2.92 | 9.83 |
| StyleGAN-XL | 1 | 1.85 | – |
| EDM（教师类） | 35 | 2.04 | 9.84 |
| 1-Rectified Flow | 1 | 378 | 1.13 |
| **CT** | **1** | **8.70** | **8.49** |
| **CT** | **2** | **5.83** | **8.85** |

\* 表示蒸馏前需要构造合成数据的方法。

**Table 2（第 8 页，节选）：**

| 数据集 / 方法 | NFE | FID↓ | Prec.↑ | Rec.↑ |
|---|---|---|---|---|
| ImageNet-64 PD | 1 | 15.39 | 0.59 | 0.62 |
| ImageNet-64 DFNO | 1 | 8.35 | – | – |
| ImageNet-64 **CD** | **1** | **6.20** | **0.68** | **0.63** |
| ImageNet-64 PD | 2 | 8.95 | 0.63 | 0.65 |
| ImageNet-64 **CD** | **2** | **4.70** | **0.69** | **0.64** |
| ImageNet-64 EDM | 79 | 2.44 | 0.71 | 0.67 |
| ImageNet-64 **CT** | **1** | **13.0** | 0.71 | 0.47 |
| Bedroom PD | 1 | 16.92 | 0.47 | 0.27 |
| Bedroom **CD** | **1** | **7.80** | 0.66 | 0.34 |
| Bedroom **CT** | **1** | **16.0** | 0.60 | 0.17 |
| Cat PD | 1 | 29.6 | 0.51 | 0.25 |
| Cat **CD** | **1** | **11.0** | 0.65 | 0.36 |
| Cat **CT** | **1** | **20.7** | 0.56 | 0.23 |

**怎么读这些数字。**

- CD 与 PD 是同类比较（都不需要预造合成数据，都从同一个 EDM 教师蒸馏）。CD 在几乎所有数据集与步数上都优于 PD；唯一例外是 Bedroom 256×256 的一步生成，CD 用 $\ell_2$ 时略低于 PD（正文明确写了这一点）。
- CT 的一步成绩明显弱于 CD（CIFAR-10 8.70 vs 3.55；ImageNet-64 13.0 vs 6.20），但 CT 完全不看教师。把 CT 与「一步非对抗模型」比才公平：它超过 Glow、Residual Flow、DC-VAE 等（Table 1 下半部分）。
- 一步 FID 3.55 是 CD + LPIPS + Heun + $N=18$ + 特定教师的结果。换度量（$\ell_2$）、换求解器、换 $N$ 都会变（图 3）。把它当成「一致性模型的一步性能」会过度概括。

## 5. 复现入口与首个验证

### 5.1 官方代码（已核对）

`openai/consistency_models`（PyTorch，MIT，基于 `openai/guided-diffusion`），CIFAR-10 的 JAX 实现在 `openai/consistency_models_cifar10`。

| 文件 | 作用（实际读到的内容） |
|---|---|
| `cm/karras_diffusion.py` | `consistency_losses`：有 `teacher_model` 时用 **Heun** 从 $x_t$ 走到 $x_{t_2}$（教师去噪）；无教师时用 **Euler**，且去噪器直接取 $x_{\text{start}}$。目标网络在 `no_grad` 下前向并 `detach`。`loss_norm` 支持 `l1`、`l2`、`l2-32`、`lpips`。时间网格用 $\sigma_{\max}^{1/\rho}$ 公式逐样本随机取 index |
| `cm/losses.py` | 只有 `normal_kl`、`discretized_gaussian_log_likelihood` 等**似然工具**（从 Ho et al. 移植），**不是**一致性损失；一致性损失在 `karras_diffusion.py` |
| `scripts/cm_train.py` | `--training_mode consistency_distillation` / `consistency_training`；另有 `--target_ema_mode`、`--scale_mode`、`--start_scales`、`--loss_norm` |
| `scripts/launch.sh` | 完整命令示例：`mpiexec -n 8`；ImageNet-64 CD 600k 步、batch 2048、lr 8e-6；CT 800k 步、`start_scales 2 → end_scales 200`；多步采样时间点 `--ts 0,22,39` |
| `scripts/image_sample.py` | `--sampler onestep` / `multistep`；`--training_mode edm / consistency_distillation / consistency_training` |
| `scripts/ternary_search.py` | 多步时间点的三分搜索 |

**权重（README 直链，均托管在 openaipublic）：** ImageNet-64 的 `edm_imagenet64_ema.pt`、`cd_imagenet64_l2.pt`、`cd_imagenet64_lpips.pt`、`ct_imagenet64.pt`；Bedroom-256 与 Cat-256 各有对应的 EDM/CD(l2)/CD(lpips)/CT 四个。也就是说，**CD 与 CT 都有可直接加载的公开权重**，这在少步生成论文里不常见。

**依赖：** `pip install -e .`；或 `cd docker && make build && make run`。评测需要参考数据批次（`.npz`），用 `evaluations/evaluator.py` 算 FID/IS/Precision/Recall。

### 5.2 第一个该做的机制验证

**验证边界条件与自一致性，不需要训练。** 加载 `cd_imagenet64_lpips.pt`：

1. **边界条件**：取随机 $x$，令 $t=\epsilon=0.002$，检查 $f_\theta(x,\epsilon)$ 与 $x$ 的最大绝对差。按式 (5)，$c_{\text{skip}}(\epsilon)=1$、$c_{\text{out}}(\epsilon)=0$，差值应接近浮点误差量级。若明显不为零，说明加载的模型或 $c_{\text{skip}}/c_{\text{out}}$ 实现有问题。
2. **自一致性**：取一个 $x_T$，用 Heun 沿经验 PF ODE 积分到若干 $t$，得到同一条轨迹上的点 $\{x_{t_i}\}$；再算 $f_\theta(x_{t_i},t_i)$。这些输出两两之间的距离应远小于不同轨迹起点之间的距离。这就是 Figure 2 的定量版本，也是「一致性」这个词唯一能被直接检验的含义。
3. **一步 vs 两步**：用 `--sampler onestep`（NFE=1）与 `--sampler multistep --ts 0,22,39` 各生成一批样本。后者在 `stochastic_iterative_sampler` 里循环 `len(ts)-1 = 2` 次、每次一次 `distiller` 前向，所以 **NFE=2**；`--steps 40` 只用于把 ts 的序号映射到 $\sigma$ 网格（$t=(\sigma_{\max}^{1/\rho}+\text{ts}/(\text{steps}-1)(\sigma_{\min}^{1/\rho}-\sigma_{\max}^{1/\rho}))^{\rho}$），不增加前向次数。若两步没有改善，先查 ts 是否落在该 checkpoint 的适用范围内（README 的 0,22,39 是 ImageNet-64 CD 的设置）。

这三步都是推理，单卡几分钟到几十分钟，且能直接暴露「权重与代码版本不匹配」这类最常见的问题。

## 6. 前后关联

- 上游：[04-score-sde.md](04-score-sde.md) 定义 PF ODE；[05-edm.md](05-edm.md) 提供本文的噪声调度、$T=80$、$\epsilon=0.002$、$\rho=7$ 与教师架构；[02-ddpm.md](02-ddpm.md)、[03-ddim.md](03-ddim.md) 是采样侧的对照。
- 同目标不同路线：[09-rectified-flow.md](09-rectified-flow.md) 用 reflow 把路径拉直来换少步；本文不改路径，改「学什么映射」。两者都能做到 NFE=1，但失败模式不同：前者一步时趋向条件均值（1-RF 的 FID 378），后者一步时依赖教师轨迹的一致性。
- 训练目标侧：[08-flow-matching.md](08-flow-matching.md) 也在回归某个「目标场」，但目标是与 $t$ 相关的向量场，不是与 $t$ 无关的起点。
- 架构/潜空间：[06-ldm.md](06-ldm.md)、[07-dit.md](07-dit.md) 的骨干可以替换本文的 U-Net，本文的结论不依赖具体骨干。
- 像素空间对照：[01-jit.md](01-jit.md)。

## 7. 局限与可检验问题

**论文自身的局限（有原文依据）：**

1. CD 依赖预训练扩散模型与 ODE 求解器；CT 虽独立，但一步成绩明显更差（CIFAR-10 8.70 vs 3.55）。
2. CT 对 $N$ 与 $\mu$ 的调度敏感，需要按分辨率分别调（第 6.1 节与附录 C）。
3. 多步采样的时间点靠三分搜索 + 「FID 单峰」假设，是启发式，不是最优解。
4. 零样本编辑在正文以图呈现，没有与扩散模型编辑的定量对照表。
5. 连续时间版本需要前向模式自动微分（Jacobian-vector product），部分框架支持不好（第 4、5 节）。
6. 一步 FID 是配置相关量：换度量、求解器、$N$ 都会变（图 3）。

**本站推断（明确标注，未做实验）：**

- **问题 A：LPIPS 的优势在少步区间是否仍然成立？** 图 3(a) 显示 CD 训练时 LPIPS 明显优于 $\ell_1/\ell_2$，但 Table 1 里 PD 的对照用的是 $\ell_2$。用同一个 EDM 教师分别训 CD-$\ell_2$ 与 CD-LPIPS，比 N=1、2、4 的 FID。若 LPIPS 的优势只在训练后期出现，那它更像是收敛速度的差异，而不是最终质量的差异。
- **问题 B：CT 的差距是「无教师」造成的，还是「调度没调够」造成的？** 在相同 wall-clock 下把 CT 的 $N_{\max}$ 从 200 提到 400（ImageNet-64，一步 FID 为指标）。若差距显著缩小，说明 CT 的主要瓶颈是方差-偏差调度；若不缩小，说明无教师估计本身是瓶颈。

## 8. 来源与版本

- [arXiv 摘要页](https://arxiv.org/abs/2303.01469)（v2，2023-05-31）
- [arXiv PDF v2](https://arxiv.org/pdf/2303.01469v2)（本页页码、公式号、表号均指此版本）
- [PMLR 202:32211–32252](https://proceedings.mlr.press/v202/song23a.html)
- [PMLR 正式版 PDF](https://proceedings.mlr.press/v202/song23a/song23a.pdf)：已下载核对，同为 42 页，Figure 2 仍在第 3 页且图注一致，一步/两步 FID 3.55/6.20/4.70/2.93 与 arXiv v2 一致；本页页码以 arXiv v2 为准。
- [openai/consistency_models](https://github.com/openai/consistency_models)
- [openai/consistency_models_cifar10](https://github.com/openai/consistency_models_cifar10)（JAX）
- [模型卡](https://github.com/openai/consistency_models/blob/main/model-card.md)

本页未运行任何训练、采样或评测；第 5 节的三个检查是建议，不是已执行结果。文中所有数字均来自上述 v2 PDF 的指定表/节与官方仓库 README/脚本。
