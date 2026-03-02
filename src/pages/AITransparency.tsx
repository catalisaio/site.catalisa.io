import {
  Box, Heading, Text, VStack, SimpleGrid, HStack, Icon, List, ListItem, ListIcon, Link as ChakraLink,
} from '@chakra-ui/react';
import { FiCpu, FiShield, FiEye, FiUsers, FiCheckCircle, FiLock, FiAlertTriangle, FiSliders, FiMail } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { MotionBox } from '../components/motion';

const systemIcons = [FiCpu, FiUsers, FiSliders];
const dataIcons = [FiShield, FiLock, FiAlertTriangle, FiLock];
const oversightIcons = [FiAlertTriangle, FiSliders, FiShield, FiEye];

export function AITransparency() {
  const { t } = useTranslation('ai-transparency');
  const { t: tc } = useTranslation('common');

  const systems = t('systems.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    provider: string;
    features: string[];
  }>;

  const dataItems = t('dataProtection.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const oversightItems = t('humanOversight.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  const userRights = t('userRights.items', { returnObjects: true }) as string[];
  const isoItems = t('iso42001.items', { returnObjects: true }) as string[];

  return (
    <>
      <PageHero
        heroId="hero_ai_transparency"
        badge={t('hero.badge')}
        badgeIcon={FiEye}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor="blue"
        gradient="linear(to-r, blue.300, purple.400, brand.400)"
        primaryCTA={{ label: tc('cta.letsChat') }}
      />

      {/* AI Systems */}
      <SectionWrapper>
        <SectionHeader heading={t('systems.heading')} />
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {systems.map((system, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <VStack
                align="flex-start"
                spacing={4}
                p={6}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: 'blue.300', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
                h="full"
              >
                <Box p={3} borderRadius="lg" bg="blue.50">
                  <Icon as={systemIcons[i] || FiCpu} boxSize={6} color="blue.500" />
                </Box>
                <Heading as="h3" size="sm" fontWeight="700">{system.title}</Heading>
                <Text color="gray.600" fontSize="sm" lineHeight="tall">{system.description}</Text>
                <Text color="gray.400" fontSize="xs">Provider: {system.provider}</Text>
                <VStack align="flex-start" spacing={2} mt="auto">
                  {system.features.map((feat, j) => (
                    <HStack key={j} spacing={2}>
                      <Icon as={FiCheckCircle} color="blue.400" boxSize={3.5} flexShrink={0} />
                      <Text color="gray.500" fontSize="xs">{feat}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Data Protection */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('dataProtection.heading')} subtitle={t('dataProtection.subtitle')} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {dataItems.map((item, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <HStack align="flex-start" spacing={4} p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Box p={3} borderRadius="lg" bg="green.50" flexShrink={0}>
                  <Icon as={dataIcons[i] || FiShield} boxSize={5} color="green.500" />
                </Box>
                <VStack align="flex-start" spacing={1}>
                  <Heading as="h4" size="xs" fontWeight="700">{item.title}</Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">{item.description}</Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Human Oversight */}
      <SectionWrapper>
        <SectionHeader heading={t('humanOversight.heading')} subtitle={t('humanOversight.subtitle')} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {oversightItems.map((item, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <HStack align="flex-start" spacing={4} p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Box p={3} borderRadius="lg" bg="purple.50" flexShrink={0}>
                  <Icon as={oversightIcons[i] || FiShield} boxSize={5} color="purple.500" />
                </Box>
                <VStack align="flex-start" spacing={1}>
                  <Heading as="h4" size="xs" fontWeight="700">{item.title}</Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">{item.description}</Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* User Rights */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('userRights.heading')} subtitle={t('userRights.subtitle')} />
        <Box maxW="700px" mx="auto">
          <List spacing={3}>
            {userRights.map((right, i) => (
              <ListItem key={i} fontSize="sm" color="gray.700">
                <ListIcon as={FiCheckCircle} color="green.500" />
                {right}
              </ListItem>
            ))}
          </List>
        </Box>
      </SectionWrapper>

      {/* ISO 42001 Alignment */}
      <SectionWrapper>
        <SectionHeader heading={t('iso42001.heading')} />
        <VStack spacing={6} maxW="800px" mx="auto">
          <Text color="gray.600" fontSize="sm" lineHeight="tall" textAlign="center">
            {t('iso42001.description')}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="full">
            {isoItems.map((item, i) => (
              <HStack key={i} spacing={2} align="flex-start">
                <Icon as={FiCheckCircle} color="blue.400" boxSize={4} mt={0.5} flexShrink={0} />
                <Text color="gray.600" fontSize="sm">{item}</Text>
              </HStack>
            ))}
          </SimpleGrid>
          <Box bg="orange.50" p={4} borderRadius="lg" border="1px solid" borderColor="orange.200" w="full">
            <Text color="orange.700" fontSize="xs" fontStyle="italic">
              {t('iso42001.disclaimer')}
            </Text>
          </Box>
        </VStack>
      </SectionWrapper>

      {/* Contact */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('contact.heading')} subtitle={t('contact.subtitle')} />
        <VStack spacing={4} maxW="500px" mx="auto">
          <HStack spacing={3} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" w="full" justify="center">
            <Icon as={FiMail} color="blue.500" boxSize={5} />
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="xs" color="gray.500">{t('contact.emailLabel')}</Text>
              <ChakraLink href="mailto:compliance@catalisa.io" color="blue.600" fontWeight="600" fontSize="sm">
                {t('contact.email')}
              </ChakraLink>
            </VStack>
          </HStack>
        </VStack>
      </SectionWrapper>

      <PageCTA
        heading={t('cta.heading')}
        headingGradient={t('cta.headingGradient')}
        subtitle={t('cta.subtitle')}
        gradient="linear(to-r, blue.300, purple.400, brand.400)"
      />
    </>
  );
}
