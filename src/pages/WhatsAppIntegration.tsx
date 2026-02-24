import {
  Box, Container, Heading, Text, VStack, HStack, Icon, SimpleGrid, Button,
  Table, Thead, Tbody, Tr, Th, Td, Badge,
  Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
} from '@chakra-ui/react';
import { FiMessageCircle, FiShield, FiZap, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { GradientText } from '../components/shared/GradientText';
import { MotionBox, fadeInUp } from '../components/motion';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20conectar%20meu%20WhatsApp%20com%20a%20Catalisa.';

export function WhatsAppIntegration() {
  const { t } = useTranslation('whatsapp-integration');
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
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={4} textAlign="center" maxW="800px" mx="auto">
            <MotionBox {...fadeInUp}>
              <HStack
                bg="whiteAlpha.100"
                px={4}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                spacing={2}
                mx="auto"
                w="fit-content"
              >
                <Icon as={FiMessageCircle} color="whatsapp.400" boxSize={4} />
                <Text color="whiteAlpha.800" fontSize="sm" fontWeight="600">{t('hero.badge')}</Text>
              </HStack>
            </MotionBox>

            <MotionBox {...fadeInUp}>
              <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="800" color="white" lineHeight="1.1">
                {t('hero.heading')}{' '}
                <GradientText gradient="linear(to-r, whatsapp.300, whatsapp.500)" fontSize="inherit" fontWeight="inherit">
                  {t('hero.headingGradient')}
                </GradientText>
              </Heading>
            </MotionBox>

            <MotionBox {...fadeInUp}>
              <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="600px">
                {t('hero.subtitle')}
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Comparison Methods */}
      <SectionWrapper>
        <VStack spacing={8} textAlign="center" mb={10}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('comparison.heading')}
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
          {/* Cloud API Card */}
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
            >
              <HStack>
                <Icon as={FiShield} color="blue.500" boxSize={6} />
                <Heading as="h3" size="md" fontWeight="700">{t('comparison.cloudApi.title')}</Heading>
                <Badge colorScheme="blue" fontSize="xs">{t('comparison.cloudApi.badge')}</Badge>
              </HStack>
              <Text color="gray.600" fontSize="sm" lineHeight="tall">
                {t('comparison.cloudApi.description')}
              </Text>
              <Text color="blue.600" fontSize="sm" fontWeight="600">
                {t('comparison.cloudApi.idealFor')}
              </Text>
            </VStack>
          </MotionBox>

          {/* QR Code Card */}
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
            >
              <HStack>
                <Icon as={FiZap} color="green.500" boxSize={6} />
                <Heading as="h3" size="md" fontWeight="700">{t('comparison.qrCode.title')}</Heading>
                <Badge colorScheme="green" fontSize="xs">{t('comparison.qrCode.badge')}</Badge>
              </HStack>
              <Text color="gray.600" fontSize="sm" lineHeight="tall">
                {t('comparison.qrCode.description')}
              </Text>
              <Text color="green.600" fontSize="sm" fontWeight="600">
                {t('comparison.qrCode.idealFor')}
              </Text>
            </VStack>
          </MotionBox>
        </SimpleGrid>

        {/* Comparison Table */}
        <Box overflowX="auto" maxW="800px" mx="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>{t('comparison.tableHeaders.feature')}</Th>
                <Th textAlign="center">{t('comparison.tableHeaders.cloudApi')}</Th>
                <Th textAlign="center">{t('comparison.tableHeaders.qrCode')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {comparisonRows.map((row, i) => (
                <Tr key={i}>
                  <Td fontWeight="500" fontSize="sm">{row.feature}</Td>
                  <Td textAlign="center" fontSize="sm">{row.cloudApi}</Td>
                  <Td textAlign="center" fontSize="sm">{row.qrCode}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SectionWrapper>

      {/* Decision Guide */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={8} textAlign="center" mb={8}>
          <Heading as="h2" size="lg" fontWeight="800">
            {t('decisionGuide.heading')}
          </Heading>
          <Text color="gray.500" maxW="600px" fontSize="md">
            {t('decisionGuide.subtitle')}
          </Text>
        </VStack>

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
        <VStack spacing={8} textAlign="center" mb={8}>
          <Heading as="h2" size="lg" fontWeight="800">
            {t('faq.heading')}
          </Heading>
        </VStack>

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
                  _hover={{ borderColor: 'brand.500' }}
                  _expanded={{ borderColor: 'brand.500' }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="600" fontSize="sm">{item.question}</Text>
                  </Box>
                  <AccordionIcon color="brand.500" />
                </AccordionButton>
                <AccordionPanel px={6} py={4}>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">{item.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="lg" fontWeight="700">
            {t('cta.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px" fontSize="md">
            {t('cta.subtitle')}
          </Text>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            bg="whatsapp.500"
            color="white"
            _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)' }}
            leftIcon={<FiMessageCircle />}
            fontWeight="700"
            transition="all 0.2s"
          >
            {t('cta.button')}
          </Button>
        </VStack>
      </SectionWrapper>
    </>
  );
}
