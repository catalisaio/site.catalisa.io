import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-primary-main">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold mb-6 text-white">{t('cta.title')}</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto text-white opacity-90">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/schedule" className="bg-white text-primary-main hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
            {t('cta.button1')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;