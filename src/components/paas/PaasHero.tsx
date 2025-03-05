import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasHero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
      <section className="py-20 bg-gradient-to-b from-accent-bluePastel to-white py-20 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: "url('/dist/assets/bg-blocks-000.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center backdrop-blur-md bg-white/20 rounded-xl border border-white/20 p-8 z-30 relative left-1/3">
          <h1 className="text-2xl md:text-6xl font-semibold mb-6 leading-tight text-gray-900">
            Catalisa <span className="text-primary-main">Platform</span>
              <span className="text-accent-yellow">.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-700">
            {t('paas.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/schedule" className="bg-primary-main hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('hero.button.start')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/building-blocks" className="bg-white border border-accent-blue text-accent-blue hover:bg-accent-bluePastel px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-subtle hover:shadow-hover">
              {t('nav.blocks')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasHero;