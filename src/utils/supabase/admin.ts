import { createClient } from "@supabase/supabase-js";

// --- BACKEND LAYER (VIBECODING) ---
// Secure Bypass Row-Level-Security (RLS) Service Role Admin Client Connection
export const createAdminClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}