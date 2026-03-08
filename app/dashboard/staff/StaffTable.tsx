"use client";

import { useEffect, useState, useTransition } from "react";
import { Mail, Shield, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function StaffTable({ staff: initialStaff }: { staff: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [staffData, setStaffData] = useState(initialStaff);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    setStaffData(initialStaff);
  }, [initialStaff]);

  const activeStaffCount = staffData.filter(
    (s) => s.status === "active",
  ).length;

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "inactive" ? "active" : "inactive";

    setStaffData((prev) =>
      prev.map((s) =>
        s.user_id === userId ? { ...s, status: nextStatus } : s,
      ),
    );

    startTransition(async () => {
      const { error } = await supabase
        .from("tenant_users")
        .update({ status: nextStatus })
        .eq("user_id", userId);

      if (error) {
        setStaffData((prev) =>
          prev.map((s) =>
            s.user_id === userId ? { ...s, status: currentStatus } : s,
          ),
        );
        toast.error("Gagal update database");
      } else {
        toast.success(
          `Staf kini ${nextStatus === "active" ? "Aktif" : "Nonaktif"}`,
        );
        router.refresh();
      }
    });
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Yakin mau hapus/pecat staf ini, Kang? Data tidak bisa kembali lho!",
      )
    )
      return;
    const { error } = await supabase
      .from("tenant_users")
      .delete()
      .eq("user_id", userId);
    if (!error) {
      setStaffData((prev) => prev.filter((s) => s.user_id !== userId));
      router.refresh();
      toast.success("Staf berhasil dihapus");
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center px-1 md:px-2">
        <div
          className={`p-2.5 px-4 md:p-3 md:px-5 rounded-xl md:rounded-2xl border transition-all duration-500 flex gap-2 md:gap-3 items-center shadow-sm ${
            activeStaffCount > 0
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-rose-50 border-rose-100 text-rose-700"
          }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              activeStaffCount > 0
                ? "bg-emerald-500 animate-pulse"
                : "bg-rose-500"
            }`}
          ></div>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            {activeStaffCount} Active Staff
          </p>
        </div>
      </div>

      <div
        className={`bg-white border border-slate-100 rounded-3xl md:rounded-[2.5rem] shadow-sm overflow-hidden transition-opacity ${isPending ? "opacity-70" : "opacity-100"}`}
      >
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-5 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Identity
                </th>
                <th className="px-5 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Role
                </th>
                <th className="px-5 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Status
                </th>
                <th className="px-5 md:px-10 py-4 md:py-6 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
              {staffData.map((s) => (
                <tr
                  key={s.user_id}
                  className="hover:bg-slate-50/30 group transition-colors"
                >
                  <td className="px-5 md:px-10 py-4 md:py-7">
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="h-10 w-10 md:h-14 md:w-14 bg-slate-900 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white font-black text-lg md:text-xl border-2 border-white shadow-md md:shadow-lg shadow-slate-200 uppercase">
                        {s.email ? s.email.charAt(0) : s.user_id.charAt(0)}
                      </div>
                      <div className="flex flex-col md:gap-0.5">
                        <span className="text-xs md:text-sm font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                          {s.email ? s.email : `ID: ${s.user_id.slice(0, 8)}`}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                          <Mail size={12} className="text-slate-300" />{" "}
                          {s.email ? "Verified" : "Connected"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 md:px-10 py-4 md:py-7">
                    <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100 text-blue-600 font-black text-[9px] md:text-[11px] uppercase tracking-widest">
                      <Shield size={14} className="w-3 h-3 md:w-4 md:h-4" />{" "}
                      {s.role}
                    </div>
                  </td>
                  <td className="px-5 md:px-10 py-4 md:py-7">
                    <div
                      className={`inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full border ${
                        s.status === "inactive"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${s.status === "inactive" ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`}
                      ></div>
                      <span className="font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em]">
                        {s.status === "inactive" ? "Nonaktif" : "Aktif"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 md:px-10 py-4 md:py-7 text-right">
                    <div className="flex justify-end gap-2 md:gap-3">
                      <button
                        onClick={() => handleToggleStatus(s.user_id, s.status)}
                        disabled={isPending}
                        className={`h-9 w-9 md:h-10 md:w-10 border rounded-lg md:rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                          s.status === "inactive"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:text-amber-500"
                        }`}
                        title={
                          s.status === "inactive" ? "Aktifkan" : "Nonaktifkan"
                        }
                      >
                        <Power
                          size={14}
                          strokeWidth={2.5}
                          className="md:w-4 md:h-4"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(s.user_id)}
                        disabled={isPending}
                        className="h-9 w-9 md:h-10 md:w-10 bg-rose-50 border border-rose-100 rounded-lg md:rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                        title="Pecat Staf"
                      >
                        <Trash2
                          size={14}
                          strokeWidth={2.5}
                          className="md:w-4 md:h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
