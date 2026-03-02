import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Flex,
  Icon,
  List,
  ListItem,
} from '@chakra-ui/react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { FiCheck, FiServer, FiClock, FiLayers } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';
import { ScrollHint } from '../shared/ScrollHint';

interface BuilderStep {
  label: string;
  title: string;
  description: string;
  bullets: string[];
}

export function AppBuilderShowcase() {
  const { t } = useTranslation('home');
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Remap raw progress into active zone, leaving buffers at start/end
    // 0–3% = lead-in buffer, 3–70% = animation zone, 70–100% = tail buffer (absorbs momentum)
    const ANIM_START = 0.03;
    const ANIM_END = 0.70;
    const normalized = progress <= ANIM_START ? 0
      : progress >= ANIM_END ? 1
      : (progress - ANIM_START) / (ANIM_END - ANIM_START);

    const step = Math.min(3, Math.floor(normalized * 4));
    setActiveStep(step);
  });

  const steps = t('appBuilderShowcase.steps', { returnObjects: true }) as BuilderStep[];
  const stats = t('appBuilderShowcase.stats', { returnObjects: true }) as Array<{ value: string; label: string }>;
  const statIcons = [FiServer, FiClock, FiLayers];

  const currentStep = steps[activeStep];

  // Visual content for each step
  const stepVisuals = [
    // Step 1: Descreva — chat-like prompt box
    <Box key="describe" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Chat</Text>
        </HStack>
        <Box
          w="full"
          p={4}
          borderRadius="lg"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Text color="whiteAlpha.800" fontSize="sm" fontStyle="italic">
            &ldquo;Preciso de um sistema de credito completo: originacao, aprovacao automatica, contratos digitais e auditoria.&rdquo;
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
                animation: `typingDot 1.4s ease-in-out ${dot * 0.2}s infinite`,
                '@keyframes typingDot': {
                  '0%, 60%, 100%': { transform: 'translateY(0)' },
                  '30%': { transform: 'translateY(-4px)' },
                },
              }}
            />
          ))}
          <Text color="whiteAlpha.400" fontSize="xs" ml={2}>IA modelando sistema...</Text>
        </HStack>
      </VStack>
    </Box>,

    // Step 2: IA Modela — block diagram
    <Box key="model" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={4}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Arquitetura Gerada</Text>
        </HStack>
        <Flex w="full" direction="column" gap={3}>
          {[
            { name: 'IAM', desc: 'Identidade & Acesso' },
            { name: 'Decision Engine', desc: 'Regras de aprovacao' },
            { name: 'Audit Trail', desc: 'Log imutavel' },
            { name: 'Payments', desc: 'Gateway integrado' },
          ].map((block, i) => (
            <Box key={block.name}>
              {i > 0 && (
                <Box
                  w="2px"
                  h="12px"
                  bg="orange.400"
                  mx="auto"
                  borderStyle="dashed"
                  opacity={0.5}
                  mb={3}
                />
              )}
              <HStack
                px={4}
                py={2.5}
                borderRadius="lg"
                bg="whiteAlpha.50"
                border="1px dashed"
                borderColor="orange.400"
                justify="space-between"
              >
                <Text color="orange.300" fontSize="sm" fontWeight="700">{block.name}</Text>
                <Text color="whiteAlpha.500" fontSize="xs">{block.desc}</Text>
              </HStack>
            </Box>
          ))}
        </Flex>
      </VStack>
    </Box>,

    // Step 3: Revise — config preview
    <Box key="review" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Configuracoes Revisadas</Text>
        </HStack>
        {[
          'Regras de aprovacao',
          'Limites de credito',
          'Fluxo de assinatura',
          'Audit trail ativado',
        ].map((item, i) => (
          <HStack key={i} spacing={3} w="full" px={3} py={2.5} borderRadius="md" bg="whiteAlpha.50">
            <Box as={FiCheck} color="orange.400" boxSize={4} flexShrink={0} />
            <Text color="whiteAlpha.800" fontSize="sm">{item}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>,

    // Step 4: Publique — API endpoints preview
    <Box key="publish" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="green.400">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">API Publicada</Text>
        </HStack>
        {[
          { method: 'POST', path: '/api/credit/apply' },
          { method: 'GET', path: '/api/credit/:id/status' },
          { method: 'POST', path: '/api/contracts/sign' },
        ].map((endpoint, i) => (
          <HStack key={i} spacing={3} w="full" px={3} py={2} borderRadius="md" bg="whiteAlpha.50" fontFamily="mono">
            <Box
              px={2}
              py={0.5}
              borderRadius="md"
              bg={endpoint.method === 'POST' ? 'orange.900' : 'blue.900'}
              border="1px solid"
              borderColor={endpoint.method === 'POST' ? 'orange.600' : 'blue.600'}
            >
              <Text color={endpoint.method === 'POST' ? 'orange.300' : 'blue.300'} fontSize="xs" fontWeight="700">
                {endpoint.method}
              </Text>
            </Box>
            <Text color="whiteAlpha.800" fontSize="xs">{endpoint.path}</Text>
          </HStack>
        ))}
        <HStack spacing={2} pt={1}>
          <Box as={FiCheck} color="green.400" boxSize={3} />
          <Text color="green.400" fontSize="xs" fontWeight="600">TLS 1.3 + autenticacao OAuth2</Text>
        </HStack>
      </VStack>
    </Box>,
  ];

  return (
    <Box id="app-builder" as="section" ref={sectionRef} position="relative" bg="gray.900" minH="400vh">
      {/* Sticky visual container */}
      <Box
        position="sticky"
        top={0}
        h="100vh"
        display="flex"
        alignItems="center"
        overflow="hidden"
      >
      <Box
        position="absolute"
        top="-20%"
        left="30%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(251, 146, 60, 0.15) 0%, transparent 60%)"
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
                &#10022; {t('appBuilderShowcase.badge')}
              </Text>
            </HStack>

            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="800"
              color="white"
              lineHeight="1.2"
              maxW="700px"
            >
              {t('appBuilderShowcase.heading')}{' '}
              <GradientText
                gradient="linear(to-r, orange.300, orange.400, yellow.400)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('appBuilderShowcase.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="500px">
              {t('appBuilderShowcase.subtitle')}
            </Text>
          </VStack>
        </MotionBox>

        {/* Step Tabs */}
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
            <HStack spacing={{ base: 2, md: 3 }}>
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                const isPast = i < activeStep;
                const number = String(i + 1).padStart(2, '0');
                return (
                  <Box key={step.label} display="flex" alignItems="center">
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
                      px={{ base: 3, md: 5 }}
                      py={{ base: 2, md: 2.5 }}
                      borderRadius="full"
                      bg={isActive ? 'whiteAlpha.150' : 'transparent'}
                      border="1px solid"
                      borderColor={isActive ? 'orange.400' : isPast ? 'orange.400' : 'whiteAlpha.200'}
                      transition="all 0.3s"
                      flexShrink={0}
                    >
                      <HStack spacing={2}>
                        <Text
                          color={isActive ? 'orange.300' : isPast ? 'orange.400' : 'whiteAlpha.400'}
                          fontSize={{ base: 'xs', md: 'sm' }}
                          fontWeight="700"
                        >
                          {number}
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

        {/* Main Content */}
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
            {/* Visual */}
            <Box flex={{ lg: 3 }} w="full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.98 }}
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
                  key={activeStep}
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
                          {String(activeStep + 1).padStart(2, '0')}
                        </Text>
                      </Box>
                      <Heading
                        as="h3"
                        fontSize={{ base: 'xl', md: '2xl' }}
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

                    <List spacing={3} w="full">
                      {currentStep.bullets.map((bullet, i) => (
                        <ListItem key={bullet} listStyleType="none">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                          >
                            <HStack
                              align="center"
                              color="whiteAlpha.800"
                              fontSize={{ base: 'sm', md: 'md' }}
                            >
                              <Icon as={FiCheck} color="orange.300" fontSize="md" mr={2} flexShrink={0} />
                              <Text>{bullet}</Text>
                            </HStack>
                          </motion.div>
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Flex>
        </MotionBox>

        {/* Bottom Stats Bar */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Flex
            justify="center"
            mt={{ base: 12, md: 16 }}
            gap={{ base: 6, md: 12 }}
            flexWrap="wrap"
          >
            {stats.map((stat, i) => (
              <HStack key={stat.label} spacing={3}>
                <Box
                  p={2.5}
                  borderRadius="xl"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                >
                  <Icon as={statIcons[i]} color="orange.300" boxSize={5} />
                </Box>
                <VStack align="flex-start" spacing={0}>
                  <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
                    {stat.value}
                  </Text>
                  <Text color="whiteAlpha.500" fontSize="xs">
                    {stat.label}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </Flex>
        </MotionBox>
      </Container>
      <ScrollHint scrollYProgress={scrollYProgress} color="orange.300" label={t('scrollHint')} />
      </Box>
    </Box>
  );
}
