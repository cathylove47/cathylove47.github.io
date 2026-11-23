# 36｜InstantViR：把视频扩散教师蒸馏成一步因果学生，实时解视频逆问题

**论文**：InstantViR: Real-Time Video Inverse Problem Solver with Distilled Diffusion Prior，Weimin Bai、Suzhe Xu、Yiwei Ren、Jinhua Hao、Ming Sun、Wenzheng Chen、He Sun；CVPR 2026；arXiv:2511.14208
**定位**：摊销式（amortized）视频逆问题求解器；把 Wan2.1-1.3B 双向视频扩散教师蒸馏成「退化视频 → 重建视频」的一步因果自回归学生，彻底去掉测试时迭代；再用 teacher-space 正则化把教师潜空间的知识搬到高效 LeanVAE 潜空间，实现 832×480 上 >35 FPS
**精读核验**：2026-11-22 依 arXiv HTML 全文（Abstract、§1–5、Table 1–2、Figure 1–4，附录实现细节只读标题级）逐节读过；会议信息按合同核验记录为 CVPR 2026（arXiv 注释栏为空）。官方代码 `ai4imaging/InstantViR` @`d2b0416` 同日核对：仓库**没有** requirements.txt/setup.py（README 却要求安装），`minimal_inference/autoregressive_inverse_inference.py` 是官方推理入口，`instantvir/scripts/create_degraded_dataset.py` 是数据构造入口，`configs/wan_causal_inverse_*.yaml` 是各任务配置，`instantvir/models/leanvae_wrapper.py` 硬编码 LeanVAE 路径。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：只跑 inpainting（mask 0.5）一条任务、两段 81 帧 832×480 视频，SR×4 因官方 LMDB 未公开而未能按 README 跑；见 [InstantViR 推理走查记录](/pathology-atlas/learning/infer-instantvir.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> Video inverse problems are fundamental to streaming, telepresence, and AR/VR, where high perceptual quality must coexist with tight latency constraints. Diffusion-based priors currently deliver state-of-the-art reconstructions, but existing approaches either adapt image diffusion models with ad hoc temporal regularizers - leading to temporal artifacts - or rely on native video diffusion models whose iterative posterior sampling is far too slow for real-time use. We introduce InstantViR, an amortized inference framework for ultra-fast video reconstruction powered by a pre-trained video diffusion prior. We distill a powerful bidirectional video diffusion model (teacher) into a causal autoregressive student that maps a degraded video directly to its restored version in a single forward pass, inheriting the teacher's strong temporal modeling while completely removing iterative test-time optimization. The distillation is prior-driven: it only requires the teacher diffusion model and known degradation operators, and does not rely on externally paired clean/noisy video data. To further boost throughput, we replace the video-diffusion backbone VAE with a high-efficiency LeanVAE via an innovative teacher-space regularized distillation scheme, enabling low-latency latent-space processing. Across streaming random inpainting, Gaussian deblurring and super-resolution, InstantViR matches or surpasses the reconstruction quality of diffusion-based baselines while running at over 35 FPS on NVIDIA A100 GPUs, achieving up to 100 times speedups over iterative video diffusion solvers. These results show that diffusion-based video reconstruction is compatible with real-time, interactive, editable, streaming scenarios, turning high-quality video restoration into a practical component of modern vision systems.

*来源：arXiv:2511.14208 摘要页原文（HTML 版）。*

## 中文摘要

> 视频逆问题对直播、远程呈现与 AR/VR 至关重要，这些场景要求高感知质量与严格延迟并存。基于扩散先验的方法目前给出最先进的重建，但现有做法要么给图像扩散模型加临时的时序正则（导致时间伪影），要么依赖原生视频扩散模型、其迭代后验采样对实时来说太慢。我们提出 InstantViR：一种由预训练视频扩散先验驱动的摊销推断框架，用于超快视频重建。我们把一个强双向视频扩散教师蒸馏成一个因果自回归学生，学生一次前向就把退化视频映射为恢复版本，继承教师强时序建模能力并完全去掉测试时迭代优化。该蒸馏是先验驱动的：只需教师扩散模型与已知退化算子，不依赖外部成对的干净/退化视频数据。为进一步提升吞吐，我们通过一种新的教师空间正则化蒸馏方案，把视频扩散主干的 VAE 换成高效 LeanVAE，实现低延迟的潜空间处理。在流式随机 inpainting、高斯去模糊与超分上，InstantViR 的重建质量与基于扩散的基线持平或更好，同时在 NVIDIA A100 上超过 35 FPS，相对迭代式视频扩散求解器最高加速 100 倍。这些结果表明，基于扩散的视频重建可以与实时、交互、可编辑、流式场景兼容，使高质量视频修复成为现代视觉系统的实用组件。

*译文：对应上方英文摘要逐句对译，未增删内容。*

## 1. 三分钟摘要与推荐理由

一句话：**不再「每个视频跑 100 步采样」，而是把「教师扩散先验 + 已知退化」蒸馏进一个因果自回归学生，推理时一次前向出整段视频；瓶颈随后从 DiT 转到解码器，于是再蒸馏一个 LeanVAE 潜空间，把 14 FPS 拉到 35 FPS。**

三件值得读的事：

1. **「摊销」这一步把优雅换成了工程可行性**：连续后验采样（SVI、DPS）在 832×480 上只有 0.02–0.3 FPS，没法做流式；InstantViR 用变分目标（式 5–7：似然项 + 到教师先验的 KL，用 score matching 近似）蒸馏出 q_φ(z|y)。KL 项用冻结教师的 score 做近似，所以**不需要成对数据**——退化 y 由干净视频在线生成，训练只查询教师。
2. **因果结构是流式的关键**：学生按时间块（T 帧）处理，块内双向注意力、块间只允许看历史（KV cache），这样才能一边收帧一边出帧；这与离线双向教师的能力差距由蒸馏弥补。
3. **LeanVAE 换 VAE 必须「对齐教师空间」**：直接换 VAE 会让 z′ 与教师训练的 z 分布错位（论文明确说会严重退化），所以式 11 的做法是「似然在新的 z′ 空间算，先验项把 z′ 解码再编码回教师 z 空间算」，这就是 teacher-space regularized distillation。

**关于「对我们关心的医学/病理场景」的判断（本页判断）**：这篇的意义不是「又一个更快的视频修复」，而是示范了**把大生成先验的推理成本一次性摊销**的范式。医学场景里，如果一个退化算子族（如固定加速率的 MRI 重建、固定扫描协议的 CT）要在同一分布上反复求解，摊销在原理上可行；但代价是训练需要教师、8×A100 两周，以及**退化算子必须固定且可微**——真实临床的协议/噪声分布漂移会让「一步学生」的鲁棒性成为新的审计点。论文完全没有医学实验，也没有对「学生在分布外退化上是否编造」的任何评估。

## 2. 问题及研究位置

视频逆问题：y = A(x) + n，x 为视频。目标是从 y 恢复 x，并在流式场景下满足延迟约束。已有路线：

- **图像扩散 + 临时时序正则**（SVI、VISION-XL）：把 2D 先验沿时间做 batch 一致采样，靠测量约束耦合帧；质量好但迭代慢，且时序一致性靠手工同步噪声（SVI 的 η 调参）；
- **原生视频扩散 + 迭代后验采样**：教师级质量但每段视频几十秒到几分钟，无法实时；
- **视频修复网络**（DiffIR2VR）：快，但不是生成式先验，感知质量与退化泛化有限。

InstantViR 的位置：**把「视频扩散先验」与「一步推断」结合**。它不修改教师的生成过程，而是学一个摊销后验 q_φ；这与 [35 号 SVI](35-svi.md)（零训练、迭代、慢）正好互补，与 [32 号 DMPlug](32-dmplug.md)/[34 号 N-HMC](34-nhmc.md) 的「测试时优化」形成「训练时摊销 vs 测试时求解」的对照。

## 3. 核心方法和数据流

```text
训练（离线）：
  视频 x ~ p_data（Open-Sora 6000 段，无文本标签）
  y = A(x)（在线生成退化）
  z' ~ q_φ(z'|y)                        # 学生的潜变量采样
  L = E[ −log p(y | D'(z')) ]           # 似然：在新 VAE 解码后算测量误差
      + E_{t,ε}[ w(t)‖ s_θ(z_t,t) − s_{q}(z_t,t) ‖² ]   # 先验：把 z' 解码→教师编码器 E 得 z，再加噪
  教师 s_θ（Wan2.1-1.3B）冻结；学生 = 因果 DiT + 小 score 头

推理（流式）：
  按块读入 y_n → 编码 → 块内双向注意力 + 块间 KV cache → 一次前向得 ẑ_n → D'(ẑ_n) 解码
  历史块的 K/V 缓存复用；无迭代、无测试时优化
```

要点：

1. **变分目标是「摊销后验」的标准写法**（式 5–7），但 KL(q‖p) 无法直接算，于是用 score matching（式 8）近似；这与扩散蒸馏（score distillation）同源。
2. **无配对数据**：只需教师与 A，y 可以无限生成；这是它相对监督视频修复网络的最大优势，也是「换退化算子只要换 A」的原因。
3. **因果自回归**：块内双向（保证局部时空结构）、块间因果（保证流式），KV cache 存历史块的 K/V；这与 LLM 的流式解码同构。
4. **两阶段提速**：原 VAE 下已约 15 FPS（DiT 不再是瓶颈，解码器是），LeanVAE（NAF 主干 + 小波通道压缩）再快 >2×，达到 35 FPS。仓库推理脚本里 `--infer_dtype bf16` 是必须的（fp32 在 24 GB 卡上放不下 T5 + DiT）。

## 4. 论文证据与实验范围

**设置**：训练 Open-Sora-v1.1 的 6000 段视频（不用文本标签），评测 500 段留出 Open-Sora + REDS30（零样本），全部 832×480；教师 Wan2.1-1.3B，训练 8×A100 两周；任务是 50% 随机 inpainting、高斯去模糊、4× 超分；指标 PSNR/SSIM/LPIPS/FVD 与 FPS（单 A100/A800）。

**空间质量（Table 2）**：

| 任务 | InstantViR（原 VAE） | InstantViR†（LeanVAE） | 最强基线 |
|---|---|---|---|
| 50% inpainting | 30.54 / 0.97 / 0.12 | 31.78 / 0.96 / 0.13 | VISION-XL 30.83 / 0.95 / 0.25（PSNR 略高，LPIPS 明显更差） |
| 4× SR | 34.91 / 0.96 / 0.23 | **27.04** / 0.95 / 0.22 | VISION-XL 35.69 / 0.98 / 0.24（PSNR/SSIM 更高） |
| 高斯去模糊 | 31.85 / 0.97 / 0.17 | 31.16 / 0.97 / 0.15 | SVI 26.93 / 0.89 / 0.31 |

（PSNR / SSIM / LPIPS。按 PSNR 看，InstantViR 在 inpainting 与 SR 上并非全场第一，优势集中在 LPIPS 与 FVD；但论文正文写的是「surpassing SVI and VISION-XL in PSNR, SSIM, and LPIPS」，与 Table 2 的这几格不一致，引用时应以表格为准。）

**时间一致性与速度（Table 1，FVD↓ / FPS↑）**：

| 方法 | inpainting | SR | deblur | FPS |
|---|---|---|---|---|
| DPS | 375.81 | 711.61 | 783.10 | <0.02 |
| SVI | 219.90 | 176.60 | 154.38 | 0.29 |
| VISION-XL | 224.74 | 172.79 | 138.79 | <0.17 |
| InstantViR | 136.06 | 153.13 | 110.51 | 13.91 |
| InstantViR† | **132.59** | 156.43 | **103.45** | **35.56** |

值得注意的三点（本页判断）：

- **† 版在 4× SR 上 PSNR 掉到 27.04**（原版 34.91），比 SVI 的 33.85 低近 7 dB，而 FVD 还略有变差（156.43 vs 153.13）。论文正文没有单独解释这一项；从「换潜空间」的角度看，LeanVAE 在高频细节任务上损失更大是可能的，但这是**同一篇论文内部不一致**的信号，引用「† 全面更好」时要小心。
- **FVD 全面最低**说明时间一致性确实是摊销学生的强项（不闪烁），这与 SVI 的 batch 同步思路解决的是同一个问题。
- **速度对比的基线不公平之处**：0.29 FPS 的 SVI 是 100 NFE 的迭代解，35 FPS 的学生是一次前向；论文用「最高 100× 加速」表述，实际是**训练成本换推理成本**。

**范围限制**：只有三个合成退化、两个自然视频数据集，无医学、无真实传感器噪声；「零样本 REDS」只测了视觉；文本引导重建（Fig. 4）依赖教师文本编码器，实际是另一个能力维度，不属逆问题主表。

## 5. 复现与审计重点

**本站走查做了什么（小样本，非论文指标复现）**：clone 官方仓库 @`d2b0416`，下载 Wan2.1-T2V-1.3B 全套（17.1 GB，ModelScope，sha256 与 HF LFS 一致）、LeanVAE-dim16.ckpt（152 MB）与作者的蒸馏权重 `wan_causal_inverse_inpainting_model.pt`（5.3 GB，Google Drive）。**官方 predegraded LMDB 不可得**（`sr4_predegraded_merged.lmdb` 与 `inpainting_leanvae_merged.lmdb` 只有 `lock.mdb`，`data.mdb` 未公开；可用的两个 LMDB 各 48–53 GB，超出预算），于是用仓库自带演示视频 + 官方 `create_degraded_dataset.py`（frames 模式）自建 2 段 81 帧的 mask0.5 LMDB（latent 形状 `(1,21,16,60,104)`，与配置一致）。**偏差**：frames 模式下 prompt 是占位串 `FRAMES_<dirname>`，文本条件无语义，inpainting 主要靠 KV cache + 测量一致性。原计划的 SR×4 **没有跑**。代码改动仅两处：`code/wan_models → ../ckpt/wan_models` 软链（源码路径写死）；推理脚本在算完 prompt embedding 后把冻结 T5 移到 CPU 并 `empty_cache()` 腾出 ~11 GB（不改算法/超参），再加 `--infer_dtype bf16`。

| 视频（832×480，81 帧） | PSNR 重建 vs GT | PSNR 退化上采样 | SSIM 重建 | 时间一致度（重建 vs GT） |
|---|---|---|---|---|
| inpainting GT 014 | 31.48 | 17.03 | 0.9548 | 0.0179 vs 0.0187 |
| deblur GT 012 | 33.64 | 12.44 | 0.9268 | 0.0211 vs 0.0213 |

- 掩膜区域误差与未遮区域同量级（视频 2：0.0067 vs 0.0129），说明孔洞是补出来的而不是照抄测量；时间一致度几乎等于 GT（退化输入是 0.044/0.068），因果 KV cache 的流式重建没有逐帧闪烁。
- 速度：Wan VAE 解码 4.86 s → e2e 7.1 FPS；LeanVAE 解码 0.18 s → e2e **34.8 FPS**（主干稳定 43 FPS，瓶颈完全在解码器）。与论文「>35 FPS」量级一致，虽然**这次只换了同一个 ckpt 的解码器**（见下一条）。
- **关键发现**：公开的三个平铺 ckpt 是 **Wan-VAE 版**。用 LeanVAE 配置 + LeanVAE LMDB 跑同一份 ckpt 只有 10.72 dB（比退化输入还差），换回 Wan VAE 配置后 31.48 dB；作者 Drive 上 LeanVAE 对应目录是空的。所以 † 版（LeanVAE 学生）的画质数字**无法用公开权重验证**，我们只测了解码速度。
- 显存：bf16 峰值 19.42 GB alloc / 19.49 GB reserv（KV cache 5.62 GB，T5 ~11 GB 常驻），24 GB 够用但很紧；fp32 直接 OOM。

**审计要点**：

1. **官方 predegraded LMDB 不公开**，README 的 SR×4 与「论文表格口径」无法按原样复现；用 frames 模式自建会改变 prompt，影响文本条件相关结论。
2. **† 版 SR 掉点 7 dB**：引用「LeanVAE 只提速不掉质」时需要看任务——在 SR 上不成立。
3. **加速比的口径**：100× 是相对迭代求解器，且未计训练成本（8×A100 两周）；「实时」的适用前提是退化算子固定、分布稳定。
4. **分布外鲁棒性缺失**：学生是摊销的，遇到训练分布外的退化强度（如 mask 比例从 0.5 变 0.9）会不会编造内容，论文没有测；这正是我们关心的幻觉审计点。

## 6. 建议阅读顺序

摘要 → §3.1 式 5–8（变分摊销与 score distillation）→ §3.2 因果块注意力与 KV cache → §3.3 换 VAE 的分布漂移与式 11 → §4.1 设置（无配对数据、6000 段）→ Table 1/2 → Fig. 3（inpainting 与 REDS 零样本）→ Fig. 4（文本引导）→ 附录实现细节。

## 7. 前后关联

- 与 [35 号 SVI](35-svi.md) 是同一问题的「训练时摊销 vs 测试时求解」：SVI 0.29 FPS、FVD 154–220；InstantViR 13.9/35.6 FPS、FVD 103–156。
- 与 [32 号 DMPlug](32-dmplug.md)、[34 号 N-HMC](34-nhmc.md)、[33 号 Diffusion Optimal Control](33-diffusion-optimal-control.md) 构成「测试时优化」与「训练时摊销」的完整对照：前三者都在推理时求解，本篇把求解搬到训练。
- 与 [04 Score SDE](04-score-sde.md)、[08 Flow Matching](08-flow-matching.md)：蒸馏目标与 score/flow 的教学同源；教师是 flow-matching 视频模型（Wan2.1），学生用 score matching 对齐。
- 与 [20 号 DDS](../mri/20-dds.md)、[31 号 SCD](../mri/31-scd.md)、[32 号 DDIP](../mri/32-ddip.md)：医学逆问题的「测试时适配」与「摊销」之争；如果临床协议固定，摊销是可行方向，但需要论文没有做的分布外审计。
- 与 [38 号 DDA](38-dda.md)、[37 号 TENT](37-tent.md)：同样是「不改生成模型、只动一个外置变量」的适配思路，DDA 在推理时把输入推回源域、TENT 只更新 BN 统计，本篇则把整个映射在训练时学死。

## 8. 链接

- [arXiv:2511.14208（abs）](https://arxiv.org/abs/2511.14208)
- [arXiv HTML 全文](https://arxiv.org/html/2511.14208)
- [官方代码 ai4imaging/InstantViR](https://github.com/ai4imaging/InstantViR)
- [Wan2.1-T2V-1.3B 权重（ModelScope）](https://modelscope.cn/models/Wan-AI/Wan2.1-T2V-1.3B)
- [LeanVAE 代码](https://github.com/westlake-repl/LeanVAE)、[LeanVAE 16ch 权重（HuggingFace Yumic/LeanVAE）](https://huggingface.co/Yumic/LeanVAE)
- [推理走查记录](/pathology-atlas/learning/infer-instantvir.html)
