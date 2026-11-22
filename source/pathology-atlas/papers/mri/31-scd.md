# SCD：边采样边适配的可控条件扩散

**[打开论文讲解与 CT 部分复现报告](/pathology-atlas/learning/scd-repro/index.html)**

一页同时讲论文和复现：先讲训练域外的幻觉问题与 SCD 每一步采样的五个阶段，再给出四个 CT 设置的自跑结果、调参前后的差距、论文主打例子没有复现的排查过程。图片和采样视频都是自跑输出。

## 基本资料

- 英文标题：Steerable Conditional Diffusion for Out-of-Distribution Adaptation in Medical Image Reconstruction
- 中文译名：面向医学图像重建分布外适配的可控条件扩散（本站翻译）
- 作者：Riccardo Barbano、Alexander Denker、Hyungjin Chung、Tae Hoon Roh、Simon Arridge、Peter Maass、Bangti Jin、Jong Chul Ye
- 发表：IEEE TMI 2025
- [arXiv:2308.14409](https://arxiv.org/abs/2308.14409)
- [官方代码](https://github.com/alexdenker/SteerableConditionalDiffusion)

## 为什么选择这篇

扩散模型做 CT、MRI 重建时，先验来自训练集；测试图像换了分布，条件采样仍会让结果大体符合测量，但测量约束不到的部分会被训练集特有的形状填上。SCD 不用目标域的干净图像，只用这一次的测量，在 [DDS](20-dds.md) 的每一步采样里用 LoRA 微调去噪网络，让去噪估计与测量吻合；噪声项仍用未适配的网络。它是读懂"测试时适配能不能压住分布外幻觉"的直接样本。

## 阅读内容与来源

论文事实来自 arXiv 版正文与表 Ⅰ、表 Ⅱ、图 3。复现只覆盖 CT：官方仓库（提交 `53b74a6`，未改动）没有 LoDoPaB、BrainWeb 与 MRI 的代码或数据接口。四个可复现设置按论文协议先在 10 张验证图上调参，再在测试集（AAPM 56 张、Ellipses 100 张）上评估，2026-11-21 在 gpu04 完成。

| 训练域 → 测试域 | 自跑 SCD − DDS（dB） | 论文 SCD − DDS（dB） | 判断 |
|---|---|---|---|
| AAPM → AAPM | −0.09 | +0.18 | 复现 |
| AAPM → Ellipses | +1.85 | +2.30 | 复现 |
| Ellipses → Ellipses | +1.05 | −0.89 | 方向相反 |
| Ellipses → AAPM（论文主打） | −0.90 | +3.16 | 没有复现 |

## 需要记住的边界

- 直接用 README 与代码默认参数，所有设置都比论文低 3–7 dB；论文只公开了核桃示例的超参，表 Ⅰ 各设置的超参需要自己调。
- 代码与论文有出入：算子从 ODL 换成未归一化的 torch Radon，采样步数写死（SCD 100 步、DDS 50 步，论文相反），核桃是从真值图仿真的测量。
- 核桃单张图上 SCD 随机性很大：同样设置跑三次得到 28.23、27.16、22.35 dB，单次数值不宜作结论。
- 复现结果未经作者确认；Ellipses → AAPM 没复现的原因属于推断，详见报告的诊断一节。
