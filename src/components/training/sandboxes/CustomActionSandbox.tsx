import { useState, useMemo } from 'react';
import {
  Box, VStack, Text, Input, Select, Textarea, HStack,
  FormControl, FormLabel, Code, Badge,
} from '@chakra-ui/react';
import { useTrainingSandbox } from '../../../hooks/useTrainingSandbox';
import { validateSandbox, isValidUrl, isValidJson } from './validateSandbox';

interface ActionConfig {
  method: string;
  url: string;
  body: string;
  headerKey: string;
  headerValue: string;
}

const defaultConfig: ActionConfig = {
  method: 'POST',
  url: '',
  body: '',
  headerKey: 'Authorization',
  headerValue: '',
};

const sampleVars = {
  'trigger.payload.name': 'Maria Silva',
  'trigger.payload.phone': '+5511987654321',
  'config.apiKey': 'sk-demo-123',
};

interface Props {
  validation?: { type: string; expected?: unknown };
  onValidate: (isValid: boolean) => void;
  showSolution: boolean;
  solution?: Record<string, unknown>;
}

export function CustomActionSandbox({ validation, onValidate }: Props) {
  const { state, saveState } = useTrainingSandbox<ActionConfig>('custom-action', defaultConfig);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (field: keyof ActionConfig, value: string) => {
    saveState({ ...state, [field]: value });
  };

  const interpolated = useMemo(() => {
    let result = state.body;
    for (const [key, val] of Object.entries(sampleVars)) {
      result = result.replace(new RegExp(`\\{\\{${key.replace(/\./g, '\\.')}\\}\\}`, 'g'), val);
    }
    return result;
  }, [state.body]);

  const isValid = (() => {
    if (validation && validation.type !== 'custom') {
      return validateSandbox(validation, state);
    }
    return isValidUrl(state.url) && state.body.includes('{{') && isValidJson(state.body.replace(/\{\{[^}]+\}\}/g, '"placeholder"'));
  })();

  return (
    <VStack spacing={3} align="stretch">
      <HStack spacing={2}>
        <FormControl size="sm" w="100px">
          <FormLabel fontSize="xs" fontWeight="600">Metodo</FormLabel>
          <Select size="sm" value={state.method} onChange={e => handleChange('method', e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </Select>
        </FormControl>
        <FormControl size="sm" flex={1}>
          <FormLabel fontSize="xs" fontWeight="600">URL</FormLabel>
          <Input
            size="sm"
            placeholder="https://api.exemplo.com/leads"
            value={state.url}
            onChange={e => handleChange('url', e.target.value)}
          />
        </FormControl>
      </HStack>

      <HStack spacing={2}>
        <FormControl size="sm" flex={1}>
          <FormLabel fontSize="xs" fontWeight="600">Header Key</FormLabel>
          <Input size="sm" value={state.headerKey} onChange={e => handleChange('headerKey', e.target.value)} />
        </FormControl>
        <FormControl size="sm" flex={1}>
          <FormLabel fontSize="xs" fontWeight="600">Header Value</FormLabel>
          <Input
            size="sm"
            placeholder="Bearer {{config.apiKey}}"
            value={state.headerValue}
            onChange={e => handleChange('headerValue', e.target.value)}
          />
        </FormControl>
      </HStack>

      <FormControl size="sm">
        <FormLabel fontSize="xs" fontWeight="600">Body (JSON com variaveis)</FormLabel>
        <Textarea
          size="sm"
          fontSize="xs"
          fontFamily="mono"
          rows={4}
          placeholder={'{\n  "name": "{{trigger.payload.name}}",\n  "phone": "{{trigger.payload.phone}}"\n}'}
          value={state.body}
          onChange={e => handleChange('body', e.target.value)}
        />
        <Text fontSize="2xs" color="gray.500" mt={1}>
          Variaveis disponiveis: <Code fontSize="2xs">trigger.payload.name</Code>,{' '}
          <Code fontSize="2xs">trigger.payload.phone</Code>,{' '}
          <Code fontSize="2xs">config.apiKey</Code>
        </Text>
      </FormControl>

      {/* Preview */}
      {state.body && (
        <Box>
          <Text
            fontSize="xs"
            color="purple.500"
            cursor="pointer"
            onClick={() => setShowPreview(!showPreview)}
            _hover={{ textDecoration: 'underline' }}
          >
            {showPreview ? 'Esconder preview' : 'Ver preview interpolado'}
          </Text>
          {showPreview && (
            <Box bg="gray.800" p={3} borderRadius="md" mt={1}>
              <HStack mb={1}>
                <Badge colorScheme="blue" fontSize="2xs">{state.method}</Badge>
                <Text fontSize="2xs" color="gray.400">{state.url}</Text>
              </HStack>
              <Code fontSize="2xs" color="green.300" bg="transparent" whiteSpace="pre">
                {interpolated}
              </Code>
            </Box>
          )}
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
          Verificar Action
        </Box>
      </Box>
    </VStack>
  );
}
