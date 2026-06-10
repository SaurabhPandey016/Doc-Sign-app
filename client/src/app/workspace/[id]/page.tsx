'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rnd } from 'react-rnd';
import SignatureCanvas from 'react-signature-canvas';
import { 
  Loader2, 
  Move, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  Trash2 
} from 'lucide-react';

export default function WorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Primary Workspace Component State Tracking
  const [documentTitle, setDocumentTitle] = useState('Loading contract context...');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);

  // Interactive Signature Modality States
  const [isPadOpen, setIsPadOpen] = useState(false);
  const [capturedSignature, setCapturedSignature] = useState<string | null>(null);
  const [documentFileUrl, setDocumentFileUrl] = useState<string | null>(null);
  const [penColor, setPenColor] = useState('#111827');
  
  // Real-time Coordinate Placement Tracking
  const [sigPosition, setSigPosition] = useState({ x: 50, y: 50 });
  const [sigSize, setSigSize] = useState({ width: 150, height: 60 });

  // Lifecycle Hook to Fetch Document Meta Context from Express backend
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchWorkspaceDocument = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setDocumentTitle(data.document.title);
          // Store pdf url for preview
          setDocumentFileUrl(data.document.fileUrl);
        } else {
          setErr(data.error || 'Failed to retrieve requested asset.');
        }
      } catch {
        setErr('Unable to reach Express backend cluster pipelines.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaceDocument();
  }, [id, user, authLoading]);

  // Handle saving ink data from the canvas pad
  const handleSaveSignatureInk = () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      alert('Please provide an authentic handwritten signature trace first.');
      return;
    }
    const base64Data = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
    setCapturedSignature(base64Data);
    setIsPadOpen(false);
  };

  // Dispatch final signed coordinates payload data back to Express Database
  const commitSignature = async () => {
    setSubmitting(true);
    setErr('');
    try {
      const previewBounds = previewRef.current?.getBoundingClientRect();
      const previewWidth = Math.max(1, Math.round(previewBounds?.width || 0));
      const previewHeight = Math.max(1, Math.round(previewBounds?.height || 0));

      const response = await fetch(`http://localhost:5000/api/documents/${id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          signatureData: capturedSignature,
          coordinates: {
            x_position: Math.round(sigPosition.x),
            y_position: Math.round(sigPosition.y),
            overlay_width: Math.round(sigSize.width),
            overlay_height: Math.round(sigSize.height),
            preview_width: previewWidth,
            preview_height: previewHeight
          }
        })
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        const data = await response.json();
        setErr(data.error || 'Failed to execute signature sequence.');
      }
    } catch {
      setErr('Network disruption occurred while writing transaction logs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 text-black dark:text-white animate-spin" />
        <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Mounting Sign Workspace...</p>
      </div>
    );
  }

//   Part -2
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950 flex flex-col lg:flex-row">
      
      {/* LEFT SECTION: Document Canvas Viewer */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
        
        {/* Workspace Mini Title Bar Component */}
        <div className="w-full max-w-3xl flex items-center justify-between mb-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Hub
          </Link>
          <span className="text-xs font-bold text-zinc-400 truncate max-w-xs">
            {documentTitle}
          </span>
        </div>
        
          {/* Document Rendering Frame Window */}
        <div
          ref={previewRef}
          className="relative w-full max-w-3xl h-[70vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center"
        >
          {documentFileUrl ? (
            // Preview the uploaded PDF (Supabase public url)
            <iframe
              src={documentFileUrl}
              title="Document Preview"
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : (
            <div className="absolute inset-0 p-12 text-zinc-300 dark:text-zinc-800 select-none pointer-events-none font-serif text-sm leading-relaxed overflow-hidden">
              <h2 className="text-zinc-400 dark:text-zinc-700 text-lg font-bold mb-6 font-sans">Loading document...</h2>
              <p className="mb-4">Preparing your uploaded PDF preview for signature placement.</p>
            </div>
          )}

          {/* Draggable and Resizable Signature Asset Overlay */}
          {capturedSignature && (
            <Rnd
              size={{ width: sigSize.width, height: sigSize.height }}
              position={{ x: sigPosition.x, y: sigPosition.y }}
              onDragStop={(e, d) => setSigPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, pos) => {
                setSigSize({ width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
                setSigPosition(pos);
              }}
              bounds="parent" minWidth={100} minHeight={40} maxWidth={300} maxHeight={120}
              className="z-30 group cursor-move rounded-2xl border border-zinc-300 bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-md p-1 flex items-center justify-center dark:border-zinc-700 dark:bg-zinc-950/95"
            >
              <div className="absolute -top-6 left-0 bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                <Move className="h-2.5 w-2.5" /> Drag & Size Signature
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedSignature} alt="Signature Stamp" className="w-full h-full object-contain rounded-xl pointer-events-none select-none" />
            </Rnd>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Control & Telemetry Panel */}
      <div className="w-full lg:w-96 bg-white dark:bg-zinc-900 border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Execution Panel</h3>
            <h2 className="text-xl font-black text-black dark:text-white mt-1">Finalize Contract</h2>
            <p className="text-xs text-zinc-500 mt-1">Generate your handwritten signature stamp, position it on the document, and commit execution metrics.</p>
          </div>

          {err && (
            <div className="p-3.5 mb-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0" />
              {err}
            </div>
          )}

          {success && (
            <div className="p-3.5 mb-5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold flex items-center gap-2.5 animate-pulse">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Contract signed successfully! Routing...
            </div>
          )}

          <div className="space-y-4">
            {!capturedSignature ? (
              <button
                onClick={() => setIsPadOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black py-3 text-xs font-bold shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              >
                Create Digital Signature
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Layers className="h-3 w-3" /> Coordinates Map
                  </span>
                  <button 
                    onClick={() => setCapturedSignature(null)} 
                    className="text-zinc-400 hover:text-red-500 transition"
                    title="Flush Signature"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-500">
                  <div>X-Offset: {Math.round(sigPosition.x)}px</div>
                  <div>Y-Offset: {Math.round(sigPosition.y)}px</div>
                  <div>Width: {Math.round(sigSize.width)}px</div>
                  <div>Height: {Math.round(sigSize.height)}px</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
          <button
            onClick={commitSignature}
            disabled={!capturedSignature || submitting || success}
            className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-xs font-bold transition shadow"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Complete & Close File'}
          </button>
        </div>
      </div>

      {/* OVERLAY: Pop-up Signature Canvas Dialog Box */}
      {isPadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-black dark:text-white">Draw Signature Identity</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Use your pointer or stylus to write inside the pad container box.</p>
            </div>
            
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex justify-center">
              <div className="w-full h-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-inner cursor-crosshair">
                <SignatureCanvas
                  ref={sigPadRef}
                  penColor={penColor}
                  canvasProps={{ className: 'w-full h-full min-h-[174px] bg-white dark:bg-zinc-900' }}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-100/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {['#111827', '#2563eb', '#16a34a', '#f59e0b', '#dc2626'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setPenColor(color)}
                    className={`h-6 w-6 rounded-full border-2 transition ${penColor === color ? 'border-black dark:border-white scale-110' : 'border-zinc-300 dark:border-zinc-700'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Use ${color} ink`}
                  />
                ))}
                <span className="text-[11px] font-semibold text-zinc-500">Choose signature color</span>
              </div>
              <div className="flex items-center justify-end gap-3">
              <button onClick={() => setIsPadOpen(false)} className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white transition">
                Cancel
              </button>
              <button onClick={() => sigPadRef.current?.clear()} className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                Clear Ink
              </button>
                <button onClick={handleSaveSignatureInk} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold transition shadow">
                  Insert Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
