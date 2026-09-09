# 10｜TANGLE：让转录组成为 slide 表征学习的监督信号

**论文**：Transcriptomics-Guided Slide Representation Learning in Computational Pathology，CVPR 2024  
**定位**：WSI—转录组对比学习、slide embedding、少样本迁移  
**建议投入**：使用仓库提供的 TCGA-BRCA 处理后特征和 checkpoint 跑通闭环。

**精读核验**：CVPR 2024；论文的三个独立测试集合分别包含1,265张乳腺 WSI、1,946张肺 WSI 和4,584张肝脏 WSI，重点证据来自 few-shot transfer 而非只看预训练损失（2026-09-01）。

## 1. 三分钟摘要与推荐理由

TANGLE 把同一病例的 WSI 和基因表达视为两种互补视图：图像保留空间形态，转录组描述分子状态。两个模态分别编码后，通过对称对比目标对齐。训练完成后，只保留 slide encoder，即可做少样本分类、原型分类或检索。

## 2. 问题及研究位置

WSI 自监督中的“正样本视图”通常来自裁剪或遮挡，但整张切片异质性很大，增强未必保留同一语义。TANGLE 用真实分子测量提供更强的病例级对齐信号。

## 3. 核心方法和数据流

```text
WSI patch features → slide encoder → slide embedding
RNA-seq profile → expression encoder → expression embedding
成对样本对比学习 → 对齐空间
冻结 slide encoder → linear probe / prototype / retrieval
```

## 4. 实验、数据集与指标

论文覆盖 TCGA 的乳腺/肺癌以及 TG-GATES 大鼠肝脏数据，检查少样本分类、原型分类和检索。仓库提供 TCGA-BRCA 到 BCNB 下游评价的简化闭环，并新增 pan-cancer TANGLEv2 资源。

## 5. 代码仓库审计

- 评级：**A-**。训练、checkpoint 提取、线性探测、处理后特征和脚本齐全。
- 许可证为 CC BY-NC-ND 4.0，修改与再分发受限。
- README 明确区分论文原始的 CTransPath/ResNet50 特征和示例中更新的 UNI 特征。
- 关键文件：`train_tangle.py`、`core/models/mmssl.py`、`core/loss/tangle_loss.py`、`run_linear_probing.py`。

## 6. 环境、显存与数据

仓库提供 `requirements.txt`。使用公开预提取 UNI 特征和表达 `.pt` 文件可单卡训练；从原始 WSI 与 RNA-seq 全流程重建需要较大存储、多卡和严格患者映射。

## 7. 建议复现路径

1. **最小测试**：下载仓库 Drive 中的 TCGA-BRCA patch embeddings 与 expression features，核对病例 ID 交集。
2. **标准实验**：运行 `train_tangle.py`，提取 slide embedding，再运行 `run_linear_probing.py`。
3. **扩展实验**：加入缺失组学、批次效应和跨癌种留一验证；不要只随机划分。

## 8. 代码阅读顺序

`README.md` → `core/dataset/dataset.py` → `core/models/abmil.py` → `core/models/mmssl.py` → `core/loss/tangle_loss.py` → `train_tangle.py` → `extract_slide_embeddings_from_checkpoint.py` → `run_linear_probing.py`。

## 9. 可借鉴思想

- 用临床相关的互补模态定义自监督信号。
- 训练时使用组学，部署时可以只保留图像 encoder。
- slide embedding 应通过少样本、检索和跨任务评价，而非单一分类。

## 10. 局限、风险与课题切入点

bulk RNA-seq 混合了不同细胞群，且与切片空间区域未精确对应；缺失组学和批次效应也会影响对齐。可研究空间转录组引导的局部对齐、缺失模态蒸馏和生物通路级对比目标。

**配对警告：**同一患者可能有多张 WSI，但只有一份 bulk expression；这并不自动产生多个独立图文对。训练和划分必须按患者完成，并明确多张 slide 如何聚合或采样，否则会重复计算同一分子标签并造成病例权重失衡。

## 11. 前后关联

下一步读 [SurvPath](11-survpath.md)：TANGLE 用组学训练通用图像表示，SurvPath 在预测时同时使用两种模态。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Jaume_Transcriptomics-Guided_Slide_Representation_Learning_in_Computational_Pathology_CVPR_2024_paper.html)
- [官方代码](https://github.com/mahmoodlab/TANGLE)
