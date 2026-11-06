(() => {
  'use strict';

  const model = JSON.parse(document.getElementById('editorial-data').textContent);
  const patterns = model.privacy.map(([source, replacement]) => [new RegExp(source, 'gi'), replacement]);
  const anon = value => patterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value ?? ''));
  const escape = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const h = value => escape(anon(value));
  const norm = value => anon(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const number = value => value.toLocaleString('pt-BR');
  const labels = { wpp: 'Plataforma', bb: 'Building Blocks', developy: 'Developy' };
  const categories = new Map(model.categories.map(category => [category.id, category.label]));
  const topicMap = new Map(model.topics.map(topic => [topic.id, topic]));
  const phaseMap = new Map(model.phases.map(phase => [phase.id, phase]));
  const prMap = new Map(model.prs.map(pr => [pr.id, pr]));
  const storyMap = new Map(model.stories.map(story => [story.id, story]));
  const $ = id => document.getElementById(id);
  const controls = ['q', 'phase', 'month', 'repo', 'status', 'category', 'kind', 'order', 'size'];
  const defaults = { view: 'history', scope: 'highlights', topic: '', lens: '', phase: '', month: '', q: '', repo: '', status: '', category: '', kind: 'prs', order: 'asc', size: '50', page: 0 };
  let state = { ...defaults };
  let archive = null;
  let archivePromise = null;
  let filtered = [];
  let slides = [];
  let slideIndex = 0;
  let renderVersion = 0;
  let searchTimer;
  let toastTimer;
  const searchCache = new WeakMap();
  const date = value => value ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value.slice(0, 10) + 'T12:00:00Z')).replaceAll('.', '') : 'Snapshot do acervo';

  function phaseOf(value) {
    return model.phases.find(phase => value && value.slice(0, 7) >= phase.start && value.slice(0, 7) <= phase.end && (!phase.from || value >= phase.from) && (!phase.until || value <= phase.until)) || model.phases[0];
  }

  function sourceIds(story) {
    return story.refs.map(id => prMap.get(id)).filter(Boolean);
  }

  const stories = model.stories.map(story => {
    const refs = sourceIds(story);
    const preferred = story.group === 'infra' ? 'developy' : 'wpp';
    const anchor = refs.find(pr => pr.repo === preferred) || refs[0];
    return { ...story, storyId: story.id, anchor: anchor.id, date: anchor.date, month: anchor.month, phase: phaseOf(anchor.date).id, categories: [...new Set(refs.flatMap(pr => pr.categories))] };
  });
  const storyRecords = new Map(stories.map(story => [story.id, story]));
  const milestones = model.milestones.map((milestone, index) => {
    const story = storyRecords.get(milestone.story);
    const anchor = prMap.get(milestone.anchor);
    return { ...story, ...milestone, id: 'M' + String(index + 1).padStart(2, '0'), storyId: story.id, date: anchor.date, month: anchor.month, phase: phaseOf(anchor.date).id };
  }).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const milestoneMap = new Map(milestones.map(milestone => [milestone.id, milestone]));

  async function loadArchive() {
    if (archive) return archive;
    if (!archivePromise) {
      archivePromise = (async () => {
        if (!('DecompressionStream' in window)) throw new Error('Abra este arquivo em uma versão atual do Chrome, Edge ou Firefox para consultar o acervo comprimido. A história continua disponível.');
        const binary = atob($('archive-data').textContent.trim());
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        archive = JSON.parse(await new Response(stream).text());
        return archive;
      })();
    }
    return archivePromise;
  }

  function toast(text) {
    clearTimeout(toastTimer);
    $('toast').textContent = text;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 3500);
  }

  function writeAddress() {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(state)) if (String(value) !== String(defaults[key]) && value !== '') params.set(key, String(value));
    const hash = params.toString();
    if (location.hash.slice(1) !== hash) history.replaceState(null, '', location.pathname + location.search + (hash ? '#' + hash : ''));
  }

  function readAddress() {
    const params = new URLSearchParams(location.hash.slice(1));
    state = { ...defaults };
    for (const key of Object.keys(defaults)) if (params.has(key)) state[key] = params.get(key);
    if (!['history', 'records'].includes(state.view)) state.view = 'history';
    if (!['highlights', 'all'].includes(state.scope)) state.scope = 'highlights';
    if (!['prs', 'commits', 'docs', 'modules'].includes(state.kind)) state.kind = 'prs';
    if (!topicMap.has(state.topic)) state.topic = '';
    if (!phaseMap.has(state.phase)) state.phase = '';
    if (!categories.has(state.category)) state.category = '';
    if (!['wpp', 'bb', 'developy'].includes(state.repo)) state.repo = '';
    if (!['asc', 'desc'].includes(state.order)) state.order = 'asc';
    if (!['50', '100', '200'].includes(state.size)) state.size = '50';
    if (state.month && !/^20\d\d-(0[1-9]|1[0-2])$/.test(state.month)) state.month = '';
    state.page = Math.max(0, Math.min(10000, Number(state.page) || 0));
  }

  function searchText(record) {
    if (!searchCache.has(record)) searchCache.set(record, norm([
      record.title, record.name, record.id, record.path, record.summary, record.value, record.body,
      ...(record.details || []), ...(record.headings || []), ...(record.readmeHeadings || []),
      ...(Array.isArray(record.files) ? record.files.map(file => file.path) : []),
    ].filter(Boolean).join(' ')));
    return searchCache.get(record);
  }

  function datedMatch(record) {
    if (state.month && record.month !== state.month) return false;
    if (state.phase && phaseOf(record.date).id !== state.phase) return false;
    return true;
  }

  function sourceMatch(record) {
    if (state.repo && record.repo !== state.repo) return false;
    if (state.status && record.status !== state.status) return false;
    if (state.category && !record.categories?.includes(state.category)) return false;
    return true;
  }

  function storyMatch(story) {
    if (state.topic && story.group !== state.topic) return false;
    if (state.lens === 'trust' && !['infra', 'seguranca'].includes(story.group)) return false;
    if (!datedMatch(story)) return false;
    if ((state.repo || state.status || state.category) && !sourceIds(story).some(sourceMatch)) return false;
    if (state.q) {
      const words = norm(state.q).trim().split(/\s+/).filter(Boolean);
      if (!words.every(word => searchText(story).includes(word) || sourceIds(story).some(pr => searchText(pr).includes(word)))) return false;
    }
    return true;
  }

  function recordMatch(record) {
    if (state.topic && !topicMap.get(state.topic).categories.some(category => record.categories?.includes(category))) return false;
    if (state.lens === 'trust' && !['ha', 'seguranca', 'infra'].some(category => record.categories?.includes(category))) return false;
    if (!datedMatch(record) || !sourceMatch(record)) return false;
    if (state.q && !norm(state.q).trim().split(/\s+/).filter(Boolean).every(word => searchText(record).includes(word))) return false;
    return true;
  }

  function activeFilters() {
    const filters = [];
    if (state.topic) filters.push(['topic', topicMap.get(state.topic).label]);
    if (state.lens === 'trust') filters.push(['lens', 'HA, escala e segurança']);
    if (state.phase) filters.push(['phase', phaseMap.get(state.phase).short]);
    if (state.month) filters.push(['month', state.month]);
    if (state.repo) filters.push(['repo', labels[state.repo]]);
    if (state.status) filters.push(['status', state.status === 'Integrado à principal' ? 'Código principal' : state.status]);
    if (state.category) filters.push(['category', categories.get(state.category)]);
    if (state.q) filters.push(['q', 'Busca: ' + state.q]);
    return filters;
  }

  function syncControls() {
    for (const id of controls) if ($(id).value !== String(state[id])) $(id).value = state[id];
    $('history-view').setAttribute('aria-pressed', state.view === 'history');
    $('records-view').setAttribute('aria-pressed', state.view === 'records');
    $('highlights').setAttribute('aria-pressed', state.scope === 'highlights');
    $('all-stories').setAttribute('aria-pressed', state.scope === 'all');
    $('story-options').hidden = state.view !== 'history';
    $('record-options').hidden = state.view !== 'records';
    const snapshot = state.view === 'records' && ['docs', 'modules'].includes(state.kind);
    $('phase').disabled = snapshot;
    $('month').disabled = snapshot;
    $('status').disabled = snapshot;
    $('q').placeholder = state.view === 'history' ? 'Busque uma ideia: RAG, crédito, perfil, segurança…' : 'Busque no acervo: palavra, referência, arquivo ou descrição…';
    document.querySelectorAll('[data-topic]').forEach(button => button.setAttribute('aria-pressed', button.dataset.topic === state.topic));
    const filters = activeFilters();
    $('chips').innerHTML = filters.map(([key, label]) => `<button class="chip" data-remove="${key}" aria-label="Remover filtro ${h(label)}">${h(label)}<span aria-hidden="true">×</span></button>`).join('');
    $('filter-count').hidden = !filters.length;
    $('filter-count').textContent = filters.length;
    $('reset').hidden = !filters.length;
    $('map-reset').hidden = !filters.length;
  }

  function setState(patch, { resetPage = true } = {}) {
    state = { ...state, ...patch };
    if (resetPage) state.page = 0;
    if (state.view === 'records' && ['docs', 'modules'].includes(state.kind)) {
      const hadDate = state.phase || state.month;
      state.phase = ''; state.month = ''; state.status = '';
      if (hadDate) toast('Documentos e módulos representam o snapshot: o período foi retirado deste recorte.');
    }
    syncControls();
    writeAddress();
    return render();
  }

  function emptyState() {
    return '<div class="empty-state"><span class="empty-mark" aria-hidden="true">∅</span><h3>Esse encontro ainda não apareceu.</h3><p>Os critérios são combinados. Retire um filtro ou amplie o período para continuar explorando.</p><button class="outline-button" data-empty-reset>Voltar à leitura completa →</button></div>';
  }

  function storyCard(story, index) {
    const topic = topicMap.get(story.group);
    const frontCount = sourceIds(story).length;
    return `<article class="story-card${index === 0 && state.scope === 'highlights' ? ' featured' : ''}" style="--topic:${topic.color}" data-card="${story.id}">
      <div class="story-meta"><span class="topic-name">${h(topic.label)}</span><time datetime="${story.date}">${h(date(story.date))}</time></div>
      <h4><button data-story="${story.id}">${h(story.title)}</button></h4>
      <p class="story-summary">${h(story.summary)}</p>
      <p class="story-value"><span>O QUE PASSOU A PERMITIR</span>${h(story.value)}</p>
      <div class="story-bottom"><span>${frontCount} referências de PR <span class="separator">·</span> ${labels[prMap.get(story.anchor).repo]}</span><button data-story="${story.id}">Abrir entrega <span aria-hidden="true">↗</span></button></div>
    </article>`;
  }

  function renderStories() {
    filtered = (state.scope === 'all' ? stories : milestones).filter(storyMatch).sort((a, b) => (a.date.localeCompare(b.date) || a.id.localeCompare(b.id)) * (state.order === 'desc' ? -1 : 1));
    const noun = state.scope === 'all' ? 'frentes' : 'marcos';
    $('context').innerHTML = `<strong>${number(filtered.length)} ${noun}</strong>${activeFilters().length ? ' neste recorte.' : ' para percorrer a construção.'} ${state.scope === 'highlights' ? 'Seleção editorial; todas as 110 frentes continuam acessíveis.' : 'Uma leitura de todas as frentes organizadas no relatório.'}`;
    $('filter-preview').textContent = filtered.length + ' ' + noun + ' neste recorte';
    $('pager').hidden = true;
    const phases = state.order === 'desc' ? [...model.phases].reverse() : model.phases;
    $('results').innerHTML = filtered.length ? phases.map(phase => {
      const items = filtered.filter(story => story.phase === phase.id);
      if (!items.length) return '';
      return `<section class="chapter" data-chapter="${phase.id}" aria-labelledby="chapter-${phase.id}"><div class="chapter-aside"><span class="chapter-number">${phase.number}</span><span class="chapter-period">${h(phase.period)}</span><h3 id="chapter-${phase.id}">${h(phase.title)}</h3><p>${h(phase.summary)}</p><span class="chapter-count">${items.length} ${noun}</span></div><div class="story-grid">${items.map(storyCard).join('')}</div></section>`;
    }).join('') : emptyState();
  }

  const statusLabel = record => record.integrated ? 'Código principal' : record.state === 'OPEN' ? 'Em andamento' : record.state === 'CLOSED' ? 'Não integrado' : record.status === 'Mesclado em outro ramo' ? 'Outro ramo' : record.historical ? 'Histórico' : record.repo ? (state.kind === 'modules' ? 'Módulo atual' : state.kind === 'docs' ? 'Snapshot atual' : 'Ramo disponível') : '';

  function recordRow(record) {
    const id = record.number ? '#' + record.number : record.sha ? record.sha.slice(0, 8) : record.name || (record.historical ? 'Histórico' : 'Documento');
    return `<article class="record-row"><span class="record-id">${h(id)}</span><div><button class="record-title" data-record="${h(record.id)}">${h(record.title || record.name || record.path)}</button><p>${labels[record.repo]}${record.date ? ' · ' + h(date(record.date)) : ''}${record.baseRefName ? ' · destino ' + h(record.baseRefName) : ''}</p></div><span class="record-state ${record.integrated ? 'integrated' : record.state === 'OPEN' ? 'open' : ''}">${h(statusLabel(record))}</span><button class="record-open" data-record="${h(record.id)}" aria-label="Abrir evidência ${h(id)}">↗</button></article>`;
  }

  async function renderRecords(version) {
    $('loading').hidden = false;
    $('results').hidden = true;
    try {
      await loadArchive();
      if (version !== renderVersion) return;
      filtered = archive[state.kind].filter(recordMatch).sort((a, b) => (a.date || a.path || a.name || '').localeCompare(b.date || b.path || b.name || '') * (state.order === 'desc' ? -1 : 1));
      const size = Number(state.size);
      state.page = Math.min(state.page, Math.max(0, Math.ceil(filtered.length / size) - 1));
      const items = filtered.slice(state.page * size, (state.page + 1) * size);
      let lastMonth = '';
      $('results').innerHTML = items.length ? items.map(record => {
        let heading = '';
        if (record.month && record.month !== lastMonth) {
          lastMonth = record.month;
          const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(record.month + '-15T12:00:00Z'));
          heading = `<div class="record-date">${h(monthName)}</div>`;
        }
        return heading + recordRow(record);
      }).join('') : emptyState();
      const noun = { prs: 'PRs', commits: 'commits', docs: 'documentos', modules: 'módulos' }[state.kind];
      $('context').innerHTML = `<strong>${number(filtered.length)} ${noun}</strong> ${activeFilters().length ? 'combinam com o recorte.' : 'no acervo completo.'} Abra um registro para ler a fonte.`;
      $('filter-preview').textContent = number(filtered.length) + ' registros neste recorte';
      $('pager').hidden = filtered.length <= size;
      $('page').textContent = `${state.page + 1} / ${Math.max(1, Math.ceil(filtered.length / size))}`;
      $('prev').disabled = state.page === 0;
      $('next').disabled = (state.page + 1) * size >= filtered.length;
      writeAddress();
    } catch (error) {
      $('results').innerHTML = `<div class="empty-state"><h3>Não foi possível abrir o acervo.</h3><p>${h(error.message)}</p><a href="dados.json">Consultar a base JSON ↗</a></div>`;
    } finally {
      if (version === renderVersion) { $('loading').hidden = true; $('results').hidden = false; }
    }
  }

  function renderMap() {
    const colors = { credito: 'var(--brand-300)', banking: 'var(--brand-200)', decision: 'var(--accent)', ia: 'var(--brand-400)', wpp: 'var(--chalk)', infra: 'var(--brand-100)', seguranca: 'var(--brand-300)', ecossistema: 'var(--brand-200)' };
    const baseline = { wpp: 112, ia: 182, credito: 273, banking: 337, decision: 389, infra: 447, seguranca: 496, ecossistema: 533 };
    const used = [];
    const points = milestones.map((milestone, index) => {
      const phaseIndex = model.phases.findIndex(phase => phase.id === milestone.phase);
      const phase = model.phases[phaseIndex];
      const phaseItems = milestones.filter(item => item.phase === milestone.phase);
      const position = phaseItems.indexOf(milestone);
      const x = 216 + phaseIndex * 167 + 126 * ((position + .4) / Math.max(1, phaseItems.length));
      const base = baseline[milestone.group];
      const offsets = [0, -21, 21, -42, 42, -60, 60];
      const y = offsets.map(offset => base + offset).find(y => used.every(point => Math.hypot(point.x - x, point.y - y) > 27)) || base + 70;
      used.push({ x, y });
      return { ...milestone, x, y, phaseIndex, phase, color: colors[milestone.group], sequence: index + 1 };
    });
    const dimmed = milestone => !storyMatch(milestone);
    let svg = `<svg viewBox="0 0 1450 592" role="group" aria-label="Evolução em sete capítulos, organizada em fios por tema. Use Tab para escolher um marco."><defs><filter id="glow"><feGaussianBlur stdDeviation="2.6"/></filter><linearGradient id="thread-fade"><stop stop-color="var(--brand-100)" stop-opacity="0"/><stop offset=".6" stop-color="var(--brand-100)" stop-opacity=".25"/><stop offset="1" stop-color="var(--brand-100)" stop-opacity="0"/></linearGradient></defs>`;
    svg += '<path d="M 170 285 C 320 285 325 60 590 90 S 910 545 1360 280" fill="none" stroke="url(#thread-fade)" stroke-width=".6"/><path d="M 170 300 C 370 300 400 575 700 505 S 1120 75 1390 125" fill="none" stroke="url(#thread-fade)" stroke-width=".6"/>';
    for (let i = 0; i < model.phases.length; i++) {
      const phase = model.phases[i]; const x = 202 + i * 167;
      svg += `<g class="map-phase" data-map-phase="${phase.id}" tabindex="0" role="button" aria-pressed="${state.phase === phase.id}" aria-label="Ler capítulo ${phase.number}: ${h(phase.title)}"><line x1="${x}" y1="53" x2="${x + 140}" y2="53" stroke="var(--brand-200)" opacity=".2"/><text x="${x}" y="23">${phase.number} / ${h(phase.period.replace('2026', '').replace('2025', ''))}</text><text class="phase-name" x="${x}" y="42">${h(phase.short)}</text></g>`;
      svg += `<line x1="${x}" y1="66" x2="${x}" y2="554" stroke="var(--accent)" stroke-dasharray="1 9" opacity=".08"/>`;
    }
    for (const topic of model.topics) {
      const color = colors[topic.id]; const y = baseline[topic.id];
      const active = !state.topic || state.topic === topic.id;
      svg += `<g class="map-topic" data-map-topic="${topic.id}" tabindex="0" role="button" aria-label="Explorar ${h(topic.label)}" opacity="${active ? 1 : .32}"><circle cx="47" cy="${y - 3}" r="2" fill="${color}"/><text x="60" y="${y}" fill="${color}">${h(topic.label)}</text></g>`;
      const items = points.filter(point => point.group === topic.id);
      if (!items.length) continue;
      let curve = `M 183 ${y - 3}`;
      let previous = { x: 183, y: y - 3 };
      for (const point of items) {
        const delta = (point.x - previous.x) * .56;
        const bow = Math.min(25, (point.x - previous.x) * .15) * (model.topics.indexOf(topic) % 2 ? 1 : -1);
        curve += ` C ${previous.x + delta} ${previous.y + bow}, ${point.x - delta} ${point.y - bow}, ${point.x} ${point.y}`;
        previous = point;
      }
      curve += ` C ${previous.x + 40} ${previous.y}, 1385 ${y - 3}, 1410 ${y - 3}`;
      svg += `<path d="${curve}" fill="none" stroke="${color}" stroke-width="1.2" opacity="${active ? .65 : .1}"/>`;
      svg += `<path d="${curve}" fill="none" stroke="${color}" stroke-width="4" opacity="${active ? .05 : .01}" filter="url(#glow)"/>`;
    }
    for (const point of points) {
      const visible = !dimmed(point);
      const label = ['M01', 'M05', 'M09', 'M13', 'M16', 'M20', 'M23', 'M28'].includes(point.id);
      svg += `<g class="map-node" data-map-story="${point.id}" tabindex="0" role="button" opacity="${visible ? 1 : .16}" aria-label="${h(date(point.date))}: ${h(point.title)}"><title>${h(point.title)} · ${h(date(point.date))}</title><circle class="node-halo" cx="${point.x}" cy="${point.y}" r="13" fill="${point.color}"/><circle class="node-ring" cx="${point.x}" cy="${point.y}" r="${label ? 8 : 6}" fill="var(--night)" stroke="${point.color}" stroke-width="1.3"/><circle cx="${point.x}" cy="${point.y}" r="${label ? 2 : 1.6}" fill="${point.color}"/>${label ? `<text class="node-caption" x="${point.x + (point.phaseIndex === 6 ? -13 : 13)}" y="${point.y - 24}" text-anchor="${point.phaseIndex === 6 ? 'end' : 'start'}">${h({ M01: 'A conversa', M05: 'WhatsApp BB', M09: 'Copiloto', M13: 'RAG', M16: 'Crédito-base', M20: 'App bancário', M23: 'Mesa', M28: 'CRM guiado' }[point.id])}</text>` : ''}</g>`;
    }
    svg += '<text class="map-ruler" x="202" y="574">INÍCIO DOS REGISTROS · NOV 2025</text><text class="map-ruler" x="1392" y="574" text-anchor="end">20 OUT 2026 · A CONSTRUÇÃO CONTINUA</text></svg>';
    $('atlas-map').innerHTML = svg;
  }

  async function render() {
    const version = ++renderVersion;
    syncControls(); renderMap();
    if (state.view === 'history') {
      $('loading').hidden = true; $('results').hidden = false; renderStories();
    } else await renderRecords(version);
  }

  function openDialog(id) {
    if (!$(id).open) $(id).showModal();
  }

  function sourceMarkup(ids) {
    return ids.map(id => {
      const pr = prMap.get(id);
      return `<div class="detail-source"><div><a href="${escape(pr.url)}" target="_blank" rel="noopener">${labels[pr.repo]} #${pr.number} ↗</a><small>${h(pr.title)}</small><small>${h(pr.status)} · ${h(pr.date)}</small></div><button data-evidence="${h(pr.id)}">Ler evidência →</button></div>`;
    }).join('');
  }

  function openStory(id) {
    const story = milestoneMap.get(id) || storyRecords.get(id);
    if (!story) return;
    const topic = topicMap.get(story.group);
    $('detail-dialog').style.setProperty('--topic', topic.color);
    $('detail-content').innerHTML = `<p class="overline">${h(topic.label)} · ${h(date(story.date))}</p><h2 id="detail-title">${h(story.title)}</h2><p class="detail-lead">${h(story.summary)}</p>${story.before ? `<h3>A MUDANÇA</h3><p>${h(story.before)} <span aria-hidden="true">→</span> ${h(story.after)}</p>` : ''}<h3>O QUE FOI CONSTRUÍDO</h3><ul>${story.details.map(detail => `<li>${h(detail)}</li>`).join('')}</ul><h3>O QUE PASSOU A PERMITIR</h3><p class="detail-value">${h(story.value)}</p>${story.limit ? `<h3>ESTADO E ALCANCE</h3><p class="detail-limit">${h(story.limit)}</p>` : ''}<h3>AS EVIDÊNCIAS</h3><p class="small-note">A data do cartão é a referência narrativa de um PR. As fontes abaixo mostram as etapas e os estados de cada mudança; integração ao código não equivale a publicação.</p><div class="detail-sources">${sourceMarkup(story.refs)}</div><p class="small-note" style="margin-top:20px">Frente ${h(story.storyId)} · ${h(story.kind)}</p>`;
    openDialog('detail-dialog');
    $('detail-dialog').scrollTop = 0;
  }

  async function openRecord(id) {
    $('detail-dialog').style.setProperty('--topic', 'var(--brand-500)');
    $('detail-content').innerHTML = '<p class="overline">FONTE ORIGINAL</p><h2 id="detail-title">Abrindo a evidência…</h2>';
    openDialog('detail-dialog');
    try {
      await loadArchive();
      const record = [...archive.prs, ...archive.commits, ...archive.docs, ...archive.modules].find(item => item.id === id);
      if (!record) throw new Error('Registro não encontrado no snapshot.');
      const files = Array.isArray(record.files) ? record.files : [];
      $('detail-content').innerHTML = `<p class="overline">${labels[record.repo]} · ${h(record.number ? 'PR #' + record.number : record.sha ? 'Commit ' + record.sha.slice(0, 8) : record.historical ? 'Documento histórico' : 'Snapshot')}</p><h2 id="detail-title">${h(record.title || record.name || record.path)}</h2><p class="small-note">${h(record.status || 'Módulo atual')}${record.date ? ' · ' + h(date(record.date)) : ''}</p><p><a href="${escape(record.url)}" target="_blank" rel="noopener">Abrir fonte no GitHub ↗</a></p>${record.body ? `<h3>DESCRIÇÃO PRESERVADA</h3><pre>${h(record.body)}</pre>` : ''}${record.path ? `<details><summary>Caminho técnico de origem</summary><pre>${h(record.path)}</pre></details>` : ''}${files.length ? `<details><summary>Arquivos alterados · ${files.length}</summary><pre>${h(files.map(file => file.status + ' ' + file.path).join('\n'))}</pre></details>` : ''}${record.headings?.length ? `<details><summary>Títulos do documento</summary><pre>${h(record.headings.join('\n'))}</pre></details>` : ''}${record.metadata ? `<details><summary>Metadados do módulo</summary><pre>${h(JSON.stringify(record.metadata, null, 2))}</pre></details>` : ''}<div class="detail-tags">${(record.categories || []).map(category => `<span>${h(categories.get(category))}</span>`).join('')}</div>`;
      $('detail-dialog').scrollTop = 0;
    } catch (error) {
      $('detail-content').innerHTML = `<h2 id="detail-title">Evidência indisponível.</h2><p>${h(error.message)}</p>`;
    }
  }

  function showGuide(about = false) {
    $('guide-content').innerHTML = about ? `<p class="overline">REFERÊNCIAS DO DESENHO</p><h2 id="guide-title">Um atlas para contar a construção.</h2><p>O desenho organiza marcos por capítulo e por tema. A distância entre pontos serve à leitura; não representa volume de código, impacto financeiro ou dependência técnica. Cores e fios agrupam assuntos, sem afirmar causalidade.</p>${model.benchmarks.map(benchmark => `<div class="benchmark"><a href="${escape(benchmark.url)}" target="_blank" rel="noopener">${h(benchmark.title)} ↗</a><p>${h(benchmark.idea)}</p><p><strong>Aqui:</strong> ${h(benchmark.applied)}</p></div>`).join('')}<p>Referências consultadas em 20/10/2026. Desenho próprio, SVG interativo e conteúdo local, sem carregar bibliotecas ou serviços dessas referências.</p>` : `<p class="overline">ENCONTRE SEU CAMINHO</p><h2 id="guide-title">Do desenho ao detalhe.</h2><div class="guide-step"><span>01</span><div><h3>Siga os fios.</h3><p>Os pontos abrem entregas; as cores acompanham temas. Clique no nome de um tema ou no título de um capítulo para focar a leitura.</p></div></div><div class="guide-step"><span>02</span><div><h3>Leia o que mudou.</h3><p>Comece pelos ${milestones.length} marcos selecionados ou revele todas as 110 frentes. Cada cartão explica a construção e o valor que ela passou a permitir.</p></div></div><div class="guide-step"><span>03</span><div><h3>Aproxime quando precisar.</h3><p>Refinar a leitura reúne os filtros existentes e caminhos prontos. Critérios se combinam; o recorte aparece em chips removíveis e no endereço do arquivo.</p></div></div><div class="guide-step"><span>04</span><div><h3>Abra a evidência.</h3><p>No acervo completo estão todos os PRs, commits, documentos e módulos. Leia descrições e caminhos sem sair da página. O modo Apresentar percorre os marcos do recorte atual.</p></div></div><p><strong>O período:</strong> janela de 20/10/2024 a 20/10/2026. Os três repositórios têm registros a partir de novembro/2025; não foi criada atividade para os meses anteriores. Datas são do snapshot, não do dia em que você abre o arquivo.</p><p><strong>Os estados:</strong> integrado prova presença no código principal; publicação e validação são informadas pelas fontes. Clientes estão anonimizados nos textos; os destinos técnicos mantêm as referências originais.</p>`;
    openDialog('guide-dialog');
  }

  function applyPreset(name) {
    state = { ...defaults };
    if (name === 'credit') { state.topic = 'credito'; state.scope = 'all'; }
    if (name === 'ai') { state.topic = 'ia'; state.scope = 'all'; }
    if (name === 'trust') { state.lens = 'trust'; state.scope = 'all'; }
    if (name === 'today') { state.phase = 'hoje'; state.scope = 'all'; }
    $('filters-dialog').close();
    setState({});
    $('explorar').scrollIntoView({ behavior: 'smooth' });
  }

  function present() {
    slides = milestones.filter(storyMatch);
    if (!slides.length && state.scope === 'all') slides = stories.filter(storyMatch);
    if (!slides.length) { toast('Amplie o recorte para escolher os marcos da apresentação.'); return; }
    slideIndex = 0;
    renderSlide();
    openDialog('presentation-dialog');
  }

  function renderSlide() {
    const story = slides[slideIndex]; const topic = topicMap.get(story.group); const phase = phaseMap.get(story.phase);
    $('presentation-dialog').style.setProperty('--topic', { credito: 'var(--brand-300)', banking: 'var(--brand-200)', decision: 'var(--accent)', ia: 'var(--brand-400)', wpp: 'var(--chalk)', infra: 'var(--brand-100)', seguranca: 'var(--brand-300)', ecossistema: 'var(--brand-200)' }[story.group]);
    $('slide-position').textContent = `${String(slideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    $('slide-content').innerHTML = `<div class="slide-topline"><span>${phase.number} · ${h(phase.short)} <span class="separator">/</span> ${h(topic.label)}</span><time>${h(date(story.date))}</time></div><h2 class="slide-title">${h(story.title)}</h2><p class="slide-description">${h(story.summary)}</p>${story.before ? `<div class="slide-change"><div><small>ANTES</small><p>${h(story.before)}</p></div><span class="slide-arrow" aria-hidden="true">→</span><div><small>O QUE MUDOU</small><p>${h(story.after)}</p></div></div>` : ''}<p class="slide-value">${h(story.value)}</p>`;
    $('slide-prev').disabled = slideIndex === 0;
    $('slide-next').disabled = slideIndex === slides.length - 1;
    $('slide-progress').style.width = ((slideIndex + 1) / slides.length * 100) + '%';
    $('presentation-dialog').scrollTop = 0;
  }

  function exportCurrent() {
    const rows = filtered;
    const fields = state.view === 'history' ? ['id', 'date', 'title', 'summary', 'value', 'refs'] : ['id', 'date', 'repo', 'title', 'status', 'url', 'body'];
    const cell = value => {
      let text = anon(Array.isArray(value) ? value.join(' | ') : value ?? '');
      if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const csv = '\ufeff' + fields.join(',') + '\r\n' + rows.map(row => fields.map(field => cell(row[field])).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'inventario-filtrado.csv'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  for (const id of controls) $(id).addEventListener(id === 'q' ? 'input' : 'change', () => {
    clearTimeout(searchTimer);
    const apply = () => setState({ [id]: $(id).value });
    if (id === 'q') searchTimer = setTimeout(apply, 140); else apply();
  });
  $('history-view').onclick = () => setState({ view: 'history' });
  $('records-view').onclick = () => setState({ view: 'records' });
  $('highlights').onclick = () => setState({ scope: 'highlights' });
  $('all-stories').onclick = () => setState({ scope: 'all' });
  $('filter-toggle').onclick = () => openDialog('filters-dialog');
  $('filters-done').onclick = () => $('filters-dialog').close();
  const reset = () => setState({ topic: '', lens: '', phase: '', month: '', q: '', repo: '', status: '', category: '' });
  $('reset').onclick = reset;
  $('map-reset').onclick = reset;
  $('export').onclick = exportCurrent;
  $('help').onclick = () => showGuide();
  $('scope-help').onclick = () => showGuide();
  $('about').onclick = () => showGuide(true);
  $('present').onclick = present;
  $('slide-prev').onclick = () => { if (slideIndex > 0) { slideIndex--; renderSlide(); } };
  $('slide-next').onclick = () => { if (slideIndex < slides.length - 1) { slideIndex++; renderSlide(); } };
  $('prev').onclick = () => { setState({ page: state.page - 1 }, { resetPage: false }); $('explorar').scrollIntoView(); };
  $('next').onclick = () => { setState({ page: state.page + 1 }, { resetPage: false }); $('explorar').scrollIntoView(); };

  document.addEventListener('click', event => {
    if (event.target.closest('a[href="#explorar"]')) {
      event.preventDefault();
      $('explorar').scrollIntoView({ behavior: 'smooth' });
    }
    const close = event.target.closest('[data-close]'); if (close) close.closest('dialog').close();
    const remove = event.target.closest('[data-remove]'); if (remove) setState({ [remove.dataset.remove]: '' });
    const topic = event.target.closest('[data-topic]'); if (topic) setState({ topic: topic.dataset.topic, lens: '' });
    const preset = event.target.closest('[data-preset]'); if (preset) applyPreset(preset.dataset.preset);
    const story = event.target.closest('[data-story]'); if (story) openStory(story.dataset.story);
    const evidence = event.target.closest('[data-evidence]'); if (evidence) openRecord(evidence.dataset.evidence);
    const record = event.target.closest('[data-record]'); if (record) openRecord(record.dataset.record);
    if (event.target.closest('[data-empty-reset]')) reset();
    const mapStory = event.target.closest('[data-map-story]'); if (mapStory) { $('map-tooltip').hidden = true; openStory(mapStory.dataset.mapStory); }
    const mapTopic = event.target.closest('[data-map-topic]'); if (mapTopic) { setState({ topic: state.topic === mapTopic.dataset.mapTopic ? '' : mapTopic.dataset.mapTopic, lens: '', scope: 'all' }); $('explorar').scrollIntoView({ behavior: 'smooth' }); }
    const mapPhase = event.target.closest('[data-map-phase]'); if (mapPhase) { setState({ phase: state.phase === mapPhase.dataset.mapPhase ? '' : mapPhase.dataset.mapPhase, month: '' }); $('explorar').scrollIntoView({ behavior: 'smooth' }); }
  });

  $('atlas-map').addEventListener('pointermove', event => {
    const target = event.target.closest('[data-map-story]');
    if (!target || event.pointerType === 'touch') { $('map-tooltip').hidden = true; return; }
    const milestone = milestoneMap.get(target.dataset.mapStory); const topic = topicMap.get(milestone.group);
    $('map-tooltip').style.setProperty('--topic', topic.color);
    $('map-tooltip').innerHTML = `<small>${h(topic.label)} · ${h(date(milestone.date))}</small><strong>${h(milestone.title)}</strong><small>Clique para conhecer a entrega ↗</small>`;
    $('map-tooltip').hidden = false;
    $('map-tooltip').style.left = Math.min(event.clientX + 17, innerWidth - 330) + 'px';
    $('map-tooltip').style.top = Math.max(10, Math.min(event.clientY + 17, innerHeight - 145)) + 'px';
  });
  $('atlas-map').addEventListener('pointerleave', () => { $('map-tooltip').hidden = true; });
  window.addEventListener('scroll', () => { $('map-tooltip').hidden = true; }, { passive: true });
  document.addEventListener('keydown', event => {
    const mapTarget = event.target.closest('[data-map-story], [data-map-topic], [data-map-phase]');
    if (mapTarget && ['Enter', ' '].includes(event.key)) { event.preventDefault(); mapTarget.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    if ($('presentation-dialog').open) {
      if (event.key === 'ArrowRight') { event.preventDefault(); $('slide-next').click(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); $('slide-prev').click(); }
      return;
    }
    if (event.key === '/' && !document.querySelector('dialog[open]') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) { event.preventDefault(); $('q').focus(); }
  });
  for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  window.addEventListener('hashchange', () => { readAddress(); syncControls(); render(); });

  window.reportApi = {
    get data() { return archive || { prs: model.prs, summary: model.summary }; },
    getFiltered: () => filtered,
    getState: () => ({ ...state }),
    loadArchive,
    stories,
    milestones,
    setState,
  };
  readAddress(); syncControls(); render();
})();
