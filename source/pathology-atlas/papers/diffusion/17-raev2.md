# 17｜RAEv2：把 RAE 的三个设计默认值改对，80 epoch 到 gFID 1.06

**论文**：Improved Baselines with Representation Autoencoders  
**作者**：Jaskirat Singh、Boyang Zheng、Zongze Wu、Richard Zhang、Eli Shechtman、Saining Xie（Adobe Research；ANU；NYU）  
**发表**：NeurIPS 2026 Poster（`neurips.cc/virtual/2026/poster/149740`，Paris Poster Hall #P316，2026-12-10）；arXiv:2605.18324 v1（2026-05-18）/ v2（2026-06-15）  
**定位**：表示自编码器（RAE）的工程化基线：多层特征求和、自 REPA、用 REPA 头做免额外前向的引导  
**核验**：2026-11-18 依 arXiv HTML v2 全文（正文 §1–6，附录 A/B/C/E，Table 1–19，Fig. 4–15）整理；代码对照 `nanovisionx/RAEv2` main 分支（唯一提交 `8a0d238` "init"，提交时间 2026-05-21，仓库 `pushed_at` 2026-05-21T21:24Z）。本页只读论文与代码，**未下载权重、未训练、未采样、未跑 FID**；所有数字为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | ImageNet-256 类条件生成（主实验）；文本到图像 256；导航世界模型（RECON 视频预测，16 s 自回归） |
| 输入 / 输出 | 图像 → DINOv3-L patch 特征 $x\in\mathbb{R}^{256\times1024}$（16×16，patch 16）→ 流匹配 DiT 在潜空间做 x-prediction → 冻结解码器还原像素 |
| 三个改动 | ① MLS：$x=\sum_{\ell\in S}z_\ell$ 聚合多层；② 自 REPA：同一编码器既当 RAE 编码器又当对齐目标；③ 把 DiT 输出改写成 x-prediction，使 REPA 头充当 internal guidance 的弱基线 |
| 规模 | DiT DH-XL：28 层 encoder（1440 维）+ 2 层 DDT decoder（2048 维）；839M 参数 |
| 训练 | ImageNet-1K，batch 1024，80 epoch；4×8 H100 约 12 h（脚注写 ~10.5 h） |
| 代码 / 权重 | 官方仓库 CC BY-NC 4.0；权重 `nyu-visionx/RAEv2-models`（146 个文件），数据 `nanovisionx/RAEv2-data` |

## 原文摘要

> Representation Autoencoders (RAE) replace traditional VAE with pretrained vision encoders. In this paper, we systematically investigate several design choices and find three insights which simplify and improve RAE. First, we study a generalized formulation where the representation is defined as sum of the last k encoder layers rather than solely the final layer. This simple change greatly improves reconstruction without encoder finetuning or specialized data (e.g., text, faces). Second, we study the prevalent assumption that RAE (using pretrained representation as encoder) replaces representation alignment (REPA), which distills the same representation to intermediate layers instead. Through large-scale empirical analysis, we uncover a surprising finding: RAE and REPA exhibit complementary working mechanisms, allowing the same representation to be used as both encoder and target for intermediate diffusion layers. Finally, the original RAE struggles with classifier-free guidance (CFG) and requires training a second, weaker diffusion model for AutoGuidance (AG). We show that REPA itself can be viewed as x-prediction in RAE latent space. By simply re-parameterizing the output of the DiT model, it can provide guidance for "free". Overall, RAEv2 leads to more than 10x faster convergence over the original RAE, achieving a state-of-the-art gFID of 1.06 in just 80 epochs on ImageNet-256. On FDr6, RAEv2 achieves a state-of-the-art 2.17 at just 80 epochs compared to the previous best 3.26 (800 epochs) without any post-training. This motivates EPFID@k (epochs to reach unguided gFID < k) as a measure of training efficiency. RAEv2 attains an EPFID@2 of 35 epochs, versus 177 for the original RAE. We also validate our approach across diverse settings for text-to-image generation and navigation world models, showing consistent improvements. The code is available at this https URL.

*来源：arXiv:2605.18324 v2 摘要页，逐字保留（仅 HTML 实体还原，`&#34;free&#34;` 恢复为 "free"）。*

## 中文摘要

> 表示自编码器（RAE）用预训练视觉编码器取代传统 VAE。本文系统考察若干设计选择，得到三条简化并改进 RAE 的结论。第一，我们研究一种推广形式：表示取编码器最后 $k$ 层之和，而非只用最后一层。这一简单改动大幅提升重建，且无需微调编码器、也不需要专门数据（如文本、人脸）。第二，我们检验一个流行假设——RAE（用预训练表示当编码器）取代了表示对齐（REPA，把同一表示蒸馏到中间层）。通过大规模实证分析，我们发现一个反直觉的结果：RAE 与 REPA 的工作机制互补，因此同一表示可以既当编码器、又当中间扩散层的对齐目标。最后，原始 RAE 难以使用无分类器引导（CFG），需要再训一个更弱的扩散模型做 AutoGuidance（AG）。我们指出，REPA 本身可视为 RAE 潜空间中的 x-prediction；只要把 DiT 模型的输出重新参数化，它就能「免费」提供引导。总体上，RAEv2 相比原始 RAE 收敛快 10 倍以上，在 ImageNet-256 上仅 80 epoch 即达到 1.06 的 SOTA gFID；在 FDr6 上，80 epoch 达到 SOTA 2.17，此前最好为 3.26（800 epoch），且不做任何后训练。这促使我们用 EPFID@k（无引导 gFID 降到 $<k$ 所需 epoch 数）衡量训练效率：RAEv2 的 EPFID@2 为 35 epoch，原始 RAE 为 177。我们还在文本到图像与导航世界模型等不同设定上验证了方法，均取得一致改进。代码已公开。

*译文：对应上方原文逐句对译，未增删内容；`EPFID@2`、`FDr6` 等记号保留英文。*

## 0. 三分钟摘要

**一句话**：RAE 有三个「看起来无害」的默认值——表示只取编码器最后一层、以为有了 RAE 就不需要 REPA、以为 CFG 能直接用。这三个都错；改掉之后，训练 80 epoch 就有 gFID 1.06，而且引导既不要第二个模型，也不要多一次前向。

**问题**（§1）：
1. RAE 的重建落后专用 VAE：原版 RAE 在 ImageNet 上 rFID 0.60 / PSNR 18.93（Table 13），而 SD-VAE、Flux-VAE 这类专用 VAE 明显更好。
2. RAE 与 CFG 不兼容：DH-XL/20 epoch 下不加引导 gFID 3.75，加 CFG 反而 3.86，只有 AutoGuidance（再训一个更弱模型）能到 3.31（Table 1）。
3. 编码器表示「默认只取最后一层」，但预训练的语义层与纹理层分布在整个深度上（Fig. 15）。

**三条 insight 与它们的支撑数字**：

| insight | 做法 | 关键证据 |
|---|---|---|
| ① 多层求和 | $x=\sum_{\ell\in S}z_\ell$，$K$ 层，潜空间形状不变、零新增参数 | $K=23$ 时 rFID 0.18 / PSNR 27.03（RAE 0.60 / 18.93），gFID（带引导）$K=7$ 最好 1.06 |
| ② 自 REPA | 同一编码器既当编码器又当 REPA 目标；27 个编码器扫描 | 所有编码器上 RAE+REPA 都优于纯 RAE；DINOv3-L 从 3.30 降到 2.61（20 ep，无引导） |
| ③ REPA 头自引导 | 输出改 x-prediction，$\hat x_{\text{guided}}=\hat x_{\text{full}}+w(\hat x_{\text{full}}-\hat x_{\text{repa}})$ | $K=7$：无引导 1.65 → CFG 1.49 → AG 1.14 → REPA 引导 1.06 |

**它到底做到了什么**：
- ImageNet-256 80 epoch：gFID **1.06**（带引导）、FDr6 **2.17**、EPFID@2 **35**（RAE-XL 800 epoch 是 177）。
- 推理零额外成本：引导复用同一次前向里的 REPA 头 / 早退分支，不像 CFG 要把 batch 翻倍。
- 重建与生成的 Pareto 前沿：$K$ 是连续旋钮，$K=7$ 偏生成、$K=23$ 偏重建。
- 迁移：T2I 预训练 GenEval 41.7（Flux-VAE）→ 62.4，微调后 82.7；NWM 的 FVD 312.01（RAE）→ 105.61。

### 实验先看什么

Fig. 7（$K$ 扫描：重建单调变好、无引导生成在 $K=1$ 最好、带引导在 $K=7$ 最好）→ Table 4/16（四种引导对比）→ Table 7（EPFID@2 与 FDr6，全文效率主张的核心表）→ Table 13（重建-生成权衡，与 DINO-SAE / RPiAE / AlignTok 同台）。

## 1. 问题与核心判断

- **RAE 是什么**：把潜空间从 VAE 换成冻结的预训练视觉编码器 patch 特征（DINOv2/DINOv3 等）。优点是语义强、可与理解任务共享 tokenization；缺点是重建差、不能 CFG、表示只取最后一层。本文不改框架，只改这三个默认值。
- **对「RAE 已包含 REPA」的反驳**：既然 RAE 已经把编码器特征喂给 DiT，再把同一特征蒸馏到中间层看起来是多余的 skip connection（§2.2 引 RAE/REPA-E/DINO-SAE）。作者在 27 个编码器上实测，结论相反：REPA 依然有用，但**作用点不同**。
- **为什么 CFG 在 RAE 上失效**：论文没有给机理，只给了现象（Table 1）。作者的替代方案是 internal guidance：用模型自己的弱预测当基线。这个思路来自 Autoguidance（弱模型基线）与 internal dynamics guidance，本文的新意是**弱基线不必另训**——REPA 头本来就是「只看第 8 层特征的线性预测」，天然比全模型弱。
- **核心判断**：这三条不是三个 trick 的堆叠，而是同一个观察的三个面——预训练编码器的信息分布在深度上（①）、扩散模型需要的是「语义 + 空间结构」两种性质（②）、以及弱基线可以来自模型内部（③）。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| RAE | 用冻结视觉编码器的 patch 特征当扩散潜空间，后面接一个单独训好的解码器 |
| REPA | 在 DiT 第 8 层接一个线性头，回归编码器特征；只加训练损失，推理时可丢掉 |
| 自 REPA（self-REPA） | REPA 的目标编码器就是 RAE 自己的编码器，$\hat x_{\text{repa}}=h_\phi(h)$ |
| MLS / MLR | Multi-Layer Sum / Multi-Layer Random projection：两种零参数的层聚合方式 |
| AutoGuidance（AG） | 另训一个更小的扩散模型当「弱模型」，用强弱差做引导 |
| Internal guidance（IG） | 用同一模型内部的弱预测（早退层、浅层头）当弱基线 |
| x-prediction | 网络直接输出干净 latent $\hat x$，而不是速度 $v$；二者可互转 $v=(x_t-\hat x)/t$ |
| rFID / gFID | 重建 FID（Stage-1）/ 生成 FID（Stage-2，50K 样本，balanced sampling） |
| FDr6 | 在 Inception、ConvNeXt、DINOv2、MAE、SigLIP、CLIP 六个特征空间各算 FD_r，再汇总 |
| EPFID@k | 无引导 gFID 首次降到 $\le k$ 所需的训练 epoch 数；本文报 $k=2$ |
| LP / LDS | ImageNet 线性探针准确率（全局语义）/ iREPA 的 local distance similarity（空间结构） |

## 3. 核心方法与数据流

```text
图像 256×256
  └─ 冻结编码器（DINOv3-L，24 层）
        └─ 取层集合 S（K=1 时是最后一层；K=7 时是 11,13,…,23；K=23 时是 1…23）
              └─ MLS 聚合 → x ∈ R^{256×1024}（形状与 K=1 完全相同）
                    ├─ Stage-1：解码器重建（单独训 16 epoch，之后冻结）
                    └─ Stage-2：流匹配 DiT（DH-XL）在 x 空间做 x-prediction
                          ├─ 第 8 层特征 h ──线性头 h_φ──> x̂_repa（REPA 损失 + 引导基线；按论文，代码实际用早退头，见 §5.1）
                          └─ 全模型输出 x̂_full
                                └─ 采样：x̂ = x̂_full + w(x̂_full − x̂_repa)，再转回 v
```

### 3.1 广义表示编码器（§2.1，Eq. 1–2）

记第 $\ell$ 层特征图为 $z_\ell\in\mathbb{R}^{N\times d}$，$N=256$，$d=1024$：

$$x=\sum_{\ell=L-K+1}^{L}z_\ell\ \in\mathbb{R}^{N\times d}\qquad(\text{Eq. 1, MLS})$$

$$x=\big[z_{L-K+1}\,\|\,\cdots\,\|\,z_{L}\big]R\ \in\mathbb{R}^{N\times d},\quad R\in\mathbb{R}^{Kd\times d}\ \text{固定随机矩阵}\qquad(\text{Eq. 2, MLR})$$

为什么不直接拼：沿序列拼得到 $LN\times d$，token 数变 $K$ 倍，扩散模型代价爆炸；沿通道拼得到 $N\times Kd$，潜空间维度变大、更难学。两种聚合都保持 $N\times d$、零新增参数，原版 RAE 是 $K=1$ 的特例。

实验结论（Table 3、15）：MLS 与 MLR 在 Stage-1 重建上基本打平（$K=2$：rFID 0.532 vs 0.570；$K=8$：0.264 vs 0.268），但 Stage-2 gFID 上 MLS 每一档都赢（$K=2$：2.586 vs 3.085；$K=8$：2.688 vs 3.580）。因此默认用 MLS。

### 3.2 RAE 与 REPA 互补（§2.2）

实验：同一表示既当编码器又当第 8 层的 REPA 目标，扫 27 个编码器 / 8 个家族。结果是在**所有**编码器上 REPA 都带来提升。机理拆解（Fig. 5）：加 REPA 对扩散特征的**全局语义**（线性探针）几乎无影响，但明显改善**空间自相似结构**（token 间注意力），即 iREPA 指出的那一维。

相关性分析（Fig. 6，27 个编码器，DDT-XL，20 epoch，无引导），$r$ 为与 gFID 的 Pearson 相关（表中带符号，正文按 $|r|$ 讨论——符号约定前后不一致，只能看绝对值）：

| 设定 | LP | LDS | 平均 |
|---|---|---|---|
| 仅 REPA（SD-VAE） | +0.34 | −0.89 | −0.56 |
| 仅 RAE | −0.81 | −0.13 | −0.55 |
| RAE + REPA | −0.64 | −0.53 | **−0.83** |

读法：只用 REPA 时，编码器的空间结构（LDS）决定成败；只用 RAE 时，全局语义（LP）决定成败；两者合用后，**两个指标的平均**才最有预测力——这正是「互补」的量化版本，也解释了为什么 RAEv2 下更强的 DINOv3-L（LP 87.0、LDS 0.42）反而最好（Table 2：RAEv2 2.61，原 RAE 3.30）。

### 3.3 把 REPA 改写成 x-prediction（§2.3，Eq. 3）

RAE 里干净 latent 就是编码器输出 $x=E(I)$，而 REPA 头做的正是 $\hat x_{\text{repa}}=h_\phi(h)$——这**就是**潜空间里的 x-prediction。于是只要把全模型输出也写成 x-prediction，两个量同空间可比：

$$\hat x_{\text{guided}}=\hat x_{\text{full}}+w\cdot(\hat x_{\text{full}}-\hat x_{\text{repa}}),\qquad v=\frac{x_t-\hat x_{\text{guided}}}{t}\qquad(\text{Eq. 3})$$

三个性质：
- **不用第二个模型**：$h_\phi$ 是只读第 8 层特征的线性层，天然比全模型弱，正是 AG 需要的「弱基线」。
- **不用额外前向**：$h_\phi$ 在同一次前向里就跑了（训练时它还要接 REPA 损失，属于深度监督）。
- **必须改 x-prediction**：Table 17 显示，同样用 IG，v-prediction 版 gFID 1.87，x-prediction + REPA 头 1.65（均无引导、$K=7$、80 epoch）。

### 3.4 训练与采样细节（附录 A，Table 10/11）

- 骨干：DDT（DiT DH-XL），28 层 encoder / 2 层 decoder，hidden 1440/2048，RMSNorm + SwiGLU + RoPE+APE，in-context 条件（4 个时间 token + 8 个类 token）。
- REPA：第 8 层，单线性投影到目标编码器维度，$\lambda=0.5$（正文），目标编码器 = RAE 编码器。
- 流匹配：logit-normal 时间采样，x-prediction；lr $2\times10^{-4}$ → $2\times10^{-5}$，warmup 25 epoch，weight decay 0，EMA 0.9995，bf16，batch 1024。
- 采样：Euler ODE，50 步（采样配置里 ImageNet k7 写的是 100 步），引导区间 $[0,1]$。
- Stage-1：解码器单独训 16 epoch 后冻结；每个 $K$ 都重训一个解码器。

## 4. 实验与证据

**编码器选择（Table 2，完整扫描见 Table 12；20 epoch，无引导）**——同一个编码器在原 RAE 与 RAEv2($K=1$) 下的 gFID：

| 编码器 | LP | LDS | RAE | RAEv2 ($K{=}1$) |
|---|---|---|---|---|
| MoCov3-B | 76.4 | 0.15 | 13.84 | 8.35 |
| CLIP-L | 84.5 | 0.14 | 7.85 | 4.38 |
| PE-B | 80.7 | 0.20 | 6.22 | 3.88 |
| WebSSL-1B | 84.1 | 0.18 | 8.60 | 4.16 |
| DINOv2-B | 83.9 | 0.41 | 3.75 | 2.81 |
| DINOv3-L | 87.0 | 0.42 | 3.30 | **2.61** |

结论有两层：一是 RAEv2 在每个编码器上都更好；二是**最优编码器变了**——原 RAE 选 DINOv2-B，RAEv2 选 DINOv3-L，与 §2.2 的「LP+LDS 平均」判据一致。

**$K$ 扫描（Fig. 7，DINOv3-L，80 epoch）**：

| $K$ | rFID ↓ | PSNR ↑ | gFID 无引导 ↓ | gFID 带引导 ↓ |
|---|---|---|---|---|
| 1（原 RAE） | 0.60 | 18.93 | ≈1.50 | — |
| 7 | 0.29 | 22.57 | 1.65 | **1.06** |
| 23 | **0.18** | **27.03** | 3.02 | 1.25 |

重建随 $K$ 单调变好；无引导生成在 $K=1$ 最好，带引导生成在 $K=7$ 最好。这条「反直觉」的交叉是本文最实用的经验：**重建最优的 $K$ 不等于生成最优的 $K$**。

**引导机制（Table 16，80 epoch）**：

| 引导 | $K=7$ gFID | $K=7$ IS | $K=23$ gFID | $K=23$ IS |
|---|---|---|---|---|
| 无 | 1.65 | 228.0 | 3.01 | 206.0 |
| CFG | 1.49 | 242.1 | 2.83 | 220.1 |
| AutoGuidance | 1.14 | 255.3 | 1.37 | 252.0 |
| REPA 引导 | **1.06** | 255.3 | **1.25** | **256.8** |

注意 CFG 在 RAE 上确实几乎无效（1.65→1.49），Table 1 的 20 epoch 设定下甚至更差（3.75→3.86）。论文未给出 CFG 的 scale / 区间，因此「CFG 不行」是**在该未报告超参下**的结论，不是普适结论。

**规模（Table 6，20 epoch）**：B 165M 5.48→3.37；L 470M 3.80→2.76；XL 839M 3.75→2.61。

**训练效率（Table 7，核心表）**：

| 方法 | epoch | EPFID@2 | gFID | FDr6 |
|---|---|---|---|---|
| SiT-XL/2 | 800 | >800 | 2.12 | 8.44 |
| REPA-E | 800 | 480 | 1.12 | 3.04 |
| RAE-XL | 800 | 177 | 1.13 | 3.26 |
| RAEv2（$K{=}7$） | 80 | **35** | **1.06** | **2.17** |

两个易混点：表里 **gFID 是带引导值**，而 **EPFID@2 按定义用无引导 gFID**；两个数不是同一协议下的同一量。另外 **FDr6 是六个 FD_r 的算术平均**（我按表核算：RAEv2 六项 0.64/0.77/1.15/2.67/2.54/5.21，均值 2.163；RAE-XL 六项均值 3.258），论文正文称其为 geometric mean，与数值不符。

**重建-生成权衡（Table 13，80 epoch，gFID 为无引导）**：

| 方法 | 免训练 | rFID ↓ | PSNR ↑ | gFID ↓ |
|---|---|---|---|---|
| DINO-Tok | ✗ | 0.32 | 28.54 | 5.94 |
| DINO-SAE | ✗ | 0.37 | 26.20 | 3.07 |
| AlignTok | ✗ | 0.26 | 25.83 | 3.71 |
| RPiAE | ✗ | 0.50 | 21.30 | 2.25 |
| RAE | ✓ | 0.602 | 18.93 | **2.23** |
| RAEv2 $K{=}7$ | ✓ | 0.29 | 22.57 | 1.65 |
| RAEv2 $K{=}23$ | ✓ | **0.18** | **27.03** | 3.02 |

「免训练」只指**编码器**不动：每个 $K$ 的解码器仍要重训 16 epoch；$K=23$ 的 PSNR 27.03 略低于 DINO-Tok 的 28.54，但 rFID 0.18 优于其 0.32，重建与生成同时压过所有表示型自编码器。

**理解任务不被破坏（Table 5/18，30 epoch 线性探针）**：$K=1$ 85.39、$K=7$ 85.10、$K=23$ 85.24。多层求和没有牺牲语义，这是「统一 tokenization」主张的关键支撑。

**T2I（Table 8）**：预训练 GenEval 41.7（Flux-VAE）→ 58.4（RAE）→ 62.4；微调后 78.3 → 81.5 → **82.7**；DPG 预训练 77.6 → 80.1 → 81.7，微调 79.2 → 80.6 → 82.3。

**导航世界模型（Table 9，RECON，16 s 自回归）**：FVD DIAMOND 762.73 / NWM 200.97 / RAE 312.01 / RAEv2 **105.61**；单帧协议下 30K iter 收敛到 FID 7.5（RAE 18.0）、LPIPS 0.24（0.29），并在前 10K iter 就追上 RAE 的最终 FID。作者把大部分增益归给 §2.1 的多层聚合：早层保留的低层纹理/几何对时序一致性更关键。

**替代指标（Table 19，Monge Distance）**：六空间里五个最好（Incep 0.997 vs RAE 0.808 是唯一例外）。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库 <https://github.com/nanovisionx/RAEv2>，README 明确写 "Official PyTorch Implementation"，作者列表与论文一致，许可证 **CC BY-NC 4.0**（非 Apache/MIT，商用需注意）。
- 只有一个提交 `8a0d238`（2026-05-21），无 release；从 RAE / REPA / REPA-E / iREPA / JiT 改来。
- issue 区有 10 条未关闭讨论，其中几条正好落在本页要提醒的点上：#20 指出 `train_stage1.py` 里 `rae.decoder.requires_grad_(True)` 会把本该固定的 sin-cos `decoder_pos_embed` 一起解冻（报告者核对官方权重后确认位置编码已偏离公式）；#19 问 T2I 的 Stage-2 权重（HF 上确实没有）；#18 问位置编码到底是 APE+RoPE 还是只用 RoPE；#16 提出 SigLIP2 编码器的归一化可能有 bug；#1 讨论多层特征融合。
- 能跑的部分：`src/train_stage1.py`（Stage-1 编解码，支持 80+ 编码器命名，如 `dinov3mls-vit-l16[layers=11.13.15.17.19.21.23]`）、`src/train.py`（Stage-2，ImageNet/T2I/NWM 各三档 $K$ 配置）、`src/offline_eval.py`、`src/eval/*`。
- 资产齐全：`nyu-visionx/RAEv2-models` 有各家族编码器、多数 `k1` 阶段的 decoder+stats、`general` 的 $K=7/K=23$ decoder；ImageNet 的 DINOv3-L 解码器覆盖 $K=1\ldots10,18,21\ldots24$（$k24$ = 全部 24 层，论文没报）。但 **Stage-2 只放了 `stage2/imagenet/dinov3l-k7/checkpoint.pt` 一个**——T2I 与 NWM 的 Stage-2 权重没有公开。
- 数据：`nanovisionx/RAEv2-data`（imagenet-256 / blip3o-256 / rendertext-256 / scale-rae-256 / recon-256）。
- 环境：`uv sync`；训练脚本按 `torchrun --nproc_per_node=8` 写死单机 8 卡。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| Eq. 1 MLS 多层聚合 | `src/encoders/vision_encoder.py` → `DINOv3MultiLayerSimpleAddEncoder.forward_features`（约 333 行）、`SigLIP2MultiLayerSimpleAddEncoder` |
| Eq. 2 MLR 随机投影 | 同文件仅见 MLS 系列；**MLR 未在仓库中实现**（配置与 README 都只给 `mls`） |
| Eq. 3 internal guidance | `src/utils/guidance_utils.py` → `forward_with_internalguidance`：`ig_out = base + ig*(full - base)` |
| REPA 损失 | `src/stage2/transport/transport.py` → `training_losses`：`repa_coeff * MSE(z_t_pred, z_clean)` |
| REPA 头 | `src/stage2/models/DDT.py:118` → `self.repa_projector = nn.Linear(enc_hidden_size, z_dim)`，第 8 层取特征 |
| 引导基线 | `DiTwDDTHeadIG`（`DDT.py:207`）：第 8 层早退 + **独立的 `base_final_layer`** |
| x-prediction | `configs/stage2/training/*.yaml`：`transport.prediction: x`；`transport.convert_model_pred` 统一转 v |
| 引导超参 | `configs/stage2/sampling/imagenet-dinov3l-k7.yaml`：`ig.scale=1.78, t_min=0.10`，采样 100 步 |

**代码与论文不一致的地方（读代码/复现时要留意）**

1. **MLS 在代码里不是「求和」**。`DINOv3MultiLayerSimpleAddEncoder` 实际是 `stack(outputs).mean(0)`，再**加上最后一层的 token 均值广播**：`patch_tokens = mean_layers + final_mean`。均值与求和只差常数因子（被 latent 归一化吸收），但那个广播的全局均值项论文完全没写——它相当于给每个 token 塞了一个 CLS 式全局信号。消融里没有拆开这一项。
2. **$K=7$ 取的不是「最后 7 层」**。所有 $K=7$ 配置都写 `layers=11.13.15.17.19.21.23`，即 24 层编码器上**跨步 2 的 7 层**；$K=23$ 是 `1…23`（跳过第 0 层）。论文 Eq. 1 与正文说 "last K layers"，与实际选层不符。$K$ 的语义更接近「取后段的 $K$ 个稀疏层」。
3. **引导基线不是 REPA 头**。论文 §2.3 说用 $h_\phi$ 当弱基线；`DiTwDDTHeadIG` 实际用第 8 层特征接一个**新的 `base_final_layer`**（zero-init），并且训练时对它也加损失（`transport.training_losses` 里 `base_model_coeff=1.0`）。所以「免费」成立的是「不多一次前向、不另训模型」，但**多了一组可训练参数**。同时 `guidance_utils` 的公式是 `base + s*(full-base)`，与 Eq. 3 的 `full + w*(full-base)` 差一个参数化（$s=1+w$，配置 $s=1.78 \Rightarrow w=0.78$）。
4. **REPA 系数**：Table 10 写 $\lambda=1.0$，附录正文写 $\lambda=0.5$，代码默认 `repa_coeff=0.5`。以 0.5 为准，Table 10 是笔误。
5. **注意力头数**：Table 10 写 encoder 16 heads，所有 Stage-2 配置写 `num_heads: [20, 16]`（encoder 20、decoder 16）。
6. **采样步数**：Table 11 写 50 步，ImageNet $K=7$ 的采样配置写 100 步。
7. **REPA 投影维度**：附录说 1152→768，这只对 T2I（SigLIP2-B，768）成立；ImageNet 用 DINOv3-L，`z_dim=1024`。
8. **训练时长**：脚注 ~10.5 h，附录 Compute 写 roughly 12 h。
9. **MLR 只在论文里**：Table 3/15 的 MLR 对比没有对应实现，无法直接复现那一列。

这些不一致大多不影响主结论（$K$ 扫描、引导对比），但**第 1、2、3 条会改变你对「方法是什么」的理解**：RAEv2 实际是「后段稀疏层均值 + 全局均值」+「第 8 层早退头」，而不是字面上的「最后 $K$ 层相加 + REPA 头当基线」。

### 5.2 第一个该做的验证（不用训练扩散模型）

先只验 **Stage-1**，因为编码器与 decoder 都有公开权重，纯前向即可：

1. 取 ImageNet 验证集 500–1000 张，分别用 `dinov3-vit-l16`（$K=1$）与 `dinov3mls-vit-l16[layers=11.13.15.17.19.21.23]`（$K=7$）抽特征，配对应 `stage1/imagenet/dinov3l-k{1,7}/decoder.pt` 重建；
2. 算 rFID / PSNR，检查是否复现「$K=1$ → 0.60/18.93、$K=7$ → 0.29/22.57」的趋势（不必等值，趋势与量级一致即可）；
3. 顺手验证代码 vs 论文的两处差异：把 `mean + final_mean` 改成纯 `sum`，看 rFID 变化多少——如果几乎不变，说明论文的「求和」与代码的「均值+全局项」在效果上等价，第 1 条不一致可以降级为表述问题；如果变差，说明那个未写的全局项是有效成分。

**迁移到病理的第一个问题**：病理 RAE（如用 UNI / Virchow 类编码器）里，$K$ 的选择很可能与自然图像不同——H&E 的判别信息（核形态、核分裂）更依赖中层高分辨率特征，而语义层（组织类型）对诊断帮助有限。用同一套 MLS 在 CAMELYON16 / TCGA 切片上扫 $K\in\{1,3,7,23\}$，同时测重建（PSNR/SSIM/LPIPS）与一个下游线性探针（肿瘤 vs 正常、或分级），就能回答「病理的最优 $K$ 是否比自然图像更靠前」。这一步不需要扩散模型，也不需要 GPU 集群。

## 6. 前后关联

- **直接前作**：[RAE](16-rae.md)（把 VAE 换成预训练编码器，本文的基线）、[REPA-E](15-repa-e.md)（端到端调 VAE 的 REPA 变体，本文引作对照并指出它需要改编码器）。
- **REPA 线**：REPA（Yu et al., 2024）→ iREPA（指出空间结构比全局语义更重要，本文的 LDS 指标与机理分析直接沿用）→ 本文（自 REPA + 头部复用为引导）。
- **扩散基础**：[DiT](07-dit.md) 的 backbone 与 in-context 条件；[Flow Matching](08-flow-matching.md) / [Rectified Flow](09-rectified-flow.md) 的训练目标；[EDM](05-edm.md) 的 x-prediction 视角（本文的 x-prediction 论证与 EDM 的 preconditioning 是同一件事的两种说法）。
- **效率叙事**：[10 Consistency Models](10-consistency-models.md) 与各类蒸馏把成本放在「少步采样」，本文把成本放在「少 epoch 训练」——EPFID@k 是后者的度量，两者不冲突但也不可互换。
- **病理侧**：[SuperDiff](../pathology/78-histo-diffusion.md) 与 [BigCell](../pathology/64-bigcell.md) 都在用「预训练编码器 + 扩散/生成」的组合；RAEv2 的 $K$ 旋钮与「重建 vs 生成」权衡，直接对应病理生成任务里「保纹理还是保语义」的老问题。

## 7. 局限与可检验问题

**作者承认的（附录 E）**：
- 层聚合只试了「加法」与「随机投影」两种最朴素的方式，没有学聚合权重；
- 编码器选择仍是在离散集合上做实证搜索（27 个），没有端到端优化表示本身。

**我的看法（作者没写的）**：
1. **「免费引导」的账要算清**。省掉的是第二个模型和额外前向；多出来的是 `base_final_layer` 的参数与一路训练损失。对 839M 的模型这可以忽略，但把它叫「free」略过头——更准确是「one-pass self-guidance」。
2. **CFG 的对比不公平**。Table 1/16 没有报 CFG 的 scale 与区间，也没有扫。RAE 潜空间方差大、语义强，CFG 的外推容易过饱和（RAE 原文也报告过 RAE 与 CFG 不兼容），但本文没有做「调好的 CFG」这一档，因此「CFG 不行」应读作「默认 CFG 不行」。
3. **EPFID@k 与 gFID 混用会误导**。摘要里 1.06 是带引导的 gFID，EPFID@2=35 是无引导口径；读者容易把「35 epoch 就到 1.06」连起来读，实际上 35 epoch 到的是「无引导 ≤2」。
4. **$K$ 的收益有多少来自「多层」、多少来自「那个未写的全局均值项」**，论文没有拆。这是我认为最值得先复现的一点（见 §5.2 第 3 步）。
5. **重建提升依赖重训解码器**。$K$ 变了潜空间统计就变，decoder 必须重训；所谓 training-free 只对编码器成立。跨 $K$ 复用同一个 decoder 会怎样，论文没报。
6. **病理/医学场景完全没碰**。自然图像的「纹理」与病理的「细胞级结构」不是一回事，$K=7$ 的跨步选层在 24 层 DINOv3-L 上有效，不代表在病理基础模型（层数、patch 尺寸都不同）上成立。
7. **$K$ 与编码器深度强耦合，但论文把 $K$ 当独立超参讲**。$K=7$ 在 24 层上取的是跨步层，若换 12 层或 40 层的编码器，「7 层」覆盖的深度范围完全不同；Table 2 的编码器扫描用的是 $K=1$，没有回答「换编码器后最优 $K$ 还是 7 吗」。

**可检验的问题**：
- 如果把 `mean + final_mean` 拆成「纯 sum」「mean」「mean + 全局项」三档，$K=7$ 的 gFID 1.06 分别会变成多少？
- REPA 头当引导 vs 早退头当引导（代码现状），在同一 $K$、同一 $s$ 下谁更好？这直接检验 §2.3 的立论。
- 引导强度 $w$ 与区间 $[t_{\min},1]$ 的敏感性曲线在哪里？配置给的是 1.78 / 0.10，正文没报扫描。
- 在病理切片上，最优 $K$ 是否随放大倍数移动（20× 与 40× 的「纹理层」深度不同）？

## 8. 来源与版本

- arXiv 摘要：<https://arxiv.org/abs/2605.18324>（v1 2026-05-18，v2 2026-06-15）
- arXiv HTML 全文：<https://arxiv.org/html/2605.18324v2>
- NeurIPS 2026 虚拟页（Poster，2026-12-10，Paris Poster Hall #P316）：<https://neurips.cc/virtual/2026/poster/149740>；OpenReview id `nikMBZQUOk`。proceedings.neurips.cc 的 2026 卷在 2026-11-18 尚未上线（访问 404），故本页按「已录用、proceedings 未出」记录。
- 项目页：<https://raev2.github.io/>
- 代码：<https://github.com/nanovisionx/RAEv2>（main，`8a0d238`，2026-05-21；CC BY-NC 4.0）
- 权重：<https://huggingface.co/nyu-visionx/RAEv2-models>；数据：<https://huggingface.co/datasets/nanovisionx/RAEv2-data>
- 前作：RAE（<https://arxiv.org/abs/2510.11690>，本知识库 [16](16-rae.md)）；REPA-E（本知识库 [15](15-repa-e.md)）
