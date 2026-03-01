import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { getTrackingContext } from '../../lib/presentationTracking';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

function ForbiddenPage() {
  const location = useLocation();
  const currentUrl = `catalisa.io${location.pathname}`;
  const whatsappMsg = encodeURIComponent(
    `Olá! Tentei acessar ${currentUrl} e vi que é exclusivo. Fiquei curioso — podemos conversar?`
  );
  const ceoMsg = encodeURIComponent(
    `Oi Klederson! Encontrei ${currentUrl} e gostaria de saber mais sobre a Catalisa.`
  );

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.900" p={8}>
      <Box textAlign="center" maxW="520px">
        <Text fontSize="4xl" mb={4}>
          🔒
        </Text>
        <Heading size="xl" color="white" mb={3}>
          Ops, este conteúdo é exclusivo
        </Heading>
        <Text color="gray.400" fontSize="lg" mb={2}>
          Nossas apresentações são personalizadas e enviadas por convite.
        </Text>
        <Text color="gray.500" fontSize="md" mb={8}>
          Mas se você chegou até aqui, é porque tem bom faro.
          Vamos conversar?
        </Text>
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
          >
            Quero saber mais
          </Button>
          <Button
            as="a"
            href={`https://wa.me/5511930802555?text=${ceoMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            colorScheme="whiteAlpha"
            size="sm"
            leftIcon={<FiMessageCircle />}
          >
            Ou fale direto com nosso CEO
          </Button>
          <Button
            as="a"
            href="https://catalisa.io"
            variant="ghost"
            color="gray.500"
            size="sm"
            _hover={{ color: 'gray.300' }}
          >
            Conhecer a Catalisa
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

/**
 * Gate that only renders children if user has an active invite session or is authenticated.
 * Otherwise shows a branded forbidden page with WhatsApp CTA.
 */
export function PresentationGate({ children }: { children: ReactNode }) {
  const ctx = getTrackingContext();
  const { user, loading } = useSupabaseAuth();

  // Has active invite/tracking session — allow
  if (ctx.sessionId) return <>{children}</>;

  // Still checking auth — show nothing briefly
  if (loading) return null;

  // Authenticated admin — allow
  if (user) return <>{children}</>;

  // No invite, no auth — block
  return <ForbiddenPage />;
}
