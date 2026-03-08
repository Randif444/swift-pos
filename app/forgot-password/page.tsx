"use client";

import { useState } from "react";
import { forgotPassword } from "@/actions/auth";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("origin", window.location.origin);

    try {
      await forgotPassword(formData);
      setEmail(formData.get("email") as string);
      setStep(2);
      toast.success("Kode pemulihan telah dikirim ke Gmail Anda.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });

    if (error) {
      toast.error("Kode salah atau kadaluarsa.");
      setLoading(false);
    } else {
      router.push("/dashboard/reset-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl space-y-8">
        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              Lupa Sandi
            </h2>
            <p className="text-slate-400 font-bold text-[10px] mt-2 tracking-widest">
              Masukan email yang terdaftar di akun anda!
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Email Terdaftar
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-4 rounded-2xl border border-slate-200 font-bold"
                placeholder="nama@gmail.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs"
            >
              {loading ? "Mengirim..." : "Kirim Kode Reset"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6 text-center">
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              Verifikasi Kode
            </h2>
            <p className="text-xs text-slate-500 font-bold">
              Masukkan 6 digit kode yang dikirim ke {email}
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="w-full p-4 text-center text-2xl font-black tracking-[0.5em] border-2 border-slate-100 rounded-2xl outline-none focus:border-slate-900"
              placeholder="000000"
            />
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs"
            >
              {loading ? "Memverifikasi..." : "Lanjut Ganti Sandi"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
