import {
  Box, Heading, Text, VStack, HStack, Icon, SimpleGrid,
  Badge, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
} from '@chakra-ui/react';
import { FiMessageCircle, FiShield, FiZap, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { FeatureComparisonTable } from '../components/shared/FeatureComparisonTable';
import { PageCTA } from '../components/shared/PageCTA';
import { MotionBox, fadeInUp } from '../components/motion';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function WhatsAppIntegration() {
  const { t } = useTranslation('whatsapp-integration');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const comparisonRows = t('comparison.rows', { returnObjects: true }) as Array<{
    feature: string;
    cloudApi: string;
    qrCode: string;
  }>;

  const faq = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <>
      {/* Hero */}
      <PageHero
        badge={t('hero.badge')}
        badgeIcon={FiMessageCircle}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor="whatsapp"
        gradient="linear(to-r, whatsapp.300, whatsapp.500)"
        primaryCTA={{ label: tc('cta.chatOnWhatsApp') }}
        secondaryCTA={{ label: tc('cta.learnMore'), href: '#comparison' }}
      />

      {/* Comparison Methods */}
      <SectionWrapper id="comparison">
        <SectionHeader heading={t('comparison.heading')} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
          <MotionBox {...fadeInUp}>
            <VStack
              align="flex-start"
              spacing={4}
              p={6}
              bg="white"
              borderRadius="xl"
              border="2px solid"
              borderColor="blue.400"
              h="full"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              <HStack>
                <Icon as={FiShield} color="blue.500" boxSize={6} />
                <Heading as="h3" size="md" fontWeight="700">{t('comparison.cloudApi.title')}</Heading>
                <Badge colorScheme="blue" fontSize="xs">{t('comparison.cloudApi.badge')}</Badge>
              </HStack>
              <Text color="gray.600" fontSize="sm" lineHeight="tall">{t('comparison.cloudApi.description')}</Text>
              <Text color="blue.600" fontSize="sm" fontWeight="600">{t('comparison.cloudApi.idealFor')}</Text>
            </VStack>
          </MotionBox>

          <MotionBox {...fadeInUp}>
            <VStack
              align="flex-start"
              spacing={4}
              p={6}
              bg="white"
              borderRadius="xl"
              border="2px solid"
              borderColor="green.400"
              h="full"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              <HStack>
                <Icon as={FiZap} color="green.500" boxSize={6} />
                <Heading as="h3" size="md" fontWeight="700">{t('comparison.qrCode.title')}</Heading>
                <Badge colorScheme="green" fontSize="xs">{t('comparison.qrCode.badge')}</Badge>
              </HStack>
              <Text color="gray.600" fontSize="sm" lineHeight="tall">{t('comparison.qrCode.description')}</Text>
              <Text color="green.600" fontSize="sm" fontWeight="600">{t('comparison.qrCode.idealFor')}</Text>
            </VStack>
          </MotionBox>
        </SimpleGrid>

        {/* Comparison Table */}
        <Box maxW="800px" mx="auto">
          <FeatureComparisonTable
            columns={[
              { label: t('comparison.tableHeaders.cloudApi'), highlighted: true },
              { label: t('comparison.tableHeaders.qrCode') },
            ]}
            rows={comparisonRows.map((r) => ({
              feature: r.feature,
              values: [r.cloudApi, r.qrCode],
            }))}
            accentColor="whatsapp"
          />
        </Box>
      </SectionWrapper>

      {/* Decision Guide */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          heading={t('decisionGuide.heading')}
          subtitle={t('decisionGuide.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="800px" mx="auto">
          <VStack align="flex-start" spacing={3} p={6} bg="blue.50" borderRadius="xl">
            <HStack>
              <Icon as={FiShield} color="blue.500" boxSize={5} />
              <Text fontWeight="700" color="blue.700">{t('decisionGuide.cloudApi.title')}</Text>
            </HStack>
            {(t('decisionGuide.cloudApi.scenarios', { returnObjects: true }) as string[]).map((scenario, i) => (
              <HStack key={i} spacing={2}>
                <Icon as={FiCheck} color="blue.500" boxSize={3.5} />
                <Text fontSize="sm" color="gray.700">{scenario}</Text>
              </HStack>
            ))}
          </VStack>

          <VStack align="flex-start" spacing={3} p={6} bg="green.50" borderRadius="xl">
            <HStack>
              <Icon as={FiZap} color="green.500" boxSize={5} />
              <Text fontWeight="700" color="green.700">{t('decisionGuide.qrCode.title')}</Text>
            </HStack>
            {(t('decisionGuide.qrCode.scenarios', { returnObjects: true }) as string[]).map((scenario, i) => (
              <HStack key={i} spacing={2}>
                <Icon as={FiCheck} color="green.500" boxSize={3.5} />
                <Text fontSize="sm" color="gray.700">{scenario}</Text>
              </HStack>
            ))}
          </VStack>
        </SimpleGrid>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <SectionHeader heading={t('faq.heading')} />

        <Box maxW="700px" mx="auto">
          <Accordion allowMultiple>
            {faq.map((item, i) => (
              <AccordionItem key={i} border="none" mb={3}>
                <AccordionButton
                  bg="white"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  px={6}
                  py={4}
                  _hover={{ borderColor: 'whatsapp.500' }}
                  _expanded={{ borderColor: 'whatsapp.500' }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="600" fontSize="sm">{item.question}</Text>
                  </Box>
                  <AccordionIcon color="whatsapp.500" />
                </AccordionButton>
                <AccordionPanel px={6} py={4}>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">{item.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </SectionWrapper>

      {/* PageCTA */}
      <PageCTA
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{ label: t('cta.button'), icon: FiMessageCircle }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
