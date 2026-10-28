# 63｜CoDiR：用扩散修正低置信伪标签，而不是重画病理图像

**论文**：CoDiR: Confidence-Guided Diffusion Refinement for Semi-Supervised Histopathology Segmentation；arXiv:2608.11807v1，首发 2026-08-12；MICCAI COMPAYL Workshop 2026 正式收录，已核对 MICCAI Satellite Events Open Access，不是 MICCAI 主会。
**定位**：半监督腺体分割、Mean Teacher、图像条件的 mask 扩散、置信门控。  
**精读核验**：2026-10-22 核对完整摘要、§2–3、Table 1–3 和官方训练/测试入口；本次补漏入库，非本周新首发；未运行作者代码。

## 30 秒看懂

**一句话**：CoDiR 让扩散模型生成"合理的腺体掩码"，只替换教师伪标签里不确定的那部分，再拿去训练学生。

**问题**：半监督分割靠 Mean Teacher 出伪标签，但模糊腺体区不可靠；错误伪标签经 EMA 自蒸馏会形成确认偏差。

**瓶颈**：扩散先验只能纠正"低置信"区域，教师"高置信但错"的地方改不了；GlaS 10% 标注上 mDice 88.09 仍略低于 UniSemAlign 的 88.15。

**insight**：扩散不必生成图像。在掩码空间学会"合理腺体的条件分布"，就能把一个软预测修成结构上合法的掩码；再用置信门控决定哪一块听扩散、哪一块听教师——修的是监督信号，不是像素。

## 3 分钟讲清

**方法（按顺序）**：
1. 用少量标注图像 + 真值掩码训一个图像条件 mini-UNet mask 扩散模型（T=100）。
2. 未标注图过 EMA teacher 得软伪掩码与逐像素置信度；UNI 提供冻结病理表征，DeepLabV3 风格解码器出腺体概率图。
3. 对伪掩码做部分加噪（partial noising ratio 0.2），再条件去噪。
4. 门控融合：低置信区用扩散结果，高置信区保留教师结果。
5. 用置信加权伪标签损失 + 强弱增强一致性更新 student（阈值随 EMA 限制在 [0.60, 0.75]）。
6. 推理只保留 student，扩散模块主要活在训练里。

**作者证据在哪**：Table 3 的四步增量（Mean Teacher 80.95 → 加扩散 87.31 → 加融合 87.50 → 加权重 88.09；首项是 6.36 **个百分点**，不是相对提升）、Table 1 主表（GlaS / CRAG 在 10% 与 20% 标注下的 mDice，GlaS 10% 那格是反例）。主表部分基线引自先前工作，不是统一重训。

**和上一代的区别**：与 RestorePath 的根本区别是"修图像"对"修监督信号"；与 CHIS 的"生成图像-掩码对"不同，它改的是已有未标注图像的伪掩码；与 TopoCellGen 都属于"生成结构先验"，但用途是训练期监督。

**讲 PPT 用这张**：Table 3 的四步增量消融；同时点明"推理不带扩散"，否则会把训练成本误算进部署开销。

## 1. 问题及研究位置

- Mean Teacher 用学生权重的 EMA 生成教师；错误伪标签会形成确认偏差。
- UNI 提供冻结的病理表征，DeepLabV3 风格解码器输出腺体概率图。
- 扩散对象是 mask，而不是 RGB 图像；结构先验不能自动纠正教师“高置信但错误”的区域。

## 2. 核心方法和数据流

```text
少量有标注图像 + 真值 mask → 训练图像条件 mini-UNet mask 扩散模型
未标注图像 → EMA teacher → soft pseudo-mask + 像素置信度
  → 对伪 mask 部分加噪，再条件去噪
  → 低置信区域用扩散结果，高置信区域保留教师结果
  → 置信加权的伪标签损失 + 强弱增强一致性 → 更新 student
推理：只保留 student，输出腺体分割 mask
```

§3.2 配置：图像 256²、batch 16、100 epochs、10 epochs warmup、AdamW 1e-4、EMA 0.99；扩散 T=100，partial noising ratio 0.2；训练置信阈值 EMA 限制在 [0.60,0.75]。作者设备为 RTX PRO 4000 Blackwell 24GB，不代表本站测得的显存下限。

## 3. 论文证据与实验范围

GlaS 共 165 张图像，CRAG 共 213 张；主表采用固定 10%/20% 标注划分，消融在 GlaS 10% 上报告三种子均值和标准差。以下为作者 Table 1/3，未复算。

| 标注比例 | 方法 | GlaS mDice (%) | CRAG mDice (%) |
|---|---|---:|---:|
| 10% | UniSemAlign | 88.15 | 88.57 |
| 10% | CoDiR | 88.09 | 89.83 |
| 20% | UniSemAlign | 88.58 | 89.40 |
| 20% | CoDiR | 89.19 | 90.29 |

并非每项最好：GlaS 10% 的 mDice 略低于 UniSemAlign。Table 3 的 Mean Teacher 80.95→加扩散 87.31→再加融合 87.50→再加权重 88.09；首项增益为 **6.36 个百分点**，不是相对提升 6.36%。主表部分基线引自先前工作，不是全部重新训练的统一对照。

## 4. 复现与审计重点

1. 官方仓库含 `configs/`、`models/`、`trainers/`、`datasets/`、`evaluation/` 和 `scripts/train.py`、`test.py`、`inference.py`，提供 GlaS/CRAG 训练与评价命令；本次只核验入口。
2. UNI 权重需要 Hugging Face 访问权限。README 的数据目录包含监督/非监督/验证/测试，需确认无标注集的真值 mask 不进入训练损失，避免伪半监督泄漏。
3. 首个实验：固定 labeled split，复现 Mean Teacher→扩散→融合→加权四项递增消融，至少跨三个种子报告；不要只对比最终模型与弱基线。
4. 论文说推理只用 student，同时提到固定置信阈值；具体评价是否调用 refinement 需以测试代码核查，不能将训练模块的代价混入最终推理。
5. 未证明全 WSI 伪影修复或临床部署。可检验的延伸是加入真实模糊/染色偏移，考察扩散结构先验会否放大教师错误；这是待验证设想。

## 5. 建议阅读顺序

Fig. 1 → §2.2 条件 mask 扩散与 Eq. 6 门控融合 → §2.3 置信损失 → §3.2 训练/推理区别 → Table 3 增量消融 → Table 1 反例与划分。

## 6. 前后关联

- [RestorePath](49-restorepath.md)：图像 inpainting 与伪标签 refinement 的根本区别。
- [TopoCellGen](21-topocellgen.md)：都涉及结构/布局的生成先验，但输出与监督用途不同。
- [CHIS](61-chis.md)：CHIS 生成图像-mask 对增强分割；CoDiR 改已有未标注图像的伪 mask。
- [UNI/病理表征路线](07-ctranspath.md)：冻结特征编码器不等于无需训练整个框架。

## 原文摘要

> Semi-supervised histopathology segmentation is challenging due to scarce annotations and unreliable pseudo-labels in ambiguous gland regions. To address this problem, we propose Confidence-Guided Diffusion Refinement (CoDiR), a semi-supervised framework that combines a Mean Teacher segmentation model with diffusion-based pseudo-label refinement. Given an unlabeled image, the teacher first produces a soft prediction, and only low-confidence regions are refined by a conditional diffusion model trained to capture plausible mask structures from labeled data. The refined mask is then fused with reliable teacher predictions and used to train the student with confidence weighting and consistency regularization. On the GlaS and CRAG datasets CoDiR reaches 88.09\% and 89.83\% mDice with 10\% labeled data, and 89.19\% and 90.29\% mDice with 20\%, matching or exceeding the strongest published method on seven of the eight benchmark metrics. Ablations attribute the largest single contribution to the refinement module, which adds +6.36\% mDice over the Mean Teacher baseline. The implementation code is publicly available at: https://github.com/vongla345/codir

*来源：[arXiv v1](https://arxiv.org/abs/2608.11807v1)，完整摘要；百分号按 TeX 显示为普通百分号阅读。*

## 7. 链接

- [摘要与版本](https://arxiv.org/abs/2608.11807)
- [方法、实现与原表](https://arxiv.org/html/2608.11807v1)
- [官方训练、测试与推理代码](https://github.com/vongla345/codir)
- [COMPAYL Workshop 正式收录与全文](https://papers.miccai.org/miccai-2026-sat/COMPAYL_020.html)
