# 14｜pMF：输出放在流形上，误差留在速度里，一步出像素图

**论文**：One-step Latent-free Image Generation with Pixel Mean Flows  
**作者**：Yiyang Lu、Susie Lu、Qiao Sun、Hanhong Zhao、Zhicheng Jiang、Xianbang Wang、Tianhong Li、Zhengyang Geng（CMU）、Kaiming He；除 Geng 外均属 MIT  
**发表**：ICML 2026（PMLR 306:81265–81277）；arXiv:2601.22158v1（2026-01-29，tech report）  
**定位**：把 JiT 的「网络直接输出干净图」与 iMF 的「损失定义在速度空间」拼成一个目标，第一次把「一步 + 不用潜空间」同时做到 ImageNet 256 上 FID 2.22、512 上 2.48  
**核验**：2026-11-18 依 arXiv HTML v1 全文（§1–7、附录 A/B、Table 1–8、Fig. 1–4、Algorithm 1–2）与 PMLR v306 论文页核对发表信息；代码对照 `Lyy-iiis/pMF` master 分支提交 `75f6073`（2026-02-19 最后推送，2026-02-04 首提交）。本页只读论文与代码，**未运行训练、采样或 FID 评测**；所有数字为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | 类条件 ImageNet 生成，256×256 / 512×512（另报 1024×1024）；**全部 1-NFE、纯像素** |
| 输入 / 输出 | 输入 $\mathbf{z}_1\sim\mathcal{N}(0,I)$，一次前向直接输出像素图 $\mathbf{x}_\theta$ |
| 关键对象 | 瞬时速度 $\mathbf{v}$、平均速度 $\mathbf{u}$、广义去噪图 $\mathbf{x}(\mathbf{z}_t,r,t)=\mathbf{z}_t-t\,\mathbf{u}$ |
| 训练方式 | 从零训练，无蒸馏、无预训练、无 tokenizer；Muon + batch 1024，160–360 epoch |
| 规模 | B/16 119M/34 Gflops，L/16 411M/117G，H/16 956M/271G（单次前向） |
| 代码 | 公开，MIT，JAX + TPU；Hugging Face 权重齐全（256/512 各 B/L/H） |
| 与潜空间方法的差别 | 没有 VAE 解码器那 310 Gflops（256）开销 |

## 原文摘要

> Modern diffusion/flow-based models for image generation typically exhibit two core characteristics: (i) using multi-step sampling, and (ii) operating in a latent space. Recent advances have made encouraging progress on each aspect individually, paving the way toward one-step diffusion/flow without latents. In this work, we take a further step towards this goal and propose "pixel MeanFlow" (pMF). Our core guideline is to formulate the network output space and the loss space separately. The network target is designed to be on a presumed low-dimensional image manifold (i.e., x-prediction), while the loss is defined via MeanFlow in the velocity space. We introduce a simple transformation between the image manifold and the average velocity field. In experiments, pMF achieves strong results for one-step latent-free generation on ImageNet at 256x256 resolution (2.22 FID) and 512x512 resolution (2.48 FID), filling a key missing piece in this regime. We hope that our study will further advance the boundaries of diffusion/flow-based generative models.

*来源：arXiv:2601.22158v1 摘要页，逐字保留。*

## 中文摘要

> 现代用于图像生成的扩散 / 流模型通常有两个核心特征：(i) 采用多步采样；(ii) 在潜空间中运作。近期的进展在两个方向上分别取得了令人鼓舞的成果，为「不用潜空间的一步扩散 / 流」铺平了道路。本文朝这一目标再走一步，提出 "pixel MeanFlow"（pMF）。我们的核心准则是把**网络输出空间**与**损失空间**分开设计。网络的目标被设定在假定的低维图像流形上（即 x-prediction），而损失则在速度空间里通过 MeanFlow 定义。我们给出了图像流形与平均速度场之间一个简单的变换。实验中，pMF 在 ImageNet 256×256（FID 2.22）与 512×512（FID 2.48）上取得了一步、无潜空间生成的强结果，补上了这一方向上关键的一块空白。我们希望本工作能进一步推动扩散 / 流生成模型的边界。

*译文：逐句对译上方原文摘要，未增删内容。*

## 0. 三分钟摘要

**一句话**：一步出图要求网络学「平均速度」$\mathbf{u}$，但 $\mathbf{u}$ 是含噪的高维量，学不动；把网络输出改成干净图 $\mathbf{x}$，再用 $\mathbf{u}=(\mathbf{z}_t-\mathbf{x})/t$ 换算回速度空间去算损失——输出在流形上，误差在高维里，两头都占。

**问题**：一步生成（MeanFlow 系列）与像素空间生成（JiT）各自都成立了，但样本量没变：一个网络既要覆盖整条 ODE 轨迹的所有起止点，又要在没有 tokenizer 的情况下自己完成降维，网络容量不够用。

**insight**：MeanFlow 的一步量 $\mathbf{u}$ 本质上是「噪声 + 数据」的混合体，在 patch 维 768 的像素空间里没有低维结构可依；而 $\mathbf{z}_t-t\mathbf{u}$ 恰好是去噪图，落在（近似）低维流形上。于是把**参数化**交给 $\mathbf{x}$，把**可计算的目标**留给 $\mathbf{v}$，中间用式 (8)/(11) 的 $1/t$ 换算连接。

**它到底做到了什么**：
- ImageNet 256：pMF-H/16 **2.22 FID**，1-NFE，956M 参数，271 Gflops；同类别里唯一的对手 EPG-L/16 是 8.82。
- ImageNet 512：pMF-H/32 **2.48 FID**，962M，272 Gflops（与 256 版几乎同算力）。
- 同样的网络、同样的 $\mathbf{v}$-loss，只把预测目标从 $\mathbf{u}$ 换成 $\mathbf{x}$：FID 从 **164.89 → 9.56**（256×256，B/16）。这是全文最锋利的一刀。
- 感知损失直接作用在输出图上，把 9.56 压到 **3.53**（约 6 个 FID 点）。

### 实验先看什么

Table 2（x- vs u-prediction 的崩塌）→ Fig. 3b（感知损失 6 点）→ Table 3a/3b（pre-conditioner 与时间采样都不能省）→ Table 6（256 系统对比）→ Table 7（512）。

## 1. 问题与核心判断

论文把现状拆成两条互相独立但**必须同时满足**的要求：

- **少步 / 一步**：一个网络要刻画 $\mathbf{u}(\mathbf{z}_t,r,t)$，即「从 $t$ 走到 $r$ 的平均速度」，$(r,t)$ 是二维索引。这要求网络在时间平面上去插值，而不是只沿一条轨迹。
- **像素空间**：没有预训练 tokenizer，网络必须自己完成压缩与抽象（manifold learning）。

两者各自都不便宜；合起来时作者明确说，**不应假设网络有无限容量**。所以问题不是「怎么把两个 loss 加起来」，而是「哪个量该由网络输出、哪个量该用来算误差」。

核心判断（我的归纳，论文的表述见 §4.2）：

> **输出空间由「目标是否低维」决定，损失空间由「目标是否可知」决定。**

- 在一般情形 $0<r<t$，$\mathbf{x}(\mathbf{z}_t,r,t)$ 并**没有**真实值可回归（论文承认它「不保证在流形上」，只是经验上像去噪图）；
- 而 $\mathbf{v}=\bm{\epsilon}-\mathbf{x}$ 永远可算，且 MeanFlow 恒等式 (6) 只在 $\mathbf{v}$ 空间里成立。

于是 $\mathbf{x}$ 当输出、$\mathbf{v}$ 当损失，是唯一自洽的组合。这个视角比「两个 trick 拼一起」更值得记住。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| 瞬时速度 $\mathbf{v}$ | 当前时刻轨迹的切线方向；线性路径下就是 $\bm{\epsilon}-\mathbf{x}$ |
| 平均速度 $\mathbf{u}(\mathbf{z}_t,r,t)$ | 从 $t$ 到 $r$ 这段路上的平均切线，一步就能从 $\mathbf{z}_t$ 跨到 $\mathbf{z}_r$ |
| MeanFlow 恒等式 | $\mathbf{v}=\mathbf{u}+(t-r)\,\mathrm{d}\mathbf{u}/\mathrm{d}t$；把「平均」和「瞬时」严格绑在一起 |
| JVP | Jacobian-vector product，一次前向就能同时算出 $\mathbf{u}$ 和 $\mathrm{d}\mathbf{u}/\mathrm{d}t$ |
| x-prediction | 网络直接吐干净图，而不是吐噪声或速度（JiT 的主张） |
| 广义去噪图 | 本文的 $\mathbf{x}(\mathbf{z}_t,r,t)\triangleq\mathbf{z}_t-t\mathbf{u}$，注意它由 $(r,t)$ 两个时间索引，是一张二维场而不是一条轨迹 |
| pre-conditioner | $c_{\text{skip}}\mathbf{z}_t+c_{\text{out}}\texttt{net}$ 这类缩放，EDM / CM 常用；$c_{\text{skip}}\neq0$ 时输出就不再是 $\mathbf{x}$ |
| guidance token | 把 CFG 尺度 $\omega$ 与引导区间 $[t_{\min},t_{\max}]$ 当作输入条件喂进网络，使引导不额外花前向 |

## 3. 核心方法与数据流

```text
采样 (t, r)：logit-normal(0.8, 0.8)，其中 50% 的样本强制 r = t（退化为 Flow Matching）
→ ε ~ N(0, I)，z_t = (1-t)·x + t·ε
→ u_fn(z, r, t) = (z - net(z, r, t)) / t        # 网络输出的是 x̂，这里换成 u
→ 用 u_fn(·, t, t) 得到当前预测的瞬时速度 v_c，配合 CFG 尺度 ω、区间 [t_min, t_max] 算出目标 v_g
→ jvp(u_fn, (z_t, r, t), (v_c, 0, 1)) 同时得到 u 与 du/dt
→ V = u + (t - r)·stopgrad(du/dt)；损失 ‖V - v_g‖²（这就是 v-loss）
→ 若 t < t_thr：x̂ = z_t - t·u，对 x̂ 与真值 x 加 LPIPS(0.4) + ConvNeXt 特征(0.1)
→ 采样：z ← z - (t - r)·u_θ(z, r, t)，num_steps = 1 即一步出图
```

### 3.1 三个场的换算（式 8、11）

训练目标侧（ground-truth 场，不依赖网络参数）：

$$\mathbf{x}(\mathbf{z}_t,r,t)\triangleq\mathbf{z}_t-t\cdot\mathbf{u}(\mathbf{z}_t,r,t) \qquad (8)$$

网络侧（把 JiT 的式 (4) 推广到两个时间）：

$$\mathbf{u}_\theta(\mathbf{z}_t,r,t)=\frac{1}{t}\big(\mathbf{z}_t-\mathbf{x}_\theta(\mathbf{z}_t,r,t)\big),\qquad \mathbf{x}_\theta:=\texttt{net}_\theta \qquad (11)$$

两式形式相同，于是「网络输出 $\mathbf{x}$」与「损失在 $\mathbf{v}$」可以共存：$\mathbf{x}\rightarrow\mathbf{u}\rightarrow\mathbf{V}$ 一路换算过去，最后仍然回归 $\mathbf{v}$。

### 3.2 广义流形假设（§4.2）

作者不是直接宣称 $\mathbf{x}$ 在流形上，而是先验证两个边界：

- $r=t$：$\mathbf{u}$ 退化为 $\mathbf{v}$，$\mathbf{x}(\mathbf{z}_t,t,t)=\mathbf{z}_t-t\mathbf{v}$，正是 JiT 的去噪目标；高噪声下它是多张可能图像的期望，因而偏糊、维度低（经典去噪文献的观察）。
- $r=0$：$\mathbf{u}=\frac{1}{t}\int_0^t\mathbf{v}\,\mathrm{d}\tau=(\mathbf{z}_t-\mathbf{z}_0)/t$，代回得 $\mathbf{x}(\mathbf{z}_t,0,t)=\mathbf{z}_0$，就是轨迹终点，天然在数据流形上。

中间情形 $0<r<t$ 没有证明，只有 Fig. 1 的模拟：沿用预训练 JiT-H/16 解出 ODE 轨迹，逐点算 $\mathbf{u}$ 与 $\mathbf{x}$；$\mathbf{u}$ 看起来仍是含噪图（论文把 $-\mathbf{u}$ 画出来才好辨认），$\mathbf{x}$ 看起来是干净或过度去噪的糊图。**这是全文最薄的一环：假设只被可视化支持，没有被度量。**

### 3.3 训练目标（式 12，Alg. 1）

$$\mathcal{L}_{\text{pMF}}=\mathbb{E}_{t,r,\mathbf{x},\bm{\epsilon}}\big\|\mathbf{V}_\theta-\mathbf{v}\big\|^2,\qquad \mathbf{V}_\theta\triangleq\mathbf{u}_\theta+(t-r)\cdot\mathtt{JVP}_{\text{sg}} \qquad (12)$$

$\mathtt{JVP}_{\text{sg}}$ 是 $\mathrm{d}\mathbf{u}_\theta/\mathrm{d}t$ 的雅可比-向量积，停止梯度后当作常数。作者明确说 JVP 的实现照抄 iMF，不是本文贡献。代码里 JVP 的切向量用的是**网络预测的** $\mathbf{v}_c$ 而不是真值 $\mathbf{v}$（`pmf.py` 注释："Different from original MeanFlow, we use predicted v in the jvp"）。

### 3.4 为什么感知损失在这里才自然（§4.4）

潜空间方法的 LPIPS 只在 VAE 训练时用得上，因为只有解码器直接吐像素。pMF 的 $\mathbf{x}_\theta$ 本身就是干净图，训练时可以直接和真值 $\mathbf{x}$ 算 LPIPS——这是「what-you-see-is-what-you-get」的直接红利。实现上只在 $t<t_{\text{thr}}$ 时加（否则预测图太糊，感知距离没意义），总目标 $\mathcal{L}=\mathcal{L}_{\text{pMF}}+\lambda\mathcal{L}_{\text{perc}}$。

### 3.5 CFG 被折进一次前向

网络额外接收 $\omega$、$[t_{\min},t_{\max}]$ 的 token（Table 8：guidance tokens 4、interval tokens 4）。因此 Table 6/7 里 pMF 的 "1" 是真的一次前向（含引导），而潜空间基线标的是 "$250\times2$"。这一点在各家对比表里常被忽略，读表时要留意；论文正文没有逐字说明「引导不额外花 NFEs」，依据是代码（`sample_one_step` 只调用一次 `u_fn`，$\omega$ 作为输入条件）与 Table 8 的 token 设计。

### 3.6 主要超参（Table 8）

Muon（$\beta_1,\beta_2=0.9,0.95$）、常数学习率 $10^{-3}$、无 warmup、无 weight decay/dropout、batch 1024、$(t,r)$ 用 logit-normal(0.8, 0.8)、$r\neq t$ 占 50%、$(t,r)$ 条件用 $t-r$、EMA half-life $\{500,1000,2000\}$ Mimg、LPIPS 权重 0.4、ConvNeXt 权重 0.1、$t_{\text{thr}}=0.8$。patch 16、aux-head 深度 8、bottleneck 128/128/256。512/1024 的长训练版本改用 logit-normal(0.0, 0.8) 采样器（作者称之为「把噪声尺度翻倍」），并以 10% 概率均匀采样 $(t,r)$、$t_{\text{thr}}$ 降到 0.6。

## 4. 实验与证据

**Table 2：预测目标决定生死**（B/16，序列长 162，MSE，160 epoch，无 bottleneck）

| 图像尺寸 | patch | patch 维 | $\mathbf{x}$-pred | $\mathbf{u}$-pred |
|---|---|---|---|---|
| 64×64 | 4 | 48 | 3.80 | 3.82 |
| 256×256 | 16 | 768 | **9.56** | **164.89** |

patch 维 48 时网络容量（768）远大于输入维，两种参数化都行；patch 维 768 时 $\mathbf{u}$ 彻底崩。这正是流形假设的可操作版本：**当观测维数超过网络能「记住」的规模时，只有低维目标学得动。**

**Fig. 2 玩具实验**：Swiss roll 经 $D\times2$ 列正交矩阵投到 $D$ 维，$D\in\{2,8,16,512\}$，7 层 ReLU MLP（256 隐单元），1-NFE。$\mathbf{u}$-prediction 随 $D$ 增大迅速崩坏，$\mathbf{x}$-prediction 稳。作者强调两者最小化的是**同一个** $\mathbf{v}$-loss，差别体现在训练损失本身——$\mathbf{x}$ 版损失更低。

**Fig. 3：优化器与感知损失**

| 设置 | 1-NFE FID |
|---|---|
| Adam，320 epoch | 11.86 |
| Muon，320 epoch | 8.71 |
| Muon + LPIPS(VGG)，160 epoch | 5.62 |
| Muon + LPIPS + ConvNeXt-V2，160 epoch | **3.53** |
| 基线（Muon + MSE，160 epoch） | 9.56 |

作者对 Muon 的解释值得记：MeanFlow 的 stop-grad 目标依赖网络自身输出，早期网络越准，目标越准，形成正反馈；多步扩散里这种「更快收敛」并没有换来最终更好，单步设定下却被放大。**这是相关解释，不是消融验证。**

**Table 3a：pre-conditioner 一律更差**（160 epoch，含感知损失）

| 参数化 | 1-NFE FID |
|---|---|
| 线性（$c_{\text{skip}}=1-t$） | 34.61 |
| EDM 式 | 14.43 |
| sCM 式 | 13.81 |
| 无 pre-conditioner（纯 $\mathbf{x}$） | **3.53** |

只要 $c_{\text{skip}}\neq0$，网络输出就偏离 $\mathbf{x}$ 空间，也就偏离低维流形。这条结果和 CM 系列的惯例正好相反，是本文立场最硬的证据。

**Table 3b：时间采样必须在整个 $(r,t)$ 平面**

| $(t,r)$ 采样 | 1-NFE FID |
|---|---|
| 只 $r=t$（= Flow Matching） | 194.53 |
| 只 $r=0$（≈ CM） | 389.28 |
| 两条线都采 | 106.59 |
| 全平面 $0\le r\le t$ | **3.53** |

少一条线都不行：MeanFlow 的关系是「整片场的可微结构」，退化成几条线就只剩退化目标。

**Table 4：分辨率不涨算力**（固定序列长 162，靠放大 patch）

| 分辨率 | 模型 | patch | patch 维 | 1-NFE FID |
|---|---|---|---|---|
| 256 | B/16 | 16 | 768 | 3.53 |
| 512 | B/32 | 32 | 3072 | 4.06 |
| 1024 | B/64 | 64 | 12288 | 4.58 |

patch 维涨到 12288 仍然能用，论据是「$\mathbf{x}$ 的内在维数不随分辨率线性增长」。

**Table 5：规模与时长的收益**

| 模型 | 深度/宽度 | 参数 | Gflops | 160 ep | 320 ep |
|---|---|---|---|---|---|
| B/16 | 16/768 | 119M | 34 | 3.53 | 3.12 |
| L/16 | 32/1024 | 411M | 117 | 2.85 | 2.52 |
| H/16 | 48/1280 | 956M | 271 | 2.57 | 2.29 |

**Table 6：ImageNet 256 系统对比**（摘录，FID/IS，50k 样本）

| 方法 | NFE | 空间 | 参数(解码器) | Gflops | FID↓ | IS↑ |
|---|---|---|---|---|---|---|
| DiT-XL/2 | 250×2 | latent | 675M (49M) | 119 (310) | 2.27 | 278.2 |
| SiT-XL/2 + REPA | 250×2 | latent | 675M (49M) | 119 (310) | 1.42 | 305.7 |
| RAE + DiT$^{\text{DH}}$-XL/2 | 50×2 | latent | 839M (415M) | 146 (106) | 1.13 | 262.6 |
| JiT-G/16 | 100×2 | pixel | 2B | 383 | 1.82 | 292.6 |
| PixelDiT-XL/16 | 100×2 | pixel | 797M | 311 | 1.61 | 292.7 |
| iMF-XL/2 | 1 | latent | 610M (49M) | 175 (310) | 1.72 | 282.0 |
| MeanFlow-XL/2 | 1 | latent | 676M (49M) | 119 (310) | 3.43 | 247.5 |
| StyleGAN-XL | 1 | pixel | 166M | 1574 | 2.30 | 260.1 |
| EPG-L/16 | 1 | pixel | 540M | 113 | 8.82 | – |
| **pMF-B/16** | 1 | pixel | 119M | 34 | 3.12 | 254.6 |
| **pMF-L/16** | 1 | pixel | 411M | 117 | 2.52 | 262.6 |
| **pMF-H/16** | 1 | pixel | 956M | 271 | **2.22** | 268.8 |

**Table 7：ImageNet 512**（摘录）

| 方法 | NFE | 空间 | Gflops | FID↓ | IS↑ |
|---|---|---|---|---|---|
| JiT-G/32 | 100×2 | pixel | 384 | 1.78 | 306.8 |
| StyleGAN-XL | 1 | pixel | 2061 | 2.41 | 267.8 |
| MeanFlow-RAE | 1 | latent | 643 (408) | 3.23 | – |
| sCT-XXL | 1 | latent | 552 (1230) | 4.29 | – |
| **pMF-B/32** | 1 | pixel | 34 | 3.70 | 271.9 |
| **pMF-L/32** | 1 | pixel | 118 | 2.75 | 276.8 |
| **pMF-H/32** | 1 | pixel | 272 | **2.48** | 284.9 |

**怎么读这两张表**：
1. 「一步 + 无潜空间」这一格里，pMF 把先前最好成绩（EPG 8.82）拉到 2.22，不是小幅改进。
2. 与 GAN 比：FID 2.22 vs StyleGAN-XL 2.30，算力 271 vs 1574 Gflops，**约 5.8 倍差距**。
3. 与潜空间一步模型比：iMF-XL/2 的 1.72 更好看，但它的真实成本是 175（生成器）+ 310（SD-VAE 解码器）= 485 Gflops；pMF-H 是 271。作者专门点名「解码器开销在一步时代不再可忽略」——512 上 SD-VAE 解码器要 1230 Gflops，比整个生成器还贵。
4. 与多步像素模型比：JiT-G/16 1.82 需要 100 步 × 383 Gflops；pMF 用 1 步 271 Gflops 拿到 2.22。**质量差 0.4 FID，推理成本差两个数量级。**

**训练算力**：论文只给 epoch 与 batch（1024），**没有报告墙钟时间或 TPU 卡时**。按 epoch × ImageNet 训练集（1,281,167 张）折算：B/16 160 ep ≈ 2.05 亿张前向，L/16 320 ep ≈ 4.10 亿，H/16 360 ep ≈ 4.61 亿。这个折算是我做的，论文未确认。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库：[Lyy-iiis/pMF](https://github.com/Lyy-iiis/pMF)，MIT，**JAX + TPU**（README 明确写 "written and tested on TPUs"），基于 iMF 的 JAX 代码库。
- 有：训练 `train.py` / `main.py`，损失与采样 `pmf.py`，模型 `models/pmfDiT.py`，感知损失 `utils/auxloss_util.py`，四份配置 `configs/pMF_{B,L}_{16,32}_config.yml`，评测脚本 `scripts/eval.sh`，FID 参考统计生成 `prepare_ref.py`。
- **有权重**：Hugging Face `Lyy0725/pMF`，256 与 512 的 B/L/H 各一份，另有完整训练态（`-full.zip`）和 `imagenet_{256,512}_fid_stats.npz`。
- 另有 `hsdp` 分支（pMF-H 的多机训练/推理）与 `torch` 分支（PyTorch 实现）——两个分支我**未逐行核对**。
- README 报告本仓库复现的 FID 比论文略好：H/16 **2.11**（论文 2.22）、L/16 2.50（2.52）、B/16 3.11（3.12）；512 的 H/32 为 2.37（2.48）。作者归因于 TPU/JAX 与原始评测设置的差异。
- 评测默认配置：`num_steps: 1`，$\omega=8.5$，区间 $[0.1,0.7]$，EMA 2000（B/16）；其余 checkpoint 的最优 $\omega$/区间/EMA 写在 `configs/eval_config.yml` 注释里（B/32：6.5、$[0.1,0.7]$、2000；L/16：7.0、$[0.2,0.7]$、1000；L/32：7.5、$[0.2,0.6]$、2000）。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| 式 (8)/(11) $\mathbf{u}=(\mathbf{z}_t-\mathbf{x}_\theta)/t$ | `models/pmfDiT.py` → `pmfDiT.__call__` 末尾 `u = (x - u) / jnp.clip(t, 0.05, 1.0)`（`x` 此处即 $\mathbf{z}_t$，head 输出的是 $\hat{\mathbf{x}}$） |
| 式 (12) $\mathbf{V}_\theta=\mathbf{u}+(t-r)\mathtt{JVP}_{\text{sg}}$ | `pmf.py` → `pixelMeanFlow.forward`：`jax.jvp(u_fn, (z_t, t, r), (v_c, dtdt, dtdr))`，`V = u + (t - r) * stop_gradient(du_dt)` |
| Alg. 1 的 $(t,r)$ 采样 | `pmf.py` → `sample_tr`（logit-normal，`data_proportion=0.5` 强制 $r=t$；`tr_uniform` 控制 10% 均匀） |
| Alg. 2 的 CFG 目标 | `pmf.py` → `guidance_fn`，`v_g = v_t + (1 - 1/w)*(v_c - v_u)`，区间外用 $\omega=1$ |
| §4.4 感知损失 | `pmf.py`：`pred_x = z_t - t * u`；`mask = t < perceptual_max_t`；`utils/auxloss_util.py` 做成对随机裁剪到 224 后算 LPIPS 与 ConvNeXt 特征距离 |
| 一步采样 | `pmf.py` → `sample_one_step`：`z_t - (t - r) * u` |
| Table 8 超参 | `configs/pMF_B_16_config.yml` + `configs/default.py` |

**代码与论文不一致 / 论文没写的地方**

1. **有一个辅助 $\mathbf{v}$ 头损失**。`forward` 里 `loss = loss_u + loss_v + aux_loss`，`loss_v` 是让并行的 $\mathbf{v}$ 头直接回归 $\mathbf{v}_g$，约占一半深度（`aux_head_depth=8`，共享主干后分叉）。论文式 (12) 只有一项，Table 8 只以「aux-head depth 8」暗示其存在。读代码复现时不能按论文只实现一项。
2. **网络实际不接收 $t$**。`pmfDiT.__call__` 注释：「We don't explicitly condition on time t, only on h = t - r」，出处是 arXiv:2502.13129（*Is Noise Conditioning Necessary for Denoising Generative Models?*）。论文式 (11) 写的是 $\mathbf{x}_\theta(\mathbf{z}_t,r,t)$，只在 Table 8 的「(t,r) cond: $t-r$」里交代了这件事。
3. **$\mathbf{v}$ 的真值被裁剪**：`v_t = (z_t - x)/clip(t, 0.05, 1.0)`，避免 $t\to0$ 时爆炸。论文式 (2) 没有这个裁剪。
4. **损失按样本自适应加权**：`adp_wt_fn(loss) = loss/((loss+ε)^p)`，$p=1$、$ε=0.01$，来自 iMF；论文正文未提，而它确实改变梯度尺度。
5. **ConvNeXt 那一项不是 LPIPS 式感知距离**：`auxloss_util.auxloss_fn` 取 ConvNeXt 分类器的**特征**，算两者平方 L2；注释写「Implementation following arXiv:2512.10953」（BiFlow）。
6. **噪声尺度存疑**：Table 8 写 `noise scale = image_size/256`（512 应为 2.0），但 `configs/eval_config.yml` 注释给的是 B/32 **2.0**、L/32 **4.0**——L/32 与公式对不上。哪个才是训练时所用**未确认**；加载 512 权重前必须逐个对齐，否则结果会明显偏。
7. `configs/default.py` 是 iMF 的默认值（lr 1e-4、batch 256、1000 epoch），**不覆盖**就等于在训另一个模型；必须用 `pMF_*_config.yml` 覆盖（lr 1e-3、batch 1024、Muon）。

### 5.2 第一个该做的验证

**不需要重训**：下 HF 上的 `pMF-B-16.zip` + `imagenet_256_fid_stats.npz`，按 README 跑 `scripts/eval.sh`，确认能复现 3.11 左右的 FID。这一步只验证「JAX/TPU 代码在 GPU 上跑得通、FID 统计对得上」，30 分钟内能出结论；若对不上，先查噪声尺度与 EMA 索引这两处（见上第 6 条），而不是怀疑模型。

**对病理真正有意义的那一步**（见 §7 的迁移问题）：把 pMF 的目标搬到 256×256 H&E tile 上，与 [JiT](01-jit.md)（100 步）对比，量三件事——(a) 1-NFE 与 100-NFE 的 FID 差距在组织图上是否也只有一个量级内的 0.4；(b) 感知损失换成病理编码器（UNI / CONCH）特征后，核形态是否更像；(c) 一步生成是否牺牲了 tile 之间的染色/扫描仪多样性（这决定它能否当作增广器用）。

## 6. 前后关联

- **参数化的来源**：[JiT](01-jit.md)（*Back to Basics*，CVPR 2026）主张网络输出干净图，本文直接继承其 $\mathbf{x}$-prediction 与式 (4)，并加了第二个时间索引。
- **一步建模的来源**：[MeanFlow](12-meanflow.md) 给出 $\mathbf{u}$ 的定义与恒等式，[iMF](13-imf.md) 把损失从 $\mathbf{u}$ 空间挪到 $\mathbf{v}$ 空间并提供 JVP 实现。pMF = iMF 的损失 + JiT 的输出，中间补一个 $1/t$ 换算。
- **与 CM/sCM 的关系**：CM 固定在 $r=0$ 这条线上，且常用 $c_{\text{skip}}\neq0$ 的 pre-conditioner；Table 3a/3b 正好把这两种做法各自证否一次。
- **与 CTM / FMM 的关系**：CTM 在训练时积分 ODE（贵），FMM 的 Flow Map 是位移 $\mathbf{z}_t-\mathbf{z}_r$（含噪，不在低维流形上）。作者认为这些量同样需要 re-parameterization 才能在高维像素空间工作。
- **流匹配基础**：[Flow Matching](08-flow-matching.md) 定义了 $\mathbf{v}$ 与线性路径；[Consistency Models](10-consistency-models.md) 是一步家族的对照坐标；[LDM](06-ldm.md) 是本文要绕开的潜空间方案。
- **病理侧**：一步像素生成对病理的实际意义是推理成本。[SuperDiff](../pathology/78-histo-diffusion.md)（超分）与 [Cytosyn](../pathology/66-cytosyn.md)（细胞合成）这类方法都要多步采样；若 pMF 式的 1-NFE 能保住组织学细节，它们的部署成本结构会变。

## 7. 局限与可检验问题

**作者承认或数据本身显示的**：
- 与最好的多步像素模型仍有差距：JiT-G/16 1.82（100 步、2B 参数）、SiD2 1.38；pMF-H 2.22。
- 与最好的潜空间一步模型也有差距：iMF-XL/2 1.72（但含解码器后总算力更高）。
- **广义流形假设的中间情形没有证明**，只有 Fig. 1 的可视化；$r\in(0,t)$ 时 $\mathbf{x}$ 是否真在低维流形上，全靠下游 FID 间接支持。
- 训练墙钟时间、TPU 卡时未报告，无法判断「一步」省下的推理成本是否被更长训练抵消。
- 未探索对抗损失（作者自己指出 latent 方法里它与感知损失常配对使用）。

**我的看法（作者没写的）**：
1. **$1/t$ 换算是把双刃剑**。因为 JVP 是对含 $1/t$ 的 $\mathbf{u}_\theta$ 求的，$\partial\mathbf{u}/\partial t=-(1/t)\partial\mathbf{x}/\partial t-(\mathbf{z}_t-\mathbf{x})/t^2$，第二项来自换算本身。也就是说 $\mathbf{V}_\theta$ 里混进了一项与「当前去噪残差」成正比的东西——这可能是有效信号（它正是 $\mathbf{v}$ 的一部分），也可能是 $t$ 很小时数值不稳的来源（代码用 `clip(t,0.05,1)` 挡住）。论文没有拆解这一项，值得自己做消融。
2. **Table 2 内部的对比是公平的，但跨表引用时容易失衡**。表内 $\mathbf{x}$- 与 $\mathbf{u}$-prediction 都不带 bottleneck、都只用 MSE、都训 160 epoch，9.56 vs 164.89 是干净对照。问题在于摘要与正文常用 3.53（带感知损失、带 bottleneck 的完整版）与 164.89 并置来论证 $\mathbf{x}$-prediction 的功劳——其中约 6 个 FID 点来自感知损失，与预测目标无关。引用时应写明是 9.56 还是 3.53。
3. **一步生成与感知损失互相成就的机制没说清**。感知损失在 100 步模型上也会提分（JiT 未用，但同类工作有），作者没有给出「多步 + LPIPS」的对照，所以「6 个 FID 点」里有多少是「一步设定特有」的，**未知**。
4. **固定序列长 162 放大 patch 的做法把成本转移到了 patch 嵌入层**。Table 4 说「Transformer block 成本不变」，但 patch 维 12288 时 `x_embedder` 与输出层的参数量和显存会变得可观，论文只报 Gflops 不报显存峰值。

**迁移到病理时要回答的问题**：
- 病理 tile 的「低维流形」假设是否成立？H&E 的染色深浅、扫描仪色偏是**全局 nuisance 维度**，它们会让「同一张图的不同染色版本」在像素空间里距离很远。若这些维度不被压缩，$\mathbf{x}$-prediction 的优势可能被削弱——这是 pMF 在 ImageNet 上不会遇到的情形。可检验：固定一张 tile，做染色扰动后看 $\mathbf{x}_\theta$ 的输出方差是否远大于 ImageNet 同类扰动。
- 感知损失换病理编码器（UNI/CONCH）特征后，会不会把「诊断相关结构」和「染色风格」一起抹平？这正是 [15-repa-e](15-repa-e.md) 那类表征对齐工作关心的同一件事。
- 一步模型能否直接当 WSI 的「patch 先验」用于超分或修复的生成式先验？若能，[SuperDiff](../pathology/78-histo-diffusion.md) 这类方法的采样预算可从几十步压到 1 步，但要先确认一步先验不会把幻觉放大（参考 [HalluGen](11-hallugen.md) 的评测框架）。

## 8. 来源与版本

- arXiv：<https://arxiv.org/abs/2601.22158>（v1，2026-01-29，Comments: "Tech report. Code at …"）；HTML 全文 <https://arxiv.org/html/2601.22158v1>
- ICML 2026 / PMLR 306：<https://proceedings.mlr.press/v306/lu26t.html>，PMLR 306:81265–81277, 2026（第 43 届 ICML）
- 代码：<https://github.com/Lyy-iiis/pMF>（master `75f6073`，2026-02-19；`hsdp` 与 `torch` 分支未核对）
- 权重与 FID 统计：<https://huggingface.co/Lyy0725/pMF>
- 前作：MeanFlow（arXiv:2505.13447）、iMF（arXiv:2512.02012）、JiT（CVPR 2026, *Back to Basics: Let Denoising Generative Models Denoise*）、BiFlow（arXiv:2512.10953，感知损失实现出处）、arXiv:2502.13129（无时间条件的依据）
- 未确认项：512 模型的噪声尺度（Table 8 与 `eval_config.yml` 注释冲突）；训练墙钟成本；`hsdp`/`torch` 分支与主分支是否等价。
