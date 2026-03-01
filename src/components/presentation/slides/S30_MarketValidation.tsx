import { Heading, Text, SimpleGrid, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S30_MarketValidation() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const indRaw = t('marketValidation.industries', { returnObjects: true });
  const industries = (Array.isArray(indRaw) ? indRaw : []) as Array<{
    name: string;
    color: string;
    stats: Array<{ value: string; label: string }>;
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
            {t('marketValidation.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('marketValidation.headline')}{' '}
            <Text as="span" color="brand.400">{t('marketValidation.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="full">
          {industries.map((industry, ci) => (
            <MotionBox
              key={ci}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + ci * 0.15 }}
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
                  h="3px"
                  bg={industry.color}
                />
                <VStack spacing={4} pt={2}>
                  <Text
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="800"
                    letterSpacing="0.05em"
                    color={industry.color}
                  >
                    {industry.name}
                  </Text>
                  <VStack spacing={3} w="full">
                    {industry.stats.map((stat, si) => (
                      <VStack key={si} spacing={0} w="full">
                        <Text
                          fontSize={{ base: 'xl', md: '2xl' }}
                          fontWeight="800"
                          bgGradient="linear(to-r, brand.300, whatsapp.400)"
                          bgClip="text"
                        >
                          {stat.value}
                        </Text>
                        <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} textAlign="center">
                          {stat.label}
                        </Text>
                      </VStack>
                    ))}
                  </VStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Bottom summary bar */}
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
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
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="600"
              pt={1}
            >
              {t('marketValidation.bottomBar')}
            </Text>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
