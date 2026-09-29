import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("nexus_session")?.value;

  // Protected paths that require an active session
  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/workspace");
  const isAuthPath = pathname === "/login" || pathname === "/signup";

  // Redirect unauthenticated visitors to login
  if (isProtectedPath && !sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already authenticated users from login/signup to dashboard
  if (isAuthPath && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Inject security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/login",
    "/signup"
  ]
};
