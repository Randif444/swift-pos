import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import StaffTable from "./StaffTable";
import AddStaffDialog from "./AddStaffDialog";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: relation } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  const { data: allUsers } = await supabase
    .from("tenant_users")
    .select("*")
    .eq("tenant_id", relation?.tenant_id);

  const rawStaff = allUsers?.filter((u) => u.user_id !== user.id) || [];

  const staffWithEmails = await Promise.all(
    rawStaff.map(async (staf) => {
      const { data: authData } = await adminSupabase.auth.admin.getUserById(
        staf.user_id,
      );

      return {
        ...staf,
        email: authData?.user?.email || "Email tidak ditemukan",
      };
    }),
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50 md:bg-white min-h-[100dvh] pb-28 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 uppercase">
            Manajemen Staf
          </h2>
          <p className="text-xs md:text-sm font-medium text-slate-500">
            Kelola konfigurasi tim dan pantau status akses secara real-time.
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <AddStaffDialog tenantId={relation?.tenant_id || ""} />
        </div>
      </div>

      <StaffTable staff={staffWithEmails} />
    </div>
  );
}
