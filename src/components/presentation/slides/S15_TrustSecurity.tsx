import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const modelColors = ['brand.400', 'whatsapp.400', 'catalisa.secondary'];

export function S15_TrustSecurity() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const models = t('architecture.models', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 12 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            Pricing Overview
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="full">
          {models.map((model, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
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
                  bg={modelColors[i]}
                />
                <VStack spacing={4} textAlign="center" pt={2}>
                  <Text fontWeight="800" fontSize={{ base: 'xl', md: '2xl' }} color={modelColors[i]}>
                    {model.title}
                  </Text>
                  <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7">
                    {model.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* ROI bars */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          w="full"
        >
          <Box
            bg={c.surfaceBg}
            p={{ base: 5, md: 6 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.surfaceBorder}
          >
            <Text fontSize="sm" color={c.textSubtle} mb={4} fontWeight="600">ROI ESTIMADO</Text>
            <VStack spacing={3} align="stretch">
              {[
                { label: '3 meses', pct: 40, color: 'brand.400' },
                { label: '6 meses', pct: 70, color: 'whatsapp.400' },
                { label: '12 meses', pct: 95, color: 'catalisa.secondary' },
              ].map((bar) => (
                <HStack key={bar.label} spacing={4}>
                  <Text fontSize="sm" color={c.textMuted} minW="80px">{bar.label}</Text>
                  <Box flex={1} h="8px" bg={c.progressBg} borderRadius="full" overflow="hidden">
                    <Box h="full" w={`${bar.pct}%`} bg={bar.color} borderRadius="full" />
                  </Box>
                  <Text fontSize="sm" color={bar.color} fontWeight="700">{bar.pct}%</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
