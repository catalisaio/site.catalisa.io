import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationComparison: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            Plataforma Componível vs. Outros Modelos
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Entenda as diferenças entre os principais modelos de computação em nuvem e por que a abordagem componível é ideal para instituições financeiras.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-soft">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-gray-900 font-semibold border-b">Características</th>
                  <th className="p-4 text-center text-gray-900 font-semibold border-b">On-Premises</th>
                  <th className="p-4 text-center text-gray-900 font-semibold border-b">IaaS</th>
                  <th className="p-4 text-center text-gray-900 font-semibold border-b">Plataforma Componível</th>
                  <th className="p-4 text-center text-gray-900 font-semibold border-b">SaaS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Controle sobre infraestrutura</td>
                  <td className="p-4 border-b text-center text-gray-700">Total</td>
                  <td className="p-4 border-b text-center text-gray-700">Alto</td>
                  <td className="p-4 border-b text-center text-gray-700">Médio</td>
                  <td className="p-4 border-b text-center text-gray-700">Baixo</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Manutenção de hardware</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Gerenciamento de SO</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Gerenciamento de middleware</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Desenvolvimento de aplicações</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Cliente</td>
                  <td className="p-4 border-b text-center text-gray-700">Provedor</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Escalabilidade</td>
                  <td className="p-4 border-b text-center text-gray-700">Limitada</td>
                  <td className="p-4 border-b text-center text-gray-700">Manual</td>
                  <td className="p-4 border-b text-center text-gray-700">Automática</td>
                  <td className="p-4 border-b text-center text-gray-700">Automática</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Custo inicial</td>
                  <td className="p-4 border-b text-center text-gray-700">Alto</td>
                  <td className="p-4 border-b text-center text-gray-700">Médio</td>
                  <td className="p-4 border-b text-center text-gray-700">Baixo</td>
                  <td className="p-4 border-b text-center text-gray-700">Muito baixo</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-900 font-medium">Velocidade de desenvolvimento</td>
                  <td className="p-4 border-b text-center text-gray-700">Lenta</td>
                  <td className="p-4 border-b text-center text-gray-700">Média</td>
                  <td className="p-4 border-b text-center text-gray-700">Rápida</td>
                  <td className="p-4 border-b text-center text-gray-700">Instantânea</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-900 font-medium">Ideal para</td>
                  <td className="p-4 text-center text-gray-700">{t('paasPricing.idealFor1')}</td>
                  <td className="p-4 text-center text-gray-700">{t('paasPricing.idealFor2')}</td>
                  <td className="p-4 text-center text-gray-700 font-semibold bg-accent-bluePastel">{t('paasPricing.idealFor3')}</td>
                  <td className="p-4 text-center text-gray-700">{t('paasPricing.idealFor4')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationComparison;