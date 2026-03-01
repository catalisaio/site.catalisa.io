import { Box, Container, Heading, Text, Button, HStack, Flex, VStack } from '@chakra-ui/react';
import { FiMessageCircle, FiPlay } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { PhoneMockup } from '../../shared/PhoneMockup';
import { WhatsAppChatPreview } from '../../shared/WhatsAppChatPreview';
import type { ChatMessage } from '../../shared/WhatsAppChatPreview';
import { useLocalizedPath } from '../../../i18n/useLocalizedPath';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20AI%20Agents%20no%20WhatsApp.';

interface StatItem {
  value: string;
  label: string;
}

export function HeroSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const lp = useLocalizedPath();
  const statsRaw = t('hero.stats', { returnObjects: true });
  const stats = (Array.isArray(statsRaw) ? statsRaw : []) as StatItem[];
  const chatRaw = t('hero.chatMessages', { returnObjects: true });
  const chatMessages = (Array.isArray(chatRaw) ? chatRaw : []) as ChatMessage[];

  return (
    <Box
      position="relative"
      bg="gray.900"
      overflow="hidden"
      mt="-64px"
      pt="64px"
    >
      {/* Radial backgrounds */}
      <Box
        position="absolute"
        top="-20%"
        left="30%"
        w="80%"
        h="80%"
        bgGradient="radial(circle, rgba(37, 211, 102, 0.15) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Container maxW="1280px" position="relative" zIndex={1}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 12, lg: 16 }}
          py={{ base: 16, lg: 20 }}
        >
          {/* Left content */}
          <VStack align="flex-start" spacing={6} maxW="600px" flex={1}>
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
                borderColor="whatsapp.400"
                spacing={2}
              >
                <Box w={2} h={2} borderRadius="full" bg="whatsapp.400" />
                <Text color="whatsapp.300" fontSize="sm" fontWeight="600">{t('hero.badge')}</Text>
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
                {t('hero.headline')}{' '}
                <GradientText
                  gradient="linear(to-r, whatsapp.300, whatsapp.400, brand.300)"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  {t('hero.headlineGradient')}
                </GradientText>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="520px">
                {t('hero.subtitle')}
              </Text>
            </MotionBox>

            {/* Stats bar */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              w="full"
            >
              <HStack
                spacing={{ base: 3, md: 6 }}
                flexWrap="wrap"
                bg="whiteAlpha.50"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                {stats.map((stat, i) => (
                  <VStack key={i} spacing={0} align="center" flex={1} minW="70px">
                    <Text color="whatsapp.300" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="800">
                      {stat.value}
                    </Text>
                    <Text color="whiteAlpha.500" fontSize="2xs" textAlign="center">
                      {stat.label}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </MotionBox>

            {/* CTAs */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  bg="whatsapp.500"
                  color="white"
                  _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                  leftIcon={<FiMessageCircle />}
                  transition="all 0.2s"
                >
                  {t('hero.cta')}
                </Button>
                <Button
                  as={Link}
                  to={lp('/demo')}
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.400"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  leftIcon={<FiPlay />}
                >
                  {t('hero.ctaSecondary')}
                </Button>
              </HStack>
            </MotionBox>
          </VStack>

          {/* Right visual - Phone with WhatsApp chat */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            display={{ base: 'none', md: 'block' }}
            maxW="360px"
            flex="0 0 auto"
          >
            <PhoneMockup maxH="520px">
              <WhatsAppChatPreview
                messages={chatMessages}
                title={t('hero.chatTitle')}
                triggerMode="auto"
              />
            </PhoneMockup>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
}
