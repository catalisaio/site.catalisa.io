import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { resolveRoute } from './routes';
import { JsonLd } from './JsonLd';
import { getBreadcrumbSchema, type BreadcrumbItem as BreadcrumbSchemaItem } from './schemas/breadcrumb';

interface BreadcrumbsProps {
  /** Current page label (translated) */
  currentLabel: string;
  /** Current page pt-BR path (used to resolve route) */
  currentPtPath: string;
}

/**
 * Renders visual breadcrumb navigation + BreadcrumbList JSON-LD.
 * Hierarchy: Home > [Category] > Page
 */
export function Breadcrumbs({ currentLabel, currentPtPath }: BreadcrumbsProps) {
  const { t } = useTranslation('seo');
  const lp = useLocalizedPath();

  const route = resolveRoute(currentPtPath) ?? resolveRoute(lp(currentPtPath));
  const category = route?.breadcrumbCategory;

  const items: BreadcrumbSchemaItem[] = [
    { name: t('breadcrumbs.home'), path: lp('/') },
  ];

  if (category) {
    const categoryPaths: Record<string, string> = {
      platform: '/studio',
      industries: '/fintech',
      insights: '/insights',
    };
    items.push({
      name: t(`breadcrumbs.${category}`),
      path: lp(categoryPaths[category] || '/'),
    });
  }

  items.push({
    name: currentLabel,
    path: lp(currentPtPath),
  });

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(items)} />
      <Box as="nav" aria-label="breadcrumb" px={{ base: 4, md: 8 }} pt={4}>
        <Breadcrumb
          fontSize="sm"
          color="text-muted"
          separator=">"
        >
          {items.map((item, i) => (
            <BreadcrumbItem key={item.path} isCurrentPage={i === items.length - 1}>
              {i === items.length - 1 ? (
                <BreadcrumbLink as="span">{item.name}</BreadcrumbLink>
              ) : (
                <BreadcrumbLink as={RouterLink} to={item.path}>
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Box>
    </>
  );
}
