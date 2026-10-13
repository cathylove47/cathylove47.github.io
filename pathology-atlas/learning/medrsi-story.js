'use strict';
// 本页所有交互都是解释性示意，或由论文原表数值重算，不是本站实验。
const REPO = 'https://github.com/ImprintLab/MedRSI/blob/d453b7047275a62b3dc92020f1c959b384982f61/';

/* ---------- 五阶段回路 ---------- */
const steps = [
  ['诊断经验批', '常驻 Agent H_r = (M, P, T^S_r) 处理本轮的临床经验批（论文的公开任务每轮抽 120 例青光眼 + 60 例心脏病）。每例产出预测与一条执行记录 τ_i：包含工具版本与调用、返回的测量值、可观察证据摘要与最终预测。参考标签在诊断提交之后才揭晓，确保每次诊断在参考可见之前就已经定稿；M 与 P 全程冻结，只有工具箱 T^S_r 会变。', '#why', '论文 §2.1 与 Eq.1–2'],
  ['排序失败', '评分者先判断是否判错（e_i = 1(ŷ_i ≠ y_i)），再按预设 rubric 给潜在临床后果一个 0–4 的序数分（可忽略／轻微／中等／严重／危重），归一化成 c_i = s_i/4，合成优先级 q_i = e_i(1 + λc_i)，默认 λ = 2。评分者的提示、模型版本、rubric 与输出 schema 全程冻结，并由临床医生在标定集上独立打分、裁定分歧。', '#mechanisms', '论文 §2.2 与 Eq.6–9'],
  ['聚类与能力规格', '高优先级的失败按临床任务、可用模态、失败的中途操作与工具使用模式聚类；簇内按 q_i 排序，先取每个簇的最高优先级代表，再回到排名更低的病例——既不放过高后果失败，也不让某一种反复出现的失败吃光全部预算。每个簇被转成一份结构化规格：系统缺失或不可靠的临床观察/操作、支撑这一判断的证据、候选能力应提供的功能、所需输入、应在哪个终点评估受益，以及可用监督、可组合的稳定工具与剩余预算下的可行路线。', '#loop', '论文 §2.1 反思阶段'],
  ['三条路线造候选', '代码生成负责确定性操作（图像准备、定量测量、计算、结构化证据处理）并写清输入类型、维度、单位、缺失值与返回证据；工具组合把已有能力拼成更高层的临床流程（例如杯盘分割 + 直径测量 → 垂直杯盘比 vCDR）；模型开发在许可的训练清单上选通用架构、定义预处理与增强、训练并在内部开发分区选 checkpoint。当缺的是训练资源时，它能构造多阶段能力：先生成模型、验证解剖一致性，再用合成数据训练下游预测器，三者作为版本化依赖链保留。每个候选最终打包成可检查制品并通过功能检查。', '#code', '论文 §2.1 能力开发与打包'],
  ['多队列试验与注册', '候选只要在发现队列上有一点好处（ΔP_disc > 0）就进入实验池并冻结整个包（代码、权重、预处理、调用说明、依赖版本）与当时的注册表快照。随后在 K 个后续队列上与发现时的常驻快照做配对评估；只有平均 ΔP > δ（分类 0.5 个百分点）且平均 ΔC ≤ 0 才移入常驻注册表，并带上调用说明、依赖、开发记录与完整试验历史。被拒候选归档但不进入常驻诊断轨迹。注册是串行提交的：注册前比对注册表哈希，变过就在新上下文里重评。', '#mechanisms', '论文 §2.3 与 Eq.13–16'],
];
const stepButtons = [...document.querySelectorAll('[data-step]')];
stepButtons.forEach(button => button.addEventListener('click', () => {
  stepButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  const link = document.getElementById('step-source');
  link.href = step[2];
  link.textContent = '对应位置：' + step[3] + ' ↗';
}));
stepButtons[0].click();

/* ---------- 真实数字条形图（Table 1–3 / 6 与 Fig.3、Fig.6） ---------- */
const charts = {
  glaucoma: {
    axis: '青光眼（REFUGE2）平衡准确率 % · 5 条轨迹的均值；最后一行为 MedAgent-Pro 原文报告值 90.4（论文自跑重跑为 89.6）',
    min: 0, max: 100, dec: 1, best: [3],
    rows: [['第 0 轮（= 通用 Agent）', 56.2], ['第 5 轮', 80.9], ['第 10 轮', 91.2], ['第 20 轮', 94.1], ['MedAgent-Pro（原文报告）', 90.4]],
    explain: '青光眼在第 4–5 轮注册视杯/视盘分割与垂直杯盘比之后斜率最陡：这两件工具在三队列上的平均增益是 +7.6 与 +6.1 个点，整条轨迹里最大的一对。最终 F1 83.2、AUC 97.2，敏感度从 28.4% 升到 92.0%。',
  },
  heart: {
    axis: '心脏病（MITEA）平衡准确率 % · 5 条轨迹的均值；最后一行为 MedAgent-Pro 原文报告值 77.8（自跑重跑 77.1）',
    min: 0, max: 100, dec: 1, best: [3],
    rows: [['第 0 轮（= 通用 Agent）', 56.5], ['第 5 轮', 64.1], ['第 10 轮', 78.2], ['第 20 轮', 82.3], ['MedAgent-Pro（原文报告）', 77.8]],
    explain: '心脏病这条更慢：左心室分割在第 5 轮、容积与射血分数在第 7 轮、壁厚与质量指数在第 9 轮、疾病分类器要到第 14 轮才注册。最终 F1 77.3、AUC 88.6，敏感度 22.8% → 78.4%，特异度略降到 86.2%。',
  },
  coverage: {
    axis: '专家能力类别覆盖度 % · 类别清单在任何轨迹被审阅之前写好（图像准备、分割、量化、定性阅读、风险整合）',
    min: 0, max: 100, dec: 0, best: [5],
    rows: [['第 0 轮', 0], ['第 2 轮', 20], ['第 4 轮', 40], ['第 7 轮', 60], ['第 10 轮', 80], ['第 14 轮', 100]],
    explain: '覆盖度是「至少有 1 个已注册工具在留出病例上执行了该专家功能」的类别比例。第 20 轮时每个专家类别被 2–5 个被发现的工具覆盖——在完全看不到 MedAgent-Pro 工具箱的条件下。',
  },
  ablation: {
    axis: '青光眼轨迹第 20 轮平衡准确率 %（Table 6）；同一初始 Agent、患者划分、候选预算与随机种子',
    min: 0, max: 100, dec: 1, best: [0],
    rows: [['完整 MedRSI', 94.1], ['单试验队列 K=1', 90.6], ['去掉失败聚类', 90.2], ['去掉工具组合', 89.1], ['均匀失败优先级 λ=0', 88.7], ['去掉模型开发', 84.3], ['立即注册', 82.4], ['仅代码生成', 79.8], ['通用 RSI（均匀 + 立即注册）', 77.4]],
    explain: '三条发明路线互补：从「仅代码生成」到完整 Agent 的 14.3 个点里，模型开发占 9.8 个点。对应的临床代价同样单调：完整框架每 100 例 2.5，均匀优先级 6.0，立即注册 7.6，通用 RSI 9.2（严重/危重错误 1.5% vs 4.0% vs 5.1% vs 6.4%）。',
  },
  horizon: {
    axis: '第 30 轮平衡准确率 %（长时程消融）；括号内为第 30 轮常驻工具数',
    min: 0, max: 100, dec: 1, best: [0],
    rows: [['完整 MedRSI（18 个工具）', 94.4], ['K=5（12 个工具）', 94.3], ['K=1（39 个工具）', 84.7], ['立即注册（57 个工具）', 76.9], ['通用 RSI（60 个工具）', 72.7]],
    explain: '工具更多不等于更强：立即注册在第 8 轮还以 89.6% 领先（工具 22 个），随后降到第 20 轮 82.4%、第 30 轮 76.9%；完整框架在 30 轮内只注册 18 个工具、维持 94.4%，第 12 轮之后没有超过 0.3 个点的逐轮下降。',
  },
  tools: {
    axis: '单件工具在三个试验队列上的平均增益（平衡准确率百分点，Table 3）· 只列出增益 ≥ 2 的 8 件',
    min: 0, max: 8, dec: 1, best: [0],
    rows: [['视杯与视盘分割', 7.6], ['垂直杯盘比', 6.1], ['左心室分割', 5.8], ['左心室容积与射血分数', 4.9], ['心脏病分类器', 3.1], ['青光眼风险预测器', 2.8], ['壁厚与质量指数', 2.6], ['视盘定位', 2.4]],
    explain: '注册依据就是这一列（平均试验增益 > δ = 0.5）。同时论文给出分布：公开任务五条轨迹共 205 个候选进入实验池，注册工具的平均试验增益中位数 2.2 个点，被丢弃的是 −0.9 个点，0–1.5 点之间存在重叠区，由注册阈值来切。',
  },
};
function drawBars(key) {
  const set = charts[key];
  const holder = document.getElementById('metric-bars');
  holder.replaceChildren();
  set.rows.forEach(([name, value], i) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.textContent = name;
    const track = document.createElement('div');
    track.className = 'bar-track';
    track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div');
    bar.className = 'bar-fill' + (set.best.includes(i) ? ' best' : '');
    bar.style.width = Math.max(0, Math.min(100, (value - set.min) / (set.max - set.min) * 100)) + '%';
    track.append(bar);
    const val = document.createElement('span');
    val.className = 'bar-value';
    val.textContent = value.toFixed(set.dec);
    row.append(label, track, val);
    holder.append(row);
  });
  document.getElementById('chart-axis').textContent = set.axis;
  document.getElementById('chart-explain').textContent = set.explain;
  document.getElementById('chart-note').textContent = '共 ' + set.rows.length + ' 行，全部来自论文原表；条形只做线性长度映射，没有做任何拟合。';
}
const metricButtons = [...document.querySelectorAll('[data-metric]')];
metricButtons.forEach(b => b.addEventListener('click', () => {
  metricButtons.forEach(button => button.setAttribute('aria-pressed', String(button === b)));
  drawBars(b.dataset.metric);
}));
drawBars('glaucoma');

/* ---------- 交互 1：失败优先级（按 Eq.9 现算，λ 锚点来自论文 Fig.6a） ---------- */
const GRADE_NAME = ['可忽略', '轻微', '中等', '严重', '危重'];
const LAM_ANCHOR = { 0: '88.7%', 2: '94.1%', 8: '92.4%' };
let grade = 3;
function updatePriority() {
  const lam = Number(document.getElementById('lam-range').value);
  const c = grade / 4;
  const q = 1 + lam * c;
  document.getElementById('lam-value').textContent = String(lam);
  document.getElementById('grade-c').textContent = c.toFixed(2);
  document.getElementById('grade-q').textContent = q.toFixed(2);
  document.getElementById('lam-anchor-bacc').textContent = LAM_ANCHOR[lam] || '论文未测';
  const parts = ['后果档位 ' + grade + '（' + GRADE_NAME[grade] + '）→ c = ' + (grade / 4).toFixed(2) + '，λ = ' + lam + ' 时 q = 1 × (1 + ' + lam + ' × ' + c.toFixed(2) + ') = ' + q.toFixed(2) + '。正确预测的 q 为 0，但仍可用于评估候选。'];
  if (lam === 0) parts.push('λ = 0 就是论文的均匀优先级消融：所有错误的 q 都是 1，后果完全不影响改进顺序。');
  if (LAM_ANCHOR[lam]) parts.push('论文在 λ = ' + lam + ' 处报告的第 20 轮青光眼平衡准确率为 ' + LAM_ANCHOR[lam] + '。');
  else parts.push('正文只在 λ = 0、2、8 处给出第 20 轮平衡准确率数值；Fig.6a 另画了 λ = 0.5、1、4 三个点（只标临床代价），本站不做插值。');
  if (grade === 1 && lam === 2) parts.push('这正是论文的第一个示例：早期青光眼被判成「疑似、短期复查」给 c = 0.25、q = 1.5。');
  if (grade === 3 && lam === 2) parts.push('这正是论文的第二个示例：已记录晚期损害却判成正常并出院给 c = 0.75、q = 2.5——两个例子都错，但后者优先级高 67%。');
  if (grade === 0) parts.push('后果为「可忽略」时，无论 λ 多大 q 都等于 1：后果加权不会把「没后果的错」变成紧急事项。');
  document.getElementById('priority-note').textContent = parts.join(' ');
}
const gradeButtons = [...document.querySelectorAll('[data-grade]')];
gradeButtons.forEach(b => b.addEventListener('click', () => {
  gradeButtons.forEach(button => b.setAttribute('aria-pressed', String(button === b)));
  grade = Number(b.dataset.grade);
  updatePriority();
}));
document.getElementById('lam-range').addEventListener('input', updatePriority);
document.getElementById('lam-anchor').addEventListener('click', () => {
  const anchors = [0, 2, 8];
  const lam = Number(document.getElementById('lam-range').value);
  const next = anchors[(anchors.indexOf(lam) + 1) % anchors.length];
  document.getElementById('lam-range').value = String(next);
  updatePriority();
});
updatePriority();

/* ---------- 交互 2：注册判定（按 Eq.16，预设来自论文正文） ---------- */
const REG_PRESETS = {
  ok: [1.2, 0.6, 0.9],
  fade: [3, -1, -2],
  texture: [-2.3, -5.4, -3.1],
};
function updateReg() {
  const gains = ['reg-g1', 'reg-g2', 'reg-g3'].map(id => Number(document.getElementById(id).value) || 0);
  const mean = gains.reduce((sum, v) => sum + v, 0) / gains.length;
  const out = document.getElementById('reg-mean');
  const verdict = document.getElementById('reg-verdict');
  out.textContent = mean.toFixed(2);
  const pass = mean > 0.5;
  verdict.textContent = pass ? '注册（还需代价不升）' : '拒绝';
  verdict.className = pass ? 'good' : 'bad';
  const parts = ['三次配对增益 ' + gains.join(' / ') + ' 个百分点，均值 ' + mean.toFixed(2) + '，阈值 δ = 0.5 → ' + (pass ? '满足性能条件' : '不满足性能条件') + '。'];
  if (mean > 0.5) parts.push('但仍要第二个条件成立才注册：平均临床代价 ΔC ≤ 0（同一个冻结评分者、同一套 rubric 重算）——那个条件不在这个计算器里，需要看队列试验的代价列。');
  parts.push('提示：正文说神经视网膜缘纹理候选在实验池里的「平均试验增益为 −1.2」，而它三个队列的贡献是 −2.3／−5.4／−3.1（均值 −3.6）；论文没有说明这两个数的换算关系，引用时要标注原样。');
  document.getElementById('reg-note').textContent = parts.join(' ');
}
const regPresetButtons = [...document.querySelectorAll('[data-reg-preset]')];
regPresetButtons.forEach(b => b.addEventListener('click', () => {
  const values = REG_PRESETS[b.dataset.regPreset];
  ['reg-g1', 'reg-g2', 'reg-g3'].forEach((id, i) => { document.getElementById(id).value = String(values[i]); });
  updateReg();
}));
['reg-g1', 'reg-g2', 'reg-g3'].forEach(id => document.getElementById(id).addEventListener('input', updateReg));
updateReg();

/* ---------- 交互 3：试验队列数 K（论文 Fig.6b 的三个点） ---------- */
const K_DATA = {
  1: { tools: '39', bacc: '84.7%', wait: '1 个队列（注册最快，但工具最多）', note: 'K = 1 时几乎没有队列检验：39 个工具进入常驻，第 20 轮 90.6%，但第 30 轮掉到 84.7%（丢弃率只有 24%，说明大多数候选被直接采纳）。' },
  3: { tools: '18', bacc: '94.4%', wait: '3 个队列（论文默认）', note: 'K = 3 是论文默认：18 个工具、第 30 轮 94.4%，第 12 轮之后没有超过 0.3 个点的逐轮下降。' },
  5: { tools: '12', bacc: '94.3%', wait: '5 个队列（论文称每候选约多等 2 轮）', note: 'K = 5 继续压缩工具箱到 12 个、第 30 轮 94.3%，与 K = 3 几乎相同，代价是每个候选约晚两轮才可能注册——论文把它读作「速度与稳定性的可解释权衡」。' },
};
const kButtons = [...document.querySelectorAll('[data-k]')];
kButtons.forEach(b => b.addEventListener('click', () => {
  kButtons.forEach(button => b.setAttribute('aria-pressed', String(button === b)));
  const d = K_DATA[Number(b.dataset.k)];
  document.getElementById('k-tools').textContent = d.tools;
  document.getElementById('k-bacc').textContent = d.bacc;
  document.getElementById('k-wait').textContent = d.wait;
  document.getElementById('k-note').textContent = d.note;
}));
kButtons[1].click();

/* ---------- 官方仓库的真实命令 ---------- */
const excerpts = {
  demo: ['medrsi run --task task.json --data cases.jsonl --llm openai:gpt-4o --rounds 20 --workdir runs/glaucoma\nmedrsi status --workdir runs/glaucoma\nmedrsi eval   --workdir runs/glaucoma --split test              # 当前 Agent\nmedrsi eval   --workdir runs/glaucoma --split test --round 5    # 任意历史轮次快照',
    '论文的公开任务协议是 20 轮、每轮最多 6 次候选开发尝试、共享 12 个 A100 80GB 小时的额度；仓库里 `--rounds` 是命令行参数，`max_candidates` 与 `build_timeout` 在 Config 里。运行可续跑：重复执行会从中断处继续。'],
  task: ['{\n  "name": "glaucoma",\n  "description": "Diagnose glaucoma from a colour fundus photograph.",\n  "labels": ["normal", "glaucoma"],\n  "positive_label": "glaucoma",\n  "inputs": {"fundus": "colour fundus photograph"},\n  "consequence": {"glaucoma->normal": 3, "normal->glaucoma": 1},\n  "rubric": "Missed glaucoma that is discharged is serious (3); unnecessary referral is minor (1)."\n}\n\n{"id": "eye_001", "patient_id": "P001", "inputs": {"fundus": "img/eye_001.png", "age": 63}, "label": "glaucoma"}',
    '这就是论文 Eq.6–9 的落地形式：consequence 给的是漏诊青光眼（glaucoma→normal）3 分、不必要转诊（normal→glaucoma）1 分，rubric 一句话说明理由。它必须**在自我改进开始前写好**（官方 README 原话），之后作为冻结的代价信号。回归任务把 labels 设为 null、给 tolerance 与 consequence_bins（例如 [5,10,15,20]），错误就是 |pred − ref| > tolerance，后果分是超出档位数。cases.jsonl 里的 split 字段可选；缺省时按患者自动划分。Agent 永远看不到 label、meta、病例 id 与文件路径。'],
  seed: ['medrsi run --task task.json --data cases.jsonl --llm openai:gpt-4o \\\n  --seed-tools my_tools/segment_optic_cup.py my_tools/segment_optic_disc.py\n\n# 一个工具就是一个 Python 文件（Agent 造的和你写的一样）\nDESCRIPTION = "Vertical cup-to-disc ratio (0-1) from the disc/cup segmentation."\n\ndef run(inputs, ctx):\n    seg = ctx.call_tool("segment_disc_cup")     # 组合：调用另一件常驻工具\n    return {"vcdr": 0.62, "quality": "good"}    # 返回给 Agent 的证据（允许 numpy 数组）\n\ndef train(cases, ctx):                      # 可选：模型开发路线\n    ...                                       # 在带标签病例上拟合，存到 ctx.artifact_dir',
    '用 `--seed-tools` 把已有工具塞进初始注册表，等价于论文里「从带完整专家工具箱的 MedAgent-Pro 出发」那个实验设置。每件工具被冻结在自己的目录里，哈希同时覆盖代码与权重，所以 `vertical_cdr@6e0e7ad5` 这种 id 永远指向唯一一个包；候选在带时间限制的子进程里训练与检查，崩溃或卡死不会停掉主回路。'],
  ablate: ['# 消融一：均匀失败优先级（λ = 0）\nmedrsi run --task task.json --data cases.jsonl --llm openai:gpt-4o \\\n  --rounds 20 --workdir runs/lam0 --set lam=0\n\n# 消融二：立即注册 + 单试验队列\nmedrsi run --task task.json --data cases.jsonl --llm openai:gpt-4o \\\n  --rounds 30 --workdir runs/fast --set immediate_registration=true trial_cohorts=1\n\n# Python 侧同样可设\nfrom medrsi import MedRSI, Config, load_cases\nrsi = MedRSI("task.json", load_cases("cases.jsonl"), llm="openai:gpt-4o",\n             workdir="runs/glaucoma", config=Config(lam=2.0, trial_cohorts=3))\nrsi.run(rounds=20)',
    'Config 的默认值与论文一致：`lam=2.0`、`trial_cohorts=3`、`delta` 缺省时按任务类型取 0.005（平衡准确率）或 0.01（归一化误差）、`immediate_registration=False`、`routes=("code","compose","model")`、`cluster_failures=True`。所以 `--set lam=0` 复现的就是 Table 6 的「均匀失败优先级」这一行；跑的时候盯的不是第 20 轮准确率，而是训练—测试差（论文 9.1 个点 vs 1.6 个点）与临床代价。'],
  inspect: ['runs/glaucoma/\n  library/<tool>-<hash8>/   tool.py, artifacts/ (权重), meta.json (规格、触发它的失败、功能检查)\n  rounds/round_007.json    失败簇、规格、构建尝试、发现/试验结果、注册决定\n  history.jsonl            每轮一行（经验批指标、注册表、若开监控还有测试集）\n  state.json               注册表、带试验历史的实验池、归档、快照\n  diagnoses.jsonl          缓存的执行记录（让配对比较便宜且可续跑）\n\n# 之后可以用同一个 workdir 复原演化后的 Agent（不需要原始数据）\nagent = medrsi.load_agent("runs/glaucoma", llm)',
    '「可检查制品」在这份清单里是字面意思：论文说的规格式打包（代码 + 权重 + 输入输出 schema + 临床调用说明 + 依赖 + 开发记录 + 版本哈希）在这里就是 `library/` 下的一个目录加 `rounds/*.json` 里的决策记录。`diagnoses.jsonl` 缓存执行记录，是「候选试验与后续自我改进并行推进」能便宜跑起来的原因。'],
};
function displayCode(key) {
  const v = excerpts[key];
  document.getElementById('code-snippet').textContent = v[0];
  document.getElementById('code-explanation').textContent = v[1];
  const link = document.getElementById('code-link');
  link.href = REPO + 'README.md';
  link.textContent = '官方 README（固定核查提交 d453b70） ↗';
}
const codeButtons = [...document.querySelectorAll('[data-code]')];
codeButtons.forEach(b => b.addEventListener('click', () => {
  codeButtons.forEach(button => button.setAttribute('aria-pressed', String(button === b)));
  displayCode(b.dataset.code);
}));
displayCode('demo');

/* ---------- 阅读笔记、进度条与目录高亮 ---------- */
const noteKey = 'paper-medrsi-arxiv260924838-reading-note';
const noteInput = document.getElementById('reading-note');
const savedNote = document.getElementById('saved-note');
try { noteInput.value = localStorage.getItem(noteKey) || ''; } catch (error) { /* 隐私模式下忽略 */ }
document.getElementById('note-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    localStorage.setItem(noteKey, noteInput.value);
    savedNote.textContent = noteInput.value ? '已保存到当前浏览器。\n' + noteInput.value : '空笔记已保存。';
  } catch (error) {
    savedNote.textContent = '浏览器未允许本地保存，请复制下面的笔记：\n' + noteInput.value;
  }
});
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.getElementById('reading-progress').style.width = (max > 0 ? scrollY / max * 100 : 100) + '%';
}
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();
const links = [...document.querySelectorAll('.paper-sidebar nav a')];
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
  }
}, { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
