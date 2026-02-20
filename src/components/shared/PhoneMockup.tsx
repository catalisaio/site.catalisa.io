import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface PhoneMockupProps {
  children: ReactNode;
  maxH?: string;
}

export function PhoneMockup({ children, maxH = '600px' }: PhoneMockupProps) {
  return (
    <Box
      position="relative"
      bg="gray.900"
      borderRadius="3xl"
      border="3px solid"
      borderColor="gray.600"
      overflow="hidden"
      maxH={maxH}
      w="fit-content"
      mx="auto"
      boxShadow="0 25px 60px -12px rgba(0, 0, 0, 0.5)"
      sx={{ aspectRatio: '9 / 19.5' }}
    >
      {/* Notch */}
      <Box
        position="absolute"
        top={0}
        left="50%"
        transform="translateX(-50%)"
        w="120px"
        h="28px"
        bg="gray.900"
        borderBottomRadius="xl"
        zIndex={2}
      />

      {/* Screen content */}
      <Box
        position="relative"
        w="100%"
        h="100%"
        overflow="hidden"
        borderRadius="inherit"
      >
        {children}
      </Box>
    </Box>
  );
}
