import React from 'react';
import { Shield, Activity, Edit3, DollarSign } from 'lucide-react';
import { FlowCanvas, FlowControls, useFlowState } from '../flow';
import { useLanguage } from '../../contexts/LanguageContext';

const FluxoFinanceiroInterativo: React.FC = () => {
  const { t } = useLanguage();
  
  // Create a flow state for the financial flow
  const flowState = useFlowState({
    initialNodes: [
      {
        id: 1,
        title: "Identity and Access Management",
        type: "custom",
        icon: Shield,
        color: "#734b9c",
        position: { x: 150, y: 180 },
        visible: true,
        data: {
          category: "Segurança e Compliance"
        }
      },
      {
        id: 2,
        title: "Credit Analysis",
        type: "custom",
        icon: Activity,
        color: "#5b9bd5",
        position: { x: 450, y: 100 },
        visible: true,
        data: {
          category: "Dados e Analytics"
        }
      },
      {
        id: 3,
        title: "Digital Signature",
        type: "custom",
        icon: Edit3,
        color: "#734b9c",
        position: { x: 750, y: 220 },
        visible: true,
        data: {
          category: "Segurança e Compliance"
        }
      },
      {
        id: 4,
        title: "Payments",
        type: "custom",
        icon: DollarSign,
        color: "#fe8342",
        position: { x: 1050, y: 140 },
        visible: true,
        data: {
          category: "Operações Financeiras"
        }
      }
    ],
    initialConnections: [
      { id: 1, from: 1, to: 2, visible: true },
      { id: 2, from: 2, to: 3, visible: true },
      { id: 3, from: 3, to: 4, visible: true }
    ]
  });
  
  // Custom node renderer for financial flow nodes
  const renderFinancialNode = (node: any) => (
    <>
      <div className="flex items-center p-3 border-b border-gray-100" 
        style={{ backgroundColor: `${node.color}10` }}>
        <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3"
          style={{ backgroundColor: `${node.color}20` }}>
          <node.icon size={18} color={node.color} />
        </div>
        <div className="text-gray-800 font-medium">{node.title}</div>
      </div>
      <div className="p-3 text-xs text-gray-600 flex items-center">
        <span className="inline-block w-2 h-2 rounded-full mr-2" 
          style={{ backgroundColor: node.color }}></span>
        {node.data?.category || "Building Block"}
      </div>
    </>
  );
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">{t('flow.title')}</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t('flow.subtitle')}
          </p>
        </div>
        
        {/* Controls for zoom and pan */}
        <FlowControls 
          handleZoomIn={flowState.handleZoomIn}
          handleZoomOut={flowState.handleZoomOut}
          labels={{
            zoomIn: t('flow.zoom.in'),
            zoomOut: t('flow.zoom.out'),
            drag: t('flow.drag')
          }}
        />
        
        {/* Main visualization area */}
        <FlowCanvas 
          nodes={flowState.nodes}
          connections={flowState.connections}
          scale={flowState.scale}
          position={flowState.position}
          animationProgress={flowState.animationProgress}
          isDraggingCanvas={flowState.isDraggingCanvas}
          draggingNode={flowState.draggingNode}
          activateNode={flowState.activateNode}
          startDraggingCanvas={flowState.startDraggingCanvas}
          startDraggingNode={flowState.startDraggingNode}
          handleMouseMove={flowState.handleMouseMove}
          stopDraggingCanvas={flowState.stopDraggingCanvas}
          stopDraggingNode={flowState.stopDraggingNode}
          renderNodeContent={renderFinancialNode}
          debugMode={false}
        />
        
        <div className="text-center mt-6">
          <a 
            href="#saiba-mais" 
            className="inline-flex items-center px-6 py-3 bg-[#734b9c] text-white rounded font-medium hover:bg-opacity-90 transition-colors"
          >
            {t('flow.explore')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FluxoFinanceiroInterativo;