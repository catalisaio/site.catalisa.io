import { Heading, Text, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S26_TAMSizingFunnel() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const tiersRaw = t('tamSizingFunnel.tiers', { returnObjects: true });
  const tiers = (Array.isArray(tiersRaw) ? tiersRaw : []) as Array<{
    label: string;
    value: string;
    description: string;
    source: string;
  }>;
  const ppRaw = t('tamSizingFunnel.proofPoints', { returnObjects: true });
  const proofPoints = (Array.isArray(ppRaw) ? ppRaw : []) as Array<{
    value: string;
    label: string;
  }>;

  const widths = ['100%', '75%', '50%'];

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
            {t('tamSizingFunnel.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('tamSizingFunnel.headline')}{' '}
            <Text as="span" color="brand.400">{t('tamSizingFunnel.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        <VStack spacing={{ base: 3, md: 4 }} w="full" align="center">
          {tiers.map((tier, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              w={widths[i]}
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
                <HStack spacing={{ base: 3, md: 5 }} align="center" pt={1}>
                  <Text
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="800"
                    letterSpacing="0.1em"
                    color="brand.400"
                    minW={{ base: '36px', md: '44px' }}
                  >
                    {tier.label}
                  </Text>
                  <Text
                    fontSize={{ base: 'xl', md: '3xl' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {tier.value}
                  </Text>
                  <VStack align="flex-start" spacing={0} flex={1}>
                    <Text color={c.textSecondary} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.4">
                      {tier.description}
                    </Text>
                    <HStack spacing={1}>
                      <Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" />
                      <Text fontSize="xs" color={c.textSubtle} fontWeight="600">
                        {tier.source}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            </MotionBox>
          ))}
        </VStack>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          w="full"
        >
          <HStack spacing={{ base: 3, md: 6 }} justify="center" flexWrap="wrap">
            {proofPoints.map((pp, i) => (
              <HStack key={i} spacing={2}>
                <Text
                  fontSize={{ base: 'lg', md: '2xl' }}
                  fontWeight="800"
                  bgGradient="linear(to-r, brand.300, whatsapp.400)"
                  bgClip="text"
                >
                  {pp.value}
                </Text>
                <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>
                  {pp.label}
                </Text>
              </HStack>
            ))}
          </HStack>
        </MotionBox>

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
          <Text fontSize="xs" color={c.textGhost} fontStyle="italic">
            {t('tamSizingFunnel.disclaimer')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
