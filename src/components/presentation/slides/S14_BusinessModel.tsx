import { Heading, Text, SimpleGrid, VStack, Box, Icon } from '@chakra-ui/react';
import { FiShield, FiGlobe, FiServer, FiLock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const badgeIcons = [FiShield, FiGlobe, FiServer, FiLock];

export function S14_BusinessModel() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const badges = t('trustSecurity.badges', { returnObjects: true }) as Array<{ label: string; description: string }>;
  const highlights = t('trustSecurity.highlights', { returnObjects: true }) as string[];

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('trustSecurity.headline')}
          </Heading>
        </MotionBox>

        {/* Badges */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }} w="full">
          {badges.map((badge, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <VStack
                bg={c.surfaceBg}
                p={{ base: 5, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                spacing={3}
                textAlign="center"
              >
                <Box p={3} borderRadius="full" bg={c.iconContainerBg}>
                  <Icon as={badgeIcons[i]} boxSize={{ base: 6, md: 8 }} color="whatsapp.400" />
                </Box>
                <Text fontWeight="800" fontSize={{ base: 'md', md: 'lg' }}>{badge.label}</Text>
                <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>{badge.description}</Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Highlights */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 3, md: 4 }} w="full">
          {highlights.map((h, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                px={4}
                py={3}
                borderRadius="lg"
                textAlign="center"
              >
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary} fontWeight="500">
                  {h}
                </Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
