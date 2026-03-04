import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { WorkflowPreview } from '../../workflow-preview/WorkflowPreview';
import type { WorkflowPreviewData } from '../../workflow-preview/types';
import type { DiagramAnimatedBlock as DiagramAnimatedBlockType } from '../../../data/trainingBlockTypes';

/** Map diagram-animated icon names to WorkflowPreview categories */
const iconToCategory: Record<string, string> = {
  whatsapp: 'WhatsApp',
  message: 'WhatsApp',
  person: 'CRM',
  users: 'CRM',
  flow: 'Logica',
  robot: 'IA',
  cpu: 'IA',
  database: 'Dados',
  server: 'Integracao',
  globe: 'Integracao',
  send: 'WhatsApp',
  target: 'Trigger',
  zap: 'Trigger',
  lightning: 'Trigger',
  check: 'CRM',
  filter: 'Logica',
  edit: 'CRM',
  text: 'IA',
  tools: 'Integracao',
  settings: 'Integracao',
  layers: 'Dados',
  mail: 'WhatsApp',
  smartphone: 'WhatsApp',
};

interface Props {
  block: DiagramAnimatedBlockType;
}

export function DiagramAnimatedBlock({ block }: Props) {
  const workflowData = useMemo<WorkflowPreviewData>(() => {
    // Convert diagram-animated nodes to WorkflowPreview format
    // Original x,y are absolute pixel positions; WorkflowPreview uses percentages (0-100)
    const viewW = block.viewBox?.w || 800;
    const viewH = block.viewBox?.h || 400;

    const nodes = block.nodes.map((n) => {
      const w = n.w || 140;
      const h = n.h || 60;
      // Convert center of node to percentage
      const cx = n.x + w / 2;
      const cy = n.y + h / 2;
      const xPct = (cx / viewW) * 100;
      const yPct = (cy / viewH) * 100;
      // Clean up label: remove \n, keep first line as label
      const label = n.label.replace(/\n/g, ' — ');
      const category = iconToCategory[n.icon || ''] || 'Dados';

      return { id: n.id, label, category, x: xPct, y: yPct };
    });

    const edges = block.edges.map((e) => ({
      from: e.from,
      to: e.to,
      label: e.label,
    }));

    // Build execution order from edges (topological sort)
    const executionOrder = buildExecutionOrder(nodes.map((n) => n.id), edges);

    return {
      id: `diagram-${block.variant}-${nodes.length}`,
      title: '',
      subtitle: '',
      description: '',
      badge: '',
      badgeColor: 'purple',
      nodes,
      edges,
      executionOrder,
    };
  }, [block]);

  return (
    <Box
      w="full"
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.100"
      bg="white"
      p={{ base: 4, md: 6 }}
      boxShadow="sm"
      overflow="hidden"
    >
      <WorkflowPreview workflow={workflowData} variant="light" autoPlay />
    </Box>
  );
}

/** Simple topological sort to derive execution order from edges */
function buildExecutionOrder(nodeIds: string[], edges: { from: string; to: string }[]): (string | string[])[] {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  for (const id of nodeIds) {
    inDegree[id] = 0;
    adj[id] = [];
  }
  for (const e of edges) {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (inDegree[e.to] !== undefined) inDegree[e.to]++;
  }

  const order: (string | string[])[] = [];
  const remaining = new Set(nodeIds);

  while (remaining.size > 0) {
    // Find all nodes with in-degree 0
    const ready = [...remaining].filter((id) => inDegree[id] === 0);
    if (ready.length === 0) break; // cycle guard

    if (ready.length === 1) {
      order.push(ready[0]);
    } else {
      order.push(ready);
    }

    for (const id of ready) {
      remaining.delete(id);
      for (const next of adj[id] || []) {
        inDegree[next]--;
      }
    }
  }

  return order;
}
