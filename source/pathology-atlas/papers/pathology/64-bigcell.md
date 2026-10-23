# 64｜BigCell：用流匹配与共享滑窗，从 2048² 图块走向 32768² WSI 生成

**论文**：BigCell: Generating Gigapixel Whole-Slide Images；arXiv:2610.14261v1，首发 2026-10-09；NeurIPS 2026 正式接收，已核对官方论文展示页及其 OpenReview 链接。
**定位**：flow matching 条件生成、UNI-2 嵌入网格、全局潜画布速度融合、自适应窗口调度与 8k 文生图。不是伪影修复。  
**精读核验**：2026-10-22 核对完整摘要、主文 §3–6、Table 1–4、Fig. 3 与作者代码/资源说明；区分原文与 README 的数据计数差异，未运行模型。是 10 月补漏，不是 10 月 15 日后的新首发。

## 原文摘要

> Whole-slide images (WSIs) are gigapixel-scale digital scans of histopathology tissue and serve as the primary basis for cancer diagnosis. Existing histopathology generative models operate at the patch scale, producing fixed-size tiles of at most 1024$\times$1024 pixels which encompass only a small fraction of the WSI. In contrast, text reports for clinical diagnoses and slide-level diagnostic labels -- the supervision that exists at scale -- operate at the whole-slide level. We present BigCell, the first approach to generate coherent whole-slide histopathology images at native gigapixel resolution. BigCell trains a flow-matching transformer at 2048$\times$2048 pixels on over 120,000 publicly available WSIs spanning multiple organ types. Conditioning on embeddings from pathology foundation models and using an inference-time sliding-window pipeline, BigCell generates coherent images of up to 32,768$\times$32,768 pixels, outperforming prior tile generators on both tile-level and slide-level fidelity metrics. To make gigapixel synthesis practical, we introduce an adaptive scheduling strategy that prioritizes important slide regions, speeding up image generation by over 3\ttimes with minimal quality degradation. Furthermore, we propose the first text-to-image synthesis at 8k resolution by training a separate model that produces dense conditioning grids directly from pathology text reports. We demonstrate that augmenting with synthetic samples improves slide-level few-shot classification performance by up to $18 \\%$ over baselines trained on real data.

*来源：[arXiv v1 摘要页](https://arxiv.org/abs/2610.14261v1)，完整原文；保留源摘要中的 TeX 写法，包括 `3\ttimes`，不自行改写原文。*

## 1. 三分钟摘要与推荐理由

BigCell 是 LRDM、ZoomLDM、PixCell 同组路线的新尺度扩展：训练 2048² 的条件 tile 生成器，推理时每一步融合全局潜画布上各重叠窗口的速度，生成最高 32768² 图像。它仍从小于整张 WSI 的单元训练，但以密集条件网格提供全局组织蓝图。

它是**流匹配**而不是原样照搬 DDPM。对于 WSI 修复研究，值得学习的是共享滑窗、条件网格和计算调度；把这些移到 inpainting 是可研究方向，不是作者已经验证的修复能力。

## 2. 问题及研究位置

- tile 级外观正确，不能保证整张切片的组织结构正确；报告和诊断标签通常又是 slide 级的。
- 条件可以来自真实 WSI 的 UNI-2 网格，也可以由 CGM 从病理文本生成，两种输入来源应分开报告。
- 32768² 是图像条件生成能力，8192² 是项目展示的文本条件能力；不能把二者合并成“32k 文生图”。

## 3. 核心方法和数据流

```text
真实 WSI → 每 256² 区域提 UNI-2 → 密集条件网格
或：病理报告 → TITAN → CGM 流匹配 → 32×32×1536 条件网格
  → BigCell-tile：FLUX.2 VAE 空间中的流匹配 Transformer
  → 在全局 latent 上逐步运行重叠 2048² 窗口
  → 每步平均局部预测速度，统一推进全局画布
  → 按条件/无条件速度差，优先更新重要窗口，其他复用缓存
  → 分块 VAE 解码 → 大图 / 金字塔 TIFF
```

官方 README：tile 模型 SiT-XL/2 845M，CGM 327M；渐进训练 256→1024→2048。大图默认 20 Euler 步、CFG 2.0、2048 像素窗口、1024 stride。其每步全窗口速度融合与 RestorePath 的逐位置进度随机调度不是同一实现。

### 先把三个模型角色分清

可以把任务理解为：先确定整幅组织该长什么样，再让一个只学过局部的小模型把大图逐步画出来。**UNI-2 是读取参考组织的编码器，BigCell-tile 是画局部组织的生成器，CGM 则是可选的“文本转组织特征网格”生成器。** 真实 WSI 已能提供网格时，不必经过 CGM。

1. **训练局部生成器（§3.1）：** 2048×2048 图像经 VAE 变成 256×256×32 的 latent，即压缩的图像表示；同一图像切成 8×8 个 256 像素块，各提取 1536 维 UNI-2 特征。模型通过 cross-attention 读取这张 8×8 条件网格，学习带噪 latent 下一步该朝哪个方向移动。它学的是流匹配速度，不是直接输出一张最终大图。
2. **推理时拼的是每一步的速度（§3.2）：** 在同一张全局 latent 画布上取重叠窗口，每个窗口提出局部更新；重叠位置把预测速度平均，再统一做 Euler 更新。并不是先独立画完许多小图、最后拼接图片。固定步长记作 Δt，则更新可写作 $z_{t+\Delta t}=z_t+\Delta t\,\bar v_t$；$\bar v_t$ 是融合后的全局速度，窗口覆盖次数不同的位置要分别归一化。
3. **少算不重要的窗口（§3.3）：** 有条件与无条件速度差得越大，说明这个窗口越依赖组织条件。作者用两者差的 L1 范数作为重要性；第一步全算，之后根据上一步分数只重新计算前 r 比例的窗口，其余复用上次缓存速度。省掉的是部分网络前向，不是把这些区域留成空白，也不是证明它们无病理价值。
4. **从文本生成与数据增广（§3.4–3.5）：** CGM 用 TITAN 的报告文本特征生成 32×32×1536 的 UNI 网格，再交给上述图像生成器输出 8192² 图像。增广时则对真实样本的网格加噪到中间时刻 t′=0.5，再按类别报告去噪，制造同类别的变化；不等于原样复制真实训练图，也不保证标签总是正确。

对照 RestorePath 时，先问“条件从哪来、在何处共享大图状态、哪些位置被允许改变”。BigCell 的原任务是新图生成，没有 RestorePath 那样的伪影区域保留约束；把滑窗直接拿来修复还需要另行定义这些约束。

## 4. 论文证据与实验范围

以下为主文原表及 Fig. 3 的作者报告，未复算。8k 条件生成比较使用 100 个 held-out ROI；32k 调度比较使用 256 张 held-out 切片；文生图评价使用 150 份未参与训练的患者报告。

| 证据 | BigCell | 对照或边界 |
|---|---|---|
| Table 1，8k 图像条件生成，TITAN/MOOZY 相似度 | 0.956 / 0.973 | PixCell 0.941 / 0.900；tile 基线放进同一滑窗流程，但原生训练分辨率和训练数据并不完全相同 |
| Fig. 3、§5.2，32k 自适应调度 r=0.25 | 4.97 小时，TITAN 0.951 | 全计算 15.6 小时、0.957；单张 Intel Data Center GPU Max 1550 上作者报告 3.1× 加速，不是本站测量或其他显卡的耗时保证 |
| Table 4，PANDA 4-shot 增广后的 κ | 0.583 | 真实数据基线 0.493；约 18% 是相对增益，不是 18 个百分点，也不是所有指标都提升同一幅度 |
| Table 3，8k 文生图 TITAN Recall@5 | 0.655 | 与真实配对数据相同，但 Recall@1 0.169 仍低于真实 0.211 |
| Table 1，Virchow-2 Fréchet distance，越低越好 | BigCell 907 | LRDM 731、ZoomLDM 815、PixCell 1023；BigCell 不是所有分布指标最优，未配对裁块的分布相似不等于条件对应正确 |
| Table 2，MedGemma 报告的诊断一致率 | BigCell 46%，PixCell 42% | 这里是生成/参考图所产报告之间的一致，不是模型的真实临床诊断准确率 |

**训练与划分（§4.1）：** 六个公开来源共 120,703 张 WSI，生成器在 slide 级拆分训练与评价。正文写训练 tile 数为 15,996,332，官方 README 写 15,966,332；本次没有把二者默认为相同，复现应以实际数据清单和代码版本核对。两处的测试 tile 数均为 852,435。

**增广协议（§4.3、Table 4）：** 每类 K∈{1,2,4} 张真实样本，对比 K 张真实与 K 张真实加 K 张合成；冻结 TITAN 提特征，再训练 logistic regression，重复十个分类器随机种子。它不是重新训练一个完整 WSI 基础模型后得到的收益。PANDA 在 CGM 训练之外，提供了一个域外验证场景。

**人工评价与局限（§5.3、§6）：** 三位病理医生各做 100 次试验，其中真实/合成各 50 次。总体真伪判断准确率 55.3%，95% CI 为 50–61%，不能据此推断所有诊断任务都可替代真实组织。文本条件目前限于 8k；32k 仍耗时数小时，图像仅用于研究。

## 5. 复现与审计重点

1. 官方代码提供 `bigcell/`、`cgm/`、`scripts/generate_from_grid.py`、`generate_from_text.py`、`augment.py`、数据准备与训练说明；不是仅有样例图。
2. Hugging Face 发布 bigcell-256/1024/2048 与 cgm-8192；样本集 BigCell-sample-data 约 6.8GB。入口已核验，未下载权重或样本，不声称已跑通。
3. FLUX.2-dev VAE、UNI2-h、TITAN 是外部授权依赖；图像条件与文本条件所需组件不同。README 特别要求 TITAN 使用 transformers 4.56.2，不能把有下载链接等同无访问门槛。
4. 首个验证：固定同一个条件网格与随机种子，比较 full compute 与 r=0.25，保存局部最差分位质量、slide 相似度、时间/显存及全局结构；不只展示漂亮中心 crop。
5. 用户算力充足，保留完整训练及大图机制的研究价值；先跑已发布权重是排除工程变量的方法，不代表只能研究低算力问题。

## 6. 建议阅读顺序

Fig. 2 → §3.1 局部生成器 → §3.2 每步速度融合 → §3.3 缓存与调度 → §4 评价口径 → Table 1–2 条件一致与分布质量的差别 → Fig. 3 匹配计算预算 → Table 3–4 文本生成与增广 → README 的模型依赖、数据布局和训练入口。

## 7. 前后关联

- [LRDM](56-lrdm.md)：条件网格与每步重叠窗口共识的前序。
- [ZoomLDM](58-zoomldm.md)：对比跨尺度联合生成与更大 native tile 的路线。
- [RestorePath](49-restorepath.md)：共享画布思想相通，但一个生成新图，一个修复已有受损图。
- [STREAM](65-stream.md)：BigCell 仍将基础模型特征当条件；STREAM 改成直接生成基础模型特征。
- [CytoSyn](66-cytosyn.md)：对照生成基础模型与评估预处理敏感性。

## 8. 链接

- [摘要与首发日期](https://arxiv.org/abs/2610.14261)
- [完整论文](https://arxiv.org/html/2610.14261v1)
- [作者方法、结果与样例](https://histodiffusion.github.io/docs/projects/bigcell/)
- [官方代码](https://github.com/cvlab-stonybrook/BigCell)
- [模型](https://huggingface.co/StonyBrook-CVLab/BigCell) · [样本数据](https://huggingface.co/datasets/StonyBrook-CVLab/BigCell-sample-data)
- [NeurIPS 2026 官方收录页](https://neurips.cc/virtual/2026/poster/152972)
