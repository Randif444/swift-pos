"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Mail, Smartphone, Loader2 } from "lucide-react";

// ==============================================================
// 1. SUB-KOMPONEN: Ini yang mengurus logika dan useSearchParams
// ==============================================================
function VerifyContent() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Sekarang useSearchParams aman karena dipanggil di dalam Suspense
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (error) {
      toast.error("Kode OTP salah atau sudah kadaluarsa!");
      setLoading(false);
    } else {
      toast.success("Akun Aktif! Selamat bergabung");
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl text-center space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="h-20 w-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
        <Mail size={32} />
      </div>

      <div>
        <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">
          Verifikasi Akun Anda
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-3 leading-relaxed">
          Tautan aktivasi telah dikirimkan ke alamat email{" "}
          <span className="text-slate-900 font-bold underline decoration-slate-200 underline-offset-4">
            {email}
          </span>
          . Silakan klik tautan tersebut ATAU masukkan 6 digit kode verifikasi
          di bawah ini:
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <div className="relative">
          <Smartphone
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={20}
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 font-black text-center text-xl tracking-[0.5em] outline-none focus:border-slate-900 transition-all"
            maxLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-black disabled:opacity-50 transition-all active:scale-95 shadow-xl"
        >
          {loading ? "Memverifikasi..." : "Verifikasi Kode"}
        </button>
      </form>

      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Tidak ada email? Cek folder Spam atau tunggu 1 menit.
      </p>
    </div>
  );
}

// ==============================================================
// 2. KOMPONEN UTAMA: Diexport dengan pelindung Suspense
// ==============================================================
export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      {/* Bungkus VerifyContent dengan Suspense. 
        Fallback akan muncul sepersekian detik sebelum email dari URL terbaca. 
      */}
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Memuat data...
            </p>
          </div>
        }
      >
        <VerifyContent />
      </Suspense>
    </div>
  );
}
