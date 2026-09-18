# CLAM：从切片级标签学会找到关键 patch

> **论文**：Data-efficient and Weakly Supervised Computational Pathology on Whole-Slide Images
> **发表**：Nature Biomedical Engineering，2021
> **关键词**：WSI、弱监督、Multiple Instance Learning、Attention、实例级约束、可解释热图

## 原文摘要

> The rapidly emerging field of computational pathology has the potential to enable objective diagnosis, therapeutic response prediction and identification of new morphological features of clinical relevance. However, deep learning-based computational pathology approaches either require manual annotation of gigapixel whole slide images (WSIs) in fully-supervised settings or thousands of WSIs with slide-level labels in a weakly-supervised setting. Moreover, whole slide level computational pathology methods also suffer from domain adaptation and interpretability issues. These challenges have prevented the broad adaptation of computational pathology for clinical and research purposes. Here we present CLAM - Clustering-constrained attention multiple instance learning, an easy-to-use, high-throughput, and interpretable WSI-level processing and learning method that only requires slide-level labels while being data efficient, adaptable and capable of handling multi-class subtyping problems. CLAM is a deep-learning-based weakly-supervised method that uses attention-based learning to automatically identify sub-regions of high diagnostic value in order to accurately classify the whole slide, while also utilizing instance-level clustering over the representative regions identified to constrain and refine the feature space. In three separate analyses, we demonstrate the data efficiency and adaptability of CLAM and its superior performance over standard weakly-supervised classification. We demonstrate that CLAM models are interpretable and can be used to identify well-known and new morphological features. We further show that models trained using CLAM are adaptable to independent test cohorts, cell phone microscopy images, and biopsies. CLAM is a general-purpose and adaptable method that can be used for a variety of different computational pathology tasks in both clinical and research settings.

*来源：arXiv:2004.09666（https://arxiv.org/abs/2004.09666）。逐字原文，未改写、未压缩。*

## 论文 Pipeline 原图

![CLAM 论文框架图](/papers/pathology/29-clam-pipeline.jpg)

> **原文图注**：Figure 1: Overview of the CLAM conceptual framework, architecture and interpretability.

*图源：https://arxiv.org/html/2004.09666v1。原图直接取自论文，未重绘、未描摹。*

## 0. 零基础导读：先读这一节

### 0.1 把它想成什么？

把一张病理切片想成“一袋糖”：

- 一张 WSI 是一个 **bag**；
- 每个 patch 是一个 **instance**；
- 老师只告诉你“这袋糖里有坏糖”，不告诉你是哪一颗；
- CLAM 一边判断整袋，一边学习哪些 patch 最支持这个判断。

### 0.2 它为什么出现？

WSI 是超大图像。若逐 patch 标注，需要病理专家圈出大量局部区域，成本很高；但只用切片级标签训练普通 MIL，又可能让模型依赖不稳定或无关的局部证据。

CLAM 的目标是：**只使用 slide-level label，同时学习切片分类和具有诊断价值的局部区域。**

### 0.3 它到底怎么做？

1. 分割组织，并在 WSI 内提取 patch 坐标。
2. 用 CNN 或病理预训练 encoder 把每个 patch 变成特征向量。
3. 用 gated attention 给 patch 分配重要性，形成整张切片的表示。
4. 用 slide-level 分类损失训练切片预测。
5. 从 attention 最高和最低的 patch 中采样实例，加入实例级分类约束，稳定模型找到的证据。
6. 把 attention 分数映射回 WSI，生成热图和高分 patch。

### 0.4 先认清这些词

- **WSI**：Whole Slide Image，数字病理全视野切片，通常是 gigapixel 级别。
- **MIL**：Multiple Instance Learning，把一组 patch 当成一个 bag，只监督 bag 标签。
- **门控注意力**：用 `tanh` 和 `sigmoid` 两条支路共同计算 patch 权重。
- **实例级约束**：把高 attention 和低 attention 的 patch 当作伪正、伪负实例进行训练。
- **SB / MB**：Single-Branch 与 Multi-Branch；后者为不同类别学习不同 attention 分支。
- **热图**：把 patch 的 attention 分数重新绘制到原始切片位置。

### 0.5 输入和输出

输入：

- 原始 WSI，或已经提取好的 patch features；
- 每张 slide 的标签；
- `case_id`、`slide_id` 和训练/验证/测试划分。

输出：

- slide-level 类别和概率；
- 每个 patch 的 attention 分数；
- WSI attention heatmap；
- attention 最高的局部 patch；
- 多折交叉验证的 AUC、accuracy 和 checkpoint。

### 0.6 最容易误解的地方

1. **CLAM 不是逐 patch 全监督分类**：训练时没有每个 patch 的人工标签。
2. **名字里的 clustering 不是 K-means**：仓库实现是用 attention 最高/最低的实例构造伪标签，再用实例损失形成约束。
3. **热图不是病理真值**：它表示模型认为哪些区域对当前任务有判别价值，不等于完整病灶边界，也不自动构成因果解释。
4. **data-efficient 不等于少量数据也一定可靠**：它主要减少 patch 级标注成本，并提高 slide-level 监督的利用效率。

**现在只记住一句话：CLAM = 用切片标签学习 patch 的重要性，并用实例级约束让这些重要性更有判别意义。**

## 1. 三分钟摘要与推荐理由

CLAM 是一个面向 WSI 的弱监督 attention MIL 方法。它把一张切片视为 patch 的集合，用 attention 加权汇总 patch 特征完成 slide-level 分类；更关键的是，它从高、低 attention patch 中选出实例，加入实例级分类约束，使模型同时学习切片分类和局部证据定位。

我认为论文真正的核心创新不是“用了 attention”，而是：

> **让 attention 产生实例级伪监督，再用实例级损失反过来约束 attention。**

这样，attention 不再只是一个用于 pooling 的权重，也成为模型寻找局部判别证据的训练接口。这是 CLAM 相对普通 attention MIL 最值得记住的地方，也是它能够生成较有用热图的原因。

它适合作为 WSI/MIL 方向的前置论文，因为后续很多工作都在回答同一个问题：patch 之间如何聚合、如何建模空间关系、如何提高长序列建模或跨模态能力。

## 2. 论文解决的问题及其研究位置

### 2.1 WSI 的尺度问题

一张 WSI 太大，不能直接作为普通图像输入网络。常见处理方式是：

```text
WSI → 组织区域 → patch → patch feature → slide-level prediction
```

但 patch 数量可能非常多，且大多数 patch 对任务并不重要。

### 2.2 标注问题

逐 patch 标注昂贵、耗时且需要专业病理知识。临床数据更容易获得的是：

```text
这张 slide 是肿瘤 / 正常 / 某种亚型
```

因此，需要在只有 bag-level label 的条件下识别关键 instance。

### 2.3 普通弱监督 MIL 的不足

普通 MIL 可以完成 bag 分类，但可能存在两个问题：

- attention 只服务于最终分类，局部权重不一定稳定；
- 模型没有明确的 instance-level 判别约束，难以得到可信的局部证据。

CLAM 处于这条演进链的早期关键位置：

```text
普通 MIL → attention MIL → CLAM → DSMIL / TransMIL / DTFD-MIL / MambaMIL
```

## 3. 核心方法：为什么叫 CLAM？

### 3.1 Attention MIL 的基本计算

设一张 slide 有 \(N\) 个 patch，encoder 输出：

\[
h_i = f(x_i)
\]

attention 网络为每个 patch 计算分数，再在所有 patch 上做 softmax：

\[
a_i = \operatorname{softmax}(g(h_i))
\]

整张 slide 的表示是：

\[
z = \sum_{i=1}^{N} a_i h_i
\]

最后：

\[
\hat{y} = \operatorname{classifier}(z)
\]

仓库 `models/model_clam.py` 中的对应逻辑是：

```python
A = F.softmax(A, dim=1)
M = torch.mm(A, h)
logits = self.classifiers(M)
```

### 3.2 门控注意力

CLAM 使用 gated attention。代码中一条分支经过 `tanh`，另一条经过 `sigmoid`，再逐元素相乘：

```python
a = self.attention_a(x)
b = self.attention_b(x)
A = a.mul(b)
```

直觉上，它不是只看一条变换后的特征，而是用一条分支表达内容、另一条分支调节门控。

### 3.3 实例级聚类约束：最核心的创新

对于真实类别对应的 attention 分支：

- 取 attention 最高的 \(k\) 个 patch，作为高证据实例；
- 取 attention 最低的 \(k\) 个 patch，作为低证据实例；
- 分别赋予正、负的实例伪标签；
- 用 instance classifier 和实例损失训练。

仓库中对应：

```python
top_p_ids = torch.topk(A, self.k_sample)[1][-1]
top_n_ids = torch.topk(-A, self.k_sample, dim=1)[1][-1]
```

总损失近似为：

\[
L = \lambda L_{\text{bag}} + (1-\lambda)L_{\text{instance}}
\]

仓库训练代码对应：

```python
total_loss = bag_weight * loss + (1-bag_weight) * instance_loss
```

这里的“聚类”应谨慎理解：实现并不是显式运行 K-means，而是利用 attention 排序产生高置信度伪实例，再通过实例分类损失约束特征空间。

### 3.4 单分支与多分支

#### CLAM_SB

所有类别共享一个 attention 分支，适合较简单的二分类或作为默认模型。

#### CLAM_MB

每个类别都有独立的 attention 分支和 bag classifier：

```text
类别 1 → attention branch 1
类别 2 → attention branch 2
类别 3 → attention branch 3
```

这对于肿瘤亚型任务尤其重要，因为不同亚型可能依赖不同的形态学证据。多分支版本是 CLAM 从二分类推广到多分类 subtyping 的关键设计。

### 3.5 论文贡献与工程实现要区分

论文的算法贡献是：

- slide-level 弱监督；
- attention-based MIL；
- attention 引导的实例级约束；
- 多分类的 class-specific attention。

仓库还包含完整的 WSI 预处理、特征缓存、评估和热图工具。这些是重要的工程化贡献，但不应和 CLAM 的核心算法创新混为一谈。

## 4. 从原始 WSI 到热图：仓库如何实现论文

```text
原始 WSI
  ↓
create_patches_fp.py
  ↓ 组织分割、轮廓过滤、保存 patch 坐标
patches/*.h5
  ↓
extract_features_fp.py
  ↓ ResNet50 / UNI / CONCH 提取 patch features
pt_files/*.pt
  ↓
Generic_MIL_Dataset
  ↓ 一张 slide 的所有 features 组成一个 bag
main.py
  ↓ CLAM_SB / CLAM_MB / MIL 训练
eval.py
  ↓
create_heatmaps.py
  ↓ attention 映射回 WSI
分类结果 + attention heatmap + 高分 patch
```

### 4.1 WSI 分割和 patch 坐标

入口：`create_patches_fp.py`

核心类：`wsi_core/WholeSlideImage.py`

主要操作：

- 用 OpenSlide 读取 `.svs`、`.ndpi`、`.tiff`；
- 在低分辨率下用 HSV、阈值、形态学操作分割组织；
- 过滤小轮廓和组织内部空洞；
- 只保留落在组织轮廓中的 patch；
- 将 patch 坐标保存为 HDF5。

当前仓库推荐的快速流程主要保存坐标，不必先把所有 patch 图片写入磁盘；之后特征提取时再从原始 WSI 动态读取。这是后续仓库更新带来的工程优化，不是 2021 年论文方法本身。

### 4.2 Patch 特征提取

入口：`extract_features_fp.py`

编码器由 `models/builder.py` 构建，当前仓库支持：

- `resnet50_trunc`
- `uni_v1`
- `conch_v1`

每张 slide 通常会得到：

```text
h5_files/slide_x.h5   # feature + coordinate
pt_files/slide_x.pt   # 训练时快速读取的 feature
```

需要注意：当前仓库后续加入了 UNI、CONCH 等编码器支持；这不等于原始 CLAM 论文使用了这些基础模型。

### 4.3 Dataset 和 slide-level label

数据 CSV 至少包含：

```csv
case_id,slide_id,label
patient_0,slide_0,tumor_tissue
patient_1,slide_1,normal_tissue
```

`Generic_MIL_Dataset` 会把一个 `slide_id` 对应的 `.pt` 文件加载成一个 bag，并返回：

```text
所有 patch features + 整张 slide 的 label
```

如果一个患者有多张 slide，划分数据时必须按患者隔离，避免同一患者的信息同时出现在训练和测试中。仓库的数据类支持患者级处理，但实际使用时仍应检查任务配置；当前 `main.py` 的 dummy task 示例将 `patient_strat` 设置为 `False`，不能直接当作所有真实数据的安全默认值。

### 4.4 训练、评估和热图

- `main.py`：多折 CLAM/MIL 训练；
- `utils/core_utils.py`：bag loss、instance loss、验证和 AUC；
- `eval.py`：加载 checkpoint，在 train/val/test/all 上评估；
- `create_heatmaps.py`：计算 attention、保存 block map、生成叠加热图，并可采样 top-k patch。

## 5. 关键实验与论文结论

论文主要验证了三件事：

1. **数据效率**：只用 slide-level label，也能完成有竞争力的 WSI 分类。
2. **可解释性**：attention 可以帮助定位与分类相关的局部形态区域。
3. **适应性**：模型可以在独立测试队列、不同组织制备或成像条件上保持一定迁移能力。

论文报告了 TCGA 肾癌亚型、肺癌亚型和淋巴结转移等任务，并讨论了独立 cohort、biopsy/resection 以及手机显微图像上的适应性。这里应把“跨域表现”理解为论文的实验证据，而不是一个显式的 domain adaptation 模块。

阅读实验结果时，优先问：

- 与普通 attention MIL 相比，instance-level constraint 带来了什么增益？
- 当只使用部分训练标签时，性能如何变化？
- 热图中的高分区域是否经过病理学验证？
- 外部数据上的收益来自算法、encoder，还是数据预处理和染色分布？

## 6. 我认为最值得迁移的思想

### 6.1 用弱标签产生更细的训练信号

没有 patch 标注时，不是只能做纯 bag-level 训练。可以利用模型当前的置信度或排序结果构造高置信度实例，再反过来约束模型。

这是一种通用范式：

```text
粗粒度标签
  → 模型产生局部置信度
  → 选择高/低置信度实例
  → 实例级伪监督
  → 改善整体模型
```

### 6.2 将昂贵的视觉编码与轻量 MIL 训练拆开

仓库把：

```text
WSI 读取和 encoder 推理
```

与：

```text
patch feature 上的 MIL 训练
```

拆成两个阶段。这样可以缓存 features，减少重复读取 WSI 和重复运行 encoder 的成本。

### 6.3 分类器和定位器共享同一套学习信号

CLAM 没有另外训练一个独立的 ROI 检测器，而是让 attention 同时服务于：

- bag 表示构建；
- patch 重要性排序；
- 热图生成。

这使分类和解释之间的接口非常直接，但也带来了“attention 是否真的忠实”的问题。

## 7. 局限、复现风险和博士课题切入点

### 7.1 Attention 不等于因果解释

高 attention 只能说明模型在当前参数和任务下更依赖该区域，不能证明该区域是病理诊断的充分原因。应结合遮挡实验、反事实测试、病理专家标注或外部定位指标验证。

### 7.2 伪实例标签依赖初始 attention

如果初始 attention 错了，top-k 和 bottom-k 实例也可能错；instance loss 可能强化早期偏差。这是 CLAM 方法最值得研究的稳定性问题之一。

### 7.3 编码器和切块策略可能比聚合器更影响结果

patch size、magnification、组织分割、染色差异和预训练 encoder 都会显著影响 features。不能只比较 CLAM、TransMIL、MambaMIL 的聚合器，而忽略上游处理是否完全一致。

### 7.4 患者泄露风险

同一患者的多张 slide 不能随意分到 train 和 test。否则模型可能记住患者、扫描批次或样本来源，而不是学习病理形态。

### 7.5 领域迁移并非自动成立

论文显示了一定的跨 cohort 泛化，但真实数据遇到新的扫描仪、染色协议、器官或病例谱时，仍需要外部验证和必要的 domain adaptation。

### 7.6 可以继续追问的研究方向

- 用不确定性估计替代硬 top-k 伪标签；
- 让 attention 约束对染色和扫描域变化更稳健；
- 将空间邻接或组织拓扑加入 CLAM；
- 结合病理基础模型研究 encoder 与 MIL 聚合器的相互作用；
- 用可验证的反事实方法评估 heatmap 忠实度；
- 将 slide-level 标签与细胞、空间组学或报告文本结合。

## 8. 建议复现路径

### 最小流程

1. 使用 `heatmaps/demo/` 中的示例 WSI 和 checkpoint。
2. 跑通 `create_patches_fp.py` 的组织分割和 patch 坐标生成。
3. 用 `extract_features_fp.py` 导出 feature。
4. 用 `create_heatmaps.py` 生成 attention heatmap。

### 标准实验

1. 准备包含 `case_id`、`slide_id`、`label` 的 CSV。
2. 固定患者级 train/val/test 或交叉验证划分。
3. 保持 patch size、magnification、encoder 和 feature 维度一致。
4. 对比 `clam_sb`、`clam_mb` 和 `mil`。
5. 同时报告 AUC、accuracy、外部测试性能和定位质量。

### 推荐代码阅读顺序

```text
create_patches_fp.py
→ extract_features_fp.py
→ dataset_modules/dataset_generic.py
→ models/model_clam.py
→ main.py
→ utils/core_utils.py
→ eval.py
→ create_heatmaps.py
```

## 9. 与前后论文的关联

先读 CLAM，再读：

```text
CLAM → DSMIL → TransMIL → DTFD-MIL → MambaMIL → GMMamba
```

可以观察到研究重点如何变化：

- CLAM：学习关键 patch 和 attention 约束；
- DSMIL：双流实例/包级建模；
- TransMIL：建模 patch 间相关性和空间结构；
- DTFD-MIL：分层伪包与特征蒸馏；
- MambaMIL / GMMamba：处理超长 patch 序列与更高效的上下文建模。

## 10. 最终判断

如果只能记住一个贡献：

> **CLAM 用 attention 找到高置信度局部实例，再用实例级伪监督反过来约束 attention，从而在没有 patch 标注的条件下，同时获得 slide 分类能力和局部证据定位能力。**

如果只能记住一个批判性问题：

> **热图是模型真正学到的病理证据，还是数据集、扫描仪和染色偏差的可视化？**

这两个问题分别对应 CLAM 的方法价值和研究风险。

## 11. 官方链接

[论文（Nature BME）](https://www.nature.com/articles/s41551-020-00682-w) · [论文（arXiv）](https://arxiv.org/abs/2004.09666) · [代码](https://github.com/mahmoodlab/CLAM)
