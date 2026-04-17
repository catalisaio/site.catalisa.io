import { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, Input, IconButton, VStack, HStack, Icon, Badge } from '@chakra-ui/react';
import { FiSend, FiZap, FiX } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import { hp, type MockScreenProps } from './highlightUtils';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
  toolCalls?: { name: string; status: string }[];
}

const demoConversation: ChatMessage[] = [
  { role: 'assistant', text: 'Ola! Sou o Assistente IA Catalisa. Posso ajudar com leads, workflows, agentes e muito mais. O que precisa?' },
  {
    role: 'assistant',
    text: 'Encontrei 3 leads novos hoje:\n- Maria Silva (Cliente)\n- Pedro Lima (Lead)\n- Camila Souza (Lead)',
    toolCalls: [{ name: 'listar_leads', status: 'success' }],
  },
];

export function MockAIAssistant({ activeStepId, onStepAction }: MockScreenProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState(demoConversation.slice(0, 1));
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim() || typing) return;
    setMessages(prev => [...prev, { role: 'user' as const, text: input } as ChatMessage]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, demoConversation[1]]);
      setTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <Flex justify="center" align="center" minH="300px" bg="gray.50">
        <MotionBox
          as="button"
          onClick={() => { setIsOpen(true); onStepAction?.(); }}
          bg="purple.500"
          color="white"
          borderRadius="full"
          p={4}
          cursor="pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          boxShadow="lg"
          {...hp(activeStepId, 'btn-open-assistant', onStepAction)}
        >
          <Icon as={FiZap} boxSize={5} />
        </MotionBox>
      </Flex>
    );
  }

  return (
    <Box bg="gray.50" minH="300px" display="flex" justifyContent="flex-end" p={3}>
      <Box
        w="300px"
        bg="white"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="xl"
        display="flex"
        flexDirection="column"
        maxH="350px"
      >
        {/* Header */}
        <Flex px={3} py={2} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
          <HStack spacing={2}>
            <Icon as={FiZap} color="purple.500" />
            <Text fontSize="xs" fontWeight="700">Assistente IA</Text>
            <Badge colorScheme="green" fontSize="2xs">Online</Badge>
          </HStack>
          <IconButton
            aria-label="Fechar"
            icon={<FiX />}
            size="xs"
            variant="ghost"
            onClick={() => setIsOpen(false)}
          />
        </Flex>

        {/* Messages */}
        <VStack flex={1} overflowY="auto" p={2} spacing={2} align="stretch"
          {...hp(activeStepId, 'assistant-chat-area', onStepAction)}
        >
          {messages.map((msg, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="90%"
            >
              {'toolCalls' in msg && msg.toolCalls && (
                <HStack spacing={1} mb={1}>
                  {msg.toolCalls.map((tool, j) => (
                    <Badge key={j} colorScheme="green" fontSize="2xs" variant="subtle">
                      {tool.name}
                    </Badge>
                  ))}
                </HStack>
              )}
              <Box
                px={2.5}
                py={1.5}
                borderRadius="lg"
                bg={msg.role === 'user' ? 'purple.500' : 'gray.50'}
                color={msg.role === 'user' ? 'white' : 'gray.700'}
                fontSize="xs"
                whiteSpace="pre-line"
              >
                {msg.text}
              </Box>
            </MotionBox>
          ))}
          {typing && (
            <HStack spacing={1} p={2}>
              {[0, 1, 2].map(i => (
                <MotionBox
                  key={i}
                  w="5px" h="5px" borderRadius="full" bg="purple.300"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </HStack>
          )}
          <div ref={bottomRef} />
        </VStack>

        {/* Input */}
        <Flex p={2} borderTop="1px solid" borderColor="gray.100" gap={1}>
          <Input
            size="xs"
            placeholder="Pergunte algo..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            borderRadius="md"
            {...hp(activeStepId, 'assistant-input', onStepAction)}
          />
          <IconButton
            aria-label="Enviar"
            icon={<FiSend />}
            size="xs"
            colorScheme="purple"
            onClick={handleSend}
            isDisabled={typing}
          />
        </Flex>
      </Box>
    </Box>
  );
}
