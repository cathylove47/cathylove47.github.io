'use strict';
// 本页所有交互都是解释性示意，或由论文原表数值重算，不是本站实验。
const REPO = 'https://github.com/a12dongithub/PathOGen/blob/c5e0c5c3d9dd13b1c4a0d7f5bc83381adbde2bc7/';

/* ---------- 生成流程四步 ---------- */
const steps = [
  ['读出现有图块的条件', 'CellViT++ 从真实 H&E 图块里给出细胞核的质心、类别与轮廓。这些是弱标签而不是人工标注，它们同时决定 5 通道空间图 S 与 16 维向量 m。', 'tree/main/training', 'training/ 目录'],
  ['编码空间图并拼接潜变量', 'S 是 5×512×512 的稀疏通道，经可训练的卷积编码器压到 4×64×64，再与 4 通道的带噪潜变量按通道拼成 8 通道。U-Net 首层卷积由 4 扩到 8，新增权重初始化为 0，训练从预训练先验平滑起步。', '', '论文 §3.4，Eq.7–8'],
  ['条件去噪', '每个残差块用 FiLM 接收 16 维形态/外观向量，生成逐通道的缩放与平移；文本条件固定。空间与形态因此走两条互不干扰的通路，才能做到只动一个旋钮。', '', '论文 §3.5，Eq.9–10'],
  ['解码并按保真度挑选', '解码回 512×512；每个条件生成 8 张候选，用细胞分析器重算“生成图与请求地图”的一致性 Q，取最好的一张进入下游探测。这一步不看被审计模型的预测或梯度。', '', '论文 §3.6，Eq.11'],
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  const link = document.getElementById('step-source');
  if (step[2]) { link.href = REPO + step[2]; link.textContent = '官方代码：' + step[3] + ' ↗'; } else { link.href = '#sources'; link.textContent = step[3] + ' ↗'; }
}));
document.querySelector('[data-step="0"]').click();

/* ---------- 真实数字条形图（Table 1–3） ---------- */
const metrics = {
  fid: { axis: 'FID ↓ · 条形以 0 为起点，最大刻度 45；越小越好', min: 0, max: 45, dec: 3, best: 1,
         rows: [['不筛选（单种子）', 42.923], ['八候选择优', 36.717], ['真实 vs 真实', 16.369]] },
  kid: { axis: 'KID ↓ · 条形以 0 为起点，最大刻度 0.026；越小越好', min: 0, max: 0.026, dec: 5, best: 1,
         rows: [['不筛选（单种子）', 0.02466], ['八候选择优', 0.01964], ['真实 vs 真实', 0.00647]] },
  count: { axis: '总计数 ρ ↑ · 请求细胞数与复原细胞数的 Spearman 相关', min: -0.05, max: 1, dec: 3, best: 0,
           rows: [['CellViT++（=筛选器）', 0.952], ['HoVer-Net', 0.908], ['StarDist', 0.928], ['随机真实切片（对照）', -0.031]] },
  type: { axis: '分类型 ρ ↑ · 还要看细胞类别是否一致，因此整体更低', min: -0.05, max: 0.65, dec: 3, best: 0,
          rows: [['CellViT++（=筛选器）', 0.612], ['HoVer-Net', 0.525], ['随机真实切片（对照）', -0.020]] },
  f1: { axis: '质心 F1@25px ↑ · 一对一匈牙利匹配；StarDist 只看位置，不罚类别错误', min: 0, max: 0.85, dec: 3, best: 2,
        rows: [['CellViT++', 0.726], ['HoVer-Net', 0.625], ['StarDist', 0.798], ['随机真实切片（对照）', 0.134]] },
  dose: { axis: '剂量内 macro ρ ↑ · 同源、固定 seed 沿 δ=−2…+2 的相关系数再按特征平均', min: 0, max: 1, dec: 3, best: 0,
          rows: [['CellViT++', 0.986], ['HoVer-Net', 0.986], ['StarDist', 0.929]] },
};
function drawBars(key) {
  const set = metrics[key];
  const holder = document.getElementById('metric-bars'); holder.replaceChildren();
  set.rows.forEach(([name, value], i) => {
    const row = document.createElement('div'); row.className = 'bar-row';
    const label = document.createElement('span'); label.textContent = name;
    const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div'); bar.className = 'bar-fill' + (i === set.best ? ' best' : '');
    bar.style.width = Math.max(0, Math.min(100, (value - set.min) / (set.max - set.min) * 100)) + '%';
    track.append(bar);
    const val = document.createElement('span'); val.className = 'bar-value'; val.textContent = value.toFixed(set.dec);
    row.append(label, track, val); holder.append(row);
  });
  document.getElementById('chart-axis').textContent = set.axis;
}
document.querySelectorAll('[data-metric]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-metric]').forEach(button => button.setAttribute('aria-pressed', String(button === b)));
  drawBars(b.dataset.metric);
}));
drawBars('fid');

/* ---------- 交互 1：细胞地图（按论文 Eq.2 的构造方式现场绘制） ---------- */
const CHANNELS = [
  { name: '肿瘤 neoplastic', color: '#f2f0e6', radius: 3.4 },
  { name: '炎症 inflammatory', color: '#6fe3d0', radius: 2.8 },
  { name: '结缔 connective', color: '#7fc47a', radius: 2.6 },
  { name: '死亡 dead', color: '#e8cf6a', radius: 2.8 },
  { name: '上皮 epithelial', color: '#e8945a', radius: 2.6 },
];
function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gauss(rng) { const u = Math.max(rng(), 1e-9), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

const TUMOR_N = 128, OTHER_N = [40, 8, 22], TUMOR_CENTER = [.36, .5], TUMOR_SIGMA = .085, OUT_CENTER = [.79, .5], OUT_SIGMA = .075;
function buildMap(seed) {
  const rng = mulberry32(seed);
  const tumor = Array.from({ length: TUMOR_N }, () => [TUMOR_CENTER[0] + gauss(rng) * TUMOR_SIGMA, TUMOR_CENTER[1] + gauss(rng) * TUMOR_SIGMA * 1.5]);
  const others = OTHER_N.map(n => Array.from({ length: n }, () => [.08 + rng() * .84, .1 + rng() * .8]));
  const immune = Array.from({ length: 80 }, () => ({
    inside: [TUMOR_CENTER[0] + gauss(rng) * TUMOR_SIGMA * 1.05, TUMOR_CENTER[1] + gauss(rng) * TUMOR_SIGMA * 1.5],
    outside: [OUT_CENTER[0] + gauss(rng) * OUT_SIGMA, OUT_CENTER[1] + gauss(rng) * OUT_SIGMA * 1.4],
    u: rng(),
  }));
  return { tumor, others, immune };
}
let mapSeed = 20261013, mapState = buildMap(mapSeed), mapChannel = 'all';
function paintMap() {
  const canvas = document.getElementById('map-canvas'), c = canvas.getContext('2d'); if (!c) return;
  const W = canvas.width, H = canvas.height;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  c.fillStyle = '#141f1e'; c.fillRect(0, 0, W, H);
  c.strokeStyle = '#2c4340'; c.lineWidth = 1;
  [.25, .5, .75].forEach(f => { c.beginPath(); c.moveTo(W * f, 12); c.lineTo(W * f, H - 12); c.stroke(); c.beginPath(); c.moveTo(12, H * f); c.lineTo(W - 12, H * f); c.stroke(); });
  const count = Number(document.getElementById('map-count').value);
  const mixing = Number(document.getElementById('map-mixing').value) / 100;
  const show = ch => mapChannel === 'all' || mapChannel === String(ch);
  const dot = (x, y, r, color, alpha) => {
    const px = x * W, py = y * H;
    c.globalAlpha = .22; c.beginPath(); c.arc(px, py, r * 3.1, 0, 6.2832); c.fillStyle = color; c.fill();
    c.globalAlpha = alpha; c.beginPath(); c.arc(px, py, r, 0, 6.2832); c.fill();
    c.globalAlpha = 1;
  };
  if (show(0)) { c.fillStyle = CHANNELS[0].color; mapState.tumor.forEach(([x, y]) => dot(x, y, CHANNELS[0].radius, CHANNELS[0].color, 1)); }
  const shown = mapState.immune.slice(0, count);
  const insideCount = shown.filter(cell => cell.u < mixing).length;
  if (show(1)) shown.forEach(cell => {
    const [x, y] = cell.u < mixing ? cell.inside : cell.outside;
    dot(x, y, CHANNELS[1].radius, CHANNELS[1].color, 1);
  });
  if (show(2)) mapState.others[0].forEach(([x, y]) => dot(x, y, CHANNELS[2].radius, CHANNELS[2].color, .95));
  if (mapChannel === 'all') { mapState.others[1].forEach(([x, y]) => dot(x, y, CHANNELS[3].radius, CHANNELS[3].color, .95)); mapState.others[2].forEach(([x, y]) => dot(x, y, CHANNELS[4].radius, CHANNELS[4].color, .95)); }
  c.font = '12px "Microsoft YaHei", sans-serif';
  c.fillStyle = '#8fa8a2'; c.fillText('类别：肿瘤 ' + (show(0) ? CHANNELS[0].color : '#3a4f4c') + ' · 炎症 ' + (show(1) ? CHANNELS[1].color : '#3a4f4c') + ' · 结缔 ' + (show(2) ? CHANNELS[2].color : '#3a4f4c'), 16, H - 14);
  const visible = mapChannel === 'all' || mapChannel === '1' ? count : 0;
  document.getElementById('map-tumor').textContent = String(mapState.tumor.length);
  document.getElementById('map-immune').textContent = count + ' / ' + visible;
  document.getElementById('map-lesson').textContent = '免疫细胞 ' + count + ' 个，其中 ' + Math.round(insideCount / Math.max(1, count) * 100) + '% 被请求放在肿瘤聚集区内部，其余退到外围。把混合度从 0 拖到 100，位置在变、数量始终是 ' + count + '——这就是论文里 tumor–immune mixing 与 immune burden 的区别。';
}
document.querySelectorAll('[data-channel]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-channel]').forEach(button => button.setAttribute('aria-pressed', String(button === b)));
  mapChannel = b.dataset.channel; paintMap();
}));
['map-count', 'map-mixing'].forEach(id => document.getElementById(id).addEventListener('input', paintMap));
document.getElementById('map-reseed').addEventListener('click', () => { mapSeed = (mapSeed * 1103515245 + 12345) >>> 0; mapState = buildMap(mapSeed); paintMap(); });
paintMap();

/* ---------- 交互 2：BNR 计算器（用 Table 4 的 PAM50 行 TVD 现算） ---------- */
const BNR = {
  resnet: { label: 'ResNet-50', reported: 1.0736, bio: { enlarge: .1647, shape: .1759, immune: .1672, mixing: .1126 }, nuis: { stain: .1687, rotate: .1203 } },
  ctrans: { label: 'CTransPath', reported: 1.1434, bio: { enlarge: .1883, shape: .1852, immune: .1993, mixing: .1194 }, nuis: { stain: .2181, rotate: .0846 } },
  uni2h: { label: 'UNI2-h', reported: 1.2787, bio: { enlarge: .2596, shape: .2321, immune: .2567, mixing: .1582 }, nuis: { stain: .2456, rotate: .1089 } },
};
const ITEM_NAME = { enlarge: '核增大', shape: '形状不规则', immune: '免疫负荷', mixing: '肿瘤–免疫混合', stain: '染色亮度', rotate: '图像旋转' };
let bnrModel = 'resnet';
const pressed = (group) => [...document.querySelectorAll('[data-bnr-' + group + '] .pill')].filter(p => p.getAttribute('aria-pressed') === 'true').map(p => p.dataset.item);
const mean = (obj, keys) => keys.reduce((sum, k) => sum + obj[k], 0) / keys.length;
function updateBnr(warn) {
  const model = BNR[bnrModel];
  const bio = pressed('bio'), nuis = pressed('nuis');
  const bioMean = mean(model.bio, bio), nuisMean = mean(model.nuis, nuis), ratio = bioMean / nuisMean;
  document.getElementById('bnr-bio').textContent = bioMean.toFixed(4);
  document.getElementById('bnr-nuis').textContent = nuisMean.toFixed(4);
  const out = document.getElementById('bnr-value');
  out.textContent = ratio.toFixed(4);
  out.className = ratio >= 1 ? 'good' : 'bad';
  const parts = [model.label + '：生物组平均 ' + bioMean.toFixed(4) + ' ÷ 干扰组平均 ' + nuisMean.toFixed(4) + ' = ' + ratio.toFixed(4) + '；论文报告 ' + model.reported + '。'];
  if (bio.length === 4 && nuis.length === 2) parts.push('默认构造与论文 Table 4 的构造一致：重算 ' + ratio.toFixed(4) + ' 对论文 ' + model.reported + '，相差 ' + Math.abs(ratio - model.reported).toFixed(4) + '（表内只给四位小数）。');
  if (nuis.length === 1) parts.push('干扰组现在只剩「' + ITEM_NAME[nuis[0]] + '」，比值' + (ratio >= 1 ? '仍大于 1' : '已经掉到 1 以下') + '——说明 BNR 的结论依赖你把哪些干预算作干扰。');
  if (bio.length < 4) parts.push('生物组缺了：' + Object.keys(model.bio).filter(k => !bio.includes(k)).map(k => ITEM_NAME[k]).join('、') + '。去掉响应最小的那一项会抬高比值。');
  if (warn) parts.push(warn);
  if (pressed('bio').length === 0 || nuis.length === 0) parts.push('每组至少保留一项。');
  document.getElementById('bnr-lesson').textContent = parts.join(' ');
}
document.querySelectorAll('[data-bnr-models] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-bnr-models] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  bnrModel = b.dataset.model; updateBnr();
}));
['bio', 'nuis'].forEach(group => document.querySelectorAll('[data-bnr-' + group + '] .pill').forEach(b => b.addEventListener('click', () => {
  const isOn = b.getAttribute('aria-pressed') === 'true';
  if (isOn && pressed(group).length === 1) { updateBnr('至少保留一项：无法取消「' + ITEM_NAME[b.dataset.item] + '」。'); return; }
  b.setAttribute('aria-pressed', String(!isOn)); updateBnr();
})));
updateBnr();

/* ---------- 官方仓库的真实命令 ---------- */
const excerpts = {
  demo: ['git clone https://github.com/a12dongithub/PathOGen.git\ncd PathOGen\npython -m venv .venv        # 激活后安装 CUDA 版 PyTorch\npython -m pip install -r inference/requirements.txt\npython inference/generate.py --synthetic-example --seed 42 --output outputs/demo.png',
    '最小自检：用人工细胞布局加全零的标准化形态控制生成一张图，只验证软件链路。首次运行会下载约 4.16 GB 权重与基座的文本编码器、分词器、调度器；不是论文里的评估案例。'],
  tile: ['python inference/generate.py \\\n  --data-root /path/to/512_final_dataset \\\n  --tile YOUR_TILE_ID \\\n  --seed 42 --steps 30 --spatial-strength 2 \\\n  --output outputs/baseline.png',
    '用真实图块的条件。数据集需要自备，目录为 images/、spatial_maps/ 与 morphology_features/morphology_stats.parquet；--spatial-strength 对应公式里的 λ_s。'],
  custom: ['python inference/generate.py \\\n  --spatial-map conditions/map.npz \\\n  --morphology-json conditions/morphology.json \\\n  --seed 42 --output outputs/custom.png',
    '直接构造条件：map 的形状是 (512,512,5) 或 (5,512,512)，通道顺序为 neoplastic / inflammatory / connective / dead / epithelial，取值为平滑后的质心峰（不是渲染好的图片）；morphology JSON 必须是固定顺序的 16 个标准化值。加 --validate-only 可先只检查格式。'],
  edit: ['python inference/generate.py --data-root /path/to/512_final_dataset \\\n  --tile YOUR_TILE_ID --seed 42 \\\n  --set g_mean=-1 --output outputs/green_edit.png',
    '配对编辑：--set 设置的是绝对标准化值，不是相对基线的增减。要做剂量扫描，请自己算 baseline + dose（都在标准化表示里），并保持 seed 与其他条件不变。每张输出都会附带一个 JSON，记录条件、种子、采样设置、checkpoint、精度与耗时。'],
};
function displayCode(key) {
  const v = excerpts[key];
  document.getElementById('code-snippet').textContent = v[0];
  document.getElementById('code-explanation').textContent = v[1];
  document.getElementById('code-link').href = REPO + 'README.md';
  document.getElementById('code-link').textContent = '官方 README（固定核查提交） ↗';
}
document.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-code]').forEach(button => button.setAttribute('aria-pressed', String(button === b)));
  displayCode(b.dataset.code);
}));
displayCode('demo');

/* ---------- 阅读笔记、进度条与目录高亮 ---------- */
const noteKey = 'paper-cpathogen-arxiv261000602-reading-note';
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
