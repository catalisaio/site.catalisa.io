import { Heading, Text, SimpleGrid, VStack, HStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S07_BeforeAfter() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const beforeItems = t('beforeAfter.before.items', { returnObjects: true }) as Array<{ label: string; value: string }>;
  const afterItems = t('beforeAfter.after.items', { returnObjects: true }) as Array<{ label: string; value: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 12 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('beforeAfter.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 10 }} w="full">
          {/* BEFORE */}
          <MotionBox
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box
              bg={c.problemBg}
              p={{ base: 6, md: 8 }}
              borderRadius="2xl"
              border="1px solid"
              borderColor={c.problemBorder}
              h="full"
            >
              <HStack mb={6}>
                <Box w={3} h={3} borderRadius="full" bg="red.400" />
                <Text fontSize="sm" fontWeight="700" color={c.problemAccent} letterSpacing="0.1em">
                  {t('beforeAfter.before.label')}
                </Text>
              </HStack>
              <VStack spacing={6} align="stretch">
                {beforeItems.map((item, i) => (
                  <HStack key={i} justify="space-between">
                    <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }}>{item.label}</Text>
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={c.problemAccent}>{item.value}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>

          {/* AFTER */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box
              bg={c.successBg}
              p={{ base: 6, md: 8 }}
              borderRadius="2xl"
              border="1px solid"
              borderColor={c.successBorder}
              h="full"
            >
              <HStack mb={6}>
                <Box w={3} h={3} borderRadius="full" bg="whatsapp.400" />
                <Text fontSize="sm" fontWeight="700" color={c.successAccent} letterSpacing="0.1em">
                  {t('beforeAfter.after.label')}
                </Text>
              </HStack>
              <VStack spacing={6} align="stretch">
                {afterItems.map((item, i) => (
                  <HStack key={i} justify="space-between">
                    <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }}>{item.label}</Text>
                    <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={c.successAccent}>{item.value}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
