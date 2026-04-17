import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Flex, Box, Heading, Text, Spinner, SimpleGrid, Card, CardBody, Badge,
  Button, VStack, Icon, Container,
} from '@chakra-ui/react';
import { FiClock, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../../components/motion';
import { GradientText } from '../../components/shared/GradientText';
import {
  validateInvite, incrementUses,
  type PresentationInvite as PresentationInviteType,
} from '../../lib/invites';
import { initTrackingSession, trackPresentationEvent } from '../../lib/presentationTracking';

const DECK_META: Record<string, { label: string; color: string; path: string }> = {
  comercial:  { label: 'Comercial',  color: 'purple', path: '/apresentacao/comercial' },
  investidor: { label: 'Investidor', color: 'blue',   path: '/apresentacao/investidor' },
  varejo:     { label: 'Varejo',     color: 'green',  path: '/apresentacao/varejo' },
  fintech:    { label: 'Fintech',    color: 'orange', path: '/apresentacao/fintech' },
  seguros:    { label: 'Seguros',    color: 'red',    path: '/apresentacao/seguros' },
  economics:  { label: 'Economics',  color: 'teal',   path: '/apresentacao/economics' },
};

const ALL_DECK_KEYS = Object.keys(DECK_META);

function ExpiredLinkPage() {
  const { t } = useTranslation('presentation-admin');
  const location = useLocation();
  const currentUrl = `catalisa.io${location.pathname}`;
  const whatsappMsg = encodeURIComponent(
    `Olá! Tentei acessar ${currentUrl} mas o link expirou. Podemos conversar sobre as apresentações da Catalisa?`
  );
  const ceoMsg = encodeURIComponent(
    `Oi Klederson! Acessei ${currentUrl} e o link já expirou. Posso receber um novo?`
  );

  return (
    <Container maxW="520px" py={20}>
      <Box textAlign="center">
        <MotionBox initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Flex
            w="64px"
            h="64px"
            borderRadius="full"
            bg="purple.50"
            align="center"
            justify="center"
            mx="auto"
            mb={6}
          >
            <Icon as={FiClock} boxSize={6} color="purple.500" />
          </Flex>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading size="xl" color="gray.800" mb={3} fontWeight="800">
            {t('invite.expiredTitle')}{' '}
            <GradientText fontSize="inherit" fontWeight="inherit">{t('invite.expiredHighlight')}</GradientText>
          </Heading>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Text color="gray.600" fontSize="lg" mb={2}>
            {t('invite.expiredMessage')}
          </Text>
          <Text color="gray.400" fontSize="md" mb={8}>
            {t('invite.expiredSubtext')}
          </Text>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
          <VStack spacing={4}>
            <Button
              as="a"
              href={`https://wa.me/5511977303414?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="whatsapp"
              size="lg"
              leftIcon={<FiMessageCircle />}
              px={8}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              {t('invite.requestAccess')}
            </Button>
            <Button
              as="a"
              href={`https://wa.me/5511930802555?text=${ceoMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              borderColor="gray.300"
              color="gray.600"
              size="sm"
              leftIcon={<FiMessageCircle />}
              _hover={{ borderColor: 'gray.400', color: 'gray.800', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
            >
              {t('invite.contactCEO')}
            </Button>
            <Button
              as="a"
              href="https://catalisa.io"
              variant="ghost"
              color="gray.400"
              size="sm"
              rightIcon={<FiArrowRight />}
              _hover={{ color: 'gray.600' }}
            >
              {t('invite.discoverCatalisa')}
            </Button>
          </VStack>
        </MotionBox>
      </Box>
    </Container>
  );
}

export function PresentationInvite() {
  const { t } = useTranslation('presentation-admin');
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'invalid' | 'valid'>('loading');
  const [invite, setInvite] = useState<PresentationInviteType | null>(null);

  useEffect(() => {
    if (!code) { setStatus('invalid'); return; }

    validateInvite(code).then(inv => {
      if (!inv) {
        setStatus('invalid');
        return;
      }

      setInvite(inv);
      incrementUses(code);

      const allowedKeys = inv.allowed_decks.includes('*') ? ALL_DECK_KEYS : inv.allowed_decks;
      const validDecks = allowedKeys.filter(k => k in DECK_META);

      if (validDecks.length === 1) {
        const deck = validDecks[0];
        initTrackingSession({
          inviteCode: code,
          recipientName: inv.recipient_name,
          recipientCompany: inv.recipient_company,
          deck,
        });
        trackPresentationEvent('session_start');
        navigate(DECK_META[deck].path, { replace: true });
      } else {
        setStatus('valid');
        initTrackingSession({
          inviteCode: code,
          recipientName: inv.recipient_name,
          recipientCompany: inv.recipient_company,
          deck: 'menu',
        });
        trackPresentationEvent('session_start');
      }
    });
  }, [code, navigate]);

  const handleSelectDeck = (deckKey: string) => {
    if (!invite || !code) return;
    initTrackingSession({
      inviteCode: code,
      recipientName: invite.recipient_name,
      recipientCompany: invite.recipient_company,
      deck: deckKey,
    });
    trackPresentationEvent('deck_selected', { extra: { deck: deckKey } });
    navigate(DECK_META[deckKey].path);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <Flex justify="center" align="center" py={20}>
        <Spinner color="brand.400" size="lg" />
      </Flex>
    );
  }

  // Invalid / expired
  if (status === 'invalid') {
    return <ExpiredLinkPage />;
  }

  // Multiple decks — show selector
  const allowedKeys = invite!.allowed_decks.includes('*') ? ALL_DECK_KEYS : invite!.allowed_decks;
  const validDecks = allowedKeys.filter(k => k in DECK_META);

  return (
    <Container maxW="600px" py={20}>
      <Box textAlign="center">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading size="lg" color="gray.800" mb={2} fontWeight="800">
            {t('invite.greeting', { name: '' })}
            <GradientText fontSize="inherit" fontWeight="inherit">{invite!.recipient_name}</GradientText>
          </Heading>
          <Text color="gray.500" mb={8}>
            {t('invite.selectDeck')}
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          {validDecks.map((key, i) => {
            const meta = DECK_META[key];
            return (
              <MotionBox
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              >
                <Card
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  cursor="pointer"
                  _hover={{
                    borderColor: `${meta.color}.500`,
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                  }}
                  transition="all 0.2s"
                  onClick={() => handleSelectDeck(key)}
                >
                  <CardBody textAlign="center" py={8}>
                    <Badge colorScheme={meta.color} fontSize="md" mb={2}>{meta.label}</Badge>
                    <Text color="gray.500" fontSize="sm">{t('invite.viewPresentation')}</Text>
                  </CardBody>
                </Card>
              </MotionBox>
            );
          })}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
