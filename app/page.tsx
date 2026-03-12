"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./register/RegisterForm";
import InviteForm from "./register/InviteForm";

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Home() {
  const [mode, setMode] = useState<"none" | "login" | "register" | "invite">(
    "none",
  );

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white px-8 md:px-20 py-8 md:py-20 flex flex-col h-[100dvh] md:h-full relative overflow-hidden">
          <div className="relative z-[60] inline-block px-4 py-1.5 bg-white/10 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase self-start">
            Swift POS
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.05]">
              Manage.
              <br />
              Track.
              <br />
              Grow.
            </h1>
            <p className="mt-5 md:mt-8 text-sm text-slate-300 max-w-[260px] md:max-w-sm font-medium leading-relaxed">
              Modern POS and inventory management system for growing retail
              businesses.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col gap-5">
              <div className="flex flex-row gap-3 md:gap-5">
                <button
                  onClick={() => setMode("register")}
                  className="px-5 md:px-7 py-3 md:py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 flex-1 md:flex-none"
                >
                  Open Store
                </button>
                <button
                  onClick={() => setMode("invite")}
                  className="px-5 md:px-7 py-3 md:py-3.5 rounded-xl border border-white/30 text-white font-bold text-sm transition-all duration-300 hover:bg-white/10 active:scale-95 flex-1 md:flex-none"
                >
                  Join Staff
                </button>
              </div>
              <div>
                <button
                  onClick={() => setMode("login")}
                  className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  Sign in to your account →
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-auto md:mt-0 pt-6">
            <p className="text-[10px] md:text-xs text-slate-500 font-medium">
              © 2026 Swift POS
            </p>
          </div>
        </div>

        <div
          className={`
            overflow-hidden h-[100dvh] md:h-full
            ${mode !== "none" ? "fixed inset-0 z-[100] bg-black/20 md:bg-slate-50 md:relative md:inset-auto" : "relative hidden md:flex bg-slate-50"}
            md:relative md:z-20
          `}
          onClick={() => !isDesktop && mode !== "none" && setMode("none")}
        >
          <div className="absolute left-0 top-0 h-full w-40 pointer-events-none hidden md:block z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-slate-900/5 to-transparent" />
          </div>

          <AnimatePresence mode="wait">
            {mode === "none" && isDesktop && (
              <motion.div
                key="value"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: easing }}
                className="h-full flex flex-col justify-center px-24 relative z-10"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                  WHY SWIFT POS
                </p>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
                  Built for Modern Retail.
                </h2>
                <p className="mt-6 text-sm font-medium text-slate-500 max-w-md">
                  Everything you need to run, monitor, and grow your store in
                  one powerful platform.
                </p>
              </motion.div>
            )}

            {mode !== "none" && (
              <motion.div
                key={mode}
                initial={isDesktop ? { x: 80, opacity: 0 } : { y: "100%" }}
                animate={isDesktop ? { x: 0, opacity: 1 } : { y: 0 }}
                exit={isDesktop ? { x: 80, opacity: 0 } : { y: "100%" }}
                transition={{ duration: 0.5, ease: easing }}
                drag={isDesktop ? false : "y"}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100) setMode("none");
                }}
                onClick={(e) => e.stopPropagation()}
                className={`
                  absolute md:inset-0 md:bg-transparent flex flex-col z-[110] outline-none
                  ${!isDesktop ? "inset-x-0 bottom-0 top-20 bg-white rounded-t-[32px] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]" : "bg-white"}
                `}
              >
                <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
                  <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>

                {/* --- BERITA TV MARQUEE KHUSUS MOBILE DENGAN TEKS ASLI --- */}
                {/* REVISI: overflow-x-hidden overflow-y-visible agar teks tidak terpotong vertikal, dan py-4 untuk ruang napas */}
                <div className="md:hidden w-full overflow-x-hidden overflow-y-visible border-b border-slate-100 bg-slate-50/50 py-4 mb-4 mt-2">
                  <motion.div
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 25,
                      repeat: Infinity,
                    }}
                    className="flex w-max items-center"
                  >
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center whitespace-nowrap"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 leading-normal">
                          WHY SWIFT POS
                        </span>
                        <span className="text-xs font-black text-slate-900 mr-2 leading-normal">
                          Built for Modern Retail.
                        </span>
                        <span className="text-xs font-medium text-slate-500 leading-normal">
                          Everything you need to run, monitor, and grow your
                          store in one powerful platform.
                        </span>
                        <span className="mx-6 text-slate-300 leading-normal">
                          ✦
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                {/* -------------------------------------------------------- */}

                <div className="w-full h-full flex items-center justify-center px-6 md:px-32">
                  <div className="w-full max-w-md py-2 md:py-0 overflow-y-auto max-h-full pb-20 mobile-no-scrollbar">
                    {mode === "login" && (
                      <LoginForm onBack={() => setMode("none")} />
                    )}
                    {mode === "register" && (
                      <RegisterForm onBack={() => setMode("none")} />
                    )}
                    {mode === "invite" && (
                      <InviteForm onBack={() => setMode("none")} />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
