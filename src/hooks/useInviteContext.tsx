import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PresentationInvite } from '../lib/invites';

interface InviteContextValue {
  invite: PresentationInvite | null;
  setInvite: (invite: PresentationInvite | null) => void;
  clear: () => void;
}

const InviteContext = createContext<InviteContextValue>({
  invite: null,
  setInvite: () => {},
  clear: () => {},
});

export function InviteProvider({ children }: { children: ReactNode }) {
  const [invite, setInviteState] = useState<PresentationInvite | null>(null);

  const setInvite = useCallback((inv: PresentationInvite | null) => {
    setInviteState(inv);
  }, []);

  const clear = useCallback(() => {
    setInviteState(null);
  }, []);

  return (
    <InviteContext.Provider value={{ invite, setInvite, clear }}>
      {children}
    </InviteContext.Provider>
  );
}

export function useInviteContext() {
  return useContext(InviteContext);
}
