'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, FileText, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f4f5_45%,#fafafa_100%)] dark:bg-[radial-gradient(circle_at_top,#09090b_0%,#111827_45%,#09090b_100%)] text-black dark:text-white">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5" /> Secure document workflow
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
          Upload, review, and sign documents from one reliable workspace.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-zinc-600 dark:text-zinc-300 sm:text-lg">
          DocuSign.io keeps every contract upload tied to your account, protects your session with verified authentication, and gives you a clean dashboard to track what matters.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Sign in <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900">
            Create account
          </Link>
        </div>

        <div className="mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {[
            { icon: FileText, title: 'Fast uploads', text: 'Accept PDF contracts and store them safely in your personal workspace.' },
            { icon: ShieldCheck, title: 'Protected access', text: 'Protected routes and session verification keep unauthorized viewers out.' },
            { icon: Sparkles, title: 'Smooth signing', text: 'Open your documents, place signatures, and return to the dashboard without friction.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-zinc-200 bg-white/90 p-6 text-left shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
                <Icon className="h-5 w-5 text-zinc-800 dark:text-zinc-100" />
                <h2 className="mt-4 text-base font-semibold text-zinc-950 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
