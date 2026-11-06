import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Editorial from './Editorial';
import editorial from './data/editorial';
import { loadSiteLocale } from './i18n/runtime';
import { localizeSitePath } from './i18n/routes';

vi.mock('./foundation-components', () => ({
  RedesignFrame: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

afterEach(async () => { cleanup(); await loadSiteLocale('pt-BR'); });

describe('Perspectivas syndication footer', () => {
  it('records only the supplied publication channels and their publication date', () => {
    const syndicated = editorial.filter(page => page.syndication?.length);
    expect(syndicated).toHaveLength(1);
    expect(syndicated[0].path).toBe('/perspectivas/construir-por-composicao');
    expect(syndicated[0].syndication).toEqual([
      { network: 'linkedin', label: 'LinkedIn (Klederson Bueno)', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7524442037891543041/', publishedAt: '2026-11-06' },
      { network: 'linkedin', label: 'LinkedIn (Catalisa)', url: 'https://www.linkedin.com/feed/update/urn:li:share:7524441529097281537/?actorCompanyId=88375615', publishedAt: '2026-11-06' },
      { network: 'x', label: 'X (@catalisaio)', url: 'https://x.com/catalisaio/status/2118678368094744899', publishedAt: '2026-11-06' },
    ]);
  });

  it.each(['pt-BR', 'en-US'] as const)('renders external channel links at the end of the %s article only when present', async locale => {
    await loadSiteLocale(locale);
    const label = locale === 'pt-BR' ? 'Também publicado em' : 'Published on';
    for (const page of editorial) {
      const view = render(<MemoryRouter initialEntries={[localizeSitePath(page.path, locale)]}><Editorial /></MemoryRouter>);
      if (page.syndication?.length) {
        const footer = screen.getByLabelText(label);
        expect(footer.tagName).toBe('FOOTER');
        expect(footer.closest('article')?.lastElementChild).toBe(footer);
        expect(within(footer).getByText(label)).toBeInTheDocument();
        expect(within(footer).getAllByRole('link')).toHaveLength(3);
        for (const channel of page.syndication) {
          const link = within(footer).getByRole('link', { name: channel.label });
          expect(link).toHaveAttribute('href', channel.url);
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener');
        }
      } else {
        expect(screen.queryByLabelText(label)).toBeNull();
        expect(view.container.querySelector('.e-syndication')).toBeNull();
      }
      view.unmount();
    }
  });
});
