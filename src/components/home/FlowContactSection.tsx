import React from 'react';
import { User, MessageSquare, Mail, Check } from 'lucide-react';
import { FlowCanvas, FlowControls, useFlowState } from '../flow';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { submitContactForm } from '../../lib/supabase';

const FlowContactSection: React.FC = () => {
  const { t } = useLanguage();
  
  // Create a flow state specifically for the contact form
    const flowState = useFlowState({
      initialNodes: [
        {
          id: 1,
          title: "Visitor",
          type: "visitor",
          icon: User,
          color: "#734b9c",
          position: { x: 150, y: 100 },
          visible: true
        },
        {
          id: 2,
          title: "Contact Request",
          type: "action",
          icon: MessageSquare,
          color: "#5b9bd5",
          position: { x: 450, y: 100 },
          visible: true
        },
        {
          id: 3,
          title: "Contact Form",
          type: "form",
          icon: Mail,
          color: "#fe8342",
          position: { x: 750, y: 100 },
          visible: false
        },
        {
          id: 4,
          title: "Confirmation",
          type: "confirmation",
          icon: Check,
          color: "#22c55e",
          position: { x: 1050, y: 100 },
          visible: false
        }
      ],
      initialConnections: [
        { id: 1, from: 1, to: 2, visible: true, style: 'curved-up' },
        { id: 2, from: 2, to: 3, visible: false, style: 'curved-down' },
        { id: 3, from: 3, to: 4, visible: false, style: 'curved-up' }
      ],
      onFormSubmit: async (formData) => {
        try {
          const result = await submitContactForm({
            name: formData.name,
            email: formData.email,
            message: formData.message
          });
          
          return { success: result.success, error: result.error };
        } catch ( error) {
          console.error('Error submitting form:', error);
          return { success: false, error: 'An unexpected error occurred. Please try again later.' };
        }
      }
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
          sm:absolute sm:top-1/2 sm:left-3/4 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full sm:p-8
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
        <div className="relative h-[350px] sm:h-[400px] md:h-[500px]">
          <FlowCanvas
            nodes={flowState.nodes}
            connections={flowState.connections}
            scale={flowState.scale}
            position={flowState.position}
            animationProgress={flowState.animationProgress}
            isDraggingCanvas={flowState.isDraggingCanvas}
            draggingNode={flowState.draggingNode}
            formState={flowState.formState}
            isSubmitting={flowState.isSubmitting}
            submitError={flowState.submitError}
            formSubmitted={flowState.formSubmitted}
            handleChange={flowState.handleChange}
            handleSubmit={flowState.handleSubmit}
            activateNode={flowState.activateNode}
            startDraggingCanvas={flowState.startDraggingCanvas}
            startDraggingNode={flowState.startDraggingNode}
            handleMouseMove={flowState.handleMouseMove}
            stopDraggingCanvas={flowState.stopDraggingCanvas}
            stopDraggingNode={flowState.stopDraggingNode}
          />
          
          
        </div>

        <div className="text-center mt-4">
          <a 
            href="#contato" 
            className="text-primary-main hover:underline text-sm"
          >
            {t('flow.contact.skip') || 'Go to traditional form'}
          </a>
        </div>
    </section>
  );
};

export default FlowContactSection;