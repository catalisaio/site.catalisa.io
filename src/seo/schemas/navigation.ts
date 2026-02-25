import { BASE_URL } from '../routes';

export function getSiteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'Studio',
        url: `${BASE_URL}/studio`,
      },
      {
        '@type': 'WebPage',
        name: 'AI Agents',
        url: `${BASE_URL}/ai-agents`,
      },
      {
        '@type': 'WebPage',
        name: 'Apps & Backends',
        url: `${BASE_URL}/apps`,
      },
      {
        '@type': 'WebPage',
        name: 'Building Blocks',
        url: `${BASE_URL}/building-blocks`,
      },
      {
        '@type': 'WebPage',
        name: 'Workflows',
        url: `${BASE_URL}/workflows`,
      },
      {
        '@type': 'WebPage',
        name: 'Casos de Uso',
        url: `${BASE_URL}/casos-de-uso`,
      },
      {
        '@type': 'WebPage',
        name: 'Demo',
        url: `${BASE_URL}/demo`,
      },
      {
        '@type': 'WebPage',
        name: 'Contact',
        url: `${BASE_URL}/contato`,
      },
    ],
  };
}
