# 24｜Weak Priors：先验很弱，为什么逆问题还能解得好

**论文**：Weak Diffusion Priors Can Still Achieve Strong Inverse-Problem Performance，Jing Jia、Wei Yuan、Sifan Liu、Liyue Shen、Guanyang Wang（Rutgers 计算机系/统计系、Duke 统计科学系、Michigan EECS）；ICML 2026（Spotlight）；arXiv:2601.22443（v1 2026-01-30，v2 2026-06-02）
**定位**：系统解释「弱扩散先验」（少步采样器、跨域训练）为何在测量信息量大的逆问题里仍能工作；贝叶斯后验集中理论 + 空间自相关诊断 + 初始噪声优化
**精读核验**：2026-11-22 依 arXiv HTML v2 全文（§1–5、Appendix A–D，Table 1–19、Figure 1–4）逐节读过，并用 OpenReview 记录核对录用信息（ICML 2026 spotlight，forum `fdkSA4F0lN`）。官方代码 `jjia131/weak-diffusion-priors-inverse-problem` 同日经 GitHub API 核对：有真实实现（`weak_recon.py`、`dps_recon.py`、`dmplug_recon.py`、`stable_recon.py`、`dit_recon.py`、`src/`、`util/`、四个任务配置），最后推送 2026-01-29；仓库不含权重与评测脚本，权重走 Hugging Face `google/ddpm-{church,bedroom,celebahq}-256`。**本站未运行任何代码、未复现实验**，数字全部为论文报告值。

## 原文摘要

> Can a diffusion model trained on bedrooms recover human faces? Diffusion models are widely used as priors for inverse problems, but standard approaches usually assume a high-fidelity model trained on data that closely match the unknown signal. In practice, one often must use a mismatched or low-fidelity diffusion prior. Surprisingly, these weak priors often perform nearly as well as full-strength, in-domain baselines. We study when and why inverse solvers are robust to weak diffusion priors. Through extensive experiments, we find that weak priors succeed when measurements are highly informative (e.g., many observed pixels), and we identify regimes where they fail. To explain this behavior, we combine Bayesian-consistency theory with local-correlation analysis: the theory gives conditions under which high-dimensional measurements make the posterior concentrate near the true signal, while the correlation analysis shows that weak and stronger natural-image priors can share similar local spatial structure. These results provide a principled justification on when weak diffusion priors can be used reliably. Code is available at https://github.com/jjia131/weak-diffusion-priors-inverse-problem.

*来源：arXiv:2601.22443 摘要页，与 HTML 版逐字一致。*

## 中文摘要

> 一个只在卧室图像上训练的扩散模型，能恢复人脸吗？扩散模型被广泛用作逆问题的先验，但标准做法通常假设模型高保真、且训练数据与待恢复信号高度匹配。实践中却常常只能拿到不匹配或低保真的扩散先验。令人意外的是，这些弱先验的表现往往接近甚至不输全强度、同分布基线。本文研究逆问题求解器在什么条件下、为什么对弱扩散先验具有鲁棒性。通过大量实验，我们发现弱先验在测量信息量高（例如观测到大量像素）时能够成功，并识别出它们失败的区间。为解释这一现象，我们把贝叶斯一致性理论与局部相关性分析结合起来：理论给出高维测量使后验集中在真值附近的条件，相关性分析则表明弱先验与更强的自然图像先验可以共享相似的局部空间结构。这些结果为「何时可以可靠地使用弱扩散先验」提供了有原则的依据。代码见 https://github.com/jjia131/weak-diffusion-priors-inverse-problem。

*译文：逐句对译上方摘要，未增删内容；专有名词与链接保留原文。*

## 1. 三分钟摘要与推荐理由

论文把「先验弱」拆成两个独立轴：**生成器质量**（只跑 1–4 步 DDIM，无条件样本糊）与**域匹配**（源域训练、目标域重建，比如卧室模型修人脸）。核心结论是一个条件句：只要测量提供足够多的局部锚点，后验会被数据拉向同一个与测量一致的模态，此时先验好坏只影响常数项；再加上自然图像的弱先验仍保留与强先验几乎相同的短程空间相关性，足以把观测约束向未观测像素传播。反过来，大块 box inpainting、16× 超分、强噪声这些「测量锚点太少」的场景，弱先验会明显崩掉。

推荐理由有三条：

1. **它把「先验不匹配还能用」从个案观察升级成了可检验的机制**：后验集中度随有效测量维数 $m$ 指数下降（$CMe^{-m\delta_0}$），且界只通过常数依赖先验权重。这正好对上医学逆问题里「没有域内数据也能凑合用外域先验」的经验。
2. **给出了一个便宜的诊断量**：无条件样本的空间自相关曲线。跨域先验的这条曲线若与强先验高度重合（Table 2 里最低相关也有 0.9965），就说明它仍可当条件先验用。
3. **它同时给出失败边界**，而且失败模式与「测量信息量」直接挂钩，不是含糊的「域差大就不好」。

**与幻觉问题的关系（本页判断）**：这篇不研究幻觉，但它解释了「测量信息量高时先验说不上话」——这既是弱先验能用的原因，也是幻觉难以被先验纠正的原因；反过来在低信息区间（大遮挡、强噪声），弱先验会填入与目标语义不符的结构（Figure 3 上排把教堂补出人脸状区域），正是幻觉的典型形态。对本页读者，它是理解「Ellipses 训练的先验为何还能重建真实 CT」的最直接理论框架：见第 7 节。

## 2. 问题及研究位置

标准扩散逆问题范式假设「全强度 + 同分布」先验：1000 步 DDPM、训练分布与目标一致，然后把测量信息注入反向链（DPS、DDRM、ΠGDM 等）。现实中这个前提经常不成立：初始噪声优化类方法为了省显存只能截断到 3 步 DDIM；医学、科学成像没有足够数据训练域内模型，只能借别的域的预训练权重。

已有观察是零散的：DMPlug 用 3 步 DDIM 仍比强基线高 2–6 dB；Jalal et al. 用 2D 脑 MRI 先验重建膝、腹部。缺的是「什么时候行、为什么行」的系统回答。

本文的位置：不提出新的采样器，而是把「弱先验」形式化，给出后验集中理论、空间统计诊断、失败区间，并把初始噪声优化打磨成可用算法（AdamSphere + HoldoutTopK）。实验全部在自然图像（CelebA-HQ、LSUN Bedroom、LSUN Church、ImageNet）与 InverseBench 科学逆问题上，**没有医学实验**。

## 3. 核心方法和数据流

```text
输入：观测 y = A x + ε，前向算子 A（inpainting / 高斯模糊 / 4× 超分 / 非线性模糊）
先验：G = k 步 DDIM（k=3），DDPM 权重可来自源域 S（S 可 ≠ 目标域 T）

初始噪声优化（INO）：
  z ~ N(0, I_d)，约束到典型球壳 ‖z‖ ≈ √d
  重复 1000 次：
    x̂ = G(z)                       # 3 步 DDIM，反传穿过整条短链
    loss = ‖A x̂ − y‖²               # 只用 MSE，不加额外正则
    z ← AdamSphere 更新（每步投影回球壳）
    每轮记录留出测量的 loss
  输出：HoldoutTopK 早停 —— 在留出集 loss 最好的 K 个迭代里取最晚的一个
```

两个设计点：

1. **AdamSphere**：扩散模型训练时 $z\sim N(0,I_d)$ 的质量集中在半径 $\sqrt d$ 的球壳上，无约束优化会把 $z$ 推离球壳、生成质量下降；因此每步把更新后的 $z$ 归一化回球壳，同时不再需要方差正则，只优化 MSE（式 2）。
2. **HoldoutTopK 早停**：留出一部分测量不参与优化，用它的 loss 选检查点；不像常规做法只取最小值的单个迭代，而是保留最好的 $K$ 个并返回其中**最晚**的一个，降低对噪声波动的敏感度。

理论部分（§3.2）：把先验建模为各向同性高斯混合 $\pi=\sum_j w_j\varphi(x;\mu_j,\tau^2I)$，不同先验对应不同权重 $\{w_j\}$。后验权重 $w_j\varphi(y;A\mu_j,\Sigma)$ 由「测量残差得分」$s_j(y)=\frac12\|\Sigma^{-1/2}(y-A\mu_j)\|^2$ 决定；只要最优分量以每维间隔 $\delta_0$ 可辨识，选错分量的概率 $\le CMe^{-\delta_0 m}$。由于 $m$ 是测量维数，观测越多，先验权重越只影响常数。inpainting 下该得分正比于观测像素上的 MSE，超分下也差一个常数因子——这解释了为什么直接最小化 MSE 就够了。

诊断部分（§3.3）：对无条件样本算空间自相关 $C_x(r)$，比较 CelebA-HQ / Bedroom 各自 3 步 / 20 步的四条曲线。

## 4. 论文证据与实验范围

**设置**：256×256，100 张测试图（消融 50 张）；inpainting 随机遮 70% 像素，高斯模糊核 61、强度 3，超分 4×，非线性模糊用 BKSE 的 GoPro 波模型；所有测量加 $\sigma=0.01$ 高斯噪声；DPS 用 1000 步，INO 用 3 步 DDIM × 1000 次优化；inpainting 学习率 0.02，超分 0.01。

**跨域主结果（Table 3）**：inpainting 目标 CelebA 时，DPS 同分布 31.98 dB，3 步同域 33.78，卧室先验 32.76，教堂先验 32.62；目标 Bedroom 时 DPS 27.97，同域 28.88，教堂 28.66，人脸 27.78；目标 Church 时 DPS 24.15，同域 24.93，卧室 24.22，人脸 23.56。4× 超分差距更大：CelebA 上 DPS 26.82 vs 同域 31.27、卧室 30.34、教堂 30.10。作者自己的读法是「域不匹配有影响，但当源域与目标域视觉上接近时影响不大」——卧室↔教堂常打平，人脸与它们差得远。

**与 DMPlug 对比（Table 4，同域 3 步先验、同初始噪声）**：inpainting CelebA 33.784 vs 32.778，Bedroom 28.883 vs 28.271，Church 24.927 vs 24.957（持平）；非线性去模糊三套数据均小胜。**消融（Table 5，PSNR）**：高斯模糊 Church 上，Adam+方差 22.034、Adam+HoldoutTopK 22.394、AdamSphere+方差 22.048、AdamSphere+HoldoutTopK 22.404——增益几乎全来自 HoldoutTopK，Bedroom 同样 24.825→25.596；inpainting 的增益更小（28.669→29.162）。

**机制证据**：Table 1 用 100 张目标图统计随机 inpainting 的每维得分间隔，CelebA 均值 0.22（标准差 0.06）、最小 0.11，支持「可辨识」假设；Table 2 的四条自相关曲线在 lag 1 都在 0.955–0.981，lag 32 在 0.267–0.348，3 步 Bedroom 与 20 步 CelebA 的相关系数 0.9987（Table 14 全矩阵最低 0.9965）。

**失败区间（Table 12，box inpainting，目标 Church）**：0.3×0.3 遮挡时同域 25.28 略高于 DPS 25.00；0.6×0.6 时同域 17.27 低于 DPS 17.72，跨域（人脸先验）掉到 15.35，且 Figure 3 上排出现人脸状填充。**噪声敏感性（Table 16）**：$\sigma=0.5$ 时同域 INO 26.30 仍高于 DPS 24.45，跨域 23.86 已低于 DPS；$\sigma=1.0$ 时同域 20.52、跨域 16.88，都不如 DPS 22.42。

**科学逆问题（Table 10 / 11）**：Linear Scattering 用 FWI 先验（强不匹配），60/180/360 接收器下 INO 21.97 / 27.66 / 27.99，均高于 DPS 与 DAPS；Black Hole Imaging 跨域时 INO 20.10，比 DPS 18.06、DAPS 17.28 高。但作者明确提醒：与同分布结果相比，跨域退化在科学问题上比自然图像更大，因为跨物理域共享的局部结构更少。

**范围限制**：全部为自然图像与 InverseBench 科学任务，**没有任何医学数据**；主实验只用一个求解器（INO），DPS/DAPS/DiffPIR/DMPlug 仅作对照；「弱先验」的强先验基线是 DPS，不是所有强先验方法的最优代表（作者在脚注 1 自认）。

## 5. 复现与审计重点

- **代码是真的，但不是「开箱即跑」**：`weak_recon.py` 是本文方法，`dps_recon.py`/`dmplug_recon.py` 是基线，`stable_recon.py`/`dit_recon.py` 是潜空间实验；配置在 `config/*.yaml`，`util/early_stop.py` 对应 HoldoutTopK。
- **不含权重、不含评测脚本**：权重需从 Hugging Face 下 `google/ddpm-church-256` 等；`data/` 每个数据集只有 3 张示例图，100 张测试图与 PSNR/SSIM/LPIPS 统计要自己准备。`load_result.ipynb` 只是读结果，不是完整评测管线。
- **两个外部依赖**：非线性模糊要另克隆 `VinAIResearch/blur-kernel-space-exploring` 并按 issue 改 import；DiT 实验要克隆 `facebookresearch/DiT` 并手工把 `th.no_grad()` 改成可梯度的写法（README 明说）。这两处是复现失败的高发点。
- **公平性注意**：INO 单次运行约为 DPS 的 1.5–3 倍算力；Table 17 的算力对齐显示，约 1000 NFE 时 INO 31.86 略低于 DPS 32.27，要到 3000 NFE 才反超（34.13 vs 32.36）。主表「弱先验赢」是在各自默认预算下得到的，不能读成同等算力的效率优势。
- **理论假设较强**：高斯混合代理、权重比有界、$m$ 大且得分间隔 $\delta_0>0$；真实 DDIM 先验没有可解密度，作者自己把这些当「解释性模型」。Table 1 只验证了 inpainting 的可辨识性，超分与模糊没有对应的间隔统计。
- **Table 2 的相关系数**：正文说「3 步 Bedroom 与 20 步 CelebA 的相关为 0.9987」，Table 14 给的是 0.9987 对应 Bedroom 3-step vs CelebA 20-step 一行，数值一致；但该矩阵是在 6 个代表 lag 上算的，不是全曲线。

## 6. 建议阅读顺序

摘要 → §1 的三条贡献与「两个轴」定义 → §2.1 式 (1)(2) 与 AdamSphere/HoldoutTopK → §3.2 Theorem 3.2 及其解释（重点是 $e^{-\delta_0 m}$ 和「先验只进常数」）→ §3.3 Table 2（自相关诊断）→ §3.4 失败条件 → §4.1 Table 3 → §4.3 与 Table 12、Table 16 → §5 的实用指南 → Appendix C.9（固定 DPS、只换先验域的对照）→ Appendix C.11（算力对齐）。

## 7. 前后关联

- 与 [SCD（31 号）](../mri/31-scd.md) 是同一现象的两条路线：SCD 在采样过程中用 LoRA 做测试时适配，把先验往目标域拉；本文说不必适配，只要测量信息量够，弱先验本身就能用。两者可以组成「适配 vs 不适配」的对照读法。
- 与 [DDS（20 号）](../mri/20-dds.md)、[Score-MRI（06 号）](../mri/06-score-mri.md) 对照：那一支默认先验与目标同分布且强度足够；本文量化了「先验不匹配」的代价何时可忽略。
- 与 [DDIP（32 号）](../mri/32-ddip.md)、[AdaDiff（33 号）](../mri/33-adadiff.md)、[CDPIR（35 号）](../mri/35-cdpir.md) 对照：它们都在少步/低质先验上做文章，本文给的是「为什么少步先验还能用」的解释层。
- 与 [KLIP（21 号）](../diffusion/21-klip.md)、[测量域 KL 漂移检测（22 号）](../diffusion/22-meas-kl.md)、[分布漂移 UQ（23 号）](../diffusion/23-lpn-shift-uq.md) 对照：那几篇关心「如何发现/量化漂移」，本文关心「漂移存在时为什么还能重建」，互为补充。
- 与 [HalluGen（11 号）](../diffusion/11-hallugen.md) 对照：HalluGen 把幻觉造出来评价指标，本文的失败区间（大遮挡、强噪声、跨语义域）正是幻觉最容易发生的条件；两篇合起来可以支撑「测量信息量 → 幻觉风险」的论证。
- **对本页读者的问题（本页判断）**：Ellipses 训练的先验能重建 AAPM CT，本文给的机制是「Radon 测量维数高、局部锚点多，后验被数据主导」，加上 CT 图像（无论椭圆体模还是真实切片）在短程空间自相关上比自然图像跨域更接近。但本文没有 CT 实验，这条解释属推断；若把 SCD 的 Ellipses→AAPM 失败放进来，本文会预测「该设定下要么有效测量维数不够（稀疏视角/高噪声），要么需要全局语义补全（有限角、截断）」，而作者没有给出可直接套用的阈值，这是需要自己补实验的地方。

## 8. 链接

- [arXiv:2601.22443](https://arxiv.org/abs/2601.22443)
- [arXiv HTML v2 全文](https://arxiv.org/html/2601.22443)
- [OpenReview（ICML 2026 spotlight，forum fdkSA4F0lN）](https://openreview.net/forum?id=fdkSA4F0lN)
- [官方代码 jjia131/weak-diffusion-priors-inverse-problem](https://github.com/jjia131/weak-diffusion-priors-inverse-problem)
- [InverseBench（Appendix C.5 使用的科学逆问题基准）](https://github.com/devzhk/InverseBench)
