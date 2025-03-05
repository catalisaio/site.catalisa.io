import React from 'react';
import { Move } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const FlowInstructions: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white bg-opacity-80 px-3 py-2 rounded-md shadow-sm">
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 rounded-full mr-1 flex items-center justify-center">
          <Move size={12} />
        </div>
        <span>{t('flow.move')}</span>
      </div>
      <div className="flex items-center">
        <Move size={12} className="mr-1" />
        <span>{t('flow.drag')}</span>
      </div>
    </div>
  );
};

export default FlowInstructions;