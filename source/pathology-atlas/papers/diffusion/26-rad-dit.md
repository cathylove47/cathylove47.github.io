# 26｜Rad-DiT：把 ImageNet 预训练的扩散 Transformer 原封不动搬进医学生成，并量化「搬过来的到底是什么」

**论文**：From Natural Images to Medical Scans: Transferability of Diffusion Models for Medical Image Generation，Efthymios Georgiou、Ioannis Kakogeorgiou、Sarah Brüningk（University of Bern / Inselspital；IIT, NCSR Demokritos），WACV 2027；arXiv:2611.05192（v1 2026-11-03）
**定位**：**生成**论文而非重建论文；系统比较 ImageNet 初始化的去噪器（像素空间 JiT、潜空间 LightningDiT）在放射数据上的可迁移性，并给出"迁移的是空间结构不是语义"的机制证据与混合域训练方案
**精读核验**：2026-11-22 读 arXiv HTML v1 全文（§1–8、Table 1–7、Fig. 1–6，摘要逐字取自 arXiv abs）；录用信息取自作者项目页 rad-dit.github.io、仓库 README 与 `CITATION.cff` 的 "WACV 2027" 标注（CVF 论文集尚未上线，无第三方书目可交叉验证）。官方代码 `CAIROLab-Bern/rad-dit` 经 GitHub 页面核对：含 `jit/`、`ldit/`、`dgm_eval/`、`metrics/`、`preprocessing/`、`environment/` 与 SLURM 脚本，并发布 Hugging Face 权重；**代码未运行、权重未下载**。

## 原文摘要

> Transfer learning from natural images is standard in supervised and increasingly adopted in self-supervised medical image analysis, but its role in generative modelling, and in particular diffusion denoisers, remains underexplored. Medical diffusion models typically train the denoiser from scratch, with no systematic evaluation of natural-image transfer. We analyse this across latent and pixel paradigms, model sizes (131M-952M) and two radiology datasets (RadImageNet, BraTS), and ask which aspects of transfer support generation. We find that: i) Natural-image initialisation consistently improves generation, by 21-34% relative gFID in pixel space against 14% in latent space, where the tokeniser supplies much of the prior. gFID gains mirror downstream pathology classification and radiomic-feature FD, both proxies for clinical fidelity. ii) Benefits reflect spatial structure, not semantics: semantic probing does not predict generation quality, whereas a spatial-structure metric adapted to internal denoiser representations tracks gFID at |r|=0.85, positioning spatial organisation as a channel through which pretraining manifests. iii) Mixed-domain denoiser training shows that natural and medical images share similar layer-wise representations up to the late blocks, and mixing natural images into medical training improves fidelity. iv) Transfer benefit is tied to natural image initialisation, outperforming in-domain medical pretraining and several reinitialisation schemes. Overall, natural image denoisers transfer positively to medical ones in our setup. Code is available at https://github.com/CAIROLab-Bern/rad-dit

*来源：arXiv:2611.05192 摘要（abs 页面与 HTML 版逐字一致）。*

## 中文摘要

> 从自然图像迁移学习在监督式医学图像分析里已是常规做法，在自监督方向也越来越常见，但它在生成建模——尤其是扩散去噪器——中的作用仍研究不足。医学扩散模型通常从头训练去噪器，从未系统评估自然图像迁移。我们在潜空间与像素两种范式、131M–952M 的模型规模、两个放射数据集（RadImageNet、BraTS）上分析这一问题，并追问迁移的哪些方面支撑生成。结论是：i) 自然图像初始化稳定提升生成质量，像素空间 gFID 相对提升 21–34%，潜空间只有 14%，因为 tokeniser 已经提供了大部分先验。gFID 的收益也体现在下游病理分类与影像组学特征 FD 上，两者都是临床保真度的代理指标。ii) 收益反映的是空间结构而非语义：语义线性探测不能预测生成质量，而一个适配去噪器内部表征的空间结构指标与 gFID 的 |r|=0.85 相关，说明空间组织是预训练发挥作用的一条通道。iii) 混合域去噪训练显示，自然图像与医学图像在多数层上共享相似表征，直到靠后的 block 才分化；把自然图像混入医学训练能提升保真度。iv) 迁移收益绑定在自然图像初始化本身，优于域内医学预训练与多种重初始化方案。总体上，自然图像去噪器在我们的设定下正向迁移到医学去噪器。

*译文：对应上方英文摘要逐句对译。原文 "131M-952M" 在 HTML 版因公式渲染出现重复，此处按 abs 原文保留。*

## 1. 三分钟摘要与推荐理由

先说清楚它的身份：这是一篇**生成模型**论文，研究"医学图像能不能生成得像"，不涉及任何逆问题求解器、数据一致性步或加速采样掩膜。它对重建方向的价值在于**先验来源的经验判断**，而不是可直接套用的重建管线——读的时候不要把 gFID 的结论直接外推到重建 PSNR。

四件事值得读：

1. **它把"迁移"拆成了可以单独验证的因果链**：自然图像初始化 → 更好的空间组织（LDSc）→ 更低 gFID。语义解释被线性探测明确否掉：JiT-B/16 从头训练与 ImageNet 初始化的病理分类探测准确率都是 0.56，但 gFID 是 55.50 对 36.48。
2. **像素空间比潜空间更吃预训练**（34.3% / 21.6% / 31.4% 对 13.8%）。原因写得直白：自然图像 VAE 在放射数据上重建 rFID 只有 1.88，已经把可迁移的先验吃掉大半，潜空间去噪器只剩更难的那部分要学。
3. **域内医学预训练打不过 ImageNet**，而且中间插一段医学预训练还会变差（多通道 BraTS：直接迁移 40.17，先过单通道 BraTS 50.90，先过 RadIN 75.40）。这条对"我有一批医学数据，先在上面预训练再迁移"的直觉是直接反证。
4. **混合域训练是最便宜的可操作结论**：RadIN + 15% ImageNet 让 JiT-L/16 从 32.34 降到 30.94 gFID，只加数据不改架构。

**本页判断（对"大模型先验 + 适配"方向）**：若"迁移的是空间结构而不是语义"在重建里也成立，那么自然图像预训练给的是低频布局、边缘与纹理统计这类"骨架"，恰是抑制欠采样伪影最需要的东西；而幻觉风险来自语义内容，论文显示语义恰恰没有被迁移——这既是好消息（域差不会直接带来错误解剖语义），也提醒我们它没有回答"生成模型在重建时会不会编出病灶"这个问题，本文没有任何病灶级或放射科医生评估。

## 2. 问题及研究位置

问题：医学扩散模型几乎都从头训练去噪器，自然图像预训练在**判别式**医学校验（分类、分割、自监督编码器）里早已是标配，但在**生成式**去噪器上被当作实现细节，没人系统问过三件事——迁移有没有用、迁移的规模随范式/模型大小怎么变、迁移的到底是什么。

已有位置：

- **判别式迁移**：ImageNet 初始化 + 微调；Matsoukas 等指出收益主要来自特征复用，Transformer 比 CNN 更依赖复用。
- **医学生成**：MAISI / MAISIv2、3D MedDiffusion 等多为从头训练；少数工作（RoentGen、MediSyn、Med-Art）微调预训练文生图模型；病理侧 PathLDM、ZoomLDM 用 ImageNet 权重初始化去噪器但只当作 recipe。
- **表征对齐一脉**：REPA / iREPA 发现对齐收益来自空间结构而非语义——本文把这套论证从"对齐目标"搬到"初始化来源"，并自建 LDSc 指标直接测去噪器内部表征。由此本文的定位是**受控研究**：固定数据与训练 recipe，只动初始化方式与范式，把"迁移"变成可分解的实验变量。

## 3. 核心方法和数据流

```text
数据
  RadImageNet：CT/MR 2D 切片 256×256，按 5 个（模态，部位）区域条件化
  BraTS-GLI 2024（治疗后成人胶质瘤）：T1/T1c/T2/T2FLAIR 四通道
    单通道模式 = 通道打平、随机生成其中一个模态；多通道 = 一次生成四通道

三种去噪范式（只换去噪器，tokeniser 一律 off-the-shelf）
  ① 像素：JiT-{B,L,H}/16（12/24/32 层，131M/459M/952M），x-prediction + flow matching
  ② 潜空间：LightningDiT-XL（675M/28 层），配 MedVAE / SDVAE / VAVAE
     VAVAE 压缩率高 → patch 1；SDVAE/MedVAE 压缩率低 → patch 2
  ③ 联合去噪：V-Co-B/16（260M），像素 + DINOv2 特征双流

初始化（唯一自变量）
  Random：仓库默认随机初始化；IN：ImageNet 权重整模型加载
  ST：按 IN 权重逐张量均值/方差重采样（保留统计量，丢掉学到的结构）

训练：256×256，RadIN 80 epoch，单通道 BraTS 40 epoch，多通道 55 epoch，cfg=1.0
采样：LDiT 用 Euler 250 步，JiT / V-Co 用 Heun 50 步；评估：dgm-eval 的 gFID + 密度/覆盖度，诊断用径向功率谱比 P_gen/P_real

机制分析
  线性探测：冻结去噪器表征 → 分类 RadIN 19 个病理类（生成只条件化 5 个解剖类）
  LDSc：token 余弦核的自相似度减去远距离对，先做均值中心化，剔除首末 block，
        在 t=0.5 取各层最大值 → 与 gFID 做相关
  混合域：JiT-L/16 同时喂 RadIN 与 10% ImageNet，逐 block 测跨域余弦相似度
```

三个要点：

1. **"只动初始化"是全文的方法论骨架**。tokeniser 不训练、采样器与步数按各仓库推荐、cfg 固定 1.0，所以 gFID 差异可以归到权重来源上——但代价是每篇论文的 recipe 都不同（JiT 与 LDiT 的 epoch 数、步数不可比），跨范式比较只能看"相对提升"，不能看绝对值。
2. **LDSc 是对 LDS 的两处修改**：均值中心化 + 剔除首末 block。作者明说直接用原始 LDS 时结果不确定（inconclusive），这一步修改是事后调的，读的时候应当视为"在 12 个模型上拟合出来的指标"，而不是事先定义的定理。
3. **ST 初始化是关键的负对照**：如果收益只来自权重尺度，ST 应当复现 IN；结果 ST 比 Random 还差（JiT-L 62.64 对 41.27），说明起作用的是具体权值而非分布。

## 4. 论文证据与实验范围

**数据集规模**：RadImageNet 论文口径 530,534 张切片 PNG，5 个区域、19 个病理类（剔除验证集中 <100 样本的稀有类）；BraTS-GLI 2024 从 1,621 训练 / 188 验证病人抽出 226,940 / 26,320 个四通道样本（单通道打平后 907,760 / 105,280）。测试集 RadIN 15k、BraTS 50k，不参与训练与调参。

**主结果（Table 1，RadIN 256×256 gFID↓）**：潜空间 LDiT-XL/1+VAVAE 19.05→16.43（Δ2.6，13.8%）；像素 JiT-B/16 55.50→36.48（Δ19.0，34.3%）、JiT-L/16 41.27→32.34（Δ8.9，21.6%）、JiT-H/16（40 epoch）47.89→32.83（Δ15.1，31.4%）。最佳绝对值仍是潜空间 16.43；联合去噪 V-Co-B/16 只报了 IN 的 28.86。

**BraTS（Table 2）**：单通道 LDiT-XL/1 9.22→7.66（Δ1.56）、JiT-L/16 37.93→29.34（Δ8.59）；JiT-H/16 只用 10 epoch 就到 29.13。多通道 JiT-L/16 43.97→35.17（Δ8.80），JiT-H/16 为 32.75——这里规模越大越好，与 RadIN 上 H 不再涨 gFID 相反。

**临床代理（Table 3）**：两个 JiT-B/16 各生成 100k 样本（19 类分布对齐），IN 版 gFID 40.81 / FD-Rad 37.99 / macroF1 0.47，从头版 72.67 / 87.46 / 0.43；真实数据训练的 ResNet-50 为 0.72。趋势一致但绝对值离真实数据仍有明显差距。

**机制证据**：探测准确率 0.56（从头）对 0.56（IN），gFID 55.50 对 36.48；JiT-B 探测 0.56 高于 JiT-H 0.54，gFID 却更差（36.48 对 32.83）；潜空间从头模型探测反而更高（0.557 对 0.510）。LDSc 峰值 B 0.574→0.633、L 0.639→0.657、H 0.620→0.646；12 个 JiT 变体上 |r|=0.846，拟合 ΔgFID=−296.6×ΔLDSc，单靠 LDSc 差距能预测 B/L/H 的 92/58/52%（均值 67%），蒙特卡洛扰动后 69±6%，留一规模预测 95/62/42%。

**混合域（Fig. 4、Table 4）**：block 0–16 跨域余弦相似度 ≥0.7，block 17–22 掉到 0.35–0.50（同网络内同类/同域对仍 ≈0.9）。混入 ImageNet 后 gFID：0% 32.34、5% 31.46、15% 30.94、25% 31.01、50% 31.80。

**负结果（Table 5–7、Fig. 5–6）**：RadIN 160 epoch 从头预训练再迁到单通道 BraTS = 36.73，直接 ImageNet 微调 = 31.73，IN + RadIN 80 epoch = 31.13（σ_IN=0.41，属种子噪声内）。多通道 75.40 / 50.90 / 40.17。ST 初始化 51.45（LDiT）与 62.64（JiT-L），双双差于 Random。参数漂移随规模减小（12.10 / 8.80 / 6.98 ×10⁻³），但回滚第一个 block 会让 gFID 涨约 170，漂移无法解释功能重要性。数据缩放：25%→100% 的 scratch-IN 差距从 30.0 收窄到 19.0 但不闭合，IN 用 25% 数据（42.5）仍好于 scratch 用 100%（55.5），scratch 在 25% 上不收敛；拟合 α_Rand=0.29、α_IN=0.11，作者自述"约需 10× 数据"是示意性外推。

**范围限制（作者自述 + 本页判断）**：只有 2D、只有 256×256、只有两个放射数据集、BraTS 仅一个胶质瘤亚型；临床证据全是代理指标（FD-Rad、ResNet-50 macroF1），作者明确要求专家评估后才能谈临床效用；"从头训练 + 更多数据能否追平"仍是开放问题，且外推只放大数据量不放大多样性。本页补充：gFID 在医学小测试集上本身噪声不小（作者自报 σ≈1），1.4 gFID 的混合域收益已接近噪声边缘。

## 5. 复现与审计重点

- **仓库内容与权重（2026-11-22 核对）**：`jit/`（像素 JiT 训练/采样）、`ldit/`（LightningDiT + 三种 VAE）、`dgm_eval/`（gFID）、`metrics/`（LDSc）、`preprocessing/`（分片式数据加载）、`environment/`（uv lock）；数据自行申请（RadImageNet 走 BMEII-AI，BraTS 2024 GLI 走 Synapse），仓库只给摆放位置。Hugging Face 三个模型库：`rad-dit/jit-radimagenet`（JiT-B/16、L/16、H/16 与混入 15%/25% ImageNet 的 JiT-L/16）、`ldit-radimagenet`、`ldit-brats`——Table 1 的像素行、混合域行、BraTS 潜空间行都有可直接下载的检查点，Table 3 的临床代理模型与 Table 5/6 的迁移链没有。
- **能复现的实验**：生成 + gFID + LDSc 主表；**不能直接复现**：医学预训练对照（需自己从头训 160 epoch RadIN）、ST 重初始化（需按 IN 权重逐张量采样，无独立入口）、块回滚（无脚本）。README 未给 `--init` 类开关说明，IN/ST/Random 的切换需读代码确认；另自述"用 Claude Code 等 AI 工具搭建统一仓库"，并改过官方数据加载（分片加载），因此"按各仓库 recipe 训练"要核到 `jit/`、`ldit/` 脚本层面。已知问题是多卡 DDP 首屏障 NCCL 超时（需 `NCCL_P2P_DISABLE=1`）。
- **可控性隐患**：每个模型只报单次结果 + σ≈1 的种子噪声，主表里 2.6 gFID（潜空间）这类提升与噪声同阶；混合域 15% 最优、25% 回升、50% 也"在噪声内"。引用时写"方向一致、幅度接近噪声"。
- **录用状态**：仓库、项目页、`CITATION.cff` 三处都写 WACV 2027，属作者一侧的一致声明；CVF Open Access 尚未上线 2027 论文集，第三方书目暂无可核。按"作者声明的录用"记录，不按已出版。

## 6. 建议阅读顺序

摘要 → §1 四条 finding（先记住这是生成不是重建）→ §3.1 三种去噪器与 §3.5 初始化方案（ST 是关键对照）→ Table 1 → Table 2 → §4.3 + Table 3（gFID 是否带临床信号）→ §5.1 语义探测 → §5.2 LDSc 与 67% 那条拟合 → Fig. 3 → §5.3 + Fig. 4 + Table 4（混合域）→ §6.1 Table 5/6（医学预训练反证）→ §6.2 Table 7 → §6.4 Fig. 6（数据缩放）→ §7 Limitations。想省时间只读 §1 四条 + Table 1 + Fig. 3 + Table 5。

## 7. 前后关联

- 直接的前置是 [JiT](01-jit.md)：本文像素分支就是 JiT-{B,L,H}/16，作者自称首次把 JiT 迁到医学域；想弄清 x-prediction 与大 patch 为什么让像素扩散重新可用，先读 01。
- 潜空间分支接 [LDM](06-ldm.md) 与 [DiT](07-dit.md) 的谱系（LightningDiT + VAVAE/SDVAE/MedVAE）。本文最重要的旁证之一就来自这条线：自然图像 VAE 在放射数据上 rFID 1.88，**先验可能藏在 tokeniser 里**，这与"自然域编码器当先验"的 [30 号](../mri/30-natural-domain-fm.md)、[23 号](../mri/23-fm-cardiac-mri.md) 是同一现象的两种测法。
- 与 [27 号 3D MedDiffusion](27-3d-meddiffusion.md) 构成正面对照：那边是自定义 VAE + 从头训练的去噪器做 3D 生成，本文的结论恰好质疑"从头训练"这一默认选择。
- 与 [24 号 弱扩散先验](24-weak-priors.md) 对读：那篇讨论弱先验在重建里的可控性，本文讨论强先验的来源与可迁移性，两者拼起来才是"该用什么先验、先验从哪来"的完整问题。
- 重建侧的落点：[SCD](../mri/31-scd.md) 与 [DDIP](../mri/32-ddip.md) 是在采样中做域适配（LoRA/参数微调），[DDS](../mri/20-dds.md) 是纯推理期换数据项。本文给的是**权重级**结论——如果 ImageNet 权重本身比医学预训练更适合当起点，那么 SCD 这类"自然域先验 + 测试时适配"的思路在起点上就有额外优势，这是本文对重建最有价值的推论（本页判断，本文未验证）。
- **本页判断（幻觉角度）**：本文说迁移的是空间结构、不是语义，因此域差带来的主要风险不是"学到错误的解剖语义"，而是"生成的空间组织与医学图像不匹配"。但这一区分只在生成指标上被测过；用于重建时，病灶这类语义内容由数据一致性项与测量约束，理论上更安全，可这不构成证据。要判断"自然图像先验会不会让重建编出病灶"，仍需 [31](../mri/31-scd.md) / [32](../mri/32-ddip.md) 式的病灶级配对实验。

## 8. 链接

- [arXiv:2611.05192（abs）](https://arxiv.org/abs/2611.05192) ｜ [HTML v1 全文](https://arxiv.org/html/2611.05192v1) ｜ [项目页 rad-dit.github.io](https://rad-dit.github.io/)（标注 WACV 2027）
- [官方代码 CAIROLab-Bern/rad-dit（2026-11-22 核对：含 jit/、ldit/、dgm_eval/、metrics/、preprocessing/）](https://github.com/CAIROLab-Bern/rad-dit)
- 权重：[rad-dit/jit-radimagenet](https://huggingface.co/rad-dit/jit-radimagenet) ｜ [rad-dit/ldit-radimagenet](https://huggingface.co/rad-dit/ldit-radimagenet) ｜ [rad-dit/ldit-brats](https://huggingface.co/rad-dit/ldit-brats)
- 数据与评估：[RadImageNet](https://github.com/BMEII-AI/RadImageNet) ｜ [BraTS 2024 GLI（Synapse）](https://www.synapse.org/Synapse:syn53708249/wiki/627759) ｜ [dgm-eval](https://github.com/layer6ai-labs/dgm-eval)
