import { useRef, useState } from 'react';
import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiMessageCircle, FiCpu, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  motion,
} from 'framer-motion';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { MotionBox } from '../../motion';

interface TimelineEvent {
  title: string;
  detail: string;
}

interface AnatomyStep {
  chat: { text: string; sent: boolean };
  timeline: TimelineEvent[];
}

export function AnatomySection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const stepsRaw = t('anatomy.steps', { returnObjects: true });
  const steps = (Array.isArray(stepsRaw) ? stepsRaw : []) as AnatomyStep[];

  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeSteps, setActiveSteps] = useState(0);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 20%'],
  });

  // Zipper line: grows from top to bottom with spring physics
  const rawScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleY = useSpring(rawScaleY, { stiffness: 80, damping: 30, mass: 0.8 });

  // Calculate active steps based on scroll progress (bidirectional)
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (steps.length === 0) return;
    const count = steps.filter(
      (_, i) => progress >= (i + 0.5) / steps.length,
    ).length;
    setActiveSteps(count);
  });

  return (
    <SectionWrapper bg="gray.50" id="anatomy">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="white"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="gray.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('anatomy.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('anatomy.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('anatomy.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
          {t('anatomy.subtitle')}
        </Text>

        {/* Multi-model note */}
        <Box
          mt={2}
          px={5}
          py={3}
          borderRadius="xl"
          bg="brand.50"
          border="1px solid"
          borderColor="brand.200"
          maxW="600px"
        >
          <Text fontSize="xs" color="brand.700" fontWeight="500">
            {t('anatomy.multiModelNote')}
          </Text>
        </Box>
      </VStack>

      <VStack
        ref={timelineRef}
        spacing={0}
        maxW="900px"
        mx="auto"
        position="relative"
      >
        {/* Background track (gray) */}
        <Box
          position="absolute"
          left={{ base: '20px', md: '50%' }}
          top="0"
          bottom="0"
          w="2px"
          bg="gray.200"
          transform={{ md: 'translateX(-1px)' }}
        />

        {/* Zipper line (brand purple, grows with scroll) */}
        <Box
          position="absolute"
          left={{ base: '20px', md: '50%' }}
          top="0"
          bottom="0"
          w="2px"
          transform={{ md: 'translateX(-1px)' }}
          zIndex={1}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--chakra-colors-brand-500)',
              transformOrigin: 'top',
              scaleY,
            }}
          />
        </Box>

        {steps.map((step, i) => {
          const isActive = i < activeSteps;

          return (
            <Box key={i} w="full">
              <Flex
                direction={{
                  base: 'column',
                  md: i % 2 === 0 ? 'row' : 'row-reverse',
                }}
                gap={4}
                align="flex-start"
                py={4}
                position="relative"
              >
                {/* Dot indicator — pops in when active */}
                <MotionBox
                  position={{ md: 'absolute' }}
                  left={{ base: '12px', md: '50%' }}
                  transform={{ md: 'translateX(-50%)' }}
                  w="18px"
                  h="18px"
                  borderRadius="full"
                  border="3px solid"
                  borderColor="white"
                  zIndex={2}
                  flexShrink={0}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.5,
                    backgroundColor: isActive
                      ? 'var(--chakra-colors-brand-500)'
                      : 'var(--chakra-colors-gray-300)',
                    boxShadow: isActive
                      ? '0 0 0 2px var(--chakra-colors-brand-200)'
                      : '0 0 0 2px transparent',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* Chat bubble — slides in from corresponding side */}
                <MotionBox
                  flex={1}
                  ml={{ base: '40px', md: i % 2 === 0 ? 0 : 8 }}
                  mr={{ md: i % 2 === 0 ? 8 : 0 }}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : i % 2 === 0 ? -30 : 30,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Box
                    p={4}
                    borderRadius="xl"
                    bg={step.chat.sent ? 'whatsapp.500' : 'white'}
                    color={step.chat.sent ? 'white' : 'gray.800'}
                    border={step.chat.sent ? 'none' : '1px solid'}
                    borderColor="gray.200"
                    maxW="350px"
                    ml={step.chat.sent ? 'auto' : 0}
                    mr={step.chat.sent ? 0 : 'auto'}
                  >
                    <HStack spacing={2} mb={1}>
                      <Icon
                        as={step.chat.sent ? FiCpu : FiMessageCircle}
                        boxSize={3}
                        opacity={0.7}
                      />
                      <Text fontSize="2xs" opacity={0.7}>
                        {step.chat.sent ? 'Agente IA' : 'Cliente'}
                      </Text>
                    </HStack>
                    <Text fontSize="sm">{step.chat.text}</Text>
                  </Box>
                </MotionBox>

                {/* Timeline events — fade in with stagger */}
                <Box
                  flex={1}
                  ml={{ base: '40px', md: i % 2 === 0 ? 8 : 0 }}
                  mr={{ md: i % 2 === 0 ? 0 : 8 }}
                >
                  <VStack align="stretch" spacing={2}>
                    {step.timeline.map((event, j) => (
                      <MotionBox
                        key={j}
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : 15,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeOut',
                          delay: isActive ? j * 0.08 : 0,
                        }}
                      >
                        <HStack
                          p={3}
                          borderRadius="lg"
                          bg="white"
                          border="1px solid"
                          borderColor="gray.200"
                          spacing={3}
                        >
                          <Icon as={FiCheck} boxSize={4} color="brand.500" />
                          <VStack align="flex-start" spacing={0}>
                            <Text fontSize="xs" fontWeight="600" color="gray.700">
                              {event.title}
                            </Text>
                            <Text fontSize="2xs" color="gray.400">
                              {event.detail}
                            </Text>
                          </VStack>
                        </HStack>
                      </MotionBox>
                    ))}
                  </VStack>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </VStack>
    </SectionWrapper>
  );
}
