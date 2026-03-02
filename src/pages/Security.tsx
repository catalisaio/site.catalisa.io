import {
  Box, Heading, Text, VStack, SimpleGrid, HStack, Icon,
} from '@chakra-ui/react';
import { FiShield, FiLock, FiUsers, FiKey, FiDatabase, FiServer, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { MotionBox } from '../components/motion';

const pillarIcons = [FiShield, FiLock, FiUsers, FiKey, FiDatabase, FiCheckCircle];

export function Security() {
  const { t } = useTranslation('security');
  const { t: tc } = useTranslation('common');
  const pillars = t('pillars', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  const infraItems = t('infrastructure.items', { returnObjects: true }) as string[];
  const complianceItems = t('compliance.items', { returnObjects: true }) as string[];

  return (
    <>
      <PageHero
        heroId="hero_security"
        badge={t('hero.badge')}
        badgeIcon={FiShield}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor="green"
        gradient="linear(to-r, green.300, green.400, brand.400)"
        primaryCTA={{ label: tc('cta.letsChat') }}
      />

      {/* Security Pillars */}
      <SectionWrapper>
        <SectionHeader heading={t('pillarsHeading')} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {pillars.map((pillar, i) => (
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
                _hover={{ borderColor: 'green.300', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
                h="full"
              >
                <Box p={3} borderRadius="lg" bg="green.50">
                  <Icon as={pillarIcons[i] || FiShield} boxSize={6} color="green.500" />
                </Box>
                <Heading as="h3" size="sm" fontWeight="700">
                  {pillar.title}
                </Heading>
                <Text color="gray.600" fontSize="sm" lineHeight="tall">
                  {pillar.description}
                </Text>
                <VStack align="flex-start" spacing={2} mt="auto">
                  {pillar.details.map((detail, j) => (
                    <HStack key={j} spacing={2}>
                      <Icon as={FiCheckCircle} color="green.400" boxSize={3.5} flexShrink={0} />
                      <Text color="gray.500" fontSize="xs">{detail}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Infrastructure */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          heading={t('infrastructure.heading')}
          subtitle={t('infrastructure.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="700px" mx="auto">
          {infraItems.map((item, i) => (
            <HStack key={i} spacing={3} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Icon as={FiServer} color="brand.500" boxSize={4} />
              <Text fontSize="sm" color="gray.700">{item}</Text>
            </HStack>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Compliance */}
      <SectionWrapper>
        <SectionHeader heading={t('compliance.heading')} />

        <VStack spacing={3} maxW="600px" mx="auto">
          {complianceItems.map((item, i) => (
            <HStack key={i} spacing={3} p={4} bg="green.50" borderRadius="lg" w="full">
              <Icon as={FiCheckCircle} color="green.500" boxSize={5} />
              <Text fontSize="sm" color="gray.700" fontWeight="500">{item}</Text>
            </HStack>
          ))}
        </VStack>
      </SectionWrapper>

      <PageCTA
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat'), icon: FiShield }}
      />
    </>
  );
}
