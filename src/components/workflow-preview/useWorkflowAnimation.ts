import { useState, useEffect, useCallback, useRef } from 'react';
import type { WorkflowPreviewData, WorkflowEdge } from './types';

interface AnimationState {
  activeNodes: Set<string>;
  activeEdges: Set<string>;
  entered: boolean;
}

function edgeKey(from: string, to: string): string {
  return `${from}->${to}`;
}

function getEdgesForStep(
  stepNodeIds: string[],
  edges: WorkflowEdge[],
  previousNodeIds: string[],
): string[] {
  const result: string[] = [];
  for (const edge of edges) {
    if (
      stepNodeIds.includes(edge.to) && previousNodeIds.includes(edge.from)
    ) {
      result.push(edgeKey(edge.from, edge.to));
    }
  }
  return result;
}

export function useWorkflowAnimation(
  workflow: WorkflowPreviewData | null,
  options: { autoPlay?: boolean; stepDuration?: number; pauseDuration?: number } = {},
) {
  const { autoPlay = true, stepDuration = 700, pauseDuration = 2000 } = options;

  const [state, setState] = useState<AnimationState>({
    activeNodes: new Set(),
    activeEdges: new Set(),
    entered: false,
  });

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (cycleRef.current) {
      clearTimeout(cycleRef.current);
      cycleRef.current = null;
    }
  }, []);

  const runCycle = useCallback(() => {
    if (!workflow || !mountedRef.current) return;

    const { executionOrder, edges } = workflow;
    let delay = 0;
    let previousStepIds: string[] = [];

    // Clear active state
    setState(s => ({
      ...s,
      activeNodes: new Set(),
      activeEdges: new Set(),
    }));

    // Small initial delay
    delay += 300;

    executionOrder.forEach((step) => {
      const stepIds = Array.isArray(step) ? step : [step];
      const capturedPreviousIds = [...previousStepIds];

      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        const edgeKeys = getEdgesForStep(stepIds, edges, capturedPreviousIds);

        setState(s => ({
          ...s,
          activeNodes: new Set(stepIds),
          activeEdges: new Set(edgeKeys),
        }));
      }, delay);

      timeoutsRef.current.push(t);
      delay += stepDuration;
      previousStepIds = stepIds;
    });

    // Clear at end + schedule next cycle
    const clearT = setTimeout(() => {
      if (!mountedRef.current) return;
      setState(s => ({
        ...s,
        activeNodes: new Set(),
        activeEdges: new Set(),
      }));
    }, delay);
    timeoutsRef.current.push(clearT);

    cycleRef.current = setTimeout(() => {
      if (mountedRef.current) runCycle();
    }, delay + pauseDuration);
  }, [workflow, stepDuration, pauseDuration]);

  // Entry animation + auto-play
  useEffect(() => {
    mountedRef.current = true;
    clearTimeouts();

    if (!workflow) {
      setState({ activeNodes: new Set(), activeEdges: new Set(), entered: false });
      return;
    }

    // Entry: fade in nodes (via entered flag)
    const entryT = setTimeout(() => {
      if (!mountedRef.current) return;
      setState(s => ({ ...s, entered: true }));

      // Start execution animation after entry completes
      if (autoPlay) {
        const startT = setTimeout(() => {
          if (mountedRef.current) runCycle();
        }, 800);
        timeoutsRef.current.push(startT);
      }
    }, 100);
    timeoutsRef.current.push(entryT);

    return () => {
      mountedRef.current = false;
      clearTimeouts();
    };
  }, [workflow, autoPlay, clearTimeouts, runCycle]);

  const isNodeActive = useCallback(
    (nodeId: string) => state.activeNodes.has(nodeId),
    [state.activeNodes],
  );

  const isEdgeActive = useCallback(
    (from: string, to: string) => state.activeEdges.has(edgeKey(from, to)),
    [state.activeEdges],
  );

  return {
    entered: state.entered,
    isNodeActive,
    isEdgeActive,
  };
}
