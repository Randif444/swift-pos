"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/actions/product";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function EditProductForm({ product }: any) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());

      await updateProduct(product.id, formData);

      toast.success("Product updated successfully");

      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stockColor =
    stock === 0
      ? "bg-rose-50 text-rose-600 border-rose-100"
      : stock < 5
        ? "bg-amber-50 text-amber-600 border-amber-100"
        : "bg-emerald-50 text-emerald-600 border-emerald-100";

  return (
    <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white p-5 md:p-10 shadow-sm md:shadow-2xl md:shadow-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="space-y-2 md:space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
            Product Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-bold text-sm md:text-base text-slate-900 placeholder:text-slate-300"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="space-y-2 md:space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
              Price
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-black text-sm md:text-base text-slate-900"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black shadow-lg">
                {formatCurrency(price)}
              </div>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
              Current Stock
            </label>
            <div className="relative">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-black text-sm md:text-base text-slate-900"
              />
              <div
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase border shadow-sm",
                  stockColor,
                )}
              >
                {stock === 0
                  ? "Out of Stock"
                  : stock < 5
                    ? "Low Stock"
                    : "Healthy"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-6 border-t border-slate-50 gap-3 md:gap-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full md:w-auto py-4 md:py-0 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 md:bg-transparent rounded-xl md:rounded-none active:scale-95 md:active:scale-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-slate-200 md:hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
