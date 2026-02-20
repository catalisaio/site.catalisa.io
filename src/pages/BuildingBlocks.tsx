import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge, Button,
} from '@chakra-ui/react';
import {
  FiCpu, FiMessageCircle, FiUsers, FiDollarSign, FiShield, FiGlobe, FiGitBranch,
  FiDatabase, FiFileText, FiCalendar, FiArrowRight, FiCheck,
} from 'react-icons/fi';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { capabilityClusters, businessRecipes, categoryBadges } from '../data/capabilityClusters';
import { FinalCTA } from '../components/sections/FinalCTA';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

const iconMap: Record<string, React.ElementType> = {
  FiCpu, FiMessageCircle, FiUsers, FiDollarSign, FiShield, FiGlobe, FiGitBranch,
  FiDatabase, FiFileText, FiCalendar,
};

export function BuildingBlocks() {
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="orange" fontSize="xs" px={3} py={1} borderRadius="full">
              CAPACIDADES
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              <GradientText gradient="linear(to-r, catalisa.accent, catalisa.secondary)">150+ capacidades.</GradientText>{' '}
              Infinitas combinacoes.
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              Cada dominio reune dezenas de capacidades especializadas. Combine-os em workflows que resolvem qualquer desafio de negocio.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Cluster Grid */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={10}>
          <Heading as="h2" size="xl" fontWeight="800">
            10 dominios de capacidades
          </Heading>
          <Text color="gray.500" maxW="600px">
            Cada dominio agrupa capacidades complementares. Juntos, cobrem todo o ciclo de atendimento, vendas e operacoes.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 2 }} spacing={6}>
          {capabilityClusters.map((cluster, i) => {
            const ClusterIcon = iconMap[cluster.icon] || FiCpu;
            return (
              <MotionBox
                key={cluster.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.08, 0.6), duration: 0.4 }}
              >
                <Box
                  bg="white"
                  p={6}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ borderColor: `${cluster.color}.300`, boxShadow: 'md', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  h="full"
                >
                  <HStack align="flex-start" spacing={5}>
                    <Box p={3} borderRadius="xl" bg={`${cluster.color}.50`} flexShrink={0}>
                      <Icon as={ClusterIcon} boxSize={6} color={`${cluster.color}.500`} />
                    </Box>
                    <VStack align="flex-start" spacing={3} flex={1}>
                      <Heading as="h3" size="sm" fontWeight="700">{cluster.name}</Heading>
                      <Text color="gray.500" fontSize="sm" lineHeight="1.6">
                        {cluster.description}
                      </Text>
                      <VStack align="flex-start" spacing={1} w="full">
                        {cluster.outcomes.slice(0, 5).map((outcome) => (
                          <HStack key={outcome} spacing={2}>
                            <Icon as={FiCheck} boxSize={3} color={`${cluster.color}.400`} flexShrink={0} />
                            <Text fontSize="xs" color="gray.600">{outcome}</Text>
                          </HStack>
                        ))}
                        {cluster.outcomes.length > 5 && (
                          <Text fontSize="xs" color="gray.400" fontStyle="italic" pl={5}>
                            e muito mais...
                          </Text>
                        )}
                      </VStack>
                    </VStack>
                  </HStack>
                </Box>
              </MotionBox>
            );
          })}
        </SimpleGrid>

        {/* Platform extras + CTA */}
        <Box bg="gray.50" p={5} borderRadius="xl" mt={8} textAlign="center" border="1px solid" borderColor="gray.100">
          <Text color="gray.600" fontSize="sm">
            <Text as="span" fontWeight="700" color="gray.700">+ Plataforma:</Text>{' '}
            Extensibilidade, eventos customizados, acoes personalizadas, debug e monitoramento.
          </Text>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            variant="link"
            color="brand.500"
            fontSize="sm"
            fontWeight="600"
            mt={2}
            rightIcon={<FiArrowRight />}
          >
            Quero saber mais
          </Button>
        </Box>
      </SectionWrapper>

      {/* Business Recipes */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="brand" fontSize="xs" px={3} py={1} borderRadius="full">
            RECEITAS DE NEGOCIO
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            Combinacoes que empresas reais usam
          </Heading>
          <Text color="gray.500" maxW="600px">
            Veja como dominios se combinam para resolver cenarios complexos de ponta a ponta.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {businessRecipes.map((recipe, i) => (
            <MotionBox
              key={recipe.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full">
                <VStack align="flex-start" spacing={4}>
                  <Heading as="h3" size="sm" fontWeight="700">{recipe.title}</Heading>
                  <Text color="gray.500" fontSize="sm">{recipe.description}</Text>
                  <HStack spacing={2} flexWrap="wrap" pt={1}>
                    {recipe.steps.map((step, si) => (
                      <HStack key={si} spacing={1}>
                        <Badge
                          colorScheme={categoryBadges[step.category]?.color || 'gray'}
                          fontSize="2xs"
                          px={2}
                          py={0.5}
                        >
                          {step.category}
                        </Badge>
                        {si < recipe.steps.length - 1 && (
                          <Icon as={FiArrowRight} color="gray.300" boxSize={3} />
                        )}
                      </HStack>
                    ))}
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    {recipe.steps.map(s => s.label).join(' → ')}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Summary stats */}
      <SectionWrapper>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} textAlign="center">
          <VStack>
            <Text fontSize="3xl" fontWeight="800" color="brand.500">150+</Text>
            <Text color="gray.500" fontSize="sm">Capacidades</Text>
          </VStack>
          <VStack>
            <Text fontSize="3xl" fontWeight="800" color="purple.500">10</Text>
            <Text color="gray.500" fontSize="sm">Dominios</Text>
          </VStack>
          <VStack>
            <Text fontSize="3xl" fontWeight="800" color="green.500">8</Text>
            <Text color="gray.500" fontSize="sm">Triggers</Text>
          </VStack>
          <VStack>
            <Text fontSize="3xl" fontWeight="800" color="orange.500">DAG</Text>
            <Text color="gray.500" fontSize="sm">Execucao paralela</Text>
          </VStack>
        </SimpleGrid>
      </SectionWrapper>

      <Box textAlign="center" py={8}>
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
      </Box>

      <FinalCTA />
    </>
  );
}
