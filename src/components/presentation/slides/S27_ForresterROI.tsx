import { Heading, Text, SimpleGrid, VStack, Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S27_ForresterROI() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const metricsRaw = t('forresterROI.metrics', { returnObjects: true });
  const metrics = (Array.isArray(metricsRaw) ? metricsRaw : []) as Array<{
    value: string;
    label: string;
    detail: string;
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
            {t('forresterROI.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('forresterROI.headline')}{' '}
            <Text as="span" color="brand.400">{t('forresterROI.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 5, md: 8 }}
          w="full"
          align="center"
        >
          {/* Hero circle */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            flexShrink={0}
          >
            <Flex
              w={{ base: '180px', md: '220px' }}
              h={{ base: '180px', md: '220px' }}
              borderRadius="full"
              border="3px solid"
              borderColor="brand.400"
              align="center"
              justify="center"
              direction="column"
              bg={c.surfaceBg}
              mx="auto"
            >
              <Text
                fontSize={{ base: '4xl', md: '6xl' }}
                fontWeight="900"
                bgGradient="linear(to-r, brand.300, whatsapp.400)"
                bgClip="text"
                lineHeight="1"
              >
                {t('forresterROI.heroValue')}
              </Text>
              <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted} fontWeight="600">
                {t('forresterROI.heroLabel')}
              </Text>
              <Text fontSize="xs" color={c.textSubtle} mt={1}>
                {t('forresterROI.heroSource')}
              </Text>
            </Flex>
          </MotionBox>

          {/* 2x2 metric grid */}
          <SimpleGrid columns={2} spacing={{ base: 3, md: 4 }} flex={1}>
            {metrics.map((m, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
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
                    h="2px"
                    bgGradient="linear(to-r, brand.500, whatsapp.400)"
                  />
                  <VStack spacing={1} align="flex-start" pt={1}>
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
                    <Text color={c.textMuted} fontSize="xs">
                      {m.detail}
                    </Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Flex>

        {/* Bottom bar */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          w="full"
        >
          <Box
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
            <Text
              color={c.textSecondary}
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="700"
              pt={1}
            >
              {t('forresterROI.bottomBar')}
            </Text>
          </Box>
        </MotionBox>

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
          <Text fontSize="xs" color={c.textGhost} fontStyle="italic">
            {t('forresterROI.disclaimer')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
