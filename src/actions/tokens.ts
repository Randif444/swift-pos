"use client"; 

import { createClient } from "@/utils/supabase/client";

export async function saveInvitationToken(token: string, email: string, tenantId: string) {
  const supabase = createClient();

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