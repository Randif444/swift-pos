"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

export default function SetupPopup({
  tenant: initialTenant,
  role,
}: {
  tenant: any;
  role: string;
}) {
  const isStaff = role?.toLowerCase() === "staff";
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: initialTenant?.name || "",
    address: initialTenant?.address || "",
    phone: initialTenant?.phone || "",
  });

  useEffect(() => {
    const isDataEmpty = !initialTenant?.address || !initialTenant?.phone;

    if (!isStaff && isDataEmpty) {
      setIsOpen(true);
    }
  }, [initialTenant, isStaff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeTenantId = initialTenant?.id;

    if (!activeTenantId) {
      toast.error("ID Toko tidak ditemukan.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("tenants")
      .update({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      })
      .eq("id", activeTenantId);

    if (error) {
      toast.error("Gagal simpan: " + error.message);
      setLoading(false);
    } else {
      toast.success("Data toko berhasil diperbarui!");
      setIsOpen(false);

      window.location.reload();
    }
  };

  if (isStaff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[90vw] max-w-[600px] border-none rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl bg-white outline-none [&>button]:hidden overflow-y-auto max-h-[90vh]"
      >
        <DialogHeader className="text-left space-y-1 mb-6 md:mb-8 border-b border-slate-50 pb-4 md:pb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-200">
              <Zap size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle className="text-xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                Setup Toko Baru
              </DialogTitle>
              <DialogDescription className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                Wajib dilengkapi sebelum lanjut
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Nama Toko
              </Label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-200 font-bold text-slate-900 text-sm"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Alamat Lengkap
              </Label>
              <Input
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-200 font-bold text-slate-900 text-sm"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                Nomor WhatsApp
              </Label>
              <Input
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-12 md:h-14 rounded-xl md:rounded-2xl border-slate-200 font-bold text-slate-900 text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 md:h-16 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-black active:scale-95 transition-all mt-2 md:mt-4"
          >
            {loading ? "Menyimpan..." : "Konfirmasi Data"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
