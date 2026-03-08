"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";

export default function CopyInviteLink({ tenantId }: { tenantId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const baseUrl = window.location.origin;

    const inviteLink = `${baseUrl}/register?invitation=${tenantId}`;

    navigator.clipboard.writeText(inviteLink);

    setCopied(true);
    toast.success("Link Undangan berhasil disalin!");

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="h-10 rounded-xl border-2 border-slate-100 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all flex gap-2"
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-500" />
          Tersalin!
        </>
      ) : (
        <>
          <Link2 size={14} />
          Salin Link Undangan Staf
        </>
      )}
    </Button>
  );
}
