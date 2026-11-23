# 33｜AdaDiff：先 8 步扩散出初解，再把先验按扫描微调一遍

**论文**：Adaptive diffusion priors for accelerated MRI reconstruction，Medical Image Analysis 88 (2023) 102872；arXiv:2207.05876（v1 2022-07-12）
**定位**：无条件下扩散先验 + 推理期逐扫描自适应（用数据一致性损失反传更新生成器）；对抗映射式少步扩散骨干；算符漂移与图像分布漂移两类跨域实验
**精读核验**：依据作者单位公开的正式版 PDF（MedIA 88:102872，15 页，§1–7、Table 1–11、Fig. 1–7）逐节读过，并在 ScienceDirect/DOI 页核对卷期、页码与在线日期（2023-06-20）；官方代码 `icon-lab/AdaDiff` 于 2026-11-22 经 GitHub API 核对：README、单/多线圈训练与推理脚本（各约 21 KB）、`datasets_prep/brain_datasets.py`、`utils/models`（生成器/判别器）、`utils/op`（CUDA 核）齐全，默认分支仅 3 次提交（2022-10-13 起），**无预训练权重、无数据制作脚本**；本站未运行代码、未做复现。

## 原文摘要

> Deep MRI reconstruction is commonly performed with conditional models that de-alias undersampled acquisitions to recover images consistent with fully-sampled data. Since conditional models are trained with knowledge of the imaging operator, they can show poor generalization across variable operators. Unconditional models instead learn generative image priors decoupled from the operator to improve reliability against domain shifts related to the imaging operator. Recent diffusion models are particularly promising given their high sample fidelity. Nevertheless, inference with a static image prior can perform suboptimally. Here we propose the first adaptive diffusion prior for MRI reconstruction, AdaDiff, to improve performance and reliability against domain shifts. AdaDiff leverages an efficient diffusion prior trained via adversarial mapping over large reverse diffusion steps. A two-phase reconstruction is executed following training: a rapid-diffusion phase that produces an initial reconstruction with the trained prior, and an adaptation phase that further refines the result by updating the prior to minimize data-consistency loss. Demonstrations on multi-contrast brain MRI clearly indicate that AdaDiff outperforms competing conditional and unconditional methods under domain shifts, and achieves superior or on par within-domain performance.

*来源：arXiv:2207.05876 摘要，与 MedIA 正式版摘要逐字一致。*

## 中文摘要

> 深度 MRI 重建通常用条件模型完成，即把欠采样采集去混叠、恢复出与全采样数据一致的图像。由于条件模型训练时就知道成像算符，它们在算符变化时泛化很差。无条件模型转而学习与算符解耦的生成式图像先验，从而提升面对成像算符相关域偏移时的可靠性。近期的扩散模型因样本保真度高而尤其被看好。然而，用一个静态图像先验做推理仍可能次优。本文提出首个用于 MRI 重建的自适应扩散先验 AdaDiff，以提升性能与对域偏移的可靠性。AdaDiff 利用一个通过大步长反扩散上的对抗映射训练出来的高效扩散先验。训练之后执行两阶段重建：快速扩散阶段用训练好的先验产生初始重建；自适应阶段通过更新先验以最小化数据一致性损失来进一步精修结果。多对比度脑 MRI 上的实验清楚表明，AdaDiff 在域偏移下优于竞争的条件与无条件方法，在同域内则达到更优或相当的性能。

*译文：逐句对译，未增删、未压缩；术语与数字以原文为准。*

## 1. 三分钟摘要与推荐理由

一句话：**把「先验」当参数，而不是当固定网络**。先训一个与算符无关的扩散先验，推理时先用 8 步快速出初解，再只对当前这一个扫描反传 1000 步、把生成器本身调向「重建结果过一遍算符要等于实测 k-space」。这是 MRI 里最早把 test-time adaptation 做在扩散先验权重上（而不是做在采样轨迹或 LoRA 上）的工作之一。

三点值得读：

1. **两个阶段的分工很干净**：A 阶段负责"像 MR 图"，B 阶段负责"对得上这台机器的测量"。作者的消融显示增益主要来自 B 阶段——去掉自适应（静态 8 步先验）后 PSNR 掉到 40.23 dB，而完整模型 40.89 dB（Table 10，T1，J=1000）；有趣的是自适应甚至能部分救回一个**完全没训过**的生成器（`w/o train.` 40.33 dB），这直接印证"DC 损失本身就能把网络推向解剖一致"。
2. **代价被写得很直白**：每层 slice 训练 131.3 s、推理 131.4 s（Table 11，IXI R=4，J=1000），比 MoDL 的 26.5 s 训练 / 0.05 s 推理高三个数量级。它换来的是跨域时更好的曲线，不是同域内的绝对最优。
3. **跨域做得比同期工作细**：不只换加速倍率，还分别换采样轨迹（2D→1D）、换线圈数（5→10 虚拟线圈）、换图像分布（fastMRI 训练 → IXI 测试）。

**对幻觉问题的意义（本页判断）**：B 阶段的目标函数只有 `‖A G(x_init,0) − y‖₁`，没有任何"别离开先验流形"的约束。对病灶这类小结构，只要伪造的组织能拟合已采样 k-space，优化就没有理由把它推开；论文只报 PSNR/SSIM/FID/LPIPS，没有任何病灶层面的伪造/抹除统计。所以这篇更像是"先验自适应会不会放大伪造"这个问题的一个现成实验平台，而不是它的答案。

## 2. 问题及研究位置

问题：条件重建模型（rGAN、MoDL 一类）在训练时见过成像算符，加速倍率、采样轨迹、线圈数一变就要重训；无条件先验（GAN、扩散）把先验与算符解耦，泛化更好，但**先验本身仍是在训练分布上学的**，测试扫描若来自不同分布（不同站点、不同对比度、不同人群），静态先验同样次优。

位置：

- **无条件 GAN + 推理期自适应**：Narnhofer 等的 GANprior 已经做过"反传更新生成器拟合测量"，本文的 B 阶段与它同构；差别在生成器换成分散步扩散，样本多样性和保真度更好。
- **静态扩散先验**：DDPM（1000 步）、DiffRecon（4000 步训练 / 100+20 步推理）在推理时先验不动；本文的 A 阶段只是给 B 阶段找一个好初值。
- **快速采样**：DD-GAN 一系的对抗映射把几百步压到 8 步，这是本文能在 B 阶段前便宜地拿到初解的前提。

## 3. 核心方法和数据流

```text
训练（先验，完全不知道算符）
  IXI 单线圈幅值图（T1/T2/PD 混合，pad 到 256）/ fastMRI 多线圈复值（5 或 10 虚拟线圈，288）
  → 前向扩散按大步长 k = 125 跳步加噪（T/k = 8 步），噪声方差 γ_t 放大以补偿大步长
  → 生成器 G(x_{t+k}, t+k) 直接预测去噪图 x̃0；再由闭式 q(x_t | x_{t+k}, x̃0) = N(μ, γ) 采样 x_t
  → 判别器 D(x_t, x_{t+k}) 区分「真实加噪对」与「G 合成对」，加梯度惩罚
  → 得到一个 8 步即可出图的对抗式扩散先验 G_θG（6 级编码/解码，后两级带注意力，AdaGN 调制）

推理（两阶段，逐扫描）
  阶段 A 快速扩散（8 次迭代，无梯度）
    x_T ~ N(0, I)
    循环 t+k → t：
      ① 数据一致性投影   ẋ_{t+k} = x_{t+k} + Aᴴ(y − A x_{t+k})
      ② 反扩散投影       x_t ~ q(x_t | x_{t+k} = ẋ_{t+k}, x̃0 = G(ẋ_{t+k}, t+k))
    → 初解 x_init = x_0
  阶段 B 先验自适应（Adam，lr = 1e-3，J = 1000）
    固定输入 x_init，反传更新生成器全部参数
    θG* = argmin_θG ‖ A · G_θG(x_init, 0) − y ‖₁      （A 用 ESPIRiT 线圈灵敏度 + 处方掩膜）
    → 末次输出 x_fin = G_{θG^J}(x_init, 0)
```

三个要点：

1. **生成器输出的是 x̃0（去噪图），不是噪声**；采样仍走闭式后验，因此即使生成器训练不充分，中间步也不会飞掉（§3.3.1 式 14–16）。
2. **自适应只作用于最后一个时间步**（t=0），作者明确说这是为省显存和时间的折中；对全部扩散步反传会成倍增加显存（§6 讨论）。
3. **A 用 ℓ1 而不是 ℓ2 做 DC 损失**，且不设早停/正则；论文提到 J=1000 之后感知指标几乎不变，所以 J 是算力上限而非收敛判据。

## 4. 论文证据与实验范围

**数据**：IXI（T1/T2/PD，21/15/30 个被试 → 2268/1620/3240 个横断面，单线圈幅值图）；fastMRI 脑（T1/T2/FLAIR，240/60/120 个被试 → 2400/600/1200 个横断面，几何线圈压缩到 5 或 10 个虚拟线圈，保留 >95% / >98% 能量）。回顾式变密度随机欠采样，R=4/8/12，ESPIRiT 从全采样中心区估灵敏度；**一个模型混合多个对比度训练**，不告诉模型对比度标签。

**同域（Table 1/2）**：IXI R=4 T1 42.1±1.6 dB / 99.1±0.3%，MoDL 41.7 / 99.0；T2 41.9 vs 41.4；PD 42.6 vs 42.0。fastMRI R=4：T1 40.2±1.7 / 95.9 vs MoDL 39.8 / 95.7；**T2 只有 37.7 / 96.2，输给 DiffRecon 39.1 / 96.8**；FLAIR 36.2 / 92.5 vs MoDL 36.0 / 92.7。平均领先静态扩散先验 1.3 dB / 1.4%，领先条件模型 2.0 dB / 2.5%。

**算符漂移（R 4→8/12，Table 3/4）**：平均领先静态扩散 0.9 dB / 1.5%、条件模型 2.3 dB / 4.4%。关键对比：R=8 时 AdaDiff 对 MoDL 的优势从同域的 0.3 dB / 0.4% 扩到 1.5 dB / 2.3%。fastMRI R=8 T1 37.2±1.5 / 93.5 vs MoDL 36.4 / 93.3。

**采样轨迹与线圈数漂移（Table 5，R=4）**：训练 2D+5 线圈、测 1D+5 线圈时 T1 36.5 / 93.3 vs MoDL 35.3 / 92.8、DDPM 35.7 / 91.2；测 2D+10 线圈时 T1 40.2 / 96.1 vs MoDL 39.7 / 95.7，但 T2 37.7 / 96.4 仍输给 DiffRecon 39.2 / 97.1。作者自己指出：轨迹漂移下比 MoDL 强不少，线圈数漂移下优势很小。

**图像分布漂移（fastMRI→IXI，Table 6）**：R=4 T1 41.0±2.1 / 98.6，DiffRecon 38.8 / 98.6、DDPM 35.3 / 90.1、MoDL 34.1 / 89.3；R=8 PD 35.6 / 95.2 vs MoDL 30.0 / 73.9。平均领先条件模型 8.0 dB / 21.8%、静态扩散 3.1 dB / 5.7%——**这是增益最大的一档**。

**消融（Table 7/9/10）**：步数 T/k=4/8/16/32 的 FID 为 38.33 / 31.99 / 32.99 / 32.78，8 步之后基本收益递减；去掉随机隐变量 z（非自适应归一化）FID 34.05 vs 31.99；J=1000 时 T1：静态先验 40.23 dB、无训练先验 40.33 dB、非对抗映射 40.90 dB、完整 40.89 dB——**在 T1 上非对抗变体与完整模型打平**，说明对抗映射的贡献主要体现在感知指标（FID 36.35→31.99）而非 PSNR。

## 5. 复现与审计重点

- **代码范围**：单线圈与多线圈各有独立训练/推理脚本，含生成器（`ncsnpp_generator_adagn.py`）、判别器、FIR 上/下采样 CUDA 核、EMA；README 给出可直接复制的命令行（单线圈 256、`ch_mult 1 1 2 2 4 4`、batch 8、500 epochs；多线圈 288、`ch_mult 1 1 1 2 2`、`attn_resolutions 18`；推理 `--itr_inf 1000 --lr_g 1e-3 --R 4 --reset_opt True`）。
- **数据是硬门槛**：`datasets_prep/brain_datasets.py` 只读作者本地已做好的 `.mat`（`../datasets/recsynth/IXI_gaussian/T1_1_multi_synth_recon_<phase>.mat`、`../datasets/fast_mri/brain/T1/T1_under_sampled_4x_multicoil_<phase>.mat`），**没有下载/预处理脚本**。IXI 从 152 补零到 256 并归一化到 [-1,1]；fastMRI 需要自己用 ESPIRiT 估灵敏度、做变密度掩膜、几何压缩线圈。想复现 Table 1/2 基本等于自己重写数据管线。
- **超参与论文对不上**：论文 §4.3 写 AdaDiff 训练学习率 6×10⁻³，README 传的是 `lr_d 1e-4 / lr_g 1.6e-4`（DD-GAN 默认值）。谁对不清楚，复现时两边都要试；这在本页判断里是最大的单点风险。
- **权重不公开**：仓库无 checkpoint。按 131.3 s/横断面 × 2400 个训练样本 × 500 epochs 估算训练时间，再叠加 131.4 s/横断面的推理，整篇复现的算力不低（论文称用 RTX 3090）。
- **指标口径**：PSNR/SSIM 对全采参考图计算，图上先归一化到单位均值；显著性用非参数 signed-rank 检验，FID 不做检验。指标全是解剖一致性，**没有病灶/伪影层面的评估**，也没有读片者研究。
- **作者自己承认的弱点**：静态 8 步变体的指标甚至低于零填充（ZF）和 DDPM（§5.4 末段），因为 8 步只做 8 次 DC 投影，解剖一致性天然吃亏；这说明框架的性能高度依赖 B 阶段，A 阶段单独拿出来是"好看但不对数据"。

## 6. 建议阅读顺序

摘要 → §1 贡献三条 → Fig. 2（两阶段示意）→ §3.3.1 式 8–18（大步长 + 对抗映射 + 闭式后验）→ §3.3.2 式 19–22（DC 投影与自适应目标）→ §4.3 超参（k=125、8 步、J=1000）→ Table 1/2 同域 → Table 3/4 加速漂移 → Table 5 轨迹/线圈 → Table 6 分布漂移 → Table 10 消融 → Table 11 时间 → §6 讨论（为什么 B 阶段有意义、为什么不做全步反传）。

## 7. 前后关联

- 与 [DDS](20-dds.md)、[Score-MRI](06-score-mri.md) 对照：那是"静态扩散先验 + 推理时在采样里做一致性"，先验不动；AdaDiff 把"不动先验"当成病症，这正是它要修的。
- 与 [SCD](31-scd.md) 最该成对读：同样承认"静态先验在分布漂移下失效"，但 SCD 只更新采样期注入的 LoRA 低秩增量，AdaDiff 直接更新整个生成器。代价差异巨大（LoRA 小、全参数反传大），效果对比取决于任务；SCD 的旗舰 Ellipses→AAPM 复现不成立这一事实，提示这类"跨域增益"必须自己重跑。
- 与 [DDIP](32-ddip.md) 对照：DDIP 也是测试时自适应（把扩散先验的可训练副本对齐到当前测量），两者几乎是同一思想的两条线，读的时候重点比较"自适应作用在什么上"（DDIP：整个去噪网络副本；AdaDiff：生成器 + 单步 t=0）。
- 与 [PET DDIP](34-pet-ddip.md)、[CDPIR](35-cdpir.md) 一起看，可以把"TTA 在 MRI / PET / 通用逆问题上的迁移"拉成一条线。
- 与 [BiasRecon](15-biasrecon.md) 对照：同样是推理期按扫描适配，但 BiasRecon 只调每层两个频率缩放系数（总数不到 100），并用 SURE 自动调数据一致性权重；AdaDiff 则更新整个先验网络，是"改多少参数"这条轴上的两端。
- 对幻觉问题：[HalluGen](../diffusion/11-hallugen.md) 提供了量化伪造/抹除的评测框架；本文的 B 阶段只最小化 DC 损失（本页判断）是"数据一致但解剖错误"的天然温床，可用 HalluGen 的指标把 Table 6 那类高增益场景重测一遍。

## 8. 链接

- [DOI / ScienceDirect 正式版（MedIA 88:102872）](https://doi.org/10.1016/j.media.2023.102872)
- [作者单位公开的正式版 PDF](https://www.icon.bilkent.edu.tr/docs/Gungor-2023.pdf)
- [arXiv:2207.05876](https://arxiv.org/abs/2207.05876)
- [官方代码 icon-lab/AdaDiff（2026-11-22 核查：训练/推理脚本齐全，无权重）](https://github.com/icon-lab/AdaDiff)
- [fastMRI 数据与基线](https://fastmri.med.nyu.edu/)
- [IXI 数据集](http://brain-development.org/ixi-dataset/)
