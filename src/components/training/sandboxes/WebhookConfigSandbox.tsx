import {
  Box, VStack, Text, Input, Select, HStack, Badge,
  FormControl, FormLabel, Switch, Code, Button, Icon,
} from '@chakra-ui/react';
import { FiGlobe, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTrainingSandbox } from '../../../hooks/useTrainingSandbox';
import { validateSandbox, isValidUrl } from './validateSandbox';

interface WebhookConfig {
  url: string;
  method: string;
  events: string[];
  conditions: { field: string; operator: string; value: string }[];
  active: boolean;
}

const defaultConfig: WebhookConfig = {
  url: '',
  method: 'POST',
  events: [],
  conditions: [],
  active: true,
};

const availableEvents = [
  'LEAD_CREATED', 'LEAD_UPDATED', 'MESSAGE_RECEIVED',
  'MESSAGE_SENT', 'WORKFLOW_COMPLETED',
];

interface Props {
  validation?: { type: string; expected?: unknown };
  onValidate: (isValid: boolean) => void;
  showSolution: boolean;
  solution?: Record<string, unknown>;
}

export function WebhookConfigSandbox({ validation, onValidate }: Props) {
  const { state, saveState } = useTrainingSandbox<WebhookConfig>('webhook-config', defaultConfig);

  const toggleEvent = (event: string) => {
    const events = state.events.includes(event)
      ? state.events.filter(e => e !== event)
      : [...state.events, event];
    saveState({ ...state, events });
  };

  const addCondition = () => {
    saveState({
      ...state,
      conditions: [...state.conditions, { field: '', operator: 'equals', value: '' }],
    });
  };

  const updateCondition = (idx: number, field: string, value: string) => {
    const next = [...state.conditions];
    next[idx] = { ...next[idx], [field]: value };
    saveState({ ...state, conditions: next });
  };

  const removeCondition = (idx: number) => {
    saveState({ ...state, conditions: state.conditions.filter((_, i) => i !== idx) });
  };

  const isValid = (() => {
    if (validation && validation.type !== 'custom') {
      return validateSandbox(validation, state);
    }
    return isValidUrl(state.url) && state.events.length > 0;
  })();

  return (
    <VStack spacing={3} align="stretch">
      <HStack spacing={2}>
        <FormControl size="sm" flex={1}>
          <FormLabel fontSize="xs" fontWeight="600">
            <HStack spacing={1}>
              <Icon as={FiGlobe} color="blue.500" />
              <Text>URL do Webhook</Text>
            </HStack>
          </FormLabel>
          <Input
            size="sm"
            placeholder="https://seu-servico.com/webhook"
            value={state.url}
            onChange={e => saveState({ ...state, url: e.target.value })}
          />
        </FormControl>
        <FormControl size="sm" w="100px">
          <FormLabel fontSize="xs" fontWeight="600">Metodo</FormLabel>
          <Select size="sm" value={state.method} onChange={e => saveState({ ...state, method: e.target.value })}>
            <option>POST</option>
            <option>PUT</option>
          </Select>
        </FormControl>
      </HStack>

      {/* Events */}
      <FormControl size="sm">
        <FormLabel fontSize="xs" fontWeight="600">Eventos (selecione pelo menos 1)</FormLabel>
        <HStack wrap="wrap" spacing={1}>
          {availableEvents.map(event => (
            <Badge
              key={event}
              fontSize="2xs"
              px={2}
              py={1}
              borderRadius="full"
              cursor="pointer"
              colorScheme={state.events.includes(event) ? 'purple' : 'gray'}
              variant={state.events.includes(event) ? 'solid' : 'outline'}
              onClick={() => toggleEvent(event)}
              _hover={{ opacity: 0.8 }}
            >
              {event}
            </Badge>
          ))}
        </HStack>
      </FormControl>

      {/* Conditions */}
      <Box>
        <HStack justify="space-between" mb={1}>
          <Text fontSize="xs" fontWeight="600" color="gray.600">Conditions (opcional)</Text>
          <Button size="xs" leftIcon={<FiPlus />} variant="ghost" onClick={addCondition}>
            Adicionar
          </Button>
        </HStack>
        <VStack spacing={1}>
          {state.conditions.map((c, i) => (
            <HStack key={i} w="full">
              <Input size="xs" placeholder="campo" value={c.field} onChange={e => updateCondition(i, 'field', e.target.value)} />
              <Select size="xs" w="90px" value={c.operator} onChange={e => updateCondition(i, 'operator', e.target.value)}>
                <option value="equals">igual</option>
                <option value="contains">contem</option>
                <option value="not_equals">diferente</option>
              </Select>
              <Input size="xs" placeholder="valor" value={c.value} onChange={e => updateCondition(i, 'value', e.target.value)} />
              <Icon as={FiTrash2} color="red.400" boxSize={3} cursor="pointer" onClick={() => removeCondition(i)} />
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Active Toggle */}
      <HStack justify="space-between">
        <Text fontSize="xs" color="gray.600">Webhook ativo</Text>
        <Switch size="sm" colorScheme="purple" isChecked={state.active}
          onChange={e => saveState({ ...state, active: e.target.checked })} />
      </HStack>

      {/* Preview */}
      {state.url && (
        <Box bg="gray.800" p={3} borderRadius="md">
          <Text fontSize="2xs" color="gray.400" mb={1}>Payload de exemplo:</Text>
          <Code fontSize="2xs" color="green.300" bg="transparent" whiteSpace="pre">
{`{
  "event": "${state.events[0] || 'EVENT_TYPE'}",
  "timestamp": "${new Date().toISOString()}",
  "data": { "leadId": "lead_123", "name": "Maria Silva" }
}`}
          </Code>
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
          Verificar Webhook
        </Box>
      </Box>
    </VStack>
  );
}
