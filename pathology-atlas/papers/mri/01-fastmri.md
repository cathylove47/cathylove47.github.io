# fastMRI

## 三分钟摘要与推荐理由

fastMRI 首先是一套**原始 MRI 测量数据、统一任务定义和基线代码**，而不只是一个模型。学习 MRI 重建时，最容易犯的错误是直接读网络而跳过 k-space、线圈灵敏度、采样掩膜和数据一致性；这篇应当作为全分支的入口。

## 问题与研究位置

论文把加速 MRI 研究从各自的小规模私有数据，推向公开的膝关节/脑部多线圈数据和可比较的 NMSE、PSNR、SSIM 基准。后面的 VarNet、HUMUS-Net 与 PromptMR 系列都可以在这套坐标系中理解。

## 核心方法和数据流

原始多线圈 k-space → 掩膜欠采样 → 逆傅里叶变换 → 线圈合成/灵敏度建模 → 重建模型 → 与全采样参考图像比较。先掌握 `fft2c/ifft2c`、复数张量表示、RSS 合成和 mask 生成。

## 关键实验、数据集与指标

重点不是背排行榜数字，而是理解单线圈与多线圈任务、4×/8×加速和中心低频采样的差别。指标以 NMSE、PSNR、SSIM 为主；它们不等同于临床可诊断性。

## 官方代码仓库审计

`facebookresearch/fastMRI` 使用 MIT 许可证，包含数据变换、采样掩膜、U-Net 与 VarNet 示例、测试和预训练 VarNet 权重。仓库成熟，但数据需按官方流程申请，完整训练需要较大存储。

## 资源与数据准备

最小练习只需一个公开示例或单个 HDF5 volume；标准实验建议预留数百 GB。多线圈 VarNet 训练通常需要高显存 GPU，先用裁剪后的验证 volume 做数据管线测试。

## 建议复现路径

1. 读取一个 HDF5，显示 k-space、零填充重建和 target。
2. 跑通 U-Net baseline 的验证流程。
3. 固定同一 mask，对比 zero-filled、U-Net 和 VarNet。
4. 扩展到不同加速率与跨部位泛化。

## 建议代码阅读顺序

`fastmri/data` → `fastmri/fftc.py` → `fastmri/coil_combine.py` → `fastmri_examples/unet` → `fastmri_examples/varnet`。

## 可迁移思想与博士切入点

可迁移的是“公开原始测量 + 明确前向模型 + 统一挑战”的研究基础设施思想。可研究跨厂商/场强泛化、非笛卡尔采样、临床感知指标与数据治理。

## 局限与复现风险

fastMRI 主要是回顾性欠采样；真实扫描中的运动、校准误差和协议漂移未被完全覆盖。论文结果与当前仓库默认超参数也可能存在版本差异。

## 与前后论文的关联

前置知识是傅里叶成像和并行 MRI；下一篇 DC-CNN 展示最直观的数据一致性级联，VarNet 则把这条路线系统化。

## 官方链接

- [论文](https://arxiv.org/abs/1811.08839)
- [代码](https://github.com/facebookresearch/fastMRI)
- [数据与项目页](https://fastmri.med.nyu.edu/)
