import { createClient } from "../../../src/utils/supabase/server";
import POSClient from "./POSClient";

export default async function POSPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User tidak ditemukan");

  const tenantId = user.app_metadata?.tenant_id;

  if (!tenantId) throw new Error("Tenant tidak ditemukan");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("tenant_id", tenantId)
    .is("deleted_at", null);

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  return <POSClient products={products || []} tenant={tenant} />;
}
