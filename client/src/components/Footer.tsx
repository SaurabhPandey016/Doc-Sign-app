import { ExternalLink, Globe, Heart, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white/95 shadow-[0_-12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure signing platform
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">DocuSign.io</h3>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
              A modern document signing experience with secure links, signature placement, and a polished workflow for teams and external signers.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
            <Heart className="h-4 w-4 text-rose-500" />
            Made with love by <span className="font-semibold">Saurabh Pandey</span>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">Contact</h4>
            <ul className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-zinc-500" /> developersaurabh04@gmail.com</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-zinc-500" /> +91 8720026790</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">Social</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://github.com/SaurabhPandey016" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"><Globe className="h-4 w-4" /> GitHub <ExternalLink className="h-3.5 w-3.5 opacity-70" /></a></li>
              <li><a href="https://www.linkedin.com/in/saurabhpandey-/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"><Globe className="h-4 w-4" /> LinkedIn <ExternalLink className="h-3.5 w-3.5 opacity-70" /></a></li>
              <li><a href="https://www.instagram.com/mr._bunny_/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"><Globe className="h-4 w-4" /> Instagram <ExternalLink className="h-3.5 w-3.5 opacity-70" /></a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-zinc-50/70 px-4 py-4 text-center text-[11px] uppercase tracking-[0.25em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
        © 2026 DocuSign.io — Secure document workflows made simple.
      </div>
    </footer>
  );
}
