import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
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

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantUser?.tenant_id)
    .single();

  return <SettingsForm tenant={tenant} user={user} />;
}
