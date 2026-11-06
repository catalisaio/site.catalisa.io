export const phases = [
  { id: 'fundacao', number: '01', title: 'O canal vira plataforma', short: 'Fundação', start: '2025-11', end: '2026-02', period: 'NOV 2025 — FEV 2026', summary: 'Mensageria, CRM, workflows visuais e identidade criam a base para os produtos que viriam depois.' },
  { id: 'composicao', number: '02', title: 'As peças aprendem a trabalhar juntas', short: 'Composição', start: '2026-03', end: '2026-06', period: 'MAR — JUN 2026', summary: 'WhatsApp sai do core. AI Core, orquestração e infraestrutura tornam capacidades reutilizáveis.' },
  { id: 'atendimento', number: '03', title: 'Conversa começa a virar trabalho', short: 'Copiloto', start: '2026-07', end: '2026-07', period: 'JUL 2026', summary: 'Dados, vídeo, transcrição e copiloto conectam o atendimento à execução.' },
  { id: 'conhecimento', number: '04', title: 'Contexto próprio, fronteiras mais fortes', short: 'Conhecimento', start: '2026-08', end: '2026-08', period: 'AGO 2026', summary: 'RAG, isolamento, revisão de segurança e recuperação operacional preparam uma base mais exigente.' },
  { id: 'credito', number: '05', title: 'Nasce uma máquina de crédito', short: 'Crédito', start: '2026-09', end: '2026-09', period: 'SET 2026', summary: 'Produtos, lastros e instrumentos passam a compartilhar a mesma operação. Banking e Decision ganham forma de produto.' },
  { id: 'operacao', number: '06', title: 'Da decisão ao dinheiro e à evidência', short: 'Operação', start: '2026-10', end: '2026-10', period: '01 — 19 OUT 2026', until: '2026-10-19', summary: 'Mesa, consentimento, assinatura, lastro confirmado e travas unem a jornada financeira.' },
  { id: 'hoje', number: '07', title: 'Configurar e operar fica mais acessível', short: 'CRM e IA', start: '2026-10', end: '2026-10', period: '20 OUT 2026', from: '2026-10-20', summary: 'O CRM ganha preparação guiada e aprovação. O AI Core é exercido no caminho real de API e navegador.' },
];

export const topics = [
  { id: 'credito', label: 'Crédito', description: 'Da originação à carteira', icon: 'credit', categories: ['credito', 'garantias', 'carteira', 'formalizacao', 'cobranca'], color: 'var(--brand-500)' },
  { id: 'banking', label: 'Banco digital', description: 'App, dinheiro e consentimento', icon: 'bank', categories: ['banking'], color: 'var(--brand-700)' },
  { id: 'decision', label: 'Decision', description: 'Política, decisão e Mesa', icon: 'decision', categories: ['decision'], color: 'var(--accent)' },
  { id: 'ia', label: 'Inteligência artificial', description: 'AI Core, RAG e copiloto', icon: 'spark', categories: ['ai_core', 'assistant', 'rag', 'copiloto'], color: 'var(--brand-400)' },
  { id: 'wpp', label: 'WhatsApp e CRM', description: 'Relacionamento e automação', icon: 'chat', categories: ['wpp', 'workflow', 'crm'], color: 'var(--ink-2)' },
  { id: 'infra', label: 'HA e infraestrutura', description: 'Publicar, escalar e recuperar', icon: 'layers', categories: ['infra', 'ha', 'deploy', 'observabilidade'], color: 'var(--brand-800)' },
  { id: 'seguranca', label: 'Segurança', description: 'Identidade, fronteiras e trilha', icon: 'shield', categories: ['seguranca', 'identidade'], color: 'var(--brand-600)' },
  { id: 'ecossistema', label: 'Produtos e distribuição', description: 'Pacotes, integrações e experiência', icon: 'grid', categories: ['monetizacao', 'integracoes', 'ux', 'verticais'], color: 'var(--ink)' },
];

// Each milestone is anchored to one actual PR date, rather than the date of
// an unrelated prerequisite cited in the longer story.
export const milestones = [
  { story: 'E073', anchor: 'wpp#2', title: 'O ponto de partida era a conversa', before: 'Mensagens e callbacks isolados', after: 'Um canal com eventos para automação' },
  { story: 'E076', anchor: 'wpp#55', title: 'Automações passam a ser desenhadas', before: 'Cada fluxo exige integração própria', after: 'Canvas, ações e dependências explícitas' },
  { story: 'E094', anchor: 'wpp#115', title: 'Uma identidade para toda a plataforma', before: 'Papéis e login em diferentes camadas', after: 'IAM como fonte de verdade' },
  { story: 'E055', anchor: 'wpp#127', title: 'A IA ganha um núcleo compartilhado', before: 'Integrações de modelo por funcionalidade', after: 'Providers, credenciais e ferramentas comuns' },
  { story: 'E073', anchor: 'wpp#138', title: 'WhatsApp vira uma peça reutilizável', before: 'Canal acoplado ao core da aplicação', after: 'Building blocks consumidos pelo CRM' },
  { story: 'E058', anchor: 'wpp#266', title: 'O assistente aprende a compor trabalho', before: 'Ferramentas chamadas sem validar o conjunto', after: 'Especificação, preview e validação semântica' },
  { story: 'E081', anchor: 'developy#100', title: 'A infraestrutura passa a publicar produtos', before: 'Provisionamento e entrega artesanais', after: 'Launch, serviços e ciclo de implantação' },
  { story: 'E065', anchor: 'wpp#390', title: 'A IA pode consultar o dado vivo', before: 'Informação copiada para o contexto', after: 'Conectores de banco com ferramentas de leitura' },
  { story: 'E068', anchor: 'wpp#508', title: 'O copiloto entra no atendimento', before: 'Ajuda limitada ao histórico do chat', after: 'Sugestões durante a conversa em vídeo' },
  { story: 'E078', anchor: 'wpp#592', title: 'O CRM reflete o processo de cada conta', before: 'Um processo rígido para todos', after: 'Tipos, campos e funis próprios por tenant' },
  { story: 'E083', anchor: 'wpp#610', title: 'Recuperação passa a atravessar nós físicos', before: 'Banco e proteção no mesmo domínio de falha', after: 'Standby off-node e failover assistido' },
  { story: 'E095', anchor: 'wpp#681', title: 'A fronteira entre clientes é endurecida', before: 'Falhas de autorização confirmadas', after: 'Escopo no servidor, testes e remediação' },
  { story: 'E062', anchor: 'wpp#789', title: 'O conhecimento próprio fica pesquisável', before: 'Documento inteiro precisa caber no prompt', after: 'Chunks, embeddings e recuperação em pgvector' },
  { story: 'E064', anchor: 'wpp#820', title: 'Contexto protege além do tenant', before: 'Agente compartilhado pode misturar contextos', after: 'Conhecimento por escritório, cliente e assunto' },
  { story: 'E002', anchor: 'wpp#865', title: 'A primeira esteira de crédito se instala', before: 'Recebíveis e análises desconectados', after: 'Proposta, portal, política e mesa de antecipação' },
  { story: 'E001', anchor: 'wpp#1217', title: 'Um núcleo passa a servir vários créditos', before: 'Cada lastro carrega o ciclo inteiro', after: 'Crédito-base com produtos compostos em camadas' },
  { story: 'E009', anchor: 'wpp#1258', title: 'Garantias ganham ciclo de vida', before: 'Garantia tratada como um dado anexo', after: 'Gravames, margem, prazos e comprovação' },
  { story: 'E071', anchor: 'wpp#1440', title: 'A IA começa a operar a mesa', before: 'Consultar e operar exige várias telas', after: 'Ferramentas pelas mesmas regras do domínio' },
  { story: 'E021', anchor: 'wpp#1483', title: 'O produto acompanha a carteira', before: 'A concessão concentra a operação', after: 'Provisão, competência e histórico pós-crédito' },
  { story: 'E032', anchor: 'wpp#1623', title: 'O banco ganha um aplicativo próprio', before: 'Serviços bancários sem um canal comum', after: 'App, núcleo compartilhado e segurança nativa' },
  { story: 'E048', anchor: 'wpp#1631', title: 'Decision se torna um produto', before: 'Motor de regras usado internamente', after: 'Site, console e caminho de autosserviço' },
  { story: 'E098', anchor: 'bb#429', title: 'Auditoria pode demonstrar integridade', before: 'Linhas de log podem mudar sem detecção', after: 'Corrente de hash e verificação por organização' },
  { story: 'E050', anchor: 'wpp#1834', title: 'A revisão humana vira capacidade comum', before: 'Uma mesa diferente para cada domínio', after: 'Casos, filas, alçada e quatro olhos' },
  { story: 'E015', anchor: 'wpp#1881', title: 'Uma resposta do banco não significa pago', before: 'transferId podia marcar desembolso sem Pix', after: 'Só liquidação confirma; conferir nunca paga' },
  { story: 'E027', anchor: 'bb#629', title: 'O recebível se conecta ao pagamento', before: 'Lastro e liquidação seguem caminhos separados', after: 'Trava consentida sobre recebimentos futuros' },
  { story: 'E026', anchor: 'wpp#1969', title: 'O lastro passa a vir da fonte', before: 'O pedido depende da declaração do cedente', after: 'Repasses confirmados, hash e versão da evidência' },
  { story: 'E056', anchor: 'wpp#2005', title: 'Modelos exercidos no produto real', before: 'Disponibilidade apenas declarada no catálogo', after: 'Ferramentas, tokens e API/UI nos dois ambientes' },
  { story: 'E072', anchor: 'wpp#2007', title: 'Configurar o atendimento fica guiado', before: 'O usuário precisa montar agentes e workflows', after: 'Conversar, revisar e aprovar recursos inativos' },
  { story: 'E080', anchor: 'developy#1', title: 'A operação própria ganha um plano de controle', before: 'Recursos de infraestrutura administrados por caminhos separados', after: 'Compute, rede, identidade e operação no mesmo produto' },
  { story: 'E084', anchor: 'developy#73', title: 'As dependências dos produtos passam a ser provisionáveis', before: 'Cada aplicação precisa preparar cache, credencial e rede', after: 'Serviços de dados com contratos e ciclo de vida próprios' },
  { story: 'E082', anchor: 'developy#264', title: 'Escalar passa a considerar o nó que pode falhar', before: 'Duas réplicas podem compartilhar o mesmo hipervisor', after: 'Espalhamento por nó e rotas com backends saudáveis' },
  { story: 'E087', anchor: 'developy#277', title: 'Os building blocks ganham endereço na malha', before: 'Nomes do overlay antigo não resolvem no runtime nativo', after: 'DNS interno por serviço e organização' },
  { story: 'E089', anchor: 'developy#338', title: 'A falha de um building block começa a virar incidente', before: 'A sonda detecta a queda, mas o efeito fica no log', after: 'Launch alimenta abertura e resolução no Signal' },
  { story: 'E088', anchor: 'developy#347', title: 'O stream da IA encontra a réplica certa', before: 'O chat inicia em uma API e o SSE chega a outra', after: 'Afinidade preservada no Launch e rollout documentado' },
];

export const benchmarks = [
  { title: 'Knight Lab · TimelineJS', url: 'https://knightlab.northwestern.edu/2026/08/13/timelinejs-reimagined/', idea: 'Marcos narrativos e uma visão temporal para orientar a leitura.', applied: 'Capítulos, sequência de marcos e modo de apresentação.' },
  { title: 'Nielsen Norman Group · filtros compreensíveis', url: 'https://www.nngroup.com/articles/filter-categories-values/', idea: 'Critérios previsíveis, priorizados e explicados em linguagem do usuário.', applied: 'Temas primeiro, recortes prontos, contagem e explicação do resultado.' },
  { title: 'Linear · filtros e views', url: 'https://linear.app/docs/filters', idea: 'Filtros combinados com resultado imediato e estado preservado na URL.', applied: 'Chips removíveis, filtros no endereço e voltar ao mesmo recorte.' },
  { title: 'Linear · changelog', url: 'https://linear.app/changelog', idea: 'Uma narrativa de evolução organizada por datas e mudanças de produto.', applied: 'Valor visível no cartão; mensagens e arquivos apenas ao abrir a evidência.' },
];
