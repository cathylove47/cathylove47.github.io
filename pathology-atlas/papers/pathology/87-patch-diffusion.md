# 87｜Patch Diffusion：把扩散训练切片化——坐标条件与尺寸调度

**论文**：Patch Diffusion: Faster and More Data-Efficient Training of Diffusion Models，NeurIPS 2023（arXiv:2304.12526v2，2023-10-18）  
**作者**：Zhendong Wang、Yifan Jiang、Huangjie Zheng、Peihao Wang、Pengcheng He、Zhangyang Wang、Weizhu Chen、Mingyuan Zhou（UT Austin、Microsoft Azure AI）  
**定位**：通用扩散训练框架（patch 级坐标条件 score matching）；训练加速与数据效率，病理大图生成的共同前置  
**精读核验**：依据 arXiv v2 全文（含附录 A 理论解释、全部表格与图注）整理，核验日期 2026-10-24。本文是自然图像基准上的方法论文，不是病理论文；本次**未运行官方代码、未复现任何 FID 数字**，文中数字全部标注为作者报告。

## 原文摘要

> Diffusion models are powerful, but they require a lot of time and data to train. We propose Patch Diffusion, a generic patch-wise training framework, to significantly reduce the training time costs while improving data efficiency, which thus helps democratize diffusion model training to broader users. At the core of our innovations is a new conditional score function at the patch level, where the patch location in the original image is included as additional coordinate channels, while the patch size is randomized and diversified throughout training to encode the cross-region dependency at multiple scales. Sampling with our method is as easy as in the original diffusion model. Through Patch Diffusion, we could achieve ≥ 2× faster training, while maintaining comparable or better generation quality. Patch Diffusion meanwhile improves the performance of diffusion models trained on relatively small datasets, e.g., as few as 5,000 images to train from scratch. We achieve outstanding FID scores in line with state-of-the-art benchmarks: 1.77 on CelebA-64×64, 1.93 on AFHQv2-Wild-64×64, and 2.72 on ImageNet-256×256. We share our code and pre-trained models at https://github.com/Zhendong-Wang/Patch-Diffusion.

*来源：arXiv:2304.12526v2 摘要页；逐字原文，未改写、未压缩。arXiv 摘要页把末尾链接渲染为「this https URL」，此处按原文还原为完整地址。*

## 中文摘要

> 扩散模型很强大，但训练它们需要大量时间与数据。我们提出 Patch Diffusion，一个通用的按 patch 训练框架，显著降低训练时间成本并提升数据效率，从而帮助把扩散模型训练普及给更广泛的用户。我们创新的核心是 patch 层面的一种新条件 score 函数：把 patch 在原图中的位置作为额外坐标通道，同时在整个训练过程中随机化并多样化 patch 尺寸，以编码多尺度上的跨区域依赖。用我们的方法采样与原始扩散模型一样简单。通过 Patch Diffusion，我们能实现 ≥ 2× 的训练加速，同时保持相当或更好的生成质量。Patch Diffusion 还提升了在相对较小数据集上训练的扩散模型的表现，例如仅用 5,000 张图像从零训练。我们在与最先进基准一致的程度上取得了出色的 FID：CelebA-64×64 上 1.77、AFHQv2-Wild-64×64 上 1.93、ImageNet-256×256 上 2.72。我们公开了代码与预训练模型：https://github.com/Zhendong-Wang/Patch-Diffusion。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

训练扩散模型贵在两点：单步要过整图、要过几百上千步反向链；收敛又要海量图像（论文引用的量级：DDPM 在 8×V100 上把 LSUN-Bedroom 64×64 训到收敛约 4 天、256×256 超过两周，SOTA 工作消耗 150–1000 V100·天）。已有加速都集中在**采样**（DDIM、DPM-Solver、EDM-Sampler），**训练**这一侧的办法不多。

Patch Diffusion 的做法非常"工程"却有效：把训练样本从整图换成**随机位置、随机尺寸的 patch**，并把 patch 的位置做成两个归一化坐标通道（左上 (−1,−1)、右下 (1,1)）拼到输入里，让网络知道"我这一块在整图的哪儿"。因为 U-Net 是全卷积的，任意分辨率都能跑，所以**推理时不需要拼块**：直接喂整图的坐标图，按原来的反向链采样即可。真正需要调的是一个旋钮 $p$ —— 训练中用整图（而非 patch）的比例。

它对本仓库的意义在于**位置**而不是领域：病理与 MRI 的大图生成线（[LRDM](56-lrdm.md)、[DiffInfinite](70-diffinfinite.md)、[ZoomLDM](58-zoomldm.md)、RestorePath 的随机 patch 扩散、MRI 的 patch diffusion harmonization）都在用"patch 训练 + 大图推理"这套骨架，而这篇是把该骨架讲清楚、并把代价量化得最干净的通用文献。读它主要是为了拿到那张"$p$ ↔ FID ↔ 训练小时"的换算表，以及坐标条件的实现细节。

## 2. 问题及研究位置

论文的三段式动机：

1. 扩散是当前生成式建模的主力（图像、文生图、音频、不确定性、强化学习），但**反向链要过几百步同一个 U-Net**，采样已经被大量改进采样器缓解。
2. **训练侧没有被同等对待**：分辨率与多样性上升，训练成本指数增长；最强的模型还依赖十亿级图像库（OpenImages、LAION），普通实验室拿不到。
3. 结果就是"扩散训练被大公司垄断"，作者把这称为 democratizing diffusion training 的瓶颈。

相关工作的坐标（论文第 2 节）：

- **COCO-GAN**：用坐标条件做分块 GAN 生成——本文坐标条件的设计来源，但对象是 GAN 而非扩散。
- **LDM / Stable Diffusion**：在潜空间降分辨率，属于正交的"换表示"路线；本文的 LPDM 直接叠在它上面。
- **ControlNet 微调**：本文把 patch 训练当作微调加速器验证（HED→图像，20k 步）。
- 与**并行采样/快速采样器**（DDIM、DPM-Solver、EDM）不冲突：本文 FAIR 地声明 FID 对比中自己的模型只用 50 步确定性反向，而若干基线需要更多步。

一句话位置：**plug-and-play 的训练期加速技巧**，与网络结构、采样器、噪声调度都解耦；代价是输入通道变了（多了 2 个坐标通道），与基线 checkpoint 不通用。

## 3. 核心方法和数据流

```text
训练（每步）
x ~ p(x)
  ├─ 采样 patch 尺寸 s ~ p_s   （见下方分布；可随机、可渐进）
  └─ 每张图独立随机裁一块 x_{i,j,s}，记录左上角坐标 (i, j) ∈ [−1,1]²
        ↓
输入 = [ x_{i,j,s} ; 坐标通道 X ; 坐标通道 Y ]      ← 2 个额外通道
        ↓
去噪器 D_θ(x̃; σ_t, i, j, s)，加噪 x̃ = x_{i,j,s} + ε, ε ~ N(0, σ_t² I)
        ↓
损失：只在图像通道上算 ‖D_θ − x_{i,j,s}‖²，坐标通道的重建直接丢弃
        ↓
score：s_θ(x, σ_t) = (D_θ(x; σ_t) − x) / σ_t²

patch 尺寸分布（Eq. 5，R 为原图分辨率）
P(s = R)      = p
P(s = R//2)   = 3/5 · (1 − p)
P(s = R//4)   = 2/5 · (1 − p)

采样（推理）
构造整图尺寸的坐标图 [X, Y] → 与每步噪声样本拼接 → 走原始反向 SDE/ODE（EDM-Sampler，50 步）
→ 不需要分块采样再拼接；外推时只需把坐标系放大（见 4.5）
```

三种设计各自解决什么：

1. **patch 级条件 score（Eq. 4）**：把整图的 score matching 换成 patch 上的条件 score matching，单步计算量与显存随 $s^2$ 下降——这是 2× 加速的直接来源。
2. **多尺度 patch 尺寸 + 少量整图（$p$）**：只用小 patch 时网络看不到全局，学到的局部 score 拼不成一致的 score map（$p=0$ 时 FID 14.51，见 4.1）。加入大 patch 与整图，相当于给局部 score 一个"全局锚"。
3. **坐标通道（3.3）**：让同一个网络在不同位置学习位置相关的 score（MRF 视角下，节点的单点势与边的成对势都不必然空间不变），并顺带起到数据增广作用——$64\times64$ 图取 $s=16$ 有 $(64-16+1)^2=2401$ 个可能位置。

两种尺寸调度与实测取舍（4.1）：**stochastic**（每步按 $p_s$ 抽尺寸）优于 **progressive**（先小后大）——CelebA-64 上 FID 1.66 vs 2.05，FFHQ-64 上 3.11 vs 3.85。作者给的解释是渐进调度在前段只喂局部 patch、却处于大学习率阶段，学习率衰减会惩罚这种安排。

理论解释（附录 A，两条，都属于直觉而非收敛证明）：

- **MRF**：图模型的 score 可分解为节点势与边势之和，$\nabla \log p(x)=\sum_v \nabla \log \phi_v + \sum_e \nabla \log \phi_e$；每次采样 patch 相当于只对一部分节点/边做 score matching，坐标条件用来补"位置相关"这一项。
- **线性回归 / 高斯**：整图 score matching 等价于一个最小二乘问题；patch 分布是整图分布经（正交投影）边缘化，于是 patch 上的目标仍是同一个线性算子的部分观测版本。

作者自己在结论里承认：坐标系统可以用周期位置编码改进，**通用情形下 patch-wise score matching 的收敛性证明留作未来工作**。

## 4. 论文证据与实验范围

**主结果（作者报告，全部为自然图像基准）**

| 数据集 | 基线 | 本文 | 训练时长 |
|---|---|---|---|
| CelebA-64×64 | EDM-DDPM++ 1.66 | PDM 1.77 | ~48h → ~24h |
| FFHQ-64×64 | EDM-DDPM++ 2.60 | PDM 3.11 | ~48h → ~24h |
| LSUN-Bedroom-256 | LDM-ADM 4.32 | LPDM 2.75 | ~8 天 → ~4 天 |
| LSUN-Church-256 | LDM-ADM 4.66 | LPDM 2.66 | ~8 天 → ~4 天 |
| ImageNet-256（CFG 1.3） | LDM-4 3.60 / ADM-Upsampled 3.94 | LPDM **2.72** | GFLOPs 78 |

**必须一起读的两件事**：CelebA 与 FFHQ 上本文 FID **略差于**自己的 backbone（1.77 vs 1.66、3.11 vs 2.60），换来的是约一半训练时间；论文的卖点是"comparable or better + 2× faster"，不是纯质量 SOTA。ImageNet-256 上 2.72 才是质量上的领先（同 CFG 设置）。

**$p$ 的消融（CelebA-64，16×V100、batch 512、2 亿张图）**

| p | 0.0 | 0.1 | 0.25 | 0.5 | 0.75 | 1.0 |
|---|---|---|---|---|---|---|
| FID | 14.51 | 3.05 | 2.10 | **1.77** | 1.65 | 1.66 |
| 训练时长 (h) | 13.6 | 20.1 | 22.5 | 24.6 | 42.7 | 48.5 |

读法：$p=0$ 完全崩（只有局部 score）；$p$ 很小的 0.1 就把 FID 从 14.51 拉到 3.05；0.5 之后收益饱和而时间继续涨，所以选 $p=0.5$。

**小数据集（AFHQv2，每个约 5k 图，75M 张图的训练预算）**：Cat 4.60→3.11、Dog 4.94→4.80、Wild 2.59→1.93，训练 18h→9h。注意 **Dog 的提升几乎可以忽略**（0.14），说明"提数据效率"不是稳定收益，与数据集难度相关。

**微调**：ControlNet（SD v1-5）在 HED→图像上微调 20k 步，作者称训练效率约 2×、质量无明显下降（只有定性图，Fig. 5 与附录 Fig. 10，无表）。

**外推**：在 256×256 上训练的模型，把坐标系放大到 384×384（附录还有 512×512），参考图固定在中心不动，边界外区域重新生成（Fig. 7、附录 Fig. 11）。

**范围限制（作者未系统讨论，读的时候要自己标出）**：

- 评测全部是 FID（50k 样本、全训练集作参考），没有下游任务、没有感知研究；n=1 个随机种子级别的重复也没有报告。
- 训练预算按"看过的真实图像数"计（2 亿 / 7500 万），不是 wall-clock 对齐——表里的时间是在同一套 16×V100 上测的，换硬件不保证同比例。
- 潜空间版本借用 **Stable Diffusion 的 VAE**，作者承认该自编码器并非为 LSUN/ImageNet 训练，"可能限制性能"。
- 没有病理、医学或超大分辨率（>1k）实验；WSI 的千兆像素场景只能靠后人的工作（LRDM、DiffInfinite、BigCell、RestorePath）间接验证。

## 5. 复现与审计重点

- **先算清 $p$ 与预算**：$p=0.5$ 意味着整整一半迭代还是整图训练，patch 只省掉另一半的一半左右开销。想在自己的数据上复现"2× 加速"，必须按同样口径（看过的图像数）对齐，否则数字不可比。
- **坐标通道改变了输入**：+2 通道意味着**无法直接加载 baseline 权重**，微调场景要从"带坐标条件的 checkpoint"出发，或用零初始化新通道做热启动。论文的 ControlNet 实验属于后者一类的工程处理，正文没有给出通道初始化细节，需看代码。
- **batch 内 patch 尺寸**：3.1 写的是"每个样本独立随机裁"，3.3 写的是"每个 batch 采样一个尺寸"。两处表述不完全一致，实际实现对显存与吞吐影响很大，复现前先读代码确认。
- **FID 可比性**：本文自己的 FID 都基于 50 步 EDM-Sampler，而对比表中的 DDIM/DDPM/NCSN++ 用了 1000 步；引用这张表时不要把"步数不同"这件事抹掉。
- **小数据集收益不稳**：AFHQv2-Dog 的 0.14 差距提示"5k 图也能训"这种说法要看具体数据；在自己的小样本场景（例如某癌种几百张 WSI）应当先做 $p$ 的粗扫，而不是照抄 0.5。
- **外推不是免费**：坐标系放大后边界外区域是"编"出来的，病理上不能当作真实组织使用；若用于补边或用例扩图，必须与 [RestorePath](49-restorepath.md) 那类"有邻域证据"的修复区分开。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（训练/采样总览）→ `3.1 Patch-wise Score Matching`（Eq. 4 与两个补救策略）→ `3.2`（Eq. 5 尺寸分布、随机 vs 渐进）→ `3.3 Conditional Coordinates`（坐标通道与损失屏蔽）→ `3.4 Sampling` → `4.1`（$p$ 消融，Fig. 2–3 与那张 FID/时间表）→ `Table 1–4` → `4.5` 与 `Fig. 7`（外推）→ `5 Conclusion` → 附录 A（MRF 与最小二乘两种解释，看清是直觉而非定理）。

## 7. 前后关联

- **它是训练技巧，不是推理结构**：本文推理仍是整图一步到位。病理线的 [LRDM](56-lrdm.md)（自监督嵌入当条件、4× 潜空间）、[DiffInfinite](70-diffinfinite.md)（并行随机 patch + 掩码联合合成）、[ZoomLDM](58-zoomldm.md)（倍率感知条件）改变的是**推理期怎么拼大图**，与本文正交互补；[BigCell](64-bigcell.md)、[STREAM](65-stream.md) 则把问题推到千兆像素与流匹配。
- **坐标条件 = 让"位置"成为显式变量**：与 [RestorePath](49-restorepath.md) 用距离加权插值（DWI）补邻域条件、[LRDM](56-lrdm.md) 用 SSL 嵌入做条件，是同一件事的三种做法——都是给扩散一个"我在哪儿 / 周围是什么"的锚。
- **跨域复用**：MRI 的 [Patch Diffusion Harmonization](17-patch-harmonization.md) 把 3D patch diffusion 用于跨中心风格协调，属于本文思路在三维医学影像上的直接落地。
- **与本仓库的关系**：命中「病理扩散」专题的千兆像素分组，作为该组的方法学地基；本身不属于病理或 MRI 领域的工作，分类放在计算病理的「生成式合成」并标记为扩散前作，是为了让大图生成那条线有可引用的训练侧出处。

## 8. 本次阅读边界

只读了 arXiv v2 全文（正文 10 页 + 附录 A–D）与官方仓库地址，未克隆、未运行官方代码，未训练任何模型，因此：

- 所有 FID、训练时长、GFLOPs 均为**作者报告值**；
- 「2× 加速」的可迁移性未在本机或集群验证，取决于硬件、$p$、分辨率与数据加载瓶颈；
- 与病理 WSI（千兆像素、单张图无成对样本）的适配成本（滑窗采样器、patch 尺寸与倍率对应、坐标归一化到切片级还是 patch 级）**没有实测**，属于待验证项。

## 9. 链接

- [arXiv:2304.12526（v2, 2023-10-18）](https://arxiv.org/abs/2304.12526)
- [官方代码与预训练模型](https://github.com/Zhendong-Wang/Patch-Diffusion)
- 站内相关：[LRDM](56-lrdm.md)、[DiffInfinite](70-diffinfinite.md)、[ZoomLDM](58-zoomldm.md)、[RestorePath](49-restorepath.md)、[BigCell](64-bigcell.md)、[STREAM](65-stream.md)、[Patch Diffusion Harmonization](17-patch-harmonization.md)
