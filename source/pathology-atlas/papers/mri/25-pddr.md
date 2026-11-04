# 25｜PDDR：把时空扩散先验分段搬进心脏 cine 的变分重建

**论文**：Piecewise Dynamic Diffusion Regularization for Reconstruction of Cardiac Cine MRI，arXiv:2607.03299v1（eess.IV，2026-07-03）
**定位**：心脏 cine MRI、时空扩散先验、分段变分正则、长实时序列、免训练重建（推理期只做优化）
**精读核验**：依据 arXiv v1 全文的摘要、§3 方法与 §4 实验（Table 1–3、Fig. 1–2）、附录 A 整理（2026-11-04）；官方实现 `MLI-lab/pddr` 已核对 README 与目录说明。代码仓库 README 称该文在 MICCAI 2026 报告，arXiv 页面本身未标注录用信息。尚未进行复现实验。

## 原文摘要

> Real-time cardiac cine MRI enables visualization of the beating heart during free breathing, but severe undersampling and motion make reconstruction highly challenging. A central challenge for reconstruction is incorporating powerful priors of cardiac anatomy while remaining computationally efficient. We propose Piecewise Dynamic Diffusion Regularization (PDDR), a reconstruction method that integrates a spatiotemporal diffusion model as a generative prior within a variational reconstruction framework for cine MRI. The model employs dedicated spatial layers to encode anatomical structure and temporal layers to capture cardiac motion learned from gated cine data. PDDR leverages the dynamic prior in a piecewise manner, enabling the efficient use of spatiotemporal diffusion models for processing of long real-time sequences. Experiments on retrospectively accelerated and prospective real-time cine MRI demonstrate that PDDR outperforms classical, unsupervised, and diffusion-based methods, delivering high-quality reconstructions with substantially reduced computation time compared to state-of-the-art baselines. These results highlight PDDR as a practical and scalable solution for free-breathing, real-time cardiac MRI.

*来源：arXiv:2607.03299v1；逐字原文，未改写、未压缩。*

## 中文摘要

> 实时心脏 cine MRI 使得在自由呼吸状态下可视化跳动的心脏成为可能，但严重的欠采样与运动使重建极具挑战。重建的一个核心难题在于：既要引入强有力的心脏解剖先验，又要保持计算高效。我们提出分段动态扩散正则（PDDR），一种把时空扩散模型作为生成先验、嵌入 cine MRI 变分重建框架的方法。该模型使用专门的空间层编码解剖结构，使用时间层捕捉从门控 cine 数据中学到的心脏运动。PDDR 以分段方式利用这一动态先验，使得时空扩散模型能够被高效地用于处理长实时序列。在回顾式加速与前瞻式实时 cine MRI 上的实验表明，PDDR 优于经典方法、无监督方法与基于扩散的方法，在相比当前最佳基线显著减少计算时间的同时给出高质量重建。这些结果说明 PDDR 是自由呼吸实时心脏 MRI 的一个实用且可扩展的方案。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

心脏实时 cine 的困难是双重的：每帧的测量极少，而帧与帧之间的运动又不是任意的（心跳有结构）。所以需要"时空先验"，而时空扩散模型的采样过程在高维视频上极贵——直接对上百帧跑 DPS，显存与时间都撑不住。

PDDR 的答案是把扩散先验从"采样器"降级成"正则项"，再把这个正则项**分段**施用：

1. **变分重建框架**：优化目标 = 数据一致性 + λ_t·去噪残差。扩散模型只作为去噪器出现在正则项里，不再需要从噪声出发跑完整反向轨迹。
2. **分段（piecewise）**：每次迭代只随机抽 K 个连续帧喂给扩散模型做正则，但数据一致性仍然覆盖整个视频。于是显存与单步开销跟"每帧多大一块"挂钩，不跟"视频多长"挂钩。
3. **时空可分离网络**：空间层学解剖、时间层学搏动，时间层还能跳过——可以只用空间部分预训练，再放开时间层。

值得读的理由：它把"扩散先验能不能用在实际长度的实时序列上"这个问题正面回答了，而且是用非常工程化的方式（同一份先验，换重建框架，显存从 41.6GB 降到 11.4GB、时间从 972.5s 降到 124.5s）。局限也同样明确：只有心脏、只有 2D+time，而且分块毕竟是近似——块边界处的时序一致性没有被显式建模。

## 2. 问题及研究位置

重建对象是复值视频：对帧 i、线圈 j，y_{i,j} = M·F·S_j·x_i + ε。实时采集不门控、不分箱，每帧可用测量极少；作者指出实时 cine 实际上无法获得足够时空分辨率的全采样参考，因此有监督训练缺少真值来源。

已有路线的位置：

- **无监督/免训练**：L+S（低秩+稀疏）、FMLP、T-DIP。它们按扫描自适应，但每次重建都要单独拟合，耗时以千秒计，且不携带学到的先验。
- **扩散采样**：DPS 直接在后验上采样，质量好但显存与时间随序列长度急剧上升；dSTDM 用 x-t / y-t 平面上的 2D 扩散先验，缺少直接的 x-y 图像先验，SSIM 明显偏低。
- **本文**：把扩散先验放进变分（RED 式）框架，用块级随机正则把成本与序列长度解耦。

论文自己给出的对照很关键：PDDR 与 DPS 用的是**同一个**时空扩散模型，差别只在重建框架——所以两者的差距能直接读成"采样器 vs 变分正则"的差距。

## 3. 核心方法和数据流

```text
预训练：门控 CMRxRecon cine（5840 条序列 / 420 名受试者），T = 1000 步
        网络 = 可分离时空 U-Net：ST 残差块 = 2D 空间卷积 + 1D 时间卷积，输出按可学习权重
        （sigmoid）加权求和；时间层可跳过 ⇒ 先只训空间层
重建（对整段视频 x，N 步梯度优化）：
  for step = 1 … N:
      t ~ U{1,…,T}                              # 每个优化步随机取一个扩散步
      从视频中随机取 K 个连续帧组成的块，位置随机
      加噪：x_block,t = √ᾱ_t·x_block + √(1−ᾱ_t)·ε
      正则项：λ_t · ‖ε − ε_θ(x_block,t, t)‖²      # 只作用在这 K 帧上
      数据一致性：对全部帧的测量残差 ‖y − A x‖²    # 覆盖整段视频
  输出：优化完成的整段视频
```

三个要点：

1. **正则的信号是"随机的全量估计"**：作者把分块正则解释成全视频正则信号的随机估计——每次只用一块，但块的位置随机，优化足够多步后等效于对整段序列施加先验；块大小 K 是显存 / 时间 / 正则强度的三向旋钮。
2. **时间步与迭代步绑定**：第 i 步的扩散时间取 t ∼ U{1,…,T}（RED-diff 式做法），λ_t 由 ELBO 权重给出，不需要另设噪声日程。
3. **网络可分离是为了省显存**：论文把 ST 残差块与朴素 3D 残差块做过对照，结论是显存显著更低，因此在同一块卡上能用更大的块 K，而更大的 K 又带来更好的性能——这是"架构选择服务重建框架"的直接例子。

## 4. 论文证据与实验范围

**回顾式实验（Table 1，门控数据，12 倍加速）**：

| 方法 | PSNR | SSIM (%) | NMSE | VRAM (GB) | 时间 (s) |
|---|---|---|---|---|---|
| Zero-filled | 20.17 | 55.50 | 1.220 | 0.60 | 0.015 |
| L+S | 31.26 | 85.44 | 0.111 | 1.16 | 3.98 |
| FMLP | 29.55 | 67.45 | 0.481 | 6.67 | 868.9 |
| T-DIP | 29.73 | 70.70 | 0.346 | 2.53 | 445.5 |
| DPS（同一先验） | 32.78 | 87.78 | 0.069 | 16.27 | 419.0 |
| dSTDM | 31.30 | 79.59 | 0.130 | 12.20 | 79.21 |
| SDR（仅空间先验） | 28.21 | 79.13 | 0.240 | 4.66 | 14.77 |
| **PDDR** | **32.84** | **88.06** | 0.097 | 5.42 | 43.18 |

设置：CMRxRecon 2023/2024 公开 cine 数据（630 名健康受试者，3T，呼吸屏气 + ECG 门控，回顾分成 12 个心动相位、时间分辨率 50ms，空间分辨率 1.5×1.5mm²、层厚 8mm、10 线圈，ESPIRiT 敏感度由 BART 估计）；变密度 1D 高斯掩码，4–16 倍加速，无显式 ACS；160 条未见测试序列，5 组不同随机掩码取平均，配对 t 检验。

**非周期仿真（Table 2，12 倍加速）**：周期 / 心律不齐 / 物体运动三种情形下，PDDR 为 37.49 / 36.86 / 34.05 dB 与 94.63 / 93.91 / 91.24% SSIM；L+S 从周期的 39.23 dB 掉到 31.60 dB（运动情形），T-DIP 的 PSNR 在各情形都高于 PDDR（37.86 / 34.67）但 SSIM 显著更低；DPS 在运动情形比 PDDR 低 4dB 以上 PSNR、9% 以上 SSIM。作者给出的解释是：L+S 的低秩假设与 T-DIP 的周期假设在非周期下被破坏，而 PDDR 学的是运动分布本身。

**前瞻式实时（Table 3）**：PDDR SER 16.05 dB、TTV 31.4、VRAM 11.4 GB、124.5 s、15.0M 参数；作为对照，DPS 14.17 dB / 39.0 / 41.6 GB / 972.5 s，L+S 16.12 dB / 18.7 / 7.7 GB / 27.99 s，FMLP 3616 s、T-DIP 1982 s。SER 上 L+S 与 PDDR 基本持平（16.12 vs 16.05），PDDR 的优势体现在 TTV 与扩散类方法的对比上。

**范围限制**：心脏单解剖、2D+time；仿真非周期数据由公开门控数据插值合成，不是真实自由呼吸 + 心律不齐的配对数据；前瞻实验使用的是带掩码但无图像的 OCMR 类采集，评价指标是 SER/TTV 而不是 PSNR/SSIM。

## 5. 复现与审计重点

- **官方实现已核实**：`https://github.com/MLI-lab/pddr`（BSD-2-Clause，最近推送 2026-09-26）。`setup.sh <base_directory>` 建立数据/模型/结果目录、安装 Python 依赖并安装 BART 工具箱；数据需自行下载 CMRxRecon 2023、CMRxRecon 2024 与 OCMR，README 给了期望的目录结构与预处理说明（敏感度用 BART 估计，保存全采样门控 k 空间与 MVUE 图像；前瞻 OCMR 只存掩码与测量信息）。核查日期 2026-11-04。
- **两个外部依赖必须先通**：BART（预处理与敏感度）与 CMRxRecon 的 Synapse 下载（需注册、体量大）。这两步不通，仓库里任何脚本都跑不起来。
- **块大小 K 是显存的主要开关**：复现时先固定 K 与优化步数，再比较方法；不同 K 直接改变正则强度与显存，跨论文比数值时必须对齐。
- **随机性来源多**：每个优化步都会重抽时间步 t 与帧块位置，同一测量跑两次结果不完全一致；比较方法时要固定种子并多次取平均。
- **评价口径**：回顾式用 PSNR/SSIM/NMSE，前瞻式用 SER/TTV，两套指标不可混比较；论文自己对 L+S 的评价就是"SER 更好但 TTV 更差"。

## 6. 建议阅读顺序

摘要 → §1 引言的贡献三条（含 972s→124s 的显存/时间对比）→ §2.2 扩散基础 → §3.1 分段正则（Eq. 1 与块的定义）→ Fig. 1 → §3.2 可分离时空网络 → §4.1 Table 1 → §4.2 Table 2（非周期为何重要）→ §4.3 Table 3 → 附录 A.1（网络设计与消融）、A.4（超参）、A.5（分段消融）。

## 7. 前后关联

- 与 [FM Cardiac MRI](23-fm-cardiac-mri.md) 对照：同属心脏重建，但那边用视觉基础模型当先验 + LoRA 适配，这边用时空扩散先验 + 分段正则；一个解决"跨中心泛化"，一个解决"长序列可用性"。
- 与 [DDS](20-dds.md) 对照：DDS 也在"生成先验 + 物理一致性"之间做分工，但它在采样轨迹上做分解；PDDR 干脆不做采样，把先验变成可微正则项——两条路线对"扩散先验怎么用"给出了不同答案。
- 与 [UPMRI](22-upmri.md)、[MPFlow](18-mpflow.md) 对照：同属生成模型 + 逆问题，但都保留了完整的生成过程；PDDR 的分段是对高维序列的工程妥协，读的时候可以问：如果序列长度无限增长，这套框架的成本曲线是什么形状。
- 与 [CM-RED](14-cm-red.md) 对照：CM-RED 用一致性模型做 RED 迭代，本质也是"把生成模型塞进 RED"；差别在于 CM-RED 面向静态 MRI 的单步化，PDDR 面向视频的分块化。

## 8. 链接

- [arXiv 摘要](https://arxiv.org/abs/2607.03299)｜[HTML 正文](https://arxiv.org/html/2607.03299v1)｜[PDF](https://arxiv.org/pdf/2607.03299v1)
- 官方实现：[MLI-lab/pddr](https://github.com/MLI-lab/pddr)（BSD-2-Clause，最近推送 2026-09-26；已核实 README 引用本文，核查日期 2026-11-04）
