# 15｜REPA-E：端到端训练 VAE 与 DiT，但别用扩散损失当 VAE 的梯度

**论文**：REPA-E: Unlocking VAE for End-to-End Tuning of Latent Diffusion Transformers
**作者**：Xingjian Leng\*、Jaskirat Singh\*、Yunzhong Hou、Zhenchang Xing、Saining Xie、Liang Zheng（ANU；Data61 CSIRO；NYU；\*同等贡献）
**发表**：ICCV 2025（CVF Open Access，pp. 18262–18272）；arXiv:2504.10483v1（2025-04-14），v3（2025-10-22）。**注意：camera-ready 与 arXiv 的最终 FID 不同（1.83/1.26 vs 1.69/1.12），见 §8**
**定位**：把 LDM 的两阶段训练合成一阶段——VAE 和扩散 Transformer 同时更新，但送给 VAE 的梯度来自 REPA 表征对齐损失，扩散损失只更新 DiT（stop-grad）
**核验**：2026-11-18 依 arXiv HTML v2 全文（§1–5、Appendix A–C、Table 1–14）与 ICCV camera-ready PDF（CVF，pp. 18262–18272）逐条核对数字；代码对照 `End2End-Diffusion/REPA-E` main 分支 commit `2ad4e9f`（GitHub API `pushed_at` 2025-12-06T18:28Z），读了 `train_repae.py`、`models/sit.py`、`configs/l1_lpips_kl_gan.yaml`、README。本页只读论文与代码，**未运行训练、采样或评测**；所有指标为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | ImageNet-256 类条件生成（主）；ImageNet-512 与 MSCOCO 文生图（泛化） |
| 改的是什么 | 不改网络结构，改训练配方：VAE 与 SiT 联合更新 |
| 损失 | $\mathcal{L}_{\mathrm{DIFF}}(\theta)$ + REPA 对齐（$\lambda_g=0.5$ 给 SiT，$\lambda_v=1.5$ 给 VAE）+ VAE 正则（L1/LPIPS/GAN/KL） |
| 关键零件 | ① VAE 与 DiT 之间的 BatchNorm（无仿射，推理用 EMA 统计）；② 扩散损失对 VAE stop-grad；③ REPA 损失反传到 VAE |
| 骨干 | SiT-B/L/XL（f8d4 用 patch 2，f16d32 用 patch 1）；SD-VAE f8d4、IN-VAE f16d32、VA-VAE f16d32 |
| 对齐特征 | DINOv2（默认 ViT-B），对齐 SiT 第 8 层，patch 级余弦相似度 |
| 主结果 | 80 epoch gFID **4.07**（无 CFG，SiT-XL/2 + SD-VAE）；E2E-VAE + REPA 800 epoch：**1.83 / 1.26**（无/有 CFG，ICCV camera-ready；arXiv 版为 1.69 / 1.12） |
| 算力 | 8×H100，batch 256，lr $1\times10^{-4}$ 恒定，400K step（80 epoch） |
| 代码 | 公开，附 6 个 HuggingFace 权重（E2E-VAE 可直接 `AutoencoderKL.from_pretrained` 加载） |

## 原文摘要

> In this paper we tackle a fundamental question: "Can we train latent diffusion models together with the variational auto-encoder (VAE) tokenizer in an end-to-end manner?" Traditional deep-learning wisdom dictates that end-to-end training is often preferable when possible. However, for latent diffusion transformers, it is observed that end-to-end training both VAE and diffusion-model using standard diffusion-loss is ineffective, even causing a degradation in final performance. We show that while diffusion loss is ineffective, end-to-end training can be unlocked through the representation-alignment (REPA) loss -- allowing both VAE and diffusion model to be jointly tuned during the training process. Despite its simplicity, the proposed training recipe (REPA-E) shows remarkable performance; speeding up diffusion model training by over 17x and 45x over REPA and vanilla training recipes, respectively. Interestingly, we observe that end-to-end tuning with REPA-E also improves the VAE itself; leading to improved latent space structure and downstream generation performance. In terms of final performance, our approach sets a new state-of-the-art; achieving FID of 1.12 and 1.69 with and without classifier-free guidance on ImageNet 256 x 256. Code is available at https://end2end-diffusion.github.io.

*来源：arXiv:2504.10483v3 摘要页，逐字保留。ICCV camera-ready 的同一段摘要仅末句数字不同（"FID of 1.26 and 1.83"）且 "17x/45x" 印作 "17↑/45↑"，其余文字已逐句比对一致；正文所有 800 epoch 结果见 §4.5 的重算版。*

## 中文摘要

> 本文追问一个根本问题：「能否把潜扩散模型和它的变分自编码器（VAE）tokenizer 放在一起端到端训练？」传统深度学习经验认为，只要可能，端到端训练通常更好。然而在潜扩散 Transformer 上可以观察到：用标准扩散损失同时端到端训练 VAE 与扩散模型是无效的，甚至会拉低最终性能。我们表明，扩散损失虽然无效，但端到端训练可以通过表征对齐（REPA）损失被「解锁」——让 VAE 与扩散模型在训练过程中被联合调节。尽管做法简单，所提出的训练配方（REPA-E）表现惊人：相对 REPA 与原始训练配方，分别把扩散模型训练加速 17 倍以上与 45 倍以上。有意思的是，用 REPA-E 做端到端调节还改进了 VAE 本身，使其潜空间结构更好、下游生成性能更强。就最终性能而言，我们的方法刷新了最优结果：在 ImageNet $256\times256$ 上，有/无分类器自由引导（CFG）的 FID 分别为 1.12 与 1.69。代码见 https://end2end-diffusion.github.io。

*译文：逐句对译上方原文摘要，未增删内容（因此保留了 arXiv 版的 1.12/1.69；camera-ready 改为 1.26/1.83，见 §4.5）。*

## 0. 三分钟摘要

**一句话**：端到端训练 VAE + DiT 失败，不是「不该端到端」，而是「扩散损失把 VAE 带歪了」；把送给 VAE 的梯度换成 REPA 对齐损失，两阶段就能合成一阶段，而且收敛快一个数量级。

**问题**：LDM 一直分两段——先训 VAE（只最小化重建误差），再冻结 VAE 训扩散模型。重建最优不等于生成最优，但没人能说清「为了生成，VAE 的潜空间应该长什么样」。最直接的端到端做法是把扩散损失反传到 VAE，论文实测这会**让潜空间塌掉**：空间方差从 17.06 掉到 **0.02**、总变差从 6627 掉到 90（camera-ready 补充材料 Table 9），生成 FID 反而更差。

**insight（三条，按论文顺序）**：
1. 扩散损失会「hack」潜空间。设 $z_t=\alpha_t z_{\mathrm{VAE}}+\sigma_t\epsilon$，去噪目标是从 $z_{\mathrm{VAE}}$ 预测 $\epsilon$；当 $z_{\mathrm{VAE}}$ 沿空间维的方差趋近 0，这个任务退化成「预测一个偏置项」，损失很容易降，但潜空间已经不含信息。
2. 表征对齐分数（CKNNA）与 gFID 同向——所以可以拿对齐当生成性能的代理指标。
3. 但普通 REPA 的对齐分数被 **VAE 特征封顶在 ~0.42**（上限 1）；只有把 REPA 损失也反传到 VAE，才能突破这个上限。

**它到底做到了什么**：
- SiT-XL/2 + SD-VAE，80 epoch（400K step）无 CFG gFID **4.07**；同配方 REPA 要 800 epoch 才 5.90，SiT 要 1400 epoch 才 8.61。
- 消融最狠的一条：去掉 stop-grad，gFID 变成 **444.1**（precision/recall 都是 0）。这不是调参问题，是训练直接崩。
- 端到端顺便把 VAE 也训好了：拿它当 E2E-VAE 冻结使用，SiT-XL + REPA 从 4.88 降到 **3.46**，DiT-XL + REPA 从 4.71 降到 **4.20**——跨架构有效。
- 最终 SOTA：E2E-VAE + REPA 800 epoch，ImageNet-256 **1.83 / 1.26**（无/有 CFG，camera-ready；arXiv 版报 1.69 / 1.12）。

### 实验先看什么

Table 9（补充材料，潜空间塌缩的量化）→ Table 6（消融，先看 w/o stopgrad）→ Table 1（收敛曲线）→ Table 8（E2E-VAE 当 drop-in）→ 补充材料 Table 13（最终 SOTA）。

## 1. 问题与核心判断

### 1.1 两阶段的真正矛盾

第一阶段最小化重建（MSE/LPIPS/GAN/KL），第二阶段最小化去噪。两个目标对潜空间的要求并不一致：
- 重建想要**保真**：高频细节、纹理都要留住，潜空间方差大。
- 去噪想要**好学**：$z$ 与 $\epsilon$ 尽量可分离，条件数好。

已有工作都从经验层面处理这个矛盾：Eq-VAE 加等变正则、VA-VAE 让 tokenizer 对齐视觉基础模型、"Improving the Diffusability of Autoencoders" 做数据侧分析。它们的结论还随 VAE 架构而变：SD-VAE 的潜空间**高频噪声多**，而 IN-VAE、VA-VAE 反而**过度平滑**（Fig. 2 的 PCA 可视化）。所以不存在一个手工设计的「正确」潜空间，只能让生成目标自己去塑造它——前提是梯度方向对。

### 1.2 为什么扩散损失不行（这是全文最值得记住的机制）

论文的论证只有一段，但很硬：

$$z_t=\alpha_t z_{\mathrm{VAE}}+\sigma_t\epsilon_{\mathrm{orig}},\qquad \text{目标：由 } (z_{\mathrm{VAE}},t)\ \text{预测}\ \epsilon_{\mathrm{orig}}$$

若 $z_{\mathrm{VAE}}$ 沿空间维的方差下降，$\alpha_t z_{\mathrm{VAE}}$ 近似一个常数（偏置），去噪网络只需输出与 $z$ 无关的偏置就能拟合 $\epsilon_{\mathrm{orig}}$。于是**降低扩散损失的最省力路径就是让 VAE 输出趋于空间常数**。Table 9（补充材料）直接印证：

| 训练策略 | 空间方差 | 总变差 |
|---|---|---|
| 不做端到端（冻结 VAE） | 17.06 | 6627.35 |
| 端到端 + REPA 损失 | 18.02 | 5516.14 |
| 端到端 + 扩散损失 | **0.02** | **89.80** |

我的看法（作者没写的）：这其实是「损失函数可被优化的捷径」问题，和 GAN 里的 mode collapse 同构——不是优化失败，而是优化太成功。REPA-E 的贡献与其说是「发现端到端可行」，不如说是「指出扩散损失对 tokenizer 是一个**对抗性**目标」。

### 1.3 为什么 REPA 损失可以

三条经验事实串起来（Fig. 3）：
1. 训练过程中 CKNNA 越高的模型，最终 gFID 越好（跨模型尺寸、跨 checkpoint）；
2. 普通 REPA 只能优化 DiT 侧，对齐分数饱和在 ~0.42；
3. 把 REPA 反传到 VAE，饱和被打破，分数继续上升，gFID 同步下降。

所以 REPA 损失在这里扮演的是**代理目标（proxy）**：它衡量「DiT 的中间特征是否像 DINOv2 的语义特征」，而这个量既依赖 DiT 也依赖输入 latent。VAE 一旦参与优化，就会主动产出「更容易被对齐」的 latent。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| VAE tokenizer | 把 $256\times256$ 图像压成 $32\times32\times4$（f8d4）或 $16\times16\times32$（f16d32）的连续潜变量，再解码回图像 |
| 端到端（E2E） | VAE 和扩散模型联合优化；本文实现为**两个 optimizer、两次 backward** |
| stop-grad | 前向照算，反向时把这段梯度切断；这里指扩散损失不回传到 VAE |
| REPA | 把 DiT 某一层的隐状态经可训练 MLP 投影后，与 DINOv2 的 patch 特征算余弦相似度，最大化它 |
| CKNNA | 衡量两组表征的邻域结构相似度，1 为完全一致；用来量化「对齐得好不好」 |
| BatchNorm（EMA） | 把 latent 标准化；训练时用 batch 统计，推理时用滑动平均（EMA）统计；这里**不带仿射参数** |
| E2E-VAE | 用 REPA-E 顺带微调出来的 VAE，可冻结后当普通 VAE 用（drop-in） |
| gFID / rFID | 生成 FID（50K 采样） / 重建 FID（50K 真值过 VAE 编解码） |
| SiT | 把 DiT 的 DDPM 目标换成 flow/interpolant 目标的 Transformer，本文统一用它 |

## 3. 核心方法与数据流

### 3.1 背景：原始 REPA 是什么（arXiv:2410.06940，ICLR 2025 Oral）

REPA 的观察是：扩散模型的去噪过程本身会诱导出有判别力的表征，但质量不如自监督模型。于是加一个正则：把第 $k$ 层隐状态 $h_t$ 经投影头 $h_\omega$ 映射后，与冻结编码器（DINOv2、CLIP、I-JEPA）对**干净图**提取的 patch 特征做余弦相似度对齐：

$$\mathcal{L}_{\mathrm{REPA}}=-\mathbb{E}_{x,\epsilon,t}\left[\frac{1}{N}\sum_{n=1}^{N}\mathrm{sim}\left(y^{[n]},\,h_\omega(h_t^{[n]})\right)\right],\qquad y=f(x)$$

REPA 原论文报告 SiT 训练加速 17.5×、FID 1.42（有 CFG，guidance interval），对齐深度取第 8 层、系数 0.5 是它的默认设置——REPA-E 全部沿用。

一个工程约束（原论文与代码都隐含）：**对齐要求 token 数一致**。DINOv2 在 224 输入下给 $16\times16=256$ 个 patch token；所以 f8d4 的 $32\times32$ latent 必须用 patch size 2 的 SiT-XL/2 降到 $16\times16$，而 f16d32 的 $16\times16$ latent 用 patch size 1 的 SiT-XL/1。这不是超参偏好，是硬约束。

### 3.2 REPA-E 的总损失

论文写成一行（式 2）：

$$\mathcal{L}(\theta,\phi,\omega)=\mathcal{L}_{\mathrm{DIFF}}(\theta)+\lambda\,\mathcal{L}_{\mathrm{REPA}}(\theta,\phi,\omega)+\eta\,\mathcal{L}_{\mathrm{REG}}(\phi)$$

但实现里 REPA 项对两组参数用**不同系数、分两次反传**（§4.1 与代码一致）：

$$\mathcal{L}_{\text{VAE step}}=\mathcal{L}_{\mathrm{REG}}(\phi)+\lambda_v\,\mathcal{L}_{\mathrm{REPA}}(\phi,\omega),\qquad \lambda_v=1.5$$
$$\mathcal{L}_{\text{DiT step}}=\mathcal{L}_{\mathrm{DIFF}}(\theta)+\lambda_g\,\mathcal{L}_{\mathrm{REPA}}(\theta,\omega),\qquad \lambda_g=0.5$$

这里 $\theta$=SiT，$\phi$=VAE，$\omega$=投影头。关键点：
- VAE 那一步，SiT **冻结且处于 eval 模式**（不更新 BN 统计），梯度只经 $z=\mathcal{V}_\phi(x)$ 流回 VAE；
- DiT 那一步，输入是 `z.detach()`，扩散损失永远不碰 VAE；
- 两次前向复用**同一组 $t$ 和噪声**（代码注释明确说为了不重采样），所以两个损失看到的是同一个 $z_t$。

### 3.3 BatchNorm：让「标准化」跟着 VAE 走

标准 LDM 用预计算的常数（SD-VAE 的 `1/0.1825`）把 latent 归一到零均值单位方差。端到端时 VAE 每步都在变，常数失效，重算数据集统计又太贵。做法是在 VAE 与 SiT 之间插一层 `BatchNorm2d`：
- `affine=False`（代码注释：防止仿射参数把扩散损失「hack」掉——若允许缩放，BN 可以学着把 latent 压小来降低去噪难度）；
- `track_running_stats=True`，`momentum=0.1`，`eps=1e-4`；
- 初始化时直接把原 VAE 的 `latents_bias` / `latents_scale` 写进 running stats，所以**推理时**的归一化与原来的常数标准化完全一致。

一个容易忽略的实现细节：`nn.BatchNorm2d` 在 train 模式下用**当前 batch** 的均值/方差做归一（同时更新 running stats），只有 eval 模式才用 EMA 统计。所以论文说的「用 EMA 作为数据集统计的代理」严格来说只对推理成立；训练时每步的归一化随 batch 波动。我的看法（作者没写的）：batch=256 时这个波动很小，但它等于给 latent 加了一层轻量的 batch 级噪声，可能也是训练稳定的隐性因素之一。论文正文没有区分训练/推理这两种统计。

### 3.4 VAE 正则：不让端到端毁掉重建

$$\mathcal{L}_{\mathrm{REG}}=\mathcal{L}_{\mathrm{KL}}+\mathcal{L}_{\mathrm{MSE}}+\mathcal{L}_{\mathrm{LPIPS}}+\mathcal{L}_{\mathrm{GAN}}$$

沿用 SD-VAE 的训法（L1 重建、LPIPS 1.0、GAN 0.1、KL $10^{-6}$），并维护一个判别器（单独 optimizer）。判别器很关键：消融里去掉 $\mathcal{L}_{\mathrm{GAN}}$，gFID 从 16.3 退到 19.2。

### 3.5 一个训练 step 的真实顺序

```text
raw image x (256×256, [0,255])
├─ DINOv2(no_grad) → y = patch tokens (16×16×C')      # 只算一次，两步共用
├─ VAE.encode(x) → z (32×32×4 或 16×16×32), recon = VAE.decode(z)
│
├─ [VAE step]  SiT.eval(), SiT.requires_grad=False
│    z → BN（train 模式，用 batch 统计）→ 加噪 z_t（保存 t, ε）
│    forward 到第 8 层 → 投影 → proj_loss = -cos(y, ĥ)
│    loss_vae = L_REG(x, recon) + 1.5 · proj_loss
│    backward → optimizer_vae.step()
│    loss_d   = L_GAN/Disc(x, recon) → optimizer_disc.step()
│
├─ [DiT step]  SiT.train(), SiT.requires_grad=True
│    z.detach() → BN → 复用同一 (t, ε) → z_t
│    loss_sit = ||v_θ(z_t,t,y) - v_target||² + 0.5 · proj_loss
│    backward → optimizer_sit.step() → EMA(SiT)
└─ 注意：BN 的 running stats 只在 DiT step（train 模式）更新；VAE step 的 eval 模式不改统计
```

### 3.6 超参（论文 §4.1 + 代码默认值一致）

DINOv2（默认 ViT-B）对齐第 8 层；$\lambda_g=0.5$、$\lambda_v=1.5$；AdamW，lr $1\times10^{-4}$ 恒定（VAE、判别器同）；batch 256；bf16/fp16 混合精度；梯度裁剪 + SiT EMA；SDE Euler-Maruyama 250 步采样，50K 图算 FID。

## 4. 实验与证据

### 4.1 收敛速度（Table 1，ImageNet-256，无 CFG，SiT-XL）

| 方法 | tokenizer | epoch | gFID ↓ | sFID ↓ | IS ↑ |
|---|---|---|---|---|---|
| DiT | SD-VAE | 1400 | 9.62 | 6.85 | 121.5 |
| SiT | SD-VAE | 1400 | 8.61 | 6.32 | 131.7 |
| FasterDiT | SD-VAE | 400 | 7.91 | 5.45 | 131.3 |
| MaskDiT | SD-VAE | 1600 | 5.69 | 10.34 | 177.9 |
| REPA | SD-VAE | 20 / 40 / 80 / 800 | 19.40 / 11.10 / 7.90 / 5.90 | 6.06 / 6.06 / 5.06 / 5.73 | 67.4 / 67.4 / 122.6 / 157.8 |
| **REPA-E** | SD-VAE\* | 20 / 40 / 80 | **12.83 / 7.17 / 4.07** | 5.04 / 4.39 / 4.60 | 88.8 / 123.7 / 161.8 |

\* 表示该 VAE 在端到端训练中被更新。80 epoch 的 4.07 已经超过 REPA 800 epoch 的 5.90、MaskDiT 1600 epoch 的 5.69。

### 4.2 消融（Table 6，SiT-L，100K step，无 CFG）

| 变体 | gFID ↓ | sFID ↓ | IS ↑ | Prec. |
|---|---|---|---|---|
| w/o stop-grad | **444.1** | 460.3 | 1.49 | 0.00 |
| w/o batch-norm | 18.1 | 5.32 | 72.4 | 0.67 |
| w/o $\mathcal{L}_{\mathrm{GAN}}$ | 19.2 | 6.47 | 68.2 | 0.64 |
| REPA-E | **16.3** | 5.69 | 75.0 | 0.68 |

三个零件都必要，但量级完全不同：stop-grad 是**生死线**（少了直接崩），BN 和 GAN 各值 1–2 个 FID。

### 4.3 泛化（Table 2–5，SiT-L + SD-VAE + DINOv2-B，100K step）

| 维度 | 基线 → REPA-E |
|---|---|
| 模型尺寸 | SiT-B 49.5→34.8；SiT-L 24.1→16.3；SiT-XL 19.4→12.8（增益随规模**变大**：29.6% / 32.3% / 34.0%） |
| 对齐编码器 | I-JEPA-H 23.0→16.5；CLIP-L 29.2→23.4；DINOv2-B 24.1→16.3；DINOv2-L 23.3→16.0 |
| VAE 架构 | SD-VAE 24.1→16.3；IN-VAE 22.7→12.7；VA-VAE 12.8→11.1 |
| 对齐深度 | 第 6 层 23.0→16.4；第 8 层 24.1→16.3；第 10 层 23.7→16.2 |

CLIP-L 是明显短板（只降 5.8 FID），与「CLIP 特征偏全局语义、patch 级空间信息弱」的直觉一致——但论文没解释。

### 4.4 E2E-VAE 当 drop-in（Table 8，80 epoch，两组都冻结 VAE）

| 扩散模型 | VAE | 无 REPA | 有 REPA |
|---|---|---|---|
| DiT-XL | SD-VAE | 19.82 | 12.29 |
| DiT-XL | VA-VAE | **6.74** | 4.71 |
| DiT-XL | E2E-VAE | 6.75 | **4.20** |
| SiT-XL | SD-VAE | 17.20 | 7.90 |
| SiT-XL | VA-VAE | 5.93 | 4.88 |
| SiT-XL | E2E-VAE | **5.26** | **3.46** |

E2E-VAE 由 VA-VAE + SiT-XL 联合训练得到（Table 8 注）。有意思的细节：**不用 REPA 时 DiT-XL 上 6.75 vs 6.74 基本打平**，收益只在「有 REPA 对齐」时兑现——说明 E2E-VAE 的改进主要是「更可对齐」，而不是「无条件更好生成」。

### 4.5 最终 SOTA（camera-ready 补充材料 Table 13，800 epoch）

| 方法 | tokenizer | epoch | rFID | gFID 无 CFG | gFID 有 CFG |
|---|---|---|---|---|---|
| LightningDiT | VA-VAE | 800 | 0.28 | 2.17 | 1.35 |
| REPA | SD-VAE | 80 | 0.61 | 7.90 | — |
| REPA | SD-VAE | 800 | 0.61 | 5.90 | 1.42 |
| REPA | E2E-VAE | 80 | 0.28 | 3.46 | 1.67 |
| REPA | E2E-VAE | 800 | **0.28** | **1.83** | **1.26** |

这张表是 camera-ready 里**重算过**的：arXiv v2 版对应的 Table 9 报的是 LightningDiT 2.05/1.25、REPA 800 的 5.84/1.28、E2E-VAE 800 的 **1.69/1.12**。所有重算值都略差，说明换过一次评测协议（Appendix C 的 class-balanced 采样，50 张/类），但论文没有逐行说明改了哪个环节。引用数字时必须写清用的是哪一版。

注意：摘要里的最终 FID **不是** 80 epoch 端到端训练的产物，而是「用 REPA-E 训出的 VAE 冻结后，再按标准两阶段训 800 epoch」。80 epoch 的 3.46 也是同一套冻结 E2E-VAE + REPA 的配置（Table 8 末行），不是端到端联合训练的 checkpoint（那个是 4.07）。这是全文最容易误读的一处。

### 4.6 其它证据

- **从零训练**（Table 7）：VAE 也从随机初始化开始，80 epoch gFID 4.34（仍远好于 REPA 的 7.90）；用预训练 VAE 初始化是 4.07。也就是说 VAE 预训练只是锦上添花，不是必需。
- **与 LSGM 目标比**（Table 10，400K step）：naive E2E 444.1、LSGM 熵正则 9.89、REPA-E 4.07。LSGM 能防塌缩但收敛慢得多。
- **高分辨率**（Table 11，ImageNet-512，$64\times64$ latent，SiT-L，100K step）：22.2 → 12.8。
- **文生图**（Table 12，MSCOCO，MMDiT + REPA，100K step）：VA-VAE → E2E-VAE，ODE-50 步 5.43→5.02，SDE-250 步 5.57→4.97。
- **重建代价**（arXiv v2 Table 14；ICCV camera-ready 与补充材料都删掉了这张表）：

| VAE | PSNR ↑ | SSIM ↑ | LPIPS ↓ | rFID ↓ |
|---|---|---|---|---|
| SD-VAE | 25.67 | 0.72 | 0.13 | 0.74 |
| +REPA-E | 24.84 | 0.71 | 0.15 | **0.53** |
| IN-VAE | 27.40 | 0.80 | 0.09 | 0.26 |
| +REPA-E | 26.87 | 0.78 | 0.11 | 0.27 |
| VA-VAE | 26.32 | 0.76 | 0.11 | 0.28 |
| +REPA-E | 26.25 | 0.75 | 0.11 | 0.28 |

论文写的是「保持有竞争力的重建质量」，但逐项看：PSNR 降 0.07–0.83 dB、LPIPS 变差、IN-VAE/VA-VAE 的 rFID 没变好。**这是一次用重建保真度换生成能力的交换**，只是幅度不大。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库：[End2End-Diffusion/REPA-E](https://github.com/End2End-Diffusion/REPA-E)，main 分支 `2ad4e9f`，最后推送 2025-12-06（UTC）。
- 齐全：`train_repae.py`（端到端）、`train_ldm_only.py`（冻结 VAE 的标准训练）、`cache_latents.py`、`generate.py`、`save_vae_weights.py`、`models/`（SiT/VAE/各视觉编码器）、`loss/`（LPIPS、判别器）、`configs/l1_lpips_kl_gan.yaml`、`environment.yml`。
- 权重：[huggingface.co/REPA-E](https://huggingface.co/REPA-E)，含 SD-VAE / IN-VAE / VA-VAE 与三个 E2E-VAE（`e2e-sdvae`、`e2e-invae`、`e2e-vavae`），以及训练好的 SiT checkpoint；README 另有 T2I 系列（FLUX / SD-3.5 / Qwen-Image）。
- 没有：ImageNet 数据（需自备并跑 `preprocessing.py`）、FID 参考统计量（README 让你用 OpenAI guided-diffusion 的 evaluation suite）、任何训练日志/曲线。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| 式 1 REPA 损失（patch 余弦） | `models/sit.py` forward 尾部 `proj_loss`（约 372–379 行）：先 L2 归一化再算 `-(z·z̃).sum(-1)` |
| 式 2 总损失 / $\lambda_g=0.5$ | `train_repae.py` 第 427 行 `denoising_loss + args.proj_coeff * proj_loss`（默认 0.5） |
| 式 2 $\lambda_v=1.5$ | `train_repae.py` 第 389 行 `vae_loss + args.vae_align_proj_coeff * proj_loss`（默认 1.5） |
| 扩散损失 stop-grad | 第 418 行 `x=z.detach()`；VAE step 里 `requires_grad(model, False)` + `model.eval()` |
| BN 层（EMA、无仿射） | `models/sit.py` 第 218 行 `BatchNorm2d(..., affine=False, track_running_stats=True)`；`init_bn`（262 行）写入 VAE 统计；forward 第 318 行 |
| 对齐深度 8 | `models/sit.py` 第 362 行 `if (i+1) == self.encoder_depth: …`（默认 `--encoder-depth 8`） |
| $\mathcal{L}_{\mathrm{REG}}$ 各项权重 | `configs/l1_lpips_kl_gan.yaml`：L1 1.0、LPIPS 1.0、GAN 0.1、KL $10^{-6}$ |
| E2E-VAE 提取 / drop-in | `save_vae_weights.py`；`cache_latents.py` + `train_ldm_only.py`（用 `latents_stats.json` 初始化 BN） |
| 采样与评测 | `generate.py`：`--mode sde --num-steps 250 --label-sampling equal` |

**代码与论文的差异 / 读代码时要留意**

1. **标题就不统一**：CVF 页面与 BibTeX 写 "End-to-End Tuning **of** Latent Diffusion Transformers"，PDF 首页与 arXiv 写 "**with**"。引用时按 BibTeX 的 "of"，但别奇怪于两种写法。
2. **加速倍数的底数没给**：正文与摘要只说「17× / 45×」，唯一的出处是 Fig. 1d，没有说明比较的是 step 数、epoch 数还是 wall-clock。按 Table 1 只能算出 10×（800/80，对 REPA）与 17.5×（1400/80，对 SiT）；45× 需要外推。而且 REPA-E 每步要多做一次 VAE 前向/反向、一次判别器、一次 `align_only` 的 SiT 前向，**wall-clock 加速一定小于 step 加速**，论文没报 GPU-hour。这是我最想补的一个数。
3. **「一次 backward」是叙述简化**：论文写成单个总损失，代码是 VAE、判别器、SiT 三个 optimizer 三次 backward，靠 `z.detach()` 与冻结实现等价的 stop-grad。数学上等价，但显存与吞吐不是「一次前向」的开销。
4. **README 与论文数字有一处不一致**：README 表 B 把 vanilla SiT（1400 epoch）写成 gFID 8.30，论文 Table 1 是 8.61。
5. **同一篇论文有两个版本、两套数字**：camera-ready（PDF + 补充材料 Table 13）报 1.83 / 1.26，arXiv v2/v3 与 README 表 B 报 1.69 / 1.12；补充材料里 REPA 的 800 epoch 也从 5.84/1.28 变成 5.90/1.42。这是一次评测重算（最可能是 class-balanced 采样），但论文既没写 changelog 也没给两版对照。引用前先确定用哪版。
6. `align_only=True` 的分支虽然提前 `break`，后面仍会跑 `final_layer` + `unpatchify`（算出来不用），属于可省的计算，不影响结果。
7. **代码与论文的对齐损失是同一个**：VAE 与 SiT 共享同一个 `proj_loss`，只是系数不同；`models/sit.py` 里没有为 VAE 做任何特殊的梯度路径，全靠外层 detach。

### 5.2 第一个该做的验证（病理方向，不需要大模型）

想验证「REPA-E 的思路能不能搬到病理」，最小实验是**只测潜空间塌缩这一条机制**，不用复现 1.83/1.26：

1. 拿一个公开的病理 tile VAE（PathLDM 的 f8 VAE，或 Hibou/UNI 配套的 reconstructive decoder），在 256×256 的 TCGA patch 上冻结它，训一个小 SiT（比如 SiT-B/2）。
2. 加 REPA 损失，目标特征换成 UNI（ViT-L/16）的 patch token——注意 token 数：$16\times16=256$，所以 latent 必须 patchify 到同样网格，否则代码里 `zip(z, z_tilde)` 会直接因长度不等报错（见 §3.1 的硬约束）。
3. 然后解冻 VAE，分别用「扩散损失反传」和「REPA 反传」各跑 20K step，量三个数：latent 的空间方差/总变差（复现 Table 9 的塌缩）、gFID 或 FD-DINOv2、以及**重建 PSNR/SSIM 在核密集区**。
4. 判据：如果扩散损失把空间方差压到个位数（Table 9 是 17→0.02），就说明机制在病理 latent 上同样成立；再看 REPA 能不能在提升生成指标的同时把重建 PSNR 的跌幅控制在 0.5 dB 内。

比复现 SOTA 更有价值的是第 3 步的**重建-生成权衡曲线**：病理和自然图像不同，0.8 dB 的 PSNR 损失可能意味着染色质纹理被抹平，而这恰好是诊断信息所在。

## 6. 前后关联

- **两阶段 LDM 的起点**：[LDM](06-ldm.md) 定下了「先训 VAE 再冻结」的范式，REPA-E 正面挑战这个范式。
- **骨干**：[DiT](07-dit.md) 的 Transformer 结构 + [SiT](01-jit.md) 的 interpolant 目标（本文用 `path_type=linear`、`prediction=v`），采样走 [Score-SDE](04-score-sde.md) 那套 SDE 积分器。
- **REPA 原论文**：arXiv:2410.06940（ICLR 2025 Oral），本文的损失、对齐深度、系数全部沿用，只是把梯度多送了一站。
- **同方向但路线相反**：[RAE](16-rae.md) 干脆**不要 VAE**，用预训练表征编码器 + 学出来的解码器；[RAE-v2](17-raev2.md) 继续这条路。REPA-E 的回答是「VAE 可以留，但要让它被生成目标塑形」。两者可以放在一张图上对比：一个换掉 tokenizer，一个驯服 tokenizer。
- **同期工作**：Eq-VAE（arXiv:2502.09509）用等变正则改潜空间；VA-VAE / LightningDiT（arXiv:2501.01423）在对齐视觉基础模型的同时训 VAE，但**不与扩散损失联合**；"Improving the Diffusability of Autoencoders"（arXiv:2502.14831）从数据侧分析同一问题。REPA-E 与它们的差别就在「联合」二字。
- **病理侧**：[PathLDM](../pathology/71-pathldm.md)、[BigCell](../pathology/64-bigcell.md)、[Stream](../pathology/65-stream.md) 都直接用现成 VAE（多为 f8/f4）；[HistDiT](../pathology/62-histdit.md) 是病理 DiT 的直接对照。REPA-E 给出的问题是：这些工作的 VAE 潜空间，是为了重建还是为了生成选的？

## 7. 局限与可检验问题

**作者承认的 / 数据本身显示的**：
- 只在 ImageNet-256/512 与 MSCOCO-100K step 上验证，没有大规模文生图（T2I 只是把 E2E-VAE 塞进 MMDiT 跑 100K step）。
- 重建质量有小幅下降（arXiv Table 14）；论文措辞是「competitive」而非「无损」，而 camera-ready 直接把这张表删了——这个删除本身值得注意。
- 端到端训练更贵：每步多一次 VAE 前反向 + 判别器 + 一次对齐前向；论文没给任何 wall-clock 或 GPU-hour。
- 依赖 DINOv2 这类强编码器；CLIP-L 上增益明显缩水（Table 3）。
- VAE 侧的改进用 PCA 可视化 + 空间方差/总变差刻画，**没有线性探针、分割或任何下游任务指标**证明「潜空间更好」。

**我的看法（作者没写的）**：
1. **17×/45× 这两个数字目前不可核验**。它们是摘要里最醒目的卖点，却没有定义分母；按表格只能算出 10× 与 17.5×。要么补 Fig. 1d 的读法，要么改写成「80 epoch 达到 REPA 800 epoch 之上的 FID」这种可查证的表述。
2. **CKNNA 与 gFID 的相关性只有趋势，没有系数**。Fig. 3b 是散点，正文没给 Spearman/Pearson，也没给拟合。作为「代理指标」的核心论据，这偏弱。
3. **Table 8 里 DiT-XL 无 REPA 时 E2E-VAE 6.75 vs VA-VAE 6.74**，这个平局说明 E2E-VAE 并非普适更强，收益与「是否用对齐损失」强耦合。论文没有正面讨论。
4. **BN 的 EMA 统计在 VAE step 不更新**（代码 `model.eval()`）。这意味着 VAE 侧看到的是「上一步 DiT 更新后的统计」，两个模块的归一化存在一步延迟；论文完全没提这个细节，但它可能是 stop-grad 之外另一个稳定因素。
5. **VAE 与 DiT 共用 lr $10^{-4}$**。GAN 微调通常需要更小 lr，这里没做敏感性分析；w/o GAN 掉 3 个 FID，说明 VAE 侧其实很敏感。

**迁移到病理时要回答的问题**：
- 病理 VAE 多为 f8/f4，latent 网格远大于 $16\times16$，与 UNI（16×16 token）对齐必须 patchify 或池化——池化会丢核级细节，patchify 会让对齐变成「局部 vs 局部」，语义层级是否还成立？未确认。
- 病理的「重建保真」权重远高于自然图像：染色质纹理、核膜轮廓都是诊断依据。REPA-E 那 0.8 dB 的 PSNR 损失在 H&E 上意味着什么，需要实测。
- 病理基础模型（UNI、CONCH、Virchow）的特征是否适合做 REPA 目标？它们是 WSI patch 级判别特征，未必保留生成所需的空间细节。

## 8. 来源与版本

- arXiv 摘要页：<https://arxiv.org/abs/2504.10483>（v1 2025-04-14；v2 2025-10-21；v3 2025-10-22）
- arXiv HTML 全文：<https://arxiv.org/html/2504.10483v2>（本页 §1–5 与 Appendix A–C 的文字、Table 1–8 与 14 出自此版本）
- ICCV 2025 CVF Open Access：<https://openaccess.thecvf.com/content/ICCV2025/html/Leng_REPA-E_Unlocking_VAE_for_End-to-End_Tuning_of_Latent_Diffusion_Transformers_ICCV_2025_paper.html>（pp. 18262–18272；PDF 主文 11 页，Table 9–13 在补充材料）
- ICCV 补充材料：<https://openaccess.thecvf.com/content/ICCV2025/supplemental/Leng_REPA-E_Unlocking_VAE_ICCV_2025_supplemental.pdf>（Table 9 潜在空间方差、Table 10 LSGM、Table 11 ImageNet-512、Table 12 T2I、Table 13 系统级对比）
- **版本差异（重要）**：camera-ready 的系统级结果整体重算并下调（E2E-VAE 800 epoch：1.69/1.12 → **1.83/1.26**；REPA 800：5.84/1.28 → 5.90/1.42；LightningDiT 2.05/1.25 → 2.17/1.35），arXiv v2 Table 14 的重建指标表在 camera-ready 中被删除。代码仓库 README 仍是旧数字。本页 §4.5 用 camera-ready，其余各节注明来源版本。
- 代码：<https://github.com/End2End-Diffusion/REPA-E>（main，commit `2ad4e9f`，2025-12-06 推送）
- 权重：<https://huggingface.co/REPA-E>（`e2e-sdvae`、`e2e-invae`、`e2e-vavae`、`sit-repae-*`）
- 项目页：<https://end2end-diffusion.github.io>
- 背景 REPA：Sihyun Yu et al., Representation Alignment for Generation, ICLR 2025 (Oral)，arXiv:2410.06940；代码 <https://github.com/sihyun-yu/REPA>
- 对比方法 LSGM：Vahdat et al., Score-based Generative Modeling in Latent Space, NeurIPS 2021（本文 Appendix B 的熵正则对照）
