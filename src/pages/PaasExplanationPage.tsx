import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaasExplanationHero from '../components/paas-explanation/PaasExplanationHero';
import PaasExplanationWhat from '../components/paas-explanation/PaasExplanationWhat';
import PaasExplanationHow from '../components/paas-explanation/PaasExplanationHow';
import PaasExplanationBenefits from '../components/paas-explanation/PaasExplanationBenefits';
import PaasExplanationComparison from '../components/paas-explanation/PaasExplanationComparison';
import PaasExplanationFinancial from '../components/paas-explanation/PaasExplanationFinancial';
import PaasExplanationCatalisa from '../components/paas-explanation/PaasExplanationCatalisa';
import PaasExplanationFAQ from '../components/paas-explanation/PaasExplanationFAQ';
import { useLanguage } from '../contexts/LanguageContext';

const PaasExplanationPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      <PaasExplanationHero />
      <PaasExplanationWhat />
      <PaasExplanationHow />
      <PaasExplanationBenefits />
      {/* <PaasExplanationComparison /> */}
      <PaasExplanationFinancial />
      <PaasExplanationCatalisa />
      <PaasExplanationFAQ />

      {/* CTA Section */}
      <section className="py-20 bg-primary-main">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">{t('cta.title')}</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-white opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-main hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('cta.button1')} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link to="/paas" className="bg-transparent border border-white text-white hover:bg-primary-light px-6 py-3 rounded-md font-medium text-lg transition-colors">
              {t('paas.button')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaasExplanationPage;