"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function updateTenantSettings(formData: FormData) {
  const supabase = await createClient();
  
  const tenantId = formData.get("tenantId") as string;
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const logoFile = formData.get("logo") as File;

  let logoUrl = formData.get("currentLogoUrl") as string;

 
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${tenantId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('tenant-logos')
      .upload(fileName, logoFile);

    if (uploadError) throw new Error("Gagal upload ke Storage: " + uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('tenant-logos')
      .getPublicUrl(fileName);
      
    logoUrl = publicUrl;
  }

 
  const { error } = await supabase
    .from("tenants")
    .update({ 
      name, 
      address, 
      phone,
      logo_url: logoUrl 
    })
    .eq("id", tenantId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/pos");
  revalidatePath("/", "layout");
}


export async function createTenant(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Tidak terautorisasi");

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;

  const { data: tenant, error: tError } = await supabase
    .from("tenants")
    .insert({ name, address, phone })
    .select()
    .single();

  if (tError) throw new Error("Gagal membuat toko: " + tError.message);

  const { error: rError } = await supabase
    .from("tenant_users")
    .insert({
      tenant_id: tenant.id,
      user_id: user.id,
      role: "owner"
    });

  if (rError) throw new Error("Gagal menghubungkan user ke toko: " + rError.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}


export async function inviteStaff(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const tenantId = formData.get("tenantId") as string;

  const { data: userData, error: userError } = await supabase
    .from("profiles") 
    .select("id")
    .eq("email", email)
    .single();

  if (userError || !userData) {
    throw new Error("Email tidak ditemukan. Pastikan kasir sudah mendaftar akun Swift POS.");
  }


  const { error: inviteError } = await supabase
    .from("tenant_users")
    .insert([
      {
        tenant_id: tenantId,
        user_id: userData.id,
        role: "kasir",
      },
    ]);

  if (inviteError) {
    
    if (inviteError.code === '23505') throw new Error("User ini sudah menjadi staf di toko Anda.");
    throw new Error(inviteError.message);
  }

  
  revalidatePath("/dashboard/staff");
}