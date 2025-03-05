import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaasHero from '../components/paas/PaasHero';
import PaasOverview from '../components/paas/PaasOverview';
import PaasComponents from '../components/paas/PaasComponents';
import PaasBuildingBlocks from '../components/paas/PaasBuildingBlocks';
import PaasTechnicalSpecs from '../components/paas/PaasTechnicalSpecs';
import PaasPricing from '../components/paas/PaasPricing';
import { useLanguage } from '../contexts/LanguageContext';

const PaasPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      <PaasHero />
      <PaasOverview />
      <PaasComponents />
      <PaasBuildingBlocks />
      <PaasTechnicalSpecs />
      {/* <PaasPricing /> */}

      {/* CTA Section */}
      <section className="py-20 bg-primary-main">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">{t('cta.title')}</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-white opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/schedule" className="bg-white text-primary-main hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('cta.button1')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {/* <button className="bg-transparent border border-white text-white hover:bg-primary-light px-6 py-3 rounded-md font-medium text-lg transition-colors">
              {t('cta.button2')}
            </button> */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaasPage;