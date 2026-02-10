import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedPath } from '../utils/routeUtils';

const DATA_DELETION_API_URL = import.meta.env.VITE_DATA_DELETION_API_URL || 'https://api.wpp.bb.catalisa.app';

interface FormData {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

const DataDeletionPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', reason: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch(`${DATA_DELETION_API_URL}/data-deletion/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setConfirmationCode(data.confirmation_code);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />

      {/* Hero */}
      <section
        className="py-28 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/bg-blocks-001.jpeg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-main/70 to-primary-dark/60"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
            {t('privacy.deletionForm.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
            {t('privacy.deletionForm.subtitle')}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-gradient-to-b from-white to-primary-ultraLight">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 border border-gray-100">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy.deletionForm.success.title')}</h2>
                <p className="text-gray-700 mb-6">{t('privacy.deletionForm.success.text')}</p>
                {confirmationCode && (
                  <div className="bg-primary-ultraLight rounded-xl p-6 mb-6 border border-primary-light/20">
                    <p className="text-sm text-gray-600 mb-2">{t('privacy.deletionForm.success.code')}</p>
                    <p className="text-2xl font-mono font-bold text-primary-main">{confirmationCode}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-8">{t('privacy.deletionForm.success.note')}</p>
                <a
                  href={getLocalizedPath('/privacy-policy', language)}
                  className="inline-block px-6 py-3 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t('privacy.deletionForm.backToPrivacy')}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-red-800 font-semibold mb-1">{t('privacy.deletionForm.error.title')}</h3>
                    <p className="text-red-700 text-sm">{t('privacy.deletionForm.error.text')}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('privacy.deletionForm.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('privacy.deletionForm.namePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('privacy.deletionForm.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('privacy.deletionForm.emailPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('privacy.deletionForm.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t('privacy.deletionForm.phonePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('privacy.deletionForm.reason')}
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    value={form.reason}
                    onChange={handleChange}
                    placeholder={t('privacy.deletionForm.reasonPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-colors resize-none"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  {t('privacy.deletionForm.disclaimer')}
                </p>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3 px-6 bg-primary-main text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? t('privacy.deletionForm.submitting') : t('privacy.deletionForm.submit')}
                </button>

                <div className="text-center pt-4">
                  <a
                    href={getLocalizedPath('/privacy-policy', language)}
                    className="text-primary-main hover:text-primary-dark text-sm underline transition-colors"
                  >
                    {t('privacy.deletionForm.backToPrivacy')}
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DataDeletionPage;
