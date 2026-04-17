import { Suspense, lazy } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { DeterminismHero } from '../components/sections/DeterminismHero';
import { ComparativeSplit } from '../components/sections/ComparativeSplit';
import { BuildingBlocksShowcase } from '../components/sections/BuildingBlocksShowcase';
import { ValuePropositionCards } from '../components/sections/ValuePropositionCards';
import { TechnicalDeepDive } from '../components/sections/TechnicalDeepDive';
import { FinalCTA } from '../components/sections/FinalCTA';

const Header = lazy(() => import('../components/layout/Header').then(m => ({ default: m.Header })));
const Footer = lazy(() => import('../components/layout/Footer').then(m => ({ default: m.Footer })));

function PageLoader() {
  return (
    <Center h="100vh">
      <Spinner size="xl" color="brand.500" thickness="4px" />
    </Center>
  );
}

export default function Determinismo() {
  return (
    <Box minH="100vh">
      <Suspense fallback={<PageLoader />}>
        <Header />
      </Suspense>
      
      <Box as="main">
        <DeterminismHero />
        <ComparativeSplit />
        <BuildingBlocksShowcase />
        <ValuePropositionCards />
        <TechnicalDeepDive />
        <FinalCTA />
      </Box>
      
      <Suspense fallback={<PageLoader />}>
        <Footer />
      </Suspense>
    </Box>
  );
}
