/** Read-only HTTP verification of the exact public documentation URLs in the catalog. */
import fs from 'node:fs/promises';
const catalog = JSON.parse(await fs.readFile('src/redesign/data/catalog.json', 'utf8'));
const results = [];
for (const block of catalog.blocks) {
  const url = new URL(block.source);
  if (url.origin !== 'https://docs.catalisa.app' || !url.pathname.startsWith('/blocks/')) throw Error('Unexpected documentation origin');
  const started = Date.now();
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(12000) });
    const finalUrl = new URL(response.url);
    if (finalUrl.origin !== url.origin) {
      await response.body?.cancel();
      results.push({ slug: block.slug, url: url.href, status: response.status, passed: false, reason: 'different-origin-redirect' });
      continue;
    }
    const reader = response.body?.getReader();
    const chunks = []; let size = 0;
    if (reader) while (true) {
      const part = await reader.read(); if (part.done) break;
      size += part.value.byteLength;
      if (size > 2000000) { await reader.cancel(); throw Error('response-size-limit'); }
      chunks.push(part.value);
    }
    const html = Buffer.concat(chunks).toString('utf8');
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
    const samePath = finalUrl.pathname.replace(/\/$/, '') === url.pathname.replace(/\/$/, '');
    const errorPage = /\b404\b|not found|p[aá]gina n[aã]o encontrada|sign in|log in|entrar na conta/i.test(title + ' ' + h1);
    const passed = response.status === 200 && samePath && /text\/html/i.test(response.headers.get('content-type') ?? '') && Boolean(title) && !errorPage;
    results.push({ slug: block.slug, url: url.href, finalUrl: finalUrl.href, status: response.status, title, h1, passed, elapsedMs: Date.now() - started });
  } catch (error) {
    results.push({ slug: block.slug, url: url.href, passed: false, elapsedMs: Date.now() - started, reason: error.name === 'TimeoutError' ? 'timeout' : 'request-failed' });
  }
}
const report = { checkedAt: new Date().toISOString(), passed: results.length === 39 && results.every(item => item.passed), scope: 'Read-only HTTPS GET of39 catalog documentation URLs. Validates HTTP/content type/title and path without login/not-found redirects. Does not prove product maturity, runtime availability, fragment anchors, licenses or owner approval.', results };
await fs.writeFile('docs/redesign-2026-10-22/qa/capability-curation/public-doc-links.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, checked: results.length, failures: results.filter(item => !item.passed).map(({ slug, status, reason, finalUrl }) => ({ slug, status, reason, finalUrl })) }));
if (!report.passed) process.exitCode = 1;
