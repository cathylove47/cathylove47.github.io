# 91｜SheafStain：把"patch 拼接不一致"写成层论问题，用 Schrödinger Bridge 修 H&E→IHC 虚拟染色

**论文**：SheafStain: Sheaf-Theoretic Schrödinger Bridge for Spatially and Biologically Coherent Virtual Staining；arXiv:2606.11846v2（v1 2026-06-10，v2 2026-09-30）；NeurIPS 2026 正式接收（官方 virtual 站 poster 页 155872）。
**定位**：虚拟染色（H&E → IHC）的**拼接一致性**专治方案。不是"生成更好看的染色图"，而是让相邻 patch 在重叠区给出可胶合的同一段输出。
**精读核验**：2026-10-25 读 arXiv v2 全文 HTML（§1–5 与附录 A–M）、Table 1–3、Table 8–9、附录 I（层论公理的经验验证）、附录 J（弱配对下的指标口径）、附录 K（延迟—质量 Pareto）；核对官方代码仓库与项目页可访问；未训练、未运行模型。

## 30 秒看懂

**一句话**：SheafStain 把"相邻 patch 拼不上"形式化成层论问题——同一个物理区域，VFM 在两次不同窗口里读出两种 token，重叠区因此永远对不齐。

**问题**：WSI 只能逐 patch 生成再拼回整图，重叠区对不上就是接缝、色调漂移、染色质错位；而 H&E–IHC 是弱配对，PSNR / SSIM 反而会奖励"糊成平均色"的解。

**瓶颈**：评测尺度是 1024²（16 块、24 条内部边界），不是整张 WSI；α 与各损失权重只在附录；六条基线全是自己重训，数字不能与原文表格直接比。

**insight**：不一致的根源不在生成器强弱，而在 VFM 的自注意力——同一个物理 token 在不同窗口里聚合了不同上下文。实测 stride 192 时重叠区两次读数平均余弦只有 0.63，把重叠率提到 86% 也只到 0.92。所以条件必须给"逐位置"的空间图而不是压成一个全局向量，一致性必须写进训练损失而不是靠后处理拼接。

## 3 分钟讲清

**方法（按顺序）**：
1. 每步采一个参考块与两个相邻目标块，要求三重交叠 $O_3$ 非空。
2. 冻结 VFM（默认 Prov-GigaPath）对参考块周围 5–16 个 224² 重叠块做一次前向：patch token 平均得空间条件图 $M\in\mathbb{R}^{d\times16\times16}$，CLS 平均得邻域向量 $c_n$。
3. $M$ 按 token 网格平移到相邻帧，保证 $O_3$ 上条件完全相同；$c_n$ 共享——这是"不用后处理修 VFM"的关键。
4. 三次共享权重生成器前向（UNSB 的 Schrödinger Bridge 框架 + ResNet 骨干），每层残差 $h'=h+W_{time}(e_t)+W_{spatial}(M\uparrow)+W_{cls}(c_n)$，后两项零初始化。
5. 损失：sheaf（重叠区通道均值差 + α·像素差，L1）+ cocycle（三重交叠两两施加）+ Fourier 边缘 + DAB 强度 + 跨染色 VFM 对齐，叠在基线的对抗与重建项上。
6. 推理：按 256² 窗口、stride 192 铺参考网格，用 FFT 中频能量的高低两端补采参考块，整图一次 VFM 前向给每块取 $(M,c_n)$，逐块生成后 soft-kernel 加权融合。

**作者证据在哪**：Table 3（BCI/HER2：FID 36.36 对 D-VST 87.31 / UNIStainNet 67.63，KID 4.21 对 29.30，TS 0.0146）、Table 2 左的逐项累加（UNSB 227.79 → 加条件 55.25 → +Pixel Sheaf 41.54 → +Cocycle 38.01 → 完整 36.36：一条条件注入拿走 80% 收益）、Table 2 右的下游 HER2 Low/High（AUROC 0.794，最强对手 0.737、UNSB 0.460）、附录 I 的经验验证（0.63 的胶合失败）、附录 K（单图约 18 s，VFM 占 90% 墙钟）。

**和上一代的区别**：起点是 UNSB，加一组层论正则——不改采样策略，改"条件里有没有邻域"与"损失里有没有相容性"；与 D-VST 的课程学习 + 频率采样是两条路；与 BigCell 的"速度按位置平均"是同一个拼接问题的两种解法；与 RestorePath 可对照拼接策略。

**讲 PPT 用这张**：Table 2 左的逐项累加（谁贡献最大一目了然）+ 附录 I 的 0.63；下游 AUROC 从 0.524 到 0.766 那格留着收尾。

## 1. 问题及研究位置

- **三类现有方法各自缺一环**：GAN 路线（pix2pix、CycleGAN、PSPStain、CC-WSI-Net）解决拼接靠专用模块（内容/色彩一致性、中心裁剪），不是通用机制；扩散路线（D-VST）用 DiT + 课程学习解耦色调，靠频率感知采样缓解马赛克；SB 路线（UNSB、PASB）把翻译看成两个分布之间的熵正则随机桥，但**没有把空间重叠的相容性写进目标**。
- **本文的起点是 UNSB**：因为它天然处理无配对翻译、且两个端点分布都已知（虚拟染色不是"从高斯噪声生成"，起点就是 H&E 分布）。这决定了它的定位不是"又一个扩散模型"，而是"给 UNSB 加一组层论正则"。
- **VFM 用法与既有工作的分歧**：多数虚拟染色工作把 VFM 嵌入压成一个全局向量做条件归一化（如 PASB/条件注入路线），本文反对这一点——全局向量抹掉了空间位置，而拼接不一致恰恰是**逐位置**的问题。

| 相邻工作 | 做法 | SheafStain 的差别 |
|---|---|---|
| UNSB（ICLR 2024） | 无配对 neural Schrödinger bridge | 直接继承其框架，加空间图 + CLS 双流条件与 sheaf/cocycle 损失 |
| D-VST（NeurIPS 2025） | DiT + 色调解耦课程 + 频率感知采样 | 不改采样策略，改"条件里有没有邻域"；仍把它当最强拼接对手，TS 领先 6–13% |
| CC-WSI-Net | 专设内容/色彩一致性模块、中心裁剪拼图 | 一致性写进训练目标（重叠区像素 + 通道均值 L1）＋推理时补丁选点 |
| 图上的 sheaf 网络（NSD/SHN/CSNN） | 用可学习 restriction map 缓解过平滑 | 首次把 sheaf 用于图像生成；restriction 在本文里是**位置索引**而非学出来的算子 |

## 2. 核心方法和数据流

```text
训练（每步）:
  采样参考块 P_ref 与两个相邻目标块 P_adj1, P_adj2，要求三重交叠 O3 非空
  → 冻结 VFM 对 P_ref 周围 K∈[5,16] 个 224² 重叠块做一次前向
     → patch token 位置映射 + 平均 → 空间条件图 M ∈ R^{d×16×16}
     → CLS token 平均     → 邻域向量 c_n ∈ R^d
  → M 按 token 网格平移到相邻帧（保证 O3 上条件完全相同），c_n 共享
  → 三次共享权重生成器前向（ResNet 骨干，SB 框架）
     每层残差: h' = h + W_time(e_t) + W_spatial(M↑) + W_cls(c_n)（后两者零初始化）
  → 损失: ℒ_sheaf（重叠区 通道均值差 + α·像素差，L1）
          ℒ_cocycle（三重交叠三对两两施加）
          Fourier 边缘损失 / DAB 强度损失 / 跨染色 VFM 对齐损失 + 基线对抗与重建项

推理:
  H&E 按 256² 窗口、stride 192 铺参考网格（相邻块天然重叠）
  → 在 FFT 中频能量图的高低两端补采参考块（细化开覆盖）
  → 对整图做一次 VFM 前向，按空间切片给每块取 (M, c_n)（即 ρ_{X,P_ref}）
  → 逐块生成 → soft-kernel 加权融合拼成 1024² 输出
```

**（a）两种"条件"各管一件事。** `M` 是**逐位置**空间图（16×16 网格，每格一个 embedding），管形态上下文；`c_n` 是邻域 CLS 平均，管生物/全局一致性。二者来自同一次 VFM 前向、同一批重叠块，所以天然自洽——这是"不用后处理修 VFM"的关键。

**（b）为什么用 SB 而不是 DDPM。** 附录 B：虚拟染色的两个端点分布都观测到了（H&E 与 IHC），桥可以直接连；扩散从高斯先验出发，UNSB 论文已指出这在无配对翻译里是限制。本文把自己定位成 "regularized SB"：sheaf 项是对桥路径的额外约束，不改变边缘分布保持性。

**（c）restriction map 是索引，不是学习到的算子。** 论文明确写 `ρ` 是位置索引（"restriction is positional indexing"），一步限制与经中间区域限制结果相同（最大差 0），因此构成 presheaf。这点很重要：**它借的是 sheaf 的"相容性判据"，不是 sheaf 神经网络的"学习 restriction map"**。反过来说，"generator 学到 inherent restriction maps"是行为层面的比喻，不是架构里真有一个 ρ 参数。

**（d）损失全是 ground-truth-free 的成对项。** `ℒ_sheaf = ‖μ(G_i|_O) − μ(G_j|_O)‖₁ + α‖G_i|_O − G_j|_O‖₁`，均值项治接缝色调、像素项治结构；cocycle 把两两相容扩展到三重交叠。因为比较的是"自己两次生成的结果"，不需要 GT——这正好绕开弱配对。

**（e）训练配置（§4.1）**：ResNet 生成器，Adam lr 2e-4、β=(0.5,0.999)，有效 batch 192（24×8 张 H200），400 epoch（200 固定 + 200 线性衰减），Prov-GigaPath 冻结。数据用 BCI 与 MIST 的原生 1024² 配对（BCI 官方 train/test + HER2 分级标签；MIST 官方 train/val，因为无 test）。

**（f）评测口径是本文最值得抄的部分。** 在 256² 上翻译、在拼好的 1024² 上评测（16 块、24 条内部边界），对手方法一律 4×4 行主序拼图。指标分四族：分布级（FID/KID）、全参考（LPIPS/DISTS/SSIM/PSNR）、拼接级（Tiling Score）、病理级（DAB-r、DAB-KL/JSD、mIOD、FOD）。下游还接了一步 HER2 Low/High 分类（BCI 上用 ResNet-50 分类器、在真测试集上评估）。

## 3. 论文证据与实验范围

**Table 3：1024² 拼接输出的主对比（摘关键列；HER2 在 BCI 与 MIST 都有，ER/PR/Ki-67 仅 MIST）**

| 数据集/染色 | 方法 | FID ↓ | KID×10³ ↓ | LPIPS ↓ | DISTS ↓ | TS ↓ | DAB-r ↑ |
|---|---|---|---|---|---|---|---|
| BCI / HER2 | UNSB | 227.79 | 236.23 | 0.6635 | 0.3347 | 0.1464 | 0.0589 |
| BCI / HER2 | D-VST | 87.31 | 62.77 | 0.5107 | 0.2570 | 0.0164 | 0.0736 |
| BCI / HER2 | UNIStainNet | 67.63 | 29.30 | **0.4577** | 0.2279 | 0.0448 | 0.1267 |
| BCI / HER2 | **SheafStain** | **36.36** | **4.21** | 0.4689 | **0.2132** | **0.0146** | 0.1209 |
| MIST / HER2 | UNSB / **Ours** | 57.96 / **34.51** | 20.53 / **2.24** | 0.5692 / **0.5196** | 0.2808 / **0.2056** | 0.1002 / **0.0292** | 0.0310 / **0.1187** |
| MIST / ER | UNSB / **Ours** | 49.23 / **29.08** | 16.05 / **2.50** | 0.5659 / **0.5042** | 0.2710 / **0.1934** | 0.0924 / **0.0292** | 0.0790 / **0.1248** |
| MIST / Ki-67 | UNSB / **Ours** | 38.20 / **25.40** | 10.18 / **3.92** | 0.5539 / **0.5269** | 0.2514 / **0.2124** | 0.0857 / **0.0261** | 0.0326 / **0.0493** |

作者口径：四个数据集-染色组合里 FID/KID/DISTS/TS 全胜，DAB-r 在 MIST 四格全胜；BCI HER2 的 LPIPS 输给 UNIStainNet 0.011、DAB-r 输 0.0058。KID 相对最强对手低 2.6–8.8 倍，FID 低 30–46%。

**Table 2 左：消融（BCI，逐项加）**

| 累加到 | FID | KID×10³ | LPIPS | TS | DAB-r |
|---|---|---|---|---|---|
| 基线 UNSB | 227.79 | 236.23 | 0.6635 | 0.1464 | 0.0589 |
| + 空间条件（M, c_n） | 55.25 | 16.58 | 0.5538 | 0.0143 | 0.0823 |
| + Pixel Sheaf | 41.54 | 6.83 | 0.5225 | 0.0131 | 0.1059 |
| + Cocycle | 38.01 | 4.61 | 0.5176 | 0.0132 | 0.1091 |
| + Fourier Edge | 36.53 | 5.16 | 0.4774 | 0.0145 | 0.1190 |
| + DAB Intensity | 37.09 | 4.16 | 0.4718 | 0.0144 | 0.1183 |
| + Cross-stain 对齐（完整） | **36.36** | 4.21 | **0.4689** | 0.0146 | **0.1209** |

读法：**一条条件注入拿走了 80% 的收益**（FID 227.8→55.2，TS 0.146→0.014）；sheaf 两项再把 FID 压到 38.0 并把 DAB-r 从 0.082 抬到 0.109；TS 在 pixel sheaf 之后基本饱和（0.0143→0.0131→0.0132），说明在 1024² 尺度上"两两重叠"已足够，cocycle 的边际收益主要体现在分布与生物指标上。最后两项（DAB 强度、跨染色对齐）lead 小且 FID 略回升（36.53→37.09），属于调参权衡而非单调改进。

**Table 2 右：下游 HER2 Low/High（真 BCI 测试集）**

| 方法 | Acc | F1 | AUROC |
|---|---|---|---|
| pix2pix | 0.660 | 0.774 | 0.626 |
| CycleGAN | 0.708 | 0.826 | 0.577 |
| PSPStain | 0.652 | 0.776 | 0.527 |
| D-VST | 0.658 | 0.761 | 0.650 |
| UNIStainNet | 0.724 | 0.835 | 0.737 |
| UNSB | 0.524 | 0.640 | 0.460 |
| **SheafStain** | **0.766** | **0.844** | **0.794** |

这是全文最强的一格：用虚拟染色图训练分类器、在**真 IHC 测试集**上评，AUROC 0.794 比最强对手高 0.057。指标不依赖外观一致性，而是"生成图有没有保住诊断特征"。

**算力/延迟（附录 K）**：单图约 18 s GPU 时间（Prov-GigaPath），换 Virchow2 约 13 s；VFM 前向占约 90% 墙钟。对手 Pix2pix 约 42 ms、D-VST（25 步 DPM-Solver++）约 82 s。也就是说 SheafStain 处在 Pareto 的"高质量端点"，代价是比经典 GAN 慢三个数量级、但比 D-VST 快约 4.7 倍。

**附录 I 的经验验证（值得单读）**：局部性成立（截面由 token 位置决定）；胶合失败（stride 192 平均余弦 0.63，86% 重叠也只 0.92）；H&E 与 IHC 上的缺口幅度差 <0.02，说明该现象与染色无关，是编码器的结构性问题。

## 4. 复现与审计重点

1. **代码可用性（2026-10-25 核对）**：官方仓库 `deepnoid-ai/SheafStain` 存在，项目页 `doodleima.github.io/SheafStain-Patho` 可访问；正文与 arXiv 都给了链接。这是本批 NeurIPS 2026 虚拟染色工作里唯一有实码可查的。
2. **指标口径要带着读**：弱配对下 PSNR/SSIM 会奖励"糊成平均"的解（附录 J 明说 pix2pix 在多数格子里 PSNR/SSIM 最高但 DAB-r 排第六）。引用本文结论时用 FID/KID/TS/DAB-r，别用 PSNR。
3. **对比全是自己重训的**：六个基线都用公开代码在其论文协议下重跑（同一批 256² patch 与官方切分），所以数字不能与原文表格直接对比，只能本文内部横比。
4. **评测尺度不是 WSI**：1024² = 16 个 256² 块、24 条内部边界。作者在限制里承认"比 WSI 小"，WSI 级定量评测列为后续工作。引用"WSI 拼接"时注意这一层落差。
5. **restriction map 的措辞别误读**：`ρ` 是位置索引（确定的、非学习的），"学习到 inherent restriction map"是行为描述。若你要把 sheaf Laplacian 显式写进损失，本文没这么做。
6. **可复现缺口**：α（mean 与 pixel 项的平衡）、各损失权重与课程表只在附录 E 给出，正文未列；推理时 FFT 高低能量端补采的块数与阈值在附录 G。这些是重实现时最先踩的坑。
7. **首个可做的实验**：在一对相邻 256² patch 上验证 context contamination——同一物理位置在两次不同窗口的 VFM 前向里余弦是否显著小于 1。不需要训练，一小时能做完，结论直接决定你要不要采用本文的条件注入方案。

## 5. 建议阅读顺序

Fig. 1（三种拼接失败长什么样）→ §3.2（层论形式化 + 0.63 那个数字）→ 附录 I（经验验证：局部性成立、胶合失败）→ §3.4（M 与 c_n 怎么来、怎么注入）→ §3.5 式(4)(5)（两个损失）→ Table 2 左（谁贡献最大）→ Table 3 → Table 2 右（下游分类）→ 附录 J（指标口径）→ 附录 K（延迟—质量 Pareto）→ Limitations。

## 6. 前后关联

- [STREAM](65-stream.md)：同为 NeurIPS 2026 病理生成工作，STREAM 生成基础模型特征，本文做跨染色翻译；对照看"生成什么"。
- [BigCell](64-bigcell.md)：千兆像素生成的另一条路（自适应滑窗 + 共享画布），与本文"重叠区相容性"是同一个拼接问题的两种解法。
- [HistDiT](62-histdit.md)：结构条件虚拟染色，本文的直接任务对手（方法族不同：DiT vs SB）。
- [RestorePath](49-restorepath.md)：同样要处理"局部生成拼回大图"，可对照其拼接策略。
- [PFM 综述](50-pfm-survey.md)：Prov-GigaPath 作为冻结 VFM 在这里的角色是"条件源"，不是分类器。

## 原文摘要

> Current virtual staining approaches offer the potential for time- and cost-efficient biomarker quantification in cancer diagnostics and prognostics. However, patch-wise inference for gigapixel whole-slide images (WSIs) fails to maintain spatial continuity, yielding artifacts that cause catastrophic mismatches with ground-truth images. Although pathology Vision Foundation Models (VFMs) offer rich representations, their self-attention causes varying global contexts to produce inconsistent embeddings for the same physical region. We formalize and validate this "context contamination" as a sheaf-theoretic problem where these embeddings form a presheaf whose sections disagree on overlaps, so no global section restricts to them. To address this, we propose SheafStain, a new approach that reinterprets VFM features as sheaf-like sections for spatially and biologically coherent virtual staining. Specifically, SheafStain integrates class and patch tokens into a Schrödinger Bridge framework as sheaf-like sections. While the class token anchors biological consistency, patch tokens form a per-position spatial map. An encoder co-pretrained on Hematoxylin & Eosin (H&E) and Immunohistochemistry (IHC) yields cross-stain sections, so a single VFM feature space supervises both input conditioning and output stain alignment. Departing from prior work that evaluates on isolated $256\times256$ patches and either random-crops or resizes the $1024\times1024$ ground truth, we translate at $256\times256$ and evaluate on the stitched $1024\times1024$ outputs across HER2, ER, PR, and Ki-67. SheafStain demonstrates promising results against six prior methods while mitigating patch-boundary stitching artifacts. Code is available at https://github.com/deepnoid-ai/SheafStain.

*来源：[arXiv v2 摘要页](https://arxiv.org/abs/2606.11846v2)，与 NeurIPS poster 页摘要一致；保留源摘要的 TeX 写法。*

## 7. 链接

- [NeurIPS 2026 官方 poster 页](https://neurips.cc/virtual/2026/poster/155872)
- [arXiv abs（v2）](https://arxiv.org/abs/2606.11846v2) · [HTML 全文](https://arxiv.org/html/2606.11846v2)
- [官方代码](https://github.com/deepnoid-ai/SheafStain)
- [项目页](https://doodleima.github.io/SheafStain-Patho/)
- [OpenReview forum](https://openreview.net/forum?id=2DhyeIm0FC)
