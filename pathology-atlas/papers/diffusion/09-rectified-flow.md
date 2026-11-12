# 09｜Rectified Flow：用「拉直」换少步生成，但别把直线当成最优传输

**论文**：Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow  
**作者**：Xingchao Liu\*、Chengyue Gong\*、Qiang Liu（University of Texas at Austin；\* 共同一作）  
**发表**：ICLR 2023（官方仓库自述为 Spotlight；iclr.cc 虚拟页面标注为 Poster）  
**定位**：两分布之间的 ODE 传输；reflow 改变耦合；直线路径与少步/一步生成  
**核验**：arXiv:2209.03003v1（2022-09-07，41 页，仅此一版）；ICLR 2023 信息取自 iclr.cc 与 OpenReview（forum `XVjTT1nw5z`）。本页只做文本与代码阅读，**未运行任何训练、采样或 FID 评测**。

| 项 | 内容 |
|---|---|
| 任务 | 无条件图像生成、image-to-image 翻译、无监督域适应 |
| 输入 / 输出 | 两个经验分布 $\pi_0,\pi_1$ 的样本；学一个 ODE 把 $\pi_0$ 搬到 $\pi_1$（反向亦可） |
| 关键对象 | 速度场 $v(z,t)$、耦合 $(Z_0,Z_1)$、直线度 $S(Z)$ |
| 训练目标 | 对线性插值方向做最小二乘回归（式 (1)） |
| 代码 | `gnobitab/RectifiedFlow`，含 CIFAR-10 与 256×256 预训练权重 |

## 原文摘要

> We present rectified flow, a surprisingly simple approach to learning (neural) ordinary differential equation (ODE) models to transport between two empirically observed distributions π0 and π1, hence providing a unified solution to generative modeling and domain transfer, among various other tasks involving distribution transport. The idea of rectified flow is to learn the ODE to follow the straight paths connecting the points drawn from π0 and π1 as much as possible. This is achieved by solving a straightforward nonlinear least squares optimization problem, which can be easily scaled to large models without introducing extra parameters beyond standard supervised learning. The straight paths are special and preferred because they are the shortest paths between two points, and can be simulated exactly without time discretization and hence yield computationally efficient models. We show that the procedure of learning a rectified flow from data, called rectification, turns an arbitrary coupling of π0 and π1 to a new deterministic coupling with provably non-increasing convex transport costs. In addition, recursively applying rectification allows us to obtain a sequence of flows with increasingly straight paths, which can be simulated accurately with coarse time discretization in the inference phase. In empirical studies, we show that rectified flow performs superbly on image generation, image-to-image translation, and domain adaptation. In particular, on image generation and translation, our method yields nearly straight flows that give high quality results even with a single Euler discretization step.

*来源：arXiv:2209.03003v1 第 1 页。逐字复制，仅合并 PDF 换行；数学符号按原文保留。*

## 中文摘要

> 我们提出 rectified flow：一种出奇简单的、学习（神经）常微分方程（ODE）模型的方法，用于在两个经验观测到的分布 π0 与 π1 之间做传输，从而为生成建模与域迁移，以及其他各种涉及分布传输的任务提供统一解法。rectified flow 的想法是：让学到的 ODE 尽可能沿着连接 π0 与 π1 采样点的直线路径走。这通过求解一个直接的非线性最小二乘优化问题实现；除标准监督学习之外不引入额外参数，因此可以轻松扩展到大型模型。直线路径之所以特殊且更可取，是因为它们是两点之间的最短路径，并且可以在不做时间离散化的情况下被精确模拟，从而得到计算高效的模型。我们证明，从数据学习 rectified flow 的过程（称为 rectification）会把 π0 与 π1 的任意耦合变成一个确定性的新耦合，且其凸传输代价可证不增。此外，递归地施加 rectification 可以得到一串路径越来越直的流，它们在推理阶段用很粗的时间离散化也能被准确模拟。在实证研究中，我们展示 rectified flow 在图像生成、图像到图像翻译和域适应上表现优异。特别是在图像生成与翻译上，我们的方法得到近乎笔直的流，即使只做一次 Euler 离散也能给出高质量结果。

*译文：对应上方原文逐句对译，未增删内容。专有名词与数字以英文原文为准。*

## 论文框架图（原文 Figure 2）

![Rectified Flow 的耦合与拉直](/papers/diffusion/09-rectified-flow-pipeline.png)

> **Figure 2**：(a) Linear interpolation of data input (X0, X1) ∼ π0 × π1. (b) The rectified flow Zt induced by (X0, X1); the trajectories are “rewired” at the intersection points to avoid the crossing. (c) The linear interpolation of the end points (Z0, Z1) of flow Zt. (d) The rectified flow induced from (Z0, Z1), which follows straight paths.

*图源：arXiv:2209.03003v1 第 4 页，用 PyMuPDF 从官方 PDF 按原区域渲染（4× 缩放），未重绘。图例文字为原图自带。*

**这张图在说什么。** 紫色点是 $\pi_0$，红色点是 $\pi_1$。(a) 把独立采样的 $(X_0,X_1)$ 用直线连起来，蓝绿两组线在中间交叉——因为配对是随机的，一个 $X_0$ 可能被连到「错误」的 $X_1$。(b) 学出来的 rectified flow 在交叉点把轨迹「重新接线」（rewire）：ODE 的解不能交叉（否则解不唯一），所以粒子在交点处改走另一条道，结果是同一时刻的边缘分布不变，但端点配对变了。(c) 用 (b) 的端点 $(Z_0,Z_1)$ 再画一次线性插值，交叉明显减少。(d) 从 $(Z_0,Z_1)$ 再学一次 rectified flow（这就是一次 reflow），轨迹接近平行直线。

图中间那个带蓝绿箭头的十字是作者用来解释「交叉/不交叉」的示意，不是数据。整张图的核心信息是：**直线插值本身不是流**（它需要同时知道终点，非因果），学到的流必须去掉交叉；reflow 通过换配对来减少交叉。

## 0. 三分钟摘要

Rectified Flow 用起点与终点之间的直线方向训练速度场。生成模型会得到新的样本配对；用这些配对再次训练就是 reflow，目的是让轨迹更便于少步积分。

## 它到底怎么做

1. 配对噪声与数据，在两者之间构造直线插值样本。
2. 训练速度场预测从起点指向终点的方向。
3. 解 ODE 获得新的端点配对，需要时用新配对再次训练。
4. 在学到的轨迹上选择积分步数；极少步结果还取决于 reflow 和蒸馏配置。

### 实验先看什么

- 把普通 RF、reflow 后的 RF 与最终蒸馏模型分开，再读取一步 FID。
- 路径变直与全局传输代价最优不是同一个结论。

## 1. 问题与核心判断

**问题。** 给定两个分布的经验样本，找一个映射 $T$ 使 $T(Z_0)\sim\pi_1$（$Z_0\sim\pi_0$）。GAN 用极小极大，训练不稳、会模式崩塌；MLE 对复杂模型不可解，只能靠 VAE/归一化流/自回归换结构；扩散模型用 SDE/ODE，质量好但推理要反复调用网络，单张图可能要几十到上千次函数评估。最优传输（OT）理论上直接，但高维大数据上求解慢，而且「传输代价最小」不必然等于「生成质量最好」。

**这篇的答案。** 只做一件事：回归线性插值的方向。

$$
\min_v\int_0^1\mathbb{E}\Big\|(X_1-X_0)-v\big(X_t,t\big)\Big\|^2dt,\qquad X_t=tX_1+(1-t)X_0 .\tag{1}
$$

最优解是 $v_X(x,t)=\mathbb{E}[X_1-X_0\mid X_t=x]$（式 (2)），即「此刻经过 $x$ 的所有直线方向的平均」。用这个场解 ODE，得到的流与线性插值过程在**每个时刻**的边缘分布相同（Theorem 3.3），但轨迹是因果的、可模拟的。

**两个可证的额外好处。** 一，耦合 $(Z_0,Z_1)$ 的任意凸传输代价不高于原始配对 $(X_0,X_1)$（Theorem 3.5）。二，把「用当前流的端点重新配对再训练」重复下去（reflow），最直的 $k$-rectified flow 的直线度以 $O(1/K)$ 下降（Theorem 3.7）。

**必须记住的边界。** 直线耦合是 $c$-最优耦合的**必要非充分**条件，只有一维时两者重合（Theorem 3.8）。所以 reflow 让路径变直、让代价下降，**不等于**收敛到最优传输映射。

## 2. 术语（先用白话）

- **rectified flow**：由式 (1) 学出的 ODE $dZ_t=v(Z_t,t)dt$。名字里的 rectified 指「把插值路径改造成因果的流」。
- **耦合（coupling）**：$\pi_0$ 与 $\pi_1$ 样本之间的配对方式。独立采样是一种耦合，ODE 端点 $(Z_0,Z_1)$ 是另一种（确定性）耦合。
- **rectification / reflow**：把当前流模拟出的端点对 $(Z^k_0,Z^k_1)$ 当作新数据，再跑一次式 (1)，得到 $Z^{k+1}$。$k$-rectified flow 就是迭代 $k$ 次的结果。
- **直线度 $S(Z)$**：式 (3)，衡量轨迹偏离「匀速直线」多少。$S=0$ 表示每条轨迹都是 $Z_t=tZ_1+(1-t)Z_0$。
- **1-NFE 生成**：只做一次 Euler 更新 $Z_1=Z_0+v(Z_0,0)$。只有流足够直时这一步才准。
- **蒸馏（distillation）**：与 reflow 不同。蒸馏是**忠实逼近已有耦合** $(Z^k_0,Z^k_1)$，reflow 是**换一个新耦合**。论文明确要求蒸馏只放在最后一步做。
- **PF-ODE / DDIM**：概率流 ODE 与 DDIM 被本文视为「非线性 rectified flow」的特例（Proposition 3.11），它们的 $\alpha_t,\beta_t$ 来自 SDE 推导，因此路径弯曲、速度不均匀。

## 3. 核心方法与数据流

### 3.1 训练：一次最小二乘

数据流只有四步：

1. 采 $X_0\sim\pi_0$、$X_1\sim\pi_1$、$t\sim U[0,1]$；
2. 构造 $X_t=tX_1+(1-t)X_0$；
3. 目标方向取 $X_1-X_0$；
4. 最小化 $\|(X_1-X_0)-v_\theta(X_t,t)\|^2$。

这就是 Algorithm 1 的 Training 行。它没有额外参数、没有对抗、没有似然项。采样时从 $Z_0\sim\pi_0$ 解 ODE 到 $t=1$。反向（数据→噪声）采样有两种等价写法：(a) 仍用原方程 $\dot X=v(X,t)$，但从 $t=1$ 积到 $t=0$（步长为负）；(b) 令 $s=1-t$、$\tilde X_s=X_{1-s}$，则 $\dfrac{d\tilde X_s}{ds}=-v(\tilde X_s,1-s)$，从 $\tilde X_0\sim\pi_1$ 出发，最后取 $X_t=\tilde X_{1-t}$。论文第 5 页把 (b) 写成 $d\tilde X_t=-v(\tilde X_t,t)dt$，那是把反向过程的时间轴重新记作 $t$ 的简写；不能把它读成同一时间方向上的前向方程。

### 3.2 为什么这个场能保住边缘分布

式 (1) 的逐点最优解是

$$
v_X(x,t)=\mathbb{E}\big[X_1-X_0\mid X_t=x\big].\tag{2}
$$

**Theorem 3.3（边缘保持）**：$Z_0\sim\pi_0$ 时，$\mathrm{Law}(Z_t)=\mathrm{Law}(X_t)$ 对每个 $t$ 成立。直观解释是「每个无穷小体积在 $X$ 与 $Z$ 下的流入流出量相同」。注意它只说**边缘**相同，整条轨迹的联合分布不同：$X_t$ 非因果、非马尔可夫，$Z_t$ 因果、马尔可夫、去随机化。

### 3.3 直线度与 reflow

定义

$$
S(Z)=\int_0^1\mathbb{E}\Big\|(Z_1-Z_0)-\dot Z_t\Big\|^2dt .\tag{3}
$$

$S(Z)=0$ 时，一次 Euler 步就精确。**Theorem 3.7** 给出（第 8 页）：

$$
\min_{k\in\{0,\dots,K\}}S(Z^k)\le\frac{\mathbb{E}\big[\|X_1-X_0\|^2\big]}{K}.
$$

也就是说，reflow 次数增加，总有一条流会变直，速率是 $O(1/K)$。论文同时提醒：reflow 太多会累积对 $v_X$ 的估计误差，所以不推荐无限迭代。

### 3.4 与扩散/DDIM 的统一视角

把线性插值换成任意可微曲线 $X_t$，目标改成

$$
\min_v\int_0^1\mathbb{E}\Big[w_t\big\|v(X_t,t)-\dot X_t\big\|^2\Big]dt,\tag{6}
$$

仍然保边缘（Theorem 3.3），但**不再保证降低凸代价、也不再保证 reflow 会拉直**。取 $X_t=\alpha_tX_1+\beta_t\xi$，$\xi\sim\mathcal{N}(0,I)$，就覆盖了 VE/VP/sub-VP 的 PF-ODE 与 DDIM（Proposition 3.11）：

$$
\alpha_t=\exp\!\Big[-\tfrac14a(1-t)^2-\tfrac12b(1-t)\Big],\quad a=19.9,\ b=0.1;\qquad
\beta_t^{\text{VP}}=\sqrt{1-\alpha_t^2},\quad \beta_t^{\text{sub-VP}}=1-\alpha_t^2 .\tag{7,8}
$$

论文对这两个调度的批评是具体的：$\beta_t\neq1-\alpha_t$ 导致路径弯曲（reflow 也拉不直），$\alpha_t$ 的指数形式导致前期几乎不动、后期突然加速（图 5、图 6）。把 $\alpha_t$ 换成 $t$ 可以恢复匀速，但路径仍然弯。

### 3.5 直线 ≠ 最优

**Theorem 3.8**：若一个可 rectify 的耦合对某个严格凸代价 $c$ 是 $c$-最优的，则它一定是直线耦合；反之不成立，只有一维时两者重合。这就是为什么 reflow 能「同时降低所有凸代价」（Pareto 下降），却不能声称得到某个 $c$ 的最优解。

## 4. 实验与证据

设置：CIFAR-10 用 DDPM++（`ncsnpp`）骨干，batch 128、1.3M 迭代、Adam、warmup 5000、梯度裁剪 1.0（`configs/default_cifar10_configs.py`）；FID/IS/recall 按 Score-SDE 的评测流程，需要 `assets/stats/cifar10_stats.npz`；256×256 数据集用 LSUN Bedroom/Church、CelebA-HQ、AFHQ-Cat。表中模型均为无条件生成，没有类别标签、分类器引导或无分类器引导。NFE 是网络调用次数：固定步长 Euler 时等于步数 $N$，而 RK45 这类自适应求解器一步内可能多次评估，所以表里的 127/110/104 等是 NFE，不是步数。

**Table 1（第 24 页，(a) DDPM++ 架构；括号内为蒸馏后的数字）：**

| 方法 | NFE | IS↑ | FID↓ | Recall↑ |
|---|---|---|---|---|
| 1-Rectified Flow（+Distill） | 1 | 1.13 (9.08) | 378 (6.18) | 0.0 (0.45) |
| 2-Rectified Flow（+Distill） | 1 | 8.08 (9.01) | 12.21 (4.85) | 0.34 (0.50) |
| 3-Rectified Flow（+Distill） | 1 | 8.47 (8.79) | 8.15 (5.21) | 0.41 (0.51) |
| VP ODE（+Distill） | 1 | 1.20 (8.73) | 451 (16.23) | 0.0 (0.29) |
| sub-VP ODE（+Distill） | 1 | 1.21 (8.80) | 451 (14.32) | 0.0 (0.35) |
| 1-Rectified Flow（RK45 全模拟） | 127 | 9.60 | 2.58 | 0.57 |
| 2-Rectified Flow（RK45） | 110 | 9.24 | 3.36 | 0.54 |
| 3-Rectified Flow（RK45） | 104 | 9.01 | 3.96 | 0.53 |
| VP ODE（RK45） | 140 | 9.37 | 3.93 | 0.51 |
| sub-VP ODE（RK45） | 146 | 9.46 | 3.16 | 0.55 |
| VP SDE（Euler N=2000） | 2000 | 9.58 | 2.55 | 0.58 |
| sub-VP SDE（Euler N=2000） | 2000 | 9.56 | 2.61 | 0.58 |

**这张表最容易读错的地方**：论文贡献段（第 4 页）写的是「state-of-the-art result of FID (4.85) and recall (0.51)」，但这两个数来自**不同模型**——4.85 是蒸馏后 2-RF 的一步 FID，0.51 是蒸馏后 3-RF 的一步 recall（第 25 页原文分别给出 2-RF 0.50 与 3-RF 0.51）。未蒸馏的 2-RF 在 N=1 时 FID 是 12.21、recall 0.34；1-RF 在 N=1 时 FID 378、recall 0.0——一次 Euler 步基本只给出 $\pi_1$ 的均值（图 5 的说明），这正好印证「未拉直的流不能一步生成」。

**与 GAN 的对照（Table 1(b)）：** TDPM（T=1）FID 8.91、recall 0.46；DDIM Distillation 9.36/0.51；StyleGAN2+ADA 2.92/0.49。论文的结论是蒸馏后的 2-RF 在「U-Net 类架构的一步模型」里最好（4.85 vs 8.91），recall 也高于 StyleGAN2+ADA（0.50 vs 0.49），但 FID 仍明显落后 StyleGAN2+ADA。

**reflow 的代价（第 24–25 页）：** reflow 在 $N\lesssim80$ 时同时改善 FID 与 recall，但在大步数区间反而变差，原因是 $v_X$ 的估计误差累积（图 8）。所以「reflow 越多越好」是错的。

**域适应（Table 2，第 29 页）：** OfficeHome 上本文 69.2±0.5，CORAL 68.7±0.3，ERM 66.5±0.3；DomainNet 上本文 41.4±0.1，CORAL 41.5±0.2，MLDG 41.2±0.1。也就是说 OfficeHome 领先，DomainNet 与 CORAL 基本持平（略低 0.1）。推理统一用 100 步均匀离散。

## 5. 复现入口与首个验证

### 5.1 官方代码（已核对）

仓库 `gnobitab/RectifiedFlow`（创建于 2022-12-01，描述即 "Official Implementation of Rectified Flow (ICLR2023 Spotlight)"），图像部分在 `ImageGeneration/`：

| 文件 | 作用 |
|---|---|
| `main.py` | 入口，`--mode train / eval / reflow` |
| `losses.py` | `get_rectified_flow_loss_fn`：式 (1) 的实现；`reflow_t_schedule` 支持 `'t0'`（k=1 蒸馏）、`'t1'`（反向蒸馏）、`'uniform'`（reflow）、整数 $k$（k>1 蒸馏）；`reflow_loss` 支持 `l2`、`lpips`、`lpips+l2`，且 LPIPS 仅允许配 `'t0'` |
| `run_lib_reflow.py` | `finetune_reflow`；`reflow_type` 分 `generate_data_from_z0`、`train_reflow`、`train_online_reflow` |
| `run_lib.py` / `run_lib_pytorch.py` | 训练与采样主循环 |
| `sampling.py`、`sde_lib.py` | ODE/SDE 采样器与 `RectifiedFlow` 定义 |
| `configs/rectified_flow/cifar10_rf_gaussian_ddpmpp.py` | CIFAR-10 配置：`ncsnpp`、`nf=128`、`ch_mult=(1,2,2,2)`、dropout 0.15、EMA 0.999999、采样 `rk45` 容差 $10^{-5}$ |
| `configs/default_cifar10_configs.py` | batch 128、1.3M 迭代、Adam、warmup 5000、grad clip 1.0 |

**依赖（README 原样）：** Python 3.8；`torch==1.11.0+cu113`、`torchvision==0.12.0+cu113`；`tensorflow==2.9.0`、`tensorflow-probability==0.12.2`、`tensorflow-gan==2.0.0`、`tensorflow-datasets==4.6.0`；`jax==0.3.4`、`jaxlib==0.3.2`；`numpy==1.21.6`、`ninja`、`matplotlib==3.7.0`、`ml_collections==0.1.1`。作者在 1×A100 40GB、Ubuntu 20.04 上测试过。

**数据与权重：** CIFAR-10 通过 `tensorflow_datasets` 的 `tfds.builder('cifar10')` 读取（`datasets.py`）；FID 需要单独下载 `cifar10_stats.npz` 放到 `assets/stats/`。预训练权重放在 Google Drive（README 列表）：CIFAR-10 1-RF（FID 2.58）、2-RF（3.36）、3-RF（3.96）及各自蒸馏版（6.18 / 4.85 / 5.21），另有 LSUN Bedroom/Church、CelebA-HQ、AFHQ-Cat。

**reflow 的数据量要求：** README 明确建议 CIFAR-10 至少生成 **1M** 对 $(Z_0,Z_1)$ 再做 reflow；也提供在线生成（`train_online_reflow`）以省存储、换更长训练时间。

### 5.2 第一个该做的机制验证

**用非参数估计器在二维上复现「拉直」。** 论文式 (5) 给出 Nadaraya–Watson 型估计

$$
v_{X,h}(z,t)=\mathbb{E}\Big[\frac{X_1-z}{1-t}\,\omega_h(X_t,z)\Big],\qquad \omega_h=\frac{\kappa_h(X_t,z)}{\mathbb{E}[\kappa_h(X_t,z)]},
$$

取高斯核、带宽 $h=0.1$（图 3(d) 用的就是这个设置）。在「双峰 $\pi_0$ → 双峰 $\pi_1$」的二维数据上：

1. 用式 (5) 估出 $v$，解 ODE 得到 $Z^0$；
2. 用端点 $(Z^0_0,Z^0_1)$ 重新配对，再估一次，得到 $Z^1$；
3. 记录每一步的 $S(Z^k)$、$\mathbb{E}\|Z^k_1-Z^k_0\|^2$、以及端点配对的交叉数。

**可检验的预测。** 以下是精确条件场与 ODE 解下的性质；核回归、有限样本与数值积分会引入误差，读实验结果时应同时检查这些近似误差。

- **Theorem 3.7 约束的是前 $K$ 步里的最小值**：$\min_{k\le K}S(Z^k)\le\mathbb{E}\|X_1-X_0\|^2/K$（附录版本还含 $V$ 项）。它**不**保证每个 $S(Z^k)$ 单调下降，单个迭代可能变差。所以要看 $S$ 的序列与 $\min_{k\le K}S(Z^k)$ 的衰减率，不要用「每一步都更直」当判据。
- **Theorem 3.5 是逐步的**：每次 rectification 都使 $\mathbb{E}[c(Z_1-Z_0)]$ 不增（对任意凸 $c$），所以 $\mathbb{E}\|Z^k_1-Z^k_0\|^2$ 序列应单调不增。这一条可以直接检验。
- **Theorem 3.8 只说「$c$-最优 ⇒ 直线」**，不排除 reflow 在某些多维例子上收敛到某个 $c$-最优耦合。要判断是否收敛到 OT，必须独立算出该二维经验分布的最优传输代价（例如对经验样本解离散 OT 线性规划），再与 $\mathbb{E}\|Z^k_1-Z^k_0\|^2$ 比较；不能因为「定理没说会收敛」就断言不会。

如果 $\mathbb{E}\|Z^k_1-Z^k_0\|^2$ 降到离散 OT 代价，那说明这个例子上的不动点恰好是 OT 耦合——这与 Theorem 3.8 不矛盾，只是说明「直线」在该例中恰好也是最优；如果停在更高的值，才说明拉直没有带来最优性。

这个验证纯 CPU、几分钟量级，但它检验的是论文最核心的三条定理，比直接跑 CIFAR-10 更有信息量。

## 6. 前后关联

- 上游：[02-ddpm.md](02-ddpm.md)、[04-score-sde.md](04-score-sde.md) 提供 SDE 与概率流 ODE；本文第 2.3 节把 PF-ODE/DDIM 收进「非线性 rectified flow」，并指出它们的路径弯、速度不均。
- 采样侧：[03-ddim.md](03-ddim.md) 是确定性采样，本文说明它为什么在大步长下不稳（$\alpha_t,\beta_t$ 的选择）。
- 同族：[08-flow-matching.md](08-flow-matching.md) 的 OT 条件路径与本文式 (1) 在 $\sigma_{\min}=0$ 时目标形式相同；但 FM 论证梯度等价，RF 论证耦合与拉直，两者的结论不能互换。
- 后续：[10-consistency-models.md](10-consistency-models.md) 也追求少步，但走的是「学轨迹起点映射」而不是「把路径拉直」，可以对照读。
- 架构/潜空间：[06-ldm.md](06-ldm.md)、[07-dit.md](07-dit.md)；[05-edm.md](05-edm.md) 的求解器与预条件可以直接接到本文的 ODE 上。
- 像素空间对照：[01-jit.md](01-jit.md)。

## 7. 局限与可检验问题

**论文自身的局限（有原文依据）：**

1. reflow 需要先模拟大量端点对（CIFAR-10 建议 1M 对），存储与算力都不免费；在线生成只是把成本换成训练时间。
2. reflow 在 $N$ 较大时反而变差（图 8），论文归因于 $v_X$ 估计误差累积，并明确不建议迭代太多次。
3. 直线耦合只是 $c$-最优的必要条件（Theorem 3.8），除一维外不保证最优。
4. 域适应提升有限：DomainNet 41.4 对 CORAL 41.5，属于持平。
5. 「一步生成」的成绩依赖蒸馏与具体配置；未蒸馏的 2-RF 在 N=1 时 FID 12.21。

**本站推断（明确标注，未做实验）：**

- **问题 A：reflow 数据量如何影响直线度？** 把配对数据从 100k 增到 1M，测 $S(Z^1)$ 与 N=1 的 FID。若 $S$ 随数据量下降但 FID 不降，说明瓶颈在「直线」之外（例如模型容量或 $t=0$ 附近的估计误差）。首个对比：同一 checkpoint、同一采样器，只改 reflow 数据量。
- **问题 B：部分 reflow 能否兼顾两端？** 只对 $t\in[0,0.5]$ 的轨迹重新配对，保留大步数区间的质量，同时改善 N=1/2。首个对比：N=1、2、4 的 FID 与 $S(Z)$，对完整 reflow 与部分 reflow 各跑一组。

## 8. 来源与版本

- [arXiv 摘要页](https://arxiv.org/abs/2209.03003)（仅 v1，2022-09-07）
- [arXiv PDF v1](https://arxiv.org/pdf/2209.03003)（本页页码、公式号、表号均指此版本）
- [OpenReview forum](https://openreview.net/forum?id=XVjTT1nw5z)
- [ICLR 2023 虚拟会场页面](https://iclr.cc/virtual/2023/poster/11266)
- [gnobitab/RectifiedFlow](https://github.com/gnobitab/RectifiedFlow)
- 理论续篇：[Rectified Flow: A Marginal Preserving Approach to Optimal Transport, arXiv:2209.14577](https://arxiv.org/abs/2209.14577)

本环境无法下载 OpenReview 的 camera-ready PDF（请求返回验证页），因此页码、公式号、表号均以 arXiv v1 为准；未核对 camera-ready 的排版差异。arXiv 上该文只有 v1，没有更新版。

本页未运行任何训练、采样或评测；第 5 节的两个验证是建议，不是已执行结果。文中所有数字均来自上述 v1 PDF 的指定表/节与官方仓库 README。
