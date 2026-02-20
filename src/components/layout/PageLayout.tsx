import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../shared/ScrollToTop';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <ScrollToTop />
      <Header />
      <Box as="main" flex={1} pt="64px">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
