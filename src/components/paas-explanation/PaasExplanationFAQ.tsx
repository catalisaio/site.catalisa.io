import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationFAQ: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            {t('paasExplanation.faq.title') || 'Perguntas Frequentes'}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasExplanation.faq.subtitle') || 'Respostas para as dúvidas mais comuns sobre a Plataforma Componível e a Catalisa Platform.'}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('paasExplanation.faq.q1') || 'O que diferencia a Plataforma Componível de outros modelos de computação em nuvem?'}</h3>
              <p className="text-gray-700">
                {t('paasExplanation.faq.a1') || 'A Plataforma Componível oferece um equilíbrio ideal entre controle e conveniência. Diferente do IaaS, onde você gerencia o sistema operacional e middleware, ou do SaaS, onde você usa aplicativos pré-construídos, nossa plataforma fornece módulos completos para desenvolvimento, permitindo que você foque na lógica de negócios.'}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('paasExplanation.faq.q2') || 'A Catalisa Platform é segura para instituições financeiras?'}</h3>
              <p className="text-gray-700">
                {t('paasExplanation.faq.a2') || 'Sim, a Catalisa Platform foi projetada especificamente para atender aos rigorosos requisitos de segurança do setor financeiro. Nossa plataforma possui certificações ISO 27001, SOC 2 Tipo II, PCI DSS e está em conformidade com a LGPD e outras regulamentações financeiras, sem comprometer a agilidade.'}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('paasExplanation.faq.q3') || 'Como a Catalisa Platform ajuda a reduzir o tempo de desenvolvimento?'}</h3>
              <p className="text-gray-700">
                {t('paasExplanation.faq.a3') || 'Nossa plataforma oferece building blocks pré-construídos para funcionalidades financeiras comuns, ambientes de desenvolvimento padronizados, ferramentas de CI/CD integradas e automação de infraestrutura. Isso permite que suas equipes se concentrem no desenvolvimento de funcionalidades específicas do negócio, reduzindo o tempo de lançamento em até 70%.'}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('paasExplanation.faq.q4') || 'A Catalisa Platform é escalável para grandes volumes de transações?'}</h3>
              <p className="text-gray-700">
                {t('paasExplanation.faq.a4') || 'Absolutamente. Nossa plataforma foi projetada para escalar automaticamente conforme a demanda, suportando desde pequenas fintechs até grandes instituições financeiras com milhões de transações diárias. A infraestrutura subjacente se ajusta dinamicamente para garantir desempenho consistente mesmo durante picos de uso.'}
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('paasExplanation.faq.q5') || 'Quais linguagens de programação e frameworks são suportados?'}</h3>
              <p className="text-gray-700">
                {t('paasExplanation.faq.a5') || 'A Catalisa Platform suporta uma ampla gama de linguagens e frameworks modernos, incluindo Java, Python, Node.js, .NET, Go, e outros. Isso permite que suas equipes utilizem as tecnologias com as quais já estão familiarizadas, reduzindo a curva de aprendizado e acelerando a implementação.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationFAQ;