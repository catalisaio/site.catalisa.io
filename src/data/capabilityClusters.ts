export interface CapabilityCluster {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
  icon: string;
  outcomes: string[];
}

export const capabilityClusters: CapabilityCluster[] = [
  {
    id: 'ai',
    name: 'Inteligencia Artificial',
    description: 'Agentes autonomos com processamento de linguagem natural, visao computacional e analise preditiva.',
    count: 10,
    color: 'purple',
    icon: 'FiCpu',
    outcomes: [
      'Agentes autonomos que conversam e executam tarefas',
      'Geracao e sumarizacao de texto',
      'Visao computacional e OCR',
      'Transcricao de audio em tempo real',
      'Analise de sentimento e urgencia',
      'Classificacao e categorizacao automatica',
      'Traducao multi-idioma',
      'Extracao inteligente de dados',
    ],
  },
  {
    id: 'whatsapp',
    name: 'Comunicacao WhatsApp',
    description: 'Mensagens, midias, grupos e interacoes bidirecionais no WhatsApp.',
    count: 6,
    color: 'green',
    icon: 'FiMessageCircle',
    outcomes: [
      'Envio de mensagens e midias',
      'Conversas bidirecionais com espera de resposta',
      'Criacao e gestao de grupos',
      'Reacoes e interacoes',
      'Templates de mensagem',
    ],
  },
  {
    id: 'crm',
    name: 'Gestao de Clientes',
    description: 'Leads, clientes, campos personalizados e pipeline completo.',
    count: 7,
    color: 'orange',
    icon: 'FiUsers',
    outcomes: [
      'Criacao e gestao de leads',
      'Cadastro de clientes',
      'Campos personalizados por tipo',
      'Pipeline de qualificacao',
      'Historico completo de interacoes',
      'Busca e filtragem avancada',
    ],
  },
  {
    id: 'financial',
    name: 'Motor Financeiro',
    description: 'Simulacao, precificacao, custos regulatorios e motor de decisao para produtos financeiros.',
    count: 10,
    color: 'yellow',
    icon: 'FiDollarSign',
    outcomes: [
      'Simulacao de parcelas (PRICE/SAC)',
      'Custos regulatorios automaticos',
      'Precificacao baseada em perfil de risco',
      'Motor de decisao configuravel',
      'Tabela de amortizacao',
      'Gestao de produtos financeiros',
      'Validacao de dados',
      'Faixas de risco e scoring',
    ],
  },
  {
    id: 'security',
    name: 'Seguranca e Compliance',
    description: 'Mascaramento LGPD, criptografia, assinatura digital e auditoria.',
    count: 6,
    color: 'red',
    icon: 'FiShield',
    outcomes: [
      'Mascaramento automatico LGPD',
      'Criptografia de dados sensiveis',
      'Assinatura digital',
      'Trilha de auditoria',
      'Verificacao de integridade',
    ],
  },
  {
    id: 'integration',
    name: 'Integracoes e APIs',
    description: 'Conecte sistemas externos via HTTP, webhooks, email e links de captura.',
    count: 7,
    color: 'cyan',
    icon: 'FiGlobe',
    outcomes: [
      'Requisicoes HTTP/REST para qualquer API',
      'Webhooks bidirecionais',
      'Envio de email',
      'Links de captura de leads',
      'Monitoramento e logs',
    ],
  },
  {
    id: 'orchestration',
    name: 'Orquestracao de Fluxos',
    description: 'Logica condicional, horario comercial, teste A/B, temporizadores e iteracao.',
    count: 5,
    color: 'blue',
    icon: 'FiGitBranch',
    outcomes: [
      'Logica condicional (if/else)',
      'Respeito a horario comercial',
      'Teste A/B nativo',
      'Temporizadores e delays',
      'Iteracao sobre listas',
    ],
  },
  {
    id: 'data',
    name: 'Processamento de Dados',
    description: 'Extracao, transformacao, templates e pattern matching para dados estruturados.',
    count: 4,
    color: 'teal',
    icon: 'FiDatabase',
    outcomes: [
      'Extracao estruturada de dados',
      'Transformacao e normalizacao',
      'Templates de extracao',
      'Pattern matching avancado',
    ],
  },
  {
    id: 'documents',
    name: 'Documentos e Arquivos',
    description: 'Upload seguro, processamento, download e retencao de documentos.',
    count: 4,
    color: 'pink',
    icon: 'FiFileText',
    outcomes: [
      'Upload seguro de arquivos',
      'Processamento de documentos',
      'Download com URLs temporarias',
      'Politicas de retencao',
    ],
  },
  {
    id: 'calendar',
    name: 'Agenda e Calendario',
    description: 'Busca de horarios, agendamento, integracao com Outlook/Teams e lembretes.',
    count: 4,
    color: 'linkedin',
    icon: 'FiCalendar',
    outcomes: [
      'Busca de horarios disponiveis',
      'Agendamento automatico',
      'Integracao Outlook/Teams',
      'Lembretes automaticos',
    ],
  },
];

// Platform extras (absorbed in total): extensibility, events, custom actions, debug, device status
// Total: 10 + 6 + 7 + 10 + 6 + 7 + 5 + 4 + 4 + 4 + 5(platform) = 68 + 5 = 73

export const categoryBadges: Record<string, { label: string; color: string }> = {
  IA: { label: 'IA', color: 'purple' },
  WhatsApp: { label: 'WhatsApp', color: 'green' },
  CRM: { label: 'CRM', color: 'orange' },
  Financeiro: { label: 'Financeiro', color: 'yellow' },
  Seguranca: { label: 'Seguranca', color: 'red' },
  Integracao: { label: 'Integracao', color: 'cyan' },
  Logica: { label: 'Logica', color: 'blue' },
  Dados: { label: 'Dados', color: 'teal' },
  Documentos: { label: 'Documentos', color: 'pink' },
  Agenda: { label: 'Agenda', color: 'linkedin' },
  Workflow: { label: 'Workflow', color: 'blue' },
  Trigger: { label: 'Trigger', color: 'gray' },
};

export const businessRecipes = [
  {
    title: 'Originacao de Credito',
    description: 'Do primeiro contato a aprovacao sem sair do WhatsApp.',
    steps: [
      { category: 'IA', label: 'Analisa documentos' },
      { category: 'Financeiro', label: 'Simula parcelas' },
      { category: 'Financeiro', label: 'Calcula custos regulatorios' },
      { category: 'WhatsApp', label: 'Notifica resultado' },
    ],
  },
  {
    title: 'Atendimento Inteligente',
    description: 'Suporte 24/7 com escalonamento por sentimento e urgencia.',
    steps: [
      { category: 'IA', label: 'Detecta urgencia' },
      { category: 'Logica', label: 'Prioriza atendimento' },
      { category: 'IA', label: 'Agente resolve' },
      { category: 'CRM', label: 'Registra interacao' },
    ],
  },
  {
    title: 'Onboarding Digital',
    description: 'KYC completo pelo WhatsApp com OCR e validacao automatica.',
    steps: [
      { category: 'WhatsApp', label: 'Coleta documentos' },
      { category: 'IA', label: 'Processa imagens' },
      { category: 'Seguranca', label: 'Protege dados sensiveis' },
      { category: 'CRM', label: 'Cadastra cliente' },
    ],
  },
  {
    title: 'Campanha Personalizada',
    description: 'Mensagens segmentadas com IA, respeitando horario comercial.',
    steps: [
      { category: 'Logica', label: 'Itera lista de contatos' },
      { category: 'Logica', label: 'Verifica horario comercial' },
      { category: 'IA', label: 'Personaliza mensagem' },
      { category: 'WhatsApp', label: 'Envia campanha' },
    ],
  },
  {
    title: 'Agendamento Automatico',
    description: 'Agente IA encontra horarios e agenda reunioes pelo WhatsApp.',
    steps: [
      { category: 'IA', label: 'Entende necessidade' },
      { category: 'Agenda', label: 'Busca disponibilidade' },
      { category: 'Agenda', label: 'Confirma horario' },
      { category: 'WhatsApp', label: 'Envia confirmacao' },
    ],
  },
];

export const totalCapabilities = capabilityClusters.reduce((sum, c) => sum + c.count, 0) + 5; // +5 platform
