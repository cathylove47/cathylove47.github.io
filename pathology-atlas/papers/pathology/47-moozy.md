# 47｜MOOZY：把患者病例而非单张切片作为基础模型单位

**论文**：MOOZY: A Patient-First Foundation Model for Computational Pathology，arXiv:2603.27048v3  
**定位**：病例级 WSI 基础模型、跨切片关系、公共数据上的多任务预训练  
**精读核验**：依据 arXiv v3 的摘要、方法、公开代码链接与版本记录整理（2026-09-22）；尚未进行复现实验。

## 原文摘要

> Computational pathology needs whole-slide image (WSI) foundation models that transfer across diverse clinical tasks, yet current approaches remain largely slide-centric, often depend on private data and expensive paired-report supervision, and do not explicitly model relationships among multiple slides from the same patient. We present MOOZY, a patient-first pathology foundation model in which the patient case, not the individual slide, is the core unit of representation. MOOZY explicitly models dependencies across all slides from the same patient via a case transformer during pretraining, combining multi-stage self-supervision with scaled low-cost task supervision. In Stage 1, we pretrain a vision-only slide encoder on 77,134 public slide feature grids using masked self-distillation. In Stage 2, we align these representations with clinical semantics using a case transformer and multi-task supervision over 333 tasks from 56 public datasets, including 205 classification and 128 survival tasks across four endpoints. Across sixteen held-out tasks, MOOZY improves macro weighted F1, balanced accuracy, and macro weighted ROC-AUC relative to PRISM by +4.19%, +7.93%, and +6.95%, respectively. MOOZY is also parameter efficient with 85.77M parameters, 14× smaller than GigaPath. These results suggest that patient-level pretraining yields transferable embeddings, providing a path toward scalable patient-first histopathology foundation models.

*来源：arXiv:2603.27048；逐字原文，未改写、未压缩。*

## 1. 三分钟摘要与推荐理由

多数 WSI 基础模型仍以单张 slide 为单位；多个切片通常只在输入拼接或最终平均时相遇。MOOZY 改用 patient case 作为基础单位：先学习通用 slide encoder，再把同一患者的多个 slide embedding 送入 case transformer，并用大规模分类与生存多任务把病例表征对齐到临床语义。

它补齐了本库从 patch、region、slide 到 patient 的最后一层：若任务目标是患者诊断或预后，病例内多张切片的关系不应被简单平均抹掉。

## 2. 问题及研究位置

slide-level 基础模型减少了每个任务重训 MIL 聚合器的成本，但常把多张切片视为独立样本。MOOZY 的问题是：能否在预训练时显式建模同一患者切片间的依赖，同时避免私有 WSI 或昂贵的配对病理报告？

## 3. 核心方法和数据流

```text
WSI → 冻结 patch encoder → 224-pixel patch feature grid + 坐标
    → 多尺度 global/local crop + block masking
    → student slide Transformer 与 EMA teacher
    → CLS self-distillation + masked patch prediction
    → 每张 slide embedding

同一患者的 {slide embeddings} + [CASE] token
    → case Transformer → case embedding
    → 333 个任务的分类头 / 生存头 → 临床语义对齐与下游迁移
```

第一阶段以 77,134 个公共 slide feature grid 做 vision-only masked self-distillation。第二阶段让 case transformer 聚合每个病例全部 slide，并在 56 个公共数据集的 333 个任务上做多任务监督；其中包含 205 个分类任务和 128 个生存任务。

## 4. 论文证据与实验范围

- 作者在 16 个 held-out 任务上相对 PRISM 报告 macro weighted F1、balanced accuracy 与 macro weighted ROC-AUC 的提升；这些数值属于论文实验结论，不能脱离任务划分外推。
- 论文报告模型为 85.77M 参数，并称其约为 GigaPath 的 1/14。
- 方法把单 slide 病例也送入 case transformer，保证训练与推理的表示形式一致。

## 5. 复现与审计重点

- 官方代码：[AtlasAnalyticsLab/MOOZY](https://github.com/AtlasAnalyticsLab/MOOZY)。
- 先检查数据 split 是否按 patient 而非 slide；同一患者多个切片不能跨训练与测试。
- Stage 1 的 patch encoder、feature grid、crop 规则和 EMA teacher 是可迁移表征的主要前提；不要只复现第二阶段任务头。
- 病例内切片数、染色、扫描中心和采样时点都可能成为 case transformer 的混杂信号，应做按患者数和中心分层的误差分析。

## 6. 建议阅读顺序

`Abstract` → `Fig. 2` → `Fig. 3` → `Stage 1: Self-Supervised Slide Encoder Pretraining` → `Stage 2: Case-Aware Semantic Alignment` → held-out task protocol。

## 7. 前后关联

- 与 [Prov-GigaPath](32-prov-gigapath.md) 比较长序列 slide encoder 和患者级 case encoder。
- 与 [CARE](46-care.md) 比较 region-first 与 patient-first 两种中间结构。
- 与 [SurvPath](11-survpath.md) 和 [DisPro](27-dispro.md) 比较病例级结局建模时是否需要显式跨切片关系。

## 8. 链接

- [arXiv 摘要与版本记录](https://arxiv.org/abs/2603.27048)
- [arXiv HTML 正文](https://arxiv.org/html/2603.27048v3)
- [官方代码](https://github.com/AtlasAnalyticsLab/MOOZY)
