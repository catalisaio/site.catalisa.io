import {
  Box,
  Heading,
  Grid,
  GridItem,
  VStack,
  Button,
  Container,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article, ArticleCategory } from '../../../data/articles';
import { categoryColors, categoryLabelKeys } from '../../../data/articles';
import { MagazineCardLarge } from './MagazineCardLarge';
import { MagazineCardCompact } from './MagazineCardCompact';

interface MagazineCategorySectionProps {
  category: ArticleCategory;
  articles: Article[];
}

/**
 * Category section: 1 Large card + stack of Compact cards.
 * Left border colored with the category's color.
 */
export function MagazineCategorySection({
  category,
  articles: catArticles,
}: MagazineCategorySectionProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();
  const color = categoryColors[category];

  if (catArticles.length < 2) return null;

  const main = catArticles[0];
  const rest = catArticles.slice(1, 4);

  return (
    <Box as="section" py={{ base: 6, md: 10 }}>
      <Container maxW="1280px">
        <Box
          borderLeft="4px solid"
          borderColor={`${color}.400`}
          pl={{ base: 4, md: 6 }}
        >
          <MotionBox {...fadeInUp} mb={6}>
            <Heading
              as="h2"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="700"
              color="gray.800"
            >
              {t(categoryLabelKeys[category].replace('insights.', ''))}
            </Heading>
          </MotionBox>

          <Grid
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
            gap={6}
          >
            {/* Main article — Large card */}
            <GridItem>
              <MagazineCardLarge article={main} index={0} />
            </GridItem>

            {/* Compact cards stack */}
            <GridItem>
              <VStack spacing={4} align="stretch" h="full">
                {rest.map((article, i) => (
                  <MagazineCardCompact
                    key={article.slug}
                    article={article}
                    index={i + 1}
                  />
                ))}

                <Button
                  as={Link}
                  to={lp('/insights')}
                  variant="ghost"
                  size="sm"
                  colorScheme={color}
                  alignSelf="flex-start"
                  fontWeight="600"
                  mt="auto"
                >
                  {t('magazine.seeAll')} →
                </Button>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
