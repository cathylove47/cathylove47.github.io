# 49｜RestorePath：用病理基础模型条件扩散做百万像素级伪影修复

**论文**：Patch-to-Global: Random Patch Diffusion for Globally Consistent Megapixel Artifact Inpainting in Whole Slide Images，MICCAI 2026（arXiv:2609.24116v1）  
**定位**：WSI 伪影修复、随机 patch 扩散 inpainting、PFM 条件与下游可靠性  
**精读核验**：依据 arXiv v1 的摘要、方法与版本记录整理（2026-09-25）；尚未进行复现实验。

## 原文摘要

> Although deep learning has advanced Whole Slide Image (WSI) Analysis, tissue artifacts like bubbles and folds often cause silent failures by concealing essential morphology. Current pathology image restoration methods are mostly restricted to small patches, struggling to maintain global structural coherence at a megapixel scale. We introduce RestorePath, a framework for globally consistent megapixel scale inpainting that reconstructs diagnostic structures in histological image to prevent incorrect high-confidence predictions and lower error rates. Our model utilizes a Latent Diffusion Model (LDM) conditioned on Pathology Foundation Model (PFM) embeddings, integrating Large Kernel Attention (LKA) to manage long-range dependencies during random patch diffusion. Enhanced by Distance-Weighted Interpolation (DWI) and an Adaptive Guidance Scale (AGS), RestorePath ensures structural consistency and fidelity by modulating information from surrounding patches. Evaluations across TCGA-BRCA, BACH, and Camelyon16 datasets for images ranging from 512 to 4608 pixels demonstrate state-of-the-art performance in maintaining histological consistency. RestorePath significantly improves downstream Computational Pathology (CP) tasks, outperforming both raw artifact images and the conventional Detect-and-Discard (D&D) approach. The code is available at https://github.com/PathfinderLab/RestorePath

*来源：arXiv:2609.24116；逐字原文，未改写、未压缩。*

## 1. 三分钟摘要与推荐理由

切片上的气泡、折叠、墨迹会遮住形态，让模型高置信度地给出错误答案（silent failure）。现有 QC 做法是 Detect-and-Discard：把可疑区域丢掉不管；但在“病灶只占极小面积”的场景里，丢掉就等于丢掉诊断证据。patch 级修复（Artifusion、ArtiDiffuser）又接不上跨 patch 的全局结构。

RestorePath 把这件事重新定义成**全局一致的百万像素级 inpainting**：以外科修复的方式，用周围健康组织的特征去填补伪影区，并把条件信号做成“检索 + 插值”，而不是让模型凭空生成。训练用 256×256 patch 与掩码，推理时在大图上随机采 patch、逐块去噪再拼回整图。

它和已有笔记的关系很直接：条件编码来自病理基础模型（实验用 UNI，评价用 CONCH），下游验证用的是 CLAM/TransMIL/ABMIL 这套 MIL 评估链路，正是本仓库主线模型的可靠性问题。

## 2. 问题及研究位置

论文给出的动机很硬：TCGA-BRCA 中 **63.7%** 的 WSI 至少含一处 megapixel 级伪影（Fig. 1），说明“patch 级修复足够”的假设不成立。作者把已有工作分成三类并指出缺口：

- QC 检测类（HistoQC、GrandQC）：只判废、不重建，needle-in-a-haystack 场景下会丢掉稀疏病灶。
- 病理扩散修复（Artifusion、ArtiDiffuser）：限于 patch 级，跨 patch 结构不连贯。
- 高分辨率生成（DiffInfinite、LRDM、ZoomLDM）：要么目标是合成新组织而非对齐原有组织，要么用 PFM 特征生成大图但没有做“与周围组织严格对齐”的 inpainting。

RestorePath 的位置：把「修复」的判据从「单块看起来像组织」改成「整图与周围健康区域结构一致」，并用距离加权插值（DWI）显式建模“从邻域借上下文”这件事。

## 3. 核心方法和数据流

```text
训练（H=256 patch，20×）
真实 WSI → 掩码来源：GrandQC + failure modes（气泡 / 折叠 / 墨迹 / 撕裂）
    → 只从无伪影区取 256×256 patch
    → VAE 隐空间：加噪隐 z_t、掩码隐 z_m、二值掩码 m
    → 条件 c = PFM embedding（实验用 UNI）
    → LDM U-Net：middle stage 与 decoder 首块用 Large Kernel Attention 替换 cross-attention
    → 预测噪声 ε_θ，MSE 监督（Eq. 1）

推理（512–4608 px 区域，随机 patch 扩散）
大图切 256×256 网格 → 每格取 PFM embedding y_(k,l)
    → 有效格集合 S = {(k,l) | r_(k,l) ≤ τ}，τ = 0.3
    → DWI 求条件 c_p = Σ w·y_(k,l) / Σ w，w = 1 / (‖中心−p‖₂^α + δ)，α = 2、δ = 1e-6（Eq. 2–3）
    → 随机采样位置 p → 逐 patch：AGS 由无伪影区的 Laplacian 方差定 s_base ∈ [2, 7]；
        该 patch 伪影占比 r_patch > k（k = 0.99）时 s_t = s_base，否则 s_t = 0（Eq. 4）
    → 分类器无关引导逐步去噪（Eq. 5）→ patch 拼接 → 修复后大图
```

关键设计点三条：

1. **LKA 换掉 cross-attention**：只在 U-Net middle stage 与 decoder 第一块替换——这两处正是“从压缩表征回到全局空间连贯性”的转场，用大核卷积分解扩大感受野而不付全局注意力的代价。
2. **DWI 解决“整块被盖住”**：即使采样到的 patch 全被伪影遮住，条件向量仍由邻域无伪影格的 embedding 加权得到，权重随距离按 α 次方衰减。
3. **AGS 区分“修复”与“生成”**：整块几乎全毁（r_patch > 0.99）时才施加条件引导；否则引导强度置 0，优先保留原始像素。s_base 由周围健康区的 Laplacian 方差映射到 [2, 7]，纹理越复杂的切片引导越强。

## 4. 论文证据与实验范围

- **修复质量（Table 1，作者报告）**：TCGA-BRCA 上 FID_C 29.66、Emb Sim 0.9317、LPIPS_M 0.4467，均优于 SDM（39.69 / 0.9103 / 0.4555）与 LaMa（117.54 / 0.7995 / 0.4492）；FID_C 用 CONCH 特征替代 Inception，Emb Sim 为 CONCH 特征余弦相似度。
- **指标并非全胜**：Camelyon16 与 BACH 的 LPIPS_M 上 LaMa 更好（0.3610 / 0.4199，对比 0.3754 / 0.4418）。作者解释为气泡可透出局部纹理，偏纹理的方法占优；RestorePath 的优势出现在伪影不透明、只能靠邻域推断时。
- **消融**：去掉 DWI 后 TCGA-BRCA FID_C 由 29.66 升到 110.48、Emb Sim 由 0.9317 降到 0.8225（退化最明显）；去掉 LKA 后 FID_C 升到 32.18、Emb Sim 降到 0.9258。
- **下游 MIL（Table 2，Camelyon16 小病灶 20 例）**：ABMIL 的 AUC 为 Origin 89.6 / Artifact 82.3 / D&D 70.8 / Restored 90.3；CLAM_MB 为 88.5 / 83.3 / 71.6 / 90.3。恢复后回到 Origin 的一个标准差内，D&D 因零填充掉幅最大。
- **下游分类（Table 3，BACH）**：ResNet50 准确率 86.2（Origin）→ 61.0（Artifact）→ 64.2（D&D）→ 75.5（Restored）；t-SNE 的 ARI 由 0.1256 回升到 0.3656（Origin 0.5822，Fig. 5）。
- **范围限制**：训练数据为 TCGA-BRCA（1105 例，884/221 划分）、Camelyon16、BACH，**每个数据集单独训练一套模型**；验证用的伪影多为合成掩码（failure modes / 气泡），真实扫描伪影的泛化未在摘要中给出。

## 5. 复现与审计重点

- 超参需逐个核对：H=256、τ=0.3、α=2、δ=1e-6、s∈[2,7]、k=0.99。τ 与 k 直接决定“哪些格可当上下文”和“何时不引导”，是最该做敏感性分析的旋钮。
- 训练 patch 只取自 GrandQC 判定的无伪影区域，掩码质量直接决定模型输入分布；应先单独评估掩码（GrandQC + failure modes）误差对修复结果的影响。
- FID_C 与 Emb Sim 都用 CONCH 特征，指标与条件编码器同源（同族病理基础模型）；这两个数不能当作独立的临床有效性证据，必须配合下游任务与人工判读。
- LPIPS 在 Camelyon16/BACH 上不如 LaMa，说明结论依赖伪影类型。复现时应按伪影类型（不透明墨迹/折叠 vs 透光气泡）分层报告，而不是只报平均。
- 修复产物是**生成出来的诊断结构**。用于下游或阅片时，必须同时保留原始伪影掩码与“此处为重建”的标注，避免把 inpainting 结果当作原始证据使用。
- 计算成本与可扩展性：论文正文 10 页 5 图（MICCAI 2026），报告了逐数据集训练；跨数据集统一模型、单张 WSI 的推理耗时与显存占用需要自行测量。

## 6. 建议阅读顺序

`Abstract` → `Fig. 1`（63.7% 伪影统计与分布）→ `Fig. 3`（训练/推理总览）→ `2.1 Training`（LKA 位置与损失）→ `2.2 Inference`（Eq. 2–5：DWI 与 AGS）→ `3.1 Datasets and implementation details` → `Table 1` 与 w/o LKA / w/o DWI 两行 → `Table 2`、`Table 3` 与作者在 3.2 末尾对 LPIPS 差异的解释。

## 7. 前后关联

- 与 [CLAM](29-clam.md) 对照：同样的弱监督链路与注意力热图，这篇把它用作“修复是否让注意力回到病灶”的判据（Fig. 4），并直接对比 D&D 与零填充。
- 与 [CONCH](31-conch.md) 对照：病理基础模型特征在这篇里承担三重角色——训练条件（UNI）、FID_C 的分布度量、Emb Sim 的特征一致性。
- 与 [TopoCellGen](21-topocellgen.md) 对照：同属病理生成式建模，但目标相反——一个造新细胞拓扑，一个只在伪影区对齐原有组织。
- 论文引用的 Artifusion / ArtiDiffuser / DiffInfinite / LRDM / ZoomLDM 不在本仓库，若要补齐“病理修复”这条支线，可优先补 DiffInfinite（随机 patch 扩散的源头）与 LRDM（PFM 条件生成）。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2609.24116)
- [arXiv HTML 正文](https://arxiv.org/html/2609.24116v1)
- [官方代码 RestorePath](https://github.com/PathfinderLab/RestorePath)
