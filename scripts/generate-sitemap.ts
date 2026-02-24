import { writeFileSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = 'https://catalisa.io';

interface SitemapRoute {
  ptPath: string;
  enPath: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
  noIndex?: boolean;
}

// Mirror of src/seo/routes.ts - keep in sync
const routes: SitemapRoute[] = [
  { ptPath: '/', enPath: '/en', priority: 1.0, changefreq: 'weekly' },
  { ptPath: '/studio', enPath: '/en/studio', priority: 0.9, changefreq: 'weekly' },
  { ptPath: '/ai-agents', enPath: '/en/ai-agents', priority: 0.9, changefreq: 'weekly' },
  { ptPath: '/building-blocks', enPath: '/en/building-blocks', priority: 0.9, changefreq: 'weekly' },
  { ptPath: '/workflows', enPath: '/en/workflows', priority: 0.9, changefreq: 'weekly' },
  { ptPath: '/fintech', enPath: '/en/fintech', priority: 0.8, changefreq: 'monthly' },
  { ptPath: '/bancario', enPath: '/en/banking', priority: 0.8, changefreq: 'monthly' },
  { ptPath: '/seguros', enPath: '/en/insurance', priority: 0.8, changefreq: 'monthly' },
  { ptPath: '/varejo', enPath: '/en/retail', priority: 0.8, changefreq: 'monthly' },
  { ptPath: '/startups', enPath: '/en/startups', priority: 0.8, changefreq: 'monthly' },
  { ptPath: '/use-cases', enPath: '/en/use-cases', priority: 0.7, changefreq: 'weekly' },
  { ptPath: '/contato', enPath: '/en/contact', priority: 0.7, changefreq: 'monthly' },
  { ptPath: '/demo', enPath: '/en/demo', priority: 0.7, changefreq: 'monthly' },
  { ptPath: '/politica-privacidade', enPath: '/en/privacy-policy', priority: 0.3, changefreq: 'monthly' },
  { ptPath: '/press-kit', enPath: '/en/press-kit', priority: 0.5, changefreq: 'monthly' },
  { ptPath: '/apresentacao-comercial', enPath: '/en/commercial-presentation', priority: 0.0, changefreq: 'monthly', noIndex: true },
];

function generateSitemap(): string {
  const today = new Date().toISOString().split('T')[0];
  const indexableRoutes = routes.filter((r) => !r.noIndex);

  const urlEntries = indexableRoutes.flatMap((route) => {
    const ptUrl = `${BASE_URL}${route.ptPath}`;
    const enUrl = `${BASE_URL}${route.enPath}`;

    const hreflangLinks = `
      <xhtml:link rel="alternate" hreflang="pt-BR" href="${ptUrl}"/>
      <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}"/>
      <xhtml:link rel="alternate" hreflang="x-default" href="${ptUrl}"/>`;

    return [
      `  <url>
    <loc>${ptUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>${hreflangLinks}
  </url>`,
      `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>${hreflangLinks}
  </url>`,
    ];
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`;
}

const sitemap = generateSitemap();
const outPath = resolve(process.cwd(), 'dist', 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf-8');

console.log(`Sitemap generated at ${outPath} (${routes.filter(r => !r.noIndex).length * 2} URLs)`);
