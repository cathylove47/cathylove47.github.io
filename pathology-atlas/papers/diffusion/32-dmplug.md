# 32｜DMPlug：把整个反向扩散当成一个函数，只在初始噪声上做全局优化

**论文**：DMPlug: A Plug-in Method for Solving Inverse Problems with Diffusion Models，Hengkang Wang、Xu Zhang、Taihui Li、Yuxiang Wan、Tiancong Chen、Ju Sun；NeurIPS 2024；arXiv:2405.16749
**定位**：零样本逆问题求解器；不再在反向采样里逐步插梯度/投影，而是把 DDIM 反向过程整体看成从种子到图像的确定性函数 R(z)，对 z 求「数据拟合 + 先验」的全局最优；用 3 步 DDIM 就能算梯度，靠「先学内容、后拟合噪声」的早期停止现象处理未知噪声
**精读核验**：2026-11-22 依 arXiv HTML v2 全文逐节读过（Abstract、§1–5、Algorithm 1/2、Table 1–7、Figure 1–6，附录只读 B/E 的标题级结论），会议信息按 arXiv 页注明的 NeurIPS 2024 与 OpenReview 记录（forum `81IFFsfQUj`）。官方代码 `sun-umn/DMPlug` 同日核对并 clone 到服务器：`sr_inp_nonlinear.py`（唯一入口，含 SR / inpainting / nonlinear deblur）、`ddim_sampler.py`、`guided_diffusion/measurements.py`、`configs/` 是真实实现，权重与数据都要外部下载。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：FFHQ 单图跑 SR 4×、70% 随机缺失 inpainting、非线性去模糊三个任务，无代码改动；见 [DMPlug 推理走查记录](/pathology-atlas/learning/infer-dmplug.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Pretrained diffusion models (DMs) have recently been popularly used in solving inverse problems (IPs). The existing methods mostly interleave iterative steps in the reverse diffusion process and iterative steps to bring the iterates closer to satisfying the measurement constraint. However, such interleaving methods struggle to produce final results that look like natural objects of interest (i.e., manifold feasibility) and fit the measurement (i.e., measurement feasibility), especially for nonlinear IPs. Moreover, their capabilities to deal with noisy IPs with unknown types and levels of measurement noise are unknown. In this paper, we advocate viewing the reverse process in DMs as a function and propose a novel plug-in method for solving IPs using pretrained DMs, dubbed DMPlug. DMPlug addresses the issues of manifold feasibility and measurement feasibility in a principled manner, and also shows great potential for being robust to unknown types and levels of noise. Through extensive experiments across various IP tasks, including two linear and three nonlinear IPs, we demonstrate that DMPlug consistently outperforms state-of-the-art methods, often by large margins especially for nonlinear IPs. The code is available at this https URL.

*来源：arXiv:2405.16749v2 摘要页原文（v2 为 NeurIPS 2024 版）；与 OpenReview 记录摘要一致。*

## 中文摘要

> 预训练扩散模型近来被广泛用于求解逆问题。现有方法大多把「反向扩散的迭代步」与「把迭代点推向满足测量约束的迭代步」交错进行。然而这类交错方法很难让最终结果既像目标自然对象（流形可行性）、又拟合测量（测量可行性），在非线性逆问题上尤其如此；而且它们处理「噪声类型与强度未知」的含噪逆问题时能力如何，此前并不清楚。本文主张把扩散模型的反向过程视为一个函数，提出一种新的插件式方法 DMPlug。DMPlug 以有原则的方式同时处理流形可行性与测量可行性，并在噪声类型与强度未知时展现出很强的鲁棒潜力。我们在两个线性与三个非线性逆问题上的大量实验表明，DMPlug 稳定优于现有最好方法，在非线性逆问题上往往领先幅度很大。代码已公开。

*译文：对应上方英文摘要逐句对译，未增删内容。*

## 1. 三分钟摘要与推荐理由

一句话：**把「解逆问题」从采样过程里搬到函数空间——先固定预训练扩散模型的反向过程 R(·)，再把要恢复的图像参数化成 x = R(z)，于是只剩一个对种子 z 的普通优化问题 min_z ℓ(y, A(R(z))) + Ω(R(z))。**

三件值得读的事：

1. **它把「流形可行性」做成了结构性保证**：交错方法每一步都同时改动「去噪」和「满足测量」两个过程，作者指出（§1、Fig. 3）这样两边都不收敛；DMPlug 完全不碰反向过程，因此输出天然落在扩散模型的数据流形上，测量一致性交给外部优化器。论文举的例子很直白：无噪声非线性去模糊下，DPS/ReSample 的测量残差停在很高的平台（Fig. 2）。
2. **算力上它反直觉地便宜**：因为 DDIM 可以跳步，作者实测 **3 步反向**就足以让梯度穿过整个 R（Fig. 5：3 步已追上更多步的性能），显存与耗时虽仍高于 DPS，但与 ReSample 同量级（Table 7）。这是「把反向过程当网络」这一视角真正的工程红利。
3. **未知噪声靠「早停」而不是靠估噪声**：图像回归实验（Fig. 6）显示 DMPlug 先拟合图像内容、后拟合噪声（early-learning-then-overfitting，ELTO），于是只要在峰值附近停住即可；作者直接复用他们自己参与的 ES-WMV 做无参考早停，Table 4 上在噪声类型/强度未知时仍领先。

**关于「这一类方法在我们关心的场景意味着什么」（本页判断）**：DMPlug 与 [34 号 N-HMC](34-nhmc.md)、[33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md) 是同一族的三种解法——都在**冻结先验之外**优化一个低维/等维变量，区别只在「优化谁」（种子 z）、「用什么动力学」（HMC / iLQR / Adam）与「怎么防过拟合」（早停 / 噪声先验 / 控制代价）。读这三篇能看清「测试时优化」这条线的共性收益与共性风险：收益是测量一致性和流形一致性可以同时拿住；风险是所有指标都在 σ=0.01–0.05 的合成高斯噪声、256² 自然图上取得，没有任何病灶级或感知级审计。

## 2. 问题及研究位置

逆问题 y = A(x) + n。传统做法是正则化数据拟合 min_x ℓ(y, A(x)) + Ω(x)（式 1），先验 Ω 换成预训练扩散模型后，主流路线有两条：

- **条件采样/交错式（interleaving）**：把无条件 score 换成条件 score ∇log p_t(x|y) = ∇log p_t(x) + ∇log p_t(y|x)，但似然不可解，于是用 p_t(y|x̂₀(x_t)) 近似（DPS、BlindDPS），或干脆在每步后做一次投影/梯度下降（DDRM、DPS、ReSample 等）。作者把它们统一写成 Algorithm 1，并指出三个问题：**流形不可行**（改动了反向过程，去噪器被喂到分布外输入）、**测量不可行**（非线性算子的「投影」本身和原问题一样难，单步近似不收敛）、**未知噪声无对策**。
- **其他视角**：GAN 反演（x=G(z)，训练生成器 + 优化 z）、扩散反演（找 z 使 R(z)=x）、算法展开（用成对数据训练多块网络）。作者在 §3.2 逐一划清界限：DMPlug 不训练任何权重、不需要成对数据，且 DDIM 确定性使其梯度可算。

DMPlug 的位置：**把「先验」完全冻结在流形上，把「测量」完全交给一个通用优化器**，两者通过复合函数耦合。这与 [25 号 ReSample](25-resample.md) 的「硬一致性投影 + 重采样」正好是两种极端：ReSample 在采样轨迹上反复投影，DMPlug 一次优化到底；也与 [38 号 DDA](38-dda.md) 那种「只动输入、不动模型」的适配思路形成对照（那篇是分类，这篇是重建）。

## 3. 核心方法和数据流

```text
输入：测量 y、前向算子 A、预训练 ε_θ、DDIM 调度器（T' 步，可跳步）
Z ~ N(0, I)，requires_grad
for e = 1 … E:                          # 默认 E=5000（非线性 10000）
    for i, t in enumerate(scheduler.timesteps):   # 默认 T'=3
        ε̂ = ε_θ(x_t 或 Z, t)
        x_t = DDIM.step(ε̂, t, x_t, eta=0)         # 确定性
    x̂₀ = clamp(x_t, -1, 1)
    loss = ‖A(x̂₀) − y‖²                          # inpainting 里 A 带掩码
    loss.backward(); Adam.step()                  # lr=1e-2
输出：x̂₀ = R(z*)，脚本另存「迭代中 PSNR 最高的那一帧」
```

四个要点：

1. **优化变量是种子，不是图像**：式 7 里 Ω(R(z)) 由「R 的输出在流形上」隐式满足，实践中脚本甚至没加额外正则项（只有测量 MSE），先验完全由 R 的结构承担。
2. **3 步 DDIM 是核心工程选择**：每步梯度都要前向 + 反向穿过整个 R，T'=100 时无法承受；作者在 Fig. 5（CelebA SR，Adam 6000 次迭代）给出 PSNR–时间曲线，3 步在几乎最短时间里达到饱和性能。
3. **ELTO 与早停**：Fig. 6 用「干净自然图 / 打乱像素 / 均匀噪声 / 含噪自然图」四种回归目标说明 R(z) 对结构敏感、对噪声不敏感；含噪回归时会先到峰值再被噪声拖下去。ES-WMV 用滑动窗口内的指标变化判断峰值，属无参考早停。
4. **多对象扩展**：式 7 允许把多个对象（如盲去模糊的核 k 与图像 x）分别参数化并加不同先验（Table 5 的灵活性消融），这是交错式方法难以自然表达的。

## 4. 论文证据与实验范围

**设置**：从 CelebA、FFHQ、LSUN-bedroom 各采 100 张 256×256 图；五个任务 = SR 4×、随机 inpainting（70% 缺失）两个线性任务，非线性去模糊、盲去模糊（BID）、BID + 湍流三个非线性任务；测量噪声统一加性高斯 σ=0.01；指标 PSNR/SSIM/LPIPS（默认主干）。基线含 DMPS、DDRM、MCG、ILVR、DPS、ReSample、ADMM-PnP、BlindDPS、Stripformer。

**FFHQ 主结果（Table 8 线性、Table 1 非线性，σ=0.01）**：

| 任务 | DMPlug | 最强基线 | 差值 |
|---|---|---|---|
| SR 4× | 0.079 / 30.25 / 0.871 | DMPS 0.076 / 28.03 / 0.843 | PSNR +2.22 |
| 随机缺失 70% | 0.038 / 33.01 / 0.931 | DPS 0.046 / 30.95 / 0.913 | PSNR +2.06 |
| 非线性去模糊 | 0.057 / 32.83 / 0.907 | ReSample 0.104 / 27.02 / 0.834 | PSNR +5.79 |

（表内顺序为 LPIPS↓ / PSNR↑ / SSIM↑；「最强基线」按 PSNR 取作者表中 FFHQ 列的最优竞争者，作者自己的「Ours vs. Best compe.」行给出同样的 PSNR 差值——注意 SR 的 LPIPS 上 DMPS 反而更低，DMPlug 在该项并不领先。）

**效率与鲁棒性（Table 4/7、Fig. 5）**：Table 7 在 CelebA SR 上对比各算法的墙钟时间与显存，作者称 L-BFGS 版显著快于 ADAM 版、但整体仍偏慢；Fig. 5 则说明 3 步反向已接近饱和性能。含未知噪声时 DMPlug+ES-WMV 在 SR 与非线性去模糊上仍领先（Table 4 用 PSNR 与 PSNR Gap 报告）。

**范围限制（本页判断）**：全部 256² 自然图、单一噪声类型（高斯）与 σ=0.01（鲁棒性实验另设类型/强度）、无医学数据、无感知/病灶级评估；「3 步 DDIM」是在 FFHQ/CelebA 类 256² 先验上调出来的结论，换分辨率或换域（如 MRI 复数多线圈、CT）没有验证。另外 LPIPS/SSIM 与 PSNR 同表报告，但所有方法都没被要求给出不确定度或多次采样统计。

## 5. 复现与审计重点

**本站走查做了什么（小样本，非论文指标复现）**：服务器上 clone 官方仓库 `sun-umn/DMPlug` @`e3101e7`，只跑推理，用 DPS 的 FFHQ 权重 `ffhq_10m.pt` 与仓库自带 FFHQ 图；三个任务各一张图，全部默认超参（3 步 DDIM、eta=0、Adam lr=1e-2、σ=0.01、SR 4×、mask 0.7；SR/inpainting 5000 轮、非线性 10000 轮）。环境做了必要替换：原作者 environment.yml 的 py3.8 + cu11.0 + torch1.7 在 4090（sm_89）上不可用，改为 py3.10 + torch 2.1.2+cu118；`huggingface_hub` 需降到 0.23.5，否则 diffusers 0.26.2 的 `cached_download` 导入失败（仅环境，不改代码）；非线性去模糊额外 clone `motionblur` 与 `bkse`，用 `PYTHONPATH` 解决 bkse 的 `import models.arch_util`。无算法代码改动。

| 任务（ffhq 单图） | 本次 PSNR / SSIM / LPIPS | 论文 FFHQ 列 |
|---|---|---|
| SR 4× | 32.37 / 0.902 / 0.0687 | 30.25 / 0.871 / 0.079 |
| 随机缺失 70% | 34.99 / 0.941 / 0.0365 | 33.01 / 0.931 / 0.038 |
| 非线性去模糊 | 32.08 / 0.892 / 0.0786 | 32.83 / 0.907 / 0.057 |

- 走查数字三项都在论文同量级，inpainting 几乎逐项吻合；**但数值偏高有明确原因**：脚本按「迭代过程中最高 PSNR / 最低 LPIPS」存图与报告，这是 oracle 选择，而论文表格是固定迭代/最终输出口径，因此本次数字只说明链路跑通，不能当复现结果。SR 结果肉眼略过平滑，非线性去模糊的 LPIPS 反而比论文差，与「单图 + 最优帧选择」的口径差异一致。
- 耗时：SR 5000 轮约 26–39 min（单进程约 0.31 s/轮），inpainting 同量级，非线性 10000 轮约 31 min；单进程 6–7 GB 显存。

**审计要点**：

1. **指标口径**：官方脚本把 best-frame PSNR 当作结果（`grep psnrs` 可见 `psnr_res = np.max(psnrs)`），论文表格是否同样取最优帧、还是取最后一次迭代，需要从论文附录/作者确认；这直接决定 2 dB 级领先有多少来自早停选择。
2. **早停的实现**：论文用 ES-WMV，但仓库推理脚本里没有 ES，跑 E 轮后取最优帧；「未知噪声鲁棒」这一卖点在开源代码里没有对应入口。
3. **步数与分辨率**：3 步 DDIM 的最优性只在 256² 自然图上验证；换 512²、换潜空间 LDM、换复数 MRI 时梯度的信噪比会变，不能默认成立。
4. **非线性算子**：nonlinear deblur 依赖外部 `bkse`，掩码/核的生成逻辑在同仓库另一条脚本里，若只跑 SR/inpainting 很容易忽略这条分支的额外依赖。

## 6. 建议阅读顺序

摘要 → §1 的三个 Issue 与 Fig. 3（交错 vs 插件）→ §3.1 式 6/7（反向过程作为函数）与 Algorithm 2 → §3.3 ELTO 与 Fig. 6 → §4.1 的 Table 1/8 与 Fig. 5（步数–时间）→ Table 7（显存耗时）→ Table 4（未知噪声）→ 附录 B（频谱偏置）。

## 7. 前后关联

- 与 [25 号 ReSample](25-resample.md) 是同一问题的两个极端：ReSample 在采样轨迹上做硬一致性投影，DMPlug 一次性全局优化种子；两者都强调「解码器/非线性使逐步梯度失效」，但给出的修补方向相反。
- 与 [34 号 N-HMC](34-nhmc.md) 直接对照：N-HMC 的 Fig. 1(c) 就把 DMPlug 画成「确定性 MAP 掉进局部模式」的代表，N-HMC 用噪声空间 HMC 换探索性；DMPlug 的回应是用 Adam/L-BFGS 的全局性与早停换确定性。两篇一起读，能看清「MAP vs 后验采样」在 256² 自然图上的实际差距（非线性去模糊 32.83 vs 27.66 PSNR，口径不同，见 34 号）。
- 与 [33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md) 同属「把采样重写成最优控制/优化」：那篇控制的是每步的状态增量（iLQR），这篇控制的只有初始种子。
- 与 [02 DDPM](02-ddpm.md)、[03 DDIM](03-ddim.md) 是上下游：DDIM 的确定性正是式 6/7 成立的前提，跳步能力是 3 步可行的原因。
- 与 [28 号 DPS](28-dps.md)、[29 号 DDRM](29-ddrm.md)：这两篇是 DMPlug 的 Table 1/8 里被压过的交错式代表；DMPlug 对「投影/梯度单步不够」的批评正对着它们，读 Table 1/8 时建议并排看这三篇的实现差异。
- 与 [38 号 DDA](38-dda.md) 对照：都是「冻结扩散模型、只动一个外部变量」，但 DDA 动的是输入图像（分类适配），DMPlug 动的是种子（重建）。

## 8. 链接

- [arXiv:2405.16749（abs）](https://arxiv.org/abs/2405.16749)
- [arXiv HTML v2 全文](https://arxiv.org/html/2405.16749v2)
- [OpenReview（forum 81IFFsfQUj）](https://openreview.net/forum?id=81IFFsfQUj)
- [官方代码 sun-umn/DMPlug](https://github.com/sun-umn/DMPlug)
- [推理走查记录](/pathology-atlas/learning/infer-dmplug.html)
- [外部依赖 motionblur](https://github.com/LeviBorodenko/motionblur)、[blur-kernel-space-exploring](https://github.com/VinAIResearch/blur-kernel-space-exploring)
