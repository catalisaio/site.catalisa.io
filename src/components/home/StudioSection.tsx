import React from 'react';
import { Code, Layers, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const StudioSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="studio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-900">{t('studio.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('studio.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">{t('studio.section1.title')}</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-accent-yellowPastel p-3 rounded-md mr-4 mt-1">
                  <Code className="h-5 w-5 text-accent-yellowText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('studio.section1.item1.title')}</h4>
                  <p className="text-gray-700">{t('studio.section1.item1.desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-accent-orangePastel p-3 rounded-md mr-4 mt-1">
                  <Layers className="h-5 w-5 text-accent-orangeText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('studio.section1.item2.title')}</h4>
                  <p className="text-gray-700">{t('studio.section1.item2.desc')}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg- accent-bluePastel p-3 rounded-md mr-4 mt-1">
                  <Zap className="h-5 w-5 text-accent-blueText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('studio.section1.item3.title')}</h4>
                  <p className="text-gray-700">{t('studio.section1.item3.desc')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Catalisa Studio Interface para Transformação Digital" 
              className="rounded-lg shadow-soft"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;