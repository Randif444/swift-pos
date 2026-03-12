"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

function RegisterFormInner({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const invitationToken = searchParams.get("invitation");
  const isInvited = !!invitationToken;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      // Tangkap response dari Server Action
      const response = await registerUser(formData);

      // Cek apakah server mengembalikan pesan error
      if (response?.error) {
        toast.error(response.error);
      } else if (response?.success) {
        toast.success("Langkah Terakhir! Silakan aktivasi akun.");
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
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
          {isInvited ? "Join Store" : "Open Store"}
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          {isInvited
            ? "Complete your profile to start working"
            : "Start managing your business in minutes"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        {!isInvited && (
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Store Name
            </label>
            <input
              name="tenantName"
              required={!isInvited}
              placeholder="Masukkan nama toko"
              className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-base md:text-base placeholder:text-slate-300"
            />
          </div>
        )}

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
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-slate-100 px-4 md:px-5 font-bold outline-none focus:border-slate-900 focus:bg-slate-50 transition-all text-base md:text-base placeholder:text-slate-300"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] md:text-xs transition-all duration-300 hover:bg-black active:scale-95 shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? "Processing..." : isInvited ? "Join Now" : "Create Store"}
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

export default function RegisterForm({ onBack }: { onBack?: () => void }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
            Memuat Form...
          </p>
        </div>
      }
    >
      <RegisterFormInner onBack={onBack} />
    </Suspense>
  );
}
