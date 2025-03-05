// CalendlyWidget.jsx
import React, { useEffect } from 'react';

const CalendlyComponent = () => {
  useEffect(() => {
    // Carrega o script do Calendly dinamicamente
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Limpa o script quando o componente é desmontado
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="calendly-inline-widget w-full h-[500px]" data-url="https://calendly.com/klederson-catalisa?primary_color=734b9c"></div>
  );
};

export default CalendlyComponent;