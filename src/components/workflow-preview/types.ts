export interface WorkflowNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowPreviewData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  executionOrder: (string | string[])[];
}

export interface WorkflowTheme {
  nodeBg: string;
  nodeBorder: string;
  nodeText: string;
  edgeColor: string;
  edgeActiveColor: string;
  containerBg: string;
}

export const darkTheme: WorkflowTheme = {
  nodeBg: 'rgba(17,24,32,0.8)',
  nodeBorder: 'whiteAlpha.200',
  nodeText: 'whiteAlpha.900',
  edgeColor: 'rgba(255,255,255,0.15)',
  edgeActiveColor: '#9F7AEA',
  containerBg: 'transparent',
};

export const lightTheme: WorkflowTheme = {
  nodeBg: 'white',
  nodeBorder: 'gray.200',
  nodeText: 'gray.700',
  edgeColor: 'rgba(0,0,0,0.1)',
  edgeActiveColor: '#805AD5',
  containerBg: 'white',
};
