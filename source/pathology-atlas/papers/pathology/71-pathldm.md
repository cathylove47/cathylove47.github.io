# 71｜PathLDM：把病理报告压缩成 154 个 token，当作潜空间扩散的条件

**论文**：PathLDM: Text conditioned Latent Diffusion Model for Histopathology；WACV 2024（CVF Open Access 页面标注 "identical to the accepted version"）；IEEE 正式版 pp. 5170–5179，DOI 10.1109/WACV57701.2024.00510；arXiv:2309.00748。  
**定位**：文本条件的小图（256×256）生成与合成数据增广，不是修复、不是大图/WSI 生成。它是 [LRDM](56-lrdm.md) 等后续工作直接沿用的 VAE 配置来源。  
**精读核验**：2026-10-22 核对 CVF 正式版 PDF 全文（§1–6、Table 1–6、§5 消融）与官方仓库 README（数据、权重、训练/采样入口）；未下载权重、未训练、未复算 FID。

## 原文摘要

> To achieve high-quality results, diffusion models must be trained on large datasets. This can be notably prohibitive for models in specialized domains, such as computational pathology. Conditioning on labeled data is known to help in data-efficient model training. Therefore, histopathology reports, which are rich in valuable clinical information, are an ideal choice as guidance for a histopathology generative model. In this paper, we introduce PathLDM, the first text-conditioned Latent Diffusion Model tailored for generating high-quality histopathology images. Leveraging the rich contextual information provided by pathology text reports, our approach fuses image and textual data to enhance the generation process. By utilizing GPT's capabilities to distill and summarize complex text reports, we establish an effective conditioning mechanism. Through strategic conditioning and necessary architectural enhancements, we achieved a SoTA FID score of 7.64 for text-to-image generation on the TCGA-BRCA dataset, significantly outperforming the closest text-conditioned competitor with FID 30.1.

*来源：[CVF Open Access 正式版 PDF](https://openaccess.thecvf.com/content/WACV2024/papers/Yellapragada_PathLDM_Text_Conditioned_Latent_Diffusion_Model_for_Histopathology_WACV_2024_paper.pdf)，摘要完整照录。*

**摘要中文解释**：扩散模型要大量数据才出好结果，病理这种专门领域拿不到那么多。已知“有标签的条件”能让训练更省数据，而病理报告正好是信息密集的现成文本，于是作者做了第一个文本条件的病理潜扩散模型：用 GPT 把冗长的报告蒸馏成摘要，作为条件融合进生成过程；再配合若干架构改动，在 TCGA-BRCA 上做出 FID 7.64，明显好于最接近的文本条件对手（FID 30.1）。

## 1. 三分钟摘要与推荐理由

**具体问题**：你有一批 TCGA 乳腺癌 WSI 和对应的病理报告，但没有细粒度标签。想让扩散模型生成“符合这份报告描述的组织”，怎么办？

**输入/输出**：输入 = 一段由报告摘要 + patch 级肿瘤/TIL 等级拼成的短句，例如 `"high tumor; low til; <GPT summary>"`；输出 = 一张 256×256、10× 放大倍率的 H&E patch。注意条件里的“报告”是**整张切片一份**，不是每个 patch 一条描述——这是理解这篇局限的关键。

**核心机制（一句话）**：把报告压成 ~150 token 的摘要，用 PLIP（病理版 CLIP）编码成向量，通过 cross-attention 注入 U-Net；再把 VAE 的下采样从 8 改成 4、U-Net 用 ImageNet 权重初始化，让潜空间里的细胞结构不被压没。

**四个可迁移的决策**：

1. **条件选“文本报告”而不是类别标签**：类别只有 4 类（肿瘤×TIL），文本能携带亚型、分级、受体状态等语义。
2. **两级提示工程**：先让 GPT 罗列要点，再让它写 75 词摘要（chain-of-thought），比一次性摘要更稳；5% 摘要经病理医生抽查。
3. **VAE 下采样因子是生成质量的一等公民**：f=8（32×32×4）→ f=4（64×64×3），FID 48.14→39.72，重建 SSIM 0.874→0.961。
4. **编码器要换域内模型**：OpenAI CLIP → PLIP，FID 10.64→7.64，纯靠换文本编码器。

**必须保留的怀疑**：FID 7.64 是在**训练集提示**上算的（§6 明确说没用 held-out 报告）；FID 对病理本就争议大；而且这套“每张 WSI 一个摘要”的条件，理论上允许多个 patch 共享同一句描述，语义对齐是粗粒度的。

## 2. 问题及研究位置

**任务定义**：条件图像生成 + 合成数据增广。评价三件事：生成分布像不像（FID）、只拿合成数据能不能训出可用分类器（CAS）、加进真实数据有没有增益。

**前人局限（§1–2）**：

| 工作 | 数据 | 条件 | 局限 |
|---|---|---|---|
| Moghadam et al. [28] | 33,777 张低级别胶质瘤 patch | 类别 | 像素级扩散，慢；只能 128×128 |
| Medfusion [29] | 19,558 张 CRC | 类别 | 8 通道 VAE，无法用 SD 的 U-Net 预训练权重初始化 |
| ViT-DAE [48] | NCT-CRC + PCam | 每类一个无条件模型 | 类别间不共享参数，效率低 |

PathLDM 的位置：**第一个把文本报告当条件**的病理 LDM，并顺手把 VAE/U-Net/文本编码器三个部件都做了针对性改造。它不是“病理基础模型”——数据仅 TCGA-BRCA 一个癌种。

**术语先说明**（后文直接用）：

- **LDM（潜扩散）**：先用 VAE 把图像压到低维 latent，在 latent 上加噪/去噪，最后解码回像素。省算力的代价是细节受 VAE 重建上限约束。
- **下采样因子 f**：256×256 图压成 256/f 的 latent。f 越大越省显存，但细胞级细节丢得越多。
- **CFG（classifier-free guidance）**：同时训条件与无条件两支，采样时用 $\tilde{\epsilon}=(1+\omega)\epsilon_\theta(z_t,c)-\omega\epsilon_\theta(z_t,\varnothing)$ 放大条件影响；$\omega$ 越大越听提示、越不多样。
- **DDIM**：确定性采样器，本文用 50 步。
- **FID**：用 Inception 特征比较真实/生成分布的距离，越低越好，但对医学图像的可解释性有限。
- **CAS（Classification Accuracy Score）**：只用合成数据训分类器，再到真实验证集上测准确率——比 FID 更贴近“合成数据有没有用”。

## 3. 核心方法和数据流

```text
TCGA-BRCA WSI（1,136 张） + 病理报告 PDF
  → 报告 OCR（沿用 Kefeli & Tatonetti 的 1,034 份 BRCA 文本）
  → GPT-3.5-turbo 两次调用：先列要点，再写 75 词摘要（max_tokens=154）
  → 每张 WSI 一份摘要

WSI → DSMIL 切 256×256 patch @10×（3.2M 训练 patch）
  → 用 wsinfer（作者引用的 [1] TIL 模型与 [24] 肿瘤检测模型）得到每个 patch 的 Tumor / TIL 概率
  → 阈值 0.5 离散成 Low/High
  → 拼成 caption："high tumor; low til; <summary>"

caption → PLIP 文本编码器（77 token 窗口，两段拼接 + 循环位置编码）
        → cross-attention 的 K/V
图像 → 微调后的 VAE（f=4，latent 64×64×3）→ 加噪 latent
        → U-Net（ImageNet 类别条件权重初始化）预测噪声
训练：只训 U-Net；VAE 与文本编码器冻结
推理：随机 latent → 50 步 DDIM + CFG(ω=1.75) → VAE 解码 → 256×256 patch
```

**为什么“只训 U-Net”**：VAE 负责保真（重建），文本编码器负责语义（域内知识），二者冻结可省大量算力，也让“换编码器/换 VAE”的消融变得干净——Table 1 正是这么做的。

**CLIP 77 token 的坑（§3.2.3）**：CLIP 最大上下文 77 token，而摘要长约 154 token。作者把序列切成两半分别编码再拼接，等价于位置编码每 77 个 token 循环一次，并加 causal mask。这是一个工程妥协：语义上“后半句”与“前半句”的相对位置信息被削弱了。

**条件的融合方式（§3.2.2）**：整片级信息（报告摘要）+ patch 级信息（肿瘤/TIL 等级）拼进同一句话。这是全文最巧妙也最脆弱的一步：patch 级标签其实来自另一个分类器的预测，不是人工标注，误差会直接进入条件。

## 4. 论文证据与实验范围

**数据（§4.1）**：正文写 TCGA-BRCA 共 1,136 张 WSI，同时写 977 训练 / 199 测试；但 977+199=1,176，与总数不相符。这里保留原文差异，不擅自把训练数改成 937；复现需核对作者的 slide 清单。图块为 256×256、10×，训练共 3.2M patch；报告平均约 2,800 字符（≈700 BPE token）。

**训练配置（§4）**：3×NVIDIA RTX 8000，每卡 batch 48；lr 2×10⁻⁵，10,000 warmup；DDIM 50 步；CFG 尺度经 0.1–3 扫描后取 1.75。作者配置，非最低显存要求。

**逐项消融（Table 1，FID↓，作者报告，未复算）**：

| VAE | U-Net 初始化 | 条件网络 | 条件模态 | FID |
|---|---|---|---|---:|
| vq-f8 | 从零 | 类别嵌入 | Tumor+TIL（4 类） | 48.14 |
| vq-f4 | 从零 | 类别嵌入 | Tumor+TIL | 39.72 |
| vq-f4 | ImageNet 微调 | 类别嵌入 | Tumor+TIL | 29.45 |
| vq-f4 | ImageNet 微调 | OpenAI CLIP | 报告+Tumor+TIL（154 token） | 10.64 |
| vq-f4 | ImageNet 微调 | **PLIP** | 报告+Tumor+TIL | **7.64** |

这张表把不同改动的收益分开了：在已有架构改动的基础上，从类别条件改为报告文本条件，FID 又从 29.45 降到 10.64；文本编码器换为 PLIP 后进一步到 7.64。按 FID 绝对下降计算，48.14→29.45 为 18.69，29.45→10.64 为 18.81；两者量级相近，支持“条件设计是关键贡献”，但不能据此把贡献拆成可普遍相加的因果份额。

**VAE 重建（Table 2，256×256 输入）**：

| VAE | latent | f | SSIM↑ | MSE↓ |
|---|---|---:|---:|---:|
| Stable Diffusion | 32×32×4 | 8 | 0.874 | 25.795 |
| Medfusion | 32×32×8 | 8 | 0.891 | 21.401 |
| PathLDM | 64×64×3 | 4 | **0.961** | **11.503** |

补充证据（Table 3）：DeepGlobe 卫星图上的重建 SSIM 同样是 f=4 优于 f=8（0.958 vs 0.845）。这提供了另一个数据集上的支持，但不足以证明所有任务都应选择更小下采样因子；分辨率与计算成本仍需权衡。

**与其他方法比（Table 4，10k 合成图算 FID）**：

| 方法 | 条件 | FID↓ |
|---|---|---:|
| Moghadam et al. | Tumor+TIL | 105.81 |
| Medfusion | Tumor+TIL | 46.49 |
| Medfusion | 报告+Tumor+TIL | 39.56 |
| Stable Diffusion | 报告+Tumor+TIL | 30.1 |
| Stable Diffusion | Tumor+TIL | 29.45 |
| PathLDM | 报告+Tumor+TIL | **7.64** |

**可比性提醒**：Moghadam 输出 128×128，其余 256×256；Medfusion 从零训练（8 通道 VAE 无法用 SD 权重）。作者也承认这几项不是严格同条件比较，FID 的绝对差距不能当成"方法差 4 倍"。

**CAS（Table 5，ResNet-34，合成 3M patch 训练）**：真实 90.31%、Medfusion 合成 79.12%、PathLDM 合成 83.32%、真实+合成 **90.74%**。作者自己的解读是"肿瘤分类任务本身较简单，所以增广只涨 0.43 点"——这是诚实的负向解读，值得记住：合成数据在简单任务上看不出增益，不代表没用。

**文本条件消融（Table 6）**：基线 7.64；把每张 patch 的摘要换成**别的 WSI 的随机摘要** → FID 22.16（条件必须对得上）；每张 WSI 生成 5 份摘要、每 patch 随机选一份 → 7.34（略有提升）。第一条是全文最强的"条件真的被用上了"的证据。

**作者自述局限（§6）**：生成时使用训练集中的提示，没有用 held-out 报告。因此 FID 7.64 支持的是当前提示设置下的结果，尚不能回答模型对未见报告的泛化如何；论文没有量化“换成未见报告后下降多少”。

**一处文本不一致**：结论段写 "FID score of 7.76"，与摘要/Table 1/Table 4 的 7.64 冲突，按表格记 7.64。

## 5. 复现与审计重点

1. **官方仓库结构已核**：`configs/latent-diffusion/text_cond/plip_imagenet_finetune.yaml` 训练配置、`ldm/data/text_cond/tumor_til_in_text.py` 数据集类、`main.py` 训练入口、`example_sampling.ipynb` 采样入口、`environment.yaml` conda 环境；代码基于 CompVis/latent-diffusion。
2. **权重可得**：README 列出三个条件的预训练权重（类别嵌入 FID 29.45 / OpenAI CLIP 10.64 / PLIP 7.64），均为 Google Drive 链接；**VAE 不在仓库里**，要按原 LDM 仓库说明另下。
3. **数据可得但需自建流程**：TCGA-BRCA patch、caption、Tumor/TIL 概率打包在 Google Drive；WSI 本体要从 GDC 下载（约 1TB，数天）；切图用 DSMIL 的 `deepzoom_tiler.py -m 0 -b 10`；Tumor/TIL 概率用 `wsinfer` 跑，再按重叠 patch 取平均对齐到 10× patch。报告文本来自 `tatonetti-lab/tcga-path-reports`，摘要由 GPT-3.5 生成（另附 Google Drive）。
4. **训练与采样命令明确**：`python main.py -t --gpus 0,1 --base configs/latent-diffusion/text_cond/plip_imagenet_finetune.yaml`；采样在 notebook 里。本次未运行。
5. **首个可检验实验**：固定 VAE 与 U-Net 权重，只换文本编码器（CLIP / PLIP / CONCH），在同 10k 样本、同 FID 实现下比较；再补一组"随机摘要"对照，确认增益来自语义对齐而非编码器容量。这是本站设想，未做。
6. **第二个实验（更关键）**：用 **held-out 报告**生成图像，让人工判断图文一致性；这正好补上论文 §6 自认的缺口。评价可用报告里的实体（分级、受体状态）做弱监督一致性打分，而不是只看 FID。
7. **不要声称**：FID 7.64 不代表"生成图与真实图不可区分"；83.32% CAS 只在肿瘤二分类上成立；模型不会"读懂"报告里的全部临床信息，条件只有约 154 token。

## 6. 建议阅读顺序

Fig. 1（GPT 两次调用的提示词，最直观）→ §3.1 摘要生成与 5% 医生校验 → §3.2.1 VAE 下采样因子的论证 → §3.2.2 条件拼接 → §3.2.3 77 token 循环位置编码 → Table 1 逐项消融（重点看 29.45→10.64 这一步）→ Table 2 VAE 重建 → Table 4 横向对比（注意可比性）→ Table 6 随机摘要对照 → §6 局限。

## 7. 前后关联

- [LRDM](56-lrdm.md)：直接沿用 PathLDM 的 4× 下采样 VAE 配置，把条件从文本换成了病理基础模型特征；读 LRDM 前先理解这篇的 VAE 论证。
- [ZoomLDM](58-zoomldm.md)、[BigCell](64-bigcell.md)：同一 lab 路线向大图/多倍率扩展，可看"条件从文本→倍率→密集网格"的演化。
- [DiffInfinite](70-diffinfinite.md)：同样靠条件提质，但条件是分割掩码（布局）；两篇对照可以看清"条件选什么"决定了模型能控制什么。
- [CytoSyn](66-cytosyn.md)：把评价从 FID 换成病理专用 FD，可用来检验 PathLDM 的 FID 7.64 在更合理指标下是否仍然领先。
- [CHIS](61-chis.md)：都用冻结骨干 + 采样期控制，但 CHIS 不改权重、PathLDM 只训 U-Net，可对比"训练什么"的成本差异。

## 8. 链接

- [CVF 正式版 PDF（WACV 2024）](https://openaccess.thecvf.com/content/WACV2024/papers/Yellapragada_PathLDM_Text_Conditioned_Latent_Diffusion_Model_for_Histopathology_WACV_2024_paper.pdf)
- [CVF 论文页](https://openaccess.thecvf.com/content/WACV2024/html/Yellapragada_PathLDM_Text_Conditioned_Latent_Diffusion_Model_for_Histopathology_WACV_2024_paper.html)
- [IEEE CSDL 正式版（pp. 5170–5179，DOI 10.1109/WACV57701.2024.00510）](https://www.computer.org/csdl/proceedings-article/wacv/2024/189200f170/1W0daDjKC2c)
- [arXiv 题录](https://arxiv.org/abs/2309.00748)
- [官方代码（数据、权重、训练/采样入口）](https://github.com/cvlab-stonybrook/PathLDM)
