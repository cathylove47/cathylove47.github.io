# TransMIL：从独立 patch 到相关实例建模

## 1. 三分钟摘要与推荐理由
TransMIL 用 Transformer 显式建模 WSI 中 patch 之间的相关性，并通过金字塔位置编码恢复二维空间结构，是理解后续长序列 MIL 与 Mamba 方法的重要桥梁。

## 2. 论文解决的问题及其研究位置
传统 MIL 常近似把实例视为独立样本，忽略腺体、间质和肿瘤区域的共现关系。TransMIL 将 bag 视作相关序列。

## 3. 核心方法和数据流
预提取 patch 特征 → 补齐为近似方形网格 → Transformer 层 → PPEG 金字塔位置编码 → 再一层 Transformer → class token 分类。

## 4. 关键实验、数据集与指标
论文在 TCGA 与 CAMELYON16 等 WSI 分类设置比较多种 MIL。论文事实：实验支持相关实例和位置编码的贡献，但不同基线需确保使用相同特征与划分。

## 5. 官方代码仓库审计
仓库事实：核心模型位于 `models/TransMIL.py`，数据与训练入口集中在仓库主脚本；代码公开但环境与数据准备说明较精简。复现评级 **B+**。

## 6. 环境、显存、存储和数据准备要求
训练依赖预提取特征。自注意力随实例数近似二次增长，超长 WSI 往往需要采样或控制 bag 长度。

## 7. 建议复现路径
最小测试：随机 bag 通过模型并核对输出尺寸。标准实验：固定 CLAM 特征复现一个二分类任务。扩展实验：与 MambaMIL、GMMamba比较性能—显存—实例数曲线。

## 8. 建议代码阅读顺序
数据读取 → `models/TransMIL.py` 中 PPEG 与 Transformer 模块 → 训练循环 → 指标汇总。

## 9. 值得借鉴的思想与可迁移组件
位置编码不是装饰：打乱 patch 后，模型必须重新获得空间关系；将二维组织布局映射到 bag 表征是核心设计。

## 10. 局限、复现风险和博士课题切入点
补方形网格可能引入虚拟实例；长序列成本高；患者级切分、坐标顺序和特征编码器必须统一。

## 11. 与前后论文的关联
TransMIL 连接 CLAM 类注意力 MIL 与 MambaMIL/GMMamba 的高效长序列建模。

## 12. 官方链接
[NeurIPS 论文](https://papers.nips.cc/paper/2021/hash/10c272d06794d3e5785d5e7c5356e9ff-Abstract.html) · [代码](https://github.com/szc19990412/TransMIL)

