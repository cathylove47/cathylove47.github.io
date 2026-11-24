# 31｜DAPS：把相邻采样步解耦，逐级退火地采后验边缘分布

**论文**：Improving Diffusion Inverse Problem Solving with Decoupled Noise Annealing（DAPS），Bingliang Zhang、Wenda Chu、Julius Berner、Chenlin Meng、Anima Anandkumar、Yang Song（Caltech、Stanford、OpenAI）；CVPR 2025（Oral）；arXiv:2407.01521（v1 2024-07-01，v3 2025-08-15）
**定位**：不直接解反向 SDE，而是**递归地从测量条件下的时间边缘分布 $p(x_t \mid y)$ 采样**：先用 Langevin 从 $p(x_0 \mid x_t, y)$ 抽一个干净样本，再加回 $\sigma_t$ 噪声。相邻两步因此可以差很远，早期的大误差有机会被改掉——这正是相位恢复这类非线性任务需要的
**精读核验**：2026-11-22 依 arXiv HTML v3 全文读过摘要、§1–5 与附录 E/F 的相关部分（Table 1–3、Table 7 的 NFE/耗时、附录 F.2 的逐任务超参），摘要与 abs 页逐字核对；录用信息（CVPR 2025 Oral）经官方仓库 README 与 CVPR 虚拟会场条目核对。官方代码 `zhangbingliang2019/DAPS` 的 commit `0b18272`、`cores/mcmc.py`、`cores/scheduler.py`、`posterior_sample.py`、`configs/task/*.yaml` 由官方 README 与本机走查记录核对。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**，记录见[推理走查页](../../learning/infer-daps.html)。

## 原文摘要

> Diffusion models have recently achieved success in solving Bayesian inverse problems with learned data priors. Current methods build on top of the diffusion sampling process, where each denoising step makes small modifications to samples from the previous step. However, this process struggles to correct errors from earlier sampling steps, leading to worse performance in complicated nonlinear inverse problems, such as phase retrieval. To address this challenge, we propose a new method called Decoupled Annealing Posterior Sampling (DAPS) that relies on a novel noise annealing process. Specifically, we decouple consecutive steps in a diffusion sampling trajectory, allowing them to vary considerably from one another while ensuring their time-marginals anneal to the true posterior as we reduce noise levels. This approach enables the exploration of a larger solution space, improving the success rate for accurate reconstructions. We demonstrate that DAPS significantly improves sample quality and stability across multiple image restoration tasks, particularly in complicated nonlinear inverse problems. We also show that our method can be naturally extended to latent diffusion models, and is compatible with a wide range of diffusion models and measurement models.

*来源：arXiv:2407.01521v3 摘要，逐字照录。*

## 中文摘要

> 扩散模型近来在借助学习到的数据先验求解贝叶斯逆问题上取得成功。现有方法都建立在扩散采样过程之上，每一步只对上一刻的样本做小幅修改。但这种过程很难纠正采样早期的错误，在相位恢复这类复杂非线性逆问题上表现更差。为此我们提出一种新方法——解耦退火后验采样（DAPS），它依赖一种新的噪声退火过程。具体说，我们把扩散采样轨迹上的相邻步解耦，允许它们彼此相差很大，同时保证随着噪声水平降低，其时间边缘分布退火到真实后验。这样做可以探索更大的解空间，提高准确重建的成功率。我们证明 DAPS 在多种图像复原任务上显著提升样本质量与稳定性，尤其是复杂的非线性逆问题。我们还说明它能自然扩展到潜扩散模型，并兼容多种扩散模型与测量模型。

*译文：逐句对译上方英文摘要，未增删。*

## 1. 三分钟摘要与推荐理由

> [!IMPORTANT] 一句话直觉
> 别的后验采样都在小心翼翼地沿轨迹微调 $p(x_t \mid x_{t+\Delta}, y)$，早期走歪后面根本拉不回；DAPS 干脆把相邻步**解耦**：先在当前噪声层通过无条件 ODE 飞到干净空间、用 **Langevin MCMC** 自由搜一个同时像先验又对得上测量的 $x_0 \mid y$，再重新加噪退火到下一级 $\sigma_{t-1}$。

三件值得读的事：

1. **Proposition 1 是全部理论基石**：只要 $x_{t_1} \sim p(x_{t_1} \mid y)$，那先从 $p(x_0 \mid x_{t_1}, y)$ 采出 $x_0$ 再加回高斯噪声 $\mathcal{N}(x_0, \sigma_{t_2}^2 I)$，得到的边缘分布**精确落在** $p(x_{t_2} \mid y)$。这允许任意大的 $\sigma$ 跳变，允许「跨模态大跳」纠错。
2. **内循环是 Langevin，不是梯度下降**：更新式（式 7）同时包含先验锚点拉回、测量残差拉回以及随机噪声项 $\sqrt{2\eta}\,\epsilon$。第三项是它和 ReSample/DiffPIR 这类「优化式」方法的本质区别：它画的是后验样本，不是 MAP。
3. **实战成本账透明**：$\sigma_{\max}=100$、$\sigma_{\min}=0.1$、线性退火表 $\sigma_t^A = t$；DAPS-1K = $5$ 个 ODE 步 $\times 200$ 个退火步（1000 NFE，A100 上 37 s/图），DAPS-4K = $10 \times 400$ 用于非线性任务。Table 7 把它和 DPS（1000 NFE、35 s）、DDRM（20 NFE、2 s）放在同一张表里。

> [!WARNING] 本页判断
> DAPS 是「用算力与 MCMC 搜索换非线性鲁棒性」的代表——在相位恢复上把 DPS 从 17.64 dB 拉到 **30.63 dB**（Table 1）；但在非均匀去模糊上反而输给 RED-diff（28.29 vs 30.86），线性任务上也只是「不输」。真正的价值是把「后验采样」从连续 SDE 小步微调的枷锁里解放出来。

## 2. 问题及研究位置

逆问题 $y = \mathcal{A}(x_0) + n$，目标是从后验 $p(x_0 \mid y)$ 采样。传统扩散求解器靠离散化反向 SDE 推进：

$$dx_t = \sqrt{2\dot{\sigma}_t\sigma_t}\,\nabla_{x_t}\log p(x_t \mid y)\,dt$$

因为步长 $\Delta t$ 很小，条件转移 $p(x_t \mid x_{t+\Delta t}, y)$ 把每一步都拴在上一刻附近。已有位置：

- **后验采样类**（DPS、ΠGDM、DDRM）：每步做一次「去噪 + 引导修正」，早期错掉只能靠后续步骤慢慢摊薄，在相位恢复等复杂多峰非线性问题上极易卡在坏的局部极小值。
- **优化式**（ReSample、DiffPIR、DCDP）：交替做「去噪 / 解测量约束 / 重采样」，本质是求 MAP 再回注噪声，缺乏后验多样性。
- **本文**：直接对时间边缘分布 $p(x_t \mid y)$ 做退火，内循环用 Langevin MCMC 从 $p(x_0 \mid x_t, y)$ 抽样、外循环直接加噪跳到下一层，打破相邻步的强耦合。

## 3. 核心方法和数据流

DAPS 用「飞到干净空间跑 MCMC → 重新加噪降级」的循环替代传统的单步条件梯度推进。

```pipeline
1. 噪声退火外循环 | 初始化 $x_T \sim \mathcal{N}(0, \sigma_{\max}^2 I)$，按退火表 $\sigma_{t_i}^A$ 从大到小推进（DAPS-1K 走 200 步，DAPS-4K 走 400 步）
2. 无条件 ODE 估干净先验 | 从当前 $x_{t_i}$ 跑 $5$ 或 $10$ 个 Euler 步的无条件概率流 ODE 到 $\sigma_{\min}$，得到当前先验中心 $\hat{x}_0(x_{t_i})$
3. Langevin 后验采样（100 次） | 在干净空间用式 (7) 运行 MCMC，同时被 $\hat{x}_0$（先验近似）和 $y$（测量）拉住，并注入随机噪声 $\sqrt{2\eta}\,\epsilon$ 探索多峰解空间
4. 重新加噪进入下一级 | 将采出的干净样本 $x_0 \mid y$ 加回下一级噪声：$x_{t_{i-1}} = (x_0 \mid y) + \sigma_{t_{i-1}}\epsilon'$，允许相邻两步之间大幅跳变纠错
```

### 3.1 核心公式：解耦后的 Langevin 内循环（式 7）

为了避免直接算昂贵的扩散分数，作者将先验后验分布 $p(x_0 \mid x_t)$ 近似为各向同性高斯 $\mathcal{N}(\hat{x}_0(x_t), r_t^2 I)$，于是从 $p(x_0 \mid x_t, y)$ 采样的 Langevin 更新写为：

$$x^{(j+1)} = x^{(j)} - \eta \left(\frac{x^{(j)} - \hat{x}_0(x_{t_i})}{r_t^2} + \frac{\nabla_{x}\left\|\mathcal{A}(x^{(j)}) - y\right\|_2^2}{2\beta_y^2}\right) + \sqrt{2\eta}\,\epsilon^{(j)}, \qquad \epsilon^{(j)} \sim \mathcal{N}(0, I)$$

> [!TIP] 三项各自管什么？
> - **第一项（先验弹簧）**：把样本往无条件 ODE 估计出来的 $\hat{x}_0$ 拉，权重受 $r_t^2$ 控制；
> - **第二项（物理测量弹簧）**：把 $\mathcal{A}(x)$ 往真实观测 $y$ 拉，权重受测量噪声 $\beta_y^2$ 控制；
> - **第三项（Langevin 随机噪声）**：$\sqrt{2\eta}\,\epsilon$ 让它不会只坍缩成一个确定性的 MAP 点，而是真正的后验抽样。

### 3.2 关键设计细节

1. **为什么不用更准的分数估计？（Table 3）**：论文对比过用完整扩散分数代替高斯近似 $\mathcal{N}(\hat{x}_0, r_t^2 I)$（式 6），代价是单图耗时从 **64.7 s 暴涨到 462 s**，而 PSNR 仅差 0.17 dB（29.57 vs 29.40），因此默认用无条件 ODE + 高斯近似。
2. **LatentDAPS 只需换坐标（式 8）**：把式 (7) 中的 $x$ 换成潜变量 $z$，测量项改写为 $\|\mathcal{A}(\mathcal{D}(z)) - y\|_2^2$，同一套框架即可接入 LDM / Stable Diffusion v1.5（Table 4 覆盖 8 个任务）。
3. **兼容离散扩散**：附录 G 在 MNIST 上验证了离散分类数据的逆问题，说明退火解耦思路不绑定连续高斯扩散。

> [!WARNING] 超参依赖与实现细节（附录 F.2）
> 尽管理论优雅，DAPS **并非免调参**：高斯近似方差 $r_t$ 是启发式经验公式，且附录 F.2 的 Table 8 为每个任务单独配置了 Langevin 步长 $\eta_0$ 与噪声缩放 $\delta$；此外退火终点设为 $\sigma_{\min} = 0.1$ 而非 $0$（作者称为了抗噪鲁棒），意味着最终结果实质上是 $\sigma = 0.1$ 轻微平滑后的样本。

## 4. 论文证据与实验范围

**设定**：FFHQ 256 与 ImageNet 256 各 100 张验证图，5 个线性任务（SR $\times 4$、Gaussian deblur、motion deblur、box 修复、随机修复）+ 3 个非线性任务（相位恢复、非均匀去模糊、HDR），测量噪声 $\beta_y = 0.01$；DAPS-1K 用于线性、DAPS-4K 用于非线性；指标 PSNR/SSIM/LPIPS/FID，非线性任务报均值 ± 标准差（每组 100 张、多次采样）。

**Table 1 关键行（FFHQ）**：

| 任务 | DAPS | DPS | 其它 |
|---|---|---|---|
| 相位恢复 | **30.63 ± 3.13** / 0.851 / 0.139 / FID 42.71 | 17.64 ± 2.97 / 0.441 / 0.410 / 104.52 | HIO 13.53；RED-diff 15.60 |
| 非均匀去模糊 | 28.29 ± 1.77 / 0.783 / 0.155 / 49.38 | 23.39 ± 2.01 / 0.623 | **RED-diff 30.86 ± 0.51（更好）** |
| HDR | **27.12 ± 3.53** / 0.752 / 0.162 / 42.97 | 22.73 ± 6.07 / 0.591 | RED-diff 22.16 |

**ImageNet（Table 1 右半）**：相位恢复 DAPS $25.78 \pm 6.92$ vs DPS $16.81 \pm 3.61$；非均匀去模糊 27.73 vs 22.49（RED-diff 30.07 更高）；HDR 26.30 vs 19.23。

**CS-MRI（Table 2，fastMRI 膝部自训 EDM 先验）**：$\times 4$ 时 PSNR **31.48** / SSIM 0.762 / 测量误差 1.57，DPS `26.13 / 0.620 / 9.90`、DiffPIR `28.31 / 0.632 / 10.55`、ScoreMRI 25.97、CSGM 28.78（测量误差 1.52 更低）；$\times 8$ 时 `29.01 / 0.681 / 1.28` vs DPS `20.82 / 0.536 / 6.74`。

**效率（Table 7，A100）**：DAPS-1K `1000 NFE / 37 s`、DAPS-100 `100 NFE / 7 s`、DPS `1000 NFE / 35 s`、DDRM `20 NFE / 2 s`、RED-diff `1000 NFE / 47 s`。

**范围限制（本页判断）**：自然图像 + 膝部 MRI，没有 CT、没有病理；相位恢复是它最好的战场，非均匀去模糊上它并不领先（RED-diff 更好）；标准差极大（相位恢复 $\pm 3.13$、ImageNet $\pm 6.92$）说明失败样本仍然存在，只是被「best-of」式的报告方式平均掉了；LatentDAPS 依赖 SD，修复质量受 VAE 瓶颈限制。

## 5. 复现与审计重点

**本站推理走查（小样本，用作者权重，非论文指标复现；完整记录见[走查页](../../learning/infer-daps.html)）**：

- **跑法**：官方仓库 `zhangbingliang2019/DAPS` @ `0b18272`，pixel FFHQ 分支（`posterior_sample.py +model=ffhq256ddpm +sampler=edm_daps`），权重 `ffhq_10m.pt`（358 MB）；数据用仓库自带的 10 张 demo-ffhq（不是论文的 100 张 test-ffhq）；四个任务的算子与噪声用 `configs/task/*.yaml` 的 pixel 默认值，未改超参。
- **结果**（10 张，脚本自算）：下采样 $\times 4$ **28.83 / 0.766 / 0.194**（PSNR/SSIM/LPIPS）；高斯模糊 61/3.0 **29.02 / 0.771 / 0.183**；box 修复 **24.56 / 0.751 / 0.163**；相位恢复 **30.40 / 0.784 / 0.154**（`num_runs=4`，即 40 张里取最好）。
- **与论文配置的偏差（重要）**：走查把所有任务都设成 `num_steps=5 / annealing=200`（相当于 DAPS-1K），而论文对非线性任务用 DAPS-4K（$10 \times 400$）；`phase_retrieval` 的 `num_runs=4` 按 README 执行，即取 4 次采样中的最好一次。因此 30.40 dB 与论文 30.63 dB 只是量级相同，不能当复现。
- **改动**：无代码改动；只加了 `checkpoints/ffhq256.pt` 软链与 `forward_operator/motionblur/` 外部依赖目录（仅为 import 通过）。环境 PyTorch 2.3.0+cu121、diffusers 0.32.2，`regex-2024==11.6` 是 requirements 里的坏包名，按 `regex==2024.11.6` 装。
- **没跑**：test-ffhq 100 张、LDM/SD 分支（LatentDAPS）、motion_blur、nonlinear_blur、HDR、rand inpainting、CS-MRI、FID。

其余审计要点：

- **摘要与表格的数字不一致**：§1 正文说相位恢复 30.72 dB、比 SOTA 高 1.98 dB，Table 1 写 `30.63 ± 3.13`；HDR 正文 27.12、表格一致。引用时应以 Table 1 为准并注明。
- **配置数字内部不一致**：§4.1 写 DAPS-1K 是「4 个 ODE NFE × 250 个退火步」，而附录 E.1 的 Table 7、附录 F.2 都写 $5 \times 200$；两者 NFE 总数都是 1000，但复现时以代码/附录为准。DAPS-4K 的 $10 \times 400$ 三处一致。
- **$\sigma_{\min}=0.1$ 不是 0**：作者说是为了对测量噪声更鲁棒；这意味着最终样本并非严格来自 $p(x_0 \mid y)$，而是 $\sigma=0.1$ 的平滑版。
- **$r_t$ 的启发式**：附录 F.2 只给经验选择，没有推导；换数据集时这是第一个要重调的量。
- **非均匀去模糊不占优**：RED-diff 在 FFHQ 与 ImageNet 两个数据集上都更高（30.86 / 30.07），论文的「显著改善」只对相位恢复与 HDR 成立，读时不要泛化。

## 6. 建议阅读顺序

摘要 → §3.1 Proposition 1 与式 (2)（解耦退火的核心）→ 式 (3)/(4)（Langevin 从 $p(x_0 \mid x_t, y)$ 采样）→ §3.2 式 (5)–(7)（高斯近似与 $r_t$）→ §3.3 LatentDAPS → §3.4 与 DPS/ReSample 的关系 → §4.1 配置（DAPS-1K/4K）→ Table 1 相位恢复行 → Table 2 CS-MRI → Table 3（高斯近似 vs 分数估计）→ Table 7（成本）→ 附录 F.2（逐任务 $\eta$、$\delta$）。

## 7. 前后关联

- 与 [28 号 DPS](28-dps.md) 是直接对手：DPS 每步只做小幅修正，DAPS 让步与步解耦；Table 1 的相位恢复 30.63 vs 17.64 是全文最刺眼的一组对比，也是「为什么要解耦」的最好证据。
- 与 [25 号 ReSample](25-resample.md)：两者都「优化 + 回注噪声」，但 ReSample 解的是 MAP 约束题（硬一致性），DAPS 的 Langevin 里带 $\sqrt{2\eta}\,\epsilon$，画的是后验样本；论文 §3.4 明说把 $\beta_y \to 0$、$\eta \beta_y^2$ 固定时二者形似。
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
