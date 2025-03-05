import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

import heroBg from '../../../public/bg-blocks-004.jpeg'

const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-6 sm:px-10 md:px-20 py-10 sm:py-16 md:py-20 flex flex-col items-center text-center backdrop-blur-md bg-white/20 rounded-xl border border-white/20 z-30">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-4 sm:mb-6 leading-tight text-gray-900">
        {t('hero.title')} <span className="text-primary-main">Catalisa Platform</span>
      </h1>
      <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-3xl text-gray-700">
        {t('hero.subtitle')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link to="/schedule" className="bg-primary-main hover:bg-primary-light text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-base sm:text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
        {t('hero.button.start')} <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
        </Link>
        <Link to="/paas" className="bg-white border border-primary-main text-primary-main hover:bg-primary-pastel px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-base sm:text-lg transition-colors shadow-subtle hover:shadow-hover">
        {t('hero.button.more')}
        </Link>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;