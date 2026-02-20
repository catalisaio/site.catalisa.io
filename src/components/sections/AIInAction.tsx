import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Flex,
  Image,
  Icon,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlay, FiZap, FiCpu, FiClock, FiCode } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';
import { BrowserFrame } from '../shared/BrowserFrame';
import { PhoneMockup } from '../shared/PhoneMockup';

interface CaseStep {
  number: string;
  label: string;
  title: string;
  description: string;
  image: string;
  highlight: string;
  /** If present, shows split view with phone video */
  mobileVideo?: string;
}

const panelVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.98 },
};

export function AIInAction() {
  const { t } = useTranslation('home');
  const lp = useLocalizedPath();
  const [activeStep, setActiveStep] = useState(0);

  const caseSteps: CaseStep[] = [
    {
      number: '01',
      label: t('aiInAction.steps.0.label'),
      title: t('aiInAction.steps.0.title'),
      description: t('aiInAction.steps.0.description'),
      image: '/screenshots/case/ai-assistant-plan.jpg',
      highlight: t('aiInAction.steps.0.highlight'),
    },
    {
      number: '02',
      label: t('aiInAction.steps.1.label'),
      title: t('aiInAction.steps.1.title'),
      description: t('aiInAction.steps.1.description'),
      image: '/screenshots/case/ai-assistant-plan.jpg',
      highlight: t('aiInAction.steps.1.highlight'),
    },
    {
      number: '03',
      label: t('aiInAction.steps.2.label'),
      title: t('aiInAction.steps.2.title'),
      description: t('aiInAction.steps.2.description'),
      image: '/screenshots/case/ai-assistant-executing.jpg',
      highlight: t('aiInAction.steps.2.highlight'),
    },
    {
      number: '04',
      label: t('aiInAction.steps.3.label'),
      title: t('aiInAction.steps.3.title'),
      description: t('aiInAction.steps.3.description'),
      image: '/screenshots/case/workflow-complete.jpg',
      mobileVideo: '/videos/whatsapp-demo.mp4',
      highlight: t('aiInAction.steps.3.highlight'),
    },
  ];

  const resultStats = [
    { icon: FiCpu, value: t('aiInAction.resultStats.0.value'), label: t('aiInAction.resultStats.0.label') },
    { icon: FiZap, value: t('aiInAction.resultStats.1.value'), label: t('aiInAction.resultStats.1.label') },
    { icon: FiClock, value: t('aiInAction.resultStats.2.value'), label: t('aiInAction.resultStats.2.label') },
    { icon: FiCode, value: t('aiInAction.resultStats.3.value'), label: t('aiInAction.resultStats.3.label') },
  ];

  const currentStep = caseSteps[activeStep];

  return (
    <Box
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
        bgGradient="radial(circle, rgba(37, 211, 102, 0.08) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-15%"
        left="10%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.1) 0%, transparent 60%)"
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
              <Text color="green.300" fontSize="sm" fontWeight="600">
                &#9679; {t('aiInAction.badge')}
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
              {t('aiInAction.heading')}{' '}
              <GradientText
                gradient="linear(to-r, green.300, green.400, brand.300)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('aiInAction.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="550px">
              {t('aiInAction.subtitle')}
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
                        bg={isPast || isActive ? 'green.400' : 'whiteAlpha.200'}
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
                      borderColor={isActive ? 'green.400' : isPast ? 'green.400' : 'whiteAlpha.200'}
                      cursor="pointer"
                      transition="all 0.3s"
                      _hover={{ bg: 'whiteAlpha.100', borderColor: 'green.300' }}
                      flexShrink={0}
                      position="relative"
                      overflow="hidden"
                    >
                      {isActive && (
                        <Box
                          position="absolute"
                          inset={0}
                          bgGradient="linear(to-r, rgba(37, 211, 102, 0.15), rgba(37, 211, 102, 0.05))"
                          pointerEvents="none"
                        />
                      )}
                      <HStack spacing={2}>
                        <Text
                          color={isActive ? 'green.300' : isPast ? 'green.400' : 'whiteAlpha.400'}
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

        {/* Main Content: Screenshot + Description */}
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
            {/* Screenshot / Split View */}
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
                  {currentStep.mobileVideo ? (
                    /* Step 4: Split view - workflow canvas + phone */
                    <Flex gap={6} align="flex-start" direction={{ base: 'column', md: 'row' }}>
                      <Box flex={1}>
                        <BrowserFrame url="panel.catalisa.app/workflows">
                          <Image
                            src={currentStep.image}
                            alt={currentStep.title}
                            w="100%"
                            h={{ base: '220px', sm: '280px', md: '360px' }}
                            objectFit="cover"
                            objectPosition="center top"
                          />
                        </BrowserFrame>
                      </Box>
                      <Box
                        flexShrink={0}
                        display={{ base: 'none', md: 'block' }}
                      >
                        <PhoneMockup maxH="420px">
                          <Box
                            as="video"
                            src="/videos/whatsapp-demo.mp4"
                            poster="/screenshots/case/whatsapp-result.jpg"
                            autoPlay
                            muted
                            loop
                            playsInline
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        </PhoneMockup>
                      </Box>
                    </Flex>
                  ) : (
                    /* Steps 1-3: Single screenshot in BrowserFrame */
                    <BrowserFrame url="panel.catalisa.app">
                      <Image
                        src={currentStep.image}
                        alt={currentStep.title}
                        w="100%"
                        h={{ base: '240px', sm: '300px', md: '380px', xl: '420px' }}
                        objectFit="cover"
                        objectPosition="center top"
                      />
                    </BrowserFrame>
                  )}
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
                        bgGradient="linear(to-r, green.500, green.400)"
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
                      borderColor="green.400"
                      borderLeft="3px solid"
                      borderLeftColor="green.400"
                    >
                      <Text
                        color="green.300"
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
                  <Icon as={stat.icon} color="green.300" boxSize={5} />
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

        {/* Video Preview Strip */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Flex
            mt={{ base: 12, md: 16 }}
            direction={{ base: 'column', md: 'row' }}
            align="center"
            gap={{ base: 6, md: 8 }}
            p={{ base: 4, md: 6 }}
            borderRadius="2xl"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            {/* Preview video loop */}
            <Box
              flex={1}
              maxW={{ md: '55%' }}
              w="full"
              boxShadow="0 10px 30px -10px rgba(0, 0, 0, 0.3)"
            >
              <BrowserFrame url="panel.catalisa.app">
                <Box
                  as="video"
                  src="/videos/ai-demo-preview.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  w="100%"
                  objectFit="cover"
                  sx={{ aspectRatio: '16 / 9' }}
                />
              </BrowserFrame>
            </Box>

            {/* CTA */}
            <VStack
              flex={1}
              align={{ base: 'center', md: 'flex-start' }}
              spacing={4}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading
                as="h4"
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="700"
                color="white"
              >
                {t('aiInAction.videoSection.heading')}
              </Heading>
              <Text color="whiteAlpha.600" fontSize="sm">
                {t('aiInAction.videoSection.description')}
              </Text>
              <Button
                as={RouterLink}
                to={lp('/demo')}
                size="lg"
                leftIcon={<FiPlay />}
                bgGradient="linear(to-r, green.500, green.400)"
                color="white"
                _hover={{
                  bgGradient: 'linear(to-r, green.600, green.500)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px -5px rgba(37, 211, 102, 0.4)',
                }}
                transition="all 0.3s"
                borderRadius="xl"
              >
                {t('cta.watchFullDemo', { ns: 'common' })}
              </Button>
            </VStack>
          </Flex>
        </MotionBox>
      </Container>
    </Box>
  );
}
