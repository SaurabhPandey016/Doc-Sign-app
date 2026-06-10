'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

export default function AuditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchAudit = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/documents/${id}/audit`, {
          credentials: 'include'
        });
        const raw = await response.text();
        let data: any = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw || 'Server returned an unexpected response.' }; }
        if (!response.ok) throw new Error(data.error || 'Unable to load audit trail.');
        setDocumentTitle(data.document?.title || 'Document');
        setEntries(data.auditEntries || []);
      } catch (error) {
        setErr(error instanceof Error ? error.message : 'Unable to load audit trail.');
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [authLoading, id, router, user]);

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center gap-3"><Loader2 className="h-6 w-6 animate-spin" /> <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">Loading audit trail...</span></div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />Back to dashboard</Link>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-black text-black dark:text-white">Audit Trail</h1>
        <p className="mt-1 text-xs text-zinc-500">{documentTitle}</p>
        {err && <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 p-3 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"><AlertCircle className="h-4 w-4" />{err}</div>}
        <div className="mt-6 space-y-3">
          {entries.length === 0 ? <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-center text-xs text-zinc-500 dark:border-zinc-800">No audit history yet.</div> : entries.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500"><ShieldCheck className="h-3.5 w-3.5" />{entry.action}</div>
                <span className="text-[11px] text-zinc-400">{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">IP: {entry.ipAddress || 'Unknown'}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
