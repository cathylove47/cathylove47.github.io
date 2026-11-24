# 28｜DPS：把 Tweedie 的 $\hat{x}_0$ 塞进似然项，噪声与非线性的通用后验采样

**论文**：Diffusion Posterior Sampling for General Noisy Inverse Problems，Hyungjin Chung、Jeongsol Kim、Michael T. McCann、Marc L. Klasky、Jong Chul Ye（KAIST、Los Alamos National Laboratory）；ICLR 2023；arXiv:2209.14687（v1 2022-09-29，本页读 v2 2022-11-14；后续另有 v3/v4）
**定位**：像素空间扩散先验求解**带噪**逆问题的通用框架；用一步去噪估计 $\hat{x}_0 = \mathbb{E}[x_0 \mid x_t]$，把不可解的 $p(y \mid x_t)$ 换成 $p(y \mid \hat{x}_0)$，于是「梯度回传到网络」就够了，不需要 SVD、不需要投影、也不需要前向算子线性
**精读核验**：2026-11-22 依 arXiv HTML v2 全文读过摘要、§1–5 与附录 A–D 的相关部分（Table 1–4、附录 C.1/C.2/C.3 的投影与步长实验、附录 D.1 的逐任务步长表），摘要与 arXiv abs 页逐字核对。官方代码 `DPS2022/diffusion-posterior-sampling` 在论文摘要里直接给出。**本站没有为这篇留推理走查记录页**：DPS 的推理是用户自己早前跑的，没有落 RECORD.md，本页因此不给任何本站数字，全部数字为论文报告值。

## 原文摘要

> Diffusion models have been recently studied as powerful generative inverse problem solvers, owing to their high quality reconstructions and the ease of combining existing iterative solvers. However, most works focus on solving simple linear inverse problems in noiseless settings, which significantly under-represents the complexity of real-world problems. In this work, we extend diffusion solvers to efficiently handle general noisy (non)linear inverse problems via approximation of the posterior sampling. Interestingly, the resulting posterior sampling scheme is a blended version of diffusion sampling with the manifold constrained gradient without a strict measurement consistency projection step, yielding a more desirable generative path in noisy settings compared to the previous studies. Our method demonstrates that diffusion models can incorporate various measurement noise statistics such as Gaussian and Poisson, and also efficiently handle noisy nonlinear inverse problems such as Fourier phase retrieval and non-uniform deblurring. Code is available at https://github.com/DPS2022/diffusion-posterior-sampling.

*来源：arXiv:2209.14687 摘要（abs 页与 HTML 版一致），含原文末尾的代码链接。*

## 中文摘要

> 扩散模型近来被当作强生成式逆问题求解器研究，因为它们重建质量高、又容易和已有的迭代求解器结合。但多数工作只处理无噪设定下的简单线性逆问题，这严重低估了真实问题的复杂度。本文通过近似后验采样，把扩散求解器推广到能高效处理一般的**带噪（非）线性**逆问题。有意思的是，由此得到的后验采样格式，是扩散采样与「流形约束梯度」的混合体，但不含严格的测量一致性投影步；与先前研究相比，这在带噪设定下给出了更理想的生成路径。我们的方法说明扩散模型可以纳入高斯、泊松等不同测量噪声统计，也能高效处理傅里叶相位恢复、非均匀去模糊这类带噪非线性逆问题。代码见 https://github.com/DPS2022/diffusion-posterior-sampling。

*译文：逐句对译上方英文摘要，未增删；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

> [!IMPORTANT] 一句话直觉
> 扩散后验采样卡在「已知干净图才能算 $p(y \mid x_0)$，但采样中途只有含噪图 $x_t$」；DPS 先用 Tweedie 公式一步预测干净估计 $\hat{x}_0(x_t)$，再对 $\|y - A(\hat{x}_0(x_t))\|^2$ **穿过神经网络反向求导**，把测量误差变成每一步的引导梯度。

三件值得读的事：

1. **「近似 + 回传」这条路线后来成了通用基线**：似然分数近似为 $\nabla_{x_t}\log p_t(y \mid x_t) \approx -\frac{1}{\sigma^2}\nabla_{x_t}\|y - A(\hat{x}_0(x_t))\|_2^2$（式 16），其中 $\hat{x}_0$ 由分数网络一步给出。于是前向算子 $A$ 只需**可微**，线性/非线性、高斯/泊松都能套同一套骨架。
2. **解释了「为什么带噪时硬投影反而有害」**：取权重矩阵 $W=I$ 时，MCG 的梯度步与 DPS 相同，差别只在 MCG 额外做一次测量子空间投影；Fig. 3 的几何论证指出，带噪测量下硬投影会把样本反复拽离生成流形、放大噪声（Fig. 7 给出 MCG 在带噪超分上崩溃的反例）。
3. **实验覆盖面广**：FFHQ/ImageNet 各 1k 张验证图、5 个线性任务 + 2 个非线性任务（傅里叶相位恢复、非均匀去模糊），全部带 $\sigma=0.05$ 高斯噪声，另有一组泊松噪声（$\lambda=1.0$）定性结果。

> [!WARNING] 本页判断
> DPS 是「后验采样类」方法的坐标原点，读 [29 号 DDRM](29-ddrm.md)、[30 号 ΠGDM](30-pigdm.md)、[31 号 DAPS](31-daps.md) 都必须先看清它的近似长什么样。但它的「无超参」只是相对说法：步长系数 $\zeta'$ 在附录 D.1 里**按任务与数据集分别给值**（$1.0 / 0.6 / 0.4 / 0.3$ 等），换数据集就得重调；而且每步都要穿过网络反向求导，1000 步代价极高。

## 2. 问题及研究位置

逆问题写作 $y = \mathcal{A}(x_0) + n$。贝叶斯后验采样每一步要算：

$$\nabla_{x_t}\log p_t(x_t \mid y) = \nabla_{x_t}\log p_t(x_t) + \nabla_{x_t}\log p_t(y \mid x_t)$$

第一项由预训练分数网络 $s_\theta(x_t, t)$ 直接给出；第二项 $\nabla_{x_t}\log p_t(y \mid x_t)$ 不可解，因为测量 $y$ 只显式依赖干净图 $x_0$，给定 $x_0$ 后 $x_t$ 与 $y$ 条件独立。

已有位置：

- **谱域方法**（DDRM、SNIPS）：对线性算子 $H$ 做 SVD，在奇异值空间对齐测量噪声与扩散噪声；代价是 SVD 昂贵，非线性算子直接不可用。
- **投影类**（POCS/ILVR、MCG）：先去噪再硬投影回测量一致子空间，默认无噪 $n \approx 0$；带噪时投影会放大噪声（附录 C.1 的 Fig. 7）。
- **早期重建引导**（Jalal 等）：把 $\nabla_{x_t}\log p(y \mid x_t)$ 粗略近似为 $A^H(y - Ax_t)/\sigma^2$，只在 $t=0$ 成立，须靠手调日程 $\gamma_t$ 强行补齐噪声尺度。
- **本文**：不改算子形式，也不做硬投影，只改「似然在哪个变量上求值」——先经 Tweedie 映射到流形上的 $\hat{x}_0$ 再求导。

## 3. 核心方法和数据流

DPS 把「对未知干净后验积分 $p_t(y \mid x_t) = \mathbb{E}_{x_0 \sim p(x_0 \mid x_t)}[p(y \mid x_0)]$」替换为「把条件期望 $\hat{x}_0$ 直接塞进 $p(y \mid \hat{x}_0)$」，从而绕开边缘化积分，只靠网络反向传播就能完成条件引导。

```pipeline
1. 一步去噪估计（Tweedie） | 将当前含噪状态 $x_i$ 送入预训练分数网络 $s_\theta$，算出干净图像的后验均值估计 $\hat{x}_0(x_i)$
2. 无条件反向采样 | 执行一步标准祖先采样，得到未受测量约束的过渡状态 $x'_{i-1}$
3. 穿过网络求似然梯度 | 计算残差 $\|y - \mathcal{A}(\hat{x}_0(x_i))\|_2^2$（泊松噪声用加权范数）并对输入 $x_i$ 反向求导，借助雅可比 $\frac{\partial \hat{x}_0}{\partial x_i}$ 将梯度投影回流形切方向
4. 自适应步长融合 | 按当前残差范数归一化步长 $\zeta_i = \zeta' / \|y - \mathcal{A}(\hat{x}_0)\|$ 更新 $x_{i-1} = x'_{i-1} - \zeta_i \nabla_{x_i}\|y - \mathcal{A}(\hat{x}_0)\|_2^2$
```

### 3.1 核心公式：Tweedie 估计与似然梯度

在 VP-SDE（DDPM）记号下，由 Tweedie 公式给出干净估计（式 9/10），再将其代入高斯似然梯度（式 16/21）：

$$\hat{x}_0(x_i) = \frac{1}{\sqrt{\bar{\alpha}_i}}\left(x_i + (1 - \bar{\alpha}_i)\,s_\theta(x_i, i)\right), \qquad x_{i-1} = x'_{i-1} - \zeta_i \,\nabla_{x_i}\|y - \mathcal{A}(\hat{x}_0(x_i))\|_2^2$$

> [!TIP] 为什么穿过网络求导（$\nabla_{x_i}$）如此重要？
> 链式法则展开后，梯度等于「测量残差方向 × $\frac{\partial \hat{x}_0}{\partial x_i}$」。如后来 [20 号 DDS](../mri/20-dds.md) 所揭示，这个神经网络雅可比像一盏投影灯，能把歪斜的物理梯度拍回图像流形的切平面里——代价就是每一步都要对整个 U-Net 跑一次反向传播。

### 3.2 关键设计细节

1. **近似误差上界（Theorem 1，式 14）**：用 $p(y \mid \mathbb{E}[x_0 \mid x_t])$ 替换 $\mathbb{E}[p(y \mid x_0)]$ 的 Jensen 间隙满足：

$$J \le \frac{d}{\sqrt{2\pi\sigma^2}}\,e^{-\frac{1}{2\sigma^2}}\,\|\nabla \mathcal{A}\|\,m_1$$

   即测量噪声 $\sigma$ 越大、前向算子越平滑，近似反而越紧。
2. **步长归一化与逐任务调参**：$\zeta_i = \zeta' / \|y - \mathcal{A}(\hat{x}_0(x_i))\|_2$ 避免初期残差极大时梯度爆炸。但 $\zeta'$ 并非通用常数——附录 D.1 给出：FFHQ 的 SR/修复/高斯与运动去模糊取 $\zeta'=1.0$；ImageNet 高斯去模糊取 $0.4$、运动去模糊取 $0.6$；泊松全取 $0.3$；FFHQ 相位恢复 $0.4$、非均匀去模糊 $1.0$。
3. **泊松噪声只换权重矩阵**：当光子数较大（$y_j > 20$，近似误差约 $1\%$）时，把 i.i.d. 泊松近似成方差为 $y_j$ 的高斯噪声，残差范数换成对角加权 $\|y - \mathcal{A}(\hat{x}_0)\|_{\Lambda}^2$（$\Lambda_{jj} = \frac{1}{2y_j}$，式 20/22），其余骨架不变（Algorithm 2）。
4. **「无投影」是刻意设计**：Fig. 3 对比了 MCG 与 DPS 的路径，说明带噪条件下硬测量投影带来的流形偏离大于梯度近似本身。

> [!WARNING] 工程代价（附录 C.5）
> 因为每步必须保留计算图穿回网络求导，单张 2080Ti 上 DPS（1000 NFE）耗时：FFHQ 约 **95 s/图**、ImageNet 约 **600 s/图**；同表里 DDRM 仅 **2.03 s/图**（快 40–300 倍）。后续 [20 号 DDS](../mri/20-dds.md)（改用 $\hat{x}_0$ 上跑 CG）和 [31 号 DAPS](31-daps.md)（解耦退火）本质上都是在绕开或改进这一瓶颈。

## 4. 论文证据与实验范围

**设定**：FFHQ 256（1k 验证图，分数模型来自 ILVR 的 ADM），ImageNet 256（1k 验证图，Dhariwal & Nichol 无条件 ADM）；全部 1000 NFE；测量噪声统一 $\sigma=0.05$（另有泊松 $\lambda=1.0$ 的 Figure 5）。前向算子依次为 $4\times$ bicubic 下采样超分、$128\times 128$ box 修复、$92\%$ 随机像素缺失、$61\times 61$ 高斯核（$\sigma=3$）去模糊、$61\times 61$ 运动核去模糊、傅里叶相位恢复（只留幅度）、神经网络拟合的非均匀去模糊。

**FFHQ（Table 1，FID↓ / LPIPS↓）**：

| 任务 | DPS | DDRM | MCG |
|---|---|---|---|
| SR ×4 | **39.35 / 0.214** | 62.15 / 0.294 | 87.64 / 0.520 |
| 修复（box） | **33.12 / 0.168** | 42.93 / 0.204 | 40.11 / 0.309 |
| 修复（随机 92%） | **21.19 / 0.212** | 69.71 / 0.587 | 29.26 / 0.286 |
| 高斯去模糊 | **44.05 / 0.257** | 74.92 / 0.332 | 101.2 / 0.340 |
| 运动去模糊 | **39.92 / 0.242** | — | 310.5 / 0.702 |

**ImageNet（Table 2）**：DPS 五项分别为 `50.66 / 0.337`、`38.82 / 0.262`、`35.87 / 0.303`、`62.72 / 0.444`、`56.08 / 0.389`；DDRM 首项 `59.57 / 0.339`，MCG 首项 `144.5 / 0.637`。

**非线性任务**：

- 相位恢复（Table 3，FFHQ）：DPS **55.61 / 0.399**，OSS 137.7 / 0.635，HIO 96.40 / 0.542，ER 214.1 / 0.738。注意每组方法生成 4 个样本后取最好的一次（相位恢复本身非唯一）。
- 非均匀去模糊（Table 4，FFHQ）：DPS **41.86 / 0.278**，BKS-styleGAN2 63.18 / 0.407，BKS-generic 141.0 / 0.640，MCG 180.1 / 0.695。

**成本（附录 C.5）**：单张 2080Ti，FFHQ 约 95 s/图、ImageNet 约 600 s/图（均 1000 NFE）；同表里 DDRM 每张 2.03 s、Score-SDE 36.71 s、MCG 80.10 s、PnP-ADMM 3.63 s。**这就是用 40–300 倍算力换 FID**。

**范围限制（本页判断）**：只有 2D 自然图像，没有医学数据；指标是 FID/LPIPS（Table 1/2）与相位恢复的 FID/LPIPS，没有 PSNR/SSIM 主表，也没有任何测度「重建是否忠实于测量以外的真实结构」；相位恢复的 best-of-4 使数字偏乐观；所有线性任务都用了 $\zeta'$ 的任务级调参。

## 5. 复现与审计重点

- **本站没有走查记录**：DPS 的推理由用户自己早前完成，没有留下 RECORD.md 或产物目录，所以本页不给「本站实测」数字，也不用别的方法的结果替代。
- **仓库未逐文件核对**：官方代码地址取自摘要（`DPS2022/diffusion-posterior-sampling`），本页没有 clone、也没有跑过，因此不对其目录结构或可用性作判断；权重需按仓库 README 自取（FFHQ 的 ILVR-ADM 与 OpenAI 的无条件 ImageNet ADM 两套）。
- **审计要点 1：$\zeta'$ 不是「无超参」**。论文正文只强调「一个超参」，但附录 D.1 逐任务给值，ImageNet 的去模糊还要从 1.0 降到 0.4 / 0.6。跨数据集复用时这是第一个要重调的量。
- **审计要点 2：算力口径**。1000 NFE 是 DPS 的全部分数评估次数，任何「DPS 质量高」的对比都要带着这个前提读；DAPS 的 Table 7 在同样 1000 NFE 下报 35 s/图（A100），说明这一档成本是这类方法的天花板而不是 DPS 独有。
- **审计要点 3：相位恢复的 best-of-4**。Table 3 的 55.61 是 4 次采样里挑最好的，与「单次后验采样」的语义不同；比较时必须对齐选择规则。
- **审计要点 4：Jensen 间隙界依赖 $\max\|\nabla \mathcal{A}\|$**。非均匀去模糊的 $\mathcal{A}$ 由网络拟合，界里的 $\max\|\nabla \mathcal{A}\|$ 实际不可控，理论保证在该任务上是形式上的。

## 6. 建议阅读顺序

摘要 → §3.1 式 (9)–(11)（Tweedie 与 $p(y \mid \hat{x}_0)$ 近似）→ Theorem 1 与式 (14) → §3.2（高斯式 16 / 泊松式 20）→ Algorithm 1、2 → Fig. 3（与 MCG 的几何对比）→ §4 Table 1/2 → Table 3/4（非线性）→ 附录 C.1（投影为何放大噪声）→ 附录 D.1（步长表）→ 附录 C.2/C.3（步长敏感性）。

## 7. 前后关联

- 与 [29 号 DDRM](29-ddrm.md) 是同一问题的两条路线：DDRM 用 SVD 把测量噪声「翻译」到谱域，DPS 干脆不碰 SVD、直接对 $\hat{x}_0$ 求梯度；前者快（20 NFE），后者通用（非线性可用）。
- 与 [30 号 ΠGDM](30-pigdm.md) 的差别在「用谁替换 $H^\top$」：ΠGDM 用伪逆 $H^\dagger$，DPS 用 $\mathcal{A}$ 的雅可比回传；线性、奇异值不全为 $0/1$ 时两者数值上明显不同（ΠGDM Table 1 有正面对比）。
- 与 [31 号 DAPS](31-daps.md) 是直接竞争：DAPS 的论点是 DPS 的相邻步被绑得太紧、误差无法回改，所以改成「采样边缘分布 + Langevin 内循环」；DAPS Table 1 里 DPS 在相位恢复上只有 17.64 dB。
- 与 [02 号 DDPM](02-ddpm.md)、[04 号 Score-SDE](04-score-sde.md) 是上下游：DPS 直接复用了祖先采样与 VP-SDE 的记号，只加一个似然梯度项。
- 与 [25 号 ReSample](25-resample.md) 对照：ReSample 在潜空间做「硬一致性」（解优化题 + 重采样），DPS 在像素空间做「软一致性」（梯度步），两者的分歧正是「带噪时该不该强制测量一致」。
- 与 [24 号弱先验](24-weak-priors.md) 呼应：DPS 的 Jensen 间隙界说明测量噪声越大、近似越准，这与「测量信息量决定先验要求」是同一件事的两个侧面。
- 医学侧见 [20 号 DDS](../mri/20-dds.md)：DDS 也走「后验采样 + 逐步引导」，但用分解式扩散处理 CT/MRI 的算子结构（改用干净估计上的 CG 省掉对网络求导）；[26 号 ULA-DPS](../mri/26-ula-dps.md) 则指出 DPS 收敛慢、需要调参，用精确似然 + 预条件来补。

## 8. 链接

- [arXiv:2209.14687（abs）](https://arxiv.org/abs/2209.14687)
- [arXiv HTML v2 全文](https://arxiv.org/html/2209.14687v2)
- [官方代码 DPS2022/diffusion-posterior-sampling](https://github.com/DPS2022/diffusion-posterior-sampling)
- [FFHQ 分数模型（ILVR 的 ADM，附录 D.1 指向）](https://github.com/jychoi118/ilvr_adm)
- [ImageNet 无条件 ADM（Dhariwal & Nichol）](https://github.com/openai/guided-diffusion)
