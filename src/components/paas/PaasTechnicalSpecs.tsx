import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasTechnicalSpecs: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">{t('paasSpecs.title')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasSpecs.subtitle')}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-soft p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">{t('paasSpecs.infrastructure')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('paasSpecs.kubernetes')}</h4>
                      <p className="text-gray-700">{t('paasSpecs.kubernetesDesc')}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('paasSpecs.multicloud')}</h4>
                      <p className="text-gray-700">{t('paasSpecs.multicloudDesc')}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('paasSpecs.cdn')}</h4>
                      <p className="text-gray-700">{t('paasSpecs.cdnDesc')}</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">{t('paasSpecs.security')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-orange mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('paasSpecs.encryption')}</h4>
                      <p className="text-gray-700">{t('paasSpecs.encryptionDesc')}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-orange mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('paasSpecs.ddos')}</h4>
                      <p className="text-gray-700">{t('paasSpecs.ddosDesc')}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent-orange mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{t('paasSpecs.certifications')}</h4>
                      <p className="text-gray-700">{t('paasSpecs.certificationsDesc')}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">{t('paasSpecs.performance')}</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-accent-blue mb-2">99.99%</div>
                  <p className="text-gray-700">{t('paasSpecs.uptime')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-accent-yellow mb-2">&lt; 100ms</div>
                  <p className="text-gray-700">{t('paasSpecs.latency')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-accent-orange mb-2">1M+</div>
                  <p className="text-gray-700">{t('paasSpecs.transactions')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasTechnicalSpecs;