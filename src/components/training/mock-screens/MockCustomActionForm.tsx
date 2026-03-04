import { useState } from 'react';
import {
  Box, Flex, Text, Input, Select, Textarea, VStack,
  FormControl, FormLabel, HStack, Badge, Button, Icon, Code, IconButton,
} from '@chakra-ui/react';
import { FiGlobe, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Props {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
}

export function MockCustomActionForm({ activeStepId }: Props) {
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
            <Input size="sm" placeholder="Ex: Consultar CRM Externo" />
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
                id="method-select"
                boxShadow={activeStepId === 'method-select' ? '0 0 0 3px rgba(115,75,156,0.4)' : undefined}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </Select>
              <Input size="sm" placeholder="https://api.exemplo.com/endpoint" flex={1} />
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
            <VStack spacing={1}>
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
        </VStack>
      </Box>
    </Box>
  );
}
