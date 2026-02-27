import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';

export function ROISection() {
  const { t } = useTranslation('ai-agents-whatsapp');

  const labels = t('roi.labels', { returnObjects: true }) as Record<string, string>;
  const traditional = t('roi.traditional', { returnObjects: true }) as Record<string, string>;
  const withAI = t('roi.withAI', { returnObjects: true }) as Record<string, string>;

  const rows = ['cost', 'responseTime', 'resolution', 'nps', 'team'];

  return (
    <SectionWrapper bg="gray.900" id="roi">
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
            &#10022; {t('roi.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="white"
          lineHeight="1.2"
        >
          {t('roi.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('roi.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
          {t('roi.subtitle')}
        </Text>
      </VStack>

      <Box maxW="800px" mx="auto">
        {/* Header row */}
        <Flex
          py={4}
          px={4}
          borderTopRadius="xl"
          bg="whiteAlpha.100"
        >
          <Text flex={1} fontSize="sm" fontWeight="700" color="whiteAlpha.500" />
          <Text flex={1} fontSize="sm" fontWeight="700" color="red.300" textAlign="center">
            {traditional.label}
          </Text>
          <Box w="30px" />
          <Text flex={1} fontSize="sm" fontWeight="700" color="whatsapp.300" textAlign="center">
            {withAI.label}
          </Text>
        </Flex>

        {/* Data rows */}
        {rows.map((key, i) => (
          <Flex
            key={key}
            py={4}
            px={4}
            bg={i % 2 === 0 ? 'whiteAlpha.50' : 'transparent'}
            _last={{ borderBottomRadius: 'xl' }}
            align="center"
          >
            <Text flex={1} fontSize="sm" fontWeight="600" color="whiteAlpha.700">
              {labels[key]}
            </Text>
            <Text flex={1} fontSize="sm" color="red.300" textAlign="center">
              {traditional[key]}
            </Text>
            <Box w="30px" textAlign="center">
              <Icon as={FiArrowRight} boxSize={3} color="whiteAlpha.400" />
            </Box>
            <Text flex={1} fontSize="sm" fontWeight="700" color="whatsapp.300" textAlign="center">
              {withAI[key]}
            </Text>
          </Flex>
        ))}
      </Box>
    </SectionWrapper>
  );
}
