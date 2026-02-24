import { BASE_URL } from '../routes';

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Catalisa',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: BASE_URL,
    description: 'Plataforma B2B de automacao WhatsApp com agentes de IA, workflows visuais e 60+ building blocks',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      description: 'Demo gratuita disponivel',
    },
    featureList: [
      'WhatsApp Business API Integration',
      'AI Agents with Generative AI',
      '60+ Building Blocks',
      'Visual Workflow Builder',
      'Multi-tenant Architecture',
      'LGPD Compliance',
    ],
  };
}
