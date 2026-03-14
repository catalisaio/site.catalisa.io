import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S36_AcquisitionStrategy() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const funnelRaw = t('acquisitionStrategy.funnel', { returnObjects: true });
  const funnel = (Array.isArray(funnelRaw) ? funnelRaw : []) as Array<{
    stage: string;
    value: string;
  }>;
  const channelsRaw = t('acquisitionStrategy.channels', { returnObjects: true });
  const channels = (Array.isArray(channelsRaw) ? channelsRaw : []) as Array<{
    name: string;
    pct: string;
    budget: string;
    signups: string;
  }>;
  const organicRaw = t('acquisitionStrategy.organicChannels', { returnObjects: true });
  const organicChannels = (Array.isArray(organicRaw) ? organicRaw : []) as Array<{
    name: string;
    signups: string;
  }>;

  const funnelWidths = funnel.length > 0
    ? funnel.map((_, i) => `${Math.round(100 - (i / (funnel.length - 1)) * 70)}%`)
    : [];
  const funnelColors = ['brand.400', 'brand.500', 'whatsapp.400', 'catalisa.secondary'];
  const channelColors = ['brand.400', 'whatsapp.400', 'catalisa.secondary', 'brand.300'];

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
            {t('acquisitionStrategy.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('acquisitionStrategy.headline')}{' '}
            <Text as="span" color="brand.400">{t('acquisitionStrategy.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Funnel bars */}
        <VStack spacing={{ base: 2, md: 3 }} w="full" align="center">
          {funnel.map((f, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              w={funnelWidths[i]}
            >
              <Box
                bg={c.surfaceBg}
                px={{ base: 3, md: 4 }}
                py={{ base: 2, md: 3 }}
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
                  h="3px"
                  bg={funnelColors[i % funnelColors.length]}
                />
                <HStack justify="space-between" pt={1}>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                    {f.stage}
                  </Text>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {f.value}
                  </Text>
                </HStack>
              </Box>
            </MotionBox>
          ))}
        </VStack>

        {/* Budget channels with progress bars */}
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
              right={0}
              h="2px"
              bgGradient="linear(to-r, brand.500, whatsapp.400)"
            />
            <VStack spacing={3} pt={1}>
              {channels.map((ch, i) => (
                <VStack key={i} align="flex-start" spacing={1} w="full">
                  <HStack justify="space-between" w="full">
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                      {ch.name}
                    </Text>
                    <HStack spacing={3}>
                      <Text fontSize="xs" color={c.textMuted}>{ch.budget}</Text>
                      <Text fontSize="xs" fontWeight="700" color={c.textSecondary}>{ch.signups}</Text>
                    </HStack>
                  </HStack>
                  <Box w="full" h="6px" bg={c.progressBg} borderRadius="full">
                    <Box
                      h="full"
                      w={ch.pct}
                      bg={channelColors[i % channelColors.length]}
                      borderRadius="full"
                    />
                  </Box>
                </VStack>
              ))}
            </VStack>
          </Box>
        </MotionBox>

        {/* Organic channels + CAC highlight */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} w="full">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
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
                w="4px"
                h="full"
                bgGradient="linear(to-b, brand.400, whatsapp.400)"
                borderRadius="full"
              />
              <VStack align="flex-start" spacing={2} pl={2}>
                <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="800" color="whatsapp.400">
                  Organic
                </Text>
                {organicChannels.map((o, i) => (
                  <HStack key={i} spacing={2} w="full" justify="space-between">
                    <HStack spacing={2}>
                      <Box w={1.5} h={1.5} borderRadius="full" bg="whatsapp.400" />
                      <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>
                        {o.name}
                      </Text>
                    </HStack>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                      {o.signups}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
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
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="2px"
                bgGradient="linear(to-r, brand.500, whatsapp.400)"
              />
              <VStack spacing={1}>
                <Text
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="800"
                  bgGradient="linear(to-r, brand.300, whatsapp.400)"
                  bgClip="text"
                >
                  CAC
                </Text>
                <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} fontWeight="700" textAlign="center">
                  {t('acquisitionStrategy.cacHighlight')}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
