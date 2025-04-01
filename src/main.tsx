import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import App from './App.tsx';

// Pages
import PaasPage from './pages/PaasPage.tsx';
import PaasExplanationPage from './pages/PaasExplanationPage.tsx';
import BuildingBlocksPage from './pages/BuildingBlocksPage.tsx';
import BuildingBlockDetail from './pages/BuildingBlockDetail.tsx';
import SchedulePage from './pages/SchedulePage.tsx';
import FAQPage from './pages/FAQPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import PodcastsPage from './pages/PodcastsPage.tsx';
import FoundersPage from './pages/FoundersPage.tsx';

//Utils
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/paas" element={<PaasPage />} />
            <Route path="/paas-explanation" element={<PaasExplanationPage />} />
            <Route path="/building-blocks" element={<BuildingBlocksPage />} />
            <Route path="/building-blocks/:id" element={<BuildingBlockDetail />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/podcasts" element={<PodcastsPage />} />
            <Route path="/founders" element={<FoundersPage />} />
            <Route path="/socios" element={<FoundersPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);