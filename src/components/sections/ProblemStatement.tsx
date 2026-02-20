import { Heading, Text, SimpleGrid, VStack, Icon, Box } from '@chakra-ui/react';
import { FiClock, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox, staggerItem } from '../motion';

const problems = [
  {
    icon: FiClock,
    title: 'Respostas manuais',
    description: 'Sua equipe responde uma mensagem por vez. Leads esfriam enquanto esperam.',
  },
  {
    icon: FiUsers,
    title: 'Sem contexto entre atendentes',
    description: 'Cada troca de agente recomeça do zero. O cliente repete tudo de novo.',
  },
  {
    icon: FiAlertTriangle,
    title: 'Zero automação',
    description: 'Tarefas repetitivas consomem horas. Qualificação, follow-up, cobrança — tudo manual.',
  },
];

export function ProblemStatement() {
  return (
    <SectionWrapper>
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          O WhatsApp virou seu canal principal.{' '}
          <Text as="span" color="brand.500">Mas como escalar?</Text>
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          120 milhões de brasileiros usam WhatsApp diariamente. Seu time não consegue acompanhar.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {problems.map((problem) => (
          <MotionBox key={problem.title} {...staggerItem}>
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
              h="full"
            >
              <VStack align="flex-start" spacing={4}>
                <Box p={3} borderRadius="lg" bg="red.50">
                  <Icon as={problem.icon} boxSize={6} color="red.400" />
                </Box>
                <Heading as="h3" size="md" fontWeight="700">
                  {problem.title}
                </Heading>
                <Text color="gray.500" lineHeight="1.7">
                  {problem.description}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
