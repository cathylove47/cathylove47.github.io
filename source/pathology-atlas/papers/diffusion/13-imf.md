# 13｜iMF：把 MeanFlow 的目标改写成一次「合法的 $v$ 回归」

**论文**：Improved Mean Flows: On the Challenges of Fastforward Generative Models  
**作者**：Zhengyang Geng、Yiyang Lu、Zongze Wu、Eli Shechtman、J. Zico Kolter、Kaiming He（CMU / MIT / Adobe / THU；前两位共同一作）  
**发表**：CVPR 2026（CVF Open Access，pp. 30467–30476）；arXiv:2512.02012v1（2025-12-01）  
**定位**：一步生成（fastforward）；指出原始 MeanFlow 的训练目标依赖网络自身、且 CFG 尺度被冻结，给出等价改写 + 引导条件化 + 去 adaLN 的架构  
**核验**：2026-11-18 依 arXiv HTML v1 全文（§1–6、附录 A–B、Table 1–4、Fig 1–6）整理，页码/卷页取自 CVF Open Access 页面；代码对照 `Lyy-iiis/imeanflow` main 分支（最后推送 2026-02-27，最新提交 2026-02-19 `bf60cd7`），实读 `imf.py`、`models/imfDiT.py`、`configs/*.yml`、README。本页**未运行训练、采样或 FID 评测**，所有数字为论文报告值（README 另有复现值，第 5 节列出）。

| 项 | 内容 |
|---|---|
| 任务 | ImageNet 256×256 类条件生成，1-NFE（另报 2-NFE） |
| 输入 / 输出 | 潜空间噪声 $z_1\sim\mathcal{N}(0,I)$（32×32×4）→ 一次前向得到 $z_0$，VAE 解码 |
| 网络 | 潜空间 DiT 变体（patch 2，无 adaLN-zero，多 token in-context 条件），B/M/L/XL 共 89M–610M |
| 训练 | 完全从零（无蒸馏、无预训练对齐）；240 ep 做消融，640/800 ep 出正式结果 |
| 结果 | 1-NFE FID **1.72**（iMF-XL/2，610M，174.6 Gflops）；同规模原始 MeanFlow-XL 为 3.43 |
| 代码 / 权重 | JAX+TPU 官方实现；B/M/L/XL 四个 checkpoint 在 HuggingFace `Lyy0725/iMF`；另有 PyTorch 分支 |

## 原文摘要

> MeanFlow (MF) has recently been established as a framework for one-step generative modeling. However, its "fastforward" nature introduces key challenges in both the training objective and the guidance mechanism. First, the original MF's training target depends not only on the underlying ground-truth fields but also on the network itself. To address this issue, we recast the objective as a loss on the instantaneous velocity $v$, re-parameterized by a network that predicts the average velocity $u$. Our reformulation yields a more standard regression problem and improves the training stability. Second, the original MF fixes the classifier-free guidance scale during training, which sacrifices flexibility. We tackle this issue by formulating guidance as explicit conditioning variables, thereby retaining flexibility at test time. The diverse conditions are processed through in-context conditioning, which reduces model size and benefits performance. Overall, our $\textbf{improved MeanFlow}$ ($\textbf{iMF}$) method, trained entirely from scratch, achieves $\textbf{1.72}$ FID with a single function evaluation (1-NFE) on ImageNet 256$\times$256. iMF substantially outperforms prior methods of this kind and closes the gap with multi-step methods while using no distillation. We hope our work will further advance fastforward generative modeling as a stand-alone paradigm.

*来源：arXiv:2512.02012v1 摘要，逐字保留（含原文的加粗标记）。*

## 中文摘要

> MeanFlow（MF）近来已成为一步生成建模的一个框架。然而它的「fastforward」性质在训练目标与引导机制两方面都带来了关键挑战。第一，原始 MF 的训练目标不仅依赖底层真值场，还依赖网络自身。为解决这一点，我们把目标改写为对瞬时速度 $v$ 的损失，并由一个预测平均速度 $u$ 的网络来重新参数化。这一改写给出了更标准的回归问题，并提升了训练稳定性。第二，原始 MF 在训练时固定无分类器引导尺度，牺牲了灵活性。我们把引导表述为显式的条件变量来处理，从而在测试时保留灵活性。这些多样的条件通过 in-context conditioning 处理，既减小了模型规模又改善了性能。总体上，我们的改进版 MeanFlow（iMF）完全从零训练，在 ImageNet 256×256 上以单次函数评估（1-NFE）取得 1.72 的 FID。iMF 显著优于此前同类方法，并在不使用蒸馏的情况下缩小了与多步方法的差距。我们希望本工作进一步推动 fastforward 生成建模成为一种独立的范式。

*译文：对应上方原文逐句对译，未增删内容；数字与符号以英文原文为准。*

## 0. 三分钟摘要

**一句话**：MeanFlow 的问题不是「一步」这个想法，而是它的回归目标里塞了网络自己的输出；把目标换成与网络无关的瞬时速度 $v$、再换掉喂给 JVP 的切向量，训练就从「损失不降」变成正常回归。

**两处诊断**：

1. **目标依赖网络**。原始 MF 的伪目标 $u_{\text{tgt}}=(e-x)-(t-r)\,\mathtt{JVP}(u_\theta;e-x)$ 里有 $u_\theta$，所以损失不是标准回归，实测「只统计 $t\neq r$ 的样本」时损失**不降、方差大**（Fig. 3）。
2. **CFG 尺度被冻结**。原始 MF 在训练前定死 $\omega$，而最优 $\omega$ 会随训练长度、模型大小、NFE 变化（Fig. 4：训得越久、NFE 越多，最优 $\omega$ 越小）。

**两处修法**：

1. 用 MeanFlow 恒等式把 $v$ 写在左边当目标：$v=u+(t-r)\frac{d}{dt}u$，于是损失变成 $\|V_\theta-(e-x)\|^2$。这一步**与原始 MF 完全等价**（损失值一样），真正的改动在于把 JVP 的切向量从条件速度 $e-x$ 换成网络预测的 $v_\theta(z_t)$ —— 前者的条件方差会被 Jacobian 放大，后者不会。这才是「稳定性」的来源。
2. 把 $\omega$（以及 CFG 区间 $t_{\min},t_{\max}$）当作条件输入，训练时随机采样、推理时任意调；再把所有条件（含 $r,t,\mathbf{c}$）做成多条 in-context token，顺手删掉 adaLN-zero。

**成绩**（ImageNet 256×256，全从零训练）：B/2 从 MF 的 6.17 降到 3.39 且参数 133M→89M；XL/2 到 **1.72**（MF-XL 3.43），2-NFE 1.54。代价是 XL 的 Gflops 从 119 升到 174.6，不是等算力比较。

### 实验先看什么

Fig. 3（损失曲线，全文的动机图）→ Table 1(a)（换成 $v$-loss）→ Table 1(b)（引导条件化）→ Table 1(c)（in-context + 模型瘦身）→ Table 2（与 MF 全系统对比）。

## 1. 问题与核心判断

**MeanFlow 的设定**（沿用 [12-meanflow](12-meanflow.md)）：线性路径 $z_t=(1-t)x+te$，条件速度 $v_c=e-x$。定义两时刻间的平均速度

$$u(z_t,r,t)\triangleq\frac{1}{t-r}\int_r^t v(z_\tau)\,d\tau,$$

直接积分不可行，于是对 $t$ 求导得到 MeanFlow 恒等式

$$u(z_t)=v(z_t)-(t-r)\frac{d}{dt}u(z_t),\qquad \frac{d}{dt}u=\partial_z u\,v+\partial_t u\triangleq\mathtt{JVP}(u;v).$$

原始 MF 用 Eq.(6) 造目标：$u_{\text{tgt}}=(e-x)-(t-r)\mathtt{JVP}(u_\theta;e-x)$，再做 $\|u_\theta-\text{sg}(u_{\text{tgt}})\|^2$。里面有两处近似：边际 $v(z_t)$ 换成条件 $e-x$；真值 $u$ 换成网络输出 $u_\theta$。

**本文的判断**：

- 第 (i) 条：因为 $u_\theta$ 出现在目标里，它不是标准回归。作者不打算「造一个更好的目标」，而是**换坐标**——把恒等式反过来写成 Eq.(8) $v=u+(t-r)\frac{d}{dt}u$，让 $v$ 当唯一目标。
- 第 (ii) 条：$V_\theta$ 的输入里还有 $e-x$，这不是合法预测函数的输入（预测时拿不到 $e$）。于是把 JVP 的切向量改成 $v_\theta(z_t)$，$V_\theta=V_\theta(z_t)$。
- 第 (iii) 条：CFG 不是一个固定常数，而是一个应该被条件化的连续变量；最优值随模型能力移动，先验固定必然次优。

**一个容易读错的地方**：Eq.(9)(10) 与 Eq.(6)(7) **代数上完全等价**（把 $V_\theta$ 移项就是 $u$-loss），所以「改写为 $v$-loss」本身不改变优化问题。真正的改动只有两点：JVP 的切向量换成 $v_\theta$；$\omega$ 变成条件。理解这一点，才能解释为什么消融里「$v$-loss + 边界条件」和「$v$-loss + 辅助头」收益不同（差别只在 $v_\theta$ 的质量）。

**为什么切向量这么关键**：$v$-loss 的真实目标是边际 $v(z_t)=\mathbb{E}[v_c\mid z_t]$，而 JVP 对输入是线性的、会把切向量的方差按 Jacobian 放大。喂 $e-x$（单样本条件速度，方差大）时，放大后的噪声主导损失；喂 $v_\theta(z_t)$（已经边际化过）时不会。作者也用这句话回应「$V_\theta(z_t,e-x)$ 岂不是把目标泄漏了」：泄漏的只是条件速度，不是边际速度。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| 瞬时速度 $v$ | Flow Matching 学的那个场，$\frac{dz_t}{dt}=v(z_t,t)$，条件真值是 $e-x$ |
| 平均速度 $u(z_t,r,t)$ | 从 $r$ 到 $t$ 对 $v$ 的平均；一步采样就是 $z_r=z_t-(t-r)u$ |
| MeanFlow 恒等式 | $u=v-(t-r)\dot u$，把「积分」换成一个可微的局部关系 |
| JVP | Jacobian-vector product，$\partial_z u\cdot v+\partial_t u$；实现上一次前向 + 一次前向模式微分 |
| $v$-loss / $u$-loss | 目标是 $v$ 还是 $u$；后者在 MF 里因为目标不可知而退化成伪目标 |
| $u$-pred / $v$-pred | 网络输出的是平均速度还是瞬时速度；iMF 是 $u$-pred 参数化 $v$-loss |
| sg（stop-gradient） | 阻断梯度；在 MF 里包在目标上，在 iMF 里包在预测函数内部 |
| 边界条件 $v_\theta(z_t)=u_\theta(z_t,t,t)$ | $r\to t$ 时平均速度趋于瞬时速度，可零成本复用同一个网络 |
| CFG 区间 | 只在 $[t_{\min},t_{\max}]$ 内施加引导（$\omega=1$ 之外），提升多样性 |
| 1-NFE | 一次网络前向出图；带 CFG 的多步模型通常记作 $N\times2$ |

## 3. 核心方法与数据流

```text
采样 t, r ~ logit-normal(-0.4, 1.0)，排序取 t≥r；一半样本强制 r=t（退化为 FM）
采样 ω ~ p(ω)∝ω^(-β), ω∈[1, 8]；采样 t_min~U[0,0.5]、t_max~U[0.5,1.0]
z_t = (1-t)x + t e
网络前向两次（条件/无条件）拿 v_c, v_u → 构造引导目标 v_g = (e-x) + (1-1/ω)(v_c-v_u)
若 t∉[t_min,t_max]，把 ω 置 1（关掉引导）
对 u_θ(·) 做 jvp，切向量 = (v_c, 1, 0)  → 得到 u, du/dt, v
V = u + (t-r)·stopgrad(du/dt)
loss_u = ‖V - v_g‖²   （自适应加权）
loss_v = ‖v   - v_g‖²  （辅助头，只训练时用）
总损失 = loss_u + loss_v
```

### 3.1 目标改写（§4.1，Eq. 8–12）

$$V_\theta\triangleq u_\theta(z_t)+(t-r)\,\mathtt{JVP}_{\text{sg}}\big(u_\theta;v_\theta\big),\qquad \mathcal{L}=\mathbb{E}_{t,r,x,e}\big\|V_\theta-(e-x)\big\|^2 .$$

$v_\theta$ 有两种实现：

- **边界条件**：$v_\theta(z_t,t)=u_\theta(z_t,t,t)$，零额外参数、零额外推理开销。B/2 上就把 32.69→29.42（无 CFG）。
- **辅助 $v$ 头**：共享主干、最后 8 层分叉，输出 $v$；只用于训练时 JVP，推理不用。需要额外挂一个 Flow Matching 损失 $\|v_\theta-(e-x)\|^2$（否则分叉层拿不到梯度）。B/2 无 CFG 30.76、有 CFG 5.68。

**为什么仍保留 stop-gradient**：此时 sg 在 $V_\theta$ 内部，原则上不需要；但去掉会引入对 $\theta$ 的高阶梯度（JVP 里再对 $u_\theta$ 求导），优化更难。这是实现层面的取舍，不是公式要求。

### 3.2 引导即条件（§4.2，Eq. 13–15）

原始 MF 的引导场 $v_{\text{cfg}}=\omega v(z_t\mid\mathbf{c})+(1-\omega)v(z_t)$，等价写法（原文 Eq.(17)，引自 MF 的 Eq.(21)）：

$$v_{\text{cfg}}=(e-x)+\Big(1-\frac{1}{\omega}\Big)\big(u_\theta(z_t\mid t,t,\mathbf{c})-u_\theta(z_t\mid t,t,\varnothing)\big).$$

iMF 只是把 $\omega$ 从常数变成网络输入：

$$V_\theta(\cdot\mid\mathbf{c},\omega)\triangleq u_\theta(z_t\mid\mathbf{c},\omega)+(t-r)\,\mathtt{JVP}_{\text{sg}} .$$

训练时 $\omega\sim p(\omega)\propto\omega^{-\beta}$（偏向小值，$\beta=1$ 或 2），$\omega=1$ 恰好退化为无引导；区间条件下 $t\notin[t_{\min},t_{\max}]$ 时令 $\omega=1$。推理时可以自由扫 $( \omega,t_{\min},t_{\max})$，仍然是 1-NFE——这些值只是变成 embedding，不增加前向次数。

**收益不只是灵活**：B/2 上 $\omega$-条件只把 5.68 拉到 5.52（因为小模型的最优 $\omega$ 本来就好找），但 $\Omega$-条件到 4.57，其中很大一部分来自 CFG 区间；同时 $\omega=1$ 的「无引导」FID 从 30.76 改进到 20.95——**跨尺度训练本身提升了泛化**。这点值得单独记住。

### 3.3 多 token in-context 条件（§4.3）

条件集合有 $\{r,t,\mathbf{c},\omega,t_{\min},t_{\max}\}$ 六类。做法：每类过一个 2 层 MLP，复制成多个 token（类别 8 个，其余各 4 个），加类型 embedding，与图像 latent token 沿序列轴拼接，交给共享 Transformer。作者发现 DiT 里「in-context 不如 adaLN-zero」的结论在**每类用多个 token** 时被抹平。

副产品：可以彻底去掉 adaLN-zero。B 模型参数 133M→89M（深度宽度不变），FID 反而 4.57→4.09。再叠加 SwiGLU + RMSNorm + RoPE 到 3.82，训 640 ep 到 3.39。

### 3.4 采样

$$z_r=z_t-(t-r)\,u_\theta(z_t,r,t)\quad(\text{代码：}z_t-(t-r)u,\ t,r\ \text{取自 linspace})$$

1-NFE 即 $(r,t)=(0,1)$。多步时按 $t$ 网格逐段推进（`num_steps`），每段仍是一次前向。

### 3.5 超参（附录 Table 4）

$t,r$ 均为 logit-normal($-0.4,1.0$)，取 $\max/\min$ 保证 $t\ge r$；50% 样本强制 $r=t$（保留一半 FM 损失）；批 256（消融）/1024；lr 1e-4 恒定，warmup 10 ep；Adam($\beta$=0.9,0.95)，wd 0，dropout 0，EMA 0.9999；类别丢 0.1。

## 4. 实验与证据

**Table 1：三项消融（都是 MF-B/2 骨干，240 ep，1-NFE FID）**

| 项 | w/o CFG | w/ CFG | 参数 |
|---|---|---|---|
| 原始 MF | 32.69 | 6.17 | 133M |
| $V_\theta$，$v_\theta=u_\theta(z_t,t,t)$ | 29.42 | 5.97 | 133M |
| $V_\theta$，$v_\theta$ 来自辅助头 | **30.76** | **5.68** | 133M |
| + $\omega$-条件 | 25.15 | 5.52 | 133M |
| + $\Omega$-条件（含区间） | **20.95** | **4.57** | 133M |
| adaLN-zero → in-context | — | 4.09 | **89M** |
| + 先进 Transformer 块 | — | 3.82 | 89M |
| + 训 640 ep | — | **3.39** | 89M |

读法：无 CFG 时目标改写的收益（+3.27 / +1.93）比有 CFG 时（+0.20 / +0.49）大得多——作者的解释是有 CFG 的模型本身更「强」，同样的缺陷被引导掩盖了一部分。辅助头在有 CFG 时更好（5.68 vs 5.97），边界条件在无 CFG 时更好。在 MF-XL 上同一改动把 3.43 拉到 2.99，作者据此认为是「容量越大越吃这一改动」。

**Table 2：与原始 MF 的全系统对比（ImageNet 256×256，1-NFE）**

| 模型 | 参数 | Gflops | FID↓ | IS↑ |
|---|---|---|---|---|
| MF-B/2 | 131M | 23.1 | 6.17 | 208.0 |
| MF-M/2 | 308M | 54.0 | 5.01 | 252.0 |
| MF-L/2 | 459M | 80.9 | 3.84 | 250.9 |
| MF-XL/2 | 676M | 119.0 | 3.43 | 247.5 |
| iMF-B/2 | 89M | 24.9 | 3.39 | 255.3 |
| iMF-M/2 | 174M | 49.9 | 2.27 | 257.7 |
| iMF-L/2 | 409M | 116.4 | 1.86 | 276.6 |
| iMF-XL/2 | 610M | 174.6 | **1.72** | **282.0** |
| iMF-XL/2（2-NFE） | 610M | — | 1.54 | — |

**这里必须说清楚的两件事**：B/M 是**更小也更省**（89M vs 131M，24.9 vs 23.1 Gflops 基本持平）；但 L/XL 是**用更多算力换 FID**（XL：174.6 vs 119.0 Gflops，+47%）。论文明确写了「去掉 adaLN-zero 后无法同时对齐参数与算力，B/M/L/XL 只是代号」，所以「50% 相对提升」是 FID 口径，不是等算力口径。

**Table 3：与其它 1-NFE 从零训练方法对比**

| 方法 | 参数 | NFE | FID |
|---|---|---|---|
| iCT-XL/2 | 675M | 1 | 34.24 |
| Shortcut-XL/2 | 675M | 1 | 10.60 |
| MeanFlow-XL/2 | 676M | 1 | 3.43 |
| TiM-XL/2 | 664M | 1 | 3.26 |
| $\alpha$-Flow-XL/2+ | 676M | 1 | 2.58 |
| **iMF-XL/2** | 610M | 1 | **1.72** |
| **iMF-XL/2** | 610M | 2 | **1.54** |

蒸馏类里 FACM-XL/2 是 1.76、DMF-XL/2+ 是 2.16、$\pi$-Flow 2.85——即 iMF 的 1-NFE 已经压过「蒸馏得到的一步模型」。多步侧 SiT-XL/2 2.06、+REPA 1.42、SiD2 1.38、LightningDiT 1.35、DDT 1.26、RAE+DiT-DH 1.13，差距还在，但已经不是一个数量级。

**Fig. 4：最优 $\omega$ 是移动靶**。同一模型训得越久、NFE 越多，最优 $\omega$ 越小；XL 2-NFE 的推荐配置是 $\omega=4.0$、区间 [0.36,0.64]，而 B/2 是 $\omega=8.0$（README 的 `eval_config.yml` 也是这组数）。这就是「训练前定死 $\omega$」站不住的直接证据。

**Fig. 3：损失曲线**（仅 $t\neq r$ 样本，$\ell_2$、无自适应权重、无 CFG）：原始 MF 的损失非降且抖动，iMF 正常下降。这是全文最直接的一张动机图，也是最容易被忽略的一张——它说明问题不在最终 FID，而在优化过程本身。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库：[Lyy-iiis/imeanflow](https://github.com/Lyy-iiis/imeanflow)，JAX + TPU（基于 `Gsunshine/meanflow`，指向原 MF 的 JAX 实现）；`tree/torch` 有 PyTorch 分支。
- **有权重**：B/M/L/XL 的 `-2.zip`（推理版）与 `-2-full.zip`（含训练态），挂在 HF `Lyy0725/iMF`；FID 统计量也给了两份（TPU/JAX 版与 GPU/PyTorch 版），这点很少见。
- README 自己报了复现值：B/2 3.37（论文 3.39）、M/2 2.27、L/2 1.85、XL/2 1.70、XL 2-NFE 1.53，差异归因于评测环境。
- 目录：`imf.py`（模型 wrapper + 损失 + 引导）、`models/imfDiT.py`（DiT 与 in-context token）、`configs/`（`train_config.yml`、`eval_config.yml`）、`train.py`、`main.py`、`prepare_dataset.py`（先把 ImageNet 编码成 latent）。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| Eq.(12) $V_\theta=u_\theta+(t-r)\mathtt{JVP_{sg}}(u_\theta;v_\theta)$ | `imf.py` `forward`：`u, du_dt, v = jax.jvp(u_fn, (z_t,t,r), (v_c, 1, 0), has_aux=True)`；`V = u + (t-r)*stop_gradient(du_dt)`（第 373–376 行） |
| Eq.(10) $v$-loss + 自适应权重 | 同文件 `loss_u`，`adp_wt_fn=(loss+0.01)**1.0` 后相除（第 380–386 行） |
| Eq.(17) 引导目标 | 同文件 `guidance_fn`：`v_g = v_t + (1-1/w)*(v_c-v_u)`（第 313–325 行） |
| CFG 区间（$t\notin$ 区间则 $\omega=1$） | 同函数 `w = jnp.where((t>=t_min)&(t<=t_max), w, 1.0)` |
| Eq.(15) $\omega$ 条件 | `models/imfDiT.py` `_build_sequence`：`omega_embedder(1 - 1/w)`，即嵌入的是 $1-1/\omega$ 而非 $\omega$ |
| 多 token in-context | 同文件 `_build_sequence`：class 8 + ω 4 + $t_{\min}$ 2 + $t_{\max}$ 2 + time 4 个 token 与图像 token 拼接 |
| 辅助 $v$ 头（最后 8 层分叉） | 同文件 `imfDiT`：`shared_blocks` → `u_heads` / `v_heads`（`aux_head_depth=8`） |
| 去掉 adaLN-zero | `TransformerBlock`：无 adaLN，改用零初始化逐通道 `attn_scale`/`mlp_scale` 门控 + RMSNorm + SwiGLU + RoPE |
| 一步采样 | `imf.py` `sample_one_step`：`z - (t-r)u` |
| 50% 样本 $r=t$ | `sample_tr` 里 `data_proportion=0.5` 的 `fm_mask` |

**代码与论文不一致 / 读代码要留意的地方**

1. **$\omega_{\max}$**：论文写 $[1.0,8.0]$，代码 `sample_cfg_scale(bz, s_max=7.0)` 默认 7.0。而 README 的评测配置用 $\omega=8.0$（B）到 10.5（M/L），已超出训练上界，属于外推。复现时若换 $\omega$，先确认这个上界。
2. **区间 token 数**：论文 Table 4 写 interval tokens = 4，代码 `num_interval_tokens=2`，$t_{\min}$ 与 $t_{\max}$ 各 2 个（合计 4 个 token，但按类型是 2+2）。表述口径差异，不是实现错误。
3. **模型不对 $t$ 单独条件**：`imfDiT.__call__` 注释明说「只条件于 $h=t-r$，不显式条件于 $t$」（沿用 MF 的做法，见 Table 4 的 `$t-r$`），因此 `t` 参数实际只用于算 $h$。想改条件方式时别被签名误导。
4. **`cond_drop` 丢的是连续前缀**：它先按概率抽 `num_drop`，再用 `arange(bz) < num_drop` 丢掉批首的样本，而不是丢掉被抽中的那些。统计上等价于「随机数量、固定位置」，若对 batch 内样本顺序敏感（如分布式切分）需要留意。
5. **JVP 的切向量用 $v_c$（条件预测）而非常量**：与 Alg. 2 伪代码一致，但注意 `has_aux=True` 使 `v` 在同一个 `jvp` 里返回，所以辅助头的前向被复用了一次，成本比「再走一遍网络」低。
6. **`v_g` 与 `v_c` 的 stop-gradient 位置**：`v_g` 在算损失前 `stop_gradient`，但 `v_c` 作为 JVP 切向量仍带梯度——这是论文里「sg 在预测函数内部」的具体落点。

### 5.2 第一个该做的验证（不需要重训）

用 iMF-B/2 推理版 checkpoint（约 89M，单卡可跑）做三件事：

1. **复现 1-NFE FID 的 3.37**：`configs/eval_config.yml` 里 `num_steps: 1`、`interval: [[0.4,0.65]]`、`omegas: [8.0]`，50k 样本。如果对不上，先查 FID 统计量用的是 JAX 版还是 PyTorch 版。
2. **验「一圈 $\omega$ 的曲线」**：固定 checkpoint 与区间，扫 $\omega\in\{1,2,4,6,8,10\}$ 画 FID/IS。论文的核心主张是「最优 $\omega$ 随配置移动、单模型可覆盖」，这条曲线是唯一能直接验证它的实验，且只花推理。
3. **验 $r\to t$ 的边界条件**：取随机 $z$，比较 $u_\theta(z,t,t)$ 与辅助头 $v_\theta(z,t)$（`u_fn` 返回的第二个输出）。论文说两者都是边际 $v$ 的估计，若差距很大，说明辅助头没训好，JVP 的切向量质量存疑——这正好对应 §4.1 的论证。

**迁移到病理的第一个问题**（我的建议，非论文内容）：把 iMF 用在一类条件的病理 patch 生成（例如 [Cytosyn](../pathology/66-cytosyn.md) 那种核/腺体布局条件）时，$\omega$ 可以被赋予语义——它控制「条件贴合强度」。如果训练时把 $\omega$ 与条件强度（如 mask 覆盖率、染色通道偏差）一起条件化，推理时就能在不重训的情况下调「更像参考」还是「更多样」。iMF 的 $\Omega$-条件框架正好留了这个口子，但论文只验证了 CFG 语义，病理语义未验证。

## 6. 前后关联

- **前作**：[12-meanflow](12-meanflow.md) 定义平均速度、恒等式与一步采样；本页的每一处改动都对着它的一条近似。原 MF 论文的 Eq.(21) 是本文 Eq.(17) 的来源。
- **同族改进**：AlphaFlow（把 MF 目标拆开、从 FM 插值到 MF 的调度）、Decoupled MeanFlow（在预训练 FM 上微调，最后几层条件第二个时间步）、CMT（先用预训练 FM 提供显式回归目标做 mid-training）。本文强调这些与自己是正交的——它们改「怎么得到目标」，本文改「目标是什么形状」。
- **同期/后续**：[14-pmf](14-pmf.md)（pixel MeanFlow，同组，把 iMF 搬到像素空间，README 里 2026-02 已放出 JAX 与 PyTorch 版）——想看 iMF 去掉 tokenizer 后的行为，直接看它。
- **其它一步路线**：[10-consistency-models](10-consistency-models.md)（映射到轨迹起点）、Shortcut（两点与中点）、IMM（矩匹配）、[09-rectified-flow](09-rectified-flow.md)（把路径拉直）。区别在于 iMF 不改路径、不蒸馏，只改回归目标的坐标。
- **训练目标侧**：[08-flow-matching](08-flow-matching.md) 是它的极限情形（$r=t$ 时 $V_\theta=u_\theta=v_\theta$，损失退回 FM），这也是代码里保留 50% $r=t$ 样本的原因。
- **架构侧**：[07-dit](07-dit.md) 的 adaLN-zero 在这里被删掉；in-context 多 token 条件的做法与 DiT 原文的结论相反，值得对照读。
- **引导侧**：CFG 区间来自 Fang et al. 的「CFG interval」，本文把它从推理技巧变成训练条件。

## 7. 局限与可检验问题

**作者承认的 / 从数字能直接看出的**：

1. **不是等算力比较**。iMF-XL 用 174.6 Gflops（MF-XL 119.0），FID 3.43→1.72 里有多少来自算力、多少来自目标改写，论文没有拆开。B 模型倒是干净的对照（89M/24.9 Gflops vs 131M/23.1 Gflops，6.17→3.39）。
2. **只在 ImageNet 256×256、只在类条件上验证**。文本条件、多条件、分辨率扩展都没做。
3. **仍依赖 VAE tokenizer**。结论里作者自己指出：1-NFE 变快之后 tokenizer 解码成了不可忽视的开销，这是下一步该动的部件。
4. **训练成本没报**。240 ep 消融 / 640–800 ep 正式结果，TPU 数量与 wall-clock 都未给，无法判断「从零训练」的实际代价。
5. **辅助头是「白拿」还是「必需」说不清**：无 CFG 时边界条件更好（29.42 vs 30.76），有 CFG 时辅助头更好（5.68 vs 5.97），作者归因于容量，但没有中间规模的证据。

**我的看法（作者没写的）**：

1. **「等价改写」这个卖点被过度强调了**。Eq.(9)(10) 与 Eq.(6)(7) 在代数上就是同一个损失；真正的贡献是「JVP 的切向量要用边际 $v$ 而不是条件 $e-x$」。这句话其实可以独立成一条洞察，且能解释 Fig. 3 的全部现象。按现在的写法，读者容易以为改写本身有魔力。
2. **边界条件与辅助头的关系没讲透**。$u_\theta(z_t,t,t)$ 之所以能当 $v$，是因为 $r\to t$ 时平均退化为瞬时；但网络在 $r=t$ 附近的训练样本只有那 50%，这一点对 $v$ 估计质量的影响没有分析。
3. **$\Omega$-条件的 1.11 FID 收益主要来自 CFG 区间**，而区间是「推理技巧训练化」，与「引导即条件」这个概念贡献可以分开评估。论文把两者打包成 $\Omega$，读者无法判断哪一半更重要。
4. **去 adaLN 的收益与「多 token in-context」的收益混在一起**。Table 1(c) 一次改了条件方式和参数共享方式，4.57→4.09 里两者各占多少不清楚。

**可检验的问题**：

- **Q1（等算力）**：把 iMF-XL 的 Gflops 压到 119（减深度或宽度），FID 还是不是优于 MF-XL 的 3.43？如果不是，那「50% 相对提升」里相当一部分是算力。
- **Q2（切向量的因果）**：固定 $V_\theta$ 的形式，只把 JVP 切向量在 $\{e-x,\ v_\theta,\ \text{EMA 版 } v_\theta\}$ 之间切换，看 Fig. 3 的损失曲线与最终 FID。这能直接验证「方差被 Jacobian 放大」这个解释。
- **Q3（病理迁移）**：在 WSI patch 上，tokenizer 换成病理 VAE 后，1-NFE 是否仍成立？病理纹理的高频成分多，一步映射的信息瓶颈可能比自然图像更早出现。

## 8. 来源与版本

- arXiv 摘要页：<https://arxiv.org/abs/2512.02012>（v1，2025-12-01；`citation_online_date` 显示 2026-05-09 有更新记录）
- arXiv HTML 全文：<https://arxiv.org/html/2512.02012v1>（本页公式号、表号、节号均指此版本）
- CVPR 2026 Open Access：<https://openaccess.thecvf.com/content/CVPR2026/html/Geng_Improved_Mean_Flows_On_the_Challenges_of_Fastforward_Generative_Models_CVPR_2026_paper.html>（pp. 30467–30476，已确认页面可访问、作者与标题一致）
- 代码：<https://github.com/Lyy-iiis/imeanflow>（main，最后推送 2026-02-27；实读 `imf.py`、`models/imfDiT.py`、`configs/train_config.yml`、`configs/eval_config.yml`、README）
- 权重：<https://huggingface.co/Lyy0725/iMF>（B/M/L/XL 的推理版与 full 版，另有 FID 统计量）
- 前作代码：<https://github.com/Gsunshine/meanflow>（iMF 的实现基于它）
- PyTorch 分支：<https://github.com/Lyy-iiis/imeanflow/tree/torch>（未逐行核对，本页的公式↔代码映射均基于 JAX 主线）

本页未运行任何训练、采样或评测；第 5 节的三个检查是建议，不是已执行结果。所有数字来自上述 v1 HTML 的指定表/节与官方 README。
