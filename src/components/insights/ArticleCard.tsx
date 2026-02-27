import { Box, Badge, Heading, Text, HStack, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';
import { categoryColors, categoryLabelKeys } from '../../data/articles';

interface ArticleCardProps {
  article: Article;
  index?: number;
  featured?: boolean;
}

export function ArticleCard({ article, index = 0, featured = false }: ArticleCardProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();
  const color = categoryColors[article.category];

  return (
    <MotionBox
      {...fadeInUp}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <LinkBox
        as="article"
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
        _hover={{ borderColor: 'brand.200', boxShadow: 'lg', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
        h="full"
        display="flex"
        flexDirection="column"
      >
        <Box p={{ base: 5, md: featured ? 8 : 6 }}>
          <HStack spacing={3} mb={3}>
            <Badge colorScheme={color} fontSize="xs" borderRadius="full" px={2.5} py={0.5}>
              {t(categoryLabelKeys[article.category].replace('insights.', ''))}
            </Badge>
            {article.tier === 'case' && (
              <Badge variant="outline" colorScheme="gray" fontSize="xs" borderRadius="full" px={2}>
                Case
              </Badge>
            )}
          </HStack>

          <LinkOverlay as={Link} to={lp(`/insights/${article.slug}`)}>
            <Heading
              as={featured ? 'h2' : 'h3'}
              size={featured ? 'md' : 'sm'}
              fontWeight="700"
              lineHeight="1.3"
              mb={2}
              noOfLines={featured ? 3 : 2}
            >
              {t(article.titleKey.replace('insights.', ''))}
            </Heading>
          </LinkOverlay>

          <Text
            color="gray.500"
            fontSize="sm"
            noOfLines={2}
            mb={4}
            lineHeight="1.5"
          >
            {t(article.subtitleKey.replace('insights.', ''))}
          </Text>

          {featured && article.metrics.length > 0 && (
            <HStack spacing={4} mb={4} flexWrap="wrap">
              {article.metrics.slice(0, 3).map((m, i) => (
                <HStack key={i} spacing={1.5}>
                  <Text fontWeight="700" fontSize="sm" color="brand.600">
                    {t(m.valueKey.replace('insights.', ''))}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {t(m.labelKey.replace('insights.', ''))}
                  </Text>
                </HStack>
              ))}
            </HStack>
          )}

          <HStack spacing={2} fontSize="xs" color="gray.400" mt="auto">
            <Text>{new Date(article.publishedDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            <Text>·</Text>
            <Text>{t('listing.readingTime', { min: article.readingTime })}</Text>
            {article.tier === 'case' && article.sources[0] && (
              <>
                <Text>·</Text>
                <Text>{t('listing.source')}: {article.sources[0].site}</Text>
              </>
            )}
          </HStack>
        </Box>
      </LinkBox>
    </MotionBox>
  );
}
