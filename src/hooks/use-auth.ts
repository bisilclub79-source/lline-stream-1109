'use client';

// This custom hook remains as a bridge to the new system.
// Components using useAuth() will now get the real-time user
// state from the Firebase Provider.

import { useContext } from 'react';
import { FirebaseContext, UserHookResult } from '@/firebase';

export const useAuth = (): UserHookResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return {
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};
