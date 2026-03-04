import { useState } from 'react';
import {
  Box, VStack, Text, Button, Badge, Flex, HStack, Icon, Tabs, TabList, Tab,
  TabPanels, TabPanel,
} from '@chakra-ui/react';
import { FiPlay, FiCheck, FiChevronRight } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import type { InteractiveDemoBlock as InteractiveDemoBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: InteractiveDemoBlockType;
}

export function InteractiveDemoBlock({ block }: Props) {
  const [activeScenario, setActiveScenario] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const scenario = block.scenarios[activeScenario];
  const step = scenario?.steps[currentStep];
  const isStepCompleted = completedSteps.has(`${activeScenario}-${currentStep}`);

  const handleAction = () => {
    const key = `${activeScenario}-${currentStep}`;
    setCompletedSteps(prev => new Set(prev).add(key));
  };

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white" overflow="hidden">
      {/* Header */}
      <Flex px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200" align="center" gap={2}>
        <Icon as={FiPlay} color="purple.500" />
        <Text fontSize="sm" fontWeight="700" color="gray.800">{block.title}</Text>
        <Badge colorScheme="purple" fontSize="2xs" ml="auto">Demo Interativa</Badge>
      </Flex>

      {/* Scenario Tabs */}
      {block.scenarios.length > 1 && (
        <Tabs
          size="sm"
          colorScheme="purple"
          index={activeScenario}
          onChange={(i) => { setActiveScenario(i); setCurrentStep(0); }}
        >
          <TabList px={4} borderBottom="1px solid" borderColor="gray.100">
            {block.scenarios.map((s, i) => (
              <Tab key={i} fontSize="xs" py={2}>{s.label}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {block.scenarios.map((_, i) => <TabPanel key={i} p={0} />)}
          </TabPanels>
        </Tabs>
      )}

      {/* Scenario Description */}
      <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
        <Text fontSize="xs" color="gray.600">{scenario?.description}</Text>
      </Box>

      {/* Step Content */}
      {step && (
        <Box p={4}>
          <VStack align="stretch" spacing={3}>
            {/* Progress */}
            <HStack spacing={1}>
              {scenario.steps.map((_, idx) => (
                <Box
                  key={idx}
                  flex={1}
                  h="3px"
                  borderRadius="full"
                  bg={
                    completedSteps.has(`${activeScenario}-${idx}`)
                      ? 'green.400'
                      : idx === currentStep
                        ? 'purple.400'
                        : 'gray.200'
                  }
                  transition="background 0.3s"
                />
              ))}
            </HStack>

            {/* Step */}
            <MotionBox
              key={`${activeScenario}-${currentStep}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Text fontSize="xs" color="purple.500" fontWeight="700" mb={1}>
                Passo {currentStep + 1} de {scenario.steps.length}
              </Text>
              <Text fontSize="sm" color="gray.800" fontWeight="600" mb={2}>
                {step.instruction}
              </Text>

              {!isStepCompleted ? (
                <Button
                  size="sm"
                  colorScheme="purple"
                  variant="outline"
                  onClick={handleAction}
                >
                  {step.action}
                </Button>
              ) : (
                <Box>
                  <Box
                    p={2}
                    bg="green.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="green.200"
                    mb={2}
                  >
                    <HStack spacing={1}>
                      <Icon as={FiCheck} color="green.500" boxSize={3} />
                      <Text fontSize="xs" color="green.700">{step.feedback}</Text>
                    </HStack>
                  </Box>
                  {currentStep < scenario.steps.length - 1 && (
                    <Button
                      size="xs"
                      colorScheme="purple"
                      rightIcon={<FiChevronRight />}
                      onClick={handleNext}
                    >
                      Proximo passo
                    </Button>
                  )}
                  {currentStep === scenario.steps.length - 1 && (
                    <Badge colorScheme="green" fontSize="xs" px={2} py={1}>
                      Cenario concluido!
                    </Badge>
                  )}
                </Box>
              )}
            </MotionBox>
          </VStack>
        </Box>
      )}
    </Box>
  );
}
