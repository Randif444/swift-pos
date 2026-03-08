import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EditProductForm from "./Form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tenantUser } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!tenantUser) redirect("/dashboard/products");

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantUser.tenant_id)
    .single();

  if (!product) redirect("/dashboard/products");

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 md:bg-white min-h-[100dvh] pb-28 md:pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
          Edit Product
        </h1>
        <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
          Perbarui informasi produk{" "}
          <span className="text-slate-900 font-bold">{product.name}</span> Anda.
        </p>
      </div>

      <div className="max-w-4xl">
        <EditProductForm product={product} />
      </div>
    </div>
  );
}
