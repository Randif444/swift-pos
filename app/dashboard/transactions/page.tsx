import { createClient } from "../../../src/utils/supabase/server";
import { redirect } from "next/navigation";
import ExportButton from "@/components/transactions/ExportButton";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const tenantId = user.app_metadata?.tenant_id;

  if (!tenantId) redirect("/");

  const { data: tenant } = await supabase
    .from("tenants")
    .select("name")
    .eq("id", tenantId)
    .single();

  const { data: transactions } = await supabase
    .from("inventory_transactions")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 md:bg-white min-h-[100dvh] pb-28 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
            Riwayat Transaksi
          </h1>

          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
            Laporan aktivitas {tenant?.name || "Toko"}
          </p>
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          <ExportButton />

          <div className="bg-slate-900 text-white px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black tracking-widest shadow-sm uppercase">
            {transactions?.length || 0} Records
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl md:rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-5 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Waktu
                </th>

                <th className="px-5 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Nomor Struk
                </th>

                <th className="px-5 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Produk & Metode
                </th>

                <th className="px-5 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">
                  Harga Satuan
                </th>

                <th className="px-5 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">
                  Qty
                </th>

                <th className="px-5 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
              {!transactions || transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 md:px-8 py-16 md:py-20 text-center text-slate-400 font-medium italic"
                  >
                    Belum ada data transaksi yang tercatat.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const subtotal = (tx.historical_price || 0) * tx.quantity;

                  const isOut = tx.type === "OUT";

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-5 md:px-8 py-4 md:py-5 text-slate-400 text-[10px] md:text-[11px] font-bold">
                        {new Date(tx.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>

                      <td className="px-5 md:px-8 py-4 md:py-5 font-mono text-[10px] md:text-[11px] text-blue-600 font-black tracking-tight">
                        #{tx.receipt_number || "---"}
                      </td>

                      <td className="px-5 md:px-8 py-4 md:py-5">
                        <div className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                          {tx.product_name || "Produk Tanpa Nama"}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-black uppercase tracking-wider">
                            {tx.payment_method}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 md:px-8 py-4 md:py-5 text-right text-slate-600 font-bold">
                        {formatIDR(tx.historical_price || 0)}
                      </td>

                      <td className="px-5 md:px-8 py-4 md:py-5 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase ${
                            isOut
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {isOut ? "↓" : "↑"} {tx.quantity}
                        </span>
                      </td>

                      <td className="px-5 md:px-8 py-4 md:py-5 text-right font-black text-slate-900 text-sm md:text-base">
                        {formatIDR(subtotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
