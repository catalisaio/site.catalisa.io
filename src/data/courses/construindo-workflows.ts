import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

// ─── Module 1: Conceitos de Workflow ─────────────────────────────────────────

const lessonOQueEWorkflow: ContentBlock[] = [
  {
    type: 'heading',
    text: 'O que é um Workflow?',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Um Workflow é uma sequência automatizada de ações que é executada quando um evento específico acontece. É a cola que une todas as partes da Catalisa: conecta eventos do WhatsApp a ações no CRM, aciona agentes IA, envia mensagens e muito mais — tudo sem intervenção manual.',
  },
  {
    type: 'diagram-animated',
    variant: 'flow',
    viewBox: { w: 720, h: 300 },
    nodes: [
      { id: 'trigger', label: 'Trigger\n(Evento que inicia)', icon: 'lightning', color: '#F6AD55', x: 20, y: 120, w: 150, h: 60 },
      { id: 'cond', label: 'Condição\n(Opcional)', icon: 'filter', color: '#FC8181', x: 230, y: 120, w: 130, h: 60 },
      { id: 'action1', label: 'Ação 1\n(Ex: Agente IA)', icon: 'robot', color: '#805AD5', x: 430, y: 60, w: 130, h: 60 },
      { id: 'action2', label: 'Ação 2\n(Ex: Update Lead)', icon: 'edit', color: '#3182CE', x: 430, y: 180, w: 130, h: 60 },
      { id: 'end', label: 'Fim', icon: 'check', color: '#38A169', x: 620, y: 120, w: 80, h: 60 },
    ],
    edges: [
      { from: 'trigger', to: 'cond', label: 'dispara', animated: true },
      { from: 'cond', to: 'action1', label: 'se verdadeiro', animated: true },
      { from: 'cond', to: 'action2', label: 'sempre', animated: true },
      { from: 'action1', to: 'end', animated: true },
      { from: 'action2', to: 'end', animated: true },
    ],
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Componente', highlighted: false },
      { label: 'O que é', highlighted: false },
      { label: 'Exemplo', highlighted: true },
    ],
    rows: [
      {
        feature: 'Trigger',
        values: ['O evento que inicia o workflow', 'MESSAGE_RECEIVED (lead mandou mensagem)'],
      },
      {
        feature: 'Condição',
        values: ['Filtro opcional para decidir se continua', 'Apenas se o lead for tipo CORRETOR'],
      },
      {
        feature: 'Ação',
        values: ['O que acontece quando o workflow roda', 'Enviar mensagem, acionar agente, atualizar campo'],
      },
      {
        feature: 'Dependência',
        values: ['Ordem de execução entre ações', 'Ação 2 só roda após Ação 1 terminar'],
      },
    ],
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'Quantas ações um workflow pode ter?',
        answer: 'Não há limite técnico, mas workflows com mais de 10-15 ações tendem a ser difíceis de manter. Se ficar muito complexo, considere dividir em múltiplos workflows menores que se chamam via RUN_WORKFLOW.',
      },
      {
        question: 'Um workflow pode chamar outro workflow?',
        answer: 'Sim! A ação RUN_WORKFLOW permite criar um "workflow mestre" que orquestra vários sub-workflows. Isso é útil para reutilizar lógicas comuns sem duplicar configurações.',
      },
      {
        question: 'O que acontece se uma ação falhar?',
        answer: 'Por padrão, o workflow para na ação que falhou e registra o erro no log de execução. Você pode configurar retry automático e ações de fallback para erros esperados.',
      },
    ],
  },
  {
    type: 'quiz',
    quizId: 'wf-conceitos-q1',
    variant: 'multiple-choice',
    question: 'Qual componente do workflow define QUANDO ele deve ser executado?',
    options: [
      { label: 'Ação', value: 'action' },
      { label: 'Condição', value: 'condition' },
      { label: 'Trigger', value: 'trigger' },
      { label: 'Dependência', value: 'dependency' },
    ],
    correctAnswer: 'trigger',
    explanation: 'O Trigger é o ponto de partida: o evento que inicia a execução do workflow. Sem trigger, o workflow nunca roda. Com trigger errado, roda quando não deveria.',
    xpBonus: 15,
  },
];

const lessonTriggers: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Tipos de Trigger: Quando seu Workflow Roda',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Escolher o trigger certo é a decisão mais importante ao criar um workflow. Cada trigger representa um momento específico na jornada do lead. Veja todos os triggers disponíveis e seus casos de uso.',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Trigger', highlighted: false },
      { label: 'Quando dispara', highlighted: false },
      { label: 'Caso de uso ideal', highlighted: true },
    ],
    rows: [
      {
        feature: 'MESSAGE_RECEIVED',
        values: ['Lead envia mensagem via WhatsApp', 'Resposta automática, acionamento de agente IA'],
      },
      {
        feature: 'LEAD_CREATED',
        values: ['Novo lead é cadastrado (manual ou importação)', 'Boas-vindas automático, qualificação inicial'],
      },
      {
        feature: 'LEAD_UPDATED',
        values: ['Campo do lead é alterado', 'Notificar equipe quando status muda para "Proposta"'],
      },
      {
        feature: 'WEBHOOK_RECEIVED',
        values: ['Requisição externa chega no endpoint do workflow', 'Integração com site, formulário, CRM externo'],
      },
      {
        feature: 'WORKFLOW_COMPLETED',
        values: ['Outro workflow terminou', 'Encadeamento: Workflow A → dispara Workflow B'],
      },
      {
        feature: 'SCHEDULED (CRON)',
        values: ['Horário pré-definido (ex: toda segunda 9h)', 'Follow-up periódico, relatórios automáticos'],
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Combine Triggers com Condições',
    text: 'MESSAGE_RECEIVED dispara para QUALQUER mensagem de QUALQUER lead. Combine com uma condição "tipo do lead = CORRETOR" para filtrar apenas os que importam. Isso evita processar mensagens irrelevantes.',
  },
  {
    type: 'sandbox',
    variant: 'trigger-config',
    instructions: 'Configure um trigger do tipo MESSAGE_RECEIVED com a condição: o lead deve ser do tipo "CORRETOR" E o campo "status" deve ser diferente de "Inativo". Isso garante que apenas corretores ativos ativam o workflow.',
    validation: {
      type: 'contains',
      expected: {
        trigger: 'MESSAGE_RECEIVED',
        conditions: [
          { field: 'type', operator: 'equals', value: 'CORRETOR' },
          { field: 'status', operator: 'notEquals', value: 'Inativo' },
        ],
      },
    },
    solution: {
      trigger: 'MESSAGE_RECEIVED',
      conditions: [
        { field: 'lead.type', operator: 'equals', value: 'CORRETOR' },
        { field: 'lead.status', operator: 'not_equals', value: 'Inativo' },
      ],
    },
    xpReward: 25,
  },
];

// ─── Module 2: Canvas Visual ─────────────────────────────────────────────────

const lessonInterfaceDoCanvas: ContentBlock[] = [
  {
    type: 'heading',
    text: 'O Canvas Visual de Workflows',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'O Canvas é a interface drag-and-drop onde você cria workflows visualmente. Cada ação é um nó, as conexões mostram o fluxo de execução e as dependências entre ações.',
  },
  {
    type: 'mockui',
    variant: 'workflow-canvas',
    interactionSteps: [
      {
        targetId: 'canvas-sidebar-actions',
        instruction: 'No painel esquerdo estão todas as ações disponíveis. Arraste uma para o canvas.',
        position: 'right',
      },
      {
        targetId: 'canvas-node-trigger',
        instruction: 'Este é o nó de Trigger. Todo workflow começa aqui.',
        position: 'bottom',
      },
      {
        targetId: 'canvas-zoom-controls',
        instruction: 'Use os controles de zoom (+/-) ou scroll do mouse para ajustar a visualização.',
        position: 'top',
      },
      {
        targetId: 'canvas-minimap',
        instruction: 'O minimapa no canto inferior direito mostra a visão geral do workflow.',
        position: 'top',
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Navegação no Canvas',
        description: 'Clique e arraste o fundo para mover. Scroll para zoom. Clique em um nó para selecioná-lo e ver suas propriedades no painel direito.',
      },
      {
        title: 'Adicionando Ações',
        description: 'Arraste uma ação do painel esquerdo para o canvas, ou clique duplo em qualquer espaço vazio para abrir o seletor de ações.',
      },
      {
        title: 'Conectando Nós',
        description: 'Passe o mouse sobre um nó e arraste a bolinha que aparece na borda até outro nó para criar uma conexão de dependência.',
      },
      {
        title: 'Configurando uma Ação',
        description: 'Clique em um nó para abrir o painel de configuração à direita. Cada tipo de ação tem seus próprios campos de configuração.',
      },
      {
        title: 'Salvando e Ativando',
        description: 'Clique em "Salvar" para persistir as alterações. Use o toggle no topo para ativar/desativar o workflow sem deletá-lo.',
      },
    ],
  },
  {
    type: 'interactive-demo',
    title: 'Praticando no Canvas',
    scenarios: [
      {
        id: 'add-node',
        label: 'Adicionar Primeiro Nó',
        description: 'Aprenda a adicionar e conectar sua primeira ação no canvas.',
        steps: [
          {
            instruction: 'Arraste a ação "SEND_MESSAGE" do painel lateral para o canvas.',
            action: 'drag-node',
            feedback: 'Nó SEND_MESSAGE criado no canvas. Clique nele para configurar.',
          },
          {
            instruction: 'Conecte o Trigger ao nó SEND_MESSAGE arrastando da borda do trigger.',
            action: 'connect-nodes',
            feedback: 'Conexão criada! O workflow vai enviar mensagem quando o trigger disparar.',
          },
          {
            instruction: 'Clique no nó SEND_MESSAGE e configure a mensagem no painel direito.',
            action: 'configure-node',
            feedback: 'Excelente! Seu primeiro workflow está configurado.',
          },
        ],
      },
      {
        id: 'parallel-actions',
        label: 'Ações Paralelas',
        description: 'Adicione duas ações que executam simultaneamente.',
        steps: [
          {
            instruction: 'Adicione um nó UPDATE_LEAD e conecte ao trigger (sem depender de SEND_MESSAGE).',
            action: 'add-parallel-node',
            feedback: 'Perfeito! As duas ações partem do trigger e executam em paralelo.',
          },
          {
            instruction: 'Observe que ambos os nós têm a mesma cor de borda (sem dependência entre si).',
            action: 'observe-parallel',
            feedback: 'Ações em paralelo reduzem o tempo total de execução do workflow.',
          },
        ],
      },
    ],
  },
];

const lessonConectandoNos: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Dependências e Execução Paralela',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'O sistema de dependências da Catalisa segue o modelo DAG (Directed Acyclic Graph). Isso significa que você pode ter ações que rodam em paralelo E ações que esperam outras terminarem — tudo de forma visual e intuitiva.',
  },
  {
    type: 'diagram-animated',
    variant: 'flow',
    viewBox: { w: 700, h: 400 },
    nodes: [
      { id: 'trigger', label: 'Trigger\nMESSAGE_RECEIVED', color: '#F6AD55', x: 20, y: 170, w: 160, h: 60 },
      { id: 'agent', label: 'RUN_AGENT\n"Atendimento"', color: '#805AD5', x: 250, y: 80, w: 150, h: 60 },
      { id: 'update', label: 'UPDATE_LEAD\nstatus = Engajado', color: '#3182CE', x: 250, y: 260, w: 150, h: 60 },
      { id: 'notify', label: 'WEB_REQUEST\nNotificar CRM', color: '#E53E3E', x: 480, y: 170, w: 150, h: 60 },
      { id: 'followup', label: 'DELAY + SEND_MSG\nFollow-up 24h', color: '#38A169', x: 480, y: 310, w: 150, h: 60 },
    ],
    edges: [
      { from: 'trigger', to: 'agent', label: 'paralelo', animated: true },
      { from: 'trigger', to: 'update', label: 'paralelo', animated: true },
      { from: 'agent', to: 'notify', label: 'aguarda agente', animated: true },
      { from: 'update', to: 'followup', label: 'aguarda update', animated: true },
    ],
  },
  {
    type: 'paragraph',
    text: 'No diagrama acima: RUN_AGENT e UPDATE_LEAD rodam em paralelo (ambos dependem apenas do trigger). Mas WEB_REQUEST só começa após o agente terminar, e o FOLLOW-UP só começa após o update do lead.',
  },
  {
    type: 'callout',
    variant: 'important',
    title: 'Sem Ciclos!',
    text: 'O sistema não permite dependências circulares (A depende de B que depende de A). Se você tentar criar um ciclo, o canvas mostrará um erro em vermelho. Redesenhe a lógica para eliminar o ciclo.',
  },
  {
    type: 'quiz',
    quizId: 'wf-dag-q1',
    variant: 'multiple-choice',
    question: 'Você tem 3 ações: A (buscar dados), B (enviar mensagem), C (atualizar lead). B e C precisam dos dados de A. Como configurar?',
    options: [
      { label: 'A → B → C (sequencial)', value: 'sequential' },
      { label: 'A → B e A → C (B e C em paralelo, ambos dependendo de A)', value: 'parallel-after-a' },
      { label: 'Trigger → A e B e C (tudo em paralelo)', value: 'all-parallel' },
      { label: 'B → A → C (A no meio)', value: 'wrong-order' },
    ],
    correctAnswer: 'parallel-after-a',
    explanation: 'A deve rodar primeiro (buscar dados). Depois, B e C podem rodar em PARALELO porque ambos apenas dependem de A, mas não dependem um do outro. Isso é mais eficiente que A→B→C sequencial.',
    xpBonus: 20,
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Variáveis Entre Ações',
    text: 'A saída de uma ação pode ser usada em ações posteriores com a sintaxe {{actions.nomeDaAcao.output.campo}}. Ex: Se RUN_AGENT retorna um resumo, a ação seguinte pode usar {{actions.atendimento.output.summary}}.',
  },
];

const lessonVariaveis: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Interpolação de Variáveis',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Uma das funcionalidades mais poderosas dos workflows é a interpolação de variáveis com a sintaxe {{variavel}}. Isso permite que ações usem dados dinâmicos do trigger, do lead e de ações anteriores.',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Sintaxe', highlighted: true },
      { label: 'O que retorna', highlighted: false },
      { label: 'Exemplo de uso', highlighted: false },
    ],
    rows: [
      {
        feature: '{{trigger.payload.phone}}',
        values: ['Telefone do lead que disparou', 'Enviar mensagem para quem acabou de contatar'],
      },
      {
        feature: '{{trigger.payload.message}}',
        values: ['Conteúdo da mensagem recebida', 'Passar a mensagem para o agente processar'],
      },
      {
        feature: '{{lead.name}}',
        values: ['Nome do lead associado', 'Personalizar "Olá, {{lead.name}}!"'],
      },
      {
        feature: '{{lead.customFields.creci}}',
        values: ['Campo personalizado do lead', 'Verificar CRECI antes de enviar proposta'],
      },
      {
        feature: '{{actions.meuAgente.output.summary}}',
        values: ['Saída de uma ação anterior', 'Usar resumo do agente para atualizar o CRM'],
      },
      {
        feature: '{{json.minhaVar}}',
        values: ['Variável do payload JSON do trigger', 'Dados vindos de webhook externo'],
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'variable-interpolation',
    instructions: 'Complete a mensagem abaixo usando interpolação de variáveis para: (1) cumprimentar o lead pelo nome, (2) mencionar o tipo de lead, (3) incluir a data atual. A mensagem deve parecer personalizada e natural.',
    validation: {
      type: 'contains',
      expected: {
        hasLeadName: true,
        hasLeadType: true,
      },
    },
    solution: {
      message: 'Olá, {{lead.name}}! Como corretor {{lead.customFields.creci ? "credenciado" : ""}}, você foi selecionado para nossa oferta especial. Entre em contato hoje, {{trigger.timestamp | date}}!',
    },
    xpReward: 30,
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'Valor Padrão para Variáveis Vazias',
    text: 'Use o operador || para definir valor padrão: {{lead.name || "Cliente"}}. Se o lead não tiver nome cadastrado, usa "Cliente" em vez de deixar em branco.',
  },
  {
    type: 'quiz',
    quizId: 'wf-vars-q1',
    variant: 'fill-blank',
    question: 'Complete a sintaxe correta para acessar o output de uma ação chamada "buscarLead":',
    template: 'Para acessar o campo "email" do output da ação "buscarLead", use: {{{{blank1}}.buscarLead.{{blank2}}.email}}',
    blanks: [
      { id: 'blank1', correctValues: ['actions', 'action'] },
      { id: 'blank2', correctValues: ['output', 'result'] },
    ],
    explanation: 'A sintaxe completa é {{actions.nomeDaAcao.output.campo}}. "actions" é o namespace fixo, seguido do nome da ação, "output" para acessar a saída, e o campo desejado.',
    xpBonus: 20,
  },
];

// ─── Module 3: Actions Avançadas ─────────────────────────────────────────────

const lessonActionsEssenciais: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Actions Essenciais do Workflow',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Com mais de 15 tipos de ação disponíveis, é importante conhecer as mais usadas e quando aplicar cada uma. Veja as actions que você vai usar em 80% dos seus workflows.',
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'SEND_MESSAGE: quando usar?',
        answer: 'Para enviar mensagens de texto simples via WhatsApp. Suporta formatação com *negrito*, _itálico_ e emojis. Use para boas-vindas, confirmações e notificações simples.',
      },
      {
        question: 'SEND_MEDIA: quando usar?',
        answer: 'Para enviar imagens, PDFs, vídeos ou áudios. Você pode passar uma URL pública do arquivo ou um arquivo armazenado na plataforma. Perfeito para enviar propostas, catálogos e contratos.',
      },
      {
        question: 'RUN_AGENT: quando usar?',
        answer: 'Para acionar um Agente IA dentro do workflow. O agente processa o contexto (mensagem recebida + dados do lead) e gera uma resposta. É a combinação mais poderosa da plataforma.',
      },
      {
        question: 'UPDATE_LEAD: quando usar?',
        answer: 'Para atualizar campos do lead automaticamente. Ex: após qualificação pelo agente, salvar "orçamento" e "interesse". Indispensável em workflows de qualificação.',
      },
      {
        question: 'CONDITIONAL: quando usar?',
        answer: 'Para criar bifurcações no workflow baseadas em condições. Ex: se status = VIP → enviar mensagem especial; senão → enviar mensagem padrão. Suporta múltiplas condições com AND/OR.',
      },
      {
        question: 'DELAY: quando usar?',
        answer: 'Para esperar um período antes de continuar. Ex: DELAY 24 horas → SEND_MESSAGE (follow-up). Suporta segundos, minutos, horas e dias. O workflow fica "em espera" sem consumir recursos.',
      },
      {
        question: 'WEB_REQUEST: quando usar?',
        answer: 'Para fazer chamadas HTTP para APIs externas: CRMs, ERPs, serviços de pagamento, etc. Suporta GET, POST, PUT com headers e corpo configuráveis. A resposta fica disponível como variável.',
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Construindo um Workflow de Follow-up',
        description: 'Trigger: LEAD_CREATED → UPDATE_LEAD (status = Novo) + SEND_MESSAGE (boas-vindas) → DELAY 24h → SEND_MESSAGE (follow-up) → DELAY 48h → RUN_AGENT (qualificação).',
      },
      {
        title: 'Configurando a ação SEND_MESSAGE',
        description: 'Campos: Dispositivo (qual número WhatsApp), Para ({{trigger.payload.phone}} ou {{lead.phone}}), Mensagem (texto com variáveis). Salve e conecte ao trigger.',
      },
      {
        title: 'Configurando o DELAY',
        description: 'Campos: Quantidade e Unidade (ex: 24 e "horas"). O workflow vai literalmente esperar 24 horas antes de executar a próxima ação.',
      },
      {
        title: 'Configurando o RUN_AGENT',
        description: 'Campos: Agente (selecione da lista), Mensagem Inicial ({{trigger.payload.message}} ou texto fixo), Lead ID ({{lead.id}}). O agente usa esses dados para personalizar o atendimento.',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'DELAY em Produção',
    text: 'Workflows com DELAY de muitas horas ou dias geram execuções "pendentes" que ficam ativas. Verifique regularmente o painel de execuções para garantir que não há execuções presas ou acumuladas.',
  },
];

const lessonConditionalEVariaveis: ContentBlock[] = [
  {
    type: 'heading',
    text: 'CONDITIONAL e Lógica Avançada',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'A ação CONDITIONAL permite criar fluxos diferentes baseados em condições. É o "if/else" do workflow — essencial para tratamento personalizado de diferentes perfis de lead.',
  },
  {
    type: 'diagram-animated',
    variant: 'flow',
    viewBox: { w: 700, h: 360 },
    nodes: [
      { id: 'trigger', label: 'MESSAGE_RECEIVED', color: '#F6AD55', x: 20, y: 150, w: 150, h: 60 },
      { id: 'cond', label: 'CONDITIONAL\nlead.type = VIP?', color: '#FC8181', x: 230, y: 150, w: 160, h: 60 },
      { id: 'vip-msg', label: 'SEND_MESSAGE\n"Atendimento VIP"', color: '#38A169', x: 470, y: 60, w: 160, h: 60 },
      { id: 'std-msg', label: 'RUN_AGENT\nAtendimento Padrão', color: '#805AD5', x: 470, y: 260, w: 160, h: 60 },
    ],
    edges: [
      { from: 'trigger', to: 'cond', label: 'dispara', animated: true },
      { from: 'cond', to: 'vip-msg', label: 'SE verdadeiro', animated: true },
      { from: 'cond', to: 'std-msg', label: 'SENÃO', animated: true },
    ],
  },
  {
    type: 'sandbox',
    variant: 'workflow-builder',
    instructions: 'Construa um workflow que: (1) Quando um lead é criado, verifica se o campo "orçamento" é maior que 500000. (2) Se SIM: adiciona tag "Alto Valor" e envia mensagem especial. (3) Se NÃO: aciona agente de qualificação padrão. Use CONDITIONAL com a condição correta.',
    validation: {
      type: 'custom',
      expected: {
        hasTrigger: 'LEAD_CREATED',
        hasConditional: true,
        hasTwoOutputPaths: true,
      },
    },
    solution: {
      trigger: 'LEAD_CREATED',
      actions: [
        {
          type: 'CONDITIONAL',
          condition: { field: 'lead.customFields.orcamento', operator: 'greaterThan', value: 500000 },
          truePath: [
            { type: 'ADD_TAG', tag: 'Alto Valor' },
            { type: 'SEND_MESSAGE', message: 'Olá {{lead.name}}, identificamos seu perfil premium...' },
          ],
          falsePath: [{ type: 'RUN_AGENT', agentId: 'qualificacao-padrao' }],
        },
      ],
    },
    xpReward: 35,
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'CONDITIONAL Aninhado',
    text: 'Você pode ter um CONDITIONAL dentro do caminho verdadeiro/falso de outro CONDITIONAL. Ex: Se VIP → Se primeiro contato → mensagem A; senão → mensagem B. Mas cuidado: muitos aninhamentos tornam o workflow difícil de manter.',
  },
];

// ─── Module 4: Templates e Debug ─────────────────────────────────────────────

const lessonTemplatesDeWorkflow: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Templates de Workflow: Comece em Minutos',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Assim como os agentes têm templates, os workflows também têm! A Catalisa oferece templates prontos para os fluxos mais comuns. Instale, personalize e ative.',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Template', highlighted: false },
      { label: 'O que faz', highlighted: false },
      { label: 'Tempo de setup', highlighted: true },
    ],
    rows: [
      {
        feature: 'Boas-vindas Automático',
        values: ['Envia mensagem quando novo lead é criado', '5 minutos'],
      },
      {
        feature: 'Atendimento com IA',
        values: ['MESSAGE_RECEIVED → RUN_AGENT → resposta automática', '10 minutos'],
      },
      {
        feature: 'Follow-up em Cascata',
        values: ['3 mensagens em 1h, 24h e 72h após criação do lead', '15 minutos'],
      },
      {
        feature: 'Qualificação Automatizada',
        values: ['Agente coleta dados → atualiza CRM → notifica equipe', '20 minutos'],
      },
      {
        feature: 'Nurturing por Segmento',
        values: ['Conteúdo personalizado por tipo de lead e interesse', '30 minutos'],
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Acesse Workflows → Templates',
        description: 'No menu de Workflows, clique em "+ Novo Workflow" e escolha "A partir de template" em vez de "Em branco".',
      },
      {
        title: 'Explore as categorias',
        description: 'Templates organizados por: Onboarding, Atendimento, Follow-up, Qualificação, Vendas, Suporte.',
      },
      {
        title: 'Instale e revise',
        description: 'Ao instalar, o workflow é criado desativado. Revise cada nó no canvas para adaptar ao seu negócio.',
      },
      {
        title: 'Substitua os placeholders',
        description: 'Templates usam [SUA_EMPRESA], [NOME_DO_AGENTE] como placeholders. Busque por "[" no canvas para encontrar todos.',
      },
      {
        title: 'Ative com cuidado',
        description: 'Antes de ativar, teste disparando o workflow manualmente para um lead de teste. Só ative para produção após validar.',
      },
    ],
  },
  {
    type: 'interactive-demo',
    title: 'Instalando o Template "Atendimento com IA"',
    scenarios: [
      {
        id: 'install-wf-template',
        label: 'Template: Atendimento com IA',
        description: 'Instale e personalize o template mais popular da Catalisa em 5 passos.',
        steps: [
          {
            instruction: 'Clique em "+ Novo Workflow" → "A partir de template".',
            action: 'open-templates',
            feedback: 'Galeria de templates aberta. 12 templates disponíveis.',
          },
          {
            instruction: 'Selecione "Atendimento com IA" e clique em "Instalar".',
            action: 'install-template',
            feedback: 'Template instalado! Canvas aberto com o workflow pré-configurado.',
          },
          {
            instruction: 'Clique no nó RUN_AGENT e selecione seu agente na lista.',
            action: 'configure-agent',
            feedback: 'Agente configurado. O workflow usará seu agente para responder.',
          },
          {
            instruction: 'Clique em "Salvar" e depois ligue o toggle para ativar.',
            action: 'activate-workflow',
            feedback: 'Workflow ativo! Teste enviando uma mensagem para o número conectado.',
          },
        ],
      },
    ],
  },
];

const lessonDebugEMonitoramento: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Debug e Monitoramento de Execuções',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Quando um workflow não se comporta como esperado, o painel de execuções é sua melhor ferramenta. Veja exatamente o que aconteceu em cada ação, com inputs, outputs e erros detalhados.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Acesse o painel de execuções',
        description: 'Na página do workflow, clique na aba "Execuções". Você verá um histórico de todas as vezes que o workflow rodou.',
      },
      {
        title: 'Interprete os status',
        description: '"Completo" (verde) = tudo certo. "Falhou" (vermelho) = alguma ação deu erro. "Em andamento" (amarelo) = ainda executando (ex: aguardando DELAY). "Cancelado" = foi interrompido.',
      },
      {
        title: 'Inspecione uma execução',
        description: 'Clique em uma execução para ver o detalhe. Cada ação mostra: tempo de execução, input enviado, output recebido e qualquer erro.',
      },
      {
        title: 'Identifique erros',
        description: 'Ações com erro ficam marcadas em vermelho. Clique nela para ver a mensagem de erro completa. Erros comuns: variável inexistente, agente inativo, dispositivo desconectado.',
      },
      {
        title: 'Re-execute após correção',
        description: 'Após corrigir o problema, você pode re-executar a mesma instância (clique em "Tentar Novamente") ou aguardar o próximo trigger natural.',
      },
    ],
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'Como testar um workflow sem esperar o trigger acontecer?',
        answer: 'Na página do workflow, clique em "Executar Manualmente". Você pode passar um leadId e um payload JSON fictício para simular o trigger. Ideal para testes durante desenvolvimento.',
      },
      {
        question: 'Meu workflow está rodando mas não envia mensagem. O que verificar?',
        answer: '1) O dispositivo WhatsApp está conectado? (Configurações → Dispositivos) 2) O número do lead tem DDI? 3) A ação SEND_MESSAGE está configurada com o campo "Para" correto? Verifique o output da ação no painel de execuções.',
      },
      {
        question: 'Quantas execuções ficam no histórico?',
        answer: 'O histórico mantém as últimas 1.000 execuções por workflow. Para análises mais longas, use a API para exportar o log completo de execuções.',
      },
      {
        question: 'Posso configurar alertas quando um workflow falha?',
        answer: 'Sim! Em Configurações → Notificações → Workflows, configure alertas por e-mail ou Slack quando qualquer workflow falhar. Recomendado para workflows críticos de produção.',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'exercise',
    title: 'Desafio Final: Workflow Completo',
    text: 'Crie um workflow do zero: Trigger = LEAD_CREATED com tipo = CORRETOR → SEND_MESSAGE de boas-vindas → DELAY 1 hora → RUN_AGENT de qualificação → UPDATE_LEAD com status = "Qualificado". Teste manualmente e verifique o painel de execuções.',
  },
  {
    type: 'quiz',
    quizId: 'wf-debug-q1',
    variant: 'multiple-choice',
    question: 'Uma execução de workflow mostra status "Em andamento" há 2 dias. O que provavelmente aconteceu?',
    options: [
      { label: 'O workflow está com bug', value: 'bug' },
      { label: 'A execução está aguardando um DELAY de 2 dias', value: 'delay' },
      { label: 'O servidor caiu', value: 'server' },
      { label: 'O lead foi deletado', value: 'lead-deleted' },
    ],
    correctAnswer: 'delay',
    explanation: '"Em andamento" é o status esperado para execuções aguardando um DELAY. O workflow está "em pausa" aguardando o tempo configurado antes de continuar para a próxima ação. Isso é comportamento normal!',
    xpBonus: 15,
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Versionamento de Workflows',
    text: 'Antes de fazer mudanças em um workflow de produção, duplique-o (botão "Duplicar"). Trabalhe na cópia, teste e só então substitua o original. Isso evita interromper execuções ativas durante edições.',
  },
];

// ─── Course Export ───────────────────────────────────────────────────────────

export const construindoWorkflowsCourse: Course = {
  slug: 'construindo-workflows',
  titleKey: 'courses.construindoWorkflows.title',
  descriptionKey: 'courses.construindoWorkflows.description',
  durationKey: 'courses.construindoWorkflows.duration',
  available: true,
  track: 'basico',
  audience: 'cliente',
  difficulty: 'intermediario',
  prerequisites: ['primeiros-passos', 'dominando-leads'],
  colorScheme: 'orange',
  totalXP: 250,
  modules: [
    {
      slug: 'conceitos-workflow',
      titleKey: 'courses.construindoWorkflows.modules.conceitos.title',
      descriptionKey: 'courses.construindoWorkflows.modules.conceitos.description',
      badgeSlug: 'workflow-explorer',
      lessons: [
        {
          slug: 'o-que-e-workflow',
          titleKey: 'courses.construindoWorkflows.modules.conceitos.lessons.oQueEWorkflow',
          durationMin: 8,
          interactivity: 'medium',
          xpPoints: 30,
          quizRequired: true,
          contentBlocks: lessonOQueEWorkflow,
        },
        {
          slug: 'tipos-de-trigger',
          titleKey: 'courses.construindoWorkflows.modules.conceitos.lessons.triggers',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 35,
          contentBlocks: lessonTriggers,
        },
      ],
    },
    {
      slug: 'canvas-visual',
      titleKey: 'courses.construindoWorkflows.modules.canvasVisual.title',
      descriptionKey: 'courses.construindoWorkflows.modules.canvasVisual.description',
      badgeSlug: 'canvas-navigator',
      lessons: [
        {
          slug: 'interface-do-canvas',
          titleKey: 'courses.construindoWorkflows.modules.canvasVisual.lessons.interface',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 30,
          contentBlocks: lessonInterfaceDoCanvas,
        },
        {
          slug: 'dependencias-e-paralelo',
          titleKey: 'courses.construindoWorkflows.modules.canvasVisual.lessons.dependencias',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 30,
          quizRequired: true,
          contentBlocks: lessonConectandoNos,
        },
        {
          slug: 'variaveis-e-interpolacao',
          titleKey: 'courses.construindoWorkflows.modules.canvasVisual.lessons.variaveis',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 35,
          quizRequired: true,
          contentBlocks: lessonVariaveis,
        },
      ],
    },
    {
      slug: 'actions-avancadas',
      titleKey: 'courses.construindoWorkflows.modules.actionsAvancadas.title',
      descriptionKey: 'courses.construindoWorkflows.modules.actionsAvancadas.description',
      badgeSlug: 'action-builder',
      lessons: [
        {
          slug: 'actions-essenciais',
          titleKey: 'courses.construindoWorkflows.modules.actionsAvancadas.lessons.essenciais',
          durationMin: 10,
          interactivity: 'medium',
          xpPoints: 25,
          contentBlocks: lessonActionsEssenciais,
        },
        {
          slug: 'conditional-e-logica',
          titleKey: 'courses.construindoWorkflows.modules.actionsAvancadas.lessons.conditional',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 35,
          contentBlocks: lessonConditionalEVariaveis,
        },
      ],
    },
    {
      slug: 'templates-e-debug',
      titleKey: 'courses.construindoWorkflows.modules.templatesEDebug.title',
      descriptionKey: 'courses.construindoWorkflows.modules.templatesEDebug.description',
      badgeSlug: 'workflow-master',
      lessons: [
        {
          slug: 'templates-de-workflow',
          titleKey: 'courses.construindoWorkflows.modules.templatesEDebug.lessons.templates',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 25,
          contentBlocks: lessonTemplatesDeWorkflow,
        },
        {
          slug: 'debug-e-monitoramento',
          titleKey: 'courses.construindoWorkflows.modules.templatesEDebug.lessons.debug',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 25,
          quizRequired: true,
          contentBlocks: lessonDebugEMonitoramento,
        },
      ],
    },
  ],
};

export default construindoWorkflowsCourse;
