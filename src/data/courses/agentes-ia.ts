import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

// ─── Module 1: Fundamentos dos Agentes IA ────────────────────────────────────

const lessonOQueEAgente: ContentBlock[] = [
  {
    type: 'heading',
    text: 'O que é um Agente IA?',
    level: 'h2',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Característica', highlighted: false },
      { label: 'Chatbot Tradicional', highlighted: false },
      { label: 'Agente IA Catalisa', highlighted: true },
    ],
    rows: [
      {
        feature: 'Compreensão de linguagem',
        values: ['Palavras-chave fixas', 'Linguagem natural completa'],
      },
      {
        feature: 'Flexibilidade de resposta',
        values: ['Respostas pré-programadas', 'Geração dinâmica contextualizada'],
      },
      {
        feature: 'Acesso a dados do CRM',
        values: ['Limitado ou inexistente', 'Acesso total via ferramentas'],
      },
      {
        feature: 'Aprendizado de contexto',
        values: ['Sem memória de conversa', 'Memória da sessão e do perfil do lead'],
      },
      {
        feature: 'Execução de ações',
        values: ['Somente envio de texto', 'Cria leads, agenda, atualiza dados'],
      },
    ],
  },
  {
    type: 'diagram-animated',
    variant: 'architecture',
    viewBox: { w: 680, h: 340 },
    nodes: [
      { id: 'user', label: 'Cliente\n(WhatsApp)', icon: 'person', color: '#25D366', x: 20, y: 140, w: 120, h: 60 },
      { id: 'agent', label: 'Agente IA\n(seu assistente)', icon: 'robot', color: '#805AD5', x: 220, y: 140, w: 160, h: 60 },
      { id: 'prompt', label: 'System Prompt\n(personalidade)', icon: 'text', color: '#ED8936', x: 220, y: 20, w: 160, h: 50 },
      { id: 'tools', label: 'Ferramentas\n(CRM, WhatsApp)', icon: 'tools', color: '#3182CE', x: 220, y: 270, w: 160, h: 50 },
      { id: 'crm', label: 'CRM\n(dados do lead)', icon: 'database', color: '#38A169', x: 460, y: 80, w: 120, h: 50 },
      { id: 'wpp', label: 'WhatsApp\n(envio de msg)', icon: 'whatsapp', color: '#25D366', x: 460, y: 200, w: 120, h: 50 },
    ],
    edges: [
      { from: 'user', to: 'agent', label: 'mensagem', animated: true },
      { from: 'prompt', to: 'agent', label: 'define comportamento', animated: false },
      { from: 'agent', to: 'tools', label: 'usa ferramentas', animated: true },
      { from: 'tools', to: 'crm', label: 'lê/atualiza', animated: true },
      { from: 'tools', to: 'wpp', label: 'envia resposta', animated: true },
      { from: 'agent', to: 'user', label: 'responde', animated: true },
    ],
  },
  {
    type: 'mockui',
    variant: 'agent-chat',
    interactionSteps: [
      {
        targetId: 'chat-input',
        instruction: 'Veja um agente em ação: ele entende linguagem natural e responde contextualmente.',
        position: 'top',
      },
      {
        targetId: 'tool-calls-panel',
        instruction: 'No painel lateral, observe as ferramentas que o agente usou automaticamente para buscar dados.',
        position: 'left',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'Agente vs AI Assistant',
    text: 'O AI Assistant (no ícone de chat no topo) é para você — a equipe interna. Os Agentes IA são para seus clientes via WhatsApp. São sistemas separados com propósitos diferentes.',
  },
  {
    type: 'quiz',
    quizId: 'ai-fundamentos-q1',
    variant: 'multiple-choice',
    question: 'Qual é a principal vantagem de um Agente IA sobre um chatbot tradicional?',
    options: [
      { label: 'Responde mais rápido', value: 'speed' },
      { label: 'Compreende linguagem natural e acessa dados reais do CRM', value: 'intelligence' },
      { label: 'Não precisa de configuração', value: 'noconfig' },
      { label: 'É gratuito para usar', value: 'free' },
    ],
    correctAnswer: 'intelligence',
    explanation: 'A grande diferença é a combinação de linguagem natural (entende qualquer formulação) com acesso real ao CRM (pode buscar dados, atualizar campos e executar ações). Chatbots tradicionais só seguem fluxos pré-definidos.',
    xpBonus: 15,
  },
];

const lessonArquiteturaDoAgente: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Anatomia de um Agente IA',
    level: 'h2',
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'O que é o System Prompt?',
        answer: 'É o conjunto de instruções que define quem é o agente: nome, personalidade, tom de voz, objetivos, restrições e como deve se comportar. É como o "manual de instruções" do agente. Bem escrito, o prompt é o segredo de um agente eficaz.',
      },
      {
        question: 'O que são Ferramentas (Tools)?',
        answer: 'Ferramentas são capacidades que o agente pode usar durante uma conversa. Exemplos: buscar dados de um lead, atualizar um campo, enviar uma mensagem, criar uma tarefa. Você escolhe quais ferramentas cada agente tem acesso — menos é mais para agentes especializados.',
      },
      {
        question: 'O que são Conversas e como funciona a memória?',
        answer: 'Cada sessão de chat com um agente é uma Conversa. O agente lembra de tudo que foi dito dentro da mesma conversa. Entre conversas diferentes (leads diferentes ou sessões separadas), a memória é reiniciada — a não ser que você passe contexto explícito no prompt.',
      },
      {
        question: 'Posso ter múltiplos agentes para funções diferentes?',
        answer: 'Sim! A prática recomendada é ter agentes especializados: um para atendimento inicial, outro para suporte técnico, outro para vendas. Cada um com seu próprio prompt e conjunto de ferramentas otimizado.',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Princípio do Mínimo Privilégio',
    text: 'Dê ao agente apenas as ferramentas que ele realmente precisa. Um agente de atendimento não precisa de ferramentas para deletar leads. Menos ferramentas = menos risco de ação incorreta e respostas mais focadas.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'System Prompt define a identidade',
        description: '"Você é Sofia, assistente comercial da Imobiliária XYZ. Seu objetivo é qualificar leads interessados em imóveis residenciais. Seja amigável, direto e sempre pergunte sobre o orçamento disponível."',
      },
      {
        title: 'Ferramentas definem o poder',
        description: 'Sofia tem: get_lead (buscar dados do cliente), update_lead (salvar informações coletadas), send_whatsapp_message (enviar propostas), list_workflows (verificar próximos passos).',
      },
      {
        title: 'Conversa é o contexto em tempo real',
        description: 'Durante a conversa com Maria, Sofia acessa o perfil (get_lead), descobre que é corretora interessada em alto padrão, atualiza o segmento (update_lead) e envia catálogo específico.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'agent-chat',
    interactionSteps: [
      {
        targetId: 'chat-input',
        instruction: 'Observe como o agente Sofia responderia a uma mensagem do lead, usando ferramentas para buscar dados.',
        position: 'top',
      },
      {
        targetId: 'tool-calls-panel',
        instruction: 'Note as ferramentas usadas automaticamente: get_lead para buscar dados, update_lead para salvar informações.',
        position: 'left',
      },
    ],
  },
];

// ─── Module 2: Criando seu Primeiro Agente ───────────────────────────────────

const lessonFormularioDoAgente: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Criando um Agente: O Formulário',
    level: 'h2',
  },
  {
    type: 'mockui',
    variant: 'agent-form',
    interactionSteps: [
      {
        targetId: 'field-name',
        instruction: 'Digite o nome do agente. Ex: "Sofia - Atendimento".',
        position: 'right',
      },
      {
        targetId: 'field-description',
        instruction: 'Adicione uma descrição interna do propósito desse agente.',
        position: 'right',
      },
      {
        targetId: 'field-model',
        instruction: 'Escolha o modelo: "fast" (GPT rápido) ou "smart" (mais inteligente). Comece com "smart".',
        position: 'right',
      },
      {
        targetId: 'field-system-prompt',
        instruction: 'Aqui você escreve as instruções do agente. Esta é a parte mais importante!',
        position: 'top',
      },
    ],
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Modelo', highlighted: false },
      { label: 'Velocidade', highlighted: false },
      { label: 'Custo', highlighted: false },
      { label: 'Melhor para', highlighted: true },
    ],
    rows: [
      {
        feature: 'fast',
        values: ['~1-2 segundos', 'Baixo', 'FAQ, respostas simples, alto volume'],
      },
      {
        feature: 'smart',
        values: ['~3-5 segundos', 'Médio', 'Qualificação, negociação, lógica complexa'],
      },
      {
        feature: 'powerful',
        values: ['~8-15 segundos', 'Alto', 'Análise profunda, documentos, estratégia'],
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'agent-config',
    instructions: 'Configure um agente de atendimento: escolha um nome, uma descrição, o modelo "smart" e escreva um System Prompt curto (2-3 frases) definindo o papel do agente.',
    validation: {
      type: 'contains',
      expected: { hasName: true, hasModel: true, hasPrompt: true },
    },
    solution: {
      name: 'Sofia - Atendimento',
      model: 'smart',
      prompt: 'Você é Sofia, assistente de atendimento. Responda de forma amigável e direcione o cliente para a equipe de vendas quando necessário.',
    },
    xpReward: 25,
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'Comece com "smart"',
    text: 'Para o seu primeiro agente, use sempre o modelo "smart". Depois que estiver satisfeito com o comportamento, você pode testar o modelo "fast" se precisar de mais velocidade.',
  },
];

const lessonEscrevendoSystemPrompt: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Escrevendo um System Prompt Eficaz',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'O System Prompt define o comportamento do agente. Siga a estrutura RACI.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'R - Role (Papel)',
        description: 'Defina quem o agente é. "Você é [Nome], [cargo] da [empresa]. Você tem [X anos] de experiência em [área]." Seja específico — agentes com identidade clara performam melhor.',
      },
      {
        title: 'A - Audience (Público)',
        description: 'Descreva com quem o agente vai conversar. "Você conversa com corretores de imóveis parceiros que precisam de [necessidade específica]."',
      },
      {
        title: 'C - Capabilities (Capacidades)',
        description: 'Diga o que o agente PODE fazer. "Você pode responder dúvidas sobre imóveis disponíveis, agendar visitas e atualizar o cadastro do corretor."',
      },
      {
        title: 'I - Instructions (Instruções)',
        description: 'Defina COMO o agente deve agir. "Sempre cumprimente pelo nome. Nunca revele preços sem verificar o perfil. Se não souber a resposta, diga que vai verificar."',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'agent-config',
    instructions: 'Escreva um System Prompt para um agente de atendimento para uma escola de cursos online. Use a estrutura RACI: Role, Audience, Capabilities, Instructions. O agente deve ajudar alunos com dúvidas sobre matrículas e acesso à plataforma.',
    validation: {
      type: 'contains',
      expected: { hasRole: true, hasInstructions: true },
    },
    solution: {
      prompt: 'Você é Lucas, assistente de atendimento da EduCatalisa. Você conversa com alunos matriculados ou interessados em nossos cursos online. Você pode: responder dúvidas sobre matrículas, explicar como acessar a plataforma, verificar o status de pagamentos e encaminhar problemas técnicos para o suporte. Sempre cumprimente pelo nome quando disponível. Seja paciente e didático. Se não souber a resposta, diga: "Vou verificar isso com nossa equipe e te respondo em breve."',
    },
    xpReward: 30,
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'O System Prompt tem limite de tamanho?',
        answer: 'Tecnicamente sim, mas é muito grande (dezenas de milhares de caracteres). Na prática, prompts de 200-800 palavras são ideais — claros, completos e sem redundâncias.',
      },
      {
        question: 'Posso incluir exemplos de conversa no prompt?',
        answer: 'Sim! Incluir 2-3 exemplos de conversa ideal ("User: pergunta → Agente: resposta esperada") é uma das técnicas mais eficazes para moldar o comportamento. Use o formato: "Exemplo: Se alguém perguntar X, responda Y."',
      },
      {
        question: 'Devo usar a variável {{lead.name}} no prompt?',
        answer: 'Não no System Prompt. O nome do lead é passado automaticamente pelo contexto da conversa quando o agente usa a ferramenta get_lead. Você pode instruir o agente a sempre buscar o nome no início da conversa.',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Evite Prompts Vagos',
    text: '"Seja um assistente útil e amigável" é muito vago. "Você é um consultor especializado em imóveis de alto padrão. Nunca discuta preços sem qualificar o orçamento do cliente primeiro" é específico e eficaz.',
  },
];

const lessonTemplatesDeAgentes: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Templates de Agentes: Comece Rápido',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'A Catalisa tem um marketplace de templates prontos. Instale em um clique e personalize.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Acesse Agentes → Templates',
        description: 'No menu de Agentes, clique em "Templates" ou "Marketplace". Você verá categorias: Atendimento, Vendas, Qualificação, Suporte, etc.',
      },
      {
        title: 'Explore e escolha um template',
        description: 'Cada template mostra: descrição do caso de uso, ferramentas incluídas e modelo recomendado. Clique em "Ver Detalhes" para ler o prompt completo.',
      },
      {
        title: 'Clique em "Instalar"',
        description: 'Um agente é criado na sua conta com o prompt e ferramentas pré-configurados. Ele fica desativado até você habilitá-lo.',
      },
      {
        title: 'Personalize e ative',
        description: 'Edite o prompt para incluir o nome da sua empresa e detalhes específicos. Teste antes de ativar.',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'agent-config',
    instructions: 'Simule a instalação de um template de agente. Preencha: nome do agente ("Consultor Comercial"), modelo ("smart"), e um System Prompt de 2-3 frases descrevendo o papel do agente como consultor de vendas.',
    validation: {
      type: 'contains',
      expected: { hasName: true, hasModel: true, hasPrompt: true },
    },
    solution: {
      name: 'Consultor Comercial',
      model: 'smart',
      prompt: 'Você é um consultor comercial especializado. Ajude os clientes a encontrar a melhor solução para suas necessidades. Sempre qualifique o orçamento antes de fazer recomendações.',
    },
    xpReward: 20,
  },
  {
    type: 'interactive-demo',
    title: 'Instalando o Template "Consultor Comercial"',
    scenarios: [
      {
        id: 'install-template',
        label: 'Instalar Template',
        description: 'Veja como instalar o template de Consultor Comercial em 4 cliques.',
        steps: [
          {
            instruction: 'Acesse Agentes → Templates e clique na categoria "Vendas".',
            action: 'browse-templates',
            feedback: 'Templates de vendas exibidos: Consultor Comercial, Qualificador de Leads, Closer B2B.',
          },
          {
            instruction: 'Clique em "Consultor Comercial" para ver os detalhes.',
            action: 'view-template',
            feedback: 'Template inclui: System Prompt de 400 palavras, 8 ferramentas de CRM e modelo "smart".',
          },
          {
            instruction: 'Clique em "Instalar Template".',
            action: 'install-template',
            feedback: 'Agente "Consultor Comercial" criado! Aparece na lista de agentes como desativado.',
          },
          {
            instruction: 'Edite o prompt para adicionar o nome da sua empresa e clique em "Salvar".',
            action: 'customize-template',
            feedback: 'Personalização salva. Agente pronto para ser testado!',
          },
        ],
      },
    ],
  },
];

// ─── Module 3: Ferramentas do Agente ─────────────────────────────────────────

const lessonFerramentasDisponiveis: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Ferramentas: O Que Seu Agente Pode Fazer',
    level: 'h2',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Categoria', highlighted: false },
      { label: 'Ferramentas', highlighted: false },
      { label: 'O que fazem', highlighted: true },
    ],
    rows: [
      {
        feature: 'CRM - Leitura',
        values: [
          'get_lead, list_leads, search_leads',
          'Buscar e listar informações de leads',
        ],
      },
      {
        feature: 'CRM - Escrita',
        values: [
          'create_lead, update_lead, add_tag, update_status',
          'Criar e atualizar dados de leads',
        ],
      },
      {
        feature: 'WhatsApp',
        values: [
          'send_message, send_media, create_group',
          'Enviar mensagens e arquivos',
        ],
      },
      {
        feature: 'Workflows',
        values: [
          'run_workflow, list_workflows',
          'Disparar e consultar fluxos de automação',
        ],
      },
      {
        feature: 'Utilitários',
        values: [
          'get_current_date, calculate_date, format_text',
          'Cálculos e formatações de dados',
        ],
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'agent-form',
    interactionSteps: [
      {
        targetId: 'step-tools',
        instruction: 'Na aba "Ferramentas", veja as categorias disponíveis: CRM, WhatsApp, Workflows e Utilitários.',
        position: 'right',
      },
      {
        targetId: 'tool-get-lead',
        instruction: 'A ferramenta get_lead permite que o agente busque dados completos do lead durante a conversa.',
        position: 'right',
      },
      {
        targetId: 'tool-update-lead',
        instruction: 'Com update_lead, o agente salva informações coletadas diretamente no CRM.',
        position: 'right',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Ferramenta Mais Poderosa: update_lead',
    text: 'A ferramenta update_lead permite que o agente salve informações coletadas na conversa diretamente no CRM. Um agente pode perguntar "Qual seu orçamento?" e salvar a resposta no campo personalizado correspondente — sem intervenção humana.',
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'Quantas ferramentas posso dar a um agente?',
        answer: 'Tecnicamente não há limite, mas recomendamos no máximo 8-10 ferramentas por agente. Mais do que isso pode confundir o modelo sobre qual ferramenta usar em cada situação.',
      },
      {
        question: 'Posso criar ferramentas personalizadas?',
        answer: 'Sim! Em Configurações → Custom Actions, você pode criar ações customizadas (chamadas de API, scripts) que ficam disponíveis como ferramentas para os agentes.',
      },
      {
        question: 'O agente usa as ferramentas automaticamente?',
        answer: 'Sim. O agente decide autonomamente quando usar uma ferramenta baseado na conversa. Você pode influenciar isso via System Prompt: "Sempre use get_lead no início da conversa para personalizar o atendimento."',
      },
    ],
  },
];

const lessonConfigurondoFerramentas: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Adicionando e Configurando Ferramentas',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Na edicao do agente, aba "Ferramentas", selecione as capacidades que deseja habilitar.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Abra o agente para edição',
        description: 'Na lista de Agentes, clique nos três pontos "..." do agente e selecione "Editar". Ou clique no nome do agente e depois em "Editar".',
      },
      {
        title: 'Vá na aba "Ferramentas"',
        description: 'Você verá duas seções: "Ferramentas Ativas" (já habilitadas) e "Ferramentas Disponíveis" (prontas para adicionar).',
      },
      {
        title: 'Adicione ferramentas necessárias',
        description: 'Clique em "+ Adicionar" ao lado de cada ferramenta. Para remover uma ativa, clique no ícone de lixeira.',
      },
      {
        title: 'Salve e teste',
        description: 'Clique em "Salvar". As alterações de ferramentas têm efeito imediato nas próximas conversas.',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'agent-config',
    instructions: 'Configure as ferramentas para um agente de "Qualificação de Leads". Selecione apenas as ferramentas necessárias para: (1) buscar dados do lead, (2) atualizar o tipo/campos, (3) adicionar tags, (4) disparar um workflow de follow-up. Não adicione ferramentas desnecessárias.',
    validation: {
      type: 'contains',
      expected: {
        tools: ['get_lead', 'update_lead', 'add_tag', 'run_workflow'],
      },
    },
    solution: {
      tools: ['get_lead', 'update_lead', 'add_tag', 'run_workflow'],
    },
    xpReward: 25,
  },
  {
    type: 'quiz',
    quizId: 'ai-tools-q1',
    variant: 'drag-drop',
    question: 'Organize as ferramentas nas categorias corretas:',
    items: [
      'get_lead',
      'send_message',
      'create_lead',
      'run_workflow',
      'update_status',
      'send_media',
    ],
    categories: [
      {
        name: 'Leitura de Dados',
        correctItems: ['get_lead'],
      },
      {
        name: 'Modificação de Dados',
        correctItems: ['create_lead', 'update_status'],
      },
      {
        name: 'Comunicação',
        correctItems: ['send_message', 'send_media'],
      },
      {
        name: 'Automação',
        correctItems: ['run_workflow'],
      },
    ],
    explanation: 'Categorizar ferramentas ajuda a escolher as corretas para cada tipo de agente. Um agente de "leitura" só precisa de ferramentas de leitura; um de "atendimento" precisa de comunicação.',
    xpBonus: 20,
  },
];

// ─── Module 4: Testando e Publicando ────────────────────────────────────────

const lessonTestando: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Testando seu Agente Antes de Publicar',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Teste exaustivamente antes de publicar. Use o ambiente de teste isolado da Catalisa.',
  },
  {
    type: 'mockui',
    variant: 'agent-chat',
    interactionSteps: [
      {
        targetId: 'chat-input',
        instruction: 'Digite uma mensagem de teste como se fosse um cliente. Ex: "Olá, tenho interesse em um imóvel".',
        position: 'top',
      },
      {
        targetId: 'tool-calls-panel',
        instruction: 'Observe o painel lateral mostrando quais ferramentas o agente usou durante a resposta.',
        position: 'left',
      },
      {
        targetId: 'btn-reset',
        instruction: 'Clique em "Nova Conversa" para reiniciar o contexto e testar outro cenário.',
        position: 'bottom',
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Use o chat de teste interno',
        description: 'Na página do agente, clique em "Testar Agente". Você pode conversar diretamente sem precisar de WhatsApp. O contexto usa um lead fictício pré-configurado.',
      },
      {
        title: 'Teste cenários felizes',
        description: 'Simule uma conversa ideal: o cliente faz perguntas claras, o agente responde adequadamente. Verifique se o tom, as ferramentas usadas e as respostas estão corretos.',
      },
      {
        title: 'Teste cenários difíceis',
        description: 'Perguntas ambíguas, off-topic, requests impossíveis. "Me dê o número do banco", "Quero um imóvel de R$100". O agente deve lidar graciosamente.',
      },
      {
        title: 'Verifique as tool calls',
        description: 'No painel de debug (aba "Ferramentas"), veja exatamente quais ferramentas o agente usou, os parâmetros enviados e os resultados. Isso revela comportamentos inesperados.',
      },
    ],
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'O agente se apresentou corretamente?',
        answer: 'Verifique se o agente usou o nome definido no prompt e seguiu o tom de voz esperado na primeira mensagem.',
      },
      {
        question: 'O agente buscou dados antes de responder?',
        answer: 'No painel de ferramentas, confirme que get_lead foi chamado antes da primeira resposta personalizada.',
      },
      {
        question: 'O agente lidou com perguntas off-topic?',
        answer: 'Teste com perguntas fora do escopo. O agente deve redirecionar educadamente para o assunto principal.',
      },
      {
        question: 'O agente atualizou o CRM quando solicitado?',
        answer: 'Se o lead forneceu informações novas (orcamento, email), verifique se update_lead foi chamado com os campos corretos.',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Teste com Leads Reais (Sandbox)',
    text: 'Você pode testar passando um leadId real no campo "Lead de Contexto" do chat de teste. Assim o agente busca dados reais do CRM, tornando o teste muito mais fiel ao ambiente de produção.',
  },
];

const lessonPublicando: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Publicando e Conectando ao WhatsApp',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Conecte seu agente ao WhatsApp via Workflow (controle granular) ou direto no dispositivo (universal).',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Método', highlighted: false },
      { label: 'Como funciona', highlighted: false },
      { label: 'Quando usar', highlighted: true },
    ],
    rows: [
      {
        feature: 'Via Workflow',
        values: [
          'Workflow com trigger MESSAGE_RECEIVED → ação RUN_AGENT',
          'Controle avançado: escolha quais leads ativam o agente baseado em filtros',
        ],
      },
      {
        feature: 'Direto no Dispositivo',
        values: [
          'Configurações → Dispositivos → Selecionar agente padrão',
          'Todos os contatos que mandarem mensagem ativam o agente',
        ],
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'workflow-canvas',
    interactionSteps: [
      {
        targetId: 'field-name',
        instruction: 'Veja o workflow montado: trigger MESSAGE_RECEIVED conectado a uma acao RUN_AGENT que aciona seu agente.',
        position: 'top',
      },
      {
        targetId: 'btn-next-step',
        instruction: 'Clique para ver como adicionar condicoes de filtro ao trigger (ex: tipo do lead, horario).',
        position: 'right',
      },
    ],
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Ative o agente',
        description: 'Na lista de agentes, ligue o toggle "Ativo". Um agente inativo não responde mesmo que seja chamado por um workflow.',
      },
      {
        title: 'Escolha o método de conexão',
        description: 'Para controle granular: use Workflow. Para resposta universal: configure no Dispositivo.',
      },
      {
        title: 'Teste com número real',
        description: 'Envie uma mensagem do seu próprio WhatsApp para o número conectado. A resposta deve vir em segundos.',
      },
      {
        title: 'Monitore as primeiras 24h',
        description: 'Acesse Agentes → [seu agente] → Conversas para ver todas as interações. Ajuste o prompt baseado em comportamentos inesperados.',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'trigger-config',
    instructions: 'Configure um trigger MESSAGE_RECEIVED que ativa o agente apenas para leads do tipo CORRETOR. Defina o filtro de tipo de lead e conecte a acao RUN_AGENT com o ID do seu agente.',
    validation: {
      type: 'contains',
      expected: {
        triggerType: 'MESSAGE_RECEIVED',
        filter: 'leadType',
      },
    },
    solution: {
      triggerType: 'MESSAGE_RECEIVED',
      filters: { leadType: 'CORRETOR' },
      action: 'RUN_AGENT',
    },
    xpReward: 30,
  },
  {
    type: 'quiz',
    quizId: 'ai-publish-q1',
    variant: 'multiple-choice',
    question: 'Qual método de conexão você usaria para ativar um agente APENAS para leads do tipo CORRETOR que enviaram mensagem nas últimas 24h?',
    options: [
      { label: 'Direto no Dispositivo (agente padrão)', value: 'device' },
      { label: 'Via Workflow com filtros de trigger', value: 'workflow' },
      { label: 'Não é possível fazer essa seleção', value: 'impossible' },
      { label: 'Configuração no perfil do lead', value: 'lead-profile' },
    ],
    correctAnswer: 'workflow',
    explanation: 'Via Workflow você pode configurar condições no trigger: tipo do lead = CORRETOR E última mensagem < 24h. Só leads que atendam TODAS as condições ativam o agente. Diretamente no dispositivo, todos os contatos ativariam.',
    xpBonus: 20,
  },
  {
    type: 'callout',
    variant: 'important',
    title: 'Agente Ativo = Custos de IA',
    text: 'Cada mensagem processada pelo agente consome tokens do modelo de IA, o que tem custo. Monitore o uso em Configurações → Uso e Plano para evitar surpresas. Agentes ociosos devem ser desativados.',
  },
];

// ─── Course Export ───────────────────────────────────────────────────────────

export const agentesIACourse: Course = {
  slug: 'agentes-ia',
  titleKey: 'courses.agentesIA.title',
  descriptionKey: 'courses.agentesIA.description',
  durationKey: 'courses.agentesIA.duration',
  available: true,
  track: 'basico',
  audience: 'cliente',
  difficulty: 'intermediario',
  prerequisites: ['primeiros-passos', 'dominando-leads'],
  colorScheme: 'purple',
  totalXP: 200,
  modules: [
    {
      slug: 'fundamentos-agentes',
      titleKey: 'courses.agentesIA.modules.fundamentos.title',
      descriptionKey: 'courses.agentesIA.modules.fundamentos.description',
      badgeSlug: 'ai-explorer',
      lessons: [
        {
          slug: 'o-que-e-agente',
          titleKey: 'courses.agentesIA.modules.fundamentos.lessons.oQueEAgente',
          durationMin: 8,
          interactivity: 'medium',
          xpPoints: 25,
          quizRequired: true,
          contentBlocks: lessonOQueEAgente,
        },
        {
          slug: 'anatomia-do-agente',
          titleKey: 'courses.agentesIA.modules.fundamentos.lessons.anatomiaDoAgente',
          durationMin: 7,
          interactivity: 'medium',
          xpPoints: 20,
          contentBlocks: lessonArquiteturaDoAgente,
        },
      ],
    },
    {
      slug: 'criando-primeiro-agente',
      titleKey: 'courses.agentesIA.modules.criandoPrimeiroAgente.title',
      descriptionKey: 'courses.agentesIA.modules.criandoPrimeiroAgente.description',
      badgeSlug: 'agent-creator',
      lessons: [
        {
          slug: 'formulario-do-agente',
          titleKey: 'courses.agentesIA.modules.criandoPrimeiroAgente.lessons.formulario',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 25,
          contentBlocks: lessonFormularioDoAgente,
        },
        {
          slug: 'escrevendo-system-prompt',
          titleKey: 'courses.agentesIA.modules.criandoPrimeiroAgente.lessons.systemPrompt',
          durationMin: 12,
          interactivity: 'high',
          xpPoints: 35,
          quizRequired: false,
          contentBlocks: lessonEscrevendoSystemPrompt,
        },
        {
          slug: 'templates-de-agentes',
          titleKey: 'courses.agentesIA.modules.criandoPrimeiroAgente.lessons.templates',
          durationMin: 5,
          interactivity: 'high',
          xpPoints: 15,
          contentBlocks: lessonTemplatesDeAgentes,
        },
      ],
    },
    {
      slug: 'ferramentas-do-agente',
      titleKey: 'courses.agentesIA.modules.ferramentasDoAgente.title',
      descriptionKey: 'courses.agentesIA.modules.ferramentasDoAgente.description',
      badgeSlug: 'toolsmith',
      lessons: [
        {
          slug: 'ferramentas-disponiveis',
          titleKey: 'courses.agentesIA.modules.ferramentasDoAgente.lessons.disponiveis',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 20,
          contentBlocks: lessonFerramentasDisponiveis,
        },
        {
          slug: 'configurando-ferramentas',
          titleKey: 'courses.agentesIA.modules.ferramentasDoAgente.lessons.configurando',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 25,
          quizRequired: true,
          contentBlocks: lessonConfigurondoFerramentas,
        },
      ],
    },
    {
      slug: 'testando-e-publicando',
      titleKey: 'courses.agentesIA.modules.testandoEPublicando.title',
      descriptionKey: 'courses.agentesIA.modules.testandoEPublicando.description',
      badgeSlug: 'agent-master',
      lessons: [
        {
          slug: 'testando-agente',
          titleKey: 'courses.agentesIA.modules.testandoEPublicando.lessons.testando',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 15,
          contentBlocks: lessonTestando,
        },
        {
          slug: 'publicando-agente',
          titleKey: 'courses.agentesIA.modules.testandoEPublicando.lessons.publicando',
          durationMin: 6,
          interactivity: 'high',
          xpPoints: 20,
          quizRequired: true,
          contentBlocks: lessonPublicando,
        },
      ],
    },
  ],
};

export default agentesIACourse;
