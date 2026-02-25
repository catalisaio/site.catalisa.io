import { BASE_URL } from '../routes';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Catalisa',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: 'Plataforma B2B de automacao WhatsApp com IA para fintechs e empresas brasileiras',
    foundingDate: '2023',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+55-11-97730-3414',
        contactType: 'sales',
        availableLanguage: ['Portuguese', 'English'],
        areaServed: 'BR',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+55-11-97730-3414',
        contactType: 'customer support',
        availableLanguage: ['Portuguese', 'English'],
        areaServed: 'BR',
      },
    ],
    sameAs: [
      'https://wa.me/5511977303414',
      'https://www.linkedin.com/company/catalisa-io',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: 'Sao Paulo',
      addressRegion: 'SP',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brazil',
    },
    knowsAbout: [
      'WhatsApp Business API',
      'AI Agents',
      'Workflow Automation',
      'Conversational AI',
      'Fintech Automation',
    ],
  };
}
