import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';

interface ArticleBodyProps {
  article: Article;
}

export function ArticleBody({ article }: ArticleBodyProps) {
  const { t } = useTranslation('insights');

  const bodyTypeSections = article.sections.filter((s) => s.type !== 'catalisa');

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="780px">
        {bodyTypeSections.map((section, i) => (
          <MotionBox
            key={i}
            {...fadeInUp}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            mb={section.type === 'intro' ? 8 : 10}
          >
            {section.headingKey && (
              <Heading
                as="h2"
                size="md"
                fontWeight="700"
                mb={4}
                color="gray.800"
              >
                {t(section.headingKey.replace('insights.', ''))}
              </Heading>
            )}
            <Box>
              {t(section.contentKey.replace('insights.', ''))
                .split('\n\n')
                .map((paragraph, pi) => (
                  <Text
                    key={pi}
                    fontSize="md"
                    color="gray.600"
                    lineHeight="1.8"
                    mb={4}
                  >
                    {paragraph}
                  </Text>
                ))}
            </Box>
          </MotionBox>
        ))}
      </Container>
    </Box>
  );
}
