'use client';

import { useMemo } from 'react';
import { useFirebase, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { type User as AuthUser } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { type User as FirestoreUser } from '@/lib/types';

export interface MergedUser extends AuthUser, Omit<FirestoreUser, 'id'> {}

export interface UseUserResult {
  user: MergedUser | null;
  isLoading: boolean;
  error: Error | null;
}

export function useUser(): UseUserResult {
  const { user: authUser, isUserLoading: isAuthLoading, userError: authError } = useFirebase();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser?.uid) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser?.uid]);

  const { data: firestoreUser, isLoading: isFirestoreLoading, error: firestoreError } = useDoc<FirestoreUser>(userDocRef);

  const isLoading = isAuthLoading || isFirestoreLoading;

  const user = useMemo((): MergedUser | null => {
    if (isLoading || !authUser || !firestoreUser) {
      return null;
    }
    // Merge auth user with firestore user data.
    // Auth user is the source of truth for uid, email, displayName, photoURL.
    // Firestore user is the source of truth for everything else.
    return {
      ...authUser,
      ...firestoreUser,
    };
  }, [authUser, firestoreUser, isLoading]);

  return {
    user,
    isLoading,
    error: authError || firestoreError,
  };
}
