# 65｜STREAM：不把 UNI 当条件，而是在 UNI 特征空间里直接生成

**论文**：STREAM: Stochastic Riemannian Flow Matching with Anisotropic Decoder for Digital Histopathology Image Generation；arXiv:2606.07036，首发 2026-06-05，v2 2026-10-05，最新 v3 2026-10-14；arXiv 与项目页标注 NeurIPS 2026 Spotlight。  
**定位**：归一化病理基础模型 token 空间上的黎曼流匹配；随机桥训练与各向异性解码器。不是图像修复。  
**精读核验**：2026-10-22 核对 v3 摘要、§3–4 方法、项目说明及官方训练/评价配置；未逐页核验全部附录证明，未运行模型。属于旧文近期修订与补漏入库，不是 10 月新首发。

## 原文摘要

> Synthetic histopathology image generation addresses patient-privacy concerns and the growing data demands of foundation models. Existing state-of-the-art histopathology generative models use pretrained Vision Foundation Models (VFMs) as conditioning signals. We show this yields conditioning-dominated diversity: on TCGA-BRCA, 62-75% of their output diversity is attributable to the conditioning signal rather than the learned latent space, while de novo synthesis still requires a VFM at inference. We instead use histopathology VFMs as the latent space itself: their patch tokens are $\ell_2$-normalized on the unit hypersphere $\mathcal{S}^{d-1}$ with strong angular dominance and intrinsic curvature, motivating a Riemannian formulation. We present STREAM, the first framework to apply Riemannian flow matching in the histopathology domain, in two stages: 1) a bridge-type stochastic perturbation that establishes per-token rectifiability on $\mathcal{S}^{d-1}$ for training a Diffusion Transformer, and 2) a novel decoder training design whose noise covariance is anisotropic in the left-singular basis of the per-token tangent-projected velocity-field Jacobian, spending a large robustness budget on its low-response directions and a small one on its high-response directions. Across TCGA-BRCA and TCGA-COADREAD, STREAM achieves state-of-the-art gFID and ranks first on nearly all histopathology-specific metrics as well. Code and a public gallery of generated images are available at https://chokevin8.github.io/STREAM-Patho/.

*来源：[arXiv v3 摘要页](https://arxiv.org/abs/2606.07036v3)，完整原文。*

## 1. 三分钟摘要与推荐理由

RestorePath、PixCell、ZoomLDM 的常见路径是：在 VAE latent 中生成，用病理基础模型特征引导。STREAM 改变了生成对象：直接学习 UNI patch token 的分布，再把生成 token 解码成图像。推理时不必先给一张参考图来提取条件。

它适合帮助理解“基础模型与扩散如何搭配”并没有唯一答案。方法的关键不只是更换编码器，还包括球面上的生成路径与适应生成误差的解码器训练。

## 2. 问题及研究位置

- 作者在 BRCA 的指定评价中估计 ZoomLDM/PixCell 的多样性中 75%/62% 与条件有关；这不是对所有数据、所有条件扩散模型的普遍定理，也不是证明条件没有价值。
- ℓ2 归一化使 token 位于单位球面，使用欧氏直线可能偏离目标几何；STREAM 采用球面测地线与黎曼流匹配。
- 能无条件合成新 patch，不等于支持组织位置受控的大图修复；不可与 BigCell 的 WSI 尺度能力直接混排。

## 3. 核心方法和数据流

```text
256² 健康组织 → 冻结 UNI → 256 个 1024 维 patch tokens → ℓ2 归一化
阶段一：球面均匀噪声 → SLERP 路径 + 切空间随机桥扰动 → 训练 DiT
阶段二：提取 DiT 速度场 Jacobian 的谱方向
       → 高响应方向小噪声、低响应方向大噪声 → 单独训练像素解码器
生成：球面噪声 → 黎曼 midpoint 积分 → 生成 UNI tokens → 解码为 H&E
```

随机桥与各向异性噪声是训练机制，不是推理时还需要额外输入的两种条件。论文还明确区分训练扰动路径与实际推理速度场，不能把局部理论保证扩展成整个学习模型的分布精确性证明。

## 4. 论文证据与实验范围

本文的可读重点是问题诊断与机制消融。以下来自 v3 Table 1–2 与官方配置，未复算：

| 证据 | 作者报告 | 适用范围 |
|---|---|---|
| 条件主导多样性估计 | ZoomLDM 75%，PixCell 62% | TCGA-BRCA、指定 Vendi/CVS 估计 |
| 良恶性线性 probe AUROC | UNI 0.995，PixCell VAE 0.640，ZoomLDM VAE 0.624 | SPIDER-breast，比较表征信息而非生成画质 |
| 官方生成配置 | 25 midpoint steps，50 次 DiT evaluation | 不可将 25 steps 写成 25 次网络前向 |
| 官方两阶段训练配置 | DiT global batch 1024/95k steps；decoder 512/90k | 是复现实验设置，不是最低资源需求 |

项目报告 BRCA、COADREAD 和 SPIDER-skin 的生成评价；本笔记没有逐表核对所有 gFID，不转录未核实的最优值。

## 5. 复现与审计重点

1. 公开仓库有 `stream.train_dit`、`extract_svd`、`train_decoder`、`evaluate`、特征提取与 matched index 流程；训练和评测入口可检查。
2. 项目页的 BRCA checkpoint 需联系作者获取，不能写成可匿名直接下载；UNI 本身也门控。代码公开不等于即时可运行已有权重。
3. 第一组实验应固定 UNI 表征与训练数据，比较欧氏/黎曼路径、是否随机桥、各向同性/各向异性 decoder；不要把不同 encoder 的收益计入几何机制。
4. 同时报告 rFID 与 gFID：解码重建上限与生成特征偏差应分开。特征 shard 必须与原图 matched index 对齐，不能重新随机排列。
5. 用户算力充足，不因多卡训练排除本方法；真正需要先解决的是权重访问、数据拆分、谱基提取与评价协议是否完整。

## 6. 建议阅读顺序

§3 Table 1 的多样性定义 → Fig. 1 的三段结构 → §4.1 生成 token 而非条件向量 → §4.2 随机桥 → §4.3 decoder → 仓库三阶段训练/评价流程；数学附录可在机制理解后再读。

## 7. 前后关联

- [RestorePath](49-restorepath.md)：基础模型作为条件，与作为生成空间的区别。
- [ZoomLDM](58-zoomldm.md)：本文直接分析的条件生成对照。
- [BigCell](64-bigcell.md)：条件网格大图生成，与无条件 token 分布建模的目标不同。
- [CytoSyn](66-cytosyn.md)：对比 representation alignment 与直接在基础模型空间中生成。

## 8. 链接

- [题录与三个版本日期](https://arxiv.org/abs/2606.07036)
- [v3 方法与表格](https://arxiv.org/html/2606.07036v3)
- [项目页与权重获取说明](https://chokevin8.github.io/STREAM-Patho/)
- [官方实现及配置](https://github.com/chokevin8/STREAM)
