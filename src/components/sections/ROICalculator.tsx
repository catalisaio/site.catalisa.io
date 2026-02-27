import { useState, useMemo } from 'react';
import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { GradientText } from '../shared/GradientText';
import { AnimatedCounter } from '../shared/AnimatedCounter';

export function ROICalculator() {
  const { t } = useTranslation('home');

  const [attendants, setAttendants] = useState(5);
  const [responseTime, setResponseTime] = useState(2);
  const [monthlyCost, setMonthlyCost] = useState(15000);

  const projectedCost = useMemo(() => Math.max(800, Math.round(monthlyCost * 0.08)), [monthlyCost]);
  const savings = useMemo(() => monthlyCost - projectedCost, [monthlyCost, projectedCost]);

  return (
    <SectionWrapper bg="white" id="roi-calculator">
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
            &#10022; {t('roiCalculator.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('roiCalculator.heading')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('roiCalculator.headingGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="500px">
          {t('roiCalculator.subtitle')}
        </Text>
        <Text color="brand.500" fontSize="sm" fontWeight="600" maxW="500px">
          {t('roiCalculator.benchmark')}
        </Text>
      </VStack>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={8}
        maxW="900px"
        mx="auto"
      >
        {/* Left: TODAY */}
        <Box flex={1} p={6} borderRadius="2xl" bg="gray.50" border="1px solid" borderColor="gray.200">
          <Text fontSize="sm" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={6}>
            {t('roiCalculator.today')}
          </Text>

          <VStack spacing={6} align="stretch">
            {/* Attendants */}
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">{t('roiCalculator.attendants')}</Text>
                <Text fontSize="sm" fontWeight="700" color="gray.900">{attendants}</Text>
              </Flex>
              <Slider
                value={attendants}
                onChange={setAttendants}
                min={1}
                max={20}
                step={1}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="red.400" />
                </SliderTrack>
                <SliderThumb boxSize={5} />
              </Slider>
            </Box>

            {/* Response time */}
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">{t('roiCalculator.responseTime')}</Text>
                <Text fontSize="sm" fontWeight="700" color="gray.900">{responseTime} {t('roiCalculator.hours')}</Text>
              </Flex>
              <Slider
                value={responseTime}
                onChange={setResponseTime}
                min={0.5}
                max={8}
                step={0.5}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="red.400" />
                </SliderTrack>
                <SliderThumb boxSize={5} />
              </Slider>
            </Box>

            {/* Monthly cost */}
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">{t('roiCalculator.monthlyCost')}</Text>
                <Text fontSize="sm" fontWeight="700" color="gray.900">R$ {monthlyCost.toLocaleString('pt-BR')}</Text>
              </Flex>
              <Slider
                value={monthlyCost}
                onChange={setMonthlyCost}
                min={3000}
                max={100000}
                step={1000}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="red.400" />
                </SliderTrack>
                <SliderThumb boxSize={5} />
              </Slider>
            </Box>
          </VStack>
        </Box>

        {/* Right: WITH CATALISA */}
        <Box flex={1} p={6} borderRadius="2xl" bg="brand.50" border="2px solid" borderColor="brand.200">
          <Text fontSize="sm" fontWeight="700" color="brand.600" textTransform="uppercase" letterSpacing="wider" mb={6}>
            {t('roiCalculator.withCatalisa')}
          </Text>

          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" p={4} borderRadius="xl" bg="white">
              <Text fontSize="sm" fontWeight="600" color="gray.700">{t('roiCalculator.attendants')}</Text>
              <Text fontSize="sm" fontWeight="700" color="brand.600">{t('roiCalculator.aiAgent')}</Text>
            </Flex>

            <Flex justify="space-between" p={4} borderRadius="xl" bg="white">
              <Text fontSize="sm" fontWeight="600" color="gray.700">{t('roiCalculator.responseTime')}</Text>
              <Text fontSize="sm" fontWeight="700" color="brand.600">5 {t('roiCalculator.seconds')}</Text>
            </Flex>

            <Flex justify="space-between" p={4} borderRadius="xl" bg="white">
              <Text fontSize="sm" fontWeight="600" color="gray.700">{t('roiCalculator.monthlyCost')}</Text>
              <Text fontSize="sm" fontWeight="700" color="brand.600">R$ {projectedCost.toLocaleString('pt-BR')}</Text>
            </Flex>
          </VStack>
        </Box>
      </Flex>

      {/* Savings bar */}
      <Box
        mt={8}
        p={6}
        borderRadius="2xl"
        bgGradient="linear(to-r, brand.500, brand.400)"
        maxW="900px"
        mx="auto"
        textAlign="center"
      >
        <Text color="whiteAlpha.800" fontSize="sm" fontWeight="600" mb={1}>
          {t('roiCalculator.estimatedSavings')}
        </Text>
        <HStack justify="center" spacing={1}>
          <Text color="white" fontSize="3xl" fontWeight="800">R$ </Text>
          <AnimatedCounter
            target={savings}
            color="white"
            fontSize="3xl"
            fontWeight="800"
          />
          <Text color="whiteAlpha.800" fontSize="lg" fontWeight="600">
            {t('roiCalculator.perMonth')}
          </Text>
        </HStack>
      </Box>
      {/* Benchmark note */}
      <Text
        mt={4}
        color="gray.400"
        fontSize="xs"
        textAlign="center"
        maxW="900px"
        mx="auto"
      >
        {t('roiCalculator.benchmarkNote')}
      </Text>
    </SectionWrapper>
  );
}
