import { Heading, Text, VStack, Box, SimpleGrid, Icon, HStack } from '@chakra-ui/react';
import { FiMessageCircle, FiGitBranch, FiCpu, FiBarChart2 } from 'react-icons/fi';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

const steps = [
  {
    icon: FiMessageCircle,
    label: 'Conectar',
    title: 'WhatsApp',
    description: 'Multi-tenant, multi-device. QR Code ou Cloud API.',
    color: 'whatsapp.500',
    bg: 'green.50',
  },
  {
    icon: FiGitBranch,
    label: 'Automatizar',
    title: 'Workflows',
    description: 'Drag & drop visual. 150+ building blocks composiveis.',
    color: 'blue.500',
    bg: 'blue.50',
  },
  {
    icon: FiCpu,
    label: 'Inteligência',
    title: 'AI Agents',
    description: 'Agentes especializados com ferramentas seletivas.',
    color: 'brand.500',
    bg: 'brand.50',
  },
  {
    icon: FiBarChart2,
    label: 'Resultado',
    title: 'CRM & Analytics',
    description: 'Pipeline de leads, métricas e histórico completo.',
    color: 'orange.500',
    bg: 'orange.50',
  },
];

export function SolutionOverview() {
  return (
    <SectionWrapper bg="gray.50">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          Uma plataforma completa.{' '}
          <Text as="span" color="brand.500">Quatro pilares.</Text>
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          Do primeiro contato ao fechamento — tudo conectado, automatizado e inteligente.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {steps.map((step, i) => (
          <MotionBox
            key={step.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: step.color, boxShadow: 'lg', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
              h="full"
              position="relative"
            >
              {/* Step number */}
              <Text
                position="absolute"
                top={3}
                right={4}
                fontSize="4xl"
                fontWeight="900"
                color="gray.100"
                lineHeight={1}
              >
                {i + 1}
              </Text>

              <VStack align="flex-start" spacing={4}>
                <Box p={3} borderRadius="lg" bg={step.bg}>
                  <Icon as={step.icon} boxSize={6} color={step.color} />
                </Box>
                <HStack>
                  <Text fontSize="xs" fontWeight="700" color={step.color} textTransform="uppercase" letterSpacing="wider">
                    {step.label}
                  </Text>
                </HStack>
                <Heading as="h3" size="md" fontWeight="700">
                  {step.title}
                </Heading>
                <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                  {step.description}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
