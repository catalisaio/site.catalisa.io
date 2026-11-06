(() => {
  'use strict';
  const model = JSON.parse(document.getElementById('dashboard-model').textContent);
  const $ = id => document.getElementById(id);
  const h = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const n = value => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);
  const labels = { wpp: 'Catalisa', bb: 'Building Blocks', developy: 'Developy Cloud' };
  const colors = { wpp: 'var(--brand-500)', bb: 'var(--accent)', developy: 'var(--ink)' };
  const keys = Object.keys(labels);
  const prMap = new Map(model.prs.map(pr => [pr.id, pr]));
  const storyMap = new Map(model.stories.map(story => [story.id, story]));
  const shortGroups = { credito: 'Crédito', banking: 'Banking', decision: 'Decision', ia: 'IA, RAG e copiloto', wpp: 'WhatsApp e CRM', infra: 'Infraestrutura', seguranca: 'Segurança', ecossistema: 'Ecossistema' };
  const months = [];
  for (let date = new Date(model.period.start + 'T12:00:00Z'); date.toISOString().slice(0, 7) <= model.cutoff.slice(0, 7); date.setUTCMonth(date.getUTCMonth() + 1)) months.push(date.toISOString().slice(0, 7));
  const monthLabel = month => new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(new Date(month + '-15T12:00:00Z')).replace('.', '');
  const state = { repo: '', from: months[0], to: months.at(-1) };
  const inventoryLink = params => 'timeline.html#' + new URLSearchParams({ view: 'records', kind: 'prs', ...params });
  const storyLink = story => `<a href="relatorio-completo.html#${story.id}">${h(story.title)} ↗</a>`;
  const sourceLinks = ids => ids.map(id => `<a href="${h(prMap.get(id).url)}" target="_blank" rel="noopener">${h(id)} ↗</a>`).join(' · ');
  const uniqueRefs = stories => [...new Set(stories.flatMap(story => story.refs))];
  const numRefs = ids => uniqueRefs(ids.map(id => storyMap.get(id))).length;
  const kpi = (value, title, note = '') => `<div class="dash-kpi"><b>${n(value)}</b><span>${h(title)}</span>${note ? `<small>${h(note)}</small>` : ''}</div>`;
  const table = (heads, rows) => `<details class="chart-data"><summary>Ver dados e fontes</summary><div class="data-scroll"><table><thead><tr>${heads.map(head => `<th>${h(head)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
  let chartIndex = 0;
  function chart(title, subtitle, visual, heads, rows, { wide = false, dark = false, note = '' } = {}) {
    chartIndex++;
    return `<article class="dash-chart${wide ? ' chart-wide' : ''}${dark ? ' chart-dark' : ''}" data-chart="${chartIndex}"><div class="chart-heading"><span class="chart-no">${String(chartIndex).padStart(2, '0')}</span><div><h3>${title}</h3><p>${subtitle}</p></div></div><div class="chart-visual">${visual}</div>${note ? `<p class="chart-note">${note}</p>` : ''}${table(heads, rows)}</article>`;
  }
  const svg = (width, height, title, body) => `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${h(title)}"><title>${h(title)}</title>${body}</svg>`;
  const legend = () => `<div class="chart-legend">${keys.map(key => `<span><i style="background:${colors[key]}"></i>${labels[key]}</span>`).join('')}</div>`;
  function bars(rows, { width = 660, labelWidth = 225, max = Math.max(1, ...rows.map(row => row.value)), suffix = '' } = {}) {
    return svg(width, rows.length * 38 + 12, 'Comparação por contagem', rows.map((row, index) => {
      const y = index * 38 + 12;
      const barWidth = (width - labelWidth - 65) * row.value / max;
      const body = `<title>${h(row.label)}: ${n(row.value)}${suffix}</title><text x="0" y="${y + 15}" class="svg-label">${h(row.label)}</text><rect x="${labelWidth}" y="${y}" width="${width - labelWidth - 65}" height="22" rx="2" class="bar-track"/><rect x="${labelWidth}" y="${y}" width="${barWidth}" height="22" rx="2" fill="${row.color || colors.wpp}"/><text x="${labelWidth + barWidth + 8}" y="${y + 16}" class="svg-number">${n(row.value)}${suffix}</text>`;
      return row.url ? `<a href="${h(row.url)}" aria-label="${h(row.label)}: ${n(row.value)}; abrir evidências">${body}</a>` : `<g>${body}</g>`;
    }).join(''));
  }
  function heatmap(rows, title) {
    const cellWidth = 111; const offset = 290;
    const max = Math.max(1, ...rows.flatMap(row => row.values));
    return svg(660, rows.length * 30 + 50, title, keys.map((key, index) => `<text x="${offset + index * cellWidth + cellWidth / 2}" y="19" text-anchor="middle" class="svg-label">${labels[key]}</text>`).join('') + rows.map((row, index) => `<text x="0" y="${index * 30 + 55}" class="svg-label">${h(row.label)}</text>${row.values.map((value, keyIndex) => `<a href="${h(row.url?.(keys[keyIndex]) || '#metodo')}" aria-label="${h(row.label)}, ${labels[keys[keyIndex]]}: ${n(value)}"><title>${h(row.label)} · ${labels[keys[keyIndex]]}: ${n(value)}</title><rect x="${offset + keyIndex * cellWidth}" y="${index * 30 + 35}" width="${cellWidth - 4}" height="26" rx="2" fill="${colors[keys[keyIndex]]}" opacity="${value ? 0.16 + 0.84 * value / max : 0.04}"/><text x="${offset + keyIndex * cellWidth + (cellWidth - 4) / 2}" y="${index * 30 + 53}" text-anchor="middle" class="svg-number" style="fill:${value / max > 0.55 ? 'var(--ink-inverted)' : 'var(--ink)'}">${n(value)}</text></a>`).join('')}`).join(''));
  }
  function delivery() {
    chartIndex = 0;
    const selected = model.prs.filter(pr => (!state.repo || pr.repo === state.repo) && pr.date.slice(0, 7) >= state.from && pr.date.slice(0, 7) <= state.to);
    const integrated = selected.filter(pr => pr.integrated);
    const includedMonths = months.filter(month => month >= state.from && month <= state.to);
    const monthly = includedMonths.map(month => ({ month, values: keys.map(key => integrated.filter(pr => pr.repo === key && pr.date.startsWith(month)).length) }));
    const peak = monthly.reduce((best, row) => row.values.reduce((a, b) => a + b, 0) > best.count ? { month: row.month, count: row.values.reduce((a, b) => a + b, 0) } : best, { month: '', count: 0 });
    const days = new Set(integrated.map(pr => pr.date)).size;
    $('delivery-kpis').innerHTML = kpi(selected.length, 'PRs no recorte') + kpi(integrated.length, 'Integrados à principal') + kpi(selected.filter(pr => pr.state === 'OPEN').length, 'Abertos no corte', 'Posicionados pela criação') + kpi(days, 'Dias com integração', 'Não mede horas trabalhadas') + kpi(peak.count, 'Integrações no mês de pico', peak.month ? monthLabel(peak.month) : 'Sem registros');
    $('dash-scope').textContent = `${state.repo ? labels[state.repo] : 'Três bases'} · ${monthLabel(state.from)} a ${monthLabel(state.to)} · ${n(selected.length)} PRs. Os filtros afetam somente esta seção. As demais usam o acervo completo.`;
    $('dash-acervo').href = inventoryLink({ repo: state.repo });
    let content = '';
    const width = 960, height = 310, plotHeight = 220, bottom = 253, step = 880 / monthly.length;
    const maximum = Math.max(1, ...monthly.map(row => row.values.reduce((a, b) => a + b, 0)));
    const grid = [0, 0.25, 0.5, 0.75, 1].map(fraction => `<path d="M52 ${bottom - fraction * plotHeight}H940" class="svg-grid"/><text x="42" y="${bottom - fraction * plotHeight + 4}" text-anchor="end" class="svg-label">${n(Math.round(maximum * fraction))}</text>`).join('');
    const columns = monthly.map((row, index) => {
      let y = bottom; const total = row.values.reduce((a, b) => a + b, 0);
      return row.values.map((value, keyIndex) => {
        const barHeight = plotHeight * value / maximum; y -= barHeight;
        return `<a href="${inventoryLink({ repo: keys[keyIndex], month: row.month, status: 'Integrado à principal' })}"><title>${monthLabel(row.month)} · ${labels[keys[keyIndex]]}: ${value} PRs integrados</title><rect x="${58 + index * step}" y="${y}" width="${step * 0.72}" height="${barHeight}" fill="${colors[keys[keyIndex]]}"/></a>`;
      }).join('') + (total ? `<text x="${58 + index * step + step * 0.36}" y="${y - 7}" text-anchor="middle" class="svg-number">${total}</text>` : '') + `<text x="${58 + index * step}" y="281" transform="rotate(-35 ${58 + index * step} 281)" class="svg-label">${monthLabel(row.month)}</text>`;
    }).join('');
    content += chart('A evolução mês a mês', 'PRs integrados à principal · clique em uma faixa para consultar aquele mês e base.', svg(width, height, 'Integrações mensais por repositório', grid + columns) + legend(), ['Mês', ...Object.values(labels), 'Total'], monthly.map(row => [monthLabel(row.month), ...row.values.map(n), n(row.values.reduce((a, b) => a + b, 0))]), { wide: true, note: 'Meses sem registros permanecem visíveis. Outubro de 2026 termina no dia 20. Barras contam merges; não representam receita ou produtos independentes.' });
    const totals = [0, 0, 0]; const cumulative = monthly.map(row => ({ month: row.month, values: row.values.map((value, index) => (totals[index] += value)) }));
    const maxCum = Math.max(1, ...totals);
    content += chart('O patrimônio técnico se acumula', 'Integrações acumuladas dentro do recorte selecionado.', svg(660, 285, 'PRs acumulados por base', [0, 0.5, 1].map(fraction => `<path d="M45 ${240 - fraction * 210}H640" class="svg-grid"/><text x="36" y="${244 - fraction * 210}" text-anchor="end" class="svg-label">${n(Math.round(maxCum * fraction))}</text>`).join('') + keys.map((key, index) => `<path d="${cumulative.map((row, position) => `${position ? 'L' : 'M'}${45 + position * 540 / Math.max(1, cumulative.length - 1)} ${240 - row.values[index] * 210 / maxCum}`).join(' ')}" fill="none" stroke="${colors[key]}" stroke-width="3"/><text x="600" y="${Math.min(240, 240 - totals[index] * 210 / maxCum + 4)}" class="svg-number" style="fill:${colors[key]}">${n(totals[index])}</text>`).join('') + `<text x="45" y="271" class="svg-label">${monthLabel(state.from)}</text><text x="580" y="271" text-anchor="end" class="svg-label">${monthLabel(state.to)}</text>`) + legend(), ['Mês', ...Object.values(labels)], cumulative.map(row => [monthLabel(row.month), ...row.values.map(n)]));
    const repoTotals = keys.map(key => ({ key, value: integrated.filter(pr => pr.repo === key).length }));
    const total = integrated.length;
    let angle = -90;
    const ring = repoTotals.map(row => {
      const share = total ? row.value / total : 0; const start = angle; angle += share * 360;
      const point = degrees => [150 + 105 * Math.cos(degrees * Math.PI / 180), 145 + 105 * Math.sin(degrees * Math.PI / 180)];
      const [x1, y1] = point(start); const [x2, y2] = point(angle - (share === 1 ? 0.001 : 0));
      return share ? `<path d="M${x1} ${y1}A105 105 0 ${share > 0.5 ? 1 : 0} 1 ${x2} ${y2}" fill="none" stroke="${colors[row.key]}" stroke-width="31"><title>${labels[row.key]}: ${n(row.value)} (${n(share * 100)}%)</title></path>` : '';
    }).join('');
    content += chart('Três camadas de construção', 'Participação nas integrações do recorte.', svg(660, 285, 'Distribuição das integrações', ring + `<text x="150" y="143" text-anchor="middle" class="svg-big">${n(total)}</text><text x="150" y="166" text-anchor="middle" class="svg-label">PRs integrados</text>` + repoTotals.map((row, index) => `<rect x="320" y="${65 + index * 65}" width="10" height="10" fill="${colors[row.key]}"/><text x="345" y="${75 + index * 65}" class="svg-label">${labels[row.key]}</text><text x="345" y="${103 + index * 65}" class="svg-value">${n(row.value)} · ${n(total ? row.value / total * 100 : 0)}%</text>`).join('')), ['Base', 'Integrados', 'Participação'], repoTotals.map(row => [labels[row.key], n(row.value), n(total ? row.value / total * 100 : 0) + '%']));
    const status = [
      { label: 'Principal', value: integrated.length, color: colors.developy },
      { label: 'Merge em outro ramo', value: selected.filter(pr => pr.state === 'MERGED' && !pr.integrated).length, color: colors.bb },
      { label: 'Aberto', value: selected.filter(pr => pr.state === 'OPEN').length, color: colors.wpp },
      { label: 'Fechado sem merge', value: selected.filter(pr => pr.state === 'CLOSED').length, color: 'var(--brand-400)' },
    ];
    content += chart('O que entrou e o que continua', 'Estados no corte · categorias mutuamente exclusivas.', bars(status), ['Estado', 'PRs'], status.map(row => [row.label, n(row.value)]), { note: 'Aberto e fechado sem merge não entram no total integrado. Merge em outro ramo também fica separado da principal.' });
    const types = [...new Set(integrated.map(pr => pr.type))].map(type => ({ label: type, value: integrated.filter(pr => pr.type === type).length })).sort((a, b) => b.value - a.value);
    const topTypes = types.slice(0, 6); if (types.length > 6) topTypes.push({ label: 'Demais tipos', value: types.slice(6).reduce((sum, row) => sum + row.value, 0) });
    content += chart('Produto também se entrega corrigindo', 'Tipo registrado na classificação dos PRs integrados.', bars(topTypes, { labelWidth: 130 }), ['Tipo', 'PRs'], types.map(row => [h(row.label), n(row.value)]), { note: 'feat e fix descrevem a natureza do registro; não medem sozinhos valor, complexidade ou retrabalho.' });
    const categoryRows = model.categories.map(category => ({ label: category.label, values: keys.map(key => integrated.filter(pr => pr.repo === key && pr.categories.includes(category.id)).length), url: repo => inventoryLink({ repo, category: category.id, status: 'Integrado à principal' }) }));
    content += chart('Onde a engenharia se concentrou', 'Mapa de PRs integrados por tema e base · os temas se sobrepõem.', heatmap(categoryRows, 'Mapa temático das integrações'), ['Categoria', ...Object.values(labels)], categoryRows.map(row => [h(row.label), ...row.values.map(n)]), { wide: true, note: 'Cada célula conta PRs distintos naquela categoria e base. Um mesmo PR pode aparecer em diversas linhas; não some as categorias como total de entregas. Os links abrem a categoria e base no acervo completo.' });
    $('delivery-charts').innerHTML = content;
    return selected;
  }
  function fixedSections() {
    chartIndex = 6;
    const groupRows = model.groups.map(group => ({ label: shortGroups[group.id], value: model.stories.filter(story => story.group === group.id).length, url: 'relatorio-completo.html#' + group.id, color: group.id === 'infra' ? colors.developy : group.id === 'banking' ? colors.bb : colors.wpp }));
    const core = model.stories.filter(story => ['credito', 'banking', 'decision'].includes(story.group));
    $('business-kpis').innerHTML = kpi(core.length, 'Frentes em crédito, banco e Decision', '29 + 15 + 10 frentes') + kpi(uniqueRefs(core).length, 'PRs citados nessas frentes', 'Distintos, em todos os estados') + kpi(18, 'Frentes de IA, RAG e copiloto') + kpi(6, 'Etapas do ciclo financeiro', 'Recorte editorial das capacidades');
    let content = chart('O portfólio em frentes de valor', '110 frentes editoriais · uma classificação principal por frente.', bars(groupRows), ['Domínio', 'Frentes'], groupRows.map(row => [row.label, n(row.value)]), { note: 'A profundidade de uma frente varia. Esta distribuição organiza a narrativa e não mede faturamento ou maturidade comercial.' });
    const chainRows = model.chains.map(chain => ({ label: chain.label, value: chain.stories.length, color: colors.bb }));
    content += chart('Cobertura do ciclo operacional', 'Frentes selecionadas para seis momentos de uma operação financeira.', bars(chainRows), ['Etapa', 'Frentes', 'PRs citados distintos'], model.chains.map(chain => [chain.label, n(chain.stories.length), n(numRefs(chain.stories))]), { note: 'As etapas são uma curadoria explicitada no JSON. Referências podem se repetir entre etapas; o gráfico não mede operações financeiras processadas.' });
    const matrix = model.groups.map(group => ({ label: shortGroups[group.id], values: keys.map(key => uniqueRefs(model.stories.filter(story => story.group === group.id)).filter(id => prMap.get(id).repo === key).length), url: () => 'relatorio-completo.html#' + group.id }));
    content += chart('O valor atravessa os repositórios', 'PRs distintos citados nas frentes de cada domínio, separados pela base de origem.', heatmap(matrix, 'Referências cruzadas entre domínios e repositórios'), ['Domínio', ...Object.values(labels)], matrix.map(row => [row.label, ...row.values.map(n)]), { wide: true, note: 'Uma referência pode sustentar mais de um domínio. Zero significa ausência de citação direta naquela curadoria, não ausência de dependência arquitetural.' });
    const aiRows = model.ai.map(row => ({ label: row.label, value: numRefs(row.stories), color: colors.wpp }));
    content += chart('IA conectada ao trabalho', 'Referências distintas por conjunto de seis frentes de IA.', bars(aiRows), ['Capacidade', 'Frentes', 'PRs citados'], model.ai.map(row => [row.label, n(row.stories.length), n(numRefs(row.stories))]), { note: 'Core compartilhado, conhecimento isolado e copiloto são capacidades complementares. As referências têm sobreposição.' });
    const monetization = model.stories.filter(story => ['E048', 'E049', 'E102', 'E103'].includes(story.id));
    content += chart('Da base técnica à distribuição', 'Ativos para instalação, autosserviço e monetização · PRs citados por frente.', bars(monetization.map(story => ({ label: ({ E048: 'Decision SaaS', E049: 'Ambientes e cotas', E102: 'Pacotes instaláveis', E103: 'Monetização por vertical' })[story.id], value: story.refs.length, url: 'relatorio-completo.html#' + story.id, color: colors.bb }))), ['Frente', 'PRs citados', 'Valor'], monetization.map(story => [storyLink(story), n(story.refs.length), h(story.value)]), { note: 'Capacidades comerciais implementadas não equivalem a vendas, clientes ativos ou receita apurada.' });
    $('business-charts').innerHTML = content;
    $('value-stories').innerHTML = model.chains.map((chain, index) => `<article style="--stage:${['var(--brand-300)', 'var(--accent)', 'var(--brand-500)', 'var(--brand-200)', 'var(--ink-2)', 'var(--brand-700)'][index]}"><span class="overline">${String(index + 1).padStart(2, '0')} / ${chain.stories.length} frentes · ${numRefs(chain.stories)} PRs citados</span><h3>${chain.label}</h3><p>${chain.value}</p><details><summary>Explorar as capacidades +</summary>${chain.stories.map(id => `<p>${storyLink(storyMap.get(id))}</p>`).join('')}</details><a href="cadeia-de-valor.html#${['originacao', 'evidencias', 'decisao', 'formalizacao', 'dinheiro', 'continuidade'][index]}">Percorrer esta etapa ↗</a></article>`).join('');
    $('architecture-kpis').innerHTML = kpi(model.summary.files, 'Arquivos rastreados', 'Três snapshots congelados') + kpi(model.summary.testFiles, 'Arquivos de teste', 'Inventário; não testes executados') + kpi(model.panelPrismaModels, 'Modelos no Prisma do painel') + kpi(model.workflowActionTypes, 'Tipos de ação no schema');
    const architectureRows = model.repositories.map(repo => ({ label: labels[repo.key], value: repo.modules, color: colors[repo.key] }));
    content = chart('A divisão de responsabilidades', 'Diretórios de módulos indexados nos três repositórios.', bars(architectureRows), ['Base', 'Módulos', 'Arquivos totais', 'Arquivos de teste', 'Docs atuais'], model.repositories.map(repo => [labels[repo.key], n(repo.modules), n(repo.files), n(repo.testFiles), n(repo.docs)]), { note: '86 módulos da API do painel, 42 diretórios funcionais de BBs e 31 módulos de servidor Developy. Não são 159 produtos comerciais.' });
    content += chart('Testes acompanham as três bases', 'Arquivos de teste presentes nos snapshots completos.', bars(model.repositories.map(repo => ({ label: labels[repo.key], value: repo.testFiles, color: colors[repo.key] }))), ['Base', 'Arquivos de teste'], model.repositories.map(repo => [labels[repo.key], n(repo.testFiles)]), { note: 'O inventário não demonstra execução, aprovação ou percentual de cobertura. Execuções pontuais estão nas provas e PRs específicos.' });
    const bbModules = model.modules.filter(item => item.repo === 'bb').sort((a, b) => b.files - a.files);
    const tiles = bbModules.map(item => `<a class="module-tile" href="${h(item.url)}" target="_blank" rel="noopener" style="--module-weight:${Math.sqrt(item.files)}"><span>${h(item.name)}</span><b>${n(item.files)}</b><small>arquivos · ${n(item.testFiles)} de teste</small></a>`).join('');
    content += chart('42 peças para compor produtos', 'Building Blocks · cada bloco abre o diretório no snapshot exato.', `<div class="module-map">${tiles}</div>`, ['Módulo', 'Arquivos', 'Arquivos de teste'], bbModules.map(item => [h(item.name), n(item.files), n(item.testFiles)]), { wide: true, note: 'O peso visual usa a raiz quadrada da quantidade de arquivos para manter os módulos menores legíveis. Os valores são contagens reais, não área proporcional ou medida de valor comercial.' });
    const docs = model.repositories.map(repo => ({ label: labels[repo.key], value: repo.docs, color: colors[repo.key] }));
    content += chart('Conhecimento que permanece', 'Documentação atual por base, além dos documentos históricos recuperados.', bars(docs), ['Base', 'Docs atuais'], [...docs.map(row => [row.label, n(row.value)]), ['Históricos, três bases', n(model.summary.docsHistorical)]] , { note: `${n(model.summary.docsCurrent)} documentos atuais + ${n(model.summary.docsHistorical)} históricos = ${n(model.summary.docsCurrent + model.summary.docsHistorical)} documentos no acervo. Um arquivo não equivale a uma especificação independente.` });
    const infra = model.repositories.find(repo => repo.key === 'developy');
    content += chart('Developy é uma base de produto própria', 'Infraestrutura construída durante a evolução da Catalisa.', `<div class="infra-score">${kpi(model.prs.filter(pr => pr.repo === 'developy' && pr.integrated).length, 'PRs na principal')}${kpi(infra.integratedCommits, 'Commits na principal')}${kpi(infra.modules, 'Módulos de servidor')}${kpi(infra.testFiles, 'Arquivos de teste')}</div><p class="infra-score-note">Publicação → descoberta → dados → governança → observabilidade → continuidade</p>`, ['Indicador', 'Valor'], [['PRs inventariados', '335'], ['PRs na principal', '328'], ['Commits na principal', n(infra.integratedCommits)], ['Módulos', n(infra.modules)], ['Arquivos de teste', n(infra.testFiles)], ['Frentes de infraestrutura', '14'], ['Casos aprofundados', n(model.infrastructure.length)]] , { dark: true, note: 'Primeiro commit disponível: 03/03/2026. Os nove casos abaixo mostram o efeito direto dessa base sobre os produtos.' });
    $('architecture-charts').innerHTML = content;
    const securityStories = model.stories.filter(story => story.group === 'seguranca');
    const secLabels = ['IAM e permissões', 'Remediação de falhas', 'Segredos por ambiente', 'Sessões e navegador', 'Integridade da trilha', 'Biometria e revisão', 'Representação e identidade', 'Retenção e fronteiras'];
    content = chart('Segurança com evidências concretas', 'PRs citados nas oito frentes de segurança e governança.', bars(securityStories.map((story, index) => ({ label: secLabels[index], value: story.refs.length, url: 'relatorio-completo.html#' + story.id, color: colors.developy }))), ['Frente', 'PRs citados', 'Capacidade'], securityStories.map(story => [storyLink(story), n(story.refs.length), h(story.value)]), { note: 'Volume de referências não é uma nota de segurança. Correções confirmadas, limites e dependências continuam descritos nas frentes.' });
    const infraRows = model.infrastructure.map(item => ({ label: `${item.id} · ${['Streaming com afinidade', 'Malha e descoberta', 'Controle da frota', 'Proteção de credenciais', 'Persistência de volumes', 'Rede e crédito', 'Incidentes visíveis', 'Identidade e supply chain', 'E-mail e auditoria'][Number(item.id.slice(1)) - 1]}`, value: item.refs.length, color: colors.developy, url: 'developy.html#' + item.id }));
    content += chart('Infraestrutura com efeito no usuário', 'Referências por conexão aprofundada entre Developy e Catalisa.', bars(infraRows, { labelWidth: 270 }), ['Caso', 'PRs citados', 'Efeito'], model.infrastructure.map(item => [`<a href="developy.html#${item.id}">${h(item.id + ' · ' + item.title)}</a>`, n(item.refs.length), h(item.impact)]), { note: 'Os casos são recortes editoriais, com referências compartilhadas. Nem toda evolução está publicada; as pendências aparecem ao abrir cada caso.' });
    $('trust-charts').innerHTML = content;
    $('infra-cases').innerHTML = model.infrastructure.map(item => `<details><summary><span>${item.id}</span>${h(item.title)}<b>+</b></summary><div><p>${h(item.impact)}</p><p class="chart-note">${h(item.scope)}</p><p class="source-links">${sourceLinks(item.refs)}</p><a href="developy.html#${item.id}">Ler o caso completo ↗</a></div></details>`).join('');
    $('efficiency-charts').innerHTML = model.observations.map(item => {
      const percentage = `${item.approx ? '≈ ' : ''}${n(item.reductionPercent)}%`;
      return chart(item.label, item.value, `<div class="efficiency-number"><b>${percentage}</b><span>redução no cenário observado</span></div><div class="comparison-row"><span>Antes</span><i style="width:100%"></i><b>${item.approx ? '≈ ' : ''}${n(item.before)} ${item.unit}</b></div><div class="comparison-row after"><span>Depois</span><i style="width:${Math.max(1, item.after / item.before * 100)}%"></i><b>${item.approx ? '≈ ' : ''}${n(item.after)} ${item.unit}</b></div>`, ['Antes', 'Depois', 'Redução calculada', 'Fonte'], [[n(item.before) + ' ' + item.unit, n(item.after) + ' ' + item.unit, percentage, sourceLinks([item.ref])]], { note: h(item.limit) });
    }).join('');
    const proofs = [
      ['6', 'modelos com ferramentas', 'OpenAI/Grok exercidos por API e navegador em staging e produção no rollout descrito. Anthropic permanece separado e pendente.', ['wpp#2005']],
      ['437 ms', 'recuperação RAG no ensaio', '60 seções, 31 chunks e três perguntas com referência em um teste controlado. Não mede todo o tempo de resposta do modelo.', ['wpp#807']],
      ['40', 'inserções concorrentes', 'Ensaio de auditoria com sequência contínua. É uma prova de concorrência específica, sem extrapolar throughput global.', ['bb#429']],
      ['2', 'réplicas no rolling update', 'Ao menos uma resposta 200 em cada observação do ensaio Developy. Não representa SLA anual ou deploy sem queda de todo serviço.', ['developy#108']],
      ['27–33 s', 'captura retirada da requisição', 'Trabalho síncrono passou para fila no crédito. O processamento continua existindo; não se afirma que todo o tempo foi eliminado.', ['wpp#1337']],
      ['0 byte', 'lag no instante observado', 'Standby off-node e procedimento de failover assistido. A observação não comprova RPO zero ou recuperação automática.', ['wpp#610']],
      ['110+', 'serviços no incidente', 'O incidente de controle registrou 655 descartes SSH em duas horas. Multiplexação trata a causa; o número não é capacidade atual.', ['developy#320']],
      ['12', 'estados de UI verificados', 'Perfis de atendimento em 1280 e 390 px. O PR registra 1.527 testes de API e 1.439 de frontend; não somamos execuções sobrepostas.', ['wpp#2006']],
    ];
    $('proofs').innerHTML = proofs.map(([value, label, note, refs]) => `<article><b>${value}</b><h3>${label}</h3><p>${note}</p><p class="source-links">${sourceLinks(refs)}</p></article>`).join('');
  }
  for (const id of ['dash-from', 'dash-to']) $(id).innerHTML = months.map(month => `<option value="${month}">${monthLabel(month)}</option>`).join('');
  function render() {
    $('dash-repo').value = state.repo; $('dash-from').value = state.from; $('dash-to').value = state.to;
    const selected = delivery(); fixedSections();
    const hash = new URLSearchParams(Object.entries(state).filter(([key, value]) => value && (key !== 'from' || value !== months[0]) && (key !== 'to' || value !== months.at(-1)))).toString();
    history.replaceState(null, '', location.pathname + (hash ? '#' + hash : ''));
    window.dashboardApi = { model, getState: () => ({ ...state }), getFiltered: () => selected, setState: patch => { Object.assign(state, patch); normalize(); render(); } };
  }
  function normalize() {
    if (!keys.includes(state.repo)) state.repo = '';
    if (!months.includes(state.from)) state.from = months[0];
    if (!months.includes(state.to)) state.to = months.at(-1);
    if (state.from > state.to) [state.from, state.to] = [state.to, state.from];
  }
  function readHash() {
    const params = new URLSearchParams(location.hash.slice(1));
    Object.assign(state, { repo: params.get('repo') || '', from: params.get('from') || months[0], to: params.get('to') || months.at(-1) }); normalize();
  }
  $('dash-filters').addEventListener('submit', event => event.preventDefault());
  for (const [id, key] of [['dash-repo', 'repo'], ['dash-from', 'from'], ['dash-to', 'to']]) $(id).addEventListener('change', event => { state[key] = event.target.value; normalize(); render(); });
  $('dash-reset').addEventListener('click', () => { Object.assign(state, { repo: '', from: months[0], to: months.at(-1) }); render(); });
  $('dash-export').addEventListener('click', () => {
    const quote = value => '"' + String(value).replaceAll('"', '""') + '"';
    const rows = [['id', 'base', 'data', 'estado', 'integrado_principal', 'fonte'], ...window.dashboardApi.getFiltered().map(pr => [pr.id, pr.repo, pr.date, pr.state, pr.integrated, pr.url])];
    const url = URL.createObjectURL(new Blob(['\ufeff' + rows.map(row => row.map(quote).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `entregas-${state.repo || 'todas'}-${state.from}-${state.to}.csv`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  window.addEventListener('hashchange', () => { readHash(); render(); });
  readHash(); render();
})();
