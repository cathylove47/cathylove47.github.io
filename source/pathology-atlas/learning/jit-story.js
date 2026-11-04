/* JiT 全文精读页：进度、目录高亮、英文总开关、图中/原图切换、原生放大对话框。 */
(() => {
  const body = document.body;
  const progress = document.getElementById('reading-progress');

  const onScroll = () => {
    if (!progress) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  const toggleEn = document.getElementById('toggle-en');
  const setEnglish = (open) => {
    document.querySelectorAll('details.jit-en').forEach((details) => { details.open = open; });
    if (toggleEn) {
      toggleEn.setAttribute('aria-pressed', String(open));
      toggleEn.textContent = open ? '收起全部英文' : '显示全部英文';
    }
    body.classList.toggle('show-en', open);
  };
  toggleEn?.addEventListener('click', () => setEnglish(toggleEn.getAttribute('aria-pressed') !== 'true'));

  // 目录高亮：只观察正文里的章节锚点，滚动时同步。
  const tocLinks = [...document.querySelectorAll('.jit-toc-group a[href^="#"]')];
  const targets = tocLinks
    .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.target);
  if (targets.length && 'IntersectionObserver' in window) {
    const active = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target.id);
        else active.delete(entry.target.id);
      }
      let current = null;
      for (const item of targets) {
        const id = item.target.id;
        if (active.has(id)) { current = item.link; break; }
      }
      tocLinks.forEach((link) => link.classList.toggle('is-active', link === current));
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    targets.forEach((item) => observer.observe(item.target));
  }

  // 打印前展开全部英文、补充讲解与折叠内容；打印后恢复原状态。
  const printState = [];
  window.addEventListener('beforeprint', () => {
    printState.length = 0;
    document.querySelectorAll('details').forEach((details) => {
      printState.push([details, details.open]);
      details.open = true;
    });
  });
  window.addEventListener('afterprint', () => {
    for (const [details, open] of printState) details.open = open;
    printState.length = 0;
  });

  // 每张图：中文图 ↔ 原图；放大对话框始终给出原图入口。
  const dialog = document.getElementById('jit-zoom');
  const zoomImage = document.getElementById('jit-zoom-img');
  const zoomViewport = document.getElementById('jit-zoom-viewport');
  const zoomCaption = document.getElementById('jit-zoom-caption');
  const zoomOriginal = document.getElementById('jit-zoom-original');
  const zoomFit = dialog?.querySelector('[data-zoom-fit]');
  let lastZoomTrigger = null;

  const applyFit = (fit) => {
    if (!dialog) return;
    dialog.classList.toggle('is-fit', fit);
    if (zoomFit) zoomFit.textContent = fit ? '原尺寸' : '适应窗口';
    if (zoomViewport) zoomViewport.scrollTo(0, 0);
  };

  const openZoom = (image, label, original) => {
    if (!dialog || !zoomImage) return;
    lastZoomTrigger = document.activeElement;
    zoomImage.src = image;
    zoomImage.alt = label || '图片放大';
    if (zoomCaption) zoomCaption.textContent = label || '放大查看';
    if (zoomOriginal) {
      zoomOriginal.href = original || image;
      zoomOriginal.textContent = original ? '在新标签打开原图 ↗' : '在新标签打开图片 ↗';
    }
    applyFit(false);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialog.querySelector('[data-zoom-close]')?.focus();
  };

  const closeZoom = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  };

  document.querySelectorAll('.jit-figure').forEach((figure) => {
    const image = figure.querySelector('.jit-figure__media img');
    if (!image) return;
    const label = image.alt || '图片放大';

    figure.querySelector('[data-image-toggle]')?.addEventListener('click', (event) => {
      const button = event.currentTarget;
      const showingOriginal = image.dataset.showing === 'original';
      image.src = showingOriginal ? image.dataset.zh : image.dataset.original;
      image.dataset.showing = showingOriginal ? 'zh' : 'original';
      button.textContent = showingOriginal ? '看原图' : '回中文图';
    });

    figure.querySelector('[data-zoom]')?.addEventListener('click', () => openZoom(image.src, label, image.dataset.original));
    image.addEventListener('click', () => openZoom(image.src, label, image.dataset.original));
  });

  dialog?.querySelector('[data-zoom-close]')?.addEventListener('click', closeZoom);
  zoomFit?.addEventListener('click', () => applyFit(!dialog.classList.contains('is-fit')));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeZoom();
  });
  dialog?.addEventListener('close', () => {
    if (lastZoomTrigger instanceof HTMLElement) lastZoomTrigger.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog?.open) closeZoom();
  });
})();
