import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("nexus_session")?.value;

    if (!sessionCookie) {
      // Fallback to active profile in serverStore
      const profile = serverStore.getProfile();
      return NextResponse.json({
        authenticated: true,
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role
        }
      });
    }

    const profile = serverStore.getProfile();
    return NextResponse.json({
      authenticated: true,
      user: {
        id: sessionCookie,
        name: profile.name,
        email: profile.email,
        role: profile.role
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
