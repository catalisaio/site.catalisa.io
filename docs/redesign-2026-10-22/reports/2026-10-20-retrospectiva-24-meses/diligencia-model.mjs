import { domains, findings, risks, vendorControls, vendorGroups, evidenceStates, priorities, methodologySources, transitionPlan } from './diligencia-conteudo.mjs';
import { executiveAssessment } from './diligencia-sintese.mjs';

const labels = { wpp: 'Catalisa', bb: 'Building Blocks', developy: 'Developy Cloud' };
const csvCell = value => {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
};

export function csvExport(rows, columns) {
  return '\uFEFF' + [columns.map(([, title]) => csvCell(title)).join(';'), ...rows.map(row => columns.map(([key]) => csvCell(row[key])).join(';'))].join('\r\n') + '\r\n';
}

export function buildDiligence(data, narrative, documentEvidence, codeEvidence, infraEvidence) {
  const prs = new Map(data.prs.map(item => [item.id, item]));
  const sources = narrative.stories.map(story => ({
    id: story.id, title: story.title, type: 'Frente editorial com fontes', level: 'Registro técnico e histórico; consultar limites',
    href: `relatorio-completo.html#${story.id}`, location: `narrativa.json · stories[id=${story.id}]`,
    observation: story.summary, limit: story.limit || 'A descrição e seus PRs não comprovam isoladamente publicação atual, aceite comercial ou certificação.',
    references: story.refs.map(id => {
      const pr = prs.get(id);
      if (!pr) throw new Error(`PR ausente na diligência: ${id}`);
      return { id, url: pr.url, stateAtCutoff: pr.state, integratedAtCutoff: pr.integrated, mergeSha: pr.mergeSha || null };
    }),
    audience: 'Narrativa anonimizada; fontes privadas para avaliadores autorizados',
  }));
  sources.push(...documentEvidence.documents.map(item => ({
    ...item, title: item.path.split('/').at(-1), type: 'Documento interno conferido por blob', level: 'Autodeclaração ou procedimento interno; efetividade a validar',
    href: item.url, location: `${labels[item.repo]} · ${item.path} · ${item.snapshot}`, references: [],
    limit: 'Leitura do conteúdo no snapshot não comprova vigência, contrato assinado, execução, certificação ou aprovação independente.', audience: 'Consulta reservada sob autorização',
  })));
  for (const [prefix, records] of [['CODE', codeEvidence], ['INF', infraEvidence]]) {
    sources.push(...records.map((item, index) => ({
      id: `${prefix}-${String(index + 1).padStart(2, '0')}`, title: item.path.split('/').at(-1), type: 'Ponto de código no snapshot',
      level: 'Código inspecionado; execução atual não revalidada', href: item.url, location: `${labels[item.repo]} · ${item.path} · ${item.sha}`,
      observation: item.checkpoint || 'Trechos inspecionados no código congelado.', matches: item.matches, references: [],
      limit: 'Trecho selecionado não constitui revisão integral nem comprova a configuração instalada.', audience: 'Consulta técnica reservada',
    })));
  }
  const codeLinks = {
    'DD-003': ['CODE-03', 'CODE-05'], 'DD-007': ['CODE-01', 'CODE-02'],
    'DD-014': ['CODE-07'], 'DD-022': ['CODE-04'], 'DD-023': ['CODE-01', 'CODE-02'],
    'DD-026': ['CODE-09', 'CODE-10', 'INF-01'],
  };
  const reviewedFindings = findings.map(item => ({ ...item, evidence: [...item.evidence, ...(codeLinks[item.id] || [])], stateLabel: evidenceStates[item.status] }));
  const requests = reviewedFindings.map((item, index) => ({
    id: `REQ-${String(index + 1).padStart(3, '0')}`, finding: item.id, domain: item.domain,
    title: item.title, priority: item.priority, owner: item.owner, ownerStatus: item.ownerStatus,
    status: item.status === 'solicitar' ? 'Não fornecido no acervo analisado' : 'Complementação e validação necessárias',
    requested: item.deliverable, why: item.impact, acceptance: item.acceptance, evidence: item.evidence,
    audience: ['societario', 'financeiro', 'pessoas', 'comercial'].includes(item.domain) ? 'Sala restrita: destinatários autorizados' : 'Compartilhar versão revisada; detalhes em sala restrita',
    dueDate: null, assignee: null, acceptedBy: null, closedAt: null,
  }));
  const capabilities = narrative.stories.map(story => ({
    id: story.id, group: story.group, title: story.title, summary: story.summary, value: story.value, limit: story.limit,
    evidence: [story.id], refs: story.refs, integratedReferences: story.refs.filter(id => prs.get(id)?.integrated).length,
    openReferences: story.refs.filter(id => prs.get(id)?.state === 'OPEN').length,
    lens: ({ credito: ['DD-003', 'DD-004', 'DD-058'], banking: ['DD-003', 'DD-011', 'DD-056'], decision: ['DD-024', 'DD-002', 'DD-058'], ia: ['DD-021', 'DD-022', 'DD-023'], wpp: ['DD-007', 'DD-057', 'DD-028'], infra: ['DD-026', 'DD-027', 'DD-030'], seguranca: ['DD-011', 'DD-012', 'DD-016'], ecossistema: ['DD-002', 'DD-032', 'DD-041'] })[story.group],
    status: 'Capacidade descrita no corte; maturidade operacional por ambiente a confirmar',
  }));
  return {
    version: 'diligencia-2026-10-21-v2', edition: '2026-10-21', technicalCutoff: '2026-10-20',
    purpose: ['Avaliação para investimento ou aquisição', 'Homologação como fornecedor em seção própria'],
    audience: 'Avaliadores autorizados; referência a consultorias não indica vínculo, endosso ou homologação',
    evaluation: 'Preparação documental e avaliação inicial apoiada no acervo; não é auditoria independente nem parecer jurídico ou financeiro',
    methodology: 'Revisão do corpus congelado, leitura de 14 documentos no snapshot e conexão de achados, pedidos, riscos e controles. Sem reexecução de smokes de produto ou inspeção integral de produção nesta etapa.',
    accessModel: 'A classificação de conteúdo é orientação de compartilhamento. O site mantém senha comum e não implementa permissões por documento, trilha de acesso individual ou gestão de NDA.',
    ownerModel: 'Papéis, prioridades, critérios e plano de integração são propostas. Pessoas, prazos, materialidade e decisões dependem de aceite das partes.',
    snapshot: data.repositories.map(({ key, repo, sha, collectedAt }) => ({ key, repo, sha, collectedAt })),
    corpus: data.summary, baseline: documentEvidence.baseline, domains, evidenceStates, priorities,
    findings: reviewedFindings, requests, risks, vendorControls, vendorGroups, capabilities, groups: narrative.groups.map(({ id, title }) => ({ id, title })),
    sources, methodologySources, transitionPlan,
    executive: {
      ...executiveAssessment,
      assessmentScope: 'Síntese editorial das fontes do corte; fatos documentados, provas pendentes e documentos não fornecidos têm classificações distintas.',
      actions: executiveAssessment.actions.map(item => ({
        ...item,
        risks: [...new Set([...item.risks, ...executiveAssessment.riskAssessments.filter(risk => risk.actions.includes(item.id)).map(risk => risk.id)])],
        status: 'Ação proposta; execução e responsável ainda não confirmados', assignee: null, dueDate: null, completedAt: null,
      })),
    },
    counts: { domains: domains.length, findings: findings.length, requests: requests.length, risks: risks.length, vendorControls: vendorControls.length, capabilities: capabilities.length, sources: sources.length, documentsRead: documentEvidence.documents.length, strengths: executiveAssessment.strengths.length, weaknesses: executiveAssessment.weaknesses.length, actions: executiveAssessment.actions.length },
  };
}

export const requestColumns = [['id', 'Pedido'], ['finding', 'Questão'], ['domain', 'Domínio'], ['title', 'Título'], ['priority', 'Prioridade proposta'], ['owner', 'Função sugerida'], ['ownerStatus', 'Designação'], ['status', 'Situação'], ['requested', 'Documento ou prova solicitada'], ['acceptance', 'Critério de encerramento'], ['audience', 'Compartilhamento'], ['dueDate', 'Prazo a acordar']];
export const riskColumns = [['id', 'Risco'], ['title', 'Título'], ['priority', 'Prioridade proposta'], ['status', 'Situação'], ['probability', 'Probabilidade'], ['financialExposure', 'Exposição financeira'], ['findings', 'Questões'], ['decision', 'Decisão afetada'], ['closure', 'Encerramento']];
export const vendorColumns = [['id', 'Controle'], ['group', 'Grupo'], ['title', 'Requisito'], ['status', 'Situação'], ['findings', 'Questões relacionadas'], ['evidenceRequired', 'Evidência requerida'], ['acceptance', 'Critério de aceite']];
export const actionColumns = [['id', 'Ação'], ['title', 'Proposta'], ['when', 'Momento proposto'], ['owner', 'Responsável sugerido'], ['status', 'Situação'], ['work', 'O que fazer'], ['deliverable', 'Entrega'], ['acceptance', 'Como verificar conclusão'], ['questions', 'Questões relacionadas'], ['risks', 'Riscos relacionados'], ['assignee', 'Pessoa a confirmar'], ['dueDate', 'Prazo a acordar']];
