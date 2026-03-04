import { useState, lazy, Suspense } from 'react';
import { Box, Text, Flex, Button, Icon, Badge, Center, Spinner } from '@chakra-ui/react';
import { FiChevronRight, FiTarget } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../../motion';
import { BrowserFrame } from '../../shared/BrowserFrame';
import type { MockUIBlock as MockUIBlockType, InteractionStep } from '../../../data/trainingBlockTypes';

// Lazy load all mock screens
const mockScreens = {
  'leads-table': lazy(() => import('../mock-screens/MockLeadsTable').then(m => ({ default: m.MockLeadsTable }))),
  'leads-kanban': lazy(() => import('../mock-screens/MockLeadsKanban').then(m => ({ default: m.MockLeadsKanban }))),
  'agent-form': lazy(() => import('../mock-screens/MockAgentForm').then(m => ({ default: m.MockAgentForm }))),
  'agent-chat': lazy(() => import('../mock-screens/MockAgentChat').then(m => ({ default: m.MockAgentChat }))),
  'workflow-canvas': lazy(() => import('../mock-screens/MockWorkflowCanvas').then(m => ({ default: m.MockWorkflowCanvas }))),
  'custom-action-form': lazy(() => import('../mock-screens/MockCustomActionForm').then(m => ({ default: m.MockCustomActionForm }))),
  'whatsapp-chat': lazy(() => import('../mock-screens/MockWhatsAppChat').then(m => ({ default: m.MockWhatsAppChat }))),
  'dashboard': lazy(() => import('../mock-screens/MockDashboard').then(m => ({ default: m.MockDashboard }))),
  'ai-assistant': lazy(() => import('../mock-screens/MockAIAssistant').then(m => ({ default: m.MockAIAssistant }))),
  'settings': lazy(() => import('../mock-screens/MockSettings').then(m => ({ default: m.MockSettings }))),
};

const urlMap: Record<string, string> = {
  'leads-table': 'panel.catalisa.app/leads',
  'leads-kanban': 'panel.catalisa.app/leads/kanban',
  'agent-form': 'panel.catalisa.app/agentes/novo',
  'agent-chat': 'panel.catalisa.app/agentes/chat',
  'workflow-canvas': 'panel.catalisa.app/workflows/editor',
  'custom-action-form': 'panel.catalisa.app/custom-actions/novo',
  'whatsapp-chat': 'panel.catalisa.app/chat',
  'dashboard': 'panel.catalisa.app/dashboard',
  'ai-assistant': 'panel.catalisa.app',
  'settings': 'panel.catalisa.app/configuracoes',
};

interface Props {
  block: MockUIBlockType;
}

export function MockUIBlock({ block }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const hasSteps = block.interactionSteps && block.interactionSteps.length > 0;
  const MockScreen = mockScreens[block.variant];
  const url = block.url || urlMap[block.variant] || 'panel.catalisa.app';

  return (
    <Box w="full" position="relative">
      <BrowserFrame url={url} variant="light">
        <Box position="relative" minH="300px">
          <Suspense fallback={<Center py={12}><Spinner size="lg" color="purple.500" /></Center>}>
            <MockScreen
              initialData={block.initialData}
              activeStepId={hasSteps ? block.interactionSteps![activeStep]?.targetId : undefined}
            />
          </Suspense>

          {/* Guided Interaction Overlay */}
          {hasSteps && (
            <GuidedOverlay
              steps={block.interactionSteps!}
              activeStep={activeStep}
              onNext={() => setActiveStep(prev => Math.min(prev + 1, block.interactionSteps!.length - 1))}
              totalSteps={block.interactionSteps!.length}
            />
          )}
        </Box>
      </BrowserFrame>
    </Box>
  );
}

function GuidedOverlay({
  steps,
  activeStep,
  onNext,
  totalSteps,
}: {
  steps: InteractionStep[];
  activeStep: number;
  onNext: () => void;
  totalSteps: number;
}) {
  const step = steps[activeStep];
  const isLast = activeStep === totalSteps - 1;

  return (
    <AnimatePresence mode="wait">
      <MotionBox
        key={activeStep}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        position="absolute"
        bottom={4}
        left={4}
        right={4}
      >
        <Flex
          bg="white"
          border="1px solid"
          borderColor="purple.200"
          borderRadius="lg"
          p={3}
          shadow="lg"
          align="center"
          gap={3}
        >
          <Icon as={FiTarget} color="purple.500" boxSize={4} flexShrink={0} />
          <Box flex={1}>
            <Badge colorScheme="purple" fontSize="2xs" mb={1}>
              Passo {activeStep + 1} de {totalSteps}
            </Badge>
            <Text fontSize="xs" color="gray.700">
              {step.instruction}
            </Text>
          </Box>
          {!isLast && (
            <Button
              size="xs"
              colorScheme="purple"
              rightIcon={<FiChevronRight />}
              onClick={onNext}
              flexShrink={0}
            >
              Proximo
            </Button>
          )}
          {isLast && (
            <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
              Concluido!
            </Badge>
          )}
        </Flex>
      </MotionBox>
    </AnimatePresence>
  );
}
