import {
  Box,
  Badge,
  Heading,
  Text,
  HStack,
  LinkBox,
  LinkOverlay,
  Image,
  Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article } from '../../../data/articles';
import { categoryColors, categoryLabelKeys } from '../../../data/articles';
import { getArticleImage, getCategoryPlaceholder } from '../../../data/articleImages';

interface MagazineCardLargeProps {
  article: Article;
  index?: number;
}

export function MagazineCardLarge({ article, index = 0 }: MagazineCardLargeProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();
  const color = categoryColors[article.category];
  const images = getArticleImage(article.slug, article.category);

  return (
    <MotionBox {...fadeInUp} transition={{ duration: 0.5, delay: index * 0.05 }}>
      <LinkBox
        as="article"
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
        _hover={{
          borderColor: 'brand.200',
          boxShadow: 'xl',
          transform: 'translateY(-4px)',
        }}
        transition="all 0.3s ease"
        h="full"
      >
        <Flex direction={{ base: 'column', md: 'row' }} h="full">
          {/* Image */}
          <Box
            position="relative"
            w={{ base: '100%', md: '50%' }}
            minH={{ base: '200px', md: '280px' }}
            overflow="hidden"
          >
            <Image
              src={images.hero}
              alt=""
              fallbackSrc={getCategoryPlaceholder(article.category)}
              objectFit="cover"
              w="100%"
              h="100%"
              position="absolute"
              inset={0}
              transition="transform 0.3s ease"
              _groupHover={{ transform: 'scale(1.03)' }}
              loading="lazy"
            />
            {/* Gradient overlay */}
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, blackAlpha.600, transparent)"
            />
            {/* Badge on image */}
            <Badge
              position="absolute"
              top={4}
              left={4}
              colorScheme={color}
              fontSize="xs"
              borderRadius="full"
              px={2.5}
              py={0.5}
            >
              {t(categoryLabelKeys[article.category].replace('insights.', ''))}
            </Badge>
          </Box>

          {/* Text */}
          <Flex
            direction="column"
            justify="center"
            w={{ base: '100%', md: '50%' }}
            p={{ base: 5, md: 8 }}
          >
            <HStack spacing={3} mb={3}>
              {article.tier === 'case' && (
                <Badge
                  variant="outline"
                  colorScheme="gray"
                  fontSize="xs"
                  borderRadius="full"
                  px={2}
                >
                  Case
                </Badge>
              )}
            </HStack>

            <LinkOverlay as={Link} to={lp(`/insights/${article.slug}`)}>
              <Heading
                as="h2"
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="700"
                lineHeight="1.3"
                mb={3}
                noOfLines={3}
              >
                {t(article.titleKey.replace('insights.', ''))}
              </Heading>
            </LinkOverlay>

            <Text
              color="gray.500"
              fontSize="sm"
              noOfLines={3}
              mb={4}
              lineHeight="1.6"
            >
              {t(article.subtitleKey.replace('insights.', ''))}
            </Text>

            {article.metrics.length > 0 && (
              <HStack spacing={4} mb={4} flexWrap="wrap">
                {article.metrics.slice(0, 2).map((m, i) => (
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
              <Text>
                {new Date(article.publishedDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <Text>·</Text>
              <Text>{t('listing.readingTime', { min: article.readingTime })}</Text>
            </HStack>
          </Flex>
        </Flex>
      </LinkBox>
    </MotionBox>
  );
}
