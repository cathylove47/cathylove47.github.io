# 20｜LLaDA：把扩散从图像搬到语言，8B 从零预训练

**论文**：Large Language Diffusion Models  
**作者**：Shen Nie、Fengqi Zhu、Zebin You、Xiaolu Zhang、Jingyang Ou、Jun Hu、Jun Zhou、Yankai Lin、Ji-Rong Wen、Chongxuan Li（中国人民大学高瓴人工智能学院 + 蚂蚁集团；Chongxuan Li 通信）  
**发表**：NeurIPS 2025（Advances in Neural Information Processing Systems 38，Main Conference Track，DOI 10.52202/085713-1689）；arXiv:2502.09992 v1（2025-02-14），本页依据 v3（2025-10-18）  
**定位**：「扩散不止于图像」的那一页——同一个变分下界，把高斯加噪换成离散 token 遮蔽，就能在 8B 规模上与 LLaMA3 8B 打平  
**核验**：2026-11-18 依 arXiv v3 PDF 全文（正文 §1–5、Appendix A.1–A.3 全部公式与 Algorithm 1–5、B.1–B.7、B.9 与 Table 1–11）整理；发表状态核对 NeurIPS 2025 proceedings 条目与本页 DOI；代码对照 `ML-GSAI/LLaDA` main 分支 `91824937`（最后推送 2026-07-15）的 `generate.py`、`get_log_likelihood.py`、`GUIDELINES.md`、`data/poem_data.json`，模型卡核对 HF `GSAI-ML/LLaDA-8B-Base`（MIT，2025-10-21 更新）。本页只读论文与代码，**未下载权重、未训练、未运行推理**，所有数字为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | 纯文本语言建模：零/少样本评测、SFT 后指令跟随、多轮对话、反向推理 |
| 生成范式 | 掩码扩散（masked diffusion model, MDM）：前向逐 token 遮蔽，反向一次预测所有被遮 token |
| 规模 | 1B 与 8B 两个版本；8B = 32 层、4096 维、8.02B 总参数 / 6.98B 非嵌入参数、词表 126,464 |
| 训练 | 2.3T token 从零预训练，0.13M H800 GPU-hours；SFT 4.5M 对、3 epoch |
| 关键设计 | 遮蔽率 $t\sim U(0,1)$、损失按 $1/t$ 加权、双向注意力（去 causal mask）、低置信度重遮蔽采样 |
| 代码 | 推理 + 评测 + 训练要点（loss 片段）公开；**训练框架与数据不公开**，权重 MIT |

## 原文摘要

> The capabilities of large language models (LLMs) are widely regarded as relying on autoregressive models (ARMs). We challenge this notion by introducing LLaDA, a diffusion model trained from scratch under the pre-training and supervised fine-tuning (SFT) paradigm. LLaDA employs a forward data masking process and a reverse generation process, parameterized by a Transformer to predict masked tokens. It provides a principled generative approach for probabilistic inference by optimizing a likelihood lower bound. Across extensive benchmarks on general tasks, math, code, and so on, LLaDA demonstrates strong scalability and performs comparably to our self-constructed ARM baselines. Remarkably, LLaDA 8B is competitive with strong LLMs like LLaMA3 8B in in-context learning and, after SFT, exhibits impressive instruction-following abilities in case studies such as multi-turn dialogue. Moreover, LLaDA addresses the reversal curse, surpassing GPT-4o in a reversal poem completion task. Our findings show the promise of diffusion models for language modeling at scale and challenge the common assumption that core LLM capabilities discussed above inherently depend on ARMs. Project page and codes: https://ml-gsai.github.io/LLaDA-demo/.

*来源：arXiv:2502.09992v3 摘要页，逐字保留；NeurIPS 2025 proceedings 条目摘要与此一致。*

## 中文摘要

> 大语言模型（LLM）的能力被普遍认为依赖于自回归模型（ARM）。我们质疑这一看法，提出 LLaDA——一个在预训练 + 监督微调（SFT）范式下从零训练的扩散模型。LLaDA 采用前向数据遮蔽过程与反向生成过程，由 Transformer 参数化、预测被遮蔽的 token。它通过优化似然下界，给出一种有原则的概率推断生成方法。在通用任务、数学、代码等大量基准上，LLaDA 表现出很强的可扩展性，与自建的 ARM 基线表现相当。值得注意的是，LLaDA 8B 在上下文学习上可与 LLaMA3 8B 这类强 LLM 竞争；经 SFT 后，在多轮对话等案例中展现出很强的指令跟随能力。此外，LLaDA 缓解了反转诅咒，在反向诗歌补全任务上超过了 GPT-4o。我们的结果表明扩散模型在大规模语言建模上有前景，并挑战了「上述核心 LLM 能力本质上依赖 ARM」这一常见假设。项目主页与代码：https://ml-gsai.github.io/LLaDA-demo/。

*译文：逐句对译上方原文摘要，未增删内容。*

## 0. 三分钟摘要

**一句话**：语言也是「生成建模」，似然下界不一定要靠从左到右的链式分解来算——把 GPT 的 causal mask 拿掉，把 token 按随机比例抹成 `[MASK]`，用同一个变分下界训练，8B 就能和 LLaMA3 8B 打平。

**问题**：主流叙事是「LLM 的能力来自自回归」。作者认为真正起作用的是式 (1) 的最大似然/最小 KL 原则（+ Transformer + 数据 + Fisher 一致性），自回归式 (2) 只是其中一种分解方式。要证伪「AR 是唯一路径」，必须在 LLM 的真实规模上做出一个非 AR 模型，而不是 GPT-2 规模的小实验。

**insight**：连续扩散在图像上已经证明「非 AR 也能 scaling」（DiT 等）。语言是离散状态空间，前向过程自然变成「逐 token 替换为吸收态 `[MASK]`」。这一步之后：
- 反向过程对 token **完全因子化**，所以一个双向 Transformer 一次就能预测所有被遮位置；
- 后验 $q_{0|t}(x_s|x_t)$ 只依赖未被遮的 token，**与时间 $t$ 无关**，因此模型不需要时间步 embedding（式 11）；
- 损失就是带 $1/t$ 权重的交叉熵，只在被遮位置计，可以证明是负对数似然的上界（式 4/13）。

**它到底做到了什么**（LLaDA 8B Base 对 LLaMA3 8B Base，同一评测脚本）：
- MMLU 65.9 vs 65.4、GSM8K 70.3 vs 48.7、Math 31.4 vs 16.0、CMMLU 69.9 vs 50.7、C-Eval 70.5 vs 51.7；
- 但 BBH 49.7 vs 62.1、HellaSwag 70.5 vs 79.1、PIQA 73.6 vs 80.6、MBPP 40.0 vs 48.8 落后；
- 只用了 2.3T token，LLaMA3 用了 15T。
- 反向推理：诗歌补全 正向 51.8 / 反向 45.6（GPT-4o 82.7 / 34.3）——不是绝对更强，而是**前后一致**。

### 讲 talk 时的顺序

先讲「图像上的扩散为什么不能直接搬到文本」（连续 vs 离散，§2）→ 再讲损失和 1/t 的作用（§3.2）→ 再讲采样为什么必须重遮蔽（§3.5）→ 最后讲三张表：base 打平、instruct 落后、反转不诅咒（§4）。

## 1. 问题与核心判断

- **论文要证伪的命题**：「可扩展性、上下文学习、指令跟随本质上依赖自回归分解」。
- **作者的替代解释**：这些性质来自生成建模原则（式 1）与 Fisher 一致性，而不是来自链式分解。所以任何表达能力足够的概率模型，只要按最大似然训练、规模足够，就应该都能长出来。
- **为什么之前没人做**：文本连续化扩散（把 token 当连续向量）在 1B 规模上要 ~64× 算力才追平 ARM（论文引 [57]）；离散扩散此前只到 GPT-2 规模。作者前一作 Nie et al. 2024（arXiv:2410.18514）甚至给出「MDM 达到同等似然需要 16× 算力」的 scaling law——本文用「似然是间接指标 + 我们只优化下界 + 规模扩到 $10^{23}$ FLOPs」来回应。
- **可以直接归因于 AR 的失败**：反转诅咒（reversal curse）——训练见过「A 是 B」，学不会「B 是 A」。左到右分解把条件方向写死了，双向模型没有这个偏向。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| MDM（掩码扩散） | 前向把 token 一个个换成 `[MASK]`，反向把 `[MASK]` 一个个猜回来；吸收态离散扩散的特例 |
| 吸收态 | `[MASK]` 一旦进入就再也不会变成别的 token，是所有转移的「坟场」 |
| 掩码率 $t$ | 每个 token 被遮的概率，$t=1$ 全遮、$t=0$ 全露；训练时 $t\sim U(0,1)$ |
| 时间无关参数化 | 因为后验只依赖未遮 token，网络输入里不必给 $t$——与图像扩散最大的实现差异 |
| 重遮蔽（remasking） | 一步预测完之后，故意把一部分已预测的 token 再打回 `[MASK]`，让下一步重猜 |
| 低置信度重遮蔽 | 保留置信度最高的 $(1-s)L$ 个，其余打回；对应 MaskGIT 的 annealed sampling |
| 块扩散（block diffusion） | 块内并行去噪、块间从左到右；半自回归，能部分恢复 KV cache |
| 反转诅咒 | 「A→B」学会了、「B→A」学不会 |
| CFG（无监督分类器引导） | LLaDA 里把 prompt 遮掉再算一次 logits，按 $p^{1+w}/p_{\text{uncond}}^w$ 外推 |

## 3. 核心方法与数据流

```text
预训练（网络输入里没有 t）
x0 ~ 数据  →  t ~ U(0,1)  →  每个 token 独立以概率 t 换成 [MASK]，得 x_t
          →  双向 Transformer 一次预测全部被遮 token
          →  loss = -(1/(t·L))·Σ_i 1[x_t^i = M]·log p_θ(x0^i | x_t)

SFT
(p0, r0)  →  只在 r0 上采 t 与 mask（prompt 保持干净）
          →  同一个 loss，长度 L' 换成人答长度

采样（N 步，t: 1 → 0；默认均匀离散步长）
r_1 = 长度 L 的全 [MASK] 序列
每步：一次全序列前向 → mask 位置 argmax（贪心）→ 记录置信度 c_i = p_θ(x0^i)
      → 只保留置信度最高的 ⌊(1-s)L⌋ 个，其余重新置为 [MASK]
→ r_0，截断到 |EOS| 之后
```

### 3.1 前向与反向（式 7–11）

前向对 token 完全因子化，$q_{t|0}(x_t|x_0)=\prod_i q_{t|0}(x_t^i|x_0^i)$，单个 token：

$$q_{t|0}(x_t^i|x_0^i)=\begin{cases}1-t, & x_t^i=x_0^i\\ t, & x_t^i=\texttt{[MASK]}\end{cases}$$

遮蔽概率对 $t$ **线性**。作者给的理由是「文本的信息量近似正比于 token 数，所以信息应线性丢失」——这是与连续扩散噪声调度最不一样的地方，没有余弦/线性 beta 之类的调参空间。

反向也是逐 token 因子化的（式 9–10），关键是式 (11)：

$$q_{0|t}(x_s^i|x_t)=p_{\text{data}}(x_0^i\mid x_t^{\text{UM}}),\quad \forall i\ \text{s.t.}\ x_t^i=\texttt{M}$$

即「把被遮位置补回原 token」等价于「在未遮 token 上做条件预测」，而后者与 $t$ 无关。这就是 LLaDA 的 Transformer 里**没有任何时间步条件**的原因，也是它与 DiT 系列最本质的实现差异。

### 3.2 目标函数与它为什么是下界

$$\mathcal{L}(\theta)\triangleq-\mathbb{E}_{t,x_0,x_t}\left[\frac{1}{t}\sum_{i=1}^{L}\mathbb{1}[x_t^i=\texttt{M}]\log p_\theta(x_0^i|x_t)\right]\ \ge\ -\mathbb{E}_{p_{\text{data}}}[\log p_\theta(x_0)]$$

三个细节决定它是「生成模型」而不是「BERT」：

1. **$t\sim U(0,1)$ 连续**：BERT 固定 15% 遮蔽，只有一个条件分布；LLaDA 覆盖从「几乎全遮」到「几乎全露」的所有条件，因此能定义从纯噪声到数据的完整反向链。
2. **$1/t$ 权重**：被遮概率是 $t$，权重是 $1/t$，两者相乘后期望正好抵消——**每个 token 的期望贡献是一个与 $t$ 无关的常数**（我的推导，作者没写这个等式）。所以训练算力与同规模 AR 同阶，但同一个 token 会被见到 $O(L)$ 种不同的条件上下文。
3. **只在被遮位置算损失**：这是吸收态扩散 ELBO 的标准形式，也是 $1/t$ 出现的来源（重要性加权的连续时间极限）。

MaskGIT 的启发式目标恰好缺了 $1/t$，因此没有似然解释；BERT 缺了 $t$ 的随机性，因此不是生成模型。

### 3.3 SFT（式 5）

给定 $(p_0,r_0)$，prompt 不动、只在 $r_0$ 上采 $t$ 加噪，损失与预训练同形。作者强调「$p_0$ 与 $r_0$ 拼起来就是预训练的 $x_0$，只不过被遮的 token 恰好都在回答部分」——所以 SFT 不是新任务，只是条件化。

实现上有一个必须记住的坑：短样本用 `|EOS|` 补齐到同批等长，**补齐的 `|EOS|` 也算进损失**，模型因此学会自己决定回答长度；采样时把 `|EOS|` 之后的 token 丢掉。

### 3.4 采样与重遮蔽（Algorithm 4、5）

一步从 $t$ 到 $s$ 时，理论上应该按前向过程「随机」决定哪些预测保留、哪些打回（$s/t$ 比例保持为 `[MASK]`）。但作者改用 **低置信度重遮蔽**：预测完后取 $c_i=p_\theta(\hat x_0^i)$，只保留置信度最高的 $\lfloor(1-s)L\rfloor$ 个。

- 这是启发式，不是从反向核里采的。它对应 LLM 采样的 annealed / 低温度解码，作用是降低多样性、提高准确率。
- 消融非常剧烈（Table 9，8B Base，长度与步数都 256）：随机重遮蔽 BBH 32.1 / GSM8K 21.3 / Math 9.2 / HumanEval 11.6 / MBPP 21.0；低置信度 45.0 / 70.0 / 30.3 / 32.9 / 40.2。GSM8K 上差了 3 倍多。
- 一个直接后果：**默认采样是「贪心 + top-k 保留」的确定性过程**（temperature=0），所谓「扩散采样的随机性」在主结果里其实没有出现。

同样的框架不用改模型就支持三种采样（Table 7/8）：自回归（每步解一个 token 从左到右）、块扩散（块内并行、块间 AR）、纯扩散。8B Base 上纯扩散最好（BBH 49.7 / GSM8K 70.3 / Math 31.4 / HumanEval 35.4 / MBPP 40.0），AR 采样最差（38.1 / 63.1 / 23.6 / 18.3 / 33.4）。8B Instruct 上则相反：块扩散在 GSM8K（77.5，块长 8 时 78.6）和 Math（42.2）上超过纯扩散（69.4 / 31.9），原因是 SFT 数据大量 `|EOS|` 补齐导致纯扩散下过早结束——评测时要把 `|EOS|` 的置信度置零才正常。

### 3.5 架构与训练细节（Table 5、§2.2）

| | LLaDA 8B | LLaMA3 8B |
|---|---|---|
| 层数 / 维度 / 头数 | 32 / 4096 / 32 | 32 / 4096 / 32 |
| KV 头数 | 32（不用 GQA） | 8 |
| FFN 维度 | 12,288 | 14,336 |
| 词表 | 126,464 | 128,000 |
| 总参数 / 非嵌入 | 8.02B / 6.98B | 8.03B / 6.98B |

不用 GQA 是因为 **LLaDA 结构上无法使用 KV cache**（双向注意力，每个去噪步都要重算整个序列），所以 KV 头数不构成推理瓶颈，作者就把省下的参数挪到 FFN 之外以对齐总参数。训练：seq 4096、batch 1280、峰值 lr $4\times10^{-4}$（WSD 调度，1.2T 时降到 $1\times10^{-4}$，最后 0.3T 线性降到 $1\times10^{-5}$）、AdamW wd 0.1、1% 数据用 $U[1,4096]$ 随机长度；8B **只跑了一次，没有调参**。数据配比约 11% 中文 / 61% 英文 / 28% 代码。

### 3.6 条件似然怎么算（式 6，Algorithm 3）

用式 (5) 的上界估计方差太大（论文说独立遮蔽版本要 1000+ 次 MC 才稳），改用等价的「定数量遮蔽」形式：

$$-\mathbb{E}_{l,r_0,r_l}\left[\frac{L}{l}\sum_{i=1}^{L}\mathbb{1}[r_l^i=\texttt{M}]\log p_\theta(r_0^i|p_0,r_l)\right],\quad l\sim\{1,\dots,L\}$$

即每次**恰好**遮 $l$ 个 token（无放回），$L/l$ 做权重。128 次 MC 就够（单 token 答案如 MMLU 只需 1 次）。这条式子对所有「用似然做选择题」的 benchmark 都是关键实现细节，做复现时最容易踩错。

## 4. 实验与证据

### 4.1 可扩展性（Fig. 3）

1B 规模上 LLaDA 与 ARM **同架构、同数据、同配置**；更大规模因为资源限制只能用既有 7B ARM 对 8B LLaDA。横轴是预训练 FLOPs（$6ND$），六个任务（MMLU、ARC-C、CMMLU、PIQA、GSM8K、HumanEval）上两条曲线整体重合，MMLU 与 GSM8K 上 LLaDA 略优，PIQA 上略差且差距随规模缩小。作者明确拒绝拟合定量曲线（怕离群点误导）——这一点是诚实的。

### 4.2 Base 模型（Table 1，同一评测协议）

| 基准（shot） | LLaDA 8B | LLaMA3 8B | LLaMA2 7B |
|---|---|---|---|
| MMLU (5) | **65.9** | 65.4 | 45.9 |
| BBH (3) | 49.7 | **62.1** | 39.4 |
| ARC-C (0) | 45.9 | **53.1** | 46.3 |
| HellaSwag (0) | 70.5 | **79.1** | 76.0 |
| TruthfulQA (0) | **46.1** | 44.0 | 39.0 |
| WinoGrande (5) | 74.8 | **77.3** | 72.5 |
| PIQA (0) | 73.6 | **80.6** | 79.1 |
| GSM8K (4) | **70.3** | 48.7 | 13.1 |
| Math (4) | **31.4** | 16.0 | 4.3 |
| GPQA (5) | 25.2 | **25.9** | 25.7 |
| HumanEval (0) | **35.4** | 34.8 | 12.8 |
| HumanEval-FIM (2) | **73.8** | 73.3 | 26.9 |
| MBPP (4) | 40.0 | **48.8** | 23.2 |
| CMMLU (5) | **69.9** | 50.7 | 32.5 |
| C-Eval (5) | **70.5** | 51.7 | 34.0 |
| 训练 token | 2.3T | 15T | 2T |

读法：15 个任务里 8 个赢、7 个输，且赢的幅度集中在数学（GSM8K +21.6）与中文（CMMLU +19.2、C-Eval +18.8），输的集中在常识/多步推理（BBH −12.4、HellaSwag −8.6、PIQA −7.0）。作者把差异归给数据质量与分布（LLM 语料闭源），并只用 GSM8K + iGSM（Table 12：LLaDA 64/41/44 vs LLaMA3 38/35/34，4/5/6 步）做了泄漏排查。

### 4.3 Instruct（Table 2，只有 SFT，无 RL）

| 基准 | LLaDA 8B | LLaMA3 8B（SFT+RL） |
|---|---|---|
| MMLU (5) | 65.5 | 68.4 |
| MMLU-pro (0) | 37.0 | 41.9 |
| HellaSwag (0) | 74.6 | 75.5 |
| ARC-C (0) | **88.5** | 82.4 |
| GSM8K (4) | 69.4 | 78.3 |
| Math (0) | **31.9** | 29.6 |
| GPQA (5) | **33.3** | 31.9 |
| HumanEval (0) | 49.4 | 59.8 |
| MBPP (4) | 41.0 | 57.6 |

结论要克制：**只做 SFT（4.5M 对）就接近做了 SFT+RL 的 LLaMA3 8B**，ARC-C/Math/GPQA 还略高；代码明显落后（HumanEval −10.4、MBPP −16.6）。MMLU 相对 base 掉了 0.4，作者自己归因为 SFT 数据质量。

### 4.4 反转诅咒（Table 4，496 对中文诗句，零样本）

| 模型 | 正向 | 反向 |
|---|---|---|
| GPT-4o (2024-08-06) | 82.7 | 34.3 |
| Qwen2.5-7B Instruct | 75.9 | 38.0 |
| LLaDA-8B Instruct | 51.8 | **45.6** |

正向 LLaDA 差了 31 个点，反向赢了 11 个点。准确的表述是「**前后一致，不再有 40+ 点的方向鸿沟**」，摘要里「surpassing GPT-4o」只指反向那一列。

### 4.5 采样与效率（Fig. 5、Table 11）

- 吞吐（单 A100-80GB，batch 1，输出固定 256 token，bf16）：GSM8K 上 LLaDA 达到 LLaMA3 8B Base **1.5×**、Math 上 **1.8×**，而 LLaMA3 用了 KV cache、LLaDA 没有任何推理优化。HumanEval 打平，MBPP 落后。原因是低步数下**一次前向出多个 token**（步数 32/64/128/256 ↔ 每步 8/4/2/1 个 token）。
- 显存（Table 11）：输入 512 / 输出 1024 时 LLaDA 17.53 GB，LLaMA3 无 cache 17.49 GB、有 cache 16.43 GB。LLaDA 的显存**与步数无关**。
- 作者自己划界：「我们的目标不是比 ARM 更快」。

## 5. 复现入口与首个验证

### 5.1 官方代码的真实状态（已核对，2026-11-18）

- 仓库：[ML-GSAI/LLaDA](https://github.com/ML-GSAI/LLaDA)，main 分支 `91824937`（2026-07-15）。有：`generate.py`（含 block/var 两种生成与 iLLaDA 兼容分支）、`get_log_likelihood.py`、`chat.py`、`app.py`（Gradio）、`eval_instruct/`（改过的 lm-evaluation-harness）、`data/poem_data.json`、`GUIDELINES.md`（loss 片段）、`EVAL.md`。
- 权重：[GSAI-ML/LLaDA-8B-Base](https://huggingface.co/GSAI-ML/LLaDA-8B-Base)、[GSAI-ML/LLaDA-8B-Instruct](https://huggingface.co/GSAI-ML/LLaDA-8B-Instruct)，MIT，bf16，需 `transformers==4.38.2` + `trust_remote_code=True`。
- **不提供**：训练框架与预训练数据（README 明说「We will not provide the training framework and data」），只在 `GUIDELINES.md` 给核心 loss 片段，并指向姊妹项目 SMDM。
- 关键常量：`mask_id = 126336`、`eos = 126081`（`generate.py`、`GUIDELINES.md` 一致）。

**论文公式 ↔ 代码位置**

| 论文 | 代码 |
|---|---|
| 式 (3)/(12) 预训练损失（含 $1/t$） | `GUIDELINES.md` 的 `forward_process` + `token_loss / p_mask`；`eps=1e-3` 把 $p_{\text{mask}}$ 截断为 $(1-\epsilon)t+\epsilon$ |
| 式 (5) SFT 损失 | 同文件 SFT 片段：`noisy_batch[prompt_mask] = input_ids[prompt_mask]` |
| 式 (6) 条件似然 | `get_log_likelihood.py::forward_process`（恰好遮 $k$ 个，无放回）+ `loss / p_mask` 累加后取负 |
| 式 (16) 无监督 CFG | `get_log_likelihood.py::get_logits`、`generate.py` 内 `logits = un_logits + (cfg_scale+1)*(logits-un_logits)` |
| Algorithm 5 低置信度重遮蔽 | `generate.py::generate`：`p = F.softmax(logits)` → `x0_p = gather(p, x0)` → `topk(confidence, num_transfer_tokens)` → 写回 |
| 每步转移 token 数（线性调度） | `generate.py::get_num_transfer_tokens`，`base = mask_num // steps` 余数前几补 1 |
| 块扩散 / 半自回归 | `generate.py` 的 `block_length` 与 `num_blocks` 循环 |
| `[EOS]` 置信度置零（B.4） | `logits_eos_inf` / `confidence_eos_eot_inf` 参数 |

**代码与论文不一致 / 要注意的地方**

1. **诗歌数据条数**：论文 §3.3 写 496 对，`data/poem_data.json` 实际 **469** 条（字段 `first` / `second` / `source`）。复现 Table 4 时数字不会完全对上，需确认评测用的是哪个版本。
2. `GUIDELINES.md` 的 `forward_process` 用 `eps=1e-3` 截断遮蔽率且**按批采一个 $t$**（`torch.rand(b)` 后广播），论文写的是「每个 token 独立以概率 $t$」——期望相同，方差不同。
3. `generate.py` 里已有论文没写的东西：iLLaDA 的 `mask_id=5` 分支、`end_think` logit boost（推理模型的思考终止控制）、`var_generate`（逐块生成、不加未来 mask 块）。读代码时不要以为论文描述的就是仓库的全部。
4. 论文 Table 1/2 的分数依赖两套评测栈（lm-evaluation-harness + 内部库），仓库里 `eval_instruct/` 是改过的 harness，复现时评测脚本本身就是一个变量。

### 5.2 第一个该做的验证（不需要训练，一张 80GB 卡）

只验 **步数–质量权衡**：`generate.py` 跑 LLaDA-8B-Base，`gen_length=256` 固定，`steps ∈ {32,64,128,256}`，在 GSM8K 的前 200 题上测准确率与 tokens/s（单 A100/H800，batch 1）。这一步同时验证三件事：论文 Fig. 5 的 1.5–1.8× 吞吐能否在你的机器上复现、质量在多少步开始崩、以及贪心采样是否真的对温度不敏感。**不要**一上手就跑 Table 1 全量——条件似然那条链（式 6 + 128 次 MC）比采样慢一个数量级，且最容易因为实现细节偏差 1–2 个点。

### 5.3 如果要迁移到病理

一个具体、不用 8B 的实验：把 WSI 特征（UNI/CONCH 取 patch token）当条件，报告文本当序列，用 **0.5B 级双向 Transformer + 掩码扩散目标**（照 `GUIDELINES.md` 的十行 loss）与同参数 AR 解码器在同等算力下对比病理报告生成。要测的不是 FID/BLEU，而是**方向一致性**：同一张切片问「形态→分级」与「分级→形态描述」，看两边是否互相矛盾——这正是 LLaDA 用诗歌补全想说明的事，而病理报告里「先写描述后写诊断」的顺序恰恰是 AR 最容易自相矛盾的地方。

## 6. 前后关联

- **离散 vs 连续**：[DDPM](02-ddpm.md) 的前向是高斯加噪、反向是学 $\epsilon$ 或 $x_0$；这里前向是吸收态马尔可夫链、反向直接学 $p_\theta(x_0|x_t)$。两者共用同一个 ELBO 骨架，区别全在状态空间与转移核。讲 talk 时这一页最适合放在 DDPM 之后做「同一件事的另一个状态空间」。
- **骨干**：[DiT](07-dit.md) 说明 Transformer 可以当扩散骨干；LLaDA 更进一步——因为不需要时间步条件，它连 timestep embedding 都没有，就是一个去掉 causal mask 的 LLaMA。
- **少步采样**：图像侧的 [Consistency Models](10-consistency-models.md)、[MeanFlow](12-meanflow.md)、[iMF](13-imf.md) 解决「步数太多」；LLaDA 侧对应的是蒸馏（论文引 DIMO）与块扩散，仓库里则体现为 `block_length`。这是两条线最值得对照的地方：**语言侧的加速主要靠减少步数与重遮蔽策略，而不是把多步映射成一步**。
- **对齐**：LLaDA 只做 SFT，没有 RL；README 记载的 LLaDA 1.5 用 VRPO 做偏好对齐，可与 [Flow-GRPO](18-flow-grpo.md)、[DiffusionNFT](19-diffusionnft.md) 那条「扩散模型 RL」线并读。
- **病理侧**：[HistDiT](../pathology/62-histdit.md)、[PathLDM](../pathology/71-pathldm.md)、[SuperDiff](../pathology/78-histo-diffusion.md) 都是连续扩散做图像；LLaDA 提示的是另一条路——**把病理的多模态输出（报告、诊断标签序列、形态描述）当离散序列做掩码扩散**，而不是再生成一张图。
- **后续工作（仅 README 记载，未逐篇核验）**：LLaDA-V（扩散 VLM，2025-05-23）、LLaDA 1.5（VRPO，2025-05-25）、LLaDA-MoE-7B-A1B（首个 MoE 扩散 LM，约 1B 激活，2025-09-11）、iLLaDA-8B（`mask_id=5`、复用现有推理代码，2026-06-24，arXiv:2606.25331）。

## 7. 局限与可检验问题

**作者承认的**：
- 生成长度是用户指定的超参（虽然 B.5 表明不敏感）；
- 同数据同架构的对照只做到 $<10^{23}$ FLOPs，8B 的 ARM 对照是既有 7B 模型，不是严格同条件；
- 没有为 LLaDA 设计专门的注意力/位置编码，也没有 KV cache 等系统级优化；
- 采样算法仍是初步的，没有 RL 对齐；
- 规模与数据都小于前沿 ARM。

**我的看法（作者没写的）**：
1. **核心命题只被「存在性」证明了一半**。要证「AR 不是必要条件」，需要同数据、同 tokenizer、同算力的 8B 对照；实际给的是 2.3T vs 15T、不同 tokenizer、7B vs 8B。所以这篇真正证明的是「MDM 在 8B 规模能达到 AR 的水平」，这已经很强，但和摘要的强主张之间有缝。
2. **训练目标与采样器是脱钩的**。ELBO 保证的是似然，而实际采样是「贪心 + 置信度 top-k」，不是从反向核采样。所以「扩散」在这里主要是**训练目标与条件结构的描述**，不是采样动力学的描述。做图像扩散的人第一次读会误以为有 ancestral sampling，实际 temperature=0。
3. **无 KV cache 是结构性代价，不是工程欠账**。双向注意力意味着每一步都要重算全序列，成本 $O(N\cdot(P+N)^2)$；论文的 1.5–1.8× 吞吐来自「低步数一次出多 token」，而不是来自更便宜的每步计算。步数一提高（质量模式），优势就会反转——Fig. 5 的曲线形状本身就说明了这一点。
4. **「反转诅咒被解决」的证据面很窄**：496（实际 469）对中文诗句、单一模板（「X 的下一句/上一句是什么？直接输出句子即可」）、零样本。这是知识检索式的对称性测试，不等于多步逻辑推理的方向无关性。而且正向分数只有 51.8，说明模型本身知识就弱，「一致」有一部分是「两边都弱」的结果。
5. **8B 只训练一次、无超参搜索，也没报方差**。单次运行的 benchmark 差异（如 MMLU +0.5）不应被解读为优势。
6. **前向遮蔽率线性**这个选择几乎没有被检验。图像扩散里 noise schedule 影响巨大，文本侧作者只给了一句「信息量正比于 token 数」的动机，没有 ablation——这是一个便宜且可能有收益的实验空缺。

**迁移到病理时要回答的问题**：
- 病理报告的长度分布极端（几十到上千 token），固定生成长度的假设在长报告上会不会崩？
- 掩码扩散的「双向条件」在报告生成里到底是优势还是泄漏风险——训练时遮住诊断句，模型可以从描述句反推，这是不是一种隐式的标签泄漏？
- WSI 的 patch 序列本身就是离散 token（VQ 后），能不能把图像 token 与文本 token 放进**同一个**掩码扩散过程，而不是「先编码再解码」两段式？

## 8. 来源与版本

- arXiv：<https://arxiv.org/abs/2502.09992>（v1 2025-02-14；本页用 v3 2025-10-18）；HTML <https://arxiv.org/html/2502.09992v3>；PDF <https://arxiv.org/pdf/2502.09992v3>
- NeurIPS 2025 proceedings：<https://proceedings.neurips.cc/paper_files/paper/2025/hash/48b383b24230e0e6e649d9c98dae4d8c-Abstract-Conference.html>；DOI 10.52202/085713-1689；卷名 *Advances in Neural Information Processing Systems 38 Main Conference*
- 代码：<https://github.com/ML-GSAI/LLaDA>（main，`91824937`，2026-07-15）
- 权重：<https://huggingface.co/GSAI-ML/LLaDA-8B-Base>、<https://huggingface.co/GSAI-ML/LLaDA-8B-Instruct>（MIT）
- 项目页：<https://ml-gsai.github.io/LLaDA-demo/>
- 前作（scaling law）：Nie et al., Scaling Up Masked Diffusion Models on Text, arXiv:2410.18514
- 理论来源：Shi et al. arXiv:2406.04329；Sahoo et al. arXiv:2406.07524；Ou et al. arXiv:2406.03736（本文式 11 与时间无关参数化出自此）
