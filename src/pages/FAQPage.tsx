import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, ChevronUp, Search, X, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  category: string;
}

const FAQPage: React.FC = () => {
  const { t } = useLanguage();
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [displayedItems, setDisplayedItems] = useState<FAQItem[]>([]);

  // Generate all FAQ items from locale keys
  const generateFaqItems = (): FAQItem[] => {
    const items: FAQItem[] = [];
    // We have 30 FAQ items in total as per the locales
    for (let i = 1; i <= 30; i++) {
      const questionKey = `paasExplanation.faq.q${i}`;
      const answerKey = `paasExplanation.faq.a${i}`;
      
      // Assign categories based on content (this is a simple approach - in a real app you might want to define these explicitly)
      let category = 'platform';
      if (i >= 7 && i <= 10) category = 'platform';
      else if (i >= 11 && i <= 13) category = 'pricing';
      else if (i >= 14 && i <= 22) category = 'technical';
      else if (i >= 23 && i <= 30) category = 'integration';
      
      items.push({
        question: t(questionKey) || '',
        answer: t(answerKey) || '',
        category
      });
    }
    return items;
  };

  const allFaqItems = generateFaqItems();

  // Filter FAQ items based on search term and category
  useEffect(() => {
    let filteredItems = [...allFaqItems];
    
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
  }, [searchTerm, activeCategory]);

  const toggleQuestion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter(i => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const expandAll = () => {
    setOpenIndexes(displayedItems.map((_, index) => index));
  };

  const collapseAll = () => {
    setOpenIndexes([]);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-gray-900">
              {t('paasExplanation.faq.title') || 'Perguntas Frequentes'}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {t('paasExplanation.faq.subtitle') || 'Respostas para as dúvidas mais comuns sobre a Plataforma Componível e a Catalisa Platform.'}
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
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
            
            {/* Categories and Expand/Collapse Controls */}
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                <button 
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === 'all' 
                      ? 'bg-primary-main text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t('faq.categories.all') || 'Todas'}
                </button>
                <button 
                  onClick={() => setActiveCategory('platform')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === 'platform' 
                      ? 'bg-primary-main text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t('faq.categories.platform') || 'Plataforma'}
                </button>
                <button 
                  onClick={() => setActiveCategory('pricing')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === 'pricing' 
                      ? 'bg-primary-main text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t('faq.categories.pricing') || 'Preços'}
                </button>
                <button 
                  onClick={() => setActiveCategory('technical')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === 'technical' 
                      ? 'bg-primary-main text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t('faq.categories.technical') || 'Técnico'}
                </button>
                <button 
                  onClick={() => setActiveCategory('integration')}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === 'integration' 
                      ? 'bg-primary-main text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t('faq.categories.integration') || 'Integração'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={expandAll}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center text-sm font-medium"
                >
                  <ChevronDown size={16} className="mr-1" />
                  {t('faq.expandAll') || 'Expandir todas'}
                </button>
                <button 
                  onClick={collapseAll}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center text-sm font-medium"
                >
                  <ChevronUp size={16} className="mr-1" />
                  {t('faq.collapseAll') || 'Recolher todas'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
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
                        {openIndexes.includes(index) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </button>
                    
                    {openIndexes.includes(index) && (
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
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">
            {t('faq.cta.title') || 'Ainda tem dúvidas?'}
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-white opacity-90">
            {t('faq.cta.subtitle') || 'Entre em contato com nossa equipe para obter respostas personalizadas para suas perguntas.'}
          </p>
          <button className="bg-white text-primary-main hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover">
            {t('faq.cta.button') || 'Fale Conosco'}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;