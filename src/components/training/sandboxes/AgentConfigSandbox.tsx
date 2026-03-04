import { useState } from 'react';
import {
  Box, VStack, Text, Input, Textarea, Select, HStack, Badge,
  FormControl, FormLabel, Icon,
} from '@chakra-ui/react';
import { FiCpu } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import { useTrainingSandbox } from '../../../hooks/useTrainingSandbox';

interface AgentConfig {
  name: string;
  systemPrompt: string;
  model: string;
  tone: string;
}

const defaultConfig: AgentConfig = {
  name: '',
  systemPrompt: '',
  model: 'haiku',
  tone: 'profissional',
};

const simulatedResponses: Record<string, string> = {
  profissional: 'Prezado(a), encontrei as informacoes solicitadas. O lead Maria Silva esta no status "Qualificado" com score 85. Deseja que eu prossiga com o agendamento?',
  amigavel: 'Opa! Achei aqui - a Maria Silva ta com score 85 e ja foi qualificada! Quer que eu marque uma reuniao pra voce?',
  formal: 'Conforme solicitado, informo que o cadastro referente a Maria Silva encontra-se com status "Qualificado", pontuacao 85. Solicito orientacoes quanto aos proximos passos.',
};

interface Props {
  validation?: { type: string; expected?: unknown };
  onValidate: (isValid: boolean) => void;
  showSolution: boolean;
  solution?: Record<string, unknown>;
}

export function AgentConfigSandbox({ onValidate }: Props) {
  const { state, saveState } = useTrainingSandbox<AgentConfig>('agent-config', defaultConfig);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field: keyof AgentConfig, value: string) => {
    saveState({ ...state, [field]: value });
  };

  const isComplete = state.name.length >= 3 && state.systemPrompt.length >= 20;

  const handleValidate = () => {
    onValidate(isComplete);
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={3}>
        {/* Config Form */}
        <VStack flex={1} spacing={3} align="stretch">
          <FormControl size="sm">
            <FormLabel fontSize="xs" fontWeight="600">Nome do Agente</FormLabel>
            <Input
              size="sm"
              placeholder="Ex: Assistente de Vendas"
              value={state.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </FormControl>

          <FormControl size="sm">
            <FormLabel fontSize="xs" fontWeight="600">Prompt do Sistema</FormLabel>
            <Textarea
              size="sm"
              fontSize="xs"
              rows={4}
              placeholder="Voce e um assistente especializado em vendas. Sempre seja cordial e ajude o usuario a..."
              value={state.systemPrompt}
              onChange={e => handleChange('systemPrompt', e.target.value)}
            />
            <Text fontSize="2xs" color={state.systemPrompt.length >= 20 ? 'green.500' : 'gray.400'} mt={0.5}>
              {state.systemPrompt.length}/20 caracteres minimos
            </Text>
          </FormControl>

          <HStack spacing={2}>
            <FormControl size="sm" flex={1}>
              <FormLabel fontSize="xs" fontWeight="600">Modelo</FormLabel>
              <Select size="sm" value={state.model} onChange={e => handleChange('model', e.target.value)}>
                <option value="haiku">Haiku (Rapido)</option>
                <option value="sonnet">Sonnet (Equilibrado)</option>
              </Select>
            </FormControl>
            <FormControl size="sm" flex={1}>
              <FormLabel fontSize="xs" fontWeight="600">Tom</FormLabel>
              <Select size="sm" value={state.tone} onChange={e => handleChange('tone', e.target.value)}>
                <option value="profissional">Profissional</option>
                <option value="amigavel">Amigavel</option>
                <option value="formal">Formal</option>
              </Select>
            </FormControl>
          </HStack>
        </VStack>

        {/* Live Preview */}
        <Box flex={1} bg="gray.50" borderRadius="lg" p={3} border="1px solid" borderColor="gray.200" minH="200px">
          <HStack spacing={1} mb={2}>
            <Icon as={FiCpu} color="purple.500" boxSize={3} />
            <Text fontSize="xs" fontWeight="600" color="gray.600">Preview do Agente</Text>
          </HStack>

          {state.name ? (
            <VStack align="stretch" spacing={2}>
              <HStack>
                <Badge colorScheme="purple" fontSize="2xs">{state.name}</Badge>
                <Badge colorScheme="gray" fontSize="2xs">{state.model}</Badge>
              </HStack>
              {showPreview && (
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  bg="white"
                  p={2}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontSize="2xs" color="gray.500" mb={1}>Exemplo de resposta ({state.tone}):</Text>
                  <Text fontSize="xs" color="gray.700" lineHeight="tall">
                    {simulatedResponses[state.tone] || simulatedResponses.profissional}
                  </Text>
                </MotionBox>
              )}
              {!showPreview && (
                <Box
                  as="button"
                  fontSize="xs"
                  color="purple.500"
                  onClick={() => setShowPreview(true)}
                  textAlign="left"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Simular resposta...
                </Box>
              )}
            </VStack>
          ) : (
            <Text fontSize="xs" color="gray.400">Preencha o formulario para ver o preview</Text>
          )}
        </Box>
      </HStack>

      <Box textAlign="right">
        <Box
          as="button"
          px={3}
          py={1.5}
          bg={isComplete ? 'purple.500' : 'gray.300'}
          color="white"
          borderRadius="md"
          fontSize="xs"
          fontWeight="600"
          onClick={handleValidate}
          cursor={isComplete ? 'pointer' : 'not-allowed'}
          _hover={isComplete ? { bg: 'purple.600' } : undefined}
        >
          Verificar Configuracao
        </Box>
      </Box>
    </VStack>
  );
}
