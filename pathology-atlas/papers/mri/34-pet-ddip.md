# 34｜PET-DDIP：拿另一种示踪剂预训练的先验，边重建边用 LoRA 适配

**论文**：PET Image Reconstruction Using Deep Diffusion Image Prior，Fumio Hashimoto、Kuang Gong；arXiv:2507.15078v2（2025-12-09）；IEEE Transactions on Medical Imaging 2026, 45(6):2628–2638（DOI 10.1109/TMI.2026.3659792）
**定位**：PET 低剂量重建、解剖（MRI）先验条件化、HQS 解耦网络与投影、跨示踪剂/跨扫描仪的分布外适配、每步 LoRA 微调
**精读核验**：依据 arXiv v2 全文（§I–VII、Algorithm 1、Table I–II、Fig. 1–12）整理；发表信息经 Crossref（DOI 10.1109/TMI.2026.3659792，卷 45 期 6 页 2628–2638，2026-06）与作者 README 引用的 IEEE Xplore 11369249 核对；官方仓库 `fumiohashimoto/DDIPrecon_for_PET` 于 2026-11-22 经 GitHub API 核对目录、README、`solver_pet_ddiprecon.py`、`run_ddiprecon_2d.sh`、`physics/projector.py`，含真实实现与权重/数据下载入口，**未下载权重、未运行代码**。

## 原文摘要

> Diffusion models have shown great promise in medical image denoising and reconstruction, but their application to Positron Emission Tomography (PET) imaging remains limited by tracer-specific contrast variability and high computational demands. In this work, we proposed an anatomical prior-guided PET image reconstruction method based on diffusion models, inspired by the deep diffusion image prior (DDIP) framework. The proposed method alternated between diffusion sampling and model fine-tuning guided by the PET sinogram, enabling the reconstruction of high-quality images from various PET tracers using a score function pretrained on a dataset of another tracer. To improve computational efficiency, the half-quadratic splitting (HQS) algorithm was adopted to decouple network optimization from iterative PET reconstruction. The proposed method was evaluated using one simulation and two clinical datasets. For the simulation study, a model pretrained on [$^{18}$F]FDG data was tested on [$^{18}$F]FDG data and amyloid-negative PET data to assess out-of-distribution (OOD) performance. For the clinical-data validation, ten low-dose [$^{18}$F]FDG datasets and one [$^{18}$F]Florbetapir dataset were tested on a model pretrained on data from another tracer. Experiment results show that the proposed PET reconstruction method can generalize robustly across tracer distributions and scanner types, providing an efficient and versatile reconstruction framework for low-dose PET imaging.

*来源：arXiv:2507.15078v2 摘要页；逐字原文，未改写、未压缩。*

## 中文摘要

> 扩散模型在医学图像去噪与重建上已展现出很大潜力，但它们在正电子发射断层成像（PET）中的应用仍受两个因素限制：示踪剂造成的对比度差异，以及高昂的计算开销。本文提出一种基于扩散模型的、由解剖先验引导的 PET 图像重建方法，其思路来自深度扩散图像先验（DDIP）框架。所提方法在扩散采样与由 PET 正弦图引导的模型微调之间交替进行，从而能够用**在另一种示踪剂数据上预训练的分数函数**重建多种示踪剂的 PET 高质量图像。为提升计算效率，作者采用半二次分裂（HQS）算法把网络优化与迭代式 PET 重建解耦。方法在一个仿真数据集和两个临床数据集上评估：仿真部分用在 [$^{18}$F]FDG 数据上训练的模型分别测试 [$^{18}$F]FDG 数据与淀粉样蛋白阴性 PET 数据，以考察分布外（OOD）性能；临床部分用另一示踪剂预训练的模型测试 10 例低剂量 [$^{18}$F]FDG 与 1 例 [$^{18}$F]Florbetapir 数据。实验结果表明，所提 PET 重建方法能够稳健地跨示踪剂分布与扫描仪类型泛化，为低剂量 PET 成像提供了一个高效、通用的重建框架。

*译文：对应上方英文摘要逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

一句话：**把 SCD/DDIP 的"边采样边用测量微调"搬到 PET，并且把网络与投影算子拆开（HQS），再加两样东西——病人的 T1 磁共振当条件、LoRA 限制微调的漂移量。**

1. **它给出强分布偏移下"预训练先验会怎样接管图像"的清晰证据**：仿真里训练用 [$^{18}$F]FDG、测试用淀粉样蛋白阴性脑（灰白质对比 1.0:0.25 → 1.0:3.3，相当于把对比反号）。冻结先验的 DDIM 输出被作者用来展示"预训练先验学到的对比"（临床图里 MK-6240 的对比贴着病人 MR 结构走），而 DPS/DDS 在 OOD 下明显低估摄取；这正是分布外先验幻觉的 PET 版本。
2. **HQS 的闭式解让"每步做一次重建"变得可行**：图像子问题用优化转移 + MLEM 单步，得到逐体素闭式解（式 19），网络子问题只更新 LoRA。相比把投影算子塞进网络的反传图，显存与时间都降一个量级。
3. **结论是"只在 OOD 上赚"**：同分布 [$^{18}$F]FDG 仿真里，所提方法与 DPS/DDS 相当（Fig. 9 及正文明确承认）；收益出现在换示踪剂/换扫描仪的临床数据上。

**与你的问题（分布外重建的病灶幻觉）的关系（本页判断）**：示踪剂对比反转是比"换解剖"更狠的分布偏移，但本文的指标是 ROI 对比恢复率、白质标准差、全图 PSNR，**没有做病灶级的 fabricated/erased 统计**，所以它提供的是"用测量做测试时适配能压住先验接管"的方法证据，而不是幻觉量化的证据。另一条相关经验：本文显示单靠冻结先验的 DPS/DDS 在 OOD 下会系统性低估摄取，这与你复现 SCD 时 Ellipses→AAPM 上 DDS 反超的现象方向一致——强偏移下"每步小步微调 + 无解剖约束"未必够。

## 2. 问题及研究位置

PET 的测量是低计数 Poisson 正弦图，MLEM/OSEM 在高噪声下颗粒感强、病灶对比被噪声吞掉。扩散先验能压噪，但**示踪剂决定图像对比**：FDG 看葡萄糖代谢（灰质高），淀粉样蛋白显像剂看斑块（白质/皮层模式不同），MK-6240 看 tau。用 A 示踪剂训练的分数函数去重建 B 示踪剂，等于让先验在测量约束不到的地方按 A 的解剖-对比关系统治图像。

已有位置：

- **PET 扩散重建**：Singh 等首次把 DPS 与 DDS 用于 PET；Webber 等做 likelihood-scheduled 加速；Bae 等在 RED-Diff 里用 HQS。它们基本都**冻结**预训练先验。
- **测试时适配**：SCD 在 CT 上每步用 LoRA 微调；DDIP 把它推广到无条件模型 + 任意噪声尺度。本文是 DDIP 的 PET 条件版：条件变量是病人自己的 T1 MR，微调目标是 PET 的 Poisson 似然而非高斯残差。
- **本文增量**：条件化（解剖先验）+ HQS 解耦（效率）+ LoRA（防灾难性遗忘）+ 跨示踪剂/跨扫描仪的真实临床验证。

## 3. 核心方法和数据流

```text
输入：低剂量 PET 正弦图 y（Poisson）＋ 同机 T1w MR g（与 PET 配准、按 3 层切片堆叠）
初始化：MLEM 20 次 → x̂_EM-init
        x_T' = sqrt(ᾱ_T')·x̂_EM-init + sqrt(1−ᾱ_T')·u ,  T'=200（预训练为 T=1000）
θ ← 在另一示踪剂数据上预训练的 2D U-Net 分数函数（冻结主体，加 LoRA）

for t = T' … 1:
  重复 N=2 次（外层）:
    x^(n,0) = x̂_0(x_t, t, g) = x_t + σ_t²·ε_θ(x_t,t,g)        # Tweedie
    重复 M1=5 次（HQS 图像子问题）:
      x_EM ← 单步 MLEM(y, x)
      x_j ← ½[(x^(n,0)_j − S_j/β) + sqrt((x^(n,0)_j − S_j/β)² + 4·x_EM,j·S_j/β)]
    用 M2=1 步 AdamW 只更新 LoRA：min_θ ‖x^(n,M1) − x̂_0(x_t,t,g)‖²
  DDIM 采样：x_{t−1} = sqrt(ᾱ_{t−1})·x̂_0 + sqrt(1−ᾱ_{t−1}−η²(1−ᾱ_t))·ε_θ + η·σ_t·u
输出：x̂_0（t=1 时的 Tweedie 估计）
```

三个要点：

1. **HQS 是两个子问题的交替**：式 (13) 的图像子问题 = Poisson 负对数似然 + 二次罚 ‖x − x̂_0‖²，用优化转移造代理函数后逐体素求根，得到式 (19) 的闭式解；式 (14) 的网络子问题 = 让去噪输出贴合刚更新的图像。论文强调这样"耦合的系统矩阵与网络被拆开"，正是显存可行性的来源。
2. **条件是 MR，不是 PET 自身**：网络输入为 3 通道（目标轴位切片 + 相邻两层，压轴向伪影）；条件 g 用同一套 3 层切片堆叠送进 U-Net。2D 网络靠重叠三层堆叠 + batch 维拼装实现 3D 体数据重建。
3. **LoRA 是防过拟合的阀门**：r=4，仅占模型总参数 1.13%；U 随机初始化、V 置零，初始权重等于预训练权重。消融（Fig. 2/3、Table I）显示：去掉 LoRA 会在测量上过拟合、图像变噪；r 在 4–12 稳定，r>12 开始退化。

## 4. 论文证据与实验范围

**仿真（§IV-A，BrainWeb）**：20 套 phantom，18 训练 / 1 验证 / 1 测试；T1w MR 作解剖先验；FDG 灰白质 1.0:0.25，淀粉样蛋白阴性 1.0:3.3（对比反转）；Siemens Biograph mMR 几何，128×128、2.08×2.08 mm²；计数 4.0×10⁷，10 次独立实现；未加衰减/散射/随机符合。训练用 200 倍增强（灰白质摄取 ×[0.8,1.2]、缩放 [0.9,1.05]、旋转 ±15°、剪切 ±0.15）。

**仿真结论**：PSNR 在 β=0.01、T'=200 最高（Fig. 5），β∈[0.001,0.1] 较平稳，据此用于临床。Fig. 7 的 10 次实现 bias/std 图显示：DPS/DDS 标准差低但偏差大（系统性低估摄取），所提方法偏差-方差折中最好；Fig. 8 的 %contrast–CV 曲线最优。**同分布 FDG 测试（Fig. 9）里所提方法与 DPS/DDS 相当**，作者明说增益主要来自 OOD。

**临床（§IV-B）**：训练 = 116 例 early-10-min [$^{18}$F]MK-6240 tau PET-MR（GE Discovery MI）；测试 = Monash DaCRA fPET-fMRI 的 10 例 [$^{18}$F]FDG（80–90 min 帧，约 238 MBq）＋ 1 例健康对照 [$^{18}$F]Florbetapir（40–60 min 帧，约 370 MBq），均为 Siemens Biograph mMR（不同站点）。低剂量 = list-mode 降采样到 1/10 计数；体数据 344×344×127（2.08×2.08×2.03 mm³），裁到 128×128×83。

**[$^{18}$F]FDG 临床（Fig. 11，10 例均值）**：

| 方法 | 壳核 CR | 白质 std | PSNR (dB) |
|---|---|---|---|
| MLEM | 1.017 | 0.121 | 22.50 |
| MAPEM | 0.959 | 0.040 | 29.33 |
| DPS | 0.872 | 0.036 | 27.44 |
| DDS | 0.896 | 0.027 | 28.51 |
| **DDIP（所提）** | **0.975** | **0.015** | **30.29** |

**[$^{18}$F]Florbetapir 临床（Table II，单例）**：

| 方法 | %contrast | CV | PSNR (dB) |
|---|---|---|---|
| MLEM | 94.82% | 0.736 | 20.50 |
| MAPEM | 90.54% | 0.300 | 26.87 |
| DPS | 51.08% | 0.230 | 25.29 |
| DDS | 75.22% | 0.228 | 27.76 |
| **DDIP（所提）** | **99.97%** | **0.220** | **29.07** |

**代价**：临床重建时间 DPS 74.8 min、DDS 51.5 min、所提 114.4 min（128×128×83，B200）。即"用时间换 OOD 鲁棒性"，约为 DDS 的 2.2 倍。

**范围限制**：临床真值是仍含噪声的全剂量图，壳核 CR 有 >100% 的情况，作者承认无法区分真过估与参考噪声；Florbetapir 只有 1 例；网络是 2D；只做脑，未做全身。

## 5. 复现与审计重点

- **官方实现已核实**：`https://github.com/fumiohashimoto/DDIPrecon_for_PET`（MIT，最近提交 a25faa4 / 2026-06-12）。包含 `main_simu.py`、`solver_pet_ddiprecon.py`（完整 Algorithm 1：MLEM 初始化、`penalized_EM` 式 (19) 闭式解、LoRA 适配、DDIM 采样）、`physics/projector.py`（parallelproj 实现的 2D Biograph mMR 投影，128×1×128）、`guided_diffusion/`（OpenAI guided-diffusion 改造）、`lora/`（LoRA 与适配损失）、`configs/vp/brainweb_2d_mri.yml`、`run_ddiprecon_2d.sh`。**不是空壳**。
- **一键脚本只跑仿真 2D 单例**：`run_ddiprecon_2d.sh` 用 Dropbox 的 `model1100000.pt` 与 `data/PET/brainweb/negative_MRI_mmr/`，参数为 r=4、em_itr=5、β=0.01、start_t=200、T_sampling=200；`solver` 里读死 `19-000_sino.npy`/`19-000_mr.npy`、只重建 `z_=[60]` 一层邻域。要复现论文的 10 例临床或 Florbetapir，需要自己准备数据并改数据接口——仓库没有临床 3D 管线；也没有预训练入口（无 train 主程序，116 例 MK-6240 训练数据不公开）。
- **超参要按代码与论文对照记录**：论文给 β=0.01、T'=200、N=2、M1=5、M2=1、r=4；代码另给 eta=0.85、lr=5e-4（优化器 AdamW 论文与代码一致）。论文正文没写 eta 与 lr，复现时要标成"代码默认"。另：解剖条件不是可选项，仿真测试目录名即 `negative_MRI_mmr`，MR 经 `model(xt, t, x_idx)` 进入网络，置零/错配会改变评估设定。
- **审计切口**：本文没有病灶级 hallucination 标签，也没有"先验把什么画出来"的分区统计；若要接你的幻觉分析，需要自己按 ROI/病灶掩膜分层，并注意 CR 与 CV 都是全图/白质统计量，不能替代病灶检出。

## 6. 建议阅读顺序

摘要 → §II-A（PET 前向模型与 MLEM）→ §II-C（DDIP 的微调目标，式 11）→ §III-A 与 Fig. 1（两步交替）→ §III-B（HQS 与式 19 闭式解）→ §III-C（LoRA）→ Algorithm 1 → §IV-A/§IV-B（数据与 OOD 设定）→ §V-A（消融 + β/T'/r 三条曲线 + ID 对照）→ §V-B 与 Fig. 11 / Table II（临床数字）→ §VI（局限与时间开销）。

## 7. 前后关联

- 与 [DDS](20-dds.md) 对照：DDS 是本文最强的冻结先验基线，也是本文临床表里被全面超过的对象。注意 v2 才补上 DDS 与 ID 消融，v1 只有 DPS——读旧版会误以为 DPS 是唯一对手。
- 与 [SCD](../mri/31-scd.md) 对照：SCD 是 CT 上的"每步 LoRA 微调"原型，本文把它条件化到 PET，并用 HQS 把投影算子移出反传图。两者共同的软肋也一样：强分布偏移下，适配能否真的改掉先验的对比先验，取决于测量约束的强度与解剖条件。
- 与 [DDIP](32-ddip.md) 对照：DDIP 是无条件、任意噪声尺度的通用框架；本文是它的条件 PET 实例，新增了解剖先验、Poisson 似然与 HQS 效率方案。
- 与 [HalluGen](../diffusion/11-hallugen.md) 对照：它提供"合成幻觉以评测修复模型"的数据构造，本文提供"真实跨示踪剂偏移下先验接管"的案例但缺病灶级标注，可拼成一套评测。
- 与 [BiasRecon](15-biasrecon.md)、[Score-MRI](06-score-mri.md) 对照：前者关心重建的偏差来源与审计，后者是 MRI 侧的多步后验采样基线；本文的 bias 图（Fig. 7）说明低方差≠低偏差，这一点与 BiasRecon 的审计立场一致。

## 8. 链接

- [arXiv 摘要](https://arxiv.org/abs/2507.15078)｜[HTML 正文 v2](https://arxiv.org/html/2507.15078v2)｜[PDF v2](https://arxiv.org/pdf/2507.15078v2)
- 期刊版：[IEEE TMI 2026, 45(6):2628–2638](https://doi.org/10.1109/TMI.2026.3659792)（[IEEE Xplore 11369249](https://ieeexplore.ieee.org/document/11369249)）
- 官方实现：[fumiohashimoto/DDIPrecon_for_PET](https://github.com/fumiohashimoto/DDIPrecon_for_PET)（MIT；含 2D 推理/适配代码、预训练权重与仿真数据 Dropbox 链接；最近提交 2026-06-12；核查日期 2026-11-22）
