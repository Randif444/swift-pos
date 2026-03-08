"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ArrowRightLeft,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { logoutUser } from "@/actions/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardShell({
  children,
  userEmail,
  userInitial,
  logoUrl,
  role,
}: {
  children: React.ReactNode;
  userEmail: string;
  userInitial: string;
  logoUrl?: string | null;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      setConfirmOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Gagal logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigation = [
    {
      group: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          roles: ["owner", "staff"],
        },
      ],
    },
    {
      group: "OPERATIONS",
      items: [
        {
          label: "POS",
          href: "/dashboard/pos",
          icon: ShoppingCart,
          roles: ["owner", "staff"],
        },
        {
          label: "Products",
          href: "/dashboard/products",
          icon: Package,
          roles: ["owner", "staff"],
        },
        {
          label: "Staff",
          href: "/dashboard/staff",
          icon: Users,
          roles: ["owner"],
        },
        {
          label: "Transactions",
          href: "/dashboard/transactions",
          icon: ArrowRightLeft,
          roles: ["owner"],
        },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
          roles: ["owner"],
        },
      ],
    },
  ];

  // Ekstrak semua menu yang diizinkan untuk Bottom Nav di Mobile
  const mobileNavItems = navigation
    .flatMap((section) => section.items)
    .filter((item) => item.roles.includes(role.toLowerCase()));

  return (
    <TooltipProvider delayDuration={0}>
      {/* Container utama diubah jadi flex-col untuk Mobile, dan flex-row untuk Desktop */}
      <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-50 md:bg-white overflow-hidden">
        {/* =========================================
            1. MOBILE TOP HEADER (Hanya Muncul di HP)
            ========================================= */}
        <header className="md:hidden shrink-0 flex items-center justify-between px-5 h-16 bg-white border-b border-slate-100 z-40 shadow-sm">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
            Swift POS
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-900 uppercase leading-none mb-0.5">
                {role}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                {userEmail.split("@")[0]}
              </span>
            </div>
            {/* Tombol Logout pindah ke atas di versi Mobile */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="h-8 w-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
            >
              <LogOut size={14} strokeWidth={3} />
            </button>
          </div>
        </header>

        {/* =========================================
            2. DESKTOP SIDEBAR (Disembunyikan di HP) 
            ========================================= */}
        <aside
          className={cn(
            "hidden md:flex relative border-r border-slate-100 flex-col shrink-0 bg-white transition-all duration-300 ease-in-out",
            isCollapsed ? "w-20" : "w-64",
          )}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-10 h-6 w-6 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
          >
            {isCollapsed ? (
              <ChevronRight size={12} strokeWidth={3} />
            ) : (
              <ChevronLeft size={12} strokeWidth={3} />
            )}
          </button>

          <div className={cn("p-8", isCollapsed && "flex justify-center px-0")}>
            <h2
              className={cn(
                "text-xl font-black tracking-tighter text-slate-900",
                isCollapsed ? "scale-75" : "block",
              )}
            >
              {isCollapsed ? "S-POS" : "Swift POS"}
            </h2>
          </div>

          <nav className="flex-1 px-4 space-y-8 overflow-y-auto pt-4">
            {navigation.map((section) => {
              const filteredItems = section.items.filter((item) =>
                item.roles.includes(role.toLowerCase()),
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={section.group} className="space-y-3">
                  {!isCollapsed && (
                    <p className="px-4 text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase transition-all">
                      {section.group}
                    </p>
                  )}

                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                          pathname.startsWith(item.href));

                      return (
                        <Tooltip key={item.href} delayDuration={0}>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl text-sm font-bold transition-all relative group h-12",
                                isCollapsed
                                  ? "justify-center w-12 mx-auto"
                                  : "px-4 w-full",
                                isActive
                                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900",
                              )}
                            >
                              <item.icon
                                size={20}
                                strokeWidth={isActive ? 3 : 2}
                                className="shrink-0"
                              />

                              {!isCollapsed && (
                                <span className="truncate animate-in fade-in duration-300">
                                  {item.label}
                                </span>
                              )}
                            </Link>
                          </TooltipTrigger>

                          {isCollapsed && (
                            <TooltipContent
                              side="right"
                              sideOffset={15}
                              className="bg-slate-900 text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-xl z-50"
                            >
                              {item.label}
                              <TooltipPrimitive.Arrow className="fill-slate-900" />
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-50">
            <div
              className={cn(
                "flex items-center bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100",
                isCollapsed ? "justify-center" : "justify-between",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black border-2 border-white uppercase">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      className="h-full w-full object-cover"
                      alt="L"
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black text-slate-900 uppercase leading-tight">
                      {role}
                    </span>
                    <span className="text-[8px] text-slate-400 truncate font-bold">
                      {userEmail}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <LogOut size={16} strokeWidth={3} />
                </button>
              )}
            </div>
            {isCollapsed && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="mt-2 w-full flex justify-center p-2 text-red-500 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={16} strokeWidth={3} />
              </button>
            )}
          </div>
        </aside>

        {/* =========================================
            3. MAIN CONTENT (Area Utama)
            ========================================= */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-2 md:pb-0">
          {children}
        </main>

        {/* =========================================
            4. MOBILE BOTTOM NAV (Hanya Muncul di HP)
            ========================================= */}
        <nav className="md:hidden shrink-0 flex items-center justify-around bg-white border-t border-slate-100 h-[72px] px-2 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          {mobileNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-all",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600",
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-200 scale-110 mb-1"
                      : "bg-transparent scale-100",
                  )}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={cn(
                    "text-[9px] font-bold tracking-tight transition-all",
                    isActive ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* =========================================
            5. DIALOG LOGOUT (Shared Desktop & Mobile)
            ========================================= */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none p-10 text-center shadow-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                Keluar Sistem?
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm font-medium text-slate-500 py-6">
              Pastikan semua transaksi kasir sudah tersimpan dengan benar
              sebelum Anda keluar.
            </p>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl py-4 text-sm font-black shadow-xl shadow-red-100 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoggingOut ? "Keluar..." : "Ya, Log Out"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
