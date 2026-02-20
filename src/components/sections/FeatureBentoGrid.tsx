import { Heading, Text, VStack, Box, Icon, SimpleGrid, GridItem } from '@chakra-ui/react';
import { FiMessageCircle, FiCpu, FiGitBranch, FiBox, FiUsers, FiShield } from 'react-icons/fi';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

const features = [
  {
    icon: FiMessageCircle,
    title: 'WhatsApp Multi-Agente',
    description: 'Conecte multiplos numeros. Baileys + Cloud API. Cada agente com seu contexto e historico.',
    color: 'whatsapp.500',
    bg: 'green.50',
    span: 2,
  },
  {
    icon: FiCpu,
    title: 'Agentes de IA',
    description: 'Crie agentes especializados com prompt customizado e ferramentas seletivas. Marketplace com 10+ templates.',
    color: 'brand.500',
    bg: 'brand.50',
    span: 2,
  },
  {
    icon: FiGitBranch,
    title: 'Workflows Visuais',
    description: 'Monte automacoes com drag & drop. DAG com execucao paralela. Teste A/B nativo.',
    color: 'blue.500',
    bg: 'blue.50',
    span: 1,
  },
  {
    icon: FiBox,
    title: 'Building Blocks',
    description: '150+ building blocks: IA, fintech, CRM, seguranca, integrações e mais. Combine como quiser.',
    color: 'orange.500',
    bg: 'orange.50',
    span: 1,
  },
  {
    icon: FiUsers,
    title: 'CRM de Leads',
    description: 'Pipeline completo com tipos customizados, kanban, campos dinamicos e historico de interacoes.',
    color: 'cyan.500',
    bg: 'cyan.50',
    span: 1,
  },
  {
    icon: FiShield,
    title: 'Seguranca & LGPD',
    description: 'Multi-tenant isolado. Mascaramento automatico de PII. Criptografia bancaria. RBAC.',
    color: 'red.500',
    bg: 'red.50',
    span: 1,
  },
];

export function FeatureBentoGrid() {
  return (
    <SectionWrapper>
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          Tudo que voce precisa.{' '}
          <Text as="span" color="brand.500">Nada que nao precisa.</Text>
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
        {features.map((feature, i) => (
          <GridItem key={feature.title} colSpan={{ base: 1, lg: feature.span }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              h="full"
            >
              <Box
                bg="white"
                p={7}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: feature.color, boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.3s"
                h="full"
              >
                <VStack align="flex-start" spacing={4}>
                  <Box p={3} borderRadius="lg" bg={feature.bg}>
                    <Icon as={feature.icon} boxSize={6} color={feature.color} />
                  </Box>
                  <Heading as="h3" size="sm" fontWeight="700">
                    {feature.title}
                  </Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          </GridItem>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
