import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationWhat: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
              {t('paasExplanation.what.title')}
            </h2>
            <p className="text-xl text-gray-700">
              {t('paasExplanation.what.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Conceito de Plataforma Financeira Componível" 
                className="rounded-lg shadow-soft"
              />
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-6">
                <strong className="text-gray-900">{t('paasExplanation.what.title')}</strong> {t('paasExplanation.what.desc1')}
              </p>
              <p className="text-lg text-gray-700 mb-6">
                {t('paasExplanation.what.desc2')}
              </p>
              <div className="bg-accent-bluePastel p-4 rounded-lg">
                <p className="text-lg font-medium text-gray-900">
                  {t('paasExplanation.what.quote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationWhat;