export const domains = [
  {
    id: 'credito', title: 'Crédito, do interesse à carteira.', word: 'Crédito',
    intro: 'Um ciclo operacional compartilhado sustenta modalidades, lastros e canais diferentes.',
    points: [
      ['Compor a oferta', 'Crédito-base, catálogo versionado, cálculo financeiro e simulação por formulário ou conversa. Recebíveis, veículos, imóveis, pessoal, consignado, rural e rebanho acrescentam suas particularidades.'],
      ['Controlar a operação', 'Limites e exposição, política por casa/produto/parceiro, negociação com alçada, garantias, prazos, instrumentos, contrato-mestre, aditivos e assinatura condicionam o avanço.'],
      ['Fechar o ciclo', 'Parceiros e comissões, desembolso confirmado por liquidação, parcelas, carteira, concentração, aging, provisão, prévia SCR, cobrança, renegociação e portal do cliente. Lastro confirmado na fonte e trava consentida ligam recebível e pagamento.'],
    ],
    value: 'Novas modalidades reaproveitam a mesma operação e acrescentam regras do seu domínio.',
    scope: 'Rebanho usa contexto de demonstração; prévia SCR e provisão não comprovam homologação regulatória. Integrações dependem dos provedores e da atualização das instalações.',
  },
  {
    id: 'banking', title: 'Dinheiro com estado e autorização.', word: 'Banking',
    intro: 'App, desktop e backoffice encontram uma fachada bancária sobre serviços BaaS.',
    points: [
      ['Conta e acesso', 'Abertura com documento, selfie e revisão; vínculo de aparelho e recuperação; núcleo nativo compartilhado e configuração remota da experiência.'],
      ['Autorizar e movimentar', 'Assinatura pelo aparelho, step-up no servidor, mandatos, quatro olhos e representação empresarial. Saldo considera bloqueios e saídas em voo; Pix trata desfecho desconhecido e retry idempotente.'],
      ['Distribuir e acompanhar', 'Desktop aprovado no celular, console com permissões, conexão entre crédito e banco, conteúdo por capacidade e eventos para acompanhar funis.'],
    ],
    value: 'Serviços financeiros e crédito ganham uma experiência de marca própria com controles comuns.',
    scope: 'Adaptadores não equivalem à homologação de todos os provedores; app implementado não comprova publicação nas lojas. Os ensaios de saldo têm casos parciais registrados.',
  },
  {
    id: 'decision', title: 'Decidir. Explicar. Revisar.', word: 'Decision',
    intro: 'O motor de regras e a orquestração das fontes conservam funções distintas.',
    points: [
      ['Política como produto', 'Editor visual, versões publicadas, DRD, condições e fontes. Simulação histórica e campeão contra desafiante permitem examinar alterações.'],
      ['Responsabilidade humana', 'Mesa genérica com casos, fila, atribuição, alçada, lock otimista, idempotência e quatro olhos. Origem, trace e veredito acompanham a revisão.'],
      ['Distribuição', 'Console SaaS e modo instalado em painel/kit; ambientes, subcontas, cotas, insights por IA e funil por etapa compõem a superfície do produto.'],
    ],
    value: 'A mesma capacidade serve à concessão e à revisão de outros domínios, com explicação preservada.',
    scope: 'Stripe, prova final de alguns caminhos, simulador e reinstalação tinham pendências no corte. Código de cobrança não demonstra receita recorrente.',
  },
  {
    id: 'ia', title: 'O contexto encontra a execução.', word: 'IA aplicada',
    intro: 'Um núcleo compartilhado conecta modelos, conhecimento e ferramentas às regras do produto.',
    points: [
      ['Core e composição', 'Providers e credenciais comuns, execução de ferramentas, skills contextuais, especificação prévia, preview, validação semântica e biblioteca de exemplos aprovados.'],
      ['Conhecimento próprio', 'Owner obrigatório, contexto abaixo do tenant, ingestão de PDF/DOCX/texto, índice pgvector reconstruível, busca ativa e exclusão. Conectores consultam o dado vivo; avaliações verificam referências e contexto.'],
      ['Atendimento que vira trabalho', 'Vídeo, gravação, transcrição, copiloto por perfil e dossiê; reuniões externas por worker. Ferramentas operam a mesa e produzem rascunhos e configurações sujeitos à aprovação.'],
    ],
    value: 'A conversa consulta e executa pelo domínio, com conhecimento e autorização do contexto certo.',
    scope: 'Seis modelos OpenAI/Grok foram exercidos por API e navegador; não é taxa global de confiabilidade. Anthropic e NIM tinham limites próprios; staging do RAG sem índice permanecia bloqueado no seguimento.',
  },
  {
    id: 'wpp', title: 'A conversa vira uma operação.', word: 'WhatsApp + CRM',
    intro: 'O canal sai do core e passa a alimentar processos próprios de cada conta.',
    points: [
      ['Canal reutilizável', 'WhatsApp extraído para building block, canal oficial, comércio e gestão Meta; evolução de sessão, identidade e envio em múltiplos workers.'],
      ['Processo explícito', 'Canvas visual, dependências, eventos, filas, espera e retenção estruturam a automação. O schema registra 222 tipos de ação.'],
      ['Relacionamento recorrente', 'CRM hierárquico, tipos, campos, funis e concessões por conta. Metas, responsáveis, rotinas e carteira de atenção conectam acompanhamento e execução.'],
    ],
    value: 'Relacionamento, atendimento e automação passam a compartilhar contexto e processo.',
    scope: 'O acervo registra correções específicas; não mede uma taxa global de entrega WhatsApp. Política de retenção implementada não significa histórico já acumulado por todo o prazo.',
  },
  {
    id: 'infra', title: 'Uma plataforma para operar a plataforma.', word: 'Developy Cloud',
    intro: 'Publicação, rede, dados e operação evoluem junto dos produtos que dependem deles.',
    points: [
      ['Publicar e conectar', 'Launch com imagem/template nativo, réplicas, domínios, certificados, IPAM e malha direta. Afinidade de SSE relaciona navegador e réplica.'],
      ['Persistir e recuperar', 'Postgres off-node, failover assistido, cache, storage e mensageria gerenciados; estado durável do controle, backups e disciplina de recuperação.'],
      ['Observar e evoluir', 'Saúde por runtime, reconciliação, Pulse/Radar/Signal, builder remoto, publicação determinística, proteção do plano de controle e ensaios de memória, build e latência.'],
    ],
    value: 'As dependências de operação tornam-se capacidades reutilizáveis, com efeito direto na experiência.',
    scope: 'Rolling update foi provado com duas réplicas; standby e backup não demonstram recuperação integral nem SLA da cadeia. Fases seguintes do Signal permaneciam abertas.',
  },
  {
    id: 'seguranca', title: 'A confiança atravessa as camadas.', word: 'Segurança',
    intro: 'Autorização e integridade fazem parte do produto, do serviço e da infraestrutura.',
    points: [
      ['Fronteiras reais', 'IAM como fonte de verdade, isolamento por tenant, acesso por pessoa, guardas de sessão, navegador e endpoints públicos. Auditoria interna tratou falhas confirmadas de autorização e execução.'],
      ['Segredo e evidência', 'Credenciais cifradas e separadas por ambiente; exposição mascarada com revelação restrita; trilha com corrente de hash e verificação de integridade.'],
      ['Identidade e ciclo de vida', 'Biometria com captura, evidência e revisão; pessoa, empresa e representação com origem e validade; minimização, retenção e limites do operador.'],
    ],
    value: 'Os controles deixam de depender apenas da interface ou de instruções dadas a uma pessoa ou agente.',
    scope: 'Auditorias e avaliações são internas. O acervo não comprova certificação independente, ausência de vulnerabilidades ou prova retroativa de registros anteriores.',
  },
  {
    id: 'ecossistema', title: 'A base se transforma em produtos.', word: 'Ecossistema',
    intro: 'Distribuição, experiência e monetização reaproveitam as capacidades já construídas.',
    points: [
      ['Instalar e cobrar', 'Pacotes compõem workflows, agentes e configuração; planos, assinatura e consumo formam um núcleo de monetização reutilizável.'],
      ['Aplicar em verticais', 'Recrutamento, clínica, jurídico, fitness e consultoria usam canais, dados e automação comuns. Conectores aproximam sistemas de trabalho e comércio.'],
      ['Operar e explicar', 'Design system, SDKs, documentação e provas de produto acompanham a engenharia. Simplificação de legado, pesquisa comercial e apresentações também integram o trabalho.'],
    ],
    value: 'Cada novo produto pode partir de uma fundação comum e concentrar esforço nas particularidades da jornada.',
    scope: 'Catálogo, instalação efetiva, MVP, demo e operação comercial são estados diferentes. A remoção do admin antigo ficou em ramo. Propostas e preços não comprovam clientes pagantes.',
  },
];

export const operations = [
  ['originacao', 'Originação', 'Interesse → proposta', 'WhatsApp, formulário, parceiro, app e simulação tradicional ou por IA.', 'Produto, origem e condições coerentes entre canais.'],
  ['evidencias', 'Evidências', 'Declaração → dossiê', 'Pessoa, empresa, representação, biometria, documentos e lastro confirmado na fonte.', 'Origem do dado, autorização e pendências de revisão.'],
  ['decisao', 'Decisão', 'Dossiê → condições', 'Política versionada, cálculo, limites, exposição, Decision e revisão na Mesa.', 'Alçada, exceção e responsabilidade pela decisão.'],
  ['formalizacao', 'Formalização', 'Aprovação → aceite', 'Instrumento, contrato-mestre, aditivo, documento e assinatura vinculada à operação.', 'O aceite do termo vigente condiciona o avanço.'],
  ['dinheiro', 'Dinheiro', 'Autorização → liquidação', 'Saldo gastável, bloqueios, assinatura, Pix idempotente e trava consentida de recebíveis.', 'Uma tentativa ou transferId não equivale a pagamento.'],
  ['continuidade', 'Continuidade', 'Operação → carteira', 'Parcelas, concentração, provisão, prévia SCR, cobrança, renegociação e portal.', 'Cada desfecho conserva a relação com a obrigação original.'],
];

export const infrastructureLinks = [
  ['Stream do Assistant', 'Afinidade no Launch conserva a relação entre chat iniciado e stream SSE.', 'D01'],
  ['Publicação e malha dos BBs', 'Runtime nativo e DNS por serviço/organização conectam réplicas saudáveis.', 'D02'],
  ['Escala da frota', 'Multiplexação SSH reduz conexões; reconferência da instância protege o rollout.', 'D03'],
  ['Segredos de Banking', 'Listagens de ambiente mascaradas; revelação restrita e auditada.', 'D04'],
  ['Persistência no redeploy', 'Volumes declarados e transferência de disco preservam estado no modelo testado.', 'D05'],
  ['Caminho do crédito', 'Correção de DNAT impede que uma regra de rede capture HTTP de um hotsite.', 'D06'],
  ['Incidentes visíveis', 'Estado failed/degraded do inventário abre e resolve incidentes no Signal.', 'D07'],
  ['Distribuição governada', 'Identidade, políticas e capacidades de scanner/build OCI compõem a supply chain.', 'D08'],
  ['Operação própria', 'E-mail administrável, revogação de acesso e histórico durável de auditoria.', 'D09'],
];

export function buildInfographic(dashboard) {
  const groups = domains.map(domain => ({ ...domain, stories: dashboard.stories.filter(story => story.group === domain.id) }));
  const months = [];
  for (let index = 0; index < 12; index++) {
    const date = new Date(Date.UTC(2025, 10 + index, 1));
    const month = date.toISOString().slice(0, 7);
    const counts = Object.fromEntries(dashboard.repositories.map(repo => [repo.key, dashboard.prs.filter(pr => pr.repo === repo.key && pr.integrated && pr.date.startsWith(month)).length]));
    months.push({ month, counts, total: Object.values(counts).reduce((sum, count) => sum + count, 0) });
  }
  return { groups, months, repositories: dashboard.repositories.map(repo => ({ ...repo, prs: dashboard.prs.filter(pr => pr.repo === repo.key).length, integrated: dashboard.prs.filter(pr => pr.repo === repo.key && pr.integrated).length })) };
}
