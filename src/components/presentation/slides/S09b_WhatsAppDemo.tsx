import { Heading, Text, VStack, Box, HStack, Flex, Icon } from '@chakra-ui/react';
import { FiMessageCircle, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { PhoneMockup } from '../../shared/PhoneMockup';
import { usePresentationColors } from '../PresentationThemeContext';

export function S09b_WhatsAppDemo() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const highlights = t('liveDemos.whatsappDemo.highlights', { returnObjects: true }) as string[];

  return (
    <Slide>
      {/* Ambient glow */}
      <Box
        position="absolute"
        top="20%"
        right="20%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(37, 211, 102, 0.1) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="30%"
        left="10%"
        w="40%"
        h="40%"
        bgGradient={`radial(circle, ${c.glowPurple} 0%, transparent 60%)`}
        pointerEvents="none"
      />

      <Flex
        direction={{ base: 'column', lg: 'row-reverse' }}
        align="center"
        justify="center"
        gap={{ base: 6, lg: 10 }}
        w="full"
        maxW="1100px"
      >
        {/* Right (visually): Content */}
        <VStack
          align={{ base: 'center', lg: 'flex-start' }}
          spacing={{ base: 3, md: 4 }}
          textAlign={{ base: 'center', lg: 'left' }}
          flex={{ lg: '0 0 42%' }}
        >
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <HStack
              spacing={2}
              bg={c.surfaceBg}
              border="1px solid"
              borderColor={c.surfaceBorder}
              px={3}
              py={1.5}
              borderRadius="full"
            >
              <Box as={FiMessageCircle} color="whatsapp.400" fontSize="xs" />
              <Text fontSize="2xs" color="whatsapp.400" fontWeight="700" letterSpacing="0.1em">
                {t('liveDemos.whatsappDemo.badge')}
              </Text>
            </HStack>
          </MotionBox>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="800" lineHeight="1.2">
              {t('liveDemos.whatsappDemo.headline')}{' '}
              <GradientText gradient="linear(to-r, whatsapp.400, brand.400)">
                {t('liveDemos.whatsappDemo.headlineHighlight')}
              </GradientText>
            </Heading>
          </MotionBox>

          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <Text color={c.textSecondary} fontSize={{ base: 'sm', md: 'md' }} lineHeight="1.7" maxW="420px">
              {t('liveDemos.whatsappDemo.description')}
            </Text>
          </MotionBox>

          {/* Highlights */}
          <VStack spacing={2.5} align={{ base: 'center', lg: 'flex-start' }} pt={1}>
            {highlights.map((h, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
              >
                <HStack spacing={3}>
                  <Flex
                    w={5}
                    h={5}
                    borderRadius="full"
                    bg="rgba(37, 211, 102, 0.15)"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon as={FiCheck} color="whatsapp.400" fontSize="xs" />
                  </Flex>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary} fontWeight="500">
                    {h}
                  </Text>
                </HStack>
              </MotionBox>
            ))}
          </VStack>
        </VStack>

        {/* Left (visually): Phone mockup with video */}
        <MotionBox
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          flexShrink={0}
          position="relative"
        >
          {/* Glow ring behind phone */}
          <Box
            position="absolute"
            top="10%"
            left="-10%"
            w="120%"
            h="80%"
            bgGradient="radial(circle, rgba(37, 211, 102, 0.15) 0%, transparent 60%)"
            pointerEvents="none"
            filter="blur(30px)"
          />
          <PhoneMockup
            maxH={{ base: '360px', md: '420px', lg: '500px' } as unknown as string}
            variant="dark"
            showStatusBar={false}
          >
            <Box position="relative" w="full" h="full" bg="#075E54">
              <video
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/videos/whatsapp-demo-poster.jpg"
                controls
              >
                <source src="/videos/whatsapp-demo.mp4" type="video/mp4" />
              </video>
            </Box>
          </PhoneMockup>
        </MotionBox>
      </Flex>
    </Slide>
  );
}
