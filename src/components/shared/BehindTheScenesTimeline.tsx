import { useState, useEffect, useRef } from 'react';
import { Box, Text, HStack, VStack } from '@chakra-ui/react';
import { FiCheck, FiCpu, FiTool, FiMessageCircle, FiLoader } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../motion';

interface TimelineEvent {
  title: string;
  detail: string;
  delay: number;
}

interface BehindTheScenesTimelineProps {
  events: TimelineEvent[];
  triggerStart: boolean;
}

const eventIcons = [FiMessageCircle, FiCpu, FiTool, FiTool, FiCpu, FiCheck];

export function BehindTheScenesTimeline({ events, triggerStart }: BehindTheScenesTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!triggerStart) return;
    setVisibleCount(0);

    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    events.forEach((evt, i) => {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.max(prev, i + 1));
      }, evt.delay * 1000);
      timerRef.current.push(timer);
    });

    return () => {
      timerRef.current.forEach(clearTimeout);
    };
  }, [triggerStart, events]);

  return (
    <VStack align="stretch" spacing={0} w="full">
      <AnimatePresence>
        {events.slice(0, visibleCount).map((evt, i) => {
          const Icon = eventIcons[i] || FiCheck;
          const isLast = i === events.length - 1;
          const isCompleted = i < visibleCount - 1;

          return (
            <MotionBox
              key={evt.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HStack align="flex-start" spacing={3} pb={isLast ? 0 : 4}>
                {/* Timeline dot + line */}
                <VStack spacing={0} align="center" minW="24px">
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="full"
                    bg={isCompleted || isLast ? 'whatsapp.500' : 'whiteAlpha.200'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    transition="all 0.3s"
                  >
                    {!isCompleted && !isLast ? (
                      <Box
                        as={FiLoader}
                        color="white"
                        boxSize={3}
                        sx={{
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                    ) : (
                      <Box as={Icon} color="white" boxSize={3} />
                    )}
                  </Box>
                  {!isLast && (
                    <Box
                      w="1px"
                      flex={1}
                      minH="20px"
                      bg="whiteAlpha.200"
                    />
                  )}
                </VStack>

                {/* Content */}
                <Box pb={isLast ? 0 : 2} flex={1}>
                  <Text
                    color="whiteAlpha.900"
                    fontSize="sm"
                    fontWeight="600"
                  >
                    {evt.title}
                  </Text>
                  <Text
                    color="whiteAlpha.500"
                    fontSize="xs"
                    fontFamily="mono"
                    mt={0.5}
                  >
                    {evt.detail}
                  </Text>
                </Box>
              </HStack>
            </MotionBox>
          );
        })}
      </AnimatePresence>
    </VStack>
  );
}
