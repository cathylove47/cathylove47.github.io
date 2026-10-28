# 56｜LRDM：用自监督嵌入当条件，把扩散模型从 patch 推向大图

**论文**：Learned representation-guided diffusion models for large-image generation，CVPR 2024（arXiv:2312.07330v2，2024-03-28；Graikos, Yellapragada, Le, Kapse, Prasanna, Saltz, Samaras；Stony Brook University）  
**定位**：SSL 嵌入条件扩散、patch 组装成 1024×1024 大图、生成数据增广下游分类器  
**精读核验**：依据 arXiv v2 的摘要、方法、表格与补充材料整理（2026-10-15）；数值逐字摘自原文。**复现范围见第 7 节**（2026-10-15/16 在 RTX 4090 D 上用官方权重完成两次 256×256 小图推理与一张 1024×1024 大图推理；未训练、未复算 FID、未使用自有 WSI）。

## 30 秒看懂

**一句话**：LRDM 用自监督嵌入当条件训练 patch 扩散，再用"嵌入网格 + 重叠窗口平均"拼出 1024² 大图；合成数据把切片级 MIL 从 0.725 拉到 0.812。

**问题**：专业领域没有条件数据——给整份 TCGA-BRCA 加 caption 约需 40,000 小时病理学家时间；而直接训 1024² 的 LDM，每 epoch 约 300 小时（patch 法 45 小时）。

**瓶颈**：条件必须与图像严格配对，否则结论全假；Vanilla FID 与 Crop FID 差一倍，跨论文比数字前要先看用哪一列；增广收益在 +2× 之后回落。

**insight**：SSL 表征够格当细粒度标注的代理。于是大图不靠"训一个大模型"，而靠"patch 模型 + 平滑的嵌入条件网格 + 每步重叠窗口取平均"——条件可以从参考图、类别、文本、基因组任意一路来，生成图像与嵌入来源解耦。

## 3 分钟讲清

**方法（按顺序）**：
1. patch 过 SSL 编码器（BRCA 20× 用 HIPT patch ViT + iBOT，5× 用 CTransPath），L2 归一化后线性投影到 512 维。
2. LDM U-Net 经 cross-attention 注入条件，CFG 的空条件是全 0 向量；基座是 ImageNet U-Net + 4× 下采样 VQ-VAE。
3. 大图生成时把图看成 P×P 的 patch 网格，每个位置的条件由 4 个最近邻嵌入做 slerp 插值得到。
4. 每个扩散步对所有重叠 patch 的去噪更新取平均（有闭式解），边缘乘高斯核降权去拼缝；stride 16。
5. 采样 DDIM 50 步、guidance 1.75（大图用 3.0）。

**作者证据在哪**：Table 1（BRCA 20×：Vanilla FID 6.98 / Crop 15.51 / CLIP FID 7.43 / Emb Sim 0.924）、Supp. Table 7 条件来源消融（无条件 25.62、ImageNet ViT 13.29、CLIP 16.07、HIPT 6.98——"SSL 可替代标注"最直接的证据）、Supp. Table 8 stride 消融（4/8/16/32）、Table 2–3 下游增广（CLAM-SB 1% 数据 0.725 → 0.812）、Table 4 生成特征当表征。第 7 节记了本站实际跑过的推理。

**和上一代的区别**：与 PathLDM 相比条件从文本换成 SSL 嵌入并沿用它的 4× VAE；ZoomLDM 把这里的单尺度条件升级成倍率感知；RestorePath 直接把它改成"对齐原图"的修复（条件换 UNI，加 DWI/AGS）。与 ArtiFusion 的根本差别是生成 vs 对齐给定输入。

**讲 PPT 用这张**：Supp. Table 7 的条件来源消融 + CLAM-SB 1% 的 0.725→0.812；一张证明条件有效，一张证明下游有收益。

## 1. 问题及研究位置

- **痛点**：专业领域（病理、遥感）没有条件数据可用。给整份 TCGA-BRCA 加 caption 约需 **≈40,000 小时**病理学家时间；而扩散模型要在高保真下工作需要条件信号。
- **观察**：SSL 表征已编码丰富语义与视觉信息，可作为细粒度标注的代理。
- **做法**：不引入新数据模态，直接把 SSL 嵌入当条件训练 LDM；大图不靠训练一个大模型，而靠 patch 级模型 + 嵌入网格 + MultiDiffusion 组装。
- **与直训大图的成本对比**（Supp. Table 6）：patch 法（256×256）最大 batch 100、每 epoch 约 45 小时；直接训 1024×1024 LDM 最大 batch 4、每 epoch 约 300 小时。这是「拼大图」而非「训大图」的直接理由。

在支线里的位置：LRDM 定义「条件化 + 拼接」骨架 → ZoomLDM 解决多尺度与 4096×4096 → RestorePath 把生成改成掩码对齐的修复。

## 2. 核心方法和数据流

```text
训练（256×256 patch）
真实 patch
    → SSL 编码器提嵌入 y：
        TCGA-BRCA / TCGA-CRC(20×)：HIPT patch-level ViT、iBOT（均在 PanCancer TCGA 预训练）
        TCGA-BRCA 5×：CTransPath
        NAIP：作者自训 ViT-B/16 + DINO
    → y（384/768 维）→ L2 归一化 → 线性层 → 512 维条件向量
    → LDM U-Net 以 cross-attention 注入条件
        基座：ImageNet 预训练 U-Net + 4× 下采样 VQ-VAE（沿用 PathLDM 配置）
        CFG 空条件 = 全 0 向量
    → DDPM 训练（lr 1e-4，warmup 10,000 步，6×RTX 8000，每卡 batch 100）

大图生成（1024×1024，MultiDiffusion 组装）
目标大图 = P×P 个 256×256 patch 的网格
    → 条件网格 z：每个位置 (i,j) 的 λ_{i,j} = 4 个最近邻嵌入的 slerp 插值
    → 每个扩散步：对所有重叠 patch 的去噪更新取平均（Eq. 6 闭式解）
        边缘像素乘高斯核降权 → 无拼缝
    → patch stride 16；解码 latents 同样 stride 16 + 高斯加权
    → 采样：DDIM 50 步，guidance 1.75（大图用 3.0）

条件来源可替换（论文卖点）
参考图 → SSL 嵌入 | 类别标签 / 文本 / 基因组 → 辅助模型 → 嵌入
    → 文本到大图（VLM 生成嵌入网格）→ 大图
```

**空间一致性是前提而非推论**：作者要求插值出的 λ_{i,j} 仍是有效条件向量（"which we validate experimentally"），并强调改变嵌入网格的空间排布就等于编辑大图的全局语义布局；单条全局文本提示这类粗条件会在均匀纹理区域失效。

## 3. 论文证据与实验范围

**数据与设置**：TCGA-BRCA、TCGA-CRC（COAD+READ，20×）、BRCA 5×、NAIP/Chesapeake Land Cover（256×256 非重叠切片，共 667,000 patches）。生成规模：10,000 个 256×256 patch 与 3,000 张 1024×1024 大图。

**生成质量（Table 1，逐字）**：

| 数据集 | 训练图数 | Vanilla FID ↓ | Crop FID ↓ | CLIP FID ↓ | Emb. Sim ↑ |
|---|---|---|---|---|---|
| BRCA 20× | 15M | 6.98 | 15.51 | 7.43 | 0.924 |
| CRC 20× | 8M | 6.78 | 8.8 | 7.34 | 0.938 |
| NAIP | 667k | 11.5 | 43.76 | 6.86 | — |
| BRCA 5× | 976k | 9.74 | — | 6.64 | — |

指标口径：FID（Clean-FID 实现）、Vanilla/Crop FID（沿用 MultiDiffusion 评估）、CLIP FID、Embedding Similarity（CTransPath 特征余弦相似度）。patch 质量对比基线为 PathLDM（10× 上 7.64）。

**条件来源消融（Supp. Table 7，patch FID）**：无条件 **25.62**；ImageNet ViT-B/16 **13.29**；CLIP **16.07**；HIPT **6.98**。→ 领域内 SSL（HIPT）显著优于通用表征，这是「SSL 嵌入可替代标注」这一命题的直接证据。

**大图 stride 消融（Supp. Table 8）**：stride 4 → 15m / 12.66 / 7.31；stride 8 → 4m / 14.69 / 7.37；stride 16（正文所用）→ 1m / 15.51 / 7.43；stride 32 → 20s / 15.60 / 8.09（时间/质量权衡取 16）。

**下游增广（逐字关键数值）**：
- 切片级 MIL（CTransPath 特征）：TCGA-BRCA Subtyping AUC，CLAM-SB 用 1% 真实数据 **0.725** → 加合成 **0.812**；10% **0.886** → **0.898**；20% 真实 **0.91**。DSMIL 1% **0.609** → **0.659**；10% **0.838** → **0.856**；20% **0.905**。TCGA-BRCA HRD 上 CLAM-SB 10% **0.649** → **0.765**，DSMIL 10% **0.563** → **0.639**。
- BACH 大图级（ConvNeXt V2_huge + 2 层 MLP）：Real **78%**、Synthetic **70%**、Real+synthetic **83%**、SoTA [7] **87%**。
- NCT-CRC patch 级（ResNet-50）：Real **93.8%**、Synthetic **90.19%**、Real+synthetic **96.27%**、SoTA [20] **96.26%**。
- 增广倍数消融：Real **93.8%**；+1× 合成 **96.27%**；+2× **96.55%**；+3× **95.52%**；+5× **95.59%**（超过 2× 后回落，作者归因于真实数据被稀释）。
- 生成特征当表征（Table 4，BRCA 亚型 10 折 CV AUC）：HIPT 25% 数据 CLAM-SB **0.788** → LDM_HIPT **0.842**；CTransPath 25% **0.900** → LDM_CTransPath **0.913**；DSMIL 上 CTransPath 100% **0.910** → LDM_CTransPath **0.936**。

**文本到大图（概念验证）**：NAIP 上 CLIP similarity **0.22**（对比 text-to-image Stable Diffusion 报告的 >0.24）；病理侧由专家标注 100 张 CRC 合成图，与生成所用标签一致率 **89.9%**（其中 61% 被标为 realistic）。

**作者自陈局限**（无独立 Limitations 章节）：增广是「全图 naive 增强」，自适应选择增广区域留作未来工作；大图空间对齐可探索拓扑约束或引入低分辨率信息；NAIP 因样本少、高频细节弱而 Crop FID 较差；文本到大图能力受所用作 VLM 限制（乳腺癌上 Quilt 的 zero-shot 准确率约 40%）；合成数据过多会稀释真实数据；BACH 上未达 SoTA 87%。

## 4. 复现与审计重点

- **条件配对的正确性是全部结论的前提**：训练时 y 必须来自同一张 patch 的 SSL 编码。若用错配对（例如同一 WSI 的邻域嵌入），模型仍能训出好看的图，但下游增广结论会失真。建议先做「同嵌入 → 同形态」的最近邻检索检查。
- **Crop FID 与 Vanilla FID 差异很大**（BRCA 20×：6.98 vs 15.51）：后者才是大图拼接的质量口径。只报 Vanilla FID 会高估拼接效果，跨论文比较时要看用哪一列。
- **拼接参数是被调出来的**：stride 16 是最优点，与 4 相比质量仅差 0.33 FID 但快 15 倍。复现时若 stride 不同，生成质量差异应归因于该旋钮而非模型。
- **两份度量同源风险**：Embedding Similarity 用 CTransPath，而 BRCA 5× 的条件也用 CTransPath，衡量指标与生成条件的编码器同族；报告时应明确这一点。
- **增广收益有上限**：+2× 之后回落。若目标是复现「增广提升下游」，必须同时报告 3×/5× 的回落，否则结论不完整。
- **可验证的改进切口**（待验证假设）：把倍率也做成条件（这正是 ZoomLDM 的路线）；用领域更强的病理基础模型替换 HIPT 作条件（RestorePath 用 UNI 走的就是这条）；把 naive 全图增广改成按伪影/难例区域定向增广。
- **训练资源**：6×RTX 8000、每卡 batch 100、256×256 patch、lr 1e-4、warmup 10k 步；大图生成的显存与耗时（RTX 6000 上 stride 16 约 1 分钟/图）应自行实测。

## 5. 建议阅读顺序

`Abstract` → `1. Introduction`（≈40,000 小时标注成本这个动机数字）→ `3.1` 条件扩散公式 → `3.2` 大图组装（Eq. 3 与 Eq. 6、空间一致性讨论）→ `4.2` 实现细节（参数逐条）→ `Table 1` → Supp. `Table 6`（直训大图 vs 拼大图成本）与 `Table 7`（条件来源消融）→ `5.` 下游增广（Table 2 与 Table 3）→ `6.` 文本到大图 → Supp. `Table 8`（stride 消融）。

## 6. 前后关联

- 与 [ZoomLDM](58-zoomldm.md) 直接相连：ZoomLDM 把这里的「单一 SSL 嵌入条件」升级为「倍率感知条件」，并解决跨尺度一致性。
- 与 [RestorePath](49-restorepath.md) 相连：RestorePath 的 LDM + PFM 条件 + 大图 patch 扩散，正是这套骨架在修复任务上的改造（条件换成 UNI 嵌入，加入 DWI/AGS）。
- 与 [ArtiFusion](55-artifusion.md)、[ArtiDiffuser](57-artidiffuser.md) 对照：那两篇是修复（对齐给定输入），LRDM 是生成（从嵌入造图）；两者的评价口径与数据要求完全不同。
- 与 [CLAM](29-clam.md)、[DSMIL](03-dsmil.md) 相连：下游增广实验直接在 CLAM-SB 与 DSMIL 上做，是「生成是否有用」的判据。
- 与 [HIPT](04-hipt.md) 相连：HIPT 既是条件编码器（Table 7 中最优）也是对照表征（Table 4 中的基线），可从这篇看到 SSL 表征的下游两种用法。
- 与 [CTransPath](07-ctranspath.md) 相连：5× 模型的条件编码器与 Embedding Similarity 的度量都用它。

## 7. 复现记录：本次实际跑了什么、条件是怎么接进去的

**范围**：**只做推理** —— 官方权重 `weights/brca_hipt_20x`，单卡 **RTX 4090 D**，Python 3.8.20 / torch 2.0.1+cu118，上游 commit `cf810d0924126a302bbd3403e6b88ae7747781d1`。两次 256×256 小图（GPU 0 / GPU 2 各一次，每次 2 张）+ 一张 1024×1024 大图（seed 0）。**没有训练、没有复算 FID、没有自有 WSI 结果。**

下文三类陈述显式区分：**【论文】**=原文结论；**【实测】**=本次运行观测（出处：服务器 `RECORD.md` 与 `outputs/*/run.json`）；**[推断]**=解释性推断。代码断言一律落到 `文件:行号`。

### 7.1 实测耗时（脚本内计时，不含 Python 导入）

| 实验 | 物理 GPU | 模型加载 / s | 采样+解码 / s | 脚本内总计 / s |
|---|---|---:|---:|---:|
| 小图 ×2（50 步，scale 2，seed 0） | 0 | 35.3 | 19.1 | 54.9 |
| 小图 ×2（同上） | 2 | 34.1 | 19.6 | 54.9 |
| 1024×1024 大图 ×1（sample-index 1，U-Net 批 ≤4） | 0 | 53.47 | 采样 157.59 + 解码 4.94 | 217.87 |

- 【实测】两次小图用相同 seed，输出**逐像素一致**：只产生 2 个不同样本，不是 4 个；小图**未采集峰值显存**，不把估算写成实测。
- 【实测】大图峰值显存（**本进程 torch 口径**，不含其他进程、也不等于整卡占用）：allocated **2857.22 MiB**、reserved **2996.00 MiB**；未 OOM。计时不含前置 Python 导入与 CUDA 初始化，是共享卡上的单次耗时，不是独占基准。
- 【实测】大图保留官方设置：50 步、169 个窗口、latent 窗口 64、窗口步幅 16、`guidance = 3.0`（`upstream/notebooks/utils.py:128`；按 `:194` 的 `(1+guidance)·ε_cond − guidance·ε_uncond` 写法定价，等价 CFG scale 4.0）。每步 338 个条件/无条件输入按原顺序拆成每批 ≤4；CPU 上用官方小型 U-Net 验证过分批/不分批在 2e-5 内一致，**但没有做大图不分批的逐像素等价验证**。

真实参考 / 生成（256×256，GPU 0 与 GPU 2 输出一致，只展示一份）：

![两个真实 BRCA 小图样例](/papers/pathology/56-lrdm-patch-reference.png)

![同条件下生成的图](/papers/pathology/56-lrdm-patch-synthetic.png)

1024×1024 大图对照，左真实右生成（整个文件 2048×1024）：

![大图对照：左侧真实，右侧生成](/papers/pathology/56-lrdm-large-comparison.png)

原尺寸单图：[真实参考大图](/papers/pathology/56-lrdm-large-reference.png) · [生成大图](/papers/pathology/56-lrdm-large-synthetic.png)（本节 5 张图均为本次运行输出，未做任何修饰）

### 7.2 条件到底是怎么接进 U-Net 的

【实测】本次推理**从头到尾都是 SSL 在驱动**，缺的不是 SSL，是"算 SSL 的那个模型"：整张 1024×1024 完全由 `item["feat_20x"]` 决定（`patch/run_large_image_synthesis.py:110`）；小图脚本以 `feat_20x` 作条件、用 `torch.zeros_like(feat_20x)` 构造无条件分支（`patch/run_patch_synthesis.py:136-138`）。官方样例 `brca_hipt_patches.pickle` 就是 `image (256,256,3) uint8` + `feat_20x (384,) float32`。

```text
feat_20x (384,) ─ F.normalize ─ Linear(384,512) ┐
                                                 ├─ stack(dim=1) → (2,512) ─ cross-attention → U-Net 去噪
feat_5x  (768,) ─ F.normalize ─ Linear(768,512) ┘
   缺失时由 modules.py:33-36 补零向量，不报错
（链路出处：upstream/ldm/modules/encoders/modules.py:24-49；context_dim 见 brca/only_ssl.yaml:47）
```

- 【实测】`modules.py:49` 的 `torch.stack(..., dim=1)` 说明条件序列长度是 **2**（patch token + region token），不是 1；缺 `feat_5x` 时 `modules.py:33-36` 补零，这正是小图脚本 `:99` 敢直接 `pop("feat_5x")` 的原因。
- [推断] 一张 WSI 不是"有两张切片"，而是同一张切片按两种放大倍率读：`feat_20x` 回答"这个小格子里细胞长什么样"，`feat_5x` 回答"它处在什么大环境里"。

**512 不是自由超参。** 【论文】论文没有把它当作可调项。【实测】原因是它被复用的 ImageNet 类条件 U-Net 钉死：`configs/latent-diffusion/brca/only_ssl.yaml:32-48` 的 U-Net 超参（`model_channels 192`、`channel_mult [1,2,3,5]`、`attention_resolutions [8,4,2]`、`context_dim 512`）与 CompVis/latent-diffusion 的 `cin256-v2.yaml` 逐项一致。**坑在这里** —— `upstream/ldm/modules/diffusionmodules/openaimodel.py:761-772` 用 `self.load_state_dict(sd, strict=False)` 加载：把 `context_dim` 改成 768 跑同一份 checkpoint，cross-attention 的 K/V 形状不匹配会被**静默丢弃**、保持随机初始化，**不报错**。

**无条件分支在实现上等于投影层的 bias。** 【实测】训练侧 `brca_only_ssl.py:64-69` 用 `p_uncond` 置零的是**原始** `feat_20x`/`feat_5x`；链路上零向量经 `F.normalize` 仍是零，再经 `nn.Linear`（`modules.py:24`，默认 `bias=True`）后**只剩 bias**。[推断] 所以论文 §14 说的"全零 null token"，在代码里实际是投影层的 bias 向量；训练与推理路径一致、CFG 自洽，但改投影层实现会悄悄改掉 CFG 的语义。

**训练只更新 U-Net + 投影层。** 【实测】`only_ssl.yaml:17` `cond_stage_trainable: true` → `ddpm.py:629-630` 不冻结条件模型、`ddpm.py:1780-1782` 把 `cond_stage_model.parameters()` 加进优化器；第一级 VQ-VAE 在 `ddpm.py:604-609` 冻结。HIPT 与 VQ-VAE 都是冻结的。

四条路线的条件编码器（接口相同：归一化 → 投影到 512 → cross-attention）：

| 模型 | 条件编码器 | 原始维度 | 投影后 | 配置:行号 |
|---|---|---:|---:|---|
| BRCA 20× | HIPT patch ViT（`feat_20x`）+ 5×（`feat_5x`） | 384 + 768 | 512 ×2 | `brca/only_ssl.yaml:74-81` |
| BRCA 5× | CTransPath（`feat_patch`） | 768 | 512 | `brca/only_patch_5x.yaml:73-78` |
| CRC 20× | iBOT（`feat_patch`） | 768 | 512 | `crc/only_patch_20x.yaml:72-77` |
| NAIP 卫星 | 自训 DINO ViT-B/16 | 768 | 512 | `satellite/naip.yaml:72-77` |

【论文】CTransPath 在这篇工作里有**三处身份**：BRCA 5× 的条件器、大图 `Embedding Similarity` 的独立评估器、下游 MIL 的特征与基线；评估时换一个没参与生成的编码器，避免自评自。

### 7.3 复现踩到的三个坑（都为实测，不是推测）

1. 【实测】大图首次启动在模型加载前退出：`torch.cuda.reset_peak_memory_stats` 在 CUDA 未初始化时调用，报 `RuntimeError: Invalid device argument 0: did you call init?` —— **不是 OOM**。修法是在统计重置前显式 `torch.cuda.init()`（现于 `patch/run_large_image_synthesis.py:94`）。
2. 【实测】环境里 `taming-transformers` 只有 `.dist-info`、没有源码，报 `ModuleNotFoundError: No module named 'taming'`；补官方源码 checkout 到 `dependencies/taming-transformers`（commit `3ba01b241669f5ade541ce990f7650a3b8f65318`），未改 `upstream/`。
3. 【实测】小图脚本原先把官方已是 uint8 的参考图又按 -1~1 浮点范围转换了一次；已删除重复转换，并在 CPU 上逐值验证 100 张样例的 19,660,800 个通道值不变。

### 7.4 本次能证明什么、不能证明什么

- **能证明**：官方权重与依赖能在本机加载；小图与大图生成链路完整跑通；输出尺寸、参考图像素一致性、大图峰值显存已实测；两卡同 seed 可复现。
- **不能证明**：任何质量结论 —— 没算 FID（官方加载器默认初始化 FID 的 Inception 网络并下载约 91.2 MiB 权重，但**没有计算 FID**）、没做病理专家评估、只跑了 1/15 张大图、只用 1 个种子、没有独立于官方样例的 WSI 数据。
- **对比口径**：【论文】大图 stride 16 在 RTX 6000 上约 1 分钟/图；【实测】本机 217.87 s（含加载 53.47 s、采样 157.59 s）。两者硬件与实现（分批）都不同，不能直接当性能对比。

## 原文摘要

> To synthesize high-fidelity samples, diffusion models typically require auxiliary data to guide the generation process. However, it is impractical to procure the painstaking patch-level annotation effort required in specialized domains like histopathology and satellite imagery; it is often performed by domain experts and involves hundreds of millions of patches. Modern-day self-supervised learning (SSL) representations encode rich semantic and visual information. In this paper, we posit that such representations are expressive enough to act as proxies to fine-grained human labels. We introduce a novel approach that trains diffusion models conditioned on embeddings from SSL. Our diffusion models successfully project these features back to high-quality histopathology and remote sensing images. In addition, we construct larger images by assembling spatially consistent patches inferred from SSL embeddings, preserving long-range dependencies. Augmenting real data by generating variations of real images improves downstream classifier accuracy for patch-level and larger, image-scale classification tasks. Our models are effective even on datasets not encountered during training, demonstrating their robustness and generalizability. Generating images from learned embeddings is agnostic to the source of the embeddings. The SSL embeddings used to generate a large image can either be extracted from a reference image, or sampled from an auxiliary model conditioned on any related modality (e.g. class labels, text, genomic data). As proof of concept, we introduce the text-to-large image synthesis paradigm where we successfully synthesize large pathology and satellite images out of text descriptions.

*来源：arXiv:2312.07330；逐字原文，未改写、未压缩。*

## 中文摘要

> 为合成高保真样本，扩散模型通常需要辅助数据来引导生成过程。然而，在组织病理学与卫星影像这类专业领域中，获取所需的逐 patch 标注代价不切实际：这通常由领域专家完成，且涉及上亿张 patch。现代自监督学习（SSL）表征编码了丰富的语义与视觉信息。本文提出，这类表征的表达能力足以充当细粒度人工标注的代理。我们引入一种新方法，训练以 SSL 嵌入为条件的扩散模型。我们的扩散模型能够成功把这些特征投影回高质量的组织病理学与遥感图像。此外，我们通过组装由 SSL 嵌入推断出的、空间一致的 patch 来构造更大的图像，从而保留长程依赖。通过生成真实图像的变体来增广真实数据，可提升 patch 级与更大规模的图像级分类任务的下游分类器准确率。我们的模型即使在训练中未见过的数据集上同样有效，展现了其鲁棒性与泛化能力。由学习到的嵌入生成图像与嵌入的来源无关：用于生成大图的 SSL 嵌入既可以提取自参考图像，也可以从以任意相关模态（例如类别标签、文本、基因组数据）为条件的辅助模型中采样得到。作为概念验证，我们提出文本到大图合成这一范式，并成功从文本描述合成了大型病理与卫星图像。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2312.07330)
- [arXiv HTML 正文](https://arxiv.org/html/2312.07330v2)
- [CVF Open Access 页面](https://openaccess.thecvf.com/content/CVPR2024/html/Graikos_Learned_Representation-Guided_Diffusion_Models_for_Large-Image_Generation_CVPR_2024_paper.html)
- [官方代码 Large-Image-Diffusion](https://github.com/cvlab-stonybrook/Large-Image-Diffusion)
