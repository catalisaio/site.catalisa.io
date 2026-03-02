import { lazy, Suspense } from 'react';
import { HeroTeamBuilder } from '../components/sections/HeroTeamBuilder';
import { IntegrationShowcase } from '../components/sections/IntegrationShowcase';

const MarketValidation = lazy(() => import('../components/sections/MarketValidation').then(m => ({ default: m.MarketValidation })));
const MeetYourTeam = lazy(() => import('../components/sections/MeetYourTeam').then(m => ({ default: m.MeetYourTeam })));
const WhatsAppCommandCenter = lazy(() => import('../components/sections/WhatsAppCommandCenter').then(m => ({ default: m.WhatsAppCommandCenter })));
const AppBuilderShowcase = lazy(() => import('../components/sections/AppBuilderShowcase').then(m => ({ default: m.AppBuilderShowcase })));
const YourToolsTheirHands = lazy(() => import('../components/sections/YourToolsTheirHands').then(m => ({ default: m.YourToolsTheirHands })));
const AgentBuilderShowcase = lazy(() => import('../components/sections/AgentBuilderShowcase').then(m => ({ default: m.AgentBuilderShowcase })));
const AppsInAction = lazy(() => import('../components/sections/AppsInAction').then(m => ({ default: m.AppsInAction })));
const LiveOperationsDashboard = lazy(() => import('../components/sections/LiveOperationsDashboard').then(m => ({ default: m.LiveOperationsDashboard })));
const AgentsAndAppsTogether = lazy(() => import('../components/sections/AgentsAndAppsTogether').then(m => ({ default: m.AgentsAndAppsTogether })));
const AIInAction = lazy(() => import('../components/sections/AIInAction').then(m => ({ default: m.AIInAction })));
const ROICalculator = lazy(() => import('../components/sections/ROICalculator').then(m => ({ default: m.ROICalculator })));
const IndustrySolutions = lazy(() => import('../components/sections/IndustrySolutions').then(m => ({ default: m.IndustrySolutions })));
const TrustSection = lazy(() => import('../components/sections/TrustSection').then(m => ({ default: m.TrustSection })));
const FAQ = lazy(() => import('../components/sections/FAQ').then(m => ({ default: m.FAQ })));
const FinalCTA = lazy(() => import('../components/sections/FinalCTA').then(m => ({ default: m.FinalCTA })));

export function Home() {
  return (
    <>
      <HeroTeamBuilder />
      <IntegrationShowcase />
      <Suspense>
        <YourToolsTheirHands />
        <MarketValidation />
        <MeetYourTeam />
        <WhatsAppCommandCenter />
        <AppBuilderShowcase />
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
      </Suspense>
    </>
  );
}
