import { lazy, Suspense, useState } from 'react';
import { Box, Text, Button, Badge, Flex, Icon, Center, Spinner } from '@chakra-ui/react';
import { FiPlay, FiEye, FiRefreshCw } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import type { SandboxBlock as SandboxBlockType } from '../../../data/trainingBlockTypes';

const sandboxes = {
  'variable-interpolation': lazy(() => import('../sandboxes/VariableInterpolationSandbox').then(m => ({ default: m.VariableInterpolationSandbox }))),
  'agent-config': lazy(() => import('../sandboxes/AgentConfigSandbox').then(m => ({ default: m.AgentConfigSandbox }))),
  'workflow-builder': lazy(() => import('../sandboxes/WorkflowBuilderSandbox').then(m => ({ default: m.WorkflowBuilderSandbox }))),
  'custom-action': lazy(() => import('../sandboxes/CustomActionSandbox').then(m => ({ default: m.CustomActionSandbox }))),
  'trigger-config': lazy(() => import('../sandboxes/TriggerConfigSandbox').then(m => ({ default: m.TriggerConfigSandbox }))),
  'webhook-config': lazy(() => import('../sandboxes/WebhookConfigSandbox').then(m => ({ default: m.WebhookConfigSandbox }))),
};

interface Props {
  block: SandboxBlockType;
}

export function SandboxBlock({ block }: Props) {
  const [validated, setValidated] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const SandboxComp = sandboxes[block.variant];

  const handleValidate = (isValid: boolean) => {
    setValidated(isValid);
    setAttempts(prev => prev + 1);
  };

  const handleReset = () => {
    setValidated(null);
    setShowSolution(false);
  };

  return (
    <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" overflow="hidden">
      {/* Header */}
      <Flex px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200" align="center" justify="space-between">
        <Flex align="center" gap={2}>
          <Icon as={FiPlay} color="purple.500" />
          <Badge colorScheme="purple" fontSize="xs">Sandbox</Badge>
          {block.xpReward && (
            <Badge colorScheme="yellow" fontSize="2xs">+{block.xpReward} XP</Badge>
          )}
        </Flex>
        <Button size="xs" variant="ghost" leftIcon={<FiRefreshCw />} onClick={handleReset}>
          Reiniciar
        </Button>
      </Flex>

      {/* Instructions */}
      <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
        <Text fontSize="sm" color="gray.700" lineHeight="tall">
          {block.instructions}
        </Text>
      </Box>

      {/* Sandbox Area */}
      <Box p={4}>
        <Suspense fallback={<Center py={8}><Spinner size="md" color="purple.500" /></Center>}>
          <SandboxComp
            validation={block.validation}
            onValidate={handleValidate}
            showSolution={showSolution}
            solution={block.solution}
          />
        </Suspense>
      </Box>

      {/* Feedback */}
      {validated !== null && (
        <MotionBox
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          px={4}
          pb={3}
        >
          <Box
            p={3}
            borderRadius="lg"
            bg={validated ? 'green.50' : 'red.50'}
            border="1px solid"
            borderColor={validated ? 'green.200' : 'red.200'}
          >
            <Text fontSize="sm" color={validated ? 'green.700' : 'red.700'} fontWeight="600">
              {validated ? 'Correto! Sandbox concluido.' : 'Ainda nao esta certo. Tente novamente.'}
            </Text>
          </Box>
        </MotionBox>
      )}

      {/* Show Solution */}
      {attempts >= 3 && !validated && !showSolution && (
        <Box px={4} pb={3}>
          <Button
            size="xs"
            variant="outline"
            leftIcon={<FiEye />}
            onClick={() => setShowSolution(true)}
          >
            Ver solucao
          </Button>
        </Box>
      )}
    </Box>
  );
}
