import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { MotionBox } from '../motion';

export interface ChatMessage {
  text: string;
  sent: boolean;
  delay: number;
  time?: string;
}

const defaultMessages: ChatMessage[] = [
  { text: 'Oi, quero contratar um emprestimo', sent: false, delay: 0.2 },
  { text: 'Otimo! Ja puxei seus dados pre-aprovados. Voce tem limite de ate R$ 25.000. Qual valor deseja?', sent: true, delay: 0.8 },
  { text: 'R$ 15.000 em 24x', sent: false, delay: 1.6 },
  { text: 'Pronto! Contrato gerado:\n\nValor: R$ 15.000\nParcelas: 24x de R$ 743,25\nTaxa: 1,89% a.m.\n\nVou enviar o link para assinatura digital agora.', sent: true, delay: 2.4 },
  { text: 'Perfeito, vou assinar!', sent: false, delay: 3.4 },
];

export const insuranceMessages: ChatMessage[] = [
  { text: 'Preciso renovar meu seguro auto', sent: false, delay: 0.2 },
  { text: 'Encontrei sua apolice! Veiculo: Honda Civic 2023. Vou cotar as melhores opcoes pra voce.', sent: true, delay: 0.8 },
  { text: 'Quero cobertura completa', sent: false, delay: 1.6 },
  { text: 'Pronto! 3 opcoes:\n\n1. Basica: R$ 185/mes\n2. Completa: R$ 247/mes ⭐\n3. Premium: R$ 312/mes\n\nA opcao 2 cobre roubo, colisao e terceiros. Qual prefere?', sent: true, delay: 2.4 },
  { text: 'Vai de completa!', sent: false, delay: 3.4 },
];

export const pensionMessages: ChatMessage[] = [
  { text: 'Quero comecar a investir em previdencia', sent: false, delay: 0.2 },
  { text: 'Excelente decisao! Qual seu objetivo principal: aposentadoria, educacao dos filhos ou reserva de longo prazo?', sent: true, delay: 0.8 },
  { text: 'Aposentadoria, tenho 35 anos', sent: false, delay: 1.6 },
  { text: 'Perfeito! Para seu perfil recomendo:\n\nPlano PGBL Moderado\nAporte: R$ 500/mes\nProjecao em 30 anos: R$ 892.000\nBeneficio fiscal no IR: ate 12%\n\nAbro sua conta agora?', sent: true, delay: 2.4 },
  { text: 'Sim, quero comecar!', sent: false, delay: 3.4 },
];

interface WhatsAppChatPreviewProps {
  messages?: ChatMessage[];
  title?: string;
  triggerMode?: 'inView' | 'auto';
}

export function WhatsAppChatPreview({ messages = defaultMessages, title = 'Agente IA - Credito', triggerMode = 'inView' }: WhatsAppChatPreviewProps) {
  return (
    <Box
      maxW="360px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="2xl"
      bg="#0B141A"
    >
      {/* Header */}
      <Flex
        bg="#1F2C34"
        px={4}
        py={3}
        align="center"
        gap={3}
      >
        <Box w={8} h={8} borderRadius="full" bg="brand.500" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontSize="xs" fontWeight="bold">IA</Text>
        </Box>
        <Box>
          <Text color="white" fontSize="sm" fontWeight="600">{title}</Text>
          <Text color="whiteAlpha.600" fontSize="xs">online</Text>
        </Box>
      </Flex>

      {/* Messages */}
      <VStack
        spacing={2}
        p={3}
        minH="280px"
        align="stretch"
        bg="#0B141A"
        sx={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23p)'/%3E%3C/svg%3E\")" }}
      >
        {messages.map((msg, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            {...(triggerMode === 'auto'
              ? { animate: { opacity: 1, y: 0, scale: 1 } }
              : { whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true } }
            )}
            transition={{ delay: msg.delay, duration: 0.4 }}
            alignSelf={msg.sent ? 'flex-end' : 'flex-start'}
            maxW="85%"
          >
            <Box
              bg={msg.sent ? '#005C4B' : '#1F2C34'}
              color="white"
              px={3}
              py={2}
              borderRadius="lg"
              borderTopRightRadius={msg.sent ? '4px' : 'lg'}
              borderTopLeftRadius={msg.sent ? 'lg' : '4px'}
              fontSize="sm"
              whiteSpace="pre-line"
              lineHeight="1.5"
            >
              {msg.text}
              <Text as="span" fontSize="2xs" color="whiteAlpha.500" ml={2} float="right" mt={1}>
                {msg.time || `${9 + Math.floor(i / 2)}:${(10 + i * 3).toString().padStart(2, '0')}`}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </VStack>
    </Box>
  );
}
