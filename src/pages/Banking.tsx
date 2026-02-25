import { useTranslation } from 'react-i18next';
import { useTranslatedUseCases } from '../i18n/useTranslatedData';
import { VerticalPageTemplate } from '../components/shared/VerticalPageTemplate';

export function Banking() {
  const { t, i18n } = useTranslation('banking');
  const { t: tc } = useTranslation('common');
  const { bankingUseCases } = useTranslatedUseCases();
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
      accentColor="blue"
      heroGradient="linear(to-r, catalisa.secondary, catalisa.accent)"
      useCases={bankingUseCases}
      heroStats={[
        { value: '148M', label: t('hero.stats.stat1.label'), numericValue: 148, suffix: 'M' },
        { value: '82%', label: t('hero.stats.stat2.label'), numericValue: 82, suffix: '%' },
        { value: '76%', label: t('hero.stats.stat3.label'), numericValue: 76, suffix: '%' },
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
          { label: t('roi.calc.fields.branches'), defaultValue: 10, key: 'branches' },
          { label: t('roi.calc.fields.transactionsPerDay'), defaultValue: 200, key: 'transactionsPerDay' },
          { label: t('roi.calc.fields.costPerTransaction'), defaultValue: 8, key: 'costPerTransaction' },
        ],
        calculate: (values) => ({
          current: values.branches * values.transactionsPerDay * 22 * values.costPerTransaction,
          ai: 1200 + (values.transactionsPerDay * 22 * 0.15 * values.branches),
        }),
        stats: {
          currentCost: t('roi.calc.stats.currentCost'),
          withCatalisa: t('roi.calc.stats.withCatalisa'),
          monthlySavings: t('roi.calc.stats.monthlySavings'),
          reduction: t('roi.calc.reduction'),
        },
      }}
      ctaLabel={tc('cta.letsChat')}
    />
  );
}
