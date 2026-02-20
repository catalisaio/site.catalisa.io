import { Heading, Text, VStack, Box, SimpleGrid, Icon, HStack } from '@chakra-ui/react';
import { FiSmartphone, FiLayout, FiZap } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

export function HowItWorks() {
  const { t } = useTranslation('home');

  const steps = [
    {
      icon: FiSmartphone,
      number: '01',
      title: t('howItWorks.steps.0.title'),
      description: t('howItWorks.steps.0.description'),
      color: 'whatsapp.500',
    },
    {
      icon: FiLayout,
      number: '02',
      title: t('howItWorks.steps.1.title'),
      description: t('howItWorks.steps.1.description'),
      color: 'brand.500',
    },
    {
      icon: FiZap,
      number: '03',
      title: t('howItWorks.steps.2.title'),
      description: t('howItWorks.steps.2.description'),
      color: 'catalisa.accent',
    },
  ];
  return (
    <SectionWrapper id="how-it-works">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          {t('howItWorks.heading')}
        </Heading>
        <Text color="gray.500" maxW="500px" fontSize="lg">
          {t('howItWorks.subtitle')}
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {steps.map((step, i) => (
          <MotionBox
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            <VStack align="flex-start" spacing={5} position="relative">
              <HStack spacing={4}>
                <Box
                  p={4}
                  borderRadius="xl"
                  bg="white"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Icon as={step.icon} boxSize={7} color={step.color} />
                </Box>
                <Text fontSize="5xl" fontWeight="900" color="gray.100" lineHeight={1}>
                  {step.number}
                </Text>
              </HStack>
              <Heading as="h3" size="md" fontWeight="700">
                {step.title}
              </Heading>
              <Text color="gray.500" lineHeight="1.7">
                {step.description}
              </Text>

              {/* Connector line (not on last) */}
              {i < 2 && (
                <Box
                  display={{ base: 'none', md: 'block' }}
                  position="absolute"
                  top="28px"
                  right="-16px"
                  w="32px"
                  h="2px"
                  bg="gray.200"
                />
              )}
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
