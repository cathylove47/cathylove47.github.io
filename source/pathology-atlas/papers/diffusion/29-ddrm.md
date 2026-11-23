# 29｜DDRM：在 H 的奇异值空间里做扩散，20 步解任意线性逆问题

**论文**：Denoising Diffusion Restoration Models，Bahjat Kawar、Michael Elad（Technion）、Stefano Ermon（Stanford）、Jiaming Song（NVIDIA）；NeurIPS 2022；arXiv:2201.11793（v1 2022-01-27，v3 2022-10-12）
**定位**：线性逆问题的**无监督后验采样**；对前向算子 H 做 SVD，把扩散过程搬到奇异值空间，用测量噪声 σ_y 与扩散噪声 σ_t 的相对大小决定每个奇异分量「生成 / 去噪 / 直接抄测量」；20 NFE 即可，显存靠结构化 SVD 压到 Θ(n)
**精读核验**：2026-11-22 依 arXiv HTML v3 全文读过摘要、§1–6 与附录 D/E 的相关部分（Table 1–2 主表、Table 3 的 η/η_b 消融、附录 G 的计时），摘要与 abs 页逐字核对。官方代码 `bahjat-kawar/ddrm` 的布局（`code/main.py`、`configs/`）与 commit `32b6b3c` 由本机走查记录核对。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：6 张 OOD 自然图、20 步，SR×4 与均匀去模糊两个任务，记录见[推理走查页](../../learning/infer-ddrm.html)。

## 原文摘要

> Many interesting tasks in image restoration can be cast as linear inverse problems. A recent family of approaches for solving these problems uses stochastic algorithms that sample from the posterior distribution of natural images given the measurements. However, efficient solutions often require problem-specific supervised training to model the posterior, whereas unsupervised methods that are not problem-specific typically rely on inefficient iterative methods. This work addresses these issues by introducing Denoising Diffusion Restoration Models (DDRM), an efficient, unsupervised posterior sampling method. Motivated by variational inference, DDRM takes advantage of a pre-trained denoising diffusion generative model for solving any linear inverse problem. We demonstrate DDRM's versatility on several image datasets for super-resolution, deblurring, inpainting, and colorization under various amounts of measurement noise. DDRM outperforms the current leading unsupervised methods on the diverse ImageNet dataset in reconstruction quality, perceptual quality, and runtime, being 5× faster than the nearest competitor. DDRM also generalizes well for natural images out of the distribution of the observed ImageNet training set.

*来源：arXiv:2201.11793v3 摘要，逐字照录。*

## 中文摘要

> 图像复原里很多有意思的任务都能写成线性逆问题。近来一类做法用随机算法，从「给定测量下自然图像的后验分布」中采样。但高效解法往往要对后验做任务相关的监督训练，而与任务无关的无监督方法通常依赖低效的迭代算法。本文提出去噪扩散复原模型（DDRM）来解决这一矛盾：一种高效、无监督的后验采样方法。受变分推断启发，DDRM 利用一个预训练的去噪扩散生成模型来求解任意线性逆问题。我们在多个图像数据集上展示了 DDRM 在超分、去模糊、修复和上色上的通用性，覆盖不同强度的测量噪声。在多样性更高的 ImageNet 上，DDRM 在重建质量、感知质量和运行时间上都优于当前领先的无监督方法，比最接近的竞争者快 5 倍。DDRM 对训练分布之外的自然图像也有良好泛化。

*译文：逐句对译上方英文摘要，未增删。*

## 1. 三分钟摘要与推荐理由

一句话：**把 H = UΣVᵀ 的 V 当成一组「正交坐标系」，扩散在 Vᵀx 上做；每个奇异分量看「测量在该方向的噪声 σ_y/s_i」相对「当前扩散噪声 σ_t」谁大，决定是照常生成、向测量收缩、还是直接复制测量值。**

三件值得读的事：

1. **「谱域对齐噪声」这个操作是它全部技巧的来源**：测量的噪声在奇异方向上被放大成 σ_y/s_i，于是 s_i 小（病态强）的方向自然被当成「没有信息」，交给先验生成；s_i 大（良态）的方向直接把测量值当条件。这个分派不需要任何学习或调参，只由 σ_t、σ_y、s_i 三者决定。
2. **Theorem 3.2 是「为什么能用现成 DDPM」的答案**：当 η=1、η_b = 2σ_t²/(σ_t² + σ_y²/s_i²) 时，DDRM 的 ELBO 可以改写成 DDPM/DDIM 的目标函数形式，故**不需要为每个逆问题重训**。实践中 η=0.85、η_b=1 就够了（附录 E 的敏感性表）。
3. **速度是硬指标**：20 NFE 就能出图，Table 1/2 的 NFEs 一列里 DDRM 是 20，SNIPS 是 1000、DGP 是 1500；论文自称比最接近的竞争者快 5×。附录 D 用 Kronecker 结构把 V 的存储从 Θ(n²) 压到 Θ(n)，这是「20 步能用」的工程前提。

**本页判断**：DDRM 是「快而窄」的典型——只要 H 线性且能便宜地做 SVD（或结构化 SVD），它的性价比几乎无敌；一旦 H 非线性、不可微、或 SVD 不可行（如 CT 的非平行束几何），整条路就断了。读它最大的收获是「噪声在谱域的相对大小」这个视角，而不是那 20 行代码。

## 2. 问题及研究位置

线性逆问题 y = Hx + z，z ∼ N(0, σ_y²I)，H ∈ R^{m×n}、m ≤ n。目标是从后验 p(x|y) 采样，用无条件扩散模型作先验。

已有位置：

- **任务相关监督**：SR3、Palette 一类为固定退化训练条件模型，效果最好但不能换任务。
- **无监督迭代**：DGP、RED、SNIPS 用扩散/去噪先验做优化或 Langevin，往往要 100–1500 NFE，且对噪声敏感。
- **本文**：把变分后验 q 设计成在 V 的坐标系里逐分量成立的「高斯边缘」族（Proposition 3.1），于是采样只是逐分量的闭式更新，天然对齐测量噪声。

## 3. 核心方法和数据流

```text
输入：测量 y、H 的 SVD (U, Σ, V)、噪声 σ_y、噪声表 σ_1<…<σ_T、η、η_b
ȳ = Σ⁺Uᵀy                          # 把测量投到谱域
x̄_T 逐分量初始化：
    s_i > 0 : N(ȳ_i, σ_T² − σ_y²/s_i²)
    s_i = 0 : N(0, σ_T²)
for t = T−1 … 0:
    x̂_{θ,t} = 一步去噪(x_{t+1})        # 预训练 DDPM/DDIM，输出 x₀ 的估计
    x̄_{θ,t} = Vᵀ x̂_{θ,t}
    for 每个分量 i:
        s_i = 0                     → N(x̄_θ,i + √(1−η²)σ_t(x̄_{t+1,i}−x̄_θ,i)/σ_{t+1}, η²σ_t²)
        σ_t < σ_y/s_i               → N(x̄_θ,i + √(1−η²)σ_t(ȳ_i−x̄_θ,i)/(σ_y/s_i), η²σ_t²)
        σ_t ≥ σ_y/s_i               → N((1−η_b)x̄_θ,i + η_b ȳ_i, σ_t² − (σ_y²/s_i²)η_b²)
    x_t = V x̄_t
输出：x₀
```

三点解释：

1. **三种情形对应三种「信谁」**：s_i=0 是测量完全没覆盖的方向 → 纯生成；σ_t < σ_y/s_i 表示此刻扩散噪声比测量噪声还小 → 用测量做「温和收缩」但保留扩散方差；σ_t ≥ σ_y/s_i 表示测量在该方向更准 → 直接把 x̂₀ 与 ȳ 按 η_b 插值，方差也按测量噪声扣掉。
2. **η 与 η_b**：η 控制每步注入的随机性（η=1 时随机性最大，也是 Theorem 3.2 成立的条件）；η_b∈[0,1] 控制「抄测量」的比例。附录 E 的 4×4 网格显示 η_b 越大 PSNR 越高、KID 越低；η 越大 PSNR 越高但 KID 变差，形成取舍；实践取 η=0.85、η_b=1。
3. **加速与显存**：σ_{1:T} 取预训练模型 1000 步的一个子集即可（这与 DDIM 跳步同理），所以 20 步可行；对去噪、修复、超分、去模糊、上色这五类 H，用 Kronecker/置换结构把 U、V 的作用写成「两次小矩阵乘 + 置换」，显存 Θ(n)（附录 D）。

## 4. 论文证据与实验范围

**设定**：ImageNet 256 验证集 1k 张（主表），模型来自 Dhariwal & Nichol 的无条件/类条件 ADM；另用 CelebA-HQ / LSUN 模型测 FFHQ 与网络图片（定性 + 附录）。任务：4× 超分（平均池化与 bicubic 两种）、均匀核去模糊、box/随机修复、灰度上色；噪声分 σ_y=0 与 σ_y=0.05 两档。

**Table 1（无噪，ImageNet 1k，PSNR↑/SSIM↑/KID↓/NFE↓）**：

| 任务 | DDRM | DDRM-CC | 最强基线 |
|---|---|---|---|
| 4× SR（池化） | 26.55 / 0.72 / 7.22 / 20 | 26.55 / 0.74 / **6.56** / 20 | RED 26.08 / 0.73 / 53.55 / 100 |
| 去模糊 | 35.64 / 0.95 / 0.71 / 20 | 35.65 / 0.96 / **0.70** / 20 | SNIPS 34.32 / 0.87 / 0.49 / 1000 |

**Table 2（σ_y=0.05，ImageNet 1k）**：

| 任务 | DDRM | DDRM-CC | 基线表现 |
|---|---|---|---|
| 4× SR | 25.21 / 0.66 / 12.43 | **25.22 / 0.67 / 10.82** | RED 22.90 / 0.49 / 43.45（100 NFE） |
| 去模糊 | 25.45 / 0.66 / 15.24 | **25.46 / 0.67 / 13.49** | DGP 21.20 / 0.45 / 34.02（1500 NFE）、SNIPS 16.37 / 0.14 |

**其它结论**：去模糊上「直接对模糊图取伪逆」得 32.41 dB，DDRM-CC 35.65 dB（附录 D.5）；有噪时伪逆会放大噪声，故不报；ImageNet 模型在 USC-SIPI 的分布外图上仍可用（Figure 6）；修复与上色只给定性结果（Figure 1/3/5）。

**范围限制（本页判断）**：只在 2D 自然图像上验证；线性 H 是硬前提；主表只报 PSNR/SSIM/KID，没有下游或病灶级评估；「5× 更快」是对比无监督基线的 NFE，不含 SVD 的一次性成本；KID 在 1k 张上本身噪声不小。

## 5. 复现与审计重点

**本站推理走查（小样本，用作者权重，非论文指标复现；完整记录见[走查页](../../learning/infer-ddrm.html)）**：

- **跑法**：官方仓库 `bahjat-kawar/ddrm` @ `32b6b3c`，权重为 openaipublic 的 `256x256_diffusion_uncond.pt`（2.1 GB，ADM 无条件 ImageNet 256）；数据用 README 指定的 `jiamings/ddrm-exp-datasets` 里 6 张 256×256 OOD 图（非 ImageNet val 全集）。20 步，`--eta 0.85 --etaB 1`。
- **结果**：SR×4（平均池化，σ₀=0.05）6 张平均 **24.49 dB**；均匀 3×3 去模糊（σ₀=0.0）**38.24 dB**。每张图都留了原图 / 退化观测 / 复原三件套。
- **改动**：只新增一个 config 副本 `imagenet_256_ood.yml`（把数据源从 1k 清单切到 out-of-dist 的 6 张图），算法与超参未改；环境换 torch 2.1.2+cu118（官方 environment.yml 是 1.10.1+cu113，4090 上不稳）。
- **没跑**：ImageNet 1k 全量评测、FID/KID/LPIPS（缺 inception 统计与全量数据）、CelebA-HQ 分支、修复与上色。
- **读法**：这两条数字只能说明「管线跑通、去模糊接近原图、SR 恢复轮廓」，不能与 Table 1/2 对照。

其余审计要点：

- **η 的默认值在代码里**：README 用 0.85/1，而 Theorem 3.2 的等价性要求 η=1；论文没有解释 0.85 与理论的差距，复现时要按任务试 η∈{0.7…1.0}（附录 E 的表就是这件事）。
- **SVD 成本被排除在 NFE 之外**：Table 1/2 只数网络前向，实际部署时 H 的 SVD 可能是主要开销；只有附录 D 的五类 H 有 Θ(n) 解法。
- **噪声表选择影响大**：σ_{1:T} 取子集就等价于换了一套离散化，附录 E 有 20 步 vs 100 步的对比，不能只看 20 步的最优值。
- **KID 的量级**：KID×10³ 在小样本上方差大，DDRM 与 DDRM-CC 在无噪 SR 上 KID 差 0.66，不宜过度解读。

## 6. 建议阅读顺序

摘要 → §3.1 变分目标 → §3.2 式 4/5（三种情形的 q）+ Proposition 3.1 → §3.3 Theorem 3.2（与 DDPM 目标的等价）→ §3.4/3.5（跳步与省显存 SVD）→ §5 Table 1/2 → 附录 D（五类 H 的结构化 SVD）→ 附录 E（η、η_b、步数消融）→ 附录 G（NFE 与真实耗时）。

## 7. 前后关联

- 与 [28 号 DPS](28-dps.md) 是同一问题的两条路线：DDRM 把噪声对齐搬到谱域、20 步搞定但要 SVD；DPS 不碰 SVD、对 x̂₀ 求梯度，代价是 1000 NFE 且需按任务调步长。
- 与 [30 号 ΠGDM](30-pigdm.md) 直接对话：ΠGDM 指出重建引导用 Hᵀ 而非 H^†，在奇异值不全为 0/1 时（去模糊、bicubic 超分）明显更差，Table 5 里 ΠG 把去模糊 PSNR 从 20.97 提到 39.36；DDRM 的谱域做法在概念上是「另一条把伪逆用对的路」。
- 与 [31 号 DAPS](31-daps.md)：DAPS 的 Table 7 把 DDRM 作为 20 NFE / 2 s 的参照点，说明「快」和「非线性任务稳」不可兼得。
- 与 [02 号 DDPM](02-ddpm.md)、[03 号 DDIM](03-ddim.md) 是上下游：DDRM 的采样器就是把 DDIM 的更新逐分量改写成条件高斯，Theorem 3.2 说明两者目标同构。
- 与 [04 号 Score-SDE](04-score-sde.md) 对照：DDRM 用的是「方差爆炸」参数化的等价形式（附录 B 给出与 VP 的线性变换关系）。
- 医学侧见 [20 号 DDS](../mri/20-dds.md)：DDS 同样在「分解式扩散」里把算子结构写进采样，但面向 CT/MRI 的多线圈与投影几何，不能用 SVD 一条路走完。

## 8. 链接

- [arXiv:2201.11793（abs）](https://arxiv.org/abs/2201.11793)
- [arXiv HTML v3 全文](https://arxiv.org/html/2201.11793v3)
- [官方代码 bahjat-kawar/ddrm](https://github.com/bahjat-kawar/ddrm)
- [项目页 ddrm-ml.github.io](https://ddrm-ml.github.io/)
- [走查用 OOD 图集 jiamings/ddrm-exp-datasets](https://github.com/jiamings/ddrm-exp-datasets)
