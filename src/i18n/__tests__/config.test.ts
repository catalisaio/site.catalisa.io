import { describe, it, expect } from 'vitest';
import i18n from '../index';

describe('i18n configuration', () => {
  it('must have useSuspense disabled to avoid race conditions with lazy-loaded namespaces', () => {
    // REGRESSION: useSuspense: true caused intermittent language switcher failures
    // because en-US has zero statically bundled namespaces — all are lazy-loaded.
    // With suspense enabled, components would suspend before namespaces were ready.
    expect(i18n.options.react?.useSuspense).toBe(false);
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
