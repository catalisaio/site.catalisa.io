import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import ContactSection from '../components/home/ContactSection';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section 
        className="py-28 relative bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: 'url("/bg-blocks-001.jpeg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-main/70 to-primary-dark/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
              {t('privacy.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
              {t('privacy.subtitle')}
            </p>
            <p className="mt-8 text-white/80 inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              {t('privacy.lastUpdated')}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-ultraLight">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 mb-12 border border-gray-100">
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.intro.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{t('privacy.intro.text')}</p>
          </div>
          
          {/* Information Collection */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold mb-6 text-primary-main pb-2 border-b border-primary-light">{t('privacy.collection.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{t('privacy.collection.subtitle')}</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary-ultraLight rounded-xl p-6 shadow-md transition-transform hover:translate-y-[-5px] duration-300 border border-primary-light/20">
                <h3 className="text-xl font-bold mb-3 text-primary-dark flex items-center">
                  <span className="inline-block p-2 mr-2 rounded-full bg-primary-main/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-main" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {t('privacy.collection.personalInfo.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">{t('privacy.collection.personalInfo.text')}</p>
              </div>
              
              <div className="bg-primary-ultraLight rounded-xl p-6 shadow-md transition-transform hover:translate-y-[-5px] duration-300 border border-primary-light/20">
                <h3 className="text-xl font-bold mb-3 text-primary-dark flex items-center">
                  <span className="inline-block p-2 mr-2 rounded-full bg-primary-main/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-main" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {t('privacy.collection.usage.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">{t('privacy.collection.usage.text')}</p>
              </div>
              
              <div className="bg-primary-ultraLight rounded-xl p-6 shadow-md transition-transform hover:translate-y-[-5px] duration-300 border border-primary-light/20">
                <h3 className="text-xl font-bold mb-3 text-primary-dark flex items-center">
                  <span className="inline-block p-2 mr-2 rounded-full bg-primary-main/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-main" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                  </span>
                  {t('privacy.collection.cookies.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">{t('privacy.collection.cookies.text')}</p>
              </div>
            </div>
          </div>
          
          {/* How We Use Information */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold mb-6 text-primary-main pb-2 border-b border-primary-light">{t('privacy.use.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{t('privacy.use.text')}</p>
            
            <ul className="grid gap-3 text-gray-700">
              <li>{t('privacy.use.list.1')}</li>
              <li>{t('privacy.use.list.2')}</li>
              <li>{t('privacy.use.list.3')}</li>
              <li>{t('privacy.use.list.4')}</li>
              <li>{t('privacy.use.list.5')}</li>
              <li>{t('privacy.use.list.6')}</li>
              <li>{t('privacy.use.list.7')}</li>
            </ul>
          </div>
          
          {/* Information Sharing */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold mb-6 text-primary-main pb-2 border-b border-primary-light">{t('privacy.sharing.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{t('privacy.sharing.text')}</p>
            
            <div className="bg-primary-ultraLight rounded-xl p-8 shadow-md mb-8 border border-primary-light/20">
              <ul className="grid gap-4 text-gray-700">
              <li>{t('privacy.sharing.list.1')}</li>
              <li>{t('privacy.sharing.list.2')}</li>
              <li>{t('privacy.sharing.list.3')}</li>
              <li>{t('privacy.sharing.list.4')}</li>
              </ul>
            </div>
          </div>
          
          {/* Data Security */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold mb-6 text-primary-main pb-2 border-b border-primary-light">{t('privacy.security.title')}</h2>
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg">{t('privacy.security.text')}</p>
            </div>
          </div>
          
          {/* Your Privacy Rights */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold mb-6 text-primary-main pb-2 border-b border-primary-light">{t('privacy.rights.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{t('privacy.rights.text')}</p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <li>{t('privacy.rights.list.1')}</li>
              <li>{t('privacy.rights.list.2')}</li>
              <li>{t('privacy.rights.list.3')}</li>
              <li>{t('privacy.rights.list.4')}</li>
              <li>{t('privacy.rights.list.5')}</li>
              <li>{t('privacy.rights.list.6')}</li>
            </ul>
          </div>
          
          {/* Final Sections with Card Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Children's Privacy */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-primary-dark">{t('privacy.children.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('privacy.children.text')}</p>
            </div>
            
            {/* Changes to This Policy */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-primary-dark">{t('privacy.changes.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('privacy.changes.text')}</p>
            </div>
            
            {/* Contact Us */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-primary-dark">{t('privacy.contact.title')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.contact.text')}</p>
              <div className="bg-primary-ultraLight p-4 rounded-lg mt-2 border border-primary-light/20">
                <p className="text-primary-dark">Email: {t('privacy.contact.email') || 'privacidade@catalisa.io'}</p>
              </div>
            </div>
            
            {/* Your Consent */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-primary-dark">{t('privacy.consent.title')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('privacy.consent.text')}</p>
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

export default PrivacyPolicyPage;