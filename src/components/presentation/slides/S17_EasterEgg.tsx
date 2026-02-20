import { Heading, Text, VStack, Box, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { usePresentationColors } from '../PresentationThemeContext';

interface VideoCardProps {
  src: string;
  poster: string;
  title: string;
  description: string;
  delay: number;
}

function VideoCard({ src, poster, title, description, delay }: VideoCardProps) {
  const c = usePresentationColors();

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Box
        bg={c.surfaceBg}
        borderRadius="2xl"
        border="1px solid"
        borderColor={c.surfaceBorder}
        overflow="hidden"
        h="full"
      >
        <Box position="relative" w="full" pt="56.25%" bg="black">
          <Box
            as="video"
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            objectFit="contain"
            controls
            playsInline
            preload="metadata"
            poster={poster}
            borderBottom="1px solid"
            borderColor={c.surfaceBorder}
          >
            <source src={src} type="video/mp4" />
          </Box>
        </Box>
        <VStack align="flex-start" spacing={1} p={{ base: 4, md: 5 }}>
          <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>
            {title}
          </Text>
          <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>
            {description}
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
}

export function S17_EasterEgg() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();

  return (
    <Slide>
      {/* Glow */}
      <Box
        position="absolute"
        top="30%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="80%"
        h="80%"
        bgGradient={`radial(circle, ${c.glowPurple} 0%, ${c.glowGreen} 40%, transparent 70%)`}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 4, md: 6 }} w="full">
        <VStack spacing={2} textAlign="center">
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Text fontSize="xs" color="brand.400" fontWeight="700" letterSpacing="0.15em">
              {t('easterEgg.badge')}
            </Text>
          </MotionBox>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Heading fontSize={{ base: 'xl', md: '3xl', lg: '4xl' }} fontWeight="800">
              <GradientText gradient="linear(to-r, brand.400, whatsapp.400)">
                {t('easterEgg.headline')}
              </GradientText>
            </Heading>
          </MotionBox>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="full">
          <VideoCard
            src="/videos/ai-demo-full.mp4"
            poster="/videos/ai-demo-poster.jpg"
            title={t('easterEgg.aiDemo.title')}
            description={t('easterEgg.aiDemo.description')}
            delay={0.3}
          />
          <VideoCard
            src="/videos/whatsapp-demo.mp4"
            poster="/videos/whatsapp-demo-poster.jpg"
            title={t('easterEgg.whatsappDemo.title')}
            description={t('easterEgg.whatsappDemo.description')}
            delay={0.5}
          />
        </SimpleGrid>
      </VStack>
    </Slide>
  );
}
