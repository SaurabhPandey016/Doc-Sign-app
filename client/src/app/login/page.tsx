'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Instructs the browser to store the secure HttpOnly cookie
      });

      const data = await response.json();

      if (response.ok) {
        await login(data.user);
        router.push('/dashboard');
      } else {
        setErr(data.error || 'Identity parameters invalid or missing profiles.');
      }
    } catch {
      setErr('Communication disruption error mapping secure session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 text-black dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-10 shadow-sm">
        
        <div className="mb-8 text-center">
          <h1 className="text-xl font-black tracking-tight">Authenticate Access</h1>
          <p className="text-xs text-zinc-400 mt-1">Unlock application workspace elements securely via cookie vectors.</p>
        </div>

        {err && (
          <div className="p-4 mb-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {err}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Email Identity</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@production.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">Vault Secure Key</label>
              <Link href="/forgot-password" style={{ fontSize: '11px' }} className="text-zinc-400 font-medium hover:text-black dark:hover:text-white transition underline">
                Recover Vault Link?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:bg-zinc-100 text-xs font-bold transition shadow cursor-pointer mt-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock Workspace Portal'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Missing an identity mapping?{' '}
          <Link href="/register" className="text-black dark:text-white font-bold hover:underline">
            Provision Profile
          </Link>
        </p>

      </div>
    </div>
  );
}
