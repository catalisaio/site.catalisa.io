import { normalizePath, routes } from './routes';
import{parseSitePath,sitePathAliases}from'../redesign/i18n/routes';

/** Only direct content replacements redirect; archives and specialist/legal pages stay available. */
export const redesignRedirects:Readonly<Record<string,string>>=sitePathAliases;
export const permanentAliases: Readonly<Record<string, string>> = {
  '/use-cases': '/casos-de-uso', '/playbooks': '/casos-de-uso',
  '/en/playbooks': '/en/use-cases', '/insights/magazine': '/insights',
  '/en/insights/magazine': '/en/insights',
};
export const authenticatedPrefixes = ['/apresentacao', '/en/presentation', '/treinamento', '/en/training'];
export function getMigrationTarget(path: string, redesign: boolean) {
  const normalized = normalizePath(path);
  return (redesign ? redesignRedirects[normalized] : undefined) ?? permanentAliases[normalized];
}
/** Explicit compatibility boundary, never a catch-all fallback from the new site. */
export function isLegacyCompatibilityPath(path: string) {
  const normalized = normalizePath(path);
  if(parseSitePath(normalized))return false;
  if (normalized === '/en' || normalized.startsWith('/en/')) return true;
  if (authenticatedPrefixes.some(prefix => normalized === prefix || normalized.startsWith(prefix + '/'))) return true;
  if (/^\/(insights|playbooks)(\/|$)/.test(normalized)) return true;
  return routes.some(route => route.ptPath === normalized) && ![
    '/', '/studio', '/workflows', '/contato', '/press-kit', ...Object.keys(redesignRedirects),
  ].includes(normalized);
}
