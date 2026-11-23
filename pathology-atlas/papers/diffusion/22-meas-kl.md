# 22｜测量域 KL：只用被污染的测量，就能估出图像分布的 KL 漂移

**论文**：Unsupervised Detection of Distribution Shift in Inverse Problems using Diffusion Models  
**作者**：Shirin Shoushtari、Edward P. Chandler、Yuanhao Wang、M. Salman Asif、Ulugbek S. Kamilov（Washington University in St. Louis；UC Riverside）  
**发表**：arXiv:2505.11482（v1 2025-05-16，v3 2025-05-26）；OpenReview 另有一条题为 "Measuring Distribution Shifts in Inverse Problems without clean data" 的投稿记录，venue 显示 "Submitted to ICLR 2026"，**录用情况未确认**  
**定位**：逆问题的测量域分布漂移度量；用两个扩散模型分数函数之差，在 $\mathbf{V}\bar{\mathbf{y}}$ 上直接估图像域 KL，并把同一目标反用作无监督自适应损失  
**精读核验**：2026-11-22 读 arXiv HTML v3 全文（正文 §1–5、Table 1–4、附录 A–E，含 Theorem 1 与假设 1–2）；代码核对 [wustl-cig/Measurement-domain-KL-divergence](https://github.com/wustl-cig/Measurement-domain-KL-divergence) main 分支（唯一提交 2025-05-20）的文件树与 ReadME，**未下载权重、未运行**；本页数字均为论文报告值

## 原文摘要

> Diffusion models are widely used as priors in imaging inverse problems. However, their performance often degrades under distribution shifts between the training and test-time images. Existing methods for identifying and quantifying distribution shifts typically require access to clean test images, which are almost never available while solving inverse problems (at test time). We propose a fully unsupervised metric for estimating distribution shifts using only indirect (corrupted) measurements and score functions from diffusion models trained on different datasets. We theoretically show that this metric estimates the KL divergence between the training and test image distributions. Empirically, we show that our score-based metric, using only corrupted measurements, closely approximates the KL divergence computed from clean images. Motivated by this result, we show that aligning the out-of-distribution score with the in-distribution score -- using only corrupted measurements -- reduces the KL divergence and leads to improved reconstruction quality across multiple inverse problems.

*来源：arXiv:2505.11482v3 摘要，逐字保留。*

## 中文摘要

> 扩散模型被广泛用作成像逆问题的先验。但训练分布与测试图像分布之间一旦发生漂移，它们的性能往往下降。现有识别并量化分布漂移的方法通常需要干净的测试图像，而在求解逆问题时（测试阶段）几乎拿不到干净图像。我们提出一个完全无监督的度量，只用间接（被污染的）测量，以及在不同数据集上训练的两个扩散模型的分数函数，来估计分布漂移。我们从理论上证明，该度量估计的是训练图像分布与测试图像分布之间的 KL 散度。在实验中，我们展示这个基于分数的度量只用被污染的测量，就能逼近由干净图像算出的 KL 散度。基于这一结果，我们进一步展示：只用被污染的测量，把分布外分数函数对齐到分布内分数函数，会降低 KL 散度，并在多个逆问题上带来更好的重建质量。

## 1. 三分钟摘要与推荐理由

**一句话**：如果两个扩散模型各自记住了自己的数据分布，那么"它们看同一批测量时的去噪输出差多少"就是这两个分布的 KL 散度——而这个差可以只在被压缩、被掩码的测量上算，不需要干净图像。

**问题**：扩散先验的可靠性取决于训练分布。要判断"这个先验离测试数据有多远"，现有做法要么要干净测试图（逆问题里没有），要么只做 OOD 二分类检测，给不出程度。

**insight**：图像域 KL 已有分数函数差的形式（Eq. 4，Vincent 恒等式那一类）。关键观察是对测量算子做 SVD：在 $\mathbf{V}$ 张成的行空间里，投影后的测量分布与图像分布在"被观测到的方向"上共享同一个分数函数；未观测方向对 KL 的贡献由 $\mathbf{P}$ 的期望补偿，于是 KL 可以在测量域原样重写（Theorem 1）。

**它做到了什么**（论文数值）：inpainting 下（FFHQ 对 AFHQ / MetFaces / Microscopy，$p\in\{0.2,0.5,0.8\}$），测量域 KL 曲线紧跟图像域 KL 且排序正确，视觉上最接近 FFHQ 的 MetFaces 漂移最小（Fig. 1）；MRI 下（brain 对 knee / prostate，$R\in\{4,6,8\}$）同样贴合，Table 3 中 brain-vs-prostate 测量域估 2.519–2.531、图像域 2.507；自适应后重建变好：inpainting $p=0.8,\sigma_z=0.01$ 时 AFHQ 先验 25.84 dB → Adapt128 26.52 dB（FFHQ 上界 28.36），MRI $R=4$ 无噪声时 prostate 先验 24.15 → 25.17 dB（brain 上界 27.92）。

**推荐理由**：这是"漂移度量"而不是"漂移下的幻觉"。对关心扩散重建在分布漂移下编造/抹除病灶的读者，它给的是一把**在只有测量时就能上手的尺子**：不必等重建结果与 GT 对比，就能先判断先验离测试分布多远，再决定是否自适应。作者没有做病灶级幻觉分析，这个连接是 本页判断。

## 2. 问题及研究位置

- **设定**：$\mathbf{y}=\mathbf{H}\mathbf{x}+\mathbf{z}$，$\mathbf{H}\sim p(\mathbf{H})$ 逐样本随机抽取（inpainting 随机掩码、MRI 随机欠采样），$\mathbf{x}$、$\mathbf{z}$、$\mathbf{H}$ 相互独立；只有 $\mathbf{y}$ 与已知的 $\mathbf{H}$，没有 $\mathbf{x}$。
- **要估的量与差别**：目标是 $D_{\mathrm{KL}}\big(p(\mathbf{x})\,\|\,q(\mathbf{x})\big)$，$p$ 为分布内（InD）先验的训练分布，$q$ 为分布外（OOD）先验的训练分布。OOD 检测那条线（softmax 置信度、似然比）做二分类；基于扩散分数的漂移度量（Eq. 4）要干净样本。本文补的是"只有测量 + 给出程度值"这一格，并给出等号成立的条件而不是启发式打分。
- **为什么反问题里特别难**：$\mathbf{H}$ 有零空间，零空间里的分布差异原则上无法从单次测量看到；本文用"算子集合的期望投影满秩"（Assumption 1）摊平这件事——单个算子看不到，算子分布整体看得到。

## 3. 核心方法和数据流

```text
训练两个扩散模型：InD 在 p(x) 上、OOD 在 q(x) 上（EDM/DDPM++ 预条件）
→ 取 N 条只有测量的测试数据 {y_i, H_i}
→ 对每个 H_i 做 SVD：H = U Σ Vᵀ，构造投影 P = Σ†Σ，ȳ = Σ†Uᵀy
→ 在扩散噪声档 σ 上加噪：ȳ_σ = P x̄ + n̄，n̄ ~ N(0, σ²P)，回到图像坐标 z_σ = V ȳ_σ
→ 用 Tweedie 把两个模型在该点的去噪输出换成分数：∇log p_σ ≈ (D_σ − z_σ)/σ²
→ 加权平方差：W = E[P]^{-3/2}，对 σ 积分 ∫ (·) σ dσ  →  测量域 KL 估计
→ 同一目标当损失：只在 V ȳ_σ 上回归，微调 OOD 模型（Eq. 31）
→ 用 DPS 在 InD 测试数据上重建，比较 PSNR / LPIPS
```

### 3.1 从图像域 KL 到测量域 KL（Eq. 4 → Theorem 1）

$$D_{\mathrm{KL}}\big(p\|q\big)=\int_0^\infty \mathbb{E}_{x\sim p}\Big[\big\|\nabla\log p_\sigma(x_\sigma)-\nabla\log q_\sigma(x_\sigma)\big\|_2^2\Big]\,\sigma\,d\sigma$$

扩散模型给的是 MMSE 去噪器 $\mathsf{D}_\sigma$，由 Tweedie 公式 $\mathsf{D}_\sigma(x_\sigma)=x_\sigma+\sigma^2\nabla\log p_\sigma(x_\sigma)$ 换成分数。所以"两个模型的去噪差"就是分数差，KL 是它在所有噪声档上的积分。搬到测量域后：

$$\hat D_{\mathrm{KL}}=\int_0^\infty \mathbb{E}\Big[\big\|\mathbf{W}\big(\nabla\log p_\sigma(\mathbf{V}\bar{\mathbf{y}}_\sigma)-\nabla\log q_\sigma(\mathbf{V}\bar{\mathbf{y}}_\sigma)\big)\big\|_2^2\Big]\,\sigma\,d\sigma,\quad \mathbf{W}=\mathbb{E}[\mathbf{P}]^{-3/2}$$

两条假设：**Assumption 1** 算子族 $\{\mathbf{H}\}$ 的 range 合起来张满 $\mathbb{R}^n$（$\mathbb{E}[\mathbf{P}]$ 在相关子空间满秩），随机掩码与随机欠采样天然满足；**Assumption 2** 所有 $\mathbf{H}$ 共享同一右奇异矩阵 $\mathbf{V}$——inpainting 里 $\mathbf{H}$ 是对角 0/1 矩阵，$\mathbf{V}=\mathbf{I}$、$\mathbf{P}=\mathbf{H}$；MRI 里 $\mathbf{H}=\mathbf{I}\boldsymbol{\Sigma}\mathbf{F}$，$\mathbf{V}=\mathbf{F}^{\mathsf T}$ 固定（附录 E.1、E.2 逐条对上）。

**权重 $\mathbf{W}$**：不同 $\mathbf{P}$ 实现的概率不均，被观测方向会重复计数；$\mathbb{E}[\mathbf{P}]^{-3/2}$ 让每个方向的贡献按被看到的频率归一。论文没给这个幂次的直观解释，本页判断它来自对投影算子做变量替换时的 Jacobian 补偿，读附录 B 时要盯住这一步。

### 3.2 自适应与实验规模（Eq. 31、附录 E）

$$\mathrm{MSE}(\mathsf{D}_{\text{Adapted}})=\mathbb{E}_{y,y_\sigma}\Big[\big\|\mathbf{W}\big(\mathbf{V}\bar{\mathbf{y}}-\mathsf{D}_{\text{Adapted}}(\mathbf{V}\bar{\mathbf{y}}_\sigma)\big)\big\|_2^2\Big]$$

就是把 Theorem 1 被积函数里的"分数差"换成"OOD 去噪器对 InD 测量的去噪误差"。训练用 EDM 预条件，超参照 Karras 等 2022 不变、只按测量条数调 batch；每个 batch 用同一张掩码；停止条件为损失在最近 10 kimg 内改善 <0.5%，或跑满 $B$ kimg（64 条测量 $B=500$，128 条 $B=1000$）。单张 A6000。规模：inpainting 用 FFHQ 为 InD，AFHQ / MetFaces / Microscopy(CHAMMI) 为 OOD，全部 64×64，4×4 不重叠 patch 按概率 $p$ 擦除，KL 实验只取 20 张 FFHQ 测试图；MRI 用 fastMRI 单线圈，brain 48,406 张 320×320 切片（index > 5）为 InD，knee 29,877 张、prostate 7,673 张为 OOD，测试取 20 张 brain 验证切片，掩码保留最低 $120/R$ 条频率线 + 其余随机 $200/R$ 条，共 $320/R$ 条。

## 4. 论文证据与实验范围

**Fig. 1 / Fig. 3（主图）**：测量域 KL（实线）贴合图像域 KL（虚线），$p$ 越小（污染越重，$p=0.2$）偏差越大但相对排序不变；MRI 在 $R=4,6,8$ 下同样贴合（另见 Fig. 7）。纵轴是"积分到某个 $\sigma$ 的截断 KL"，不是最终标量，只能比较曲线形状与相对大小。

**Table 1（inpainting，DPS 重建）**

| 方法 | $p{=}0.8,\sigma_z{=}0.01$ PSNR / LPIPS | $p{=}0.9,\sigma_z{=}0$ PSNR / LPIPS |
|---|---|---|
| Microscopy | 21.68 / 0.1466 | 25.14 / 0.0707 |
| MetFaces | 25.49 / 0.0766 | 29.60 / 0.0342 |
| AFHQ | 25.84 / 0.0614 | 30.02 / 0.0246 |
| FFHQ（InD 上界） | 28.36 / 0.0322 | 33.24 / 0.0113 |
| Adapt64 (AFHQ) | 26.14 / 0.0530 | 30.23 / 0.0208 |
| Adapt128 (AFHQ) | **26.52** / **0.0465** | **30.37** / **0.0187** |

自适应只填回约 0.30–0.68 dB，离 InD 的 28.36 / 33.24 仍差 1.8–2.9 dB：漂移被削弱，但没有被消除。

**Table 2（KL 估计对 $N$ 与 $\sigma_z$ 的稳健性）**：图像域 KL 为 1.974 / 1.935 / 1.978 / 1.956（$N=20/40/80/120$），测量域估值 2.063–2.140，随 $\sigma_z$ 从 0 到 1.0 只变动约 0.02–0.03。即**单调性与量级对，但绝对值系统性高估约 0.1（5% 量级）**，正文只说 "stable"，未讨论这个偏置。

**Table 3（MRI brain vs prostate KL）**：$R=4$ 时 $\sigma_z{=}0/0.1/0.2$ 分别为 2.51875 / 2.53045 / 2.53055，$R=6$ 为 2.51844 / 2.53003 / 2.53027，$R=8$ 为 2.51821 / 2.52980 / 2.53002；图像域参考值 2.50662。加速率几乎不改估值，测量噪声的影响也只有约 0.012。

**Table 4（MRI 单线圈 $R=4$，DPS 重建）**：$\sigma_z{=}0$ 时 prostate（OOD）24.15 / 0.3223、knee 26.51 / 0.2697、brain（InD 上界）27.92 / 0.2159、Adapt64(Prostate) 25.17 / 0.3071；$\sigma_z{=}0.01$ 时依次为 23.89 / 0.3268、25.90 / 0.2774、27.42 / 0.2234、24.80 / 0.3089（PSNR / LPIPS）。自适应回收约 1.0 dB，仍差 InD 上界 2.8 dB。

**证据边界**：全部实验是 2D、64×64（inpainting）与 320×320 单线圈（MRI）；只有 20 张测试图算 KL；重建只报 PSNR/LPIPS，没有任何病灶级或幻觉级分析（本页判断：不影响度量有效性，但论文不回答"漂移如何变成编造"）。

## 5. 复现与审计重点

- **官方仓库实际内容（2026-11-22 核对 main，唯一提交 2025-05-20）**：有真实实现——`KL_inpainting.py`、`KL_mri.py`、`adapt_inpainting.py`、`adapt_mri.py`，加上 `EDM/`（dnnlib、util）、`torch_utils/`（persistence、misc、distributed、training_stats）、`training/`（`networks.py`、`loss.py`、`dataset.py`、`augment.py`、`training_loop_inpainting.py`、`training_loop_mri.py`）与 `requirements.txt`。论文与代码对应：Theorem 1 的 $\mathbf{W}$ 加权与 $\sigma$ 积分在 `KL_*.py` 主循环，Eq. 31 在 `adapt_*.py` 并复用 `training/loss.py`，掩码与欠采样算子在 `training/dataset.py` 与脚本参数 `--prob`、`--patch`、`--acceleration`。
- **仓库里没有权重、没有数据**：ReadME 的目录结构列了 `model_zoo/`、`testsets/`、`adaptsets/`，但都不在仓库树里，全靠 Google Drive（模型；测试集 FFHQ_20、Brain_20；自适应集 Brain_64/128、FFHQ_64/128）。
- 训练脚本齐备，可从零重训 InD/OOD 模型，代价是 A100 级、数万切片。复现顺序：`KL_inpainting.py`（64×64 最便宜）→ 对照 Fig. 1 → `adapt_inpainting.py` 复算 Table 1 → 再上 MRI。

**审计要点（本页判断）**
1. $\sigma$ 积分区间与离散化正文未给（附录 E.3 只对 GMM 写了 $[0.01,1.0]$ 的 Riemann 和），这是数值最敏感处，复现必须自己定并报告。
2. Table 2 显示绝对值系统性偏高约 0.1，而 Fig. 1/3 是曲线对比：**"接近"是形状意义还是数值意义，论文没分开说**，引用时不要写成"误差 <5%"。
3. 只有 20 张测试图，$N$ 取 20–120 与测试集同阶，"$N$ 稳健"是在同一批图上变的；自适应虽只用 $\mathbf{V}\bar{\mathbf{y}}$，但每 batch 固定同一张掩码，等于对掩码分布多了一个假设。

## 6. 建议阅读顺序

摘要 + Fig. 1（先建立"曲线贴合"的直觉）→ §2.2 Eq. 4（分数差积分是全部推导的地基）→ §3.2 假设 1–2 与 Theorem 1（为什么 $\mathbf{V}$ 上的分数能代表图像分数、$\mathbf{W}$ 为何需要）→ 附录 B 的证明与附录 C 的噪声情形 → §4.2 + Eq. 31（度量当损失，对做 TTA 的人最有用）→ Table 1–4 与附录 E 实现细节 → 回看 Fig. 6 的 $p$ 消融。

## 7. 前后关联

- **同一条线的前作**：[DDS](../mri/20-dds.md) 与 [SCD](../mri/31-scd.md) 都在"漂移下怎么采样/怎么自适应"，本文补的是"先量出漂移有多大"。SCD 用 LoRA 在采样中自适应，本文用测量域回归微调整个分数函数，可以叠加：先估 KL 决定要不要适配，再选适配方式。
- **同组后续 / 局部化版本**：[KLIP](21-klip.md) 把全局 KL 做成 patch 级漂移图（CVPR 2026），本文是它的全局前身。
- **漂移与不确定性**：[23-lpn-shift-uq.md](23-lpn-shift-uq.md) 用生成先验做漂移下的不确定性量化，本文给标量散度而非逐像素不确定度，两者互补；[24-weak-priors.md](24-weak-priors.md) 处理先验本身太弱的情形——两个模型都没学好分数时 Theorem 1 的前提先破。
- **漂移导致的具体失败形态**：[BiasRecon](../mri/15-biasrecon.md) 分析先验偏置如何进入重建，[HalluGen](11-hallugen.md) 把"编造结构"做成可评测数据集。本页判断：把本文的测量域 KL 当作"漂移强度"自变量去回归 HalluGen 式幻觉率，是一个便宜且未被做过的实验。
- **重建端**：[DDIP](../mri/32-ddip.md)、[AdaDiff](../mri/33-adadiff.md)、[PET DDIP](../mri/34-pet-ddip.md)、[CDPIR](../mri/35-cdpir.md) 都是漂移下的自适应重建，可用本文度量给它们的"漂移难度"排序。

## 8. 链接

- arXiv：<https://arxiv.org/abs/2505.11482>（v3，2025-05-26）；HTML 全文 <https://arxiv.org/html/2505.11482>；代码 <https://github.com/wustl-cig/Measurement-domain-KL-divergence>（main，2025-05-20）
- OpenReview 投稿记录（"Measuring Distribution Shifts in Inverse Problems without clean data"，Submitted to ICLR 2026，未见录用决定）：<https://openreview.net/forum?id=F5sQPP7Swa>
- 权重与数据（Google Drive，README 给出）：模型 <https://drive.google.com/drive/folders/1oDmEtW6AUsLeaHQi_6SolmlZ4-kt1KbM>；测试集 <https://drive.google.com/drive/folders/1NKn0dM6P6A240e5xgFVFNvIVBn5OXCze>；自适应集 <https://drive.google.com/drive/folders/1THaDKvZozCITe_xS6Fz66zTaZia7izIX>
- 重建采样器 DPS <https://arxiv.org/abs/2209.14687>（ICLR 2023）；训练框架 Karras 等，EDM，NeurIPS 2022
