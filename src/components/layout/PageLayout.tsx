import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex={1} pt="64px">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
