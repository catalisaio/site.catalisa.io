import { useTranslation } from 'react-i18next';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { VerticalPageTemplate } from '../components/shared/VerticalPageTemplate';

export function Startups() {
  const { t, i18n } = useTranslation('startups');
  const { t: tc } = useTranslation('common');
  const { startupUseCases } = useTranslatedUseCases();
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
      accentColor="cyan"
      heroId="hero_startups"
      heroGradient="linear(to-r, cyan.300, teal.400)"
      useCases={startupUseCases}
      heroStats={[
        { value: '91%', label: t('hero.stats.openRate'), numericValue: 91, suffix: '%' },
        { value: '10x', label: t('hero.stats.cheaper') },
        { value: '<1min', label: t('hero.stats.responseTime') },
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
          { label: t('roi.sdrsLabel'), defaultValue: 3, key: 'sdrs' },
          { label: t('roi.leadsLabel'), defaultValue: 30, key: 'leadsPerDay' },
          { label: t('roi.costLabel'), defaultValue: 4000, key: 'costPerSdr' },
        ],
        calculate: (values) => ({
          current: values.sdrs * values.costPerSdr,
          ai: 500 + (values.leadsPerDay * 30 * 0.02),
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
