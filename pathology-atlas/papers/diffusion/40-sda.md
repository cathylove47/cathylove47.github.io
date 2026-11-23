# 40｜SDA：既然测试图会被扩散模型改写成「合成域」，那就先把源模型也微调到同一个合成域

**论文**：Everything to the Synthetic: Diffusion-driven Test-time Adaptation via Synthetic-Domain Alignment，Jiayi Guo、Junhao Zhao、Chaoqun Du、Yulin Wang、Chunjiang Ge、Zanlin Ni、Shiji Song、Humphrey Shi、Gao Huang（清华、SHI Labs @ Georgia Tech）；CVPR 2025（pp. 30503–30513）；arXiv:2406.04295（v1 2024-06-06，v2 2024-12-15）
**定位**：扩散驱动 TTA 的「模型侧对齐」；指出 DDA 一类方法的隐含问题是源模型与扩散合成域不匹配（源域→合成域的错误），提出先用条件扩散模型造带标签合成数据、再经同一个无条件扩散模型加噪去噪（Mix of Diffusion），把源模型微调到合成域，测试时再按 DDA 把目标数据也投影到合成域
**精读核验**：2026-11-22 依 arXiv HTML v2 全文（§1–5、Table 1–11、Figure 2–5）逐节读过，v2 与 CVPR 2025 版一致（CVF 正式版页码 30503–30513 经检索记录核对）。官方代码 `SHI-Labs/Diffusion-Driven-Test-Time-Adaptation-via-Synthetic-Domain-Alignment` 同日核对：`code/eval/test_ensemble.py` 与 `code/eval/configs/ensemble/convnextB.py` 是真实评测入口，README 指向官方 finetuned 权重。**本站做过推理走查**（小样本，用作者 finetuned 权重与配对合成数据，只走 eval-only 路径，非论文指标复现）：见 [推理走查记录](/pathology-atlas/learning/infer-sda.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Test-time adaptation (TTA) aims to improve the performance of source-domain pre-trained models on previously unseen, shifted target domains. Traditional TTA methods primarily adapt model weights based on target data streams, making model performance sensitive to the amount and order of target data. The recently proposed diffusion-driven TTA methods mitigate this by adapting model inputs instead of weights, where an unconditional diffusion model, trained on the source domain, transforms target-domain data into a synthetic domain that is expected to approximate the source domain. However, in this paper, we reveal that although the synthetic data in diffusion-driven TTA seems indistinguishable from the source data, it is unaligned with, or even markedly different from the latter for deep networks. To address this issue, we propose a **S**ynthetic-**D**omain **A**lignment (SDA) framework. Our key insight is to fine-tune the source model with synthetic data to ensure better alignment. Specifically, we first employ a conditional diffusion model to generate labeled samples, creating a synthetic dataset. Subsequently, we use the aforementioned unconditional diffusion model to add noise to and denoise each sample before fine-tuning. This Mix of Diffusion (MoD) process mitigates the potential domain misalignment between the conditional and unconditional models. Extensive experiments across classifiers, segmenters, and multimodal large language models (MLLMs, *e.g*., LLaVA) demonstrate that SDA achieves superior domain alignment and consistently outperforms existing diffusion-driven TTA methods. Our code is available at https://github.com/SHI-Labs/Diffusion-Driven-Test-Time-Adaptation-via-Synthetic-Domain-Alignment.

*来源：arXiv:2406.04295v2 摘要（CVPR 2025 版；原文以粗体标记 SDA 三词的首字母）。*

## 中文摘要

> 测试时适配（TTA）旨在提升源域预训练模型在先前未见、发生偏移的目标域上的性能。传统 TTA 方法主要基于目标数据流去适配模型权重，使模型性能对目标数据的数量与顺序敏感。近期提出的扩散驱动 TTA 方法改为适配模型输入而非权重，用一个在源域上训练的无条件扩散模型把目标域数据变换到一个「预期接近源域」的合成域。然而本文揭示：扩散驱动 TTA 中的合成数据虽然看起来与源数据难以区分，但对深度网络而言它与源数据并不对齐，甚至差异显著。为解决这个问题，我们提出**合成域对齐**（SDA）框架。核心思路是用合成数据微调源模型以保证更好的对齐。具体来说，我们先用一个条件扩散模型生成带标签样本，构成合成数据集；随后在微调前，用上述无条件扩散模型对每个样本加噪再去噪。这个「扩散混合」（MoD）过程缓解了条件扩散模型与无条件扩散模型之间潜在的域不对齐。在分类器、分割器与多模态大语言模型（MLLM，如 LLaVA）上的大量实验表明，SDA 取得了更好的域对齐，并一致优于现有扩散驱动 TTA 方法。代码见上方链接。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**DDA 的隐藏假设是「扩散模型重画出来的图 = 源域数据」，SDA 用一组实验说明这句话对网络不成立：把源图自己送进 DDA 流水线，源模型的精度会掉 18–22 个点；既然如此，不如反过来把源模型也迁到那个合成域去。**

三件值得读的事：

1. **它给出的诊断比方法更值钱**：Table 2 把「源图 → DDA 适配 → 源模型」这条链单独拎出来，在 t=500（TTA 的可用下限）时 Swin-B 61.6（官方 83.9）、ConvNeXt-B 65.1（官方 83.4）；t 越大掉得越多。而视觉上「看不出差别」（Figure 3b）。这是典型的「像素层面对齐、特征层面对不齐」，也解释了为什么 DDA 在低频全局损坏（雾、对比度）上要靠自集成退回原图。
2. **MoD 的两段式是有必要的**：只用条件扩散模型（DiT/EDM）生成的带标签数据微调，收益很小（Table 10：ResNet-50 29.7→30.4）；再把同一批数据过一遍**测试时用的那个无条件扩散模型**（加噪到 t* 再去噪），才跳到 32.5。原因是条件模型与无条件模型属于不同的合成子域，测试图落在后者，模型必须对齐后者。
3. **它把跨域问题改写成同域问题**：三阶段（源域预训练 → 源到合成微调 → 目标到合成适配）之后，测试时输入与模型都在同一个合成域里，剩下的只是域内分类。这个改写也解释了它对数据流不敏感（Table 9：12 种类别/域平衡设定平均 31.6，DDA 29.3，TENT 仅 4.2）。

**关于「代价与可迁移性」（本页判断）**：SDA 的增益（相对 DDA +2.5～2.9）是用「一次 50K 合成数据 + 15 epoch 微调 + 一整套条件扩散模型」换来的，而且条件扩散模型本身是在源数据上训练的——「源数据不可见」在信息层面是打了折的。医学影像里这意味着你需要一个能在本域生成带标签图像的扩散模型（病理上等于需要生成器同时会画对类别），成本远高于一个分类器；论文没有任何病灶保真度或幻觉评估。

## 2. 问题及研究位置

TTA 的两条路线（Table 1）：传统 TTA 是「源模型 → 目标域」的模型适配，怕数据流的量与顺序；扩散驱动 TTA 是「目标数据 → 源域」的数据适配，希望绕开这个问题。SDA 指出第二条路的方向标错了：目标数据实际被送到的是**无条件扩散模型的合成域**，不是源域。

已有位置：

- **数据适配**：DiffPure（加噪 150 步再反解，为对抗攻击设计）、DDA（结构引导 + 自集成）、GDA（更新的结构引导方法）。它们的源模型始终是原封不动的源域模型。
- **模型适配**：TENT、MEMO、CoTTA、NOTE、RoTTA 等，全部依赖目标数据流。
- **合成数据用于判别任务**：扩散生成数据做增广/预训练已有大量工作，但都需要改训练，且通常不针对「测试时输入已被扩散改写过」这一事实。
- **本文**：同时对齐模型与数据到同一个合成域，属于「第三条路」。

## 3. 核心方法和数据流

```text
阶段 1（源域预训练）：f ← 源数据 {xˢ, y}
阶段 2（源→合成 模型适配，MoD）：
    a. 条件生成：对每个类 y_i，用条件扩散模型 ε_η^c 从噪声生成 x_{0,c}^syn
       → 带标签合成集 {x_{0,c}^syn, y}（ImageNet 用 DiT，CIFAR-10 用 EDM，VOC 用 Dataset Diffusion）
    b. 无条件对齐：取测试时同一个无条件扩散模型 ε_θ^u，
       把 x_{0,c}^syn 加噪到 t*（t*≥500）得 x_{t*,c}^syn，
       再按 DDA 的结构引导反向去噪 → x_{0,u}^syn
    c. 微调：f' ← {x_{0,u}^syn, y}（ImageNet：50K 张、15 epoch；不同骨干只需生成一次）
阶段 3（目标→合成 数据适配）：测试图 x₀^trg 用 ε_θ^u 按 DDA 流程适配成 x_{0,u}^syn
输出：ŷ = argmax_y ( q(y|x₀^trg) + q'(y|x_{0,u}^syn) )   # 源模型 + 合成域模型的 logits 相加
```

四个要点：

1. **t\* 的选择沿用 DDA 的结论**：T=1000 时 t*≥500 才能消除域偏移；SDA 要求「造数据时的加噪水平」与「测试时适配的加噪水平」一致，否则模型对齐的仍是另一个子域。
2. **MoD 不是数据增广**：它的目的不是多样性，而是把条件模型的输出搬到无条件模型的输出分布上。Table 11 显示每类只给 1 张（N=1K）也能超过 DDA，说明模型主要学的是「合成域的统计特性」，而不是类知识。
3. **集成沿用 DDA**：最终预测是源模型看原图、合成域模型看适配图的 softmax 之和。注意这里两个模型不同（q 与 q'），与 DDA 的「同一模型看两张图」不一样。
4. **生成器按数据集换**：ImageNet 用 DiT（条件）+ ADM（无条件）；CIFAR-10 用 EDM + I-DDPM；VOC 用 Dataset Diffusion + FLUX Schnell；LLaVA 用同一套 ImageNet 合成数据做指令微调。这说明框架不绑定某个扩散模型，但也说明每个新域都要自备一套。

## 4. 论文证据与实验范围

**源–合成域不对齐（Table 2，ImageNet val，top-1 %）**：

| t | 500 | 600 | 700 | 800 | 900 | 1000 |
|---|---|---|---|---|---|---|
| Swin-B（源模型 × 合成数据，未对齐） | 61.6 | 57.8 | 55.7 | 52.6 | 45.0 | 38.5 |
| Swin-B（合成模型 × 合成数据，对齐） | 67.6 | 65.9 | 65.0 | 61.5 | 55.7 | 48.4 |
| ConvNeXt-B（未对齐） | 65.1 | 61.3 | 60.3 | 57.2 | 50.0 | 41.5 |
| ConvNeXt-B（对齐） | 70.6 | 68.2 | 67.4 | 64.9 | 58.5 | 50.7 |

**ImageNet-C severity 5，15 域平均（Table 3，%）**：

| 模型 | Source | MEMO | DiffPure | GDA | DDA | **SDA** |
|---|---|---|---|---|---|---|
| ResNet-50 | 18.7 | 24.7 | 16.8 | 31.8 | 29.7 | **32.5** |
| Swin-T | 33.5 | 29.5 | 24.8 | 42.2 | 40.0 | **42.5** |
| ConvNeXt-T | 39.3 | 37.8 | 28.8 | 44.8 | 44.2 | **47.0** |
| Swin-B | 40.5 | 37.0 | 28.9 | – | 44.5 | **47.4** |
| ConvNeXt-B | 45.6 | 45.8 | 32.7 | – | 49.4 | **51.9** |

**逐损坏（Table 4，ConvNeXt-B）**：SDA 在 14/15 个域上不低于 DDA，唯一低于 DDA 的是对比度（45.4 vs 48.1）；雾是少数靠对齐明显翻盘的域（44.6 vs 41.9）。DiffPure 在对比度上只有 3.0，说明「无结构引导的扩散改写」会摧毁全局对比信息。

**其他规模（Table 5–9）**：ImageNet-W 上 ConvNeXt-B 70.1→72.3；CIFAR-10-C + ResNet-18 平均 45.4（source）/65.3（DDA）/**72.4（SDA）**；PASCAL-VOC-C + DeepLabv3 mIoU 38.6→**39.8**（+1.2）；LLaVA-1.5-7b 四选一 ImageNet-C 平均 91.2（源数据微调）/91.2（DDA）/**93.6（SDA）**；UniTTA 12 种数据流设定平均 31.6。

**消融（Table 10/11）**：+条件生成 30.4、+无条件对齐 32.5（ResNet-50）；微调图像数 1K 31.9、10K 31.9、50K 32.5、100K 32.6。

**范围限制（本页判断）**：仍是 2D 自然图像（加一个分割与一个 MLLM）；所有「合成域」都由源域训练的扩散模型定义，所以合成域与源域的偏差有多大、偏差在语义上偏向什么，论文只给了 Grad-CAM 定性；没有测量「模型被迁到合成域后对罕见类/细粒度类是否更差」；15 epoch × 50K 的微调成本未与 DDA 的推理成本一起做总账。

## 5. 复现与审计重点

**本站的推理走查（小样本，eval-only）**：在 gpu04 上走官方「finetuned 权重 + ImageNet-C-Syn」评测路径，数据为 `gaussian_noise` severity 5 的 100 对（10 类 × 10 张，ImageNet-C 与 C-Syn 配对，配对相关系数 0.982、随机错配 0.077），骨干 ConvNeXt-B。结果：

| 设置 | top-1 | top-5 |
|---|---|---|
| 预训练模型 on ImageNet-C（source-only） | 36.0% | 70.0% |
| finetuned 模型 on C-Syn | 60.0% | 83.0% |
| **SDA（logits 相加集成）** | **52.0%** | 83.0% |

- **与论文的关系**：论文 Table 4 同一损坏（ConvNeXt-B，全 50000 张）Source 48.0 / DDA 59.9 / **SDA 60.3**；Table 3 的 15 域平均 Source 45.6 / DDA 49.4 / SDA 51.9。我们 100 张的 source 36.0 与 48.0 差得多（子集只覆盖 10 类，95% 区间约 ±9），SDA 52.0 也低于 60.3，属于小样本波动。
- **一个关键近似**：走查没有跑「目标图经无条件扩散适配」这一步，而是直接用官方发布的 **ImageNet-C-Syn 配对**当作「适配后的合成图」；因此 SDA 那一行的含义是「预训练模型看 C + finetuned 模型看 C-Syn」，与论文的三阶段流水线不完全等价，只能验证「对齐后的模型在合成域上明显更强」这一方向。
- **一个值得记的现象**：source 只有 36.0 时，集成（52.0）低于纯 finetuned（60.0）——与 DDA 走查里同一个现象一致：把弱模型的原图 logits 平均进来会拖后腿。这说明「集成」这一设计在源模型已崩的域上会失效，论文的 15 域平均掩盖了这种单域反向。
- **数据获取**：ImageNet-C 的 `noise.tar`（22.5 GB）用 `wget | tar -xz --wildcards gaussian_noise/5/*` 流式读取，收满 1608 张即停（落盘仅 64 MB）；C-Syn 从 Google Drive 下 5.15 GB 后只解 `gaussian_noise/5`（50000 张，654 MB）。清华云盘链接的 API 已 404。
- **改动**：代码零改动；但必须在 `code/eval/` 目录下运行（`custom_imports` 用的是裸模块名 `imagenet/evaluation`），并补装 `mmengine 0.10.7`（finetuned 权重的 pickle 引用它，否则 `torch.load` 直接 `ModuleNotFoundError`）。
- **没跑的**：SDA 的完整数据适配流水线（无条件扩散改目标图）、微调过程本身、其他 14 种损坏、其他骨干、CIFAR/VOC/LLaVA。
- **耗时**：100 张评测约 1.1 秒（91 task/s，batch=100）。

**审计要点**：SDA 的对照里 DDA 与 SDA 共享同一套目标适配，所以 +2.5 是干净的「模型侧对齐」增益；但「SDA vs Source +50」这种说法不能全记在对齐上——其中一大块来自「用合成数据多训了 15 个 epoch」。合成数据由源域扩散模型生成，源数据在信息意义上仍被使用，写「源无关」时应加限定。另外，MoD 的 t* 与测试适配的 t* 必须一致，论文附录给了具体值，复现前应逐项核对。

## 6. 建议阅读顺序

摘要 → §1 Table 1（三条路线的方向）→ §3.1 式 (4) 的 KL 单调性与 t*≥500 → §3.2 Table 2 与 Figure 3（诊断部分，最重要）→ §3.3 Figure 4 三阶段 → §3.4 MoD 两段式 → 式 (6)(7)(8) → §4.1 Table 3/4 → §4.2 Table 6–8（规模性）→ §4.4 Table 10/11（MoD 必要性与数据量）→ Figure 5 Grad-CAM。

## 7. 前后关联

- 与 [38 号 DDA](38-dda.md) 是直接继承：目标数据适配与集成都沿用 DDA，SDA 只加了「源→合成」的模型侧一步；Table 3/4 里 DDA 是主基线，也是解释「为什么需要对齐」的反例来源。
- 与 [39 号 Diffusion-TTA](39-diffusion-tta.md) 都想用生成模型弥补判别模型的不足，但 SDA 把生成模型用在**造训练数据**（离线、一次），Diffusion-TTA 用在**每个测试样本的似然**（在线、每样本 55 秒）。
- 与 [37 号 TENT](37-tent.md) 的对照落在数据流敏感性：SDA 完全不看测试数据流（Table 9），TENT 平均 4.2。
- 与 [06 号 LDM](../diffusion/06-ldm.md)、[07 号 DiT](../diffusion/07-dit.md) 是组件关系：DiT 提供 ImageNet 的条件生成，ADM 提供无条件对齐；[05 号 EDM](../diffusion/05-edm.md) 与 I-DDPM 是 CIFAR-10 那一套。
- 与医学相关的 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md) 共享「测试时把模型/采样器调到目标域」的思路，但 SDA 的「域」是生成模型定义的合成域，这在医学上等价于要求生成器先能画出各类病灶——目前没有证据支持。

## 8. 链接

- [arXiv:2406.04295（abs）](https://arxiv.org/abs/2406.04295)
- [arXiv HTML v2 全文](https://arxiv.org/html/2406.04295v2)
- [CVF Open Access 正式版](https://openaccess.thecvf.com/content/CVPR2025/html/Guo_Everything_to_the_Synthetic_Diffusion-driven_Test-time_Adaptation_via_Synthetic-Domain_Alignment_CVPR_2025_paper.html)
- [官方代码 SHI-Labs/SDA](https://github.com/SHI-Labs/Diffusion-Driven-Test-Time-Adaptation-via-Synthetic-Domain-Alignment)
- [ImageNet-C（Zenodo noise.tar）](https://zenodo.org/record/2235448)
- [推理走查记录](/pathology-atlas/learning/infer-sda.html)
