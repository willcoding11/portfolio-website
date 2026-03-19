// ════════════════════════════════════
// PAGE SWITCHING
// ════════════════════════════════════

const allPages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

function switchPage(id) {
  allPages.forEach(p => {
    p.classList.remove('visible');
    setTimeout(() => p.classList.remove('active'), 350);
  });
  navLinks.forEach(l => l.classList.remove('active'));

  setTimeout(() => {
    const target = document.getElementById('page-' + id);
    target.classList.add('active');
    void target.offsetWidth;
    requestAnimationFrame(() => target.classList.add('visible'));
    window.scrollTo(0, 0);
  }, 360);

  navLinks.forEach(l => {
    if (l.dataset.page === id) l.classList.add('active');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => switchPage(link.dataset.page));
});

// ── Init ──
renderHome();
renderProjects();
renderAbout();
renderContact();
renderFooter();
