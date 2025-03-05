import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Code, Shield, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaasBuildingBlocks: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">{t('blocks.title')} {t('nav.platform')}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('blocks.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-accent-bluePastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-blue p-3 rounded-full">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">Dados e Analytics</h3>
            </div>
            <p className="text-gray-700">Ferramentas para processamento e análise de dados financeiros em tempo real, acelerando insights e decisões.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-blueText mr-2" />
                <span>NRT Data Platform</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-blueText mr-2" />
                <span>Risk Analysis</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-blueText mr-2" />
                <span>Decision Engine</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-accent-yellowPastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-yellow p-3 rounded-full">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">Operações Financeiras</h3>
            </div>
            <p className="text-gray-700">Componentes para automatizar e otimizar operações financeiras diárias, reduzindo custos e aumentando eficiência.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-yellowText mr-2" />
                <span>Billing</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-yellowText mr-2" />
                <span>Payments</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-yellowText mr-2" />
                <span>Loan Management</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-accent-orangePastel rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-accent-orange p-3 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold ml-3 text-gray-900">Segurança e Compliance</h3>
            </div>
            <p className="text-gray-700">Soluções para garantir a segurança e conformidade regulatória de suas operações, reduzindo riscos e custos de compliance.</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-orangeText mr-2" />
                <span>Identity and Access Management</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-orangeText mr-2" />
                <span>Audit Trail</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle className="h-4 w-4 text-accent-orangeText mr-2" />
                <span>Document Signature</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/building-blocks" className="bg-primary-main hover:bg-primary-light text-white px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover inline-flex items-center">
            {t('blockDetail.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaasBuildingBlocks;