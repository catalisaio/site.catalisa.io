import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- Mocks ---

const mockNavigate = vi.fn();
let mockLanguage = 'pt-BR';
let mockAlternatePath = { path: '/en', lang: 'en-US', label: 'EN' };

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() { return mockLanguage; },
    },
  }),
}));

vi.mock('../../../i18n/useAlternatePath', () => ({
  useAlternatePath: () => mockAlternatePath,
}));

import { LanguageSwitcher } from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('shows PT as active when language is pt-BR', () => {
    mockLanguage = 'pt-BR';
    mockAlternatePath = { path: '/en', lang: 'en-US', label: 'EN' };

    render(<LanguageSwitcher />);

    const ptButton = screen.getByRole('button', { name: 'PT' });
    const enButton = screen.getByRole('button', { name: 'EN' });

    expect(ptButton).toBeDisabled();
    expect(enButton).not.toBeDisabled();
  });

  it('shows EN as active when language is en-US', () => {
    mockLanguage = 'en-US';
    mockAlternatePath = { path: '/', lang: 'pt-BR', label: 'PT' };

    render(<LanguageSwitcher />);

    const ptButton = screen.getByRole('button', { name: 'PT' });
    const enButton = screen.getByRole('button', { name: 'EN' });

    expect(enButton).toBeDisabled();
    expect(ptButton).not.toBeDisabled();
  });

  it('navigates to alternate path when clicking inactive language', async () => {
    mockLanguage = 'pt-BR';
    mockAlternatePath = { path: '/en', lang: 'en-US', label: 'EN' };
    mockNavigate.mockClear();

    render(<LanguageSwitcher />);

    const enButton = screen.getByRole('button', { name: 'EN' });
    await userEvent.click(enButton);

    expect(mockNavigate).toHaveBeenCalledWith('/en');
  });

  it('does NOT navigate when clicking the already-active language', async () => {
    mockLanguage = 'pt-BR';
    mockAlternatePath = { path: '/en', lang: 'en-US', label: 'EN' };
    mockNavigate.mockClear();

    render(<LanguageSwitcher />);

    const ptButton = screen.getByRole('button', { name: 'PT' });
    await userEvent.click(ptButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('uses navigation (URL change) not just i18n.changeLanguage', async () => {
    // REGRESSION: The switcher must navigate to the alternate URL path,
    // which triggers LanguageLayout to changeLanguage and await namespaces.
    // Direct changeLanguage calls bypass the ready-gate protection.
    mockLanguage = 'en-US';
    mockAlternatePath = { path: '/insights', lang: 'pt-BR', label: 'PT' };
    mockNavigate.mockClear();

    render(<LanguageSwitcher />);

    const ptButton = screen.getByRole('button', { name: 'PT' });
    await userEvent.click(ptButton);

    expect(mockNavigate).toHaveBeenCalledWith('/insights');
  });
});
