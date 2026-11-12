# JiT · Just image Transformers

> Back to Basics: Let Denoising Generative Models Denoise · Tianhong Li / Kaiming He · CVPR 2026

## 阅读入口

本篇属于「扩散模型」方向，研究通用像素空间生成，不是病理或 MRI 应用论文。上方「中英全文精读」可在阅读器内打开已有全文；收藏、已读与个人笔记沿用本站阅读记录。

[独立打开中英全文精读](learning/jit-story.html)

全文保留 8 个编号公式、11 张图、13 张表、2 个算法与 79 条参考文献。以下摘要与讲解摘自已有全文数据；未新增实验或复现结果。

## 中文摘要

如今的去噪扩散模型并不在经典意义上“去噪”，即它们并不直接预测干净图像。相反，神经网络预测的是噪声或某种加噪后的量。本文认为，预测干净数据与预测加噪量在本质上是不同的。依据流形假设，自然数据应当位于一个低维流形上，而加噪量不是。基于这一假设，我们主张采用直接预测干净数据的模型；这使得表面上看容量不足的网络也能在极高维空间中有效工作。我们表明，仅作用于像素、使用大图块的简单 Transformer 就可以是强生成模型：不用 tokenizer、不做预训练、不加额外损失。我们的方法在概念上不过是“**Just image Transformers**”，即我们所称的 **JiT**。我们在 ImageNet 上以 256 和 512 的分辨率、16 和 32 的大图块尺寸报告了有竞争力的结果；在同样的设置下，预测高维加噪量可能灾难性失败。通过让网络回到流形这一根本，我们的研究回到根本，追求一种在原始自然数据上做 Transformer 扩散的自包含范式。

## 原文摘要

Today’s denoising diffusion models do not “denoise” in the classical sense, *i.e* . , they do not directly predict clean images. Rather, the neural networks predict noise or a noised quantity. In this paper, we suggest that predicting clean data and predicting noised quantities are fundamentally different. According to the manifold assumption, natural data should lie on a low-dimensional manifold, whereas noised quantities do not. With this assumption, we advocate for models that directly predict clean data, which allows apparently under-capacity networks to operate effectively in very high-dimensional spaces. We show that simple, large-patch Transformers on pixels can be strong generative models: using no tokenizer, no pre-training, and no extra loss. Our approach is conceptually nothing more than “ Just image Transformers ”, or JiT , as we call it. We report competitive results using JiT with large patch sizes of 16 and 32 on ImageNet at resolutions of 256 and 512, where predicting high-dimensional noised quantities can fail catastrophically. With our networks mapping back to the basics of the manifold, our research goes back to basics and pursues a self-contained paradigm for Transformer-based diffusion on raw natural data.

## 已有精读讲解摘录

### 先弄懂“低维流形”到底在说什么

**本站讲解**：流形在这里不是抽象拓扑概念，而是一句很具体的话：高维空间里，真实数据并不铺满所有方向，而是集中在一张很薄的面上。一张 256×256 的彩色图有约 19 万个数值，理论上能取遍整个空间，但真实照片只占其中极小一片——改变光照、姿态、物体身份会移动位置，而随机改像素不会落回照片集合。作者要对比的正是这一点：干净图像待在这张薄片上，加噪后的量（噪声本身、以及数据与噪声混合的速度）被推到薄片之外，铺满整个空间。这是作者引用的假设[4,3]，用来解释现象，不是被证明的定理；加噪量铺满高维空间这一说法来自[69]与图 1。

### “自包含”具体指省掉了什么

**本站讲解**：作者列的自包含清单是可核对的四件事：没有潜变量 tokenizer（不需要先训练一个把图像压成 latent 的自编码器）、没有对抗损失、没有感知损失（因此也不需要预训练的分类器当裁判）、没有表征对齐（因此也不需要自监督预训练的特征）。合起来的意思是：整条 pipeline 里没有第二个需要单独预训练的大组件，训练一个网络就从像素到像素。作者的主张是这种极简结构在大图块、高维 token 下仍然可用，而不是“越简单效果一定越好”。

### 输出空间和损失空间是两件独立的事

**本站讲解**：读这一节要先分开两个问题：(1) 误差在哪个空间里量——这就是损失空间；(2) 网络最后一层直接吐出哪个量——这就是输出空间。表 1 的 3×3 就是这两件事的笛卡尔积：三行是三种损失（x、ε、v），三列是三种网络输出。行列不相同时，做法是先把网络输出用代数关系换算到损失所在的空间，再算误差；代入之后，效果等于给原来的损失乘上一个只依赖 t 的权重。所以更准确的说法是：在固定网络直接输出（参数化）的前提下，改变损失空间等价于给原损失乘一个只依赖 $t$ 的时间权重。若连网络直接输出也换掉，有限网络要拟合的函数本身就变了，不能只归结为权重。

## 来源与版本

本页是 arXiv:2511.13720v2（2026-01-07，18 页）的中文全文翻译与精读，不是 CVF 最终排版版本。原文以 CC BY 4.0 发布（已从 arXiv HTML 核实）。作者 Tianhong Li、Kaiming He（MIT）。图中仅翻译文字标注，保留原始曲线、数值与样本内容；网页图片经过缩放与压缩（图 8–11 为 WebP q92），不是 PDF 原像素的逐位副本，原图可通过页面顶部「原文 PDF」查看。所有额外讲解均标为「本站讲解」，与原文分开。

- [arXiv 摘要](https://arxiv.org/abs/2511.13720)
- [原文 PDF](https://arxiv.org/pdf/2511.13720v2)
- [CVPR 2026 论文页](https://openaccess.thecvf.com/content/CVPR2026/html/Li_Back_to_Basics_Let_Denoising_Generative_Models_Denoise_CVPR_2026_paper.html)
- [CC BY 4.0 许可](https://creativecommons.org/licenses/by/4.0/)
