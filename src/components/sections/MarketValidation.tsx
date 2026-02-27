import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { GradientText } from '../shared/GradientText';
import { MotionBox, staggerContainer, staggerItem } from '../motion';

interface StatCard {
  value: string;
  label: string;
  source: string;
}

export function MarketValidation() {
  const { t } = useTranslation('home');
  const stats = t('marketValidation.stats', { returnObjects: true }) as StatCard[];

  return (
    <SectionWrapper bg="gray.900" id="market-validation">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="whiteAlpha.100"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="whiteAlpha.200"
          spacing={2}
        >
          <Text color="brand.300" fontSize="sm" fontWeight="600">
            &#10022; {t('marketValidation.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="white"
          lineHeight="1.2"
        >
          {t('marketValidation.heading')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('marketValidation.headingGradient')}
          </GradientText>
        </Heading>

        <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
          {t('marketValidation.subtitle')}
        </Text>
      </VStack>

      <MotionBox {...staggerContainer}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3 }}
          spacing={4}
          maxW="900px"
          mx="auto"
        >
          {stats.map((stat) => (
            <MotionBox key={stat.value} {...staggerItem}>
              <Box
                p={6}
                borderRadius="2xl"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                transition="all 0.3s"
                _hover={{
                  bg: 'whiteAlpha.100',
                  borderColor: 'brand.400',
                  transform: 'translateY(-2px)',
                }}
              >
                <VStack align="flex-start" spacing={2}>
                  <Text
                    fontSize="3xl"
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                    bgClip="text"
                  >
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.800" lineHeight="1.5">
                    {stat.label}
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.400" fontWeight="600">
                    {stat.source}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </MotionBox>

      {/* Disclaimer */}
      <Text
        mt={8}
        color="whiteAlpha.300"
        fontSize="xs"
        textAlign="center"
      >
        {t('marketValidation.disclaimer')}
      </Text>
    </SectionWrapper>
  );
}
