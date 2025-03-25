import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper function to convert markdown-style bold (**text**) to JSX
const formatText = (text: string) => {
  if (!text) return null;
  
  // Split by ** markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    // Check if this part is bold (surrounded by **)
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the ** markers and wrap content in <strong>
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    // Regular text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const PaasExplanationFAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [displayedItems, setDisplayedItems] = useState<FAQItem[]>([]);

  // Get the first 5 FAQ items to display in the PaaS explanation page
  const faqItems: FAQItem[] = Array.from({ length: 5 }, (_, i) => ({
    question: t(`paasExplanation.faq.q${i + 1}`) || '',
    answer: t(`paasExplanation.faq.a${i + 1}`) || '',
    category: 'platform'
  }));

  // Filter FAQ items based on search term and category
  useEffect(() => {
    let filteredItems = [...faqItems];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.question.toLowerCase().includes(searchLower) || 
        item.answer.toLowerCase().includes(searchLower)
      );
    }
    
    if (activeCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === activeCategory);
    }
    
    setDisplayedItems(filteredItems);
  }, [searchTerm, activeCategory, faqItems]);

  const toggleQuestion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            {t('paasExplanation.faq.title') || 'Perguntas Frequentes'}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('paasExplanation.faq.subtitle') || 'Respostas para as dúvidas mais comuns sobre a Plataforma Componível e a Catalisa Platform.'}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
              placeholder={t('faq.search') || 'Buscar em perguntas frequentes...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={resetSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {displayedItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('faq.noResults') || 'Nenhum resultado encontrado para sua busca.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedItems.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 rounded-lg shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-200 transition-colors"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{item.question}</h3>
                    <span className="text-primary-main ml-2 flex-shrink-0">
                      {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-6 pt-2 text-gray-700">
                      <div className="prose prose-sm max-w-none">
                        {item.answer.split('\n\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-4">
                            {paragraph.startsWith('*   ') ? (
                              // Handle bullet points
                              <ul className="list-disc pl-6 space-y-2 mt-2">
                                {paragraph.split('\n*   ').map((bullet, bIndex) => (
                                  <li key={bIndex} className={bIndex === 0 ? 'first-item' : ''}>
                                    {bIndex === 0 ? formatText(bullet.replace('*   ', '')) : formatText(bullet)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              // Regular paragraph
                              formatText(paragraph)
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* View All FAQ button */}
          <div className="text-center mt-10">
            <Link 
              to="/faq" 
              className="inline-flex items-center px-5 py-3 bg-primary-main text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {t('faq.viewMore') || 'Ver todas as perguntas frequentes'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaasExplanationFAQ;