# End-to-End VarNet

## 三分钟摘要与推荐理由

E2E-VarNet 将经典变分网络扩展到多线圈 MRI，并把灵敏度图估计纳入端到端学习。它兼具清晰物理结构、成熟 fastMRI 实现和预训练权重，是这个分支最值得完整复现的基线。

## 问题与研究位置

多线圈重建不仅要恢复图像，还要处理每个接收线圈的空间敏感度。依赖外部校准会割裂流程，VarNet 用中心 k-space 学习灵敏度并联合优化。

## 核心方法和数据流

中心 k-space → sensitivity model → 多线圈图像合成；随后多个 cascade 在 k-space 中执行软数据一致性，并由图像域 U-Net 学习正则化更新。

## 关键实验、数据集与指标

重点看 fastMRI 多线圈膝关节任务、不同加速率以及挑战评测。复现时固定官方数据切分、mask 参数与归一化，否则指标不可直接比较。

## 官方代码仓库审计

实现位于 `facebookresearch/fastMRI/fastmri_examples/varnet`，有 Lightning 训练模块、测试和官方权重。仓库 README 明确提示当前代码与论文模型/超参数存在少量差异，引用结果时需区分。

## 资源与数据准备

推理可使用预训练权重；全量训练较重。建议从 2–4 个 cascade、小分辨率或数据子集起步，再扩大至官方配置。

## 建议复现路径

1. 运行预训练模型并保存 zero-filled、重建、误差图。
2. 跟踪一个 batch 的 k-space/coil/image shape。
3. 训练小型 VarNet。
4. 消融 sensitivity model 与数据一致性权重。

## 建议代码阅读顺序

`fastmri/models/varnet.py` → `fastmri/models/unet.py` → `fastmri_examples/varnet/varnet_module.py` → `train_varnet_demo.py` → data transforms。

## 可迁移思想与博士切入点

值得研究灵敏度估计失效、校准区不足、跨线圈数迁移和噪声感知数据一致性。它也是测试新正则器最可靠的工程母体。

## 局限与复现风险

训练显存与时间成本高；SSIM 优化不保证病灶细节。公开数据多为回顾性规则采样，真实部署差距仍大。

## 与前后论文的关联

承接 MoDL 的优化展开；HUMUS-Net 更换多尺度正则器，PromptMR+ 则重点改进深展开的梯度与显存效率。

## 官方链接

- [论文](https://arxiv.org/abs/2004.06688)
- [代码与权重](https://github.com/facebookresearch/fastMRI/tree/main/fastmri_examples/varnet)
