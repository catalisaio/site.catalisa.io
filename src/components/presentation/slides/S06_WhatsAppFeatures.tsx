import { Heading, Text, SimpleGrid, VStack, Box, Icon } from '@chakra-ui/react';
import { FiMessageCircle, FiCpu, FiGitBranch, FiBox, FiUsers, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const featureIcons = [FiMessageCircle, FiCpu, FiGitBranch, FiBox, FiUsers, FiShield];
const featureColors = ['whatsapp.400', 'brand.400', 'catalisa.secondary', 'catalisa.accent', 'catalisa.info', 'green.400'];

export function S06_WhatsAppFeatures() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const items = t('whatsappFeatures.items', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('whatsappFeatures.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 6 }} w="full">
          {items.map((item, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            >
              <VStack
                bg={c.surfaceBg}
                p={{ base: 4, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                spacing={3}
                textAlign="center"
                h="full"
              >
                <Box p={3} borderRadius="full" bg={c.iconContainerBg}>
                  <Icon as={featureIcons[i]} boxSize={{ base: 5, md: 6 }} color={featureColors[i]} />
                </Box>
                <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>{item.title}</Text>
                <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>{item.description}</Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
