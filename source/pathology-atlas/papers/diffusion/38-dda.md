# 38｜DDA：不改模型改输入，用冻结的扩散模型把损坏图像「推回源域」

**论文**：Back to the Source: Diffusion-Driven Adaptation to Test-Time Corruption，Jin Gao、Jialing Zhang、Xihui Liu、Trevor Darrell、Evan Shelhamer、Dequan Wang（上海交大、港大、UC Berkeley、上海AI Lab、DeepMind）；CVPR 2023（pp. 11786–11796）；arXiv:2207.03442（v1 2022-07-07，v2 2023-06-21）
**定位**：扩散驱动的测试时**输入**适配；源域训练一个无条件扩散模型和一个分类器，测试时两者全部冻结，只用扩散前向加噪、反向去噪（带低通结构引导）把每个目标输入投影回源域，再与原始输入的预测做自集成
**精读核验**：2026-11-22 依 arXiv HTML v2 全文（§1–5、Table 1–5、Figure 1–5）逐节读过，v2 即 CVPR 2023 版。官方代码 `shiyegao/DDA` 同日核对：`image_adapt/scripts/image_sample.py`（扩散适配入口）、`model_adapt/test_ensemble.py`（集成评测）、`model_adapt/configs/_base_/datasets/imagenetc_ReCr2.py` 与 `ensemble/resnet50_ensemble_b64_imagenet.py` 是真实实现。**本站做过推理走查**（小样本，用作者权重与官方脚本，非论文指标复现）：见 [推理走查记录](/pathology-atlas/learning/infer-dda.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Test-time adaptation harnesses test inputs to improve the accuracy of a model trained on source data when tested on shifted target data. Most methods update the source *model* by (re-)training on each target domain. While re-training can help, it is sensitive to the amount and order of the data and the hyperparameters for optimization. We update the target *data* instead, and project all test inputs toward the source domain with a generative diffusion model. Our diffusion-driven adaptation (DDA) method shares its models for classification and generation across all domains, training both on source then freezing them for all targets, to avoid expensive domain-wise re-training. We augment diffusion with image guidance and classifier self-ensembling to automatically decide how much to adapt. Input adaptation by DDA is more robust than model adaptation across a variety of corruptions, models, and data regimes on the ImageNet-C benchmark. With its input-wise updates, DDA succeeds where model adaptation degrades on too little data (small batches), on dependent data (correlated orders), or on mixed data (multiple corruptions).

*来源：arXiv:2207.03442v2 摘要（CVPR 2023 版）。*

## 中文摘要

> 测试时适配利用测试输入，来提升一个在源数据上训练、却在发生偏移的目标数据上测试的模型的精度。多数方法是靠在每个目标域上（重新）训练来更新源**模型**。重训虽然有用，但它对数据的量与顺序、以及优化的超参数都很敏感。我们改为更新目标**数据**，用一个生成式扩散模型把所有测试输入投影向源域。我们的扩散驱动适配（DDA）方法在所有域之间共享同一个分类模型和同一个生成模型：两者都在源域上训练，之后对所有目标都冻结，从而避免昂贵的逐域重训。我们给扩散加上图像引导与分类器自集成，用来自动决定适配多少。在 ImageNet-C 基准上，跨多种损坏、模型与数据形态，DDA 的输入适配都比模型适配更稳健。凭借逐输入的更新方式，DDA 在模型适配会退化的场合仍然有效：数据太少（小 batch）、数据相关（顺序相关）、数据混合（多种损坏混在一起）。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**把「适配」从参数空间搬到像素空间——既然测试时改权重既贵又怕数据顺序，那就用一个源域扩散模型把每张损坏图像重画回源域，分类器一次都不用更新。**

三件值得读的事：

1. **两条正交的轴**：改什么（模型 vs 输入）、改多少（用不用这次更新）。论文用一张表把 MEMO/TENT（改模型）与 DiffPure/DDA（改输入）放进同一坐标系，然后用实验说明「改输入」在**小 batch、类别有序、多损坏混合**这三种现实数据形态下几乎不受影响，而 TENT 会崩。这组对比数字（Table 3）是整篇最有信息量的部分。
2. **结构引导是它和 DiffPure 的分水岭**：单纯加噪-去噪会丢类别信息。DDA 借 ILVR 的低通滤波 φ_D（D 倍下采样再上采样）在每一步反向中把生成样本的低频结构拉回参考图，得到式 (6) 的引导项；消融显示只做 forward+reverse、或只做 reverse+guidance 都远差于两者合起来（噪声损坏上 19.5/20.7 vs 48.7，ResNet-50）。
3. **自集成是「适配多少」的自动开关**：最终预测取 argmax ½(p_c + p^g_c)，即原图与适配图 softmax 的平均。对高频损坏（噪声、模糊、像素化）扩散适配收益大，对低频全局损坏（雾、对比度）扩散可能反而毁图，平均置信度让后一种情况自动退回原图。

**关于它在医学影像里的可迁移性（本页判断）**：DDA 的前提是「源域扩散模型能把目标损坏映回源域」，而它的源域是 ImageNet 自然图像、损坏是合成的。医学图像的真实偏移（不同扫描仪、低剂量噪声、金属伪影）不是这套 forward-reverse 的加性高斯通路，且医学数据上「重画一遍」意味着直接改动诊断内容——这篇没有任何病灶保真度评估，也不能作为「扩散修复在医学上安全」的证据。

## 2. 问题及研究位置

偏移来自损坏（corruption）、对抗攻击、仿真到现实的差异。主流应对是训练时或测试时更新模型：训练时更新怕「不知道测试时会遇到什么偏移」；源无关适配要逐目标重训；测试时适配（TENT、MEMO）边推理边更新，但对优化超参、数据量、数据顺序敏感，且逐目标累积更新会互相污染。

已有位置：

- **模型适配**：TENT（熵最小化 + BN 参数）、MEMO（单样本增强 + 熵最小化后重置）、BUFR（源无关离线特征直方图）。共同点是都要在目标数据上做优化。
- **输入适配**：DiffPure 用扩散做对抗防御（固定加噪到 t=150 再反解），是结构上最近的先行工作，但它为范数有界攻击设计，对自然损坏反而掉点（IN-C 平均 16.8%，比不适配的 18.7% 还低）。
- **本文**：同一个源域无条件扩散模型同时服务多目标；不做任何重训；把「适配多少」交给自集成决定。

## 3. 核心方法和数据流

```text
训练阶段（只在源域）：
    扩散模型 ε_θ ← 源图像（ADM 无条件 256×256）
    分类器 f     ← 源图像 + 标签
测试阶段（每个目标输入 x₀ 独立处理，两模型冻结）：
    # 1) 前向：加噪 N 步
    x_N ~ q(x_N | x₀)
    # 2) 反向：N 步去噪 + 低通结构引导
    for t = N … 1:
        x̂_{t−1} ~ p_θ(x_{t−1} | x_t)                  # 无条件扩散提议
        x̂₀ = (1/√ᾱ_t)·x_t − √(1/ᾱ_t − 1)·ε_θ(x_t, t)  # Tweedie 估计
        x_{t−1} = x̂_{t−1} − w·∇_{x_t}‖φ_D(x₀) − φ_D(x̂₀)‖₂
    # 3) 自集成
    ŷ = argmax_c ½ ( p_c(x₀) + p_c(x₀^g) )
```

四个要点：

1. **N 是核心权衡**：N 太小推不回源域，N 太大类别信息被噪声淹没。论文没有给闭式选择，而是靠结构引导把「保留类别」与「换域」解耦，再用自集成兜底。
2. **引导作用在 Tweedie 估计上而非 x_t 上**（式 5/6）：作者明确说这样避免与扩散更新本身冲突；实现时忽略 t 与 t−1 的差别，省一步反向。
3. **引导尺度 w 与滤波尺度 D**：D 决定保留多粗的结构（D 越大保留越少），w 决定引导强度；这两个量加上 N 构成全部适配超参，论文称跨数据集基本不调。
4. **计算代价**：每张图都要从零适配一次，无法在部署中摊销。Table 4（RTX 2080 Ti，ResNet-50，50000 张平均）：MEMO 0.7 s / 24.7%，DiffPure 31.7 s / 16.8%，DDA 13.5 s / 29.7%，DDA+DEIS 2.4 s / 27.0%。

## 4. 论文证据与实验范围

**ImageNet-C severity 5，逐损坏独立适配（Table 1，top-1 %）**：

| 模型 | 无适配 | MEMO | DiffPure | **DDA** |
|---|---|---|---|---|
| ResNet-50 | 18.7 | 24.7 | 16.8 | **29.7** |
| Swin-T | 33.1 | 29.5 | 24.8 | **40.0** |
| ConvNeXt-T | 39.3 | 37.8 | 28.8 | **44.2** |
| Swin-B | 40.5 | 37.0 | 28.9 | **44.5** |
| ConvNeXt-B | 45.6 | 45.8 | 32.7 | **49.4** |

**ImageNet-C̄（10 种与 IN-C 差异更大的损坏，Table 2）**：ResNet-50 25.8 → 29.4（DDA）vs 19.8（DiffPure）；Swin-T 44.2 → 43.8；ConvNeXt-T 47.2 → 46.3。作者自己承认在 C̄ 上「不提升，但避免了 DiffPure 那种大幅下跌」。

**联合目标（Table 3，ResNet-50，batch 1/64 两种）**：TENT 在「类别是否混合 × 损坏是否混合」四种组合下、batch 1/64 的精度分别为 2.2/0.4、1.6/0.5、3.0/7.6、2.3/3.9（最好的组合也只有 7.6）；DDA 恒为 29.7。BN 在联合设定下 10.3%（因为它把 15 种损坏的均值方差混在一起估计）。

**消融（Table 5，去掉自集成）**：弹性变换：forward+reverse 24.5、reverse+guidance 17.7、完整 32.3；高斯噪声：19.5 / 20.7 / 48.7。三步缺一不可，且不同损坏对「前向加噪」与「结构引导」的依赖程度不同。

**范围限制（本页判断）**：只做分类；源域是 ImageNet、损坏是合成 15 种；扩散模型是 ADM 256×256 无条件模型，容量有限；没有检测/分割主表；对「渐进式偏移」无能为力（模型冻结，无法随部署演化），作者在 Limitations 里明确写了这一点；另外扩散可能搬动的不只是域属性，还有内容，只能靠图像引导抑制。

## 5. 复现与审计重点

**本站的推理走查（小样本）**：在 gpu04 上用官方脚本跑 ImageNet-C 的 `gaussian_noise` severity 5，取 100 张（10 类 × 10 张，224×224），分类器 ResNet-50（mmcls 官方权重），扩散模型 ADM `256x256_diffusion_uncond.pt`。适配参数按 `image_adapt.sh`：D=4、N=50、scale=6、100 步 DDIM 重采样、单进程。结果：

| ensemble | top-1 | 含义 |
|---|---|---|
| first | 3.0% | 仅原图（source-only） |
| second | 61.0% | 仅扩散适配后的图 |
| sum | 57.0% | DDA 自集成（论文默认） |

- **与论文的关系**：论文 Table 1 的 18.7→29.7 是 15 种损坏的平均；我们只跑最难的 `gaussian_noise`（σ=0.38），ResNet-50 原图只剩 3.0%，与 Diffusion-TTA 论文 Table 2 里同一损坏的 6.3% 同一量级。适配后 61% 与 SDA 论文 Table 4 里同一损坏的 DDA=59.9（ConvNeXt-B）同量级。
- **一个值得记的现象**：source 极弱时，自集成（57.0%）反而低于纯适配（61.0%）——把接近随机的原图 logits 平均进来会拉低精度。论文的自集成是为「原图仍有部分可用信息」设计的，这个前提在 σ 最大的噪声损坏上不成立。
- **改动**：`model_adapt/configs/_base_/custom_imports.py` 注释掉 `model_adapt.rednet`（其依赖 cupy 在 py3.8 装不上，ResNet-50 路径不用 RedNet）；`imagenetc_ReCr2.py` 里写死 `corruption[1]=shot_noise`，用 `--cfg-options data.test.corruption=gaussian_noise` 覆盖而未改文件；单进程 `-n 1`。除这两处外代码零改动。
- **没跑的**：完整 ImageNet-C（15 种 × 50000 张）、ImageNet-C̄、其他骨干、联合目标设定、DEIS 加速；也没有跑论文的 Table 3 那种 batch/顺序敏感性实验。
- **耗时**：100 张适配约 11.5 分钟（25 个 batch × 100 步），三个 ensemble 各 <40 秒。

**审计要点**：适配质量完全取决于源域扩散模型与引导参数，复现前应确认 N/D/w 与论文附录一致（我们的 50/4/6 来自仓库脚本，未与附录逐项核对）；`scale` 与 `D` 的耦合很容易在换数据时失效；自集成的方向性（何时帮、何时拖）必须在报告里单独拆开，否则「DDA 优于 source」会被高估。

## 6. 建议阅读顺序

摘要 → §1 Figure 1（一对多投影）→ §3.2 式 (5)(6) 与结构引导 → Algorithm 1 → §3.3 自集成 → §4.2 Table 1 → Figure 3（逐损坏类型，看雾/对比度为何靠自集成兜底）→ §4.3 Table 3（TENT 崩溃对比）→ §4.4 Table 4（时延）与 Table 5（消融）→ §5 Limitations。

## 7. 前后关联

- 与 [37 号 TENT](37-tent.md) 是一组对照实验：同一个 ImageNet-C，一边改模型（对数据流敏感），一边改输入（逐样本独立）。Table 3 是这条对照最干净的数字。
- 与 [40 号 SDA](40-sda.md) 是直接上下游：SDA 沿用 DDA 的目标数据适配与自集成，只是额外把源模型微调到同一个合成域；SDA 的 Table 3/4 里 DDA 就是主基线（ConvNeXt-B 49.4，SDA 51.9）。
- 与 [39 号 Diffusion-TTA](39-diffusion-tta.md) 是「用扩散的两种方式」：DDA 用扩散重画输入，Diffusion-TTA 用扩散损失反传改分类器；前者冻结模型，后者同时改模型甚至改扩散模型。
- 与 [31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md) 的差别在「改什么」：那两篇用扩散先验重采样测量，DDA 用扩散先验重采样图像本身；如果把 DDA 搬到 MRI，等价于先做一次「扩散域翻译」再做重建/分类。
- 与 [25 号 ReSample](25-resample.md) 都依赖「扩散模型能投影回数据流形」，但 ReSample 投影的是潜变量以满足测量一致性，DDA 投影的是像素以换域。

## 8. 链接

- [arXiv:2207.03442（abs）](https://arxiv.org/abs/2207.03442)
- [arXiv HTML v2 全文](https://arxiv.org/html/2207.03442v2)
- [CVF Open Access 正式版](https://openaccess.thecvf.com/content/CVPR2023/html/Gao_Back_to_the_Source_Diffusion-Driven_Adaptation_To_Test-Time_Corruption_CVPR_2023_paper.html)
- [官方代码 shiyegao/DDA](https://github.com/shiyegao/DDA)
- [项目页](https://shiyegao.github.io/DDA/)
- [ADM 无条件 256×256 权重（guided-diffusion）](https://github.com/openai/guided-diffusion)
- [推理走查记录](/pathology-atlas/learning/infer-dda.html)
