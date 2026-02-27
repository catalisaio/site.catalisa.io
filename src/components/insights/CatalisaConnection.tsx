import { Box, Container, Heading, Text, VStack, Button, List, ListItem, ListIcon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../motion';
import type { Article } from '../../data/articles';

interface CatalisaConnectionProps {
  article: Article;
}

export function CatalisaConnection({ article }: CatalisaConnectionProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();

  const catalisaSection = article.sections.find((s) => s.type === 'catalisa');
  if (!catalisaSection) return null;

  const paragraphs = t(catalisaSection.contentKey.replace('insights.', '')).split('\n\n');

  return (
    <Box py={{ base: 8, md: 12 }} bg="brand.50">
      <Container maxW="780px">
        <MotionBox {...fadeInUp}>
          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="brand.100"
            p={{ base: 6, md: 8 }}
          >
            {catalisaSection.headingKey && (
              <Heading as="h2" size="md" fontWeight="700" mb={4} color="gray.800">
                {t(catalisaSection.headingKey.replace('insights.', ''))}
              </Heading>
            )}

            <VStack spacing={3} align="stretch" mb={6}>
              {paragraphs.map((p, i) => (
                <Text key={i} fontSize="md" color="gray.600" lineHeight="1.8">
                  {p}
                </Text>
              ))}
            </VStack>

            {article.relatedCatalisaPages.length > 0 && (
              <List spacing={2} mb={6}>
                {article.relatedCatalisaPages.map((page) => (
                  <ListItem key={page} fontSize="sm">
                    <ListIcon as={FiCheck} color="brand.500" />
                    <Box
                      as={Link}
                      to={lp(page)}
                      color="brand.600"
                      fontWeight="500"
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {page.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}

            <Button
              as={Link}
              to={lp('/demo')}
              size="md"
              bgGradient="linear(to-r, brand.500, brand.400)"
              color="white"
              _hover={{ bgGradient: 'linear(to-r, brand.600, brand.500)', transform: 'translateY(-1px)' }}
              rightIcon={<FiArrowRight />}
              borderRadius="lg"
              transition="all 0.2s"
            >
              {t('article.catalisaCTA')}
            </Button>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
