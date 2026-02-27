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
import contactPtBR from './locales/pt-BR/contact.json';
import demoPtBR from './locales/pt-BR/demo.json';
import privacyPtBR from './locales/pt-BR/privacy.json';
import dataActionsPtBR from './locales/pt-BR/data-actions.json';
import dataUsecasesPtBR from './locales/pt-BR/data-usecases.json';
import dataCapabilitiesPtBR from './locales/pt-BR/data-capabilities.json';
import dataStatsPtBR from './locales/pt-BR/data-stats.json';
import dataWorkflowsPtBR from './locales/pt-BR/data-workflows.json';
import presentationPtBR from './locales/pt-BR/presentation.json';
import pressKitPtBR from './locales/pt-BR/press-kit.json';
import termsPtBR from './locales/pt-BR/terms.json';
import securityPtBR from './locales/pt-BR/security.json';
import pricingPtBR from './locales/pt-BR/pricing.json';
import howItWorksPtBR from './locales/pt-BR/how-it-works.json';
import whatsappIntegrationPtBR from './locales/pt-BR/whatsapp-integration.json';
import playbooksPtBR from './locales/pt-BR/playbooks.json';
import seoPtBR from './locales/pt-BR/seo.json';
import appsPtBR from './locales/pt-BR/apps.json';
import casosDeUsoPtBR from './locales/pt-BR/casos-de-uso.json';
import aiAgentsWhatsAppPtBR from './locales/pt-BR/ai-agents-whatsapp.json';

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
import contactEnUS from './locales/en-US/contact.json';
import demoEnUS from './locales/en-US/demo.json';
import privacyEnUS from './locales/en-US/privacy.json';
import dataActionsEnUS from './locales/en-US/data-actions.json';
import dataUsecasesEnUS from './locales/en-US/data-usecases.json';
import dataCapabilitiesEnUS from './locales/en-US/data-capabilities.json';
import dataStatsEnUS from './locales/en-US/data-stats.json';
import dataWorkflowsEnUS from './locales/en-US/data-workflows.json';
import presentationEnUS from './locales/en-US/presentation.json';
import pressKitEnUS from './locales/en-US/press-kit.json';
import termsEnUS from './locales/en-US/terms.json';
import securityEnUS from './locales/en-US/security.json';
import pricingEnUS from './locales/en-US/pricing.json';
import howItWorksEnUS from './locales/en-US/how-it-works.json';
import whatsappIntegrationEnUS from './locales/en-US/whatsapp-integration.json';
import playbooksEnUS from './locales/en-US/playbooks.json';
import seoEnUS from './locales/en-US/seo.json';
import appsEnUS from './locales/en-US/apps.json';
import casosDeUsoEnUS from './locales/en-US/casos-de-uso.json';
import aiAgentsWhatsAppEnUS from './locales/en-US/ai-agents-whatsapp.json';

export const allNamespaces = [
  'common', 'home', 'studio', 'ai-agents', 'building-blocks', 'workflows',
  'fintech', 'banking', 'insurance', 'retail', 'startups',
  'contact', 'demo', 'privacy',
  'data-actions', 'data-usecases', 'data-capabilities', 'data-stats', 'data-workflows',
  'presentation', 'press-kit', 'terms', 'security', 'pricing', 'how-it-works', 'whatsapp-integration', 'playbooks', 'seo', 'apps', 'casos-de-uso', 'ai-agents-whatsapp',
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
      contact: contactPtBR,
      demo: demoPtBR,
      privacy: privacyPtBR,
      'data-actions': dataActionsPtBR,
      'data-usecases': dataUsecasesPtBR,
      'data-capabilities': dataCapabilitiesPtBR,
      'data-stats': dataStatsPtBR,
      'data-workflows': dataWorkflowsPtBR,
      presentation: presentationPtBR,
      'press-kit': pressKitPtBR,
      terms: termsPtBR,
      security: securityPtBR,
      pricing: pricingPtBR,
      'how-it-works': howItWorksPtBR,
      'whatsapp-integration': whatsappIntegrationPtBR,
      playbooks: playbooksPtBR,
      seo: seoPtBR,
      apps: appsPtBR,
      'casos-de-uso': casosDeUsoPtBR,
      'ai-agents-whatsapp': aiAgentsWhatsAppPtBR,
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
      contact: contactEnUS,
      demo: demoEnUS,
      privacy: privacyEnUS,
      'data-actions': dataActionsEnUS,
      'data-usecases': dataUsecasesEnUS,
      'data-capabilities': dataCapabilitiesEnUS,
      'data-stats': dataStatsEnUS,
      'data-workflows': dataWorkflowsEnUS,
      presentation: presentationEnUS,
      'press-kit': pressKitEnUS,
      terms: termsEnUS,
      security: securityEnUS,
      pricing: pricingEnUS,
      'how-it-works': howItWorksEnUS,
      'whatsapp-integration': whatsappIntegrationEnUS,
      playbooks: playbooksEnUS,
      seo: seoEnUS,
      apps: appsEnUS,
      'casos-de-uso': casosDeUsoEnUS,
      'ai-agents-whatsapp': aiAgentsWhatsAppEnUS,
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
