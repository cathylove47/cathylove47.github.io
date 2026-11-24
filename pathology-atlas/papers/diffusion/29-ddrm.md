# 29｜DDRM：在 $H$ 的奇异值空间里做扩散，20 步解任意线性逆问题

**论文**：Denoising Diffusion Restoration Models，Bahjat Kawar、Michael Elad（Technion）、Stefano Ermon（Stanford）、Jiaming Song（NVIDIA）；NeurIPS 2022；arXiv:2201.11793（v1 2022-01-27，v3 2022-10-12）
**定位**：线性逆问题的**无监督后验采样**；对前向算子 $H$ 做 SVD，把扩散过程搬到奇异值空间，用测量噪声 $\sigma_y$ 与扩散噪声 $\sigma_t$ 的相对大小决定每个奇异分量「纯生成 / 温和收缩 / 直接抄测量」；20 NFE 即可，显存靠结构化 SVD 压到 $\Theta(n)$
**精读核验**：2026-11-22 依 arXiv HTML v3 全文读过摘要、§1–6 与附录 D/E 的相关部分（Table 1–2 主表、Table 3 的 $\eta/\eta_b$ 消融、附录 G 的计时），摘要与 abs 页逐字核对。官方代码 `bahjat-kawar/ddrm` 的布局（`code/main.py`、`configs/`）与 commit `32b6b3c` 由本机走查记录核对。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：6 张 OOD 自然图、20 步，SR×4 与均匀去模糊两个任务，记录见[推理走查页](../../learning/infer-ddrm.html)。

## 原文摘要

> Many interesting tasks in image restoration can be cast as linear inverse problems. A recent family of approaches for solving these problems uses stochastic algorithms that sample from the posterior distribution of natural images given the measurements. However, efficient solutions often require problem-specific supervised training to model the posterior, whereas unsupervised methods that are not problem-specific typically rely on inefficient iterative methods. This work addresses these issues by introducing Denoising Diffusion Restoration Models (DDRM), an efficient, unsupervised posterior sampling method. Motivated by variational inference, DDRM takes advantage of a pre-trained denoising diffusion generative model for solving any linear inverse problem. We demonstrate DDRM's versatility on several image datasets for super-resolution, deblurring, inpainting, and colorization under various amounts of measurement noise. DDRM outperforms the current leading unsupervised methods on the diverse ImageNet dataset in reconstruction quality, perceptual quality, and runtime, being 5× faster than the nearest competitor. DDRM also generalizes well for natural images out of the distribution of the observed ImageNet training set.

*来源：arXiv:2201.11793v3 摘要，逐字照录。*

## 中文摘要

> 图像复原里很多有意思的任务都能写成线性逆问题。近来一类做法用随机算法，从「给定测量下自然图像的后验分布」中采样。但高效解法往往要对后验做任务相关的监督训练，而与任务无关的无监督方法通常依赖低效的迭代算法。本文提出去噪扩散复原模型（DDRM）来解决这一矛盾：一种高效、无监督的后验采样方法。受变分推断启发，DDRM 利用一个预训练的去噪扩散生成模型来求解任意线性逆问题。我们在多个图像数据集上展示了 DDRM 在超分、去模糊、修复和上色上的通用性，覆盖不同强度的测量噪声。在多样性更高的 ImageNet 上，DDRM 在重建质量、感知质量和运行时间上都优于当前领先的无监督方法，比最接近的竞争者快 5 倍。DDRM 对训练分布之外的自然图像也有良好泛化。

*译文：逐句对译上方英文摘要，未增删。*

## 1. 三分钟摘要与推荐理由

> [!IMPORTANT] 一句话直觉
> 用 SVD 把耦合在一起的逆问题拆成一堆互不干扰的独立频道 $\bar{y}_i = \bar{x}_i + z_i/s_i$，再在每个时间步比大小：**「当前扩散噪声 $\sigma_t$」和「测量等效噪声 $\sigma_y/s_i$」谁更吵，就少听谁的。**

三件值得读的事：

1. **「谱域对齐噪声」是整篇论文最巧妙的一步**：在奇异值坐标系下，第 $i$ 个方向的测量噪声被放大成 $\sigma_y/s_i$。奇异值 $s_i$ 小（病态强）的方向等效噪声极大，自然交给扩散先验生成；$s_i$ 大的方向测量极准，直接抄测量并把多余噪声扣掉。这套分派完全由 $\sigma_t$、$\sigma_y$、$s_i$ 三者自动决定，不需要重新训练或手调学习率。
2. **Theorem 3.2 回答了「为什么能直接拿现成 DDPM 来用」**：当 $\eta=1$、$\eta_b = 2\sigma_t^2 / (\sigma_t^2 + \sigma_y^2/s_i^2)$ 时，DDRM 的变分下界（ELBO）目标可以改写成标准 DDPM/DDIM 的训练目标形式，因此**无需为每个逆问题重训**。实践中取 $\eta=0.85$、$\eta_b=1$ 效果已足够好（附录 E 敏感性表）。
3. **20 步出图的速度优势**：Table 1/2 中 DDRM 只需 **20 NFE**（SNIPS 需 1000、DGP 需 1500）；论文自称比最接近的无监督竞争者快 $5\times$。附录 D 利用 Kronecker/置换结构把 $V$ 的显存与计算压到 $\Theta(n)$，是这 20 步能落地的工程前提。

> [!WARNING] 本页判断
> DDRM 是「快而窄」的典型——只要算子 $H$ 线性且能便宜地做 SVD（或结构化 SVD），性价比几乎无敌；一旦 $H$ 非线性、或无法写出解析/结构化 SVD（例如多线圈 MRI 或非平行束 3D CT），整条路就断了。读它最大的收获是「测量噪声在谱域相对 $\sigma_t$ 的大小」这一视角，而不只是记住它的采样公式。

## 2. 问题及研究位置

研究对象为线性逆问题：

$$y = Hx + z,\qquad z \sim \mathcal{N}(0, \sigma_y^2 I),\qquad H \in \mathbb{R}^{m\times n}\ (m \le n)$$

目标是使用现成的无条件扩散模型作先验，从后验分布 $p(x \mid y)$ 中采样，而不是只求一个平均模糊的回归解。

已有工作的位置与局限：

- **任务相关监督路线**：如 SR3、Palette 等针对固定退化 $H$ 专门训练条件模型，精度高但换一个模糊核或采样方式就得重训。
- **无监督迭代路线**：如 DGP、RED、SNIPS 直接借助扩散或去噪先验做优化 / Langevin 采样，虽然通用但通常需要 $100\text{–}1500$ NFE，且对测量噪声敏感。
- **本文定位**：把变分后验 $q$ 显式构造在 $H$ 的右奇异向量 $V$ 坐标系下逐分量成立的高斯边缘族（Proposition 3.1），使每步采样化简为逐分量的闭式更新，天然对齐测量噪声尺度。

## 3. 核心方法和数据流

### 3.1 为什么突然冒出 $\bar{y}_i$ 和 $\sigma_y / s_i$？

在原始像素空间里，矩阵 $H$ 把各个像素耦合在一起，改一个像素会影响很多观测值。DDRM 先对 $H$ 做奇异值分解 $H = U\Sigma V^T$，把图像转成谱域坐标 $\bar{x} = V^T x$，把测量转成 $\tilde{y} = U^T y$。因为 $U, V$ 都是正交矩阵（不改变高斯噪声分布），原本耦合的矩阵方程瞬间解体成互相独立的 1 维等式 $\tilde{y}_i = s_i \bar{x}_i + z_i$（其中 $s_i = \Sigma_{i,i}$，$z_i \sim \mathcal{N}(0, \sigma_y^2)$）。

对 $s_i > 0$ 的分量两边同时除以奇异值 $s_i$，就得到整个方法最核心的等价式：

$$\bar{y}_i \triangleq \frac{\tilde{y}_i}{s_i} = \bar{x}_i + \frac{z_i}{s_i}, \qquad \frac{z_i}{s_i} \sim \mathcal{N}\!\left(0,\, \frac{\sigma_y^2}{s_i^2}\right)$$

> [!TIP] 两句话看懂这个除法
> 1. $\bar{y}_i$（即 $\Sigma^+ U^T y$ 的第 $i$ 维）就是**直接从测量硬反推出来的第 $i$ 个频道信号**；
> 2. $s_i$ 越小的病态方向，除以一个极小数会把物理测量噪声放大成 $\sigma_y / s_i$——这让每个频道「测量有多靠谱」变得一目了然。

### 3.2 采样数据流

```pipeline
1. 算子谱分解 | 计算前向算子 SVD $H = U\Sigma V^T$，将测量投影并缩放到谱域 $\bar{y} = \Sigma^+ U^T y$
2. 谱域初始化 | 对 $s_i > 0$ 分量以 $\mathcal{N}(\bar{y}_i,\, \sigma_T^2 - \sigma_y^2/s_i^2)$ 初始化，对 $s_i = 0$ 未观测分量用 $\mathcal{N}(0,\, \sigma_T^2)$
3. 单步去噪投影 | 调预训练 DDPM/DDIM 预测当前干净图像 $\hat{x}_{\theta,t}$，转入右奇异坐标系 $\bar{x}_{\theta,t} = V^T \hat{x}_{\theta,t}$
4. 逐分量噪声比决策 | 对比扩散噪声 $\sigma_t$ 与测量等效噪声 $\sigma_y/s_i$，决定纯生成、温和收缩或直接抄测量，最后经 $x_t = V\bar{x}_t$ 返回图像域
```

### 3.3 关键一步：逐分量决定「信扩散还是信测量」

在时间步 $t$（当前扩散噪声标准差为 $\sigma_t$），对第 $i$ 个奇异分量按三种情形分别采样 $\bar{x}_{t,i}$：

| 频道条件 | 物理含义 | 均值中心（听谁的） | 方差怎么配（借花献佛） |
|---|---|---|---|
| $s_i = 0$ | 扫描完全没覆盖该方向 | 以网络预测 $\bar{x}_{\theta,i}$ 为主，沿 DDIM 方向推进 | 标准扩散随机方差 $\eta^2\sigma_t^2$ |
| $\sigma_t < \frac{\sigma_y}{s_i}$ | 扩散图已比测量更干净 | 在 $\bar{x}_{\theta,i}$ 基础上按 $\frac{\sqrt{1-\eta^2}\,\sigma_t}{\sigma_y/s_i}(\bar{y}_i - \bar{x}_{\theta,i})$ 温和拉近测量，避免直接抄入噪声 | 保留 $\eta^2\sigma_t^2$ |
| $\sigma_t \ge \frac{\sigma_y}{s_i}$ | 测量比当前扩散图更准 | 直接插值 $(1-\eta_b)\bar{x}_{\theta,i} + \eta_b \bar{y}_i$（常取 $\eta_b=1$ 直接抄 $\bar{y}_i$） | 仅补差值方差 $\sigma_t^2 - \eta_b^2\frac{\sigma_y^2}{s_i^2}$，**把测量自带噪声直接充当扩散噪声** |

### 3.4 两个超参（$\eta, \eta_b$）与工程加速

- **$\eta \in [0,1]$ 与 $\eta_b \in [0,1]$**：$\eta$ 控制每步额外注入的随机性（$\eta=1$ 时随机性最大，也是 Theorem 3.2 理论等价性严格成立的条件）；$\eta_b$ 控制「抄测量」的权重。附录 E 的 $4\times 4$ 网格实验表明：$\eta_b$ 越大 PSNR 越高、KID 越低；$\eta$ 越大 PSNR 越高但 KID 变差。实践默认取 $\eta=0.85$、$\eta_b=1$。
- **20 步加速与 $\Theta(n)$ 显存**：时间表 $\sigma_{1:T}$ 直接取预训练 1000 步模型的一个 20 步子集（与 DDIM 跳步同理）。对于**去噪、修复、超分、去模糊、上色**这五类结构化算子，附录 D 利用 Kronecker 乘积与置换把 $U, V$ 写成「两次小矩阵乘 + 重排」，无需显式构造 $n\times n$ 矩阵，把显存压到 $\Theta(n)$。

> [!WARNING] 为什么多线圈 MRI / 3D CT 用不了 DDRM？
> 多线圈 MRI 的前向算子包含多套空间灵敏度图（$H = M\mathcal{F}S$），3D CT 包含非平行束投影几何——它们都无法套用 Kronecker 结构化 SVD，显式分解百万维矩阵又完全算不动。这正是后来 [20 号 DDS](../mri/20-dds.md) 改用「干净估计上跑几步 CG（只需算 $H$ 和 $H^*$，不需要 SVD）」的直接原因。

## 4. 论文证据与实验范围

**设定**：ImageNet 256 验证集 1k 张（主表），模型来自 Dhariwal & Nichol 的无条件 / 类条件 ADM；另用 CelebA-HQ / LSUN 模型测 FFHQ 与网络图片（定性 + 附录）。任务覆盖 $4\times$ 超分（平均池化与 bicubic 两种）、均匀核去模糊、box/随机修复、灰度上色；噪声分 $\sigma_y=0$ 与 $\sigma_y=0.05$ 两档。

**Table 1（无噪 $\sigma_y = 0$，ImageNet 1k，$\text{PSNR}\uparrow / \text{SSIM}\uparrow / \text{KID}\downarrow / \text{NFE}\downarrow$）**：

| 任务 | DDRM | DDRM-CC | 最强基线 |
|---|---|---|---|
| $4\times$ SR（池化） | 26.55 / 0.72 / 7.22 / 20 | 26.55 / 0.74 / **6.56** / 20 | RED 26.08 / 0.73 / 53.55 / 100 |
| 去模糊 | 35.64 / 0.95 / 0.71 / 20 | 35.65 / 0.96 / **0.70** / 20 | SNIPS 34.32 / 0.87 / 0.49 / 1000 |

**Table 2（含噪 $\sigma_y = 0.05$，ImageNet 1k）**：

| 任务 | DDRM | DDRM-CC | 基线表现 |
|---|---|---|---|
| $4\times$ SR | 25.21 / 0.66 / 12.43 | **25.22 / 0.67 / 10.82** | RED 22.90 / 0.49 / 43.45（100 NFE） |
| 去模糊 | 25.45 / 0.66 / 15.24 | **25.46 / 0.67 / 13.49** | DGP 21.20 / 0.45 / 34.02（1500 NFE）、SNIPS 16.37 / 0.14 |

**其它结论**：去模糊上「直接对模糊图取伪逆」得 32.41 dB，DDRM-CC 达 35.65 dB（附录 D.5）；有噪时伪逆会放大噪声，故不报；ImageNet 模型在 USC-SIPI 的分布外图上仍可用（Figure 6）；修复与上色只给定性结果（Figure 1/3/5）。

**范围限制（本页判断）**：只在 2D 自然图像上验证；线性 $H$ 是硬前提；主表只报 PSNR/SSIM/KID，没有下游任务或病灶级评估；「$5\times$ 更快」是对比无监督基线的 NFE，不含 SVD 的一次性成本；KID 在 1k 张上本身噪声不小。

## 5. 复现与审计重点

**本站推理走查（小样本，用作者权重，非论文指标复现；完整记录见[走查页](../../learning/infer-ddrm.html)）**：

- **跑法**：官方仓库 `bahjat-kawar/ddrm` @ `32b6b3c`，权重为 openaipublic 的 `256x256_diffusion_uncond.pt`（2.1 GB，ADM 无条件 ImageNet 256）；数据用 README 指定的 `jiamings/ddrm-exp-datasets` 里 6 张 256×256 OOD 图（非 ImageNet val 全集）。20 步，`--eta 0.85 --etaB 1`。
- **结果**：$\text{SR}\times 4$（平均池化，$\sigma_0=0.05$）6 张平均 **24.49 dB**；均匀 3×3 去模糊（$\sigma_0=0.0$）**38.24 dB**。每张图都留了原图 / 退化观测 / 复原三件套。
- **改动**：只新增一个 config 副本 `imagenet_256_ood.yml`（把数据源从 1k 清单切到 out-of-dist 的 6 张图），算法与超参未改；环境换 torch 2.1.2+cu118（官方 `environment.yml` 是 1.10.1+cu113，4090 上不稳）。
- **没跑**：ImageNet 1k 全量评测、FID/KID/LPIPS（缺 inception 统计与全量数据）、CelebA-HQ 分支、修复与上色。
- **读法**：这两条数字只能说明「管线跑通、去模糊接近原图、SR 恢复轮廓」，不能与 Table 1/2 对照。

其余审计要点：

- **$\eta$ 的默认值在代码里**：README 用 $0.85 / 1$，而 Theorem 3.2 的等价性要求 $\eta=1$；论文没有解释 $0.85$ 与理论的差距，复现时要按任务试 $\eta \in \{0.7 \dots 1.0\}$（附录 E 的表就是这件事）。
- **SVD 成本被排除在 NFE 之外**：Table 1/2 只数网络前向，实际部署时 $H$ 的 SVD 可能是主要开销；只有附录 D 的五类 $H$ 有 $\Theta(n)$ 解法。
- **噪声表选择影响大**：$\sigma_{1:T}$ 取子集就等价于换了一套离散化，附录 E 有 20 步 vs 100 步的对比，不能只看 20 步的最优值。
- **KID 的量级**：$\text{KID}\times 10^3$ 在小样本上方差大，DDRM 与 DDRM-CC 在无噪 SR 上 KID 差 0.66，不宜过度解读。

## 6. 建议阅读顺序

摘要 → §3.1 变分目标 → §3.2 式 (4)(5)（三种情形的 $q$）+ Proposition 3.1 → §3.3 Theorem 3.2（与 DDPM 目标的等价）→ §3.4/3.5（跳步与省显存 SVD）→ §5 Table 1/2 → 附录 D（五类 $H$ 的结构化 SVD）→ 附录 E（$\eta$、$\eta_b$、步数消融）→ 附录 G（NFE 与真实耗时）。

## 7. 前后关联

- 与 [28 号 DPS](28-dps.md) 是同一问题的两条路线：DDRM 把噪声对齐搬到谱域、20 步搞定但要 SVD；DPS 不碰 SVD、对 $\hat{x}_0$ 求梯度，代价是 1000 NFE 且需按任务调步长。
- 与 [30 号 ΠGDM](30-pigdm.md) 直接对话：ΠGDM 指出重建引导用 $H^T$ 而非 $H^\dagger$，在奇异值不全为 $0/1$ 时（去模糊、bicubic 超分）明显更差，Table 5 里 ΠG 把去模糊 PSNR 从 20.97 提到 39.36；DDRM 的谱域做法在概念上是「另一条把伪逆用对的路」。
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
