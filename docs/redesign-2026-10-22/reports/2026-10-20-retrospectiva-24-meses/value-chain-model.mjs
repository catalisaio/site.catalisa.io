const stages = [
  {
    id: 'originacao', color: 'var(--brand-300)', eyebrow: 'Do interesse à proposta',
    headline: 'Uma oferta encontra<br><em>o seu caminho.</em>',
    story: 'A conversa, a simulação, o parceiro e o banco passam a alimentar a mesma base operacional. O canal muda; a proposta continua ligada ao produto e às suas regras.',
    input: 'Interesse de um cliente, relacionamento ou oportunidade de um parceiro.',
    work: 'Apresentar a oferta, simular condições e identificar cliente, parceiro e produto.',
    output: 'Uma proposta com origem e contexto para seguir à análise.',
    control: 'Consistência entre canais', reason: 'A mesma oferta precisa conservar suas regras no formulário, na mesa, no banco e na conversa com IA.',
    handoff: 'A próxima etapa precisa conhecer a identidade e a qualidade do lastro, além da intenção de contratar.',
    layers: [
      { repo: 'wpp', title: 'Relacionamento e experiência', text: 'CRM, WhatsApp, simulador e portal do parceiro dão entrada à operação.', modules: ['leads', 'whatsapp', 'credit-catalog', 'credit-desk'] },
      { repo: 'bb', title: 'Serviços que se reaproveitam', text: 'Canal WhatsApp, catálogo bancário e cálculo compartilhado compõem a distribuição.', modules: ['wpp', 'wpp-business', 'banking-product-portfolio', 'calculations-engine'] },
    ],
  },
  {
    id: 'evidencias', color: 'var(--accent)', eyebrow: 'Da declaração ao dado verificável',
    headline: 'Antes de decidir,<br><em>saber de onde veio.</em>',
    story: 'Identidade, representação e lastro deixam de ser campos soltos. A plataforma conserva origem e contexto, trata casos que exigem revisão e acrescenta as particularidades de cada garantia.',
    input: 'Proposta, identificação do cliente e informações disponíveis sobre o lastro.',
    work: 'Organizar onboarding, documentos, biometria, representação e evidências específicas da garantia.',
    output: 'Um dossiê para análise, com origem das informações e pendências identificáveis.',
    control: 'Origem e autorização do dado', reason: 'Uma informação declarada, uma evidência confirmada e uma revisão humana têm papéis diferentes na análise.',
    handoff: 'A decisão passa a receber dados com contexto, em vez de depender de uma coleção de declarações sem origem.',
    layers: [
      { repo: 'wpp', title: 'Dossiê e jornada do produto', text: 'Identidade, fontes de repasse e mesa conectam evidências à operação de crédito.', modules: ['credit-identity', 'service-attestations', 'people-companies', 'credit-desk'] },
      { repo: 'bb', title: 'Identidade e lastro reutilizáveis', text: 'Pessoa, empresa, biometria e atestado de serviço fornecem capacidades para vários produtos.', modules: ['people', 'companies', 'biometrics', 'service-attestations'] },
    ],
  },
  {
    id: 'decisao', color: 'var(--brand-400)', eyebrow: 'Dos dados à escolha explicável',
    headline: 'A decisão precisa<br><em>de uma explicação.</em>',
    story: 'Políticas, limites, versões e fontes se encontram na decisão. Quando a automação precisa de julgamento humano, a Mesa oferece contexto, atribuição e governança para a revisão.',
    input: 'Dossiê, produto, condições pretendidas e evidências disponíveis.',
    work: 'Avaliar política e exposição, simular alterações e organizar exceções e revisão humana.',
    output: 'Uma decisão vinculada à política, às condições e à responsabilidade de quem revisou.',
    control: 'Regra e exceção com responsabilidade', reason: 'Flexibilidade comercial exige limites explícitos; revisão humana precisa conservar a origem da decisão.',
    handoff: 'As condições que avançam precisam se tornar o instrumento correto e a versão contratual que será aceita.',
    layers: [
      { repo: 'wpp', title: 'Operação da decisão', text: 'Mesa, catálogo e configuração de política aproximam a decisão de quem opera o crédito.', modules: ['decision-mesa', 'decision-mesa-verdicts', 'credit-catalog', 'credit-desk'] },
      { repo: 'bb', title: 'Motor, esteira e revisão', text: 'Decision avalia e orquestra; a Mesa genérica sustenta o trabalho humano em diferentes domínios.', modules: ['decision-engine', 'decision-platform', 'mesa', 'calculations-engine'] },
    ],
  },
  {
    id: 'formalizacao', color: 'var(--brand-200)', eyebrow: 'Da aprovação à evidência contratual',
    headline: 'O documento passa<br><em>a fazer parte da operação.</em>',
    story: 'Instrumento, proposta e aceite passam a ter uma relação operacional. Assinar a versão adequada do termo deixa de ser um anexo separado e passa a condicionar o avanço do crédito.',
    input: 'Condições aprovadas, instrumento declarado pelo produto e partes identificadas.',
    work: 'Preparar o documento, relacionar contratos e aditivos e registrar a assinatura exigida.',
    output: 'Evidência contratual associada à operação e às condições que serão executadas.',
    control: 'Aceite do termo vigente', reason: 'Aprovar uma proposta e aceitar o contrato são eventos diferentes. A execução precisa respeitar essa relação.',
    handoff: 'O dinheiro só deve seguir pelo caminho permitido pelo estado da operação e pelas autorizações exigidas.',
    layers: [
      { repo: 'wpp', title: 'Contrato dentro do ciclo do crédito', text: 'Workflows e mesa relacionam documento, instrumento, aceite e estado da operação.', modules: ['documents', 'workflow-templates', 'credit-desk'] },
      { repo: 'bb', title: 'Documento e assinatura como peças', text: 'Template e e-signature fornecem renderização e assinatura sem duplicar essa capacidade em cada vertical.', modules: ['document-template', 'e-signature'] },
    ],
  },
  {
    id: 'dinheiro', color: 'var(--accent)', eyebrow: 'Da autorização ao desfecho financeiro',
    headline: 'Uma tentativa de Pix<br><em>não é uma liquidação.</em>',
    story: 'Saldo disponível, reservas, assinatura, consentimento e desfecho passam a ter estados próprios. Falha de conexão e resposta ambígua precisam ser tratadas sem transformar retry em pagamento duplicado.',
    input: 'Operação formalizada e autorizações exigidas pela conta e pelo produto.',
    work: 'Conferir saldo e compromissos, autorizar a movimentação e acompanhar o desfecho com idempotência.',
    output: 'Resultado financeiro reconhecido pelo estado real, ligado à operação e à sua trilha.',
    control: 'Verdade financeira sob concorrência', reason: 'Um identificador de transferência não comprova pagamento. Valores comprometidos e saídas em voo precisam participar da disponibilidade.',
    handoff: 'A liquidação e os recebimentos precisam atualizar obrigações, exposição e acompanhamento da carteira.',
    layers: [
      { repo: 'wpp', title: 'Crédito e experiência bancária', text: 'A operação relaciona desembolso, recebíveis e acompanhamento; o aplicativo trata autorização e desfecho.', modules: ['credit-desk', 'workflow-templates'] },
      { repo: 'bb', title: 'Fronteira do dinheiro', text: 'Banking e BaaS sustentam autorização, saldo, bloqueios, transferências e consentimento sobre recebimentos.', modules: ['banking', 'baas', 'payments'] },
    ],
  },
  {
    id: 'continuidade', color: 'var(--brand-300)', eyebrow: 'Do desembolso ao ciclo de vida',
    headline: 'O produto continua<br><em>depois de conceder.</em>',
    story: 'Carteira, concentração, provisão, cobrança e renegociação ampliam a operação para além da proposta individual. O cliente recebe continuidade e a equipe passa a acompanhar o conjunto.',
    input: 'Operações, parcelas, recebimentos e compromissos após a concessão.',
    work: 'Acompanhar exposição e risco, organizar cobrança e renegociação e preparar informações para conferência.',
    output: 'Carteira acompanhável, obrigações atualizadas e contexto para a próxima ação.',
    control: 'Continuidade com rastreabilidade', reason: 'Baixa de obrigação, acompanhamento de risco e mudança no acordo precisam preservar relação com a operação original.',
    handoff: 'O relacionamento e o histórico passam a sustentar novos contatos e novas oportunidades, fechando o ciclo.',
    layers: [
      { repo: 'wpp', title: 'Carteira e relacionamento', text: 'Mesa, portfolio e workflows conectam exposição, parcelas, portal e rotinas de acompanhamento.', modules: ['credit-desk', 'portfolio', 'workflows'] },
      { repo: 'bb', title: 'Cobrança, dados e comunicação', text: 'Collections, Data Store e canais de comunicação compõem o acompanhamento de cada produto.', modules: ['collections', 'data-store', 'wpp-business'] },
    ],
  },
];

export function buildValueChain(dashboard) {
  const stories = new Map(dashboard.stories.map(story => [story.id, story]));
  const prs = new Map(dashboard.prs.map(pr => [pr.id, pr]));
  const chapters = stages.map((stage, index) => {
    const chain = dashboard.chains[index];
    const capabilities = chain.stories.map(id => stories.get(id));
    const refs = [...new Set(capabilities.flatMap(story => story.refs))];
    return { ...stage, number: String(index + 1).padStart(2, '0'), label: chain.label, value: chain.value, stories: capabilities, refs, integrated: refs.filter(id => prs.get(id).integrated).length, repoCounts: Object.fromEntries(['wpp', 'bb', 'developy'].map(repo => [repo, refs.filter(id => prs.get(id).repo === repo).length])), layers: stage.layers.map(layer => ({ ...layer, modules: layer.modules.map(name => { const module = dashboard.modules.find(item => item.repo === layer.repo && item.name === name); if (!module) throw new Error(`Módulo ausente: ${layer.repo}/${name}`); return module; }) })) };
  });
  const backbone = [
    { label: 'Infraestrutura que conecta', title: 'Publicar, descobrir e manter o caminho.', text: 'Launch, DNS, certificados, malha direta e afinidade de stream sustentam o acesso aos produtos e a comunicação entre serviços.', stories: ['E081', 'E086', 'E087', 'E088'], href: 'developy.html' },
    { label: 'Identidade e governança', title: 'Quem pode fazer o quê, com qual prova.', text: 'Permissões, proteção de segredos e integridade da trilha atravessam as etapas e também precisam valer fora da interface.', stories: ['E094', 'E096', 'E098'], href: 'relatorio-completo.html#seguranca' },
    { label: 'IA sobre o domínio', title: 'O contexto encontra as ferramentas.', text: 'AI Core, conhecimento com propriedade e ferramentas da mesa conectam a conversa ao trabalho pelas regras do produto.', stories: ['E055', 'E061', 'E071'], href: 'relatorio-completo.html#ia' },
    { label: 'Composição e execução', title: 'A próxima vertical reaproveita a base.', text: 'Workflows, filas e pacotes instaláveis permitem compor capacidades comuns e conservar as particularidades de cada produto.', stories: ['E076', 'E077', 'E102'], href: 'relatorio-completo.html#ecossistema' },
  ].map(item => ({ ...item, stories: item.stories.map(id => stories.get(id)) }));
  return { chapters, backbone, refs: [...new Set(chapters.flatMap(stage => stage.refs))], storyCount: new Set(chapters.flatMap(stage => stage.stories.map(story => story.id))).size, cutoff: dashboard.cutoff, prs: dashboard.prs };
}
