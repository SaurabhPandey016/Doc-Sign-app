'use client';
import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Lock, CheckCircle } from 'lucide-react';
import { apiUrl } from '@/config/api';

interface ResetProps {
  params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: ResetProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErr('Credential values do not match standard equivalence metrics.');
      return;
    }

    setSubmitting(true);
    setErr('');

    try {
      const response = await fetch(apiUrl(`/api/auth/reset-password/${token}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2500);
      } else {
        const data = await response.json();
        setErr(data.error || 'Server node validation parameters rejected new credential updates.');
      }
    } catch {
      setErr('Communication disruption error mapping transaction pipelines.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 text-black dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-10 shadow-sm">
        
        <div className="mb-8 text-center">
          <h1 className="text-xl font-black tracking-tight">Overwrite Vault Entry Keys</h1>
          <p className="text-xs text-zinc-400 mt-1">Specify your updated password token configuration layer parameters below.</p>
        </div>

        {err && (
          <div className="p-4 mb-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {err}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold flex items-center gap-3 animate-pulse">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Vault keys successfully updated! Redirecting to sign in screen...
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">New Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:border-black dark:focus:border-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Confirm Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:border-black dark:focus:border-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:bg-zinc-100 text-xs font-bold transition shadow cursor-pointer"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm New Password'}
          </button>
        </form>

      </div>
    </div>
  );
}
