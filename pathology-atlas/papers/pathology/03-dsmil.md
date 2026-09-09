# 03｜DSMIL：用“关键实例”引导整张切片的弱监督聚合

**论文**：Dual-Stream Multiple Instance Learning Network for Whole Slide Image Classification With Self-Supervised Contrastive Learning  
**作者**：Bin Li、Yin Li、Kevin W. Eliceiri  
**会刊**：CVPR 2021 Oral，pp. 14318–14328  
**定位**：多实例学习（Multiple Instance Learning, MIL）、WSI 分类、弱监督定位、自监督特征  
**精读状态**：已完成论文、补充材料与官方仓库交叉核验（2026-09-01）  
**建议投入**：先用预提取 CAMELYON16 特征跑通；暂不从原始 WSI 和 SimCLR 预训练开始。

## 1. 三分钟摘要与推荐理由

### 一句话结论

DSMIL 用第一条流找出每个类别最可疑的 patch，再让第二条流根据所有 patch 与这个关键 patch 的相似度构造切片表示；它同时保留了 max pooling 对稀少阳性区域的敏感性，以及 soft attention 利用全 bag 信息的能力。

### 它解决了什么

一张全切片图像（Whole Slide Image, WSI）通常只有切片级诊断，没有 patch 级标注。把 WSI 切成成千上万个 patch 后，阳性切片中真正含病灶的 patch 可能不到组织面积的 10%。

- Mean pooling 容易把少量病灶信号淹没。
- Max pooling 只依赖一个 patch，容易被噪声和偶然高分支配。
- 普通 attention MIL 没有显式规定“应该围绕哪类证据聚合”。

DSMIL 的核心洞见是：**先用实例分类器定位一个类别相关的关键实例，再以它为查询中心软聚合整张切片。**

### 为什么值得作为第一篇主线论文

- 方法主体只有三个小模块，适合理解 MIL 的最小闭环。
- 论文把表征学习、聚合器和多尺度融合拆开，便于做公平消融。
- 官方仓库提供预提取特征、数据下载脚本、训练和热图路径。
- 它留下了很清晰的博士问题：关键实例是否稳定、attention 是否真对应病理实体、怎样引入空间关系，以及 encoder 改变后聚合机制是否仍成立。

**推荐等级：必读；建议精读方法与代码，实验表格选择性阅读。**

## 2. 论文解决的问题及其研究位置

### 2.1 学习问题

设一张 WSI 为 bag：

$$
B=\{x_1,x_2,\ldots,x_N\},
$$

其中每个 $x_i$ 是 patch，训练时只有 bag 标签 $Y$，没有实例标签 $y_i$。经典 MIL 假设二分类阳性 bag 至少包含一个阳性实例。

本论文中的粒度是：

| 项目 | 粒度 |
|---|---|
| 输入 | patch / instance |
| 监督 | slide / bag label |
| 预测 | slide classification |
| 辅助输出 | patch attention / weak localization |
| 患者层面 | 论文没有建立显式患者级模型 |

### 2.2 研究位置

DSMIL 处在三类方法的交点：

1. **实例式 MIL**：对每个 patch 分类，再用最大值形成 bag 预测。
2. **嵌入式 MIL**：先把所有 patch 聚合成固定维度表示，再分类。
3. **自监督表征学习**：先用 SimCLR 学 patch encoder，再冻结特征训练 MIL。

论文的贡献不是端到端训练整个 WSI，而是把昂贵的 patch 表征学习与轻量的 bag 聚合解耦。今天常见的“病理基础模型 encoder + MIL aggregator”仍沿用这个两阶段范式。

## 3. 核心方法和数据流

### 3.1 总体数据流

```text
WSI
 └─ 无重叠切块
     └─ 分倍率训练 SimCLR encoder
         └─ 每个 patch 得到固定特征 h_i
             ├─ 实例流：每个 patch 打分 → 每类关键实例 h_m
             └─ 聚合流：其余实例与 h_m 比较 → attention → bag 表示
                 └─ 双流损失 / 双流分数 → slide prediction
```

多尺度版本 DSMIL-LC 使用 20× 与 5×：低倍率 patch 特征被复制，并与其覆盖范围内的高倍率子 patch 特征拼接。这样，每个高倍率实例同时携带局部细胞信息和低倍率组织上下文。

### 3.2 第一条流：找到关键实例

特征提取器将 patch 映射为：

$$
\mathbf h_i=f(x_i)\in\mathbb R^L.
$$

实例分类器给出类别分数：

$$
c_i=\mathbf W_0\mathbf h_i,
\qquad
m=\arg\max_i c_i.
$$

$\mathbf h_m$ 是关键实例（critical instance）。多分类时，每个类别分别选择一个关键实例。

直觉上，它先问：“如果整张切片中只能看一个 patch，哪个最支持类别 $c$？”

### 3.3 第二条流：围绕关键实例聚合

每个实例被投影成 query $\mathbf q_i$ 和 information/value $\mathbf v_i$。注意力不是完整的 $N\times N$ 自注意力，只计算每个实例与关键实例的关系：

$$
a_i=
\operatorname{softmax}_i
\left(
\frac{\mathbf q_i^\top\mathbf q_m}{\sqrt{d_q}}
\right),
$$

$$
\mathbf b=\sum_i a_i\mathbf v_i,
\qquad
c_b=\mathbf W_b\mathbf b.
$$

因此其注意力计算量近似为 $O(NC)$，而不是完整 self-attention 的 $O(N^2)$；$C$ 是类别数。这是它能处理几千个 patch bag 的重要原因。

论文将两条流的输出平均：

$$
c(B)=\frac{1}{2}(c_m+c_b).
$$

训练代码同样对实例最大值损失和 bag 损失各赋 0.5 权重：

$$
\mathcal L=0.5\mathcal L_{bag}+0.5\mathcal L_{max}.
$$

### 3.4 代码中的精确对应

| 论文概念 | 代码位置 | 符号 | 作用 |
|---|---|---|---|
| 实例分类器 $\mathbf W_0$ | `dsmil.py` | `FCLayer` / `IClassifier.fc` | 产生 $N\times C$ 的 patch logits |
| query 投影 | `dsmil.py` | `BClassifier.q` | 将特征映射到128维 query |
| information/value | `dsmil.py` | `BClassifier.v` | 默认 `passing_v=False` 时为恒等映射 |
| 每类关键实例 | `dsmil.py` | `m_indices[0, :]`、`m_feats` | 对实例分数排序后取最高者 |
| 相似度注意力 | `dsmil.py` | `A = Q @ q_max.T` | 与关键实例比较并按实例维 softmax |
| bag 表示 | `dsmil.py` | `B = A.T @ V` | 每类形成一个加权特征向量 |
| bag 分类器 $\mathbf W_b$ | `dsmil.py` | `BClassifier.fcc` | 用 `Conv1d` 完成类别对应的线性分类 |
| 双流训练目标 | `train_tcga.py` | `bag_loss`、`max_loss` | 两项 BCEWithLogitsLoss 等权相加 |

**分析判断：**虽然论文称其为 trainable distance measurement，实际实现是学习 query 投影后做缩放点积相似度。它不是显式欧氏距离，也没有学习独立 key 投影。

### 3.5 自监督特征和多尺度

论文使用 SimCLR 学习 patch 表征。补充材料给出的关键配置包括：

- ResNet-18 backbone，输出512维特征；
- projection embedding 为256维；
- contrastive temperature 为0.5；
- SimCLR 训练30 epochs；
- DSMIL aggregator 训练40 epochs；
- query 维度128；
- Adam betas 为 `(0.5, 0.9)`。

仓库当前 README 建议 SimCLR batch size 至少512。这个要求主要作用于 encoder 预训练，不是轻量 MIL 聚合器训练。

## 4. 关键实验、数据集与指标

### 4.1 数据集

#### CAMELYON16

- 官方数据共400张前哨淋巴结 WSI，来自两个医学中心。
- 阳性切片中的转移区域可能只占很小部分，论文描述约低于组织面积的10%。
- 任务：正常/转移二分类，并利用像素级标注额外评价弱定位。
- 定位指标 FROC 是在每张 WSI 的 1/4、1/2、1、2、4、8 个假阳性点下的平均敏感度。

#### TCGA Lung

- 论文收集1054张诊断切片，包含 LUAD 与 LUSC；丢弃4张损坏切片。
- 论文随机划分840张训练切片和210张测试切片。
- 约产生520万张20× patch 和36万张5× patch，平均每个 bag 约5000与350个实例。

**复现风险：**论文报告的是切片随机划分，没有说明用 TCGA barcode 将同一患者的多张切片绑定到同一 split。现代复现应改为患者级分组，并把结果与论文数字分开报告。

### 4.2 论文主结果

#### CAMELYON16

| 方法 | 尺度 | Accuracy | AUC | FROC |
|---|---:|---:|---:|---:|
| Max pooling | 单尺度 | 0.8295 | 0.8641 | 0.3313 |
| ABMIL | 单尺度 | 0.8450 | 0.8653 | 0.4056 |
| DSMIL | 单尺度 | **0.8682** | **0.8944** | **0.4296** |
| DSMIL-LC | 多尺度 | **0.8992** | **0.9165** | **0.4371** |
| Fully supervised | 单尺度 | 0.9147 | 0.9362 | 0.5254 |

**论文事实：**在统一使用 SimCLR 特征时，DSMIL 相比 ABMIL 提高了分类和定位结果；多尺度 DSMIL-LC 进一步提升。它仍低于使用像素标注的 fully supervised 方法，尤其在 FROC 上差距明显。

#### TCGA Lung

| 特征 | 方法 | 尺度 | Accuracy | AUC |
|---|---|---:|---:|---:|
| SimCLR | DSMIL | 单尺度 | 0.9190 | 0.9633 |
| SimCLR | DSMIL-LC | 多尺度 | 0.9286 | 0.9583 |
| Patch-supervised | DSMIL | 单尺度 | 0.9476 | 0.9809 |
| Patch-supervised | DSMIL-LC | 多尺度 | **0.9571** | **0.9815** |

**分析判断：**TCGA 中多尺度使 accuracy 上升，但使用 SimCLR 特征时 AUC 从0.9633降至0.9583；不能笼统地说多尺度在所有指标上都更好。

### 4.3 哪些实验真正支持了哪些结论

1. **聚合器有效性**：论文固定 SimCLR 特征比较 pooling、MIL-RNN、ABMIL 与 DSMIL，能较好隔离 aggregator 的贡献。
2. **对比学习有效性**：固定 DSMIL aggregator 后，CAMELYON16 上 contrastive feature 达到0.8682 accuracy/0.8944 AUC；ImageNet feature 为0.6202/0.5408，max-pooling 端到端特征为0.7099/0.7153。
3. **多尺度有效性**：CAMELYON16 上结构化的20×+5×融合优于单尺度和其他简单融合；但更粗的第三尺度并未继续改善结果。
4. **弱定位能力**：FROC 和热图说明 attention 与肿瘤区域存在统计对应，但不能证明 attention 是因果解释或具备临床可靠性。

### 4.4 不应从实验推出的结论

- 没有跨医院外部测试，不能证明跨中心泛化。
- 没有患者级分组说明，不能把 TCGA 结果直接视为患者级泛化证据。
- 没有校准、亚组、公平性或前瞻性研究，不能据此声称临床部署能力。
- 热图漂亮不等于解释正确；仍需病理实体、扰动和跨模型稳定性验证。

## 5. 官方代码仓库审计

### 5.1 审计结论

| 项目 | 结论 |
|---|---|
| 官方归属 | arXiv 页面直接链接 `binli123/dsmil-wsi` |
| 许可证 | MIT |
| 环境 | 有 `env.yml`，但不锁版本且未包含 PyTorch；README 要求另装 PyTorch、OpenSlide |
| 数据入口 | `download.py` 支持 MIL benchmark、TCGA、CAMELYON16 预提取特征 |
| 权重 | 根目录有 `init.pth`，并有 `example_aggregator_weights/`；测试脚本默认寻找 `test/weights/` 下的 embedder/aggregator |
| 原始 WSI 流水线 | `deepzoom_tiler.py` → `simclr/` → `compute_feats.py` → `train_tcga.py` |
| 维护状态 | README 标注2024年更新：提速、交叉验证、指标和热图脚本修复 |
| 综合复现评级 | **B+**：入口完整，但版本、划分和部分评估实现需要人工审计 |

### 5.2 论文与当前代码的重要差异

#### 差异一：默认推理没有执行论文的双流平均

论文公式使用 $(c_m+c_b)/2$。当前 `train_tcga.py` 的训练损失确实平均两流，但测试时只有 `--average` 为真才平均概率；默认值为 `False`，默认输出仅使用 bag branch。

此外，参数使用 `type=bool`，命令行布尔解析容易产生误解。复现时要打印解析后的配置和实际预测分支，不能只记录命令字符串。

#### 差异二：当前 README 的预期结果不是论文原始协议

当前 README 给出的 CAMELYON16 5-fold CV 预期约为94.9% accuracy、0.961 AUC，并说明随机划分可能带来约2%差异。这来自后续更新的交叉验证脚本，不是论文 Table 1 的固定协议结果0.8992/0.9165。两组数字不能直接比较。

#### 差异三：交叉验证按 bag 文件划分

`train_tcga.py` 对 `temp_train/*.pt` 使用普通 `KFold`。代码没有从 TCGA barcode 提取患者 ID，也没有使用 `GroupKFold`。如果同一患者存在多张切片，就可能跨 fold 泄漏。

#### 差异四：评估和模型选择需要谨慎

- `5-fold-cv` 在每个 fold 的验证部分选择最佳 epoch，并报告该 fold 的最佳分数；它不是嵌套交叉验证。
- ROC 阈值在当前评估数据上优化，accuracy 会对这种阈值选择敏感。
- `5-time-train+valid+test` 分支当前存在参数顺序不一致的调用，直接运行前应先修正并做最小测试。
- standalone-test 分支用多个 fold 模型投票；应确认每个 fold 的阈值只由对应训练/验证数据确定。

这些问题不否定方法本身，但意味着“仓库能运行”与“数字严格可比较”是两回事。

## 6. 环境、显存、存储和数据准备要求

### 6.1 最小聚合器实验

**仓库事实：**CAMELYON16 预提取特征下载约需要30GB可用磁盘。MIL 模型输入通常为每个 bag 的 CSV 特征，训练脚本会再生成临时 `.pt` 文件。

**分析判断：**DSMIL aggregator 参数和中间张量很小。以约5000个实例、512维特征估算，单 bag 原始 FP32 特征约10MB；一张现代消费级或服务器 GPU 足以训练 aggregator。实际建议预留：

- GPU：4–8GB 显存即可从预提取特征起步；
- RAM：16GB 起，32GB 更稳；
- 磁盘：预留50–80GB，以容纳压缩包、CSV、临时 `.pt`、权重和日志。

### 6.2 从原始 WSI 开始

**仓库事实：**README 估计 TCGA 原始 WSI 约1TB，并使用 OpenSlide 切块；SimCLR 建议 batch size 至少512。

**分析判断：**完整路线的主要成本是 WSI I/O、patch 存储和 encoder 训练，而不是 DSMIL。服务器上应将以下阶段分开：

1. WSI 下载与 manifest 固化；
2. 组织区域检测和 patch 坐标；
3. patch/feature 提取；
4. MIL 聚合器训练；
5. 热图与定位评估。

### 6.3 数据准备必须新增的检查

- TCGA 按患者 barcode 分组，而不是按 slide 文件随机分组。
- 记录倍率、MPP、patch size、stride、背景过滤和 stain augmentation。
- 所有 encoder 训练与归一化统计只使用训练患者。
- 若使用现代病理基础模型，核查其预训练数据是否包含目标 TCGA cohort。

## 7. 建议复现路径

### 7.1 最小测试：验证当前仓库闭环

目标：不下载原始 WSI，确认特征下载、bag 读取、DSMIL 前向、训练、评估和权重保存均工作。

```bash
conda env create --name dsmil --file env.yml
conda activate dsmil
# 按本机 CUDA 单独安装兼容的 PyTorch
python download.py --dataset=c16
python train_tcga.py --dataset=Camelyon16 --num_classes=1 --eval_scheme=5-fold-cv
```

验收条件：

- 能读取 `datasets/Camelyon16/Camelyon16.csv` 指向的 bag 特征；
- 每个 fold 能完成前向、反向与 checkpoint 保存；
- 日志记录解析后的参数、数据文件数、每 fold 类别分布、AUC 和 accuracy；
- 结果只与当前 README 的同协议范围比较，不与论文 Table 1 直接混比。

### 7.2 标准实验：建立可信 DSMIL 基线

在当前代码上做一个小而严谨的协议版本：

1. 生成 `slide_id → patient_id → label → split` 清单。
2. 用 `StratifiedGroupKFold` 或预先固定的患者级 folds。
3. 验证集负责选 epoch 和阈值；测试集只评估一次。
4. 固定 SimCLR/公开特征，分别运行 max pooling、ABMIL、DSMIL。
5. DSMIL 同时报 bag-only 与论文式双流平均，检查实现差异。
6. 至少运行5个种子或固定5 folds，报告均值、标准差和每 fold 样本数。
7. 保存 folds、配置、环境、checkpoint、原始预测和指标脚本。

**成功标准：**首先要求流程无泄漏且多次运行稳定；数值接近只是第二层目标。

### 7.3 扩展实验：关键实例稳定性

**研究假设：**若 DSMIL 的关键实例确实捕捉了稳定病理证据，那么更换 encoder、随机种子或轻微改变 patch 采样时，关键区域和高 attention 区域应保持较高的一致性；若分类稳定而定位剧烈漂移，则 attention 不宜被直接解释为病理依据。

实验矩阵：

| 因素 | 取值 |
|---|---|
| Encoder | 原始 SimCLR、CTransPath、PathDino |
| Aggregator | Max、ABMIL、DSMIL |
| 扰动 | seed、patch dropout、染色扰动、坐标轻微偏移 |
| 分类指标 | AUROC、AUPRC、balanced accuracy、校准误差 |
| 定位指标 | FROC、top-k 区域重合、rank correlation |
| 稳定性 | 同一 WSI 跨 seed/encoder 的区域一致性 |

这比再发明一个聚合层更有博士价值，因为它直接检验了 DSMIL 最核心的机制叙事。

## 8. 建议代码阅读顺序

1. `README.md`：先理解当前2024版工作流和预期结果，不把它当论文原始实验协议。
2. `dsmil.py`：只需重点读 `FCLayer`、`BClassifier.forward`、`MILNet.forward`。
3. `train_tcga.py`：追踪 `get_bag_feats` → `generate_pt_files` → `train` → `test` → `main`。
4. `download.py`：核验数据来源、目标目录和解压逻辑。
5. `attention_map.py`：观察 patch 文件名如何解析空间坐标，以及 attention 如何写回二维热图。
6. `testing_c16.py` / `testing_tcga.py`：核验 embedder 和 aggregator 权重如何组合。
7. `deepzoom_tiler.py`：理解倍率、切块与组织过滤。
8. `compute_feats.py`：理解 patch 到 CSV bag 特征的转换。
9. `simclr/config.yaml`、`simclr/run.py`：最后再读 encoder 预训练，不要一开始陷入数据工程。

推荐在代码中画出这条真实运行链：

```text
download.py / raw WSI
  → deepzoom_tiler.py
  → simclr/run.py
  → compute_feats.py
  → train_tcga.py
  → dsmil.BClassifier
  → testing_*.py / attention_map.py
```

## 9. 值得借鉴的思想与可迁移组件

### 研究思想

- 将“找到最有诊断价值的实例”和“整合其他支持证据”拆成两步。
- 用线性复杂度的关键实例注意力替代全局两两 self-attention。
- 在固定表征下比较聚合器，再固定聚合器比较表征，避免贡献混杂。
- 将分类与定位同时评价，迫使模型的内部证据接受额外检验。

### 可迁移代码组件

- `BClassifier` 可作为统一 MIL benchmark 中的轻量聚合器。
- 类别特异的 critical instance 选择适合多标签任务。
- `attention_map.py` 的“patch 坐标 → 二维 score map”思路可迁移，但需要重写硬编码路径和阈值。
- 预提取特征的 CSV bag 格式简单，适合快速接入不同 encoder。

## 10. 局限、复现风险和博士课题切入点

### 论文报告或方法本身的局限

- 关键实例由 argmax 决定，可能对异常 patch 或采样噪声敏感。
- 相似度只围绕一个关键实例，难以表达多灶、多形态亚型或互相冲突的证据。
- 原始 DSMIL 不使用 patch 坐标，空间邻域和组织结构被忽略。
- 两阶段固定特征无法针对最终任务端到端适配 encoder。
- 两个数据集均不足以证明跨中心或跨扫描仪泛化。

### 仓库层面的风险

- 环境没有锁定 Python、PyTorch、CUDA 和各依赖版本。
- 当前默认推理分支与论文双流平均公式不同。
- TCGA 交叉验证没有患者分组。
- 阈值选择与模型选择可能使 accuracy 偏乐观。
- README 的新结果、论文结果和示例权重所对应协议并不完全统一。

### 可形成博士课题的切入点

1. **从单关键实例到关键实例集合**：研究多原型、多灶和不确定关键实例，同时保持线性复杂度。
2. **空间约束 DSMIL**：把组织邻域或细胞图作为相似度先验，验证是否改善跨中心定位稳定性。
3. **机制稳定性 benchmark**：固定患者划分，系统研究 encoder、染色和采样如何改变 attention 与 critical instance。
4. **抗预训练污染评估**：当 encoder 预训练包含 TCGA 时，建立严格的 cohort overlap 声明和外部测试。
5. **可校准的弱定位**：把 attention 与病灶概率分开建模，加入不确定性、校准和病理专家评价。

## 11. 与前后论文的关联

- **前置概念**：[NIC](01-neural-image-compression.md) 解释为什么 WSI 必须先表示化；DSMIL 将这种表示改造成无序 patch bag。
- **直接后继**：[DTFD-MIL](05-dtfd-mil.md) 通过伪包和双层聚合减轻大 bag 与弱标签问题。
- **长序列方向**：[MambaMIL](14-mambamil.md) 显式处理实例序列和重排。
- **表征替换**：[CTransPath](07-ctranspath.md)、[PathDino](13-pathdino.md) 可以替换 DSMIL 的原始 SimCLR encoder。
- **层级/原型方向**：[HIPT](04-hipt.md)、[PANTHER](09-panther.md) 分别从层级结构和形态原型重新定义 slide representation。

下一篇建议精读 **DTFD-MIL**，并保持同一份 CAMELYON16 特征与患者划分，只替换 aggregator。

## 12. 官方链接与待核验项

### 官方链接

- [CVF 正式论文页](https://openaccess.thecvf.com/content/CVPR2021/html/Li_Dual-Stream_Multiple_Instance_Learning_Network_for_Whole_Slide_Image_Classification_CVPR_2021_paper.html)
- [论文 PDF](https://openaccess.thecvf.com/content/CVPR2021/papers/Li_Dual-Stream_Multiple_Instance_Learning_Network_for_Whole_Slide_Image_Classification_CVPR_2021_paper.pdf)
- [补充材料](https://openaccess.thecvf.com/content/CVPR2021/supplemental/Li_Dual-Stream_Multiple_Instance_CVPR_2021_supplemental.pdf)
- [arXiv 页面](https://arxiv.org/abs/2011.08939)
- [作者官方代码](https://github.com/binli123/dsmil-wsi)
- [核心模型源码](https://github.com/binli123/dsmil-wsi/blob/master/dsmil.py)
- [当前训练源码](https://github.com/binli123/dsmil-wsi/blob/master/train_tcga.py)
- [CAMELYON16 官方数据页](https://camelyon16.grand-challenge.org/Data/)
- [TCGA/GDC 数据门户](https://portal.gdc.cancer.gov/)

### 待核验

- `init.pth` 和 `example_aggregator_weights/` 分别对应的精确数据 split、commit 与论文表格。
- 论文 TCGA 划分中是否存在同患者多切片跨 split；正文没有提供患者级清单。
- 当前下载链接在目标服务器所在地是否稳定，以及各下载包的许可/再分发条款。
- 哪个历史 commit 与 CVPR 论文最终实验代码完全一致。

## 本篇学习后的下一步

先完成一个动作：**下载 CAMELYON16 预提取特征，画出一个 bag 的实例数量分布，并逐行跟踪一次 `dsmil.BClassifier.forward` 的张量形状。**做到这一点后，再开始跑交叉验证；否则很容易得到一个数字，却没有真正理解 DSMIL。
