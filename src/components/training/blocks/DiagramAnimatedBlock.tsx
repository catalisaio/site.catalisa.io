import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiZap, FiUsers, FiMessageSquare, FiDatabase, FiCpu, FiGlobe,
  FiMail, FiServer, FiSettings, FiLayers, FiSend, FiTarget,
} from 'react-icons/fi';
import type { DiagramAnimatedBlock as DiagramAnimatedBlockType } from '../../../data/trainingBlockTypes';

const iconMap: Record<string, React.ComponentType> = {
  zap: FiZap, users: FiUsers, message: FiMessageSquare, database: FiDatabase,
  cpu: FiCpu, globe: FiGlobe, mail: FiMail, server: FiServer,
  settings: FiSettings, layers: FiLayers, send: FiSend, target: FiTarget,
};

const defaultColors: Record<string, string> = {
  flow: '#734B9C',
  architecture: '#3182CE',
  sequence: '#38A169',
  'data-flow': '#DD6B20',
};

interface Props {
  block: DiagramAnimatedBlockType;
}

export function DiagramAnimatedBlock({ block }: Props) {
  const viewW = block.viewBox?.w || 800;
  const viewH = block.viewBox?.h || 400;

  const edgePaths = useMemo(() => {
    return block.edges.map(edge => {
      const from = block.nodes.find(n => n.id === edge.from);
      const to = block.nodes.find(n => n.id === edge.to);
      if (!from || !to) return null;

      const fromW = from.w || 140;
      const fromH = from.h || 60;
      const toW = to.w || 140;
      const toH = to.h || 60;

      const fx = from.x + fromW / 2;
      const fy = from.y + fromH / 2;
      const tx = to.x + toW / 2;
      const ty = to.y + toH / 2;

      // Simple bezier curve
      const mx = (fx + tx) / 2;
      const d = `M ${fx} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${tx} ${ty}`;

      return { ...edge, d, tx, ty, mx, my: (fy + ty) / 2 };
    }).filter(Boolean);
  }, [block.nodes, block.edges]);

  const baseColor = defaultColors[block.variant] || '#734B9C';

  return (
    <Box w="full" overflow="hidden" borderRadius="xl" border="1px solid" borderColor="gray.200" bg="gray.50">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        width="100%"
        style={{ display: 'block' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={baseColor} opacity="0.6" />
          </marker>
        </defs>

        {/* Edges */}
        {edgePaths.map((edge, i) => edge && (
          <g key={`edge-${i}`}>
            <motion.path
              d={edge.d}
              fill="none"
              stroke={baseColor}
              strokeWidth="2"
              strokeOpacity="0.4"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: 'easeInOut' }}
            />
            {edge.label && (
              <motion.text
                x={edge.mx}
                y={edge.my - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#718096"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.15 }}
              >
                {edge.label}
              </motion.text>
            )}
          </g>
        ))}

        {/* Nodes */}
        {block.nodes.map((node, i) => {
          const w = node.w || 140;
          const h = node.h || 60;
          const color = node.color || baseColor;
          const IconComp = node.icon ? iconMap[node.icon] : null;

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              style={{ transformOrigin: `${node.x + w / 2}px ${node.y + h / 2}px` }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={w}
                height={h}
                rx="12"
                fill="white"
                stroke={color}
                strokeWidth="2"
              />
              {IconComp && (
                <foreignObject x={node.x + 12} y={node.y + (h - 18) / 2} width="18" height="18">
                  <Box as={IconComp} color={color} boxSize="18px" />
                </foreignObject>
              )}
              <text
                x={node.x + (IconComp ? 36 : w / 2)}
                y={node.y + h / 2 + 4}
                textAnchor={IconComp ? 'start' : 'middle'}
                fontSize="13"
                fontWeight="600"
                fill="#2D3748"
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </Box>
  );
}
