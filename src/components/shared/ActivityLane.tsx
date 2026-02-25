import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../motion';

interface ActivityLaneProps {
  title: string;
  events: string[];
  color: string;
}

export function ActivityLane({ title, events, color }: ActivityLaneProps) {
  return (
    <Box flex={1} minW="200px">
      {/* Lane header */}
      <HStack spacing={2} mb={3} pb={2} borderBottom="1px solid" borderColor="whiteAlpha.100">
        <Box w="8px" h="8px" borderRadius="full" bg={color} />
        <Text color="white" fontSize="sm" fontWeight="700">
          {title}
        </Text>
      </HStack>

      {/* Events */}
      <VStack align="stretch" spacing={2}>
        <AnimatePresence mode="popLayout">
          {events.map((event, i) => (
            <MotionBox
              key={`${event}-${i}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <HStack
                spacing={2}
                px={3}
                py={2}
                borderRadius="lg"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                <Box as={FiCheck} color={color} boxSize={3} flexShrink={0} />
                <Text color="whiteAlpha.800" fontSize="xs" noOfLines={1}>
                  {event}
                </Text>
              </HStack>
            </MotionBox>
          ))}
        </AnimatePresence>
      </VStack>
    </Box>
  );
}
