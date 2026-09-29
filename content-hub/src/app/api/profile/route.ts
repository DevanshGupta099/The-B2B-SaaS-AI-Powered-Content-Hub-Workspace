import { NextRequest, NextResponse } from "next/server";
import { serverStore } from "@/lib/server-store";

export async function GET() {
  try {
    const profile = serverStore.getProfile();
    return NextResponse.json({
      success: true,
      profile,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch user profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = serverStore.updateProfile(body);
    
    // Log profile update in backend activity ledger
    serverStore.addActivity({
      user: updated.name,
      action: "updated workspace profile & notification preferences",
      document: "User Settings",
      avatar: updated.avatarUrl
    });

    return NextResponse.json({
      success: true,
      profile: updated,
      message: "Profile preferences synchronized successfully."
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
