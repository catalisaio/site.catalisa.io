import { useState, useEffect } from 'react';
import { User, MessageSquare, Mail, Check } from 'lucide-react';
import { submitContactForm } from '../../../lib/supabase';

export const useFlowState = () => {
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
  const [scale, setScale] = useState(0.90); // Scale at 0.90
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Position at x: 0, y: 0
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Animation state
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Nodes and connections state
  const [nodes, setNodes] = useState([
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
  ]);
  
  const [connections, setConnections] = useState([
    { id: 1, from: 1, to: 2, visible: true },
    { id: 2, from: 2, to: 3, visible: false },
    { id: 3, from: 3, to: 4, visible: false }
  ]);
  
  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 30);
    
    return () => clearInterval(interval);
  }, []);
  
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
      const result = await submitContactForm({
        name: formState.name,
        email: formState.email,
        message: formState.message
      });
      
      if (result.success) {
        setFormSubmitted(true);
        
        // Show confirmation node
        setNodes(prev => prev.map(node => 
          node.id === 4 ? { ...node, visible: true } : node
        ));
        
        setConnections(prev => prev.map(conn => 
          conn.id === 3 ? { ...conn, visible: true } : conn
        ));
      } else {
        setSubmitError('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Node activation
  const activateNode = (nodeId: number) => {
    if (nodeId === 2) {
      // Activate form node
      setNodes(prev => prev.map(node => 
        node.id === 3 ? { ...node, visible: true } : node
      ));
      
      // Activate connection
      setConnections(prev => prev.map(conn => 
        conn.id === 2 ? { ...conn, visible: true } : conn
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
    }
  };
  
  return {
    formState,
    isSubmitting,
    submitError,
    formSubmitted,
    handleChange,
    handleSubmit,
    scale,
    position,
    animationProgress,
    isDraggingCanvas,
    draggingNode,
    nodes,
    connections,
    activateNode,
    handleZoomIn,
    handleZoomOut,
    startDraggingCanvas,
    startDraggingNode,
    handleMouseMove,
    stopDraggingCanvas,
    stopDraggingNode
  };
};