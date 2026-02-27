import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Critical-path pt-BR imports (bundled statically for instant render)
import commonPtBR from './locales/pt-BR/common.json';
import homePtBR from './locales/pt-BR/home.json';
import seoPtBR from './locales/pt-BR/seo.json';
import dataActionsPtBR from './locales/pt-BR/data-actions.json';
import dataUsecasesPtBR from './locales/pt-BR/data-usecases.json';
import dataCapabilitiesPtBR from './locales/pt-BR/data-capabilities.json';
import dataStatsPtBR from './locales/pt-BR/data-stats.json';
import dataWorkflowsPtBR from './locales/pt-BR/data-workflows.json';

export const allNamespaces = [
  'common', 'home', 'studio', 'ai-agents', 'building-blocks', 'workflows',
  'fintech', 'banking', 'insurance', 'retail', 'startups',
  'contact', 'demo', 'privacy',
  'data-actions', 'data-usecases', 'data-capabilities', 'data-stats', 'data-workflows',
  'presentation', 'press-kit', 'terms', 'security', 'pricing', 'how-it-works', 'whatsapp-integration', 'playbooks', 'seo', 'apps', 'casos-de-uso', 'ai-agents-whatsapp', 'insights',
] as const;

export type Namespace = (typeof allNamespaces)[number];

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    resources: {
      'pt-BR': {
        common: commonPtBR,
        home: homePtBR,
        seo: seoPtBR,
        'data-actions': dataActionsPtBR,
        'data-usecases': dataUsecasesPtBR,
        'data-capabilities': dataCapabilitiesPtBR,
        'data-stats': dataStatsPtBR,
        'data-workflows': dataWorkflowsPtBR,
      },
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
    partialBundledLanguages: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
