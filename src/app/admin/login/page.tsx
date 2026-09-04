"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useAdminAuth } from "@/store/AdminAuthContext";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAdminAuth();
  const { success, error: toastError } = useAdminToast();

  const [email, setEmail] = useState("admin@mnawazjewelry.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const res = await login(email, password, rememberMe);
    if (res.success) {
      success("Welcome Back", "Authenticated successfully as Super Admin.");
      router.push("/admin");
    } else {
      setErrorMsg(res.error || "Authentication failed. Please verify credentials.");
      toastError("Access Denied", res.error);
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoLogin();
    success("Demo Access Granted", "Logged in with master administrator privileges.");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0B0F19] to-slate-900 flex flex-col justify-center px-4 py-8 sm:py-12 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      {/* Background ambient gold lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Monogram */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-16 h-16 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-4 border border-amber-300/40 overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="M. Nawaz Jewelry Collection"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <h1 className="font-cormorant text-3xl font-bold tracking-[3px] uppercase text-white">
            M. Nawaz
          </h1>
          <p className="text-xs uppercase tracking-[3px] font-semibold text-amber-400 mt-1">
            Private Atelier • Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sirihsan.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Secure Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Demo Password is: admin123")}
                  className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500/30 accent-amber-600"
                />
                <span>Stay signed in for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold py-3.5 rounded-lg shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 text-xs uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-3">
              Reviewer / Testing Mode Active
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-amber-300 text-xs font-semibold border border-amber-500/30 hover:border-amber-500/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>1-Click Auto Login (Demo Super Admin)</span>
            </button>
          </div>
        </div>

        {/* Back to Store Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            ← Return to M. Nawaz Luxury Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
