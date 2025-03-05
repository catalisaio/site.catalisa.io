import React from 'react';
import { Shield, Zap, Layers, Users, BarChart2, Database } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationFinancial: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            {t('paasExplanation.financial.title') || 'Plataforma Componível para Serviços Financeiros'}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasExplanation.financial.subtitle') || 'Por que a abordagem componível é a escolha ideal para instituições financeiras que buscam inovação, segurança e eficiência na transformação digital.'}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Plataforma para Serviços Financeiros e Portabilidade de Crédito" 
              className="rounded-lg shadow-soft"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">{t('paasExplanation.financial.challenges') || 'Desafios Únicos do Setor Financeiro'}</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-accent-bluePastel p-3 rounded-md mr-4 mt-1">
                  <Shield className="h-5 w-5 text-accent-blueText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('paasExplanation.financial.compliance') || 'Conformidade Regulatória'}</h4>
                  <p className="text-gray-700">{t('paasExplanation.financial.complianceDesc') || 'Nossa plataforma oferece controles de segurança e conformidade integrados para atender a regulamentações como LGPD, PCI DSS e outras.'}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-accent-yellowPastel p-3 rounded-md mr-4 mt-1">
                  <Zap className="h-5 w-5 text-accent-yellowText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('paasExplanation.financial.agility') || 'Agilidade e Inovação'}</h4>
                  <p className="text-gray-700">{t('paasExplanation.financial.agilityDesc') || 'Acelere o lançamento de produtos financeiros com módulos pré-construídos para competir com fintechs e atender às expectativas dos clientes.'}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-accent-orangePastel p-3 rounded-md mr-4 mt-1">
                  <Layers className="h-5 w-5 text-accent-orangeText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">{t('paasExplanation.financial.scalability') || 'Escalabilidade Segura'}</h4>
                  <p className="text-gray-700">{t('paasExplanation.financial.scalabilityDesc') || 'Escale suas operações para atender a picos de demanda sem comprometer a segurança ou o desempenho, eliminando gargalos operacionais.'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 max-w-5xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-gray-900 text-center">{t('paasExplanation.financial.useCases') || 'Casos de Uso no Setor Financeiro'}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-soft hover:shadow-hover transition-shadow">
              <div className="bg-primary-pastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary-main" />
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.financial.onboarding') || 'Onboarding Digital'}</h4>
              <p className="text-gray-700">
                {t('paasExplanation.financial.onboardingDesc') || 'Crie experiências de onboarding seguras e sem atrito, com verificação de identidade e assinatura digital integradas para transformação digital no setor financeiro.'}
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-soft hover:shadow-hover transition-shadow">
              <div className="bg-accent-bluePastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <BarChart2 className="h-8 w-8 text-accent-blueText" />
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.financial.credit') || 'Portabilidade de Crédito'}</h4>
              <p className="text-gray-700">
                {t('paasExplanation.financial.creditDesc') || 'Implemente soluções de portabilidade de crédito com análise em tempo real e integração com bureaus, reduzindo riscos e melhorando a experiência do cliente.'}
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-soft hover:shadow-hover transition-shadow">
              <div className="bg-accent-yellowPastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Database className="h-8 w-8 text-accent-yellowText" />
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.financial.openBanking') || 'Open Banking'}</h4>
              <p className="text-gray-700">
                {t('paasExplanation.financial.openBankingDesc') || 'Desenvolva APIs seguras e escaláveis para compartilhamento de dados e integração com parceiros, acelerando a inovação e a transformação digital.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationFinancial;