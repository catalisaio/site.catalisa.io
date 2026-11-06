import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDossier, renderDossierIndex, renderConstructionHistory } from './render-dossier.mjs';
import { renderInfrastructure } from './infrastructure.mjs';
import { renderTimeline } from './render-timeline.mjs';
import { milestones as editorialMilestones } from './timeline-model.mjs';
import { buildDashboard } from './dashboard-model.mjs';
import { renderDashboard } from './render-dashboard.mjs';
import { renderValueChain } from './render-value-chain.mjs';
import { renderInfographic } from './render-infografico.mjs';
import { buildDiligence, csvExport, requestColumns, riskColumns, vendorColumns, actionColumns } from './diligencia-model.mjs';
import { renderDiligence } from './render-diligencia.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const identitySource = path.resolve(dir, '../../design/entregas-bauhaus/identidade-transitoria.css');
if (fs.existsSync(identitySource)) fs.copyFileSync(identitySource, path.join(dir, 'identidade-transitoria.css'));
const logoSource = path.resolve(dir, '../../design/entregas-bauhaus/logo-full-color.svg');
if (fs.existsSync(logoSource)) fs.copyFileSync(logoSource, path.join(dir, 'catalisa-logo.svg'));
const data = JSON.parse(fs.readFileSync(path.join(dir, 'dados.json'), 'utf8'));
const narrative = JSON.parse(fs.readFileSync(path.join(dir, 'narrativa.json'), 'utf8'));
const metrics = JSON.parse(fs.readFileSync(path.join(dir, 'metricas-codigo.json'), 'utf8'));
const sources = JSON.parse(fs.readFileSync(path.join(dir, 'fontes-codigo.json'), 'utf8'));
const infraEvidence = JSON.parse(fs.readFileSync(path.join(dir, 'infra-evidencias.json'), 'utf8'));
const diligenceSources = JSON.parse(fs.readFileSync(path.join(dir, 'diligencia-fontes.json'), 'utf8'));
const prs = new Map(data.prs.map(p => [p.id, p]));
const repos = new Map(data.repositories.map(r => [r.key, r]));
const labels = { wpp: 'Plataforma Catalisa', bb: 'Building Blocks', developy: 'Developy Cloud' };
const numbers = new Intl.NumberFormat('pt-BR');
const num = n => numbers.format(n);
const replacements = [
  [/med[\s_-]*fund/gi, 'operação de crédito para saúde'], [/banco[\s_-]*pine/gi, 'instituição financeira'], [/\bpine\b/gi, 'instituição financeira'],
  [/p[aá]ssaro[\s_-]*marr[oó][mn]/gi, 'operação de transporte'], [/yarok/gi, 'consultoria'], [/\bfiduc\b/gi, 'operação de investimentos'],
  [/chria(?:[\s_-]*partners)?/gi, 'consultoria parceira'], [/alper/gi, 'operação de seguros'], [/facila/gi, 'produto digital'],
  [/medpay/gi, 'operação de recebíveis'], [/pega[\s_-]*plant[aã]o/gi, 'sistema de escalas e repasses'], [/\bpega\b/gi, 'integração de escalas'],
  [/Marcelo\s+Santos/gi, '[nome omitido]'], [/\bMarcelo\b/gi, '[nome omitido]'], [/multiforncedor/g, 'com múltiplos fornecedores'],
];
const anon = text => replacements.reduce((s, [r, v]) => s.replace(r, v), String(text ?? ''));
for (const story of narrative.stories) {
  for (const field of ['title', 'summary', 'value', 'limit', 'kind']) story[field] = anon(story[field]);
  story.details = story.details.map(anon);
}
fs.writeFileSync(path.join(dir, 'narrativa.json'), JSON.stringify(narrative, null, 2));
const esc = text => String(text ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const h = text => esc(anon(text));
const link = (url, title) => `<a href="${esc(url)}" target="_blank" rel="noopener">${h(title)}</a>`;
const p = text => `<p>${h(text)}</p>`;
const ul = items => `<ul>${items.map(t => `<li>${h(t)}</li>`).join('')}</ul>`;
const table = (heads, rows) => `<table><thead><tr>${heads.map(c => `<th>${h(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const refs = ids => ids.map(id => { const pr = prs.get(id); if (!pr) throw new Error(`PR ausente ${id}`); return link(pr.url, `${labels[pr.repo]} #${pr.number}`); }).join(' · ');
const sourceLink = id => {
  const [key, ...bits] = id.split(':');
  const resource = bits.join(':');
  const repo = repos.get(key);
  const kind = data.files.some(f => f.repo === key && f.path === resource) ? 'blob' : 'tree';
  return link(`https://github.com/${repo.repo}/${kind}/${repo.sha}/${resource}`, `${labels[key]} · ${resource}`);
};
function shell(filename, title, subtitle, body, product, pills) {
  const editions = { 'relatorio-completo.html': '02', 'developy.html': '03', 'investidores.html': '04', 'entrevistas.html': '05' };
  fs.writeFileSync(path.join(dir, filename), renderDossier({ filename, title, subtitle, bodyHtml: body, product, pills, number: editions[filename] }));
}

const infrastructure = renderInfrastructure(data, narrative, { h, p, ul, table, refs, link, storyHtml, sourceLink, num, infraEvidence });
const constructionHistory = renderConstructionHistory(data);
const pace = p('O primeiro commit disponível da plataforma é de 10/11/2025; o corte é de 20/10/2026. A Developy começa em 03/03/2026. A janela de análise é de 24 meses, mas a construção registrada se concentra em menos de 12 meses — e a infraestrutura própria entra durante essa mesma evolução.')
  + p('Construí as três bases. Enquanto a Catalisa ganhava produtos de crédito, banco e Decision, precisei também construir o caminho para publicá-los, conectá-los e operá-los. A aprovação de uma operação, a consistência de um Pix, a privacidade de uma credencial e o stream de uma resposta de IA atravessam essas camadas. É nessa ligação entre entregas que o alcance do trabalho fica visível.') + constructionHistory;

const stats = `<div class="stat-grid">${[
  [num(data.summary.integratedPrs), 'PRs com merge alcançável na principal'],
  [num(data.summary.integratedCommits), 'commits alcançáveis nas principais'],
  [num(narrative.stories.length), 'frentes de valor descritas em detalhe'],
  ['42', 'diretórios funcionais de Building Blocks'],
  [num(metrics.workflowActionTypes), 'tipos de ação no schema do workflow'],
  [num(data.summary.testFiles), 'arquivos de teste nos snapshots'],
].map(([n,t]) => `<div class="stat"><b>${h(n)}</b><span>${h(t)}</span></div>`).join('')}</div>`;

const executive = p('Construí uma plataforma que conecta relacionamento, automação e inteligência artificial à operação de produtos de crédito e serviços bancários. A evolução atravessa três bases: a plataforma de produto, os building blocks reutilizáveis e a infraestrutura Developy Cloud que permite publicá-los, conectá-los e operá-los.')
  + p('O resultado técnico mais relevante é a passagem de integrações e fluxos isolados para capacidades de produto: crédito em camadas com diferentes lastros e instrumentos; decisão versionada com revisão humana; aplicativo, desktop e backoffice bancários; IA com ferramentas e conhecimento próprio; WhatsApp como canal separado; e controles transversais de identidade, consistência financeira, segurança e disponibilidade.')
  + p('Klederson Bueno é o responsável pela construção e evolução apresentada. Os clientes são descritos por segmento. Cada frente está ligada ao histórico técnico; as medições de engenharia conservam o cenário em que foram obtidas.') + stats + pace + infrastructure.compact;

const chain = `<div class="flow">${[
  ['1 · Originação','WhatsApp, formulário, portal, parceiro, aplicativo bancário e simulador com IA.'],
  ['2 · Evidências','Identidade, bureau, dados externos, documentos, lastro e fonte de repasses.'],
  ['3 · Decisão','Produto, política versionada, cálculo, limite, Decision e Mesa.'],
  ['4 · Formalização','Instrumento, PDF, assinatura, hash, poderes do signatário e aceite.'],
  ['5 · Dinheiro','Reserva e bloqueio, Pix idempotente, confirmação de liquidação e trava de recebíveis.'],
  ['6 · Continuidade','Carteira, parcelas, cobrança, renegociação, provisão, prévia SCR e auditoria.'],
].map(([a,b])=>`<div><strong>${h(a)}</strong>${h(b)}</div>`).join('')}</div>`;

const crossRows = [
  ['Crédito distribuído pelo banco','CCP fornece produto, proposta e operação; CBP apresenta e autoriza; BaaS movimenta dinheiro.', ['wpp#1748','wpp#1749','bb#546','bb#608']],
  ['Lastro confirmado e recebimento','Fonte de escala alimenta atestados; crédito confere o lastro; BaaS e Banking executam a trava consentida.', ['bb#625','wpp#1969','wpp#1970','bb#629','wpp#1972']],
  ['Política e revisão humana','Decision avalia e explica; Mesa trata exceção; painel e kit apresentam o mesmo contexto.', ['bb#562','bb#621','wpp#1834','wpp#1945','wpp#1962']],
  ['Documento que libera operação','Template e e-signature produzem evidência; o crédito exige assinatura do termo vigente antes de avançar.', ['wpp#1254','wpp#1380','wpp#1961','bb#632','bb#637']],
  ['Identidade forte no banco','App assina; Banking orquestra; BaaS confere; biometria, people e companies acrescentam identidade e representação.', ['wpp#1623','bb#428','bb#440','bb#442','bb#489','bb#550']],
  ['IA na operação de crédito','Skills e ferramentas chamam as mesmas rotas da mesa; usuário consulta ou opera por conversa.', ['wpp#1437','wpp#1440','wpp#1442','wpp#1445','wpp#1449']],
  ['RAG e isolamento abaixo do tenant','AI Core recupera e injeta; conhecimento aplica owner e contexto; verticais fornecem o contexto de negócio.', ['wpp#789','wpp#815','wpp#820','wpp#894']],
  ['Streaming de IA em réplicas','Assistant expôs a necessidade; Launch preserva afinidade; rollout comprova API e navegador.', ['developy#347','wpp#2005','wpp#2008']],
  ['BBs no runtime nativo','Builder publica templates; Launch provisiona e atualiza; malha direta resolve chamadas entre módulos.', ['bb#531','bb#565','bb#577','developy#264','developy#277']],
  ['Confiabilidade que vira operação','OTel, Pulse e Radar medem; Launch reconcilia; Signal transforma o estado em incidente.', ['wpp#124','developy#279','developy#281','developy#338']],
];
const cross = table(['Cadeia de valor','Contribuição combinada','Evidências'],crossRows.map(([a,b,c])=>[h(a),h(b),refs(c)]));

const today = `<h2 id="hoje">O trabalho de hoje 20 de outubro</h2>` + p('O fechamento desta retrospectiva inclui as entregas e a continuidade do CRM no próprio dia da coleta, além da atualização do AI Core. O snapshot do painel termina no merge #2007. O PR documental #2008 permanecia aberto.') + table(['Frente','O que foi feito','Estado no corte'],[
  ['Perfis reutilizáveis','Criação em quatro etapas, revisão de ações, preparação de atendimento em três etapas e os mesmos componentes no painel e no portal/kit.','PR #2006 integrado; evidências de API e navegador preservadas.'],
  ['Configuração pelo assistente','Conversar → revisar/aprovar → criar recursos inativos. CTA Preparar configuração; mesma credencial e modelo entre planejamento e execução.','PR #2007 integrado; publicação não inferida apenas pelo merge.'],
  ['Aprovação e escopo','Sessão própria e planId obrigatório; decisão antiga ou repetida é recusada. Ferramentas de configuração não podem ativar, enviar, executar ou excluir.','Implementação e regressões descritas em #2007.'],
  ['Validação e falha parcial','Perfil validado antes da escrita; agentes e workflows limitados aos recursos criados pelo plano; ids confirmados preservados se ocorrer erro.','Sem rollback transacional e sem retomada automática após falha.'],
  ['Metas e rotinas','Responsáveis para rotinas e resultados-chave, apresentação contextual e integração com as telas de preparação.','Incluído na integração #2006.'],
  ['Experiência e responsividade','Controles de coleção, filtro e limpeza; wizard e cadência efetiva; correções de sobreposição e navegação em telas menores.','#2006 registra 12 estados em 1280 e 390 px; #2007 acrescenta testes da aprovação.'],
  ['AI Core em produção','Seis modelos OpenAI/Grok com ferramenta real por API e browser/SSE em staging e produção; catálogo e credenciais compartilhados.','#2005 integrado; corpo do PR registra rollout em 20/10 e verificação dentro das réplicas.'],
  ['RAG e continuidade','Fixture de referência, pergunta conhecida/desconhecida, exclusão de contexto e limpeza; seguimento de Anthropic/NIM.','#2008 aberto: oito casos aprovados em produção; staging sem índice configurado, Anthropic pendente.'],
].map(row=>row.map(h))) + `<p class="evidence">${refs(['wpp#2005','wpp#2006','wpp#2007','wpp#2008','developy#347'])}</p>`
  + `<div class="callout">${h('Em #2006 foram registrados 1.527 testes de API e 1.439 de frontend; #2007 registra 1.450 testes de frontend e retestes focados. São execuções de momentos e escopos diferentes, com sobreposição: não se somam como testes únicos. Este levantamento validou as referências e o código congelado, sem repetir o ambiente de produção.')}</div>`;

const activeWork = `<h2 id="frentes-ativas">Frentes em andamento no corte</h2>`
  + p('O trabalho em curso também compõe o acervo, com estado explícito. Os itens abaixo têm implementação ou plano em PR aberto; não estão somados aos merges da principal nem são apresentados como publicação concluída.')
  + table(['Frente ativa','Trabalho já registrado','PRs e dependências'], [
    [h('Canal de crédito genérico v2'),h('Ofertas, comprovantes disponíveis, itens, perfil, simulação, pedido, aceite e operações descritos por produto. Núcleo genérico com adapter de recebíveis e v1 preservada.'),refs(['wpp#1990','wpp#1996','bb#647'])],
    [h('Análise de crédito na Mesa genérica'),h('Pedido em_mesa, caso idempotente, fila por produto, resumo mascarado e aplicação do veredito no domínio de crédito.'),refs(['wpp#1998','wpp#2001'])],
    [h('App e portais para qualquer oferta'),h('Telas por descritor de oferta, evidências e itens; cadastro complementar, conta PJ, contrato da operação e backoffice sem lista fixa de produtos.'),refs(['wpp#1999','wpp#2000','wpp#2003'])],
    [h('Aceite pelo próprio cliente'),h('Link temporário, tela com condições, CET, PDF e aceite. O resultado deve continuar ligado à proposta, ao termo e à chave Pix correta.'),refs(['wpp#1994'])],
    [h('OTP concedido por outra organização'),h('Instalador descobre concessão viva de remetente e template de autenticação, priorizando o canal próprio. O BB #646 já foi integrado; o uso pelo instalador está aberto.'),refs(['bb#646','wpp#1995'])],
    [h('Decision instalável e SaaS'),h('Pendências com caminho para resolução, vendedor e planos provisionados, correção dos três fluxos e reinstalação que reescreve no mesmo id, preservando estado e histórico.'),refs(['wpp#1951','wpp#1967','wpp#1968','wpp#1979'])],
    [h('Boleto e acabamento de operação'),h('Conciliação por nosso número, baixa de parcela, PDF, pagamento simulado e permissões por ação, a partir de defeitos do smoke.'),refs(['wpp#1966'])],
    [h('Provas de IA e RAG'),h('Evidências finais de modelos, índice, recuperação, contexto e navegador; separação das validações aprovadas e dos ambientes bloqueados.'),refs(['wpp#2008'])],
  ]);

const monthlyNotes = {
 '2025-11':['Fundação da mensageria, webhooks e primeiros workflows.','Painel, tenants, hierarquia, permissões, leads e pipeline de entrega.'],
 '2025-12':['Abstração de drivers, chat completo, links de captura e branding.','Validador e simulador de workflow, interpolação e implantação Swarm.'],
 '2026-01':['Canvas visual, custom actions, armazenamento e agentes com dependências DAG.','Building blocks financeiros: BaaS, extração, Open Finance, template e assinatura.'],
 '2026-02':['Cloud API, marketplace, Assistant com plano e autenticação IAM.','BB WPP e portfólio bancário; K3s/ArgoCD e preparação de serviços standalone.'],
 '2026-03':['AI Core compartilhado, multi-provider, billing e OTel.','Core WhatsApp extraído; nasce Developy com infraestrutura, DNS, IAM e observabilidade.','Container modular dos BBs reduz memória no ensaio documentado.'],
 '2026-04':['Meta Business, credenciais de app, ingress por dispositivo e Baileys no BB.','CRM, DataTable, import/export, VTEX, Mercado Livre, Gemini e Intent Router.','Restauração de sessões distribuída e limites de pool.'],
 '2026-05':['Orquestrador compartilhado, exemplos, preview e validação de automação.','Migração operacional para Proxmox, e-mail/calendário e stores Postgres.','Experimento de branding/admin permanece em ramo separado.'],
 '2026-06':['Integrações de recrutamento e serviços; demonstrações de vendas especializadas.','Launch entrega provisionamento, escala e rolling redeploy; Harbor e Ignite evoluem.','Identidade de contatos e afinidade de sessões WhatsApp são endurecidas.'],
 '2026-07':['Data Store, conector DATABASE, Rooms, gravação, transcrição e copiloto.','Verticais, portais por código, design system e rotação SOPS/age.','Confiabilidade de socket, envio e controle de sessão WhatsApp.'],
 '2026-08':['Auditoria e remediação, standby off-node e failover assistido.','RAG com ingestão, pgvector, conectores, ferramentas e contexto.','Fundação de CRM, metas e consultoria; pacotes, portais e antecipação.'],
 '2026-09':['Crédito em camadas, garantias, instrumentos, mesa, carteira, provisão, SCR e cobrança.','Plataforma bancária, biometria, assinatura do titular, desktop e backoffice.','Decision como produto; Launch nativo, malha direta, HA e observabilidade.'],
 '2026-10':['Decision e Mesa avançam: análise, funil, console instalado e governança.','Canal bancário de crédito, lastro confirmado, trava de recebíveis e assinatura OpenSign/mTLS.','Garantia de rebanho, controles financeiros e retenção de execuções.','Em 20/10: CRM guiado, configuração aprovada e AI Core validado em produção.'],
};
const months=[];for(let y=2024,m=10;y<2026||(y===2026&&m<=10);){months.push(`${y}-${String(m).padStart(2,'0')}`);if(++m===13){y++;m=1;}}
const monthRows = months.map(month=>{const ps=data.prs.filter(p=>p.month===month&&p.state==='MERGED');const cs=data.commits.filter(c=>c.month===month&&c.integrated);return [h(month),num(ps.filter(p=>p.repo==='wpp').length),num(ps.filter(p=>p.repo==='bb').length),num(ps.filter(p=>p.repo==='developy').length),num(cs.length),ul(monthlyNotes[month]||['Sem registro de commit ou PR no perímetro dos três repositórios nesta faixa.'])];});
const timeline = p('A janela vai de 20/10/2024 a 20/10/2026, no fuso America/Sao_Paulo. Os primeiros registros disponíveis são de novembro de 2025 na plataforma e nos BBs, e de março de 2026 no Developy. A tabela tem 25 faixas de calendário porque outubro aparece parcialmente nas duas pontas; isso não amplia a janela de 24 meses.')
  + table(['Mês','PRs plataforma','PRs BB','PRs Developy','Commits principais','Evolução'],monthRows)
  + p('PRs são posicionados pela data de merge; commits, pela data de committer convertida ao fuso do relatório. A tabela não transforma múltiplos commits ou PRs da mesma capacidade em novas entregas independentes. A timeline consultável permite chegar a cada registro e sua descrição.');

function storyHtml(story){
 const matched=story.refs.map(id=>prs.get(id));
 const dates=matched.filter(p=>p.mergedAt).map(p=>p.date).sort();
 const label = `${story.id} · ${story.kind} · ${dates[0]||'2026'} a ${dates.at(-1)||'2026'}`;
 const count=matched.filter(p=>p.integrated).length;
 return `<article class="story" id="${story.id}"><div class="eyebrow">${h(label)}</div><h3>${h(story.title)}</h3>${p(story.summary)}${ul(story.details)}<p><b>Valor entregue.</b> ${h(story.value)}</p>${story.limit?`<p class="limit"><b>Alcance da evidência.</b> ${h(story.limit)}</p>`:''}<p class="evidence">${refs(story.refs)}<br>${h(`${count} de ${matched.length} PRs citados têm merge alcançável na principal; os demais têm estado explícito no inventário.`)}</p></article>`;
}

const milestones = table(['Evidência técnica','Resultado documentado','Origem e alcance'],[
 [h('Memória dos building blocks'),h('Aproximadamente 100 GB → 4,2 GB para 28 serviços.'),refs(['bb#93'])+' · '+h('Medição histórica registrada em produção; não representa o consumo atual de toda a plataforma.')],
 [h('Template LXC'),h('Cerca de 20 min → 4 min no build observado.'),refs(['bb#568'])+' · '+h('Ensaio da otimização do rootfs.')],
 [h('Chamada entre serviços'),h('250 ms pela borda → 4,7 ms pela malha direta.'),refs(['developy#277'])+' · '+h('Dois caminhos medidos a partir de um guest.')],
 [h('Ida ao Data Store'),h('707 ms → 242 ms no ensaio descrito.'),refs(['wpp#1569'])+' · '+h('Não é tempo da página inteira.')],
 [h('Pedido de crédito'),h('Captura síncrona de 27–33 s retirada do request.'),refs(['wpp#1337'])+' · '+h('O trabalho continua na fila; não foi eliminado.')],
 [h('RAG documental'),h('60 seções, 31 chunks, 3 perguntas com referência; busca de 437 ms no ensaio.'),refs(['wpp#807'])+' · '+h('Documento e cenário controlados.')],
 [h('Auditoria concorrente'),h('40 inserções concorrentes, sequência contínua no teste descrito.'),refs(['bb#429'])+' · '+h('Teste específico de integridade e concorrência.')],
 [h('Rolling update'),h('Duas réplicas, ao menos uma HTTP 200 a cada observação.'),refs(['developy#108'])+' · '+h('Prova pontual; não é SLA ou disponibilidade anual.')],
 [h('Modelos por API e navegador'),h('Seis modelos OpenAI/Grok nos dois ambientes, com ferramenta real e tokens.'),refs(['wpp#2005'])+' · '+h('Anthropic não entrou no conjunto aprovado.')],
]);

const statusNotes = table(['Tema','O que a evidência permite afirmar','O que permanece separado'],[
 [h('Admin legado'),h('Core WhatsApp foi removido da principal; admin-panel foi removido em branch de marca.'),h('O snapshot principal ainda contém apps/admin-panel; 6030ad197 não é ancestral dele.')],
 [h('Merge fora da principal'),h('16 PRs mesclados têm merge SHA fora da ancestralidade principal.'),h('Conteúdo pode ter sido reaplicado por outro merge, como a evolução de Rooms. Ancestralidade não é equivalência de patch.')],
 [h('HA'),h('Replicação off-node, distribuição por nó, VIP e reconciliação foram implementados e têm provas específicas.'),h('Failover automático integral, restore total, RPO zero e SLA não foram estabelecidos por este levantamento.')],
 [h('Bancário'),h('App Android em dispositivo real, contratos, orquestração e backoffice possuem implementações e smokes.'),h('Há métodos 501, capacidades dependentes do provedor e atestação registrada sem validação. Publicação em loja não foi demonstrada.')],
 [h('Decision'),h('SaaS, instalação, políticas, Mesa, métricas e análises têm código e entregas incrementais.'),h('Linha de chegada ainda inclui PRs abertos, reinstalação no lugar, prova de tenant novo e fechamento comercial.')],
 [h('RAG de hoje'),h('Entrega histórica de agosto e ensaios posteriores documentados.'),h('PR #2008 aberto registra staging sem índice; uma prova antiga não garante configuração atual em todo ambiente.')],
 [h('Receita e impacto'),h('Existe capacidade de monetização, oferta, preços, autosserviço e mecanismos operacionais.'),h('Receita, ARR, clientes pagantes, carteira financeira e redução de custo em reais não foram inferidos de commits.')],
].map(r=>r));

const snapshots = table(['Repositório','Snapshot congelado','Primeiro registro','Acervo'],data.repositories.map(r=>[link('https://github.com/'+r.repo,r.repo),link('https://github.com/'+r.repo+'/commit/'+r.sha,r.sha.slice(0,12)),h(r.firstCommit.slice(0,10)),h(`${num(r.commits)} commits em refs disponíveis; ${num(r.integratedCommits)} principais; ${num(r.docs)} documentos; ${num(r.testFiles)} arquivos de teste`)]));

const method = p('O corpus usa todos os PRs acessíveis retornados pelo GitHub, de todos os estados, e todos os commits disponíveis nas referências locais completas dos três repositórios, após atualização das referências principais. Não há shallow clone. As fontes foram congeladas por SHA; mudanças locais não commitadas não são contadas como entregas.')
  + p('Cada PR conserva título, descrição, datas, destino, branch de origem, estado, contagem de arquivos e merge. Os commits preservam mensagem, datas e caminhos alterados. Foram associados diffs de merge para 2.855 dos 2.856 PRs mesclados; o objeto de um merge histórico não está nas referências disponíveis, mas seu registro de PR foi preservado. Documentos atuais foram inventariados por caminho e títulos; documentos históricos aparecem em índice separado. A leitura de código cruza a estrutura atual, os arquivos modificados e verificações dirigidas nos pontos centrais; não é uma auditoria linha a linha de todos os patches.')
  + snapshots
  + table(['Critério','Contagem e interpretação'],[
   ['PRs coletados',`${num(data.summary.prs)} = ${num(data.summary.mergedPrs)} mesclados + ${num(data.summary.openPrs)} abertos + ${num(data.summary.closedPrs)} fechados sem merge.`],
   ['Principal',`${num(data.summary.integratedPrs)} merges alcançáveis; 16 merges fora da ancestralidade principal.`],
   ['Commits',`${num(data.summary.commits)} em refs disponíveis; ${num(data.summary.integratedCommits)} alcançáveis nas principais. Merge, cherry-pick e recuperação de branch não contam automaticamente como uma capacidade inédita.`],
   ['Documentação',`${num(data.summary.docsCurrent)} documentos atuais e ${num(data.summary.docsHistorical)} caminhos históricos adicionais; inventário com links de origem.`],
   ['Código',`${num(data.summary.files)} arquivos rastreados nos snapshots, ${num(data.summary.modules)} diretórios de módulos indexados e ${num(metrics.panelPrismaModels)} models no schema Prisma do painel.`],
   ['Classificação','28 categorias temáticas, múltiplas por item. Tags são classificação heurística; as 110 frentes recebem síntese editorial com evidências próprias. Contagens de tags não se somam como total de entregas.'],
   ['Publicação','Merge prova integração, não deploy. Publicação e resultados de runtime só são descritos quando há evidência documental vinculada; este estudo não operou nem testou a infraestrutura viva.'],
   ['Privacidade','Clientes anonimizados no texto de apresentação. Anexos reservados mantêm caminhos e URLs exatos de origem para rastreabilidade; segredos reconhecíveis foram suprimidos.'],
   ['Perímetro','Dependências externas como runners, SDKs, serviços de fonte e outros repositórios aparecem como integração referenciada, sem inventar uma auditoria do histórico completo fora dos três projetos.'],
  ].map(row=>row.map(h)));

const modulesHtml = data.repositories.map(repo=>`<h3>${h(labels[repo.key])}</h3>`+table(['Módulo ou diretório','Papel documentado','Arquivos / testes'],data.modules.filter(m=>m.repo===repo.key).map(m=>[link(m.url,m.name),h(m.metadata.tagline||m.title),h(`${m.files} / ${m.testFiles}`)]))).join('');
const categoryRows = data.categories.map(cat=>{const ps=data.prs.filter(p=>p.categories.includes(cat.id));return [h(cat.label),num(ps.filter(p=>p.integrated).length),num(ps.filter(p=>p.state==='OPEN').length),h('Consulta detalhada no inventário; tags podem se sobrepor.')];});
const sourceAudit = table(['Código inspecionado','Linhas do arquivo','Conexão com o relatório'],sources.map(s=>[link(s.url,`${labels[s.repo]} · ${s.path.split('/').at(-1)}`),num(s.lines),h(s.repo==='wpp'?'Conhecimento, contexto, desembolso e aprovação de configuração':s.repo==='bb'?'Autorização, bloqueio, captura, integridade e assinatura':'HA, afinidade de stream e incidentes')]));

let full = `<h2 id="sintese">A plataforma construída e o valor entregue</h2>${executive}<h2>Como ler e consultar</h2>${p('Use este relatório para a narrativa completa, a versão de investidores para a apresentação executiva e a versão de entrevistas para os casos de engenharia. A timeline contém todos os PRs, commits, documentos e módulos pesquisáveis, inclusive manutenção, reversões, correções pequenas e trabalho em aberto. Os CSVs e o JSON permitem aprofundar cada registro.')}<div class="toc">${['sintese','hoje','frentes-ativas','impacto-developy','cadeia','timeline',...narrative.groups.map(g=>g.id),'medicoes','limites','modulos','categorias','metodo'].map(id=>`<a href="#${id}">${h(({sintese:'Visão executiva',hoje:'CRM e IA de hoje','frentes-ativas':'Trabalho em andamento','impacto-developy':'Impacto da Developy',cadeia:'Cadeias entre repositórios',timeline:'Timeline mensal',medicoes:'Medições documentadas',limites:'Estado e limites',modulos:'Inventário dos módulos',categorias:'Classificação temática',metodo:'Método e fontes'})[id]||narrative.groups.find(g=>g.id===id).title)}</a>`).join('')}</div>${today}${activeWork}<section class="chapter">${infrastructure.summary}</section><section class="chapter"><h2 id="cadeia">O valor nas conexões entre os projetos</h2>${chain}${cross}</section><section class="chapter"><h2 id="timeline">Timeline dos 24 meses</h2>${timeline}</section>`;
for(const group of narrative.groups){full+=`<section class="chapter"><h2 id="${group.id}">${h(group.title)}</h2>${narrative.stories.filter(s=>s.group===group.id).map(storyHtml).join('')}<h3>Código e documentação de referência</h3><p class="evidence">${group.code.map(sourceLink).join('<br>')}</p><p class="evidence">${group.docs.map(sourceLink).join('<br>')}</p></section>`;}
full+=`<section class="chapter"><h2 id="medicoes">Medições que podem sustentar a apresentação</h2>${milestones}<h2 id="limites">Estado comprovado e limites da narrativa</h2>${statusNotes}</section><section class="chapter"><h2 id="modulos">Inventário estrutural dos módulos</h2>${p('Os 42 diretórios funcionais dos BBs, 86 módulos da API do painel e 31 diretórios do servidor Developy constam abaixo. Contagem de arquivos inclui código, testes e documentação; diretório indexado não significa produto comercial independente. Texto de README pode refletir outra fase: o estado de uma capacidade é qualificado pelos PRs e pela narrativa.')}${modulesHtml}</section><section class="chapter"><h2 id="categorias">Classificação do acervo</h2>${table(['Categoria','PRs principais','PRs abertos','Interpretação'],categoryRows)}<h2 id="metodo">Perímetro método e rastreabilidade</h2>${method}<h3>Pontos centrais conferidos no código congelado</h3>${sourceAudit}<h3>Arquivos para aprofundamento</h3>${ul(['timeline.html: consulta offline com descrição completa de PR e commit, caminhos alterados e filtros.','prs.csv e commits.csv: inventários integrais em planilha.','documentos.csv e modulos.csv: documentação atual, histórica e estrutura do código.','dados.json, cobertura.json, fontes-codigo.json e metricas-codigo.json: base estruturada e contagens.','narrativa.json: 110 frentes organizadas, com referências de evidência.','verificacao.json e manifesto-sha256.json: consistência e integridade dos artefatos.'])}</section>`;
shell('relatorio-completo.html','Crédito, banco e IA.<em>A plataforma construída.</em>','Retrospectiva detalhada de engenharia e produto em três repositórios, com timeline, valor entregue e evidências. Janela de 20/10/2024 a 20/10/2026.',full,'Dossiê completo de entregas',[`${num(data.summary.integratedPrs)} PRs na principal`,'110 frentes de valor','3 bases conectadas']);

const investorBody=`<h2>A tese materializada em produto</h2>${executive}<h2>O que existe como capacidade</h2>${chain}${table(['Ativo','O que foi construído','Valor de negócio habilitado'],[
 ['Catalisa Credit Platform','Crédito em camadas, diferentes lastros e instrumentos, limites, mesa, parceiros, carteira e cobrança.','Expansão de modalidades e canais usando o mesmo ciclo de operação.'],
 ['Catalisa Banking Platform','App, desktop, backoffice e orquestração sobre BaaS, com assinatura do titular e controles financeiros.','Distribuição de serviços financeiros e crédito em uma experiência de marca própria.'],
 ['Catalisa Decision','Políticas versionadas, simulação, execução, rastreabilidade, Mesa e análises.','Capacidade vendável isoladamente ou embutida em produtos.'],
 ['IA operacional','AI Core com provedores, Assistant com ferramentas, RAG e copiloto durante e depois do atendimento.','Menos trabalho de navegação e configuração; uso do conhecimento do próprio negócio.'],
 ['Building Blocks e Developy','42 diretórios funcionais, runtime e publicação, rede, dados, observabilidade e governança.','Base reutilizável para lançar e operar produtos com dependências compartilhadas.'],
].map(r=>r.map(h)))}${infrastructure.summary}<h2>Por que os ativos se reforçam</h2>${p('O canal de relacionamento alimenta a originação. Dados e evidências alimentam políticas e a revisão humana. A decisão vira contrato e movimento financeiro. O banco distribui o crédito e controla o consentimento. A IA usa as mesmas regras para ajudar a operar. A infraestrutura sustenta as conexões e o ciclo de publicação. O valor comercial potencial vem dessa composição, além de cada componente isolado.')}${p('A combinação oferece rotas de monetização implementadas: planos e consumo, decisão como SaaS, biometria como serviço, pacotes e produtos verticais. O histórico técnico comprova a construção dessas capacidades; validação comercial e financeira requer seus próprios números.')}<h2>Avanços recentes</h2>${p('Em setembro e outubro, a base se concentrou na esteira de crédito, plataforma bancária, Decision, lastro confirmado e trava de recebíveis. Em 20 de outubro, o CRM recebeu perfis e preparação guiada pelo assistente com aprovação, enquanto o AI Core teve seis modelos OpenAI/Grok verificados pelo caminho real de API e navegador em staging e produção.')}<p class="evidence">${refs(['wpp#2005','wpp#2006','wpp#2007','wpp#1748','bb#629','wpp#1969'])}</p><h2>Evidência de eficiência de engenharia</h2>${milestones}<h2>O que este material não transforma em tração</h2>${p('PRs, código, integrações e demonstrações são indicadores da construção do ativo tecnológico. Receita recebida, ARR/MRR, clientes pagantes, volume de crédito, inadimplência observada, margem e retenção não foram calculados a partir deles. Para uma rodada, esses indicadores devem acompanhar este dossiê em uma base financeira independente.')}<h2>Estado de maturidade</h2>${p('Os produtos têm diferentes graus de implementação e publicação. Existem capacidades aprovadas em ensaios reais, caminhos condicionados a configuração e fornecedor, e melhorias ainda em PR aberto. HA foi tratada por replicação, distribuição de réplicas, reconciliação e controles de publicação; não se apresenta disponibilidade anual ou failover integral como prova concluída.')}<p class="evidence">${refs(['wpp#610','wpp#616','developy#108','developy#229','developy#264','wpp#1988'])}</p>`;
shell('investidores.html','Uma base para operar <em>crédito, banco e IA.</em>','Ativos de produto e engenharia construídos por Klederson Bueno. Síntese para apresentação, com clientes anonimizados.',investorBody,'Visão para investidores',['Crédito e Banking','Decision e IA','Infraestrutura própria']);

const interviewCases=[
 ['Arquitetura de plataforma de crédito',['E001','E003','E009','E011','E027'],'Como manter o núcleo estável quando novos produtos precisam de lastros diferentes?','Separei os estágios comuns no credito-base e defini contratos para lastro, instrumento, política, eventos e instalação. Reaproveitei a mesa e os serviços financeiros em modalidades distintas.','O acervo mostra antecipação, veículo, imóvel, pessoal, consignado e rural; a evolução alcançou recebíveis confirmados e garantia de rebanho. Posso explicar quais integrações são portas e quais foram exercidas.'],
 ['Consistência financeira sob concorrência',['E015','E036','E037'],'Como impedir que retry ou duas réplicas causem pagamento duplicado ou gastem saldo comprometido?','Modelei idempotência e estados de desfecho, reservei sob trava e distingui confirmação de liquidação de mera resposta HTTP. A operação só é paga com Pix COMPLETED; consulta não autoriza novo pagamento.','Há correções de desembolso, chave de operação e saldo gastável com saídas em voo; os ensaios e as falhas residuais estão documentados.'],
 ['Decisão explicável e humano no circuito',['E045','E050','E051'],'Como automatizar sem perder a explicação e a responsabilidade da decisão humana?','Conectei política versionada, fontes, trace e export. Extraí uma Mesa genérica com idempotência, lock otimista, atribuição e quatro olhos.','O Decision tem console próprio e modo instalado; a revisão mostra origem, contexto e veredito. A prova final de alguns caminhos continua explicitamente pendente.'],
 ['RAG multi-tenant e contexto abaixo da conta',['E061','E062','E063','E064','E066'],'Como recuperar documentos sem misturar escritórios ou pacientes atendidos pelo mesmo agente?','Exigi owner no armazenamento e na busca; acrescentei contexto fornecido pelo servidor, com todas as tags obrigatórias. Separei prefixo estável e trechos voláteis e implementei indexação, exclusão e consulta ativa.','Existe prova documental de ingestão e resposta com referência; em 20/10, o seguimento registra pergunta conhecida/desconhecida por API e navegador e trata staging sem índice como bloqueado.'],
 ['IA que opera um produto real',['E055','E057','E058','E059','E071','E072'],'Como transformar chat em trabalho verificável em uma plataforma complexa?','Compartilhei provider e credencial, defini skills contextuais, previews e validadores, liguei ferramentas às rotas do domínio e usei aprovação para criar configuração inativa.','Há operação de mesa por IA, ferramentas de conhecimento e composição guiada de atendimento. Modelos foram exercidos por API e SSE; as limitações de falha parcial permanecem visíveis.'],
 ['Disponibilidade e fronteira aplicação infraestrutura',['E081','E082','E083','E088'],'Como sustentar serviços distribuídos quando a falha aparece no usuário?','Rastreei estado de réplicas, distribuição por nó, DNS e afinidade do stream; tratei a solução no Launch e preservei a configuração durante reconciliação e redeploy.','Há prova pontual de rolling update com duas réplicas, standby off-node e correção de SSE com cookie; consigo distinguir capacidade, recuperação e SLA.'],
 ['Segurança como engenharia de produto',['E095','E096','E098','E100'],'Como corrigir exposição sem depender de instrução no prompt ou disciplina manual?','Restringi autorização no servidor, escopo de tenant, acesso por pessoa, credencial e ferramenta. Remediei falhas confirmadas e acrescentei registros de integridade, retenção e testes de fronteira.','O histórico preserva correções de IDOR, SSRF, sandbox, segredos, navegador e auditoria concorrente, sem reivindicar certificação ou ausência de risco.'],
 ['Eficiência com evidência',['E092','E093'],'Como reduzir custo técnico sem esconder os limites da medição?','Modularizei o container dos building blocks, investiguei o build LXC e reduzi consultas redundantes e tráfego pela borda. Removi caches locais quando ameaçavam consistência com réplicas.','Os ensaios registram cerca de 100→4,2 GB para 28 serviços, build de cerca de 20→4 min e caminho de rede 250→4,7 ms, com o escopo de cada medição.'],
];
interviewCases.push(
 ['Escala do plano de controle e proteção da frota',['E081','E082'],'Por que uma frota com recursos livres falha ao publicar e reconciliar serviços?','Rastreei o limite até o MaxStartups do SSH: cada comando abria outra conexão. Implementei multiplexação por host, inclusive no salto interno, e protegi o caminho que reconfere a instância antes de destruir.','O incidente registra mais de 110 serviços, 655 descartes de conexão em duas horas e regressões que falham sem a correção. É evidência do problema e da solução, sem extrapolar para a capacidade atual da frota.'],
 ['Infraestrutura com efeito direto em crédito e Banking',['E086','E087','E091'],'Como uma falha abaixo da aplicação muda a operação de um produto financeiro?','Restringi DNAT ao endereço de destino do host para impedir que uma regra de Scylla capturasse HTTP de um hotsite de crédito. Também mascarei env no Launch e separei revelação auditada, protegendo material usado nas credenciais de BaaS.','As mudanças tratam a causa compartilhada e os ciclos de reconciliação e edição. Os PRs preservam o defeito concreto, os testes e as condições de publicação.'],
);
const caseExtraRefs = { 'Escala do plano de controle e proteção da frota': ['developy#320','developy#325','developy#321'], 'Infraestrutura com efeito direto em crédito e Banking': ['developy#334','developy#335','developy#326','developy#327'] };
const storyMap=new Map(narrative.stories.map(s=>[s.id,s]));
let interview=`<h2>Apresentação em primeira pessoa</h2>${p('Eu construí uma plataforma de crédito, serviços bancários e automação com IA, trabalhando desde a experiência do usuário até os serviços financeiros, segurança e infraestrutura. O ponto central do meu trabalho foi transformar integrações isoladas em capacidades reutilizáveis: diferentes produtos de crédito sobre o mesmo ciclo operacional, Decision com política e revisão humana, e IA que consulta e executa pelas regras do produto.')}${p('Também construí a base de operação: WhatsApp como building block, serviços de dados, publicação, rede e observabilidade. Consigo explicar tanto decisões de arquitetura quanto falhas concretas que encontrei em produção ou em smokes, e como as corrigi com testes e evidências. Os casos abaixo conectam as decisões que tomei ao código e às evidências do resultado.')}${pace}${infrastructure.compact}<h2>Versão curta para currículo</h2>${ul(['Desenvolvi plataforma modular de crédito com originação multicanal, produtos com diferentes lastros, formalização, desembolso idempotente, carteira e cobrança.','Construí componentes de plataforma bancária, incluindo aplicativo, desktop, backoffice, assinatura de operações pelo aparelho e orquestração sobre BaaS.','Implementei Decision com política versionada, simulação, rastreabilidade e Mesa genérica de revisão humana.','Estruturei AI Core multi-provider, Assistant com ferramentas, RAG com isolamento por contexto e copiloto para atendimento.','Evoluí infraestrutura própria de publicação, rede, serviços de dados, observabilidade e resiliência, com resultados técnicos medidos e documentados.'])}<h2>Competências demonstráveis</h2>${table(['Domínio','Evidência concreta'],[
 ['Produto e arquitetura','Pacotes instaláveis, APIs, contratos de domínio, interfaces por canal e separação entre produto, building block e infraestrutura.'],
 ['Backend e dados','TypeScript, NestJS, Hono/Bun, PostgreSQL, Prisma/Drizzle, Redis, filas, locks, idempotência e eventos.'],
 ['IA aplicada','Adapters de modelo, tool loop, skills, orquestração, RAG/pgvector, embeddings e avaliação pelo caminho de API/UI.'],
 ['Aplicações','React, React Native/Expo, componentes compartilhados, SDKs, experiência responsiva e recursos nativos Kotlin/Swift.'],
 ['Operação','Proxmox/LXC, DNS, TLS/mTLS, Traefik/HAProxy, CI CD, observabilidade, replicação e procedimentos de recuperação.'],
 ['Qualidade e segurança','Testes de domínio e concorrência, isolamento de tenant, controles de autorização, proteção de segredo e verificação de auditoria.'],
].map(r=>r.map(h)))}<h2>Casos para aprofundar na entrevista</h2>`;
for(const [title,ids,situation,action,result]of interviewCases){const evid=[...new Set([...(caseExtraRefs[title] || []), ...ids.flatMap(id=>{if(!storyMap.has(id))throw new Error(id);return storyMap.get(id).refs;})])];interview+=`<article class="story"><h3>${h(title)}</h3><p><b>Problema.</b> ${h(situation)}</p><p><b>Minha ação.</b> ${h(action)}</p><p><b>Resultado que posso demonstrar.</b> ${h(result)}</p><p class="evidence">${refs(evid.slice(0,12))}</p></article>`;}
interview+=`<h2>Atualização de hoje para uma entrevista</h2>${p('Hoje fechei a evolução do CRM que permite preparar perfis de atendimento pelo painel e portal. A configuração passa por conversa, revisão e aprovação antes de criar recursos inativos. Trabalhei também nos responsáveis por metas e rotinas, no contexto da interface e em regressões de tenant, sessão e planos. Em paralelo, o AI Core teve seis modelos OpenAI/Grok exercidos em staging e produção por API e navegador, com ferramentas e contagem real de tokens.')}<p class="evidence">${refs(['wpp#2005','wpp#2006','wpp#2007'])}</p><h2>Cuidados para responder com precisão</h2>${ul(['Apresente resultado medido com o cenário e a fonte, sem extrapolar uma prova local para disponibilidade anual ou capacidade global.','Descreva papel e decisões em primeira pessoa, mas use a data e o status do inventário ao falar de publicação.','Diferencie SDK ou adaptador implementado de contrato, homologação, credenciamento ou operação comercial.','Não some execuções sobrepostas de testes, linhas adicionadas ou PRs como se fossem produtos independentes.','Use descrições de segmento para clientes e deixe a conversa técnica apoiada nos exemplos anonimizados.'])}`;
shell('entrevistas.html','Arquitetura, produto e operação.<em>Casos para entrevistas.</em>','Narrativa profissional de Klederson Bueno, competências e casos concretos para aprofundamento técnico. Clientes anonimizados.',interview,'Portfólio para entrevistas',['10 casos de engenharia','Resultados rastreáveis','Construção de ponta a ponta']);
shell('developy.html','A plataforma por baixo <em>da plataforma.</em>','O impacto da Developy Cloud na Catalisa: publicação, building blocks, IA, rede, dados, segurança e continuidade operacional.',infrastructure.body.replace(infrastructure.compact,constructionHistory+infrastructure.compact),'Developy Cloud · infraestrutura aplicada',[`${num(infrastructure.integrated)} PRs na principal`,'14 frentes + 9 casos de impacto','31 diretórios de servidor']);

fs.writeFileSync(path.join(dir, 'timeline.html'), renderTimeline(data, narrative, replacements));
const dashboard = buildDashboard(data, narrative, metrics);
fs.writeFileSync(path.join(dir, 'dashboard-data.json'), JSON.stringify(dashboard, null, 2));
fs.writeFileSync(path.join(dir, 'dashboard.html'), renderDashboard(dashboard));
fs.writeFileSync(path.join(dir, 'cadeia-de-valor.html'), renderValueChain(dashboard));

const index = renderDossierIndex({ stories: num(narrative.stories.length), prs: num(data.summary.prs), commits: num(data.summary.commits), integratedDevelopy: num(infrastructure.integrated), developyPrs: num(infrastructure.total), milestoneCount: editorialMilestones.length, constructionHistory });
fs.writeFileSync(path.join(dir,'dossie.html'),index);
const infographic = renderInfographic(dashboard);
for (const name of ['index.html', 'infografico.html']) fs.writeFileSync(path.join(dir, name), infographic.html);
const diligence = buildDiligence(data, narrative, diligenceSources, sources, infraEvidence);
fs.writeFileSync(path.join(dir, 'diligencia-dados.json'), JSON.stringify(diligence, null, 2));
for (const [filename, html] of Object.entries(renderDiligence(diligence))) fs.writeFileSync(path.join(dir, filename), html);
for (const [filename, rows, columns] of [
  ['diligencia-pedidos.csv', diligence.requests, requestColumns],
  ['diligencia-riscos.csv', diligence.risks, riskColumns],
  ['homologacao-controles.csv', diligence.vendorControls, vendorColumns],
  ['diligencia-acoes.csv', diligence.executive.actions, actionColumns],
]) fs.writeFileSync(path.join(dir, filename), csvExport(rows, columns));
process.stdout.write(JSON.stringify({stories:narrative.stories.length,groups:narrative.groups.length,prs:data.prs.length,commits:data.commits.length,htmlFiles:15,diligence:diligence.counts}) + String.fromCharCode(10));
