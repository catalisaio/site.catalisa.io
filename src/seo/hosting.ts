import type { BuildPage } from './build-pages';
import type { SiteBuildMode } from './release';
import { authenticatedPrefixes } from './migration';

/** Import inside the Caddy site block, after the dedicated API handles. Static files live at /srv. */
export function renderCaddyHosting(mode: SiteBuildMode, pages: BuildPage[], redirects: Record<string, string>, globalNoIndex = mode.redesign && !mode.indexing) {
  const noIndexPaths = [...new Set([
    '/spa.html', '/404.html', '/design-system', '/design-system/*',
    ...authenticatedPrefixes.flatMap(prefix => [prefix, prefix + '/*']),
    ...pages.filter(page => page.noIndex).flatMap(page => [page.path, ...(page.path === '/' ? [] : [page.path + '/'])]),
  ])];
  const documentPaths = [...new Set(['/index.html', '/spa.html', '/404.html', ...pages.flatMap(page => [page.path, ...(page.path === '/' ? [] : [page.path + '/'])])])];
  // The map retains the raw query, adding '?' only when it exists.
  const lines = [
    '# Generated from site-build.json by scripts/generate-hosting.ts. Do not edit.',
    '# Docs: https://caddyserver.com/docs/caddyfile/directives/map',
    'map {query} {site_query_suffix} {', '  "" ""', '  ~^(.+)$ "?${1}"', '}',
    ...(globalNoIndex ? ['header X-Robots-Tag "noindex, nofollow"'] : [
      `@site_noindex path ${noIndexPaths.join(' ')}`, 'header @site_noindex X-Robots-Tag "noindex, nofollow"',
    ]),
    `@site_documents path ${documentPaths.join(' ')}`,
    'header @site_documents Cache-Control "no-cache"',
    'header /assets/* Cache-Control "public, max-age=31536000, immutable"',
    'header /screenshots/* Cache-Control "public, max-age=2592000, must-revalidate"',
    'header /videos/* Cache-Control "public, max-age=2592000, must-revalidate"',
    'header /sitemap.xml Cache-Control "public, max-age=86400"',
  ];
  Object.entries(redirects).forEach(([source, target], index) => {
    lines.push(`@site_alias_${index} path ${source} ${source}/`, `redir @site_alias_${index} ${target}{site_query_suffix} 301`);
  });
  // Canonicals use no trailing slash; disable file_server's directory redirect to avoid a loop.
  pages.filter(page => page.path !== '/').forEach(page => lines.push(`redir ${page.path}/ ${page.path}{site_query_suffix} 301`));
  lines.push(
    `@site_authenticated path ${authenticatedPrefixes.flatMap(prefix => [prefix, prefix + '/*']).join(' ')}`,
    'handle @site_authenticated {', '  root * /srv', '  rewrite * /spa.html', '  file_server {', '    disable_canonical_uris', '  }', '}',
    'handle {', '  root * /srv', '  try_files {path}/index.html {path} =404',
    '  file_server {', '    disable_canonical_uris', '    hide site-hosting.caddy _redirects _headers', '  }', '}',
    'handle_errors 404 {', '  root * /srv', '  rewrite * /404.html', '  header X-Robots-Tag "noindex, nofollow"',
    '  file_server {', '    status 404', '    disable_canonical_uris', '  }', '}',
  );
  return lines.join('\n') + '\n';
}
