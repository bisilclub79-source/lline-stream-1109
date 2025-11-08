'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { type User } from '@/lib/types';
import { getUserById } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  signup: (displayName: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const storedUserId = localStorage.getItem('cinestream-user');
        if (storedUserId) {
          const userData = await getUserById(storedUserId);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (userId: string) => {
    setLoading(true);
    const userData = await getUserById(userId);
    if (userData) {
      setUser(userData);
      localStorage.setItem('cinestream-user', userId);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinestream-user');
  };

  // Mock signup, just logs in the "free user" for demonstration
  const signup = async (displayName: string) => {
    setLoading(true);
    const freeUser = await getUserById('user-free-new');
     if (freeUser) {
        const newUser = { ...freeUser, displayName };
        setUser(newUser);
        localStorage.setItem('cinestream-user', newUser.id);
    }
    setLoading(false);
  }

  const value = { user, loading, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
