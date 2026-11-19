# 99｜CAFlow：像素反重组空间 + 单步流匹配 + 早期出口，把病理超分的推理成本压到毫秒级

**论文**：CAFlow: Adaptive-Depth Single-Step Flow Matching for Efficient Histopathology Super-Resolution；Elad Yoshai, Ariel D. Yoshai, Natan T. Shaked（Tel Aviv University, School of Biomedical Engineering）；arXiv:2603.18513v1（2026-03-19），CC BY-NC-ND 4.0；**未核实任何会议/期刊接收**：arXiv 评论字段为空、只有 v1；核对 MICCAI 2026 官方论文索引（papers.miccai.org，1,165 篇）全文检索，标题与作者 "Yoshai" 均无命中，按 preprint 处理。
**定位**：4×（兼做 8×）超分的**推理成本**论文——单步、像素反重组、按 tile 选网络深度。不是新的生成范式，也不是伪影修复；没有对抗损失、没有感知损失，主指标是 PSNR/SSIM。
**精读核验**：2026-11-18 读 arXiv v1 全文 HTML（§1–5、Algorithm 1–2、Table 1–8、Fig. 1–6、Limitations/Future work）、abs 页题录与摘要；核对 arXiv 页面与 GitHub 仓库/代码搜索，**均无官方实现或权重**，也未发现项目页；未下载权重、未训练、未运行。

## 30 秒看懂

**一句话**：CAFlow 把"每张 tile 都跑满整个网络"改成"先跑 4 个 block，由 6K 参数的小分类器决定还要不要往下跑"，并且全程在像素反重组后的 1/4 分辨率上做，单次前向出图。

**问题**：千兆像素 WSI 逐 tile 做生成式超分，扩散要几十次前向，算力和显存都下不去；而同一张切片里，均质间质和密集腺体需要的计算量本来就不一样。

**瓶颈**：作者自己的 Table 3 就是瓶颈的量化——E2→E3 多花 42% 的算力只换来 +0.12 dB；真正的自由度不在"更深"，而在"哪张图值得更深"。

**insight**：三个改动叠在一起才成立：(1) 把 bicubic 上采样后的图与 HR 都做 pixel unshuffle，空间计算降 16×；(2) 训练时半个 batch 强制取 $t=0$，让推理时唯一用到的那个时间步有直接监督（去掉它掉 1.54 dB）；(3) 在 block 3/7/11/15 接四个出口，用"误差在最优 0.02 以内取最浅"的 oracle 标签训一个路由器。

## 3 分钟讲清

**方法（按顺序）**：
1. LR → bicubic ×4 → pixel unshuffle（$s=4$：48 通道、$64\times64$）；HR 同样反重组作为终点 $x_1$，起点 $x_0$ 就是插值图。
2. 线性路径 $x_t=(1-t)x_0+t x_1$，回归目标 $v=x_1-x_0$；网络输入是 $[x_t;x_0]$ 的 96 通道拼接。
3. FlowResNet：16 个 block、64 通道、1.90M 参数；10 个 FiLMResBlock + 6 个 HybridFiLMBlock（window attention，$w=8$、8 头，索引 {5,9,11,13,14,15}），注意力全压在后半段，于是四个出口的算力是 3.10 / 6.07 / 9.39 / 13.34 GFLOPs（4.3× 而非 4.0×）。
4. 训练：每个 batch 一半取精确 $t=0$，另一半来自 logit-normal（$\mu=-1,\sigma=1$）或按 20 个时间 bin 的 EMA 损失做 $\alpha=0.3$ 的重要性采样；四个出口等权，各算速度 L1 + 重建 L1，再加 $0.1\cdot$SSIM（仅最后出口）与 $0.1\cdot$一致性损失（两个不同 $t$ 预测同一 $x_1$）。
5. 路由：只在 $t<0.15$ 的样本上算四个出口的 L1，取"$\ell_e\le\min_{e'}\ell_{e'}+0.02$ 的最浅 $e$"当标签，用 E0 特征的 GAP→64→64→32→4 的 MLP（约 6K 参数）做交叉熵，stop-gradient + 独立优化器。
6. 推理：一次前向取 $t=0$，$\hat x_1=x_0+v_\theta(x_0,x_0,0)$，pixel shuffle 回 HR；批 1 延迟 2.4–12.4 ms。

**作者证据在哪**：Table 1（E3 31.84 dB / 13.34 GFLOPs 打平 SwinIR-Medium 的 31.84 / 107.11，SSIM 反超）；Table 2（2.4–12.4 ms、22–49 MB 显存，SR3 是 1082 ms / 145 MB）；Table 3（每出口质量与算力，边际收益递减的原表）；Table 4（去掉 $t=0$ 混合 −1.54 dB，是全文最大的单项）；Table 6 StarDist 下游 F1 0.906–0.909；Table 7 结肠零样本 31.82 dB；Table 8 ×8 下 26.21 dB。

**和上一代的区别**：对 SuperDiff（[78](78-histo-diffusion.md)）是单步回归 vs 50 步 ControlNet 扩散，且完全放弃感知/病理专属指标；对 LPFM（[69](69-lpfm.md)）是"单任务、不生成细节"对"统一多任务 + 扩散细化"；对 SwinIR/SRFormer 同为回归，省的是 8× 算力，换来的是 SSIM 而不是感知质量。

**讲 PPT 用这张**：Table 3 的边际收益（E0→E1 +0.43 dB，E2→E3 只 +0.12 dB 却贵 42%）+ Table 4 的 $t=0$ 消融（−1.54 dB）。一张图讲完"为什么要早退"和"为什么单步能成立"。

## 1. 问题及研究位置

- **任务设定**：成对 4× 超分。LR 由 HR 的 bicubic 下采样构造（不是真实低倍重扫），HR 是 TCGA 的 256² 随机裁剪；数据含乳腺、肾、肺，另有结肠做零样本泛化。3,090 训练 / 343 验证 patch。
- **三条路线的位置**：回归（EDSR / SwinIR / SRFormer）、GAN、扩散（SR3）。本文实质是**回归 + 流匹配目标**：没有对抗项、没有 LPIPS 项，作者自己在结论里把"避免生成幻觉"归功于"L1+SSIM 的失真导向目标"。所以它不该和"生成式超分"比谁更像，而该和 SwinIR 比同质量下的成本。
- **自适应计算的位置**：early-exit 在分类里很成熟（Teerapittayanon 2016 等），DPM-Solver 只做全局步长自适应。作者声称是首次把 early exit 与 flow matching 结合，理由也成立：扩散的多步是串联的，没走完拿不到图；flow matching 单次前向就能在任意深度读出速度，天然可截断。
- **与病理 SR 工作的分歧点**：SuperDiff / LPFM 都在追"感知上更像"，本文把评价退回 PSNR/SSIM，把省下来的算力当卖点。这意味着它无法回答"生成的核是不是真的"——它根本不生成，只做残差回归。

| 相邻工作 | 做法 | CAFlow 的差别 |
|---|---|---|
| SwinIR-light / SRFormer-light | 固定深度回归，8.2–8.7 GFLOPs，31.55–31.76 dB | 8.9 GFLOPs 下 31.72 dB，但 SSIM 高 0.002–0.024；参数 1.90M 对 0.87–0.93M |
| SwinIR-Medium | 11.9M 参数 / 107.1 GFLOPs / 31.84 dB | 同 PSNR、更高 SSIM，算力 1/8；代价是 LPIPS 略输（0.1961 vs 0.1958） |
| SR3 | 10 步 DDIM × 4 采样 = 4,376 GFLOPs、1,082 ms | 单步 8.9 GFLOPs、8.2 ms；PSNR +0.33，LPIPS 输 0.005（SR3 0.1917） |
| SuperDiff（78） | 两阶段 + 50 步 ControlNet 扩散 + 病理专属指标 | 不走生成路线；没有 HoVer-Net 核内统计、没有无参考指标 |
| LPFM（69） | 预训练 + 粗修复 + 条件扩散细化，66 项任务 | 单任务；纯回归；换任务要重训 |
| MeanFlow / Consistency Models（[12](../diffusion/12-meanflow.md), [10](../diffusion/10-consistency-models.md)） | 靠平均速度场或蒸馏把步数压到 1 | 不蒸馏、不改路径，靠"半个 batch 精确 $t=0$"直接学单步 |

## 2. 核心方法和数据流

先立三个术语。**pixel unshuffle**：把每个 $s\times s$ 邻域摊到通道维，空间分辨率除以 $s$、通道乘 $s^2$，信息无损、可用 pixel shuffle 精确还原——所以它只是换了个计算排布，不是降采样。**FiLM**：把时间步的正弦嵌入投成逐通道的 scale/shift，$h\odot(1+\gamma)+\beta$，用来让同一个网络在不同 $t$ 下表现不同。**early exit**：在第 4/8/12/16 个 block 之后各接一个 $3\times3$ 头，直接输出 48 通道速度，浅出口跳过后面所有 block。

```text
训练（每个 batch）:
  LR 256² → bicubic ×4 → pixel unshuffle → x0 (48×64×64)
  HR 256² →            pixel unshuffle → x1 (48×64×64)
  一半样本 t = 0；另一半 t ~ logit-normal(μ=-1,σ=1) 或 20-bin EMA 损失的 α=0.3 采样
  xt = (1-t)·x0 + t·x1,   v = x1 - x0
  FlowResNet([xt; x0] 96ch, t) → 四个出口的 v̂^(e) 与 logits
  损失 = (1/4)Σ_e [ ||v̂^(e)-v||₁ + ||x̂1^(e)-x1||₁ ] + 0.1·(1-SSIM) + 0.1·一致性
  若 t < 0.15 且非 warmup：算四个出口的 L1 → oracle e* = 最浅的“误差在最优+0.02 内”的出口
                          → CE(router(E0 特征), e*)，stop-grad，独立优化器
推理:
  LR → bicubic ×4 → pixel unshuffle → 跑 block 0–3 → router argmax
  → 跳到该出口 → x̂1 = x0 + v̂ → pixel shuffle → HR
```

**（a）$t=0$ 才是全部重点。** 线性路径在 $t=0$ 处 $x_t=x_0$、$v=x_1-x_0$，所以"半个 batch 取 $t=0$"字面上就是**一半的训练是纯残差回归**；另半个 batch 的高 $t$ 只提供一致性正则。去掉这一半，PSNR 从 31.72 掉到 30.17（Table 4）。我的看法（作者没写）：这也解释了为什么"流匹配"在这里更像是给残差回归套了一个时间条件——推理从不积分，速度场也从不被验证是否可积。

**（b）反重组空间买到了什么。** 分辨率降到 $1/4$，空间计算降 16×；代价是最前面那个卷积要吃 96 通道。真正的好处是显存：22–49 MB 对 SwinIR-light 的 99 MB、SR3 的 145 MB，这直接决定了单卡能开多大 batch、WSI 上能并行多少 tile。

**（c）出口为什么是"非线性"的。** 6 个 hybrid（attention）block 全放在索引 5 之后，前 4 个 block 是纯卷积。于是 E0 只花 3.10 GFLOPs 就拿到 31.17 dB（比 bicubic +1.93 dB，逼近 EDSR 的 31.44 dB 而算力只要 1/5.2）；E3 的 13.34 GFLOPs 里最后 4 个 block 占了 3.95。这个设计不是随意的：它把"便宜但够用"和"贵但只多 0.12 dB"摆成了一条可供路由器挑选的曲线。

**（d）路由器的定义细节。** oracle 不是"损失最小的出口"，而是"损失在最优 +ε（0.02）之内的最浅出口"——这一条防的是标签全落在最深出口。只在 $t<0.15$ 的样本上算标签，是让训练分布贴近推理时 $t=0$ 的情形。路由器吃的是 E0 特征而不是原始 LR，理由是"网络自己知道还要不要往下算"。验证集上 97.1% 的预测落在 oracle 的 ±1 个出口内。

**（e）训练配置**：700 epoch（前 5 epoch 只做 warmup、不训路由器）、batch 32、$2\times10^{-4}$ cosine、8-bit AdamW、bf16、EMA 0.9999、单张 RTX 5070 Ti、<5 小时。

**（f）一致性损失的两个时间步怎么采，论文没写**（未确认）。式 (14) 只说 $\hat x_1(t_1)$ 与 $\hat x_1(t_2)$，没给 $t_1,t_2$ 的分布，也没给它们与主采样器的关系。重实现时必须自己定，这会直接改变 −0.17 dB 那一格的复现难度。

## 3. 论文证据与实验范围

**Table 1：多器官 ×4 主表（343 patch，作者报告，未复算）**

| 方法 | 参数 | GFLOPs | PSNR↑ | SSIM↑ | LPIPS↓ |
|---|---:|---:|---:|---:|---:|
| Bicubic | — | — | 29.24 | 0.8096 | 0.2495 |
| EDSR | 1.52M | 16.25 | 31.44 | 0.8316 | 0.2003 |
| SwinIR-light | 0.93M | 8.72 | 31.76 | 0.8494 | 0.1953 |
| SwinIR-Medium | 11.90M | 107.11 | 31.84 | 0.8790 | 0.1958 |
| SRFormer-light | 0.87M | 8.25 | 31.55 | 0.8718 | 0.1955 |
| SR3 | 2.94M | 4376 | 31.39 | 0.8672 | **0.1917** |
| CAFlow（E3） | 1.90M | 13.34 | 31.84 | **0.8797** | 0.1961 |
| CAFlow（Adaptive） | 1.90M | 8.92 | 31.72 | 0.8737 | 0.1967 |

读法：**PSNR 上是"打平不输"，SSIM 上是真赢，LPIPS 上一直输**。SwinIR-light 用 8.72 GFLOPs 拿到 31.76 dB（比 Adaptive 高 0.04 dB），但 SSIM 低 0.024——这就是全文最诚实的 trade-off 位置：它不是全面更强，而是"同算力下结构相似度更高、同质量下算力更低"。

**Table 3：每出口质量—算力（这张表是全文的论证核心）**

| 出口 | block | hybrid 数 | GFLOPs | PSNR | SSIM | 边际 |
|---|---|---:|---:|---:|---:|---|
| E0 | 0–3 | 0 | 3.10 | 31.17 | 0.8625 | 比 bicubic +1.93 |
| E1 | 0–7 | 1 | 6.07 | 31.60 | 0.8717 | +0.43 dB，+2.97 G |
| E2 | 0–11 | 3 | 9.39 | 31.72 | 0.8740 | +0.12 dB，+3.32 G |
| E3 | 0–15 | 6 | 13.34 | 31.84 | 0.8797 | +0.12 dB，+3.95 G |
| Adaptive | — | — | 8.92 | 31.72 | 0.8737 | 同 E2 质量、少 5% 算力 |

E0 这一行值得单独记：**4 个纯卷积 block、3.1 GFLOPs 就到 31.17 dB**。它说明收益的大头在"反重组空间 + 目标函数"，而不在深度或注意力。

**Table 2：单卡延迟与显存（RTX 5070 Ti，bf16，batch 1，64² LR 输入）**

| 方法 | GFLOPs | ms | img/s | 峰值显存 |
|---|---:|---:|---:|---:|
| CAFlow E0 | 3.10 | 2.4 | 418 | 22 MB |
| CAFlow E3 | 13.34 | 12.4 | 80 | 49 MB |
| CAFlow Adaptive | 8.92 | 8.2 | 122 | 46 MB |
| SwinIR-light | 8.72 | 60.1 | 17 | 99 MB |
| SwinIR-Medium | 107.11 | 84.1 | 12 | 129 MB |
| SR3 | 4376 | 1082.1 | 1 | 145 MB |

延迟不与 GFLOPs 成正比：CAFlow E3 的 13.34 GFLOPs 比 SwinIR-light 的 8.72 多，却快 4.8×（12.4 vs 60.1 ms）。作者的解释是 SwinIR 的 window attention 有 reshape/mask/softmax 开销，小 batch 下吃不满 GPU；反重组后的卷积是访存友好的。这个解释在 batch 1 下成立，但换成 batch 32 会不会反转，论文没测。

**Table 4：消融（作者按 300 epoch 训，完整模型 700 epoch）**

| 变体 | PSNR | ΔPSNR |
|---|---:|---:|
| Full CAFlow | 31.72 | — |
| w/o early exit | 31.65 | −0.07 |
| w/o consistency | 31.55 | −0.17 |
| **w/o $t=0$ mixing** | **30.17** | **−1.54** |
| w/o SSIM loss | 31.41 | −0.30 |
| 减到 8 个 block | 31.41 | −0.31 |

三个可读结论：$t=0$ 混合是唯一"掉了就废"的组件；多出口训练对最终输出几乎零代价（−0.07 dB，SSIM 甚至略高），即早出口是**免费**的辅助监督；砍一半深度只掉 0.31 dB，说明剩下的容量冗余不小。

**下游与泛化**：Table 6 用 StarDist `2D_versatile_he` 在 SR 输出上检测核，与 HR 上的检测按 IoU>0.5 匹配：CAFlow E3 F1 0.906、Adaptive 0.909，SwinIR-light 0.911，bicubic 0.869；学习类方法之间 $p>0.05$ 全部不显著。Table 7 结肠零样本：E3 31.82 dB（训练器官 31.84，只掉 0.02），SwinIR-Medium 31.90。Table 8 ×8：E3 26.21 dB / 0.7047，超过所有同算力基线，输给 SwinIR-Medium 的 26.52 / 0.7105（8× 算力）。WSI 级只做了图 4：一张 TCGA-BRCA 切片（TCGA-A8-A08C）301 个组织 tile，33% E1 / 61% E2 / 6% E3，均值 8.55 GFLOPs（省 36%）。

## 4. 复现与审计重点

1. **代码与权重（2026-11-18 核对）**：arXiv abs 页与 HTML 全文都没有仓库或项目页链接，GitHub 仓库搜索与代码搜索均无结果。**未发现官方代码**。好消息是规模小——1.90M 参数、单卡 5 小时、数据是公开 TCGA 裁剪，重实现成本远低于扩散类论文。
2. **Table 4 的基准行可疑**：它的 "Full CAFlow" 是 31.72 / 0.8737 / 0.1967，与 Table 3 的 **Adaptive** 行四个数字完全相同；但正文说消融只训 300 epoch、完整模型 700 epoch。要么这张表复用了 700 epoch 的 Adaptive 结果却没改 epoch 说明，要么是四位小数全同的巧合（不太可能）。所有 ΔPSNR 都以这一行为基准，引用时要标注。
3. **算术对不上**：31.72 − 30.17 = **1.55**，而 Table 4 的 Δ 列与正文都写 1.54，摘要写 −1.5 dB。量级不影响结论，但说明数字是手抄的。
4. **"减到 8 个 block 就删掉全部 6 个 hybrid"这句不成立**：按 §3.2 的定义，block 5 是 hybrid，0–7 这段里就有一个。要么消融时重排了 block，要么这句话写错（未确认）。
5. **Adaptive 的 8.92 GFLOPs 与 E2 的 9.39 只差 5%，但 Table 2 里两者的延迟都是 8.2 ms**。按 GFLOPs 比例应该更快一点；批 1 下延迟由访存主导可以解释，但也可能"Adaptive"那一行是拿固定路径测的。别把 8.2 ms 当成"动态路由的真实平均耗时"。
6. **WSI 那节的算力口径不清（未确认）**：图 4 说在 1024² tile 上做路由、平均 8.55 GFLOPs，但全文所有 GFLOPs 都是按 64² LR（=256² HR）测的。一个 1024² tile 若是整块前向，算力应是 16×。要么是 1024² 再切成 256² 子块统计，要么两个 GFLOPs 口径不同——论文没交代。
7. **下游那句是过度表述**：结论写"nuclei detection F1 is statistically indistinguishable from HR ground truth"，但 Table 6 的 F1 是**SR 检测与 HR 检测的匹配度**（0.906），不是与 HR 的一致性检验；也没有 HR-vs-HR 或人工标注的上限。能支持的结论只有"学习类方法之间无显著差异"。
8. **数据与退化**：LR 是 bicubic 下采样，不是真实低倍重扫；TCGA 的 patch 清单、器官划分、frozen/permanent 比例都没给。零样本结肠说明的是"换器官不崩"，不是"换扫描协议不崩"——这一点和 [78](78-histo-diffusion.md) 面对的是同一个批评。
9. **没做的事**：没有病理专属指标（核内强度/纹理、DAB、无参考质量分），没有拼图一致性，没有单图内逐区域分配算力（作者列为 future work），也没有多步积分的实验（正文一句"principle 上可以 Euler 积分"带过，无结果）。
10. **首个可做的实验（不需要作者代码）**：在同一 343 patch 上重训 EDSR 与 SwinIR-light 复现 31.44 / 31.76 两个数，然后把 CAFlow 的 E0 位置换成一个 4-block 的纯卷积残差网（同样 48 通道反重组、同样无注意力）——如果它也能到 ~31.2 dB，就证明"流匹配"在推理时没有贡献，收益全部来自反重组空间与 $t=0$ 监督。这是判断这篇论文该被归到"生成模型"还是"高效回归"的关键一格，一天能出结论。

**可检验的移植问题（均未验证）**：

- 把路由器输出的 exit 当组织复杂度图用：作者只做了图 4 的定性观察，没做与核密度、肿瘤注释区域的相关性统计。如果相关性成立，这张图本身就能当免费的质量控制信号，比超分结果更有用。
- 真实低倍重扫（同一张切片 20× 与 40×）上的退化失配：bicubic 下采样训练的模型在真实模糊/散焦下会怎样，本文完全没测。
- 逐区域自适应：一张 1024² tile 内按局部复杂度分配深度，是作者列出的 future work；它和本文的 tile 级路由是两个粒度，效果未必叠加。

## 5. 建议阅读顺序

Fig. 1（三个改动在一张图上）→ §3.1 式 (2)(4)（$t=0$ 时速度就是残差）→ §3.4（$t=0$ 混合与 bin 采样）→ Table 3（边际收益递减）→ Table 4（$t=0$ 消融 −1.54）→ §3.3（oracle 定义与 ε）→ Table 1/2（与 SwinIR、SR3 的两条对比轴）→ §4.11–4.12（下游与跨器官）→ Limitations。

## 6. 前后关联

- [SuperDiff](78-histo-diffusion.md)：同为病理 4× 超分，路线正相反——那边 50 步扩散追感知质量、并自带一套病理指标；这边单步回归追算力，PSNR 打平、LPIPS 认输。两篇一起看，正好是"指标口径决定方法选择"的对照组。
- [LPFM](69-lpfm.md)：把超分当四类低层退化之一，用扩散细化；CAFlow 反过来证明"不做细化也能到 31.8 dB"，代价是纹理与感知分数。
- [MeanFlow](../diffusion/12-meanflow.md)：一步生成的另一条路——用平均速度场让单步在数学上成立；CAFlow 不做任何平均，只在 $t=0$ 上加监督。对照看"一步"的两种合法性来源。
- [Consistency Models](../diffusion/10-consistency-models.md)：蒸馏式一步；本文的一致性损失只是训练正则，不是蒸馏，也没有教师模型。
- [Flow Matching](../diffusion/08-flow-matching.md) / [Rectified Flow](../diffusion/09-rectified-flow.md)：直线路径与 $v=x_1-x_0$ 的定义出处；本文的路径就是最朴素的 conditional flow matching。
- [SheafStain](91-sheafstain.md)：虚拟染色侧的"拼接一致性"问题；CAFlow 逐 tile 独立推理、完全没管接缝，做 WSI 落地时这是缺口。

## 原文摘要

> In digital pathology, whole-slide images routinely exceed gigapixel resolution, making computationally intensive generative super-resolution (SR) impractical for routine deployment. We introduce CAFlow, an adaptive-depth single-step flow-matching framework that routes each image tile to the shallowest network exit that preserves reconstruction quality. CAFlow performs flow matching in pixel-unshuffled rearranged space, reducing spatial computation by 16x while enabling direct inference. We show that dedicating half of training to exact t=0 samples is essential for single-step quality (-1.5 dB without it). The backbone, FlowResNet (1.90M parameters), mixes convolution and window self-attention blocks across four early exits spanning 3.1 to 13.3 GFLOPs. A lightweight exit classifier (~6K parameters) achieves 33% compute savings at only 0.12 dB cost. On multi-organ histopathology x4 SR, adaptive routing achieves 31.72 dB PSNR versus 31.84 dB at full depth, while the shallowest exit exceeds bicubic by +1.9 dB at 2.8x less compute than SwinIR-light. The method generalizes to held-out colon tissue with minimal quality loss (-0.02 dB), and at x8 upscaling it outperforms all comparable-compute baselines while remaining competitive with the much larger SwinIR-Medium model. Downstream nuclei segmentation confirms preservation of clinically relevant structure. The model trains in under 5 hours on a single GPU, and adaptive routing can reduce whole-slide inference from minutes to seconds.

*来源：[arXiv:2603.18513 摘要页](https://arxiv.org/abs/2603.18513)（v1，2026-03-19）。HTML 正文的摘要比 abs 页多两句（"Flow matching models achieve strong SR quality, but they apply the same network depth to every image" 等），数值一致；此处按 abs 页逐字保留。*

## 7. 链接

- [arXiv abs（v1）](https://arxiv.org/abs/2603.18513) · [HTML 全文](https://arxiv.org/html/2603.18513v1) · [PDF](https://arxiv.org/pdf/2603.18513)
- 官方代码：**未发现**（arXiv 页面无链接，GitHub 仓库/代码搜索无结果，亦无项目页）。
