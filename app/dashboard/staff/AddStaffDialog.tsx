"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, ShieldCheck, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { saveInvitationToken } from "@/actions/tokens";

export default function AddStaffDialog({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateRandomToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "SWIFT-";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerate = async () => {
    if (!email) {
      toast.error("Isi email calon staf dulu, Kang!");
      return;
    }
    setLoading(true);
    const token = generateRandomToken();
    try {
      await saveInvitationToken(token, email, tenantId);
      setGeneratedToken(token);
      toast.success("Token akses berhasil dibuat!");
    } catch (err: any) {
      toast.error("Gagal membuat token: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      toast.success("Token disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetDialog = () => {
    setGeneratedToken(null);
    setEmail("");
    setOpen(false);
  };

  if (!mounted) {
    return (
      <Button className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm opacity-50 cursor-not-allowed">
        <UserPlus size={18} /> Tambah Staf Baru
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setGeneratedToken(null);
          setEmail("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto h-12 md:h-auto bg-slate-900 text-white px-6 py-3 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-black shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2">
          <UserPlus size={18} className="w-4 h-4 md:w-5 md:h-5" /> Tambah Staf
          Baru
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] md:max-w-[500px] border border-slate-100 shadow-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 bg-white outline-none">
        <DialogHeader className="flex flex-row items-center gap-4 md:gap-5 mb-6 md:mb-8 border-b border-slate-50 pb-4 md:pb-6 text-left">
          <div className="h-12 w-12 md:h-14 md:w-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 shrink-0">
            <ShieldCheck
              className="text-slate-900 w-6 h-6 md:w-7 md:h-7"
              strokeWidth={2.5}
            />
          </div>

          <div className="flex flex-col">
            <DialogTitle className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none text-slate-900">
              {generatedToken ? "Token Ready" : "Undang Staff"}
            </DialogTitle>

            <p className="text-slate-400 font-bold text-[9px] md:text-[10px] mt-1 uppercase tracking-widest leading-tight">
              {generatedToken
                ? "Berikan kode ini kepada staf"
                : "Berikan akses terbatas ke tim"}
            </p>
          </div>
        </DialogHeader>

        {!generatedToken ? (
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                Email Calon Staff
              </Label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 md:pl-12 h-12 md:h-14 rounded-xl border-slate-200 font-black text-sm text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                  placeholder="email@staff.com"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-12 md:h-14 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all mt-2 md:mt-4"
            >
              {loading ? "Generating..." : "Generate Access"}
            </Button>
          </div>
        ) : (
          <div className="space-y-5 md:space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 md:gap-4">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Unique Access Code
              </span>

              <h3 className="text-xl md:text-3xl font-black tracking-[0.1em] md:tracking-[0.2em] text-slate-900 select-all font-mono text-center">
                {generatedToken}
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <Button
                onClick={copyToken}
                className="w-full md:flex-1 h-12 md:h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Disalin" : "Salin Token"}
              </Button>

              <Button
                onClick={resetDialog}
                variant="outline"
                className="w-full md:w-auto h-12 md:h-14 px-6 rounded-xl border-slate-200 font-black text-[10px] md:text-xs uppercase text-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
              >
                Tutup
              </Button>
            </div>

            <p className="text-center text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-tight">
              *Token hanya berlaku untuk satu kali pendaftaran
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
