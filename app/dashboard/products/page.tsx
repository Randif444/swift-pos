import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProductActions from "./ProductActions";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: relation } = await supabase
    .from("tenant_users")
    .select("role, tenant_id")
    .eq("user_id", user.id)
    .single();

  const rawRole = relation?.role || "staff";
  const role = rawRole.toLowerCase();
  const tenantId = relation?.tenant_id;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 md:bg-white min-h-[100dvh] pb-28 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">
            Products
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
            Manage your store inventory
          </p>
        </div>

        <ProductActions mode="create" role={role} />
      </div>

      <div className="rounded-3xl md:rounded-[2rem] border border-slate-100 bg-white shadow-sm w-full overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
            <thead>
              <tr className="border-b bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">
                <th className="px-5 md:px-8 py-4 md:py-5 text-center">
                  Inisial / Foto
                </th>
                <th className="px-5 md:px-8 py-4 md:py-5">Product Name</th>
                <th className="px-5 md:px-8 py-4 md:py-5 text-center">Stock</th>
                <th className="px-5 md:px-8 py-4 md:py-5 text-right">Price</th>
                <th className="px-5 md:px-8 py-4 md:py-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
              {products?.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-5 md:px-8 py-4 md:py-5">
                    <div className="mx-auto flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-slate-50 font-black text-slate-400 text-[10px] border border-slate-100 uppercase overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        item.name?.charAt(0)
                      )}
                    </div>
                  </td>

                  <td className="px-5 md:px-8 py-4 md:py-5 font-bold text-slate-800">
                    {item.name}
                  </td>

                  <td className="px-5 md:px-8 py-4 md:py-5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase ${
                        item.stock <= 5
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>

                  <td className="px-5 md:px-8 py-4 md:py-5 text-right font-black text-slate-900">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </td>

                  <td className="px-5 md:px-8 py-4 md:py-5 text-right">
                    <ProductActions mode="edit" product={item} role={role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
