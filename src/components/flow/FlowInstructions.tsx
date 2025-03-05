import React from 'react';
import { Move } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FlowInstructionsProps {
  customInstructions?: {
    move?: string;
    drag?: string;
  };
}

const FlowInstructions: React.FC<FlowInstructionsProps> = ({ customInstructions }) => {
  const { t } = useLanguage();
  
  // Use custom instructions or fallback to translations
  const moveText = customInstructions?.move || t('flow.move');
  const dragText = customInstructions?.drag || t('flow.drag');
  
  return (
    <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white bg-opacity-80 px-3 py-2 rounded-md shadow-sm">
      {/* <div className="flex items-center mb-1">
        <div className="w-4 h-4 rounded-full mr-1 flex items-center justify-center">
          <Move size={12} />
        </div>
        <span>{moveText}</span>
      </div> */}
      <div className="flex items-center">
        <Move size={12} className="mr-1" />
        <span>{dragText}</span>
      </div>
    </div>
  );
};

export default FlowInstructions;