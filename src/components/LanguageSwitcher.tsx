import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: 'pt-BR' | 'en-US') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          id="language-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <Globe className="h-5 w-5 mr-1" />
          {language === 'pt-BR' ? 'PT' : 'EN'}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            <button
              className={`${
                language === 'pt-BR' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
              role="menuitem"
              onClick={() => handleLanguageChange('pt-BR')}
            >
              Português
            </button>
            <button
              className={`${
                language === 'en-US' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
              role="menuitem"
              onClick={() => handleLanguageChange('en-US')}
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;