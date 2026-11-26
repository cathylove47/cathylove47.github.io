---
title: MRI 重建的泛化问题：2019–2026 文献地图
date: 2026-11-26 12:00:00
permalink: research/mri-recon-generalization-map/
description: 把 MRI 重建在分布偏移下的研究分成五块：失效与度量、训练期泛化、测试时适配、扩散先验失配、2025–2026 前沿，逐块列代表论文、已覆盖与未充分检验的问题，以及三处还空着的交叉点。
categories:
  - 科研笔记
tags:
  - MRI 重建
  - 分布偏移
  - 测试时适配
  - 扩散模型
  - 文献综述
comments: false
---

MRI 重建模型换一家医院、换一个部位、换一种采样，常常就不灵了。这篇把相关论文按「怎么失败 → 训练时怎么防 → 测试时怎么补 → 生成式先验错了怎么办」分成五块，每块只列最值得读的论文，最后给出几处还没人做的交叉点。

检索时间截至 2026-11-26，共筛过约 240 篇。论文信息都对照过 arXiv、会议或期刊页面。只在检索摘要里见到、没读到原文的数字，文中标为「未核实」。

<!-- more -->

## 一张表看全局

| 路线 | 核心做法 | 现状 |
|---|---|---|
| 失效与度量 | 研究模型在偏移、扰动下坏在哪里，用什么指标看出来 | 对抗不稳定性研究很多；自然偏移下的病灶丢失只有零星报告 |
| 训练期泛化 | 训练一个模型，测试时不再调整 | 多篇大规模研究结论一致：**训练数据越多样越稳** |
| 测试时适配 | 每个扫描用自己的测量再调一次模型 | 能补回大部分 PSNR/SSIM 差距，但早停和超参是共同短板 |
| 扩散先验失配 | 先验和测量算子解耦，换先验或适配先验 | 跨采样方式的鲁棒性有证据，跨解剖、跨对比度的证据多为定性 |
| 评估 | 用什么判断「泛化成功」 | 几乎只看 PSNR/SSIM；病灶级评估都在同分布下做 |

## 1. 模型在偏移下怎么失效

**对抗扰动不等于自然偏移，两者常被混着谈。**

| 论文 | 出处 | 要点 |
|---|---|---|
| [On instabilities of deep learning in image reconstruction](https://arxiv.org/abs/1902.05300) | PNAS 2020 | 微小扰动就能让重建出现明显伪影，引发「深度重建是否不稳定」的争论 |
| [Measuring Robustness in Deep Learning Based Compressive Sensing](https://proceedings.mlr.press/v139/darestani21a.html) | ICML 2021 | 对比网络与 TV/CS：两者都受扰动影响，网络在分布偏移下掉得更多 |
| [Solving Inverse Problems With Deep Neural Networks – Robustness Included?](https://arxiv.org/abs/2011.04268) | TPAMI 2023 | 结论相反：精心训练的网络对扰动并不比经典方法更脆 |
| [On Instabilities of Unsupervised Denoising Diffusion Models in MRI Reconstruction](https://arxiv.org/abs/2406.16983) | MICCAI 2024 | 把不稳定性分析推广到扩散先验 |

**PSNR/SSIM 看不出的局部失败：**

| 论文 | 出处 | 要点 |
|---|---|---|
| [Results of the 2020 fastMRI Challenge](https://arxiv.org/abs/2012.06318) | TMI 2021 | 8× 下出现假血管、病灶被抹平，放射科评分和 SSIM 排名不一致 |
| [Exploring the Acceleration Limits of VarNet Brain MRI](https://pmc.ncbi.nlm.nih.gov/articles/PMC9745443/) | Radiology: AI 2022 | 高加速下小病灶消失，全局指标仍然很好 |
| [On Hallucinations in Tomographic Image Reconstruction](https://arxiv.org/abs/2012.00646) | TMI 2021 | 用零空间给幻觉下定义，但需要参考图 |
| [fastMRI+](https://www.nature.com/articles/s41597-022-01255-z) | Scientific Data 2022 | 给 fastMRI 膝、脑加病灶框，是病灶级评估的基础数据 |
| [Mind the Detail](https://arxiv.org/abs/2507.00670) | MICCAI 2025 | 用检测器当「读片人」，看重建是否保住临床相关细节 |
| [InverseBench](https://arxiv.org/abs/2503.11043) | ICLR 2025 | 扩散先验换采样方向只掉 0.48 dB，端到端网络掉 9.58 dB；但先验训练与测试同为膝关节 |

**系统性的跨分布研究和挑战赛：**

| 论文 / 赛事 | 出处 | 覆盖的偏移 |
|---|---|---|
| [Assessment of the generalization of learned image reconstruction](https://doi.org/10.1002/mrm.27355) | MRM 2019 | 对比度、信噪比、采样 |
| [Implicit data crimes](https://pmc.ncbi.nlm.nih.gov/articles/PMC9060447/) | PNAS 2022 | 提醒：公开数据的预处理会伪造出「偏移」或「泛化」 |
| [Multi-Coil MRI Reconstruction Challenge (Calgary–Campinas)](https://doi.org/10.3389/fnins.2022.919186) | Front. Neurosci. 2022 | 线圈数（12→32 通道） |
| [Robustness of Deep Learning for Accelerated MRI: Benefits of Diverse Training Data](https://proceedings.mlr.press/v235/lin24h.html) | ICML 2024 | 解剖、对比度、扫描仪；结论是多样数据最有效 |
| [Improving Deep Learning for Accelerated MRI With Data Filtering](https://arxiv.org/abs/2508.13822) | NeurIPS 2025 D&B | 18 个数据源、48 个测试集 |
| [MosaicMRI](https://arxiv.org/abs/2604.11762) | NeurIPS 2026 | 骨肌多部位原始数据，含 0.55 T 零样本 |
| CMRxRecon [2024](https://arxiv.org/abs/2503.03971) / [2025](https://cmrxrecon.github.io/2025/Tasks.html) | MICCAI 挑战赛 | 2024：未见模态、采样；2025：未见中心、厂商、病种、5 T、儿科 |

## 2. 训练期泛化：一个模型通吃

| 论文 | 出处 | 要点 |
|---|---|---|
| [PromptMR+](https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/9565_ECCV_2024_paper.php) | ECCV 2024 | 提示式展开网络，赢下 CMRxRecon2024 两条赛道 |
| [SDUM](https://arxiv.org/abs/2512.17137) | ECCV 2026 | 一个 18 级展开模型覆盖 CMRxRecon2025 全部赛道 |
| [MRAugment](https://arxiv.org/abs/2106.14947) | ICML 2021 | 物理一致的数据增强，小数据和偏移下都有效 |
| [UEPS](https://arxiv.org/abs/2603.18572) | arXiv 2026 | 指出线圈灵敏度图估计是跨域瓶颈，去掉显式估计后 OOD 平均 +2.21 dB |
| [SIM](https://arxiv.org/abs/2611.15758) | arXiv 2026-11 | 用自然图像物理仿真训练，13 个 OOD 数据集零样本；单团队预印本，未见代码 |
| Hashmi 等 [CVPRW 2026](https://arxiv.org/abs/2604.22557)、[ECCVW 2026](https://arxiv.org/abs/2610.08109) | 2026 | 冻结的自然图像编码器做心脏重建，域内不一定更好，跨域更稳 |

这一块的共识很清楚：**规模和多样性最重要**。几处没人做的地方：
- 同一冻结模型分别对「新扫描仪」「新采样族」「新倍率」做受控拆分。
- 训练于一种线圈阵列、测试于另一种。
- 用病灶指标衡量泛化。

## 3. 测试时适配：每个扫描自己调

驱动适配的信号只有三类：

1. **数据一致性**：适配后的重建要和采到的 k 空间吻合，如 AdaDiff、SCD、DDIP。
2. **留出 k 空间**：把采到的 k 空间分出一部分不参与训练，用来验证，如 SSDU、ZS-SSL、Darestani TTT、BiasRecon。
3. **SURE**：一种不需要真值的误差无偏估计，如 SMRD、MetaCS。

| 论文 | 出处 | 信号 | 要点 |
|---|---|---|---|
| [ZS-SSL](https://arxiv.org/abs/2102.07737) | ICLR 2022 | 留出 20% k 空间早停 | 单次划分看不到拐点，需要 10 次；最后把留出部分放回重建，事后检验不再独立 |
| [Test-Time Training Can Close the Natural Distribution Shift Gap](https://proceedings.mlr.press/v162/darestani22a.html) | ICML 2022 | 留出 k 空间 | 四种偏移下补回 87–99% 的 SSIM 差距；每片 1–13 分钟；纯监督模型做 TTT 几乎无效 |
| [AdaDiff](https://arxiv.org/abs/2207.05876) | MedIA 2023 | 数据一致性 | 推理时按扫描微调扩散先验 |
| [SMRD](https://arxiv.org/abs/2310.01799) | MICCAI 2023 | SURE | 用 SURE 自动选扩散重建的超参 |
| [DDIP](https://arxiv.org/abs/2407.10641) | ECCV 2024 | 数据一致性 | 3D 共享 LoRA；附录承认部分设置不如不适配，且会遗忘源域 |
| [SCD](https://arxiv.org/abs/2308.14409) | TMI 2025 | 数据一致性 | 边采样边 LoRA；MRI 脑→膝 29.47→30.31 dB；超参在有真值的验证集上调 |
| [D2SA](https://arxiv.org/abs/2503.20815) | NeurIPS 2025 | 自监督 | 同一病人的切片共享适配；只评估 10–20 个受试者 |
| [BiasRecon](https://arxiv.org/abs/2603.13466) | MICCAI 2026 | 留出 k 空间 + SURE | 不到 100 个可调参数，比 DDS 高 1.2–2.1 dB |
| [Accelerating Stroke MRI with Diffusion Models](https://arxiv.org/abs/2603.13007) | MRM 2026 | 有监督微调 | 大规模预训练后用 20 例 FLAIR 微调；适度微调最好 |

**共同短板**：
- **早停和超参不是真正免参考**：要么在有真值的集合上调，要么固定步数。
- **没有在线持续适配**：DDIP、D2SA 都把「跨扫描持续适配并度量遗忘」列为未来工作。
- **没有病灶级评估**：一篇 2026 年的系统综述统计到，自监督重建的读者研究为零（预印本）。

## 4. 扩散先验失配

扩散先验的卖点是「先验只管图像长什么样，测量算子推理时再接」，所以换采样方式、换倍率天然稳健。换解剖、换对比度时先验本身就错了，这时会发生什么？

| 论文 | 出处 | 要点 |
|---|---|---|
| [Robust Compressed Sensing MRI with Deep Generative Priors](https://arxiv.org/abs/2108.01368) | NeurIPS 2021 | 跨采样稳健；跨解剖只有一例半月板撕裂 |
| [Score-based diffusion models for accelerated MRI](https://arxiv.org/abs/2110.05243) | MedIA 2022 | OOD 结果是定性图 |
| [Solving Inverse Problems in Medical Imaging with Score-Based Generative Models](https://arxiv.org/abs/2111.08005) | ICLR 2022 | 只换测量过程，不换解剖、对比度 |
| [Theory on Score-Mismatched Diffusion Models](https://arxiv.org/abs/2410.13746)、[DPnP](https://arxiv.org/abs/2403.17042) | arXiv / NeurIPS 2024 | 先验失配的理论分析，没有 MRI 实验 |
| [A-DPS](https://arxiv.org/abs/2403.08728) | ICLR 2025 | 只用欠采样 k 空间训练先验（Ambient）；没有在偏移下与全采样先验对比 |
| [Bigger Isn't Always Better](https://arxiv.org/abs/2501.07376) | IJCV 2026 | 小感受野先验、自然图像先验在跨域时更稳 |
| [PaDIS-MRI](https://arxiv.org/abs/2509.21531) | ML4H 2025 | patch 先验，T2 脑训练后测 T1 和膝关节，比整图先验高约 2 dB |
| [Unsupervised Detection of Distribution Shift in Inverse Problems](https://arxiv.org/abs/2505.11482) | arXiv 2025 | 只用欠采样测量估计训练、测试分布的 KL |
| [KLIP](https://arxiv.org/abs/2605.31596) | CVPR 2026 | 局部偏移检测，只做了 CT 和人脸 |
| [Task-Driven UQ via Conformal Prediction](https://arxiv.org/abs/2405.18527) | ECCV 2024 | 任务级共形校准，但没在偏移下检验 |

注意：同一个脑→膝设定，SCD 和 DDIP 报告的 DDS 基线就差约 1.1 dB（29.47 vs 28.36），**跨论文数字不能直接比**。

## 5. 2025–2026 前沿的三个问题

**适配 + 蒸馏（又快又能换域）**：
- 没查到同时做「源域先验 → 目标域适配 → 蒸馏成一步或少步」的论文。
- 只覆盖一半的近邻有：[SSDM-MRI](https://arxiv.org/abs/2505.08142)（TMI 2026，蒸馏不适配）、Stroke-MRI（适配不蒸馏）、BiasRecon（适配不蒸馏）、[C-MORE](https://proceedings.mlr.press/v315/akoda26a.html)（MIDL 2026，一致性蒸馏，零样本跨解剖）。

**先验偏移下的病灶保真**：没有系统研究。最近的是：
- [SA-RDM-DC](https://arxiv.org/abs/2607.02428)：膝关节，fastMRI+ 病灶保真，但不是扩散先验。
- [UNSURE 2026 的病理级不确定性研究](https://papers.miccai.org/miccai-2026-sat/UNSURE2026_019.html)：只在同分布下。

**用留出 k 空间决定「要不要适配」**：没查到。部件是分散的：
- ZS-SSL、Darestani：留出早停，但对象不是扩散先验。
- [ZADS](https://arxiv.org/abs/2509.09880)（CAMSAP 2025）：只调保真权重。
- Shoushtari：只做偏移检测。
- BiasRecon：有信号，没有门控。

## 还空着的交叉点

以下是对上面文献的归纳，不是任何一篇论文的结论。

1. **偏移 × 病灶**：病灶级评估都在同分布下做，偏移研究又只看 PSNR/SSIM。把「先验失配程度」当自变量、「病灶对比度保持 / 淡化 / 编造率」当因变量的受控实验还没有。
2. **免参考的适配决策**：留出 k 空间、SURE、测量域偏移检测都已存在，但没有被组合成「是否适配、何时停」的决策，也没人系统比较它们和用真值挑出的最优检查点（oracle）差多少。这里有一个根本限制：留出 k 空间只能验证已采到的频率，对从未采样的频率没有约束，所以它和病灶保真是否相关要先实测。
3. **选择与评估分离**：多数 TTA 论文用同一份留出数据既做早停又做事后检验。拆成两份互斥子集，结论会不会变，没人测过。
4. **持续适配与遗忘**：扫描一张接一张来，适配状态是保留还是重置，回到源域时掉多少？
5. **线圈灵敏度图偏移下的 TTA**：几乎所有 TTA 方法都假设 ESPIRiT 估计的灵敏度图是对的。

## 常用数据集

| 数据集 | 可用于的偏移 | 下游标注 |
|---|---|---|
| [fastMRI](https://arxiv.org/abs/1811.08839) + [fastMRI+](https://github.com/microsoft/fastmri-plus) | 脑↔膝、对比度、厂商（2020 Transfer 赛道） | 病灶框 |
| [SKM-TEA](https://github.com/StanfordMIMI/skm-tea) | 膝关节协议 | 分割、T2 定量 |
| [M4Raw](https://www.nature.com/articles/s41597-023-02181-4) | 0.3 T 低场 | 无病理 |
| [Calgary–Campinas](https://doi.org/10.3389/fnins.2022.919186) | 线圈数 | 无 |
| [CMRxRecon 2024/2025](https://github.com/CmrxRecon/CMRxRecon2025) | 模态、采样、中心、厂商、场强、病种 | 2025 有多病种 |
| [IXI](https://brain-development.org/ixi-dataset/) | 跨站点脑 | 只有幅值图，没有原始 k 空间，需说明仿真测量模型 |

---

完整证据卡（每篇论文的偏移类型、适配信号、数字与核实状态）留在本地笔记里，引用前以原文为准。
