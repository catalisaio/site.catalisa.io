import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Flex,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiServer, FiCode, FiClock, FiLayers, FiCheck, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';

interface CaseStep {
  number: string;
  label: string;
  title: string;
  description: string;
  highlight: string;
}

const panelVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.98 },
};

export function AppsInAction() {
  const { t } = useTranslation('home');
  const [activeStep, setActiveStep] = useState(0);

  const caseSteps: CaseStep[] = [
    {
      number: '01',
      label: t('appsInAction.steps.0.label'),
      title: t('appsInAction.steps.0.title'),
      description: t('appsInAction.steps.0.description'),
      highlight: t('appsInAction.steps.0.highlight'),
    },
    {
      number: '02',
      label: t('appsInAction.steps.1.label'),
      title: t('appsInAction.steps.1.title'),
      description: t('appsInAction.steps.1.description'),
      highlight: t('appsInAction.steps.1.highlight'),
    },
    {
      number: '03',
      label: t('appsInAction.steps.2.label'),
      title: t('appsInAction.steps.2.title'),
      description: t('appsInAction.steps.2.description'),
      highlight: t('appsInAction.steps.2.highlight'),
    },
    {
      number: '04',
      label: t('appsInAction.steps.3.label'),
      title: t('appsInAction.steps.3.title'),
      description: t('appsInAction.steps.3.description'),
      highlight: t('appsInAction.steps.3.highlight'),
    },
  ];

  const resultStats = [
    { icon: FiServer, value: t('appsInAction.resultStats.0.value'), label: t('appsInAction.resultStats.0.label') },
    { icon: FiCode, value: t('appsInAction.resultStats.1.value'), label: t('appsInAction.resultStats.1.label') },
    { icon: FiClock, value: t('appsInAction.resultStats.2.value'), label: t('appsInAction.resultStats.2.label') },
    { icon: FiLayers, value: t('appsInAction.resultStats.3.value'), label: t('appsInAction.resultStats.3.label') },
  ];

  const currentStep = caseSteps[activeStep];

  // Mock visuals for each step — no real screenshots
  const stepVisuals = [
    // Step 1: Chat-like prompt box
    <Box key="prompt" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={4}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Descricao do Projeto</Text>
        </HStack>
        <Box
          w="full"
          p={5}
          borderRadius="lg"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="orange.400"
        >
          <HStack spacing={3} mb={3}>
            <Box w="32px" h="32px" borderRadius="full" bg="orange.500" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
              <Text color="white" fontWeight="700" fontSize="xs">U</Text>
            </Box>
            <Text color="whiteAlpha.500" fontSize="xs">Usuario — agora</Text>
          </HStack>
          <Text color="whiteAlpha.800" fontSize="sm" lineHeight="1.7" fontStyle="italic">
            &ldquo;Preciso de um sistema de originacao de credito completo com aprovacao automatica, contratos digitais e auditoria em tempo real.&rdquo;
          </Text>
        </Box>
        <HStack spacing={1}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              w="6px"
              h="6px"
              borderRadius="full"
              bg="orange.400"
              sx={{
                animation: `appsTypingDot 1.4s ease-in-out ${dot * 0.2}s infinite`,
                '@keyframes appsTypingDot': {
                  '0%, 60%, 100%': { transform: 'translateY(0)' },
                  '30%': { transform: 'translateY(-4px)' },
                },
              }}
            />
          ))}
          <Text color="whiteAlpha.400" fontSize="xs" ml={2}>IA processando requisitos...</Text>
        </HStack>
      </VStack>
    </Box>,

    // Step 2: Grid of 7 enterprise blocks selected
    <Box key="blocks" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={4}>
        <HStack spacing={2} justify="space-between" w="full">
          <HStack spacing={2}>
            <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
            <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Blocos Selecionados</Text>
          </HStack>
          <Text color="orange.300" fontSize="xs" fontWeight="700">7 / 7 ativos</Text>
        </HStack>
        <SimpleGrid columns={3} spacing={2} w="full">
          {[
            { name: 'IAM', icon: FiShield },
            { name: 'Auth', icon: FiShield },
            { name: 'KYC', icon: FiCheck },
            { name: 'Scoring', icon: FiServer },
            { name: 'Contratos', icon: FiCode },
            { name: 'Pagamentos', icon: FiLayers },
            { name: 'Auditoria', icon: FiCheck },
          ].map((block) => (
            <HStack
              key={block.name}
              px={2}
              py={2}
              borderRadius="md"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="orange.400"
              spacing={1.5}
            >
              <Icon as={block.icon} color="orange.300" boxSize={3} flexShrink={0} />
              <Text color="white" fontSize="2xs" fontWeight="600" noOfLines={1}>{block.name}</Text>
            </HStack>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>,

    // Step 3: API endpoints list
    <Box key="endpoints" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={2} justify="space-between" w="full">
          <HStack spacing={2}>
            <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
            <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Endpoints Gerados</Text>
          </HStack>
          <Text color="orange.300" fontSize="xs" fontWeight="700">14 endpoints</Text>
        </HStack>
        <VStack spacing={1.5} w="full" align="stretch">
          {[
            { method: 'POST', path: '/api/credit/apply' },
            { method: 'GET', path: '/api/credit/:id/status' },
            { method: 'POST', path: '/api/credit/:id/approve' },
            { method: 'POST', path: '/api/contracts/sign' },
            { method: 'GET', path: '/api/contracts/:id' },
            { method: 'POST', path: '/api/kyc/verify' },
            { method: 'GET', path: '/api/audit/logs' },
            { method: 'POST', path: '/api/payments/schedule' },
          ].map((endpoint, i) => (
            <HStack key={i} spacing={2} px={2.5} py={1.5} borderRadius="md" bg="whiteAlpha.50" fontFamily="mono">
              <Box
                px={1.5}
                py={0.5}
                borderRadius="sm"
                bg={endpoint.method === 'POST' ? 'orange.900' : 'blue.900'}
                border="1px solid"
                borderColor={endpoint.method === 'POST' ? 'orange.700' : 'blue.700'}
                flexShrink={0}
              >
                <Text color={endpoint.method === 'POST' ? 'orange.300' : 'blue.300'} fontSize="2xs" fontWeight="700">
                  {endpoint.method}
                </Text>
              </Box>
              <Text color="whiteAlpha.700" fontSize="2xs">{endpoint.path}</Text>
            </HStack>
          ))}
          <Text color="whiteAlpha.400" fontSize="2xs" pl={2}>+ 6 mais endpoints...</Text>
        </VStack>
      </VStack>
    </Box>,

    // Step 4: Dashboard-like status indicators
    <Box key="production" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="green.400">
      <VStack align="flex-start" spacing={4}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Status de Producao</Text>
        </HStack>
        <VStack spacing={2} w="full" align="stretch">
          {[
            'API de Credito',
            'Motor de Decisao',
            'Contratos Digitais',
            'Gateway de Pagamentos',
            'Trilha de Auditoria',
          ].map((service, i) => (
            <HStack key={i} spacing={3} px={3} py={2.5} borderRadius="md" bg="whiteAlpha.50" justify="space-between">
              <HStack spacing={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="green.400"
                  sx={{
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.4 },
                    },
                  }}
                />
                <Text color="whiteAlpha.800" fontSize="sm">{service}</Text>
              </HStack>
              <Text color="green.400" fontSize="xs" fontWeight="600">Em producao</Text>
            </HStack>
          ))}
        </VStack>
        <HStack spacing={2} pt={1}>
          <Icon as={FiShield} color="orange.300" boxSize={3} />
          <Text color="orange.300" fontSize="xs" fontWeight="600">Conformidade: SOC2 + LGPD ativo</Text>
        </HStack>
      </VStack>
    </Box>,
  ];

  return (
    <Box
      id="apps-in-action"
      as="section"
      position="relative"
      bg="gray.900"
      overflow="hidden"
    >
      {/* Background gradients */}
      <Box
        position="absolute"
        top="-10%"
        right="20%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(251, 146, 60, 0.08) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-15%"
        left="10%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(251, 146, 60, 0.06) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Container maxW="1280px" py={{ base: 16, md: 24 }}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
            <HStack
              bg="whiteAlpha.100"
              px={4}
              py={1.5}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.200"
              spacing={2}
            >
              <Text color="orange.300" fontSize="sm" fontWeight="600">
                &#9679; {t('appsInAction.badge')}
              </Text>
            </HStack>

            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="800"
              color="white"
              lineHeight="1.2"
              maxW="750px"
            >
              {t('appsInAction.heading')}{' '}
              <GradientText
                gradient="linear(to-r, orange.300, orange.400, yellow.300)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('appsInAction.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="550px">
              {t('appsInAction.subtitle')}
            </Text>
          </VStack>
        </MotionBox>

        {/* Timeline Tabs */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Flex
            justify="center"
            mb={{ base: 8, md: 12 }}
            overflowX="auto"
            px={2}
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            <HStack spacing={{ base: 2, md: 3 }} position="relative">
              {caseSteps.map((step, i) => {
                const isActive = i === activeStep;
                const isPast = i < activeStep;
                return (
                  <Box key={step.number} display="flex" alignItems="center">
                    {i > 0 && (
                      <Box
                        w={{ base: '16px', md: '32px' }}
                        h="2px"
                        bg={isPast || isActive ? 'orange.400' : 'whiteAlpha.200'}
                        mr={{ base: 2, md: 3 }}
                        transition="background 0.3s"
                      />
                    )}
                    <Box
                      as="button"
                      onClick={() => setActiveStep(i)}
                      px={{ base: 3, md: 5 }}
                      py={{ base: 2, md: 2.5 }}
                      borderRadius="full"
                      bg={isActive ? 'whiteAlpha.150' : 'transparent'}
                      border="1px solid"
                      borderColor={isActive ? 'orange.400' : isPast ? 'orange.400' : 'whiteAlpha.200'}
                      cursor="pointer"
                      transition="all 0.3s"
                      _hover={{ bg: 'whiteAlpha.100', borderColor: 'orange.300' }}
                      flexShrink={0}
                      position="relative"
                      overflow="hidden"
                    >
                      {isActive && (
                        <Box
                          position="absolute"
                          inset={0}
                          bgGradient="linear(to-r, rgba(251, 146, 60, 0.15), rgba(251, 146, 60, 0.05))"
                          pointerEvents="none"
                        />
                      )}
                      <HStack spacing={2}>
                        <Text
                          color={isActive ? 'orange.300' : isPast ? 'orange.400' : 'whiteAlpha.400'}
                          fontSize={{ base: 'xs', md: 'sm' }}
                          fontWeight="700"
                        >
                          {step.number}
                        </Text>
                        <Text
                          color={isActive ? 'white' : isPast ? 'whiteAlpha.700' : 'whiteAlpha.500'}
                          fontSize={{ base: 'xs', md: 'sm' }}
                          fontWeight={isActive ? '600' : '400'}
                          display={{ base: 'none', sm: 'block' }}
                        >
                          {step.label}
                        </Text>
                      </HStack>
                    </Box>
                  </Box>
                );
              })}
            </HStack>
          </Flex>
        </MotionBox>

        {/* Main Content: Mock Visual + Description */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={{ base: 8, lg: 12 }}
            align="flex-start"
          >
            {/* Mock Visual */}
            <Box flex={{ lg: 3 }} w="full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.number}
                  variants={panelVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {stepVisuals[activeStep]}
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Description */}
            <Box flex={{ lg: 2 }} w="full" pt={{ lg: 4 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <VStack align="flex-start" spacing={5}>
                    <HStack spacing={3}>
                      <Box
                        px={3}
                        py={1}
                        borderRadius="lg"
                        bgGradient="linear(to-r, orange.500, orange.400)"
                      >
                        <Text color="white" fontSize="sm" fontWeight="700">
                          {currentStep.number}
                        </Text>
                      </Box>
                      <Heading
                        as="h3"
                        fontSize={{ base: 'lg', md: 'xl' }}
                        fontWeight="700"
                        color="white"
                      >
                        {currentStep.title}
                      </Heading>
                    </HStack>

                    <Text
                      color="whiteAlpha.700"
                      fontSize={{ base: 'sm', md: 'md' }}
                      lineHeight="1.8"
                    >
                      {currentStep.description}
                    </Text>

                    {/* Highlight callout */}
                    <Box
                      w="full"
                      px={4}
                      py={3}
                      borderRadius="xl"
                      bg="whiteAlpha.50"
                      border="1px solid"
                      borderColor="orange.400"
                      borderLeft="3px solid"
                      borderLeftColor="orange.400"
                    >
                      <Text
                        color="orange.300"
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight="600"
                      >
                        {currentStep.highlight}
                      </Text>
                    </Box>
                  </VStack>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Flex>
        </MotionBox>

        {/* Results Stats Bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            spacing={{ base: 4, md: 6 }}
            mt={{ base: 12, md: 16 }}
            p={{ base: 4, md: 6 }}
            borderRadius="2xl"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            {resultStats.map((stat) => (
              <HStack key={stat.label} spacing={3} justify="center">
                <Box
                  p={2.5}
                  borderRadius="xl"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                >
                  <Icon as={stat.icon} color="orange.300" boxSize={5} />
                </Box>
                <VStack align="flex-start" spacing={0}>
                  <Text color="white" fontWeight="700" fontSize={{ base: 'lg', md: 'xl' }}>
                    {stat.value}
                  </Text>
                  <Text color="whiteAlpha.500" fontSize="xs">
                    {stat.label}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
}
