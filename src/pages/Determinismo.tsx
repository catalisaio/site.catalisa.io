import { Box } from '@chakra-ui/react';
import { DeterminismHero } from '../components/sections/DeterminismHero';
import { ComparativeSplit } from '../components/sections/ComparativeSplit';
import { BuildingBlocksShowcase } from '../components/sections/BuildingBlocksShowcase';
import { ValuePropositionCards } from '../components/sections/ValuePropositionCards';
import { TechnicalDeepDive } from '../components/sections/TechnicalDeepDive';
import { FinalCTA } from '../components/sections/FinalCTA';

export default function Determinismo() {
  // SiteLayout already owns the header, main landmark and footer.
  return <Box minH="100vh"><DeterminismHero /><ComparativeSplit /><BuildingBlocksShowcase /><ValuePropositionCards /><TechnicalDeepDive /><FinalCTA /></Box>;
}
