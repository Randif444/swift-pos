import { createClient } from "@/utils/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import SetupPopup from "@/components/dashboard/SetupPopup";
import { redirect } from "next/navigation";

// --- FRONTEND LAYER ---
// Core Layout Definition & Type Declarations
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // --- BACKEND LAYER (VIBECODING) ---
  // Auth Session Guard & Tenant Relation Security Processing
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: relations } = await supabase
    .from("tenant_users")
    .select("tenant_id, role")
    .eq("user_id", user.id);

  const relation = relations && relations.length > 0 ? relations[0] : null;

  const role = (
    relation?.role ||
    user?.user_metadata?.role ||
    "owner"
  ).toLowerCase();

  const tenantId = relation?.tenant_id || user?.user_metadata?.tenant_id;

  let tenant = null;

  if (tenantId) {
    const { data } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();

    tenant = data;
  }

  // --- FRONTEND LAYER ---
  // Global Shell Rendering & Component State Injection
  return (
    <>
      <DashboardShell
        userEmail={user.email ?? ""}
        userInitial={user.email?.charAt(0).toUpperCase() ?? "U"}
        logoUrl={tenant?.logo_url}
        role={role}
      >
        {children}
      </DashboardShell>

      <SetupPopup tenant={tenant} role={role} />
    </>
  );
}