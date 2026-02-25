import type { Playbook } from '../../data/playbooks';

export function getPlaybookSchema(playbook: Playbook, t: (key: string) => string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t(playbook.nameKey),
    description: t(playbook.descriptionKey),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
  };
}
