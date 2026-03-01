import { Box, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article } from '../../../data/articles';
import { categoryColors } from '../../../data/articles';

interface MagazineCardQuoteProps {
  article: Article;
  index?: number;
}

/**
 * Card without image — shows a bold metric value + label.
 * Uses the category's color gradient as background.
 */
export function MagazineCardQuote({ article, index = 0 }: MagazineCardQuoteProps) {
  const { t } = useTranslation('insights');
  const color = categoryColors[article.category];

  // Pick the first metric if available
  const metric = article.metrics[0];
  if (!metric) return null;

  return (
    <MotionBox {...fadeInUp} transition={{ duration: 0.5, delay: index * 0.05 }} h="full">
      <Box
        bg={`${color}.50`}
        bgGradient={`linear(to-br, ${color}.50, ${color}.100)`}
        borderRadius="xl"
        border="1px solid"
        borderColor={`${color}.200`}
        p={{ base: 6, md: 8 }}
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
        }}
        transition="all 0.3s ease"
      >
        <VStack spacing={3} textAlign="center">
          <Text
            fontSize={{ base: '4xl', md: '5xl' }}
            fontWeight="800"
            color={`${color}.600`}
            lineHeight="1"
          >
            {t(metric.valueKey.replace('insights.', ''))}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="600"
            color={`${color}.700`}
            maxW="200px"
            lineHeight="1.4"
          >
            {t(metric.labelKey.replace('insights.', ''))}
          </Text>
          <Text fontSize="xs" color={`${color}.500`} fontWeight="500">
            {t(article.titleKey.replace('insights.', '')).slice(0, 60)}...
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
}
