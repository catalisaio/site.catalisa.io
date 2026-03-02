import { useTranslation } from 'react-i18next';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { VerticalPageTemplate } from '../components/shared/VerticalPageTemplate';

export function Fintech() {
  const { t, i18n } = useTranslation('fintech');
  const { t: tc } = useTranslation('common');
  const { fintechUseCases } = useTranslatedUseCases();
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
      accentColor="yellow"
      heroGradient="linear(to-r, catalisa.secondary, catalisa.accent)"
      useCases={fintechUseCases}
      heroStats={[
        { value: '120M', label: t('hero.stats.stat1.label'), numericValue: 120, suffix: 'M' },
        { value: '91%', label: t('hero.stats.stat2.label'), numericValue: 91, suffix: '%' },
        { value: t('hero.stats.stat3.value'), label: t('hero.stats.stat3.label') },
      ]}
      complianceItems={complianceItems}
      capabilities={capabilities}
      capabilityBadge={t('capabilities.badge')}
      capabilityPipeline={{
        label: t('capabilities.pipelineLabel'),
        text: t('capabilities.pipeline'),
      }}
      roiConfig={{
        title: t('roi.calc.title'),
        currency: t('roi.calc.currency'),
        fields: [
          { label: t('roi.calc.fields.agents'), defaultValue: 5, key: 'agents' },
          { label: t('roi.calc.fields.leadsPerDay'), defaultValue: 50, key: 'leadsPerDay' },
          { label: t('roi.calc.fields.costPerAgent'), defaultValue: 3000, key: 'costPerAgent' },
        ],
        calculate: (values) => ({
          current: values.agents * values.costPerAgent,
          ai: 800 + (values.leadsPerDay * 30 * 0.02),
        }),
        stats: {
          currentCost: t('roi.calc.stats.currentCost'),
          withCatalisa: t('roi.calc.stats.withCatalisa'),
          monthlySavings: t('roi.calc.stats.monthlySavings'),
          reduction: t('roi.calc.reduction'),
        },
      }}
      ctaLabel={tc('cta.letsChat')}
      heroId="hero_fintech"
    />
  );
}
