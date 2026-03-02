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
  'boticario-assistente-ia-conversao-ecommerce': {
    hero: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80',
  },
  'ifood-comprai-ia-generativa-whatsapp-conversao': {
    hero: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80',
  },
  'ifood-gerente-ia-restaurantes-operacao': {
    hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
  },
  'carrefour-hopla-ia-experiencia-compra': {
    hero: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop&q=80',
  },
  'klarna-ia-atendimento-eficiencia': {
    hero: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop&q=80',
  },
  'magalu-lu-agente-ia-varejo': {
    hero: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop&q=80',
  },
  // Financeiro — unique per article to avoid repetition
  'bancos-brasileiros-ia-whatsapp-bradesco-itau-nubank': {
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80',
  },
  'banco-bv-agentes-ia-reducao-rechamadas': {
    hero: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop&q=80',
  },
  'bancos-globais-ia-whatsapp-dbs-hdfc-absa': {
    hero: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&h=300&fit=crop&q=80',
  },
  'lemonade-sinistro-2-segundos-insurtech': {
    hero: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop&q=80',
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
