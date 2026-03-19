// ══════════════════════════════════════════════════════════════
// DEV MODE — only activates on localhost (not GitHub Pages)
// ══════════════════════════════════════════════════════════════
(function () {
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;

  /* ── state ── */
  let active = false, dirty = false;
  let editorState = null;   // { type, data, pendingFiles }

  /* ── helpers ── */
  const esc = s => (s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const qs  = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => (ctx || document).querySelectorAll(sel);

  // ═══════════════════════════════════
  // INJECT STYLES
  // ═══════════════════════════════════
  const styleEl = document.createElement('style');
  styleEl.textContent = `
/* ── toolbar ── */
.dev-toolbar{position:fixed;bottom:-64px;left:0;right:0;height:58px;background:rgba(61,56,48,.95);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:10001;transition:bottom .3s ease;border-top:2px solid var(--accent)}
.dev-toolbar.visible{bottom:0}
.dev-toolbar-left{display:flex;align-items:center;gap:14px}
.dev-toolbar-right{display:flex;align-items:center;gap:10px}
.dev-badge{font-family:'Syne',sans-serif;font-weight:700;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:#c47a3a;background:rgba(196,122,58,.15);padding:5px 12px;border-radius:100px;border:1px solid rgba(196,122,58,.3)}
.dev-dirty{font-size:.78rem;color:#e8a96a;opacity:0;transition:opacity .3s}
.dev-dirty.show{opacity:1}
.dev-btn{font-family:'Manrope',sans-serif;font-size:.78rem;font-weight:600;padding:8px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.15);background:transparent;color:#e8e0d4;cursor:pointer;transition:all .25s}
.dev-btn:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.25)}
.dev-btn-save{background:var(--accent)!important;color:#fff!important;border-color:var(--accent)!important}
.dev-btn-save:hover{filter:brightness(1.1)}

/* ── edit overlays ── */
.dev-edit-icon{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:8px;background:rgba(196,122,58,.9);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:50;opacity:0;transition:opacity .2s;border:none;box-shadow:0 2px 8px rgba(0,0,0,.2)}
.dev-mode .dev-edit-icon{opacity:1}
.dev-edit-icon:hover{background:rgba(196,122,58,1);transform:scale(1.08)}
.dev-edit-icon svg{width:16px;height:16px}

.dev-add-card{border:2px dashed var(--border);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;min-height:200px;cursor:pointer;font-family:'Syne',sans-serif;font-size:1rem;font-weight:600;color:var(--text-dim);transition:all .3s;background:transparent}
.dev-add-card:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-glow)}

/* ── editor panel ── */
.dev-panel{position:fixed;top:0;right:0;width:520px;max-width:100vw;height:100vh;background:var(--bg);border-left:2px solid var(--accent);box-shadow:-8px 0 40px rgba(0,0,0,.12);z-index:10002;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s ease}
.dev-panel.visible{transform:translateX(0)}
.dev-panel-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--border);flex-shrink:0}
.dev-panel-head h3{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text-bright)}
.dev-panel-close{background:none;border:1px solid var(--border);border-radius:8px;width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-dim);transition:all .2s}
.dev-panel-close:hover{border-color:var(--accent);color:var(--accent)}
.dev-panel-body{flex:1;overflow-y:auto;padding:24px}
.dev-panel-foot{display:flex;gap:10px;padding:16px 24px;border-top:1px solid var(--border);flex-shrink:0}
.dev-panel-foot button{flex:1}

/* ── form fields ── */
.dev-field{margin-bottom:20px}
.dev-field label{display:block;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);margin-bottom:6px}
.dev-field input[type="text"],.dev-field input[type="email"],.dev-field input[type="url"],.dev-field textarea{width:100%;font-family:'Manrope',sans-serif;font-size:.88rem;color:var(--text-bright);background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:10px 14px;outline:none;transition:border-color .2s}
.dev-field input:focus,.dev-field textarea:focus{border-color:var(--accent)}
.dev-field textarea{resize:vertical;min-height:80px;line-height:1.6}
.dev-check{display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:.85rem;color:var(--text)}
.dev-check input{accent-color:var(--accent)}

/* ── tags ── */
.dev-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.dev-tag{display:inline-flex;align-items:center;gap:4px;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--accent);background:var(--accent-glow);padding:4px 10px;border-radius:100px}
.dev-tag button{background:none;border:none;color:var(--accent);cursor:pointer;font-size:.85rem;padding:0 0 0 2px;line-height:1}
.dev-tag-add{display:flex;gap:6px}
.dev-tag-add input{flex:1;font-size:.82rem;padding:6px 10px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text-bright);outline:none}
.dev-tag-add button{font-size:.82rem;padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);cursor:pointer}

/* ── image/file preview ── */
.dev-img-preview{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.dev-img-preview img{width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border)}
.dev-img-preview .dev-btn-sm{font-size:.75rem;padding:6px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);cursor:pointer;transition:all .2s}
.dev-img-preview .dev-btn-sm:hover{border-color:var(--accent);color:var(--accent)}
.dev-media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;margin-bottom:8px}
.dev-media-item{position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--border)}
.dev-media-item img,.dev-media-item video{width:100%;height:70px;object-fit:cover;display:block}
.dev-media-item button{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;border:none;cursor:pointer;font-size:.7rem;display:flex;align-items:center;justify-content:center}

/* ── paragraphs editor ── */
.dev-para-item{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:8px}
.dev-para-item textarea{width:100%;min-height:60px;margin-bottom:6px;border:1px solid var(--border);border-radius:8px;background:var(--bg-raised);padding:8px;font-size:.85rem;color:var(--text);font-family:'Manrope',sans-serif;resize:vertical;outline:none}
.dev-para-item textarea:focus{border-color:var(--accent)}
.dev-para-controls{display:flex;align-items:center;justify-content:space-between}
.dev-para-controls label{font-size:.78rem;color:var(--text-dim);display:flex;align-items:center;gap:6px}
.dev-para-controls button{font-size:.75rem;color:#c44;background:none;border:1px solid #c44;border-radius:6px;padding:3px 10px;cursor:pointer}

/* ── delete button ── */
.dev-delete-btn{width:100%;margin-top:24px;padding:12px;font-family:'Syne',sans-serif;font-size:.88rem;font-weight:600;color:#c44;background:rgba(204,68,68,.06);border:1px solid rgba(204,68,68,.3);border-radius:10px;cursor:pointer;transition:all .2s}
.dev-delete-btn:hover{background:rgba(204,68,68,.12);border-color:#c44}

/* ── toast ── */
.dev-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-80px);padding:12px 28px;border-radius:100px;font-family:'Manrope',sans-serif;font-size:.85rem;font-weight:600;z-index:10003;transition:transform .3s ease;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.15)}
.dev-toast.visible{transform:translateX(-50%) translateY(0)}
.dev-toast.success{background:#2a6a3a;color:#d4f5dc}
.dev-toast.error{background:#7a2a2a;color:#f5d4d4}

/* ── body padding when toolbar visible ── */
.dev-mode main{padding-bottom:58px}
`;
  document.head.appendChild(styleEl);

  // ═══════════════════════════════════
  // PENCIL ICON SVG
  // ═══════════════════════════════════
  const PENCIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>';

  // ═══════════════════════════════════
  // CREATE TOOLBAR
  // ═══════════════════════════════════
  const toolbar = document.createElement('div');
  toolbar.className = 'dev-toolbar';
  toolbar.innerHTML = `
    <div class="dev-toolbar-left">
      <span class="dev-badge">DEV MODE</span>
      <span class="dev-dirty" id="dev-dirty">Unsaved changes</span>
    </div>
    <div class="dev-toolbar-right">
      <button class="dev-btn" id="dev-btn-add-project">+ New Project</button>
      <button class="dev-btn dev-btn-save" id="dev-btn-save">Save to Disk</button>
    </div>`;
  document.body.appendChild(toolbar);

  qs('#dev-btn-save', toolbar).addEventListener('click', saveAll);
  qs('#dev-btn-add-project', toolbar).addEventListener('click', newProject);

  // ═══════════════════════════════════
  // CREATE EDITOR PANEL
  // ═══════════════════════════════════
  const panel = document.createElement('div');
  panel.className = 'dev-panel';
  panel.innerHTML = `
    <div class="dev-panel-head">
      <h3 id="dev-panel-title">Editor</h3>
      <button class="dev-panel-close" id="dev-panel-close">&times;</button>
    </div>
    <div class="dev-panel-body" id="dev-panel-body"></div>
    <div class="dev-panel-foot">
      <button class="dev-btn" id="dev-panel-cancel">Cancel</button>
      <button class="dev-btn dev-btn-save" id="dev-panel-apply">Apply</button>
    </div>`;
  document.body.appendChild(panel);

  const panelBody = qs('#dev-panel-body', panel);
  qs('#dev-panel-close', panel).addEventListener('click', closeEditor);
  qs('#dev-panel-cancel', panel).addEventListener('click', closeEditor);
  qs('#dev-panel-apply',  panel).addEventListener('click', applyEditor);

  // ═══════════════════════════════════
  // CREATE TOAST
  // ═══════════════════════════════════
  const toast = document.createElement('div');
  toast.className = 'dev-toast';
  document.body.appendChild(toast);

  function showToast(msg, type) {
    toast.textContent = msg;
    toast.className = 'dev-toast ' + type;
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  // ═══════════════════════════════════
  // ACTIVATION — 5 clicks on nav name
  // ═══════════════════════════════════
  let clicks = 0, clickTimer;
  document.querySelector('.nav-name').addEventListener('click', e => {
    clicks++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => clicks = 0, 2000);
    if (clicks >= 5) {
      clicks = 0;
      toggle();
      e.stopPropagation();
    }
  });

  function toggle() {
    active = !active;
    document.body.classList.toggle('dev-mode', active);
    toolbar.classList.toggle('visible', active);
    if (active) { addOverlays(); showToast('Dev mode enabled', 'success'); }
    else removeOverlays();
  }

  function markDirty() {
    dirty = true;
    qs('#dev-dirty').classList.add('show');
  }

  // ═══════════════════════════════════
  // EDIT OVERLAYS
  // ═══════════════════════════════════
  function addOverlays() {
    removeOverlays();

    // Banner edit
    addEditBtn('.home-banner', () => editSection('banner'));
    // About edit
    addEditBtn('.about-bio', () => editSection('about'));
    // Contact card edit
    addEditBtn('.contact-card', () => editSection('contact'));

    // Footer edit
    addEditBtn('#site-footer', () => editSection('footer'));

    // Home section edits
    qsa('.home-section').forEach((sec, i) => {
      addEditBtn(sec, () => editHomeSection(i), true);
    });

    // Add-section button on home page
    const sectionsWrap = qs('.home-sections');
    if (sectionsWrap && !qs('.dev-add-section', sectionsWrap)) {
      const addSec = document.createElement('div');
      addSec.className = 'dev-add-card dev-overlay-item dev-add-section';
      addSec.textContent = '+ New Section';
      addSec.style.minHeight = '120px';
      addSec.addEventListener('click', newHomeSection);
      sectionsWrap.appendChild(addSec);
    }

    // Project card edits
    qsa('.project-card').forEach((card, i) => {
      // Cards appear twice (home + projects page), map index to actual project
      const projIndex = i % projects.length;
      addEditBtn(card, () => editProject(projIndex), true);
    });

    // Add-project card on projects page
    const grid = qs('.projects-grid');
    if (grid && !qs('.dev-add-card', grid)) {
      const addCard = document.createElement('div');
      addCard.className = 'dev-add-card dev-overlay-item';
      addCard.textContent = '+ New Project';
      addCard.addEventListener('click', newProject);
      grid.appendChild(addCard);
    }
  }

  function addEditBtn(target, onClick, isElement) {
    const el = isElement ? target : qs(target);
    if (!el) return;
    el.style.position = el.style.position || 'relative';
    const btn = document.createElement('button');
    btn.className = 'dev-edit-icon dev-overlay-item';
    btn.innerHTML = PENCIL;
    btn.addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); onClick(); });
    el.appendChild(btn);
  }

  function removeOverlays() {
    qsa('.dev-overlay-item').forEach(el => el.remove());
  }

  // ═══════════════════════════════════
  // EDITOR PANEL — open / close
  // ═══════════════════════════════════
  function openEditor(title) {
    qs('#dev-panel-title', panel).textContent = title;
    panel.classList.add('visible');
  }

  function closeEditor() {
    panel.classList.remove('visible');
    editorState = null;
  }

  // ═══════════════════════════════════
  // SECTION EDITORS (banner, about, contact)
  // ═══════════════════════════════════
  function editSection(type) {
    let data;
    if (type === 'banner')  data = JSON.parse(JSON.stringify(bannerConfig));
    if (type === 'about')   data = JSON.parse(JSON.stringify(aboutConfig));
    if (type === 'contact') data = JSON.parse(JSON.stringify(contactConfig));
    if (type === 'footer')  data = JSON.parse(JSON.stringify(footerConfig));
    editorState = { type, data };

    if (type === 'banner')  renderBannerEditor();
    if (type === 'about')   renderAboutEditor();
    if (type === 'contact') renderContactEditor();
    if (type === 'footer')  renderFooterEditor();

    openEditor('Edit ' + type.charAt(0).toUpperCase() + type.slice(1));
  }

  /* ── Banner ── */
  function renderBannerEditor() {
    const d = editorState.data;
    panelBody.innerHTML = `
      <div class="dev-field"><label>Title</label>
        <input type="text" id="dev-e-title" value="${esc(d.title)}"></div>
      <div class="dev-field"><label>Subtitle</label>
        <input type="text" id="dev-e-subtitle" value="${esc(d.subtitle)}"></div>`;
    qs('#dev-e-title', panelBody).addEventListener('input', e => d.title = e.target.value);
    qs('#dev-e-subtitle', panelBody).addEventListener('input', e => d.subtitle = e.target.value);
  }

  /* ── Footer ── */
  function renderFooterEditor() {
    const d = editorState.data;
    panelBody.innerHTML = `
      <div class="dev-field"><label>Heading</label>
        <input type="text" id="dev-e-fhead" value="${esc(d.heading)}"></div>
      <div class="dev-field"><label>Text</label>
        <textarea id="dev-e-ftext" rows="3">${esc(d.text)}</textarea></div>
      <div class="dev-field"><label>Copyright Name</label>
        <input type="text" id="dev-e-fcopy" value="${esc(d.copyright)}"></div>`;
    qs('#dev-e-fhead', panelBody).addEventListener('input', e => d.heading = e.target.value);
    qs('#dev-e-ftext', panelBody).addEventListener('input', e => d.text = e.target.value);
    qs('#dev-e-fcopy', panelBody).addEventListener('input', e => d.copyright = e.target.value);
  }

  /* ── About ── */
  function renderAboutEditor() {
    const d = editorState.data;
    panelBody.innerHTML = `
      <div class="dev-field"><label>Heading</label>
        <input type="text" id="dev-e-heading" value="${esc(d.heading)}"></div>

      <div class="dev-field"><label>Paragraphs</label>
        <div id="dev-e-paras"></div>
        <button class="dev-btn" id="dev-e-add-para" style="margin-top:6px;font-size:.78rem">+ Add Paragraph</button>
      </div>

      <div class="dev-field"><label>Skills</label>
        <div class="dev-tags" id="dev-e-skills"></div>
        <div class="dev-tag-add"><input type="text" id="dev-e-skill-input" placeholder="Add skill..."><button id="dev-e-skill-add">+</button></div>
      </div>

      <div class="dev-field"><label>Hero Image Path</label>
        <input type="text" id="dev-e-hero" value="${esc(d.heroImage)}">
        <div class="dev-img-preview" style="margin-top:8px">
          <img src="${esc(d.heroImage)}" id="dev-e-hero-img">
          <button class="dev-btn-sm" id="dev-e-hero-upload">Upload New</button>
          <input type="file" accept="image/*" style="display:none" id="dev-e-hero-file">
        </div>
      </div>

      <div class="dev-field"><label>Avatar Image Path</label>
        <input type="text" id="dev-e-avatar" value="${esc(d.avatarImage)}">
        <div class="dev-img-preview" style="margin-top:8px">
          <img src="${esc(d.avatarImage)}" id="dev-e-avatar-img">
          <button class="dev-btn-sm" id="dev-e-avatar-upload">Upload New</button>
          <input type="file" accept="image/*" style="display:none" id="dev-e-avatar-file">
        </div>
      </div>`;

    // Heading
    qs('#dev-e-heading', panelBody).addEventListener('input', e => d.heading = e.target.value);

    // Paragraphs
    renderParas();
    qs('#dev-e-add-para', panelBody).addEventListener('click', () => {
      d.paragraphs.push({ text: '', dim: false });
      renderParas();
    });

    // Skills
    renderSkills();
    qs('#dev-e-skill-add', panelBody).addEventListener('click', addSkill);
    qs('#dev-e-skill-input', panelBody).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } });

    function addSkill() {
      const inp = qs('#dev-e-skill-input', panelBody);
      const val = inp.value.trim();
      if (val && !d.skills.includes(val)) { d.skills.push(val); renderSkills(); }
      inp.value = '';
    }

    // Hero image
    qs('#dev-e-hero', panelBody).addEventListener('input', e => {
      d.heroImage = e.target.value;
      qs('#dev-e-hero-img', panelBody).src = e.target.value;
    });
    qs('#dev-e-hero-upload', panelBody).addEventListener('click', () => qs('#dev-e-hero-file', panelBody).click());
    qs('#dev-e-hero-file', panelBody).addEventListener('change', async e => {
      const file = e.target.files[0]; if (!file) return;
      const res = await uploadFile(file.name, file);
      if (res) {
        d.heroImage = res;
        qs('#dev-e-hero', panelBody).value = res;
        qs('#dev-e-hero-img', panelBody).src = res;
      }
    });

    // Avatar image
    qs('#dev-e-avatar', panelBody).addEventListener('input', e => {
      d.avatarImage = e.target.value;
      qs('#dev-e-avatar-img', panelBody).src = e.target.value;
    });
    qs('#dev-e-avatar-upload', panelBody).addEventListener('click', () => qs('#dev-e-avatar-file', panelBody).click());
    qs('#dev-e-avatar-file', panelBody).addEventListener('change', async e => {
      const file = e.target.files[0]; if (!file) return;
      const res = await uploadFile(file.name, file);
      if (res) {
        d.avatarImage = res;
        qs('#dev-e-avatar', panelBody).value = res;
        qs('#dev-e-avatar-img', panelBody).src = res;
      }
    });
  }

  function renderParas() {
    const d = editorState.data;
    const container = qs('#dev-e-paras', panelBody);
    container.innerHTML = d.paragraphs.map((p, i) => `
      <div class="dev-para-item" data-idx="${i}">
        <textarea>${esc(p.text)}</textarea>
        <div class="dev-para-controls">
          <label><input type="checkbox" ${p.dim ? 'checked' : ''}> Dim text</label>
          <button data-remove="${i}">Remove</button>
        </div>
      </div>`).join('');

    container.querySelectorAll('.dev-para-item').forEach((item, i) => {
      item.querySelector('textarea').addEventListener('input', e => d.paragraphs[i].text = e.target.value);
      item.querySelector('input[type="checkbox"]').addEventListener('change', e => d.paragraphs[i].dim = e.target.checked);
      item.querySelector('button[data-remove]').addEventListener('click', () => {
        d.paragraphs.splice(i, 1);
        renderParas();
      });
    });
  }

  function renderSkills() {
    const d = editorState.data;
    const container = qs('#dev-e-skills', panelBody);
    container.innerHTML = d.skills.map((s, i) =>
      `<span class="dev-tag">${esc(s)}<button data-rm="${i}">&times;</button></span>`
    ).join('');
    container.querySelectorAll('button[data-rm]').forEach(btn => {
      btn.addEventListener('click', () => {
        d.skills.splice(+btn.dataset.rm, 1);
        renderSkills();
      });
    });
  }

  /* ── Contact ── */
  function renderContactEditor() {
    const d = editorState.data;
    panelBody.innerHTML = `
      <div class="dev-field"><label>Name</label>
        <input type="text" id="dev-e-cname" value="${esc(d.name)}"></div>
      <div class="dev-field"><label>Subtitle</label>
        <input type="text" id="dev-e-csub" value="${esc(d.subtitle)}"></div>
      <div class="dev-field"><label>Email</label>
        <input type="email" id="dev-e-cemail" value="${esc(d.email)}"></div>
      <div class="dev-field"><label>CTA Text</label>
        <input type="text" id="dev-e-ccta" value="${esc(d.cta || '')}"></div>
      <div class="dev-field"><label>Avatar Image Path</label>
        <input type="text" id="dev-e-cavatar" value="${esc(d.avatarImage)}"></div>

      <div class="dev-field"><label>Buttons</label>
        <div id="dev-e-cbuttons"></div>
        <button class="dev-btn" id="dev-e-cadd-btn" style="margin-top:6px;font-size:.78rem">+ Add Button</button>
      </div>`;

    qs('#dev-e-cname', panelBody).addEventListener('input', e => d.name = e.target.value);
    qs('#dev-e-csub', panelBody).addEventListener('input', e => d.subtitle = e.target.value);
    qs('#dev-e-cemail', panelBody).addEventListener('input', e => d.email = e.target.value);
    qs('#dev-e-ccta', panelBody).addEventListener('input', e => d.cta = e.target.value);
    qs('#dev-e-cavatar', panelBody).addEventListener('input', e => d.avatarImage = e.target.value);

    renderButtons();
    qs('#dev-e-cadd-btn', panelBody).addEventListener('click', () => {
      d.buttons.push({ label: 'New', href: '#', isEmail: false });
      renderButtons();
    });
  }

  function renderButtons() {
    const d = editorState.data;
    const container = qs('#dev-e-cbuttons', panelBody);
    container.innerHTML = d.buttons.map((b, i) => `
      <div class="dev-para-item" data-idx="${i}">
        <div style="display:flex;gap:8px;margin-bottom:6px">
          <input type="text" value="${esc(b.label)}" placeholder="Label" style="flex:1;font-size:.82rem;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg-raised);color:var(--text-bright)">
          <input type="text" value="${esc(b.href)}" placeholder="URL" style="flex:2;font-size:.82rem;padding:6px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg-raised);color:var(--text-bright)">
        </div>
        <div class="dev-para-controls">
          <label><input type="checkbox" ${b.isEmail ? 'checked' : ''}> Email link</label>
          <button data-remove="${i}">Remove</button>
        </div>
      </div>`).join('');

    container.querySelectorAll('.dev-para-item').forEach((item, i) => {
      const inputs = item.querySelectorAll('input[type="text"]');
      inputs[0].addEventListener('input', e => d.buttons[i].label = e.target.value);
      inputs[1].addEventListener('input', e => d.buttons[i].href = e.target.value);
      item.querySelector('input[type="checkbox"]').addEventListener('change', e => d.buttons[i].isEmail = e.target.checked);
      item.querySelector('button[data-remove]').addEventListener('click', () => {
        d.buttons.splice(i, 1);
        renderButtons();
      });
    });
  }

  // ═══════════════════════════════════
  // PROJECT EDITOR
  // ═══════════════════════════════════
  function editProject(index) {
    const copy = JSON.parse(JSON.stringify(projects[index]));
    copy._index = index;
    editorState = { type: 'project', data: copy, pendingFiles: { thumbnail: null, screenshots: [], videos: [] } };
    renderProjectEditor();
    openEditor('Edit Project');
  }

  function newProject() {
    const data = {
      name: '', description: '', longDescription: '',
      tags: [], date: new Date().toISOString().slice(0, 7),
      featured: false, links: {}, folder: '',
      thumbnail: '', screenshots: [], videos: [],
      _isNew: true,
    };
    editorState = { type: 'project', data, pendingFiles: { thumbnail: null, screenshots: [], videos: [] } };
    renderProjectEditor();
    openEditor('New Project');
  }

  function renderProjectEditor() {
    const d = editorState.data;
    panelBody.innerHTML = `
      <div class="dev-field"><label>Project Name</label>
        <input type="text" id="dev-p-name" value="${esc(d.name)}"></div>
      <div class="dev-field"><label>Short Description</label>
        <input type="text" id="dev-p-desc" value="${esc(d.description)}"></div>
      <div class="dev-field"><label>Long Description</label>
        <textarea id="dev-p-long" rows="5">${esc(d.longDescription)}</textarea></div>
      <div class="dev-field"><label>Date (YYYY-MM)</label>
        <input type="text" id="dev-p-date" value="${esc(d.date)}"></div>
      <div class="dev-check">
        <input type="checkbox" id="dev-p-featured" ${d.featured ? 'checked' : ''}> Featured</div>

      <div class="dev-field"><label>Tags</label>
        <div class="dev-tags" id="dev-p-tags"></div>
        <div class="dev-tag-add"><input type="text" id="dev-p-tag-input" placeholder="Add tag..."><button id="dev-p-tag-add">+</button></div>
      </div>

      <div class="dev-field"><label>Live URL</label>
        <input type="url" id="dev-p-live" value="${esc(d.links.live || '')}"></div>
      <div class="dev-field"><label>GitHub URL</label>
        <input type="url" id="dev-p-github" value="${esc(d.links.github || '')}"></div>
      <div class="dev-field"><label>Download URL</label>
        <input type="url" id="dev-p-download" value="${esc(d.links.download || '')}"></div>

      <div class="dev-field"><label>Thumbnail</label>
        <div id="dev-p-thumb-preview"></div>
        <button class="dev-btn" id="dev-p-thumb-upload" style="font-size:.78rem;margin-top:6px">Upload Thumbnail</button>
        <input type="file" accept="image/*" style="display:none" id="dev-p-thumb-file">
      </div>

      <div class="dev-field"><label>Screenshots</label>
        <div class="dev-media-grid" id="dev-p-screenshots"></div>
        <button class="dev-btn" id="dev-p-ss-upload" style="font-size:.78rem">+ Add Screenshot</button>
        <input type="file" accept="image/*" multiple style="display:none" id="dev-p-ss-file">
      </div>

      <div class="dev-field"><label>Videos</label>
        <div class="dev-media-grid" id="dev-p-videos"></div>
        <button class="dev-btn" id="dev-p-vid-upload" style="font-size:.78rem">+ Add Video</button>
        <input type="file" accept="video/*" style="display:none" id="dev-p-vid-file">
      </div>

      ${!d._isNew ? '<button class="dev-delete-btn" id="dev-p-delete">Delete Project</button>' : ''}`;

    // Text inputs
    qs('#dev-p-name', panelBody).addEventListener('input', e => d.name = e.target.value);
    qs('#dev-p-desc', panelBody).addEventListener('input', e => d.description = e.target.value);
    qs('#dev-p-long', panelBody).addEventListener('input', e => d.longDescription = e.target.value);
    qs('#dev-p-date', panelBody).addEventListener('input', e => d.date = e.target.value);
    qs('#dev-p-featured', panelBody).addEventListener('change', e => d.featured = e.target.checked);
    qs('#dev-p-live', panelBody).addEventListener('input', e => { d.links.live = e.target.value; });
    qs('#dev-p-github', panelBody).addEventListener('input', e => { d.links.github = e.target.value; });
    qs('#dev-p-download', panelBody).addEventListener('input', e => { d.links.download = e.target.value; });

    // Tags
    renderProjectTags();
    qs('#dev-p-tag-add', panelBody).addEventListener('click', addProjTag);
    qs('#dev-p-tag-input', panelBody).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addProjTag(); } });

    function addProjTag() {
      const inp = qs('#dev-p-tag-input', panelBody);
      const val = inp.value.trim();
      if (val && !d.tags.includes(val)) { d.tags.push(val); renderProjectTags(); }
      inp.value = '';
    }

    // Thumbnail
    renderThumbPreview();
    qs('#dev-p-thumb-upload', panelBody).addEventListener('click', () => qs('#dev-p-thumb-file', panelBody).click());
    qs('#dev-p-thumb-file', panelBody).addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      editorState.pendingFiles.thumbnail = file;
      renderThumbPreview();
    });

    // Screenshots
    renderScreenshots();
    qs('#dev-p-ss-upload', panelBody).addEventListener('click', () => qs('#dev-p-ss-file', panelBody).click());
    qs('#dev-p-ss-file', panelBody).addEventListener('change', e => {
      for (const file of e.target.files) editorState.pendingFiles.screenshots.push(file);
      renderScreenshots();
    });

    // Videos
    renderVideos();
    qs('#dev-p-vid-upload', panelBody).addEventListener('click', () => qs('#dev-p-vid-file', panelBody).click());
    qs('#dev-p-vid-file', panelBody).addEventListener('change', e => {
      for (const file of e.target.files) editorState.pendingFiles.videos.push(file);
      renderVideos();
    });

    // Delete
    const delBtn = qs('#dev-p-delete', panelBody);
    if (delBtn) delBtn.addEventListener('click', deleteProject);
  }

  function renderProjectTags() {
    const d = editorState.data;
    const container = qs('#dev-p-tags', panelBody);
    container.innerHTML = d.tags.map((t, i) =>
      `<span class="dev-tag">${esc(t)}<button data-rm="${i}">&times;</button></span>`
    ).join('');
    container.querySelectorAll('button[data-rm]').forEach(btn =>
      btn.addEventListener('click', () => { d.tags.splice(+btn.dataset.rm, 1); renderProjectTags(); })
    );
  }

  function renderThumbPreview() {
    const d = editorState.data;
    const pending = editorState.pendingFiles.thumbnail;
    const container = qs('#dev-p-thumb-preview', panelBody);
    const src = pending ? URL.createObjectURL(pending) : d.thumbnail;
    container.innerHTML = src
      ? `<div class="dev-img-preview"><img src="${esc(src)}"><span style="font-size:.78rem;color:var(--text-dim)">${pending ? pending.name : d.thumbnail}</span></div>`
      : '<span style="font-size:.82rem;color:var(--text-dim)">No thumbnail set</span>';
  }

  function renderScreenshots() {
    const d = editorState.data;
    const pending = editorState.pendingFiles.screenshots;
    const container = qs('#dev-p-screenshots', panelBody);
    let html = '';

    // Existing
    d.screenshots.forEach((s, i) => {
      html += `<div class="dev-media-item"><img src="${esc(s)}"><button data-rm-ss="${i}">&times;</button></div>`;
    });
    // Pending
    pending.forEach((f, i) => {
      html += `<div class="dev-media-item"><img src="${URL.createObjectURL(f)}"><button data-rm-pss="${i}">&times;</button></div>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('button[data-rm-ss]').forEach(btn =>
      btn.addEventListener('click', () => { d.screenshots.splice(+btn.dataset.rmSs, 1); renderScreenshots(); })
    );
    container.querySelectorAll('button[data-rm-pss]').forEach(btn =>
      btn.addEventListener('click', () => { pending.splice(+btn.dataset.rmPss, 1); renderScreenshots(); })
    );
  }

  function renderVideos() {
    const d = editorState.data;
    const pending = editorState.pendingFiles.videos;
    const container = qs('#dev-p-videos', panelBody);
    let html = '';

    d.videos.forEach((v, i) => {
      html += `<div class="dev-media-item"><video src="${esc(v)}"></video><button data-rm-vid="${i}">&times;</button></div>`;
    });
    pending.forEach((f, i) => {
      html += `<div class="dev-media-item"><video src="${URL.createObjectURL(f)}"></video><button data-rm-pvid="${i}">&times;</button></div>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('button[data-rm-vid]').forEach(btn =>
      btn.addEventListener('click', () => { d.videos.splice(+btn.dataset.rmVid, 1); renderVideos(); })
    );
    container.querySelectorAll('button[data-rm-pvid]').forEach(btn =>
      btn.addEventListener('click', () => { pending.splice(+btn.dataset.rmPvid, 1); renderVideos(); })
    );
  }

  async function deleteProject() {
    if (!confirm('Delete this project? This will remove the project folder and all its files.')) return;
    const d = editorState.data;
    const index = d._index;

    if (d.folder) {
      try { await fetch('/api/delete-project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ folder: d.folder }) }); }
      catch (e) { showToast('Error deleting folder: ' + e.message, 'error'); }
    }

    projects.splice(index, 1);
    markDirty();
    closeEditor();
    refresh();
    showToast('Project deleted', 'success');
  }

  // ═══════════════════════════════════
  // HOME SECTION EDITOR
  // ═══════════════════════════════════
  function editHomeSection(index) {
    const copy = JSON.parse(JSON.stringify(homeSections[index]));
    copy._index = index;
    editorState = { type: 'section', data: copy, pendingFiles: { image: null } };
    renderSectionEditor();
    openEditor('Edit Section');
  }

  function newHomeSection() {
    const data = {
      heading: '', text: '', image: '',
      imageLeft: true, bgColor: '#f5f3f0',
      _isNew: true,
    };
    editorState = { type: 'section', data, pendingFiles: { image: null } };
    renderSectionEditor();
    openEditor('New Section');
  }

  function renderSectionEditor() {
    const d = editorState.data;
    panelBody.innerHTML = `
      <div class="dev-field"><label>Heading</label>
        <input type="text" id="dev-s-heading" value="${esc(d.heading)}"></div>
      <div class="dev-field"><label>Text</label>
        <textarea id="dev-s-text" rows="5">${esc(d.text)}</textarea></div>

      <div class="dev-field"><label>Image</label>
        <div id="dev-s-img-preview"></div>
        <button class="dev-btn" id="dev-s-img-upload" style="font-size:.78rem;margin-top:6px">Upload Image</button>
        <input type="file" accept="image/*" style="display:none" id="dev-s-img-file">
        <div style="margin-top:6px"><label style="font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim)">Or image path</label>
          <input type="text" id="dev-s-img-path" value="${esc(d.image)}" style="width:100%;font-size:.85rem;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text-bright);margin-top:4px">
        </div>
      </div>

      <div class="dev-check">
        <input type="checkbox" id="dev-s-imgleft" ${d.imageLeft ? 'checked' : ''}> Image on left</div>

      <div class="dev-field"><label>Background Color</label>
        <div style="display:flex;gap:10px;align-items:center">
          <input type="color" id="dev-s-bgcolor" value="${d.bgColor || '#f5f3f0'}" style="width:48px;height:36px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px">
          <input type="text" id="dev-s-bgcolor-text" value="${esc(d.bgColor || '#f5f3f0')}" style="flex:1;font-size:.85rem;padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text-bright)">
        </div>
      </div>

      ${!d._isNew ? '<button class="dev-delete-btn" id="dev-s-delete">Delete Section</button>' : ''}`;

    qs('#dev-s-heading', panelBody).addEventListener('input', e => d.heading = e.target.value);
    qs('#dev-s-text', panelBody).addEventListener('input', e => d.text = e.target.value);
    qs('#dev-s-imgleft', panelBody).addEventListener('change', e => d.imageLeft = e.target.checked);

    // Background color
    qs('#dev-s-bgcolor', panelBody).addEventListener('input', e => {
      d.bgColor = e.target.value;
      qs('#dev-s-bgcolor-text', panelBody).value = e.target.value;
    });
    qs('#dev-s-bgcolor-text', panelBody).addEventListener('input', e => {
      d.bgColor = e.target.value;
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) qs('#dev-s-bgcolor', panelBody).value = e.target.value;
    });

    // Image preview
    renderSectionImgPreview();
    qs('#dev-s-img-path', panelBody).addEventListener('input', e => {
      d.image = e.target.value;
      renderSectionImgPreview();
    });
    qs('#dev-s-img-upload', panelBody).addEventListener('click', () => qs('#dev-s-img-file', panelBody).click());
    qs('#dev-s-img-file', panelBody).addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      editorState.pendingFiles.image = file;
      renderSectionImgPreview();
    });

    // Delete
    const delBtn = qs('#dev-s-delete', panelBody);
    if (delBtn) delBtn.addEventListener('click', () => {
      if (!confirm('Delete this section?')) return;
      homeSections.splice(d._index, 1);
      markDirty();
      closeEditor();
      refresh();
      showToast('Section deleted', 'success');
    });
  }

  function renderSectionImgPreview() {
    const d = editorState.data;
    const pending = editorState.pendingFiles.image;
    const container = qs('#dev-s-img-preview', panelBody);
    const src = pending ? URL.createObjectURL(pending) : d.image;
    container.innerHTML = src
      ? `<div class="dev-img-preview"><img src="${esc(src)}"><span style="font-size:.78rem;color:var(--text-dim)">${pending ? pending.name : d.image}</span></div>`
      : '<span style="font-size:.82rem;color:var(--text-dim)">No image set</span>';
  }

  // ═══════════════════════════════════
  // APPLY EDITOR
  // ═══════════════════════════════════
  async function applyEditor() {
    if (!editorState) return;
    const { type, data } = editorState;

    if (type === 'banner') {
      Object.assign(bannerConfig, data);
    } else if (type === 'about') {
      Object.assign(aboutConfig, data);
    } else if (type === 'contact') {
      Object.assign(contactConfig, data);
    } else if (type === 'footer') {
      Object.assign(footerConfig, data);
    } else if (type === 'section') {
      // Upload pending image
      const pf = editorState.pendingFiles;
      if (pf.image) {
        try {
          const p = await uploadFile(pf.image.name, pf.image);
          if (p) data.image = p;
        } catch (e) {
          showToast('Upload error: ' + e.message, 'error');
          return;
        }
      }
      if (data._isNew) {
        delete data._isNew;
        homeSections.push(data);
      } else {
        const idx = data._index;
        delete data._index;
        homeSections[idx] = data;
      }
    } else if (type === 'project') {
      // Derive folder for new projects
      if (data._isNew && data.name) {
        data.folder = 'projects/' + data.name;
      }

      if (!data.folder) {
        showToast('Project needs a name', 'error');
        return;
      }

      // Upload pending files
      const pf = editorState.pendingFiles;
      try {
        if (pf.thumbnail) {
          const p = await uploadFile(data.folder + '/screenshots/' + pf.thumbnail.name, pf.thumbnail);
          if (p) data.thumbnail = p;
        }
        for (const file of pf.screenshots) {
          const p = await uploadFile(data.folder + '/screenshots/' + file.name, file);
          if (p) data.screenshots.push(p);
        }
        for (const file of pf.videos) {
          const p = await uploadFile(data.folder + '/videos/' + file.name, file);
          if (p) data.videos.push(p);
        }
      } catch (e) {
        showToast('Upload error: ' + e.message, 'error');
        return;
      }

      // Clean link entries that are empty
      if (data.links) {
        Object.keys(data.links).forEach(k => { if (!data.links[k]) delete data.links[k]; });
      }

      if (data._isNew) {
        delete data._isNew;
        projects.push(data);
      } else {
        const idx = data._index;
        delete data._index;
        projects[idx] = data;
      }
    }

    markDirty();
    closeEditor();
    refresh();
    showToast('Changes applied (click Save to Disk to persist)', 'success');
  }

  // ═══════════════════════════════════
  // FILE UPLOAD
  // ═══════════════════════════════════
  async function uploadFile(destPath, file) {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'X-Path': destPath, 'Content-Type': file.type },
      body: file,
    });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.path;
  }

  // ═══════════════════════════════════
  // SAVE ALL TO DISK
  // ═══════════════════════════════════
  async function saveAll() {
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects, homeProjects, homeSections, bannerConfig, aboutConfig, contactConfig, footerConfig }),
      });
      if (!res.ok) throw new Error('Save failed');
      dirty = false;
      qs('#dev-dirty').classList.remove('show');
      showToast('Saved to disk!', 'success');
    } catch (e) {
      showToast('Save error: ' + e.message, 'error');
    }
  }

  // ═══════════════════════════════════
  // REFRESH — re-render all pages
  // ═══════════════════════════════════
  function refresh() {
    renderHome();
    renderProjects();
    renderAbout();
    renderContact();
    renderFooter();
    if (active) setTimeout(addOverlays, 400);
  }
})();
