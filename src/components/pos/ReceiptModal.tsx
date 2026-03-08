"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    items: any[];
    total: number;
    cash: number;
    change: number;
    receiptNumber: string;
    date?: string;
  } | null;
  tenant: any; // Data branding dari Settings
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ReceiptModal({
  open,
  onOpenChange,
  data,
  tenant,
}: ReceiptModalProps) {
  if (!data) return null;

  // REVISI: Fungsi ini didefinisikan di sini agar bisa dipakai di Preview & Print
  const generateReceiptHTML = (isForPrint: boolean) => {
    const containerStyle = isForPrint
      ? "width: 58mm; padding: 4mm; background: #fff; color: #000; font-family: monospace;"
      : "width: 100%; font-family: monospace; color: #0f172a;";

    return `
      <div style="${containerStyle}">
        <div style="text-align: center; margin-bottom: 15px;">
          <div style="display: flex; justify-content: center; margin-bottom: 8px;">
            ${
              tenant?.logo_url
                ? `<img src="${tenant.logo_url}" style="height: 40px; width: auto; filter: grayscale(100%); object-fit: contain;" />`
                : `<div style="height: 40px; width: 40px; border: 2px dashed #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #94a3b8; font-weight: 900;">LOGO</div>`
            }
          </div>
          <div style="font-weight: 900; font-size: 14px; text-transform: uppercase;">
            ${tenant?.name || "SWIFT POS SYSTEM"}
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px; text-transform: uppercase; font-weight: 500;">
            ${tenant?.address || "Alamat belum diatur"}
          </div>
          <div style="font-size: 10px; color: #64748b; font-weight: 500;">
            Telp: ${tenant?.phone || "08xx-xxxx-xxxx"}
          </div>
        </div>

        <div style="border-bottom: 1px dashed #cbd5e1; margin: 12px 0;"></div>

        <div style="font-size: 10px; text-align: left; margin-bottom: 12px;">
          <div style="color: #64748b;">${data.date || new Date().toLocaleString("id-ID")}</div>
          <div style="font-weight: bold; color: #0f172a;">ID: #${data.receiptNumber}</div>
        </div>

        <div style="border-bottom: 1px dashed #cbd5e1; margin: 12px 0;"></div>

        <div style="font-size: 10px; text-align: left;">
          ${data.items
            .map(
              (item) => `
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
              <span style="flex: 1; padding-right: 8px;">${item.name} x${item.qty}</span>
              <span>${formatCurrency(item.price * item.qty)}</span>
            </div>
          `,
            )
            .join("")}
        </div>

        <div style="border-bottom: 1px dashed #cbd5e1; margin: 12px 0;"></div>

        <div style="margin-top: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 900;">
            <span>TOTAL</span>
            <span>${formatCurrency(data.total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 4px; color: #64748b;">
            <span>BAYAR</span>
            <span>${formatCurrency(data.cash)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 900; margin-top: 2px;">
            <span>KEMBALI</span>
            <span>${formatCurrency(data.change)}</span>
          </div>
        </div>

        <div style="margin-top: 24px; text-align: center; font-size: 9px; font-weight: bold; color: #94a3b8;">
          <p style="letter-spacing: 0.2em; text-transform: uppercase;">*** TERIMA KASIH ***</p>
          <p style="font-style: italic;">Barang tidak dapat ditukar</p>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "-1000px";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    doc?.open();
    // Gunakan fungsi generateReceiptHTML(true) untuk versi print
    doc?.write(`
      <html>
        <head>
          <style>
            @page { size: 58mm auto; margin: 0; }
            * { color: black !important; }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => { window.close(); }, 1000);">
          ${generateReceiptHTML(true)}
        </body>
      </html>
    `);
    doc?.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[400px] rounded-[2.5rem] p-6 md:p-10 border-none shadow-2xl bg-white outline-none">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 uppercase text-center">
            Transaksi Berhasil
          </DialogTitle>
        </DialogHeader>

        {/* PREVIEW DI LAYAR: Gunakan fungsi generateReceiptHTML(false) */}
        <div className="bg-[#fdfdfd] border border-slate-200 rounded-[1.5rem] p-6 shadow-inner relative overflow-hidden">
          <div
            dangerouslySetInnerHTML={{ __html: generateReceiptHTML(false) }}
          />
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 md:h-14 border-2 border-slate-100 rounded-xl md:rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all active:scale-95"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 h-12 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Cetak Struk
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
