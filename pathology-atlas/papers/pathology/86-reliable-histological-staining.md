# 86｜I2I-Stain-Zoo：六种无配对染色架构、54 组规模配置与集成不确定性

**论文**：Towards Reliable AI-Based Histological Staining: A Systematic Study of Scaling and Uncertainty in Unpaired Generative Models；BMVC 2026 正式接收（官方 accepted papers 列表已列出该题名；arXiv comment 亦标注 "37th British Machine Vision Conference, November 2026, Lancaster, UK"）；arXiv:2608.24626v1，首发 2026-08-25。作者：Qasim Siddiqui、Adrian Friebel、Maiju Myllys、Zaynab Hobloss、Daniela González、Ahmed Ghallab、Stefan Hoehme（莱比锡大学 IZBI / ScaDS.AI 等）。
**定位**：benchmark + 资源型研究。任务是 H&E → Sirius Red（小鼠肝）的**无配对**图像翻译；它不提出新的生成架构，而是把六种已有架构在"容量 × 数据量"上做全因子扫描，并第一次系统比较无配对染色翻译的认知不确定性。属辅助参考，不是方法首选。
**精读核验**：2026-10-22 核对 BMVC 官方接受列表、arXiv 摘要、正文 §1–8、Supplementary S1–S6，Table 1–2、S1–S8，Figure 2–4；核验公开仓库 README 与文件存在性（`pyproject.toml`、`i2i_stain_zoo/train.py`、`i2i_stain_zoo/base_models.py`）；未下载数据/权重，未训练。

## 30 秒看懂

**一句话**：六种无配对染色架构 × 3 种容量 × 3 种数据比例 = 54 组配置，第一次系统比较病理无配对翻译的认知不确定性。

**问题**：肝纤维化要靠 Sirius Red 量胶原面积，但很多中心只有 H&E；虚拟染色能补——可两张切片来自相邻而非连续切面，没有像素级配对真值，视觉可信不等于生物量正确。

**瓶颈**：54 组各 750k 步、再加 6 个家族 × 10 个种子的集成重训；测试集只有 5 个配对样本，CPA MAE 的标准差常与均值同量级，相邻配置的排名差异不该当真。

**insight**：感知指标会饱和，任务误差不会。37 个稳定 GAN 配置的 Patch-SSIM 全挤在 0.298–0.349，CPA MAE 却横跨 0.008–0.171；而集成分歧只能做软性分诊——图块内几乎无空间校准，CycleDiffusion 的不确定性与误差完全不相关。

## 3 分钟讲清

**方法（按顺序）**：
1. 70 张 WSI（35 只小鼠，H&E 与 SR 取自同一组织块的相邻切面，因此天然无配对）；512² 无重叠切块后双线性降到 256²。
2. 按动物划分：30 只训练（约 20 万 tile / 域），5 只测试；25% / 50% 是严格子集。
3. 六种架构（CycleGAN / UNIT / MUNIT / DCLGAN / UVCGAN / CycleDiffusion）× 三档容量（约 10M / 50M / 100M）× 三档数据比例，各训 750k 步、batch 1。
4. 主指标 CPA MAE：把冻结的 nnU-Net v2 胶原分割模型同样地用在真 SR 与虚拟 SR 上，量胶原面积占比再算绝对误差——绕开像素对齐问题。
5. 副轴三条：Patch-SSIM / LPIPS / FID，三人盲评，以及每家族最佳配置的 10 种子深度集成分歧（式 2）与 cycle 误差校准。

**作者证据在哪**：Table 1（每家族最佳配置：CycleGAN 的 CPA MAE 0.008、UNIT 的 FID 195.2、DCLGAN 的 Patch-SSIM 0.339——**没有一族四项全胜**）、Table 2（54 组上的 Spearman：感知两项 0.82，但它们与 CPA MAE 只有 0.63 / 0.64，FID 与 CPA 只有 0.55）、§5.2 崩塌案例（DCLGAN-L 在 25%/50% 数据 FID 327–363）、Table S7（CycleDiffusion 的 Pearson −0.025、ECE 0.214）。

**和上一代的区别**：它不提出新架构，是基准与协议。对 HistDiT、SuperDiff 这类方法论文，它回答的是"该用什么尺子"；与 HESCAPE 的基准设计可对照。全部结论来自单一小鼠 BDL 模型，作者明确不外推到人 NASH 或跨中心。

**讲 PPT 用这张**：Table 2 的指标间相关性 + DCLGAN-L 的崩塌行——一张说明 FID 与任务误差不是一回事，一张说明"加大模型"会反向。

## 1. 问题及研究位置

- **任务定义**：无配对图像到图像翻译（unpaired I2I）。训练集是两组互不对应的图像集合（一批 H&E、一批 SR），没有成对样本；监督方法需要相邻切片的像素级配准，成本高且受组织形变影响（§1）。
- **为什么是肝**：纤维化分期是慢性肝病长期结局的主预测因子；SR 的 CPA 比 Masson 三色更贴合血清纤维化标志物（§1 引 Huang et al. 2013）。
- **已有基准的缺口**：(a) 以往比较几乎集中在 H&E→IHC 或非肝组织；(b) 已有基准固定单一模型规模和数据预算，没回答"容量和数据量如何共同影响质量"；(c) 无配对场景下**从未系统量化**认知不确定性（§1、§2）。
- **与最近邻工作的区别**：UGAC 把不确定性写进损失（MRI 模态翻译，广义高斯似然），本文是训练后**用集成分歧事后测量**；监督虚拟细胞染色的集成工作（Imboden et al. 2023）有配对真值可算误差，本文没有（§2）。

## 2. 核心方法和数据流

```text
70 张 WSI（35 只小鼠，H&E 与 SR 各 35 张；同块相邻切片，天然无配对）
  → QuPath 组织掩膜，20× 扫描，512² 无重叠切块，双线性降到 256²（0.442 µm/px）
  → 按动物划分：30 只训练（201,257 H&E / 196,415 SR tiles），5 只测试（16,290 tiles/域）
  → 6 种架构 × 3 种容量（~10M / ~50M / ~100M）× 3 种数据比例（25/50/100%）= 54 组
  → 每组：生成虚拟 SR → 用冻结 nnU-Net v2 胶原分割模型量 CPA → 与真实 SR 的 CPA 比 MAE
  → 同时算 Patch-SSIM / LPIPS / FID；每家族最佳配置再各训 10 个种子做深度集成
  → 集成方差 = 认知不确定性；与 cycle 重建误差做校准分析；另做 3 人盲评
```

**（a）数据与切分（§3、S1）**：35 只 C57BL/6N 小鼠，胆管结扎（BDL）模型加 sham 对照，覆盖术后 3/21/42/63 天。切片 4 µm，H&E 与 SR 取自同一组织块的非连续切面，因此宏观形态一致但**不能逐像素对应**。切块后训练集 100% 为 30 只（201,257/196,415 tiles）；25% 与 50% 是**严格子集**（取连续编号的 1–7、1–15 只），避免"换了哪些切片"的混淆。测试集 5 只（16,290 tiles/域）。测试集缺少第 63 天（最晚期纤维化）：唯一候选样本两染色间无法配准而被排除（§3、Table S2）。少于 50% 组织像素的块在训练集中被丢弃，测试集不丢（S1）。

**（b）六种架构都在学什么（§4、S2）**
- **CycleGAN**：两个生成器 + 两个 70×70 PatchGAN 判别器，LSGAN 对抗 + 循环一致性（λ_cyc=10）+ 可选 identity 损失（0.5）。
- **UNIT**：两域共享 VAE 瓶颈（私有 block + 共享 block），对抗 + 重建 + KL（0.01）。
- **MUNIT**：把内容码与风格码解耦，风格经 AdaIN 注入解码器（风格向量维度 8，MLP 256）。
- **DCLGAN**：在 CycleGAN 上加双向 patch 级 InfoNCE（τ=0.07），四个特征层各采 256 个位置投到 256 维。
- **UVCGAN**：UNet + ViT 瓶颈（ReZero 残差），两阶段——先 250k 步掩码图像预训练，再 500k 步循环一致微调。
- **CycleDiffusion**：两个域各自的 DDPM 同时训练（ε-预测，T=1000，线性噪声表），推理时用 DDIM **反演**把 H&E 映到共享噪声潜码，再用目标域 DDPM **采样**出 SR；循环一致性是推理期的性质，不是训练损失。

**（c）训练与推理（§5、S3）**：Adam，lr 2e-4，β=(0.5,0.999)，**batch size 1**，按优化步计（750k 步；UVCGAN 为 250k+500k），后半程线性衰减，无 weight decay。GAN 家族推理一次前向；CycleDiffusion 每块要 200 步 DDIM 反演 + 200 步采样，约两倍单次 DDIM 开销。

**（d）四条评估轴**
1. **CPA MAE（主指标）**：把冻结的 nnU-Net v2 胶原分割模型**同样地**用在真实 SR 与虚拟 SR 上，得到每张 WSI 的 CPA，再算平均绝对误差（式 1）。这是"生物量层面"的配对比较，绕开了像素对齐问题。
2. **感知/分布**：Patch-SSIM（局部结构，缓解残余错配）、LPIPS（VGG 深度特征距离）、FID（InceptionV3 特征分布）。作者明确说 FID 的特征来自自然图像，可能奖励"看起来真"而漏掉胶原结构，所以**不用 FID 作主指标**。
3. **专家盲评**：3 位读者（2 位外部肝病专家 + 1 位有组织学经验的作者），任务一判 45 张 SR 图块真/假（15 真 + 15 最佳配置 + 15 最差配置，比例不告知）；任务二给 30 组"同一 H&E + A/B 两张生成 SR"，按四点量表评胶原分布是否生物学合理。
4. **认知不确定性**：每家族选 CPA MAE 最低的 100% 数据配置，重训 K=10 个不同种子，逐像素算跨成员方差并按通道求和（式 2、S10–S11），图块级取组织区均值 σ̄；再与 **cycle 重建误差**（前向翻译再逆向还原的差，式 S12）做校准——注意这只是误差**代理**，不是真值误差。

## 3. 论文证据与实验范围

**每家族最佳配置（Table 1，100% 数据，按 CPA MAE 选）**

| 家族 | 规模 | Patch-SSIM ↑ | LPIPS ↓ | FID ↓ | CPA MAE ↓ |
|---|---|---|---|---|---|
| CycleGAN | M | 0.334±0.041 | **0.038**±0.001 | 201.8 | **0.008**±0.007 |
| UNIT | M | 0.333±0.041 | **0.038**±0.002 | **195.2** | 0.037±0.033 |
| MUNIT | M | 0.310±0.022 | 0.040±0.001 | 209.5 | 0.043±0.014 |
| DCLGAN | S | **0.339**±0.040 | 0.039±0.001 | 207.4 | 0.028±0.037 |
| UVCGAN | S | 0.311±0.032 | 0.039±0.001 | 242.5 | 0.035±0.021 |
| CycleDiffusion | S | 0.217±0.009 | 0.044±0.000 | 210.4 | 0.051±0.029 |

四个指标各自指向不同家族：FID 最好的是 UNIT，Patch-SSIM 最好的是 DCLGAN，CPA MAE 最好是 CycleGAN。**没有任何一族四项全胜。**

**指标之间只有中等一致性（Table 2，54 组上的 Spearman 秩相关，全部 p<0.001）**

| | Patch-SSIM | LPIPS | FID | CPA MAE |
|---|---|---|---|---|
| Patch-SSIM | 1.00 | 0.82 | 0.60 | 0.63 |
| LPIPS | | 1.00 | 0.49 | 0.64 |
| FID | | | 1.00 | 0.55 |

感知两兄弟（SSIM/LPIPS）高度一致（0.82），但它们与任务误差只有 0.63/0.64，FID 与 CPA 只有 0.55。这就是"感知饱和"的量化版本。

**规模与数据量的非单调行为（§5.2，均作者报告）**
- CycleGAN：9 组配置的 Patch-SSIM（0.312–0.342）和 LPIPS（0.038–0.040）几乎不动；CPA MAE 在 100% 数据下 S/M/L 为 0.049/0.008/0.085，**中号最好，大号反而差**。
- UNIT：100% 数据下 0.046/0.037/0.043，无一致容量优势；小号在 50% 数据取得其最好值 0.017。
- MUNIT：最稳，9 组 CPA MAE 都在 0.040–0.059，被作者归因于 AdaIN 风格解耦的正则效果。
- DCLGAN：100% 数据下稳定（0.028–0.042）；**25%/50% 时大号崩塌**（Patch-SSIM 0.126–0.143，FID 327–363，CPA MAE 0.082–0.091），小/中号仍稳（0.019–0.049）。
- UVCGAN：只有小号稳定（CPA MAE 0.035–0.077）；中/大号所有数据比例都退化（FID 287–395，CPA MAE 0.063–0.118），中大号在 100% 数据达到最差 0.118±0.053。
- CycleDiffusion：Patch-SSIM 系统性偏低（0.200–0.293），作者解释为 DDIM 反演的归纳偏置而非失败；小号随数据减少急剧恶化（100%→25% 时 0.051→0.171），中号却在 25% 数据取得最低 0.035（作者承认只是猜测：多样性减少可能抑制了切片特有颜色伪影）。

**专家盲评（§5.2、Table S8）**：任务一里最佳配置图块有 38% 被判为生成，最差配置为 62%。任务二使用四级量表；三位读者对最佳配置的平均分分别为 2.7/3.2/3.7，对最差配置为 1.1/1.4/1.7，同一读者都更偏好最佳配置。读者偏好与 CPA MAE 排序一致（0.008 vs 0.171），而感知指标把两者排得更近；这支持补充任务相关评价，但不能从三位读者外推普遍临床可靠性。

**集成不确定性（§6，Figure 4、Table S7）**
- 图块级 σ̄ 中位数：GAN 家族 37.68（UVCGAN）–41.42（MUNIT），IQR 多为 3.26–3.80，唯 DCLGAN 只有 1.48（约为其他 GAN 的一半）。CycleDiffusion 中位数最低（23.35）但 IQR 最宽（5.89）。
- 跨图块校准（对 cycle 误差）：GAN 家族 Pearson 0.50–0.66，DCLGAN 0.659（ECE 0.055）、MUNIT 0.618（0.058）最好；CycleDiffusion −0.025、ECE 0.214，可靠性曲线近乎平的（**不确定性无信息**）。
- 图块内空间校准：全部很弱，Spearman 0.058–0.165。作者直接下结论：**像素级不确定性不能当质量门**；跨图块也只能做软性分诊。
- 所有家族可靠性曲线都在对角线下方（集成给的不确定性高于归一化 cycle 误差），作者解释为"所有模型都在最小化循环损失，误差代理被压缩"。

## 4. 复现与审计重点

1. **代码与资源声明**：结论段给出 I2I-Stain-Zoo（`https://github.com/HoehmeLab/I2I-Stain-Zoo`）。本次核验：仓库 README 可读，明确写 "BMVC 2026"、六架构统一接口、`i2i-train`/`i2i-inference` 命令、三种评估轴；`pyproject.toml`、`i2i_stain_zoo/train.py`、`i2i_stain_zoo/base_models.py` 三个文件返回 200（存在）。**未**克隆代码、未读训练脚本细节、未跑任何命令。
2. **数据**：README 与 S1 称 70 张 WSI、tiling 管线、切分与模型权重一并发布（CC BY 4.0，受原研究数据共享条款约束），下载入口指向 `hoehmecloud.izbi.uni-leipzig.de` 的分享链接。该链接在本次核验中无法建立连接（curl 返回 000），**可下载性未证实**。
3. **成本口径**：54 组配置各 750k 步（UVCGAN 为 750k 两阶段合计），batch size 1，256² 输入；再加 6 个家族 × 10 个种子的集成重训。论文未给 GPU 型号/卡数/墙钟时间，**无法据此给出显存或时长估计**，也不应假定"小模型就好复现"。
4. **统计功效有限**：测试集只有 5 个配对样本（10 张 WSI），CPA MAE 的 std 常常与均值同量级（如 0.008±0.007、0.037±0.033）。作者在 Limitations 里自己说明：相邻配置之间的排名差异应视为不确定。**引用单个最优值（0.008）时必须带上 std 与 N=5。**
5. **指标本身的偏差**：Patch-SSIM/LPIPS 算在松配准的相邻切片上，结构正确但空间错位也会被罚；FID 的 InceptionV3 特征来自自然图像；CPA MAE 依赖一个冻结的 nnU-Net 胶原分割器——它自己的误差会传进所有比较（§5.1、§7）。
6. **测试集覆盖缺口**：最晚期（day 63）纤维化在测试集中缺席，因此"在重度纤维化上是否仍可靠"没有证据（§3）。
7. **首个可做的实验**：不必复现 54 组。先复现 CycleGAN-M @100%（Table 1 最优）与 DCLGAN-L @25%（崩塌案例），验证 (a) 数据管线与 CPA 计算是否对得上，(b) 崩塌是否可重现。这两点决定后续所有结论是否可信。
8. **领域外推**：全部结论来自单一小鼠 BDL 模型、单一实验室、单一组织。作者明确不主张迁移到人 NASH/NAFLD 或跨中心（§7 Limitations）。

## 5. 建议阅读顺序

§1 任务动机 → §3 数据与"为什么无配对"→ §4 六个家族各自的机制 → §5.1 四条评估轴（尤其 CPA MAE 怎么算）→ Table 2（指标间相关性）→ §5.2 崩塌案例 → §6 集成与校准（式 2、S5.2 的误差代理）→ Table S7 → §7 Limitations。

## 6. 前后关联

- [HistDiT](62-histdit.md)：同样是虚拟染色（H&E→IHC），但用结构条件 DiT 做方法创新；本文可作为它的评估协议参照。
- [CHIS](61-chis.md)：可控病理图像合成；对读能看出"生成质量"在不同任务里该用什么尺子量。
- [Toward Robust Histopathology Imaging](60-unsupervised-artifact-restoration.md)：无监督检测/修复路线；同样面临"没有配对真值怎么评估"的问题。
- [HESCAPE](17-hescape.md)：跨模态基准研究；方法论上可对照它如何设计切分与公平比较。
- [Two-Stage Residual-Guided Diffusion](59-residual-guided-diffusion.md)：病理图像复原的两阶段扩散；如果要做"虚拟染色 + 复原"的组合，这里是另一半拼图。

## 原文摘要

> Liver fibrosis, the principal predictor of long-term outcome in chronic liver disease, is staged from histological estimates of collagen content. Sirius Red (SR) provides the standard quantitative readout (collagen proportionate area, CPA) but is not acquired at every clinical centre and consumes tissue, time, and reagent cost beyond the routine Hematoxylin and eosin (H&E) stain. AI-based virtual staining can generate SR directly from H&E, yet systematic benchmarks of unsupervised models are scarce and their predictive uncertainty has not been quantified, even though visually plausible outputs may not faithfully reproduce the underlying tissue structure. We therefore benchmark six unsupervised image-to-image architectures (GAN-based and diffusion-based) across 54 scaling configurations on a newly released paired H&E to SR mouse liver dataset, the first open resource for this translation task. Each configuration is evaluated jointly on perceptual, distributional, and task-specific axes plus a blinded expert reader study; the best per family is then retrained as a deep ensemble, the first systematic comparison of epistemic uncertainty across unsupervised stain-to-stain architectures. Across families, perceptual quality, task-specific error, and ensemble agreement measure largely independent axes of model fitness: GAN-based methods cluster tightly on perceptual metrics yet differ substantially on task error and ensemble agreement, while the diffusion-based method (CycleDiffusion) is qualitatively different on all three. No single metric captures these differences, so reliable virtual staining requires reporting and selecting on all three jointly. The dataset, tiling pipeline, models, and evaluation code are released publicly.

*来源：[arXiv v1 摘要](https://arxiv.org/abs/2608.24626v1)。*

## 7. 链接

- [BMVC 2026 官方 accepted papers 列表](https://bmvc2026.bmva.org/programme/accepted_papers)
- [题录与完整摘要](https://arxiv.org/abs/2608.24626)
- [正文与补充材料（HTML）](https://arxiv.org/html/2608.24626v1)
- [I2I-Stain-Zoo 代码与数据入口](https://github.com/HoehmeLab/I2I-Stain-Zoo)
