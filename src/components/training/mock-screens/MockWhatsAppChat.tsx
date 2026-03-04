import { Box, Flex, Text, HStack, Icon, Avatar, VStack, Input, IconButton } from '@chakra-ui/react';
import { FiSend, FiPaperclip, FiSmile, FiCheck } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import { PhoneMockup } from '../../shared/PhoneMockup';

const messages = [
  { text: 'Ola! Vi o anuncio de voces e gostaria de saber mais.', sent: false, time: '14:30' },
  { text: 'Ola Maria! Obrigado pelo interesse. Como posso ajudar?', sent: true, time: '14:31', status: 'read' },
  { text: 'Quais planos voces tem disponíveis?', sent: false, time: '14:32' },
  { text: 'Temos 3 planos: Starter, Pro e Enterprise. Qual se encaixa melhor?', sent: true, time: '14:33', status: 'read' },
  { text: 'O Pro parece interessante! Qual o preco?', sent: false, time: '14:35' },
];

interface Props {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
}

export function MockWhatsAppChat(_props: Props) {
  return (
    <Flex justify="center" py={4} bg="gray.100">
      <Box maxW="280px" w="full">
        <PhoneMockup variant="dark">
          <Box bg="#0B141A" minH="400px" display="flex" flexDirection="column">
            {/* WhatsApp Header */}
            <Flex bg="#1F2C34" px={3} py={2} align="center" gap={2}>
              <Avatar size="xs" name="Maria Silva" bg="gray.600" />
              <Box flex={1}>
                <Text fontSize="xs" color="white" fontWeight="600">Maria Silva</Text>
                <Text fontSize="2xs" color="gray.400">online</Text>
              </Box>
            </Flex>

            {/* Chat Background */}
            <VStack
              flex={1}
              p={2}
              spacing={1}
              align="stretch"
              bgImage="url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2210%22 cy=%2210%22 r=%220.5%22 fill=%22%23ffffff08%22/%3E%3C/svg%3E')"
            >
              {messages.map((msg, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  alignSelf={msg.sent ? 'flex-end' : 'flex-start'}
                  maxW="85%"
                >
                  <Box
                    px={2}
                    py={1.5}
                    borderRadius="lg"
                    bg={msg.sent ? '#005C4B' : '#1F2C34'}
                    borderTopRightRadius={msg.sent ? '2px' : undefined}
                    borderTopLeftRadius={!msg.sent ? '2px' : undefined}
                  >
                    <Text fontSize="2xs" color="white" lineHeight="1.4">
                      {msg.text}
                    </Text>
                    <HStack justify="flex-end" spacing={1} mt={0.5}>
                      <Text fontSize="8px" color="gray.400">{msg.time}</Text>
                      {msg.sent && (
                        <HStack spacing={-1}>
                          <Icon as={FiCheck} boxSize="8px" color={msg.status === 'read' ? '#53BDEB' : 'gray.400'} />
                          <Icon as={FiCheck} boxSize="8px" color={msg.status === 'read' ? '#53BDEB' : 'gray.400'} />
                        </HStack>
                      )}
                    </HStack>
                  </Box>
                </MotionBox>
              ))}
            </VStack>

            {/* Input Bar */}
            <Flex bg="#1F2C34" px={2} py={2} align="center" gap={1}>
              <IconButton aria-label="Emoji" icon={<FiSmile />} size="xs" variant="ghost" color="gray.400" />
              <IconButton aria-label="Anexo" icon={<FiPaperclip />} size="xs" variant="ghost" color="gray.400" />
              <Input
                size="xs"
                bg="#2A3942"
                border="none"
                borderRadius="full"
                color="white"
                placeholder="Mensagem"
                _placeholder={{ color: 'gray.500' }}
                flex={1}
              />
              <IconButton aria-label="Enviar" icon={<FiSend />} size="xs" borderRadius="full" bg="#00A884" color="white" />
            </Flex>
          </Box>
        </PhoneMockup>
      </Box>
    </Flex>
  );
}
