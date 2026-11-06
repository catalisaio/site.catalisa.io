(() => {
  const data = JSON.parse(document.getElementById('diligence-client-data').textContent);
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const forms = [...document.querySelectorAll('[data-filter-form]')];
  const records = new Map();
  for (const form of forms) {
    const scope = form.dataset.filterForm;
    const items = [...document.querySelectorAll(`[data-filter-item="${scope}"]`)];
    records.set(scope, items.map(element => ({ element, text: normalize(element.textContent) })));
    const apply = () => {
      const query = normalize(form.elements.query.value).trim().split(/\s+/).filter(Boolean);
      const group = form.elements.group.value;
      let count = 0;
      for (const { element, text } of records.get(scope)) {
        element.hidden = Boolean((group && element.dataset.group !== group) || query.some(term => !text.includes(term)));
        if (!element.hidden) count++;
      }
      document.querySelector(`[data-filter-count="${scope}"]`).textContent = `${count} de ${items.length} registros${count ? '' : ' · nenhum resultado para este recorte'}`;
    };
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', apply);
    form.addEventListener('change', apply);
    form.addEventListener('reset', () => setTimeout(apply, 0));
    apply();
  }
  const columns = {
    requests: [['id', 'Pedido'], ['finding', 'Questão'], ['domain', 'Domínio'], ['title', 'Título'], ['priority', 'Prioridade proposta'], ['owner', 'Função sugerida'], ['status', 'Situação'], ['requested', 'Documento ou prova solicitada'], ['acceptance', 'Critério de encerramento'], ['audience', 'Compartilhamento']],
    risks: [['id', 'Risco'], ['title', 'Título'], ['priority', 'Prioridade proposta'], ['status', 'Situação'], ['probability', 'Probabilidade'], ['financialExposure', 'Exposição financeira'], ['findings', 'Questões'], ['decision', 'Decisão afetada'], ['closure', 'Encerramento']],
    vendor: [['id', 'Controle'], ['group', 'Grupo'], ['title', 'Requisito'], ['status', 'Situação'], ['findings', 'Questões relacionadas'], ['evidenceRequired', 'Evidência requerida'], ['acceptance', 'Critério de aceite']],
    capabilities: [['id', 'Frente'], ['group', 'Área'], ['title', 'Título'], ['summary', 'Síntese'], ['value', 'Valor habilitado'], ['limit', 'Limite documentado'], ['status', 'Situação'], ['lens', 'Questões para avaliar'], ['refs', 'PRs no corte']],
  };
  const names = { requests: 'diligencia-pedidos', risks: 'diligencia-riscos', vendor: 'homologacao-controles', capabilities: 'diligencia-capacidades' };
  const cell = value => `"${(Array.isArray(value) ? value.join(' | ') : String(value ?? '')).replaceAll('"', '""')}"`;
  for (const button of document.querySelectorAll('[data-export]')) {
    button.addEventListener('click', () => {
      const kind = button.dataset.export;
      const visibleIds = new Set(records.get(button.dataset.scope).filter(({ element }) => !element.hidden).map(({ element }) => element.dataset.id));
      const rows = data[kind].filter(item => visibleIds.has(item.id));
      const csv = '\uFEFF' + [columns[kind].map(([, title]) => cell(title)).join(';'), ...rows.map(row => columns[kind].map(([key]) => cell(row[key])).join(';'))].join('\r\n') + '\r\n';
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${names[kind]}-recorte.csv`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    if (target.hidden && target.dataset.filterItem) {
      const form = forms.find(item => item.dataset.filterForm === target.dataset.filterItem);
      form?.reset();
      for (const { element } of records.get(target.dataset.filterItem) || []) element.hidden = false;
    }
    for (let node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  window.addEventListener('hashchange', revealHash);
  let printState = [];
  window.addEventListener('beforeprint', () => {
    printState = [...document.querySelectorAll('details')].map(element => [element, element.open]);
    for (const [element] of printState) element.open = true;
  });
  window.addEventListener('afterprint', () => {
    for (const [element, open] of printState) element.open = open;
  });
  document.body.classList.add('js-ready');
  revealHash();
  window.diligenceApi = { version: 'diligencia-2026-10-21-v2', counts: Object.fromEntries([...records].map(([scope, items]) => [scope, items.length])) };
})();
