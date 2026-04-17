import { useState } from 'react';
import {
  Box, Flex, Text, Input, Select, Textarea, VStack,
  FormControl, FormLabel, HStack, Badge, Button, Icon, Code, IconButton,
} from '@chakra-ui/react';
import { FiGlobe, FiPlus, FiTrash2 } from 'react-icons/fi';
import { hp, type MockScreenProps } from './highlightUtils';

export function MockCustomActionForm({ activeStepId, onStepAction }: MockScreenProps) {
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer {{config.apiKey}}' },
  ]);

  return (
    <Box p={4} bg="gray.50" minH="300px">
      <Flex align="center" gap={2} mb={4}>
        <Icon as={FiGlobe} color="purple.500" />
        <Text fontSize="md" fontWeight="700" color="gray.800">Nova Custom Action</Text>
        <Badge colorScheme="blue" fontSize="2xs" ml={2}>REST API</Badge>
      </Flex>

      <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" p={4}>
        <VStack spacing={3} align="stretch">
          <FormControl size="sm">
            <FormLabel fontSize="xs" fontWeight="600">Nome</FormLabel>
            <Input size="sm" placeholder="Ex: Consultar CRM Externo" {...hp(activeStepId, 'action-name', onStepAction)} />
          </FormControl>

          <FormControl size="sm">
            <FormLabel fontSize="xs" fontWeight="600">Tipo</FormLabel>
            <Select size="sm" defaultValue="HTTP_WEBHOOK" {...hp(activeStepId, 'action-type-select', onStepAction)}>
              <option value="HTTP_WEBHOOK">HTTP Webhook</option>
              <option value="JAVASCRIPT">JavaScript</option>
              <option value="AI_AGENT">AI Agent</option>
            </Select>
          </FormControl>

          {/* Method + URL */}
          <FormControl size="sm">
            <FormLabel fontSize="xs" fontWeight="600">Endpoint</FormLabel>
            <HStack>
              <Select
                size="sm"
                w="100px"
                value={method}
                onChange={e => setMethod(e.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </Select>
              <Input size="sm" placeholder="https://api.exemplo.com/endpoint" flex={1}
                {...hp(activeStepId, 'http-url-field', onStepAction)}
              />
            </HStack>
          </FormControl>

          {/* Headers */}
          <FormControl size="sm">
            <Flex justify="space-between" align="center" mb={1}>
              <FormLabel fontSize="xs" fontWeight="600" mb={0}>Headers</FormLabel>
              <Button size="xs" variant="ghost" leftIcon={<FiPlus />}
                onClick={() => setHeaders(prev => [...prev, { key: '', value: '' }])}
              >
                Adicionar
              </Button>
            </Flex>
            <VStack spacing={1} {...hp(activeStepId, 'input-schema-editor', onStepAction)}>
              {headers.map((h, i) => (
                <HStack key={i} w="full">
                  <Input size="sm" placeholder="Key" value={h.key}
                    onChange={e => {
                      const next = [...headers];
                      next[i] = { ...next[i], key: e.target.value };
                      setHeaders(next);
                    }}
                  />
                  <Input size="sm" placeholder="Value" value={h.value}
                    onChange={e => {
                      const next = [...headers];
                      next[i] = { ...next[i], value: e.target.value };
                      setHeaders(next);
                    }}
                  />
                  <IconButton
                    as="div"
                    aria-label="Remover"
                    icon={<FiTrash2 />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    cursor="pointer"
                    onClick={() => setHeaders(prev => prev.filter((_, j) => j !== i))}
                  />
                </HStack>
              ))}
            </VStack>
          </FormControl>

          {/* Body */}
          {(method === 'POST' || method === 'PUT') && (
            <FormControl size="sm">
              <FormLabel fontSize="xs" fontWeight="600">Body (JSON)</FormLabel>
              <Textarea
                size="sm"
                fontFamily="mono"
                fontSize="xs"
                rows={4}
                placeholder={'{\n  "name": "{{trigger.payload.name}}",\n  "phone": "{{trigger.payload.phone}}"\n}'}
              />
              <Text fontSize="2xs" color="gray.500" mt={1}>
                Use <Code fontSize="2xs">{'{{variavel}}'}</Code> para interpolacao
              </Text>
            </FormControl>
          )}

          {/* Test Button */}
          <Flex justify="flex-end">
            <Button size="xs" colorScheme="purple" variant="outline" {...hp(activeStepId, 'test-button', onStepAction)}>
              Testar Action
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}
