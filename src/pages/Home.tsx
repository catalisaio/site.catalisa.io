import { Hero } from '../components/sections/Hero';
import { LogoMarquee } from '../components/sections/LogoMarquee';
import { ProblemStatement } from '../components/sections/ProblemStatement';
import { SolutionOverview } from '../components/sections/SolutionOverview';
import { CatalisaStudioShowcase } from '../components/sections/CatalisaStudioShowcase';
import { FeatureBentoGrid } from '../components/sections/FeatureBentoGrid';
import { AIAgentsTeaser } from '../components/sections/AIAgentsTeaser';
import { StatsCounter } from '../components/sections/StatsCounter';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Differentiators } from '../components/sections/Differentiators';
import { TrustSection } from '../components/sections/TrustSection';
import { FinalCTA } from '../components/sections/FinalCTA';
import { AIInAction } from '../components/sections/AIInAction';

export function Home() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <ProblemStatement />
      <SolutionOverview />
      <CatalisaStudioShowcase />
      <AIInAction />
      <FeatureBentoGrid />
      <AIAgentsTeaser />
      <StatsCounter />
      <HowItWorks />
      <Differentiators />
      <TrustSection />
      <FinalCTA />
    </>
  );
}
