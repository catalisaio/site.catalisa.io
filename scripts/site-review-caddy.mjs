// Hosting-only staging overrides. Public/server artifact bytes remain untouched.
export const reviewHeaders = ` header {
  X-Robots-Tag "noindex, nofollow, noarchive"
  Cache-Control "no-store"
  defer
 }
`;
export const reviewRobots = ` handle /robots.txt {
  header Content-Type "text/plain; charset=utf-8"
  respond <<ROBOTS
User-agent: *
Disallow: /
ROBOTS
 }
`;
export function reviewHostingInclude(source) {
  // Caddy handles file errors outside the initial middleware chain. Apply the
  // same final headers in that chain too, without changing the original include.
  const patched = source.replace(/(handle_errors(?:\s+[^\n{]+)?\s*\{)/g, '$1\n'+reviewHeaders);
  return '# Staging review overlay; original public/site-hosting.caddy is unchanged.\n'+patched;
}
