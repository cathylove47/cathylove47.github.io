'use strict';
// 本页所有交互都是解释性示意，或由论文原表数值重算，不是本站实验。
const REPO = 'https://github.com/samiyavuuz/MIST/blob/main/';

/* ---------- 前向流程四步 ---------- */
const steps = [
  ['逐条基因组特征变成一个 token', '每条基因组特征独立过一个自归一化网络（线性 + SELU + AlphaDropout），得到 128 维 token。特征之间用独立权重，所以特征空间可以逐癌种不同：COAD 643、GBM 36、KIRC 920、LUSC 197。自然缺失的特征保留 NaN，靠二值掩码排除在自注意力之外。', 'main.py', 'main.py（SNN 与参数默认值）'],
  ['切片压成 4 个上下文 token + 1 个摘要 token', 'TITAN 对每张切片给出 768 维表示，同一患者多张切片先取平均；一个线性层同时投影出 4 个组织学上下文 token 与 1 个切片摘要 token。N_ctx = 4 是刻意的窄瓶颈：小字典 + 与骨干的 4 个注意力头对齐，融合参数量很小。', 'main.py#L173-L176', 'main.py L173–176（wsi_cross_attn / n_context）'],
  ['基因当 query，去查切片上下文', 'E^hist = MultiHeadAttn(E, C, C)：基因组 token 作 query，4 个上下文 token 作 key/value。注意力矩阵是 d×4，也就是每条基因特征各自有一组权重，拿到属于自己的组织学补充。交互发生在编码之前——这是与晚期融合、双线性融合、对称共注意力最本质的差别。方向是单向的：切片不反过来读基因，也没有 patch 级定位。', 'main.py#L173', 'main.py L173（--wsi_cross_attn）'],
  ['拼序列，预测离散时间生存', '序列是 [CLS, w, E^hist]，进入两层、四头的 Transformer。取 [CLS] 输出过 SELU + dropout 的线性投影（128→256），生存头给出 K=4 个区间 logit；sigmoid 得 hazard，连乘得生存曲线，C-index 用 r = −Σ S_j。没有切片时交叉注意力整段跳过，切片摘要 token 被遮蔽。', 'main.py', 'main.py'],
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  const link = document.getElementById('step-source');
  link.href = REPO + step[2];
  link.textContent = '官方代码：' + step[3] + ' ↗';
}));
document.querySelector('[data-step="0"]').click();

/* ---------- Table 2：C-index / tAUC 条形图（原表数值） ---------- */
const METHODS = ['Concat', 'Bilinear', 'Co-Attn', 'Concat-M', 'Bilinear-M', 'Co-Attn-M', 'Genomics-only', 'WSI-only', 'MIST'];
const TABLE2 = {
  'COAD-CPTAC': [[0.581, 0.653], [0.538, 0.608], [0.541, 0.616], [0.558, 0.617], [0.479, 0.536], [0.612, 0.711], [0.510, 0.490], [0.546, 0.685], [0.669, 0.779]],
  'GBM-German': [[0.473, 0.451], [0.483, 0.470], [0.483, 0.485], [0.473, 0.455], [0.568, 0.589], [0.492, 0.508], [0.502, 0.503], [0.445, 0.417], [0.584, 0.607]],
  'KIRC-CPTAC': [[0.565, 0.559], [0.577, 0.578], [0.562, 0.568], [0.575, 0.559], [0.602, 0.598], [0.571, 0.564], [0.500, 0.500], [0.627, 0.630], [0.646, 0.651]],
  'LUSC-US': [[0.529, 0.517], [0.510, 0.513], [0.524, 0.518], [0.522, 0.535], [0.533, 0.558], [0.497, 0.477], [0.489, 0.478], [0.545, 0.549], [0.571, 0.606]],
};
const METRIC = {
  cindex: { index: 0, min: 0.42, max: 0.72, dec: 3, axis: 'C-index ↑ · 条形以 0.42 为起点，最大刻度 0.72；数值为五折均值（原表另附标准差）' },
  tauc: { index: 1, min: 0.40, max: 0.80, dec: 3, axis: 'tAUC ↑ · 条形以 0.40 为起点，最大刻度 0.80；数值为五折均值' },
};
let chartCohort = 'COAD-CPTAC', chartMetric = 'cindex';
function drawBars() {
  const rows = TABLE2[chartCohort], metric = METRIC[chartMetric];
  const holder = document.getElementById('metric-bars');
  holder.replaceChildren();
  let bestBaseline = 0;
  for (let i = 1; i < 8; i += 1) if (rows[i][metric.index] > rows[bestBaseline][metric.index]) bestBaseline = i;
  rows.forEach((pair, i) => {
    const value = pair[metric.index];
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.textContent = METHODS[i] + (i === bestBaseline ? ' ← 列内最优基线' : '');
    const track = document.createElement('div');
    track.className = 'bar-track';
    track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div');
    bar.className = 'bar-fill' + (i === METHODS.length - 1 ? ' best' : '');
    bar.style.width = Math.max(0, Math.min(100, (value - metric.min) / (metric.max - metric.min) * 100)) + '%';
    track.append(bar);
    const out = document.createElement('span');
    out.className = 'bar-value';
    out.textContent = value.toFixed(metric.dec);
    row.append(label, track, out);
    holder.append(row);
  });
  document.getElementById('chart-axis').textContent = metric.axis + ' · 队列 ' + chartCohort;
}
document.querySelectorAll('[data-cohorts] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-cohorts] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  chartCohort = b.dataset.cohort;
  drawBars();
}));
document.querySelectorAll('[data-metrics] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-metrics] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  chartMetric = b.dataset.metric;
  drawBars();
}));
drawBars();

/* ---------- 交互 1：VRM 的 exact-k 采样（按论文 §2.1 现场采样） ---------- */
function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
let vrmD = 643, vrmFrac = 0.5, vrmSeed = 20261013;
function sampleMask(rng, d, max) {
  const order = new Int32Array(d);
  for (let i = 0; i < d; i += 1) order[i] = i;
  for (let i = 0; i < max; i += 1) {
    const j = i + Math.floor(rng() * (d - i));
    const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
  }
  return order.slice(0, max);
}
function paintVrm() {
  const max = Math.floor(vrmFrac * vrmD);
  const rng = mulberry32(vrmSeed);
  const k = Math.floor(rng() * (max + 1));
  const masked = new Set(sampleMask(rng, vrmD, k));
  document.getElementById('vrm-k').textContent = String(k);
  document.getElementById('vrm-max').textContent = String(max);
  document.getElementById('vrm-percent').textContent = (vrmD ? k / vrmD * 100 : 0).toFixed(1) + '%';
  document.getElementById('vrm-expected').textContent = (max / 2).toFixed(max % 2 === 0 ? 0 : 1);
  const canvas = document.getElementById('vrm-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width, H = canvas.height, pad = 14;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fafbf7';
  ctx.fillRect(0, 0, W, H);
  const usableW = W - 2 * pad, usableH = H - 2 * pad - 24;
  let cell = Math.min(16, Math.sqrt(usableW * usableH / vrmD));
  let cols = 1, rows = 1;
  for (let guard = 0; guard < 60; guard += 1) {
    cols = Math.max(1, Math.floor(usableW / cell));
    rows = Math.ceil(vrmD / cols);
    if (pad + rows * cell <= pad + usableH) break;
    cell *= 0.96;
  }
  for (let i = 0; i < vrmD; i += 1) {
    const cx = pad + (i % cols) * cell;
    const cy = pad + Math.floor(i / cols) * cell;
    ctx.fillStyle = masked.has(i) ? '#c46a44' : '#9fb8ae';
    ctx.fillRect(cx, cy, Math.max(1, cell - 1.2), Math.max(1, cell - 1.2));
  }
  ctx.font = '12px "Microsoft YaHei",sans-serif';
  ctx.fillStyle = '#c46a44';
  ctx.fillText('■ 这一轮被 VRM 遮掉（k = ' + k + '）', pad, H - 6);
  ctx.fillStyle = '#5d7d72';
  ctx.fillText('■ 未被 VRM 遮住（' + (vrmD - k) + '）', pad + 200, H - 6);
  ctx.fillStyle = '#8a9a95';
  ctx.fillText('自然缺失（NaN 掩码）不在本演示中模拟', pad + 375, H - 6);
  const lesson = document.getElementById('vrm-lesson');
  if (max === 0) lesson.textContent = 'f = ' + vrmFrac.toFixed(2) + ' 时上限 ⌊f·d⌋ = 0，k 只能是 0：等价于关闭 VRM（官方消融用「不加 --apply_miss」实现同一件事的另一面）。';
  else lesson.textContent = 'f = ' + vrmFrac.toFixed(2) + '、d = ' + vrmD + ' ⇒ 上限 ⌊f·d⌋ = ' + max + '，本轮抽到 k = ' + k + '（占 ' + (k / vrmD * 100).toFixed(1) + '%）。k 在 0…' + max + ' 上均匀取，所以平均遮掉约 ' + (max / 2).toFixed(max % 2 === 0 ? 0 : 1) + ' 个位点。点「重新采样」可以看同一个 f 下 k 的波动范围。';
}
document.querySelectorAll('[data-vrm-d] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-vrm-d] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  vrmD = Number(b.dataset.d);
  paintVrm();
}));
document.getElementById('vrm-frac').addEventListener('input', event => { vrmFrac = Number(event.target.value); paintVrm(); });
document.getElementById('vrm-reseed').addEventListener('click', () => { vrmSeed = (vrmSeed * 1103515245 + 12345) >>> 0; paintVrm(); });
paintVrm();

/* ---------- 交互 2：Table 4 消融相对降幅重算 ---------- */
const TABLE4 = {
  'KIRC-CPTAC': { full: 0.646, no_hist: 0.546, no_infonce: 0.578, no_vrm: 0.642, no_wsi_dropout: 0.610 },
  'LUSC-US': { full: 0.571, no_hist: 0.530, no_infonce: 0.494, no_vrm: 0.577, no_wsi_dropout: 0.569 },
};
const VARIANT_NAME = { no_hist: '去掉组织学注意力', no_infonce: '去掉 InfoNCE', no_vrm: '去掉 VRM', no_wsi_dropout: '去掉 WSI dropout' };
const PAPER_PCT = { 'KIRC-CPTAC': { no_hist: 15.3, no_infonce: 10.5 }, 'LUSC-US': { no_hist: 7.2, no_infonce: 13.5 } };
const PAPER_TEXT = {
  'KIRC-CPTAC': { no_vrm: '论文：对 KIRC-CPTAC「影响很小」', no_wsi_dropout: '论文：适度提升 KIRC-CPTAC 的稳健性' },
  'LUSC-US': { no_vrm: '论文：去掉 VRM 后反而略高于完整 MIST', no_wsi_dropout: '论文：对 LUSC-US「几乎没有影响」' },
};
let ablCohort = 'KIRC-CPTAC', ablVariant = 'no_hist';
function updateAblation() {
  const row = TABLE4[ablCohort];
  const full = row.full, variant = row[ablVariant];
  const delta = full - variant;
  const pct = full > 0 ? delta / full * 100 : 0;
  document.getElementById('abl-full').textContent = full.toFixed(3);
  document.getElementById('abl-variant').textContent = variant.toFixed(3);
  document.getElementById('abl-delta').textContent = (delta >= 0 ? '−' : '+') + Math.abs(delta).toFixed(3);
  document.getElementById('abl-recomputed').textContent = pct >= 0 ? pct.toFixed(1) + '%' : '上升 ' + Math.abs(pct).toFixed(1) + '%';
  const stated = PAPER_PCT[ablCohort] ? PAPER_PCT[ablCohort][ablVariant] : undefined;
  document.getElementById('abl-paper').textContent = stated === undefined ? (PAPER_TEXT[ablCohort][ablVariant] || '—') : ('相对下降 ' + stated.toFixed(1) + '%');
  const lesson = document.getElementById('abl-lesson');
  if (stated === undefined) {
    lesson.textContent = ablCohort + ' · ' + VARIANT_NAME[ablVariant] + '：论文没有给百分比，只说方向。按表内数值重算，该变体是 ' + variant.toFixed(3) + '（完整 ' + full.toFixed(3) + '），相对变化 ' + (delta >= 0 ? '下降 ' : '上升 ') + Math.abs(pct).toFixed(1) + '%。';
  } else {
    const gap = Math.abs(pct - stated);
    lesson.textContent = ablCohort + ' · ' + VARIANT_NAME[ablVariant] + '：论文正文写 ' + stated.toFixed(1) + '%，按表内四位小数重算为 ' + pct.toFixed(1) + '%。' + (gap < 0.05 ? '两者一致。' : '相差 ' + gap.toFixed(1) + ' 个百分点，最可能来自论文使用未舍入的原始值——这是本站对原表的算术核对，不是对结论的挑战。');
  }
}
document.querySelectorAll('[data-abl-cohorts] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-abl-cohorts] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  ablCohort = b.dataset.ablCohort;
  updateAblation();
}));
document.querySelectorAll('[data-abl-variants] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-abl-variants] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  ablVariant = b.dataset.ablVariant;
  updateAblation();
}));
updateAblation();

/* ---------- 官方仓库的真实命令 ---------- */
const excerpts = {
  env: ['conda env create -f env.yml\nconda activate mist',
    'README 的 Installation 只有这两行（环境定义在 env.yml）。仓库不含任何患者级数据与 checkpoint：基因组/临床 CSV 要按 README 从 LinkedOmics 与 CPTAC Data Portal 重建，五折划分放在 splits/<cancer_type>/<which_splits>/，切片嵌入要自己用 TITAN 提取到 --mist_data_dir。', 'README.md'],
  single: ['python main.py \\\n  --mode omic --split_mode train_val_test --k 5 \\\n  --cancer_type kidney --task updated_kirc_mist_survival --which_splits 5foldcv4KIRC_CPTAC_b_mist \\\n  --model_type max_net_attn \\\n  --bag_loss nll_surv --n_classes 4 --alpha_surv 0.6 \\\n  --reg_type all --lambda_reg 1e-4 --enc_layers 2 --n_heads 4 --embd_dim 128 \\\n  --apply_miss --mask_strategy exact_k --exact_k_max_frac 0.5 \\\n  --use_wsi --wsi_cross_attn --wsi_n_context 4 --wsi_dropout_p 0.3 \\\n  --mist_data_dir dataset_pathology/TCGA/KIRC \\\n  --results_dir results_compayl --early_stopping --overwrite\n\npython eval.py \\\n  --split_mode train_val_test --which_splits 5foldcv4KIRC_CPTAC_b_mist \\\n  --model_path "$model_path" --results_dir eval_compayl \\\n  --enc_layers 2 --n_heads 4 --embd_dim 128 --alpha_surv 0.6 \\\n  --use_wsi --wsi_cross_attn --wsi_n_context 4 \\\n  --mist_data_dir dataset_pathology/TCGA/KIRC:dataset_pathology/CPTAC/CCRCC --overwrite',
    '这是 example_single_run.sh 的内容（KIRC 的 TCGA→CPTAC）。注意 --wsi_dropout_p 0.3 是脚本显式传入的：main.py 里该参数默认是 0.5，漏传就与论文不一致。--mist_data_dir 用冒号分隔多个队列目录（训练队列在前、外部队列在后）。中间那行 find 用来定位训练产出的模型目录，命令在脚本里已在 python eval.py 之前执行。', 'example_single_run.sh'],
  main: ['CUDA_VISIBLE_DEVICES=0 bash mist_main.sh 2>&1 | tee logs/mist_main.log\nCUDA_VISIBLE_DEVICES=0 bash mist_baselines.sh 2>&1 | tee logs/mist_baselines.log',
    '两个驱动脚本都是自包含的（除了 CUDA_VISIBLE_DEVICES 不接受其它命令行参数），种子固定为 0，只在 COAD→CPTAC 与 KIRC→CPTAC 两个公开队列上跑。第一个写 MIST 主结果（论文 Table 2），保存到 results_compayl/ 与 eval_compayl/；第二个跑 Concat / Bilinear / Co-Attn 与三个 mask-aware 变体以及两个单模态对照，写到 results_compayl_baselines/ 等目录。', 'mist_main.sh'],
  abl: ['CUDA_VISIBLE_DEVICES=0 bash mist_ablations.sh 2>&1 | tee logs/mist_ablations.log\n\n# 只跑一个变体：\nVARIANTS="no_hist_attn" CUDA_VISIBLE_DEVICES=0 bash mist_ablations.sh',
    '脚本内的默认变体顺序是 full_mist / no_infonce / no_wsi_dropout / no_vrm / no_hist_attn；实现差异见本页第 06 章的提示框。它只跑 KIRC-CPTAC（论文 Table 4 的另一列 LUSC-US 没有随代码发布）。脚本把解释器写死为 $HOME/miniconda3/envs/mist/bin/python。', 'mist_ablations.sh'],
  surv: ['python analyze_mist_survival.py --eval-dir eval_compayl --seed s0 --out-dir analysis_mist',
    '把五折的逐折预测聚合成每患者风险分数，再报告患者级 C-index（bootstrap 95% CI）与中位数切分的 KM / log-rank 检验——对应论文 Table 3 与 Figure 2。输出写到 <out-dir>/tables/（逐患者风险 CSV 与 mist_survival_stats.csv/.tex）与 <out-dir>/km_plots/（每个队列一张 KM 曲线 PDF）。', 'analyze_mist_survival.py'],
};
function displayCode(key) {
  const v = excerpts[key];
  document.getElementById('code-snippet').textContent = v[0];
  document.getElementById('code-explanation').textContent = v[1];
  const link = document.getElementById('code-link');
  link.href = REPO + v[2];
  link.textContent = '官方文件：' + v[2] + ' ↗';
}
document.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-code]').forEach(button => button.setAttribute('aria-pressed', String(button === b)));
  displayCode(b.dataset.code);
}));
displayCode('env');

/* ---------- 阅读笔记、进度条与目录高亮 ---------- */
const noteKey = 'paper-mist-arxiv260921811-reading-note';
const noteInput = document.getElementById('reading-note'), savedNote = document.getElementById('saved-note');
try { noteInput.value = localStorage.getItem(noteKey) || ''; } catch (error) { /* 隐私模式下忽略 */ }
document.getElementById('note-form').addEventListener('submit', event => {
  event.preventDefault();
  try { localStorage.setItem(noteKey, noteInput.value); savedNote.textContent = noteInput.value ? '已保存到当前浏览器。\n' + noteInput.value : '空笔记已保存。'; }
  catch (error) { savedNote.textContent = '浏览器未允许本地保存，请复制下面的笔记：\n' + noteInput.value; }
});
function updateProgress() { const max = document.documentElement.scrollHeight - innerHeight; document.getElementById('reading-progress').style.width = (max > 0 ? scrollY / max * 100 : 100) + '%'; }
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();
const links = [...document.querySelectorAll('.paper-sidebar nav a')];
const observer = new IntersectionObserver(entries => { for (const entry of entries) { if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)); } }, { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
