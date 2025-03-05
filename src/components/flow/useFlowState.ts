import { useState, useEffect, useRef } from 'react';
import { FlowNode, FlowConnection } from './FlowCanvas';

export interface FlowStateOptions {
  initialNodes?: FlowNode[];
  initialConnections?: FlowConnection[];
  initialScale?: number;
  initialPosition?: { x: number; y: number };
  onNodeActivate?: (nodeId: number, data?: any) => void;
  onFormSubmit?: (formData: any) => Promise<{ success: boolean, error?: any }>;
}

export const useFlowState = (options: FlowStateOptions = {}) => {
  // Track window width for responsive positioning
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Flow visualization state
  const [scale, setScale] = useState(options.initialScale || 0.90);
  const [position, setPosition] = useState(options.initialPosition || { x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Animation state
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Nodes and connections state
  const [nodes, setNodes] = useState<FlowNode[]>(options.initialNodes || []);
  const [connections, setConnections] = useState<FlowConnection[]>(options.initialConnections || []);
  
  // Store original node positions for responsive positioning
  const originalPositionsRef = useRef<{[key: number]: {x: number, y: number}}>({}); 
  
  // Initialize original positions if not set
  useEffect(() => {
    if (Object.keys(originalPositionsRef.current).length === 0 && nodes.length > 0) {
      const positions: {[key: number]: {x: number, y: number}} = {};
      nodes.forEach(node => {
        positions[node.id] = { ...node.position };
      });
      originalPositionsRef.current = positions;
    }
  }, [nodes]);
  
  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 30);
    
    return () => clearInterval(interval);
  }, []);
  
  // Responsive positioning effect
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update node positions when window width changes
  useEffect(() => {
    if (Object.keys(originalPositionsRef.current).length > 0) {
      repositionNodesForViewport();
    }
  }, [windowWidth]);
  
  // Calculate position adjustment based on viewport width
  const getPositionFactors = () => {
    if (windowWidth < 640) { // Mobile
      return { xFactor: 0.5, yFactor: 1, xOffset: -100 };
    } else if (windowWidth < 1024) { // Tablet
      return { xFactor: 0.7, yFactor: 1, xOffset: 0 };
    } else { // Desktop - original positions
      return { xFactor: 1, yFactor: 1, xOffset: 0 };
    }
  };
  
  // Reposition nodes based on current viewport
  const repositionNodesForViewport = () => {
    const { xFactor, yFactor, xOffset } = getPositionFactors();
    
    // If we're on desktop, restore original positions
    if (xFactor === 1 && yFactor === 1 && xOffset === 0) {
      setNodes(prev => prev.map(node => ({
        ...node,
        position: originalPositionsRef.current[node.id] || node.position
      })));
      return;
    }
    
    // Otherwise, adjust positions based on viewport
    setNodes(prev => prev.map(node => {
      const original = originalPositionsRef.current[node.id] || node.position;
      return {
        ...node,
        position: {
          x: original.x * xFactor + xOffset,
          y: original.y * yFactor
        }
      };
    }));
  };
  
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing again
    if (submitError) {
      setSubmitError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Use custom submit handler if provided
      if (options.onFormSubmit) {
        const result = await options.onFormSubmit(formState);
        
        if (result.success) {
          setFormSubmitted(true);
          
          // Show confirmation node if it exists
          const confirmationNode = nodes.find(node => node.type === 'confirmation');
          if (confirmationNode) {
            setNodes(prev => prev.map(node => 
              node.id === confirmationNode.id ? { ...node, visible: true } : node
            ));
            
            // Show connection to confirmation node if it exists
            const confirmationConnection = connections.find(conn => conn.to === confirmationNode.id);
            if (confirmationConnection) {
              setConnections(prev => prev.map(conn => 
                conn.id === confirmationConnection.id ? { ...conn, visible: true } : conn
              ));
            }
          }
        } else {
          setSubmitError(result.error || 'Failed to submit the form. Please try again.');
        }
      } else {
        // Default behavior if no custom handler
        setFormSubmitted(true);
        
        // Show confirmation node if it exists
        const confirmationNode = nodes.find(node => node.type === 'confirmation');
        if (confirmationNode) {
          setNodes(prev => prev.map(node => 
            node.id === confirmationNode.id ? { ...node, visible: true } : node
          ));
          
          // Show connection to confirmation node if it exists
          const confirmationConnection = connections.find(conn => conn.to === confirmationNode.id);
          if (confirmationConnection) {
            setConnections(prev => prev.map(conn => 
              conn.id === confirmationConnection.id ? { ...conn, visible: true } : conn
            ));
          }
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Node activation
  const activateNode = (nodeId: number, data?: any) => {
    // Call custom handler if provided
    if (options.onNodeActivate) {
      options.onNodeActivate(nodeId, data);
    }
    
    // Default behavior - find connections from this node and make target nodes visible
    const outgoingConnections = connections.filter(conn => conn.from === nodeId);
    
    if (outgoingConnections.length > 0) {
      // Make connections visible
      setConnections(prev => prev.map(conn => 
        outgoingConnections.some(oc => oc.id === conn.id) ? { ...conn, visible: true } : conn
      ));
      
      // Make target nodes visible
      const targetNodeIds = outgoingConnections.map(conn => conn.to);
      setNodes(prev => prev.map(node => 
        targetNodeIds.includes(node.id) ? { ...node, visible: true } : node
      ));
    }
  };
  
  // Canvas controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const startDraggingCanvas = (e: React.MouseEvent) => {
    if (draggingNode) return;
    
    e.preventDefault();
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const stopDraggingCanvas = () => {
    setIsDraggingCanvas(false);
  };
  
  const startDraggingNode = (e: React.MouseEvent, nodeId: number) => {
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / scale;
    const offsetY = (e.clientY - rect.top) / scale;
    
    setDraggingNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  const stopDraggingNode = () => {
    setDraggingNode(null);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    // Handle canvas dragging
    if (isDraggingCanvas) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX / scale,
        y: prev.y + deltaY / scale
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
    
    // Handle node dragging
    if (draggingNode !== null) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      
      // Calculate the position considering the zoom and the pan
      const x = (e.clientX - containerRect.left) / scale - position.x - dragOffset.x;
      const y = (e.clientY - containerRect.top) / scale - position.y - dragOffset.y;
      
      setNodes(prev => prev.map(node => 
        node.id === draggingNode 
          ? { ...node, position: { x, y } } 
          : node
      ));
      
      // Update original position if we're in desktop view
      const { xFactor } = getPositionFactors();
      if (xFactor === 1 && draggingNode !== null) {
        originalPositionsRef.current[draggingNode] = { x, y };
      }
    }
  };
  
  // Methods to update nodes and connections
  const updateNode = (nodeId: number, updates: Partial<FlowNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };
  
  const updateConnection = (connectionId: number, updates: Partial<FlowConnection>) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId ? { ...conn, ...updates } : conn
    ));
  };
  
  const addNode = (node: FlowNode) => {
    setNodes(prev => [...prev, node]);
    originalPositionsRef.current[node.id] = { ...node.position };
  };
  
  const addConnection = (connection: FlowConnection) => {
    setConnections(prev => [...prev, connection]);
  };
  
  const removeNode = (nodeId: number) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    // Also remove any connections to/from this node
    setConnections(prev => prev.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
    // Remove from original positions as well
    const updatedPositions = { ...originalPositionsRef.current };
    delete updatedPositions[nodeId];
    originalPositionsRef.current = updatedPositions;
  };
  
  const removeConnection = (connectionId: number) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };
  
  return {
    // State
    formState,
    isSubmitting,
    submitError,
    formSubmitted,
    scale,
    position,
    animationProgress,
    isDraggingCanvas,
    draggingNode,
    nodes,
    connections,
    windowWidth,
    
    // Form handlers
    handleChange,
    handleSubmit,
    setFormState,
    
    // Node interaction
    activateNode,
    
    // Canvas controls
    handleZoomIn,
    handleZoomOut,
    startDraggingCanvas,
    startDraggingNode,
    handleMouseMove,
    stopDraggingCanvas,
    stopDraggingNode,
    
    // Node and connection management
    updateNode,
    updateConnection,
    addNode,
    addConnection,
    removeNode,
    removeConnection,
    
    // Responsive positioning
    repositionNodesForViewport
  };
};