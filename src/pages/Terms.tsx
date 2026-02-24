import { Box, Container, Heading, Text, VStack, UnorderedList, ListItem, Divider } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function Terms() {
  const { t } = useTranslation('terms');
  const sections = t('sections', { returnObjects: true }) as Array<{
    title: string;
    content: string;
    items?: string[];
  }>;

  return (
    <Box bg="white" pt={20} pb={16}>
      <Container maxW="800px">
        <VStack spacing={8} align="stretch">
          <VStack spacing={3} align="flex-start">
            <Heading as="h1" size="2xl" fontWeight="800">
              {t('title')}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {t('lastUpdated')}
            </Text>
          </VStack>

          <Divider />

          {sections.map((section, i) => (
            <VStack key={i} spacing={3} align="stretch">
              <Heading as="h2" size="md" fontWeight="700" color="gray.800">
                {i + 1}. {section.title}
              </Heading>
              <Text color="gray.600" fontSize="sm" lineHeight="tall" whiteSpace="pre-line">
                {section.content}
              </Text>
              {section.items && (
                <UnorderedList spacing={1} pl={4}>
                  {section.items.map((item, j) => (
                    <ListItem key={j} color="gray.600" fontSize="sm">
                      {item}
                    </ListItem>
                  ))}
                </UnorderedList>
              )}
            </VStack>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
