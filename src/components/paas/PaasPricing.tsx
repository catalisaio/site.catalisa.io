import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasPricing: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">{t('paasPricing.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasPricing.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-soft hover:shadow-hover transition-shadow overflow-hidden">
            <div className="bg-gray-100 p-6 text-center">
              <h3 className="text-2xl font-semibold text-gray-900">{t('paasPricing.starter')}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">R$5.000</span>
                <span className="text-gray-600">{t('paasPricing.month')}</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.blocks5')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.transactions100k')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.emailSupport')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.uptime999')}</span>
                </li>
              </ul>
              <button className="w-full bg-white border border-primary-main text-primary-main hover:bg-primary-pastel px-6 py-3 rounded-md font-medium transition-colors shadow-subtle hover:shadow-hover">
                {t('paasPricing.learnMore')}
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-primary-main shadow-hover transition-shadow overflow-hidden transform scale-105 z-10">
            <div className="bg-primary-main p-6 text-center">
              <h3 className="text-2xl font-semibold text-white">{t('paasPricing.business')}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">R$15.000</span>
                <span className="text-white opacity-80">{t('paasPricing.month')}</span>
              </div>
              <div className="mt-2 bg-white text-primary-main text-sm font-semibold py-1 px-3 rounded-full inline-block">
                {t('paasPricing.mostPopular')}
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-main mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.blocks15')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-main mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.transactions500k')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-main mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.prioritySupport')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary-main mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.uptime9995')}</span>
                </li>
              </ul>
              <button className="w-full bg-primary-main hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium transition-colors shadow-soft hover:shadow-hover">
                {t('paasPricing.getStarted')}
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-soft hover:shadow-hover transition-shadow overflow-hidden">
            <div className="bg-gray-100 p-6 text-center">
              <h3 className="text-2xl font-semibold text-gray-900">{t('paasPricing.enterprise')}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{t('paasPricing.custom')}</span>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.blocksUnlimited')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.transactionsCustom')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.dedicatedManager')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                  <span className="text-gray-700">{t('paasPricing.uptime9999')}</span>
                </li>
              </ul>
              <button className="w-full bg-white border border-accent-blue text-accent-blue hover:bg-accent-bluePastel px-6 py-3 rounded-md font-medium transition-colors shadow-subtle hover:shadow-hover">
                {t('paasPricing.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasPricing;