'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiUrl } from '@/config/api';
import { Rnd } from 'react-rnd';
import SignatureCanvas from 'react-signature-canvas';
import { AlertCircle, CheckCircle2, Loader2, Move } from 'lucide-react';

export default function PublicSignPage() {
  const { token } = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<any>(null);
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');
  const [isPadOpen, setIsPadOpen] = useState(false);
  const [capturedSignature, setCapturedSignature] = useState<string | null>(null);
  const [penColor, setPenColor] = useState('#111827');
  const [submitting, setSubmitting] = useState(false);
  const [sigPosition, setSigPosition] = useState({ x: 56, y: 56 });
  const [sigSize, setSigSize] = useState({ width: 180, height: 70 });
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  const getPreviewBounds = () => {
    const rect = previewRef.current?.getBoundingClientRect();
    return {
      width: Math.max(1, rect?.width || previewSize.width || previewRef.current?.clientWidth || 0),
      height: Math.max(1, rect?.height || previewSize.height || previewRef.current?.clientHeight || 0),
    };
  };

  const clampPosition = (nextX: number, nextY: number, width = sigSize.width, height = sigSize.height) => {
    const { width: previewWidth, height: previewHeight } = getPreviewBounds();
    const maxX = Math.max(0, previewWidth - width);
    const maxY = Math.max(0, previewHeight - height);
    return { x: Math.min(Math.max(nextX, 0), maxX), y: Math.min(Math.max(nextY, 0), maxY) };
  };

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;

    const updatePreviewSize = () => {
      const bounds = node.getBoundingClientRect();
      setPreviewSize({ width: Math.max(1, bounds.width), height: Math.max(1, bounds.height) });
    };

    updatePreviewSize();
    const observer = new ResizeObserver(updatePreviewSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(apiUrl(`/api/documents/public/${token}`));
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

  const handleSaveSignatureInk = () => {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      setErr('Please draw your signature before continuing.');
      return;
    }
    setCapturedSignature(sigPadRef.current.getTrimmedCanvas().toDataURL('image/png'));
    setIsPadOpen(false);
  };

  const updateDecision = async (action: 'SIGNED' | 'REJECTED') => {
    if (action === 'SIGNED' && !capturedSignature) {
      setErr('Draw and insert your signature before submitting.');
      return;
    }

    setErr('');
    setSubmitting(true);
    try {
      const previewBounds = previewRef.current?.getBoundingClientRect();
      const previewWidth = Math.max(1, Math.round(previewBounds?.width || 0));
      const previewHeight = Math.max(1, Math.round(previewBounds?.height || 0));

      const endpoint = action === 'SIGNED'
        ? apiUrl(`/api/documents/public/${token}/sign`)
        : apiUrl(`/api/documents/public/${token}/decision`);

      const body = action === 'SIGNED'
        ? {
            signatureData: capturedSignature,
            coordinates: {
              x_position: Math.round(sigPosition.x),
              y_position: Math.round(sigPosition.y),
              overlay_width: Math.round(sigSize.width),
              overlay_height: Math.round(sigSize.height),
              preview_width: previewWidth,
              preview_height: previewHeight,
            },
            signerEmail: 'external-signer@example.com'
          }
        : { action, reason };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update your decision.');
      setDone(action === 'SIGNED' ? 'Document signed successfully.' : 'Document rejected successfully.');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Unable to update the decision.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center gap-3"><Loader2 className="h-6 w-6 animate-spin" /> <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">Validating secure link...</span></div>;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
          <h1 className="text-2xl font-black text-black dark:text-white">Secure document review</h1>
          <p className="mt-1 text-xs text-zinc-500">Review the PDF, draw your signature, and submit your decision in one secure flow.</p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/80">
            {document && <><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Document</p><h2 className="mt-1 text-lg font-bold text-black dark:text-white">{document.title}</h2><a href={document.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-xl bg-black px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black">Open PDF</a></>}
            <div ref={previewRef} className="mt-5 relative h-105 w-full rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
              {document?.fileUrl ? <iframe src={document.fileUrl} title="Document preview" className="absolute inset-0 h-full w-full border-0" /> : <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500">Loading preview…</div>}
              {capturedSignature && <Rnd size={{ width: sigSize.width, height: sigSize.height }} position={{ x: sigPosition.x, y: sigPosition.y }} onDragStop={(event, data) => setSigPosition(clampPosition(data.x, data.y))} onResizeStop={(event, direction, ref, delta, position) => { const parsedWidth = Number.parseInt(ref.style.width || '', 10) || sigSize.width; const parsedHeight = Number.parseInt(ref.style.height || '', 10) || sigSize.height; const nextSize = { width: Math.min(280, Math.max(100, parsedWidth)), height: Math.min(120, Math.max(40, parsedHeight)) }; setSigSize(nextSize); setSigPosition(clampPosition(position.x, position.y, nextSize.width, nextSize.height)); }} bounds="parent" minWidth={100} minHeight={40} maxWidth={280} maxHeight={120} enableResizing={{ top:false, right:true, bottom:true, left:true, topRight:false, bottomRight:true, bottomLeft:true, topLeft:false }} style={{ touchAction: 'none', zIndex: 30, cursor: 'move' }} className="rounded-2xl border border-zinc-300 bg-white/95 p-1 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-950/95"><div className="absolute -top-6 left-0 flex items-center gap-1 rounded bg-black px-1.5 py-0.5 text-[9px] font-bold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black pointer-events-none"><Move className="h-2.5 w-2.5" /> Drag & size</div><img src={capturedSignature} alt="Signature placement" className="h-full w-full rounded-xl object-contain" /></Rnd>}
            </div>
            <button onClick={() => setIsPadOpen(true)} className="mt-4 w-full rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white dark:bg-white dark:text-black">Draw or update signature</button>
          </section>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/80">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Reason for rejection (optional)</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200" rows={5} placeholder="Add a reason if you are rejecting this document." />
            </div>
            {err && <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"><AlertCircle className="h-4 w-4" />{err}</div>}
            {done && <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4" />{done}</div>}
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => updateDecision('SIGNED')} disabled={submitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white dark:bg-white dark:text-black disabled:cursor-not-allowed disabled:opacity-60">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept & sign'}</button>
              <button onClick={() => updateDecision('REJECTED')} disabled={submitting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}</button>
            </div>
          </aside>
        </div>

        {isPadOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"><div className="border-b border-zinc-100 p-4 dark:border-zinc-800"><h3 className="text-sm font-bold text-black dark:text-white">Draw your signature</h3><p className="text-[11px] text-zinc-400">Use your finger, mouse, or stylus to sign.</p></div><div className="p-5 bg-zinc-50 dark:bg-zinc-950"><div className="h-44 w-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"><SignatureCanvas ref={sigPadRef} penColor={penColor} canvasProps={{ className: 'w-full h-full' }} /></div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 p-4 dark:border-zinc-800"><div className="flex items-center gap-2">{['#111827','#2563eb','#16a34a','#f59e0b','#dc2626'].map((color) => <button key={color} type="button" onClick={() => setPenColor(color)} className={`h-6 w-6 rounded-full border-2 ${penColor === color ? 'border-black dark:border-white scale-110' : 'border-zinc-300 dark:border-zinc-700'}`} style={{ backgroundColor: color }} />)}</div><div className="flex items-center gap-2"><button onClick={() => setIsPadOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white">Cancel</button><button onClick={() => sigPadRef.current?.clear()} className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">Clear</button><button onClick={handleSaveSignatureInk} className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black">Insert signature</button></div></div></div></div>}
      </div>
    </div>
  );
}
