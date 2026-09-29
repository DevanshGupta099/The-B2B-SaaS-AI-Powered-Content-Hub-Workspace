import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limiter";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("nexus_session")?.value;

  // 1. Denial-of-Wallet & AI Abuse Rate Limiter on all /api/ai endpoints
  if (pathname.startsWith("/api/ai")) {
    const clientId = getClientIdentifier(req);
    // Limit to 30 inference requests per rolling 60 seconds per IP or user
    const rateCheck = checkRateLimit(clientId, 30, 60 * 1000);

    if (!rateCheck.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: `AI rate limit exceeded (Denial-of-Wallet protection). Please retry after ${rateCheck.resetSeconds} seconds.`,
          retryAfter: rateCheck.resetSeconds
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": rateCheck.resetSeconds.toString(),
            "X-RateLimit-Limit": rateCheck.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + rateCheck.resetSeconds).toString()
          }
        }
      );
    }
  }

  // 2. Protected paths that require an active session
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
    "/signup",
    "/api/ai/:path*"
  ]
};
