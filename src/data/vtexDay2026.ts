export const EVENT = {
  startDate: '2026-04-16',
  endDate: '2026-04-17',
  venue: 'São Paulo Expo',
  city: 'São Paulo, BR',
  tagline: 'Protagonists of a New Era',
  concept: 'Cidade da Inovação',
  visitors: '+25 mil',
  speakers: '+350',
  brands: '+8 mil',
  countries: '25',
  sessions: '158',
  boothLabel: '#XX',
  officialSite: 'https://vtexday.vtex.com',
} as const;

export const CATALISA_WHATSAPP =
  'https://wa.me/5511977303414?text=Oi%21%20Vim%20do%20hotsite%20VTEX%20Day%202026%20e%20quero%20saber%20mais.';

export interface VtexAction {
  slug: string;
  label: string;
  short: string;
  category: VtexCategoryKey;
  featured?: boolean;
}

export type VtexCategoryKey =
  | 'catalog'
  | 'oms'
  | 'customers'
  | 'checkout'
  | 'pricing'
  | 'logistics'
  | 'promotions';

export interface VtexCategory {
  key: VtexCategoryKey;
  label: string;
  tagline: string;
  icon: 'package' | 'shoppingCart' | 'users' | 'creditCard' | 'barChart' | 'truck' | 'tag';
}

export const CATEGORIES: VtexCategory[] = [
  { key: 'catalog', label: 'Catálogo', tagline: 'Produtos, SKUs, categorias e marcas em tempo real', icon: 'package' },
  { key: 'oms', label: 'Pedidos (OMS)', tagline: 'Ciclo de vida completo: consulta, faturamento, rastreio, cancelamento', icon: 'shoppingCart' },
  { key: 'customers', label: 'Clientes', tagline: 'Busca, criação e enriquecimento no Master Data', icon: 'users' },
  { key: 'checkout', label: 'Checkout', tagline: 'Carrinho, itens e simulação de frete por CEP', icon: 'creditCard' },
  { key: 'pricing', label: 'Preço & Estoque', tagline: 'Preço por SKU e posição por depósito', icon: 'barChart' },
  { key: 'logistics', label: 'Logística', tagline: 'Depósitos e docas de expedição', icon: 'truck' },
  { key: 'promotions', label: 'Promoções', tagline: 'Campanhas ativas do Rules & Benefits', icon: 'tag' },
];

export const VTEX_ACTIONS: VtexAction[] = [
  { slug: 'catalog-search-products', label: 'Buscar produtos', short: 'Intelligent Search por termo', category: 'catalog', featured: true },
  { slug: 'catalog-get-product', label: 'Detalhe do produto', short: 'Dados completos por RefId', category: 'catalog' },
  { slug: 'catalog-get-sku', label: 'Detalhe do SKU', short: 'Specs e mídia do SKU', category: 'catalog' },
  { slug: 'catalog-list-categories', label: 'Árvore de categorias', short: 'Até 3 níveis por padrão', category: 'catalog' },
  { slug: 'catalog-list-brands', label: 'Listar marcas', short: 'Todas as marcas ativas', category: 'catalog' },

  { slug: 'oms-list-orders', label: 'Listar pedidos', short: 'Filtros por status e data', category: 'oms', featured: true },
  { slug: 'oms-get-order', label: 'Pedido completo', short: 'Itens, cliente, entrega, pagamento', category: 'oms', featured: true },
  { slug: 'oms-cancel-order', label: 'Cancelar pedido', short: 'Com motivo e regra de status', category: 'oms' },
  { slug: 'oms-invoice-order', label: 'Faturar pedido', short: 'Registra NF e avança status', category: 'oms' },
  { slug: 'oms-update-tracking', label: 'Atualizar rastreio', short: 'Transportadora e código', category: 'oms' },
  { slug: 'oms-start-handling', label: 'Iniciar separação', short: 'Transita para handling', category: 'oms' },
  { slug: 'oms-feed', label: 'Feed de eventos', short: 'Sync incremental de pedidos', category: 'oms' },

  { slug: 'customer-search', label: 'Buscar cliente', short: 'Por e-mail, telefone ou CPF', category: 'customers', featured: true },
  { slug: 'customer-get', label: 'Perfil completo', short: 'Ficha do Master Data', category: 'customers' },
  { slug: 'customer-create', label: 'Criar cliente', short: 'Novo registro na entidade CL', category: 'customers', featured: true },
  { slug: 'customer-update', label: 'Atualizar cliente', short: 'Atualização parcial de campos', category: 'customers' },

  { slug: 'checkout-create-cart', label: 'Criar carrinho', short: 'Novo orderForm', category: 'checkout', featured: true },
  { slug: 'checkout-add-item', label: 'Adicionar item', short: 'SKU + quantidade', category: 'checkout' },
  { slug: 'checkout-simulation', label: 'Simular frete', short: 'Opções e prazo por CEP', category: 'checkout', featured: true },

  { slug: 'pricing-get-price', label: 'Preço do SKU', short: 'Base, lista e markup', category: 'pricing' },
  { slug: 'logistics-get-inventory', label: 'Estoque', short: 'Posição por depósito', category: 'pricing' },

  { slug: 'logistics-list-warehouses', label: 'Depósitos', short: 'Centros de distribuição', category: 'logistics' },

  { slug: 'promotions-list', label: 'Campanhas ativas', short: 'Rules & Benefits em tempo real', category: 'promotions' },
];

export interface Stage {
  key: string;
  name: string;
  blurb: string;
  icon: string;
}

export const STAGES: Stage[] = [
  { key: 'main-stage', name: 'Main Stage', blurb: 'Grandes estreias e keynotes de abertura', icon: '🎤' },
  { key: 'stadium', name: 'Stadium', blurb: 'Liderança e IA em escala com Felipe Andreoli', icon: '🏟' },
  { key: 'global-vision', name: 'Global Vision', blurb: 'Mercados globais, Ásia e tendências', icon: '🌐' },
  { key: 'commerce-station', name: 'Commerce Station', blurb: 'O varejo operando hoje: logística, WhatsApp, CX', icon: '🛒' },
  { key: 'marketing-boulevard', name: 'Marketing Boulevard', blurb: 'Branding que constrói valor e desejo', icon: '📣' },
  { key: 'led-by-her', name: 'Led By Her', blurb: 'Liderança feminina e protagonismo no varejo', icon: '👥' },
  { key: 'designing-for-change', name: 'Designing For Change', blurb: 'Engenharia, produto e transformação digital', icon: '🎨' },
  { key: 'creator-alley', name: 'Creator Alley', blurb: 'Creators como canal de receita', icon: '🎬' },
  { key: 'retail-media-stage', name: 'Retail Media Stage', blurb: 'Mídia no ponto de decisão de compra', icon: '🎯' },
];

export interface Voice {
  name: string;
  role: string;
  company: string;
}

export const VOICES: Voice[] = [
  { name: 'Patricia Florissi', role: 'Ph.D. Technical Director, Office of the CTO', company: 'Google' },
  { name: 'Marcos Oliveira', role: 'Head Business Messaging LatAm', company: 'Meta' },
  { name: 'Frederico Trajano', role: 'CEO', company: 'Magazine Luiza' },
  { name: 'Fábio Coelho', role: 'Presidente', company: 'Google Brasil' },
  { name: 'Fernando Modé', role: 'CEO', company: 'Grupo Boticário' },
  { name: 'Marcelo Braga', role: 'General Manager', company: 'IBM Brasil' },
  { name: 'Cintia Moreira', role: 'CEO', company: 'Dengo Chocolates' },
  { name: 'Sergio Zimerman', role: 'CEO', company: 'Petz' },
];

export type PersonaKey = 'lojista' | 'agencia' | 'dev' | 'head';

export interface PersonaContent {
  key: PersonaKey;
  label: string;
  icon: string;
  subtitle: string;
  pains: { question: string; answer: string }[];
  microCopy: string;
}

export const PERSONAS: PersonaContent[] = [
  {
    key: 'lojista',
    label: 'Lojista VTEX',
    icon: '🛒',
    subtitle: 'Você opera a loja todo dia — precisa de menos ticket, mais conversão.',
    pains: [
      { question: '"Cadê meu pedido?" lotando o SAC?', answer: 'O bot puxa o pedido direto da VTEX e responde em 2s com status, rastreio e NF.' },
      { question: 'Cliente desiste no frete?', answer: 'Simulação por CEP ao vivo no WhatsApp, com as mesmas regras da sua loja.' },
      { question: 'Perdendo venda fora do horário?', answer: 'Atendimento 24/7 que busca produto por termo e envia carrossel direto no chat.' },
    ],
    microCopy: '1 credencial VTEX · 1 número de WhatsApp · live no mesmo dia',
  },
  {
    key: 'agencia',
    label: 'Agência',
    icon: '🏢',
    subtitle: 'Entregue resultado pros seus clientes VTEX sem virar integrador.',
    pains: [
      { question: 'Cada cliente pede uma automação diferente?', answer: 'Mesmo template, 23 ações prontas, multi-tenant nativo. Subiu uma vez, atende todas as contas.' },
      { question: 'Fechou com cliente novo e o relógio já correu?', answer: 'Onboarding em 5 minutos: credencial VTEX + WhatsApp conectados, sem código.' },
      { question: 'Time dev bloqueando campanha?', answer: 'Workflows visuais e agentes configuráveis sem tocar em API.' },
    ],
    microCopy: 'White-label · multi-merchant · revenue share disponível',
  },
  {
    key: 'dev',
    label: 'Dev / Tech',
    icon: '⚙',
    subtitle: 'AppKey, AppToken, webhooks — a gente fala sua língua.',
    pains: [
      { question: 'Construir integração VTEX do zero de novo?', answer: '23 ações REST prontas, baseURL interpolada por merchant, AES-256 nas credenciais.' },
      { question: 'E observabilidade?', answer: 'Logs por execução, correlation IDs, feed incremental com `vtex-oms-feed` pra jobs de sync.' },
      { question: 'E segurança?', answer: 'LGPD com confirmação gate em dados sensíveis. Credenciais nunca expostas no front.' },
    ],
    microCopy: 'REST-first · webhooks · SDK opcional · logs estruturados',
  },
  {
    key: 'head',
    label: 'Head de E-commerce',
    icon: '👔',
    subtitle: 'Você quer métrica de negócio, não contagem de funcionalidade.',
    pains: [
      { question: 'CAC subindo e atendimento crescendo sem limite?', answer: 'Redução real em tickets repetitivos (status, frete, produto) libera o time pra venda consultiva.' },
      { question: 'Canal WhatsApp ainda subutilizado?', answer: 'Do primeiro contato ao pós-venda, com dados reais da VTEX em cada mensagem.' },
      { question: 'Board cobrando ROI de IA?', answer: 'Template produtivo, não POC. Métricas por conversa, por agente e por persona.' },
    ],
    microCopy: 'Tempo pra valor: dias, não meses',
  },
];
