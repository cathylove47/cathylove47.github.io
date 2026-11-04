# 28｜采样轨迹学习：用扩散先验的梯度挑 k-space 采样位置

**论文**：Learning optimized sampling patterns for accelerated MRI reconstruction via diffusion models，J Med Imaging 2026;13(Suppl 1):S11210（DOI 10.1117/1.JMI.13.S1.S11210，PMID 42953467，PMCID PMC13715940）
**定位**：采样模式联合设计、单步后验均值目标、贪婪选点、扩散先验、多线圈重建
**精读核验**：期刊摘要取自 PubMed 逐字原文；方法细节、数据划分与实验设置取自同一工作的预印本 arXiv:2306.03284v2（题名不同但摘要与本文高度一致，本文为其实刊版）；**期刊版正文全文本次未取到（PMC 页面 403、EuropePMC 全文接口 500），正文级数字以预印本为准并在下文逐处标注**。官方实现已核对仓库与 README（2026-11-04）。尚未进行复现实验。

## 原文摘要

> PURPOSE: Magnetic resonance imaging (MRI) is a powerful medical imaging modality, but long acquisition times limit throughput, patient comfort, and clinical accessibility. Diffusion-based generative models serve as strong image priors for reducing scan time with accelerated MRI reconstruction and offer robustness across variations in the acquisition model. However, most existing diffusion-based approaches do not exploit the unique ability in MRI to jointly design both the sampling pattern and the reconstruction method. Although prior learning-based approaches have optimized sampling patterns for end-to-end unrolled networks, analogous methods for diffusion-based reconstruction have not been established due to the computational burden of posterior sampling. We propose a method to optimize k-space sampling patterns for accelerated multi-coil MRI reconstruction using diffusion models as priors.
>
> APPROACH: We introduce a training objective based on a single-step posterior mean estimate that avoids backpropagation through an expensive iterative reconstruction process. Then, we present a greedy strategy for learning Cartesian sampling patterns that selects informative k-space locations using gradient information from a pre-trained diffusion model while enforcing spatial diversity among samples.
>
> RESULTS: Experimental results across multiple anatomies and acceleration factors demonstrate that diffusion models using the optimized sampling patterns achieve higher-quality reconstructions in comparison with using fixed and learned baseline patterns.
>
> CONCLUSIONS: We propose a method to learn sampling patterns for accelerating MRI with diffusion-based generative models and posterior sampling reconstruction.

*来源：PubMed PMID 42953467（J Med Imaging 2026;13(Suppl 1):S11210）；逐字原文，未改写、未压缩。分段小标题沿用原文结构。*

## 中文摘要

> 目的：磁共振成像（MRI）是一种有力的医学成像手段，但采集时间长限制了吞吐量、患者舒适度与临床可及性。基于扩散的生成模型可作为强图像先验，在加速 MRI 重建中缩短扫描时间，并对采集模型的变化具有鲁棒性。然而，多数既有扩散方法没有利用 MRI 的一项独特能力：联合设计采样模式与重建方法。尽管此前有基于学习的方法为端到端展开网络优化过采样模式，但由于后验采样的计算负担，面向扩散重建的同类方法尚未建立。我们提出一种用扩散模型作为先验、为加速多线圈 MRI 重建优化 k-space 采样模式的方法。
>
> 方法：我们引入一个基于单步后验均值估计的训练目标，从而避免对昂贵的迭代重建过程做反向传播。随后，我们提出一种学习笛卡尔采样模式的贪婪策略，利用预训练扩散模型的梯度信息选出信息量大的 k-space 位置，同时在样本之间强制空间分散性。
>
> 结果：跨多个解剖部位与加速倍率的实验表明，使用优化后采样模式的扩散模型，相比使用固定模式与学习式基线模式，取得了更高质量的重建。
>
> 结论：我们提出一种为加速 MRI 学习采样模式的方法，重建端使用基于扩散的生成模型与后验采样。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词以英文原文为准。*

## 1. 三分钟摘要与推荐理由

MRI 有一件别的成像模态没有的便宜：**采哪些点是你自己定的**。采样模式一变，重建算子就变；所以"先验 + 采样"其实可以一起设计。展开网络时代的做法是把采样模式当成可学参数、对整条展开链路反传（LOUPE 一族）；到了扩散先验这里，这条思路走不通——后验采样要跑上百步迭代，反传成本爆炸。

这篇的破法是换目标函数：**不最小化"跑完整个后验采样后的重建误差"，而是最小化"单步后验均值估计"的误差**。单步估计是一步闭式/近似闭式的量，梯度可以直接传到采样点上；再用这个梯度做贪婪选点。

值得读的两点：

1. **它把"扩散先验下的采样模式设计"补成了空白**。结论是：在 R = 4…20 的全区间上，用本方法学的模式优于变密度泊松盘与多线圈 LOUPE 学的模式，且在脑、膝、PDFS 膝与合并数据上都成立。
2. **它是 2023 年预印本的 2026 年期刊版**，方法本身不是 2026 年的新东西；引用时应写清版本，别当成新提出的方法。

要留心的：贪婪选点是逐步加点、不能回退，因此对初始自校准区与候选集大小敏感；而且它优化的是"这一套扩散模型 + DPS 采样器"的组合，换了重建器就要重学。

## 2. 问题及研究位置

问题：给定重建方法（扩散先验 + 后验采样），选择笛卡尔采样集合 H ⊂ Ω，使重建质量最好。目标函数里出现的是"采到的点 → 重建 → 与真值比较"，而重建本身是迭代的。

已有位置：

- **固定模式**：变密度泊松盘——工程上常用，但不对任何重建器做优化。
- **学习式（展开网络）**：LOUPE 与多线圈扩展，把采样概率作为可学参数，对展开重建端到端反传。扩散重建无法照搬。
- **本文**：把反传的落点从"整条重建链"换成"单步后验均值"，再对离散选点做贪婪搜索而不是连续松弛。

## 3. 核心方法和数据流

```text
预训练：EDM 框架的扩散模型（多线圈，两通道实值表示复数）
        —— 这一步与采样模式无关，只学数据分布

学采样模式（在验证集上做，不是在测试集上）：
  初始化 H ← 自校准（ACS）区域的所有点（这些点永远采样）
  重复直到达到目标加速倍率：
      1) 从 H 之外随机抽候选点
      2) 组成候选模式 P = H ∪ 候选
      3) 用"单步后验均值估计"的损失 L(P) 计算每个候选点的梯度 ∇_p L(P)
         （单个梯度即可，不必对整条重建链反传）
      4) 取梯度最小的 top-K 候选（= 最"有用"的点），
         在它们中间解一个带间距约束的选取问题（保证新点不与已选点聚集）
      5) 选中的点并入 H

重建：用学好的模式采数据，跑标准 DPS（论文设 200 步、S_churn=40）
```

三个要点：

1. **单步后验均值是"代理目标"**：它代替昂贵的完整后验采样，使梯度可算；这是整篇方法能成立的技术核心，代价是代理与真实目标之间存在偏差（论文以实验说明偏差可接受，但没有给出理论上界）。
2. **贪婪 + 空间分散**：候选点按梯度挑，但挑完还要经过一次"互不相邻"的筛选。作者用这一点解释了它与泊松盘／LOUPE 的形态差别——后者要么过于均匀、要么全挤在中心，而学到的模式"保持间距的同时把测量优先分配给信息量大的中心区域"。
3. **ACS 是硬约束**：初始化就固定自校准区，之后只往外面加点，所以最终模式一定包含 ACS；这也意味着加速倍率提高时被优化的只是外围部分。

## 4. 论文证据与实验范围

**数据（预印本 §实验设置）**：fastMRI 多线圈——T2 加权脑（1.5T，训练/验证/测试 = 14162 / 3110 / 280）、PD 膝（3T，6080 / 864 / 281）、PDFS 膝（3T，6211 / 880 / 270）。扩散模型按解剖训练：脑模型 13.5M 参数、批量 54；膝模型（PD+PDFS 合并）14.5M 参数、批量 27；各训练 10M 个样本，Adam，学习率 1e-4，EMA 半衰期 50K 样本，随机水平翻转增广。复数数据表示为两通道实值。

**重建器**：DPS，200 步采样，S_churn = 40；似然步长 ρ = 2.5（T2 脑、PDFS 膝）、5（PD 膝）、3（膝合并）；每组测量取 5 次重建平均。（上述参数为预印本设置，期刊版可能调整。）

**对照**：变密度泊松盘采样、多线圈 LOUPE 学到的模式、以及 MoDL 的量化结果（作参考）。加速倍率 R ∈ {4, 8, 12, 16, 20}。

**结果（预印本表述）**：在全部解剖、全部指标（PSNR/SSIM/NRMSE）、全部加速倍率上，学到的模式优于泊松盘与 LOUPE 两种基线；作者同时指出 MoDL 因为直接以 NRMSE 端到端训练，在 NRMSE/PSNR 上常常接近甚至更好——即本方法提升的是"扩散重建拿到好模式后的上限"，不是"扩散重建全面胜过展开网络"。定量的逐格数值以图（Fig. 6，含标准误阴影）呈现。

**范围限制**：2D 笛卡尔采样；模式与"这套扩散模型 + DPS 设置"绑定；期刊版是否扩充了数据集与对照，本页无法确认（正文未取到）。

## 5. 复现与审计重点

- **两个仓库要分清**：`https://github.com/Sriram-Ravula/MRI_Sampling_Diffusion`（MIT，2023 年预印本的原始代码，最近推送 2023-06-30，README 明确指向 arXiv:2306.03284）；`https://github.com/utcsilab/MRI_Diffusion_Patterns`（MIT，描述为"Ravula 等人的采样模式源码"，最近推送 2026-05-14，含 EDM 子模块与 hydra 配置，`scripts/` 目录给训练示例）。**面向本文期刊版应优先用后者**；核查日期 2026-11-04。
- **子模块必须先初始化**：两个仓库都依赖 `git submodule update --init --recursive`（后者带 EDM），否则导入直接失败。
- **预训练权重在外部网盘**：原始仓库 README 给出 Google Drive 的模型检查点与 fastMRI 元数据链接，需要手动下载；没有权重就要从头训扩散模型，成本远高于学模式本身。
- **学模式发生在验证集上**：训练集训扩散模型、验证集学采样模式、测试集评估——这个三段划分是方法公平性的关键，复现时不要合并训练与验证。
- **候选集大小 K 与间距约束是两个隐式超参**：论文用它们同时控制探索与分散；不同 K 会给出形态明显不同的模式，跨设置比较前要固定。
- **不要拿预印本数字与期刊版数字互换**：两者题名与摘要几乎一致，但正文的实验矩阵可能不同；本页标注为预印本的结论都来自 arXiv:2306.03284v2。

## 6. 建议阅读顺序

期刊摘要（四段结构可直接当路线图）→ 预印本 §1（为什么扩散重建下不能端到端学模式）→ §2 相关工作（LOUPE 与泊松盘）→ §3 单步后验均值目标的推导（Eq. 14 一带）→ §3 贪婪更新规则（top-K 候选 + 间距约束）→ 实验设置 → Fig. 1（三种模式的形态对比）→ Fig. 6（跨解剖、跨加速倍率的定量曲线）→ 附录 C（DPS 采样器细节）。

## 7. 前后关联

- 与 [Score-MRI](06-score-mri.md) 对照：Score-MRI 固定采样模式、改重建器；这篇固定重建器、改采样模式——同一对变量的两个方向，正好互补。
- 与 [DDS](20-dds.md)、[MSC](13-msc.md) 对照：后两者在推理期改一致性/采样子空间，本文在**采集期**改信息从哪来；三篇合起来是"数据一致性"从采集到采样的一条完整链。
- 与 [SSDM-MRI](27-ssdm-mri.md) 对照：SSDM 把步数压到 1 之后，采样模式的影响会更突出（单步模型没有多步纠错的机会），可以作为"优化模式在少步重建下是否更值钱"的验证入口。
- 与 [MC-SSDU](12-mc-ssdu.md) 对照：那边学的是 k-space 的**划分**（哪些用于监督），这边学的是 k-space 的**取点**（哪些用于采集），两者都在回答"哪些 k-space 位置的信息最值钱"。

## 8. 链接

- [PubMed 摘要（J Med Imaging 2026）](https://pubmed.ncbi.nlm.nih.gov/42953467)｜[PMC 全文页](https://pmc.ncbi.nlm.nih.gov/articles/PMC13715940/)
- [DOI](https://doi.org/10.1117/1.JMI.13.S1.S11210)
- 预印本：[arXiv:2306.03284](https://arxiv.org/abs/2306.03284)（本文的早期版本，方法与实验设置主要依据此版）
- 代码：[utcsilab/MRI_Diffusion_Patterns](https://github.com/utcsilab/MRI_Diffusion_Patterns)（MIT，最近推送 2026-05-14，面向期刊版）｜[Sriram-Ravula/MRI_Sampling_Diffusion](https://github.com/Sriram-Ravula/MRI_Sampling_Diffusion)（MIT，2023 原始版）
