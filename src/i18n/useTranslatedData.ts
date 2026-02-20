import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { actions, categoryLabels, tierLabels } from '../data/actions';
import type { Action, ActionCategory, ActionTier } from '../data/actions';
import { fintechUseCases, generalUseCases, bankingUseCases, insuranceUseCases, retailUseCases, startupUseCases, agentTemplates } from '../data/useCases';
import type { UseCase } from '../data/useCases';
import { capabilityClusters, businessRecipes } from '../data/capabilityClusters';
import type { CapabilityCluster } from '../data/capabilityClusters';
import { platformStats, trustBadges } from '../data/stats';
import { workflowPreviews } from '../data/workflowPreviews';

/**
 * Overlays translated strings onto the actions data array.
 * The .ts data files remain unchanged — translation happens at runtime.
 */
export function useTranslatedActions() {
  const { t } = useTranslation('data-actions');

  return useMemo(() => {
    const translatedCategoryLabels: Record<ActionCategory, string> = {} as Record<ActionCategory, string>;
    for (const key of Object.keys(categoryLabels) as ActionCategory[]) {
      translatedCategoryLabels[key] = t(`categoryLabels.${key}`, categoryLabels[key]);
    }

    const translatedTierLabels: Record<ActionTier, string> = {} as Record<ActionTier, string>;
    for (const key of Object.keys(tierLabels) as ActionTier[]) {
      translatedTierLabels[key] = t(`tierLabels.${key}`, tierLabels[key]);
    }

    const translatedActions: Action[] = actions.map((action) => ({
      ...action,
      displayName: t(`actions.${action.name}.displayName`, action.displayName),
      description: t(`actions.${action.name}.description`, action.description),
      fintechExample: t(`actions.${action.name}.fintechExample`, action.fintechExample),
    }));

    return { actions: translatedActions, categoryLabels: translatedCategoryLabels, tierLabels: translatedTierLabels };
  }, [t]);
}

function translateUseCases(cases: UseCase[], t: (key: string, fallback: string) => string): UseCase[] {
  return cases.map((uc) => ({
    ...uc,
    title: t(`${uc.id}.title`, uc.title),
    subtitle: t(`${uc.id}.subtitle`, uc.subtitle),
    description: t(`${uc.id}.description`, uc.description),
    industry: t(`${uc.id}.industry`, uc.industry),
    before: uc.before.map((b, i) => ({
      metric: t(`${uc.id}.before.${i}.metric`, b.metric),
      value: t(`${uc.id}.before.${i}.value`, b.value),
    })),
    after: uc.after.map((a, i) => ({
      metric: t(`${uc.id}.after.${i}.metric`, a.metric),
      value: t(`${uc.id}.after.${i}.value`, a.value),
    })),
    workflowSteps: uc.workflowSteps.map((s, i) => ({
      category: t(`${uc.id}.workflowSteps.${i}.category`, s.category),
      label: t(`${uc.id}.workflowSteps.${i}.label`, s.label),
    })),
  }));
}

export function useTranslatedUseCases() {
  const { t } = useTranslation('data-usecases');

  return useMemo(
    () => ({
      fintechUseCases: translateUseCases(fintechUseCases, t),
      generalUseCases: translateUseCases(generalUseCases, t),
      bankingUseCases: translateUseCases(bankingUseCases, t),
      insuranceUseCases: translateUseCases(insuranceUseCases, t),
      retailUseCases: translateUseCases(retailUseCases, t),
      startupUseCases: translateUseCases(startupUseCases, t),
      agentTemplates: agentTemplates.map((tmpl, i) => ({
        ...tmpl,
        name: t(`agentTemplates.${i}.name`, tmpl.name),
        description: t(`agentTemplates.${i}.description`, tmpl.description),
        category: t(`agentTemplates.${i}.category`, tmpl.category),
        tools: tmpl.tools.map((tool, ti) => t(`agentTemplates.${i}.tools.${ti}`, tool)),
      })),
    }),
    [t],
  );
}

export function useTranslatedCapabilities() {
  const { t } = useTranslation('data-capabilities');

  return useMemo(
    () => ({
      capabilityClusters: capabilityClusters.map((cluster) => ({
        ...cluster,
        name: t(`clusters.${cluster.id}.name`, cluster.name),
        description: t(`clusters.${cluster.id}.description`, cluster.description),
        outcomes: cluster.outcomes.map((o, i) => t(`clusters.${cluster.id}.outcomes.${i}`, o)),
      })) as CapabilityCluster[],
      businessRecipes: businessRecipes.map((recipe, i) => ({
        ...recipe,
        title: t(`recipes.${i}.title`, recipe.title),
        description: t(`recipes.${i}.description`, recipe.description),
        steps: recipe.steps.map((s, si) => ({
          category: t(`recipes.${i}.steps.${si}.category`, s.category),
          label: t(`recipes.${i}.steps.${si}.label`, s.label),
        })),
      })),
    }),
    [t],
  );
}

export function useTranslatedStats() {
  const { t } = useTranslation('data-stats');

  return useMemo(
    () => ({
      platformStats: platformStats.map((stat, i) => ({
        ...stat,
        label: t(`platformStats.${i}.label`, stat.label),
        description: t(`platformStats.${i}.description`, stat.description),
      })),
      trustBadges: trustBadges.map((badge, i) => t(`trustBadges.${i}`, badge)),
    }),
    [t],
  );
}

export function useTranslatedWorkflows() {
  const { t } = useTranslation('data-workflows');

  return useMemo(
    () =>
      workflowPreviews.map((wf) => ({
        ...wf,
        title: t(`${wf.id}.title`, wf.title),
        subtitle: t(`${wf.id}.subtitle`, wf.subtitle),
        description: t(`${wf.id}.description`, wf.description),
        badge: t(`${wf.id}.badge`, wf.badge),
        nodes: wf.nodes.map((node) => ({
          ...node,
          label: t(`${wf.id}.nodes.${node.id}`, node.label),
        })),
        edges: wf.edges.map((edge) => ({
          ...edge,
          label: edge.label ? t(`${wf.id}.edges.${edge.from}_${edge.to}`, edge.label) : undefined,
        })),
      })),
    [t],
  );
}
