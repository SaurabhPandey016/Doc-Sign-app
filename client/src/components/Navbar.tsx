'use client';
import { useAuth } from '@/context/AuthContext';
import { FileText, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:bg-black/80 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Platform Branding */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black transition-transform group-hover:scale-105">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-black dark:text-white">
              DocuSign<span className="text-zinc-500 font-medium">.io</span>
            </span>
          </Link>


          {/* Action Account Details */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {user.name}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm transition hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}