# 44｜STEPH：把其他癌种模型的有效更新合进目标模型

**论文**：Sparse Task Vector Mixup with Hypernetworks for Efficient Knowledge Transfer in Whole-Slide Image Prognosis，CVPR 2026  
**定位**：跨癌种预后迁移、模型合并、任务向量  
**建议投入**：直接使用公开 UNI2-h-DSS 特征、基础模型和五折划分；不必重做 WSI 切块。

**精读核验**：CVPR 2026 正式论文，pp. 35238–35247；代码、训练日志、基础 ABMIL 模型和数据划分入口已核验（2026-09-17）。

## 原文摘要

> Whole-Slide Images are widely used for estimating cancer prognosis. Cancer-specific models, however, often struggle to learn generalizable knowledge from scarce samples. STEPH efficiently absorbs knowledge from other cancers via model merging: it applies task vector mixup to each source-target pair and sparsely aggregates the mixtures with hypernetworks. Across 13 cancers it improves 5.14% over cancer-specific learning and 2.01% over an existing transfer baseline.

**摘要因果链**：目标不是训练泛癌多任务模型，而是在不联合数据、不做多模型推理的条件下改善一个目标癌种；task-vector mixup 提供候选方向，稀疏聚合决定当前 WSI 采用哪些方向。

## 论文 Pipeline 原图

![STEPH 官方框架图](https://raw.githubusercontent.com/liupei101/STEPH/main/docs/fig-steph-overview.png)

*图源：作者官方仓库 `docs/fig-steph-overview.png`。*

### 沿着图从左到右读

1. 各癌种模型必须从同一 \(M_0\) 训练，才能令任务向量 \(\tau=M-M_0\) 可比较。
2. 对每个来源构造 \(\tau_{mix,i}=\lambda_i\tau_t+(1-\lambda_i)\tau_{s_i}\)；\(H_{mix}(X)\) 为当前 WSI 预测 \(\lambda_i\)。
3. \(H_{agg}(X)\) 预测聚合权重并只保留 Top-K，默认 K=5，以抑制负迁移。
4. 合并发生在 MIL 参数里，不是对 13 个预测求平均；最终推理仍是一个模型：40.1 GFLOPs，而表示迁移基线 330.7 GFLOPs。
5. 辅助损失同时约束单个 mixture 与最终合并模型，否则权重可学习不等于生存排序有效。

### 证据与边界

- 平均 C-index：单癌种 0.6609，ROUPKT 0.6812，STEPH 0.6949；提升覆盖 12/13 癌种。
- 动态 mixup 仅带来小幅提升；动态稀疏聚合更关键，统一聚合权重只有 0.6490。
- 证据限于相同 ABMIL 架构、初始化和 UNI2-h 特征，不能推出异构模型也能直接合并。


## 0. 零基础导读：先读这一节

> 这一节只讲直觉，不要求你懂公式。后面的章节用于深入和复现；第一次阅读时，看完本节和第 1 节就可以先停。

### 0.1 把它想成什么？

13 位医生分别熟悉一种癌症。STEPH 不让他们同时会诊，也不在推理时逐个询问，而是比较每位医生相对同一本教材学到了什么，再只把对目标癌种有用的部分合进一个模型。

### 0.2 它为什么出现？

单癌种样本少；多癌种联合训练昂贵且涉及数据共享；推理时运行多个来源模型又会让计算量随模型数增长。

### 0.3 它到底怎么做？

1. 从相同初始化分别训练各癌种模型。
2. 用“训练后权重减初始化权重”得到任务向量。
3. 对目标与每个来源任务向量做可学习插值。
4. 由超网络按当前 WSI 稀疏选择、聚合最有益的混合向量。

### 0.4 先认清这些词

- **任务向量**：微调前后模型权重之差。
- **模型合并**：直接组合模型参数更新，而非拼接预测。
- **超网络**：根据输入生成另一个模型的混合系数。
- **稀疏聚合**：只保留少数来源，避免无关癌种干扰。

### 0.5 输入和输出

输入是目标 WSI 的 UNI2-h patch 特征及一组癌种专用模型；输出是按样本调整的单个目标预后模型和风险值。

### 0.6 最容易误解的地方

STEPH 不是训练一个同时服务 13 个癌种的统一模型。它为每个目标癌种吸收其他模型中有益的知识，最终仍优化目标任务。

**现在只记住一句话：STEPH = 从多个癌种的参数更新中，只合并当前切片真正需要的部分。**

## 1. 三分钟摘要与推荐理由

STEPH 将跨癌种预后迁移从“多模型特征集成”改成“单模型参数合并”。目标任务向量与 12 个来源任务向量先做 mixup；两个轻量 mean-MIL 超网络分别预测插值系数和稀疏聚合权重。得到的合并模型无需在测试时运行全部来源模型。

在 13 个 TCGA 癌种、8,818 张 WSI、7,268 名患者的五折实验中，平均 C-index 为 0.6949；单癌种训练为 0.6609，表示迁移基线 ROUPKT 为 0.6812。相对二者分别提升 5.14% 和 2.01%，并在 12/13 个癌种优于单癌种模型。

## 2. 问题及研究位置

现有泛癌联合训练要求集中数据；ROUPKT 在推理时运行多个来源模型。普通任务算术和 TIES 等合并方法主要解决多任务能力，而 STEPH 的目标是只提升一个目标癌种，并让来源权重依赖当前 WSI。

## 3. 核心方法和数据流

```text
共同初始化 M0 → 各癌种模型 Mt, Ms
任务向量 τt = Mt-M0，τs = Ms-M0
WSI 特征 → Hmix → 每个来源的插值系数 λ
τmix = λτt + (1-λ)τs
WSI 特征 → Hagg → Top-K 聚合权重
M*t = M0 + 稀疏加权任务向量 → 生存风险
```

默认选择 K=5；超网络损失约束 mixup 模型与最终合并模型均能预测目标癌种。

## 4. 实验、数据集与指标

UNI2-h-DSS 包含 13 个 TCGA 癌种、完整疾病特异生存标签和五折均衡划分。基础模型均为 ABMIL，patch 特征由 UNI2-h 提取。STEPH 在 BRCA 上达到 0.7408 C-index，相对单癌种 0.6648 提升明显；总体平均 0.6949。消融中，动态 mixup 加动态稀疏聚合最佳；统一可训练聚合权重只有 0.6490。

## 5. 代码仓库审计

- 评级：**B+**。训练代码、配置、五折划分、基础模型、日志与 checkpoint 均公开。
- 关键文件：`model/merged_model_mixup.py`、`model/model_pool.py`、`model/utils_merge.py`、`runner/sa_taskari_handler.py`、`main.py`。
- README 的 BibTeX 误写为 ICCV；会议与页码应以 CVF 的 CVPR 2026 页面为准。

## 6. 环境、显存与数据

官方环境为 Python 3.8、PyTorch 1.11、CUDA 11.3、2×RTX 3090。可从 Hugging Face 下载 UNI2-h-DSS 五折划分，并从作者链接下载基础 ABMIL 模型；若只复现合并阶段，无需处理原始 WSI。

## 7. 建议复现路径

1. **最小测试**：下载一个目标癌种及基础模型，检查任务向量计算和合并前向。
2. **标准实验**：运行 BRCA 五折，复现单癌种、ROUPKT 与 STEPH。
3. **扩展实验**：限制可用来源癌种，比较来源相似度、选择频率与外部队列泛化。

## 8. 代码阅读顺序

`config/cfg_temp_steph.yaml` → `model/model_pool.py` → `model/utils_merge.py` → `model/merged_model_mixup.py` → `runner/sa_taskari_handler.py` → `main.py`。

## 9. 可借鉴思想

- 跨队列知识可以在参数更新空间迁移，避免共享原始数据。
- 合并权重应按样本变化，而不是每个目标任务固定一组系数。
- 稀疏来源选择同时控制负迁移与推理成本。

## 10. 局限、风险与课题切入点

实验全部来自 TCGA，基础模型架构相同，且学习合并权重仍需目标训练数据。可研究异构模型合并、训练无关的来源筛选、外部医院验证，以及合并权重是否稳定对应可解释的癌种相似性。

## 11. 前后关联

它承接 [Patch-GCN](34-patch-gcn.md) 等 WSI 生存模型，但解决的是跨癌种迁移；与 [ConSurv](45-consurv.md) 的区别是：STEPH 合并已训练模型，ConSurv 顺序接收新癌种并防遗忘。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2026/html/Liu_Sparse_Task_Vector_Mixup_with_Hypernetworks_for_Efficient_Knowledge_Transfer_CVPR_2026_paper.html)
- [官方代码](https://github.com/liupei101/STEPH)
- [arXiv](https://arxiv.org/abs/2603.10526)
