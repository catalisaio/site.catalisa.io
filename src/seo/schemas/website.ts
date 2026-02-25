import { BASE_URL } from '../routes';

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Catalisa',
    url: BASE_URL,
    inLanguage: ['pt-BR', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
