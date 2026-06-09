'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/types';

interface AuthContextType {
  user: UserSession | null;
  login: (user: UserSession) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/verify-session', {
        method: 'GET',
        credentials: 'include'
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser((data.sessionUser as UserSession) ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      if (cancelled) return;
      await refreshSession();
      if (cancelled) return;
    };

    verifySession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (newUser: UserSession) => {
    try {
      await refreshSession();
      setUser(newUser);
    } catch (err) {
      console.error('Failed to commit secure authentication pipeline:', err);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Failed to cleanly drop active authentication session:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be executed within an active AuthProvider container.');
  return context;
}
