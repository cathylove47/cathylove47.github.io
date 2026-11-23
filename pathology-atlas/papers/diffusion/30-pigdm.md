# 30｜ΠGDM：用伪逆做引导，任务无关的扩散模型也能打平专用模型

**论文**：Pseudoinverse-Guided Diffusion Models for Inverse Problems（ΠGDM），Jiaming Song、Arash Vahdat、Morteza Mardani、Jan Kautz（NVIDIA）；ICLR 2023；无 arXiv 版，OpenReview `9_gsMA8MRKQ`，会议 PDF 见作者主页
**定位**：绕过「p(y|x_t) 不可解」的另一条路——把一步去噪结果与测量**都过一遍伪逆 h† 再相减**，用向量-雅可比积当引导项；因为用的是伪逆而不是转置，带噪、非线性、甚至不可微（量化、JPEG）的测量都能处理
**精读核验**：2026-11-22 依 ICLR 2023 会议 PDF（`jankautz.com/publications/PiGDM_ICLR23.pdf`）读过摘要、§1–5 与附录 A 的相关部分（Table 1–5、式 7–11 与 A.2/A.4 的 r_t 与权重讨论），摘要与其逐字核对；该文无 arXiv 版本，摘要以会议版为准。官方代码**不存在**：论文声明的项目页 `nvlabs.github.io/pinv-diffusion/` 现已 404（2026-11-22 核对），论文页只挂在 NVIDIA 研究主页；唯一可运行实现是同一实验室 RED-diff 代码库里的 `algo=pgdm` 基线（本次走查即用它）。**本站做过推理走查（小样本，用作者权重经第三方实现，非论文指标复现）**，记录见[推理走查页](../../learning/infer-pigdm.html)。

## 原文摘要

> Diffusion models have become competitive candidates for solving various inverse problems. Models trained for specific inverse problems work well but are limited to their particular use cases, whereas methods that use problem-agnostic models are general but often perform worse empirically. To address this dilemma, we introduce Pseudoinverse-guided Diffusion Models (ΠGDM), an approach that uses problem-agnostic models to close the gap in performance. ΠGDM directly estimates conditional scores from the measurement model of the inverse problem without additional training. It can address inverse problems with noisy, non-linear, or even non-differentiable measurements, in contrast to many existing approaches that are limited to noiseless linear ones. We illustrate the empirical effectiveness of ΠGDM on several image restoration tasks, including super-resolution, inpainting and JPEG restoration. On ImageNet, ΠGDM is competitive with state-of-the-art diffusion models trained on specific tasks, and is the first to achieve this with problem-agnostic diffusion models. ΠGDM can also solve a wider set of inverse problems where the measurement processes are composed of several simpler ones.

*来源：ICLR 2023 会议版（`PiGDM_ICLR23.pdf`）摘要，逐字照录。*

## 中文摘要

> 扩散模型已成为求解各类逆问题的有力候选。为特定逆问题训练的模型效果好，但只能用于那一类问题；而使用与问题无关的模型的方法虽通用，经验上常常更差。为化解这一两难，我们提出伪逆引导扩散模型（ΠGDM）：用与问题无关的模型把性能差距补上。ΠGDM 直接从逆问题的测量模型估计条件分数，不需要额外训练。它能处理测量带噪、非线性、甚至不可微的逆问题，而许多现有方法只限于无噪线性情形。我们在超分、修复、JPEG 恢复等图像复原任务上展示了经验效果。在 ImageNet 上，ΠGDM 与针对特定任务训练的 SOTA 扩散模型相当，是首个用问题无关模型做到这一点的做法。ΠGDM 还能求解测量过程由若干简单过程复合而成的更广泛逆问题。

*译文：逐句对译上方英文摘要，未增删。*

## 1. 三分钟摘要与推荐理由

一句话：**引导项写成「h†(y) − h†(h(x̂_t))」再乘 ∂x̂_t/∂x_t 的转置——把测量与预测都搬到「测量值域」比较，而不是像重建引导那样在像素域用 Hᵀ(y−Hx̂) 硬比。**

三件值得读的事：

1. **伪逆 vs 转置，这是与 DPS 的核心分歧**：Table 1 的三行把引导方法分成三类——分类器引导（要成对训练）、重建引导（要求 x_t→y 可微，且不支持带噪 y）、伪逆引导（不要求可微、不需要训练、支持带噪 y）。当 H 的奇异值不全为 0/1 时 H†≠Hᵀ，差别是实打实的（Table 5 的去模糊上 PSNR 20.97 → 39.36）。
2. **不可微测量是它的招牌**：JPEG 编码后的量化不可导，但「解码」可以当 h†，于是 (h†(y) − h†(h(x̂_t))) 依旧可算；量化取 h=⌊x⌋、h†=恒等即可。这条让它在 Palette 系列（为 JPEG/修复专门训练的模型）面前不落下风，而它**从没见过这些退化**。
3. **自适应权重**：式 10 的引导权重被吸收进 DDIM 的步长里，等效于「早期放大引导、后期回落到 1」，避免不同任务要用不同的固定权重（Fig. 6/7 与附录 A.4）。

**本页判断**：ΠGDM 是把「伪逆」当测量算子的通用接口，思路干净、实验扎实；但它对**线性**算子的收益最明确，非线性部分靠 h† 的构造（相位/JPEG 各有各的写法）。它和 [28 号 DPS](28-dps.md) 谁更好取决于 H 的谱：H 条件数差时伪逆明显赢，H 平滑且测量很噪时 DPS 的「软梯度」更省事。

## 2. 问题及研究位置

y = Hx₀ + z（线性）或 y = h(x₀)（一般测量过程）。贝叶斯分解后

$$\nabla_{x_t}\log p_t(x_t|y)=\nabla_{x_t}\log p_t(x_t)+\nabla_{x_t}\log p_t(y|x_t),$$

第二项仍然要靠 p(x₀|x_t) 的边缘化。已有近似分两派：

- **重建引导**（Ho 等、DPS 同期）：∇log p(y|x_t) ≈ −r_t^{−2}∇‖y−Hx̂_t‖²，等价于用 Hᵀ 代替 H†，且默认 y 的噪声各向同性、无法处理噪声项；
- **分类器引导**：训练一个 q(y|x_t) 分类器，需要成对的 (x_t, y)，与「问题无关」直接冲突。

本文的定位很清楚：**保持问题无关、不训练、但把「测量一致性」这一步用正确的线性代数做掉**，顺带把不可微的 h 也纳进来。

## 3. 核心方法和数据流

```text
输入：测量 y、测量模型 h（可带噪/非线性/不可微）、其伪逆 h†、无条件分数网络 S_θ、步长表
x_T ~ N(0, σ_T²I)
for t = T … 1（100 步，均匀间隔）:
    x̂_t = 一步去噪估计的 x₀（Tweedie / 网络输出）
    # 引导项（无噪线性时即式 8；一般 h 时式 9）
    g_t = r_t^{−2} · (h†(y) − h†(h(x̂_t)))^⊤ · ∂x̂_t/∂x_t
    x_s = f(x_t; s, t, η) + r_t²·g_t        # f 为 DDIM 一步；权重被步长吸收，故自适应
输出：x₀
```

四点解释：

1. **近似对象换了**：把 p(x₀|x_t) 近似为 N(x̂_t, r_t²I)（附录 A.2），于是 ∇_{x_t}log p(y|x_t) 变成「以 h† 为坐标的残差 × 雅可比」。线性 H 时 h†(h(x̂))=H†Hx̂，残差就是 H†(y−Hx̂)，与 DPS 的 Hᵀ(y−Hx̂) 只差一个矩阵。
2. **噪声怎么进来**：带高斯噪声 σ_y 时，式 7 把残差除以 σ_y² 同期乘 r_t²，等价于「按噪声水平缩放引导」；这就避免了 DPS 里「噪声大时必须把步长调小」的经验操作。
3. **不可微测量的两例**：量化 h(x)=⌊x⌋，h† 取恒等；JPEG 的 h 是编码，h† 取解码（解码不改变量化后的值，故 h(h†(h(x)))=h(x)）。低动态范围成像同理（附录 A.5）。
4. **复合算子**：因为引导只需要 h 与 h† 的**组合**，多个退化串联（如 低分辨率 + JPEG + 遮挡）可以直接复合，不需要为每种组合训练模型——这是论文 Fig. 2 的卖点。

## 4. 论文证据与实验范围

**设定**：ImageNet 256，无条件与类条件 ADM（1000 个离散时间步），100 次迭代、η=1.0；SR 在**完整验证集**上评，修复与 JPEG 在 10k 子集上评（沿用 Palette 的划分）。指标 FID 与 ResNet50 分类准确率 CA（用来衡量语义保真）。

**4× 超分（Table 2）**：

| 滤波 | 方法 | FID↓ | CA↑ |
|---|---|---|---|
| 平均池化 | ADM（专用） | 3.1 | 73.4% |
| 平均池化 | DDRM | 14.8 | 64.6% |
| 平均池化 | **ΠGDM** | **3.8** | 72.3% |
| 平均池化 | **ΠGDM（类条件）** | **3.6** | 72.2% |
| Bicubic | ADM（专用） | 14.8 | 66.7% |
| Bicubic | DDRM | 21.3 | 63.2% |
| Bicubic | **ΠGDM** | **3.6** | 72.1% |
| Bicubic | **ΠGDM（类条件）** | **3.2** | 75.1% |

**修复（Table 3，去掉 Palette 的两行）**：Center mask 下 ΠGDM 7.3/72.6%，带噪（σ_y=0.05）9.5/72.2%，DDRM 24.4/62.1%；Freeform 下 ΠGDM 5.3/75.3%，带噪 7.3/74.5%，Palette 5.2/72.3%。**FID 略输 Palette、CA 全面反超**是作者反复强调的读法。

**JPEG 恢复（Table 4）**：QF=5/10/20 上 ΠGDM 为 8.6/6.0/4.7（FID）与 64.1/71.0/74.4%（CA），Palette 为 8.3/5.4/4.3 与 64.2/70.7/73.5%；回归基线 29.0/18.0/11.5。QF10、QF20 的 CA 反超。

**消融（Table 5）**：去模糊任务，去掉 ΠG 只留自适应权重 → PSNR 20.97、KID×10³ 42.56；留 ΠG、去掉自适应权重 → 31.95 / 0.98；两者都有 → **39.36 / 0.00**。Bicubic 上 FID 从 18.6 降到 6.2、CA 从 40.6% 升到 72.4%。作者结论：ΠG 是主要贡献，自适应权重是次要但必要的补丁。

**范围限制（本页判断）**：全部在 ImageNet 256 自然图像上，没有医学或科学成像；非线性只演示了 JPEG/量化这类「有明确 h†」的算子，真正的非线性（相位恢复）没做；CA 作为感知/语义代理，对纹理类退化不敏感；FID 在 10k 子集上也未必稳定。

## 5. 复现与审计重点

**本站推理走查（小样本，用作者权重经第三方实现，非论文指标复现；完整记录见[走查页](../../learning/infer-pigdm.html)）**：

- **跑法**：没有作者官方实现，改用同实验室的 `NVlabs/RED-diff` @ `66482f2`，`algo=pgdm`，权重为 openaipublic 的 ADM `256x256_diffusion_uncond.pt`；数据是 6 张 OOD 自然图；**100 步、η=1.0、σ_y=0**（README 的 pgdm 示例值，config 默认 η=0 与论文不符，这一点务必按 README）。
- **结果**：SR×4 六张平均 **26.90 dB**；20% free-form 修复 **24.04 dB**。
- **关键坑（掩码极性）**：仓库不自带 Palette 的 free-form 掩码，自造 20.5% 随机笔画时第一次把 `1` 当成「缺失」，而 `Inpainting2` 把 `singulars()=mask` 当**观测**（1=保留），等于把任务反转，只有 13.57 dB；掩码取反（1=保留 79.5%）后重跑得 24.04 dB。**换成 Palette 官方掩码时必须核对同一极性**。
- **改动**：只为本地子集加了一层 `meta.bin` 回退读取（torchvision 0.16 的 `load_meta_file` 会做 md5 校验），算法与 `algo/pgdm.yaml` 未改。
- **没跑**：ImageNet 1k 全量、FID/CA、修复的 Center mask、JPEG 三个 QF、DDRM/DPS 对照。

其余审计要点：

- **η 的两个值**：正文说 100 迭代、η=1.0；附录 A.4 与重建引导的对比里又出现 η=0.2。复现前应从代码确认 η 对应的是 DDIM 的随机性还是引导权重。
- **「无超参」的边界**：r_t 的选择（附录 A.2）仍是启发式，且不同任务的步数/权重表在附录 B 里逐任务给，并不完全免调。
- **h† 的正确性依赖 h 的构造**：JPEG 那条恒等式（h(h†(h(x)))=h(x)）只在标准解码器上成立；换成色度子采样或非标准量化表就要重验。
- **对比公平性**：Table 2/3/4 的专用模型（ADM-U、Palette、SR3）是在同分布退化上训练的，ΠGDM 没训过；这是作者的卖点，但也意味着「打平」是在专用模型的主场上发生的，读数时应保留这一点。

## 6. 建议阅读顺序

摘要 → §3.1 式 3–7（伪逆引导的推导）→ §3.2（量化、JPEG 的 h† 构造）→ §3.3 式 10/11（自适应权重）→ §3.4 Table 1（三类引导对比）→ §5.1 Table 2/3/4 → §5.2 Table 5（ΠG 与 AW 的消融）→ 附录 A.2（r_t 与各向同性假设）→ 附录 A.4（与固定权重 w_r 的对比）。

## 7. 前后关联

- 与 [28 号 DPS](28-dps.md)：两者都从 ∇log p(y|x_t) 出发，DPS 用 A 的雅可比、ΠGDM 用 h†；线性且 H 谱良好时二者等价（ΠGDM 附录 A.2 明说「转置等于伪逆时二者相同」），谱差时 ΠGDM 更稳。
- 与 [29 号 DDRM](29-ddrm.md)：都用伪逆/谱分解，DDRM 把整条采样搬到奇异值空间并固定 20 步，ΠGDM 保留原空间但每步算伪逆残差；速度上前者快一个量级。
- 与 [31 号 DAPS](31-daps.md)：DAPS 明确批评「每步只做小修正」导致早期误差无法回改，改用边缘分布采样；ΠGDM 属于被批评的那一类，但在线性任务上成本低得多。
- 与 [25 号 ReSample](25-resample.md)：ReSample 在潜空间解硬约束优化，ΠGDM 用伪逆残差做软引导，前者要求前向可微、后者要求能构造 h†。
- 与 [04 号 Score-SDE](04-score-sde.md) 的连续时间视角互补：ΠGDM 的引导权重随 σ_t 变化，本质是在补「p(y|x_t) 的噪声水平随 t 变化」这件事。
- 医学侧见 [20 号 DDS](../mri/20-dds.md)：DDS 对 CT/MRI 的算子做分解式处理，思路更接近 DDRM 而非 ΠGDM。

## 8. 链接

- [OpenReview（ICLR 2023，forum 9_gsMA8MRKQ）](https://openreview.net/forum?id=9_gsMA8MRKQ)
- [会议版 PDF](https://jankautz.com/publications/PiGDM_ICLR23.pdf)
- [NVIDIA 研究主页论文页](https://research.nvidia.com/labs/genair/publication/song2023pseudoinverse/)（论文声明的项目页 `nvlabs.github.io/pinv-diffusion/` 现为 404）
- [走查所用实现 NVlabs/RED-diff（`algo=pgdm`）](https://github.com/NVlabs/RED-diff)
- [社区复现 jeremtti/pseudoinverse_guided_ddpm](https://github.com/jeremtti/pseudoinverse_guided_ddpm)
