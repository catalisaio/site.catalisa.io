import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { MotionBox, staggerContainer, staggerItem } from '../../motion';

interface ComparisonRow {
  pattern: string;
  catalisa: string;
}

interface Example {
  company: string;
  achievement: string;
}

export function ComposablePathSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const compRaw = t('composablePath.comparison', { returnObjects: true });
  const comparison = (Array.isArray(compRaw) ? compRaw : []) as ComparisonRow[];
  const exRaw = t('composablePath.examples', { returnObjects: true });
  const examples = (Array.isArray(exRaw) ? exRaw : []) as Example[];
  const gsRaw = t('composablePath.gartnerStats', { returnObjects: true });
  const gartnerStats = (Array.isArray(gsRaw) ? gsRaw : []) as string[];

  return (
    <SectionWrapper bg="gray.50" id="composable-path">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="white"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="gray.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('composablePath.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
          maxW="700px"
        >
          {t('composablePath.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('composablePath.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="700px">
          {t('composablePath.subtitle')}
        </Text>
      </VStack>

      {/* Market examples */}
      <MotionBox {...staggerContainer}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} maxW="800px" mx="auto" mb={10}>
          {examples.map((ex) => (
            <MotionBox key={ex.company} {...staggerItem}>
              <Box
                p={5}
                borderRadius="xl"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                h="full"
              >
                <VStack align="flex-start" spacing={2}>
                  <Icon as={FiTrendingUp} boxSize={5} color="brand.500" />
                  <Text fontWeight="700" fontSize="sm" color="gray.800">
                    {ex.company}
                  </Text>
                  <Text fontSize="xs" color="gray.500" lineHeight="1.5">
                    {ex.achievement}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </MotionBox>

      {/* Comparison table */}
      <Box maxW="700px" mx="auto" mb={8}>
        {/* Header */}
        <Flex
          py={3}
          px={4}
          bg="gray.100"
          borderTopRadius="xl"
          fontWeight="700"
          fontSize="sm"
          color="gray.600"
        >
          <Text flex={1}>{t('composablePath.patternLabel')}</Text>
          <Text flex={1}>{t('composablePath.catalisaLabel')}</Text>
        </Flex>

        {/* Rows */}
        {comparison.map((row, i) => (
          <Flex
            key={row.pattern}
            py={3}
            px={4}
            bg={i % 2 === 0 ? 'white' : 'gray.50'}
            borderBottom="1px solid"
            borderColor="gray.100"
            fontSize="sm"
            _last={{ borderBottomRadius: 'xl' }}
          >
            <Text flex={1} color="gray.500">{row.pattern}</Text>
            <Text flex={1} color="brand.600" fontWeight="600">{row.catalisa}</Text>
          </Flex>
        ))}
      </Box>

      {/* Gartner stats */}
      <VStack spacing={3} maxW="700px" mx="auto" mb={6}>
        {gartnerStats.map((stat) => (
          <HStack
            key={stat}
            p={4}
            borderRadius="xl"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            w="full"
            spacing={3}
          >
            <Icon as={FiCheck} boxSize={4} color="brand.500" flexShrink={0} />
            <Text fontSize="sm" color="gray.700">
              {stat}
            </Text>
          </HStack>
        ))}
      </VStack>

      {/* Disclaimer */}
      <Text fontSize="2xs" color="gray.400" textAlign="center" maxW="700px" mx="auto">
        {t('composablePath.disclaimer')}
      </Text>
    </SectionWrapper>
  );
}
