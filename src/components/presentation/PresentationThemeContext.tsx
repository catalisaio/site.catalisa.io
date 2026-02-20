import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getPresentationColors, type PresentationColors } from './presentationTheme';

type PresentationMode = 'dark' | 'light';

interface PresentationThemeContextValue {
  mode: PresentationMode;
  colors: PresentationColors;
  toggleMode: () => void;
}

const STORAGE_KEY = 'catalisa-presentation-mode';

const PresentationThemeContext = createContext<PresentationThemeContextValue | null>(null);

function getInitialMode(): PresentationMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* SSR / privacy mode */ }
  return 'light';
}

export function PresentationThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PresentationMode>(getInitialMode);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch { /* ignore */ }
  }, [mode]);

  // Keyboard shortcut: T to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleMode]);

  const colors = getPresentationColors(mode === 'dark');

  return (
    <PresentationThemeContext.Provider value={{ mode, colors, toggleMode }}>
      {children}
    </PresentationThemeContext.Provider>
  );
}

export function usePresentationTheme(): PresentationThemeContextValue {
  const ctx = useContext(PresentationThemeContext);
  if (!ctx) throw new Error('usePresentationTheme must be used within PresentationThemeProvider');
  return ctx;
}

export function usePresentationColors(): PresentationColors {
  return usePresentationTheme().colors;
}
