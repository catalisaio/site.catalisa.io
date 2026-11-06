import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {enabledSiteLocales} from '../shared/site-locale';
import type {SiteLocale} from '../shared/site-locale';
import {installSiteMessages, translateForLocale, getMissingSiteTranslations} from '../src/redesign/i18n/runtime';
import technicalTerms from '../src/redesign/i18n/technical-terms.json';

interface SourceEntry {source:string}
interface SourceCatalog {messages:SourceEntry[]}
const protectedTerms = new Set<string>(technicalTerms);
const tokens = (text:string) => [...text.matchAll(/\{([a-zA-Z_][\w]*)\}/g)].map(match=>match[1]).sort();
let installed = false;

/** Load the exact browser dictionaries into Node before generating localized metadata. */
export function installBuildSiteLocales(): void {
  if (installed) return;
  const qa = resolve('docs/redesign-2026-10-22/qa/localization');
  const sourceFiles = ['source-catalog.json', ...readdirSync(qa).filter(file=>/^source(?:-[a-z]+)*-additions\.json$/.test(file)).sort()];
  const sources = new Set<string>();
  for (const file of sourceFiles) {
    const catalog = JSON.parse(readFileSync(resolve(qa,file),'utf8')) as SourceCatalog;
    for (const entry of catalog.messages) if (entry.source.trim()) sources.add(entry.source);
  }
  const mediaSources = resolve('docs/redesign-2026-10-22/qa/media-refresh/source-additions.json');
  if (existsSync(mediaSources)) for (const entry of (JSON.parse(readFileSync(mediaSources,'utf8')) as SourceCatalog).messages) if(entry.source.trim()) sources.add(entry.source);
  for (const locale of enabledSiteLocales) {
    if (locale === 'pt-BR') continue;
    const file = resolve('src/redesign/i18n/locales',locale+'.json');
    if (!existsSync(file)) throw new Error(`Missing enabled site dictionary: ${locale}`);
    const dictionary = JSON.parse(readFileSync(file,'utf8')) as {locale?:SiteLocale;messages:Record<string,string>};
    if (dictionary.locale !== locale || !dictionary.messages || typeof dictionary.messages !== 'object') throw new Error(`Invalid site dictionary: ${locale}`);
    const missing:string[] = [], invalid:string[] = [];
    for (const source of sources) {
      if (protectedTerms.has(source.trim())) continue;
      const translated = dictionary.messages[source] ?? dictionary.messages[source.trim()];
      if (typeof translated !== 'string' || !translated.trim()) missing.push(source);
      else if (JSON.stringify(tokens(source)) !== JSON.stringify(tokens(translated))) invalid.push(source);
    }
    if (missing.length || invalid.length) throw new Error(`Incomplete site dictionary ${locale}: ${missing.length} missing, ${invalid.length} placeholder mismatches. Examples: ${JSON.stringify([...missing,...invalid].slice(0,8))}`);
    installSiteMessages(locale,dictionary);
  }
  installed = true;
}

/** No implicit Portuguese metadata fallback after generators exercise the dictionaries. */
export function assertBuildSiteLocaleCoverage(): void {
  for (const locale of enabledSiteLocales) {
    if (locale === 'pt-BR') continue;
    const missing = getMissingSiteTranslations(locale);
    if (missing.length) throw new Error(`Untranslated generated metadata for ${locale}: ${missing.length} keys. Examples: ${JSON.stringify(missing.slice(0,8))}`);
  }
}

export function expectedPublicSnapshotHeading(basePath:string,locale:SiteLocale): string | undefined {
  const parts = basePath === '/contato' ? ['Converse sobre o que sua empresa precisa.'] : basePath === '/lab' ? ['Descreva sua ideia e explore um conceito de produto.'] : undefined;
  return parts?.map(source=>translateForLocale(locale,source)).join('');
}
