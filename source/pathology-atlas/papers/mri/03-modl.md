# MoDL

## 原文摘要

> We introduce a model-based image reconstruction framework with a convolution neural network (CNN) based regularization prior. The proposed formulation provides a systematic approach for deriving deep architectures for inverse problems with the arbitrary structure. Since the forward model is explicitly accounted for, a smaller network with fewer parameters is sufficient to capture the image information compared to black-box deep learning approaches, thus reducing the demand for training data and training time. Since we rely on end-to-end training, the CNN weights are customized to the forward model, thus offering improved performance over approaches that rely on pre-trained denoisers. The main difference of the framework from existing end-to-end training strategies is the sharing of the network weights across iterations and channels. Our experiments show that the decoupling of the number of iterations from the network complexity offered by this approach provides benefits including lower demand for training data, reduced risk of overfitting, and implementations with significantly reduced memory footprint. We propose to enforce data-consistency by using numerical optimization blocks such as conjugate gradients algorithm within the network; this approach offers faster convergence per iteration, compared to methods that rely on proximal gradients steps to enforce data consistency. Our experiments show that the faster convergence translates to improved performance, especially when the available GPU memory restricts the number of iterations.

*来源：arXiv:1712.02862（https://arxiv.org/abs/1712.02862）。逐字原文，未改写、未压缩。*

## 中文摘要

> 我们提出一个基于模型的图像重建框架，其正则化先验基于卷积神经网络（CNN）。所提出的形式化方法提供了一种系统性的途径，用于为具有任意结构的逆问题推导深度架构。由于前向模型被显式地纳入考量，与黑盒深度学习方法相比，一个参数更少的小型网络就足以捕捉图像信息，从而降低了对训练数据和训练时间的要求。由于我们依赖端到端训练，CNN 的权重会针对前向模型进行定制，因此相较依赖预训练去噪器的方法能提供更好的性能。该框架与现有端到端训练策略的主要区别在于跨迭代与跨通道共享网络权重。我们的实验表明，这种方法将迭代次数与网络复杂度解耦，带来了诸多好处，包括对训练数据的需求更低、过拟合风险降低，以及内存占用显著减小的实现。我们提出在网络内部使用数值优化模块（例如共轭梯度算法）来施加数据一致性；与依赖近端梯度步来施加数据一致性的方法相比，这种做法每次迭代的收敛更快。我们的实验表明，更快的收敛会转化为更好的性能，尤其是在可用 GPU 显存限制了迭代次数的情况下。

*译文：对应上方「原文摘要」逐句对译，未增删内容、未压缩。专有名词与数字以英文原文为准。*

## 论文 Pipeline 原图

![MoDL 论文框架图](/papers/mri/03-modl-pipeline.svg)

> **原文图注**：Fig. 2 : MoDL-CC: extension of the MoDL architecture to the multi-coil (parallel MRI) setting. The recursive algorithm alternates between projections to the coil-constraints denoted by 𝒫 c \mathcal{P}_{c} step in ( 14 ), denoising denoted by 𝒟 𝐰 \mathcal{D}_{\mathbf{w}} in ( 13 ), followed by the data consistency step in ( 15 ).

*图源：https://arxiv.org/html/1712.02862v1。原图直接取自论文，未重绘、未描摹。*

## 三分钟摘要与推荐理由

MoDL 是“模型驱动深度学习（model-based deep learning）”的经典论文：把 CNN 当作可学习正则器，把数据一致性子问题交给共轭梯度（CG），并在迭代间共享权重。它是理解当代 unrolled network 的核心桥梁。

## 问题与研究位置

黑盒 CNN 不显式利用采集算子，传统迭代法又依赖手工先验。MoDL 将二者结合，尤其适合含多线圈灵敏度的并行 MRI。

## 核心方法和数据流

每次展开包含两个部分：残差 CNN 学习图像先验；CG 求解含前向算子 (A) 与正则权重的数据一致性问题。各迭代共享 CNN 参数，使网络深度与参数量解耦。

## 关键实验、数据集与指标

论文强调较少训练数据、权重共享与 CG 收敛带来的收益。精读时把结果表和消融分别映射到“物理模型、共享参数、迭代次数”三个主张。

## 官方代码仓库审计

`hkaggarwal/modl` 是作者仓库，含训练/测试、示例 HDF5、已训练模型和约 3 GB 的公开并行 MRI 数据链接。实现基于 TensorFlow 1.x，代码短但时代较早。

## 资源与数据准备

仓库自带单图 demo，可低成本验证。完整训练需要旧 TensorFlow 环境；现代复现宜先用原仓库核对输出，再在 PyTorch/deepinv 中实现等价模块。

## 建议复现路径

1. 运行 `tstDemo.py` 检查已训练权重。
2. 手算一次 (A^HA) 和 CG 数据一致性。
3. 复现共享权重 MoDL。
4. 消融 CG 步数、展开次数和共享策略。

## 建议代码阅读顺序

`tstDemo.py` → `model.py` 中复数变换与 CG → CNN 正则器 → `trn.py` → `supportingFunctions.py`。

## 可迁移思想与博士切入点

可研究可学习预条件器、算子失配下的稳定性、跨采样轨迹泛化、显式误差界，以及将现代基础模型作为正则器时如何保留物理一致性。

## 局限与复现风险

原始实现和数据规模较旧；CG 展开增加计算开销，训练时的前向模型假设若与真实扫描不符，物理约束也可能“约束到错误模型”。

## 与前后论文的关联

它解释了 DC-CNN 的经验级联；E2E-VarNet 则把线圈灵敏度估计也纳入端到端系统。

## 官方链接

- [论文](https://doi.org/10.1109/TMI.2018.2865356)
- [代码](https://github.com/hkaggarwal/modl)
- [数据](https://zenodo.org/records/6481291)
