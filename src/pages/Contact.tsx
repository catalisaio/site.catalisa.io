import {
  Box, Container, Heading, Text, VStack, HStack, Button, Icon, Flex,
} from '@chakra-ui/react';
import { FiMessageCircle, FiClock, FiHeart, FiMonitor } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { WhatsAppChatPreview } from '../components/shared/WhatsAppChatPreview';
import type { ChatMessage } from '../components/shared/WhatsAppChatPreview';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { BehindTheScenesHint } from '../components/shared/BehindTheScenesHint';
import { BehindTheScenesModal, useBehindTheScenes } from '../components/shared/BehindTheScenesModal';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function Contact() {
  const { t } = useTranslation('contact');
  const behindTheScenes = useBehindTheScenes();
  const contactMessages: ChatMessage[] = [
    { text: t('chat.messages.0'), sent: false, delay: 0.3 },
    { text: t('chat.messages.1'), sent: true, delay: 1.0 },
    { text: t('chat.messages.2'), sent: false, delay: 1.8 },
    { text: t('chat.messages.3'), sent: true, delay: 2.6 },
  ];

  const differentials = [
    {
      icon: FiClock,
      title: t('differentials.0.title'),
      description: t('differentials.0.description'),
    },
    {
      icon: FiHeart,
      title: t('differentials.1.title'),
      description: t('differentials.1.description'),
    },
    {
      icon: FiMonitor,
      title: t('differentials.2.title'),
      description: t('differentials.2.description'),
    },
  ];
  return (
    <>
      {/* Hero section (dark bg) */}
      <Box id="hero" bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            gap={{ base: 12, lg: 16 }}
          >
            {/* Left: Text + CTA */}
            <VStack align="flex-start" spacing={6} flex={1} maxW="560px">
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <HStack
                  bg="whiteAlpha.100"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  spacing={2}
                >
                  <Box w={2} h={2} borderRadius="full" bg="whatsapp.400" />
                  <Text color="whiteAlpha.800" fontSize="sm" fontWeight="600">{t('hero.badge')}</Text>
                </HStack>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  fontWeight="800"
                  color="white"
                  lineHeight="1.1"
                >
                  {t('hero.heading')}{' '}
                  <GradientText
                    gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                    fontSize="inherit"
                    fontWeight="inherit"
                  >
                    {t('hero.headingGradient')}
                  </GradientText>
                </Heading>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="480px">
                  {t('hero.subtitle')}
                </Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  size="lg"
                  bg="whatsapp.500"
                  color="white"
                  _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                  leftIcon={<FiMessageCircle />}
                  transition="all 0.2s"
                  fontWeight="700"
                >
                  {t('hero.ctaWhatsApp')}
                </Button>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <BehindTheScenesHint onOpen={behindTheScenes.onOpen} variant="dark" />
              </MotionBox>
            </VStack>

            {/* Right: WhatsApp Chat Preview */}
            <MotionBox
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              display={{ base: 'none', lg: 'block' }}
            >
              <WhatsAppChatPreview
                messages={contactMessages}
                title={t('chat.title')}
                triggerMode="auto"
              />
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* Differentials section */}
      <SectionWrapper>
        <VStack spacing={5} align="stretch" maxW="640px" mx="auto">
          {differentials.map((diff, i) => (
            <MotionBox
              key={diff.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <HStack
                spacing={4}
                p={5}
                bg="gray.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'brand.200', boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                <Box p={3} borderRadius="xl" bg="brand.50" flexShrink={0}>
                  <Icon as={diff.icon} boxSize={5} color="brand.500" />
                </Box>
                <VStack align="flex-start" spacing={1}>
                  <Text fontWeight="700" fontSize="sm">{diff.title}</Text>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.6">{diff.description}</Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </VStack>
      </SectionWrapper>

      <BehindTheScenesModal isOpen={behindTheScenes.isOpen} onClose={behindTheScenes.onClose} />
    </>
  );
}
