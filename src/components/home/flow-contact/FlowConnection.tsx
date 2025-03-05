import React from 'react';

interface ConnectionProps {
  connection: {
    id: number;
    from: number;
    to: number;
    visible: boolean;
  };
  nodes: Array<{
    id: number;
    type: string;
    position: { x: number; y: number };
    color: string;
    visible: boolean;
  }>;
  progress: number;
}

const FlowConnection: React.FC<ConnectionProps> = ({ connection, nodes, progress }) => {
  if (!connection.visible) return null;
  
  const fromNode = nodes.find(n => n.id === connection.from);
  const toNode = nodes.find(n => n.id === connection.to);
  
  if (!fromNode || !toNode) return null;
  
  // Calculate connection points based on node type
  let startX = fromNode.position.x;
  let startY = fromNode.position.y;
  let endX = toNode.position.x;
  let endY = toNode.position.y;
  
  // Adjust based on node type
  if (fromNode.type === "visitor" || fromNode.type === "action") {
    startX += 56; // Half of standard node width
  } else if (fromNode.type === "form") {
    startX += 80; // Half of form node width
  }
  
  startY += 40; // Vertical center
  endY += 40; // Vertical center
  
  const start = { x: startX, y: startY };
  const end = { x: endX, y: endY };
  
  // Customize the curve based on the connection
  let path = '';
  
  if (connection.id === 1) {
    // Visitor to Contact Request - curved upward
    const controlPoint1 = {
      x: start.x + (end.x - start.x) * 0.3,
      y: start.y - 80
    };
    const controlPoint2 = {
      x: end.x - (end.x - start.x) * 0.3,
      y: end.y - 80
    };
    path = `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;
  } else if (connection.id === 2) {
    // Contact Request to Contact Form - curved downward
    const controlPoint1 = {
      x: start.x + (end.x - start.x) * 0.3,
      y: start.y + 50
    };
    const controlPoint2 = {
      x: end.x - (end.x - start.x) * 0.3,
      y: end.y - 50
    };
    path = `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;
  } else if (connection.id === 3) {
    // Contact Form to Confirmation - curved upward
    const controlPoint1 = {
      x: start.x + (end.x - start.x) * 0.3,
      y: start.y - 80
    };
    const controlPoint2 = {
      x: end.x - (end.x - start.x) * 0.3,
      y: end.y - 30
    };
    path = `M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`;
  } else {
    // Default bezier curve
    const distance = end.x - start.x;
    const control1 = {
      x: start.x + distance * 0.4,
      y: start.y
    };
    
    const control2 = {
      x: end.x - distance * 0.4,
      y: end.y
    };
    
    path = `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`;
  }
  
  // Animation
  const pathLength = 1000;
  const dashLength = (progress / 100) * pathLength;
  
  return (
    <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 5 }}>
      {/* Gradient */}
      <defs>
        <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fromNode.color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={toNode.color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      
      {/* Background line */}
      <path
        d={path}
        fill="none"
        stroke="#e9e1f2"
        strokeWidth="3"
        strokeDasharray="5,5"
      />
      
      {/* Animated line */}
      <path
        d={path}
        fill="none"
        stroke={`url(#gradient-${connection.id})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dashLength}, ${pathLength}`}
      />
      
      {/* Arrow */}
      <polygon
        points="0,0 -10,-6 -10,6"
        fill={toNode.color}
        transform={`translate(${end.x}, ${end.y})`}
        style={{ 
          opacity: progress > 95 ? 1 : 0,
          transition: "opacity 0.2s ease-in"
        }}
      />
    </svg>
  );
};

export default FlowConnection;