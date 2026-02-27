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
  List,
  ListItem,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiCode, FiClock, FiSliders } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';

interface BuilderStep {
  label: string;
  title: string;
  description: string;
  bullets: string[];
}

export function AgentBuilderShowcase() {
  const { t } = useTranslation('home');
  const [activeStep, setActiveStep] = useState(0);

  const steps = t('agentBuilder.steps', { returnObjects: true }) as BuilderStep[];
  const stats = t('agentBuilder.stats', { returnObjects: true }) as Array<{ value: string; label: string }>;
  const statIcons = [FiCode, FiClock, FiSliders];

  const currentStep = steps[activeStep];

  // Visual content for each step
  const stepVisuals = [
    // Step 1: Job description
    <Box key="describe" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="brand.400" />
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
            &ldquo;Preciso de um SDR que qualifique leads pelo WhatsApp, agende reunioes e envie propostas personalizadas.&rdquo;
          </Text>
        </Box>
        <HStack spacing={1}>
          {[0, 1, 2].map((dot) => (
            <Box
              key={dot}
              w="6px"
              h="6px"
              borderRadius="full"
              bg="brand.400"
              sx={{
                animation: `typingDot 1.4s ease-in-out ${dot * 0.2}s infinite`,
                '@keyframes typingDot': {
                  '0%, 60%, 100%': { transform: 'translateY(0)' },
                  '30%': { transform: 'translateY(-4px)' },
                },
              }}
            />
          ))}
          <Text color="whiteAlpha.400" fontSize="xs" ml={2}>IA analisando...</Text>
        </HStack>
      </VStack>
    </Box>,
    // Step 2: AI interview
    <Box key="interview" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={2}>
          <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
          <Text color="whiteAlpha.500" fontSize="xs" textTransform="uppercase" letterSpacing="wider">Entrevista IA</Text>
        </HStack>
        {['Tom de voz: Profissional e amigavel', 'Limite de autonomia: Escalar acima de R$ 10k', 'Ferramentas: CRM, Calendario, WhatsApp'].map((item, i) => (
          <HStack key={i} spacing={2} w="full" px={3} py={2} borderRadius="md" bg="whiteAlpha.50">
            <Box as={FiCheck} color="green.400" boxSize={3} />
            <Text color="whiteAlpha.700" fontSize="sm">{item}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>,
    // Step 3: Profile ready
    <Box key="profile" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={3}>
          <Box w="40px" h="40px" borderRadius="full" bg="blue.500" display="flex" alignItems="center" justifyContent="center">
            <Text color="white" fontWeight="700">S</Text>
          </Box>
          <VStack align="flex-start" spacing={0}>
            <Text color="white" fontSize="sm" fontWeight="700">SDR Digital</Text>
            <Text color="green.400" fontSize="xs">Pronto para ativar</Text>
          </VStack>
        </HStack>
        <Box w="full" h="1px" bg="whiteAlpha.100" />
        {['Personalidade: Consultivo, proativo', 'Base: 3 documentos importados', 'Ferramentas: CRM + Calendario + WhatsApp', 'Regras: 12 regras de negocio'].map((item, i) => (
          <HStack key={i} spacing={2}>
            <Box as={FiCheck} color="brand.400" boxSize={3} />
            <Text color="whiteAlpha.600" fontSize="xs">{item}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>,
    // Step 4: Active
    <Box key="active" p={6} bg="#0f0f1a" borderRadius="xl" border="1px solid" borderColor="green.400">
      <VStack align="flex-start" spacing={3}>
        <HStack spacing={3}>
          <Box w="40px" h="40px" borderRadius="full" bg="green.500" display="flex" alignItems="center" justifyContent="center">
            <Box as={FiCheck} color="white" boxSize={5} />
          </Box>
          <VStack align="flex-start" spacing={0}>
            <Text color="white" fontSize="sm" fontWeight="700">SDR Digital ativo!</Text>
            <Text color="green.400" fontSize="xs">Operando agora</Text>
          </VStack>
        </HStack>
        <Box w="full" h="1px" bg="whiteAlpha.100" />
        <HStack spacing={6} w="full">
          {[{ v: '0', l: 'conversas' }, { v: '0', l: 'leads' }, { v: '0s', l: 'resposta' }].map((stat, i) => (
            <VStack key={i} spacing={0}>
              <Text color="white" fontSize="lg" fontWeight="700">{stat.v}</Text>
              <Text color="whiteAlpha.500" fontSize="2xs">{stat.l}</Text>
            </VStack>
          ))}
        </HStack>
      </VStack>
    </Box>,
  ];

  return (
    <Box as="section" position="relative" bg="gray.900" overflow="hidden">
      <Box
        position="absolute"
        top="-20%"
        left="30%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 60%)"
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
              <Text color="brand.300" fontSize="sm" fontWeight="600">
                &#10022; {t('agentBuilder.badge')}
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
              {t('agentBuilder.heading')}{' '}
              <GradientText
                gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('agentBuilder.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="500px">
              {t('agentBuilder.subtitle')}
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
                        bg={isPast || isActive ? 'brand.400' : 'whiteAlpha.200'}
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
                      borderColor={isActive ? 'brand.400' : isPast ? 'brand.400' : 'whiteAlpha.200'}
                      cursor="pointer"
                      transition="all 0.3s"
                      _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.300' }}
                      flexShrink={0}
                    >
                      <HStack spacing={2}>
                        <Text
                          color={isActive ? 'brand.300' : isPast ? 'brand.400' : 'whiteAlpha.400'}
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
                        bgGradient="linear(to-r, brand.500, brand.400)"
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
                              <Icon as={FiCheck} color="brand.300" fontSize="md" mr={2} flexShrink={0} />
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
                  <Icon as={statIcons[i]} color="brand.300" boxSize={5} />
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
    </Box>
  );
}
