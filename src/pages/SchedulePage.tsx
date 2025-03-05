import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InlineWidget } from 'react-calendly';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const SchedulePage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      <section className="py-20 bg-gradient-to-b from-accent-bluePastel to-white">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-primary-main hover:underline mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" /> {t('nav.home')}
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900">
                {t('cta.button1')}
              </h1>
              <p className="text-xl text-gray-700">
                {t('contact.subtitle')}
              </p>
            </div>
            
            <div className="bg-white rounded-lg w-full shadow-soft overflow-hidden">
              <InlineWidget
                url="https://calendly.com/klederson-catalisa"
                styles={{
                  height: '700px',
                  width: '100%'
                }}
                pageSettings={{
                  backgroundColor: 'ffffff',
                  hideEventTypeDetails: true,
                  hideLandingPageDetails: true,
                  primaryColor: '734b9c',
                  textColor: '1a2937'
                }}
                prefill={{
                  email: '',
                  firstName: '',
                  lastName: '',
                  name: ''
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SchedulePage;