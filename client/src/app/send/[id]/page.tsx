'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { apiUrl } from '@/config/api';

export default function SendDocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [documentTitle, setDocumentTitle] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchDocument = async () => {
      try {
        const response = await fetch(apiUrl(`/api/documents/${id}`), {
          credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load this document.');
        setDocumentTitle(data.document.title);
        setEmail(user.email);
      } catch (error) {
        setErr(error instanceof Error ? error.message : 'Unable to load this document.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [authLoading, id, router, user]);

  const handleSend = async () => {
    setErr('');
    setSuccess('');
    setSending(true);

    try {
      const response = await fetch(apiUrl(`/api/documents/${id}/share`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() || user?.email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to send the signing link.');

      setSuccess(`Secure signing invitation sent to ${email.trim() || user?.email}. Link expires in 7 days.`);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Unable to send the signing link.');
    } finally {
      setSending(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center gap-3"><Loader2 className="h-6 w-6 animate-spin" /> <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">Preparing signature invite...</span></div>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />Back to dashboard</Link>
          <h1 className="mt-4 text-2xl font-black text-black dark:text-white">Send a signature request</h1>
          <p className="mt-1 text-xs text-zinc-500">Create a professional, tokenized invitation that expires after 7 days.</p>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/80">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400"><Mail className="h-4 w-4" />Recipient details</div>
            <label className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Signer email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm outline-none ring-0 transition focus:border-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-white"
              placeholder="name@company.com"
            />
            <p className="mt-2 text-[11px] text-zinc-500">The secure link will be emailed to this address with a 7-day expiry window.</p>
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <p className="font-semibold">Document</p>
              <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">{documentTitle}</p>
            </div>
          </section>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400"><ShieldCheck className="h-4 w-4" />What happens next</div>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <li>• The signer receives a secure email with a tokenized link.</li>
              <li>• The link is valid for 7 days from the sending moment.</li>
              <li>• The signer can accept, reject, or sign the PDF without logging in.</li>
            </ul>
            {err && <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"><AlertCircle className="h-4 w-4" />{err}</div>}
            {success && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"><CheckCircle2 className="h-4 w-4" />{success}</div>}
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send signing invitation'}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
