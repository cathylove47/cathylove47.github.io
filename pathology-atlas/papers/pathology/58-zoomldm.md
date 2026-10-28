# 58｜ZoomLDM：把倍率变成条件，一个模型生成从 20× 到 0.15625× 的多尺度图

**论文**：ZoomLDM: Latent Diffusion Model for multi-scale image generation，CVPR 2025（arXiv:2411.16969v2，2025-03-24；Yellapragada, Graikos, Triaridis, Prasanna, Gupta, Saltz, Samaras；Stony Brook University）  
**定位**：倍率感知条件（mag-conditioning）、跨倍率共享隐空间 Summarizer、联合多尺度采样到 4096×4096、4× 超分、多尺度 MIL 特征  
**精读核验**：依据 arXiv v2 的摘要、方法、表格与补充材料整理（2026-10-15）；数值逐字摘自原文，尚未进行复现实验。

## 30 秒看懂

**一句话**：ZoomLDM 把倍率变成条件，一套权重管住 20× 到 0.15625× 八个尺度，并能联合多尺度采样到 4096²。

**问题**：千兆像素不能整图训练；patch 级模型抓不住全局结构——LRDM 在 4096² 上每块都好看，拼起来却不像一张真实病理图。

**瓶颈**：4096² 上它并没有赢（CLIP FID 6.75 对 LRDM 2.75、∞-Brush 2.63），优势是 8 分钟对 4 小时；大块均匀区有可见拼缝，低倍率细结构不连贯，inversion 在条件集合变大时失效。

**insight**：让所有倍率的条件落进同一个 cross-magnification latent space。把"该 patch 在 20× 下覆盖区域的全部嵌入矩阵"经 Summarizer 压成定长 token，再拼一个学习到的倍率嵌入，低倍率的稀缺样本就能从高倍率数据里借力。

## 3 分钟讲清

**方法（按顺序）**：
1. TCGA-BRCA 1136 张 WSI 切 256² patch，构造 8 个倍率；低倍率 patch 的条件是该区域全部 20× 嵌入组成的矩阵，超过 8×8 的 average pool 到 8×8。
2. Summarizer：12 层 Transformer、hidden 512，吃 ≤64 个嵌入 + 倍率嵌入，输出 65×512 条件 token。
3. 条件经 cross-attention 注入 LDM U-Net（VQ-f4 + ImageNet 预训练 U-Net），8 个倍率共享权重；lr 1e-4、warmup 10k。
4. 另训 CDM（DiT-Base）建模 Summarizer 输出分布，使采样条件可以"凭空造"，不必先有真图。
5. 联合多尺度采样：每步 Tweedie 估计后用最小二乘约束高低尺度一致，用有限差分前向替代对 decoder 的反传（否则显存不可行）；DDIM 50 步、δ=ζ=0.005。
6. 4× 超分：用品 text inversion 反推缺失的 20× 条件，再把待超分图固定为测量。

**作者证据在哪**：Table 1（八倍率 FID，低倍率差距最大——1.25× 8.74 对 39.72）、Table 2（1024² 与 4096² 的时间与两种 FID，"能生成"与"质量最好"必须分开读）、Table 3（4× 超分，inversion 反推的条件优于直接用真值嵌入）、Table 4（MIL：多尺度特征 Subtyping 94.91 / HRD 88.03，超过 UNI 的 94.09 / 81.79）、Table 7（条件编码器是全局最大的单因素：HIPT+CNN 18.88 对 UNI+ViT 6.77）。

**和上一代的区别**：同组 LRDM 的单尺度条件升级成跨倍率条件，并明确指出 LRDM 在大图上抓不住全局结构；RestorePath 沿用它这套骨架，把生成目标换成与周围组织对齐的修复。

**讲 PPT 用这张**：Table 2 的双列（1024² / 4096² 各带时间、CLIP FID、Crop FID），配 Table 4 的 MIL 特征——一张说清代价，一张说明副产品比原用途更强。

## 1. 问题及研究位置

- **问题**：千兆像素大图无法直接训练；patch 级模型抓不住跨 patch 的全局结构。
- **LRDM 的位置与不足**：LRDM 用平滑变化的 SSL 嵌入拼大图，局部外观可控，但**不能理解全局结构**——在 4096×4096 上能生成高质量 patch，拼起来却不像真实病理图。
- **ZoomLDM 的位置**：把所有尺度收进一个模型 + 一个跨倍率共享隐空间，让「低倍率看全局结构、高倍率看局部细节」这件事由模型自己协调。
- 与后续：RestorePath 采用的就是「LDM + 病理基础模型嵌入条件 + 大图 patch 扩散」这一套，只是把生成目标改成了「与周围组织对齐的伪影修复」，并加 DWI/AGS 处理条件邻域与引导强度。

## 2. 核心方法和数据流

```text
数据构造
TCGA-BRCA 1136 张 WSI → 256×256 patch
    尺度 1（20×）：直接提 patch，条件 e = UNI(224×224 @20×) 的嵌入
    更低尺度（2×/4×/8×…降采样）：patch 对应 20× 下的更大区域
        条件 = 该区域全部 20× 嵌入组成的矩阵
        如 5× 的 256×256 ↔ 20× 的 1024×1024 → 4×4×1024 嵌入矩阵
        大于 8×8 的嵌入矩阵 average pool 到 8×8（1.25× 及更低倍率）

训练
(256×256 patch, 嵌入矩阵)
    → Summarizer：12 层 Transformer encoder，hidden 512
        输入 = ≤64 个 SSL 嵌入（不足补 padding）+ 学习到的 magnification embedding
        输出 = 65×512 条件 token（LayerNorm 后）
    → cross-attention 注入 LDM U-Net（VQ-f4 autoencoder + ImageNet 预训练 U-Net）
    → 8 个倍率共享权重；lr 1e-4，warmup 10k；DDPM 训练
    → 另训 CDM（DiT-Base，12 层，hidden 768）建模 Summarizer 输出分布
        → 采样时可直接生成条件，magnification-aware

大图生成（联合多尺度采样）
20× 与 5× 联合 → 1024×1024；20× 与 1.25× 联合 → 4096×4096
    降采样算子 A = bicubic（5× 按 4×、1.25× 按 16× 下采样）
    每步：Tweedie 估计 ẑ₀ → 最小化 C(z_t)=‖A·Dec(ẑ₀)−y‖²
    两处修改：
      (i) 没有真实测量 y → 用当前高尺度估计 Dec(ẑ^{s+1}) 自引导（self-guidance）
      (ii) 用有限差分前向近似代替对 decoder 的反传（否则显存不可行）
    超参：DDIM 50 步，δ=ζ=0.005

4× 超分（256→1024）
只有非 20× 图像 → 无法提 UNI 嵌入 → 用 inversion 反推条件
    借鉴 textual inversion：优化送进 Summarizer 的 SSL 输入
    最大化似然下界 ⇔ 最小化去噪损失 + 先验项 log p(e)
    → 得到条件后跑联合多尺度采样，把 y 固定为待超分真图
```

**为什么条件要 compression**：一个 5× patch 对应 4×4=16 个 20× 嵌入，更低倍率更多；Summarizer 的作用是把「变长嵌入集合」压成定长 token，并让所有倍率的条件落在同一个 cross-magnification latent space 里——这是「一个模型管 8 个尺度」的实现关键。

## 3. 论文证据与实验范围

**数据与设置**：TCGA-BRCA 的 1,136 张 WSI，用 DSMIL 代码提 patch；8 个倍率；每倍率归一化后生成 10,000 张 patch 计 FID。实现：VQ-f4 autoencoder + ImageNet 预训练 U-Net，lr 1e-4，warmup 10,000，DDIM 50 步，CFG 2.0，3×NVIDIA H100、每卡 batch 200。

**各倍率 patch FID（Table 1，逐字）**：

| | 20× | 10× | 5× | 2.5× | 1.25× | 0.625× | 0.3125× | 0.15625× |
|---|---|---|---|---|---|---|---|---|
| 训练 patch 数 | 12M | 3M | 750k | 186k | 57k | 20k | 7k | 2.5k |
| ZoomLDM | 6.77 | 7.60 | 7.98 | 10.73 | 8.74 | 7.99 | 8.34 | 13.42 |
| SoTA | 6.98 | 7.64 | 9.74 | 20.45 | 39.72 | 58.98 | 66.28 | 106.14 |
| CDM（仅条件模型） | 9.04 | 10.05 | 14.36 | 19.68 | 14.06 | 13.46 | 14.40 | 26.09 |

低倍率（1.25× 及以下）的对比模型是「专为该倍率单独训练、架构与 ZoomLDM 相同」的模型——差距来自数据共享，不是架构差异。

**大图生成（Table 2，逐字）**：

| Method | 1024² 时间 | 1024 CLIP FID | 1024 Crop FID | 4096² 时间 | 4096 CLIP FID | 4096 Crop FID |
|---|---|---|---|---|---|---|
| Graikos et al.（LRDM） | 60 s | 7.43 | 15.51 | 4 h | **2.75** | **11.30** |
| ∞-Brush | 30 s | 3.74 | 17.87 | 12 h | 2.63 | 14.76 |
| ZoomLDM | 28 s | **1.23** | 14.94 | 8 m | 6.75 | 18.90 |

作者自陈：1024² 上「easily outperform」；4096² 上「lags in two quality metrics but offers a reasonable inference time per image (8min vs >4hrs)」。→ **「能生成 4096×4096」与「4096×4096 质量最好」是两件事，引用时不可混同。**

**4× 超分（Table 3，节选逐字）**：TCGA-BRCA 上 Bicubic 0.653/24.370/0.486/0.871/0.524；ZoomLDM (Infer emb) **0.609/23.407/0.229/0.957/0.719**；BACH 上 Bicubic 0.895/34.690/0.180/0.969/0.810；ZoomLDM (Infer emb) 0.779/30.443/**0.173**/0.974/**0.808**（列序 SSIM↑/PSNR↑/LPIPS↓/CONCH↑/UNI↑）。作者指出 SSIM/PSNR 偏袒模糊的 bicubic 结果；用 inversion 反推的嵌入优于直接用真值嵌入。

**多尺度特征做 MIL（Table 4，逐字）**：特征取自 ZoomLDM U-Net output block 3、固定 t=100，分类器 ABMIL。

| Features | 倍率 | Subtyping AUC | HRD AUC |
|---|---|---|---|
| Phikon | 20× | 93.81 | 76.88 |
| UNI | 20× | 94.09 | 81.79 |
| CTransPath | 5× | 93.11 | 85.37 |
| ZoomLDM | 20× | 94.49 | 85.25 |
| ZoomLDM | 5× | 94.09 | 86.26 |
| ZoomLDM | 多尺度(20×+5×) | **94.91** | **88.03** |

**条件来源消融（Table 7，逐字）**：HIPT+CNN 各倍率 FID 18.88/16.75/19.31/16.01/14.45/14.21/15.44/18.47、AUC 86.20/72.44；HIPT+ViT 13.49/14.42/15.84/13.32/14.32/12.31/16.25/19.90、87.26/75.92；UNI+ViT **6.77/7.60/7.98/10.73/8.74/7.99/8.34/13.42**、**94.49/85.25**。→ 条件编码器的选择是全局最大的单因素。

**作者自陈局限**（无独立 Limitations 章节）：4096² 质量落后基线；低尺度不提供引导的细结构不连贯（Fig. 14 右下）；大块均匀背景处可见拼缝（Fig. 14 左下）；卫星域同样有 patch 边界不连续；inversion 在条件集合变大时退化（2.5× 提到 20× 时失效）；低于 5× 时模型几乎能完全复现输入（作者辩称不是记忆，而是条件信息足够）。

## 4. 复现与审计重点

- **先确认「倍率」在数据里是否真的可用**：这篇的全部机制建立在「已知大图在 20× 下的区域布局」之上，嵌入矩阵是它训练的核心输入。若数据没有明确倍率记录，机制无从复现；用未对齐的多倍率 patch 冒充会直接毁掉结论。
- **Summarizer 与 CDM 是两件事，别混**：Summarizer 是条件压缩器（联合训练），CDM 是条件采样器（单独训练）。只复现前者可以生成「给定参考图」的样本，只有加上 CDM 才能无条件生成。
- **4096² 的结论要分开引用**：能力（可达）与质量（落后）、时间（8 分钟 vs 4 小时）是三个不同维度，混着说会变成错误结论。
- **联合采样的有限差分近似是复现难点**：Eq.(4)(6) 用有限差分替代对 decoder 的反传，δ=ζ=0.005。实现错误会表现为「图能出但高低尺度对不齐」。
- **MIL 特征的取值条件要写清**：block 3、t=100、UNI 条件——换 block 或换时间步结果会变；这是复现时最容易被忽略的超参。
- **可验证的改进切口**（待验证假设）：把低倍率作为「全局结构先验」注入修复任务（RestorePath 的 DWI 是这条思路的简化版）；用 ZoomLDM 特征当伪影检测器的输入表征；在 4096² 上补齐质量短板（拼缝与细结构不连贯是明确的两个失败面）。
- **资源门槛**：3×H100、每卡 batch 200。这是在 GPU 充足前提下仍然偏重的一档，复现时优先考虑从 5×/1.25× 两个尺度的小规模版本起步。

## 5. 建议阅读顺序

`Abstract` → `1. Introduction`（LRDM 的全局结构缺陷表）→ `3.1` 条件扩散与 Summarizer（含 CDM 与 cross-magnification latent space）→ `3.2` 联合多尺度采样与两处修改 → `4.1` 数据构造（8 倍率与嵌入池化规则）→ `Table 1` → `4.3` 与 `Table 2`（1024² 与 4096² 的差异）→ `4.4` 与 `Table 3`（4× 超分的 inversion）→ `4.5` 与 `Table 4`（MIL 特征）→ `Table 7`（条件编码器消融）→ `9.4` Fig. 14（拼缝与细结构两项自陈弱点）。

## 6. 前后关联

- 与 [LRDM](56-lrdm.md) 直接相接：同一课题组，ZoomLDM 把 LRDM 的单尺度条件升级为跨倍率条件，并显式指出 LRDM 在大图上抓不住全局结构。
- 与 [RestorePath](49-restorepath.md) 相接：RestorePath 的 LDM + PFM 嵌入条件 + 大图 patch 扩散正是这套骨架在修复任务上的改造；本仓库已有笔记把 DiffInfinite / LRDM / ZoomLDM 列为「高分辨率生成」，并指出它们「未做与周围组织严格对齐的 inpainting」——这正是 RestorePath 的切入点。
- 与 [CONCH](31-conch.md) 对照：Hyperbolic/UNI 这类病理基础模型既是最强条件编码器，也是 MIL 特征基线；本篇的 Table 4 给出直接对照。
- 与 [CLAM](29-clam.md)、[DSMIL](03-dsmil.md) 相连：MIL 实验用 ABMIL 分类器、DSMIL 代码提 patch，说明生成模型的副产品特征可以回到主流弱监督链路。
- 与 [TopoCellGen](21-topocellgen.md) 对照：都是病理生成，一个控倍率与空间布局，一个控细胞拓扑。

## 原文摘要

> Diffusion models have revolutionized image generation, yet several challenges restrict their application to large-image domains, such as digital pathology and satellite imagery. Given that it is infeasible to directly train a model on 'whole' images from domains with potential gigapixel sizes, diffusion-based generative methods have focused on synthesizing small, fixed-size patches extracted from these images. However, generating small patches has limited applicability since patch-based models fail to capture the global structures and wider context of large images, which can be crucial for synthesizing (semantically) accurate samples. To overcome this limitation, we present ZoomLDM, a diffusion model tailored for generating images across multiple scales. Central to our approach is a novel magnification-aware conditioning mechanism that utilizes self-supervised learning (SSL) embeddings and allows the diffusion model to synthesize images at different 'zoom' levels, i.e., fixed-size patches extracted from large images at varying scales. ZoomLDM synthesizes coherent histopathology images that remain contextually accurate and detailed at different zoom levels, achieving state-of-the-art image generation quality across all scales and excelling in the data-scarce setting of generating thumbnails of entire large images. The multi-scale nature of ZoomLDM unlocks additional capabilities in large image generation, enabling computationally tractable and globally coherent image synthesis up to 4096×4096 pixels and 4× super-resolution. Additionally, multi-scale features extracted from ZoomLDM are highly effective in multiple instance learning experiments.

*来源：arXiv:2411.16969；逐字原文，未改写、未压缩。*

## 中文摘要

> 扩散模型已经革新了图像生成，但若干挑战限制了它们在数字病理与卫星影像等大图领域的应用。由于对可能达到千兆像素尺寸的领域而言，直接在整个大图上训练模型并不可行，基于扩散的生成方法一直聚焦于合成从这些图像中抽取的小型固定尺寸 patch。然而，生成小 patch 的适用范围有限，因为基于 patch 的模型无法捕捉大图的全局结构与更宽广的上下文，而这对于合成（语义上）准确的样本可能至关重要。为克服这一限制，我们提出 ZoomLDM，一个为跨多个尺度生成图像而设计的扩散模型。我们方法的核心是一个新颖的倍率感知条件机制，它利用自监督学习（SSL）嵌入，使扩散模型能够在不同的「缩放」层级（即从大图在不同尺度上抽取的固定尺寸 patch）上合成图像。ZoomLDM 合成的组织病理学图像在不同缩放层级上始终保持上下文准确与细节丰富，在所有尺度上都达到最先进的生成质量，并在生成整张大图缩略图这一数据稀缺场景中表现优异。ZoomLDM 的多尺度特性解锁了大图生成中的额外能力，使计算可行且全局一致的图像合成最高可达 4096×4096 像素，并支持 4× 超分辨率。此外，从 ZoomLDM 提取的多尺度特征在多种多示例学习实验中非常有效。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 7. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2411.16969)
- [arXiv HTML 正文](https://arxiv.org/html/2411.16969v2)
- [CVF Open Access 页面](https://openaccess.thecvf.com/content/CVPR2025/html/Yellapragada_ZoomLDM_Latent_Diffusion_Model_for_Multi-scale_Image_Generation_CVPR_2025_paper.html)
- [官方代码 ZoomLDM](https://github.com/cvlab-stonybrook/ZoomLDM)
- [项目主页（4k 样例）](https://histodiffusion.github.io/docs/projects/zoomldm)
