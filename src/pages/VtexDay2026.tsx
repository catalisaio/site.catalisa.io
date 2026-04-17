import { Box } from '@chakra-ui/react';
import { VtexDayHero } from '../components/sections/VtexDayHero';
import { VtexDayConceptCard } from '../components/sections/VtexDayConceptCard';
import { VtexDayPersonaSelector } from '../components/sections/VtexDayPersonaSelector';
import { VtexDayWorkflowScroll } from '../components/sections/VtexDayWorkflowScroll';
import { VtexDayStages } from '../components/sections/VtexDayStages';
import { VtexDayFiveMinutes } from '../components/sections/VtexDayFiveMinutes';
import { VtexDayLeadForm } from '../components/sections/VtexDayLeadForm';
import { VtexDayFinalCTA } from '../components/sections/VtexDayFinalCTA';

export default function VtexDay2026() {
  return (
    <Box as="main">
      <VtexDayHero />
      <VtexDayConceptCard />
      <VtexDayPersonaSelector />
      <VtexDayWorkflowScroll />
      <VtexDayStages />
      <VtexDayFiveMinutes />
      <VtexDayLeadForm />
      <VtexDayFinalCTA />
    </Box>
  );
}
