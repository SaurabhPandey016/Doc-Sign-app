'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { apiUrl } from '@/config/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setErr('');

    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setErr(data.error || 'Server rejected request transmission sequence.');
      }
    } catch {
      setErr('Communication breakdown with authentication network cluster routes.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 text-black dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-10 shadow-sm">
        
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-black dark:hover:text-white transition">
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-xl font-black tracking-tight">Recover Account Access</h1>
          <p className="text-xs text-zinc-400 mt-1">Provide your verified account email string to dispatch a security transaction reset link.</p>
        </div>

        {err && (
          <div className="p-4 mb-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {err}
          </div>
        )}

        {success ? (
          <div className="p-5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold flex flex-col gap-2 items-center text-center animate-pulse">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>Reset Instructions Dispatched!</span>
            <p className="font-normal text-[11px] opacity-80 max-w-xs">Check your standard email application folders to trigger verification updates.</p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Account Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:border-black dark:focus:border-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:bg-zinc-100 text-xs font-bold transition shadow cursor-pointer"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
