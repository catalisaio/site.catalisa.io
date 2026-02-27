import { Box, Container, Heading, Text, VStack, Link as ChakraLink } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';

interface ArticleReferencesProps {
  article: Article;
}

export function ArticleReferences({ article }: ArticleReferencesProps) {
  const { t } = useTranslation('insights');

  if (article.sources.length === 0) return null;

  return (
    <Box py={{ base: 8, md: 10 }}>
      <Container maxW="780px">
        <MotionBox {...fadeInUp}>
          <Box
            bg="gray.50"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            p={{ base: 5, md: 6 }}
          >
            <Heading as="h3" size="sm" fontWeight="700" mb={4} color="gray.700">
              {t('article.referencesTitle')}
            </Heading>

            <VStack spacing={3} align="stretch">
              {article.sources.map((source, i) => (
                <Text key={i} fontSize="sm" color="gray.600" lineHeight="1.6" fontFamily="mono">
                  {source.author}. &ldquo;{source.title}&rdquo;. <em>{source.site}</em>.{' '}
                  Disponível em:{' '}
                  <ChakraLink
                    href={source.url}
                    color="brand.600"
                    isExternal
                    rel="nofollow noopener noreferrer"
                    wordBreak="break-all"
                  >
                    {source.url}
                  </ChakraLink>
                  . Acesso em: {source.accessDate}.
                </Text>
              ))}
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
