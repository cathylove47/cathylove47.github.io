# 精读深化方案

现状：41 篇笔记中，仅 DSMIL（444 行）达到深度精读（L1），其余 40 篇为导读级（L0，38–75 行）。

## 方案：三层推进

### 第 1 层：主线必读升级为 L1（每篇 300–500 行）
优先级按学习路径：

**计算病理（7 篇）**
1. `30-transmil` — TransMIL（MIL 主线核心，老师推荐）
2. `05-dtfd-mil` — DTFD-MIL（伪包思想，与 DSMIL 联动）
3. `04-hipt` — HIPT（层级表征，高难度，博士切入点密集）
4. `31-conch` — CONCH（视觉语言基座）
5. `32-prov-gigapath` — Prov-GigaPath（基础模型范式）
6. `29-clam` — CLAM（老师推荐、实操入口）
7. `28-gmmamba` — GMMamba（老师推荐，MIL 演进终点）

**MRI 重建（4 篇）**
1. `04-varnet` — E2E-VarNet（物理展开主线）
2. `03-modl` — MoDL（共轭梯度展开）
3. `09-promptmr` — PromptMR（多对比/提示学习）
4. `06-score-mri` — Score-MRI（扩散先验）

### 第 2 层：L0 笔记做"指针式"增强（每篇 +10~15 行）
不整体重写，只补三样：
- 第 3 节末尾加 1 个 ASCII 数据流草图；
- 第 10 节补 2 个具体局限（对照领域批判清单）；
- 第 11 节加"前置必读指针"指向对应 L1 篇目。

### 第 3 层：横向矩阵（第 11 节的机器可维护形态）
- 在两个 domain 各建一张 9 列对比矩阵（可作为 SPA 后续功能或 markdown 附录）。
- 列：Citation | 问题 | 核心方法 | 数据 | Main claim | Evidence | 局限 | Use as。

## 执行纪律
- 一次升级一篇，写完即按 SKILL.md 校验清单检查（公式渲染、Fig/Table 解读、行数）。
- 证据规则硬约束：Source-Adjacent 引用 + 三档结论标注 + 公式防编造。
- 老师推荐的 13 篇中尚未覆盖的（20-mcat、26-ps3、27-dispro 等）保持 L0，但第 11 节必须指明与主线 L1 篇目的关系。

## 依赖
- L1 笔记写作需要 arXiv 原文 + 官方仓库实时核验（可用读论文 prompt / 仓库审计流程）。
- 建议逐篇交给 agent 执行 `paper-close-reading-zh` skill，人工抽查 Fig/Table 解读质量。
