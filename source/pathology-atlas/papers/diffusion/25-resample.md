# 25｜ReSample：硬数据一致性搬进潜空间，自然图像 LDM 微调后直接做 CT

**论文**：Solving Inverse Problems with Latent Diffusion Models via Hard Data Consistency，Bowen Song、Soo Min Kwon、Zecheng Zhang、Xinyu Hu、Qing Qu、Liyue Shen（Michigan、Kumo.AI、Microsoft）；ICLR 2024；arXiv:2307.08123（v1 2023-07-16，v3 2024-04-16）
**定位**：潜空间扩散先验求解逆问题；用「优化式硬数据一致性 + 随机重采样」替代逐步梯度更新；CT 实验把 FFHQ 自然图像 LDM 在 2000 张 CT 切片上微调后直接使用
**精读核验**：2026-11-22 依 arXiv HTML v3 全文（§1–5、Appendix A–F，Table 1–16、Figure 1–21）逐节读过；录用信息经 ICLR 2024 官方 proceedings 记录核对（`proceedings.iclr.cc` hash `1f09e1…5815`，OpenReview `j8hdRqOUhN`，页面被反爬拦截故以 proceedings 为准）。官方代码 `soominkwon/resample` 同日经 GitHub 页面核对：含 `ldm_inverse/condition_methods.py`、`measurements.py`、`sample_condition.py`、`scripts/medical_finetuning.py`、`data/dataloader.py` 与 `configs/tasks/*.yaml` 五个任务配置，是真实实现。**本站未运行任何代码、未复现实验**，数字全为论文报告值。

## 原文摘要

> Diffusion models have recently emerged as powerful generative priors for solving inverse problems. However, training diffusion models in the pixel space are both data-intensive and computationally demanding, which restricts their applicability as priors for high-dimensional real-world data such as medical images. Latent diffusion models, which operate in a much lower-dimensional space, offer a solution to these challenges. However, incorporating latent diffusion models to solve inverse problems remains a challenging problem due to the nonlinearity of the encoder and decoder. To address these issues, we propose ReSample, an algorithm that can solve general inverse problems with pre-trained latent diffusion models. Our algorithm incorporates data consistency by solving an optimization problem during the reverse sampling process, a concept that we term as hard data consistency. Upon solving this optimization problem, we propose a novel resampling scheme to map the measurement-consistent sample back onto the noisy data manifold and theoretically demonstrate its benefits. Lastly, we apply our algorithm to solve a wide range of linear and nonlinear inverse problems in both natural and medical images, demonstrating that our approach outperforms existing state-of-the-art approaches, including those based on pixel-space diffusion models.

*来源：arXiv:2307.08123v3 摘要，与 ICLR 2024 proceedings 版摘要逐字一致。*

## 中文摘要

> 扩散模型近来已成为求解逆问题的强生成先验。但在像素空间训练扩散模型既费数据又费算力，限制了它作为 CT、MRI 这类高维真实数据先验的可用性。潜扩散模型在低得多的维度上工作，可缓解这些问题；然而由于编码器与解码器的非线性，把潜扩散模型用于逆问题仍很困难。为此我们提出 ReSample：一种可用预训练潜扩散模型求解一般逆问题的算法。它在反向采样过程中通过求解一个优化问题来施加数据一致性，我们把这一概念称为「硬数据一致性」。在解出该优化问题后，我们提出一种新的重采样方案，把与测量一致的样本映射回带噪数据流形，并从理论上证明其收益。最后，我们在自然图像与医学图像上求解大量线性与非线性逆问题，证明本方法优于现有最先进方法，包括基于像素空间扩散模型的方法。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**潜扩散模型做逆问题的难点不在先验，而在解码器把潜空间搞成非线性流形；ReSample 的做法是每隔若干步，把「与测量一致」当凸优化问题硬解出来，再用一个带方差的闭式重采样把它放回对应噪声水平的流形上。**

三件值得读的事：

1. **硬 vs 软数据一致性的分野**：Latent-DPS 用梯度 ∇_z‖y−A(D(ẑ₀))‖² 做软约束，作者实测它收敛到的测量残差比 ReSample 大 1–2 个数量级（Table 16），并归因于「解码器非线性使线性流形假设失效」（§D）。这条批评对所有「把像素空间 DPS 直接搬到潜空间」的做法都成立。
2. **CT 实验就是"自然图像先验 → 医学微调"这条路**：预训练用 **FFHQ 自然图像 LDM-VQ4**（外加 CelebA-LDM），在 **AAPM LDCT 数据集 2000 张 256×256 切片、40 名患者**上微调 10 万步、学习率 1e-5，然后在另外 10 名患者的 300 张切片上做稀疏视角 CT（25 个角度、平行束、torch-radon、σ_y=0.01）。Table 3 三个部位全面领先 FBP-UNet / PnP-UNet。
3. **方法本身可迁移**：硬一致性步只要求前向算子 A 可微（CT 的 radon 用共轭梯度解，非线性去模糊用迭代），不绑定某个具体扩散模型。

**关于「用大预训练生成先验 + 域适配」的判断（本页判断）**：这篇是「自然域先验 → 医学域微调」的标准范本，但它只证明了**测量一致性**与 PSNR/SSIM，没有任何病灶层面或幻觉层面的评估；25 个视角的 CT 测量信息量很大，按 [24 号弱先验](24-weak-priors.md)的框架，这种设定下先验本身弱一点也能被测量拉回来，所以 Table 3 的领先不能直接外推成「自然图像先验在低剂量/少视角 CT 里安全」。

## 2. 问题及研究位置

逆问题 y = A(x*) + η，m<n 时病态，需要先验正则。像素空间扩散先验（DPS、MCG、DDRM、DMPS）在自然图像上成熟，但医学图像是 3D/4D，像素空间训练不可行；潜扩散模型（LDM，[06 号笔记](../diffusion/06-ldm.md)）在压缩潜空间训练，代价低、还能小数据微调迁移。

已有位置：

- **像素空间后验采样**：DPS 用拉普拉斯近似似然，逐步梯度更新；在潜空间直接照搬就是 Latent-DPS，作者实测「噪声大、模糊、与测量不一致」。
- **潜空间软约束**：并发工作 PSLD 只处理线性逆问题、有可证保证，但作者观察到测量噪声下伪影明显（附录 A.4 还把 PSLD 基线重跑调参，标为 PSLD-LDM）。
- **本文**：把数据一致性写成约束优化 min_z ½‖y−A(D(z))‖²，以 Tweedie 估计 ẑ₀ 为初值局部求解，再用随机重采样回到 z_t；因此线性/非线性、像素/潜空间都能用。

## 3. 核心方法和数据流

```text
输入：测量 y、前向算子 A、编码器 E、解码器 D、分数网络 s_θ、DDIM 超参 η,δ
z_T ~ N(0, I)
for t = T-1 … 0:
    ε̂ = s_θ(z_{t+1}, t+1)
    ẑ₀(z_{t+1}) = (z_{t+1} − √(1−ᾱ_{t+1})·ε̂) / √ᾱ_{t+1}        # Tweedie
    z'_t = √ᾱ_t·ẑ₀ + √(1−ᾱ_t−ηδ²)·ε̂ + ηδ·ε₁                      # 无条件 DDIM 步
    if t ∈ C（后两个时间区间，每 10 步一次）:
        ẑ₀(y) = argmin_z ½‖y − A(D(z))‖²，初值 ẑ₀(z_{t+1})，早停阈值 τ
        z_t ~ N( m, s² I )，其中
            m = (σ_t²·√ᾱ_t·ẑ₀(y) + (1−ᾱ_t)·z'_t) / (σ_t² + 1−ᾱ_t)
            s² = σ_t²(1−ᾱ_t) / (σ_t² + 1−ᾱ_t)                      # 随机重采样
    else:
        z_t = z'_t
输出：x̂₀ = D(z₀)
```

三个要点：

1. **区间与求解器分工**：论文称把 T 三等分，第一段不做一致性，因为 ẑ₀ 估计太差、收益边际；CT 的实际切点更保守（附录 C.2：t>750、300<t≤750、t≤300，T=1000）。第二段在**像素空间**用共轭梯度解，CT 取 κ=0.9、50 次迭代；第三段在**潜空间**优化，早停 τ=1e-4（自然图像另有 pixel 最多 2000 步、latent 最多 500 步的上限）。这就是 README 说的「latent + pixel 两段优化，只开 pixel 会掉点」。
2. **方差调度是唯一的手调旋钮**：σ_t² = γ((1−ᾱ_{t−1})/ᾱ_t)(1−ᾱ_t/ᾱ_{t−1})，γ=40 对自然图像与 CT 通用。σ→0 退化为无条件采样，σ→∞ 退化为随机编码（Proposition 1）；Proposition 2 给出条件化于 z'_t 后的后验高斯，Lemma 1/Theorem 1 证其方差更小且无偏，Theorem 2 说明 t→0 时方差趋于 0。
3. **跳步机制**：每 10 步做一次硬一致性，与每步都做相比 PSNR 31.72 vs 31.74、时间 3:52 vs 31:20（Table 11，chest CT）；跳步 20 以后才开始明显掉点。

## 4. 论文证据与实验范围

**数据**：自然图像 CelebA-HQ / FFHQ / LSUN-Bedroom（SR 4×、随机 70% 与 box inpainting、高斯去模糊 61×61 σ=3、非线性去模糊），测量噪声 σ_y=0.01；医学 AAPM LDCT 如 §1 所述，测试 300 张、25 视角。

**CT（Table 3，PSNR/SSIM）**：

| 部位 | ReSample | PnP-UNet | FBP-UNet | Latent-DPS | DPS |
|---|---|---|---|---|---|
| Abdominal | **35.91 / 0.965** | 32.84 / 0.942 | 32.77 / 0.937 | 26.80 / 0.870 | 27.33 / 0.715 |
| Head | **37.82 / 0.978** | 33.45 / 0.945 | 31.95 / 0.917 | 28.64 / 0.893 | 24.51 / 0.665 |
| Chest | **31.72 / 0.922** | 29.67 / 0.891 | 29.78 / 0.885 | 25.67 / 0.822 | 24.73 / 0.682 |

**自然图像（CelebA-HQ，Table 1/2）**：SR 4× PSNR 30.45（DDRM 29.49、DPS 28.41）；随机 inpainting 32.77/0.903（DPS 32.48/0.899）；非线性去模糊 30.18（DPS 26.81）。**FFHQ（Table 5/6）不是全胜**：SR 28.90 领先，但随机 inpainting PSNR 31.34 输给 DPS 的 32.32（SSIM 0.890 vs 0.897），高斯去模糊 28.73 也仅小幅领先 27.70；作者自己总结「前向算子越复杂，ReSample 相对优势越大」。

**效率与一致性（Table 4/10/16）**：FFHQ 高斯去模糊显存 ReSample 合计 5009MB（增量 1040MB，26.2%），DPS 5369MB、DDRM 20786MB；推理 1:54 vs DPS 1:12；测量残差 chest 5.36e-5 vs Latent-DPS 2.99e-3、abdominal 6.28e-5 vs 3.92e-3、head 1.73e-5 vs 2.03e-3。

**范围限制（本页判断）**：2D 单切片、单一中心 AAPM、单一 25 视角平行束几何、加性高斯噪声；无低剂量噪声、无心电/呼吸伪影；指标只有 PSNR/SSIM（自然图像多 LPIPS），**无放射科评估、无病灶保真度指标**；训练只用 40 名患者，跨中心泛化未测。

## 5. 复现与审计重点

- **仓库内容**：`ldm_inverse/condition_methods.py` 是硬一致性与重采样实现，`measurements.py` 是各前向算子，`sample_condition.py` 是入口，`data/dataloader.py` 读数据，`configs/tasks/` 有 SR / 高斯去模糊 / 运动去模糊 / inpainting / 非线性去模糊五个配置；`scripts/medical_finetuning.py` 是 CT 微调脚本，说明作者确实放出了「FFHQ LDM → CT」这条链路。
- **不含权重**：README 让人从 ommer-lab 下 FFHQ LDM 与 vq-f4 首阶段模型，仓库内无 CT 微调后的 checkpoint，也无 AAPM 预处理后的切片/正弦图；要复现 Table 3 必须自己按 §4.1 的 2000/300 划分重建数据。
- **外部依赖**：非线性去模糊和运动模糊分别 clone `VinAIResearch/blur-kernel-space-exploring`、`LeviBorodenko/motionblur`（沿用 DPS 代码库）；环境用 `environment.yaml`，代码基于 CompVis latent-diffusion 魔改，旧版 PyTorch 依赖要留意。
- **审计要点**：CT 的两个优化阶段参数不一致（自然图像 pixel 最多 2000 次、CT 50 次 CG；潜空间 CT 早停 τ=1e-4 而无最大步数），复现前应从代码确认；Table 16 的残差是「平均测量一致性损失」，不是逐样本分布，不能当作无幻觉证据；PSLD 基线经过重调参（附录 A.4），对比公平性依赖这次调参是否到位。
- **本页判断**：`scripts/medical_finetuning.py` 若确按论文的 100K 步、1e-5 微调，则「自然域先验 + 小数据域适配」这一路径的可复现性较高；真正的不确定性在数据划分与正弦图仿真（角度数、噪声水平）是否被完整记录。

## 6. 建议阅读顺序

摘要 → §3.1 硬一致性（式 10 与其初值论证）→ Algorithm 1 → 式 12/13 与 Proposition 1/2 → §3.2 Lemma 1、Theorem 1/2 → §4.1 Table 3 与 Figure 4（CT 视觉对比）→ §4.2 Table 4（显存）与 Figure 6 右（跳步消融）→ 附录 B（共轭梯度像素优化）→ 附录 C.1/C.2（全部超参）→ 附录 D（Latent-DPS 失败三因）→ 附录 A.4（PSLD 基线重调）。

## 7. 前后关联

- 与 [20 号 DDS](../mri/20-dds.md) 对照：DDS 在像素空间用分解式扩散采样做 CT/MRI，ReSample 把同类一致性搬到潜空间；两者都说明「重建质量的一半来自数据一致性怎么施加」，不是先验本身。
- 与 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md)、[33 号 AdaDiff](../mri/33-adadiff.md) 是同一条「测试时适配」谱系：SCD 用 LoRA 在采样中适配条件网络，DDIP 把逐切片 TTA 压成整卷一次，AdaDiff 先出初解再按扫描微调；ReSample 则完全不改网络，只在采样轨迹上硬投影，是最「无训练」的一档。
- 与 [23 号冻结视觉基础模型](../mri/23-fm-cardiac-mri.md)、[30 号自然域基础模型](../mri/30-natural-domain-fm.md) 互补：那两篇论证「自然域表征可迁移」，这篇给出「自然域生成先验迁移到 CT」的具体成本（2000 张切片 + 10 万步微调）。
- 与 [24 号弱先验](24-weak-priors.md) 直接对话：25 视角 CT 测量信息量大，弱/跨域先验也能被测量拉回，这解释为何「FFHQ 微调后仍能赢」，也提醒低剂量 CT 这种测量信息更少的场景结论可能翻转（本页判断）。
- 与 [06 号 LDM](../diffusion/06-ldm.md) 是上下游：LDM 提供压缩与生成两段式骨架，ReSample 补上「解码器非线性下如何做条件采样」；[01 号 JiT](../diffusion/01-jit.md) 代表的无自编码器路线则从根上绕开这个问题。

## 8. 链接

- [arXiv:2307.08123（abs）](https://arxiv.org/abs/2307.08123)
- [arXiv HTML v3 全文](https://arxiv.org/html/2307.08123v3)
- [ICLR 2024 官方 proceedings 记录](https://proceedings.iclr.cc/paper_files/paper/2024/hash/1f09e1ee5035a4c3fe38a5681cae5815-Abstract-Conference.html)
- [OpenReview 页面（forum j8hdRqOUhN）](https://openreview.net/forum?id=j8hdRqOUhN)
- [官方代码 soominkwon/resample](https://github.com/soominkwon/resample)
- [FFHQ LDM 与 vq-f4 权重（README 指向的 ommer-lab）](https://ommer-lab.com/files/latent-diffusion/ffhq.zip)
