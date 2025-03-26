import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import analytics from '../lib/analytics';

/**
 * Componente de exemplo que demonstra como implementar o rastreamento
 * do Google Analytics em uma aplicação React com react-router-dom
 */
const AnalyticsExample: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  
  // Rastreia visualizações de página quando o caminho muda
  useEffect(() => {
    // Extrair título da página com base no caminho
    const getPageTitle = (path: string): string => {
      switch (path) {
        case '/':
          return 'Página Inicial';
        case '/paas':
          return 'Plataforma PaaS';
        case '/building-blocks':
          return 'Building Blocks';
        default:
          return 'Catalisa Platform';
      }
    };
    
    // Rastrear visualização de página quando o caminho mudar
    const pageTitle = getPageTitle(location.pathname);
    analytics.trackPageView(location.pathname, pageTitle, {
      language: language
    });
    
  }, [location.pathname, language]);
  
  // Exemplo de como rastrear a mudança de idioma
  const handleLanguageChange = (newLanguage: 'pt-BR' | 'en-US' | 'de-DE' | 'es-ES' | 'ru-RU' | 'zn-CN') => {
    analytics.trackLanguageChange(language, newLanguage);
    setLanguage(newLanguage);
  };
  
  // Exemplo de como rastrear cliques em CTAs
  const handleCTAClick = (ctaId: string, ctaText: string, destination: string) => {
    analytics.trackCTAClick(ctaId, ctaText, destination);
    // Continuar com a ação normal (navegação, etc.)
  };
  
  // Exemplo de como rastrear envio de formulário
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Lógica de envio do formulário aqui...
    const formSubmitSuccess = true; // Altere com base no resultado real
    
    // Rastrear o envio do formulário
    analytics.trackFormSubmit('contact-form', 'Formulário de Contato', formSubmitSuccess);
    
    if (formSubmitSuccess) {
      // Rastrear também como uma conversão se for um objetivo importante
      analytics.trackConversion('contact_form_submission', {
        form_name: 'Formulário de Contato',
        value: 10, // Valor atribuído a esta conversão
        currency: 'BRL'
      });
    }
  };
  
  return (
    <div className="analytics-example">
      <h2>Exemplos de Implementação do Google Analytics</h2>
      
      {/* Exemplo de link com rastreamento */}
      <div className="example-section">
        <h3>Rastreamento de Navegação</h3>
        <p>Clique nos links abaixo para ver o rastreamento de página em ação:</p>
        
        <Link 
          to="/paas" 
          onClick={() => analytics.trackEvent('navigation_click', { destination: '/paas', section: 'example' })}
        >
          Ir para Plataforma PaaS
        </Link>
      </div>
      
      {/* Exemplo de mudança de idioma com rastreamento */}
      <div className="example-section">
        <h3>Rastreamento de Mudança de Idioma</h3>
        <p>Idioma atual: {language}</p>
        
        <div className="language-buttons">
          <button onClick={() => handleLanguageChange('pt-BR')}>Português</button>
          <button onClick={() => handleLanguageChange('en-US')}>English</button>
          <button onClick={() => handleLanguageChange('es-ES')}>Español</button>
        </div>
      </div>
      
      {/* Exemplo de CTA com rastreamento */}
      <div className="example-section">
        <h3>Rastreamento de CTAs</h3>
        
        <button 
          className="cta-button"
          onClick={() => handleCTAClick('demo-cta', 'Agendar Demo', '/schedule')}
        >
          Agendar Demo
        </button>
      </div>
      
      {/* Exemplo de formulário com rastreamento */}
      <div className="example-section">
        <h3>Rastreamento de Formulários</h3>
        
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Mensagem</label>
            <textarea id="message" name="message"></textarea>
          </div>
          
          <button type="submit">Enviar</button>
        </form>
      </div>
      
      {/* Exemplo de rastreamento de reprodução de podcast */}
      <div className="example-section">
        <h3>Rastreamento de Podcast</h3>
        
        <div className="podcast-player">
          <h4>Podcast: Explicando a Catalisa Platform</h4>
          
          <div className="player-controls">
            <button onClick={() => analytics.trackPodcastAction('podcast-001', 'Explicando a Catalisa', 'play', 0)}>
              Play
            </button>
            <button onClick={() => analytics.trackPodcastAction('podcast-001', 'Explicando a Catalisa', 'pause', 30)}>
              Pause
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsExample;