import {
  Box, VStack, Text, Select, Input, HStack, Badge,
  FormControl, FormLabel, Icon, Flex, Button,
} from '@chakra-ui/react';
import { FiZap, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTrainingSandbox } from '../../../hooks/useTrainingSandbox';
import { validateSandbox } from './validateSandbox';

interface TriggerConfig {
  type: string;
  filters: { field: string; operator: string; value: string }[];
}

const defaultConfig: TriggerConfig = {
  type: '',
  filters: [],
};

const triggerTypes = [
  { value: 'LEAD_CREATED', label: 'Lead Criado' },
  { value: 'LEAD_UPDATED', label: 'Lead Atualizado' },
  { value: 'MESSAGE_RECEIVED', label: 'Mensagem Recebida' },
  { value: 'WEBHOOK_RECEIVED', label: 'Webhook Recebido' },
];

const fields = ['lead.type', 'lead.status', 'message.text', 'lead.score'];
const operators = ['equals', 'contains', 'greater_than', 'not_equals'];

interface Props {
  validation?: { type: string; expected?: unknown };
  onValidate: (isValid: boolean) => void;
  showSolution: boolean;
  solution?: Record<string, unknown>;
}

export function TriggerConfigSandbox({ validation, onValidate }: Props) {
  const { state, saveState } = useTrainingSandbox<TriggerConfig>('trigger-config', defaultConfig);

  const handleTypeChange = (type: string) => {
    saveState({ ...state, type });
  };

  const addFilter = () => {
    saveState({
      ...state,
      filters: [...state.filters, { field: '', operator: 'equals', value: '' }],
    });
  };

  const updateFilter = (idx: number, field: string, value: string) => {
    const next = [...state.filters];
    next[idx] = { ...next[idx], [field]: value };
    saveState({ ...state, filters: next });
  };

  const removeFilter = (idx: number) => {
    saveState({ ...state, filters: state.filters.filter((_, i) => i !== idx) });
  };

  const isValid = (() => {
    if (validation && validation.type !== 'custom') {
      return validateSandbox(validation, state);
    }
    return state.type !== '' && state.filters.length > 0 &&
      state.filters.every(f => f.field && f.operator && f.value);
  })();

  return (
    <VStack spacing={3} align="stretch">
      {/* Trigger Type */}
      <FormControl size="sm">
        <FormLabel fontSize="xs" fontWeight="600">
          <HStack spacing={1}>
            <Icon as={FiZap} color="green.500" />
            <Text>Tipo de Trigger</Text>
          </HStack>
        </FormLabel>
        <Select
          size="sm"
          placeholder="Selecione o trigger..."
          value={state.type}
          onChange={e => handleTypeChange(e.target.value)}
        >
          {triggerTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
      </FormControl>

      {/* Filters */}
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize="xs" fontWeight="600" color="gray.600">Filtros (conditions)</Text>
          <Button size="xs" leftIcon={<FiPlus />} variant="outline" onClick={addFilter}>
            Adicionar Filtro
          </Button>
        </Flex>

        <VStack spacing={2} align="stretch">
          {state.filters.map((filter, i) => (
            <HStack key={i} p={2} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Select size="xs" w="130px" value={filter.field} onChange={e => updateFilter(i, 'field', e.target.value)}>
                <option value="">Campo...</option>
                {fields.map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
              <Select size="xs" w="110px" value={filter.operator} onChange={e => updateFilter(i, 'operator', e.target.value)}>
                {operators.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
              <Input size="xs" flex={1} placeholder="Valor" value={filter.value} onChange={e => updateFilter(i, 'value', e.target.value)} />
              <Icon as={FiTrash2} color="red.400" boxSize={3} cursor="pointer" onClick={() => removeFilter(i)} />
            </HStack>
          ))}
          {state.filters.length === 0 && (
            <Text fontSize="xs" color="gray.400" textAlign="center" py={2}>
              Adicione pelo menos um filtro
            </Text>
          )}
        </VStack>
      </Box>

      {/* Preview */}
      {state.type && (
        <Box bg="gray.50" p={3} borderRadius="md">
          <Text fontSize="2xs" color="gray.500" mb={1}>Preview:</Text>
          <Text fontSize="xs" fontFamily="mono" color="gray.700">
            Quando <Badge colorScheme="green" fontSize="2xs">{state.type}</Badge>
            {state.filters.map((f, i) => (
              <Text as="span" key={i}>
                {i === 0 ? ' onde ' : ' e '}
                <Badge colorScheme="blue" fontSize="2xs">{f.field}</Badge>
                {' '}{f.operator}{' '}
                <Badge colorScheme="orange" fontSize="2xs">{f.value || '...'}</Badge>
              </Text>
            ))}
          </Text>
        </Box>
      )}

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
          Verificar Trigger
        </Box>
      </Box>
    </VStack>
  );
}
