import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S34_FinancialProjection() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const milestonesRaw = t('financialProjection.milestones', { returnObjects: true });
  const milestones = (Array.isArray(milestonesRaw) ? milestonesRaw : []) as Array<{
    label: string;
    month: string;
    users: string;
    revenue: string;
    highlight?: boolean;
  }>;
  const summaryRaw = t('financialProjection.summary', { returnObjects: true });
  const summary = (Array.isArray(summaryRaw) ? summaryRaw : []) as Array<{
    period: string;
    users: string;
    revenue: string;
    result: string;
    margin: string;
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
            {t('financialProjection.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('financialProjection.headline')}{' '}
            <Text as="span" color="brand.400">{t('financialProjection.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Milestones */}
        <VStack spacing={2} w="full">
          {milestones.map((ms, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              w="full"
            >
              <Box
                bg={c.surfaceBg}
                px={{ base: 3, md: 4 }}
                py={{ base: 2, md: 3 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={ms.highlight ? 'brand.400' : c.surfaceBorder}
                position="relative"
                overflow="hidden"
              >
                {ms.highlight && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="4px"
                    h="full"
                    bg="brand.400"
                    borderRadius="full"
                  />
                )}
                <SimpleGrid columns={4} spacing={2} pl={ms.highlight ? 2 : 0} alignItems="center">
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="700"
                    color={ms.highlight ? 'brand.400' : c.textSecondary}
                  >
                    {ms.label}
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted} fontWeight="600">
                    {ms.month}
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary} fontWeight="600">
                    {ms.users}
                  </Text>
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {ms.revenue}
                  </Text>
                </SimpleGrid>
              </Box>
            </MotionBox>
          ))}
        </VStack>

        {/* Annual summary cards */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} w="full">
          {summary.map((s, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 4, md: 5 }}
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
                  h="2px"
                  bgGradient="linear(to-r, brand.500, whatsapp.400)"
                />
                <VStack spacing={3} align="flex-start" pt={1}>
                  <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="800" color="brand.400">
                    {s.period}
                  </Text>
                  <VStack spacing={1} align="flex-start" w="full">
                    <HStack spacing={2} w="full" justify="space-between">
                      <Text fontSize="xs" color={c.textMuted} fontWeight="600">
                        {t('financialProjection.usersLabel')}
                      </Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                        {s.users}
                      </Text>
                    </HStack>
                    <HStack spacing={2} w="full" justify="space-between">
                      <Text fontSize="xs" color={c.textMuted} fontWeight="600">
                        {t('financialProjection.revenueLabel')}
                      </Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                        {s.revenue}
                      </Text>
                    </HStack>
                    <HStack spacing={2} w="full" justify="space-between">
                      <Text fontSize="xs" color={c.textMuted} fontWeight="600">
                        {t('financialProjection.resultLabel')}
                      </Text>
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                        {s.result}
                      </Text>
                    </HStack>
                    <HStack spacing={2} w="full" justify="space-between">
                      <Text fontSize="xs" color={c.textMuted} fontWeight="600">
                        {t('financialProjection.marginLabel')}
                      </Text>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.300, whatsapp.400)"
                        bgClip="text"
                      >
                        {s.margin}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
