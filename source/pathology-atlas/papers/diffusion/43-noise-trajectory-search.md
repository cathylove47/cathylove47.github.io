# 43｜Noise Trajectory Search：不添去噪步，改噪声轨迹；ε-greedy 让扩散「想清楚再走」

**论文**：Test-Time Scaling of Diffusion Models via Noise Trajectory Search，Vignav Ramesh、Morteza Mardani（Stanford University、NVIDIA）；NeurIPS 2025；arXiv:2506.03164（v1 2025-06，v2）
**定位**：扩散模型的测试时扩展（test-time scaling）；把反向采样看成对「每步注入的噪声向量」的搜索问题，先形式化为终端奖励的 MDP、说明 MCTS 有理论意义但太贵，再松弛为逐步 contextual bandit，用 ε-greedy 零阶搜索在极早/极晚步全局探索、在去混叠的中间步局部爬山
**精读核验**：2026-11-22 依 arXiv HTML v2 全文逐节读过：§1–4.4（MDP、MCTS、contextual bandit、ε-greedy 与 Algorithm 1）、§5.1–5.2 与 Table 1–2、Figure 1–2，以及附录 C（基线）、D（理论）、E–H（NFE 公式、超参/奖励/尺度扫描、定性图；附录逐表粗读）。官方代码 `rvignav/diffusion-tts` 同日经 GitHub 页面核对，含 `main.py`、`edm/`（EDM 采样器与 ImageNet 分类器）、`rewards/`、`scripts/`，是真实实现。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：见 [推理走查记录](/pathology-atlas/learning/infer-noise-trajectory-search.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> The iterative and stochastic nature of diffusion models enables test-time scaling, whereby spending additional compute during denoising generates higher-fidelity samples. Increasing the number of denoising steps is the primary scaling axis, but this yields quickly diminishing returns. Instead optimizing the noise trajectory--the sequence of injected noise vectors--is promising, as the specific noise realizations critically affect sample quality; but this is challenging due to a high-dimensional search space, complex noise-outcome interactions, and costly trajectory evaluations. We address this by first casting diffusion as a Markov Decision Process (MDP) with a terminal reward, showing tree-search methods such as Monte Carlo tree search (MCTS) to be meaningful but impractical. To balance performance and efficiency, we then resort to a relaxation of MDP, where we view denoising as a sequence of independent contextual bandits. This allows us to introduce an $\epsilon$-greedy search algorithm that globally explores at extreme timesteps and locally exploits during the intermediate steps where de-mixing occurs. Experiments on EDM and Stable Diffusion reveal state-of-the-art scores for class-conditioned/text-to-image generation, exceeding baselines by up to $164\%$ and matching/exceeding MCTS performance. To our knowledge, this is the first practical method for test-time noise trajectory optimization of arbitrary (non-differentiable) rewards.

*来源：arXiv:2506.03164v2 摘要（NeurIPS 2025 版，与 proceedings 版一致）。*

## 中文摘要

> 扩散模型迭代、随机的特性使其具备测试时扩展能力：在去噪过程中投入更多算力，可以生成更高保真的样本。增加去噪步数是主要的扩展轴，但收益很快递减。相比之下，优化噪声轨迹——即每一步注入的噪声向量序列——更有前景，因为具体的噪声实现会严重影响样本质量；但这很难，原因是搜索空间维度极高、噪声与结果之间的相互作用复杂、且评估整条轨迹代价高昂。我们首先把扩散建模为带终端奖励的马尔可夫决策过程（MDP），说明蒙特卡洛树搜索（MCTS）这类树搜索方法有意义但不实用。为平衡性能与效率，我们退而求其次，把 MDP 松弛为「每一步是独立的上下文多臂老虎机」的序列。由此我们提出一种 ε-greedy 搜索算法：在极端时间步上做全局探索，在发生去混叠（de-mixing）的中间步上做局部利用。在 EDM 与 Stable Diffusion 上的实验显示，该方法在类条件/文生图生成上取得当前最优分数，超过基线最多 164%，并达到或超过 MCTS 的表现。据我们所知，这是第一个可实用的、针对任意（不可微）奖励的扩散噪声轨迹测试时优化方法。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**扩散采样的随机性是「资源」不是「噪声」：与其加去噪步，不如在每一步挑一组更好的注入噪声；用 ε 概率从先验全局抽、1−ε 概率在枢轴附近爬山，就能把任意不可微奖励（分类器概率、CLIP、亮度、压缩率）最大化。**

三件值得读的事：

1. **问题被形式化得很干净**：状态 s_t=(c,x_t,t)、动作 a_t=z_t（该步注入的噪声）、转移是采样器一步、奖励只在 x_0 给一次。于是「找最优噪声轨迹」就是 max_Z r(x_0(Z,c,x_T),c)（式 3）。MCTS 在固定候选树上是穷举的近似，但 NFE 随步数平方增长，而且只能在预先抽好的 N 个候选里搜索。
2. **ε-greedy 的关键不是「贪心」而是「混合」**：候选分布是 ε·N(0,σ_t²I) + (1−ε)·N(p, 2λ²dI)。纯零阶搜索（ε=0）只在枢轴周围半径 λ√(2d) 的球里爬，K 次迭代的期望位移只有 Kλ√(d/2)，枢轴若落在「好噪声区域」外就永远出不来；ε>0 允许偶发全局跳跃。Table 1 里零阶搜索（0.6261）甚至输给 MCTS（0.9666），而 ε-greedy 到 0.9885，说明「偶尔跳出去」是决定性的一步。
3. **「什么时候搜」也被解释了**：Figure 2 左统计随机先验候选被选中的平均局部迭代位置，Figure 2 右估计奖励对 x_t 的 Lipschitz 常数，二者共同说明极端时间步的奖励面近乎平坦（爬山无益），中间步（去混叠发生处）才需要局部精修。这给「ε 在两端、1−ε 在中间」一个可检验的机制解释，而不是纯调参。

**关于它证明了什么（本页判断）**：Table 1 的 EDM 数字是 36 张图×随机类别的平均奖励，MCTS 的 NFE（3888）是 ε-greedy（1440）的 2.7 倍却更低分；这说明「搜索空间比搜索树更重要」。但也要注意奖励就是评测指标本身（用分类器概率做奖励、又用分类器概率评测），因此 Table 1 不能当作「图像质量」证据；论文另用 brightness/compressibility 这类与分类器无关的奖励（Table 1），方向一致，但仍不是人类/分布层面的质量评估。

## 2. 问题及研究位置

扩散采样 x_T→x_0 的每一步都注入新噪声；EDM 的随机采样器（S_churn>0）尤其如此。噪声实现不同，最终样本质量差异很大（同一 latent、同一类别，分类器得分可从 0.17 到 0.65）。已有扩展手段：

- **加去噪步**：几十步后饱和（EDM/SD 的已知现象）。
- **重采样/拒绝采样**：从整条轨迹里挑最好的，但只看到极少数轨迹。
- **beam search**：每步按 Tweedie 估计的奖励贪心选候选，忽略跨步交互。
- **MCTS**：在固定候选树上近似穷举，效果好但 NFE 高、且不能离开预抽候选。
- **零阶搜索（Ma et al., 2025）**：只优化初始噪声（ODE 采样），不覆盖 SDE 全轨迹。
- **本文**：把整个噪声轨迹当决策变量，在 bandit 松弛下做 ε-greedy 零阶搜索，覆盖 SDE 采样器、支持任意不可微奖励。

## 3. 核心方法和数据流

```text
输入：采样器 f（如 EDM 随机采样器）、去噪网络 D_θ、上下文 c、奖励 r、初始 x_T
for t = T … 1:
    p ~ N(0, σ_t² I)                         # 枢轴
    for k = 1 … K:
        for i = 1 … N:
            with prob ε:  z_i ~ N(0, σ_t² I)          # 全局探索
            else:         z_i = u·√(2d)·z + p,  z~N(0,I), u~Unif(0,λ)   # 局部利用
        用 Tweedie 估计 x̂_0^(t)(z_i) 打分 r(x̂_0^(t), c)
        p ← 得分最高的 z_i
    x_{t−1} = f(x_t, t, c, p)                # 用选中的噪声走一步
输出：x_0
```

三个要点：

1. **打分用 Tweedie 而不是真样本**：每步的奖励在 x̂_0^(t)=E[x_0|x_t,z_t,c] 上算，不必把整条轨迹跑完，这是它能承受 N×K 次评估的原因；代价是奖励估计有偏（bandit 松弛本身也忽略了跨步依赖）。
2. **λ 与 ε 是仅有的两个旋钮**：λ 控制局部步长（相对 √(2d) 归一化），附录扫描显示 λ∈[0.1,0.2] 最优、过大时候选被退化噪声淹没；ε 扫描给出最优约 0.4（Figure 5 中/右）。
3. **NFE 可算**：naive 18；best-of-4 72；beam 144；零阶与 ε-greedy 都是 T·(N·K+1) 量级（Table 1 给 1440，T=18、N=4、K=20）；MCTS 3888（Table 3 给公式）。

## 4. 论文证据与实验范围

**EDM（ImageNet-64 条件 ADM，18 步，CFG=1.0，36 张图/随机类别，Table 1）**：

| 方法 | Brightness | Compressibility | Classifier | NFE |
|---|---|---|---|---|
| Naive | 0.4965 | 0.3563 | 0.3778 | 18 |
| Best-of-4 | 0.5767 | 0.4220 | 0.5461 | 72 |
| Beam (N=4,B=2) | 0.6334 | 0.4679 | 0.5536 | 144 |
| MCTS (N=4,S=8) | 0.7575 | 0.5395 | 0.9666 | 3888 |
| Zero-order (N=4,K=20) | 0.6083 | 0.3751 | 0.6261 | 1440 |
| **ε-greedy (N=4,K=20)** | **0.9813** | **0.7208** | **0.9885** | 1440 |

**Stable Diffusion v1.5（512²，T=50，CFG=7.5，20 次/提示，Table 2）**：naive 0.4800/0.6314/0.2457（brightness/compressibility/CLIP），ε-greedy **0.7110/0.8052/0.2973**，比 naive 提升 48%/26%/20%，比 MCTS（0.6077/0.7322/0.2885）最高再高 18%。耗时：naive 约 1 s/张，MCTS < 2 min/张（A100 40GB）。

**扩展实验（附录）**：附录 F 给出 classifier reward on Tweedie vs noisy latents；附录 G 扫描 N 与期望 K（ε-greedy 的 scaling law 最好，但因贪心局部选择呈非单调）；附录 H 给 SDXL+ImageReward、CFG 扫描、T 扫描与定性图。

**范围限制（本页判断）**：评测奖励与优化奖励同源（分类器/CLIP/亮度/压缩率），没有 FID 或人类评估，所以「更高质量」只能读成「更符合指定奖励」；EDM 只 36 张图、随机类别，方差大（Table 1 有 ±0.03–0.04）；SD 实验只 20 次/提示；ε-greedy 的收益依赖 N、K、λ 的联合调参，论文虽给了扫描，但跨模型迁移是否稳定未系统验证（SD 直接沿用 EDM 的最优超参）。

## 5. 复现与审计重点

- **仓库结构**：`main.py` 是统一入口（`--backend edm|sd`、`--method naive|eps_greedy|mcts|beam|zero_order|rejection`、`--scorer imagenet|clip|brightness|compressibility`）；`edm/` 是 EDM 采样器与 OpenAI ADM 分类器；`rewards/` 是各奖励实现；`scripts/` 是论文表格的复跑脚本。
- **权重**：EDM ImageNet-64 条件模型 `edm-imagenet-64x64-cond-adm.pkl`（NVIDIA 公开 CDN，1.18 GB）+ OpenAI 64×64 分类器 `64x64_classifier.pt`（261 MB，代码硬编码存到 `~/.cache/imagenet_classifier`）。SD backend 需 runwayml/stable-diffusion-v1-5 全套权重。
- **代码坑（走查实测）**：`edm/main.py:13` 在 import 时无条件 `os.environ["CUDA_VISIBLE_DEVICES"]="0"`，会覆盖外层指定卡，需改 `setdefault`；`main.py` 在抽 latent 与类别之后才 seed，导致 naive 与 ε-greedy 两次运行拿到不同类别/不同初始噪声，无法对比，需在抽样前 `torch.manual_seed`；`environment.yml` 钉 torch 1.12.1（CUDA 11.3，不支持 sm_89），4090 上必须换 torch 2.x。超参（N=4、K=20、ε=0.4、λ=0.15、S=8、18 步）未改。
- **走查（小样本，非论文指标）**：EDM backend、ImageNet 类 207（golden retriever）、seed 0/1/2、同一 latent 同一类别。分类器奖励：naive **0.6487 / 0.4775 / 0.1700（均值 0.432）**，ε-greedy **0.9975 / 0.9989 / 0.9978（均值 0.998）**。naive 与 ε-greedy 的像素 PSNR 仅 9.26/9.11/6.58 dB（同 latent，只有噪声轨迹不同）。耗时：naive 18 步约 1.5 s，ε-greedy 每步 7–9 s、18 步约 150 s（每步 80 次网络评估）；峰值显存 2018 MiB。方向与论文一致，幅度更大；naive 的 seed 间波动（0.17–0.65）也复现了论文「单次噪声实现强烈影响质量」的动机。
- **审计要点**：Table 1 的「每个值 = 36 张图平均」样本量很小，引用时要带误差棒；NFE 公式（Table 3）里 ε-greedy 与零阶搜索相同（都是 T·(NK+1)），差别只在候选分布，这一点常被误读为「多了搜索开销」；SD 的 T=50 而 EDM 是 18，跨模型的 NFE 不能直接比。
- **没跑的部分**：SD backend（需数 GB 权重）、MCTS/beam/zero_order/rejection 基线、论文规模的 FID 与大批量分类器分数。

## 6. 建议阅读顺序

摘要 → §3.2 MDP 与 contextual bandit 的定义 → §4.1 式 (3)（终端奖励 MDP）→ §4.2 MCTS 的 NFE 与固定树限制 → §4.3 bandit 松弛与 Tweedie 打分 → §4.4 Algorithm 1 与混合分布公式 → §5.1 Table 1（先看零阶 vs ε-greedy 的差）→ Figure 2（为什么中间步才爬山）→ §5.2 Table 2 → 附录 D（理论直觉）→ 附录 G（scaling law 与 N/K 扫描）。

## 7. 前后关联

- 与 [05 号 EDM](../diffusion/05-edm.md) 直接相关：本文的 EDM 实验就是 EDM 随机采样器（S_churn=40、S_min=0.05、S_max=50、S_noise=1.003），说明 EDM 的「噪声注入」不只是数值稳定手段，而是可优化的自由度。
- 与 [03 号 DDIM](../diffusion/03-ddim.md)、[04 号 Score SDE](../diffusion/04-score-sde.md) 的对照：DDIM 是确定性（无噪声可搜），Score SDE 才提供逐噪声轨迹；本文因此只对 SDE/随机采样器有效。
- 与 [25 号 ReSample](25-resample.md) 是两种「测试时改采样轨迹」的思路：ReSample 用测量一致性硬投影轨迹，本文用奖励搜索挑噪声；前者有观测约束，后者只有终端奖励，因而本文能用于纯生成任务。
- 与 [10 号 Consistency Models](../diffusion/10-consistency-models.md)、[12 号 MeanFlow](../diffusion/12-meanflow.md) 的「少步生成」互补：那些方法压步数，本文在固定步数上换搜索预算，二者可以叠加（论文的 NFE 分析也提示搜索预算与步数是两个正交轴）。
- 与 [44 号 GenSCO](44-gensco.md) 是同一思想在离散解空间的镜像：GenSCO 把「生成」当搜索算子、用 cycles 换质量；本文把「噪声」当搜索变量、用 N×K 换质量。两篇都主张「加步数饱和，换一个维度花算力」。

## 8. 链接

- [arXiv:2506.03164（abs）](https://arxiv.org/abs/2506.03164)
- [arXiv HTML v2 全文](https://arxiv.org/html/2506.03164v2)
- [NeurIPS 2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/7e62167d35d1e830fd6afe5c899ed124-Abstract-Conference.html)
- [官方代码 rvignav/diffusion-tts](https://github.com/rvignav/diffusion-tts)
- [EDM 预训练权重（NVIDIA CDN）](https://nvlabs-fi-cdn.nvidia.com/edm/pretrained/)
