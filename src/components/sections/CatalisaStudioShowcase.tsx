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
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiCode, FiClock, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';

interface StudioStep {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
  /** For step 3: sub-tab images */
  subTabs?: { label: string; image: string }[];
  cropPosition: string;
}

const panelVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.98 },
};

export function CatalisaStudioShowcase() {
  const { t } = useTranslation('home');
  const [activeStep, setActiveStep] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);

  const subTabLabels = t('studioShowcase.steps.2.subTabs', { returnObjects: true }) as string[];

  const steps: StudioStep[] = [
    {
      id: 'describe',
      number: '01',
      label: t('studioShowcase.steps.0.label'),
      title: t('studioShowcase.steps.0.title'),
      description: t('studioShowcase.steps.0.description'),
      bullets: t('studioShowcase.steps.0.bullets', { returnObjects: true }) as string[],
      image: '/screenshots/studio/builder-home-real.jpg',
      cropPosition: 'center 30%',
    },
    {
      id: 'refine',
      number: '02',
      label: t('studioShowcase.steps.1.label'),
      title: t('studioShowcase.steps.1.title'),
      description: t('studioShowcase.steps.1.description'),
      bullets: t('studioShowcase.steps.1.bullets', { returnObjects: true }) as string[],
      image: '/screenshots/studio/builder-clarify-real.jpg',
      cropPosition: 'center 55%',
    },
    {
      id: 'spec',
      number: '03',
      label: t('studioShowcase.steps.2.label'),
      title: t('studioShowcase.steps.2.title'),
      description: t('studioShowcase.steps.2.description'),
      bullets: t('studioShowcase.steps.2.bullets', { returnObjects: true }) as string[],
      image: '/screenshots/studio/builder-requirements-real.jpg',
      subTabs: [
        { label: subTabLabels[0], image: '/screenshots/studio/builder-requirements-real.jpg' },
        { label: subTabLabels[1], image: '/screenshots/studio/builder-design-real.jpg' },
        { label: subTabLabels[2], image: '/screenshots/studio/builder-tasks-real.jpg' },
      ],
      cropPosition: 'center 35%',
    },
    {
      id: 'execute',
      number: '04',
      label: t('studioShowcase.steps.3.label'),
      title: t('studioShowcase.steps.3.title'),
      description: t('studioShowcase.steps.3.description'),
      bullets: t('studioShowcase.steps.3.bullets', { returnObjects: true }) as string[],
      image: '/screenshots/studio/builder-tasks-real.jpg',
      cropPosition: 'center 60%',
    },
  ];

  const stats = [
    { icon: FiCode, value: t('studioShowcase.stats.0.value'), label: t('studioShowcase.stats.0.label') },
    { icon: FiClock, value: t('studioShowcase.stats.1.value'), label: t('studioShowcase.stats.1.label') },
    { icon: FiShield, value: t('studioShowcase.stats.2.value'), label: t('studioShowcase.stats.2.label') },
  ];

  const currentStep = steps[activeStep];
  const currentImage = currentStep.subTabs
    ? currentStep.subTabs[activeSubTab].image
    : currentStep.image;

  const handleStepChange = (index: number) => {
    setActiveStep(index);
    setActiveSubTab(0);
  };

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
        top="-20%"
        left="30%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="10%"
        w="40%"
        h="40%"
        bgGradient="radial(circle, rgba(37, 211, 102, 0.06) 0%, transparent 60%)"
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
            {/* Badge */}
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
                &#10022; {t('studioShowcase.badge')}
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
              {t('studioShowcase.heading')}{' '}
              <GradientText
                gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('studioShowcase.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="500px">
              {t('studioShowcase.subtitle')}
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
            <HStack spacing={{ base: 2, md: 3 }} position="relative">
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                const isPast = i < activeStep;
                return (
                  <Box key={step.id} display="flex" alignItems="center">
                    {/* Connector line */}
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
                      onClick={() => handleStepChange(i)}
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
                      position="relative"
                      overflow="hidden"
                    >
                      {isActive && (
                        <Box
                          position="absolute"
                          inset={0}
                          bgGradient="linear(to-r, rgba(115, 75, 156, 0.2), rgba(115, 75, 156, 0.05))"
                          pointerEvents="none"
                        />
                      )}
                      <HStack spacing={2}>
                        <Text
                          color={isActive ? 'brand.300' : isPast ? 'brand.400' : 'whiteAlpha.400'}
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
            {/* Screenshot */}
            <Box flex={{ lg: 3 }} w="full">
              {/* Sub-tabs for Step 3 */}
              {currentStep.subTabs && (
                <HStack spacing={2} mb={4}>
                  {currentStep.subTabs.map((tab, i) => (
                    <Box
                      key={tab.label}
                      as="button"
                      onClick={() => setActiveSubTab(i)}
                      px={3}
                      py={1.5}
                      borderRadius="lg"
                      bg={i === activeSubTab ? 'whiteAlpha.150' : 'transparent'}
                      border="1px solid"
                      borderColor={i === activeSubTab ? 'brand.400' : 'whiteAlpha.100'}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ bg: 'whiteAlpha.100' }}
                    >
                      <Text
                        color={i === activeSubTab ? 'white' : 'whiteAlpha.500'}
                        fontSize="xs"
                        fontWeight={i === activeSubTab ? '600' : '400'}
                      >
                        {tab.label}
                      </Text>
                    </Box>
                  ))}
                </HStack>
              )}

              <Box
                position="relative"
                overflow="hidden"
                borderRadius="2xl"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentStep.id}-${activeSubTab}`}
                    variants={panelVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <Image
                      src={currentImage}
                      alt={currentStep.title}
                      w="100%"
                      h={{ base: '240px', sm: '300px', md: '380px', xl: '420px' }}
                      objectFit="cover"
                      objectPosition={currentStep.cropPosition}
                    />
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Box>

            {/* Description */}
            <Box flex={{ lg: 2 }} w="full" pt={{ lg: 4 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <VStack align="flex-start" spacing={5}>
                    {/* Step number + title */}
                    <HStack spacing={3}>
                      <Box
                        px={3}
                        py={1}
                        borderRadius="lg"
                        bgGradient="linear(to-r, brand.500, brand.400)"
                      >
                        <Text color="white" fontSize="sm" fontWeight="700">
                          {currentStep.number}
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

                    {/* Bullets with stagger */}
                    <List spacing={3} w="full">
                      {currentStep.bullets.map((bullet, i) => (
                        <motion.div
                          key={bullet}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                        >
                          <ListItem
                            display="flex"
                            alignItems="center"
                            color="whiteAlpha.800"
                            fontSize={{ base: 'sm', md: 'md' }}
                          >
                            <ListIcon
                              as={FiCheck}
                              color="brand.300"
                              fontSize="md"
                              mr={2}
                            />
                            {bullet}
                          </ListItem>
                        </motion.div>
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
            {stats.map((stat) => (
              <HStack key={stat.label} spacing={3}>
                <Box
                  p={2.5}
                  borderRadius="xl"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                >
                  <Icon as={stat.icon} color="brand.300" boxSize={5} />
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
