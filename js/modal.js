// ════════════════════════════════════
// PROJECT DETAIL PAGE
// ════════════════════════════════════

let currentModalIndex = -1;
let previousPage = 'home';

function openModal(index) {
  currentModalIndex = index;
  const p = projects[index];
  const el = document.getElementById('page-project');

  const linksHtml = Object.entries(p.links || {})
    .filter(([, url]) => url)
    .map(([key, url]) => {
      const label = key === 'live' ? 'Play / View' : key === 'github' ? 'GitHub' : 'Download';
      return `<a class="modal-link" href="${url}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        ${label}
      </a>`;
    }).join('');

  el.innerHTML = `
    <div class="project-detail">
      <button class="project-back" onclick="goBackFromProject()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back
      </button>
      <div class="project-detail-hero">
        ${p.videos && p.videos.length
          ? `<video src="${p.videos[0]}" controls poster="${p.thumbnail}"></video>`
          : `<img src="${p.thumbnail}" alt="${p.name}">`
        }
      </div>
      <div class="project-detail-body">
        <div class="modal-tags">
          ${p.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
        <h2>${p.name}</h2>
        <p class="modal-desc">${p.longDescription}</p>
        ${p.screenshots && p.screenshots.length ? `
          <div class="modal-screenshots">
            ${p.screenshots.map(s => `<img src="${s}" alt="Screenshot">`).join('')}
          </div>
        ` : ''}
        ${p.videos && p.videos.length > 1 ? p.videos.slice(1).map(v => `
          <video class="modal-video" src="${v}" controls></video>
        `).join('') : ''}
        ${linksHtml ? `<div class="modal-links">${linksHtml}</div>` : ''}
      </div>
    </div>`;

  // remember which page we came from
  const activePage = document.querySelector('.page.active.visible');
  if (activePage) {
    previousPage = activePage.id.replace('page-', '');
  }

  switchPage('project');
}

function goBackFromProject() {
  // pause any playing videos
  document.getElementById('page-project').querySelectorAll('video').forEach(v => v.pause());
  switchPage(previousPage);
}
