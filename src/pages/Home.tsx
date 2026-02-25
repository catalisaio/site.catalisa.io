import { HeroTeamBuilder } from '../components/sections/HeroTeamBuilder';
import { LogoMarquee } from '../components/sections/LogoMarquee';
import { MeetYourTeam } from '../components/sections/MeetYourTeam';
import { WhatsAppCommandCenter } from '../components/sections/WhatsAppCommandCenter';
import { YourToolsTheirHands } from '../components/sections/YourToolsTheirHands';
import { AgentBuilderShowcase } from '../components/sections/AgentBuilderShowcase';
import { LiveOperationsDashboard } from '../components/sections/LiveOperationsDashboard';
import { AIInAction } from '../components/sections/AIInAction';
import { ROICalculator } from '../components/sections/ROICalculator';
import { IndustrySolutions } from '../components/sections/IndustrySolutions';
import { TrustSection } from '../components/sections/TrustSection';
import { FAQ } from '../components/sections/FAQ';
import { FinalCTA } from '../components/sections/FinalCTA';

export function Home() {
  return (
    <>
      <HeroTeamBuilder />
      <LogoMarquee />
      <MeetYourTeam />
      <WhatsAppCommandCenter />
      <YourToolsTheirHands />
      <AgentBuilderShowcase />
      <LiveOperationsDashboard />
      <AIInAction />
      <ROICalculator />
      <IndustrySolutions />
      <TrustSection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
