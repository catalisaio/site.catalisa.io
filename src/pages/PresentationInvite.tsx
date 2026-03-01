import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Flex, Box, Heading, Text, Spinner, SimpleGrid, Card, CardBody, Badge,
} from '@chakra-ui/react';
import {
  validateInvite, incrementUses,
  type PresentationInvite,
} from '../lib/invites';
import { initTrackingSession, trackPresentationEvent } from '../lib/presentationTracking';

const DECK_META: Record<string, { label: string; color: string; path: string }> = {
  comercial:  { label: 'Comercial',  color: 'purple', path: '/apresentacao/comercial' },
  investidor: { label: 'Investidor', color: 'blue',   path: '/apresentacao/investidor' },
  varejo:     { label: 'Varejo',     color: 'green',  path: '/apresentacao/varejo' },
  fintech:    { label: 'Fintech',    color: 'orange', path: '/apresentacao/fintech' },
  seguros:    { label: 'Seguros',    color: 'red',    path: '/apresentacao/seguros' },
};

const ALL_DECK_KEYS = Object.keys(DECK_META);

export function PresentationInvite() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'invalid' | 'valid'>('loading');
  const [invite, setInvite] = useState<PresentationInvite | null>(null);

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
        // Single deck — go directly
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
        // Init tracking without specific deck yet
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
      <Flex minH="100vh" align="center" justify="center" bg="gray.900">
        <Spinner color="purple.400" size="lg" />
      </Flex>
    );
  }

  // Invalid / expired
  if (status === 'invalid') {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.900" p={8}>
        <Box textAlign="center">
          <Heading size="lg" color="white" mb={4}>Link inválido ou expirado</Heading>
          <Text color="gray.400">
            Este link de apresentação não está mais disponível.
            Entre em contato com quem enviou para solicitar um novo.
          </Text>
        </Box>
      </Flex>
    );
  }

  // Multiple decks — show selector
  const allowedKeys = invite!.allowed_decks.includes('*') ? ALL_DECK_KEYS : invite!.allowed_decks;
  const validDecks = allowedKeys.filter(k => k in DECK_META);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.900" p={8}>
      <Box maxW="600px" w="full" textAlign="center">
        <Heading size="lg" color="white" mb={2}>
          Olá, {invite!.recipient_name}!
        </Heading>
        <Text color="gray.400" mb={8}>
          Selecione a apresentação que deseja assistir:
        </Text>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          {validDecks.map(key => {
            const meta = DECK_META[key];
            return (
              <Card
                key={key}
                bg="gray.800"
                cursor="pointer"
                _hover={{ bg: 'gray.700', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => handleSelectDeck(key)}
              >
                <CardBody textAlign="center" py={8}>
                  <Badge colorScheme={meta.color} fontSize="md" mb={2}>{meta.label}</Badge>
                  <Text color="gray.400" fontSize="sm">Ver apresentação</Text>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
