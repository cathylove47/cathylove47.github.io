# 65｜STREAM：不把 UNI 当条件，而是在 UNI 特征空间里直接生成

**论文**：STREAM: Stochastic Riemannian Flow Matching with Anisotropic Decoder for Digital Histopathology Image Generation；arXiv:2606.07036，首发 2026-06-05，v2 2026-10-05，最新 v3 2026-10-14；NeurIPS 2026 接收已由官方论文展示页确认，Spotlight 标识来自 arXiv 与作者项目页。
**定位**：归一化病理基础模型 token 空间上的黎曼流匹配；随机桥训练与各向异性解码器。不是图像修复。  
**精读核验**：2026-10-22 核对 v3 主文 §3–6、Table 1–3 与 §6 方法消融表、项目说明及官方训练/评价配置；未逐页核验全部附录证明，未运行模型。属于旧文近期修订与补漏入库，不是 10 月新首发。

## 30 秒看懂

**一句话**：STREAM 不在 VAE latent 里画图再用 UNI 引导，而是直接在 UNI patch token 的单位球面上学生成分布。

**问题**：现有病理生成模型把 VFM 当条件。作者量化出在 BRCA 上 62–75% 的输出多样性其实来自条件信号本身，而且"从头合成"时推理链上仍必须挂一个 VFM。

**瓶颈**：ℓ2 归一化的 token 落在球面上，用欧氏直线插值会穿出球体；而生成 token 与真实 token 存在偏差，只解码干净特征的 decoder 会失效；权重还要联系作者、UNI 本身也门控。

**insight**：几何对上之后再谈生成。用 SLERP 走测地线，用两端为零的切空间随机桥扩大中间覆盖；解码端则用 DiT 速度场 Jacobian 的谱方向决定"哪些方向少加噪、哪些多加噪"——两件事一起做才有效。

## 3 分钟讲清

**方法（按顺序）**：
1. 256² 图块过冻结 UNI → 256 个 1024 维 token，ℓ2 归一化到单位球面。
2. 阶段一：球面均匀噪声 → SLERP 路径 + 随机桥扰动（$\sigma(t)=\sigma_{\max}\sin\pi t$，中间强、两端零）训 DiT；实现用归一化终点预测，损失 $\lVert\hat x_1-x_1\rVert^2/(1-t)^2$。
3. 阶段二：对训练好的 DiT 速度场 Jacobian 做 SVD，按左奇异方向分组：高响应方向加小噪声、低响应方向加大噪声。
4. 单独训 ViT-XL decoder 从带各向异性噪声的特征重建像素（L1 + LPIPS + 重编码余弦 + 对抗）。
5. 生成：25 个 midpoint 步沿球面方向积分 → 生成 UNI tokens → 解码回 H&E。

**作者证据在哪**：Table 1（条件主导多样性估计：ZoomLDM 75%、PixCell 62%）、Table 2（良恶性线性 probe：UNI 0.995 对 PixCell VAE 0.640 / ZoomLDM VAE 0.624，比较的是表征信息而非画质）、Table 3（BRCA gFID 6.16 对 ZoomLDM 7.43，COADREAD 7.68 对 8.09）、§6 消融（随机桥单独加不改善 gFID 9.07→9.37，两模块组合才到 6.86；注意是 45k decoder steps）。**重建**任务上它并不最优：COADREAD rFID 5.64，SVG 1.81。

**和上一代的区别**：与 ZoomLDM / PixCell 的"VAE latent 生成 + 特征条件"是两种角色分配；与 CytoSyn 的 REPA-E 表征对齐不同（对齐 ≠ 直接在特征空间生成）；与 BigCell 的条件网格目标也不同。

**讲 PPT 用这张**：Table 1（多样性归因）加 Table 3（生成质量），再单独一页讲"生成好 ≠ 重建好"——对做 WSI 修复的人，rFID 那一列才是相关的。

## 1. 问题及研究位置

- 作者在 BRCA 的指定评价中估计 ZoomLDM/PixCell 的多样性中 75%/62% 与条件有关；这不是对所有数据、所有条件扩散模型的普遍定理，也不是证明条件没有价值。
- ℓ2 归一化使 token 位于单位球面，使用欧氏直线可能偏离目标几何；STREAM 采用球面测地线与黎曼流匹配。
- 能无条件合成新 patch，不等于支持组织位置受控的大图修复；不可与 BigCell 的 WSI 尺度能力直接混排。

## 2. 核心方法和数据流

```text
256² 真实病理图块（包括肿瘤组织）→ 冻结 UNI → 256 个 1024 维 patch tokens → ℓ2 归一化
阶段一：球面均匀噪声 → SLERP 路径 + 切空间随机桥扰动 → 训练 DiT
阶段二：提取 DiT 速度场 Jacobian 的谱方向
       → 高响应方向小噪声、低响应方向大噪声 → 单独训练像素解码器
生成：球面噪声 → 黎曼 midpoint 积分 → 生成 UNI tokens → 解码为 H&E
```

随机桥与各向异性噪声是训练机制，不是推理时还需要额外输入的两种条件。论文还明确区分训练扰动路径与实际推理速度场，不能把局部理论保证扩展成整个学习模型的分布精确性证明。

### 为什么不是“把 UNI 向量送进扩散模型”就结束

先把 UNI token 理解为图像中各小区域的语义描述。常见方法把这些描述当作“画图要求”，另在 VAE latent 里生成；STREAM 直接学习这些描述本身怎么分布，最后再把描述解码为像素。**训练要真实图像来提特征；生成一张新图时，不必先提供参考图像。**

1. **球面是什么（§4.1）：** 每个 1024 维 token 都被归一化到长度为 1。两点在这个表面上移动，更自然的路径是球面弧线，而非穿过球内部的直线；SLERP 就是沿这条弧线插值。每张图有 256 个 token，网络还需学习它们之间的联系，并非独立生成 256 个互不相干的小区域。
2. **随机桥做什么（§4.2）：** 训练时在弧线路径上加入中间强、两端为零的切向扰动，强度为 $\sigma(t)=\sigma_{\max}\sin(\pi t)$。起点仍是球面噪声，终点仍是真实 UNI 特征；它在中间扩展训练覆盖范围，而不是把真实终点永久破坏。
3. **网络到底预测什么（§4.2，Eq. 5）：** 实现用归一化的终点预测，损失为 $\|\hat x_1-x_1\|^2/(1-t)^2$；不是简单在像素上做噪声 MSE。推理再用当前点到预测终点的球面方向构造速度，按 midpoint 积分推进。理论讨论的是桥扰动路径的性质，不能直接当成有限模型采样无偏的证明。
4. **为什么解码器还要训练（§4.3–4.4）：** 生成特征与训练时提取的真实特征会有偏差，只会解码干净特征的模型容易失效。作者用训练好的 DiT 的速度场 Jacobian 做 SVD，把方向按响应强弱分组：高响应方向少加噪，低响应方向多加噪。这里使用左奇异方向，不能误写成“找到输入误差最大的方向”。
5. **如何把特征变回图像（§4.4）：** ViT-XL decoder 从带各向异性噪声的特征重建像素，同时使用 L1、LPIPS、重新编码后的余弦约束与对抗损失。余弦项对齐的是干净目标特征，而非加噪输入；两种噪声机制都在训练期使用，生成时不额外扰动输出 token。

## 3. 论文证据与实验范围

先看“能否重建输入图”和“能否从噪声生成新图”两种不同任务。下面数字来自 v3 主文，均为作者报告，未复算。

| 证据 | 作者报告 | 适用范围 |
|---|---|---|
| Table 1，条件主导多样性估计 | ZoomLDM 75%，PixCell 62% | TCGA-BRCA、指定 Vendi/CVS 估计 |
| Table 2，良恶性线性 probe AUROC | UNI 0.995，PixCell VAE 0.640，ZoomLDM VAE 0.624 | SPIDER-breast，比较表征信息而非生成画质 |
| §4.2、§5.1，采样与评价 | 25 midpoint steps，50 次 DiT evaluation；50k 个生成样本 | 不可将 25 steps 写成 25 次网络前向，所有方法使用同一真实参考集合 |
| §5.1，两阶段训练 | DiT batch 1024/95k steps；decoder batch 512/90k；8×H200 | 作者实验配置，不是最低显存或硬件门槛 |

### 生成更好，并不等于修复或重建更好

Table 3 的所有方法固定 UNI 编码器。STREAM、RAE、SVG 直接在该特征空间生成，是检验几何机制更直接的对照；ZoomLDM/PixCell 使用特征条件与 VAE latent，REPA-E 使用表征对齐，模型角色并不相同。

| Table 3，生成任务 | BRCA gFID ↓ | COADREAD gFID ↓ |
|---|---:|---:|
| ZoomLDM | 7.43 | 8.09 |
| STREAM | 6.16 | 7.68 |
| RAE | 15.84 | 19.64 |
| SVG | 17.37 | 23.64 |

BRCA 使用 12.2M 个、COADREAD 使用 3.4M 个 20×、256² 图块。论文对 PixCell 还测试了不提供参考特征的生成场景，其极高 gFID 不能解释为“PixCell 在正常有条件生成下也同样差”。同时，病理编码器指标会改变排序：COADREAD 生成 FvD 为 RAE 91.74、STREAM 91.96，STREAM 并非所有指标第一。

在**重建任务**中，COADREAD rFID 为 STREAM 5.64、SVG 1.81、PixCell 2.58、ZoomLDM 4.12；STREAM 不是最优。对 WSI 修复研究，这一点尤其重要：无条件生成的分布质量，不能直接替代恢复既定输入组织的保真度。

### 两个设计是否分别有效

§6 的 BRCA 方法消融采用 **45k decoder steps**，不能与 Table 3 的完整 90k decoder 训练直接混比。原文该表 caption 为 Table 4，邻近正文互引出现 Table 5；这里按实验名称定位。

| 随机桥 | 解码器噪声 | rFID ↓ | gFID ↓ |
|---|---|---:|---:|
| 无 | 各向同性 | 6.51 | 9.07 |
| 无 | 各向异性 | 5.02 | 8.27 |
| 有 | 各向同性 | 6.51 | 9.37 |
| 有 | 各向异性 | 3.52 | 6.86 |

随机桥单独加入没有改善 gFID，两个模块组合才得到这里的最佳结果。应复现这组交互，而不是只对比“完整 STREAM”与一个不同编码器、不同训练预算的模型。

## 4. 复现与审计重点

1. 公开仓库有 `stream.train_dit`、`extract_svd`、`train_decoder`、`evaluate`、特征提取与 matched index 流程；训练和评测入口可检查。
2. 项目页的 BRCA checkpoint 需联系作者获取，不能写成可匿名直接下载；UNI 本身也门控。代码公开不等于即时可运行已有权重。
3. 第一组实验应固定 UNI 表征与训练数据，比较欧氏/黎曼路径、是否随机桥、各向同性/各向异性 decoder；不要把不同 encoder 的收益计入几何机制。
4. 同时报告 rFID 与 gFID：解码重建上限与生成特征偏差应分开。特征 shard 必须与原图 matched index 对齐，不能重新随机排列。
5. 用户算力充足，不因多卡训练排除本方法；真正需要先解决的是权重访问、数据拆分、谱基提取与评价协议是否完整。

## 5. 建议阅读顺序

§3 Table 1 的多样性定义 → Fig. 1 三段结构 → §4.1 生成 token 而非条件向量 → §4.2 随机桥与终点预测 → §4.3–4.4 decoder → §5 Table 3 区分生成与重建 → §6 两模块消融 → 仓库三阶段训练/评价流程；数学附录可在机制理解后再读。

## 6. 前后关联

- [RestorePath](49-restorepath.md)：基础模型作为条件，与作为生成空间的区别。
- [ZoomLDM](58-zoomldm.md)：本文直接分析的条件生成对照。
- [BigCell](64-bigcell.md)：条件网格大图生成，与无条件 token 分布建模的目标不同。
- [CytoSyn](66-cytosyn.md)：对比 representation alignment 与直接在基础模型空间中生成。

## 原文摘要

> Synthetic histopathology image generation addresses patient-privacy concerns and the growing data demands of foundation models. Existing state-of-the-art histopathology generative models use pretrained Vision Foundation Models (VFMs) as conditioning signals. We show this yields conditioning-dominated diversity: on TCGA-BRCA, 62-75% of their output diversity is attributable to the conditioning signal rather than the learned latent space, while de novo synthesis still requires a VFM at inference. We instead use histopathology VFMs as the latent space itself: their patch tokens are $\ell_2$-normalized on the unit hypersphere $\mathcal{S}^{d-1}$ with strong angular dominance and intrinsic curvature, motivating a Riemannian formulation. We present STREAM, the first framework to apply Riemannian flow matching in the histopathology domain, in two stages: 1) a bridge-type stochastic perturbation that establishes per-token rectifiability on $\mathcal{S}^{d-1}$ for training a Diffusion Transformer, and 2) a novel decoder training design whose noise covariance is anisotropic in the left-singular basis of the per-token tangent-projected velocity-field Jacobian, spending a large robustness budget on its low-response directions and a small one on its high-response directions. Across TCGA-BRCA and TCGA-COADREAD, STREAM achieves state-of-the-art gFID and ranks first on nearly all histopathology-specific metrics as well. Code and a public gallery of generated images are available at https://chokevin8.github.io/STREAM-Patho/.

*来源：[arXiv v3 摘要页](https://arxiv.org/abs/2606.07036v3)，完整原文。*

## 7. 链接

- [题录与三个版本日期](https://arxiv.org/abs/2606.07036)
- [v3 方法与表格](https://arxiv.org/html/2606.07036v3)
- [项目页与权重获取说明](https://chokevin8.github.io/STREAM-Patho/)
- [官方实现及配置](https://github.com/chokevin8/STREAM)
- [NeurIPS 2026 官方收录页](https://neurips.cc/virtual/2026/poster/149538)
