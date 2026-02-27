import { Box, Container, Badge, Heading, Text, HStack, Flex, Icon } from '@chakra-ui/react';
import { FiCalendar, FiClock, FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import type { Article } from '../../data/articles';
import { categoryColors, categoryLabelKeys } from '../../data/articles';

interface ArticleHeroProps {
  article: Article;
}

const categoryGradients: Record<string, string> = {
  varejo: 'linear(to-br, purple.900, purple.800, gray.900)',
  'food-tech': 'linear(to-br, orange.900, orange.800, gray.900)',
  atendimento: 'linear(to-br, blue.900, blue.800, gray.900)',
  'conversational-commerce': 'linear(to-br, green.900, green.800, gray.900)',
  estrategia: 'linear(to-br, yellow.900, orange.900, gray.900)',
};

const categoryAccentColors: Record<string, string> = {
  varejo: 'rgba(128, 90, 213, 0.15)',
  'food-tech': 'rgba(237, 137, 54, 0.15)',
  atendimento: 'rgba(66, 153, 225, 0.15)',
  'conversational-commerce': 'rgba(72, 187, 120, 0.15)',
  estrategia: 'rgba(236, 201, 75, 0.15)',
};

export function ArticleHero({ article }: ArticleHeroProps) {
  const { t } = useTranslation('insights');
  const color = categoryColors[article.category];
  const gradient = categoryGradients[article.category] || categoryGradients.varejo;
  const accent = categoryAccentColors[article.category] || categoryAccentColors.varejo;

  return (
    <Box
      bgGradient={gradient}
      position="relative"
      overflow="hidden"
      pt={{ base: 16, md: 24 }}
      pb={{ base: 12, md: 20 }}
    >
      {/* Decorative glow */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="700px"
        h="700px"
        bgGradient={`radial(circle, ${accent} 0%, transparent 70%)`}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-30%"
        left="-5%"
        w="500px"
        h="500px"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.06) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Subtle grid pattern overlay */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.03}
        bgImage="linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)"
        bgSize="60px 60px"
        pointerEvents="none"
      />

      <Container maxW="900px" position="relative" zIndex={1}>
        {/* Badges */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HStack spacing={3} mb={5}>
            <Badge
              colorScheme={color}
              fontSize="xs"
              borderRadius="full"
              px={3}
              py={1}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {t(categoryLabelKeys[article.category].replace('insights.', ''))}
            </Badge>
            {article.tier === 'case' && (
              <Badge
                bg="whiteAlpha.150"
                color="whiteAlpha.800"
                fontSize="xs"
                borderRadius="full"
                px={3}
                py={1}
              >
                Case Study
              </Badge>
            )}
            {article.tier === 'thematic' && (
              <Badge
                bg="whiteAlpha.150"
                color="whiteAlpha.800"
                fontSize="xs"
                borderRadius="full"
                px={3}
                py={1}
              >
                Analysis
              </Badge>
            )}
          </HStack>
        </MotionBox>

        {/* Title */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
            fontWeight="800"
            lineHeight="1.1"
            color="white"
            mb={4}
          >
            {t(article.titleKey.replace('insights.', ''))}
          </Heading>
        </MotionBox>

        {/* Subtitle */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="whiteAlpha.700"
            lineHeight="1.7"
            maxW="750px"
            mb={6}
          >
            {t(article.subtitleKey.replace('insights.', ''))}
          </Text>
        </MotionBox>

        {/* Meta info */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Flex
            gap={{ base: 3, md: 5 }}
            flexWrap="wrap"
            fontSize="sm"
            color="whiteAlpha.600"
          >
            <HStack spacing={1.5}>
              <Icon as={FiCalendar} boxSize={3.5} />
              <Text>
                {new Date(article.publishedDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </HStack>
            <HStack spacing={1.5}>
              <Icon as={FiClock} boxSize={3.5} />
              <Text>{t('listing.readingTime', { min: article.readingTime })}</Text>
            </HStack>
            {article.sources[0] && (
              <HStack spacing={1.5}>
                <Icon as={FiExternalLink} boxSize={3.5} />
                <Text>{t('listing.source')}: {article.sources[0].site}</Text>
              </HStack>
            )}
          </Flex>
        </MotionBox>
      </Container>
    </Box>
  );
}
