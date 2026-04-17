import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

// ─── Module 1: Lead Types e Campos ──────────────────────────────────────────

const lessonLeadTypes: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Lead Types: Organizando por Categoria',
    level: 'h2',
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'LeadType', highlighted: false },
      { label: 'Uso Típico', highlighted: false },
      { label: 'Campos Personalizados Comuns', highlighted: true },
    ],
    rows: [
      {
        feature: 'CORRETOR',
        values: ['Corretores de imóveis parceiros', 'CRECI, Imobiliária, Região de atuação'],
      },
      {
        feature: 'CLIENTE_FINAL',
        values: ['Compradores ou locatários', 'CPF, Renda, Tipo de imóvel desejado'],
      },
      {
        feature: 'PARCEIRO',
        values: ['Empresas e indicadores', 'CNPJ, Representante, Volume mensal'],
      },
      {
        feature: 'PROSPECT',
        values: ['Leads não qualificados', 'Origem, Interesse inicial'],
      },
    ],
  },
  {
    type: 'callout',
    variant: 'important',
    title: 'Nome do Tipo é Tudo',
    text: 'Nos workflows e agentes IA, você referencia leads pelo NOME do tipo (ex: "CORRETOR"), nunca pelo ID interno. Isso é crucial quando configurar automações mais tarde.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Acesse Configurações → Lead Types',
        description: 'No menu, vá em Configurações > Tipos de Lead. Você verá todos os tipos criados na sua conta.',
      },
      {
        title: 'Crie um novo tipo',
        description: 'Clique em "+ Novo Tipo". Dê um nome em MAIÚSCULAS (convenção da plataforma, ex: CORRETOR). O slug é gerado automaticamente.',
      },
      {
        title: 'Adicione campos personalizados',
        description: 'Cada tipo pode ter campos únicos: texto, número, seleção, data, booleano. Defina os campos relevantes para esse tipo de contato.',
      },
      {
        title: 'Defina campos obrigatórios',
        description: 'Marque campos como "obrigatório" para garantir que sua equipe preencha as informações críticas ao cadastrar um lead desse tipo.',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'trigger-config',
    instructions: 'Configure um trigger para o evento LEAD_CREATED filtrando apenas leads do tipo CORRETOR. Defina o campo "leadType" como condição do filtro.',
    validation: {
      type: 'contains',
      expected: { event: 'LEAD_CREATED', leadType: 'CORRETOR' },
    },
    xpReward: 20,
  },
  {
    type: 'quiz',
    quizId: 'dl-types-q1',
    variant: 'multiple-choice',
    question: 'Como os workflows e agentes referenciam um Lead Type?',
    options: [
      { label: 'Pelo ID interno (ex: cjld2cyuq000021me4bh4b4ar)', value: 'id' },
      { label: 'Pelo nome em maiúsculas (ex: CORRETOR)', value: 'name' },
      { label: 'Pelo número sequencial', value: 'number' },
      { label: 'Pelo slug lowercase (ex: corretor)', value: 'slug' },
    ],
    correctAnswer: 'name',
    explanation: 'Sempre use o NOME do tipo em maiúsculas (ex: "CORRETOR") ao configurar filtros em workflows e ferramentas de agentes. Usar o ID interno pode quebrar automações se os dados forem migrados.',
    xpBonus: 15,
  },
];

const lessonCamposPersonalizados: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Campos Personalizados: Dados que Importam',
    level: 'h2',
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'Quando usar campo do tipo "Texto"?',
        answer: 'Para informações livres como observações, endereço completo, nome da empresa. Suporta até 5.000 caracteres. Use quando o dado não tem formato fixo.',
      },
      {
        question: 'Quando usar campo do tipo "Seleção" (Select)?',
        answer: 'Para dados com valores pré-definidos: status, categoria, região. Facilita filtros e relatórios pois os valores são padronizados. Ex: Região = ["Norte", "Sul", "Centro"].',
      },
      {
        question: 'Quando usar campo "Booleano" (Sim/Não)?',
        answer: 'Para flags rápidas: "Cliente VIP?", "Aceita contato por telefone?", "Documentação enviada?". São ótimos para criar condicionais em workflows.',
      },
      {
        question: 'Posso usar campos personalizados nos Agentes IA?',
        answer: 'Sim! Os agentes têm acesso a todos os campos do lead via ferramentas como get_lead e update_lead. Um agente pode perguntar "qual seu CRECI?" e salvar o valor automaticamente.',
      },
      {
        question: 'É possível alterar o tipo de um campo depois de criado?',
        answer: 'Não é recomendado. Mudar o tipo de "Texto" para "Número" depois que já existem dados pode causar inconsistências. Planeje os campos antes de começar a usar em produção.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'leads-table',
    interactionSteps: [
      {
        targetId: 'column-type',
        instruction: 'Observe a coluna "CRECI" — um campo personalizado do tipo CORRETOR.',
        position: 'bottom',
      },
      {
        targetId: 'column-status',
        instruction: 'Esta coluna "Status" é um campo de seleção com valores pré-definidos.',
        position: 'bottom',
      },
      {
        targetId: 'btn-filter',
        instruction: 'Clique em "Filtrar" para ver como os campos personalizados aparecem nos filtros.',
        position: 'left',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'agent-config',
    instructions: 'Crie um campo personalizado do tipo "Seleção" chamado "Segmento" com os valores: Residencial, Comercial, Industrial. Depois verifique como ele aparece no formulário de lead.',
    validation: {
      type: 'contains',
      expected: { fieldType: 'select', fieldName: 'Segmento' },
    },
    xpReward: 20,
  },
];

const lessonImportacao: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Importando Leads em Massa',
    level: 'h2',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Prepare sua planilha CSV',
        description: 'O arquivo deve ter cabeçalhos na primeira linha. Colunas essenciais: name, phone. Opcionais: email, type, e seus campos personalizados.',
      },
      {
        title: 'Acesse Leads → Importar',
        description: 'Clique no botão "Importar" (ícone de upload) no topo da lista de leads.',
      },
      {
        title: 'Faça o upload do arquivo',
        description: 'Arraste o CSV ou clique para selecionar. O sistema vai pré-visualizar as primeiras 5 linhas.',
      },
      {
        title: 'Mapeie as colunas',
        description: 'Relacione cada coluna do seu CSV a um campo da Catalisa. Campos não mapeados são ignorados.',
      },
      {
        title: 'Escolha o LeadType',
        description: 'Selecione qual tipo de lead será atribuído a todos os registros importados. Você pode fazer múltiplas importações para tipos diferentes.',
      },
      {
        title: 'Confirme e aguarde',
        description: 'A importação roda em background. Você receberá uma notificação quando terminar com o resumo: criados, atualizados, erros.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'leads-table',
    interactionSteps: [
      {
        targetId: 'btn-add-lead',
        instruction: 'Clique no botão "+" para ver as opções de criação, incluindo "Importar CSV".',
        position: 'bottom',
      },
      {
        targetId: 'search-leads',
        instruction: 'Após importar, use a busca para verificar se os leads foram criados corretamente.',
        position: 'bottom',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Formato do Telefone',
    text: 'O telefone deve estar no formato internacional: +55 11 99999-0000 ou 5511999990000. Números sem DDI falharão na importação.',
  },
  {
    type: 'sandbox',
    variant: 'webhook-config',
    instructions: 'Monte o payload JSON de uma importação em massa com 3 leads do tipo CORRETOR. Cada lead precisa de: name, phone (formato internacional) e o campo personalizado "CRECI".',
    validation: {
      type: 'contains',
      expected: { type: 'CORRETOR', count: 3 },
    },
    xpReward: 25,
  },
];

// ─── Module 2: Gestão de Leads ───────────────────────────────────────────────

const lessonVisualizacoes: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Visualizações: Tabela vs Kanban',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Alterne entre Tabela (filtros detalhados) e Kanban (pipeline visual) conforme sua necessidade.',
  },
  {
    type: 'mockui',
    variant: 'leads-table',
    interactionSteps: [
      {
        targetId: 'btn-view-toggle',
        instruction: 'Clique no ícone de Kanban para alternar a visualização.',
        position: 'bottom',
      },
      {
        targetId: 'column-name',
        instruction: 'Na visão tabela, clique no cabeçalho "Nome" para ordenar os leads.',
        position: 'bottom',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'leads-kanban',
    interactionSteps: [
      {
        targetId: 'kanban-card-drag',
        instruction: 'Arraste um cartão de lead de uma coluna para outra para mudar o status.',
        position: 'right',
      },
      {
        targetId: 'btn-add-column',
        instruction: 'Clique em "+ Coluna" para adicionar um novo estágio ao seu pipeline.',
        position: 'bottom',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'trigger-config',
    instructions: 'Configure um trigger LEAD_UPDATED que dispara quando o status do lead muda para "Qualificado". Defina o campo de filtro como "status" com operador "equals" e valor "Qualificado".',
    validation: {
      type: 'contains',
      expected: { event: 'LEAD_UPDATED', status: 'Qualificado' },
    },
    xpReward: 20,
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Critério', highlighted: false },
      { label: 'Visão Tabela', highlighted: false },
      { label: 'Visão Kanban', highlighted: true },
    ],
    rows: [
      { feature: 'Melhor para', values: ['Análise, busca e filtros', 'Acompanhar pipeline de vendas'] },
      { feature: 'Quantidade de leads', values: ['Centenas ou milhares', 'Dezenas por estágio'] },
      { feature: 'Ação rápida', values: ['Editar dados em bulk', 'Mover entre estágios'] },
      { feature: 'Exportar dados', values: ['Sim (CSV/Excel)', 'Não diretamente'] },
      { feature: 'Visibilidade de campos', values: ['Todas as colunas configuráveis', 'Dados resumidos no cartão'] },
    ],
  },
  {
    type: 'quiz',
    quizId: 'dl-views-q1',
    variant: 'drag-drop',
    question: 'Arraste cada cenário para a visualização mais adequada:',
    items: [
      'Verificar quais leads estão na fase "Proposta Enviada"',
      'Buscar todos os corretores de SP com CRECI ativo',
      'Exportar lista de leads para relatório mensal',
      'Mover lead de "Negociando" para "Fechado"',
    ],
    categories: [
      {
        name: 'Tabela',
        correctItems: [
          'Buscar todos os corretores de SP com CRECI ativo',
          'Exportar lista de leads para relatório mensal',
        ],
      },
      {
        name: 'Kanban',
        correctItems: [
          'Verificar quais leads estão na fase "Proposta Enviada"',
          'Mover lead de "Negociando" para "Fechado"',
        ],
      },
    ],
    explanation: 'A tabela é ideal para busca, filtros e exportação. O Kanban brilha para acompanhar estágios do pipeline e mover leads visualmente.',
    xpBonus: 20,
  },
];

const lessonFiltrosEBusca: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Filtros Avançados e Busca',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Combine critérios para segmentar leads e salve filtros como segmentos reutilizáveis.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Use a busca rápida',
        description: 'A barra de busca no topo filtra por nome, telefone ou e-mail em tempo real. Ideal para encontrar um lead específico.',
      },
      {
        title: 'Acesse filtros avançados',
        description: 'Clique em "Filtros" (ícone de funil) para abrir o painel de filtros avançados. Você pode combinar até 10 condições.',
      },
      {
        title: 'Combine condições com E/OU',
        description: 'Use "E" (AND) para restringir: tipo=CORRETOR E estado=SP. Use "OU" (OR) para ampliar: status=Ativo OU status=Follow-up.',
      },
      {
        title: 'Salve filtros como segmentos',
        description: 'Clique em "Salvar como Segmento" para reusar o filtro depois. Segmentos salvos aparecem no menu lateral para acesso rápido.',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Segmentos em Workflows',
    text: 'Segmentos salvos podem ser usados como condições em workflows! Ex: "Se o lead pertence ao segmento Corretores VIP, envie mensagem especial". Isso evita recriar filtros complexos.',
  },
  {
    type: 'interactive-demo',
    title: 'Exercício: Criando Segmentos',
    scenarios: [
      {
        id: 'create-segment',
        label: 'Segmento: Corretores Ativos SP',
        description: 'Crie um segmento de leads com tipo CORRETOR, estado SP e status Ativo.',
        steps: [
          {
            instruction: 'Clique no botão "Filtros" na barra de ferramentas.',
            action: 'open-filters',
            feedback: 'Painel de filtros aberto. Você pode adicionar condições aqui.',
          },
          {
            instruction: 'Adicione condição: Tipo = CORRETOR.',
            action: 'add-filter-type',
            feedback: 'Filtro por tipo aplicado. A lista já reduziu.',
          },
          {
            instruction: 'Adicione condição: Estado = SP.',
            action: 'add-filter-state',
            feedback: 'Combinando dois filtros com AND. Apenas corretores de SP aparecem.',
          },
          {
            instruction: 'Clique em "Salvar Segmento" e nomeie como "Corretores Ativos SP".',
            action: 'save-segment',
            feedback: 'Segmento salvo! Aparecerá no menu lateral para acesso rápido.',
          },
        ],
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'variable-interpolation',
    instructions: 'Escreva uma expressão de interpolação que acesse o campo personalizado "estado" de um lead retornado por uma ação anterior chamada "buscarLead". Use a sintaxe {{actions.buscarLead.output.customFields.estado}}.',
    validation: {
      type: 'contains',
      expected: { expression: '{{actions.buscarLead.output.customFields.estado}}' },
    },
    xpReward: 20,
  },
];

const lessonPerfilDoLead: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Perfil Completo do Lead',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'O perfil centraliza conversas, atividades, anotações e interações de cada lead.',
  },
  {
    type: 'mockui',
    variant: 'leads-table',
    interactionSteps: [
      {
        targetId: 'lead-row-1',
        instruction: 'Clique em qualquer lead da lista para abrir o perfil completo.',
        position: 'right',
      },
    ],
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'O que é a Timeline do Lead?',
        answer: 'A timeline mostra cronologicamente todas as interações: mensagens enviadas e recebidas, alterações de campos, execuções de workflow, notas adicionadas pela equipe. É o histórico completo do relacionamento.',
      },
      {
        question: 'Posso adicionar notas manualmente?',
        answer: 'Sim! Na aba "Notas" do perfil você pode adicionar anotações livres que ficam registradas na timeline. Útil para documentar ligações, reuniões e observações importantes.',
      },
      {
        question: 'Como disparar um workflow manualmente para um lead?',
        answer: 'No perfil do lead, clique em "Ações" → "Executar Workflow". Selecione o workflow desejado e ele será executado imediatamente para aquele lead específico.',
      },
      {
        question: 'Posso ver as mensagens WhatsApp no perfil?',
        answer: 'Sim! A aba "Conversas" mostra o histórico completo de mensagens trocadas pelo WhatsApp, incluindo as respostas geradas pelos agentes IA.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'whatsapp-chat',
    interactionSteps: [
      {
        targetId: 'lead-row-1',
        instruction: 'Veja o histórico de conversas WhatsApp diretamente no perfil do lead.',
        position: 'right',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'variable-interpolation',
    instructions: 'Escreva a expressão de interpolação para acessar o nome e o telefone de um lead dentro de um workflow. Use {{lead.name}} para o nome e {{lead.phone}} para o telefone.',
    validation: {
      type: 'contains',
      expected: { name: '{{lead.name}}', phone: '{{lead.phone}}' },
    },
    xpReward: 15,
  },
  {
    type: 'callout',
    variant: 'tip',
    title: 'Contexto para Agentes IA',
    text: 'Quanto mais completo o perfil do lead, mais personalizado será o atendimento dos agentes IA. Campos preenchidos = contexto rico = respostas mais relevantes.',
  },
];

// ─── Module 3: Organização Avançada ─────────────────────────────────────────

const lessonTagsEStatus: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Tags, Status e Organização por Pipeline',
    level: 'h2',
  },
  {
    type: 'mockui',
    variant: 'leads-table',
    interactionSteps: [
      {
        targetId: 'lead-row-1',
        instruction: 'Observe as tags coloridas ao lado do nome do lead — cada cor representa uma categoria diferente.',
        position: 'right',
      },
      {
        targetId: 'column-status',
        instruction: 'A coluna "Status" mostra o estágio atual do lead no pipeline.',
        position: 'bottom',
      },
      {
        targetId: 'btn-filter',
        instruction: 'Clique em "Filtros" para filtrar por tags ou status específicos.',
        position: 'left',
      },
    ],
  },
  {
    type: 'accordion-faq',
    items: [
      {
        question: 'Qual a diferença entre Tags e Status?',
        answer: 'Tags são rótulos livres e acumulativos (um lead pode ter várias). Status é exclusivo e representa o estágio atual no pipeline (ex: "Novo", "Qualificado", "Proposta"). Ambos podem ser alterados por workflows e agentes.',
      },
      {
        question: 'Quando usar Tags vs Campos Personalizados?',
        answer: 'Tags servem para classificações rápidas e temporárias ("VIP", "Urgente", "Evento-2025"). Campos personalizados são para dados estruturados e permanentes (CRECI, Renda, Segmento).',
      },
      {
        question: 'Workflows podem alterar tags e status automaticamente?',
        answer: 'Sim! Use ações UPDATE_LEAD no workflow para adicionar tags ou mudar status. Ex: quando um lead responder pela primeira vez, mude status de "Novo" para "Engajado".',
      },
    ],
  },
  {
    type: 'comparison-table',
    columns: [
      { label: 'Recurso', highlighted: false },
      { label: 'O que é', highlighted: false },
      { label: 'Exemplo', highlighted: false },
      { label: 'Quem pode alterar', highlighted: true },
    ],
    rows: [
      {
        feature: 'Tags',
        values: ['Rótulos livres, múltiplos por lead', '"VIP", "Urgente", "Evento-2025"', 'Equipe + Workflows + Agentes'],
      },
      {
        feature: 'Status',
        values: ['Estágio atual no pipeline', '"Novo", "Qualificado", "Proposta"', 'Equipe + Workflows + Agentes'],
      },
      {
        feature: 'Campos personalizados',
        values: ['Dados estruturados do tipo', 'CRECI, Renda, Segmento', 'Equipe + Agentes (com ferramenta)'],
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'leads-kanban',
    interactionSteps: [
      {
        targetId: 'kanban-novo',
        instruction: 'Leads novos chegam nesta coluna. O status "Novo" é atribuído automaticamente.',
        position: 'bottom',
      },
      {
        targetId: 'kanban-qualificado',
        instruction: 'Arraste um lead para "Qualificado" quando ele atender seus critérios de qualificação.',
        position: 'bottom',
      },
      {
        targetId: 'kanban-card-drag',
        instruction: 'Arrastar o cartão entre colunas atualiza o status automaticamente.',
        position: 'right',
      },
    ],
  },
  {
    type: 'callout',
    variant: 'pro-tip',
    title: 'Automação de Status',
    text: 'Configure workflows para atualizar o status automaticamente. Ex: quando um lead responder pela primeira vez → mudar status de "Novo" para "Engajado".',
  },
  {
    type: 'interactive-demo',
    title: 'Demo: Tag Automática por Workflow',
    scenarios: [
      {
        id: 'auto-tag',
        label: 'Tag Automática',
        description: 'Veja como um workflow pode adicionar tags automaticamente baseado no comportamento do lead.',
        steps: [
          {
            instruction: 'Um lead respondeu mais de 3 mensagens em 24h.',
            action: 'simulate-engagement',
            feedback: 'Evento de engajamento detectado pelo workflow "Monitor de Interesse".',
          },
          {
            instruction: 'O workflow adicionou a tag "Alto Engajamento" ao lead.',
            action: 'show-tag-added',
            feedback: 'Tag aplicada! O lead agora aparece no segmento "Alto Engajamento" para ação prioritária.',
          },
          {
            instruction: 'A equipe de vendas recebeu uma notificação sobre esse lead.',
            action: 'show-notification',
            feedback: 'Notificação enviada: "João Silva está muito engajado — hora de ligar!"',
          },
        ],
      },
    ],
  },
  {
    type: 'quiz',
    quizId: 'dl-tags-q1',
    variant: 'multiple-choice',
    question: 'Qual recurso permite classificar um lead com múltiplos rótulos simultaneamente, sem sobrescrever informações anteriores?',
    options: [
      { label: 'Status (pipeline stage)', value: 'status' },
      { label: 'Campos de seleção única', value: 'select' },
      { label: 'Tags', value: 'tags' },
      { label: 'Lead Type', value: 'type' },
    ],
    correctAnswer: 'tags',
    explanation: 'Tags são acumulativas: um lead pode ter "VIP", "Urgente" e "Evento-2025" ao mesmo tempo. Status é exclusivo (um lead só tem um status por vez). Tags são ideais para múltiplas classificações simultâneas.',
    xpBonus: 15,
  },
];

const lessonRelatoriosEExportacao: ContentBlock[] = [
  {
    type: 'heading',
    text: 'Relatórios e Exportação de Dados',
    level: 'h2',
  },
  {
    type: 'paragraph',
    text: 'Extraia insights com relatórios integrados e exporte dados para análises externas.',
  },
  {
    type: 'step-by-step',
    steps: [
      {
        title: 'Acesse Relatórios → Leads',
        description: 'O painel de relatórios mostra gráficos de leads criados por período, distribuição por tipo e evolução do pipeline.',
      },
      {
        title: 'Configure o período de análise',
        description: 'Selecione: últimos 7 dias, 30 dias, 90 dias ou período personalizado. Os gráficos atualizam automaticamente.',
      },
      {
        title: 'Exporte para CSV ou Excel',
        description: 'Na lista de leads (com filtros aplicados), clique em "Exportar". Escolha o formato e os campos que deseja incluir.',
      },
      {
        title: 'Conecte com BI externo via API',
        description: 'Para análises avançadas, use a API da Catalisa (documentação em Settings → API Keys) para puxar dados para Power BI, Metabase ou Google Sheets.',
      },
    ],
  },
  {
    type: 'mockui',
    variant: 'dashboard',
    interactionSteps: [
      {
        targetId: 'lead-row-1',
        instruction: 'O dashboard mostra a distribuição de leads por tipo e a evolução do pipeline ao longo do tempo.',
        position: 'bottom',
      },
    ],
  },
  {
    type: 'sandbox',
    variant: 'variable-interpolation',
    instructions: 'Configure os filtros abaixo para criar um relatório de leads do último mês, tipo CORRETOR, segmentado por estado. Depois exporte para CSV e verifique os campos.',
    validation: {
      type: 'contains',
      expected: { period: '30d', type: 'CORRETOR' },
    },
    xpReward: 25,
  },
  {
    type: 'quiz',
    quizId: 'dl-reports-q1',
    variant: 'fill-blank',
    question: 'Complete a frase sobre exportação de dados:',
    template: 'Para exportar leads com filtros aplicados, clique no botão "{{blank1}}" na tela de leads. O arquivo é gerado no formato {{blank2}} para compatibilidade com Excel e Google Sheets.',
    blanks: [
      { id: 'blank1', correctValues: ['Exportar', 'exportar', 'Export'] },
      { id: 'blank2', correctValues: ['CSV', 'csv'] },
    ],
    explanation: 'O botão "Exportar" respeita todos os filtros ativos, então você exporta exatamente o subconjunto de leads que está visualizando. O formato CSV é universal e compatível com qualquer planilha.',
    xpBonus: 15,
  },
];

// ─── Course Export ───────────────────────────────────────────────────────────

export const dominandoLeadsCourse: Course = {
  slug: 'dominando-leads',
  titleKey: 'courses.dominandoLeads.title',
  descriptionKey: 'courses.dominandoLeads.description',
  durationKey: 'courses.dominandoLeads.duration',
  available: true,
  track: 'basico',
  audience: 'cliente',
  difficulty: 'iniciante',
  prerequisites: ['primeiros-passos'],
  colorScheme: 'blue',
  totalXP: 150,
  modules: [
    {
      slug: 'lead-types-e-campos',
      titleKey: 'courses.dominandoLeads.modules.leadTypesECampos.title',
      descriptionKey: 'courses.dominandoLeads.modules.leadTypesECampos.description',
      badgeSlug: 'crm-starter',
      lessons: [
        {
          slug: 'lead-types',
          titleKey: 'courses.dominandoLeads.modules.leadTypesECampos.lessons.leadTypes',
          durationMin: 7,
          interactivity: 'medium',
          xpPoints: 25,
          quizRequired: true,
          contentBlocks: lessonLeadTypes,
        },
        {
          slug: 'campos-personalizados',
          titleKey: 'courses.dominandoLeads.modules.leadTypesECampos.lessons.camposPersonalizados',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 25,
          contentBlocks: lessonCamposPersonalizados,
        },
        {
          slug: 'importacao-em-massa',
          titleKey: 'courses.dominandoLeads.modules.leadTypesECampos.lessons.importacao',
          durationMin: 8,
          interactivity: 'medium',
          xpPoints: 20,
          contentBlocks: lessonImportacao,
        },
      ],
    },
    {
      slug: 'gestao-de-leads',
      titleKey: 'courses.dominandoLeads.modules.gestaoDeLeads.title',
      descriptionKey: 'courses.dominandoLeads.modules.gestaoDeLeads.description',
      badgeSlug: 'lead-manager',
      lessons: [
        {
          slug: 'visualizacoes-tabela-kanban',
          titleKey: 'courses.dominandoLeads.modules.gestaoDeLeads.lessons.visualizacoes',
          durationMin: 7,
          interactivity: 'high',
          xpPoints: 25,
          quizRequired: true,
          contentBlocks: lessonVisualizacoes,
        },
        {
          slug: 'filtros-e-busca',
          titleKey: 'courses.dominandoLeads.modules.gestaoDeLeads.lessons.filtrosEBusca',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 20,
          contentBlocks: lessonFiltrosEBusca,
        },
        {
          slug: 'perfil-do-lead',
          titleKey: 'courses.dominandoLeads.modules.gestaoDeLeads.lessons.perfilDoLead',
          durationMin: 7,
          interactivity: 'medium',
          xpPoints: 15,
          contentBlocks: lessonPerfilDoLead,
        },
      ],
    },
    {
      slug: 'organizacao-avancada',
      titleKey: 'courses.dominandoLeads.modules.organizacaoAvancada.title',
      descriptionKey: 'courses.dominandoLeads.modules.organizacaoAvancada.description',
      badgeSlug: 'lead-expert',
      lessons: [
        {
          slug: 'tags-e-status',
          titleKey: 'courses.dominandoLeads.modules.organizacaoAvancada.lessons.tagsEStatus',
          durationMin: 7,
          interactivity: 'high',
          xpPoints: 10,
          quizRequired: true,
          contentBlocks: lessonTagsEStatus,
        },
        {
          slug: 'relatorios-e-exportacao',
          titleKey: 'courses.dominandoLeads.modules.organizacaoAvancada.lessons.relatoriosEExportacao',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 10,
          quizRequired: true,
          contentBlocks: lessonRelatoriosEExportacao,
        },
      ],
    },
  ],
};

export default dominandoLeadsCourse;
