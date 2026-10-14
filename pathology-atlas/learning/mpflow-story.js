'use strict';
// 本页所有交互都是解释性示意，或由论文原表数值重算，不是本站实验。
const REPO = 'https://github.com/edshkim98/MPFlow/blob/0c302f330a1801db678970a5ba8dc5dd96f72ccf/';

/* ---------- 05 采样四步 ---------- */
const steps = [
  ['先验给出速度', '整流流网络在当前状态 xₜ 和时刻 t 上输出速度场 v_θ(xₜ,t)。这一步是唯一的网络前向，也是一次 NFE。', 'flowmatching/guided_diffusion/gaussian_diffusion.py#L1232-L1236', 'gaussian_diffusion.py L1232–1236（前向取速度与洁净估计）'],
  ['投影回洁净图像', '用 x̂_{1|t} = xₜ − (1−t)·v_θ 把当前状态映回干净图像。后面两条梯度都作用在这个量上，而不是作用在噪声状态上。', 'flowmatching/guided_diffusion/gaussian_diffusion.py#L1137', 'gaussian_diffusion.py L1137（predict_xstart_from_velocity）'],
  ['朝测量修正', '对洁净估计做一次前向 F(x̂) 并求与 y 的差，取它对 xₜ 的梯度。这一项压内在幻觉：让重建在测量空间里贴合。', 'flowmatching/guided_diffusion/condition_methods.py#L317-L321', 'condition_methods.py L317–321（测量残差与梯度）'],
  ['朝辅助模态修正', '把 x̂ 与辅助 T1 各切成 32×32 patch，过 PAMRI 的 φ 与 ψ 取潜特征，最小化逐 patch 的均方误差。这一项压外在幻觉：把零空间里的内容锚到 T1 支持的解剖上。', 'flowmatching/guided_diffusion/condition_methods.py#L356-L393', 'condition_methods.py L356–393（patch 展开与潜特征 MSE）'],
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

/* ---------- 07 代码 Tab（片段逐字摘自指定提交） ---------- */
const codeTabs = {
  entry: ['推理入口：一条命令决定用整流流还是扩散采样器', 'README 给出的调用是 python image_sample.py --flow_matching True --steps 100 --model_path ...。注意这段快照里 multi_seed=False，也就是论文 Eq.9 的候选种子搜索在默认入口上是关掉的；configs_kspace.yaml 里才有 multimodal、skip_timestep、conditioning.method 这些开关。', 'flowmatching/image_sample.py#L153-L172',
`if args.flow_matching:
    sample = diffusion.flow_matching_sample_loop(
        model=model,
        measurement=y_n.to(torch.float32),
        measurement_cond_fn=measurement_cond_fn,
        multimodal=img_mm,
        operator=[operator, cond_config['params']],
        shape=(args.batch_size, 1, args.image_size, args.image_size),
        steps=args.steps,
        multi_seed=False,          # 这份快照里候选种子搜索是关的
        solver='euler',
    )`],
  loop: ['采样循环：Euler 求解 + 测量条件化', '时间轴是从 1 走到 0，dt = 1/steps。每一步先做无条件的 Euler 更新，再把噪声测量目标 (1−t_curr)·y + t_curr·noise 交给条件化函数，由它扣掉梯度。', 'flowmatching/guided_diffusion/gaussian_diffusion.py#L1189-L1190',
`timesteps = np.linspace(1.0, 0.0, steps + 1)
dt = 1.0 / steps
...
x_start = self.predict_xstart_from_velocity(x, t_01, v)
...
img_next = img - velocity * dt          # 无条件 Euler 步
if measurement_cond_fn is not None:
    noisy_target = (1 - t_curr) * measurement + t_curr * noise
    img_next, norm = measurement_cond_fn(
        x_t=img_next, measurement=measurement,
        noisy_measurement=noisy_target,
        x_prev=img, x_0_hat=pred_xstart, multimodal=multimodal, ...)`],
  guidance: ['PAMRI 引导：潜特征 MSE，以及两个正文没写的细节', 'x̂ 与辅助模态各自 unfold 成 32×32 patch，过同一个 ssl_model 拿到嵌入，逐患者求 MSE 后求和。加进总目标时系数写死为 0.5（论文写 λ_P = 0.1），随后梯度被硬截断在 ±0.1（论文正文未提这一步）。', 'flowmatching/guided_diffusion/condition_methods.py#L356-L397',
`if multimodal is not None:
    ps = 32
    x_0_hat_patches = x_0_hat.unfold(2, ps, ps).unfold(3, ps, ps).contiguous().view(-1, C, ph, pw)
    multimodal_patches = multimodal.unfold(2, ps, ps).unfold(3, ps, ps).contiguous().view(-1, 1, ps, ps)

    self.ssl_model.eval()                      # 冻结 BN
    (emb1, _), (emb2, _) = self.ssl_model(multimodal_patches.float(), flat_patches.float())
    diff = emb1 - emb2
    ssl_ls = torch.sum((diff ** 2).mean(dim=(1, 2)))   # 逐患者 MSE 再求和

norm_total = norm + 0.5 * ssl_ls               # 论文写 lambda_P = 0.1
norm_grad = torch.autograd.grad(outputs=norm_total, inputs=x_prev)[0]
norm_grad = torch.clamp(norm_grad, -0.1, 0.1)  # 正文未提的梯度截断`],
  seed: ['候选种子：挑选标准与 Eq.9 不完全一致', 'multi_seed 分支在第 PRUNE_STEP=5 步筛选，开 16 个候选，用纯测量距离 argmin。论文 Eq.9 写的是复合目标 Φ = ‖F(x)−y‖² + λ_P·L_P，也就是应该把跨模态项也算进挑选标准。这条分支里没有 L_P。', 'flowmatching/guided_diffusion/gaussian_diffusion.py#L1214-L1257',
`PRUNE_STEP = 5
...
if (multi_seed == True) and (i == PRUNE_STEP):
    operator_func, cond_config_params = operator
    with th.no_grad():
        diff = operator_func.forward(pred_xstart, **cond_config_params) - measurement
        dists = th.linalg.norm(diff.view(diff.shape[0], -1), dim=1)
    min_index = th.argmin(dists)        # 只按测量距离挑，未含 L_P
    img = img[min_index:min_index+1].repeat(target_batch, 1, 1, 1)
    noise = noise[min_index:min_index+1].repeat(target_batch, 1, 1, 1)`],
  ssl: ['PAMRI 预训练：自适应温度在这份快照里找不到', 'info_nce_multimodal 收一个标量温度，默认 0.1，MultiModalSSL 的每个分支都用同一个值。对 ssl_train.py 全文搜索 nmi、mutual、tau_min、tau_max、adaptive，命中数均为 0，也就是说论文 Eq.6 的 τ_{i,j} 自适应温度在这份快照里没有对应实现。', 'ssl_mri/ssl_train.py#L459-L518',
`def info_nce_multimodal(z_list, temperature=0.1):
    """Multi-view / multi-modal InfoNCE (SimCLR-style) loss."""
    n_views = len(z_list)
    features = torch.cat(z_list, dim=0)
    features = F.normalize(features, dim=1)
    similarity_matrix = torch.matmul(features, features.T)
    ...
    logits = logits / temperature      # 固定标量，未按 NMI 逐对自适应

# 全文搜索：nmi / NMI / mutual / tau_min / tau_max / adaptive -> 0 处命中`],
};
document.querySelectorAll('[data-code]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-code]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const [title, explanation, path, snippet] = codeTabs[button.dataset.code];
  document.getElementById('code-snippet').textContent = snippet;
  document.getElementById('code-explanation').textContent = explanation;
  const link = document.getElementById('code-link');
  link.href = REPO + path.split('#')[0];
  link.textContent = title + '：' + path + ' ↗';
}));
document.querySelector('[data-code="entry"]').click();

/* ---------- 06 Table 1：主结果条形图（论文原表数值） ---------- */
const TABLE1 = {
  hcp: {
    name: 'HCP · 超分 4×',
    rows: [
      ['DIP', '3K', 24, .7, .66, .03, .30, .03],
      ['DiffDeuR', '.5K', 23, 1.6, .78, .04, .23, .04],
      ['DPS', '.1K', 23, 1.4, .69, .16, .20, .08],
      ['DPS', '.5K', 24, 1.0, .79, .03, .15, .01],
      ['DynamicDPS', '.1K', 23, 1.8, .69, .18, .21, .09],
      ['DynamicDPS', '.5K', 24, .9, .79, .03, .15, .02],
      ['MPFlow', '.1K', 23, .9, .78, .03, .16, .02],
      ['MPFlow', '.5K', 25, .9, .82, .03, .14, .02],
    ],
  },
  brats: {
    name: 'BraTS · 加速 8×',
    rows: [
      ['DIP', '3K', 25, 2.4, .57, .10, .19, .01],
      ['DiffDeuR', '.5K', 30, 1.9, .88, .02, .12, .02],
      ['DPS', '.1K', 23, 5.8, .65, .27, .23, .12],
      ['DPS', '.5K', 25, 2.4, .89, .01, .09, .02],
      ['DynamicDPS', '.1K', 24, 5.6, .68, .16, .22, .12],
      ['DynamicDPS', '.5K', 31, 1.9, .89, .02, .09, .02],
      ['MPFlow', '.1K', 31, 1.8, .90, .02, .08, .01],
      ['MPFlow', '.5K', 31, .9, .91, .02, .07, .01],
    ],
  },
};
const T1_METRIC = {
  psnr: { mean: 2, sd: 3, min: { hcp: 20, brats: 20 }, max: { hcp: 26, brats: 33 }, axis: 'PSNR ↑ / dB' },
  ssim: { mean: 4, sd: 5, min: { hcp: 0.5, brats: 0.5 }, max: { hcp: 1, brats: 1 }, axis: 'SSIM ↑' },
  lpips: { mean: 6, sd: 7, min: { hcp: 0, brats: 0 }, max: { hcp: 0.35, brats: 0.25 }, axis: 'LPIPS ↓（越低越好）' },
};
let t1Dataset = 'hcp', t1Metric = 'psnr';
function drawTable1() {
  const key = t1Dataset;
  const rows = TABLE1[key].rows, m = T1_METRIC[t1Metric];
  const holder = document.getElementById('table1-bars');
  holder.replaceChildren();
  let best = 0;
  rows.forEach((r, i) => {
    const v = r[m.mean];
    const better = t1Metric === 'lpips' ? v < rows[best][m.mean] : v > rows[best][m.mean];
    if (better) best = i;
  });
  const lo = m.min[key], hi = m.max[key];
  rows.forEach((r, i) => {
    const value = r[m.mean], sd = r[m.sd];
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.textContent = r[0] + ' · T=' + r[1];
    const track = document.createElement('div');
    track.className = 'bar-track';
    const bar = document.createElement('div');
    bar.className = 'bar-fill' + (i === best ? ' best' : '');
    bar.style.width = Math.max(0, Math.min(100, (value - lo) / (hi - lo) * 100)) + '%';
    track.append(bar);
    const out = document.createElement('span');
    out.className = 'bar-value';
    out.textContent = (t1Metric === 'psnr' ? value.toFixed(0) : value.toFixed(2)) + ' ± ' + sd.toFixed(2);
    row.append(label, track, out);
    holder.append(row);
  });
  document.getElementById('chart-axis').textContent = m.axis + ' · ' + TABLE1[key].name + ' · 条形以 ' + lo + ' 起、' + hi + ' 止；高亮为该列最优';
}
document.querySelectorAll('[data-datasets] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-datasets] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  t1Dataset = b.dataset.dataset;
  drawTable1();
}));
document.querySelectorAll('[data-metrics] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-metrics] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  t1Metric = b.dataset.metric;
  drawTable1();
}));
drawTable1();

/* ---------- 06 Table 2：幻觉与消融 ---------- */
const ABLATION = {
  'hcp-shafe': { label: ['DPS', 'DynamicDPS', 'MPFlow Base', 'MPFlow +PAMRI', 'MPFlow +Noise', 'MPFlow Full'], values: [0.278, 0.274, 0.233, 0.171, 0.204, 0.170], best: 'min', axis: 'HCP · SHAFE ↓（越低越少幻觉）', scale: [0.15, 0.30] },
  'hcp-meas': { label: ['DPS', 'DynamicDPS', 'MPFlow Base', 'MPFlow +PAMRI', 'MPFlow +Noise', 'MPFlow Full'], values: [3.84, 3.44, 6.84, 1.43, 1.25, 1.30], best: 'min', axis: 'HCP · 测量空间误差 ×10⁻³ ↓', scale: [0, 7] },
  'brats-dice': { label: ['DPS', 'DynamicDPS', 'MPFlow Base', 'MPFlow +PAMRI', 'MPFlow +Noise', 'MPFlow Full'], values: [0.618, 0.639, 0.704, 0.741, 0.735, 0.743], best: 'max', axis: 'BraTS · 肿瘤分割 Dice ↑（越高越保真）', scale: [0.55, 0.80] },
  'brats-meas': { label: ['DPS', 'DynamicDPS', 'MPFlow Base', 'MPFlow +PAMRI', 'MPFlow +Noise', 'MPFlow Full'], values: [42.0, 45.1, 4.36, 2.45, 0.49, 0.489], best: 'min', axis: 'BraTS · 测量空间误差 ×10⁻³ ↓', scale: [0, 46] },
};
let hallKey = 'hcp-shafe';
function drawTable2() {
  const cfg = ABLATION[hallKey];
  const holder = document.getElementById('table2-bars');
  holder.replaceChildren();
  const bestIndex = cfg.values.indexOf(cfg.best === 'min' ? Math.min(...cfg.values) : Math.max(...cfg.values));
  cfg.label.forEach((name, i) => {
    const value = cfg.values[i];
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('span');
    label.textContent = name;
    const track = document.createElement('div');
    track.className = 'bar-track';
    const bar = document.createElement('div');
    bar.className = 'bar-fill' + (i === bestIndex ? ' best' : '');
    bar.style.width = Math.max(0, Math.min(100, (value - cfg.scale[0]) / (cfg.scale[1] - cfg.scale[0]) * 100)) + '%';
    track.append(bar);
    const out = document.createElement('span');
    out.className = 'bar-value';
    out.textContent = hallKey === 'brats-dice' ? value.toFixed(3) : value.toFixed(value < 1 ? 3 : 2);
    row.append(label, track, out);
    holder.append(row);
  });
  document.getElementById('hall-axis').textContent = cfg.axis + ' · T=100';
}
document.querySelectorAll('[data-hall] .pill').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-hall] .pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  hallKey = b.dataset.hallkey;
  drawTable2();
}));
drawTable2();

/* ---------- 02 熵示意 ---------- */
const entropyCanvas = document.getElementById('entropy-canvas');
function drawEntropy() {
  const overlap = Number(document.getElementById('overlap-slider').value) / 100;
  document.getElementById('overlap-value').textContent = Math.round(overlap * 100) + '%';
  document.getElementById('info-value').textContent = overlap.toFixed(2);
  document.getElementById('entropy-value').textContent = (1 - overlap).toFixed(2);
  const ctx = entropyCanvas.getContext('2d');
  const W = entropyCanvas.width, H = entropyCanvas.height;
  ctx.clearRect(0, 0, W, H);
  const x0 = 96, x1 = W - 70, yTop = 48, yBot = H - 58;
  const curveY = t => yTop + t * (yBot - yTop);   // t = 重叠程度；曲线从 1 降到 0
  ctx.font = '12px Segoe UI, Microsoft YaHei, sans-serif';
  // 坐标轴
  ctx.strokeStyle = '#c9d1cc'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, yTop); ctx.lineTo(x0, yBot); ctx.lineTo(x1, yBot); ctx.stroke();
  ctx.fillStyle = '#687672';
  ctx.fillText('1 · 只有测量时的 H(x | y)', x0 - 86, yTop - 12);
  ctx.fillText('0', x0 - 18, yBot + 4);
  ctx.fillText('重叠程度（示意代理量）→', x0, H - 14);
  ctx.fillText('1', x1 - 4, H - 14);
  // 被辅助模态解释掉的部分
  const px = x0 + overlap * (x1 - x0), py = curveY(overlap);
  ctx.fillStyle = 'rgba(11,117,100,.16)';
  ctx.fillRect(x0, yTop, px - x0, py - yTop);
  // 剩余不确定性曲线（= 1 − 条件互信息，示意）
  ctx.strokeStyle = '#c46a44'; ctx.lineWidth = 2.5; ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120, x = x0 + t * (x1 - x0);
    if (i === 0) ctx.moveTo(x, curveY(t)); else ctx.lineTo(x, curveY(t));
  }
  ctx.stroke();
  ctx.fillStyle = '#0b7564';
  ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillText('剩余不确定性 ' + (1 - overlap).toFixed(2), Math.min(px + 12, x1 - 140), py + (overlap > 0.85 ? -14 : 18));
  ctx.fillText('辅助模态解释掉 ' + overlap.toFixed(2), x0 + 12, yTop + 18);
  ctx.fillStyle = '#687672';
  ctx.fillText('H(x | y, x_aux) = H(x | y) − I(x; x_aux | y)：阴影是 I，曲线高度是 H', x0, H - 34);
}
document.getElementById('overlap-slider').addEventListener('input', drawEntropy);
drawEntropy();

/* ---------- 03 轨迹离散误差 ---------- */
const trajCanvas = document.getElementById('trajectory-canvas');
function drawTrajectory() {
  const n = Number(document.getElementById('step-slider').value);
  document.getElementById('step-value').textContent = n;
  const ctx = trajCanvas.getContext('2d');
  const W = trajCanvas.width, H = trajCanvas.height;
  ctx.clearRect(0, 0, W, H);
  const padL = 74, padR = 48, padTop = 34, padBottom = 52;
  const x0 = padL, x1 = W - padR;
  const yNoise = H - padBottom, yData = padTop;   // 两种轨迹端点相同：左下噪声 → 右上数据
  const spanY = yNoise - yData;
  const amp = spanY * 0.58;
  const straight = t => ({ x: x0 + t * (x1 - x0), y: yNoise - t * spanY });
  const curved = t => ({ x: x0 + t * (x1 - x0), y: yNoise - t * spanY - amp * Math.sin(Math.PI * t) });
  const FONT = '12px Segoe UI, Microsoft YaHei, sans-serif';

  // 画布框 + 时间刻度
  ctx.strokeStyle = '#e3e8e2'; ctx.lineWidth = 1;
  ctx.strokeRect(x0, yData, x1 - x0, yNoise - yData);
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(x0 + (x1 - x0) / 2, yData); ctx.lineTo(x0 + (x1 - x0) / 2, yNoise); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#9aa8a3'; ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
  ctx.fillText('t = 0  噪声 z', x0, yNoise + 20);
  ctx.fillText('t = 0.5', x0 + (x1 - x0) / 2 - 18, yNoise + 20);
  ctx.fillText('t = 1  数据 x₁', x1 - 74, yNoise + 20);

  // 两条连续轨迹
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#0b7564';
  ctx.beginPath(); ctx.moveTo(x0, yNoise); ctx.lineTo(x1, yData); ctx.stroke();
  ctx.strokeStyle = '#c46a44'; ctx.beginPath();
  for (let i = 0; i <= 240; i += 1) { const p = curved(i / 240); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
  ctx.stroke();

  // 步进折线（Euler）与采样点：整流流恒与直线重合，弯曲轨迹在步子大时明显偏离
  let maxStraight = 0, maxCurve = 0;
  let cPrev = curved(0);
  ctx.strokeStyle = 'rgba(196,106,68,.9)'; ctx.lineWidth = 1.6;
  for (let i = 1; i <= n; i += 1) {
    const t = i / n;
    const sPrevT = straight((i - 1) / n), sNext = straight(t);
    const mid = curved((i - 0.5) / n), cNext = curved(t);
    const chord = Math.hypot(cNext.x - cPrev.x, cNext.y - cPrev.y) || 1;
    maxCurve = Math.max(maxCurve, Math.abs((mid.x - cPrev.x) * (cNext.y - cPrev.y) - (mid.y - cPrev.y) * (cNext.x - cPrev.x)) / chord);
    const sMid = straight((i - 0.5) / n);
    const sChord = Math.hypot(sNext.x - sPrevT.x, sNext.y - sPrevT.y) || 1;
    maxStraight = Math.max(maxStraight, Math.abs((sMid.x - sPrevT.x) * (sNext.y - sPrevT.y) - (sMid.y - sPrevT.y) * (sNext.x - sPrevT.x)) / sChord);
    ctx.beginPath(); ctx.moveTo(cPrev.x, cPrev.y); ctx.lineTo(cNext.x, cNext.y); ctx.stroke();
    cPrev = cNext;
  }
  // 采样点：步数越少，点越稀
  for (let i = 0; i <= n; i += 1) {
    const t = i / n, s = straight(t), c = curved(t);
    ctx.fillStyle = '#0b7564'; ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c46a44'; ctx.beginPath(); ctx.arc(c.x, c.y, 3, 0, Math.PI * 2); ctx.fill();
  }

  // 图例
  ctx.font = FONT;
  ctx.strokeStyle = '#0b7564'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x0 + 10, yData + 16); ctx.lineTo(x0 + 40, yData + 16); ctx.stroke();
  ctx.fillStyle = '#0b7564'; ctx.fillText('整流流：直线轨迹 ≈ 折线', x0 + 48, yData + 20);
  ctx.strokeStyle = '#c46a44';
  ctx.beginPath(); ctx.moveTo(x0 + 10, yData + 38); ctx.lineTo(x0 + 40, yData + 38); ctx.stroke();
  ctx.fillStyle = '#c46a44'; ctx.fillText('扩散式：弯曲轨迹，折线是它的 Euler 近似', x0 + 48, yData + 42);

  const rel = v => (v / Math.hypot(x1 - x0, spanY) * 100).toFixed(2);
  document.getElementById('flow-error').textContent = rel(maxStraight) + '%';
  document.getElementById('curve-error').textContent = rel(maxCurve) + '%';
}
document.getElementById('step-slider').addEventListener('input', drawTrajectory);
drawTrajectory();

/* ---------- 04 自适应温度曲线 ---------- */
const tauCanvas = document.getElementById('tau-canvas');
function drawTau() {
  const tmin = Number(document.getElementById('taumin-slider').value) / 100;
  const tmax = Number(document.getElementById('taumax-slider').value) / 100;
  document.getElementById('taumin-value').textContent = tmin.toFixed(2);
  document.getElementById('taumax-value').textContent = tmax.toFixed(2);
  const ctx = tauCanvas.getContext('2d');
  const W = tauCanvas.width, H = tauCanvas.height;
  ctx.clearRect(0, 0, W, H);
  const padL = 120, padR = 44, padT = 52, padB = 42;
  const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
  const top = Math.max(0.2, Math.max(tmin, tmax) * 1.15);
  const yOf = v => y0 - (v / top) * (y0 - y1);
  ctx.strokeStyle = '#c9d1cc'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.fillStyle = '#687672'; ctx.font = '12px Segoe UI, Microsoft YaHei, sans-serif';
  ctx.fillText('τ', x0 - 108, y1 + 4);
  ctx.fillText('NMI = 0（两 patch 本就不像）', x0 - 10, H - 12);
  ctx.fillText('NMI = 1（高度一致）', x1 - 128, H - 12);
  ctx.textAlign = 'right';
  ctx.fillText('τ_max = ' + tmax.toFixed(2), x0 - 14, yOf(tmax) + 4);
  ctx.fillText('τ_min = ' + tmin.toFixed(2), x0 - 14, yOf(tmin) + 4);
  ctx.textAlign = 'start';
  ctx.strokeStyle = 'rgba(11,117,100,.35)'; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(x0, yOf(tmax)); ctx.lineTo(x1, yOf(tmax)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0, yOf(tmin)); ctx.lineTo(x1, yOf(tmin)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = '#0b7564'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 100; i += 2) {
    const nmi = i / 100;
    const tau = tmin + (tmax - tmin) * (1 - nmi);
    const x = x0 + nmi * (x1 - x0);
    if (i === 0) ctx.moveTo(x, yOf(tau)); else ctx.lineTo(x, yOf(tau));
  }
  ctx.stroke();
  ctx.fillStyle = '#172b2a';
  ctx.beginPath(); ctx.arc(x0, yOf(tmax), 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x1, yOf(tmin), 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#687672';
  ctx.fillText('NMI 低 → 温度高 → 对比惩罚放松 → 保住模态特有的结构细节', x0, 20);
}
document.getElementById('taumin-slider').addEventListener('input', drawTau);
document.getElementById('taumax-slider').addEventListener('input', drawTau);
drawTau();

/* ---------- 05 NFE 账单 ---------- */
const nfeCanvas = document.getElementById('nfe-canvas');
function drawNfe() {
  const S = Number(document.getElementById('seed-slider').value);
  const frac = Number(document.getElementById('tnoise-slider').value) / 100;
  document.getElementById('seed-value').textContent = S;
  document.getElementById('tnoise-value').textContent = frac.toFixed(2);
  const T = 100;
  const warm = Math.round(S * frac * T);
  const main = Math.round((1 - frac) * T);
  const total = warm + main;
  document.getElementById('nfe-total').textContent = total;
  document.getElementById('nfe-ratio').textContent = (total / T).toFixed(2) + '×';
  const ctx = nfeCanvas.getContext('2d');
  const W = nfeCanvas.width, H = nfeCanvas.height;
  ctx.clearRect(0, 0, W, H);
  const padL = 268, padR = 96;
  const x0 = padL, x1 = W - padR;
  const maxTotal = Math.max(total, T) * 1.08;
  const barH = 34;
  const drawRow = (y, name, segments) => {
    ctx.fillStyle = '#687672'; ctx.font = '12px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(name, x0 - 16, y + barH / 2 + 4);
    ctx.textAlign = 'start';
    let cursor = x0;
    segments.forEach(([value, color, label]) => {
      const w = (value / maxTotal) * (x1 - x0);
      ctx.fillStyle = color;
      ctx.fillRect(cursor, y, w, barH);
      if (w > 44) {
        ctx.fillStyle = '#fff'; ctx.font = '11px Segoe UI, Microsoft YaHei, sans-serif';
        ctx.fillText(label, cursor + 6, y + barH / 2 + 4);
      }
      cursor += w;
    });
    ctx.fillStyle = '#172b2a'; ctx.font = '12px Segoe UI, Microsoft YaHei, sans-serif';
    ctx.fillText(segments.reduce((a, [v]) => a + v, 0).toFixed(0) + ' NFE', cursor + 8, y + barH / 2 + 4);
  };
  drawRow(30, '标称 T=100（论文 Table 1 报的）', [[T, '#9cbaaf', 'T']]);
  drawRow(96, '真正的等效成本', [[warm, '#c46a44', 'S × t_noise·T = ' + warm], [main, '#0b7564', '剩余 ' + main]]);
  ctx.fillStyle = '#687672'; ctx.font = '12px Segoe UI, Microsoft YaHei, sans-serif';
  ctx.fillText('相对标称预算 ' + (total / T).toFixed(2) + '×（S = ' + S + '，t_noise/T = ' + frac.toFixed(2) + '）', x0, H - 12);
}
document.getElementById('seed-slider').addEventListener('input', drawNfe);
document.getElementById('tnoise-slider').addEventListener('input', drawNfe);
drawNfe();

/* ---------- 阅读笔记 / 进度条 / 侧栏高亮 ---------- */
const noteKey = 'paper-mpflow-miccai2026-reading-note';
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
