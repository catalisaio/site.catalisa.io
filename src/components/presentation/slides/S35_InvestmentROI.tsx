import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S35_InvestmentROI() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const metricsRaw = t('investmentROI.metrics', { returnObjects: true });
  const metrics = (Array.isArray(metricsRaw) ? metricsRaw : []) as Array<{
    label: string;
    value: string;
  }>;
  const bulletsRaw = t('investmentROI.thesisBullets', { returnObjects: true });
  const thesisBullets = (Array.isArray(bulletsRaw) ? bulletsRaw : []) as string[];
  const projRaw = t('investmentROI.projection', { returnObjects: true });
  const projection = (Array.isArray(projRaw) ? projRaw : []) as Array<{
    period: string;
    revenue: string;
    result: string;
    users: string;
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 8 }} w="full">
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="brand.400"
          >
            {t('investmentROI.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('investmentROI.headline')}{' '}
            <Text as="span" color="brand.400">{t('investmentROI.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Metric cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 4 }} w="full">
          {metrics.map((m, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 3, md: 4 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
                position="relative"
                overflow="hidden"
                textAlign="center"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="2px"
                  bgGradient="linear(to-r, brand.500, whatsapp.400)"
                />
                <VStack spacing={1} pt={1}>
                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {m.value}
                  </Text>
                  <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600">
                    {m.label}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Thesis */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          w="full"
        >
          <Box
            bg={c.surfaceBg}
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.surfaceBorder}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              w="4px"
              h="full"
              bgGradient="linear(to-b, brand.400, whatsapp.400)"
              borderRadius="full"
            />
            <VStack align="flex-start" spacing={3} pl={2}>
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="brand.400">
                {t('investmentROI.thesisLabel')}
              </Text>
              <VStack align="flex-start" spacing={2}>
                {thesisBullets.map((bullet, i) => (
                  <HStack key={i} spacing={3} align="flex-start">
                    <Box
                      w={{ base: 5, md: 6 }}
                      h={{ base: 5, md: 6 }}
                      borderRadius="full"
                      bg="brand.400"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text fontSize="xs" fontWeight="800" color="white">
                        {i + 1}
                      </Text>
                    </Box>
                    <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.5" pt={0.5}>
                      {bullet}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>
        </MotionBox>

        {/* Return projection */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          w="full"
        >
          <VStack align="flex-start" spacing={3} w="full">
            <HStack spacing={2}>
              <Box w={2} h={2} borderRadius="full" bg="brand.400" />
              <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.1em" color={c.textMuted}>
                {t('investmentROI.projectionLabel')}
              </Text>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} w="full">
              {projection.map((p, i) => (
                <Box
                  key={i}
                  bg={c.surfaceBg}
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={c.surfaceBorder}
                  position="relative"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="2px"
                    bgGradient="linear(to-r, brand.500, whatsapp.400)"
                  />
                  <VStack spacing={2} align="flex-start" pt={1}>
                    <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="brand.400">
                      {p.period}
                    </Text>
                    <HStack spacing={4} flexWrap="wrap">
                      <VStack spacing={0} align="flex-start">
                        <Text
                          fontSize={{ base: 'lg', md: 'xl' }}
                          fontWeight="800"
                          bgGradient="linear(to-r, brand.300, whatsapp.400)"
                          bgClip="text"
                        >
                          {p.revenue}
                        </Text>
                        <Text color={c.textSubtle} fontSize="xs">revenue</Text>
                      </VStack>
                      <VStack spacing={0} align="flex-start">
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="700" color={c.textSecondary}>
                          {p.result}
                        </Text>
                        <Text color={c.textSubtle} fontSize="xs">result</Text>
                      </VStack>
                      <VStack spacing={0} align="flex-start">
                        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="700" color={c.textSecondary}>
                          {p.users}
                        </Text>
                        <Text color={c.textSubtle} fontSize="xs">users</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
