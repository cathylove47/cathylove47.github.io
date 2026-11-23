# 36｜MRPD：把 Stable Diffusion 当作 MRI 重建先验，只调自编码器就跨域

**论文**：MRPD: Undersampled MRI Reconstruction by Prompting a Large Latent Diffusion Model，Ziqi Gao, S. Kevin Zhou（USTC / MIRACLE）；arXiv:2402.10609（v1 2024-02-16，v2 2024-07-05）。**未查到正式发表记录**：arXiv 无 journal reference，Crossref 按标题与作者检索均无对应条目，v2 只是套用了 IEEE Trans. 模板排版。
**定位**：自然图像大潜空间扩散模型（SD v1.5）零训练做 MRI 重建 + 只微调自编码器的通用适配；重点是 OOD 采样/对比度/器官上的泛化
**精读核验**：2026-11-22 读 arXiv v2 全文（10 页，§I–VII，Table I–IX，Fig. 1–5，Algorithm 1）；同日 `git clone` 核对官方仓库 `Z7Gao/MRPD`（HEAD f3119ba，315 MB），**只读代码未运行**。

## 原文摘要

> Implicit visual knowledge in a large latent diffusion model (LLDM) pre-trained on natural images is rich and hypothetically universal to natural and medical images. To test this hypothesis from a practical perspective, we propose a novel framework for undersampled MRI Reconstruction by Prompting a large latent Diffusion model (MRPD). While the existing methods trained on MRI datasets are typically of limited generalizability toward diverse data acquisition scenarios, MRPD supports unsupervised and universally adaptive MRI reconstruction. For unsupervised reconstruction, MRSampler guides LLDM with a random-phase-modulated hard-to-soft control. With any single- or multiple-source MRI dataset, MRPD's performance is boosted universally by a lightweight MRAdapter that only finetunes the LLDM's autoencoder. Experiments on FastMRI and IXI show that MRPD is the only model that supports both MRI database-free and database-available scenarios and attains the best generalizability towards out-of-domain (OOD) samplings, contrasts, and organs among compared unsupervised, supervised, and MRI diffusion methods. To our knowledge, MRPD is the first method that empirically shows the universal prowess of an LLDM pre-trained on vast natural images for MRI. Our official implementation is at https://github.com/Z7Gao/MRPD.

*来源：arXiv:2402.10609v2 摘要页，逐字引用（含原文把链接写进摘要的排版）。*

## 中文摘要

> 在自然图像上预训练的大潜空间扩散模型（LLDM）所蕴含的隐式视觉知识很丰富，并且被假设对自然图像和医学图像都普遍适用。为了从实践角度检验这一假设，我们提出一个通过提示大潜空间扩散模型来做欠采样 MRI 重建的框架（MRPD）。已有在 MRI 数据集上训练的方法通常对多样的采集场景泛化有限，而 MRPD 同时支持无监督重建与"普遍可适配"的重建。无监督重建时，MRSampler 以随机相位调制的"硬→软"一致性控制引导 LLDM。给定任意单源或多源 MRI 数据集，MRPD 都能靠一个只微调 LLDM 自编码器的轻量 MRAdapter 获得普遍提升。在 FastMRI 与 IXI 上的实验表明，MRPD 是唯一同时支持"无 MRI 数据库"与"有 MRI 数据库"两种场景的模型，并在 OOD 采样、对比度与器官上取得最好的泛化性——对比对象包括无监督、有监督与 MRI 扩散方法。据我们所知，MRPD 是第一个实证展示"在巨量自然图像上预训练的 LLDM 对 MRI 有普遍威力"的方法。

*译文：逐句对译，未增删；专有名词与数字保持原文写法。*

## 1. 三分钟摘要与推荐理由

一句话：**冻结 SD v1.5 的去噪 UNet，把欠采样 k-space 的幅值当作初始 latent 的"提示"，在 DDIM 采样中交替做硬数据一致性与软分类器引导；若手上有 MRI 数据，只微调 VQGAN 自编码器的首末层（占全模型参数 0.2%）。**

三件值得读的事：

1. **"提示"的具体形态非常省**：没有 ControlNet、没有 LoRA、没有文本条件。输入就是 `|y|`（欠采样图像幅值）复制成 3 通道送进编码器，条件信息全部通过采样循环里的 k-space 一致性项注入。这使它成为"零训练就能跑"的最激进的一档。
2. **MRSampler 的两个工程要点都有明确动机**：硬 DC 收敛快但会把采样轨迹推离流形（Fig. 2a 的全局混叠），软 CG 干净但过平滑且早期慢（k-space 低频能量主导梯度）；于是前段用硬 DC、后段软 CG（`t_ws`），再加**随机相位调制 RPM**——用随机相位替换测量相位，等价于"全局注入噪声 + 拉平频率分布"，论文报告 λ∈[0,1] 中 **λ=1（完全丢弃测量相位）最好**。
3. **它把"适配"压缩到自编码器**：论文认为像素域的软/硬约束都要过 VQGAN，有损压缩是瓶颈；因此只训首末卷积，Table VII 显示单训 encoder（31.35）或单训 decoder（31.31）都有效，两者合起来 31.50（4× PSNR）。

本页判断：这篇是从"自然图像生成先验直接用"切入的最干净基线，风险也最直白——**没有任何幻觉/病灶保真度的评估**，指标只有 PSNR/SSIM；而 Table V 里"自编码器单独重建（28.98）反而差于 8× 欠采样重建（30.26）"说明重建质量里相当一部分由采样器的软引导"补"出来，这正是域差下需要审计的地方。

## 2. 问题及研究位置

问题：加速 MRI 是病态逆问题，强先验决定上限。MRI 专用扩散模型（Score-MRI、DiffuseRecon）只能从几千到几万张切片学分布，且隐私限制使数据难以扩到互联网规模；而 SD 系 LLDM 的预训练数据比公开 MRI 数据集大 10⁶ 量级。问题是：**自然图像里的隐式视觉知识对 MRI 是否可用，以及怎样在 OOD 采样/对比度/器官上不崩**。

已有位置（Table I 的分类）：

- **有监督 CNN/展开网络**（UNet、DuDoRNet、E2E-VarNet）：同分布强，但要为每种采样/对比度重训，OOD 差。
- **INR / 无数据库方法**：可无数据部署，但无大数据收益、OOD 一般。
- **MRI 扩散模型**（Score-MRI、DiffuseRecon）：采样无关、可用大数据，但"无数据库"场景不支持。
- **本文**：同时打勾"采样无关 + 用大规模数据 + 可无数据库 + OOD 泛化"。与 AdaDiff（微调对抗扩散）、SMRD（像素域 DIS 的测试时超参选择）不同，这是**潜空间** DIS + 复数值 MRI 的组合。

## 3. 核心方法和数据流

```text
输入：欠采样 k-space k = M·F·S·x_f（单线圈时 S=I）

【无数据库分支】MRSampler（Algorithm 1，训练-free）
 y = F⁻¹(k)；θ_y = arg(y)，θ_r ~ U(−π,π)
 θ̂ = λ·θ_r + (1−λ)·θ_y                      λ=1 → 完全用随机相位
 k_RPM = F(|y|·e^{jθ̂})
 z ← √ᾱ_{t0}·E(|y|) + √(1−ᾱ_{t0})·ε          t0=0.4，从 40% 时间步起步（SDEdit 式）
 for t = t0·T−1 … 0:
     ẑ0 = DDIM.predict(z_t)                 确定性 DDIM（σ_t=0）
     x̂0 = D(ẑ0)；k̂_RPM = F(x̂0·e^{jθ̂})
     if t > t_ws·T:                          前 70% 时间步：硬 DC
         k̂_dc = (1−M)·k̂_RPM + M·k_RPM      把测量值直接贴回
         ẑ0_dc = E(|F⁻¹(k̂_dc)|)；z_t = DDIM.step(ẑ0_dc)
     else:                                   后 30%：软分类器引导
         z_t = DDIM.step(ẑ0 − γ·∇‖M·k_RPM − M·k̂_RPM‖)
 输出 x0 = D(z0)

【有数据库分支】MRAdapter（只训自编码器首末层，≈0.2% 参数）
 幅值归一化到 [−1,1] → 复制 3 通道 → L2 重建损失
 lr=1e-4，Adam(0.5,0.9)，10 epochs → 得到 MR→natural / natural→MR 两组卷积
 多线圈：按 GRAPPA 思路逐线圈重建后 SSOS 合成（论文未给该分支的完整数值表）
```

三个要点：

1. **推理超参**：`t0=0.4`、`t_ws=0.3`、`λ=1`、`γ=1/100`（fastMRI）、`1/200`（IXI）、4× 多线圈 `1/150`；硬 DC 每两步做一次以加速；这些是在训练集 100 张切片上网格搜索的（不在测试集上调，作者特意说明为公平）。
2. **分辨率接口**：fastMRI 膝 320×320 直接进 SD v1.5 的 8× VQGAN（latent 40×40），因为 UNet 是全卷积的，320 也能跑，但这与 SD 原生 512 训练分辨率不一致——本页判断这是后面"域差"的一部分来源。
3. **推理成本**：T=1000 时 45 s/切片，T=100 掉到 8 s 但 PSNR 从 31.50 掉到 28.52；作者用 50 s（DiffuseRecon 的耗时）作为时间预算选超参。

## 4. 论文证据与实验范围

**数据**：IXI 脑（T1/T2/PD，单线圈模拟，256×256，训练 3218 切片、测试 912/700/700）；fastMRI 膝 PD（15 线圈原始 + 模拟单线圈，320×320，训练 25012、测试 5145；多线圈只用 10 个体数据测试）。

**单线圈 fastMRI（Table II，Ours.B 为适配后）**：Uniform 1D 4×/8×/12× = 31.50/31.28/30.95 dB（SSIM 86.60/85.98/85.41），4× 时低于 DuDoRNet 32.94，8× 起反超（30.87→31.28），12× 领先 2.0 dB；OOD 采样优势更大——Gaussian 2D 8× 为 31.05（DuDoRNet 27.39），VD Poisson 8× 为 31.32（27.81）。论文强调"只有本方法在高加速率下不明显掉点"。

**多线圈（Table III）**：4× Ours.B 32.17 dB / SSIM 92.46（E2E-VarNet 31.57）；8× 31.46（次优 30.54）；12× 31.38（次优 30.31，SSIM 91.72）。

**OOD 对比度-器官（Table IV，训练在膝、测在 IXI 脑）**：PD 脑 4× Ours.A 31.37 / Ours.B 32.48（Score-MRI 28.64）；T1 4× 30.63/31.62；T2 4× 30.57/31.68。8×/12× 同向，且 Ours.A（完全不训）在所有 OOD 行都是扩散类里最好的。

**MRAdapter 通用性（Table V）**：自编码器重建 PD 膝 28.98→31.62（同源微调）；T2 脑 27.98→30.34（T2 单源）、30.42（三源合并）；8× 重建 PD 膝 30.26→31.28、T2 脑 28.61→31.09。"数据越接近测试集或越大，提升越多"。

**消融**：Table VI λ 从 0→1 单调涨到 31.50/86.60（λ=0 仅 27.99/81.05）；Table VII 原 VQGAN 30.88/85.62 → 单训 encoder 31.35 → 单训 decoder 31.31 → 合训 31.50；Table VIII 训练 0 天（A）/0.5 天（B）、推理 45 s；Table IX 步数 T=100/500/1000 → 28.52/31.21/31.50，8/25/45 s。

**范围限制（本页判断）**：只有 2D 单切片、幅值图；相位被 RPM 彻底替换，意味着**复数值信息的合理性完全靠幅值一致性间接保证**；没有放射科评估、没有病灶/结构保真指标，OOD 只覆盖膝↔脑两种解剖。

## 5. 复现与审计重点

2026-11-22 克隆 `Z7Gao/MRPD`（HEAD f3119ba，"Update README.md"，仓库 2024-06-28 建、次日最后一次推送，137 MB git 大小/315 MB 工作区）：

- **有的**：`stable-diffusion/scripts/mrsampler.py`（401 行，DDIM + `sample_fast` + RPM/DC 钩子）；`inverse_fastMRIknee_recon.py`（465 行，单线圈膝验证集重建主脚本，掩膜默认 `mask/generated_masks/mask_4x_uniform1d.pth`）；`inverse.py`（543 行，PSLD 派生）；`mask/` 下 4×/8×/12×/15× 的 uniform1d / gaussian1d / gaussian2d / poisson 掩膜 `.pth`（含 256 版）；`data/example/val/` 放了 fastMRI 单线圈验证集第一个 volume 的切片。
- **没有的**：**MRAdapter 的训练代码完全没有**（全仓 grep "adapter" 零命中），Table V/VII 那一整块无法从代码复现；没有多线圈/GRAPPA-SSOS 分支脚本；没有 IXI 相关脚本；没有预训练权重，也没有训练日志。
- **权重来源有歧义**：论文写用 HF 的 SD v1.5（§IV-A5 脚注 6 `runwayml/stable-diffusion-v1-5`），README 却让人"从 CompVis latent-diffusion 下载 LDM checkpoints"；脚本默认配置是 `configs/stable-diffusion/v1-inference.yaml`。实际该挂哪份权重、latent 通道是否与 v1.5 的 VQGAN 对齐，需要实验确认。
- **仓库自述状态**："still under construction and contains some draft code for the basic reproducibility"，To-do 还留着"清理 PSLD 继承代码"；合理预期只能复现单线圈膝、单掩膜的定性/定量结果。另外 γ 等超参在 PDF 抽取时被排版打散，复现应以代码默认值为准。

## 6. 建议阅读顺序

摘要 → §I 两个问题（Q1 通用性 / Q2 如何利用）→ Table I（一张表看懂四类方法的取舍）→ Fig. 1 三栏结构 → §III-B-1 硬→软引导 + Algorithm 1 → Fig. 2 / Fig. 5（RPM 与单一引导的对比，最直观）→ §III-C MRAdapter（为什么只动自编码器）→ Table II（单线圈多掩膜）→ Table IV（OOD）→ Table V + Table VII（适配收益与结构消融）→ Table IX（步数-时间折中）→ §VI-B RPM 的合理性讨论。

## 7. 前后关联

- 与 [20 DDS](20-dds.md)、[32 DDIP](32-ddip.md) 同属"预训练扩散 + 数据一致性"一支，但那些是像素域、且模型仍在 MRI 上训练；MRPD 是**潜空间 + 完全不训**，是这条线最极端的一端。
- 与 [25 ReSample](../diffusion/25-resample.md) 直接继承关系：论文引用的 hard data consistency（Song et al., ICLR 2024）就是 ReSample；MRPD 的"硬 DC 前段 + 软 CG 后段"正是对 ReSample 在极端 OOD 下不稳的修补。
- 与 [33 AdaDiff](33-adadiff.md) 对照最锋利：AdaDiff 认为必须微调扩散模型本体（对抗扩散 + DC 损失），MRPD 认为**只调自编码器就够、动 UNet 反而伤泛化**。同一问题两种相反答案，值得并读。
- 与 [31 SCD](31-scd.md) 对照：SCD 在采样时用 LoRA 做测试时适配（训的是 UNet 旁路），MRPD 训的是数据接口。二者都在回答"适配放在哪一层最划算"。
- 与 [30 自然域基础模型](30-natural-domain-fm.md)、[23 冻结基础模型](23-fm-cardiac-mri.md) 是同一母题（自然域预训练先验是否可迁移）的生成式版本：那两篇用判别式编码器、同分布输跨域赢；MRPD 声称生成式先验"从未遇到不泛化的数据类型"，语气明显更强。
- 与 [06 Score-MRI](06-score-mri.md)、[LDM 原文](../diffusion/06-ldm.md) 读：前者是主要对照与掩膜/数据处理来源，后者是架构基础。
- 同批入库的 [37 通用先验](37-general-prior.md) 可横向比较"大先验 + 少适配"的另一种做法：它用自然图像训练小感受野的分数模型，而 MRPD 直接拿现成的 Stable Diffusion。

本页判断：如果研究"大生成先验 + 域差幻觉"，MRPD 是最合适的**下限基线**——它把"先验直接拿来用"推到极致，所以它的失败模式也最干净：结构被生成、相位被丢弃、指标只奖平滑度。把它与 SCD/AdaDiff 的适配路线放在同一张表上，就能把"该不该动 UNet、动多少"变成一个可测的问题。

## 8. 链接

- [arXiv:2402.10609（abs）](https://arxiv.org/abs/2402.10609) ／ [v2 PDF](https://arxiv.org/pdf/2402.10609v2)
- [官方仓库 Z7Gao/MRPD](https://github.com/Z7Gao/MRPD)（2026-11-22 核对：含 MRSampler 与单线圈膝重建脚本、掩膜与一个验证 volume；无 MRAdapter 训练代码）
- [SD v1.5 权重（论文脚注指定的 runwayml 版本）](https://huggingface.co/runwayml/stable-diffusion-v1-5) ／ [fastMRI](https://fastmri.med.nyu.edu/) ／ [IXI](https://brain-development.org/ixi-dataset/)
- [ReSample：Solving Inverse Problems with Latent Diffusion Models via Hard Data Consistency（arXiv:2307.08123）](https://arxiv.org/abs/2307.08123) → 见 [25 ReSample 笔记](../diffusion/25-resample.md)
