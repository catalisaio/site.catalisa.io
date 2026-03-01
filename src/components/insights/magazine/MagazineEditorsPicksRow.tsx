import { Box, Heading, SimpleGrid, Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../../motion';
import type { Article } from '../../../data/articles';
import { MagazineCardMedium } from './MagazineCardMedium';
import { MagazineCardQuote } from './MagazineCardQuote';

interface MagazineEditorsPicksRowProps {
  articles: Article[];
}

/**
 * Editor's picks section: 2 Medium cards + 1 Quote card in the center.
 * Expects exactly 3 articles — the middle one renders as a Quote.
 */
export function MagazineEditorsPicksRow({ articles: picks }: MagazineEditorsPicksRowProps) {
  const { t } = useTranslation('insights');

  if (picks.length < 3) return null;

  return (
    <Box as="section" py={{ base: 8, md: 12 }} bg="gray.50">
      <Container maxW="1280px">
        <MotionBox {...fadeInUp} mb={6}>
          <Heading
            as="h2"
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="700"
            color="gray.800"
          >
            {t('magazine.editorsPicks')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <MagazineCardMedium article={picks[0]} index={0} />
          <MagazineCardQuote article={picks[1]} index={1} />
          <MagazineCardMedium article={picks[2]} index={2} />
        </SimpleGrid>
      </Container>
    </Box>
  );
}
