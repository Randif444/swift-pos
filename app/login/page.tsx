import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { Suspense } from "react";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    // REVISI: p-4 di mobile, p-6 di desktop agar lega
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-6">
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        {/* REVISI: Dibungkus Suspense agar useSearchParams di LoginForm aman saat di-build */}
        <Suspense
          fallback={
            <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Memuat form...
            </div>
          }
        >
          {/* REVISI: Tidak perlu lagi melempar onBack dari sini */}
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
