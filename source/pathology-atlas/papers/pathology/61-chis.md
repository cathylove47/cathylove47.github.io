# 61｜CHIS：不改扩散模型权重，用频域初始化与小波调制控制细胞结构

**论文**：Controllable Histopathology Image Synthesis with Training-free Structural Initialization and Textural Modulation；**MICCAI 2026 主会已发表**，LNCS pp. 87–96，[DOI 10.1007/978-3-032-38224-5_9](https://doi.org/10.1007/978-3-032-38224-5_9)，发表核验 2026-10-28。精读依据 arXiv:2606.27935，首发 2026-06-26，版本 v2（2026-06-30）。
**定位**：病理图像与细胞掩码配对生成；冻结 PixCell 的采样期控制，不是伪影修复，也不是全 WSI 生成。  
**精读核验**：2026-10-22 核对 arXiv 题录、§2–3、Table 1–3 与官方仓库的依赖/推理入口；本次补漏入库，并非本周新首发；未运行作者模型。

## 30 秒看懂

**一句话**：CHIS 不动扩散模型的一分权重，只改采样初态的相位和过程中的小波系数，就让冻结的 PixCell 服从给定细胞掩码。

**问题**：已有病理扩散模型能生成组织，但未必听细胞布局；而要它听话，通常得拿结构化数据重新训练。

**瓶颈**：所谓 training-free 只是"不微调骨干"——仍然需要预训练权重、参考图和细胞形状来源，细胞聚集还依赖 cell count / area / distance 这类几何先验；输出是 256² tile，不是 WSI。

**insight**：结构信息可以放在采样轨迹的两端。开始前把目标掩码的相位混进高斯噪声（决定布局），去噪前 40 步按小波层次调粗细纹理（决定质感）——两件都不需要梯度，也不需要新数据。

## 3 分钟讲清

**方法（按顺序）**：
1. 参考图经光密度 / Otsu 粗分割，取出颜色与细胞纹理。
2. 目标掩码先填色再过 VAE 编码，降低二值掩码带来的分布偏移。
3. FFT：保留高斯噪声的幅度，在低频段混入掩码引导的相位，得到"结构上已就位"的初始噪声。
4. 冻结 PixCell 去噪，前 40 步用 SWT 小波分解调制粗/细纹理（γ=0.2、χ=0.95、ζ=0.6）。
5. 后 10 步自由采样，解码成与目标掩码配对的合成图（共 50 步）。

**作者证据在哪**：Table 1（MoNuSAC 结构一致性 FS1 0.8671 / HD95 14.93，对 NuDiff 的 0.8264 / 22.75）、Table 2（PanNuke 下游分割 Dice/AJI 0.8224/0.6437，基线 0.7742/0.5822；但 MoNuSAC 上 Dice 0.7895 低于 NuDiff 0.7930）、Table 3（PanNuke FID 7.7772 vs UGDM 7.7972，点估计接近，不宜称显著）。结构一致性用的是分割模型当尺子。

**和上一代的区别**：与 RestorePath 的差别是"改采样轨迹"对"借邻域条件并维护共享大图状态"；与 CPathOGen 的差别是免微调采样控制对训练期条件控制；与 TopoCellGen 的细胞布局先验可以串联，但那是未验证设想。

**讲 PPT 用这张**：Table 2 的 PanNuke 下游分割（合成数据真能训出更好的分割器），配 Table 1 的结构对齐；MoNuSAC 的反例一起放。

## 1. 问题及研究位置

- 输入是目标细胞 mask 与风格参考图，输出是与 mask 对应的合成组织图，可形成分割训练对。
- training-free 指 CHIS 不微调已经预训练的生成骨干，并非不需要预训练权重、参考数据或细胞形状来源。
- 论文 §2.2 的细胞聚集还依赖 cell count、area、distance 等几何先验；不能说完整流程完全摆脱了结构先验。

## 2. 核心方法和数据流

```text
目标细胞 mask + 参考病理图
  → 参考图光密度/Otsu 粗分割，提取颜色与细胞纹理
  → 给目标 mask 填色并用 VAE 编码，降低二值 mask 的编码分布偏移
  → FFT：保留高斯噪声幅度，在低频范围混入 mask 引导的相位
  → 冻结 PixCell 去噪；前 40 步用 SWT 小波分解调制粗/细纹理
  → 后 10 步自由采样 → 解码为与目标 mask 配对的合成病理图
```

论文实例共 50 步；γ=0.2、χ=0.95、ζ=0.6。参考图还提供 PixCell 原有的基础模型特征条件，不能把它描述为完全无条件生成。

## 3. 论文证据与实验范围

作者在 PanNuke、MoNuSAC、Kumar 上分别检查 mask 对齐、合成图像质量和下游实例分割。以下为作者报告，未复算。

| 证据 | 作者结果 | 解读 |
|---|---|---|
| Table 1，MoNuSAC 结构一致性 | CHIS FS1 0.8671、HD95 14.9272；NuDiff 0.8264、22.7506 | 该设置下对齐更好，不等于所有数据全面超越监督方法 |
| Table 2，PanNuke 下游分割 | Baseline Dice/AJI 0.7742/0.5822；CHIS 0.8224/0.6437 | 合成数据有下游价值；NuDiff 的 AJI 为 0.6422 |
| Table 2，MoNuSAC 下游分割 | CHIS Dice 0.7895，NuDiff 0.7930 | 完整方法并非逐项最好 |
| Table 3，PanNuke FID | CHIS 7.7772，UGDM 7.7972 | 数值接近，不能仅凭点估计宣称显著优势 |

结构一致性使用分割模型作代理尺子；不同监督条件的比较需保留训练/配对数据差异。

## 4. 复现与审计重点

1. 官方仓库含 `image_generation.py`、`controller/`、`model_zoo/`、`pyproject.toml`、`uv.lock`，不是仅有 README 的占位仓库；入口是参考图、目标 mask、输出路径。
2. README 给出 PixCell-256、PixCell-pipeline、SD3.5 VAE、UNI2-h 权重入口；后两者需要 Hugging Face 授权。资源入口已核验，权重未下载、未加载。
3. 首个实验：固定骨干、参考图、目标 mask 和随机种子，对比原采样、仅相位初始化、再加小波调制，分别测结构一致性与下游分割，而不是只挑好看的样图。
4. 检查频率截断半径、前 40/后 10 步划分和参考图偏差；高密度/不规则细胞是否仍能遵守目标布局需要单列验证。
5. 仓库称在消费卡上测试过单图推理，但这不是本站测得的显存下限；不会据此排除更大骨干或高算力复现。

## 5. 建议阅读顺序

Fig. 1 → §2.3 相位初始化 → §2.4 小波纹理调制 → §3.1 冻结骨干与参数 → Table 1 结构对齐 → Table 2 下游增益 → 官方单图入口。

## 6. 前后关联

- [RestorePath](49-restorepath.md)：对比结构控制与邻域条件；生成布局不等于修复真值。
- [CPathOGen](52-cpathogen.md)：对比训练条件控制与免微调采样控制。
- [TopoCellGen](21-topocellgen.md)：可衔接细胞布局先验；两阶段组合是研究设想，未验证。
- [LRDM](56-lrdm.md)：理解基础模型特征如何作为生成条件。

## 原文摘要

> Deep learning has demonstrated remarkable success in high-throughput histopathology image analysis. However, the performance of learning-based models critically depends on the quality and size of annotations by expert pathologists, which is a resource-intensive and time-consuming process. To address the limitations of data scarcity and annotation burden, several methods have been proposed to synthesize paired histopathology data. Nevertheless, these frameworks typically still require annotation data, albeit in reduced quantities, to impose structural constraints during training.
>
> In this work, we present CHIS, a plug-in framework that guides the sampling trajectory of a pretrained diffusion model through two key stages: structural initialization at the start and textural modulation during generation. The initial noise state is refined by fusing the phase information from a prior mask with the amplitude of Gaussian noise in the frequency domain, yielding a structurally informed starting point. During the reverse diffusion process, we adaptively modulate both coarse-grained and fine-grained textures at different wavelet decomposition levels. This enables a diffusion model pretrained solely on unlabeled images to generate outputs that align with prior structural masks while preserving the reference tissue style.
>
> We conducted extensive experiments demonstrating the superiority of CHIS in generation fidelity and its substantial benefits for downstream segmentation tasks. Code is available at https://github.com/IBIL-Code/CHIS.

*来源：[arXiv v2 摘要页](https://arxiv.org/abs/2606.27935v2)，完整原文；HTML 正文摘要有少量措辞差异，此处以摘要页为准。*

## 7. 链接

- [题录、完整摘要与版本](https://arxiv.org/abs/2606.27935)
- [方法与原表：v2](https://arxiv.org/html/2606.27935v2)
- [官方代码与依赖/资源入口](https://github.com/IBIL-Code/CHIS)
- [公开推理脚本](https://github.com/IBIL-Code/CHIS/blob/main/image_generation.py)
- [MICCAI 2026 正式收录与全文入口](https://papers.miccai.org/miccai-2026/0204-Paper1821.html)
