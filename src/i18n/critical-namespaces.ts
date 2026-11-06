/** Namespaces bundled for pt-BR must be explicitly loaded for another language.
 * A loaded fallback bundle alone does not prove the requested language is ready. */
export const criticalNamespaces = ['common', 'home', 'seo', 'data-actions', 'data-usecases', 'data-capabilities', 'data-stats', 'data-workflows'] as const;
