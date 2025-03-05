import React, { useRef, useState } from 'react';
import { Bug } from 'lucide-react';
import FlowNode from './FlowNode';
import FlowConnection from './FlowConnection';
import FlowInstructions from './FlowInstructions';

export interface FlowNode {
  id: number;
  title: string;
  type: string;
  icon: any;
  color: string;
  position: { x: number; y: number };
  visible: boolean;
  data?: any; // Additional data specific to the node type
}

export interface FlowConnection {
  id: number;
  from: number;
  to: number;
  visible: boolean;
  style?: string; // Optional style for custom connection appearance
}

interface FlowCanvasProps {
  nodes: FlowNode[];
  connections: FlowConnection[];
  scale: number;
  position: { x: number; y: number };
  animationProgress: number;
  isDraggingCanvas: boolean;
  draggingNode: number | null;
  
  // Optional form-related props
  formState?: any;
  isSubmitting?: boolean;
  submitError?: string | null;
  formSubmitted?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit?: (e: React.FormEvent) => void;
  
  // Node interaction handlers
  activateNode: (nodeId: number, data?: any) => void;
  
  // Mouse event handlers
  startDraggingCanvas: (e: React.MouseEvent) => void;
  startDraggingNode: (e: React.MouseEvent, nodeId: number) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  stopDraggingCanvas: () => void;
  stopDraggingNode: () => void;
  
  // Touch event handlers (for mobile devices)
  startDraggingCanvasTouch?: (e: React.TouchEvent) => void;
  startDraggingNodeTouch?: (e: React.TouchEvent, nodeId: number) => void;
  handleTouchMove?: (e: React.TouchEvent) => void;
  stopDraggingCanvasTouch?: () => void;
  
  // Optional custom renderers
  renderNodeContent?: (node: FlowNode) => React.ReactNode;
  renderConnectionPath?: (connection: FlowConnection, start: {x: number, y: number}, end: {x: number, y: number}) => string;
  
  // Optional debug mode
  debugMode?: boolean;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  connections,
  scale,
  position,
  animationProgress,
  isDraggingCanvas,
  draggingNode,
  formState,
  isSubmitting,
  submitError,
  formSubmitted,
  handleChange,
  handleSubmit,
  activateNode,
  startDraggingCanvas,
  startDraggingNode,
  handleMouseMove,
  stopDraggingCanvas,
  stopDraggingNode,
  startDraggingCanvasTouch,
  startDraggingNodeTouch,
  handleTouchMove,
  stopDraggingCanvasTouch,
  renderNodeContent,
  renderConnectionPath,
  debugMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDebug, setShowDebug] = useState(false);
  
  const toggleDebug = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDebug(!showDebug);
  };
  
  return (
    <div 
      ref={containerRef}
      className="canvas-draggable relative mx-auto w-full h-[500px] rounded-lg border border-gray-200 bg-white shadow-sm mb-6 overflow-hidden cursor-grab"
      style={{ 
        cursor: isDraggingCanvas ? 'grabbing' : (draggingNode ? 'grabbing' : 'grab') 
      }}
      onMouseDown={startDraggingCanvas}
      onMouseMove={handleMouseMove}
      onMouseUp={() => {
        stopDraggingCanvas();
        stopDraggingNode();
      }}
      onMouseLeave={() => {
        stopDraggingCanvas();
        stopDraggingNode();
      }}
      onTouchStart={startDraggingCanvasTouch}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        if (stopDraggingCanvasTouch) stopDraggingCanvasTouch();
        stopDraggingNode();
      }}
      onTouchCancel={() => {
        if (stopDraggingCanvasTouch) stopDraggingCanvasTouch();
        stopDraggingNode();
      }}
    >
      {/* Grid Pattern */}
      <div 
        className="canvas-draggable absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "linear-gradient(#e9e1f2 1px, transparent 1px), linear-gradient(90deg, #e9e1f2 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          transformOrigin: "0 0"
        }}
      />
      
      {/* Content Area with Zoom and Pan */}
      <div 
        className="canvas-draggable absolute inset-0" 
        style={{ 
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: "0 0"
        }}
      >
        {/* Connections */}
        {connections.map((connection) => (
          <FlowConnection 
            key={connection.id} 
            connection={connection} 
            nodes={nodes}
            progress={animationProgress}
            customPathRenderer={renderConnectionPath}
          />
        ))}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <FlowNode 
            key={node.id} 
            node={node}
            formState={formState}
            isSubmitting={isSubmitting}
            submitError={submitError}
            formSubmitted={formSubmitted}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            activateNode={activateNode}
            draggingNode={draggingNode}
            startDraggingNode={startDraggingNode}
            startDraggingNodeTouch={startDraggingNodeTouch}
            scale={scale}
            customRenderer={renderNodeContent}
          />
        ))}
      </div>
      
      {/* Debug Button - Only shown if debugMode is true */}
      {debugMode && (
        <button
          className="absolute top-3 left-3 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={toggleDebug}
          title="Debug Canvas"
        >
          <Bug size={20} className="text-gray-700" />
        </button>
      )}
      
      {/* Debug Panel */}
      {debugMode && showDebug && (
        <div className="absolute top-14 left-3 z-50 bg-white p-4 rounded-md shadow-md border border-gray-200 max-w-xs max-h-[400px] overflow-auto text-xs">
          <h3 className="font-bold mb-2 text-sm">Canvas Debug Info</h3>
          <div className="mb-2">
            <p><strong>Scale:</strong> {scale.toFixed(2)}</p>
            <p><strong>Position:</strong> x: {position.x.toFixed(0)}, y: {position.y.toFixed(0)}</p>
            <p><strong>Dragging:</strong> {isDraggingCanvas ? 'Canvas' : draggingNode ? `Node ${draggingNode}` : 'None'}</p>
          </div>
          
          <h4 className="font-bold mt-3 mb-1 text-sm">Nodes:</h4>
          <div className="space-y-2">
            {nodes.map(node => (
              <div key={node.id} className="border-t border-gray-200 pt-1">
                <p><strong>ID:</strong> {node.id} - {node.title}</p>
                <p><strong>Position:</strong> x: {node.position.x.toFixed(0)}, y: {node.position.y.toFixed(0)}</p>
                <p><strong>Visible:</strong> {node.visible ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
          
          <h4 className="font-bold mt-3 mb-1 text-sm">Connections:</h4>
          <div className="space-y-2">
            {connections.map(conn => (
              <div key={conn.id} className="border-t border-gray-200 pt-1">
                <p><strong>ID:</strong> {conn.id}</p>
                <p><strong>From:</strong> {conn.from} → <strong>To:</strong> {conn.to}</p>
                <p><strong>Visible:</strong> {conn.visible ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
          
          {formState && (
            <h4 className="font-bold mt-3 mb-1 text-sm">Form State:</h4>
          )}
          {formState && (
            <div className="border-t border-gray-200 pt-1">
              <p><strong>Submitted:</strong> {formSubmitted ? 'Yes' : 'No'}</p>
              <p><strong>Submitting:</strong> {isSubmitting ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {submitError || 'None'}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Instructions */}
      <FlowInstructions />
    </div>
  );
};

export default FlowCanvas;