# 11｜HalluGen：先把幻觉「造出来」，再去评价和检测它

**论文**：HalluGen: Synthesizing Realistic and Controllable Hallucinations for Evaluating Image Restoration  
**作者**：Seunghoi Kim、Henry F. J. Tregidgo、Chen Jin、Matteo Figini、Daniel C. Alexander（UCL Hawkes Institute；AstraZeneca）  
**发表**：CVPR 2026（CVF Open Access，pp. 32550–32560）；arXiv:2512.03345v1（2025-12-03）  
**定位**：图像修复中的幻觉评测；在扩散后验采样（DPS）里做「定向梯度上升」，合成类型、位置、严重度可控且自带标注的幻觉  
**核验**：2026-11-18 依 arXiv HTML v1 全文（正文 §1–5 与补充材料 §6–9、Algorithm 1–3、Table 1–7）整理；代码对照 `edshkim98/HalluGen` master 分支（最后推送 2026-04-29）。本页只读论文与代码，**未运行生成、训练或评测**；所有数字为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | 低场 MRI 增强（主实验），另做超分、去模糊；跨域到 MVTec AD 工业图与 ImageNet |
| 输入 / 输出 | 输入真值 $x_{gt}$、退化观测 $y$、前向算子 $\mathcal{A}$；输出幻觉图 $\hat x$ 与幻觉掩码 $m$ |
| 数据集 | 1,450 张 HCP 脑 MRI 切片 → 4,350 张（无幻觉 / 内在 / 外在各 1,450） |
| 两个用途 | ① 评测图像质量指标对幻觉是否敏感，并提出 SHAFE；② 训练无参考幻觉检测器 |
| 代码 | 公开，但 README 自称"开发中"；无预训练权重、无 `requirements.txt` |

## 原文摘要

> Generative models are prone to hallucinations: plausible but incorrect structures absent in the ground truth. This issue is problematic in image restoration for safety-critical domains such as medical imaging, industrial inspection, and remote sensing, where such errors undermine reliability and trust. For example, in low-field MRI, widely used in resource-limited settings, restoration models are essential for enhancing low-quality scans, yet hallucinations can lead to serious diagnostic errors. Progress has been hindered by a circular dependency: evaluating hallucinations requires labeled data, yet such labels are costly and subjective. We introduce HalluGen, a diffusion-based framework that synthesizes realistic hallucinations with controllable type, location, and severity, producing perceptually realistic but semantically incorrect outputs (segmentation IoU drops from 0.86 to 0.36). Using HalluGen, we construct the first large-scale hallucination dataset comprising 4,350 annotated images derived from 1,450 brain MR images for low-field enhancement, enabling systematic evaluation of hallucination detection and mitigation. We demonstrate its utility in two applications: (1) benchmarking image quality metrics and developing Semantic Hallucination Assessment via Feature Evaluation (SHAFE), a feature-based metric with soft-attention pooling that improves hallucination sensitivity over traditional metrics; and (2) training reference-free hallucination detectors that generalize to real restoration failures. Together, HalluGen and its open dataset establish the first scalable foundation for evaluating hallucinations in safety-critical image restoration. We will make the code and dataset publicly available upon acceptance.

*来源：arXiv:2512.03345v1 摘要，逐字保留。*

## 中文摘要

> 生成模型容易产生幻觉：看起来合理、但真值中并不存在的错误结构。在医学影像、工业检测、遥感等安全攸关领域的图像修复中，这类错误会损害可靠性与信任。例如在资源有限地区广泛使用的低场 MRI 中，修复模型是增强低质量扫描的关键，但幻觉可能导致严重的诊断错误。进展一直受制于一个循环依赖：评价幻觉需要标注数据，而这种标注既昂贵又主观。我们提出 HalluGen，一个基于扩散的框架，能合成类型、位置和严重度均可控的逼真幻觉，产生感知上逼真但语义上错误的输出（分割 IoU 从 0.86 降到 0.36）。借助 HalluGen，我们构建了首个大规模幻觉数据集，包含由 1,450 张脑 MR 图像衍生的 4,350 张带标注图像，面向低场增强任务，使幻觉检测与抑制的系统评估成为可能。我们在两个应用中展示其作用：（1）对图像质量指标做基准评测，并提出 SHAFE（基于特征评估的语义幻觉评价），这是一种带软注意力池化的特征指标，对幻觉的敏感度高于传统指标；（2）训练能泛化到真实修复失败的无参考幻觉检测器。HalluGen 及其开放数据集为安全攸关图像修复中的幻觉评价奠定了首个可扩展的基础。我们将在论文录用后公开代码与数据集。

*译文：逐句对译上方原文摘要，未增删内容。*

## 0. 三分钟摘要

**一句话**：幻觉没法标，那就反过来——在扩散后验采样里，对一小块区域故意"往错的方向推"，造出位置已知、类型已知、看起来逼真的幻觉，标注因此是免费的。

**问题**：评价幻觉需要标注，但人标幻觉很不靠谱。作者让两位专家在 50 张图上做 patch 级标注，Cohen's κ 只有 **0.30**（通常要 >0.60 才算可靠）。同时 PSNR / SSIM / LPIPS 会给"有幻觉但锐利"的图打比"无幻觉但稍糊"的图更高的分（Fig. 2）。

**insight**：幻觉本质上是修复器把先验"猜"的东西当成了答案。DPS 的每一步都有一个"往观测靠拢"的梯度；只要在掩码区域把这个梯度**反过来**（梯度上升），就得到"违背观测"的幻觉；如果保持观测一致、但在图像/特征空间远离真值，就得到"观测里看不出来"的幻觉。扩散先验本身把结果拉回数据流形，所以造出来的东西是逼真的。

**它到底做到了什么**：
- 造出来的幻觉逼真：FID 与普通 DPS 相当（0.36–0.43 vs 0.32），专家混看只认出 **50.5%**（等于瞎猜）。
- 语义确实错了：幻觉区域的组织分割 IoU 从 **0.861** 降到 **0.36** 左右。
- 现有指标基本测不出：LPIPS 检测 AUC 0.51 / 0.50，跟抛硬币一样；SHAFE 提到 0.72–0.82。
- 只用合成数据训出的检测器，在 300 张真实修复输出上 AUC **0.73**。

### 实验先看什么

Fig. 2（指标偏爱锐利）→ Table 1（逼真且语义错）→ Table 3（指标基准，全文核心表）→ Table 4（检测器迁移到真实失败）。

## 1. 问题与核心判断

- **幻觉的两种类型**（沿用 Bhadra 等 TMI 2021 与同组 DynamicDPS 的划分，Eq. 2–3）：
  - **内在幻觉（intrinsic）**：$\mathcal{A}(\hat x)\neq\mathcal{A}(x_{gt})$，结果和观测对不上。理论上做一次观测一致性检查就能发现。
  - **外在幻觉（extrinsic）**：$\mathcal{A}(\hat x)=\mathcal{A}(x_{gt})$，但在 $\mathcal{A}$ 看不到的部分（类似零空间）和真值不同。观测一致性检查完全无效，只能靠真值或领域知识。
- **循环依赖**：要评价幻觉 → 需要标注 → 标注又贵又主观（κ=0.30）→ 没法评价。HalluGen 用"合成"打破这个循环。
- **和对抗攻击的区别**：幻觉是生成不确定性自然产生的，不是人为加扰动；HalluGen 造的是"修复器自己也可能犯的错"，而不是对抗样本。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| DPS（Diffusion Posterior Sampling） | 每一步去噪后，再沿"让结果的退化版和观测 $y$ 更像"的方向推一下 |
| Tweedie 估计 $\hat x_0(x_t)$ | 由当前带噪图一步估计出的"干净图" |
| 梯度上升 | 和 DPS 反着推：让结果在掩码区**更不像**观测或真值 |
| HVM（Hallucination Verification Module） | 生成后用效应量检查"这块真的够成幻觉了吗"，不够就重采 |
| Cohen's $d$ | 两组数均值差除以合并标准差，衡量差异大小，和尺度无关 |
| SHAFE | 特征空间逐 patch 余弦距离 + softmax 加权汇总，让少数严重 patch 主导分数 |

## 3. 核心方法与数据流

```text
真值 x_gt 经前向算子 A 退化 → 观测 y
→ 用 DPS 正常重建 → 无幻觉基线 x_base
→ 按熵挑选 1–3 个 16–24px 的 patch，避开背景 → 幻觉掩码 m
→ 把 x_base 加噪到 t_skip，开始反向采样；每步先算 Tweedie 估计 x̂0，掩码外与 x_base 插值
→ 掩码外做 DPS 梯度下降贴合观测；掩码内做梯度上升：内在推离观测（Eq. 6），外在推离真值的像素与特征（Eq. 7）
→ t ≤ t_stop 后关掉梯度上升，让扩散先验把边界修自然
→ HVM 用 Cohen's d 逐 patch 检查是否满足类型定义，不满足就重采
→ 输出 (x_gt, y, x̂, m)
```

### 3.1 内在幻觉（Eq. 6，Algorithm 1）

$$x_{t-1}=\mu_\theta(x_t,t)-\lambda_t\nabla_{x_t}\|(1-m)\odot(y-\mathcal{A}(\hat x_0))\|^2+\gamma_t\nabla_{x_t}\|m\odot(y-\mathcal{A}(\hat x_0))\|^2$$

掩码外照常往观测靠（减号），掩码内反着推（加号）。结果就是只在 $m$ 里违背观测。

### 3.2 外在幻觉（Eq. 7，Algorithm 2）

$$x_{t-1}=\mu_\theta-\lambda_t\nabla\|y-\mathcal{A}(\hat x_0)\|^2+\gamma_{1,t}\nabla\|m\odot(\hat x_0-x_{gt})\|^2+\gamma_{2,t}\nabla\|m\odot(F(\hat x_0)-F(x_{gt}))\|^2$$

全图保持观测一致，同时在掩码里让像素和**特征**（$F$ 用 MedSAM / SAM / DINOv3）远离真值。作者解释为什么要加特征项：只在像素空间推，优化会在"数据分布、观测一致、远离真值"三者之间折中，结果偏弱；特征项让偏离落在语义层面。

### 3.3 HVM（Eq. 8–9）

在最后一步，对每个掩码 patch 算 Cohen's $d$：
- 内在：观测域偏差 $d_{meas}\ge\tau_{hvm}$；
- 外在：$d_{meas}\le\tau_{hvm}$ 且图像域偏差 $d_{img}\ge\tau_{hvm}$。

不满足就重新采掩码再生成。$\tau_{hvm}=0.1$。

### 3.4 为什么造出来的东西是逼真的

去噪网络 $\mu_\theta$ 每一步都把样本拉回高似然区域，相当于"软流形先验"；最后 $t_{stop}=10$ 步关掉上升，让先验主导收尾。所以结果是"局部错、整体自然"。

### 3.5 主要超参（补充 §6.1）

DDPM，$\varepsilon$ 参数化，$T=1000$，$t_{skip}=200$；$\lambda_t=1.0$，内在 $\gamma_t=0.002$，外在 $\gamma_{1,t}=\gamma_{2,t}=0.007$；特征编码器 MedSAM；熵 / 背景阈值 1.4 / 0.05；patch 16–24，1–3 个。

### 3.6 SHAFE（Eq. 11，Algorithm 3）

1. 预测图与真值都先低通滤波（半径 50），去掉棋盘格这类高频伪影；
2. 送入预训练编码器，取**多个浅层**特征（DINOv3 [1,2,3]、ResNet50 [1,2]、MedSAM [-1]）；
3. 逐 patch 算余弦距离 $\delta_{cos,i}$；
4. 用温度 $\tau$ 的 softmax 加权：$\text{SHAFE}=\sum_i w_i\delta_{cos,i}$，$w_i\propto\exp(\delta_{cos,i}/\tau)$。

$\tau$ 越小越接近取最大值，让少数严重 patch 主导；$\{w_i\delta_{cos,i}\}$ 本身就是一张幻觉定位热图。

### 3.7 数据集构建（§3.4、§7）

扩散先验在 1,000 例 HCP 3T 脑 MRI 的轴位切片（256×256）上训练；低场退化沿用 DynamicDPS：$\mathcal{A}=\text{Blur}(\text{DS}_4(\Gamma_{0.7}(\cdot)))$。每张真值生成三份：DPS 基线、内在、外在。每张幻觉图 1–3 个不重叠 patch；生成单张内在约 60 s、外在约 90 s（单张 A6000，batch 1）。

## 4. 实验与证据

**Table 1：逼真但语义错**

| 方法 | FID ↓ | 幻觉区 IoU ↓ | 覆盖类型 |
|---|---|---|---|
| DPS | 0.32 | 0.861 ± 0.09 | — |
| 随机旋转 | 0.32 | 0.393 ± 0.12 | 仅内在 |
| 观测加噪 | 0.48 | 0.721 ± 0.10 | 仅内在 |
| HalluGen + MedSAM | 0.41 | 0.363 ± 0.15 | 两类 |
| HalluGen + SAM | 0.36 | 0.367 ± 0.15 | 两类 |
| HalluGen + DINOv3 | 0.43 | 0.362 ± 0.04 | 两类 |

随机旋转也能把 IoU 拉低，但只能造内在幻觉，而且会留 patch 边缘痕迹。

**Table 2：类型定义是否成立**（掩码区 MSE）：内在的观测损失 0.039，约为 DPS（0.006）的 7 倍；外在的观测损失 0.003，比 DPS 还低，但图像损失 0.041 明显高于 DPS 的 0.022。两类都按定义生成了。

**可控性（§4.3，只对内在测）**：$\gamma$ 从 0.0005 到 0.01，幻觉区平方误差 718 → 767；patch 数 1 → 5，总误差约线性 150 → 810；patch 尺寸 16² → 64²，误差 488 → 9000；三组里 FID 都稳定。

**Table 3：指标基准（全文核心）**——摘录 AUC 与真实数据 AUC：

| 指标 | AUC 内在 | AUC 外在 | 真实输出 AUC |
|---|---|---|---|
| PSNR | 0.59 | 0.51 | 0.58 |
| SSIM | 0.52 | 0.40 | 0.53 |
| MS-SSIM | 0.79 | 0.21 | 0.57 |
| LPIPS | 0.51 | 0.50 | 0.42 |
| DISTS | 0.52 | 0.54 | 0.44 |
| SHAFE-ResNet50 | 0.82 | 0.72 | 0.58 |
| SHAFE-MedSAM | 0.81 | 0.75 | 0.70 |
| SHAFE-DINOv3 | 0.76 | 0.74 | **0.79** |

三个结论：感知指标（LPIPS、DISTS）基本测不出幻觉；像素指标只对内在幻觉有点用，对外在幻觉失效；MS-SSIM 因为多尺度比 SSIM 好很多，但外在 AUC 只有 0.21。真实输出那一列来自作者对 SwinIR、EDSR、ESRGAN 的 300 个预测的人工二值标注。

**SHAFE 消融（Table 6、7，N=300）**：低通 + softmax 加权两者都关时 AUC 0.52，只开 softmax 0.64，两个都开 0.78。ResNet50 只用最深一层 AUC 0.63，层 1+2 最好 0.78。$\tau\le0.02$ 时性能稳定，更大后逐渐下降（Fig. 9）。

**Table 4：无参考检测器**（输入为 $\hat x$ 与 $y$，ResNet50 浅层特征 + 二分类头，只在 HalluGen 上训练）：

| 测试集 | AUC | F1 |
|---|---|---|
| HalluGen 内在 | 0.91 | 0.95 |
| HalluGen 外在 | 0.77 | 0.76 |
| 真实预测 | 0.73 | 0.63 |

外在比内在难约 0.14 AUC，与定义一致：外在幻觉和观测是一致的。

**HalluGen 消融（Table 5，N=250）**：熵选 patch 让内在的偏离增加约 70%；外在加上特征损失与 HVM 后，图像损失从 1.5×10⁻³ 升到 4.7×10⁻³。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库：[edshkim98/HalluGen](https://github.com/edshkim98/HalluGen)，基于 OpenAI guided-diffusion；README 写着 **"Code under active development"**。
- 有：生成脚本 `image_sample_hallugen.py`，评测 `hallubench_new.py` 与 `SHAFE.py`，训练 `image_train.py`，配置 `configs.yaml`。
- 缺：README 要求 `pip install -r requirements.txt`，但仓库里没有这个文件；没有预训练扩散模型下载链接（README 写的是先 `python image_train.py` 从头训）；`datasets/` 里只有 LSUN 示例加载器；README 中未找到数据集下载入口。
- 外部依赖：[SAM-Med2D](https://github.com/uni-medical/SAM-Med2D) 需单独克隆并下载 `sam-med2d_b.pth`。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| Eq. 6–7 内在 / 外在梯度 | `guided_diffusion/condition_methods.py` → `ConditioningMethod.grad_and_value`（约第 691 行起） |
| Eq. 8–9 HVM | 同文件 `hallucination_verification`（约第 648 行），用 `scipy` 的 `label` 逐个掩码块检查 |
| Cohen's $d$ | 同文件 `standardized_effect_size` |
| 特征提取器 $F$ | 同文件 `SAMFeatExtractor`、`SAMMed2DFeatExtractor`、`TimmFeatExtractor` |
| SHAFE 低通 | `hallubench_new.py` 的 `apply_lowpass_filter`，`_LOWPASS_RADIUS = 50` |
| SHAFE softmax 汇总 | `hallubench_new.py` 的 `_aggregate_scores(agg='softmax')` 与 `_shafe_score` |
| Table 3 各项统计 | `hallubench_new.py` 的 `auc_score_test`、`severity_correlation`、`quality_correctness_tradeoff` |

**代码与论文不一致的地方（读代码时要留意）**

1. 外在 HVM 阈值：论文写 $d_{meas}\le0.1$ 且 $d_{img}\ge0.1$；代码是 `eff_m < 0.1 and eff_i > 0.05`。
2. 外在特征损失：代码先算了 `feats * hallu_mask`，下一行又用未加掩码的 `torch.linalg.norm(feats)` 覆盖，实际是**全图**特征差，不是论文 Eq. 7 的掩码内特征差。
3. `configs.yaml` 默认是 `gaussian_blur` 算子、`skip_timestep: 799`，和论文的复合低场算子、$t_{skip}=200$ 不同；数据路径指向作者集群（`/cluster/project0/...`）。

这三点可能是开发中版本的遗留，复现时以论文为准，并在报告里写明用的是哪个设定。

### 5.2 第一个该做的验证（不需要大模型）

只测 **SHAFE**：它不依赖扩散模型，只要预测图和真值。拿一组你已有的病理修复输出（例如 RestorePath 或 SuperDiff 的推理结果），人工在 20–30 张上框出明显编造的核或腺体，比较 SSIM / LPIPS / SHAFE 能不能把有幻觉的挑出来。这一步就能回答"病理修复的幻觉，现有指标测不测得出"，不用先训扩散模型。

## 6. 前后关联

- **同组前作**：Tackling Structural Hallucination with Local Diffusion（ECCV 2024，`t_stop` 关掉上升的做法来自这里）；DynamicDPS（MICCAI 2025，低场算子与幻觉类型划分来自这里）。
- **幻觉定义的源头**：Bhadra 等，On Hallucinations in Tomographic Image Reconstruction，IEEE TMI 2021（测量空间 vs 零空间幻觉图）。
- **病理里的对应问题**：[RestorePath](../pathology/49-restorepath.md)、[ArtiFusion](../pathology/55-artifusion.md)、[SuperDiff](../pathology/78-histo-diffusion.md) 都只报感知指标；[Reliable Staining](../pathology/86-reliable-histological-staining.md) 证明感知指标会饱和。HalluGen 的框架正好可以给这些方法补一个"幻觉"维度。
- **反事实生成的同类思路**：[CPathOGen](../pathology/52-cpathogen.md) 也是"先声明改哪里、再验证改成了"，只是目的是审计编码器，不是评测修复器。
- **方法零件**：[DDPM](02-ddpm.md) 与 Tweedie 估计；DPS 是 [Score-SDE](04-score-sde.md) 那条线的后验采样。

## 7. 局限与可检验问题

**作者承认的**：
- 平滑区域（壳核、背景）造不出明显幻觉，扩散先验会压住上升信号（Fig. 8）；
- 不能精确指定幻觉的形态或拓扑，每次采样结果不同；
- 先验决定逼真度：MVTec 上单类先验比多类先验造的幻觉更连贯；
- 数据只有健康成人脑 MRI；
- SHAFE 对高频伪影（周期网格）不敏感，又容易在脑边界这类强度差大但无语义的地方报高分（Fig. 11）。

**我的看法（作者没写的）**：
1. **合成幻觉 ≠ 真实幻觉**。检测器在合成外在上 AUC 0.77，到真实输出只剩 0.73；SHAFE-ResNet50 在真实数据上只有 0.58。合成分布和真实失败之间有差距，论文没有量化这个差距来自哪。
2. **真实评测集小且标注者少**。300 张真实输出、二值标签，标注人数与一致性没有像 κ=0.30 那样报出来，而这恰恰是论文用来说明人工标注不可靠的依据。
3. **"幻觉"被操作化为"掩码内统计偏离"**。HVM 用的是 Cohen's $d$ 阈值，和临床意义上的"编造病灶"不一定对应；IoU 下降用的是 GMM 三类组织分割，粒度很粗。
4. **只在 DPS 上实例化**。修复器本身多为 SwinIR / EDSR / ESRGAN 这类非扩散模型，没有检验扩散修复器（例如条件扩散、潜空间修复）自身的幻觉。

**迁移到病理时要回答的问题**：
- 病理没有明确的前向算子（伪影修复）或算子近似已知（失焦、低倍），内在 / 外在的划分怎么落地？
- 掩码挑选用熵在 H&E 上还有效吗？病理组织大部分区域熵都高。
- 特征编码器换成病理基础模型（UNI、CONCH）后，SHAFE 会更好，还是会因为编码器本身对染色敏感而更差？

## 8. 来源与版本

- arXiv：<https://arxiv.org/abs/2512.03345>（v1，2025-12-03）；HTML 全文 <https://arxiv.org/html/2512.03345>
- CVPR 2026 Open Access：<https://openaccess.thecvf.com/content/CVPR2026/html/Kim_HalluGen_Synthesizing_Realistic_and_Controllable_Hallucinations_for_Evaluating_Image_Restoration_CVPR_2026_paper.html>
- 代码：<https://github.com/edshkim98/HalluGen>（master，2026-04-29）
- 依赖：SAM-Med2D <https://github.com/uni-medical/SAM-Med2D>
- 前作：Bhadra et al., IEEE TMI 40(11):3249–3260, 2021, DOI 10.1109/TMI.2021.3077857
