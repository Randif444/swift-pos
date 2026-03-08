"use client";

import { useState } from "react";
import { updatePassword } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Lock, LogOut } from "lucide-react";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await updatePassword(formData);

      toast.success(
        "Sandi berhasil diubah! Mengeluarkan sesi untuk keamanan...",
      );

      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/login?message=password-updated");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-50 md:bg-white flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="w-full max-w-md space-y-8 md:space-y-10 bg-white p-6 md:p-0 rounded-[2rem] md:rounded-none shadow-2xl md:shadow-none animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-3 md:space-y-4">
          <div className="h-16 w-16 md:h-20 md:w-20 bg-emerald-50 text-emerald-500 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-slate-900">
              Sandi Baru
            </h2>
            <p className="text-slate-400 font-bold text-[9px] md:text-[10px] mt-1 md:mt-2 uppercase tracking-widest leading-relaxed">
              Sesi akan otomatis keluar <br className="md:hidden" /> setelah
              berhasil
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Input Sandi Baru
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full h-14 md:h-[72px] rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white font-black outline-none focus:border-slate-900 transition-all text-center tracking-[0.3em] text-lg md:text-xl placeholder:tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 md:h-16 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <LogOut className="w-4 h-4 md:w-5 md:h-5" /> Simpan & Logout
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
