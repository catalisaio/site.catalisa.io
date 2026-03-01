import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Flex, Box, Heading, Text, Spinner, SimpleGrid, Card, CardBody, Badge,
  Button, VStack, Icon,
} from '@chakra-ui/react';
import { FiClock, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
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

function ExpiredLinkPage() {
  const location = useLocation();
  const currentUrl = `catalisa.io${location.pathname}`;
  const whatsappMsg = encodeURIComponent(
    `Olá! Tentei acessar ${currentUrl} mas o link expirou. Podemos conversar sobre as apresentações da Catalisa?`
  );
  const ceoMsg = encodeURIComponent(
    `Oi Klederson! Acessei ${currentUrl} e o link já expirou. Posso receber um novo?`
  );

  return (
    <Flex minH="100vh" align="center" justify="center" bg="#0A0F14" p={8} position="relative" overflow="hidden">
      {/* Radial gradient atmosphere */}
      <Box
        position="absolute"
        top="30%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="600px"
        h="600px"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="30%"
        w="400px"
        h="400px"
        bgGradient="radial(circle, rgba(253, 194, 52, 0.05) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Box textAlign="center" maxW="520px" position="relative" zIndex={1}>
        <MotionBox initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Flex
            w="64px"
            h="64px"
            borderRadius="full"
            bg="whiteAlpha.100"
            align="center"
            justify="center"
            mx="auto"
            mb={6}
          >
            <Icon as={FiClock} boxSize={6} color="catalisa.secondary" />
          </Flex>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading size="xl" color="white" mb={3} fontWeight="800">
            Esse link já cumpriu sua{' '}
            <GradientText fontSize="inherit" fontWeight="inherit">missão</GradientText>
          </Heading>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Text color="whiteAlpha.700" fontSize="lg" mb={2}>
            O convite que você recebeu expirou ou atingiu o limite de acessos.
          </Text>
          <Text color="whiteAlpha.500" fontSize="md" mb={8}>
            Sem problemas — boas conversas não têm prazo de validade.
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
              Solicitar novo acesso
            </Button>
            <Button
              as="a"
              href={`https://wa.me/5511930802555?text=${ceoMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              borderColor="whiteAlpha.200"
              color="whiteAlpha.700"
              size="sm"
              leftIcon={<FiMessageCircle />}
              _hover={{ borderColor: 'whiteAlpha.400', color: 'white', transform: 'translateY(-1px)' }}
              transition="all 0.2s"
            >
              Ou fale direto com nosso CEO
            </Button>
            <Button
              as="a"
              href="https://catalisa.io"
              variant="ghost"
              color="whiteAlpha.400"
              size="sm"
              rightIcon={<FiArrowRight />}
              _hover={{ color: 'whiteAlpha.700' }}
            >
              Conhecer a Catalisa
            </Button>
          </VStack>
        </MotionBox>
      </Box>
    </Flex>
  );
}

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
      <Flex minH="100vh" align="center" justify="center" bg="#0A0F14">
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
    <Flex minH="100vh" align="center" justify="center" bg="#0A0F14" p={8} position="relative" overflow="hidden">
      {/* Radial gradient atmosphere */}
      <Box
        position="absolute"
        top="20%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="600px"
        h="600px"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.12) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <Box maxW="600px" w="full" textAlign="center" position="relative" zIndex={1}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading size="lg" color="white" mb={2} fontWeight="800">
            Olá, <GradientText fontSize="inherit" fontWeight="inherit">{invite!.recipient_name}</GradientText>
          </Heading>
          <Text color="whiteAlpha.600" mb={8}>
            Selecione a apresentação que deseja assistir:
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
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  cursor="pointer"
                  _hover={{
                    bg: 'whiteAlpha.100',
                    borderColor: `${meta.color}.500`,
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                  }}
                  transition="all 0.2s"
                  onClick={() => handleSelectDeck(key)}
                >
                  <CardBody textAlign="center" py={8}>
                    <Badge colorScheme={meta.color} fontSize="md" mb={2}>{meta.label}</Badge>
                    <Text color="whiteAlpha.500" fontSize="sm">Ver apresentação</Text>
                  </CardBody>
                </Card>
              </MotionBox>
            );
          })}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
