import {
  Box,
  Badge,
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
import { categoryColors, categoryLabelKeys } from '../../../data/articles';
import { getArticleImage, getCategoryPlaceholder } from '../../../data/articleImages';

interface MagazineCardMediumProps {
  article: Article;
  index?: number;
}

export function MagazineCardMedium({ article, index = 0 }: MagazineCardMediumProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();
  const color = categoryColors[article.category];
  const images = getArticleImage(article.slug, article.category);

  return (
    <MotionBox {...fadeInUp} transition={{ duration: 0.5, delay: index * 0.05 }} h="full">
      <LinkBox
        as="article"
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
        _hover={{
          borderColor: 'brand.200',
          boxShadow: 'lg',
          transform: 'translateY(-4px)',
        }}
        transition="all 0.3s ease"
        h="full"
        display="flex"
        flexDirection="column"
      >
        {/* Image (3:2 ratio) */}
        <Box position="relative" overflow="hidden" pt="66.66%">
          <Image
            src={images.thumbnail}
            alt=""
            fallbackSrc={getCategoryPlaceholder(article.category)}
            objectFit="cover"
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            transition="transform 0.3s ease"
            _groupHover={{ transform: 'scale(1.03)' }}
            loading="lazy"
          />
          <Badge
            position="absolute"
            top={3}
            left={3}
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
        <Box p={{ base: 4, md: 5 }} flex={1} display="flex" flexDirection="column">
          <LinkOverlay as={Link} to={lp(`/insights/${article.slug}`)}>
            <Heading
              as="h3"
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="700"
              lineHeight="1.3"
              mb={2}
              noOfLines={2}
            >
              {t(article.titleKey.replace('insights.', ''))}
            </Heading>
          </LinkOverlay>

          <Text
            color="gray.500"
            fontSize="sm"
            noOfLines={2}
            mb={3}
            lineHeight="1.5"
          >
            {t(article.subtitleKey.replace('insights.', ''))}
          </Text>

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
        </Box>
      </LinkBox>
    </MotionBox>
  );
}
