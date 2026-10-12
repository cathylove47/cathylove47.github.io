'use strict';
// All interactive visuals below are explanatory demonstrations, not DDS runs.
const sourceRoot = 'https://github.com/hyungjin-chung/DDS/blob/509b140ee8ba76772ab7d98929270033d4306f2f/';
const steps = [
  ['先调用一次去噪网络', '当前输入是噪声状态 xₜ 与时间 t。VP 网络预测噪声 ε̂ₜ；这一步提供生成先验，尚未完成患者测量的校正。', 'solver_2d.py#L194', 'solver_2d.py L194–196'],
  ['从噪声中拆出干净估计', '用 Eq.14 扣除预测噪声并恢复尺度，得到 x̂ₜ。这个估计还不一定匹配测量，但提供了比从零开始更有信息的 CG 初始解。', 'solver_2d.py#L198', 'solver_2d.py L198–199'],
  ['让物理求解承担测量校正', '多线圈情况下，用 CG 处理 A* A 及右端项。无噪声求解正常方程；有噪声则求解带近端项的系统。内循环只调用物理算子，不重复调用去噪网络。', 'solver_2d.py#L206', 'solver_2d.py L206–227'],
  ['重新组装下一噪声层级', '将 CG 校正后的 x̂′ₜ 和下一噪声层级的确定性、随机分量组合。η 控制随机程度。它不是把同一幅干净图简单重复输出。', 'solver_2d.py#L228', 'solver_2d.py L228–238'],
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const step = steps[Number(button.dataset.step)];
  document.getElementById('step-title').textContent = step[0];
  document.getElementById('step-description').textContent = step[1];
  const link = document.getElementById('step-source');
  link.href = sourceRoot + step[2]; link.textContent = '官方代码：' + step[3] + ' ↗';
}));

const rows = [
  { name:'Score-MRI DC', psnr:26.48, ssim:.688 },
  { name:'DDNM DC', psnr:31.36, ssim:.932 },
  { name:'DDS · CG 1', psnr:31.51, ssim:.934 },
  { name:'DDS · CG 3', psnr:33.78, ssim:.952 },
  { name:'DDS · CG 5', psnr:34.61, ssim:.956 },
  { name:'DDS · CG 10', psnr:32.48, ssim:.949 },
];
function drawBars(metric) {
  const holder = document.getElementById('ablation-bars'); holder.replaceChildren();
  rows.forEach((r, i) => {
    const row = document.createElement('div'); row.className = 'bar-row';
    const name = document.createElement('span'); name.textContent = r.name;
    const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div'); bar.className = 'bar-fill' + (i === 4 ? ' best' : '');
    bar.style.width = (r[metric] / (metric === 'psnr' ? 40 : 1) * 100) + '%'; track.append(bar);
    const value = document.createElement('span'); value.className = 'bar-value'; value.textContent = r[metric].toFixed(metric === 'psnr' ? 2 : 3);
    row.append(name, track, value); holder.append(row);
  });
  document.getElementById('chart-axis').textContent = metric === 'psnr' ? 'PSNR · 条形以 0 dB 为起点；精确值见标签与下表' : 'SSIM · 条形以 0 为起点，最大刻度为 1';
}
document.querySelectorAll('[data-metric]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-metric]').forEach(button => button.setAttribute('aria-pressed', String(button === b))); drawBars(b.dataset.metric);
}));
drawBars('psnr');

const excerpts = {
  estimate: ['et = model(xt, t)\net = et[:, :et.size(1)//2]\nx0_t = (xt - et * (1 - at).sqrt()) / at.sqrt()', '一次网络前向预测 ε̂ₜ。输出通道切分与模型配置 learn_sigma 有关；x0_t 对应本文的干净估计 x̂ₜ，而不是采样状态 xt。', 'solver_2d.py#L194'],
  cg: ['x0_t_hat = CG(Acg_fn, bcg, x0_t, n_inner=self.args.CG_iter)', '这个调用在多线圈分支中执行。无噪声时 Acg_fn(x)=A*Ax、bcg=A*y；有噪声时 Acg_fn(x)=x+γA*Ax、bcg=x̂ₜ+γA*y。CG_iter 是内循环预算；不要遗漏调用前后的复数与双实通道转换。', 'solver_2d.py#L206'],
  next: ['c1 = (1 - at_next).sqrt() * eta\nc2 = (1 - at_next).sqrt() * ((1 - eta ** 2) ** 0.5)\nxt_next = at_next.sqrt() * x0_t_hat + c1 * torch.randn_like(x0_t_hat) + c2 * et', '代码用校正后的 x0_t_hat 构造下一状态，并混合随机噪声与网络预测方向。此处展示仓库中的转移实现；最后一步还有条件分支，不应凭这三行替代完整算法。', 'solver_2d.py#L228'],
  physics: ['def A(self, x):\n    return fft2_m(self.sens * x) * self.mask\n\ndef AT(self, x):\n    return torch.sum(torch.conj(self.sens) * ifft2_m(x * self.mask), dim=1).unsqueeze(dim=1)', 'A 先乘线圈灵敏度，再做傅里叶变换与掩码。AT 经过掩码、反变换、共轭灵敏度后对线圈求和。代码中 A_dagger 返回 AT，不能因此认为一般多线圈伴随就是精确伪逆。', 'physics/mri.py#L37'],
};
function displayCode(key) { const v = excerpts[key]; document.getElementById('code-snippet').textContent = v[0]; document.getElementById('code-explanation').textContent = v[1]; document.getElementById('code-link').href = sourceRoot + v[2]; }
document.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => {document.querySelectorAll('[data-code]').forEach(button => button.setAttribute('aria-pressed', String(button === b))); displayCode(b.dataset.code);}));
displayCode('estimate');

const n = 32;
const truth = Array.from({length:n}, (_,j) => Math.sin(2*Math.PI*j/n) + .35*Math.cos(6*Math.PI*j/n));
function fourier(samples) { return samples.map((_,k) => { let real=0,imag=0; samples.forEach((x,j) => {real+=x*Math.cos(2*Math.PI*k*j/n);imag-=x*Math.sin(2*Math.PI*k*j/n);}); return [real/n,imag/n]; }); }
const observation = fourier(truth);
function drawSignal(different) {
  const candidate = truth.map((v,j) => v + (different ? .7*Math.cos(14*Math.PI*j/n) : 0));
  const coeff = fourier(candidate);
  let residual=0,energy=0,error=0,truthEnergy=0;
  coeff.forEach((v,k) => {if(k<=3||k>=n-3){residual+=(v[0]-observation[k][0])**2+(v[1]-observation[k][1])**2;energy+=observation[k][0]**2+observation[k][1]**2;}});
  candidate.forEach((v,j) => {error+=(v-truth[j])**2;truthEnergy+=truth[j]**2;});
  document.getElementById('measurement-error').textContent=(Math.sqrt(residual/energy)).toFixed(3);
  const signalError = document.getElementById('signal-error'); signalError.textContent=Math.sqrt(error/truthEnergy).toFixed(3); signalError.className=different?'bad':'good';
  document.getElementById('signal-lesson').textContent=different?'候选加入了未测的第 7 频率成分，信号误差增大，测量残差仍接近零：这是未测子空间造成的歧义。':'两个信号重合，因此信号误差和测量残差都接近零。现在试着加入未测到的结构。';
  const canvas=document.getElementById('signal-canvas'),c=canvas.getContext('2d'); if(!c)return;
  c.clearRect(0,0,900,280); c.fillStyle='#fafbf7';c.fillRect(0,0,900,280);
  c.strokeStyle='#d8dfd8';c.lineWidth=1;[85,140,195].forEach(y=>{c.beginPath();c.moveTo(32,y);c.lineTo(864,y);c.stroke();});
  function path(values,color,dashed) {c.beginPath();c.strokeStyle=color;c.lineWidth=2.5;c.setLineDash(dashed?[5,6]:[]);values.forEach((v,j)=>{const x=32+j*832/(n-1),y=140-v*53;if(j===0)c.moveTo(x,y);else c.lineTo(x,y);});c.stroke();c.setLineDash([]);}
  path(truth,'#0b7564',true);path(candidate,'#c46a44',false);
  c.font='12px "Microsoft YaHei",sans-serif';c.fillStyle='#0b7564';c.fillText('虚线：真实合成信号',32,30);c.fillStyle='#c46a44';c.fillText('实线：候选信号',220,30);c.fillStyle='#687672';c.fillText('样本位置（32 点）',735,258);
}
document.querySelectorAll('[data-signal]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-signal]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));drawSignal(b.dataset.signal==='different');}));
drawSignal(false);

const noteKey='paper-dds-iclr2024-reading-note';
const noteInput=document.getElementById('reading-note'), savedNote=document.getElementById('saved-note');
try {noteInput.value=localStorage.getItem(noteKey)||'';}catch{}
document.getElementById('note-form').addEventListener('submit',e=>{e.preventDefault();try{localStorage.setItem(noteKey,noteInput.value);savedNote.textContent=noteInput.value?'已保存到当前浏览器。\n'+noteInput.value:'空笔记已保存。';}catch{savedNote.textContent='浏览器未允许本地保存，请复制下面的笔记：\n'+noteInput.value;}});

function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.getElementById('reading-progress').style.width=(max>0?scrollY/max*100:100)+'%';}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
const links=[...document.querySelectorAll('.paper-sidebar nav a')];
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}}},{rootMargin:'-15% 0px -65% 0px'});
document.querySelectorAll('main > section[id]').forEach(s=>observer.observe(s));
