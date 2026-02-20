import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Static pt-BR imports (zero-latency default)
import commonPtBR from './locales/pt-BR/common.json';
import homePtBR from './locales/pt-BR/home.json';
import studioPtBR from './locales/pt-BR/studio.json';
import aiAgentsPtBR from './locales/pt-BR/ai-agents.json';
import buildingBlocksPtBR from './locales/pt-BR/building-blocks.json';
import workflowsPtBR from './locales/pt-BR/workflows.json';
import fintechPtBR from './locales/pt-BR/fintech.json';
import bankingPtBR from './locales/pt-BR/banking.json';
import insurancePtBR from './locales/pt-BR/insurance.json';
import retailPtBR from './locales/pt-BR/retail.json';
import startupsPtBR from './locales/pt-BR/startups.json';
import useCasesPtBR from './locales/pt-BR/use-cases.json';
import contactPtBR from './locales/pt-BR/contact.json';
import demoPtBR from './locales/pt-BR/demo.json';
import privacyPtBR from './locales/pt-BR/privacy.json';
import dataActionsPtBR from './locales/pt-BR/data-actions.json';
import dataUsecasesPtBR from './locales/pt-BR/data-usecases.json';
import dataCapabilitiesPtBR from './locales/pt-BR/data-capabilities.json';
import dataStatsPtBR from './locales/pt-BR/data-stats.json';
import dataWorkflowsPtBR from './locales/pt-BR/data-workflows.json';

export const allNamespaces = [
  'common', 'home', 'studio', 'ai-agents', 'building-blocks', 'workflows',
  'fintech', 'banking', 'insurance', 'retail', 'startups', 'use-cases',
  'contact', 'demo', 'privacy',
  'data-actions', 'data-usecases', 'data-capabilities', 'data-stats', 'data-workflows',
] as const;

export type Namespace = (typeof allNamespaces)[number];

// Lazy-load en-US modules
const enUSModules = import.meta.glob('./locales/en-US/*.json');

export async function loadEnUSNamespaces(): Promise<void> {
  const promises = Object.entries(enUSModules).map(async ([path, loader]) => {
    const ns = path.replace('./locales/en-US/', '').replace('.json', '');
    const mod = (await loader()) as { default: Record<string, unknown> };
    i18n.addResourceBundle('en-US', ns, mod.default, true, true);
  });
  await Promise.all(promises);
}

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': {
      common: commonPtBR,
      home: homePtBR,
      studio: studioPtBR,
      'ai-agents': aiAgentsPtBR,
      'building-blocks': buildingBlocksPtBR,
      workflows: workflowsPtBR,
      fintech: fintechPtBR,
      banking: bankingPtBR,
      insurance: insurancePtBR,
      retail: retailPtBR,
      startups: startupsPtBR,
      'use-cases': useCasesPtBR,
      contact: contactPtBR,
      demo: demoPtBR,
      privacy: privacyPtBR,
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
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
