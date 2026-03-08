"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { processCheckout } from "../../../src/actions/transaction";

import NextImage from "next/image";
import { useDebounce } from "../../../hooks/useDebounce";
import { useThrottle } from "../../../hooks/useThrottle";

// REVISI: Import ReceiptModal yang sudah kita buat tadi
import ReceiptModal from "../../../src/components/pos/ReceiptModal";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function POSClient({
  products = [],
  tenant,
}: {
  products: any[] | null;
  tenant: any;
}) {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [showReceipt, setShowReceipt] = useState(false);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [finalReceipt, setFinalReceipt] = useState<any>(null);

  const debouncedSearch = useDebounce(search, 300);

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const throttledAddToCart = useThrottle((product: any) => {
    if (product.stock === 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, 200);

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((item) => item.id !== id);
      return prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item,
      );
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const change = cashAmount - total;

  const closeAndReset = () => {
    setShowReceipt(false);
    setIsSuccess(false);
    setCart([]);
    setCashAmount(0);
    setFinalReceipt(null);
    router.refresh();
  };

  const confirmCheckout = useThrottle(async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (paymentMethod === "cash" && cashAmount < total) {
      return toast.error("Uang pembayaran kurang, Kang!");
    }

    try {
      setLoading(true);
      const result = await processCheckout(
        cart,
        paymentMethod,
        cashAmount,
        paymentMethod === "cash" ? change : 0,
      );

      setFinalReceipt({
        receiptNumber: result.receiptNumber,
        items: [...cart],
        total: total,
        cash: paymentMethod === "cash" ? cashAmount : total,
        change: paymentMethod === "cash" ? change : 0,
        date: new Date().toLocaleString("id-ID"),
      });

      setIsSuccess(true);
      setShowReceipt(false); // Tutup popup pembayaran
      toast.success(`Transaction Success!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, 2000);

  return (
    <>
      <div className="print:hidden p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start bg-slate-50 md:bg-white min-h-[100dvh] pb-40 md:pb-8">
        <div className="col-span-1 md:col-span-12 lg:col-span-8 space-y-6 md:space-y-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">
              {tenant?.name || "Point of Sale"}
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-500">
              Kelola pesanan dan inventaris secara real-time.
            </p>
          </div>

          <div className="relative group/search">
            <input
              placeholder="Cari produk berdasarkan nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 md:p-4 pl-10 md:pl-12 border border-slate-200 rounded-xl md:rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-slate-100 transition-all outline-none text-sm md:text-base font-medium"
            />
            <div className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 md:w-5 md:h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((item, index) => (
              <div
                key={item.id}
                onClick={() => throttledAddToCart(item)}
                className={`group product-card relative rounded-xl md:rounded-2xl border bg-white p-3 md:p-4 transition-all hover:shadow-lg hover:border-slate-300 active:scale-95 cursor-pointer overflow-hidden ${
                  item.stock === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "border-slate-100 shadow-sm"
                }`}
              >
                <div className="mb-2 md:mb-3 aspect-square w-full flex items-center justify-center rounded-lg md:rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors overflow-hidden relative">
                  {item.image_url ? (
                    <NextImage
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority={index < 4}
                    />
                  ) : (
                    <span className="font-black text-slate-400 text-[10px] uppercase">
                      {item.name?.charAt(0) || "?"}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-hidden h-9 md:h-10">
                  <div className="marquee-container w-full whitespace-nowrap overflow-hidden">
                    <p className="marquee-text font-bold text-xs md:text-sm text-slate-800 tracking-tight inline-block">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Stok: {item.stock}
                    </p>
                  </div>
                </div>

                <div className="mt-2 md:mt-4 flex items-center justify-between">
                  <p className="text-xs md:text-sm font-black text-slate-900 truncate pr-1">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="plus-btn shrink-0 bg-slate-100 text-slate-400 p-1.5 md:p-1 rounded-lg transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="cart-section"
          className="col-span-1 md:col-span-12 lg:col-span-4 sticky top-4 md:top-8 scroll-mt-6"
        >
          <div className="rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 bg-white p-5 md:p-6 shadow-sm space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-black tracking-tighter text-slate-900">
                Pesanan Saat Ini
              </h2>
              <span className="text-[9px] md:text-[10px] font-black bg-slate-900 px-2.5 py-1 rounded-lg text-white uppercase tracking-wider">
                {cart.length} Item
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 md:py-16 space-y-2 border-2 border-dashed border-slate-50 rounded-2xl flex flex-col items-center">
                <div className="text-slate-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </div>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium italic">
                  Keranjang belanja masih kosong.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start group"
                  >
                    <div className="space-y-1 w-full pr-3">
                      <p className="text-xs md:text-sm font-bold text-slate-800 leading-tight">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden shrink-0">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="px-3 md:px-2 py-1.5 md:py-1 hover:bg-slate-200 text-slate-600 transition font-black active:scale-90"
                          >
                            -
                          </button>
                          <span className="w-6 md:w-5 text-center text-[10px] md:text-xs font-black text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => throttledAddToCart(item)}
                            className="px-3 md:px-2 py-1.5 md:py-1 hover:bg-slate-200 text-slate-600 transition font-black active:scale-90"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-bold truncate">
                          @ {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm font-black text-slate-900 shrink-0 pt-0.5">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 md:space-y-3 pt-5 md:pt-6 border-t border-dashed border-slate-200">
              <div className="flex justify-between text-[10px] md:text-xs text-slate-500 font-bold">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-lg md:text-xl font-black text-slate-900 tracking-tight pt-1">
                <span>Total Tagihan</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0 || loading}
              onClick={() => setShowReceipt(true)}
              className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-xs md:text-sm bg-slate-900 text-white hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2 group active:scale-95"
            >
              {loading ? "Memproses..." : "Tinjau & Bayar"}
              <svg
                className="group-hover:translate-x-1 transition-transform w-4 h-4 md:w-5 md:h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <div className="print:hidden md:hidden fixed bottom-[88px] left-4 right-4 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl shadow-slate-900/40 z-40 flex items-center justify-between animate-in slide-in-from-bottom-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              {cart.length} Item Tagihan
            </span>
            <span className="text-base font-black tracking-tighter text-white">
              {formatCurrency(total)}
            </span>
          </div>
          <button
            onClick={() => {
              document
                .getElementById("cart-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-emerald-500 text-white h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center gap-2"
          >
            Checkout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* 1. MODAL PEMBAYARAN (Hanya muncul jika belum sukses) */}
      {showReceipt && !isSuccess && (
        <div className="print:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] w-[90vw] md:max-w-[420px] p-6 md:p-8 space-y-5 md:space-y-6 shadow-2xl overflow-hidden border border-slate-100">
            <div className="space-y-5 md:space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  Checkout
                </h2>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Konfirmasi Pembayaran
                </p>
              </div>

              <div className="p-4 md:p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
                <span className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-wider">
                  Tagihan
                </span>
                <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-black text-xs md:text-sm transition-all active:scale-95 ${paymentMethod === "cash" ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 text-slate-400 hover:bg-slate-50"}`}
                >
                  TUNAI
                </button>
                <button
                  onClick={() => setPaymentMethod("qris")}
                  className={`h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-black text-xs md:text-sm transition-all active:scale-95 ${paymentMethod === "qris" ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 text-slate-400 hover:bg-slate-50"}`}
                >
                  QRIS
                </button>
              </div>

              {paymentMethod === "cash" && (
                <input
                  type="number"
                  autoFocus
                  value={cashAmount || ""}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="w-full h-14 md:h-16 border-2 border-slate-100 bg-slate-50 rounded-xl md:rounded-2xl px-4 text-xl md:text-2xl font-black text-center outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 animate-in fade-in zoom-in-95 duration-200"
                  placeholder="Masukan uang tunai..."
                />
              )}

              {paymentMethod === "qris" && (
                <div className="w-full h-14 md:h-16 border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                    Lanjutkan untuk bayar via QRIS
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 h-12 md:h-14 text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-xl transition-all active:scale-95"
                >
                  Batal
                </button>
                <button
                  onClick={confirmCheckout}
                  className="flex-1 h-12 md:h-14 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RECEIPT MODAL: Akan otomatis muncul jika transaksi sukses (isSuccess = true) */}
      <ReceiptModal
        open={isSuccess}
        onOpenChange={(val) => {
          if (!val) closeAndReset();
        }}
        data={finalReceipt}
        tenant={tenant}
      />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .product-card:hover .marquee-text {
          padding-left: 100%;
          animation: marquee 8s linear infinite;
        }
        .product-card:hover .plus-btn {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }
      `}</style>
    </>
  );
}
