# HUMUS-Net

## 三分钟摘要与推荐理由

HUMUS-Net 在展开网络中结合高分辨率卷积与低分辨率 Transformer，使模型既保留局部细节，又以较低代价建模长程依赖。它适合学习“架构创新如何服从 MRI 物理框架”。

## 问题与研究位置

纯 CNN 的感受野受限，而直接在高分辨率图像上使用 Transformer 成本过高。论文把全局建模放到多尺度低分辨率特征上，再回到高分辨率重建。

## 核心方法和数据流

VarNet 式多 cascade 展开 → 每个正则器内部由卷积提取高分辨率特征 → Transformer 处理低分辨率多尺度特征 → 融合并执行数据一致性。

## 关键实验、数据集与指标

仓库给出 fastMRI 多线圈膝关节 8× 的可复现实验，并覆盖 Stanford 2D/3D FSE 数据。读消融时区分多尺度、Transformer 和展开深度的贡献。

## 官方代码仓库审计

`z-fabian/HUMUS-Net` 为官方 PyTorch 实现，含 `models`、`pl_modules`、数据代码、requirements 和预训练 leaderboard 权重。目录沿用 fastMRI 风格，可维护性优于早期代码。

## 资源与数据准备

预训练推理可先做；全量训练计算和存储成本较高。Transformer 窗口、patch 大小与输入分辨率相互约束，修改尺寸时需检查 padding。

## 建议复现路径

1. 预训练模型验证 fastMRI 单 volume。
2. 对比同一输入下 E2E-VarNet 与 HUMUS-Net。
3. 训练缩小版网络并记录显存/速度。
4. 消融 Transformer、多尺度层级和 cascade 数。

## 建议代码阅读顺序

`humus_examples` → `pl_modules` → `models/humus_net.py` → 多尺度 Transformer 模块 → `data`。

## 可迁移思想与博士切入点

可以进一步研究状态空间模型、稀疏注意力或频域 token；评价时应把重建质量、显存、吞吐和跨尺寸稳定性放在同一张表。

## 局限与复现风险

架构复杂度高，收益可能依赖精细训练配置；多尺度 attention 的提升不等于临床细节必然改善。

## 与前后论文的关联

以 E2E-VarNet 为母体更换正则器；PromptMR+ 进一步从训练梯度和灵敏度估计讨论展开网络效率。

## 官方链接

- [论文](https://arxiv.org/abs/2203.08213)
- [代码与权重](https://github.com/z-fabian/HUMUS-Net)
