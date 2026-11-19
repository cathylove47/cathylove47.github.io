# 98｜UniPath：把病理 MLLM 的诊断语义 token 接进 PixArt-α，用三流条件做可控 patch 生成

**论文**：Beyond Pixel Simulation: Pathology Image Generation via Diagnostic Semantic Tokens and Prototype Control；arXiv:2512.21058（v1 2025-12-24，v2 2026-02-26）；CVPR 2026 正式发表，pp. 42744–42754（CVF Open Access 版可下载，最终版在 IEEE Xplore）。
**作者**：Minghao Han, YiChen Liu, Yizhou Liu, Zizhi Chen, Jingqun Tang, Xuecheng Wu, Dingkang Yang, Lihua Zhang（复旦 / Fysics AI / 北科大 / 字节 / 西交）。
**定位**：384² patch 的文本到图像生成。重点不在生成器更大，而在**条件从哪来**：把冻结病理 MLLM 读出的诊断语义当主条件，把术语漂移交给 MLLM 内部归一化，把形态细节交给检索到的真实原型。
**精读核验**：2026-11-18 读 arXiv v2 全文 HTML（§1–7 与附录 A–F；Table 1/2、Table S1–S4 逐格读；Fig. 4/5 只读到图注与正文描述，图内数值未读）；核对 CVF Open Access 论文页（标题、作者、页码 42744–42754）；核对官方仓库 `Hanminghao/UniPath` main @`ca5f437`（最后 push 2026-02-26）的 `docs/README.md`、`src/inference.py`、`src/unipath/model/language_model/blip3o_qwen_inference.py`、`src/unipath/retrieval/multimodal_retrieval.py`、`src/unipath/retrieval/vocab_query_matcher.py`、`src/unipath/model/pixcell_dit.py`；核对 HF 数据集 `minghaofdu/UniPath-1M`、`UniPath-68K` 的文件清单与权重 `UniPath-7B`（**需授权，未下载**）。未训练、未运行推理。

| 项 | 内容 |
|---|---|
| 数据 | 1.62M 公开对（PathGen-1.6M）+ 1.03M 从 69,044 张 HISTAI WSI 抽的 patch = 2.65M；另筛 68K 高质量子集 = 8K 原型库 + 10K 测试 + 50K 精调 |
| 理解骨干 | Patho-R1 7B（Qwen2.5-VL 7B 后训练），**全程冻结** |
| 生成骨干 | 0.6B DiT（PixArt-α 系，28 层 / 16 头 / 1152 维），SD3 VAE（8× 下采样），flow matching |
| 条件 | 64 个可学习 query 的 DST + 原始文本嵌入 + $K_m{=}16$ 个检索原型特征，拼接后 cross-attention 注入 |
| 训练 | Stage 1：2.58M 对、10k step、bs 512、lr $1e^{-4}$ cosine；Stage 2：50K、500 step、lr $2e^{-5}$；16×H100 |
| 推理 | Euler 30 步，CFG 3.0，输出 384² |
| 主要数字 | FID 25.70、Patho-FID 80.86、Patho-KID 0.134、LPIPS 0.570、CONCH CLIP 0.348 |
| 代码/权重 | 仓库只有推理代码 + CONCH 封装；权重需授权；数据集公开（1M 为 parquet 图文，68K 为 h5） |

## 30 秒看懂

**一句话**：UniPath 把"冻结的病理 MLLM 读出的诊断语义"和"CONCH 检索到的真实形态原型"一起当条件，喂给一个 0.6B 的 PixArt-α，Patho-FID 80.86，第二名 PixCell 是 163.44。

**问题**：病理 T2I 卡在三件事——图文对少；语义控制粗（只能靠分割掩码或参考图）；同一个诊断概念各家各写一套说法，通用文本编码器对不齐。

**瓶颈**：生成器只有 0.6B、输出 384²、原型库只有 8K 实例；评测用的 10K 测试集本身是 MLLM 写描述 + 专家抽检（93.6% 可用），标注质量就是分数上限。

**insight**：生成的上限被"条件里有没有诊断语义"卡住，不是被参数卡住。诊断语义已经在冻结的 MLLM 里，把它用可学习 query 读出来，比换更大生成器便宜；术语漂移交给 MLLM 内部消化；形态细节靠检索真实 patch 补齐。

## 3 分钟讲清

**方法（按顺序）**：
1. HISTAI 69,044 张 WSI 用 TRIDENT 切 384²/20×，CONCH 特征上并行两路：LLM 按诊断与镜下结论生成查询做知识检索（取典型区），K-means 按簇采样（取长尾）；UNI2-h 余弦 >0.95 去重，PathGen-LLaVA 写描述、Qwen3-8B 压到约 35 词，得 1.03M。
2. 68K 精筛：2.6M 上 K-means(128)，拉普拉斯方差砍掉最糊的 50%，Qwen3-VL 8B 剔坏片；Gemini-2.5 Pro 重写、GPT-5 复核，按簇比例分成 8K 原型库 / 10K 测试 / 50K 精调，专家抽检 500 张 93.6% 可用。
3. 理解侧：在 prompt 嵌入后拼 64 个可学习 query，冻结 Patho-R1 走一遍，取末层**尾部 64 个位置**的 hidden state，过 LN+MLP 得 64 个 Diagnostic Semantic Tokens（DST）。
4. 原型侧：CONCH 编码 prompt 得 $q$，在 8K 的文本/视觉两个稠密索引各取 top-4，再用倒排索引取 prompt 里**最稀有**的 4 个病理词各 2 个样本，并集裁到 16 个，取 UNI2-h 特征过 MLP。
5. 三流拼成 $C_{comp}$ 经 cross-attention 注入 DiT；SD3 VAE latent 上用 flow matching 回归速度场，两阶段训练。
6. 推理 Euler 30 步、CFG 3.0；同一 prompt 换 seed 出图。

**作者证据在哪**：Table 1（Patho-FID 80.86 对 PixCell 163.44、FID 25.70 对 80.74；代价是 CONCH CLIP 0.348 输给 Show-o2 的 0.357）、Table 2 的 G2R 探针（细胞学 F1 81.43/AUC 84.05，真图上限 83.43/87.15；出血类加 5 张增广后 AUC 到真图的 98.7%）、Table S4 的检索消融（全策略 80.86/0.348，仅局部 91.45，仅文本 87.52）、Table S2 换 Virchow2/MUSK 复核（FID 484.38 对 PixCell 929.30）、Table S3 的 few-shot（K=2 增广 +2.31 F1，K=4 +2.72）。

**和上一代的区别**：PathLDM 是单癌种、粗粒度文本；PixCell 原生图像条件（本文为了比 T2I，用 CONCH 检索一张图当它的条件，作者自己承认是"便利改造"）；ToPoFM/PathDiff 靠拓扑或掩码这类非语义控制。UniPath 换的是"条件的来源"，不是生成器家族——生成器反而更小（0.6B）。

**讲 PPT 用这张**：Fig. 2 的三流融合图 + Table 1 的 Patho-FID 一列；如果要讲"术语漂移"，用 Fig. 6 下半的同义改写对照。

## 1. 问题及研究位置

- **理解与生成两条线没交汇**：病理 MLLM 已经接近诊断级（Patho-R1、CPath-Omni、Quilt-LLaVA），生成模型却还在追感知真实感，条件要么是掩码、要么是参考图，文本条件最多是单癌种粗标签。
- **三个耦合瓶颈**（作者口径）：(i) 图文对稀缺——WSI 千兆像素、亚专科标注贵；(ii) 缺细粒度语义控制——所以绕去用非语义线索；(iii) 术语异质——同一概念不同机构不同写法，通用文本编码器对不齐。
- **本文的答案是一条"接口"而不是一个新生成器**：理解侧完全冻结（保语义、也保住 PathMMU 上的分数），只训 MSC 与 DiT；把"术语归一化"这件事外包给已经在病理语料上后训练过的 MLLM。

| 相邻工作 | 做法 | UniPath 的差别 |
|---|---|---|
| [PathLDM](71-pathldm.md) | 文本条件 latent diffusion，单癌种、粗粒度 | 多流条件 + 2.65M 多器官语料；文本条件不再是一句话一个标签 |
| [PixCell](89-pixcell.md) | 原生图像条件（UNI 嵌入）生成 1024² | 本文用文本为主条件；生成器同为 0.6B 级但只出 384²。对比 PixCell 时用检索图替代其图像条件，属便利改造 |
| [CytoSyn](66-cytosyn.md) | 细胞级结构/布局条件合成 | 一个要几何先验，一个要语义先验；本文不保证细胞空间排布 |
| [BigCell](64-bigcell.md) | 千兆像素拼接与自适应滑窗 | 本文只做 384² tile，**不处理拼接**；互补而非竞争 |
| ToPoFM / PathDiff | 拓扑约束 / 掩码条件 | 本文反对非语义控制，主张语义流 + 原型流 |
| BLIP3o / Show-o2 | 通用统一多模态模型 | 直接全量微调后仍是本文主要对手（Show-o2 CLIP 更高），说明"统一架构"不是充分条件 |

## 2. 核心方法和数据流

```text
数据（离线）:
  HISTAI 69,044 WSI --TRIDENT--> 384²/20× patch --CONCH 特征-->
     分支A: LLM 生成器官/镜下结论查询 → 余弦检索典型区
     分支B: K-means 按簇采样 → 长尾覆盖
  → UNI2-h 去重(>0.95) → PathGen-LLaVA 描述 → Qwen3-8B 压缩  ⇒ 1.03M
  ∪ PathGen-1.6M  ⇒ 2.65M
  68K: K-means(128)+拉普拉斯方差+Qwen3-VL 质检 → Gemini-2.5 Pro 重写 → GPT-5 复核
      ⇒ 8K 原型库 / 10K 测试 / 50K 精调

训练（每步）:
  caption → [E_prompt ; Q^(0)∈R^{64×d}] → 冻结 Patho-R1(7B)
      → Tail_64(S^(L)) = DST (64×d) → LN+MLP → C_DST
  caption → MLP_RTS → C_RTS
  caption → CONCH_text → q (L2 norm)
      → TopK_4(I_text·q) ∪ TopK_4(I_vision·q)          (全局)
      → 4 个最稀有词 × 2 样本（倒排索引）                (局部)
      → 并集裁到 K_m=16 → Proto[·] (UNI2-h) → MLP_PS → C_PS
  C_comp = [C_DST ; C_RTS ; C_PS]
  z_0 = VAE(img), z_1~N(0,I), z_t = t·z_0+(1-t)·z_1, v_t = z_0-z_1
  L = ||v_θ(z_t, t, C_comp) - v_t||²

推理:
  prompt → 同上三流 → Euler 30 步 + CFG 3.0 → VAE decode → 384²
```

**（a）DST 为什么可能有效。** 64 个 query 拼在 prompt 后面，冻结骨干的因果注意力让它们只能"读到"prompt 与彼此；训练信号只来自生成损失，所以它们被逼成一组"对改写不敏感"的语义槽。代价是这 64 个槽**没有显式监督**，你无法保证某一个槽对应"核异型性"——可解释性来自行为（Fig. 6 下半的同义改写一致性），不是结构。

**（b）原型流是检索，不是学习。** 8K 是**真实实例**而非 K-means 中心（作者明说为了保形态多样性）；索引与特征全部离线、冻结，训练与推理一致。因此它在推理时可以直接改 $K_m$ 与检索配比而不重训——Table S4 与 Fig. S4 就是这么做出来的。

**（c）为什么用 0.6B PixArt-α + flow matching。** 作者给的理由是效率：比 SDXL(2.3B)、Next-DiT(2B) 小，匹配领域数据量；把 DDPM 目标换成 FM 为了收敛与推理步数。代码里 DiT 实现文件叫 `pixcell_dit.py`，是从 PixCell-256 那套 PixArt 风格实现改的——所以"更小的 PixArt"同时也是"PixCell 的生成器骨架"。

**（d）两阶段是数据质量分层，不是课程学习。** Stage 1 学对齐（2.58M，含噪声描述），Stage 2 用 50K 高保真 + 小 lr 只 500 步，把分布往"专家认可的描述—图像对"上拉。Fig. 5 的蓝线（TCGA 1.62M → +1.03M → +50K）就是这个论证；图内数值未给表。

**（e）成本口径**：抽 patch + 过滤在 1 张 A800 上跑了**一个月**，标注在 16 张 H100 上近 4 天；训练 16×H100。这是"数据工程占大头"的典型工作，复现门槛主要不在模型。

## 3. 论文证据与实验范围

**Table 1：10K 高质量测试集上的保真与对齐（摘关键列；★ 为在本文数据上全量微调）**

| 模型 | FID ↓ | KID ↓ | Patho-FID ↓ | Patho-KID ↓ | LPIPS ↓ | CLIP ↑ |
|---|---|---|---|---|---|---|
| Real Data | — | — | — | — | — | 0.372 |
| SD1.5★ | 160.36 | 0.221 | 259.69 | 0.321 | 0.634 | 0.147 |
| SDXL★ | 291.17 | 0.305 | 295.50 | 0.343 | 0.657 | −0.035 |
| PixArt-α★ | 270.36 | 0.277 | 336.78 | 0.401 | 0.603 | 0.105 |
| BLIP3o★ | 95.04 | 0.183 | 358.61 | 0.431 | 0.598 | 0.080 |
| Show-o2★ | 98.82 | 0.200 | 184.19 | 0.239 | 0.601 | **0.357** |
| PixCell | 80.74 | 0.119 | 163.44 | 0.177 | 0.602 | — |
| PathLDM | 93.91 | 0.170 | 174.32 | 0.254 | 0.606 | 0.182 |
| UniMedVL | 156.17 | 0.219 | 216.27 | 0.255 | 0.619 | 0.319 |
| **UniPath** | **25.70** | **0.081** | **80.86** | **0.134** | **0.570** | 0.348 |

读法：FID 比 PixCell 低约 68%，Patho-FID 相对第二名低 50.5%（摘要写"51% better"，表里是 80.86，摘要写 80.9）。**唯一输的一格是 CLIP**：作者在附录 A 用"评测同源"解释——Show-o2 的语义 token 被蒸馏到 SigLIP 空间，而 CONCH 属 CLIP 家族，同源自然高分；并给出三条旁证（I2I 检索、MLLM 裁判、下游 F1）。这个解释合理但不可完全证伪：它同时意味着 CONCH CLIP 在这个对比里不是中立裁判。

**检索指标（T2I / I2I，表格右半，摘三行）**

| 模型 | R@10 | R@50 | mAP@10 | mAP@50 |
|---|---|---|---|---|
| Real Data | 9.60/— | 27.55/— | 3.45/— | 4.21/— |
| Show-o2 | **4.64**/2.40 | **15.26**/8.15 | **5.85**/2.74 | **5.50**/2.58 |
| UniPath | 3.92/**3.30** | 14.08/**11.92** | 5.66/**4.64** | 5.54/**4.67** |

T2I 略输 Show-o2，I2I 全面领先（mAP@10 4.64 对 2.74）。注意一个口径疑点：**Real Data 行的检索 mAP 低于生成图**（3.45 对 4.64），作者没解释；我的看法是 gallery/查询构造让真实图存在自匹配惩罚或分布偏移，这行不能当"真图上限"读，只能当参考。

**Table 2：细粒度语义可控（Train-on-Synth, Test-on-Real，CONCH 冻结特征上的线性探针）**

| 方法 | 细胞学类型 F1 / AUC | 出血 F1 / AUC |
|---|---|---|
| Real Data-Image（R2R 上限） | 83.43 / 87.15 | 78.13 / 80.11 |
| Real Data-Text | 95.22 / 98.59 | 83.09 / 88.29 |
| PixCell | 76.37 / 83.22 | 71.57 / 71.59 |
| Show-o2 | 77.82 / 66.89 | 72.44 / 71.72 |
| UniMedVL | 78.21 / 72.43 | 68.05 / 65.36 |
| **UniPath** | **81.43 / 84.05** | **74.96 / 75.27** |
| UniPath-Aug（每 prompt 5 张） | 81.49 / **85.29** | **77.02 / 79.03** |

这是比 FID 更有信息量的一档：**只训合成图、在真图测试**。细胞学 F1 与真图差 2.0，出血类 AUC 经增广到真图的 98.7%（摘要的 98.7% 就指这一格）；细胞学增广后是 97.9%。同时要看到：UniPath 在出血 F1 上仍比真图低 3.2，说明"可学习"不等于"等价"。

**Table S3：Kather-CRC-2016 7 类 few-shot 增广（Weighted F1，5 seeds）**

| K | 仅真图 | UniPath 增广 | Δ | Show-o2 Δ | PixCell Δ |
|---|---|---|---|---|---|
| 2 | 67.34 | 69.65 | **+2.31** | +1.34 | −0.28 |
| 4 | 76.42 | 79.14 | **+2.72** | +1.28 | +0.71 |
| 8 | 81.43 | 82.22 | +0.79 | +0.33 | −0.43 |
| 16 | 83.85 | 85.39 | **+1.54** | +0.66 | +0.34 |
| 32 | 86.88 | 87.15 | +0.27 | +0.09 | +0.05 |

只有 UniPath 与 Show-o2 在每个 K 上都是正增益。注意同表里另有一行"UniPath (Ours) 50.31@K=2"，分组标题写的是 "Baselines (Only Real Data)"，原文未说明该行训练数据是纯合成还是别的——**不要引用这一行**。

**Table S4：原型检索消融（Patho-FID / CLIP）**

| 配置 | Patho-FID ↓ | CLIP ↑ |
|---|---|---|
| 仅全局-文本 | 87.52 | 0.327 |
| 仅全局-视觉 | 83.10 | 0.336 |
| 全局-混合 | 82.04 | 0.342 |
| 仅局部（稀疏关键词） | 91.45 | 0.325 |
| 全局+局部（完整） | **80.86** | **0.348** |

结论是"局部稀疏只能补、不能单独用"：单用局部比单用文本还差 3.9。$K_m$ 敏感性只给了 Fig. S4（0/4/8/16/32，16 最优，32 引入噪声），**无表格数值**。

**旁证**：PathMMU 全测试集 65.7（tiny 68.3），开源第一，接近 Gemini-2.5 Pro 的 68.0；EduContent 73.9、Atlas 77.7 为全模型最高。裁判一致性：GPT-5 对最强基线偏好 UniPath 72%，Gemini-2.5 Pro 71%，3 位病理医生 74%（500 对，Fleiss κ 0.7509）。换 Virchow2 提特征 FID 484.38 对 PixCell 929.30；换 MUSK 时 I2I mAP@10 6.38 对 Show-o2 3.22。泄漏核查：8K×10K 共 8000 万对比，最大 UNI2-h 相似度 0.9416 < 去重阈值 0.95。

## 4. 复现与审计重点

**论文公式 ↔ 代码位置**

| 论文 | 代码 | 状态 |
|---|---|---|
| 式(1)(2)：拼 $N_q$ 个可学习 query、取末层尾部 hidden state 得 DST | `blip3o_qwen_inference.py::generate_image`：`latent_queries` 拼到 `text_embeds` 后，`hidden_states[-1][:, -N_QUERY:, :]` → `down_projector` | 一致（投影层在代码里叫 `down_projector`，论文叫 $\mathrm{MLP}_{DST}$） |
| 式(3)：CONCH 编码 prompt 得 $q$ | `multimodal_retrieval.py`：优先读 h5 里预抽的 `conch_text_features`/`conch_visual_features`/`uni2h_features` | 一致，但库侧是**预抽取**特征，不重新编码 |
| 式(4)(5)：文本/视觉 top-$k$ ∪ 局部倒排，裁到 $K_m$ | `retrieve(..., top_k=4, max_samples=16)`；`keyword_retrieval(max_keywords=4, samples_per_keyword=2)`，按 `doc_count` 升序取最少见的 4 个词 | 一致（代码的"最稀有"= 倒排文档数最少） |
| 式(6)：$C_{comp}=[C_{DST};C_{RTS};C_{PS}]$ | `encoder_hidden_states = cat([user_text_embeds, img_hidden_states, proto_features])` | **顺序不同**：代码是 RTS→DST→PS。cross-attention 无序，功能等价，但对照实现时别照论文顺序对位 |
| 式(7)(8)(9)：$z_t=tz_0+(1-t)z_1$、$v_t=z_0-z_1$ | `sample_images`：`FlowMatchEulerDiscreteScheduler`（从 `Alpha-VLLM/Lumina-Next-SFT-diffusers` 在线加载），`sigmas = linspace(1, 1/30, 30)` | **记号相反**：论文 $t{=}1$ 是干净数据，代码 sigma$=1$ 是纯噪声；训练侧对应关系代码未给（无训练代码），无法核实 |
| CFG | `img_hidden_states_null = zeros_like(encoder_hidden_states)`，`guidance_scale=3.0` | 与"空 prompt"CFG 不同：uncond 是**整段条件置零**。这是实现选择，论文未写 |

**代码/论文不一致与缺口**：
1. `src/inference.py` 里 `AutoProcessor.from_pretrained("/home/hmh/nas/model_weight/Qwen2.5-VL-7B-Instruct")` 是作者机器的绝对路径，且这个 `processor` 变量之后**没被用到**（分词在 `load_pretrained_model` 内部做）。外部复现必须先删/改这一行。
2. `src/unipath/model/__init__.py` 的 lazy export 仍映射到 `blip3o.model.language_model.*`（该包不存在），是从 BLIP3o 继承后没清干净；`inference.py` 直接 import `builder`，所以不影响跑通，但任何 `from unipath.model import blip3oQwenForInferenceLM` 都会炸。
3. **没有训练代码**：仓库只有推理、CONCH 封装、DiT 定义；Stage 1/2 的 MSC 投影层初始化、query 初始化、原型投影器训练方式都不可复现。
4. 原型库四个文件（`llm_filtered_vocab_gemini_pro.txt`、`keyword_inverted_index.json`、`selected_8k.h5`、`images/`）不在仓库，需从 HF `UniPath-68K` 的 `RAG_8K/` 取；`images/` 需用仓库外的 `extract_patches_from_h5.py` 生成。
5. 权重 `UniPath-7B` 是 **gated**（"Access to model ... is restricted"），需申请；1M/68K 数据集公开。
6. 仓库根目录没有 README（只有 `docs/README.md`），HF 卡片与 GitHub 的 quickstart 都以 `src/inference.py` 为准。
7. Fig. 5 的数据消融与 MSC 消融**只有图**，无表；正文给的是方向性结论（RTS-only 最差、HLS 主要抬对齐、PS 两者都抬、HLS+PS 反而对齐差）。引用幅度时不能用。

**首个可做的实验（不需要训练，约两小时）**：
1. 从 HF 下 `UniPath-68K`，解出 `RAG_8K/images`，用仓库自带 prompt（"solid sheets / marked pleomorphism / extensive hemorrhage"）跑 5 seeds，确认 Fig. S5 里那几个成分都能出现。
2. 同一 seed 下把 `retriever=None` 再跑一遍，比较 UNI2-h Patho-FID 与 CONCH 相似度——Table S4 给了 $K_m{=}0$ 之外的配置，但 **$K_m{=}0$ 的数值只在 Fig. S4 里**，这一步等于把那张图的关键点补成数字。
3. 再做术语鲁棒性：把同一诊断写成 3 种说法（不同机构风格），看 DST 条件下的生成是否收敛到同一形态、而 RTS-only 是否漂移。这是本文最强的行为主张，也是最容易被推翻的一格。

**给病理方向的迁移问题**：本文的 DST 只吃 patch 级 caption。如果把条件换成 WSI 级报告（更长、术语更乱、含阴性描述），HLS 是否还能给出稳定的语义槽？以及跨机构（TCGA vs HISTAI）时，原型库覆盖不到的稀有形态会不会让 PS 流退化成噪声——附录 A 自己承认这是硬依赖。

**局限（作者承认 + 我的补充）**：
- 分辨率 384²，作者列为未来工作；千兆像素要靠外部拼接（见 [BigCell](64-bigcell.md) 那条线）。
- 依赖 8K 原型库覆盖，稀有形态无法精确控制（作者承认）。
- 评测集是 MLLM 生成描述 + 专家抽检 93.6%，6.4% 不可用样本仍在测试集里；这在 10K 规模上意味着约 640 对噪声标签，FID 之外的指标都应带这个误差读（我的看法，作者未讨论）。
- 生成器 0.6B + 单阶段 10k step，规模不大；"语义优先"的收益有多少来自数据（2.65M/68K）而非 MSC，Fig. 5 的两条线没有交叉消融（数据×结构），无法分离。

## 5. 建议阅读顺序

Fig. 2（三流怎么接）→ §3.1–3.2（数据怎么来的，这决定上限）→ §4.2 式(1)–(6)（DST 与原型检索）→ Table 1（保真与 CLIP 的那一格反常）→ Table 2（G2R 探针）→ 附录 A（作者对 CLIP 落后的自辩）→ Table S4 + Fig. S4（原型到底贡献多少）→ Table S3（few-shot）→ 附录 E.5（泄漏核查）→ 附录 A 的限制。

## 6. 前后关联

- [PathLDM](71-pathldm.md)：文本条件病理生成的上一代基线，单癌种 + 粗粒度；本文在 Table 1 里把它全面压过（Patho-FID 80.86 对 174.32）。
- [PixCell](89-pixcell.md)：原生图像条件的规模化路线，生成器同源（`pixcell_dit.py`）；本文的对比把它的图像条件换成 CONCH 检索图，属便利改造，引用这格数字时要说明。
- [CytoSyn](66-cytosyn.md)：细胞级布局条件 vs 本文语义条件；两者可以叠加（先用 CytoSyn 定布局，再用 UniPath 定诊断语义）。
- [BigCell](64-bigcell.md)：本文只出 384² tile，拼接问题完全交给外部；把 UniPath 当 tile 生成器嵌进 BigCell 的画布是自然的组合实验。
- [HistDiT](62-histdit.md)：同为 CVPR 2026 前后的病理生成，HistDiT 走结构条件虚拟染色，本文走文本条件合成，可对照"条件的信息类型"。
- [SheafStain](91-sheafstain.md)：那篇证明"条件必须逐位置"，本文的条件是全局语义 + 16 个原型——两者对"条件该多细"给出相反答案，正好是讨论点。

## 原文摘要

> In computational pathology, understanding and generation have evolved along disparate paths: advanced understanding models already exhibit diagnostic-level competence, whereas generative models largely simulate pixels. Progress remains hindered by three coupled factors: the scarcity of large, high-quality image–text corpora; the lack of precise, fine-grained semantic control, which forces reliance on non-semantic cues; and terminological heterogeneity, where diverse phrasings for the same diagnostic concept impede reliable text conditioning. We introduce UniPath, a semantics-driven pathology image generation framework that leverages mature diagnostic understanding to enable controllable generation. UniPath implements Multi-Stream Control: a Raw-Text stream; a High-Level Semantics stream that uses learnable queries to a frozen pathology MLLM to distill paraphrase-robust Diagnostic Semantic Tokens and to expand prompts into diagnosis-aware attribute bundles; and a Prototype stream that affords component-level morphological control via a prototype bank. On the data front, we curate a 2.65M image–text corpus and a finely annotated, high-quality 68K subset to alleviate data scarcity. For a comprehensive assessment, we establish a four-tier evaluation hierarchy tailored to pathology. Extensive experiments demonstrate UniPath's SOTA performance, including a Patho-FID of 80.9 (51% better than the second-best) and fine-grained semantic control achieving 98.7% of the real-image. The dataset and code can be obtained from this https URL.

*来源：[arXiv:2512.21058v2 摘要页](https://arxiv.org/abs/2512.21058v2)（2026-02-26）。arXiv HTML 把末尾链接渲染为 "this https URL"，此处保留原样；实际指向 https://github.com/Hanminghao/UniPath 。*

## 7. 链接

- [CVPR 2026 Open Access 论文页](https://openaccess.thecvf.com/content/CVPR2026/html/Han_Beyond_Pixel_Simulation_Pathology_Image_Generation_via_Diagnostic_Semantic_Tokens_CVPR_2026_paper.html)（pp. 42744–42754）
- [arXiv abs（v2）](https://arxiv.org/abs/2512.21058v2) · [HTML 全文](https://arxiv.org/html/2512.21058v2)
- [官方代码](https://github.com/Hanminghao/UniPath)（main @ca5f437，2026-02-26）
- [权重 UniPath-7B](https://huggingface.co/minghaofdu/UniPath-7B)（需授权）· [数据 UniPath-1M](https://huggingface.co/datasets/minghaofdu/UniPath-1M) · [数据 UniPath-68K](https://huggingface.co/datasets/minghaofdu/UniPath-68K)
- [Patho-R1](https://github.com/Wenchuan-Zhang/Patho-R1)（冻结理解骨干）· [CONCH](https://huggingface.co/MahmoodLab/CONCH)（检索编码器）
