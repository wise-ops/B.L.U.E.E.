// Protects app routes — redirects to /login if not signed in.
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/learn/:path*",
  ],
};
