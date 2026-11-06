import fs from 'node:fs';

export const identityVersion = 'catalisa-transitoria-2026-10';

export function identityStyles(includeReportSkin = true) {
  const base = fs.readFileSync(new URL('./identidade-transitoria.css', import.meta.url), 'utf8');
  const skin = includeReportSkin ? fs.readFileSync(new URL('./report-identity.css', import.meta.url), 'utf8') : '';
  const gateway = fs.readFileSync(new URL('./diligencia-gateway.css', import.meta.url), 'utf8');
  return `${base}\n${skin}\n${gateway}`;
}

export function brandArtwork() {
  return fs.readFileSync(new URL('./catalisa-logo.svg', import.meta.url), 'utf8').replace('<svg ', '<svg class="brand-logo" aria-hidden="true" focusable="false" ');
}

export function diligenceGateway(context = 'geral') {
  const contextLinks = {
    dashboard: ['diligencia-corporativa.html#indicadores', 'Distinguir números técnicos e indicadores financeiros'],
    developy: ['diligencia-tecnica.html#operacao', 'Avaliar continuidade e dependências da infraestrutura'],
    'cadeia-de-valor': ['diligencia-tecnica.html#produto', 'Avaliar produto, consistência e condições de operação'],
    investidores: ['diligencia-corporativa.html', 'Avaliar direitos, contratos, receita e custos'],
    timeline: ['diligencia-evidencias.html#proveniencia', 'Conferir corte, fontes e atualizações necessárias'],
    entrevistas: ['diligencia-corporativa.html#pessoas', 'Avaliar transferência de conhecimento e continuidade'],
  };
  const extra = contextLinks[context];
  return `<section class="diligence-gateway" aria-label="Diligência e homologação"><div><span>ANÁLISES / CONCLUSÕES E ENCAMINHAMENTOS</span><h2>Pontos fortes. Pontos fracos.<br>O que fazer a seguir.</h2><p>Comece pelo sumário: conclusão da análise, seis pontos fortes, três fragilidades identificadas, 16 riscos e oito ações propostas. Provas e documentos pendentes aparecem separados das fragilidades comprovadas.</p></div><nav aria-label="Aprofundar a avaliação"><a href="diligencia.html">Sumário das análises ↗</a><a href="diligencia.html#pontos-fortes">Pontos fortes ↗</a><a href="diligencia.html#pontos-fracos">Pontos fracos e o que falta avaliar ↗</a><a href="diligencia.html#riscos">Riscos e consequências ↗</a><a href="diligencia.html#plano-de-acao">Plano de ação proposto ↗</a><a href="homologacao.html">Homologação de fornecedor ↗</a><a href="diligencia-evidencias.html">Evidências e documentos ↗</a>${extra ? `<a href="${extra[0]}">${extra[1]} ↗</a>` : ''}<a href="diligencia.pdf" download>Sumário e plano em PDF ↓</a></nav></section>`;
}
