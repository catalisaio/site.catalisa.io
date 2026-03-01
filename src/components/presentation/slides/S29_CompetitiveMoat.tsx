import { Heading, Text, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S29_CompetitiveMoat() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const layers = t('competitiveMoat.layers', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  // Inverted pyramid: first bar narrowest, last bar widest
  const widths = ['55%', '65%', '75%', '88%', '100%'];

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
            {t('competitiveMoat.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('competitiveMoat.headline')}{' '}
            <Text as="span" color="brand.400">{t('competitiveMoat.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        <VStack spacing={{ base: 2, md: 3 }} w="full" align="center">
          {layers.map((layer, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              w={widths[i]}
            >
              <Box
                bg={c.surfaceBg}
                px={{ base: 4, md: 5 }}
                py={{ base: 3, md: 4 }}
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
                <HStack spacing={{ base: 3, md: 4 }} pl={2}>
                  <Box
                    w={{ base: 6, md: 7 }}
                    h={{ base: 6, md: 7 }}
                    borderRadius="full"
                    bg="brand.400"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="800" color="white">
                      {i + 1}
                    </Text>
                  </Box>
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>
                      {layer.title}
                    </Text>
                    <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.4">
                      {layer.description}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </MotionBox>
          ))}
        </VStack>

        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          w="full"
          maxW="800px"
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
              fontSize={{ base: 'xs', md: 'sm' }}
              fontStyle="italic"
              fontWeight="600"
              pt={1}
            >
              {t('competitiveMoat.callout')}
            </Text>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
