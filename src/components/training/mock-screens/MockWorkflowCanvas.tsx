import { useState } from 'react';
import { Box, Flex, Text, VStack, HStack, Icon, Badge, Button } from '@chakra-ui/react';
import { FiZap, FiMessageSquare, FiClock, FiGitBranch, FiCpu, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const nodes = [
  { id: 'trigger', label: 'Lead Criado', icon: FiZap, color: '#38A169', x: 80, y: 30, type: 'Trigger' },
  { id: 'send-msg', label: 'Enviar Mensagem', icon: FiMessageSquare, color: '#3182CE', x: 280, y: 30, type: 'Action' },
  { id: 'delay', label: 'Aguardar 1h', icon: FiClock, color: '#DD6B20', x: 480, y: 30, type: 'Action' },
  { id: 'conditional', label: 'Respondeu?', icon: FiGitBranch, color: '#805AD5', x: 380, y: 150, type: 'Condition' },
  { id: 'agent', label: 'Agente IA', icon: FiCpu, color: '#D53F8C', x: 580, y: 150, type: 'Action' },
];

const edges = [
  { from: 'trigger', to: 'send-msg' },
  { from: 'send-msg', to: 'delay' },
  { from: 'delay', to: 'conditional' },
  { from: 'conditional', to: 'agent', label: 'Sim' },
];

interface Props {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
}

export function MockWorkflowCanvas({ activeStepId }: Props) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <Box bg="gray.50" minH="300px" position="relative">
      {/* Toolbar */}
      <Flex
        px={3}
        py={2}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <HStack spacing={2}>
          <Text fontSize="xs" fontWeight="700" color="gray.800">Meu Primeiro Workflow</Text>
          <Badge colorScheme="green" fontSize="2xs">Ativo</Badge>
        </HStack>
        <HStack spacing={1}>
          <Button size="xs" leftIcon={<FiPlus />} variant="outline" colorScheme="purple"
            id="btn-add-action"
            boxShadow={activeStepId === 'btn-add-action' ? '0 0 0 3px rgba(115,75,156,0.4)' : undefined}
          >
            Adicionar
          </Button>
          <Button size="xs" colorScheme="purple">Salvar</Button>
        </HStack>
      </Flex>

      {/* Canvas */}
      <Box p={2} minH="250px">
        <svg viewBox="0 0 750 280" width="100%" style={{ display: 'block' }}>
          {/* Grid dots */}
          <defs>
            <pattern id="mock-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.8" fill="#E2E8F0" />
            </pattern>
          </defs>
          <rect width="750" height="280" fill="url(#mock-grid)" />

          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from)!;
            const to = nodes.find(n => n.id === edge.to)!;
            const fx = from.x + 80;
            const fy = from.y + 22;
            const tx = to.x;
            const ty = to.y + 22;

            return (
              <g key={`e-${i}`}>
                <motion.path
                  d={`M ${fx} ${fy} C ${(fx + tx) / 2} ${fy}, ${(fx + tx) / 2} ${ty}, ${tx} ${ty}`}
                  fill="none"
                  stroke="#A0AEC0"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                />
                {edge.label && (
                  <text
                    x={(fx + tx) / 2}
                    y={Math.min(fy, ty) + (Math.abs(ty - fy) / 2) - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#718096"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              style={{ transformOrigin: `${node.x + 40}px ${node.y + 22}px`, cursor: 'pointer' }}
              onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
            >
              <rect
                x={node.x}
                y={node.y}
                width="160"
                height="44"
                rx="8"
                fill={selectedNode === node.id ? '#F9F5FF' : 'white'}
                stroke={selectedNode === node.id ? '#734B9C' : '#E2E8F0'}
                strokeWidth={selectedNode === node.id ? '2' : '1'}
              />
              <foreignObject x={node.x + 10} y={node.y + 13} width="16" height="16">
                <Icon as={node.icon} color={node.color} boxSize="16px" />
              </foreignObject>
              <text x={node.x + 32} y={node.y + 26} fontSize="11" fontWeight="600" fill="#2D3748">
                {node.label}
              </text>
              <text x={node.x + 150} y={node.y + 12} fontSize="8" fill="#A0AEC0" textAnchor="end">
                {node.type}
              </text>
            </motion.g>
          ))}
        </svg>
      </Box>

      {/* Side panel hint */}
      {selectedNode && (
        <Box
          position="absolute"
          right={0}
          top="40px"
          w="180px"
          bg="white"
          borderLeft="1px solid"
          borderColor="gray.200"
          p={3}
          h="calc(100% - 40px)"
        >
          <Text fontSize="xs" fontWeight="700" color="gray.800" mb={2}>Propriedades</Text>
          <VStack spacing={2} align="stretch">
            <Box>
              <Text fontSize="2xs" color="gray.500">Nome</Text>
              <Text fontSize="xs" fontWeight="500">
                {nodes.find(n => n.id === selectedNode)?.label}
              </Text>
            </Box>
            <Box>
              <Text fontSize="2xs" color="gray.500">Tipo</Text>
              <Text fontSize="xs" fontWeight="500">
                {nodes.find(n => n.id === selectedNode)?.type}
              </Text>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
