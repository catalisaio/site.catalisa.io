import React from 'react';
import { Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-100 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-semibold text-primary-main">
              <span className="text-primary-main">Catalisa</span>
              <span className="text-accent-yellow">.</span>
              </span>
            </div>
            <p className="text-gray-700">
              {t('footer.desc')}
            </p>
            <p className="text-gray-700 mt-4 font-medium">
              {t('footer.desc2')}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-primary-main transition-colors">{t('footer.platform.item1')}</a></li>
              <li><a href="#" className="hover:text-primary-main transition-colors">{t('footer.platform.item2')}</a></li>
              <li><a href="#" className="hover:text-primary-main transition-colors">{t('footer.platform.item3')}</a></li>
              <li><a href="#" className="hover:text-primary-main transition-colors">{t('footer.platform.item4')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="https://developers.catalisa.com.br" target='_blank' className="hover:text-accent-blue transition-colors">{t('footer.resources.item1')}</a></li>
              <li><a href="https://legobanking.com/revolucao-bancaria" target="_blank" className="hover:text-accent-blue transition-colors">{t('footer.resources.item2')}</a></li>
              {/* <li><a href="#" className="hover:text-accent-blue transition-colors">{t('footer.resources.item3')}</a></li>
              <li><a href="#" className="hover:text-accent-blue transition-colors">{t('footer.resources.item4')}</a></li> */}
            </ul>
          </div>
          {/* <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">{t('footer.company')}</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-accent-yellow transition-colors">{t('footer.company.item1')}</a></li>
              <li><a href="#" className="hover:text-accent-yellow transition-colors">{t('footer.company.item2')}</a></li>
              <li><a href="#" className="hover:text-accent-yellow transition-colors">{t('footer.company.item3')}</a></li>
              <li><a href="#" className="hover:text-accent-yellow transition-colors">{t('footer.company.item4')}</a></li>
            </ul>
          </div> */}
        </div>
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">{t('footer.copyright')}</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary-main transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-accent-blue transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-accent-yellow transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;