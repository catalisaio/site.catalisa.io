import { Heading, Text, SimpleGrid, VStack, Icon, Box } from '@chakra-ui/react';
import { FiClock, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const icons = [FiClock, FiUsers, FiAlertTriangle];

export function S02_ProblemHook() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const painPoints = t('problemHook.painPoints', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 12 }} w="full">
        <VStack spacing={4} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.2">
              {t('problemHook.headline')}{' '}
              <Text as="span" color="brand.400">{t('problemHook.headlineHighlight')}</Text>
            </Heading>
          </MotionBox>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 8 }} w="full">
          {painPoints.map((point, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
              >
                <VStack align="flex-start" spacing={4}>
                  <Box p={3} borderRadius="lg" bg={c.problemIconBg} opacity={0.8}>
                    <Icon as={icons[i]} boxSize={6} color={c.problemAccent} />
                  </Box>
                  <Heading as="h3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">
                    {point.title}
                  </Heading>
                  <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7">
                    {point.description}
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
