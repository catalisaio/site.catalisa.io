import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBlockById, BuildingBlock, buildingBlocks } from '../data/buildingBlocks';
import { useLanguage } from '../contexts/LanguageContext';

import heroBg from '../../public/bg-blocks-002.jpeg';


const BuildingBlockDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [block, setBlock] = useState<BuildingBlock | null>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    if (id) {
      const foundBlock = getBlockById(id);
      if (foundBlock) {
        setBlock(foundBlock);
      }
    }
  }, [id]);
  
  if (!block) {
    return (
      <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold mb-6">Building Block não encontrado</h1>
          <Link to="/building-blocks" className="text-primary-main hover:underline flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 mr-2" /> {t('blockDetail.viewAll')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  // SEO-optimized title
  const pageTitle = `${block.title} | Building Block para Transformação Digital no Setor Financeiro`;
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[block.icon] || Icons.Box;
  
  // Determine colors based on category
  let bgColor = 'bg-primary-pastel';
  let iconBgColor = 'bg-primary-main';
  let textColor = 'text-primary-main';
  let buttonBgColor = 'bg-primary-main hover:bg-primary-light';
  
  if (block.category === 'Dados e Analytics') {
    bgColor = 'bg-accent-bluePastel';
    iconBgColor = 'bg-accent-blue';
    textColor = 'text-accent-blueText';
    buttonBgColor = 'bg-accent-blue hover:bg-accent-blue/90';
  } else if (block.category === 'Operações Financeiras') {
    bgColor = 'bg-accent-yellowPastel';
    iconBgColor = 'bg-accent-yellow';
    textColor = 'text-accent-yellowText';
    buttonBgColor = 'bg-accent-yellow hover:bg-accent-yellow/90';
  } else if (block.category === 'Segurança e Compliance') {
    bgColor = 'bg-accent-orangePastel';
    iconBgColor = 'bg-accent-orange';
    textColor = 'text-accent-orangeText';
    buttonBgColor = 'bg-accent-orange hover:bg-accent-orange/90';
  }
  
  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-cover bg-center bg-no-repeat" style={{ 
      backgroundImage: `url(${heroBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="container mx-auto px-4">
          <Link to="/building-blocks" className={`inline-flex items-center ${textColor} hover:underline mb-8`}>
            <ArrowLeft className="h-5 w-5 mr-2" /> {t('blockDetail.viewAll')}
          </Link>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 ">
            <div className={`${iconBgColor} p-6 rounded-full`}>
              <IconComponent className="h-12 w-12 text-white" />
            </div>
            <div className='backdrop-blur-md bg-white/20 rounded-xl border border-white/20 z-30 p-10'>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">{block.title}</h1>
              <p className="text-xl text-gray-700 mt-2">{block.short_description}</p>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${iconBgColor} text-white`}>
                  {block.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('blockDetail.description')}</h2>
                <p className="text-xl text-gray-700 mb-8">{block.long_description}</p>
                
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('blockDetail.characteristics')}</h2>
                <ul className="space-y-4 mb-8">
                  {block.characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`${bgColor} p-2 rounded-md mr-3 mt-1`}>
                        <CheckCircle className={`h-5 w-5 ${textColor}`} />
                      </div>
                      <span className="text-lg text-gray-700">{characteristic}</span>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('blockDetail.applicability')}</h2>
                <ul className="space-y-4 mb-8">
                  {block.applicability.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`${bgColor} p-2 rounded-md mr-3 mt-1`}>
                        <CheckCircle className={`h-5 w-5 ${textColor}`} />
                      </div>
                      <span className="text-lg text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">{t('blockDetail.benefits')}</h2>
                <ul className="space-y-4 mb-8">
                  {block.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`${bgColor} p-2 rounded-md mr-3 mt-1`}>
                        <CheckCircle className={`h-5 w-5 ${textColor}`} />
                      </div>
                      <span className="text-lg text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-soft sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('blockDetail.resources')}</h3>
                
                <div className="space-y-4">
                  <a 
                    // href={block.documentation} 
                    href="https://developers.catalisa.com.br/"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${buttonBgColor} text-white px-4 py-2 rounded-md font-medium transition-colors shadow-subtle hover:shadow-hover flex items-center justify-center`}
                  >
                    {t('blockDetail.documentation')} <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  
                  <a 
                    href="https://developers.catalisa.com.br/"
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors shadow-subtle hover:shadow-hover flex items-center justify-center"
                  >
                    {t('blockDetail.examples')} <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  
                  {/* <a 
                    href="#" 
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors shadow-subtle hover:shadow-hover flex items-center justify-center"
                  >
                    {t('blockDetail.tutorials')} <ExternalLink className="h-4 w-4 ml-2" />
                  </a> */}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('blockDetail.support')}</h3>
                  <p className="text-gray-700 mb-4">{t('blockDetail.supportDesc')}</p>
                  <a 
                    href="/schedule" 
                    className="text-primary-main hover:underline flex items-center"
                  >
                    {t('blockDetail.talkToExpert')} <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Building Blocks */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-900 mb-10 text-center">{t('blockDetail.relatedBlocks')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {buildingBlocks
              .filter(b => b.category === block.category && b.id !== block.id)
              .slice(0, 3)
              .map(relatedBlock => (
                <Link 
                  key={relatedBlock.id} 
                  to={`/building-blocks/${relatedBlock.id}`}
                  className="bg-white rounded-lg p-6 shadow-soft hover:shadow-hover transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className={`${iconBgColor} p-3 rounded-full`}>
                      {(Icons as any)[relatedBlock.icon] ? 
                        React.createElement((Icons as any)[relatedBlock.icon], { className: "h-5 w-5 text-white" }) : 
                        <Icons.Box className="h-5 w-5 text-white" />
                      }
                    </div>
                    <h3 className="text-xl font-semibold ml-3 text-gray-900">{relatedBlock.title}</h3>
                  </div>
                  <p className="text-gray-700">{relatedBlock.short_description}</p>
                </Link>
              ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/building-blocks" 
              className="inline-flex items-center text-primary-main hover:underline font-medium"
            >
              {t('blockDetail.viewAll')} <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuildingBlockDetail;