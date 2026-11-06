(() => {
  'use strict';
  const stages = [...document.querySelectorAll('.value-stage')];
  const links = [...document.querySelectorAll('[data-stage-link]')];
  let current = 0;
  let presenting = false;
  const select = index => {
    current = Math.max(0, Math.min(stages.length - 1, index));
    stages.forEach((stage, position) => {
      stage.classList.toggle('stage-active', position === current);
      stage.hidden = presenting && position !== current;
    });
    links.forEach((link, position) => {
      if (position === current) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    document.getElementById('value-position').textContent = `Etapa ${current + 1} de ${stages.length} · ${links[current].textContent.trim().replace(/^\d+/, '')}`;
    document.getElementById('value-prev').disabled = current === 0;
    document.getElementById('value-next').disabled = current === stages.length - 1;
  };
  const address = index => history.replaceState(null, '', location.pathname + '#' + stages[index].id);
  function go(index, focus = false) {
    select(index); address(current);
    const target = presenting ? document.getElementById('percurso') : stages[current];
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (focus) {
      const heading = stages[current].querySelector('h2'); heading.tabIndex = -1; heading.focus({ preventScroll: true });
    }
  }
  function presentation(enabled) {
    presenting = enabled;
    document.body.classList.toggle('value-presenting', enabled);
    document.getElementById('value-present').setAttribute('aria-pressed', String(enabled));
    select(current); go(current, !enabled);
    if (enabled) document.getElementById(current === stages.length - 1 ? 'value-exit' : 'value-next').focus({ preventScroll: true });
  }
  for (const link of links) link.addEventListener('click', event => { event.preventDefault(); go(Number(link.dataset.stageLink), true); });
  for (const anchor of document.querySelectorAll('.value-route-art a,.stage-next')) anchor.addEventListener('click', event => {
    const id = anchor.getAttribute('href').slice(1); const index = stages.findIndex(stage => stage.id === id);
    if (index >= 0) { event.preventDefault(); go(index, true); }
  });
  document.getElementById('value-present').addEventListener('click', () => { select(0); presentation(true); });
  document.getElementById('value-exit').addEventListener('click', () => presentation(false));
  document.getElementById('value-prev').addEventListener('click', () => go(current - 1, true));
  document.getElementById('value-next').addEventListener('click', () => go(current + 1, true));
  for (const button of document.querySelectorAll('[data-open-capabilities]')) button.addEventListener('click', () => {
    const index = Number(button.dataset.openCapabilities); select(index); presentation(false);
    document.getElementById('frentes-' + stages[index].id).scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  for (const button of document.querySelectorAll('.expand-stage')) {
    const details = [...button.closest('.stage-capabilities').querySelectorAll('details')];
    const sync = () => {
      const expanded = details.every(item => item.open);
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = `${expanded ? 'Recolher' : 'Expandir'} as ${details.length} frentes ${expanded ? '−' : '+'}`;
    };
    button.addEventListener('click', () => { const open = !details.every(item => item.open); details.forEach(item => { item.open = open; }); sync(); });
    details.forEach(item => item.addEventListener('toggle', sync));
  }
  window.addEventListener('keydown', event => {
    if (!presenting || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (event.key === 'Escape') { event.preventDefault(); presentation(false); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(current + 1, true); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(current - 1, true); }
  });
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (presenting || scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      scrollPending = false;
      if (presenting) return;
      const boundary = document.querySelector('.value-nav-wrap').offsetHeight + 45;
      let index = 0;
      stages.forEach((stage, position) => { if (stage.getBoundingClientRect().top <= boundary) index = position; });
      if (index !== current) select(index);
    });
  }, { passive: true });
  const followHash = () => { const index = stages.findIndex(stage => '#' + stage.id === location.hash); if (index >= 0) select(index); };
  window.addEventListener('hashchange', followHash);
  select(0); followHash();
  window.addEventListener('load', () => { const index = stages.findIndex(stage => '#' + stage.id === location.hash); if (index >= 0) go(index); });
  window.valueChainApi = { getState: () => ({ stage: current, presenting }), go, presentation };
})();
