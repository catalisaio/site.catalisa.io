import { Box, Text, VStack, HStack, Wrap, WrapItem } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { MotionBox, staggerItem } from '../motion';

interface AgentProfileCardProps {
  role: string;
  capabilities: string[];
  tools: string[];
  stats: string;
  isSelected: boolean;
  onSelect: () => void;
  colorIndex: number;
}

const roleColors = [
  { border: 'blue.400', bg: 'rgba(66, 153, 225, 0.1)', ring: 'blue.400' },
  { border: 'green.400', bg: 'rgba(72, 187, 120, 0.1)', ring: 'green.400' },
  { border: 'purple.400', bg: 'rgba(159, 122, 234, 0.1)', ring: 'purple.400' },
  { border: 'orange.400', bg: 'rgba(237, 137, 54, 0.1)', ring: 'orange.400' },
  { border: 'cyan.400', bg: 'rgba(56, 178, 172, 0.1)', ring: 'cyan.400' },
];

export function AgentProfileCard({
  role,
  capabilities,
  tools,
  stats,
  isSelected,
  onSelect,
  colorIndex,
}: AgentProfileCardProps) {
  const colors = roleColors[colorIndex % roleColors.length];

  return (
    <MotionBox {...staggerItem}>
      <Box
        as="button"
        onClick={onSelect}
        w={{ base: '220px', md: '200px' }}
        p={5}
        borderRadius="2xl"
        bg={isSelected ? colors.bg : 'white'}
        border="2px solid"
        borderColor={isSelected ? colors.border : 'gray.200'}
        cursor="pointer"
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          borderColor: colors.border,
        }}
        textAlign="left"
        flexShrink={0}
      >
        <VStack align="flex-start" spacing={3}>
          {/* Avatar ring + role */}
          <HStack spacing={3}>
            <Box
              w="40px"
              h="40px"
              borderRadius="full"
              bg={colors.bg}
              border="2px solid"
              borderColor={colors.border}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="lg" fontWeight="700" color={colors.border}>
                {role.charAt(0)}
              </Text>
            </Box>
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="sm" fontWeight="700" color="gray.800">
                {role}
              </Text>
              <HStack spacing={1}>
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
                <Text fontSize="2xs" color="green.500" fontWeight="600">
                  Online
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Capabilities */}
          <VStack align="flex-start" spacing={1} w="full">
            {capabilities.slice(0, 4).map((cap) => (
              <HStack key={cap} spacing={1.5}>
                <Box as={FiCheck} color={colors.ring} boxSize={3} flexShrink={0} />
                <Text fontSize="2xs" color="gray.600" lineHeight="1.3">
                  {cap}
                </Text>
              </HStack>
            ))}
          </VStack>

          {/* Tools strip */}
          <Wrap spacing={1}>
            {tools.map((tool) => (
              <WrapItem key={tool}>
                <Box
                  px={1.5}
                  py={0.5}
                  borderRadius="md"
                  bg="gray.100"
                  fontSize="2xs"
                  color="gray.500"
                  fontWeight="500"
                >
                  {tool}
                </Box>
              </WrapItem>
            ))}
          </Wrap>

          {/* Stats */}
          <Text fontSize="2xs" color="gray.400" fontWeight="500">
            {stats}
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
}
