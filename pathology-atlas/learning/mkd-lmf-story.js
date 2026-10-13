'use strict';
// 本页所有交互都是解释性示意，或由论文原表数值重绘，不是本站实验。
const REPO = 'https://github.com/helomelo1/MKD-LMF';

/* ---------- 推理流程四步 ---------- */
const steps = [
  { title: '把每个图块编码成向量',
    body: '冻结的 Phikon（ViT-B/16）对每个 224×224 图块取 CLS token，得到 768 维向量 v_i。文本编码器在这一步完全不参与——推理链路里没有它。' },
  { title: '把所有图块平均成一张切片的向量',
    body: 'z_img = (1/N)·Σ v_k。平均池化与图块顺序无关（排列不变），论文用它而不是注意力池化作为默认聚合，得到一个固定的 768 维切片级表征。' },
  { title: '学生重建老师那份融合表征',
    body: '学生只需 z_img，通过知识蒸馏器 H 输出一个 128 维向量 ẑ_fused，去逼近老师由图 + 文融合出来的 z_fused。学生输入里没有文字，它学的是“在图像特征上重建融合结果”。' },
  { title: '用共享分类器得到亚型',
    body: 'ẑ_fused 送进老师训好后冻结、师生共用的分类器 φ_cls（Linear + ReLU + Dropout），得到三个亚型（高/中/低分化管状腺癌）的概率。整个推理只用到 Phikon + H + 分类器。' },
];
const stepButtons = document.querySelectorAll('[data-step]');
const stepTitle = document.getElementById('step-title');
const stepBody = document.getElementById('step-description');
function selectStep(index) {
  stepButtons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.step) === index)));
  stepTitle.textContent = steps[index].title;
  stepBody.textContent = steps[index].body;
}
stepButtons.forEach(b => b.addEventListener('click', () => selectStep(Number(b.dataset.step))));
selectStep(0);

/* ---------- Table 1–2 真实数字条形图 ---------- */
const metrics = {
  sota: { axis: 'Table 1 · 准确率（%）· 仅图像推理 · 条形以 0 为起点，最大刻度 80', min: 0, max: 80, dec: 2, best: 7,
    rows: [['ABMIL', 66.67], ['CLAM', 67.83], ['DSMIL', 69.02], ['TransMIL', 67.48], ['CITE', 69.63], ['ILRA-MIL', 70.16], ['PathM3', 71.48], ['MKD-LMF（本文）', 74.83]] },
  ablation: { axis: 'Table 2 · 蒸馏损失消融 · 准确率（%）· 单次运行，最大刻度 100', min: 0, max: 100, dec: 2, best: 3,
    rows: [['老师（图像 + 文本，上界）', 92.74], ['仅特征损失 L_feat', 73.63], ['仅 KD 损失 L_KD', 73.13], ['特征损失 + KD 损失', 74.83]] },
  modality: { axis: 'Table 2 · 推理模态 · 准确率（%）· 单次运行，最大刻度 80', min: 0, max: 80, dec: 2, best: 2,
    rows: [['仅文本（单模态）', 68.76], ['仅图像（单模态）', 70.35], ['仅图像（本文多模态蒸馏）', 74.83]] },
};
function drawBars(key) {
  const set = metrics[key];
  const holder = document.getElementById('metric-bars');
  holder.replaceChildren();
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
drawBars('sota');

/* ---------- 交互 1：训练/推理通路切换 ---------- */
const MODES = {
  teacher: { nodes: ['image', 'text', 'lmf', 'zf', 'cls'], edges: ['image', 'text', 'lmf', 'cls'],
    lesson: '训练期（老师）：图像与文本一起进入 LMF，融合成 z_fused 再送共享分类器。此时学生通路（H，虚线）还没有意义。' },
  student: { nodes: ['image', 'h', 'cls'], edges: ['h', 'hs'],
    lesson: '推理期（学生）：只会用到图像编码器、蒸馏器 H 和共享分类器。文本编码器与 LMF 完全消失——这就是“报告只在训练期有用”的字面含义。' },
  both: { nodes: ['image', 'text', 'lmf', 'zf', 'cls', 'h'], edges: ['image', 'text', 'lmf', 'cls', 'h', 'hs'],
    lesson: '两阶段对照：实线是老师的图文通路（仅训练期），虚线是学生把 z_img 映射成 ẑ_fused 的通路（推理期生效）。虚线汇入同一个冻结分类器。' },
};
const pathSvg = document.getElementById('path-svg');
const pathLesson = document.getElementById('path-lesson');
function setMode(mode) {
  const cfg = MODES[mode];
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  pathSvg.querySelectorAll('.pw-node').forEach(node => {
    const on = cfg.nodes.includes(node.dataset.role);
    node.style.opacity = on ? '1' : '0.22';
    const rect = node.querySelector('rect');
    if (rect) { rect.setAttribute('stroke-width', on ? '2.4' : '1.4'); rect.setAttribute('filter', on ? '' : 'grayscale(1)'); }
  });
  pathSvg.querySelectorAll('.pw-edge').forEach(edge => {
    const on = cfg.edges.includes(edge.dataset.role);
    edge.style.opacity = on ? '1' : '0.15';
  });
  pathLesson.textContent = cfg.lesson;
}
document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
setMode('teacher');

/* ---------- 官方仓库的真实命令 ---------- */
const excerpts = {
  extract: { code:
`# 实际参数：除 --label_csv 用仓库自带的 captions_filtered.csv 外，其余均为 extract_features.py 的 argparse 默认值
python extract_features.py \\
  --image_dir dataset/patches_captions \\
  --label_csv captions_filtered.csv \\
  --histo_feature_dir features_phikon \\
  --caption_feature_dir features_mpnet \\
  --patch_batch_size 64
# 图像：Phikon（AutoModel）取 CLS token → 768 维
# 文本：BAAI/bge-small-en-v1.5 → 384 维`,
    note: '每条 WSI 存成一个 .pt：图像侧 {features}，文本侧 {embedding}。注意 --caption_feature_dir 默认叫 features_mpnet，但编码器其实是 BGE-small（历史命名残留）。README 里写的 --patch_dir / --output_dir / --encoder 参数在源码中并不存在。' },
  teacher: { code:
`# stage 1：多模态老师（full_method）
python main.py --model full_method \\
  --rank 128 --epochs 20 --lr 1e-4 \\
  --histo_feature_dir features_phikon \\
  --caption_feature_dir features_mpnet \\
  --csv captions_filtered.csv \\
  --output_dir results
# → results/full_method_r128/checkpoint.pt`,
    note: '老师 = MultimodalLMFClassifier（LowRankFusion + Linear/ReLU/Dropout）。论文最优 rank=128，但 main.py 默认是 64，必须显式覆盖。论文报告训练 20 epoch、Adam、lr 1e-4、交叉熵。' },
  student: { code:
`# stage 2：仅图像学生（distilled_method，需要老师 checkpoint）
python main.py --model distilled_method \\
  --rank 128 --epochs 50 --lr 1e-4 \\
  --checkpoint results/full_method_r128/checkpoint.pt \\
  --output_dir results
# → results/distilled_method_r128/checkpoint.pt`,
    note: '学生 = DistilledClassifier，内部冻结老师并训练 H。forward_train 里 feature_loss = SmoothL1(ẑ, z)，kd_loss = KLDiv(batchmean)·τ²（τ=2），distill = feature + 0.5·kd，训练损失 = CE + distill，与论文 λ_feat=1.0、λ_KD=0.5、τ=2 一致。' },
  run: { code:
`# 批量实验（种子 0/1/2）
bash run.sh
# 里面依次跑：
#   image_only / text_only / concat_fusion / late_fusion
#   full_method / no_attn_pool / no_lmf / no_mil
#   rank 4 / 16 / 32 / 128 扫描
# 注意：run.sh 里没有 distilled_method，学生要自己手动调用`,
    note: '官方没有提供 evaluate.py / train_teacher.py / train_student.py 这些 README 里出现的脚本；所有模型都通过 main.py --model 选择。评测加 --evaluate 并配合 --checkpoint 使用。' },
};
const snippetEl = document.getElementById('code-snippet');
const codeNote = document.getElementById('code-explanation');
document.getElementById('code-link').href = REPO;
function displayCode(key) {
  document.querySelectorAll('[data-code]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.code === key)));
  snippetEl.textContent = excerpts[key].code;
  codeNote.textContent = excerpts[key].note;
}
document.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => displayCode(b.dataset.code)));
displayCode('extract');

/* ---------- 阅读笔记、进度条与目录高亮 ---------- */
const noteKey = 'paper-mkd-lmf-arxiv261007913-reading-note';
const noteInput = document.getElementById('reading-note');
const savedNote = document.getElementById('saved-note');
try { noteInput.value = localStorage.getItem(noteKey) || ''; } catch (error) { /* 隐私模式下忽略 */ }
document.getElementById('note-form').addEventListener('submit', event => {
  event.preventDefault();
  try { localStorage.setItem(noteKey, noteInput.value); savedNote.textContent = '已保存到本浏览器（' + new Date().toLocaleTimeString() + '）。'; }
  catch (error) { savedNote.textContent = '当前浏览器不允许本地存储，笔记未保存。'; }
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
