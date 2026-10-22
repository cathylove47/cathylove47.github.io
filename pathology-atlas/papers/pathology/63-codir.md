# 63｜CoDiR：用扩散修正低置信伪标签，而不是重画病理图像

**论文**：CoDiR: Confidence-Guided Diffusion Refinement for Semi-Supervised Histopathology Segmentation；arXiv:2608.11807v1，首发 2026-08-12；arXiv 标注 MICCAI COMPAYL Workshop 2026 接收，不是 MICCAI 主会。  
**定位**：半监督腺体分割、Mean Teacher、图像条件的 mask 扩散、置信门控。  
**精读核验**：2026-10-22 核对完整摘要、§2–3、Table 1–3 和官方训练/测试入口；本次补漏入库，非本周新首发；未运行作者代码。

## 原文摘要

> Semi-supervised histopathology segmentation is challenging due to scarce annotations and unreliable pseudo-labels in ambiguous gland regions. To address this problem, we propose Confidence-Guided Diffusion Refinement (CoDiR), a semi-supervised framework that combines a Mean Teacher segmentation model with diffusion-based pseudo-label refinement. Given an unlabeled image, the teacher first produces a soft prediction, and only low-confidence regions are refined by a conditional diffusion model trained to capture plausible mask structures from labeled data. The refined mask is then fused with reliable teacher predictions and used to train the student with confidence weighting and consistency regularization. On the GlaS and CRAG datasets CoDiR reaches 88.09\% and 89.83\% mDice with 10\% labeled data, and 89.19\% and 90.29\% mDice with 20\%, matching or exceeding the strongest published method on seven of the eight benchmark metrics. Ablations attribute the largest single contribution to the refinement module, which adds +6.36\% mDice over the Mean Teacher baseline. The implementation code is publicly available at: https://github.com/vongla345/codir

*来源：[arXiv v1](https://arxiv.org/abs/2608.11807v1)，完整摘要；百分号按 TeX 显示为普通百分号阅读。*

## 1. 三分钟摘要与推荐理由

扩散不仅能生成 H&E，也能生成分割 mask。CoDiR 针对少标注下教师伪标签不可靠的问题：先用真实标注学会“合理腺体 mask 的条件分布”，再只替换教师预测中不确定的部分，让学生接受更好的监督。

这是汇报中区分用途的好例子：RestorePath 修复输入图像，CoDiR 修复训练监督信号。CoDiR 的最终推理只用学生分割网络，扩散模块主要在训练中发挥作用。

## 2. 问题及研究位置

- Mean Teacher 用学生权重的 EMA 生成教师；错误伪标签会形成确认偏差。
- UNI 提供冻结的病理表征，DeepLabV3 风格解码器输出腺体概率图。
- 扩散对象是 mask，而不是 RGB 图像；结构先验不能自动纠正教师“高置信但错误”的区域。

## 3. 核心方法和数据流

```text
少量有标注图像 + 真值 mask → 训练图像条件 mini-UNet mask 扩散模型
未标注图像 → EMA teacher → soft pseudo-mask + 像素置信度
  → 对伪 mask 部分加噪，再条件去噪
  → 低置信区域用扩散结果，高置信区域保留教师结果
  → 置信加权的伪标签损失 + 强弱增强一致性 → 更新 student
推理：只保留 student，输出腺体分割 mask
```

§3.2 配置：图像 256²、batch 16、100 epochs、10 epochs warmup、AdamW 1e-4、EMA 0.99；扩散 T=100，partial noising ratio 0.2；训练置信阈值 EMA 限制在 [0.60,0.75]。作者设备为 RTX PRO 4000 Blackwell 24GB，不代表本站测得的显存下限。

## 4. 论文证据与实验范围

GlaS 共 165 张图像，CRAG 共 213 张；主表采用固定 10%/20% 标注划分，消融在 GlaS 10% 上报告三种子均值和标准差。以下为作者 Table 1/3，未复算。

| 标注比例 | 方法 | GlaS mDice (%) | CRAG mDice (%) |
|---|---|---:|---:|
| 10% | UniSemAlign | 88.15 | 88.57 |
| 10% | CoDiR | 88.09 | 89.83 |
| 20% | UniSemAlign | 88.58 | 89.40 |
| 20% | CoDiR | 89.19 | 90.29 |

并非每项最好：GlaS 10% 的 mDice 略低于 UniSemAlign。Table 3 的 Mean Teacher 80.95→加扩散 87.31→再加融合 87.50→再加权重 88.09；首项增益为 **6.36 个百分点**，不是相对提升 6.36%。主表部分基线引自先前工作，不是全部重新训练的统一对照。

## 5. 复现与审计重点

1. 官方仓库含 `configs/`、`models/`、`trainers/`、`datasets/`、`evaluation/` 和 `scripts/train.py`、`test.py`、`inference.py`，提供 GlaS/CRAG 训练与评价命令；本次只核验入口。
2. UNI 权重需要 Hugging Face 访问权限。README 的数据目录包含监督/非监督/验证/测试，需确认无标注集的真值 mask 不进入训练损失，避免伪半监督泄漏。
3. 首个实验：固定 labeled split，复现 Mean Teacher→扩散→融合→加权四项递增消融，至少跨三个种子报告；不要只对比最终模型与弱基线。
4. 论文说推理只用 student，同时提到固定置信阈值；具体评价是否调用 refinement 需以测试代码核查，不能将训练模块的代价混入最终推理。
5. 未证明全 WSI 伪影修复或临床部署。可检验的延伸是加入真实模糊/染色偏移，考察扩散结构先验会否放大教师错误；这是待验证设想。

## 6. 建议阅读顺序

Fig. 1 → §2.2 条件 mask 扩散与 Eq. 6 门控融合 → §2.3 置信损失 → §3.2 训练/推理区别 → Table 3 增量消融 → Table 1 反例与划分。

## 7. 前后关联

- [RestorePath](49-restorepath.md)：图像 inpainting 与伪标签 refinement 的根本区别。
- [TopoCellGen](21-topocellgen.md)：都涉及结构/布局的生成先验，但输出与监督用途不同。
- [CHIS](61-chis.md)：CHIS 生成图像-mask 对增强分割；CoDiR 改已有未标注图像的伪 mask。
- [UNI/病理表征路线](07-ctranspath.md)：冻结特征编码器不等于无需训练整个框架。

## 8. 链接

- [摘要与版本](https://arxiv.org/abs/2608.11807)
- [方法、实现与原表](https://arxiv.org/html/2608.11807v1)
- [官方训练、测试与推理代码](https://github.com/vongla345/codir)
