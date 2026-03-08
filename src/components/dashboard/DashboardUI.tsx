"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, LayoutGrid, TrendingUp } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardUI({
  tenant,
  totalProducts,
  totalStock,
  transactions,
  totalTransactions,
  revenueToday,
  chartData,
  lowStock,
  growthPercentage,
  topProducts,
}: any) {
  return (
    // REVISI: p-4 untuk mobile agar lega, p-8 untuk desktop
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-white min-h-screen pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          {/* REVISI: text-2xl di mobile agar tidak turun 2 baris */}
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">
            Good Morning, {tenant?.name || "Users"}
          </h2>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
            Berikut ringkasan performa toko Anda hari ini.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card Revenue */}
        <Card className="shadow-sm border border-slate-100 bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Revenue Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {formatCurrency(revenueToday)}
            </div>
            <p
              className={`text-[10px] mt-1 font-bold flex items-center gap-1 ${growthPercentage >= 0 ? "text-emerald-600" : "text-rose-500"}`}
            >
              {growthPercentage >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(growthPercentage).toFixed(1)}%
              <span className="text-slate-400 font-medium ml-1 lowercase">
                vs kemarin
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Card Total Products */}
        <Card className="shadow-sm border border-slate-100 bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {totalProducts}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight">
              {totalStock} items in stock
            </p>
          </CardContent>
        </Card>

        {/* Card Transactions */}
        <Card className="shadow-sm border border-slate-100 bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Transactions
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {totalTransactions}{" "}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tight">
              Sales records today
            </p>
          </CardContent>
        </Card>

        {/* Card Stock Status */}
        <Card className="shadow-sm border border-slate-100 bg-white rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Stock Status
            </CardTitle>
            <LayoutGrid className="h-4 w-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {lowStock.length}
            </div>
            <Badge
              variant={lowStock.length > 0 ? "destructive" : "secondary"}
              className="mt-1 text-[9px] font-black uppercase tracking-wider rounded-lg"
            >
              {lowStock.length > 0 ? "Need Restock" : "Safe Stock"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 shadow-sm border border-slate-100 bg-white rounded-3xl md:rounded-[2rem] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          {/* REVISI: Mengurangi padding kiri grafik di mobile agar ruangnya optimal */}
          <CardContent className="pl-0 md:pl-2">
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    fontSize={10}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8" }}
                    tickFormatter={(val) => val.slice(5)} // Persingkat format tanggal di mobile
                  />
                  <YAxis
                    width={45} // Atur lebar Y-Axis agar tidak memakan ruang
                    fontSize={10}
                    fontWeight={700}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `Rp${v / 1000}k`}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f172a"
                    strokeWidth={4}
                    dot={{
                      r: 4,
                      fill: "#0f172a",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 shadow-sm border border-slate-100 bg-white rounded-3xl md:rounded-[2rem]">
          <CardHeader>
            <CardTitle className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              Top Selling
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Produk paling laku minggu ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {topProducts?.map((item: any, i: number) => (
                <div key={i} className="flex items-center group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 font-black text-slate-400 text-[10px] border border-slate-100 group-hover:bg-white transition-colors uppercase shrink-0">
                    {item?.name?.charAt(0) || "?"}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-bold text-slate-800 truncate group-hover:text-black transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {item.qty} pcs terjual
                    </p>
                  </div>
                  <div className="ml-3 font-black text-xs md:text-sm text-slate-900 shrink-0">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              ))}
              {(!topProducts || topProducts.length === 0) && (
                <p className="text-sm font-medium text-slate-400 text-center py-10 italic">
                  Belum ada penjualan.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border border-slate-100 bg-white rounded-3xl md:rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-black text-slate-900 tracking-tight">
            Recent Activities
          </CardTitle>
          <CardDescription className="text-xs font-medium">
            Transaksi terakhir yang masuk ke sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((trx: any) => (
              <div
                key={trx.id}
                className="flex items-center justify-between p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge
                    variant={trx.type === "OUT" ? "outline" : "secondary"}
                    className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 rounded-md shrink-0"
                  >
                    {trx.type}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-slate-800 truncate group-hover:text-black transition-colors">
                      {trx.product_name}
                    </p>
                    <p className="text-[8px] md:text-[9px] text-slate-400 uppercase font-black tracking-widest truncate">
                      {new Date(trx.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs md:text-sm font-black text-slate-900">
                    {trx.quantity} items
                  </p>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-tight">
                    {formatCurrency(trx.historical_price * trx.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
