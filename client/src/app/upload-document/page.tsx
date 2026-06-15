'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { apiUrl } from '@/config/api';
import { 
  UploadCloud, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  FileCheck 
} from 'lucide-react';

export default function UploadDocumentPortal() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  // Enforce validation bounds on file drop actions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr('');
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setErr('Invalid file format. Only structural PDF document configurations are permitted.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErr('File size restriction exceeded. Maximum allowable envelope limit is 10MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUploadTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErr('Please select a valid PDF file stream to dispatch.');
      return;
    }

    setSubmitting(true);
    setErr('');

    // Form data generation wrapper to package file buffers for Multer streams
    const uploadPacket = new FormData();
    uploadPacket.append('file', file);

    try {
      const response = await fetch(apiUrl('/api/documents/upload'), {
        method: 'POST',
        body: uploadPacket,
        credentials: 'include' // COOKIE SETUP: Automatically appends validation state
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setErr(data.error || 'Server validation pipeline rejected your document payload.');
      }
    } catch {
      setErr('Communication disruption. Failed to connect with backend storage cluster node routers.');
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-black dark:text-white animate-spin" />
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Verifying pipeline session...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-black dark:text-white">
      
      {/* Upper Navigation Row */}
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="mb-8">
          <h1 className="text-xl font-black tracking-tight">Upload New Contract</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Publish execution-ready contracts directly into your secure Supabase Cloud Storage vault buckets.
          </p>
        </div>

        {err && (
          <div className="p-4 mb-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {err}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold flex items-center gap-3 animate-pulse">
            <FileCheck className="h-4 w-4 shrink-0" />
            Document registered and uploaded successfully! Syncing dashboard...
          </div>
        )}

        <form onSubmit={handleUploadTransaction} className="space-y-6">
          
          {/* Interaction Upload Dropbox Frame Element */}
          <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition flex flex-col items-center justify-center group">
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={submitting || success}
            />
            
            <UploadCloud className="h-8 w-8 text-zinc-400 group-hover:scale-105 transition duration-200 mb-3" />
            
            {file ? (
              <div className="z-20 pointer-events-none">
                <p className="text-xs font-bold text-black dark:text-white truncate max-w-md">
                  {file.name}
                </p>
                <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="pointer-events-none">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Drag and drop your document here, or <span className="text-black dark:text-white underline decoration-zinc-400">browse files</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">Supported formats: PDF architecture pools up to 10MB</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!file || submitting || success}
              className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-xs font-bold transition shadow cursor-pointer"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Dispatch Payload to Cloud Vault'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
