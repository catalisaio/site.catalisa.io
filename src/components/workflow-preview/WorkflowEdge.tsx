import { useEffect, useRef } from 'react';
import type { WorkflowEdge as EdgeType, WorkflowTheme } from './types';

interface Props {
  edge: EdgeType;
  nodePositions: Record<string, { x: number; y: number }>;
  isActive: boolean;
  theme: WorkflowTheme;
  entered: boolean;
  viewBoxW: number;
  viewBoxH: number;
}

function computePath(
  sx: number, sy: number, tx: number, ty: number,
): string {
  const dx = Math.abs(tx - sx);
  const dy = Math.abs(ty - sy);

  // Mostly vertical: use vertical bezier
  if (dy > dx * 0.5) {
    const midY = (sy + ty) / 2;
    return `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
  }

  // Mostly horizontal: use horizontal bezier
  const midX = (sx + tx) / 2;
  return `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
}

export function WorkflowEdgeComponent({ edge, nodePositions, isActive, theme, entered, viewBoxW, viewBoxH }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const fromPos = nodePositions[edge.from];
  const toPos = nodePositions[edge.to];

  if (!fromPos || !toPos) return null;

  const sx = (fromPos.x / 100) * viewBoxW;
  const sy = (fromPos.y / 100) * viewBoxH;
  const tx = (toPos.x / 100) * viewBoxW;
  const ty = (toPos.y / 100) * viewBoxH;

  const d = computePath(sx, sy, tx, ty);

  // Draw-in animation on enter
  useEffect(() => {
    if (entered && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;
      pathRef.current.style.transition = 'none';

      // Force reflow
      pathRef.current.getBoundingClientRect();

      pathRef.current.style.transition = 'stroke-dashoffset 0.6s ease-out';
      pathRef.current.style.strokeDashoffset = '0';
    }
  }, [entered]);

  const activeColor = theme.edgeActiveColor;
  const baseColor = theme.edgeColor;

  return (
    <g>
      {/* Base path */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={isActive ? activeColor : baseColor}
        strokeWidth={isActive ? 2.5 : 1.5}
        markerEnd={`url(#arrow-${isActive ? 'active' : 'base'})`}
        style={{
          transition: 'stroke 0.3s, stroke-width 0.3s',
        }}
      />

      {/* Animated pulse dot on active edges */}
      {isActive && (
        <circle r="4" fill={activeColor} opacity="0.9">
          <animateMotion dur="0.8s" repeatCount="1" fill="freeze">
            <mpath href={`#pulse-path-${edge.from}-${edge.to}`} />
          </animateMotion>
        </circle>
      )}

      {/* Hidden path for pulse animation reference */}
      <path
        id={`pulse-path-${edge.from}-${edge.to}`}
        d={d}
        fill="none"
        stroke="none"
      />

      {/* Edge label */}
      {edge.label && (
        <>
          <text
            x={(sx + tx) / 2 + (tx > sx ? 8 : -8)}
            y={(sy + ty) / 2}
            fill={isActive ? activeColor : baseColor}
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={0.8}
          >
            {edge.label}
          </text>
        </>
      )}
    </g>
  );
}
