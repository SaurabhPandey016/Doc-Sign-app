'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DocumentSchema } from '@/types';
import { FileText, Download, Edit3, Loader2, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPortal() {
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<DocumentSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');


  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setErr("Authorization verification failed. Session context is currently unauthenticated.");
      setLoading(false);
      return;
    }

    const fetchUserDocuments = async () => {
      try {
        // Next.js automatically passes secure session cookies with fetch calls to our Express domain
        const response = await fetch('http://localhost:5000/api/documents/my-dashboard', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
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
  }, [user, authLoading]);

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
          <button className="inline-flex items-center gap-2 rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2.5 text-sm font-semibold shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
            <Plus className="h-4 w-4" /> Upload Contract
          </button>
        </div>
      </div>

      {err && (
        <div className="p-4 mb-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-zinc-500 shrink-0" />
          {err}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl mx-auto px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 mx-auto mb-4 border border-zinc-200 dark:border-zinc-800">
            <FileText className="h-5 w-5 text-zinc-500" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No documents found</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
            Your workspace directory is currently empty. Run an upload operation via Postman to display documents here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-sm hover:shadow-md dark:hover:border-zinc-700 transition flex flex-col justify-between p-5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    doc.status === 'COMPLETED' 
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
              
              <div className="flex gap-3 mt-6 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
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
