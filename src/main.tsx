import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { getLocalizedPath, languageToUrlMap } from './utils/routeUtils.ts';
import './index.css';

// Define supported languages for routes (full codes)
const languages = ['pt-BR', 'en-US', 'de-DE', 'es-ES', 'ru-RU', 'zh-CN'];

// Define URL language codes (shorter versions)
const urlLanguages = ['pt', 'en', 'de', 'es', 'ru', 'zh'];

// Default language (used for redirects)
const defaultLanguage = 'pt-BR';
const defaultUrlLanguage = 'pt';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Layout>
          <Routes>
            {/* Language-prefixed home routes with 2-letter codes */}
            <Route path="/pt/inicio" element={<App />} />
            <Route path="/en/home" element={<App />} />
            <Route path="/de/startseite" element={<App />} />
            <Route path="/es/inicio" element={<App />} />
            <Route path="/ru/главная" element={<App />} />
            <Route path="/zh/首页" element={<App />} />
            
            {/* Default language routes - provide fallbacks */}
            <Route path="/pt" element={<App />} />
            <Route path="/en" element={<App />} />
            <Route path="/de" element={<App />} />
            <Route path="/es" element={<App />} />
            <Route path="/ru" element={<App />} />
            <Route path="/zh" element={<App />} />
            
            {/* Platform routes */}
            <Route path="/pt/plataforma" element={<PaasPage />} />
            <Route path="/en/platform" element={<PaasPage />} />
            <Route path="/de/plattform" element={<PaasPage />} />
            <Route path="/es/plataforma" element={<PaasPage />} />
            <Route path="/ru/платформа" element={<PaasPage />} />
            <Route path="/zh/平台" element={<PaasPage />} />
            
            {/* Platform explanation routes */}
            <Route path="/pt/explicacao-plataforma" element={<PaasExplanationPage />} />
            <Route path="/en/platform-explanation" element={<PaasExplanationPage />} />
            <Route path="/de/plattform-erklarung" element={<PaasExplanationPage />} />
            <Route path="/es/explicacion-plataforma" element={<PaasExplanationPage />} />
            <Route path="/ru/объяснение-платформы" element={<PaasExplanationPage />} />
            <Route path="/zh/平台解释" element={<PaasExplanationPage />} />
            
            {/* Building blocks routes */}
            <Route path="/pt/blocos-construcao" element={<BuildingBlocksPage />} />
            <Route path="/en/building-blocks" element={<BuildingBlocksPage />} />
            <Route path="/de/bausteine" element={<BuildingBlocksPage />} />
            <Route path="/es/bloques-construccion" element={<BuildingBlocksPage />} />
            <Route path="/ru/строительные-блоки" element={<BuildingBlocksPage />} />
            <Route path="/zh/构建块" element={<BuildingBlocksPage />} />
            
            {/* Building blocks detail routes */}
            <Route path="/pt/blocos-construcao/:id" element={<BuildingBlockDetail />} />
            <Route path="/en/building-blocks/:id" element={<BuildingBlockDetail />} />
            <Route path="/de/bausteine/:id" element={<BuildingBlockDetail />} />
            <Route path="/es/bloques-construccion/:id" element={<BuildingBlockDetail />} />
            <Route path="/ru/строительные-блоки/:id" element={<BuildingBlockDetail />} />
            <Route path="/zh/构建块/:id" element={<BuildingBlockDetail />} />
            
            {/* Schedule routes */}
            <Route path="/pt/agendar" element={<SchedulePage />} />
            <Route path="/en/schedule" element={<SchedulePage />} />
            <Route path="/de/terminplan" element={<SchedulePage />} />
            <Route path="/es/programar" element={<SchedulePage />} />
            <Route path="/ru/расписание" element={<SchedulePage />} />
            <Route path="/zh/日程安排" element={<SchedulePage />} />
            
            {/* FAQ routes */}
            <Route path="/pt/perguntas-frequentes" element={<FAQPage />} />
            <Route path="/en/faq" element={<FAQPage />} />
            <Route path="/de/haufig-gestellte-fragen" element={<FAQPage />} />
            <Route path="/es/preguntas-frecuentes" element={<FAQPage />} />
            <Route path="/ru/часто-задаваемые-вопросы" element={<FAQPage />} />
            <Route path="/zh/常见问题" element={<FAQPage />} />
            
            {/* Privacy policy routes */}
            <Route path="/pt/politica-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/en/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/de/datenschutzrichtlinie" element={<PrivacyPolicyPage />} />
            <Route path="/es/politica-privacidad" element={<PrivacyPolicyPage />} />
            <Route path="/ru/политика-конфиденциальности" element={<PrivacyPolicyPage />} />
            <Route path="/zh/隐私政策" element={<PrivacyPolicyPage />} />
            
            {/* Podcasts routes */}
            <Route path="/pt/podcasts" element={<PodcastsPage />} />
            <Route path="/en/podcasts" element={<PodcastsPage />} />
            <Route path="/de/podcasts" element={<PodcastsPage />} />
            <Route path="/es/podcasts" element={<PodcastsPage />} />
            <Route path="/ru/подкасты" element={<PodcastsPage />} />
            <Route path="/zh/播客" element={<PodcastsPage />} />
            
            {/* Founders routes */}
            <Route path="/pt/socios" element={<FoundersPage />} />
            <Route path="/en/founders" element={<FoundersPage />} />
            <Route path="/de/grunder" element={<FoundersPage />} />
            <Route path="/es/fundadores" element={<FoundersPage />} />
            <Route path="/ru/основатели" element={<FoundersPage />} />
            <Route path="/zh/创始人" element={<FoundersPage />} />
            
            {/* Redirect from non-prefixed routes to language-prefixed routes */}
            <Route path="/" element={<Navigate to={`/${defaultUrlLanguage}/inicio`} replace />} />
            <Route path="/paas" element={<Navigate to={`/${defaultUrlLanguage}/plataforma`} replace />} />
            <Route path="/paas-explanation" element={<Navigate to={`/${defaultUrlLanguage}/explicacao-plataforma`} replace />} />
            <Route path="/building-blocks" element={<Navigate to={`/${defaultUrlLanguage}/blocos-construcao`} replace />} />
            <Route 
              path="/building-blocks/:id" 
              element={<BuildingBlockDetail />} 
            />
            <Route path="/schedule" element={<Navigate to={`/${defaultUrlLanguage}/agendar`} replace />} />
            <Route path="/faq" element={<Navigate to={`/${defaultUrlLanguage}/perguntas-frequentes`} replace />} />
            <Route path="/privacy-policy" element={<Navigate to={`/${defaultUrlLanguage}/politica-privacidade`} replace />} />
            <Route path="/podcasts" element={<Navigate to={`/${defaultUrlLanguage}/podcasts`} replace />} />
            <Route path="/founders" element={<Navigate to={`/${defaultUrlLanguage}/socios`} replace />} />
            <Route path="/socios" element={<Navigate to={`/${defaultUrlLanguage}/socios`} replace />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to={getLocalizedPath('/', defaultLanguage)} replace />} />
          </Routes>
        </Layout>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);