/**
 * Utilitário para rastreamento de eventos do Google Analytics 4 (GA4)
 * Este arquivo contém funções para facilitar o rastreamento de eventos personalizados
 * e garantir uma implementação consistente em toda a aplicação.
 */

// Tipos para eventos personalizados
export interface EventParams {
  [key: string]: string | number | boolean | null;
}

/**
 * Verifica se o Google Analytics está carregado
 */
const isGtagLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Inicializa o Google Analytics com o ID fornecido
 * Essa função pode ser chamada em um contexto de carregamento condicional
 * como em casos onde o usuário precisa aceitar cookies antes de carregar o GA
 * 
 * @param measurementId - ID de medição do GA4 (formato G-XXXXXXXX)
 */
export const initializeAnalytics = (measurementId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Carrega o script do GA4 dinamicamente
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  // Inicializa o dataLayer e configura o GA4
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true,
    user_properties: {
      app_name: 'Catalisa Platform',
      app_version: '1.0.0'
    }
  });
};

/**
 * Rastreia uma visualização de página personalizada
 * Útil para aplicações SPA onde as mudanças de rota não recarregam a página
 * 
 * @param path - Caminho da página (ex: '/paas', '/building-blocks')
 * @param title - Título da página
 * @param params - Parâmetros adicionais para enviar com o evento
 */
export const trackPageView = (
  path: string,
  title: string,
  params: EventParams = {}
): void => {
  if (!isGtagLoaded()) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.origin + path,
    ...params
  });
};

/**
 * Rastreia um evento personalizado
 * 
 * @param eventName - Nome do evento (ex: 'button_click', 'form_submit')
 * @param params - Parâmetros adicionais para enviar com o evento
 */
export const trackEvent = (
  eventName: string,
  params: EventParams = {}
): void => {
  if (!isGtagLoaded()) return;
  
  window.gtag('event', eventName, params);
};

/**
 * Rastreia eventos de conversão (objetivos importantes)
 * 
 * @param conversionName - Nome da conversão
 * @param params - Parâmetros adicionais para enviar com o evento
 */
export const trackConversion = (
  conversionName: string,
  params: EventParams = {}
): void => {
  if (!isGtagLoaded()) return;
  
  // Adiciona um valor para conversão se não estiver definido
  if (!params.value && !params.currency) {
    params.value = 1;
    params.currency = 'BRL';
  }
  
  // Usa um formato consistente para nomes de eventos de conversão
  const eventName = `conversion_${conversionName}`;
  
  window.gtag('event', eventName, {
    conversion: true,
    ...params
  });
};

// Eventos específicos pré-definidos para funcionalidades comuns do site

/**
 * Rastreia mudanças de idioma
 * 
 * @param fromLanguage - Idioma anterior
 * @param toLanguage - Novo idioma selecionado
 */
export const trackLanguageChange = (
  fromLanguage: string,
  toLanguage: string
): void => {
  trackEvent('language_change', {
    from_language: fromLanguage,
    to_language: toLanguage
  });
};

/**
 * Rastreia cliques em botões de CTA (Call-to-Action)
 * 
 * @param ctaId - Identificador do botão CTA
 * @param ctaText - Texto exibido no botão
 * @param destination - Destino do clique (URL ou ação)
 */
export const trackCTAClick = (
  ctaId: string,
  ctaText: string,
  destination: string
): void => {
  trackEvent('cta_click', {
    cta_id: ctaId,
    cta_text: ctaText,
    destination: destination
  });
};

/**
 * Rastreia envios de formulário
 * 
 * @param formId - Identificador do formulário
 * @param formName - Nome do formulário (ex: 'contato', 'demo')
 * @param success - Se o envio foi bem-sucedido
 */
export const trackFormSubmit = (
  formId: string,
  formName: string,
  success: boolean
): void => {
  trackEvent('form_submit', {
    form_id: formId,
    form_name: formName,
    success: success
  });
};

/**
 * Rastreia visualizações de Building Blocks
 * 
 * @param blockId - ID do Building Block
 * @param blockName - Nome do Building Block
 */
export const trackBlockView = (
  blockId: string,
  blockName: string
): void => {
  trackEvent('block_view', {
    block_id: blockId,
    block_name: blockName
  });
};

/**
 * Rastreia a reprodução do podcast
 * 
 * @param podcastId - ID do podcast
 * @param podcastName - Nome do podcast
 * @param action - Ação realizada (play, pause, complete)
 * @param timePosition - Posição de tempo em segundos
 */
export const trackPodcastAction = (
  podcastId: string,
  podcastName: string,
  action: 'play' | 'pause' | 'complete',
  timePosition: number
): void => {
  trackEvent('podcast_action', {
    podcast_id: podcastId,
    podcast_name: podcastName,
    action: action,
    time_position: timePosition
  });
};

// Declare o tipo global para o window com gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Exporta funções de helper para facilitar o uso em componentes
export default {
  trackPageView,
  trackEvent,
  trackConversion,
  trackLanguageChange,
  trackCTAClick,
  trackFormSubmit,
  trackBlockView,
  trackPodcastAction
};