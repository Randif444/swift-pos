"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  restockProduct,
} from "@/actions/product";
import { optimizeImage } from "@/lib/image-optimizer";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  PackagePlus,
  Plus,
  ImagePlus,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductActionsProps {
  mode: "create" | "edit";
  product?: any;
  role: string;
}

export default function ProductActions({
  mode,
  product,
  role,
}: ProductActionsProps) {
  const router = useRouter();

  if (role === "staff") return null;

  const [openMain, setOpenMain] = useState(false);
  const [loadingMain, setLoadingMain] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [openRestock, setOpenRestock] = useState(false);
  const [loadingRestock, setLoadingRestock] = useState(false);
  const [stockAmount, setStockAmount] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null,
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizing(true);
      const optimized = await optimizeImage(file, 600);
      setImageFile(optimized);
      setImagePreview(URL.createObjectURL(optimized));
      toast.success("Foto berhasil dioptimalkan");
    } catch (error) {
      toast.error("Gagal memproses foto produk");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleMainAction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoadingMain(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (mode === "create") {
        await addProduct(formData);
        toast.success("Produk baru berhasil ditambahkan");
        setName("");
        setPrice(0);
        setStock(0);
        setImagePreview(null);
        setImageFile(null);
      } else {
        await updateProduct(product.id, formData);
        toast.success("Data produk diperbarui");
      }

      setOpenMain(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingMain(false);
    }
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(stockAmount);

    if (!amount || amount <= 0)
      return toast.error("Masukkan jumlah stok yang valid");

    try {
      setLoadingRestock(true);
      await restockProduct(product.id, amount);
      toast.success("Stok berhasil diperbarui");
      setOpenRestock(false);
      setStockAmount("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingRestock(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      await deleteProduct(product.id);
      toast.success("Produk berhasil dihapus dari daftar");
      setOpenDelete(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      {mode === "create" ? (
        <button
          onClick={() => setOpenMain(true)}
          className="bg-slate-900 w-full md:w-auto text-white px-6 md:px-8 h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} strokeWidth={3} /> Add Product
        </button>
      ) : (
        <div className="flex gap-3 md:gap-4 items-center justify-end">
          <button
            onClick={() => setOpenRestock(true)}
            className="text-slate-300 hover:text-emerald-500 transition-colors p-1 active:scale-90"
            title="Restock Stok"
          >
            <PackagePlus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setOpenMain(true)}
            className="text-slate-300 hover:text-slate-900 transition-colors p-1 active:scale-90"
            title="Edit Detail"
          >
            <Pencil className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="text-slate-300 hover:text-rose-500 transition-colors p-1 active:scale-90"
            title="Hapus Produk"
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      <Dialog open={openMain} onOpenChange={setOpenMain}>
        <DialogContent className="w-[90vw] md:max-w-md rounded-[2rem] md:rounded-[2.5rem] border-none p-6 md:p-10 gap-6 md:gap-8 shadow-2xl bg-white outline-none max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
              {mode === "create" ? "Create Product" : "Manage Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleMainAction} className="space-y-5 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                Product Photo
              </Label>
              <div className="flex items-center gap-4 md:gap-5">
                <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-[1.5rem] md:rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden group shrink-0">
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
                        className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={24} strokeWidth={3} />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1 w-full h-full justify-center">
                      {isOptimizing ? (
                        <Loader2
                          className="animate-spin text-slate-300"
                          size={24}
                        />
                      ) : (
                        <ImagePlus className="text-slate-300 w-6 h-6 md:w-7 md:h-7" />
                      )}
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
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
                  Format: JPG/PNG <br /> Max: 2MB
                </p>
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                Nama Produk
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 md:h-14 px-4 md:px-6 rounded-xl border-slate-200 font-bold text-sm text-slate-900 bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                  Harga (IDR)
                </Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="h-12 md:h-14 px-4 md:px-6 rounded-xl border-slate-200 font-black text-sm text-slate-900 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                  Stok Awal
                </Label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="h-12 md:h-14 px-4 md:px-6 rounded-xl border-slate-200 font-black text-sm text-slate-900 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 md:gap-3 pt-4 md:pt-6 border-t border-slate-50">
              <button
                type="button"
                onClick={() => setOpenMain(false)}
                className="flex-1 h-12 md:h-14 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loadingMain || isOptimizing}
                className="flex-1 h-12 md:h-14 bg-slate-900 text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 disabled:opacity-50 active:scale-95"
              >
                {loadingMain
                  ? "Proses..."
                  : mode === "create"
                    ? "Tambah"
                    : "Update"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openRestock} onOpenChange={setOpenRestock}>
        <DialogContent className="w-[90vw] md:max-w-[400px] rounded-[2rem] md:rounded-[2.5rem] border-none p-6 md:p-10 shadow-2xl bg-white outline-none">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter">
              Restock Produk
            </DialogTitle>
            <DialogDescription className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 mt-1">
              {product?.name}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleRestock}
            className="space-y-5 md:space-y-6 mt-2 md:mt-4"
          >
            <div className="space-y-2">
              <Label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400">
                Jumlah Stok Baru
              </Label>
              <Input
                type="number"
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
                placeholder="0"
                className="h-12 md:h-14 text-center text-lg md:text-xl font-black rounded-xl border-slate-200"
              />
            </div>
            <button
              type="submit"
              disabled={loadingRestock}
              className="w-full h-12 md:h-14 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all"
            >
              {loadingRestock ? "Proses..." : "Update Stok"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="w-[90vw] md:max-w-[400px] rounded-[2rem] md:rounded-[2.5rem] border-none p-6 md:p-10 shadow-2xl bg-white text-center space-y-4 md:space-y-6">
          <div className="h-16 w-16 md:h-20 md:w-20 bg-rose-50 text-rose-500 rounded-3xl md:rounded-[2rem] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-black uppercase tracking-tighter text-center">
              Hapus Produk?
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-slate-500 font-medium mt-1 md:mt-2 text-center">
              Data produk{" "}
              <span className="font-bold text-slate-900">{product?.name}</span>{" "}
              akan disembunyikan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 md:gap-3 pt-2">
            <button
              onClick={() => setOpenDelete(false)}
              className="flex-1 h-12 md:h-14 font-black uppercase text-[9px] md:text-[10px] text-slate-400 hover:bg-slate-50 rounded-xl active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={loadingDelete}
              className="flex-1 h-12 md:h-14 bg-rose-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 active:scale-95"
            >
              {loadingDelete ? "Menghapus..." : "Ya, Hapus"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Button({ className, ...props }: any) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
