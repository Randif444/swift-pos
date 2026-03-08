"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStaff } from "@/actions/auth";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function InviteForm({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await registerStaff(formData);

      if (response?.error) {
        toast.error(response.error);
      } else if (response?.success) {
        const email = formData.get("email") as string;
        toast.success("Identity Verified! Silakan cek email untuk kode OTP.");
        router.push(`/register/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem. Coba lagi nanti.");
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
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase text-center md:text-left">
          Join Staff
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium text-center md:text-left">
          Lengkapi profil untuk mulai bekerja
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="space-y-1.5 md:space-y-2">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Access Token
          </label>
          <input
            name="token"
            required
            placeholder="Tempel Token Di Sini"
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-sm md:text-base placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-sm md:text-base placeholder:text-slate-300"
            placeholder="nama@gmail.com"
          />
        </div>

        <div className="space-y-1.5 md:space-y-2">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-sm md:text-base placeholder:text-slate-300"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] md:text-xs transition-all duration-300 hover:bg-black active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Join Now"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleBackAction}
        className="w-full flex justify-center items-center gap-2 h-12 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
      >
        <ArrowLeft size={16} className="w-4 h-4" /> Kembali
      </button>
    </div>
  );
}
