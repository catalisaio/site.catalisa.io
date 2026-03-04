import { keyframes } from '@emotion/react';

export const pulseHighlight = keyframes`
  0%, 100% { box-shadow: 0 0 0 3px rgba(115,75,156,0.4); }
  50% { box-shadow: 0 0 0 6px rgba(115,75,156,0.15); }
`;

export interface MockScreenProps {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
  onStepAction?: () => void;
}

/**
 * Returns props to spread onto a Chakra element for step highlighting.
 * Usage: <Box {...hp(activeStepId, 'element-id', onStepAction)} />
 */
export function hp(
  activeStepId: string | undefined,
  elementId: string,
  onStepAction?: () => void,
) {
  const active = activeStepId === elementId;
  if (!active) return { id: elementId };
  return {
    id: elementId,
    animation: `${pulseHighlight} 1.5s ease-in-out infinite`,
    cursor: 'pointer' as const,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onStepAction?.();
    },
  };
}
