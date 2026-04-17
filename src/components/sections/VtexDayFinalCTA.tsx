import { Box, Button, Container, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { FiCalendar, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { CATALISA_WHATSAPP } from '../../data/vtexDay2026';

const CALENDAR_URL =
  'https://www.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent('Demo Catalisa — Assistente VTEX WhatsApp') +
  '&dates=20260420T140000Z/20260420T150000Z' +
  '&details=' + encodeURIComponent('Conversa com a Catalisa sobre automação de atendimento VTEX via WhatsApp. https://catalisa.io/vtex-day-2026') +
  '&location=' + encodeURIComponent('Online / WhatsApp');

export function VtexDayFinalCTA() {
  const { t } = useTranslation('vtex-day-2026');
  return (
    <Box
      as="section"
      id="vtex-day-final-cta"
      bg="hero.bg"
      color="white"
      py={{ base: 16, md: 24 }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="60%"
        h="120%"
        bgGradient="radial(circle, rgba(115,75,156,0.25) 0%, transparent 65%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="50%"
        h="100%"
        bgGradient="radial(circle, rgba(37,211,102,0.15) 0%, transparent 65%)"
        pointerEvents="none"
      />

      <Container maxW="860px" position="relative">
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }}>
            {t('finalCta.heading')}
          </Heading>
          <Text color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
            {t('finalCta.subtitle')}
          </Text>
          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Button
              as="a"
              href={CATALISA_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              bg="whatsapp.500"
              color="white"
              _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)' }}
              leftIcon={<FiMessageCircle />}
            >
              {t('finalCta.whatsapp')}
            </Button>
            <Button
              as="a"
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              borderColor="whiteAlpha.500"
              color="white"
              _hover={{ bg: 'whiteAlpha.100' }}
              leftIcon={<FiCalendar />}
            >
              {t('finalCta.calendar')}
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
