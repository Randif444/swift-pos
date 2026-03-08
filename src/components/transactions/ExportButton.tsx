"use client";

import { FileSpreadsheet } from "lucide-react";
import { exportTransactionsToExcel } from "@/actions/export";

export default function ExportButton() {
  return (
    <button
      onClick={() => exportTransactionsToExcel()}
      className="flex items-center justify-center gap-1.5 md:gap-2 bg-emerald-600 text-white h-10 md:h-12 px-3 md:px-5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-600/20 shrink-0"
    >
      <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5 shrink-0" />

      {/* Teks responsif: Di HP cuma "Export", di Desktop "Export Excel" */}
      <span className="md:hidden">Export</span>
      <span className="hidden md:inline">Export Excel</span>
    </button>
  );
}
