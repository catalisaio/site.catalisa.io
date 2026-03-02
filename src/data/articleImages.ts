import type { ArticleCategory } from './articles';

interface ArticleImage {
  hero: string;
  thumbnail: string;
}

/**
 * Category-level fallback images (Unsplash static URLs).
 * Each category gets a thematic hero + thumbnail.
 */
const categoryImages: Record<ArticleCategory, ArticleImage> = {
  'varejo': {
    hero: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&q=80',
  },
  'food-tech': {
    hero: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=300&fit=crop&q=80',
  },
  'atendimento': {
    hero: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop&q=80',
  },
  'conversational-commerce': {
    hero: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop&q=80',
  },
  'estrategia': {
    hero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80',
  },
  'financeiro': {
    hero: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&q=80',
  },
};

/**
 * Per-article image overrides (slug → images).
 * Articles not listed here fall back to their category images.
 */
const articleImageOverrides: Record<string, Partial<ArticleImage>> = {
  // ── Varejo ──────────────────────────────────────────────────────────
  'boticario-assistente-ia-conversao-ecommerce': {
    hero: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80',
  },
  'carrefour-ia-atendimento-humanizado': {
    hero: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop&q=80',
  },
  'magalu-lu-vendedora-ia-whatsapp': {
    hero: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=400&h=300&fit=crop&q=80',
  },
  'lotte-homeshopping-ia-reducao-40-carga-atendimento': {
    hero: 'https://images.unsplash.com/photo-1560438718-eb61ede255eb?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1560438718-eb61ede255eb?w=400&h=300&fit=crop&q=80',
  },
  'ia-conversacional-varejo-brasileiro': {
    hero: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=300&fit=crop&q=80',
  },
  // ── Food-tech ───────────────────────────────────────────────────────
  'ifood-comprai-compras-mercado-whatsapp': {
    hero: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80',
  },
  'ifood-gerente-virtual-financeiro-whatsapp': {
    hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
  },
  'ifood-cris-mentora-ia-restaurantes': {
    hero: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop&q=80',
  },
  'foodtech-ia-transformacao-conversacional': {
    hero: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop&q=80',
  },
  // ── Atendimento ─────────────────────────────────────────────────────
  'synthesia-intercom-fin-ia-suporte-escala': {
    hero: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&q=80',
  },
  'synthesia-fin-ai-spike-690-suporte': {
    hero: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&q=80',
  },
  'escalar-atendimento-sem-contratar-ia': {
    hero: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&q=80',
  },
  'ia-humanizada-equilibrio-automacao-empatia': {
    hero: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=400&h=300&fit=crop&q=80',
  },
  // ── Conversational Commerce ─────────────────────────────────────────
  'gupshup-whatsapp-roi-270-forrester': {
    hero: 'https://images.unsplash.com/photo-1556742208-999815fca738?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556742208-999815fca738?w=400&h=300&fit=crop&q=80',
  },
  'padrao-3x-conversao-whatsapp-vs-apps': {
    hero: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&q=80',
  },
  'agentes-vs-chatbots-evolucao-faq-transacoes': {
    hero: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&q=80',
  },
  '90-porcento-empresas-mais-clientes-whatsapp': {
    hero: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop&q=80',
  },
  'whatsapp-plataforma-vendas-conversational-commerce': {
    hero: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=300&fit=crop&q=80',
  },
  'agentes-ia-whatsapp-automacao-inteligencia': {
    hero: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&q=80',
  },
  // ── Estrategia ──────────────────────────────────────────────────────
  'klarna-ia-40m-economia-contraponto': {
    hero: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop&q=80',
  },
  'roi-ia-customer-experience-dados': {
    hero: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&q=80',
  },
  // ── Financeiro ──────────────────────────────────────────────────────
  'bancos-brasileiros-ia-whatsapp-bradesco-itau-nubank': {
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80',
  },
  'banco-bv-agentes-ia-reducao-rechamadas': {
    hero: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop&q=80',
  },
  'bancos-globais-ia-whatsapp-dbs-hdfc-absa': {
    hero: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&h=300&fit=crop&q=80',
  },
  'lemonade-sinistro-2-segundos-insurtech': {
    hero: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&q=80',
  },
  'picpay-btg-pix-whatsapp-voz-imagem': {
    hero: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=300&fit=crop&q=80',
  },
  'ia-financeiro-cobranca-investimentos-mapa': {
    hero: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop&q=80',
  },
};

/**
 * Generates an inline SVG placeholder with the category's gradient color.
 */
export function getCategoryPlaceholder(category: ArticleCategory): string {
  const gradients: Record<ArticleCategory, [string, string]> = {
    'varejo': ['#9F7AEA', '#805AD5'],
    'food-tech': ['#ED8936', '#DD6B20'],
    'atendimento': ['#4299E1', '#3182CE'],
    'conversational-commerce': ['#48BB78', '#38A169'],
    'estrategia': ['#ECC94B', '#D69E2E'],
    'financeiro': ['#38B2AC', '#319795'],
  };
  const [c1, c2] = gradients[category];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c2}" stop-opacity="0.15"/></linearGradient></defs><rect fill="url(#g)" width="400" height="300"/></svg>`,
  )}`;
}

/**
 * Returns hero and thumbnail image URLs for an article.
 * Priority: article override → category fallback.
 */
export function getArticleImage(slug: string, category: ArticleCategory): ArticleImage {
  const override = articleImageOverrides[slug];
  const fallback = categoryImages[category];
  return {
    hero: override?.hero || fallback.hero,
    thumbnail: override?.thumbnail || fallback.thumbnail,
  };
}
