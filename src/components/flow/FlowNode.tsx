import React from 'react';
import { User, MessageSquare, Mail, Send, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FlowNode as FlowNodeType } from './FlowCanvas';

interface NodeProps {
  node: FlowNodeType;
  formState?: any;
  isSubmitting?: boolean;
  submitError?: string | null;
  formSubmitted?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit?: (e: React.FormEvent) => void;
  activateNode: (nodeId: number, data?: any) => void;
  draggingNode: number | null;
  startDraggingNode: (e: React.MouseEvent, nodeId: number) => void;
  scale: number;
  customRenderer?: (node: FlowNodeType) => React.ReactNode;
}

const FlowNode: React.FC<NodeProps> = ({
  node,
  formState,
  isSubmitting,
  submitError,
  formSubmitted,
  handleChange,
  handleSubmit,
  activateNode,
  draggingNode,
  startDraggingNode,
  scale,
  customRenderer
}) => {
  const { t } = useLanguage();
  const IconComponent = node.icon;
  
  if (!node.visible) return null;
  
  // If a custom renderer is provided, use it
  if (customRenderer) {
    return (
      <div
        className={`absolute bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${draggingNode === node.id ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          transform: `translate(${node.position.x}px, ${node.position.y}px)`,
          zIndex: draggingNode === node.id ? 20 : 10,
          opacity: 1,
          transition: draggingNode === node.id ? 'none' : 'opacity 0.5s ease-in-out, transform 0.3s ease-in-out'
        }}
        onMouseDown={(e) => startDraggingNode(e, node.id)}
      >
        {customRenderer(node)}
      </div>
    );
  }
  
  // Default node rendering based on node type
  let nodeWidth = "w-56";
  let nodeContent = null;
  
  switch (node.type) {
    case "visitor":
      nodeContent = (
        <>
          <div className="flex items-center p-3 border-b border-gray-100" 
            style={{ backgroundColor: `${node.color}10` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: `${node.color}20` }}>
              <IconComponent size={18} color={node.color} />
            </div>
            <div className="text-gray-800 font-medium">{node.title}</div>
          </div>
          <div className="p-3 text-xs text-gray-600">
            {t('flow.contact.visitor')}
          </div>
        </>
      );
      break;
      
    case "action":
      nodeContent = (
        <>
          <div className="flex items-center p-3 border-b border-gray-100" 
            style={{ backgroundColor: `${node.color}10` }}>
            <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3"
              style={{ backgroundColor: `${node.color}20` }}>
              <IconComponent size={18} color={node.color} />
            </div>
            <div className="text-gray-800 font-medium">{node.title}</div>
          </div>
          <div className="p-3 text-xs text-gray-600 flex items-center">
            <button 
              className="px-3 py-1 bg-primary-main text-white rounded text-xs hover:bg-primary-light transition-colors"
              onClick={() => activateNode(node.id)}
            >
              {t('flow.contact.activate')}
            </button>
          </div>
        </>
      );
      break;
      
    case "form":
      nodeWidth = "w-80";
      nodeContent = (
        <>
          <div className="flex items-center p-3 border-b border-gray-100" 
            style={{ backgroundColor: `${node.color}10` }}>
            <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3"
              style={{ backgroundColor: `${node.color}20` }}>
              <IconComponent size={18} color={node.color} />
            </div>
            <div className="text-gray-800 font-medium">{node.title}</div>
          </div>
          <div className="p-4">
            {submitError && (
              <div className="mb-3 p-2 bg-error-pastel text-error-text text-sm rounded flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            {handleSubmit && formState && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder={t('contact.form.name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-main"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    disabled={formSubmitted || isSubmitting}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.form.email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-main"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    disabled={formSubmitted || isSubmitting}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    placeholder={t('contact.form.message')}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-main"
                    rows={3}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    disabled={formSubmitted || isSubmitting}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full ${
                    formSubmitted 
                      ? 'bg-success-DEFAULT hover:bg-success-DEFAULT cursor-not-allowed' 
                      : isSubmitting 
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-wait' 
                        : 'bg-primary-main hover:bg-primary-light'
                  } text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center`}
                  disabled={formSubmitted || isSubmitting}
                >
                  {isSubmitting 
                    ? t('contact.form.submitting') 
                    : formSubmitted 
                      ? t('flow.contact.success') 
                      : t('contact.form.submit')
                  } 
                  <Send size={14} className="ml-1" />
                </button>
              </form>
            )}
          </div>
        </>
      );
      break;
      
    case "confirmation":
      nodeContent = (
        <>
          <div className="flex items-center p-3 border-b border-gray-100" 
            style={{ backgroundColor: `${node.color}10` }}>
            <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3"
              style={{ backgroundColor: `${node.color}20` }}>
              <IconComponent size={18} color={node.color} />
            </div>
            <div className="text-gray-800 font-medium">{node.title}</div>
          </div>
          <div className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-success-pastel flex items-center justify-center mx-auto mb-2">
              <Check size={24} className="text-success-DEFAULT" />
            </div>
            <p className="text-success-text font-medium">{t('flow.contact.success')}</p>
            <p className="text-sm text-gray-600 mt-1">{t('flow.contact.successDesc')}</p>
          </div>
        </>
      );
      break;
      
    default:
      nodeContent = (
        <div className="p-3 text-gray-800">{node.title}</div>
      );
  }
  
  return (
    <div
      className={`absolute bg-white rounded-md border border-gray-200 ${nodeWidth} shadow-sm hover:shadow-md transition-shadow ${draggingNode === node.id ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
        zIndex: draggingNode === node.id ? 20 : 10,
        opacity: 1,
        transition: draggingNode === node.id ? 'none' : 'opacity 0.5s ease-in-out, transform 0.3s ease-in-out'
      }}
      onMouseDown={(e) => startDraggingNode(e, node.id)}
    >
      {nodeContent}
    </div>
  );
};

export default FlowNode;