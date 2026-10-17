# 17｜Patch Diffusion Harmonization：保留解剖的跨中心 MRI 风格协调

**论文**：Anatomy- and Site-Guided 3D Patch Diffusion for Robust MRI Harmonization  
**作者**：Barnabé Hache、Vincent Roca、Grégory Kuchcinski、Dorian Manouvriez、Renaud Lopes  
**论文来源**：[MICCAI 2026 原文](https://papers.miccai.org/miccai-2026/0052-Paper3157.html)  
**使用版本／发表状态**：MICCAI 2026 接收版开放获取，LNCS 16881  
**核验日期**：2026-10-11  
**阅读范围**：作者摘要与官方论文信息；本篇为入门导读，实验表格尚未逐项审计。  
**代码状态**：官方提供代码与权重入口，并列出 IXI、OASIS-3 等数据链接；本站未运行。

## 1. 三分钟摘要

该方法对多中心 T1 MRI 做图像 harmonization：以解剖特征与站点嵌入条件控制 3D patch 扩散，再通过受约束的采样保持个体结构。目标是减少扫描仪相关差异，同时保留有意义的生物学信号。

## 2. 它到底怎么做

1. 提取梯度与高频解剖特征。
2. 结合目标站点嵌入控制 patch 扩散。
3. 对重叠高分辨率 patch 进行条件合成。
4. 评价站点差异与解剖、生物信号的保留。

## 3. 实验与精读检查

官方摘要描述 traveling-subject 数据与病理队列验证，并评价组织信息及脑—认知关联。

以下为本站整理的检查问题：

- 站点风格变化与病变改变分别评价，不能只看图像相似度。
- 查训练站点、测试站点及同一受试者的划分。
- 与统计 harmonization 和非生成基线比较，记录下游指标。

## 4. 方向与起步条件

本站推断：适合探索病变保留和未见站点条件；只有单中心数据时难以支撑跨中心结论。

研究问题的创新性需要继续对照相关工作；上述切口是待验证的选题建议。

## 5. 与站内路线的联系

本篇处理已重建图像的跨中心差异；BiasRecon 处理测量到图像的开放域重建。两类任务的输入与指标不同。

## 6. 阅读产出

整理任务输入、前向模型、训练数据、测试时可用信息和计算成本。选择一个原文实验，写明它支持哪个结论，以及还需要什么实验才能验证你的切口。

## 7. 来源与内容归属

- [作者原文与元数据](https://papers.miccai.org/miccai-2026/0052-Paper3157.html)
- [原始 PDF](https://papers.miccai.org/miccai-2026/paper/3157_paper.pdf)
- [作者代码入口](https://github.com/barna-hache/PatchLevelDiffusionMRIHarmonization)
- 论文事实来自作者原文；中文概述、精读检查与选题建议为本站整理。

