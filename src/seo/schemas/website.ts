import { BASE_URL } from '../routes';

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    publisher: { '@id': `${BASE_URL}/#organization` },
    name: 'Catalisa',
    url: BASE_URL,
    inLanguage: ['pt-BR', 'en-US'],
  };
}
