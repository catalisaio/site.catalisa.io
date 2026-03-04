import { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Text, Input, IconButton, VStack, HStack, Avatar, Icon, Badge,
} from '@chakra-ui/react';
import { FiSend, FiCpu } from 'react-icons/fi';
import { MotionBox } from '../../motion';

const scriptedResponses = [
  {
    user: 'Qual lead tem mais mensagens?',
    agent: 'Analisando seus leads... O lead **Fernanda Dias** possui 12 mensagens trocadas, sendo o mais ativo no momento.',
    tools: ['buscar_leads', 'contar_mensagens'],
  },
  {
    user: 'Envie uma mensagem para ela',
    agent: 'Mensagem enviada com sucesso para Fernanda Dias (+55 41 95432-1098)! Deseja que eu acompanhe a resposta?',
    tools: ['enviar_mensagem_whatsapp'],
  },
];

interface Props {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
}

export function MockAgentChat({ activeStepId }: Props) {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string; tools?: string[] }[]>([
    { role: 'agent', text: 'Ola! Sou seu Assistente de Vendas. Como posso ajudar?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [scriptIdx, setScriptIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim() || typing) return;

    const script = scriptedResponses[scriptIdx];
    const userMsg = script ? script.user : input;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);

    // Simulate tool calls then response
    setTimeout(() => {
      if (script) {
        setMessages(prev => [...prev, {
          role: 'agent',
          text: script.agent,
          tools: script.tools,
        }]);
        setScriptIdx(prev => prev + 1);
      } else {
        setMessages(prev => [...prev, {
          role: 'agent',
          text: 'Entendi! Vou verificar isso para voce.',
        }]);
      }
      setTyping(false);
    }, 1500);
  };

  return (
    <Box bg="gray.50" minH="300px" maxH="400px" display="flex" flexDirection="column">
      {/* Header */}
      <Flex
        px={4}
        py={2}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        gap={2}
      >
        <Avatar size="xs" bg="purple.100" icon={<Icon as={FiCpu} color="purple.600" />} />
        <Box>
          <Text fontSize="xs" fontWeight="700">Assistente de Vendas</Text>
          <HStack spacing={1}>
            <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
            <Text fontSize="2xs" color="gray.500">Online</Text>
          </HStack>
        </Box>
      </Flex>

      {/* Messages */}
      <VStack flex={1} overflowY="auto" p={3} spacing={2} align="stretch">
        {messages.map((msg, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
            maxW="80%"
          >
            {msg.tools && (
              <HStack spacing={1} mb={1}>
                {msg.tools.map((tool, j) => (
                  <Badge key={j} colorScheme="purple" fontSize="2xs" variant="subtle">
                    {tool}
                  </Badge>
                ))}
              </HStack>
            )}
            <Box
              px={3}
              py={2}
              borderRadius="lg"
              bg={msg.role === 'user' ? 'purple.500' : 'white'}
              color={msg.role === 'user' ? 'white' : 'gray.700'}
              border={msg.role === 'agent' ? '1px solid' : undefined}
              borderColor="gray.200"
              fontSize="xs"
            >
              {msg.text}
            </Box>
          </MotionBox>
        ))}
        {typing && (
          <Box alignSelf="flex-start" px={3} py={2} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <HStack spacing={1}>
              {[0, 1, 2].map(i => (
                <MotionBox
                  key={i}
                  w="6px"
                  h="6px"
                  borderRadius="full"
                  bg="purple.300"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </HStack>
          </Box>
        )}
        <div ref={bottomRef} />
      </VStack>

      {/* Input */}
      <Flex p={3} bg="white" borderTop="1px solid" borderColor="gray.200" gap={2}>
        <Input
          size="sm"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          id="agent-chat-input"
          boxShadow={activeStepId === 'agent-chat-input' ? '0 0 0 3px rgba(115,75,156,0.4)' : undefined}
        />
        <IconButton
          aria-label="Enviar"
          icon={<FiSend />}
          size="sm"
          colorScheme="purple"
          onClick={handleSend}
          isDisabled={typing}
        />
      </Flex>
    </Box>
  );
}
