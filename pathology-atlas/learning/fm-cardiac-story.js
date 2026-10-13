'use strict';
// 本页所有交互都只是在浏览器里重排论文原表的已核验数值，或按原表数字做算术，不是本站实验。
const PAPER = 'https://arxiv.org/html/2610.08109v1';
const REPO = 'https://github.com/Hashmi360/BeyondScratch-CMR';

/* ---------- 数据流四步 ---------- */
const steps = [
  ['从欠采样到幅值图', '多线圈 k 空间逐线圈做 iFFT，再做平方和（RSS）合成单张幅值图，归一化到 [0,1]，裁或补到 224×224 并复制为 3 通道。', PAPER + '#S4.SS2', '论文 §4.2'],
  ['换掉编码器', '把 UNETR 的 ViT 编码器换成 CLIP / BiomedCLIP / DINOv2（ViT-B）。丢弃 class token，只保留 patch 表征；编码器本体可以冻结，也可以加 LoRA 后冻结。', PAPER + '#S3.SS2', '论文 §3.2–3.3'],
  ['融合所有层', '每个 Transformer block 的潜状态经 LayerNorm + 两层 GELU MLP 融合成瓶颈表征，中间层特征当多尺度跳连。CLIP / BiomedCLIP 给 14×14 网格；DINOv2 是 16×16，需双线性插值对齐。', PAPER + '#S3.SS2', '论文 §3.2'],
  ['原样解码', 'UNETR 解码器、浅层卷积分支、SSIM 损失、优化器与早停规则全部保持与基线一致：唯一变化的是编码器的先验来源。可训练参数为 65.7M（从头训练）/ 33.7M（冻结）。', PAPER + '#S3.SS1', '论文 §3.1、§4.2'],
];
const stepButtons = [...document.querySelectorAll('[data-step]')];
stepButtons.forEach(button => button.addEventListener('click', () => {
  stepButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  const link = document.getElementById('step-source');
  link.href = step[2]; link.textContent = step[3] + ' ↗';
}));
stepButtons[0].click();

/* ---------- 交互 1：三种策略在不同数据比例下的真实指标 ---------- */
// 逐字取自论文 Table 1（全量：从头训练 + 冻结）、Table 2（全量：LoRA）与 Table 3（10× 加速下的低数据）。
// 每个条目 = [SSIM, PSNR, NMSE]。
const MODELS = [
  ['UNETR（从头训练）', 'unetr'],
  ['Frozen CLIP', 'fclip'],
  ['LoRA CLIP', 'lclip'],
  ['Frozen BiomedCLIP', 'fbio'],
  ['LoRA BiomedCLIP', 'lbio'],
  ['Frozen DINOv2', 'fdino'],
  ['LoRA DINOv2', 'ldino'],
];
const TABLE = {
  2023: {
    full4: { unetr: [.8904, 31.1405, .0458], fclip: [.9035, 32.1443, .0344], lclip: [.9013, 32.1458, .0340], fbio: [.9027, 32.1010, .0351], lbio: [.8972, 31.9133, .0352], fdino: [.9073, 32.2097, .0348], ldino: [.9061, 32.4175, .0319] },
    full8: { unetr: [.8625, 29.7299, .0632], fclip: [.8770, 30.6202, .0490], lclip: [.8710, 30.4831, .0492], fbio: [.8738, 30.3092, .0552], lbio: [.8706, 30.4793, .0516], fdino: [.8787, 30.7081, .0480], ldino: [.8776, 30.9313, .0441] },
    full10: { unetr: [.8524, 29.1022, .0765], fclip: [.8675, 30.0675, .0538], lclip: [.8629, 29.9360, .0549], fbio: [.8636, 29.5681, .0640], lbio: [.8605, 29.6505, .0605], fdino: [.8672, 29.9788, .0573], ldino: [.8649, 30.1798, .0511] },
    p5: { unetr: [.7900, 27.1943, .1098], fclip: [.8310, 28.2532, .0835], lclip: [.8196, 27.7251, .0977], fbio: [.8199, 27.7550, .0970], lbio: [.8168, 27.5929, .1025], fdino: [.8348, 28.4418, .0825], ldino: [.8242, 27.6067, .1037] },
    p25: { unetr: [.8335, 28.4024, .0822], fclip: [.8562, 29.5982, .0609], lclip: [.8480, 29.2490, .0644], fbio: [.8523, 29.2954, .0676], lbio: [.8484, 29.1103, .0700], fdino: [.8591, 29.1801, .0709], ldino: [.8521, 29.1974, .0639] },
    p50: { unetr: [.8442, 28.7257, .0791], fclip: [.8630, 29.8422, .0573], lclip: [.8578, 29.5904, .0601], fbio: [.8596, 29.5823, .0644], lbio: [.8549, 29.6632, .0585], fdino: [.8661, 30.0347, .0555], ldino: [.8581, 29.2194, .0678] },
    p75: { unetr: [.8503, 29.1969, .0686], fclip: [.8663, 29.8987, .0577], lclip: [.8620, 29.9978, .0541], fbio: [.8626, 29.8418, .0580], lbio: [.8587, 29.7396, .0595], fdino: [.8690, 30.1899, .0531], ldino: [.8647, 30.1706, .0517] },
  },
  2024: {
    full4: { unetr: [.8801, 30.7491, .0552], fclip: [.8950, 31.4805, .0448], lclip: [.9003, 32.2644, .0377], fbio: [.8911, 31.1441, .0495], lbio: [.8945, 31.8295, .0407], fdino: [.8979, 31.5111, .0456], ldino: [.9054, 32.5112, .0353] },
    full8: { unetr: [.8412, 29.0134, .0831], fclip: [.8553, 29.5663, .0691], lclip: [.8591, 30.2022, .0585], fbio: [.8505, 29.5788, .0685], lbio: [.8543, 29.9158, .0636], fdino: [.8606, 29.9150, .0638], ldino: [.8663, 30.5859, .0543] },
    full10: { unetr: [.8343, 28.5577, .0890], fclip: [.8468, 29.2754, .0730], lclip: [.8500, 29.5561, .0675], fbio: [.8419, 28.8263, .0846], lbio: [.8459, 29.3922, .0709], fdino: [.8514, 29.1639, .0768], ldino: [.8571, 29.8925, .0635] },
    p5: { unetr: [.7803, 26.6047, .1445], fclip: [.8116, 27.8297, .1007], lclip: [.8061, 27.7494, .0991], fbio: [.8056, 27.5921, .1055], lbio: [.8011, 26.8955, .1346], fdino: [.8175, 27.9996, .0942], ldino: [.8094, 27.6240, .0995] },
    p25: { unetr: [.8168, 27.9679, .1031], fclip: [.8326, 28.6022, .0860], lclip: [.8339, 28.8068, .0801], fbio: [.8298, 28.5149, .0874], lbio: [.8284, 28.6318, .0836], fdino: [.8375, 28.6793, .0846], ldino: [.8380, 29.0067, .0765] },
    p50: { unetr: [.8268, 28.3097, .0941], fclip: [.8399, 28.8425, .0814], lclip: [.8428, 29.3343, .0704], fbio: [.8372, 28.8198, .0806], lbio: [.8366, 29.0000, .0762], fdino: [.8461, 29.1757, .0731], ldino: [.8493, 29.5765, .0677] },
    p75: { unetr: [.8286, 28.3560, .0955], fclip: [.8454, 29.1511, .0757], lclip: [.8480, 29.4933, .0695], fbio: [.8403, 29.0155, .0784], lbio: [.8433, 29.1320, .0772], fdino: [.8503, 29.3179, .0726], ldino: [.8550, 29.5808, .0684] },
  },
};
const METRICS = {
  ssim: { index: 0, dec: 4, better: 'high', label: 'SSIM', unit: '' },
  psnr: { index: 1, dec: 4, better: 'high', label: 'PSNR', unit: ' dB' },
  nmse: { index: 2, dec: 4, better: 'low', label: 'NMSE', unit: '' },
};
const SCENARIOS = {
  full4: '全量训练数据 · 4× 加速',
  full8: '全量训练数据 · 8× 加速',
  full10: '全量训练数据 · 10× 加速',
  p5: '5% 训练数据 · 10× 加速（Table 3）',
  p25: '25% 训练数据 · 10× 加速（Table 3）',
  p50: '50% 训练数据 · 10× 加速（Table 3）',
  p75: '75% 训练数据 · 10× 加速（Table 3）',
};
let labDataset = '2023', labMetric = 'ssim', labScenario = 'full10';

function renderBars() {
  const metric = METRICS[labMetric];
  const set = TABLE[labDataset][labScenario];
  const values = MODELS.map(([, key]) => set[key][metric.index]);
  const low = Math.min(...values), high = Math.max(...values);
  const span = high - low || 1;
  const bestValue = metric.better === 'high' ? high : low;
  const holder = document.getElementById('metric-bars');
  holder.replaceChildren();
  MODELS.forEach(([name, key]) => {
    const value = set[key][metric.index];
    const row = document.createElement('div'); row.className = 'bar-row';
    const label = document.createElement('span'); label.textContent = name;
    const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div');
    bar.className = 'bar-fill' + (value === bestValue ? ' best' : '');
    bar.style.width = (12 + (value - low) / span * 88).toFixed(2) + '%';
    track.append(bar);
    const val = document.createElement('span'); val.className = 'bar-value';
    val.textContent = value.toFixed(metric.dec) + metric.unit;
    row.append(label, track, val); holder.append(row);
  });
  document.getElementById('chart-axis').textContent = metric.label + ' · 条形只表示本组内的相对高低（' + low.toFixed(metric.dec) + ' → ' + high.toFixed(metric.dec) + '），不是从 0 起算';
  const bestName = MODELS[values.indexOf(bestValue)][0];
  document.getElementById('lab-best').textContent = bestName + '（' + bestValue.toFixed(metric.dec) + metric.unit + '）';
  const baseline = set.unetr[metric.index];
  const delta = values[values.indexOf(bestValue)] - baseline;
  const sign = delta >= 0 ? '+' : '−';
  document.getElementById('lab-delta').textContent = '最佳配置相对从头训练 ' + sign + Math.abs(delta).toFixed(metric.dec) + metric.unit;
  const loraWins = ['lclip', 'lbio', 'ldino'].filter(k => (metric.better === 'high' ? set[k][metric.index] > set[k.replace('l', 'f')][metric.index] : set[k][metric.index] < set[k.replace('l', 'f')][metric.index]));
  let lesson = SCENARIOS[labScenario] + ' · ' + (labDataset === '2023' ? 'CMRxRecon2023' : 'CMRxRecon2024') + '：';
  if (labScenario === 'p5') lesson += '极端低数据下冻结版普遍强于 LoRA 版（论文的解释是数据不足以可靠地特化表征）。';
  else if (labScenario.startsWith('full')) lesson += (loraWins.length === 3 ? '全量数据下 LoRA 在三个主干上都优于冻结：' : '全量数据下 LoRA 只在 ' + loraWins.length + ' 个主干上优于冻结：') + loraWins.length + ' / 3 个主干按 ' + metric.label + ' 胜出。';
  else lesson += 'LoRA 相对冻结在 ' + loraWins.length + ' / 3 个主干上按 ' + metric.label + ' 胜出；这一档里论文观察到的转折点是"数据越多适配越划算"。';
  if (labDataset === '2023' && labMetric === 'ssim' && loraWins.length < 3) lesson += ' 注意 CMRxRecon2023 上常见"PSNR/NMSE 变好但 SSIM 略降"的分裂。';
  document.getElementById('lab-lesson').textContent = lesson;
}
[['data-dataset', v => { labDataset = v; }], ['data-metric', v => { labMetric = v; }], ['data-scenario', v => { labScenario = v; }]].forEach(([attr, assign]) => {
  document.querySelectorAll('[' + attr + ']').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[' + attr + ']').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    assign(button.getAttribute(attr)); renderBars();
  }));
});
renderBars();

/* ---------- 交互 2：rank 滑杆与参数预算（Table 5–7） ---------- */
// v[backbone][dataset][acc][rank] = [SSIM, PSNR, NMSE]；params 为可训练参数量（百万，含 LoRA + 融合层 + 解码器）。
const RANKS = [8, 64, 128];
const RANK_DATA = {
  biomed: {
    label: 'BiomedCLIP', params: { 8: 34.0, 64: 36.1, 128: 38.4 },
    best: { 2023: { 4: 128, 8: 128, 10: 128 }, 2024: { 4: 128, 8: 128, 10: 128 } },
    v: {
      2023: { 4: { 8: [.8973, 31.8867, .0356], 64: [.8975, 31.8523, .0375], 128: [.8972, 31.9133, .0351] }, 8: { 8: [.8679, 30.3138, .0508], 64: [.8672, 29.9981, .0586], 128: [.8706, 30.4793, .0516] }, 10: { 8: [.8573, 29.5979, .0602], 64: [.8567, 29.6908, .0593], 128: [.8605, 29.6505, .0605] } },
      2024: { 4: { 8: [.8917, 31.6805, .0416], 64: [.8925, 31.8170, .0409], 128: [.8945, 31.8295, .0407] }, 8: { 8: [.8484, 29.5407, .0707], 64: [.8509, 29.8524, .0640], 128: [.8543, 29.9158, .0636] }, 10: { 8: [.8387, 29.1110, .0758], 64: [.8434, 29.3223, .0710], 128: [.8459, 29.3922, .0709] } },
    },
  },
  clip: {
    label: 'CLIP', params: { 8: 34.1, 64: 37.2, 128: 40.8 },
    best: { 2023: { 4: 128, 8: 128, 10: 64 }, 2024: { 4: 128, 8: 64, 10: 64 } },
    v: {
      2023: { 4: { 8: [.9020, 32.0410, .0351], 64: [.9009, 32.0592, .0344], 128: [.9013, 32.1458, .0340] }, 8: { 8: [.8699, 30.5080, .0498], 64: [.8703, 30.2384, .0530], 128: [.8710, 30.4831, .0492] }, 10: { 8: [.8620, 29.8363, .0558], 64: [.8629, 29.9360, .0549], 128: [.8619, 29.8862, .0548] } },
      2024: { 4: { 8: [.8967, 31.9873, .0394], 64: [.8992, 32.1980, .0374], 128: [.9003, 32.2644, .0377] }, 8: { 8: [.8571, 29.9309, .0645], 64: [.8591, 30.2022, .0585], 128: [.8592, 30.0607, .0613] }, 10: { 8: [.8478, 29.3569, .0712], 64: [.8500, 29.5561, .0675], 128: [.8506, 29.4911, .0695] } },
    },
  },
  dino: {
    label: 'DINOv2', params: { 8: 34.1, 64: 37.2, 128: 40.8 },
    best: { 2023: { 4: 128, 8: 128, 10: 64 }, 2024: { 4: 128, 8: 128, 10: 128 } },
    v: {
      2023: { 4: { 8: [.9050, 32.4577, .0316], 64: [.9058, 32.2943, .0324], 128: [.9061, 32.4175, .0319] }, 8: { 8: [.8768, 30.3741, .0524], 64: [.8758, 30.7677, .0452], 128: [.8776, 30.9313, .0441] }, 10: { 8: [.8643, 30.0642, .0535], 64: [.8649, 30.1798, .0511], 128: [.8667, 29.8821, .0586] } },
      2024: { 4: { 8: [.9023, 32.2638, .0365], 64: [.9025, 32.2664, .0379], 128: [.9054, 32.5112, .0353] }, 8: { 8: [.8628, 30.0431, .0623], 64: [.8636, 30.0201, .0632], 128: [.8663, 30.5859, .0543] }, 10: { 8: [.8533, 29.7096, .0651], 64: [.8544, 29.9021, .0622], 128: [.8571, 29.8925, .0635] } },
    },
  },
};
let rankBackbone = 'biomed', rankDataset = '2023', rankAcc = 4, rankIndex = 0;

function updateRank() {
  const backbone = RANK_DATA[rankBackbone];
  const rank = RANKS[rankIndex];
  const row = backbone.v[rankDataset][rankAcc][rank];
  const selected = backbone.best[rankDataset][rankAcc];
  document.getElementById('rank-value').textContent = String(rank) + (rank === selected ? '（论文选定）' : '');
  document.getElementById('rank-params').textContent = backbone.params[rank].toFixed(1) + 'M';
  document.getElementById('rank-ssim').textContent = row[0].toFixed(4);
  document.getElementById('rank-psnr').textContent = row[1].toFixed(4) + ' dB';
  document.getElementById('rank-nmse').textContent = row[2].toFixed(4);
  const spread = RANKS.map(r => backbone.v[rankDataset][rankAcc][r][0]);
  const spreadText = (Math.max(...spread) - Math.min(...spread)).toFixed(4);
  const extra = rank === selected
    ? '这正是论文在 ' + backbone.label + ' · CMRxRecon' + rankDataset + ' · ' + rankAcc + '× 下选用的 rank。'
    : '论文在该配置下选的是 r = ' + selected + '。';
  document.getElementById('rank-lesson').textContent = backbone.label + ' · CMRxRecon' + rankDataset + ' · ' + rankAcc + '×：' + extra
    + ' 从 r=8 到 r=128，可训练参数从 ' + backbone.params[8].toFixed(1) + 'M 增到 ' + backbone.params[128].toFixed(1) + 'M（多 ' + (backbone.params[128] - backbone.params[8]).toFixed(1) + 'M），'
    + '而该配置三个 rank 之间的 SSIM 全距只有 ' + spreadText + ' —— 容量买到的改善在这个尺度上，论文没有报告运行方差，所以不要把千分位的胜负当作定论。';
}
document.querySelectorAll('[data-backbone]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-backbone]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  rankBackbone = button.dataset.backbone; updateRank();
}));
document.querySelectorAll('[data-rds]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-rds]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  rankDataset = button.dataset.rds; updateRank();
}));
document.querySelectorAll('[data-acc]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-acc]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  rankAcc = Number(button.dataset.acc); updateRank();
}));
document.getElementById('rank-slider').addEventListener('input', event => { rankIndex = Number(event.target.value); updateRank(); });
updateRank();

/* ---------- 复现清单（官方仓库核查结果与公开资产） ---------- */
const excerpts = {
  status: [
    '仓库：https://github.com/Hashmi360/BeyondScratch-CMR\n'
      + '核查日期：2026-10-13\n'
      + '可见性：public\n'
      + '提交次数：2\n'
      + 'star / fork / watcher：0 / 0 / 0\n'
      + 'main 分支内容：README.md（仅此一个文件）\n'
      + 'README 正文：Official implementation of "Beyond Training from Scratch:\n'
      + '  Foundation Models for Data-Efficient and Generalizable Cardiac MRI\n'
      + '  Reconstruction," accepted at the ECCVW 2026.\n'
      + '\n'
      + '结论：没有训练脚本、没有配置、没有权重、没有数据处理代码。\n'
      + '     论文摘要末句虽有 "Code is publicly available at" 的表述，\n'
      + '     但本页把该仓库记为占位仓库，不能当作可用实现。\n'
      + '     复现路径只能是从论文正文自实现。',
    '这是本页唯一一条“打开仓库核对”得到的事实，不是推断。论文摘要原文就写着代码公开，所以这里的落差值得写进你的复现记录里：引用该仓库时不要说“基于官方实现”。',
  ],
  data: [
    'CMRxRecon 挑战主页（数据集公开入口）：\n'
      + '  https://cmrxrecon.github.io/\n'
      + '\n'
      + '论文用到的两个数据集：\n'
      + '  CMRxRecon2023  arXiv:2309.10836（论文参考文献 [37]）\n'
      + '    120 例全采样训练病例，3T 扫描仪；cine / T1 mapping / T2 mapping；\n'
      + '    短轴与 2、3、4 腔视图；论文按患者级 70/10/20 划分\n'
      + '    → 训练 2,940 / 验证 420 / 测试 852 个样本\n'
      + '  CMRxRecon2024  Radiology: Artificial Intelligence 7(2):e240443（论文参考文献 [40]）\n'
      + '    200 名健康志愿者，3T Siemens Vida；cine / aorta / T1 / T2 / tagging\n'
      + '    → 训练 12,537 / 验证 1,803 / 测试 3,597 个样本\n'
      + '\n'
      + '论文在两个数据集上都用 4× / 8× / 10× 三档加速。\n'
      + '注意：论文没有给出采样掩码类型，跨论文比较前必须先对齐这一项。',
    '数据规模直接决定复现成本：CMRxRecon2024 的训练样本量是 2023 的四倍多，而论文的“数据越多，LoRA 越划算”这条结论主要是在 2024 上观察到的。做小规模验证时，建议先用 CMRxRecon2023 走通流程。',
  ],
  encoder: [
    '三个主干都是 ViT-B，权重全部公开：\n'
      + '\n'
      + 'BiomedCLIP（生物医学图文预训练，论文称在 PMC-15M 上训练）\n'
      + '  https://huggingface.co/microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224\n'
      + 'CLIP（图文对比学习，OpenCLIP 提供便于加载的实现）\n'
      + '  https://github.com/mlfoundations/open_clip\n'
      + 'DINOv2（自监督，patch size 14 → 16×16 token 网格）\n'
      + '  https://github.com/facebookresearch/dinov2\n'
      + '\n'
      + '论文只说取图像编码器：丢弃 class token、保留 patch 表征、\n'
      + '融合所有 Transformer 层的潜状态（LayerNorm + 两层 GELU MLP）。\n'
      + '文本侧完全未提及使用方式 —— 说明没有用到文本塔。',
    '本页只给出这三个公开入口（均已打开确认可达），没有给出安装命令：论文与仓库都没有发布任何环境配置，写具体命令就等于替作者做未经核实的假设。',
  ],
  gap: [
    '论文没有写清、必须自己决定并记录的六件事：\n'
      + '\n'
      + '1. 采样掩码类型（1D 笛卡尔 / 随机 / 等距）与具体实现\n'
      + '   —— 论文只写 "acceleration factors of 4×, 8×, and 10×"\n'
      + '2. 全层融合的具体形状：如何把 (层数 × token) 压成 14×14 瓶颈，\n'
      + '   中间层取哪几层当跳连（只说 "intermediate hidden states"）\n'
      + '3. LoRA 的接法：是否使用合并 QKV 矩阵；γ 缩放系数的取值\n'
      + '4. DINOv2 的 16×16 → 14×14 双线性插值的具体实现\n'
      + '5. 数据侧：切分单位与模态/视图筛选规则（120 例如何变成 2,940 样本）\n'
      + '6. 随机性与方差：论文只报单次结果，而 LoRA 的收益常在\n'
      + '   小数点后第三位 —— 复现时至少跑两个种子\n'
      + '\n'
      + '训练配置（论文已给出）：PyTorch；输入经 iFFT + RSS 后归一化到 [0,1]，\n'
      + '裁/补到 224×224 并复制为 3 通道；最多 300 epoch、batch 8；\n'
      + 'AdamW（从头训练与 LoRA：lr 1e-4、wd 1e-2；冻结：lr 2e-4）；\n'
      + '验证损失 5 epoch 不降则 lr×0.5，15 epoch 无改善早停；\n'
      + '损失用 SSIM；取验证最优 checkpoint 在留出测试集上报 SSIM/PSNR/NMSE；\n'
      + '硬件为单张 RTX 4090，混合精度。',
    '把这六条当成你自己的实验设计自由度：每一条都影响数值，而且论文没给。公开记录这些选择，比声称“复现了论文数字”更有价值。',
  ],
};
function displayCode(key) {
  const [snippet, explanation] = excerpts[key];
  document.getElementById('code-snippet').textContent = snippet;
  document.getElementById('code-explanation').textContent = explanation;
  const link = document.getElementById('code-link');
  link.href = REPO; link.textContent = '官方仓库（2026-10-13 核查：仅 README） ↗';
}
document.querySelectorAll('[data-code]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-code]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  displayCode(button.dataset.code);
}));
displayCode('status');

/* ---------- 阅读笔记、进度条与目录高亮 ---------- */
const noteKey = 'paper-fm-cardiac-arxiv261008109-reading-note';
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
