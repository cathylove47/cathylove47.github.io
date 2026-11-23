# 44｜GenSCO：把扩散采样当成搜索算子，用「破坏—重建」循环换解质量

**论文**：Generation as Search Operator for Test-Time Scaling of Diffusion-based Combinatorial Optimization，Yang Li、Lvda Chen、Haonan Wang、Runzhong Wang、Junchi Yan（上海交通大学、MIT）；NeurIPS 2025；OpenReview `9JM03CQwzC`，proceedings hash `b8e9869f…9a20c`（无 arXiv 版）
**定位**：扩散求解组合优化（CO）的推理期扩展；不再加去噪步，而是把「生成」当搜索算子——每轮先用随机局部搜索破坏当前解，再用 rectified flow 把次优解「流」回最优附近，循环 C 次；配套 solution-to-solution 训练与只处理节点嵌入的轻量 Transformer
**精读核验**：2026-11-22 依 NeurIPS 2025 正式版 PDF（proceedings `b8e9869f…9a20c`）全文逐节读过：§1–4.2（式 (2)–(6)、Algorithm 1）、§5.1–5.3 与 Table 1–5、Figure 1–2，以及附录的架构/步数/训练监督消融（Table 7–13，粗读）。官方代码 `Thinklab-SJTU/GenSCO` 同日经 GitHub 页面核对，含 `decoding/tsp.py`、`lib/`（C++ 局部搜索接口）、`scripts/eval/tsp100.sh`、`install.sh`，是真实 JAX 实现。**本站做过推理走查（小样本，用作者权重，非论文指标复现）**：见 [推理走查记录](/pathology-atlas/learning/infer-gensco.html)。除走查数字外，本页数字全为论文报告值。

## 原文摘要

> While diffusion models have shown promise for combinatorial optimization (CO), their inference-time scaling cost-efficiency remains relatively underexplored. Existing methods improve solution quality by increasing denoising steps, but the performance often becomes saturated quickly. This paper proposes GenSCO to systematically scale diffusion solvers by an orthogonal dimension of inference-time computation beyond denoising step expansion, i.e., search-driven generation. GenSCO takes generation as a search operator rather than a complete solving process, where each operator cycle combines solution disruption (via local search operators) and diffusion sampling, enabling iterative exploration of the learned solution space. Rather than over-refining current solutions, this paradigm encourages the model to leave local optima and explore a broader area of the solution space, ensuring a more consistent scaling effect. The search loop is supported by a search-friendly solution-enhancement training procedure that incorporates a rectified flow model learning to establish diffusion trajectories between suboptimal solutions and the optimal ones. The flow model is empowered by a lightweight transformer architecture to learn neural ODEs that linearize solution trajectories, accelerating convergence of the scaling effect with efficiency. The resulting enhanced scaling efficiency and practical scalability lead to synergistic performance improvements. Extensive experiments show that GenSCO delivers performance improvements by orders of magnitude over previous state-of-the-art neural methods. Notably, GenSCO even achieves significant speedups compared to the state-of-the-art classic mathematical solver LKH3, delivering a 141x speedup to reach 0.000% optimality gap on TSP-100, and approximately a 10x speedup to reach 0.02% on TSP-500.

*来源：NeurIPS 2025 proceedings 摘要页（hash `b8e9869f…9a20c`，DOI 10.52202/085713-4237）。*

## 中文摘要

> 扩散模型在组合优化（CO）上已显示出潜力，但其推理期扩展的性价比仍研究不足。现有方法通过增加去噪步数提升解质量，但性能往往很快饱和。本文提出 GenSCO，用去噪步扩展之外的一个正交推理算力维度——搜索驱动的生成——来系统性地扩展扩散求解器。GenSCO 把生成当作搜索算子而非完整求解过程：每个算子循环把「解的破坏」（通过局部搜索算子）与扩散采样结合起来，从而迭代地探索学到的解空间。该范式不是过度精修当前解，而是鼓励模型离开局部最优、探索更广阔的解空间，从而获得更一致的扩展效果。搜索循环由一个「对搜索友好」的解增强训练过程支撑：它用 rectified flow 模型学习从次优解到最优解之间的扩散轨迹。该流模型由轻量 Transformer 架构承载，学习把解轨迹线性化的神经常微分方程，从而以高效率加速扩展效果的收敛。由此带来的扩展效率与实际可扩展性形成协同提升。大量实验表明，GenSCO 相对此前最优的神经方法带来数量级的性能提升。值得注意的是，GenSCO 甚至相对经典数学求解器 LKH3 也显著加速：在 TSP-100 上达到 0.000% 最优间隙的加速比为 141×，在 TSP-500 上达到 0.02% 的加速比约 10×。

*译文：对应上方英文摘要逐句对译，未增删内容；专有名词保留原文。*

## 1. 三分钟摘要与推荐理由

一句话：**GenSCO 把「一次生成一个解」改成「反复破坏再重建」：随机 2-opt 把当前巡回打散，rectified flow 用 4 步 ODE 把它拉回最优附近，循环 C 次取最好解——算力花在搜索循环上，而不是去噪步上。**

三件值得读的事：

1. **训练目标被改写成 solution-to-solution**：常规扩散 CO（DIFUSCO、T2T）从高斯噪声生成解热图；GenSCO 的源分布是「被局部搜索破坏过的次优解」，目标是最优解，直线插值 x_t = t·x_subopt + (1−t)·x_opt，网络学速度场 v_θ(x_t,t,G)（式 3–4），等价于直接预测最优解 f_θ。这样模型天然具备「增强当前解」的能力，且起点可控（破坏强度决定探索范围）。
2. **直线流让 4 步就够**：rectified flow 的轨迹接近直线，Euler 积分 4 步（N_τ=4，TSP/MIS/MCl 多数实验）即可；再配上只处理节点嵌入的 Transformer（边热图用 h hᵀ 内积，式 6 在注意力 logits 上加 λA 编码邻接），单次算子调用便宜，才能在一个时间预算里跑几十到几千个 cycles。
3. **「搜索算子」有可验证的 scaling**：Table 1 里 TSP-100 用 C=10 就在 6 s 内到 0.000%，LKH-3 要 14.1 min；TSP-500/1000 上 C 从 10 加到 160（含 2-opt 后处理），gap 单调下降（TSP-500 0.023%→0.010%，TSP-1000 0.559%→0.036%）。Figure 2 把「加去噪步」「加梯度步」「加 cycles」三条曲线画在一起，说明只有 cycles 这条不饱和。

**关于它证明了什么（本页判断）**：这是「神经求解器在特定规模/时间预算内追上甚至超过 LKH-3」的强结果，但要注意论文自己承认 LKH-3 的 scaling 斜率更陡、更大规模最终会反超；Table 2 的跨规模泛化也显示，在差异大的分布间（如 TSP-50↔TSP-1000）gap 会明显变差。因此「141× 加速」是「到 0.000% 这一精度点的时间比」，不是「任意精度下都快 141 倍」。

## 2. 问题及研究位置

CO（TSP、MIS、最大团 MCl）要在离散、受约束的空间里找最优解。神经求解器把解建模成热图/序列，扩散模型通过多步去噪提高单轮预测精度；但去噪步加到一定程度就饱和——瓶颈不是时间离散精度，而是模型在高维约束空间里的导航能力。

已有位置：

- **自回归/RL 求解器**：AM、POMO、DIMES，靠采样/主动搜索提升，但不在扩散框架内。
- **扩散求解器**：DIFUSCO（离散扩散 + 热图）、T2T（扩散 + 梯度引导搜索）。它们靠加去噪步或梯度步扩展，前者饱和、后者每步都要对目标求梯度，代价高。
- **破坏—重建启发式**：经典 LKH、2-opt 等局部搜索本身就是「破坏再修复」，但没有学习到的生成先验。
- **本文**：把「局部搜索的破坏」与「学到的生成式修复」合成一个算子，并把扩散模型从 noise-to-solution 改成 solution-to-solution，专门为反复调用设计。

## 3. 核心方法和数据流

```text
训练（离线）：
  x_opt ~ π0（Concorde/LKH 参考解）
  x_subopt ~ π1：对 x_opt 做 N/4…3N/4 次随机 2-opt（TSP）或翻转 25–40% 的 1 变量（MIS/MCl）
  x_t = t·x_subopt + (1−t)·x_opt,  t∈[0,1]
  L(θ) = E‖v_θ(x_t,t,G) − (x_subopt − x_opt)‖²，其中 v_θ = x_subopt − f_θ(x_t,t,G)

推理（Algorithm 1）：
  x ← 随机热图贪心解码得到的初始解
  for c = 1 … C:
      x_τ1 ← Disrupt(x)                  # 随机 2-opt / 变量翻转
      for n = 1 … N_τ:                   # N_τ=4，Euler 积 ODE
          x_{τ_{n+1}} = x_{τ_n} − (τ_n − τ_{n+1})·v_θ(x_{τ_n}, τ_n, G)
      x ← PostProcess(x_{τ_Nτ})          # 贪心解码 + 可选 N/50 步 2-opt
  输出 C 轮中最好的解
```

三个要点：

1. **破坏强度是探索旋钮**：2-opt 次数取 [N/4, 3N/4]，既保证离开局部最优，又不至于把解打得太烂以致流模型修不回来；MIS/MCl 翻转 25–40% 的已选变量。Figure 4（附录）展示流模型在 suboptimal 与 optimal 之间做近似线性插值。
2. **架构为「多次调用」而设计**：边级 GNN 的复杂度随边数平方增长，反复调用会爆；GenSCO 只用节点特征 h∈ℝ^{N×f}，边 logits 用 h hᵀ，注意力加 λA 注入图结构。这是它能跑几千 cycles 的前提。
3. **后处理保证可行性**：ODE 输出在 [0,1]^N 的松弛空间，贪心解码按置信度选边/点并避免冲突；TSP 再可选 2-opt。搜索过程中始终维持可行解，才能实时用目标函数评估。

## 4. 论文证据与实验范围

**数据**：TSP 训练集 TSP-100 1,280K、TSP-500/1000 各 128K 实例；测试 TSP-100 1,280、TSP-500/1000 各 128，参考解由 Concorde 给出。MIS 用 RB-[200-300] 与 ER-[700-800]；MCl 用 RB-[200-300] 与 RB-[800-1200]。指标：目标值、相对最优/参考解的 gap、总求解时间。设定：单轮 4 步流生成、8 个算子并行、后处理 N/50 步 2-opt。

**TSP（Table 1，节选）**：

| 方法 | TSP-100 gap / 时间 | TSP-500 gap / 时间 | TSP-1000 gap / 时间 |
|---|---|---|---|
| Concorde | 0.000% / 5.1 min | 0.000% / 39.8 min | 0.000% / 3.0 h |
| LKH-3 (4096 trials) | 0.000% / 14.1 min | 0.000% / 15.0 min | 0.001% / 36.3 min |
| DIFUSCO (Ts=100) S+2Opt | 0.06% / 30 min | 0.87% / 19.1 min | 1.31% / 51.9 min |
| Fast T2T S+2Opt | 0.01% / 8.3 min | 0.21% / 6.9 min | 0.42% / 18.3 min |
| **GenSCO (C=10) 2Opt** | **0.000% / 6 s** | 0.019% / 5 s | 0.063% / 16 s |
| **GenSCO (C=40) 2Opt** | – | 0.012% / 18 s | 0.046% / 58 s |
| **GenSCO (C=160) 2Opt** | – | 0.010% / 1.2 min | 0.036% / 3.9 min |

**其它任务**：MIS（Table 4）RB 上 C=500 到 1.24% gap（1.1 min），C=16k 到 0.22%；ER 上 5.37%→1.03%。MCl（Table 5）RB-small C=1k 到 0.00%，RB-large C=1k 到 −0.13%（即超过 Gurobi 的限时解）。**训练监督消融（Table 3）**：用 2-opt 产生的更差解（TSP-100 gap 1.9%）训练，GenSCO 仍到 0.014%，再自举重标注（GenSCO2/3）到 0.005%。**跨规模泛化（Table 2）**：大↔大、小↔小较好，跨大差异分布时 gap 上升（如 TSP-1000 训练的模型在 TSP-100 上 2.70%）。

**范围限制（本页判断）**：主要结果集中在合成均匀分布实例，TSPLIB 只在附录且论文承认部分困难实例表现不佳；「超过 LKH-3」是限定时间/精度点的比较，LKH 的斜率更陡；MCl 的负 gap 依赖 Gurobi 限时（非最优证明），不能读成「严格优于精确解」；所有任务都假设有高质量参考解（Concorde/LKH）用于训练，真实场景没有。

## 5. 复现与审计重点

- **仓库结构**：`decoding/tsp.py`、`decoding/mis.py`、`decoding/mcl.py` 是三个任务的推理入口；`lib/` 是 C++ 的 2-opt/翻转接口（`make` 生成 Python 扩展）；`scripts/eval/tsp100.sh` 等是评测脚本；`train/` 是训练。`install.sh` 装 JAX/Flax/Optax/Triton/TensorFlow-CPU 与 `torch==2.6.0+cpu`（只用于个别工具）。
- **权重与数据**：TSP-100 数据来自 HF `Rick242420/MaskCO`（`tsp/tsp100_concorde_7.75585.npz`，2.56 MB，1280×100 节点，字段 coords/opt_tours）；checkpoint `tsp100.ckpt`（76.5 MB）在 Google Drive 三个子文件夹之一（TSP/MIS/MCL）。其余任务的数据与权重需另下。
- **环境坑（走查实测）**：`install.sh` 最后把 numpy 钉到 1.26.4，会让 jaxlib 因 ml_dtypes ABI 不匹配而 import 失败——保留 jax 自选的 numpy 2.1.3 即可；机器无 `clang++`，`lib/Makefile` 需改 `g++`（gcc 9.4/C++17 足够）。`XLA_PYTHON_CLIENT_PREALLOCATE=false` 可避免 XLA 预占整卡。
- **走查（小样本，非论文指标）**：只跑 `scripts/eval/tsp100.sh` 的命令（runs=8、cycles=10、sampling_steps=4、two_opt_steps=2、batch=128、threads_over_batches=2、augment_level=1），TSP-100 全 1280 实例。两次结果 mean cost **7.755891 / 7.755883**，参考最优 7.755851，gap **0.000513% / 0.000403%**；论文/README 报 0.000%。整轮 38–40 s（含导入约 90 s），峰值显存 4520 MiB。差距只在 1e-5 相对量（极少数实例差一个 2-opt 步），属于同一水平。代码只改了 `lib/Makefile` 的编译器，算法与超参未动。
- **审计要点**：论文的 6 s（TSP-100）与我们 38–40 s 的差异主要来自硬件与并行度（论文 8 个算子并行；走查按脚本顺序跑）；Table 1 里「GenSCO (C=10)」对 TSP-500/1000 也有数，但论文正文只强调 TSP-100 的 0.000%，引用时要看清 C；MCl 的负 gap 是相对 Gurobi 限时解，不是相对真最优。
- **没跑的部分**：TSP-500/1000、MIS、MCl、CVRP/TSPTW、训练脚本，以及所有需要额外数据/权重的任务。

## 6. 建议阅读顺序

摘要 → §1 的 scaling 动机与 Figure 2（三条 scaling 曲线）→ §4.1 solution-to-solution rectified flow（式 2–5，重点看源分布怎么造）→ 架构段（节点嵌入 + λA）→ §4.2 Algorithm 1 与破坏强度 → §5.1 Table 1（C 的 scaling）→ Table 2 跨规模泛化 → Table 3 低质监督与自举 → Table 4/5（MIS/MCl）→ 附录 Table 13（采样步数消融）与 Figure 4（流插值可视化）。

## 7. 前后关联

- 与 [43 号 Noise Trajectory Search](43-noise-trajectory-search.md) 是同一主张的两个实例：加去噪步饱和，换一个算力维度（噪声轨迹 / 搜索循环）。NTS 在连续图像空间搜噪声，GenSCO 在离散解空间搜解；两者都用「多次评估 + 选最好」的方式花预算。
- 与 [09 号 Rectified Flow](../diffusion/09-rectified-flow.md)、[08 号 Flow Matching](../diffusion/08-flow-matching.md) 直接相关：GenSCO 的 4 步生成能力来自直线流；区别是它的源分布不是高斯而是「被破坏的次优解」，因此训练目标变成 solution-to-solution 增强。
- 与 [10 号 Consistency Models](../diffusion/10-consistency-models.md) 的少步思想同源但目的不同：一致性模型压的是单次生成步数，GenSCO 压的是单轮算子成本，好把预算挪给更多 cycles。
- 与 [02 号 DDPM](../diffusion/02-ddpm.md)、[03 号 DDIM](../diffusion/03-ddim.md) 的采样框架对照：标准扩散从噪声起步、每步注入新噪声；GenSCO 用 ODE（无随机噪声）且起点是结构化解，这是它能「反复调用而不退化」的关键。
- 与 [25 号 ReSample](25-resample.md) 的「测试时用优化/投影改采样轨迹」互为镜像：ReSample 有测量约束、目标是数据一致性；GenSCO 有目标函数约束、目标是解质量，两者都把「测试时算力」当成可分配资源。

## 8. 链接

- [NeurIPS 2025 proceedings 摘要页](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html)
- [NeurIPS 2025 正式版 PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8e9869fa827226ff68db9290659a20c-Paper-Conference.pdf)
- [OpenReview 页面（forum 9JM03CQwzC）](https://openreview.net/forum?id=9JM03CQwzC)
- [官方代码 Thinklab-SJTU/GenSCO](https://github.com/Thinklab-SJTU/GenSCO)
- [TSP-100 数据（HF Rick242420/MaskCO）](https://huggingface.co/datasets/Rick242420/MaskCO)
