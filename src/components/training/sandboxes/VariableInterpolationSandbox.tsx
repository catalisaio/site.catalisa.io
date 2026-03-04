import { useMemo } from 'react';
import { Box, Flex, Text, Input, VStack, HStack, Code, Badge } from '@chakra-ui/react';
import { useTrainingSandbox } from '../../../hooks/useTrainingSandbox';

const sampleData = {
  trigger: {
    payload: { name: 'Maria Silva', phone: '+5511987654321', email: 'maria@email.com' },
    type: 'LEAD_CREATED',
  },
  actions: {
    createLead: { output: { id: 'lead_123', status: 'novo' } },
  },
  lead: { name: 'Maria Silva', type: 'CLIENTE', score: 85 },
};

interface Props {
  validation?: { type: string; expected?: unknown };
  onValidate: (isValid: boolean) => void;
  showSolution: boolean;
  solution?: Record<string, unknown>;
}

export function VariableInterpolationSandbox({ onValidate, showSolution }: Props) {
  const { state, saveState } = useTrainingSandbox<{ expressions: string[] }>(
    'variable-interpolation',
    { expressions: ['', '', ''] },
  );

  const tasks = [
    { label: 'Nome do lead', expected: 'Maria Silva', hint: 'trigger.payload.name' },
    { label: 'Telefone do lead', expected: '+5511987654321', hint: 'trigger.payload.phone' },
    { label: 'ID do lead criado', expected: 'lead_123', hint: 'actions.createLead.output.id' },
  ];

  const results = useMemo(() => {
    return state.expressions.map(expr => {
      if (!expr) return '';
      try {
        const parts = expr.replace(/\{\{|\}\}/g, '').trim().split('.');
        let val: unknown = sampleData;
        for (const p of parts) {
          val = (val as Record<string, unknown>)?.[p];
        }
        return val !== undefined ? String(val) : '(nao encontrado)';
      } catch {
        return '(erro)';
      }
    });
  }, [state.expressions]);

  const handleChange = (idx: number, value: string) => {
    const next = [...state.expressions];
    next[idx] = value;
    saveState({ expressions: next });
  };

  const handleValidate = () => {
    const allCorrect = tasks.every((task, i) => results[i] === task.expected);
    onValidate(allCorrect);
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Sample Data */}
      <Box>
        <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>Dados disponiveis:</Text>
        <Box bg="gray.800" p={3} borderRadius="md" overflowX="auto">
          <Code fontSize="2xs" color="green.300" bg="transparent" whiteSpace="pre">
            {JSON.stringify(sampleData, null, 2)}
          </Code>
        </Box>
      </Box>

      {/* Tasks */}
      <VStack spacing={2} align="stretch">
        {tasks.map((task, i) => (
          <Box key={i} p={3} border="1px solid" borderColor="gray.200" borderRadius="md">
            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={1}>
              {task.label}:
            </Text>
            <Flex gap={2} align="center">
              <HStack flex={1} spacing={0}>
                <Text fontSize="xs" color="gray.500">{'{{'}  </Text>
                <Input
                  size="sm"
                  fontSize="xs"
                  fontFamily="mono"
                  placeholder="caminho.do.dado"
                  value={state.expressions[i]}
                  onChange={e => handleChange(i, e.target.value)}
                />
                <Text fontSize="xs" color="gray.500">  {'}}'}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.400">=</Text>
              <Badge
                colorScheme={results[i] === task.expected ? 'green' : results[i] ? 'orange' : 'gray'}
                fontSize="xs"
                minW="100px"
                textAlign="center"
              >
                {results[i] || '...'}
              </Badge>
            </Flex>
            {showSolution && (
              <Text fontSize="2xs" color="purple.500" mt={1}>
                Solucao: <Code fontSize="2xs">{task.hint}</Code>
              </Text>
            )}
          </Box>
        ))}
      </VStack>

      <Box textAlign="right">
        <Box
          as="button"
          px={3}
          py={1.5}
          bg="purple.500"
          color="white"
          borderRadius="md"
          fontSize="xs"
          fontWeight="600"
          onClick={handleValidate}
          _hover={{ bg: 'purple.600' }}
        >
          Verificar
        </Box>
      </Box>
    </VStack>
  );
}
