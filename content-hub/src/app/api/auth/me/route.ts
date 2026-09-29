import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";
import { verifySessionToken } from "@/lib/auth-crypto";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("nexus_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, error: "No active session" }, { status: 401 });
    }

    const { valid, userId } = verifySessionToken(sessionCookie);
    if (!valid || !userId) {
      return NextResponse.json({ authenticated: false, error: "Invalid or expired session token" }, { status: 401 });
    }

    const profile = serverStore.getProfile();
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userId,
        name: profile.name,
        email: profile.email,
        role: profile.role
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to verify session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
