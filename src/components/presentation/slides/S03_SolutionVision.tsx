import { Heading, Text, SimpleGrid, VStack, Box, Icon } from '@chakra-ui/react';
import { FiMessageCircle, FiDollarSign, FiShield, FiTrendingUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const cards = [
  { key: 'card1', icon: FiMessageCircle, color: 'whatsapp.400', glow: 'rgba(37, 211, 102, 0.15)' },
  { key: 'card2', icon: FiDollarSign, color: 'catalisa.secondary', glow: 'rgba(253, 194, 52, 0.15)' },
  { key: 'card3', icon: FiShield, color: 'catalisa.info', glow: 'rgba(91, 155, 213, 0.15)' },
  { key: 'card4', icon: FiTrendingUp, color: 'brand.400', glow: 'rgba(155, 123, 192, 0.15)' },
] as const;

export function S03_SolutionVision() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('solutionVision.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="full">
          {cards.map((card, i) => (
            <MotionBox
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 5, md: 7 }}
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
                <VStack align="flex-start" spacing={3} position="relative">
                  <Icon as={card.icon} boxSize={{ base: 7, md: 8 }} color={card.color} />
                  <Heading as="h3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">
                    {t(`solutionVision.${card.key}.title`)}
                  </Heading>
                  <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7">
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
