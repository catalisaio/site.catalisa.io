import { Box, Flex, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { BoxProps } from '@chakra-ui/react';

interface PhoneMockupProps extends Omit<BoxProps, 'children'> {
  children: ReactNode;
  /** Max height of the entire phone frame */
  maxH?: string;
  /** Color variant for the frame */
  variant?: 'dark' | 'light' | 'silver';
  /** Show status bar (time, battery, signal) */
  showStatusBar?: boolean;
  /** Show home indicator bar at the bottom */
  showHomeIndicator?: boolean;
}

export function PhoneMockup({
  children,
  maxH = '600px',
  variant = 'dark',
  showStatusBar = true,
  showHomeIndicator = true,
  ...boxProps
}: PhoneMockupProps) {
  const frameColors = {
    dark: { bg: 'gray.900', border: 'gray.600', inner: 'gray.800' },
    light: { bg: 'gray.100', border: 'gray.300', inner: 'gray.200' },
    silver: { bg: 'gray.200', border: 'gray.400', inner: 'gray.300' },
  };

  const colors = frameColors[variant];

  return (
    <Box
      position="relative"
      bg={colors.bg}
      borderRadius="40px"
      border="4px solid"
      borderColor={colors.border}
      overflow="hidden"
      maxH={maxH}
      w="fit-content"
      mx="auto"
      boxShadow="0 25px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
      sx={{ aspectRatio: '9 / 19.5' }}
      {...boxProps}
    >
      {/* Outer bezel highlight */}
      <Box
        position="absolute"
        inset="0"
        borderRadius="inherit"
        border="1px solid"
        borderColor="whiteAlpha.100"
        pointerEvents="none"
        zIndex={4}
      />

      {/* Dynamic Island / Notch */}
      <Box
        position="absolute"
        top="10px"
        left="50%"
        transform="translateX(-50%)"
        w="100px"
        h="28px"
        bg="black"
        borderRadius="full"
        zIndex={3}
      >
        {/* Camera dot */}
        <Box
          position="absolute"
          top="50%"
          right="18px"
          transform="translateY(-50%)"
          w="10px"
          h="10px"
          bg="gray.800"
          borderRadius="full"
          border="1.5px solid"
          borderColor="gray.700"
        />
      </Box>

      {/* Status bar */}
      {showStatusBar && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="48px"
          px={6}
          align="center"
          justify="space-between"
          zIndex={2}
          bg="blackAlpha.300"
          backdropFilter="blur(8px)"
        >
          <Text fontSize="xs" fontWeight="600" color="white">
            9:41
          </Text>
          <Flex gap={1} align="center">
            {/* Signal bars */}
            <Flex gap="1px" align="flex-end" h="10px">
              {[3, 5, 7, 10].map((h, i) => (
                <Box key={i} w="3px" h={`${h}px`} bg="white" borderRadius="sm" />
              ))}
            </Flex>
            {/* WiFi icon simplified */}
            <Box ml={1} w="12px" h="9px" position="relative">
              <Box
                position="absolute"
                bottom={0}
                left="50%"
                transform="translateX(-50%)"
                w="3px"
                h="3px"
                bg="white"
                borderRadius="full"
              />
              <Box
                position="absolute"
                bottom="2px"
                left="50%"
                transform="translateX(-50%)"
                w="7px"
                h="5px"
                borderTop="1.5px solid white"
                borderRadius="50% 50% 0 0"
              />
            </Box>
            {/* Battery */}
            <Flex ml={1} align="center">
              <Box
                w="20px"
                h="9px"
                border="1px solid white"
                borderRadius="2px"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" inset="1px" bg="green.400" borderRadius="1px" w="70%" />
              </Box>
              <Box w="1.5px" h="4px" bg="white" borderRightRadius="1px" />
            </Flex>
          </Flex>
        </Flex>
      )}

      {/* Screen content */}
      <Box
        position="relative"
        w="100%"
        h="100%"
        overflow="hidden"
        borderRadius="36px"
      >
        {children}
      </Box>

      {/* Home indicator */}
      {showHomeIndicator && (
        <Box
          position="absolute"
          bottom="6px"
          left="50%"
          transform="translateX(-50%)"
          w="120px"
          h="4px"
          bg="whiteAlpha.400"
          borderRadius="full"
          zIndex={3}
        />
      )}
    </Box>
  );
}
