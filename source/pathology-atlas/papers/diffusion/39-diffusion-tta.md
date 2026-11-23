# 39｜Diffusion-TTA：把分类器的输出当扩散模型的条件，用生成似然反传改分类器

**论文**：Diffusion-TTA: Test-time Adaptation of Discriminative Models via Generative Feedback，Mihir Prabhudesai、Tsung-Wei Ke、Alexander C. Li、Deepak Pathak、Katerina Fragkiadaki（CMU）；NeurIPS 2023；arXiv:2311.16102（v1 2023-11-27，v2 2023-11-29）
**定位**：用预训练条件扩散模型的似然做测试时适配；把判别模型的输出（类别概率、分割图、深度图）变成扩散模型的条件 c，最小化扩散去噪损失并反传到判别模型参数；不联合训练、不改判别模型的训练目标
**精读核验**：2026-11-22 依 arXiv HTML v2 全文（§1–4.3、Table 1–4、Figure 1–3，含 Algorithm 1 与实现细节；§4.4 消融只读标题级）逐节读过，v2 为 NeurIPS 2023 版。官方代码 `mihirp1998/Diffusion-TTA` 同日核对：`main.py`、`diff_tta/models/build.py` 与 `+experiment=dit` 配置是真实实现，且按 README 需要额外克隆 `mihirp1998/DiT`。**本站做过推理走查**（小样本，用作者权重，非论文指标复现）：见 [推理走查记录](/pathology-atlas/learning/infer-diffusion-tta.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> The advancements in generative modeling, particularly the advent of diffusion models, have sparked a fundamental question: how can these models be effectively used for discriminative tasks? In this work, we find that generative models can be great test-time adapters for discriminative models. Our method, Diffusion-TTA, adapts pre-trained discriminative models such as image classifiers, segmenters and depth predictors, to each unlabelled example in the test set using generative feedback from a diffusion model. We achieve this by modulating the conditioning of the diffusion model using the output of the discriminative model. We then maximize the image likelihood objective by backpropagating the gradients to discriminative model's parameters. We show Diffusion-TTA significantly enhances the accuracy of various large-scale pre-trained discriminative models, such as, ImageNet classifiers, CLIP models, image pixel labellers and image depth predictors. Diffusion-TTA outperforms existing test-time adaptation methods, including TTT-MAE and TENT, and particularly shines in online adaptation setups, where the discriminative model is continually adapted to each example in the test set. We provide access to code, results, and visualizations on our website: https://diffusion-tta.github.io/.

*来源：arXiv:2311.16102v2 摘要（NeurIPS 2023 版）。*

## 中文摘要

> 生成建模的进展、尤其是扩散模型的出现，引出了一个根本问题：这些模型怎样才能有效地用于判别任务？本工作发现，生成模型可以是判别模型极好的测试时适配器。我们的方法 Diffusion-TTA 借助扩散模型的生成反馈，把预训练的判别模型（如图像分类器、分割器、深度预测器）适配到测试集中每一个无标签样本上。做法是用判别模型的输出去调制扩散模型的条件，然后通过把梯度反传到判别模型的参数来最大化图像似然目标。我们证明 Diffusion-TTA 显著提升了多种大规模预训练判别模型的精度，包括 ImageNet 分类器、CLIP 模型、逐像素标注器和图像深度预测器。Diffusion-TTA 优于现有测试时适配方法，包括 TTT-MAE 与 TENT，并在「在线适配」设定下尤其突出——判别模型在测试集上逐样本持续更新。我们在 https://diffusion-tta.github.io/ 提供了代码、结果与可视化。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**把「分类器 + 扩散模型」接成一个编码器—解码器：分类器把图像压成一个类别分布，这个分布被翻译成扩散模型的条件，扩散模型再看「在这个条件下，这张图有多像真的」；把这份似然对分类器求梯度，就等于用生成知识纠正判别错误。**

三件值得读的事：

1. **条件是可微的桥梁**：分类器输出 y∈[0,1]^L，用文本编码器给出的类嵌入 ℓ_j 加权求和 c = Σ_j y_j·ℓ_j；c 对 y 可微、y 对 θ 可微，于是扩散损失 L(θ,φ)=𝔼‖ε_φ(√ᾱ_t x + √(1−ᾱ_t)ε, c, t) − ε‖² 能一路反传到分类器。分割与深度同理（逐像素类嵌入加权 / 直接把深度图当条件）。
2. **它同时动两边**：Algorithm 1 里判别模型 θ 必更新，扩散模型 φ 可选更新。ImageNet 偏移实验里作者两边都更新（并声称明显更好），CLIP 实验里冻结 φ、只调 LoRA。这是它和「只改输入」的 DDA 最本质的差别——它把生成器也拉进了测试时优化。
3. **单样本也能适配**：不像 TENT 需要 batch 估计统计量，Diffusion-TTA 对每张图独立优化（单样本设定），因此在 ImageNet-R/A/v2/S 这些非损坏型偏移上也能用。代价是极慢：单张约 55 秒（A100 40GB，有效 batch 180）。

**关于「它到底证明了什么」（本页判断）**：Table 1 里连**同分布** ImageNet 都涨（ResNet-18 69.5→77.2），这不像纯粹的「抗偏移」，更像「用生成先验做了一次强正则/集成」。同时 TENT 在他们手里大幅掉点（ResNet-18 63.0，ConvNeXt-T 16.4→2.7），与 TENT 原论文的在线结果方向相反——比较时要注意这可能是 batch=1/小 batch 下的 TENT，而不是 TENT 的最优设定。因此「Diffusion-TTA > TENT」这句结论应限定在「单样本、无 batch 信息」的设定下读。

## 2. 问题及研究位置

判别模型拟合 p(y|x)，在分布内很强、分布外容易走捷径；生成模型拟合 p(x|y)，做贝叶斯反演（analysis-by-synthesis）时对 OOD 更稳，但纯反演（如 Diffusion Classifier）在分布内比不过判别模型。作者主张两者不该竞争，而应在推理时耦合。

已有位置：

- **反演式**：Diffusion Classifier 找使 p(x|c) 最大的条件；准，但慢且在分布内不占优。
- **生成式数据增广**：用扩散造数据再训练分类器（如 Azizi 等），需要改训练、且要标签。
- **生成式预训练 + 下游微调**：初始化好，但需要下游监督。
- **测试时适配**：TENT（熵 + BN）、CoTTA（教师-学生 + 伪标签）、TTT-MAE / Slot-TTA（自监督重建损失）。这些方法在测试时只用判别模型自己的信号；本文用**外部生成模型**提供额外知识。
- **本文**：不改训练、不做联合训练、不需要标签，直接把预训练扩散模型当适配器。

## 3. 核心方法和数据流

```text
输入：测试图 x、判别模型 f_θ、条件扩散模型 ε_φ、步数 N、batch B、学习率 η
重复 N 次适配步：
    y = f_θ(x)                                   # 当前判别输出
    c = Σ_j y_j · ℓ_j                            # 分类：类嵌入加权（分割逐像素、深度直接用图）
    采样 B 组 (t_i, ε_i)
    L = (1/B) Σ_i ‖ ε_φ(√ᾱ_{t_i}·x + √(1−ᾱ_{t_i})·ε_i, c, t_i) − ε_i ‖²
    θ ← θ − η∇_θ L                               # 判别模型必更新
    （可选）φ ← φ − η∇_φ L                        # 生成模型是否更新依实验而定
输出：更新后的 y = f_θ(x)
```

四个要点：

1. **为什么是大 batch 的 t、ε**：作者说降低扩散损失的方差对适配效果很关键，所以在一个样本上采样大量 (t, ε) 组合，等效于「同一张图配很多噪声水平」。A100 40GB 只能放 20，于是梯度累积 9 步凑到 ~180。
2. **哪些参数动**：ImageNet 分类实验更新判别模型全部参数，并更新扩散模型参数；CLIP 实验冻结扩散、只加 LoRA 到 CLIP 的 query/value 投影；分割/深度用在该数据集上从零训练的潜扩散模型。
3. **初始化即先验**：优化从预训练权重出发，损失只要求「当前条件能解释这张图」，没有标签项，因此完全无监督。
4. **两种使用方式**：单样本（每张图从原权重重新适配）与在线（权重在测试流上累积）。论文在 ImageNet-C 上报告在线、在 ImageNet-R/A/v2/S 与 CLIP 上报告单样本。

## 4. 论文证据与实验范围

**ImageNet 系分类，单样本（Table 1，top-1 %）**：

| 模型 | 无适配 | +TENT（在线） | +CoTTA（在线） | **+Diffusion-TTA（单样本）** |
|---|---|---|---|---|
| ResNet-18 / ImageNet | 69.5 | 63.0 | 63.0 | **77.2** |
| ResNet-18 / ImageNet-C | 2.6 | 12.1 | 11.7 | 4.5 |
| ViT-B/32 / ImageNet | 75.7 | 75.7 | 75.8 | **77.6** |
| ViT-B/32 / ImageNet-C | 39.5 | 38.9 | 40.0 | **41.4** |
| ConvNeXt-T / ImageNet | 81.9 | 79.3 | 80.5 | **83.1** |
| ConvNeXt-T / ImageNet-C | 16.4 | 2.7 | 13.7 | **21.0** |

**ImageNet-C 在线（Table 2，五种损坏）**：ResNet-50 高斯噪声 6.3→19.0；ConvNeXt-T 16.4→47.4；ConvNeXt-L 33.0→54.9；ViT-B/32 39.5→46.5。这是论文最亮的一组数字。

**CLIP 单样本（Table 3，ViT-B/32）**：Food101 82.6→86.2、Aircraft 17.8→21.0、Pets 82.2→84.9、CIFAR-100 61.2→62.8、ImageNet 57.5→60.8；ViT-B/16 在 CIFAR-100 上 −0.4，ViT-L/14 在 Food101 上持平。**不是全胜**。

**分割/深度（Table 4，单样本）**：SegFormer 在 ADE20K 干净集 66.1→66.1，高斯噪声 65.3→66.4；DenseDepth 在 NYU v2 干净集 92.4→92.6（SSIM），高斯噪声 79.1→82.1。提升集中在被损坏的输入，干净输入几乎不动——这一点比分类表更能说明「它主要在修损坏」。

**范围限制（本页判断）**：分类的 ImageNet 结果依赖 DiT-XL/2 与 ImageNet 同域；CLIP 依赖 Stable Diffusion 2.0 的文本嵌入；分割/深度的扩散模型是在同一数据集上从零训练的（不是跨域先验），所以「生成器提供独立知识」在这两个任务上并不成立。全部实验是 2D 自然图像，无医学影像；没有病灶级保真度评估；单张 55 秒的成本使它难以用于流式临床数据。

## 5. 复现与审计重点

**本站的推理走查（小样本）**：在 gpu04 上跑官方 `+experiment=dit`：判别模型 ResNet-18（torchvision 权重），生成模型 DiT-XL/2 256×256（2.70 GB）+ sd-vae-ft-ema（335 MB），数据为 ImageNet-R 的 6 个类、每类最多 3 张，共 14 张。结果：`before_avg_acc 0.6429（9/14）→ after_avg_acc 0.7143（10/14）`，+7.1 个百分点，方向与论文一致；另跑的 2 张子集前后都是 1.00，无可改善空间。

- **与论文的关系**：论文 Table 1 里 ResNet-18 在 ImageNet-R 上是 34.6→39.7（+5.1）；我们 14 张子集 +7.1 但基数高得多（ImageNet-R 的 6 个易类），只能说明方向一致，不构成数值复现。
- **必要的偏离**：README 的 `input.batch_size=12` 在 24 GB 卡上直接 CUDA OOM（DiT-XL 675M 全参数可训 + 激活），降到 2，并把 `accum_iter` 提到 15 以保持总梯度步 1500 不变；`train_steps=100`、`lr=1e-5`、Adam 保持默认。这是唯一的功能性超参偏离。
- **两处代码改动**：`diff_tta/models/build.py` 增加 `SD_VAE_PATH` 环境变量，复用已下载的 VAE 而不走 HF；`main.py` 的 `wandb.init` 改为传 `OmegaConf.to_container(config, resolve=True)`，否则新版 wandb 在原始 OmegaConf 对象上抛 `TypeError`。
- **环境坑**：diffusers 0.16 必须配 `huggingface_hub<0.20`，而新版 `datasets` 又要 `hf_hub>=0.25` 且新版 pyarrow 删了 `PyExtensionType`，只能整套降到 datasets 2.14.6 + pyarrow 12.0.1 + numpy 1.23.5。
- **没跑的**：ImageNet-C 在线设定（论文最亮的一组）、CLIP、分割、深度、以及 §4.4 的全部消融；也没有做「只更新判别模型 vs 同时更新扩散模型」的对照。
- **耗时**：bs=2 时每张约 20–40 秒，14 张约 6 分钟。

**审计要点**：论文在 ImageNet 系实验里同时更新扩散模型权重，这意味着它部分是在测试时训练生成器——这与「生成器提供独立先验」的叙事有张力，复现时必须把「只调 θ」「θ+φ」分开报；55 秒/样本的成本应作为方法的一部分来评估，而不是脚注；TENT/CoTTA 的比较是它们不擅长的单样本/小 batch 设定，跨论文引用时要注明。

## 6. 建议阅读顺序

摘要 → §1 末尾的「编码器-解码器」类比 → §3.2 式 (2) 与三类任务的条件构造 → Algorithm 1 → §3.2 实现细节（batch 180、55 s/样本、何时冻结 φ）→ §4.1 Table 1 → Table 2（在线 ImageNet-C）→ §4.2 Table 3（CLIP）→ §4.3 Table 4（分割/深度）→ §4.4 消融。

## 7. 前后关联

- 与 [37 号 TENT](37-tent.md) 是对照组：同样是测试时改权重，TENT 的监督信号是自身熵，Diffusion-TTA 是外部生成似然；论文 Table 1/2 里 TENT 在多个骨干上掉点，是它最主要的立论依据（但需注意设定差异，见 §1 判断）。
- 与 [38 号 DDA](38-dda.md) 是「用扩散的两种姿势」：DDA 冻结一切、重画输入；本方法重画的是模型参数。DDA 便宜（13.5 s/图）且对数据流不敏感，本方法贵但能利用生成器的语义知识。
- 与 [40 号 SDA](40-sda.md) 共享「生成数据可以对齐域」的直觉，但 SDA 把适配提前到测试前（用条件扩散造带标签数据微调），本方法把适配放在每个测试样本上。
- 与 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md) 的联系在「用扩散损失做测试时优化」：那两篇优化的是采样轨迹/低秩适配器以满足测量一致性，本方法优化的是分类器以最大化图像似然；若把类别条件换成测量一致性，就是医学逆问题里的 DPS 一族（[DPS 相关笔记](../mri/20-dds.md)）。
- 与 [06 号 LDM](../diffusion/06-ldm.md) 的架构视角：本方法本质是把「判别编码器 + 生成解码器」拼成自编码器，用重建（去噪）损失训练编码器。

## 8. 链接

- [arXiv:2311.16102（abs）](https://arxiv.org/abs/2311.16102)
- [arXiv HTML v2 全文](https://arxiv.org/html/2311.16102v2)
- [项目页（代码、结果、可视化）](https://diffusion-tta.github.io/)
- [官方代码 mihirp1998/Diffusion-TTA](https://github.com/mihirp1998/Diffusion-TTA)
- [依赖的 DiT 仓库 mihirp1998/DiT](https://github.com/mihirp1998/DiT)
- [DiT-XL/2 权重（dl.fbaipublicfiles.com）](https://dl.fbaipublicfiles.com/DiT/models/DiT-XL-2-256x256.pt)
- [推理走查记录](/pathology-atlas/learning/infer-diffusion-tta.html)
