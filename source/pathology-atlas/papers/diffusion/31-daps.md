# 31｜DAPS：把相邻采样步解耦，逐级退火地采后验边缘分布

**论文**：Improving Diffusion Inverse Problem Solving with Decoupled Noise Annealing（DAPS），Bingliang Zhang、Wenda Chu、Julius Berner、Chenlin Meng、Anima Anandkumar、Yang Song（Caltech、Stanford、OpenAI）；CVPR 2025（Oral）；arXiv:2407.01521（v1 2024-07-01，v3 2025-08-15）
**定位**：不直接解反向 SDE，而是**递归地从测量条件下的时间边缘分布 p(x_t|y) 采样**：先用 Langevin 从 p(x₀|x_t,y) 抽一个干净样本，再加回 σ_t 噪声。相邻两步因此可以差很远，早期的大误差有机会被改掉——这正是相位恢复这类非线性任务需要的
**精读核验**：2026-11-22 依 arXiv HTML v3 全文读过摘要、§1–5 与附录 E/F 的相关部分（Table 1–3、Table 7 的 NFE/耗时、附录 F.2 的逐任务超参），摘要与 abs 页逐字核对；录用信息（CVPR 2025 Oral）经官方仓库 README 与 CVPR 虚拟会场条目核对。官方代码 `zhangbingliang2019/DAPS` 的 commit `0b18272`、`cores/mcmc.py`、`cores/scheduler.py`、`posterior_sample.py`、`configs/task/*.yaml` 由官方 README 与本机走查记录核对。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**，记录见[推理走查页](../../learning/infer-daps.html)。

## 原文摘要

> Diffusion models have recently achieved success in solving Bayesian inverse problems with learned data priors. Current methods build on top of the diffusion sampling process, where each denoising step makes small modifications to samples from the previous step. However, this process struggles to correct errors from earlier sampling steps, leading to worse performance in complicated nonlinear inverse problems, such as phase retrieval. To address this challenge, we propose a new method called Decoupled Annealing Posterior Sampling (DAPS) that relies on a novel noise annealing process. Specifically, we decouple consecutive steps in a diffusion sampling trajectory, allowing them to vary considerably from one another while ensuring their time-marginals anneal to the true posterior as we reduce noise levels. This approach enables the exploration of a larger solution space, improving the success rate for accurate reconstructions. We demonstrate that DAPS significantly improves sample quality and stability across multiple image restoration tasks, particularly in complicated nonlinear inverse problems. We also show that our method can be naturally extended to latent diffusion models, and is compatible with a wide range of diffusion models and measurement models.

*来源：arXiv:2407.01521v3 摘要，逐字照录。*

## 中文摘要

> 扩散模型近来在借助学习到的数据先验求解贝叶斯逆问题上取得成功。现有方法都建立在扩散采样过程之上，每一步只对上一刻的样本做小幅修改。但这种过程很难纠正采样早期的错误，在相位恢复这类复杂非线性逆问题上表现更差。为此我们提出一种新方法——解耦退火后验采样（DAPS），它依赖一种新的噪声退火过程。具体说，我们把扩散采样轨迹上的相邻步解耦，允许它们彼此相差很大，同时保证随着噪声水平降低，其时间边缘分布退火到真实后验。这样做可以探索更大的解空间，提高准确重建的成功率。我们证明 DAPS 在多种图像复原任务上显著提升样本质量与稳定性，尤其是复杂的非线性逆问题。我们还说明它能自然扩展到潜扩散模型，并兼容多种扩散模型与测量模型。

*译文：逐句对译上方英文摘要，未增删。*

## 1. 三分钟摘要与推荐理由

一句话：**别的后验采样在解 p(x_t|x_{t+Δ}, y)，DAPS 改成解 p(x_t|y)：用 Langevin 从当前噪声水平的「干净后验」抽一个 x₀|y，再把它加噪到下一个更低的 σ_t。于是每步都能「跳」，而不是被上一刻拴住。**

三件值得读的事：

1. **Proposition 1 是全部理论**：若 x_{t₁} ∼ p(x_{t₁}|y)，则 x_{t₂} ∼ E_{x₀∼p(x₀|x_{t₁},y)}[N(x₀, σ_{t₂}²I)] 仍落在 p(x_{t₂}|y)。这允许**任意**的 σ 跳变，包括从 σ_max 一路跳到 0；于是「先验采样 → 后验采样」可以非局部地发生。
2. **内循环是 Langevin，不是梯度下降**：更新式（式 7）包含三项——把 x₀ 往 x̂₀(x_t) 拉（方差 r_t² 的高斯近似）、把 A(x₀) 往 y 拉（权重 β_y²）、以及 √(2η)ε 的噪声。第三项是它和 ReSample/DiffPIR 这类「优化式」方法的本质区别：它画的是后验样本，不是 MAP。
3. **实战配置写得很实在**：σ_max=100、σ_min=0.1、退火表 σ_t^A=t 线性；DAPS-1K = 5 个 ODE 步 × 200 个退火步（1000 NFE，A100 上 37 s/图），DAPS-4K = 10×400 用于非线性任务。Table 7 把它和 DPS（1000 NFE、35 s）、DDRM（20 NFE、2 s）放在同一张表里，成本对比一目了然。

**本页判断**：DAPS 是「用算力换鲁棒性」的代表——在相位恢复上把 DPS 从 17.64 dB 拉到 30.63 dB（Table 1），代价是内循环的 MCMC 成本；线性任务上它只是「不输」。真正的价值是把「后验采样」从 SDE 离散化的框架里解放出来，这对非线性算子尤其重要。

## 2. 问题及研究位置

逆问题 y = A(x₀) + n，目标是 p(x₀|y)。扩散采样的标准做法是解反向 SDE：

$$dx_t=\sqrt{2\dot\sigma_t\sigma_t}\,\nabla_{x_t}\log p(x_t|y)\,dt,$$

每步只能走一小段，因为 Δt 小、且 p(x_t|x_{t+Δ},y) 把样本拴在上一刻附近。已有位置：

- **后验采样类**（DPS、ΠGDM、DDRM）：每步做一次「去噪 + 引导修正」，误差只能靠后续步骤慢慢摊薄；非线性任务上容易卡在坏的局部。
- **优化式**（ReSample、DiffPIR、DCDP）：交替做「去噪 / 解测量约束 / 重采样」，本质是求 MAP 再回注噪声，多样性弱。
- **本文**：直接对边缘分布做退火，内循环用 Langevin 画 p(x₀|x_t,y) 的样本，外循环加噪。理论上对任意 σ 跳变成立，实践上让「早期大误差」有机会被全局改掉。

## 3. 核心方法和数据流

```text
输入：测量 y、算子 A、噪声水平 β_y、分数网络、ODE 求解器、退火表 σ^A_t
x_T ~ N(0, σ_max² I)
for i = N_A … 0:                      # 退火（DAPS-1K: 200 步；DAPS-4K: 400 步）
    x̂₀ = ODE 求解(x_{t_i}, 到 σ_min)   # 无条件 flow ODE，5 或 10 个 Euler 步
    x₀|y ← Langevin 迭代 100 次（式 7）:
        x ← x − η∇‖x − x̂₀‖²/(2r_t²) − η∇‖A(x) − y‖²/(2β_y²) + √(2η)·ε
    σ_{t_{i−1}} ← 退火表下一个值
    x_{t_{i−1}} ← x₀|y + σ_{t_{i−1}}·ε'      # 加回噪声，回到 p(x_{t_{i−1}}|y)
输出：x₀|y（最后的干净样本）
```

四点解释：

1. **p(x₀|x_t) 用高斯近似**：N(x̂₀(x_t), r_t²I)，其中 x̂₀ 由**无条件 flow ODE** 从 x_t 解到 σ_min 得到，r_t 是启发式（附录 F.2）。Table 3 对比了更贵的「扩散分数估计」（式 6），代价是 462 s vs 64.7 s、PSNR 只差 0.17（29.57 vs 29.40），所以默认用高斯近似。
2. **r_t 与 η、δ 全是逐任务表**：附录 F.2 的 Table 8 给了每个任务的 η₀ 与 δ（Langevin 步长与噪声缩放），这一点决定了它**不是免调参**的。
3. **LatentDAPS 只需换坐标系**：把式 7 里的 x 换成 z，测量项写成 p(y|D(z))（式 8），因此同一个框架能套 LDM/Stable Diffusion（Table 4，SD v1.5 上 8 个任务）。
4. **它也支持离散扩散**：附录 G 在 MNIST 上做了分类数据的两类逆问题，说明框架不绑定连续高斯噪声。

## 4. 论文证据与实验范围

**设定**：FFHQ 256 与 ImageNet 256 各 100 张验证图，5 个线性任务（SR ×4、Gaussian deblur、motion deblur、box 修复、随机修复）+ 3 个非线性任务（相位恢复、非均匀去模糊、HDR），测量噪声 β_y=0.01；DAPS-1K 用于线性、DAPS-4K 用于非线性；指标 PSNR/SSIM/LPIPS/FID，非线性任务报均值±标准差（每个 100 张、多次采样）。

**Table 1 关键行（FFHQ）**：

| 任务 | DAPS | DPS | 其它 |
|---|---|---|---|
| 相位恢复 | **30.63 ± 3.13** / 0.851 / 0.139 / FID 42.71 | 17.64 ± 2.97 / 0.441 / 0.410 / 104.52 | HIO 13.53；RED-diff 15.60 |
| 非均匀去模糊 | 28.29 ± 1.77 / 0.783 / 0.155 / 49.38 | 23.39 ± 2.01 / 0.623 | **RED-diff 30.86 ± 0.51（更好）** |
| HDR | **27.12 ± 3.53** / 0.752 / 0.162 / 42.97 | 22.73 ± 6.07 / 0.591 | RED-diff 22.16 |

**ImageNet（Table 1 右半）**：相位恢复 DAPS 25.78 ± 6.92 vs DPS 16.81 ± 3.61；非均匀去模糊 27.73 vs 22.49（RED-diff 30.07 更高）；HDR 26.30 vs 19.23。

**CS-MRI（Table 2，fastMRI 膝部自训 EDM 先验）**：×4 时 PSNR **31.48** / SSIM 0.762 / 测量误差 1.57，DPS 26.13/0.620/9.90、DiffPIR 28.31/0.632/10.55、ScoreMRI 25.97、CSGM 28.78（测量误差 1.52 更低）；×8 时 29.01/0.681/1.28 vs DPS 20.82/0.536/6.74。

**效率（Table 7，A100）**：DAPS-1K 1000 NFE / 37 s、DAPS-100 100 NFE / 7 s、DPS 1000 NFE / 35 s、DDRM 20 NFE / 2 s、RED-diff 1000 NFE / 47 s。

**范围限制（本页判断）**：自然图像 + 膝部 MRI，没有 CT、没有病理；相位恢复是它最好的战场，非均匀去模糊上它并不领先（RED-diff 更好）；标准差极大（相位恢复 ±3.13、ImageNet ±6.92）说明失败样本仍然存在，只是被「best-of」式的报告方式平均掉了；LatentDAPS 依赖 SD，修复质量受 VAE 瓶颈限制。

## 5. 复现与审计重点

**本站推理走查（小样本，用作者权重，非论文指标复现；完整记录见[走查页](../../learning/infer-daps.html)）**：

- **跑法**：官方仓库 `zhangbingliang2019/DAPS` @ `0b18272`，pixel FFHQ 分支（`posterior_sample.py +model=ffhq256ddpm +sampler=edm_daps`），权重 `ffhq_10m.pt`（358 MB）；数据用仓库自带的 10 张 demo-ffhq（不是论文的 100 张 test-ffhq）；四个任务的算子与噪声用 `configs/task/*.yaml` 的 pixel 默认值，未改超参。
- **结果**（10 张，脚本自算）：下采样 ×4 **28.83 / 0.766 / 0.194**（PSNR/SSIM/LPIPS）；高斯模糊 61/3.0 **29.02 / 0.771 / 0.183**；box 修复 **24.56 / 0.751 / 0.163**；相位恢复 **30.40 / 0.784 / 0.154**（num_runs=4，即 40 张里取最好）。
- **与论文配置的偏差（重要）**：走查把所有任务都设成 `num_steps=5 / annealing=200`（相当于 DAPS-1K），而论文对非线性任务用 DAPS-4K（10×400）；phase_retrieval 的 num_runs=4 按 README 执行，即取 4 次采样中的最好一次。因此 30.40 dB 与论文 30.63 dB 只是量级相同，不能当复现。
- **改动**：无代码改动；只加了 `checkpoints/ffhq256.pt` 软链与 `forward_operator/motionblur/` 外部依赖目录（仅为 import 通过）。环境 PyTorch 2.3.0+cu121、diffusers 0.32.2，`regex-2024==11.6` 是 requirements 里的坏包名，按 `regex==2024.11.6` 装。
- **没跑**：test-ffhq 100 张、LDM/SD 分支（LatentDAPS）、motion_blur、nonlinear_blur、HDR、rand inpainting、CS-MRI、FID。

其余审计要点：

- **摘要与表格的数字不一致**：§1 正文说相位恢复 30.72 dB、比 SOTA 高 1.98 dB，Table 1 写 30.63 ± 3.13；HDR 正文 27.12、表格一致。引用时应以 Table 1 为准并注明。
- **配置数字内部不一致**：§4.1 写 DAPS-1K 是「4 个 ODE NFE × 250 个退火步」，而附录 E.1 的 Table 7、附录 F.2 都写 5 × 200；两者 NFE 总数都是 1000，但复现时以代码/附录为准。DAPS-4K 的 10 × 400 三处一致。
- **σ_min=0.1 不是 0**：作者说是为了对测量噪声更鲁棒；这意味着最终样本并非严格来自 p(x₀|y)，而是 σ=0.1 的平滑版。
- **r_t 的启发式**：附录 F.2 只给经验选择，没有推导；换数据集时这是第一个要重调的量。
- **非均匀去模糊不占优**：RED-diff 在 FFHQ 与 ImageNet 两个数据集上都更高（30.86/30.07），论文的「显著改善」只对相位恢复与 HDR 成立，读时不要泛化。

## 6. 建议阅读顺序

摘要 → §3.1 Proposition 1 与式 2（解耦退火的核心）→ 式 3/4（Langevin 从 p(x₀|x_t,y) 采样）→ §3.2 式 5–7（高斯近似与 r_t）→ §3.3 LatentDAPS → §3.4 与 DPS/ReSample 的关系 → §4.1 配置（DAPS-1K/4K）→ Table 1 相位恢复行 → Table 2 CS-MRI → Table 3（高斯近似 vs 分数估计）→ Table 7（成本）→ 附录 F.2（逐任务 η、δ）。

## 7. 前后关联

- 与 [28 号 DPS](28-dps.md) 是直接对手：DPS 每步只做小幅修正，DAPS 让步与步解耦；Table 1 的相位恢复 30.63 vs 17.64 是全文最刺眼的一组对比，也是「为什么要解耦」的最好证据。
- 与 [25 号 ReSample](25-resample.md)：两者都「优化 + 回注噪声」，但 ReSample 解的是 MAP 约束题（硬一致性），DAPS 的 Langevin 里带 √(2η)ε，画的是后验样本；论文 §3.4 明说把 β_y→0、ηβ_y² 固定时二者形似。
- 与 [29 号 DDRM](29-ddrm.md)、[30 号 ΠGDM](30-pigdm.md)：后两者每步只做闭式/梯度更新，20–100 NFE；DAPS 要 1000–4000 NFE，换来的是非线性任务的稳定性（Table 7 的成本对比）。
- 与 [24 号弱先验](24-weak-priors.md) 呼应：DAPS 在 CS-MRI 上用自训的膝部先验，跨中心/跨对比度的泛化未测；它的「测量误差」一列（1.57 vs CSGM 1.52）说明数据一致性并不是它最强的地方，赢在感知质量。
- 与 [38 号 A-DPS](../mri/38-adps.md) 是另一条互补路线：A-DPS 关心「先验本身是用损坏数据训的」，DAPS 关心「采样轨迹怎么走」，两者可以叠加。
- 与 [20 号 DDS](../mri/20-dds.md) 对照：DDS 在分解式扩散里做 CT/MRI 的条件采样，DAPS 提供的是更通用的采样器骨架。

## 8. 链接

- [arXiv:2407.01521（abs）](https://arxiv.org/abs/2407.01521)
- [arXiv HTML v3 全文](https://arxiv.org/html/2407.01521v3)
- [官方代码 zhangbingliang2019/DAPS](https://github.com/zhangbingliang2019/DAPS)
- [项目页 daps-inverse-problem.github.io](https://daps-inverse-problem.github.io/)
- [CVPR 2025 Oral 会场条目](https://cvpr.thecvf.com/virtual/2025/oral/35347)
