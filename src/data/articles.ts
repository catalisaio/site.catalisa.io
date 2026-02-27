export type ArticleCategory = 'varejo' | 'food-tech' | 'atendimento' | 'conversational-commerce' | 'estrategia';
export type ArticleTier = 'case' | 'thematic';

export interface ArticleSource {
  author: string;
  title: string;
  site: string;
  url: string;
  accessDate: string;
}

export interface ArticleMetric {
  valueKey: string;
  labelKey: string;
  icon?: string;
}

export interface ArticleSection {
  type: 'intro' | 'challenge' | 'solution' | 'results' | 'analysis' | 'catalisa';
  headingKey?: string;
  contentKey: string;
}

export interface Article {
  slug: string;
  tier: ArticleTier;
  titleKey: string;
  subtitleKey: string;
  metaTitleKey: string;
  metaDescriptionKey: string;
  keywords: string[];
  category: ArticleCategory;
  publishedDate: string;
  readingTime: number;
  sources: ArticleSource[];
  metrics: ArticleMetric[];
  relatedSlugs: string[];
  relatedCatalisaPages: string[];
  sections: ArticleSection[];
}

export const categoryColors: Record<ArticleCategory, string> = {
  'varejo': 'purple',
  'food-tech': 'orange',
  'atendimento': 'blue',
  'conversational-commerce': 'green',
  'estrategia': 'yellow',
};

export const categoryLabelKeys: Record<ArticleCategory, string> = {
  'varejo': 'insights.categories.varejo',
  'food-tech': 'insights.categories.foodTech',
  'atendimento': 'insights.categories.atendimento',
  'conversational-commerce': 'insights.categories.conversationalCommerce',
  'estrategia': 'insights.categories.estrategia',
};

export const articles: Article[] = [
  // --- TIER 1: Cases ---
  {
    slug: 'boticario-assistente-ia-conversao-ecommerce',
    tier: 'case',
    titleKey: 'insights.articles.boticario.title',
    subtitleKey: 'insights.articles.boticario.subtitle',
    metaTitleKey: 'insights.articles.boticario.metaTitle',
    metaDescriptionKey: 'insights.articles.boticario.metaDescription',
    keywords: ['IA e-commerce', 'conversão inteligência artificial', 'assistente IA varejo', 'personalização IA beleza'],
    category: 'varejo',
    publishedDate: '2026-02-27',
    readingTime: 7,
    sources: [
      {
        author: 'MUNDO DO MARKETING',
        title: 'Grupo Boticário lança assistente de IA e eleva conversão em 46% no e-commerce',
        site: 'mundodomarketing.com.br',
        url: 'https://mundodomarketing.com.br/grupo-boticario-lanca-assistente-de-ia-e-eleva-conversao-em-46-no-e-commerce',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.boticario.metrics.0.value', labelKey: 'insights.articles.boticario.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.boticario.metrics.1.value', labelKey: 'insights.articles.boticario.metrics.1.label', icon: 'FiShoppingCart' },
      { valueKey: 'insights.articles.boticario.metrics.2.value', labelKey: 'insights.articles.boticario.metrics.2.label', icon: 'FiUsers' },
    ],
    relatedSlugs: ['ia-conversacional-varejo-brasileiro', 'roi-ia-customer-experience-dados', 'ia-humanizada-equilibrio-automacao-empatia'],
    relatedCatalisaPages: ['/ai-agents', '/apps', '/varejo'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.boticario.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.boticario.sections.challengeHeading', contentKey: 'insights.articles.boticario.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.boticario.sections.solutionHeading', contentKey: 'insights.articles.boticario.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.boticario.sections.resultsHeading', contentKey: 'insights.articles.boticario.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.boticario.sections.catalisaHeading', contentKey: 'insights.articles.boticario.sections.catalisa' },
    ],
  },
  {
    slug: 'ifood-comprai-compras-mercado-whatsapp',
    tier: 'case',
    titleKey: 'insights.articles.ifoodComprai.title',
    subtitleKey: 'insights.articles.ifoodComprai.subtitle',
    metaTitleKey: 'insights.articles.ifoodComprai.metaTitle',
    metaDescriptionKey: 'insights.articles.ifoodComprai.metaDescription',
    keywords: ['compras whatsapp IA', 'conversational commerce', 'ifood inteligência artificial', 'chatbot mercado'],
    category: 'food-tech',
    publishedDate: '2026-02-27',
    readingTime: 8,
    sources: [
      {
        author: 'IFOOD INSTITUCIONAL',
        title: 'Compr.AI: compra de mercado pelo WhatsApp',
        site: 'institucional.ifood.com.br',
        url: 'https://institucional.ifood.com.br/inovacao/compr-ai-compra-de-mercado-pelo-whatsapp/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.ifoodComprai.metrics.0.value', labelKey: 'insights.articles.ifoodComprai.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.ifoodComprai.metrics.1.value', labelKey: 'insights.articles.ifoodComprai.metrics.1.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.ifoodComprai.metrics.2.value', labelKey: 'insights.articles.ifoodComprai.metrics.2.label', icon: 'FiMessageCircle' },
    ],
    relatedSlugs: ['whatsapp-plataforma-vendas-conversational-commerce', 'foodtech-ia-transformacao-conversacional', 'agentes-ia-whatsapp-automacao-inteligencia'],
    relatedCatalisaPages: ['/agentes-ia-whatsapp', '/integracoes/whatsapp', '/building-blocks'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.ifoodComprai.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.ifoodComprai.sections.challengeHeading', contentKey: 'insights.articles.ifoodComprai.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.ifoodComprai.sections.solutionHeading', contentKey: 'insights.articles.ifoodComprai.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.ifoodComprai.sections.resultsHeading', contentKey: 'insights.articles.ifoodComprai.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.ifoodComprai.sections.catalisaHeading', contentKey: 'insights.articles.ifoodComprai.sections.catalisa' },
    ],
  },
  {
    slug: 'ifood-gerente-virtual-financeiro-whatsapp',
    tier: 'case',
    titleKey: 'insights.articles.ifoodGerente.title',
    subtitleKey: 'insights.articles.ifoodGerente.subtitle',
    metaTitleKey: 'insights.articles.ifoodGerente.metaTitle',
    metaDescriptionKey: 'insights.articles.ifoodGerente.metaDescription',
    keywords: ['agente IA financeiro', 'whatsapp business pagamentos', 'gestão restaurante IA', 'pix automático IA'],
    category: 'food-tech',
    publishedDate: '2026-02-27',
    readingTime: 7,
    sources: [
      {
        author: 'MOBILE TIME',
        title: 'iFood Gerente',
        site: 'mobiletime.com.br',
        url: 'https://www.mobiletime.com.br/noticias/21/10/2025/ifood-gerente/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.ifoodGerente.metrics.0.value', labelKey: 'insights.articles.ifoodGerente.metrics.0.label', icon: 'FiDollarSign' },
      { valueKey: 'insights.articles.ifoodGerente.metrics.1.value', labelKey: 'insights.articles.ifoodGerente.metrics.1.label', icon: 'FiSmartphone' },
      { valueKey: 'insights.articles.ifoodGerente.metrics.2.value', labelKey: 'insights.articles.ifoodGerente.metrics.2.label', icon: 'FiClock' },
    ],
    relatedSlugs: ['agentes-ia-whatsapp-automacao-inteligencia', 'foodtech-ia-transformacao-conversacional', 'ifood-cris-mentora-ia-restaurantes'],
    relatedCatalisaPages: ['/ai-agents', '/workflows', '/fintech'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.ifoodGerente.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.ifoodGerente.sections.challengeHeading', contentKey: 'insights.articles.ifoodGerente.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.ifoodGerente.sections.solutionHeading', contentKey: 'insights.articles.ifoodGerente.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.ifoodGerente.sections.resultsHeading', contentKey: 'insights.articles.ifoodGerente.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.ifoodGerente.sections.catalisaHeading', contentKey: 'insights.articles.ifoodGerente.sections.catalisa' },
    ],
  },
  {
    slug: 'ifood-cris-mentora-ia-restaurantes',
    tier: 'case',
    titleKey: 'insights.articles.ifoodCris.title',
    subtitleKey: 'insights.articles.ifoodCris.subtitle',
    metaTitleKey: 'insights.articles.ifoodCris.metaTitle',
    metaDescriptionKey: 'insights.articles.ifoodCris.metaDescription',
    keywords: ['agente IA restaurante', 'mentoria IA dados', 'analytics conversacional', 'otimização vendas IA'],
    category: 'food-tech',
    publishedDate: '2026-02-27',
    readingTime: 7,
    sources: [
      {
        author: 'TI INSIDE',
        title: 'iFood lança agente de IA no WhatsApp',
        site: 'tiinside.com.br',
        url: 'https://tiinside.com.br/05/08/2025/ifood-lanca-agente-de-ia-no-whatsapp/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.ifoodCris.metrics.0.value', labelKey: 'insights.articles.ifoodCris.metrics.0.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.ifoodCris.metrics.1.value', labelKey: 'insights.articles.ifoodCris.metrics.1.label', icon: 'FiBarChart2' },
      { valueKey: 'insights.articles.ifoodCris.metrics.2.value', labelKey: 'insights.articles.ifoodCris.metrics.2.label', icon: 'FiMessageCircle' },
    ],
    relatedSlugs: ['agentes-ia-whatsapp-automacao-inteligencia', 'foodtech-ia-transformacao-conversacional', 'ifood-gerente-virtual-financeiro-whatsapp'],
    relatedCatalisaPages: ['/ai-agents', '/building-blocks', '/workflows'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.ifoodCris.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.ifoodCris.sections.challengeHeading', contentKey: 'insights.articles.ifoodCris.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.ifoodCris.sections.solutionHeading', contentKey: 'insights.articles.ifoodCris.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.ifoodCris.sections.resultsHeading', contentKey: 'insights.articles.ifoodCris.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.ifoodCris.sections.catalisaHeading', contentKey: 'insights.articles.ifoodCris.sections.catalisa' },
    ],
  },
  {
    slug: 'carrefour-ia-atendimento-humanizado',
    tier: 'case',
    titleKey: 'insights.articles.carrefour.title',
    subtitleKey: 'insights.articles.carrefour.subtitle',
    metaTitleKey: 'insights.articles.carrefour.metaTitle',
    metaDescriptionKey: 'insights.articles.carrefour.metaDescription',
    keywords: ['atendimento IA humanizado', 'customer service IA', 'chatbot varejo personalizado', 'LGPD IA'],
    category: 'varejo',
    publishedDate: '2026-02-27',
    readingTime: 8,
    sources: [
      {
        author: 'IT FORUM',
        title: 'Carrefour aposta em IA para atendimento humanizado',
        site: 'itforum.com.br',
        url: 'https://itforum.com.br/noticias/carrefour-aposta-ia-atendimento-humanizado/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.carrefour.metrics.0.value', labelKey: 'insights.articles.carrefour.metrics.0.label', icon: 'FiClock' },
      { valueKey: 'insights.articles.carrefour.metrics.1.value', labelKey: 'insights.articles.carrefour.metrics.1.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.carrefour.metrics.2.value', labelKey: 'insights.articles.carrefour.metrics.2.label', icon: 'FiHome' },
    ],
    relatedSlugs: ['ia-conversacional-varejo-brasileiro', 'ia-humanizada-equilibrio-automacao-empatia', 'escalar-atendimento-sem-contratar-ia'],
    relatedCatalisaPages: ['/ai-agents', '/varejo'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.carrefour.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.carrefour.sections.challengeHeading', contentKey: 'insights.articles.carrefour.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.carrefour.sections.solutionHeading', contentKey: 'insights.articles.carrefour.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.carrefour.sections.resultsHeading', contentKey: 'insights.articles.carrefour.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.carrefour.sections.catalisaHeading', contentKey: 'insights.articles.carrefour.sections.catalisa' },
    ],
  },
  {
    slug: 'lotte-homeshopping-ia-reducao-40-carga-atendimento',
    tier: 'case',
    titleKey: 'insights.articles.lotte.title',
    subtitleKey: 'insights.articles.lotte.subtitle',
    metaTitleKey: 'insights.articles.lotte.metaTitle',
    metaDescriptionKey: 'insights.articles.lotte.metaDescription',
    keywords: ['redução carga atendimento IA', 'automação customer service', 'IA suporte cliente', 'eficiência operacional IA'],
    category: 'varejo',
    publishedDate: '2026-02-27',
    readingTime: 7,
    sources: [
      {
        author: 'AWS BLOG',
        title: 'Lotte Homeshopping reduces human agent workload by 40% with Sendbird on AWS',
        site: 'aws.amazon.com',
        url: 'https://aws.amazon.com/pt/blogs/industries/lotte-homeshopping-reduces-human-agent-workload-by-40-with-sendbird-on-aws/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.lotte.metrics.0.value', labelKey: 'insights.articles.lotte.metrics.0.label', icon: 'FiTrendingDown' },
      { valueKey: 'insights.articles.lotte.metrics.1.value', labelKey: 'insights.articles.lotte.metrics.1.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.lotte.metrics.2.value', labelKey: 'insights.articles.lotte.metrics.2.label', icon: 'FiZap' },
    ],
    relatedSlugs: ['ia-conversacional-varejo-brasileiro', 'escalar-atendimento-sem-contratar-ia', 'roi-ia-customer-experience-dados'],
    relatedCatalisaPages: ['/ai-agents', '/building-blocks', '/varejo'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.lotte.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.lotte.sections.challengeHeading', contentKey: 'insights.articles.lotte.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.lotte.sections.solutionHeading', contentKey: 'insights.articles.lotte.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.lotte.sections.resultsHeading', contentKey: 'insights.articles.lotte.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.lotte.sections.catalisaHeading', contentKey: 'insights.articles.lotte.sections.catalisa' },
    ],
  },
  {
    slug: 'synthesia-intercom-fin-ia-suporte-escala',
    tier: 'case',
    titleKey: 'insights.articles.synthesiaIntercom.title',
    subtitleKey: 'insights.articles.synthesiaIntercom.subtitle',
    metaTitleKey: 'insights.articles.synthesiaIntercom.metaTitle',
    metaDescriptionKey: 'insights.articles.synthesiaIntercom.metaDescription',
    keywords: ['self-service IA', 'escalar suporte sem contratar', 'knowledge base IA', 'autoatendimento inteligente'],
    category: 'atendimento',
    publishedDate: '2026-02-27',
    readingTime: 8,
    sources: [
      {
        author: 'INTERCOM',
        title: 'Synthesia customer story',
        site: 'intercom.com',
        url: 'https://www.intercom.com/customers/synthesia',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.synthesiaIntercom.metrics.0.value', labelKey: 'insights.articles.synthesiaIntercom.metrics.0.label', icon: 'FiCheckCircle' },
      { valueKey: 'insights.articles.synthesiaIntercom.metrics.1.value', labelKey: 'insights.articles.synthesiaIntercom.metrics.1.label', icon: 'FiClock' },
      { valueKey: 'insights.articles.synthesiaIntercom.metrics.2.value', labelKey: 'insights.articles.synthesiaIntercom.metrics.2.label', icon: 'FiMessageCircle' },
    ],
    relatedSlugs: ['synthesia-fin-ai-spike-690-suporte', 'escalar-atendimento-sem-contratar-ia', 'roi-ia-customer-experience-dados'],
    relatedCatalisaPages: ['/ai-agents', '/building-blocks'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.synthesiaIntercom.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.synthesiaIntercom.sections.challengeHeading', contentKey: 'insights.articles.synthesiaIntercom.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.synthesiaIntercom.sections.solutionHeading', contentKey: 'insights.articles.synthesiaIntercom.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.synthesiaIntercom.sections.resultsHeading', contentKey: 'insights.articles.synthesiaIntercom.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.synthesiaIntercom.sections.catalisaHeading', contentKey: 'insights.articles.synthesiaIntercom.sections.catalisa' },
    ],
  },
  {
    slug: 'synthesia-fin-ai-spike-690-suporte',
    tier: 'case',
    titleKey: 'insights.articles.synthesiaFin.title',
    subtitleKey: 'insights.articles.synthesiaFin.subtitle',
    metaTitleKey: 'insights.articles.synthesiaFin.metaTitle',
    metaDescriptionKey: 'insights.articles.synthesiaFin.metaDescription',
    keywords: ['escalar suporte IA', 'pico demanda IA', 'resolução automática IA', 'CSAT inteligência artificial'],
    category: 'atendimento',
    publishedDate: '2026-02-27',
    readingTime: 8,
    sources: [
      {
        author: 'FIN.AI',
        title: 'Synthesia customer story',
        site: 'fin.ai',
        url: 'https://fin.ai/customers/synthesia',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.synthesiaFin.metrics.0.value', labelKey: 'insights.articles.synthesiaFin.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.synthesiaFin.metrics.1.value', labelKey: 'insights.articles.synthesiaFin.metrics.1.label', icon: 'FiClock' },
      { valueKey: 'insights.articles.synthesiaFin.metrics.2.value', labelKey: 'insights.articles.synthesiaFin.metrics.2.label', icon: 'FiThumbsUp' },
    ],
    relatedSlugs: ['synthesia-intercom-fin-ia-suporte-escala', 'escalar-atendimento-sem-contratar-ia', 'ia-humanizada-equilibrio-automacao-empatia'],
    relatedCatalisaPages: ['/ai-agents', '/workflows'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.synthesiaFin.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.synthesiaFin.sections.challengeHeading', contentKey: 'insights.articles.synthesiaFin.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.synthesiaFin.sections.solutionHeading', contentKey: 'insights.articles.synthesiaFin.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.synthesiaFin.sections.resultsHeading', contentKey: 'insights.articles.synthesiaFin.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.synthesiaFin.sections.catalisaHeading', contentKey: 'insights.articles.synthesiaFin.sections.catalisa' },
    ],
  },
  {
    slug: 'gupshup-whatsapp-roi-270-forrester',
    tier: 'case',
    titleKey: 'insights.articles.gupshup.title',
    subtitleKey: 'insights.articles.gupshup.subtitle',
    metaTitleKey: 'insights.articles.gupshup.metaTitle',
    metaDescriptionKey: 'insights.articles.gupshup.metaDescription',
    keywords: ['ROI whatsapp business', 'retorno investimento IA conversacional', 'whatsapp marketing ROI', 'conversational commerce métricas'],
    category: 'conversational-commerce',
    publishedDate: '2026-02-27',
    readingTime: 8,
    sources: [
      {
        author: 'GUPSHUP',
        title: 'Gupshup WhatsApp drive 270% ROI — Total Economic Impact study',
        site: 'gupshup.ai',
        url: 'https://www.gupshup.ai/resources/press-releases/gupshup-whatsapp-drive-270-roi-total-economic-impact-study/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.gupshup.metrics.0.value', labelKey: 'insights.articles.gupshup.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.gupshup.metrics.1.value', labelKey: 'insights.articles.gupshup.metrics.1.label', icon: 'FiMail' },
      { valueKey: 'insights.articles.gupshup.metrics.2.value', labelKey: 'insights.articles.gupshup.metrics.2.label', icon: 'FiDollarSign' },
    ],
    relatedSlugs: ['whatsapp-plataforma-vendas-conversational-commerce', 'roi-ia-customer-experience-dados', 'magalu-lu-vendedora-ia-whatsapp'],
    relatedCatalisaPages: ['/agentes-ia-whatsapp', '/integracoes/whatsapp'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.gupshup.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.gupshup.sections.challengeHeading', contentKey: 'insights.articles.gupshup.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.gupshup.sections.solutionHeading', contentKey: 'insights.articles.gupshup.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.gupshup.sections.resultsHeading', contentKey: 'insights.articles.gupshup.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.gupshup.sections.catalisaHeading', contentKey: 'insights.articles.gupshup.sections.catalisa' },
    ],
  },
  {
    slug: 'magalu-lu-vendedora-ia-whatsapp',
    tier: 'case',
    titleKey: 'insights.articles.magalu.title',
    subtitleKey: 'insights.articles.magalu.subtitle',
    metaTitleKey: 'insights.articles.magalu.metaTitle',
    metaDescriptionKey: 'insights.articles.magalu.metaDescription',
    keywords: ['vendas whatsapp IA', 'comércio conversacional', 'lu magalu IA', 'agente vendedor whatsapp'],
    category: 'varejo',
    publishedDate: '2026-02-27',
    readingTime: 9,
    sources: [
      {
        author: 'EXAME',
        title: 'Lu, do Magalu, ganha cérebro com IA e vira vendedora dentro do WhatsApp',
        site: 'exame.com',
        url: 'https://exame.com/inteligencia-artificial/lu-do-magalu-ganha-cerebro-com-ia-e-vira-vendedora-dentro-do-whatsapp/',
        accessDate: '27 fev. 2026',
      },
    ],
    metrics: [
      { valueKey: 'insights.articles.magalu.metrics.0.value', labelKey: 'insights.articles.magalu.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.magalu.metrics.1.value', labelKey: 'insights.articles.magalu.metrics.1.label', icon: 'FiThumbsUp' },
      { valueKey: 'insights.articles.magalu.metrics.2.value', labelKey: 'insights.articles.magalu.metrics.2.label', icon: 'FiUsers' },
    ],
    relatedSlugs: ['ia-conversacional-varejo-brasileiro', 'whatsapp-plataforma-vendas-conversational-commerce', 'agentes-ia-whatsapp-automacao-inteligencia'],
    relatedCatalisaPages: ['/agentes-ia-whatsapp', '/ai-agents', '/workflows', '/varejo'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.magalu.sections.intro' },
      { type: 'challenge', headingKey: 'insights.articles.magalu.sections.challengeHeading', contentKey: 'insights.articles.magalu.sections.challenge' },
      { type: 'solution', headingKey: 'insights.articles.magalu.sections.solutionHeading', contentKey: 'insights.articles.magalu.sections.solution' },
      { type: 'results', headingKey: 'insights.articles.magalu.sections.resultsHeading', contentKey: 'insights.articles.magalu.sections.results' },
      { type: 'catalisa', headingKey: 'insights.articles.magalu.sections.catalisaHeading', contentKey: 'insights.articles.magalu.sections.catalisa' },
    ],
  },

  // --- TIER 2: Thematic ---
  {
    slug: 'ia-conversacional-varejo-brasileiro',
    tier: 'thematic',
    titleKey: 'insights.articles.varejoBr.title',
    subtitleKey: 'insights.articles.varejoBr.subtitle',
    metaTitleKey: 'insights.articles.varejoBr.metaTitle',
    metaDescriptionKey: 'insights.articles.varejoBr.metaDescription',
    keywords: ['IA conversacional varejo', 'inteligência artificial retail Brasil', 'transformação digital varejo'],
    category: 'varejo',
    publishedDate: '2026-02-27',
    readingTime: 10,
    sources: [
      { author: 'MUNDO DO MARKETING', title: 'Grupo Boticário lança assistente de IA e eleva conversão em 46% no e-commerce', site: 'mundodomarketing.com.br', url: 'https://mundodomarketing.com.br/grupo-boticario-lanca-assistente-de-ia-e-eleva-conversao-em-46-no-e-commerce', accessDate: '27 fev. 2026' },
      { author: 'IT FORUM', title: 'Carrefour aposta em IA para atendimento humanizado', site: 'itforum.com.br', url: 'https://itforum.com.br/noticias/carrefour-aposta-ia-atendimento-humanizado/', accessDate: '27 fev. 2026' },
      { author: 'EXAME', title: 'Lu, do Magalu, ganha cérebro com IA e vira vendedora dentro do WhatsApp', site: 'exame.com', url: 'https://exame.com/inteligencia-artificial/lu-do-magalu-ganha-cerebro-com-ia-e-vira-vendedora-dentro-do-whatsapp/', accessDate: '27 fev. 2026' },
      { author: 'AWS BLOG', title: 'Lotte Homeshopping reduces human agent workload by 40% with Sendbird on AWS', site: 'aws.amazon.com', url: 'https://aws.amazon.com/pt/blogs/industries/lotte-homeshopping-reduces-human-agent-workload-by-40-with-sendbird-on-aws/', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.varejoBr.metrics.0.value', labelKey: 'insights.articles.varejoBr.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.varejoBr.metrics.1.value', labelKey: 'insights.articles.varejoBr.metrics.1.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.varejoBr.metrics.2.value', labelKey: 'insights.articles.varejoBr.metrics.2.label', icon: 'FiGlobe' },
    ],
    relatedSlugs: ['boticario-assistente-ia-conversao-ecommerce', 'carrefour-ia-atendimento-humanizado', 'magalu-lu-vendedora-ia-whatsapp', 'lotte-homeshopping-ia-reducao-40-carga-atendimento'],
    relatedCatalisaPages: ['/varejo', '/ai-agents'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.varejoBr.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.varejoBr.sections.analysis1Heading', contentKey: 'insights.articles.varejoBr.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.varejoBr.sections.analysis2Heading', contentKey: 'insights.articles.varejoBr.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.varejoBr.sections.analysis3Heading', contentKey: 'insights.articles.varejoBr.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.varejoBr.sections.catalisaHeading', contentKey: 'insights.articles.varejoBr.sections.catalisa' },
    ],
  },
  {
    slug: 'whatsapp-plataforma-vendas-conversational-commerce',
    tier: 'thematic',
    titleKey: 'insights.articles.whatsappCommerce.title',
    subtitleKey: 'insights.articles.whatsappCommerce.subtitle',
    metaTitleKey: 'insights.articles.whatsappCommerce.metaTitle',
    metaDescriptionKey: 'insights.articles.whatsappCommerce.metaDescription',
    keywords: ['whatsapp vendas', 'conversational commerce Brasil', 'whatsapp business estratégia', 'social commerce'],
    category: 'conversational-commerce',
    publishedDate: '2026-02-27',
    readingTime: 10,
    sources: [
      { author: 'EXAME', title: 'Lu, do Magalu, ganha cérebro com IA e vira vendedora dentro do WhatsApp', site: 'exame.com', url: 'https://exame.com/inteligencia-artificial/lu-do-magalu-ganha-cerebro-com-ia-e-vira-vendedora-dentro-do-whatsapp/', accessDate: '27 fev. 2026' },
      { author: 'IFOOD INSTITUCIONAL', title: 'Compr.AI: compra de mercado pelo WhatsApp', site: 'institucional.ifood.com.br', url: 'https://institucional.ifood.com.br/inovacao/compr-ai-compra-de-mercado-pelo-whatsapp/', accessDate: '27 fev. 2026' },
      { author: 'GUPSHUP', title: 'Gupshup WhatsApp drive 270% ROI — Total Economic Impact study', site: 'gupshup.ai', url: 'https://www.gupshup.ai/resources/press-releases/gupshup-whatsapp-drive-270-roi-total-economic-impact-study/', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.whatsappCommerce.metrics.0.value', labelKey: 'insights.articles.whatsappCommerce.metrics.0.label', icon: 'FiMessageCircle' },
      { valueKey: 'insights.articles.whatsappCommerce.metrics.1.value', labelKey: 'insights.articles.whatsappCommerce.metrics.1.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.whatsappCommerce.metrics.2.value', labelKey: 'insights.articles.whatsappCommerce.metrics.2.label', icon: 'FiDollarSign' },
    ],
    relatedSlugs: ['magalu-lu-vendedora-ia-whatsapp', 'ifood-comprai-compras-mercado-whatsapp', 'gupshup-whatsapp-roi-270-forrester'],
    relatedCatalisaPages: ['/agentes-ia-whatsapp', '/integracoes/whatsapp'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.whatsappCommerce.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.whatsappCommerce.sections.analysis1Heading', contentKey: 'insights.articles.whatsappCommerce.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.whatsappCommerce.sections.analysis2Heading', contentKey: 'insights.articles.whatsappCommerce.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.whatsappCommerce.sections.analysis3Heading', contentKey: 'insights.articles.whatsappCommerce.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.whatsappCommerce.sections.catalisaHeading', contentKey: 'insights.articles.whatsappCommerce.sections.catalisa' },
    ],
  },
  {
    slug: 'roi-ia-customer-experience-dados',
    tier: 'thematic',
    titleKey: 'insights.articles.roiCx.title',
    subtitleKey: 'insights.articles.roiCx.subtitle',
    metaTitleKey: 'insights.articles.roiCx.metaTitle',
    metaDescriptionKey: 'insights.articles.roiCx.metaDescription',
    keywords: ['ROI inteligência artificial', 'retorno investimento chatbot', 'métricas IA customer experience'],
    category: 'estrategia',
    publishedDate: '2026-02-27',
    readingTime: 10,
    sources: [
      { author: 'GUPSHUP', title: 'Gupshup WhatsApp drive 270% ROI — Total Economic Impact study', site: 'gupshup.ai', url: 'https://www.gupshup.ai/resources/press-releases/gupshup-whatsapp-drive-270-roi-total-economic-impact-study/', accessDate: '27 fev. 2026' },
      { author: 'MUNDO DO MARKETING', title: 'Grupo Boticário lança assistente de IA e eleva conversão em 46% no e-commerce', site: 'mundodomarketing.com.br', url: 'https://mundodomarketing.com.br/grupo-boticario-lanca-assistente-de-ia-e-eleva-conversao-em-46-no-e-commerce', accessDate: '27 fev. 2026' },
      { author: 'AWS BLOG', title: 'Lotte Homeshopping reduces human agent workload by 40% with Sendbird on AWS', site: 'aws.amazon.com', url: 'https://aws.amazon.com/pt/blogs/industries/lotte-homeshopping-reduces-human-agent-workload-by-40-with-sendbird-on-aws/', accessDate: '27 fev. 2026' },
      { author: 'INTERCOM', title: 'Synthesia customer story', site: 'intercom.com', url: 'https://www.intercom.com/customers/synthesia', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.roiCx.metrics.0.value', labelKey: 'insights.articles.roiCx.metrics.0.label', icon: 'FiDollarSign' },
      { valueKey: 'insights.articles.roiCx.metrics.1.value', labelKey: 'insights.articles.roiCx.metrics.1.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.roiCx.metrics.2.value', labelKey: 'insights.articles.roiCx.metrics.2.label', icon: 'FiClock' },
    ],
    relatedSlugs: ['gupshup-whatsapp-roi-270-forrester', 'boticario-assistente-ia-conversao-ecommerce', 'lotte-homeshopping-ia-reducao-40-carga-atendimento', 'synthesia-intercom-fin-ia-suporte-escala'],
    relatedCatalisaPages: ['/como-funciona', '/demo'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.roiCx.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.roiCx.sections.analysis1Heading', contentKey: 'insights.articles.roiCx.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.roiCx.sections.analysis2Heading', contentKey: 'insights.articles.roiCx.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.roiCx.sections.analysis3Heading', contentKey: 'insights.articles.roiCx.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.roiCx.sections.catalisaHeading', contentKey: 'insights.articles.roiCx.sections.catalisa' },
    ],
  },
  {
    slug: 'escalar-atendimento-sem-contratar-ia',
    tier: 'thematic',
    titleKey: 'insights.articles.escalar.title',
    subtitleKey: 'insights.articles.escalar.subtitle',
    metaTitleKey: 'insights.articles.escalar.metaTitle',
    metaDescriptionKey: 'insights.articles.escalar.metaDescription',
    keywords: ['escalar atendimento IA', 'reduzir custo suporte', 'automação atendimento cliente', 'eficiência operacional'],
    category: 'atendimento',
    publishedDate: '2026-02-27',
    readingTime: 9,
    sources: [
      { author: 'FIN.AI', title: 'Synthesia customer story', site: 'fin.ai', url: 'https://fin.ai/customers/synthesia', accessDate: '27 fev. 2026' },
      { author: 'AWS BLOG', title: 'Lotte Homeshopping reduces human agent workload by 40% with Sendbird on AWS', site: 'aws.amazon.com', url: 'https://aws.amazon.com/pt/blogs/industries/lotte-homeshopping-reduces-human-agent-workload-by-40-with-sendbird-on-aws/', accessDate: '27 fev. 2026' },
      { author: 'IT FORUM', title: 'Carrefour aposta em IA para atendimento humanizado', site: 'itforum.com.br', url: 'https://itforum.com.br/noticias/carrefour-aposta-ia-atendimento-humanizado/', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.escalar.metrics.0.value', labelKey: 'insights.articles.escalar.metrics.0.label', icon: 'FiTrendingUp' },
      { valueKey: 'insights.articles.escalar.metrics.1.value', labelKey: 'insights.articles.escalar.metrics.1.label', icon: 'FiTrendingDown' },
      { valueKey: 'insights.articles.escalar.metrics.2.value', labelKey: 'insights.articles.escalar.metrics.2.label', icon: 'FiClock' },
    ],
    relatedSlugs: ['synthesia-fin-ai-spike-690-suporte', 'lotte-homeshopping-ia-reducao-40-carga-atendimento', 'carrefour-ia-atendimento-humanizado', 'synthesia-intercom-fin-ia-suporte-escala'],
    relatedCatalisaPages: ['/ai-agents', '/building-blocks'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.escalar.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.escalar.sections.analysis1Heading', contentKey: 'insights.articles.escalar.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.escalar.sections.analysis2Heading', contentKey: 'insights.articles.escalar.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.escalar.sections.analysis3Heading', contentKey: 'insights.articles.escalar.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.escalar.sections.catalisaHeading', contentKey: 'insights.articles.escalar.sections.catalisa' },
    ],
  },
  {
    slug: 'agentes-ia-whatsapp-automacao-inteligencia',
    tier: 'thematic',
    titleKey: 'insights.articles.agentesWhatsApp.title',
    subtitleKey: 'insights.articles.agentesWhatsApp.subtitle',
    metaTitleKey: 'insights.articles.agentesWhatsApp.metaTitle',
    metaDescriptionKey: 'insights.articles.agentesWhatsApp.metaDescription',
    keywords: ['agentes IA whatsapp', 'ai agents business', 'chatbot inteligente whatsapp', 'automação inteligente'],
    category: 'conversational-commerce',
    publishedDate: '2026-02-27',
    readingTime: 9,
    sources: [
      { author: 'MOBILE TIME', title: 'iFood Gerente', site: 'mobiletime.com.br', url: 'https://www.mobiletime.com.br/noticias/21/10/2025/ifood-gerente/', accessDate: '27 fev. 2026' },
      { author: 'TI INSIDE', title: 'iFood lança agente de IA no WhatsApp', site: 'tiinside.com.br', url: 'https://tiinside.com.br/05/08/2025/ifood-lanca-agente-de-ia-no-whatsapp/', accessDate: '27 fev. 2026' },
      { author: 'EXAME', title: 'Lu, do Magalu, ganha cérebro com IA e vira vendedora dentro do WhatsApp', site: 'exame.com', url: 'https://exame.com/inteligencia-artificial/lu-do-magalu-ganha-cerebro-com-ia-e-vira-vendedora-dentro-do-whatsapp/', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.agentesWhatsApp.metrics.0.value', labelKey: 'insights.articles.agentesWhatsApp.metrics.0.label', icon: 'FiCpu' },
      { valueKey: 'insights.articles.agentesWhatsApp.metrics.1.value', labelKey: 'insights.articles.agentesWhatsApp.metrics.1.label', icon: 'FiMessageCircle' },
      { valueKey: 'insights.articles.agentesWhatsApp.metrics.2.value', labelKey: 'insights.articles.agentesWhatsApp.metrics.2.label', icon: 'FiTrendingUp' },
    ],
    relatedSlugs: ['ifood-gerente-virtual-financeiro-whatsapp', 'ifood-cris-mentora-ia-restaurantes', 'magalu-lu-vendedora-ia-whatsapp'],
    relatedCatalisaPages: ['/ai-agents', '/agentes-ia-whatsapp', '/workflows'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.agentesWhatsApp.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.agentesWhatsApp.sections.analysis1Heading', contentKey: 'insights.articles.agentesWhatsApp.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.agentesWhatsApp.sections.analysis2Heading', contentKey: 'insights.articles.agentesWhatsApp.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.agentesWhatsApp.sections.analysis3Heading', contentKey: 'insights.articles.agentesWhatsApp.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.agentesWhatsApp.sections.catalisaHeading', contentKey: 'insights.articles.agentesWhatsApp.sections.catalisa' },
    ],
  },
  {
    slug: 'ia-humanizada-equilibrio-automacao-empatia',
    tier: 'thematic',
    titleKey: 'insights.articles.iaHumanizada.title',
    subtitleKey: 'insights.articles.iaHumanizada.subtitle',
    metaTitleKey: 'insights.articles.iaHumanizada.metaTitle',
    metaDescriptionKey: 'insights.articles.iaHumanizada.metaDescription',
    keywords: ['IA humanizada', 'chatbot humanizado', 'experiência cliente IA', 'personalização atendimento'],
    category: 'atendimento',
    publishedDate: '2026-02-27',
    readingTime: 9,
    sources: [
      { author: 'IT FORUM', title: 'Carrefour aposta em IA para atendimento humanizado', site: 'itforum.com.br', url: 'https://itforum.com.br/noticias/carrefour-aposta-ia-atendimento-humanizado/', accessDate: '27 fev. 2026' },
      { author: 'MUNDO DO MARKETING', title: 'Grupo Boticário lança assistente de IA e eleva conversão em 46% no e-commerce', site: 'mundodomarketing.com.br', url: 'https://mundodomarketing.com.br/grupo-boticario-lanca-assistente-de-ia-e-eleva-conversao-em-46-no-e-commerce', accessDate: '27 fev. 2026' },
      { author: 'FIN.AI', title: 'Synthesia customer story', site: 'fin.ai', url: 'https://fin.ai/customers/synthesia', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.iaHumanizada.metrics.0.value', labelKey: 'insights.articles.iaHumanizada.metrics.0.label', icon: 'FiHeart' },
      { valueKey: 'insights.articles.iaHumanizada.metrics.1.value', labelKey: 'insights.articles.iaHumanizada.metrics.1.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.iaHumanizada.metrics.2.value', labelKey: 'insights.articles.iaHumanizada.metrics.2.label', icon: 'FiThumbsUp' },
    ],
    relatedSlugs: ['carrefour-ia-atendimento-humanizado', 'boticario-assistente-ia-conversao-ecommerce', 'synthesia-fin-ai-spike-690-suporte'],
    relatedCatalisaPages: ['/ai-agents', '/varejo'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.iaHumanizada.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.iaHumanizada.sections.analysis1Heading', contentKey: 'insights.articles.iaHumanizada.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.iaHumanizada.sections.analysis2Heading', contentKey: 'insights.articles.iaHumanizada.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.iaHumanizada.sections.analysis3Heading', contentKey: 'insights.articles.iaHumanizada.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.iaHumanizada.sections.catalisaHeading', contentKey: 'insights.articles.iaHumanizada.sections.catalisa' },
    ],
  },
  {
    slug: 'foodtech-ia-transformacao-conversacional',
    tier: 'thematic',
    titleKey: 'insights.articles.foodtech.title',
    subtitleKey: 'insights.articles.foodtech.subtitle',
    metaTitleKey: 'insights.articles.foodtech.metaTitle',
    metaDescriptionKey: 'insights.articles.foodtech.metaDescription',
    keywords: ['foodtech IA', 'inteligência artificial restaurante', 'IA supermercado', 'automação food service'],
    category: 'food-tech',
    publishedDate: '2026-02-27',
    readingTime: 9,
    sources: [
      { author: 'IFOOD INSTITUCIONAL', title: 'Compr.AI: compra de mercado pelo WhatsApp', site: 'institucional.ifood.com.br', url: 'https://institucional.ifood.com.br/inovacao/compr-ai-compra-de-mercado-pelo-whatsapp/', accessDate: '27 fev. 2026' },
      { author: 'MOBILE TIME', title: 'iFood Gerente', site: 'mobiletime.com.br', url: 'https://www.mobiletime.com.br/noticias/21/10/2025/ifood-gerente/', accessDate: '27 fev. 2026' },
      { author: 'TI INSIDE', title: 'iFood lança agente de IA no WhatsApp', site: 'tiinside.com.br', url: 'https://tiinside.com.br/05/08/2025/ifood-lanca-agente-de-ia-no-whatsapp/', accessDate: '27 fev. 2026' },
      { author: 'IT FORUM', title: 'Carrefour aposta em IA para atendimento humanizado', site: 'itforum.com.br', url: 'https://itforum.com.br/noticias/carrefour-aposta-ia-atendimento-humanizado/', accessDate: '27 fev. 2026' },
    ],
    metrics: [
      { valueKey: 'insights.articles.foodtech.metrics.0.value', labelKey: 'insights.articles.foodtech.metrics.0.label', icon: 'FiCpu' },
      { valueKey: 'insights.articles.foodtech.metrics.1.value', labelKey: 'insights.articles.foodtech.metrics.1.label', icon: 'FiUsers' },
      { valueKey: 'insights.articles.foodtech.metrics.2.value', labelKey: 'insights.articles.foodtech.metrics.2.label', icon: 'FiTrendingUp' },
    ],
    relatedSlugs: ['ifood-comprai-compras-mercado-whatsapp', 'ifood-gerente-virtual-financeiro-whatsapp', 'ifood-cris-mentora-ia-restaurantes', 'carrefour-ia-atendimento-humanizado'],
    relatedCatalisaPages: ['/ai-agents', '/building-blocks'],
    sections: [
      { type: 'intro', contentKey: 'insights.articles.foodtech.sections.intro' },
      { type: 'analysis', headingKey: 'insights.articles.foodtech.sections.analysis1Heading', contentKey: 'insights.articles.foodtech.sections.analysis1' },
      { type: 'analysis', headingKey: 'insights.articles.foodtech.sections.analysis2Heading', contentKey: 'insights.articles.foodtech.sections.analysis2' },
      { type: 'analysis', headingKey: 'insights.articles.foodtech.sections.analysis3Heading', contentKey: 'insights.articles.foodtech.sections.analysis3' },
      { type: 'catalisa', headingKey: 'insights.articles.foodtech.sections.catalisaHeading', contentKey: 'insights.articles.foodtech.sections.catalisa' },
    ],
  },
];

export const articleSlugs = articles.map((a) => a.slug);

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getRelatedArticles(article: Article): Article[] {
  return article.relatedSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is Article => !!a)
    .slice(0, 3);
}
