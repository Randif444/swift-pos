"use client"; 

import { createClient } from "@/utils/supabase/client";

// --- FRONTEND LAYER ---
// Client-Side Invitation Token Generation & Callback Utility
export async function saveInvitationToken(token: string, email: string, tenantId: string) {
  const supabase = createClient();

  // --- BACKEND LAYER (VIBECODING) ---
  // Database Invitation Security Token Record Insertion Pipeline
  const { data, error } = await supabase
    .from("invitation_tokens")
    .insert([
      {
        token: token,
        email: email,
        tenant_id: tenantId,
        is_used: false,
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  return data;
}