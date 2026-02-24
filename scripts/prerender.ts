import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const DIST_DIR = resolve(process.cwd(), 'dist');
const PORT = 4173;

// All routes to pre-render (both languages)
const routes = [
  // pt-BR
  '/', '/studio', '/ai-agents', '/building-blocks', '/workflows',
  '/fintech', '/bancario', '/seguros', '/varejo', '/startups',
  '/use-cases', '/contato', '/demo', '/politica-privacidade',
  '/press-kit', '/apresentacao-comercial',
  // en-US
  '/en', '/en/studio', '/en/ai-agents', '/en/building-blocks', '/en/workflows',
  '/en/fintech', '/en/banking', '/en/insurance', '/en/retail', '/en/startups',
  '/en/use-cases', '/en/contact', '/en/demo', '/en/privacy-policy',
  '/en/press-kit', '/en/commercial-presentation',
];

// Simple static file server for dist/
function createStaticServer(): ReturnType<typeof createServer> {
  const indexHtml = readFileSync(resolve(DIST_DIR, 'index.html'), 'utf-8');

  const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };

  return createServer((req, res) => {
    const url = req.url || '/';
    const filePath = resolve(DIST_DIR, url.slice(1));

    // Try serving static file
    if (existsSync(filePath) && !filePath.endsWith('/')) {
      try {
        const data = readFileSync(filePath);
        const ext = '.' + filePath.split('.').pop();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
        return;
      } catch {
        // Fall through to SPA fallback
      }
    }

    // SPA fallback
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
  });
}

async function prerender() {
  console.log('Starting pre-render...');

  const server = createStaticServer();
  await new Promise<void>((res) => server.listen(PORT, res));
  console.log(`Static server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let rendered = 0;
  for (const route of routes) {
    const page = await browser.newPage();

    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 15000,
      });

      // Wait for our custom app-rendered event or timeout
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          if (document.querySelector('#root')?.childNodes.length) {
            resolve();
            return;
          }
          document.addEventListener('app-rendered', () => resolve(), { once: true });
          setTimeout(resolve, 5000);
        });
      });

      // Small extra delay for async meta tags
      await new Promise((r) => setTimeout(r, 500));

      const html = await page.content();

      // Determine output path
      const outputPath = route === '/'
        ? resolve(DIST_DIR, 'index.html')
        : resolve(DIST_DIR, `${route.slice(1)}/index.html`);

      const outputDir = dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      writeFileSync(outputPath, `<!DOCTYPE html>${html.replace(/^<!DOCTYPE html>/i, '')}`, 'utf-8');
      rendered++;
      console.log(`  [${rendered}/${routes.length}] ${route}`);
    } catch (err) {
      console.error(`  FAILED: ${route}`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPre-rendering complete: ${rendered}/${routes.length} routes`);
}

prerender().catch((err) => {
  console.error('Pre-render failed:', err);
  process.exit(1);
});
