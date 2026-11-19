# 16｜RAE：把 VAE 换成「冻结表征编码器 + 训练解码器」

**论文**：Diffusion Transformers with Representation Autoencoders  
**作者**：Boyang Zheng、Nanye Ma、Shengbang Tong、Saining Xie（New York University）  
**发表**：ICLR 2026（proceedings.iclr.cc 正式收录）；arXiv:2510.11690v1（2025-10-13）  
**定位**：换掉潜空间本身——用冻结的 DINOv2 / SigLIP2 / MAE 特征当扩散目标，再针对高维 token 修 DiT 的宽度、噪声调度与解码器  
**核验**：2026-11-18 依 arXiv HTML v1 全文（正文 §1–7、附录 A–M，Table 1–17，Theorem 1–2）与 ICLR 2026 会议版摘要页整理；代码对照 `bytetriper/RAE` main 分支（commit `a4d18c4d`，2026-01-20；仓库最后推送 2026-02-25），并读了 `src/stage1/rae.py`、`src/stage2/models/DDT.py`、`src/stage2/transport/transport.py`、`src/train.py` 与 `configs/` 下的 stage1/stage2 配置。HF 权重清单来自 `nyu-visionx/RAE-collections` 的 API（lastModified 2026-03-01）。**未下载权重、未训练、未采样**；所有数字为论文报告值或 README 自报复现值。

| 项 | 内容 |
|---|---|
| 任务 | 类条件 ImageNet 256×256 / 512×512 生成；核心是「潜空间怎么选」 |
| 编码器 | 冻结：DINOv2-B/14（with registers，d=768）、SigLIP2-B/16（d=768）、MAE-B/16（d=768） |
| 潜空间形状 | $256\times 768$（256 token，每 token 768 维），token 数与 SD-VAE 的 DiT 相同 |
| 解码器 | ViT-B/L/XL（默认 XL，28 层 1152 宽），patch 16，从 224² 的 256 token 还原 256×256 |
| 扩散骨干 | LightningDiT（flow matching，速度预测，patch size 1，Euler 50 步） |
| 新增零件 | ① DiT 宽度 ≥ token 维；② 维度相关噪声调度偏移；③ 噪声增强解码；④ 宽而浅的 DDT 头（$\mathrm{DiT^{DH}}$） |
| 成绩 | ImageNet 256：无引导 **1.51**、AutoGuidance **1.13**；512：**1.13**（400 epoch） |
| 代码/权重 | MIT；解码器、DiT、latent 统计量全部公开在 HF |

## 原文摘要

> Latent generative modeling, where a pretrained autoencoder maps pixels into a latent space for the diffusion process, has become the standard strategy for Diffusion Transformers (DiT); however, the autoencoder component has barely evolved. Most DiTs continue to rely on the original VAE encoder, which introduces several limitations: outdated backbones that compromise architectural simplicity, low-dimensional latent spaces that restrict information capacity, and weak representations that result from purely reconstruction-based training and ultimately limit generative quality. In this work, we explore replacing the VAE with pretrained representation encoders (e.g., DINO, SigLIP, MAE) paired with trained decoders, forming what we term Representation Autoencoders (RAEs). These models provide both high-quality reconstructions and semantically rich latent spaces, while allowing for a scalable transformer-based architecture. Since these latent spaces are typically high-dimensional, a key challenge is enabling diffusion transformers to operate effectively within them. We analyze the sources of this difficulty, propose theoretically motivated solutions, and validate them empirically. Our approach achieves faster convergence without auxiliary representation alignment losses. Using a DiT variant equipped with a lightweight, wide DDT head, we achieve strong image generation results on ImageNet: 1.51 FID at 256x256 (no guidance) and 1.13 at both 256x256 and 512x512 (with guidance). RAE offers clear advantages and should be the new default for diffusion transformer training.

*来源：arXiv:2510.11690v1 摘要页，逐字保留。注意 ICLR 2026 会议版摘要是改写过的另一版（更强调 "legacy VAE encoder"），本页统一以 arXiv v1 为准。*

## 中文摘要

> 潜空间生成建模——先用预训练自编码器把像素映射到潜空间、再在潜空间做扩散——已经成为 Diffusion Transformer（DiT）的标准做法；但自编码器这一环几乎没有进化。多数 DiT 仍在用原始 VAE 编码器，它带来几个限制：过时的骨干网络损害架构简洁性，低维潜空间限制信息容量，而纯重建目标训出的表征很弱，最终限制生成质量。本文探索用预训练表征编码器（如 DINO、SigLIP、MAE）搭配训练出的解码器替换 VAE，我们称之为表征自编码器（RAE）。这类模型同时给出高质量重建与语义丰富的潜空间，并允许可扩展的 transformer 架构。由于这些潜空间通常是高维的，关键挑战是让扩散 transformer 能在其中有效工作。我们分析了这一困难的来源，提出有理论依据的解决方案，并用实验验证。我们的方法无需辅助的表征对齐损失就能更快收敛。使用配备轻量宽 DDT 头的 DiT 变体，我们在 ImageNet 上取得强生成结果：256×256 无引导 1.51 FID，256×256 与 512×512 有引导均为 1.13。RAE 优势明确，应当成为扩散 transformer 训练的新默认。

*译文：对应上方 arXiv v1 摘要逐句对译，未增删内容。*

## 0. 三分钟摘要

**一句话**：SD-VAE 把 256×256×3 压成 32×32×4（4096 维），RAE 反过来不压缩——直接把 DINOv2 的 256 个 768 维 token 当扩散目标。省掉压缩就得付代价：DiT 宽度必须 ≥768、噪声调度要按维度重标、解码器要能在「扩散产生的、不是编码器产生的」latent 上工作。

**核心判断**：语义编码器不能重建、扩散在高维潜空间会崩——这两个长期假设都被推翻。一个 ViT 解码器挂在冻结 DINOv2-B 上，rFID **0.49**，比 SD-VAE 的 0.62 更好；线性探测 84.5%，SD-VAE 是 8.0%。真正难的不是重建，是**可扩散性（diffusability）**。

**三个失败点与三个药方**：

| 症状 | 诊断 | 药方 | 幅度 |
|---|---|---|---|
| DiT-XL 在 RAE 上 gFID 23.08（SD-VAE 是 7.13） | 骨干宽度 1152 vs token 维 768 尚可，但 DiT-S（384）完全训不动 | 宽度 ≥ token 维 | 单图过拟合实验直接可视化 |
| 同一噪声水平下信息破坏更少，模型学不到东西 | 分辨率相关的调度偏移忽略了通道维 | $\alpha=\sqrt{m/n}$，$m=N\cdot d$ | 23.08 → **4.81** |
| 解码器只见过干净 latent，扩散输出略偏分布就崩 | 训练分布是离散支撑的 delta 和 | 解码器训练时加噪 | gFID 4.81 → **4.28**（rFID 0.49 → 0.57） |

**最后一步**：把宽度从骨干里挪出来——一个 2 层 2048 宽的 DDT 头挂在 28 层 DiT-XL 后面，gFID 2.16（80 epoch）→ **1.51**（800 epoch，无引导）。

### 实验先看什么

Table 2（DiT 直接崩）→ Table 3（宽度阈值）→ Table 4/5（两个偏移与加噪各值多少）→ Table 8（与 VAE 系方法的最终对比）→ Table 10/11（消融：DDT 头在 VAE / 像素上反而变差）。

## 1. 问题与核心判断

**背景**：DiT、LDM、SiT、REPA 这条线的改进几乎都在骨干和采样上，潜空间一直是 SD-VAE 的 $f=8$、$C=4$。同时表征学习那侧已经换了好几代（DINOv2、SigLIP2、MAE），但潜扩散基本没接上。REPA 一类工作只是拿外部特征做**对齐损失**，扩散目标仍在 VAE 潜空间里。

**两个被挑战的假设**：

1. 「语义编码器只能重建出语义相似的高层结构」（原文引 Yu et al. 2024b 的说法）。→ 冻结编码器 + 训练解码器，rFID 反超 SD-VAE（Table 1a）。
2. 「扩散模型在高维潜空间里表现差」（Skorokhodov et al. 2025；Yao et al. 2025）。→ 差是真的，但原因是**可修复的设计错配**，不是高维本身。证据是 Table 11：把 DiT 直接放到像素上（patch 16，token 维 $16\times16\times3=768$，与 DINOv2-B 同维），最好的结果也只有 gFID 30.56。所以「高维 + 有结构」才有效，高维本身无效。

**这里的方法论值得单独记一笔**：作者没有停在「RAE 训不动」这个观察上，而是构造单图过拟合实验（一张 ImageNet 图，1200 步，batch 32，无 EMA），把「宽度不足」和「容量不足」分离开——固定宽度加深度（12→24 层）无效，加宽度到 768 立刻收敛。这是全文最干净的一个因果证据。

**结果定位**：1.51（无引导，256）与 1.13（有引导，256/512）。对照 Table 8 里同为 256、无引导的 REPA-E 1.70（800 epoch）、VA-VAE 2.17、DDT 6.27，以及 Table 7 里 512 有引导的 EDM2 1.25、DDT 1.28。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| RAE（Representation Autoencoder） | 编码器是**冻结**的预训练表征模型，解码器是新训的 ViT；不做空间压缩 |
| 可扩散性（diffusability） | 这个潜空间的分布能不能被扩散模型学好；与「能不能重建」是两件事（MAE rFID 最好、gFID 最差） |
| token 维 $d$ / token 数 $N$ / 有效数据维 $m$ | DINOv2-B 的 $d=768$；256² 图给 $N=256$；$m=N\cdot d=196608$ |
| 噪声调度偏移（shift） | 对同一个 $t$，按维度把时间轴非线性拉伸，让高维输入在相同 $t$ 下被破坏得更彻底 |
| 噪声增强解码 | 训解码器时给 latent 加噪，让它学会「邻域」而不是只记住训练集那 256 个点 |
| DDT 头 / $\mathrm{DiT^{DH}}$ | 骨干输出的 feature 作为条件，交给一个又宽又浅的 transformer 头去出速度场 |
| AutoGuidance | 用一个更弱的模型（这里取 $\mathrm{DiT^{DH}}$-S 的 20-epoch checkpoint）引导强模型，替代 CFG |
| rFID / gFID | 重建 FID（ImageNet val 上编码-解码）/ 生成 FID（50K 采样） |

## 3. 核心方法与数据流

```text
阶段一（训练解码器，编码器全程冻结）
ImageNet 图 x (256²) → 双三次插值到 224² → DINOv2-B/14 归一化 → 编码器 → 丢 CLS/register
→ 256 个 patch token（768 维）→ 每个 token 单独 LayerNorm（去掉仿射参数）
→ [训练时] z + n, n~N(0,σ²I), σ~|N(0,τ²)|, τ=0.8
→ ViT-XL 解码器（patch 16，前置一个可学 CLS token，解码后丢弃）
→ L1 + LPIPS(ω_L=1) + GAN(ω_G=0.75, 自适应 λ)，判别器用冻结 DINO-S/8
→ 16 epoch，得到 decoder

阶段二（潜扩散）
x → 编码器（noise_tau=0）→ z → 按 ImageNet 统计量逐通道标准化
→ flow matching：x_t=(1-t)z+tε，预测 v=ε-z
→ 时间采样后先按 t_m=αt_n/(1+(α-1)t_n) 偏移，α=sqrt(m/4096)，m=N·d
→ LightningDiT（28 层 1152）+ DDT 头（2 层 2048）→ v
→ Euler 50 步采样 → z → 反标准化 → 解码器 → 图
```

### 3.1 编码器与解码器（§3、附录 C）

给定 $x\in\mathbb{R}^{3\times H\times W}$、编码器 patch $p_e$、隐宽 $d$，得到 $N=HW/p_e^2$ 个 $d$ 维 token；解码器 patch $p_d$ 决定输出分辨率 $H\frac{p_d}{p_e}\times W\frac{p_d}{p_e}$。默认 $p_d=p_e$，即同分辨率重建。

DINOv2 只提供 $p_e=14$，于是把图插值到 224²（$16\times16=256$ token），但解码器取 $p_d=16$，输出 256×256。**这一点很容易被忽略**：编码器看到的其实是 224² 的降采样图，重建目标却是 256²，rFID 是在这个错位下测的。

损失（§3 式）：

$$\mathcal{L}_{rec}(x)=\omega_L\,\mathrm{LPIPS}(\hat x,x)+\mathrm{L1}(\hat x,x)+\omega_G\,\lambda\,\mathrm{GAN}(\hat x,x)$$

其中 $\lambda=\|\nabla_{\hat x}\mathcal{L}_{rec}\|/(\|\nabla_{\hat x}\mathrm{GAN}\|+\epsilon)$ 是 StyleGAN-T / Esser 那套自适应权重。判别器用**冻结的 DINO-S/8**（不是常见的 DINO-S/16），作者说 /8 更稳、能抑制对抗 patch。

Table 1 的四组数：

| 编码器 | rFID↓ | 线性探测 Top-1↑ |
|---|---|---|
| MAE-B | **0.16** | 68.0 |
| DINOv2-B | 0.49 | **84.5** |
| SigLIP2-B | 0.53 | 79.1 |
| SD-VAE | 0.62 | 8.0 |

| 解码器 | rFID | GFLOPs |
|---|---|---|
| ViT-B | 0.58 | 22.2 |
| ViT-L | 0.50 | 78.1 |
| ViT-XL | 0.49 | 106.7 |
| SD-VAE | 0.62 | 310.4 |

编码器尺寸（DINOv2-S/B/L）对 rFID 几乎没影响（0.52 / 0.49 / 0.52），说明低层细节还在，只是被稀释。SD-VAE 的编/解码 GFLOPs 分别是 RAE 的约 6× 和 3×（Figure 2）。

**但重建最好 ≠ 生成最好**：MAE rFID 0.16，gFID 却要 16.14（Table 15a，无加噪）；DINOv2-B 是 4.81。作者据此选 DINOv2 做默认编码器。这条经验对病理尤其重要（见 §7）。

### 3.2 为什么宽度必须 ≥ token 维（§4.1、Theorem 1）

DiT 原样搬到 RAE 上：DiT-S gFID **215.76**（SD-VAE 51.74），DiT-XL **23.08**（SD-VAE 7.13）。单图过拟合实验（Figure 3）显示：宽度 $d<768$ 时连一张图都拟合不了，$d\ge768$ 立刻几乎完美复现；固定 $d=384$ 把深度 12→24 也没用。

Theorem 1：设 $x\sim p(x)\in\mathbb{R}^n$，$\varepsilon\sim\mathcal{N}(0,I_n)$，$x_t=(1-t)x+t\varepsilon$，函数族

$$\mathcal{G}_d=\{g(x_t,t)=Bf(Ax_t,t):\ A\in\mathbb{R}^{d\times n},\ B\in\mathbb{R}^{n\times d}\}$$

即先投影到 $d$ 维、在 $d$ 维里算、再投回 $n$ 维。则对任意 $g\in\mathcal{G}_d$，$d<n$ 时

$$\mathcal{L}(g)=\int_0^1\mathbb{E}\|g(x_t,t)-(\varepsilon-x)\|^2\,dt\ \ge\ \sum_{i=d+1}^{n}\lambda_i,$$

$\lambda_i$ 是 $W=\varepsilon-x$ 协方差矩阵的特征值。单图（$p=\delta(x-x_0)$）时 $W\sim\mathcal{N}(-x_0,I_n)$，$\lambda_i=1$，下界退化成 $\frac{n-d}{n}$——正好对上 Figure 3 里损失卡住的高度。

**直觉比我预想的重要**：常见说法是「数据流形内在维数低，所以 GAN 不必撑满数据维」。作者的反驳是，扩散在**训练全程**给数据加高斯噪声，把分布的支撑扩到整个 $\mathbb{R}^n$，流形被「扩散」成满维；再加上目标场是 $\varepsilon-x$，它的每个方向都有单位方差，低秩瓶颈必然截掉一部分。作者只做了协方差为各向同性的极端例子，一般情形下界取决于 $W$ 的谱，这是该定理的实际范围（附录 B.1）。

Theorem 2（附录 B.2）把同一逻辑挪到采样：若 $g$ 满足 Lipschitz 常数 $L$，则采样结果与最优场的偏差 $\|\hat x_0^*-x_0\|\ge\frac{1-e^{-L}}{L}\sum_{i=d+1}^n\lambda_i$。也就是说宽度的不足不会因为多走几步而消失。

工程含义很硬：DiT-XL 的宽度 1152 ≥ 768，所以 XL 还能跑（只是慢）；DiT-S/B（384/768）基本作废。Table 3 的收敛/不收敛矩阵（$\checkmark$/$\times$）就是这条规则的实测版。

### 3.3 维度相关噪声调度偏移（§4.2）

既有的 shift（SD3、Hoogeboom 等）按空间分辨率推，通道数 $C\le16$ 时成立；RAE 的 token 有 768 个通道，同一个 $t$ 下信息破坏程度低得多。于是把「分辨率」换成「有效数据维」$m=N\cdot d$：

$$t_m=\frac{\alpha t_n}{1+(\alpha-1)t_n},\qquad \alpha=\sqrt{m/n},\qquad n=4096.$$

DINOv2-B、256² 时 $m=256\times768=196608$，$\alpha=\sqrt{48}\approx6.93$。效果：**23.08 → 4.81**（Table 4）。这是全文单项收益最大的一步，也是最容易被忽略的一步——它不改模型，只改时间采样。

原文正文只写「$m$ 取 RAE 的有效数据维」，没有给公式；$m=N\cdot d$ 是后续 T2I 论文（arXiv:2601.16208 §3.2）明写的，代码里也是 `time_dist_shift_dim: 196608`（$16\times16\times768$）、`time_dist_shift_base: 4096`，`train.py` 里取 $\sqrt{\cdot}$。

### 3.4 噪声增强解码（§4.3）

VAE 的潜变量是连续分布 $\mathcal{N}(\mu,\sigma^2 I)$，解码器天生见过「带噪」输入；RAE 的解码器只在 $\{z_i\}$ 这堆离散点上训练过，扩散模型吐出来的 latent 稍微偏离就 OOD。解法是把训练分布平滑化：

$$p_{\mathbf{n}}(\mathbf{z})=\int p(\mathbf{z}-\mathbf{n})\,\mathcal{N}(0,\sigma^2 I)(\mathbf{n})\,d\mathbf{n},\qquad \mathbf{n}\sim\mathcal{N}(0,\sigma^2 I),\ \sigma\sim|\mathcal{N}(0,\tau^2)|.$$

默认 $\tau=0.8$（Table 15c 扫了 0.5 / 0.8 / 1.0：gFID 4.39 / 4.28 / 4.20，rFID 0.54 / 0.57 / 0.60）。诊断很干脆：**用 rFID 换 gFID**。跨编码器都成立，MAE-B 收益最大（16.14 → 8.38），因为它本来最不抗噪。

### 3.5 $\mathrm{DiT^{DH}}$：把宽度挪到头上（§5）

宽度达标才能扩散，但整条骨干加宽是二次代价。做法借 DDT：骨干 $M$ 出特征，宽而浅的头 $H$ 出速度场：

$$z_t=M(x_t\mid t,y),\qquad v_t=H(x_t\mid z_t,t).$$

实例：$M$ = 28 层 1152（16 头），$H$ = 2 层 2048，总参数 839M。头内部的实现是「同一套 token 再走两遍」——先把 $x_t$ 嵌入成 $s$、过 28 层，投到 2048 维作为条件；再把 $x_t$ 过 2 层 2048，末层输出 $3\times1$（patch 1 时即 768 维速度）。

Table 16 的设计结论：**又宽又浅**——2L/2048（26.8 GFLOPs，2.158）优于 6L/1152（25.6，2.362，算力相当）与 4L/2048（53.1，2.306，算力翻倍反而不涨）。Table 17 再补一条：最优头宽随编码器变大（DINOv2-L 上 2688 宽还能涨到 2.64）。

关键的反向消融（我读这篇时最看重的一处）：

| 潜空间 | DiT-XL | $\mathrm{DiT^{DH}}$-XL |
|---|---|---|
| SD-VAE | 7.13 | **11.70**（更差） |
| DINOv2-B | 4.28 | 2.16 |
| 原始像素（patch 16） | 51.09 | 30.56 |

也就是说宽头不是通用增益，它专门修「骨干宽度 < token 维」这个瓶颈；在 VAE 的低维潜空间里它是纯负担。

## 4. 实验与证据

**主表 Table 8（ImageNet 256，类条件）**，节选：

| 方法 | epoch | 参数量 | 无引导 gFID↓ | 有引导 gFID↓ |
|---|---|---|---|---|
| DiT | 1400 | 675M | 9.62 | 2.27 |
| SiT | 1400 | 675M | 8.61 | 2.06 |
| REPA | 800 | 675M | 5.78 | 1.29 |
| REPA-E | 800 | 675M | **1.70** | **1.15** |
| VA-VAE | 800 | 675M | 2.17 | 1.35 |
| DDT | 400 | 675M | 6.27 | 1.26 |
| **DiT-XL (DINOv2-S)** | 800 | 676M | 1.87 | 1.41（CFG+interval） |
| **$\mathrm{DiT^{DH}}$-XL (DINOv2-B)** | 20 | 839M | 3.71 | – |
| 同上 | 80 | 839M | 2.16 | – |
| 同上 | 800 | 839M | **1.51** | **1.13** |

**Table 7（ImageNet 512，有引导）**：$\mathrm{DiT^{DH}}$-XL 1.13（IS 259.6，400 epoch），对照 DDT 1.28、EDM2 1.25、VAR 2.63、SiT 2.62。

**读这些数字要注意三件事**：

1. **训练长度主导**。DiT-XL 用**最弱**的 DINOv2-S、跑 800 epoch 也能到 1.87（无引导），比 $\mathrm{DiT^{DH}}$-XL 用 DINOv2-B 跑 80 epoch 的 2.16 更好。所谓「40×/47×/16× 加速」是**收敛速度**的说法（80 epoch 的 4.28 对比 SiT-XL 1400 epoch 的 8.61、REPA-XL 的最终值），不是等算力对比；Figure 6b 的横轴 GFLOPs 才是公平轴。
2. **FID 协议被改过**。作者发现按类均衡采 50 张/类（`--label-sampling equal`）比随机采标签稳定低约 0.1 FID，于是把 SiT、REPA、REPA-E 等有 checkpoint 的基线**重跑**了一遍，Table 8 用的是重跑值（Table 14 给出两种协议的对照：SiT 8.61→8.54，REPA 5.90→5.78 / 1.42→1.29）。跨论文比 FID 时这一条会造成 0.1 量级的误差。
3. **有引导那列不是 CFG**。默认是 AutoGuidance（引导模型 = $\mathrm{DiT^{DH}}$-S 的 20-epoch checkpoint，scale 1.5）。附录 I 明说：不带 interval 的 CFG 在 RAE 上**不提升**甚至更差，加 interval 后仍不如 AutoGuidance。

**规模与宽度（Table 6，80 epoch，无引导）**：

| RAE 编码器 | DiT-XL | $\mathrm{DiT^{DH}}$-XL |
|---|---|---|
| DINOv2-S（$d$=384） | 3.50 | 2.42 |
| DINOv2-B（$d$=768） | 4.28 | 2.16 |
| DINOv2-L（$d$=1024） | 6.09 | 2.73 |

DiT-XL 随编码器变大而变差（宽度 1152 相对 $d$ 的优势缩小），宽头把它压平——这就是 §3.2 那条规则的第二个实测面。

**分辨率靠解码器外推（Table 9）**：解码器 $p_d=2p_e$ 时，用 256² 训出的扩散模型直接出 512²，token 数仍是 256：gFID 1.61、rFID 0.97，对比直接训 512 的 1.13 / 0.53。4× 省算力，代价是细节。

**训练细节（附录 D）**：AdamW，常数 lr $2\times10^{-4}$、batch 1024、EMA 0.9999（DiT）；$\mathrm{DiT^{DH}}$ 改用 $2\times10^{-4}\to2\times10^{-5}$ 线性衰减、warmup 40 epoch、EMA 0.9995、梯度裁剪 1.0，因为原配方后期会 loss spike。时间分布 `logit-normal_0_1`。用 PyTorch/XLA 在 TPU v6e-8 上训练与采样；800 epoch 模型的 50K 采样在 4×A100 上跑。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（2026-11-18 核对）

- 仓库：[bytetriper/RAE](https://github.com/bytetriper/RAE)，MIT，main `a4d18c4d`（2026-01-20），最后推送 2026-02-25，2.1k star。
- README 说明 **2025-12 重构过**：新增统计量计算、断点续训、wandb、在线评测、sanity check；旧接口要回 `deprecated-gpu` 分支。引用的教程若写于 2025 年 10 月，命令行参数与当前 main 不一致。
- 权重全部公开：`nyu-visionx/RAE-collections`。含 DINOv2 wReg-B 的 ViT-XL 解码器三个噪声档（`n05` / `n08` / `n10`）、DINOv2-S/L 解码器、MAE-B/16、SigLIP2-B/16、判别器、latent 统计量 `stat.pt`；DiT 侧有 256² 的 `DiTDH-XL`（800 epoch）、`DiTDH-XL_ep80`、`DiTDH-S_ep14/ep20`（引导模型），512² 的 `DiTDH-XL_ep400`。**不需要重训解码器就能复现采样。**
- 依赖：`uv pip install torch==2.8.0`（cu129）+ `requirements.txt`；TPU 走 `XLA` 分支。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| 每 token LayerNorm、去仿射（附录 C.1） | `src/stage1/encoders/dinov2.py`（`Dinov2withNorm`，`normalize: true`） |
| 解码器损失 L1+LPIPS+GAN、$\omega_L=1,\omega_G=0.75$ | `src/train_stage1.py` + stage1 配置里的 `gan.loss`（`disc_weight: 0.75`、`perceptual_weight: 1.0`、`disc_start: 8`、`disc_upd_start: 6`） |
| 判别器 = 冻结 DINO-S/8 | `src/disc/dinodisc.py`，配置 `dino_ckpt_path: dino_vit_small_patch8_224.pth` |
| 噪声增强解码 $z+n$ | `src/stage1/rae.py` 的 `noising()`（第 74–76 行），`noise_tau` 默认 0.8 |
| 时间偏移 $t_m=\alpha t_n/(1+(\alpha-1)t_n)$ | `src/stage2/transport/transport.py:181` |
| $\alpha=\sqrt{m/n}$，$n=4096$ | `src/train.py:137-139`；配置 `misc.time_dist_shift_dim: 196608`（$16\cdot16\cdot768$）、`time_dist_shift_base: 4096` |
| 宽度 ≥ token 维 | 配置 `stage_2.params.in_channels: 768`、`hidden_size: [1152, 2048]`、`depth: [28, 2]` |
| $\mathrm{DiT^{DH}}$：$v_t=H(x_t\mid z_t,t)$ | `src/stage2/models/DDT.py` → `DiTwDDTHead.forward`（`s_embedder`→28 blocks→`s_projector`→`x_embedder`→2 blocks→`final_layer`） |
| patch 1 / 256 token | `stage_2.params.patch_size: 1`、`misc.latent_size: [768, 16, 16]` |
| AutoGuidance | `forward_with_autoguidance`（`DDT.py:391`），采样配置里 `guidance.method: autoguidance` |

**代码与论文不一致 / 论文没写的地方**

1. **噪声分布形式不同**。论文写 $\sigma\sim|\mathcal{N}(0,\tau^2)|$（半正态），代码是 `noise_sigma = noise_tau * torch.rand(...)`，即 $\sigma\sim\tau\cdot U(0,1)$。两者均值差 25%（$\tau/2$ vs $\tau\sqrt{2/\pi}\approx0.798\tau$），形状也不同。复现 rFID/gFID 时以代码为准，讨论「加噪强度」时不能直接拿 $\tau$ 当标准差。
2. **latent 标准化没进论文正文**。代码在编码后按 ImageNet 统计量逐通道标准化（`normalization_stat_path`，`stat.pt`），解码前反标准化；README 专门有一节讲怎么算这个统计量（并说自算的方差与发布值差约 0.008 L1）。正文里一个字都没提——但少了 `stat.pt` 采样必然不对，这是复现时第一个会踩的坑。
3. **`noise_tau: 0.0` 出现在发布配置里**（`configs/stage2/*`、`configs/stage1/pretrained/DINOv2-B.yaml`）。这不是矛盾：加噪只在阶段一训练时生效（`if self.training and self.noise_tau > 0`），推理恒为 0；实际要选的是解码器权重档（`n08` = 用 $\tau=0.8$ 训的）。
4. **README 自报复现值**：DINOv2-B 解码器 rFID 0.57 → 0.54，$\mathrm{DiTDH}$-XL 80 epoch gFID 2.16 → 2.16。并注明「更新后的 GPU 配置比论文报告值略好」，所以拿新版配置复现会系统性偏高。

### 5.2 第一个该做的验证（单卡、不训练）

**目标：验证「rFID 好 ≠ 可扩散」这条最反直觉的结论，且不需要训扩散模型。**

1. 只跑阶段一：用 `stage1_sample.py` 在 ImageNet val 上前向 DINOv2-B + ViT-XL 解码器（`n08`），算 rFID，确认落在 0.5 附近（README 报 0.54）。若明显偏高，先查 latent 统计量是否加载、输入是否被插值到 224。
2. 用 `n05` / `n10` 两个解码器（$\tau=0.5$ / $1.0$）再各跑一遍 rFID，与 `n08` 的 0.54 比较，观察是否单调变差（论文 Table 15c：0.54 / 0.57 / 0.60）。这一步几十分钟，直接验证「加噪换重建」的取舍，也确认权重档与 $\tau$ 的对应关系。注意仓库**没有** $\tau=0$ 的解码器权重，别去找。
3. 再跑 `sample.py`（DiTDH-XL_ep80，`--seed 42`，50 步 Euler），肉眼检查有没有结构性伪影。把同一批生成的 latent 送进 `n05` / `n08` / `n10` 三个解码器：如果重的噪声档明显更少伪影，论文「扩散输出落在解码器训练分布之外」的机制就成立了一半；如果三档差不多，说明 256² ImageNet 上这个效应很小，论文 Table 5 的 +0.5 gFID 主要来自训练动力学而非推理端分布错配。

### 5.3 一个具体的病理迁移实验（放这里因为它是「第一个该做的事」）

把 DINOv2-B 换成 **UNI**（ViT-L/16，$d=1024$，$p_e=16$；PixCell 用的是 UNI-2h 的 1536 维版本）或 **CONCH**，先用 256×256 的 TCGA 图块训 ViT-XL 解码器，只测 rFID 与「UNI 冻结特征的线性探测」。然后按 §3.2/§3.3 设定：$m=N\cdot d$（$d=1024$、256 token 时 $m=262144$，$\alpha=8$；1536 维则是 $\alpha\approx9.8$），DiT 宽度 ≥1024 或直接上 2048 宽头。这套流程能直接回答一个现在没人回答的问题：病理基础模型的潜空间**可扩散吗**？（注意与 [89-pixcell](../pathology/89-pixcell.md) 的区别：那篇是拿 UNI-2h 的嵌入做**条件**，这里是拿 UNI 特征做**生成目标**。）

## 6. 前后关联

- **潜空间这条线**：[06-ldm.md](06-ldm.md) 建立「VAE 潜空间 + 扩散」范式，SD-VAE 的 $f=8,C=4$ 就是本文要替换的对象；[07-dit.md](07-dit.md) 是本文的骨干（LightningDiT 是 DiT 的变体）。
- **对齐 vs 换空间**：[15-repa-e.md](15-repa-e.md)（REPA-E）代表「不换潜空间，把 VAE 与 DiT 端到端放开、用外部特征对齐」；本文代表「直接换潜空间」。两者在 Table 8 同台：REPA-E 800 epoch 无引导 1.70、有引导 1.15，RAE 1.51 / 1.13。作者的核心论点是：对齐损失是绕路，换空间才是解法。
- **同方向续作**：[17-raev2.md](17-raev2.md)（RAEv2）与本文是同一问题的后续；本文的 T2I 扩展是 arXiv:2601.16208（见 §8）。
- **训练目标**：[08-flow-matching.md](08-flow-matching.md)——本文用线性插值路径 + 速度预测，没有改目标，改的是数据空间。
- **采样/加速**：[10-consistency-models.md](10-consistency-models.md) 那类少步方法可以叠在 $\mathrm{DiT^{DH}}$ 上；本文一律 50 步 Euler，没做这一步优化。
- **病理侧对照**：[89-pixcell](../pathology/89-pixcell.md)（UNI 作条件的像素扩散）、[78-histo-diffusion](../pathology/78-histo-diffusion.md)（SuperDiff，超分）、[64-bigcell](../pathology/64-bigcell.md)（潜空间扩散做共表达生成）。它们的潜空间都是 VAE 或自训 AE，没有一篇用病理基础模型的冻结特征当扩散目标。

## 7. 局限与可检验问题

**作者承认的**：
- 宽度不足时下界是硬的（Theorem 1/2），小模型在这个潜空间里没有出路；
- 分辨率扩展要靠解码器 upsample，rFID 从 0.53 掉到 0.97；
- 加噪解码是 rFID 与 gFID 的交换，不是免费提升；
- 只在 ImageNet 类条件上验证，没有 T2I、没有视频、没有多分辨率统一模型；
- 引导用 AutoGuidance，需要额外一个弱模型 checkpoint。

**我的看法（作者没写的）**：
1. **Theorem 1 的下界很弱**。它假设 $A,B$ 是线性投影且 $f$ 只在 $d$ 维里工作；真实 DiT 的词表嵌入、AdaLN、attention 都不在这个函数族里。单图实验（$\lambda_i=1$，所有方向等方差）是下界最紧的极端情形，ImageNet 上 $W$ 的谱大概率长尾，实际惩罚会小于 $(n-d)/n$。所以「宽度 ≥ token 维」应读作经验阈值，不是定理的推论。
2. **「40× 加速」的说法混了轴**。Figure 6b 用 GFLOPs 比得比较干净，但正文的 47×/16× 是拿 80 epoch 的 RAE 对比基线**训练完**的成绩，等于把「基线需要更多 epoch」算成加速。真正的问题是：等 GFLOPs 下 RAE 是否仍领先？图上大致是，但正文没给数表。
3. **rFID 与 gFID 的排序不一致没有被解释**。MAE rFID 0.16 却是最差的可扩散空间（16.14），作者归因为「表征弱」，但没做机制分析（是特征秩、条件数，还是各向异性？）。这正是病理迁移最需要的那块知识。
4. **噪声增强解码的机制叙述偏弱**。论文用「平滑分布减少 OOD」解释，但同时承认 rFID 变差；如果只是正则化，为什么 $\tau=0.8$ 恰好是最优？Table 15c 在 0.5–1.0 上是单调的（gFID 仍在降），说明最优点没被找到，只是被截断在 1.0。
5. **解码器的 patch 错位（224 输入 → 256 输出）没有消融**。这个 14→16 的插值既影响 rFID 也影响生成细节，读者无法判断它贡献了多少。

**迁移到病理时要回答的问题**：
- **病理基础模型的 token 是不是好的扩散目标？** UNI/CONCH 是在 patch 级分类/检索目标上训的，特征可能丢掉核形态与染色强度——这两样恰好是病理生成最需要保真的。本文的 MAE 反例（rFID 最好、gFID 最差）说明「重建好」不能作为选型依据，病理上必须直接测 gFID 或下游任务。
- **有效数据维 $m=N\cdot d$ 的偏移是否可直接搬？** 病理图块 256² 用 $p_e=16$ 只有 256 token，但一张 WSI 要的是几千个 token；$m$ 随 $N$ 线性增长，$\alpha=\sqrt{m/4096}$ 会大到 10 以上，时间轴被极度拉伸，是否需要重定基准？
- **解码器怎么处理染色差异**：ImageNet 解码器只在自然图上训；病理解码器若在单一中心数据上训，加噪训练会不会把「染色风格」也当成噪声抹掉？

## 8. 来源与版本

- arXiv 摘要页：<https://arxiv.org/abs/2510.11690>（v1，2025-10-13；截至 2026-11-18 只有 v1）
- arXiv HTML 全文：<https://arxiv.org/html/2510.11690v1>（本页 §/Table/Theorem 编号均指此版本）
- ICLR 2026 正式版：<https://proceedings.iclr.cc/paper_files/paper/2026/hash/3c4141c12660ad3625eb4ae845e0a6f9-Abstract-Conference.html>（会议版摘要与 arXiv v1 措辞不同，数字一致）
- 代码：<https://github.com/bytetriper/RAE>（main `a4d18c4d`，2026-01-20；最后推送 2026-02-25；MIT）；旧接口在 `deprecated-gpu` 分支
- 权重：<https://huggingface.co/nyu-visionx/RAE-collections>（解码器 `n05/n08/n10`、DiT 256² ep80/ep800、512² ep400、`stat.pt`）
- 项目页：<https://rae-dit.github.io/>
- 后续 T2I 论文：Scaling Text-to-Image Diffusion Transformers with Representation Autoencoders，arXiv:2601.16208v1（2026-01-22，Tong、Zheng、Wang、Tang、Ma、Brown、Yang、Fergus、LeCun、Xie）。已核实的关键结论：① SigLIP-2 So400M 作编码器、MetaQuery + Qwen-2.5 1.5B 作条件；② 维度相关噪声偏移**仍然关键**（GenEval 23.6 → 49.6，DPG-Bench 54.8 → 76.8）；③ 噪声增强解码与宽 DDT 头**在大规模下收益消失**（加噪收益只在 ~15k step 前明显，$\tau$ 需降到 0.2 才训得动；宽头在 0.5B 上 +11.2 GenEval，2.4B 以上饱和）；④ 与 FLUX-VAE 在 0.5B–9.8B 全程对比，RAE 预训练收敛更快，微调时 VAE 版 64 epoch 后过拟合、RAE 版到 256 epoch 仍稳定。**本文的「默认配置」因此不是终局：只有噪声调度偏移活到了大规模。**

本页只做论文与代码阅读，未下载权重、未训练、未采样；第 5 节的检查项是建议，不是已执行结果。文中所有数字均来自上述 arXiv v1 的指定 Table/§、README 的自报值，或明确标注的后续论文。
