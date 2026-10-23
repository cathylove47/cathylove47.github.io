# 83｜CMD：把扩散模型当"残缺图像的填空器"，预训练出卷积病理表征

**论文**：Beyond ViT Tokens: Masked-Diffusion Pretrained Convolutional Pathology Foundation Model for Cell-Level Dense Prediction；arXiv:2605.08276v1，首发 2026-05-08；NeurIPS 2026 正式接收（NeurIPS 官方 virtual 站 poster 页 148943，关联 OpenReview forum `u0riwBjIls`，2026-12-10 悉尼 poster 场）。
**定位**：生成式**自监督预训练**——用 masked-diffusion 训练一个全卷积 ConvNeXt-UNet，再把骨干冻结成细胞级稠密预测的特征提取器。它不采样生成图像，也不做推理时的伪影修复。
**精读核验**：2026-10-22 核对 arXiv 题录、正文 §1–5、Appendix A–C，Table 1–7、B1–B3、C1，NeurIPS 官方 poster 页与项目链接状态；未下载权重、未运行模型。

## 原文摘要

> Cell-level dense prediction is central to computational pathology, but remains challenging due to fine-grained histological structures, strong domain shifts, and costly dense annotations. Existing ViT-based pathology foundation models rely on patch tokenization, which can disrupt spatial continuity and weaken local morphological details needed for cell-level prediction. To address this, we propose Masked-Diffusion Convolutional Foundation Models, termed ConvNeXt Masked-Diffusion (CMD), a self-supervised convolutional generative pretraining framework for dense pathology representation learning. CMD uses a fully convolutional ConvNeXt-UNet backbone, performs masked-diffusion pretraining in pixel space, and incorporates frozen pathology foundation model features through adaptive normalization. Experimental results demonstrate that CMD consistently outperforms existing ViT-based pathology foundation models and even surpasses state-of-the-art end-to-end segmentation methods while fine-tuning only a small number of task-specific parameters across multiple pathology dense prediction tasks. The advantage is particularly pronounced under limited annotation settings, where CMD exhibits stronger robustness and generalization ability. Our findings suggest that purely convolutional architectures can also serve as competitive pathology foundation models for cell-level dense prediction, achieving leading performance within the current ViT-dominated paradigm and providing a scalable, high-performance solution that better preserves histological structural priors for fine-grained pathology understanding.

*来源：[arXiv v1 摘要](https://arxiv.org/abs/2605.08276v1)；与 HTML 正文摘要逐字一致。*

## 1. 三分钟摘要与推荐理由

具体场景：你要在一张 H&E 图块里标出每个细胞核的边界。输入是 256×256 的 RGB 图块，输出是逐像素的细胞核掩码（cell-level dense prediction，稠密预测＝每个像素都要给标签，而不是整张图一个类别）。这一步做不准，后面的细胞计数、免疫细胞浸润、肿瘤微环境分析全都歪。

现成的病理基础模型（PFM，在大量无标注 patch 上预训练、可迁移到多种任务的通用编码器）大多是 ViT：把图像切成 16×16 的小块，每块压成一个 token。作者的问题是：**这种"先切块再注意力"的做法，在细胞尺度上会磨掉核边界和染色质纹理；那能不能换一种不切块的预训练方式，让模型自己学出细胞级的细节特征？**

CMD 的答案是：拿一个全卷积的 ConvNeXt-UNet，按"随机遮住一部分图块，再让网络把原图补回来"的方式训练（masked diffusion）。训练完成后**不做采样、不生成图像**，只把这个网络的解码器当成多尺度特征提取器冻结起来，后面接一个 700 万参数的小分割头。

一句话区别，避免混淆：**这是"用生成式目标学表征"，不是"用生成模型去修图/造图"。** 第 3 节（a）会讲清楚它为什么叫 diffusion 而非 DDPM。

## 2. 问题及研究位置

- **稠密预测难在三处**：细胞结构细小且形态多样、相邻核边界模糊、逐像素标注昂贵；再加上染色、扫描仪、机构带来的域偏移（§1）。
- **ViT 路线的结构性短板**：ViT PFM（UNI/UNI2、Virchow、Phikon、Prov-GigaPath、Hibou、CONCH 等，§2 列了约 20 个）以图像级/切片级语义为设计目标。16×16 patch token 化把 patch 内部形态、纹理、边界一起压掉——这些恰恰是像素级预测要用的信息（§1）。
- **卷积路线的空白**：CNN 有局部性和空间连续性先验，但没有像 MAE / iBOT / DINOv2 那样可扩展的预训练范式（§2）。
- **论文要回答的问题**：生成式建模能不能作为卷积病理骨干的自监督预训练配方？如果行，关键设计（骨干、表征空间、条件方式）分别贡献多少？

与三类相邻工作划清边界：

| 相邻工作 | 目标 | CMD 的差别 |
|---|---|---|
| MAE / iBOT（掩码图像建模） | 学 ViT 表征，遮固定高比例 patch | 遮多少由"时间步"控制，覆盖率连续可变（t=1…T） |
| DDPM（Ho et al. 2020） | 学一个可采样的生成链，加高斯噪声 | 前向过程换成结构遮挡，**不再对应合法的生成链**，只为造"难度递增的损坏" |
| Masked diffusion（Pan et al. 2023） | 把扩散重解释为时间条件重建 | CMD 把它搬到像素空间的卷积病理骨干上，并叠加 PFM 语义条件 |

## 3. 核心方法和数据流

```text
无标注病理 patch (512², HistAI 公开库, ~1.05M 张)
  → 转 256²：80% 随机裁 256²，20% 整图缩放
  → 采样 t∈[0,1000]，遮挡比例 r_t = t/(T+1)
     → 随机遮 ⌊r_t·N⌋ 个 8×8 小块（256² 输入 → 32×32 网格），广播到像素
  → ConvNeXt-UNet 输入 x_t、时间步 t、冻结 PFM 的图像级特征 z_pfm
     → adaLN-Zero 注入每个 ConvNeXt block
  → 输出 x̂_0，L1 重建损失
  ── 预训练结束，丢弃"采样"这件事 ──
  → 冻结骨干，取解码器多尺度特征（blocks [1,3,5,6,8,9]，t=50）
  → 轻量分割头（7.15M 或 21.21M）→ 细胞核/细胞掩码
```

**（a）"时间步"到底在控制什么。** 式(1)(2)(3)：`x_t = M(x_0, r_t)`，`r_t = t/(T+1)`；网络学 `x̂_0 = f_θ(x_t, t, z_pfm)`，损失 `L = E‖x_0 − x̂_0‖₁`（§3.3）。DDPM 里 t 越大噪声越强；这里 t 越大遮挡越多。附录 A 明说：这一步"去掉了前向过程必须是合法生成扩散链的要求"，但保留了表征学习的关键性质——从不同难度的损坏里恢复原始信号。所以**不要把它写成"扩散模型的去噪过程"，它没有可用的反向采样链**。

**（b）遮挡是随机的，不是语义的。** 附录 A：随机选 patch 遮，`m_t` 是 0/1 二值掩码，`x_t = m_t ⊙ x_0`。也就是说模型学的是"从可见上下文补出缺失组织"，而不是"按类别遮住细胞核"。

**（c）条件怎么进网络。** 冻结 PFM 对原图提一个图像级特征 `z_pfm`；`c = φ_t(t) + φ_z(z_pfm)` 相加成条件向量，再用 adaLN-Zero 注入每个 ConvNeXt block：`AdaLN(u,c) = γ(c)⊙LN(u) + β(c)`（式 4、5；adaLN＝用条件预测 LayerNorm 的缩放/平移，替代固定归一化参数）。主预训练用 **H0-mini**（§4.1.2），消融实验用 **UNI**（Table 3），两个都冻结。

**（d）骨干。** ConvNeXt-UNet：5 段下采样（256²→8²）+ 8×8 瓶颈（6 个 block，聚合全局组织上下文）+ 5 段镜像上采样；共 26 个 ConvNeXt block；block 内是 7×7 深度卷积 + LayerNorm + 逐点 MLP（扩展比 3）+ GELU + GRN + 残差；下采样用 pixel-unshuffle、上采样用 pixel-shuffle；跳连用 1×1 卷积压缩后拼接（Table B1）。两个规模：CMD-B（基础宽度 256，可训练 ~130.75M）、CMD-L（512，~516.71M）。

**（e）训练细节（§4.1.2）**：AdamW，lr 3e-5，无 weight decay，BF16 混合精度，EMA 0.9999，默认 80K steps，评测算 EMA 权重；mask patch 8（像素空间）或 4（VAE 潜空间，对应 8×8 网格）。

**（f）下游协议（§4.1.3、B.3）**：骨干完全冻结，只训分割头；输入统一 256×256；150 epochs，AdamW lr 1e-3，cosine，交叉熵 + Dice。轻头：多尺度特征先 1×1 投到 d=256，自顶向下上采样 + Mix-Conv 融合（7.15M）。重头：6 层特征拼成 4096 通道 → 3×3 卷积降到 512 → 四层卷积解码（21.21M）。

**（g）推理**：单次前向。没有采样、没有 test-time 优化。附录 C 专门对比了 TTT（测试时训练），见 §4。

## 4. 论文证据与实验范围

预训练数据：HistAI 公开 WSI 集（arXiv:2505.12120），正文说约 100 万张 512² patch，附录 Figure B1 给的两个数字是 55,000（方法开发）与 1,048,349（大规模实验），并声明与下游无重叠。下游五个细胞级数据集：CPM-15、CPM-17、Janowczyk、Kumar、TNBC（§4.1、Table 1–2 表头）。指标：Dice、BF1（边界 F1，衡量预测边界与真值边界的吻合）、Precision；括号内 95% 置信区间由 1000 次 bootstrap 重采样估计。

**四个设计消融（Table 1–3）**

| 消融 | 关键数字（均为作者报告，未复算） | 怎么读 |
|---|---|---|
| 骨干：DiT vs Attention U-Net vs ConvNeXt-UNet（Table 1） | CPM-15 Dice：44.39 / 53.68 / 50.19；CPM-15 BF1：19.65 / 19.31 / **33.66**；TNBC BF1：21.12 / 16.39 / **25.09** | ConvNeXt 赢在**边界**而非区域 Dice。作者用 BF1 论证骨干选择，但 Dice 上 Attention U-Net 更好，这个取舍要自己看 |
| 表征空间：像素 vs VAE 潜空间（Table 2） | CPM-15 Dice 63.25（像素）vs 50.19（潜空间）；TNBC 73.51 vs 53.23；CPM-17 BF1 73.45 vs 35.04 | 像素空间大幅领先，支持"VAE 压缩丢高频核边界"的假设；高分辨率 VAE 也没追上 |
| PFM 条件（Table 3） | CPM-15 Dice 55.17→**63.25**，BF1 43.52→56.03；TNBC 60.24→73.51 | 条件带来的是显著增益，说明 PFM 语义与掩码重建互补 |

读表提醒：Table 1 的三种骨干都在 VAE 潜空间里跑（表注写明"all use VAE representations and pathology foundation model conditioning"），所以 Table 1 的 ConvNeXt 行与 Table 2 的潜空间行数字相同（如 CPM-15 50.19）。**Table 1 只比较骨干，不比较表征空间**；像素空间的好处要看 Table 2。

**与 SOTA 的比较（Table 4，冻结骨干 + 分割头）**

| 方法 | CPM-15 Dice | CPM-17 Dice | TNBC Dice |
|---|---|---|---|
| ViT-Adapter（端到端） | 0.876 | 0.872 | 0.854 |
| TransUNet（端到端） | 0.809 | **0.897** | 0.843 |
| Hibou（ViT PFM，冻结） | 0.794 | 0.875 | 0.841 |
| CMD-L + 轻头（7.15M 可训） | 0.864 | 0.865 | 0.854 |
| CMD-L + 重头（21.21M 可训） | **0.889** | 0.880 | 0.854 |

摘要说"surpasses SOTA end-to-end"只在 CPM-15 成立（0.889 > 0.876）；CPM-17 上低于 TransUNet（0.880 < 0.897），TNBC 打平。**同时注意**：不做分割头、只做线性探针时 CMD-L 只有 0.676/0.841/0.807（Table 4），低于多数 ViT PFM——即"冻结特征可直接线性读出"这一条，CMD 并不占优，它的优势依赖后端 7–21M 的卷积头。

**少样本（Table 5，CPM-17 / TNBC，1/5/10-shot）**：CMD-L 可训练参数仅 7M（总 609M），CPM-17 为 0.769/0.811/0.820，TNBC 为 0.714/0.792/0.819；作为对比，冻结 UNI2-h 在 CPM-17 三个 shot 下都在 0.46–0.47，ViT-Adapter 需 364M 全量微调才到 0.714/0.812/0.819。这是论文最强的证据方向。

**规模行为（Table 6–7）**：80K steps 内延长预训练大体稳定或微升，但 CPM-15 在 30k 掉到 0.774（前后 20k/40k 为 0.858/0.859），说明曲线不单调；容量从 CMD-B（217M）到 CMD-L（602M）只换来约 +1.3 Dice（CPM-15 0.852→0.865）。

**与测试时训练对比（Table C1）**：CMD-L + 重头在 CPM-17 为 0.880，加 TTT 后 0.885，TNBC 0.854→0.861。作者用此说明"不用测试时优化也接近 TTT"。

**可视化（Fig. 3）**：ViT PFM 的 token 相似度图偏向粗粒度组织区域；CMD 的卷积特征 K-means（K=4）聚类更贴合单个细胞核。这是定性证据，不能替代定量。

## 5. 复现与审计重点

1. **公开实现未核实可用（截至 2026-10-22）**：NeurIPS poster 页给出的匿名项目页 `anonymous.4open.science/r/ConvNeXt-Masked-Diffusion-5BC6` 本次返回 `401 {"error":"not_connected"}`，无法浏览文件；未查到可访问的公开 GitHub 仓库或权重。复现需要先获取作者实现，或依据论文重实现，不能把“给出项目页”写成“代码已公开可运行”。
2. **数据可得**：预训练语料来自公开 HistAI 数据集，但要自己完成切片、筛选到 ~1M 张 512² patch，并保证与下游不重叠（论文只声明"严格确认无重叠"，未给重叠检测方法）。
3. **缺失的复现信息**：batch size、训练硬件（型号/卡数/时长）均未报告，因此无法从"80K steps × 1M patches"推算实际成本；下游各数据集的具体切分与图像数也未在正文给出（只给了输入分辨率）。
4. **损失口径含糊**：主文只说 L1；附录 A 式(9)又引入 SSIM 项与 λ₁、λ_s，但没给数值，也没说明主实验是否启用。重实现时先只做 L1，再单独验证 SSIM 项。
5. **参数口径不一致**：Table 4 写 CMD-L 冻结参数 602M，Appendix B1 写可训练参数 ~516.71M。引用时注明出处，别当成同一个数。
6. **首个可做的实验**：先在小语料（如 55K patch 子集）上复现 Table 2（像素 vs VAE 潜空间）与 Table 3（有无 PFM 条件）。这两项决定方法骨架，且只需线性探针，代价远低于全量预训练。
7. **不预设算力门槛**：论文未给硬件，不能因为"1M patch 预训练"就判定难以复现，也不能反过来宣称单卡可完成。

## 6. 建议阅读顺序

Fig. 1（三栏流程）→ §3.3 式(1)–(3)（时间步＝遮挡比例）→ Appendix A（为什么这不是 DDPM）→ §3.4 像素 vs 潜空间 → §3.5 PFM 条件 → Table 4/5 → Appendix B（超参与两个头）→ Appendix C（与 TTT 对比）。

## 7. 前后关联

- [CTransPath](07-ctranspath.md)、[PathDino](13-pathdino.md)、[Prov-GigaPath](32-prov-gigapath.md)：ViT 表征路线，用来对照"token 化是否真的伤细胞级细节"。
- [PFM 综述](50-pfm-survey.md)：把 CMD 放回病理基础模型的谱系里看它属于哪一支。
- [BigCell](64-bigcell.md)：同样是病理生成式建模，但目标是生成吉像素 WSI；对读能分清"生成用于表征"与"生成用于产出图像"。
- [Conditioning Noise](67-conditioning-noise.md)：讨论条件信号在扩散训练中的角色，可与本文 PFM 条件消融对照。
- [HistDiT](62-histdit.md)：结构条件扩散用于虚拟染色；同属"条件怎么注入"的问题。

## 8. 链接

- [题录与完整摘要](https://arxiv.org/abs/2605.08276)
- [方法与附录全文（HTML）](https://arxiv.org/html/2605.08276v1)
- [NeurIPS 2026 官方 poster 页（含 OpenReview 链接）](https://nips.cc/virtual/2026/poster/148943)
- [OpenReview forum](https://openreview.net/forum?id=u0riwBjIls)
- [论文给出的项目页（当前返回 401 not_connected，未能核验代码）](https://anonymous.4open.science/r/ConvNeXt-Masked-Diffusion-5BC6)
