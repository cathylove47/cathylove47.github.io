# 23｜偏移不确定性 LPN：换一组测量就「变脸」，就是分布外警报

**论文**：Towards Distribution-Shift Uncertainty Estimation for Inverse Problems with Generative Priors，Namhoon Kim、Sara Fridovich-Keil（Georgia Institute of Technology）；IEEE CAMSAP 2025，pp. 291–295，DOI 10.1109/CAMSAP66162.2025.11423986；arXiv:2510.10947（2025-10-13）
**定位**：免校准、实例级的分布外指示器——同一物体换随机测量子集重建，重建之间的像素方差越大越可疑；先验是学习近端网络 LPN（**不是扩散模型**），实验是 MNIST 稀疏视角 CT 玩具规模
**精读核验**：2026-11-22 依 arXiv abs 页与 HTML v1 全文（4 页，§I–V，Fig. 1–4）通读；会议信息经 Crossref（DOI 10.1109/CAMSAP66162.2025.11423986，CAMSAP 2025，pp. 291–295）核对。官方代码 `voilalab/uncertainty_quantification_LPN` 同日经 GitHub API 核对：有完整实现、数据与 3.8 MB 预训练权重，但**本站未下载、未运行、未复现**；本页无自跑数字，所有数值均引自论文或标注为读图。

## 原文摘要

> Generative models have shown strong potential as data-driven priors for solving inverse problems such as reconstructing medical images from undersampled measurements. While these priors improve reconstruction quality with fewer measurements, they risk hallucinating features when test images lie outside the training distribution. Existing uncertainty quantification methods in this setting (i) require an in-distribution calibration dataset, which may not be available, (ii) provide heuristic rather than statistical estimates, or (iii) quantify uncertainty from model capacity or limited measurements rather than distribution shift. We propose an instance-level, calibration-free uncertainty indicator that is sensitive to distribution shift, requires no knowledge of the training distribution, and incurs no retraining cost. Our key hypothesis is that reconstructions of in-distribution images remain stable under random measurement variations, while reconstructions of out-of-distribution (OOD) images exhibit greater instability. We use this stability as a proxy for detecting distribution shift. Our proposed OOD indicator is efficiently computable for any computational imaging inverse problem; we demonstrate it on tomographic reconstruction of MNIST digits, where a learned proximal network trained only on digit "0" is evaluated on all ten digits. Reconstructions of OOD digits show higher variability and correspondingly higher reconstruction error, validating this indicator. These results suggest a deployment strategy that pairs generative priors with lightweight guardrails, enabling aggressive measurement reduction for in-distribution cases while automatically warning when priors are applied out of distribution.

*来源：arXiv:2510.10947 摘要页，逐字保留（与 PDF 版措辞略有差异，此处以 abs 页为准）。*

## 中文摘要

> 生成模型作为数据驱动先验，在从欠采样测量重建医学图像等逆问题中展现出很强潜力。这类先验能在更少测量下提升重建质量，但当事物落在训练分布之外时，它们有幻觉出并不存在的特征的风险。该场景下现有的不确定性量化方法：(i) 需要同分布的校准数据集，而这未必可得；(ii) 给出的是启发式而非统计意义上的估计；(iii) 量化的是模型容量或测量有限带来的不确定性，而不是分布偏移带来的不确定性。我们提出一个实例级、免校准的不确定性指标：对分布偏移敏感，不需要关于训练分布的先验知识，也不带来重训练开销。我们的核心假设是：同分布图像的重建在随机测量变化下保持稳定，而分布外（OOD）图像的重建则表现出更大的不稳定性；我们把这种稳定性当作检测分布偏移的代理信号。该 OOD 指标对任意计算成像逆问题都可高效计算；我们在 MNIST 数字的断层重建上做了验证——一个只在数字「0」上训练的学习近端网络，被用于全部十个数字的评估。OOD 数字的重建表现出更高的变异性，并对应更高的重建误差，从而验证了该指标。这些结果提示一种部署策略：把生成式先验与轻量护栏配对，对同分布情形激进地减少测量，而在先验被用于分布外时自动报警。

*译文：逐句对译上方摘要，未增删、未压缩；数字与专有名词以英文原文为准。*

## 1. 三分钟摘要与推荐理由

一句话：**不用真值、不用校准集，把「同一张图、换几组随机投影、重建结果彼此有多不一致」当作分布外报警器。**

读它的理由不是方法多强（实验只有 MNIST），而是它把「幻觉风险」和「可观测的稳定性」直接连起来，做法便宜到任何成像逆问题都能照抄：

1. **信号来源是测量子采样，不是采样随机性**：固定扫描得到的一组投影，多次随机抽取子集分别重建，算逐像素标准差。它测量的是「先验把不同测量子集拉向同一个答案」的程度，因此天然是实例级的。
2. **成本结构对部署友好**：无重训练、无外部校准集，代价只是同一张图多重建几次；作者主张据此做「先验失效就多采几个角度」的闭环。
3. **对幻觉研究的价值（本页判断）**：这正是「分布外时才出现的结构化错填」的一个可操作代理——先验只认识「0」，画 1–9 时它要么补成 0 的笔画，要么随测量子集漂移，方差因此升高。它与「同一模型多次随机采样的自不确定性」不同，后者在本站的病理修复幻觉实验里相对"只看输出计数"的基线几乎没带来增益；这里的扰动源是**测量**，可能更贴近「先验过度自信」的失效方式，但本文没有做与采样型不确定性的对照。

要打的折扣：4 页 workshop 短文，没有 ROC/AUROC、没有阈值选取、没有逐图检出率；作者自己在 §V 承认噪声更大的同分布图会被误报，且「OOD 部分不影响测量」时完全看不见。

## 2. 问题及研究位置

- **问题**：稀疏视角 CT 等严重欠采样逆问题里，数据驱动先验（扩散、LPN、展开网络）能把测量缺口填得「看起来很合理」；但当被测对象不在先验训练分布内（新扫描仪、不同人群、罕见病理），填进去的就是幻觉。部署方需要知道**这一次**的重建可不可信。
- **已有路线的缺口**：共形预测要新分布上的校准集（首次遇到 OOD 时没有）；bootstrap / 物理代理方法继承代理模型的偏差，且无有效性保证；MCMC / 集成量化的是「测量不足」或「权重不确定性」，全体集成共享训练数据，遇到 OOD 会一起失效。
- **本文的位置**：不做新的后验采样，也不建统计保证，只提出一个**免校准的启发式指示器**，并给出一个小规模经验验证。它把自己定位成「护栏」而非「误差棒」——原文反复用 indicator / proxy / guardrail，而不是 confidence interval。

## 3. 核心方法和数据流

```text
训练（一次性，与部署无关）：
  仅用 MNIST 数字「0」的图像 → 近端匹配损失 L_PM 训练 LPN f_θ = ∇_z ψ_θ
  （ψ_θ 为输入凸网络；f_θ 充当隐式正则 R_θ 的近端算子）

部署（对每一张待重建的图）：
  真实/模拟测量 y = A x* + ε，A 为 fan-beam Radon，探测器 22 像素
  for s = 1..S（本文 S = 10，不同随机种子）：
      从可用投影角度中随机取 N_view ∈ {11, 22, 33} 个子集 → y_s
      x_s ← 近端梯度迭代 x^(k+1) = f_θ( x^(k) − η_k Aᵀ(A x^(k) − y_s) )
  输出：
      x̄ = mean_s x_s
      U(x) = mean over pixels of std_s x_s     ← 本文的 OOD 指标
  判读：U 高 → 疑似分布外，建议补测量或换保守重建
```

三个要点：

1. **先验不是扩散模型**。LPN 学一个输入凸网络 ψ_θ，把它的梯度当近端算子用；训练目标是近端匹配损失（式 2），γ→0 时逼近 MAP 去噪器。因此它没有随机采样过程，"不确定性"只能从外部扰动造出来——这正是本文方法的动机，也是它与 [DDS](../mri/20-dds.md)、[SCD](../mri/31-scd.md) 一类扩散方法最本质的差别。
2. **指标是像素方差的均值**，不是校准过的概率。它随测量数、噪声水平、先验强度一起变，跨设定不可比；本文的所有比较都是同一设定下的跨数字比较。
3. **"稳定性 ⇒ 正确性"是假设不是定理**：作者只在 MNIST 上展示「方差高的数字 PSNR 也低」这一相关性，且是群体层面的平均，不是逐图检验。

## 4. 论文证据与实验范围

**实验设定（§III，均为论文原文数字）**：图像 28×28 MNIST，像素值 [0,1]；fan-beam CT，**22 像素探测器**；测量噪声 σ=2（各向同性零均值高斯）；投影预算 N_view ∈ {11, 22, 33}，三者都欠定；每个预算重复 10 个随机种子；每个数字随机取 10 张未参与训练的图，共 **100 张**；指标为 PSNR / SSIM 与逐像素标准差。

**论文没有数值表格**，全部定量证据在 Fig. 2–4：

- **Fig. 2**：逐数字平均 PSNR/SSIM（10 图 × 10 种子），误差棒为 min–max。结论是 LPN 全面优于无正则 FBP，且优势在数字「0」最大、视角越少越明显。读图：PSNR 纵轴约 4–16 dB，SSIM 约 0–0.8；11 视角下 LPN 在「0」上明显高于其余数字，随视角增加到 33 时差距收窄（**本页读图，非论文给出的表值**）。
- **Fig. 3**：(a) 每数字每预算的 10 次重建均值图；(b) 同一批重建的逐像素标准差热图。定性上「0」的均值图跨种子几乎重合，OOD 数字的笔画位置随种子漂移、标准差热图更亮。
- **Fig. 4**：逐数字平均逐像素标准差，纵轴约 0.05–0.10。数字「0」最低，其余数字更高；论文称该差距在 11 视角（最欠采样、最依赖先验）时最明显（**本页读图**）。
- 论文还强调：即便 OOD，LPN 仍优于 FBP——即「先验仍有帮助」和「先验在幻觉」可以同时成立，这正是需要护栏而非直接弃用先验的理由。

**范围限制（作者自述）**：单一玩具设定（MNIST 断层）、单一先验类型（LPN）、单一前向模型（2D fan-beam）、无真实临床数据、无扩散先验实验；作者把「换更多数据集、换扩散先验、做统计有效性分析」都列为未来工作。

## 5. 复现与审计重点

**仓库里实际有什么**（2026-11-22 核对 `voilalab/uncertainty_quantification_LPN`，Apache-2.0，Jupyter Notebook 为主）：

- 完整 LPN 实现：`lpn/`（networks、operators、datasets、train.py、evaluate_prior*.py、inverse_celeba.py）。
- MNIST-CT 实验：`exps/mayoct/train_mnist.sh`、`inverse_mayoct_tomo.py`、`inverse_mayoct_cs.py`、`configs/`；根目录 `run.sh` / `run_ct.sh` 分别训练先验与跑 10 个种子的重建。
- **预训练权重随仓库提供**：`exps/mayoct/models_mnist/lpn/s=0.1_noAug_1_7890/model.pt`（约 3.8 MB）与 `model_config.json`；另有 `prior_idood_noAug_1_1234/` 下按 σ 扫描的先验缓存（`fy.npy`、`prior.csv`）。
- 数据：`data/mayoct/mnist`，含 `only0`（同分布训练子集）与 `idood_valid`（文件名自带数字标签，可直接做逐数字统计）。
- `evaluate_ct.ipynb`（约 1.4 MB，含已保存输出），README 明确说「所有预训练模型与结果都在仓库里，可不重训直接跑」。
- 它是在 `zhenghanfang/learned-proximal-networks`（ICLR 2024 LPN 官方实现）上的扩展；README 明说务必参考原仓库。

**审计要点**：

1. **没有检出性能指标**。全是「按数字平均的方差 vs 按数字平均的 PSNR」，没有一个逐图 AUC / TPR@FPR，也没有阈值怎么定。要把它当护栏用，必须先回答「阈值多少、误报率多少」。
2. **混淆因素未拆**：方差同时随噪声、视角数、先验强度变化。σ=2 固定、视角数分档，但没做「同分布但更噪」的对照——作者自己在 §V 承认这会误报。
3. **不可见偏移**：若 OOD 区域不进入测量（前向模型与偏移相关），指标原理上失效；放射场景里「病灶不在视野/不影响投影」并不罕见。
4. **尺度**：28×28、22 像素探测器、100 张图，任何结论外推到临床都属过度阅读；论文措辞（preliminary, toy）也承认这点。
5. **与扩散先验的可迁移性未知**：扩散采样本身随机，"换测量子集"与"换噪声种子"两种扰动会纠缠，方差信号可能被采样噪声主导。这是本页判断，论文未讨论。

## 6. 建议阅读顺序

摘要 → §I 最后三段（假设 + 部署闭环）→ §II-C 式 (1)(2)（LPN 是什么）→ §III 实验设定（22 像素、σ=2、11/22/33 视角、10×10）→ Fig. 2（先验仍有用）→ Fig. 3(b)（方差热图）→ Fig. 4（跨数字方差）→ §V limitations（三条失效场景）→ 仓库 README 与 `evaluate_ct.ipynb` 的输出。

## 7. 前后关联

- [31 SCD](../mri/31-scd.md)：同样针对分布外幻觉，但路线相反——SCD 用测量做**测试时适配**把先验拉回来，本文不改模型只用**方差报警**。两篇可拼成「报警 + 修复」的完整闭环；SCD 的 CT 复现里 Ellipses→AAPM 没复现出论文优势，恰好说明「什么时候该报警」比「怎么适配」更值得先问。
- [20 DDS](../mri/20-dds.md)：扩散后验采样能给出样本集合，但其离散度主要是采样噪声，不是分布偏移；本文的测量子采样扰动是另一种、更"物理"的扰动源，两者可做互补信号。
- [06 Score-MRI](../mri/06-score-mri.md)：用分数模型的后验采样做不确定性，量化的是测量不足；本文明确指出这条路线「量化错了不确定性来源」，可作为读 06 时的对照批评。
- [15 BiasRecon](../mri/15-biasrecon.md)：从「偏差/幻觉来自先验与测量的相互作用」角度建模；本文给的是不建模、只观测的轻量替代。
- [11 HalluGen](11-hallugen.md)：提供带标注的合成幻觉做**评测**；本文提供无标注的**在线告警**，两者分别对应「事后审计」与「部署护栏」。
- [21 KLIP](21-klip.md)、[22 测量域 KL 偏移检测](22-meas-kl.md)：都在找分布偏移的可观测信号；KLIP 在隐空间、22 在测量域，本文在**重建结果的离散度**，三条信号源正好构成一张对照表。
- [24 弱先验](24-weak-priors.md)：讨论先验能力不足时的行为；本文的 OOD 方差可视为"先验在错误方向上过度自信"的一种外显。

## 8. 链接

- [arXiv:2510.10947](https://arxiv.org/abs/2510.10947)
- [arXiv HTML v1 全文](https://arxiv.org/html/2510.10947v1)
- [IEEE Xplore 记录（DOI 10.1109/CAMSAP66162.2025.11423986）](https://doi.org/10.1109/CAMSAP66162.2025.11423986)
- [CAMSAP 2025 日程页（T2.R1.1）](https://cmsworkshops.com/CAMSAP2025/view_paper.php?PaperNum=1109)
- [官方代码 voilalab/uncertainty_quantification_LPN](https://github.com/voilalab/uncertainty_quantification_LPN)
- [所依赖的 LPN 原始实现 zhenghanfang/learned-proximal-networks](https://github.com/zhenghanfang/learned-proximal-networks)
