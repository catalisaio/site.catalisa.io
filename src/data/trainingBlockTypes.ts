// Content Block Type Definitions for Catalisa Academy
// Extends the original 5 block types with 12 new interactive types

// ─── Original Block Types ───────────────────────────────────────────

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface HeadingBlock {
  type: 'heading';
  text: string;
  level?: 'h2' | 'h3' | 'h4';
}

export interface ListBlock {
  type: 'list';
  items: string[];
  ordered?: boolean;
}

export interface AlertBlock {
  type: 'alert';
  text: string;
  alertStatus?: 'info' | 'warning' | 'success' | 'error';
}

export interface CodeBlock {
  type: 'code';
  text: string;
  language?: string;
}

// ─── New Simple Block Types ─────────────────────────────────────────

export interface CalloutBlock {
  type: 'callout';
  variant: 'tip' | 'warning' | 'pro-tip' | 'important' | 'exercise';
  title?: string;
  text: string;
}

export interface AccordionFAQBlock {
  type: 'accordion-faq';
  items: { question: string; answer: string }[];
}

export interface ComparisonTableBlock {
  type: 'comparison-table';
  columns: { label: string; highlighted?: boolean }[];
  rows: { feature: string; values: (string | boolean)[] }[];
}

export interface VideoBlock {
  type: 'video';
  src: string;
  poster: string;
  showBrowserFrame?: boolean;
  browserFrameUrl?: string;
}

export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  maxW?: string;
}

export interface DividerBlock {
  type: 'divider';
  variant?: 'solid' | 'dashed' | 'dotted';
}

// ─── Interactive Block Types ────────────────────────────────────────

export interface StepByStepBlock {
  type: 'step-by-step';
  steps: {
    title: string;
    description: string;
    image?: string;
    highlightArea?: { x: number; y: number; w: number; h: number };
  }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export interface DiagramAnimatedBlock {
  type: 'diagram-animated';
  variant: 'flow' | 'architecture' | 'sequence' | 'data-flow';
  nodes: {
    id: string;
    label: string;
    icon?: string;
    color?: string;
    x: number;
    y: number;
    w?: number;
    h?: number;
  }[];
  edges: {
    from: string;
    to: string;
    label?: string;
    animated?: boolean;
  }[];
  viewBox?: { w: number; h: number };
}

export interface QuizBlock {
  type: 'quiz';
  quizId: string;
  variant: 'multiple-choice' | 'true-false' | 'drag-drop' | 'fill-blank';
  question: string;
  // multiple-choice / true-false
  options?: { label: string; value: string }[];
  correctAnswer?: string;
  // drag-drop
  items?: string[];
  correctOrder?: string[];
  categories?: { name: string; correctItems: string[] }[];
  // fill-blank
  template?: string; // "O trigger {{blank}} dispara quando..."
  blanks?: { id: string; correctValues: string[] }[];
  // shared
  explanation?: string;
  xpBonus?: number;
}

export type MockUIVariant =
  | 'leads-table'
  | 'leads-kanban'
  | 'agent-form'
  | 'agent-chat'
  | 'workflow-canvas'
  | 'custom-action-form'
  | 'whatsapp-chat'
  | 'dashboard'
  | 'ai-assistant'
  | 'settings';

export interface InteractionStep {
  targetId: string;
  instruction: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface MockUIBlock {
  type: 'mockui';
  variant: MockUIVariant;
  url?: string;
  interactionSteps?: InteractionStep[];
  initialData?: Record<string, unknown>;
}

export type SandboxVariant =
  | 'variable-interpolation'
  | 'agent-config'
  | 'workflow-builder'
  | 'custom-action'
  | 'trigger-config'
  | 'webhook-config';

export interface SandboxBlock {
  type: 'sandbox';
  variant: SandboxVariant;
  instructions: string;
  validation?: {
    type: 'exact' | 'contains' | 'custom';
    expected?: unknown;
  };
  solution?: Record<string, unknown>;
  xpReward?: number;
}

export interface InteractiveDemoBlock {
  type: 'interactive-demo';
  title: string;
  scenarios: {
    id: string;
    label: string;
    description: string;
    steps: {
      instruction: string;
      action: string;
      feedback: string;
    }[];
  }[];
}

// ─── Union Type ─────────────────────────────────────────────────────

export type ContentBlock =
  // Original
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | AlertBlock
  | CodeBlock
  // New simple
  | CalloutBlock
  | AccordionFAQBlock
  | ComparisonTableBlock
  | VideoBlock
  | ImageBlock
  | DividerBlock
  // Interactive
  | StepByStepBlock
  | DiagramAnimatedBlock
  | QuizBlock
  | MockUIBlock
  | SandboxBlock
  | InteractiveDemoBlock;
