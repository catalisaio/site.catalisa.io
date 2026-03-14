import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S37_GrowthTargets() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const monthsRaw = t('growthTargets.months', { returnObjects: true });
  const months = (Array.isArray(monthsRaw) ? monthsRaw : []) as Array<{
    month: string;
    signups: string;
    newPaid: string;
    totalPaid: string;
    mrr: string;
    focus: string;
  }>;
  const adjRaw = t('growthTargets.adjustedTargets', { returnObjects: true });
  const adjustedTargets = (Array.isArray(adjRaw) ? adjRaw : []) as Array<{
    label: string;
    value: string;
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
            {t('growthTargets.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('growthTargets.headline')}{' '}
            <Text as="span" color="brand.400">{t('growthTargets.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Monthly cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 4 }} w="full">
          {months.map((m, i) => (
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
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="3px"
                  bgGradient="linear(to-r, brand.500, whatsapp.400)"
                />
                <VStack spacing={2} align="flex-start" pt={1}>
                  <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="brand.400">
                    {m.month}
                  </Text>
                  <VStack spacing={1} align="flex-start" w="full">
                    <HStack justify="space-between" w="full">
                      <Text color={c.textMuted} fontSize="xs">Signups</Text>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.300, whatsapp.400)"
                        bgClip="text"
                      >
                        {m.signups}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color={c.textMuted} fontSize="xs">New Paid</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                        {m.newPaid}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color={c.textMuted} fontSize="xs">Total Paid</Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                        {m.totalPaid}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text color={c.textMuted} fontSize="xs">MRR</Text>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.300, whatsapp.400)"
                        bgClip="text"
                      >
                        {m.mrr}
                      </Text>
                    </HStack>
                  </VStack>
                  <Text color={c.textSubtle} fontSize="xs" fontStyle="italic">
                    {m.focus}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Realistic scenario warning */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          w="full"
        >
          <Box
            bg={c.surfaceBg}
            p={{ base: 4, md: 5 }}
            borderRadius="xl"
            border="1px solid"
            borderColor="orange.400"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              w="4px"
              h="full"
              bg="orange.400"
              borderRadius="full"
            />
            <VStack align="flex-start" spacing={1} pl={2}>
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color="orange.400">
                {t('growthTargets.realisticScenario')}
              </Text>
              <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.5">
                {t('growthTargets.realisticDetail')}
              </Text>
            </VStack>
          </Box>
        </MotionBox>

        {/* Adjusted targets + key factor */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          w="full"
        >
          <VStack spacing={3} w="full">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} w="full">
              {adjustedTargets.map((at, i) => (
                <Box
                  key={i}
                  bg={c.surfaceBg}
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={c.surfaceBorder}
                  textAlign="center"
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
                  <VStack spacing={1} pt={1}>
                    <Text
                      fontSize={{ base: 'xl', md: '2xl' }}
                      fontWeight="800"
                      bgGradient="linear(to-r, brand.300, whatsapp.400)"
                      bgClip="text"
                    >
                      {at.value}
                    </Text>
                    <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600">
                      {at.label}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            <Text color={c.textGhost} fontSize="xs" fontStyle="italic" textAlign="center">
              {t('growthTargets.keyFactor')}
            </Text>
          </VStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
