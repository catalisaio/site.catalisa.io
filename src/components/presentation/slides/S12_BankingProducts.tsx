import { Heading, Text, SimpleGrid, VStack, HStack, Box } from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S12_BankingProducts() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const cards = t('bankingProducts.cards', { returnObjects: true }) as Array<{
    title: string;
    steps: string[];
    claim: string;
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('bankingProducts.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }} w="full">
          {cards.map((card, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
              >
                <VStack align="flex-start" spacing={5}>
                  <Heading as="h3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">
                    {card.title}
                  </Heading>

                  {/* Value chain */}
                  <HStack spacing={2} flexWrap="wrap">
                    {card.steps.map((step, j) => (
                      <HStack key={j} spacing={2}>
                        <Box
                          px={3}
                          py={1}
                          borderRadius="full"
                          bg={c.pillBg}
                          border="1px solid"
                          borderColor={c.pillBorder}
                        >
                          <Text fontSize="xs" fontWeight="600">{step}</Text>
                        </Box>
                        {j < card.steps.length - 1 && (
                          <Box as={FiArrowRight} color={c.textGhost} fontSize="xs" />
                        )}
                      </HStack>
                    ))}
                  </HStack>

                  <Box
                    bg={c.glowGold}
                    px={4}
                    py={3}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="rgba(253, 194, 52, 0.2)"
                    w="full"
                  >
                    <Text fontSize={{ base: 'sm', md: 'md' }} color="catalisa.secondary" fontWeight="600">
                      {card.claim}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
