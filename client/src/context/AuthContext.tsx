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
    let cancelled = false;

    const verifySession = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/auth/verify-session', {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) {
          if (!cancelled) setUser(null);
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          setUser((data.sessionUser as UserSession) ?? null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verifySession();
    return () => {
      cancelled = true;
    };
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
      }
    } catch (err) {
      console.error('Failed to commit secure authentication pipeline:', err);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        setUser(null);
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
