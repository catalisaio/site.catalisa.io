import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { MotionBox, staggerContainer, staggerItem } from '../../motion';

interface StepData {
  number: string;
  title: string;
  description: string;
}

const stepColors = ['whatsapp.400', 'brand.400', 'blue.400', 'orange.400'];

export function HowToStartSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const stepsRaw = t('howToStart.steps', { returnObjects: true });
  const steps = (Array.isArray(stepsRaw) ? stepsRaw : []) as StepData[];

  return (
    <SectionWrapper bg="white" id="how-to-start">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="brand.50"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="brand.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('howToStart.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('howToStart.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('howToStart.headlineGradient')}
          </GradientText>
        </Heading>
      </VStack>

      <MotionBox {...staggerContainer}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} maxW="1000px" mx="auto">
          {steps.map((step, i) => (
            <MotionBox key={step.number} {...staggerItem}>
              <Box
                p={6}
                borderRadius="2xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                  borderColor: stepColors[i],
                }}
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <Text
                    fontSize="2xl"
                    fontWeight="800"
                    color={stepColors[i]}
                  >
                    {step.number}
                  </Text>
                  <Text fontSize="md" fontWeight="700" color="gray.800">
                    {step.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500" lineHeight="1.6">
                    {step.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </MotionBox>
    </SectionWrapper>
  );
}
