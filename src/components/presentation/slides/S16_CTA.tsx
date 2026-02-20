import { Heading, Text, VStack, HStack, Button, Box } from '@chakra-ui/react';
import { FiMessageCircle, FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { usePresentationColors } from '../PresentationThemeContext';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function S16_CTA() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();

  return (
    <Slide>
      {/* Glow */}
      <Box
        position="absolute"
        top="40%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="80%"
        h="80%"
        bgGradient={`radial(circle, ${c.glowPurple} 0%, ${c.glowGreen} 40%, transparent 70%)`}
        pointerEvents="none"
      />

      <VStack spacing={{ base: 8, md: 10 }} textAlign="center">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }} fontWeight="800">
            <GradientText gradient="linear(to-r, brand.300, whatsapp.400)">
              {t('cta.headline')}
            </GradientText>
          </Heading>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Text fontSize={{ base: 'md', md: 'xl' }} color={c.textSecondary} maxW="600px">
            {t('cta.subtitle')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            bg="whatsapp.500"
            color="white"
            _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)' }}
            leftIcon={<FiMessageCircle />}
            px={8}
          >
            {t('cta.whatsappButton')}
          </Button>
        </MotionBox>

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <HStack spacing={6} color={c.textSubtle} fontSize="sm">
            <HStack as="a" href="https://catalisa.io" target="_blank" spacing={1} _hover={{ color: c.textSecondary }}>
              <FiExternalLink />
              <Text>catalisa.io</Text>
            </HStack>
            <HStack as="a" href="https://linkedin.com/company/catalisa" target="_blank" spacing={1} _hover={{ color: c.textSecondary }}>
              <FiExternalLink />
              <Text>LinkedIn</Text>
            </HStack>
          </HStack>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
