# 37｜TENT：只用测试数据把 BN 的缩放平移调到低熵，测试时适配的原点

**论文**：Tent: Fully Test-Time Adaptation by Entropy Minimization，Dequan Wang、Evan Shelhamer、Shaoteng Liu、Bruno Olshausen、Trevor Darrell（UC Berkeley、Adobe Research）；ICLR 2021；arXiv:2006.10726（v1 2020-06-18，v3 2021-03-18）
**定位**：完全测试时适配（只有测试数据和模型参数）的奠基工作；不改训练、不加代理任务，直接最小化预测熵，只更新归一化层的统计量与通道仿射参数；是后面所有扩散驱动 TTA 论文（DDA、Diffusion-TTA、SDA）必须对比的非扩散基线
**精读核验**：2026-11-22 依 arXiv HTML v3 全文（§1–4、Table 1–3、Figure 1–5）逐节读过，会议信息按 ICLR 2021 记录（arXiv v3 即会议版）。官方代码 `DequanWang/tent` 同日核对：`cfgs/{source,norm,tent}.yaml`、`cifar10c.py`、`imagenetc.py`、`robustbench` 子模块三件套是真实实现。**本站做过推理走查**（小样本意义上其实是全量 CIFAR-10-C severity 5，但仍只是复跑仓库脚本、用作者权重，不是论文指标复现）：见 [推理走查记录](/pathology-atlas/learning/infer-tent.html)。论文本身数字全部为论文报告值。

## 原文摘要

> A model must adapt itself to generalize to new and different data during testing. In this setting of fully test-time adaptation the model has only the test data and its own parameters. We propose to adapt by test entropy minimization (tent): we optimize the model for confidence as measured by the entropy of its predictions. Our method estimates normalization statistics and optimizes channel-wise affine transformations to update online on each batch. Tent reduces generalization error for image classification on corrupted ImageNet and CIFAR-10/100 and reaches a new state-of-the-art error on ImageNet-C. Tent handles source-free domain adaptation on digit recognition from SVHN to MNIST/MNIST-M/USPS, on semantic segmentation from GTA to Cityscapes, and on the VisDA-C benchmark. These results are achieved in one epoch of test-time optimization without altering training.

*来源：arXiv:2006.10726v3 摘要（ICLR 2021 会议版）。*

## 中文摘要

> 模型必须在测试期间自我适配，才能泛化到新的、不同的数据上。在这种「完全测试时适配」设定里，模型只有测试数据和自己的参数。我们提出用测试熵最小化（tent）来适配：以预测熵衡量的置信度为目标优化模型。我们的方法估计归一化统计量，并优化通道级仿射变换，在每个 batch 上在线更新。Tent 降低了图像分类在带损坏的 ImageNet 与 CIFAR-10/100 上的泛化误差，并在 ImageNet-C 上取得新的最优误差。Tent 还能做无源域适配：SVHN 到 MNIST/MNIST-M/USPS 的数字识别、GTA 到 Cityscapes 的语义分割，以及 VisDA-C 基准。这些结果都只用一个 epoch 的测试时优化取得，且不改变训练过程。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**当分布偏移的主要破坏方式是「归一化统计量错位」时，你甚至不需要标签、不需要源数据，只要把 BN 的 γ、β 沿着降低预测熵的方向走一步，就能把精度拉回来一大截。**

三件值得读的事：

1. **把适配对象缩到最小**：文献里最直接的做法是更新全部参数 θ，但 θ 是源数据在测试时唯一的载体，而且是高维非线性的，测试时优化既不稳也不便宜。TENT 只动归一化层：统计量 μ、σ 由当前 batch 现估，仿射参数 γ、β（<1% 参数量）由熵梯度更新。训练过程完全不变，这也是它区别于 TTT（要先改训练、加自监督分支）的关键。
2. **熵这个目标为什么不是随便挑的**：Figure 2 在 CIFAR-100-C 上显示，损坏越重，损失与熵同步上升且有很强的秩相关；Figure 1 显示低熵预测对应更低错误率。也就是说，「置信度」在损坏场景里可以当弱监督用。同时作者明确指出单样本优化熵会退化成「把全部概率给最可能的类」，所以必须在一个 batch 上共享参数联合优化。
3. **它的适用边界恰好是后续扩散 TTA 的出发点**：TENT 的更新是累积的、依赖 batch 的组成与顺序。DDA 论文（本组 38 号）在联合目标设定里直接给出 TENT 在 batch=1/64、类别有序、多损坏混合时崩到 2.2/0.4/0.1% 这类数字；Diffusion-TTA（39 号）的 Table 2 里 TENT 在 ConvNeXt-T 上把 ImageNet-C 从 16.4 拉到 2.7。**同一套熵目标，在不同骨干上可以从「+9.5」变成「−13.7」**，这是读这篇时最该记住的事实。

**关于「为什么它是这一组的基线」（本页判断）**：DDA/SDA 的卖点是「改输入不改模型」，Diffusion-TTA 的卖点是「同时改模型与生成器」；两者都要回答「相对纯熵最小化多赚了什么」。理解 TENT 只利用了归一化统计量这一点，就能理解为什么它在 batch 变小、类序相关时失效——那些情形下 μ、σ 的估计本身就有偏，而熵目标会把这个偏差放大成自信的错误。

## 2. 问题及研究位置

设定：源模型 f_θ 在源数据 (xˢ,yˢ) 上训练完毕，测试时只拿到无标签的目标数据 xᵗ，没有源数据、没有标签、不能停掉推理。Table 1 把这套设定与微调、域适配、测试时训练（TTT）摆在一起：只有 fully TTA 的「训练损失」一栏是空的。

已有位置：

- **测试时归一化（BN / AdaBN 一类）**：只重估 μ、σ，不学任何参数。它证明了「统计量错位」是损坏下的一大部分损失来源，但没有目标函数，也就无法进一步利用置信度。
- **TTT**：训练时联合优化监督损失与自监督代理损失，测试时只优化代理损失。有效，但必须事先改训练，且代理任务与主任务可能相互干扰。
- **伪标签（PL）**：按置信度阈值造标签再监督微调，属于 fully TTA，但要调阈值、且在高损坏下伪标签本身很脏。
- **本文**：目标函数直接定义在任务输出上（熵），优化变量只取归一化仿射参数，因此不需要源数据、不需要改训练、每张测试图只多一次反传。

## 3. 核心方法和数据流

```text
初始化：收集源模型每个归一化层 l、每个通道 k 的 γ_{l,k}, β_{l,k} 作为可学参数，
        其余 θ 全部冻结；丢弃源数据的 μ_{l,k}, σ_{l,k}
对每个测试 batch {xᵗ}：
    前向：逐层用当前 batch 估计 μ_{l,k}, σ_{l,k}，再算 x' = γ_{l,k}·(x−μ)/σ + β_{l,k}
    损失：H(ŷ) = −Σ_c p(ŷ_c) log p(ŷ_c)，在 batch 内取平均
    反向：γ ← γ − η∇_γ H，β ← β − η∇_β H      # 只更新仿射参数
    输出：本 batch 的预测（在线设定下，更新只影响下一个 batch）
```

四个要点：

1. **顺序很关键**：一次前向里「先估统计量、再做仿射」；参数更新发生在反向，所以对当前 batch 的预测没有帮助，除非重跑前向。作者选择默认不重跑，理由是每点只多一次梯度的计算量。
2. **超参几乎照抄训练**：ImageNet 用 SGD+momentum、BS=64、LR=2.5e-4；其余数据集用 Adam、BS=128、LR=1e-3；batch 缩小多少，学习率同比缩小多少。
3. **离线 vs 在线**：在线是「边来边更新、不回头」；离线是先在整个测试集上更新若干 epoch 再统一推理。离线数字更好（ImageNet-C 42.3 vs 44.0 误差），代价是要多过一遍数据。
4. **可适配的前提**：模型必须已训练好、输出概率、可微，且含有可复用的归一化层。这是一个不小的结构假设——没有 BN/LN 的骨干需要另找调制位置。

## 4. 论文证据与实验范围

**CIFAR-10/100-C（Table 2，最高 severity 的平均误差 %）**：

| 方法 | 需要的源/目标数据 | C10-C | C100-C |
|---|---|---|---|
| Source | 仅源 | 40.8 | 67.2 |
| RG（对抗域适配） | 源+目标 | 18.3 | 38.9 |
| UDA-SS（自监督域适配） | 源+目标 | 16.7 | 47.0 |
| TTT | 源（训练改过）+目标 | 17.5 | 45.0 |
| BN（测试时归一化） | 仅目标 | 17.3 | 42.6 |
| PL（伪标签） | 仅目标 | 15.7 | 41.2 |
| **Tent** | 仅目标 | **14.3** | **37.3** |

**ImageNet-C（§4.1，误差 %）**：Tent 在线 44.0、离线 42.3；测试时归一化 49.9（相对改进 18%）；稳健训练路线 ANT 50.2、AugMix 51.7、ANT+SIN 47.4。作者强调「只多一次梯度、不改训练、不用外部图像」。

**范围限制（本页判断）**：全部是分类（外加数字识别与 GTA→Cityscapes 分割）；损坏是 Hendrycks 的 15 种合成损坏；没有医学影像、没有 3D、没有检测/分割的定量主表；熵目标的收益依赖「模型对自己的错误仍然自信」这一前提，遇到系统性分布外样本（ImageNet-A/R 这类）论文没有给出对应主表，而后来的 Diffusion-TTA Table 1 显示 TENT 在 ImageNet-A 上几乎不涨（ResNet-18 +0.6→−0.8）。

## 5. 复现与审计重点

**本站的推理走查（小样本性质：只做一个 benchmark 的一个 severity）**：在 gpu04 上按仓库 README 跑 CIFAR-10-C，severity 5、15 种损坏各 10000 张，权重为 robustbench 的 Standard（WRN-28-10），代码零改动。结果（error %，15 种平均）：

| cfg | 本机 | 仓库 README | 差 |
|---|---|---|---|
| source | 43.52 | 43.5 | +0.02 |
| norm（测试时 BN） | 20.43 | 20.4 | +0.03 |
| tent | 18.59 | 18.6 | −0.01 |

逐损坏类型与 README 表吻合到 ±0.1 个百分点。**但这组数字不能和论文 Table 2 的 14.3 直接比**：论文用 R-26 骨干、离线适配；我们用的是 robustbench WRN-28-10、逐损坏在线适配，source 基线本身就差 2.7 个百分点（43.52 vs 40.8）。能对上的是仓库自己的表，这说明脚本与权重可复现，而不是论文主表可复现。

**审计要点**：

- **收益的绝大部分来自 BN**：40.8/43.5 → 17.3/20.4，熵最小化只再降约 1.8 个百分点。任何声称「熵目标很关键」的论述都应该先扣掉这一项。
- **崩溃模式**：DDA 论文 Table 3 里 TENT 在类别有序 + 小 batch 下掉到个位数，Diffusion-TTA Table 2 里 ConvNeXt-T 从 16.4 掉到 2.7。复现时必须报告 batch 组成与顺序，否则数字不可比。
- **学习率与 batch 绑定**：论文按「batch 缩小多少、LR 同比例缩小」处理，换骨干或换数据规模时这条规则是否仍成立需要重调；我们的 CIFAR 复现用的是 cfg 文件里的固定值，未做任何调参。
- **仓库依赖**：robustbench v0.1 + autoattack 需要手动装，torch 版本要够新（我们升到 2.1.2）；`SAVE_DIR` 与 `CORRUPTION.SEVERITY` 通过命令行覆盖，cfgs 默认跑 5 个 severity，想对齐 README 需显式收窄到 `[5]`。

## 6. 建议阅读顺序

摘要 → §2 Table 1（设定边界）→ §3.1 熵目标与「为什么不能单样本优化」→ §3.2 归一化+仿射两步 → §3.3 算法与「更新只影响下一个 batch」→ §4.1 Table 2 → Figure 2（熵与损坏程度的关系）→ Figure 5（逐损坏类型）→ §4.2 数字与分割的定性结果 → 附录 A 的损坏样例。

## 7. 前后关联

- 与 [38 号 DDA](38-dda.md) 是正面对照：DDA 不碰模型、只把输入推回源域，因此在「小 batch、有序、混合损坏」这些 TENT 的软肋上反而更稳；DDA 论文的 Table 3 就是拿 TENT 当反例。
- 与 [39 号 Diffusion-TTA](39-diffusion-tta.md)：同样是测试时改模型，但把监督信号从「自己的熵」换成「扩散模型的条件似然」，并用生成器提供额外知识；Table 1/2 里 TENT 在多个骨干上掉点，是这篇最直接的动机之一。
- 与 [40 号 SDA](40-sda.md)：SDA 干脆不在测试时更新权重，而是提前把源模型微调到合成域，彻底绕开 TENT 对数据流的敏感性（Table 9 的 12 种数据流设定）。
- 与 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md) 同属「测试时适配」谱系，但那两篇适配的是扩散采样器/LoRA，不是分类头的归一化层；TENT 给出了这条谱系里最便宜的一档。
- 与 [23 号 LPN 偏移与不确定性](23-lpn-shift-uq.md) 互补：那篇关心「如何检测偏移」，TENT 关心「检测到之后如何用一个无标签目标把性能拉回来」。

## 8. 链接

- [arXiv:2006.10726（abs）](https://arxiv.org/abs/2006.10726)
- [arXiv HTML v3 全文](https://arxiv.org/html/2006.10726v3)
- [官方代码 DequanWang/tent](https://github.com/DequanWang/tent)
- [robustbench（Standard WRN-28-10 权重来源）](https://github.com/RobustBench/robustbench)
- [推理走查记录](/pathology-atlas/learning/infer-tent.html)
