import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SettingsForm from "./SettingsForm";

// --- FRONTEND LAYER ---
// Core Page Component Declaration
export default async function SettingsPage() {
  const supabase = await createClient();

  // --- BACKEND LAYER (VIBECODING) ---
  // Auth Session Guard & Multi-Tenant Profile Fetching Pipeline
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tenantUser } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantUser?.tenant_id)
    .single();

  // --- FRONTEND LAYER ---
  // Passing Synchronized Data to UI Client Presentational Form
  return <SettingsForm tenant={tenant} user={user} />;
}