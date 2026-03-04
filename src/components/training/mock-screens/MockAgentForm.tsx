import { useState } from 'react';
import {
  Box, Flex, Text, Input, Textarea, Select, Button, VStack,
  HStack, Badge, Icon, FormControl, FormLabel,
  Step, StepIndicator, StepStatus, StepTitle, StepSeparator,
  Stepper, useSteps,
} from '@chakra-ui/react';
import { FiCheck, FiCpu } from 'react-icons/fi';

const steps = [
  { title: 'Informacoes Basicas' },
  { title: 'Personalidade' },
  { title: 'Ferramentas' },
];

interface Props {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
}

export function MockAgentForm({ activeStepId }: Props) {
  const { activeStep, setActiveStep } = useSteps({ index: 0, count: steps.length });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Box p={4} bg="gray.50" minH="300px">
      <Flex align="center" gap={2} mb={4}>
        <Icon as={FiCpu} color="purple.500" />
        <Text fontSize="md" fontWeight="700" color="gray.800">Criar Novo Agente</Text>
      </Flex>

      <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" p={4}>
        {/* Stepper */}
        <Stepper size="sm" index={activeStep} mb={6} colorScheme="purple">
          {steps.map((step, i) => (
            <Step key={i} onClick={() => setActiveStep(i)} style={{ cursor: 'pointer' }}>
              <StepIndicator>
                <StepStatus
                  complete={<FiCheck />}
                  active={<Text fontSize="xs" fontWeight="700">{i + 1}</Text>}
                  incomplete={<Text fontSize="xs">{i + 1}</Text>}
                />
              </StepIndicator>
              <Box flexShrink={0}>
                <StepTitle><Text fontSize="xs">{step.title}</Text></StepTitle>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Basic Info */}
        {activeStep === 0 && (
          <VStack spacing={3} align="stretch">
            <FormControl id="agent-name" size="sm">
              <FormLabel fontSize="xs" fontWeight="600">Nome do Agente</FormLabel>
              <Input
                size="sm"
                placeholder="Ex: Assistente de Vendas"
                value={name}
                onChange={e => setName(e.target.value)}
                boxShadow={activeStepId === 'agent-name' ? '0 0 0 3px rgba(115,75,156,0.4)' : undefined}
              />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="xs" fontWeight="600">Descricao</FormLabel>
              <Textarea
                size="sm"
                placeholder="Descreva o que este agente faz..."
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="xs" fontWeight="600">Modelo</FormLabel>
              <Select size="sm" defaultValue="haiku">
                <option value="haiku">Claude Haiku (Rapido)</option>
                <option value="sonnet">Claude Sonnet (Equilibrado)</option>
              </Select>
            </FormControl>
          </VStack>
        )}

        {/* Step 2: Personality */}
        {activeStep === 1 && (
          <VStack spacing={3} align="stretch">
            <FormControl size="sm">
              <FormLabel fontSize="xs" fontWeight="600">Prompt do Sistema</FormLabel>
              <Textarea
                size="sm"
                placeholder="Voce e um assistente especializado em..."
                rows={5}
              />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="xs" fontWeight="600">Tom de Comunicacao</FormLabel>
              <Select size="sm" defaultValue="professional">
                <option value="professional">Profissional</option>
                <option value="friendly">Amigavel</option>
                <option value="formal">Formal</option>
              </Select>
            </FormControl>
          </VStack>
        )}

        {/* Step 3: Tools */}
        {activeStep === 2 && (
          <VStack spacing={2} align="stretch">
            <Text fontSize="xs" color="gray.500" mb={2}>Selecione as ferramentas que o agente pode usar:</Text>
            {['Buscar Lead', 'Enviar Mensagem', 'Criar Lead', 'Consultar Workflow'].map((tool, i) => (
              <HStack
                key={i}
                p={2}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                _hover={{ bg: 'purple.50' }}
                cursor="pointer"
              >
                <Box w="16px" h="16px" borderRadius="sm" border="2px solid" borderColor="purple.300" />
                <Text fontSize="xs" color="gray.700">{tool}</Text>
                <Badge ml="auto" colorScheme="purple" fontSize="2xs">Builtin</Badge>
              </HStack>
            ))}
          </VStack>
        )}

        {/* Navigation */}
        <Flex justify="space-between" mt={4} pt={3} borderTop="1px solid" borderColor="gray.100">
          <Button
            size="xs"
            variant="ghost"
            isDisabled={activeStep === 0}
            onClick={() => setActiveStep(Math.max(activeStep - 1, 0))}
          >
            Voltar
          </Button>
          <Button
            size="xs"
            colorScheme="purple"
            onClick={() => setActiveStep(Math.min(activeStep + 1, 2))}
            id="btn-next-step"
            boxShadow={activeStepId === 'btn-next-step' ? '0 0 0 3px rgba(115,75,156,0.4)' : undefined}
          >
            {activeStep === 2 ? 'Criar Agente' : 'Proximo'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
