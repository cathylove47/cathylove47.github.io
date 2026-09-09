# 22｜PathFinder：把病理诊断拆成分诊、导航、描述和决策

**论文**：PathFinder: A Multi-Modal Multi-Agent System for Medical Diagnostic Decision-Making Applied to Histopathology，ICCV 2025  
**定位**：多智能体、WSI 导航、黑色素细胞病变、自然语言证据  
**老师推荐线**：类病理医生推理流程

**精读核验**：ICCV 2025 正式论文、补充材料和项目页已核验（2026-09-02）。

## 1. 三分钟摘要与推荐理由

PathFinder 把 WSI 诊断拆成四个角色：Triage Agent 先判断良性/风险；Navigation Agent 选择下一处 ROI；Description Agent 描述 patch；Diagnosis Agent 汇总轨迹后给出诊断。它的重点不是多个聊天机器人，而是将“先低倍扫视、再高倍取证、最后综合”的工作流显式化。

论文事实：在 238 例 M-Path 黑色素细胞病变中，系统准确率 74%，高于最佳对照 66% 和论文引用的病理医生平均 65%。这只支持该特定数据集和任务，不应外推到广泛病理诊断。

## 2. 问题及研究位置

单位是病例/WSI，四分类标签由三名皮肤病理专家共识得到。数据划分为 168/35/35；另有 32 名完成研究的病理医生 viewport 轨迹用于导航学习。

## 3. 核心方法和数据流

```text
WSI → Triage：良性或风险
风险病例 → Navigation：文本条件 U-Net 生成重要性图
→ Description：Quilt-LLaVA 描述选中 patch
→ 多轮证据轨迹 → Diagnosis：GPT-2 汇总四分类
```

初版 LLaVA 式导航因小数据过拟合到中心区域，作者改用文本条件 U-Net；这是论文中很有价值的失败记录。

## 4. 实验、数据集与指标

M-Path 含 238 例 H&E WSI、4 个诊断类别。Triage 使用 10×、512×512 非重叠 patch 与 Quilt-Net 特征；Description Agent 用约 102K 条精简指令微调。两名专家对 25 个病例的 patch 描述做双盲偏好评价。

## 5. 官方代码仓库审计

- 评级：**B−**。论文声明数据、代码和模型位于项目页，但截至核验日项目页未提供像常规 GitHub 仓库一样完整、可逐文件审计的公开训练流水线。
- 可从论文核验算法与训练设定，无法核验具体脚本、环境锁、checkpoint 加载路径。
- 待核验：M-Path 数据申请、完整模型权重、导航轨迹处理代码。

## 6. 环境、显存与数据

资源信息未完整量化。M-Path 数据含敏感临床工作流与 viewport 轨迹，获取条件可能比公开 TCGA 更严格；复现前先确认访问与再分发许可。

## 7. 建议复现路径

1. **最小测试**：先验证项目页提供的单病例推理与证据轨迹，不从头训练。
2. **标准实验**：严格使用病例级 168/35/35 划分，复现 74% 准确率并报告每类混淆矩阵。
3. **扩展实验**：用盲法比较导航轨迹与真实病理医生 viewport，检验“像病理医生”而非只看最终准确率。

## 8. 建议代码阅读顺序

待完整仓库公开后：数据划分 → viewport 转重要性图 → Triage → Navigation → Description → Diagnosis → 四分类评估。当前先按论文图 1、方法 3–4 节和补充材料阅读。

## 9. 可借鉴思想

把诊断分解成可观测步骤；保留逐步证据；公开失败的导航方案与小数据过拟合现象。

## 10. 局限、风险与课题切入点

测试集仅 35 例；“超过病理医生平均”受阅片条件、任务定义与样本构成影响；自然语言解释可能流畅但错误。应做多中心、更大样本、校准与错误严重度评价。

## 11. 前后关联

与 [HistoSelect](15-histoselect.md) 都模拟粗到细观察；PathFinder 更强调多角色流程，HistoSelect 更强调问题驱动的组织选择。

## 12. 链接

- [CVF 论文页](https://openaccess.thecvf.com/content/ICCV2025/html/Ghezloo_PathFinder_A_Multi-Modal_Multi-Agent_System_for_Medical_Diagnostic_Decision-Making_Applied_ICCV_2025_paper.html)
- [项目页](https://pathfinder-dx.github.io/)

