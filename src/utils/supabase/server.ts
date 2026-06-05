import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// --- BACKEND LAYER (VIBECODING) ---
// Secure Server-Side Cookies Session Client Initialization Connection Utility
export const createClient = async () => {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value;},
                set(name: string,value: string,options: any) { try { cookieStore.set({name, value,...options }); }catch (error) {}},
                remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options});} catch (error) {}} 
            }
        }
    )
}