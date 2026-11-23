# 34｜N-HMC：把后验采样搬到初始噪声空间，用 HMC 走出局部模式，再让噪声水平自己适配

**论文**：Noise-Adaptive Diffusion Sampling for Inverse Problems Without Task-Specific Tuning，Yingzhi Xia、Setthakorn Tanomkiattikun、Liangli Zhen、Zaiwang Gu；ICLR 2026；arXiv:2604.16919
**定位**：后验采样方法；用确定性 DDIM 把「初始噪声 → 干净图像」看成映射 D，于是整个后验只在初始噪声空间采样，HMC 的每一步都落在扩散模型训练时的噪声流形上；再对噪声方差放 Jeffreys 先验并边缘化，得到无需逐任务调噪声水平的 NA-NHMC
**精读核验**：2026-11-22 依 arXiv HTML 全文（Abstract、§1–4、Algorithm 1/3、Proposition 1/Corollary 1.1/Proposition 2、Table 1–3 与 Table 10、Figure 1–5，附录 A.1/A.5/A.9 读了正文引用到的部分）逐节读过；会议信息按 arXiv 页注明「Accepted by ICLR 2026」与仓库 README 的 ICLR 2026 标注。官方代码 `NA-HMC/NA-HMC` @`2a03d85`（README 亦指向 `Sunsett5/Noise-space-HMC`）同日核对：`main_sampling.py`（唯一入口）、`obs_functions.py`（各退化算子）、`guided_diffusion/unet_ffhq.py` 是真实实现；README 里两条 site-packages 补丁在 torch 2.1 / torchvision 0.16 下并不需要。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：FFHQ 三图跑 4× SR 与 92% 随机缺失 inpainting，各跑「已知噪声 / `--unknown_noise`」两档，无代码改动；见 [N-HMC 推理走查记录](/pathology-atlas/learning/infer-nhmc.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Diffusion models (DMs) have recently shown remarkable performance on inverse problems (IPs). Optimization-based methods can fast solve IPs using DMs as powerful regularizers, but they are susceptible to local minima and noise overfitting. Although DMs can provide strong priors for Bayesian approaches, enforcing measurement consistency during the denoising process leads to manifold infeasibility issues. We propose Noise-space Hamiltonian Monte Carlo (N-HMC), a posterior sampling method that treats reverse diffusion as a deterministic mapping from initial noise to clean images. N-HMC enables comprehensive exploration of the solution space, avoiding local optima. By moving inference entirely into the initial-noise space, N-HMC keeps proposals on the learned data manifold. We provide a comprehensive theoretical analysis of our approach and extend the framework to a noise-adaptive variant (NA-NHMC) that effectively handles IPs with unknown noise type and level. Extensive experiments across four linear and three nonlinear inverse problems demonstrate that NA-NHMC achieves superior reconstruction quality with robust performance across different hyperparameters and initializations, significantly outperforming recent state-of-the-art methods. The code is available at this https URL.

*来源：arXiv:2604.16919 摘要页原文（HTML 版）；`this https URL` 为 arXiv 排版对代码链接的占位，原文即如此。*

## 中文摘要

> 扩散模型近来在逆问题上表现突出。基于优化的方法可以把扩散模型当作强正则项快速求解逆问题，但容易陷入局部极小并过拟合噪声。虽然扩散模型也能为贝叶斯方法提供强先验，可在去噪过程中强行施加测量一致性会导致流形不可行问题。我们提出噪声空间哈密顿蒙特卡洛（N-HMC）：一种把反向扩散视为「初始噪声到干净图像」的确定性映射的后验采样方法。N-HMC 能够充分探索解空间、避免局部最优；由于把推断完全搬到初始噪声空间，它的提议始终落在学到的数据流形上。我们给出了完整的理论分析，并把框架扩展为噪声自适应版本（NA-NHMC），可有效处理噪声类型与强度未知的逆问题。在四个线性与三个非线性逆问题上的大量实验表明，NA-NHMC 取得更优的重建质量，且在不同超参与初始化下表现稳健，显著优于近期最先进方法。代码已公开。

*译文：对应上方英文摘要逐句对译，未增删内容。*

## 1. 三分钟摘要与推荐理由

一句话：**既然 DDIM 是确定性的，那「所有可能的干净图像」就等于「所有可能的初始噪声经过 D(x_T)」；于是把 HMC 的采样变量换成 x_T，先验就是标准高斯、似然就是 ‖y − A(D(x_T))‖²，两步都用自动微分算，采样天然不出流形。**

三件值得读的事：

1. **它把三类方法的病灶一次说清**（Fig. 1）：DPS 一类逐步引导把中间状态推出流形 → 累积伪影；ReSample 一类图像空间 MAP 会过拟合噪声；DMPlug 一类确定性 MAP 会卡在局部模式。N-HMC 的定位是**唯一同时避开三者**的：变量在噪声空间（保流形）、用 MCMC（防局部最优）、用高斯先验项 ½‖x_T‖²（防噪声过拟合）。
2. **「无任务调参」是靠贝叶斯而不是靠调参**：NA-NHMC 对 σ_y² 放 Jeffreys 先验 p(σ_y²) ∝ 1/σ_y²，边缘化后似然变成 (½‖y − A(D(x_T))‖²)^(−m/2)，其梯度与「已知噪声水平的 N-HMC」形式相同（Proposition 2）。也就是说噪声水平不需要估，它被积分掉了；论文用 Fig. 2 展示估计出的 ‖y − A(x̂₀)‖/√m 紧贴真实 σ_y。
3. **它有理论而不只是 trick**：Proposition 1 把期望残差分解为「噪声项 + 先验内在不确定项」，Corollary 1.1 说明 σ₀/σ_y ≪ 1 时残差趋于 mσ_y²——这正是「不过拟合噪声」的定量表述，也是我们审计「重建是否在抄测量」时可以直接借用的判据。

**关于「与我们关心的扩散先验跨域问题」的关系（本页判断）**：N-HMC 的全部实验都是 FFHQ/ImageNet 自然图、合成高斯（以及 impulse/speckle）噪声、σ_y = 0.05/0.20，没有医学数据；但它的「噪声空间采样 + 残差应等于真实噪声」这条判据，对我们判断「跨域先验在 MRI/CT 上是不是在编造」非常有用：如果残差远小于真实噪声水平，说明模型在过拟合测量；远大于则说明先验压过了数据。这一点比 PSNR 更能说明幻觉风险。

## 2. 问题及研究位置

逆问题 y = A(x) + η。扩散先验下有两种目标：MAP（找单个最可能解）与贝叶斯后验采样（抽多个合理解）。作者把现有方法分成三档并逐一指出问题（§1、Fig. 1）：

- **迭代引导（DPS、DDRM、DDNM、ΠGDM、TMPD）**：用 ∇log p(y|x_t) 直接改中间状态。作者用几何论证：该梯度在高维空间中含大量正交于流形切空间的分量，会把 x_t 推进低概率区，喂给去噪器分布外输入（Definition 3.1 的「流形可行性」由此定义）。
- **图像空间随机 MAP（ReSample、DiffPIR、DAPS）**：在图像空间反复优化 + 加噪，噪声大时容易把噪声拟合进去。
- **确定性 MAP（DMPlug）**：单点优化，遇到多峰后验（如相位恢复）会卡在错误的局部模式。

N-HMC 的位置：**在初始噪声空间做 MCMC**。因为 DDIM 是确定性映射，"先验"就是 N(0,I)（式 8 的梯度就是 −x_T），"似然"可以直接对复合函数求导（式 9），中间不需要任何 p(y|x_t) 近似。代价是每次 HMC 提议都要完整跑一遍 T 步 DDIM 并反传；作者用「2 步 DDIM 就够」的经验（附录 A.9，沿用 DMPlug 的观察）把成本压下来。

与相邻笔记的关系：它是对 [32 号 DMPlug](32-dmplug.md) 的**直接批评与改进**（同一优化变量、换成 HMC、加先验项、加退火）；与 [33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md) 共享「把反向过程当确定性函数」的视角，但一个在控制空间做二阶优化、一个在噪声空间做 MCMC；对 [25 号 ReSample](25-resample.md) 的批评是「图像空间 MAP 过拟合噪声」。

## 3. 核心方法和数据流

```text
输入：y、A、预训练 ε_θ、DDIM 步数（走查用 2 步）、L 个 leapfrog 步、步长 δ、噪声退火表 {σ_y,k}、γ
x_T ~ N(0, I)
for k = 1 … K:                                  # HMC 迭代
    repeat:
        p ~ N(0, I)
        x̂₀ = DDIM(x_T)                          # 完整去噪（可微）
        H₀ = ½‖x_T‖² + ½σ_{y,k}⁻²‖y − A(x̂₀)‖² + ½‖p‖²
        x* = x_T
        for l = 1 … L:                          # leapfrog，L=20
            p  ← p − δ/2 · ( x* + ½σ_{y,k}⁻² ∇_{x*}‖y − A(D(x*))‖² )
            x* ← x* + δ p
            p  ← p − δ/2 · ( … 同上，在 x* 处 )
        H₁ = ½‖x*‖² + ½σ_{y,k}⁻²‖y − A(D(x*))‖² + ½‖p‖²
        accept with prob min(1, exp(H₀ − H₁))
        if rejected: δ ← γδ                    # 步长退火
    until accepted
    x_T ← x*
输出：x̂₀ = D(x_T)（以及多条链的样本集合）
```

四个要点：

1. **先验项就是 ½‖x_T‖²**：式 8。它把 x_T 约束在半径 √n 的球面附近，论文 §3.2 说这正是抗噪的来源——噪声空间的高斯先验在 Proposition 1 里等价于一个后验协方差收缩项。
2. **σ_y 退火**：初始噪声可能落在后验概率极低处，HMC 只能取极小步长；作者让 σ_y 从大到小退火（先「放松」似然、允许大步探索），到目标水平再收集样本。Algorithm 1 的接受/拒绝与 δ←γδ 是自适应的步长控制。
3. **NA-NHMC 的边缘化**：Jeffreys 先验 p(σ_y²) ∝ 1/σ_y²，积分后 p(y|x_T) ∝ (½‖y − A(D(x_T))‖²)^(−m/2)（式 10–11），梯度仍是 −(1/2σ_y²)∇‖·‖² 的形式，但 σ_y 被消掉；实现上只需换似然项（Algorithm 3），超参在任务/数据集/噪声水平间保持不变。
4. **只需 2 步 DDIM**：走查时 `--timesteps 2`（skip=375，750→0 两段），这与论文附录 A.9 的观察一致；每轮 HMC 要 1+L=21 次 DDIM 采样，所以单图仍需数分钟。

## 4. 论文证据与实验范围

**设置**：FFHQ 256² 与 ImageNet 256² 各取验证集 100 张；FFHQ 用 DPS 的 UNet，ImageNet 用 ADM；四个线性任务（SR 4×/16× 平均池化、92% 随机缺失 inpainting、各向异性高斯去模糊 σ=20/1）、三个非线性任务（非线性去模糊、相位恢复、HDR ×2）；测量噪声高斯 σ_y = 0.05 与 0.20（比前人常用的 0.01 更大）；基线 DiffPIR、RED-diff、DPS、DAPS、ReSample、SITCOM、DMPlug。

**FFHQ 关键数字**：

| 任务（σ_y=0.05） | NA-NHMC | 最强基线 | 说明 |
|---|---|---|---|
| SR 4×（Table 10） | 27.29 / 0.770 / 0.291 | SITCOM 27.35 / 0.787 / 0.268 | **SR 上并未全胜**：PSNR 与 LPIPS 都略输 SITCOM，DMPlug 26.73 |
| 92% inpainting（Table 10） | 26.72 / 0.785 / 0.268 | SITCOM 26.56 / 0.785 / 0.266 | PSNR/SSIM 领先，LPIPS 略输 |
| 非线性去模糊（Table 1） | 27.66 / 0.792 / 0.249 | DMPlug 27.15 / 0.784 / 0.266 | 领先 0.5 dB |
| 相位恢复（Table 1） | 19.30 / 0.554 / 0.482 | DAPS 18.52 / 0.414 / 0.528 | DMPlug 在该任务未报数（表中「-」） |
| HDR（Table 1） | 28.45 / 0.849 / 0.217 | DPS 27.46 / 0.849 / 0.168 | LPIPS 不如 DPS |

（顺序为 PSNR / SSIM / LPIPS。作者的总述是「comparable or superior」，从这三张表看**线性任务基本持平、非线性任务领先**，与摘要的「significantly outperforming」需要用具体列来读。）

其他证据：

- **Table 3**：impulse / speckle 噪声下的 SR 与非线性去模糊，用来支持「噪声类型未知也稳」；
- **Fig. 2**：去模糊任务上估计噪声水平紧贴真值，支持 Proposition 2；
- **Fig. 3**：100 次独立运行的 MAE 与标准差热图，本文的像素级标准差显著低于 DPS/DAPS，说明对初始化不敏感；
- **Fig. 5**：相位恢复的「解出率」曲线，本文远高于 DPS 与 DMPlug，这是局部模式论证的直接证据；
- **Table 7/8/9**：步长 ε、leapfrog 步数 L、衰减因子 γ 的消融，说明超参有平台区（这是「无任务调参」主张的实证支撑）。

**范围限制（本页判断）**：自然图、合成噪声、单一先验（FFHQ UNet / ADM），无医学、无真实传感器噪声；「无任务调参」指噪声水平不用调，但步长 ε、L、γ、退火表仍是全局固定的超参，换先验/换分辨率是否仍稳，论文只给了 FFHQ/ImageNet 两个点。

## 5. 复现与审计重点

**本站走查做了什么（小样本，非论文指标复现）**：clone 官方仓库 @`2a03d85`，用 README 的 `ffhq_10m.pt`（362 项、93,563,910 参数，与 `model_config_ffhq.yaml` 的 128 通道一致）；FFHQ 图从 HuggingFace `merkol/ffhq-256` 的第一个 parquet 分片抽出前 6 张（ImageFolder 需要类目录，脚本 `extract_ffhq.py`）；每次取前 3 张。命令即 `main_sampling.py --dataset ffhq --timesteps 2 --deg {sr4,random_inpaint} --noise_type gaussian --sigma_y 0.05 [--unknown_noise]`，其余全默认：epsilon=0.05、L=20、seed=5678。**无代码改动**（README 的两条 sed 补丁不需要：tv 0.16.2 已无 `torch._six`，torch 2.1 的 `torch.load` 默认 `weights_only=False`）。

| 任务（3 图） | 已知噪声 | `--unknown_noise` | 论文 FFHQ 列 |
|---|---|---|---|
| SR 4× | 27.487 / 0.750 / 0.329 | 28.519 / 0.789 / 0.276 | 27.29 / 0.770 / 0.291 |
| 92% inpainting | 27.686 / 0.777 / 0.307 | 28.316 / 0.806 / 0.259 | 26.72 / 0.785 / 0.268 |

- 趋势与论文一致：打开 `--unknown_noise` 后 SR +1.03 dB、LPIPS −0.053，inpainting +0.63 dB、LPIPS −0.047；未知噪声一档 28.52/0.789/0.276 与论文 27.29/0.770/0.291 接近，说明链路跑通。**3 张图 ≠ 100 张评测集**，不能当复现。
- 定性：`y0_*.png`（伪逆）在 SR 下明显模糊、在 92% 缺失下几乎全黑，最终样本能恢复人脸结构。
- 耗时：单图 4–9 min（同卡并行时 247–531 s/迭代），每个组合 3 图 25–35 min，四个组合约 1.5 h；显存 4.5–6 GB/进程。

**审计要点**：

1. **指标实现**：脚本的 SSIM `data_range` 取样本 max−min（不是 1），LPIPS 用 vgg 主干；与论文表格是否同口径要确认，否则跨论文比较会偏。
2. **残差判据别混淆**：论文的 Corollary 1.1 是「期望残差 ≈ mσ_y²」，走查里没有逐样本验证这一点；如果要用它做幻觉检测，应自己算 ‖y − A(x̂₀)‖/√m 的分布，而不是只看均值。
3. **HMC 的接受率**：论文的退火策略（σ_y 表、γ）在代码里是固定写法，换任务时是否需要改 δ/γ 没有系统说明；「无调参」主要指噪声，不含这些动力学超参。
4. **2 步 DDIM 的代价**：D(x_T) 只走 2 步意味着映射很「粗」，这也解释了为什么 SR 这类病态程度中等的任务上它并不领先 SITCOM；引用其优势时应限定在高度多峰的逆问题（相位恢复）。

## 6. 建议阅读顺序

摘要 → §1 与 Fig. 1（三类方法的病灶）→ Definition 3.1（流形可行性）→ §3.1 式 7–9 与 Algorithm 1 → §3.2 Proposition 1 / Corollary 1.1 → §3.3 Jeffreys 先验与式 10–11 → §4.1 Table 1/10 与 Fig. 3 → §4.2 相位恢复与 Fig. 5 → 附录 A.5（基线调参）/A.9（2 步 DDIM）→ Table 7/8/9 消融。

## 7. 前后关联

- 与 [32 号 DMPlug](32-dmplug.md)：同一优化变量（初始种子），一个用 Adam 单点优化、一个用 HMC 采样；N-HMC 的 Fig. 1(c) 直接把 DMPlug 作为「确定性 MAP 卡在局部模式」的代表。两篇的 FFHQ 非线性去模糊 27.66 vs 27.15 是同一评测集上的直接可比数字。
- 与 [33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md)：共享「反向过程 = 确定性函数」的出发点；那篇在控制空间做 DDP，这篇在噪声空间做 MCMC。
- 与 [25 号 ReSample](25-resample.md)：ReSample 的硬一致性投影属于「图像空间 MAP」，N-HMC 的 §1 指出这类方法在大噪声下过拟合。
- 与 [28 号 DPS](28-dps.md)、[29 号 DDRM](29-ddrm.md)、[30 号 ΠGDM](30-pigdm.md)、[31 号 DAPS](31-daps.md)：这四篇正是 N-HMC 归为「迭代引导/逐步退火」的一组；它的 Definition 3.1（流形可行性）就是为批评它们「把中间状态推出流形」而设，读 Fig. 1(a) 时对照 DPS 的引导项最直观。
- 与 [24 号弱先验](24-weak-priors.md) 对话：N-HMC 的残差判据给出「先验是否压过测量」的可测指标，可作为弱先验下幻觉审计的基线。
- 与 [20 号 DDS](../mri/20-dds.md)、[31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md)：医学逆问题主流是「分解式采样 / 测试时适配」，N-HMC 提供的是另一种「只在噪声空间动」的路线；换到 MRI 前要重算复数域 DDIM 与噪声尺度。

## 8. 链接

- [arXiv:2604.16919（abs）](https://arxiv.org/abs/2604.16919)
- [arXiv HTML 全文](https://arxiv.org/html/2604.16919)
- [官方代码 NA-HMC/NA-HMC](https://github.com/NA-HMC/NA-HMC)（README 亦指向 `Sunsett5/Noise-space-HMC`）
- [FFHQ 256 数据（HuggingFace merkol/ffhq-256）](https://huggingface.co/datasets/merkol/ffhq-256)
- [推理走查记录](/pathology-atlas/learning/infer-nhmc.html)
