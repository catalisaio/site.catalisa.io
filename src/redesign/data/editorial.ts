import entries from './editorial.json';

export interface Syndication {
  network: string;
  label: string;
  url: string;
  publishedAt: string;
}

export interface EditorialEntry {
  path: string;
  title: string;
  description: string;
  stateCount: number;
  topics: string[];
  author?: string;
  syndication?: Syndication[];
}

// Localized routes share the same publication records; URLs and dates stay intact.
const editorial: EditorialEntry[] = entries;
export default editorial;
