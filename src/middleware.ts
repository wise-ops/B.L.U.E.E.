// Lightweight route protection.
// Instead of loading the full auth library (which makes the Edge bundle too
// large for Vercel's free plan), we just check for the session cookie's
// presence here and let the server pages do the real role checks.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // NextAuth v5 stores the session in one of these cookies.
  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  // If not logged in and trying to reach a protected area, send to login.
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*", "/learn/:path*"],
};
