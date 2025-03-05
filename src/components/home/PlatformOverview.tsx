import React from 'react';
import { Zap, Lock, Layers } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PlatformOverview: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="plataforma" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-900">{t('overview.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('overview.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Plataforma Financeira Componível Catalisa" 
              className="rounded-lg shadow-soft"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">{t('overview.section1.title')}</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-accent-yellowPastel p-3 rounded-md mr-4 mt-1">
                  <Zap className="h-5 w-5 text-accent-yellowText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('overview.section1.item1.title')}</h4>
                  <p className="text-gray-700">{t('overview.section1.item1.desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-accent-orangePastel p-3 rounded-md mr-4 mt-1">
                  <Lock className="h-5 w-5 text-accent-orangeText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('overview.section1.item2.title')}</h4>
                  <p className="text-gray-700">{t('overview.section1.item2.desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-accent-bluePastel p-3 rounded-md mr-4 mt-1">
                  <Layers className="h-5 w-5 text-accent-blueText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('overview.section1.item3.title')}</h4>
                  <p className="text-gray-700">{t('overview.section1.item3.desc')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;