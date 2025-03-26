import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PodcastHeroSection from '../components/home/PodcastHeroSection';
import { Search, Tag, Clock, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactSection from '../components/home/ContactSection';

// Define podcast metadata type
interface PodcastMetadata {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  tags: string[];
  audioSrc: string;
  subtitleSrcs: {
    'en-US': string;
    'pt-BR': string;
    'es-ES': string;
  };
}

// Initial podcast data (for now, just our existing podcast)
const initialPodcasts: PodcastMetadata[] = [
  {
    id: 'catalisa-overview',
    title: 'Catalisa Platform Overview',
    description: 'An overview of the Catalisa Platform and how it can revolutionize your financial services.',
    duration: '20:45',
    date: '2025-03-15',
    tags: ['platform', 'financial', 'overview', 'introduction'],
    audioSrc: '/podcasts/CatalisaExplanationPodcastFinal.mp3',
    subtitleSrcs: {
      'en-US': '/podcasts/CatalisaOverview-en-US.srt',
      'pt-BR': '/podcasts/CatalisaOverview-pt-BR.srt',
      'es-ES': '/podcasts/CatalisaOverview-es-ES.srt'
    }
  }
];

const PodcastsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [podcasts, setPodcasts] = useState<PodcastMetadata[]>(initialPodcasts);
  const [filteredPodcasts, setFilteredPodcasts] = useState<PodcastMetadata[]>(initialPodcasts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastMetadata>(initialPodcasts[0]);
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  
  // Extract all unique tags from podcasts
  const allTags = [...new Set(podcasts.flatMap(podcast => podcast.tags))];
  
  // Filter podcasts when search term or selected tags change
  useEffect(() => {
    let results = podcasts;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(podcast => 
        podcast.title.toLowerCase().includes(term) || 
        podcast.description.toLowerCase().includes(term) ||
        podcast.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      results = results.filter(podcast => 
        selectedTags.every(tag => podcast.tags.includes(tag))
      );
    }
    
    setFilteredPodcasts(results);
  }, [searchTerm, selectedTags, podcasts]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
        {/* Featured Podcast Hero - Styled like PaasHero */}
        <section 
          className="py-10 sm:py-16 md:py-20 bg-gradient-to-b from-accent-bluePastel to-white bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('/bg-paas-005.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
              {/* Hero title area - styled like PaasHero */}
              <div className="w-full max-w-4xl text-center backdrop-blur-md bg-white/20 rounded-xl border border-white/20 p-4 sm:p-6 md:p-8 mb-8">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold mb-3 sm:mb-6 leading-tight text-gray-900">
                  Catalisa <span className="text-primary-main">Podcasts</span>
                  <span className="text-accent-yellow">.</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-6 text-gray-700">
                  {t('podcasts.subtitle')}
                </p>
              </div>
              
              {/* Podcast player area */}
              <div ref={featuredSectionRef} className="w-full max-w-5xl backdrop-blur-md bg-white/70 rounded-xl border border-white/30 p-4 sm:p-6 overflow-hidden">
                <PodcastHeroSection 
                  isRibbonVisible={false}
                  audioSrc={selectedPodcast.audioSrc}
                  subtitleSrcs={selectedPodcast.subtitleSrcs}
                  title={selectedPodcast.title}
                  description={selectedPodcast.description}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Podcast List */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row mb-8 items-start">
              {/* Search bar */}
              <div className="md:w-1/2 mb-6 md:mb-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('podcasts.search')}
                    className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-main"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
              
              {/* Tags filter */}
              <div className="md:w-1/2 md:pl-6">
                <p className="font-medium mb-2 text-gray-700">{t('podcasts.filter')}</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-main text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Podcast list */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">{t('podcasts.allEpisodes')}</h2>
              
              {filteredPodcasts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500">{t('podcasts.noResults')}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPodcasts.map(podcast => (
                    <div key={podcast.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{podcast.title}</h3>
                        <p className="text-gray-600 mb-4">{podcast.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mb-4">
                          {podcast.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-pastel text-primary-dark">
                              <Tag size={12} className="mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {podcast.duration}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(podcast.date).toLocaleDateString(language, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <button
                          className="mt-4 w-full bg-primary-main hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors flex items-center justify-center"
                          onClick={() => {
                            // Set the selected podcast and scroll to the featured section
                            setSelectedPodcast(podcast);
                            
                            // Scroll to the featured section
                            if (featuredSectionRef.current) {
                              featuredSectionRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                              });
                            }
                          }}
                        >
                          {t('podcasts.listen')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        <ContactSection />
      <Footer />
    </div>
  );
};

export default PodcastsPage;