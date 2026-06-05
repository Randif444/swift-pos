"use client";

import * as XLSX from "xlsx";
import { createClient } from "@/utils/supabase/client";

// --- FRONTEND LAYER ---
// Core Spreadsheet Export Utility Function Declaration
export async function exportTransactionsToExcel() {
  const supabase = createClient();

  // --- BACKEND LAYER (VIBECODING) ---
  // Auth Session Credentials Fetching & Multi-Tenant Query Pipeline
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user?.app_metadata?.tenant_id;

  if (!tenantId) return alert("Sesi tidak valid");

  const { data: transactions, error } = await supabase
    .from("inventory_transactions")
    .select("created_at, receipt_number, product_name, type, quantity, historical_price, payment_method")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error || !transactions) return alert("Gagal mengambil data");

  // --- FRONTEND LAYER ---
  // JSON Sheet Mapping, Worksheet Injection & Local Document Generation File
  const reportData = transactions.map((tx) => ({
    "Waktu": new Date(tx.created_at).toLocaleString("id-ID"),
    "No. Struk": tx.receipt_number,
    "Nama Produk": tx.product_name,
    "Tipe": tx.type === "OUT" ? "Penjualan" : "Stok Masuk",
    "Qty": tx.quantity,
    "Harga Satuan": tx.historical_price,
    "Total": tx.quantity * tx.historical_price,
    "Metode": tx.payment_method.toUpperCase()
  }));

 
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");


  XLSX.writeFile(workbook, `Laporan_SwiftPOS_${new Date().toLocaleDateString()}.xlsx`);
}