# 100｜AQuA：用一个反向生成器把虚拟染色的"编造"照出来，整图判可不可用

**论文**：A robust and scalable framework for hallucination detection in virtual tissue staining and digital pathology
**作者**：Luzhe Huang、Yuzhu Li、Nir Pillar、Tal Keidar Haran、William Dean Wallace、Aydogan Ozcan（通讯：Aydogan Ozcan，UCLA）
**发表**：*Nature Biomedical Engineering* **9**, 2196–2214 (2025)；2025-06-16 在线，2025 年 12 月期；DOI [10.1038/s41551-025-01421-9](https://doi.org/10.1038/s41551-025-01421-9)；CC BY 4.0 开放获取。收稿 2024-04-29，接收 2025-05-08
**定位**：虚拟染色（无标记自发荧光 AF → H&E）的**图像级**质量与幻觉自动判定框架。它不生成、不修复，只回答"这一张 VS 图能不能拿去诊断"；核心是把待检的 VS 图送回一个反向的"H&E→AF"生成器，在 AF↔H&E 之间来回迭代 T 轮，把不确定性累积起来再分类。另有模型级版本 *M*-AQuA 与组织化学染色（HS）分支。
**核验**：2026-11-19 依 nature.com 开放获取 HTML 全文整理（Main、Results 全 4 小节、Discussion、Methods 全部、Data/Code availability、Extended Data Fig. 1–10 图注、Extended Data Table 1–2 及其网页表体）；补充材料 PDF（Supplementary Notes 1–3、Figs 1–12）**未读**，故其中数字一律不引。代码对照 GitHub `PORPHURA/AQuA` main 分支的 `README.md`、`functions.py`、`train.py`、`test.py`、`requirements.txt` 与 Zenodo 记录页。**未下载权重、未跑任何命令**，本页所有性能数字均为论文报告值。

| 项 | 内容 |
|---|---|
| 任务 | 虚拟染色图像的"可接受 / 不可接受"二分类；外加模型级评估（*M*-AQuA）与 HS H&E 质检 |
| 输入 / 输出 | 单张 VS H&E 视野（肾 1,424² px，肺 1,024² px）；输出标量置信分 $s\in[0,1]$，$s>\alpha$ 接受 |
| 不需要什么 | 不需要 HS 真值、不需要人工标注（推理阶段） |
| 训练标签从哪来 | VS 模型**不同 epoch 的 checkpoint**：收敛前（早停）算正样本，收敛后算负样本，中间的灰区排除 |
| 组织 / 规模 | 肾 10 例患者（7 训/验，3 测）；肺 29 例移植受者（18 训 VS/VAF，其中 7 训 AQuA；11 测） |
| 测试集 | 肾 988 张 VS 图（456 正 / 532 负）；肺 2,412 张（1,072 正 / 1,340 负） |
| 关键超参 | T=5 轮循环；集成 C=4（肾）/ 5（肺）；冻结 ResNet-50；75 epoch，lr $10^{-4}$ |
| 报告性能 | 肾 99.8% 准确率 / 99.8% 敏感度（$\alpha=0.5253$）；肺 97.8% / 99.5%（$\alpha=0.6263$） |
| 代码 | Zenodo [10.5281/zenodo.15122854](https://doi.org/10.5281/zenodo.15122854) → GitHub `PORPHURA/AQuA`，MIT |

## 原文摘要

> Histopathological staining of human tissue is essential for disease diagnosis. Recent advances in virtual tissue staining technologies using artificial intelligence alleviate some of the costly and tedious steps involved in traditional histochemical staining processes, permitting multiplexed staining and tissue preservation. However, potential hallucinations and artefacts in these virtually stained tissue images pose concerns, especially for the clinical uses of these approaches. Quality assessment of histology images by experts can be subjective. Here we present an autonomous quality and hallucination assessment method, AQuA, for virtual tissue staining and digital pathology. AQuA autonomously achieves 99.8% accuracy when detecting acceptable and unacceptable virtually stained tissue images without access to histochemically stained ground truth and presents an agreement of 98.5% with the manual assessments made by board-certified pathologists, including identifying realistic-looking images that could mislead diagnosticians. We demonstrate the wide adaptability of AQuA across various virtually and histochemically stained human tissue images. This framework enhances the reliability of virtual tissue staining and provides autonomous quality assurance for image generation and transformation tasks in digital pathology and computational imaging.

*来源：[期刊摘要页](https://www.nature.com/articles/s41551-025-01421-9)，逐字保留（该文为 CC BY 4.0 开放获取）。*

## 中文摘要

> 人体组织的组织病理染色是疾病诊断的基础。近年来，基于人工智能的虚拟组织染色技术缓解了传统组织化学染色流程中部分昂贵而繁琐的步骤，使多重染色与组织保存成为可能。然而，这些虚拟染色图像中潜在的幻觉与伪影令人担忧，尤其对于这类方法的临床使用而言。由专家对组织学图像做质量评估可能是主观的。本文提出一种面向虚拟组织染色与数字病理的自主质量与幻觉评估方法 AQuA。AQuA 在无法获取组织化学染色真值的情况下，自主地在检测"可接受 / 不可接受"的虚拟染色组织图像上达到 99.8% 的准确率，并与委员会认证病理医师的人工评估达到 98.5% 的一致率，其中包括识别出那些看起来逼真、却可能误导诊断者的图像。我们展示了 AQuA 在多种虚拟染色与组织化学染色的人体组织图像上的广泛适应性。该框架提升了虚拟组织染色的可靠性，并为数字病理与计算成像中的图像生成与变换任务提供了自主质量保证。

*译文：逐句对译上方原文摘要，未增删内容。*

## 0. 三分钟摘要

**一句话**：VS 生成器把 AF 变成 H&E；AQuA 再让一个反向生成器把 H&E 变回 AF，来回推 T 轮——如果这张 VS 图是"编"的，偏差会一轮轮放大，最后用一个冻结的 ResNet-50 读出"这张图能不能用"。

**问题**：虚拟染色在部署时**没有 HS 真值**，所以 MSE / PCC / PSNR 这类全参考指标根本用不了；更糟的是，即便有真值，它们也分不开（Fig. 2b、Fig. 4b：两组分布严重重叠）。人工把关则昂贵且主观——而这篇文章最狠的一条证据是：三位委员会认证病理医师在**没有 HS 参照**时，把带"真实感幻觉"的 VS 图判成了合格（Fig. 3c、Fig. 5c 黄区）。

**insight**：幻觉不是一个像素级误差，而是"生成器在某个方向上过度自信"。那就不要比对像素，而是**反复穿过同一个生成器**：VS 与 VAF 互为逆映射，真实组织在多轮循环里收敛到不动点，编造的内容在每一轮都被重新"解释"一次，误差与不一致逐步累积。累积量本身，就是不需要真值的幻觉信号。

**它到底做到了什么**：
- 肾：99.8% 准确率、99.8% 敏感度（~2,100 张测试 VS 图，$\alpha=0.5253$）；肺：97.8% / 99.5%（2,412 张，$\alpha=0.6263$）。
- 与三位病理医师一致率 98.5%（肾，$N=127$ 共识图）；AQuA 对好模型样本 **100% 接受**、对差模型样本 **100% 拒绝**，而医师漏掉了其中"真实感幻觉"那一批。
- 泛化：训练时只见过"早停 checkpoint"的失败模式，仍能 100% 分开**过拟合**模型的输出（Extended Data Fig. 2b）。
- 扩展到 HS：肺 HS 上 AQuA 100% vs TransMIL 68.2%（同样的 ResNet-50 骨干、同样 5 集成）；TCGA 上只用 10 张好片微调，盲测 989 张图准确率 87.6%。

### 实验先看什么

Fig. 2b/c（指标分不开 vs AQuA 分得开）→ Fig. 3c（医师被真实感幻觉骗过）→ Extended Data Table 1（T 与 C 的消融）→ Extended Data Fig. 2（跨失败模式泛化）→ Extended Data Fig. 6（TCGA 87.6%）。

## 1. 问题与核心判断

**两类幻觉，文章的整个论证都建立在这个划分上**（Main 第 2 段）：

- **技术性 / 不真实幻觉**：模糊、折叠、染色异常。与玻璃片时代的传统伪影同类，技师或病理医师肉眼能看出，现有数字病理质检工具（HistoQC 一类）也部分覆盖。
- **真实感幻觉**：用"不存在的组织成分"替换真实成分——例如良性切片里出现肿瘤细胞、肿瘤里出现不存在的核分裂象、微环境里出现不存在的淋巴细胞。**它看起来染色质量很好**，所以既能骗过肉眼，也能骗过基于"染色质量"设计的质检器。

**作者的核心判断**：现有工具全部是在**组织化学染色片**上训练/评测的（refs 31–34），没有一个是针对 VS 模型产生的幻觉；而"检测真实感幻觉"这件事，目前**没有可用工具**。所以问题不是"再做一个伪影检测器"，而是"在没有真值的前提下，判一张生成图是否可信"。

**为什么传统指标必然失效**：VS 是 GAN 训练出来的，GAN 的对抗损失刻意让输出在感知统计上贴近真值——这正是 MSE/PCC/PSNR 的结构盲区。加上部署时没有 HS，全参考指标连定义的入口都没有。

**和"不确定性估计"路线的区别**：AQuA 不是对生成器做贝叶斯近似或 MC dropout，而是**利用一对互逆网络的循环一致性**当探针（这条线来自同组前作：cycle-consistency 不确定性量化，*Intell. Comput.* 2023；以及 hologram 重建的 physics consistency，*Nat. Mach. Intell.* 2023）。它也不同于"多模型分歧"（如 I2I-Stain-Zoo 的深度集成方差）：分歧来自**同一个模型对同一内容的两轮不同解读**，不需要重训多个模型。

## 2. 术语（先用白话）

| 术语 | 白话 |
|---|---|
| VS（virtual staining） | 虚拟染色：用神经网络把无标记的 AF 图直接"染"成 H&E |
| VAF（virtual AF） | 反向网络：把 H&E 图"还原"成 AF（DAPI 通道） |
| AF | 自发荧光，本文用 DAPI 滤光片（377/50 nm 激发、447/60 nm 发射）拍的无标记图像 |
| HS | histochemical stain，传统化学染色片，本文里当"真值"用，只在评测/训练标签时出现 |
| VS–AF 循环 | $y_t=G_{VS}(x_t)$，$x_{t+1}=G_{VAF}(y_t)$；T 轮后得到一条 $T$ 长的序列 |
| 灰区（grey zone） | checkpoint 划分好/坏模型时，刻意排除的一段 epoch × 验证损失区间，避免标签含糊 |
| $C$（voters） | 集成个数：用不同随机种子训 10 个分类器，取验证集最优的 C 个做 soft voting |
| $\alpha$ | 图像级阈值，在验证集上取"敏感度 100%"的那一点，然后固定盲测 |
| $\beta$ | 模型级阈值，由 LDA 在两高斯等密度处解出 |
| *M*-AQuA | 模型级评估：把同一模型 N 张图的分数取平均，与 $\beta$ 比 |
| KL 散度 / t 统计量 | 用来量化"正负两群分数分得多开"，越大越好 |

## 3. 核心方法与数据流

```text
无标记 AF 图 x0 ──G_VS（已收敛的最好 checkpoint）──▶ VS H&E 图 y0（待评估）
y0 ──G_VAF──▶ x1（虚拟 AF） ──G_VS──▶ y1 ──G_VAF──▶ x2 …… 共 T 轮
    得到 (x0, y0, x1, y1, …, x_{T-1}, y_{T-1})
→ T 张 H&E + T 张 AF 分别过冻结的 ResNet-50（ImageNet-1K，去掉 fc）→ 每张 1 个 2048 维特征
→ 2T 个特征向量 → Conv1d(1×1) 合并成 1 个 2048 维 → ReLU
→ FC 2048→1024 → ReLU → FC 1024→2 → 置信分 s
→ C 个独立种子训练的同类分类器 soft voting 取平均
→ s > α（验证集取 100% 敏感度处）→ 接受；否则拒绝
```

### 3.1 序列是怎么构造的（Eq. 8）

$$x_{t+1}=G_{\mathrm{VAF}}(y_t),\quad t=0,\dots,T-2;\qquad y_t=G_{\mathrm{VS}}(x_t),\quad t=1,\dots,T-1$$

关键一点：$G_{VS}$ 与 $G_{VAF}$ 在这里**始终用预先固定的、验证损失最低的那组 checkpoint**，与输入 $x_0,y_0$ 无关。也就是说，AQuA 不评估"这对生成器本身好不好"，而是拿它们当**固定的探针**去检验一张外来图。

$G_{VAF}$ 的训练损失（Eq. 7）里除 L1、SSIM、TV 之外，还有两项**循环项**：$\delta_{VAF}L_1(G_{VS}(I_{VAF}),I_{HS})$ 与 $\varepsilon_{VAF}\log\frac{1+SSIM(G_{VS}(I_{VAF}),I_{HS})}{2}$（$\delta=0.05$，$\varepsilon=0.01$）。这解释了为什么循环能收敛：VAF 在训练时就被要求"还原出来的 AF 再染一次要像原 H&E"。

### 3.2 HS 分支的序列要错开一格（Eq. 9）

HS 片没有实测 AF，于是把 $x_0$ 换成 $G_{VAF}(y_0)$，序列变成 $(y_0,x_0,\dots,y_{T-1},x_{T-1})$：

$$x_t=G_{\mathrm{VAF}}(y_t),\ t=0,\dots,T-1;\qquad y_{t+1}=G_{\mathrm{VS}}(x_t),\ t=0,\dots,T-2$$

这是全篇最实用的工程细节之一：**同一套分类器可以吃“有 AF 的 VS 图”和“没 AF 的 HS 图”两种输入**，只差起始相位。

### 3.3 分类头与集成

- 骨干：ResNet-50（ImageNet-1K），**全程冻结**，只训后面的头。
- 头：文章 Fig. 1b 写的是"C 个 voting heads，每个含 temporal convolution + dense 层"；方法（Methods, Architecture）写的是两个 $1\times1$ 时序卷积 + ReLU，把 $f_s\in\mathbb{R}^{B\times2T\times C}$ 压成 $f_{st}\in\mathbb{R}^{B\times C}$，再两层 dense。
- 集成：训练 10 个不同随机种子的同构分类器，按验证集挑最优 C 个，soft voting 平均（Eq. 10）。**注意：代码里 C 个成员是完整独立模型，不是共享骨干的多头**（见 §5.3）。
- 训练：BCE（代码为二类交叉熵），Adam，lr $10^{-4}$，75 epoch，取验证准确率最好的 checkpoint。

### 3.4 标签是怎么造出来的（全篇最该盯住的设计）

Methods "Definition of good-staining and poor-staining models" 讲得很直白：

1. VS 模型每个 epoch 存一个 checkpoint，记下 epoch 数 $e$ 与验证损失 $l$；
2. 用验证损失的波动曲线定一个"收敛起点" $(e_0,l_0)$，并划出灰区——肾 $e\in[e_0-50,e_0+50]$ 且 $l\in[0.97l_0,1.03l_0]$，肺 $e\in[e_0-100,e_0+100]$ 且同损失带宽；
3. 灰区外，$e<e_0$ 且 $l>l_0$ 的 checkpoint = **差模型（正样本）**；$e>e_0$ 且 $l<l_0$ = **好模型（负样本）**；
4. 另造一类"过拟合模型"：只在很小的训练子集上训，泛化崩掉（缺大量核、模糊），作为**训练时没见过**的正样本用于泛化测试；
5. 一位委员会认证病理医师复核了这套模型定义的合理性。

所以：**AQuA 的正标签 = "这张图出自一个早停/过拟合的生成器"，负标签 = "出自一个收敛良好的生成器"**。它不是"这张图里有几个编造的细胞"的标注，而是**模型来源的二分类被当作图像标签**。这一点直接决定了后面所有数字该怎么读（见 §7 我的看法 1）。

### 3.5 模型级：*M*-AQuA

对同一个待检模型取 $N$ 张图，算平均置信分 $\bar s$；用训练集里好/坏模型两群分数各拟一个高斯（Eq. 18），LDA 在两者概率密度相等处解出 $\beta$（Eq. 19），$\bar s$ 与 $\beta$ 比即"这个模型该不该进流程"。用途定位很清楚：**AQuA 决定单张图能不能用，*M*-AQuA 决定这个模型能不能上线／要不要重训**，后者调用频率低得多。

### 3.6 数据与训练成本（Methods）

- VS 生成器：五层 U-Net + 判别器，损失 $\alpha L_1-\beta\log_{10}\frac{1+SSIM}{2}+\gamma TV+\delta BCE$，$\alpha,\beta,\gamma,\delta=(1,0.05,0.01,0.01)$；生成器:判别器更新比 3:1，Adam，lr $10^{-5}$，batch 16，渐进式训练。
- 肾 VS 训练 ~20 h、750 epoch；肺 ~90 h、1,263 epoch。AQuA 分类器训练 ~7 h（单张 RTX 3090）。
- 配准：WSI 级刚体配准（互相关最大化）→ 局部 FOV 多模态配准 → 基于局部相关匹配的弹性配准；为辅助对齐，还先训了一个粗略 VS 网络。
- 配对 patch：肾 1,054 对（1,424²），肺 1,068 对（1,024²），9:1 分训/验。

## 4. 实验与证据

### 4.1 主结果：图像级二分类

| 组织 | 测试图数 | 阈值 $\alpha$ | 准确率 | 敏感度 | 曲线 |
|---|---|---|---|---|---|
| 肾 | ~2,100（正文；Methods 写 988：456 正 / 532 负） | 0.5253 | **99.8%** | **99.8%** | ROC / PR 的 AUC 均 ≈1.0（Supplementary Fig. 1a，**未读**，此处按正文表述） |
| 肺 | 2,412（1,072 正 / 1,340 负） | 0.6263 | **97.8%** | **99.5%** | Supplementary Fig. 1b（未读） |

对照：MSE、PCC、PSNR 在两组间严重重叠，单阈值切不开（Fig. 2b / Fig. 4b）；AQuA 在 t 统计量与 KL 散度上都显著更高（Fig. 2d / Fig. 4d，**论文只画箱线图，未在正文给数值**）。

### 4.2 与三位病理医师的盲比

| | 共识图数 | 好模型样本 | 差模型样本 | AQuA | 医师 |
|---|---|---|---|---|---|
| 肾（Fig. 3） | $N=127$ | $N_G=66$ | $N_P=61$ | 好样本 100% 接受，差样本 100% 拒绝 | 与 AQuA 分类一致率 98.5%（三项分项 + 均分） |
| 肺（Fig. 5） | $N=99$ | $N_G=59$（正文） | $N_P=40$ | 同上，全对 | 好样本中接受 98.3%，仅 1 例分歧（几乎全是红细胞） |

评分协议：每张图按核、胞质、细胞外间隙三项各打 1–4 分，并给 pass/fail；只在三位医师都一致的图上算共识。合格区间设为均分 $(2,4]$。

**这一节的关键不是 100%，而是"黄区"**：由差模型生成的、看起来染色很好的真实感幻觉图，AQuA 全部拒绝，医师全部放过。Extended Data Fig. 1a 给了具体例子——肾小球与肾小管里若干核在 VS 图上消失；肺里 2 型肺泡细胞与巨噬细胞染色不足。Extended Data Fig. 3 更细：VS 图上出现"模仿非典型核分裂的细胞幻觉""黏液样变""大量炭末色素"，而 HS 片上分别是正常细胞、正常间质、极少量色素。

**唯一一例假阴性**（Extended Data Fig. 1b）：一张几乎全由红细胞加散在淋巴细胞构成的肺 FOV，AQuA 接受、医师拒绝。作者归因于训练集正常肺组织里红细胞代表性不足。

**诊断后果的实例**（Extended Data Fig. 4，肺移植排斥）：HS 片见明显单核细胞浸润 → 急性细胞性排斥。差模型 A 给出颜色异常、核边界模糊的图（不可用）；差模型 B **看起来染色质量很好，但漏掉大量淋巴细胞核**，会把"排斥"读成"无排斥"；好模型的输出与 HS 一致。这是全文最有说服力的一段——幻觉的代价被具体化了。

### 4.3 跨失败模式泛化

| 设置 | 结果 |
|---|---|
| 训练只见过"早停"正样本，测试"过拟合"模型（肾，$N=76$ FOV，Extended Data Fig. 2b） | 三组（好 / 早停 / 过拟合）被 $\beta$ 完全分开 |
| *M*-AQuA 在 20 个过拟合 + 20 个早停 + 20 个好模型上（Extended Data Fig. 2c；图注写 $M=40$、1:1，与正文 60 个不一致） | 模型级 100% 准确率 |
| 跨器官：肾模型直接测肺、肺模型直接测肾（Supplementary Fig. 7a,b） | 敏感度 98.9% |
| 跨器官 + 微调 | 与"在目标组织上从头训"相当（Supplementary Fig. 7c,d；**未读**，按正文表述） |

### 4.4 *M*-AQuA 的可扩展性（Fig. 6）

10 个肺 VS 模型（5 好 / 5 差），每模型随机抽 $N$ 张图，重复 $R=100$ 次：

- $N$ 从 2 到 20，$\bar s$ 分布逐步收窄；**即使 $N=2$ 也能被 $\beta=0.6159$ 完全分开**；
- 模型数 $M$ 增大时，好/差两组仍 100% 正确判别；KL 散度随 $N$、$M$ 单调改善。

实用含义：一个模型上线前的验收，抽 20 张图就够。

### 4.5 HS（组织化学染色）分支

| 设置 | 数据 | 结果 |
|---|---|---|
| 肺 HS 图像级 | 100 训 / 16 验 / 220 测（110 正 / 110 负，2,048² FOV） | AQuA **100%**；TransMIL（同骨干、同 5 集成）**68.2%**；可训练参数 2.1M vs 3.2M |
| 手工指标 | 同一测试集 | 归一化核计数、平均核面积分不开（Fig. 7b） |
| TCGA 肺 | 677 张 WSI 由病理医师标注 → 395 好 / 66 坏（461 张，49 个来源站点）；仅用 10 张好片微调（8 训 / 2 验）；盲测 989 张图（519 好 / 470 坏，来自余下 451 张 WSI） | **87.6%** |
| WSI 级对照 | 一张差片 + 一张好片 | AQuA 与医师判断最一致；HistoQC 误拒高质量区域，TransMIL 亦误拒；两者都没抓住"缺苏木素""小片模糊""游离组织碎片""红细胞遮蔽肺结构" |

注意 87.6% 这一列**不是在 VS 图上**，而是在 49 个不同站点、不同制片协议、不同扫描仪的真实 HS 片上——文章自己强调"VS/VAF 都没有针对 TCGA 分布微调"。

### 4.6 消融（Extended Data Table 1，T × C 网格）

| 配置 | 肺 准确率 / 敏感度 | 肾 准确率 / 敏感度 |
|---|---|---|
| T=1, C=1（≈纯 ResNet 基线） | 0.8856 / 0.8284 | 0.9302 / 0.9846 |
| T=1, C=5 | 0.9655 / 0.9869 | 0.9838 / 0.9846 |
| T=5, C=1 | 0.9005 / 0.8694 | **0.4615** / 1.0000 |
| T=5, C=5 | 0.9805 / 0.9953 | 0.9960 / 0.9934 |

这张表值得逐行读：

- **循环的增益是有限的**：肺 T=1,C=5 → T=5,C=5 只从 96.55% 到 98.05%（+1.5 点），肾从 98.38% 到 99.60%（+1.2 点）。
- **集成的增益更大**：肺 T=1,C=1 → T=1,C=5 是 +8 点，肾 +5.4 点。
- **T=5 配单个分类器会崩**：肾 0.4615 且敏感度 1.0000 —— 即"全判为正"，说明多轮循环后的特征对单模型来说非常难分，必须靠集成压住方差。作者在 Discussion 里说集成"比堆网络规模更划算"，Extended Data Table 2 给了另一面：预训练骨干 2.1M 可训参数、5 min/epoch；从头训 25.6M、60 min/epoch。

### 4.7 速度

- 分类器推理 1 ms / 张（712² FOV，batch 30，T=5）；VS+VAF 推理 ~2.6 ms / 张（1,024²，batch 8）。
- 但 Fig. 1a 的图注写"~1–2 s per image FOV"。**两者差三个数量级**，见 §7。

## 5. 复现入口

### 5.1 官方代码的真实状态（2026-11-19 已核对）

- **Code availability**：Zenodo [10.5281/zenodo.15122854](https://doi.org/10.5281/zenodo.15122854)，Python 3.9.16 + PyTorch 1.13.0。Zenodo 记录标题 "PORPHURA/AQuA: Release AIP"，v1.0，2025-04-02，压缩包仅 **17.3 kB**，并注明对应 GitHub `https://github.com/PORPHURA/AQuA/tree/v1.0`。
- **GitHub**：`PORPHURA/AQuA`，MIT，Python。根目录只有 6 个文件：`LICENSE`、`README.md`、`functions.py`、`train.py`、`test.py`、`requirements.txt`。**没有 `ckpts/`、没有 `demo_data/`**——要另下。
- **README 说有什么**：`functions.py` 含 ResNet 骨干与分类头；`./ckpts` 含 **肺** C=5 / T=5 预训练集成；`./demo_data/test_vs_54`（差模型）与 `test_vs_1098`（好模型）是**已经算好的循环推理结果**。
- **权重与演示数据**：Google Drive 文件夹（README 给出），另有 Zenodo 数据集记录 [10.5281/zenodo.15107104](https://zenodo.org/records/15107104)：`AQUA_demo_data.zip` 1.2 GB、`VAS_VAF_demo_data.zip` 487.7 MB、`TCGA_Dataset.zip` 20.8 kB。**未下载**。
- **缺什么**（这是复现真正的门槛）：VS 与 VAF 两个生成器的**训练代码不在仓库里**。README 只把 VS 训练代码指向同组前作 `liyuzhu1998/Autopsy-Virtual-Staining`，VAF 训练需要"参考 Methods"。而 `test.py` 直接吃 `.mat` 里预计算好的循环输出——**没有 G_VS 与 G_VAF 的权重，AQuA 只能跑演示数据，不能处理你自己的 VS 图**。肺的 checkpoint 有说明，**肾的 checkpoint 未在 README 中出现，未确认**。

### 5.2 输入格式（读代码得到，比论文描述更具体）

`.mat` 需要四个变量（`functions.py` 的 `CCUQDataset` 文档串）：

| 变量 | 形状 | 含义 |
|---|---|---|
| `he_outputs` | `[T+1, 3, H, W]` | HE 域循环推理结果 |
| `dapi_outputs` | `[T+1, 1, H, W]` | DAPI 域循环结果，第 0 帧是实测 |
| `tissue_masks` | `[T+1, H, W]` | 由 HE 图得到的组织掩码 |
| `nuclei_masks` | `[T+1, H, W]` | 由 HE 图得到的核掩码 |

### 5.3 论文 ↔ 代码的出入（读代码时要留意）

1. **通道数**：`test.py` 用 `ch_per_img=3`，把 1 通道 DAPI 复制成 3 通道，与 HE RGB 拼成 6 通道——**组织/核掩码没用上**；`functions.py` 里另有 `ch_per_img=1` 的 4 通道变体（stain-vector 分解的 HE + DAPI + 两个掩码），默认测试脚本不用它。论文方法只描述"T 张 HE + T 张 AF 特征"，没提掩码分支。
2. **时序层数**：论文写"两个 1×1 时序卷积层 + ReLU"；`ResNet_rep` 实现里只有一个 `Conv1d(in_imgs*num_rep, 1, kernel_size=1)` + ReLU（`merge`/`merge_act`），之后直接全连接。
3. **"C 个 voting heads"**：代码是 C 个**完整独立模型**（`N_REP=10`，`VOTERS=[0..4]` 取 5 个），各自加载 `3dcnn_best.pth` 后 soft voting；不是共享骨干的多头。
4. **标签方向反了**：`test.py` 里 `neg_ckpts=[1098]  # labeled as 1s`、`pos_ckpts=[54]  # labeled as 0s`，输出取 `y_prob[:,1]`。即代码的 1 = "好"，0 = "差"，与论文"positive = 幻觉"的命名相反。阈值 $\alpha$ 的方向也因此要在代码里核对一遍再用。
5. **两个分类头并存**：`ResNet_rep`（2 类 + 交叉熵，`train.py`/`test.py` 用）与 `ResNet_rep_1`（sigmoid 单值再 `concat[x, 1-x]`），后者在训练脚本里没有被调用。

### 5.4 复现该怎么下手

想在自己的 VS 流水线上用 AQuA，最省的一条路不是重训分类器，而是**先造 VAF**：你的 VS 生成器 $G_{VS}$ 已有，按 Eq. 7 训一个 $G_{VAF}$（含循环项），跑 T=5 轮得到 `.mat`，然后直接套官方 `ckpts`（若组织类型接近肺）或重训 75 epoch 的分类器。**这一步的代价是再造一个生成器**，不是训练一个质检器——这是 AQuA 与"事后打分"类方法（如 NHP）最本质的差别。

## 6. 前后关联

- **[NHP](101-nhp.md)**：最直接的对标。NHP 取生成器中间层特征与干净校准集比 KNN 距离，**事后、patch 级、无需重训、无需额外的反向网络**；AQuA 是**图像级**判定、需要一对 VS/VAF、需要按模型好坏造标签。一个回答"这块哪里可疑"，一个回答"这张能不能用"。
- **[HARP](102-harp.md)**：检测—定位—修复的完整伪影链。AQuA 只做闸门不做修复，但它处理的是 HARP 没覆盖的一类问题：**看起来修复得很好、其实内容是编的**。
- **[I2I-Stain-Zoo](86-reliable-histological-staining.md)**：同样做虚拟染色的可靠性，但走的是"多种架构 × 规模 × 数据量 + 深度集成不确定性"的基准路线；它的结论是集成分歧**几乎不能做逐像素定位**——与 AQuA 的"整图一分"形成互补的两条证据链。
- **[HalluGen](../diffusion/11-hallugen.md)**：思路正好镜像。HalluGen 主动往扩散采样里注入可控幻觉来做评测；AQuA 不造幻觉，而是把**真实训练过程中的失败 checkpoint** 当成幻觉来源。两者可以作为"合成 vs 真实失败"两种标签来源对照。
- **修复方法线**：[RestorePath](49-restorepath.md)、[ArtiFusion](55-artifusion.md)、[ArtiDiffuser](57-artidiffuser.md)、[LatentArtiFusion](72-latentartifusion.md)、[SuperDiff](78-histo-diffusion.md)。这些方法都只报感知指标或分割指标；AQuA 提供了一个可在无真值时挂上去的门控，思路可移植（把"伪影修复器 + 其逆/退化模型"当成一对循环）。
- **[Yang et al., MedIA 2026](60-unsupervised-artifact-restoration.md)** 与 **[DiffusionQC](74-diffusionqc.md)**：同样在无真值条件下做检测/质检，可对照它们如何定义"坏"。

### 与本人研究的关系（明确区分：以下是个人判断，不是论文主张）

我关注的是扩散修复在细胞级别的**编造（fabrication）与抹除（erasure）**，且要求在没有干净原图时把这类错误挑出来。AQuA 与这个目标有三处结构性差距：

1. **粒度**：它是整图一个标量。细胞级定位只有 Grad-CAM 的粗热图，作者自己也承认"小范围的异常在像素差图上都看不出来"。直接拿它当 cell-level 检测器会失败。
2. **标签语义**：它的"正"是"这图出自早停模型"，不是"这里编了一个细胞"。于是它学到的东西里，"模型风格指纹"与"内容错误"是混在一起的——这恰好是我在做的任务里最需要拆开的两件事。
3. **可迁移的部分**：VAF 循环给的启发很实在——**不必比较像素，而是比较"同一内容被重新解释后的稳定性"**。如果我的修复器有可近似的退化算子（失焦、低倍下采样），可以做类似的多轮"修复↔退化"迭代，把每轮的偏离累积成信号。这与"用输出计数做基线"的老问题是正交的：它提供的是**输入的稳定性证据**，而不是输出的统计量。

## 7. 局限与可检验问题

**作者承认的**：

- 唯一假阴性来自红细胞：训练集正常肺组织里 RBC 代表性不足，AQuA 接受了整片都是红细胞的 FOV（Extended Data Fig. 1b）。
- 好 VS 图与 HS 图之间仍有形态差异，作者认为量级小于同一组织块相邻切片间的天然差异（Supplementary Fig. 2 / Note 2，**未读**）。
- 跨新组织类型时，微调后性能才与从头训持平（不微调的直接跨器官测试敏感度 98.9%，但准确率等指标在 Supplementary Fig. 7，未读）。
- 未给出结果的能力：stain-to-stain 变换、染色归一化，只写"原则上可扩展"；对抗攻击鲁棒性也只是"原则上"。
- 依赖一对已训好的 VS/VAF 模型（这一点作者写在方法里，但没当成局限讨论）。

**我的看法（作者没写的）**：

1. **标签是"模型级"的，被当成"图像级"用，风险在这儿**。同一张 AF 图，被差模型染出来就是正样本、被好模型染出来就是负样本；但图像本身的难度没有被控制（有的 FOV 天生难染）。于是 99.8% 里有多少是"识别出早停模型的系统性失败风格"（模糊、少核、色偏），有多少是"识别出细微编造"，论文没有拆。可检验的做法：在同一批"都已收敛但用不同 seed / 不同数据子集"训出的好模型之间做区分测试——如果 AQuA 也分得开，说明它在读模型身份而非内容错误。
2. **与病理医师的比较有一处逻辑缝**。医师只看图、不给 HS；而 AQuA 的负标签直接来自"这图出自好模型"。所以"医师接受、AQuA 拒绝"的样本被解释成医师漏检，但其中一部分可能只是 AQuA 认出了"这不是我训练时那个好模型的风格"。要排除这个解释，需要交叉测试（好模型的 FOV 混进差模型的批次）或给出同一模型的种内/种间对比。
3. **真实感幻觉的判定仍是"与 HS 不一致"**。图 3c/5c 的黄区是靠 HS 参照事后认定的；部署时这个认定过程不存在。所以这套验证实际上证明了"标签定义能被执行"，还没证明"在执行时能覆盖真实的临床错误类型"。
4. **跨中心泛化只在 HS 分支有证据**。87.6% 是 TCGA 真实染色片上的数字；VS 分支的跨中心、跨扫描仪测试没有出现。
5. **速度口径矛盾**：Fig. 1a 说 ~1–2 s/FOV，Methods 说分类器 1 ms + 生成器 2.6 ms。差了三个数量级，部署成本必须以代码实测为准，不能引用图注。
6. **论文内部还有几处对不上**（都已核对原文）：肾测试集 Results 写"~2,100 张"，Methods 写 988 张（456/532）；Fig. 5b 图注写 $N_G=66$，正文写 59（59+40=99，图注应是笔误）；Fig. 2c 标 C=4，而 Extended Data Table 1 只扫了 C∈{1,3,5}；Extended Data Fig. 2c 图注 $M=40$，正文说 20+20+20 个模型。

**可以马上做的检验**（都不需要重训生成器）：

- 用官方 demo 数据复现 Fig. 2c 的分数分布与 99.8%，确认 α 的方向与代码标签反转一致——这是判断"能不能用这个仓库"的最小实验。
- 把 T=1 与 T=5 的分数差当作"循环带来的那部分信号"，与 C=1 与 C=5 的差（集成带来的）比较，验证 §4.6 的结论：**主要增益来自集成而非循环**。
- 在带细胞级标注的测试集上，算 AQuA 整图分数与"实际编造细胞数/抹除细胞数"的相关性——如果接近 0，就说明它不能替代细胞级检测，只能做前置过滤。

## 8. 来源与版本

- 正文（开放获取，CC BY 4.0）：<https://www.nature.com/articles/s41551-025-01421-9>；PDF：<https://www.nature.com/articles/s41551-025-01421-9.pdf>
- Extended Data Table 1（T × C）：<https://www.nature.com/articles/s41551-025-01421-9/tables/1>；Table 2（预训练骨干的训练开销）：<https://www.nature.com/articles/s41551-025-01421-9/tables/2>
- 代码：Zenodo <https://doi.org/10.5281/zenodo.15122854>；GitHub <https://github.com/PORPHURA/AQuA>（MIT）
- 演示数据与 TCGA 标注：Zenodo <https://doi.org/10.5281/zenodo.15107104>
- 权重（Google Drive）：见仓库 README 链接（**未下载**）
- 组内前作（循环一致性不确定性）：Huang et al., *Intell. Comput.* **2**, 0071 (2023)；Huang et al., *Nat. Mach. Intell.* **5**, 895–907 (2023)
- 相关方法：HistoQC（Janowczyk et al., *JCO Clin. Cancer Inform.* 2019）；TransMIL（Shao et al., NeurIPS 2021）
- 版本说明：本文引用的是 2025-06-16 上线的版本记录（Version of record）；补充材料与审稿文件未读。
