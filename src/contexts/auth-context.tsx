'use client';

import { createContext, ReactNode } from 'react';
import { useUser, UserHookResult } from '@/firebase';

// This context is now a pass-through for the Firebase-provided user state.
// We keep it to avoid refactoring all components that use `useAuth` immediately.
// In the future, components can be migrated to use `useUser` from `@/firebase` directly.

export const AuthContext = createContext<UserHookResult | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const userHookResult = useUser();

  return (
    <AuthContext.Provider value={userHookResult}>
      {children}
    </AuthContext.Provider>
  );
};
