import { BASE_URL } from '../routes';

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: BASE_URL,
  };
}
