import { HeroTeamBuilder } from '../components/sections/HeroTeamBuilder';
import { LogoMarquee } from '../components/sections/LogoMarquee';
import { MarketValidation } from '../components/sections/MarketValidation';
import { MeetYourTeam } from '../components/sections/MeetYourTeam';
import { WhatsAppCommandCenter } from '../components/sections/WhatsAppCommandCenter';
import { AppBuilderShowcase } from '../components/sections/AppBuilderShowcase';
import { YourToolsTheirHands } from '../components/sections/YourToolsTheirHands';
import { AgentBuilderShowcase } from '../components/sections/AgentBuilderShowcase';
import { AppsInAction } from '../components/sections/AppsInAction';
import { LiveOperationsDashboard } from '../components/sections/LiveOperationsDashboard';
import { AgentsAndAppsTogether } from '../components/sections/AgentsAndAppsTogether';
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
      <MarketValidation />
      <MeetYourTeam />
      <WhatsAppCommandCenter />
      <AppBuilderShowcase />
      <YourToolsTheirHands />
      <AgentBuilderShowcase />
      <AppsInAction />
      <LiveOperationsDashboard />
      <AgentsAndAppsTogether />
      <AIInAction />
      <ROICalculator />
      <IndustrySolutions />
      <TrustSection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
