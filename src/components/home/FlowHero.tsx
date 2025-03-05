import React from 'react';
import { Shield, DollarSign, Activity, Edit3 } from 'lucide-react';
import { FlowCanvas, useFlowState } from '../flow';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const FlowHero: React.FC = () => {
  const { t } = useLanguage();
  
  // Set initial scale for the flow
  const initialScale = 0.9;
  
  // Create a flow state for the financial flow
   const flowState = useFlowState({
     initialScale: initialScale,
     initialNodes: [
       {
         id: 1,
         title: "Identity and Access Management",
         type: "custom",
         icon: Shield,
         color: "#734b9c",
         position: { x: 769, y: 302 }, // Absolute position for desktop (650 + 119)
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
         position: { x: 1126, y: 114 }, // Absolute position for desktop (650 + 476)
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
         position: { x: 1399, y: 259 }, // Absolute position for desktop (650 + 749)
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
         position: { x: 1671, y: 134 }, // Absolute position for desktop (650 + 1021)
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
  const renderCustomNodes = (node: any) => (
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
    <section className="bg-gray-150 relative" style={{ marginBottom: '-25px' }}>
        {/* Floating glass container - responsively positioned */}
        <div className={`
          z-30 backdrop-blur-md bg-white/05 border border-white/25 rounded-xl
          sm:absolute sm:top-1/2 sm:left-1/4 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full sm:p-8
          mx-4 my-6 p-6 relative
        `}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4 text-primary-main">
            {t('flow.hero.title')}
          </h3>
          <p className="text-sm sm:text-base text-gray-800 mb-4 sm:mb-6">
            {t('flow.hero.subtitle')}
          </p>
          <Link to="/schedule" className="bg-primary-main hover:bg-primary-light text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors shadow-soft hover:shadow-hover text-sm sm:text-base inline-block">
            Try It Now
          </Link>
        </div>
        
        {/* Main visualization area with relative positioning */}
        <div className="relative">
          <FlowCanvas 
            nodes={flowState.nodes}
            connections={flowState.connections}
            scale={flowState.scale}
            position={flowState.position}
            animationProgress={flowState.animationProgress}
            isDraggingCanvas={flowState.isDraggingCanvas}
            draggingNode={flowState.draggingNode}
            activateNode={(nodeId) => {
              flowState.activateNode(nodeId);
              
              // Custom logic for this specific flow
              if (nodeId === 2) {
                // When Credit Analysis is activated, show Document Verification
                flowState.updateNode(3, { visible: true });
                flowState.updateConnection(2, { visible: true });
              } else if (nodeId === 3) {
                // When Document Verification is activated, show Approval
                flowState.updateNode(4, { visible: true });
                flowState.updateConnection(3, { visible: true });
              }
            }}
            startDraggingCanvas={flowState.startDraggingCanvas}
            startDraggingNode={flowState.startDraggingNode}
            handleMouseMove={flowState.handleMouseMove}
            stopDraggingCanvas={flowState.stopDraggingCanvas}
            stopDraggingNode={flowState.stopDraggingNode}
            renderNodeContent={renderCustomNodes}
            debugMode={false}
          />
        </div>
    </section>
  );
};

export default FlowHero;