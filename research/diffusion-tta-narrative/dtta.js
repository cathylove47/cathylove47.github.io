/* 《扩散模型与测试时 / 测量时适配》交互：引导强度演示、术语筛选 */
(function () {
  var slider = document.getElementById('dtta-slider');
  if (!slider) return;
  var lambdaVal = document.getElementById('dtta-lambda');
  var status = document.getElementById('dtta-status');
  var explain = document.getElementById('dtta-explain');
  var traj = document.getElementById('dtta-traj');
  var dot = document.getElementById('dtta-dot');
  var label = document.getElementById('dtta-dot-label');
  var vecMeas = document.getElementById('dtta-vec-meas');
  var states = [
    { max: 5, cls: 'dtta-badge', text: '引导过弱：像真图，但不忠实于测量',
      explain: '扩散先验占主导：落点在真实流形上，肉眼很自然，却离测量约束 y = A(x) 很远。在医学成像里，这意味着模型靠常识补图，可能把真实病灶抹平。' },
    { max: 13, cls: 'dtta-badge teal', text: '平衡：流形保真 + 测量一致',
      explain: '引导强度适中时，先验和测量约束协同，样本落在两者交点附近：既自然，又忠实于观测。DAPS、噪声空间优化等方法都在想办法稳定地找到这个交点。' },
    { max: 20, cls: 'dtta-badge rose', text: '引导过强 / 算子失配：偏离流形，长出伪影',
      explain: '硬拉测量梯度（或 y 含噪、算子 A 不准）会把样本扯离真实流形：表面上拟合了观测，图像却长出条纹、高频噪点或假结构。在对齐任务里，这就是 reward hacking。' }
  ];
  function lerp(a, b, u) { return a + (b - a) * u; }
  function update(raw) {
    var t = raw / 20, rx, ry, qx, qy, u;
    lambdaVal.textContent = (raw / 10).toFixed(1);
    if (t <= 0.5) {
      u = t / 0.5;
      rx = lerp(270, 430, u); ry = lerp(138, 130, u); qx = lerp(250, 335, u); qy = lerp(115, 120, u);
    } else {
      u = (t - 0.5) / 0.5;
      rx = lerp(430, 545, u); ry = lerp(130, 72, u); qx = lerp(335, 420, u); qy = lerp(120, 155, u);
    }
    vecMeas.setAttribute('x2', (240 + 180 * t).toFixed(1));
    vecMeas.setAttribute('y2', (70 + 145 * t).toFixed(1));
    traj.setAttribute('d', 'M 240 70 Q ' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + rx.toFixed(1) + ' ' + ry.toFixed(1));
    dot.setAttribute('cx', rx.toFixed(1));
    dot.setAttribute('cy', ry.toFixed(1));
    label.setAttribute('x', (rx - 28).toFixed(1));
    label.setAttribute('y', (ry + 32).toFixed(1));
    var s = states.filter(function (st) { return raw <= st.max; })[0];
    status.className = s.cls;
    status.textContent = s.text;
    explain.textContent = s.explain;
  }
  slider.addEventListener('input', function (e) { update(Number(e.target.value)); });
  update(Number(slider.value));

  var search = document.getElementById('dtta-term-search');
  var pills = document.querySelectorAll('.dtta-pill');
  var cards = document.querySelectorAll('.dtta-term');
  var empty = document.getElementById('dtta-terms-empty');
  var cat = 'all';
  function filter() {
    var q = search.value.trim().toLowerCase(), shown = 0;
    cards.forEach(function (card) {
      var ok = (cat === 'all' || card.dataset.cat === cat) && (!q || card.textContent.toLowerCase().indexOf(q) !== -1);
      card.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    empty.style.display = shown ? 'none' : 'block';
  }
  search.addEventListener('input', filter);
  pills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pills.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      cat = btn.dataset.cat;
      filter();
    });
  });
})();
