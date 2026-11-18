# 05｜EDM：把扩散模型拆成「采样器 + 预条件 + 训练目标」三个可独立替换的部件

**论文**：Elucidating the Design Space of Diffusion-Based Generative Models
**作者**：Tero Karras、Miika Aittala、Timo Aila、Samuli Laine（NVIDIA）
**会刊**：NeurIPS 2022（arXiv:2206.00364v2，2022-10-11）
**定位**：不是提出一个新模型，而是把 VP / VE / iDDPM+DDIM 三套写法还原成同一组可替换的设计变量，并逐项做消融
**精读状态**：已核对 arXiv v2 全文（正文第 2–5 节、表 1–4、算法 1–2、附录 B.6/F.2/F.3）与官方仓库 `NVlabs/edm`（commit `008a4e5`，2024-03-16）的 `training/networks.py`、`training/loss.py`、`generate.py`、`example.py`、`README.md`
**实验声明**：本篇笔记没有训练、微调或采样任何模型，也没有复现表中任何 FID；所有数字来自论文表格，代码结论来自阅读源码。

## 原文摘要

> We argue that the theory and practice of diffusion-based generative models are currently unnecessarily convoluted and seek to remedy the situation by presenting a design space that clearly separates the concrete design choices. This lets us identify several changes to both the sampling and training processes, as well as preconditioning of the score networks. Together, our improvements yield new state-of-the-art FID of 1.79 for CIFAR-10 in a class-conditional setting and 1.97 in an unconditional setting, with much faster sampling (35 network evaluations per image) than prior designs. To further demonstrate their modular nature, we show that our design changes dramatically improve both the efficiency and quality obtainable with pre-trained score networks from previous work, including improving the FID of a previously trained ImageNet-64 model from 2.07 to near-SOTA 1.55, and after re-training with our proposed improvements to a new SOTA of 1.36.

*来源：arXiv:2206.00364v2 第 1 页摘要（NeurIPS 2022 相机版）。逐字复制，仅去掉 PDF 换行与断词连字符；未改写、未压缩。*

## 中文摘要

> 我们认为，基于扩散的生成模型在理论与实践上目前都被不必要地复杂化了；本文通过给出一个把具体设计选择清晰分开的设计空间来修正这一状况。这使我们能够对采样过程、训练过程，以及分数网络的预条件（preconditioning）三方面分别找出若干改动。合起来，我们的改进在 CIFAR-10 上取得新的最优 FID：类别条件设置下 1.79，无条件设置下 1.97，并且采样比先前设计快得多（每张图 35 次网络评估）。为进一步说明这些改动的模块化性质，我们表明：我们的设计改动能大幅提升先前工作已训练好的分数网络的效率与质量，包括把一个此前训练好的 ImageNet-64 模型的 FID 从 2.07 改善到接近当前最优的 1.55；而在用我们提出的改进重新训练之后，则达到新的最优 1.36。

*译文：与上方英文摘要逐句对应，未增删内容。数字、数据集名与缩写保持原样。*

## 论文框架原图

![EDM 论文图 1：加噪输入与理想去噪器输出](/papers/diffusion/05-edm-pipeline.png)

> **原文图注**：Figure 1: Denoising score matching on CIFAR-10. (a) Images from the training set corrupted with varying levels of additive Gaussian noise. High levels of noise lead to oversaturated colors; we normalize the images for cleaner visualization. (b) Optimal denoising result from minimizing Eq. 2 analytically (see Appendix B.3). With increasing noise level, the result approaches dataset mean.

*图源：arXiv:2206.00364v2 第 2 页顶部 Figure 1，用 PyMuPDF 从官方 PDF 页面区域裁出（400 dpi，未重绘、未描摹）。*

*为什么选这张而不是别的：EDM 没有 pipeline 总图，它的“方法”就是这张图定义的函数 $D(x;\sigma)$。左列是输入分布 $p(x;\sigma)$，随 $\sigma$ 增大逐渐变成彩色噪点；右列是解析算出的最优去噪器输出，随 $\sigma$ 增大收敛到数据集均值。整篇论文的预条件设计（第 5 节）就是在讨论“怎样让神经网络去拟合右列这个量”，而第 3 节的采样器讨论的是“怎样沿这个量定义的轨迹走回去”。读这张图时注意一个容易误解的地方：右列不是网络输出，而是理论最优解；真实网络只是在逼近它。*

## 0. 三分钟摘要

EDM 把原本缠在一起的扩散设计拆开：网络输入输出怎样缩放，训练时看哪些噪声，损失怎样加权，以及采样时用什么数值求解器。这样可以分别研究每项选择的作用。

## 它到底怎么做

1. 把模型统一写成以噪声标准差为条件的去噪器。
2. 用输入缩放、跳连和输出缩放，把原始网络输出变成干净图像估计。
3. 分别设定训练噪声分布与损失权重，训练同一个去噪任务。
4. 沿噪声时间表用二阶积分采样；需要随机采样时，再加入噪声扰动步骤。

### 实验先看什么

- 网络原始输出与预条件后的去噪结果是两个对象，读代码时要分开。
- 比较求解器时统计网络调用次数；二阶采样的一步通常不只调用一次网络。

## 1. 问题与核心判断

**问题**：图像生成。输入是纯高斯噪声 $\mathbf{x}_0 \sim \mathcal{N}(\mathbf{0}, \sigma_{\max}^2 \mathbf{I})$，输出是一张图；训练数据是一批干净图像 $y \sim p_{\text{data}}$，$\sigma_{\text{data}}$ 是它们的标准差。

**它要解决的不是“效果不够好”，而是“看不懂”**。论文开头的判断很直接：扩散模型的文献在理论上很密，采样 schedule、训练动力学、噪声水平参数化都尽量贴着某个理论框架推导，这保证了理论根基，但副作用是把设计空间遮住了——一个模型看起来像一个紧密耦合的整体，动一个部件就“破坏整个系统”。于是 VP、VE、iDDPM+DDIM 三套写法各自带着自己的记号、自己的 schedule、自己的离散化，读者无法判断某个 FID 提升到底来自哪一项。

**做法**：把每个模型写成同一组函数，然后逐项替换。表 1 就是这张对照表：ODE 求解器、时间离散化 $\{t_i\}$、噪声 schedule $\sigma(t)$、信号缩放 $s(t)$、预条件 $\{c_{\text{skip}}, c_{\text{out}}, c_{\text{in}}, c_{\text{noise}}\}$、训练噪声分布 $p_{\text{train}}(\sigma)$、损失权重 $\lambda(\sigma)$。三列旧方法在这张表里只是取了不同的值，第四列是作者选的值。

**结果**：CIFAR-10 上类别条件 1.79 / 无条件 1.97，NFE 只要 35；ImageNet-64 上仅换采样器就把已训练模型的 2.07 推到 1.55，重训后 1.36。同时给出一个反直觉的观察：模型本身变好之后，随机采样反而不再有用，CIFAR-10 上最好的结果来自确定性采样。

## 2. 术语（白话）

- **$\sigma$ 与 $\sigma(t)$**：$\sigma$ 是噪声标准差，不是一个“时间步编号”。EDM 把时间 $t$ 当作连续变量，$\sigma(t)$ 是“噪声水平随时间怎么变”的配方。论文最终选 $\sigma(t)=t$、$s(t)=1$，于是时间就是噪声水平，两者可以互换着说。这与 DDPM 的整数步 $t\in\{0,\dots,1000\}$ 不是同一套记号。
- **去噪器 $D(x;\sigma)$**：给定一张带噪图 $x$ 和噪声水平 $\sigma$，输出对干净图的估计。论文关心的是它的**最优解**，即最小化逐 $\sigma$ 的 $L_2$ 去噪误差后的条件期望 $D(x;\sigma)=\mathbb{E}[y\mid x]$。
- **预条件（preconditioning）**：不让神经网络 $F_\theta$ 直接充当 $D_\theta$，而是用几个只依赖 $\sigma$ 的标量把输入、输出、跳连重新标定，再从 $F_\theta$ 换算出 $D_\theta$。这是本篇最容易被读错的一处，见 3.2。
- **NFE（network function evaluations）**：生成一张图调用网络多少次。它不等于“采样步数”：二阶 Heun 每步要算两次，所以 $N$ 步对应 $\text{NFE}=2N-1$。
- **$\rho$**：时间离散化的曲率参数。$\rho=7$ 表示在 $\sigma$ 小的一端放更多步，因为那里的轨迹弯得最厉害。
- **churn（搅动）**：随机采样器里“先把噪声加回去、再走一步 ODE”的操作，由 $S_{\text{churn}}$ 控制强度。它不增加 NFE。
- **非泄漏增广（non-leaky augmentation）**：训练时对图像做几何变换，但把变换参数作为条件输入喂给网络；推理时把参数置零，从而只生成未增广的图像。

## 3. 核心方法与数据流

### 3.1 概率流 ODE：整篇的骨架

论文从 ODE 出发而不是从 SDE 出发，理由是 ODE 更适合分析采样轨迹与离散化误差（第 4 节再把随机性作为推广加回来）。概率流 ODE 为（式 1，第 2 页）：

$$
\mathrm{d}\mathbf{x} = -\dot\sigma(t)\,\sigma(t)\,\nabla_{\mathbf{x}} \log p\big(\mathbf{x};\sigma(t)\big)\,\mathrm{d}t .
$$

$\dot\sigma$ 是 $\sigma$ 对时间的导数，$\nabla_{\mathbf{x}}\log p(\mathbf{x};\sigma)$ 是分数函数，指向该噪声水平下数据密度更高的方向。直观读法：沿 $t$ 正向走一小步，样本被推离数据；反向走一小步，样本被推向数据。**时间方向必须说清楚**：本文的 $t$ 增大对应噪声增大，所以采样是从 $t_{\max}$ 积到 $t_{\min}=0$。

### 3.2 分数与去噪器是同一个量的两种写法

分数函数不含难算的归一化常数，而且可以用去噪器表示（式 2–3，第 3 页）：

$$
\nabla_{\mathbf{x}} \log p(\mathbf{x};\sigma) = \frac{D(\mathbf{x};\sigma) - \mathbf{x}}{\sigma^{2}} .
$$

这一步把“训练一个分数网络”换成“训练一个去噪器”，也解释了图 1 右列：当 $\sigma$ 很大时，$x$ 里几乎没有信号，最优 $D$ 只能给出数据集均值，于是 $D-x \approx -x$，分数指向原点。

### 3.3 预条件：网络输出不是去噪结果

这是本篇最实用、也最容易被误读的一节。直接让神经网络输出 $D$ 是不合适的：输入 $x=y+n$ 的幅度随 $\sigma$ 剧烈变化，从 $\sigma_{\text{data}}$ 量级一直到 $\sigma_{\max}=80$。所以作者写成（式 7，第 8 页）：

$$
D_\theta(\mathbf{x};\sigma) = c_{\text{skip}}(\sigma)\,\mathbf{x} + c_{\text{out}}(\sigma)\,F_\theta\big(c_{\text{in}}(\sigma)\,\mathbf{x};\, c_{\text{noise}}(\sigma)\big),
$$

其中 $F_\theta$ 才是真正的神经网络层，$c_{\text{skip}}$ 调制跳连，$c_{\text{in}},c_{\text{out}}$ 标定输入输出幅度，$c_{\text{noise}}$ 把 $\sigma$ 映射成条件输入。作者的选择（表 1，第 3 页；代码 `training/networks.py:660-663` 逐行对应）：

$$
c_{\text{skip}}=\frac{\sigma_{\text{data}}^2}{\sigma^2+\sigma_{\text{data}}^2},\quad
c_{\text{out}}=\frac{\sigma\,\sigma_{\text{data}}}{\sqrt{\sigma^2+\sigma_{\text{data}}^2}},\quad
c_{\text{in}}=\frac{1}{\sqrt{\sigma^2+\sigma_{\text{data}}^2}},\quad
c_{\text{noise}}=\tfrac14\ln\sigma .
$$

**为什么是这四个式子**：把式 7 代回损失，可以把它改写成“对 $F_\theta$ 的普通回归”（式 8，第 8 页），有效权重是 $\lambda(\sigma)c_{\text{out}}(\sigma)^2$，有效训练目标是

$$
\frac{y - c_{\text{skip}}(\sigma)\,(y+n)}{c_{\text{out}}(\sigma)} .
$$

于是三个系数可以按两条要求反解出来：输入与训练目标都保持单位方差（定 $c_{\text{in}},c_{\text{out}}$），并且让 $F_\theta$ 的误差被放大得尽量少（定 $c_{\text{skip}}$）。$c_{\text{noise}}$ 的 $\tfrac14\ln\sigma$ 是经验选择。

代入两端可以看清这个跳连在做什么：$\sigma\to0$ 时 $c_{\text{skip}}\to1$、$c_{\text{out}}\to\sigma$，目标 $\approx -(n)/\sigma$，即单位方差的噪声，网络在预测噪声；$\sigma\to\infty$ 时 $c_{\text{skip}}\to0$、$c_{\text{out}}\to\sigma_{\text{data}}$，目标 $\approx y/\sigma_{\text{data}}$，即归一化后的干净图像。所以作者说这个跳连“允许网络估计 $y$ 或 $n$，或两者之间的某个量”。

> **读这篇最容易犯的错**：把 $F_\theta$ 的输出当成去噪结果。$F_\theta$ 的输出是**被 $c_{\text{out}}$ 缩放过的残差**，量纲和数值范围都与图像不同。任何“网络直接输出干净图”的说法在 EDM 里都不成立，必须经过式 7 的换算。

### 3.4 训练目标：权重与噪声分布

总体损失是加权期望 $\mathbb{E}_{\sigma,y,n}\big[\lambda(\sigma)\lVert D(y+n;\sigma)-y\rVert_2^2\big]$，$\sigma\sim p_{\text{train}}$、$n\sim\mathcal{N}(\mathbf{0},\sigma^2\mathbf{I})$。既然式 8 显示有效权重是 $\lambda c_{\text{out}}^2$，取

$$
\lambda(\sigma)=\frac{1}{c_{\text{out}}(\sigma)^2}=\frac{\sigma^2+\sigma_{\text{data}}^2}{(\sigma\,\sigma_{\text{data}})^2}
$$

就能让整个 $\sigma$ 范围内的初始损失大致持平（图 5a 绿线）。噪声分布取对数正态：

$$
\ln\sigma \sim \mathcal{N}(P_{\text{mean}}, P_{\text{std}}^2),\qquad P_{\text{mean}}=-1.2,\ P_{\text{std}}=1.2,\ \sigma_{\text{data}}=0.5 .
$$

理由是：训练后逐 $\sigma$ 看损失，只有中间噪声段还有明显下降空间——极低 $\sigma$ 处噪声小到难以分辨且无关紧要，极高 $\sigma$ 处目标永远接近数据集均值、学不出差异。所以把训练算力集中到中间段。

### 3.5 采样：二阶求解器 + 弯曲的离散化

确定性采样器（算法 1）用 Heun 二阶法，时间点取

$$
t_i=\Big(\sigma_{\max}^{1/\rho}+\frac{i}{N-1}\big(\sigma_{\min}^{1/\rho}-\sigma_{\max}^{1/\rho}\big)\Big)^{\rho},\qquad \rho=7,\ \sigma_{\min}=0.002,\ \sigma_{\max}=80 .
$$

$\rho=7$ 的效果是步长在 $\sigma$ 小时更密。论文用图 3 解释：在 $\sigma(t)=t$、$s(t)=1$ 下，$\sigma\to0$ 时解轨迹趋于直线并指向数据流形，所以小 $\sigma$ 端需要更细的网格。

**NFE 要单独算**：Heun 每步两次网络评估，最后一步只做一次 Euler 修正，因此 $N$ 步对应 $\text{NFE}=2N-1$。$N=18\Rightarrow\text{NFE}=35$，$N=40\Rightarrow\text{NFE}=79$。这与代码默认值一致（`generate.py:27` 的 `num_steps=18`）。

随机采样器（算法 2）在每步之前插入一次“搅动”：把当前噪声水平从 $t_i$ 抬到 $\hat t_i=t_i+\gamma_i t_i$，加噪声，再从 $\hat t_i$ 用同一个二阶积分器走回 $t_{i+1}$。$\gamma_i=\min(S_{\text{churn}}/N,\sqrt2-1)$，且只在 $t_i\in[S_{t\min},S_{t\max}]$ 内启用。论文强调这不是通用 SDE 求解器，而是针对该问题定制的两步交替，每一步各自维持正确分布；与 Euler–Maruyama 的关键差别是：评估 $D_\theta$ 时用的是**加噪之后**的状态 $(\hat x_i,\hat t_i)$，而不是步首的 $(x_i,t_i)$——大步长时这个差别很显著。

## 4. 实验与证据

**表 3（确定性采样，第 21 页）**。每个方法给两个数：见过的最低 FID，以及“FID 落在最低值 3% 以内”的最小 NFE。

| 采样方法 | CIFAR-10 无条件 VP：FID / NFE | CIFAR-10 无条件 VE：FID / NFE | ImageNet-64 类别条件：FID / NFE |
|---|---|---|---|
| 原始采样器 | 2.85 / 256 | 5.45 / 8192 | 2.85 / 250 |
| 我们的算法 1（Euler） | 2.79 / 512 | 4.78 / 8192 | 2.73 / 384 |
| + Heun 与我们的 $\{t_i\}$ | 2.88 / 255 | 4.23 / 191 | 2.64 / 79 |
| + 我们的 $\sigma(t)$ 与 $s(t)$ | 2.93 / **35** | 3.73 / **27** | – |
| 黑盒 RK45 | 2.94 / 115 | 3.69 / 93 | 2.66 / 131 |

这张表要横着读，不能只看 FID 列。VP 那一列最后 FID 从 2.85 变成 2.93，**变差了**，但 NFE 从 256 降到 35——论文的原话是 NFE 减少 7.3×（VP）、300×（VE）、3.2×（DDIM）。VE 那一列是唯一 FID 与 NFE 同时改善的：5.45/8192 → 3.73/27。第三列 ImageNet-64 的“–”表示该行与上一行相同，因为作者的采样器用的 $\sigma(t)$、$s(t)$ 与 DDIM 一致。

**表 2（训练改进，第 9 页）**。从 Song 等人的基线配置 A 一路加到配置 F，全部用作者的确定性采样器评估，NFE 固定 35（32×32）或 79（64×64）：

| 训练配置 | CIFAR-10 条件 VP | CIFAR-10 无条件 VP | FFHQ 64 VP | AFHQv2 64 VP |
|---|---|---|---|---|
| A 基线 | 2.48 | 3.01* | 3.39 | 2.58 |
| B + 调超参 | 2.18 | 2.51 | 3.13 | 2.43 |
| C + 重新分配容量 | 2.08 | 2.31 | 2.78 | 2.54 |
| D + 我们的预条件 | 2.09 | 2.29 | 2.94 | 2.79 |
| E + 我们的损失函数 | 1.88 | 2.05 | 2.60 | 2.29 |
| F + 非泄漏增广 | **1.79** | **1.97** | **2.39** | **1.96** |

（*：预训练模型。）配置 D 这一行值得单独看：换成作者的预条件之后，FID 几乎没动（2.08→2.09、2.31→2.29），64×64 上甚至变差（2.78→2.94、2.54→2.79）。论文自己的解释是：预条件的主要收益不是直接降 FID，而是让训练更稳，从而可以放心去改损失函数——真正的降幅出现在 E 行（$\lambda$ 与 $p_{\text{train}}$）和 F 行（增广）。把 D 行读成“预条件没用”是误读；把它读成“预条件直接提升 FID”也是误读。

**表 4（随机采样，第 21 页）**。最优设置下：CIFAR-10 VP 2.27 / NFE 383，VE 2.23 / NFE 767，ImageNet-64 1.55 / NFE 511。对照确定性基线 2.93/35、3.73/27、2.64/79：随机性把 FID 压低，但 NFE 涨了一个数量级。

**协议差异必须一起引用**：
- CIFAR-10 的 1.79 是**类别条件**、1.97 是**无条件**，两者不能混说成“CIFAR-10 上 1.79”。
- 1.79/1.97 用**确定性**采样、NFE=35；ImageNet-64 的 1.55 用**随机**采样、NFE=511（`--S_churn=40 --S_min=0.05 --S_max=50 --S_noise=1.003`）。跨数据集比较 FID 时把采样器与 NFE 一起写出来，否则数字不可比。
- 1.36 是**重新训练**得到的 ImageNet-64 模型；1.55 是**只换采样器**、权重不变的结果。论文特意把这两条并列，用来说明采样器与训练是可分离的部件。
- FID 按 50000 张图算，且论文对每个配置算三次取最小值（README“Calculating FID”一节）。单次运行的数字会高于表中值。

**一个反直觉的结论**：图 5b/c 显示，模型变好之后随机采样的收益消失——CIFAR-10 上用作者训练配置时，最好的结果来自确定性采样，任何随机性都有害。这与“随机采样总是更好”的常见印象相反，也解释了为什么表 2 用确定性采样器评估训练改进。

## 5. 复现入口与首个验证

**官方仓库**：`https://github.com/NVlabs/edm`（commit `008a4e5`，2024-03-16）。实际读到的文件与结论：

- `training/networks.py:632-668` 的 `EDMPrecond.forward` 就是式 7 的逐行实现：`c_skip = sigma_data**2 / (sigma**2 + sigma_data**2)`、`c_out = sigma*sigma_data/(sigma**2+sigma_data**2).sqrt()`、`c_in = 1/(sigma_data**2+sigma**2).sqrt()`、`c_noise = sigma.log()/4`，最后 `D_x = c_skip*x + c_out*F_x`。默认 `sigma_data=0.5`，与表 1 一致。
- `training/loss.py` 的 `EDMLoss` 对应式 8 之后的训练目标：`sigma = (rnd_normal*P_std + P_mean).exp()`，`weight = (sigma**2 + sigma_data**2)/(sigma*sigma_data)**2`。同文件里 `VPLoss`、`VELoss` 保留旧写法，方便复现表 2 的配置 A。
- `generate.py:25-60` 的 `edm_sampler` 是算法 2 的参考实现，默认 `num_steps=18, sigma_min=0.002, sigma_max=80, rho=7, S_churn=0`；`generate.py:68-73` 的 `sampler_fn` 才暴露 `solver ∈ {euler, heun}` 与 `discretization/schedule/scaling`，用于复现表 3 的消融。
- `example.py` 是单文件最小示例：加载 pickle 里的 `ema` 网络，直接用 `num_steps=18` 采样 8×8 网格。README 给出的预期耗时：CIFAR-10 约 6 秒、FFHQ/AFHQv2 约 28 秒、ImageNet-64 约 5 分钟。

**权重与数据**：预训练权重在 `https://nvlabs-fi-cdn.nvidia.com/edm/pretrained/`（配置 F）与 `.../pretrained/baseline/`（配置 A），`dnnlib.util.open_url` 直接按 URL 加载，无需手动下载。FID 参考统计量在 `https://nvlabs-fi-cdn.nvidia.com/edm/fid-refs/`。训练数据需自备（CIFAR-10 用 `dataset_tool.py` 转成 zip）。

**依赖与算力**：README 要求 Python 3.8、PyTorch 1.12+、`environment.yml` 固定版本；采样 1 张以上高端 GPU，训练 8 张以上（作者用 V100/A100）。注意许可：代码是 CC BY-NC-SA 4.0，不是常见的 MIT/Apache。

**首个机制验证（不需要训练，约 10 分钟）**：验证式 7 的代数关系与图 1 右列的行为，这是全篇最容易读错的地方。

1. 构造 `EDMPrecond(img_resolution=32, img_channels=3)`，随机取 `x` 与一组 `sigma`（例如 `[0.002, 0.1, 1, 10, 80]`）。
2. 手工按表 1 的四个式子算 $c_{\text{skip}},c_{\text{out}},c_{\text{in}},c_{\text{noise}}$，与 `forward` 内部值比对，应在浮点误差内相等。
3. 在 `torch.no_grad()` 下、使用相同输入和条件取 `F = net.model(c_in*x, c_noise)`，检查重组的 `D = c_skip*x + c_out*F` 与 `net(x, sigma)` 在浮点误差内相同。这里要验证的是**原始网络输出与预条件后的去噪估计是两个不同对象**；两者的差异由跳连与缩放共同决定。比如 $\sigma\gg\sigma_{\text{data}}$ 时 $c_{\text{out}}\approx\sigma_{\text{data}}$，不能预设 $F$ 与 $D$ 相差某个固定数量级。
4. 用 `EDMLoss` 的权重公式检查 $\lambda(\sigma)c_{\text{out}}^2 \equiv 1$——这正是“有效权重被拉平”的含义。
5. 若要验证图 1b 的定性行为：加载 `edm-cifar10-32x32-cond-vp.pkl`，取同一张图加不同 $\sigma$ 的噪声，观察 $D_\theta$ 的输出随 $\sigma$ 增大逐渐趋于常数图（数据集均值），而不是趋于原图。

如果第 3 步对不上，先查 `sigma` 是否被 reshape 成 `(-1,1,1,1)`——广播错误会让 $c_{\text{skip}}x$ 与 $c_{\text{out}}F$ 的维度悄悄错位而仍能跑通。

## 6. 前后关联

- **被重排的前作**：[DDPM](02-ddpm.md) 的 $\beta_t,\bar\alpha_t$ 在表 1 里对应 VP 列；[DDIM](03-ddim.md) 对应 iDDPM+DDIM 列，本篇的采样器可以直接替换 DDIM 的采样器（$\sigma(t)=t$、$s(t)=1$ 与 DDIM 相同）。[Score-SDE](04-score-sde.md) 对应 VP/VE 两列，本篇把它的 SDE 拆成“概率流 ODE + Langevin 项”（式 6）。
- **被本篇直接使用的下游**：[LDM](06-ldm.md) 与 [DiT](07-dit.md) 都沿用 DDPM/ADM 那一套 $\epsilon$ 参数化与离散时间步，没有采用 EDM 的预条件；把 EDM 的采样器接到它们身上属于“换采样器不换权重”的实验，论文第 3 节声称这是 drop-in 的。
- **与输出参数化的关系**：[JiT](01-jit.md) 讨论“预测干净数据 vs 预测噪声”。EDM 的式 7 给出的答案是：不必二选一，用 $\sigma$ 相关的跳连让网络在两端之间连续过渡，这也是本篇与 JiT 最直接的技术联系。
- **少步生成方向**：[Consistency Models](10-consistency-models.md) 关注把整条轨迹压成一次映射；EDM 的 NFE=35 是“同一轨迹上更聪明的积分”，两者解决的不是同一个问题。

## 7. 局限与可检验问题

**论文自己承认的局限**：
- 随机采样器的四个参数 $\{S_{\text{churn}},S_{t\min},S_{t\max},S_{\text{noise}}\}$ 要按模型逐个网格搜索（附录 E.2），作者明确说这带来一个隐忧：如果把随机采样当作评估模型改进的主要手段，可能会反过来影响架构与训练的设计选择。
- 随机性带来的细节损失与色彩过饱和，作者归因于实际去噪器诱导出的向量场略非保守，只能用启发式手段（限制 $\sigma$ 区间、$S_{\text{noise}}>1$）压制，没有理论解释。
- 自适应求解器（RK45）在本问题上不划算（表 3 最后一行），但作者说“自适应求解器能否胜过调好的固定 schedule 仍是开放问题”。

**这份笔记额外指出的一点**：表 2 里配置 D（预条件）几乎不改善 FID，而配置 E（损失权重 + 噪声分布）一次降 0.2–0.4。如果只读摘要里的“preconditioning of the score networks”，会以为预条件是主要贡献；实际上它更像是让后续改动可行的稳定性前提。引用时把 D 与 E 分开说。

**两个小问题（均为未验证设想，不是论文结论）**：

1. **$\rho=7$ 是否与 $\sigma_{\text{data}}$ 绑定？** 论文在 CIFAR-10（$\sigma_{\text{data}}=0.5$）与 64×64 数据集上都用 $\rho=7$、$\sigma_{\min}=0.002$、$\sigma_{\max}=80$，没有扫 $\rho$。可检验做法：固定 `edm-cifar10-32x32-cond-vp.pkl` 与 `--steps=18`，只扫 `--rho ∈ {3,5,7,9,11}`，记录 FID 与 NFE=35 下的曲线；若最优点随数据集尺度漂移，说明 $\rho$ 应该由 $\sigma_{\min}/\sigma_{\text{data}}$ 决定而不是常数。
2. **$S_{\text{noise}}>1$ 的“补偿”能否用一次校准替代网格搜索？** 作者的解释是 $L_2$ 训练的去噪器倾向于多去掉一点噪声（回归到均值），所以要把新加噪声的方差放大一点。可检验做法：在固定 $\sigma$ 上测 $D_\theta$ 输出的残差方差与理论值之差，若这个偏差可测且稳定，就能直接解出 $S_{\text{noise}}$ 而不是搜 4 个参数的网格。

## 来源与版本

- 论文：[arXiv:2206.00364v2](https://arxiv.org/abs/2206.00364v2)（2022-10-11；PDF 页眉为 NeurIPS 2022）。本页核对的是这一版的第 2–5 节、表 1–4、算法 1–2，以及附录 B.6（预条件推导）、F.2（增广流程）、F.3（容量重分配）。
- 官方代码：[NVlabs/edm](https://github.com/NVlabs/edm)，commit `008a4e5316c8e3bfe61a62f874bddba254295afb`（2024-03-16）。读过的文件：`README.md`、`example.py`、`generate.py`、`training/networks.py`、`training/loss.py`。
- 图：`/papers/diffusion/05-edm-pipeline.png`，从上述 v2 PDF 第 2 页 Figure 1 区域渲染裁出（PyMuPDF 1.28.2，400 dpi），未重绘。
- 未做的事：没有下载任何预训练权重，没有运行采样或训练，没有复现任何 FID，也没有把论文的 V100 耗时换算成其他硬件。
