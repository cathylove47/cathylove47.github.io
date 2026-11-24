# 38｜A-DPS：先验是在「欠采样数据」上训的，后验采样还能不能用

**论文**：Ambient Diffusion Posterior Sampling: Solving Inverse Problems with Diffusion Models Trained on Corrupted Data，Asad Aali\*、Giannis Daras\*、Brett Levac、Sidharth Kumar、Alexandros G. Dimakis、Jonathan I. Tamir（Stanford、MIT CSAIL、UT Austin、UC Berkeley、Bespoke Labs）；ICLR 2025；arXiv:2403.08728（v1 2024-03-13，v2 2025-04-21）
**定位**：把 **Ambient Diffusion**（只用线性损坏数据训练扩散模型）第一次接到逆问题求解上；核心工程是把 Ambient 框架从「随机遮挡」推广到**傅里叶域、整条读出行缺失、多线圈**的 MRI 训练，再让 DPS 直接用这种「脏数据先验」
**精读核验**：2026-11-22 依 arXiv HTML v2 全文读过摘要、§1–4 与附录 B/E 的相关部分（Table 1 的 FID、Table 3 的 LPIPS/DISTS、Fig. 7/8 的腹部定性），摘要与 abs 页逐字核对；录用信息（ICLR 2025）由论文版本与官方仓库 README 相互印证。官方代码 `utcsilab/ambient-diffusion-mri` 的 commit `75feb2f`、`prior.py`、`solve_inverse_adps.py`、`torch_utils/ambient_diffusion.py` 由本机走查记录核对。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**，且**只做了先验采样、没做后验重建**，记录见[推理走查页](../../learning/infer-adps.html)。

## 原文摘要

> We provide a framework for solving inverse problems with diffusion models learned from linearly corrupted data. Firstly, we extend the Ambient Diffusion framework to enable training directly from measurements corrupted in the Fourier domain. Subsequently, we train diffusion models for MRI with access only to Fourier subsampled multi-coil measurements at acceleration factors R= 2,4,6,8. Secondly, we propose Ambient Diffusion Posterior Sampling (A-DPS), a reconstruction algorithm that leverages generative models pre-trained on one type of corruption (e.g. image inpainting) to perform posterior sampling on measurements from a different forward process (e.g. image blurring). For MRI reconstruction in high acceleration regimes, we observe that A-DPS models trained on subsampled data can outperform models trained on fully sampled data, while also being substantially faster. Finally, we demonstrate that A-DPS models can be used to solve inverse problems in domains where fully sampled data is not available—e.g. when only subsampled measurements of a knee MRI are available. In those cases no ground truth is available, so the models trained on subsampled data are the only feasible option.

*来源：arXiv:2403.08728 摘要，逐字照录（原文在 R= 2,4,6,8 处有空格，照录）。*

## 中文摘要

> 我们给出一个用「从线性损坏数据中学到的扩散模型」求解逆问题的框架。首先，我们扩展 Ambient Diffusion 框架，使其能直接在傅里叶域被损坏的测量上训练。随后，我们**只**用 R=2,4,6,8 的傅里叶欠采样多线圈测量来训练 MRI 扩散模型。其次，我们提出环境扩散后验采样（A-DPS）：一种利用「在一种损坏上预训练」的生成模型（例如图像遮挡），去对**另一种**前向过程（例如图像模糊）的测量做后验采样的重建算法。在高加速率的 MRI 重建中，我们观察到：用欠采样数据训练的 A-DPS 模型能超过用全采样数据训练的模型，同时明显更快。最后我们说明，A-DPS 可用于没有全采样数据的领域——例如只有膝部 MRI 欠采样测量的情形；那时没有真值，用欠采样数据训练的模型是唯一可行的选择。

*译文：逐句对译上方英文摘要，未增删。*

## 1. 三分钟摘要与推荐理由

> [!IMPORTANT] 一句话直觉
> 真实医院往往拿不到全采样 MRI 真值来训先验，手里只有欠采样数据 $y = A_{\text{train}}x$；本文证明只要训练掩膜期望矩阵 $\mathbb{E}[A_{\text{train}}^T A_{\text{train}}]$ 满秩，就能只靠「更残缺的二次掩膜去噪损失」训出等价于干净分布的环境分数 $s_\theta$，然后原封不动塞进 DPS 里解任意加速率的重建。

三件值得读的事：

1. **「用脏数据训先验」有明确可证条件**：最小化只在训练损坏覆盖子空间上算的 Ambient 去噪损失（式 2.4），可学到 $\mathbb{E}[x_0 \mid \tilde{y}]$ 并等价于干净分布分数，前提是 $\mathbb{E}[A_{\text{train}}^T A_{\text{train}}]$ 满秩。MRI 的「中心 ACS + 随机整列」配合多线圈恰满足满秩，使 Ambient 框架在傅里叶域落地。
2. **高加速率下「脏先验」反超「干净先验」**：$R=8$ 推理时，FS-DPS（全采样训练）条件 FID 为 4.16，而用欠采样训练的 A-DPS 在 $R=2/4/6/8$ 训练下分别是 **0.71 / 0.87 / 1.29 / 2.00**，LPIPS 也全面更低（0.231 vs 0.150–0.204，Table 3）；但 $R=2$ 推理时反过来（FS-DPS LPIPS 0.061 vs A-DPS 0.118）。**先验训练损坏程度要与推理损坏程度匹配。**
3. **兼顾域内快采与跨域通吃**：同一套分数既支持同一种掩膜下的一步/少步域内重建（§2.4 A-OS），也支持训练掩膜与推理算子完全不同的跨域 DPS（§3.3）。

> [!WARNING] 本页判断
> 这篇是「数据获取受限」场景的实用主义答卷。它没有新采样器——A-DPS 推理侧就是 DPS 换分数网络；真正的新贡献是**在多线圈傅里叶域把 Ambient 训练跑通**，以及揭示了训练损坏 vs 推理加速率的交叉规律。做病理/医学「先验本身没有干净真值」方向时，这是必读基线。

## 2. 问题及研究位置

设置：训练集只有欠采样观测 $\{y_i = A_{\text{train}} x_i\}$，$A_{\text{train}}$ 分布已知（如 $R=4$ 傅里叶掩膜），没有干净真值 $x_i$；推理时要解 $y = A_{\text{test}} x + n$，$A_{\text{test}}$ 可以与 $A_{\text{train}}$ 不同，目标是从 $p(x \mid y)$ 采样。

已有位置：

- **DPS**：用全采样干净数据训先验，靠 $\nabla_{x_t}\|y - A(\hat{x}_0)\|^2$ 引导；前提是有大量全采样干净真值。
- **监督端到端（MoDL）**：每个加速率训一个网络，同样依赖全采样真值。
- **自监督（SSDU / 1D-Partitioned SSDU）**：把已有测量切两半做自监督损失，仍绑定特定网络结构与加速率。
- **L1-EDM / L1-DPS**：先用 L1 小波重建出「伪干净图」再训扩散，FID 与重建质量明显更差（Table 1/3）。
- **本文**：傅里叶 Ambient 训练 + A-DPS 后验采样，既不用干净真值也不绑定推理算子。

## 3. 核心方法和数据流

A-DPS 分训练与推理两段：训练阶段用「在已欠采样测量上再加一层随机子掩膜 $\tilde{A}$」来构造自监督分数目标；推理阶段直接将该环境分数接入 DPS（或一步近似 A-OS）。

```pipeline
1. 傅里叶二次掩膜训练（Ambient） | 对每份欠采样多线圈测量，再施加进一步缺失掩膜 $\tilde{A}$ 得 $\tilde{y} = \tilde{A} A_{\text{train}} x$，仅在已知子空间上最小化式 (2.4) 去噪损失，学得环境分数 $s_\theta(x_t; \tilde{A})$
2. 确认满秩前提 | 借助「中心 ACS + 随机整列」多线圈掩膜保证 $\mathbb{E}[A_{\text{train}}^T A_{\text{train}}]$ 满秩，使环境分数理论上收敛于干净分布分数
3. 环境分数做 Tweedie 估计 | 推理时（500 步）用环境分数代替干净分数，从 $x_t$ 算出干净估计 $\hat{x}_0$
4. 切回推理算子做 DPS 引导 | 用推理时的真实算子 $A_{\text{test}}$ 计算残差梯度 $\gamma_t \nabla_{x_t}\|y - A_{\text{test}}(\hat{x}_0)\|_2^2$（$\gamma_t = 1/\|y - A_{\text{test}}(\hat{x}_0)\|_2$）完成反向采样更新
```

### 3.1 训练与推理的关键公式（式 2.4 / 式 2.11）

$$x_{t-1} = \text{反向 SDE 一步}(x_t, s_\theta(\cdot; \tilde{A})) - \gamma_t \,\nabla_{x_t}\|y - A_{\text{test}}(\hat{x}_0)\|_2^2, \qquad \gamma_t = \frac{1}{\|y - A_{\text{test}}(\hat{x}_0)\|_2}$$

> [!TIP] 为什么训练用的掩膜和推理用的算子可以不一样？
> Ambient 训练的目标虽然只在局部子空间 $\tilde{A}$ 上算误差，但只要随机采样的掩膜分布满足 $\mathbb{E}[A_{\text{train}}^T A_{\text{train}}]$ 满秩，网络在全空间各个频率上都见过样本，学到的 $s_\theta$ 在期望意义上就是干净图像先验分数 $\nabla \log p_t(x_t)$——因此推理时可以自由换成另一套完全不同的 $A_{\text{test}}$（如从遮挡训练迁到模糊重建）。

### 3.2 MRI 落地改动与 A-OS

- **傅里叶多线圈适配（§2.2）**：把标准 Ambient 的「逐像素随机遮挡」改为**傅里叶域整条竖直线缺失 + 多线圈灵敏度图耦合**，作者证明满秩条件依然成立。
- **A-OS（one-step Ambient，§2.4）**：当训练与推理同构时，用「一步去噪 + 一次测量修正」构成廉价版本，效果略逊但省一个数量级的 NFE（Fig. 10）。

## 4. 论文证据与实验范围

**设定**：fastMRI **脑部** T2（2,000 次扫描各取中心 5 张，共 10,000 个多线圈样本，附录 B）、$384\times 320$ 多线圈复数图；训练掩膜 $R \in \{2,4,6,8\}$（中心 20 条 ACS + 随机线），另训 $R=1$ 的干净 EDM 作为对照；评测 100 个测试样本。指标 NRMSE、SSIM、PSNR（Table 2）、LPIPS/DISTS（Table 3）、FID（Table 1）。

**无条件生成（Table 1，FID↓）**：$R=1$ EDM **10.41**、NCSNV2 13.20；$R=2$ 的 L1-EDM 18.55、Ambient 30.34；$R=4$ L1-EDM 27.64、Ambient 32.31；$R=6$ L1-EDM 51.43、Ambient **31.50**；$R=8$ L1-EDM 102.98、Ambient **48.15**。趋势：加速率越高，Ambient 相对 L1-EDM 的优势越大。

**后验重建（Table 1 条件 FID / Table 3 LPIPS）**：

| 训练 → 推理 | 方法 | 条件 FID↓ | LPIPS↓ @$R=8$ |
|---|---|---|---|
| $R=1 \to R=8$ | FS-DPS | 4.16 | 0.231 |
| $R=2 \to R=8$ | A-DPS | **0.71** | 0.150 |
| $R=4 \to R=8$ | A-DPS | 0.87 | 0.168 |
| $R=6 \to R=8$ | A-DPS | 1.29 | 0.186 |
| $R=8 \to R=8$ | A-DPS | 2.00 | 0.204 |
| $R=1 \to R=2$ | FS-DPS | — | **0.061** |
| $R=2 \to R=2$ | A-DPS | — | 0.118 |

读法：**高加速率下 A-DPS 全面胜出，低加速率下 FS-DPS 更好**；作者把这一交叉归因于「训练损坏程度与推理损坏程度的匹配」，并在 §3.3 的自然图像实验（AFHQ/FFHQ/CelebA）里复现了同一现象（测量很少时 Ambient 胜、测量多时干净先验胜）。腹部 MRI 只有欠采样数据，作者给了先验与后验的定性图（Fig. 7/8），没有指标。

**范围限制（本页判断）**：只有脑部 MRI 有定量指标，且是单中心 fastMRI；没有 CT/PET；掩膜是「竖直线 + 中心 ACS」这一类，其他采样模式（径向、螺旋）未验证；A-DPS 本身继承 DPS 的全部近似（Jensen 间隙、500 步、逐任务 $\gamma_t$）；「优于干净先验」只在高加速率成立，不能当作普遍结论。

## 5. 复现与审计重点

**本站推理走查（小样本，用作者权重，非论文指标复现；完整记录见[走查页](../../learning/infer-adps.html)）**：

- **只做了先验采样**：跑 `prior.py`（README 的 `prior.sh`），没有跑 `solve_inverse_adps.py` 的后验重建。原因见下：后验需要 fastMRI 预处理包 `ksp_brainMRI_384.zip`（含真值复数图、16 线圈 k-space、灵敏度图与掩膜），体积与申请门槛都超出本次范围，且仓库**不提供** `sample_%d.pt` 的生成脚本。
- **结果**：$R=1$（干净 EDM）8 张、$R=2$ 8 张、$R=4$ 16 张、$R=8$ 8 张（`batch=2`，18 步 EDM 采样，代码默认超参）。出图顺序与论文 Fig. 1 一致：$R=1$ 脑沟与脑室最锐利，$R=2$ 略有条带，$R=4$ 皮层细节发软，$R=8$ 最软但中线与脑室仍正确。定量只给了代理量（平均梯度幅值 `11.97 / 13.01 / 11.29 / 10.26`），**没有 FID**（缺 fastMRI 参考集）。
- **关键替代（必须记住）**：`prior.py` 无条件读 `maps_path` 的 zip，而仓库不含生成 maps 的脚本（它来自 fastMRI 预处理包）。本次用**合成的 4 线圈鸟笼状灵敏度图**（`code/make_synth_maps.py`，逐点归一 $\sum_c |m_c|^2 = 1$）替代。对**先验采样**影响很小（归一化后 $\text{adjoint} \circ \text{forward} \approx \text{ifft}(\text{mask}\cdot\text{fft}(x))$，几乎只等于 k-space 掩膜投影）；但**后验实验必须换成数据集真值 maps**，否则 16 线圈的重建结论不成立。
- **其它事实**：环境 python 3.9 + torch 2.0.0+cu118；`sigpy` 不在 `environment.yml` 里但被 `ambient_diffusion.py` 与 `training/dataset.py` import，必须补装；`batch=16` 在 24 GB 卡上 OOM（22.9 GiB 已分配），`batch=2` 是显存/吞吐折中（峰值 15 GB，18 步 8.6 s/批）。
- **上游 bug（非我们的改动）**：`prior.py` 主循环是 `while True` + `eval_index` 恒为 0，生成完一个 checkpoint 后会**用同样种子无限重复生成并覆盖同名 PNG**，与 README「生成 1000 张就结束」不符；我们拿到目标张数后手动停进程。

其余审计要点：

- **可证条件的边界**：Ambient 的理论要求 $\mathbb{E}[A_{\text{train}}^T A_{\text{train}}]$ 满秩；掩膜若在某些频率上系统性缺失（例如完全不含低频），条件不成立，只能当经验方法用。换采样模式（径向/螺旋）时需重新验证。
- **「超过干净先验」的适用范围**：只在 $R \ge 4$ 的推理与「训练损坏更大」的组合下成立；Table 3 里 $R=2 \to R=2$ 的 LPIPS 0.118 明显差于 FS-DPS 的 0.061。
- **条件 FID 的口径**：Table 1 的条件 FID 是后验样本与真值分布的分布距离，样本量小（100 例），且不同 $R$ 的模型训练量不同，横向比较需谨慎。
- **$\gamma_t$ 与 500 步**：与 DPS 一样是逐任务的经验设置，论文附录 D 有讨论，但没有给出免调参方案。

## 6. 建议阅读顺序

摘要 → §2.1 DPS 回顾 → §2.2 Ambient Diffusion for MRI（三个改动与满秩条件）→ §2.3 式 (2.11)（A-DPS 更新）→ §2.4 域内 A-OS → §3.1 Table 1（FID）→ §3.2 Table 2/3（重建指标）→ §3.3 自然图像的交叉现象 → Fig. 3（$R=2/4/6/8$ 的视觉对比）→ 附录 B（数据准备）→ 附录 D（$\gamma_t$ 的调度）。

## 7. 前后关联

- 与 [28 号 DPS](../diffusion/28-dps.md) 是父子关系：A-DPS 的更新式就是把 DPS 的 $\nabla \log p_t(x_t)$ 换成环境分数 $s_\theta(x_t; \tilde{A})$，引导项完全不动。
- 与 [31 号 DAPS](../diffusion/31-daps.md) 互补：DAPS 改的是**采样轨迹**（解耦退火），A-DPS 改的是**先验来源**（脏数据训练）；两者正交，理论上可叠加。
- 与 [20 号 DDS](20-dds.md) 同属「医学逆问题 + 扩散先验」，但 DDS 是把算子结构写进分解式采样，A-DPS 是把训练数据的损坏写进先验。
- 与 [06 号 Score-MRI](06-score-mri.md) 是同一数据域的两代做法：Score-MRI 用全采样数据训分数、做 annealed Langevin；A-DPS 用欠采样数据训、做后验采样。
- 与 [31 号 SCD](31-scd.md) 对照：SCD 在**推理时**用 LoRA 适配（测试时训练），A-DPS 在**训练时**就只见过损坏数据；两者都在回答「先验与测量不匹配怎么办」，方向相反。
- 与 [24 号弱先验](../diffusion/24-weak-priors.md) 呼应：那篇从理论上解释「测量信息量大时弱先验也能用」，本篇从数据侧给出「先验损坏程度要与测量损坏程度匹配」的经验证据。

## 8. 链接

- [arXiv:2403.08728（abs）](https://arxiv.org/abs/2403.08728)
- [arXiv HTML v2 全文](https://arxiv.org/html/2403.08728v2)
- [官方代码 utcsilab/ambient-diffusion-mri](https://github.com/utcsilab/ambient-diffusion-mri)
- [Ambient Diffusion 原始工作（Daras 等，训练侧理论）](https://arxiv.org/abs/2305.19256)
