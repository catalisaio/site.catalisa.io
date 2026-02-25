import { useTranslation } from 'react-i18next';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { VerticalPageTemplate } from '../components/shared/VerticalPageTemplate';

export function Retail() {
  const { t, i18n } = useTranslation('retail');
  const { t: tc } = useTranslation('common');
  const { retailUseCases } = useTranslatedUseCases();
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';

  const complianceItems = Array.from({ length: 4 }, (_, i) => ({
    label: t(`compliance.items.${i}.label`),
    description: t(`compliance.items.${i}.description`),
  }));

  const capabilities = Array.from({ length: 4 }, (_, i) => ({
    title: t(`capabilities.items.${i}.title`),
    description: t(`capabilities.items.${i}.description`),
  }));

  return (
    <VerticalPageTemplate
      t={t}
      locale={locale}
      accentColor="orange"
      heroGradient="linear(to-r, orange.300, orange.400)"
      useCases={retailUseCases}
      heroStats={[
        { value: '120M', label: t('hero.stats.whatsappUsers'), numericValue: 120, suffix: 'M' },
        { value: '91%', label: t('hero.stats.openRate'), numericValue: 91, suffix: '%' },
        { value: '67%', label: t('hero.stats.buyViaApp'), numericValue: 67, suffix: '%' },
      ]}
      complianceItems={complianceItems}
      capabilities={capabilities}
      capabilityBadge={t('capabilities.badge')}
      capabilityPipeline={{
        label: t('capabilities.pipelineLabel'),
        text: t('capabilities.pipelineSteps'),
      }}
      roiConfig={{
        title: t('roi.calculatorTitle'),
        currency: 'R$',
        fields: [
          { label: t('roi.agentsLabel'), defaultValue: 4, key: 'agents' },
          { label: t('roi.ordersLabel'), defaultValue: 80, key: 'ordersPerDay' },
          { label: t('roi.costLabel'), defaultValue: 2500, key: 'costPerAgent' },
        ],
        calculate: (values) => ({
          current: values.agents * values.costPerAgent,
          ai: 600 + (values.ordersPerDay * 30 * 0.015),
        }),
        stats: {
          currentCost: t('roi.currentCost'),
          withCatalisa: t('roi.withCatalisa'),
          monthlySavings: t('roi.monthlySavings'),
          reduction: t('roi.reduction'),
        },
      }}
      ctaLabel={tc('cta.letsChat')}
    />
  );
}
