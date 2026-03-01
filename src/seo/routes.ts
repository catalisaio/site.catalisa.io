import { ptToEn } from '../i18n/useLocalizedPath';

export type SchemaType = 'Organization' | 'WebSite' | 'SoftwareApplication' | 'BreadcrumbList' | 'VideoObject' | 'SiteNavigationElement' | 'FAQPage' | 'CollectionPage';

export interface RouteDefinition {
  ptPath: string;
  enPath: string;
  pageKey: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
  schemas: SchemaType[];
  ogImage: string;
  noIndex?: boolean;
  /** Breadcrumb category for grouping (null = home) */
  breadcrumbCategory?: 'platform' | 'industries' | 'insights';
}

export const BASE_URL = 'https://catalisa.io';

export const routes: RouteDefinition[] = [
  {
    ptPath: '/',
    enPath: '/en',
    pageKey: 'home',
    priority: 1.0,
    changefreq: 'weekly',
    schemas: ['Organization', 'WebSite', 'SoftwareApplication', 'SiteNavigationElement'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/studio',
    enPath: '/en/studio',
    pageKey: 'studio',
    priority: 0.9,
    changefreq: 'weekly',
    schemas: ['Organization', 'SoftwareApplication', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'platform',
  },
  {
    ptPath: '/ai-agents',
    enPath: '/en/ai-agents',
    pageKey: 'aiAgents',
    priority: 0.9,
    changefreq: 'weekly',
    schemas: ['Organization', 'SoftwareApplication', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'platform',
  },
  {
    ptPath: '/apps',
    enPath: '/en/apps',
    pageKey: 'apps',
    priority: 0.9,
    changefreq: 'weekly',
    schemas: ['Organization', 'SoftwareApplication', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'platform',
  },
  {
    ptPath: '/building-blocks',
    enPath: '/en/building-blocks',
    pageKey: 'buildingBlocks',
    priority: 0.9,
    changefreq: 'weekly',
    schemas: ['Organization', 'SoftwareApplication', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'platform',
  },
  {
    ptPath: '/workflows',
    enPath: '/en/workflows',
    pageKey: 'workflows',
    priority: 0.9,
    changefreq: 'weekly',
    schemas: ['Organization', 'SoftwareApplication', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'platform',
  },
  {
    ptPath: '/fintech',
    enPath: '/en/fintech',
    pageKey: 'fintech',
    priority: 0.8,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'industries',
  },
  {
    ptPath: '/bancario',
    enPath: '/en/banking',
    pageKey: 'banking',
    priority: 0.8,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'industries',
  },
  {
    ptPath: '/seguros',
    enPath: '/en/insurance',
    pageKey: 'insurance',
    priority: 0.8,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'industries',
  },
  {
    ptPath: '/varejo',
    enPath: '/en/retail',
    pageKey: 'retail',
    priority: 0.8,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'industries',
  },
  {
    ptPath: '/startups',
    enPath: '/en/startups',
    pageKey: 'startups',
    priority: 0.8,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'industries',
  },
  {
    ptPath: '/casos-de-uso',
    enPath: '/en/use-cases',
    pageKey: 'casosDeUso',
    priority: 0.9,
    changefreq: 'weekly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'platform',
  },
  {
    ptPath: '/contato',
    enPath: '/en/contact',
    pageKey: 'contact',
    priority: 0.7,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/demo',
    enPath: '/en/demo',
    pageKey: 'demo',
    priority: 0.7,
    changefreq: 'monthly',
    schemas: ['Organization', 'VideoObject', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/politica-privacidade',
    enPath: '/en/privacy-policy',
    pageKey: 'privacy',
    priority: 0.3,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/press-kit',
    enPath: '/en/press-kit',
    pageKey: 'pressKit',
    priority: 0.5,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/termos',
    enPath: '/en/terms',
    pageKey: 'terms',
    priority: 0.3,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/seguranca',
    enPath: '/en/security',
    pageKey: 'security',
    priority: 0.7,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/como-funciona',
    enPath: '/en/how-it-works',
    pageKey: 'howItWorks',
    priority: 0.8,
    changefreq: 'weekly',
    schemas: ['Organization', 'BreadcrumbList'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/integracoes/whatsapp',
    enPath: '/en/integrations/whatsapp',
    pageKey: 'whatsappIntegration',
    priority: 0.7,
    changefreq: 'monthly',
    schemas: ['Organization', 'BreadcrumbList', 'FAQPage'],
    ogImage: '/og/default.png',
  },
  {
    ptPath: '/insights',
    enPath: '/en/insights',
    pageKey: 'insights',
    priority: 0.8,
    changefreq: 'weekly',
    schemas: ['Organization', 'BreadcrumbList', 'CollectionPage'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'insights',
  },
  {
    ptPath: '/insights/magazine',
    enPath: '/en/insights/magazine',
    pageKey: 'insightsMagazine',
    priority: 0.8,
    changefreq: 'weekly',
    schemas: ['Organization', 'BreadcrumbList', 'CollectionPage'],
    ogImage: '/og/default.png',
    breadcrumbCategory: 'insights',
  },
  {
    ptPath: '/apresentacao/comercial',
    enPath: '/en/presentation/commercial',
    pageKey: 'presentation',
    priority: 0.0,
    changefreq: 'monthly',
    schemas: [],
    ogImage: '/og/default.png',
    noIndex: true,
  },
  {
    ptPath: '/apresentacao/investidor',
    enPath: '/en/presentation/investor',
    pageKey: 'investorPresentation',
    priority: 0.0,
    changefreq: 'monthly',
    schemas: [],
    ogImage: '/og/default.png',
    noIndex: true,
  },
  {
    ptPath: '/apresentacao/varejo',
    enPath: '/en/presentation/retail',
    pageKey: 'retailPresentation',
    priority: 0.0,
    changefreq: 'monthly',
    schemas: [],
    ogImage: '/og/default.png',
    noIndex: true,
  },
  {
    ptPath: '/apresentacao/fintech',
    enPath: '/en/presentation/fintech',
    pageKey: 'fintechPresentation',
    priority: 0.0,
    changefreq: 'monthly',
    schemas: [],
    ogImage: '/og/default.png',
    noIndex: true,
  },
  {
    ptPath: '/apresentacao/seguros',
    enPath: '/en/presentation/insurance',
    pageKey: 'insurancePresentation',
    priority: 0.0,
    changefreq: 'monthly',
    schemas: [],
    ogImage: '/og/default.png',
    noIndex: true,
  },
];

/**
 * Resolve a route definition from the current pathname.
 * Works for both pt-BR and en-US paths.
 */
export function resolveRoute(pathname: string): RouteDefinition | undefined {
  return routes.find(
    (r) => r.ptPath === pathname || r.enPath === pathname,
  );
}

/**
 * Get all routes for sitemap generation (excludes noIndex routes).
 */
export function getIndexableRoutes(): RouteDefinition[] {
  return routes.filter((r) => !r.noIndex);
}

/**
 * Get all paths for pre-rendering (all routes, both languages).
 */
export function getAllPaths(): string[] {
  return routes.flatMap((r) => [r.ptPath, r.enPath]);
}

// Re-export ptToEn for convenience
export { ptToEn };
