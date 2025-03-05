import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-subtle sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-semibold">
              <span className="text-primary-main">Catalisa</span>
              <span className="text-accent-yellow">.</span>
            </span>
          </Link>
          
          <div className="flex items-center">
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.home')}</Link>
              <Link to="/paas" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.platform')}</Link>
              <Link to="/paas-explanation" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.about')}</Link>
              <Link to="/building-blocks" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.blocks')}</Link>
              <a href="/#studio" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.studio')}</a>
              <a href="/#contato" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.contact')}</a>
            </nav>
            
            <div className="hidden md:block ml-4">
              <LanguageSwitcher />
            </div>
            
            <Link to="/schedule" className="ml-4 bg-primary-main hover:bg-primary-light text-white px-4 py-2 rounded-md font-medium transition-colors shadow-subtle hover:shadow-hover">
              {t('nav.demo')}
            </Link>
            
            <button 
              className="ml-4 md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.home')}</Link>
              <Link to="/paas" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.platform')}</Link>
              <Link to="/paas-explanation" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.about')}</Link>
              <Link to="/building-blocks" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.blocks')}</Link>
              <a href="#studio" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.studio')}</a>
              <a href="#contato" className="text-gray-700 hover:text-primary-main transition-colors">{t('nav.contact')}</a>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;