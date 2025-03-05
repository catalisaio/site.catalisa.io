import React from 'react';
import { User, MessageSquare, Mail, Check } from 'lucide-react';
import { FlowCanvas, FlowControls, useFlowState } from '../flow';
import { useLanguage } from '../../contexts/LanguageContext';
import { submitContactForm } from '../../lib/supabase';

const FlowContactForm: React.FC = () => {
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
  
  return (
    <section className="py-16 bg-gray-50">
      {/* <div className="container mx-auto px-4"> */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">{t('flow.contact.title') || 'Experience Our Low-Code Approach'}</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t('flow.contact.subtitle') || 'Interact with our visual contact form and see how easy it is to create flows with the Catalisa Platform'}
          </p>
        </div>
        
        {/* Controls for zoom and pan */}
        <FlowControls 
          handleZoomIn={flowState.handleZoomIn}
          handleZoomOut={flowState.handleZoomOut}
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
        
        <div className="text-center mt-4">
          <a 
            href="#contato" 
            className="text-primary-main hover:underline text-sm"
          >
            {t('flow.contact.skip') || 'Go to traditional form'}
          </a>
        </div>
      {/* </div> */}
    </section>
  );
};

export default FlowContactForm;