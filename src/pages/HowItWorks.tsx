import {
  Box, Container, Heading, Text, VStack, HStack, Icon, SimpleGrid, Button,
} from '@chakra-ui/react';
import { FiMessageCircle, FiZap, FiCpu, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { GradientText } from '../components/shared/GradientText';
import { MotionBox, fadeInUp } from '../components/motion';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

const stepIcons = [FiMessageCircle, FiCpu, FiTrendingUp];

export function HowItWorks() {
  const { t } = useTranslation('how-it-works');
  const lp = useLocalizedPath();
  const steps = t('steps', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    detail: string;
  }>;
  const benefits = t('benefits', { returnObjects: true }) as string[];

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
                <Icon as={FiZap} color="catalisa.secondary" boxSize={4} />
                <Text color="whiteAlpha.800" fontSize="sm" fontWeight="600">{t('hero.badge')}</Text>
              </HStack>
            </MotionBox>

            <MotionBox {...fadeInUp}>
              <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="800" color="white" lineHeight="1.1">
                {t('hero.heading')}{' '}
                <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent)" fontSize="inherit" fontWeight="inherit">
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

      {/* Steps */}
      <SectionWrapper>
        <VStack spacing={8} textAlign="center" mb={10}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('stepsHeading')}
          </Heading>
        </VStack>

        <VStack spacing={8} maxW="800px" mx="auto">
          {steps.map((step, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              w="full"
            >
              <HStack
                spacing={6}
                p={6}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: 'brand.400', boxShadow: 'md' }}
                transition="all 0.2s"
                align="flex-start"
              >
                <VStack spacing={0} flexShrink={0}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="xl"
                    bg="brand.50"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={stepIcons[i] || FiZap} boxSize={6} color="brand.500" />
                  </Box>
                  <Text fontSize="xs" fontWeight="800" color="brand.500" mt={1}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={2} flex={1}>
                  <Heading as="h3" size="sm" fontWeight="700">
                    {step.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">
                    {step.description}
                  </Text>
                  <Text color="gray.400" fontSize="xs" fontStyle="italic">
                    {step.detail}
                  </Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </VStack>
      </SectionWrapper>

      {/* Benefits */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={8} textAlign="center" mb={8}>
          <Heading as="h2" size="lg" fontWeight="800">
            {t('benefitsHeading')}
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="700px" mx="auto">
          {benefits.map((benefit, i) => (
            <HStack key={i} spacing={3} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Icon as={FiZap} color="catalisa.accent" boxSize={4} />
              <Text fontSize="sm" color="gray.700">{benefit}</Text>
            </HStack>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper>
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="lg" fontWeight="700">
            {t('cta.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px" fontSize="md">
            {t('cta.subtitle')}
          </Text>
          <HStack spacing={4}>
            <Button
              as={Link}
              to={lp('/contato')}
              size="lg"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
              fontWeight="700"
              transition="all 0.2s"
            >
              {t('cta.primary')}
            </Button>
            <Button
              as={Link}
              to={lp('/building-blocks')}
              size="lg"
              variant="outline"
              borderColor="brand.500"
              color="brand.500"
              _hover={{ bg: 'brand.50' }}
              rightIcon={<FiArrowRight />}
              fontWeight="600"
            >
              {t('cta.secondary')}
            </Button>
          </HStack>
        </VStack>
      </SectionWrapper>
    </>
  );
}
