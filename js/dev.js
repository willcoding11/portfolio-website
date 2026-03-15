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

  // ── Save everything to localStorage, flash "Saved" on badge ──
  function devSave() {
    localStorage.setItem('portfolio_projects',     JSON.stringify(projects));
    localStorage.setItem('portfolio_bannerConfig', JSON.stringify(bannerConfig));
    localStorage.setItem('portfolio_aboutConfig',  JSON.stringify(aboutConfig));
    localStorage.setItem('portfolio_contactConfig',JSON.stringify(contactConfig));
    const badge = document.getElementById('dev-badge');
    if (badge) {
      badge.textContent = '✓ Saved';
      clearTimeout(badge._t);
      badge._t = setTimeout(() => { badge.textContent = '⚙ DEV MODE — click to export'; }, 1200);
    }
  }

  // ── Export: copies the full updated data.js to clipboard ──
  // ALL changes across ALL projects + ALL configs are included in one file.
  // Paste it into js/data.js to make everything permanent.
  function devExport() {
    const content =
`// ════════════════════════════════════
// PROJECT DATA — add new projects here
// ════════════════════════════════════
const projects = ${JSON.stringify(projects, null, 2)};

const bannerConfig = ${JSON.stringify(bannerConfig, null, 2)};

const aboutConfig = ${JSON.stringify(aboutConfig, null, 2)};

const contactConfig = ${JSON.stringify(contactConfig, null, 2)};

// ── Restore any dev mode edits saved in localStorage ──
(function restoreDevEdits() {
  try {
    const sp = localStorage.getItem('portfolio_projects');
    if (sp) projects.splice(0, projects.length, ...JSON.parse(sp));
    const sb = localStorage.getItem('portfolio_bannerConfig');
    if (sb) Object.assign(bannerConfig, JSON.parse(sb));
    const sa = localStorage.getItem('portfolio_aboutConfig');
    if (sa) Object.assign(aboutConfig, JSON.parse(sa));
    const sc = localStorage.getItem('portfolio_contactConfig');
    if (sc) Object.assign(contactConfig, JSON.parse(sc));
  } catch(e) {}
})();`;

    const showOverlay = (text) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;padding:40px';
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:12px;padding:24px;width:100%;max-width:680px;font-family:Manrope,sans-serif">
          <p style="font-size:0.85rem;font-weight:700;margin-bottom:6px;color:#1a1612">Export data.js</p>
          <p style="font-size:0.78rem;color:#7a7065;margin-bottom:12px">
            This contains <strong>all changes</strong> — every project description, screenshot, tag,
            banner text, about page, and contact links. Copy it and replace <code>js/data.js</code> to save permanently.
          </p>
          <textarea readonly style="width:100%;height:260px;font-family:monospace;font-size:0.7rem;border:1px solid #ccc;padding:8px;border-radius:6px;resize:vertical">${text}</textarea>
          <div style="display:flex;gap:10px;margin-top:12px">
            <button id="dev-copy-btn" style="padding:7px 18px;background:#e85d2a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:Manrope,sans-serif;font-weight:600;font-size:0.8rem">Copy to clipboard</button>
            <button onclick="this.closest('div').parentElement.parentElement.remove()" style="padding:7px 18px;border:1px solid #ccc;border-radius:6px;cursor:pointer;font-family:Manrope,sans-serif;font-size:0.8rem">Close</button>
          </div>
        </div>`;
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
      overlay.querySelector('textarea').select();
      overlay.querySelector('#dev-copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
          overlay.querySelector('#dev-copy-btn').textContent = '✓ Copied!';
        });
      });
    };

    navigator.clipboard.writeText(content).then(() => {
      const badge = document.getElementById('dev-badge');
      if (badge) {
        badge.textContent = '✓ Copied! Paste into js/data.js';
        clearTimeout(badge._t);
        badge._t = setTimeout(() => { badge.textContent = '⚙ DEV MODE — click to export'; }, 3000);
      }
    }).catch(() => showOverlay(content));
  }

  // ── Banner ──
  function devEnhanceBanner() {
    const titleEl = document.querySelector('.banner-title');
    const subEl   = document.querySelector('.banner-subtitle');
    if (titleEl) {
      titleEl.contentEditable = 'true';
      titleEl.addEventListener('blur', () => { bannerConfig.title = titleEl.textContent.trim(); devSave(); });
    }
    if (subEl) {
      subEl.contentEditable = 'true';
      subEl.addEventListener('blur', () => { bannerConfig.subtitle = subEl.textContent.trim(); devSave(); });
    }
  }

  // ── About page ──
  function devEnhanceAbout() {
    // editable heading + paragraphs — save back to aboutConfig on blur
    const h2 = document.querySelector('.about-text h2');
    if (h2) {
      h2.contentEditable = 'true';
      h2.addEventListener('blur', () => { aboutConfig.heading = h2.textContent.trim(); devSave(); });
    }
    document.querySelectorAll('.about-text p').forEach((el, i) => {
      el.contentEditable = 'true';
      el.addEventListener('blur', () => {
        if (aboutConfig.paragraphs[i]) aboutConfig.paragraphs[i].text = el.textContent.trim();
        devSave();
      });
    });

    // hero image — click hint to change
    const hero = document.querySelector('.about-hero');
    if (hero && !hero.dataset.devBound) {
      hero.dataset.devBound = '1';
      const hint = document.createElement('div');
      hint.className = 'dev-img-hint';
      hint.textContent = '🖼 Click to change image';
      hero.appendChild(hint);
      hero.addEventListener('click', () => {
        const url = prompt('Hero image URL or path (blank to remove):', aboutConfig.heroImage);
        if (url != null) {
          aboutConfig.heroImage = url.trim();
          hero.style.backgroundImage = url.trim() ? `url('${url.trim()}')` : '';
          devSave();
        }
      });
    }

    // avatar image — click hint to change
    const avatar = document.querySelector('.about-avatar');
    if (avatar && !avatar.dataset.devBound) {
      avatar.dataset.devBound = '1';
      const hint = document.createElement('div');
      hint.className = 'dev-img-hint';
      hint.textContent = '🖼';
      avatar.appendChild(hint);
      avatar.addEventListener('click', () => {
        const url = prompt('Avatar image URL or path (blank to remove):', aboutConfig.avatarImage);
        if (url != null) {
          aboutConfig.avatarImage = url.trim();
          const img = avatar.querySelector('img');
          if (img) { img.src = url.trim() || ''; }
          else if (url.trim()) { const i = document.createElement('img'); i.src = url.trim(); i.alt = 'Avatar'; avatar.appendChild(i); }
          devSave();
        }
      });
    }
  }

  // ── Contact page ──
  function devEnhanceContact() {
    const nameEl = document.querySelector('.contact-name');
    const subEl  = document.querySelector('.contact-sub');
    if (nameEl) {
      nameEl.contentEditable = 'true';
      nameEl.addEventListener('blur', () => { contactConfig.name = nameEl.textContent.trim(); devSave(); });
    }
    if (subEl) {
      subEl.contentEditable = 'true';
      subEl.addEventListener('blur', () => { contactConfig.subtitle = subEl.textContent.trim(); devSave(); });
    }

    // contact avatar image
    const avatar = document.querySelector('.contact-avatar');
    if (avatar && !avatar.dataset.devBound) {
      avatar.dataset.devBound = '1';
      const hint = document.createElement('div');
      hint.className = 'dev-img-hint';
      hint.textContent = '🖼';
      avatar.appendChild(hint);
      avatar.addEventListener('click', () => {
        const url = prompt('Avatar image URL or path (blank to remove):', contactConfig.avatarImage);
        if (url != null) {
          contactConfig.avatarImage = url.trim();
          const img = avatar.querySelector('img');
          if (img) { img.src = url.trim() || ''; }
          else if (url.trim()) { const i = document.createElement('img'); i.src = url.trim(); i.alt = 'Avatar'; avatar.appendChild(i); }
          devSave();
        }
      });
    }

    document.querySelectorAll('.contact-btn').forEach((btn, i) => {
      if (btn.dataset.devBound) return;
      btn.dataset.devBound = '1';
      const span = btn.querySelector('span');
      if (span) {
        span.contentEditable = 'true';
        span.addEventListener('blur', () => {
          if (contactConfig.buttons[i]) contactConfig.buttons[i].label = span.textContent.trim();
          devSave();
        });
      }
      const editBtn = document.createElement('button');
      editBtn.className = 'dev-edit-link';
      editBtn.textContent = '✎ URL';
      editBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const url = prompt('Button link URL:', btn.getAttribute('href'));
        if (url != null) {
          btn.setAttribute('href', url);
          if (contactConfig.buttons[i]) contactConfig.buttons[i].href = url;
          devSave();
        }
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
      badge.textContent = '⚙ DEV MODE — click to export';
      badge.style.cursor = 'pointer';
      badge.style.pointerEvents = 'all';
      badge.addEventListener('click', devExport);
      document.body.appendChild(badge);

      const clearBtn = document.createElement('div');
      clearBtn.id = 'dev-clear';
      clearBtn.className = 'dev-badge';
      clearBtn.textContent = '🗑 Clear Local Storage';
      clearBtn.style.cssText = 'cursor:pointer;pointer-events:all;right:auto;left:16px;';
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem('portfolio_projects');
        localStorage.removeItem('portfolio_bannerConfig');
        localStorage.removeItem('portfolio_aboutConfig');
        localStorage.removeItem('portfolio_contactConfig');
        clearBtn.textContent = '✓ Cleared!';
        setTimeout(() => { clearBtn.textContent = '🗑 Clear Local Storage'; }, 1200);
        location.reload();
      });
      document.body.appendChild(clearBtn);
    } else if (!active && badge) {
      badge.remove();
      const cb = document.getElementById('dev-clear');
      if (cb) cb.remove();
    }
    renderProjects(); renderHome(); renderAbout(); renderContact();
    if (active) { devEnhanceBanner(); devEnhanceAbout(); devEnhanceContact(); }
    const overlay = document.getElementById('modal-overlay');
    if (overlay.classList.contains('open') && currentModalIndex >= 0) openModal(currentModalIndex);
  }

  // wrap renders to re-apply enhancements after re-render
  const _renderHome = renderHome;
  renderHome = function() { _renderHome(); if (active) devEnhanceBanner(); };

  const _renderAbout = renderAbout;
  renderAbout = function() { _renderAbout(); if (active) devEnhanceAbout(); };

  const _renderContact = renderContact;
  renderContact = function() { _renderContact(); if (active) devEnhanceContact(); };

  const _renderProjects = renderProjects;
  renderProjects = function() {
    _renderProjects();
    if (!active) return;
    document.querySelectorAll('.home-proj-wrap .project-card, .projects-grid .project-card').forEach((card, i) => {
      const p = card.querySelector('.project-card-body p');
      if (!p) return;
      p.contentEditable = 'true';
      p.addEventListener('blur', () => { projects[i % projects.length].description = p.textContent.trim(); devSave(); });
    });
  };

  const _openModal = openModal;
  openModal = function(index) {
    _openModal(index);
    if (!active) return;

    const descEl = document.querySelector('.modal-desc');
    if (descEl) {
      descEl.contentEditable = 'true';
      descEl.addEventListener('blur', () => { projects[index].longDescription = descEl.textContent.trim(); devSave(); });
    }

    const tagsEl = document.querySelector('.modal-tags');
    if (tagsEl) {
      tagsEl.querySelectorAll('span').forEach((tag, ti) => {
        const rm = document.createElement('button');
        rm.className = 'dev-tag-remove';
        rm.textContent = '×';
        rm.addEventListener('click', e => {
          e.stopPropagation();
          projects[index].tags.splice(ti, 1);
          devSave(); openModal(index);
        });
        tag.appendChild(rm);
      });
      const addTag = document.createElement('div');
      addTag.className = 'dev-add-tag';
      addTag.textContent = '+ Tag';
      addTag.addEventListener('click', () => {
        const t = prompt('New tag name:');
        if (t && t.trim()) { projects[index].tags.push(t.trim()); devSave(); openModal(index); }
      });
      tagsEl.appendChild(addTag);
    }

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
        devSave(); openModal(index);
      }
    });
    grid.appendChild(btn);
  };
})();
