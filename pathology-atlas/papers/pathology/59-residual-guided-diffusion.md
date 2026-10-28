# 59｜Two-Stage Residual-Guided Diffusion：先粗后细，用潜空间残差补回细胞细节

**论文**：Two-Stage Residual-Guided Diffusion Framework for High-Fidelity Pathology Image Restoration，2026 International Conference on Electronics, Information, and Communication (ICEIC)，2026 年 1 月 18–21 日，澳门（DOI:10.1109/ICEIC69189.2026.11386037）  
**定位**：WSI 失焦模糊修复、两阶段扩散、截断扩散调度、潜空间残差条件  
**精读核验**：依据 IEEE Xplore 摘要与公开章节结构整理（2026-10-15）；正文在付费墙后，方法细节与结果数值未逐页核对，尚未复现。

## 30 秒看懂

**一句话**：Two-Stage Residual-Guided Diffusion 把"结构"和"细节"拆成两个阶段：第一阶段少步数只求结构对，第二阶段把"还差多少"当条件去补细节。

**问题**：扫描仪在速度与质量之间取舍，WSI 上出现成片失焦区；而现有扩散修复的通病是感知指标好、细胞与纹理细节糊。

**瓶颈**：单阶段扩散既要管结构又要管高频，低步数采样下细节必然不足；而细节恰恰是病理判读依赖的部分。

**insight**：把粗输出与真值在潜空间的残差当作第二阶段的引导信号——等于明确告诉模型"还差什么"，而不是让它把整张图重新猜一遍。

## 3 分钟讲清

**方法（按顺序）**：
1. 输入失焦图，编码到潜空间。
2. 阶段一做高度截断的潜扩散：只跑极少步，输出结构连贯但细节缺失的粗修复。
3. 计算残差 $r=E(x_{gt})-E(x_{coarse})$（潜空间，不是像素空间）。
4. 阶段二以 $r$ 为条件做二次扩散，专门合成高频细节。
5. 输出等价于沿残差方向补足粗结果，用 LPIPS / CLIP-IQA 等感知指标评价。

**作者证据在哪**：正文在 IEEE 付费墙后，本笔记只有摘要口径——"优于当前最先进的图像修复模型，LPIPS 与 CLIP-IQA 一致提升"，没有任何可比数值。方法在 §III、结果表在 §V，拿到正文前不要引用具体数字。

**和上一代的区别**：与 ArtiFusion / ArtiDiffuser 的单阶段端到端不同，它显式分解"粗修复 → 残差 → 精修"；与 RestorePath 的任务类型不同——这篇处理退化型伪影（失焦，信息仍在），那篇处理遮挡型伪影（信息缺失，必须借邻域）；与 ZoomLDM 相比，细节来自残差条件而不是尺度条件。

**讲 PPT 用这张**：两阶段流程图 + 残差条件的定义式；结果页只写"感知指标一致提升"，别把摘要里的定性结论说成数值领先。要补一张自己的 LPIPS/SSIM/核分割一致性对照表再汇报。

## 1. 问题及研究位置

论文的出发点很窄也很实：

- 现象：扫描仪在速度与质量之间取舍，整片均匀对焦难以维持，WSI 上出现成片失焦区。
- 已有扩散修复的失效：**细粒度细胞与纹理细节**重建不足——而病理判读恰恰依赖这些细节。
- 提出：把「结构」与「细节」拆到两个阶段处理，第二阶段显式以残差为条件。

在支线里的定位：

- 与 [RestorePath](49-restorepath.md) 相比：后者处理的是气泡/折叠这类**遮挡型**伪影（信息缺失，必须从邻域推断），这篇处理的是**退化型**伪影（失焦模糊，信息被卷积混合但仍在）。两类问题的先验强度完全不同。
- 与 [ArtiFusion](55-artifusion.md) / [ArtiDiffuser](57-artidiffuser.md) 相比：同样用扩散，但这两篇是单阶段端到端，训练目标直接对齐去伪影结果，没有「粗修复 → 残差 → 精修」的分解。
- 与 LRDM / ZoomLDM 相比：那两篇是**生成**（从噪声或嵌入造图），这篇是**修复**（对齐给定输入），目标函数与评价口径都不一样。

## 2. 核心方法和数据流

```text
输入：失焦（退化）WSI patch x_degraded

阶段一：粗修复（结构优先）
x_degraded → 编码器 → 潜空间
    → 潜扩散，高度截断调度（只跑极少步 / 只降到较小噪声水平）
    → 输出粗修复 x_coarse：结构连贯、细节缺失

阶段二：细节合成（以残差为条件）
残差 r = E(x_gt) − E(x_coarse)        # 真值与粗输出在潜空间的差
    → 扩散过程条件化为 r（残差引导）
    → 合成高频细节 Δ
    → 最终输出 x_final = x_coarse + 解码(Δ)（等价于沿残差方向补足）

评估：LPIPS、CLIP-IQA 等感知指标 + 定性判读细胞结构清晰度
```

要点与待核验项：

- 「**高度截断的扩散调度**」意味着第一阶段不做完整反向过程，只恢复低频结构；这是把算力预算从结构挪到细节的做法。
- 第二阶段的**残差条件来自潜空间**而非像素空间，等价于在 VAE 隐空间里做「残差回归 + 生成式补全」；好处是条件尺度稳定，代价是细节上限受编码器重建能力约束。
- 「优于 SOTA」的支撑指标只有 **LPIPS 与 CLIP-IQA**（摘要口径）——两者都是感知/分布类指标，不含 PSNR/SSIM 这类保真度指标。**感知更清晰 ≠ 诊断信息更正确**，这是复现时必须自己补的检查。
- 未核验：潜空间的编码器是什么（VAE 还是病理基础模型）、截断到哪个噪声水平、残差如何注入（拼接 / 加性 / cross-attention）、数据集名称与规模、对比基线名单、具体数值。

## 3. 论文证据与实验范围

- **摘要口径的结论**：优于当前最先进的图像修复模型；在 **LPIPS、CLIP-IQA** 等关键感知指标上取得一致提升；定性上恢复出「诊断关键细胞结构」且清晰度明显更优。
- **任务范围**：单一退化类型——**失焦模糊**；摘要未提及其他伪影（气泡、折叠、墨迹）是否适用。
- **未从摘要核验**：数据集、训练/测试划分、对比基线、任何具体数值、消融（是否有「去掉残差条件」的对照）、推理步数与耗时。
- **可用章节结构**（IEEE Xplore 公开目录）：`I. Introduction` → `II. Related Works` → `III. Methods` → `IV. Experiments` → `V. Results`。按此结构，方法细节在 III，结果表在 V。

## 4. 复现与审计重点

- **先判定值不值得复现**：这是一篇短文，摘要只给感知指标。若要做基线，第一步是拿到正文的表格数字与所用数据集；拿不到就只能在自建失焦数据上重实现。
- **必须补保真度指标**：只报 LPIPS / CLIP-IQA 的修复结果可能出现「观感细腻但细胞核计数偏移」——补 PSNR/SSIM 与细胞级指标（如核分割一致性）再下结论。
- **消融优先级**：「去掉第二阶段残差条件」与「两个阶段都用完整扩散」这两个对照最能说明方法的必要性，应最先复现。
- **截断调度的敏感性**：截断点是精度/速度的核心旋钮，需扫一遍，观察结构错误是否由第一阶段直接传递到最终输出（两阶段方法的典型风险：**粗修复的结构错误无法被第二阶段纠正**）。
- **失焦合成方式决定结论**：模糊核（高斯/圆盘/真实扫描）不同会显著改变难度；用合成失焦训练、在真实失焦上评估才算有说服力。

## 5. 建议阅读顺序

`Abstract` → `I. Introduction`（失焦来源与细节丢失问题）→ `II. Related Works`（扩散修复现状）→ `III. Methods`（两阶段划分 + 残差条件的定义）→ `V. Results`（LPIPS / CLIP-IQA 数值与对比基线）→ `IV. Experiments`（数据集与指标口径）。

## 6. 前后关联

- 与 [RestorePath](49-restorepath.md) 对照：遮挡型伪影 vs 退化型伪影，前者靠邻域上下文，后者靠退化先验。
- 与 [ArtiFusion](55-artifusion.md) 对照：同为病理扩散修复的早期脉络，一个单阶段端到端，一个两阶段残差引导。
- 与 [ArtiDiffuser](57-artidiffuser.md) 对照：反事实「只改伪影区」与两阶段「结构 + 细节」是两种不同的分解方式。
- 与 [ZoomLDM](58-zoomldm.md) 对照：放大/多尺度生成与失焦修复都在重建高频，可比较「细节从哪来」——一个从尺度条件生成，一个从残差条件恢复。
- 与 [MRPT](48-mrpt.md) 相连：细胞级细节恢复的收益最终要靠多倍率表征与下游任务衡量。

## 原文摘要

> The digitization of whole slide images in computational pathology frequently introduces out-of-focus blur, a prevalent artifact that can compromise diagnostic accuracy. Although recent diffusion-based restoration methods have shown notable success, they often fail to reconstruct the fine-grained cellular and textural details critical for histopathological interpretation. To address this limitation, we propose a two-stage residual-guided diffusion framework tailored for high-fidelity pathology image restoration. In the first stage, a latent diffusion process with a highly truncated diffusion schedule rapidly generates a coarse yet structurally coherent restoration. The second stage performs a targeted synthesis of the high-fidelity details by conditioning the diffusion process on the latent space residual between the coarse output and the ground truth. The experimental results demonstrate that the proposed method is superior to state-of-the-art image restoration models, yielding consistent improvements in key perceptual metrics such as LPIPS and CLIP-IQA. Qualitative evaluations further confirm that the proposed approach restores diagnostically critical cellular structures with markedly superior clarity, offering an effective solution for generating high-fidelity, degradation-free WSIs to enhance diagnostic accuracy in computational pathology.

*来源：IEEE Xplore 会议论文摘要（DOI:10.1109/ICEIC69189.2026.11386037）；逐字原文，未改写、未压缩。*

## 中文摘要

> 在计算病理学中，全切片图像（WSI）的数字化经常引入失焦模糊，这是一种普遍存在、可能损害诊断准确性的伪影。尽管近期基于扩散的修复方法取得了显著成功，它们往往无法重建对组织病理学判读至关重要的细粒度细胞与纹理细节。为应对这一局限，我们提出一个面向高保真病理图像修复的两阶段残差引导扩散框架。在第一阶段，一个具有高度截断扩散调度的潜扩散过程快速生成粗粒度但结构连贯的修复结果。第二阶段以粗输出与真值之间的潜空间残差为条件，对扩散过程进行针对性引导，从而合成高保真细节。实验结果表明，所提方法优于当前最先进的图像修复模型，在 LPIPS 与 CLIP-IQA 等关键感知指标上取得一致提升。定性评估进一步确认，所提方法以明显更优的清晰度恢复了具有诊断关键性的细胞结构，为生成高保真、无退化的 WSI 以提升计算病理学诊断准确性提供了一个有效方案。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 7. 链接

- [IEEE Xplore 论文页](https://ieeexplore.ieee.org/document/11386037)
- [DOI](https://doi.org/10.1109/ICEIC69189.2026.11386037)
