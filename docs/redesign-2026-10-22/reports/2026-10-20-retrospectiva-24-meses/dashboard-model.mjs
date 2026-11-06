import { infrastructureCases } from './infrastructure.mjs';

export function buildDashboard(data, narrative, metrics) {
  const prs = new Map(data.prs.map(item => [item.id, item]));
  const stories = narrative.stories.map(story => ({ ...story, refs: [...new Set(story.refs)] }));
  const observations = [
    { id: 'memory', label: 'Memória de 28 serviços', before: 100, after: 4.2, unit: 'GB', approx: true, ref: 'bb#93', value: 'Menor demanda de memória no ensaio do container modular.', limit: 'Aproximações registradas para 28 serviços; não é o consumo atual da frota nem economia financeira medida.' },
    { id: 'build', label: 'Build de template LXC', before: 20, after: 4, unit: 'min', approx: true, ref: 'bb#568', value: 'Iterações de publicação mais curtas no cenário observado.', limit: 'Tempos aproximados de um build; não mede o lead time de todas as entregas.' },
    { id: 'network', label: 'Caminho entre serviços', before: 250, after: 4.7, unit: 'ms', approx: false, ref: 'developy#277', value: 'Chamadas entre BBs evitam a volta pela borda pública.', limit: 'Comparação a partir de um guest: borda versus malha direta. Não é a latência completa do produto.' },
    { id: 'datastore', label: 'Roundtrip do DataStore', before: 707, after: 242, unit: 'ms', approx: false, ref: 'wpp#1569', value: 'Menor espera em uma dependência da operação da mesa.', limit: 'Roundtrip observado; não representa o tempo total de carregamento da mesa.' },
  ].map(item => ({ ...item, reductionPercent: 100 * (1 - item.after / item.before), ratio: item.before / item.after, url: prs.get(item.ref).url }));
  const chains = [
    ['Originação', 'Canais, parceiros e simulação alimentam a mesma operação.', ['E005', 'E019', 'E042', 'E073', 'E078']],
    ['Evidências', 'Identidade, lastro e dados sustentam a análise.', ['E009', 'E010', 'E026', 'E028', 'E035', 'E099', 'E100']],
    ['Decisão', 'Política versionada e revisão humana preservam explicação.', ['E006', 'E007', 'E008', 'E045', 'E046', 'E047', 'E050', 'E051']],
    ['Formalização', 'Documento e aceite passam a condicionar o avanço.', ['E012', 'E013', 'E014']],
    ['Dinheiro', 'Desembolso, saldo e recebíveis têm controles próprios.', ['E015', 'E016', 'E027', 'E031', 'E036', 'E037', 'E038', 'E039']],
    ['Continuidade', 'Carteira, provisão, cobrança e acompanhamento fecham o ciclo.', ['E020', 'E021', 'E022', 'E023', 'E024', 'E025']],
  ].map(([label, value, ids]) => ({ label, value, stories: ids }));
  const ai = [
    ['Core e ferramentas', ['E055', 'E056', 'E057', 'E058', 'E059', 'E060']],
    ['Conhecimento e RAG', ['E061', 'E062', 'E063', 'E064', 'E065', 'E066']],
    ['Copiloto e operação', ['E067', 'E068', 'E069', 'E070', 'E071', 'E072']],
  ].map(([label, ids]) => ({ label, stories: ids }));
  return {
    schemaVersion: 1, cutoff: data.period.end, period: data.period,
    method: {
      inventory: 'dados.json', narrative: 'narrativa.json', schema: 'metricas-codigo.json',
      deliveryDate: 'PR integrado ou merge em outro ramo: mergedAt; aberto: createdAt; fechado sem merge: closedAt. Datas convertidas para America/Sao_Paulo.',
      categories: 'Classificação temática do acervo; um PR pode aparecer em várias categorias.',
      stories: '110 frentes editoriais com referências; não são produtos independentes. Cadeias são recortes editoriais sobre essas mesmas frentes e podem se sobrepor.',
      snapshot: 'Arquivos, módulos e testes são inventários do código congelado. Não são cobertura de testes nem execução de todos os testes.',
      business: 'Valor apresentado como capacidade de produto e resultado de engenharia. Receita, ARR, usuários, volume de crédito, SLA e economia em reais não foram medidos por este acervo.',
    },
    repositories: data.repositories.map(repo => ({ ...repo, modules: data.modules.filter(item => item.repo === repo.key).length })),
    categories: data.categories, summary: data.summary,
    prs: data.prs.map(pr => ({ id: pr.id, repo: pr.repo, number: pr.number, integrated: pr.integrated, state: pr.state, type: pr.type, categories: pr.categories, date: new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(pr.mergedAt || (pr.state === 'CLOSED' ? pr.closedAt : pr.createdAt))), url: pr.url })),
    groups: narrative.groups.map(({ id, title }) => ({ id, title })), stories,
    modules: data.modules.map(({ repo, name, files, testFiles, url }) => ({ repo, name, files, testFiles, url })),
    workflowActionTypes: metrics.workflowActionTypes, panelPrismaModels: metrics.panelPrismaModels,
    observations, chains, ai,
    infrastructure: infrastructureCases.map(({ id, title, impact, scope, refs }) => ({ id, title, impact, scope, refs })),
  };
}
