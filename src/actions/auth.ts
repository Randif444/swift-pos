"use server";

import { createClient } from "../utils/supabase/server";
import { createAdminClient } from "../utils/supabase/admin";

/* ============================================================
   1. AUTHENTICATION (LOGIN & LOGOUT)
   ============================================================ */

export async function loginUser(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes("Email not confirmed")) {
      return { error: "Email belum diverifikasi. Cek inbox/spam email Akang!" };
    }
    return { error: "Email atau password salah." };
  }

  const { data: userData } = await supabase
    .from("tenant_users")
    .select("status")
    .eq("user_id", authData.user.id)
    .single();

  if (userData?.status === "inactive") {
    await supabase.auth.signOut(); 
    return { error: "Akun Akang sedang dinonaktifkan oleh Owner." };
  }

  return { success: true };
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

/* ============================================================
   2. TENANT REGISTRATION (OWNER BARU)
   ============================================================ */

export async function registerTenant(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const tenantName = formData.get("tenantName") as string;
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { role: "owner" },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  });

  if (authError || !authData.user) return { error: authError?.message || "Gagal mendaftar." };

  const { data: tenantData, error: tenantError } = await adminSupabase
    .from("tenants")
    .insert({ name: tenantName })
    .select()
    .single();
  
  if (tenantError) {
    await adminSupabase.auth.admin.deleteUser(authData.user.id);
    return { error: tenantError.message };
  }

  await adminSupabase.from("tenant_users").insert({
    tenant_id: tenantData.id, 
    user_id: authData.user.id, 
    role: "owner",
    status: "active"
  });

  await adminSupabase.auth.admin.updateUserById(authData.user.id, {
    app_metadata: { tenant_id: tenantData.id, role: "owner" },
    user_metadata: { tenant_id: tenantData.id, role: "owner" } 
  });

  return { success: true };
}

export async function registerUser(formData: FormData) {
  return await registerTenant(formData);
}

/* ============================================================
   3. STAFF REGISTRATION (VERSI ANTI-GAGAL)
   ============================================================ */

export async function registerStaff(formData: FormData) {
  const token = formData.get("token") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  // 1. Validasi Token
  const { data: tokenData, error: tokenError } = await adminSupabase
    .from("invitation_tokens")
    .select("tenant_id, role") 
    .eq("token", token)
    .eq("email", email)
    .eq("is_used", false)
    .single();

  if (tokenError || !tokenData) {
    return { error: "TOKEN TIDAK VALID ATAU EMAIL SALAH!" };
  }

  const targetRole = tokenData.role || "staff";

  // 2. Daftar ke Auth Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        tenant_id: tokenData.tenant_id,
        role: targetRole,
        is_setup_completed: true,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    }
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Proses pendaftaran akun gagal." };
  }

  // 3. Masukkan ke tabel tenant_users
  const { error: relationError } = await adminSupabase.from("tenant_users").insert({
    tenant_id: tokenData.tenant_id, 
    user_id: authData.user.id, 
    role: targetRole,
    status: 'active' 
  });

  if (relationError) {
    await adminSupabase.auth.admin.deleteUser(authData.user.id);
    return { error: "Gagal menyambungkan data staf ke toko." };
  }

  // 4. Update Metadata Admin
  await adminSupabase.auth.admin.updateUserById(authData.user.id, {
    app_metadata: { tenant_id: tokenData.tenant_id, role: targetRole },
    user_metadata: { 
      tenant_id: tokenData.tenant_id, 
      role: targetRole, 
      is_setup_completed: true 
    }
  });

  // 5. Matikan Token
  await adminSupabase.from("invitation_tokens").update({ is_used: true }).eq("token", token);
  
  return { success: true };
}

/* ============================================================
   4. PASSWORD RECOVERY (LUPA SANDI)
   ============================================================ */

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = formData.get("origin") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/dashboard/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };
  return { success: true };
}