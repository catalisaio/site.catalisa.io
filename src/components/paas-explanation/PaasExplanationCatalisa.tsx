import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Layers, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasExplanationCatalisa: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-accent-bluePastel">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            Conheça a Catalisa Platform
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            A plataforma componível completa para instituições financeiras que buscam inovação, segurança e eficiência operacional.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Por que escolher a Catalisa Platform?</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-white p-3 rounded-md mr-4 mt-1">
                  <Shield className="h-5 w-5 text-accent-blueText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">Segurança de Nível Bancário</h4>
                  <p className="text-gray-700">Infraestrutura certificada que atende aos mais rigorosos padrões regulatórios do setor financeiro.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white p-3 rounded-md mr-4 mt-1">
                  <Layers className="h-5 w-5 text-accent-blueText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">Building Blocks Financeiros</h4>
                  <p className="text-gray-700">Mais de 20 componentes especializados para construir soluções financeiras completas com abordagem modular.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-white p-3 rounded-md mr-4 mt-1">
                  <Zap className="h-5 w-5 text-accent-blueText" />
                </div>
                <div>
                  <h4 className="font-semibold text-xl mb-1 text-gray-800">Desenvolvimento Acelerado</h4>
                  <p className="text-gray-700">Reduza o tempo de lançamento de produtos financeiros de meses para semanas com nossa abordagem componível.</p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <Link to="/paas" className="bg-primary-main hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover inline-flex items-center">
                {t('paas.button')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Catalisa Platform" 
              className="rounded-lg shadow-soft"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationCatalisa;