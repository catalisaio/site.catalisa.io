import { chakra } from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionFlex = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: '-50px' },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' },
};

// Node that appears with "pop" and pulse ring
export const nodeReveal = {
  initial: { opacity: 0, scale: 0 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.5, type: 'spring', stiffness: 200, damping: 15 },
};

// SVG line that "draws" progressively
export const lineDrawIn = {
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: 'easeInOut' },
};

// Stagger with larger delays for dramatic "assembly" effect
export const teamAssembly = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  viewport: { once: true, margin: '-100px' },
};
