'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/types';

interface AuthContextType {
  user: UserSession | null;
  login: (token: string, user: UserSession) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate basic user profiles safely across local browser reloads
    const savedUser = localStorage.getItem('app_user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (token: string, newUser: UserSession) => {
    try {
      const res = await fetch('/api/auth/cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, user: newUser }),
      });

      if (res.ok) {
        setUser(newUser);
        localStorage.setItem('app_user_profile', JSON.stringify(newUser));
      }
    } catch (err) {
      console.error('Failed to commit secure authentication pipeline:', err);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        localStorage.removeItem('app_user_profile');
      }
    } catch (err) {
      console.error('Failed to cleanly drop active authentication session:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be executed within an active AuthProvider container.');
  return context;
}
