import {
  Box,
  Heading,
  Text,
  HStack,
  LinkBox,
  LinkOverlay,
  Image,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article } from '../../../data/articles';
import { getArticleImage, getCategoryPlaceholder } from '../../../data/articleImages';

interface MagazineCardCompactProps {
  article: Article;
  index?: number;
}

export function MagazineCardCompact({ article, index = 0 }: MagazineCardCompactProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();
  const images = getArticleImage(article.slug, article.category);

  return (
    <MotionBox {...fadeInUp} transition={{ duration: 0.5, delay: index * 0.05 }}>
      <LinkBox
        as="article"
        bg="white"
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
        _hover={{
          borderColor: 'brand.200',
          boxShadow: 'md',
          transform: 'translateY(-4px)',
        }}
        transition="all 0.3s ease"
      >
        <HStack spacing={3} p={3} align="center">
          {/* Thumbnail 80px */}
          <Box
            flexShrink={0}
            w="80px"
            h="80px"
            borderRadius="md"
            overflow="hidden"
          >
            <Image
              src={images.thumbnail}
              alt=""
              fallbackSrc={getCategoryPlaceholder(article.category)}
              objectFit="cover"
              w="100%"
              h="100%"
              transition="transform 0.3s ease"
              loading="lazy"
            />
          </Box>

          {/* Text */}
          <Box flex={1} minW={0}>
            <LinkOverlay as={Link} to={lp(`/insights/${article.slug}`)}>
              <Heading
                as="h4"
                fontSize="sm"
                fontWeight="600"
                lineHeight="1.4"
                noOfLines={2}
                mb={1}
              >
                {t(article.titleKey.replace('insights.', ''))}
              </Heading>
            </LinkOverlay>

            <HStack spacing={2} fontSize="xs" color="gray.400">
              <Text>
                {new Date(article.publishedDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
              <Text>·</Text>
              <Text>{t('listing.readingTime', { min: article.readingTime })}</Text>
            </HStack>
          </Box>
        </HStack>
      </LinkBox>
    </MotionBox>
  );
}
