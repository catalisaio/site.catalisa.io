import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../../theme';
import { ChannelCitations } from './ChannelCitations';
import type { ChannelCitation } from '../../data/channelArticles';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        'article.channelsTitle': 'Também publicado em',
        'article.channelsLead': 'Peças nativas dos canais.',
        'article.voiceKlederson': 'Klederson',
        'article.voiceCatalisa': 'Catalisa',
      })[key] ?? key,
    i18n: { language: 'pt-BR' },
  }),
}));

const channels: ChannelCitation[] = [
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    voice: 'klederson',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7524442037891543041/',
    postedAt: '2026-11-06T12:06:19Z',
  },
  {
    platform: 'x',
    label: 'X',
    voice: 'catalisa',
    url: 'http://x.com/catalisaio/status/not-https',
    postedAt: '2026-11-06',
  },
  {
    platform: 'devto',
    label: 'Dev.to',
    voice: 'catalisa',
    url: 'https://dev.to/example/placeholder-draft',
    postedAt: '2026-11-06',
  },
];

describe('ChannelCitations', () => {
  it('renders the published https link and hides placeholders', () => {
    render(
      <ChakraProvider theme={theme}>
        <ChannelCitations channels={channels} />
      </ChakraProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Também publicado em' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /LinkedIn/ });
    expect(link).toHaveAttribute(
      'href',
      'https://www.linkedin.com/feed/update/urn:li:activity:7524442037891543041/',
    );
    expect(link).not.toHaveAttribute('rel', expect.stringContaining('nofollow'));
    expect(screen.queryByText(/not-https/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Dev\.to/)).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder/)).not.toBeInTheDocument();
  });

  it('renders nothing when every URL is unpublished', () => {
    render(
      <ChakraProvider theme={theme}>
        <ChannelCitations
          channels={[
            {
              platform: 'x',
              label: 'X',
              voice: 'catalisa',
              url: 'https://example.com/soon',
              postedAt: '2026-11-06',
            },
          ]}
        />
      </ChakraProvider>,
    );
    expect(screen.queryByRole('heading', { name: 'Também publicado em' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
