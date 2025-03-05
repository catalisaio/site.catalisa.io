import React from 'react';
import { Shield, Zap, Layers, Users, BarChart2, Database, ChevronRight, CheckCircle, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-900">{t('features.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-primary-pastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-primary-main p-3 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('features.card1.title')}</h3>
            </div>
            <p className="text-gray-700">{t('features.card1.desc')}</p>
            <a href="#" className="flex items-center mt-4 text-primary-main font-medium hover:underline">
              {t('features.more')} <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-accent-yellowPastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-yellow p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('features.card2.title')}</h3>
            </div>
            <p className="text-gray-700">{t('features.card2.desc')}</p>
            <a href="#" className="flex items-center mt-4 text-accent-yellowText font-medium hover:underline">
              {t('features.more')} <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-accent-orangePastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-orange p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('features.card3.title')}</h3>
            </div>
            <p className="text-gray-700">{t('features.card3.desc')}</p>
            <a href="#" className="flex items-center mt-4 text-accent-orangeText font-medium hover:underline">
              {t('features.more')} <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-accent-bluePastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-blue p-3 rounded-full">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('features.card4.title')}</h3>
            </div>
            <p className="text-gray-700">{t('features.card4.desc')}</p>
            <a href="#" className="flex items-center mt-4 text-accent-blueText font-medium hover:underline">
              {t('features.more')} <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;