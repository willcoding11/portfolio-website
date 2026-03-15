// ════════════════════════════════════
// RENDER PAGES
// ════════════════════════════════════

function renderHome() {
  const homeEl = document.getElementById('page-home');
  homeEl.innerHTML = `
    <div class="home-banner">
      <canvas id="banner-canvas"></canvas>
      <div class="banner-content">
        <h1 class="banner-title">${bannerConfig.title}</h1>
        <p class="banner-subtitle">${bannerConfig.subtitle}</p>
      </div>
    </div>
    <div class="home-proj-grid">
      ${projects.map((p, i) => `
        <div class="home-proj-wrap">
          <div class="project-card" onclick="openModal(${i})">
            <div class="project-card-img"><img src="${p.thumbnail}" alt="${p.name}"></div>
            <div class="project-card-body">
              <h3>${p.name}</h3>
              <p>${p.description}</p>
              <div class="project-card-tags">
                ${p.tags.map(t => `<span class="project-card-tag">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
  initBannerCanvas();
}

function initBannerCanvas() {
  const canvas = document.getElementById('banner-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, shapes;

  const COLORS = ['#c47a3a', '#c5bdb4', '#3d3830'];

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W;
    canvas.height = H;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeShape(startAnywhere) {
    return {
      x: rand(0, W),
      y: startAnywhere ? rand(0, H) : rand(H + 5, H + 40),
      r: rand(5, 20),
      type: Math.floor(rand(0, 3)), // 0=circle 1=square 2=diamond
      color: COLORS[Math.floor(rand(0, 3))],
      alpha: rand(0.07, 0.18),
      vx: rand(-0.2, 0.3),
      vy: rand(-0.55, -0.15),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.018, 0.018),
    };
  }

  function drawShape(s) {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = s.color;
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    if (s.type === 0) {
      ctx.beginPath(); ctx.arc(0, 0, s.r, 0, Math.PI * 2); ctx.fill();
    } else if (s.type === 1) {
      const d = s.r * 1.6; ctx.fillRect(-d/2, -d/2, d, d);
    } else {
      const d = s.r * 1.4;
      ctx.beginPath(); ctx.moveTo(0, -d); ctx.lineTo(d, 0);
      ctx.lineTo(0, d); ctx.lineTo(-d, 0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    shapes.forEach((s, i) => {
      s.x += s.vx; s.y += s.vy; s.rot += s.vrot;
      if (s.y + s.r * 2 < 0) shapes[i] = makeShape(false);
      if (s.x < -s.r * 2) s.x = W + s.r;
      if (s.x > W + s.r * 2) s.x = -s.r;
      drawShape(s);
    });
    requestAnimationFrame(tick);
  }

  resize();
  shapes = Array.from({ length: 38 }, () => makeShape(true));
  tick();
  new ResizeObserver(resize).observe(canvas.parentElement);
}

function renderProjects() {
  const el = document.getElementById('page-projects');
  el.innerHTML = `
    <div class="projects-header">
      <h1>Projects</h1>
      <p>A selection of things I've built — games, tools, and experiments.</p>
    </div>
    <div class="projects-grid">
      ${projects.map((p, i) => `
        <div class="project-card" onclick="openModal(${i})">
          <div class="project-card-img"><img src="${p.thumbnail}" alt="${p.name}"></div>
          <div class="project-card-body">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="project-card-tags">
              ${p.tags.map(t => `<span class="project-card-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
}
