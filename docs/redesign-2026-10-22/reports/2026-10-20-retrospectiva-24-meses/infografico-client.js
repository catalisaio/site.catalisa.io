(() => {
  const nav = document.querySelector('.chapter-nav');
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let frame;

  function updateNavigation() {
    const current = sections.filter(section => section.getBoundingClientRect().top < 180).at(-1);
    for (const link of links) {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    const available = document.documentElement.scrollHeight - innerHeight;
    nav.style.setProperty('--progress', `${available > 0 ? scrollY / available * 100 : 0}%`);
    frame = undefined;
  }

  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(updateNavigation);
  }, { passive: true });
  addEventListener('resize', updateNavigation);

  function revealTarget() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const details = target?.closest('details');
    if (details) {
      details.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }

  addEventListener('hashchange', () => {
    revealTarget();
    requestAnimationFrame(updateNavigation);
  });
  addEventListener('pageshow', updateNavigation);
  revealTarget();
  updateNavigation();
})();
