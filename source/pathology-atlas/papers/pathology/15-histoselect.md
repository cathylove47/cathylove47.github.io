# 15｜HistoSelect：像病理医生一样按问题粗到细选择 WSI 证据

**论文**：Act Like a Pathologist: Tissue-Aware Whole Slide Image Reasoning，CVPR 2026  
**定位**：WSI 视觉问答、问题引导检索、视觉 token 效率  
**建议投入**：先使用公开 warm-start 与 HistoSelect 权重做测试；完整训练需要四卡与大模型环境。

**精读核验**：CVPR 2026 正式论文，pp. 6972–6981；总评估规模为356,000个问答对。论文报告平均减少70%视觉 token，并在三个病理 QA 任务上提升 accuracy（2026-09-01）。

## 1. 三分钟摘要与推荐理由

HistoSelect 观察到病理医生不会把整张切片所有区域同等看待，而会根据临床问题先扫视组织类型，再放大相关区域。模型先进行 tissue-aware grouping，再由问题引导的 group sampler 分配预算，最后由 patch selector 选择最相关 patch，送入视觉语言模型回答问题。

论文报告平均减少约 70% 视觉 token，同时在三个病理问答任务上提高准确率。它把效率、可解释区域和问题条件化统一到同一检索框架中。

## 2. 问题及研究位置

WSI VLM 的主要瓶颈不是语言模型能否生成答案，而是海量 patch 中哪些证据与当前问题有关。均匀采样会浪费 token，普通 attention 也可能把不相关组织带入推理。

## 3. 核心方法和数据流

```text
WSI → tissue segmentation / patch features
question embedding + tissue-aware groups → group sampler
组内 question-guided patch selector → sparse visual tokens
SlideChat-style MLLM → grounded answer
```

## 4. 实验、数据集与指标

论文在 SlideBench-VQA、WSI-Bench 与院内卵巢任务等设置上评估，共涉及大规模问答对。除准确率外，重点关注 token 数、选择区域与病理医生判断的一致性。院内数据不能从公开仓库完全复现，应与公开任务分开报告。

消融显示完整模型在 Morphology/Diagnosis/Treatment 三类问题上达到94.57/85.79/97.92 accuracy；随机采样为88.84/78.02/91.67。token budget 在5k附近最佳，继续增加到10k没有稳定增益；这支持“问题相关的充分子集”而不是“token 越多越好”。

## 5. 代码仓库审计

- 评级：**B+**；MIT 许可证。
- 完整预处理、组织分割、问题 embedding、四卡训练、测试脚本、SlideChat warm-start 和 HistoSelect 权重入口均存在。
- 仓库内嵌/改造 XTuner，依赖链较长；复现成本高于普通 MIL。
- 关键文件：`data_preprocessing/tissue_segmentation.py`、`data_preprocessing/generate_question_embeddings.py`、`xtuner/model/llava_selector.py`、`xtuner/tools/test_histoselect.py`。

## 6. 环境、显存与数据

仓库提供 `environment.yaml`、`requirements.txt` 和 Deepspeed 配置。README 的训练入口使用 4 GPU；还需 CONCH checkpoint、SlideChat stage-2 warm-start、WSI-LLaVA/SlideChat 数据和大量预计算特征。

## 7. 建议复现路径

1. **最小测试**：下载公开 HistoSelect 与 stage-2 权重，先在少量已预处理样本运行 `scripts/histoselect_testing.sh`。
2. **标准实验**：按 README 完成切块、CONCH 特征、组织分组和问题 embedding，再复现一个公开 benchmark。
3. **扩展实验**：改变 token budget、组织分组和问题类型，绘制准确率—token—延迟曲线，并检查选择区域稳定性。

## 8. 代码阅读顺序

`README.md` → `data_preprocessing/tissue_segmentation.py` → `generate_question_embeddings.py` → `xtuner/configs/histoselect/stage_2_selector.py` → `xtuner/model/llava_selector.py` → `scripts/histoselect_training.sh` → `xtuner/tools/test_histoselect.py`。

## 9. 可借鉴思想

- patch 选择应由问题条件化，而非全任务共享一张静态 attention map。
- 计算效率可以通过证据检索改进，而不只靠更小模型。
- 将“选了哪里”作为独立可验证输出。

## 10. 局限、风险与课题切入点

问题或组织 prompt 有偏差时，早期筛选可能不可逆地丢失证据；公开 benchmark 也可能偏向短答案。可研究带回溯的自适应检索、不确定性触发的二次扫描、开放问题下的证据充分性，以及病理医生真实工作流中的时间收益。

**关键复现实验：**固定同一 MLLM 和视觉 encoder，仅替换选择器；同时报告答案正确率、selected-region recall、token 数、端到端延迟和“证据不足”率。选择区域与医生一致是相关性证据，不等于诊断因果解释。

## 11. 前后关联

它综合了 [MI-Zero](06-mi-zero.md) 的图文对齐、[WSI-FiVE](12-wsi-five.md) 的语义交互和 [PathDino](13-pathdino.md) 一类 patch encoder 的表征基础，是本路线的终点而不是起点。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/CVPR2026/html/Huang_Act_Like_a_Pathologist_Tissue-Aware_Whole_Slide_Image_Reasoning_CVPR_2026_paper.html)
- [官方代码](https://github.com/winston52/HistoSelect)
- [arXiv](https://arxiv.org/abs/2603.00667)
