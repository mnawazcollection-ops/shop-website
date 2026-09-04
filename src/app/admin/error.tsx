"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, ShieldAlert, Home } from "lucide-react";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Portal Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#0d121f]">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
        Admin Portal Notice
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Management System Error
      </h1>

      <p className="max-w-md text-slate-400 text-sm mb-8">
        An error occurred while loading this administrative console. This could be due to a network interruption or cached session mismatch.
      </p>

      {error?.message && (
        <div className="max-w-lg mb-8 p-3 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono text-red-300 text-left overflow-x-auto">
          {error.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          Reload Component
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
