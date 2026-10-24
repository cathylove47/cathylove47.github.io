# 88｜RAD：给每个像素不同的噪声日程，把 inpainting 变成并行生成

**论文**：RAD: Region-Aware Diffusion Models for Image Inpainting，arXiv:2412.09191v5（2024-12-12 首版，2026-02-05 修订）  
**作者**：Sora Kim（汉阳大学 ERICA）、Sungho Suh（DFKI & RPTU Kaiserslautern-Landau）、Minsik Lee（汉阳大学 ERICA）  
**定位**：逐像素噪声日程的扩散 inpainting；无额外模块、可 LoRA 微调、推理提速约一个数量级  
**精读核验**：依据 arXiv v5 全文（含 4 个表格、图 1–6 与补充材料的说明）整理，核验日期 2026-10-24。论文实验全部在自然图像（FFHQ、LSUN Bedroom、ImageNet）上，**没有病理数据**；本次未运行官方代码、未复现任何 FID 或耗时。

## 原文摘要

> Diffusion models have achieved remarkable success in image generation, with applications broadening across various domains. Inpainting is one such application that can benefit significantly from diffusion models. Existing methods either hijack the reverse process of a pretrained diffusion model or cast the problem into a larger framework, i.e., conditioned generation. However, these approaches often require nested loops in the generation process or additional components for conditioning. In this paper, we present region-aware diffusion models (RAD) for inpainting with a simple yet effective reformulation of the vanilla diffusion models. RAD utilizes a different noise schedule for each pixel, which allows local regions to be generated asynchronously while considering the global image context. A plain reverse process requires no additional components, enabling RAD to achieve inference time up to 100 times faster than the state-of-the-art approaches. Moreover, we employ low-rank adaptation (LoRA) to fine-tune RAD based on other pretrained diffusion models, reducing computational burdens in training as well. Experiments demonstrated that RAD provides state-of-the-art results both qualitatively and quantitatively, on the FFHQ, LSUN Bedroom, and ImageNet datasets.

*来源：arXiv:2412.09191v5 摘要页；逐字原文，未改写、未压缩。*

## 中文摘要

> 扩散模型在图像生成上取得了显著成功，其应用正扩展到各个领域。inpainting 正是其中一项能显著受益于扩散模型的应用。现有方法要么劫持预训练扩散模型的反向过程，要么把问题放进一个更大的框架（即条件生成）。然而这些做法在生成过程中往往需要嵌套循环，或为条件引入额外组件。本文提出 region-aware diffusion models（RAD），用对 vanilla 扩散模型的一个简单而有效的重表述来做 inpainting。RAD 为每个像素使用不同的噪声日程，使局部区域能够异步生成，同时考虑全局图像上下文。一条普通反向过程不需要任何额外组件，使 RAD 的推理时间比最先进方法快最多 100 倍。此外，我们采用低秩适配（LoRA）在其他预训练扩散模型上微调 RAD，从而也降低训练负担。实验表明，RAD 在 FFHQ、LSUN Bedroom 与 ImageNet 上在定性与定量两方面都给出了最先进的结果。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 1. 三分钟摘要与推荐理由

扩散做 inpainting 的老路有两条：**改采样过程**（RePaint 的重采样、DDNM/DDRM/DeqIR 的数据一致性投影）与**加条件模块**（把掩码、结构、文本塞进网络）。前者不用重训但慢（RePaint 一次要 837 秒），后者结构复杂、还带来额外训练。

RAD 的路线是**改训练目标本身**：把 DDPM 里"全体像素同一个噪声日程"换成**每个像素一个日程** $b_{t,i}$——掩码内的像素在 Phase 1 里被加噪（相当于"待生成"），掩码外的像素在 Phase 2 里被加噪（相当于"已知、要保留"）。于是"修补一块区域"不再需要掩码条件输入、不需要嵌套循环、不需要额外损失，就是一条普通的反向过程，且**推理只走 Phase 1（约一半步数）**：100 步采样、8.4 秒一张 256×256。

代价写得很坦白：**必须重新训练**（作者用 LoRA 缓解，rank 16），并且依赖训练时的掩码分布（用 Perlin 噪声造掩码）。

对病理修复线的意义：ArtiFusion、LatentArtiFusion、RestorePath 这些都是"patch + 掩码条件 + 独立修复模型"的思路，RAD 提供了一个更干净的替代骨架——**把"哪里坏了"直接编码进噪声日程**，从而取消掩码输入通路。真正搬到 WSI 还应解决千兆像素的滑窗与掩码生成，但"per-pixel 日程"这一层是可以直接借的。

## 2. 问题及研究位置

论文把已有 inpainting 工作分成三类并指出各自缺口：

1. **改采样**：RePaint（掩码区反复重采样）、MCG（在测量约束下拉普拉斯近似）、DDRM/DDNM（用 SVD 或零空间投影做数据一致性）、DeqIR。优点是不用重训，缺点是**长流程**（RePaint 837 s）或**依赖线性退化假设**（DDRM/DDNM 在 extreme mask 这种大缺失面积下 FID 直接崩到 87.7 / 64.2）。
2. **条件生成**：把 mask、edge、text 作为额外条件送进网络（如 SmartBrush 在掩码区加噪但额外加了模块）。需要额外组件与训练。
3. **插值/编辑类**：DDIM inversion 之类，用于编辑而非大面积修复。

RAD 的位置：既然 DDPM 的对角协方差假设（各像素独立同分布加噪）本来就是为了训练 tractable，那么**把它放松成逐像素日程**不破坏任何数学结构，只改变采样轨迹的"异步性"。作者用一句话概括：不是给 vanilla 模型加东西，而是**重新表述 vanilla 模型**。

与 [Patch Diffusion](87-patch-diffusion.md) 的关系也值得记一笔：那篇给网络加"位置坐标"以支持 patch 训练；这篇给像素加"独立噪声强度"以支持异步生成。两者都是"把空间信息显式写进扩散过程"，只是注入点不同（输入通道 vs 噪声日程）。

## 3. 核心方法和数据流

```text
前向（逐像素）
q(x_{t,i} | x_{t-1,i}) = N( sqrt(1 − b_{t,i}) · x_{t-1,i},  b_{t,i} )      ← 每个像素 i 自己的 b

两阶段日程（对应 inpainting 的因果方向）
Phase 1（1 ≤ t ≤ T1，共 1000 步）：只给掩码内像素加噪，β_t
Phase 2（T1 < t ≤ T，共 1000 步）：只给掩码外像素加噪，β'_t
归一化 β / β' 使两阶段结束时所有像素的累计噪声水平相同  → 保证反向从同一分布出发

反向（逐像素均值，Eq. 5）
μ_{θ,t,i} = (1/√a_{t,i}) · ( x_{t,i} − (b_{t,i}/√(1−ā_{t,i})) · ε_{θ,i}(x_t, t) )
若某像素到 t 步为止没加过噪（ā_{t,i} = 1），单独推导得 μ = x_{t,i}（原样保留）

空间噪声嵌入（Sec 3.3）
把 U-Net 的 t-embedding 换成 b̄_t（逐像素累计噪声强度）：
  时间嵌入的 cos-sin + FC  →  改为 1×1 卷积，直接吃逐像素 b̄_t
理由：t 的作用是告诉网络"当前噪声整体有多强"，RAD 里这个量是空间可变的

LoRA 微调（Sec 3.4）
rank = 16，lr = 1e-4；因噪声日程在端点与 DDPM 对齐，可把 b̄_t 反查回 DDPM 的时间值（线性插值，允许非整数）
→ 在预训练 ADM 上做 LoRA 微调

训练 / 推理设定
T = 2000（前 1000 步 Phase 1）；采样 100 步；掩码 = 阈值化的黑白 Perlin 噪声（随机空间尺度 + 随机阈值控制面积）
FFHQ 300K 步 / 4×TITAN RTX；LSUN 300K / 8×3090；ImageNet 800K / 8×RTX 6000 ADA
```

三个设计里最"反直觉"的是**空间噪声嵌入**：作者原本试过直接沿用 DDPM 的 $t$ 嵌入，结果明显变差（消融 Cfg. 2）。他们的解释是 RAD 的 $\epsilon_t$ 空间可变、比 DDPM 复杂，网络需要知道"这个位置现在有多脏"，而 $t$ 只给一个全局标量。把 FC 换成 1×1 卷积后不改变其它结构即可工作。

另一个细节是**为什么用 Perlin 掩码**：独立的逐像素随机日程"能训但不work"（作者原话是 empirical 失败），因为噪声图案与真实 inpainting 场景不符；限制成"掩码内 / 掩码外两段式"并把掩码形状限制为 Perlin 阈值图，才既有空间结构又有多样性。

## 4. 论文证据与实验范围

**主表（Table 1，作者报告，FFHQ / LSUN Bedroom，256×256）**

| 方法 | FFHQ Box FID/LPIPS | FFHQ Extreme | FFHQ Wide | LSUN Box | LSUN Extreme | LSUN Wide |
|---|---|---|---|---|---|---|
| LaMa (GAN) | 27.7 / .086 | 61.7 / .492 | 23.2 / .096 | — | — | — |
| RePaint | 25.7† / .093 | 35.9† / .398 | 24.2† / .108 | 20.5 / .176 | 23.5 / .461 | 21.4 / .161 |
| MCG | 23.7† / .089 | 30.6† / .366 | 22.1† / .099 | 19.9 / .131 | 22.0 / .395 | 20.9 / .108 |
| DDNM | 30.4 / .089 | 87.7 / .353 | 30.4 / .089 | 22.7 / .150 | 53.3 / .431 | 23.2 / .126 |
| **RAD** | **22.1 / .074** | 33.4 / .317 | **21.5 / .078** | **19.2** / .131 | 21.6 / .399 | 20.8 / .107 |

两点必须同时看：RAD 在 **LPIPS 全线最好**；FID 上 FFHQ/LSUN 的 Box、Wide 最好，但 **Extreme mask 的 FID 不如 MCG**（FFHQ 33.4 vs 30.6），LSUN 的 Box FID 与 MCG 基本持平（19.2 vs 19.9）而 LPIPS 相同（.131）。所以"全面 SOTA"要按掩码类型拆开说。

**推理耗时（Table 2，单卡 TITAN RTX，256×256）**：RePaint 837.1 s、MCG 128.1 s、Score-SDE 42.0 s、DeqIR 26.4 s、DDRM 12.3 s、DDNM 6.6 s、**RAD 8.4 s**。摘要里的"最多 100×"来自对 RePaint 的 99×，"15×"来自对 MCG。注意 **DDNM 比 RAD 更快**（6.6 s），只是质量差很多——引用速度时别把 DDNM 略过。

**消融（Table 3，FFHQ）**

| 配置 | Box FID | Extreme FID | Wide FID |
|---|---|---|---|
| Cfg.1 预训练 ADM 直接用 RAD 反向步（不重训） | 128.3 | 172.0 | 95.7 |
| Cfg.2 RAD 但去掉空间噪声嵌入（仍用 $t$） | 23.5 | 37.0 | 26.8 |
| RAD 完整 | **22.1** | **33.4** | **21.5** |

Cfg.1 直接证明"这套反向过程**必须配合对应的训练**"，不能当作免训练的采样技巧；Cfg.2 证明空间嵌入不是可有可无的装饰。

**范围限制（作者承认 + 我补充）**：

- 作者承认：必须显式训练（LoRA 只是缓解）；依赖训练掩码分布；极端情形下 RePaint/MCG 可能更好。
- 数据集只有 FFHQ / LSUN Bedroom / ImageNet（各留 1000 张验证）；**ImageNet 只给了定性对比**（Fig. 4c），没有表格数字。
- 掩码只有三种（box 128×128、extreme、wide）；病理伪影的形状（气泡、折叠、笔迹）与 Perlin 掩码分布差异较大，属于**未验证的迁移**。
- FID/LPIPS 都是 Inception 域的自然图像指标，对病理的"结构是否可信"没有区分力（这与 [RestorePath](49-restorepath.md) 用 CONCH 特征算 FID_C 的做法形成对照）。

## 5. 复现与审计重点

- **奇异点**：作者明确指出变分损失在 $t=1$ 有退化风险，RAD 因为像素日程不同步使处理更麻烦，细节扔在补充材料。复现时如果 loss 出现 NaN，先查这里而不是改学习率。
- **两阶段归一化**：必须保证两阶段结束时所有像素累计噪声水平一致，否则反向起点不是同一个分布。这是最容易实现错、又最难从 loss 曲线看出来的地方。
- **LoRA 的反查映射**：把逐像素 $\bar b_t$ 反查成（可能非整数的）DDPM 时间步，用线性插值。非整数 $t$ 进入 cos-sin 编码时的具体处理要与官方代码核对。
- **推理只走 Phase 1**：报告 100 步采样时，确认这 100 步落在 Phase 1 内，且与非掩码区像素的"原样保留"逻辑一致（$\bar a_{t,i}=1$ 分支）。
- **速度对比的硬件口径**：Table 2 是单张 TITAN RTX；同时 837 s 的 RePaint 是它默认的重采样次数，比较时不要换步数。
- **迁移到病理的最低验证集**：先在固定掩码（人工气泡/折叠）上比较 RAD 与 [ArtiFusion](55-artifusion.md)/[RestorePath](49-restorepath.md) 的 LPIPS 与下游 MIL AUC，而不是只比 FID；Perlin 掩码与真实伪影的分布差是首要风险。

## 6. 建议阅读顺序

`Fig. 2`（四个组件的总览）→ `3.1`（Eq. 2–5 的逐像素前向/反向，重点看 $\bar a_{t,i}=1$ 的分支）→ `3.2`（两阶段日程、Perlin 掩码、为什么不能纯随机）→ `3.3`（空间噪声嵌入，配合 Table 3 的 Cfg.2）→ `3.4`（LoRA 与时间反查、奇异点）→ `4.2` 实现细节 → `Table 1` 按掩码类型逐列读 → `Table 2`（速度）→ `Table 3`（两个消融）→ `5. Limitations` → 补充材料（归一化公式与损失奇异点的处理）。

## 7. 前后关联

- **与病理修复线的分工**：[ArtiFusion](55-artifusion.md)、[ArtiDiffuser](57-artidiffuser.md)、[LatentArtiFusion](72-latentartifusion.md) 是"为伪影训练专用修复模型"，条件来自输入图像与掩码；RAD 把掩码信息搬进**噪声日程**，网络不再需要掩码输入。两者可以组合：用 RAD 的日程 + 病理专用条件（PFM 嵌入）。
- **与整图一致性**：[RestorePath](49-restorepath.md) 解决的是"块与块不一致"，靠距离加权插值把邻域上下文借给每一块。RAD 走的是另一条：用一条覆盖整图的异步反向过程，天然没有拼接这一步——但千兆像素下仍需滑窗，届时"拼接问题"会以别的形式回来。
- **与训练加速**：[Patch Diffusion](87-patch-diffusion.md) 省训练算力，RAD 省推理步数与条件模块；两者正交，可在同一项目里同时用。
- **与本仓库的关系**：归入「病理扩散」专题的「病理修复」组，作为该组的"另一种任务表述"参照；本身是自然图像方法，未在病理上验证。

## 8. 本次阅读边界

只读了 arXiv v5 全文与摘要页，未克隆、未运行官方代码，未训练或采样任何模型。因此：

- 所有 FID / LPIPS / 推理耗时均为**作者报告值**（其中带 † 的基线数字引自原论文）；
- 100×、15× 的口径已在 4 节拆开说明，不与 DDNM 的 6.6 s 混谈；
- 迁移到 WSI 伪影修复的成本（掩码生成、滑窗日程一致性、千兆像素显存）**没有任何实测**；
- 论文是否已被会议接收：arXiv 页面未给 journal reference，本次按 preprint 记录。

## 9. 链接

- [arXiv:2412.09191（v5, 2026-02-05）](https://arxiv.org/abs/2412.09191)
- 站内相关：[ArtiFusion](55-artifusion.md)、[ArtiDiffuser](57-artidiffuser.md)、[LatentArtiFusion](72-latentartifusion.md)、[RestorePath](49-restorepath.md)、[Patch Diffusion](87-patch-diffusion.md)、[LPFM](69-lpfm.md)
