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
    text: 'A Catalisa é uma plataforma de automação conversacional que une CRM, Agentes de IA e WhatsApp em um único lugar. Nesta aula você vai conhecer cada seção do painel e entender para que serve cada uma delas.',
  },
  {
    type: 'mockui',
    variant: 'dashboard',
    interactionSteps: [
      {
        targetId: 'sidebar-leads',
        instruction: 'Clique em "Leads" na barra lateral para explorar o CRM.',
        position: 'right',
      },
      {
        targetId: 'sidebar-workflows',
        instruction: 'Agora clique em "Workflows" para ver os fluxos de automação.',
        position: 'right',
      },
      {
        targetId: 'sidebar-agents',
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
    text: 'Conhecer os atalhos e padrões de navegação da Catalisa vai acelerar muito o seu dia a dia. Veja como se mover rapidamente entre as telas.',
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
    text: 'Antes de começar a usar a plataforma em produção, é importante configurar algumas coisas básicas: seu perfil, fuso horário e a conexão com o WhatsApp.',
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
    type: 'paragraph',
    text: 'A Catalisa é construída em torno de três conceitos centrais que trabalham juntos para automatizar sua operação: Leads, Workflows e Agentes IA. Entender esses três elementos é o ponto de partida para tudo.',
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
    type: 'paragraph',
    text: 'Os três pilares ganham todo seu poder quando trabalham juntos. Veja o diagrama abaixo que mostra como uma conversa real flui pela plataforma.',
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
    type: 'paragraph',
    text: 'Quando um cliente envia uma mensagem pelo WhatsApp: (1) a plataforma identifica ou cria o Lead correspondente, (2) o Workflow com trigger MESSAGE_RECEIVED é disparado, (3) o Workflow aciona o Agente IA com o contexto do Lead, (4) o Agente processa e envia a resposta de volta.',
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
    type: 'paragraph',
    text: 'Chegou a hora de colocar a mão na massa! Vamos criar seu primeiro Lead na plataforma. É simples e vai te ajudar a entender como os dados são organizados.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Acesse a seção de Leads',
        description: 'No menu lateral, clique em "Leads". Você verá a lista de todos os seus contatos (vazia por enquanto).',
      },
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
          interactivity: 'medium',
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
          interactivity: 'low',
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
