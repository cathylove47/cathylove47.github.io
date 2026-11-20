# 102｜HARP：检测—定位—扩散修复，一条全无监督的病理伪影流水线

**论文**：HARP: Unsupervised Histopathology Artifact Restoration
**作者**：Moritz Fuchs、Ssharvien Kumar R Sivakumar、Mirko Schöber（TU Darmstadt, GRIS）；Niklas Woltering、Leonille Schweizer（Goethe University Frankfurt Medical School）；Marie-Lisa Eich（Charité–Universitätsmedizin Berlin）；Anirban Mukhopadhyay（TU Darmstadt）
**发表**：MIDL 2024（Full paper track），PMLR 250:465–479；PMLR 页面 2024-12-23 上线
**定位**：病理伪影修复的"全流水线"工作。它不只是一个修复网络，而是把异常检测（FastFlow）、无监督定位（SAM + DBSCAN + 扩散重建热图）、扩散 inpainting 修复（Palette 架构 + RePaint 式 jump/resample 采样）串成一条不需要任何伪影标注的链
**核验**：2026-11-19 依 PMLR 官方 PDF（`proceedings.mlr.press/v250/fuchs24a.html` 所链 `fuchs24a.pdf`）通读正文 §1–5 与附录 A–D，逐字核对 Table 1–5 的数字；代码对照 `github.com/MECLabTUDA/HARP` 的 `main` 分支（`harp_pipeline.py`、`harp/pipeline/*.py`、`harp/models/network.py`、`config/*.json`）与 Hugging Face `SsharvienKumar/HARP_Models` 的文件清单。**本页的论文数字均为论文报告值；本人自跑观察单独放在 §5.2，两者不混用。**

| 项 | 内容 |
|---|---|
| 任务 | 病理 patch 级伪影检测 → 定位 → 修复 → 再检测选优 |
| 输入 / 输出 | 256×256 RGB patch（原始 600×600 @0.24 mpp 下采样）；输出修复图 + 使用的像素掩码 |
| 训练数据 | BCSS：11,075 训练 / 1,031 验证 / 1,000 测试 patch；只从无伪影 patch 取样（伪影靠 FrOoDo 合成） |
| 伪影类型 | 10 类（暗斑、脂肪滴、鳞状上皮、线头、血细胞、血团、压缩、切口、气泡、重叠/折叠），每类 100 张测试样本 |
| 下游任务 | FCN8 四类组织分割（tumor 45%、stroma 17%、lymphocyte-rich 35%、necrosis 3%），DICE 评价 |
| 代码 / 权重 | 公开：仓库 CC BY 4.0；PyPI 包 `HARPipe`；FastFlow、SAM ViT-H、修复模型权重与数据集均在 HF `SsharvienKumar/HARP_Models`（MIT） |

## 原文摘要

> Histopathological analysis, vital for medical diagnostics, is often challenged by artifacts insample preparation and imaging, such as staining inconsistencies and physical obstructions.Addressing this, our work introduces a novel, fully unsupervised histopathological artifactrestoration pipeline (HARP). HARP integrates artifact detection, localization, and restorationinto one pipeline. The first step to make artifact restoration applicable is an analysisof anomaly detection algorithms. Then, HARP leverages the power of unsupervised segmentationtechniques to propose localizations for potential artifacts, for which we select thebest localization based on our novel inpainting denoising diffusion model. Finally, HARPemploys an inpainting model for artifact restoration while conditioning it on the artifact localizations.We evaluate the artifact detection quality along with the image reconstructionquality, surpassing the state-of-the-art artifact restoration. Furthermore, we demonstratethat HARP improves the robustness and reliability of downstream models and show thatpathologists can not tell the difference between clean images and images restored throughHARP. This demonstrates that HARP significantly improves image quality and diagnosticreliability, enhancing histopathological examination accuracy for AI systems.

*来源：PMLR 250:465 摘要，逐字保留（原文 PDF 中 `insample`、`restorationinto` 等处即为连写，未改）。*

## 中文摘要

> 组织病理学分析对医学诊断至关重要，却常受样本制备与成像过程中产生的伪影困扰，例如染色不一致和物理遮挡。针对这一问题，本工作提出了一种全新的、完全无监督的组织病理伪影修复流水线（HARP）。HARP 把伪影检测、定位与修复整合进同一条流水线。要让伪影修复真正可用，第一步是对异常检测算法做分析。随后，HARP 借助无监督分割技术为潜在伪影提出候选定位，并依据我们新提出的 inpainting 去噪扩散模型从中选出最佳定位。最后，HARP 使用一个 inpainting 模型完成伪影修复，并以伪影定位为条件。我们同时评价了伪影检测质量与图像重建质量，结果超越了当前最好的伪影修复方法。此外，我们证明 HARP 提升了下游模型的鲁棒性与可靠性，并表明病理学家无法区分干净图像与经 HARP 修复的图像。这说明 HARP 显著提升了图像质量与诊断可靠性，从而增强了 AI 系统在组织病理检查中的准确率。

*译文：逐句对译上方原文摘要，未增删内容。*

## 0. 三分钟摘要

**一句话**：先用 normalizing-flow 异常检测判断"这张 patch 有没有伪影"，再用 SAM+DBSCAN 生成一堆候选掩码、用扩散模型自身的重建残差给它们排序，最后用同一个扩散模型逐个掩码做 inpainting，挑 FastFlow 打分最低的那张。

**问题**：病理伪影修复此前全是有监督的——ArtiFusion（He et al., MICCAI 2023）要人工标注伪影掩码，AR-CycleGAN（Ke et al., TMI 2023）要一批带伪影的训练图。人工标注在 WSI 尺度上不可行，而只学会见过的伪影类型的模型遇到没见过的伪影就失效。作者的说法是：据其所知，此前没有一条"检测 + 修复"统一的无监督流水线。

**insight**：两个观察撑起了整条链。
1. **异常检测器可以当"伪影存在性"的判据**，而且不需要知道伪影是什么类。
2. **扩散模型不认识伪影**。把一张带伪影的图加噪到第 900 步再无条件去噪回来，模型会把"认识的"组织结构细节改掉一点，而"不认识的"伪影几乎原样保留；于是重建误差 $\|\bar y_0-y_0\|$ 在伪影处偏低，可以反过来当伪影的位置热图用。

**做到了什么**（论文报告）：
- 检测：FastFlow 平均准确率 **85.8%**，优于 DRÆM 83.9%、STFPM 74.9%。
- 定位：与合成伪影真值掩码的平均 DICE **54.5%**（线头 83.8%，血细胞只有 20.9%）。
- 修复：给出**真值掩码**时，本模型在 20 个 FID/PSNR 指标里赢 13 个；走完整无监督 HARP 时就不稳了（血团 FID 192.0，明显劣于 ArtiFusion 的 54.1）。
- 下游：BCSS 四类分割平均 DICE 从带伪影的 74.2 恢复到 78.0（干净图 81.5），把伪影造成的跌幅消掉 48%。
- 人评：4 位病理学家、50 对图，MCC 分别为 −0.071 / −0.159 / 0.239 / 0.296，作者结论是"看不出差别"。

### 实验先看什么

Table 1–2（同一模型在"真值掩码"与"无监督 HARP"两种设定下的巨大落差，全文最关键的一张对照）→ Table 5（每类伪影的定位 DICE，解释落差来源）→ Table 3（下游 DICE）→ §4 人评（MCC 与判错数）。

## 1. 问题与核心判断

- **伪影的代价是可量化的**：论文用同一批测试图（同一底图 + 同一分割真值）比较"干净 / 加伪影 / 加伪影但抠掉伪影区域 / HARP 修复"四种输入，下游 DICE 依次为 81.5 / 74.2 / 77.0 / 78.0。也就是说伪影让分割掉了 7.3 个点，而 HARP 拿回 3.8 个点。
- **为什么必须无监督**：伪影类型开放（10 类里既有暗斑这种局部的，也有血团这种铺满全图的），逐类标注不现实；而"只学见过的伪影"在分布外直接失效——论文用 AR-CycleGAN 做了这个反例：它需要伪影图像训练，换到未见伪影域后 FID 高达 86–180。
- **三类已有方法的前置条件**（§2 的批评）：RePaint / Palette / DDRM 这类通用 inpainting 依赖可预测的目标、预定义掩码、干净成对数据或大规模数据；病理场景这些都不成立。
- **核心判断**：修复质量的上限由**定位掩码的质量**决定，而不是由生成网络决定。作者的措辞是"关键改进空间在于无监督定位掩码的质量"。这个判断被 Table 1–2 与 Table 5 直接支撑：同一个网络，喂真值掩码就赢，喂 SAM/DBSCAN 掩码就输给 ArtiFusion。

## 2. 术语白话表

| 术语 | 白话 |
|---|---|
| FastFlow | 用 ViT 提特征、在潜空间做 normalizing flow 的异常检测器；训练只用正常图，输出"这图有多不正常"的分数 |
| AnomaLib / Anomalib | Intel 的异常检测库，论文用它统一跑了 CFA、CFLOW、DFM、DRÆM、FastFlow、PaDiM、PatchCore、STFPM 等 |
| SAM（Segment Anything） | 通用分割大模型；这里用 `SamAutomaticMaskGenerator` 无提示地吐出一堆候选物体掩码 |
| DBSCAN | 密度聚类；这里对"暗像素/亮像素"的极值点聚类，补出 SAM 可能漏掉的弥散伪影（如血团） |
| 激活图 / 重建热图 | 加噪到第 900 步再无条件下采样回来，与原图的绝对差；伪影处差得少 |
| jump sampling / resampling | RePaint 的两个技巧：往回跳若干步重新加噪（resample），以及在时间轴上前后往返（jump），用来让 inpainting 边界更协调 |
| DDIM/Palette 式条件 | 把条件图与当前噪声图在通道维拼接后送入 UNet（`in_channel=6`），每一步都看得到条件 |

## 3. 核心方法与数据流

```text
输入 patch y0 (256×256, 600px@0.24mpp 下采样)
  │
  ├─(1) 检测：FastFlow(y0) → 伪影分 pred
  │        pred < 阈值 0.63509 → 原图返回，流程结束
  │
  ├─(2) 定位热图：把 y0 加噪到 t=900，无条件去噪回 y0'
  │        重复 25 次（代码 15 次）→ 平均 |y0' - y0| → 阈值化 → 二值激活图 H
  │        （模型认识的正常结构被改写，不认识的伪影几乎不变 → 伪影处残差小）
  │
  ├─(3) 候选掩码：SAM 自动掩码 + DBSCAN 暗/亮两个簇掩码
  │        面积 >49% 的掩码取反；丢弃 <0.4% 或 >60%；DICE>0.97 的重复掩码丢弃
  │        用 H 在掩码内的激活量排序 → 取前 5 个
  │        10×10 椭圆核膨胀 1 次（DBSCAN 掩码膨胀 2 次，避免修复边界露馅）
  │
  ├─(4) 修复：对 5 个掩码分别 inpainting
  │        cond = y0 掩码外 + 掩码内高斯噪声（作为条件通道，每一步都喂）
  │        restoration_with_jump_sampling(resample=3, jump_length=10)
  │        每步之后强制 y_t = y0·(1-m) + y_t·m（掩码外像素严格保持不变）
  │
  └─(5) 选优：5 张修复图再送 FastFlow，取伪影分最低者输出（连同掩码）
```

### 3.1 检测（§3 第一段）

在 AnomaLib 里横向跑了 10 种方法（附录 Table 4，AUROC/F1/Accuracy 三指标，三个随机种子），挑出 DRÆM、FastFlow、STFPM 三个进入正式比较。正式比较的依据是：在验证集上取"保留 95% 正常样本"的分位数作阈值，然后看各伪影类型的检出情况（Fig. 3）。FastFlow 平均准确率 85.8%，主要漏检是鳞状上皮（它的外观和正常上皮太像）。

### 3.2 修复网络与训练（§3 第二段，Eq. 1）

条件扩散 $p(y\mid x)$，$x$ 是条件图，$y$ 是目标。训练时随机掩码 $m$，构造

$$\tilde x = y_T * m + y_0 * (1-m)$$

作为条件输入，损失

$$\mathbb{E}\,\big\| f_\theta\big(\tilde x,\; \underbrace{(\sqrt{\bar\alpha_t}\,y_0 + \sqrt{1-\bar\alpha_t}\,\epsilon)*m + y_0*(1-m)}_{\tilde y_t},\; t\big) - \epsilon \big\|_1$$

关键点是 $\tilde x$ **在每一步去噪都作为条件被喂入**（代码里是 `torch.cat([y_cond, y_t], dim=1)`，UNet 输入 6 通道），因此不像 RePaint 那样需要大量 resample 循环就能把边界协调好。作者声称这是"减少 RePaint 周期、把单张耗时压到 18.6 s"的原因。

训练掩码模式在配置里是 `hybrid`：随机 bbox 与 brush-stroke 不规则掩码取并集，另加 10% 的"角块"、10% 的"对角角块"、10% 的**空掩码**（`harp/data/dataset.py` 的 `get_mask`）。空掩码那 10% 相当于让模型也学会"什么都不用改"。

### 3.3 定位（§3 第三段）

这是全文最巧的一步，逻辑链是：
1. 模型在 BCSS 的**无伪影** patch 上训练，因此它"认识"正常组织，不认识伪影。
2. 把伪影图加噪到 900 步再去噪，正常结构的细微纹理会被重新"编"一遍（有偏），伪影则被原样保留（模型对它没有先验，只能照抄条件）。
3. 所以 $\|\bar y_0 - y_0\|$ 在伪影区偏低。用"激活量最低"来选掩码，等价于"最像模型不认识的东西"。

候选掩码来自两个互补来源：SAM 给"物体级"的整块（线头、切口、气泡），DBSCAN 给"像素级弥散"的簇（暗斑、血团）。掩码面积 >49% 时取反（说明它其实框住了背景），面积过滤 0.4%–60%，再按 DICE>0.97 去重。

### 3.4 修复推理

`cond_image = img*(1-mask) + mask*randn_like(img)`，即掩码内是纯噪声，掩码外是原图；`y_0` 也是这张带伪影的原图，每一步结束强制把掩码外像素贴回原图。所以**修复只在掩码内发生，掩码外逐像素等同原图**——这一点对"不要改动诊断信息"的诉求很重要，也是它比整图重绘安全的地方。

采样用 `restoration_with_jump_sampling`，默认 `resample=3, jump_length=10`，与论文正文的 "resampling = 3 and jumpsampling = 10" 一致。

### 3.5 主要超参（论文 vs 配置）

| 项 | 论文 | 仓库 `config/config_harp.json` |
|---|---|---|
| 加噪步数 `n_noising_step` | 900 | **100** |
| 热图重复次数 `n_iter` | 25 | **15** |
| 候选掩码 top-k | 5 | 5 |
| 检测阈值 | 未写具体值 | 0.63509 |
| 扩散步数 T | 1000 | 训练 1000（linear 1e-6→1e-2）；**测试 250**（linear 1e-4→0.09） |
| resample / jump | 3 / 10 | 3 / 10（代码默认值） |

也就是说：仓库默认配置复现不出论文的定位行为（100 步 vs 900 步差很多），要复现论文数字必须改这两项；测试期噪声调度也与训练不同，读代码时容易漏。

## 4. 实验与证据

**设置**：BCSS，600×600 @0.24 mpp 下采样到 256×256（等效约 0.56 µm/px）。伪影用 FrOoDo（Stieber et al. 2022）合成，论文说明这些伪影"已被证明真实且对下游有害"，每类 100 张测试。所有对照组里，ArtiFusion 与 DDRM 都被作者**用同一骨干在 BCSS 上重训**，且喂**真值伪影掩码**；AR-CycleGAN 用原始数据集训练；只有 HARP 那一行是完全无监督的。

**Table 1：前五种伪影（FID ↓ / PSNR ↑）**

| 方法 | 暗斑 | 鳞状上皮 | 线头 | 血细胞 | 血团 |
|---|---|---|---|---|---|
| ArtiFusion（真值掩码） | 78.3 / 19.6 | 25.7 / 24.4 | 40.4 / 21.3 | 48.3 / 22.7 | 54.1 / 20.7 |
| AR-CycleGAN | 98.4 / 17.0 | 77.8 / 19.4 | 114.2 / 17.7 | 179.3 / 17.3 | 130.6 / 16.9 |
| DDRM（真值掩码） | 85.8 / 20.6 | 38.1 / 24.2 | 51.5 / 21.4 | 65.6 / 21.8 | 61.9 / 20.8 |
| **Ours（真值掩码）** | 70.3 / 18.9 | **25.2** / 24.1 | **34.2** / 21.2 | **33.8** / 23.7 | **40.1** / 21.1 |
| HARP（无监督全流程） | **64.3** / 17.2 | 50.2 / 20.6 | 44.7 / 19.4 | 192.0 / 16.3 | 86.4 / 16.8 |

**Table 2：后五种伪影（FID ↓ / PSNR ↑）**

| 方法 | 压缩 | 切口 | 气泡 | 重叠 | 折叠 |
|---|---|---|---|---|---|
| ArtiFusion | 44.5 / 22.2 | 46.1 / 21.9 | 54.9 / 19.0 | 29.5 / 23.2 | 41.3 / 20.8 |
| AR-CycleGAN | 129.9 / 18.4 | 124.6 / 17.5 | 145.8 / 17.5 | 86.4 / 17.9 | 125.9 / 16.8 |
| DDRM | 52.8 / 22.5 | 53.2 / 22.3 | 69.1 / 19.4 | 41.0 / 23.1 | 50.8 / 20.9 |
| **Ours（真值掩码）** | **38.1** / 22.4 | **43.9** / 22.0 | **44.9** / 18.7 | **26.7** / 23.5 | **35.4** / 20.4 |
| HARP（无监督全流程） | 65.3 / 17.9 | 60.5 / 19.0 | 66.3 / 17.1 | 51.6 / 18.0 | 69.6 / 17.4 |

读表要点：
- 论文说"20 个结果里赢 13 个"，指的是 **Ours（真值掩码）** 那一行；DDRM 赢 5 个，ArtiFusion 赢 1 个。
- **HARP（无监督）那一行只在暗斑上赢**，其余全面落后于 ArtiFusion；血团 FID 192.0 是失败案例。作者归因于三点：检测失败、血团铺满全图导致掩码不完整、训练集里本来就有少量伪影于是被"忠实还原"。
- PSNR 与 FID 方向不一致（Ours 在暗斑上 FID 最好但 PSNR 只有 18.9，比 ArtiFusion 的 19.6 低），说明这两把尺子在修复任务上并不总能互相印证。

**Table 5：定位 DICE（HARP 掩码 vs 合成伪影真值）**

| 暗斑 | 鳞状上皮 | 线头 | 血细胞 | 血团 | 压缩 | 切口 | 气泡 | 重叠 | 折叠 | 平均 |
|---|---|---|---|---|---|---|---|---|---|---|
| 66.6 | 31.1 | 83.8 | 20.9 | 50.9 | 60.4 | 42.9 | 68.1 | 58.7 | 62.3 | **54.5** |

这张表解释了为什么血细胞/血团修复差：它们的定位 DICE 只有 20.9 / 50.9。论文正文给的 54.5% 与十项平均一致。

**Table 3：下游 FCN8 四类分割（DICE %）**

| 输入 | Tumor | Stroma | Lymphocyte-rich | Necrosis | 平均 |
|---|---|---|---|---|---|
| 干净 | 86.1 ± 0.4 | 83.8 ± 0.7 | 81.8 ± 2.1 | 74.2 ± 2.8 | 81.5 ± 1.1 |
| 带伪影 | 77.7 ± 0.3 | 77.9 ± 0.9 | 76.2 ± 2.3 | 64.9 ± 2.6 | 74.2 ± 1.0 |
| 带伪影但抠掉伪影区 | 80.6 ± 0.4 | 81.1 ± 0.8 | 77.9 ± 2.4 | 68.6 ± 2.9 | 77.0 ± 1.1 |
| **HARP 修复** | 82.2 ± 0.5 | 82.0 ± 0.9 | 78.5 ± 2.3 | 69.3 ± 2.8 | **78.0 ± 1.0** |

注意 HARP 修复（78.0）**只比"直接抠掉伪影区"（77.0）高 1 个点**，而两者离干净图（81.5）都还差 3.5 个点。这一行是理解 HARP 真实收益的关键：它主要赢在"保留了伪影下面的组织"而不是"完美复原"。

**运行时**：18.6 s/图（HARP），ArtiFusion 30.9 s，DDRM 37.4 s（单卡，型号未在正文明确，训练用 RTX 4090）。

**人评（§4 User Study）**：4 位病理学家，50 对图（每类伪影 5 张），256×256、100% 缩放、禁止放大，限时。"真实"那张来自训练分布，"伪造"那张是测试图加伪影再经 HARP 修复。

| 病理学家 | DE1 | DE2 | DE3 | DE4 |
|---|---|---|---|---|
| MCC | −0.071 | −0.159 | 0.239 | 0.296 |
| 判错数 | 27/50 | 30/50 | 20/50 | 18/50 |
| 用时 | 7:34 | 5:50 | 4:45 | 7:00 |

两人 MCC 为负（比随机还差），两人弱正相关。作者据此说"看不出区别"；严格讲这是"多数人接近随机"，DE4 的 0.296 已不是零相关，但样本只有 50 对，没有报置信区间。

**有没有细胞级检查？没有。** 全文的评价只有四个层面：(a) 检测的 patch 级准确率/AUROC/F1；(b) 修复的 patch 级 FID/PSNR；(c) 定位掩码与合成伪影掩码的 DICE；(d) 四类组织分割的下游 DICE 与病理学家主观判断。**没有任何一处统计细胞核数量、核型、密度，也没有做"修复后是否凭空长出细胞/腺体"的检查**。这是这份工作与我们研究方向之间最重要的落差（见 §7）。

## 5. 复现入口

### 5.1 官方代码与权重的真实状态（已核对，2026-11-19）

- 仓库：[MECLabTUDA/HARP](https://github.com/MECLabTUDA/HARP)，9 star，License 为 **CC BY 4.0**（`LICENSE.txt`）。`main` 分支结构：`harp/harp_pipeline.py` 编排四步；`harp/pipeline/{artifact_detection,artifact_segmentation,artifact_ranking,artifact_restoration,heatmap}.py`；`harp/models/{network,model}.py` 与 `guided_diffusion_modules/`；`config/` 下三份配置；`setup.py` 打包为 PyPI 包 **HARPipe**（v1.1.2，Python ≥3.11，锁 `torch==2.0.1` / `torchvision==0.15.2` / `anomalib==0.7.0` / `pytorch-lightning==1.9.5`）。
- 安装两条路：`conda env create -f environment.yaml`，或 `pip install HARPipe` + 另行安装 `facebookresearch/segment-anything`。README 明确要求单独下载 SAM ViT-H。
- 权重（HF `SsharvienKumar/HARP_Models`，license MIT，仓库卡片只有一个 `license: mit` 字段，无任何说明）：
  - `anomalib_fastflow.ckpt` — 1,285,261,833 B
  - `restoration_model.pth` — 250,703,805 B
  - `dataset.zip` — 8,537,036,090 B（BCSS 切好的 patch）
  - SAM ViT-H 走 Meta 官方链接 `sam_vit_h_4b8939.pth`
- 代码里硬编码 / 需要手改的地方：`config_harp.json` 的 `input_folder_path`、`result_folder_path`、`anomalib.config_path`（`config_harp.json` 里 `model_path` 的默认值也指向一个 yaml，容易误导）、`sam_checkpoint`、`restoration_model.config_path/model_path`；`TODO: Still need to remove the 256 sizing` 说明输入被固定在 256。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| Eq. 1 条件训练损失 | `harp/models/network.py` → `Network.forward`（`torch.cat([y_cond, y_noisy*mask+(1-mask)*y_0], dim=1)`） |
| "每一步都喂条件" | 同上，`p_mean_variance` 里 `denoise_fn(torch.cat([y_cond, y_t], dim=1), noise_level)` |
| resampling=3 / jumpsampling=10 | `Network.restoration_with_jump_sampling(resample=3, jump_length=10)`；由 `RestorationModel.inpaint_with_jump_sampling` 调用 |
| 900 步加噪去噪 + 25 次平均 | `RestorationModel.noising_and_denoising_map`（次数读 `config["heatmap"]["n_noising_step"]/["n_iter"]`）+ `heatmap.create_heatmap`（绝对差 >50 记为激活，逐次累加） |
| SAM + DBSCAN 候选掩码 | `ArtifactSegment.create_sam_masks`（`SamAutomaticMaskGenerator`，`output_mode="binary_mask"`）/ `create_dbscan_mask`（对第二通道亮度的极大值点做 `DBSCAN(eps=10, min_samples=20)`，暗/亮各一个簇） |
| 面积过滤 0.4%–60%、DICE 去重、>49% 取反 | `artifact_ranking.artifact_ranking` + `artifact_inverting` |
| 掩码按激活量排序取 top-5 | `artifact_ranking`（打分 `((#激活像素 + 0.005·掩码像素)/面积) / (0.25·面积)`，升序） |
| 掩码膨胀 | `harp_pipeline.process_masks`（10×10 椭圆核，DBSCAN 掩码再膨胀 2 次） |
| 用 FastFlow 在两处把关 | `artifact_detection.artifact_detection` 与 `inpaint_ranking` |

**论文与代码/配置不一致的地方（复现前必须知道）**

1. **定位热图的步数与重复次数**：论文写 900 步、25 次；仓库 `config_harp.json` 是 100 步、15 次。按默认配置跑，热图会明显更"糊"，掩码排序会变。
2. **测试期噪声调度**：`RestorationModel.__init__` 调 `set_new_noise_schedule(phase='test')`，用的是 `n_timestep: 250, linear 1e-4→0.09`，而训练是 `1000, 1e-6→0.01`。论文里只写 $T=1000$。这会影响 jump sampling 的时间轴与步长。
3. **训练损失的作用域**：Eq. 1 写的是全图 $\ell_1$；代码在 `mask` 非空时算的是 `loss_fn(mask*noise, mask*noise_hat)`，即**只在掩码内**回传。语义上更合理（掩码外无需预测），但和公式不一致。
4. **掩码排序评分**：论文说"取激活最低的 5 个"，代码的分数里还混了面积项与平均像素阈值（`average_masked_pixel_value > 15` 才保留），不是纯激活排序。
5. Table 3 在论文正文被引用为 "Table 4"（正文写 "As seen in Table 4"，表题是 Table 3）；正文说"4 种局部伪影"实际给了 10 类。属于排版笔误，不影响结论。

### 5.2 本人自跑观察（非论文结果）

以下全部是我在 BACH 测试图上的自跑结果，**不是** HARP 论文报告的数字，也没有经过作者确认。

- 权重：官方 `restoration_model.pth`（HF `SsharvienKumar/HARP_Models`，sha256 以 `aeb11763` 开头）。
- 数据与协议：40 张 BACH 测试图，人工加**合成气泡伪影**（对应论文 10 类里的 air bubble），每图 K=4 次采样；输入 tile 取 343 px，以匹配模型的 ~0.56 µm/px 视场（论文 600 px @0.24 mpp → 256 px 即 0.5625 µm/px）。
- 计数工具：CellViT-256，统计掩码内的肿瘤核数量；另用 CellViT-SAM-H 复核。
- 结果：
  1. **总量偏移**：掩码内肿瘤核数比干净原图 **+11%**。
  2. **逐格编造**：把图切成 128 px 网格，对"原图 ≤1 个肿瘤核"的格子统计修复后 ≥3 个的比例——即"原本没有、修出了成团肿瘤核"，记为 fabrication：**36.2%**；反向的 erasure（原图 ≥3 个，修复后 ≤1 个）：**5.5%**。
  3. **细胞类型偏移**：结缔组织核 **−48%**，上皮核 **−62%**。
  4. **换计数器复核**：CellViT-SAM-H 下 fabrication **33.4%**、erasure **4.1%**，量级稳定，方向和 36.2%/5.5% 一致，说明结论不是某一个计数器的伪影。
- 相关观察（推断，非结论）：[Yang et al., MedIA 2026（note 60）](60-unsupervised-artifact-restoration.md) 发布的修复权重与 HARP 的 checkpoint **文件大小与结构完全一致**；由此**推断**（未经作者确认）它是在 HARP 基础上用 TCGA-BLCA 微调得来。该权重在同一协议下单独自跑：编造 42.7%、抹除 4.8%，方向与 HARP 一致。

这组数字和论文的结论并**不矛盾**，但落在论文没有测量的维度上：论文的 FID 在暗斑上从 78.3 降到 64.3，看起来是"更好"；细胞级统计说明在气泡伪影下，修复区里的核构成被系统性地改写（肿瘤核偏多、结缔与上皮偏少）。论文的 Table 3 下游 DICE 只统计四类组织的像素重叠，且掩码由 FastFlow 的检测结果决定、肿瘤类甚至高于"带伪影"（82.2 vs 77.7），这个方向与"修复区细胞构成改变"是可以共存的——DICE 对"多出几个核"并不敏感。

### 5.3 第一个该做的验证

按论文的 Table 1–2 复现"真值掩码 vs 无监督掩码"的落差：只需 `restoration_model.pth` + 真值掩码，不需要 SAM 和 FastFlow。用 BCSS 测试 patch 或自备 H&E patch 加简单遮挡，比较两种输入下的 FID/PSNR。这一步能确认两件事：(a) 权重是否真的按论文训练（18.6 s/图、暗斑 FID 64.3 附近）；(b) 性能落差是否真由掩码质量造成。

## 6. 前后关联

- **同一问题的上一代**：[ArtiFusion（note 55）](55-artifusion.md) 是病理伪影修复的第一篇扩散工作，用 Swin 骨干 + 人工伪影掩码 + RePaint；HARP 直接把它列为"需要人工掩码"的代表，并指出 RePaint 循环太慢（30.9 s vs 18.6 s）。[RestorePath（note 49）](49-restorepath.md) 解决的是 WSI 级全局一致性与百万像素尺度，HARP 只做 256 patch。
- **同一条流水线思路的后续**：[Yang et al., MedIA 2026（note 60）](60-unsupervised-artifact-restoration.md) 是"检测 → 定位 → 扩散修复"三段式的进一步发展（normalizing flow 热图 + 自精炼定位），其修复权重疑似 HARP 微调（见 §5.2，属推断）。
- **方法零件的上游**：架构来自 Palette（Saharia et al., SIGGRAPH 2022）的 Janspiry 复现版；扩散训练目标与采样来自 DDPM（Ho et al. 2020）；jump/resample 来自 RePaint（Lugmayr et al. CVPR 2022）；检测来自 FastFlow（Yu et al. 2021）与 AnomaLib；定位来自 SAM（Kirillov et al. 2023）与 DBSCAN（Ester et al. 1996）；合成伪影来自 FrOoDo（Stieber et al. 2022）。**注意：HARP 不是 ArtiFusion 的扩展**，两者的扩散骨架不同（Palette/guided-diffusion vs Swin-UNet），HARP 的贡献在于把条件逐步注入以减少 RePaint 循环、以及整条无监督链。
- **幻觉/可靠性这条线**：[HalluGen（note 11）](../diffusion/11-hallugen.md) 提供了"合成可控幻觉 + 无参考检测"的评测框架；[I2I-Stain-Zoo（note 86）](86-reliable-histological-staining.md) 证明感知指标会饱和、任务级误差不会；[DiffusionQC（note 74）](74-diffusionqc.md) 是"只检测不修复"的一支。HARP 恰好是这些评测框架缺的那类被试：一个公开权重、下游口碑不错、但从未做过细胞级检查的修复器。
- **同组其它生成工作**：SuperDiff（[note 78](78-histo-diffusion.md)）是超分不是修复；[LatentArtiFusion（note 72）](72-latentartifusion.md) 在潜空间做伪影修复，与 HARP 构成"像素空间 vs 潜空间"的对照。

## 7. 局限与可检验问题

**作者承认的**：
- 修复质量的上限是定位掩码；血细胞/血团这类铺满全图的伪影定位 DICE 只有 20.9/50.9，修复随之失败。
- 训练集里若混入伪影，模型会"忠实复现"同类伪影（血团 FID 192.0 的可能原因之一）。
- 检测会漏鳞状上皮（与正常上皮外观接近）。
- 生成内容有被误当真实诊断依据的风险；作者的对策是在下游评测里把伪影掩码抠掉，并建议在临床流程中高亮生成区域（引 EU AI Act）。
- 只在 BCSS（乳腺癌）上做，单一染色、单一扫描仪来源。

**我的看法（作者没写的）**：
1. **"看不出来"被当成了"对"**。人评 MCC 最接近随机，说明修复图在 256 px、禁止放大的条件下难以辨别；但这只证明"视觉上自然"，不证明"细胞构成正确"。作者自己在 §4 里也强调要披露生成内容，却没有给出任何"生成内容是否偏离真实组织"的量化检查——这正是我们这条线要补的空。
2. **评价指标只有 FID/PSNR + DICE**。两者都对局部结构替换不敏感：FID 看的是分布统计，PSNR 在掩码外的像素被强制保留因而虚高（掩码外完全没变，PSNR 天然好看）。Table 1–2 里 Ours 的 PSNR 常低于 ArtiFusion，而 FID 更好，正说明两者在测不同的东西。没有 SSIM/LPIPS，也没有任何细胞级或结构级指标。
3. **真值掩码那一行不是"方法"**。13/20 的胜利用的是合成伪影的精确掩码，实际部署拿不到；作者在结论里用 "surpassing the state-of-the-art" 概括，读者容易把 Ours 行当成 HARP 的成绩。真正可比的是 HARP 行，而它在 9/10 类上落后 ArtiFusion。
4. **18.6 s/图 的对比不完全公平**。ArtiFusion/DDRM 被作者用同一骨干重训但仍按各自原始采样流程；HARP 的加速来自"条件逐步注入 + 测试期 250 步调度"两个改动叠加，配置里测试期换了 beta schedule，这个加速中有多少来自算法、多少来自减步数，论文没有拆开。
5. **"无监督"的边界**。检测器 FastFlow 用正常 patch 训练（无监督），但阈值 0.63509 是在验证集上调的；SAM 是通用大模型；定位掩码的合理性最终由人挑的 top-5 与膨胀核尺寸（10×10 椭圆）决定——这些都是需要调的超参，只是不叫"标注"。
6. **失败模式可预测性**：掩码一旦覆盖不足（血团），模型会在"没被掩码盖住的伪影"上原样保留；一旦掩码盖过头，就会重画正常组织。论文没有报告"掩码过大/过小"分别造成什么，附录 Fig. 5 只给了单张定性例子。

**与本人研究的关系**（明确与论文主张分开）：我的方向是扩散修复的细胞级幻觉（编造/抹除）及其无原图检测。HARP 在这里的角色是"一个干净的、公开权重的被试"：它的掩码外像素严格保留，所以任何细胞级变化都可归因于掩码内的生成过程；它的评价体系（FID/PSNR + 组织 DICE）恰好是我们主张不足的那一套。§5.2 的 +11% 肿瘤核、36.2% 编造格、结缔 −48%/上皮 −62%，都是论文没有测量、也无法从论文表格推出的量。要检验的问题包括：(a) 编造率是否随 K（采样次数）与掩码面积系统性变化，即是否是"采样越多、编造越多"；(b) 把定位从 SAM+DBSCAN 换成真值掩码，fabrication 是否下降——若是，则编造主要来自"掩码边界外的伪影像素被当作条件"；若否，则来自扩散先验本身。

**可检验问题清单**：
- HARP 的 36.2% fabrication 在论文的 10 类伪影上是否一致？气泡是"半透明遮挡"，条件通道里仍保留底下的组织信息；暗斑/线头这类不透明伪影下条件里没有信息，编造可能更多。
- 论文 Table 3 的下游 DICE 是否掩盖了细胞级偏移？把 FCN8 换成核实例分割后，HARP 行还能不能保持在 78.0 附近？
- 测试期 250 步 vs 训练期 1000 步的调度错配，是否本身就是性能损失的一部分？论文没有做这个消融。

## 8. 来源与版本

- 论文（PMLR 官方）：<https://proceedings.mlr.press/v250/fuchs24a.html>；PDF <https://raw.githubusercontent.com/mlresearch/v250/main/assets/fuchs24a/fuchs24a.pdf>（PMLR 250:465–479, 2024）
- OpenReview（MIDL 2024 投稿版，`id=bVunbe4hoV`）：<https://openreview.net/forum?id=bVunbe4hoV>；PDF <https://openreview.net/pdf/9be61017fc912f8a2bd82ff1f8933b312fc8f1c5.pdf>（本页以 PMLR 版为准，两版未逐字比对）
- 代码：<https://github.com/MECLabTUDA/HARP>（`main`，2026-11-19 读取；License CC BY 4.0）；PyPI 包 `HARPipe` v1.1.2
- 权重与数据：<https://huggingface.co/SsharvienKumar/HARP_Models>（MIT，卡片无说明）
- 演示视频：<https://video.midl.io/2024/> `fuchs2024a.mp4`
- 关键引用：Palette（Saharia et al., SIGGRAPH 2022）、DDPM（Ho et al., NeurIPS 2020）、RePaint（Lugmayr et al., CVPR 2022）、DDRM（Kawar et al., NeurIPS 2022）、ArtiFusion（He et al., MICCAI 2023）、AR-CycleGAN（Ke et al., IEEE TMI 2023）、FastFlow（Yu et al., 2021）、SAM（Kirillov et al., 2023）、FrOoDo（Stieber et al., 2022）、BCSS（Amgad et al., Bioinformatics 2019）
