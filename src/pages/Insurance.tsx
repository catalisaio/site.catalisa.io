import { useTranslation } from 'react-i18next';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { VerticalPageTemplate } from '../components/shared/VerticalPageTemplate';

export function Insurance() {
  const { t, i18n } = useTranslation('insurance');
  const { t: tc } = useTranslation('common');
  const { insuranceUseCases } = useTranslatedUseCases();
  const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';

  const complianceItems = Array.from({ length: 4 }, (_, i) => ({
    label: t(`compliance.items.${i}.label`),
    description: t(`compliance.items.${i}.description`),
  }));

  const capabilities = Array.from({ length: 6 }, (_, i) => ({
    title: t(`capabilities.items.${i}.title`),
    description: t(`capabilities.items.${i}.description`),
  }));

  return (
    <VerticalPageTemplate
      t={t}
      locale={locale}
      accentColor="purple"
      heroGradient="linear(to-r, catalisa.secondary, catalisa.accent)"
      useCases={insuranceUseCases}
      heroStats={[
        { value: t('hero.stats.stat1.value'), label: t('hero.stats.stat1.label') },
        { value: '42%', label: t('hero.stats.stat2.label'), numericValue: 42, suffix: '%' },
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
          { label: t('roi.calc.fields.brokers'), defaultValue: 20, key: 'brokers' },
          { label: t('roi.calc.fields.claimsPerMonth'), defaultValue: 100, key: 'claimsPerMonth' },
          { label: t('roi.calc.fields.costPerClaim'), defaultValue: 120, key: 'costPerClaim' },
        ],
        calculate: (values) => ({
          current: values.claimsPerMonth * values.costPerClaim + values.brokers * 2500,
          ai: 1500 + (values.claimsPerMonth * 8) + (values.brokers * 500),
        }),
        stats: {
          currentCost: t('roi.calc.stats.currentCost'),
          withCatalisa: t('roi.calc.stats.withCatalisa'),
          monthlySavings: t('roi.calc.stats.monthlySavings'),
          reduction: t('roi.calc.reduction'),
        },
      }}
      ctaLabel={tc('cta.letsChat')}
      heroId="hero_insurance"
    />
  );
}
