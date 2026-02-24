import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { JsonLd } from '../../seo/JsonLd';
import { getFAQPageSchema } from '../../seo/schemas/faq';

export function FAQ() {
  const { t } = useTranslation('home');
  const items = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  const schema = useMemo(() => getFAQPageSchema(items), [items]);

  return (
    <SectionWrapper bg="gray.50" id="faq">
      <JsonLd data={schema} />
      <VStack spacing={8} textAlign="center" mb={8}>
        <Heading as="h2" size="xl" fontWeight="800">
          {t('faq.heading')}
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          {t('faq.subtitle')}
        </Text>
      </VStack>

      <Box maxW="800px" mx="auto">
        <Accordion allowMultiple>
          {items.map((item, i) => (
            <AccordionItem key={i} border="none" mb={3}>
              <AccordionButton
                bg="white"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                px={6}
                py={4}
                _hover={{ borderColor: 'brand.500' }}
                _expanded={{ borderColor: 'brand.500', bg: 'white' }}
              >
                <Box flex="1" textAlign="left">
                  <Text fontWeight="600" fontSize="md" color="gray.800">
                    {item.question}
                  </Text>
                </Box>
                <AccordionIcon color="brand.500" />
              </AccordionButton>
              <AccordionPanel px={6} py={4}>
                <Text color="gray.600" fontSize="sm" lineHeight="tall">
                  {item.answer}
                </Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </SectionWrapper>
  );
}
