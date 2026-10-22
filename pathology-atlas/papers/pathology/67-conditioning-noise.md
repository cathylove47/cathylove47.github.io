# 67｜Conditioning Noise：随机条件也能改善扩散伪影检测，但不代表语义条件无用

**论文**：Conditioning noise is a free regularizer for LoRA fine-tuning: no pathology encoder required for diffusion-based artifact detection in histopathology；arXiv:2609.16032v1，首发 2026-09-11，当前仍为 v1，未核实正式接收。  
**定位**：PixCell-1024 上 LoRA 微调的训练期条件噪声正则；输出是伪影异常分数，不是修复图像。  
**精读核验**：2026-10-22 核对摘要、PDF §3–4 与公开代码/数据声明，并沿用仓库既有候选的协议核验记录；从候选升级为中文精读，不是本周新首发；未运行模型。

## 原文摘要

> Diffusion-based artifact detectors score whole-slide image patches by reconstruction error under a model fine-tuned on clean tissue. We show that conditioning this fine-tuning on random Gaussian embeddings -- resampled at every step from approx. 200 KB of precomputed embedding statistics, with no encoder, no cache, and no change to inference -- consistently widens the clean/artifact separation. A four-step ablation chain shows the benefit requires neither content (shuffled real embeddings), provenance (synthetic Gaussians), a tuned intensity (flat across an 8x variance range), nor per-patch identity (fresh per-step noise); a LoRA-dropout control shows the conditioning pathway specifically, not generic weight perturbation, carries the effect. Patch-level gains of +0.25-0.48 Cohen's d replicate across nine trainings; honest leave-one-slide-out evaluation clears a pre-registered bar in 2/2 seeds; and two pre-registered external endpoints on a 281-case set confirm pooled Delta F1 = +0.0073 (95% CI) and +0.0129 (97.5% CI, two-look corrected). We release the full evaluation protocol, including measured seed noise and selection-optimism pricing.

*来源：[arXiv v1 摘要页](https://arxiv.org/abs/2609.16032v1)，完整原文。*

## 1. 三分钟摘要与推荐理由

该文问的不是“哪种特征最能控制修复”，而是“在只学正常组织的异常检测器中，训练条件为何有帮助”。作者逐步打乱真实特征配对、换成匹配统计的高斯向量、改为每步重新采样，发现条件语义并非这个检测收益的必要原因。

它对 RestorePath 学习的价值在于提醒：条件分支的收益可能包含正则作用，但本篇只验证伪影检测，不能据此宣称 RestorePath 的 DWI 语义无用。

## 2. 问题及研究位置

- 基础流程来自对 DiffusionQC 的独立实现；作者明说它不是原作者参考实现。
- 用干净图块微调后，在固定噪声级计算噪声预测误差，异常高分表示不符合所学正常分布。
- “无 encoder”指微调循环与部署不再调用病理基础模型；PixCell 的 VAE 保留，离线统计仍源自 UNI2-h。

## 3. 核心方法和数据流

```text
干净训练 patch → 离线 UNI2-h → 按 16 个 token 位置估计 μ、σ（约 200KB）
  → 丢弃运行期编码器/逐图 embedding cache
每步训练：e=μ+σ·ε → 交叉注意力条件
          干净 patch → PixCell VAE → 加噪 → LoRA 微调噪声预测器
推理：null 条件 + 固定 timestep → ε 预测误差 → tissue 区域分数图与阈值
```

PDF §3：1024²、10×，LoRA rank/alpha=16/16、224 个注意力投影、8.26M 可训练参数，1000 steps、batch 4、lr 1e-5。作者报告一张 A100 约 2 小时，不是本站实测。

## 4. 论文证据与实验范围

42 张开发 WSI 按 16/2/24 训练/验证/测试，另用 GrandQC 281 例外部集。以下为作者报告，未复算：

| 证据 | 结果 | 不能推出的结论 |
|---|---|---|
| §4.1，t=650 的 patch 分离 | Cohen's d 从 1.34 到约 1.76 | 不是 slide F1 提升 0.42 |
| 训练随机性 | baseline d 的种子标准差 0.126，slide pooled F1 0.0112 | 小点估计差异不自动稳定 |
| 外部预注册两端点 | pooled ΔF1 +0.0073、+0.0129 | 不是所有外部设置大幅提升；需保留两次查看校正 |
| 推理路径 | 与 null 条件基线的打分流程不变 | 不是修复质量或临床安全性实验 |

同作者的 [可靠性分析](https://arxiv.org/abs/2608.30835) 检查了划分、随机种子、采样与未报告前处理；属于辅助评价证据。

## 5. 复现与审计重点

1. 官方实现 `kmouts/condnoise-histoqc` 与 Zenodo 代码归档、数据 DOI 均有原文来源；权重和外部数据尚未下载/加载。
2. 核对离线统计到底来自哪些训练切片，验证/测试 embedding 不得进入 μ/σ；“无运行期 encoder”不等于统计来源可忽略。
3. 第一组实验固定数据、LoRA 与评分，仅改 null/自身特征/打乱特征/匹配高斯条件，复现排除链；不要与换 backbone 混在一起。
4. 按 WSI 而不是大量相关 patch 做不确定性估计，记录 pooled F1 与 per-slide 平均 F1 的区别。
5. 向修复任务迁移时必须重新验证结构与语义保真；不能将检测的正则化发现直接当作 inpainting 的生成机制。

## 6. 建议阅读顺序

§3.1 检测器如何打分 → §3.3 唯一训练改动 → §4 四步排除 → §3.5 种子与预注册 → 外部端点 → companion 评价协议。

## 7. 前后关联

- [RestorePath](49-restorepath.md)：生成条件与检测正则的目标不同。
- [CytoSyn](66-cytosyn.md)：同样要求检查条件与评价预处理，不能只比较漂亮样图。
- [无监督伪影流水线](60-unsupervised-artifact-restoration.md)：先检测定位，再谈如何修复。
- [WSI 扩散论文集合](learning/diffusion-wsi-route.html)：本篇在 QC 赛道，而非 inpainting 主线。

## 8. 链接

- [题录与完整摘要](https://arxiv.org/abs/2609.16032)
- [PDF 方法与协议](https://arxiv.org/pdf/2609.16032)
- [官方代码与实验记录](https://github.com/kmouts/condnoise-histoqc)
- [代码归档](https://doi.org/10.5281/zenodo.22702198) · [数据](https://doi.org/10.5281/zenodo.22702800)
- [独立复现与不确定性分析](https://arxiv.org/abs/2608.30835)
