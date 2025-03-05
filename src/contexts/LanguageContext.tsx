import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ptBR } from '../locales/pt-BR';
import { enUS } from '../locales/en-US';

// Define available languages
export type Language = 'pt-BR' | 'en-US';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  'pt-BR': ptBR,
  'en-US': enUS
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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