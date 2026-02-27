import { Box, Container, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';

interface ArticleMetricsProps {
  article: Article;
}

export function ArticleMetrics({ article }: ArticleMetricsProps) {
  const { t } = useTranslation('insights');

  if (article.metrics.length === 0) return null;

  return (
    <Box py={{ base: 6, md: 8 }} bg="gray.50">
      <Container maxW="780px">
        <SimpleGrid columns={{ base: 1, sm: article.metrics.length }} spacing={4}>
          {article.metrics.map((metric, i) => (
            <MotionBox
              key={i}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <VStack
                bg="white"
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                spacing={1}
                textAlign="center"
              >
                <Text
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="800"
                  bgGradient="linear(to-r, brand.500, brand.400)"
                  bgClip="text"
                >
                  {t(metric.valueKey.replace('insights.', ''))}
                </Text>
                <Text fontSize="sm" color="gray.500" lineHeight="1.3">
                  {t(metric.labelKey.replace('insights.', ''))}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
