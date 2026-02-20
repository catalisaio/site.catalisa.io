import { Heading, Text, SimpleGrid, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const stackColors = ['brand.400', 'catalisa.info', 'whatsapp.400', 'catalisa.secondary', 'gray.400'];

export function S13_Architecture() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const stack = t('architecture.stack', { returnObjects: true }) as string[];
  const models = t('architecture.models', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('architecture.headline')}
          </Heading>
        </MotionBox>

        {/* Stack layers */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          w="full"
          maxW="500px"
          mx="auto"
        >
          <VStack spacing={2} w="full">
            {stack.map((layer, i) => (
              <Box
                key={i}
                w="full"
                py={3}
                bg={c.surfaceBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={c.surfaceBorder}
                textAlign="center"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  w: '3px',
                  bg: stackColors[i],
                  borderRadius: 'full',
                }}
              >
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="600" color={stackColors[i]}>
                  {layer}
                </Text>
              </Box>
            ))}
          </VStack>
        </MotionBox>

        {/* Business models */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="full">
          {models.map((model, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 5, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                textAlign="center"
                h="full"
              >
                <Text fontWeight="700" fontSize={{ base: 'md', md: 'lg' }} mb={2}>{model.title}</Text>
                <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }}>{model.description}</Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
