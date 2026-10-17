# 23｜不要再从头训练：把视觉基础模型当作心脏 MRI 重建先验

**论文**：Beyond Training from Scratch: Foundation Models for Data-Efficient and Generalizable Cardiac MRI Reconstruction，arXiv:2610.08109v1（cs.CV，2026-10-06 提交；已被 ECCVW 2026 接收）  
**定位**：心脏 MRI 加速重建的表示迁移研究、冻结编码器与 LoRA 参数高效适配的系统对比、低数据监督与跨数据集泛化  
**精读核验**：依据 arXiv v1 全文（§1–6、Table 1–4、补充材料 Table 5–7）与论文自述的官方仓库 `Hashmi360/BeyondScratch-CMR`（2026-10-13 打开确认：公开仓库、2 次提交、仅 `README.md`、0 star / 0 fork，**没有任何可运行实现、权重或数据脚本**）；**本站未做复现实验，也未运行任何代码**（该仓库当前不存在可运行的代码）。

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/fm-cardiac-story.html)** — 含两处交互（Table 1/2/3 原表指标条形图、Table 5–7 的 LoRA rank 与参数预算滑杆）、三张公式卡、四张原表转录与官方资产清单。

## 原文摘要

> Cardiac magnetic resonance imaging reconstruction aims to recover high-quality images from undersampled acquisitions, enabling faster scans while preserving diagnostic fidelity. Recent reconstruction methods are typically trained from scratch and often require large amounts of task-specific data, limiting their robustness under data scarcity and distribution shifts. In this work, we investigate whether pretrained vision foundation models can serve as effective priors for accelerated cardiac MRI reconstruction. We propose a reconstruction framework that integrates frozen and parameter-efficiently adapted visual encoders, including CLIP, BiomedCLIP, and DINOv2, within a transformer-based reconstruction architecture. Extensive experiments on the CMRxRecon2023 and CMRxRecon2024 benchmarks demonstrate that pretrained representations consistently outperform a transformer trained from scratch across multiple acceleration factors. We further evaluate performance under limited supervision and cross-dataset transfer, showing that foundation models provide superior data efficiency and generalization. While frozen representations are particularly effective in extreme low-data regimes, Low-Rank Adaptation (LoRA) yields additional gains when moderate amounts of training data are available. Among the evaluated backbones, DINOv2 achieves the strongest overall performance. These findings highlight the potential of vision foundation models as robust and transferable priors for cardiac MRI reconstruction. Code is publicly available at: github.com/Hashmi360/BeyondScratch-CMR.

*来源：arXiv:2610.08109v1（https://arxiv.org/abs/2610.08109）。逐字原文，未改写、未压缩；末句的代码声明属于论文摘要原文，保留原样。*

## 中文摘要

> 心脏磁共振成像重建的目标是从欠采样采集中恢复高质量图像，在保持诊断保真度的同时实现更快的扫描。近期的重建方法通常从头训练，并且常常需要大量任务特定数据，这限制了它们在数据稀缺与分布偏移下的稳健性。在这项工作中，我们研究预训练视觉基础模型能否作为加速心脏 MRI 重建的有效先验。我们提出一个重建框架，把冻结的与经参数高效适配的视觉编码器（包括 CLIP、BiomedCLIP 与 DINOv2）整合进一个基于 Transformer 的重建架构中。在 CMRxRecon2023 与 CMRxRecon2024 基准上的大量实验表明，预训练表征在多个加速倍数下都稳定优于从头训练的 Transformer。我们进一步在有限监督与跨数据集迁移下评估性能，显示基础模型提供了更好的数据效率与泛化性。冻结表征在极端低数据区间尤其有效，而低秩适配（LoRA）在训练数据量适中时带来额外收益。在所评估的主干中，DINOv2 取得最强的整体表现。这些发现凸显了视觉基础模型作为稳健且可迁移的心脏 MRI 重建先验的潜力。代码公开于：github.com/Hashmi360/BeyondScratch-CMR。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![论文 Figure 1：UNETR 基线（左）与基础模型重建框架（右）](/papers/mri/23-fm-cardiac-mri-pipeline.png)

> **原文图注**：Figure 1: Overview of the baseline UNETR architecture (left) and the proposed foundation model reconstruction framework (right). The scratch-trained transformer encoder of UNETR is replaced with a pretrained vision foundation model (CLIP, BiomedCLIP, or DINOv2). Features from all transformer layers are fused to form the bottleneck representation, while intermediate features provide multi-scale skip connections to the decoder. The encoder is evaluated in both frozen and LoRA-adapted settings, enabling a controlled study of representation transfer for cardiac MRI reconstruction.

*图源：https://arxiv.org/html/2610.08109v1（Figure 1 原图，直接取自论文，未重绘、未描摹）。*

## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。看完本节和第 1 节就可以先停，需要动手时再往下读。

### 0.1 把它想成什么？

磁共振扫描为了快，只采一部分数据，剩下的靠算法补。传统做法是专门为“补图”训练一个神经网络；这篇论文问的是另一个问题：**能不能不自己教一个补图网络，而是直接借一个已经看过海量图片的“视觉大脑”？** 作者把 UNETR 这个重建网络里负责“看图”的那一半（编码器）整个换掉，换成 CLIP / BiomedCLIP / DINOv2 的预训练编码器，解码器一行不改，然后比较三种策略：从头训练、把借来的编码器冻住、用 LoRA 只调一点点参数。

### 0.2 它为什么出现？

MRI 重建模型是出名的“吃数据”：换医院、换扫描仪、换序列，性能就会掉。而 VL 领域的经验是，大规模预训练得到的视觉表征迁移到新任务很有效。可是 MRI 重建这条线上，之前把基础模型塞进管线的工作往往**同时换了架构**（又多接了几个重建模块），于是没法回答一个干净的问题：**收益到底来自预训练表征本身，还是来自多出来的那几层网络？** 这篇论文的贡献就是把这个变量控制住——用同一个解码器、同一套训练协议，只换编码器，而且额外给出“架构参数规模匹配的从头训练 ViT”作为对照。

### 0.3 它到底怎么做？

1. 拿一张从欠采样 k 空间经 iFFT + 多线圈平方和（RSS）合成、归一化到 [0,1] 的幅值图，裁/补到 224×224，复制成 3 通道。
2. 用 CLIP / BiomedCLIP / DINOv2（ViT-B）当编码器，**丢掉的只是 class token**，保留 patch 表征；把**所有 Transformer 层**的特征用 LayerNorm + 两层 GELU MLP 融合成瓶颈表征，中间层的特征当多尺度跳连送进解码器。
3. 解码器保持 UNETR 原样（转置卷积 + 特征融合，14×14 → 224×224，最后一层 1×1 卷积出图）。
4. 编码器按三种方式使用：从头训练（基线）、冻结（只训融合层与解码器）、LoRA（在 Q/K/V 投影层插入低秩矩阵，编码器本体仍冻结）。
5. 在 CMRxRecon2023 / 2024 上按 4×、8×、10× 加速比较 SSIM / PSNR / NMSE；再做低数据（5%/25%/50%/75%）与跨数据集迁移。

### 0.4 先认清这些词

- **加速倍数（acceleration factor）**：少采几倍数据。4× 比 10× 简单，10× 时留下的信息最少。
- **k 空间**：MRI 的原始采集域（空间频率域），欠采样就是在 k 空间少采线。
- **iFFT + RSS**：每一线圈先逆傅里叶变换，再把各线圈图平方求和开方，得到一张幅值图——所有方法共用的前处理。
- **UNETR**：用 ViT 当编码器、U-Net 式解码器当上采样的重建/分割网络，本文的基线。
- **编码器 / 解码器**：编码器把图压成语义特征；解码器把特征还原成图。本文只换编码器。
- **基础模型（foundation model）**：在大规模数据上预训练的通用视觉模型。CLIP 是图文对比学习，BiomedCLIP 是它在生物医学图文上的版本，DINOv2 是自监督（无标签）。
- **冻结（frozen）**：编码器权重一个都不更新，只训练它后面的部分。
- **LoRA / rank r**：在已有权重上叠加一个小得多的低秩增量 $\gamma BA$，只训练 $A$、$B$；`r` 越大容量越大、可训练参数越多。
- **SSIM / PSNR / NMSE**：结构相似度（越高越好）、峰值信噪比（dB，越高越好）、归一化均方误差（越低越好）。

### 0.5 输入和输出

输入是欠采样的多线圈 k 空间，经 iFFT + RSS 合成的一张 224×224 幅值图（复制成 3 通道）；输出是同一尺寸的完整重建幅值图。训练监督是全采样参考图，损失用 SSIM。

### 0.6 最容易误解的地方

“冻结就能赢”不等于“基础模型在任何情况下都更好”。论文自己的结论是**分场景的**：在 5% 这种极端低数据下，冻结编码器最强；一旦数据变多、或要跨数据集迁移，LoRA 才反过来更有优势。另外，“参数更少”指的是**可训练**参数（33.7M vs 65.7M），不是总参数——预训练编码器的全部权重仍然被加载和推理，省的只是更新量。还有一点：Table 2 里的箭头只表示“相对冻结版是涨还是跌”，不代表方向就是好事（例如 NMSE 变小才是好，但表里可能标 ↑）。读表看数值，别看箭头颜色。

**现在只记住一句话：这篇论文 = 在同一套重建管线里，只换编码器，比较“从头训练 / 冻结预训练 / LoRA 适配”的读数。**

## 1. 三分钟摘要与推荐理由

这是一篇**方法极简、对照极干净的经验研究**。它不提出新的重建网络，只做了一个替换动作：把 UNETR 的 ViT 编码器换成 CLIP / BiomedCLIP / DINOv2 的预训练编码器，解码器、损失、训练协议全部不动；并额外提供“从头训练、参数量可比（65.7M vs 33.7M）”的 UNETR 作为第一对照组。

结论可以压成四句：

1. **预训练一定赢。** 在 CMRxRecon2023 与 2024、4×/8×/10× 全部配置上，冻结基础模型编码器都优于从头训练的 UNETR，而且可训练参数少约 49%（33.7M vs 65.7M）。
2. **谁最好。** DINOv2 整体最强，只在 CMRxRecon2023 的 10× 上被冻结 CLIP 以极小差距反超（SSIM 0.8675 vs 0.8672）。
3. **冻结 vs LoRA 是数据量的函数。** 5% 数据时适配普遍掉分；数据变多后 LoRA 反超，CMRxRecon2024 上 LoRA DINOv2 在 25%/50%/75% 都是最好。
4. **跨数据集迁移时 LoRA 更稳。** 两个迁移方向上基础模型都优于 UNETR，且 LoRA 一般比冻结更好。

读它的理由：这是“表示迁移到底值不值”的一个可复用**实验设计模板**（架构不变、只换编码器 + 有参数匹配的弱对照），而且资产全是公开的——两个公开挑战数据集 + 三个公开预训练编码器 + 一个 UNETR 语义的骨架。它同时给了你一条真实的、可检验的判据：**你手上的标注有多少，决定了你该冻结还是该适配。**

## 2. 问题及研究位置

问题的核心是**从头训练重建网络的代价**。CNN/Transformer 重建模型（本文引用的一线包括 ReconFormer、HUMUS-Net、UNETR 等）在跨扫描仪、跨协议、跨解剖与病理的分布偏移下会明显退化，而临床上很难获得大规模、标准化的训练集。作者顺理成章地问：视觉基础模型在大规模预训练里学到的表征，能不能直接当重建先验？

与相邻工作的差别在于**变量控制**：

- 已有的“把基础模型接进重建管线”的工作（含作者团队自己的 CVPR 2026 与 MIDL 2025 短文）往往额外引入重建模块，因此**无法把预训练表征的贡献和新增架构的贡献分开**。
- 与“架构匹配的从头训练 Transformer”的对照在文献里基本缺失。
- LoRA 在视觉/语言里很常见，但在 MRI 重建里“是否稳定有益、收益是否依赖数据量、是否改善迁移”都还不清楚。

本文的位置：不做新架构，而是把编码器当成可替换的“先验来源”，在统一框架里给出三种范式（from scratch / frozen / PEFT）的系统对照。它的第一条贡献自述就是“据我们所知，首个针对心脏 MRI 重建的表示迁移系统研究”。

## 3. 核心方法和数据流

```text
数据（公开挑战集，患者级 70/10/20 划分，无泄漏）
  CMRxRecon2023：120 例全采样训练病例，3T；cine / T1 mapping / T2 mapping；短轴 + 2/3/4 腔
      → 训练 2,940 / 验证 420 / 测试 852 个样本
  CMRxRecon2024：200 名健康志愿者，3T Siemens Vida；cine / aorta / T1 / T2 / tagging
      → 训练 12,537 / 验证 1,803 / 测试 3,597 个样本
  加速倍数：4× / 8× / 10×
  → 多线圈 k 空间切片 → 每线圈 iFFT → RSS 合成 → 幅值图归一化到 [0,1]
  → 裁/补到 224×224，复制为 3 通道

基线：2D UNETR（input 224×224×1 → patch 16×16 → 196 token → 768 维）
  ViT 编码器：patch 16，hidden 768，6 层，12 头，MLP 3072
  解码器：token 重排成特征图 → 转置卷积 + 特征融合逐级上采样
          （z6 为瓶颈，逐级并入 z5/z4/z3 跳连）→ 224×224 → 1×1 卷积出图
  额外一条浅层卷积分支直接从输入提低层特征，注入最后一级解码

替换（本文唯一的结构改动）
  编码器 := CLIP(ViT-B) | BiomedCLIP(ViT-B, PMC-15M 预训练) | DINOv2(ViT-B)
    · 丢弃 class token，只保留 patch 表征
    · 融合所有 Transformer 层：LayerNorm → 两层 MLP（GELU）→ 瓶颈表征
    · 中间层特征当多尺度跳连，接入解码器的逐级特征融合
    · CLIP / BiomedCLIP 天然给 14×14 token 网格，与解码器匹配；
      DINOv2 patch=14 → 16×16 网格，特征在解码前被双线性插值到所需分辨率
    · 解码器、浅层分支、损失、训练协议全部保持与基线一致

三种用法（唯一自变量）
  (i)   from scratch：UNETR 原编码器，65.7M 可训练参数
  (ii)  frozen：编码器冻结，只训融合层 + 解码器，33.7M 可训练参数
  (iii) LoRA：h = Wx + γΔWx = Wx + γBAx，插入每个 Transformer block 的 Q/K/V 投影层，
        编码器本体冻结；只更新 LoRA 参数 + 融合层 + 解码器（r ∈ {8,64,128}）
        34.0M(r=8, BiomedCLIP) 至 40.8M(r=128, CLIP/DINOv2)

训练与评估
  优化器 AdamW；from scratch: lr 1e-4 / wd 1e-2；frozen: lr 2e-4；LoRA: lr 1e-4 / wd 1e-2
  最多 300 epoch，batch 8；验证损失 5 epoch 不降则 lr×0.5；15 epoch 无改善早停
  损失 = SSIM loss；指标 = SSIM / PSNR / NMSE，取验证最优 checkpoint 在留出测试集上报数
  硬件：单张 RTX 4090，混合精度

评估三问
  Table 1：冻结 vs 从头训练（4×/8×/10×，两个数据集）
  Table 2：冻结 vs LoRA（同配置）
  Table 3：10× 加速下的低数据（5%/25%/50%/75%）
  Table 4：10× 加速下的双向跨数据集迁移（2024→2023 与 2023→2024）
  Table 5–7（补充）：三方 LoRA rank 消融 r ∈ {8,64,128} 与可训练参数
```

三条最该记住的设计：

1. **单变量替换 + 参数匹配的弱对照**：解码器不动、协议不动，且从头训练的 UNETR 是可训练参数更多的强对照。这让“预训练带来了增益”这个结论不会被“多接了几层”污染。代价是：它回答的是“编码器先验值不值”，而不是“哪种重建架构最好”。
2. **所有层一起融合，而不是只取最后一层**：编码器每个 block 的潜状态都进融合模块，中间层同时当跳连。理由在论文里写得很直白——既要低层结构线索，也要高层语义，这对逆问题是必要的（引自作者团队前作 [13]）。
3. **适配被明确参数化为 rank r**：Q/K/V 三处插 LoRA，rank 越大容量越大、可训练参数从 34.0/34.1M 涨到 38.4/40.8M。补充材料说明：BiomedCLIP 一致偏好 r=128；CLIP 在低加速（4×）偏好高 rank、在更难的重建（10×）偏好中间 rank r=64；DINOv2 整体最偏好高 rank，唯一例外是 CMRxRecon2023 的 10×（r=64 最好）。

## 4. 论文证据与实验范围

- **Table 1（全量训练数据，冻结 vs 从头训练）**：两个数据集、三个加速倍数、每个单元格三个指标，8 行 × 3 加速 = 全部配置里冻结基础模型都优于 UNETR。以 CMRxRecon2023 为例，10× 时 SSIM 为 UNETR 0.8524 → 冻结 CLIP 0.8675 / BiomedCLIP 0.8636 / DINOv2 0.8672；PSNR 29.1022 → 30.0675 / 29.5681 / 29.9788 dB；NMSE 0.0765 → 0.0538 / 0.0640 / 0.0573。4× 与 8× 上 DINOv2 的 SSIM 最好（0.9073、0.8787），10× 上冻结 CLIP 以 0.8675 对 0.8672 极小幅度反超。CMRxRecon2024 同样趋势，且 DINOv2 在 4×/8× 的 SSIM 与 PSNR 均为最高。
- **Table 2（冻结 vs LoRA，全量数据）**：效果**强烈依赖数据集**。CMRxRecon2024 上 LoRA 对三个编码器、三个加速倍数**一致**提升（SSIM、PSNR 上升，NMSE 下降），DINOv2 收益最大（10× 时 SSIM 0.8514→0.8571、PSNR 29.1639→29.8925 dB、NMSE 0.0768→0.0635）。CMRxRecon2023 上收益温和得多：PSNR 与 NMSE 普遍改善，但**SSIM 常略低于冻结版**（10× 时 CLIP 0.8675→0.8629、DINOv2 0.8672→0.8649），论文的解读是预训练表征已经与重建任务对齐得比较好。
- **Table 3（10× 加速，低数据 5%/25%/50%/75%）**：基础模型在所有数据比例上都优于 UNETR。**5% 时冻结最强**：DINOv2 的 SSIM 为 0.8348（2023）/ 0.8175（2024），UNETR 为 0.7900 / 0.7803；而 LoRA 版在 5% 上普遍低于冻结版（例如 LoRA DINOv2 2023 为 0.8242）。数据变多后翻转：CMRxRecon2024 上 LoRA DINOv2 在 25%/50%/75% 均为最好，75% 时 SSIM 0.8550、PSNR 29.58 dB。
- **Table 4（10× 加速，双向跨数据集迁移，不做任何额外微调）**：**2024→2023 明显比反向简单**（论文归因于 2024 的规模与多样性更大，目标分布更难）。2024→2023 最强为 LoRA DINOv2（SSIM 0.8634 / PSNR 29.6007 dB / NMSE 0.0583），UNETR 仅 0.8293 / 27.9917 / 0.0849。2023→2024 所有方法都掉得更多：UNETR 跌到 SSIM 0.7596、NMSE 0.1833，LoRA DINOv2 仍有 0.1012 的最低 NMSE。与极端低数据不同的是，**迁移场景下 LoRA 一般优于冻结**。
- **补充材料 Table 5–7（rank 消融）**：可训练参数随 rank 单调增加——BiomedCLIP 34.0M(r=8) / 36.1M(r=64) / 38.4M(r=128)，CLIP 与 DINOv2 为 34.1 / 37.2 / 40.8M（含 LoRA 模块、融合层与解码器）。BiomedCLIP 全配置选 r=128；CLIP 在 4× 选 r=128、在更难的 10× 选 r=64（CMRxRecon2023 上 r=8 的 SSIM 0.8620、r=64 的 0.8629、r=128 的 0.8619——差异都在千分位量级）；DINOv2 在 CMRxRecon2024 全部加速倍数随 rank 单调改善（4×：0.9023 → 0.9025 → 0.9054）。
- **论文自陈的边界（原文 Limitations）**：评估只用平均 SSIM 与 PSNR，**没有放射科医生评估**，因此观察到的改善是经验趋势，不能读成临床优越性的证据。此外全文没有外部中心验证、没有多中心前瞻实验、没有读者研究；加速倍数只到 4/8/10×，未涉及更极端的加速或 3D/时间维建模。
- **计算规模**：论文报告单张 RTX 4090 + 混合精度训练，最多 300 epoch、batch 8。这与未公开数据的双挑战集规模（12,537 / 2,940 训练样本）一起，构成了复现的实际成本边界。

## 5. 复现与审计重点

- **官方代码是空壳，必须自实现。** 论文摘要写“Code is publicly available at: github.com/Hashmi360/BeyondScratch-CMR”，但仓库当前（2026-10-13 核查）公开且**只有 README**：2 次提交、0 star / 0 fork / 0 watcher，`main` 分支下除 `README.md` 外没有任何文件，没有训练脚本、配置、权重或数据处理代码。README 正文仅一句“Official implementation of … accepted at the ECCVW 2026.”。**结论：需按全文自实现**，不能声称复用了官方实现。
- **但资产是公开的，自实现可行。** 两个数据集来自公开挑战（CMRxRecon 挑战主页 https://cmrxrecon.github.io/；CMRxRecon2023 见 arXiv:2309.10836，CMRxRecon2024 见 Radiology: AI 7(2):e240443），三个编码器都是公开 checkpoint（CLIP、BiomedCLIP 在 Hugging Face `microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224`、DINOv2 在 `facebookresearch/dinov2`）。论文未给出 prompt/文本侧的任何使用方式，说明只用了图像编码器。
- **缺失的关键实现细节（复现时需自行决定并记录）**：论文只说“融合所有层 + 两层 GELU MLP”，没有给出融合的具体形状（如何把 6/12 层 × 197 token 压成一个 14×14 瓶颈）、LoRA 的 $\gamma$ 缩放具体取值、LoRA 加在哪些矩阵的合并方式（论文写“query, key, and value 投影层”，是合并 QKV 还是各自的 $W_q$/$W_k$/$W_v$）、以及 DINOv2 的 16×16 网格插值到 14×14 的具体算法（论文只说 bilinearly interpolated）。这些都会影响复现数值。
- **加速倍数与采样掩码不可省。** 论文写“Experiments were performed at acceleration factors of 4×, 8×, and 10×”，但正文没有给出掩码类型（1D 笛卡尔 / 随机 / 等距）。复现时掩码不同会显著改变 PSNR/NMSE，必须与 CMRxRecon 官方基线的掩码设置对齐才能做数字比较。
- **多线圈 → 单幅值图的处理是全流程的隐含前提。** 方法在单一 224×224×1 幅值图上工作（iFFT + RSS 后合成），P 个线圈的相位/敏感性信息被丢弃。这与许多 k 空间域重建方法不同，比较时要注意口径。
- **必须区分的三个“更好”**：可训练参数更少 ≠ 总参数更少；PSNR/NMSE 改善 ≠ SSIM 改善（CMRxRecon2023 的 LoRA 上就出现分歧）；平均指标更好 ≠ 临床更好（论文 Limitations 自陈无放射科评估）。
- **Table 2 的箭头别误读。** 表注写“green arrows (↓) denote performance degradation, while red arrows (↑) denote an improvement”，但同一张表里 NMSE 行也用 ↑ 标注，而 NMSE 变小才是改善（例如 LoRA CLIP 4× 的 NMSE 0.0344→0.0340 标了 ↑）。箭头只表示数值相对冻结版的升降方向，好坏要按指标方向自己判。
- **LoRA 的绝对收益很小。** Table 2 中 CMRxRecon2023 的 SSIM 变化普遍在千分位以内（10× 时 CLIP 0.8675→0.8629 是 −0.0046）。做结论前应看多个 seed 的方差，论文未报告方差或显著性检验。
- **rank 选择是“事后择优”。** 论文说明最优 rank 是在“SSIM 优先、PSNR/NMSE 次之”的准则下**每个配置独立挑**的。跨配置比较 LoRA 与冻结时必须记住：LoRA 那一列是三个 rank 里的最好者，冻结列没有这种选择自由度，这是轻微的乐观偏差。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（左：UNETR 基线；右：编码器被替换后的框架，冻结与 LoRA 两种设置）→ `§1`（动机与三条贡献）→ `§2`（相关工作里对“无法分离表征与架构贡献”的点名）→ `§3`（框架总述：单变量替换）→ `§3.1`（基线 UNETR 的层数/维度/跳连）→ `§3.2`（编码器替换、全层融合、DINOv2 的 16×16→14×14 插值）→ `§3.3`（Eq.1 LoRA 与“只训 LoRA + 融合层 + 解码器”）→ `§4.1`（两个数据集的规模、模态与患者级划分）→ `§4.2`（iFFT + RSS、224×224、优化器/学习率/早停、SSIM 损失）→ `Table 1`（冻结 vs 从头）→ `§5.2` 与 `Table 2`（冻结 vs LoRA）→ `§5.3` 与 `Table 3` + `Fig. 2`（低数据）→ `§5.4` 与 `Table 4`（双向迁移）→ `Fig. 3`（定性图与误差图）→ `§6` 与 `Limitations` → 补充材料 `Table 5–7`（rank 与参数预算）。

## 7. 前后关联

- 与 [HUMUS-Net](07-humus-net.md) 对照：同属 MRI 重建主线，但 HUMUS-Net 走“混合展开 + 多尺度卷积”的架构创新路线，本文则**故意不做架构创新**，把变量收缩到“编码器的先验来源”。两篇一起读，正好区分“换结构”和“换先验”两种增益来源。
- 与 [MC-VarNet](08-mc-varnet.md)、[PromptMR+](10-promptmr-plus.md) 对照：这两个也面向多线圈/挑战赛场景，但讨论的是展开网络与提示机制；本文给出的判据（数据量少 → 冻结，数据量多或要迁移 → 适配）可以直接拿来检验它们的初始化与预训练策略。
- 与 [DDS](20-dds.md)、[Score-MRI](06-score-mri.md) 对照：那一支用**生成式先验**（扩散/分数模型）做逆问题求解，本文用**判别式视觉编码器**当先验。同为“先验从哪来”的问题，一个来自非配对预训练分布，一个来自大规模视觉预训练的表征，比较两者在低数据与跨域下的表现是一个自然的实验。
- 与本仓库其他 patient-level 划分的挑战赛工作对照：本文强调按患者划分以避免泄漏、并将 CMRxRecon2023 只有 120 例病例切出 2,940 个样本这件事写清楚，是评估可比性的好样板。
- 论文中两条重要的直接前作：作者团队的 CVPR 2026 工作（Are Natural-Domain Foundation Models Effective for Accelerated Cardiac MRI Reconstruction?）与 MIDL 2025 短文；本文相对它们的推进是**加入 LoRA 这一维度并做低数据/跨域切片**。若要补齐这条支线，可优先补 CVPR 2026 那篇。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2610.08109)
- [arXiv HTML 正文（含 Fig. 1–3 与 Table 1–7）](https://arxiv.org/html/2610.08109v1)
- [论文自述的官方仓库 Hashmi360/BeyondScratch-CMR（2026-10-13 核查：仅 README，无实现）](https://github.com/Hashmi360/BeyondScratch-CMR)
- [CMRxRecon 挑战主页（两个数据集入口）](https://cmrxrecon.github.io/)
- [CMRxRecon2023 数据集论文（arXiv:2309.10836）](https://arxiv.org/abs/2309.10836)
- [CMRxRecon2024 数据集论文（Radiology: Artificial Intelligence 7(2):e240443）](https://pubs.rsna.org/doi/10.1148/ryai.240443)
- [BiomedCLIP 公开权重（Hugging Face）](https://huggingface.co/microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224)
- [DINOv2 官方仓库](https://github.com/facebookresearch/dinov2)
- [OpenCLIP 官方仓库（CLIP 编码器）](https://github.com/mlfoundations/open_clip)
- [故事式 HTML 精读页](/pathology-atlas/learning/fm-cardiac-story.html)
