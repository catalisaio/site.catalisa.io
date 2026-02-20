import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Badge,
  Flex, Button, Input, FormControl, FormLabel, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, Tabs, TabList, Tab,
} from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { generalUseCases, agentTemplates } from '../data/useCases';
import { categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

function MiniROI({ before, after }: { before: { metric: string; value: string }[]; after: { metric: string; value: string }[] }) {
  return (
    <SimpleGrid columns={2} spacing={3} w="full">
      <Box bg="red.50" p={3} borderRadius="lg">
        <Text fontSize="2xs" fontWeight="700" color="red.500" mb={1}>ANTES</Text>
        {before.map((item) => (
          <Text key={item.metric} fontSize="xs" color="gray.600">{item.metric}: <Text as="span" fontWeight="600" color="red.600">{item.value}</Text></Text>
        ))}
      </Box>
      <Box bg="green.50" p={3} borderRadius="lg">
        <Text fontSize="2xs" fontWeight="700" color="green.500" mb={1}>DEPOIS</Text>
        {after.map((item) => (
          <Text key={item.metric} fontSize="xs" color="gray.600">{item.metric}: <Text as="span" fontWeight="600" color="green.600">{item.value}</Text></Text>
        ))}
      </Box>
    </SimpleGrid>
  );
}

function ScenarioROICalculator() {
  const [scenario, setScenario] = useState<'sdr' | 'support' | 'realestate'>('sdr');
  const [volume, setVolume] = useState(100);

  const configs = {
    sdr: { costPerManual: 45, costPerAI: 2, label: 'Qualificacao de leads' },
    support: { costPerManual: 25, costPerAI: 1, label: 'Atendimento ao cliente' },
    realestate: { costPerManual: 60, costPerAI: 3, label: 'Atendimento imobiliario' },
  };

  const config = configs[scenario];
  const manualCost = volume * 30 * config.costPerManual;
  const aiCost = volume * 30 * config.costPerAI + 800;
  const savings = manualCost - aiCost;

  return (
    <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="700" fontSize="md">Calcule sua economia</Text>

        <Tabs variant="unstyled" onChange={(i) => setScenario(['sdr', 'support', 'realestate'][i] as 'sdr' | 'support' | 'realestate')}>
          <TabList gap={2}>
            {Object.values(configs).map((c, i) => (
              <Tab
                key={i}
                bg={Object.keys(configs)[i] === scenario ? 'brand.500' : 'gray.100'}
                color={Object.keys(configs)[i] === scenario ? 'white' : 'gray.600'}
                borderRadius="full" px={3} py={1.5} fontSize="xs" fontWeight="500"
              >
                {c.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <FormControl>
          <FormLabel fontSize="sm">Interacoes por dia</FormLabel>
          <Input type="number" value={volume} onChange={(e) => setVolume(Number(e.target.value) || 0)} focusBorderColor="brand.500" size="sm" />
        </FormControl>

        <SimpleGrid columns={3} spacing={3}>
          <Stat>
            <StatLabel fontSize="2xs">Manual</StatLabel>
            <StatNumber fontSize="md" color="red.500">R$ {Math.round(manualCost).toLocaleString('pt-BR')}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="2xs">Com IA</StatLabel>
            <StatNumber fontSize="md" color="green.500">R$ {Math.round(aiCost).toLocaleString('pt-BR')}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="2xs">Economia</StatLabel>
            <StatNumber fontSize="md" color="brand.500">R$ {Math.round(Math.max(0, savings)).toLocaleString('pt-BR')}</StatNumber>
            <StatHelpText fontSize="2xs">
              <StatArrow type="increase" />
              {Math.round((savings / manualCost) * 100)}%
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

export function UseCases() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="cyan" fontSize="xs" px={3} py={1} borderRadius="full">
              CASOS DE USO
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              Qual cenario{' '}
              <GradientText gradient="linear(to-r, cyan.300, brand.400)">se parece com o seu?</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              Veja como empresas reais usam a Catalisa para automatizar operacoes com WhatsApp e IA.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Agent Templates Gallery */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            Templates de agentes
          </Heading>
          <Text color="gray.500" maxW="500px">
            Instale agentes pre-configurados com um clique e personalize para seu negocio.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {agentTemplates.map((template, i) => (
            <MotionBox
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box
                bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100"
                _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s" h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="700">{template.name}</Text>
                    <Badge colorScheme="brand" fontSize="2xs">{template.category}</Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">{template.description}</Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {template.tools.map((tool) => (
                      <Badge key={tool} variant="outline" fontSize="2xs" colorScheme="gray">{tool}</Badge>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Use Cases with Before/After */}
      {generalUseCases.map((useCase, idx) => (
        <SectionWrapper key={useCase.id} bg={idx % 2 === 0 ? 'gray.50' : undefined}>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="flex-start">
            <VStack align="flex-start" spacing={5} flex={1}>
              <Badge colorScheme="cyan" fontSize="xs">{useCase.industry}</Badge>
              <Heading as="h2" size="lg" fontWeight="800">{useCase.title}</Heading>
              <Text color="brand.500" fontWeight="500">{useCase.subtitle}</Text>
              <Text color="gray.500" lineHeight="1.7">{useCase.description}</Text>
              <MiniROI before={useCase.before} after={useCase.after} />
            </VStack>

            <Box flex={1} maxW={{ lg: '380px' }}>
              <Box bg="white" p={5} borderRadius="xl" border="1px solid" borderColor="gray.200">
                <Text fontSize="xs" fontWeight="700" color="gray.400" mb={3} textTransform="uppercase">Workflow</Text>
                <VStack align="stretch" spacing={2}>
                  {useCase.workflowSteps.map((step, i) => (
                    <HStack key={i} spacing={3} p={2}>
                      <Box w={5} h={5} borderRadius="full" bg="brand.50" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                        <Text fontSize="2xs" fontWeight="700" color="brand.500">{i + 1}</Text>
                      </Box>
                      <VStack align="flex-start" spacing={0}>
                        <Badge colorScheme={categoryBadges[step.category]?.color || 'gray'} fontSize="2xs">{step.category}</Badge>
                        <Text fontSize="sm" fontWeight="500">{step.label}</Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </Box>
          </Flex>
        </SectionWrapper>
      ))}

      {/* ROI Calculator */}
      <SectionWrapper>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="center">
          <VStack align="flex-start" spacing={4} flex={1}>
            <Heading as="h2" size="xl" fontWeight="800">
              Quanto voce economiza?
            </Heading>
            <Text color="gray.500" lineHeight="1.7">
              Selecione seu cenario, informe o volume de interacoes diarias e veja a economia projetada ao automatizar com agentes de IA.
            </Text>
          </VStack>
          <Box flex={1} maxW="500px">
            <ScenarioROICalculator />
          </Box>
        </Flex>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper bg="brand.50">
        <VStack spacing={6} textAlign="center">
          <Heading as="h2" size="xl" fontWeight="800">
            Qual cenario mais se parece com o seu?
          </Heading>
          <Text color="gray.500" maxW="500px">
            Fale com nosso time para montar a automacao ideal para o seu negocio.
          </Text>
          <HStack spacing={4}>
            <Button
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              size="lg"
              bg="whatsapp.500"
              color="white"
              _hover={{ bg: 'whatsapp.600' }}
              leftIcon={<FiMessageCircle />}
            >
              Vamos conversar
            </Button>
          </HStack>
        </VStack>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
