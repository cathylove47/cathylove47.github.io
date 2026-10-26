# 78｜SuperDiff（原 Histo-Diffusion）：两阶段扩散超分，把“病理专属评价”当成方法的一半

**论文**：SuperDiff: A diffusion super-resolution method for digital pathology with comprehensive quality assessment。Medical Image Analysis，2026，107(Pt A): 103808；DOI [10.1016/j.media.2025.103808](https://doi.org/10.1016/j.media.2025.103808)；PMID 41027251；Epub 2025-09-20。预印本 arXiv:2408.15218 v1（2024-08-27）仍题为 *Histo-Diffusion: A Diffusion Super-Resolution Method for Digital Pathology with Comprehensive Quality Assessment*，期刊版改名为 SuperDiff。  
**定位**：低倍→高倍的**超分辨率/分辨率恢复**，不是伪影修复；输出是“更清晰的高倍图”，不是找回被遮挡的真实组织。  
**精读核验**：2026-10-22 核对 arXiv v1 全文（§1–5、Table 1–5、Fig. 1–12）；2026-10-26 取得期刊正式版 PDF（本地 `~/code/papers/MedIA-2026-103808-Xu-SuperDiff-super-resolution.pdf`）并核对 Table 1–19、Fig. 1–19。**正式版比 v1 明显扩写**：新增 CAMELYON17 真实倍率数据、OCELOT/BRACS 泛化测试、UNI 嵌入下游分类与病理医生读者研究；本文表号一律以正式版为准。未运行模型，未找到官方代码。

## 原文摘要

> Digital pathology has advanced significantly over the last decade, with Whole Slide Images (WSIs) encompassing vast amounts of data essential for accurate disease diagnosis. High-resolution WSIs are essential for precise diagnosis but technical limitations in scanning equipment and variability in slide preparation can hinder obtaining these images. Super-resolution techniques can enhance low-resolution images; while Generative Adversarial Networks (GANs) have been effective in natural image super-resolution tasks, they often struggle with histopathology due to overfitting and mode collapse. Traditional evaluation metrics fall short in assessing the complex characteristics of histopathology images, necessitating robust histology-specific evaluation methods. We introduce SuperDiff, a novel diffusion-based method specially designed for generating and evaluating super-resolution images in digital pathology. It includes a restoration module for histopathology prior and a controllable diffusion module for generating high-quality images. We have curated two histopathology datasets and proposed a comprehensive evaluation strategy which incorporates both full-reference and no-reference metrics to thoroughly assess the quality of digital pathology images. Comparative analyses on multiple datasets with state-of-the-art methods reveal that SuperDiff outperforms GANs. Our method offers a versatile solution for histopathology image super-resolution, capable of handling multi-resolution generation from varied input sizes, providing valuable support in diagnostic processes.

*来源：[PubMed 41027251](https://pubmed.ncbi.nlm.nih.gov/41027251/)（期刊版完整摘要）；[arXiv v1 摘要](https://arxiv.org/abs/2408.15218) 内容基本一致，但方法名写作 Histo-Diffusion。*

摘要的中文要点：高倍 WSI 对诊断重要，但扫描设备与制片差异使低倍图常见；GAN 超分在病理上容易过拟合与模式崩溃，传统指标又测不出病理图像的关键结构；作者提出 SuperDiff，由“病理先验恢复模块 + 可控扩散生成模块”组成，并配套一套同时包含全参考与无参考指标的评价方案；在多个数据集上优于 GAN 类方法，且支持不同输入尺寸与多倍率生成。

## 1. 三分钟摘要与推荐理由

一张 10× 的 H&E 图块只有 128×128 像素，放大到 40× 的 512×512 后，细胞核边缘、染色质纹理和间质细节都缺失。GAN 超分能把边缘“画锐”，但常把染色风格画偏，或者把不存在的腺体结构补出来。SuperDiff 的思路是两步：

1. **先恢复，再生成**：用 SwinIR 把低倍图恢复到目标尺寸，得到一个“病理先验”图，减少模糊和压缩噪声。
2. **用扩散模型生成细节**：把恢复图编码进 Stable Diffusion 的潜空间，作为 ControlNet 的条件，冻结原 UNet，只训练控制分支，让模型在保留组织结构的前提下补细节。

它最值得学的不是“又一个扩散超分”，而是**把评价方法当成贡献的一部分**：作者指出 PSNR/SSIM 会被 bicubic 的模糊图“骗高”，于是补了基于细胞核的纹理/强度 L1 指标，以及用病理图像微调过的 CLIP-IQA。这个“指标也会选错模型”的教训，对做修复和生成的读者都直接有用。

边界要清楚：它做的是分辨率提升，不判断伪影，也不修复折叠/气泡；如果输入本身有伪影，超分可能把伪影也放大。

## 2. 问题及研究位置

- **任务**：给定低分辨率（LR）病理图，生成 4× 高分辨率（HR）图；训练时用 HR 下采样构造 LR，属于成对超分设定。
- **与伪影修复的区别**：修复的目标是“把坏区域恢复成可信组织”，评价依赖伪影掩码和未受损参考；超分的目标是“同一组织在更高分辨率下的样子”，评价依赖 HR 真值。两者都可能用扩散先验，但失败模式不同：修复怕“编造不存在的组织”，超分怕“过度锐化/风格漂移”。
- **与 GAN 超分的区别**：GAN 一次前向、快，但模式崩溃和染色偏差明显；扩散多步采样、慢，但作者主张感知指标和无参考指标更好。
- **与同期扩散超分的关系**：方法骨架借自 DiffBIR（恢复模块 + ControlNet），论文的增量主要在病理数据、病理专属指标与多倍率适配，而不是全新的扩散架构。这一点对判断创新性很重要。

## 3. 核心方法和数据流

先解释两个术语。**ControlNet** 是给一个冻结的扩散模型加“空间条件”的旁路：复制原 UNet 的编码器，单独接收条件图，再通过零初始化卷积把特征加回原模型；这样原模型不用重训，也能被条件图控制。**spaced DDPM** 指从训练时的总步数中均匀取 50 个时间步做采样，而不是每步都走。

```text
训练阶段 1（恢复模块）:
HR 图 → 模拟退化（模糊、缩放、噪声）→ LR
LR → 双三次插值到 4× 目标尺寸 → SwinIR（pixel unshuffle ×8 + RSTB + 最近邻上采样）
   → 恢复图 I_RM
损失：||I_RM − I_HR||²

训练阶段 2（可控扩散）:
I_RM → 冻结 SD 2.1 VAE 编码 → 条件潜变量 c_RM
HR → 同一 VAE 编码 → z0 → 加噪 z_t
z_t 与 c_RM 拼接 → ControlNet（UNet encoder + middle 的可训练副本）
   → 冻结 UNet 去噪 → 预测噪声
损失：||ε − εθ(z_t, c, t, c_RM)||²，文本条件 c 为空串
只训练 ControlNet 与特征调制层

推理:
LR 128×128 → 插值到 512×512 → SwinIR 恢复 → VAE 编码 c_RM
随机噪声潜变量 + c_RM → 50 步 spaced DDPM → VAE 解码 → 颜色修正 → 4× 输出
```

**两个模块分别解决什么**：

- **恢复模块**：扩散模型本身不做像素级对齐，ControlNet 只给结构提示；先把 LR 恢复到目标尺寸，能让条件图与目标图空间对齐，减少扩散模型“自由发挥”的空间。SwinIR 的 pixel unshuffle 把空间分辨率降 8 倍、通道数升 64 倍，再经 RSTB 提特征，最后三次最近邻上采样回到原尺寸。
- **可控扩散模块**：冻结 SD 2.1 的 UNet，复制其 encoder 和 middle block 作为 ControlNet；条件潜变量与噪声潜变量**通道拼接**后输入控制分支，通过 zero convolution 接回冻结 UNet 的 middle block 和 skip connections。文本提示设为空串，避免语言条件干扰。
- **为什么用 SD 2.1 而不是从零训练**：借用自然图像预训练的生成先验，降低病理数据量需求；代价是可能带入自然图像的纹理偏好，论文用颜色修正和病理指标来约束。

**推理细节**：论文明确说 UNet 能处理 8 的倍数尺寸，因此支持任意尺寸和多倍率；条件图尺寸必须是 64 的倍数，不满足时 padding。采样用 50 步 spaced DDPM。颜色修正的具体算法论文没有展开，这是复现时的一个不确定点。

## 4. 论文证据与实验范围

**数据（Table 1）**：训练集 TCGA-PRAD 200 张 WSI、200,000 patch；验证 100 patch（36 张 WSI）；测试 70 张 WSI，含 PRAD-2000（2,000 patch）与 PRAD-100；跨癌种测试 LUAD-100（6 张 WSI，40× HR 512² / 10× LR 128²）与 GBM-100（17 张 WSI，20× HR 512² / 5× LR 128²）。训练与测试 WSI 不重叠。所有实验为 4× 放大。

**实现（作者配置）**：Quadro RTX 8000；恢复模块 150k iterations、batch 16；扩散模块基于 Stable Diffusion 2.1-base，205k iterations；AdamW，lr 1e-4；推理 50 步。作者没有报告显存占用，不能据此写“最低 48GB”或任何显存下限。

**Table 2（PRAD-100，作者报告，未复算）**：

| 方法 | PSNR↑ | SSIM↑ | LPIPS↓ | ST-LPIPS↓ | MUSIQ↑ | NIQE↓ |
|---|---:|---:|---:|---:|---:|---:|
| Bicubic | 26.48 | 0.6656 | 0.4534 | 0.4702 | 25.96 | 8.64 |
| BSRGAN | 25.78 | 0.6335 | 0.2612 | 0.3462 | 35.93 | 8.57 |
| Real-ESRGAN | 25.49 | 0.6639 | 0.2277 | 0.2598 | 39.73 | 8.82 |
| SwinIR-GAN | 25.52 | 0.6605 | 0.2229 | 0.2388 | 38.87 | 8.56 |
| SuperDiff | 24.86 | 0.5947 | 0.2279 | **0.2079** | **45.00** | **4.95** |

**这张表最重要的读法**：SuperDiff 的 PSNR 和 SSIM 是五种方法里最低的，低于 bicubic。作者没有回避，而是用 Fig. 2 解释：bicubic 图更模糊，像素值反而更接近 HR，所以 PSNR/SSIM 更高；生成模型把边缘画锐，像素偏移增大，但人眼和感知指标更好。这个“指标悖论”是全文的立论基础，也是读其他超分论文时应该先问的问题：**你优化的指标和临床想看的细节是不是一回事？**

**跨数据集的关键数字**：

- LUAD-100：ST-LPIPS 0.2250（SwinIR-GAN 0.2842），PSNR 25.92（bicubic 28.27）。
- GBM-100：ST-LPIPS 0.3663（SwinIR-GAN 0.4205），MUSIQ 49.13（SwinIR-GAN 47.25），但 SSIM 0.4950 明显低于 SwinIR-GAN 的 0.6102。
- PRAD-2000：ST-LPIPS 0.2006，MUSIQ 44.44，NIQE 4.99。

**Table 3 的病理专属指标**（L1 越低越好）：

| 数据集 | 方法 | L1_texture↓ | L1_intensity↓ |
|---|---|---:|---:|
| PRAD-100 | SwinIR-GAN | 321.94 | 15.14 |
| PRAD-100 | SuperDiff | **224.95** | **11.83** |
| LUAD-100 | SwinIR-GAN | 253.44 | 16.01 |
| LUAD-100 | SuperDiff | **190.49** | **13.14** |
| GBM-100 | SwinIR-GAN | 397.22 | 19.38 |
| GBM-100 | SuperDiff | **321.75** | **16.24** |

这些指标的计算方式是：用 HoVer-Net 在 HR 真值上分割细胞核，取每个核的灰度均值、标准差、偏度、峰度作为强度特征，取对比度、差异性、同质性、能量作为纹理特征，再与生成图对应核区域做 L1。换句话说，它测的是“核内的统计外观像不像”，不是“核的边界分割得准不准”。

**消融（正式版 Table 4 用通用指标、Table 5 用病理专属指标，PRAD-100）**：去掉恢复模块后 PSNR 25.15，加上后 25.03；L1_texture 从 241.85 降到 213.36，L1_intensity 从 12.47 降到 11.34。GBM-100 的纹理从 319.73 降到 272.71，但 LUAD-100 的强度从 12.46 升到 12.64，CLIP-IQA(Gaussian) 在 GBM 上从 0.9423 降到 0.9361。**恢复模块不是全面增益**，作者的解释是它主要改善纹理与感知质量，像素指标可能略降。

**Stage-1 单独用 vs 两阶段（正式版 Table 6 / Table 7）**：只跑 SwinIR 恢复的阶段 1 在 PSNR/SSIM 上更高（PRAD-100：26.11 / 0.6926 vs 24.86 / 0.5947），两阶段在 LPIPS/ST-LPIPS 上反超（0.2279 / 0.2079 vs 0.3222 / 0.3546）。这是全文"像素保真 vs 感知质量"权衡最干净的一处证据：**加扩散不是为了更准，是为了更像。**

**嵌入相似度（正式版 Table 10，PRAD-100）**：生成图与 HR 图的 UNI 余弦相似度 0.8348（SwinIR-GAN 0.7818），PLIP 0.9662（SwinIR-GAN 0.9457）。

**无参考指标的构造与局限**：作者从 TCGA-PRAD 取 5,000 张 40× patch 作为满分 10.0，分别加 box blur 和高斯模糊，按模糊半径/标准差递减打分，训练 CLIP-IQA。因此这两个分数本质上测的是“模糊/过度平滑程度”，不是诊断正确性。它能把 bicubic 的低分纠正过来，但不能证明生成的组织学结构真实。

### 4.5 正式版新增：真实倍率、跨器官泛化与下游分类

这部分 arXiv v1 完全没有，是期刊版最有价值的地方——**终于不只在下采样构造的 LR 上评测**。

| 数据集 | 构造方式 | 规模 |
|---|---|---|
| CAMELYON17 | **真实倍率**：level 0（40×，512²）配 level 2（10×，128²），来自 5 家荷兰医学中心 | 100 对，30 位患者 |
| OCELOT | 跨 6 个器官（肾/膀胱/内膜/前列腺/胃/头颈），1024² HR 配 256² LR | 126 对 |
| BRACS | 40× ROI 切 512² 再降采样到 128² | 997 对 |

**主对比（正式版 Table 13，×4）**：

| 数据集 | 方法 | PSNR↑ | SSIM↑ | ST-LPIPS↓ | MUSIQ↑ | NIQE↓ |
|---|---|---|---|---|---|---|
| CAMELYON17 | SwinIR-GAN | 23.02 | 0.6202 | 0.2040 | 37.58 | 8.14 |
| CAMELYON17 | **Ours** | 22.68 | 0.5859 | **0.1710** | **41.66** | **5.17** |
| OCELOT | SwinIR-GAN | 28.17 | 0.7744 | 0.1346 | 38.94 | 7.67 |
| OCELOT | **Ours** | 27.10 | 0.6820 | 0.2188 | **42.65** | **4.91** |

**OCELOT 上 ST-LPIPS 反而输给 SwinIR-GAN（0.2188 vs 0.1346）**，这是正式版里唯一一处明确的感知指标落后，作者没有单独讨论。跨器官这类结构差异大的数据，可能是扩散先验带偏的地方。

**下游分类（linear probe on UNI 特征）**——这是全文最硬的下游证据：

| 数据集 | 任务 | 输入 | Accuracy |
|---|---|---|---|
| BRACS（正式版 Table 19） | 三分类（非癌/癌前/癌） | HR 图 | 0.6310 |
| BRACS | 同上 | **本文生成的 SR 图** | **0.6250** |

差 0.006，基本等于"SR 图可以替代 HR 图喂分类器"。OCELOT 器官分类上作者也报告本文最优（Table 16），但表格在 PDF 里排版错位，具体数值未可靠取得，不给数字。

**嵌入相似度（Table 15）有一个需要留意的反例**：

| 数据集 | Bicubic | SwinIR-GAN | Ours |
|---|---|---|---|
| CAMELYON17 | 0.7706 | 0.8273 | **0.8348** |
| OCELOT | 0.8127 | 0.8566 | **0.9104** |
| BRACS | **0.9570** | 0.7922 | 0.8141 |

BRACS 上 **bicubic 的 UNI 嵌入相似度 0.9570，远高于本文的 0.8141**。作者把它写成"competitive"，但这个数字说明：在某些数据上，"什么都不做、只做插值"反而保住特征分布。这条与全文主论点（生成优于插值）直接冲突，值得追因。

**病理医生读者研究（§4.5.4）**：1 位 30 年经验病理医生，5 个来自 PRAD-100 的病例，HR 与 SR 图盲评，三个准则。样本量很小（1 人 5 例），只能当作定性佐证。

## 5. 复现与审计重点

1. **代码与权重**：本次在 arXiv 全文和公开搜索中都没有找到官方实现或权重；论文只给方法，没有给仓库链接。Stable Diffusion 2.1-base、SwinIR、HoVer-Net（CoNSeP 预训练）都是公开组件，但训练脚本、ControlNet 初始化、颜色修正和指标实现需要自行补齐。
2. **数据可复现性**：TCGA 是公开的，但论文的 WSI 列表在“supplementary materials”，本次未取得正式版补充材料；arXiv 版没有附完整清单。没有 WSI 清单就无法保证与作者同一划分。另有一处内部不一致：正文说验证集 100 patch 从 200 张训练 WSI 中抽，Table 1 却写验证集来自 36 张 WSI，复现时应以作者补充清单为准。
3. **首个实验**：先只复现推理链——LR→SwinIR→VAE 条件→50 步 DDPM——在 PRAD-100 上核对 ST-LPIPS 与 L1_texture；再决定是否重训。不要一上来就重训 205k iterations。
4. **审计 PSNR 悖论**：同时报告 PSNR/SSIM、ST-LPIPS、L1_texture/L1_intensity，并给出 bicubic 与生成图的局部放大对照。只看 PSNR 会得出“超分不如插值”的结论，只看 LPIPS 会忽略结构漂移。
5. **审计颜色修正**：这是推理链的最后一步，论文未给公式。不同实现会显著改变染色一致性指标；复现时必须固定并公开这一实现。
6. **资源**：作者用 Quadro RTX 8000 训练，但没有给显存峰值；不要把它写成“最低 48GB”或任何显存下限。推理 50 步、512² 输出的实际耗时需实测。
7. **期刊版已核对（2026-10-26）**：正式版改名为 SuperDiff，并把实验从 PRAD/LUAD/GBM 扩到 CAMELYON17、OCELOT、BRACS，补齐下游分类与读者研究；表号已按正式版（Table 1–19）更新。仍缺的两样：官方代码与 WSI 清单（正式版说在 supplementary materials）。

**可检验的改进设想（均未验证）**：

- 用真实扫描仪的 LR/HR 配对（同一张切片的不同倍率重扫）替代下采样构造的 LR，检验退化模型不匹配时的性能。
- 把 L1_texture/L1_intensity 扩展到核边界与腺体结构，而不只核内统计。
- 在超分后接一个伪影检测器，量化“超分是否放大折叠/气泡”，这是本文没有覆盖的风险。

## 6. 建议阅读顺序

Fig. 4 两阶段框架 → §3.1 恢复模块与退化模拟 → §3.2 ControlNet 条件拼接 → §3.3 两类指标（尤其 HoVer-Net 核内统计）→ Table 2 的 PSNR 悖论 → Table 3 病理指标 → Table 4 消融的反例 → §5 局限。

## 7. 前后关联

- [LPFM](69-lpfm.md)：同样把超分、去模糊、去噪放进统一修复框架；可对比“统一模型”与“两阶段专用模型”的取舍。
- [ZoomLDM](58-zoomldm.md)：把倍率当条件做多尺度生成；SuperDiff 则用固定 4× + 任意尺寸输入。
- [HistDiT](62-histdit.md)：虚拟染色同样面临“结构保真 vs 外观真实”的评价问题，可对照两者的指标设计。
- [LRDM](56-lrdm.md)：基础模型特征作为条件；SuperDiff 的条件是恢复图潜变量，不是 SSL 特征。
- [Two-Stage Residual-Guided Diffusion](59-residual-guided-diffusion.md)：同样“先粗后细”，但用残差扩散补细节，可对比两阶段的信息流。
- [RestorePath](49-restorepath.md)：百万像素修复与超分都涉及大图拼接和跨 patch 一致性，评价思路可互相借用。
- [无监督伪影流水线](92-unsup-artifact.md)：**前后工序，不是竞争关系**。本文假设输入没有伪影，而作者自己在局限里承认有伪影的输入会被一起放大；所以合理流程是先跑 92 清伪影、再跑本文提分辨率。注意两篇的 "quality assessment" 指相反的事：92 的 QA 是**检测**，本文的 QA 是**评价方案**。

## 8. 链接

- [期刊正式版 DOI](https://doi.org/10.1016/j.media.2025.103808)
- [PubMed 摘要与题录](https://pubmed.ncbi.nlm.nih.gov/41027251/)
- [arXiv v1 摘要](https://arxiv.org/abs/2408.15218)
- [arXiv v1 全文（方法与 Table 1–5）](https://arxiv.org/html/2408.15218v1)
- [ScienceDirect 记录（PII S1361841525003548）](https://www.sciencedirect.com/science/article/abs/pii/S1361841525003548)
- 本地正式版 PDF：`~/code/papers/MedIA-2026-103808-Xu-SuperDiff-super-resolution.pdf`（Table 1–19 均据此核对）
