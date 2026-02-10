// Route internationalization utilities
import { Language, UrlLanguage, languageToUrlMap, urlToLanguageMap } from '../contexts/LanguageContext';

// Re-export language mappings
export { languageToUrlMap, urlToLanguageMap };

// Interface for route mapping
interface RouteMapping {
  [key: string]: { [key in Language]?: string };
}

// Map of route paths to localized slugs for each language
export const routeMappings: RouteMapping = {
  // Home route
  '/': {
    'pt-BR': 'inicio',
    'en-US': 'home',
    'de-DE': 'startseite',
    'es-ES': 'inicio',
    'ru-RU': 'главная',
    'zh-CN': '首页',
    'ja-JP': 'ホーム',
  },
  // Platform route
  '/paas': {
    'pt-BR': 'plataforma',
    'en-US': 'platform',
    'de-DE': 'plattform',
    'es-ES': 'plataforma',
    'ru-RU': 'платформа',
    'zh-CN': '平台',
    'ja-JP': 'プラットフォーム',
  },
  // Platform explanation route
  '/paas-explanation': {
    'pt-BR': 'explicacao-plataforma',
    'en-US': 'platform-explanation',
    'de-DE': 'plattform-erklarung',
    'es-ES': 'explicacion-plataforma',
    'ru-RU': 'объяснение-платформы',
    'zh-CN': '平台解释',
    'ja-JP': 'プラットフォーム説明',
  },
  // Building blocks route
  '/building-blocks': {
    'pt-BR': 'blocos-construcao',
    'en-US': 'building-blocks',
    'de-DE': 'bausteine',
    'es-ES': 'bloques-construccion',
    'ru-RU': 'строительные-блоки',
    'zh-CN': '构建块',
    'ja-JP': 'ビルディングブロック',
  },
  // Schedule route
  '/schedule': {
    'pt-BR': 'agendar',
    'en-US': 'schedule',
    'de-DE': 'terminplan',
    'es-ES': 'programar',
    'ru-RU': 'расписание',
    'zh-CN': '日程安排',
    'ja-JP': 'スケジュール',
  },
  // FAQ route
  '/faq': {
    'pt-BR': 'perguntas-frequentes',
    'en-US': 'faq',
    'de-DE': 'haufig-gestellte-fragen',
    'es-ES': 'preguntas-frecuentes',
    'ru-RU': 'часто-задаваемые-вопросы',
    'zh-CN': '常见问题',
    'ja-JP': 'よくある質問',
  },
  // Data deletion route
  '/data-deletion': {
    'pt-BR': 'exclusao-dados',
    'en-US': 'data-deletion',
    'de-DE': 'datenloschung',
    'es-ES': 'eliminacion-datos',
    'ru-RU': 'удаление-данных',
    'zh-CN': '数据删除',
    'ja-JP': 'データ削除',
  },
  // Privacy policy route
  '/privacy-policy': {
    'pt-BR': 'politica-privacidade',
    'en-US': 'privacy-policy',
    'de-DE': 'datenschutzrichtlinie',
    'es-ES': 'politica-privacidad',
    'ru-RU': 'политика-конфиденциальности',
    'zh-CN': '隐私政策',
    'ja-JP': 'プライバシーポリシー',
  },
  // Podcasts route
  '/podcasts': {
    'pt-BR': 'podcasts',
    'en-US': 'podcasts',
    'de-DE': 'podcasts',
    'es-ES': 'podcasts',
    'ru-RU': 'подкасты',
    'zh-CN': '播客',
    'ja-JP': 'ポッドキャスト',
  },
  // Studio route
  '/studio': {
    'pt-BR': 'studio',
    'en-US': 'studio',
    'de-DE': 'studio',
    'es-ES': 'studio',
    'ru-RU': 'студия',
    'zh-CN': '工作室',
    'ja-JP': 'スタジオ',
  },
  // Founders route
  '/founders': {
    'pt-BR': 'socios',
    'en-US': 'founders',
    'de-DE': 'grunder',
    'es-ES': 'fundadores',
    'ru-RU': 'основатели',
    'zh-CN': '创始人',
    'ja-JP': '創設者',
  },
  // Alias for founders in Portuguese
  '/socios': {
    'pt-BR': 'socios',
    'en-US': 'founders',
    'de-DE': 'grunder',
    'es-ES': 'fundadores',
    'ru-RU': 'основатели',
    'zh-CN': '创始人',
    'ja-JP': '創設者',
  },
  // Building blocks detail route handled separately with :id parameter
};

// Get the localized path for a specific route and language
export function getLocalizedPath(path: string, language: Language): string {
  // Convert full language code to short URL language code
  const urlLang = languageToUrlMap[language];
  
  // Special case for building-blocks/:id
  if (path.startsWith('/building-blocks/')) {
    const id = path.split('/').pop();
    const blockBasePath = routeMappings['/building-blocks']?.[language] || 'building-blocks';
    return `/${urlLang}/${blockBasePath}/${id}`;
  }
  
  // Handle regular routes
  const localizedSlug = routeMappings[path]?.[language];
  if (!localizedSlug) {
    // Fallback to using the original path without the leading slash
    return `/${urlLang}${path}`;
  }
  
  return `/${urlLang}/${localizedSlug}`;
}

// Get the non-localized path from a localized one
export function getNonLocalizedPath(path: string): { routePath: string; language: Language } {
  // Extract language code and slug from the path
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 1) {
    return { routePath: '/', language: 'pt-BR' }; // Default to home and pt-BR
  }
  
  // Convert URL language code (2 chars) to full language code
  const urlLang = parts[0] as UrlLanguage;
  let language: Language = 'pt-BR'; // Default
  
  if (Object.keys(urlToLanguageMap).includes(urlLang)) {
    language = urlToLanguageMap[urlLang];
  }
  
  const localizedSlug = parts.slice(1).join('/');
  
  // Find the corresponding route path for this localized slug
  for (const [routePath, localizations] of Object.entries(routeMappings)) {
    if (localizations[language] === localizedSlug) {
      return { routePath, language };
    }
  }
  
  // Special case for building-blocks/:id
  if (parts.length >= 2) {
    const blockBasePath = routeMappings['/building-blocks']?.[language];
    if (parts[1] === blockBasePath && parts.length >= 3) {
      return { routePath: `/building-blocks/${parts[2]}`, language };
    }
  }
  
  // Fallback: assume the localized slug is the same as the route path
  return { routePath: `/${localizedSlug}`, language };
}