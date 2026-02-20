import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Spinner, Flex } from '@chakra-ui/react';
import { theme } from './theme';
import { PageLayout } from './components/layout/PageLayout';

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
const UseCases = lazy(() => import('./pages/UseCases').then(m => ({ default: m.UseCases })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Demo = lazy(() => import('./pages/Demo').then(m => ({ default: m.Demo })));

function PageLoader() {
  return (
    <Flex justify="center" align="center" minH="60vh">
      <Spinner size="lg" color="brand.500" />
    </Flex>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <PageLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/ai-agents" element={<AIAgents />} />
              <Route path="/building-blocks" element={<BuildingBlocks />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/fintech" element={<Fintech />} />
              <Route path="/bancario" element={<Banking />} />
              <Route path="/seguros" element={<Insurance />} />
              <Route path="/varejo" element={<Retail />} />
              <Route path="/startups" element={<Startups />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/demo" element={<Demo />} />
            </Routes>
          </Suspense>
        </PageLayout>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
