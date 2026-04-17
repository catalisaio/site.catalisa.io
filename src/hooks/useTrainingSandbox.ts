import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_PREFIX = 'catalisa_sandbox_';
const DEBOUNCE_MS = 10_000;

export function useTrainingSandbox<T = Record<string, unknown>>(sandboxKey: string, defaultState: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + sandboxKey);
      return raw ? JSON.parse(raw) : defaultState;
    } catch {
      return defaultState;
    }
  });
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load from Supabase on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('training_sandbox_state')
            .select('state')
            .eq('user_id', user.id)
            .eq('sandbox_key', sandboxKey)
            .single();
          if (data?.state) {
            setState(data.state as T);
            localStorage.setItem(STORAGE_PREFIX + sandboxKey, JSON.stringify(data.state));
          }
        }
      } catch {
        // offline-safe
      } finally {
        setLoaded(true);
      }
    })();
  }, [sandboxKey]);

  // Debounced save
  const saveState = useCallback(
    (newState: T) => {
      setState(newState);
      localStorage.setItem(STORAGE_PREFIX + sandboxKey, JSON.stringify(newState));

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('training_sandbox_state').upsert({
              user_id: user.id,
              sandbox_key: sandboxKey,
              state: newState,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,sandbox_key' });
          }
        } catch {
          // offline-safe
        }
      }, DEBOUNCE_MS);
    },
    [sandboxKey],
  );

  const resetState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_PREFIX + sandboxKey);
  }, [sandboxKey, defaultState]);

  return { state, saveState, resetState, loaded };
}
