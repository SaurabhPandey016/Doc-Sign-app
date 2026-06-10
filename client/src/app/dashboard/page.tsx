'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DocumentSchema } from '@/types';
import { FileText, Download, Edit3, Loader2, AlertCircle, Plus, Trash2, ShieldCheck, Clock3, BadgeAlert, Send } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPortal() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<DocumentSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SIGNED' | 'REJECTED'>('ALL');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchUserDocuments = async () => {
      try {
        // COOKIE SETUP: credentials 'include' automatically routes your secure httpOnly session cookies to Express
        const response = await fetch('http://localhost:5000/api/documents/my-dashboard', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          setDocuments(data.documents || []);
        } else {
          setErr(data.error || 'Failed to populate dashboard file grid configuration.');
        }
      } catch (networkError) {
        setErr('Unable to connect with Express. Ensure your backend server is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDocuments();
  }, [user, authLoading, router]);

  const handleShare = async (documentId: string) => {
    const targetDocument = documents.find((item) => item.id === documentId);

    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: user?.email })
      });

      const rawText = await response.text();
      let data = {} as any;
      try { data = rawText ? JSON.parse(rawText) : {}; } catch { data = { error: rawText || 'Server responded with an unexpected format.' }; }

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create the public signature link.');
      }

      const shareUrl = data.shareUrl || targetDocument?.fileUrl || '';
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage(`Secure link copied to clipboard for ${documentId.slice(0, 8)}.`);
    } catch (shareError) {
      try {
        const fallbackUrl = targetDocument?.fileUrl || '';
        if (fallbackUrl) {
          await navigator.clipboard.writeText(fallbackUrl);
          setShareMessage('Document download link copied instead because the share route is currently unavailable.');
          return;
        }
      } catch {
        // ignore and continue to show the error below
      }

      setErr(shareError instanceof Error ? shareError.message : 'Unable to share this document.');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Remove this document from your workspace?')) return;

    setDeletingId(documentId);
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErr(data.error || 'Unable to delete this document.');
        return;
      }

      setDocuments((prev) => prev.filter((document) => document.id !== documentId));
    } catch {
      setErr('Unable to remove this document right now.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocuments = statusFilter === 'ALL'
    ? documents
    : documents.filter((document) => document.status === statusFilter);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-black dark:text-white animate-spin" />
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Synchronizing console metadata...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Upper Action Banner Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-black dark:text-white">
            Document Center
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Review status processing tracks, legal transaction assets, and execution metrics.
          </p>
        </div>
        <div>
          <Link href="/upload-document" className="inline-flex items-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2.5 text-sm font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer">
            <Plus className="h-4 w-4" /> Upload Contract
          </Link>
        </div>
      </div>

      {err && (
        <div className="p-4 mb-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-zinc-500 shrink-0" />
          {err}
        </div>
      )}

      {shareMessage && (
        <div className="p-4 mb-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          {shareMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {(['ALL', 'PENDING', 'SIGNED', 'REJECTED'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition ${statusFilter === filter ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl mx-auto px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 mx-auto mb-4 border border-zinc-200 dark:border-zinc-800">
            <FileText className="h-5 w-5 text-zinc-500" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No documents found</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
            Your workspace directory is currently empty. Run an upload operation to display documents here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-sm hover:shadow-md dark:hover:border-zinc-700 transition flex flex-col justify-between p-5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* FIXED: Compares against 'SIGNED' instead of 'COMPLETED' to stay perfectly aligned with your Prisma schema enum */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    doc.status === 'SIGNED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                  }`}>
                    {doc.status}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-400">
                    {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition line-clamp-1 mb-1">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate tracking-tight">{doc.id}</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="col-span-2 inline-flex items-center justify-center gap-1.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => handleShare(doc.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <Send className="h-3.5 w-3.5" /> Share
                </button>
                <Link
                  href={`/audit/${doc.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Audit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <Link 
                  href={`/workspace/${doc.id}`} 
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Sign Pad
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
