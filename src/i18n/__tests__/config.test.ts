import { describe, it, expect } from 'vitest';
import i18n from '../index';
import { criticalNamespaces } from '../critical-namespaces';

describe('i18n configuration', () => {
  it('loads exact English critical bundles instead of accepting the Portuguese fallback', async () => {
    try {
      await i18n.changeLanguage('en-US');
      await i18n.loadNamespaces([...criticalNamespaces]);
      for (const ns of criticalNamespaces) expect(i18n.hasResourceBundle('en-US', ns)).toBe(true);
      expect(i18n.getFixedT('en-US', 'seo')('home.title')).toBe('Catalisa | AI-Powered WhatsApp Automation Platform');
    } finally { await i18n.changeLanguage('pt-BR'); }
  });

  it('must have useSuspense enabled so lazy-loaded namespaces suspend correctly', () => {
    // useSuspense: true is required so that components using returnObjects: true
    // (e.g. Studio, Playbooks) suspend until the namespace loads, instead of
    // receiving a string key and crashing on .map().
    // The LanguageLayout ready-gate handles language switching race conditions.
    expect(i18n.options.react?.useSuspense).toBe(true);
  });

  it('must use pt-BR as default and fallback language', () => {
    expect(i18n.options.lng).toBe('pt-BR');
    expect(i18n.options.fallbackLng).toEqual(['pt-BR']);
  });

  it('must enable partialBundledLanguages for lazy loading', () => {
    // Required so that statically bundled pt-BR namespaces coexist
    // with dynamically loaded namespaces via resourcesToBackend.
    expect(i18n.options.partialBundledLanguages).toBe(true);
  });

  it('must have critical pt-BR namespaces statically bundled', () => {
    const bundled = [
      'common', 'home', 'seo',
      'data-actions', 'data-usecases', 'data-capabilities', 'data-stats', 'data-workflows',
    ];
    for (const ns of bundled) {
      expect(
        i18n.hasResourceBundle('pt-BR', ns),
        `pt-BR/${ns} should be statically bundled`,
      ).toBe(true);
    }
  });
});
