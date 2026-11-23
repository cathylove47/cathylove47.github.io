# 42｜DCTTA：用扩散模型「再退化」同一场景，以退化一致性做无源测试时适配

**论文**：Degradation-Consistent Test-Time Adaptation for All-in-One Image Restoration，Ni Tang、Shenghao Nie、Xiaotong Luo、Yuan Xie、Yanyun Qu（厦门大学、香港理工大学、华东师范大学）；CVPR 2026，pp. 15476–15485（CVF Open Access；无 arXiv 版）
**定位**：all-in-one 图像复原（AiOIR）的无源测试时适配；扩散模型不当复原器，只当「退化生成器」——把测试图再退化一次，要求同一个干净场景的两份退化输入复原结果一致；只更新退化敏感参数（Fisher 选取），不做逐图推理期扩散
**精读核验**：2026-11-22 依 CVF Open Access 正式版 PDF（pp. 15476–15485）全文逐节读过：§1–4.3、Table 1–6、Figure 1–6，含式 (1)–(14) 与实现细节（§4.1）。该文无 arXiv 预印本，摘要取自 CVF 页面。官方代码 `tonia86/DCTTA` 同日经 GitHub 页面核对（`test_promptir.py`、`train_test_promptir.py`、`net/model.py`、`utils/loss_utils.py`、`pretrain/model.ckpt` 说明），是真实实现。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：见 [推理走查记录](/pathology-atlas/learning/infer-dctta.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> All-in-one image restoration (AiOIR) methods have made remarkable progress in handling diverse degradations. However, their performance often deteriorates when the test distribution deviates from the training distribution. Exploring test-time adaptation for AiOIR is therefore crucial. To adapt a pre-trained AiOIR model to unseen degradation distributions without access to source data or retraining, two key challenges must be addressed: designing reliable pseudo-supervision and stabilizing adaptation. Observing that multiple degraded versions of the same scene should map to a consistent clean image, we propose Degradation-Consistent Test-Time Adaptation (DCTTA). DCTTA comprises three core components: (1) test-time redegradation generation, which leverages a diffusion-based generator to construct pseudo degraded-clean pairs for distribution alignment; (2) degradation-guided image restoration, which enforces domain adaptation via self-supervised consistency loss; and (3) test-time important parameter selection, which selectively updates degradation-sensitive parameters to ensure stable adaptation while preserving pre-trained knowledge. Extensive experiments across multiple tasks and challenging domain shifts demonstrate that DCTTA consistently outperforms state-of-the-art AiOIR baselines, achieving up to +4.57 dB PSNR improvement on the Rain100H dataset. The code is publicly available at: https://github.com/tonia86/DCTTA.

*来源：CVPR 2026 CVF Open Access 版摘要（pp. 15476）。*

## 中文摘要

> All-in-one 图像复原（AiOIR）方法在处理多种退化上已取得显著进展。然而当测试分布偏离训练分布时，其性能往往下降。因此探索面向 AiOIR 的测试时适配十分关键。要在不访问源数据、不重新训练的前提下，把预训练的 AiOIR 模型适配到未见过的退化分布上，必须解决两个关键挑战：设计可靠的伪监督，以及稳定适配过程。我们观察到，同一场景的多个退化版本应当映射到同一张干净图像，据此提出退化一致性测试时适配（DCTTA）。DCTTA 包含三个核心组件：(1) 测试时再退化生成，利用基于扩散的生成器构造伪「退化—干净」图像对，用于分布对齐；(2) 退化引导的图像复原，通过自监督一致性损失实现域适配；(3) 测试时重要参数选择，有选择地更新对退化敏感的少量参数，在保证适配稳定的同时保留预训练知识。跨多个任务与困难域偏移的大量实验表明，DCTTA 稳定优于当前最优的 AiOIR 基线，在 Rain100H 数据集上取得最高 +4.57 dB 的 PSNR 提升。代码已公开于 https://github.com/tonia86/DCTTA。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**既然「同一场景的多种退化」应该复原成同一张图，那就自己造出第二种退化：用 RDDM 把输入再退化一次，要求原图与再退化图经复原模型得到一致输出——这条自监督信号让模型在无标签、无源数据的情况下适配到新退化域。**

三件值得读的事：

1. **扩散模型换了角色**：它不参与最终复原（Table 4：推理时间与 PromptIR 相同，0.59 s），只在适配阶段学「当前测试域的退化过程」。RDDM 学的是残差 I_res = ȳ − x_in（伪标签减退化输入），条件于伪标签 ȳ 与中间变量 z_t（式 2），采样 5 步。这与 TAO 那类「推理时靠扩散生成」的路线有本质区别，也是它便宜的原因。
2. **伪标签来自教师集成**：8 种几何增广（90° 旋转与翻转）过教师网络再逆变换平均（式 1），配合 EMA 教师（η=0.95），把伪标签噪声压下去。消融（Figure 4）里去掉 DA 从 20.21 掉到 19.57、去掉 EMA 掉到 19.87。
3. **只更新「重要」参数**：用增广一致性损失 L_c 对参数的 Fisher 对角近似打分（式 13），冻结 top ρ=0.4 最敏感的参数，其余参与适配。去掉 TIPS 直接从 20.21 掉到 14.24——这是全文最大的单模块落差，说明「稳定」比「适配」更难。

**关于它证明了什么（本页判断）**：Table 1 的增益高度集中在去雨（Rain100H 上 PromptIR 15.64→20.21，DFPIR 15.94→20.27），去噪与去雾只涨 0.1–1.6 dB。作者归因于雨条纹「强空间结构」更可学；换个角度读，这也说明 DCTTA 的收益依赖「退化本身有可被 RDDM 建模的结构」。另外 Table 4 的显存从 3232 MB 涨到 23504 MB（约 7×），适配是「一次性」的（32.25 s 后回到普通前向），但 23.5 GB 在消费级卡上并不轻松。

## 2. 问题及研究位置

AiOIR 用一个统一模型处理去噪、去雨、去雾等；训练退化集固定，测试时遇到未见退化（跨数据集、真实雨/雾、混合退化）就掉点。TTA 的目标是在测试阶段用无标签测试数据把模型拉回目标分布，且不访问源数据。

已有位置：

- **分类/分割 TTA**：TENT、CoTTA、MM-TTA 等依赖 BN 统计或伪标签，直接搬到像素级回归会失效（没有类别、没有可靠置信度）。
- **AiOIR 基线**：AirNet、PromptIR、DFPIR 是盲复原统一模型；AdaIR、VLU-Net、DACLIP 作为补充对比。它们在目标域上直接用会掉点（Rain100H 上 AirNet 仅 14.62）。
- **AiOIR 的 TTA**：TAO 用扩散模型 + 可学习 adapter 做零样本复原，推理期就要跑扩散；本文把扩散挪到「造伪监督」这一步，推理期完全不用。
- **本文**：无源、单次适配、只改一部分参数；核心假设是「退化一致性」——同一场景不同退化版本共享唯一干净解。

## 3. 核心方法和数据流

```text
输入：目标域退化图像集合 D = {x_in}、预训练 AiOIR 模型（教师 f_ξ 初始化 = 学生 f_θ）
# 1) 伪标签（TRG 的数据侧）
ȳ = (1/8) Σ_i R_i f_ξ(A_i(x_in))            # 8 种几何增广 + 逆变换平均
# 2) 训练退化生成器（RDDM，一次性）
学 I_res = ȳ − x_in 的条件残差扩散，采样 5 步
# 3) 造第二份退化
x_sd = RDDM(ȳ, x_in)                        # 与 x_in 同场景、退化分布对齐
# 4) 退化引导复原（DIR）
y_in = f_θ(x_in),  y_sd = f_θ(x_sd)
L_s  = λ_cons‖y_in − y_sd‖₁ + λ_per Σ_l ‖φ_l(y_in) − φ_l(y_sd)‖²
L_a  = λ_cos‖ȳ − y_sd‖₁ + λ_per Σ_l ‖φ_l(ȳ) − φ_l(y_sd)‖²
L    = L_s + α·L_a
# 5) TIPS：按 Fisher 打分冻结 top-ρ 参数，其余用 Adam 更新；教师 EMA
ξ ← η·ξ + (1−η)·θ
```

三个要点：

1. **两份退化必须「同场景」**：x_sd 不是随机加噪，而是由 RDDM 学到的当前域退化算子作用在伪标签 ȳ 上生成的。这样 x_in 与 x_sd 共享同一个干净目标，一致性损失才成立。RDDM 的残差形式（学 ȳ − x_in 而不是直接学 x_in）让生成器只需建模「退化差异」，比从头生成图像容易。
2. **两个一致性各有分工**：L_scons/L_sper 约束「同一模型对两份退化的输出一致」（自监督，无需真值）；L_acons/L_aper 约束「学生输出靠近教师伪标签」（防漂移）。总损失是两个的加权，α=1、λ_per=0.01、λ_cons=1。
3. **TIPS 是一次性的**：Fisher 打分只在适配开始前算一次（式 13 在测试集 D 上平均），之后整个适配过程参数集合固定。所以在线开销可控，但也意味着「哪些参数重要」不会随适配过程更新。

## 4. 论文证据与实验范围

**数据与设定**：三任务设定（去雨 Rain100L 训练 / Rain100H 测试，去噪 BSD400+WED 训练 / Kodak24+Poisson 测试，去雾 RESIDE-OTS 训练 / O-HAZY、DenseHaze 测试）；五任务设定再加 GoPro 去模糊→RealBlur-J 测试、LOL 训练→LOLv2-real 测试；第三设定是雨条纹+雨滴混合退化。指标 PSNR/SSIM。实现：Adam，lr 2×10⁻⁴，batch=1，λ_cons=1、λ_per=0.01、α=1，EMA η=0.95，RDDM 采样 5 步，RTX 3090。

**三任务（Table 1，PSNR/SSIM）**：

| 模型 | Kodak24 | O-HAZY | DenseHaze | Rain100H | 平均 |
|---|---|---|---|---|---|
| AirNet | 25.57 / 0.862 | 16.70 / 0.713 | 10.90 / 0.360 | 14.62 / 0.490 | 16.95 / 0.606 |
| AirNet+DCTTA | 25.79 / 0.863 | 16.95 / 0.723 | 12.49 / 0.377 | 17.34 / 0.531 | 18.14 / 0.623 |
| PromptIR | 25.41 / 0.859 | 16.70 / 0.715 | 11.48 / 0.376 | 15.64 / 0.498 | 17.31 / 0.612 |
| PromptIR+DCTTA | 25.78 / 0.862 | 16.78 / 0.715 | 11.65 / 0.377 | **20.21 / 0.663** | **18.61 / 0.654** |
| DFPIR | 24.57 / 0.861 | 16.72 / 0.717 | 11.61 / 0.381 | 15.94 / 0.503 | 17.21 / 0.616 |
| DFPIR+DCTTA | 24.66 / 0.875 | 16.84 / 0.718 | 11.73 / 0.368 | 20.27 / 0.630 | 18.37 / 0.647 |

**五任务（Table 2，平均）**：AirNet 17.75→19.96，PromptIR 19.49→19.76，DFPIR 22.61→**23.61**（0.770→0.802）。其中 AirNet 在 Rain100H 上 +4.47 dB、RealBlur-J 上 +2.79 dB。**混合退化（Table 3）**：PromptIR 18.06→18.27，AirNet 17.70→17.88。**消融（Figure 4，PromptIR 去雨）**：完整 20.21/0.663；去 TIPS 14.24/0.487；去 DA 19.57/0.606；去 EMA 19.87/0.609。**效率（Table 4）**：适配 32.25 s、推理 0.59 s（与 PromptIR 相同）、显存 23504 MB（PromptIR 3232 MB）。

**范围限制（本页判断）**：所有测试域仍是「单一退化类型」为主（混合退化只做了一组），没有多退化随机混合的连续测试流；指标只有 PSNR/SSIM，没有 LPIPS/感知指标，也没有下游任务（检测/分割）；伪标签依赖教师，教师本身在目标域很差时（如 O-HAZY 上 AirNet 16.70）自监督信号的上限就被锁死；TIPS 的 ρ=0.4 与 Fisher 打分只在适配前算一次，未考察测试分布随时间漂移的场景。

## 5. 复现与审计重点

- **仓库结构**：`net/model.py` 是 PromptIR 主干（顶层 import `modulated_deform_conv2d` 与 OpenAI CLIP，因此必须装 mmcv 与 CLIP）；`utils/loss_utils.py` 含 WaveletTransform（读 `pretrain/wavelet.mat`）；`test_promptir.py` 是 no-TTA 评测；`train_test_promptir.py` 是 TTA 入口；权重 `pretrain/model.ckpt` 为 3-task PromptIR（Google Drive 文件夹 `1pTDAtMMPIdsGIAvQc0nr5tJs8qOYIpZ4`，407 MB）。
- **数据坑**：仓库自带 `testdata/Rain100H/{LQ,GT}` 100 对，但这份数据的输入对 GT 只有 **12.13 dB**，远低于论文中 PromptIR 在 Rain100H 的 15.64 dB 所对应的正常量级——它和 3-task 模型的训练退化不匹配。论文的三任务设定训练用 Rain100L、测试用 Rain100H；复现时应按论文换数据（Restormer 的 deraining 测试包 `1P_-RAvltEoEhfT-9GrWRdpEi6NSswTs8` 内含 Rain100L/Rain100H）。
- **代码改动（走查必需）**：`test_promptir.py` / `train_test_promptir.py` 里 `os.environ["CUDA_VISIBLE_DEVICES"]="4"` 会覆盖外层指定卡，需删除；`utils/loss_utils.py` 的 `WaveletTransform.params_path` 写死为 `/data2/tn/code/...`，需改为 `./pretrain/wavelet.mat`；数据与输出路径需改为本地。依赖上 numpy 2.x 会让 torch 报 `Failed to initialize NumPy`，需回 1.26.4。
- **走查（小样本，非论文指标）**：Rain100H（仓库自带 100 对）no-TTA **15.550 / 0.4868**——与论文 Table 1 的 PromptIR 15.64 基本一致，说明模型与这份数据确实对应论文那一行。TTA 只跑 15 张（每张要训残差扩散 + EMA + Fisher），得 **16.117 / 0.4679**，同 15 张 no-TTA 基线 16.029 dB，即 +0.09 dB，远达不到论文的 20.21；差异主要来自协议——论文是在整个目标域上做一次性适配，走查只用了 15 张，RDDM 与 Fisher 都没见够数据（本页判断，未验证）。
- **改用 Rain100L 后**：no-TTA 全 100 张 **37.440 / 0.9786**，回到正常 derain 量级；TTA 10 张日志给 **37.846 / 0.9774**，但按保存的 png 逐图复算 TTA 37.724 vs no-TTA 37.832，即 **−0.11 dB**。结论：单一、且模型已训练过的退化上，DCTTA 没有可测增益；论文的 +4.57 dB 来自「未见退化 + 全目标域适配」，这两个条件走查都没满足。
- **审计要点**：论文的「适配时间 32.25 s」是在 Rain100H 全 test 上的一次性适配，不是逐图；Table 4 的 23.5 GB 显存是适配期峰值，部署时只需 0.59 s 前向；`test_promptir.py` 顶部的 `CUDA_VISIBLE_DEVICES="4"` 是仓库级硬编码，直接跑会抢卡。

## 6. 建议阅读顺序

摘要 → Figure 1（closed-set vs TTA 的对比）→ §3.1 框架总览与 Figure 2 → §3.2 再退化生成（式 1、2，重点看残差定义）→ §3.3 DIR（式 3–10）→ §3.4 TIPS（式 12–14）→ §4.1 实现细节 → Table 1/2/4 → Figure 4 消融（TIPS 的落差最大）→ Table 5/6（退化生成器与损失函数消融）。

## 7. 前后关联

- 与 [38 号 DDA](../diffusion/38-dda.md) 共享「扩散模型做增广」的思路，但 DDA 的扩散用于生成新样本训练判别器，DCTTA 的 RDDM 用于生成「同场景的第二份退化」来构造像素级一致性，监督信号是自监督而非伪标签分类。
- 与 [39 号 Diffusion-TTA](../diffusion/39-diffusion-tta.md) 相反：Diffusion-TTA 在推理时反复跑扩散并把似然反传到判别器；DCTTA 只在适配阶段用扩散，推理期零扩散开销。
- 与 [37 号 TENT](../diffusion/37-tent.md) 对照：TENT 靠 BN 统计与熵最小化，DCTTA 在像素回归上没有熵可用，只能用退化一致性；两者都面临「伪监督可靠性」这个核心问题，DCTTA 用 8 增广集成 + EMA 教师来压噪声。
- 与 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md) 是同一「测试时适配」谱系的两端：SCD/DDIP 用扩散先验在采样中适配条件网络（医学逆问题），DCTTA 用扩散生成器造伪监督适配复原网络；前者改生成过程，后者改退化分布。
- 与 [24 号弱先验](24-weak-priors.md) 的框架互补：DCTTA 证明「退化分布本身可以被扩散模型建模」，但也暴露其边界——若目标退化与源退化差得太远（如仓库那份 12 dB 的 Rain100H 输入），一致性信号会把模型拉向错误解，反而掉 SSIM。

## 8. 链接

- [CVPR 2026 官方论文页（CVF Open Access）](https://openaccess.thecvf.com/content/CVPR2026/html/Tang_Degradation-Consistent_Test-Time_Adaptation_for_All-in-One_Image_Restoration_CVPR_2026_paper.html)
- [CVPR 2026 正式版 PDF](https://openaccess.thecvf.com/content/CVPR2026/papers/Tang_Degradation-Consistent_Test-Time_Adaptation_for_All-in-One_Image_Restoration_CVPR_2026_paper.pdf)
- [补充材料](https://openaccess.thecvf.com/content/CVPR2026/supplemental/Tang_Degradation-Consistent_Test-Time_Adaptation_CVPR_2026_supplemental.pdf)
- [官方代码 tonia86/DCTTA](https://github.com/tonia86/DCTTA)
- [RDDM（Residual Denoising Diffusion Models）](https://github.com/nachifur/RDDM)
