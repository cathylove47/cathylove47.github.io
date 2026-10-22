# 74｜DiffusionQC：只学干净 patch 的噪声预测误差，把伪影当分布外样本

**论文**：DiffusionQC: Artifact Detection in Histopathology via Diffusion Model；IEEE 正式版标题为 DiffusionQC: Artifact Detection and Quality Control in Histopathology Images via Diffusion Model。IEEE ISBI 2026，DOI [10.1109/ISBI61048.2026.11515418](https://doi.org/10.1109/ISBI61048.2026.11515418)，pp. 1–5（OpenAlex 记录出版日 2026-04-08）。预印本 arXiv:2601.12233 v1，2026-01-18。  
**定位**：WSI 质控中的**伪影检测**，输出像素级伪影热图/掩码；不修改图像，不生成新组织。  
**精读核验**：2026-10-22 核对 arXiv v1 全文（§1–4、Table 1、Fig. 1–4）、IEEE 题录与 OpenAlex 记录；IEEE Xplore 正文被反爬拦截，本文数值均取自 arXiv v1，正式版可能有措辞/排版差异；未运行模型、未下载权重。

## 原文摘要

> Digital pathology plays a vital role across modern medicine, offering critical insights for disease diagnosis, prognosis, and treatment. However, histopathology images often contain artifacts introduced during slide preparation and digitization. Detecting and excluding them is essential to ensure reliable downstream analysis. Traditional supervised models typically require large annotated datasets, which is resource-intensive and not generalizable to novel artifact types. To address this, we propose DiffusionQC, which detects artifacts as outliers among clean images using a diffusion model. It requires only a set of clean images for training rather than pixel-level artifact annotations and predefined artifact types. Furthermore, we introduce a contrastive learning module to explicitly enlarge the distribution separation between artifact and clean images, yielding an enhanced version of our method. Empirical results demonstrate superior performance to state-of-the-art and offer cross-stain generalization capacity, with significantly less data and annotations.

*来源：[arXiv v1 摘要页](https://arxiv.org/abs/2601.12233)，完整原文；正式版在 IEEE Xplore（同上 DOI），本次未取到可读全文。*

摘要说的是：传统监督模型要大量像素级标注，而且只认识预定义伪影类型；DiffusionQC 只用“干净图像”训练一个扩散模型，把伪影视为偏离干净分布的离群样本；再加一个对比学习模块把伪影和干净图像的潜变量推开，得到增强版。训练不需要像素级伪影标注，也不需要事先定义伪影类别。

## 1. 三分钟摘要与推荐理由

设想一张 WSI 里有一块折叠组织。折叠处的纹理和颜色都不属于“正常组织”的统计规律，但你又不想为每一种伪影都标一遍像素。DiffusionQC 的做法是：先让模型只看干净 patch，学会“正常组织加噪后应该怎样被去噪”；推理时给一张可疑 patch 加噪，再看模型预测的噪声和真实加入的噪声差多少。差得越大，这块越不像正常组织。

- **输入**：一张 1024×1024、10× 的 H&E patch（推理时滑窗遍历 WSI）。
- **输出**：与 patch 对应的二维误差热图，经阈值化后成为伪影掩码。
- **训练输入**：只有干净 patch；增强版额外给 400 张含伪影 patch 但不给逐像素标签。
- **不算什么**：它不修复伪影，也不判断伪影类型；输出的是“这里不正常”的信号。

推荐理由：它把“检测”从监督分割改成了一类分类（one-class）问题，和数据效率直接相关；误差热图又天然可以当作修复掩码的来源。这个“检测器输出掩码→修复器使用掩码”的串联是合理的研究切口，但本文没有验证，属于未测试设想。

## 2. 问题及研究位置

- **任务边界**：WSI 质控（QC）中的伪影识别。论文明确与“伪影修复”区分：修复需要改像素，检测只决定哪些区域应被排除或送修。
- **监督设定**：训练只需干净图像；增强版需要少量含伪影图像，但仍不需要像素级标注和类别标签。
- **与已有工作的差别**：GrandQC、HistoROI、AIRAQC 等走监督分割/分类，依赖大量标注且对未见伪影类型泛化有限；DiffusionQC 学干净分布，把偏离当异常。
- **与扩散 OOD 检测的关系**：论文引用 Linmans et al. 2024 的扩散 OOD 检测，但强调自己的场景是异质病理图像中的伪影，而修复类扩散工作默认已知伪影区域。
- **一个容易误读的点**：它仍需要“哪些 patch 是干净的”这一粗标注来构建训练池；不是完全无标注。论文自己把这点写成 “coarse delineations of artifact-free regions”。

## 3. 核心方法和数据流

```text
训练（basic）:
干净 patch x0 → 冻结 VAE 编码 z0 → 加噪到随机 t → ViT(LoRA) 预测噪声 ε
             → MSE(ε, εθ(zt,t))

训练（enhanced）:
同一干净 patch + 少量伪影 patch
  → VAE 编码 → 单层卷积 adaptor f_A
  → max(0, ||f_A(E(x)) − f_A(E(x'))||² − m)   (m = 1.2)
  → L = L_basic + 0.5 · L_con

推理:
任意 patch → VAE 编码 → 固定 t* = 800 加噪 → ViT 预测噪声
  → 逐像素误差 → 通道平均 → 1/8 分辨率误差图
  → 高斯平滑 → 自适应阈值（裁剪到 [v_min, v_max] 后 Otsu）
  → 形态学先闭后开 → 伪影掩码
```

**为什么固定 t* = 800**：不同噪声水平下误差尺度不同，固定一个时间步才能让不同图像的分数可比。论文说这是经验设定，没有给出选择曲线。

**为什么推理不先把整块误差平均**：若把全部位置的误差压成一个标量，就只能判断 patch 是否异常，无法定位。本文保留各位置的噪声预测误差，形成二维热图；这与训练时用 MSE 优化噪声预测并不矛盾。

**分辨率关系**：VAE 的 8× 下采样使潜空间一个像素对应原图 8×8 区域，所以误差图是原图的 1/8 分辨率，再上采样/平滑后得到像素级掩码。

**增强版的意图与原式矛盾（§2.2，Eq. 6）**：作者说要用单层卷积 adaptor 把干净与伪影的潜表示推开，并在距离低于 margin 时惩罚；但印出的公式是 $\max(0,d^2-m)$。若按最小化该式理解，它惩罚的是距离大于 margin，与文字描述方向相反。这里保留原式，不擅自改成 $\max(0,m-d^2)$；在没有作者实现可核对时，这是真实的复现歧义，不能声称该式已被证明实现了拉开距离。

**后处理的关键**：阈值不是全数据集一个固定值，而是每张 slide 内先把误差值限制到 [v_min, v_max] 再做 Otsu。v_min/v_max 按模型版本和染色模态调，在同一设定内跨 slide 固定。迁移到新扫描仪或染色分布时，应验证这两个界限能否沿用，而不是假定误差分数天然跨域可比。

## 4. 论文证据与实验范围

**数据**：TCGA 的 50 张 H&E WSI，覆盖乳腺、肺、宫颈、胃；伪影标注（记号笔、折叠、失焦、气泡）来自 AIRAQC。训练集 16 张 WSI，测试 24 张。干净训练 patch 为 63,000 张 1024×1024、10×；增强版另取 400 张含伪影 patch。

**WSI 数目存在多处矛盾**：正文 §3.2 写“50 张 WSI，其中 16 张训练、剩余 24 张测试”（16+24=40，不是 50）；结果段又写只用 14 张，而 Table 1 的训练资源列写 24 张。不能替作者补出缺少的切片用途，也不能直接选其中一个数作为确定的训练规模；复现须先核对 slide 清单。

**Table 1（作者报告，未复算）**：

| 方法 | 训练 WSI / 标签 | OOF | 记号笔 | 折叠 | 气泡 | 灵敏度 | 精确率 | F1 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| GrandQC | 420 / 像素级 | 0.838 | 0.970 | 0.729 | 0.884 | 0.882 | 0.671 | 0.762 |
| DiffusionQC basic | 24 / patch 级（按原表；正文另写 16/14） | 0.899 | 0.794 | 0.628 | 0.099 | 0.835 | 0.680 | 0.750 |
| DiffusionQC enhanced | 同上 + 400 伪影 patch | 0.953 | 0.866 | 0.723 | 0.026 | 0.897 | 0.697 | 0.784 |

**怎么读这张表**：

1. 增强版在失焦上明显更好（0.953 vs 0.838），记号笔和折叠接近 GrandQC，但**气泡检测从 basic 的 0.099 掉到 0.026**，而 GrandQC 是 0.884。这是明确的失败项，论文在讨论里也承认“仍难以处理气泡等细微伪影”。
2. 对比 GrandQC，增强版精确率从 0.671 到 0.697、F1 从 0.762 到 0.784；basic 自身的精确率为 0.680。训练标注粒度更粗是清楚的差别，但训练 WSI 数有 14/16/24 的文本冲突，不能据此精确计算样本效率倍数；结果也不是逐项领先。
3. 精确率被作者注明“普遍低估”，因为人工标注漏掉了组织外的记号笔，而算法会检出来。这个偏差对三种方法是同向的，但没有量化。
4. 论文只报灵敏度/精确率/F1，没有报像素级 Dice、IoU 或 AUROC。对“检测器能否当分割掩码用”这个问题，证据不足。

**跨染色**：增强版只在 H&E 上训练，直接用于内部 IHC 集；因为 IHC 没有真值标注，只给了 Fig. 4 的定性对比，没有数字。不能据此说跨染色定量泛化已成立。

**消融**：论文没有单独做“basic vs enhanced”的完整消融表；Table 1 的两行就是全部对比。对比学习模块的增益与 400 张伪影 patch 的贡献混在一起，无法分离。

## 5. 复现与审计重点

1. **代码**：arXiv 全文与公开搜索均未发现 DiffusionQC 的官方实现；公开搜索可见骨干 PixCell 的仓库与 PixCell-1024 权重入口，但本次未逐项打开核验。没有代码就不能把“可复现”写成既成事实。
2. **权重与依赖**：骨干是 PixCell-1024（LDM + ViT），Hugging Face 有 PixCell-1024 入口；VAE 冻结，ViT 用 LoRA 微调。PixCell 权重的许可、是否需要授权、以及 LoRA 配置论文未给全，复现前必须逐项核对。
3. **首个实验**：固定 PixCell-1024、同一批 24 张测试 slide、同一套 AIRAQC 标注，先复现 basic 版在 t*=800 的误差图，再扫 t* ∈ {200, 400, 600, 800, 1000} 看灵敏度/F1 曲线。论文没有给这条曲线，不能假设 800 最优。
4. **阈值审计**：per-slide Otsu + [v_min, v_max] 裁剪是性能的一部分。换扫描仪、换染色、换放大倍率都要重调；报告结果时必须写清 v_min/v_max 和每张 slide 的阈值分布，否则数字不可比。
5. **标签审计**：AIRAQC 标注是“可见伪影”的集合，不等于“所有伪影”。精确率被低估的说法成立，但需要按伪影类型分别报告，尤其是记号笔在组织外的部分。
6. **资源**：论文未给训练显存、时长或 GPU 型号；不要替作者补一个“最低显存”。PixCell-1024 的推理成本应按 1024² patch、滑窗数量和 ViT 前向次数实测。

**可检验的改进设想（均未验证）**：

- 用误差图直接生成修复掩码，接 LatentArtiFusion/RestorePath 类修复器，比较“检测器掩码”与“人工掩码”对修复指标的影响。
- 在增强版中加入伪影类型不可知的难例挖掘，专门针对气泡这类低对比伪影，而不是只加 margin。
- 报告 per-slide AUROC 和像素级 Dice，检验“检测分数高”是否等于“定位准”。

## 6. 建议阅读顺序

Fig. 2 框架图 → §2.1 式 (5) 的噪声 MSE → §2.1 推理的 t*=800 与逐像素误差 → §2.2 对比损失与 adaptor → §3 数据与后处理 → Table 1 的气泡失败项 → §4 局限。

## 7. 前后关联

- [Conditioning Noise](67-conditioning-noise.md)：同样把扩散噪声预测当检测信号，但那篇研究的是“条件是否必要”，可作为方法学对照。
- [无监督检测—定位—修复流水线](60-unsupervised-artifact-restoration.md)：把检测、定位、修复串成一条流程；DiffusionQC 只覆盖前两步。
- [ArtiFusion](55-artifusion.md)：检测之后如何修，看这篇的掩码引导 DDPM。
- [LatentArtiFusion](72-latentartifusion.md)：把修复搬进潜空间；与 DiffusionQC 组合时要注意两者都依赖 VAE 的 8× 分辨率。
- [RestorePath](49-restorepath.md)：百万像素级修复对掩码质量更敏感，检测器的定位误差会被放大。

## 8. 链接

- [arXiv 摘要与版本](https://arxiv.org/abs/2601.12233)
- [arXiv v1 全文（方法与 Table 1）](https://arxiv.org/html/2601.12233v1)
- [IEEE ISBI 2026 正式版 DOI](https://doi.org/10.1109/ISBI61048.2026.11515418)
- [PixCell 代码](https://github.com/cvlab-stonybrook/PixCell)
- [PixCell-1024 权重入口](https://huggingface.co/StonyBrook-CVLab/PixCell-1024)
