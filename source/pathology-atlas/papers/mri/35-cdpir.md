# 35｜CDPIR：用多域条件扩散先验扛稀疏视角 CT 的分布外重建

**论文**：Cross-Distribution Diffusion Priors-Driven Iterative Reconstruction for Sparse-View CT，Haodong Li、Shuo Han、Haiyang Mao、Yu Shi、Changsheng Fang、Jianjia Zhang、Weiwen Wu、Hengyong Yu；IEEE Transactions on Medical Imaging，vol. 45, pp. 3878–3894, 2026（DOI 10.1109/TMI.2026.3687173，PMID 42024952）；arXiv:2509.13576（2025-09-16 首次提交）
**定位**：把"多域条件 + CFG null 分支"当成跨分布先验，塞进 ASD-POCS 残差引导的交替迭代；稀疏视角 CT 的 OOD（AAPM→COCA/XCAT、AAPM→临床心脏、AAPM→MARS 光子计数腕关节）泛化
**精读核验**：2026-11-22 读 arXiv:2509.13576v1 HTML 全文（§I–VI、式 1–17、Table I–IV、Fig. 1–8）；TMI 卷期页码与 DOI 经 Crossref 与 PubMed E-utilities 核对。官方代码 `Graeme-Lee/CDPIR` 同日经 GitHub API 核对：`train.py`、`sample.py`、`models.py`、`dataset.py`、`transport_folder/`（stochastic interpolant 采样器）、`LEAP/` 均可读，预训练权重 `0200000.pt`（2.19 GB）托管于 Hugging Face `Hd9955/CDPIR`；**代码与权重均未下载运行**。

## 原文摘要

> Sparse-View CT (SVCT) reconstruction enhances temporal resolution and reduces radiation dose, yet its clinical use is hindered by artifacts due to view reduction and domain shifts from scanner, protocol, or anatomical variations, leading to performance degradation in out-of-distribution (OOD) scenarios. In this work, we propose a Cross-Distribution Diffusion Priors-Driven Iterative Reconstruction (CDPIR) framework to tackle the OOD problem in SVCT. CDPIR integrates cross-distribution diffusion priors, derived from a Scalable Interpolant Transformer (SiT), with model-based iterative reconstruction methods. Specifically, we train a SiT backbone, an extension of the Diffusion Transformer (DiT) architecture, to establish a unified stochastic interpolant framework, leveraging Classifier-Free Guidance (CFG) across multiple datasets. By randomly dropping the conditioning with a null embedding during training, the model learns both domain-specific and domain-invariant priors, enhancing generalizability. During sampling, the globally sensitive transformer-based diffusion model exploits the cross-distribution prior within the unified stochastic interpolant framework, enabling flexible and stable control over multi-distribution-to-noise interpolation paths and decoupled sampling strategies, thereby improving adaptation to OOD reconstruction. By alternating between data fidelity and sampling updates, our model achieves state-of-the-art performance with superior detail preservation in SVCT reconstructions. Extensive experiments demonstrate that CDPIR significantly outperforms existing approaches, particularly under OOD conditions, highlighting its robustness and potential clinical value in challenging imaging scenarios.

*来源：arXiv:2509.13576 摘要页，与 HTML 版逐字一致。*

## 中文摘要

> 稀疏视角 CT（SVCT）重建能提高时间分辨率、降低辐射剂量，但视野减少带来的伪影，以及扫描仪、协议或解剖差异造成的域偏移，使其在分布外（OOD）场景下性能下降，限制了临床应用。本文提出跨分布扩散先验驱动的迭代重建框架（CDPIR）来解决 SVCT 的 OOD 问题。CDPIR 把由可扩展插值 Transformer（SiT）导出的跨分布扩散先验与基于模型的迭代重建结合起来。具体来说，作者训练一个 SiT 骨干（DiT 架构的扩展），建立统一的随机插值框架，并跨多个数据集使用无分类器引导（CFG）：训练时以空嵌入随机丢弃条件，使模型同时学到域相关与域不变的先验，从而提升泛化性。采样阶段，这个全局敏感的 Transformer 扩散模型在统一随机插值框架内利用跨分布先验，可灵活稳定地控制"多分布到噪声"的插值路径与解耦采样策略，从而改善对 OOD 重建的适应。通过交替执行数据保真更新与采样更新，模型在 SVCT 重建上取得 SOTA 性能与更好的细节保持。大量实验表明 CDPIR 显著优于现有方法，尤其在 OOD 条件下，体现出鲁棒性与在困难成像场景中的临床潜力。

*译文：逐句对译上方摘要，未压缩、未增删；术语按原文用词直译。*

## 1. 三分钟摘要与推荐理由

一句话：**它不改采样器、也不做测试时微调，而是让"一个模型在多个数据集上带域标签训练 + 随机丢标签"，使无条件分支承担域不变解剖先验、条件分支承担域相关纹理先验，再把这个先验接到 ASD-POCS 的交替迭代里。**

三件事值得读：

1. **它给出了"OOD 靠训练期多域混合"的一条路线**，与 SCD 的"测试时靠测量一致性改造采样器"正好对立：CDPIR 在推理时 CFG 尺度取 μ=1（式 6–8 与 §III-B 末段明确写了），意味着**测试时实际只走条件分支**，"域不变/域相关"是训练期学到的结构解释，不是推理期的显式混合。作者自己也承认这一点（"rather than to indicate an explicit mixture at testing time"）。
2. **OOD 增益是真的大**：AAPM 训练、XCAT 测试 38.36 dB / 0.952，DDS 32.09 / 0.878，DiffusionMBIR 31.46 / 0.767；AAPM→COCA 39.22 / 0.951 vs DDS 36.01 / 0.937。
3. **两个真实临床数据集上的零样本结果只有文字、没有表**：GE 临床心脏（123 视角）声称比 DDS 高 +0.07 SSIM，MARS 光子计数腕关节（74/373 视角）声称比 ASD-POCS 高约 +3.5 dB PSNR / +0.05 SSIM。这是本文最有临床分量、也最难核验的部分。

对本人的病理/医学扩散分布外研究（本页判断）：这篇是"**训练期多域条件化**"这一支的代表，和 [SCD](31-scd.md) 的"测试时适配"、[DDIP](../mri/32-ddip.md) 的"多步 LoRA 微调"构成三条可对照的 OOD 路线；它声称 ID 下也能比 DDS 高约 4 dB，说明多域条件化不只提升 OOD，也可能改变了 ID 基准强度——跨论文比数字时要留意训练域数量不同。它只在正文提过一句"fewer hallucinations"（Fig. 4 讨论），**没有任何幻觉/病灶层面的度量**，无法直接用于你关心的 fabricated/erased 分析。

## 2. 问题及研究位置

问题：$y = Ax + \epsilon$，稀疏视角下 $m \ll n$，病态性被放大。生成式先验（DDS、DiffusionMBIR、MCG）在同分布上很强，但先验紧贴训练分布；换扫描仪/协议/解剖（AAPM 的西门子腹部低剂量 → COCA 的心脏钙化/胸部 → MARS 的光子计数腕关节）就掉点，甚至出现结构性错误。

已有位置与本文的切口：

- **MBIR/ASD-POCS**：物理严格、不需训练，但高噪声/极稀疏下细节与伪影控制差；本文把它当"数据保真子问题"的求解器并用它做初始化。
- **CNN/Transformer 后处理**（RED-CNN、Restormer）：强归纳偏置、跨域脆弱。
- **扩散逆问题求解器**：MCG（流形约束）、DiffusionMBIR、DDS（分解采样 + CG 校正）。作者在 §III 开头直接点名：这些方法在测试分布等于训练分布时有效，OOD 下失效。
- **SCD（ref [21]）**：被引用并讨论——"靠测量一致性做测试时适配，跨模态有效，但 CT 中投影矩阵/几何变化会显著削弱它"。**本文没有把 SCD 放进任何对比表**，这是读这篇时必须自己补的缺口。
- **本文**：训练期把多个数据集当作 CFG 的条件标签，用 null token 逼出域不变分支；推理期把 SiT 的随机插值采样与 ASD-POCS+iTV 交替。

## 3. 核心方法和数据流

```text
训练（多域联合，图像域，无 VAE）：
  切片 (x, 域标签 c) ← AAPM(c=0) / COCA(c=1)（标签空间开到 1000 类）
  t ~ U(0,1)；x_t = α_t·x + σ_t·ε          （stochastic interpolant）
  以一定概率把 c 替换为 null token（CFG 的 null conditioning）
  SiT-B/2 预测速度场 v_θ(x_t, t, c)（图像域 patch=2，去掉自编码器）
  损失：速度/分数匹配（SiT 目标，由 v 反解 score，式 4）

推理（残差引导交替求解，外循环 N 次）：
  x_0 ← ASD-POCS + iTV 初始化（LEAP 投影/反投影，初始 30 次迭代）
  重复：
    ① 扩散子问题（式 14）：
       由 x_i 加噪 → 用 CFG 速度 v^(μ)=v_θ(∅)+μ[v_θ(c)-v_θ(∅)]（μ=1）
       → 映射为引导分数 s^(μ)（式 9）→ 随机 Euler–Maruyama 反向 SDE（式 10）
       → r_{i+1}
    ② 数据保真子问题（式 15–17）：
       OS-SART（K=5 子集）+ Q=1 次 TV 梯度下降 → X_TV
       与 X_SART 做自适应凸组合 x=(1-λ_TV)X_SART+λ_TV·X_TV，
       λ_TV 由残差条件 ‖Ax-y‖²=(1-w)ε_SART+w·ε_prev 解出（w=0.8）
    x_{i+1} ← 上述组合结果
  输出 x_N
```

关键取舍：

1. **先验侧是"训练期域解耦"而不是"测试期适配"**。域不变性来自无条件分支（null 分支被认为是"跨厂商/协议都稳定的解剖级结构"），域相关性来自条件分支的差值 $\mathbf v_\text{spec}=\mathbf v_\theta(c)-\mathbf v_\theta(\varnothing)$。这是**解释性叙事**，论文没有给出特征层面的验证（没有线性探针、没有域分类器实验）。
2. **CFG 尺度固定 1.0**：所以测试时 $\mathbf v^{(\mu)}=\mathbf v_\theta(c)$，条件分支整体生效；如果测试数据来自训练未见的新域，条件标签该填什么？论文的临床实验填的是什么标签，正文没交代——这是复现时第一个会卡住的点。
3. **数据保真用 ASD-POCS+iTV，而不是 DDS 的 CG 校正**：整条 CT 管线（投影/反投影/重建）全在 LEAP 里，保证 DC 步与生成步的算子一致。
4. **SiT 的速度-分数双表示**让采样可在 ODE/SDE 间切换，作者用它作为"采样稳定性更好"的依据（Fig. 8：DDS 要接近 1000 步，CDPIR 200 步即可）。

## 4. 论文证据与实验范围

**数据**：AAPM 2016（4,850 训练 / 560 测试切片）、Stanford AIMI COCA（4,210 / 57）、XCAT 仿真心脏（10 例 × 352 张 256×256，留一交叉验证）、GE 临床心脏（Vanderbilt/UML，984 视角，123 视角测试）、MARS 光子计数腕关节（8 个能段，只用第 8 段，373 视角下采到 74）。仿真实验统一 984 → 55 视角。

**主表（Table I，PSNR / SSIM，均值±标准差）**：

| 训练 q(x) | 测试 q̃(x) | DDS | DiffusionMBIR | CDPIR |
|---|---|---|---|---|
| AAPM | COCA | 36.01±6.85 / 0.937 | 29.91±5.74 / 0.842 | **39.22±6.18 / 0.951** |
| AAPM | XCAT | 32.09±1.36 / 0.878 | 31.46±1.86 / 0.767 | **38.36±0.56 / 0.952** |
| AAPM | AAPM（ID） | 32.22±4.58 / 0.881 | 33.79±3.87 / 0.901 | **36.63±7.21 / 0.942** |
| COCA | AAPM | 32.86±4.24 / 0.861 | **33.58±2.66 / 0.880** | 35.39±1.57 / 0.885 |
| COCA | XCAT | 34.55±2.46 / 0.925 | 31.84±1.84 / 0.780 | **40.06±1.16 / 0.971** |
| COCA | COCA（ID） | 34.16±2.55 / 0.924 | 33.37±5.27 / 0.887 | **39.67±3.01 / 0.958** |

配套基线还有 RED-CNN、Restormer、MCG（同表，均低于 CDPIR），但表里没有 SCD，也没有 DDIP3D 一类测试时微调方法。COCA→AAPM 一行 CDPIR 的 PSNR/SSIM 都只小幅领先 DiffusionMBIR（35.39/0.885 vs 33.58/0.880），是全文最弱的 OOD 提升；而正文说"OOD 上高 2~3 dB"，按表 AAPM→XCAT 实际差 6.3 dB，**文字与表格的量级不一致**。

**临床零样本（只有文字与图，无数字表）**：GE 心脏用 AAPM 训练的模型直接推 123 视角数据，Fig. 5 称 SSIM 比 DDS 高 0.07；MARS 腕关节 74 视角，Fig. 6 称比 ASD-POCS 高约 +3.5 dB PSNR / +0.05 SSIM，并称 MCG "不能稳定收敛"。这两条是全文最强的临床论据，但 arXiv v1 没有给出对应表格与每例统计，**置信度只能算中等**。

**消融**：Table II——仅 AAPM 训练在 XCAT 上 37.59±1.97 / 0.946，AAPM+COCA 训练升到 38.36±0.56 / 0.952（均值升、方差降）；Table III/IV——B-2（12 层/768 维/12 头，142.8M）与 S-2（39.1M）对比，COCA 上 35.54 / 0.9218 → 39.22 / 0.9510，XCAT 上 35.67 / 0.9446 → 37.59 / 0.9457；Fig. 8——采样步数 100/200/500/1000 的收敛曲线。

## 5. 复现与审计重点

- **代码是真的，且比较完整**：`train.py`（含 `--num-classes`，默认 1000）、`sample.py`（`--use-asd-pocs`、`--asd-pocs-iters`、`--asd-pocs-subsets`、`--cfg-scale`、`--class-label`）、`models.py`（SiT 定义）、`transport_folder/`（`create_transport`、`Sampler`）、`dataset.py`（递归扫 `.mat`/`.npy`，按一级子目录名当类标签，`mat_key` 默认 `sub_label1`）。权重 `0200000.pt` 在 HF，README 注明 AAPM=0、COCA=1。
- **数据脚本缺失，依赖较重**：没有 AAPM/COCA/XCAT 的预处理（切窗、HU 归一化、按 SOD 538.5 mm / SDD 950 mm / 835 探测元 / 984 视角 / FOV 500 mm 生成投影），也没有 55/123/74 视角下采脚本；`dataset.py` 只要求已分好类的 `.mat`/`.npy`。ASD-POCS 与全部 CT 算子走 LEAP（仓库内直接 fork 了 `LEAP/`，需按官方 wiki 手动装预编译库）。1000 步 × N 次外循环 × ASD-POCS 的耗时没给（无 runtime 表）。
- **内文数字自相矛盾**：§IV-A 说"patch size 2，模型约 14 million 参数"，Table III 写 B-2 为 142.8M。差一个数量级，大概率是笔误，但按哪个复现会直接改变显存与速度预算。
- **"跨分布"能兑现多少要打问号**：推理时 μ=1，域标签仍要输入；对完全没见过的域（MARS 腕关节），条件标签取 0/1 还是 null 未写明。若取 COCA=1，"域不变先验"的作用就没有被单独检验；若取 null，就变成纯无条件采样。这一条决定它的方法叙事能否成立。
- **对比公平性与 SCD 缺位**：DDS、DiffusionMBIR、MCG 由作者在自家管线（同一 LEAP 算子、同一 55 视角）重跑，没有与官方实现对齐的数值验证，且各方法采样步数不同（DDS 需近 1000 步，CDPIR 200 步已可用），不是等计算量对比。SCD 只在 §I 被引（ref [21]）并被一句话判为"不适配 CT 的投影矩阵变化"，**没有实验对比**，所以"CDPIR 优于 SCD"在本页无法确认。

## 6. 建议阅读顺序

摘要 → §I 最后四段（OOD 两个挑战 + 域不变/域相关先验的分工）→ Fig. 1/2（训练解耦 + 推理交替）→ §III-B 式 6–8 与"μ=1"那句（决定全文方法边界）→ §III-D 式 11–17（交替求解与 λ_TV 残差条件）→ §IV-A 参数（55 视角、ASD-POCS P=10/Q=1/K=5）→ Table I → §IV-D/§IV-E 两段临床零样本（只有文字）→ Table II–IV → Fig. 8 → §VI 讨论（"多域统一 checkpoint / 基础模型"愿景）。

## 7. 前后关联

- **[SCD（31 号）](31-scd.md)**：直接的对照面。SCD 在采样中用测量一致性做 LoRA 式测试时适配；CDPIR 在训练期做多域条件化、测试期不更新参数。你复现 SCD 时发现 Ellipses→AAPM 反而低于 DDS，而 CDPIR 声称多域训练能把 AAPM→COCA/XCAT 拉到 +3~6 dB——两者的差异可能更多来自"有没有把目标域放进训练集"，而不是适配机制本身（本页判断）。
- **[BiasRecon（15 号）](15-biasrecon.md)** 与 **[HalluGen（11 号）](../diffusion/11-hallugen.md)**：前者是同一 OOD 问题的另一种解法（改适配方式而非改先验来源）；后者是给"fewer hallucinations"这类无度量声明补证据的直接工具（本页判断）。
- **[DDS（20 号）](20-dds.md)** 与 **[DDIP（32 号）](../mri/32-ddip.md)**、**[PET DDIP（34 号）](../mri/34-pet-ddip.md)**：DDS 是本文主基线（注意 DC 步被换成 ASD-POCS+iTV，而非 DDS 的 CG）；DDIP 两支是测试时 LoRA 微调路线，与 CDPIR 的零样本路线互补，可作为"适配成本 vs 泛化收益"的对照。CDPIR 全文没有与 DDIP3D 比较（只在 ref [16] 引了 decoupled noise annealing）。
- **[KLIP（21 号）](../diffusion/21-klip.md)**、**[测量域 KL 漂移检测（22 号）](../diffusion/22-meas-kl.md)**、**[生成先验的分布漂移 UQ（23 号）](../diffusion/23-lpn-shift-uq.md)**、**[弱扩散先验（24 号）](../diffusion/24-weak-priors.md)**：这批关心"漂移如何被检测/量化"，CDPIR 只报 PSNR/SSIM、不量化漂移程度，正好可以用它们的指标补本文缺的证据。

## 8. 链接

- [arXiv:2509.13576](https://arxiv.org/abs/2509.13576) · [v1 全文 HTML](https://arxiv.org/html/2509.13576v1) · [IEEE TMI 正式版（DOI 10.1109/TMI.2026.3687173）](https://doi.org/10.1109/TMI.2026.3687173) · [PubMed 42024952](https://pubmed.ncbi.nlm.nih.gov/42024952/)
- [官方代码 Graeme-Lee/CDPIR](https://github.com/Graeme-Lee/CDPIR)
- [预训练权重 Hd9955/CDPIR（0200000.pt，2.19 GB）](https://huggingface.co/Hd9955/CDPIR)
- [LEAP 可微投影器](https://github.com/LLNL/LEAP) · [SiT（骨干来源）](https://github.com/willisma/SiT)
