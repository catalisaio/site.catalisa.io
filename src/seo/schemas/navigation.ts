import { BASE_URL } from '../routes';

export function getSiteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    hasPart: [
      // Platform
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
      // Industries
      {
        '@type': 'WebPage',
        name: 'Fintech',
        url: `${BASE_URL}/fintech`,
      },
      {
        '@type': 'WebPage',
        name: 'Banking',
        url: `${BASE_URL}/bancario`,
      },
      {
        '@type': 'WebPage',
        name: 'Insurance',
        url: `${BASE_URL}/seguros`,
      },
      {
        '@type': 'WebPage',
        name: 'Retail',
        url: `${BASE_URL}/varejo`,
      },
      {
        '@type': 'WebPage',
        name: 'Startups',
        url: `${BASE_URL}/startups`,
      },
      // Resources
      {
        '@type': 'WebPage',
        name: 'Casos de Uso',
        url: `${BASE_URL}/casos-de-uso`,
      },
      {
        '@type': 'WebPage',
        name: 'Como Funciona',
        url: `${BASE_URL}/como-funciona`,
      },
      {
        '@type': 'WebPage',
        name: 'Demo',
        url: `${BASE_URL}/demo`,
      },
      {
        '@type': 'WebPage',
        name: 'WhatsApp Integration',
        url: `${BASE_URL}/integracoes/whatsapp`,
      },
      // Company
      {
        '@type': 'WebPage',
        name: 'Seguranca',
        url: `${BASE_URL}/seguranca`,
      },
      {
        '@type': 'WebPage',
        name: 'Contato',
        url: `${BASE_URL}/contato`,
      },
    ],
  };
}
