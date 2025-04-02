import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Play, Pause, Volume2, VolumeX, Globe, Maximize, Minimize, X, Headphones } from 'lucide-react';

// Import audio and subtitle files
import podcastAudio from '../../../public/podcasts/CatalisaExplanationPodcastFinal.mp3';
import subtitleEnUS from '../../../public/podcasts/CatalisaOverview-en-US.srt';
import subtitlePtBR from '../../../public/podcasts/CatalisaOverview-pt-BR.srt';
import subtitleEsES from '../../../public/podcasts/CatalisaOverview-es-ES.srt';
import subtitleDeDe from '../../../public/podcasts/CatalisaOverview-de-DE.srt';

interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

type SubtitleLanguage = 'en-US' | 'pt-BR' | 'es-ES' | 'de-DE';

interface PodcastHeroSectionProps {
  isRibbonVisible?: boolean;
  audioSrc?: string;
  subtitleSrcs?: {
    'en-US'?: string;
    'pt-BR'?: string;
    'es-ES'?: string;
    'de-DE'?: string;
  };
  title?: string;
  description?: string;
}

const PodcastHeroSection: React.FC<PodcastHeroSectionProps> = ({ 
  isRibbonVisible = true,
  audioSrc = podcastAudio,
  subtitleSrcs = {
    'en-US': subtitleEnUS,
    'pt-BR': subtitlePtBR,
    'es-ES': subtitleEsES,
    'de-DE': subtitleDeDe
  },
  title,
  description
}) => {
  const { t, language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  // Use the current site language as default for subtitles, fallback to English if not available
  const getDefaultSubtitleLanguage = (): SubtitleLanguage => {
    // Check if current language is one of our supported subtitle languages
    if (language === 'pt-BR' || language === 'en-US' || language === 'es-ES') {
      return language as SubtitleLanguage;
    }
    return 'en-US'; // Default fallback
  };
  
  const [subtitleLanguage, setSubtitleLanguage] = useState<SubtitleLanguage>(getDefaultSubtitleLanguage());
  const [isSubtitleMenuOpen, setIsSubtitleMenuOpen] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  
  // Subtitle language options
  const subtitleLanguages: { code: SubtitleLanguage; name: string }[] = [
    { code: 'en-US', name: t('podcast.subtitle.english') },
    { code: 'pt-BR', name: t('podcast.subtitle.portuguese') },
    { code: 'es-ES', name: t('podcast.subtitle.spanish') },
    { code: 'de-DE', name: "German" }
  ];
  
  // Update subtitle language when site language changes
  useEffect(() => {
    if (language === 'pt-BR' || language === 'en-US' || language === 'es-ES') {
      setSubtitleLanguage(language as SubtitleLanguage);
    }
  }, [language]);
  
  // Parse SRT format to structured subtitle objects
  const parseSRT = useCallback((srtContent: string): Subtitle[] => {
    const srtLines = srtContent.trim().split('\n\n');
    return srtLines.map(block => {
      const lines = block.split('\n');
      const id = parseInt(lines[0]);
      const timeMatch = lines[1].match(/(\d+):(\d+):(\d+),(\d+) --> (\d+):(\d+):(\d+),(\d+)/);
      
      if (!timeMatch) return { id, start: 0, end: 0, text: '' };
      
      const startHours = parseInt(timeMatch[1]);
      const startMinutes = parseInt(timeMatch[2]);
      const startSeconds = parseInt(timeMatch[3]);
      const startMilliseconds = parseInt(timeMatch[4]);
      
      const endHours = parseInt(timeMatch[5]);
      const endMinutes = parseInt(timeMatch[6]);
      const endSeconds = parseInt(timeMatch[7]);
      const endMilliseconds = parseInt(timeMatch[8]);
      
      const start = 
        startHours * 3600 + 
        startMinutes * 60 + 
        startSeconds + 
        startMilliseconds / 1000;
        
      const end = 
        endHours * 3600 + 
        endMinutes * 60 + 
        endSeconds + 
        endMilliseconds / 1000;
      
      const text = lines.slice(2).join(' ');
      
      return { id, start, end, text };
    });
  }, []);

  // Track loaded language to prevent infinite loops
  const loadedLanguageRef = useRef<string | null>(null);

  // Load subtitles when subtitle language changes
  useEffect(() => {
    // Skip if we're already loading this language or if it's a fallback attempt
    if (loadedLanguageRef.current === subtitleLanguage) return;
    
    // Only attempt to load if we have a subtitle source for this language
    if (subtitleSrcs[subtitleLanguage]) {
      loadedLanguageRef.current = subtitleLanguage;
      
      fetch(subtitleSrcs[subtitleLanguage]!)
        .then(response => response.text())
        .then(srtContent => {
          const parsedSubtitles = parseSRT(srtContent);
          setSubtitles(parsedSubtitles);
        })
        .catch(error => {
          console.error(`Failed to load subtitles for ${subtitleLanguage}:`, error);
          
          // Fallback to English if the selected language fails, but avoid loop
          if (subtitleLanguage !== 'en-US' && subtitleSrcs['en-US'] && loadedLanguageRef.current !== 'en-US') {
            loadedLanguageRef.current = 'en-US'; // Mark that we're attempting English
            setSubtitleLanguage('en-US');
          } else {
            // Reset tracking ref if we can't even load English
            loadedLanguageRef.current = null;
            setSubtitles([]);
            setCurrentSubtitle('');
          }
        });
    } else {
      // If no subtitle available for this language, clear subtitles
      setSubtitles([]);
      setCurrentSubtitle('');
    }
  }, [subtitleLanguage, subtitleSrcs, parseSRT]);
  
  // Update current subtitle based on playback time, memoize the subtitle finding logic
  useEffect(() => {
    if (subtitles.length > 0) {
      const currentSub = subtitles.find(
        sub => currentTime >= sub.start && currentTime <= sub.end
      );
      
      // Only update if subtitle actually changed to prevent unnecessary renders
      if ((currentSub && currentSub.text !== currentSubtitle) || 
          (!currentSub && currentSubtitle !== '')) {
        setCurrentSubtitle(currentSub ? currentSub.text : '');
      }
    }
  }, [currentTime, subtitles, currentSubtitle]);
  
  // Update time and handle playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      if (!isCinemaMode && isPlaying === false) {
        // Only enter cinema mode when starting playback from stopped state
        setIsCinemaMode(true);
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleCinemaMode = () => {
    setIsCinemaMode(!isCinemaMode);
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Format time for display (MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle escape key to exit cinema mode
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCinemaMode) {
        setIsCinemaMode(false);
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isCinemaMode]);
  
  // Smooth scroll to podcast section
  const scrollToPodcast = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  return (
    <>
      {/* Ribbon CTA - Only shown when isRibbonVisible is true */}
      {isRibbonVisible && (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={scrollToPodcast}
            className="flex items-center space-x-2 bg-primary-main text-white py-2 px-4 rounded-full shadow-md hover:bg-primary-dark transition-colors duration-300 group"
          >
            <Headphones size={18} className="text-white" />
            <span className="text-sm font-medium">{t('podcast.ribbon.cta')}</span>
          </button>
        </div>
      )}
      
      {/* Regular Podcast Player */}
      <section 
        id="podcast-section"
        ref={sectionRef} 
        className="py-8 sm:py-12 bg-primary-light bg-opacity-10 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-gray-900">
                {title || t('podcast.title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-5">
                {description || t('podcast.description')}
              </p>
            </div>
            
            <div className="md:w-1/2 w-full">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
                <audio 
                  ref={audioRef} 
                  src={audioSrc}
                  preload="metadata"
                  className="hidden"
                />
                
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={togglePlayPause}
                    className="bg-primary-main text-white rounded-full p-3 hover:bg-primary-dark transition-colors"
                    aria-label={isPlaying ? t('podcast.pause') : t('podcast.play')}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  
                  <div className="flex-1 mx-3">
                    <p className="font-medium text-sm sm:text-base text-gray-800 mb-1">
                      {t('podcast.overview')}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={toggleMute}
                      className="text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors"
                      aria-label={isMuted ? t('podcast.unmute') : t('podcast.mute')}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    
                    <button 
                      onClick={toggleCinemaMode}
                      className="text-gray-700 rounded-full p-2 hover:bg-gray-100 transition-colors"
                      aria-label={t('podcast.cinemaMode')}
                    >
                      <Maximize size={18} />
                    </button>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-main"
                />
                
                <div className="flex items-center justify-between mt-4 mb-2">
                  <div className="flex items-center">
                    <Globe size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{t('podcast.subtitle.label')}:</span>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setIsSubtitleMenuOpen(!isSubtitleMenuOpen)}
                      className="flex items-center text-sm bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-1"
                    >
                      {subtitleLanguages.find(lang => lang.code === subtitleLanguage)?.name}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {isSubtitleMenuOpen && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <ul className="py-1">
                          {subtitleLanguages.map((lang) => (
                            <li key={lang.code}>
                              <button
                                onClick={() => {
                                  setSubtitleLanguage(lang.code);
                                  setIsSubtitleMenuOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  subtitleLanguage === lang.code 
                                    ? 'bg-primary-pastel text-primary-main' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {lang.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="min-h-[60px] bg-gray-50 p-3 rounded border border-gray-200 text-sm sm:text-base">
                  {currentSubtitle || ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cinema Mode Overlay - Optimized for mobile and desktop */}
      {isCinemaMode && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 overflow-y-auto">
          <div className="w-full max-w-4xl p-4 sm:p-8 rounded-xl backdrop-blur-lg bg-primary-light bg-opacity-10 border border-white/20 m-2 sm:m-0">
            {/* Close button */}
            <div className="flex justify-end">
              <button 
                onClick={toggleCinemaMode}
                className="text-white rounded-full p-3 hover:bg-white/10 transition-colors"
                aria-label={t('podcast.exitCinemaMode')}
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Title - Smaller on mobile */}
            <div className="mb-4 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-white text-center">
                {t('podcast.overview')}
              </h2>
            </div>
            
            {/* Subtitles - Larger and more optimized for mobile reading */}
            <div className="min-h-[120px] bg-gray-900/50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-8 flex items-center justify-center">
              <p className="text-lg sm:text-2xl text-white text-center font-medium px-2 leading-relaxed">
                {currentSubtitle || t('podcast.subtitle.loading')}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="mb-4 sm:mb-6">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-3 sm:h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-main"
              />
              <div className="flex justify-between text-sm text-white mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Controls - Mobile optimized */}
            <div className="flex flex-col sm:flex-row items-center">
              {/* Main playback controls - Centered for mobile */}
              <div className="flex items-center justify-center w-full sm:w-auto sm:justify-start space-x-4 sm:space-x-8 mb-4 sm:mb-0">
                <button 
                  onClick={togglePlayPause}
                  className="bg-white text-primary-main rounded-full p-5 sm:p-4 hover:bg-gray-100 transition-colors"
                  aria-label={isPlaying ? t('podcast.pause') : t('podcast.play')}
                >
                  {isPlaying ? <Pause size={32} className="sm:w-6 sm:h-6" /> : <Play size={32} className="sm:w-6 sm:h-6" />}
                </button>
                
                <button 
                  onClick={toggleMute}
                  className="text-white rounded-full p-4 sm:p-3 hover:bg-white/10 transition-colors"
                  aria-label={isMuted ? t('podcast.unmute') : t('podcast.mute')}
                >
                  {isMuted ? <VolumeX size={28} className="sm:w-6 sm:h-6" /> : <Volume2 size={28} className="sm:w-6 sm:h-6" />}
                </button>
              </div>
              
              {/* Language selector - Bottom for mobile, right side for desktop */}
              <div className="relative self-center sm:self-auto sm:ml-auto">
                <button 
                  onClick={() => setIsSubtitleMenuOpen(!isSubtitleMenuOpen)}
                  className="flex items-center text-white space-x-2 px-5 py-3 sm:px-4 sm:py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Globe size={24} className="sm:w-5 sm:h-5" />
                  <span className="text-base sm:text-sm">{subtitleLanguages.find(lang => lang.code === subtitleLanguage)?.name}</span>
                </button>
                
                {isSubtitleMenuOpen && (
                  <div className="absolute bottom-16 sm:bottom-12 left-1/2 transform -translate-x-1/2 w-56 sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <ul className="py-1">
                      {subtitleLanguages.map((lang) => (
                        <li key={lang.code}>
                          <button
                            onClick={() => {
                              setSubtitleLanguage(lang.code);
                              setIsSubtitleMenuOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-3 sm:py-2 text-base sm:text-sm ${
                              subtitleLanguage === lang.code 
                                ? 'bg-primary-pastel text-primary-main' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {lang.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PodcastHeroSection;