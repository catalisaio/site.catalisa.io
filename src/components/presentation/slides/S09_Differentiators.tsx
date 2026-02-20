import { Heading, Text, SimpleGrid, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

export function S09_Differentiators() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const items = t('differentiators.items', { returnObjects: true }) as Array<{
    vs: string;
    title: string;
    description: string;
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('differentiators.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="full">
          {items.map((item, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 5, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
                position="relative"
                overflow="hidden"
              >
                {/* Brand glow */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="4px"
                  h="full"
                  bgGradient="linear(to-b, brand.400, whatsapp.400)"
                  borderRadius="full"
                />
                <VStack align="flex-start" spacing={2} pl={3}>
                  <Text fontSize="xs" color="brand.400" fontWeight="700" letterSpacing="0.1em">
                    {item.vs}
                  </Text>
                  <Text fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
                    {item.title}
                  </Text>
                  <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7">
                    {item.description}
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
