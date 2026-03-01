import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Flex, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FiLock, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';
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
        bgGradient="radial(circle, rgba(37, 211, 102, 0.06) 0%, transparent 60%)"
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
            <Icon as={FiLock} boxSize={6} color="brand.400" />
          </Flex>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Heading size="xl" color="white" mb={3} fontWeight="800">
            Ops, este conteúdo é{' '}
            <GradientText fontSize="inherit" fontWeight="inherit">exclusivo</GradientText>
          </Heading>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Text color="whiteAlpha.700" fontSize="lg" mb={2}>
            Nossas apresentações são personalizadas e enviadas por convite.
          </Text>
          <Text color="whiteAlpha.500" fontSize="md" mb={8}>
            Mas se você chegou até aqui, é porque tem bom faro.
            Vamos conversar?
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
              Quero saber mais
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
