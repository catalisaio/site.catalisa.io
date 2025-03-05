import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

import heroBg from '../../../public/bg-blocks-000.jpeg'


const PaasHero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
      <section className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-accent-bluePastel to-white bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4 flex justify-center sm:justify-end">
        <div className="w-full sm:w-4/5 md:max-w-2xl text-center backdrop-blur-md bg-white/20 rounded-xl border border-white/20 p-4 sm:p-6 md:p-8 z-30">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-semibold mb-3 sm:mb-6 leading-tight text-gray-900">
            Catalisa <span className="text-primary-main">Platform</span>
              <span className="text-accent-yellow">.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 md:mb-10 text-gray-700">
            {t('paas.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link to="/schedule" className="bg-primary-main hover:bg-primary-light text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-base sm:text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('hero.button.start')} <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
            <Link to="/building-blocks" className="bg-white border border-accent-blue text-accent-blue hover:bg-accent-bluePastel px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-base sm:text-lg transition-colors shadow-subtle hover:shadow-hover">
              {t('nav.blocks')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasHero;