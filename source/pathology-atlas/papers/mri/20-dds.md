# DDS：分解式扩散采样

**[打开完整的故事式 HTML 精读页](/pathology-atlas/learning/dds-story.html)**

生成式 MRI 重建精选主线的第一篇 HTML 样板。页面从欠采样测量的歧义讲起，解释去噪估计、CG 校正与采样转移，配有交互示意、四张公式卡、Table 2 消融、官方代码对应及自测。

## 基本资料

- 英文标题：Decomposed Diffusion Sampler for Accelerating Large-Scale Inverse Problems
- 中文译名：用于加速大规模逆问题的分解式扩散采样器（本站翻译）
- 作者：Hyungjin Chung、Suhyeon Lee、Jong Chul Ye
- 单位：KAIST，见正式论文首页。
- 发表：ICLR 2024。
- [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/file/a8eb51c394d59ffc3324afa672fd24dc-Paper-Conference.pdf)
- [arXiv 版本记录](https://arxiv.org/abs/2303.05754)
- [官方代码](https://github.com/hyungjin-chung/DDS)

## 为什么选择这篇

DDS 将昂贵的生成先验和较便宜的物理求解分工：在干净估计上做 CG，再构造下一噪声层级。它适合接续 Score-MRI，理解扩散采样与测量一致性的关系，再进入 Flow Matching 路线。本站精读判断为 A，这表示阅读优先级，并非正式审稿评分。

## 阅读内容与来源

HTML 精读依据正式论文 §3–4、Table 1–2、附录 B/C/G，以及官方仓库固定提交 `509b140ee8ba76772ab7d98929270033d4306f2f`。论文事实、代码事实、本站解释和教学示意分别标注。当前未执行模型推理或复现论文指标。

## 需要记住的边界

几何推理依赖仿射流形、均匀分布及 Krylov 切空间条件。实验支持的是具体 fastMRI 与采样设置；低 NFE 出现失败与拒绝采样。读完重点应是方法为何这样设计，而不是只记住加速倍数。
