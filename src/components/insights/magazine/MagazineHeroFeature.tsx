import {
  Box,
  Badge,
  Heading,
  Text,
  HStack,
  LinkBox,
  LinkOverlay,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article } from '../../../data/articles';
import { categoryColors, categoryLabelKeys } from '../../../data/articles';
import { getArticleImage, getCategoryPlaceholder } from '../../../data/articleImages';
import { MagazineCardMedium } from './MagazineCardMedium';

interface MagazineHeroFeatureProps {
  hero: Article;
  sidebar: Article[];
}

export function MagazineHeroFeature({ hero, sidebar }: MagazineHeroFeatureProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();
  const color = categoryColors[hero.category];
  const images = getArticleImage(hero.slug, hero.category);

  return (
    <Box as="section" py={{ base: 6, md: 10 }}>
      <Grid
        templateColumns={{ base: '1fr', lg: '3fr 2fr' }}
        gap={6}
        minH={{ lg: '480px' }}
      >
        {/* Main hero card */}
        <GridItem>
          <MotionBox {...fadeInUp} h="full">
            <LinkBox
              as="article"
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              h="full"
              minH={{ base: '300px', md: '400px' }}
              _hover={{ boxShadow: '2xl' }}
              transition="all 0.3s ease"
              role="group"
            >
              <Image
                src={images.hero}
                alt=""
                fallbackSrc={getCategoryPlaceholder(hero.category)}
                objectFit="cover"
                w="100%"
                h="100%"
                position="absolute"
                inset={0}
                transition="transform 0.4s ease"
                _groupHover={{ transform: 'scale(1.03)' }}
                loading="eager"
              />
              {/* Gradient overlay */}
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-t, blackAlpha.800 0%, blackAlpha.400 40%, transparent 70%)"
              />
              {/* Content overlay */}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={{ base: 5, md: 8 }}
              >
                <HStack spacing={3} mb={3}>
                  <Badge
                    colorScheme={color}
                    fontSize="xs"
                    borderRadius="full"
                    px={2.5}
                    py={0.5}
                  >
                    {t(categoryLabelKeys[hero.category].replace('insights.', ''))}
                  </Badge>
                  {hero.tier === 'case' && (
                    <Badge
                      variant="outline"
                      color="white"
                      borderColor="whiteAlpha.500"
                      fontSize="xs"
                      borderRadius="full"
                      px={2}
                    >
                      Case
                    </Badge>
                  )}
                </HStack>

                <LinkOverlay as={Link} to={lp(`/insights/${hero.slug}`)}>
                  <Heading
                    as="h2"
                    fontSize={{ base: 'xl', md: '3xl', lg: '4xl' }}
                    fontWeight="800"
                    lineHeight="1.2"
                    color="white"
                    mb={3}
                    noOfLines={3}
                  >
                    {t(hero.titleKey.replace('insights.', ''))}
                  </Heading>
                </LinkOverlay>

                <Text
                  color="whiteAlpha.800"
                  fontSize={{ base: 'sm', md: 'md' }}
                  noOfLines={2}
                  mb={3}
                  lineHeight="1.6"
                >
                  {t(hero.subtitleKey.replace('insights.', ''))}
                </Text>

                <HStack spacing={2} fontSize="xs" color="whiteAlpha.700">
                  <Text>
                    {new Date(hero.publishedDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text>·</Text>
                  <Text>{t('listing.readingTime', { min: hero.readingTime })}</Text>
                </HStack>
              </Box>
            </LinkBox>
          </MotionBox>
        </GridItem>

        {/* Sidebar cards */}
        <GridItem>
          <Grid templateRows="1fr 1fr" gap={6} h="full">
            {sidebar.map((article, i) => (
              <GridItem key={article.slug}>
                <MagazineCardMedium article={article} index={i + 1} />
              </GridItem>
            ))}
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
}
