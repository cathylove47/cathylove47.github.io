# 18｜MPFlow：多模态辅助的 flow matching 后验重建

**论文**：MPFlow: Multi-modal Posterior-Guided Flow Matching for Zero-Shot MRI Reconstruction  
**作者**：Seunghoi Kim、Chen Jin、Henry F. J. Tregidgo、Matteo Figini、Daniel C. Alexander  
**论文来源**：[MICCAI 2026 官方论文页](https://papers.miccai.org/miccai-2026/0671-Paper2812.html)  
**使用版本／发表状态**：MICCAI 2026 接收版开放获取，LNCS 16888；另核对 arXiv:2603.03710v4（2026-09-24 更新）  
**核验日期**：2026-10-11（精读页核查更新于 2026-10-14）  
**阅读范围**：作者摘要与官方论文信息；Table 1 / Table 2 已逐格转录核对（见精读页），其余分析与消融细节仍待补。  
**代码状态**：官方论文页提供代码入口；本站未运行。已按固定提交 `0c302f330a1801db678970a5ba8dc5dd96f72ccf` 逐文件核查实现与论文的对应关系。

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/mpflow-story.html)** — 含四处交互（辅助模态信息重叠滑杆、直线与弯曲轨迹离散误差、自适应温度曲线、初始噪声优化的 NFE 记账）、九张公式卡、Table 1 / Table 2 原表条形图与官方仓库的真实片段。

## 1. 三分钟摘要

MPFlow 在推理时利用辅助 MRI 模态引导 rectified-flow 重建。PAMRI 预训练学习跨模态共享表示，采样时联合使用测量一致性和特征对齐，旨在减少病灶相关的重建幻觉。

## 2. 它到底怎么做

1. 输入欠采样目标扫描及辅助 MRI 模态。
2. 使用 PAMRI 编码跨模态特征。
3. 联合测量一致性与特征对齐引导 flow 采样。
4. 输出图像并检查病灶结构保真度。

## 3. 实验与精读检查

作者在 HCP 和 BraTS 上评价图像质量、采样效率及病灶相关指标。

以下为本站整理的检查问题：

- 区分零样本重建与无需任何预训练，查清 PAMRI 和生成先验训练数据。
- 核对辅助扫描是否包含额外病灶信息，以及配准误差的影响。
- 在相同计算预算下比较质量，并单独评价病灶保留。

## 4. 方向与起步条件

本站推断：辅助模态不可靠或缺失时的引导强度控制值得探索；先明确相对现有多对比方法的差异。

研究问题的创新性需要继续对照相关工作；上述切口是待验证的选题建议。

## 5. 与站内路线的联系

与 DuDoRNet、MC-VarNet 比较辅助对比的使用方式；与 CM-RED 比较速度与物理约束。

## 6. 阅读产出

整理任务输入、前向模型、训练数据、测试时可用信息和计算成本。选择一个原文实验，写明它支持哪个结论，以及还需要什么实验才能验证你的切口。

## 7. 来源与内容归属

- [故事式 HTML 精读页](/pathology-atlas/learning/mpflow-story.html)（公式、交互、原表数值与代码核查）
- [审稿人分析页](/pathology-atlas/learning/mpflow-review.html)（三条审稿意见、八条关切、rebuttal 数字与 meta-review 分歧）
- [MICCAI 2026 正式来源](https://papers.miccai.org/miccai-2026/0671-Paper2812.html)
- [会议接收版 PDF](https://papers.miccai.org/miccai-2026/paper/2812_paper.pdf)
- [作者代码入口](https://github.com/edshkim98/MPFlow)
- [作者原文与元数据](https://arxiv.org/abs/2603.03710v4)
- [原始 PDF](https://arxiv.org/pdf/2603.03710v4)
- 论文事实来自作者原文；中文概述、精读检查与选题建议为本站整理。

