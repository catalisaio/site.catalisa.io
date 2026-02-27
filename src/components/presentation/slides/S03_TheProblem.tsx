import { Heading, Text, SimpleGrid, VStack, HStack, Box, Icon } from '@chakra-ui/react';
import { FiClock, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const icons = [FiClock, FiUsers, FiAlertTriangle];

export function S03_TheProblem() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const painPoints = t('theProblem.painPoints', { returnObjects: true }) as Array<{ title: string; description: string }>;
  const metrics = t('theProblem.metrics', { returnObjects: true }) as Array<{ value: string; label: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 10 }} w="full">
        <VStack spacing={3} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.2">
              {t('theProblem.headline')}{' '}
              <Text as="span" color="brand.400">{t('theProblem.headlineHighlight')}</Text>
            </Heading>
          </MotionBox>
        </VStack>

        {/* Pain point cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="full">
          {painPoints.map((point, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 5, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <Box p={2.5} borderRadius="lg" bg={c.problemIconBg} opacity={0.8}>
                    <Icon as={icons[i]} boxSize={5} color={c.problemAccent} />
                  </Box>
                  <Heading as="h3" fontSize={{ base: 'md', md: 'lg' }} fontWeight="700">
                    {point.title}
                  </Heading>
                  <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7">
                    {point.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Metrics bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          w="full"
        >
          <Box
            bgGradient="linear(to-r, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.05))"
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.problemBorder}
          >
            <Text fontSize="xs" color={c.problemAccent} fontWeight="600" letterSpacing="0.1em" mb={3}>
              {t('theProblem.metricsLabel')}
            </Text>
            <HStack justify="space-around" flexWrap="wrap" gap={4}>
              {metrics.map((m, i) => (
                <VStack key={i} spacing={1}>
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={c.problemAccent}>{m.value}</Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted}>{m.label}</Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
