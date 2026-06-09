'use client';
import { useAuth } from '@/context/AuthContext';
import { FileText, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 shadow-sm shadow-zinc-200/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          {/* Platform Branding */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-950 via-zinc-800 to-zinc-600 text-white shadow-lg shadow-zinc-900/10 transition-transform group-hover:-translate-y-0.5 group-hover:scale-105 dark:from-white dark:via-zinc-100 dark:to-zinc-300 dark:text-zinc-950">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Secure signing</p>
              <span className="font-black text-lg tracking-tight text-black dark:text-white">DocuSign<span className="text-zinc-500 font-medium">.io</span></span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/90 p-1 shadow-inner shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-black/30">
            {user ? (
              <>
                <Link href="/dashboard" className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-white hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white">Dashboard</Link>
                <Link href="/upload-document" className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-white hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white">Upload</Link>
              </>
            ) : (
              <>
                <Link href="/" className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-white hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white">Home</Link>
               {/* <Link href="/login" className="rounded-full px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-white hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white">Sign In</Link> */}
              </>
            )}
          </div>

          {/* Account / Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <User className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 w-10 h-10"
              aria-label="Open navigation menu"
            >
              <span className="block w-5">
                <span className="block h-0.5 w-5 bg-zinc-700 dark:bg-zinc-200 mb-1" />
                <span className="block h-0.5 w-5 bg-zinc-700 dark:bg-zinc-200 mb-1" />
                <span className="block h-0.5 w-5 bg-zinc-700 dark:bg-zinc-200" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="sm:hidden pb-4">
            <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-black/30 backdrop-blur-md p-3">
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition py-2"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/upload-document"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition py-2"
                    >
                      Upload
                    </Link>

                    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <User className="h-4 w-4 text-zinc-500" />
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{user.name}</span>
                    </div>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        await handleLogout();
                      }}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

