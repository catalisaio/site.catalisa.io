import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface BrowserFrameProps {
  url?: string;
  children: ReactNode;
  variant?: 'light' | 'dark';
}

export function BrowserFrame({ url = 'panel.catalisa.app', children, variant = 'dark' }: BrowserFrameProps) {
  const isDark = variant === 'dark';

  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor={isDark ? 'whiteAlpha.200' : 'gray.200'}
      bg={isDark ? '#1a1a2e' : 'white'}
    >
      {/* Browser chrome */}
      <Flex
        align="center"
        px={4}
        py={2.5}
        bg={isDark ? '#0f0f1a' : 'gray.50'}
        borderBottom="1px solid"
        borderColor={isDark ? 'whiteAlpha.100' : 'gray.200'}
        gap={3}
      >
        {/* Traffic lights */}
        <HStack spacing={1.5} flexShrink={0}>
          <Box w="10px" h="10px" borderRadius="full" bg="#FF5F57" />
          <Box w="10px" h="10px" borderRadius="full" bg="#FEBC2E" />
          <Box w="10px" h="10px" borderRadius="full" bg="#28C840" />
        </HStack>

        {/* URL bar */}
        <Flex
          flex={1}
          maxW="400px"
          mx="auto"
          bg={isDark ? 'whiteAlpha.100' : 'gray.100'}
          borderRadius="lg"
          px={3}
          py={1}
          align="center"
          justify="center"
        >
          <HStack spacing={1.5}>
            <Box as="svg" w="10px" h="10px" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1a4.5 4.5 0 00-4.5 4.5c0 1.657 1.343 3 3 4.5L8 11.5l1.5-1.5c1.657-1.5 3-2.843 3-4.5A4.5 4.5 0 008 1z"
                fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              />
            </Box>
            <Text
              fontSize="2xs"
              color={isDark ? 'whiteAlpha.500' : 'gray.500'}
              fontFamily="mono"
              letterSpacing="tight"
            >
              {url}
            </Text>
          </HStack>
        </Flex>

        {/* Spacer to balance traffic lights */}
        <Box w="46px" flexShrink={0} />
      </Flex>

      {/* Content */}
      <Box>{children}</Box>
    </Box>
  );
}
