import { BASE_URL } from '../routes';

export function getVideoObjectSchema(options: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: options.name,
    description: options.description,
    thumbnailUrl: options.thumbnailUrl.startsWith('http')
      ? options.thumbnailUrl
      : `${BASE_URL}${options.thumbnailUrl}`,
    ...(options.contentUrl && {
      contentUrl: options.contentUrl.startsWith('http')
        ? options.contentUrl
        : `${BASE_URL}${options.contentUrl}`,
    }),
    uploadDate: '2025-01-01',
  };
}
