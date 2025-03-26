import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Menu, X, Headphones, BarChart, Shield, Box } from 'lucide-react';
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
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-main transition-colors">
                <Rocket size={16} className="text-primary-main" />
                <span>{t('nav.home')}</span>
              </Link>
              
              <Link to="/paas" className="flex items-center space-x-1 text-gray-700 hover:text-primary-main transition-colors">
                <BarChart size={16} className="text-primary-main" />
                <span>{t('nav.platform')}</span>
              </Link>
              
              <Link to="/building-blocks" className="flex items-center space-x-1 text-gray-700 hover:text-primary-main transition-colors">
                <Box size={16} className="text-primary-main" />
                <span>{t('nav.blocks')}</span>
              </Link>
              
              <a 
                href="#studio" 
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-main transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const studioSection = document.getElementById('studio');
                  if (studioSection) {
                    studioSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              >
                <Shield size={16} className="text-primary-main" />
                <span>{t('nav.studio')}</span>
              </a>
              
              <Link to="/podcasts" className="flex items-center space-x-1 text-gray-700 hover:text-primary-main transition-colors">
                <Headphones size={16} className="text-primary-main" />
                <span>{t('nav.podcast')}</span>
              </Link>
              
              <Link to="/paas-explanation" className="flex items-center space-x-1 text-gray-700 hover:text-primary-main transition-colors">
                <span>{t('nav.about')}</span>
              </Link>
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
              <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors">
                <Rocket size={18} className="text-primary-main" />
                <span>{t('nav.home')}</span>
              </Link>
              
              <Link to="/paas" className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors">
                <BarChart size={18} className="text-primary-main" />
                <span>{t('nav.platform')}</span>
              </Link>
              
              <Link to="/building-blocks" className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors">
                <Box size={18} className="text-primary-main" />
                <span>{t('nav.blocks')}</span>
              </Link>
              
              <a 
                href="#studio" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const studioSection = document.getElementById('studio');
                  if (studioSection) {
                    studioSection.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                  setMobileMenuOpen(false); // Close mobile menu after clicking
                }}
              >
                <Shield size={18} className="text-primary-main" />
                <span>{t('nav.studio')}</span>
              </a>
              
              <Link 
                to="/podcasts" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors"
                onClick={() => setMobileMenuOpen(false)} // Close mobile menu after clicking
              >
                <Headphones size={18} className="text-primary-main" />
                <span>{t('nav.podcast')}</span>
              </Link>
              
              <Link to="/paas-explanation" className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors">
                <span>{t('nav.about')}</span>
              </Link>
              
              <a 
                href="#contato" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-main transition-colors"
              >
                <span>{t('nav.contact')}</span>
              </a>
              
              <div className="pt-3">
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