# 56｜LRDM：用自监督嵌入当条件，把扩散模型从 patch 推向大图

**论文**：Learned representation-guided diffusion models for large-image generation，CVPR 2024（arXiv:2312.07330v2，2024-03-28；Graikos, Yellapragada, Le, Kapse, Prasanna, Saltz, Samaras；Stony Brook University）  
**定位**：SSL 嵌入条件扩散、patch 组装成 1024×1024 大图、生成数据增广下游分类器  
**精读核验**：依据 arXiv v2 的摘要、方法、表格与补充材料整理（2026-10-15）；数值逐字摘自原文，尚未进行复现实验。

## 原文摘要

> To synthesize high-fidelity samples, diffusion models typically require auxiliary data to guide the generation process. However, it is impractical to procure the painstaking patch-level annotation effort required in specialized domains like histopathology and satellite imagery; it is often performed by domain experts and involves hundreds of millions of patches. Modern-day self-supervised learning (SSL) representations encode rich semantic and visual information. In this paper, we posit that such representations are expressive enough to act as proxies to fine-grained human labels. We introduce a novel approach that trains diffusion models conditioned on embeddings from SSL. Our diffusion models successfully project these features back to high-quality histopathology and remote sensing images. In addition, we construct larger images by assembling spatially consistent patches inferred from SSL embeddings, preserving long-range dependencies. Augmenting real data by generating variations of real images improves downstream classifier accuracy for patch-level and larger, image-scale classification tasks. Our models are effective even on datasets not encountered during training, demonstrating their robustness and generalizability. Generating images from learned embeddings is agnostic to the source of the embeddings. The SSL embeddings used to generate a large image can either be extracted from a reference image, or sampled from an auxiliary model conditioned on any related modality (e.g. class labels, text, genomic data). As proof of concept, we introduce the text-to-large image synthesis paradigm where we successfully synthesize large pathology and satellite images out of text descriptions.

*来源：arXiv:2312.07330；逐字原文，未改写、未压缩。*

## 中文摘要

> 为合成高保真样本，扩散模型通常需要辅助数据来引导生成过程。然而，在组织病理学与卫星影像这类专业领域中，获取所需的逐 patch 标注代价不切实际：这通常由领域专家完成，且涉及上亿张 patch。现代自监督学习（SSL）表征编码了丰富的语义与视觉信息。本文提出，这类表征的表达能力足以充当细粒度人工标注的代理。我们引入一种新方法，训练以 SSL 嵌入为条件的扩散模型。我们的扩散模型能够成功把这些特征投影回高质量的组织病理学与遥感图像。此外，我们通过组装由 SSL 嵌入推断出的、空间一致的 patch 来构造更大的图像，从而保留长程依赖。通过生成真实图像的变体来增广真实数据，可提升 patch 级与更大规模的图像级分类任务的下游分类器准确率。我们的模型即使在训练中未见过的数据集上同样有效，展现了其鲁棒性与泛化能力。由学习到的嵌入生成图像与嵌入的来源无关：用于生成大图的 SSL 嵌入既可以提取自参考图像，也可以从以任意相关模态（例如类别标签、文本、基因组数据）为条件的辅助模型中采样得到。作为概念验证，我们提出文本到大图合成这一范式，并成功从文本描述合成了大型病理与卫星图像。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

这篇是**病理大图生成支线的底座**，也是 ZoomLDM 与 RestorePath 都直接继承的那一层。核心命题只有一句：**SSL 嵌入够格替代逐 patch 人工标注**，因此可以训练「以嵌入为条件」的扩散模型，再反过来用嵌入网格指挥大图生成。

三个可复用的部件：

1. **条件 = SSL 嵌入向量**（HIPT patch ViT / iBOT / CTransPath，384 或 768 维 → L2 归一化 → 线性投影到 512 维），经 cross-attention 注入 LDM U-Net；classifier-free guidance 的空条件是全 0 向量。
2. **大图拼接 = MultiDiffusion**：把图看作 P×P 的 patch 网格，每个位置的条件由 **4 个最近邻嵌入做 slerp 插值**得到；每个扩散步对所有重叠 patch 的更新取平均，边缘用高斯核降权去拼缝；stride 16。
3. **生成当作增广**：合成数据加进训练集后，patch 级与切片级分类器都变好。

复现价值确实高：条件注入、拼接规则、超参、消融（条件来源 / stride / 增广倍数）在正文与补充材料里都给全了，代码公开（`cvlab-stonybrook/Large-Image-Diffusion`），训练配置具体到卡数与 batch size。

一个必须说清楚的位置问题：**LRDM 是生成论文，不是修复论文**。它对伪影修复支线的价值在于提供「SSL 条件 + 大图组装」这套骨架——ZoomLDM 把条件升级成倍率感知，RestorePath 把它换成 PFM 嵌入并加上 DWI/AGS，从而把生成改造成对齐原图的修复。

## 2. 问题及研究位置

- **痛点**：专业领域（病理、遥感）没有条件数据可用。给整份 TCGA-BRCA 加 caption 约需 **≈40,000 小时**病理学家时间；而扩散模型要在高保真下工作需要条件信号。
- **观察**：SSL 表征已编码丰富语义与视觉信息，可作为细粒度标注的代理。
- **做法**：不引入新数据模态，直接把 SSL 嵌入当条件训练 LDM；大图不靠训练一个大模型，而靠 patch 级模型 + 嵌入网格 + MultiDiffusion 组装。
- **与直训大图的成本对比**（Supp. Table 6）：patch 法（256×256）最大 batch 100、每 epoch 约 45 小时；直接训 1024×1024 LDM 最大 batch 4、每 epoch 约 300 小时。这是「拼大图」而非「训大图」的直接理由。

在支线里的位置：LRDM 定义「条件化 + 拼接」骨架 → ZoomLDM 解决多尺度与 4096×4096 → RestorePath 把生成改成掩码对齐的修复。

## 3. 核心方法和数据流

```text
训练（256×256 patch）
真实 patch
    → SSL 编码器提嵌入 y：
        TCGA-BRCA / TCGA-CRC(20×)：HIPT patch-level ViT、iBOT（均在 PanCancer TCGA 预训练）
        TCGA-BRCA 5×：CTransPath
        NAIP：作者自训 ViT-B/16 + DINO
    → y（384/768 维）→ L2 归一化 → 线性层 → 512 维条件向量
    → LDM U-Net 以 cross-attention 注入条件
        基座：ImageNet 预训练 U-Net + 4× 下采样 VQ-VAE（沿用 PathLDM 配置）
        CFG 空条件 = 全 0 向量
    → DDPM 训练（lr 1e-4，warmup 10,000 步，6×RTX 8000，每卡 batch 100）

大图生成（1024×1024，MultiDiffusion 组装）
目标大图 = P×P 个 256×256 patch 的网格
    → 条件网格 z：每个位置 (i,j) 的 λ_{i,j} = 4 个最近邻嵌入的 slerp 插值
    → 每个扩散步：对所有重叠 patch 的去噪更新取平均（Eq. 6 闭式解）
        边缘像素乘高斯核降权 → 无拼缝
    → patch stride 16；解码 latents 同样 stride 16 + 高斯加权
    → 采样：DDIM 50 步，guidance 1.75（大图用 3.0）

条件来源可替换（论文卖点）
参考图 → SSL 嵌入 | 类别标签 / 文本 / 基因组 → 辅助模型 → 嵌入
    → 文本到大图（VLM 生成嵌入网格）→ 大图
```

**空间一致性是前提而非推论**：作者要求插值出的 λ_{i,j} 仍是有效条件向量（"which we validate experimentally"），并强调改变嵌入网格的空间排布就等于编辑大图的全局语义布局；单条全局文本提示这类粗条件会在均匀纹理区域失效。

## 4. 论文证据与实验范围

**数据与设置**：TCGA-BRCA、TCGA-CRC（COAD+READ，20×）、BRCA 5×、NAIP/Chesapeake Land Cover（256×256 非重叠切片，共 667,000 patches）。生成规模：10,000 个 256×256 patch 与 3,000 张 1024×1024 大图。

**生成质量（Table 1，逐字）**：

| 数据集 | 训练图数 | Vanilla FID ↓ | Crop FID ↓ | CLIP FID ↓ | Emb. Sim ↑ |
|---|---|---|---|---|---|
| BRCA 20× | 15M | 6.98 | 15.51 | 7.43 | 0.924 |
| CRC 20× | 8M | 6.78 | 8.8 | 7.34 | 0.938 |
| NAIP | 667k | 11.5 | 43.76 | 6.86 | — |
| BRCA 5× | 976k | 9.74 | — | 6.64 | — |

指标口径：FID（Clean-FID 实现）、Vanilla/Crop FID（沿用 MultiDiffusion 评估）、CLIP FID、Embedding Similarity（CTransPath 特征余弦相似度）。patch 质量对比基线为 PathLDM（10× 上 7.64）。

**条件来源消融（Supp. Table 7，patch FID）**：无条件 **25.62**；ImageNet ViT-B/16 **13.29**；CLIP **16.07**；HIPT **6.98**。→ 领域内 SSL（HIPT）显著优于通用表征，这是「SSL 嵌入可替代标注」这一命题的直接证据。

**大图 stride 消融（Supp. Table 8）**：stride 4 → 15m / 12.66 / 7.31；stride 8 → 4m / 14.69 / 7.37；stride 16（正文所用）→ 1m / 15.51 / 7.43；stride 32 → 20s / 15.60 / 8.09（时间/质量权衡取 16）。

**下游增广（逐字关键数值）**：
- 切片级 MIL（CTransPath 特征）：TCGA-BRCA Subtyping AUC，CLAM-SB 用 1% 真实数据 **0.725** → 加合成 **0.812**；10% **0.886** → **0.898**；20% 真实 **0.91**。DSMIL 1% **0.609** → **0.659**；10% **0.838** → **0.856**；20% **0.905**。TCGA-BRCA HRD 上 CLAM-SB 10% **0.649** → **0.765**，DSMIL 10% **0.563** → **0.639**。
- BACH 大图级（ConvNeXt V2_huge + 2 层 MLP）：Real **78%**、Synthetic **70%**、Real+synthetic **83%**、SoTA [7] **87%**。
- NCT-CRC patch 级（ResNet-50）：Real **93.8%**、Synthetic **90.19%**、Real+synthetic **96.27%**、SoTA [20] **96.26%**。
- 增广倍数消融：Real **93.8%**；+1× 合成 **96.27%**；+2× **96.55%**；+3× **95.52%**；+5× **95.59%**（超过 2× 后回落，作者归因于真实数据被稀释）。
- 生成特征当表征（Table 4，BRCA 亚型 10 折 CV AUC）：HIPT 25% 数据 CLAM-SB **0.788** → LDM_HIPT **0.842**；CTransPath 25% **0.900** → LDM_CTransPath **0.913**；DSMIL 上 CTransPath 100% **0.910** → LDM_CTransPath **0.936**。

**文本到大图（概念验证）**：NAIP 上 CLIP similarity **0.22**（对比 text-to-image Stable Diffusion 报告的 >0.24）；病理侧由专家标注 100 张 CRC 合成图，与生成所用标签一致率 **89.9%**（其中 61% 被标为 realistic）。

**作者自陈局限**（无独立 Limitations 章节）：增广是「全图 naive 增强」，自适应选择增广区域留作未来工作；大图空间对齐可探索拓扑约束或引入低分辨率信息；NAIP 因样本少、高频细节弱而 Crop FID 较差；文本到大图能力受所用作 VLM 限制（乳腺癌上 Quilt 的 zero-shot 准确率约 40%）；合成数据过多会稀释真实数据；BACH 上未达 SoTA 87%。

## 5. 复现与审计重点

- **条件配对的正确性是全部结论的前提**：训练时 y 必须来自同一张 patch 的 SSL 编码。若用错配对（例如同一 WSI 的邻域嵌入），模型仍能训出好看的图，但下游增广结论会失真。建议先做「同嵌入 → 同形态」的最近邻检索检查。
- **Crop FID 与 Vanilla FID 差异很大**（BRCA 20×：6.98 vs 15.51）：后者才是大图拼接的质量口径。只报 Vanilla FID 会高估拼接效果，跨论文比较时要看用哪一列。
- **拼接参数是被调出来的**：stride 16 是最优点，与 4 相比质量仅差 0.33 FID 但快 15 倍。复现时若 stride 不同，生成质量差异应归因于该旋钮而非模型。
- **两份度量同源风险**：Embedding Similarity 用 CTransPath，而 BRCA 5× 的条件也用 CTransPath，衡量指标与生成条件的编码器同族；报告时应明确这一点。
- **增广收益有上限**：+2× 之后回落。若目标是复现「增广提升下游」，必须同时报告 3×/5× 的回落，否则结论不完整。
- **可验证的改进切口**（待验证假设）：把倍率也做成条件（这正是 ZoomLDM 的路线）；用领域更强的病理基础模型替换 HIPT 作条件（RestorePath 用 UNI 走的就是这条）；把 naive 全图增广改成按伪影/难例区域定向增广。
- **训练资源**：6×RTX 8000、每卡 batch 100、256×256 patch、lr 1e-4、warmup 10k 步；大图生成的显存与耗时（RTX 6000 上 stride 16 约 1 分钟/图）应自行实测。

## 6. 建议阅读顺序

`Abstract` → `1. Introduction`（≈40,000 小时标注成本这个动机数字）→ `3.1` 条件扩散公式 → `3.2` 大图组装（Eq. 3 与 Eq. 6、空间一致性讨论）→ `4.2` 实现细节（参数逐条）→ `Table 1` → Supp. `Table 6`（直训大图 vs 拼大图成本）与 `Table 7`（条件来源消融）→ `5.` 下游增广（Table 2 与 Table 3）→ `6.` 文本到大图 → Supp. `Table 8`（stride 消融）。

## 7. 前后关联

- 与 [ZoomLDM](58-zoomldm.md) 直接相连：ZoomLDM 把这里的「单一 SSL 嵌入条件」升级为「倍率感知条件」，并解决跨尺度一致性。
- 与 [RestorePath](49-restorepath.md) 相连：RestorePath 的 LDM + PFM 条件 + 大图 patch 扩散，正是这套骨架在修复任务上的改造（条件换成 UNI 嵌入，加入 DWI/AGS）。
- 与 [ArtiFusion](55-artifusion.md)、[ArtiDiffuser](57-artidiffuser.md) 对照：那两篇是修复（对齐给定输入），LRDM 是生成（从嵌入造图）；两者的评价口径与数据要求完全不同。
- 与 [CLAM](29-clam.md)、[DSMIL](03-dsmil.md) 相连：下游增广实验直接在 CLAM-SB 与 DSMIL 上做，是「生成是否有用」的判据。
- 与 [HIPT](04-hipt.md) 相连：HIPT 既是条件编码器（Table 7 中最优）也是对照表征（Table 4 中的基线），可从这篇看到 SSL 表征的下游两种用法。
- 与 [CTransPath](07-ctranspath.md) 相连：5× 模型的条件编码器与 Embedding Similarity 的度量都用它。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2312.07330)
- [arXiv HTML 正文](https://arxiv.org/html/2312.07330v2)
- [CVF Open Access 页面](https://openaccess.thecvf.com/content/CVPR2024/html/Graikos_Learned_Representation-Guided_Diffusion_Models_for_Large-Image_Generation_CVPR_2024_paper.html)
- [官方代码 Large-Image-Diffusion](https://github.com/cvlab-stonybrook/Large-Image-Diffusion)
