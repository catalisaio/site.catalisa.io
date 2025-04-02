import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/home/HeroSection';
import PodcastHeroSection from './components/home/PodcastHeroSection';
import PlatformOverview from './components/home/PlatformOverview';
import PaasSection from './components/home/PaasSection';
import FeaturesSection from './components/home/FeaturesSection';
import CTASection from './components/home/CTASection';
import ContactSection from './components/home/ContactSection';
import FlowContactSection from './components/home/FlowContactSection';
import FlowContactForm from './components/home/FlowContactForm';
import FlowHero from './components/home/FlowHero';
import PaasExplanationFAQ from './components/paas-explanation/PaasExplanationFAQ';

function App() {
  // State to track if we're in mobile view
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile view on mount and when window resizes
  useEffect(() => {
    const checkForMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard MD breakpoint in Tailwind
    };
    
    // Check initially
    checkForMobile();
    
    // Set up event listener
    window.addEventListener('resize', checkForMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkForMobile);
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      
      {/* Mobile podcast section - only visible on small screens */}
      <div className={isMobile ? 'block' : 'hidden'}>
        <PodcastHeroSection isRibbonVisible={false} />
      </div>
      
      <HeroSection />

      {/* Desktop podcast section - only visible on larger screens */}
      <div className={isMobile ? 'hidden' : 'block'}>
        <PodcastHeroSection isRibbonVisible={true} />
      </div>

      <FlowHero />
      <PlatformOverview />
      <PaasSection />
      <FeaturesSection />
      <CTASection />
      <FlowContactForm />
      <PaasExplanationFAQ />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;