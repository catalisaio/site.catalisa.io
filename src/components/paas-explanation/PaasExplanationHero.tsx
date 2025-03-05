import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

import heroBg from '../../../public/bg-paas-000.png'


const PaasExplanationHero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
      <section className="bg-gradient-to-b from-accent-bluePastel to-white py-20 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4 ">
        <div className="max-w-3xl mx-auto backdrop-blur-md bg-white/20 rounded-xl border border-white/20 p-8 z-30 relative right-1/3">
          <h1 className="text-2xl md:text-6xl font-semibold mb-6 leading-tight text-gray-900">
            {t('paasExplanation.what.title')} 
            
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-700">
            {t('paasExplanation.what.desc1')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/paas" className="bg-primary-main hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('paas.button')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/schedule" className="bg-white border border-accent-blue text-accent-blue hover:bg-accent-bluePastel px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-subtle hover:shadow-hover">
              {t('cta.button1')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationHero;