import {
  Box, Container, Heading, Text, VStack, List, ListItem, ListIcon,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack align="flex-start" spacing={3} w="full">
      <Heading as="h2" size="md" fontWeight="700">
        {title}
      </Heading>
      {children}
    </VStack>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <List spacing={2}>
      {items.map((item) => (
        <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="gray.600">
          <ListIcon as={FiCheck} color="brand.400" mt={1} />
          {item}
        </ListItem>
      ))}
    </List>
  );
}

export function PrivacyPolicy() {
  const { t } = useTranslation('privacy');

  const sections = [
    { key: 'intro', hasItems: false },
    { key: 'collection', hasItems: true },
    { key: 'use', hasItems: true },
    { key: 'sharing', hasItems: true, hasText: true },
    { key: 'security', hasItems: true, hasText: true },
    { key: 'rights', hasItems: true, hasText: true },
    { key: 'whatsapp', hasItems: false },
    { key: 'deletion', hasItems: false },
    { key: 'retention', hasItems: false },
    { key: 'children', hasItems: false },
    { key: 'changes', hasItems: false },
    { key: 'contact', hasItems: false, hasExtra: true },
    { key: 'consent', hasItems: false },
  ];

  return (
    <Box pt={24} pb={16}>
      <Container maxW="800px">
        <VStack spacing={8} align="flex-start">
          <VStack align="flex-start" spacing={2}>
            <Heading as="h1" size="xl" fontWeight="800">
              {t('title')}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {t('lastUpdated')}
            </Text>
          </VStack>

          {sections.map((section) => (
            <Section key={section.key} title={t(`${section.key}.title`)}>
              {(section.hasText || !section.hasItems) && (
                <Text color="gray.600" fontSize="sm" lineHeight="1.8">
                  {t(`${section.key}.text`)}
                </Text>
              )}
              {section.hasItems && (
                <BulletList items={t(`${section.key}.items`, { returnObjects: true }) as string[]} />
              )}
              {section.hasExtra && (
                <VStack align="flex-start" spacing={1}>
                  <Text color="gray.600" fontSize="sm">{t('contact.email')}</Text>
                  <Text color="gray.600" fontSize="sm">{t('contact.whatsapp')}</Text>
                </VStack>
              )}
            </Section>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
