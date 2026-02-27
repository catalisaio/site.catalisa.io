import { Box, Container, Badge, Heading, Text, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';
import { categoryColors, categoryLabelKeys } from '../../data/articles';

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps) {
  const { t } = useTranslation('insights');
  const color = categoryColors[article.category];

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="780px">
        <MotionBox {...fadeInUp}>
          <HStack spacing={3} mb={4}>
            <Badge colorScheme={color} fontSize="xs" borderRadius="full" px={3} py={1}>
              {t(categoryLabelKeys[article.category].replace('insights.', ''))}
            </Badge>
            {article.tier === 'case' && (
              <Badge variant="outline" colorScheme="gray" fontSize="xs" borderRadius="full" px={2}>
                Case
              </Badge>
            )}
          </HStack>

          <Heading
            as="h1"
            size={{ base: 'lg', md: 'xl' }}
            fontWeight="800"
            lineHeight="1.2"
            mb={3}
          >
            {t(article.titleKey.replace('insights.', ''))}
          </Heading>

          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.500"
            lineHeight="1.6"
            mb={5}
          >
            {t(article.subtitleKey.replace('insights.', ''))}
          </Text>

          <HStack spacing={3} fontSize="sm" color="gray.400" flexWrap="wrap">
            <Text>
              {new Date(article.publishedDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text>·</Text>
            <Text>{t('listing.readingTime', { min: article.readingTime })}</Text>
            {article.sources[0] && (
              <>
                <Text>·</Text>
                <Text>{t('listing.source')}: {article.sources[0].site}</Text>
              </>
            )}
          </HStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
