import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/home/HeroSection';
import PlatformOverview from './components/home/PlatformOverview';
import PaasSection from './components/home/PaasSection';
import StudioSection from './components/home/StudioSection';
import StudioOrchestrationSection from './components/home/StudioOrchestrationSection';
import FeaturesSection from './components/home/FeaturesSection';
import CTASection from './components/home/CTASection';
import ContactSection from './components/home/ContactSection';
import FlowContactSection from './components/home/FlowContactSection';
import FlowContactForm from './components/home/FlowContactForm';
import FlowHero from './components/home/FlowHero';
import PaasExplanationFAQ from './components/paas-explanation/PaasExplanationFAQ';

function App() {
  return (
    <div className="min-h-screen bg-primary-ultraLight text-gray-800 font-sans">
      <Header />
      <FlowHero />
      <HeroSection />
      <PlatformOverview />
      <PaasSection />
      <StudioSection />
      <StudioOrchestrationSection />
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