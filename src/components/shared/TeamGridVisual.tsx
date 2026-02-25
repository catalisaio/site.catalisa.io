import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { AgentAvatarCard } from './AgentAvatarCard';

const MotionPath = motion.path;
const MotionCircle = motion.circle;

const lineVariant = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
};

export function TeamGridVisual() {
  const { t } = useTranslation('home');
  const agents = t('heroTeamBuilder.agents', { returnObjects: true }) as Record<string, { label: string; activity: string }>;

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      position="relative"
      w="100%"
      maxW="420px"
      mx="auto"
    >
      {/* SVG connection lines */}
      <Box
        as="svg"
        viewBox="0 0 420 380"
        w="100%"
        h="auto"
        position="absolute"
        top={0}
        left={0}
        pointerEvents="none"
        zIndex={0}
      >
        {/* Center (WhatsApp) to SDR */}
        <MotionPath
          d="M210,70 L100,160"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          {...lineVariant}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        {/* Center to Support */}
        <MotionPath
          d="M210,70 L210,160"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          {...lineVariant}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
        {/* Center to Finance */}
        <MotionPath
          d="M210,70 L320,160"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          {...lineVariant}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        {/* Support to Onboarding */}
        <MotionPath
          d="M210,200 L130,290"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          {...lineVariant}
          transition={{ delay: 0.7, duration: 0.8 }}
        />
        {/* Support to Apps */}
        <MotionPath
          d="M210,200 L300,290"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          {...lineVariant}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        {/* Data packets */}
        {[
          { path: 'M210,70 L100,160', delay: 1.5 },
          { path: 'M210,70 L210,160', delay: 2.0 },
          { path: 'M210,70 L320,160', delay: 2.5 },
          { path: 'M210,200 L130,290', delay: 3.0 },
          { path: 'M210,200 L300,290', delay: 3.5 },
        ].map((pkt, i) => (
          <MotionCircle
            key={i}
            r="3"
            fill="#25D366"
            initial={{ offsetDistance: '0%', opacity: 0 }}
            animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
            style={{ offsetPath: `path('${pkt.path}')` } as React.CSSProperties}
            transition={{
              duration: 1.5,
              delay: pkt.delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      {/* Agent nodes */}
      <Box position="relative" zIndex={1} h="380px">
        {/* WhatsApp - center top */}
        <Box position="absolute" top="10px" left="50%" transform="translateX(-50%)">
          <AgentAvatarCard
            role="whatsapp"
            label={agents.whatsapp.label}
            activity={agents.whatsapp.activity}
            delay={0}
          />
        </Box>

        {/* SDR - left middle */}
        <Box position="absolute" top="130px" left="30px">
          <AgentAvatarCard
            role="sdr"
            label={agents.sdr.label}
            activity={agents.sdr.activity}
            delay={0.4}
          />
        </Box>

        {/* Support - center middle */}
        <Box position="absolute" top="130px" left="50%" transform="translateX(-50%)">
          <AgentAvatarCard
            role="support"
            label={agents.support.label}
            activity={agents.support.activity}
            delay={0.6}
          />
        </Box>

        {/* Finance - right middle */}
        <Box position="absolute" top="130px" right="30px">
          <AgentAvatarCard
            role="finance"
            label={agents.finance.label}
            activity={agents.finance.activity}
            delay={0.8}
          />
        </Box>

        {/* Onboarding - bottom left */}
        <Box position="absolute" bottom="10px" left="60px">
          <AgentAvatarCard
            role="onboarding"
            label={agents.onboarding.label}
            activity={agents.onboarding.activity}
            delay={1.0}
          />
        </Box>

        {/* Apps - bottom right */}
        <Box position="absolute" bottom="10px" right="50px">
          <AgentAvatarCard
            role="apps"
            label={agents.apps.label}
            activity={agents.apps.activity}
            delay={1.2}
          />
        </Box>
      </Box>
    </MotionBox>
  );
}
