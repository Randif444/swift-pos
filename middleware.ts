import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const url = req.nextUrl.clone();

 
  if (user) {
  
    const { data: userData } = await supabase
      .from("tenant_users")
      .select("status, role")
      .eq("user_id", user.id)
      .single();

    if (userData?.status === "inactive" && url.pathname.startsWith("/dashboard")) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "disabled");
      return NextResponse.redirect(loginUrl);
    }

    
    const isRecoverySession = user.app_metadata?.recovery === true || req.nextUrl.searchParams.has("type") && req.nextUrl.searchParams.get("type") === "recovery";
    
    if (isRecoverySession && !url.pathname.includes("/dashboard/reset-password")) {
      return NextResponse.redirect(new URL("/dashboard/reset-password", req.url));
    }

    
    if (url.pathname === "/login" || url.pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }


  if (!user && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};