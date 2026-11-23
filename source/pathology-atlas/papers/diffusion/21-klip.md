# 21｜KLIP：用先验—后验 KL 散度做「逐块 + 逐时间窗」的局部分布偏移检测

**论文**：KLIP: Localized Distribution Shift Detection via KL-Divergence with Diffusion Priors in Inverse Problems，CVPR 2026（CVF Open Access，pp. 30823–30830）；arXiv:2605.31596（2026-05-29 首投）
**作者**：Alireza Kheirandish\*、Jihoon Hong\*、Sara Fridovich-Keil（Georgia Institute of Technology，School of Electrical and Computer Engineering；\* 共同一作，署名顺序由抛硬币决定）
**定位**：逆问题里用扩散先验做后验采样时，**无需任何 OOD 校准数据**，从采样轨迹里在线估出"先验 vs 后验"的 KL 散度，并把它限制到**空间块 × 时间窗**，从而给出可定位的分布偏移热图
**精读核验**：2026-11-22 依据 CVF Open Access 正式版 PDF（10 页，正文 §1–6、Table 1–3、Fig. 1–6）与 arXiv HTML v1 的补充材料（§7–12、Table 4–7、Fig. 7–15）逐节读过；官方代码 `voilalab/KLIP` 于同日经 GitHub API 与 raw 文件核对（main 分支，最后推送 2026-09-29，含 `pipeline/` 统一 CLI、`CT/` PaDIS 采样器、`song22/` 与三个 YAML 配置），**只读代码，未下载权重、未运行任何实验**；全部数字为论文报告值。

## 原文摘要

> Diffusion models have shown promising performance as data-driven priors for computational imaging, as well as some capacity to detect out-of-distribution (OOD) images. However, existing approaches to OOD detection often require some knowledge of the shifted distribution, fail to detect subtle or localized distribution shifts, and operate on full images, rather than the indirect measurements available in inverse problems. We propose an OOD detection metric based on the Kullback-Leibler divergence between the diffusion prior and the posterior distribution, that (i) does not require any calibration data or knowledge of the shifted distribution, and (ii) can detect whole images as OOD as well as localize OOD patches within an image. Experimentally, we show that this metric can detect subtle yet semantically meaningful distribution shifts, such as the shift from healthy liver CT scans to those with tumors, and generalizes across different types of diffusion models, datasets, and inverse problems. Our code can be found at https://github.com/voilalab/KLIP.

*来源：arXiv:2605.31596 摘要，与 CVF 正式版逐字一致（仅把 "this https URL" 还原成论文里的仓库地址）。*

## 中文摘要

> 扩散模型作为计算成像的数据驱动先验表现出很好的性能，也具备一定的分布外（OOD）图像检测能力。然而现有 OOD 检测方法往往需要关于偏移分布的若干知识、无法检测细微或局部的分布偏移、而且直接在整幅图像上操作，而不是逆问题里真正可得的间接测量。我们提出一种 OOD 检测指标，它基于扩散先验分布与后验分布之间的 Kullback-Leibler 散度，具备两点：(i) 不需要任何校准数据，也不需要关于偏移分布的知识；(ii) 既能判定整幅图像为 OOD，也能在图像内定位 OOD 块。实验上我们表明，该指标能检测到细微但语义明确的分布偏移，例如从健康肝脏 CT 到带肿瘤的 CT 的偏移，并且能跨不同类型的扩散模型、数据集与逆问题泛化。代码见 https://github.com/voilalab/KLIP。

*译文：逐句对译上方英文摘要，未增删、未压缩；专有名词与数字以原文为准。*

## 1. 三分钟摘要与推荐理由

一句话：**"观测 y 把后验从先验拉开多远"本身就是一个偏移分数**，而且这个量在后验采样过程中顺手就能估出来，不需要另训模型、不需要 OOD 校准集。把它切成小块、再按扩散时间窗积分，就得到一张能指出"哪一块、在哪一步采样里不对劲"的热图。

三件事值得读：

1. **分数有解析动机，不是拍脑袋的启发式**。§4 用高斯先验 + 高斯噪声的一维玩具例子给出闭式 $D_{\mathrm{KL}}(p(x|y)\|p(x)) = \frac{\sigma_1^2 y^2}{2(\sigma_1^2+\sigma_2^2)^2} + C$：偏移越大、后验被拉得越远，KL 越大。再由[SDE 下 KL 与分数差的恒等式](https://arxiv.org/abs/2605.31596)（式 9）把 KL 写成"似然分数范数的平方在时间上的积分"（式 11），于是后验采样里那一步"往 y 拉"的更新量就是被积函数。
2. **两级限制是本文真正的发明点**：整图 KL 在星形伪影上几乎分不开 ID/OOD（Fig. 3b），块级限制后分开（Fig. 3c），再加时间窗后 OOD 块在 $t\approx0.3$ 出现 ID 块没有的峰（Fig. 3d）。Table 2 的消融证明两个限制缺一不可：只用块，数据集级 tumor 掉到 0.65；只用时间窗，数据集级 star 掉到 0.57；两者合用 0.78 / 0.86。
3. **它是"检测数据里的偏移"，不是"检测重建幻觉"**——这是本页最需要说清的一点。KLIP 高 = 该块被观测强烈改写，说明观测里出现了先验没见过的东西；而幻觉（凭空长出的病灶）恰恰是观测**没有**约束、重建被先验单方面决定的区域，那里似然分数反而小。所以对"幻觉热点"而言，KLIP 更像一个可反过来用的**对照量**：把块级分数取低分端，可能圈出"几乎没被测量拉过"的区域。**这在本页是推断，论文没有做这个方向的实验**，但它的块级似然更新图（作者已按像素 $D_B=1$ 出图，Fig. 4/5）在技术上离"幻觉风险图"只差一个符号与一次校准。

## 2. 问题及研究位置

问题：部署在开放世界的成像系统，最重要的偏移往往最细微、最局部（小结节、撕裂、植入物）。已有的扩散模型 OOD 检测路线有三类缺口：(a) 一致性预测 / 校准类方法需要一批 OOD 图来定阈值，长尾罕见病灶根本收不齐；(b) DiffPath 式方法在**整幅图**上提特征，局部小目标被全图统计稀释，而且需要 ID 校准集拟合 KDE；(c) 它们都假定能看到图像本身，而逆问题里只有间接测量 $y=Ax+\epsilon$，图像是重建出来的。此外，"OOD 样本落在先验低密度区"这一常见假设对生成模型并不成立（作者引 [26]），所以基于似然的 NLL 在肿瘤上只有 0.535（Table 1）。

本文位置：不去设计新的异常打分网络，也不改采样器，而是**在采样轨迹里读数**——把先验/后验 KL 这个理论上"应该更大"的量做成可估计、可空间/时间定位的指标。它同时跨了两条线：扩散后验采样（DPS、Song et al. 的 PC 采样器、PaDIS）与生成模型上的 OOD 检测。

## 3. 核心方法和数据流

```text
输入：测量 y（24 视角稀疏 CT 投影 / 高斯模糊图）、ID 上训练的扩散先验 s_θ、一次后验采样器
超参：块大小 D_B、时间窗 [t_0, t_1]（在"星形伪影"调参集上网格搜索）

for k = 1..K（CT: K=5；CelebA: K=8）:
    从 x_T ~ N(0, σ_T² I) 起，按后验采样迭代（式 6）：
        Δx_t = [f(x,t) − g(t)²(s_θ(x_t;t) + s_l(x_t,y;t))]Δt + g(t)z
    每一步记录"被似然拉动的量"
        PC 采样器（Song et al.）：s_l ≈ (x_t − x_t')/g(t)²，x_t' 为近端一致性优化步的解（式 13–15）
        DPS / PaDIS：s_l ≈ −(1/σ²)∇‖y − A(x̂_0(x_t))‖²（式 16）
    把 g(t)·s_l 按 D_B×D_B 切成 N_B 块，得到 (T, N_B) 的归一化更新张量

打分（式 12）：
    KLIP(B_i, [t_0,t_1]; y) = ½ ∫_{t_0}^{t_1} E_{x~p_t(x|y)} ‖ g(t) s_l(x,y;t)|_{B_i} ‖² dt
    → 对 K 个样本取均值近似期望，对时间步求和近似积分
判读：
    数据集级：一张图只要任一块超过阈值即判 OOD → AUC
    图像级：所有 OOD 图的全部块上算 AUC，并用体膜外的掩码排除背景
```

三个要点：

1. **"校准无关"的准确含义**：不需要目标偏移（肿瘤/疤痕）的任何样本，但作者自己承认仍然需要一个**合成伪影调参集**（在 ID 图上叠加合成星形伪影）来定 $D_B$ 与 $[t_0,t_1]$，且调好的值直接迁到肿瘤与疤痕任务上。Table 3 正是这个前提的压力测试：换成在肿瘤上调参，数据集级 star 从 0.86† 掉到 0.68，而 tumor 从 0.78 升到 0.87†——**"免校准"不等于"免调参"**。
2. **时间窗的物理意义**：扩散采样早期定低频、后加细节，所以窗位置决定检测什么尺度的异常。Fig. 6 里哈利·波特的疤（小）在 $t\in[0.1,0.2]$ 才显，穆迪的假眼（大）在 $[0.2,0.3]$ 与 $[0.3,0.4]$ 就显；这也解释了为什么一组 $[t_0,t_1]$ 不能对所有病灶最优。
3. **对采样器的依赖是可控的**：PC 采样器没有显式似然分数，作者用"近端步解出的 $x_t'$ 与 $x_t$ 之差"当 $g(t)^2 s_l$ 的代理（式 14–15），这是本文能同时套用 PaDIS 与 Song et al. 两种采样的关键工程桥。

## 4. 论文证据与实验范围

**数据与设定**：CHAOS 腹部 CT（512×512，40 名患者，均为潜在肝捐献者故肝脏健康），取测试集 100 张为 ID，另按 Hu et al. 2023 的无标签肝肿瘤合成法给每张 ID 图加肿瘤得 OOD 集；24 视角稀疏 CT。CelebA 为 ID，DDPM（`google/ddpm-celebahq-256`）做高斯去模糊，OOD 为 20 张加合成疤痕的测试图 + 15 张影视角色图（《星际迷航》《哈利·波特》）。

**主结果（Table 1，AUC）**：

| 任务 | 最强基线 | raw $D_{KL}$ | KLIP |
|---|---|---|---|
| CT 数据集级·星形（PC） | CutPaste 0.999 / SimpleNet 0.993 / NLL 0.586 / DiffPath 0.688 | 0.541 | **0.855†** |
| CT 数据集级·肿瘤（PC） | CutPaste 0.505 / SimpleNet 0.504 / NLL 0.535 / DiffPath 0.368 | 0.602 | **0.776** |
| CT 数据集级·肿瘤（PaDIS） | — | 0.672 | **0.732** |
| CT 图像级·肿瘤（PC） | CutPaste 0.441 / SimpleNet 0.592 | 0.856 | **0.878** |
| CelebA 图像级·疤痕 | — | 0.675 | **0.867** |
| CelebA 图像级·角色特征 | — | 0.482 | **0.772** |

注意 CutPaste/SimpleNet 直接看真图，而扩散方法只看间接测量，作者自己标注了这条不公平；但在**肿瘤**这一类上两个非扩散方法掉到 0.44–0.59，说明通用工业异常检测器对"器官内低对比度病灶"几乎没有迁移能力。

**消融（Table 2，PC 模型）**：$D_{KL}$ 数据集级 0.54 / 0.60、图像级 0.84 / 0.86 → 加块 0.85† / 0.65、0.88† / 0.91 → 加时间 0.57† / 0.78、0.86† / 0.81 → KLIP 0.86† / 0.78、0.91† / 0.88。块限制在数据集级 star 上贡献最大，时间限制在数据集级 tumor 上贡献最大。

**补充材料**：模型失配（Table 4，真模糊核 $\sigma=9$，重建核 3/7/9/11/13 → 0.809/0.897/0.904/0.898/0.893）；样本数（Table 6：1/4/8/16/32 → 0.813/0.854/0.904/0.905/0.909）；运行时间（Table 5：只采样 375 s，KLIP 383 s，NLL 518 s，DiffPath 548 s）；6 种肿瘤大小×深浅的稳健性（Table 7），其中 PaDIS 数据集级所有配置都停在 0.499–0.523，作者归因为超参没有为该模型单独调。

**范围限制**：作者自陈是 **inverse crime**——模拟测量与重建用同一前向模型；肿瘤/疤痕均为合成；只有 2D；仅有 AUC 一个指标，没有定位的 IoU/Dice；"角色图"没有逐像素标注，只能说热图"落在"植入物/假眼上。本页判断：Table 7 里 PaDIS 的数据集级 AUC 在 6 种肿瘤配置上全部停在 0.499–0.523（等于抛硬币），而同一组超参在 PC 上是 0.754–0.782，"跨模型免调参"实际上只在 PC 上被示范成功。

## 5. 复现与审计重点

- **仓库是真实现，不是 README**：`pipeline/cli.py`（sample/score/auroc 三段式，可只重打分而不重采样）、`pipeline/scoring/aggregate.py`（式 12 的块切分 + 时间窗 + 范数平方 + 期望）、`pipeline/samplers/{song22_jax,padis_torch,ddpm_torch}.py`、四个 YAML（`chaos_song_image` / `chaos_song_dataset` / `chaos_padis_image` / `celeba_image`）、`pipeline/tests/test_scoring_recipe.py`（对旧 PaDIS notebook 做逐位等价校验）。采样器内部直接 shell out 到 `CT/dps_sampling_test.py` 与 `song22/_pipeline_sample.py`，不重写。
- **权重与数据不在仓库**：checkpoints（song22 Orbax ~59 MB、PaDIS `.pkl` ~208 MB）与 `chaos_{id,ood_tumor,ood_star}.npy` 都在 Google Drive；`README` 明说 CelebA 的 `celeba_test.npy` / `celeba_characters.npy` **"will be added in a later release"**——即论文里 CelebA 那条线目前无法端到端复现。
- **能覆盖哪些实验**：三个后端都能跑数据集级与图像级打分，对应 Table 1/2/3；Table 5 的耗时、Table 6 的样本数敏感性可以通过改配置里的样本数 K 复现；Table 7 的 6 组肿瘤需要自己按 Hu et al. 生成（仓库不带脚本）。
- **两处数字待核**：Fig. 8 图注写失配实验用"$\sigma\in\{1,5,13,17\}$"，而 Table 4 列的是 $\{3,7,9,11,13\}$（真值均为 9）；论文没有给 $D_B$、$[t_0,t_1]$ 的具体取值，只在 Fig. 6 出现过 $[0.15,0.35]$ 一例，复现时只能靠 YAML 里的默认值反推。
- **审计重点**：①"无校准"实为"无目标偏移样本、但仍需合成伪影调参"，跨任务迁移时 Table 3 显示掉点可达 0.18 AUC；②阈值按"任一块超阈"聚合，块多则假阳性机会多，作者没有报告块数与数据集级的耦合；③inverse crime 使所有 AUC 偏乐观，真实扫描仪失配下的曲线未知（Table 4 只做了模糊核失配）。

## 6. 建议阅读顺序

摘要 → §1 三条贡献 → §3 式 (5)(6)（先分清"似然分数"是什么）→ §4 高斯玩具例（式 7–8）→ 式 (9)–(11) 的 KL—分数恒等 → 式 (12) KLIP 定义 → Fig. 3 的四张直方图（为什么必须切块、切时间）→ §5 实验设定（调参集是星形伪影）→ Table 1 → Table 2 消融 → Table 3 敏感性 → Fig. 4/5 热图 → 补充材料 §7（PC 采样器怎么取 $s_l$）、§11 运行时间、§10 失配 → §6 局限。

## 7. 前后关联

- 与 [DDS](../mri/20-dds.md)、[Score-MRI](../mri/06-score-mri.md)、[DDIP](../mri/32-ddip.md) 同属"扩散先验解逆问题"这一支：那几篇在改**怎么采样**，KLIP 不改采样、只在采样轨迹上**读出一个诊断量**，可以视为任意后验采样器的即插即用旁挂模块。
- 与 [SCD](../mri/31-scd.md) 的关系最直接：SCD 在采样中做 LoRA 测试时自适应，本质是"用测量把先验往当前图像上拽"，而 KLIP 度量的正是"拽了多少"。本站复现 SCD 时 Ellipses→AAPM 旗舰设定未能复现（SCD 反而低于 DDS），且对 lr/TV/步数极敏——KLIP 的块级分数恰好可以回答"是整幅图都被拽偏了，还是只有某几块"，把"整体掉点"拆成"局部偏移"来诊断。**本页判断**：这是把 KLIP 当 SCD 复现排错工具的最实用入口。
- 与 [HalluGen](11-hallugen.md) 构成幻觉问题的两端：HalluGen 用定向梯度**制造**幻觉并给标注，KLIP 用似然分数**读出**"哪里被观测改写"。二者拼起来才完整——先有"哪块被测量拉动弱"的低分图，再在该区域问"先验单独会往哪里编"。**本页判断（推断，未验证）**：把 KLIP 块级分数取负号当幻觉风险代理，在 GPU 上可直接用现有 `pipeline/cli.py --stage sample/score` 验证，成本约等于一次常规重建 + 2% 打分时间。
- 与 [BiasRecon](../mri/15-biasrecon.md) 对照：BiasRecon 把"先验偏差"显式建模进重建，KLIP 不去纠正偏差，只报告偏差在哪；前者是方法，后者是仪表。
- 与同批的 [CDPIR](../mri/35-cdpir.md)、[测量域 KL 偏移检测](22-meas-kl.md)、[弱先验](24-weak-priors.md)、[生成先验的偏移 UQ](23-lpn-shift-uq.md) 可当作"测量域/像素域的偏移信号"四种不同取法来横读：KLIP 在**重建轨迹里**取，22 号在**测量域**取，23 号做 UQ，24 号讨论先验本身弱时的退化。

## 8. 链接

- [CVF Open Access 正式版 PDF（CVPR 2026，pp. 30823–30830）](https://openaccess.thecvf.com/content/CVPR2026/papers/Kheirandish_KLIP_Localized_Distribution_Shift_Detection_via_KL-Divergence_with_Diffusion_Priors_CVPR_2026_paper.pdf)
- [CVF 论文页（含官方 BibTeX）](https://openaccess.thecvf.com/content/CVPR2026/html/Kheirandish_KLIP_Localized_Distribution_Shift_Detection_via_KL-Divergence_with_Diffusion_Priors_CVPR_2026_paper.html)
- [arXiv:2605.31596](https://arxiv.org/abs/2605.31596)（2026-05-29 提交；HTML 版含 §7–12 补充材料）
- [官方代码 voilalab/KLIP](https://github.com/voilalab/KLIP)（2026-11-22 核查：`pipeline/` + `CT/` + `song22/` 真实实现，权重与 CHAOS 数据在 Google Drive，CelebA 数据未发布）
- [CHAOS 挑战主页](https://chaos.grand-challenge.org/)
