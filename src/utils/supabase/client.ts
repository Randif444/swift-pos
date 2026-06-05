import { createBrowserClient } from "@supabase/ssr";
 
// --- FRONTEND LAYER ---
// Browser-Side Client Initialization Connection Utility for Web & App Interface
export const createClient = () => {
    return createBrowserClient (
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}