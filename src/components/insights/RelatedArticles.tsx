import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';
import { getRelatedArticles } from '../../data/articles';
import { ArticleCard } from './ArticleCard';

interface RelatedArticlesProps {
  article: Article;
}

export function RelatedArticles({ article }: RelatedArticlesProps) {
  const { t } = useTranslation('insights');
  const related = getRelatedArticles(article);

  if (related.length === 0) return null;

  return (
    <Box py={{ base: 10, md: 14 }} bg="gray.50">
      <Container maxW="1280px">
        <MotionBox {...fadeInUp}>
          <Heading as="h2" size="md" fontWeight="700" mb={8} textAlign="center">
            {t('article.relatedTitle')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {related.map((a, i) => (
            <ArticleCard key={a.slug} article={a} index={i} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
