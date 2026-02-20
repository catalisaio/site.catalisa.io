import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkflowPreviewData, WorkflowTheme } from './types';
import { darkTheme, lightTheme } from './types';
import { WorkflowNodeComponent } from './WorkflowNode';
import { WorkflowEdgeComponent } from './WorkflowEdge';
import { useWorkflowAnimation } from './useWorkflowAnimation';

interface Props {
  workflow: WorkflowPreviewData;
  variant?: 'dark' | 'light';
  autoPlay?: boolean;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 625; // 16:10 ratio

export function WorkflowPreview({ workflow, variant = 'light', autoPlay = true }: Props) {
  const theme: WorkflowTheme = variant === 'dark' ? darkTheme : lightTheme;
  const { entered, isNodeActive, isEdgeActive } = useWorkflowAnimation(workflow, { autoPlay });

  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    for (const node of workflow.nodes) {
      positions[node.id] = { x: node.x, y: node.y };
    }
    return positions;
  }, [workflow.nodes]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={workflow.id}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        <Box
          position="relative"
          w="100%"
          pb="62.5%" /* 16:10 aspect ratio */
          overflow="hidden"
          borderRadius="xl"
        >
          {/* SVG layer for edges */}
          <Box
            as="svg"
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            preserveAspectRatio="xMidYMid meet"
            zIndex={1}
            pointerEvents="none"
          >
            <defs>
              <marker
                id="arrow-base"
                viewBox="0 0 10 6"
                refX="10"
                refY="3"
                markerWidth="8"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 3 L 0 6 z" fill={theme.edgeColor} />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 6"
                refX="10"
                refY="3"
                markerWidth="8"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 3 L 0 6 z" fill={theme.edgeActiveColor} />
              </marker>
            </defs>

            {workflow.edges.map((edge) => (
              <WorkflowEdgeComponent
                key={`${edge.from}-${edge.to}`}
                edge={edge}
                nodePositions={nodePositions}
                isActive={isEdgeActive(edge.from, edge.to)}
                theme={theme}
                entered={entered}
                viewBoxW={VIEWBOX_W}
                viewBoxH={VIEWBOX_H}
              />
            ))}
          </Box>

          {/* Nodes layer */}
          <Box position="absolute" inset={0} zIndex={2}>
            {workflow.nodes.map((node, i) => (
              <WorkflowNodeComponent
                key={node.id}
                node={node}
                isActive={isNodeActive(node.id)}
                theme={theme}
                index={i}
                entered={entered}
              />
            ))}
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
