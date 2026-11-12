# 07｜DiT：把 UNet 换成 Transformer，并用 Gflops 而不是参数量衡量扩展性

**论文**：Scalable Diffusion Models with Transformers
**作者**：William Peebles（UC Berkeley；本工作于 Meta AI, FAIR 实习期间完成）、Saining Xie（New York University）
**会刊**：ICCV 2023（arXiv:2212.09748v2，2023-03-02）
**定位**：保留 LDM 的两阶段潜空间管线，只替换骨干网络；用前向 Gflops 作为复杂度轴，给出 Transformer 类的缩放律
**精读状态**：已核对 arXiv v2 全文（正文第 3–5 节、表 1–3、表 5–6、图 3–9）与官方仓库 `facebookresearch/DiT`（commit `ed81ce2`，2023-06-02）的 `README.md`、`models.py`、`sample.py`、`train.py`、`download.py`
**实验声明**：本篇笔记没有训练、微调或采样任何模型，也没有复现表中任何 FID；所有数字来自论文表格，代码结论来自阅读源码。

## 原文摘要

> We explore a new class of diffusion models based on the transformer architecture. We train latent diffusion models of images, replacing the commonly-used U-Net backbone with a transformer that operates on latent patches. We analyze the scalability of our Diffusion Transformers (DiTs) through the lens of forward pass complexity as measured by Gflops. We find that DiTs with higher Gflops—through increased transformer depth/width or increased number of input tokens—consistently have lower FID. In addition to possessing good scalability properties, our largest DiT-XL/2 models outperform all prior diffusion models on the class-conditional ImageNet 512×512 and 256×256 benchmarks, achieving a state-of-the-art FID of 2.27 on the latter.

*来源：arXiv:2212.09748v2 第 1 页摘要（ICCV 2023 相机版）。逐字复制，仅去掉 PDF 换行与断词连字符；未改写、未压缩。*

## 中文摘要

> 我们探索一类基于 Transformer 架构的新型扩散模型。我们训练图像的潜扩散模型，把常用的 U-Net 骨干替换为在潜变量图块上运作的 Transformer。我们以 Gflops 衡量的前向计算复杂度为视角，分析我们的扩散 Transformer（DiTs）的可扩展性。我们发现，Gflops 更高的 DiT——无论是通过增加 Transformer 的深度/宽度，还是增加输入 token 的数量——一致地具有更低的 FID。除了具备良好的可扩展性之外，我们最大的 DiT-XL/2 模型在类别条件的 ImageNet 512×512 与 256×256 基准上超过了所有先前的扩散模型，在后者上取得 2.27 的当前最优 FID。

*译文：与上方英文摘要逐句对应，未增删内容。数字、数据集名与缩写保持原样。*

## 论文框架原图

![DiT 论文图 3：潜扩散 Transformer 架构与三种条件块](/papers/diffusion/07-dit-pipeline.png)

> **原文图注**：Figure 3. The Diffusion Transformer (DiT) architecture. Left: We train conditional latent DiT models. The input latent is decomposed into patches and processed by several DiT blocks. Right: Details of our DiT blocks. We experiment with variants of standard transformer blocks that incorporate conditioning via adaptive layer norm, cross-attention and extra input tokens. Adaptive layer norm works best.

*图源：arXiv:2212.09748v2 第 3 页 Figure 3，用 PyMuPDF 从官方 PDF 页面区域裁出（300 dpi，未重绘、未描摹）。*

*读图顺序：最左是主链路——输入是 $32\times32\times4$ 的**带噪潜变量**（不是图像），经 Patchify 变成 token 序列，过 $N$ 个 DiT Block，最后 Linear and Reshape 输出两块 $32\times32\times4$：噪声预测 $\epsilon$ 与协方差 $\Sigma$。注意下方并行的 Embed 分支：时间步 $t$ 与类别标签 $y$ 各自 embedding 后**相加**成一个条件向量 $c$，它不进入 token 序列，而是通过 adaLN 调制每一层。中间大框是 adaLN-Zero 块的细节：$\gamma,\beta$ 与门控 $\alpha$ 都由 $c$ 回归得到，$\alpha$ 在残差相加前乘上去。右边两个灰框是被淘汰的两种条件方式——cross-attention（多一个注意力层，Gflops 最高）与 in-context（把 $c$ 当额外 token 拼进序列）。*

## 0. 三分钟摘要

DiT 保留潜空间扩散，把去噪网络从 U-Net 换成 Transformer。它把带噪潜变量切成图块，用时间和类别条件调制网络，再研究模型规模与图块数量怎样影响生成质量。

## 它到底怎么做

1. 用预训练自编码器得到图像潜变量，并在潜空间中加噪。
2. 把带噪潜变量切成图块 token，同时编码时间步与类别条件。
3. 通过条件调制的 Transformer 预测噪声及反向方差相关参数。
4. 反向采样得到潜变量，再由解码器输出图像。

### 实验先看什么

- 图块大小按潜变量计量，不能直接与 JiT 的像素图块大小比较。
- 核对引导通道、引导尺度和解码器；单个配置的引导消融不能分离跨模型的骨干贡献。

## 1. 问题与核心判断

**问题**：类别条件 ImageNet 生成。输入是类别标签 $y$ 与纯高斯噪声，输出是 $256^2$ 或 $512^2$ 的图像；训练数据是 ImageNet。

**瓶颈不是效果，是"骨干网络的选择没有被检验"**。论文开头的观察很具体：Transformer 已经吞掉了 NLP、视觉识别等领域，但图像级生成模型里，自回归模型用 Transformer，扩散模型却一律用卷积 UNet——UNet 成了"事实上的唯一选择"。于是有两个问题没有答案：(1) UNet 的归纳偏置到底贡献了多少？(2) 如果换成 Transformer，这个模型类能不能像 ViT 那样随算力平滑变好？

**做法**：尽量少改。保留 LDM 的两阶段结构——先用现成的卷积 VAE 把图像压成潜变量 $z$（$256^2$ 图像得 $32\times32\times4$），冻结编码器，只把扩散骨干换成 ViT 式的 Transformer。作者称这是"混合式"管线：卷积 VAE + Transformer DDPM。然后在三个维度上扫：图块大小 $p\in\{2,4,8\}$、块设计（in-context / cross-attention / adaLN / adaLN-Zero）、模型规模（S/B/L/XL），共 12 个模型。

**核心论点**：**参数量是坏指标，Gflops 才是**。理由很直接：参数量不反映图像分辨率，而分辨率显著影响性能。保持模型规模不变、只把 $p$ 从 8 减到 2，参数量几乎不变（甚至略降），但 token 数变成 16 倍、Gflops 随之上升，FID 明显变好。所以"更多前向计算"才是这个模型类变强的关键，而不是"更多参数"。

**结果**：DiT-XL/2（118.6 Gflops）在 ImageNet 256 上 cfg=1.5 时 FID 2.27，把 LDM-4-G 的 3.60 压下去；512 上 3.04。

## 2. 术语（白话）

- **潜变量 / latent**：这里指 $32\times32\times4$ 的张量，来自一个 $f=8$ 的卷积 VAE（与 LDM 同一族）。$256/8=32$，4 是通道数。**DiT 不在像素上工作**。
- **patchify**：把 $I\times I\times C$ 的潜变量切成 $p\times p$ 的块，每块线性投影成一个 $d$ 维 token，得到长度 $T=(I/p)^2$ 的序列。$p$ 减半，$T$ 变 4 倍，Gflops 至少变 4 倍。
- **adaLN（adaptive layer norm）**：不用可学习的 $\gamma,\beta$，而是从条件向量 $c$（$t$ 与 $y$ 的 embedding 之和）回归出 $\gamma,\beta$。它是三种条件方式里 Gflops 最低的，也是唯一"对所有 token 施加同一函数"的方式。
- **adaLN-Zero**：在 adaLN 基础上再回归一个维度级缩放 $\alpha$，乘在残差相加之前，并把回归 MLP 初始化为输出零向量。于是每个 DiT 块在初始化时是恒等映射。这是让深层 Transformer 训练稳定的关键初始化。
- **Gflops**：前向一次的计算量（$10^9$ 次浮点运算）。论文用它做横轴，而不是参数量。
- **cfg（classifier-free guidance）尺度 $s$**：$s=1$ 退化为普通条件采样，$s>1$ 加强条件一致性但牺牲多样性。**同一个模型在不同 $s$ 下的 FID 差别很大**，引用时必须带 $s$。
- **FID-50K**：用 50000 张生成样本算的 FID。论文所有数字都是这个协议，且用 ADM 的 TensorFlow 评估套件算，不是自己实现。

## 3. 核心方法与数据流

### 3.1 前置：扩散与引导（第 3.1 节）

前向过程是标准的高斯扩散：

$$
q(x_t\mid x_0)=\mathcal{N}\big(x_t;\ \sqrt{\bar\alpha_t}\,x_0,\ (1-\bar\alpha_t)\mathbf{I}\big),\qquad
x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\epsilon_t,\quad \epsilon_t\sim\mathcal{N}(\mathbf{0},\mathbf{I}).
$$

训练用简化损失（式在 3.1 节正文，未编号）：

$$
\mathcal{L}_{\text{simple}}(\theta)=\big\lVert \epsilon_\theta(x_t)-\epsilon_t\big\rVert_2^2 .
$$

注意这里的 $x$ 在 DiT 里实际是潜变量 $z$；论文沿用 DDPM 的记号。协方差 $\Sigma_\theta$ 用完整的变分下界单独训练，这是沿用 Nichol & Dhariwal 的做法，所以网络有两个输出头。

classifier-free guidance 的写法（3.1 节）：

$$
\hat\epsilon_\theta(x_t,c)=\epsilon_\theta(x_t,\varnothing)+s\cdot\big(\epsilon_\theta(x_t,c)-\epsilon_\theta(x_t,\varnothing)\big),
$$

训练时以一定概率把 $c$ 替换成可学习的空嵌入 $\varnothing$。代码里 `class_dropout_prob=0.1`。

### 3.2 patchify 与 token 数

输入潜变量形状 $I\times I\times C$（$256^2$ 图像 $\Rightarrow 32\times32\times4$）。patchify 后

$$
T=(I/p)^2,\qquad \text{token 维度 } d .
$$

$p=2$ 时 $T=256$，$p=8$ 时 $T=16$。位置编码用 ViT 的固定 sin-cos 版本（不是可学习参数，代码里 `requires_grad=False`）。

> **一个容易搞错的换算**：DiT 的 $p$ 是**潜变量上的**图块边长。因为 $f=8$，$p=2$ 对应原图 $16\times16$ 像素，$p=8$ 对应 $64\times64$ 像素。把它和 [JiT](01-jit.md) 的 $p=16/32$ 直接比会差 8 倍——JiT 的 $p$ 是像素单位。

### 3.3 四种条件块与 adaLN-Zero

设条件向量 $c=\text{Emb}(t)+\text{Emb}(y)$，四种设计：

1. **in-context**：把 $t$、$c$ 的 embedding 当两个额外 token 拼进序列，最后再剪掉。几乎不增加 Gflops（119.4）。
2. **cross-attention**：$c$ 作为长度 2 的独立序列，在每个自注意力后加一层 cross-attention。Gflops 最高（137.6，约 +15%）。
3. **adaLN**：用 $c$ 回归 $\gamma,\beta$ 替换 LayerNorm 的可学习参数。Gflops 最低（118.6），但只能对所有 token 施加同一变换。
4. **adaLN-Zero**：在 adaLN 基础上再回归 $\alpha$，乘在残差分支上，并把回归 MLP 零初始化。Gflops 同为 118.6。

adaLN-Zero 块的前向（对应 `models.py:118-122`）：

$$
\begin{aligned}
(\gamma_1,\beta_1,\alpha_1,\gamma_2,\beta_2,\alpha_2)&=\text{MLP}_{\text{adaLN}}(c),\\
x&\leftarrow x+\alpha_1\odot\text{Attn}\big(\text{mod}(\text{LN}(x),\gamma_1,\beta_1)\big),\\
x&\leftarrow x+\alpha_2\odot\text{MLP}\big(\text{mod}(\text{LN}(x),\gamma_2,\beta_2)\big).
\end{aligned}
$$

其中调制函数在代码里是 `modulate(x, shift, scale) = x * (1 + scale) + shift`，即 $\text{mod}(x,\gamma,\beta)=x\odot(1+\gamma)+\beta$。零初始化让 $\alpha=0$，于是每个块初始为恒等映射——这与 ResNet 的零初始化 γ、DiT 之前 UNet 的零初始化末层卷积是同一个思路。

### 3.4 解码与输出

最后一个块之后接 `FinalLayer`：先做（自适应的）LayerNorm，再线性投影到 $p\times p\times2C$，然后重排回空间布局，得到噪声预测与对角协方差。`learn_sigma=True` 时输出通道是输入的两倍（$4\to8$）。

### 3.5 数据流（编号）

1. 用现成的 $f=8$ 卷积 VAE 编码器把 ImageNet 图像压成 $32\times32\times4$ 的 $z$（编码器冻结，不参与训练）。
2. 采样 $t$、$\epsilon$，构造 $z_t=\sqrt{\bar\alpha_t}z+\sqrt{1-\bar\alpha_t}\epsilon$。
3. patchify：$z_t$ 切成 $T$ 个 token，加 sin-cos 位置编码。
4. 过 $N$ 个 adaLN-Zero 块；条件 $c=\text{Emb}(t)+\text{Emb}(y)$ 在每层调制 $\gamma,\beta,\alpha$。
5. FinalLayer 解码成 $\epsilon_\theta$ 与 $\Sigma_\theta$，用 $\mathcal{L}_{\text{simple}}$ 训练 $\epsilon_\theta$、用完整 VLB 训练 $\Sigma_\theta$。
6. 采样：从 $\mathcal{N}(0,I)$ 起，250 步 DDPM，每步用 cfg 组合有条件/无条件预测。
7. 解码：$z_0$ 过一次 VAE 解码器得到图像。**解码器权重是可换的**，见 4 节的表 5。

## 4. 实验与证据

**表 1（模型配置，第 5 页）**。Gflops 在 $I=32$、$p=4$ 下测得：

| 模型 | 层数 $N$ | 隐藏维 $d$ | 头数 | Gflops |
|---|---:|---:|---:|---:|
| DiT-S | 12 | 384 | 6 | 1.4 |
| DiT-B | 12 | 768 | 12 | 5.6 |
| DiT-L | 24 | 1024 | 16 | 19.7 |
| DiT-XL | 28 | 1152 | 16 | 29.1 |

表 1 的 29.1 是 $p=4$ 下的值；正文里 DiT-XL/2（$p=2$，token 数 4 倍）是 **118.6 Gflops**。引用 Gflops 时必须写明 $p$，否则数字对不上。

**表 2（ImageNet 256×256 类别条件，第 12 页）**：

| 模型 | FID ↓ | sFID ↓ | IS ↑ | Precision ↑ | Recall ↑ |
|---|---:|---:|---:|---:|---:|
| LDM-4-G（cfg 1.5） | 3.60 | – | 247.67 | 0.87 | 0.48 |
| DiT-XL/2 | 9.62 | 6.85 | 121.50 | 0.67 | 0.67 |
| DiT-XL/2-G（cfg 1.25） | 3.22 | 5.28 | 201.77 | 0.76 | 0.62 |
| DiT-XL/2-G（cfg 1.50） | **2.27** | 4.60 | 278.24 | 0.83 | 0.57 |

**表 3（ImageNet 512×512 类别条件，第 12 页）**：DiT-XL/2 无引导 12.03；cfg 1.25 得 4.64；cfg 1.50 得 3.04。同表 StyleGAN-XL 是 2.41，ADM-G+ADM-U 是 3.85。所以 512 上 DiT **没有**超过 StyleGAN-XL，论文的措辞是"在 256 上最低 FID"。

**表 6（U-Net 基线 Gflops，第 13 页）**：ADM 在 256 上是 1120 Gflops，ADM-U 是 742（基座 110 + 上采样 632），LDM-4 是 104，LDM-8 是 57。这张表是"潜空间为什么值得"的量化依据：DiT-XL/2 的 118.6 与 LDM-4 的 104 同量级，而 ADM 是 1120。

**表 5（解码器消融，第 13 页）**。同一个 DiT-XL/2-G（cfg 1.5）只换 VAE 解码器权重：

| 解码器 | FID ↓ | sFID ↓ | IS ↑ |
|---|---:|---:|---:|
| LDM 原始 | 2.46 | 5.18 | 271.56 |
| SD ft-MSE | 2.30 | 4.73 | 276.09 |
| SD ft-EMA | **2.27** | 4.60 | 278.24 |

这张表说明两件事：(1) 编码器相同，所以解码器可以热替换而不重训扩散模型；(2) 2.27 这个数字**依赖** ft-EMA 解码器，换回 LDM 原始解码器是 2.46。引用 2.27 时把解码器一起写出来。

**缩放律的证据**：
- 12 个模型（S/B/L/XL × $p\in\{8,4,2\}$）在 400K 步时，Gflops 与 FID-50K 呈强负相关（图 8）；不同配置只要 Gflops 接近，FID 也接近（例如 DiT-S/2 与 DiT-B/4）。
- 减小 $p$ 时参数量几乎不变而 Gflops 上升，FID 变好——这是"参数量不是关键、计算量才是"的直接证据。
- 大模型更省总计算：XL/4 在约 $10^{10}$ Gflops 之后被 XL/2 反超（图 9）。
- 训练 2.35M 步（与 ADM 相当）时 XL/2 已是 FID 2.55，仍优于所有先前扩散模型。

**协议差异必须一起引用**：
- 2.27 是 **256×256**、**仅前三个潜变量通道施加 cfg 1.5**、**250 步 DDPM**、**ft-EMA 解码器**、**FID-50K** 的结果。附录 A 另报四通道 cfg 1.375 时 FID 为 2.20；复核 2.27 时需同时对齐引导通道数与尺度。
- 512×512 的最好成绩是 3.04，不是 2.27；论文的 2.27 只针对 256。
- 表 2 里 DiT-XL/2 无引导是 9.62，施加上述引导后是 2.27；LDM-4-G 的报告值为 3.60。前两项展示同一 DiT 配置下引导的效果，跨模型的差值还混合了训练与解码器等差异，不能直接解释成“DiT 架构本身比 LDM 好 1.3 个 FID”。
- 训练规模：256 上 7M 步，512 上 3M 步，TPU v3-256 pod 上约 5.7 it/s、全局 batch 256。这是论文没有强调但复现时必须知道的成本。

## 5. 复现入口与首个验证

**官方仓库**：`https://github.com/facebookresearch/DiT`（commit `ed81ce2`，2023-06-02）。实际读到的文件与结论：

- `models.py:101-122` 的 `DiTBlock` 就是 adaLN-Zero：`adaLN_modulation = Sequential(SiLU(), Linear(hidden, 6*hidden))`，`chunk(6)` 得到 `shift_msa, scale_msa, gate_msa, shift_mlp, scale_mlp, gate_mlp`，两个残差分支各自乘门控。注意 `LayerNorm(..., elementwise_affine=False)`——$\gamma,\beta$ 完全来自条件，没有独立可学习参数。
- `models.py:125-142` 的 `FinalLayer` 用 `chunk(2)` 得到 shift/scale，再线性投影到 `patch_size**2 * out_channels`。
- `models.py:145-180` 的 `DiT.__init__` 默认值：`input_size=32, patch_size=2, in_channels=4, hidden_size=1152, depth=28, num_heads=16, num_classes=1000, learn_sigma=True`。默认值就是 DiT-XL/2 的配置，`out_channels = in_channels*2 = 8`。
- `models.py:365-370` 的 `DiT_models` 字典列出 12 个变体（S/B/L/XL × /2 /4 /8），与论文的扫描网格一致。
- `sample.py:73-81` 的参数：`--model` 默认 `DiT-XL/2`，`--image-size` 只允许 256/512，`--num-sampling-steps` 默认 250（与论文一致），**`--cfg-scale` 默认 4.0**。
- `download.py:15` 只列两个预训练权重：`DiT-XL-2-512x512.pt`、`DiT-XL-2-256x256.pt`，从 `https://dl.fbaipublicfiles.com/DiT/models/` 下载。**没有 S/B/L 的权重**，所以缩放律无法用官方权重直接复现，只能重训。
- `train.py:256-267` 的参数：`--data-path` 必填，`--epochs` 默认 1400，`--global-batch-size` 默认 256，`--vae` 可选 `ema|mse` 且注释明确写 "Choice doesn't affect training"（只影响评估时的解码器）。

> **两个默认值陷阱**：(1) `sample.py` 的 `--cfg-scale` 默认 4.0，而论文最佳 FID 用 1.5；直接跑默认值得不到 2.27，也得不到论文展示的那种样本。 (2) `--vae` 的 `ema/mse` 只决定用哪个解码器权重，不影响训练；把它当成"训练时用哪个 VAE 编码"是误读——编码器始终相同。

**数据与权重**：ImageNet 需自备并整理成 `train/`、`val/` 的类别子目录结构（`train.py --data-path`）。预训练权重自动下载，无校验和。VAE 解码器权重来自 `https://huggingface.co/stabilityai/sd-vae-ft-mse`（表 5 引用）。

**依赖与算力**：`environment.yml` + conda 环境 `DiT`；论文用 JAX 实现训练、TPU v3-256 pod，仓库给的是 PyTorch 复现版（DDP）。采样单卡即可，训练按论文规模需要 TPU pod 级资源；仓库没有给出单卡训练的等效时间。

**首个机制验证（不需要训练，约 10 分钟）**：验证 adaLN-Zero 的"初始恒等"性质，这是全篇最容易读错、也最容易在复现时改坏的细节。

1. 构造 `DiT(input_size=32, patch_size=2, in_channels=4, hidden_size=1152, depth=28, num_heads=16)`，不加载权重。
2. 取随机 `x`（$2\times4\times32\times32$）、`t`、`y`，做一次前向，记输出 `out`。
3. 检查每个块的 `adaLN_modulation[-1]` 与 `final_layer.adaLN_modulation[-1]` 的 weight/bias 是否全为零（`initialize_weights` 里 `nn.init.constant_(..., 0)`）。若为零，则 $\gamma=\beta=\alpha=0$。
4. 关键检查：$\alpha=0$ 使每个块的残差分支贡献为零，所以**整块在初始化时是恒等映射**。直接验证：取同一 `x`、`c`，比较 `model.blocks[0](x, c)` 与 `x`，应逐元素完全相等。再对 `blocks[1..27]` 逐个做同样检查，全部应相等。
5. 检查输出：因为 `final_layer.linear` 也被零初始化，`model(x, t, y)` 在初始化时应**恒为零张量**，与 `depth`、`x` 无关。这是一个很强的自检——如果输出不是零，说明初始化被覆盖（例如外部又调了一次 `apply` 做 trunc-normal）。
6. 再验证 patchify 的 token 数：`p=2` 时 `x_embedder.num_patches == 256`，`p=8` 时是 16。同时确认 `pos_embed` 的 `requires_grad` 为 `False`。

如果第 3 步发现 `adaLN_modulation[-1]` 不是零，说明用了错误的初始化，这会显著改变训练早期的行为——论文明确说零初始化是 adaLN-Zero 有效的来源。

## 6. 前后关联

- **直接前作**：[LDM](06-ldm.md) 提供两阶段管线与 $f=8$、4 通道潜空间；DiT 的表 5 直接复用了 LDM 的解码器与两个 SD 微调解码器，两篇的潜空间是同一个。DiT 没有改扩散数学，改的是骨干。
- **采样与训练目标**：[DDPM](02-ddpm.md) 的 $\epsilon$ 回归与 [DDIM](03-ddim.md) 的快速采样是 DiT 的默认配置（250 步 DDPM，不是 DDIM）。[EDM](05-edm.md) 的预条件与二阶采样器**没有**被 DiT 采用，把 EDM 采样器接到 DiT 权重上属于"换采样器不换权重"。
- **像素空间的对照**：[JiT](01-jit.md) 与 DiT 是最直接的一对。差别有三层：(1) DiT 在 4 通道潜空间、JiT 在像素；(2) DiT 的图块是潜变量单位（$p=2$ 对应 16 像素），JiT 是像素单位（$p=16/32$）；(3) DiT 预测噪声加协方差，JiT 直接预测干净数据。把这三层混在一起说"DiT 是 JiT 的前身"会丢掉 JiT 的核心论点。
- **路径改写方向**：[Flow Matching](08-flow-matching.md)、[Rectified Flow](09-rectified-flow.md)、[Consistency Models](10-consistency-models.md) 都可以套在 DiT 骨干上；DiT 提供的是骨干与缩放律，不是采样路径。

## 7. 局限与可检验问题

**论文自己承认或数据直接暴露的局限**：
- 512×512 上没有超过 StyleGAN-XL（3.04 对 2.41），论文只说 256 上是 SOTA。
- 只有类别条件，没有文本条件；条件机制只验证了类别标签这一种最简单的情形。
- 缩放律是经验观察（Gflops 与 FID 负相关），没有给出可外推的定量公式；XL/4 被 XL/2 反超说明"更多 Gflops"并非无条件更好。
- 训练成本高：256 上 7M 步、TPU v3-256 pod。仓库只放 XL 权重，S/B/L 的缩放曲线无法用官方权重复核。
- 依赖外部 VAE：生成上限受解码器限制（表 5 里同一模型在 2.27–2.46 之间浮动）。

**这份笔记额外指出的一点**：表 2 中，同一 DiT-XL/2 从无引导 FID 9.62 变为三通道 cfg 1.5 的 2.27；LDM-4 从 10.56 变为其引导配置的 3.60。这些结果说明引导设置会显著影响报告值，但没有在统一训练、解码器与引导协议下单独分离骨干的作用，不能据此给“引导贡献”和“骨干贡献”排序。

**两个小问题（均为未验证设想，不是论文结论）**：

1. **Gflops 与 FID 的关系在 $p$ 变化时是否同一条曲线？** 论文把"加深加宽"与"增加 token"都算作增加 Gflops，并说两者都改善 FID；但图 9 显示 $p$ 不同、Gflops 相同的模型性能剖面不同（XL/4 被 XL/2 反超）。可检验做法：固定 Gflops 预算（例如 30 Gflops），在 $(N,d,p)$ 三维上取若干组合，看 FID 是否只由 Gflops 决定。若不然，说明"Gflops 是唯一复杂度轴"这个说法需要加限定。
2. **adaLN-Zero 的零初始化在多大深度上仍然必要？** 论文只对比了四种块设计，没有对深度做交叉消融。可检验做法：在 DiT-B 上把 `adaLN_modulation[-1]` 的零初始化换成普通初始化，比较 100K 步内的损失曲线是否出现尖峰。若浅模型不需要而深模型需要，就能把"零初始化"的作用定位到深度而不是通用稳定性。

## 来源与版本

- 论文：[arXiv:2212.09748v2](https://arxiv.org/abs/2212.09748v2)（2023-03-02；PDF 页眉为 ICCV 2023）。本页核对的是这一版的第 3–5 节、表 1–3、表 5–6、图 3–9。
- 官方代码：[facebookresearch/DiT](https://github.com/facebookresearch/DiT)，commit `ed81ce2229091fd4ecc9a223645f95cf379d582b`（2023-06-02）。读过的文件：`README.md`、`models.py`、`sample.py`、`train.py`、`download.py`。
- 图：`/papers/diffusion/07-dit-pipeline.png`，从上述 v2 PDF 第 3 页 Figure 3 区域渲染裁出（PyMuPDF 1.28.2，300 dpi），未重绘。
- 未做的事：没有下载任何预训练权重，没有运行采样或训练，没有复现任何 FID，也没有把 TPU v3-256 的训练时间换算成其他硬件。
