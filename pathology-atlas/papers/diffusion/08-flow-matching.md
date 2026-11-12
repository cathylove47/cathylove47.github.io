# 08｜Flow Matching：把「怎么从噪声走到数据」从 SDE 里拆出来

**论文**：Flow Matching for Generative Modeling  
**作者**：Yaron Lipman、Ricky T. Q. Chen、Heli Ben-Hamu、Maximilian Nickel、Matt Le（Meta AI / FAIR；Weizmann Institute of Science）  
**发表**：ICLR 2023（Poster）  
**定位**：连续归一化流（CNF）的 simulation-free 训练；条件路径与边缘路径的关系；OT 条件路径  
**核验**：arXiv:2210.02747v2（2023-02-08，28 页，页眉仍为 "Preprint"）；ICLR 2023 接收信息取自 iclr.cc 虚拟会场与 OpenReview（forum `PqvMRDCJT9t`）。本页只做文本与代码阅读，**未运行任何模型训练、采样或 FID 评测**。

| 项 | 内容 |
|---|---|
| 任务 | 无条件图像生成、图像超分（64×64→256×256） |
| 输入 / 输出 | 输入 $x_0\sim\mathcal{N}(0,I)$，输出 $x_1\sim q(x_1)$；训练时只见到数据样本，见不到密度 |
| 关键对象 | 概率路径 $p_t$ 与生成它的向量场 $u_t$（$t=0$ 噪声，$t=1$ 数据） |
| 训练目标 | 回归条件向量场（CFM），与不可解的边缘目标同梯度 |
| 代码现状 | 论文未随文发布 2023 年实验代码；`facebookresearch/flow_matching` 是 2024 年后的库，见第 5 节 |

## 原文摘要

> We introduce a new paradigm for generative modeling built on Continuous Normalizing Flows (CNFs), allowing us to train CNFs at unprecedented scale. Specifically, we present the notion of Flow Matching (FM), a simulation-free approach for training CNFs based on regressing vector fields of fixed conditional probability paths. Flow Matching is compatible with a general family of Gaussian probability paths for transforming between noise and data samples—which subsumes existing diffusion paths as specific instances. Interestingly, we find that employing FM with diffusion paths results in a more robust and stable alternative for training diffusion models. Furthermore, Flow Matching opens the door to training CNFs with other, non-diffusion probability paths. An instance of particular interest is using Optimal Transport (OT) displacement interpolation to define the conditional probability paths. These paths are more efficient than diffusion paths, provide faster training and sampling, and result in better generalization. Training CNFs using Flow Matching on ImageNet leads to consistently better performance than alternative diffusion-based methods in terms of both likelihood and sample quality, and allows fast and reliable sample generation using off-the-shelf numerical ODE solvers.

*来源：arXiv:2210.02747v2 第 1 页。逐字复制，仅合并 PDF 换行；破折号与连字符保持原样。*

## 中文摘要

> 我们提出一种建立在连续归一化流（Continuous Normalizing Flows, CNFs）之上的生成建模新范式，使我们能够以前所未有的规模训练 CNF。具体而言，我们提出 Flow Matching（FM）这一概念：一种基于回归固定条件概率路径的向量场、无需模拟（simulation-free）的 CNF 训练方法。Flow Matching 适用于在噪声与数据样本之间做变换的一大类高斯概率路径——它把已有的扩散路径作为特例包含在内。有趣的是，我们发现用 FM 配合扩散路径训练，会得到一种更稳健、更稳定的扩散模型训练替代方案。此外，Flow Matching 为用其他非扩散概率路径训练 CNF 打开了大门。其中一个特别值得关注的实例，是用最优传输（Optimal Transport, OT）位移插值来定义条件概率路径。这些路径比扩散路径更高效，带来更快的训练与采样，并得到更好的泛化。在 ImageNet 上用 Flow Matching 训练 CNF，在似然与样本质量两方面都稳定优于其他基于扩散的方法，并且可以用现成的数值 ODE 求解器实现快速、可靠的样本生成。

*译文：对应上方原文逐句对译，未增删内容。专有名词与数字以英文原文为准。*

## 论文框架图（原文 Figure 2）

![Flow Matching 的条件向量场对比](/papers/diffusion/08-flow-matching-pipeline.png)

> **Figure 2**：Compared to the diffusion path’s conditional score function, the OT path’s conditional vector field has constant direction in time and is arguably simpler to fit with a parametric model. Note the blue color denotes larger magnitude while red color denotes smaller magnitude.

*图源：arXiv:2210.02747v2 第 6 页，用 PyMuPDF 从官方 PDF 按原区域渲染（4× 缩放），未重绘、未改内容。*

**这张图在说什么。** 最左边一小格是实验设定：$p_0$ 是一个二维高斯（紫色密度），$x_1$ 是一个数据点（黑点）。中间四格画的是扩散路径的条件得分函数 $\nabla\log p_t(x\mid x_1)$，从左到右 $t=0,1/3,2/3,1$；右边四格画的是 OT 路径的条件向量场 $u_t(x\mid x_1)$。论文正文（p6）说明两个例子的起止高斯相同，区别只在「怎么走」。

读这张图要区分两个视角，否则很容易读错：

- **固定空间位置看（Eulerian）。** OT 条件场的方向不随 $t$ 改变：式 (21) 的分子 $x_1-(1-\sigma_{\min})x$ 与 $t$ 无关；幅值按 $1/[1-(1-\sigma_{\min})t]$ 增大，$t\to1$ 时由 $\sigma_{\min}$ 兜底。扩散条件得分的方向随 $t$ 改变，因为条件高斯的均值 $\mu_t(x_1)=\alpha_{1-t}x_1$ 在移动（方差 $\sigma_t$ 只影响幅值，不影响方向）；四个面板的箭头朝向因此不同。
- **沿一条粒子轨迹看（Lagrangian）。** OT 条件下速度恒定：把 $x=\psi_t(x_0)$ 代入式 (21)，分子化为 $(1-(1-\sigma_{\min})t)\big[x_1-(1-\sigma_{\min})x_0\big]$，与分母相消，得 $u_t=x_1-(1-\sigma_{\min})x_0$，与 $t$ 无关，所以轨迹是匀速直线。固定点的箭头变长**不是**粒子在加速，而是不同时刻经过该点的是不同粒子。

作者由此说 OT 条件场「更容易用参数模型拟合」——回归目标的方向不随时间改变。颜色是幅值提示（蓝大、红小），不是类别编码。这张图只说明**条件**场，不说明边缘场；边缘场是否也接近直线，是后面 Rectified Flow 才系统讨论的问题（见 [09-rectified-flow.md](09-rectified-flow.md)）。

## 0. 三分钟摘要

Flow Matching 先指定一条从噪声到数据的概率路径，再让网络学习对应速度。训练时直接构造路径上的样本和条件速度，不需要数值求解生成 ODE；生成时才进行积分。

## 它到底怎么做

1. 采样噪声与真实数据，选择可直接采样的条件概率路径。
2. 随机选一个时刻，构造该时刻的样本和条件速度。
3. 训练网络回归速度，训练阶段不运行 ODE 求解器。
4. 生成时从噪声出发，沿学习到的速度场积分到数据端。

### 实验先看什么

- 条件路径的最优传输性质，不等于学到的边缘流就是全局最优传输。
- 区分论文原始实验与后来作者维护的 flow_matching 库，不能把库示例直接当成原表复现。

## 1. 问题与核心判断

**要解决的具体问题。** 连续归一化流（CNF）本来用最大似然训练：把 $x_0$ 积到 $x_1$，算 $\log p_1(x)$，需要反复数值求解 ODE，前后向都要模拟，代价随维度上升得很快（第 5 节 Related Work 的原话是 "inherently difficult" 于高维图像）。扩散模型绕开了这个代价，但代价是把自己锁死在「由简单扩散过程导出的概率路径」里：路径形状由噪声调度决定，采样要么用很多步 SDE/ODE，要么额外训练快速采样器。

**这篇论文给的替代方案。** 不去训练「流」，而是先指定一条从噪声到数据的**概率路径** $p_t$，再回归生成这条路径的**向量场** $u_t$。直接回归 $u_t$ 不可行，因为 $u_t$ 是对所有数据样本积分出来的边缘量，写不出闭式。论文的关键观察是：把 $u_t$ 拆成「以单个样本 $x_1$ 为条件的向量场」的加权平均后，**用条件场做回归，与用边缘场做回归，对参数的梯度完全相同**。于是训练只需要采样一个 $x_1$、一个 $x_0$、一个 $t$，算出条件场，做最小二乘。整个过程不模拟 ODE，这叫 simulation-free。

**为什么这算「解锁」。** 一旦训练只依赖条件路径，路径就可以随便设计。论文给出一个统一的高斯族 $p_t(x\mid x_1)=\mathcal{N}(\mu_t(x_1),\sigma_t(x_1)^2 I)$：把 $(\mu_t,\sigma_t)$ 取成扩散的调度，就得到 DDPM/Score-SDE 的概率路径；取成线性插值 $\mu_t=tx_1,\ \sigma_t=1-(1-\sigma_{\min})t$，就得到最优传输（OT）位移插值路径。后者是这篇论文真正想推的东西：条件轨迹是直线、速度恒定，训练收敛更快，采样需要的函数评估次数（NFE）更少。

**一句话记住边界。** 条件 OT 路径最优，**不等于**学到的边缘向量场是最优传输映射。论文第 6 页自己写得很清楚："although the conditional flow is optimal, this by no means imply that the marginal VF is an optimal transport solution."

## 2. 术语（先用白话）

- **概率路径 $p_t$**：一列随时间变化的分布，$t=0$ 是纯噪声，$t=1$ 近似数据分布。它不是某条样本的轨迹，而是「此刻所有样本落在哪」的分布。
- **向量场 $v_t(x)$**：在时刻 $t$、位置 $x$ 处指向哪、走多快。给定起点，解 ODE 就得到一条轨迹。
- **流 $\phi_t$**：ODE 的解映射，$\phi_t(x_0)$ 是 $x_0$ 在 $t$ 时刻的位置。CNF 就是用神经网络参数化 $v_t$ 的流。
- **条件路径 $p_t(x\mid x_1)$**：只考虑「终点必须是这个 $x_1$」的那一族轨迹的分布。它是可采样、可写闭式的；边缘路径是它的混合。
- **边缘向量场 $u_t(x)$**：真正生成 $p_t$ 的场，等于所有经过 $x$ 的条件场按「此刻此地有多少质量」加权平均。
- **simulation-free**：训练时不需要解 ODE。这里靠的是条件目标的梯度等价性，不是靠近似。
- **OT 位移插值**：在两个高斯之间按线性方式搬质量，$\mu_t=tx_1$、$\sigma_t$ 线性收缩；它是这两个高斯之间的 Wasserstein-2 最优传输映射（论文引 McCann 1997 的 Example 1.7）。
- **NFE**：number of function evaluations，采样时调用网络的次数。它和「积分步数」不是一回事：自适应求解器一步可能评估多次。

## 3. 核心方法与数据流

### 3.1 先把 CNF 写清楚

CNF 由 ODE 定义（式 (1)(2)，第 2 节）：

$$
\frac{d}{dt}\phi_t(x)=v_t(\phi_t(x)),\qquad \phi_0(x)=x .
$$

$v_t$ 生成概率路径 $p_t$ 的意思是：若 $x_0\sim p_0$，则 $\phi_t(x_0)\sim p_t$。等价地，$p_t$ 与 $v_t$ 满足连续性方程。

### 3.2 训练目标：从不可解到可解

理想目标是式 (5)：$\mathcal{L}_{\mathrm{FM}}(\theta)=\mathbb{E}_{t,p_t(x)}\|v_t(x)-u_t(x)\|^2$。问题是 $u_t$ 未知且含积分。

论文的构造分两步（第 3.1、3.2 节）：

1. 指定条件路径 $p_t(x\mid x_1)$，令 $p_0(x\mid x_1)=\mathcal{N}(0,I)$、$p_1(x\mid x_1)=\mathcal{N}(x_1,\sigma_{\min}^2 I)$；
2. 用条件路径混合出边缘路径（式 (6)），并用条件场加权平均出边缘场（式 (8)）：

$$
p_t(x)=\int p_t(x\mid x_1)q(x_1)\,dx_1,\qquad
u_t(x)=\int u_t(x\mid x_1)\frac{p_t(x\mid x_1)q(x_1)}{p_t(x)}\,dx_1 .
$$

**Theorem 1**（第 3 页）：这样定义的 $u_t$ 确实生成 $p_t$。**Theorem 2**（第 4 页）：在下式与式 (5) 之间只差一个与 $\theta$ 无关的常数，因此梯度相同：

$$
\mathcal{L}_{\mathrm{CFM}}(\theta)=\mathbb{E}_{t,q(x_1),p_t(x\mid x_1)}\big\|v_t(x)-u_t(x\mid x_1)\big\|^2 .\tag{9}
$$

这就是全部训练流程：采样 $x_1\sim q$、$x_0\sim\mathcal{N}(0,I)$、$t\sim U[0,1]$，构造 $x=\psi_t(x_0)$，回归 $u_t(x\mid x_1)$，反向传播。没有 ODE 求解，没有对抗，没有似然下界。

### 3.3 高斯族与条件场的闭式

取 $p_t(x\mid x_1)=\mathcal{N}(\mu_t(x_1),\sigma_t(x_1)^2I)$（式 (10)），对应的仿射流是 $\psi_t(x)=\sigma_t(x_1)x+\mu_t(x_1)$（式 (11)）。**Theorem 3** 给出**诱导这条仿射条件流 $\psi_t$** 的条件场（式 (15)，第 5 页）：

$$
u_t(x\mid x_1)=\frac{\sigma_t'(x_1)}{\sigma_t(x_1)}\big(x-\mu_t(x_1)\big)+\mu_t'(x_1).
$$

这里的“唯一”限定在给定 $\psi_t$ 的情形。同一个高斯密度路径 $p_t(\cdot\mid x_1)$ 可以由无穷多个向量场生成：连续性方程约束的是概率通量 $p_tu_t$ 的散度，可在通量中加入无散度分量。式 (15) 是与指定仿射流 $\psi_t$ 对应的那个条件场，而非生成该密度路径的唯一向量场。

把 $(\mu_t,\sigma_t)$ 代成不同调度，就得到不同方法：

| 路径 | $\mu_t(x_1)$ | $\sigma_t(x_1)$ | 条件场 |
|---|---|---|---|
| VE 扩散（式 16–17） | $x_1$ | $\sigma_{1-t}$ | $-\dfrac{\sigma'_{1-t}}{\sigma_{1-t}}(x-x_1)$ |
| VP 扩散（式 18–19） | $\alpha_{1-t}x_1$ | $\sqrt{1-\alpha_{1-t}^2}$ | 含 $T'(1-t)$ 的场，方向随 $t$ 改变 |
| OT（式 20–21） | $t x_1$ | $1-(1-\sigma_{\min})t$ | $\dfrac{x_1-(1-\sigma_{\min})x}{1-(1-\sigma_{\min})t}$ |

OT 这一行是论文的重点。它的条件流是

$$
\psi_t(x)=\big(1-(1-\sigma_{\min})t\big)x+t x_1,\tag{22}
$$

对应的 CFM 损失（式 (23)）退化成「回归终点减起点」：

$$
\mathcal{L}_{\mathrm{CFM}}(\theta)=\mathbb{E}_{t,q(x_1),p(x_0)}\Big\|v_t\big(\psi_t(x_0)\big)-\big(x_1-(1-\sigma_{\min})x_0\big)\Big\|^2 .
$$

注意这个式子和 [Rectified Flow](09-rectified-flow.md) 的目标函数在 $\sigma_{\min}=0$ 时形式一致：两者都在回归 $x_1-x_0$。差别在于论证的重点——FM 论证的是「条件目标与边缘目标同梯度」，RF 论证的是「reflow 会改变耦合、让路径变直」。两者不能互相替代解释。

### 3.4 采样

从 $x_0\sim\mathcal{N}(0,I)$ 出发，用任意现成 ODE 求解器积分 $\dot x=v_t(x)$ 到 $t=1$。论文用 dopri5（Dormand–Prince），绝对/相对容差 $10^{-5}$。第 6.2 节报告：FM-OT 达到与扩散模型相同数值误差大约只需要 **60% 的 NFE**（图 7 左，ImageNet-32 模型，256 个随机种子，与 1000 NFE 解比较逐像素 MSE）。

## 4. 实验与证据

设置（第 6 节 + 附录 E）：CIFAR-10、ImageNet 32/64/128；所有对比方法用**同一个** U-Net（Dhariwal & Nichol 2021 架构）、相同超参与训练轮数；这些是**无条件**模型，表中没有分类器引导或无分类器引导的设置；似然以 BPD 报，质量以 FID 报，NFE 是自适应求解器在 50k 样本上的平均值。

**Table 1（第 8 页，节选，全部为原表数字）：**

| 模型 | CIFAR-10 NLL / FID / NFE | ImageNet-32 NLL / FID / NFE | ImageNet-64 NLL / FID / NFE |
|---|---|---|---|
| DDPM | 3.12 / 7.48 / 274 | 3.54 / 6.99 / 262 | 3.32 / 17.36 / 264 |
| Score Matching | 3.16 / 19.94 / 242 | 3.56 / 5.68 / 178 | 3.40 / 19.74 / 441 |
| ScoreFlow | 3.09 / 20.78 / 428 | 3.55 / 14.14 / 195 | 3.36 / 24.95 / 601 |
| FM w/ Diffusion | 3.10 / 8.06 / 183 | 3.54 / 6.37 / 193 | 3.33 / 16.88 / 187 |
| **FM w/ OT** | **2.99 / 6.35 / 142** | **3.53 / 5.02 / 122** | **3.31 / 14.45 / 138** |

ImageNet-128 单列：FM-OT NLL 2.90、FID 20.9（表右半部分，与 GAN 类方法并列，其中 IC-GAN 因使用自监督 ResNet50 条件而未列入）。

**Table 2（第 9 页）图像超分，64×64→256×256，ImageNet 验证集：**

| 方法 | FID↓ | IS↑ | PSNR↑ | SSIM↑ |
|---|---|---|---|---|
| Reference（原验证集） | 1.9 | 240.8 | – | – |
| Regression | 15.2 | 121.1 | 27.9 | 0.801 |
| SR3 | 5.2 | 180.1 | 26.4 | 0.762 |
| FM w/ OT | 3.4 | 200.8 | 24.7 | 0.747 |

读这张表要一起看 PSNR/SSIM：FM-OT 的 FID 与 IS 明显好于 SR3，但 PSNR/SSIM 反而略低。论文引 SR3 作者的说法，认为 FID 更能反映生成质量；这是作者的取舍，不是「全面更好」。

**训练成本（附录 Table 3）：** CIFAR-10 有效 batch 256、2 张 GPU、1000 epochs、391k 迭代；ImageNet-64 有效 batch 2048、16 张 GPU、250 epochs、157k 迭代；ImageNet-128 batch 1536、32 张 GPU、571 epochs。论文第 8 页在 ImageNet-128 上对比 Dhariwal & Nichol 的 4.36M 迭代（batch 256）：FM 用 500k 迭代（batch 1.5k，模型大 25%），图像吞吐少 33%。

**该打折扣的地方：** CIFAR-10 上 FM-OT 的 FID 6.35 高于后来文献里同数据集的最优值，论文自己解释为「所用架构没有针对 CIFAR-10 调过」。NFE 是自适应求解器在固定容差下的平均值，不能与固定步数（如 DDIM 50 步）直接比。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对）

- 论文正文与附录没有给出代码链接；arXiv 摘要页的 "Code, Data and Media" 区块也没有关联代码条目。
- `facebookresearch/flow_matching` 仓库创建于 **2024-12-07**，描述是 "A PyTorch library for implementing flow matching algorithms"，对应的是 2024 年的《Flow Matching Guide and Code》（arXiv:2412.06264），**不是** 2023 年这篇论文的实验代码。许可证为 CC BY-NC 4.0，README 明确写 "In this version, we don't release pre-trained models"。
- 因此：**这篇论文的 Table 1 没有可直接运行的官方复现脚本**。要复现，需要按附录 E 自建 U-Net（Dhariwal & Nichol 架构）与训练循环；库只能提供路径/损失组件。

已实际读取的库文件（`facebookresearch/flow_matching`，main 分支）：

| 文件 | 作用 |
|---|---|
| `flow_matching/path/affine.py` | `AffineProbPath`：`sample`、`target_to_velocity`、`velocity_to_target`、`epsilon_to_velocity` 等；`CondOTProbPath` 的 docstring 写明 $\alpha_t=t,\ \sigma_t=1-t$，即论文的 OT 路径 |
| `flow_matching/loss/generalized_loss.py` | `MixturePathGeneralizedKL`，对应**离散** flow matching 的 KL 损失，不是本文的连续 CFM 目标 |
| `examples/image/train.py`、`examples/image/README.md` | CIFAR-10 与 blurred ImageNet 的从零训练示例；ImageNet 需先按官方脚本降采样到 32/64 |
| `flow_matching/solver/ode_solver.py` | ODE 求解器封装（采样用） |

依赖：Python ≥ 3.9、PyTorch ≥ 2.1（README）。数据：CIFAR-10 可自动下载；ImageNet 需自行申请并解压 `train_blurred.tar.gz`。

### 5.2 第一个该做的机制验证（不需要大模型）

**验证 Theorem 2 的梯度等价性。** 在二维高斯混合上，取 OT 路径，$u_t(x\mid x_1)$ 用式 (21) 算解析值；同时用数值积分/大量样本估计边缘场 $u_t(x)$（式 (8)），构造 $\mathcal{L}_{\mathrm{FM}}$。对同一个 $\theta$ 与同一批 $(x_0,x_1,t)$，比较 $\nabla_\theta\mathcal{L}_{\mathrm{CFM}}$ 与 $\nabla_\theta\mathcal{L}_{\mathrm{FM}}$ 的相对误差。若实现正确，两者应在采样误差内一致；不一致就说明条件场公式或加权写错了。这是纯 CPU 可完成的检查，也是后面所有结论的地基。

**第二个验证（针对论文自己的边界声明）。** 在同一个二维问题上，把学到的边缘场 $v_1$（或 $v_t$ 在若干 $t$ 上的取值）与解析的 OT 位移场比较。论文说边缘场不保证是 OT 解；如果实验里两者差异明显，就说明「条件 OT」这个卖点不能被误读成「学到的模型做最优传输」。这个差异本身也是 [09-rectified-flow.md](09-rectified-flow.md) 的出发点。

## 6. 前后关联

- 上游：[02-ddpm.md](02-ddpm.md) 的 VP 路径就是本文式 (18) 的特例；[04-score-sde.md](04-score-sde.md) 的概率流 ODE 与本文式 (19) 在条件层面重合（附录 D 有对照）。
- 采样侧：[03-ddim.md](03-ddim.md) 说明确定性采样可以复用同一训练目标；本文则说明训练目标本身可以脱离扩散过程。
- 概念对照（不是时间先后）：[05-edm.md](05-edm.md)（2022-06）与本文（2022-10 初版）都把「概率路径 / 预条件 / 求解器」当作可以分别设计的对象；EDM 走的是「用去噪器重参数化扩散 ODE」，本文走的是「直接回归生成路径的向量场」。两者是同期平行的工作，本文不是 EDM 的后续。
- 同目标的其他路线：[09-rectified-flow.md](09-rectified-flow.md) 用同样的线性插值目标，但把重点放在耦合与 reflow；[10-consistency-models.md](10-consistency-models.md) 走的是另一条少步路线（蒸馏/自训练），不依赖路径变直。
- 架构侧：[06-ldm.md](06-ldm.md)、[07-dit.md](07-dit.md) 提供的是骨干网络与潜空间，与本文的「训练目标」正交，可以组合。
- 本站像素空间路线的对照：[01-jit.md](01-jit.md)。

## 7. 局限与可检验问题

**论文自身的局限（有原文依据）：**

1. 条件 OT 最优不蕴含边缘 OT 最优（第 6 页原话）。所以「OT 路径」这个名字容易被读过头。
2. 实验只到 128×128，且是无条件生成 + 超分；没有 class conditioning、classifier-free guidance 的对照。
3. 训练成本仍然可观：ImageNet-128 用了 32 张 GPU、571 epochs。
4. 路径族限定为对角高斯；非各向同性高斯、更一般的核被留作 future work（第 7 节 Conclusion）。

**本站推断（明确标注，未做实验）：**

- **问题 A：把条件配对从「随机独立」换成 batch 内匹配，边缘场会更接近 OT 吗？** 现在 $(x_0,x_1)$ 是独立采样的，条件直线会交叉。若在每个 batch 内做一次匈牙利匹配再构造 $x_t$，条件路径不变（仍是直线），但耦合变了。首个对比：二维高斯混合上测 $\mathbb{E}\|Z_1-Z_0\|^2$ 与路径弯曲度，和独立配对基线比。注意这已经接近 Rectified Flow 的 reflow 思路，做之前先读 [09-rectified-flow.md](09-rectified-flow.md) 的第 3.4 节，避免把「变直」误当成「最优」。
- **问题 B：$\sigma_{\min}$ 取多大合适？** 式 (21) 在 $t\to1$ 时分母趋于 $\sigma_{\min}$，数值上会放大误差。把 $\sigma_{\min}$ 从 0 扫到 $10^{-2}$，看 1-NFE/4-NFE 的样本质量与训练稳定性如何权衡。这是低成本、可直接证伪的问题。

## 8. 来源与版本

- [arXiv 摘要页](https://arxiv.org/abs/2210.02747)（v2，2023-02-08）
- [arXiv PDF v2](https://arxiv.org/pdf/2210.02747v2)（本页所有页码、公式号、表号均指此版本）
- [OpenReview forum](https://openreview.net/forum?id=PqvMRDCJT9t)
- [ICLR 2023 虚拟会场页面](https://iclr.cc/virtual/2023/poster/11309)
- [facebookresearch/flow_matching](https://github.com/facebookresearch/flow_matching)（2024 年库，非本文实验代码）
- [Flow Matching Guide and Code, arXiv:2412.06264](https://arxiv.org/abs/2412.06264)

本环境无法下载 OpenReview 的 camera-ready PDF（请求返回验证页），因此页码、公式号、表号均以 arXiv v2 为准；未核对 camera-ready 的排版差异。

本页未运行任何训练、采样或评测；第 5 节的两个验证是建议，不是已执行结果。文中所有数字均来自上述 v2 PDF 的指定表/节。
