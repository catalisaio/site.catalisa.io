/**
 * URL vocabulary for the independently authored site. No React, legacy i18n,
 * SEO inventory or content imports: safe in bootstrap, build and server code.
 *
 * A mapped URL is not evidence of translated content. The build/SEO integration
 * must separately require a completed translation before emitting HTML,
 * hreflang or sitemap entries. /design-system remains noindex in every locale.
 */
import {enabledSiteLocales, siteLocaleInfo} from '../../../shared/site-locale';
import type {SiteLocale} from '../../../shared/site-locale';
export type {SiteLocale} from '../../../shared/site-locale';
export const supportedSiteLocales = enabledSiteLocales;
export type SupportedSiteLocale = typeof supportedSiteLocales[number];
const allSiteLocales = Object.keys(siteLocaleInfo) as SiteLocale[];
export const optionalSiteLocales = allSiteLocales.filter(locale => !enabledSiteLocales.includes(locale));
/** Slash-prefixed URL shape; shared/site-locale is the activation authority. */
export const siteLocaleDefinitions = Object.fromEntries(allSiteLocales.map(locale => [locale, {
  prefix: siteLocaleInfo[locale].prefix ? '/' + siteLocaleInfo[locale].prefix : '',
  label: siteLocaleInfo[locale].label,
  enabled: enabledSiteLocales.includes(locale),
}])) as Record<SiteLocale, {prefix: string; label: string; enabled: boolean}>;

export function localeLabel(locale: SiteLocale): string {
  return siteLocaleDefinitions[locale].label;
}

const translatedLocales = ['en-US', 'de-DE', 'es-ES', 'da-DK', 'nl-NL', 'fr-FR', 'lb-LU'] as const;
type TranslatedPaths = readonly [string, string, string, string, string, string, string];

/** Relative slugs after the locale prefix. Product names retain their identity. */
const pageSlugs: Readonly<Record<string, TranslatedPaths>> = {
  '/': ['', '', '', '', '', '', ''],
  '/assistente-operacional': ['operational-assistant', 'operativer-assistent', 'asistente-operativo', 'driftsassistent', 'operationele-assistent', 'assistant-operationnel', 'operationellen-assistent'],
  '/design-system': ['design-system', 'designsystem', 'sistema-de-diseno', 'designsystem', 'designsysteem', 'systeme-de-design', 'design-system'],
  '/capacidades': ['capabilities', 'faehigkeiten', 'capacidades', 'funktioner', 'mogelijkheden', 'capacites', 'kapaziteiten'],
  '/visao': ['vision', 'vision', 'vision', 'vision', 'visie', 'vision', 'visioun'],
  '/arquitetura': ['architecture', 'architektur', 'arquitectura', 'arkitektur', 'architectuur', 'architecture', 'architektur'],
  '/desenvolvedores': ['developers', 'entwickler', 'desarrolladores', 'udviklere', 'ontwikkelaars', 'developpeurs', 'entweckler'],
  '/studio': ['studio', 'studio', 'studio', 'studio', 'studio', 'studio', 'studio'],
  '/workflows': ['workflows', 'workflows', 'workflows', 'workflows', 'workflows', 'workflows', 'workflows'],
  '/agentes': ['ai-agents', 'ki-agenten', 'agentes-ia', 'ai-agenter', 'ai-agenten', 'agents-ia', 'ki-agenten'],
  '/governanca': ['governance', 'governance', 'gobernanza', 'governance', 'governance', 'gouvernance', 'gouvernance'],
  '/composicoes': ['compositions', 'kompositionen', 'composiciones', 'sammensaetninger', 'composities', 'compositions', 'kompositiounen'],
  '/ecossistema': ['ecosystem', 'oekosystem', 'ecosistema', 'oekosystem', 'ecosysteem', 'ecosysteme', 'ekosystem'],
  '/produtos': ['products', 'produkte', 'productos', 'produkter', 'producten', 'produits', 'produiten'],
  '/ecossistema/banking': ['ecosystem/banking', 'oekosystem/banking', 'ecosistema/banking', 'oekosystem/banking', 'ecosysteem/banking', 'ecosysteme/banking', 'ekosystem/banking'],
  '/ecossistema/credit': ['ecosystem/credit', 'oekosystem/credit', 'ecosistema/credit', 'oekosystem/credit', 'ecosysteem/credit', 'ecosysteme/credit', 'ekosystem/credit'],
  '/ecossistema/med': ['ecosystem/med', 'oekosystem/med', 'ecosistema/med', 'oekosystem/med', 'ecosysteem/med', 'ecosysteme/med', 'ekosystem/med'],
  '/ecossistema/juridico': ['ecosystem/legal', 'oekosystem/recht', 'ecosistema/juridico', 'oekosystem/jura', 'ecosysteem/juridisch', 'ecosysteme/juridique', 'ekosystem/juristesch'],
  '/ecossistema/biometrics': ['ecosystem/biometrics', 'oekosystem/biometrics', 'ecosistema/biometrics', 'oekosystem/biometrics', 'ecosysteem/biometrics', 'ecosysteme/biometrics', 'ekosystem/biometrics'],
  '/ecossistema/decision': ['ecosystem/decision', 'oekosystem/decision', 'ecosistema/decision', 'oekosystem/decision', 'ecosysteem/decision', 'ecosysteme/decision', 'ekosystem/decision'],
  '/perspectivas': ['perspectives', 'perspektiven', 'perspectivas', 'perspektiver', 'perspectieven', 'perspectives', 'perspektiven'],
  '/perspectivas/construir-por-composicao': ['perspectives/building-by-composition', 'perspektiven/aufbau-durch-komposition', 'perspectivas/construir-por-composicion', 'perspektiver/byg-med-sammensaetning', 'perspectieven/bouwen-door-compositie', 'perspectives/construire-par-composition', 'perspektiven/bauen-duerch-kompositioun'],
  '/perspectivas/autonomia-responsabilidade': ['perspectives/autonomy-and-responsibility', 'perspektiven/autonomie-und-verantwortung', 'perspectivas/autonomia-y-responsabilidad', 'perspektiver/autonomi-og-ansvar', 'perspectieven/autonomie-en-verantwoordelijkheid', 'perspectives/autonomie-et-responsabilite', 'perspektiven/autonomie-a-verantwortung'],
  '/perspectivas/regra-legivel': ['perspectives/readable-rules', 'perspektiven/lesbare-regeln', 'perspectivas/reglas-legibles', 'perspektiver/laesbare-regler', 'perspectieven/leesbare-regels', 'perspectives/regles-lisibles', 'perspektiven/liesbar-reegelen'],
  '/perspectivas/open-finance-da-conexao-ao-produto': ['perspectives/open-finance-from-connection-to-product', 'perspektiven/open-finance-von-der-verbindung-zum-produkt', 'perspectivas/open-finance-de-la-conexion-al-producto', 'perspektiver/open-finance-fra-forbindelse-til-produkt', 'perspectieven/open-finance-van-verbinding-naar-product', 'perspectives/open-finance-de-la-connexion-au-produit', 'perspektiven/open-finance-vun-der-verbindung-zum-produkt'],
  '/perspectivas/resiliencia-e-liberdade-de-evoluir': ['perspectives/resilience-and-freedom-to-evolve', 'perspektiven/resilienz-und-freiheit-zur-weiterentwicklung', 'perspectivas/resiliencia-y-libertad-para-evolucionar', 'perspektiver/robusthed-og-frihed-til-at-udvikle', 'perspectieven/veerkracht-en-vrijheid-om-te-evolueren', 'perspectives/resilience-et-liberte-devoluer', 'perspektiven/widderstandsfaeegkeet-a-fraeheet-fir-sech-ze-entweckelen'],
  '/interfaces': ['interfaces', 'oberflaechen', 'interfaces', 'brugerflader', 'interfaces', 'interfaces', 'interfaces'],
  '/press-kit': ['press-kit', 'pressekit', 'kit-de-prensa', 'pressekit', 'perskit', 'kit-presse', 'pressekit'],
  '/fontes': ['sources', 'quellen', 'fuentes', 'kilder', 'bronnen', 'sources', 'quellen'],
  '/mapa': ['sitemap', 'sitemap', 'mapa-del-sitio', 'sitemap', 'sitemap', 'plan-du-site', 'sitemap'],
  '/contato': ['contact', 'kontakt', 'contacto', 'kontakt', 'contact', 'contact', 'kontakt'],
  '/lab': ['lab', 'lab', 'lab', 'lab', 'lab', 'lab', 'lab'],
  '/politica-privacidade': ['privacy-policy', 'datenschutz', 'politica-de-privacidad', 'privatlivspolitik', 'privacybeleid', 'politique-de-confidentialite', 'dateschutz'],
  '/termos': ['terms', 'nutzungsbedingungen', 'terminos', 'vilkaar', 'voorwaarden', 'conditions-utilisation', 'notzungsbedingungen'],
};

/** Technical API/block identifiers never change across locales. */
const capabilitySlugs = [
  'ai-engine', 'analytics', 'api-keys', 'audit-trail', 'baas', 'banking',
  'banking-product-portfolio', 'billing', 'biometrics', 'bureaus',
  'calculations-engine', 'calendar', 'cms', 'commerce', 'companies', 'customers',
  'data-extraction', 'data-store', 'decision-engine', 'decision-platform',
  'document-template', 'e-signature', 'email', 'feature-flags', 'file-storage',
  'iam', 'meta-account', 'open-finance', 'payments', 'people', 'pricing-engine',
  'products', 'rooms', 'service-attestations', 'slack', 'sso', 'webhooks-engine',
  'wpp', 'wpp-business',
] as const;

export const siteBasePaths: readonly string[] = Object.freeze([
  ...Object.keys(pageSlugs), ...capabilitySlugs.map(slug => `/capacidades/${slug}`),
]);

const pathsByLocale = new Map<SiteLocale, ReadonlyMap<string, string>>();
const baseByLocalizedPath = new Map<string, {locale: SupportedSiteLocale; basePath: string}>();

function prefixedPath(locale: SiteLocale, slug: string): string {
  const prefix = siteLocaleDefinitions[locale].prefix;
  return slug ? `${prefix}/${slug}` : prefix || '/';
}

for (const locale of allSiteLocales) {
  const paths = new Map<string, string>();
  const translatedIndex = translatedLocales.indexOf(locale as typeof translatedLocales[number]);
  for (const [basePath, slugs] of Object.entries(pageSlugs)) {
    paths.set(basePath, locale === 'pt-BR' ? basePath : prefixedPath(locale, slugs[translatedIndex]));
  }
  const catalogPath = paths.get('/capacidades')!;
  for (const slug of capabilitySlugs) paths.set(`/capacidades/${slug}`, `${catalogPath}/${slug}`);
  if (new Set(paths.values()).size !== paths.size) throw new Error(`Duplicate site paths for ${locale}`);
  pathsByLocale.set(locale, paths);
  if (siteLocaleDefinitions[locale].enabled) {
    for (const [basePath, localizedPath] of paths) {
      baseByLocalizedPath.set(localizedPath, {locale: locale as SupportedSiteLocale, basePath});
    }
  }
}

/** These aliases replace the same institutional subject, never an archive entry. */
export const sitePathAliases: Readonly<Record<string, string>> = Object.freeze({
  '/ecossistema/recrutamento':'/produtos',
  '/en/ecosystem/recruitment':'/en/products',
  '/de/oekosystem/recruiting':'/de/produkte',
  '/es/ecosistema/reclutamiento':'/es/productos',
  '/da/oekosystem/rekruttering':'/da/produkter',
  '/nl/ecosysteem/werving':'/nl/producten',
  '/fr/ecosysteme/recrutement':'/fr/produits',
  '/design-system/home': '/',
  '/ai-agents': '/agentes',
  '/apps': '/ecossistema',
  '/building-blocks': '/capacidades',
  '/bancario': '/ecossistema/banking',
  '/en/design-system/home': '/en',
  '/en/agents': '/en/ai-agents',
  '/en/building-blocks': '/en/capabilities',
  '/en/apps': '/en/ecosystem',
  '/en/banking': '/en/ecosystem/banking',
});

function normalizeSitePath(path: string): string | undefined {
  // Accept pathname/query/hash from same-site links, never an external URL.
  if (!path.startsWith('/') || path.startsWith('//')) return undefined;
  return path.split(/[?#]/, 1)[0].replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
}

export interface ParsedSitePath {
  locale: SupportedSiteLocale;
  /** Existing Portuguese route key, independent of the address being rendered. */
  basePath: string;
  /** Localized canonical pathname; query and fragment stay with the caller. */
  canonicalPath: string;
}

/**
 * Unknown, legacy-archive and private paths return undefined. Callers must use
 * explicit legacy/private routing or a real 404, never translate a prefix alone.
 */
export function parseSitePath(path: string): ParsedSitePath | undefined {
  const normalized = normalizeSitePath(path);
  if (!normalized) return undefined;
  const canonicalPath = sitePathAliases[normalized] ?? normalized;
  const route = baseByLocalizedPath.get(canonicalPath);
  return route ? {...route, canonicalPath} : undefined;
}

/** Only mapped Portuguese route keys are accepted; unsupported routes fail closed. */
export function localizeSitePath(basePath: string, locale: SiteLocale): string {
  if (!siteLocaleDefinitions[locale]?.enabled) throw new RangeError(`Site locale is disabled: ${locale}`);
  const normalized = normalizeSitePath(basePath);
  const key = normalized ? sitePathAliases[normalized] ?? normalized : undefined;
  const localized = key ? pathsByLocale.get(locale)?.get(key) : undefined;
  if (!localized) throw new RangeError(`Unknown new-site base path: ${basePath}`);
  return localized;
}

/** Prefix detection for a language-specific 404; this does not assert a route exists. */
export function getSiteLocale(path: string): SupportedSiteLocale {
  const normalized = normalizeSitePath(path);
  return supportedSiteLocales.find(locale => {
    const prefix = siteLocaleDefinitions[locale].prefix;
    return !!prefix && !!normalized && (normalized === prefix || normalized.startsWith(prefix + '/'));
  }) ?? 'pt-BR';
}

/**
 * Integration boundaries:
 * - /insights, /playbooks, legacy specialist pages and their existing /en forms
 *   retain their current app/content, canonicals and actual PT/EN alternates.
 *   Do not generate /de, /es, /da or /nl copies of that archive.
 * - /apresentacao, /treinamento and /en/presentation, /en/training (including
 *   login/deep links) stay private compatibility routes, outside this map.
 * - Existing EN institutional URLs above are reused by the translated new site
 *   only when its real EN content is complete. EN aliases redirect then, with
 *   query/hash preserved by hosting/bootstrap. Unknown EN paths remain legacy
 *   candidates; unknown other-locale paths are 404, not Portuguese fallbacks.
 * - Legal routes are mapped for shared locale navigation/SEO. Their current
 *   compatibility renderer remains in place until integration explicitly
 *   provides the translated legal content and preserves app/CSS isolation.
 * - Emit reciprocal alternates only for the completed translations of this
 *   exact basePath. x-default points to its Portuguese canonical. Never make
 *   every translated home an alternate of an untranslated article.
 */
