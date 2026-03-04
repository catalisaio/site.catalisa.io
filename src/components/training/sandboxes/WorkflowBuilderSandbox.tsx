import { useState } from 'react';
import {
  Box, VStack, Text, HStack, Badge, Icon, Flex, SimpleGrid,
} from '@chakra-ui/react';
import { FiZap, FiMessageSquare, FiClock, FiCpu, FiPlus, FiX, FiGitBranch, FiUser } from 'react-icons/fi';
import { MotionBox } from '../../motion';

const palette = [
  { id: 'trigger-lead', label: 'Lead Criado', icon: FiZap, color: 'green', type: 'trigger' },
  { id: 'trigger-msg', label: 'Mensagem Recebida', icon: FiMessageSquare, color: 'green', type: 'trigger' },
  { id: 'action-msg', label: 'Enviar Mensagem', icon: FiMessageSquare, color: 'blue', type: 'action' },
  { id: 'action-delay', label: 'Aguardar', icon: FiClock, color: 'orange', type: 'action' },
  { id: 'action-agent', label: 'Agente IA', icon: FiCpu, color: 'pink', type: 'action' },
  { id: 'action-conditional', label: 'Condicional', icon: FiGitBranch, color: 'purple', type: 'action' },
  { id: 'action-update-lead', label: 'Atualizar Lead', icon: FiUser, color: 'teal', type: 'action' },
];

interface WorkflowNode {
  id: string;
  label: string;
  icon: React.ComponentType;
  color: string;
  type: string;
}

interface Props {
  validation?: { type: string; expected?: unknown };
  onValidate: (isValid: boolean) => void;
  showSolution: boolean;
  solution?: Record<string, unknown>;
}

export function WorkflowBuilderSandbox({ onValidate }: Props) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);

  const addNode = (item: typeof palette[0]) => {
    if (item.type === 'trigger' && nodes.some(n => n.type === 'trigger')) return;
    setNodes(prev => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  const hasTrigger = nodes.some(n => n.type === 'trigger');
  const hasActions = nodes.filter(n => n.type === 'action').length >= 2;
  const isValid = hasTrigger && hasActions;

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4} align="flex-start">
        {/* Palette */}
        <Box w="180px" flexShrink={0}>
          <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>Blocos Disponiveis</Text>
          <VStack spacing={1}>
            {palette.map(item => (
              <Flex
                key={item.id}
                w="full"
                p={2}
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                align="center"
                gap={2}
                cursor="pointer"
                _hover={{ bg: `${item.color}.50`, borderColor: `${item.color}.200` }}
                onClick={() => addNode(item)}
              >
                <Icon as={item.icon} color={`${item.color}.500`} boxSize={3} />
                <Text fontSize="2xs" color="gray.700">{item.label}</Text>
                <Icon as={FiPlus} color="gray.400" boxSize={2.5} ml="auto" />
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Canvas */}
        <Box flex={1} minH="200px" bg="white" border="2px dashed" borderColor="gray.200" borderRadius="lg" p={3}>
          {nodes.length === 0 ? (
            <Flex h="full" minH="180px" align="center" justify="center">
              <Text fontSize="xs" color="gray.400">Clique nos blocos para montar seu workflow</Text>
            </Flex>
          ) : (
            <VStack spacing={2} align="stretch">
              {nodes.map((node, i) => (
                <MotionBox
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {i > 0 && (
                    <Flex justify="center" my={1}>
                      <Box w="2px" h="16px" bg="gray.300" />
                    </Flex>
                  )}
                  <Flex
                    p={2}
                    bg={`${node.color}.50`}
                    border="1px solid"
                    borderColor={`${node.color}.200`}
                    borderRadius="md"
                    align="center"
                    gap={2}
                  >
                    <Icon as={node.icon} color={`${node.color}.500`} boxSize={3} />
                    <Text fontSize="xs" fontWeight="500" color="gray.700" flex={1}>{node.label}</Text>
                    <Badge colorScheme={node.color} fontSize="2xs">{node.type === 'trigger' ? 'Trigger' : 'Action'}</Badge>
                    <Icon
                      as={FiX}
                      color="gray.400"
                      boxSize={3}
                      cursor="pointer"
                      _hover={{ color: 'red.500' }}
                      onClick={() => removeNode(node.id)}
                    />
                  </Flex>
                </MotionBox>
              ))}
            </VStack>
          )}
        </Box>
      </HStack>

      {/* Status */}
      <SimpleGrid columns={2} spacing={2}>
        <Badge colorScheme={hasTrigger ? 'green' : 'gray'} textAlign="center" py={1}>
          {hasTrigger ? 'Trigger adicionado' : 'Falta trigger'}
        </Badge>
        <Badge colorScheme={hasActions ? 'green' : 'gray'} textAlign="center" py={1}>
          {hasActions ? `${nodes.filter(n => n.type === 'action').length} actions` : 'Faltam 2+ actions'}
        </Badge>
      </SimpleGrid>

      <Box textAlign="right">
        <Box
          as="button"
          px={3}
          py={1.5}
          bg={isValid ? 'purple.500' : 'gray.300'}
          color="white"
          borderRadius="md"
          fontSize="xs"
          fontWeight="600"
          onClick={() => onValidate(isValid)}
          cursor={isValid ? 'pointer' : 'not-allowed'}
        >
          Validar Workflow
        </Box>
      </Box>
    </VStack>
  );
}
