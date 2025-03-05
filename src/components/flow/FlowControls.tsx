import React from 'react';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface FlowControlsProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  className?: string;
  labels?: {
    zoomIn?: string;
    zoomOut?: string;
    drag?: string;
  };
}

const FlowControls: React.FC<FlowControlsProps> = ({ 
  handleZoomIn, 
  handleZoomOut,
  className = "",
  labels
}) => {
  const { t } = useLanguage();
  
  // Use provided labels or fallback to translations
  const zoomInLabel = labels?.zoomIn || t('flow.zoom.in');
  const zoomOutLabel = labels?.zoomOut || t('flow.zoom.out');
  const dragLabel = labels?.drag || t('flow.drag');
  
  return (
    <div className={`flex justify-center mb-4 space-x-2 ${className}`}>
      <button 
        className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-50"
        onClick={handleZoomIn}
        title={zoomInLabel}
      >
        <ZoomIn size={20} />
      </button>
      <button 
        className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-50"
        onClick={handleZoomOut}
        title={zoomOutLabel}
      >
        <ZoomOut size={20} />
      </button>
      <div className="bg-white px-3 py-2 rounded-md shadow-sm flex items-center">
        <Move size={16} className="mr-2 text-gray-500" />
        <span className="text-sm text-gray-600">{dragLabel}</span>
      </div>
    </div>
  );
};

export default FlowControls;