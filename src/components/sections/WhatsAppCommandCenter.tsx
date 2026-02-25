import { useState, useRef } from 'react';
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
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { MotionBox } from '../motion';
import { GradientText } from '../shared/GradientText';
import { BrowserFrame } from '../shared/BrowserFrame';
import { BehindTheScenesTimeline } from '../shared/BehindTheScenesTimeline';
import { ScrollHint } from '../shared/ScrollHint';

interface ChatMessage {
  text: string;
  sent: boolean;
  delay: number;
}

interface TimelineEvent {
  title: string;
  detail: string;
  delay: number;
}

export function WhatsAppCommandCenter() {
  const { t } = useTranslation('home');
  const chatMessages = t('whatsAppCommandCenter.chatMessages', { returnObjects: true }) as ChatMessage[];
  const timelineEvents = t('whatsAppCommandCenter.timeline', { returnObjects: true }) as TimelineEvent[];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [visibleTimelineEvents, setVisibleTimelineEvents] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    // Remap raw progress into active zone, leaving buffers at start/end
    // 0–5% = lead-in buffer, 5–65% = animation zone, 65–100% = tail buffer (absorbs momentum)
    const ANIM_START = 0.05;
    const ANIM_END = 0.65;
    const normalized = progress <= ANIM_START ? 0
      : progress >= ANIM_END ? 1
      : (progress - ANIM_START) / (ANIM_END - ANIM_START);

    // 4 chat msgs: evenly spaced within normalized range
    const chatThresholds = [0.05, 0.30, 0.55, 0.80];
    // 6 timeline events: slightly ahead of chat, spread evenly
    const timelineThresholds = [0.08, 0.22, 0.36, 0.50, 0.65, 0.80];

    const msgs = chatThresholds.filter(t => normalized >= t).length;
    const evts = timelineThresholds.filter(t => normalized >= t).length;
    setVisibleMessages(msgs);
    setVisibleTimelineEvents(evts);
  });

  return (
    <Box
      as="section"
      ref={sectionRef}
      position="relative"
      bg="gray.900"
      minH="300vh"
    >
      {/* Sticky visual container */}
      <Box
        position="sticky"
        top={0}
        h="100vh"
        display="flex"
        alignItems="center"
        overflow="hidden"
      >
      {/* Green gradient for WhatsApp identity */}
      <Box
        position="absolute"
        top="-10%"
        left="20%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(37, 211, 102, 0.1) 0%, transparent 60%)"
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
                &#9679; {t('whatsAppCommandCenter.badge')}
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
              {t('whatsAppCommandCenter.heading')}{' '}
              <GradientText
                gradient="linear(to-r, green.300, green.400, brand.300)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('whatsAppCommandCenter.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
              {t('whatsAppCommandCenter.subtitle')}
            </Text>
          </VStack>
        </MotionBox>

        {/* Split screen: Chat + Timeline */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={{ base: 8, lg: 6 }}
            align="stretch"
          >
            {/* Left: WhatsApp Chat */}
            <Box flex={1}>
              <Box
                borderRadius="2xl"
                overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.200"
                bg="#0B141A"
              >
                {/* Chat header */}
                <HStack
                  px={4}
                  py={3}
                  bg="#1F2C34"
                  borderBottom="1px solid"
                  borderColor="whiteAlpha.100"
                  spacing={3}
                >
                  <Box w="36px" h="36px" borderRadius="full" bg="whatsapp.500" display="flex" alignItems="center" justifyContent="center">
                    <Text color="white" fontSize="sm" fontWeight="700">IA</Text>
                  </Box>
                  <VStack align="flex-start" spacing={0}>
                    <Text color="white" fontSize="sm" fontWeight="600">
                      {t('whatsAppCommandCenter.chatTitle')}
                    </Text>
                    <Text color="whatsapp.300" fontSize="xs">online</Text>
                  </VStack>
                </HStack>

                {/* Chat messages */}
                <VStack align="stretch" spacing={2} p={4} minH="300px">
                  {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                    <MotionBox
                      key={i}
                      initial={{ opacity: 0, x: msg.sent ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      alignSelf={msg.sent ? 'flex-end' : 'flex-start'}
                      maxW="80%"
                    >
                      <Box
                        px={3}
                        py={2}
                        borderRadius="lg"
                        bg={msg.sent ? '#005C4B' : '#1F2C34'}
                        borderTopLeftRadius={msg.sent ? 'lg' : 'xs'}
                        borderTopRightRadius={msg.sent ? 'xs' : 'lg'}
                      >
                        <Text color="white" fontSize="sm" whiteSpace="pre-wrap">
                          {msg.text}
                        </Text>
                      </Box>
                    </MotionBox>
                  ))}

                  {/* Typing indicator */}
                  {visibleMessages > 0 && visibleMessages < chatMessages.length && (
                    <MotionBox
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      alignSelf={chatMessages[visibleMessages]?.sent ? 'flex-end' : 'flex-start'}
                    >
                      <HStack
                        px={4}
                        py={2}
                        borderRadius="lg"
                        bg="#1F2C34"
                        spacing={1}
                      >
                        {[0, 1, 2].map((dot) => (
                          <Box
                            key={dot}
                            w="6px"
                            h="6px"
                            borderRadius="full"
                            bg="whiteAlpha.400"
                            sx={{
                              animation: `typingDot 1.4s ease-in-out ${dot * 0.2}s infinite`,
                              '@keyframes typingDot': {
                                '0%, 60%, 100%': { transform: 'translateY(0)' },
                                '30%': { transform: 'translateY(-4px)' },
                              },
                            }}
                          />
                        ))}
                      </HStack>
                    </MotionBox>
                  )}
                </VStack>
              </Box>
            </Box>

            {/* Right: Behind the scenes timeline */}
            <Box flex={1}>
              <BrowserFrame url="panel.catalisa.app/operations">
                <Box p={4} minH="300px" bg="#1a1a2e">
                  <HStack mb={4} spacing={2}>
                    <Box w="8px" h="8px" borderRadius="full" bg="brand.400" />
                    <Text color="whiteAlpha.700" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wider">
                      Behind the scenes
                    </Text>
                  </HStack>
                  <BehindTheScenesTimeline
                    events={timelineEvents}
                    visibleCount={visibleTimelineEvents}
                  />
                </Box>
              </BrowserFrame>
            </Box>
          </Flex>
        </MotionBox>
      </Container>
      <ScrollHint scrollYProgress={scrollYProgress} color="green.300" label={t('scrollHint')} />
      </Box>
    </Box>
  );
}
