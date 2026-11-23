# 33｜Diffusion Optimal Control：把扩散采样改写成离散最优控制，用 iLQR 的思路收住数据一致性

**论文**：Solving Inverse Problems via Diffusion Optimal Control，Henry Li、Marcus Pereira；NeurIPS 2024（proceedings 页码末页 73571）
**定位**：把「从后验采样」重构成「有限时域离散最优控制」的逆问题求解器；不估条件似然、不依赖 score 近似的精确性，而是把 DDIM 的每一步看成受控状态转移，用控制代价把轨迹拉向测量一致，再用 iLQR（DDP）的二次近似求解；前向算子只需可微
**精读核验**：2026-11-22 依 NeurIPS 2024 官方 proceedings 摘要页（hash `86655bc5…4de7`）与官方代码 `lihenryhfl/diffusion_optimal_control` @`5d41de7` 读过方法实现；**论文 PDF 正文未下载**，因此本页的表格数字只到「摘要级 + 走查记录里核对过的 FFHQ 4× SR LPIPS」为止，不逐表转述。代码结构：`inverse_sampling.py`（唯一推理入口）、`envs/diffusion.py`（受控 DDIM 环境，`step = DDIM(x+u)`）、`optimizers/mfddp.py`（matrix-free DDP，默认求解器）、`optimizers/adjoint_sensitivity.py`、`optimizers/bayes.py`、`inverse_configs/*.yaml`（7 个任务配置）均经阅读确认是真实实现。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：FFHQ 两图跑 SR 4× 与随机 inpainting，无代码改动；见 [Diffusion Optimal Control 推理走查记录](/pathology-atlas/learning/infer-diffusion-optimal-control.html)。除走查数字外，本页数字全为论文/记录报告值。

## 原文摘要

> Existing approaches to diffusion-based inverse problem solvers frame the signal recovery task as a probabilistic sampling episode, where the solution is drawn from the desired posterior distribution. This framework suffers from several critical drawbacks, including the intractability of the conditional likelihood function, strict dependence on the score network approximation, and poor $\mathbf{x}_0$ prediction quality. We demonstrate that these limitations can be sidestepped by reframing the generative process as a discrete optimal control episode. We derive a diffusion-based optimal controller inspired by the iterative Linear Quadratic Regulator (iLQR) algorithm. This framework is fully general and able to handle any differentiable forward measurement operator, including super-resolution, inpainting, Gaussian deblurring, nonlinear deblurring, and even highly nonlinear neural classifiers. Furthermore, we show that the idealized posterior sampling equation can be recovered as a special case of our algorithm. We then evaluate our method against a selection of neural inverse problem solvers, and establish a new baseline in image reconstruction with inverse problems.

*来源：NeurIPS 2024 官方 proceedings 摘要页（`proceedings.neurips.cc/paper_files/paper/2024/hash/86655bc516148e311bcfcf88f1744de7-Abstract-Conference.html`），与作者仓库 README 标注的「NeurIPS 2024」一致。*

## 中文摘要

> 现有的基于扩散模型的逆问题求解器把信号恢复刻画为一次概率采样过程：解从期望的后验分布中抽取。该框架有几个关键缺陷：条件似然函数不可解、严格依赖 score 网络的近似质量、以及 x̂₀ 预测质量差。我们证明，把生成过程重新表述为一次离散最优控制过程即可绕开这些限制。我们导出了一种受迭代线性二次型调节器（iLQR）算法启发的、基于扩散的最优控制器。该框架完全通用，可处理任何可微的前向测量算子，包括超分、inpainting、高斯去模糊、非线性去模糊，甚至高度非线性的神经网络分类器。此外，我们证明理想化的后验采样方程可以作为本算法的一个特例被恢复出来。随后我们把方法与若干神经逆问题求解器对比，在图像重建逆问题上建立了新的基线。

*译文：对应上方英文摘要逐句对译，未增删内容；符号沿用原文。*

## 1. 三分钟摘要与推荐理由

一句话：**不要再问「怎么在每一步估 ∇log p(y|x_t)」，而是问「给定冻结的 DDIM 动力学，怎样在每一步加一个最小的控制量 u_t，使终点满足 y = A(x_0)」——这是一个可以用 DDP/iLQR 解的有限时域最优控制问题。**

三件值得读的事：

1. **它把「采样」和「优化」的分界线抹掉了**：作者声称理想后验采样方程是本文算法的一个特例（摘要原话），也就是说 DPS 一类方法可以视为「控制代价取某种极限」的近似。这一视角对理解 [34 号 N-HMC](34-nhmc.md) 的批评（逐步引导把状态推出流形）很有帮助：控制式解法把偏离流形的代价显式写进 running cost，而不是隐式地靠 score。
2. **通用性来自「只要求 A 可微」**：配置里有 box/random inpainting、motion/gaussian/nonlinear deblur、SR、phase retrieval 七种任务，摘要还点名「神经网络分类器」这种完全不可逆的算子。对医学场景的意义是：只要前向模型（如 MR 编码、CT 投影）在框架里可微，就不需要为每个算子重推后验公式。
3. **实现上是 matrix-free DDP**：`optimizers/mfddp.py` 从不明构造 Hessian（`k_mf=16` 的随机探针近似二次型），对每个时间步的 action 用 AdamW 更新，梯度直接由协态 k_t 给出，再加上反馈增益项 K_t；默认 `lr=5e-3`、`weight_scale=1e-6`。读代码比读公式更能看清「iLQR 的二次近似在 256² 图像上到底怎么落地」。

**关于「对我们自己的逆问题意味着什么」（本页判断）**：这是一篇**方法论重述型**工作——它最大的价值不是某个数据集上的 1 dB，而是给出「把扩散求解器写成控制问题」的模板；代价是超参（控制代价权重、DDP 迭代数、步长）与任务强耦合，论文也没有给出跨任务统一的设定。走查里我们只跑了两个任务、两张图，得到的是「链路通、量级对」，不是「方法在我们关心的医学逆问题上更好」的证据。

## 2. 问题及研究位置

逆问题 y = A(x) + n，扩散先验下的目标是后验 p(x|y) ∝ p(x)p(y|x)。作者列出概率框架的三个痛点（摘要与 §1）：

- **条件似然不可解**：p(y|x_t) 在中间噪声水平上没有闭式，DPS/ΠGDM 等都要用 Tweedie 的 x̂₀ 做近似，误差会积累；
- **强依赖 score 近似**：引导项本身就是 score 的差分，网络误差直接进入轨迹；
- **x̂₀ 预测质量差**：高噪声步的 Tweedie 估计偏差大，而引导恰恰在这些步最强。

已有方法的谱系：条件采样（DPS、DDRM、ΠGDM）、投影/硬一致性（ReSample、DDRM 的谱域替换）、优化式 MAP（DMPlug、DiffPIR）以及 SDE 控制视角的工作。本文的位置是把**整个反向链**当作确定性受控动力系统：状态 x_t、控制 u_t、代价 = 终端测量误差 + 控制能量，用 DDP 求解；「后验采样」不是被近似，而是被替换成另一个良定义问题。

与相邻工作的关系：

- 与 [25 号 ReSample](25-resample.md)：ReSample 在轨迹上做**硬投影**，本文做**带代价的软控制**；前者要求能解子优化问题，后者只要求梯度。
- 与 [32 号 DMPlug](32-dmplug.md)：DMPlug 只优化初始种子（T 步反向是固定函数），本文允许每一步都有控制量，自由度更大、代价也更高。
- 与 [34 号 N-HMC](34-nhmc.md)：N-HMC 把变量换成初始噪声并在其上做 HMC，本文保留每步状态但在控制空间做二阶优化；两者都在回应「逐步引导破坏流形可行性」。

## 3. 核心方法和数据流

代码层面（`envs/diffusion.py` + `optimizers/mfddp.py`）：

```text
状态：x_t（与图像同维），时间从 t=1 离散到 eps，共 num_steps 步（默认 20）
动力学：x_{t-1} = DDIM_step( x_t + u_t ; ε_θ )        # control_type='input'
代价：  Σ_t weight_scale·‖u_t‖²  +  ‖ A(x_0) − y ‖      # 终端项为测量残差（范数）
初始化：x_T ~ N(0, I)（每个 batch 元素独立）
求解：MF-DDP —— 反向传播协态，构造 Q/K 增益（matrix-free，k_mf=16），
      每个时间步的 u_t 用 AdamW(lr=5e-3) 沿 -k_t 更新，再执行前向 rollout
输出：x_0 = DDIM(x_1)（最后一次去噪）
```

要点：

1. **控制量加在去噪步之前**：`step_fn((x+u), t)`，所以 u_t 可以理解为「在进入去噪器前对状态做的修正」；`control_type` 还支持 `output`（去噪后加）与 `h`（作用于模糊核等低维参数），对应盲逆问题的扩展。
2. **代价只有两项**：测量残差 + 控制能量（`weight_scale` 默认 1e-6，相当于几乎不为控制付费，只靠 DDP 的局部二次模型约束步长）。作者在摘要里说「理想后验采样是特例」，落到实现上就是这两项的相对权重与 DDP 的近似阶数。
3. **MF-DDP 而非朴素梯度下降**：`MFDDP` 继承 `DDP`，用随机探针 `k_mf=16` 估二次型，避免显式 Hessian；每步的 action 更新来自协态梯度，另加 `q_t K_t` 反馈项修正 rollout 偏差。仓库还保留 `AdjointSensitivity`（纯伴随梯度 + Adam，lr 1e-3）与 `Bayes` 两个求解器可供对照。
4. **默认配置**：DDPM 1000 步调度、采样 20 步、seed 42、测量噪声高斯 σ=0.05、`num_iters=50` 个 DDP 迭代。这些是走查时的实际默认值，也是本页唯一能核实的超参来源。

## 4. 论文证据与实验范围

**论文声明**（摘要级）：与「一批神经逆问题求解器」对比，在 SR、inpainting、高斯去模糊、非线性去模糊、神经网络分类器上建立新基线；并声称理想后验采样方程是本算法特例。

**可核实的数字**：论文主表报告 FFHQ 4× SR 的 LPIPS 为 **0.171 @2500 NFE、0.189 @1000 NFE**，同设置下 PSLD 0.201、DPS 0.214（数值经服务器端走查记录核对，论文以 LPIPS/FID 为主指标，不报 PSNR）。也就是说，论文的卖点是「同等或更少 NFE 下感知指标更好」，而不是 PSNR 大幅领先。

**范围限制（本页判断）**：

- 数据集只涉及 FFHQ / ImageNet 类 256² 自然图（仓库配置只有 `ffhq` 与 `imagenet` 两个数据集项），没有医学或高维 3D 数据；
- 指标以 LPIPS 为主，**没有 SSIM/PSNR 的系统表**（走查记录也提到「论文表格以 LPIPS/FID 为主」），因此无法回答「结构保真」问题；
- 控制代价权重、DDP 迭代数、步长这些关键超参在每个任务上如何选，摘要与代码都没有给出统一原则；这类方法最容易在换退化算子时退化成「需要逐任务调参」；
- 「能处理神经网络分类器」是原理性声明，对我们关心的重建任务不构成直接证据。

## 5. 复现与审计重点

**本站走查做了什么（小样本，非论文指标复现）**：clone 官方仓库 @`5d41de7`，用 DPS 的 FFHQ 权重 `ffhq_10m.pt`（校验：362 项 OrderedDict、93,563,910 参数，`input_blocks.0.0.weight = [128,3,3,3]`，与 `ffhq_model_config.yaml` 的 `num_channels=128` 一致）与仓库自带 `code/data/{0,1}.jpg`；任务 SR 4× 与 random inpainting，全部默认超参（50 次 DDP 迭代、20 个扩散步、σ=0.05、seed 42、lr 5e-3、weight_scale 1e-6）。配置里 `data.root` 写的是 `data/samples/`，实际文件在 `data/`，用 `--data_root ./data` 覆盖即可，**无代码改动**。

| 任务（ffhq 两图） | 本次 PSNR / LPIPS | 论文主表 |
|---|---|---|
| SR 4× | 27.24 / 0.1453（图 0）、30.00 / 0.1157（图 1），平均 LPIPS 0.1305 | FFHQ 4× SR：0.189 @1000 NFE（本方法） |
| random inpainting | 27.32 / 0.1115、32.62 / 0.0971，平均 0.1043 | 未在走查记录中核对 |

- 本次设置 50×20 ≈ 1000 NFE，与论文 1000 NFE 一档可比；LPIPS 0.1305（两图均值）优于论文的 0.189，但**两张图、且图更容易**，只说明走查链路正确。PSNR 是走查自行补算的（`eval_psnr.py`），论文不报，不能对齐。
- 耗时：SR 两图约 3.5 min（~2.4 s/迭代），inpainting 两图约 4 min，峰值显存 3.5–3.7 GB（4090 D 单卡）。SR 的测量是 64×64，故未对 y 算 PSNR。
- 定性：SR 输出清晰、无明显面部崩坏；inpainting 在 30–70% 随机缺失下能补全五官，掩码边界不明显。

**审计要点**：

1. **没有 PSNR/SSIM 主表**使这篇很难与 DMPlug/N-HMC 一类工作横比；引用它的「新基线」时要注意指标是 LPIPS/FID。
2. **控制代价权重 1e-6 是否等价于「几乎无正则」**：需要从论文正文确认 running cost 的定义（代码里 `state_cost` 也会进入 env，`use_running_state_cost` 的取值决定是否每个状态都罚测量残差），否则会误读方法。
3. **NFE 口径**：50 次 DDP 迭代 × 20 步 ≠ 1000 次网络前向？每次 DDP 迭代都要 rollout 一遍，所以真实 NFE 是 50×20 的前向 + 反向，论文的「2500 NFE」如何计数需要核对。
4. **可微算子假设**：医学前向模型若有不可微环节（如离散重建、采样掩码的不可微实现），这条路线需要额外处理，论文没有讨论。

## 6. 建议阅读顺序

摘要 → §1 的三个痛点 → 最优控制形式的定义（状态/控制/代价）→ iLQR 推导与「后验采样是特例」那一节 → 与 DPS/ReSample 的对比实验（LPIPS/NFE 曲线）→ 附录中的超参与分类器实验 → 仓库 `optimizers/mfddp.py`（看二次近似如何落地）。

## 7. 前后关联

- 与 [32 号 DMPlug](32-dmplug.md) 是「优化谁」的两种答案：DMPlug 只优化种子，这篇优化每步控制；DMPlug 用一阶 Adam，这篇用二阶 DDP。
- 与 [34 号 N-HMC](34-nhmc.md) 是「怎么保住流形」的两种答案：N-HMC 把变量搬到初始噪声、用 HMC 探索；这篇用控制代价与局部二次模型约束轨迹。
- 与 [25 号 ReSample](25-resample.md) 对照：硬投影 vs 软控制；ReSample 需要在像素/潜空间解子问题，这篇只需要 A 可微。
- 与 [03 DDIM](03-ddim.md)、[04 Score SDE](04-score-sde.md)：方法把 DDIM 当作确定性动力学，SDE 视角则对应连续时间最优控制，是可延伸的方向。
- 与 [20 号 DDS](../mri/20-dds.md)、[32 号 DDIP](../mri/32-ddip.md) 的医学逆问题求解器对照：那些方法在 CT/MRI 上强调测量算子与噪声统计，这篇完全没有医学实验，迁移时需要重新验证算子可微性与尺度。

## 8. 链接

- [NeurIPS 2024 官方 proceedings 摘要页](https://proceedings.neurips.cc/paper_files/paper/2024/hash/86655bc516148e311bcfcf88f1744de7-Abstract-Conference.html)
- [官方代码 lihenryhfl/diffusion_optimal_control](https://github.com/lihenryhfl/diffusion_optimal_control)
- [DPS 权重（README 指向的 Google Drive 目录）](https://drive.google.com/drive/folders/1jElnRoFv7b31fG0v6pTSQkelbSX3xGZh)
- [推理走查记录](/pathology-atlas/learning/infer-diffusion-optimal-control.html)
