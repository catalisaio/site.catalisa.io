import { Box, Flex, Text } from '@chakra-ui/react';

interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ProgressBar({ value, size = 'sm', showLabel = true }: ProgressBarProps) {
  const height = size === 'sm' ? '6px' : '10px';

  return (
    <Flex align="center" gap={2} w="full">
      <Box flex={1} bg="gray.100" borderRadius="full" h={height} overflow="hidden">
        <Box
          h="full"
          bg={value === 100 ? 'green.400' : 'blue.400'}
          borderRadius="full"
          w={`${value}%`}
          transition="width 0.3s ease"
        />
      </Box>
      {showLabel && (
        <Text fontSize="xs" color="gray.500" fontWeight="600" minW="36px" textAlign="right">
          {value}%
        </Text>
      )}
    </Flex>
  );
}
