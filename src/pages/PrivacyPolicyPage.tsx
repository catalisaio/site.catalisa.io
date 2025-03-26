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
      
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              {t('privacy.title')}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {t('privacy.subtitle')}
            </p>
            <p className="mt-4 text-gray-500">
              {t('privacy.lastUpdated')}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.intro.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{t('privacy.intro.text')}</p>
          </div>
          
          {/* Information Collection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.collection.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{t('privacy.collection.subtitle')}</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-medium mb-3 text-gray-800">{t('privacy.collection.personalInfo.title')}</h3>
              <p className="text-gray-700">{t('privacy.collection.personalInfo.text')}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-medium mb-3 text-gray-800">{t('privacy.collection.usage.title')}</h3>
              <p className="text-gray-700">{t('privacy.collection.usage.text')}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3 text-gray-800">{t('privacy.collection.cookies.title')}</h3>
              <p className="text-gray-700">{t('privacy.collection.cookies.text')}</p>
            </div>
          </div>
          
          {/* How We Use Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.use.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{t('privacy.use.text')}</p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.sharing.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{t('privacy.sharing.text')}</p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t('privacy.sharing.list.1')}</li>
              <li>{t('privacy.sharing.list.2')}</li>
              <li>{t('privacy.sharing.list.3')}</li>
              <li>{t('privacy.sharing.list.4')}</li>
            </ul>
          </div>
          
          {/* Data Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.security.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('privacy.security.text')}</p>
          </div>
          
          {/* Your Privacy Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.rights.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{t('privacy.rights.text')}</p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t('privacy.rights.list.1')}</li>
              <li>{t('privacy.rights.list.2')}</li>
              <li>{t('privacy.rights.list.3')}</li>
              <li>{t('privacy.rights.list.4')}</li>
              <li>{t('privacy.rights.list.5')}</li>
              <li>{t('privacy.rights.list.6')}</li>
            </ul>
          </div>
          
          {/* Children's Privacy */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.children.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('privacy.children.text')}</p>
          </div>
          
          {/* Changes to This Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.changes.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('privacy.changes.text')}</p>
          </div>
          
          {/* Contact Us */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.contact.title')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{t('privacy.contact.text')}</p>
          </div>
          
          {/* Your Consent */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('privacy.consent.title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('privacy.consent.text')}</p>
          </div>
        </div>
      </section>
      <ContactSection />


      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;