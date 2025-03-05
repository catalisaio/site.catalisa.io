import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

import heroBg from '../../../public/bg-paas-000.png'


const PaasExplanationHero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
      <section className="bg-gradient-to-b from-accent-bluePastel to-white py-10 sm:py-16 md:py-20 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4 flex justify-center md:justify-start">
        <div className="w-full sm:w-4/5 md:max-w-3xl backdrop-blur-md bg-white/20 rounded-xl border border-white/20 p-4 sm:p-6 md:p-8 z-30">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-semibold mb-3 sm:mb-6 leading-tight text-gray-900">
            {t('paasExplanation.what.title')} 
            
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 md:mb-10 text-gray-700">
            {t('paasExplanation.what.desc1')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:justify-start">
            <Link to="/paas" className="bg-primary-main hover:bg-primary-light text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-base sm:text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('paas.button')} <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
            <Link to="/schedule" className="bg-white border border-accent-blue text-accent-blue hover:bg-accent-bluePastel px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-base sm:text-lg transition-colors shadow-subtle hover:shadow-hover">
              {t('cta.button1')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationHero;