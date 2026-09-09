# PromptMR+

## 三分钟摘要与推荐理由

PromptMR+ 不只追求换一个更大的正则器，而是重新检查深展开模型的梯度传播与灵敏度图估计显存。它通过有效梯度学习和按线圈计算 sensitivity map，让更深 cascade 训练更现实，是工程与方法结合得很好的 ECCV 2024 Oral。

## 问题与研究位置

展开网络级联越深，显存和优化困难越明显；多线圈灵敏度估计也会占据大量显存。论文认为这些训练机制可能比继续堆模块更关键。

## 核心方法和数据流

总体仍是 PromptMR/VarNet 式展开；关键变化在跨 cascade 的梯度策略、checkpointing 和逐线圈灵敏度估计。目标是在可控显存下训练更多 cascade，并保持物理一致性。

## 关键实验、数据集与指标

官方仓库覆盖 fastMRI knee/brain、Calgary-Campinas brain 和 CMRxRecon 心脏数据，并公开权重与重建结果。除 PSNR/SSIM/NMSE，还应比较训练/推理显存、速度和 cascade 数。

## 官方代码仓库审计

`hellopipu/PromptMR-plus` 提供完整训练、推理、配置、数据说明、demo 和 Hugging Face 权重。仓库说明 fastMRI knee 在启用 checkpoint 与逐线圈 sensitivity 计算时至少约需 17 GB GPU 显存。许可证为非商业研究用途，不是宽松开源许可证。

## 资源与数据准备

最小测试运行 `demo_model.py`；标准实验选择 fastMRI knee。多卡可用于加速训练，但先确认单卡数值一致与梯度累计设置。

## 建议复现路径

1. 运行 demo 与官方权重推理。
2. 记录 baseline PromptMR 的显存与速度。
3. 分别启用 gradient/checkpoint 与 per-coil sensitivity 策略。
4. 扩展 cascade，绘制质量—显存—时间前沿。

## 建议代码阅读顺序

`demo_model.py` → `configs/base.yaml` 与模型配置 → `models` → `mri_utils` → `pl_modules` → `main.py` → `DATASET.md`。

## 可迁移思想与博士切入点

最值得迁移的是把训练系统约束纳入算法设计。可研究低显存展开、隐式梯度、跨设备训练，以及质量—资源—可靠性三目标优化。

## 局限与复现风险

代码与权重虽完整，但多数据集预处理复杂；非商业许可证限制下游使用。仓库部分结果来自验证子集，必须按 README 注释区分于论文正式结果。

## 与前后论文的关联

这是当前路线的综合节点：继承 VarNet 的多线圈展开、HUMUS-Net 的架构效率问题和 PromptMR 的条件提示。读完后可开始设计自己的效率或泛化课题。

## 官方链接

- [ECCV 论文](https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/2597_ECCV_2024_paper.php)
- [代码、配置与权重](https://github.com/hellopipu/PromptMR-plus)
