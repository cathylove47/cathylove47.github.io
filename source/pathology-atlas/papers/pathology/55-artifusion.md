# 55｜ArtiFusion：第一次把 DDPM 用在病理伪影修复，且只用无伪影图像训练

**论文**：Artifact Restoration in Histology Images with Diffusion Probabilistic Models，MICCAI 2023（arXiv:2307.14262v1，2023-07-26）  
**定位**：病理伪影修复的开山扩散工作、仅用 artifact-free 图像训练、Swin-Transformer 去噪骨干与 time token  
**精读核验**：依据 arXiv v1 的摘要、方法与表格整理（2026-10-15）；表格数值逐字摘自正文，尚未进行复现实验。

## 原文摘要

> Histological whole slide images (WSIs) can be usually compromised by artifacts, such as tissue folding and bubbles, which will increase the examination difficulty for both pathologists and Computer-Aided Diagnosis (CAD) systems. Existing approaches to restoring artifact images are confined to Generative Adversarial Networks (GANs), where the restoration process is formulated as an image-to-image transfer. Those methods are prone to suffer from mode collapse and unexpected mistransfer in the stain style, leading to unsatisfied and unrealistic restored images. Innovatively, we make the first attempt at a denoising diffusion probabilistic model for histological artifact restoration, namely ArtiFusion. Specifically, ArtiFusion formulates the artifact region restoration as a gradual denoising process, and its training relies solely on artifact-free images to simplify the training complexity. Furthermore, to capture local-global correlations in the regional artifact restoration, a novel Swin-Transformer denoising architecture is designed, along with a time token scheme. Our extensive evaluations demonstrate the effectiveness of ArtiFusion as a pre-processing method for histology analysis, which can successfully preserve the tissue structures and stain style in artifact-free regions during the restoration. Code is available at https://github.com/zhenqi-he/ArtiFusion.

*来源：arXiv:2307.14262；逐字原文，未改写、未压缩。*

## 中文摘要

> 组织学全切片图像（WSI）通常会被组织折叠、气泡等伪影破坏，这会增加病理学家与计算机辅助诊断（CAD）系统的检查难度。现有的伪影修复方法局限于生成对抗网络（GAN），其修复过程被表述为图像到图像的转换。这些方法容易出现模式坍塌，并发生意料之外的染色风格误迁移，导致修复结果不理想、不真实。我们创新性地首次尝试将去噪扩散概率模型用于组织学伪影修复，命名为 ArtiFusion。具体而言，ArtiFusion 把伪影区域修复表述为一个渐进去噪过程，并且其训练仅依赖无伪影图像，以简化训练复杂度。此外，为在区域伪影修复中捕捉局部—全局相关性，我们设计了一个新颖的 Swin-Transformer 去噪架构，以及一种 time token 机制。我们的大量评估表明，ArtiFusion 作为一种用于组织学分析的预处理方法是有效的，在修复过程中能够成功保留无伪影区域的组织结构与染色风格。代码见 https://github.com/zhenqi-he/ArtiFusion。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

这条支线的起点。2023 年它做了两件后来被反复沿用的事：

1. **把修复定义成受掩码约束的去噪重采样**（RePaint 式）：已经干净的区域每个时间步都被原图「钉住」，只让伪影区随扩散过程演化。这正是后来 ArtiDiffuser「只改伪影区」与 RestorePath「DWI/AGS 调制」的共同祖先。
2. **只用 artifact-free 图像训练**：不需要伪影—干净配对数据。训练集是 Camelyon17 子集里 **2445** 张无伪影图像（另一半 2547 张含伪影图像不参与训练），比 CycleGAN 少一半数据。

架构上是当时少见的替换：U 形网络的 encoder / bottleneck / decoder 全部用 Swin-Transformer，并把时间步做成 **time token 拼接到特征 token 上**（而非 U-Net 的直接相加），每个 Swin block 有自己的时间嵌入权重。

一句话评价：方法在今天看已经不复杂，但它是「病理修复 = 掩码条件扩散」这一范式的最早可复现实现，且训练门槛低（两张 RTX A4000、250 时间步）。作为对比基线读，性价比很高。

## 2. 问题及研究位置

- **问题**：组织折叠、气泡等伪影同时干扰病理学家与 CAD 系统。
- **当时的主流**：GAN 的 image-to-image（CycleGAN 一类），两个已知失效模式——**模式坍塌**与**染色风格误迁移**（把伪影区附近的颜色「修」跑偏）。
- **本文主张**：换成 DDPM，把修复变成渐进去噪；训练只用无伪影图像；用 Swin 骨干替代 DDPM 默认 U-Net 以捕捉区域伪影的局部—全局相关性。

位置与后续的关系：本篇解决「能否用扩散修伪影」，ArtiDiffuser（MIA 2025）解决「修与造的统一 + 下游鲁棒性」，RestorePath（MICCAI 2026）解决「百万像素尺度跨 patch 一致性」，LatentArtiFusion 解决「潜空间效率」。四篇串起来就是这条支线的演进。

## 3. 核心方法和数据流

```text
训练（只用 artifact-free 图像）
Camelyon17 子集：2445 张 artifact-free 图像（256×256 @ 20×，另有 2547 张含伪影图像不参与训练）
    → 前向：逐步加高斯噪声，q(x_t|x_{t-1}) = N(x_t; √(1-β_t)·x_{t-1}, β_t·I)
    → 反向：Swin-Transformer 去噪网络
         U 形结构：encoder / bottleneck / decoder 三处全部用 Swin-Transformer block
         时间步 t → learnable linear layers（每个 Swin block 权重独立）
             → time token，拼接(concat)到 feature tokens 上
             → 走 attention，之后丢弃该 token 以保持特征维度
    → 目标：DDPM 的变分下界 L（L_T + Σ L_{t-1} + L_0，KL 形式）
    总时间步 T = 250，Adam，lr 1e-4

推理（掩码约束的重采样）
输入 x₀（含伪影）→ threshold method 检测伪影区 → 布尔掩码 m
    → 每步构造 x_t^in = x_t^sample ⊙ (1-m) + x_{t+1}^out ⊙ m     (Eq. 2)
        x_t^sample ~ N(√ᾱ_t·x₀, (1-ᾱ_t)·I)
        即：无伪影区用「加噪到 t 步的原图」，伪影区用「上一步模型输出」
    → 逐步去噪，只对伪影区做 denoising resampling
    → 输出 x₀ ⊙ (1-m) + x₀^out ⊙ m
```

三个可复用的设计点：

1. **掩码约束的重采样**（Eq. 2）保证干净区域在数值上几乎不动——这正是「不误迁移染色」的机制来源，而不是靠损失函数惩罚。
2. **time token 用拼接而非相加**：适配 Swin 的 token 结构，消融表（‘Add’ 行）显示相加方案也几乎等价（见表 1），所以这一创新对指标的贡献很小，对结构适配的意义更大。
3. **推理前需要伪影掩码**：论文用 threshold method 得到。这一点后来成为整条支线的瓶颈，直到 MIA 2026 那篇无监督框架才把掩码自动产出。

## 4. 论文证据与实验范围

**数据与设置**【Sec. 3】：训练用 Camelyon17 子集（2445 无伪影 + 2547 含伪影，仅前者训练）；测试用公开组织学数据集（ClusterSeg，462 张无伪影，配对伪影由 [18] 方法手工合成）；图像统一 256×256 @ 20×。

**修复指标（Table 1，逐字）**：

| Methods | L2 (×10⁴)↓ | MSE↓ | SSIM↑ | PSNR↑ | FSIM↑ | SRE↑ |
|---|---|---|---|---|---|---|
| CycleGAN (#1) | 1.119 | 0.5583 | 0.9656 | 42.37 | 0.7188 | 51.42 |
| CycleGAN (#2) | 1.893 | 0.5936 | 0.9622 | 42.12 | 0.7162 | 50.21 |
| ArtiFusion (U-Net) | 0.5027 | 0.2508 | 0.9850 | 47.61 | 0.8173 | 54.59 |
| ArtiFusion (Add) | 0.5007 | 0.2499 | 0.9850 | 47.79 | 0.8184 | 54.76 |
| ArtiFusion (Full) | 0.4940 | 0.2465 | 0.9860 | 48.08 | 0.8216 | 55.43 |

作者陈述：L2 与 MSE 相对基线下降超过 50%（`1×10⁴ → 0.5×10⁴`、`0.55 → 0.25`）；SSIM/PSNR/FSIM/SRE 分别提升 `0.0204 / 5.72 / 0.1028 / 4.02`。

**注意指标口径**：本文**不使用 FID 与 LPIPS**，全部是保真度类指标（L2/MSE/SSIM/PSNR/FSIM/SRE）——与后期几篇普遍改用 FID + 病理特征相似度（CONCH/CTransPath 嵌入）的口径不同，跨论文比较数值时不能直接对照。

**复杂度（Table 2，逐字）**：CycleGAN 28.28 M / 60.04 G FLOPs / 1.065 s；ArtiFusion (UNet) 108.41 M / 247.01 G / 112.37 s；ArtiFusion (Add) 27.74 M / 7.69 G / 30.14 s；ArtiFusion (Full) 29.67 M / 7.73 G / 30.71 s。作者称参数量相比基线下降 72.6%，代价是推理时间更长。

**下游验证（Table 3，NCT-CRC 组织分类准确率 %，逐字）**：

| Settings | ResNet18 | ResNet34 | ResNet50 | RexNet100 | EfficientNetB0 |
|---|---|---|---|---|---|
| Clean | 95.529 | 93.538 | 94.833 | 95.487 | 95.808 |
| Artifacts | 80.302 | 86.031 | 85.012 | 90.446 | 90.626 |
| Restored w CycleGAN | 86.326 | 88.273 | 87.994 | 90.776 | 91.811 |
| Restored w ArtiFusion | 92.376 | 91.252 | 90.408 | 92.310 | 94.232 |

作者陈述：伪影使五种网络架构准确率下降均超过 5%；ArtiFusion 修复后一致高于 CycleGAN 修复后；Clean 作为上界。

**论文自陈局限**（无独立 Limitations 章节）：唯一 baseline 是 CycleGAN，作者解释为当时该方向缺少可比的公开文献与开源代码；参数量下降的代价是推理更慢；未来工作是把方法扩展到 score-based / score-SDE 扩散。另外，Table 2 正文称「相比 CycleGAN 的参数量下降 72.6%」，但 `108.41×10⁶` 一行在表中属于 **ArtiFusion (UNet)** 而非 CycleGAN，与该句表述不一致（原文如此，疑为笔误）——引用该数字时以表格为准。

## 5. 复现与审计重点

- **先解决掩码**：推理依赖 `threshold method` 检测伪影区，正文未给阈值细节。这是最容易造成复现偏差的一环：掩码过小 → 伪影残留，掩码过大 → 大块域外生成。建议固定一套掩码来源（如 GrandQC 或自建）后再比较修复质量。
- **测试集是合成伪影**：配对伪影由 [18] 的手工合成流程产生，因此 Table 1 的指标衡量的是「去合成伪影」能力；真实扫描伪影的表现需要另测。
- **指标口径迁移**：本文不用 FID/LPIPS。若要与后续论文（ArtiDiffuser、RestorePath）对比，必须在同一套指标下重跑，或明确标注口径差异。
- **训练成本作为甜点**：T=250、两张 A4000（16 GiB）、lr 1e-4、Adam。这使 ArtiFusion 成为支线里最容易先跑通的基线，适合作为「复现—改机制」的起点。
- **可验证的改进切口**（均属待验证假设）：把固定 `T=250` 的完整采样换成蒸馏/少步采样（本篇推理 30.71 s，是 CycleGAN 的约 29 倍）；把 threshold 掩码换成异常检测掩码；把保真度指标补齐为「保真度 + 病理特征相似度」双口径。
- **时间步与掩码重采样的实现细节**：Eq. 2 的 `x_{t+1}^out` 指上一步网络输出而非采样结果，实现时容易写反；这是复现最容易出错、也最影响结论的一行。

## 6. 建议阅读顺序

`Abstract` → `1. Introduction`（两条贡献：仅无伪影训练、Swin 去噪骨干）→ `2. Method` 的 Overall Pipeline 与 Eq. 2 → Swin-Transformer Denoising Network（Fig. 3 与 time token）→ `3. Dataset` 与 Implementations（T=250）→ `Table 1` 与 Table 2 → `Table 3` 下游分类 → `4. Conclusion`。

## 7. 前后关联

- 与 [ArtiDiffuser](57-artidiffuser.md) 同源：同一批作者（Yiqing Shen、Junjun He），把「首个 DDPM 修复」扩展为「修复 + 合成统一 + 类别引导 MoE」。
- 与 [RestorePath](49-restorepath.md) 对照：同样靠掩码把修改限制在伪影区，但 RestorePath 把范围推到百万像素并显式处理跨 patch 一致性，且用病理基础模型嵌入做条件。
- 与 [Toward Robust Histopathology Imaging](60-unsupervised-artifact-restoration.md) 对照：本篇假设掩码已知（threshold method），那篇把掩码变成无监督产出——两篇合起来是「掩码从哪来」这个问题的前后两半。
- 与 [TopoCellGen](21-topocellgen.md) 对照：同属病理扩散生成，但一个造新结构、一个只重建被遮挡的原有结构。
- 与 [CLAM](29-clam.md) / [TransMIL](30-transmil.md) 相连：下游分类（NCT-CRC 五架构对照）是「修复是否有用」的最终判据，本篇用通用分类网络，后续工作则直接用 MIL 模型。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2307.14262)
- [arXiv HTML 正文](https://arxiv.org/html/2307.14262v1)
- [官方代码 ArtiFusion](https://github.com/zhenqi-he/ArtiFusion)
- [训练数据 Camelyon17](https://camelyon17.grand-challenge.org)
- [测试数据来源 ClusterSeg](https://github.com/lu-yizhou/ClusterSeg)
