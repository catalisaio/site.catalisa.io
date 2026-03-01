import { Box, Heading, Container, Grid, GridItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article } from '../../../data/articles';
import { MagazineCardMedium } from './MagazineCardMedium';
import { MagazineCardCompact } from './MagazineCardCompact';

interface MagazineLatestGridProps {
  articles: Article[];
}

/**
 * Bento-style asymmetric grid for "latest" articles.
 * Layout:
 * ┌────────┬────────┬──────────────────┐
 * │ Medium │ Medium │                  │
 * │        │        │    Medium (lg)   │
 * ├────────┴────────┼─────────┬────────┤
 * │   Compact       │ Compact │Compact │
 * └─────────────────┴─────────┴────────┘
 */
export function MagazineLatestGrid({ articles: items }: MagazineLatestGridProps) {
  const { t } = useTranslation('insights');

  if (items.length === 0) return null;

  // Split into medium (first 3) and compact (rest)
  const mediumItems = items.slice(0, 3);
  const compactItems = items.slice(3, 6);

  return (
    <Box as="section" py={{ base: 8, md: 12 }}>
      <Container maxW="1280px">
        <MotionBox {...fadeInUp} mb={6}>
          <Heading
            as="h2"
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="700"
            color="gray.800"
          >
            {t('magazine.latest')}
          </Heading>
        </MotionBox>

        {/* Bento grid */}
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          templateRows={{ lg: 'auto auto' }}
          gap={6}
        >
          {/* Row 1: Medium cards */}
          {mediumItems.map((article, i) => (
            <GridItem
              key={article.slug}
              rowSpan={i === 2 ? { lg: 2 } : undefined}
            >
              <MagazineCardMedium article={article} index={i} />
            </GridItem>
          ))}

          {/* Row 2: Compact cards */}
          {compactItems.map((article, i) => (
            <GridItem key={article.slug}>
              <MagazineCardCompact article={article} index={i + 3} />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
