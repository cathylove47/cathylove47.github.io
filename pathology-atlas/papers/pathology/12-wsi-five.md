# 12｜WSI-FiVE：用细粒度视觉—语义交互提升切片分类泛化

**论文**：Generalizable Whole Slide Image Classification with Fine-Grained Visual-Semantic Interaction，CVPR 2024  
**定位**：视觉—语义交互、WSI 分类、泛化  
**建议投入**：先用预提取特征和固定配置复现；端到端训练前先审计数据读取路径。

**精读核验**：CVPR 2024；论文报告在 TCGA-Lung few-shot 设置中相对对比方法至少提高9.19个百分点 accuracy。该数字属于特定 few-shot 协议，不代表所有任务的普遍增益（2026-09-01）。

## 1. 三分钟摘要与推荐理由

WSI-FiVE 将病理报告/类别语义与 patch 视觉特征进行细粒度交互，而不是只在最后拼接一个文本向量。它希望通过文本提供的疾病语义，提高模型在不同数据和任务上的泛化能力。

这篇论文适合与 MI-Zero 对照：MI-Zero 强调无需目标标签的零样本迁移，WSI-FiVE 更强调有训练过程的细粒度视觉—语义建模。

## 2. 问题及研究位置

只用 slide label 训练的 MIL 容易记住中心/染色偏差；通用视觉语言模型又缺乏 WSI 级聚合。WSI-FiVE 尝试让每个 patch 与病理语义发生交互，再形成切片决策。

## 3. 核心方法和数据流

```text
WSI / precomputed patches → visual tokens
病理报告或类别描述 → text tokens
FiVE fine-grained interaction + patch fusion → slide representation → classification
```

语义并非直接使用原始报告：作者先用设计好的 queries 让大语言模型从非标准报告中抽取细粒度病理描述，再重构为训练标签；Task-specific Fine-grained Semantics（TFS）模块再让 prompt 与局部视觉模式交互。这使 prompt 生成流程成为方法的一部分，而不是无关预处理。

## 4. 实验、数据集与指标

仓库提供 TCGA 肺癌与 CAMELYON16 数据表，并可下载 DSMIL 体系的预提取特征。评价应同时看同域性能和跨域/泛化设置，明确文本是否在测试时可获得。

## 5. 代码仓库审计

- 评级：**B-**。核心模型、配置、数据表、预处理 notebook 和训练入口存在。
- 根目录未发现许可证文件，不能默认代码可自由再发布或商用。
- 仓库含提交进来的 `__pycache__`，工程清洁度一般；README 指出不同 WSI 存储方式可能需要修改 `datasets/pipeline.py`。
- 关键文件：`models/FiVE.py`、`models/patch_fusion.py`、`datasets/pipeline.py`、`main.py`。

## 6. 环境、显存与数据

README 建议 Python 3.8.16，并给出双 GPU 分布式训练命令。端到端训练显存更高，README 建议按资源减少 `NUM_FRAMES`（例如约 2048）。预提取特征约需 30GB。

## 7. 建议复现路径

1. **最小测试**：检查 `configs/wsi/fix_pth*.yaml`、TCGA/CAMELYON16 CSV 和一个 batch 的视觉/文本形状。
2. **标准实验**：使用固定 patch 特征执行两卡训练，记录文本输入、patch 数和随机种子。
3. **扩展实验**：删除/打乱文本、使用不同报告生成方式，并做跨中心外部验证。

## 8. 代码阅读顺序

`README.md` → `configs/wsi/fix_pth.yaml` → `datasets/build.py` → `datasets/pipeline.py` → `models/FiVE.py` → `models/patch_fusion.py` → `main.py` → `gpt_preprocess/`。

## 9. 可借鉴思想

- 文本可以为 patch 聚合提供语义条件，而非只做最终融合。
- 泛化研究要明确训练/测试时文本可用性和生成来源。
- 对 GPT 生成的报告处理必须保存提示词、版本和人工审计规则。

## 10. 局限、风险与课题切入点

报告可能泄露标签，生成文本可能放大先验偏差；细粒度交互也增加计算成本。可研究无标签泄漏的语义构造、文本质量不确定性，以及语言先验与真实形态证据冲突时的拒绝机制。

**关键审计：**必须保存原始报告字段、LLM 提示词、模型版本和生成结果；检查语义标签中是否直接出现目标类别名称、分期或结论。删除/打乱细粒度语义应作为强制消融，否则泛化提升可能来自标签捷径。

## 11. 前后关联

先读 [MI-Zero](06-mi-zero.md)，再进入 [HistoSelect](15-histoselect.md) 的问题驱动 patch 选择。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2024/html/Li_Generalizable_Whole_Slide_Image_Classification_with_Fine-Grained_Visual-Semantic_Interaction_CVPR_2024_paper.html)
- [官方代码](https://github.com/ls1rius/WSI_FiVE)
