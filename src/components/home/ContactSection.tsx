import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { submitContactForm } from '../../lib/supabase';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing again
    if (submitError) {
      setSubmitError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const result = await submitContactForm({
        name: formState.name,
        email: formState.email,
        company: formState.company,
        message: formState.message
      });
      
      if (result.success) {
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormState({
            name: '',
            email: '',
            company: '',
            message: ''
          });
        }, 3000);
      } else {
        setSubmitError('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="contato" className="py-10 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 sm:mb-6 text-gray-900">{t('contact.title')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-success-pastel rounded-xl p-4 sm:p-6 md:p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-success-DEFAULT rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-success-text mb-2">Mensagem enviada!</h3>
                <p className="text-gray-700">Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-3 bg-error-pastel text-error-text rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${focused === 'name' ? 'border-primary-main ring-2 ring-primary-pastel' : 'border-gray-200'} rounded-lg focus:outline-none transition-all duration-200`}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      disabled={isSubmitting}
                    />
                    <label 
                      htmlFor="name" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focused === 'name' || formState.name 
                          ? 'text-xs text-primary-main -top-2.5 bg-white px-1' 
                          : 'text-gray-500 top-3.5'
                      }`}
                    >
                      {t('contact.form.name')}
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3.5 bg-gray-50 border ${focused === 'email' ? 'border-primary-main ring-2 ring-primary-pastel' : 'border-gray-200'} rounded-lg focus:outline-none transition-all duration-200`}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      disabled={isSubmitting}
                    />
                    <label 
                      htmlFor="email" 
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        focused === 'email' || formState.email 
                          ? 'text-xs text-primary-main -top-2.5 bg-white px-1' 
                          : 'text-gray-500 top-3.5'
                      }`}
                    >
                      {t('contact.form.email')}
                    </label>
                  </div>
                </div>
                
                <div className="relative">
                  <input 
                    type="text" 
                    id="company" 
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 bg-gray-50 border ${focused === 'company' ? 'border-primary-main ring-2 ring-primary-pastel' : 'border-gray-200'} rounded-lg focus:outline-none transition-all duration-200`}
                    onFocus={() => setFocused('company')}
                    onBlur={() => setFocused(null)}
                    disabled={isSubmitting}
                  />
                  <label 
                    htmlFor="company" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focused === 'company' || formState.company 
                        ? 'text-xs text-primary-main -top-2.5 bg-white px-1' 
                        : 'text-gray-500 top-3.5'
                    }`}
                  >
                    {t('contact.form.company')}
                  </label>
                </div>
                
                <div className="relative">
                  <textarea 
                    id="message" 
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4} 
                    required
                    className={`w-full px-4 py-3.5 bg-gray-50 border ${focused === 'message' ? 'border-primary-main ring-2 ring-primary-pastel' : 'border-gray-200'} rounded-lg focus:outline-none transition-all duration-200`}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    disabled={isSubmitting}
                  ></textarea>
                  <label 
                    htmlFor="message" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focused === 'message' || formState.message 
                        ? 'text-xs text-primary-main -top-2.5 bg-white px-1' 
                        : 'text-gray-500 top-3.5'
                    }`}
                  >
                    {t('contact.form.message')}
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className={`group ${
                    isSubmitting ? 'bg-gray-400 hover:bg-gray-400 cursor-wait' : 'bg-primary-main hover:bg-primary-light'
                  } text-white px-6 py-3.5 rounded-lg font-medium transition-all duration-300 shadow-soft hover:shadow-hover w-full flex items-center justify-center`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-xl h-full">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 md:mb-8 text-gray-900 border-b border-gray-200 pb-3 sm:pb-4">{t('contact.info.title')}</h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-primary-pastel p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.info.email')}</h4>
                    <a href="mailto:hello@catalisa.io" className="text-primary-main hover:underline transition-colors">
                      hello@catalisa.io
                    </a>
                  </div>
                </div>
                
                {/* <div className="flex items-start">
                  <div className="bg-primary-pastel p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.info.phone')}</h4>
                    <a href="tel:+551130013001" className="text-gray-700 hover:text-primary-main transition-colors">
                      +55 (11) 3001-3001
                    </a>
                  </div>
                </div> */}
                
                {/* <div className="flex items-start">
                  <div className="bg-primary-pastel p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary-main" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.info.address')}</h4>
                    <address className="text-gray-700 not-italic">
                      Av. Paulista, 1000<br />
                      Bela Vista, São Paulo - SP<br />
                      CEP: 01310-100
                    </address>
                  </div>
                </div> */}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-4 justify-center">
                  {/* <a href="#" className="bg-white p-3 rounded-full text-gray-500 hover:text-primary-main hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white p-3 rounded-full text-gray-500 hover:text-accent-blue hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a> */}
                  <a href="https://www.linkedin.com/company/catalisa-platform" target="_blank" className="bg-white p-3 rounded-full text-gray-500 hover:text-accent-yellow hover:shadow-md transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;