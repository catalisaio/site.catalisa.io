import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Badge,
  Code, Flex,
} from '@chakra-ui/react';
import {
  FiLayout, FiZap, FiGitBranch, FiMessageCircle, FiUsers, FiCalendar,
  FiArrowRight, FiPlay, FiClock, FiGlobe, FiRefreshCw, FiCpu,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { FinalCTA } from '../components/sections/FinalCTA';
import { WorkflowShowcase } from '../components/sections/WorkflowShowcase';
import { ProductScreenshot } from '../components/sections/ProductScreenshot';

export function Workflows() {
  const { t } = useTranslation('workflows');
  const workflowSteps = [
    {
      step: '01',
      title: t('howItWorks.steps.0.title'),
      description: t('howItWorks.steps.0.description'),
      icon: FiLayout,
      color: 'blue.500',
    },
    {
      step: '02',
      title: t('howItWorks.steps.1.title'),
      description: t('howItWorks.steps.1.description'),
      icon: FiZap,
      color: 'orange.500',
    },
    {
      step: '03',
      title: t('howItWorks.steps.2.title'),
      description: t('howItWorks.steps.2.description'),
      icon: FiGitBranch,
      color: 'brand.500',
    },
    {
      step: '04',
      title: t('howItWorks.steps.3.title'),
      description: t('howItWorks.steps.3.description'),
      icon: FiPlay,
      color: 'whatsapp.500',
    },
  ];

  const triggers = [
    { icon: FiUsers, label: t('triggers.items.0.label'), description: t('triggers.items.0.description'), color: 'orange.500' },
    { icon: FiUsers, label: t('triggers.items.1.label'), description: t('triggers.items.1.description'), color: 'orange.400' },
    { icon: FiMessageCircle, label: t('triggers.items.2.label'), description: t('triggers.items.2.description'), color: 'whatsapp.500' },
    { icon: FiMessageCircle, label: t('triggers.items.3.label'), description: t('triggers.items.3.description'), color: 'green.400' },
    { icon: FiGlobe, label: t('triggers.items.4.label'), description: t('triggers.items.4.description'), color: 'cyan.500' },
    { icon: FiRefreshCw, label: t('triggers.items.5.label'), description: t('triggers.items.5.description'), color: 'blue.500' },
    { icon: FiCalendar, label: t('triggers.items.6.label'), description: t('triggers.items.6.description'), color: 'purple.500' },
    { icon: FiPlay, label: t('triggers.items.7.label'), description: t('triggers.items.7.description'), color: 'gray.500' },
  ];

  const variableExamples = [
    { variable: '{{trigger.payload.phone}}', description: t('variables.examples.0') },
    { variable: '{{actions.createLead.output.id}}', description: t('variables.examples.1') },
    { variable: '{{actions.aiAgent.output.response}}', description: t('variables.examples.2') },
    { variable: '{{trigger.payload.message.text}}', description: t('variables.examples.3') },
  ];
  return (
    <>
      {/* Hero */}
      <Box id="hero" bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('hero.badge')}
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              {t('hero.heading')}{' '}
              <GradientText gradient="linear(to-r, blue.300, brand.400)">{t('hero.headingGradient')}</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              {t('hero.subtitle')}
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* How it works - Steps */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('howItWorks.heading')}
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {workflowSteps.map((step, i) => (
            <MotionBox
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full" position="relative">
                <Text position="absolute" top={3} right={4} fontSize="3xl" fontWeight="900" color="gray.100">{step.step}</Text>
                <VStack align="flex-start" spacing={4}>
                  <Icon as={step.icon} boxSize={6} color={step.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{step.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{step.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Trigger Types */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('triggers.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px">
            {t('triggers.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {triggers.map((trigger, i) => (
            <MotionBox
              key={trigger.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: trigger.color, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack spacing={2}>
                  <Icon as={trigger.icon} boxSize={5} color={trigger.color} />
                  <Text fontWeight="600" fontSize="sm" textAlign="center">{trigger.label}</Text>
                  <Text color="gray.400" fontSize="xs" textAlign="center">{trigger.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Interactive Workflow Showcase */}
      <WorkflowShowcase />

      {/* Real Product Screenshot */}
      <ProductScreenshot />

      {/* DAG Execution */}
      <SectionWrapper>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={12} align="center">
          <VStack align="flex-start" spacing={5} flex={1}>
            <Badge colorScheme="blue" fontSize="xs">{t('dag.badge')}</Badge>
            <Heading as="h2" size="xl" fontWeight="800">
              {t('dag.heading')}
            </Heading>
            <Text color="gray.500" lineHeight="1.7">
              {t('dag.description')}
            </Text>
            <VStack align="flex-start" spacing={3} w="full">
              <HStack spacing={3} p={3} bg="green.50" borderRadius="lg" w="full">
                <Icon as={FiZap} color="green.500" />
                <Text fontSize="sm" fontWeight="500">{t('dag.features.0')}</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="blue.50" borderRadius="lg" w="full">
                <Icon as={FiGitBranch} color="blue.500" />
                <Text fontSize="sm" fontWeight="500">{t('dag.features.1')}</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="purple.50" borderRadius="lg" w="full">
                <Icon as={FiClock} color="purple.500" />
                <Text fontSize="sm" fontWeight="500">{t('dag.features.2')}</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="orange.50" borderRadius="lg" w="full">
                <Icon as={FiCpu} color="orange.500" />
                <Text fontSize="sm" fontWeight="500">{t('dag.features.3')}</Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Visual DAG example */}
          <Box flex={1} maxW="400px">
            <Box bg="gray.50" p={6} borderRadius="2xl" border="1px solid" borderColor="gray.200">
              <VStack spacing={4}>
                <Box bg="whatsapp.50" p={3} borderRadius="lg" w="full" textAlign="center" border="1px solid" borderColor="whatsapp.200">
                  <Text fontSize="sm" fontWeight="600" color="whatsapp.600">{t('dag.example.trigger')}</Text>
                </Box>
                <Icon as={FiArrowRight} transform="rotate(90deg)" color="gray.300" />
                <HStack spacing={4} w="full">
                  <Box flex={1} bg="purple.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="purple.200">
                    <Text fontSize="xs" fontWeight="600" color="purple.600">{t('dag.example.sentiment')}</Text>
                  </Box>
                  <Box flex={1} bg="blue.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="blue.200">
                    <Text fontSize="xs" fontWeight="600" color="blue.600">{t('dag.example.extractData')}</Text>
                  </Box>
                </HStack>
                <Icon as={FiArrowRight} transform="rotate(90deg)" color="gray.300" />
                <Box bg="brand.50" p={3} borderRadius="lg" w="full" textAlign="center" border="1px solid" borderColor="brand.200">
                  <Text fontSize="sm" fontWeight="600" color="brand.600">{t('dag.example.conditional')}</Text>
                </Box>
                <HStack spacing={4} w="full">
                  <Box flex={1} bg="green.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="green.200">
                    <Text fontSize="xs" fontWeight="600" color="green.600">{t('dag.example.approved')}</Text>
                  </Box>
                  <Box flex={1} bg="red.50" p={3} borderRadius="lg" textAlign="center" border="1px solid" borderColor="red.200">
                    <Text fontSize="xs" fontWeight="600" color="red.600">{t('dag.example.rejected')}</Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </SectionWrapper>

      {/* Variable Interpolation */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('variables.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px">
            {t('variables.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="800px" mx="auto">
          {variableExamples.map((example, i) => (
            <MotionBox
              key={example.variable}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <HStack bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100" spacing={3}>
                <Code colorScheme="brand" fontSize="xs" px={2} py={1} borderRadius="md">
                  {example.variable}
                </Code>
                <Text fontSize="sm" color="gray.500">{example.description}</Text>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Versioning */}
      <SectionWrapper>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {[
            { icon: FiRefreshCw, title: t('versioning.items.0.title'), description: t('versioning.items.0.description'), color: 'blue.500' },
            { icon: FiClock, title: t('versioning.items.1.title'), description: t('versioning.items.1.description'), color: 'brand.500' },
            { icon: FiPlay, title: t('versioning.items.2.title'), description: t('versioning.items.2.description'), color: 'green.500' },
          ].map((feature, i) => (
            <MotionBox
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full">
                <VStack align="flex-start" spacing={3}>
                  <Icon as={feature.icon} boxSize={6} color={feature.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{feature.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{feature.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
