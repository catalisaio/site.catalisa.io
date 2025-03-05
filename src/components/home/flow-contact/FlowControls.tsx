import React from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface FlowControlsProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const FlowControls: React.FC<FlowControlsProps> = ({ handleZoomIn, handleZoomOut }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center mb-4 space-x-2">
      <button 
        className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-50"
        onClick={handleZoomIn}
        title={t('flow.zoom.in')}
      >
        <ZoomIn size={20} />
      </button>
      <button 
        className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-50"
        onClick={handleZoomOut}
        title={t('flow.zoom.out')}
      >
        <ZoomOut size={20} />
      </button>
      <div className="bg-white px-3 py-2 rounded-md shadow-sm flex items-center">
        <Move size={16} className="mr-2 text-gray-500" />
        <span className="text-sm text-gray-600">{t('flow.drag')}</span>
      </div>
    </div>
  );
};

export default FlowControls;