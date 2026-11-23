# 41｜3DD-TTA：不改分类器，把腐蚀点云在 LION 潜空间里「去腐蚀」回源域

**论文**：Test-Time Adaptation of 3D Point Clouds via Denoising Diffusion Models，Hamidreza Dastmalchi、Aijun An、Ali Cheraghian、Shafin Rahman、Sameera Ramasinghe（York University、University of Canberra、Amazon）；WACV 2025，pp. 1566–1576；arXiv:2411.14495（v1 2024-11-21）
**定位**：训练-free 的 3D 点云测试时适配；冻结分类器与扩散先验，只改输入——把腐蚀点云用 LION 的 VAE 编成 shape latent 与 latent points，加噪后沿 DDIM 反向去噪，并用「选择性 Chamfer 距离」梯度把形状先验与腐蚀观测对齐，解码后喂给冻结的 Point-MAE
**精读核验**：2026-11-22 依 arXiv HTML v1（即 WACV 2025 版）全文逐节读过：§1–3（问题定义、LION 两级隐空间、Algorithm 1 与式 8–12）、§4.1–4.4 与 Table 1–4、Figure 1–5，以及附录 B 的超参网格与附录 D 的定性图。官方代码 `hamidreza-dastmalchi/3DD-TTA` 同日经 GitHub 页面核对，含 `demo_3dd_tta.py`、`main_3dd_tta.py`、`models_mate/Point_MAE.py`、`utils/` 与 `lion_ckpts/`，是真实实现。**本站做过推理走查（小样本/单机复跑仓库脚本，用作者权重，非论文指标复现）**：见 [推理走查记录](/pathology-atlas/learning/infer-3dd-tta.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Test-time adaptation (TTA) of 3D point clouds is crucial for mitigating discrepancies between training and testing samples in real-world scenarios, particularly when handling corrupted point clouds. LiDAR data, for instance, can be affected by sensor failures or environmental factors, causing domain gaps. Adapting models to these distribution shifts online is crucial, as training for every possible variation is impractical. Existing methods often focus on fine-tuning pre-trained models based on self-supervised learning or pseudo-labeling, which can lead to forgetting valuable source domain knowledge over time and reduce generalization on future tests. In this paper, we introduce a novel 3D test-time adaptation method, termed 3DD-TTA, which stands for 3D Denoising Diffusion Test-Time Adaptation. This method uses a diffusion strategy that adapts input point cloud samples to the source domain while keeping the source model parameters intact. The approach uses a Variational Autoencoder (VAE) to encode the corrupted point cloud into a shape latent and latent points. These latent points are corrupted with Gaussian noise and subjected to a denoising diffusion process. During this process, both the shape latent and latent points are updated to preserve fidelity, guiding the denoising toward generating consistent samples that align more closely with the source domain. We conduct extensive experiments on the ShapeNet dataset and investigate its generalizability on ModelNet40 and ScanObjectNN, achieving state-of-the-art results. The code has been released at this https URL.

*来源：arXiv:2411.14495v1 摘要（WACV 2025 版）。*

## 中文摘要

> 3D 点云的测试时适配（TTA）对缓解训练样本与测试样本之间的差异至关重要，尤其是在处理被腐蚀的点云时。例如 LiDAR 数据会因传感器故障或环境因素而受影响，造成域间隙。在线地把模型适配到这些分布偏移上很关键，因为为每一种可能的变化都训练一遍并不现实。现有方法多基于自监督学习或伪标签微调预训练模型，这会随时间遗忘宝贵的源域知识，并降低在后续测试上的泛化。本文提出一种新的 3D 测试时适配方法 3DD-TTA，即 3D Denoising Diffusion Test-Time Adaptation。该方法用一个扩散策略把输入点云样本适配回源域，同时保持源模型参数不变。具体而言，它用变分自编码器（VAE）把被腐蚀的点云编码成形状潜变量（shape latent）与潜点（latent points）；潜点被高斯噪声腐蚀后进入去噪扩散过程。该过程中形状潜变量与潜点都被更新以保持保真度，引导去噪生成更贴近源域的一致样本。我们在 ShapeNet 上做了充分实验，并在 ModelNet40 与 ScanObjectNN 上考察其泛化性，取得当前最优结果。代码已公开。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**3DD-TTA 把「测试时适配」问题改写成「点云去腐蚀」：分类器、扩散先验都不训练，只在 LION 的两级隐空间里把腐蚀样本往源域流形上拉，再解码送进冻结的分类器。**

三件值得读的事：

1. **适配对象是输入，不是模型**：摘要与 §3 明确「training-free」指测试期不更新任何网络参数。因此不会有 TENT/SHOT 那类熵最小化带来的灾难性遗忘；代价是适配能力受限于扩散先验本身（形状先验只在 ShapeNet 上训练）。
2. **「选择性 Chamfer 距离」是唯一的新机制**：普通 Chamfer 距离会被腐蚀点云的离群点主导（background 腐蚀下尤其严重）。作者只取两个点集互为最近邻的平方距离中**最小的 λ%**（λ=0.96，附录 B 网格搜索）求和，再对两个方向取平均（式 11），于是梯度只关注「粗形状」是否对上，忽略离群点。这个损失同时用于更新 latent points 的去噪步（式 9，权重 η=0.01）和 shape latent 的梯度下降（式 12，权重 γ=0.01）。
3. **效率来自 DDIM 与「少步数」**：总 DDIM 步数取 100（不是 LION 原始的 1000），去噪步数对多数腐蚀 5 步够用，只有 background 这类极端离群点腐蚀需要 35 步（Figure 5 左，Table 4）。作者报告 5 步时适配耗时 40 ms、1 步 12 ms、40 步 290 ms，因此可以塞进实时 LiDAR 流水线。

**关于它证明了什么（本页判断）**：Table 2（ModelNet40-c）显示 3DD-TTA 把 Point-MAE 源分类器从 57.6 拉到 65.7，超过 MATE-S 的 64.3；但增益分布极不均匀——uniform/gaussian/impulse/background 全面大涨（background 32.0→49.9），而 rotation 33.4、occlusion 39.9、lidar 42.2 只是小幅改善。作者自己归因于「训练-free 无法逆转旋转/剪切这类几何变换」。所以这篇的定位应读成「扩散去噪先验能修复噪声/密度/背景类腐蚀」，而非通用 3D TTA。

## 2. 问题及研究位置

设源域点云 x∈ℝ^{n×3} 上训练了分类器 p_c 与扩散模型 ε_θ；测试时拿到被腐蚀的 x̃（目标域 Q_t），不允许访问源数据、不允许改分类器参数。目标是先把 x̃ 适配回 Q_s 的分布，再用 p_c 分类。

已有位置：

- **参数更新型 TTA**：TENT 改 BN 统计量、SHOT 做熵最小化、TTT/TTT++ 用自监督代理任务、MATE-S 在点云上做自监督微调、DUA 做 BN 统计量适配。这些都会在线改参数，长时间运行有遗忘风险，且对 3D 点云这种无 batch 结构的输入不稳定。
- **扩散先验做生成/补全**：LION、PVD 等把点云映射到隐空间生成；但把它们用于「把腐蚀样本拉回源域」而非生成新形状，是本文的位置。
- **本文**：不训练、不改分类器，用预训练 LION 作为「源域投影算子」，以 SCD 梯度约束去噪轨迹。因此它天然与分类器解耦，可以套在任何冻结的 3D 分类器前。

## 3. 核心方法和数据流

```text
输入：腐蚀点云 x̃、源分类器 p_c、LION 编码器 q_z, q_h 与去噪网络 ε_h、解码器 p_d
z_0 ~ q_z(z_0 | x̃)                      # shape latent
h_0 ~ q_h(h_0 | z_0, x̃)                 # latent points，4×n
h_tw = √ᾱ_tw·h_0 + √(1−ᾱ_tw)·ε          # 按第 t_w 步前向加噪（tw=5，background 35）
for t = t_w … 1:
    ε_t = ε_h(h_t, z_0, t)
    h̄_0 = (h_t − √(1−ᾱ_t)·ε_t) / √ᾱ_t    # Tweedie 估计
    l = SCD_λ(h̄_0, h_0)                  # 只取最小的 λ% 最近邻距离
    z_0 ← z_0 − γ·∇_{z_0} l              # 更新 shape latent（γ=0.01）
    h_{t−1} = √ᾱ_{t−1}·h̄_0 + √(1−ᾱ_{t−1})·ε_t − η·∇_{h_t} l   # η=0.01
x̂ = p_d(x | z_0, h_0)
c = p_c(x̂)                               # 冻结分类器
```

三个要点：

1. **为什么加噪能「中和」腐蚀**：腐蚀（离群点、密度变化、遮挡）在潜空间里表现为局部高频扰动；前向加噪到第 5 步再把噪声去掉，相当于用先验的粗形状把扰动洗掉，而 SCD 只约束粗形状，避免把腐蚀本身当成要保留的细节。
2. **两个隐变量分工**：shape latent z_0 是全局形状编码，decoder 生成时以它为条件；latent points h_0 是点级结构。只更新 h 会让 z 仍带着腐蚀偏差，因此式 12 也对 z 做梯度下降——这是论文相对「只做 latent 去噪」的增量。
3. **超参极简**：λ=0.96、γ=η=0.01（网格搜索），DDIM 总步数 100，去噪 5 步 / background 35 步。作者没有学任何测试时参数，也没有 per-corruption 调参。

## 4. 论文证据与实验范围

**数据**：LION 在 ShapeNet（51,127 个形状、55 类）上预训练；评测用 ShapeNet-c（同源）、ModelNet40-c（跨数据集）、ScanObjectNN-c（真实扫描）三套，各 15 种腐蚀，腐蚀代码来自 ModelNet40-c 官方实现。分类器统一为 Point-MAE（Point-MAE 原论文训练设定）。

**ModelNet40-c（Table 2，准确率 %）**：

| corruption | Point-MAE (src) | MATE-S | 3DD-TTA |
|---|---|---|---|
| uniform | 62.4 | 75.0 | **77.5** |
| gaussian | 57.0 | 71.1 | **79.1** |
| background | 32.0 | 27.5 | **49.9** |
| impulse | 58.8 | 67.5 | **80.3** |
| upsampling | 72.1 | 78.7 | **81.8** |
| distortion_rbf | 61.4 | 69.5 | 63.8 |
| distortion_rbf_inv | 64.2 | 72.0 | 66.9 |
| density | 75.1 | 79.1 | 79.3 |
| density_inc | 80.8 | 84.5 | **84.7** |
| shear | 67.6 | 75.4 | 63.7 |
| rotation | 31.3 | 44.4 | 33.4 |
| cutout | 70.4 | 73.6 | **74.7** |
| distortion | 64.8 | 72.9 | 68.2 |
| occlusion | 36.2 | 39.7 | 39.9 |
| lidar | 29.1 | 34.2 | **42.2** |
| **Mean** | 57.6 | 64.3 | **65.7** |

**其它结果**：ShapeNet-c（Table 1）Mean 69.8（源分类器 59.3，MATE-S 63.1）；background 从 15.0 提到 77.6。ScanObjectNN-c（Table 3）Mean 64.3（源 61.5）。**效率**：5 步去噪 40 ms，1 步 12 ms，40 步 290 ms（Table 4，A6000）。

**范围限制（本页判断）**：只在合成腐蚀上评测（ModelNet40-c 的 15 种腐蚀是人为加噪/变换，不是真实传感器退化）；只有分类一个任务，没有分割/检测；没有测试集在线序列、没有跨 corruption 顺序的遗忘曲线（虽然「不改参数」使遗忘问题在原理上消失）；Classification 用的是 Point-MAE 单一分类器，换分类器是否同样收益未测。作者也承认 rotation/shear 这类几何变换无法靠去噪逆转。

## 5. 复现与审计重点

- **仓库结构**：`demo_3dd_tta.py` 是单样本定性 demo；`main_3dd_tta.py` 是定量评测入口（`--dataset_name=modelnet-c`）；`extensions/` 下是 Chamfer、EMD、kNN 的 CUDA 扩展；`models_mate/Point_MAE.py` 是冻结分类器；`lion_ckpts/` 放 LION 配置。
- **权重与数据**：LION 权重 `epoch_10999_iters_2100999.pt`（1.51 GB，HF `xiaohui2022/lion_ckpt`）；Point-MAE 权重 `modelnet_jt.pth`（352 MB，Google Drive）；ModelNet40-c 来自 Zenodo record 6017834 的 `modelnet40_c.zip`（1.97 GB，解压后 `data_<corruption>_5.npy` 形状 (2468,1024,3)）。三条都要自己准备，仓库不含权重。
- **代码坑（走查实测）**：`models_mate/Point_MAE.py:13` 的 `from extensions.chamfer_dist import ...` 在仓库里被注释掉，但 `Point_MAE.__init__` 会实例化 `ChamferDistanceL1/L2`，直接跑定量评测必然 `NameError`；`extensions/` 目录本身缺 `__init__.py`，即使装好 `chamfer` 顶层模块也无法按 `extensions.chamfer_dist` 导入。另外 `Pointnet2_PyTorch/pointnet2_ops_lib` 与 `chamfer3D` 的 `TORCH_CUDA_ARCH_LIST` 硬编码 8.6，在 4090（sm_89）上需要改 8.9。`knn_cuda` 官方仓库与 0.2 wheel 均已 404，只能用社区 fork。
- **走查（小样本，非论文指标）**：定性 demo（background、sample 11、35 步）跑通，输出腐蚀输入与适配后的 GIF。定量补齐导入后跑了 **ModelNet40-c 全部 15 种腐蚀、每种 2468/2468 样本**，Mean **63.03**（README 列 66.1；论文 Table 2 为 65.7，README 与论文本身不一致，本页对照用 README 列）。10/15 种差距 ≤1.5 pp；明显偏低的是 lidar 29.9（−12.3）、impulse 68.9（−11.4）、density 71.4（−7.1）、cutout 69.8（−4.9），background 反而高 10 pp（59.9 vs 49.9）。16 张 impulse 小样本得 68.75%，与全量 68.88% 一致，说明差距不是抽样噪声。ShapeNet-c 与 ScanObjectNN-c 未跑。
- **审计要点**：README 的 Mean（66.1）与论文 Table 2（65.7）不一致，引用时要以论文表格为准；`--num_samples`/`--corruptions` 是走查时新增的入口，不影响默认全量行为；`extensions/emd` 能编译但 import 报未定义符号（与 torch 2.0 API 不匹配），走查路径不用 EMD。

## 6. 建议阅读顺序

摘要 → §3.1 问题定义与 LION 两级隐空间 → Figure 3 与 Algorithm 1（重点看式 9/11/12 三个更新各自作用在谁身上）→ §3.3 的 SCD 定义与 λ → §4 的 Setup（λ、γ、η、100 步 DDIM、5/35 步）→ Table 1/2/3 对比 → Figure 5 的步数消融与 Table 4 的耗时 → 附录 B（超参网格）→ 附录 D（更多定性图）。

## 7. 前后关联

- 与 [37 号 TENT](../diffusion/37-tent.md)、[39 号 Diffusion-TTA](../diffusion/39-diffusion-tta.md) 构成「改参数 vs 改输入」的两端：TENT 只调 BN 仿射，Diffusion-TTA 把生成似然反传到判别器；3DD-TTA 则一个参数都不动，把测试时适配完全放到数据侧。三者可以对照「遗忘风险 / 适配能力 / 计算成本」的三角。
- 与 [38 号 DDA](../diffusion/38-dda.md) 最接近：DDA 也是「用扩散模型改输入图像」，但 DDA 用扩散模型做数据增广并配自监督损失，3DD-TTA 直接用扩散先验做投影、不需要分类器参与优化。
- 与 [24 号弱先验](24-weak-priors.md) 的框架相通：3DD-TTA 的先验（ShapeNet LION）与测试域（ModelNet40/ScanObjectNN）不同源，Table 2 的跨数据集结果可视为一次「弱先验 + 只靠输入投影」的实测——噪声类腐蚀能被先验拉回，几何变换类不能，正符合「先验只能修它见过的流形方向」。
- 与 [06 号 LDM](../diffusion/06-ldm.md) 是同一骨架的 3D 版：LION 的两级 VAE + 潜扩散对应图像 LDM 的 VAE + UNet，只是潜变量分成全局 shape latent 与点级 latent points，这也解释了为什么本文能对两者分别施加约束。
- 与本批的 [42 号 DCTTA](42-dctta.md) 是「测试时改输入」的另一种粒度：DCTTA 用再退化生成器造配对样本、改的是复原网络的一部分参数；3DD-TTA 造的是潜空间投影、一个参数都不改。两者都不是逐图重训，但约束来源不同（退化一致性 vs 形状先验）。[43 号噪声轨迹搜索](43-noise-trajectory-search.md) 则把测试时算力花在采样噪声上，是同一「不训练、只改推理过程」思路在生成任务里的版本。

## 8. 链接

- [arXiv:2411.14495（abs）](https://arxiv.org/abs/2411.14495)
- [arXiv HTML v1 全文](https://arxiv.org/html/2411.14495v1)
- [WACV 2025 官方论文页](https://openaccess.thecvf.com/content/WACV2025/html/Dastmalchi_Test-Time_Adaptation_of_3D_Point_Clouds_via_Denoising_Diffusion_Models_WACV_2025_paper.html)
- [官方代码 hamidreza-dastmalchi/3DD-TTA](https://github.com/hamidreza-dastmalchi/3DD-TTA)
- [LION 权重（Hugging Face xiaohui2022/lion_ckpt）](https://huggingface.co/xiaohui2022/lion_ckpt)
- [ModelNet40-c 数据（Zenodo record 6017834）](https://zenodo.org/records/6017834)
