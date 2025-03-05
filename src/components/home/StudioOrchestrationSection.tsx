import React from 'react';
import { GitBranch, Monitor, Settings, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const StudioOrchestrationSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-accent-yellowPastel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-900">{t('orchestration.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('orchestration.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Catalisa Studio Orchestration para Portabilidade de Crédito" 
              className="rounded-lg shadow-soft"
            />
          </div>
          <div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-6">
                {t('orchestration.desc1')}
              </p>
              <p className="text-lg text-gray-700 mb-6">
                {t('orchestration.desc2')}
              </p>
              <p className="text-lg text-gray-700 mb-6">
                {t('orchestration.desc3')}
              </p>
              <p className="text-lg font-semibold text-accent-yellowText">
                {t('orchestration.desc4')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-yellow p-3 rounded-full">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('orchestration.card1.title')}</h3>
            </div>
            <p className="text-gray-700">{t('orchestration.card1.desc')}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-yellow p-3 rounded-full">
                <Monitor className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('orchestration.card2.title')}</h3>
            </div>
            <p className="text-gray-700">{t('orchestration.card2.desc')}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-yellow p-3 rounded-full">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">{t('orchestration.card3.title')}</h3>
            </div>
            <p className="text-gray-700">{t('orchestration.card3.desc')}</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-accent-yellow hover:bg-accent-yellow/90 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover inline-flex items-center">
            {t('orchestration.button')} <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudioOrchestrationSection;