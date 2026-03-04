import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

// ─── Module 1: Conhecendo a Plataforma ──────────────────────────────────────

const lessonTourDaInterface: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Bem-vindo à Catalisa!',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Vamos conhecer o painel da Catalisa na prática. Siga os passos abaixo para explorar cada seção.',
  },
  {
    type: 'mockui',
    variant: 'dashboard',
    interactionSteps: [
      {
        targetId: 'nav-leads',
        instruction: 'Clique em "Leads" na barra lateral para explorar o CRM.',
        position: 'right',
      },
      {
        targetId: 'nav-workflows',
        instruction: 'Agora clique em "Workflows" para ver os fluxos de automação.',
        position: 'right',
      },
      {
        targetId: 'nav-agents',
        instruction: 'Por último, clique em "Agentes IA" para conhecer seus assistentes.',
        position: 'right',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'Dica de navegação',
    text: 'Você pode minimizar a barra lateral clicando no ícone de menu (☰) no topo esquerdo, ganhando mais espaço para trabalhar.',
  },
  {
    type: 'mockui',
    variant: 'dashboard',
    interactionSteps: [
      {
        targetId: 'stat-leads',
        instruction: 'Observe o card de Leads ativos — ele mostra quantos contatos você tem no CRM.',
        position: 'bottom',
      },
      {
        targetId: 'stat-messages',
        instruction: 'Este card mostra mensagens enviadas e recebidas no período.',
        position: 'bottom',
      },
      {
        targetId: 'stat-agents',
        instruction: 'Aqui você vê quantos Agentes IA estão ativos.',
        position: 'bottom',
      },
      {
        targetId: 'chart-area',
        instruction: 'O gráfico mostra a evolução de mensagens e leads ao longo do tempo.',
        position: 'top',
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Dashboard',
        description: 'A tela inicial mostra métricas em tempo real: leads ativos, mensagens enviadas e execuções de workflow.',
      },
      {
        title: 'Menu lateral',
        description: 'Organizado em três grandes áreas: CRM (Leads), Automação (Workflows) e Inteligência (Agentes IA).',
      },
      {
        title: 'Perfil e configurações',
        description: 'No canto superior direito você acessa configurações de conta, dispositivos WhatsApp e preferências.',
      },
    ],
  },
  {
    type: 'quiz',
    quizId: 'pp-tour-q1',
    variant: 'multiple-choice',
    question: 'Qual seção da Catalisa você usa para cadastrar contatos e clientes?',
    options: [
      { label: 'Workflows', value: 'workflows' },
      { label: 'Leads', value: 'leads' },
      { label: 'Agentes IA', value: 'agents' },
      { label: 'Configurações', value: 'settings' },
    ],
    correctAnswer: 'leads',
    explanation: 'A seção "Leads" é o CRM da Catalisa, onde você cadastra, organiza e acompanha todos os seus contatos e clientes.',
    xpBonus: 10,
  },
];

const lessonNavegacao: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Navegando com Eficiência',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Conheça os atalhos que vão acelerar seu dia a dia na Catalisa.',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Ação', highlighted: false },
      { label: 'Mouse', highlighted: false },
      { label: 'Atalho de Teclado', highlighted: true },
    ],
    rows: [
      { feature: 'Abrir busca global', values: ['Ícone de lupa no topo', 'Ctrl + K'] },
      { feature: 'Novo lead', values: ['Botão "+ Novo Lead"', 'N na tela de Leads'] },
      { feature: 'Voltar ao Dashboard', values: ['Logo Catalisa', 'Alt + H'] },
      { feature: 'Salvar formulário', values: ['Botão "Salvar"', 'Ctrl + Enter'] },
    ],
  },
  {
    type: 'interactive-demo',
    title: 'Mini-Tour: Conheça os Atalhos',
    scenarios: [
      {
        id: 'keyboard-shortcuts',
        label: 'Atalhos de Teclado',
        description: 'Pratique os atalhos que vão acelerar sua produtividade.',
        steps: [
          {
            instruction: 'Pressione Ctrl+K para abrir a busca global.',
            action: 'press-ctrl-k',
            feedback: 'A busca global abre! Aqui você encontra leads, workflows e agentes de qualquer tela.',
          },
          {
            instruction: 'Digite "N" na tela de Leads para criar um novo lead.',
            action: 'press-n',
            feedback: 'O formulário de novo lead abriu. Atalhos economizam cliques no dia a dia.',
          },
          {
            instruction: 'Pressione Ctrl+Enter para salvar o formulário.',
            action: 'press-ctrl-enter',
            feedback: 'Formulário salvo! Você dominou os 3 atalhos principais.',
          },
        ],
      },
    ],
  },
  {
    type: 'interactive-demo',
    title: 'Praticando a Navegação',
    scenarios: [
      {
        id: 'global-search',
        label: 'Busca Global',
        description: 'A busca global encontra leads, workflows e agentes de qualquer tela.',
        steps: [
          {
            instruction: 'Pressione Ctrl+K ou clique na lupa no topo.',
            action: 'open-search',
            feedback: 'Perfeito! A busca global abriu. Você pode digitar qualquer coisa aqui.',
          },
          {
            instruction: 'Digite "João" para buscar um lead.',
            action: 'type-search',
            feedback: 'Os resultados aparecem instantaneamente enquanto você digita.',
          },
          {
            instruction: 'Pressione Enter ou clique no resultado para abrir o lead.',
            action: 'select-result',
            feedback: 'Excelente! Você navegou diretamente para o lead sem usar o menu.',
          },
        ],
      },
      {
        id: 'breadcrumb',
        label: 'Breadcrumb',
        description: 'O breadcrumb no topo mostra onde você está e permite voltar rapidamente.',
        steps: [
          {
            instruction: 'Abra um lead qualquer clicando na lista.',
            action: 'open-lead',
            feedback: 'Você está dentro do detalhe do lead.',
          },
          {
            instruction: 'Clique em "Leads" no breadcrumb do topo.',
            action: 'click-breadcrumb',
            feedback: 'Voltou para a lista sem precisar usar o botão voltar do navegador!',
          },
        ],
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Pro Tip: Favoritos',
    text: 'Você pode fixar leads e workflows frequentes clicando no ícone ★ para acessá-los rapidamente na seção "Favoritos" do menu lateral.',
  },
];

const lessonConfiguracoes: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Configurações Essenciais',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Configure perfil, fuso horário e WhatsApp antes de usar a plataforma em produção.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Configure seu Perfil',
        description: 'Acesse Configurações → Perfil. Adicione seu nome completo, foto e fuso horário correto. O fuso afeta todos os agendamentos e relatórios.',
      },
      {
        title: 'Conecte um Dispositivo WhatsApp',
        description: 'Vá em Configurações → Dispositivos → "+ Novo Dispositivo". Você verá um QR Code para escanear com o WhatsApp do celular.',
      },
      {
        title: 'Defina suas Preferências de Notificação',
        description: 'Em Configurações → Notificações, escolha quais eventos você quer ser alertado: novos leads, mensagens recebidas, erros de workflow.',
      },
      {
        title: 'Convide sua Equipe',
        description: 'Em Configurações → Usuários, você pode convidar colaboradores e definir suas permissões de acesso.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'settings',
    interactionSteps: [
      {
        targetId: 'settings-profile',
        instruction: 'Clique em "Perfil" para ver as opções de personalização.',
        position: 'right',
      },
      {
        targetId: 'settings-devices',
        instruction: 'Clique em "Dispositivos" para ver como conectar o WhatsApp.',
        position: 'right',
      },
      {
        targetId: 'settings-notificacoes',
        instruction: 'Clique em "Notificações" para configurar seus alertas.',
        position: 'right',
      },
    ],
  },
  {
    type: 'interactive-demo',
    title: 'Conectando seu WhatsApp',
    scenarios: [
      {
        id: 'connect-whatsapp',
        label: 'Conectar Dispositivo',
        description: 'Siga o fluxo completo para parear um número WhatsApp.',
        steps: [
          {
            instruction: 'Acesse Configurações → Dispositivos e clique em "+ Novo Dispositivo".',
            action: 'open-devices',
            feedback: 'A tela de novo dispositivo abriu. Você verá o QR Code em instantes.',
          },
          {
            instruction: 'No celular, abra WhatsApp → Configurações → Dispositivos Conectados → Conectar Dispositivo.',
            action: 'show-qr',
            feedback: 'O QR Code apareceu na tela. Aponte a câmera do celular para ele.',
          },
          {
            instruction: 'Escaneie o QR Code com a câmera do celular.',
            action: 'scan-qr',
            feedback: 'Dispositivo conectado com sucesso! O status mudou para "Online".',
          },
        ],
      },
      {
        id: 'configure-timezone',
        label: 'Fuso Horário',
        description: 'Configure o fuso horário para que agendamentos funcionem corretamente.',
        steps: [
          {
            instruction: 'Acesse Configurações → Perfil.',
            action: 'open-profile',
            feedback: 'A tela de perfil abriu.',
          },
          {
            instruction: 'Selecione seu fuso horário no dropdown "Fuso Horário".',
            action: 'select-timezone',
            feedback: 'Fuso alterado para "America/Sao_Paulo (UTC-3)". Todos os agendamentos usarão este fuso.',
          },
        ],
      },
    ],
  },
  {
    type: 'callout',
    variant: 'important',
    title: 'Fuso Horário é Crítico',
    text: 'Se o fuso horário estiver errado, seus agendamentos de mensagens e follow-ups serão disparados no horário incorreto. Configure antes de criar qualquer workflow.',
  },
  {
    type: 'quiz',
    quizId: 'pp-config-q1',
    variant: 'true-false',
    question: 'É possível conectar vários números de WhatsApp a uma única conta na Catalisa?',
    options: [
      { label: 'Verdadeiro', value: 'true' },
      { label: 'Falso', value: 'false' },
    ],
    correctAnswer: 'true',
    explanation: 'Sim! Em Configurações → Dispositivos você pode adicionar múltiplos números WhatsApp, cada um funcionando de forma independente na plataforma.',
    xpBonus: 10,
  },
];

// ─── Module 2: Conceitos Fundamentais ───────────────────────────────────────

const lessonConceitosBasicos: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Os Três Pilares da Catalisa',
    level: 'h2',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Conceito', highlighted: false },
      { label: 'O que é', highlighted: false },
      { label: 'Exemplo prático', highlighted: true },
    ],
    rows: [
      {
        feature: 'Lead',
        values: [
          'Um contato ou cliente cadastrado na plataforma com dados e histórico',
          'João Silva, corretor, interessado no produto X',
        ],
      },
      {
        feature: 'Workflow',
        values: [
          'Uma sequência automática de ações disparada por um evento',
          'Quando João envia mensagem → IA responde → cria tarefa de follow-up',
        ],
      },
      {
        feature: 'Agente IA',
        values: [
          'Um assistente inteligente com personalidade e ferramentas específicas',
          'Assistente "Atendimento" que responde dúvidas e agenda reuniões',
        ],
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'leads-kanban',
    interactionSteps: [
      {
        targetId: 'lead-row-1',
        instruction: 'Arraste um lead entre colunas para alterar seu status. O Kanban organiza leads visualmente por etapa.',
        position: 'top',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'A Analogia do Restaurante',
    text: 'Pense assim: o Lead é o cliente, o Workflow é o processo do restaurante (receber pedido → preparar → entregar), e o Agente IA é o garçom inteligente que interage com o cliente.',
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'Preciso criar todos os três para começar?',
        answer: 'Não! Você pode começar apenas com Leads para organizar seus contatos. Adicione Workflows e Agentes IA progressivamente conforme sua necessidade crescer.',
      },
      {
        question: 'Um Agente IA pode existir sem um Workflow?',
        answer: 'Sim. Você pode ativar um Agente diretamente em um dispositivo WhatsApp sem precisar criar um Workflow. O Workflow é para automações mais complexas com múltiplas etapas.',
      },
      {
        question: 'Quantos Leads posso cadastrar?',
        answer: 'Isso depende do seu plano. Verifique os limites em Configurações → Plano. Na maioria dos planos o volume é bem generoso para operações de médio porte.',
      },
      {
        question: 'Qual a diferença entre o Agente IA e o Assistente IA?',
        answer: 'O Assistente IA é o chatbot interno da plataforma que te ajuda a gerenciar leads e workflows. Agentes IA são assistentes que você cria para atender seus clientes via WhatsApp, com personalidade e ferramentas customizadas.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'ai-assistant',
    interactionSteps: [
      {
        targetId: 'chat-input',
        instruction: 'O AI Assistant da Catalisa ajuda você a gerenciar leads e workflows sem sair do painel.',
        position: 'top',
      },
      {
        targetId: 'chat-suggestions',
        instruction: 'Sugestões de ação aparecem automaticamente com base no contexto atual.',
        position: 'left',
      },
    ],
  },
];

const lessonComoSeConectam: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Como os Três Pilares se Conectam',
    level: 'h2',
  },
  {
    type: 'diagram-animated',
    variant: 'architecture',
    viewBox: { w: 700, h: 380 },
    nodes: [
      { id: 'whatsapp', label: 'WhatsApp\n(Cliente envia msg)', icon: 'whatsapp', color: '#25D366', x: 30, y: 160, w: 140, h: 60 },
      { id: 'lead', label: 'Lead\n(Identificado/Criado)', icon: 'person', color: '#3182CE', x: 240, y: 80, w: 140, h: 60 },
      { id: 'workflow', label: 'Workflow\n(Trigger disparado)', icon: 'flow', color: '#805AD5', x: 240, y: 240, w: 140, h: 60 },
      { id: 'agent', label: 'Agente IA\n(Processa e responde)', icon: 'robot', color: '#E53E3E', x: 450, y: 160, w: 140, h: 60 },
      { id: 'response', label: 'Resposta\n(Enviada ao cliente)', icon: 'message', color: '#25D366', x: 600, y: 280, w: 80, h: 50 },
    ],
    edges: [
      { from: 'whatsapp', to: 'lead', label: 'identifica', animated: true },
      { from: 'whatsapp', to: 'workflow', label: 'MESSAGE_RECEIVED', animated: true },
      { from: 'workflow', to: 'agent', label: 'executa RUN_AGENT', animated: true },
      { from: 'lead', to: 'agent', label: 'contexto', animated: false },
      { from: 'agent', to: 'response', label: 'SEND_MESSAGE', animated: true },
    ],
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: '1. O que acontece quando o cliente envia uma mensagem?',
        answer: 'A plataforma identifica ou cria o Lead correspondente com base no número de telefone. Isso acontece automaticamente.',
      },
      {
        question: '2. Como o Workflow é disparado?',
        answer: 'O trigger MESSAGE_RECEIVED detecta a mensagem e inicia o Workflow associado. Você pode ter vários Workflows com triggers diferentes.',
      },
      {
        question: '3. Como o Agente IA recebe o contexto?',
        answer: 'O Workflow aciona o Agente IA via ação RUN_AGENT, passando os dados do Lead (nome, tipo, histórico) como contexto para personalizar a resposta.',
      },
      {
        question: '4. Como a resposta chega ao cliente?',
        answer: 'O Agente gera a resposta e a ação SEND_MESSAGE a envia de volta pelo WhatsApp. O cliente recebe como uma mensagem normal.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'workflow-canvas',
    interactionSteps: [
      {
        targetId: 'node-trigger',
        instruction: 'O trigger MESSAGE_RECEIVED inicia o fluxo quando o cliente manda uma mensagem.',
        position: 'bottom',
      },
      {
        targetId: 'node-agent',
        instruction: 'A ação RUN_AGENT aciona o agente IA para processar e responder.',
        position: 'right',
      },
    ],
    initialData: {
      nodes: [
        { id: 'trigger', type: 'MESSAGE_RECEIVED', label: 'Mensagem Recebida' },
        { id: 'agent', type: 'AI_AGENT', label: 'Agente IA' },
        { id: 'send', type: 'SEND_MESSAGE', label: 'Enviar Resposta' },
      ],
    },
  },
  {
    type: 'interactive-demo',
    title: 'Simulação: Jornada de uma Mensagem',
    scenarios: [
      {
        id: 'incoming-message',
        label: 'Mensagem Entrante',
        description: 'Veja o que acontece quando um lead envia uma mensagem.',
        steps: [
          {
            instruction: 'Observe o painel de eventos em tempo real.',
            action: 'show-realtime',
            feedback: 'Um evento MESSAGE_RECEIVED chegou do número +55 11 99999-0001.',
          },
          {
            instruction: 'A plataforma buscou o Lead associado ao número.',
            action: 'show-lead-lookup',
            feedback: 'Lead "Maria Fernanda" encontrado. Contexto carregado: tipo "Corretor", última interação há 2 dias.',
          },
          {
            instruction: 'O Workflow "Atendimento Corretores" foi disparado.',
            action: 'show-workflow-trigger',
            feedback: 'Workflow executando ação RUN_AGENT com o Agente "Assistente Comercial".',
          },
          {
            instruction: 'O Agente IA gerou uma resposta personalizada.',
            action: 'show-agent-response',
            feedback: '"Olá Maria! Vi que você entrou em contato. Como posso ajudar?" — enviado com sucesso.',
          },
        ],
      },
    ],
  },
];

const lessonPrimeiroLead: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Criando seu Primeiro Lead',
    level: 'h2',
  },
  {
    type: 'mockui',
    variant: 'leads-table',
    interactionSteps: [
      {
        targetId: 'btn-add-lead',
        instruction: 'Clique em "+ Novo Lead" para abrir o formulário de criação.',
        position: 'bottom',
      },
      {
        targetId: 'search-leads',
        instruction: 'Use a barra de busca para encontrar leads por nome ou telefone.',
        position: 'bottom',
      },
      {
        targetId: 'btn-filter',
        instruction: 'Clique em "Filtros" para segmentar leads por tipo, status ou data.',
        position: 'bottom',
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Clique em "+ Novo Lead"',
        description: 'O botão está no canto superior direito. Uma janela lateral (drawer) vai se abrir com o formulário.',
      },
      {
        title: 'Preencha os dados básicos',
        description: 'Nome, telefone com DDI (+55), e-mail. O telefone é obrigatório para poder enviar mensagens via WhatsApp.',
      },
      {
        title: 'Escolha o Tipo de Lead',
        description: 'O "Tipo" categoriza o lead (ex: CORRETOR, CLIENTE_FINAL, PROSPECT). Cada tipo pode ter campos personalizados diferentes.',
      },
      {
        title: 'Salve e explore o perfil',
        description: 'Clique em "Salvar". O Lead foi criado! Agora você pode ver o perfil completo com histórico de mensagens, anotações e timeline.',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'variable-interpolation',
    instructions: 'Preencha os campos abaixo para criar um lead fictício. Observe como as variáveis do lead ficam disponíveis para uso em workflows e agentes. Tente: Nome = "Ana Silva", Tipo = "CORRETOR", Telefone = "+55 11 98765-4321".',
    validation: {
      type: 'contains',
      expected: { name: 'Ana Silva' },
    },
    solution: {
      name: 'Ana Silva',
      type: 'CORRETOR',
      phone: '+5511987654321',
    },
    xpReward: 20,
  },
  {
    type: 'callout',
    variant: 'exercise',
    title: 'Desafio: Crie 3 Leads',
    text: 'Crie pelo menos 3 leads com tipos diferentes (ex: CORRETOR, CLIENTE, PARCEIRO) para ver como a plataforma os organiza. Isso vai te preparar para a próxima aula sobre gestão de leads.',
  },
  {
    type: 'quiz',
    quizId: 'pp-lead-q1',
    variant: 'multiple-choice',
    question: 'Qual campo é obrigatório para enviar mensagens WhatsApp para um lead?',
    options: [
      { label: 'E-mail', value: 'email' },
      { label: 'Telefone com DDI', value: 'phone' },
      { label: 'Nome completo', value: 'name' },
      { label: 'Tipo de lead', value: 'type' },
    ],
    correctAnswer: 'phone',
    explanation: 'O telefone com código do país (DDI, ex: +55 para Brasil) é obrigatório porque é o identificador único no WhatsApp. Sem ele, não é possível iniciar ou receber conversas.',
    xpBonus: 10,
  },
];

// ─── Course Export ───────────────────────────────────────────────────────────

export const primeirosPassosCourse: Course = {
  slug: 'primeiros-passos',
  titleKey: 'courses.primeirosPassos.title',
  descriptionKey: 'courses.primeirosPassos.description',
  durationKey: 'courses.primeirosPassos.duration',
  available: true,
  track: 'basico',
  audience: 'todos',
  difficulty: 'iniciante',
  colorScheme: 'teal',
  totalXP: 100,
  modules: [
    {
      slug: 'conhecendo-a-plataforma',
      titleKey: 'courses.primeirosPassos.modules.conhecendoPlataforma.title',
      descriptionKey: 'courses.primeirosPassos.modules.conhecendoPlataforma.description',
      badgeSlug: 'explorer',
      lessons: [
        {
          slug: 'tour-da-interface',
          titleKey: 'courses.primeirosPassos.modules.conhecendoPlataforma.lessons.tourDaInterface',
          durationMin: 5,
          interactivity: 'high',
          xpPoints: 20,
          quizRequired: true,
          contentBlocks: lessonTourDaInterface,
        },
        {
          slug: 'navegacao',
          titleKey: 'courses.primeirosPassos.modules.conhecendoPlataforma.lessons.navegacao',
          durationMin: 5,
          interactivity: 'medium',
          xpPoints: 15,
          contentBlocks: lessonNavegacao,
        },
        {
          slug: 'configuracoes-essenciais',
          titleKey: 'courses.primeirosPassos.modules.conhecendoPlataforma.lessons.configuracoes',
          durationMin: 5,
          interactivity: 'high',
          xpPoints: 15,
          quizRequired: true,
          contentBlocks: lessonConfiguracoes,
        },
      ],
    },
    {
      slug: 'conceitos-fundamentais',
      titleKey: 'courses.primeirosPassos.modules.conceitosFundamentais.title',
      descriptionKey: 'courses.primeirosPassos.modules.conceitosFundamentais.description',
      badgeSlug: 'foundations',
      lessons: [
        {
          slug: 'os-tres-pilares',
          titleKey: 'courses.primeirosPassos.modules.conceitosFundamentais.lessons.tresPilares',
          durationMin: 5,
          interactivity: 'medium',
          xpPoints: 15,
          contentBlocks: lessonConceitosBasicos,
        },
        {
          slug: 'como-se-conectam',
          titleKey: 'courses.primeirosPassos.modules.conceitosFundamentais.lessons.comoSeConectam',
          durationMin: 5,
          interactivity: 'high',
          xpPoints: 15,
          contentBlocks: lessonComoSeConectam,
        },
        {
          slug: 'primeiro-lead',
          titleKey: 'courses.primeirosPassos.modules.conceitosFundamentais.lessons.primeiroLead',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 20,
          quizRequired: true,
          contentBlocks: lessonPrimeiroLead,
        },
      ],
    },
  ],
};

export default primeirosPassosCourse;
