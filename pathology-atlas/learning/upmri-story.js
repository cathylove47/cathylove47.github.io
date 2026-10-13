'use strict';
// 本页所有交互只做两件事：把论文 Table I / Table II 的原表数值画出来，以及把论文给出的算法定义显示出来。
// 没有任何数字来自本站运行模型；页面没有复现任何实验，也没有调用外部网络。

const series = {
  brain4p: { axis:'PSNR · 条形以 0 dB 为起点；精确值见标签', unit:'dB', max:50, digits:2, rows:[
    ['Zero-Filled', 28.28], ['MoDL（有监督）', 39.71], ['DDNM+（有监督）', 40.00], ['OT-ODE（有监督）', 33.95], ['PnP-Flow（有监督）', 37.92],
    ['SSDU（自监督）', 28.13], ['W-SSDU（自监督）', 36.09], ['R-SSDU（自监督）', 36.23],
    ['REI（无监督）', 21.59], ['MOI（无监督）', 30.97], ['ENSURE（无监督）', 32.75], ['GTF²M（无监督）', 33.99], ['UPMRI（无监督）', 42.19]
  ]},
  brain8p: { axis:'PSNR · 条形以 0 dB 为起点；精确值见标签', unit:'dB', max:50, digits:2, rows:[
    ['Zero-Filled', 24.44], ['MoDL（有监督）', 32.32], ['DDNM+（有监督）', 35.24], ['OT-ODE（有监督）', 28.86], ['PnP-Flow（有监督）', 32.85],
    ['SSDU（自监督）', 26.61], ['W-SSDU（自监督）', 29.72], ['R-SSDU（自监督）', 29.27],
    ['REI（无监督）', 21.62], ['MOI（无监督）', 25.16], ['ENSURE（无监督）', 27.12], ['GTF²M（无监督）', 28.40], ['UPMRI（无监督）', 35.08]
  ]},
  card4p: { axis:'PSNR · 条形以 0 dB 为起点；精确值见标签', unit:'dB', max:56, digits:2, rows:[
    ['Zero-Filled', 27.01], ['MoDL（有监督）', 41.79], ['DDNM+（有监督）', 44.93], ['OT-ODE（有监督）', 35.65], ['PnP-Flow（有监督）', 39.77],
    ['SSDU（自监督）', 32.64], ['W-SSDU（自监督）', 32.11], ['R-SSDU（自监督）', 33.93],
    ['REI（无监督）', 23.65], ['MOI（无监督）', 40.13], ['ENSURE（无监督）', 34.57], ['GTF²M（无监督）', 33.67], ['UPMRI（无监督）', 52.39]
  ]},
  card8p: { axis:'PSNR · 条形以 0 dB 为起点；精确值见标签', unit:'dB', max:56, digits:2, rows:[
    ['Zero-Filled', 26.11], ['MoDL（有监督）', 36.36], ['DDNM+（有监督）', 39.60], ['OT-ODE（有监督）', 32.08], ['PnP-Flow（有监督）', 35.13],
    ['SSDU（自监督）', 29.23], ['W-SSDU（自监督）', 29.82], ['R-SSDU（自监督）', 31.10],
    ['REI（无监督）', 26.62], ['MOI（无监督）', 31.47], ['ENSURE（无监督）', 30.27], ['GTF²M（无监督）', 31.33], ['UPMRI（无监督）', 40.50]
  ]},
  card4s: { axis:'SSIM · 条形以 0 为起点，最大刻度为 1', unit:'', max:1, digits:3, rows:[
    ['Zero-Filled', 0.769], ['MoDL（有监督）', 0.979], ['DDNM+（有监督）', 0.977], ['OT-ODE（有监督）', 0.922], ['PnP-Flow（有监督）', 0.963],
    ['SSDU（自监督）', 0.888], ['W-SSDU（自监督）', 0.872], ['R-SSDU（自监督）', 0.912],
    ['REI（无监督）', 0.736], ['MOI（无监督）', 0.971], ['ENSURE（无监督）', 0.918], ['GTF²M（无监督）', 0.918], ['UPMRI（无监督）', 0.994]
  ]},
  time: { axis:'单张 CMRxRecon 图像的推理耗时（ms，NVIDIA A5000）· 条形以 0 为起点', unit:'ms', max:1800, digits:0, rows:[
    ['MoDL（有监督）', 58], ['DDNM+（有监督）', 1000], ['OT-ODE（有监督）', 1750], ['PnP-Flow（有监督）', 938],
    ['SSDU（自监督）', 19], ['Weighted SSDU（自监督）', 19], ['Robust SSDU（自监督）', 19],
    ['REI（无监督）', 19], ['MOI（无监督）', 58], ['ENSURE（无监督）', 58], ['GTF²M（无监督）', 1563], ['UPMRI（无监督）', 500]
  ]}
};
function drawBars(view) {
  const conf = series[view];
  const holder = document.getElementById('metric-bars');
  holder.replaceChildren();
  conf.rows.forEach(([name, value]) => {
    const row = document.createElement('div'); row.className = 'bar-row';
    const label = document.createElement('span'); label.textContent = name;
    const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div'); bar.className = 'bar-fill' + (name.startsWith('UPMRI') ? ' best' : '');
    bar.style.width = Math.min(100, value / conf.max * 100) + '%'; track.append(bar);
    const out = document.createElement('span'); out.className = 'bar-value';
    out.textContent = value.toFixed(conf.digits) + (conf.unit ? ' ' + conf.unit : '');
    row.append(label, track, out); holder.append(row);
  });
  document.getElementById('chart-axis').textContent = conf.axis;
}
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  drawBars(button.dataset.view);
}));
drawBars('brain4p');

const objectives = {
  sup: {
    title:'有监督 CFM（Eq.6）', need:'是', computable:'能',
    body:'目标直接在 X 空间比较网络输出与条件速度场 uₜˣ(x|zˣ)=aₜ\'x₀+bₜ\'x₁。它要求每一张训练图像都有全采样真值，因此训练集必须是大规模全采样 MRI 数据集——正是论文要绕开的临床瓶颈。',
    key:'关键：一个投影都不加，因为每一项都“看得见”。代价是必须拿到 x₀。'
  },
  pcfm: {
    title:'PCFM 投影目标（Eq.8）', need:'是', computable:'否',
    body:'把回归误差先用 Pₛ=Aₛ⁺Aₛ 投影，只要求网络在掩膜看得见的方向上与条件速度场对齐。这一步不需要真值就能界定“监督发生在哪里”，但蒙特卡洛采样 q(zˣ) 时仍然要用 x₀，所以目标本身还是算不出来。',
    key:'关键：投影解决了“监督谁”，还没有解决“真值从哪来”。'
  },
  gsure: {
    title:'GSURE 无监督化（Eq.13–15）', need:'否', computable:'能',
    body:'把未知的 x₀ 换成测量驱动的极大似然解 û_MLˣ，并补上一项散度修正 2aₜaₜ\'σ₀²∇·(Pₛv_θˣ)；散度用 Hutchinson 迹估计（噪声 b~CN(0,Pₛ)）来算。此时目标里只剩欠采样测量 y₀、掩码 Mₛ、敏感度图（进 Aₛ）与网络本身，训练可以真的跑起来。',
    key:'关键：替换 + 补偿成对出现，才是无偏估计；漏掉散度项就不是。'
  }
};
function showObjective(key) {
  const o = objectives[key];
  document.getElementById('obj-title').textContent = o.title;
  document.getElementById('obj-body').textContent = o.body;
  document.getElementById('obj-key').textContent = o.key;
  document.getElementById('obj-need-x0').textContent = o.need;
  document.getElementById('obj-computable').textContent = o.computable;
}
document.querySelectorAll('[data-obj]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-obj]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  showObjective(button.dataset.obj);
}));
showObjective('sup');

const steps = [
  ['测量空间前向积分（Algorithm 1 第 1–2 行）', '从观测 y(0):=y₀ 出发，按 t=0,…,(T−1)/T 逐步加 (1/T)uₜʸ(y)，其中 uₜʸ 由 Proposition 3（Eq.21/22）用 PCFM 最优解写出。T=10 步之后得到 y(1)，即“测量空间中的噪声端点” y₁。每一步 y 都在变，都要调用一次网络，因此这一段是前 10 次 NFE。', '论文 Algorithm 1 第 1–2 行；Prop. 3 / Eq.21–23'],
  ['t=1 处的后验采样（Algorithm 1 第 3 行）', '由 Lemma 4（Eq.24–25），p(x₁|y₁)=CN(A⁺y₁, 2(I−A⁺A))，于是采样 x₁=A⁺y₁+(I−A⁺A)z₁，z₁~CN(0,2I_D)。确定的 A⁺y₁ 来自测量，随机的 (I−A⁺A)z₁ 落在零空间里、来自先验。重建的随机性就来自这里。', '论文 Algorithm 1 第 3 行；Lemma 4 / Eq.25'],
  ['图像空间反向积分（Algorithm 1 第 4–6 行）', '反向从 t=(T−1)/T 走到 0，每步先用插值路径更新测量 y ← y(t+1/T) = a_t y₀ + b_t y₁，再按 dx/dt = v*^X(y(t),t) 用 (1/T)v*^X 更新 x。这一段是后 10 次 NFE，与前向段共同构成 Table I 里的 20 NFE。', '论文 Algorithm 1 第 4–6 行；Eq.26'],
  ['数据一致性校正（Algorithm 1 第 7 行）', '每个反向步之后做 x ← x − A⁺(Ax − y(t))（Eq.28），A⁺ 同样由 CG 近似。Proposition 4 说明 σ₀→0 时 Ax(t)=y(t) 本应自动成立，这一步是为了补上离散化误差——也就是说，测量在每个时间点都会把先验往回拉一点。', '论文 Algorithm 1 第 7 行；Prop. 4 / Eq.27–28']
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  document.getElementById('step-source').textContent = step[2];
}));

const slider = document.getElementById('t-slider');
function updatePath() {
  const t = Number(slider.value);
  const at = 1 - t, bt = t;
  document.getElementById('t-value').textContent = 't = ' + t.toFixed(2);
  document.getElementById('t-at').textContent = at.toFixed(2);
  document.getElementById('t-bt').textContent = bt.toFixed(2);
  document.getElementById('mix-y0').style.width = (at * 100) + '%';
  document.getElementById('mix-y1').style.width = (bt * 100) + '%';
  let phase;
  if (t < 0.001) phase = '观测起点 y(0) = y₀';
  else if (t > 0.999) phase = '噪声端点 y(1) = y₁（此处做后验采样）';
  else phase = '插值区间：前向段生成 y₁，反向段生成 x₀';
  document.getElementById('t-phase').textContent = phase;
}
slider.addEventListener('input', updatePath);
updatePath();

const noteKey = 'paper-upmri-arxiv-2512-17493-reading-note';
const noteInput = document.getElementById('reading-note'), savedNote = document.getElementById('saved-note');
try { noteInput.value = localStorage.getItem(noteKey) || ''; } catch (e) { noteInput.value = ''; }
document.getElementById('note-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    localStorage.setItem(noteKey, noteInput.value);
    savedNote.textContent = noteInput.value ? '已保存到当前浏览器。\n' + noteInput.value : '空笔记已保存。';
  } catch (e) {
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
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  }
}, { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
