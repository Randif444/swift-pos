"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- BACKEND LAYER (VIBECODING) ---
// Secure Session Termination & Router Cache Invalidation Pipeline
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout"); 
  
  redirect("/login");
}