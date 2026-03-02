import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import sharp from 'sharp';
import { articles, categoryLabelKeys } from '../src/data/articles';
import type { ArticleCategory } from '../src/data/articles';

const OUT_DIR = resolve(process.cwd(), 'dist', 'og', 'insights');
const WIDTH = 1200;
const HEIGHT = 630;

// Brand gradient stops per category
const categoryGradients: Record<ArticleCategory, [string, string]> = {
  varejo: ['#6B46C1', '#9F7AEA'],
  'food-tech': ['#C05621', '#ED8936'],
  atendimento: ['#2B6CB0', '#4299E1'],
  'conversational-commerce': ['#276749', '#48BB78'],
  estrategia: ['#975A16', '#ECC94B'],
  financeiro: ['#2C7A7B', '#4FD1C5'],
};

// Resolve pt-BR titles from the translation file
const insightsJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src', 'i18n', 'locales', 'pt-BR', 'insights.json'), 'utf-8'),
);

function resolveTitle(titleKey: string): string {
  // titleKey = "insights.articles.boticario.title"
  const parts = titleKey.replace('insights.', '').split('.');
  let value: unknown = insightsJson;
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }
  return (value as string) || titleKey;
}

function resolveCategoryLabel(category: ArticleCategory): string {
  const key = categoryLabelKeys[category]; // "insights.categories.varejo"
  const parts = key.replace('insights.', '').split('.');
  let value: unknown = insightsJson;
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }
  return (value as string) || category;
}

function resolveMetricValue(valueKey: string): string {
  const parts = valueKey.replace('insights.', '').split('.');
  let value: unknown = insightsJson;
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }
  // metrics are stored as arrays: articles.boticario.metrics[0].value
  return (value as string) || '';
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wordWrap(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (lines.length >= maxLines) break;
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  } else if (current && lines.length === maxLines) {
    // Truncate last line with ellipsis
    const last = lines[maxLines - 1];
    if (last) {
      lines[maxLines - 1] = last.length > maxCharsPerLine - 3
        ? last.slice(0, maxCharsPerLine - 3) + '...'
        : last;
    }
  }

  return lines;
}

function buildSvg(
  title: string,
  categoryLabel: string,
  metricValue: string,
  metricLabel: string,
  gradientFrom: string,
  gradientTo: string,
): string {
  const titleLines = wordWrap(title, 38, 3);
  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="60" y="${260 + i * 52}" fill="#FFFFFF" font-family="sans-serif" font-size="42" font-weight="bold">${escapeXml(line)}</text>`,
    )
    .join('\n    ');

  const metricY = 260 + titleLines.length * 52 + 30;

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientFrom}"/>
      <stop offset="100%" stop-color="${gradientTo}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <!-- Overlay for depth -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="rgba(0,0,0,0.15)"/>
  <!-- Category badge -->
  <rect x="60" y="170" width="${categoryLabel.length * 12 + 32}" height="36" rx="18" fill="rgba(255,255,255,0.2)"/>
  <text x="76" y="194" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="600" text-transform="uppercase">${escapeXml(categoryLabel.toUpperCase())}</text>
  <!-- Title -->
  ${titleSvg}
  <!-- Metric -->
  ${metricValue ? `<text x="60" y="${metricY}" fill="rgba(255,255,255,0.9)" font-family="sans-serif" font-size="24" font-weight="bold">${escapeXml(metricValue)}</text>
  <text x="${60 + metricValue.length * 16 + 12}" y="${metricY}" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-size="18">${escapeXml(metricLabel)}</text>` : ''}
  <!-- Branding -->
  <text x="60" y="${HEIGHT - 40}" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="16" font-weight="600">catalisa.io</text>
  <text x="${WIDTH - 60}" y="${HEIGHT - 40}" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="14" text-anchor="end">Insights</text>
</svg>`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let count = 0;
  for (const article of articles) {
    const title = resolveTitle(article.titleKey);
    const categoryLabel = resolveCategoryLabel(article.category);
    const [gradientFrom, gradientTo] = categoryGradients[article.category];

    // Get first metric for display
    const firstMetric = article.metrics[0];
    const metricValue = firstMetric ? resolveMetricValue(firstMetric.valueKey) : '';
    const metricLabel = firstMetric ? resolveMetricValue(firstMetric.labelKey) : '';

    const svg = buildSvg(title, categoryLabel, metricValue, metricLabel, gradientFrom, gradientTo);
    const outPath = resolve(OUT_DIR, `${article.slug}.png`);

    await sharp(Buffer.from(svg)).png().toFile(outPath);
    count++;
  }

  console.log(`OG images generated: ${count} files in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error('Failed to generate OG images:', err);
  process.exit(1);
});
