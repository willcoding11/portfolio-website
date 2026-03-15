// ╔═══════════════════════════════════════════════════════════╗
// ║  DEV MODE — delete this file (+ CSS block) to remove it   ║
// ╚═══════════════════════════════════════════════════════════╝
(function devMode() {
  const ENABLED = true; // ← set false to disable without deleting

  if (!ENABLED) return;

  let clicks = 0, clickTimer = null, active = false;

  // 5 clicks on "William Culver" in the top-left to toggle
  document.querySelector('.nav-name').addEventListener('click', () => {
    clicks++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clicks = 0; }, 2000);
    if (clicks >= 5) { clicks = 0; active = !active; onToggle(); }
  });

  // ── Banner ──
  function devEnhanceBanner() {
    const titleEl = document.querySelector('.banner-title');
    const subEl   = document.querySelector('.banner-subtitle');
    if (titleEl) {
      titleEl.contentEditable = 'true';
      titleEl.addEventListener('blur', () => { bannerConfig.title = titleEl.textContent.trim(); });
    }
    if (subEl) {
      subEl.contentEditable = 'true';
      subEl.addEventListener('blur', () => { bannerConfig.subtitle = subEl.textContent.trim(); });
    }
  }

  // ── About page ──
  function devEnhanceAbout() {
    document.querySelectorAll('.about-text h2, .about-text p').forEach(el => {
      el.contentEditable = 'true';
    });
    const hero = document.querySelector('.about-hero');
    if (hero && !hero.dataset.devBound) {
      hero.dataset.devBound = '1';
      hero.style.position = 'relative';
      const hint = document.createElement('div');
      hint.className = 'dev-img-hint';
      hint.textContent = '🖼 Click to change image';
      hero.appendChild(hint);
      hero.addEventListener('click', () => {
        const cur = hero.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
        const url = prompt('Hero image URL or path (blank to remove):', cur);
        if (url != null) hero.style.backgroundImage = url.trim() ? `url('${url.trim()}')` : '';
      });
    }
    const avatar = document.querySelector('.about-avatar');
    if (avatar && !avatar.dataset.devBound) {
      avatar.dataset.devBound = '1';
      const hint = document.createElement('div');
      hint.className = 'dev-img-hint';
      hint.textContent = '🖼';
      avatar.appendChild(hint);
      avatar.addEventListener('click', () => {
        const cur = avatar.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
        const url = prompt('Avatar image URL or path (blank to remove):', cur);
        if (url != null) avatar.style.backgroundImage = url.trim() ? `url('${url.trim()}')` : '';
      });
    }
  }

  // ── Contact page ──
  function devEnhanceContact() {
    const name = document.querySelector('.contact-name');
    const sub  = document.querySelector('.contact-sub');
    if (name) name.contentEditable = 'true';
    if (sub)  sub.contentEditable  = 'true';
    document.querySelectorAll('.contact-btn').forEach(btn => {
      if (btn.dataset.devBound) return;
      btn.dataset.devBound = '1';
      const span = btn.querySelector('span');
      if (span) span.contentEditable = 'true';
      const editBtn = document.createElement('button');
      editBtn.className = 'dev-edit-link';
      editBtn.textContent = '✎ URL';
      editBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const url = prompt('Button link URL:', btn.getAttribute('href'));
        if (url != null) btn.setAttribute('href', url);
      });
      btn.appendChild(editBtn);
    });
  }

  function onToggle() {
    let badge = document.getElementById('dev-badge');
    if (active && !badge) {
      badge = document.createElement('div');
      badge.id = 'dev-badge';
      badge.className = 'dev-badge';
      badge.textContent = '⚙ DEV MODE';
      document.body.appendChild(badge);
    } else if (!active && badge) {
      badge.remove();
    }
    renderProjects();
    renderHome();
    if (active) { devEnhanceBanner(); devEnhanceAbout(); devEnhanceContact(); }
    const overlay = document.getElementById('modal-overlay');
    if (overlay.classList.contains('open') && currentModalIndex >= 0) {
      openModal(currentModalIndex);
    }
  }

  // wrap renderHome — re-apply banner editing after re-render
  const _renderHome = renderHome;
  renderHome = function() {
    _renderHome();
    if (active) devEnhanceBanner();
  };

  // wrap renderProjects — editable short descriptions on project cards
  const _renderProjects = renderProjects;
  renderProjects = function() {
    _renderProjects();
    if (!active) return;
    document.querySelectorAll('.home-proj-wrap .project-card, .projects-grid .project-card').forEach((card, i) => {
      const p = card.querySelector('.project-card-body p');
      if (!p) return;
      p.contentEditable = 'true';
      p.addEventListener('blur', () => { projects[i % projects.length].description = p.textContent.trim(); });
    });
  };

  // wrap openModal — editable long description, tags, and add-screenshot button
  const _openModal = openModal;
  openModal = function(index) {
    _openModal(index);
    if (!active) return;

    // editable long description
    const descEl = document.querySelector('.modal-desc');
    if (descEl) {
      descEl.contentEditable = 'true';
      descEl.addEventListener('blur', () => {
        projects[index].longDescription = descEl.textContent.trim();
      });
    }

    // editable tags — × to remove, + to add
    const tagsEl = document.querySelector('.modal-tags');
    if (tagsEl) {
      tagsEl.querySelectorAll('span').forEach((tag, ti) => {
        const rm = document.createElement('button');
        rm.className = 'dev-tag-remove';
        rm.textContent = '×';
        rm.addEventListener('click', e => {
          e.stopPropagation();
          projects[index].tags.splice(ti, 1);
          openModal(index);
        });
        tag.appendChild(rm);
      });
      const addTag = document.createElement('div');
      addTag.className = 'dev-add-tag';
      addTag.textContent = '+ Tag';
      addTag.addEventListener('click', () => {
        const t = prompt('New tag name:');
        if (t && t.trim()) { projects[index].tags.push(t.trim()); openModal(index); }
      });
      tagsEl.appendChild(addTag);
    }

    // add screenshot button (creates grid if project has none yet)
    let grid = document.querySelector('.modal-screenshots');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'modal-screenshots';
      const links = document.querySelector('.modal-links');
      const body  = document.querySelector('.modal-body');
      links ? body.insertBefore(grid, links) : body.appendChild(grid);
    }
    const btn = document.createElement('div');
    btn.className = 'dev-add-screenshot';
    btn.textContent = '+ Add Screenshot';
    btn.addEventListener('click', () => {
      const url = prompt('Screenshot path or URL:');
      if (url && url.trim()) {
        if (!projects[index].screenshots) projects[index].screenshots = [];
        projects[index].screenshots.push(url.trim());
        openModal(index);
      }
    });
    grid.appendChild(btn);
  };
})();
