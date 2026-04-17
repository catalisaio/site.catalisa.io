import { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Heading, Text, Image, IconButton, HStack } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../../motion';
import type { StepByStepBlock as StepByStepBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: StepByStepBlockType;
}

export function StepByStepBlock({ block }: Props) {
  const [current, setCurrent] = useState(0);
  const total = block.steps.length;
  const step = block.steps[current];

  const goNext = useCallback(() => {
    setCurrent(prev => Math.min(prev + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent(prev => Math.max(prev - 1, 0));
  }, []);

  // Auto-play
  useEffect(() => {
    if (!block.autoPlay) return;
    const interval = setInterval(goNext, block.autoPlayInterval || 5000);
    return () => clearInterval(interval);
  }, [block.autoPlay, block.autoPlayInterval, goNext]);

  return (
    <Box w="full" border="1px solid" borderColor="gray.200" borderRadius="xl" overflow="hidden" bg="white">
      {/* Progress bar */}
      <Box h="3px" bg="gray.100">
        <Box h="full" bg="purple.500" transition="width 0.3s" w={`${((current + 1) / total) * 100}%`} />
      </Box>

      {/* Content */}
      <Box p={5} minH="200px" position="relative">
        <AnimatePresence mode="wait">
          <MotionBox
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Text fontSize="xs" color="purple.500" fontWeight="700" textTransform="uppercase" letterSpacing="wide" mb={1}>
              Passo {current + 1} de {total}
            </Text>
            <Heading as="h4" size="sm" mb={2} color="gray.800">
              {step.title}
            </Heading>
            <Text fontSize="sm" color="gray.600" lineHeight="tall" mb={4}>
              {step.description}
            </Text>

            {step.image && (
              <Box position="relative">
                <Image
                  src={step.image}
                  alt={step.title}
                  borderRadius="lg"
                  w="full"
                  maxH="300px"
                  objectFit="cover"
                />
                {step.highlightArea && (
                  <Box
                    position="absolute"
                    left={`${step.highlightArea.x}%`}
                    top={`${step.highlightArea.y}%`}
                    w={`${step.highlightArea.w}%`}
                    h={`${step.highlightArea.h}%`}
                    border="2px solid"
                    borderColor="purple.400"
                    borderRadius="md"
                    boxShadow="0 0 0 4px rgba(115, 75, 156, 0.2)"
                    pointerEvents="none"
                  />
                )}
              </Box>
            )}
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Navigation */}
      <Flex justify="space-between" align="center" px={5} py={3} borderTop="1px solid" borderColor="gray.100">
        <IconButton
          aria-label="Anterior"
          icon={<FiChevronLeft />}
          variant="ghost"
          size="sm"
          onClick={goPrev}
          isDisabled={current === 0}
        />

        {/* Dots */}
        <HStack spacing={1}>
          {block.steps.map((_, idx) => (
            <Box
              key={idx}
              w={idx === current ? '16px' : '6px'}
              h="6px"
              borderRadius="full"
              bg={idx === current ? 'purple.500' : idx < current ? 'purple.200' : 'gray.200'}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => setCurrent(idx)}
            />
          ))}
        </HStack>

        <IconButton
          aria-label="Proximo"
          icon={<FiChevronRight />}
          variant="ghost"
          size="sm"
          onClick={goNext}
          isDisabled={current === total - 1}
        />
      </Flex>
    </Box>
  );
}
