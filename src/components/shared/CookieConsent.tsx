import { useState, useEffect } from 'react';
import { Box, Button, Text, HStack, Link } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

const CONSENT_KEY = 'catalisa_cookie_consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
}

/**
 * LGPD cookie consent banner.
 * On accept: updates consent mode to grant analytics_storage.
 * On decline: keeps analytics_storage denied.
 * Persists choice to localStorage.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const lp = useLocalizedPath();
  const isEn = i18n.language === 'en-US';

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'granted') {
      updateConsent(true);
    } else if (stored === 'denied') {
      updateConsent(false);
    } else {
      // No choice yet — show banner
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    updateConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    updateConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="gray.900"
      color="white"
      px={{ base: 4, md: 8 }}
      py={4}
      zIndex="banner"
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Box maxW="7xl" mx="auto" display={{ md: 'flex' }} alignItems="center" gap={4}>
        <Text fontSize="sm" flex={1} mb={{ base: 3, md: 0 }}>
          {isEn
            ? 'We use cookies for analytics and load external resources (images) to improve your experience. By clicking "Accept", you consent to the use of cookies and third-party resources in accordance with our '
            : 'Usamos cookies de analytics e carregamos recursos externos (imagens) para melhorar sua experiencia. Ao clicar em "Aceitar", voce consente com o uso de cookies e recursos de terceiros conforme nossa '}
          <Link href={lp('/politica-privacidade')} textDecoration="underline">
            {isEn ? 'Privacy Policy' : 'Politica de Privacidade'}
          </Link>
          .
        </Text>
        <HStack spacing={3} flexShrink={0}>
          <Button
            size="sm"
            variant="ghost"
            color="whiteAlpha.800"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={handleDecline}
          >
            {isEn ? 'Decline' : 'Recusar'}
          </Button>
          <Button
            size="sm"
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600' }}
            onClick={handleAccept}
          >
            {isEn ? 'Accept' : 'Aceitar'}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
