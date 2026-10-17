'use strict';
// 本页所有交互都是解释性示意，或由论文原表数值重算，不是本站实验。
const REPO = 'https://github.com/icon-lab/FLEX-MRI/blob/95f1771988d5c6ed9da0165a4f50cca8d4e010b4/';

/* ---------- 一次有限过渡的四步 ---------- */
const steps = [
  ['扰动当前估计', '对当前重建 x̂ 的 k 空间系数做伯努利欠采样：每个位置以概率 γ 被剔除，得到 x̃。扰动覆盖整个 k 空间，包括已经采集到的那些系数——它们随后会被数据一致性恢复。论文全轨迹固定使用 γ = 0.1。', 'utils/finite_transition.py', 'utils/finite_transition.py', '论文 Eq.16–17'],
  ['预测整段变化', '扰动后的状态交给同一个有限过渡预测器：x̂_pred = x̃ + μ_θ(x̃, t_{j-1})。注意网络输出的是“这一整段要变多少”，而不是下一时刻的图像本身——这正是与多步扩散的区别。', 'utils/unet.py', 'utils/unet.py', '论文 Eq.18'],
  ['压回已测测量', '数据一致性投影 Π_y(v) = v + A†(y − A v) 把结果拉回“与已采集数据一致”的集合。起点与终点都被同一个 Π_y 约束，因此整段增量在 k 空间上的投影为零，随机扰动带来的残差就落在测量零空间里。', 'utils/finite_transition.py', 'utils/finite_transition.py', '论文 Eq.19'],
  ['重复 J 次', '保留过渡数 J 决定整条轨迹要走多少次。论文取 J = 10，也就是推理时约 10 次网络评估；实测 0.349 秒 / 1.05 GB（RTX 4090），与 DTM、FLOWER、UPMRI 同量级，比 1000 步扩散快约两个数量级。', 'train.sh', 'train.sh / test.sh', '论文 §V-C，Table V'],
];
const stepButtons = [...document.querySelectorAll('[data-step]')];
stepButtons.forEach(button => button.addEventListener('click', () => {
  stepButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  const link = document.getElementById('step-source');
  link.href = REPO + step[2];
  link.textContent = '官方代码：' + step[3] + ' ↗ · ' + step[4];
}));
stepButtons[0].click();

/* ---------- 交互 1：轨迹与扰动分叉（示意，无数值数据） ---------- */
const canvas = document.getElementById('traj-canvas');
const J = 10;
let trajSeed = 20261009, showFan = true;
function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function trajY(f) { return 300 - 190 * Math.pow(f, 0.8); }   // f=0 左上（欠采样端点），f=1 右上（目标）
function paintTraj() {
  const c = canvas.getContext('2d'); if (!c) return;
  const W = canvas.width, H = canvas.height;
  const gamma = Number(document.getElementById('gamma-range').value) / 100;
  const rng = mulberry32(trajSeed);
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  c.fillStyle = '#fafbf7'; c.fillRect(0, 0, W, H);
  // 网格
  c.strokeStyle = '#e9eee7'; c.lineWidth = 1;
  for (let i = 1; i < 10; i += 1) { const y = trajY(0) - (trajY(0) - trajY(1)) * i / 10; c.beginPath(); c.moveTo(60, y); c.lineTo(W - 24, y); c.stroke(); }
  // 坐标轴
  c.strokeStyle = '#c9d6d1'; c.beginPath(); c.moveTo(60, 20); c.lineTo(60, 310); c.lineTo(W - 20, 310); c.stroke();
  c.fillStyle = '#687672'; c.font = '12px "Microsoft YaHei", sans-serif';
  c.fillText('欠采样端点 x_T（零填充）', 62, 328);
  c.fillText('完全恢复 x_0', W - 130, 328);
  c.fillText('恢复进程 →', 60, 16);
  // 均值轨迹
  const pts = [];
  for (let i = 0; i <= 60; i += 1) { const f = i / 60; pts.push([60 + (W - 84) * f, trajY(f) + 8 * Math.sin(f * 7)]); }
  c.strokeStyle = '#0b7564'; c.lineWidth = 2.4; c.beginPath();
  pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  // 保留状态 + 分叉
  const spread = Math.sqrt(Math.max(gamma, 0) * (1 - gamma)) * 2;   // γ=0.5 时最大，γ=0 时无分叉
  for (let j = 0; j <= J; j += 1) {
    const f = j / J, x = 60 + (W - 84) * f, y = trajY(f) + 8 * Math.sin(f * 7);
    if (showFan && spread > 0.02 && j < J) {
      for (let k = 0; k < 7; k += 1) {
        const ang = -Math.PI / 2 + (rng() - 0.5) * 1.5;
        const len = (12 + rng() * 46) * spread;
        const ex = x + Math.cos(ang) * len * 0.55, ey = y + Math.sin(ang) * len;
        c.strokeStyle = 'rgba(196,106,68,0.55)'; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        c.fillStyle = 'rgba(196,106,68,0.75)'; c.beginPath(); c.arc(ex, ey, 2.6, 0, 6.2832); c.fill();
      }
    }
    c.fillStyle = j === J ? '#0b7564' : '#172b2a';
    c.beginPath(); c.arc(x, y, j === J ? 6 : 4.2, 0, 6.2832); c.fill();
    if (j % 2 === 0 || j === J) {
      c.fillStyle = '#687672'; c.font = '11px "Microsoft YaHei", sans-serif';
      c.fillText('t' + (J - j), x - 8, y - 12);
    }
  }
  c.fillStyle = '#687672'; c.font = '12px "Microsoft YaHei", sans-serif';
  c.fillText('绿线＝均值位移 d 沿轨迹的示意；橙色分叉＝随机 k 空间扰动带来的可能下一状态', 330, 252);
  const gText = gamma.toFixed(2);
  document.getElementById('gamma-readout').textContent = gText;
  document.getElementById('traj-gamma').textContent = gText;
  const lesson = gamma === 0
    ? 'γ = 0：没有扰动，同一个当前状态只会得到唯一下一状态——这就是消融表里的 Deterministic 一行（35.8 → 34.9 dB）。'
    : 'γ = ' + gText + '。论文取 γ = 0.1（Table VI 的 Stochastic 一行）：分叉存在但不至于把当前状态破坏得太厉害，因为被误伤的已采集系数随后会被 Π_y 恢复。把滑杆推到 0.50 会看到最大的分叉宽度——γ 越大，未采集自由度上的随机性越强，但每次过渡要修的东西也越多。';
  document.getElementById('traj-lesson').textContent = lesson + '（曲线与分叉均为机制示意，不含任何实测数值；论文只报告 γ = 0.1 这一设定。）';
}
document.getElementById('gamma-range').addEventListener('input', paintTraj);
document.getElementById('traj-reseed').addEventListener('click', () => { trajSeed = (trajSeed * 1103515245 + 12345) >>> 0; paintTraj(); });
document.getElementById('traj-toggle').addEventListener('click', event => {
  showFan = !showFan;
  event.currentTarget.setAttribute('aria-pressed', String(showFan));
  event.currentTarget.textContent = showFan ? '显示分叉' : '隐藏分叉';
  paintTraj();
});
paintTraj();

/* ---------- 交互 2：Table II / III / IV 的 PSNR 条形图 ---------- */
const TABLES = {
  fastmri: { label: 'fastMRI（Table II）', min: 27, max: 39, rows: [
    ['LORAKS', [35.2, 33.5, 32.3]], ['rGAN', [35.9, 33.9, 32.9]], ['DDPM', [36.1, 34.8, 34.0]],
    ['DiffRecon', [35.7, 34.5, 33.7]], ['CDiffMR', [31.4, 31.2, 31.2]], ['FDB', [37.4, 35.9, 35.0]],
    ['DTM', [30.2, 29.2, 28.7]], ['FLOWER', [33.8, 33.4, 33.1]], ['UPMRI', [36.6, 34.2, 31.9]],
    ['FLEX-MRI', [38.2, 36.7, 35.8]],
  ] },
  m4raw: { label: 'M4Raw（Table III）', min: 15, max: 25, rows: [
    ['LORAKS', [22.4, 22.2, 22.0]], ['rGAN', [22.5, 22.4, 22.3]], ['DDPM', [22.1, 21.7, 21.5]],
    ['DiffRecon', [22.9, 22.7, 22.5]], ['CDiffMR', [16.7, 16.7, 16.5]], ['FDB', [17.7, 16.6, 16.0]],
    ['DTM', [20.4, 19.8, 19.5]], ['FLOWER', [23.1, 22.7, 22.5]], ['UPMRI', [23.3, 21.3, 20.2]],
    ['FLEX-MRI', [23.9, 23.5, 23.2]],
  ] },
  cross: { label: '跨数据集（Table IV，M4Raw 训练 → fastMRI 测试）', min: 14, max: 39, rows: [
    ['LORAKS', [35.2, 33.5, 32.3]], ['rGAN', [33.5, 31.6, 30.4]], ['DDPM', [35.0, 33.1, 31.9]],
    ['DiffRecon', [35.5, 33.3, 31.9]], ['CDiffMR', [35.0, 33.0, 31.4]], ['FDB', [18.0, 15.6, 15.0]],
    ['DTM', [33.2, 31.6, 30.6]], ['FLOWER', [35.7, 34.1, 33.1]], ['UPMRI', [34.5, 32.3, 30.7]],
    ['FLEX-MRI', [37.6, 35.9, 34.8]],
  ] },
};
let tableKey = 'fastmri', accelIndex = 0;
function drawTable() {
  const set = TABLES[tableKey];
  const holder = document.getElementById('metric-bars'); holder.replaceChildren();
  set.rows.forEach(([name, values]) => {
    const value = values[accelIndex];
    const row = document.createElement('div'); row.className = 'bar-row';
    const label = document.createElement('span'); label.textContent = name;
    const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div'); bar.className = 'bar-fill' + (name === 'FLEX-MRI' ? ' best' : '');
    bar.style.width = Math.max(0, Math.min(100, (value - set.min) / (set.max - set.min) * 100)) + '%';
    track.append(bar);
    const val = document.createElement('span'); val.className = 'bar-value'; val.textContent = value.toFixed(1);
    row.append(label, track, val); holder.append(row);
  });
  document.getElementById('chart-axis').textContent = set.label + ' · PSNR (dB)，R = ' + [4, 6, 8][accelIndex] + '；条形以 ' + set.min + ' dB 为起点（本数据集的观测下限），以 ' + set.max + ' dB 为满格。数值为论文原表转录。';
}
document.querySelectorAll('[data-table]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-table]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  tableKey = b.dataset.table; drawTable();
}));
document.querySelectorAll('[data-accel]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-accel]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  accelIndex = [4, 6, 8].indexOf(Number(b.dataset.accel)); drawTable();
}));
drawTable();

/* ---------- 交互 3：Table VI 消融 ---------- */
const ABLATION = {
  'stoch|relaxed|nominal': [35.8, 92.7], 'stoch|relaxed|perturbed': [35.4, 92.2],
  'stoch|restricted|nominal': [35.0, 91.5], 'stoch|restricted|perturbed': [34.9, 91.6],
  'det|relaxed|nominal': [34.9, 91.1], 'det|relaxed|perturbed': [34.5, 91.0],
  'det|restricted|nominal': [34.2, 89.9], 'det|restricted|perturbed': [34.0, 90.0],
};
const AB_LABEL = { stoch: 'Stochastic（推理时加扰动）', det: 'Deterministic', relaxed: 'Relaxed（支撑松弛）', restricted: 'Restricted（受限目标）', nominal: 'Nominal（训练输入不加扰动）', perturbed: 'Perturbed（训练输入也加扰动）' };
const abState = { mode: 'stoch', support: 'relaxed', input: 'nominal' };
function updateAblation() {
  const key = [abState.mode, abState.support, abState.input].join('|');
  const [psnr, ssim] = ABLATION[key];
  document.getElementById('ab-psnr').textContent = psnr.toFixed(1);
  document.getElementById('ab-ssim').textContent = ssim.toFixed(1);
  const parts = ['当前组合：' + AB_LABEL[abState.mode] + ' + ' + AB_LABEL[abState.support] + ' + ' + AB_LABEL[abState.input] + '，论文原表给出 PSNR ' + psnr.toFixed(1) + ' dB、SSIM ' + ssim.toFixed(1) + '%。'];
  parts.push('相对最佳行（Stochastic + Relaxed + Nominal，35.8 dB / 92.7%）：PSNR ' + (psnr - 35.8 >= 0 ? '+' : '') + (psnr - 35.8).toFixed(1) + ' dB，SSIM ' + (ssim - 92.7 >= 0 ? '+' : '') + (ssim - 92.7).toFixed(1) + '。');
  if (abState.mode === 'det') parts.push('关掉推理扰动，就退化成确定性轨迹——这是发布代码默认跑出来的那一行。');
  if (abState.support === 'restricted') parts.push('受限目标只让预测器为当前掩码选中的系数负责，论文的解释是它学不到“整段过渡”。');
  if (abState.input === 'perturbed') parts.push('训练输入也加扰动没有额外收益，论文据此认为随机性应当只加在推理阶段。');
  document.getElementById('ab-lesson').textContent = parts.join(' ');
}
document.querySelectorAll('[data-ab]').forEach(group => {
  const role = group.dataset.ab;
  group.querySelectorAll('.pill').forEach(b => b.addEventListener('click', () => {
    group.querySelectorAll('.pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    abState[role] = b.dataset.value; updateAblation();
  }));
});
updateAblation();

/* ---------- 交互 4：J 的取舍（Fig. 5 的锚点） ---------- */
const J_METRICS = {
  psnr: { axis: 'PSNR (dB) ↑ · 锚点 J=10 为 Table II 在 fastMRI R=8 的实测值；J=2 与 J=1000 由论文报告的相对差值换算（斜纹）', min: 32, max: 37, dec: 1,
    rows: [['J = 2', 34.1, 'derived', '论文：比 J=10 低 1.7 dB'], ['J = 10', 35.8, 'measured', 'Table II，fastMRI R=8'], ['J = 1000', 33.5, 'derived', '论文：比 J=10 低 2.3 dB']] },
  ssim: { axis: 'SSIM (%) ↑ · 锚点同左，单位由 % 换成同尺度的差值换算', min: 83, max: 94, dec: 1,
    rows: [['J = 2', 91.6, 'derived', '论文：比 J=10 低 1.1%'], ['J = 10', 92.7, 'measured', 'Table II，fastMRI R=8'], ['J = 1000', 84.9, 'derived', '论文：比 J=10 低 7.8%']] },
};
function drawJ(key) {
  const set = J_METRICS[key];
  const holder = document.getElementById('j-bars'); holder.replaceChildren();
  set.rows.forEach(([name, value, kind, note], i) => {
    const row = document.createElement('div'); row.className = 'bar-row';
    const label = document.createElement('span'); label.textContent = name;
    const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div');
    bar.className = 'bar-fill' + (i === 1 ? ' best' : '');
    if (kind === 'derived') { bar.style.backgroundImage = 'repeating-linear-gradient(45deg, #172b2a 0 3px, transparent 3px 8px)'; bar.style.opacity = '.78'; }
    bar.style.width = Math.max(0, Math.min(100, (value - set.min) / (set.max - set.min) * 100)) + '%';
    bar.title = note;
    track.append(bar);
    const val = document.createElement('span'); val.className = 'bar-value'; val.textContent = value.toFixed(set.dec);
    row.append(label, track, val); holder.append(row);
  });
  document.getElementById('j-axis').textContent = set.axis + '；斜纹条为换算值，实心条为原表数值。';
}
document.querySelectorAll('[data-jmetric]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-jmetric]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  drawJ(b.dataset.jmetric);
}));
drawJ('psnr');

/* ---------- 官方仓库的真实命令 ---------- */
const excerpts = {
  coil: ['python precompute_coil_maps.py --data_path /path/to/M4Raw/ --phase train --workers 16\npython precompute_coil_maps.py --data_path /path/to/M4Raw/ --phase test  --workers 16',
    '训练前必须先建 ESPIRiT 线圈图缓存：数据加载器会跳过没有缓存线圈图的体数据。脚本按体数据把结果落盘到 $FLEX_MRI_COIL_MAP_CACHE 或 <data_dir>/coil_maps_cache；已存在的条目会跳过（除非 --overwrite），所以可以被打断后继续跑。设备由 FLEX_MRI_ESPIRIT_DEVICE 控制（auto / cpu / cuda:N，GPU 需要 cupy）。'],
  train: ['pip install -r requirements.txt\nbash train.sh /path/to/M4Raw/\n\n# 所有设置都可用环境变量覆盖：GPU / PYTHON / SAVE_DIR / CONTRAST /\n# NUM_WORKERS / BATCH_SIZE / STEPS / LR / TRANSITION_STEPS / R_MIN / R_MAX ...\n# 快速冒烟：GPU=0 STEPS=200 bash train.sh /path/to/M4Raw/ --max_volumes 4 --slices_per_volume 2',
    '默认配置：125,000 次迭代、batch size 2（每 8 次迭代一个优化步）、学习率 1e-4（5k 步 warmup 后余弦衰减到 1e-6）、dropout 0.3、EMA 0.9999、每个样本一张新掩码且加速在 [2, 8] 内随机。检查点每 25,000 次迭代写到 exp/。注意论文表格按“50/100 个 epoch”记账，与这里的迭代次数不是同一套口径。'],
  test: ['bash test.sh /path/to/M4Raw/ exp/model125000.pt\n\n# 环境变量可覆盖：R_VALUES="4 8" CONTRASTS="T2" GPU=0 ...',
    'test.sh 默认扫 R ∈ {2,4,6,8} × 对比 {T1,T2,FLAIR}，逐切片输出 rss<i>.npy、sense<i>.npy 与 PNG 到 results/<检查点目录名>/<R>x_<contrast>。RSS 才与 reconstruction_rss 真值同口径；加 --save_sense False 可省掉 SENSE（全量扫描约 15 GB）。官方提醒：要用原始权重 model<step>.pt，而不是 EMA（ema_rate=0.9999 下 EMA 落后约 7k 次迭代）。'],
  eval: ['python evaluate.py --data_path /path/to/M4Raw/ --results results/exp',
    '评测对 reconstruction_rss 计算每个加速倍数与对比下的 PSNR / SSIM，并以零填充作为基线；掩码用 sample.py 用过的同一批种子重新生成，保证可比。'],
  resume: ['bash train.sh /path/to/M4Raw/ --resume_checkpoint exp/model025000.pt\n\n# 线圈图缓存同样可续跑：已存在的条目会被跳过\npython precompute_coil_maps.py --data_path /path/to/M4Raw/ --phase train --workers 16',
    'train.py 暴露 --resume_checkpoint，恢复的是权重、EMA、优化器状态与步数（步数从检查点文件名解析），不是只恢复权重。缓存脚本的续跑是另一个层面：它只跳过已算好的体数据。两者合起来意味着“训练可以断，数据管线也可以断”。'],
};
function displayCode(key) {
  const value = excerpts[key];
  document.getElementById('code-snippet').textContent = value[0];
  document.getElementById('code-explanation').textContent = value[1];
  document.getElementById('code-link').href = REPO + 'README.md';
  document.getElementById('code-link').textContent = '官方 README（固定核查提交） ↗';
}
document.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-code]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  displayCode(b.dataset.code);
}));
displayCode('coil');

/* ---------- 阅读笔记、进度条与目录高亮 ---------- */
const noteKey = 'paper-flex-mri-arxiv261013095-reading-note';
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
