import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Server, Database, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="paas" className="py-20 bg-accent-bluePastel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-900">{t('paas.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paas.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-soft hover:shadow-hover transition-shadow">
            <Server className="h-12 w-12 text-accent-blue mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paas.card1.title')}</h3>
            <p className="text-gray-700">
              {t('paas.card1.desc')}
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-soft hover:shadow-hover transition-shadow">
            <Database className="h-12 w-12 text-accent-blue mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paas.card2.title')}</h3>
            <p className="text-gray-700">
              {t('paas.card2.desc')}
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-soft hover:shadow-hover transition-shadow">
            <Globe className="h-12 w-12 text-accent-blue mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paas.card3.title')}</h3>
            <p className="text-gray-700">
              {t('paas.card3.desc')}
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/paas" className="bg-primary-main hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover inline-flex items-center">
            {t('paas.button')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaasSection;