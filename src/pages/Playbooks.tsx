import { useState, useMemo } from 'react';
import { SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { PlaybookCard } from '../components/playbooks/PlaybookCard';
import { PlaybookFilters } from '../components/playbooks/PlaybookFilters';
import { playbooks } from '../data/playbooks';
import type { PlaybookCategory, PlaybookIndustry } from '../data/playbooks';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function Playbooks() {
  const { t } = useTranslation('playbooks');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaybookCategory | 'all'>('all');
  const [industry, setIndustry] = useState<PlaybookIndustry | 'all'>('all');

  const featured = useMemo(() => playbooks.filter((tpl) => tpl.featured), []);

  const filtered = useMemo(() => {
    return playbooks.filter((tpl) => {
      if (category !== 'all' && tpl.category !== category) return false;
      if (industry !== 'all' && tpl.industry !== industry) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = t(tpl.nameKey).toLowerCase();
        const desc = t(tpl.descriptionKey).toLowerCase();
        if (!name.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });
  }, [category, industry, search, t]);

  return (
    <>
      <PageHero
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: tc('cta.startFree'), href: '#all-playbooks' }}
        gradient="linear(to-r, cyan.300, brand.400)"
      />

      {/* Featured */}
      <SectionWrapper>
        <SectionHeader
          heading={t('featured.heading')}
          subtitle={t('featured.subtitle')}
        />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {featured.map((tpl, i) => (
            <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* All Playbooks */}
      <SectionWrapper bg="gray.50" id="all-playbooks">
        <SectionHeader
          heading={t('hero.badge')}
        />

        <PlaybookFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          industry={industry}
          onIndustryChange={setIndustry}
        />

        {filtered.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            {filtered.map((tpl, i) => (
              <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
            ))}
          </SimpleGrid>
        ) : (
          <VStack py={16} spacing={3}>
            <Text fontSize="lg" fontWeight="600" color="gray.600">
              {t('empty.heading')}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {t('empty.subtitle')}
            </Text>
          </VStack>
        )}
      </SectionWrapper>

      <PageCTA
        heading={t('bottomCTA.heading')}
        subtitle={t('bottomCTA.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
