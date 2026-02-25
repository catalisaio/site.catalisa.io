import { useState } from 'react';
import {
  Box, VStack, Text, SimpleGrid, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, Tabs, TabList, Tab, FormControl, FormLabel, Input,
} from '@chakra-ui/react';

interface ScenarioROICalculatorProps {
  t: (key: string) => string;
}

const scenarioKeys = ['sdr', 'support', 'realestate'] as const;

const configs = {
  sdr: { costPerManual: 45, costPerAI: 2 },
  support: { costPerManual: 25, costPerAI: 1 },
  realestate: { costPerManual: 60, costPerAI: 3 },
};

export function ScenarioROICalculator({ t }: ScenarioROICalculatorProps) {
  const [scenario, setScenario] = useState<'sdr' | 'support' | 'realestate'>('sdr');
  const [volume, setVolume] = useState(100);

  const config = configs[scenario];
  const manualCost = volume * 30 * config.costPerManual;
  const aiCost = volume * 30 * config.costPerAI + 800;
  const savings = manualCost - aiCost;

  return (
    <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="700" fontSize="md">{t('roi.calculatorTitle')}</Text>

        <Tabs variant="unstyled" onChange={(i) => setScenario(scenarioKeys[i])}>
          <TabList gap={2}>
            {scenarioKeys.map((key) => (
              <Tab
                key={key}
                bg={key === scenario ? 'brand.500' : 'gray.100'}
                color={key === scenario ? 'white' : 'gray.600'}
                borderRadius="full" px={3} py={1.5} fontSize="xs" fontWeight="500"
              >
                {t(`roi.scenarios.${key}`)}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <FormControl>
          <FormLabel fontSize="sm">{t('roi.interactionsLabel')}</FormLabel>
          <Input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value) || 0)} focusBorderColor="brand.500" size="sm" />
        </FormControl>

        <SimpleGrid columns={3} spacing={3}>
          <Stat>
            <StatLabel fontSize="2xs">{t('roi.manualLabel')}</StatLabel>
            <StatNumber fontSize="md" color="red.500">R$ {Math.round(manualCost).toLocaleString('pt-BR')}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="2xs">{t('roi.withAILabel')}</StatLabel>
            <StatNumber fontSize="md" color="green.500">R$ {Math.round(aiCost).toLocaleString('pt-BR')}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="2xs">{t('roi.savingsLabel')}</StatLabel>
            <StatNumber fontSize="md" color="brand.500">R$ {Math.round(Math.max(0, savings)).toLocaleString('pt-BR')}</StatNumber>
            <StatHelpText fontSize="2xs">
              <StatArrow type="increase" />
              {manualCost > 0 ? Math.round((savings / manualCost) * 100) : 0}%
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
