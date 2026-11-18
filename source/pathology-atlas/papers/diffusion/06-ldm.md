# 06｜LDM：把扩散模型搬进自编码器的潜空间，并说清「压缩」与「生成」是两次独立训练

**论文**：High-Resolution Image Synthesis with Latent Diffusion Models
**作者**：Robin Rombach\*、Andreas Blattmann\*、Dominik Lorenz、Patrick Esser、Björn Ommer（LMU Munich & IWR Heidelberg；Runway ML）；\* 共同一作
**会刊**：CVPR 2022（arXiv:2112.10752v2，2022-04-13）
**定位**：显式分离「感知压缩」与「生成学习」两个阶段；用 cross-attention 把文本、语义图、边框等通用条件接进 UNet
**精读状态**：已核对 arXiv v2 全文（正文第 3–5 节、表 1–3、表 8、表 18、图 1–3、附录 G）与官方仓库 `CompVis/latent-diffusion`（commit `a506df5`，2022-07-27）的 `README.md`、`configs/latent-diffusion/cin256-v2.yaml`、`scripts/`
**实验声明**：本篇笔记没有训练、微调或采样任何模型，也没有复现表中任何 FID/PSNR；所有数字来自论文表格与仓库 README，代码结论来自阅读源码。

## 原文摘要

> By decomposing the image formation process into a sequential application of denoising autoencoders, diffusion models (DMs) achieve state-of-the-art synthesis results on image data and beyond. Additionally, their formulation allows for a guiding mechanism to control the image generation process without retraining. However, since these models typically operate directly in pixel space, optimization of powerful DMs often consumes hundreds of GPU days and inference is expensive due to sequential evaluations. To enable DM training on limited computational resources while retaining their quality and flexibility, we apply them in the latent space of powerful pretrained autoencoders. In contrast to previous work, training diffusion models on such a representation allows for the first time to reach a near-optimal point between complexity reduction and detail preservation, greatly boosting visual fidelity. By introducing cross-attention layers into the model architecture, we turn diffusion models into powerful and flexible generators for general conditioning inputs such as text or bounding boxes and high-resolution synthesis becomes possible in a convolutional manner. Our latent diffusion models (LDMs) achieve new state-of-the-art scores for image inpainting and class-conditional image synthesis and highly competitive performance on various tasks, including text-to-image synthesis, unconditional image generation and super-resolution, while significantly reducing computational requirements compared to pixel-based DMs.

*来源：arXiv:2112.10752v2 第 1 页摘要（CVPR 2022 相机版）。逐字复制，仅去掉 PDF 换行与断词连字符；未改写、未压缩。*

## 中文摘要

> 通过把图像形成过程分解为去噪自编码器的顺序应用，扩散模型（DMs）在图像数据及其他领域取得了当前最优的合成结果。此外，它们的表述允许一种引导机制，无需重新训练即可控制图像生成过程。然而，由于这类模型通常直接工作在像素空间，强大 DM 的优化往往要消耗数百个 GPU 日，而推理因需要顺序评估而代价高昂。为了在有限计算资源下训练 DM 同时保留其质量与灵活性，我们把它们应用于强大的预训练自编码器的潜空间。与先前工作不同，在这样的表示上训练扩散模型，首次能够在「复杂度降低」与「细节保留」之间达到接近最优的平衡点，从而大幅提升视觉保真度。通过把 cross-attention 层引入模型架构，我们把扩散模型变成针对文本、边框等通用条件输入的强大而灵活的生成器，并且高分辨率合成可以以卷积方式实现。我们的潜扩散模型（LDMs）在图像修复与类别条件图像合成上取得新的最优分数，并在文本到图像合成、无条件图像生成、超分辨率等多项任务上具有很强竞争力，同时相比基于像素的 DM 显著降低了计算需求。

*译文：与上方英文摘要逐句对应，未增删内容。数字、数据集名与缩写保持原样。*

## 论文框架原图

![LDM 论文图 3：潜空间扩散与 cross-attention 条件注入](/papers/diffusion/06-ldm-pipeline.png)

> **原文图注**：Figure 3. We condition LDMs either via concatenation or by a more general cross-attention mechanism. See Sec. 3.3

*图源：arXiv:2112.10752v2 第 4 页右栏 Figure 3，用 PyMuPDF 从官方 PDF 页面区域裁出（400 dpi，未重绘、未描摹）。*

*读图顺序：左侧红框是像素空间，编码器 $\mathcal{E}$ 把图像 $x$ 压成潜变量 $z$，解码器 $\mathcal{D}$ 把潜变量还原成图像。这两个模块先在第一阶段训练，进入扩散训练后固定。中间绿框是潜空间：干净的 $z$ 经前向加噪得到 $z_T$，再由去噪 U-Net $\epsilon_\theta$ 逐步生成 $\tilde z$，最后解码成 $\tilde x$。右侧灰框是条件编码器 $\tau_\theta$；在 cross-attention 分支中，U-Net 特征提供 $Q$，条件特征提供 $K,V$。图中还展示条件按任务选择拼接或交叉注意力的连接方式。底部图例分别标注去噪步骤、cross-attention、switch、U-Net 的跨层跳连与 concat。*

## 0. 三分钟摘要

LDM 先压缩图像，再在较小的潜空间里训练扩散模型。生成过程先产生潜变量，最后由解码器还原图像；文本、类别或图像条件可在生成阶段注入。

## 它到底怎么做

1. 先训练能把图像压缩再还原的自编码器。
2. 固定自编码器，在编码后的潜变量上加噪并训练去噪网络。
3. 通过交叉注意力或拼接，向网络提供任务所需的条件。
4. 从潜变量噪声开始反向采样，最后用解码器得到图像。

### 实验先看什么

- 分清自编码器重建质量与扩散生成质量，两者对应不同阶段。
- 核对压缩倍率、潜变量通道、引导设置和检查点，不把后来的 Stable Diffusion 权重当作论文原始模型。

## 1. 问题与核心判断

**问题**：高分辨率条件图像合成。输入是条件 $y$（文本提示、语义分割图、边框、低分辨率图），输出是一张 $256^2$ 到 $1024^2$ 的图；训练数据是「图像 + 条件」对。

**瓶颈在哪**：扩散模型本身已经能生成高质量图像，但它逐像素地做序列评估。论文的判断是：DM 的损失重加权本来就能让模型忽略感知上无关的细节（这是 DDPM 那套 reweighted bound 的性质），**但梯度和网络骨干仍然要在全部像素上跑**，于是优化与推理的计算量并没有随之下降。换句话说，模型已经"不在乎"高频细节，算力却还在为高频细节付费。

**做法**：把这个浪费点显式切掉。先训练一个自编码器 $(\mathcal{E},\mathcal{D})$，把图像压到一个感知等价但维度低得多的空间 $z=\mathcal{E}(x)$；再在这个空间里训练扩散模型。压缩比用下采样因子 $f=H/h$ 描述，论文扫了 $f\in\{1,2,4,8,16,32\}$，其中 $f=1$ 就是像素空间 DM。为了不让潜空间方差失控，用两种正则之一：KL-reg（对标准正态加小权重 KL）或 VQ-reg（解码器里放一个向量量化层）。

**第二个贡献**：把 UNet 中间层换成 cross-attention，用域特定编码器 $\tau_\theta$ 把任意模态的条件投影成 $K,V$。这让同一套架构同时服务文本、语义图、边框、超分与修复。

**结果**：ImageNet 256 类别条件 FID 3.60（LDM-4-G，cfg 1.5，250 步 DDIM，400M 参数），对应 ADM-G 的 4.59（608M 参数）；训练成本 271 V100-days、A100 上 0.4 样本/秒（表 18）。

## 2. 术语（白话）

- **第一阶段 / 第二阶段**：第一阶段是自编码器 $(\mathcal{E},\mathcal{D})$ 的**重建**训练，目标是让 $\mathcal{D}(\mathcal{E}(x))\approx x$；第二阶段才是扩散模型的**生成**训练，目标是学会潜变量的分布。两次训练分开、检查点分开、下载也分开。混说这两件事是读这篇最常见的错误。
- **$f$（下采样因子）**：$f=4$ 表示 $256\times256$ 的图变成 $64\times64$ 的潜变量。$f$ 越大压缩越狠、扩散越省算力，但重建越差。
- **$c$（潜变量通道数）**：与 $f$ 独立。$f=4$ 的 VQ 模型是 3 通道，$f=8$ 的 VQ 模型是 4 通道。后面 DiT 用的 4 通道 $f=8$ 潜空间就出自这一族。
- **R-FID / PSNR（重建指标）**：衡量 $\mathcal{D}(\mathcal{E}(x))$ 与 $x$ 的差距，与生成质量无关。表 8 全是重建指标。
- **KL-reg / VQ-reg**：两种防止潜空间方差爆炸的正则。KL 版把潜变量拉向标准正态（像 VAE），VQ 版用码本量化。论文发现 VQ 正则的 LDM 有时生成质量更好，尽管它的重建指标略差于 KL 版。
- **$\tau_\theta$（条件编码器）**：把条件 $y$ 投影成 $\tau_\theta(y)\in\mathbb{R}^{M\times d_\tau}$ 的序列。文本用（非掩码）Transformer，类别标签用可学习的 embedding 表。
- **卷积式采样（convolutional sampling）**：UNet 全卷积，所以在 $256^2$ 上训练的模型可以在更大分辨率上滑动生成，无需重训。这是"高分辨率"那半句标题的机制来源。

## 3. 核心方法与数据流

### 3.1 第一阶段：感知压缩

给定 $x\in\mathbb{R}^{H\times W\times3}$，编码器得 $z=\mathcal{E}(x)\in\mathbb{R}^{h\times w\times c}$，解码器重建 $\tilde x=\mathcal{D}(z)=\mathcal{D}(\mathcal{E}(x))$，其中 $f=H/h=W/w$。自编码器用感知损失加基于图块的对抗目标训练（附录 G 给出完整目标，式 25）：

$$
\mathcal{L}_{\text{Autoencoder}}=\min_{\mathcal{E},\mathcal{D}}\max_{\psi}\Big[\mathcal{L}_{\text{rec}}\big(x,\mathcal{D}(\mathcal{E}(x))\big)-\mathcal{L}_{\text{adv}}\big(\mathcal{D}(\mathcal{E}(x))\big)+\log D_\psi(x)+\mathcal{L}_{\text{reg}}(x;\mathcal{E},\mathcal{D})\Big].
$$

只用 $L_2$/$L_1$ 会糊，所以必须配对抗项把重建约束在图像流形上。正则强度很小：KL 项权重约 $10^{-6}$，或把码本维度 $\lvert Z\rvert$ 取大。这一点很关键——**正则很轻**，所以重建保真度高，与「把图像压成 1D 离散码再自回归」的路线（VQGAN、DALL-E）不同。

### 3.2 第二阶段：在潜空间做扩散

像素空间的扩散目标是（式 1）：

$$
\mathcal{L}_{DM}=\mathbb{E}_{x,\epsilon\sim\mathcal{N}(0,1),t}\Big[\big\lVert\epsilon-\epsilon_\theta(x_t,t)\big\rVert_2^2\Big].
$$

把 $x$ 换成 $z=\mathcal{E}(x)$ 就得到潜空间目标（式 2）：

$$
\mathcal{L}_{LDM}=\mathbb{E}_{\mathcal{E}(x),\,\epsilon\sim\mathcal{N}(0,1),\,t}\Big[\big\lVert\epsilon-\epsilon_\theta(z_t,t)\big\rVert_2^2\Big].
$$

因为前向过程固定，训练时 $z_t$ 可以由 $\mathcal{E}$ 一次算出，不必逐步加噪；采样时从 $p(z)$ 采样后过一次 $\mathcal{D}$ 就回到像素空间。骨干是时间条件 UNet，损失仍是 $\epsilon$ 回归——**注意这一步没有改扩散的数学**，改的只是变量所在的坐标系。

### 3.3 条件注入：cross-attention

条件扩散原则上就是学 $p(z\mid y)$，用 $\epsilon_\theta(z_t,t,y)$ 实现。论文的做法是给 UNet 加 cross-attention 层，先由域特定编码器把 $y$ 投影成序列 $\tau_\theta(y)$，再映射到 UNet 的中间层：

$$
\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt d}\right)V,\quad
Q=W_Q^{(i)}\phi_i(z_t),\ K=W_K^{(i)}\tau_\theta(y),\ V=W_V^{(i)}\tau_\theta(y),
$$

其中 $\phi_i(z_t)\in\mathbb{R}^{N\times d_\epsilon^i}$ 是 UNet 第 $i$ 层的展平中间表示。训练目标变为（式 3）：

$$
\mathcal{L}_{LDM}=\mathbb{E}_{\mathcal{E}(x),\,y,\,\epsilon,\,t}\Big[\big\lVert\epsilon-\epsilon_\theta\big(z_t,t,\tau_\theta(y)\big)\big\rVert_2^2\Big],
$$

$\tau_\theta$ 与 $\epsilon_\theta$ 联合优化。另一条更简单的路径是**拼接**：把条件（例如下采样的语义图）与 $z$ 在通道维拼起来，用于语义合成、超分、修复这类空间对齐的条件。图 3 底部图例把两条路径都画了。

### 3.4 数据流（编号）

1. 训练第一阶段：用重建 + 感知 + 对抗目标训练 $(\mathcal{E},\mathcal{D})$，得到固定不变的编码器。
2. 冻结 $\mathcal{E}$，把训练集每张图编码成 $z$（KL 版还要按首批统计量做分量标准化）。
3. 训练第二阶段：采样 $t$、噪声 $\epsilon$，构造 $z_t$，用式 2 或式 3 训练 $\epsilon_\theta$。
4. 采样：$z_T\sim\mathcal{N}(0,I)$，用 DDIM/PLMS 迭代到 $z_0$。
5. 解码：$\hat x=\mathcal{D}(z_0)$，一次前向，不再迭代。

第 2 步的标准化容易被忽略：附录 G 说明 KL 版要估计分量方差 $\hat\sigma^2$ 并把 $z$ 除以 $\hat\sigma$，使重标定后的潜变量有单位标准差；VQ 版则在量化层之前取 $z$，把量化操作吸收进解码器当作 $\mathcal{D}$ 的第一层。这两条处理不同，复现时混用会得到明显不同的结果。

## 4. 实验与证据

**表 8（自编码器 zoo，第 21 页）**。全部在 OpenImages 上训练、在 ImageNet-Val 上评估，指标是重建质量：

| $f$ | 正则 | 通道 $c$ | R-FID ↓ | PSNR ↑ |
|---:|---|---:|---:|---:|
| 4 | VQ（$\lvert Z\rvert$=8192） | 3 | **0.58** | **27.43** |
| 8 | VQ（$\lvert Z\rvert$=16384） | 4 | 1.14 | 23.07 |
| 16 | VQ（$\lvert Z\rvert$=16384） | 8 | 5.15 | 20.83 |
| 32 | VQ | 16 | 31.83 | 17.45 |
| 4 | KL | 3 | 0.27 | 27.53 |
| 8 | KL | 4 | 0.90 | 24.19 |
| 16 | KL | 16 | 0.87 | 24.08 |
| 32 | KL | 64 | 2.04 | 22.27 |

对照外部方法：VQGAN $f=16$ 是 R-FID 4.98 / PSNR 19.9；DALL-E $f=8$ 是 32.01 / 22.8（图 1 标注）。这张表支撑论文的核心主张——**不需要像前人那样激进压缩**，$f=4$ 就能把 R-FID 压到 0.58，而 $f=16$ 已经掉到 5.15。

**表 3（ImageNet 256 类别条件，第 7 页）**：

| 方法 | FID ↓ | IS ↑ | 参数量 | 采样设置 |
|---|---:|---:|---:|---|
| ADM | 10.94 | 100.98 | 554M | 250 DDIM 步 |
| ADM-G | 4.59 | 186.7 | 608M | 250 DDIM 步 |
| LDM-4 | 10.56 | 103.49 | 400M | 250 DDIM 步 |
| LDM-4-G | **3.60** | 247.67 | 400M | 250 步，cfg $s=1.5$ |

**表 1（无条件，第 6 页）**：CelebA-HQ LDM-4（500 步）FID 5.11；FFHQ LDM-4（200 步）4.98；LSUN-Churches LDM-8\*（200 步）4.02；LSUN-Bedrooms LDM-4（200 步）2.95。\* 表示该模型在 KL 正则潜空间中训练。

**表 2（MS-COCO 256 文本条件，第 6 页）**：LDM-KL-8 为 23.31（1.45B，250 DDIM 步）；加 cfg $s=1.5$ 后 12.63。同表 GLIDE 12.24（6B，277 步，cfg 3）、Make-A-Scene 11.84（4B）。论文的表述是"参数量显著更少的情况下与最新方法相当"，不是全面领先。

**表 18（算力，第 28 页）**：LDM-4-G 训练 271 V100-days，A100 上吞吐 0.4 样本/秒，400M 参数，FID 3.60；LDM-4 同为 271 V100-days、0.7 样本/秒、FID 10.56。作者把 A100 日按 ×2.2 折算成 V100 日。

**必须一起引用的协议差异**：
- 表 3 的 3.60 是 **LDM-4**（$f=4$，400M，250 步 DDIM）**加 classifier-free guidance，$s=1.5$**；不加引导是 10.56。引用 3.60 时必须带上 cfg。
- 表 2 的 12.63 是 **LDM-KL-8**（$f=8$，1.45B）加 cfg $s=1.5$；23.31 是同模型不加引导。这与表 3 的 LDM-4 不是同一个模型。
- 表 1 的四个数据集用的 $f$ 与正则都不同（LDM-4 / LDM-8\*），不是同一个检查点。
- FID 的采样步数在各表不同（200 / 250 / 400 / 500 步 DDIM），跨表比较要连步数一起写。

**版本身份：仓库发布的检查点 ≠ 论文表里的最佳模型**。仓库 README 的 Model Zoo 里，ImageNet 类别条件只提供一个 `LDM-VQ-8`（200 DDIM 步，$\eta=1$），标注 FID 7.77（带引导，`classifier_scale` 10）/ 15.82（不带引导）。这与论文表 3 的 LDM-4-G 3.60（cfg 1.5）**不是同一个模型，也不是同一个引导设置**。想复现 3.60 需要按 `configs/latent-diffusion/cin256-v2.yaml` 自己训练，仓库没有直接给这个检查点。同理，CelebA-HQ 在论文表 1 里标 500 步，仓库卡片标 200 DDIM 步（$\eta=0$）——数字都是 5.11，但采样步数的记录不一致，引用时以论文为准并注明仓库卡片写法不同。

**"LDM" 不等于 "Stable Diffusion"**。Stable Diffusion 是同一技术路线的后续产品：$f=8$、4 通道 KL 潜空间、独立训练的文本编码器（SD 1.x 用 CLIP ViT-L/14，SD 2.x 换 OpenCLIP），并且有自己的权重与许可。本篇论文的文本条件模型是 LAION 上训练的 LDM-8（KL），1.45B 参数。把论文的 23.31/12.63 当成"Stable Diffusion 的成绩"是错的；反过来把 SD 的权重当成"论文检查点"也是错的。（SD 各版本的具体文本编码器属于论文之外的背景，不在本篇的证据范围内；本篇能核实的只有"LDM-8（KL）、1.45B、LAION"这三项。）

## 5. 复现入口与首个验证

**官方仓库**：`https://github.com/CompVis/latent-diffusion`（commit `a506df5`，2022-07-27）。实际读到的文件与结论：

- `configs/latent-diffusion/cin256-v2.yaml` 是 ImageNet 256 类别条件模型（对应表 3 的 LDM-4）的完整配置：`target: ldm.models.diffusion.ddpm.LatentDiffusion`，`image_size: 64`、`channels: 3`（即 $f=4$ 的 $64\times64\times3$ 潜空间），`conditioning_key: crossattn`，`cond_stage_trainable: true`，`use_ema: False`，`timesteps: 1000`，`linear_start: 0.0015`、`linear_end: 0.0195`。
- 同文件的 `first_stage_config` 是 `VQModelInterface`，`embed_dim: 3`、`n_embed: 8192`、`ddconfig.ch_mult: [1,2,4]`（三个分辨率层级、两次 $2\times$ 下采样，所以 $f=4$）、`resolution: 256`、`attn_resolutions: []`。这与表 8 的「$f=4$，VQ（$\lvert Z\rvert$=8192，$d$=3）」一行逐项对上。
- `cond_stage_config` 是 `ClassEmbedder`，`n_classes: 1001`、`embed_dim: 512`——注意是 1001 而不是 1000，多出来的是 classifier-free guidance 用的空类。
- `scripts/download_first_stages.sh` 与 `scripts/download_models.sh` 分别下载第一阶段与第二阶段权重，落到 `models/first_stage_models/<spec>` 与 `models/ldm/<spec>`。**两个脚本对应两次独立训练**，这是"压缩与生成分离"在工程上的直接体现。
- `scripts/sample_diffusion.py` 的接口是 `-r <ckpt> -l <logdir> -n <#samples> --batch_size <b> -c <#ddim steps> -e <#eta>`。`get_parser()` 里的默认值是 `n_samples=50000`、`eta=1.0`、`custom_steps=50`、`batch_size=10`——**默认 50 步，与论文表里的 200–500 步不同**，复现必须显式传 `-c`；`-e 0` 才是确定性 DDIM，默认的 `eta=1.0` 是随机采样。

**数据与权重**：权重托管在 `ommer-lab.com` 与 `heibox.uni-heidelberg.de`，README 给的是直链，没有校验和。数据侧：CelebA-HQ/FFHQ 按 taming-transformers 的流程准备；LSUN 用作者提供的划分文件（`https://ommer-lab.com/files/lsun.zip`）；ImageNet 首次运行会自动经 Academic Torrents 下载，也可以手动放到 `~/.cache/autoencoders/data/ILSVRC2012_{split}/data/`。

**依赖与算力**：`environment.yaml` + conda 环境名 `ldm`。论文的 ImageNet 模型在单张 A100 上训练（表 18 折算 271 V100-days）；第 4.1 节的压缩率对比实验明确"固定单张 A100、相同步数、相同参数量"。

**首个机制验证（不需要训练，约 15 分钟）**：验证"第一阶段与第二阶段是两个独立环节"，以及"潜空间尺度会影响生成"。

1. 只做第一阶段：下载 `vq-f4`（`https://ommer-lab.com/files/latent-diffusion/vq-f4.zip`），先对一张图运行 `x → z → x̃`，检查重建形状与可视化。若要复核表 8 的 PSNR 27.43，应按论文的 ImageNet 验证集协议统计平均值；它不是任意单张图都应达到的阈值。**这一步不涉及扩散**。
2. 检查 $z$ 的形状与通道数：$256\times256$ 输入应得 $64\times64\times3$。若得到 $32\times32\times4$，说明误用了 $f=8$ 的 `kl-f8` 模型——这是最常见的模型串用。
3. 只做第二阶段的一个前向：加载 `cin256-v2` 配置与对应 LDM 检查点，喂入随机 $z_t$、$t=500$、类别标签，确认输出形状与 $z$ 相同（$\epsilon$ 回归），并确认 `cond_stage` 在 `torch.no_grad()` 下只做一次 embedding。
4. 交叉验证尺度依赖：把同一张图的 $z$ 乘 $2$ 再解码，重建应明显变差。这检验的是附录 D.1 的说法——潜空间的 SNR（由尺度决定）显著影响结果，卷积式采样到更高分辨率时尤其如此。

如果第 1 步的 PSNR 差很多，先查是否在 ImageNet-Val 上评估（表 8 的协议）而不是在自己挑的图上；重建指标对评估集敏感。

## 6. 前后关联

- **直接前作**：[DDPM](02-ddpm.md) 提供式 1 的 $\epsilon$ 回归目标，[DDIM](03-ddim.md) 提供表 1/3 里的 200–500 步快速采样器。LDM 没有改这两者的数学，只改了变量所在的坐标系。
- **设计空间重排**：[EDM](05-edm.md) 把 schedule、预条件、采样器拆开做消融；LDM 的 UNet 与损失仍是 DDPM/ADM 那一套，没有采用 EDM 的预条件。把 EDM 的采样器接到 LDM 权重上属于"换采样器不换权重"的实验。
- **直接后继**：[DiT](07-dit.md) 保留 LDM 的两阶段结构与同一个 $f=8$、4 通道潜空间，只把 UNet 骨干换成 Transformer。DiT 表 5 的 decoder 消融用的就是 LDM 的原始解码器与两个 SD 微调解码器，因此两篇的潜空间是同一个。
- **回到像素的对照**：[JiT](01-jit.md) 不做 tokenizer、直接在像素上跑大图块 Transformer。与 LDM/DiT 的差别不是"哪个更好"，而是"要不要先压缩"这个设计选择。
- **条件机制的延续**：[Flow Matching](08-flow-matching.md) 与 [Rectified Flow](09-rectified-flow.md) 讨论的是把扩散的随机路径换成确定性路径，条件注入方式（cross-attention）基本沿用本篇。

## 7. 局限与可检验问题

**论文自己承认的局限**（第 5 节 "Limitations & Societal Impact"）：
- 采样仍是顺序的，比 GAN 慢；虽然比像素 DM 快，但没有改变"逐次评估"这一根本。
- 两阶段带来一个额外的不确定性：重建上限决定生成上限。$f$ 太大时细节永久丢失，$f$ 太小时算力省不下来。
- 条件生成的可控性依赖条件编码器的质量；论文没有给出对条件编码器鲁棒性的系统评估。
- 训练数据（LAION 等）带来的偏见与滥用风险，论文只做了定性讨论。

**这份笔记额外指出的一点**：表 8 里 $f=4$ KL 的 R-FID（0.27）优于 $f=4$ VQ（0.58），但正文说 VQ 正则的 LDM 有时生成质量更好。这说明**重建指标不能预测生成质量**，选第一阶段模型时不能只看 R-FID。引用表 8 时不要把它当成"生成质量排名"。

**两个小问题（均为未验证设想，不是论文结论）**：

1. **$f$ 与潜空间通道数能否解耦扫描？** 论文把 $(f,c)$ 绑在一起（$f=4\to c=3$、$f=8\to c=4$、$f=16\to c=8$），所以无法判断性能变化来自空间分辨率还是通道容量。可检验做法：固定 $f=8$，训练 $c\in\{4,8,16\}$ 三个自编码器（重建指标对齐到同一 R-FID 附近），再用同一套扩散配置训练，比较 FID。这需要重训，成本远高于上面的验证。
2. **卷积式采样到 $2\times$ 分辨率时，潜空间的尺度归一化是不是必需的？** 附录 D.1 说重标定（除以分量标准差）显著影响结果，但没有给消融数字。可检验做法：固定同一个 LDM 检查点，分别在"原始 $z$"与"按首批统计量重标定的 $z$"上做 $512^2$ 卷积式采样，比较 FID 与视觉伪影；若差异主要出现在边界处，说明问题来自 UNet 的位置编码而非潜变量尺度。

## 来源与版本

- 论文：[arXiv:2112.10752v2](https://arxiv.org/abs/2112.10752v2)（2022-04-13；PDF 页眉为 CVPR 2022）。本页核对的是这一版的第 3–5 节、表 1–3、表 8、表 18、图 1–3，以及附录 D.1（潜空间尺度）、G（自编码器目标与潜空间处理）。
- 官方代码：[CompVis/latent-diffusion](https://github.com/CompVis/latent-diffusion)，commit `a506df5756472e2ebaf9078affdde2c4f1502cd4`（2022-07-27）。读过的文件：`README.md`、`configs/latent-diffusion/cin256-v2.yaml`、`scripts/download_first_stages.sh`、`scripts/download_models.sh`、`scripts/sample_diffusion.py` 的接口说明。
- 图：`/papers/diffusion/06-ldm-pipeline.png`，从上述 v2 PDF 第 4 页 Figure 3 区域渲染裁出（PyMuPDF 1.28.2，400 dpi），未重绘。
- 未做的事：没有下载任何检查点（第一阶段或第二阶段），没有运行采样或训练，没有复现任何 FID/PSNR，也没有验证 Stable Diffusion 与本篇模型的血缘关系之外的任何权重对应。
