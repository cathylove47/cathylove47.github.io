# 64｜BigCell：用流匹配与共享滑窗，从 2048² 图块走向 32768² WSI 生成

**论文**：BigCell: Generating Gigapixel Whole-Slide Images；arXiv:2610.14261v1，首发 2026-10-09；arXiv 与作者项目页标注 NeurIPS 2026 接收。  
**定位**：flow matching 条件生成、UNI-2 嵌入网格、全局潜画布速度融合、自适应窗口调度与 8k 文生图。不是伪影修复。  
**精读核验**：2026-10-22 核对完整摘要、作者项目页方法/结果与官方 README 代码、权重、样本及依赖；未逐式审计完整论文，未运行模型。是本次发现的 10 月补漏，不是 10 月 15 日后的新首发。

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

## 4. 论文证据与实验范围

以下为作者项目页原表/文字，未复算：

| 证据 | BigCell | 对照或边界 |
|---|---|---|
| 8k 图像条件生成，TITAN/MOOZY 相似度 | 0.956 / 0.973 | PixCell 0.941 / 0.900；同一滑窗流程下比较 |
| 32k 自适应调度 r=0.25 | 4.97 小时，TITAN 0.951 | 全计算 15.6 小时、0.957；作者报告 3.1× 加速，并非秒级生成 |
| PANDA，4-shot 增广后的 κ | 0.583 | 真实数据基线 0.493；不是所有分类指标都提升 18 个百分点 |
| 8k 文生图 TITAN Recall@5 | 0.655 | 与真实配对数据相同，但 Recall@1 0.169 仍低于真实 0.211 |

训练数据在 README 中为 120,703 张 WSI、15,966,332 个 tile，来自 TCGA、CPTAC、GTEx 等；项目的真实/合成识别实验不能替代患者诊断正确性的验证。

## 5. 复现与审计重点

1. 官方代码提供 `bigcell/`、`cgm/`、`scripts/generate_from_grid.py`、`generate_from_text.py`、`augment.py`、数据准备与训练说明；不是仅有样例图。
2. Hugging Face 发布 bigcell-256/1024/2048 与 cgm-8192；样本集 BigCell-sample-data 约 6.8GB。入口已核验，未下载权重或样本，不声称已跑通。
3. FLUX.2-dev VAE、UNI2-h、TITAN 是外部授权依赖；图像条件与文本条件所需组件不同。README 特别要求 TITAN 使用 transformers 4.56.2，不能把有下载链接等同无访问门槛。
4. 首个验证：固定同一个条件网格与随机种子，比较 full compute 与 r=0.25，保存局部最差分位质量、slide 相似度、时间/显存及全局结构；不只展示漂亮中心 crop。
5. 用户算力充足，保留完整训练及大图机制的研究价值；先跑已发布权重是排除工程变量的方法，不代表只能研究低算力问题。

## 6. 建议阅读顺序

项目 Method → sliding-window 速度平均 → adaptive scheduling → 8k 对比表 → text-to-image 的独立 CGM → 增广表 → README 的模型依赖、数据布局和训练入口 → 原文细节。

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
