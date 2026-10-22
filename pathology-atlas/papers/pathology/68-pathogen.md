# 68｜PathoGen：在良性组织里合成病变，用 inpainting 生成带标注训练样本

**论文**：Controllable Diffusion-Based Lesion Inpainting for Scalable Histopathology Data Augmentation；arXiv:2601.08127，首发 2026-01-13，最新 v2（2026-07-01）；未核实会议或期刊接收。  
**定位**：病变合成、可控 lesion inpainting、分割数据增广；不是把患者伪影区恢复成真实组织。  
**精读核验**：2026-10-22 核对完整摘要/版本、官方训练推理 README、模型卡和 PDF 数据声明；未逐表审计全部正文实验，未进行复现。本次补漏入库，非本周新首发。

## 原文摘要

> Expert-annotated training data remains the critical bottleneck for AI in histopathology, particularly for rare pathologies where even dozens of cases may be unavailable. While data augmentation offers a solution, existing methods fail to generate sufficiently realistic lesion morphologies that preserve tissue-specific architectures. Here we present PathoGen, a diffusion-based generative model enabling controllable, high-fidelity lesion inpainting into benign histopathology images. We validate PathoGen across four datasets representing kidney, skin, breast, and prostate pathology. Quantitative assessment confirms PathoGen outperforms state-of-the-art baselines in image fidelity and distributional similarity. Evaluation by six expert pathologists revealed that synthetic images by PathoGen were only marginally distinguished from real tissue image slightly above chance (57.75% accuracy), demonstrating strong perceptual realism of PathoGen-generated lesions. PathoGen achieved the highest win rate (35.4%) when pathologists ranked generation quality against all baselines. Crucially, augmenting training sets with PathoGen-synthesized lesions improves segmentation Dice scores by up to 0.18 compared to traditional augmentations, with maximum benefit in data-scarce regimes. By simultaneously generating realistic morphology and pixel-level annotations, PathoGen effectively addresses both data scarcity and annotation cost, two critical bottlenecks in computational pathology development.

*来源：[arXiv v2 摘要页](https://arxiv.org/abs/2601.08127v2)，完整原文。*

## 1. 三分钟摘要与推荐理由

PathoGen 用局部重绘来制造训练数据：在良性背景指定要生成病变的位置，并提供病变外观参考，输出与 mask 配对的合成组织。它保留背景上下文、控制局部变化的设计值得与 RestorePath 对读，但二者的目标正好不同。

汇报时应明确说“病变生成增广”，而不是“病变修复”。把合成病变当作患者原始病理结构，会误解实验意义。

## 2. 问题及研究位置

- 稀有病变缺少像素级标注，随机增强不一定产生正确病变形态。
- inpainting 是操作形式，既可以填伪影，也可以插入病变；相同名称不代表相同医学任务。
- 原文评价四个器官方向：肾、皮肤、乳腺、前列腺；未据此推广到所有器官或全 WSI 真实修复。

## 3. 核心方法和数据流

```text
良性目标组织 crop + 白色为待生成区的 mask + 病变/组织外观来源图
  → Stable Diffusion Inpainting UNet + 自定义注意力处理
  → 在目标区域内条件去噪并生成组织变化
  → 得到合成病变图像与已知区域标注
  → 与真实数据共同训练下游分割模型
```

官方模型卡将结构描述为 `UNet2DConditionModel` 和 `SkipAttnProcessor`，发布的是约 190MB 的 `attention.pt`，仍需独立下载 Stable Diffusion Inpainting 基座；不是一个小文件包含整个生成器。

## 4. 论文证据与实验范围

以下来自摘要，未复算、未逐项核验全部子实验协议：

| 评价 | 作者报告 | 解释边界 |
|---|---|---|
| 六位病理专家真伪辨认 | accuracy 57.75% | 衡量感知辨别，不等于诊断正确率 |
| 相对基线的生成质量偏好 | win rate 35.4% | 多方法排序的胜率，不是临床一致率 |
| 数据增广后的分割 | Dice 最多增加 0.18 | 是最大增益，不代表四套数据平均都提升同样幅度 |

应回到原 PDF 核对病变类别、划分、读者研究设计以及各子集增益后再用于定量汇报。

## 5. 复现与审计重点

1. `ClinicalAI/PathoGen` 有 `train.py`、`inference.py`、`configs/`、`src/` 和依赖；Hugging Face `mkoohim/PathoGen` 给出 attention 权重与使用接口。权重页 MIT 不自动涵盖所有外部基座许可证。
2. README 的训练例子为 512²、batch 2、lr 1e-5、100 epochs；它是配置入口，不是本站显存或耗时测量。
3. 文档安装例子仍有 `yourusername` 占位，实际代码入口应使用已核验的 ClinicalAI 仓库；不要机械复制错误链接。
4. 第一组实验固定病变类别和背景，比较真实数据、传统增广、合成病变增广；按患者/切片划分，排除外观来源图进入测试集的泄漏。
5. 迁移到伪影修复需要改变目标、mask 语义与评价协议；不是仅换输入图即可宣称复现 RestorePath。

## 6. 建议阅读顺序

摘要的任务定义 → 原 PDF 方法与四数据集 → 官方三文件样本格式 → 模型卡 attention/base 分工 → 分割数据稀缺实验 → 六人读者研究。

## 7. 前后关联

- [RestorePath](49-restorepath.md)：同为 inpainting，一个恢复受损区域，一个合成病变训练样本。
- [ArtiDiffuser](57-artidiffuser.md)：合成伪影增强鲁棒性，与合成病变扩充类别的目的不同。
- [CHIS](61-chis.md)：mask-to-image 对生成的另一种实现路径。
- [CPathOGen](52-cpathogen.md)：生成干预可以用于审计模型，不只是扩充数据。

## 8. 链接

- [摘要与 v1/v2 日期](https://arxiv.org/abs/2601.08127)
- [原文 PDF](https://arxiv.org/pdf/2601.08127)
- [官方训练推理代码](https://github.com/ClinicalAI/PathoGen)
- [attention 权重与模型卡](https://huggingface.co/mkoohim/PathoGen)
