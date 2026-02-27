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

interface StatCard {
  value: string;
  label: string;
  source: string;
}

export function MarketValidationSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const stats = t('marketValidation.stats', { returnObjects: true }) as StatCard[];

  return (
    <SectionWrapper bg="white" id="market-validation">
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
            &#10022; {t('marketValidation.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('marketValidation.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('marketValidation.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="700px">
          {t('marketValidation.subtitle')}
        </Text>
      </VStack>

      <MotionBox {...staggerContainer}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4} maxW="1000px" mx="auto">
          {stats.map((stat) => (
            <MotionBox key={stat.value} {...staggerItem}>
              <Box
                p={6}
                borderRadius="2xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  borderColor: 'brand.300',
                }}
              >
                <VStack align="flex-start" spacing={2}>
                  <Text
                    fontSize="3xl"
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.400, brand.500)"
                    bgClip="text"
                  >
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.5">
                    {stat.label}
                  </Text>
                  <Text fontSize="xs" color="gray.400" fontWeight="600">
                    {stat.source}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </MotionBox>

      <Text mt={8} color="gray.400" fontSize="xs" textAlign="center">
        {t('marketValidation.disclaimer')}
      </Text>
    </SectionWrapper>
  );
}
