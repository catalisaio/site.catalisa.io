import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';
import { BrowserFrame } from '../shared/BrowserFrame';
import { ActivityLane } from '../shared/ActivityLane';
import { AnimatedCounter } from '../shared/AnimatedCounter';

interface LaneData {
  title: string;
  events: string[];
}

const laneColors = ['blue.400', 'green.400', 'orange.400'];

export function LiveOperationsDashboard() {
  const { t } = useTranslation('home');
  const lanes = t('liveOps.lanes', { returnObjects: true }) as LaneData[];
  const statsLabels = t('liveOps.stats', { returnObjects: true }) as Record<string, string>;

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [laneEvents, setLaneEvents] = useState<string[][]>(() =>
    lanes.map((lane) => lane.events.slice(0, 3))
  );
  const [conversationCount, setConversationCount] = useState(324);
  const cycleRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addEvent = useCallback(() => {
    const laneIndex = cycleRef.current % lanes.length;
    const pool = lanes[laneIndex].events;
    const newEvent = pool[cycleRef.current % pool.length];
    cycleRef.current += 1;

    setLaneEvents((prev) =>
      prev.map((events, i) =>
        i === laneIndex ? [newEvent, ...events.slice(0, 4)] : events
      )
    );
    setConversationCount((prev) => prev + 1);
  }, [lanes]);

  useEffect(() => {
    if (!isInView) return;

    intervalRef.current = setInterval(addEvent, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView, addEvent]);

  return (
    <Box
      as="section"
      ref={sectionRef}
      position="relative"
      bg="gray.900"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-10%"
        right="20%"
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
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="green.400"
                sx={{
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Text color="green.300" fontSize="sm" fontWeight="600">
                {t('liveOps.badge')}
              </Text>
            </HStack>

            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="800"
              color="white"
              lineHeight="1.2"
            >
              {t('liveOps.heading')}{' '}
              <GradientText
                gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('liveOps.headingGradient')}
              </GradientText>
            </Heading>
          </VStack>
        </MotionBox>

        {/* Dashboard */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BrowserFrame url="panel.catalisa.app/operations">
            <Box p={{ base: 4, md: 6 }} bg="#1a1a2e" minH="400px">
              {/* Top bar */}
              <Flex
                justify="space-between"
                align="center"
                mb={6}
                pb={4}
                borderBottom="1px solid"
                borderColor="whiteAlpha.100"
              >
                <HStack spacing={3}>
                  <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
                  <Text color="white" fontSize="sm" fontWeight="700">
                    {t('liveOps.browserTitle')}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <Text color="whiteAlpha.700" fontSize="sm" fontWeight="700">
                    {conversationCount}
                  </Text>
                  <Text color="whiteAlpha.400" fontSize="xs">
                    {t('liveOps.activeConversations')}
                  </Text>
                </HStack>
              </Flex>

              {/* Activity lanes */}
              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={6}
              >
                {lanes.map((lane, i) => (
                  <ActivityLane
                    key={lane.title}
                    title={lane.title}
                    events={laneEvents[i]}
                    color={laneColors[i]}
                  />
                ))}
              </Flex>

              {/* Bottom stats bar */}
              <Flex
                justify="space-around"
                mt={6}
                pt={4}
                borderTop="1px solid"
                borderColor="whiteAlpha.100"
                flexWrap="wrap"
                gap={4}
              >
                <VStack spacing={0}>
                  <AnimatedCounter target={324} color="white" fontWeight="700" fontSize="xl" />
                  <Text color="whiteAlpha.500" fontSize="xs">{statsLabels.conversations}</Text>
                </VStack>
                <VStack spacing={0}>
                  <AnimatedCounter target={47} color="white" fontWeight="700" fontSize="xl" />
                  <Text color="whiteAlpha.500" fontSize="xs">{statsLabels.leads}</Text>
                </VStack>
                <VStack spacing={0}>
                  <AnimatedCounter target={12400} prefix="R$ " color="white" fontWeight="700" fontSize="xl" />
                  <Text color="whiteAlpha.500" fontSize="xs">{statsLabels.revenue}</Text>
                </VStack>
                <VStack spacing={0}>
                  <Text color="white" fontWeight="700" fontSize="xl">98.7%</Text>
                  <Text color="whiteAlpha.500" fontSize="xs">{statsLabels.uptime}</Text>
                </VStack>
              </Flex>
            </Box>
          </BrowserFrame>
        </MotionBox>
      </Container>
    </Box>
  );
}
