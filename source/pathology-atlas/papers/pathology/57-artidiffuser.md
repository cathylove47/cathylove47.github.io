# 57｜ArtiDiffuser：用一个反事实扩散模型同时做伪影修复与伪影合成

**论文**：ArtiDiffuser: A unified framework for artifact restoration and synthesis for histology images via counterfactual diffusion model，Medical Image Analysis 2025（DOI:10.1016/j.media.2025.103567；PubMed 40188685）  
**定位**：反事实扩散修复、伪影合成作为增广、Swin 去噪骨干 + 类别引导 MoE、723 patch 伪影标注数据集  
**精读核验**：依据期刊摘要（Semantic Scholar / PubMed 记录）与作者代码仓库 README 整理（2026-10-15）；Elsevier 正文在付费墙后，本笔记未逐页核对方法与表格数值，尚未复现。

## 30 秒看懂

**一句话**：ArtiDiffuser 用同一个扩散模型回答两个方向的问题——"这块伪影不存在会怎样"（修复）和"这块组织长出伪影会怎样"（增广）。

**问题**：GAN 修复会误改形态与染色；而且修好图像并不等于下游分类器对伪影变得不敏感。

**瓶颈**：两个目标要两种数据——修复要有伪影/无伪影配对，增广要有类别可控的伪影来源；GAN 一类方法在这两件事上都只能做到一半。

**insight**：把修复当反事实生成（只动伪影区），把合成当反向条件（只注入指定类别伪影），再用一致性正则约束下游模型在原图与增广图上给出相同预测——生成器与服务对象被一起纳入目标。

## 3 分钟讲清

**方法（按顺序）**：
1. 用反事实配对（同一组织的有伪影 / 无伪影版本）与伪影类别标签 $c$ 训练。
2. 掩码 $m$ 标出伪影区，去噪骨干用 Swin-Transformer，窗口注意力取局部、移动窗口取全局。
3. 条件侧加类别特定 token，并用类别引导的专家混合（MoE）按 $c$ 路由不同专家。
4. 损失用掩码加权重建，把梯度压到伪影像素上，对抗"伪影区远小于正常区"的不平衡。
5. 同一模型的反方向注入伪影做增广，下游分类器上加一致性正则。
6. 另发布一个 723 张、跨伪影类别的标注 patch 数据集。

**作者证据在哪**：只能定位到摘要口径——四个数据集、修复与合成两类任务均优于 GAN 类预处理/增广方法，"两者协同超过分别处理"。具体表格数值（FID / LPIPS / SSIM、下游准确率、采样成本）都在 Elsevier 正文里，本笔记没核对，引用前必须回原文。摘要与仓库 README 里都没有"渐进式蒸馏加速"，那条旧备注未核验。

**和上一代的区别**：与 ArtiFusion 同一批作者，从"首个 DDPM 修复"扩到"修复 + 合成统一 + 下游鲁棒"；RestorePath 解决跨 patch 一致，它解决"不该改的地方不许改"；CPathOGen 同样是反事实，但目标是审计模型而不是修图。

**讲 PPT 用这张**：修复/合成双向的条件示意图 + 掩码加权损失；不要贴具体数字——本文没有可核验的表格值。

## 1. 问题及研究位置

历史脉络很清晰：早期修复走 GAN 的 image-to-image 路线（含本仓库的外围工作），问题是模式坍塌与**染色风格误迁移**——把伪影区旁边的颜色/形态顺手「修」坏。ArtiFusion 用 DDPM 把修复变成逐步去噪，解决的是生成质量；ArtiDiffuser 要解决的是两件 GAN 路线解决不好的事：

1. **不该改的地方不许改**：反事实建模 + 掩码加权损失，把改动范围限制在伪影区。
2. **修复之外还要让下游模型不再怕伪影**：合成伪影做增广，并用一致性正则化保证增广前后预测一致。

它和修复支线的分工是：ArtiFusion/LatentArtiFusion 解决「怎么修」，RestorePath 解决「在百万像素尺度上跨 patch 一致地修」，ArtiDiffuser 解决「修与造的统一 + 下游鲁棒性」。

## 2. 核心方法和数据流

```text
训练（反事实对：同一组织，有伪影 / 无伪影）
无伪影 patch + 伪影类别标签 c（气泡 / 折叠 / 墨迹 / 笔迹 / 失焦 …）
    → 掩码 m：伪影区为 1，正常组织为 0
    → 扩散加噪 → 隐/像素空间去噪
       去噪骨干：Swin-Transformer（窗口注意力取局部，移动窗口取全局）
       条件：类别特定 token + 类引导 MoE（按 c 选专家 / 路由）
    → 损失：掩码加权重建损失（伪影区权重高）+ 类别监督
    → 输出「反事实修复图」，非伪影区与原图保持一致

同一模型的合成方向（训练增广）
无伪影 patch + 目标伪影类别 c → 注入该类别伪影 → 伪影增广样本
    → 下游分类器在 (原图, 增广图) 上做一致性正则
    → 下游对伪影不敏感

评估
修复：4 个数据集上对比 GAN 类预处理方法
合成：作为增广与 GAN 类增广方法比较
```

方法要点：**掩码加权损失**把优化重心压到伪影像素上，直接对抗「伪影区面积远小于正常区」的不平衡；**类别引导 MoE** 让不同伪影类型（气泡的透光、墨迹的不透明、折叠的阴影）走不同专家；**一致性正则**是唯一直接面向下游指标的部件——它约束的是分类器，而不是生成器。

## 3. 论文证据与实验范围

- **摘要可核验的结论**：作者称在**四个不同数据集**上、针对**修复与合成**两类任务，ArtiDiffuser 均优于用于预处理或增广的 GAN 类方法；并称「合成 + 修复的协同显著超越分别处理两者的传统做法」。
- **数据贡献**：作者称贡献首个跨多种伪影类别的组织学标注数据集，**723 张标注 patch**。
- **未从摘要核验**：具体指标数值（FID/LPIPS/SSIM）、四个数据集的名称与划分、每个伪影类别的样本数、下游分类器与准确率、采样步数与推理成本。以上均需在 Elsevier 正文中核对，本笔记不做推测。
- **关于「已用渐进式蒸馏加速」**：这一说法来自站内收录时的备注，**在本篇摘要与作者代码仓库 README 中均未出现**，暂标为未核验；需要时应在正文的采样/效率小节确认后再引用。

## 4. 复现与审计重点

- **先拿数据集再谈复现**：723 张 patch 的标注数据集是核心资产，先确认它是否随代码公开、类别是否平衡；用自建掩码替代会直接改变输入分布。
- **反事实性要单独验证**：修复后量化「非伪影区的像素改动幅度」，这是它与普通 inpainting 的判别性检查；只报整体 FID 会把「整图重画」也算成成功。
- **MoE 的收益需要消融对照**：把类别引导 MoE 换成单一骨干、把掩码加权换成普通损失，分别看修复质量与下游准确率的变化；否则无法判断复杂结构是否必要。
- **一致性正则的证伪方式**：在下游分类器上比较「原图 / 增广图」预测差异，而不是只看最终准确率——一致性是它的设计目标。
- **合成伪影的分布偏移**：用模型造出的伪影做增广，等于把下游模型暴露在生成分布里；需检查增广样本是否落在真实伪影流形内（可让病理医生或伪影检测器判真假）。
- **无公开数值已核验**：本笔记未核对任何表格数字，引用具体指标前必须回到正文。

## 5. 建议阅读顺序

`Abstract` → `Introduction`（GAN 修复的两个失效模式）→ `Method` 中的 counterfactual formulation → Swin 骨干 + 类别引导 MoE → 掩码加权损失 → 合成与一致性正则 → 4 个数据集的实验表 → 723 patch 数据集说明。

## 6. 前后关联

- 与 [ArtiFusion](55-artifusion.md) 同源：同一批作者（Yiqing Shen、Junjun He），把「首个 DDPM 病理修复」扩展为「修复 + 合成统一」。
- 与 [RestorePath](49-restorepath.md) 对照：一个在 patch 尺度追求「只动伪影区」，一个在百万像素尺度追求「跨 patch 全局一致」；RestorePath 的条件来自病理基础模型嵌入，ArtiDiffuser 的条件来自伪影类别。
- 与 [CPathOGen](52-cpathogen.md) 对照：都是「反事实生成」思路用在病理上——一个造受控的形态/空间反事实来审计模型，一个造受控伪影来增广与修复。
- 与 [TopoCellGen](21-topocellgen.md) 对照：同属病理扩散生成，但目标分别是造新细胞拓扑、修掉伪影。
- 与 [CLAM](29-clam.md) / [TransMIL](30-transmil.md) 相连：一致性正则最终作用在这类 MIL 下游模型上，修复是否有效应以它们的预测稳定性衡量。

## 原文摘要

> Artifacts in histology images pose challenges for accurate diagnosis with deep learning models, often leading to misinterpretations. Existing artifact restoration methods primarily rely on Generative Adversarial Networks (GANs), which approach the problem as image-to-image translation. However, those approaches are prone to mode collapse and can unexpectedly alter morphological features or staining styles. To address the issue, we propose ArtiDiffuser, a counterfactual diffusion model tailored to restore only artifact-distorted regions while preserving the integrity of the rest of the image. Additionally, we show an innovative perspective by addressing the misdiagnosis stemming from artifacts via artifact synthesis as data augmentation, and thereby leverage ArtiDiffuser to unify the artifact synthesis and the restoration capabilities. This synergy significantly surpasses the performance of conventional methods which separately handle artifact restoration or synthesis. We propose a Swin-Transformer denoising network backbone to capture both local and global attention, further enhanced with a class-guided Mixture of Experts (MoE) to process features related to specific artifact categories. Moreover, it utilizes adaptable class-specific tokens for enhanced feature discrimination and a mask-weighted loss function to specifically target and correct artifact-affected regions, thus addressing issues of data imbalance. In downstream applications, ArtiDiffuser employs a consistency regularization strategy that assures the model's predictive accuracy is maintained across original and artifact-augmented images. We also contribute the first comprehensive histology dataset, comprising 723 annotated patches across various artifact categories, to facilitate further research. Evaluations on four distinct datasets for both restoration and synthesis demonstrate ArtiDiffuser's effectiveness compared to GAN-based approaches, used for either pre-processing or augmentation. The code is available at https://github.com/wagnchogn/ArtiDiffuser.

*来源：Medical Image Analysis 2025 期刊摘要（DOI:10.1016/j.media.2025.103567）；逐字原文，未改写、未压缩。*

## 中文摘要

> 组织学图像中的伪影会给深度学习模型的准确诊断带来挑战，常常导致误判。现有的伪影修复方法主要依赖生成对抗网络（GAN），并将该问题视为图像到图像的转换。然而，这类方法容易出现模式坍塌，并可能意外改变形态特征或染色风格。为解决该问题，我们提出 ArtiDiffuser，一个反事实扩散模型，专门只修复被伪影扭曲的区域，同时保持图像其余部分的完整性。此外，我们提出一个新颖视角：通过把伪影合成当作数据增广来处理由伪影导致的误诊，从而利用 ArtiDiffuser 把伪影合成与修复能力统一起来。这种协同显著超越了分别处理伪影修复或伪影合成的传统方法。我们提出 Swin-Transformer 去噪网络骨干以同时捕捉局部与全局注意力，并进一步用类别引导的专家混合（MoE）来处理与特定伪影类别相关的特征。此外，它使用可适应的类别特定 token 来增强特征判别力，并使用掩码加权损失函数专门针对与修正受伪影影响的区域，从而应对数据不平衡问题。在下游应用中，ArtiDiffuser 采用一致性正则化策略，确保模型在原始图像与伪影增广图像上的预测准确率得以保持。我们还贡献了首个全面的组织学数据集，包含跨多种伪影类别的 723 张标注 patch，以促进后续研究。在四个不同数据集上针对修复与合成两项任务的评估表明，ArtiDiffuser 相较用于预处理或增广的 GAN 类方法更为有效。代码见 https://github.com/wagnchogn/ArtiDiffuser。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 7. 链接

- [期刊页面（DOI）](https://doi.org/10.1016/j.media.2025.103567)
- [PubMed 记录 40188685](https://pubmed.ncbi.nlm.nih.gov/40188685/)
- [官方代码 ArtiDiffuser](https://github.com/wagnchogn/ArtiDiffuser)
