import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Tina CMS static files (served from public/admin/)
  if (pathname === "/admin/index.html" || pathname.startsWith("/admin/assets/")) {
    return NextResponse.next();
  }

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session");
    const tokenHash = request.cookies.get("admin_token_hash");

    if (!session || !tokenHash) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
