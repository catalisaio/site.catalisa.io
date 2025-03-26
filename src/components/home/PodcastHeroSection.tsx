import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Play, Pause, Volume2, VolumeX, Globe, Maximize, Minimize, X } from 'lucide-react';

interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

type SubtitleLanguage = 'en-US' | 'pt-BR' | 'es-ES';

const PodcastHeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    { code: 'es-ES', name: t('podcast.subtitle.spanish') }
  ];
  
  // Update subtitle language when site language changes
  useEffect(() => {
    if (language === 'pt-BR' || language === 'en-US' || language === 'es-ES') {
      setSubtitleLanguage(language as SubtitleLanguage);
    }
  }, [language]);
  
  // Load subtitles when subtitle language changes
  useEffect(() => {
    fetch(`/podcasts/CatalisaOverview-${subtitleLanguage}.srt`)
      .then(response => response.text())
      .then(srtContent => {
        const parsedSubtitles = parseSRT(srtContent);
        setSubtitles(parsedSubtitles);
      })
      .catch(error => {
        console.error(`Failed to load subtitles for ${subtitleLanguage}:`, error);
        // Fallback to English if the selected language fails
        if (subtitleLanguage !== 'en-US') {
          setSubtitleLanguage('en-US');
        }
      });
  }, [subtitleLanguage]);
  
  // Update current subtitle based on playback time
  useEffect(() => {
    if (subtitles.length > 0) {
      const currentSub = subtitles.find(
        sub => currentTime >= sub.start && currentTime <= sub.end
      );
      setCurrentSubtitle(currentSub ? currentSub.text : '');
    }
  }, [currentTime, subtitles]);
  
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
  
  // Parse SRT format to structured subtitle objects
  const parseSRT = (srtContent: string): Subtitle[] => {
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
  };
  
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
  
  return (
    <>
      {/* Regular Podcast Player */}
      <section className="py-8 sm:py-12 bg-primary-light bg-opacity-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-gray-900">
                {t('podcast.title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-5">
                {t('podcast.description')}
              </p>
            </div>
            
            <div className="md:w-1/2 w-full">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
                <audio 
                  ref={audioRef} 
                  src="/podcasts/CatalisaExplanationPodcastFinal.mp3"
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
                  {currentSubtitle || t('podcast.subtitle.loading')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cinema Mode Overlay */}
      {isCinemaMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-4xl p-8 rounded-xl backdrop-blur-lg bg-primary-light bg-opacity-10 border border-white/20">
            <div className="flex justify-end mb-2">
              <button 
                onClick={toggleCinemaMode}
                className="text-white rounded-full p-2 hover:bg-white/10 transition-colors"
                aria-label={t('podcast.exitCinemaMode')}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-3xl font-semibold mb-2 text-white text-center">
                {t('podcast.overview')}
              </h2>
            </div>
            
            <div className="min-h-[120px] bg-gray-900/40 p-6 rounded-lg mb-8 flex items-center justify-center">
              <p className="text-xl sm:text-2xl text-white text-center font-medium">
                {currentSubtitle || t('podcast.subtitle.loading')}
              </p>
            </div>
            
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-main"
              />
              <div className="flex justify-between text-sm text-white mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-8">
              <button 
                onClick={togglePlayPause}
                className="bg-white text-primary-main rounded-full p-4 hover:bg-gray-100 transition-colors"
                aria-label={isPlaying ? t('podcast.pause') : t('podcast.play')}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <button 
                onClick={toggleMute}
                className="text-white rounded-full p-3 hover:bg-white/10 transition-colors"
                aria-label={isMuted ? t('podcast.unmute') : t('podcast.mute')}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsSubtitleMenuOpen(!isSubtitleMenuOpen)}
                  className="flex items-center text-white space-x-2 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <Globe size={20} />
                  <span>{subtitleLanguages.find(lang => lang.code === subtitleLanguage)?.name}</span>
                </button>
                
                {isSubtitleMenuOpen && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
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
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastHeroSection;