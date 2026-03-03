import { Box, Container } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { MotionBox, fadeInUp } from '../motion';

interface SectionWrapperProps {
  children: ReactNode;
  bg?: string;
  py?: number | string | Record<string, number | string>;
  maxW?: string;
  id?: string;
  className?: string;
  position?: string;
  overflow?: string;
}

export function SectionWrapper({ children, bg, py = { base: 16, md: 24 }, maxW = '1280px', id, className, position, overflow }: SectionWrapperProps) {
  return (
    <Box as="section" bg={bg} id={id} className={className} position={position as never} overflow={overflow as never}>
      <Container maxW={maxW} py={py} position="relative" zIndex={1}>
        <MotionBox {...fadeInUp}>
          {children}
        </MotionBox>
      </Container>
    </Box>
  );
}
