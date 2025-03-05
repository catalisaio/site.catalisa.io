import React from 'react';
import { Server, Database, Globe, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasComponents: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">{t('paas.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paas.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col">
            <Server className="h-12 w-12 text-accent-blue mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paas.card1.title')}</h3>
            <p className="text-gray-700 flex-grow">
              {t('paas.card1.desc')}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>99.99% de uptime garantido</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Escalabilidade automática</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Monitoramento em tempo real</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col">
            <Database className="h-12 w-12 text-accent-blue mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paas.card2.title')}</h3>
            <p className="text-gray-700 flex-grow">
              {t('paas.card2.desc')}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Criptografia em repouso e em trânsito</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Backups automáticos diários</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Replicação geográfica</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col">
            <Globe className="h-12 w-12 text-accent-blue mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paas.card3.title')}</h3>
            <p className="text-gray-700 flex-grow">
              {t('paas.card3.desc')}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Documentação completa</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Sandbox para testes</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                <span>Integração com principais provedores</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasComponents;