# SDUM：面向通用 MRI 重建的可扩展深度展开模型

## 原文摘要

> Clinical cardiac MRI spans diverse contrasts, sampling trajectories, accelerations, scanners, and patient populations, yet most deep-learning reconstruction methods remain protocol specific. We present the Scalable Deep Unrolled Model (SDUM), which integrates a Restormer-based unrolled reconstructor, per-cascade coil sensitivity estimation, sampling aware weighted data consistency, and universal conditioning on cascade index and acquisition metadata. A single SDUM model achieves state-of-the-art performance across all CMRxRecon2025 tracks without task-specific fine-tuning and outperforms PromptMR+ on CMRxRecon2024 by +0.55 dB. Scaling experiments show near-logarithmic gains with depth up to 18 cascades (r=0.986, R²=0.973) and continued but diminishing gains from data scaling (32.72 dB at 40% to 33.18 dB at 100%). SDUM also generalizes in a zero-shot setting to unseen in-house CEST MRI (43.57 dB PSNR, 0.9769 SSIM). When trained separately on fastMRI brain, SDUM surpasses PC-RNN by +1.8 dB. These results support SDUM as a scalable framework for robust MRI reconstruction across heterogeneous acquisition settings beyond cardiac MRI.

*来源：arXiv:2512.17137v2。逐字原文，未改写、未压缩。ECCV 2026 camera-ready 版标题为 “SDUM: A Scalable Deep Unrolled Model for Universal Cardiac MRI Reconstruction”，摘要另把 “deep-learning” 明确为 “deterministic deep-learning”，并写出 CEST 全称。*

## 中文摘要

> 临床心脏 MRI 涵盖不同的对比度、采样轨迹、加速倍数、扫描仪与患者人群，然而大多数深度学习重建方法仍然只针对特定协议。我们提出可扩展深度展开模型（SDUM），它把基于 Restormer 的展开重建器、逐级线圈敏感度估计、采样感知加权数据一致性，以及对级索引与采集元数据的通用条件整合在一起。单个 SDUM 模型在所有 CMRxRecon2025 赛道上都取得最先进性能，且无需任务特定微调；在 CMRxRecon2024 上比 PromptMR+ 高 +0.55 dB。规模实验显示：深度增加到 18 级时收益接近对数增长（r=0.986，R²=0.973）；数据规模扩大带来持续但递减的收益（40% 时 32.72 dB，100% 时 33.18 dB）。SDUM 还能零样本泛化到未见过的院内 CEST MRI（43.57 dB PSNR，0.9769 SSIM）。在 fastMRI 脑数据上单独训练时，SDUM 比 PC-RNN 高 +1.8 dB。这些结果支持 SDUM 作为一个可扩展框架，在心脏 MRI 之外的异构采集设定中实现稳健 MRI 重建。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![SDUM 总览](/papers/mri/39-sdum-pipeline.png)

> **原文图注**：SDUM overview. Each cascade combines a Restormer-based reconstructor, a learned CSME, sampling-aware weighted data consistency (SWDC), and universal conditioning (UC) on cascade index and protocol metadata.

*图源：论文 LaTeX 源码 `figures/SDUM_v3-cropped.pdf`，转 PNG 后放入站点，未重绘、未描摹。*

## 三分钟摘要与推荐理由

SDUM 不是再换一个正则器，而是把「一个模型覆盖全部心脏 MRI 协议」拆成五个工程上可验证的部件：Restormer 展开主干、逐级 CSME、采样感知加权 DC（SWDC）、级索引 + 协议元数据的通用条件、以及固定端点只翻倍内部的渐进级联扩展。它的价值在于两件事：一是 CMRxRecon2025 四个赛道用同一个模型、零微调拿到第一；二是首次系统报告展开 MRI 的深度与数据规模曲线（1→18 级，42M→759M 参数，PSNR 与 log 参数量近似线性）。如果研究方向是「可扩展重建主干」或「跨协议通用 MRI」，这是当前最完整的工程与规模证据组合。

## 问题与研究位置

临床心脏 MRI 的序列、轨迹、加速倍数、场强和人群都极为不同质，而重建模型通常绑定单一协议。论文提出的假设是：底层心脏解剖与生理构成共享图像先验，只要把采集物理作为条件注入，单个深度展开网络就能跨协议工作。位置在 VarNet/PromptMR 一脉的「展开 + 条件」路线上，同时补上了该领域缺失的规模分析。

## 核心方法和数据流

前向模型 `y = M·F(S·x) + n`；每级先由复值 U-Net CSME 估计并归一化敏感度图（Σ|S_c|²=1），再做数据一致性更新 `z = x − τ·S^H A^H(ASx − y)`，最后交给 Restormer 做近端映射。关键改动是把标量 DC 权重换成掩膜特定的可学习 k 空间权重图 `w`，加权残差 `w ⊙ (ASx − y)` 再回投；`w=M` 时退化为标准 DC。级索引与协议标签经正弦嵌入加两层 MLP 相加成条件向量，以可加通道偏置注入每个 Transformer 块。训练用 6→10→18 的渐进扩展，固定首尾、复制内部级，所有参数热启动。

## 关键实验、数据集与指标

- CMRxRecon2025 四个赛道（多中心、多疾病、5T、儿童）：单模型 T=18，SSIM/PSNR 全部第一；相对次优分别 +0.26 / +0.116 / +0.40 / +1.04 dB。指标 PSNR、SSIM、NMSE。
- CMRxRecon2024：Task 1 35.700 dB / 0.931 SSIM（PromptMR+ 32 级为 35.152 / 0.921），Task 2 33.948 / 0.911；配对案例胜率 90.3% / 93.9%。
- fastMRI 多线圈脑（单独训练的 T=6 模型）：4× 42.6 dB、6× 40.8 dB，比 PC-RNN 高 1.8 dB。
- 院内 CEST（3T Philips，4× 欠采样，零样本）：43.57 dB / 0.9769 SSIM（论文报告，样本量未给出）。
- 消融（CMRxRecon2025 Regular Task 1）：Restormer 主干、2 层降采样、多 CSME、SWDC、UC 各自带来增益；T=3 单次迭代优于 T=1 三次迭代。
- **训练数据说法前后不一致**：正文 §1 说心脏模型在异构 CMRxRecon 数据上训练，§4.5 说 fastMRI 脑部是单独训练的 T=6 模型；附录 B 和仓库 README 却写「在 CMRxRecon2024、CMRxRecon2025 与 fastMRI 脑的异构组合上训练」。论文没说清参加 CMRxRecon 评测的 18 级模型是否混入了脑部数据。

## 官方代码仓库审计

仓库 `NVIDIA-Medtech/NV-Raw2insights-MRI`（实测 GitHub API，2026-03-15 最后推送，Apache-2.0 代码许可，权重为 NVIDIA Open Model License）包含：

- **训练与推理脚本齐全**：`scripts/train.py`、`scripts/inference.py`、`scripts/evaluation.py`、`scripts/create_cmrxrecon_dataset.py`、`scripts/visualize_mat.py`。
- **模型实现**：`scripts/models/restormer/restormer.py`（Restormer 主干）、`scripts/models/varnet.py`、`scripts/models/latent_recon.py`；数据侧有 `mri_data/`、`ktSampling.py`、`transforms.py`、`readers.py`；优化器 `muon.py`。
- **配置**：`configs/` 下 small（6 级，README 记 230M）、base（18 级 / 760M）、large（34 级 / 1.4B）。注意：large 是仓库额外提供，论文只报告到 18 级 / 759M；且 README 的 small 230M 与论文表 D.1 的 T=6 252.97M 不一致，复现时应以实际加载的配置为准。
- **权重不在仓库内**：`inference.py` / `train.py` 会按 `model_variant` 从 Hugging Face（`nvidia/NV-Raw2insights-MRI`，非 gated，实测可访问）自动下载；也可用 `-m` 指定本地 `.pt`。
- **依赖**：`requirements.txt` 固定 `torch==2.6.0`（cu124 wheel）、`monai`、`einops`、`timm`、`h5py`、`scikit-image`、`huggingface_hub`、`wandb` 等；需要 CUDA 12.4 与 Linux x86-64。
- **示例数据**：`example/` 含一个 CMRxRecon 风格的 cine 案例（JSON + 两个 `.mat`，约 21 MB），可直接跑通推理，但**不含训练数据集**。
- **训练数据（代码证据）**：`scripts/train.py` 每次运行只接受一个 `dataset`（`cmrxrecon` 或 `fastmri`），据此选择数据读取器；公开的 small/base/large 三个配置都是 `"dataset": "CMRxRecon"`，训练路径只有 `dataset/CMRxRecon2025/ChallengeDataTrain`，验证路径为 `ChallengeDataValR1`。所以公开配置不会在一次训练中混入 fastMRI；README 说发布权重用了三套数据，可能是分阶段训练或另有内部流程，仓库里查不到对应配置。
- **许可证边界**：代码 Apache-2.0；权重 NVIDIA Open Model License（商用需按该许可条款）；CMRxRecon 与 fastMRI 数据各自受原数据集协议约束。

## 资源与数据准备

论文报告的算力（原文，非推断）：

- 推理：单张 H100，T=18，256×256 约 1.03 s / 6.07 GB；328×768 约 3.97 s / 10.83 GB（表 D.2）。
- 训练：T=10 与 T=18 均为 8 节点 ×8 = 64 张 H100；T=1 为 1 节点（表 D.1）。BF16 混合精度 + 梯度检查点，Muon 优化器，基础学习率 2.4×10⁻⁴，每阶段约 20k 步，SSIM 损失。
- 模型规模：T=18 共 758.91M 参数。

数据需要自行申请：CMRxRecon2024/2025 通过 Synapse 挑战页，fastMRI 脑通过官方申请渠道。仓库只给数据目录约定（`dataset/CMRxRecon2025/ChallengeDataTrain` 等），需用 `create_cmrxrecon_dataset.py` 生成每案例 JSON。院内 CEST 数据不公开。

## 建议复现路径

1. 先跑 `example/`：`python scripts/inference.py -c configs/nv_raw2insights_mri_base.json -i example -o outputs/example_base`，确认权重自动下载与输出 `.mat` 形状（`val_img4ranking/`），再用 `visualize_mat.py` 出图。
2. 对齐推理数值：在 CMRxRecon2025 验证集 Task R1 上复算 SSIM/PSNR，先确认与榜单同口径（是否逐帧、是否含 ACS、归一化方式）。
3. 小模型复现训练：T=6（small）单节点 8×H100 起，按 `docs/training.md` 的 JSON 数据格式，先验证 SSIM 损失与渐进扩展的热启动逻辑。
4. 规模实验：只做 T=6 与 T=10 两个点就能检验「PSNR–log 参数」趋势是否复现；不建议直接上 64 卡。
5. 消融优先顺序：SWDC vs 标量 DC（最容易复现、增益 +0.43 dB），再看多 CSME（+0.51 dB）与 UC（+0.38 dB）。

## 建议代码阅读顺序

`README.md` → `docs/inference.md` → `scripts/inference.py` → `configs/nv_raw2insights_mri_base.json` → `scripts/models/restormer/restormer.py` → `scripts/models/varnet.py`（DC/SWDC 与前向算子） → `scripts/models/latent_recon.py`（级联组织） → `scripts/mri_data/data_utils.py` 与 `ktSampling.py` → `scripts/train.py` → `scripts/muon.py`。

## 可迁移思想与博士切入点

- **把「规模」当实验对象**：展开深度是可加的离散容量轴，天然适合做 scaling law；可研究算力最优的深度/宽度/数据配比，而不只是刷单点指标。
- **物理条件化**：把掩膜、加速、轨迹、场强编码进网络，等价于让一个模型覆盖一族前向算子；可迁移到 CT 稀疏视角、PET 低剂量等「协议族」问题。
- **可学习的数据一致性加权**：SWDC 把密度补偿从解析公式变成端到端学习的 k 空间权重，这个思路可直接搬到非笛卡尔 MRI 与分布式先验的交互。
- **渐进深度扩展**：固定端点、复制内部的课程，可用于任何迭代展开模型（扩散展开、深度均衡模型）的深训练。

## 局限与复现风险

- **ACS 表述冲突**：正文 3.2 说 CSME「不依赖 ACS 区域」，附录 C.1 说「在全采样 ACS 区域上运算」；配置里 `use_acs_region: true`、`acs_lines: 20`，实现以 ACS 为准。复现时不要按正文那句话去掉 ACS。
- **规模结论样本很小**：深度曲线只有 5 个点，且都在同一数据/解剖上；不宜外推到其它器官或更大深度。
- **CEST 零样本证据单薄**：单中心、样本量未报告、无置信区间；且训练数据仍是脑解剖，不是跨器官。
- **训练成本高**：最深配置 64×H100，且每阶段约 20k 步；论文未给总 GPU 小时，实际复现预算需自行估算（推断：仅 T=18 阶段就可能需要数百至上千 GPU·小时，取决于分辨率与批大小）。
- **数据不可直接获取**：CMRxRecon 与 fastMRI 均需申请；院内 CEST 不公开，表 5/图 5 无法完全复现。
- **仓库与论文版本差**：仓库提供 6/18/34 级三个变体，论文只报告到 18 级；small 的参数量 README 与论文表 D.1 不一致（230M vs 252.97M）。引用数字时应注明来源是论文还是仓库 README。

## 与前后论文的关联

- **PromptMR+（38 号之前的 10 号笔记）**：同为多对比度心脏展开重建，用提示条件；SDUM 用通用条件 + SWDC + 逐级 CSME 取代其提示与固定敏感度，并在 CMRxRecon2024 上 +0.55 dB。
- **VarNet / E2E-VarNet**：SDUM 的 DC 更新与敏感度联合学习直接继承这一脉；SWDC 是对其标量 DC 权重的推广。
- **Restormer**：主干来自图像复原，SDUM 证明它在 k 空间欠采样伪影上同样有效。
- **与扩散先验路线（A-DPS、DDIP 等）**：SDUM 是确定性判别式路线，不含随机采样；它的规模结论可作为「非生成式重建能走多远」的对照基线。

## 官方链接

- [arXiv 摘要（v2）](https://arxiv.org/abs/2512.17137v2)
- [arXiv HTML](https://arxiv.org/html/2512.17137v2)
- [ECCV 2026 正式出版（Springer，LNCS 17039, pp. 383–401）](https://doi.org/10.1007/978-3-032-37435-6_21)
- [ECCV 2026 官方 camera-ready PDF](https://media.eventhosts.cc/Conferences/ECCV2026/pdfs/6193.pdf)
- [ECCV 2026 官方录用列表](https://eccv.ecva.net/Conferences/2026/AcceptedPapers)
- [官方代码](https://github.com/NVIDIA-Medtech/NV-Raw2insights-MRI)
- [官方权重（Hugging Face）](https://huggingface.co/nvidia/NV-Raw2insights-MRI)
- [中英全文精读](/learning/sdum-story.html)
