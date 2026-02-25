import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { type IconType } from 'react-icons';
import { FiMessageCircle, FiUsers, FiHeadphones, FiDollarSign, FiUserCheck, FiGrid } from 'react-icons/fi';
import { MotionBox, nodeReveal } from '../motion';
import { AnimatedCounter } from './AnimatedCounter';

export type AgentRole = 'whatsapp' | 'sdr' | 'support' | 'finance' | 'onboarding' | 'apps';

interface AgentAvatarCardProps {
  role: AgentRole;
  label: string;
  activity?: string;
  activityCount?: number;
  delay?: number;
  size?: 'sm' | 'md';
}

const roleConfig: Record<AgentRole, { icon: IconType; color: string; ring: string }> = {
  whatsapp: { icon: FiMessageCircle, color: 'whatsapp.500', ring: 'rgba(37, 211, 102, 0.4)' },
  sdr: { icon: FiUsers, color: 'blue.400', ring: 'rgba(66, 153, 225, 0.4)' },
  support: { icon: FiHeadphones, color: 'green.400', ring: 'rgba(72, 187, 120, 0.4)' },
  finance: { icon: FiDollarSign, color: 'orange.400', ring: 'rgba(237, 137, 54, 0.4)' },
  onboarding: { icon: FiUserCheck, color: 'purple.400', ring: 'rgba(159, 122, 234, 0.4)' },
  apps: { icon: FiGrid, color: 'cyan.400', ring: 'rgba(0, 188, 212, 0.4)' },
};

export function AgentAvatarCard({ role, label, activity, activityCount, delay = 0, size = 'md' }: AgentAvatarCardProps) {
  const config = roleConfig[role];
  const Icon = config.icon;
  const iconSize = size === 'sm' ? '32px' : '40px';
  const cardW = size === 'sm' ? '90px' : '120px';

  return (
    <MotionBox
      {...nodeReveal}
      transition={{ ...nodeReveal.transition, delay }}
    >
      <VStack spacing={1.5} w={cardW}>
        {/* Icon with pulse ring */}
        <Box position="relative">
          <Box
            w={iconSize}
            h={iconSize}
            borderRadius="full"
            bg="whiteAlpha.100"
            border="2px solid"
            borderColor={config.color}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow={`0 0 20px ${config.ring}`}
            sx={{
              animation: 'pulseRing 2s ease-in-out infinite',
              '@keyframes pulseRing': {
                '0%, 100%': { boxShadow: `0 0 10px ${config.ring}` },
                '50%': { boxShadow: `0 0 25px ${config.ring}` },
              },
            }}
          >
            <Box as={Icon} color={config.color} boxSize={size === 'sm' ? 4 : 5} />
          </Box>
          {/* Online dot */}
          <Box
            position="absolute"
            bottom="0"
            right="0"
            w="8px"
            h="8px"
            borderRadius="full"
            bg="green.400"
            border="2px solid"
            borderColor="gray.900"
            sx={{
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
        </Box>

        {/* Label */}
        <Text
          color="white"
          fontSize={size === 'sm' ? '2xs' : 'xs'}
          fontWeight="600"
          textAlign="center"
          lineHeight="1.2"
        >
          {label}
        </Text>

        {/* Activity / counter */}
        {activity && (
          <HStack spacing={1}>
            {activityCount !== undefined ? (
              <AnimatedCounter
                target={activityCount}
                duration={1500}
                color="whiteAlpha.500"
                fontSize="2xs"
              />
            ) : (
              <Text color="whiteAlpha.500" fontSize="2xs">
                {activity}
              </Text>
            )}
          </HStack>
        )}
      </VStack>
    </MotionBox>
  );
}
