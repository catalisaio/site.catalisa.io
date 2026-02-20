import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Static pt-BR imports
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
import presentationPtBR from './locales/pt-BR/presentation.json';

// Static en-US imports
import commonEnUS from './locales/en-US/common.json';
import homeEnUS from './locales/en-US/home.json';
import studioEnUS from './locales/en-US/studio.json';
import aiAgentsEnUS from './locales/en-US/ai-agents.json';
import buildingBlocksEnUS from './locales/en-US/building-blocks.json';
import workflowsEnUS from './locales/en-US/workflows.json';
import fintechEnUS from './locales/en-US/fintech.json';
import bankingEnUS from './locales/en-US/banking.json';
import insuranceEnUS from './locales/en-US/insurance.json';
import retailEnUS from './locales/en-US/retail.json';
import startupsEnUS from './locales/en-US/startups.json';
import useCasesEnUS from './locales/en-US/use-cases.json';
import contactEnUS from './locales/en-US/contact.json';
import demoEnUS from './locales/en-US/demo.json';
import privacyEnUS from './locales/en-US/privacy.json';
import dataActionsEnUS from './locales/en-US/data-actions.json';
import dataUsecasesEnUS from './locales/en-US/data-usecases.json';
import dataCapabilitiesEnUS from './locales/en-US/data-capabilities.json';
import dataStatsEnUS from './locales/en-US/data-stats.json';
import dataWorkflowsEnUS from './locales/en-US/data-workflows.json';
import presentationEnUS from './locales/en-US/presentation.json';

export const allNamespaces = [
  'common', 'home', 'studio', 'ai-agents', 'building-blocks', 'workflows',
  'fintech', 'banking', 'insurance', 'retail', 'startups', 'use-cases',
  'contact', 'demo', 'privacy',
  'data-actions', 'data-usecases', 'data-capabilities', 'data-stats', 'data-workflows',
  'presentation',
] as const;

export type Namespace = (typeof allNamespaces)[number];

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
      presentation: presentationPtBR,
    },
    'en-US': {
      common: commonEnUS,
      home: homeEnUS,
      studio: studioEnUS,
      'ai-agents': aiAgentsEnUS,
      'building-blocks': buildingBlocksEnUS,
      workflows: workflowsEnUS,
      fintech: fintechEnUS,
      banking: bankingEnUS,
      insurance: insuranceEnUS,
      retail: retailEnUS,
      startups: startupsEnUS,
      'use-cases': useCasesEnUS,
      contact: contactEnUS,
      demo: demoEnUS,
      privacy: privacyEnUS,
      'data-actions': dataActionsEnUS,
      'data-usecases': dataUsecasesEnUS,
      'data-capabilities': dataCapabilitiesEnUS,
      'data-stats': dataStatsEnUS,
      'data-workflows': dataWorkflowsEnUS,
      presentation: presentationEnUS,
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
