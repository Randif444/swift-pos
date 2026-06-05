"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// --- BACKEND LAYER (VIBECODING) ---
// Staff Access Authorization & Status Mutation Server Action Pipelines
export async function toggleStaffStatus(userId: string, currentStatus: string) {
  const supabase = await createClient();
  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await supabase
    .from("tenant_users")
    .update({ status: nextStatus })
    .eq("user_id", userId);

  if (error) {
    console.error("DB Update Error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/staff");
  return true;
}