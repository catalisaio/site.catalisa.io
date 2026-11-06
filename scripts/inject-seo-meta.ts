/**
 * Injects article-specific SEO meta tags into static HTML files.
 * Runs without Puppeteer — uses string replacement on the built index.html template.
 * Ensures crawlers (LinkedIn, WhatsApp, Facebook, Twitter) always get correct meta tags,
 * even if the Puppeteer-based pre-render fails on CI.
 *
 * If pre-render runs after this, it overwrites with full pre-rendered HTML (which is better).
 * If pre-render fails, these meta-only HTML files still serve correct social previews.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { articles, categoryLabelKeys } from '../src/data/articles';
import type { ArticleCategory } from '../src/data/articles';
import { channelArticles, publishedChannels, articleWordCount } from '../src/data/channelArticles';
import type { ArticleLocale, ChannelArticle } from '../src/data/channelArticles';

const DIST_DIR = resolve(process.cwd(), 'dist');
const BASE_URL = 'https://catalisa.io';

// Load translation files
const ptInsights = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/i18n/locales/pt-BR/insights.json'), 'utf-8'),
);
const enInsights = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/i18n/locales/en-US/insights.json'), 'utf-8'),
);

function resolveKey(obj: unknown, keyPath: string): string {
  // keyPath like "insights.articles.boticario.metaTitle" → strip "insights." prefix
  const parts = keyPath.replace('insights.', '').split('.');
  let value: unknown = obj;
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }
  return (value as string) || keyPath;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildArticleHtml(
  template: string,
  article: typeof articles[0],
  translations: unknown,
  lang: 'pt-BR' | 'en-US',
  routePrefix: string,
): string {
  const metaTitle = resolveKey(translations, article.metaTitleKey);
  const metaDescription = resolveKey(translations, article.metaDescriptionKey);
  const categoryLabel = resolveKey(translations, categoryLabelKeys[article.category]);
  const ogImage = `${BASE_URL}/og/insights/${article.slug}.png`;
  const canonicalUrl = `${BASE_URL}${routePrefix}/insights/${article.slug}`;
  const ptUrl = `${BASE_URL}/insights/${article.slug}`;
  const enUrl = `${BASE_URL}/en/insights/${article.slug}`;
  const locale = lang === 'en-US' ? 'en_US' : 'pt_BR';
  const altLocale = lang === 'en-US' ? 'pt_BR' : 'en_US';
  const publishedTime = `${article.publishedDate}T00:00:00-03:00`;
  const modifiedTime = `${(article.updatedDate ?? article.publishedDate)}T00:00:00-03:00`;

  const escapedTitle = escapeHtml(metaTitle);
  const escapedDesc = escapeHtml(metaDescription);

  // Build article:tag meta tags
  const articleTags = article.keywords
    .map((kw) => `    <meta property="article:tag" content="${escapeHtml(kw)}" />`)
    .join('\n');

  // Build JSON-LD
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metaTitle,
    description: metaDescription,
    author: { '@type': 'Organization', name: 'Catalisa', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Catalisa',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/brand/logos/color/logo-color-200h.png` },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
    articleSection: article.category,
    keywords: article.keywords,
    wordCount: article.readingTime * 200,
  });

  // Replace meta tags in template
  let html = template;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapedTitle}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapedDesc}"`,
  );

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapedTitle}"`,
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapedDesc}"`,
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"/,
    `<meta property="og:image" content="${ogImage}"`,
  );
  html = html.replace(
    /<meta property="og:image:secure_url" content="[^"]*"/,
    `<meta property="og:image:secure_url" content="${ogImage}"`,
  );
  html = html.replace(
    /<meta property="og:image:alt" content="[^"]*"/,
    `<meta property="og:image:alt" content="${escapedTitle}"`,
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${canonicalUrl}"`,
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"/,
    `<meta property="og:type" content="article"`,
  );
  html = html.replace(
    /<meta property="og:locale" content="[^"]*"/,
    `<meta property="og:locale" content="${locale}"`,
  );

  // Replace twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapedTitle}"`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapedDesc}"`,
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"/,
    `<meta name="twitter:image" content="${ogImage}"`,
  );
  html = html.replace(
    /<meta name="twitter:image:alt" content="[^"]*"/,
    `<meta name="twitter:image:alt" content="${escapedTitle}"`,
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonicalUrl}"`,
  );

  // Insert article-specific tags and JSON-LD before </head>
  const articleMeta = `
    <!-- Article meta (injected by inject-seo-meta) -->
    <meta property="og:locale:alternate" content="${altLocale}" />
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:modified_time" content="${modifiedTime}" />
    <meta property="article:author" content="Catalisa" />
    <meta property="article:section" content="${escapeHtml(categoryLabel)}" />
${articleTags}
    <link rel="alternate" hreflang="pt-BR" href="${ptUrl}" />
    <link rel="alternate" hreflang="en-US" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${ptUrl}" />
    <script type="application/ld+json">${jsonLd}</script>`;

  html = html.replace('</head>', `${articleMeta}\n  </head>`);

  return html;
}

function buildChannelArticleHtml(
  template: string,
  article: ChannelArticle,
  locale: ArticleLocale,
): string {
  const metaTitle = article.metaTitle[locale];
  const metaDescription = article.metaDescription[locale];
  const routePrefix = locale === 'en' ? '/en' : '';
  const canonicalUrl = `${BASE_URL}${routePrefix}/artigos/${article.slug}`;
  const ptUrl = `${BASE_URL}/artigos/${article.slug}`;
  const enUrl = `${BASE_URL}/en/artigos/${article.slug}`;
  const ogLocale = locale === 'en' ? 'en_US' : 'pt_BR';
  const altLocale = locale === 'en' ? 'pt_BR' : 'en_US';
  const publishedTime = `${article.date}T00:00:00-03:00`;
  const channels = publishedChannels(article);
  const perspective = article.relatedPerspective;
  const escapedTitle = escapeHtml(metaTitle);
  const escapedDesc = escapeHtml(metaDescription);
  const articleTags = article.keywords[locale]
    .map((kw) => `    <meta property="article:tag" content="${escapeHtml(kw)}" />`)
    .join('\n');

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title[locale],
    description: metaDescription,
    inLanguage: locale === 'en' ? 'en-US' : 'pt-BR',
    author: { '@type': 'Organization', name: 'Catalisa', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Catalisa',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/brand/logos/color/logo-color-200h.png` },
    },
    datePublished: publishedTime,
    dateModified: publishedTime,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    url: canonicalUrl,
    image: { '@type': 'ImageObject', url: `${BASE_URL}/og/default.png`, width: 1200, height: 630 },
    articleSection: article.series[locale],
    keywords: article.keywords[locale],
    wordCount: articleWordCount(article, locale),
    sameAs: channels.map((channel) => channel.url),
    ...(perspective
      ? { citation: [{ '@type': 'Article', name: perspective.title[locale], url: perspective.url[locale] }] }
      : {}),
  });

  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapedTitle}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapedDesc}"`,
  );
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${escapedTitle}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${escapedDesc}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`);
  html = html.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="article"`);
  html = html.replace(/<meta property="og:locale" content="[^"]*"/, `<meta property="og:locale" content="${ogLocale}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${escapedTitle}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${escapedDesc}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`);

  const articleMeta = `
    <!-- Channel article meta (injected by inject-seo-meta) -->
    <meta property="og:locale:alternate" content="${altLocale}" />
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:modified_time" content="${publishedTime}" />
    <meta property="article:author" content="Catalisa" />
    <meta property="article:section" content="${escapeHtml(article.series[locale])}" />
${articleTags}
    <link rel="alternate" hreflang="pt-BR" href="${ptUrl}" />
    <link rel="alternate" hreflang="en-US" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${ptUrl}" />
    <script type="application/ld+json">${jsonLd}</script>`;

  return html.replace('</head>', `${articleMeta}\n  </head>`);
}

function main() {
  const templatePath = resolve(DIST_DIR, 'index.html');
  if (!existsSync(templatePath)) {
    console.error('dist/index.html not found — run vite build first');
    process.exit(1);
  }

  const template = readFileSync(templatePath, 'utf-8');
  let count = 0;

  for (const article of articles) {
    // PT-BR version
    const ptPath = resolve(DIST_DIR, `insights/${article.slug}/index.html`);
    const ptDir = dirname(ptPath);
    if (!existsSync(ptDir)) mkdirSync(ptDir, { recursive: true });
    writeFileSync(ptPath, buildArticleHtml(template, article, ptInsights, 'pt-BR', ''));

    // EN-US version
    const enPath = resolve(DIST_DIR, `en/insights/${article.slug}/index.html`);
    const enDir = dirname(enPath);
    if (!existsSync(enDir)) mkdirSync(enDir, { recursive: true });
    writeFileSync(enPath, buildArticleHtml(template, article, enInsights, 'en-US', '/en'));

    count++;
  }

  let channelCount = 0;
  for (const article of channelArticles) {
    const ptPath = resolve(DIST_DIR, `artigos/${article.slug}/index.html`);
    mkdirSync(dirname(ptPath), { recursive: true });
    writeFileSync(ptPath, buildChannelArticleHtml(template, article, 'pt'));

    const enPath = resolve(DIST_DIR, `en/artigos/${article.slug}/index.html`);
    mkdirSync(dirname(enPath), { recursive: true });
    writeFileSync(enPath, buildChannelArticleHtml(template, article, 'en'));
    channelCount++;
  }

  console.log(`SEO meta injected: ${count} articles × 2 languages = ${count * 2} files`);
  console.log(`Channel article SEO meta injected: ${channelCount} × 2 languages = ${channelCount * 2} files`);
}

main();
