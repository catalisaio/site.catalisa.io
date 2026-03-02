import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ChakraProvider, Spinner, Flex } from '@chakra-ui/react';
import { theme } from './theme';
import { PageLayout } from './components/layout/PageLayout';
import { LanguageLayout } from './components/layout/LanguageLayout';
import { CookieConsent } from './components/shared/CookieConsent';
import { PresentationGate } from './components/presentation/PresentationGate';
import { useAnalytics } from './hooks/useAnalytics';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Studio = lazy(() => import('./pages/Studio').then(m => ({ default: m.Studio })));
const AIAgents = lazy(() => import('./pages/AIAgents').then(m => ({ default: m.AIAgents })));
const BuildingBlocks = lazy(() => import('./pages/BuildingBlocks').then(m => ({ default: m.BuildingBlocks })));
const Workflows = lazy(() => import('./pages/Workflows').then(m => ({ default: m.Workflows })));
const Fintech = lazy(() => import('./pages/Fintech').then(m => ({ default: m.Fintech })));
const Banking = lazy(() => import('./pages/Banking').then(m => ({ default: m.Banking })));
const Insurance = lazy(() => import('./pages/Insurance').then(m => ({ default: m.Insurance })));
const Retail = lazy(() => import('./pages/Retail').then(m => ({ default: m.Retail })));
const Startups = lazy(() => import('./pages/Startups').then(m => ({ default: m.Startups })));
const CasosDeUso = lazy(() => import('./pages/CasosDeUso').then(m => ({ default: m.CasosDeUso })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Demo = lazy(() => import('./pages/Demo').then(m => ({ default: m.Demo })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const PressKit = lazy(() => import('./pages/PressKit').then(m => ({ default: m.PressKit })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Security = lazy(() => import('./pages/Security').then(m => ({ default: m.Security })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorks').then(m => ({ default: m.HowItWorks })));
const WhatsAppIntegration = lazy(() => import('./pages/WhatsAppIntegration').then(m => ({ default: m.WhatsAppIntegration })));
const CommercialPresentation = lazy(() => import('./pages/CommercialPresentation').then(m => ({ default: m.CommercialPresentation })));
const InvestorPresentation = lazy(() => import('./pages/InvestorPresentation').then(m => ({ default: m.InvestorPresentation })));
const RetailPresentation = lazy(() => import('./pages/RetailPresentation').then(m => ({ default: m.RetailPresentation })));
const FintechPresentation = lazy(() => import('./pages/FintechPresentation').then(m => ({ default: m.FintechPresentation })));
const InsurancePresentation = lazy(() => import('./pages/InsurancePresentation').then(m => ({ default: m.InsurancePresentation })));
const Apps = lazy(() => import('./pages/Apps').then(m => ({ default: m.Apps })));
const AIAgentsWhatsApp = lazy(() => import('./pages/AIAgentsWhatsApp').then(m => ({ default: m.AIAgentsWhatsApp })));
const PlaybookDetail = lazy(() => import('./pages/PlaybookDetail').then(m => ({ default: m.PlaybookDetail })));
const InsightsListing = lazy(() => import('./pages/InsightsListing').then(m => ({ default: m.InsightsListing })));
const InsightsListingMagazine = lazy(() => import('./pages/InsightsListingMagazine').then(m => ({ default: m.InsightsListingMagazine })));
const InsightArticle = lazy(() => import('./pages/InsightArticle').then(m => ({ default: m.InsightArticle })));
const PresentationMenu = lazy(() => import('./pages/PresentationMenu').then(m => ({ default: m.PresentationMenu })));
const PresentationInvite = lazy(() => import('./pages/PresentationInvite').then(m => ({ default: m.PresentationInvite })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <Flex justify="center" align="center" minH="60vh">
      <Spinner size="lg" color="brand.500" />
    </Flex>
  );
}

/** Analytics tracker — must be inside BrowserRouter */
function AnalyticsTracker() {
  useAnalytics();
  return null;
}

/** Layout route that wraps children with Header + Footer */
function SiteLayout() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

/** Dispatch event for pre-renderer to know the app is ready */
function AppReadySignal() {
  useEffect(() => {
    document.dispatchEvent(new Event('app-rendered'));
  }, []);
  return null;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AnalyticsTracker />
        <AppReadySignal />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Fullscreen routes — no Header/Footer */}
            <Route element={<LanguageLayout lang="pt-BR" />}>
              <Route path="/apresentacao" element={<PresentationMenu />} />
              <Route path="/apresentacao/i/:code" element={<PresentationInvite />} />
              <Route path="/apresentacao/comercial" element={<PresentationGate><CommercialPresentation /></PresentationGate>} />
              <Route path="/apresentacao/investidor" element={<PresentationGate><InvestorPresentation /></PresentationGate>} />
              <Route path="/apresentacao/varejo" element={<PresentationGate><RetailPresentation /></PresentationGate>} />
              <Route path="/apresentacao/fintech" element={<PresentationGate><FintechPresentation /></PresentationGate>} />
              <Route path="/apresentacao/seguros" element={<PresentationGate><InsurancePresentation /></PresentationGate>} />
            </Route>
            <Route path="/en" element={<LanguageLayout lang="en-US" />}>
              <Route path="presentation/commercial" element={<PresentationGate><CommercialPresentation /></PresentationGate>} />
              <Route path="presentation/investor" element={<PresentationGate><InvestorPresentation /></PresentationGate>} />
              <Route path="presentation/retail" element={<PresentationGate><RetailPresentation /></PresentationGate>} />
              <Route path="presentation/fintech" element={<PresentationGate><FintechPresentation /></PresentationGate>} />
              <Route path="presentation/insurance" element={<PresentationGate><InsurancePresentation /></PresentationGate>} />
            </Route>

            {/* Standard routes — with Header/Footer */}
            <Route element={<SiteLayout />}>
              {/* pt-BR routes (default, no prefix) */}
              <Route element={<LanguageLayout lang="pt-BR" />}>
                <Route path="/" element={<Home />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/ai-agents" element={<AIAgents />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/building-blocks" element={<BuildingBlocks />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/fintech" element={<Fintech />} />
                <Route path="/bancario" element={<Banking />} />
                <Route path="/seguros" element={<Insurance />} />
                <Route path="/varejo" element={<Retail />} />
                <Route path="/startups" element={<Startups />} />
                <Route path="/casos-de-uso" element={<CasosDeUso />} />
                <Route path="/use-cases" element={<Navigate to="/casos-de-uso" replace />} />
                <Route path="/playbooks" element={<Navigate to="/casos-de-uso" replace />} />
                <Route path="/playbooks/:playbookId" element={<PlaybookDetail />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/seguranca" element={<Security />} />
                <Route path="/como-funciona" element={<HowItWorksPage />} />
                <Route path="/integracoes/whatsapp" element={<WhatsAppIntegration />} />
                <Route path="/agentes-ia-whatsapp" element={<AIAgentsWhatsApp />} />
                <Route path="/press-kit" element={<PressKit />} />
                <Route path="/insights" element={<InsightsListingMagazine />} />
                <Route path="/insights/all" element={<InsightsListing />} />
                <Route path="/insights/magazine" element={<Navigate to="/insights" replace />} />
                <Route path="/insights/:slug" element={<InsightArticle />} />
              </Route>

              {/* en-US routes (/en prefix) */}
              <Route path="/en" element={<LanguageLayout lang="en-US" />}>
                <Route index element={<Home />} />
                <Route path="studio" element={<Studio />} />
                <Route path="ai-agents" element={<AIAgents />} />
                <Route path="apps" element={<Apps />} />
                <Route path="building-blocks" element={<BuildingBlocks />} />
                <Route path="workflows" element={<Workflows />} />
                <Route path="fintech" element={<Fintech />} />
                <Route path="banking" element={<Banking />} />
                <Route path="insurance" element={<Insurance />} />
                <Route path="retail" element={<Retail />} />
                <Route path="startups" element={<Startups />} />
                <Route path="use-cases" element={<CasosDeUso />} />
                <Route path="playbooks" element={<Navigate to="/en/use-cases" replace />} />
                <Route path="playbooks/:playbookId" element={<PlaybookDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="demo" element={<Demo />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="security" element={<Security />} />
                <Route path="how-it-works" element={<HowItWorksPage />} />
                <Route path="integrations/whatsapp" element={<WhatsAppIntegration />} />
                <Route path="ai-agents-whatsapp" element={<AIAgentsWhatsApp />} />
                <Route path="press-kit" element={<PressKit />} />
                <Route path="insights" element={<InsightsListingMagazine />} />
                <Route path="insights/all" element={<InsightsListing />} />
                <Route path="insights/magazine" element={<Navigate to="/en/insights" replace />} />
                <Route path="insights/:slug" element={<InsightArticle />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <CookieConsent />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
