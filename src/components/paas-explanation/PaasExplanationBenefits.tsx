import React from 'react';
import { Zap, Server, Shield, Layers, Users, Cpu } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationBenefits: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            {t('paasExplanation.benefits.title') || 'Benefícios da Plataforma Componível'}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasExplanation.benefits.subtitle') || 'Descubra como a abordagem componível pode transformar sua estratégia de desenvolvimento e operações financeiras.'}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="bg-accent-bluePastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-accent-blueText" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.benefits.speed') || 'Desenvolvimento Acelerado'}</h3>
            <p className="text-gray-700">
              {t('paasExplanation.benefits.speedDesc') || 'Reduza o tempo de desenvolvimento em até 70% com ambientes pré-configurados e módulos integrados prontos para uso.'}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="bg-accent-yellowPastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Server className="h-8 w-8 text-accent-yellowText" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.benefits.cost') || 'Redução de Custos'}</h3>
            <p className="text-gray-700">
              {t('paasExplanation.benefits.costDesc') || 'Elimine gastos com infraestrutura e reduza custos operacionais em até 50% com recursos sob demanda e abordagem componível.'}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="bg-accent-orangePastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-accent-orangeText" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.benefits.security') || 'Segurança Integrada'}</h3>
            <p className="text-gray-700">
              {t('paasExplanation.benefits.securityDesc') || 'Beneficie-se de práticas de segurança de nível empresarial, atualizações automáticas e conformidade regulatória em cada componente.'}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="bg-primary-pastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Layers className="h-8 w-8 text-primary-main" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.benefits.scalability') || 'Escalabilidade Automática'}</h3>
            <p className="text-gray-700">
              {t('paasExplanation.benefits.scalabilityDesc') || 'Escale recursos automaticamente conforme a demanda, garantindo desempenho consistente mesmo em picos de uso, sem intervenção manual.'}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="bg-accent-bluePastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-accent-blueText" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.benefits.collaboration') || 'Colaboração Aprimorada'}</h3>
            <p className="text-gray-700">
              {t('paasExplanation.benefits.collaborationDesc') || 'Facilite a colaboração entre equipes com ambientes padronizados e ferramentas integradas, acelerando a entrega de produtos.'}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="bg-accent-yellowPastel p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Cpu className="h-8 w-8 text-accent-yellowText" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('paasExplanation.benefits.focus') || 'Foco no Negócio'}</h3>
            <p className="text-gray-700">
              {t('paasExplanation.benefits.focusDesc') || 'Concentre-se no desenvolvimento de funcionalidades que agregam valor ao seu negócio, não na infraestrutura, acelerando a inovação.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationBenefits;