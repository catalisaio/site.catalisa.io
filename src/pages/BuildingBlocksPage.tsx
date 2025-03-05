import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BuildingBlockCard from '../components/BuildingBlockCard';
import { buildingBlocks, getBlocksByCategory } from '../data/buildingBlocks';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const BuildingBlocksPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = getBlocksByCategory();
  const categoryNames = Object.keys(categories);
  
  const filteredBlocks = activeCategory 
    ? categories[activeCategory].filter(block => 
        block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.short_description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : buildingBlocks.filter(block => 
        block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.short_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: "url('/dist/assets/bg-blocks-005.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center backdrop-blur-md bg-white/20 rounded-xl border border-white/20 p-8 z-30">
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight text-gray-900">
              {t('blocks.title')} <span className="text-primary-main">Catalisa</span>
              <span className="text-accent-yellow">.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-700">
              {t('blocks.subtitle')}
            </p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('blocks.search')}
                  className="w-full px-4 py-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main shadow-subtle"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={t('blocks.search')}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-main">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null 
                  ? 'bg-primary-main text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              {t('blocks.filter.all')}
            </button>
            
            {categoryNames.map(category => (
              <button 
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? category === 'Dados e Analytics' 
                      ? 'bg-accent-blue text-white'
                      : category === 'Operações Financeiras'
                        ? 'bg-accent-yellow text-white'
                        : 'bg-accent-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Building Blocks Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {filteredBlocks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlocks.map(block => (
                <BuildingBlockCard key={block.id} block={block} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Nenhum resultado encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar sua busca ou explorar outras categorias.</p>
              <button 
                className="text-primary-main font-medium hover:underline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory(null);
                }}
              >
                {t('blockDetail.viewAll')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-main py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-white">{t('blocks.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-white opacity-90">
            {t('blocks.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/schedule" className="bg-white text-primary-main hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-colors shadow-soft hover:shadow-hover flex items-center justify-center">
              {t('blockDetail.talkToExpert')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuildingBlocksPage;