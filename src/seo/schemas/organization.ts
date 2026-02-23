import { BASE_URL } from '../routes';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Catalisa',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    description: 'Plataforma B2B de automacao WhatsApp com IA para fintechs e empresas brasileiras',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-97730-3414',
      contactType: 'sales',
      availableLanguage: ['Portuguese', 'English'],
    },
    sameAs: ['https://wa.me/5511977303414'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
  };
}
