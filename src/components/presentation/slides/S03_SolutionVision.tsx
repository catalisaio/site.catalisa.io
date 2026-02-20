import { Heading, Text, SimpleGrid, VStack, Box, Icon } from '@chakra-ui/react';
import { FiMessageCircle, FiDollarSign } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S03_SolutionVision() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();

  const cards = [
    { key: 'card1', icon: FiMessageCircle, color: 'whatsapp.400', glow: 'rgba(37, 211, 102, 0.15)' },
    { key: 'card2', icon: FiDollarSign, color: 'catalisa.secondary', glow: 'rgba(253, 194, 52, 0.15)' },
  ] as const;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 12 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('solutionVision.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 10 }} w="full">
          {cards.map((card, i) => (
            <MotionBox
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 8, md: 10 }}
                borderRadius="2xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                position="relative"
                overflow="hidden"
                h="full"
              >
                {/* Glow */}
                <Box
                  position="absolute"
                  top="-20%"
                  right="-20%"
                  w="60%"
                  h="60%"
                  bgGradient={`radial(circle, ${card.glow} 0%, transparent 70%)`}
                  pointerEvents="none"
                />
                <VStack align="flex-start" spacing={4} position="relative">
                  <Icon as={card.icon} boxSize={10} color={card.color} />
                  <Heading as="h3" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700">
                    {t(`solutionVision.${card.key}.title`)}
                  </Heading>
                  <Text color={c.textSecondary} fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7">
                    {t(`solutionVision.${card.key}.description`)}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
