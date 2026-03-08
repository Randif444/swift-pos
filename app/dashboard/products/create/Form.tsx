"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "@/actions/product";
import { optimizeImage } from "@/lib/image-optimizer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImagePlus, X, Loader2 } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function CreateProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar, Kang!");
      return;
    }

    try {
      setIsOptimizing(true);

      const optimized = await optimizeImage(file, 600);

      setImageFile(optimized);
      setImagePreview(URL.createObjectURL(optimized));

      toast.success(
        `Gambar siap! Ukuran: ${(optimized.size / 1024).toFixed(0)} KB`,
      );
    } catch (error) {
      toast.error("Gagal memproses gambar");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || price <= 0) {
      toast.error("Nama dan Harga wajib diisi, Kang!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await addProduct(formData);

      toast.success("Produk berhasil ditambahkan!");
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stockStatus =
    stock === 0 ? "Habis" : stock < 5 ? "Stok Tipis" : "Tersedia";
  const stockColor =
    stock === 0
      ? "bg-rose-50 text-rose-600 border-rose-100"
      : stock < 5
        ? "bg-amber-50 text-amber-600 border-amber-100"
        : "bg-emerald-50 text-emerald-600 border-emerald-100";

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 md:bg-white max-w-5xl mx-auto min-h-[100dvh] pb-28 md:pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
          Tambah Produk
        </h1>
        <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
          Lengkapi data produk untuk inventaris toko Anda.
        </p>
      </div>

      <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white p-5 md:p-10 shadow-sm md:shadow-2xl md:shadow-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
          <div className="space-y-3 md:space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
              Foto Produk (Opsional)
            </label>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="relative h-28 w-28 md:h-40 md:w-40 shrink-0 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group transition-all hover:border-slate-900">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      className="h-full w-full object-cover"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-1 md:gap-2 w-full h-full justify-center">
                    {isOptimizing ? (
                      <Loader2
                        className="text-slate-400 animate-spin"
                        size={24}
                      />
                    ) : (
                      <ImagePlus className="text-slate-300 transition-transform group-hover:scale-110 w-6 h-6 md:w-8 md:h-8" />
                    )}
                    <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest">
                      Pilih Foto
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isOptimizing}
                    />
                  </label>
                )}
              </div>
              <div className="space-y-1 md:space-y-2">
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
                  Saran: Foto Kotak (1:1) <br /> Maksimal 2MB (Akan di-resize
                  otomatis) [cite: 2026-03-06]
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
              Nama Produk
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-bold text-sm md:text-base text-slate-900 placeholder:text-slate-300"
              placeholder="Contoh: Kopi Susu Gula Aren"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-2 md:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
                Harga Jual
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-black text-sm md:text-base text-slate-900"
                  placeholder="0"
                  required
                />
                {price > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black shadow-lg">
                    {formatCurrency(price)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
                Stok Awal
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={stock || ""}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-black text-sm md:text-base text-slate-900"
                  placeholder="0"
                  required
                />
                <div
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase border shadow-sm",
                    stockColor,
                  )}
                >
                  {stockStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-6 border-t border-slate-50 gap-3 md:gap-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full md:w-auto py-4 md:py-0 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 md:bg-transparent rounded-xl md:rounded-none active:scale-95 md:active:scale-100"
            >
              Batalkan
            </button>

            <button
              type="submit"
              disabled={loading || isOptimizing}
              className="w-full md:w-auto md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl md:shadow-2xl shadow-slate-200 md:hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
