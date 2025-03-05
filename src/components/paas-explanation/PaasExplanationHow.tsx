import React from 'react';
import { Cloud, Layers, Code, CheckCircle, GitBranch, CloudLightning, BarChart2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationHow: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            {t('paasExplanation.how.title') || 'Como Funciona a Plataforma Componível?'}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasExplanation.how.subtitle') || 'Entenda a arquitetura que torna a plataforma uma solução revolucionária para o desenvolvimento de aplicações financeiras.'}
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col">
              <div className="bg-accent-blue p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paasExplanation.how.infrastructure') || 'Infraestrutura'}</h3>
              <p className="text-gray-700 flex-grow">
                {t('paasExplanation.how.infrastructureDesc') || 'A plataforma gerencia toda a infraestrutura subjacente, incluindo servidores, armazenamento e redes, eliminando preocupações operacionais.'}
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                  <span>{t('paasExplanation.how.servers') || 'Servidores gerenciados'}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                  <span>{t('paasExplanation.how.storage') || 'Armazenamento escalável'}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-blue mr-2" />
                  <span>{t('paasExplanation.how.networks') || 'Redes seguras'}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col">
              <div className="bg-accent-yellow p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paasExplanation.how.middleware') || 'Middleware'}</h3>
              <p className="text-gray-700 flex-grow">
                {t('paasExplanation.how.middlewareDesc') || 'Camada que fornece ferramentas e serviços para desenvolvimento, como bancos de dados, sistemas de mensagens e autenticação integrada.'}
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-yellowText mr-2" />
                  <span>{t('paasExplanation.how.databases') || 'Bancos de dados otimizados'}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-yellowText mr-2" />
                  <span>{t('paasExplanation.how.messaging') || 'Sistemas de mensageria'}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-yellowText mr-2" />
                  <span>{t('paasExplanation.how.auth') || 'Serviços de autenticação'}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow h-full flex flex-col">
              <div className="bg-accent-orange p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('paasExplanation.how.platform') || 'Plataforma de Desenvolvimento'}</h3>
              <p className="text-gray-700 flex-grow">
                {t('paasExplanation.how.platformDesc') || 'Ambiente completo para desenvolvimento, teste e implantação de aplicações, incluindo ferramentas e frameworks que aceleram a entrega.'}
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-orangeText mr-2" />
                  <span>{t('paasExplanation.how.environments') || 'Ambientes de desenvolvimento'}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-orangeText mr-2" />
                  <span>{t('paasExplanation.how.cicd') || 'Ferramentas de CI/CD'}</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-accent-orangeText mr-2" />
                  <span>{t('paasExplanation.how.frameworks') || 'Frameworks e bibliotecas'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-lg shadow-soft">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 text-center">{t('paasExplanation.how.workflow') || 'Fluxo de Trabalho na Plataforma'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-primary-pastel p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-primary-main" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('paasExplanation.how.step1') || '1. Desenvolvimento'}</h4>
                <p className="text-gray-700 text-sm">{t('paasExplanation.how.step1Desc') || 'Desenvolva seu código usando módulos pré-construídos e ferramentas integradas'}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-pastel p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="h-8 w-8 text-primary-main" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('paasExplanation.how.step2') || '2. Teste'}</h4>
                <p className="text-gray-700 text-sm">{t('paasExplanation.how.step2Desc') || 'Teste sua aplicação em ambientes idênticos ao de produção, acelerando a validação'}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-pastel p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CloudLightning className="h-8 w-8 text-primary-main" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('paasExplanation.how.step3') || '3. Implantação'}</h4>
                <p className="text-gray-700 text-sm">{t('paasExplanation.how.step3Desc') || 'Implante com um clique ou automaticamente via CI/CD, eliminando processos complexos'}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary-pastel p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BarChart2 className="h-8 w-8 text-primary-main" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('paasExplanation.how.step4') || '4. Monitoramento'}</h4>
                <p className="text-gray-700 text-sm">{t('paasExplanation.how.step4Desc') || 'Monitore desempenho, uso e segurança em tempo real, garantindo operações confiáveis'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationHow;