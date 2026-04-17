import { Heading, Text, SimpleGrid, VStack, Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S31_RevenueModel() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const plansRaw = t('revenueModel.plans', { returnObjects: true });
  const plans = (Array.isArray(plansRaw) ? plansRaw : []) as Array<{
    name: string;
    price: string;
    model: string;
    highlight?: boolean;
  }>;
  const meteringRaw = t('revenueModel.metering', { returnObjects: true });
  const metering = (Array.isArray(meteringRaw) ? meteringRaw : []) as Array<{
    resource: string;
    unit: string;
    cost: string;
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
            {t('revenueModel.badge')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center" lineHeight="1.2">
            {t('revenueModel.headline')}{' '}
            <Text as="span" color="brand.400">{t('revenueModel.headlineHighlight')}</Text>
          </Heading>
        </MotionBox>

        {/* Pricing plan cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 4 }} w="full">
          {plans.map((plan, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 4, md: 5 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={plan.highlight ? 'brand.400' : c.surfaceBorder}
                h="full"
                position="relative"
                overflow="hidden"
              >
                {plan.highlight && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="2px"
                    bg="brand.400"
                  />
                )}
                <VStack spacing={2} align="flex-start" pt={plan.highlight ? 1 : 0}>
                  <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="800" color={plan.highlight ? 'brand.400' : c.textSecondary}>
                    {plan.name}
                  </Text>
                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="800"
                    bgGradient="linear(to-r, brand.300, whatsapp.400)"
                    bgClip="text"
                  >
                    {plan.price}
                  </Text>
                  <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.4">
                    {plan.model}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Metering section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          w="full"
        >
          <VStack spacing={3} align="flex-start" w="full">
            <HStack spacing={2}>
              <Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" />
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="700" color={c.textSecondary}>
                {t('revenueModel.meteringLabel')}
              </Text>
            </HStack>

            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 4 }} w="full">
              {metering.map((m, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                >
                  <Box
                    bg={c.surfaceBg}
                    p={{ base: 3, md: 4 }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={c.surfaceBorder}
                  >
                    <VStack spacing={1} align="flex-start">
                      <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="700" color={c.textSecondary}>
                        {m.resource}
                      </Text>
                      <Text fontSize="xs" color={c.textMuted}>
                        {m.unit}
                      </Text>
                      <Text
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="800"
                        bgGradient="linear(to-r, brand.300, whatsapp.400)"
                        bgClip="text"
                      >
                        {m.cost}
                      </Text>
                    </VStack>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
