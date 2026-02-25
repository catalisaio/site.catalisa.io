import { useState, useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

interface ScrollHintProps {
  scrollYProgress: MotionValue<number>;
  color?: string;
  label?: string;
}

export function ScrollHint({ scrollYProgress, color = 'whiteAlpha.600', label = 'Role para explorar' }: ScrollHintProps) {
  const [done, setDone] = useState(false);

  const handleChange = useCallback((progress: number) => {
    setDone(progress > 0.6);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', handleChange);

  if (done) return null;

  return (
    <Flex
      position="absolute"
      bottom={{ base: '28px', md: '40px' }}
      left={0}
      right={0}
      justify="center"
      pointerEvents="none"
    >
      <Flex
        direction="column"
        align="center"
        gap={1.5}
        sx={{
          animation: 'scrollBounce 2.5s ease-in-out infinite',
          '@keyframes scrollBounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(8px)' },
          },
        }}
      >
        <Text
          color={color}
          fontSize="xs"
          fontWeight="600"
          letterSpacing="wider"
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Box position="relative" h="20px">
          <Box as={FiChevronDown} color={color} boxSize={5} position="absolute" top={0} left="50%" ml="-10px" />
          <Box as={FiChevronDown} color={color} boxSize={5} position="absolute" top="6px" left="50%" ml="-10px" opacity={0.5} />
        </Box>
      </Flex>
    </Flex>
  );
}
