import { Box, Container } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { MotionBox, fadeInUp } from '../motion';

interface SectionWrapperProps {
  children: ReactNode;
  bg?: string;
  py?: number | string | Record<string, number | string>;
  maxW?: string;
  id?: string;
}

export function SectionWrapper({ children, bg, py = { base: 16, md: 24 }, maxW = '1280px', id }: SectionWrapperProps) {
  return (
    <Box as="section" bg={bg} id={id}>
      <Container maxW={maxW} py={py}>
        <MotionBox {...fadeInUp}>
          {children}
        </MotionBox>
      </Container>
    </Box>
  );
}
