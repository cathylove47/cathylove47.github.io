# IJCAI-25 综述对照｜A Survey of Pathology Foundation Model: Progress and Future Directions

**论文**：A Survey of Pathology Foundation Model: Progress and Future Directions，IJCAI-25 Survey Track（Proceedings 1193）  
**作者**：Conghao Xiong、Hao Chen、Joseph J. Y. Sung（CUHK / HKUST / NTU）  
**英文原文**：arXiv:2504.04045 v2（2025-05-21，CC BY 4.0）；已与 IJCAI-25 正式版 PDF（ijcai.org/proceedings/2025/1193）逐段核对，正文用词一致  
**本文件是什么**：摘要 + 第 1–6 节 + 图 1 + 3 张表的段落级中英对照。英文段落逐字取自原文，放在引用块里；紧跟其后的中文是逐句对译，不增删、不压缩。专有名词与数字一律以英文原文为准。

**原文入口**：[arXiv 摘要页](https://arxiv.org/abs/2504.04045) · [IJCAI 正式版 PDF](https://www.ijcai.org/proceedings/2025/1193.pdf) · [作者整理的论文清单 AwesomeWSI](https://github.com/BearCleverProud/AwesomeWSI)

## 怎么用这份对照

配每周计划 Day 1 的 60 分钟任务：**读 §2、§3、§4、§5；Table 1/3 只扫一遍。**

1. **10 分钟｜§2**：记住 MIL 的「图块 → 提取器 → 聚合器 → 切片特征」四步，以及只有聚合器在真实标签下直接受训。
2. **15 分钟｜§3 开头 + §3.1**：拿到分类体系的三个维度（范围 / 预训练 / 设计），再看范围这一维怎么分成三类。
3. **10 分钟｜§3.2 + §3.3**：认清 SSL 的三种技术（对比学习、掩码图像建模、自蒸馏）与七档参数量级（XS/S/B/L/H/g/G）。
4. **15 分钟｜§4**：四类评估任务（切片级 / 图块级 / 多模态 / 生物学），以及哪几个模型评测面最全。
5. **10 分钟｜§5**：七个未来方向，分别属于「开发」还是「使用」。

读法：先读英文引用块，卡住了再看中文；中文只做对译，不补解释。每张表后面都写了一段「这张表怎么读」。

---

## 摘要 Abstract

> Computational pathology, which involves analyzing whole slide images for automated cancer diagnosis, relies on multiple instance learning, where performance depends heavily on the feature extractor and aggregator. Recent Pathology Foundation Models (PFMs), pretrained on large-scale histopathology data, have significantly enhanced both the extractor and aggregator, but they lack a systematic analysis framework. In this survey, we present a hierarchical taxonomy organizing PFMs through a top-down philosophy applicable to foundation model analysis in any domain: model scope, model pretraining, and model design. Additionally, we systematically categorize PFM evaluation tasks into slide-level, patch-level, multimodal, and biological tasks, providing comprehensive benchmarking criteria. Our analysis identifies critical challenges in both PFM development (pathology-specific methodology, end-to-end pretraining, data-model scalability) and utilization (effective adaptation, model maintenance), paving the way for future directions in this promising field. Resources referenced in this survey are available at https://github.com/BearCleverProud/AwesomeWSI.

计算病理通过分析全切片图像实现自动化癌症诊断，其基础是多实例学习，而多实例学习的表现高度依赖特征提取器与聚合器。近期在超大规模组织病理数据上预训练的病理基础模型（Pathology Foundation Models, PFMs）显著提升了提取器与聚合器两方面的能力，但它们仍缺乏系统性的分析框架。在本综述中，我们提出一套层级分类体系，以自上而下的思路组织 PFMs——模型范围、模型预训练与模型设计，这一思路适用于任何领域的基础模型分析。此外，我们将 PFM 的评估任务系统划分为切片级、图块级、多模态与生物学任务，给出全面的基准评测准则。我们的分析指出了 PFM 在开发（病理专用方法、端到端预训练、数据—模型可扩展性）与使用（有效适配、模型维护）两方面的关键挑战，并为这一前景广阔的方向铺出未来路径。本综述引用的资源见 https://github.com/BearCleverProud/AwesomeWSI。

## 1 Introduction｜引言

> Computational Pathology (CPath), the computational analysis of patient specimens (*i.e*., Whole Slide Images, WSIs), is increasingly important due to the critical role of histopathology. For gigapixel WSIs, Multiple Instance Learning (MIL) is the de facto framework, involving WSI patch partitioning, feature extraction via pretrained neural networks, and feature aggregation into WSI-level features Xiong et al. (2024b). Therefore, MIL performance hinges on two components: the pretrained neural network (*extractor*) and the *aggregator*.

计算病理（Computational Pathology, CPath），即对患者标本（*i.e.*，即全切片图像，Whole Slide Images, WSIs）的计算分析，因组织病理学的关键作用而日益重要。对于千兆像素级的 WSI，多实例学习（Multiple Instance Learning, MIL）是事实上的框架，其流程包括 WSI 图块切分、通过预训练神经网络做特征提取、以及把特征聚合为 WSI 级特征 Xiong et al. (2024b)。因此，MIL 的表现取决于两个组件：预训练的神经网络（*提取器* extractor）与*聚合器* aggregator。

> Pathology Foundation Models (PFMs), neural networks pretrained on extensive pathological data that can be directly leveraged for diverse downstream tasks without retraining, such as HIPT Chen et al. (2022) and UNI Chen et al. (2024), mark a paradigm shift for MIL. Conventionally, due to the lack of PFMs, ResNet-50 He et al. (2016) pretrained on ImageNet Deng et al. (2009) serves as the extractor Xiong et al. (2024a), but struggles with pathology-specific characteristics like minimal color variation, rotation-agnosticism, and hierarchical tissue organization. While limited labeled WSIs prevented supervised pretraining, Self-Supervised Learning (SSL) enables PFMs that exhibit superior generalizability in morphology recognition. This overcomes natural image pretraining limitations, in which features mainly capture general visual attributes like edges and textures, enabling better performance on downstream tasks even with limited data.

病理基础模型（Pathology Foundation Models, PFMs），即在大量病理数据上预训练、可直接用于多种下游任务而无需重新训练的神经网络，例如 HIPT Chen et al. (2022) 与 UNI Chen et al. (2024)，标志着 MIL 的范式转变。传统做法中，由于缺乏 PFMs，在 ImageNet Deng et al. (2009) 上预训练的 ResNet-50 He et al. (2016) 被用作提取器 Xiong et al. (2024a)，但它难以应对病理图像特有的性质，如极小的颜色变化、旋转无关性与组织层级结构。由于标注 WSI 数量有限、无法进行监督预训练，自监督学习（Self-Supervised Learning, SSL）使 PFMs 能够在形态识别上展现出更强的泛化性。这克服了自然图像预训练的局限——后者提取的特征主要刻画边缘、纹理等通用视觉属性——从而即使数据有限，也能在下游任务上取得更好的表现。

> Despite their potential, PFMs face multifaceted challenges: 1) most PFMs directly adopt natural image techniques, failing to cater to the discrepancy between pathology and natural images, indicating pathology-specific methodology remains underexplored; 2) MIL, as a two-stage pipeline, traps model training in local optima, while end-to-end training of WSIs requires prohibitive computational resources; 3) undefined model and data scaling bounds and resource constraints necessitate multi-institutional federated learning, demanding efficiency; and 4) the computational demands of PFMs impede deployment and maintenance, requiring continuous adaptation to evolving WSI technologies and pathological variants.

尽管潜力巨大，PFMs 仍面临多方面挑战：1）多数 PFMs 直接沿用自然图像的技术，未能契合病理图像与自然图像之间的差异，说明面向病理的专用方法仍未被充分探索；2）MIL 作为两阶段流程，会把模型训练困在局部最优，而对 WSI 做端到端训练又需要难以承受的计算资源；3）模型与数据的规模边界尚未界定，资源受限又使多机构联邦学习成为必需，因此对效率提出要求；4）PFMs 的计算需求阻碍了部署与维护，需要持续适应不断演进的 WSI 技术与病理变异。

> Recent surveys on PFMs have contributed significantly to the understanding of the field; however, these works either focus primarily on the impact of PFMs on the real world rather than technical investigations of them Ochi et al. (2025), or detail the previous efforts in this field without a systematic taxonomy for technical analysis and a systematic organization of the evaluation tasks of PFMs Chanda et al. (2024). To address these critical gaps, we introduce a comprehensive and timely survey of the current landscape. We collected papers from high-impact journals, including Nature, Nature Medicine, Nature Biomedical Engineering, Medical Image Analysis, as well as top-tier conferences such as CVPR, ICML, and AAAI. Given the rapid evolution of the field, we also incorporated preprints from repositories such as arXiv, bioRxiv, and medRxiv, acknowledging that many influential works are still under review. In total, our survey includes 27 PFM papers, 12 of which are preprints that have not yet been accepted by peer-reviewed conferences or journals.

近期关于 PFMs 的综述显著推进了本领域的认识；然而这些工作要么主要关注 PFMs 对现实世界的影响，而非对其做技术层面的考察 Ochi et al. (2025)，要么只是罗列本领域已有的努力，既没有用于技术分析的系统分类体系，也没有对 PFMs 评估任务的系统梳理 Chanda et al. (2024)。为填补这些关键空白，我们提出一份全面且及时的综述。我们收集了高影响力期刊的论文，包括 Nature、Nature Medicine、Nature Biomedical Engineering、Medical Image Analysis，以及 CVPR、ICML、AAAI 等顶级会议；考虑到领域演进极快，我们还纳入了 arXiv、bioRxiv、medRxiv 等平台的预印本，并明确承认许多有影响力的工作仍在审稿中。本综述共涵盖 27 篇 PFM 论文，其中 12 篇尚未被同行评审会议或期刊接收。

> We present this survey with three primary contributions: 1) a hierarchical taxonomy organizing PFMs based on scope, training strategy, and design to enable holistic analysis, transferable to general vision FMs; 2) a comprehensive analysis of evaluation methodologies, examining their technical merits and limitations; and 3) a structured analysis of pathology-centric research challenges prioritizing underexplored directions. The manuscript is organized as follows: Section 2 formally formulates MIL and SSL; Section 3 introduces the proposed hierarchical taxonomy; Section 4 examines evaluation tasks for PFMs; Section 5 delineates future research directions in this field; and Section 6 concludes our survey.

本综述有三项主要贡献：1）提出一套层级分类体系，按范围、训练策略与设计组织 PFMs，以支持整体性分析，并可迁移到通用的视觉基础模型；2）对评估方法做全面分析，考察其技术优势与局限；3）对以病理为中心的研究挑战做结构化梳理，优先指出尚被低估的方向。全文组织如下：第 2 节给出 MIL 与 SSL 的形式化定义；第 3 节介绍所提出的层级分类体系；第 4 节考察 PFMs 的评估任务；第 5 节勾画本领域的未来研究方向；第 6 节给出结论。

![Figure 1：PFM 层级分类体系](/papers/pathology/50-pfm-survey-pipeline.png)

> Figure 1: Schematic representation of our hierarchical taxonomy integrated within the MIL framework for PFMs.

图 1：我们的层级分类体系示意图，嵌于 PFMs 的 MIL 框架之中。

*图源：https://arxiv.org/html/2504.04045v2/MIL.png。原图直接取自论文，未重绘、未描摹。*

## 2 Background and Problem Formulation｜背景与问题形式化

*（本节原文没有引言段落，标题下直接进入 2.1。）*

## 2.1 Multiple Instance Learning｜多实例学习

> In the MIL framework, a WSI is typically represented as a bag of $N$ unordered instances (or patches). The central objective of MIL is to predict the WSI-level label $\hat{Y}$ using only the ground truth bag label $Y$ as supervision, without access to the ground truth instance-level labels $\{y_{i}\}_{i=1}^{N}$. This setting reflects a common scenario in computational pathology, where obtaining slide-level annotations is feasible, but annotating individual patches is prohibitively expensive and impractical. The relationship between the bag label $Y$ and the instance labels $\{y_{i}\}_{i=1}^{N}$ is typically defined under standard MIL assumptions such as the presence-based assumption, and can be formally expressed as Xiong et al. (2023),

在 MIL 框架中，一张 WSI 通常表示为一个由 $N$ 个无序实例（或图块）组成的包。MIL 的核心目标是在仅有真实包标签 $Y$ 作为监督、无法获得真实实例级标签 $\{y_{i}\}_{i=1}^{N}$ 的情况下，预测 WSI 级标签 $\hat{Y}$。这一设定反映了计算病理中的常见情形：获取切片级标注是可行的，而标注单个图块的代价高到不切实际。包标签 $Y$ 与实例标签 $\{y_{i}\}_{i=1}^{N}$ 之间的关系通常按标准的 MIL 假设（例如基于存在的假设）来定义，可形式化地表示为 Xiong et al. (2023)，

$$
Y=\begin{cases}1&\exists i,y_{i}=1\\
0&\forall i,y_{i}=0\\
\end{cases}.
$$

> The implementation of MIL involves tessellating WSIs into non-overlapping patches $\boldsymbol{X}=\{\boldsymbol{x}_{i}\}_{i=1}^{N}\in\mathbb{R}^{N\times h\times w\times 3}$, with $h,w$ standing for height and width, respectively. These patches undergo feature extraction through an extractor $\mathcal{M}_{e}(\cdot)$, generating corresponding features $\boldsymbol{Z}=\{\boldsymbol{z}_{i}\}_{i=1}^{N}\in\mathbb{R}^{N\times d}$, where each feature is computed as $\boldsymbol{z}_{i}=\mathcal{M}_{e}(\boldsymbol{x}_{i})$, and $d$ is the hidden dimension of the extractor. Subsequently, an aggregator $\mathcal{M}_{g}(\cdot)$ agglomerates these features to form a bag-level feature $\boldsymbol{h}=\mathcal{M}_{g}({\boldsymbol{Z}})$ of the WSI, which finally serves as the input for the classification layer. Throughout aggregation, the extractor $\mathcal{M}_{e}(\cdot)$ usually remains frozen and non-trainable due to GPU memory constraints, while the aggregation network $\mathcal{M}_{g}(\cdot)$ is optimized during training. We refer readers unfamiliar with MIL to prior surveys for more details Carbonneau et al. (2018); Waqas et al. (2024).

MIL 的实现需要把 WSI 切分为互不重叠的图块 $\boldsymbol{X}=\{\boldsymbol{x}_{i}\}_{i=1}^{N}\in\mathbb{R}^{N\times h\times w\times 3}$，其中 $h,w$ 分别表示高与宽。这些图块经由提取器 $\mathcal{M}_{e}(\cdot)$ 做特征提取，得到对应的特征 $\boldsymbol{Z}=\{\boldsymbol{z}_{i}\}_{i=1}^{N}\in\mathbb{R}^{N\times d}$，每个特征的计算方式为 $\boldsymbol{z}_{i}=\mathcal{M}_{e}(\boldsymbol{x}_{i})$，$d$ 为提取器的隐层维度。随后，聚合器 $\mathcal{M}_{g}(\cdot)$ 把这些特征汇总为 WSI 的包级特征 $\boldsymbol{h}=\mathcal{M}_{g}({\boldsymbol{Z}})$，最终作为分类层的输入。在整个聚合过程中，由于 GPU 显存限制，提取器 $\mathcal{M}_{e}(\cdot)$ 通常保持冻结、不可训练，而聚合网络 $\mathcal{M}_{g}(\cdot)$ 在训练中得到优化。不熟悉 MIL 的读者可参阅此前的综述 Carbonneau et al. (2018); Waqas et al. (2024) 了解细节。

## 2.2 Self-supervised Learning｜自监督学习

> SSL leverages unlabeled data by automatically generating supervisory signals through pretext tasks Ericsson et al. (2022). Given an input image $\boldsymbol{x}$, a transformation function $\mathcal{T}(\cdot)$ is applied to generate a modified version $\tilde{\boldsymbol{x}}=\mathcal{T}(\boldsymbol{x})$ and a corresponding pseudo-label $\tilde{y}$. An extractor $\mathcal{M}_{e}(\cdot)$ extracts features from $\tilde{\boldsymbol{x}}$ and generates a predicted label $\hat{y}=\mathcal{M}_{e}(\tilde{\boldsymbol{x}})$. The learning objective can be formalized as minimizing the difference between the predicted label $\hat{y}$ and the pseudo-label $\tilde{y}$. Common pretext tasks include contrastive learning, self-distillation, masked image modeling, *etc*., each designed to force the model to learn meaningful semantic features of the data. Through this process, the extractor can learn transferable features for downstream tasks on massive unlabeled data. We refer readers who are unfamiliar with SSL to prior surveys for more details Ericsson et al. (2022); Shurrab and Duwairi (2022); Gui et al. (2024).

SSL 通过前置任务（pretext task）自动生成监督信号，从而利用无标签数据 Ericsson et al. (2022)。给定输入图像 $\boldsymbol{x}$，施加变换函数 $\mathcal{T}(\cdot)$ 生成其修改版本 $\tilde{\boldsymbol{x}}=\mathcal{T}(\boldsymbol{x})$ 以及相应的伪标签 $\tilde{y}$。提取器 $\mathcal{M}_{e}(\cdot)$ 从 $\tilde{\boldsymbol{x}}$ 中提取特征并给出预测标签 $\hat{y}=\mathcal{M}_{e}(\tilde{\boldsymbol{x}})$。学习目标可形式化为最小化预测标签 $\hat{y}$ 与伪标签 $\tilde{y}$ 之间的差异。常见的前置任务包括对比学习、自蒸馏、掩码图像建模 *etc.*，每一种都旨在迫使模型学到数据中有意义的语义特征。通过这一过程，提取器能够在海量无标签数据上学到可迁移的特征。不熟悉 SSL 的读者可参阅此前的综述 Ericsson et al. (2022); Shurrab and Duwairi (2022); Gui et al. (2024) 了解细节。

## 3 Hierarchical Taxonomy｜层级分类体系

> Our taxonomy systematically organizes PFMs through three interdependent dimensions and reflects a top-down design philosophy: 1) *Model Scope*: a categorization of the scope of the PFMs, differentiating between PFMs focused on extractors, aggregators, and both components; 2) *Model Pretraining*: a detailed examination of the spectrum of image-centric pretraining methods, including slide-level, patch-level, and multimodal techniques; and 3) *Model Design*: a rigorous analysis of architecture, categorizing PFMs according to their number of parameters and scale. This top-down structure enables systematic comparisons of PFMs, as shown in Table 1.

我们的分类体系通过三个相互依赖的维度系统化地组织 PFMs，体现自上而下的设计思路：1）*Model Scope*（模型范围）：对 PFMs 的范围做分类，区分聚焦提取器、聚焦聚合器以及同时覆盖两者的模型；2）*Model Pretraining*（模型预训练）：详细考察以图像为中心的预训练方法谱系，包括切片级、图块级与多模态技术；3）*Model Design*（模型设计）：严格分析架构，按参数量与规模对 PFMs 归类。这一自上而下的结构使得 PFMs 的系统比较成为可能，如表 1 所示。

> Table 1: Systematic comparison of PFMs categorized based on our hierarchical taxonomy. Abbreviations used: Extractor (E.), Aggregator (A.), H&E (H), Patch (P), Text (T), WSIs with unspecified stains (W), IHC (I), Genomics (G), DNA (D), and RNA (R).

表 1：按我们的层级分类体系对 PFMs 进行系统比较。所用缩写：Extractor 提取器（E.）、Aggregator 聚合器（A.）、H&E（H）、Patch 图块（P）、Text 文本（T）、未指定染色类型的 WSIs（W）、IHC（I）、Genomics 基因组学（G）、DNA（D）、RNA（R）。

| 模型 | 编码器 E. | 聚合器 A. | 预训练·输入 | 预训练·基础方法 | 预训练·倍率/分辨率 | 设计·架构 | 设计·参数量 | 设计·规模 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTransPath | ✓ | ✗ | H | MoCov3 | 10/224 | Swin-T/14 | 28.3M | S |
| REMEDIS | ✓ | ✗ | H | SimCLR | Multi/224 | ResNet-50 | 25.6M | S |
| HIPT | ✓ | ✓ | H | DINO | 20/256,4096 | ViT-S/16-XS/256 | 21.7/2.78M | S/XS |
| PLIP | ✓ | ✗ | P, T | CLIP | 20/224 | ViT-B/32 | 87M | B |
| CONCH | ✓ | ✗ | W, T | iBOT/CoCa | 20/256 | ViT/B-16 | 86.3M | B |
| Phikon | ✓ | ✗ | H | iBOT | 20/224 | ViT-S/B/L/16 | 21.7/85.8/307M | S/B/L |
| UNI | ✓ | ✗ | H | DINOv2 | 20/256,512 | ViT-L/16 | 307M | L |
| Virchow | ✓ | ✗ | H | DINOv2 | 20/224 | ViT-H/14 | 632M | H |
| SINAI | ✓ | ✗ | H | DINO/MAE | Unknown | ViT-S/L | 21.7M/303.3M | S/L |
| CHIEF | ✗ | ✓ | H,T | Sup.+CLIP | 10/224 | CHIEF | 1.2M | XS |
| Prov-GigaPath | ✓ | ✓ | H,I | DINOv2/MAE | 20/256 | ViT-g/14/LongNet | 1.13B/85.1M | g/B |
| Pathoduet | ✓ | ✗ | H,I | MoCov3 | 40/256,20/1024 | ViT-B/16 | 85.8M | B |
| RudolfV | ✓ | ✗ | W | DINOv2 | 20,40,80/256 | ViT-L/14 | 304M | L |
| PLUTO | ✓ | ✗ | W | DINOv2 | 20,40/224 | FlexiViT-S/16 | 22M | S |
| PRISM | ✗ | ✓ | H,T | CoCa | 20/224 | Perceiver | 45.0M | S |
| TANGLE | ✓ | ✓ | H,G | iBOT/SimCLR | 20/224 | ViT-B/16/ABMIL | 86.3/2.3M | B/XS |
| MUSK | ✓ | ✗ | H,T | MIM | 10,20,40/384 | BEiT-3 | 675M | H |
| BEPH | ✓ | ✗ | H | MIM | 40/224 | BEiTv2 | 192.55M | B |
| Hibou | ✓ | ✗ | W | DINOv2 | Unknown | ViT-B/L/16 | 86.3/307M | B/L |
| mSTAR+ | ✓ | ✓ | H,G,T | CLIP/ST | 20/256 | TransMIL/ViT-L | 2.67/307M | XS/L |
| GPFM | ✓ | ✗ | H | UDK | 40/512 | ViT-L/14 | 307M | L |
| Virchow2G | ✓ | ✗ | W | DINOv2 | 5,10,20,40/224 | ViT-G/14 | 1.9B | G |
| MADELEINE | ✗ | ✓ | W | CLIP | 10,20/256 | MH-ABMIL | 5.0M | XS |
| Phikon-v2 | ✓ | ✗ | W | DINOv2 | 20/224 | ViT-L/16 | 307M | L |
| TITAN | ✗ | ✓ | W,T | iBOT/CoCa | 20/8192 | TITAN/TITAN_V | 48.5/42.1M | S |
| KEEP | ✓ | ✗ | W,T | CLIP | 20/224 | UNI | 307M | L |
| THREADS | ✗ | ✓ | H,D,R | CLIP | 20/512 | MH-ABMIL | 11.3M | XS |

**这张表怎么读**：三组列对应 §3 的三个维度——`编码器 E./聚合器 A.` 是**模型范围**（✓ 表示该模型在这个角色上被预训练），`预训练·*` 是**预训练**的输入模态与基础方法，`设计·*` 是**模型设计**的架构与参数量级。输入模态缩写见上表图注（H 为 H&E、P 图块、T 文本、W 未指定染色、I 为 IHC、G 基因组学、D 为 DNA、R 为 RNA）。想快速定位，就找自己后面要精读的几行：CTransPath、CONCH、UNI、Prov-GigaPath、CHIEF、TITAN。

## 3.1 Model Scope｜模型范围

> MIL consists of three parts: 1) patch partitioning, 2) feature extraction, and 3) feature aggregation. As patch partitioning has been well-established, MIL performance primarily depends on the extractor and aggregator. In addition, WSIs inherently exhibit hierarchical structures, where local histomorphological patterns captured by extractors and global hierarchical tissue organization modeled by aggregators jointly determine diagnostic accuracy. Therefore, we categorize PFMs based on their scope: extractor-centric, aggregator-centric, or hybrid-centric. The categorization of PFMs along this dimension is presented in the Model Scope column of Table 1.

MIL 由三部分组成：1）图块切分，2）特征提取，3）特征聚合。由于图块切分已相当成熟，MIL 的表现主要取决于提取器与聚合器。此外，WSI 本身具有层级结构：提取器捕获的局部组织形态学模式与聚合器建模的全局层级组织结构，共同决定诊断准确率。因此，我们按范围把 PFMs 分为：以提取器为中心、以聚合器为中心、以及以混合为中心。PFMs 在这一维度上的归类见表 1 的 Model Scope 列。

> Extractor-centric models constitute the predominant approach in PFM development, driven by two factors: the importance of high-quality features and the necessity to address domain shift brought by ImageNet-pretrained CNNs. The role of the extractor aligns with established clinical practice, where pathologists emphasize cellular morphological analysis at the patch level. CTransPath Wang et al. (2022) pioneers the extractor training with a hybrid CNN-Transformer design through Semantic-Relevant Contrastive Learning (SRCL) on 15 million patches. REMEDIS Azizi et al. (2023) demonstrates that the feature extraction capability of ResNet-50 is constrained by domain shift across different medical imaging domains. Various advancements, including Virchow Vorontsov et al. (2024) and SINAI Campanella et al. (2024), further stress the significance of robust extractors.

以提取器为中心的模型是 PFM 开发中的主流路线，原因有二：高质量特征的重要性，以及应对 ImageNet 预训练 CNN 所带来的域偏移的必要性。提取器的角色与既有临床实践一致——病理医生在图块层面强调细胞形态学分析。CTransPath Wang et al. (2022) 率先采用 CNN-Transformer 混合设计，通过语义相关对比学习（SRCL）在 1500 万个图块上训练提取器。REMEDIS Azizi et al. (2023) 表明 ResNet-50 的特征提取能力受限于不同医学影像领域之间的域偏移。Virchow Vorontsov et al. (2024) 与 SINAI Campanella et al. (2024) 等一系列进展，进一步凸显了稳健提取器的重要性。

> Aggregator-centric models play a vital role in slide-level tasks as they are the only trainable models under direct supervision of ground truth labels, yet they are relatively underexplored compared to the extractor. CHIEF Wang et al. (2024b), leveraging supervised pretraining with the anatomical site to create an anatomy-aware aggregator, first demonstrates the efficacy of aggregator pretraining. More recent research like MADELEINE Jaume et al. (2025), TITAN Ding et al. (2024), and THREAD Vaidya et al. (2025) utilizes multimodal data in aggregator pretraining with frozen patch features to enhance performance across downstream tasks. This paradigm shift reflects growing awareness that the aggregator critically impacts downstream task performance, particularly in low-resource clinical scenarios Xu et al. (2024a). This observation aligns with transfer learning principles, wherein pretraining on large-scale datasets effectively alleviates downstream data scarcity challenges. However, empirical evidence also reveals that the pretrained CHIEF aggregator occasionally performs worse than linear probing of the extractor Ding et al. (2024), which is potentially attributable to the small model size when trained on a pretraining-scale dataset, or to the conflicts between domain bias and generic features. Consequently, further investigations are warranted to assess the advantages of pretrained larger aggregators.

以聚合器为中心的模型在切片级任务中至关重要，因为它们是在真实标签直接监督下唯一可训练的模型，但相较提取器仍相对缺乏探索。CHIEF Wang et al. (2024b) 借助以解剖部位进行的监督预训练构建解剖感知的聚合器，首次证明了聚合器预训练的有效性。更新的研究如 MADELEINE Jaume et al. (2025)、TITAN Ding et al. (2024) 与 THREAD Vaidya et al. (2025) 在冻结图块特征的前提下，用多模态数据做聚合器预训练，以提升各类下游任务表现。这一范式转变反映出越来越清晰的认识：聚合器对下游任务表现有关键影响，在低资源临床场景中尤其如此 Xu et al. (2024a)。该观察与迁移学习原理一致——在大规模数据集上预训练能有效缓解下游数据稀缺的问题。但经验证据也显示，预训练的 CHIEF 聚合器有时还不如对提取器做线性探测（linear probing）Ding et al. (2024)；这可能归因于在预训练规模的数据上训练时模型体量偏小，或域偏差与通用特征之间存在冲突。因此，预训练更大规模聚合器的优势仍需进一步研究来评估。

> Hybrid-centric models are PFMs that pretrain both the extractor and aggregator. Their advantage lies in full exploitation of the aggregator, as the aggregators can flexibly adapt to the extractor with pretraining-scale data. HIPT pioneers this approach through hierarchical pretraining of the first two layers of the extractor, excluding the last layer, which is substantiated through empirical performance. Similarly, Prov-GigaPath Xu et al. (2024a) pretrains a ViT extractor and a LongNet Ding et al. (2023) slide encoder; however, LongNet generates instance-level features rather than a single slide-level feature, necessitating integration of ABMIL Ilse et al. (2018) or non-parametric pooling strategies for slide-level tasks. TANGLE Jaume et al. (2024) pretrains both a ViT feature extractor and a transcriptomics-guided ABMIL aggregator. Finally, mSTAR Xu et al. (2024b) distinguishes itself as a fully-pretrained hybrid-centric model by an inverted pretraining sequence, contrasting with the conventional paradigm: first optimizing the multimodal aggregator, followed by pretraining the extractor with the aggregator.

以混合为中心的模型是同时预训练提取器与聚合器的 PFMs。其优势在于充分发挥聚合器的作用，因为聚合器可以借助预训练规模的数据灵活适配提取器。HIPT 是该路线的开创者：对提取器的前两层做层级预训练而排除最后一层，其效果已由实验表现证实。类似地，Prov-GigaPath Xu et al. (2024a) 预训练了 ViT 提取器与 LongNet Ding et al. (2023) 切片编码器；但 LongNet 生成的是实例级特征而非单个切片级特征，因此切片级任务还需接入 ABMIL Ilse et al. (2018) 或非参数池化策略。TANGLE Jaume et al. (2024) 同时预训练 ViT 特征提取器与转录组引导的 ABMIL 聚合器。最后，mSTAR Xu et al. (2024b) 以颠倒的预训练顺序区别于常规范式，成为完全预训练的以混合为中心的模型：先优化多模态聚合器，再用该聚合器预训练提取器。

> Analysis of recent developments reveals two observations. First, research emphasis has progressively shifted from feature extractor pretraining toward aggregator pretraining, a transition potentially attributable to both the robust performance of existing extractors and the increasing awareness of aggregator significance, especially in limited-data scenarios. Second, current aggregators demonstrate a hierarchical dependency pattern, wherein each successive model builds upon the capabilities of prior models. For instance, TITAN utilizes features from CONCHv1.5, which in turn leverages UNI as its encoder, thereby forming a cascading performance dependency chain where the efficacy of TITAN is inherently contingent upon CONCHv1.5 and, by extension, UNI.

对近期进展的分析给出两点观察。第一，研究重心已逐步从特征提取器预训练转向聚合器预训练；这一转变可能既源于现有提取器已具备稳健表现，也源于人们对聚合器重要性的认识不断提升，在数据受限场景下尤其如此。第二，当前聚合器呈现出层级依赖模式：后续模型建立在先前模型的能力之上。例如 TITAN 使用 CONCHv1.5 的特征，而 CONCHv1.5 又以 UNI 作为编码器，由此形成级联的性能依赖链——TITAN 的效果本质上取决于 CONCHv1.5，进而取决于 UNI。

## 3.2 Model Pretraining｜模型预训练

> The pretraining methods can be categorized into supervised and SSL methods, with SSL prevailing due to their capabilities in capturing morphological patterns without labeled data, while only CHIEF opted for supervised pretraining for the aggregator. Based on our surveyed papers, SSL can be further divided into two main categories: vision-only and inter-modal methods. Vision-only methods employ three SSL techniques: contrastive learning (SimCLR, MoCov3), masked image modeling (MIM, MAE), and self-distillation (iBOT, DINO, DINOv2). In contrast, inter-modal methods often employ multi-stage pretraining, utilizing contrastive learning methods (CLIP, CoCa) for effective cross-modal alignment before which unimodal encoders are pretrained independently. We focus on methodology contributions in this section and present the details of each method, including input modalities, magnification, and resolution of the patches, in the Model Pretraining column of Table 1.

预训练方法可分为监督方法与 SSL 方法；由于 SSL 能在无标签数据上捕捉形态学模式，它占据主导，只有 CHIEF 为聚合器选择了监督预训练。基于我们调研的论文，SSL 可进一步分为两大类：仅视觉方法与跨模态方法。仅视觉方法采用三种 SSL 技术：对比学习（SimCLR、MoCov3）、掩码图像建模（MIM、MAE）与自蒸馏（iBOT、DINO、DINOv2）。相比之下，跨模态方法常采用多阶段预训练，使用对比学习方法（CLIP、CoCa）实现有效的跨模态对齐，而在此之前先分别独立预训练各单模态编码器。本节聚焦方法层面的贡献，各方法的具体细节（输入模态、放大倍率、图块分辨率）见表 1 的 Model Pretraining 列。

> Contrastive Learning is an SSL branch that learns representations by maximizing similarity between positive pairs while minimizing that between negative pairs. Several seminal approaches have advanced this field: 1) SimCLR Chen et al. (2020) established foundational techniques such as aggressive data augmentation and large batch sizes; 2) MoCov3 Chen et al. (2021) advanced self-supervised learning for ViT through stabilized training techniques; 3) CLIP Radford et al. (2021) expanded the paradigm to multi-modal learning through large-scale image-caption pair training; and 4) CoCa Yu et al. (2022) proposed a unified method incorporating both contrastive and captioning objectives, enabling simultaneous visual-textual alignment and text generation capabilities. In the medical domain, REMEDIS utilizes SimCLR to enhance the robustness and data efficiency in medical imaging. TANGLE adopts a revised SimCLR method with gene expression reconstruction and slide subset alignment. Pathoduet Hua et al. (2024) enhanced MoCov3 through the integration of cross-scale positioning and cross-stain transferring tasks, specifically addressing the challenges of stain transferability and tissue-level heterogeneity. CLIP is adapted for both extractors (PLIP Huang et al. (2023)) and aggregators (Prov-GiGapath, mSTAR, MADELEINE, and THREAD), due to its versatility in aligning two or more modalities. Notably, KEEP Zhou et al. (2024) has proposed a Knowledge-Enhanced Vision-Language (KEVL) pretraining, further adapting CLIP for the extractor by incorporating domain expertise through knowledge-graph-cleaned image-text pairs. There are several applications of CoCa, both on the extractor and aggregator: CONCH Lu et al. (2024) adopts this framework to pretrain an extractor on 1.17 million image-caption pairs, enhancing both zero- and few-shot capabilities, while PRISM Shaikovski et al. (2024) and TITAN utilize CoCa to pretrain aggregators with multimodal capabilities.

对比学习是 SSL 的一个分支，通过最大化正样本对之间的相似度、最小化负样本对之间的相似度来学习表示。若干奠基性工作推进了这一领域：1）SimCLR Chen et al. (2020) 确立了激进的数据增强与大 batch 等基础技术；2）MoCov3 Chen et al. (2021) 通过稳定训练技巧推进了 ViT 的自监督学习；3）CLIP Radford et al. (2021) 通过大规模图像—描述对训练，把该范式扩展到多模态学习；4）CoCa Yu et al. (2022) 提出统一方法，同时纳入对比与描述目标，可同步实现视觉—文本对齐与文本生成能力。在医学领域，REMEDIS 使用 SimCLR 提升医学影像中的鲁棒性与数据效率。TANGLE 采用改进的 SimCLR，并加入基因表达重建与切片子集对齐。Pathoduet Hua et al. (2024) 通过引入跨尺度定位与跨染色迁移任务增强了 MoCov3，专门应对染色可迁移性与组织级异质性带来的挑战。由于 CLIP 在两种及以上模态对齐上通用性强，它既被用于提取器（PLIP Huang et al. (2023)），也被用于聚合器（Prov-GiGapath、mSTAR、MADELEINE 与 THREAD）。值得注意的是，KEEP Zhou et al. (2024) 提出了知识增强视觉语言（KEVL）预训练，用经知识图谱清洗的图像—文本对引入领域专业知识，把 CLIP 进一步适配到提取器上。CoCa 在提取器与聚合器上都有若干应用：CONCH Lu et al. (2024) 采用该框架在 117 万图像—描述对上预训练提取器，同时提升零样本与少样本能力；而 PRISM Shaikovski et al. (2024) 与 TITAN 则用 CoCa 预训练具备多模态能力的聚合器。

> Masked Image Modeling is an SSL method that learns representations by predicting masked portions of images from their visible regions. SimMIM Xie et al. (2022) advanced the field by simplifying existing approaches through random masking and a lightweight prediction head, and MAE He et al. (2022) introduced an asymmetric encoder-decoder design with high masking ratios. Recent investigations have demonstrated the efficacy of MIM in pretraining extractors; notably, SINAI Campanella et al. (2024) employs MAE to pretrain ViT models on a scale of 3.2 billion patches, establishing its scalability in pathological contexts. Similarly, MUSK Xiang et al. (2025) and BEPH Yang et al. (2024) further validate MIM by implementing BEiT-3 and BEiTv2 architectures, respectively. Additionally, Prov-GigaPath employs MAE to pretrain its slide encoder LongNet, demonstrating the efficacy of this method on aggregator pretraining.

掩码图像建模是一种 SSL 方法，通过从可见区域预测图像中被掩码的部分来学习表示。SimMIM Xie et al. (2022) 以随机掩码与轻量预测头简化了既有做法，推进了该方向；MAE He et al. (2022) 则提出了高掩码率的非对称编码器—解码器设计。近期研究已证明 MIM 在预训练提取器上的有效性；特别是 SINAI Campanella et al. (2024) 用 MAE 在 32 亿个图块的规模上预训练 ViT 模型，确立了它在病理语境下的可扩展性。类似地，MUSK Xiang et al. (2025) 与 BEPH Yang et al. (2024) 分别实现 BEiT-3 与 BEiTv2 架构，进一步验证了 MIM。此外，Prov-GigaPath 用 MAE 预训练其切片编码器 LongNet，说明该方法在聚合器预训练上同样有效。

> Self-distillation enables model learning through its own predictions across different views, simultaneously acting as teacher and student. DINO Caron et al. (2021) pioneered the use of self-distillation by employing a teacher-student architecture with momentum encoder and multi-crop training, while iBOT Zhou et al. (2022) performs MIM via self-distillation with an online tokenizer, and DINOv2 Oquab et al. (2023) refined the DINO framework by accelerating and stabilizing the training at scale. The efficacy of self-distillation for the extractor has been demonstrated by several investigations: Phikon Filiot et al. (2023) implements iBOT on a corpus of 43 million patches spanning 16 distinct cancer sites; Phikon-v2 Filiot et al. (2024) employs DINOv2 on 456 million patches derived from 30 cancer sites; RudolfV Dippel et al. (2024) incorporates DINOv2 with pathologist knowledge on 58 tissue types and 129 stains; and Hibou Nechaev et al. (2024) further extends DINOv2 on 1.2 billion patches. Additionally, the application of self-distillation extends beyond the extractor, as evidenced by TITAN Ding et al. (2024), which utilizes iBOT for general-purpose aggregator learning. These investigations demonstrate the capacity of self-distillation in PFM pretraining. In addition, there are methodological improvements customized for pathology in this category: 1) PLUTO Juyal et al. (2024) utilizes DINOv2 together with MAE objective and Fourier losses on 195 million patches; 2) GPFM Ma et al. (2024) proposes Unified Knowledge Distillation (UKD), incorporating MIM, self-distillation and expert knowledge distillation together as training objectives; 3) Virchow2 Zimmermann et al. (2024) enhances DINOv2 by applying pathology-specific augmentation and reducing tissue redundancy.

自蒸馏让模型在不同视图下通过自身预测进行学习，同时扮演教师与学生。DINO Caron et al. (2021) 开创性地使用自蒸馏，采用带动量编码器与多裁剪（multi-crop）训练的师生架构；iBOT Zhou et al. (2022) 用在线 tokenizer 通过自蒸馏执行 MIM；DINOv2 Oquab et al. (2023) 通过对训练做加速与稳定改进，完善了 DINO 框架。自蒸馏对提取器的有效性已被多项研究证明：Phikon Filiot et al. (2023) 在覆盖 16 种癌种的 4300 万图块语料上实现 iBOT；Phikon-v2 Filiot et al. (2024) 在来自 30 种癌种的 4.56 亿图块上使用 DINOv2；RudolfV Dippel et al. (2024) 在 58 种组织类型与 129 种染色上把 DINOv2 与病理医生知识结合；Hibou Nechaev et al. (2024) 进一步把 DINOv2 扩展到 12 亿图块。此外，自蒸馏的应用不限于提取器，TITAN Ding et al. (2024) 用 iBOT 做通用聚合器学习即为证据。这些研究体现了自蒸馏在 PFM 预训练中的能力。本类别中还有若干为病理定制的方法改进：1）PLUTO Juyal et al. (2024) 在 1.95 亿图块上把 DINOv2 与 MAE 目标及傅里叶损失一起使用；2）GPFM Ma et al. (2024) 提出统一知识蒸馏（UKD），把 MIM、自蒸馏与专家知识蒸馏一并作为训练目标；3）Virchow2 Zimmermann et al. (2024) 通过病理特异的数据增强与降低组织冗余来增强 DINOv2。

> Table 2: Technical specifications of vision-related parts of PFMs by academic preprint release date, with peer-reviewed published works in purple. Abbreviations used: Patch-level extractor (P), Alignment (A), Slide-level aggregator (S).

表 2：按学术预印本发布日期的 PFMs 视觉相关部分技术规格，其中经同行评审正式发表的工作以紫色标出。所用缩写：Patch-level extractor 图块级提取器（P）、Alignment 对齐（A）、Slide-level aggregator 切片级聚合器（S）。

| 发表处 | 模型 | 方法 | 架构 | 数据来源 | 数据统计 |
| --- | --- | --- | --- | --- | --- |
| MedIA Wang et al. (2022) | CTransPath | SRCL | Swin-T/14 | TCGA + PAIP | 32,220 WSIs 15,580,262 Patches |
| Nat. Bio. Engg. Azizi et al. (2023) | REMEDIS | SimCLR | ResNet-50 | TCGA | 29,018 WSIs 50 Million Patches |
| CVPR Chen et al. (2022) | HIPT | DINO | ViT-S/16 ViT-XS/256 | TCGA | 10,678 H&E WSIs ~ 104 Million Patches |
| Nat. Med. Huang et al. (2023) | PLIP | CLIP | ViT-B/32 | OpenPath | 208,414 Image-Text Pairs |
| Nat. Med. Lu et al. (2024) | CONCH | P: iBOT A: CoCa | P: ViT-B/16 A: GPT-style | In-house | 21,442 WSIs 16 Million Patches > 1.17M Image-Text Pairs |
| MedRxiv Filiot et al. (2023) | Phikon | iBOT | ViT-S/B/L/16 | TCGA | 6,093 WSIs 43,374,634 Patches |
| Nat. Med. Chen et al. (2024) | UNI | DINOv2 | ViT-L/16 | Mass-100K | 100,426 H&E WSIs 100,130,900 Patches |
| Nat. Med. Vorontsov et al. (2024) | Virchow | DINOv2 | ViT-H/14 | MSKCC | 1,488,550 H&E WSIs 2 Billion Patches |
| AAAI S. Campanella et al. (2024) | SINAI | DINO MAE | ViT-S ViT-L | Mount Sinai Health System | 423,563 H&E WSIs 3.2 Billion Patches |
| Nature Wang et al. (2024b) | CHIEF | P: Pretrained S: Sup.+CLIP | P: CTransPath S: CHIEF | Public + In-house | 60,530 H&E WSIs ~ 15 Million Patches |
| Nature Xu et al. (2024a) | Prov-GigaPath | P: DINOv2 S: MAE A: CLIP | P: ViT-g/14 S: LongNet | Providence Health System | 171,189 WSIs 1,384,860,229 Patches |
| MedIA Hua et al. (2024) | Pathoduet | Enhanced MoCov3 | ViT-B/16 | TCGA | 11,000 WSIs 13,166,437 Patches |
| Arxiv Dippel et al. (2024) | RudolfV | DINOv2 | ViT-L/14 | TCGA + In-house | 133,998 WSIs 1.25 Billion Patches |
| ICML W. Juyal et al. (2024) | PLUTO | DINOv2+ MAE+Fourior | FlexiViT-S/16 | TCGA + Proprietary | 158,852 WSIs 195 Million Patches |
| Arxiv Shaikovski et al. (2024) | PRISM | P: Pretrained S: CoCa | P: Virchow S: Perceiver | MSKCC | 587,196 WSIs 195K Pathology Reports |
| CVPR Jaume et al. (2024) | TANGLE | P: iBOT S: Alignment | P: ViT-B/16 S: ABMIL | TG-GATEs | 47,227 WSIs 6,597 Image-Gene Pair |
| Nature Xiang et al. (2025) | MUSK | UMP | BEIT-3 | Quilt-1M + PathAsst | ~33,000 H&E WSIs 50M Patches 1M Image-Text Pairs |
| BioRxiv Yang et al. (2024) | BEPH | MIM | BEiTv2 | TCGA | 11,760 WSIs 11,774,353 Patches |
| Arxiv Nechaev et al. (2024) | Hibou | DINOv2 | ViT-L/14 ViT-B/14 | Proprietary | 936,441 H&E WSIs 202,464 non-H&E WSIs ViT-L: 1.2B Patches ViT-B: 512M Patches |
| Arxiv Xu et al. (2024b) | mSTAR+ | S: CLIP P: mSTAR | S: TransMIL P: ViT-L | TCGA | 11,727 WSIs 22,127 Modality Pairs |
| Arxiv Ma et al. (2024) | GPFM | UKD | ViT-L/14 | 33 Public Dataset | 72,280 WSIs 190,212,668 Patches |
| Arxiv Zimmermann et al. (2024) | Virchow2 Virchow2G | Enhanced DINOv2 | ViT-H/14 ViT-G/14 | MSKCC + Worldwide | 3,134,922 WSIs with Diverse Stains |
| ECCV Jaume et al. (2025) | MADELEINE | P: Pretrained S: CLIP + GOT | P: CONCH S:MH-ABMIL | Acrobat + BWH | 16,281 WSIs with Diverse Stains |
| Arxiv Filiot et al. (2024) | Phikon-v2 | DINOv2 | ViT-L/16 | Public + In-house | 58,359 WSIs 456,060,584 Patches |
| Arxiv Ding et al. (2024) | TITAN | P: Pretrained Stage1: iBOT Stage2: CoCa | P: CONCHv1.5 S: ViT-T/14 | Mass-340K | 335,645 WSIs 423,122 Image-Text Pairs 182,862 WSI-Text Pairs |
| Arxiv Zhou et al. (2024) | KEEP | KEVL | UNI | Quilt-1M + OpenPath | 143K Image-Text Pairs Hierarchical Medical KG |
| Arxiv Vaidya et al. (2025) | THREADS | P: Pretrained S: CLIP | P: CONCHv1.5 S: MH-ABMIL | MBTG-47K: MGH+BWH +TCGA +GTEx | 47,171 H&E WSIs 125,148,770 Patches 26,615 Bulk RNA 20,556 DNA Variants |

**这张表怎么读**：按预印本发布时间排序的模型清单。`方法` 列里的 `P:` / `A:` / `S:` 分别指**图块级提取器 P**、**对齐 A**、**切片级聚合器 S**。`数据统计` 列是论文自报的预训练规模，可与 §3.2 的叙述互相印证（例如 SINAI 3.2 billion patches、UNI 100M patches、Virchow2 系列 3.13M WSIs）。图注中「经同行评审的工作以紫色标出」在本文件里无法呈现颜色，请看 `发表处` 列自行区分：Nature / Nat. Med. / CVPR 等为已正式发表，Arxiv / MedRxiv / BioRxiv 为预印本。

## 3.3 Model Design｜模型设计

> The model design refers to the following three aspects that are vital to model performance: architecture, number of parameters (# params.), scale. The scale of a model is directly determined by its number of parameters. Through quantization of the number of parameters, we establish a hierarchical scale system, facilitating standardized cross-architectural comparisons and enabling informed model selection for practical implementations. The taxonomy of PFMs along this dimension is presented in the Model Design column of Table 1.

模型设计指以下三个对模型表现至关重要的方面：架构、参数量（# params.）、规模。模型的规模直接由其参数量决定。通过对参数量做量化，我们建立了一套层级规模体系，便于在跨架构之间做标准化比较，也便于在实际落地时做出有依据的模型选择。PFMs 在这一维度上的分类见表 1 的 Model Design 列。

> Architecture is a pivotal determinant of PFM capabilities. Architectures adopted by PFMs can be categorized based on scope: extractor architecture and aggregator architecture. The extractor architecture encompasses two categories: 1) CNN-based architecture such as ResNet, and 2) transformer-based architecture, including ViT Dosovitskiy et al. (2021), CNN-integrated Swin Transformer Wang et al. (2022), BEiTv2 Peng et al. (2022), FlexiViT Beyer et al. (2023), and a multimodal BEiT-3 Wang et al. (2023). The aggregator architecture comprises two categories: ABMIL family Ilse et al. (2018); Ding et al. (2024) and Perceiver Jaegle et al. (2021). For an architectural overview of each method, we refer readers to the Architecture column in Table 1.

架构是决定 PFM 能力的关键因素。PFMs 采用的架构可按范围分为：提取器架构与聚合器架构。提取器架构包含两类：1）基于 CNN 的架构，如 ResNet；2）基于 Transformer 的架构，包括 ViT Dosovitskiy et al. (2021)、融合 CNN 的 Swin Transformer Wang et al. (2022)、BEiTv2 Peng et al. (2022)、FlexiViT Beyer et al. (2023)，以及多模态的 BEiT-3 Wang et al. (2023)。聚合器架构包含两类：ABMIL 家族 Ilse et al. (2018); Ding et al. (2024) 与 Perceiver Jaegle et al. (2021)。各方法的架构概览请见表 1 的 Architecture 列。

> Scale can be derived through the number of parameters. To facilitate cross-architectural comparisons, we establish a quantization framework based on the ViT architecture, which serves as the predominant backbone across our surveyed literature. The classification includes seven categories: extra small (XS, 2.78M), Small (S, 21.7M), Base (B, 86.3M), Large (L, 307M), Huge (H, 632M), giant (g, 1.13B), and Giant (G, 1.9B). The notation ViT-B/16 indicates a ViT Base model with patch size 16. For statistics of each method, we refer readers to the # Params. and Scale columns in Table 1.

规模可由参数量推得。为便于跨架构比较，我们基于 ViT 架构建立量化框架——ViT 是我们调研文献中最主流的骨干网络。分类共七档：extra small（XS，2.78M）、Small（S，21.7M）、Base（B，86.3M）、Large（L，307M）、Huge（H，632M）、giant（g，1.13B）与 Giant（G，1.9B）。记号 ViT-B/16 表示图块大小为 16 的 ViT Base 模型。各方法的统计请见表 1 的 # Params. 与 Scale 列。

> Our analysis reveals several patterns in model architectures and scaling: 1) ABMIL-derived methods demonstrate clear dominance in aggregator architectures, while the ViT family predominates in extractor architectures, which are transformer-based architectures; 2) The majority of methods utilize ViT-L as their primary backbone. Due to computational resource constraints, researchers often develop complementary smaller-scale variants (ViT-S or ViT-B) alongside their primary models, while some approaches specifically target efficiency through smaller architectures; 3) ViT-L is a popular scale for extractors, whereas ViT-XS is the primary choice for aggregators, over ViT-S. This substantial disparity in parameter counts between extractors and aggregators, despite their similar training data scale, suggests a potential data-model scale mismatch that warrants further investigation; 4) a clear trend toward larger model scales is observed: while earlier approaches frequently employed ViT-B, recent methods have increasingly standardized on ViT-L, with some extending to even larger variants such as ViT-H/g/G.

我们的分析揭示出模型架构与规模上的若干规律：1）在聚合器架构中，由 ABMIL 派生的方法明显占主导；而在提取器架构（属于基于 Transformer 的架构）中，ViT 家族占主导。2）多数方法以 ViT-L 作为主要骨干。受计算资源限制，研究者常在主模型之外开发互补的较小规模变体（ViT-S 或 ViT-B），也有一些方法专门以更小的架构追求效率。3）提取器常用 ViT-L，而聚合器的主要选择是 ViT-XS 而非 ViT-S。提取器与聚合器的参数量差异巨大，尽管两者的训练数据规模相近，这提示可能存在数据—模型规模不匹配的问题，值得进一步研究。4）可以观察到模型规模明显增大的趋势：较早的方法常用 ViT-B，近期方法越来越标准化到 ViT-L，有些甚至扩展到 ViT-H/g/G 等更大变体。

## 4 Evaluation Tasks for the Foundation Model｜基础模型的评估任务

> Development and evaluation constitute the two fundamental pillars of PFMs. The evaluation tasks of PFMs can be systematically categorized into four aspects: 1) slide-level tasks; 2) patch-level tasks; 3) multimodal tasks; and 4) biological tasks. A comparative analysis of these evaluation tasks is presented in Table 3, providing practitioners with comprehensive criteria for model selection based on real-world applications.

开发与评估构成 PFMs 的两大支柱。PFMs 的评估任务可系统分为四类：1）切片级任务；2）图块级任务；3）多模态任务；4）生物学任务。这些评估任务的对比分析见表 3，为从业者按真实应用选择模型提供了全面的准则。

> Table 3: Comparison of the evaluation tasks between different PFMs. Abbreviations used: Zero-shot (Z), Few-shot (F), Complete (C).

表 3：不同 PFMs 之间评估任务的比较。所用缩写：Zero-shot 零样本（Z）、Few-shot 少样本（F）、Complete 完整监督（C）。

| 模型 | 切片级 分类 | 切片级 生存 | 切片级 检索 | 切片级 分割 | 图块级 分类 | 图块级 P2P | 图块级 分割 | 多模态 I2T | 多模态 T2I | 多模态 RG | 多模态 VQA | 生物 GA | 生物 MP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTransPath | C | C | ✗ | ✗ | F/C | Z | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| REMEDIS | C | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| HIPT | C | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| PLIP | ✗ | ✗ | ✗ | ✗ | Z | Z | ✗ | ✗ | Z | ✗ | ✗ | ✗ | ✗ |
| CONCH | Z/F/C | ✗ | ✗ | Z | Z/F | ✗ | ✗ | Z | Z | C | ✗ | ✗ | ✗ |
| Phikon | C | C | ✗ | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | C |
| UNI | F/C | ✗ | F | ✗ | F/C | Z | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Virchow | C | ✗ | ✗ | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | ✗ |
| SINAI | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | C |
| CHIEF | C | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | C |
| Prov-GigaPath | Z/C | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Z/C | ✗ |
| Pathoduet | C | ✗ | ✗ | ✗ | F/C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | F/C |
| RudolfV | ✗ | ✗ | Z | ✗ | C | ✗ | C | ✗ | ✗ | ✗ | ✗ | C | C |
| PLUTO | C | ✗ | ✗ | ✗ | C | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ | C |
| PRISM | Z/C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | ✗ | F/C | ✗ |
| TANGLE | F | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| MUSK | C | C | ✗ | ✗ | Z/F/C | Z | ✗ | Z | Z | ✗ | C | C | C |
| BEPH | Z/F/C | C | ✗ | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Hibou | C | ✗ | ✗ | ✗ | C | ✗ | C | ✗ | ✗ | ✗ | ✗ | C | ✗ |
| mSTAR | Z/F/C | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | ✗ | C | C |
| GPFM | C | C | ✗ | ✗ | C | Z | ✗ | ✗ | ✗ | C | C | C | ✗ |
| Virchow2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | ✗ | ✗ | ✗ | ✗ | ✗ |
| MADELEINE | F | C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | F/C |
| Phikon-v2 | F/C | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | F/C | F/C |
| TITAN | Z/F/C | C | Z | ✗ | C | ✗ | ✗ | Z | Z | C | ✗ | C | C |
| KEEP | Z | ✗ | ✗ | Z | Z | ✗ | ✗ | Z | Z | ✗ | ✗ | ✗ | ✗ |
| THREADS | F/C | C | Z | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | C | F/C |

**这张表怎么读**：`Z` 零样本、`F` 少样本、`C` 完整监督；`Z/F/C` 表示三种都做过，`✗` 表示原文标为未做。横向看一行就能判断某个模型的评估面有多宽——CONCH、UNI、MUSK、GPFM、TITAN 覆盖最广，这也是 §4 结尾点名的原因。列名缩写在表 3 图注与本表首行：Cls. 分类、Surv. 生存、Retri. 检索、Seg. 分割、P2P 图块互检、I2T 图到文、T2I 文到图、RG 报告生成、VQA 视觉问答、GA 遗传改变、MP 分子预测。

> Slide-level Tasks encompass analytical tasks that utilize WSIs as primary input or output modalities. These tasks include WSI classification (Cls.), survival prediction (Surv.), WSI retrieval (Retri.), and WSI segmentation (Seg.). While survival prediction methodologically represents a classification employing specialized loss functions, its clinical application differs from standard WSI classification: the latter primarily serves for diagnosis, while the former addresses prognosis. This category is the cornerstone of CPath, enabling automated diagnosis directly from WSIs with minimal manual intervention. Consequently, the majority of methods have prioritized experimental validation in this domain.

切片级任务指以 WSI 为主要输入或输出模态的分析任务，包括 WSI 分类（Cls.）、生存预测（Surv.）、WSI 检索（Retri.）与 WSI 分割（Seg.）。虽然生存预测在方法上是用专门损失函数的分类问题，其临床应用与标准 WSI 分类不同：后者主要服务于诊断，而前者面向预后。这一类别是 CPath 的基石，能以最少的人工介入直接从 WSI 完成自动化诊断。因此，多数方法都优先在这一领域做实验验证。

> Patch-level Tasks comprise analytical tasks on patches as inputs or outputs, including patch classification (Cls.), patch-to-patch retrieval (P2P), and patch segmentation (Seg.). These tasks effectively evaluate the efficacy of the extractor, as they operate independently of additional aggregators.

图块级任务指以图块为输入或输出的分析任务，包括图块分类（Cls.）、图块到图块检索（P2P）与图块分割（Seg.）。这些任务不依赖额外的聚合器，因此能有效评估提取器的效能。

> Multimodal Tasks are tasks that evaluate multimodal capabilities of PFMs. These tasks encompass cross-modal retrieval, *i.e*., image-to-text (I2T) and text-to-image (T2I) retrieval, report generation (RG), and visual question answering (VQA). RG in our survey includes both RG and image captioning, distinguished by their input: RG utilizes WSIs to generate clinical documentation, while captioning produces concise descriptions from patches. The increasing emphasis on these tasks reflects the clinical reality that pathologists integrate multimodal data in the decision-making process.

多模态任务指评估 PFMs 多模态能力的任务，涵盖跨模态检索，即图到文（I2T）与文到图（T2I）检索、报告生成（RG）与视觉问答（VQA）。本综述中的 RG 同时包含报告生成与图像描述（image captioning），二者以输入区分：RG 使用 WSI 生成临床文书，而图像描述从图块生成简短描述。学界对这些任务的重视不断增强，反映出临床现实：病理医生在决策过程中会综合多模态数据。

> Biological Tasks focus on biomarker detection, including genetic alteration (GA) and molecular prediction (MP). Genetic alteration includes both mutation prediction and genetic alteration, as both predict gene mutation status. Molecular prediction targets the prediction of molecular subtypes at the gene expression level, representing a distinct biomarker from genetic alteration. While these tasks can be fundamentally categorized as classification problems at either slide or patch level, their clinical applications and biological implications warrant their classification as a separate analytical category. One recently-proposed task is molecular prompting Vaidya et al. (2025), which aims to perform clinical tasks with canonical molecular profiles without requiring any task-specific model development in a similar manner to text prompting.

生物学任务聚焦生物标志物检测，包括遗传改变（GA）与分子预测（MP）。遗传改变同时包含突变预测与遗传改变，因为两者都预测基因突变状态。分子预测的目标是在基因表达层面预测分子亚型，代表一类与遗传改变不同的生物标志物。虽然这些任务本质上都可归为切片级或图块级的分类问题，但其临床应用与生物学含义使其值得被单列为一类分析任务。近期提出的一个任务是分子提示（molecular prompting）Vaidya et al. (2025)，其目标是在不需要任何任务专用模型开发的情况下，用规范的分子谱完成临床任务，方式与文本提示（text prompting）类似。

> While the extensive scope of our evaluation tasks precludes exhaustive evaluation by any single model, several methods, notably CONCH, UNI, MUSK, GPFM, and TITAN, provide excellent evaluation benchmarks across multiple training paradigms, including zero-shot, few-shot, and complete supervised learning, thereby providing more holistic insights into model capabilities and generalization potential.

由于我们评估任务的范围很广，任何单一模型都无法做穷尽评估；不过 CONCH、UNI、MUSK、GPFM 与 TITAN 等方法在零样本、少样本与完整监督学习等多种训练范式上提供了优秀的评测基准，从而对模型能力与泛化潜力给出更全面的洞见。

## 5 Future Directions｜未来方向

> PFMs constitute an emerging paradigm with transformative potential. Future research directions bifurcate into two primary domains: effective PFM Development and Utilization.

PFMs 是一个具有变革潜力的新兴范式。未来研究方向分为两大领域：有效的 PFM 开发（Development）与使用（Utilization）。

## 5.1 Foundation Model Development｜基础模型开发

> Pathology-specific Methodology design is essential for PFMs that effectively capture the unique characteristics of pathology data. Most PFMs are pretrained using algorithms originally developed for natural images, neglecting critical aspects of pathology images, as detailed in Sec. 3; therefore, there is an urgent need for algorithms designed to accommodate these challenges. This deficiency extends to multimodal pretraining as well, where CLIP and CoCa are employed without customization, resulting in the omission of inherent features of pathology and related data, including genomics and reports, that are vital for comprehensive analysis.

病理专用方法（Pathology-specific Methodology）设计对 PFMs 有效捕捉病理数据的独特性至关重要。多数 PFMs 仍使用最初为自然图像开发的算法做预训练，忽略了病理图像的关键方面（详见第 3 节）；因此迫切需要能应对这些挑战的算法。这一缺失同样延伸到多模态预训练：CLIP 与 CoCa 被直接使用而未做定制，导致病理数据及相关数据（包括基因组学与报告）中那些对全面分析至关重要的固有特征被遗漏。

> End-to-end Pretraining is critical to achieve optimal performance for PFMs. Current PFMs adopt a two-stage pretraining paradigm: extractors are trained independently, followed by the aggregator with the extractor frozen. Evidence suggests this complicates optimization, highlighting the need for end-to-end pretraining of PFMs, which poses significant challenges in CPath, as transitioning away from MIL requires developing extremely sophisticated and efficient architectures and algorithms capable of simultaneously integrating local and global pathology information for gigapixel images.

端到端预训练（End-to-end Pretraining）对 PFMs 达到最优表现至关重要。当前 PFMs 采用两阶段预训练范式：先独立训练提取器，再在提取器冻结的情况下训练聚合器。证据表明这会让优化变得复杂，因此需要对 PFMs 做端到端预训练；这在 CPath 中构成重大挑战，因为要脱离 MIL，就必须开发极其精巧且高效的架构与算法，能够同时整合千兆像素图像的局部与全局病理信息。

> Data-Model Scalability is a critical direction, as performance improvements continue to demonstrate logarithmic and sub-logarithmic scaling with model and data volume, respectively, without yet reaching a clear plateau. This domain presents four sub-directions: 1) examining the relative importance of WSI and patch quantity, particularly when considering diversity, a complex concept that is yet widely acknowledged as an indicator of high-quality data; 2) exploring efficient algorithms, due to the rapid expansion in both datasets and models, evident in transitions from CONCH (ViT-B) to CONCHv1.5 (ViT-L) and from UNI (ViT-L) to UNI2 (ViT-H); 3) addressing the data-model scale mismatch problem for the aggregator, detailed in Sec. 3.1; and 4) optimizing model scale, since the giant model size poses substantial deployment challenges in both hospital and academic settings.

数据—模型可扩展性（Data-Model Scalability）是一个关键方向：性能提升随模型规模呈对数增长、随数据规模呈亚对数增长，且尚未见到明显的平台期。该领域包含四个子方向：1）考察 WSI 数量与图块数量的相对重要性，尤其是在考虑多样性时——多样性是一个复杂概念，但已被广泛认为是高质量数据的指标；2）探索高效算法，因为数据集与模型都在快速扩张，从 CONCH（ViT-B）到 CONCHv1.5（ViT-L）、从 UNI（ViT-L）到 UNI2（ViT-H）的转变即是明证；3）解决聚合器的数据—模型规模不匹配问题，详见第 3.1 节；4）优化模型规模，因为巨型模型体量在医院与学术环境中都带来显著的部署挑战。

> Federated Learning with Efficiency is essential for addressing the challenges associated with collecting massive-scale datasets across multiple institutions while preserving patient privacy, as few institutions can feasibly collect WSIs at the million-scale alone. However, current research in this area remains limited; for instance, HistoFL Lu et al. (2022) has demonstrated improved performance, yet this benefit comes at the cost of significantly increased computational overhead. As PFMs continue to grow in size, scaling federated learning further exacerbates these challenges. Consequently, there is an urgent need to develop more efficient, privacy-protected methods in such large-scale cross-institutional collaborations.

带效率的联邦学习（Federated Learning with Efficiency）对解决以下难题必不可少：在保护患者隐私的前提下跨多个机构收集超大规模数据集，因为很少有机构能仅凭自身收集到百万量级的 WSI。然而该方向的现有研究仍然有限；例如 HistoFL Lu et al. (2022) 已展示出性能提升，但这一收益以计算开销显著增加为代价。随着 PFMs 规模持续增长，把联邦学习扩展到更大规模会进一步加剧这些挑战。因此，在此类大规模跨机构协作中，迫切需要开发更高效、且保护隐私的方法。

> Model Robustness addresses critical challenges in multi-institutional data curation. The acquisition of data from various sites inevitably introduces technical heterogeneity across scanning equipment specifications, image magnification levels, and staining protocols, resulting in significant data variations that embed site information de Jong et al. (2025). These disparities undermine training stability and model generalizability; recent work shows that most models encode site information more strongly than biological signals de Jong et al. (2025). These issues will be further exacerbated in federated learning under non-IID data distributions. Consequently, developing more robust algorithms and robustness evaluation metrics for PFMs is a critical research imperative.

模型鲁棒性（Model Robustness）针对多机构数据策管中的关键挑战。从不同站点获取数据，不可避免地会因扫描设备规格、图像放大倍率与染色流程的不同而引入技术异质性，造成显著的数据差异，并把这些站点信息嵌入数据中 de Jong et al. (2025)。这些差异会削弱训练稳定性与模型泛化性；近期工作表明，多数模型编码站点信息的强度甚至高于生物学信号 de Jong et al. (2025)。在非独立同分布（non-IID）数据下的联邦学习中，这些问题会进一步加剧。因此，为 PFMs 开发更鲁棒的算法与鲁棒性评估指标，是一项关键的研究任务。

> RAG-enhanced Pathology VLM is a trending paradigm worth investigating. Contemporary trends in Large Language Models (LLMs), such as Llama Grattafiori et al. (2024), with the prevalence of BERT-based architectures Devlin et al. (2019) in current multimodal PFMs suggest the potential utility of integrating LLMs with ViT architectures. Furthermore, given the demonstrated efficacy of Retrieval-Augmented Generation (RAG) Gao et al. (2023) in LLMs and the critical need for domain-specific expertise in pathology, RAG methodology offers promising directions for representation learning in pathology VLMs. This approach transcends the limitations of existing methods such as RudolfV, which relies primarily on clustering techniques for pathologist knowledge integration, providing a potentially more sophisticated framework for incorporating domain expertise.

RAG 增强的病理 VLM（RAG-enhanced Pathology VLM）是一个值得研究的趋势范式。当前大语言模型（Large Language Models, LLMs）的趋势，例如 Llama Grattafiori et al. (2024)，与现有多模态 PFMs 中普遍采用的 BERT 类架构 Devlin et al. (2019)，共同提示把 LLMs 与 ViT 架构结合可能具有潜在效用。此外，鉴于检索增强生成（Retrieval-Augmented Generation, RAG）Gao et al. (2023) 在 LLMs 中已被证明有效，且病理领域对领域专长有迫切需求，RAG 方法为病理 VLM 的表征学习提供了有前景的方向。该路线超越了 RudolfV 等现有方法的局限——后者主要依靠聚类技术来整合病理医生知识——为引入领域专长提供了可能更精细的框架。

## 5.2 Foundation Model Utilization｜基础模型使用

> Effective Adaptation of PFMs to downstream tasks is a critical research direction in their utilization, as these models are predominantly trained on large-scale heterogeneous datasets, resulting in general-purpose features rather than task-specific ones required for optimal performance. To address this limitation, effective adaptation methodologies are essential for task-specific optimization. The significance of this domain alignment challenge parallels the established paradigm of adapting conventional architectures, such as ResNet-50, to specialized domains like pathological image analysis, albeit with varying degrees of complexity and scope.

把 PFMs 有效适配（Effective Adaptation）到下游任务，是其使用中的关键研究方向，因为这些模型主要在大规模异构数据上训练，产出的是通用特征，而非达到最优表现所需的任务专用特征。为弥补这一局限，任务专用的优化就需要有效的适配方法。这一领域对齐问题的重要性，与把 ResNet-50 等传统架构适配到病理图像分析等专门领域这一既有范式相当，只是复杂度与范围有所不同。

> Model Maintenance constitutes a critical research domain in the context of PFMs, given the substantial computational resources required for their initial training. The potential diminishment of model performance due to novel diseases, tissue heterogeneity, or technological advancements necessitates efficient maintenance strategies to preserve model utility. Continual learning Wang et al. (2024a); Yu et al. (2024) represents a promising approach for maintaining PFM effectiveness, as it circumvents the necessity for model retraining by learning on newly observed instances. This approach significantly reduces the required computational overhead while ensuring the model remains current with the evolving clinical, disease, and technological developments.

模型维护（Model Maintenance）是 PFMs 语境下的关键研究领域，因为其初始训练需要大量计算资源。新发疾病、组织异质性或技术进步都可能使模型表现下降，因此需要高效的维护策略来保持模型的可用性。持续学习 Wang et al. (2024a); Yu et al. (2024) 是维持 PFM 有效性的一个有前景的方向，因为它通过在新观测到的实例上学习，免去了重新训练模型的必要。该方法显著降低了所需计算开销，同时确保模型跟得上临床、疾病与技术的演进。

## 6 Conclusion｜结论

> This survey presents a systematic analysis of the current Pathology Foundation Models through our proposed hierarchical taxonomy and comprehensive evaluation framework. Although the PFMs demonstrate significant advances in computational pathology, critical technical challenges merit further investigation. We delineate key directions that are worth exploring and might be instrumental in advancing both the theoretical foundations and practical applications of PFMs.

本综述通过我们提出的层级分类体系与全面的评估框架，对当前病理基础模型做了系统分析。尽管 PFMs 在计算病理中展现出显著进展，仍有关键技术挑战值得进一步研究。我们指出了若干值得探索、并可能对推进 PFMs 的理论基础与实际应用有所帮助的关键方向。

## 致谢 Acknowledgments

> The authors would like to sincerely thank Professor Irwin King from the Department of Computer Science and Engineering, the Chinese University of Hong Kong, for his active involvement in the conception and development of this paper. Due to the one-submission-per-author policy, his name could only appear in the acknowledgments. The work described in this paper was partially supported by the Research Grants Council of the Hong Kong Special Administrative Region, China (CUHK 2410072, RGC R1015-23).

作者衷心感谢香港中文大学计算机科学与工程系的 Irwin King 教授，他在本文的构思与成文过程中积极参与。由于每位作者只能投一篇的限制，他的名字只能出现在致谢中。本文所述工作部分得到中国香港特别行政区研究资助局资助（CUHK 2410072, RGC R1015-23）。

## 读完自检

能在不看笔记的情况下回答，就算过关；答不上来就回读对应小节。

1. 提取器和聚合器各自输入输出什么？为什么通常只训练聚合器？（§2.1）
2. 「模型范围」这一维分的三类分别是什么，各自最大的问题是什么？（§3.1）
3. SSL 的三种技术分别对应哪些代表方法？CHIEF 特殊在哪里？（§3.2）
4. 四类评估任务分别考察能力链上的哪一环？为什么生物学任务被单列？（§4）
5. 七个未来方向里，哪两个用你现在的算力和数据就能碰？（§5.1、§5.2）

## 这份对照的边界

- **范围**：正文（摘要、§1–§6）与图注、表注全文对译；**参考文献不逐条对译**（原文 100+ 条，属查证材料），正文中的 `Author et al. (2024)` 形式原样保留，便于回原文定位。
- **表格取数**：三张表按 arXiv v2 的 HTML 逐格重建，并与 IJCAI 正式版 PDF 对照，数据一致。Table 1 里的 `ViT-S/16-XS/256` 这种连写形式在正式版表格中也是这样（原文排版所致），照原文保留；解读时按 §3.2 理解为两个编码器 `ViT-S/16` 与 `ViT-XS/256`。
- **Table 2 少一列**：原表最后一列 `Links` 是指向各模型代码仓库的超链接，arXiv HTML 未保留链接地址，故本文件省略该列，其余 6 列完整。
- **译文定位**：中文用于快速理解，出现术语分歧时以英文原文为准；本文件不包含任何超出原文的解释、推断或评价。
- **在哪读**：站内阅读器（`?domain=pathology&paper=50-pfm-survey`）与 VS Code、Obsidian、GitHub 预览都能正常成表——阅读器已启用 GFM 表格与 KaTeX 公式；本篇的「已读完」标记与每周计划 Day 1 第一项共用同一份进度。
