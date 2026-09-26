# 12｜MC-SSDU：学习 k-space 划分的多对比自监督 MRI 重建

**论文**：Optimized Multi-Contrast Self-Supervised MRI Reconstruction using Learned k-space Partitioning，arXiv:2606.19182  
**定位**：多对比重建、自监督 SSDU、可学习 k-space 划分、VarNet  
**精读核验**：依据 arXiv PDF 的摘要、方法、数据和实验章节整理（2026-09-22）；尚未进行复现实验。

## 原文摘要

> Objective: Deep Learning has shown promise in accelerating MRI by reconstructing high-quality images from under-sampled data. While recent work has leveraged multi-contrast information to improve reconstruction performance, these methods rely on supervised learning, which requires fully sampled k-space for training. One method, self-supervised learning via data undersampling (SSDU), enables direct training on under-sampled k-space by partitioning it into two sets, with a network mapping between the two. In this work, we improve MRI self-supervised MRI reconstruction with two modifications. Methods: We propose a multi-contrast self-supervised learning framework that jointly trains on multiple under-sampled contrasts without requiring fully sampled k-space data as a reference. Moreover, we learn an optimal self-supervised data partitioning for each contrast in an end-to-end manner, further enhancing reconstruction quality. Specifically, we learn an optimal partitioning probability distribution, which is sampled to generate a mask for partitioning. Results: Experiments on two publicly available multi-contrast MRI datasets demonstrate the improved reconstruction quality of our proposed self-supervised multi-contrast learned partitioning method compared to the current single-contrast self-supervised learning methods. We also demonstrate that learning the partitioning of k-space data further enhances the fidelity of reconstructions. Conclusion: Multi-contrast reconstruction combined with learned partitioning improves reconstruction fidelity over single-contrast self-supervised MRI reconstructions. Significance: Our method can facilitate higher image fidelity and/or accelerated MRI protocol times compared to previous self-supervised methods, and without requiring fully sampled k-space for training.

*来源：arXiv:2606.19182；逐字原文，未改写、未压缩。*

## 中文摘要

> 目的：深度学习通过从欠采样数据重建高质量图像，在加速 MRI 方面展现出前景。尽管近期工作利用多对比信息来提升重建性能，但这些方法依赖监督学习，而监督学习需要全采样 k-space 用于训练。其中一种方法——基于数据欠采样的自监督学习（SSDU），通过把欠采样 k-space 划分为两个集合、并让网络在二者之间建立映射，使得能够直接在欠采样 k-space 上训练。在本工作中，我们通过两项改动改进 MRI 自监督 MRI 重建。方法：我们提出一个多对比自监督学习框架，它在多个欠采样对比上联合训练，而不需要全采样 k-space 数据作为参考。此外，我们以端到端方式为每个对比学习最优的自监督数据划分，进一步提升重建质量。具体而言，我们学习一个最优的划分概率分布，通过采样它来生成用于划分的掩码。结果：在两个公开可用的多对比 MRI 数据集上的实验表明，与当前的单对比自监督学习方法相比，我们提出的自监督多对比可学习划分方法具有更好的重建质量。我们还表明，学习 k-space 数据的划分进一步提升了重建的保真度。结论：与单对比自监督 MRI 重建相比，多对比重建结合可学习划分提升了重建保真度。意义：与先前的自监督方法相比，我们的方法可以促成更高的图像保真度和/或更快的加速 MRI 协议时间，而且不需要全采样 k-space 用于训练。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

多对比重建通常依赖全采样 k-space 做监督，而临床采集常没有这份参考。本文把 SSDU 扩展到多个欠采样对比：每个对比的已采样 k-space 被拆成输入集和 data-consistency 集，多个输入集按 channel 合并后由一个多对比 VarNet 联合重建。划分概率也端到端学习，而不是手工设置。

它把本库的 MC-VarNet 从“如何融合对比”推进到“没有全采样标签时怎样训练，以及训练监督应保留哪些 k-space 点”。

## 2. 问题及研究位置

多对比图像含互补的解剖与病理信息，但全采样监督成本高。SSDU 能只用欠采样 k-space 训练，却通常只处理单一对比且使用启发式数据划分。本文同时处理多对比联合重建和每个对比的可学习划分分布。

## 3. 核心方法和数据流

```text
每个对比的欠采样多线圈 k-space y_l
    → 每对比的 Bernoulli 划分概率 Λ_l（reparameterization + straight-through）
    → input set ỹ_l 与互补的 data-consistency set ỹc_l
    → 拼接所有 input contrasts 为多通道输入
    → 12-cascade multi-contrast End-to-End VarNet
       （每个对比独立 data consistency；U-Net refinement 融合各对比）
    → 跨划分的 k-space loss + 三组 image-space consistency loss
    → 推理时输入原始 y_l → 重建 → 已采样线 k-space replacement
```

训练时网络还会分别处理完整欠采样输入、input set 和 DC set；完整输入支路不反传梯度，用以形成双域一致性项。学习的不是扫描采样掩码，而是 SSDU 训练时如何把已采样 k-space 划给网络输入或自监督目标。

## 4. 论文证据与实验范围

- 网络使用修改后的 12-cascade End-to-End VarNet；多对比图像按 channel 拼接，real/imaginary components 也展开到通道维。
- 评估包含模拟 k-space 的 BraTS 2019 和真实低场多对比 k-space 的 M4Raw；后者的对比未做配准。
- 作者报告多对比和学习划分均提高其协议下的自监督重建质量；应使用相同 mask、对比组合和数据划分核验。

## 5. 复现与审计重点

- 本次核验的 arXiv 页面未列出官方代码链接。
- 先复现固定划分的单对比 SSDU，再验证 multi-contrast 仅增加通道是否有效，最后启用 learned partitioning。
- BraTS k-space 是从 magnitude 图像模拟并引入相位；与真实多线圈采集的结论应分开报告。
- M4Raw 对比之间不配准；运动和错位更大时应加入配准或显式测试融合失败模式。

## 6. 建议阅读顺序

`Abstract` → `II-A Multi-Contrast Self-Supervised Learning` → `II-B Learned Partitioning` → `II-C Dual Domain Loss Function` → `II-D Multi-Contrast Reconstruction Network` → data 与 ablation。

## 7. 前后关联

- 与 [MC-VarNet](08-mc-varnet.md) 比较有全采样监督的多对比融合和本方法的自监督训练协议。
- 与 [PromptMR](09-promptmr.md) 比较不同输入对比/邻帧的条件融合与固定多对比 joint reconstruction。
- 与 [MSC](13-msc.md) 比较训练时划分已采样线和采样器输出后的物理一致性校正。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2606.19182)
- [arXiv PDF 正文](https://arxiv.org/pdf/2606.19182)
