# 92｜无监督伪影流水线：Normalizing Flow 检测 + 自精炼定位 + 扩散修复

**论文**：Toward robust histopathology imaging: An unsupervised framework for artifact detection, localization, and restoration；Medical Image Analysis 2026, 113:104215，DOI [10.1016/j.media.2026.104215](https://doi.org/10.1016/j.media.2026.104215)；2026-07-13 在线，2025-10-06 投稿。
**定位**：WSI 伪影的三段式无监督流水线（检测 → 定位 → 修复），只用正常样本训练。与 [RestorePath](49-restorepath.md) 同属"掩膜 + 扩散修复"，但多出完整检测与定位链，且不做 patch 间全局一致约束。
**精读核验**：2026-10-26 依 Springer 官方排版 PDF（本地 `1-s2.0-S1361841526002847-main.pdf`）核对摘要、§3 方法、§4 设置、Table 1–14、Fig. 3–11、§5.8 局限；未运行代码。所有数字为论文报告值，未经复算。

## 原文摘要

> Whole Slide Images are central to modern pathology and computational histopathology. However, tissue processing and slide scanning can introduce artifacts that degrade image quality and hinder computer-aided diagnosis (CAD) systems. Therefore, automated artifact processing has drawn much attention in recent years. Nevertheless, current methods exhibit limitations, including reliance on annotated data and inadequate pixel-level localization capabilities, resulting in fragmented workflows. To address these challenges, we propose an unsupervised automatic pipeline for artifact detection, localization, and restoration. First, based on the features extracted by the histopathology foundation model, anomaly heatmaps are generated using Normalizing Flow to enable precise artifact detection. Subsequently, optimal artifact masks are identified via anomaly heatmaps and unsupervised semantic segmentation for accurate localization. Finally, a mask-guided artifact restoration is performed using a diffusion model. Experimental results demonstrate that our method effectively handles synthetic and real-world artifacts using only normal training data and improves downstream performance on both BCSS segmentation and TCGA-BLCA tumor staging classification, confirming our method's efficacy in bolstering the robustness of CAD systems, reducing manual verification, and providing an automated solution for artifacts in histopathology images.

*来源：期刊正式版摘要页（Elsevier / PubMed PMID 42462642），逐字保留原文。*

## 0. 零基础导读：先看懂四个词

| 词 | 一句话 |
|---|---|
| **伪影（artifact）** | 制片和扫描引入的坏区域：气泡、组织折叠、笔迹、线头、压缩块、离焦模糊 |
| **无监督异常检测** | 只教模型"正常组织长什么样"，凡是它没见过的就报警。不需要伪影标注 |
| **热图（heatmap）** | 每个位置一个"异常分数"，排成图就是一张亮度图，越亮越可疑 |
| **掩膜（mask）** | 二值图，1 表示"这里是伪影"，交给修复模型，只重画这些像素 |

**这篇要解决的核心矛盾**：现在的伪影方法依赖**标注**（要人画出伪影区域），而且大多只到 patch 级"有没有伪影"，给不出像素级"哪些像素是伪影"。检测、定位、修复三件事又各自为政，串不成流水线。

**摘要一句话**：用"只学正常"的模型出异常热图，把热图精炼成精确掩膜，再让扩散模型按掩膜补上。

## 1. 三分钟摘要与推荐理由

一句话结构：**FastFlow（NF）出热图 → 小卷积网络 + 超像素自精炼出掩膜 → Palette（DDPM）按掩膜补图**。全流程不需要任何伪影标注，只需正常切片。

三段各自的真实技术选型（摘要没说，正文才写）：

| 段 | 实际用什么 | 关键参数 |
|---|---|---|
| 检测 | **FastFlow**（NF 实现）+ **Prov-GigaPath**（ViT-giant/14）特征 | 20 flow steps、Adam、bs 32、lr 1e-3、250 epochs |
| 定位 | **Felzenszwalb 超像素** + 2 个卷积块的小网络迭代自精炼 | SGD bs=1、lr 5e-2、最多 64 次迭代、目标类别数 8、跑 6 次取最优 |
| 修复 | **Palette** 的 inpainting 配置 + **RePaint** 重采样 | resample 3、skip 10 |

**值得学的地方**：把"是否需要修复"和"修复哪里"拆成两个可控环节；定位那一步完全不训练分割网络，靠"超像素内多数投票"当伪标签自监督，这个套路可以搬到任何"有热图但边界糊"的场景。

**要警惕的地方**：下游增益极小（详见 §4.5），且修复在最该证明价值的 BCSS 上还不如直接把伪影图删掉。

## 2. 问题及研究位置

- **监督方法**：ResNet / EfficientNet / UNet++ 做伪影检测定位（Weng et al. 2024；Ke et al. 2023）。精度好，但要大量标注，且遇到分布外（OOD）伪影泛化差。
- **无监督方法**：Fuchs et al. 2024a 用最优传输；Linmans et al. 2024 用 DDPM（AnoDDPM）；Fuchs et al. 2024b 用 DDPM 激活图配合 SAM 定位。作者认为这些方法流程复杂、精度低、多数停在 patch 级。
- **修复路线**：CycleGAN 系（域适应，保留细胞形态好但会留残余伪影）vs DDPM 掩膜引导 inpainting（保真但**依赖精确掩膜**）。本文站位是后者，并声称自己补上了掩膜质量这一环。

**本文的真正位置**：它不是在某一环刷新 SOTA，而是把三环拼成一条自动化流水线，并用"真实伪影 + 下游任务"两套更硬的评测去支撑。相对 [RestorePath](49-restorepath.md)，它走的是 patch 独立处理路线（非重叠切块再拼回），不含跨 patch 一致约束。

## 3. 核心方法和数据流

```text
正常切片 → 256² patch → Prov-GigaPath 提特征（空间特征图）
  → FastFlow 可逆映射到高斯 → 热图 = bilinear( exp(-½‖z‖²) )
  → Youden's index 定全局阈值 τ → 异常像素占比 ≥ 3% 判"有伪影"

热图 → Felzenszwalb 超像素 → 小卷积网络出粗分割
  → 每个超像素内强制众数类别 → 当伪标签 → 重训 → 迭代至收敛
  → 跑 6 次，按热图平均概率筛连通域 → 与二值热图求交 → 最终掩膜

图 + 掩膜 → Palette(DDPM inpainting) + RePaint 重采样 → 无伪影图
```

### 3.1 检测：Normalizing Flow 为什么能出异常分数

NF 是一类**可逆**网络，学一个映射 $f:X\leftrightarrow Z$，把复杂的数据分布压成标准高斯。因为可逆，似然可以精确算出来（换元定理 + 雅可比行列式）：

$$\log p_X(x)=\log p_Z(f(x))+\log\left|\det\frac{\partial f(x)}{\partial x}\right|$$

训练目标就是在正常样本上最大化似然（等价于最小化负对数似然）。测试时把特征送进去，落在低密度区就是"没见过"。

热图用的是 latent 的范数，上采样回原图尺寸：

$$\text{Heatmap}=\text{BilinearUpsample}\left(e^{-\frac12\|z\|^2}\right)$$

两个判决细节：

- 阈值 $\tau$ 用 **Youden's index**（最大化 sensitivity + specificity − 1）自动定，不是手调。
- 判"这张图有伪影"不看最大值，而看**异常像素占比 $\Omega/(H\times W)$ 是否 ≥ 3%**。这个改动把 sensitivity 从 0.984 抬到 0.981–0.991 区间，代价是 specificity 从 0.97 掉到 0.90。

**特征提取器怎么选**（Table 2，这是全文最反直觉的一段）：见 §4.1。

### 3.2 定位：超像素 + 自精炼

作者明确否掉了"直接阈值化热图"：组织形态太异质，纯阈值定位不完整。替代方案不需要任何标注：

1. Felzenszwalb 把图切成形态相似的超像素 $S_k$
2. 小网络（2 个「3×3 → 1×1」卷积块，带 BN+ReLU）输出通道维特征图 $X$，取 argmax 得当像素类别
3. **在每个超像素内，把所有像素强制改成该块出现最多的类别** → 得到 $Y'$
4. 用 $Y'$ 当伪标签，交叉熵训练网络，迭代到类别数 ≤ 8 收敛
5. 网络跑 **6 次**（输出会抖），再挑选

挑选规则写得很具体：去掉面积 < 全图 **1%** 的连通域 → 找热图平均概率 $P_{max}$ 最高的 → 保留与 $P_{max}$ 差 ≤ **0.03** 的 → 比面积取最大 → 合并超阈值连通域 → **与二值热图求交集**。

### 3.3 修复：掩膜处生成、非掩膜处锁死

每一步强制保留原图未标注区域：

$$\hat{x}_t=\hat{x}_t\odot \text{Mask}+x_t\odot(1-\text{Mask})$$

Mask=1 表示伪影（要重画），0 表示好组织（锁死原像素）。配合 RePaint 的重采样缓解不自然接缝。

## 4. 论文证据与实验范围

数据分四套（Table 1）：

| 用途 | 来源 | 规模 |
|---|---|---|
| 合成伪影 | HARP 数据（乳腺，多中心） | 训练 7360 张无伪影；测试 800 张（100 正常 + 700 合成，7 类 × 100） |
| 真实伪影 | TCGA-BLCA（膀胱，多中心） | 微调用 15 张 WSI 的 8169 张正常图；测试用另 13 张 WSI 的 100 正常 + 100 伪影（5 类） |
| 下游分割 | BCSS（乳腺） | 10,105 训练 / 1203 测试，4 类组织 |
| 下游分期 | TCGA-BLCA | 382 例 → 排除 I 期（仅 3 例）→ **364 例三类**，5 折 Monte Carlo，7:1:2 |

### 4.1 检测：最反直觉的结果

Table 2 上半段（用热图最大值当分数）：

| 特征提取器 | ACC | Sens | Spec | AUC |
|---|---|---|---|---|
| 原始 RGB（不用特征） | 0.866 | 0.981 | **0.060** | 0.520 |
| ResNet50（ImageNet） | 0.924 | 0.927 | 0.900 | 0.963 |
| ResNet50\*（病理预训练） | 0.572 | 0.546 | 0.760 | 0.673 |
| UNI\*（病理） | 0.909 | 0.911 | 0.890 | 0.957 |
| **CaiT（ImageNet）** | **0.982** | 0.984 | 0.970 | **0.998** |
| Prov-GigaPath\*（病理） | 0.936 | 0.933 | 0.960 | 0.988 |

三件事：

1. **不用特征提取器直接喂 RGB，specificity 崩到 0.060** —— NF 在像素空间学不到可用的密度。
2. **病理预训练不一定更好**：ResNet50\* (0.572) 远差于 ResNet50 (0.924)，作者自己写"需要进一步分析解释"。
3. **检测最优是 ImageNet 的 CaiT，定位最优才是病理预训练的 Prov-GigaPath**。也就是说**不存在单一最优特征提取器，选型取决于任务**，这跟作者在本节末尾"病理先验对定位至关重要"的表述要分开理解。

下半段改用异常像素占比判定后，Sens 全部 ≥ 0.981。作者接受 specificity 降低的理由：假阳性的多是"大片空白的低质量图"，这类图异常像素占比通常 < 6%，修复后大部分组织信息仍在。

### 4.2 定位：平均只与 MedSAM 打平

Table 3（合成数据，7 类平均）：

| 方法 | Dice | IoU | Pixel Sens |
|---|---|---|---|
| HARP | 0.611 | 0.508 | 0.822 |
| SAM | 0.499 | 0.425 | 0.506 |
| MedSAM | 0.708 | 0.593 | 0.918 |
| **本方法** | **0.716** | **0.594** | **0.918** |

需要看清的三点：

- 平均 Dice 只比 MedSAM 高 **0.008**，IoU 基本持平，Sensitivity 完全相同。
- 真正的差异在**稳定性**：本方法 std ±0.208，MedSAM ±0.234；且在 7 类中有 6 类的 Sensitivity 更高。
- 单体类别上 MedSAM 更准（AirBubble / Compression / Cut / Thread 的 Dice 更高）。作者的解释是合成伪影轮廓清晰锐利，恰好符合 MedSAM 的强项；真实数据上差距才拉开（见下）。

**速度**（Table 4，256² 单图）：本方法 1.233 s，MedSAM 1.849 s，SAM 5.840 s，HARP 24.693 s → 约比 HARP 快 **20 倍**，也是四者中最快。

### 4.3 修复：配对指标输给 CycleGAN，分布指标最好

Table 5（合成数据）：

| 方法 | SSIM↑ | PSNR↑ | LPIPS↓ | FID↓ |
|---|---|---|---|---|
| CycleGAN | **0.892** | **22.437** | **0.093** | 62.663 |
| HARP | 0.717 | 17.889 | 0.174 | 60.069 |
| ArtiFusion | 0.776 | 19.686 | 0.139 | 54.038 |
| Palette（同掩膜） | 0.778 | 19.207 | 0.138 | 45.803 |
| **本方法** | 0.779 | 19.443 | 0.132 | **43.501** |

**这是一个必须看清的指标背离**：SSIM / PSNR 是配对指标（和干净原图逐像素比），CycleGAN 三项全赢；FID 是分布指标，本方法最好。作者的解释是 CycleGAN 改动最小所以配对分数高，但会留残余伪影、视觉差，FID 因此更差。

结论要说得准确：**本方法在"自然度"上最好，在"像素保真"上不如最保守的 CycleGAN。**

### 4.4 真实伪影：不微调就崩，微调后恢复

Table 6（TCGA-BLCA）：

| | ACC | Sens | Spec | AUC |
|---|---|---|---|---|
| 不微调（合成数据训练直接上） | 0.705 | **0.990** | 0.420 | 0.705 |
| 用 8169 张正常图微调后 | **0.935** | 0.970 | **0.900** | **0.935** |

Sensitivity 0.990 说明"能抓到"，但 Specificity 0.420 说明**大量正常图被误判为伪影**——这是 NF 学习正常分布的必然代价：换一个数据源，分布就漂移。用新域的正常图微调即可恢复。**所以"无监督"不等于"免适配"，跨机构部署仍需要该机构的一批正常切片。**

真实数据定位（Table 7）上差距才真正拉开：Dice 0.778 vs MedSAM 0.691、HARP 0.590、SAM 0.382。

### 4.5 下游任务：增益很小，而且不稳定

**BCSS 分割（Table 8，平均 Dice）**：

| 策略 | 平均 Dice | 平均 IoU |
|---|---|---|
| 原始数据 | 0.668 | 0.556 |
| **直接删除伪影图** | **0.673** | **0.562** |
| 修复伪影图 | 0.669 | 0.556 |
| 修复 + 复检删除 | 0.670 | 0.558 |

- 修复只比原始高 **0.001**。
- **最有效的策略是直接删图**，比修复还高 0.004。作者自己承认"修复仍低于直接删除，说明修复方法需要进一步改进"。

**TCGA-BLCA 分期（Table 9）**：

| 策略 | ACC | AUC | F1 |
|---|---|---|---|
| 原始 | 0.514 | 0.709 | 0.500 |
| 删除伪影 | 0.538 | 0.705 | 0.536 |
| 修复伪影 | **0.549** | **0.717** | **0.547** |

这里修复反而好于删除（+0.011 ACC）。但 n=364、5 折 Monte Carlo、**无显著性检验**，三分类 ACC 从 0.514 到 0.549 是否稳定，论文没回答。

### 4.6 消融：三个组件的边际贡献都很小

Table 10（合成数据定位）：

| Seg | ProbDiff | MinArea | Dice | IoU | Sens |
|---|---|---|---|---|---|
| — | — | — | 0.700 | 0.571 | 0.888 |
| ✓ | | | 0.714 | 0.590 | 0.899 |
| ✓ | ✓ | | 0.716 | 0.594 | 0.912 |
| ✓ | ✓ | ✓ | **0.716** | **0.594** | **0.918** |

**基线（直接把热图二值化）已经有 Dice 0.700。** 三个组件全加上只涨 0.016 Dice，主要收益在 Sensitivity（+0.030）。也就是说：这套定位机制的价值是"更少漏检"，不是"更准的边界"。

超参敏感性（Table 11–14）显示四个参数（3%、1%、0.03、6 次）都选在**接近最优但不是最优**的点上——作者的解释是权衡 sensitivity，但结果上说明这套系统对参数并不敏感。

## 5. 复现与审计重点

1. **代码与权重已公开**：`github.com/yhuaishui/An-Unsupervised-Framework-for-Artifact-Detection-Localization-and-Restoration`。合成伪影数据集来自 HARP（Fuchs et al. 2024b），模型托管在 HF `SsharvienKumar/HARP_Models`。
2. **训练成本远低于生成式大模型**：只用正常样本，250 epochs、bs 32、7360 张 256² 图，单张 A100 80G 完成全部实验。**这是本文最实用的一点——单卡可复现。**
3. **外部依赖三件**：Prov-GigaPath（ViT-giant/14，需授权）、FastFlow、Palette（inpainting 配置）。FFCV/AnomaLib 生态可替换。
4. **首个验证建议**：固定同一批热图，只替换定位模块（baseline 二值化 vs 完整流程），看 Dice 与 Sensitivity 的分离——因为消融显示收益主要在后者，而后者对修复更重要（漏检 → 伪影残留）。
5. **必须自己补的检查**：论文没报修复后的**下游假阳性率**。完全 inpaint 的区域可能产生不存在的病理结构，这一点作者在 §5.8 自己列为风险，但没有量化。

## 6. 建议阅读顺序

Fig. 2 总览 → §3.1（只看热图公式和 3% 规则）→ Table 2（特征提取器的反直觉结果）→ §3.2 + Algorithm 1（超像素自精炼）→ Table 3 + Table 4（与 MedSAM 打平但快）→ §3.3 + Table 5（指标背离）→ §5.2 真实伪影（Table 6 的 Specificity 崩塌）→ Table 8/9（下游增益）→ Table 10（消融）→ §5.8 局限。

## 7. 我的批评（作者没写的）

1. **修复这一环没有真正证成**。BCSS 上修复（0.669）不如直接删（0.673）；分期上虽好一点但无显著性。作者诚实承认了一半（BCSS），另一半（分期）没有检验。
2. **定位的增益被高估**。平均 Dice 只赢 MedSAM 0.008，消融里三组件总共 +0.016。真正稳定领先的是 Sensitivity 和速度。
3. **MedSAM 的对比条件不明确**。正文只说"执行了 MedSAM"，没写提示（点/框）怎么给。如果给了自动框，这是强对比；如果只是整图推理，MedSAM 本就不该期望高。这条不查清，Table 3 的结论要打折。
4. **"无监督"的边界要说清**：不需要伪影标注，但**需要目标机构的一批正常切片**做微调（Table 6 的 0.420 → 0.900 就是证据）。跨机构部署不是零成本。
5. **合成测试集建在强假设上**：700 张伪影图由 100 张正常图合成，伪影位置和掩膜 GT 都是完美的；真实伪影测试只有 100 张。所以合成数据的定位分数天然偏高，真实数据上的 0.778 才是可信那一档。

## 8. 前后关联与链接

- [RestorePath](49-restorepath.md)：同为"掩膜 + 扩散修复"，但它是 patch 聚合 + 全局一致约束，本文是 patch 独立处理 + 完整检测定位链。
- [ArtiFusion](55-artifusion.md)、[ArtiDiffuser](57-artidiffuser.md)：本文修复段的直系前作，Table 5 里都是对照。
- [DiffusionQC](74-diffusionqc.md)：另一条"用扩散模型做质控检测"的路线，可对照无监督异常检测的两种实现。
- [SheafStain](91-sheafstain.md)：同样处理"切片质量问题"，但方向是染色归一化而非伪影修复。

**链接**

- [论文（DOI）](https://doi.org/10.1016/j.media.2026.104215) · [PubMed](https://pubmed.ncbi.nlm.nih.gov/42462642/)
- [官方代码](https://github.com/yhuaishui/An-Unsupervised-Framework-for-Artifact-Detection-Localization-and-Restoration)
- [合成伪影数据来源 HARP / 模型](https://huggingface.co/SsharvienKumar/HARP_Models)
- [BCSS 数据集](https://github.com/PathologyDataScience/BCSS)
