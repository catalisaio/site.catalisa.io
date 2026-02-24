import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Divider,
} from '@chakra-ui/react';
import { FiShield, FiLock, FiGlobe, FiUsers, FiKey, FiDatabase, FiServer, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { GradientText } from '../components/shared/GradientText';
import { MotionBox, fadeInUp } from '../components/motion';

const pillarIcons = [FiShield, FiLock, FiUsers, FiKey, FiDatabase, FiCheckCircle];

export function Security() {
  const { t } = useTranslation('security');
  const pillars = t('pillars', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    details: string[];
  }>;
  const infraItems = t('infrastructure.items', { returnObjects: true }) as string[];
  const complianceItems = t('compliance.items', { returnObjects: true }) as string[];

  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={4} textAlign="center" maxW="700px" mx="auto">
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
                <Icon as={FiShield} color="green.400" boxSize={4} />
                <Text color="whiteAlpha.800" fontSize="sm" fontWeight="600">
                  {t('hero.badge')}
                </Text>
              </HStack>
            </MotionBox>

            <MotionBox {...fadeInUp}>
              <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="800" color="white" lineHeight="1.1">
                {t('hero.heading')}{' '}
                <GradientText gradient="linear(to-r, green.300, green.400, brand.400)" fontSize="inherit" fontWeight="inherit">
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

      {/* Security Pillars */}
      <SectionWrapper>
        <VStack spacing={8} textAlign="center" mb={10}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('pillarsHeading')}
          </Heading>
        </VStack>

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
                _hover={{ borderColor: 'green.300', boxShadow: 'md' }}
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
        <VStack spacing={8} textAlign="center" mb={8}>
          <Heading as="h2" size="lg" fontWeight="800">
            {t('infrastructure.heading')}
          </Heading>
          <Text color="gray.500" maxW="600px" fontSize="md">
            {t('infrastructure.subtitle')}
          </Text>
        </VStack>

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
        <VStack spacing={8} textAlign="center" mb={8}>
          <Heading as="h2" size="lg" fontWeight="800">
            {t('compliance.heading')}
          </Heading>
        </VStack>

        <VStack spacing={3} maxW="600px" mx="auto">
          {complianceItems.map((item, i) => (
            <HStack key={i} spacing={3} p={4} bg="green.50" borderRadius="lg" w="full">
              <Icon as={FiCheckCircle} color="green.500" boxSize={5} />
              <Text fontSize="sm" color="gray.700" fontWeight="500">{item}</Text>
            </HStack>
          ))}
        </VStack>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center">
          <Heading as="h2" size="lg" fontWeight="700">
            {t('cta.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px" fontSize="md">
            {t('cta.subtitle')}
          </Text>
        </VStack>
      </SectionWrapper>
    </>
  );
}
