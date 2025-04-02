import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLocalizedPath, getNonLocalizedPath } from '../utils/routeUtils';
import { ptBR } from '../locales/pt-BR';
import { enUS } from '../locales/en-US';
import { deDE } from '../locales/de-DE';
import { esES } from '../locales/es-ES';
import { ruRU } from '../locales/ru-RU';
import { zhCN } from '../locales/zh-CN';
import { jaJP } from '../locales/ja-JP';

// Define available languages
export type Language = 'pt-BR' | 'en-US' | 'de-DE' | 'es-ES' | 'ru-RU' | 'zh-CN' | 'ja-JP';

// Define URL language codes (shorter versions)
export type UrlLanguage = 'pt' | 'en' | 'de' | 'es' | 'ru' | 'zh' | 'ja';

// Map between full Language and URL language codes
export const languageToUrlMap: Record<Language, UrlLanguage> = {
  'pt-BR': 'pt',
  'en-US': 'en',
  'de-DE': 'de',
  'es-ES': 'es',
  'ru-RU': 'ru',
  'zh-CN': 'zh',
  'ja-JP': 'ja'
};

// Map from URL language codes to full Language
export const urlToLanguageMap: Record<UrlLanguage, Language> = {
  'pt': 'pt-BR',
  'en': 'en-US',
  'de': 'de-DE',
  'es': 'es-ES',
  'ru': 'ru-RU',
  'zh': 'zh-CN',
  'ja': 'ja-JP'
};

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalizedUrl: (path: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'de-DE': deDE,
  'es-ES': esES,
  'ru-RU': ruRU,
  'zh-CN': zhCN,
  'ja-JP': jaJP
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguageState] = useState<Language>('pt-BR');

  // Initialize language from URL or local storage on first render
  useEffect(() => {
    const path = location.pathname;
    
    // Handle the root path case first
    if (path === '/') {
      // Determine the appropriate home path based on language
      let homePath: string;
      
      switch (language) {
        case 'en-US':
          homePath = 'home';
          break;
        case 'de-DE':
          homePath = 'startseite';
          break;
        case 'es-ES':
          homePath = 'inicio';
          break;
        case 'ru-RU':
          homePath = 'главная';
          break;
        case 'zh-CN':
          homePath = '首页';
          break;
        case 'ja-JP':
          homePath = 'ホーム';
          break;
        default:
          homePath = 'inicio'; // Portuguese or fallback
      }
      
      // Redirect to the language-specific home page using short language code
      navigate(`/${languageToUrlMap[language]}/${homePath}`, { replace: true });
      return;
    }
    
    // For other paths, try to extract language from URL
    const parts = path.split('/').filter(Boolean);
    
    if (parts.length > 0) {
      const urlLang = parts[0] as UrlLanguage;
      
      // If valid language is in the path, map it to full language code
      if (Object.keys(urlToLanguageMap).includes(urlLang)) {
        setLanguageState(urlToLanguageMap[urlLang]);
      } else {
        // If no valid language is found, redirect to language-prefixed path
        navigate(`/${languageToUrlMap[language]}${path}`, { replace: true });
      }
    }
  }, [location.pathname]);

  // Custom setLanguage that also updates the URL
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    
    // Update URL with new language
    const { routePath } = getNonLocalizedPath(location.pathname);
    const newPath = getLocalizedPath(routePath, lang);
    
    // Only navigate if necessary
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  };

  // Translation function
  const t = (key: string): string => {
    // Add type assertion to resolve index signature error
    return (translations[language] as Record<string, string>)[key] || key;
  };
  
  // Function to get localized URL for a given path
  const getLocalizedUrl = (path: string): string => {
    return getLocalizedPath(path, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedUrl }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};