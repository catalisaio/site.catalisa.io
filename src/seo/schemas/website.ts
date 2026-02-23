import { BASE_URL } from '../routes';

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Catalisa',
    url: BASE_URL,
    inLanguage: ['pt-BR', 'en-US'],
  };
}
