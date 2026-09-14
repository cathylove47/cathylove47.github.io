# DuDoRNet

## 三分钟摘要与推荐理由

DuDoRNet 同时在 k-space 与图像域循环恢复，并利用较易获得的全采样 T1 作为深先验来重建其他协议。它展示了 MRI 多对比信息如何进入网络，而不只是把不同序列堆成通道。

## 问题与研究位置

单图像域网络难处理非局部混叠；临床同次检查又常包含多种对比。论文同时利用双域互补性和 T1 解剖先验。

## 核心方法和数据流

欠采样目标对比与 T1 先验进入循环结构；Dilated Residual Dense Network 分别执行频域和图像域恢复，域间通过 FFT/IFFT 与数据一致性连接。

## 关键实验、数据集与指标

论文比较不同采样模式、加速率和是否使用 T1 先验。精读重点是：提升来自双域、循环次数还是先验信息，三者应通过消融拆开看。

## 官方代码仓库审计

`bbbbbbzhou/DuDoRNet` 提供训练、测试、模型、网络和数据目录说明，许可证存在。环境为 Python 3.7、PyTorch 0.4.1、CUDA 10，未发现一键下载完整训练数据或官方权重说明，复现评级因此为 B。

## 资源与数据准备

数据需整理为规定的 `.mat` k-space 结构，并保证对比间配准。环境较旧，建议先做现代化兼容补丁和小数据 smoke test。

## 建议复现路径

1. 构造单个配准的 T1/T2 样本跑通前向。
2. 验证每次数据一致性后已采样点误差。
3. 对比 image-only、dual-domain、dual-domain+T1。
4. 测试先验错配或缺失时的鲁棒性。

## 建议代码阅读顺序

`train.py` / `test.py` → `models` 的训练封装 → `networks` 的 DRDNet 与循环单元 → `datasets` → `utils`。

## 可迁移思想与博士切入点

可研究未配准多对比、先验缺失、自适应先验可信度和结构“幻觉”。临床上，错误先验传播比平均 PSNR 更值得关注。

## 局限与复现风险

需要成对且对齐的多对比数据；旧环境和数据可用性是主要障碍。先验序列若含病变差异或运动，可能引入错误结构。

## 与前后论文的关联

它把 VarNet 的单任务展开扩展到双域/多对比；MC-VarNet 和 PromptMR 会更系统地处理多对比表示。

## 官方链接

- [论文](https://openaccess.thecvf.com/content_CVPR_2020/html/Zhou_DuDoRNet_Learning_a_Dual-Domain_Recurrent_Network_for_Fast_MRI_Reconstruction_CVPR_2020_paper.html)
- [代码](https://github.com/bbbbbbzhou/DuDoRNet)
