# 37｜通用先验：别用大网络，去自然图像上训一个小感受野的分数模型

**论文**：Bigger Isn't Always Better: Towards a General Prior for Medical Image Reconstruction，Lukas Glaszner, Martin Zach, Thomas Pock，International Journal of Computer Vision（IJCV）134(6), Article 307, 2026，DOI 10.1007/s11263-026-02904-1；arXiv:2501.07376（2025-01-13 首版，仅 Glaszner & Zach 两作者，GCPR 2024 会议版 DOI 10.1007/978-3-031-85181-0_18）
**定位**：医学重建的"通用扩散先验"——把 ncsnpp 的深度（感受野）当唯一变量做系统消融，并证明 CelebA-HQ 自然图像训出的分数模型在跨域（OOD）MRI/CT 上胜过医学数据训出的模型
**精读核验**：2026-11-22 依据 arXiv:2501.07376 全文（ar5iv 渲染，§1–5 + 附录 A/B，Table 1–3、Fig. 1–5）逐节读过；Crossref 核对 IJCV 卷期、三位作者与 DOI；官方仓库 `VLOGroup/bigger-isnt-always-better` 经 GitHub 网页核对（26 个文件 + models/ physics/ training_scripts/ evaluation/ 等目录，2026-06 仍在更新），**只读代码未运行、未复现任何数字**。

## 原文摘要

> Diffusion models play an important role in many state-of-the-art algorithms to solve inverse problems in imaging. In particular, reconstructing MRI and CT images from undersampled data can be reformulated as a canonical inverse problem that benefits from strong priors. Researchers typically re-purpose models originally designed for unconditional sampling without modifications and achieve remarkable accuracy on in-distribution (ID) reconstruction. However, due to the scarce availability of training data and the large number of different imaging setups, increasing the generalization capabilities of diffusion-based priors is key to clinical adoption. To do so, we propose two solutions: (i) using smaller models and (ii) training on natural images. Using three different posterior sampling algorithms, we evaluate the influence of network size and training data. Our smallest model, effectively a ResNet, performs almost as good as an attention U-Net on ID reconstruction, while being significantly more robust towards distribution shifts. Furthermore, we introduce models trained on natural images and demonstrate that they can be used in both MRI and CT reconstruction, outperforming models trained on medical images in OOD cases. As a result of our findings, we strongly caution against simply re-using very large networks and encourage researchers to adapt the model complexity to the respective task.

*来源：IJCV 正式版摘要（Springer/Crossref 记录，与官方仓库 README 引用一致）。arXiv 首版摘要写的是 "two different posterior sampling algorithms"，期刊版扩为三种并补了 OOD 泛化的动机段，结论未变。*

## 中文摘要

> 扩散模型已成为求解成像逆问题（尤其欠采样 MRI/CT 重建）的许多先进算法的核心。研究者通常直接把为无条件采样设计的大网络拿来用，不做修改，在同分布（ID）重建上取得很高精度。但训练数据稀缺、成像设置繁多，提升扩散先验的泛化能力是临床落地的前提。为此作者提出两条对策：(i) 用小模型；(ii) 用自然图像训练。借助三种后验采样算法，他们评估网络规模与训练数据的影响。最小的模型本质上就是一个 ResNet，ID 重建几乎不输带注意力的 U-Net，但对分布偏移明显更稳健。此外，自然图像训练的模型可同时用于 MRI 和 CT，在 OOD 情形下胜过医学图像训练的模型。结论：不要盲目复用超大网络，应按任务调整模型复杂度；通向通用扩散先验的关键一步是训练在自然图像上。

*译文：对应上方期刊版摘要逐句对译，未增删内容。术语（ID/OOD/attention U-Net）保留英文缩写。*

## 1. 三分钟摘要与推荐理由

结论有两条，彼此独立：

1. **大网络不是必需品**。作者把 Song et al. 的 ncsnpp 按"深度 d"切成 5 档（d=4\* 带自注意力、d=4 去掉注意力、d=3/2/1），其余全部固定。d=1 只有 5.3M 参数（d=4\* 为 61.4M，对照 U-Net 496M），本质是一个残差卷积网，感受野 49×49。它在 ID 重建上"几乎一样好"，在 OOD 上反而更好。
2. **自然图像可以当医学先验**。CelebA-HQ（30 000 张、下采样到 320×320）训出的同一批模型，同时用于 MRI 和 CT；在 OOD 病例上稳定超过对应医学域训练的模型（Table 3 头 CT，Nθ=60：CelebA d=3 35.14 dB vs CT-trained d=3 34.93 dB）。

作者的解释是 **局部统计假设**：不同解剖/对比度在全局上差异极大（Fig. 1 左的均值图各不相同），但图像梯度的负对数直方图（Fig. 1 右，6 个数据集叠画）几乎重合。如果重建主要由局部特征驱动，那么小感受野 + 多样化的局部特征库（自然图像）就够用。这个论证是全篇的骨架，值得单独记住。

同时有一条**警示性的观察**：默认的数据一致性映射权重 λ=1 极大，以至于分数模型不需要准确学到先验分布——Fig. 5 里只有当 λ 降到 0.001–0.005 量级，CelebA 模型才把"人脸"纹理印到膝盖重建图上；λ∈[0.01,0.05] 只剩混叠残影。这也是本文的核心风险提示：通用自然先验在弱数据一致性下会产生**域外语义幻觉**（本页判断：这正是"用大生成先验做医学重建"最需要审计的失效模式，作者只用一张定性图说明，没有给出幻觉的定量指标）。

推荐理由：这是该方向少见的"把先验容量与先验来源拆开做控制变量"的工作，且是**同一组模型跨 MRI/CT 两模态**，对"通用先验到底能通用到什么程度"给出了可复现的基线。缺点是全部为实数仿真、无真实欠采样数据、只报 PSNR/SSIM。

## 2. 问题及研究位置

问题：扩散先验做医学重建时，研究者默认复用为无条件采样设计的大 U-Net（ncsnpp）。但 (a) 后验采样在大多数模型上根本不可行（Gupta et al. 已证），(b) OOD 时网络在重建一个它从未训练过的分布——按贝叶斯逻辑这不该成立。作者追问：那这些算法到底靠什么在重建？

位置：

- **判别式重建**（E2E-VarNet 一族）：ID 强，但跨对比度/解剖/掩膜必须分别训练。
- **医学域生成先验**（Chung & Ye 的 score-MRI、Jalal et al. 的 csgm-mri-langevin）：ID 很强，OOD 退化；训练数据受隐私与规模限制。
- **自然域大模型路线**（后来的工作，如用 Stable Diffusion 做 MRI）：数据非精选，LAION-5B 里可能混入医学图像，无法保证"纯自然域"这一对照条件。本文用 CelebA-HQ 就是为了排除这个混淆。
- **本文**：不改采样算法，只改先验的容量（感受野）与训练分布，并把两者做 2×5 的网格比较。

## 3. 核心方法和数据流

```text
训练（离线，5 档深度 × 3 个数据域 = 15 个分数模型）
  数据：fastMRI CORPD 膝（7260 张 320² 切片，取每卷中央 15 层）
        LoDoPaB-CT 胸（250 例 × 120 层 = 30 000 张，下采样 320²）
        CelebA-HQ（30 000 张，下采样 320²）
  模型：VE-SDE 分数网络，U-Net 式编码器/瓶颈/解码器
        d=4*（带自注意力） / d=4（无注意力） / d=3 / d=2 / d=1
        通道 128（输入输出分辨率）/ 256（其余），BigGAN 残差块
        深度 d 只改"层数/分辨率数"，参数量 → 感受野 r0 单调变化
  损失：式(6) 去噪分数匹配，2.5M 迭代，Adam，warmup 5k，EMA 0.999

重建（推理，不改算法）
  测量 y = A x（MRI: A = M∘F；CT: A = M∘R，稀疏视角 Nθ=60/30）
  两种后验采样：
    (a) PC（Chung & Ye）：预测步解反向 SDE + Langevin 校正，250 个噪声尺度
    (b) ALD（Jalal et al.）：退火 Langevin，仅用于 MRI（算力限制）
  每步后施加数据一致性
    x_i ← Re(x_i + λ A*(y − A x_i))，λ=1（除 λ 消融外）
  λ=0 → 无条件采样；λ 小 → 先验主导（会出人脸）
```

关键设计点：**感受野是唯一被操纵的变量**。Table 1 给出 r0：d=4\*/4 >640，d=3 331，d=2 143，d=1 49（图 320×320，r0>640 才意味着全图连通）。作者同时提醒 Luo et al. 的结论——理论感受野高估有效感受野，d=1 的实际影响范围远小于 49×49。

## 4. 论文证据与实验范围

设置：测试集各 100 张切片；MRI 五种掩膜（4×/8× 1D 高斯、4× 2D 高斯、径向 ~11×、Poisson disk 15×）；CT 稀疏视角 Nθ=60/30。对照 TV（Charbonnier 平滑，ε=1e-3）与 fastMRI 官方 U-Net（仅 MRI）。

- **ID 重建几乎无差**：Table 3 胸 CT，Nθ=60，CT-trained PC：d=4\* 36.29、d=4 36.30、d=3 36.29、d=2 36.27、d=1 36.14 dB，SSIM 全为 0.85。5.3M 的 d=1 相比 61.4M 的 d=4\* 只低 0.15 dB。
- **OOD 偏向小模型**：CORPDFS 径向 11×（fastMRI-trained，PC）d=4\* 31.63 → d=1 31.86 dB；SSIM 0.66 → 0.65（PSNR 升而 SSIM 略降）。Fig. 4 给出机制解释：大模型在 OOD 上出现细线状伪影，d=1 没有。
- **注意力没有稳定收益**：d=4\* vs d=4 在两类数据上互有胜负（胸 CT 36.29 vs 36.30），作者据此明确否定"默认 ncsnpp 最好"的惯例（Observation 1）。这条结论也被用来质疑 patched diffusion 的必要性（§4.3）。
- **自然图像先验跨模态有效且 OOD 反超**：头 CT（OOD）Nθ=60，CelebA-trained d=3 35.14 dB vs CT-trained d=3 34.93 dB；但胸 CT（ID）CelebA 只有 35.70 vs 36.29，说明自然先验在 ID 上确实让位于域内先验。表注用斜体标出所有 "CelebA 胜过同档医学模型" 的格子，正文称该现象在 CORPDFS 上最明显，甚至 CORPD（ID）上 CelebA 模型也常常更好。
- **代价**：重建时间与网络深度正相关（Table 2 脚注：d=4\* 22.17 s/切片 → d=1 10.29 s，CelebA 组；fastMRI 组因采样设置不同在 39–84 s 量级），参数量 61.4M → 5.3M。
- **λ 消融（Fig. 5）**：λ=0 为无条件采样；λ=0.001–0.005 时 CelebA 模型在膝图像上生成人脸样结构；λ=0.01–0.05 残留混叠；λ=1 与测量一致但先验几乎不起作用。作者由此解释"为什么 CelebA 先验能赢"——数据一致性承担了大部分约束，先验只需提供多样化的解空间。

范围限制：纯实数仿真、无噪声、无真实加速采集；只报 PSNR/SSIM，无下游诊断或放射科读片评估；只做 2D 单切片，未涉及 3D/多线圈相位。

## 5. 复现与审计重点

官方仓库 `VLOGroup/bigger-isnt-always-better`（IJCV 2026 / GCPR 2024 官方实现，README 明确写出论文与 DOI）内容：

- **实现齐全**：`models/`（分数网络定义）、`sampling.py` / `sampling_vp.py`（采样）、`physics/`（MRI/CT 前向算子）、`losses.py` / `sde_lib.py` / `score_sde_data.py`（沿用 score-SDE 框架）、`datasets.py` / `mydata.py` / `fastmri_utils.py`。
- **训练脚本**：`training_scripts/` + `training_main.py` / `training_script.py`（另有 `*_structured.py` 变体），对应 MRI、CT、自然图像三种域。
- **评测脚本**：`evaluation/` + 根目录 `evaluate_fastmri.py`、`evaluate_ct.py`、`evaluate_celeba.py`、`evaluate_lambda.py`、`evaluate_control.py`、`evaluation_main.py`，与 §3/§4 的实验一一对应；`erf.py` + `compute_erf.py` 计算感受野，`create_plots*.py` 复现 Fig. 3/5。
- **没有预训练权重**：仓库只有代码与 configs，没有发布任何 checkpoint，复现 15 个模型（各 2.5M 迭代）需自备算力——这是审计时的首要成本项。
- **数据获取靠自己**：fastMRI（需注册）、LoDoPaB-CT（公开）、CelebA-HQ（公开）；论文未提许可证与预处理脚本是否完整，`collect_data*.py` 存在但需核对。
- 代码基于 Chung & Ye 的 `HJ-harry/score-MRI` 与 `utcsilab/csgm-mri-langevin` 改写，README 已注明，比对两者可快速定位本文改动（深度参数化、CelebA 域、λ 接口）。
- 审计要点（本页判断）：Table 2/3 的列很多（TV、U-Net、2 算法 × 5 深度），引用单个数字前务必确认属于哪个算法块；作者自己说 ALD 只在 MRI 上跑。

## 6. 建议阅读顺序

摘要 → §1 的局部统计假设 + Fig. 1 → §2.3 深度定义与 Table 1（感受野） → §2.4 训练细节（数据量与下采样） → §3.2 Observation 1–3 → Fig. 3/4（OOD 细线伪影） → §4.1 + Fig. 5（λ 与幻觉） → Table 2/3 查具体数字 → §4.2 与 Gao et al. 的差异（LAION 污染问题） → §5 结论。

## 7. 前后关联

- 与 [20 号 DDS](20-dds.md)、[06 号 score-MRI](06-score-mri.md)：本文的两个采样算法正是这两条线（Chung & Ye 的 PC、Jalal et al. 的 ALD）；把本文当"这两套算法的先验容量消融"读最省力。
- 与 [31 号 SCD](31-scd.md)、[32 号 DDIP](32-ddip.md)、[33 号 AdaDiff](33-adadiff.md)：那几篇都在**采样期做适配**（LoRA、TTA、双域先验）；本文反其道，主张"别改采样，改先验的容量和训练域"。两者可以叠加：小感受野 + 自然域先验，可能正是 TTA 最该起作用的初始点。
- 与 [30 号自然域基础模型](30-natural-domain-fm.md)、[23 号冻结视觉基础模型](23-fm-cardiac-mri.md)：同一主题的判别式版本——那里是冻结 CLIP/DINOv2 编码器当先验，这里是自然图像训出的**生成式**分数先验。结论方向一致（ID 输、OOD 反超），可互相印证；区别是本文没有编码器迁移问题，模型完全自训。
- 与 [diffusion/06 号 LDM](../diffusion/06-ldm.md)：LDM 是"往大里做"的代表（潜空间 + 大 U-Net），本文是对它的直接反驳，适合并列读。
- 与 [diffusion/01 号 JiT](../diffusion/01-jit.md) 及 patched diffusion 一支：§4.3 明确指出"注意力无益 ⇒ 纯卷积天然尺寸无关"，这是本文对 patch 化路线的一个侧面质疑。
- 与 [diffusion/24 号弱扩散先验](../diffusion/24-weak-priors.md)：都讨论"先验不必很强"，但本文的机制是 λ=1 的强数据一致性，弱先验只是被动的结果；那篇是主动把它当前提。
- 本页判断：对你的研究方向（大预训练生成先验 + 适配），这篇给出了两条可以直接借用的实验设计——**用感受野做容量控制变量**、**用 λ 扫描定位幻觉出现的阈值**；但它的幻觉证据只有 Fig. 5 一张定性图，若要做"域差下幻觉"的定量研究，本文只能当动机不能当基线。

## 8. 链接

- [arXiv:2501.07376](https://arxiv.org/abs/2501.07376)
- [IJCV 正式版（DOI 10.1007/s11263-026-02904-1）](https://doi.org/10.1007/s11263-026-02904-1)
- [GCPR 2024 会议版（DOI 10.1007/978-3-031-85181-0_18）](https://doi.org/10.1007/978-3-031-85181-0_18)
- [官方代码 VLOGroup/bigger-isnt-always-better](https://github.com/VLOGroup/bigger-isnt-always-better)（TU Graz VLOGroup，作者 Martin Zach 所属组）
- [上游代码 HJ-harry/score-MRI](https://github.com/HJ-harry/score-MRI)、[utcsilab/csgm-mri-langevin](https://github.com/utcsilab/csgm-mri-langevin)
