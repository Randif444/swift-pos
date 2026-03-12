"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/actions/auth";
import { toast } from "sonner";
import { AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginForm({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const errorParam = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await loginUser(formData);

      if (response?.error) {
        toast.error(response.error);
      } else if (response?.success) {
        toast.success("Welcome back!");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem yang tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {errorParam === "disabled" && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="text-rose-500 mt-0.5 shrink-0" size={18} />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-rose-700 uppercase tracking-wider">
              Akses Dibatasi
            </p>
            <p className="text-[10px] md:text-[11px] font-bold text-rose-600/80 leading-relaxed">
              Akun sedang dinonaktifkan oleh Owner. Silakan hubungi atasan untuk
              aktivasi kembali.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase text-center md:text-left">
          Sign in
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium text-center md:text-left">
          Access your store dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="space-y-1.5 md:space-y-2">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-base md:text-base placeholder:text-slate-300"
            placeholder="nama@gmail.com"
          />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <KeyRound size={12} className="w-3 h-3 md:w-4 md:h-4" /> Lupa
              Sandi?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            required
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-base md:text-base placeholder:text-slate-300"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] md:text-xs transition-all duration-300 hover:bg-black active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <button
        onClick={handleBackAction}
        className="w-full flex justify-center items-center gap-2 h-12 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
      >
        <ArrowLeft size={16} className="w-4 h-4" /> KEMBALI
      </button>
    </div>
  );
}
