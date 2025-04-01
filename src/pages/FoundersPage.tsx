import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import ContactSection from '../components/home/ContactSection';

const FoundersPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section 
        className="py-28 relative bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url("/bg-blocks-003.jpeg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-main/70 to-primary-dark/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl">
            <div className="text-center mb-2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
                {t('founders.title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
                {t('founders.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-dark">
              {t('founders.overview.title')}
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('founders.overview.text')}
            </p>
          </div>
        </div>
      </section>

      {/* Founders Cards Section */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-ultraLight">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Klederson Bueno */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-2xl">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src="/klederson.jpg" 
                  alt="Klederson Bueno" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary-dark mb-2">
                  {t('founders.klederson.name')}
                </h3>
                <p className="text-primary-main font-semibold mb-4">
                  {t('founders.klederson.title')}
                </p>
                <p className="text-gray-700 mb-4">
                  {t('founders.klederson.profile')}
                </p>
                <p className="text-gray-700 mb-6">
                  {t('founders.klederson.role')}
                </p>
                <a 
                  href={t('founders.klederson.linkedin')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
            
            {/* Marcelo Clara */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-2xl">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src="/maclara.jpg" 
                  alt="Marcelo Clara" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary-dark mb-2">
                  {t('founders.clara.name')}
                </h3>
                <p className="text-primary-main font-semibold mb-4">
                  {t('founders.clara.title')}
                </p>
                <p className="text-gray-700 mb-4">
                  {t('founders.clara.profile')}
                </p>
                <p className="text-gray-700 mb-6">
                  {t('founders.clara.role')}
                </p>
                <a 
                  href={t('founders.clara.linkedin')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
            
            {/* Marcelo Santos */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-2xl">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src="/marcelsud.jpg" 
                  alt="Marcelo Santos" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-primary-dark mb-2">
                  {t('founders.santos.name')}
                </h3>
                <p className="text-primary-main font-semibold mb-4">
                  {t('founders.santos.title')}
                </p>
                <p className="text-gray-700 mb-4">
                  {t('founders.santos.profile')}
                </p>
                <p className="text-gray-700 mb-6">
                  {t('founders.santos.role')}
                </p>
                <a 
                  href={t('founders.santos.linkedin')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent-blue hover:text-accent-blue/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default FoundersPage;