'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function PublicSignPage() {
  const { token } = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/documents/public/${token}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'This link is invalid.');
        setDocument(data.document);
      } catch (error) {
        setErr(error instanceof Error ? error.message : 'Unable to open this signature link.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const updateDecision = async (action: 'SIGNED' | 'REJECTED') => {
    setErr('');
    try {
      const response = await fetch(`http://localhost:5000/api/documents/public/${token}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update your decision.');
      setDone(action === 'SIGNED' ? 'Document marked as signed.' : 'Document marked as rejected.');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Unable to update the decision.');
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3"><Loader2 className="h-6 w-6 animate-spin" /> <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">Validating secure link...</span></div>;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-black text-black dark:text-white">External Signature Review</h1>
        <p className="mt-1 text-xs text-zinc-500">Review the document and choose whether to accept or reject the signature request.</p>
        {err && <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 p-3 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"><AlertCircle className="h-4 w-4" />{err}</div>}
        {done && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"><ShieldCheck className="h-4 w-4" />{done}</div>}
        {document && <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/80"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Document</p><h2 className="mt-1 text-lg font-bold text-black dark:text-white">{document.title}</h2><a href={document.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black">Open PDF</a></div>}
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Reason for rejection (optional)</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200" rows={4} placeholder="Add a reason if you are rejecting this document." />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => updateDecision('SIGNED')} className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black">Accept & Sign</button>
          <button onClick={() => updateDecision('REJECTED')} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">Reject</button>
        </div>
      </div>
    </div>
  );
}
