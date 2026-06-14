import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/decks", "/study"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function createSupabaseResponse(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  return { supabase, response };
}

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createSupabaseResponse(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    if (pathname === "/login" && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isProtectedPath(pathname) && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/decks/:path*", "/study/:path*", "/login"],
};
