# 23｜E2E-ViT：把 patch 预训练 ViT 改造成端到端 WSI 模型

**论文**：Turning Pre-Trained Vision Transformers into End-to-End Histopathology Whole Slide Image Models for Survival Prediction，CVPR 2026  
**定位**：端到端 WSI、ViT 长序列外推、生存表征  
**老师推荐线**：下一代 WSI 表征学习

**精读核验**：CVPR 2026 正式论文与 Apache-2.0 官方仓库已核验（2026-09-02）。

## 1. 三分钟摘要与推荐理由

传统 WSI 流程先离线提取每个 tile 的特征，再训练 MIL 聚合器，视觉 encoder 无法随任务更新。E2E-ViT 重新组织图像输入、压缩 token 序列并加入相对位置编码，把已有 patch-level ViT 权重直接转换为能处理整张组织区域的模型，不增加额外参数。

论文在 5 个生存队列上把 ViT-Small、CONCH、H0-mini 转换后，与两阶段 MIL 和 slide foundation model 比较，结果支持这种转换具有竞争力。

## 2. 问题及研究位置

输入仍由预裁剪 patch 组成，而不是直接解码原始 SVS；“端到端”指 patch 像素到 WSI 任务输出可联合反向传播。监督单位是患者级生存结局。

## 3. 核心方法和数据流

```text
WSI tissue patches → 重新拼接/批量输入 ViT patch embedding
→ 序列压缩 → Transformer backbone + 相对位置编码
→ slide feature → 生存头 → 风险
```

核心假设是预训练 ViT 对更长序列具有可外推性；不同癌种所需保留的 token 比例可能不同。

## 4. 实验、数据集与指标

五个队列来自 CPTAC 与 MBC：CCRCC 218、HNSC 243，并包括 LUAD、PDAC 与转移性乳腺癌。用 C-index 比较 7 个 MIL 方法与多种 SFM；实验在单张 A100 80GB 上完成。

## 5. 官方代码仓库审计

- 评级：**B+**。Apache-2.0；结构小而清楚，包含模型、训练、数据 JSON 和 CONCH 权重提取。
- 关键文件：`e2e_vit.py`、`train.py`、`extract_conch_visual.py`、`run.sh`、`data_jsons/*.json`。
- README 明确要求预先裁好 224×224 patch，并用文件名保存坐标。

## 6. 环境、显存与数据

依赖 PyTorch、torchvision、timm、scikit-survival、Pillow、TensorBoard。单 A100 80GB 是论文设定；更小显存可降低序列长度，但会改变有效感受野与结果。

## 7. 建议复现路径

1. **最小测试**：用 `example_dataset.json` 和少量 patch 完成前向、损失与 checkpoint 保存。
2. **标准实验**：选 CPTAC-CCRCC，固定患者级 split 和 token 比例，复现一项 C-index。
3. **扩展实验**：按组织面积自适应压缩率，并与冻结 encoder 的计算/精度前沿比较。

## 8. 建议代码阅读顺序

`README.md` → `data_jsons/example_dataset.json` → `e2e_vit.py` → `train.py` → `run.sh` → `extract_conch_visual.py`。

## 9. 可借鉴思想

复用 patch 预训练权重而非从头训练 WSI 模型；用结构转换打通 end-to-end；同时报告不同模型规模。

## 10. 局限、风险与课题切入点

仍依赖预裁 patch；A100 80GB 限制可及性；仅生存任务与有限队列，尚不能证明任务无关的通用 slide 表征。可研究多尺度、低显存后训练和视觉语言版本。

## 11. 前后关联

与 [HIPT](04-hipt.md) 的层级结构和 [MambaMIL](14-mambamil.md) 的长序列方案形成三种不同路线。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2026/html/Li_Turning_Pre-Trained_Vision_Transformers_into_End-to-End_Histopathology_Whole_Slide_Image_CVPR_2026_paper.html)
- [官方代码](https://github.com/WonderLandxD/E2E-ViT)

